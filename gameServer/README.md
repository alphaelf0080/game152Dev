# 好運咚咚遊戲伺服器模擬器

這是基於 TypeScript 原始碼和 protobuf 協議實現的 Python 遊戲邏輯模擬器。

## 專案結構

```
gameServer/
├── README.md                    # 本文件
├── requirements.txt             # Python 依賴
├── main.py                     # 主執行文件
├── config/                     # 配置文件
│   ├── game_config.json        # 遊戲配置
│   └── paytable.json          # 賠付表
├── core/                       # 核心遊戲邏輯
│   ├── __init__.py
│   ├── game_engine.py         # 主遊戲引擎
│   ├── reel_controller.py     # 滾輪控制器
│   ├── win_calculator.py      # 243-way 贏分計算
│   └── symbol_transformer.py  # 符號變換邏輯
├── features/                   # 特色功能
│   ├── __init__.py
│   ├── free_spins.py          # 免費旋轉
│   ├── war_drums.py           # 戰鼓倍率
│   └── feature_buy.py         # 特色購買
├── protocol/                   # 協議處理
│   ├── __init__.py
│   ├── json_exporter.py       # JSON 格式輸出器
│   ├── game_pb2.py            # 由 game.proto 生成
│   ├── module_command_pb2.py  # 由 module_command.proto 生成
│   └── proto_handler.py       # 協議處理器
├── simulation/                 # 模擬與測試
│   ├── __init__.py
│   ├── simulator.py           # 遊戲模擬器
│   ├── statistics.py          # 統計分析
│   └── reports.py             # 報告生成
└── tests/                      # 測試文件
    ├── __init__.py
    ├── test_game_engine.py
    ├── test_win_calculator.py
    └── test_features.py
```

## 遊戲規則

- **滾輪規格**: 5滾輪 x 3行
- **贏分方式**: 243-way
- **基礎押分**: 50 Credit
- **特色**: 免費旋轉、戰鼓倍率、符號變換
- **購買選項**: 60x/80x/100x 購買免費旋轉

## 主要功能

1. **完整遊戲邏輯模擬**: 忠實還原好運咚咚遊戲規則
2. **243-way 贏分系統**: 正確實現連續滾輪贏分計算  
3. **免費旋轉機制**: 包含觸發、再觸發、符號變換
4. **戰鼓倍率系統**: 1-3個戰鼓，1-10倍隨機倍率
5. **特色購買分析**: 三種購買選項的成本效益分析
6. **大量數據模擬**: 支援數萬次旋轉的統計分析
7. **JSON 格式輸出**: 按照 proto 定義輸出詳細遊戲結果
8. **靈活的設定系統**: 可調整的模擬參數和設定檔

## 使用方法

### 基本使用
```bash
# 安裝依賴
pip install -r requirements.txt

# 運行預設演示
python main.py

# 運行指定次數模擬
python main.py --simulate 10000

# 查看所有選項
python main.py --help
```

### JSON 輸出功能
```bash
# 模擬並輸出 JSON 格式結果
python main.py --simulate 1000 --json

# 指定 JSON 輸出目錄
python main.py --simulate 5000 --json --json-dir my_results

# 運行完整分析並輸出 JSON
python main.py --all --json
```

### 設定管理
```bash
# 查看目前設定
python main.py --settings

# 使用自訂設定檔
python main.py --config my_config.json --simulate 10000
```

### 測試
```bash
# 運行基本測試
python test_simulator.py

# 測試 JSON 輸出功能
python test_json_export.py

# 運行單元測試 (如果安裝了 pytest)
python -m pytest tests/
```

## 輸出格式

### 標準控制台輸出
模擬器會顯示詳細的統計資訊：
- 總旋轉數、押注額、贏分
- RTP (理論回報率)
- 特色觸發頻率
- 波動性分析
- 最大單次贏分

### JSON 格式輸出
當啟用 `--json` 選項時，會產生：
- `batch_results_*.json`: 詳細的每次旋轉結果
- `summary_report_*.json`: 模擬摘要統計

JSON 格式完全符合 `game.proto` 定義，包含：
- SlotResult 結構
- ResultRecall 訊息格式  
- WinLine 贏線資訊
- 所有 proto 欄位對應

詳細說明請參考 [JSON 輸出功能使用指南](../docs/JSON-Export-Guide.md)