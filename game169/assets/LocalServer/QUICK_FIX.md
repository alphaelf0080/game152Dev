# 🚀 LocalServerMode 快速修復指南

## ⚡ 立即解決 WebSocket 錯誤

如果您看到：
```
ProtoConsole.ts:135 WebSocket connection to 'ws://dev-gs.iplaystar.net:81/slot' failed
```

### 最新版本已改進！

最新代碼包含**雙重檢查機制**：
1. ✅ **URL 參數檢查**（主要，無需創建節點）
2. ✅ **節點組件檢查**（備用，完整功能）

## 🎯 快速測試（無需創建節點）

### 步驟 1：確認代碼已更新
確保 `ProtoConsole.ts` 包含最新的修改（包含 URL 參數檢查）

### 步驟 2：直接測試
1. 在 Cocos Creator 中構建項目
2. 預覽遊戲
3. 在瀏覽器地址欄添加：`?localServer=true`
   ```
   http://localhost:7456/?localServer=true
   ```
4. 按 F12 打開控制台

### 步驟 3：檢查輸出

#### ✅ 成功的輸出：
```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] URL 參數檢查: ?localServer=true
[ProtoConsole] localServer 參數: ✅ 存在
[ProtoConsole] 🎮 檢測到 localServer URL 參數，跳過 WebSocket 連接
[ProtoConsole] ⚠️ 請確保場景中已創建 LocalServerMode 節點並添加組件
```

**結果**：不會有 WebSocket 錯誤！ 🎉

#### ⚠️ 但功能有限：
這種方式可以：
- ✅ 繞過 WebSocket 錯誤
- ✅ 防止連接失敗

但**無法使用本地 JSON 結果**，因為：
- ❌ 沒有 LocalServerMode 組件載入 JSON
- ❌ 沒有 UIController 整合處理結果

### 步驟 4：完整功能（需要創建節點）

要使用完整的本地 JSON 功能，需要創建節點：

#### A. 在編輯器中創建節點
1. 打開主場景
2. Hierarchy（層級）根層級右鍵
3. 創建空節點，命名：`LocalServerMode`
4. 選中節點 → Inspector → 添加組件 → LocalServerMode
5. 保存場景

#### B. 準備 JSON 文件
```bash
# 創建資源文件夾
mkdir -p assets/resources/scenarios

# 創建測試 JSON（使用 gameServer 生成）
cd gameServer
python quick_demo.py
```

#### C. 重新構建測試
1. 項目 → 構建
2. 預覽
3. URL: `?localServer=true&scenario=base_game`
4. 點擊 Spin 按鈕測試

## 📊 診斷檢查表

### 情況 1：只想跳過 WebSocket 錯誤
- [ ] URL 包含 `?localServer=true`
- [ ] 看到 "檢測到 localServer URL 參數" 消息
- [ ] 沒有 WebSocket 錯誤

**狀態**：✅ 基本繞過成功

### 情況 2：要使用本地 JSON 結果
- [ ] URL 包含 `?localServer=true`
- [ ] LocalServerMode 節點已創建
- [ ] LocalServerMode 組件已添加
- [ ] JSON 文件在 `assets/resources/scenarios/`
- [ ] 看到 "Loaded X results from" 消息
- [ ] Spin 按鈕顯示本地結果

**狀態**：✅ 完整功能正常

## 🔍 控制台輸出參考

### 場景 A：只有 URL 參數（基本繞過）
```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] URL 參數檢查: ?localServer=true
[ProtoConsole] localServer 參數: ✅ 存在
[ProtoConsole] 🎮 檢測到 localServer URL 參數，跳過 WebSocket 連接
[ProtoConsole] ⚠️ 請確保場景中已創建 LocalServerMode 節點並添加組件
```
**結果**：無 WebSocket 錯誤，但無法 Spin

### 場景 B：URL 參數 + 節點（部分功能）
```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] URL 參數檢查: ?localServer=true
[ProtoConsole] localServer 參數: ✅ 存在
[ProtoConsole] 🎮 檢測到 localServer URL 參數，跳過 WebSocket 連接
[UIController] LocalServerMode node not found, local server disabled
```
**結果**：無 WebSocket 錯誤，但 UIController 找不到組件

### 場景 C：完整設置（全功能）
```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] URL 參數檢查: ?localServer=true
[ProtoConsole] localServer 參數: ✅ 存在
[ProtoConsole] 🎮 檢測到 localServer URL 參數，跳過 WebSocket 連接
[LocalServerMode] Initialized in LOCAL mode
[LocalServerMode] Loaded 10 results from: scenarios/base_game.json
[UIController] Using local server mode, handling spin locally
[StateConsole] Using local mode, skipping SendMsg
```
**結果**：✅ 完美！所有功能正常

## 🎯 推薦流程

### 第一階段：驗證代碼（1分鐘）
```
1. 添加 ?localServer=true
2. 檢查控制台
3. 確認無 WebSocket 錯誤
```

### 第二階段：添加節點（5分鐘）
```
1. 打開編輯器
2. 創建 LocalServerMode 節點
3. 添加組件
4. 保存場景
```

### 第三階段：準備 JSON（10分鐘）
```
1. 創建 scenarios 文件夾
2. 生成測試 JSON
3. 測試 Spin 功能
```

## 💡 常見問題

### Q: 為什麼要兩種檢查方式？

**A**: 
- **URL 檢查**：快速，無需配置，適合快速測試
- **節點檢查**：完整功能，支持 JSON 載入，適合開發使用

### Q: 沒有創建節點可以用嗎？

**A**: 可以繞過 WebSocket 錯誤，但無法使用本地 JSON 結果。相當於"測試模式"。

### Q: 創建節點後還需要 URL 參數嗎？

**A**: 是的！URL 參數是啟用本地模式的開關。沒有參數會使用正常伺服器模式。

### Q: 兩種檢查都通過會怎樣？

**A**: URL 檢查優先。只要 URL 有參數，就會跳過 WebSocket，無論節點是否存在。

## 📋 三種使用模式對比

| 模式 | URL參數 | 節點 | WebSocket | JSON載入 | Spin功能 |
|------|---------|------|-----------|----------|----------|
| **正常模式** | ❌ | - | ✅ 連接 | ❌ | ✅ 伺服器 |
| **測試模式** | ✅ | ❌ | ❌ 繞過 | ❌ | ❌ |
| **本地模式** | ✅ | ✅ | ❌ 繞過 | ✅ | ✅ 本地 |

## 🚀 立即行動

**現在就可以測試**：
```
1. 添加 ?localServer=true 到 URL
2. 刷新頁面
3. 檢查控制台
4. 確認無 WebSocket 錯誤
```

**稍後完善功能**：
```
1. 創建 LocalServerMode 節點
2. 添加組件
3. 準備 JSON 文件
4. 測試完整功能
```

---

**更新日期**：2025-01-13  
**版本**：v2.0 - 雙重檢查機制  
**狀態**：✅ 可立即使用（基本繞過）
