# Graphics Editor 故障排查指南

## 問題：無法創建矩形、無法 pan 畫面、無法繪製各種圖形

### 症狀
- 點擊矩形工具後無法在畫布上繪製
- 無法拖動平移畫面
- 其他繪圖工具也無法使用

### 可能原因

1. **Cocos Creator 擴展緩存未更新**
2. **擴展未正確重新載入**
3. **瀏覽器緩存問題**

### 解決方案

#### 方法 1: 重新載入擴展（推薦）

1. 在 Cocos Creator 中：
   - 打開菜單 → `擴展` → `擴展管理器`
   - 找到 `Graphics Editor`
   - 點擊「重新載入」按鈕（刷新圖標）
   - 等待擴展重新載入完成

2. 重新打開 Graphics Editor：
   - 菜單 → `擴展` → `Graphics Editor` → `打開 Graphics 編輯器`

#### 方法 2: 重啟 Cocos Creator

如果方法 1 無效，完全關閉並重新啟動 Cocos Creator：

```powershell
# 確保編譯最新代碼
cd c:\projects\game152Dev\game169\extensions\graphics-editor
npm run build

# 然後重啟 Cocos Creator
```

#### 方法 3: 清除緩存（最徹底）

1. **關閉 Cocos Creator**

2. **清除項目緩存**：
   ```powershell
   cd c:\projects\game152Dev\game169
   
   # 刪除緩存目錄
   Remove-Item -Path "library" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path "temp" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path "local" -Recurse -Force -ErrorAction SilentlyContinue
   ```

3. **重新編譯擴展**：
   ```powershell
   cd extensions\graphics-editor
   npm run build
   ```

4. **重新啟動 Cocos Creator**

#### 方法 4: 檢查開發者工具

1. 在 Graphics Editor 面板中：
   - Windows/Linux: 按 `Ctrl + Shift + I` 或 `F12`
   - Mac: 按 `Cmd + Option + I`

2. 查看 Console 標籤頁是否有錯誤訊息

3. 常見錯誤及解決方法：
   - **找不到 rectRadius 元素**: 擴展未正確重載，使用方法 1 或 2
   - **Cannot read property of undefined**: 可能是緩存問題，使用方法 3
   - **Event listener not working**: 重新載入擴展

### 驗證功能正常

成功重載後，應該能看到：

1. **工具欄正常顯示**：
   - 背景圖控制
   - 坐標系統選擇
   - 繪圖工具按鈕（矩形、圓形、線條等）
   - 顏色和透明度控制
   - **圓角半徑輸入框**（新增）

2. **矩形工具測試**：
   - 點擊「矩形」按鈕
   - 設置圓角值為 0（普通矩形）
   - 在畫布上拖拽滑鼠
   - 應該能看到矩形預覽
   - 釋放滑鼠後矩形被保存

3. **圓角矩形測試**：
   - 設置圓角值為 10-20
   - 在畫布上拖拽繪製
   - 應該能看到圓角效果

4. **平移畫面測試**：
   - 按住滑鼠中鍵拖動
   - 或按住空格鍵 + 滑鼠左鍵拖動
   - 畫布應該能平移

### 功能驗證清單

- [ ] 擴展在擴展管理器中顯示為「啟用」狀態
- [ ] Graphics Editor 面板能正常打開
- [ ] 工具欄所有元素正確顯示
- [ ] 能看到「圓角:」輸入框
- [ ] 矩形工具能正常繪製
- [ ] 其他工具（圓形、線條）能正常使用
- [ ] 能用中鍵或空格鍵平移畫布
- [ ] 代碼預覽區域有內容更新

### 如果問題仍然存在

#### 檢查編譯狀態

```powershell
cd c:\projects\game152Dev\game169\extensions\graphics-editor

# 清理並重新編譯
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
npm run build

# 檢查編譯輸出
Select-String -Path "dist\panels\default.js" -Pattern "rectRadius" | Select-Object -First 3
```

應該看到類似輸出：
```
dist\panels\default.js:65:            <ui-num-input id="rectRadius" value="0" min="0" max="100"></ui-num-input>
dist\panels\default.js:402:        this.rectRadius = 0; // 矩形圓角半徑
dist\panels\default.js:770:        this.panel.$.rectRadius.addEventListener('change', (e) => {
```

#### 檢查文件時間戳

```powershell
Get-Item "dist\panels\default.js" | Select-Object FullName, LastWriteTime
```

確保文件是最近編譯的（應該是當前日期時間）。

#### 手動檢查編譯文件

打開 `dist\panels\default.js` 文件，搜索 `rectRadius`，應該能找到：
1. HTML 模板中的 UI 元素定義
2. 屬性初始化 `this.rectRadius = 0`
3. 事件監聽器綁定
4. `drawRoundedRect` 方法定義
5. 在 shape 對象中保存 rectRadius

### 緊急回退方案

如果所有方法都無效，可以回退到上一個穩定版本：

```powershell
cd c:\projects\game152Dev

# 回退 Graphics Editor
git checkout HEAD~1 -- game169/extensions/graphics-editor/

# 重新編譯
cd game169\extensions\graphics-editor
npm run build
```

然後在 Cocos Creator 中重新載入擴展。

### 聯絡支持

如果問題持續存在，請提供：
1. Cocos Creator 版本號
2. 開發者工具中的完整錯誤訊息
3. `dist\panels\default.js` 文件的前 100 行
4. 執行 `npm run build` 的完整輸出

---

## 技術細節

### 圓角矩形實現

新增的圓角功能使用標準 Canvas API：

```typescript
// 使用 moveTo, lineTo 和 arc 組合
this.drawCtx.beginPath();
this.drawCtx.moveTo(x + r, y);
this.drawCtx.lineTo(x + width - r, y);
this.drawCtx.arc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
// ... 其他三個角
this.drawCtx.closePath();
this.drawCtx.fill();  // 或 stroke()
```

### 變更內容

1. 添加 UI 元素：`<ui-num-input id="rectRadius" value="0" min="0" max="100">`
2. 添加屬性：`private rectRadius: number = 0;`
3. 添加事件監聽器
4. 新增 `drawRoundedRect()` 方法
5. 修改 `previewRect()` 支持圓角
6. 修改 `redraw()` 支持保存的圓角矩形

### 不應該影響的功能

- 其他工具（圓形、線條、折線等）
- 畫布平移和縮放
- 背景圖片加載
- 代碼生成和導出

這些功能的代碼沒有被修改，應該保持正常工作。

如果這些功能也失效，問題是**擴展未正確載入**，而不是代碼問題。
