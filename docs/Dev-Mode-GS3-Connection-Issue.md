# 開發模式 GS3 連接問題分析

## 📋 問題描述

在開發模式下連接 GS3 服務器時，WebSocket 連接失敗：

```
WebSocket connection to 'ws://dev-gs3.iplaystar.net:1109/slot' failed
```

## 🔍 分析結果

### 1. 網路連接測試

✅ **服務器 IP**: 192.168.10.27  
✅ **端口 1109**: 連接成功 (TcpTestSucceeded: True)  
❌ **端口 81**: 連接失敗（原始代碼使用此端口）  

```powershell
# 測試結果
Port 1109: Success ✅
Port 81:   Failed  ❌
Port 80:   Failed  ❌
Port 443:  Failed  ❌
```

### 2. WebSocket 路徑問題

目前嘗試連接: `ws://dev-gs3.iplaystar.net:1109/slot`

可能的問題：
1. **路徑不正確**: `/slot` 可能不是正確的 WebSocket 端點
2. **協議問題**: 可能需要特定的初始化流程
3. **認證問題**: 可能需要先進行某種認證

### 3. 參考資料

#### LocalServer 配置 (本地測試)
- URL: `ws://localhost:8000/ws`
- 端點: `/ws`
- 狀態: ✅ 正常工作

#### 原始代碼配置 (舊版本)
- URL: `ws://dev-gs.iplaystar.net:81/slot`
- 端點: `/slot`
- 端口: 81
- 狀態: ❌ 端口關閉

#### 當前配置 (開發模式)
- URL: `ws://dev-gs3.iplaystar.net:1109/slot`
- 端點: `/slot`
- 端口: 1109
- 狀態: ⚠️ 端口開放但 WebSocket 連接失敗

## 💡 可能的解決方案

### 方案 1: 確認正確的 WebSocket 端點

需要向服務器管理員確認：
- GS3 的 WebSocket 端點路徑是什麼？
  - 可能是: `/ws`
  - 可能是: `/slot`
  - 可能是: `/game`
  - 可能是: `/socket`
  - 其他？

### 方案 2: 測試不同的端點路徑

建議測試以下路徑：
```javascript
ws://dev-gs3.iplaystar.net:1109/ws
ws://dev-gs3.iplaystar.net:1109/slot
ws://dev-gs3.iplaystar.net:1109/game
ws://dev-gs3.iplaystar.net:1109/socket
ws://dev-gs3.iplaystar.net:1109/
```

### 方案 3: 檢查是否需要特定的 Header 或協議

可能需要：
- 特定的 WebSocket 子協議
- 認證 token
- 特殊的 HTTP headers

## 🔧 已實現的修改

### 檔案: `ProtoConsole.ts`

```typescript
// 添加開發模式標誌，防止被 psapi 覆蓋
let isDevModeActive = false;

let CreateSocket = function () {
    // 開發模式：不使用 psapi 的 GameSocket
    if (!isDevModeActive && window["psapi"] !== undefined) {
        socketUrl = API.GameSocket[0];
    }
    
    console.log('[CreateSocket] 🔌 Creating WebSocket connection to:', socketUrl);
    socket = new WebSocket(socketUrl);
    // ...
};

// 在 start() 中設置標誌
if (isDevMode) {
    isDevModeActive = true;
    socketUrl = "ws://dev-gs3.iplaystar.net:1109/slot";
    CreateSocket();
}
```

## ❓ 需要確認的資訊

請向 GS3 服務器管理員或查看服務器文檔確認：

1. **WebSocket 端點路徑**: `/slot` 是否正確？
2. **連接協議**: 是否需要特定的 WebSocket 子協議？
3. **認證流程**: 是否需要先通過某種認證？
4. **游戲類型路徑**: 是否需要在路徑中包含遊戲類型（如 `/slot/game169`）？
5. **協議版本**: GS3 使用的 Protobuf 協議版本是否與客戶端匹配？

## 🧪 測試建議

### 1. 使用瀏覽器開發工具測試

```javascript
// 在瀏覽器 Console 中執行
const ws = new WebSocket('ws://dev-gs3.iplaystar.net:1109/slot');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.error('❌ Error:', e);
ws.onclose = (e) => console.log('🔌 Closed:', e.code, e.reason);
```

### 2. 使用 wscat 工具測試

```bash
# 安裝 wscat
npm install -g wscat

# 測試連接
wscat -c ws://dev-gs3.iplaystar.net:1109/slot
wscat -c ws://dev-gs3.iplaystar.net:1109/ws
```

### 3. 檢查服務器日誌

查看 GS3 服務器端的錯誤日誌，確認：
- 連接請求是否到達服務器
- 拒絕連接的原因
- 需要的額外參數

## 📝 下一步行動

1. ✅ 確認端口 1109 可連接
2. ⏳ 確認正確的 WebSocket 端點路徑
3. ⏳ 測試不同路徑的連接
4. ⏳ 查看服務器端日誌
5. ⏳ 確認協議版本兼容性

## 🔗 相關文件

- `game169/assets/script/MessageController/ProtoConsole.ts` - WebSocket 連接邏輯
- `gameServer/spin_server.py` - LocalServer WebSocket 實現（參考）
- `pss-on-00152_original/assets/script/MessageController/ProtoConsole.ts` - 原始版本（使用端口 81）
