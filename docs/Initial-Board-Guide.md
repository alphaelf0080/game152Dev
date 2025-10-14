# 初始盤面系統使用指南

## 概述

初始盤面系統用於在遊戲啟動時顯示一個預設的遊戲畫面，然後在玩家按下 Spin 按鈕後無縫切換到模擬的 JSON 數據。

## 系統架構

```
遊戲啟動
    ↓
載入初始盤面 (initial_board.json)
    ↓
顯示初始畫面
    ↓
玩家按下 Spin
    ↓
切換到模擬數據 (batch_results.json)
    ↓
正常遊戲流程
```

## 檔案結構

### 1. 初始盤面 JSON

**位置**: `gameServer/game_output/initial_board.json`

**格式**:
```json
{
  "session_info": {
    "session_id": 0,
    "description": "初始盤面數據",
    "version": "1.0"
  },
  "initial_state": {
    "msgid": 107,
    "status_code": 0,
    "result": {
      "module_id": "00152",
      "credit": 0,
      "random_syb_pattern": [
        [8, 3, 4],
        [2, 7, 6],
        [7, 2, 5],
        [1, 6, 9],
        [8, 2, 8]
      ],
      "win_line": [],
      "win_bonus_group": []
    },
    "player_cent": 1000000,
    "next_module": "BS",
    "cur_module_play_times": 0,
    "cur_module_total_times": 0,
    "accounting_sn": 0
  }
}
```

### 2. 模擬數據 JSON

**位置**: `gameServer/game_output/batch_results_*.json`

**用途**: 包含實際的遊戲結果序列，供 Spin 後使用

## 核心模組

### InitialBoardLoader

**位置**: `pss-on-00152/assets/script/config/InitialBoardLoader.ts`

**功能**:
- 載入初始盤面 JSON
- 轉換數據格式（JSON → Proto Long）
- 提供初始盤面數據給遊戲

**主要方法**:
```typescript
// 載入初始盤面
await InitialBoardLoader.loadInitialBoard();

// 載入並顯示
await InitialBoardLoader.loadAndDisplay();

// 獲取遊戲格式數據
const boardData = InitialBoardLoader.getGameFormatBoard();

// 檢查是否已載入
const isReady = InitialBoardLoader.isInitialBoardLoaded();
```

## 使用方法

### 方法 1：URL 參數（推薦）

使用預設的初始盤面：

```
http://localhost:7456/?localServer=true&sim_mode=local_json
```

使用自定義初始盤面：

```
http://localhost:7456/?localServer=true&sim_mode=local_json&initial_board=http://localhost:9000/my_initial_board.json
```

支援的初始盤面參數：
- `initial_board`
- `initialBoard`
- `init_board`

### 方法 2：修改預設路徑

在 `InitialBoardLoader.ts` 中修改：

```typescript
private static DEFAULT_INITIAL_BOARD_URL = "http://localhost:9000/initial_board.json";
```

### 方法 3：程式化設置

```typescript
import { InitialBoardLoader } from "./config/InitialBoardLoader";

// 在遊戲初始化時
const success = await InitialBoardLoader.loadAndDisplay();

if (success) {
    console.log("初始盤面載入成功");
}
```

## 完整工作流程

### 1. 準備數據檔案

```bash
cd gameServer

# 生成模擬數據（用於 Spin）
python main.py --json --spins 100

# 初始盤面已經準備好在 game_output/initial_board.json
```

### 2. 啟動 JSON 伺服器

```bash
cd gameServer
python serve_json.py 9000 game_output
```

或使用快速啟動：

```bash
python quick_start.py
```

### 3. 啟動遊戲

在瀏覽器中訪問：

```
http://localhost:7456/?localServer=true&sim_mode=local_json
```

### 4. 遊戲流程

1. **遊戲載入**：顯示初始盤面（來自 `initial_board.json`）
2. **第一次 Spin**：使用模擬數據第 1 個結果（來自 `batch_results.json`）
3. **後續 Spin**：依序使用模擬數據第 2, 3, 4... 個結果
4. **循環模式**：數據用完後自動從第 1 個重新開始

## 數據格式說明

### Symbol 排列

`random_syb_pattern` 是一個 5x3 的陣列：

```javascript
[
  [8, 3, 4],  // 第 1 軸（左）
  [2, 7, 6],  // 第 2 軸
  [7, 2, 5],  // 第 3 軸
  [1, 6, 9],  // 第 4 軸
  [8, 2, 8]   // 第 5 軸（右）
]
```

每個數字代表一個 Symbol ID：

| ID | Symbol |
|----|--------|
| 1-9 | 普通 Symbol |
| 10+ | 特殊 Symbol（Wild, Scatter 等） |

### 玩家餘額

`player_cent` 以最小單位表示：

```javascript
player_cent: 1000000  // = 10000.00 元（假設 1 cent = 0.01）
```

### 獲勝資訊

初始盤面通常不包含獲勝：

```javascript
{
  "credit": 0,          // 獲勝金額
  "win_line": [],       // 獲勝線
  "win_bonus_group": [] // 獎勵群組
}
```

## 自定義初始盤面

### 創建自己的初始盤面

1. 複製 `initial_board.json`
2. 修改 `random_syb_pattern` 為想要的排列
3. 修改 `player_cent` 為初始餘額
4. 儲存為新檔案（例如 `my_initial_board.json`）

### 範例：創建一個有 Wild 的初始盤面

