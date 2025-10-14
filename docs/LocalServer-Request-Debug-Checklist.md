# 🔍 前端請求調試 - 快速檢查清單

## ⚠️ 前端沒有發送請求？按照以下步驟檢查

### 第 1 步：確認 Spin Server 正在運行 ✅

```powershell
# 在 PowerShell 執行
cd C:\projects\game152Dev\gameServer
python spin_server.py
```

**應該看到**:
```
🎮 好運咚咚 Spin Server
INFO: Uvicorn running on http://0.0.0.0:8000
```

**驗證**:
```powershell
curl http://localhost:8000/api/health
```

### 第 2 步：確認 URL 參數正確 ✅

**正確的 URL 格式** (三選一):
```
http://localhost:7456/?localServer=true
http://localhost:7456/?localserver=true
http://localhost:7456/?local=true
```

**❌ 錯誤示例**:
```
http://localhost:7456/                    ← 缺少參數
http://localhost:7456/?localserver        ← 缺少 =true
http://localhost:7456/?LocalServer=true   ← 大小寫錯誤（應該小寫）
```

### 第 3 步：開啟瀏覽器開發者工具 ✅

1. **開啟遊戲頁面**:
   ```
   http://localhost:7456/?localServer=true
   ```

2. **按 F12** 打開開發者工具

3. **切換到 Console 標籤**

### 第 4 步：檢查 Console 日誌 ✅

**應該看到以下日誌** (按順序):

```
✅ [DEBUG] URL Search Params: ?localServer=true
✅ [DEBUG] Has localServer: true
✅ [DEBUG] Has localserver: false
✅ [DEBUG] Has local: false
✅ [DEBUG] isLocalServerMode: true
✅ [ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
✅ [DEBUG] Set Data.Library.localServerMode to: true
```

**如果沒看到上述日誌**:
- ❌ URL 參數可能不正確
- ❌ ProtoConsole.start() 可能沒有執行
- ❌ 遊戲可能沒有正確載入

### 第 5 步：檢查 NetInitReady 調用 ✅

**應該看到**:
```
✅ [DEBUG] NetInitReady called
✅ [DEBUG] localServerMode: true
✅ [StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線
✅ [DEBUG] About to create SpinServerClient
✅ [DEBUG] SpinServerClient created successfully
```

**如果看不到 "NetInitReady called"**:
- ❌ StateConsole.NetInitReady() 可能沒有被調用
- ❌ 遊戲初始化流程可能有問題

### 第 6 步：檢查 HTTP 請求 ✅

**切換到 Network 標籤**:
1. 點擊 **Network** (網路)
2. 篩選 **Fetch/XHR**
3. 刷新頁面 (F5)

**應該看到**:
```
✅ health   GET   http://localhost:8000/api/health    Status: 200
✅ init     GET   http://localhost:8000/api/init      Status: 200
```

**如果沒看到任何請求**:
- ❌ SpinServerClient 可能沒有正確初始化
- ❌ checkHealth() 可能沒有被調用
- ❌ 可能有 JavaScript 錯誤

### 第 7 步：檢查詳細的 Fetch 日誌 ✅

**在 Console 應該看到**:
```
✅ [DEBUG] Calling checkHealth()
✅ [DEBUG SpinServerClient] checkHealth() called
✅ [DEBUG SpinServerClient] baseUrl: http://localhost:8000/api
✅ [DEBUG SpinServerClient] Fetching URL: http://localhost:8000/api/health
✅ [DEBUG SpinServerClient] fetch() called
✅ [DEBUG SpinServerClient] Full URL: http://localhost:8000/api/health
✅ [DEBUG SpinServerClient] Calling native fetch...
✅ [DEBUG SpinServerClient] Native fetch completed
✅ [DEBUG SpinServerClient] Response ok, returning
✅ [DEBUG SpinServerClient] Response received
✅ [DEBUG SpinServerClient] Response status: 200
✅ [DEBUG SpinServerClient] Response ok: true
✅ [DEBUG SpinServerClient] Response data: {status: 'ok', ...}
```

## 🐛 常見問題診斷

### 問題 A: 完全沒有 [DEBUG] 日誌

