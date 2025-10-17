# Ramp UV Offset 精準計算指南

## 📅 更新日期
2025-10-17

## 🎯 概述
本指南提供 Ramp UV Offset 的精準計算方法，解決「如何精確控制偏移量」的問題。

---

## 🔢 核心計算公式

### 公式 1: 基於像素偏移
```
rampUVOffset = 像素偏移 / contentSize
```

### 公式 2: 基於百分比偏移
```
rampUVOffset = 百分比 / 100
```

---

## 💡 三種設定方法

### 方法 1️⃣: 基於像素偏移（最精準）

**使用場景**: 當你知道要偏移多少像素時

#### 計算公式
```
offsetX = 像素偏移X / contentSize.width
offsetY = 像素偏移Y / contentSize.height
```

#### 範例計算（contentSize = [696, 540]）

| 像素偏移 | 計算過程 | Offset 值 |
|---------|---------|-----------|
| 向右 100px | 100 / 696 | 0.1437 |
| 向上 50px | 50 / 540 | 0.0926 |
| 向右 174px (25%) | 174 / 696 | 0.2500 |
| 向右 348px (50%) | 348 / 696 | 0.5000 |
| 向上 135px (25%) | 135 / 540 | 0.2500 |
| 向上 270px (50%) | 270 / 540 | 0.5000 |

#### 代碼使用
```typescript
// 方法 A: 使用便捷方法
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.setRampUVOffsetByPixels(100, 50);  // 向右100px，向上50px

// 方法 B: 使用靜態方法
const offset = RampShaderResetInspector.calculateRampUVOffsetFromPixels(
    100, 50,  // 像素偏移
    696, 540  // contentSize
);
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(offset.x, offset.y));
```

---

### 方法 2️⃣: 基於百分比偏移（最直觀）

**使用場景**: 當你想要相對於整體尺寸的百分比偏移時

#### 計算公式
```
offsetX = 百分比X / 100
offsetY = 百分比Y / 100
```

#### 範例計算

| 百分比 | 計算過程 | Offset 值 |
|-------|---------|-----------|
| 10% | 10 / 100 | 0.1000 |
| 25% | 25 / 100 | 0.2500 |
| 33.33% | 33.33 / 100 | 0.3333 |
| 50% | 50 / 100 | 0.5000 |
| 75% | 75 / 100 | 0.7500 |
| 100% | 100 / 100 | 1.0000 |

#### 代碼使用
```typescript
// 方法 A: 使用便捷方法
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.setRampUVOffsetByPercent(25, 10);  // 向右25%，向上10%

// 方法 B: 使用靜態方法
const offset = RampShaderResetInspector.calculateRampUVOffsetFromPercent(25, 10);
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(offset.x, offset.y));
```

---

### 方法 3️⃣: 直接設定 Offset 值

**使用場景**: 當你已經知道精確的 offset 值時

#### 範圍
```
0.0 ≤ offset ≤ 1.0
```

#### 常用值對照表

| Offset 值 | 百分比 | 像素 (696x540) | 說明 |
|-----------|--------|---------------|------|
| 0.00 | 0% | 0px | 無偏移 |
| 0.10 | 10% | 69.6px / 54px | 輕微偏移 |
| 0.25 | 25% | 174px / 135px | 四分之一 |
| 0.33 | 33% | 229.68px / 178.2px | 三分之一 |
| 0.50 | 50% | 348px / 270px | 中心偏移 |
| 0.75 | 75% | 522px / 405px | 四分之三 |
| 1.00 | 100% | 696px / 540px | 完整偏移（循環回起點）|

#### 代碼使用
```typescript
import { Vec2 } from 'cc';

const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.setRampUVParams(
    new Vec2(1, 1),      // tiling
    new Vec2(0.25, 0.1)  // offset
);
```

---

## 🔄 反向計算

### 從 Offset 轉換為像素

#### 公式
```
像素偏移 = offset × contentSize
```

#### 範例（contentSize = [696, 540]）

```typescript
// 靜態方法
const pixels = RampShaderResetInspector.offsetToPixels(
    0.25, 0.1,  // offset
    696, 540    // contentSize
);
// 結果: { x: 174, y: 54 }
```

#### 對照表

| Offset | 像素 X (696) | 像素 Y (540) |
|--------|-------------|-------------|
| 0.10 | 69.6px | 54px |
| 0.25 | 174px | 135px |
| 0.50 | 348px | 270px |
| 0.75 | 522px | 405px |
| 1.00 | 696px | 540px |

---

### 從 Offset 轉換為百分比

#### 公式
```
百分比 = offset × 100
```

#### 範例

```typescript
// 靜態方法
const percent = RampShaderResetInspector.offsetToPercent(0.25, 0.1);
// 結果: { x: 25, y: 10 }
```

#### 對照表

