# 🐛 前端請求調試 - 已添加完整日誌

## ✅ 完成的調試增強

已在以下關鍵位置添加詳細的調試日誌，用於追蹤前端是否正確發送請求到 Spin Server。

## 📝 修改的檔案

### 1. **ProtoConsole.ts**
**位置**: `start()` 方法 - LocalServer 模式檢測

**新增日誌**:
```typescript
console.log('[DEBUG] URL Search Params:', window.location.search);
console.log('[DEBUG] Has localServer:', urlParams.has('localServer'));
console.log('[DEBUG] Has localserver:', urlParams.has('localserver'));
console.log('[DEBUG] Has local:', urlParams.has('local'));
console.log('[DEBUG] isLocalServerMode:', isLocalServerMode);
console.log('[DEBUG] Set Data.Library.localServerMode to:', ...);
```

**用途**: 確認 URL 參數是否正確解析，LocalServer 模式是否正確啟用

### 2. **StateConsole.ts**
**位置**: `NetInitReady()` 方法 - 初始化流程

**新增日誌**:
```typescript
console.log('[DEBUG] NetInitReady called');
console.log('[DEBUG] localServerMode:', (Data.Library as any).localServerMode);
console.log('[DEBUG] About to create SpinServerClient');
console.log('[DEBUG] SpinServerClient created successfully');
console.log('[DEBUG] Calling checkHealth()');
console.log('[DEBUG] checkHealth completed, result:', isHealthy);
console.log('[DEBUG] Calling getInitialBoard()');
console.log('[DEBUG] Promise chain error:', error);
console.log('[DEBUG] Exception in NetInitReady:', error);
console.log('[DEBUG] Using normal WebSocket mode');
```

**用途**: 追蹤初始化流程，確認每個步驟是否執行

### 3. **SpinServerClient.ts**

#### A. `checkHealth()` 方法
**新增日誌**:
```typescript
console.log('[DEBUG SpinServerClient] checkHealth() called');
console.log('[DEBUG SpinServerClient] baseUrl:', this.config.baseUrl);
console.log('[DEBUG SpinServerClient] Fetching URL:', url);
console.log('[DEBUG SpinServerClient] Response received');
console.log('[DEBUG SpinServerClient] Response status:', response.status);
console.log('[DEBUG SpinServerClient] Response ok:', response.ok);
console.log('[DEBUG SpinServerClient] Response data:', data);
console.log('[DEBUG SpinServerClient] checkHealth error:', error);
```

#### B. `fetch()` 方法
**新增日誌**:
```typescript
console.log('[DEBUG SpinServerClient] fetch() called');
console.log('[DEBUG SpinServerClient] Full URL:', url);
console.log('[DEBUG SpinServerClient] Options:', options);
console.log('[DEBUG SpinServerClient] Calling native fetch...');
console.log('[DEBUG SpinServerClient] Native fetch completed');
console.log('[DEBUG SpinServerClient] Response ok, returning');
console.log('[DEBUG SpinServerClient] Request timeout!');
console.log('[DEBUG SpinServerClient] Response not ok:', ...);
console.log('[DEBUG SpinServerClient] Fetch error:', error);
```

**用途**: 詳細追蹤 HTTP 請求的每個步驟

## 🔍 完整日誌輸出示例

### 正常執行流程的 Console 輸出

```
1️⃣ URL 參數檢查
[DEBUG] URL Search Params: ?localServer=true
[DEBUG] Has localServer: true
[DEBUG] Has localserver: false
[DEBUG] Has local: false
[DEBUG] isLocalServerMode: true

2️⃣ 模式設定
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
[DEBUG] Set Data.Library.localServerMode to: true

3️⃣ 初始化開始
[DEBUG] NetInitReady called
[DEBUG] localServerMode: true
[StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線
[DEBUG] About to create SpinServerClient

4️⃣ SpinServerClient 創建
[SpinServerClient] SpinServerClient 已初始化 {baseUrl: "http://localhost:8000/api", sessionId: "..."}
[DEBUG] SpinServerClient created successfully

5️⃣ 健康檢查請求
[DEBUG] Calling checkHealth()
[DEBUG SpinServerClient] checkHealth() called
[DEBUG SpinServerClient] baseUrl: http://localhost:8000/api
[DEBUG SpinServerClient] Fetching URL: http://localhost:8000/api/health
[DEBUG SpinServerClient] fetch() called
[DEBUG SpinServerClient] Full URL: http://localhost:8000/api/health
[DEBUG SpinServerClient] Options: {method: "GET"}
[DEBUG SpinServerClient] Calling native fetch...
[DEBUG SpinServerClient] Native fetch completed
[DEBUG SpinServerClient] Response ok, returning
[DEBUG SpinServerClient] Response received
[DEBUG SpinServerClient] Response status: 200
[DEBUG SpinServerClient] Response ok: true
[DEBUG SpinServerClient] Response data: {status: "ok", timestamp: "...", version: "1.0.0"}

6️⃣ 健康檢查完成
[SpinServerClient] ✅ 伺服器健康 {status: "ok", ...}
[DEBUG] checkHealth completed, result: true
[StateConsole] ✅ Spin Server 連線正常

7️⃣ 獲取初始盤面
[DEBUG] Calling getInitialBoard()
[SpinServerClient] 📋 獲取初始盤面
[DEBUG SpinServerClient] fetch() called
[DEBUG SpinServerClient] Full URL: http://localhost:8000/api/init?session_id=...
...
[SpinServerClient] ✅ 初始盤面獲取成功 {module_id: "BS", ...}
[StateConsole] 📋 收到初始盤面: {module_id: "BS", ...}
```

