# GS3 開發環境測試 - 快速開始指南

## 🚀 一行命令快速開始

### PowerShell (推薦)
```powershell
cd c:\projects\game152Dev
.\test_gs3_dev.ps1
```

### Batch Script
```cmd
cd c:\projects\game152Dev
test_gs3_dev.bat
```

## 📝 URL 參數快速參考

### 基本開發模式
```
http://localhost:7456/?dev_mode=true
```
- 自動連接到: `ws://dev-gs3.iplaystar.net:1109/slot`
- 自動帳號: DEVMODE
- 自動密碼: TEST9

### 自訂代理商帳密
```
http://localhost:7456/?dev_mode=true&agent_account=DEVMODE&agent_password=TEST9
```

### 帶自訂密碼
```
http://localhost:7456/?dev_mode=true&agent_password=YOUR_PASSWORD
```

### LocalServer 模式 (本地測試)
```
http://localhost:7456/?localServer=true
```

### 正常模式 (連接正式伺服器)
```
http://localhost:7456/
```

## 🔍 測試檢查清單

啟動遊戲後，請檢查以下項目：

1. **打開瀏覽器開發工具 (F12)**

2. **查看 Console 標籤**
   - [ ] 看到 `[ProtoConsole] 🔧 開發模式` 日誌
   - [ ] 看到 `[DEBUG] WebSocket URL:` 連接地址
   - [ ] 看到 `[CreateSocket] 🔌 Creating WebSocket connection` 
   - [ ] 看到 `[ProtoConsole] 🔐 開發模式登入: DEVMODE / TEST9`

3. **檢查 Network 標籤**
   - [ ] 找到 WebSocket 連接 (通常在 WS 篩選中)
   - [ ] 狀態應為 `101 Switching Protocols`
   - [ ] 查看 Frames 標籤中的 Protobuf 二進制數據

4. **驗證認證成功**
   - [ ] 接收到 LoginRecall 消息
   - [ ] 遊戲狀態加載完成
   - [ ] 沒有認證錯誤

## 🆘 故障排除

### 問題 1: WebSocket 連接失敗
```
WebSocket connection to 'ws://dev-gs3.iplaystar.net:1109/slot' failed
```

**解決方案：**
1. 檢查網路連接：
   ```powershell
   Test-NetConnection -ComputerName dev-gs3.iplaystar.net -Port 1109
   ```

2. 嘗試其他路徑（使用 WebSocket 測試工具）
   - `/ws`
   - `/game`
   - `/socket`
   - `/`

3. 查看防火牆設置

### 問題 2: 認證失敗
```
LoginRecall status_code: 401 (未授權)
```

**解決方案：**
1. 確認帳號: `DEVMODE`
2. 確認密碼: `TEST9`
3. 如需其他帳密，聯繫管理員

### 問題 3: Protobuf 解碼錯誤
```
Error decoding message
```

**解決方案：**
1. 確認 Protobuf 版本匹配
2. 檢查 `Proto.decode*` 函數實現
3. 查看伺服器端協議版本

### 問題 4: 遊戲加載卡住
**解決方案：**
1. 清除瀏覽器緩存
2. 硬刷新 (Ctrl+Shift+R 或 Cmd+Shift+R)
3. 查看 Console 中的詳細錯誤訊息

## 📊 預期的成功流程

```
1. 瀏覽器打開遊戲
   ↓
2. WebSocket 連接建立
   [ProtoConsole] 🔧 開發模式：連到 GS3 開發伺服器
   [CreateSocket] 🔌 Creating WebSocket connection to: ws://dev-gs3.iplaystar.net:1109/slot
   ↓
3. 發送登入請求
   [ProtoConsole] 🔐 開發模式登入：DEVMODE / TEST9
   ↓
4. 接收登入回應
   [@LoginRecall] status_code OK
   ↓
5. 遊戲狀態加載
   StateRecall received
   ↓
6. 遊戲準備完畢
   ✅ 遊戲就緒，可開始遊戲
```

## 🔧 進階選項

### 使用 WebSocket 測試工具
```powershell
Start-Process "c:\projects\game152Dev\test_gs3_websocket.html"
```

功能：
- 測試個別路徑
- 批量測試所有路徑
- 查看實時連接日誌
- 自訂 WebSocket URL

### 手動測試（在 Console 中）
```javascript
// 測試 /slot 路徑
const ws = new WebSocket('ws://dev-gs3.iplaystar.net:1109/slot');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.error('❌ Error:', e);

// 測試 /ws 路徑
const ws2 = new WebSocket('ws://dev-gs3.iplaystar.net:1109/ws');
ws2.onopen = () => console.log('✅ /ws connected!');
ws2.onerror = () => console.log('❌ /ws failed');
```

### 查看詳細文檔
```
docs/GS3-Dev-Environment-Testing.md
```

## 📞 聯繫支援

如遇到問題無法解決，請記錄以下信息並聯繫開發團隊：

1. **錯誤訊息** (來自 Console)
2. **Network 日誌** (WebSocket 連接詳情)
3. **伺服器日誌** (如可用)
4. **測試 URL** (您使用的確切 URL)
5. **時間戳記** (問題發生時間)

## 📋 文件列表

- `test_gs3_dev.ps1` - PowerShell 啟動腳本
- `test_gs3_dev.bat` - Batch 啟動腳本
- `test_gs3_websocket.html` - WebSocket 測試工具
- `docs/GS3-Dev-Environment-Testing.md` - 詳細文檔
- `ProtoConsole.ts` - 核心連接代碼

## ✅ 成功標誌

當您看到以下輸出時，表示連接成功：

```
✅ WebSocket 連接成功
✅ 代理商認證成功 (DEVMODE / TEST9)
✅ 遊戲狀態加載完成
✅ 準備好開始遊戲
```

---

**祝測試順利！** 🎮
