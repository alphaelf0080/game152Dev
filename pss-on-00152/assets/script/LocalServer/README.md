# LocalServer 模組

本地伺服器模式核心腳本，用於在開發和測試階段完全離線運行遊戲。

## 📁 檔案結構

```
LocalServer/
├── LocalServerMode.ts          # 主要核心組件
├── URLParamParser.ts           # URL 參數解析工具
├── LocalResultProvider.ts      # 結果提供者
└── README.md                   # 本文件
```

## 🎯 核心組件說明

### 1. LocalServerMode.ts
**主要核心組件**，負責整體控制和對外介面。

**主要功能**:
- 檢測 URL 參數 `?localServer=true`
- 自動載入 JSON 結果檔案
- 提供 `getNextResult()` 方法供遊戲使用
- 管理場景切換和結果循環

**主要方法**:
```typescript
// 獲取下一個遊戲結果
public getNextResult(): GameResult | null

// 載入 JSON 檔案
public loadJSON(jsonPath?: string): Promise<void>

// 切換測試場景
public switchScenario(scenarioName: string): Promise<void>

// 檢查是否處於本地模式
public isLocalMode(): boolean

// 重置索引
public reset(): void
```

**編輯器屬性**:
- `defaultJsonPath`: 預設 JSON 路徑
- `enableMode`: 是否啟用（通常由 URL 自動控制）
- `autoLoad`: 是否自動載入
- `verbose`: 是否顯示詳細日誌

### 2. URLParamParser.ts
**URL 參數解析工具**，負責解析瀏覽器 URL 參數。

**主要功能**:
- 解析 URL 查詢字串
- 提供類型安全的參數獲取
- 支援布林、整數、浮點數等類型

**主要方法**:
```typescript
// 解析所有參數
public static parseURL(): Record<string, string>

// 獲取字串參數
public static getParam(key: string): string | null

// 檢查布林參數
public static isParamTrue(key: string): boolean

// 獲取整數參數
public static getParamInt(key: string, defaultValue?: number): number

// 獲取浮點數參數
public static getParamFloat(key: string, defaultValue?: number): number
```

**使用範例**:
```typescript
// URL: http://localhost:7456/?localServer=true&jsonPath=test&count=100

URLParamParser.isParamTrue('localServer')  // true
URLParamParser.getParam('jsonPath')        // 'test'
URLParamParser.getParamInt('count')        // 100
```

### 3. LocalResultProvider.ts
**結果提供者**，負責 JSON 載入和格式轉換。

**主要功能**:
- 從 resources 目錄載入 JSON
- 管理結果列表和索引
- 將 Proto 格式轉換為遊戲格式
- 提供結果循環功能

**主要方法**:
```typescript
// 載入 JSON
public loadJSON(jsonPath: string, callback?: LoadCallback): void

// 獲取下一個結果
public getNextResult(): GameResult | null

// 獲取指定索引的結果
public getResultAt(index: number): GameResult | null

// 重置索引
public reset(): void

// 檢查是否就緒
public isReady(): boolean
```

**事件**:
- `json-loaded`: JSON 載入完成
- `result-index-changed`: 結果索引變化
- `results-cycled`: 結果循環到開頭

## 🚀 快速使用

### 步驟 1: 在場景中創建節點

在 Cocos Creator 編輯器中：

1. 打開 `main.scene` 或 `load.scene`
2. 創建新節點，命名為 `LocalServerMode`
3. 添加 `LocalServerMode` 組件
4. 設置 `defaultJsonPath` 為你的 JSON 路徑

### 步驟 2: 在遊戲控制器中使用

```typescript
import { LocalServerMode } from './LocalServer/LocalServerMode';

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    localServerNode: Node = null;
    
    private localServerMode: LocalServerMode = null;
    
    start() {
        // 獲取 LocalServerMode 組件
        this.localServerMode = this.localServerNode.getComponent(LocalServerMode);
        
        // 檢查是否處於本地模式
        if (this.localServerMode.isLocalMode()) {
            console.log('使用本地伺服器模式');
        }
    }
    
    // Spin 按鈕處理
    onSpinButtonClick() {
        if (this.localServerMode.isLocalMode()) {
            // 從本地獲取結果
            const result = this.localServerMode.getNextResult();
            if (result) {
                this.applyGameResult(result);
            }
        } else {
            // 正常模式：從伺服器獲取
            this.requestFromServer();
        }
    }
}
```

### 步驟 3: 在 URL 中啟用

```
http://localhost:7456/?localServer=true
```

## 📦 資料格式

### GameResult（遊戲結果）

