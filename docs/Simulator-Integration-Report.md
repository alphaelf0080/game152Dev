# 遊戲模擬器整合完成報告

## 概述

已成功將遊戲模擬器系統整合到 `pss-on-00152` 專案中。此系統允許在不修改核心遊戲邏輯的前提下，通過 URL 參數切換使用開發伺服器或本地預先生成的 JSON 結果檔案。

## 新增檔案

### TypeScript 檔案（pss-on-00152 專案）

1. **assets/script/config/SimulatorConfig.ts**
   - 配置管理器，處理模擬器模式和參數
   - 支援 URL 參數解析（sim_mode, sim_json, sim_loop）
   - 提供單例模式訪問

2. **assets/script/config/JsonDataLoader.ts**
   - 負責載入和管理批次 JSON 結果檔案
   - 提供格式轉換（JSON → Proto Long 格式）
   - 支援自動循環播放

3. **assets/script/config/SimulatedResultHandler.ts**
   - 統一協調器，整合配置和數據載入
   - 提供簡單的 API 供其他模組使用
   - 包含全局輔助函數

4. **assets/script/config/SIMULATOR_GUIDE.md**
   - 完整的使用說明文件
   - 包含所有使用範例和故障排除

### Python 檔案（gameServer 專案）

5. **gameServer/serve_json.py**
   - 簡單的 HTTP 伺服器腳本
   - 支援 CORS，允許跨域訪問
   - 用於提供 JSON 結果檔案

6. **gameServer/test_simulator_config.py**
   - 快速測試腳本
   - 驗證 JSON 檔案格式
   - 顯示測試 URL 並啟動伺服器

## 修改的檔案

### 1. ProtoConsole.ts

**位置**: `pss-on-00152/assets/script/MessageController/ProtoConsole.ts`

**修改內容**:
- 添加 import: `import { shouldUseSimulatedResult, getSimulatedResult } from "../config/SimulatedResultHandler"`
- 修改 `ResultCall` 函數，在發送網絡請求前檢查是否使用模擬結果
- 如果使用模擬模式，直接調用 `ResultRecall` 處理模擬數據

**修改代碼**:
```typescript
// 在 ResultCall 函數中添加
if (shouldUseSimulatedResult()) {
    console.log("[ProtoConsole] 使用本地 JSON 模擬結果");
    setTimeout(() => {
        const simulatedResult = getSimulatedResult();
        if (simulatedResult) {
            const mockEvent = { data: simulatedResult };
            ResultRecall(mockEvent);
        } else {
            console.error("[ProtoConsole] 無法獲取模擬結果");
        }
    }, 100);
    return;
}
```

### 2. StateConsole.ts

**位置**: `pss-on-00152/assets/script/MessageController/StateConsole.ts`

**修改內容**:
- 添加 import: `import { initializeSimulator } from '../config/SimulatedResultHandler'`
- 將 `NetInitReady` 函數改為 async
- 在函數開始時調用 `await initializeSimulator()`

**修改代碼**:
```typescript
async NetInitReady() {
    // 初始化模擬器（如果需要）
    await initializeSimulator();
    
    // ... 其餘原有代碼 ...
}
```

### 3. DataController.ts

**位置**: `pss-on-00152/assets/script/DataController.ts`

**修改內容**:
- 添加兩個靜態屬性用於配置

**修改代碼**:
```typescript
export class Data {
    static USE_LOCAL_JSON: boolean = false;
    static LOCAL_JSON_PATH: string = "http://localhost:9000/batch_results.json";
    // ... 其餘原有代碼 ...
}
```

## 使用方法

### 1. 啟動 JSON 伺服器

在 `gameServer` 目錄下運行：

```bash
# 使用預設設定（端口 9000，提供 game_output 目錄）
python test_simulator_config.py

# 或手動啟動
python serve_json.py 9000 game_output
```

### 2. 生成測試數據（如果需要）

```bash
cd gameServer
python main.py --json --spins 500
```

這會在 `game_output` 目錄下生成 JSON 檔案，例如：
- `batch_results_20251013_175018_500_spins.json`

### 3. 啟動遊戲

在 Cocos Creator 中啟動遊戲預覽（通常在 `localhost:7456`）

### 4. 使用不同模式

#### 伺服器模式（預設）
```
http://localhost:7456/
```

#### 本地 JSON 模式（使用預設路徑）
```
http://localhost:7456/?sim_mode=local_json
```

#### 指定 JSON 檔案
```
http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/batch_results_20251013_175018_500_spins.json
```

#### 關閉循環模式
```
http://localhost:7456/?sim_mode=local_json&sim_loop=false
```

## URL 參數說明

| 參數 | 值 | 預設值 | 說明 |
|------|-----|--------|------|
| `sim_mode` | `server` 或 `local_json` | `server` | 選擇結果來源 |
| `sim_json` | URL | `http://localhost:9000/batch_results.json` | JSON 檔案路徑 |
| `sim_loop` | `true` 或 `false` | `true` | 是否循環使用結果 |

## 工作流程

