# 遊戲模擬器使用指南

本模擬器允許您選擇使用開發伺服器的遊戲結果，或使用本地預先生成的 JSON 檔案進行測試。

## 功能特性

1. **伺服器模式（預設）**：連接到開發伺服器獲取實時遊戲結果
2. **本地 JSON 模式**：使用預先生成的 JSON 檔案模擬遊戲結果
3. **URL 參數配置**：無需修改代碼即可切換模式
4. **循環播放**：JSON 結果用完後可自動重新開始

## 使用方法

### 方法 1：使用伺服器模式（預設）

正常啟動遊戲，不需要任何額外參數：

```
http://localhost:7456/
```

### 方法 2：使用本地 JSON 模式

在 URL 中添加參數 `sim_mode=local_json`：

```
http://localhost:7456/?sim_mode=local_json
```

### 方法 3：指定自定義 JSON 檔案路徑

```
http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/my_custom_results.json
```

### 方法 4：關閉循環模式

```
http://localhost:7456/?sim_mode=local_json&sim_loop=false
```

## URL 參數說明

| 參數 | 值 | 說明 |
|------|-----|------|
| `sim_mode` | `server` 或 `local_json` | 選擇結果來源模式 |
| `sim_json` | URL 路徑 | 指定 JSON 檔案的位置（僅在 local_json 模式下有效） |
| `sim_loop` | `true` 或 `false` | 是否循環使用 JSON 結果 |

## JSON 檔案格式

JSON 檔案應該遵循以下格式（與 gameServer 生成的格式相同）：

```json
{
  "session_info": {
    "session_id": 1760349018,
    "start_time": "2025-10-13T17:50:18",
    "end_time": "2025-10-13T17:50:25",
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
        "random_syb_pattern": [[8, 3, 4], [2, 7, 6], [7, 2, 5], [1, 6, 9], [8, 2, 8]],
        "win_line": [],
        "win_bonus_group": []
      },
      "player_cent": 999900,
      "next_module": "BS",
      "cur_module_play_times": 1,
      "cur_module_total_times": 1,
      "accounting_sn": 17603490180001
    }
  ]
}
```

## 代碼整合

### 在 ProtoConsole.ts 中整合

在 `ResultCall` 函數中添加檢查：

```typescript
import { shouldUseSimulatedResult, getSimulatedResult } from "../config/SimulatedResultHandler";

let ResultCall = function (buy) {
    // ... 現有的 ResultCall 代碼 ...
    
    // 檢查是否使用模擬結果
    if (shouldUseSimulatedResult()) {
        console.log("[ProtoConsole] 使用本地 JSON 模擬結果");
        // 異步獲取模擬結果並直接觸發 ResultRecall 處理
        setTimeout(() => {
            const simulatedResult = getSimulatedResult();
            if (simulatedResult) {
                // 模擬伺服器回應事件
                const mockEvent = { data: simulatedResult };
                ResultRecall(mockEvent);
            }
        }, 100); // 模擬網絡延遲
        return;
    }
    
    // 正常的伺服器請求
    console.log("ResultCall");
    const message = Proto.encodeResultCall(msg);
    bksend(message);
};
```

### 在遊戲初始化時載入

在 `StateConsole.ts` 的 `NetInitReady` 或類似的初始化函數中：

```typescript
import { initializeSimulator } from "../config/SimulatedResultHandler";

async NetInitReady() {
    // 初始化模擬器（如果需要）
    await initializeSimulator();
    
    // ... 現有的初始化代碼 ...
}
```

## 實際使用範例

### 範例 1：測試連續 500 次旋轉

1. 使用 gameServer 生成 500 次旋轉的 JSON 檔案：
   ```bash
   cd gameServer
   python main.py --json --spins 500
   ```

2. 複製生成的 JSON 檔案到 Web 伺服器：
   ```bash
   cp game_output/batch_results_*.json ../public/test_results.json
   ```

3. 在瀏覽器中使用：
   ```
   http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/test_results.json
   ```

### 範例 2：測試特定的遊戲場景

1. 手動創建或編輯 JSON 檔案，包含特定的測試場景（如大獎、Free Spin 觸發等）

2. 使用該檔案進行測試：
   ```
   http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/special_scenarios.json
   ```

## 調試資訊

模擬器會在瀏覽器控制台輸出詳細的調試資訊：

- `[SimulatorConfig]`：配置相關訊息
- `[JsonDataLoader]`：JSON 載入和數據相關訊息
- `[SimulatedResultHandler]`：模擬結果處理訊息

## 注意事項

1. **檔案大小**：大型 JSON 檔案（如 10,000+ spins）可能需要較長的載入時間
2. **記憶體使用**：所有結果都會載入到記憶體中，請注意檔案大小
3. **索引管理**：當前實現會按順序使用 JSON 中的結果
4. **網絡延遲**：本地模式不會有真實的網絡延遲

## 故障排除

### 問題：JSON 檔案無法載入

**解決方案**：
- 檢查 JSON 檔案路徑是否正確
- 確認 Web 伺服器正在運行
- 檢查瀏覽器控制台的 CORS 錯誤

### 問題：結果用完後停止

**解決方案**：
- 確認 `sim_loop=true`（或不設置，預設為 true）
- 檢查 JSON 檔案是否包含足夠的結果

### 問題：無法切換回伺服器模式

**解決方案**：
- 移除 URL 中的 `sim_mode` 參數
- 或設置 `sim_mode=server`
- 刷新頁面

## 開發建議

1. **版本控制**：將測試用的 JSON 檔案加入 `.gitignore`
2. **環境變數**：可以根據環境自動選擇模式
3. **性能監控**：監控本地模式和伺服器模式的性能差異
4. **自動化測試**：使用本地 JSON 模式進行自動化 UI 測試

## 未來擴展

可能的未來功能：

- [ ] 支援多個 JSON 檔案的隨機切換
- [ ] 支援實時編輯 JSON 結果
- [ ] 支援錄製和回放遊戲會話
- [ ] 支援條件過濾（如只使用獲勝的 spin）
- [ ] 支援統計分析（RTP、命中率等）
