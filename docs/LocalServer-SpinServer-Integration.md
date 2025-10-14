# LocalServer 模式整合 Spin Server API - 實施報告

## 📋 整合概述

將前端 LocalServer 模式從讀取 JSON 檔案改為連接 gameServer 的 Spin Server HTTP API，實現動態遊戲結果獲取。

## 🎯 整合目標

- ✅ LocalServer 模式使用 HTTP API 而非 JSON 檔案
- ✅ 保持原有 WebSocket 模式不受影響
- ✅ URL 參數控制模式切換
- ✅ 錯誤處理和連線檢查

## 📁 修改檔案清單

### 1. **SpinServerClient.ts** (新建)
**路徑**: `pss-on-00152/assets/script/LocalServer/SpinServerClient.ts`

**功能**: HTTP API 客戶端類
```typescript
export class SpinServerClient {
    // 配置
    private config: SpinServerConfig;
    private sessionId: string;
    
    // 主要方法
    async executeSpin(bet: number, spinType: string): Promise<SpinResultData>
    async checkHealth(): Promise<boolean>
    async getStatus(): Promise<any>
}

// 全域實例獲取
export function getSpinServerClient(): SpinServerClient
```

**特性**:
- 超時處理 (30 秒)
- 會話管理
- 錯誤處理
- 日誌控制

**資料格式**: 對應 SimpleDataExporter 輸出 (game_results.json)

### 2. **ProtoConsole.ts** (修改)
**路徑**: `pss-on-00152/assets/script/MessageController/ProtoConsole.ts`

#### 修改 1: Import SpinServerClient
```typescript
import { SpinServerClient, getSpinServerClient } from '../LocalServer/SpinServerClient';
```

#### 修改 2: start() 方法 - 模式檢測
```typescript
start() {
    // ... 原有初始化 ...
    
    // 檢查 LocalServer 模式
    const urlParams = new URLSearchParams(window.location.search);
    const isLocalServerMode = urlParams.has('localServer') || 
                               urlParams.has('localserver') || 
                               urlParams.has('local');
    
    if (isLocalServerMode) {
        console.log('[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API');
        (Data.Library as any).localServerMode = true;
        // 不創建 WebSocket
    } else {
        console.log('[ProtoConsole] 🌐 正常模式：使用 WebSocket');
        (Data.Library as any).localServerMode = false;
        CreateSocket(); // 創建 WebSocket
    }
}
```

**URL 參數**:
- `?localServer=true`
- `?localserver=true`
- `?local=true`

#### 修改 3: ResultCall() 函數 - API 整合
```typescript
let ResultCall = function (buy) {
    // LocalServer 模式：使用 HTTP API
    if ((Data.Library as any).localServerMode === true) {
        console.log('[ResultCall] 🌐 使用 Spin Server API');
        
        const spinClient = getSpinServerClient();
        const betAmount = Data.Library.StateConsole.BetIndex;
        const spinType = buy ? 'buy' : 'normal';
        
        spinClient.executeSpin(betAmount, spinType).then(resultData => {
            console.log('[ResultCall] ✅ API 返回結果:', resultData);
            
            // TODO: 將 resultData 轉換為 Proto 格式並處理
            
        }).catch(error => {
            console.error('[ResultCall] ❌ API 錯誤:', error);
            Mode.ErrorInLoading('Spin Server 連接失敗: ' + error.message);
        });
        
        return; // 不執行 WebSocket 邏輯
    }
    
    // 原有 WebSocket 邏輯
    // ...
};
```

### 3. **StateConsole.ts** (修改)
**路徑**: `pss-on-00152/assets/script/MessageController/StateConsole.ts`

#### 修改 1: Import SpinServerClient
```typescript
import { getSpinServerClient } from '../LocalServer/SpinServerClient';
```

