# LocalServerMode 故障排除指南

## ❌ 問題：仍然出現 WebSocket 錯誤

如果您看到此錯誤：
```
ProtoConsole.ts:108 WebSocket connection to 'ws://dev-gs.iplaystar.net:81/slot' failed:
CreateSocket @ ProtoConsole.ts:108
```

這表示 LocalServerMode 的繞過機制**未生效**。

## 🔍 診斷步驟

### 步驟 1：檢查控制台輸出

在瀏覽器控制台（F12）中，您應該看到類似的輸出：

#### ✅ 正確的本地模式輸出：
```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] LocalServerMode node: ✅ 找到
[ProtoConsole] LocalServerMode component: ✅ 找到
[ProtoConsole] isLocalMode(): ✅ TRUE (本地模式)
[ProtoConsole] 🎮 檢測到本地伺服器模式，跳過 WebSocket 連接
[ProtoConsole] 本地模式啟用，所有網路請求將被繞過
[LocalServerMode] Initialized in LOCAL mode
```

#### ❌ 如果看到這些輸出，表示有問題：

**問題 1：Node 未找到**
```
[ProtoConsole] 🔍 開始檢查本地伺服器模式...
[ProtoConsole] LocalServerMode node: ❌ 未找到
[ProtoConsole] 🌐 正常模式，創建 WebSocket 連接
```
**原因**：場景中沒有創建 LocalServerMode 節點
**解決方案**：見下方「創建 LocalServerMode 節點」

**問題 2：Component 未找到**
```
[ProtoConsole] LocalServerMode node: ✅ 找到
[ProtoConsole] LocalServerMode component: ❌ 未找到
[ProtoConsole] 🌐 正常模式，創建 WebSocket 連接
```
**原因**：節點存在但沒有添加 LocalServerMode 組件
**解決方案**：為節點添加 LocalServerMode 組件

**問題 3：URL 參數錯誤**
```
[ProtoConsole] LocalServerMode node: ✅ 找到
[ProtoConsole] LocalServerMode component: ✅ 找到
[ProtoConsole] isLocalMode(): ❌ FALSE (伺服器模式)
[ProtoConsole] 🌐 正常模式，創建 WebSocket 連接
```
**原因**：URL 沒有 `?localServer=true` 參數
**解決方案**：在 URL 中添加參數

## 🛠️ 解決方案

### 解決方案 1：創建 LocalServerMode 節點

#### 在 Cocos Creator 編輯器中：

1. **打開場景**
   - 打開您的主遊戲場景（通常在 `assets/scene/` 中）

2. **創建節點**
   - 在 **層級管理器（Hierarchy）** 中
   - 在 **根層級（Canvas 同級）** 右鍵點擊
   - 選擇「創建」→「創建空節點」

3. **命名節點**
   - 將新節點命名為：`LocalServerMode`
   - ⚠️ **必須完全匹配此名稱**（區分大小寫）

4. **添加組件**
   - 選中 `LocalServerMode` 節點
   - 在 **屬性檢查器（Inspector）** 中
   - 點擊「添加組件」→「自定義腳本」→ 選擇 `LocalServerMode`

5. **保存場景**
   - Ctrl+S (Windows) 或 Cmd+S (Mac)

#### 視覺參考：
```
Hierarchy 層級結構：
├── Canvas
├── MessageController
├── LocalServerMode  ← 在這裡創建（根層級）
│   └── [LocalServerMode Component]  ← 添加此組件
└── ...
```

### 解決方案 2：檢查 URL 參數

確保您的 URL 包含正確的參數：

#### ✅ 正確的 URL 格式：
```
http://localhost:7456/?localServer=true
http://localhost:7456/?localServer=true&scenario=base_game
http://192.168.1.100:7456/?localServer=true
```

#### ❌ 錯誤的 URL 格式：
```
http://localhost:7456/                          # 缺少參數
http://localhost:7456/?localserver=true         # 大小寫錯誤
http://localhost:7456/?local=true               # 參數名稱錯誤
http://localhost:7456/#localServer=true         # 使用了 # 而不是 ?
```

### 解決方案 3：重新構建項目

有時候 Cocos Creator 的緩存會導致問題：

1. **清理緩存**
   - 在編輯器中選擇「開發者」→「刪除緩存」
   - 或手動刪除 `temp/` 和 `library/` 文件夾

2. **重新構建**
   - 選擇「項目」→「構建」
   - 選擇目標平台（Web Mobile 或 Web Desktop）
   - 點擊「構建」

3. **重新預覽**
   - 構建完成後
   - 使用「預覽」按鈕啟動遊戲
   - 記得在 URL 中添加 `?localServer=true`

