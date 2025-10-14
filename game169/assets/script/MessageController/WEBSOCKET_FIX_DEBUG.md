# WebSocket 連接問題調試指南

## 問題描述

在啟用 LocalServer 模式時，系統仍然嘗試建立 WebSocket 連接，導致連接失敗錯誤。

```
WebSocket connection to 'ws://dev-gs.iplaystar.net:81/slot' failed
*bklog* Socket Close / undefined
*netlog* -> Disconnected
*bklog* 1 / 2 在localserver mode 時候，還是會進入連web socket
```

## 根本原因

ProtoConsole 的 `start()` 方法在檢查本地模式時，可能有以下問題：

1. **URL 參數檢查失敗**：URL 中沒有正確的參數
2. **LocalServerMode 節點不存在**：場景中未添加該節點
3. **LocalServerMode 組件未初始化**：組件還未準備好
4. **檢查順序問題**：在節點/組件初始化之前就檢查了

## 解決方案

### 方案 1：使用 URL 參數（推薦）✅

最簡單且最可靠的方法：

```
http://localhost:7456/?localServer=true
http://localhost:7456/?localserver=true
http://localhost:7456/?local=true
http://localhost:7456/?sim_mode=local_json
```

支援的 URL 參數：
- `localServer` 或 `localserver`
- `local`
- `sim_mode`（模擬器系統）

### 方案 2：在場景中添加 LocalServerMode 節點

1. 打開 Cocos Creator
2. 在場景層級中添加新節點，命名為 `LocalServerMode`
3. 添加 `LocalServerMode` 組件
4. 確保該節點在 ProtoConsole 初始化之前就存在

### 方案 3：使用 DataController 配置

在代碼中設置：

```typescript
import { Data } from "../DataController";

// 在某個初始化早期執行
Data.USE_LOCAL_JSON = true;
```

## 增強的檢查邏輯

已更新 ProtoConsole.ts 的 start() 方法，新增三層檢查：

```typescript
// 方法 1: URL 參數（最優先，最可靠）
const urlParams = new URLSearchParams(window.location.search);
const hasLocalParam = urlParams.has('localServer') || 
                     urlParams.has('localserver') || 
                     urlParams.has('local') ||
                     urlParams.has('sim_mode');

if (hasLocalParam) {
    // 跳過 WebSocket 連接
    return;
}

// 方法 2: LocalServerMode 節點
const localServerNode = find('LocalServerMode');
if (localServerNode) {
    const localServerMode = localServerNode.getComponent(LocalServerMode);
    if (localServerMode && localServerMode.isLocalMode()) {
        // 跳過 WebSocket 連接
        return;
    }
}

// 方法 3: DataController 配置
if (Data.USE_LOCAL_JSON === true) {
    // 跳過 WebSocket 連接
    return;
}

// 如果以上都不滿足，才建立 WebSocket 連接
CreateSocket();
```

## 調試步驟

### 1. 檢查控制台輸出

啟動遊戲時，查看控制台日誌：

```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] 完整 URL: http://localhost:7456/?localServer=true
[ProtoConsole] URL 參數檢查: ?localServer=true
[ProtoConsole] localServer 參數: ✅ 存在
[ProtoConsole] 🎮 檢測到本地/模擬模式 URL 參數，跳過 WebSocket 連接
[ProtoConsole] 本地模式啟用，所有網路請求將被繞過
```

### 2. 確認 URL 參數

在瀏覽器地址欄檢查 URL：

```javascript
// 在控制台執行
console.log(window.location.href);
console.log(window.location.search);

const params = new URLSearchParams(window.location.search);
console.log('localServer:', params.has('localServer'));
console.log('localserver:', params.has('localserver'));
console.log('local:', params.has('local'));
console.log('sim_mode:', params.has('sim_mode'));
```

### 3. 檢查節點存在

```javascript
// 在控制台執行
import { find } from 'cc';
const node = find('LocalServerMode');
console.log('LocalServerMode node:', node);
```

