# LocalServer 模式調試指南

## 🔍 檢查前端是否發送請求

### 1. 確認 LocalServer 模式已啟用

**在瀏覽器 Console 檢查**:
```javascript
// 應該看到這個日誌
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API

// 檢查模式標記
console.log((window as any).Data?.Library?.localServerMode);
// 應該返回: true
```

### 2. 檢查 URL 參數

**確認 URL 包含以下其中之一**:
- `?localServer=true`
- `?localserver=true`
- `?local=true`

**範例**:
```
http://localhost:7456/?localServer=true
```

### 3. 查看網路請求 (DevTools)

**開啟 Chrome DevTools**:
1. 按 F12 打開開發者工具
2. 切換到 "Network" (網路) 標籤
3. 刷新頁面
4. 篩選 "Fetch/XHR"

**應該看到的請求**:
```
GET http://localhost:8000/api/health    ← 健康檢查
GET http://localhost:8000/api/init      ← 初始盤面
```

### 4. 檢查 Console 日誌順序

**正常執行應顯示**:
```
1. [ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
2. [StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線
3. [SpinServerClient] SpinServerClient 已初始化
4. [SpinServerClient] ✅ 伺服器健康
5. [SpinServerClient] 📋 獲取初始盤面
6. [SpinServerClient] ✅ 初始盤面獲取成功
7. [StateConsole] 📋 收到初始盤面
```

## ❌ 常見問題排查

### 問題 1: 沒有任何 LocalServer 日誌

**可能原因**:
- URL 沒有包含正確的參數
- ProtoConsole.start() 沒有執行

**解決方案**:
```javascript
// 在瀏覽器 Console 手動檢查
const urlParams = new URLSearchParams(window.location.search);
console.log('Has localServer:', urlParams.has('localServer'));
console.log('Has localserver:', urlParams.has('localserver'));
console.log('Has local:', urlParams.has('local'));
```

### 問題 2: 看到 LocalServer 日誌但沒有網路請求

**可能原因**:
- NetInitReady() 沒有被調用
- CORS 問題阻擋請求
- SpinServerClient 初始化失敗

**檢查步驟**:

**A. 檢查 StateConsole.NetInitReady() 是否被調用**:
```javascript
// 在 StateConsole.ts 的 NetInitReady() 最開始添加
console.log('[DEBUG] NetInitReady called');
console.log('[DEBUG] localServerMode:', (Data.Library as any).localServerMode);
```

**B. 檢查 CORS 設定**:
```javascript
// 在瀏覽器 Console 手動測試
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(data => console.log('Health check:', data))
  .catch(err => console.error('CORS Error:', err));
```

**C. 檢查 Spin Server 是否運行**:
```powershell
# PowerShell
curl http://localhost:8000/api/health
```

### 問題 3: CORS 錯誤

**錯誤訊息**:
```
Access to fetch at 'http://localhost:8000/api/health' from origin 'http://localhost:7456' 
has been blocked by CORS policy
```

**解決方案**:

**檢查 spin_server.py 的 CORS 設定**:
```python
# 應該看到這段代碼
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許所有來源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**如果需要修改**:
```python
# 更具體的設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:7456",
        "http://localhost:7457",
        "http://127.0.0.1:7456"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

### 問題 4: 請求超時

**錯誤訊息**:
```
[SpinServerClient] ❌ 健康檢查失敗: The operation was aborted
```

**可能原因**:
- Spin Server 沒有運行
- 端口被佔用
- 防火牆阻擋

**檢查**:
```powershell
# 確認 Spin Server 正在運行
netstat -an | findstr "8000"

# 應該看到
TCP    0.0.0.0:8000           0.0.0.0:0              LISTENING
```

### 問題 5: SpinServerClient 未定義

**錯誤訊息**:
```
getSpinServerClient is not defined
```

**可能原因**:
- import 路徑錯誤
- SpinServerClient.ts 沒有編譯

**檢查 import**:
```typescript
// StateConsole.ts
import { getSpinServerClient } from '../LocalServer/SpinServerClient';

// ProtoConsole.ts
import { SpinServerClient, getSpinServerClient } from '../LocalServer/SpinServerClient';
```

## 🛠️ 調試代碼片段

### 在 ProtoConsole.ts 添加調試

```typescript
start() {
    // ... 原有代碼 ...
    
    // 調試：檢查 URL 參數
    const urlParams = new URLSearchParams(window.location.search);
    console.log('[DEBUG] URL Parameters:', {
        localServer: urlParams.get('localServer'),
        localserver: urlParams.get('localserver'),
        local: urlParams.get('local')
    });
    
    const isLocalServerMode = urlParams.has('localServer') || 
                               urlParams.has('localserver') || 
                               urlParams.has('local');
    
    console.log('[DEBUG] isLocalServerMode:', isLocalServerMode);
    
    if (isLocalServerMode) {
        console.log('[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API');
        (Data.Library as any).localServerMode = true;
        
        // 調試：確認模式已設定
        console.log('[DEBUG] localServerMode set to:', (Data.Library as any).localServerMode);
    } else {
        console.log('[ProtoConsole] 🌐 正常模式：使用 WebSocket');
        (Data.Library as any).localServerMode = false;
        CreateSocket();
    }
}
```