```typescript
interface GameResult {
    reels: number[][];           // 滾輪符號
    winLines: WinLine[];         // 贏線資訊
    totalWin: number;            // 總贏分
    multiplier: number;          // 倍率
    freeSpins: FreeSpinInfo | null;  // 免費旋轉
    warDrums: any | null;        // 戰鼓特性
    raw: any;                    // 原始 Proto 數據
}
```

### WinLine（贏線）

```typescript
interface WinLine {
    symbolId: number;    // 符號 ID
    count: number;       // 符號數量
    positions: number[]; // 位置
    winCredit: number;   // 贏分
    isWild: boolean;     // 是否為 Wild
}
```

### FreeSpinInfo（免費旋轉）

```typescript
interface FreeSpinInfo {
    type: string;        // 類型
    count: number;       // 次數
    isRetrigger: boolean; // 是否重觸發
}
```

## 🎮 URL 參數

### 基本參數

| 參數 | 說明 | 範例 |
|------|------|------|
| `localServer` | 啟用本地模式 | `?localServer=true` |
| `jsonPath` | 自定義 JSON 路徑 | `?jsonPath=local_results/test` |
| `noAutoLoad` | 禁用自動載入 | `?noAutoLoad=true` |

### 使用範例

```
# 基本啟用
http://localhost:7456/?localServer=true

# 指定 JSON 檔案
http://localhost:7456/?localServer=true&jsonPath=local_results/big_win

# 多參數組合
http://localhost:7456/?localServer=true&jsonPath=test&debug=1
```

## 🔧 進階功能

### 場景切換

```typescript
// 使用預定義場景名稱
localServerMode.switchScenario('big_win');
localServerMode.switchScenario('free_spins');

// 使用完整路徑
localServerMode.switchScenario('local_results/custom_test');
```

### 預定義場景

| 場景名稱 | 路徑 | 說明 |
|---------|------|------|
| `basic` | `local_results/batch_100_spins` | 基礎旋轉 |
| `big_win` | `local_results/test_big_win` | 大獎測試 |
| `free_spins` | `local_results/test_free_spins` | 免費旋轉 |
| `war_drums` | `local_results/test_war_drums` | 戰鼓特性 |
| `max_win` | `local_results/test_max_win` | 最大獎 |
| `demo` | `local_results/demo_showcase` | 展示模式 |

### 事件監聽

```typescript
start() {
    const node = this.localServerNode;
    
    // 本地伺服器就緒
    node.on('local-server-ready', (data) => {
        console.log('就緒:', data.totalResults, '筆結果');
    });
    
    // 結果索引變化
    node.on('result-index-changed', (data) => {
        console.log(`進度: ${data.index}/${data.total}`);
    });
    
    // 結果循環
    node.on('results-cycled', () => {
        console.log('結果已循環');
    });
}
```

## 🐛 調試

### 打印狀態

```typescript
// 打印當前狀態
localServerMode.debugPrintStatus();
```

輸出範例：
```
========== LocalServerMode Status ==========
{
  "enableMode": true,
  "isInitialized": true,
  "isReady": true,
  "urlConfig": {
    "enabled": true,
    "jsonPath": "local_results/batch_100_spins",
    "autoLoad": true
  },
  "provider": {
    "isLoaded": true,
    "currentPath": "local_results/batch_100_spins",
    "totalResults": 100,
    "currentIndex": 25,
    "hasMore": true
  }
}
==========================================
```

### 常見問題檢查

```typescript
// 檢查是否處於本地模式
if (!localServerMode.isLocalMode()) {
    console.warn('本地模式未啟用或未就緒');
    console.log('狀態:', localServerMode.getInfo());
}

// 檢查結果提供者
const info = localServerMode.getInfo();
if (!info.provider.isLoaded) {
    console.error('JSON 尚未載入');
}
```

## 📝 注意事項

1. **路徑格式**
   - ✅ 正確: `local_results/test`
   - ❌ 錯誤: `assets/resources/local_results/test`
   - ❌ 錯誤: `local_results/test.json`

2. **檔案位置**
   - JSON 檔案必須在 `assets/resources/` 目錄下
   - 路徑相對於 `resources/` 目錄
   - 不需要 `.json` 副檔名

3. **瀏覽器環境**
   - URL 參數解析只在瀏覽器環境有效
   - 原生平台需要手動設置 `enableMode = true`

4. **結果循環**
   - 結果用完會自動從頭開始
   - 可以使用 `reset()` 手動重置
   - 監聽 `results-cycled` 事件了解循環狀態

## 🔗 相關文檔

- [LocalServer-Mode-Guide.md](../../docs/LocalServer-Mode-Guide.md) - 完整使用指南
- [JSON-Export-Guide.md](../../docs/JSON-Export-Guide.md) - JSON 匯出指南
- [Simulator-Quick-Start.md](../../docs/Simulator-Quick-Start.md) - 模擬器快速開始

## 📄 授權

內部專案使用