### 4. 檢查組件

```javascript
// 在控制台執行
import { find } from 'cc';
import { LocalServerMode } from '../LocalServer/LocalServerMode';

const node = find('LocalServerMode');
if (node) {
    const comp = node.getComponent(LocalServerMode);
    console.log('LocalServerMode component:', comp);
    if (comp) {
        console.log('isLocalMode:', comp.isLocalMode());
    }
}
```

## 快速修復

### 立即可用的 URL

```
# 本地伺服器模式
http://localhost:7456/?localServer=true

# 模擬器模式（使用預設 JSON）
http://localhost:7456/?sim_mode=local_json

# 模擬器模式（指定 JSON）
http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/test.json
```

### 代碼修復

如果 URL 參數不方便使用，在 `ProtoConsole.ts` 的 `start()` 方法最開始添加：

```typescript
start() {
    MessageConsole = find("MessageController");
    // ... 其他初始化代碼 ...
    
    // 🔥 強制啟用本地模式（臨時調試用）
    console.log('[ProtoConsole] 🚨 強制本地模式已啟用');
    return;  // 直接返回，跳過 WebSocket 連接
    
    // ... 後面的代碼不會執行 ...
}
```

## 常見問題

### Q: 為什麼添加了 URL 參數還是連接 WebSocket？

**A**: 可能原因：
1. URL 參數拼寫錯誤（區分大小寫）
2. 瀏覽器快取了舊頁面（按 Ctrl+Shift+R 強制刷新）
3. 參數格式錯誤（確保是 `?localServer=true`）

### Q: LocalServerMode 節點找不到？

**A**: 確保：
1. 場景中已添加該節點
2. 節點名稱正確（大小寫敏感）
3. 節點在場景根目錄，不是子節點

### Q: 檢查通過但還是連接？

**A**: 可能是時序問題：
1. 使用 URL 參數方法（最可靠）
2. 在 start() 方法最開始就檢查
3. 添加更多日誌確認執行流程

## 測試檢查清單

- [ ] URL 參數方法測試
  - [ ] `?localServer=true`
  - [ ] `?localserver=true`
  - [ ] `?local=true`
  - [ ] `?sim_mode=local_json`
  
- [ ] LocalServerMode 節點方法
  - [ ] 場景中添加節點
  - [ ] 添加組件
  - [ ] 驗證 isLocalMode() 返回 true
  
- [ ] DataController 方法
  - [ ] 設置 Data.USE_LOCAL_JSON = true
  - [ ] 驗證值已設置
  
- [ ] 控制台日誌檢查
  - [ ] 看到 "開始檢查本地伺服器模式"
  - [ ] 看到 "跳過 WebSocket 連接"
  - [ ] 沒有看到 "WebSocket connection failed"

## 成功標誌

當本地模式正確啟用時，應該看到：

```
✅ [ProtoConsole] 🔍 開始檢查本地伺服器模式...
✅ [ProtoConsole] 完整 URL: http://localhost:7456/?localServer=true
✅ [ProtoConsole] URL 參數檢查: ?localServer=true
✅ [ProtoConsole] localServer 參數: ✅ 存在
✅ [ProtoConsole] 🎮 檢測到本地/模擬模式 URL 參數，跳過 WebSocket 連接
✅ [ProtoConsole] 本地模式啟用，所有網路請求將被繞過
✅ *bklog* [ProtoConsole] ✅ 本地模式已啟用，WebSocket 連接已跳過
```

**不應該看到**：
```
❌ WebSocket connection to 'ws://dev-gs.iplaystar.net:81/slot' failed
❌ *bklog* Socket Close
❌ *netlog* -> Disconnected
```

## 聯繫支援

如果問題仍然存在，請提供：
1. 完整的控制台日誌
2. 使用的 URL（包含參數）
3. 場景配置截圖
4. LocalServerMode 組件狀態

---

**文檔版本**: 1.0  
**最後更新**: 2025-10-14  
**狀態**: 調試中
