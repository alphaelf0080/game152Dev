# 🚨 WebSocket 連接問題 - 快速修復指南

## 問題

在 LocalServer 模式下，遊戲仍然嘗試連接 WebSocket，導致錯誤：

```
WebSocket connection to 'ws://dev-gs.iplaystar.net:81/slot' failed
*bklog* Socket Close / undefined
*bklog* 在localserver mode 時候，還是會進入連web socket
```

## ✅ 快速解決方案（3 選 1）

### 方案 1：使用 URL 參數（最簡單）⭐

在瀏覽器地址欄中添加參數：

```
http://localhost:7456/?localServer=true
```

或者使用其他支援的參數：

```
http://localhost:7456/?localserver=true
http://localhost:7456/?local=true
http://localhost:7456/?sim_mode=local_json
```

### 方案 2：檢查場景配置

確認 Cocos Creator 場景中：

1. ✅ 有 `LocalServerMode` 節點
2. ✅ 節點已添加 `LocalServerMode` 組件
3. ✅ 組件的 `isLocalMode()` 返回 `true`

### 方案 3：代碼中設置

在遊戲初始化早期（例如 loading 場景），添加：

```typescript
import { Data } from "../DataController";

// 強制啟用本地模式
Data.Library.USE_LOCAL_JSON = true;
```

## 🔍 檢查是否生效

打開瀏覽器控制台（F12），應該看到：

### ✅ 成功的日誌：

```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] 完整 URL: http://localhost:7456/?localServer=true
[ProtoConsole] localServer 參數: ✅ 存在
[ProtoConsole] 🎮 檢測到本地/模擬模式 URL 參數，跳過 WebSocket 連接
[ProtoConsole] 本地模式啟用，所有網路請求將被繞過
*bklog* [ProtoConsole] ✅ 本地模式已啟用，WebSocket 連接已跳過
```

### ❌ 失敗的日誌：

```
[ProtoConsole] 🌐 正常模式，創建 WebSocket 連接
WebSocket connection to 'ws://dev-gs.iplaystar.net:81/slot' failed
*bklog* Socket Close
```

## 🛠️ 故障排除

### 問題：添加了 URL 參數還是連接 WebSocket

**解決方法**：
1. 按 `Ctrl + Shift + R` 強制刷新頁面（清除快取）
2. 檢查 URL 拼寫是否正確（區分大小寫）
3. 確認參數格式：`?localServer=true`（不是 `&localServer=true`）

### 問題：找不到 LocalServerMode 節點

**解決方法**：
1. 在 Cocos Creator 中打開場景
2. 在層級管理器中右鍵 → 創建節點
3. 命名為 `LocalServerMode`（注意大小寫）
4. 添加 `LocalServerMode` 組件

### 問題：不確定當前是什麼模式

**檢查方法**：

在瀏覽器控制台執行：

```javascript
// 檢查 URL 參數
console.log('URL:', window.location.href);
console.log('參數:', window.location.search);

// 檢查節點
const { find } = require('cc');
const node = find('LocalServerMode');
console.log('LocalServerMode 節點:', node ? '✅ 存在' : '❌ 不存在');
```

## 📋 完整檢查清單

- [ ] URL 中包含 `?localServer=true` 或類似參數
- [ ] 瀏覽器已強制刷新（Ctrl+Shift+R）
- [ ] 控制台顯示"跳過 WebSocket 連接"
- [ ] 控制台沒有 "WebSocket connection failed" 錯誤
- [ ] 控制台沒有 "Socket Close" 錯誤

## 🎯 推薦方案

**最快速且最可靠的方案**：使用 URL 參數

```
http://localhost:7456/?localServer=true
```

這個方法：
- ✅ 不需要修改代碼
- ✅ 不需要修改場景
- ✅ 立即生效
- ✅ 容易測試和切換

## 💡 提示

如果您需要經常切換模式，建議：

1. **建立書籤**：
   - 伺服器模式：`http://localhost:7456/`
   - 本地模式：`http://localhost:7456/?localServer=true`

2. **使用快捷方式**：
   創建兩個快捷方式，分別指向不同的 URL

3. **開發工具**：
   使用瀏覽器擴充套件快速切換 URL 參數

## 📞 需要幫助？

如果問題仍然存在，請檢查：

1. `ProtoConsole.ts` 是否已更新為最新版本
2. 瀏覽器控制台的完整日誌
3. 使用的完整 URL
4. Cocos Creator 場景配置

---

**文檔版本**: 1.0  
**最後更新**: 2025-10-14  
**狀態**: ✅ 已修復
