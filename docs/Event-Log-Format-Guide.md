# 事件日誌格式輸出 - 使用指南

## 📋 概述

根據 `sampleResult.json` 的格式，game server 現在支持輸出事件日誌格式的遊戲結果。

### 格式特點

**原格式** (舊):
```json
[
  {
    "spin_number": 1,
    "bet_amount": 50,
    "total_win": 100,
    ...
  },
  {
    "spin_number": 2,
    ...
  }
]
```

**事件日誌格式** (新):
```json
{
  "game_id": "PSS-ON-00152",
  "logs": [
    {
      "event": "sendRequest_nodejs_success",
      "url": "https://dev.iplaystar.net/api/signin?...",
      "statusCode": 200,
      "data": {...},
      "time": "2025-10-14T10:00:00.000+08:00",
      "serial": 0
    },
    {
      "event": "connection",
      "message": "Socket connection established.",
      "time": "2025-10-14T10:00:00.100+08:00",
      "serial": 1
    },
    {
      "event": "result",
      "data": {
        "module_id": "BS",
        "credit": 9999950,
        "rng": [17, 54, 70, 48, 22, 26, 14, 11],
        "win": 100,
        "next_module": "BS",
        "jp_count": 0,
        "jp": 0
      },
      "time": "2025-10-14T10:00:01.000+08:00",
      "serial": 2
    },
    {
      "event": "reconnected_Result",
      "data": {
        "module_id": "BS",
        "credit": 9999900,
        "rng": [36, 5, 56, 68, 31, 36, 14, 62],
        "win": 0,
        "winLineGrp": [...],
        "multiplierAlone": 1,
        "mulitplierPattern": [1, 1, 1, ...],
        "next_module": "BS",
        "winBonusGrp": [],
        "jp_count": 0,
        "jp": 0
      },
      "time": "2025-10-14T10:00:03.000+08:00",
      "serial": 3
    },
    {
      "event": "disconnection",
      "message": "Connection Closed !!",
      "time": "2025-10-14T10:01:00.000+08:00",
      "serial": 104
    }
  ]
}
```

---

## 🎯 主要特性

### 1. 事件類型

| 事件類型 | 說明 | 包含資訊 |
|---------|------|---------|
| `sendRequest_nodejs_success` | 登入請求成功 | URL, statusCode, access_token |
| `connection` | WebSocket 連接建立 | message |
| `result` | 遊戲結果（簡化） | module_id, credit, rng, win, next_module, jp |
| `reconnected_Result` | 重連後的結果（完整） | 上述 + winLineGrp, multiplierAlone, mulitplierPattern, winBonusGrp |
| `disconnection` | 連接斷開 | message |

### 2. 時間戳格式

```
2025-10-14T10:00:00.123+08:00
```

- ISO 8601 格式
- 包含時區 (+08:00)
- 精確到毫秒

### 3. Serial 編號

每個事件都有唯一的序號（serial），從 0 開始遞增。

---

## 🚀 使用方法

### 方法 1: 使用模擬器

```python
from simulation.simulator import GameSimulator, SimulationConfig

# 創建模擬器
simulator = GameSimulator()

# 配置
config = SimulationConfig(
    total_spins=100,
    base_bet=50,
    player_initial_credit=1000000
)

# 執行模擬並輸出 JSON
result, json_files = simulator.run_simulation_with_json_export(
    config=config,
    export_json=True,
    output_dir="game_output"
)

# 檢查輸出檔案
if json_files:
    print(f"事件日誌檔案: {json_files['event_log']}")
```

### 方法 2: 直接使用 Exporter