### 在 StateConsole.ts 添加調試

```typescript
NetInitReady() {
    console.log('[DEBUG] NetInitReady called');
    console.log('[DEBUG] localServerMode:', (Data.Library as any).localServerMode);
    
    if ((Data.Library as any).localServerMode === true) {
        console.log('[StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線');
        console.log('[DEBUG] About to create SpinServerClient');
        
        try {
            const spinClient = getSpinServerClient();
            console.log('[DEBUG] SpinServerClient created:', spinClient);
            
            // 執行健康檢查
            console.log('[DEBUG] Calling checkHealth()');
            spinClient.checkHealth().then(isHealthy => {
                console.log('[DEBUG] checkHealth result:', isHealthy);
                
                if (isHealthy) {
                    console.log('[StateConsole] ✅ Spin Server 連線正常');
                    return spinClient.getInitialBoard();
                } else {
                    throw new Error('健康檢查失敗');
                }
            }).then(initialBoard => {
                console.log('[DEBUG] getInitialBoard result:', initialBoard);
                // ... 後續處理
            }).catch(error => {
                console.error('[DEBUG] Error caught:', error);
                console.error('[StateConsole] ❌ Spin Server 錯誤:', error);
            });
        } catch (error) {
            console.error('[DEBUG] Exception in NetInitReady:', error);
        }
        
        return;
    }
    
    // 原有邏輯...
}
```

### 在 SpinServerClient.ts 添加調試

```typescript
public async checkHealth(): Promise<boolean> {
    console.log('[DEBUG] checkHealth() called');
    console.log('[DEBUG] baseUrl:', this.config.baseUrl);
    
    try {
        const url = `${this.config.baseUrl}/health`;
        console.log('[DEBUG] Fetching:', url);
        
        const response = await this.fetch('/health', {
            method: 'GET'
        });
        
        console.log('[DEBUG] Response received:', response);
        console.log('[DEBUG] Response status:', response.status);
        console.log('[DEBUG] Response ok:', response.ok);
        
        const data = await response.json();
        console.log('[DEBUG] Response data:', data);
        
        const isHealthy = data.status === 'ok';
        this.log(isHealthy ? '✅ 伺服器健康' : '⚠️ 伺服器異常', data);
        return isHealthy;
    } catch (error) {
        console.error('[DEBUG] checkHealth error:', error);
        this.error('❌ 健康檢查失敗', error);
        return false;
    }
}
```

## 📝 完整測試流程

### 1. 啟動 Spin Server
```powershell
cd C:\projects\game152Dev\gameServer
python spin_server.py
```

**確認輸出**:
```
🎮 好運咚咚 Spin Server
📍 服務地址: http://localhost:8000
INFO: Uvicorn running on http://0.0.0.0:8000
```

### 2. 手動測試 API
```powershell
# 測試健康檢查
curl http://localhost:8000/api/health

# 測試初始盤面
curl http://localhost:8000/api/init
```

### 3. 開啟遊戲
```
http://localhost:7456/?localServer=true
```

### 4. 開啟 DevTools
- 按 F12
- 切換到 Console 標籤
- 切換到 Network 標籤

### 5. 檢查日誌
- Console 應該顯示所有 [DEBUG] 訊息
- Network 應該顯示 /api/health 和 /api/init 請求

### 6. 檢查錯誤
- 紅色錯誤訊息
- CORS 錯誤
- 404 錯誤
- 超時錯誤

## 🎯 快速診斷命令

### 瀏覽器 Console
```javascript
// 檢查模式
console.log('LocalServer Mode:', (window as any).Data?.Library?.localServerMode);

// 手動測試 API
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// 檢查 SpinServerClient
console.log('SpinServerClient:', getSpinServerClient);

// 手動觸發健康檢查
getSpinServerClient().checkHealth()
  .then(result => console.log('Health:', result))
  .catch(console.error);
```

### PowerShell
```powershell
# 檢查 Spin Server 狀態
curl http://localhost:8000/api/health

# 檢查端口
netstat -an | findstr "8000"

# 檢查進程
Get-Process | Where-Object {$_.ProcessName -eq "python"}
```

## 📊 檢查清單

- [ ] URL 包含正確的 LocalServer 參數
- [ ] Console 顯示 "LocalServer 模式" 日誌
- [ ] `localServerMode` 標記為 true
- [ ] Spin Server 正在運行 (port 8000)
- [ ] `/api/health` 可以訪問
- [ ] `/api/init` 可以訪問
- [ ] 沒有 CORS 錯誤
- [ ] Network 標籤顯示請求
- [ ] Console 沒有紅色錯誤
- [ ] SpinServerClient 正確初始化

---

**版本**: 1.0  
**日期**: 2024-10-14  
**用途**: 排查 LocalServer 模式前端請求問題