## 🎯 如何使用這些日誌

### 步驟 1: 啟動遊戲
```
http://localhost:7456/?localServer=true
```

### 步驟 2: 開啟 DevTools
按 **F12** → 切換到 **Console** 標籤

### 步驟 3: 逐一檢查日誌

**依序確認以下日誌是否出現**:

1. ✅ `[DEBUG] URL Search Params`
   - 如果沒有 → URL 參數可能錯誤

2. ✅ `[DEBUG] isLocalServerMode: true`
   - 如果是 false → URL 參數不正確

3. ✅ `[ProtoConsole] 🌐 LocalServer 模式`
   - 如果沒有 → 模式切換邏輯有問題

4. ✅ `[DEBUG] NetInitReady called`
   - 如果沒有 → NetInitReady() 沒有被調用

5. ✅ `[DEBUG] SpinServerClient created successfully`
   - 如果沒有 → SpinServerClient 初始化失敗

6. ✅ `[DEBUG SpinServerClient] Calling native fetch...`
   - 如果沒有 → fetch() 沒有被調用

7. ✅ `[DEBUG SpinServerClient] Native fetch completed`
   - 如果沒有 → 請求被阻擋或超時

8. ✅ `[DEBUG SpinServerClient] Response status: 200`
   - 如果不是 200 → Spin Server 有問題

## 🐛 根據日誌定位問題

### 情況 A: 完全沒有 [DEBUG] 日誌
**問題**: 前端代碼沒有更新
**解決**: 
- Ctrl + F5 強制刷新
- 清除瀏覽器緩存
- 重新編譯前端代碼

### 情況 B: 有 [DEBUG] 但 isLocalServerMode 是 false
**問題**: URL 參數不正確
**解決**: 
- 檢查 URL 是否包含 `?localServer=true`
- 注意大小寫（必須小寫）
- 確保格式正確

### 情況 C: 有 LocalServer 模式日誌但沒有 NetInitReady
**問題**: NetInitReady() 沒有被調用
**解決**: 
- 等待幾秒（可能是時間問題）
- 檢查遊戲初始化流程
- 查看是否有其他錯誤

### 情況 D: 有 "Calling native fetch" 但沒有 "completed"
**問題**: 請求被阻擋或失敗
**解決**: 
- 檢查 Network 標籤看是否有 CORS 錯誤
- 確認 Spin Server 正在運行
- 檢查防火牆設定

### 情況 E: Response status 不是 200
**問題**: Spin Server 響應錯誤
**解決**: 
- 檢查 Spin Server 的 Console 輸出
- 確認 API 端點正確
- 檢查 Spin Server 的錯誤日誌

## 📊 檢查清單

使用此清單逐一確認：

- [ ] Spin Server 正在運行 (port 8000)
- [ ] URL 包含 `?localServer=true`
- [ ] 瀏覽器 Console 打開
- [ ] 看到 `[DEBUG] URL Search Params`
- [ ] 看到 `[DEBUG] isLocalServerMode: true`
- [ ] 看到 `[ProtoConsole] 🌐 LocalServer 模式`
- [ ] 看到 `[DEBUG] NetInitReady called`
- [ ] 看到 `[DEBUG] SpinServerClient created`
- [ ] 看到 `[DEBUG] Calling checkHealth()`
- [ ] 看到 `[DEBUG SpinServerClient] checkHealth() called`
- [ ] 看到 `[DEBUG SpinServerClient] Calling native fetch...`
- [ ] 看到 `[DEBUG SpinServerClient] Native fetch completed`
- [ ] 看到 `[DEBUG SpinServerClient] Response status: 200`
- [ ] Network 標籤顯示 /api/health 請求
- [ ] Network 標籤顯示 /api/init 請求
- [ ] 沒有紅色錯誤訊息
- [ ] 沒有 CORS 錯誤

## 📚 相關文檔

- **LocalServer-Debug-Guide.md** - 完整調試指南
- **LocalServer-Request-Debug-Checklist.md** - 快速檢查清單
- **LocalServer-InitialBoard-Quick-Test.md** - 測試步驟

## 🎉 總結

已添加完整的調試日誌系統，現在可以：

✅ **追蹤 URL 參數解析**  
✅ **確認模式切換**  
✅ **監控初始化流程**  
✅ **詳細記錄 HTTP 請求**  
✅ **捕獲所有錯誤**  

**下一步**: 
1. 啟動遊戲使用 `?localServer=true`
2. 開啟 Console 查看所有 [DEBUG] 日誌
3. 根據日誌輸出定位問題
4. 如有問題，提供 Console 截圖

---

**版本**: 1.0  
**建立日期**: 2024-10-14  
**專案**: 好運咚咚 (game152Dev)
