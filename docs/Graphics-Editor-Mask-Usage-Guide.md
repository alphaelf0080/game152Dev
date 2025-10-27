# Graphics Editor 導出圖形用作 Mask 使用指南

## 概述

Graphics Editor 導出的 TypeScript 代碼可以直接用於創建 Cocos Creator 的 Mask（遮罩）組件，實現各種形狀的遮罩效果。

## 使用步驟

### 1. 在 Graphics Editor 中繪製形狀

1. 打開 Cocos Creator
2. 菜單：**擴展 → Graphics Editor**
3. 繪製你想要的遮罩形狀（矩形、圓形、折線等）
4. 點擊 **"導出為 TypeScript 腳本"**
5. 選擇保存位置（建議：`assets/script/mask/`）

### 2. 使用導出的代碼創建 Mask 組件

#### 方法 A：直接使用 Graphics 組件 + Mask 組件

```typescript
import { _decorator, Component, Node, Graphics, Mask } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomMaskShape')
export class CustomMaskShape extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    @property(Mask)
    mask: Mask | null = null;
    
    start() {
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
        
        if (!this.mask) {
            this.mask = this.getComponent(Mask);
        }
        
        // 繪製遮罩形狀
        this.drawMaskShape();
    }
    
    drawMaskShape() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        
        // === 這裡貼上從 Graphics Editor 導出的繪圖代碼 ===
        // 例如：
        
        // 設置填充顏色（白色，完全不透明用於遮罩）
        g.fillColor.set(255, 255, 255, 255);
        
        // 繪製矩形遮罩
        g.rect(-163, 123, 381, -507);
        g.fill();
        
        // === 導出代碼結束 ===
    }
}
```

#### 方法 B：使用獨立的 Mask 腳本類

將 Graphics Editor 導出的完整腳本稍作修改：

**原始導出代碼：**
```typescript
// CustomGraphics.ts (從 Graphics Editor 導出)
import { _decorator, Component, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomGraphics')
export class CustomGraphics extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    start() {
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
        this.draw();
    }
    
    draw() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        
        // 設置填充顏色 (R:255, G:0, B:0, A:255)
        g.fillColor.set(255, 0, 0, 255);
        
        // 繪製圖形...
    }
}
```

**修改為 Mask 用途：**
```typescript
// CustomMaskGraphics.ts (修改後)
import { _decorator, Component, Graphics, Mask } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomMaskGraphics')
export class CustomMaskGraphics extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    @property(Mask)
    mask: Mask | null = null;
    
    @property({
        displayName: '重繪遮罩形狀',
        tooltip: '點擊以重新繪製遮罩'
    })
    get redraw(): boolean {
        return false;
    }
    set redraw(value: boolean) {
        if (value) {
            this.draw();
        }
    }
    
    start() {
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
        
        if (!this.mask) {
            this.mask = this.getComponent(Mask);
        }
        
        this.draw();
    }
    
    draw() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        
        // ⚠️ 重要：Mask 必須使用白色填充
        g.fillColor.set(255, 255, 255, 255);
        
        // === 這裡貼上從 Graphics Editor 導出的繪圖代碼 ===
        // 只需要 fill() 和圖形繪製部分，不需要 stroke()
        
        g.rect(-163, 123, 381, -507);
        g.fill();
        
        // === 導出代碼結束 ===
    }
}
```

### 3. 在場景中設置 Mask

#### 場景結構：
```
MaskContainer (Node)
  ├─ MaskShape (Node) - 遮罩層
  │   ├─ UITransform
  │   ├─ Graphics (用於繪製遮罩形狀)
  │   ├─ Mask (Type: GRAPHICS_STENCIL)
  │   └─ CustomMaskGraphics (你的腳本)
  │
  └─ Content (Node) - 被遮罩的內容
      ├─ UITransform
      └─ Sprite / Label / 任何需要被遮罩的內容
```