```python
from protocol.event_log_exporter import EventLogExporter, export_simulation_to_event_log

# 準備遊戲結果數據
results = [
    {
        "module_id": "BS",
        "player_balance": 10000000,
        "rng": [17, 54, 70, 48, 22, 26, 14, 11],
        "total_win": 173,
        "next_module": "BS",
        "jp_count": 0,
        "jp": 0,
        "win_lines": [...]
    },
    # ... 更多結果
]

# 輸出為事件日誌格式
output_file = export_simulation_to_event_log(
    results=results,
    output_path="output/event_log.json",
    game_id="PSS-ON-00152",
    add_connection_events=True,
    reconnect_interval=50  # 每50個spin模擬一次斷線重連
)

print(f"✅ 輸出完成: {output_file}")
```

### 方法 3: 手動構建

```python
from protocol.event_log_exporter import EventLogExporter
from datetime import datetime

# 創建 exporter
exporter = EventLogExporter(
    game_id="PSS-ON-00152",
    start_time=datetime.now()
)

# 添加登入事件
exporter.add_signin_event(member_id="player001")

# 添加連線事件
exporter.add_connection_event()

# 添加遊戲結果
game_result = {
    "module_id": "BS",
    "player_balance": 10000000,
    "rng": [17, 54, 70, 48, 22, 26, 14, 11],
    "total_win": 173,
    ...
}
exporter.add_result_event(game_result, is_reconnected=False)

# 添加重連結果（包含完整資訊）
exporter.add_result_event(game_result, is_reconnected=True)

# 添加斷線事件
exporter.add_disconnection_event()

# 輸出檔案
output_file = exporter.export_to_json("output/custom_log.json")
```

---

## 📊 輸出範例

### 快速測試

```bash
# 執行測試腳本
cd gameServer
python test_event_log_export.py
```

輸出結果：
```
✅ 事件日誌格式已保存:
   event_log: C:\projects\game152Dev\gameServer\test_output\event_log_results.json

📄 檢查事件日誌格式...
   ✅ game_id: PSS-ON-00152
   ✅ logs 數量: 106
   ✅ 第一個事件: sendRequest_nodejs_success
   ✅ 第二個事件: connection
   ✅ 第三個事件: result
```

### 生成100筆 Spin 結果

```python
from simulation.simulator import GameSimulator, SimulationConfig

simulator = GameSimulator()
config = SimulationConfig(total_spins=100, base_bet=50)

result, json_files = simulator.run_simulation_with_json_export(
    config=config,
    export_json=True,
    output_dir="game_output"
)

# 輸出包含：
# - batch_results_*.json (原格式)
# - summary_report_*.json (統計報告)
# - event_log_results.json (事件日誌格式) ✨新增
```

---

## 🔧 配置選項

### reconnect_interval

控制模擬斷線重連的頻率：

```python
export_simulation_to_event_log(
    results=results,
    output_path="output.json",
    reconnect_interval=50  # 每50個spin一次重連
)
```

- 較小的值 (10-20): 更頻繁的重連，檔案更大，更真實
- 較大的值 (100-200): 較少重連，檔案更小
- `None` 或 `0`: 不模擬重連（只有初始連線和最終斷線）

### add_connection_events

是否添加連線/斷線事件：

```python
export_simulation_to_event_log(
    results=results,
    output_path="output.json",
    add_connection_events=True  # 添加連線事件
)
```

- `True`: 完整模擬，包含登入、連線、斷線
- `False`: 只有 `result` 事件

---

## 📁 檔案結構

執行 `run_simulation_with_json_export()` 後，會在輸出目錄生成：

```
game_output/
├── batch_results_20251014_112350_100_spins.json   # 原格式批次結果
├── summary_report_1760412230.json                  # 統計摘要
└── event_log_results.json                          # 事件日誌格式 ✨新增
```

---

## 🎨 數據映射

### 內部格式 → 事件日誌格式

