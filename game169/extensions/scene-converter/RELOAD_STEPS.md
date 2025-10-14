# 重新載入擴展步驟

## ✅ 已修復的問題
- 面板按鈕事件綁定
- 導出和導入功能邏輯
- 檔案選擇處理

## 📋 重新載入步驟

### 方法 1：重啟 Cocos Creator（推薦）
1. **完全關閉** Cocos Creator
2. **重新打開**項目
3. 檢查擴展是否啟用：`擴展 → 擴展管理器 → Scene Converter`
4. 打開面板：`Panel → Scene Converter`

### 方法 2：重新載入擴展
1. 打開 `擴展 → 擴展管理器`
2. 找到 `Scene Converter`
3. 點擊 **重新載入** 按鈕（刷新圖標）
4. 關閉並重新打開面板

### 方法 3：使用開發者工具
1. 按 `Ctrl + Shift + I` 打開開發者工具
2. 在 Console 中執行：
   ```javascript
   Editor.Message.broadcast('extension:reload', 'scene-converter');
   ```

## 🧪 測試功能

### 測試導出
1. 打開一個 2D 場景（有一些節點）
2. 打開 `Panel → Scene Converter`
3. 點擊 **導出場景結構**
4. 查看日誌輸出
5. 點擊 **打開導出資料夾** 確認檔案存在

### 測試導入
1. 在 3D 項目中打開場景
2. 打開 `Panel → Scene Converter`
3. 點擊 **選擇 JSON 檔案**
4. 選擇之前導出的 JSON
5. 點擊 **導入場景結構**
6. 查看場景層級是否正確

## 🐛 調試方法

如果按鈕還是無反應：

1. **檢查 Console 錯誤**
   - 按 `Ctrl + Shift + I`
   - 查看 Console 標籤
   - 看是否有紅色錯誤信息

2. **檢查擴展載入狀態**
   ```javascript
   // 在 Console 中執行
   Editor.Package.getPackages()
   ```
   應該能看到 `scene-converter`

3. **檢查訊息註冊**
   ```javascript
   // 在 Console 中測試
   await Editor.Message.request('scene-converter', 'export-scene')
   ```

## 📁 檔案結構確認

確保以下檔案存在：
```
extensions/scene-converter/
├── package.json               ✅
├── main.js                   ✅
├── panels/
│   └── default/
│       └── index.js          ✅ (剛更新)
└── src/
    └── panels/
        └── default/
            └── index.html    ✅ (剛更新)
```

## 💡 提示

- 面板使用 Shadow DOM，所以用 `this.shadowRoot.querySelector()` 獲取元素
- 事件綁定在 `exports.ready` 函數中完成
- 按鈕點擊會觸發 `Editor.Message.request()` 與後端通信
