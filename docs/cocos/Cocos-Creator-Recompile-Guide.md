# 🔧 Cocos Creator 重新編譯指南

**日期**: 2025-10-14  
**問題**: 前端代碼修改後未生效，仍在發送 Protobuf 而非 JSON

---

## 📋 問題現象

### 後端日誌顯示
```
ERROR:__main__:❌ WebSocket 錯誤: 'text'
```

### 原因分析
1. ✅ TypeScript 代碼已修改（ProtoConsole.ts）
2. ✅ 沒有編譯錯誤
3. ❌ **Cocos Creator 未重新編譯 TypeScript**
4. ❌ **瀏覽器載入的是舊的 JavaScript 代碼**

---

## ✅ 解決步驟

### 方法 1: 使用 Cocos Creator（推薦）

#### 步驟 1: 開啟 Cocos Creator
```
開啟專案: c:\projects\game152Dev\pss-on-00152
```

#### 步驟 2: 強制重新編譯
```
選單: 開發者 → 重新編譯腳本
```
或按快捷鍵: `Ctrl + Shift + F5`

#### 步驟 3: 等待編譯完成
- 查看 Cocos Creator 底部的進度條
- 等待顯示「編譯成功」

#### 步驟 4: 刷新瀏覽器
```
Ctrl + Shift + R (強制刷新，清除快取)
```

#### 步驟 5: 測試
按 Spin 按鈕，檢查 Console 日誌：

**應該看到（新代碼）**:
```javascript
[DEBUG] LocalServer mode - sending JSON: {...}
[DEBUG] bksend - msg type: string, isString: true
[DEBUG] bksend - sending JSON string, length: 87
```

**不應該看到（舊代碼）**:
```javascript
[DEBUG] bksend - sending binary data, byteLength: 123
```

---

### 方法 2: 使用命令行編譯（如果 Creator 無法使用）

#### 步驟 1: 檢查是否有編譯腳本
```powershell
Get-ChildItem "c:\projects\game152Dev\pss-on-00152" -Filter "*.json" | 
Select-Object Name
```

#### 步驟 2: 使用 npm 編譯（如果有 package.json）
```powershell
cd c:\projects\game152Dev\pss-on-00152
npm run build
```

#### 步驟 3: 手動刪除編譯快取
```powershell
# 刪除 library 目錄（Creator 會重新生成）
Remove-Item -Recurse -Force "c:\projects\game152Dev\pss-on-00152\library"

# 刪除 temp 目錄
Remove-Item -Recurse -Force "c:\projects\game152Dev\pss-on-00152\temp"
```

#### 步驟 4: 重新開啟 Cocos Creator
Creator 會自動重新編譯所有腳本

---

### 方法 3: 使用構建系統（完整重建）

#### 步驟 1: 在 Cocos Creator 中構建
```
選單: 專案 → 構建發布
- 平台: Web Mobile
- 勾選「調試模式」（開發階段）
- 點擊「構建」
```

#### 步驟 2: 等待構建完成
- 查看構建日誌
- 確認沒有錯誤

#### 步驟 3: 使用構建版本
```
構建輸出: c:\projects\game152Dev\pss-on-00152\build\web-mobile
開啟: build/web-mobile/index.html?localServer=true
```

---

## 🔍 驗證代碼是否生效

### 檢查 1: 瀏覽器 Console 日誌

開啟遊戲並檢查初始化日誌：

```javascript
// ✅ 應該看到這些日誌（表示新代碼已載入）
[DEBUG] isLocalServerMode: true
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
[DEBUG] WebSocket URL: ws://localhost:8000/ws
```

### 檢查 2: 按 Spin 後的日誌

```javascript
// ✅ 新代碼的日誌
*netlog* -> STATEConsole.CurState : K_SPIN
[DEBUG] LocalServer mode - sending JSON: {msgid: "eStateCall", ...}
[DEBUG] Sending bet: 50 (betIndex: 0, rateIndex: 0)
[DEBUG] bksend - msg type: string, isString: true
[DEBUG] bksend - sending JSON string, length: 87

// ❌ 如果看到這個，表示舊代碼仍在執行
[DEBUG] bksend - sending binary data, byteLength: 123
```