### 伺服器模式流程
```
用戶點擊 Spin
    ↓
ResultCall 檢查模式 → 使用伺服器
    ↓
bksend(message) 發送到 WebSocket
    ↓
伺服器返回結果
    ↓
ResultRecall 處理結果
```

### 本地 JSON 模式流程
```
遊戲初始化
    ↓
NetInitReady → initializeSimulator()
    ↓
讀取 URL 參數 → 載入 JSON 檔案
    ↓
用戶點擊 Spin
    ↓
ResultCall 檢查模式 → 使用本地 JSON
    ↓
從 JSON 獲取下一個結果
    ↓
setTimeout 模擬網絡延遲
    ↓
直接調用 ResultRecall 處理結果
```

## 數據格式

### JSON 檔案結構
```json
{
  "session_info": {
    "session_id": 1760349018,
    "start_time": "2025-10-13T17:50:18",
    "total_spins": 500
  },
  "results": [
    {
      "spin_number": 1,
      "bet_amount": 100,
      "msgid": 107,
      "status_code": 0,
      "result": {
        "module_id": "00152",
        "credit": 0,
        "random_syb_pattern": [[8,3,4],[2,7,6],...],
        "win_line": [],
        "win_bonus_group": []
      },
      "player_cent": 999900,
      "next_module": "BS"
    }
  ]
}
```

### Proto 格式轉換

JsonDataLoader 會將 JSON 中的數字轉換為 Proto 使用的 Long 格式：

```typescript
// JSON 中的普通數字
"credit": 12345

// 轉換為 Long 格式
{
  low: 12345,
  high: 0,
  unsigned: true
}
```

## 調試資訊

模擬器會在瀏覽器控制台輸出詳細的調試資訊：

```
[SimulatorConfig] 初始化配置...
[SimulatorConfig] 模式: LOCAL_JSON
[SimulatorConfig] JSON 路徑: http://localhost:9000/batch_results.json
[JsonDataLoader] 正在載入 JSON 檔案...
[JsonDataLoader] 成功載入 500 個結果
[ProtoConsole] 使用本地 JSON 模擬結果
[JsonDataLoader] 返回結果 #1/500
```

## 優點

1. **非侵入式**: 不需要修改核心遊戲邏輯
2. **靈活切換**: 通過 URL 參數輕鬆切換模式
3. **可重現性**: 使用相同的 JSON 檔案可重現測試場景
4. **易於測試**: 適合自動化測試和 QA 流程
5. **性能分析**: 可用於比較不同結果序列的性能表現

## 注意事項

1. **CORS 問題**: 確保 JSON 伺服器支援 CORS
2. **檔案大小**: 大型 JSON 檔案可能需要較長載入時間
3. **記憶體使用**: 所有結果會載入到記憶體中
4. **索引管理**: 目前按順序使用結果，未來可擴展為隨機或條件過濾

## 測試建議

### 基本功能測試
1. 測試伺服器模式正常運作
2. 測試本地 JSON 模式能正確載入和使用結果
3. 測試循環模式（結果用完後重新開始）
4. 測試非循環模式（結果用完後停止）

### 錯誤處理測試
1. JSON 檔案不存在或無法訪問
2. JSON 格式錯誤
3. JSON 結果數量為 0
4. 網絡連接問題

### 性能測試
1. 載入大型 JSON 檔案（1000+ spins）
2. 連續快速旋轉
3. 記憶體使用監控

## 未來擴展

可能的未來功能：

- [ ] 支援多個 JSON 檔案的隨機切換
- [ ] 支援實時編輯 JSON 結果
- [ ] 支援錄製和回放遊戲會話
- [ ] 支援條件過濾（如只使用獲勝的 spin）
- [ ] 支援統計分析（RTP、命中率等）
- [ ] UI 控制面板，無需修改 URL
- [ ] 結果搜尋和跳轉功能

## 故障排除

### 問題：JSON 檔案無法載入

**可能原因**:
- JSON 伺服器未啟動
- CORS 配置問題
- 檔案路徑錯誤

**解決方案**:
1. 確認 JSON 伺服器正在運行
2. 檢查瀏覽器控制台的錯誤訊息
3. 驗證 JSON 檔案路徑

### 問題：結果用完後停止

**可能原因**:
- 循環模式被關閉
- JSON 檔案結果數量不足

**解決方案**:
1. 確認 URL 中沒有 `sim_loop=false`
2. 生成更多結果數據

### 問題：格式錯誤

**可能原因**:
- JSON 檔案格式不正確
- 欄位缺失或類型錯誤

**解決方案**:
1. 使用 `test_simulator_config.py` 驗證 JSON 檔案
2. 確認 JSON 檔案由 `protocol/json_exporter.py` 生成

## 總結

遊戲模擬器系統已成功整合，提供了靈活的測試和開發工具。通過簡單的 URL 參數即可在真實伺服器和本地模擬結果之間切換，大幅提升了開發和測試效率。

所有核心功能已實現並可立即使用。詳細使用說明請參考 `SIMULATOR_GUIDE.md`。
