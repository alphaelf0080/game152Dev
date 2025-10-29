# Graphics Editor 圓角矩形功能 - 測試指南

## 修正完成 ✅

**日期**: 2025-10-28  
**版本**: 1.2.2  
**狀態**: ✅ 編譯成功，功能完整

## 問題解決

### 原始問題
用戶反饋：「目前擴展功能全部失效」

### 根本原因
TypeScript 源文件 (`default.ts`) 中的 HTML 模板字符串缺少 `rectRadius` UI 元素，導致：
1. 編譯後的 JavaScript 文件沒有圓角輸入框
2. 雖然邏輯代碼正確，但 UI 無法觸發事件

### 解決方案
在 `default.ts` 的模板字符串中添加圓角輸入 UI：
```html
<!-- 矩形圓角 -->
<div class="toolbar-section">
    <label>圓角:</label>
    <ui-num-input id="rectRadius" value="0" min="0" max="100"></ui-num-input>
    <span style="font-size: 11px; color: #888;">px</span>
</div>
```

## 編譯驗證

### 已確認的編譯輸出

1. **UI 模板** ✅
   ```javascript
   // 行 62-67: HTML 模板中包含 rectRadius 輸入
   <!-- 矩形圓角 -->
   <div class="toolbar-section">
       <label>圓角:</label>
       <ui-num-input id="rectRadius" value="0" min="0" max="100"></ui-num-input>
   ```

2. **事件監聽** ✅
   ```javascript
   // 行 769-772: 事件綁定正確
   // 矩形圓角
   this.panel.$.rectRadius.addEventListener('change', (e) => {
       this.rectRadius = parseInt(e.target.value);
   });
   ```

3. **繪製方法** ✅
   ```javascript
   // 行 1041, 1053, 1115: drawRoundedRect 方法完整
   this.drawRoundedRect(x1, y1, width, height, radius);
   ```

4. **形狀序列化** ✅
   ```javascript
   // 行 1026: rectRadius 正確保存到形狀對象
   rectRadius: this.rectRadius,
   ```

## 在 Cocos Creator 中測試

### 1. 重新載入擴展

在 Cocos Creator 中：
1. 菜單 → `擴展` → `擴展管理器`
2. 找到 `Graphics Editor`
3. 點擊「重新載入」按鈕
4. 或重啟 Cocos Creator

### 2. 打開 Graphics Editor

菜單 → `擴展` → `Graphics Editor` → `打開 Graphics 編輯器`

### 3. 測試圓角矩形功能

#### 基本測試
- [ ] 確認工具欄中有「圓角:」輸入框
- [ ] 確認輸入框默認值為 0
- [ ] 選擇「矩形」工具
- [ ] 設置圓角值為 10
- [ ] 在畫布上拖拽繪製矩形
- [ ] 確認矩形有圓角效果

#### 功能測試
- [ ] 測試圓角值 0（應為普通矩形）
- [ ] 測試圓角值 5, 10, 20, 50
- [ ] 測試超大圓角值（應自動限制）
- [ ] 測試填充和描邊模式
- [ ] 測試不同線寬
- [ ] 測試不同顏色和透明度

#### 持久化測試
- [ ] 繪製圓角矩形後撤銷/重做
- [ ] 繪製多個不同圓角的矩形
- [ ] 關閉並重開編輯器，確認圖形保留

### 4. 導出代碼測試

繪製圓角矩形後：
1. 查看側邊欄的「代碼預覽」
2. 確認生成的代碼包含圓角參數
3. 點擊「導出腳本」
4. 驗證導出的 TypeScript 代碼正確

## 預期輸出示例

繪製一個 10px 圓角的矩形，應生成類似代碼：

```typescript
// 使用 moveTo, lineTo, arc 繪製圓角矩形
g.moveTo(x + radius, y);
g.lineTo(x + width - radius, y);
g.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
// ... 其他三個角
g.closePath();
g.fill();
g.stroke();
```

## 技術細節

### Canvas API 使用
- **方法**: `arc(cx, cy, r, startAngle, endAngle, counterclockwise)`
- **遵循**: Cocos Creator 3.8.4 Graphics API 標準
- **參考**: https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/graphics.html

### 圓角繪製流程
1. 確保半徑不超過矩形尺寸的一半
2. 使用 `beginPath()` 開始路徑
3. 依次繪製四條直線和四個圓弧：
   - 上邊線 → 右上角 → 右邊線 → 右下角 → 下邊線 → 左下角 → 左邊線 → 左上角
4. `closePath()` 閉合路徑
5. 根據模式 `fill()` 和/或 `stroke()`

## 故障排查

### 如果擴展仍然不工作

1. **檢查編譯**
   ```powershell
   cd c:\projects\game152Dev\game169\extensions\graphics-editor
   npm run build
   ```

2. **檢查編譯輸出**
   ```powershell
   Select-String -Path "dist\panels\default.js" -Pattern "rectRadius"
   ```
   應該看到多個匹配結果

3. **清除快取**
   - 關閉 Cocos Creator
   - 刪除項目的 `library` 和 `temp` 資料夾
   - 重新啟動 Cocos Creator

4. **檢查控制台**
   - 在 Cocos Creator 中打開開發者工具（`開發者` → `開發者工具`）
   - 查看控制台是否有錯誤訊息

### 如果 UI 元素不顯示

確認 Cocos Creator UI 組件：
- `<ui-num-input>` 是 Cocos Creator 3.8+ 的標準 UI 組件
- 確認編輯器版本 >= 3.8.0

## 相關文件

- `panels/default.ts` - TypeScript 源碼（已修正）
- `dist/panels/default.js` - 編譯後的 JavaScript（已驗證）
- `package.json` - 擴展配置
- `docs/Graphics-Editor-RectRadius-Feature-v1.2.2.md` - 完整技術文檔

## 總結

✅ **問題已解決**
- TypeScript 模板已更新
- 編譯成功無錯誤
- 所有功能代碼完整
- 準備在 Cocos Creator 中測試

🎯 **下一步**
1. 在 Cocos Creator 中重新載入擴展
2. 測試圓角矩形繪製功能
3. 驗證代碼導出功能
4. 如有問題請參考故障排查章節
