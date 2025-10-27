# Graphics Editor Mask 使用快速參考

## 🎯 快速步驟

```
1. Graphics Editor 繪製形狀
         ↓
2. 導出 TypeScript 腳本
         ↓
3. 複製繪圖代碼
         ↓
4. 修改顏色為白色
         ↓
5. 貼到 Mask 腳本中
         ↓
6. 完成！✅
```

## 📋 代碼轉換檢查清單

### 從 Graphics Editor 導出：
```typescript
// ❌ 原始導出代碼（帶顏色和描邊）
g.fillColor.set(255, 0, 0, 255);      // 紅色填充
g.strokeColor.set(0, 0, 0, 255);      // 黑色描邊
g.lineWidth = 2;

g.rect(-163, 123, 381, -507);
g.fill();
g.stroke();  // ❌ 遮罩不需要描邊
```

### 轉換為 Mask 用途：
```typescript
// ✅ 修改後（只用白色填充）
g.fillColor.set(255, 255, 255, 255);  // ✅ 白色填充（必須）

g.rect(-163, 123, 381, -507);
g.fill();    // ✅ 只需要填充
// 移除 g.stroke()
```

## 🎨 常見形狀示例

### 矩形遮罩
```typescript
drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255);
    
    // 720x1080 的矩形（老虎機捲軸）
    g.rect(-360, 540, 720, -1080);
    g.fill();
}
```

### 圓形遮罩
```typescript
drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255);
    
    // 半徑 100 的圓（頭像）
    g.circle(0, 0, 100);
    g.fill();
}
```

### 自定義折線遮罩
```typescript
drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255);
    
    // 五邊形
    g.moveTo(0, 100);
    g.lineTo(95, 31);
    g.lineTo(59, -81);
    g.lineTo(-59, -81);
    g.lineTo(-95, 31);
    g.close();  // ⚠️ 折線必須閉合
    g.fill();
}
```

## 🏗️ 場景設置

### 節點結構
```
MaskContainer
  │
  ├─ MaskShape ← 遮罩層
  │   ├─ UITransform (必須)
  │   ├─ Graphics (必須)
  │   ├─ Mask (Type: GRAPHICS_STENCIL)
  │   └─ GraphicsEditorMask.ts
  │
  └─ Content ← 被遮罩的內容（子節點）
      ├─ Sprite
      ├─ Label
      └─ 其他 UI
```

### 組件配置

**Mask 組件：**
- ✅ Type: `GRAPHICS_STENCIL`
- ✅ Inverted: `false`（不反轉）
- ✅ Segments: `64`（圓形平滑度）

**Graphics 組件：**
- ✅ Line Width: `1`
- ✅ Src Blend Factor: `SRC_ALPHA`
- ✅ Dst Blend Factor: `ONE_MINUS_SRC_ALPHA`

## ⚠️ 常見問題

### 問題 1：遮罩沒有效果
**原因：** 被遮罩內容不是 Mask 節點的子節點  
**解決：** 確保內容在層級上是 Mask 節點的子節點

### 問題 2：遮罩形狀不正確
**原因：** 座標系統理解錯誤  
**解決：** Graphics Editor 已經自動轉換為 Cocos 座標系，直接複製即可

### 問題 3：遮罩顯示黑色或有顏色
**原因：** 沒有使用白色 (255, 255, 255, 255)  
**解決：** 必須使用純白色填充

### 問題 4：折線遮罩不閉合
**原因：** 缺少 `g.close()` 調用  
**解決：** 在 `g.fill()` 之前加上 `g.close()`

## 🔧 除錯技巧

### 1. 顯示遮罩形狀
```typescript
@property debugMode: boolean = false;

drawMaskShape() {
    if (this.debugMode) {
        // 紅色半透明 - 可以看到遮罩區域
        g.fillColor.set(255, 0, 0, 128);
    } else {
        // 白色不透明 - 正常遮罩
        g.fillColor.set(255, 255, 255, 255);
    }
}
```

### 2. 運行時重繪
```typescript
// 在 Inspector 中點擊 "重繪遮罩" 按鈕
@property
get redraw(): boolean { return false; }
set redraw(value: boolean) {
    if (value) this.drawMaskShape();
}
```

## 📦 完整工作流程

### Step 1: Graphics Editor
1. 開啟：**擴展 → Graphics Editor**
2. 繪製形狀（矩形/圓形/折線）
3. 點擊：**導出為 TypeScript 腳本**
4. 保存：`CustomMask.ts`

### Step 2: 修改代碼
```typescript
// 打開導出的文件
// 找到 draw() 方法
// 複製繪圖代碼
```

### Step 3: 創建 Mask 節點
1. 創建空節點 → `MaskNode`
2. 添加 `UITransform`
3. 添加 `Graphics`
4. 添加 `Mask` (Type: GRAPHICS_STENCIL)
5. 添加 `GraphicsEditorMask.ts` 腳本

### Step 4: 貼上代碼
```typescript
// 在 GraphicsEditorMask.ts 的 drawMaskShape() 中
drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255); // ← 改為白色
    
    // ← 貼上從 Graphics Editor 複製的繪圖代碼
    g.rect(-360, 540, 720, -1080);
    g.fill();
}
```

### Step 5: 添加內容
1. 在 `MaskNode` 下創建子節點
2. 添加 Sprite/Label 等組件
3. 運行預覽

## 💡 進階用法

### 動態調整遮罩大小
```typescript
private maskWidth: number = 720;
private maskHeight: number = 1080;

setMaskSize(w: number, h: number) {
    this.maskWidth = w;
    this.maskHeight = h;
    this.drawMaskShape();
}
```

### 動畫遮罩
```typescript
import { tween } from 'cc';

animateRadius(targetRadius: number) {
    tween(this)
        .to(1.0, { currentRadius: targetRadius }, {
            onUpdate: () => this.drawMaskShape()
        })
        .start();
}
```

### 多個遮罩形狀切換
```typescript
@property shapeType: string = 'rect'; // 'rect', 'circle', 'polygon'

drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255);
    
    switch (this.shapeType) {
        case 'rect':
            g.rect(-360, 540, 720, -1080);
            break;
        case 'circle':
            g.circle(0, 0, 200);
            break;
        case 'polygon':
            this.drawPolygon();
            break;
    }
    g.fill();
}
```

## 📚 相關文檔

- 📖 完整指南：`docs/Graphics-Editor-Mask-Usage-Guide.md`
- 📄 示例腳本：`assets/script/GraphicsEditorMask.ts`
- 🎨 Graphics Editor 文檔：`docs/Initial-Board-Editor-Visual-Guide.md`

## ✅ 總結

| 步驟 | 動作 | 要點 |
|------|------|------|
| 1 | 繪製形狀 | Graphics Editor 中設計 |
| 2 | 導出代碼 | 點擊導出按鈕 |
| 3 | 修改顏色 | 改為白色 (255,255,255,255) |
| 4 | 移除描邊 | 刪除 stroke() 調用 |
| 5 | 閉合路徑 | 折線記得 close() |
| 6 | 設置節點 | Graphics + Mask 組件 |
| 7 | 添加內容 | 作為子節點 |

🎉 現在你可以用 Graphics Editor 快速創建任意形狀的遮罩了！
