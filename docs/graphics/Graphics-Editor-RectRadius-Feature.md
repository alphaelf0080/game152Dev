# Graphics Editor 圓角矩形功能

## 功能概述
為 Graphics Editor 的矩形（Rectangle）工具添加圓角半徑輸入功能，允許用戶繪製具有圓角的矩形。

## 實現詳節

### 1. HTML UI 元件 (`default.html`)
**位置**: 第 232-235 行

在工具欄中添加圓角半徑輸入控制：
```html
<!-- 矩形圓角半徑 -->
<div class="toolbar-section" id="rectRadiusSection">
    <label>圓角:</label>
    <input type="number" id="rectRadius" value="0" min="0" max="100" title="矩形圓角半徑">
    <span style="font-size: 12px; color: #aaa;">px</span>
</div>
```

### 2. TypeScript 類別屬性 (`default.ts`)
**位置**: 第 402 行

定義矩形圓角半徑屬性：
```typescript
private rectRadius: number = 0; // 矩形圓角半徑
```

### 3. 事件監聽綁定 (`default.ts`)
**位置**: 第 847-849 行

綁定圓角半徑輸入變更事件：
```typescript
// 矩形圓角
this.panel.$.rectRadius.addEventListener('change', (e: any) => {
    this.rectRadius = parseInt(e.target.value);
});
```

### 4. 預覽繪製方法 (`default.ts`)
**位置**: 第 1147-1165 行

修改 `previewRect()` 方法以支持圓角：
```typescript
previewRect(x1: number, y1: number, x2: number, y2: number) {
    const width = x2 - x1;
    const height = y2 - y1;
    const radius = this.rectRadius > 0 ? this.rectRadius : 0;
    
    if (radius > 0) {
        // 繪製圓角矩形
        this.drawRoundedRect(x1, y1, width, height, radius);
    } else {
        // 繪製普通矩形
        if (this.fillMode) {
            this.drawCtx.fillRect(x1, y1, width, height);
        }
        if (this.strokeMode) {
            this.drawCtx.strokeRect(x1, y1, width, height);
        }
    }
}
```

### 5. 圓角矩形繪製方法 (`default.ts`)
**位置**: 第 1167-1188 行

新增 `drawRoundedRect()` 方法使用 Canvas arcTo API：
```typescript
private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
    // 確保 radius 不超過矩形尺寸的一半
    const maxRadius = Math.min(width / 2, height / 2);
    const r = Math.min(radius, maxRadius);

    this.drawCtx.beginPath();
    this.drawCtx.moveTo(x + r, y);
    this.drawCtx.lineTo(x + width - r, y);
    this.drawCtx.arcTo(x + width, y, x + width, y + r, r);
    this.drawCtx.lineTo(x + width, y + height - r);
    this.drawCtx.arcTo(x + width, y + height, x + width - r, y + height, r);
    this.drawCtx.lineTo(x + r, y + height);
    this.drawCtx.arcTo(x, y + height, x, y + height - r, r);
    this.drawCtx.lineTo(x, y + r);
    this.drawCtx.arcTo(x, y, x + r, y, r);
    this.drawCtx.closePath();

    if (this.fillMode) {
        this.drawCtx.fill();
    }
    if (this.strokeMode) {
        this.drawCtx.stroke();
    }
}
```

### 6. 形狀序列化 (`default.ts`)
**位置**: 第 1126-1140 行

在 `onMouseUp()` 方法中添加 `rectRadius` 到形狀物件：
```typescript
const shape = {
    tool: this.currentTool,
    startX: this.startX,
    startY: this.startY,
    endX: endX,
    endY: endY,
    fillColor: this.fillColor,
    fillAlpha: this.fillAlpha,
    strokeColor: this.strokeColor,
    strokeAlpha: this.strokeAlpha,
    lineWidth: this.lineWidth,
    rectRadius: this.rectRadius,  // 新增
    fillMode: this.fillMode,
    strokeMode: this.strokeMode
};
```

### 7. 形狀繪製更新 (`default.ts`)
**位置**: 第 1219-1232 行

修改 `redraw()` 方法中的 rect 案例以支持圓角：
```typescript
case 'rect':
    const width = shape.endX - shape.startX;
    const height = shape.endY - shape.startY;
    const rectRadius = shape.rectRadius || 0;
    if (rectRadius > 0) {
        // 繪製圓角矩形
        this.drawRoundedRect(shape.startX, shape.startY, width, height, rectRadius);
    } else {
        // 繪製普通矩形
        if (shape.fillMode) this.drawCtx.fillRect(shape.startX, shape.startY, width, height);
        if (shape.strokeMode) this.drawCtx.strokeRect(shape.startX, shape.startY, width, height);
    }
    break;
```

## 技術特性

### 圓角繪製演算法
- 使用 Canvas 2D API 的 `arcTo()` 方法
- 路徑由四條直線和四個圓弧組成
- 自動限制半徑不超過矩形尺寸的一半，防止無效的圓角

### UI 特性
- 範圍輸入：0-100 像素
- 實時更新：用戶調整輸入後立即反映在預覽中
- 單位標示：顯示 "px" 單位
- 默認值：0（無圓角）

### 兼容性
- 支持所有現代瀏覽器（Chrome, Firefox, Safari, Edge）
- Canvas 2D arcTo() 方法廣泛支持
- 向後相容：無半徑時使用傳統矩形繪製

## 使用流程

1. **選擇矩形工具**: 點擊工具欄中的 "rect" 按鈕
2. **設置圓角**: 在 "圓角:" 輸入框中輸入所需的半徑值（0-100px）
3. **繪製矩形**: 在畫布上拖動來繪製圓角矩形
4. **即時預覽**: 拖動時可看到圓角效果實時預覽
5. **保存圖形**: 鬆開鼠標按鈕時圖形自動保存

## 編譯狀態
✅ **編譯成功** - 無 TypeScript 錯誤
- 所有方法正確實現
- 類型定義完整
- Canvas API 調用正確

## 測試建議

1. **基本功能**
   - [ ] 修改圓角半徑值，確認 UI 響應
   - [ ] 繪製半徑為 0 的矩形（應為普通矩形）
   - [ ] 繪製不同半徑的矩形（5px, 10px, 20px 等）

2. **邊界條件**
   - [ ] 繪製非常小的矩形並設置大圓角（應自動限制）
   - [ ] 繪製各種寬高比的矩形

3. **填充和描邊**
   - [ ] 測試各種填充/描邊組合
   - [ ] 驗證圓角在填充和描邊時都正確

4. **持久化**
   - [ ] 繪製圓角矩形後撤銷/重做
   - [ ] 導出代碼確認圓角參數被保存

## 相關檔案
- `default.html` - UI 層面
- `default.ts` - 邏輯實現層面
- `default.css` - 樣式（可選）

## 版本信息
- Graphics Editor 版本: 1.2.1
- TypeScript 版本: 5.8.3
- Canvas 2D API: 標準規範
- 編譯日期: 2025-01

## 未來增強
- [ ] 支持獨立控制四個角的圓角半徑
- [ ] 預設圓角值按鈕
- [ ] 圓角半徑鍵盤快捷鍵 (減少/增加)
- [ ] 圓角半徑動畫編輯
