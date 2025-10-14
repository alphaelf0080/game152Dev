# 簡化數據格式輸出 - 使用指南

## 📋 概述

Game server 現在輸出簡化的遊戲結果格式，只保留 `data: {}` 部分，不包含事件日誌包裝。

---

## 🎯 輸出格式

### 格式結構

```json
[
  {
    "module_id": "BS",
    "credit": 9999950,
    "rng": [17, 54, 70, 48, 22, 26, 14, 11],
    "win": 173,
    "winLineGrp": [
      {
        "win_line_type": 0,
        "line_no": 65535,
        "symbol_id": 7,
        "pos": [14, 24, 5],
        "credit": 173,
        "multiplier": 1,
        "credit_long": {
          "low": 173,
          "high": 0,
          "unsigned": true
        }
      }
    ],
    "multiplierAlone": 1,
    "mulitplierPattern": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "next_module": "BS",
    "winBonusGrp": [],
    "jp_count": 0,
    "jp": 0
  },
  {
    "module_id": "BS",
    "credit": 9999900,
    "rng": [36, 5, 56, 68, 31, 36, 14, 62],
    "win": 0,
    "winLineGrp": [],
    "multiplierAlone": 1,
    "mulitplierPattern": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "next_module": "BS",
    "winBonusGrp": [],
    "jp_count": 0,
    "jp": 0
  }
]
```

### 欄位說明

| 欄位 | 類型 | 說明 |
|-----|------|------|
| `module_id` | string | 模組 ID (BS: Base Game, FS: Free Spins) |
| `credit` | number | 玩家餘額 |
| `rng` | number[] | RNG 數值陣列 (5-8 個元素) |
| `win` | number | 本次贏分 |
| `winLineGrp` | object[] | 贏線資訊陣列 |
| `multiplierAlone` | number | 單獨倍率 (預設 1) |
| `mulitplierPattern` | number[] | 倍率陣列 (20 個元素，預設全為 1) |
| `next_module` | string | 下一個模組 |
| `winBonusGrp` | object[] | Bonus 資訊陣列 |
| `jp_count` | number | JP 次數 |
| `jp` | number | JP 金額 |

---

## 🚀 使用方法

### 方法 1: 執行測試

```bash
cd gameServer
python test_simple_data_export.py
```

輸出檔案: `test_output/game_results.json`

### 方法 2: 使用模擬器

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

# 執行模擬並輸出
result, json_files = simulator.run_simulation_with_json_export(
    config=config,
    export_json=True,
    output_dir="game_output"
)

# 獲取簡化格式檔案
simple_file = json_files["game_results"]
print(f"簡化格式: {simple_file}")
```

### 方法 3: 直接使用 Exporter

```python
from protocol.simple_data_exporter import export_simulation_to_simple_data

# 準備結果數據
results = [
    {
        "module_id": "BS",
        "player_balance": 10000000,
        "rng": [17, 54, 70, 48, 22, 26, 14, 11],
        "total_win": 173,
        "next_module": "BS",
        "jp_count": 0,
        "jp": 0,
        "multiplier": 1,
        "win_lines": [...]
    },
    # ... 更多結果
]

# 輸出簡化格式
output_file = export_simulation_to_simple_data(
    results=results,
    output_path="output/game_results.json"
)

print(f"✅ 輸出完成: {output_file}")
```

---

## 📊 輸出檔案

執行 `run_simulation_with_json_export()` 會產生 3 種格式：

```
game_output/
├── game_results.json                               # ✨ 簡化格式（主要）
├── batch_results_20251014_112921_100_spins.json   # 原格式（備用）
├── summary_report_1760412561.json                  # 統計報告
└── event_log_results.json                          # 事件日誌格式（備用）
```

### 檔案說明

| 檔案 | 格式 | 用途 |
|-----|------|------|
| `game_results.json` | 簡化數據格式 | **主要輸出**，只含 data 物件陣列 |
| `batch_results_*.json` | 原格式 | 備用，包含 spin_number 等額外資訊 |
| `summary_report_*.json` | 統計報告 | RTP、贏率等統計資訊 |
| `event_log_results.json` | 事件日誌 | 完整事件流，含連線/斷線 |

---

## 🎨 WinLineGrp 結構

### 完整範例

```json
{
  "winLineGrp": [
    {
      "win_line_type": 0,
      "line_no": 65535,
      "symbol_id": 7,
      "pos": [14, 24, 5, 15, 16],
      "credit": 173,
      "multiplier": 1,
      "credit_long": {
        "low": 173,
        "high": 0,
        "unsigned": true
      }
    }
  ]
}
```

### 欄位說明

| 欄位 | 類型 | 說明 |
|-----|------|------|
| `win_line_type` | number | 贏線類型 (0: kCommon, 1: kXTotalBet, 2: kXTotalBetTrigger) |
| `line_no` | number | 線號 (65535 表示特殊線) |
| `symbol_id` | number | Symbol ID (1-10) |
| `pos` | number[] | 中獎位置陣列 |
| `credit` | number | 贏分 |
| `multiplier` | number | 倍率 |
| `credit_long` | object | 長整數格式的贏分 |

---

## 🔧 數據映射

### 內部格式 → 簡化格式

| 內部欄位 | 簡化格式欄位 | 處理邏輯 |
|---------|-------------|---------|
| `player_balance` 或 `credit` | `credit` | 直接取值 |
| `total_win` 或 `win` | `win` | 直接取值 |
| `rng` 或 `strip_positions` | `rng` | 直接取值 |
| `module_id` | `module_id` | 直接取值 (預設 "BS") |
| `next_module` | `next_module` | 直接取值 (預設 "BS") |
| `multiplier` | `multiplierAlone` | >1 時取值，否則為 1 |
| `multiplier_pattern` | `mulitplierPattern` | 有值時取值，否則為 [1, 1, ...] (20個) |
| `win_lines` | `winLineGrp` | 轉換格式，加入 credit_long |
| `win_bonus` | `winBonusGrp` | 轉換格式 |
| `jp_count` | `jp_count` | 直接取值 (預設 0) |
| `jp` | `jp` | 直接取值 (預設 0) |

---

## ✅ 格式驗證

### Python 驗證

```python
import json

