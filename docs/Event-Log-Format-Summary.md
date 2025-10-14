# 事件日誌格式輸出 - 快速總結

## ✅ 已完成

根據 `docs/sampleResult.json` 的格式，game server 現在支持輸出事件日誌格式的遊戲結果。

---

## 📋 格式對比

### 原格式 (舊)
```json
[
  {"spin_number": 1, "bet_amount": 50, "total_win": 100},
  {"spin_number": 2, "bet_amount": 50, "total_win": 0}
]
```

### 事件日誌格式 (新) ✨
```json
{
  "game_id": "PSS-ON-00152",
  "logs": [
    {"event": "connection", "message": "...", "time": "...", "serial": 0},
    {"event": "result", "data": {...}, "time": "...", "serial": 1},
    {"event": "disconnection", "message": "...", "time": "...", "serial": 2}
  ]
}
```

---

## 🚀 快速使用

### 1. 執行測試
```bash
cd gameServer
python test_event_log_export.py
```

### 2. 在程式中使用
```python
from simulation.simulator import GameSimulator, SimulationConfig

simulator = GameSimulator()
config = SimulationConfig(total_spins=100, base_bet=50)

result, json_files = simulator.run_simulation_with_json_export(
    config=config,
    export_json=True,
    output_dir="game_output"
)

# 檢查輸出
print(f"事件日誌: {json_files['event_log']}")
```

### 3. 輸出檔案
```
game_output/
├── batch_results_*.json       # 原格式
├── summary_report_*.json      # 統計
└── event_log_results.json     # 事件日誌格式 ✨新增
```

---

## 🎯 事件類型

| 事件 | 說明 | 資訊 |
|-----|------|-----|
| `sendRequest_nodejs_success` | 登入 | URL, access_token |
| `connection` | 連線 | message |
| `result` | 遊戲結果（簡化） | module_id, credit, rng, win |
| `reconnected_Result` | 重連結果（完整） | 上述 + winLineGrp, multiplierAlone |
| `disconnection` | 斷線 | message |

---

## 📊 測試結果

```
✅ game_id: PSS-ON-00152
✅ logs 數量: 106
✅ 第一個事件: sendRequest_nodejs_success
✅ 第二個事件: connection
✅ 第三個事件: result
✅ 第一個 reconnected_Result 事件:
   - 包含 winLineGrp: True
   - 包含 multiplierAlone: True
   - 包含 mulitplierPattern: True

✅ 事件日誌格式驗證通過！
```

---

## 🔧 新增檔案

1. **`protocol/event_log_exporter.py`** (380 行)
   - EventLogExporter 類
   - export_simulation_to_event_log() 函數
   - 完整的事件日誌生成邏輯

2. **`test_event_log_export.py`** (120 行)
   - 測試腳本
   - 驗證輸出格式
   - 範例程式碼

3. **`docs/Event-Log-Format-Guide.md`** (550 行)
   - 完整使用指南
   - API 文檔
   - 範例和最佳實踐

---

## 🔄 修改檔案

**`simulation/simulator.py`**
- 新增: 導入 event_log_exporter
- 修改: run_simulation_with_json_export() 方法
- 新增: 事件日誌格式輸出（第 542-560 行）

---

## ✨ 特性

1. ✅ 完全相容 sampleResult.json 格式
2. ✅ 支持連線/斷線事件模擬
3. ✅ 自動生成時間戳（ISO 8601 + 時區）
4. ✅ Serial 連續編號
5. ✅ 支持 result 和 reconnected_Result 兩種格式
6. ✅ 可配置重連間隔
7. ✅ 自動轉換內部數據格式

---

## 📖 完整文檔

詳細使用方法請參考: `docs/Event-Log-Format-Guide.md`

---

**實現日期**: 2025-10-14  
**測試狀態**: ✅ 通過  
**版本**: 1.0
