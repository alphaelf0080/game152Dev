# JSON 輸出功能使用指南

## 概述

好運咚咚遊戲模擬器現在支援將每筆遊戲結果按照 proto 定義輸出為 JSON 格式檔案。這個功能允許您獲得每次旋轉的詳細資料，包括滾輪結果、贏線資訊、特色觸發等，完全符合原始遊戲的通訊協定格式。

## 主要功能

### 1. **Proto 格式相容**
- 完全按照 `game.proto` 中的 `SlotResult` 和 `ResultRecall` 結構輸出
- 包含所有必要欄位：`module_id`、`credit`、`random_syb_pattern`、`win_line_group` 等
- 支援戰鼓倍率、免費旋轉、購買功能等特殊機制

### 2. **詳細的遊戲資料**
每次旋轉記錄包含：
- **滾輪結果**: 5x3 符號圖案
- **贏線資訊**: 中獎符號、位置、賠付、倍率
- **特色觸發**: 免費旋轉獎勵次數
- **戰鼓系統**: 倍率和特效資訊
- **玩家狀態**: 剩餘點數、下注金額
- **元數據**: 旋轉編號、時間戳記、會話 ID

### 3. **批量處理**
- 支援單次或批量模擬結果輸出
- 自動生成摘要報告
- 可自訂輸出目錄和檔案命名

## 使用方法

### 命令行選項

#### 1. **基本 JSON 輸出**
```bash
python main.py --simulate 1000 --json
```
- 執行 1000 次旋轉模擬
- 輸出 JSON 檔案到預設 `json_output` 目錄

#### 2. **自訂輸出目錄**
```bash
python main.py --simulate 5000 --json --json-dir my_results
```
- 輸出檔案到指定的 `my_results` 目錄

#### 3. **查看可用選項**
```bash
python main.py --help
```

### 程式設計介面

#### 1. **使用模擬器類別**
```python
from simulation.simulator import GameSimulator, SimulationConfig

# 建立模擬器
simulator = GameSimulator()

# 配置模擬參數
config = SimulationConfig(
    total_spins=1000,
    base_bet=10,
    feature_buy_enabled=True
)

# 執行模擬並輸出 JSON
result, json_files = simulator.run_simulation_with_json_export(
    config=config,
    export_json=True,
    output_dir="my_output"
)

print(f"JSON 檔案: {json_files}")
```

#### 2. **直接使用輸出器**
```python
from protocol.json_exporter import ProtoJSONExporter

# 建立輸出器
exporter = ProtoJSONExporter("output_dir")

# 單次結果輸出
file_path = exporter.save_single_result(
    game_result=single_result,
    spin_number=1,
    bet_amount=10
)

# 批量結果輸出
file_path = exporter.save_batch_results(
    results=all_results,
    bet_amounts=bet_list
)
```

## 輸出檔案結構

### 1. **批量結果檔案** (`batch_results_YYYYMMDD_HHMMSS_N_spins.json`)

```json
{
  "session_info": {
    "session_id": 1760349018,
    "total_spins": 500,
    "timestamp": "2025-10-13T17:50:18.123456",
    "game_module": "00152"
  },
  "results": [
    {
      "spin_number": 1,
      "bet_amount": 10,
      "result_recall": {
        "msgid": 107,
        "status_code": 0,
        "result": {
          "module_id": "00152",
          "credit": 150,
          "random_syb_pattern": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
          "win_line_group": [
            {
              "win_line_type": 0,
              "line_no": 1,
              "symbol_id": 7,
              "pos": [0, 5, 10],
              "credit": 150,
              "multiplier": 1
            }
          ],
          "pay_of_scatter": [0]
        },
        "player_cent": 999990,
        "accounting_sn": 17603490180001
      }
    }
  ]
}
```

### 2. **摘要報告檔案** (`summary_report_SESSION_ID.json`)

```json
{
  "summary": {
    "total_spins": 500,
    "total_bet": 23950,
    "total_win": 17151,
    "net_result": -6799,
    "rtp_percentage": 71.61,
    "win_frequency": 38.0,
    "feature_frequency": 2.4,
    "war_drums_frequency": 15.2,
    "max_single_win": 5000,
    "session_id": 1760349018,
    "timestamp": "2025-10-13T17:50:18.647385"
  }
}
```

## Proto 欄位對應

### SlotResult 主要欄位

| Proto 欄位 | JSON 欄位 | 說明 | 範例 |
|------------|-----------|------|------|
| `module_id` | `module_id` | 遊戲模組 ID | "00152" |
| `credit` | `credit` | 本次贏分 | 150 |
| `random_syb_pattern` | `random_syb_pattern` | 滾輪符號圖案 | [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] |
| `win_line_group` | `win_line_group` | 贏線群組 | 見 WinLine 結構 |
| `win_bonus_group` | `win_bonus_group` | 獎勵群組 | 免費旋轉等 |
| `external_multiplier` | `external_multiplier` | 外部倍率 | 戰鼓倍率 |
| `pay_of_scatter` | `pay_of_scatter` | 散佈符號賠付 | [0] 或 [100] |