#### 修改 2: NetInitReady() 方法 - 健康檢查
```typescript
NetInitReady() {
    // LocalServer 模式：檢查 Spin Server 連線
    if ((Data.Library as any).localServerMode === true) {
        console.log('[StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線');
        
        const spinClient = getSpinServerClient();
        
        spinClient.checkHealth().then(isHealthy => {
            if (isHealthy) {
                console.log('[StateConsole] ✅ Spin Server 連線正常');
                
                // 觸發網路就緒事件
                let type = "All";
                let data = {
                    EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY
                }
                this.SendEvent(type, data);
                
                // 初始化遊戲狀態
                if (this.ServerRecoverData != null) {
                    this.Recover();
                } else {
                    if (find("APIConsole")) {
                        Data.Library.yieldLess(1);
                        console.log("enter NetInitReady (LocalServer mode)")
                    }
                }
            } else {
                console.error('[StateConsole] ❌ Spin Server 連線失敗');
                Mode.ErrorInLoading('無法連接到 Spin Server');
            }
        }).catch(error => {
            console.error('[StateConsole] ❌ Spin Server 健康檢查錯誤:', error);
            Mode.ErrorInLoading('Spin Server 錯誤: ' + error.message);
        });
        
        return; // 不執行原有邏輯
    }
    
    // 原有邏輯
    // ...
}
```

## 🔧 使用方法

### 1. 啟動 Spin Server
```powershell
cd c:\projects\game152Dev\gameServer
python spin_server.py
```

**輸出**:
```
🎰 好運咚咚 Spin Server 啟動
📍 服務地址: http://localhost:8000
📡 API 端點:
   POST   /api/spin     - 執行遊戲旋轉
   GET    /api/health   - 健康檢查
   GET    /api/status   - 服務器狀態
```

### 2. 啟動遊戲 (LocalServer 模式)

在遊戲 URL 加上參數：
```
http://localhost:7456/?localServer=true
```

或：
```
http://localhost:7456/?local=true
```

### 3. 測試流程

1. **初始化檢查**
   - 遊戲啟動時執行 `GET /api/health`
   - 確認 Spin Server 可用

2. **執行 Spin**
   - 按下 Spin 按鈕
   - 發送 `POST /api/spin` 請求
   - 接收遊戲結果

3. **日誌輸出**
   ```
   [ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
   [StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線
   [StateConsole] ✅ Spin Server 連線正常
   [ResultCall] 🌐 使用 Spin Server API
   [ResultCall] ✅ API 返回結果: {...}
   ```

## 📊 資料格式

### API 請求格式 (POST /api/spin)
```json
{
    "bet": 100,
    "spin_type": "normal",
    "session_id": "uuid-string"
}
```

### API 回應格式
```json
{
    "success": true,
    "message": "遊戲執行成功",
    "data": {
        "module_id": "BS",
        "credit": 500,
        "rng": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        "win": 500,
        "winLineGrp": [
            {
                "lineIdx": 0,
                "symbolIdx": 1,
                "continuity": 5,
                "pay": 500
            }
        ],
        "multiplierAlone": 1,
        "mulitplierPattern": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "next_module": "BS",
        "winBonusGrp": [],
        "jp_count": 0,
        "jp": 0
    },
    "timestamp": "2024-01-01T12:00:00",
    "session_id": "uuid-string"
}
```

## 🎮 模式切換邏輯

### 判斷流程
```
URL 包含參數?
├─ Yes: ?localServer=true / ?local=true
│   └─> LocalServer 模式
│       ├─ 使用 HTTP API
│       ├─ 不創建 WebSocket
│       └─ 顯示 "LocalServer 模式" 日誌
│
└─ No: 無參數
    └─> 正常模式
        ├─ 創建 WebSocket
        ├─ 連接遊戲伺服器
        └─ 顯示 "正常模式" 日誌
```

### 全域標記
```typescript
(Data.Library as any).localServerMode = true/false
```

## 🔍 待完成工作

### 1. 資料格式轉換 (優先)
**檔案**: ProtoConsole.ts - ResultCall()

**需求**: 將 API 回應的 `SpinResultData` 轉換為遊戲內部的 Proto 格式

**步驟**:
1. 讀取 `resultData` (SpinResultData 格式)
2. 轉換為 `message` (Proto 格式)
3. 觸發 `ResultRecall()` 邏輯
4. 更新遊戲狀態