| Offset | 百分比 |
|--------|--------|
| 0.10 | 10% |
| 0.25 | 25% |
| 0.33 | 33% |
| 0.50 | 50% |
| 0.75 | 75% |
| 1.00 | 100% |

---

## 📊 實際應用範例

### 範例 1: 精確偏移 100 像素（水平）

**需求**: ContentSize = [696, 540]，向右偏移 100 像素

```typescript
// 計算
const offsetX = 100 / 696 = 0.1437

// 代碼（方法1 - 推薦）
inspector.setRampUVOffsetByPixels(100, 0);

// 代碼（方法2）
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0.1437, 0));
```

---

### 範例 2: 偏移 25%（對角線）

**需求**: 向右和向上各偏移 25%

```typescript
// 計算
const offset = 25 / 100 = 0.25

// 代碼（方法1 - 推薦）
inspector.setRampUVOffsetByPercent(25, 25);

// 代碼（方法2）
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0.25, 0.25));
```

---

### 範例 3: 創建滾動效果

**需求**: 水平方向連續滾動動畫

```typescript
import { _decorator, Component } from 'cc';
import { RampShaderResetInspector } from './RampShaderResetInspector';

@ccclass('RampScrollEffect')
export class RampScrollEffect extends Component {
    
    private inspector: RampShaderResetInspector = null;
    private scrollSpeed: number = 0.1;  // 每秒滾動 10%
    private currentOffset: number = 0;
    
    onLoad() {
        this.inspector = this.getComponent(RampShaderResetInspector);
    }
    
    update(dt: number) {
        if (!this.inspector) return;
        
        // 累加偏移
        this.currentOffset += this.scrollSpeed * dt;
        
        // 循環（超過 1.0 時回到 0）
        if (this.currentOffset > 1.0) {
            this.currentOffset -= 1.0;
        }
        
        // 應用偏移
        this.inspector.setRampUVParams(
            new Vec2(1, 1),
            new Vec2(this.currentOffset, 0)
        );
    }
}
```

---

### 範例 4: 根據觸摸位置偏移

**需求**: 根據觸摸點位置設定 Ramp 偏移

```typescript
import { _decorator, Component, EventTouch, Vec2, UITransform } from 'cc';
import { RampShaderResetInspector } from './RampShaderResetInspector';

@ccclass('RampTouchOffset')
export class RampTouchOffset extends Component {
    
    private inspector: RampShaderResetInspector = null;
    
    onLoad() {
        this.inspector = this.getComponent(RampShaderResetInspector);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    
    onTouchMove(event: EventTouch) {
        if (!this.inspector) return;
        
        // 獲取觸摸點在節點內的位置
        const uiTransform = this.node.getComponent(UITransform);
        const localPos = uiTransform.convertToNodeSpaceAR(event.getLocation());
        
        // 轉換為像素偏移（相對於中心）
        const pixelX = localPos.x + uiTransform.contentSize.width / 2;
        const pixelY = localPos.y + uiTransform.contentSize.height / 2;
        
        // 設定偏移
        this.inspector.setRampUVOffsetByPixels(pixelX, pixelY);
    }
}
```

---

### 範例 5: 多段式動畫

**需求**: 創建一個多階段的偏移動畫

```typescript
import { _decorator, Component, tween, Vec2 } from 'cc';
import { RampShaderResetInspector } from './RampShaderResetInspector';

@ccclass('RampMultiStageAnimation')
export class RampMultiStageAnimation extends Component {
    
    private inspector: RampShaderResetInspector = null;
    
    onLoad() {
        this.inspector = this.getComponent(RampShaderResetInspector);
        this.startAnimation();
    }
    
    startAnimation() {
        if (!this.inspector) return;
        
        const material = this.inspector.targetSprite.customMaterial;
        
        // 創建補間動畫
        tween({ offset: 0 })
            // 階段1: 0% → 25% (1秒)
            .to(1.0, { offset: 0.25 }, {
                onUpdate: (target) => {
                    material.setProperty('rampUVOffset', new Vec2(target.offset, 0), 0);
                }
            })
            // 階段2: 25% → 75% (2秒)
            .to(2.0, { offset: 0.75 })
            // 階段3: 75% → 100% (1秒)
            .to(1.0, { offset: 1.0 })
            // 循環
            .union()
            .repeatForever()
            .start();
    }
}
```

---

## 🔍 進階技巧

### 技巧 1: 基於 Tiling 的精確偏移

當使用 `rampUVScale > 1.0`（重複多次）時，offset 的含義會改變。

#### 計算公式
```
實際偏移 = offset / rampUVScale
```

#### 範例

```typescript
// 場景：重複 3 次，想要偏移 1/3 個循環
const tiling = 3;
const desiredOffsetCycles = 1;  // 偏移 1 個完整循環
const offset = desiredOffsetCycles / tiling;  // 1/3 = 0.3333

inspector.setRampUVParams(new Vec2(tiling, 1), new Vec2(offset, 0));
```