| 內部欄位 | 事件日誌欄位 | 說明 |
|---------|-------------|------|
| `player_balance` 或 `credit` | `credit` | 玩家餘額 |
| `total_win` 或 `win` | `win` | 贏分 |
| `rng` 或 `strip_positions` | `rng` | RNG 數值 |
| `module_id` | `module_id` | 模組 ID (BS/FS) |
| `next_module` | `next_module` | 下一個模組 |
| `win_lines` | `winLineGrp` | 贏線資訊（僅重連） |
| `multiplier` | `multiplierAlone` | 倍率（僅重連） |
| `multiplier_pattern` | `mulitplierPattern` | 倍率陣列（僅重連） |
| `win_bonus` | `winBonusGrp` | Bonus 資訊（僅重連） |

### WinLine 格式

```python
# 內部格式
{
    "line_no": 0,
    "symbol_id": 7,
    "positions": [0, 1, 2],
    "win_amount": 100,
    "multiplier": 1
}

# 轉換為
{
    "win_line_type": 0,
    "line_no": 0,
    "symbol_id": 7,
    "pos": [0, 1, 2],
    "credit": 100,
    "mul": 1,
    "change": false,
    "symbol_id_s": 7,
    "is_five_line": false
}
```

---

## ✅ 驗證

### 檢查事件日誌格式

```python
import json

with open("game_output/event_log_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 檢查結構
assert "game_id" in data
assert "logs" in data
assert len(data["logs"]) > 0

# 檢查事件類型
events = [log["event"] for log in data["logs"]]
assert "connection" in events
assert "result" in events

# 檢查時間戳格式
first_log = data["logs"][0]
assert "time" in first_log
assert "+08:00" in first_log["time"]

# 檢查 serial 連續性
serials = [log["serial"] for log in data["logs"]]
assert serials == list(range(len(serials)))

print("✅ 格式驗證通過！")
```

---

## 🔄 與 sampleResult.json 對比

### 完全相容

事件日誌格式完全遵循 `docs/sampleResult.json` 的結構：

1. ✅ 頂層 `game_id` 和 `logs`
2. ✅ 事件類型：`connection`, `result`, `reconnected_Result`, `disconnection`, `sendRequest_nodejs_success`
3. ✅ 時間戳格式：ISO 8601 with timezone
4. ✅ Serial 連續編號
5. ✅ `result` vs `reconnected_Result` 的資訊差異
6. ✅ 所有欄位名稱和結構

### 測試驗證

```bash
# 執行測試
python test_event_log_export.py

# 應該看到
✅ 第一個 reconnected_Result 事件:
   - 包含 winLineGrp: True
   - 包含 multiplierAlone: True
   - 包含 mulitplierPattern: True

✅ 事件日誌格式驗證通過！
```

---

## 📝 注意事項

1. **拼寫**: `mulitplierPattern` (不是 `multiplierPattern`)
   - 這是為了與 `sampleResult.json` 保持一致

2. **reconnected_Result vs result**:
   - `result`: 簡化格式，只有基本資訊
   - `reconnected_Result`: 完整格式，包含 winLineGrp 等

3. **時區**: 固定使用 `+08:00`（台北時區）

4. **RNG 陣列**: 長度可能為 5-8（根據遊戲狀態）

---

## 🎯 最佳實踐

### 1. 測試用途
```python
# 小量測試：不需要太多事件
config = SimulationConfig(total_spins=100)
reconnect_interval = 50  # 2個重連事件
```

### 2. 真實模擬
```python
# 大量測試：模擬真實斷線情況
config = SimulationConfig(total_spins=10000)
reconnect_interval = 50  # 200個重連事件
```

### 3. 純結果導出
```python
# 只要結果，不要連線事件
export_simulation_to_event_log(
    results=results,
    output_path="results_only.json",
    add_connection_events=False
)
```

---

## 🔗 相關檔案

- **Exporter 實現**: `gameServer/protocol/event_log_exporter.py`
- **測試腳本**: `gameServer/test_event_log_export.py`
- **參考格式**: `docs/sampleResult.json`
- **Simulator 整合**: `gameServer/simulation/simulator.py` (第 542-560 行)

---

**更新日期**: 2025-10-14  
**版本**: 1.0  
**狀態**: ✅ 已測試通過
