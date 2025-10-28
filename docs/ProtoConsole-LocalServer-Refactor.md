# ProtoConsole LocalServer 初始化重構文檔

## 📋 重構概述

將 ProtoConsole.ts 中的 `setTimeout` 實現改寫為 `async/await` + `Promise` 的現代化异步流程控制。

---

## ❌ 改寫前（使用 setTimeout）

### 問題點

```typescript
// 使用 setTimeout 確保 Data.Library 完全初始化
setTimeout(() => {
    console.log('[DEBUG] Timeout callback - initializing data structures');
    
    // 初始化 StateConsole 的基本配置
    if (Data.Library.StateConsole) {
        console.log('[DEBUG] Initializing StateConsole basic config');
        // ... 初始化代碼 ...
    }
    
    // 初始化 MathConsole
    if (Data.Library.MathConsole) {
        // ... 初始化代碼 ...
    }
    
    // 創建 WebSocket 連接
    CreateSocket();
}, 100);
```

**存在的問題：**

1. ⚠️ **時間延遲不確定** - 固定 100ms 可能不夠或浪費時間
2. ❌ **無法確認初始化完成** - 只是等待時間，不檢查狀態
3. ❌ **缺乏錯誤處理** - 初始化失敗無法捕捉
4. ❌ **代碼混亂** - 初始化邏輯散亂在 setTimeout 回調中
5. ❌ **調試困難** - 難以追蹤初始化流程

---

## ✅ 改寫後（使用 Async/Promise）

### 方案結構

#### 1. **主入口 - 調用異步初始化**

```typescript
if (isLocalServerMode) {
    console.log('[ProtoConsole] 🌐 LocalServer 模式：初始化開始');
    (Data.Library as any).localServerMode = true;
    socketUrl = "ws://localhost:8000/ws";
    
    // 👇 調用異步初始化方法
    this.initializeLocalServer();
} else {
    console.log('[ProtoConsole] 🌐 正常模式：使用 WebSocket');
    (Data.Library as any).localServerMode = false;
    CreateSocket();
}
```

#### 2. **等待初始化完成 - Promise 實現**

```typescript
/**
 * 等待 Data.Library 完全初始化
 * @returns Promise<void>
 */
private waitForDataLibraryReady(): Promise<void> {
    return new Promise((resolve, reject) => {
        const maxAttempts = 50;  // 最多等待 5 秒（50 * 100ms）
        let attempts = 0;
        
        const checkReady = () => {
            attempts++;
            
            if (Data.Library && 
                Data.Library.StateConsole && 
                Data.Library.MathConsole) {
                console.log('[DEBUG] Data.Library ready after', attempts * 100, 'ms');
                resolve();
            } else if (attempts >= maxAttempts) {
                reject(new Error('Data.Library 初始化超時'));
            } else {
                setTimeout(checkReady, 100);
            }
        };
        
        checkReady();
    });
}
```

**優勢：**
- ✅ 主動檢查初始化狀態，而非被動等待
- ✅ 設置超時限制，避免無限等待
- ✅ 可測量實際初始化時間
- ✅ 明確的成功/失敗路徑

#### 3. **提取初始化邏輯 - StateConsole**