```json
{
  "initial_state": {
    "result": {
      "random_syb_pattern": [
        [10, 3, 4],  // 第 1 軸有 Wild (ID=10)
        [2, 10, 6],  // 第 2 軸有 Wild
        [7, 2, 10],  // 第 3 軸有 Wild
        [1, 6, 9],
        [8, 2, 8]
      ]
    }
  }
}
```

### 使用自定義盤面

```
http://localhost:7456/?localServer=true&initial_board=http://localhost:9000/my_initial_board.json&sim_mode=local_json
```

## 調試資訊

### 控制台日誌

成功載入時會看到：

```
[StateConsole] 🎮 開始遊戲初始化流程...
[SimulatedResultHandler] 初始化本地 JSON 模式
[InitialBoardLoader] 🔄 正在載入初始盤面...
[InitialBoardLoader] ✅ 初始盤面載入成功
[InitialBoardLoader] 盤面: [[8,3,4],[2,7,6],[7,2,5],[1,6,9],[8,2,8]]
[InitialBoardLoader] 玩家餘額: 1000000
[StateConsole] ✅ 初始盤面載入完成
[StateConsole] 🎮 本地模式：準備顯示初始盤面
```

### 檢查載入狀態

在瀏覽器控制台執行：

```javascript
// 檢查初始盤面是否載入
const { InitialBoardLoader } = require('./config/InitialBoardLoader');
console.log('已載入:', InitialBoardLoader.isInitialBoardLoaded());

// 獲取快取的盤面
const board = InitialBoardLoader.getCachedBoard();
console.log('盤面:', board);
```

## 常見問題

### Q: 初始盤面沒有顯示？

**A**: 檢查以下項目：
1. JSON 伺服器是否運行（`http://localhost:9000`）
2. URL 參數是否正確（包含 `localServer=true`）
3. 瀏覽器控制台是否有錯誤訊息
4. `initial_board.json` 檔案格式是否正確

### Q: 如何驗證初始盤面已載入？

**A**: 查看控制台日誌，應該看到：
```
[InitialBoardLoader] ✅ 初始盤面載入成功
```

### Q: 第一次 Spin 使用的是哪個數據？

**A**: 第一次 Spin 會使用模擬數據的第 1 個結果，不是初始盤面。初始盤面只用於顯示遊戲開始時的畫面。

### Q: 可以讓第一次 Spin 也使用初始盤面嗎？

**A**: 可以，將初始盤面數據也加入到模擬數據的第一個結果中：

```python
# 在生成 batch_results.json 時
results = [
    initial_board_result,  # 第一個結果使用初始盤面
    spin_result_1,
    spin_result_2,
    ...
]
```

### Q: 初始盤面載入失敗會怎樣？

**A**: 系統會使用硬編碼的預設盤面：

```typescript
{
    random_syb_pattern: [
        [8, 3, 4],
        [2, 7, 6],
        [7, 2, 5],
        [1, 6, 9],
        [8, 2, 8]
    ],
    credit: 0,
    player_cent: 1000000
}
```

## 進階功能

### 1. 多個初始盤面

創建多個初始盤面檔案，根據不同場景使用：

```
initial_board_clean.json      // 乾淨的盤面
initial_board_near_win.json   // 接近獲勝的盤面
initial_board_bonus.json      // 有獎勵符號的盤面
```

使用：

```
http://localhost:7456/?initial_board=http://localhost:9000/initial_board_near_win.json
```

### 2. 動態生成初始盤面

使用 Python 腳本生成：

```python
import json
import random

def generate_initial_board():
    # 隨機生成 5x3 的盤面
    pattern = []
    for _ in range(5):
        column = [random.randint(1, 9) for _ in range(3)]
        pattern.append(column)
    
    board = {
        "session_info": {
            "session_id": 0,
            "description": "隨機生成的初始盤面"
        },
        "initial_state": {
            "result": {
                "module_id": "00152",
                "credit": 0,
                "random_syb_pattern": pattern,
                "win_line": [],
                "win_bonus_group": []
            },
            "player_cent": 1000000
        }
    }
    
    with open('game_output/initial_board_random.json', 'w') as f:
        json.dump(board, f, indent=2)

generate_initial_board()
```

### 3. 整合測試場景

將初始盤面與特定的測試場景結合：

```
# 測試大獎場景
1. 初始盤面：接近大獎的排列
2. 第一次 Spin：觸發大獎
3. 後續 Spin：正常遊戲

# 測試 Free Spin 場景
1. 初始盤面：有 2 個 Scatter
2. 第一次 Spin：再來 1 個 Scatter 觸發 Free Spin
3. 後續 Spin：Free Spin 結果序列
```

## 性能考慮

1. **快取機制**：初始盤面載入後會快取，避免重複請求
2. **異步載入**：使用 async/await，不阻塞遊戲啟動
3. **錯誤處理**：載入失敗時自動使用預設盤面
4. **記憶體**：初始盤面數據很小（< 1KB），對記憶體影響極小

## 總結

初始盤面系統提供了：

✅ **乾淨的開始**：遊戲啟動時顯示預設畫面  
✅ **無縫銜接**：與模擬數據完美配合  
✅ **靈活配置**：支援 URL 參數和自定義檔案  
✅ **容錯機制**：載入失敗時有預設盤面  
✅ **易於調試**：詳細的控制台日誌  

---

**文檔版本**: 1.0  
**最後更新**: 2025-10-14  
**相關文檔**: 
- `Simulator-Quick-Start.md`
- `SIMULATOR_GUIDE.md`
- `Simulator-System-Summary.md`
