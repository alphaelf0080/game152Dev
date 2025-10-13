# 好運咚咚模擬器 - 設定指南

## 概述

這個文檔說明如何設定和調整好運咚咚遊戲模擬器的各種參數。

## 設定方式

### 1. 使用設定檔 (推薦)

設定檔位於 `config/simulation_config.json`，包含所有模擬參數的預設值。

#### 查看目前設定
```bash
python main.py --settings
```

#### 使用自訂設定檔
```bash
python main.py --config my_config.json
```

### 2. 命令行參數

某些參數可以直接透過命令行指定：

```bash
# 指定模擬次數
python main.py --simulate 100000

# 運行所有分析
python main.py --all
```

### 3. 修改設定檔

直接編輯 `config/simulation_config.json` 檔案：

```json
{
    "general": {
        "default_spins": 100000,  // 預設模擬次數
        "default_bet": 10         // 預設下注額
    },
    "basic_simulation": {
        "total_spins": 200000,    // 基礎模擬總次數
        "report_interval": 20000  // 報告間隔
    }
}
```

## 設定參數說明

### 一般設定 (general)

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `default_spins` | 50,000 | 一般模擬的預設旋轉次數 |
| `default_bet` | 10 | 預設下注金額 |

### 基礎模擬 (basic_simulation)

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `total_spins` | 100,000 | 基礎遊戲模擬總旋轉次數 |
| `report_interval` | 10,000 | 每隔多少次旋轉輸出進度報告 |

### 購買功能分析 (feature_buy_analysis)

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `spins_per_option` | 10,000 | 每個購買選項的測試次數 |
| `analyze_all_options` | true | 是否分析所有購買選項 |

### 波動性分析 (volatility_analysis)

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `num_sessions` | 200 | 模擬的遊戲會話數量 |
| `spins_per_session` | 10,000 | 每個會話的旋轉次數 |
| `calculate_percentiles` | [1,5,10,25,50,75,90,95,99] | 計算的百分位數 |

### 功能特定設定 (feature_specific)

#### 免費旋轉 (free_spins)
| 參數 | 預設值 | 說明 |
|------|--------|------|
| `num_simulations` | 5,000 | 免費旋轉功能模擬次數 |

#### 戰鼓功能 (war_drums)
| 參數 | 預設值 | 說明 |
|------|--------|------|
| `num_simulations` | 20,000 | 戰鼓功能模擬次數 |

#### 購買功能 (feature_buy)
| 參數 | 預設值 | 說明 |
|------|--------|------|
| `num_simulations` | 5,000 | 購買功能模擬次數 |

### 效能設定 (performance)

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `max_memory_mb` | 512 | 最大記憶體使用限制 (MB) |
| `progress_reporting` | true | 是否顯示進度報告 |
| `detailed_logging` | false | 是否輸出詳細記錄 |

### 輸出設定 (output)

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `save_detailed_results` | false | 是否儲存詳細結果 |
| `export_csv` | false | 是否匯出 CSV 格式 |
| `chart_generation` | false | 是否生成圖表 |

## 建議設定

### 快速測試
```json
{
    "general": {
        "default_spins": 10000
    },
    "basic_simulation": {
        "total_spins": 50000
    },
    "feature_buy_analysis": {
        "spins_per_option": 2000
    },
    "volatility_analysis": {
        "num_sessions": 50,
        "spins_per_session": 2000
    }
}
```

### 精確分析
```json
{
    "general": {
        "default_spins": 500000
    },
    "basic_simulation": {
        "total_spins": 1000000
    },
    "feature_buy_analysis": {
        "spins_per_option": 50000
    },
    "volatility_analysis": {
        "num_sessions": 500,
        "spins_per_session": 20000
    }
}
```

### 效能考量模式
```json
{
    "performance": {
        "max_memory_mb": 256,
        "progress_reporting": true,
        "detailed_logging": false
    },
    "output": {
        "save_detailed_results": false,
        "export_csv": false,
        "chart_generation": false
    }
}
```

## 使用範例

### 1. 快速演示
```bash
python main.py --demo --feature-demo
```

### 2. 大量模擬分析
```bash
python main.py --simulate 1000000
```

### 3. 完整分析
```bash
python main.py --all
```

### 4. 查看目前設定
```bash
python main.py --settings
```

### 5. 使用自訂設定檔
```bash
python main.py --config fast_test_config.json --all
```

## 效能提示

1. **記憶體使用**: 大量模擬會消耗較多記憶體，可適當調整 `max_memory_mb`
2. **執行時間**: 模擬次數與執行時間成正比，建議先用小數量測試
3. **準確性**: 更多的模擬次數會得到更準確的統計結果
4. **並行處理**: 目前版本為單執行緒，大量模擬需要較長時間

## 故障排除

### 設定檔載入失敗
- 檢查 JSON 格式是否正確
- 確認檔案編碼為 UTF-8
- 檢查檔案路徑是否正確

### 記憶體不足
- 減少模擬次數
- 調低 `max_memory_mb` 設定
- 關閉 `save_detailed_results`

### 執行時間過長
- 減少模擬次數
- 關閉 `detailed_logging`
- 使用 `progress_reporting` 監控進度