```typescript
/**
 * 初始化 StateConsole 配置
 */
private initializeStateConsole(): void {
    if (!Data.Library.StateConsole) {
        console.warn('[ProtoConsole] ⚠️ StateConsole 未初始化');
        return;
    }
    
    console.log('[DEBUG] Initializing StateConsole basic config');
    
    // 設定基本的下注配置
    Data.Library.StateConsole.BetArray = [1, 2, 5, 10, 20, 50, 100];
    Data.Library.StateConsole.LineArray = [25];
    Data.Library.StateConsole.RateArray = [1, 2, 5, 10];
    Data.Library.StateConsole.RateIndex = 0;
    Data.Library.StateConsole.PlayerCent = 1000000;
    
    // 計算 TotalArray
    for (let i = 0; i < Data.Library.StateConsole.BetArray.length; i++) {
        for (let j = 0; j < Data.Library.StateConsole.RateArray.length; j++) {
            let total = Data.Library.StateConsole.BetArray[i] * 
                       Data.Library.StateConsole.RateArray[j] * 
                       Data.Library.StateConsole.LineArray[0];
            if (!Data.Library.StateConsole.TotalArray.includes(total)) {
                Data.Library.StateConsole.TotalArray.push(total);
                Data.Library.StateConsole.TotalArrayX.push([i, j]);
            }
        }
    }
    
    Data.Library.StateConsole.TotalArray.sort((a, b) => a - b);
    Data.Library.StateConsole.TotalIndex = 0;
    Data.Library.StateConsole.MaxBet = 
        Data.Library.StateConsole.BetArray[Data.Library.StateConsole.BetArray.length - 1] * 
        Data.Library.StateConsole.RateArray[Data.Library.StateConsole.RateArray.length - 1] * 
        Data.Library.StateConsole.LineArray[0];
    
    console.log('[DEBUG] StateConsole config initialized:', {
        BetArray: Data.Library.StateConsole.BetArray,
        TotalArray: Data.Library.StateConsole.TotalArray,
        PlayerCent: Data.Library.StateConsole.PlayerCent
    });
}
```

#### 4. **提取初始化邏輯 - MathConsole**

```typescript
/**
 * 初始化 MathConsole 配置
 */
private initializeMathConsole(): void {
    if (!Data.Library.MathConsole) {
        console.error('[ERROR] MathConsole not initialized');
        return;
    }
    
    console.log('[DEBUG] Initializing MathConsole');
    
    // 初始化 Striptables 陣列
    Data.Library.MathConsole.Striptables = [];
    Data.Library.MathConsole.Paytables = [];
    
    // 創建基本的 Striptable
    const striptable = instantiate(Data.Library.MathConsole.StripTable);
    striptable._id = "BS";
    
    // 創建假的 strips 資料
    const dummyStrips = [];
    const reelCount = 5;
    const symbolsPerReel = 100;
    
    for (let i = 0; i < reelCount; i++) {
        const strip = [];
        for (let j = 0; j < symbolsPerReel; j++) {
            strip.push((j % 10) + 1);
        }
        dummyStrips.push(strip);
    }
    
    striptable.setStrips(dummyStrips);
    
    Data.Library.MathConsole.Striptables.push(striptable);
    Data.Library.MathConsole.Paytables.push({_id: "BS"});
    Data.Library.MathConsole.CurModuleid = "BS";
    
    console.log('[DEBUG] MathConsole initialized with module:', Data.Library.MathConsole.CurModuleid);
    console.log('[DEBUG] Striptables[0]._strips length:', striptable._strips.length);
}
```

#### 5. **主異步協調函數 - async/await**

```typescript
/**
 * 初始化 LocalServer 配置（異步）
 */
private async initializeLocalServer(): Promise<void> {
    try {
        console.log('[ProtoConsole] 🔄 等待 Data.Library 初始化...');
        
        // 1️⃣ 等待 Data.Library 完全初始化
        await this.waitForDataLibraryReady();
        
        console.log('[ProtoConsole] ✅ Data.Library 已就緒，開始配置初始化');
        
        // 2️⃣ 初始化 StateConsole
        this.initializeStateConsole();
        
        // 3️⃣ 初始化 MathConsole
        this.initializeMathConsole();
        
        console.log('[ProtoConsole] ✅ LocalServer 配置初始化完成');
        
        // 4️⃣ 創建 WebSocket 連接
        console.log('[DEBUG] Creating WebSocket connection to Spin Server');
        CreateSocket();
        
    } catch (error) {
        console.error('[ProtoConsole] ❌ LocalServer 初始化失敗:', error);
        Mode.ErrorInLoading('LocalServer 初始化失敗: ' + error.message);
    }
}
```