### 解決方案 4：檢查文件路徑

確保所有 LocalServerMode 文件都在正確位置：

```
pss-on-00152/
└── assets/
    ├── LocalServer/
    │   ├── LocalServerMode.ts           ← 必須存在
    │   ├── LocalServerMode.ts.meta      ← 自動生成
    │   ├── URLParamParser.ts            ← 必須存在
    │   ├── URLParamParser.ts.meta       ← 自動生成
    │   ├── LocalResultProvider.ts       ← 必須存在
    │   └── LocalResultProvider.ts.meta  ← 自動生成
    └── script/
        └── MessageController/
            ├── ProtoConsole.ts          ← 已修改
            └── StateConsole.ts          ← 已修改
```

### 解決方案 5：驗證 TypeScript 編譯

檢查是否有 TypeScript 編譯錯誤：

1. 在 Cocos Creator 中打開「控制台」面板
2. 查找任何紅色錯誤信息
3. 如果看到 "Cannot find module" 錯誤：
   - 檢查導入路徑是否正確
   - 確保 `.meta` 文件已生成

## 📊 快速檢查清單

在嘗試使用 LocalServerMode 之前，請確認：

- [ ] ✅ LocalServerMode 節點已在場景中創建
- [ ] ✅ LocalServerMode 組件已添加到節點
- [ ] ✅ URL 包含 `?localServer=true` 參數
- [ ] ✅ 所有 TypeScript 文件已正確編譯（無錯誤）
- [ ] ✅ 已重新構建項目
- [ ] ✅ 瀏覽器控制台已打開（F12）
- [ ] ✅ 查看控制台輸出以診斷問題

## 🧪 測試步驟

### 完整測試流程：

1. **準備環境**
   ```bash
   # 在場景中創建 LocalServerMode 節點（見上方說明）
   # 保存場景
   ```

2. **構建項目**
   - Cocos Creator → 項目 → 構建
   - 選擇 Web Mobile 或 Web Desktop
   - 構建

3. **啟動預覽**
   - 點擊「預覽」按鈕
   - 記下瀏覽器打開的 URL（例如 `http://localhost:7456/`）

4. **修改 URL**
   - 在瀏覽器地址欄中
   - 在 URL 末尾添加 `?localServer=true`
   - 例如：`http://localhost:7456/?localServer=true`
   - 按 Enter 重新加載

5. **檢查控制台**
   - 按 F12 打開開發者工具
   - 切換到「Console」標籤
   - 查找 `[ProtoConsole]` 和 `[LocalServerMode]` 消息

6. **預期輸出**
   ```
   [ProtoConsole] 🔍 開始檢查本地伺服器模式...
   [ProtoConsole] LocalServerMode node: ✅ 找到
   [ProtoConsole] LocalServerMode component: ✅ 找到
   [ProtoConsole] isLocalMode(): ✅ TRUE (本地模式)
   [ProtoConsole] 🎮 檢測到本地伺服器模式，跳過 WebSocket 連接
   [LocalServerMode] Initialized in LOCAL mode
   ```

7. **驗證無錯誤**
   - ✅ 不應該看到 "WebSocket connection failed" 錯誤
   - ✅ 不應該看到任何紅色錯誤消息

## 🆘 仍然無法解決？

如果完成上述所有步驟後仍然有問題：

### 提供以下信息以便診斷：

1. **控制台完整輸出**
   - 從頁面加載開始的所有 `[ProtoConsole]` 和 `[LocalServerMode]` 消息
   - 任何錯誤消息的完整堆棧跟踪

2. **URL**
   - 您正在使用的完整 URL

3. **場景結構**
   - Hierarchy 中的節點結構截圖
   - LocalServerMode 節點的 Inspector 截圖

4. **文件檢查**
   - 確認 `LocalServerMode.ts` 文件存在
   - 確認 `.meta` 文件已生成

5. **Cocos Creator 版本**
   - 您使用的 Cocos Creator 版本號

## 📋 常見錯誤對照表

| 錯誤現象 | 可能原因 | 解決方法 |
|---------|---------|---------|
| WebSocket 連接錯誤 | Node 未創建 | 創建 LocalServerMode 節點 |
| 找不到 LocalServerMode | Node 名稱錯誤 | 確保名稱完全匹配 |
| Component 為 null | 組件未添加 | 添加 LocalServerMode 組件 |
| isLocalMode() = false | URL 參數缺失 | 添加 ?localServer=true |
| 無任何日誌輸出 | 代碼未更新 | 重新構建項目 |
| 導入錯誤 | 文件路徑錯誤 | 檢查文件位置和導入路徑 |

---

**最後更新**：2025-01-13  
**狀態**：已添加詳細診斷日誌
