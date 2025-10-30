# GS3 開發環境接入測試指南

## 📋 環境資訊

- **GS3 服務器**: dev-gs3.iplaystar.net:1109
- **代理商帳號**: DEVMODE
- **代理商密碼**: TEST9
- **連接協議**: WebSocket (ws://)

## 🎯 測試目標

驗證游戲客戶端是否能夠成功連接到 GS3 開發服務器並進行認證。

## 🚀 測試方式

### 方式 1: 開發模式（推薦）

使用 `?dev_mode=true` 參數自動連接到 GS3 開發服務器，並使用預設代理商帳號 (DEVMODE / TEST9)。

```
http://localhost:7456/?dev_mode=true
```

**預期流程**:
1. ✅ WebSocket 連接到 `ws://dev-gs3.iplaystar.net:1109/slot`
2. ✅ 自動使用 DEVMODE / TEST9 登入
3. ✅ 收到 LoginRecall 消息並驗證狀態

### 方式 2: 自訂代理商帳密

如需使用不同的代理商帳號或密碼：

```
http://localhost:7456/?dev_mode=true&agent_account=DEVMODE&agent_password=TEST9
```

可以替換為其他帳密進行測試。

### 方式 3: 手動測試路徑選擇

如果 `/slot` 路徑不工作，測試其他路徑：

```javascript
// 在瀏覽器 Console 測試
const testPaths = ['/slot', '/ws', '/game', '/socket', '/'];

testPaths.forEach(path => {
    const ws = new WebSocket(`ws://dev-gs3.iplaystar.net:1109${path}`);
    ws.onopen = () => console.log(`✅ Path ${path} connected!`);
    ws.onerror = () => console.log(`❌ Path ${path} failed`);
    setTimeout(() => ws.close(), 2000);
});
```

## 📊 測試檢查清單

- [ ] **網路連接**: 確認 dev-gs3.iplaystar.net:1109 可連接
  ```powershell
  Test-NetConnection -ComputerName dev-gs3.iplaystar.net -Port 1109
  ```

- [ ] **WebSocket 路徑**: 確認正確的 WebSocket 端點
  - [ ] `/slot` (目前嘗試)
  - [ ] `/ws` (備用)
  - [ ] 其他路徑？

- [ ] **代理商認證**: 驗證 DEVMODE / TEST9 認證
  - [ ] 帳號正確
  - [ ] 密碼正確
  - [ ] 收到 LoginRecall 回應

- [ ] **協議版本**: 確認 Protobuf 協議版本匹配
  - [ ] 客戶端 Protobuf 版本
  - [ ] 服務器 Protobuf 版本

## 🔍 診斷步驟

### 1. 檢查瀏覽器控制台日誌

打開瀏覽器開發工具 (F12)，查看 Console 頁籤：

```
[ProtoConsole] 🔧 開發模式：連到 GS3 開發伺服器 (dev-gs3.iplaystar.net:1109)
[DEBUG] WebSocket URL: ws://dev-gs3.iplaystar.net:1109/slot
[CreateSocket] 🔌 Creating WebSocket connection to: ws://dev-gs3.iplaystar.net:1109/slot
[ProtoConsole] 🔐 開發模式登入：DEVMODE / TEST9
```

預期的連接流程：
```
WebSocket onopen
→ LoginRecall (status_code)
→ StateRecall (遊戲狀態)
→ 準備好開始遊戲
```

### 2. 檢查 WebSocket 連接

在 Network 標籤查看 WebSocket 連接：
- 狀態應該為 `101 Switching Protocols`
- 框架 (Frames) 應顯示 Protobuf 二進制消息

### 3. 查看詳細錯誤

如果連接失敗，控制台會顯示：
```
WebSocket connection to 'ws://dev-gs3.iplaystar.net:1109/slot' failed
```

此時嘗試其他路徑：
```javascript
// 在 Console 中手動測試
const ws = new WebSocket('ws://dev-gs3.iplaystar.net:1109/ws');
ws.onopen = () => console.log('✅ /ws connected!');
ws.onerror = (e) => console.error('❌ /ws error:', e);
```

## 💾 代碼修改記錄

### ProtoConsole.ts 修改

1. **開發模式檢測**:
   ```typescript
   const isDevMode = urlParams.has('dev_mode') || urlParams.has('devmode');
   socketUrl = "ws://dev-gs3.iplaystar.net:1109/slot";
   ```

2. **代理商認證**:
   ```typescript
   const agentPassword = Data.Library.CommonLibScript.GetURLParameter('agent_password') || 'TEST9';
   ```

3. **開發模式登入**:
   ```typescript
   } else if (isDevModeActive) {
       // 開發模式：預設使用代理商模式 (DEVMODE / TEST9)
       msg = {
           member_id: agentAccount,
           password: agentPassword,
           ...
       };
   }
   ```

## 🧪 實時測試

### 使用提供的測試頁面

打開 `test_gs3_websocket.html` (已包含在項目中)：

```
file:///c:/projects/game152Dev/test_gs3_websocket.html
```

功能:
- 测试 `/slot` 路徑
- 測試 `/` 根路徑
- 自訂路徑測試
- 批量測試所有常見路徑

## 📝 測試報告範本

請記錄以下資訊並反饋：

```
測試日期: ____
測試環境: ____

1. 網路連接:
   - dev-gs3.iplaystar.net:1109: [ ] 成功 [ ] 失敗

2. WebSocket 路徑測試:
   - /slot: [ ] 成功 [ ] 失敗
   - /ws: [ ] 成功 [ ] 失敗
   - /game: [ ] 成功 [ ] 失敗
   - /socket: [ ] 成功 [ ] 失敗
   - /: [ ] 成功 [ ] 失敗

3. 代理商認證:
   - 帳號: DEVMODE
   - 密碼: TEST9
   - 認證結果: [ ] 成功 [ ] 失敗
   - 錯誤信息: ____

4. 遊戲連接:
   - 完整連接: [ ] 成功 [ ] 失敗
   - 遊戲狀態收到: [ ] 是 [ ] 否
   - 錯誤信息: ____

5. 其他備註:
   ____
```

## 🔗 相關文件

- `ProtoConsole.ts` - WebSocket 連接和認證邏輯
- `test_gs3_websocket.html` - 手動測試工具
- `Dev-Mode-GS3-Connection-Issue.md` - 連接問題分析

## ✅ 完成標誌

- [x] 添加 `?dev_mode=true` 支援
- [x] 集成 DEVMODE / TEST9 代理商認證
- [x] 自動開發模式登入邏輯
- [ ] 驗證 GS3 服務器連接成功
- [ ] 驗證代理商認證成功
- [ ] 完整遊戲流程測試

## 📞 故障排除

如遇到問題，請檢查：

1. **連接失敗**
   - 確認網路可達 dev-gs3.iplaystar.net:1109
   - 嘗試不同的 WebSocket 路徑
   - 檢查防火牆設置

2. **認證失敗**
   - 確認帳號: DEVMODE
   - 確認密碼: TEST9
   - 查看服務器端日誌

3. **協議錯誤**
   - 確認 Protobuf 版本匹配
   - 檢查消息編碼/解碼邏輯
   - 查看 Console 中的詳細錯誤

4. **其他問題**
   - 清除瀏覽器緩存
   - 重啟游戲
   - 查看瀏覽器控制台詳細日誌