#### 設置步驟：

1. **創建 Mask 節點：**
   - 右鍵層級管理器 → 創建 → 創建空節點
   - 重命名為 `MaskShape`
   - 添加組件：`UITransform`
   - 添加組件：`Graphics`
   - 添加組件：`Mask`
   - 添加腳本：`CustomMaskGraphics`

2. **配置 Mask 組件：**
   - **Type**: `GRAPHICS_STENCIL`（使用 Graphics 繪製）
   - **Inverted**: `false`（正常遮罩，不反轉）
   - **Segments**: `64`（圓形遮罩的平滑度）

3. **配置腳本：**
   - 將 `Graphics` 組件拖到腳本的 `graphics` 屬性
   - 將 `Mask` 組件拖到腳本的 `mask` 屬性

4. **添加被遮罩內容：**
   - 在 `MaskShape` 節點下創建子節點
   - 添加 Sprite、Label 或其他 UI 組件
   - 這些內容會被遮罩裁剪

## 實際應用示例

### 示例 1：圓形頭像遮罩

```typescript
// CircleAvatarMask.ts
import { _decorator, Component, Graphics, Mask } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CircleAvatarMask')
export class CircleAvatarMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    @property({
        displayName: '半徑',
        tooltip: '圓形遮罩的半徑'
    })
    radius: number = 100;
    
    start() {
        this.graphics = this.getComponent(Graphics);
        this.drawCircleMask();
    }
    
    drawCircleMask() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        g.fillColor.set(255, 255, 255, 255);
        
        // 繪製圓形遮罩（中心點在 0,0）
        g.circle(0, 0, this.radius);
        g.fill();
    }
}
```

### 示例 2：複雜形狀遮罩（老虎機捲軸區域）

```typescript
// SlotReelMask.ts
import { _decorator, Component, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SlotReelMask')
export class SlotReelMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    start() {
        this.graphics = this.getComponent(Graphics);
        this.drawReelMask();
    }
    
    drawReelMask() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        g.fillColor.set(255, 255, 255, 255);
        
        // === 從 Graphics Editor 導出的捲軸遮罩形狀 ===
        // 假設是一個帶圓角的矩形區域
        
        // 設定捲軸可見區域（3x5 符號）
        const width = 720;
        const height = 1080;
        
        // 繪製矩形
        g.rect(-width/2, height/2, width, -height);
        g.fill();
        
        // === 導出代碼結束 ===
    }
}
```

### 示例 3：自定義折線遮罩

```typescript
// PolygonMask.ts
import { _decorator, Component, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PolygonMask')
export class PolygonMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    start() {
        this.graphics = this.getComponent(Graphics);
        this.drawPolygonMask();
    }
    
    drawPolygonMask() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        g.fillColor.set(255, 255, 255, 255);
        
        // === 從 Graphics Editor 導出的折線形狀 ===
        g.moveTo(-163, 123);
        g.lineTo(218, 123);
        g.lineTo(218, -384);
        g.lineTo(-163, -384);
        // 必須閉合路徑
        g.close();
        g.fill();
        
        // === 導出代碼結束 ===
    }
}
```

## 重要注意事項

### ⚠️ Mask 使用要點

1. **顏色設定：**
   - Mask 的 Graphics 必須使用 **白色填充** (`g.fillColor.set(255, 255, 255, 255)`)
   - Alpha 值必須是 255（完全不透明）
   - 顏色本身不會顯示，只用於定義遮罩區域

2. **不需要描邊：**
   - 遮罩不需要 `g.stroke()`
   - 只需要 `g.fill()` 來定義遮罩區域

3. **座標系統：**
   - Graphics Editor 導出的座標已經是 Cocos 坐標系（Y 軸向上）
   - 原點位置取決於你在編輯器中選擇的原點模式

4. **層級結構：**
   - 被遮罩的內容必須是 Mask 節點的 **子節點**
   - 只有子節點會被遮罩影響

