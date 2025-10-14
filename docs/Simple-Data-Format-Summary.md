# 簡化數據格式 - 快速總結

## ✅ 完成

根據您的要求，game server 現在輸出**只保留 `data: {}` 部分**的簡化格式。

---

## 📋 輸出格式

### 格式對比

**原 sampleResult.json 格式**:
```json
{
  "game_id": "PSS-ON-00163",
  "logs": [
    {
      "event": "result",
      "data": {                    ← 只要這部分
        "module_id": "BS",
        "credit": 9999950,
        "rng": [...],
        "win": 173,
        "winLineGrp": [...],
        ...
      }
    }
  ]
}
```

**新 game_results.json 格式** ✨:
```json
[
  {                              ← 直接是 data 物件
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
    ...
  }
]
```

---

## 🚀 快速使用

### 執行測試

```bash
cd gameServer
python test_simple_data_export.py
```

### 輸出檔案

```
test_output/game_results.json  ✨ 主要輸出（簡化格式）
```

### 在程式中使用

```python
from simulation.simulator import GameSimulator, SimulationConfig

simulator = GameSimulator()
config = SimulationConfig(total_spins=100)

result, json_files = simulator.run_simulation_with_json_export(
    config=config,
    export_json=True,
    output_dir="game_output"
)

# 主要輸出：簡化格式
print(f"簡化格式: {json_files['game_results']}")
```

---

## 📊 測試結果

```
✅ 遊戲結果已保存 (簡化格式):
   game_results: C:\...\test_output\game_results.json

✅ 類型: list (陣列)
✅ 結果數量: 100

✅ 第一筆結果的欄位:
   - module_id
   - credit
   - rng
   - win
   - winLineGrp
   - multiplierAlone
   - mulitplierPattern      ← 注意拼寫
   - next_module
   - winBonusGrp
   - jp_count
   - jp

✅ 簡化數據格式驗證通過！
```

---

## 🎯 主要特點

1. ✅ **純陣列格式** - 不含 `game_id`, `logs`, `event` 等包裝
2. ✅ **直接 data 物件** - 每個元素就是 `sampleResult.json` 中的 `data` 部分
3. ✅ **包含所有必要欄位** - module_id, credit, rng, win, winLineGrp, etc.
4. ✅ **正確拼寫** - `mulitplierPattern` (不是 multiplierPattern)
5. ✅ **credit_long 結構** - winLineGrp 中包含完整的 credit_long
6. ✅ **預設值處理** - multiplierAlone=1, mulitplierPattern=[1,1,...] (20個)

---

## 📁 輸出檔案結構

執行模擬後產生 4 種格式：

```
game_output/
├── game_results.json                    ✨ 簡化格式（主要）
├── batch_results_*.json                 備用（原格式）
├── summary_report_*.json                統計報告
└── event_log_results.json               事件日誌（備用）
```

---

## 🔧 新增/修改檔案

**新增**:
1. `protocol/simple_data_exporter.py` (230 行) - 簡化格式輸出器
2. `test_simple_data_export.py` (120 行) - 測試腳本
3. `docs/Simple-Data-Format-Guide.md` (550 行) - 完整指南

**修改**:
1. `simulation/simulator.py` - 新增簡化格式輸出（第 542-570 行）

---

## 📖 完整文檔

詳細使用方法: `docs/Simple-Data-Format-Guide.md`

---

## ✨ 範例輸出

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
        "credit_long": {"low": 173, "high": 0, "unsigned": true}
      }
    ],
    "multiplierAlone": 1,
    "mulitplierPattern": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "next_module": "BS",
    "winBonusGrp": [],
    "jp_count": 0,
    "jp": 0
  }
]
```

---

**實現日期**: 2025-10-14  
**測試狀態**: ✅ 通過  
**版本**: 1.0
