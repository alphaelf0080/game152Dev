# LocalServer 初始盤面 - 快速參考卡

## 🚀 快速啟動

### 1. 啟動 Spin Server
```powershell
cd C:\projects\game152Dev\gameServer
python spin_server.py
```

### 2. 啟動遊戲（LocalServer 模式）
```
http://localhost:7456/?localServer=true
```

或使用簡寫：
```
http://localhost:7456/?local=true
```

---

## 📋 API 端點

### 健康檢查
```http
GET http://localhost:8000/api/health
```

**回應**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-14T..."
}
```

---

### 獲取初始盤面
```http
GET http://localhost:8000/api/init?session_id=session_123
```

**回應**:
```json
{
  "success": true,
  "data": {
    "module_id": "BS",
    "rng": [7, 8, 9, 5, 6, 7, 3, 4, 5, 1, 2, 3, 0, 1, 2],
    "win": 0,
    "total_win": 0,
    "free_times": 0,
    "bet_index": 0,
    "rate_index": 0,
    "strip_index": 0
  },
  "message": "Initial board ready",
  "timestamp": "2025-10-14T..."
}
```

---

### 執行旋轉
```http
POST http://localhost:8000/api/spin
Content-Type: application/json

{
  "bet": 100,
  "lines": 25,
  "session_id": "session_123"
}
```

**回應**:
```json
{
  "success": true,
  "data": {
    "module_id": "BS",
    "rng": [...],
    "win": 500,
    "total_win": 500
  }
}
```

---

## 🔍 調試檢查清單

### 前端 Console 日誌（正常流程）

```javascript
// 1. 模式偵測
[DEBUG] isLocalServerMode: true
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API

// 2. 資料結構初始化
[DEBUG] Initializing StateConsole basic config
[DEBUG] StateConsole config initialized: {...}
[DEBUG] MathConsole initialized with module: BS
[DEBUG] Striptables[0]._strips length: 5

// 3. NetInitReady 執行
[DEBUG] NetInitReady called
[StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線

// 4. API 呼叫
[DEBUG SpinServerClient] Calling native fetch for: http://localhost:8000/api/health
[StateConsole] ✅ Spin Server 連線正常
[DEBUG SpinServerClient] Calling native fetch for: http://localhost:8000/api/init

// 5. 初始盤面應用
[StateConsole] 📋 收到初始盤面: {...}
[StateConsole] 🎮 設定初始盤面
[StateConsole] ✅ 初始盤面資料已暫存
```

### 後端 Console 日誌（正常流程）

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     127.0.0.1:xxxxx - "GET /api/health HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "OPTIONS /api/init?session_id=... HTTP/1.1" 200 OK
📋 返回初始盤面資料 - session: session_xxx
INFO:     127.0.0.1:xxxxx - "GET /api/init?session_id=... HTTP/1.1" 200 OK
```

---

## ❌ 常見問題

### 問題 1: 前端顯示 "Spin Server 連線失敗"

**檢查**:
1. Spin Server 是否運行？
2. 端口 8000 是否被佔用？
3. 防火牆是否阻擋？

**解決**:
```powershell
# 檢查端口
netstat -ano | findstr :8000

# 重啟 Spin Server
python spin_server.py
```

---

### 問題 2: 看到 "TypeError: Cannot read properties of undefined"

**原因**: 資料結構未正確初始化

**檢查 Console**:
- 是否看到 "[DEBUG] StateConsole config initialized"？
- 是否看到 "[DEBUG] MathConsole initialized"？

**解決**: 確保使用最新版本的 `ProtoConsole.ts`

---

### 問題 3: 遊戲畫面沒有顯示盤面

**檢查**:
1. 是否看到 "📋 收到初始盤面" 日誌？
2. 是否有 JavaScript 錯誤？

**解決**:
```javascript
// 在 Console 檢查資料
Data.Library.initialBoardData
Data.Library.StateConsole.LastRng
```

---

## 🎯 關鍵資料結構

### StateConsole 配置
```typescript
{
  BetArray: [1, 2, 5, 10, 20, 50, 100],
  LineArray: [25],
  RateArray: [1, 2, 5, 10],
  TotalArray: [25, 50, 125, ...],  // 所有 bet×rate×line 組合
  PlayerCent: 1000000,              // 初始金額
  TotalIndex: 0                     // 當前下注索引
}
```

### MathConsole 配置
```typescript
{
  Striptables: [
    {
      _id: "BS",
      _strips: [
        [1,2,3,4,5,6,7,8,9,10, ...],  // 滾輪 1 (100個符號)
        [1,2,3,4,5,6,7,8,9,10, ...],  // 滾輪 2
        [1,2,3,4,5,6,7,8,9,10, ...],  // 滾輪 3
        [1,2,3,4,5,6,7,8,9,10, ...],  // 滾輪 4
        [1,2,3,4,5,6,7,8,9,10, ...]   // 滾輪 5
      ]
    }
  ],
  CurModuleid: "BS"
}
```

### 初始盤面資料
```typescript
{
  module_id: "BS",
  rng: [7, 8, 9, 5, 6, 7, 3, 4, 5, 1, 2, 3, 0, 1, 2],  // 3行×5列=15個值
  win: 0,
  total_win: 0,
  free_times: 0
}
```

---

## 📊 模式對比

| 項目 | 正常模式 | LocalServer 模式 |
|-----|---------|-----------------|
| **連線方式** | WebSocket | HTTP API |
| **初始化觸發** | StripsRecall | ProtoConsole.start() |
| **配置來源** | ConfigRecall (WebSocket) | 硬編碼預設值 |
| **Strips 來源** | StripsRecall (WebSocket) | 假資料（1-10循環） |
| **初始盤面來源** | StripsRecall | GET /api/init |
| **旋轉請求** | WebSocket 訊息 | POST /api/spin |

---

## 🔗 相關文檔

- **完整報告**: `docs/LocalServer-InitialBoard-Complete-Report.md`
- **Spin Server 指南**: `docs/Spin-Server-Guide.md`
- **SpinServerClient 文檔**: `docs/SpinServerClient-Usage.md`
- **請求記錄**: `docs/requests.md`

---

## 📞 支援

遇到問題？檢查：
1. Console 日誌（前端 + 後端）
2. 網路請求（瀏覽器 DevTools → Network）
3. 錯誤堆疊（完整的錯誤訊息）

---

**最後更新**: 2025-10-14  
**版本**: v3.0  
**狀態**: ✅ 測試通過