### WinLine 結構

| Proto 欄位 | JSON 欄位 | 說明 | 範例 |
|------------|-----------|------|------|
| `win_line_type` | `win_line_type` | 贏線類型 | 0 (kCommon) |
| `line_no` | `line_no` | 線號或路徑 ID | 1-243 |
| `symbol_id` | `symbol_id` | 符號 ID | 7 |
| `pos` | `pos` | 中獎位置 | [0, 5, 10] |
| `credit` | `credit` | 贏分 | 150 |
| `multiplier` | `multiplier` | 倍率 | 1 |

### ResultRecall 結構

| Proto 欄位 | JSON 欄位 | 說明 | 範例 |
|------------|-----------|------|------|
| `msgid` | `msgid` | 訊息 ID | 107 (eResultRecall) |
| `status_code` | `status_code` | 狀態碼 | 0 (成功) |
| `result` | `result` | SlotResult 物件 | 見上方結構 |
| `player_cent` | `player_cent` | 玩家點數 | 999990 |
| `accounting_sn` | `accounting_sn` | 會計序號 | 17603490180001 |

## 使用案例

### 1. **遊戲數據分析**
```bash
# 執行大量模擬並分析結果
python main.py --simulate 100000 --json --json-dir analysis_data

# 分析生成的 JSON 檔案
python analyze_json_results.py analysis_data/
```

### 2. **RTP 驗證**
```bash
# 多次獨立測試
python main.py --simulate 50000 --json --json-dir rtp_test_1
python main.py --simulate 50000 --json --json-dir rtp_test_2
python main.py --simulate 50000 --json --json-dir rtp_test_3
```

### 3. **特定功能測試**
```python
# 測試戰鼓功能
config = SimulationConfig(
    total_spins=10000,
    feature_buy_enabled=False,  # 只測試基礎遊戲
    auto_buy_threshold=0.0
)

result, files = simulator.run_simulation_with_json_export(config, True, "war_drums_test")
```

### 4. **客戶端測試數據**
```bash
# 生成符合 proto 格式的測試數據
python main.py --simulate 1000 --json --json-dir client_test_data

# 測試數據可直接用於客戶端協定測試
```

## 效能考量

### 檔案大小
- 每次旋轉約 200-500 字元
- 1000 次旋轉 ≈ 200-500 KB
- 100,000 次旋轉 ≈ 20-50 MB

### 記憶體使用
- 小規模模擬 (< 10,000 次): 幾乎無影響
- 大規模模擬 (> 100,000 次): 額外 50-200 MB 記憶體

### 執行時間
- JSON 輸出增加約 10-20% 執行時間
- 檔案寫入是主要開銷

## 故障排除

### 常見問題

#### 1. **檔案權限錯誤**
```
PermissionError: [Errno 13] Permission denied
```
**解決方案**: 確保輸出目錄有寫入權限

#### 2. **磁碟空間不足**
```
OSError: [Errno 28] No space left on device
```
**解決方案**: 清理磁碟空間或選擇其他輸出目錄

#### 3. **JSON 格式錯誤**
```
json.JSONDecodeError: Expecting value
```
**解決方案**: 檢查生成的 JSON 檔案完整性，可能是寫入過程中斷

### 除錯技巧

#### 1. **驗證 JSON 格式**
```bash
# Windows PowerShell
Get-Content result.json | ConvertFrom-Json

# Python
python -m json.tool result.json
```

#### 2. **檢查檔案內容**
```python
import json

with open('batch_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"總旋轉數: {data['session_info']['total_spins']}")
print(f"結果數量: {len(data['results'])}")
```

## 進階功能

### 自訂輸出格式
可以修改 `protocol/json_exporter.py` 來自訂輸出格式：

```python
# 添加自訂欄位
detailed_result["custom_field"] = custom_value

# 修改檔案命名規則
filename = f"custom_{timestamp}_game_results.json"
```

### 整合其他系統
JSON 輸出可以直接整合到其他分析工具：

```python
import pandas as pd
import json

# 載入 JSON 數據
with open('batch_results.json', 'r') as f:
    data = json.load(f)

# 轉換為 DataFrame 進行分析
df = pd.json_normalize(data['results'])
print(df.describe())
```

這個 JSON 輸出功能讓好運咚咚模擬器能夠提供完整、標準化的遊戲數據，完美支援各種分析和測試需求。