---

## 📊 對比總結

| 項目 | 舊方案（setTimeout） | 新方案（Async/Promise） |
|------|----------------------|------------------------|
| **時間控制** | ❌ 固定 100ms | ✅ 動態檢查+超時限制 |
| **狀態檢查** | ❌ 無 | ✅ 輪詢檢查 |
| **錯誤處理** | ❌ 無 | ✅ try/catch |
| **代碼組織** | ❌ 混亂回調 | ✅ 清晰分層 |
| **可測性** | ⚠️ 低 | ✅ 高 |
| **調試性** | ⚠️ 困難 | ✅ 容易 |
| **可維護性** | ⚠️ 低 | ✅ 高 |
| **可擴展性** | ❌ 差 | ✅ 好 |

---

## 🔄 流程對比

### 舊流程
```
setTimeout(100ms)
    ↓
執行回調
    ├─ 初始化 StateConsole（假設已准備好）
    ├─ 初始化 MathConsole（假設已准備好）
    └─ CreateSocket()
    
❌ 風險：如果 Data.Library 還未準備好，會發生錯誤
```

### 新流程
```
initializeLocalServer() [async]
    ↓
waitForDataLibraryReady() [Promise]
    ├─ 檢查 Data.Library 準備好了嗎？
    ├─ 如果是 → resolve()
    ├─ 如果否 → 等待 100ms 後重試
    └─ 超時？→ reject()
    ↓
[await 完成]
    ├─ initializeStateConsole()
    ├─ initializeMathConsole()
    └─ CreateSocket()

✅ 優勢：確保初始化順序，完整的錯誤處理
```

---

## 🎯 主要改進

### 1. **可靠性提升**
- 主動檢查而非被動等待
- 超時保護防止無限卡頓
- 完整的錯誤捕捉和報告

### 2. **代碼質量提升**
- 邏輯分離清晰
- 每個方法職責單一
- 易於測試和維護

### 3. **調試體驗提升**
- 詳細的日誌信息
- 明確的成功/失敗指示
- 可追蹤初始化進度

### 4. **性能優化**
- 消除不必要的延遲
- 實際初始化時間測量
- 避免超時等待

---

## 📝 使用指南

### 快速測試
```bash
# LocalServer 模式
http://localhost:8080/index.html?localServer=true

# 正常模式
http://localhost:8080/index.html
```

### 日誌查看
```
[ProtoConsole] 🌐 LocalServer 模式：初始化開始
[ProtoConsole] 🔄 等待 Data.Library 初始化...
[DEBUG] Data.Library ready after 200 ms
[ProtoConsole] ✅ Data.Library 已就緒，開始配置初始化
[DEBUG] Initializing StateConsole basic config
[DEBUG] Initializing MathConsole
[ProtoConsole] ✅ LocalServer 配置初始化完成
[DEBUG] Creating WebSocket connection to Spin Server
```

---

## 🔮 未來優化方向

1. **配置外部化** - 將初始化參數提取到配置文件
2. **進度報告** - 添加初始化進度事件
3. **緩存機制** - 緩存已初始化的數據
4. **條件初始化** - 根據情況選擇性初始化
5. **性能監控** - 記錄各環節的耗時

---

## 📌 關鍵代碼位置

| 功能 | 文件 | 行號 |
|------|------|------|
| 主入口調用 | ProtoConsole.ts | 68-78 |
| waitForDataLibraryReady | ProtoConsole.ts | 93-114 |
| initializeStateConsole | ProtoConsole.ts | 119-170 |
| initializeMathConsole | ProtoConsole.ts | 175-215 |
| initializeLocalServer | ProtoConsole.ts | 220-245 |

---

## ✨ 總結

這次重構將 ProtoConsole 的 LocalServer 初始化從簡單的延遲機制升級為現代化的異步流程控制，大幅提升了代碼的**可靠性**、**可維護性**和**可調試性**。

✅ **改進完成，代碼已提交！**
