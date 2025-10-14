# LocalServer 模組 - 快速參考

## 🚀 1 分鐘快速開始

```typescript
// 1. 在場景中創建 LocalServerMode 節點
// 2. 在 GameController 中引用

import { LocalServerMode } from './LocalServer/LocalServerMode';

// 在 Spin 處理中
if (this.localServerMode.isLocalMode()) {
    const result = this.localServerMode.getNextResult();
    this.applyGameResult(result);
}
```

```
# 3. 在 URL 中啟用
http://localhost:7456/?localServer=true
```

## 📦 三個核心檔案

| 檔案 | 職責 | 主要方法 |
|-----|------|---------|
| **LocalServerMode.ts** | 主控制器 | `getNextResult()`, `loadJSON()`, `switchScenario()` |
| **URLParamParser.ts** | URL 解析 | `isParamTrue()`, `getParam()`, `getParamInt()` |
| **LocalResultProvider.ts** | 結果管理 | `loadJSON()`, `getNextResult()`, `reset()` |

## 🎯 關鍵 API

### LocalServerMode

```typescript
// 獲取結果
getNextResult(): GameResult | null

// 載入 JSON
loadJSON(jsonPath?: string): Promise<void>

// 切換場景
switchScenario(scenarioName: string): Promise<void>

// 檢查狀態
isLocalMode(): boolean
getInfo(): any

// 控制
reset(): void
enable(): void
disable(): void
```

### URLParamParser

```typescript
// 基本
parseURL(): Record<string, string>
getParam(key: string): string | null
isParamTrue(key: string): boolean

// 類型安全
getParamInt(key: string, default?: number): number
getParamFloat(key: string, default?: number): number
hasParam(key: string): boolean
```

### LocalResultProvider

```typescript
// 載入
loadJSON(jsonPath: string, callback?: LoadCallback): void

// 獲取
getNextResult(): GameResult | null
getResultAt(index: number): GameResult | null

// 控制
reset(): void
setIndex(index: number): void
isReady(): boolean
getInfo(): any
```

## 📊 資料結構

```typescript
// 遊戲結果
interface GameResult {
    reels: number[][]           // 滾輪
    winLines: WinLine[]         // 贏線
    totalWin: number            // 贏分
    multiplier: number          // 倍率
    freeSpins: FreeSpinInfo     // 免費旋轉
    warDrums: any               // 戰鼓
    raw: any                    // 原始數據
}

// 贏線
interface WinLine {
    symbolId: number
    count: number
    positions: number[]
    winCredit: number
    isWild: boolean
}
```

## 🔗 URL 參數

```
# 啟用本地模式
?localServer=true

# 指定 JSON
?localServer=true&jsonPath=local_results/test

# 禁用自動載入
?localServer=true&noAutoLoad=true

# 組合使用
?localServer=true&jsonPath=big_win&debug=1
```

## 🎬 預定義場景

```typescript
// 快速切換場景
localServerMode.switchScenario('basic')        // 基礎
localServerMode.switchScenario('big_win')      // 大獎
localServerMode.switchScenario('free_spins')   // 免費旋轉
localServerMode.switchScenario('war_drums')    // 戰鼓
localServerMode.switchScenario('max_win')      // 最大獎
localServerMode.switchScenario('demo')         // 展示
```

## 🔔 事件

```typescript
// 監聽事件
localServerNode.on('local-server-ready', (data) => {
    console.log('就緒:', data.totalResults);
});

localServerNode.on('result-index-changed', (data) => {
    console.log(`${data.index}/${data.total}`);
});

localServerNode.on('results-cycled', () => {
    console.log('循環了');
});
```

## ⚠️ 注意事項

### ✅ 正確
```typescript
// 路徑格式
"local_results/batch_100_spins"

// 使用前檢查
if (localServerMode.isLocalMode()) {
    const result = localServerMode.getNextResult();
}

// 錯誤處理
try {
    await localServerMode.loadJSON('test_path');
} catch (error) {
    console.error('載入失敗:', error);
}
```

### ❌ 錯誤
```typescript
// 路徑不要包含 resources/ 和 .json
"assets/resources/local_results/test.json"  // ❌

// 不檢查狀態直接使用
const result = localServerMode.getNextResult();  // ❌ 可能返回 null
```

## 🐛 快速調試

```typescript
// 打印狀態
localServerMode.debugPrintStatus();

// 檢查資訊
console.log(localServerMode.getInfo());

// 檢查提供者
const provider = localServerMode.getInfo().provider;
console.log('已載入:', provider.isLoaded);
console.log('結果數:', provider.totalResults);
console.log('當前索引:', provider.currentIndex);
```

## 📁 檔案位置要求

```
pss-on-00152/assets/resources/
└── local_results/              # 必須在 resources 下
    ├── batch_100_spins.json    # ✅
    ├── test_big_win.json       # ✅
    └── demo.json               # ✅
```

## 🔄 工作流程

```
1. 產生 JSON
   ↓
   cd gameServer
   python main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/local_results

2. 創建節點
   ↓
   在編輯器中創建 LocalServerMode 節點

3. 啟動測試
   ↓
   http://localhost:7456/?localServer=true

4. 測試遊戲
   ↓
   點擊 Spin，自動使用本地結果
```

## 📚 完整文檔

詳細使用指南: [LocalServer-Mode-Guide.md](../../docs/LocalServer-Mode-Guide.md)