---

### 技巧 2: 負值偏移（反向）

雖然 offset 範圍是 0~1，但可以通過計算實現反向偏移。

#### 反向偏移公式
```
反向 offset = 1.0 - 正向 offset
```

#### 範例

```typescript
// 向右偏移 25% = offset 0.25
// 向左偏移 25% = offset (1 - 0.25) = 0.75

// 向左偏移 25%
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0.75, 0));

// 或直接設定負值像素，內部自動轉換
inspector.setRampUVOffsetByPixels(-174, 0);  // 等同於向左 174px
```

---

### 技巧 3: 根據屏幕尺寸動態調整

```typescript
import { view } from 'cc';

// 獲取屏幕尺寸
const screenSize = view.getVisibleSize();

// 根據屏幕寬度計算偏移（例如 10% 屏幕寬度）
const pixelOffset = screenSize.width * 0.1;

// 轉換為相對於 contentSize 的偏移
const size = inspector.getContentSize();
const offset = pixelOffset / size.width;

inspector.setRampUVParams(new Vec2(1, 1), new Vec2(offset, 0));
```

---

## 📐 常見尺寸快速參考

### ContentSize = [696, 540]

| 效果 | 方法 | 代碼 |
|------|------|------|
| 無偏移 | 直接設定 | `setRampUVParams(new Vec2(1,1), new Vec2(0, 0))` |
| 右偏移 100px | 像素方法 | `setRampUVOffsetByPixels(100, 0)` |
| 右偏移 25% | 百分比方法 | `setRampUVOffsetByPercent(25, 0)` |
| 上偏移 50px | 像素方法 | `setRampUVOffsetByPixels(0, 50)` |
| 對角偏移 30% | 百分比方法 | `setRampUVOffsetByPercent(30, 30)` |

### 像素偏移對照表

| 像素偏移 (X軸) | Offset 值 | 百分比 |
|--------------|-----------|--------|
| 69.6px | 0.10 | 10% |
| 139.2px | 0.20 | 20% |
| 174px | 0.25 | 25% |
| 208.8px | 0.30 | 30% |
| 348px | 0.50 | 50% |
| 522px | 0.75 | 75% |

---

## 🐛 疑難排解

### Q1: 偏移方向反了？

**原因**: Shader 中的 UV 坐標系可能與預期不同

**解決方法**:
```typescript
// 如果發現方向相反，使用反向計算
const reversedOffset = 1.0 - normalOffset;
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(reversedOffset, 0));
```

---

### Q2: 偏移效果不明顯？

**檢查項目**:
1. ✓ 確認 `RAMP_DIRECTION` 設定正確
2. ✓ 確認 `nodeUVScale` 已正確計算
3. ✓ 確認 `rampUVScale` 設定
4. ✓ 檢查是否使用了平滑度（smoothness）導致邊界模糊

---

### Q3: 重複模式下偏移計算錯誤？

**原因**: 當 `rampUVScale > 1` 時，offset 的含義改變

**解決方法**:
```typescript
const tiling = 3.0;  // 重複 3 次
const desiredPixelOffset = 100;  // 想要偏移 100 像素

// 正確計算：考慮 tiling 的影響
const baseOffset = desiredPixelOffset / contentSize.width;
const adjustedOffset = baseOffset * tiling;  // 或 baseOffset，取決於期望效果

inspector.setRampUVParams(new Vec2(tiling, 1), new Vec2(adjustedOffset, 0));
```

---

## 🎓 總結

### 核心要點

1. **像素方法**（最精準）
   ```typescript
   inspector.setRampUVOffsetByPixels(100, 50);
   ```

2. **百分比方法**（最直觀）
   ```typescript
   inspector.setRampUVOffsetByPercent(25, 10);
   ```

3. **直接設定**（最靈活）
   ```typescript
   inspector.setRampUVParams(new Vec2(1,1), new Vec2(0.25, 0.1));
   ```

### 計算公式速查

```
像素 → Offset:  offset = 像素 / contentSize
百分比 → Offset: offset = 百分比 / 100
Offset → 像素:  像素 = offset × contentSize
Offset → 百分比: 百分比 = offset × 100
```

### 推薦工作流程

1. 確定偏移需求（像素或百分比）
2. 選擇對應的計算方法
3. 使用便捷方法設定
4. 使用 `showDetailedLogs = true` 查看實際效果
5. 根據需要微調

---

## 📚 相關文檔

- [RampShaderResetInspector 使用指南](./RampShaderResetInspector-Usage-Guide.md)
- [RampUV 解決方案總結](./RampUV-Solution-Summary.md)
- [快速參考卡](./RampShaderResetInspector-Quick-Reference.md)

---

*最後更新: 2025-10-17*
*版本: 1.0.0*