### 檢查 3: 後端日誌

```
// ✅ 新代碼應該看到
INFO:__main__:📨 收到 WebSocket 訊息: eStateCall
INFO:__main__:🎰 執行 Spin: bet=50, type=normal

// ❌ 舊代碼會看到
ERROR:__main__:❌ WebSocket 錯誤: 'text'
```

---

## 🐛 常見問題

### Q1: 重新編譯後仍然出現 'text' 錯誤

**可能原因**:
1. 瀏覽器快取未清除
2. Service Worker 快取了舊代碼

**解決方法**:
```javascript
// 在瀏覽器 Console 執行
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
        registration.unregister();
    }
});

// 然後強制刷新
// Ctrl + Shift + R
```

---

### Q2: Cocos Creator 編譯很慢

**原因**: Creator 需要重新編譯所有 TypeScript 文件

**解決**: 耐心等待，第一次編譯較慢，後續會快很多

---

### Q3: 編譯後出現新的錯誤

**檢查**:
1. TypeScript 語法錯誤
2. 缺少依賴
3. 版本不相容

**查看**: Cocos Creator Console 面板的錯誤訊息

---

## 📊 調試檢查清單

完成以下步驟確認問題已解決：

- [ ] 已在 Cocos Creator 中重新編譯腳本
- [ ] 編譯完成無錯誤
- [ ] 瀏覽器已強制刷新（Ctrl + Shift + R）
- [ ] 已清除 Service Worker 快取
- [ ] Console 顯示 `[DEBUG] bksend - msg type: string`
- [ ] Console 顯示 `[DEBUG] LocalServer mode - sending JSON`
- [ ] 後端日誌顯示 `📨 收到 WebSocket 訊息: eStateCall`
- [ ] 後端日誌**不再**顯示 `❌ WebSocket 錯誤: 'text'`

---

## 🎯 完整測試流程

### 1. 準備環境
```powershell
# 確認 Spin Server 運行
Test-NetConnection -ComputerName localhost -Port 8000
```

### 2. 重新編譯
```
Cocos Creator: 開發者 → 重新編譯腳本
```

### 3. 清除快取
```javascript
// 瀏覽器 Console
localStorage.clear();
sessionStorage.clear();
navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));
```

### 4. 強制刷新
```
Ctrl + Shift + R
```

### 5. 開啟遊戲
```
http://localhost:7456/?localServer=true
```

### 6. 檢查初始化
```javascript
// Console 應顯示
[DEBUG] isLocalServerMode: true
[DEBUG] WebSocket URL: ws://localhost:8000/ws
```

### 7. 測試 Spin
```
1. 按 Spin 按鈕
2. 檢查前端 Console
3. 檢查後端終端
4. 確認無 'text' 錯誤
```

---

## 📚 相關文檔

- [LocalServer-WebSocket-JSON-Fix.md](LocalServer-WebSocket-JSON-Fix.md) - WebSocket JSON 通訊修復
- [Resource-404-Quick-Fix.md](Resource-404-Quick-Fix.md) - 資源 404 錯誤修復

---

## 🔔 重要提示

### TypeScript 修改後必須做的事
1. **重新編譯**: 在 Cocos Creator 中重新編譯
2. **清除快取**: 刷新瀏覽器快取
3. **驗證生效**: 檢查 Console 日誌確認

### 不要做的事
- ❌ 不要只刷新瀏覽器（F5）
- ❌ 不要跳過重新編譯步驟
- ❌ 不要假設代碼會自動更新

---

**狀態**: 🔴 等待 Cocos Creator 重新編譯  
**優先級**: 🔴 最高（阻擋所有測試）  
**預估時間**: 1-3 分鐘（首次編譯可能較久）
