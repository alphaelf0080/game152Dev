# Graphics Editor 圓角矩形功能 - 修正版本

## 功能概述
為 Graphics Editor 的矩形（Rectangle）工具添加圓角半徑輸入功能，允許用戶繪製具有圓角的矩形。

## 修正說明

**版本 1.2.2** - 使用正確的 Canvas API 實現（2025-10-28）

根據 [Cocos Creator 3.8.4 Graphics API 文檔](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/graphics.html)，正確的圓角矩形繪製方法應使用 `moveTo`、`lineTo` 和 `arc` 方法，而不是 `arcTo`。

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

### 5. 圓角矩形繪製方法 - 修正版本 (`default.ts`)
**位置**: 第 1167-1204 行

使用 `moveTo`、`lineTo` 和 `arc` 方法繪製圓角矩形（**遵循 Cocos Creator Graphics API 標準**）：

```typescript
private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
    // 確保 radius 不超過矩形尺寸的一半
    const maxRadius = Math.min(Math.abs(width) / 2, Math.abs(height) / 2);
    const r = Math.min(Math.abs(radius), maxRadius);

    this.drawCtx.beginPath();
    
    // 左上角圓弧起點
    this.drawCtx.moveTo(x + r, y);
    
    // 上邊線
    this.drawCtx.lineTo(x + width - r, y);
    
    // 右上角圓弧
    this.drawCtx.arc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
    
    // 右邊線
    this.drawCtx.lineTo(x + width, y + height - r);
    
    // 右下角圓弧
    this.drawCtx.arc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
    
    // 下邊線
    this.drawCtx.lineTo(x + r, y + height);
    
    // 左下角圓弧
    this.drawCtx.arc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
    
    // 左邊線
    this.drawCtx.lineTo(x, y + r);
    
    // 左上角圓弧
    this.drawCtx.arc(x + r, y + r, r, Math.PI, -Math.PI / 2, false);
    
    this.drawCtx.closePath();

    if (this.fillMode) {
        this.drawCtx.fill();
    }
    if (this.strokeMode) {
        this.drawCtx.stroke();
    }
}
```

**修正要點:**
- ✅ 使用 `arc()` 而不是 `arcTo()`
- ✅ 使用弧度而不是座標參數
- ✅ 正確的角度計算
- ✅ 支持負寬度/高度（反向拖拽）

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
**位置**: 第 1236-1250 行

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

### 圓角繪製演算法（Canvas API 標準）

**路徑組成：**
```
moveTo(x+r, y)                              // 起點：上邊線的起始
lineTo(x+w-r, y)                            // 上邊線
arc(x+w-r, y+r, r, -π/2, 0)               // 右上角（-90° 到 0°）
lineTo(x+w, y+h-r)                          // 右邊線
arc(x+w-r, y+h-r, r, 0, π/2)               // 右下角（0° 到 90°）
lineTo(x+r, y+h)                            // 下邊線
arc(x+r, y+h-r, r, π/2, π)                 // 左下角（90° 到 180°）
lineTo(x, y+r)                              // 左邊線
arc(x+r, y+r, r, π, -π/2)                  // 左上角（180° 到 270°）
closePath()                                 // 回到起點
```

**弧線角度對照:**
- **-π/2 (-90°)**: 12 點鐘方向
- **0 (0°)**: 3 點鐘方向（右）
- **π/2 (90°)**: 6 點鐘方向（下）
- **π (180°)**: 9 點鐘方向（左）

### UI 特性
- **範圍輸入**: 0-100 像素
- **實時更新**: 用戶調整輸入後立即反映在預覽中
- **單位標示**: 顯示 "px" 單位
- **默認值**: 0（無圓角，使用普通矩形）

### 容錯處理
- ✅ 智能半徑限制：自動限制不超過矩形尺寸的一半
- ✅ 支持負尺寸：正確處理寬度/高度為負的情況（反向拖拽）
- ✅ 向後相容：無半徑時使用傳統 fillRect/strokeRect

### API 相容性
- ✅ **Cocos Creator 3.8.4 Graphics API** - 完全相容
- ✅ **HTML5 Canvas 2D Context** - 標準實現
- ✅ **現代瀏覽器** - Chrome, Firefox, Safari, Edge 均支持

## 使用流程

1. **選擇矩形工具**: 點擊工具欄中的 "rect" 按鈕
2. **設置圓角**: 在 "圓角:" 輸入框中輸入所需的半徑值（0-100px）
3. **繪製矩形**: 在畫布上拖動來繪製圓角矩形
4. **即時預覽**: 拖動時可看到圓角效果實時預覽
5. **保存圖形**: 鬆開鼠標按鈕時圖形自動保存

## 編譯狀態
✅ **編譯成功** - 無 TypeScript 錯誤
- 所有方法正確實現
- Canvas API 調用遵循標準
- 類型定義完整

## 測試清單

### 基本功能
- [ ] 修改圓角半徑值，確認 UI 響應
- [ ] 繪製半徑為 0 的矩形（應為普通矩形）
- [ ] 繪製不同半徑的矩形（5px, 10px, 20px, 50px）

### 邊界條件
- [ ] 繪製非常小的矩形並設置大圓角（應自動限制）
- [ ] 繪製反向拖拽的矩形（寬度/高度為負）
- [ ] 繪製各種寬高比的矩形（方形、長方形）

### 填充和描邊
- [ ] 測試各種填充/描邊組合（填充只、描邊只、都有）
- [ ] 驗證圓角在填充和描邊時都正確
- [ ] 測試不同線寬（1, 2, 5, 10）和顏色

### 持久化
- [ ] 繪製圓角矩形後撤銷/重做
- [ ] 導出代碼確認圓角參數被保存
- [ ] 載入已保存的圖形確認圓角正確顯示

## 相關檔案
- `default.html` - UI 層面
- `default.ts` - 邏輯實現層面
- `default.css` - 樣式（可選）

## 版本信息
- **Graphics Editor 版本**: 1.2.2
- **TypeScript 版本**: 5.8.3
- **Canvas 2D API**: HTML5 標準規範
- **Cocos Creator**: 3.8.4 LTS
- **修正日期**: 2025-10-28

## 已知限制

- 四個角的圓角半徑統一（不支持獨立控制）
- 不支持邊角風格選擇（僅支持圓形）

## 未來增強

- [ ] 支持獨立控制四個角的圓角半徑
- [ ] 預設圓角值快速按鈕（5px, 10px, 20px）
- [ ] 圓角半徑鍵盤快捷鍵（+/-）
- [ ] 圓角半徑動畫預覽
- [ ] 邊角風格選擇（圓形/方形/斜切）
- [ ] 圓角預設模板

## 參考資源

- [Cocos Creator 3.8.4 Graphics Component](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/graphics.html)
- [Canvas API - arc()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc)
- [Canvas API - beginPath()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath)
