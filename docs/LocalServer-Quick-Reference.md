# LocalServer 模式 - 快速參考

## 🚀 快速開始

### 1. 啟動 Spin Server
```powershell
cd c:\projects\game152Dev\gameServer
python spin_server.py
```

### 2. 啟動遊戲 (LocalServer 模式)
```
http://localhost:7456/?localServer=true
```

### 3. 確認日誌
```
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
[StateConsole] ✅ Spin Server 連線正常
[ResultCall] 🌐 使用 Spin Server API
```

## 📝 URL 參數

| 參數 | 效果 |
|------|------|
| `?localServer=true` | 啟用 LocalServer 模式 |
| `?localserver=true` | 啟用 LocalServer 模式 |
| `?local=true` | 啟用 LocalServer 模式 |
| (無參數) | 正常 WebSocket 模式 |

## 🔧 修改檔案

| 檔案 | 修改內容 |
|------|----------|
| `SpinServerClient.ts` | ✅ 新建 - HTTP API 客戶端 |
| `ProtoConsole.ts` | ✅ 修改 - 模式檢測 + API 調用 |
| `StateConsole.ts` | ✅ 修改 - 健康檢查 |

## 🎯 核心邏輯

### 模式檢測 (ProtoConsole.ts)
```typescript
// 檢查 URL 參數
const isLocalServerMode = urlParams.has('localServer') || 
                           urlParams.has('localserver') || 
                           urlParams.has('local');

if (isLocalServerMode) {
    // 不創建 WebSocket，使用 HTTP API
    (Data.Library as any).localServerMode = true;
} else {
    // 創建 WebSocket
    CreateSocket();
}
```

### API 調用 (ProtoConsole.ts - ResultCall)
```typescript
if ((Data.Library as any).localServerMode === true) {
    const spinClient = getSpinServerClient();
    const betAmount = Data.Library.StateConsole.BetIndex;
    
    spinClient.executeSpin(betAmount, 'normal').then(resultData => {
        // 處理結果
    });
    
    return; // 不執行 WebSocket 邏輯
}
```

### 健康檢查 (StateConsole.ts - NetInitReady)
```typescript
if ((Data.Library as any).localServerMode === true) {
    const spinClient = getSpinServerClient();
    
    spinClient.checkHealth().then(isHealthy => {
        if (isHealthy) {
            // 觸發網路就緒事件
        } else {
            Mode.ErrorInLoading('無法連接到 Spin Server');
        }
    });
    
    return; // 不執行原有邏輯
}
```

## 📊 API 端點

| 方法 | 端點 | 用途 |
|------|------|------|
| POST | `/api/spin` | 執行遊戲旋轉 |
| GET | `/api/health` | 健康檢查 |
| GET | `/api/status` | 服務器狀態 |

## 🐛 問題排查

### 問題 1: Spin Server 無法連接
**檢查**:
```powershell
# 確認 Spin Server 正在運行
curl http://localhost:8000/api/health
```

**預期輸出**:
```json
{"status": "healthy", "timestamp": "..."}
```

### 問題 2: LocalServer 模式未啟用
**檢查**:
- URL 是否包含 `?localServer=true`
- 瀏覽器 Console 是否顯示 "LocalServer 模式" 日誌

### 問題 3: API 錯誤
**日誌**:
```
[ResultCall] ❌ API 錯誤: ...
```

**解決**:
1. 確認 Spin Server 正在運行
2. 檢查網路連接
3. 查看 Spin Server 日誌

## 📚 相關文檔

| 文檔 | 用途 |
|------|------|
| `LocalServer-SpinServer-Integration.md` | 完整整合報告 |
| `Spin-Server-Quick-Start.md` | Spin Server 快速開始 |
| `Spin-Server-Guide.md` | Spin Server 詳細指南 |

## ⏳ 待完成

- [ ] 實現資料格式轉換 (SpinResultData → Proto)
- [ ] 測試整合功能
- [ ] 完善錯誤處理

---

**版本**: 1.0  
**更新**: 2024
