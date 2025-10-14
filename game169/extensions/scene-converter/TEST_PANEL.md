# 測試面板功能

## 🔍 診斷步驟

### 1. 檢查擴展是否正確載入

在 Cocos Creator 中：
1. 按 `Ctrl + Shift + I` 打開開發者工具
2. 在 Console 中執行以下命令：

```javascript
// 檢查擴展是否載入
Editor.Package.getPackages()
// 應該看到 scene-converter

// 檢查面板是否註冊
Editor.Panel.getPanels()
// 應該看到 scene-converter.default

// 測試直接調用導出方法
await Editor.Message.request('scene-converter', 'export-scene')
```

### 2. 檢查面板元素是否存在

打開面板後，在 Console 中執行：

```javascript
// 獲取面板元素
const panel = document.querySelector('scene-converter.default');
console.log('Panel:', panel);

// 檢查 Shadow DOM
if (panel && panel.shadowRoot) {
    console.log('Shadow Root:', panel.shadowRoot);
    
    // 查找按鈕
    const exportBtn = panel.shadowRoot.querySelector('#exportBtn');
    console.log('Export Button:', exportBtn);
    
    // 手動觸發點擊
    if (exportBtn) {
        exportBtn.click();
    }
}
```

### 3. 檢查錯誤信息

查看 Console 中是否有紅色錯誤信息，常見錯誤：
- `Cannot read property 'querySelector' of null` - Shadow Root 未正確初始化
- `Editor is not defined` - Editor API 未載入
- `shell.openPath is not a function` - electron API 問題

## 🐛 可能的問題

### 問題 1: Shadow Root 未初始化
如果 `this.shadowRoot` 是 null，說明面板模板未正確載入。

**解決方法**：檢查 `panels/default/index.js` 中的 template 路徑是否正確。

### 問題 2: 按鈕未找到
如果 querySelector 返回 null，可能是選擇器錯誤或 HTML 未載入。

**解決方法**：在 ready 函數中添加延遲：
```javascript
exports.ready = async function() {
    await new Promise(resolve => setTimeout(resolve, 100));
    // 然後綁定事件...
}
```

### 問題 3: 事件未觸發
如果按鈕存在但點擊無反應。

**解決方法**：檢查是否有 JavaScript 錯誤阻止了事件綁定。

## 💡 臨時測試方法

創建一個簡單的測試按鈕：

在 Console 中執行：
```javascript
// 測試導出功能
async function testExport() {
    const result = await Editor.Message.request('scene-converter', 'export-scene');
    console.log('Export Result:', result);
}
testExport();

// 測試打開資料夾
function testOpenFolder() {
    const { shell } = require('electron');
    const { join } = require('path');
    const exportDir = join(Editor.Project.path, 'scene-exports');
    shell.openPath(exportDir);
}
testOpenFolder();
```

## 📝 請回報以下信息

1. **擴展載入狀態**：`Editor.Package.getPackages()` 的結果
2. **面板註冊狀態**：`Editor.Panel.getPanels()` 的結果
3. **Console 錯誤**：所有紅色錯誤信息
4. **按鈕元素**：`panel.shadowRoot.querySelector('#exportBtn')` 是否為 null
5. **直接調用結果**：`await Editor.Message.request('scene-converter', 'export-scene')` 的結果