**可能原因**:
- 前端代碼沒有重新編譯
- 瀏覽器緩存了舊代碼

**解決方案**:
```
1. 強制刷新: Ctrl + F5 (Windows) 或 Cmd + Shift + R (Mac)
2. 清除緩存: DevTools → Application → Clear storage → Clear site data
3. 重新啟動遊戲開發伺服器
```

### 問題 B: 看到 LocalServer 日誌但沒有 NetInitReady

**可能原因**:
- NetInitReady() 在其他地方被調用（時間延遲）
- 遊戲初始化順序問題

**檢查方法**:
```javascript
// 在 Console 執行
console.log('localServerMode:', (window as any).Data?.Library?.localServerMode);

// 手動調用（測試用）
// 找到 StateConsole 實例並調用
```

### 問題 C: 看到 "About to create SpinServerClient" 但沒有後續日誌

**可能原因**:
- SpinServerClient 初始化失敗
- Import 路徑錯誤
- getSpinServerClient 未定義

**檢查方法**:
```javascript
// 在 Console 執行
console.log('getSpinServerClient:', typeof getSpinServerClient);

// 應該返回: "function"
```

### 問題 D: CORS 錯誤

**錯誤訊息**:
```
Access to fetch at 'http://localhost:8000/api/health' from origin 
'http://localhost:7456' has been blocked by CORS policy
```

**解決方案**:
1. 確認 Spin Server 的 CORS 設定（應該已經設定為允許所有來源）
2. 檢查 Spin Server 是否正常運行
3. 重啟 Spin Server

### 問題 E: 請求超時

**錯誤訊息**:
```
[DEBUG SpinServerClient] Request timeout!
請求超時 (30000ms)
```

**可能原因**:
- Spin Server 沒有運行
- 防火牆阻擋
- 端口 8000 被佔用

**檢查**:
```powershell
# 檢查端口
netstat -an | findstr "8000"

# 應該看到
TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING
```

## 📋 完整檢查清單

在 Console 逐一確認：

- [ ] `[DEBUG] URL Search Params` 顯示
- [ ] `[DEBUG] Has localServer: true` 
- [ ] `[DEBUG] isLocalServerMode: true`
- [ ] `[ProtoConsole] 🌐 LocalServer 模式` 顯示
- [ ] `[DEBUG] Set Data.Library.localServerMode to: true`
- [ ] `[DEBUG] NetInitReady called`
- [ ] `[DEBUG] localServerMode: true`
- [ ] `[DEBUG] About to create SpinServerClient`
- [ ] `[DEBUG] SpinServerClient created successfully`
- [ ] `[DEBUG] Calling checkHealth()`
- [ ] `[DEBUG SpinServerClient] checkHealth() called`
- [ ] `[DEBUG SpinServerClient] Fetching URL: ...`
- [ ] `[DEBUG SpinServerClient] Calling native fetch...`
- [ ] `[DEBUG SpinServerClient] Native fetch completed`
- [ ] `[DEBUG SpinServerClient] Response ok, returning`

## 🎯 手動測試命令

### 在瀏覽器 Console 執行

```javascript
// 1. 檢查模式
console.log('LocalServer Mode:', (window as any).Data?.Library?.localServerMode);

// 2. 檢查 URL 參數
const params = new URLSearchParams(window.location.search);
console.log('URL Params:', {
    localServer: params.has('localServer'),
    localserver: params.has('localserver'),
    local: params.has('local')
});

// 3. 手動測試 API
fetch('http://localhost:8000/api/health')
    .then(r => r.json())
    .then(d => console.log('Health Check:', d))
    .catch(e => console.error('Error:', e));

// 4. 手動測試 Init API
fetch('http://localhost:8000/api/init')
    .then(r => r.json())
    .then(d => console.log('Init Board:', d))
    .catch(e => console.error('Error:', e));
```

## 📞 如果以上都沒問題但還是不工作

1. **截圖 Console 的所有輸出**
2. **截圖 Network 標籤**
3. **檢查是否有紅色錯誤訊息**
4. **提供 Spin Server 的 Console 輸出**

---

**版本**: 1.1  
**更新日期**: 2024-10-14  
**用途**: 快速診斷前端請求問題