**參考**:
- API 格式: `SpinResultData` 介面 (SpinServerClient.ts)
- Proto 格式: `Proto.decodeResultRecall()` (ProtoConsole.ts 第 488 行)

### 2. 錯誤處理增強
- 網路超時 (已實現 30 秒)
- 重試邏輯
- 離線檢測

### 3. UI 提示
- LocalServer 模式指示器
- 連線狀態顯示
- API 錯誤提示

### 4. 完整測試
- 各種 Bet 金額測試
- Buy Feature 測試
- 連續 Spin 測試
- 錯誤情況測試

## 📝 技術細節

### SpinServerClient 配置
```typescript
interface SpinServerConfig {
    baseUrl: string;         // 預設: 'http://localhost:8000/api'
    timeout: number;         // 預設: 30000 (30秒)
    verbose: boolean;        // 預設: true (顯示日誌)
}
```

### 會話管理
- 每個客戶端實例生成唯一 `sessionId`
- 使用 UUID v4 格式
- 發送到 Spin Server 用於追蹤

### 超時處理
```typescript
private async fetch(endpoint: string, options: any): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(timeout);
    }
}
```

## 🐛 已知問題

### 1. 資料格式轉換未完成
**狀態**: ⏳ 待實現  
**影響**: 目前 API 回應無法正確觸發遊戲邏輯  
**計劃**: 下一步實現

### 2. WebSocket 依賴
**狀態**: ⚠️ 需注意  
**影響**: 部分遊戲邏輯可能依賴 WebSocket 事件  
**解決**: 模擬 WebSocket 事件格式

## 📈 整合進度

- ✅ SpinServerClient 類創建
- ✅ ProtoConsole.ts 整合
- ✅ StateConsole.ts 整合
- ✅ 模式檢測邏輯
- ✅ 健康檢查機制
- ⏳ 資料格式轉換 (待完成)
- ⏳ 完整功能測試 (待執行)
- ⏳ 錯誤處理完善 (待加強)

## 🎯 下一步行動

1. **實現資料轉換** (最優先)
   - 在 `ResultCall()` 中完成 `SpinResultData` → Proto 格式
   - 測試遊戲邏輯正確執行

2. **測試整合**
   - 啟動 Spin Server
   - 使用 `?localServer=true` 啟動遊戲
   - 測試 Spin 功能

3. **完善錯誤處理**
   - 增加重試邏輯
   - 改善錯誤提示
   - 處理離線情況

4. **創建使用文檔**
   - 開發者指南
   - API 使用說明
   - 測試案例文檔

## 📚 相關文檔

- **Spin Server 文檔**:
  - `gameServer/README_SPIN_SERVER.md` - 伺服器說明
  - `docs/Spin-Server-Quick-Start.md` - 快速開始
  - `docs/Spin-Server-Guide.md` - 詳細指南

- **測試工具**:
  - `gameServer/test_spin_server.py` - Python 測試腳本
  - `gameServer/test_spin_client.html` - 網頁測試介面

- **資料格式**:
  - `docs/Simple-Data-Format-Guide.md` - 簡化格式說明
  - `gameServer/game_results.json` - 範例資料

## ✅ 總結

已成功整合 Spin Server API 到 LocalServer 模式：

1. ✅ **SpinServerClient.ts**: 完整的 HTTP API 客戶端
2. ✅ **ProtoConsole.ts**: 模式檢測和 API 調用
3. ✅ **StateConsole.ts**: 健康檢查和初始化
4. ⏳ **資料轉換**: 待完成 (下一步)

**使用方式**: 啟動 Spin Server + 遊戲 URL 加上 `?localServer=true`

**核心優勢**:
- 動態遊戲結果 (不再依賴 JSON 檔案)
- 保持原有 WebSocket 模式完整
- 清晰的模式切換邏輯
- 完整的錯誤處理

**待辦事項**:
- 實現資料格式轉換
- 測試整合功能
- 完善錯誤處理

---

**文檔版本**: 1.0  
**建立日期**: 2024  
**作者**: GitHub Copilot  
**專案**: 好運咚咚 (game152Dev)