# 讀取檔案
with open("game_output/game_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 基本檢查
assert isinstance(data, list), "必須是陣列"
assert len(data) > 0, "必須有結果"

# 檢查第一筆結果
first = data[0]
required_fields = [
    "module_id", "credit", "rng", "win",
    "winLineGrp", "multiplierAlone", "mulitplierPattern",
    "next_module", "winBonusGrp", "jp_count", "jp"
]

for field in required_fields:
    assert field in first, f"缺少欄位: {field}"

# 檢查 mulitplierPattern 長度
assert len(first["mulitplierPattern"]) == 20, "mulitplierPattern 必須有 20 個元素"

# 檢查 winLineGrp 結構
if first["winLineGrp"]:
    win_line = first["winLineGrp"][0]
    assert "credit_long" in win_line, "winLineGrp 必須包含 credit_long"
    assert "low" in win_line["credit_long"], "credit_long 必須包含 low"

print("✅ 格式驗證通過！")
```

---

## 📝 注意事項

### 1. 拼寫

⚠️ **重要**: `mulitplierPattern` (不是 `multiplierPattern`)

這是為了與原始格式保持一致。

### 2. 陣列長度

- `rng`: 5-8 個元素（根據遊戲狀態）
- `mulitplierPattern`: 固定 20 個元素
- `pos`: 贏線位置數量（3-5 個）

### 3. 預設值

```json
{
  "multiplierAlone": 1,          // 沒有倍率時為 1
  "mulitplierPattern": [1, ...], // 20 個 1
  "winLineGrp": [],              // 沒贏分時為空陣列
  "winBonusGrp": [],             // 沒觸發 bonus 時為空陣列
  "jp_count": 0,                 // 預設為 0
  "jp": 0                        // 預設為 0
}
```

### 4. credit_long 結構

```json
{
  "credit_long": {
    "low": 173,      // 低位元 (實際金額)
    "high": 0,       // 高位元 (通常為 0)
    "unsigned": true // 是否為無符號數
  }
}
```

---

## 🎯 與 sampleResult.json 的關係

### sampleResult.json 格式

```json
{
  "game_id": "PSS-ON-00163",
  "logs": [
    {
      "event": "result",
      "data": {           // ← 這部分
        "module_id": "BS",
        "credit": 9999950,
        ...
      }
    }
  ]
}
```

### game_results.json 格式

```json
[
  {                      // ← 直接是 data 部分
    "module_id": "BS",
    "credit": 9999950,
    ...
  }
]
```

**關係**: `game_results.json` 的每個元素 = `sampleResult.json` 的 `logs[].data`

---

## 🔄 完整工作流程

### 1. 執行模擬

```bash
python test_simple_data_export.py
```

### 2. 檢查輸出

```
✅ 遊戲結果已保存 (簡化格式):
   game_results: C:\...\game_results.json
```

### 3. 讀取結果

```python
import json

with open("test_output/game_results.json", "r") as f:
    results = json.load(f)

print(f"總共 {len(results)} 筆結果")

# 統計贏分
total_win = sum(r["win"] for r in results)
print(f"總贏分: {total_win}")

# 找出最大贏分
max_win_result = max(results, key=lambda r: r["win"])
print(f"最大贏分: {max_win_result['win']}")
```

---

## 🎨 範例輸出

### 沒有贏分的結果

```json
{
  "module_id": "BS",
  "credit": 9999900,
  "rng": [36, 5, 56, 68, 31, 36, 14, 62],
  "win": 0,
  "winLineGrp": [],
  "multiplierAlone": 1,
  "mulitplierPattern": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  "next_module": "BS",
  "winBonusGrp": [],
  "jp_count": 0,
  "jp": 0
}
```

### 有贏分的結果

```json
{
  "module_id": "BS",
  "credit": 9999950,
  "rng": [17, 54, 70, 48, 22, 26, 14, 11],
  "win": 173,
  "winLineGrp": [
    {
      "win_line_type": 0,
      "line_no": 65535,
      "symbol_id": 7,
      "pos": [14, 24, 5],
      "credit": 173,
      "multiplier": 1,
      "credit_long": {
        "low": 173,
        "high": 0,
        "unsigned": true
      }
    }
  ],
  "multiplierAlone": 1,
  "mulitplierPattern": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  "next_module": "BS",
  "winBonusGrp": [],
  "jp_count": 0,
  "jp": 0
}
```

---

## 🔗 相關檔案

- **Exporter 實現**: `gameServer/protocol/simple_data_exporter.py`
- **測試腳本**: `gameServer/test_simple_data_export.py`
- **參考格式**: `docs/sampleResult.json`
- **Simulator 整合**: `gameServer/simulation/simulator.py` (第 542-570 行)

---

**更新日期**: 2025-10-14  
**版本**: 1.0  
**狀態**: ✅ 已測試通過
