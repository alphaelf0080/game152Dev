# 🎮 初始盤面系統 - 快速參考

## 5 分鐘快速開始

### 1️⃣ 生成初始盤面

```bash
cd gameServer
python generate_initial_boards.py
```

這會生成 10 種預設的初始盤面檔案。

### 2️⃣ 啟動 JSON 伺服器

```bash
python serve_json.py 9000 game_output
```

### 3️⃣ 使用初始盤面

在瀏覽器中訪問：

```
http://localhost:7456/?localServer=true&sim_mode=local_json
```

預設會使用 `initial_board.json`。

---

## 常用 URL 格式

### 使用預設初始盤面

```
http://localhost:7456/?localServer=true&sim_mode=local_json
```

### 指定初始盤面

```
http://localhost:7456/?localServer=true&initial_board=http://localhost:9000/initial_board_wild.json&sim_mode=local_json
```

### 指定模擬數據

```
http://localhost:7456/?localServer=true&initial_board=http://localhost:9000/initial_board.json&sim_mode=local_json&sim_json=http://localhost:9000/batch_results_500_spins.json
```

---

## 可用的初始盤面

| 檔案名稱 | 說明 | 適用場景 |
|---------|------|---------|
| `initial_board.json` | 乾淨的盤面 | 一般開始 |
| `initial_board_wild.json` | 包含 Wild | 展示 Wild 功能 |
| `initial_board_scatter.json` | 2 個 Scatter | 接近 Free Spin |
| `initial_board_near_win.json` | 接近獲勝 | 營造緊張感 |
| `initial_board_high_value.json` | 高價值符號 | 展示高價值 |
| `initial_board_demo.json` | 演示用 | 截圖/宣傳 |
| `initial_board_symmetrical.json` | 對稱排列 | 視覺美觀 |
| `initial_board_low_balance.json` | 低餘額 | 測試警告 |
| `initial_board_high_balance.json` | 高餘額 | 測試大額 |
| `initial_board_random.json` | 隨機生成 | 每次不同 |

---

## URL 參數速查

| 參數 | 值 | 說明 |
|------|-----|------|
| `localServer` | `true` | 啟用本地伺服器模式 |
| `sim_mode` | `local_json` | 啟用模擬器模式 |
| `initial_board` | URL | 指定初始盤面路徑 |
| `sim_json` | URL | 指定模擬數據路徑 |
| `sim_loop` | `true`/`false` | 是否循環使用數據 |

---

## 工作流程

```
遊戲啟動
    ↓
載入 initial_board.json ← 顯示初始畫面
    ↓
玩家按 Spin
    ↓
使用 batch_results.json 第 1 個結果
    ↓
玩家再按 Spin
    ↓
使用第 2 個結果
    ↓
繼續...
```

---

## 控制台日誌檢查

### ✅ 成功載入

```
[InitialBoardLoader] 🔄 正在載入初始盤面...
[InitialBoardLoader] ✅ 初始盤面載入成功
[InitialBoardLoader] 盤面: [[8,3,4],[2,7,6],[7,2,5],[1,6,9],[8,2,8]]
[StateConsole] ✅ 初始盤面載入完成
```

### ❌ 載入失敗

```
[InitialBoardLoader] ❌ 載入初始盤面失敗
[InitialBoardLoader] 將使用預設盤面
```

---

## 自定義初始盤面

### 1. 複製模板

```bash
cp game_output/initial_board.json game_output/my_board.json
```

### 2. 編輯 JSON

修改 `random_syb_pattern`：

```json
{
  "initial_state": {
    "result": {
      "random_syb_pattern": [
        [你的, 排列, 這裡],
        [第2, 軸排, 列值],
        [第3, 軸排, 列值],
        [第4, 軸排, 列值],
        [第5, 軸排, 列值]
      ]
    }
  }
}
```

### 3. 使用自定義盤面

```
http://localhost:7456/?initial_board=http://localhost:9000/my_board.json&localServer=true&sim_mode=local_json
```

---

## Symbol ID 對照

| ID | Symbol | 說明 |
|----|--------|------|
| 1-9 | 普通符號 | 一般 Symbol |
| 10 | Wild | 萬用符號 |
| 11 | Scatter | 觸發 Free Spin |
| 12+ | 特殊符號 | 遊戲特有功能 |

---

## 常見問題快速解答

### Q: 初始盤面沒有顯示？
**A**: 檢查 JSON 伺服器是否運行 (`localhost:9000`)

### Q: 如何生成更多初始盤面？
**A**: 運行 `python generate_initial_boards.py`

### Q: 第一次 Spin 使用什麼數據？
**A**: 使用模擬數據的第 1 個結果，不是初始盤面

### Q: 如何驗證載入成功？
**A**: 查看控制台日誌，應該有 "✅ 初始盤面載入成功"

---

## 快速命令

```bash
# 生成所有初始盤面
python generate_initial_boards.py

# 啟動伺服器
python serve_json.py 9000 game_output

# 或使用快速啟動
python quick_start.py
```

---

## 相關文檔

- 📚 **詳細指南**: `docs/Initial-Board-Guide.md`
- 🚀 **快速開始**: `docs/Simulator-Quick-Start.md`
- 📖 **完整說明**: `docs/SIMULATOR_GUIDE.md`

---

**快速連結**: [生成初始盤面](#1️⃣-生成初始盤面) · [啟動伺服器](#2️⃣-啟動-json-伺服器) · [使用盤面](#3️⃣-使用初始盤面)