5. **性能考慮：**
   - Graphics 遮罩比 Sprite 遮罩性能稍低
   - 避免在 `update()` 中頻繁重繪遮罩
   - 複雜形狀會增加渲染負擔

### 🔧 修改導出代碼的檢查清單

從 Graphics Editor 導出代碼後，需要修改：

- [ ] 將所有顏色設置改為白色：`g.fillColor.set(255, 255, 255, 255)`
- [ ] 移除 `g.strokeColor` 和 `g.stroke()` 調用
- [ ] 確保折線形狀使用 `g.close()` 閉合路徑
- [ ] 只保留 `g.fill()` 調用
- [ ] 添加 `Mask` 組件引用到腳本屬性

## 進階技巧

### 動態調整遮罩

```typescript
@ccclass('DynamicMask')
export class DynamicMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    private maskWidth: number = 720;
    private maskHeight: number = 1080;
    
    start() {
        this.graphics = this.getComponent(Graphics);
        this.updateMask();
    }
    
    // 動態更新遮罩大小
    setMaskSize(width: number, height: number) {
        this.maskWidth = width;
        this.maskHeight = height;
        this.updateMask();
    }
    
    updateMask() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        g.fillColor.set(255, 255, 255, 255);
        
        // 繪製動態大小的矩形遮罩
        g.rect(-this.maskWidth/2, this.maskHeight/2, this.maskWidth, -this.maskHeight);
        g.fill();
    }
}
```

### 動畫遮罩效果

```typescript
import { _decorator, Component, Graphics, tween, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimatedMask')
export class AnimatedMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    private currentRadius: number = 0;
    private targetRadius: number = 200;
    
    start() {
        this.graphics = this.getComponent(Graphics);
        this.animateMask();
    }
    
    animateMask() {
        // 從 0 放大到目標半徑
        tween(this)
            .to(1.0, { currentRadius: this.targetRadius }, {
                onUpdate: () => {
                    this.updateMask();
                }
            })
            .start();
    }
    
    updateMask() {
        const g = this.graphics;
        if (!g) return;
        
        g.clear();
        g.fillColor.set(255, 255, 255, 255);
        
        // 繪製動畫圓形遮罩
        g.circle(0, 0, this.currentRadius);
        g.fill();
    }
}
```

## 除錯技巧

### 1. 顯示遮罩形狀（開發模式）

```typescript
@property({
    displayName: '顯示遮罩形狀（除錯用）',
    tooltip: '顯示遮罩的實際形狀'
})
debugShowMask: boolean = false;

draw() {
    const g = this.graphics;
    if (!g) return;
    
    g.clear();
    
    if (this.debugShowMask) {
        // 除錯模式：用紅色半透明顯示遮罩區域
        g.fillColor.set(255, 0, 0, 128);
    } else {
        // 正常模式：白色不透明
        g.fillColor.set(255, 255, 255, 255);
    }
    
    // 繪製形狀...
    g.rect(-100, 100, 200, -200);
    g.fill();
}
```

### 2. 檢查遮罩是否生效

- 確認 Mask 組件的 Type 設置為 `GRAPHICS_STENCIL`
- 確認被遮罩內容是 Mask 節點的子節點
- 檢查 Graphics 是否正確繪製（使用上面的除錯模式）
- 確認 UITransform 的大小足夠包含遮罩區域

## 總結

使用 Graphics Editor 導出的代碼創建 Mask 的優勢：

✅ **精確控制**：可以繪製任意複雜的遮罩形狀  
✅ **可視化設計**：所見即所得的編輯體驗  
✅ **座標準確**：自動處理座標系轉換  
✅ **快速迭代**：修改形狀只需重新導出  
✅ **代碼清晰**：生成的代碼結構化且易讀  

現在你可以輕鬆地將 Graphics Editor 中繪製的任何形狀用作遊戲中的遮罩效果！🎨
