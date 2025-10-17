# RampUV Offset 完全動態計算 - 基於紋理尺寸

**日期**: 2025-10-17  
**重大改進**: 移除所有固定參考值，完全基於實際資料動態計算

---

## 🎯 問題的根本原因

### ❌ 之前的所有方案都是錯誤的

**錯誤 1: 固定值方案**
```typescript
baseOffset = [0.31, 0.24]  // 固定魔法數字
```

**錯誤 2: 基於尺寸比例的方案**
```typescript
baseOffset = refOffset × (currentSize / refSize)  // 仍然依賴固定的參考值
```

**錯誤 3: UV 空間固定值方案**
```typescript
baseOffset = referenceOffset  // 仍然是固定值
```

### ✅ 正確的理解

**核心問題**: 有任何固定數值就一定是錯誤的！

**正確來源**:
1. ✅ **ContentSize**: 從 Node Component (UITransform) 獲取
2. ✅ **Texture Size**: 從 Sprite 的 source texture 獲取
3. ✅ **Tiling**: 從 Material 的 tilingOffset 參數獲取
4. ✅ **Anchor Point**: 從 UITransform 獲取

**所有參數都應該是實時讀取的，不應該有任何預設的參考值！**

---

## 🔧 新的完全動態計算方案

### 核心計算邏輯

```typescript
/**
 * 完全動態計算 Ramp UV Offset
 * 
 * 不使用任何固定參考值，所有數據都從實際物件獲取
 */
function calculateAutoRampUVOffset(
    width: number,           // ContentSize 寬度（從 UITransform）
    height: number,          // ContentSize 高度（從 UITransform）
    anchorX: number,         // Anchor Point X（從 UITransform）
    anchorY: number,         // Anchor Point Y（從 UITransform）
    tilingX: number,         // Sprite Tiling X（從 Material）
    tilingY: number,         // Sprite Tiling Y（從 Material）
    textureWidth: number,    // 紋理寬度（從 Sprite.spriteFrame.texture）
    textureHeight: number    // 紋理高度（從 Sprite.spriteFrame.texture）
): { x: number, y: number } {
    
    let baseOffsetX = 0.0;
    let baseOffsetY = 0.0;
    
    // 如果有紋理尺寸，基於紋理與節點的比例計算
    if (textureWidth > 0 && textureHeight > 0) {
        // 計算有效的紋理尺寸（考慮 Tiling）
        const effectiveTextureWidth = textureWidth * tilingX;
        const effectiveTextureHeight = textureHeight * tilingY;
        
        // 計算填充比例
        const fillRatioX = width / effectiveTextureWidth;
        const fillRatioY = height / effectiveTextureHeight;
        
        // 基於填充比例計算 offset
        baseOffsetX = (1.0 - 1.0 / fillRatioX) * 0.5;
        baseOffsetY = (1.0 - 1.0 / fillRatioY) * 0.5;
    }
    
    // Anchor Point 補償
    const anchorAdjustmentX = (0.5 - anchorX);
    const anchorAdjustmentY = (0.5 - anchorY);
    
    // Tiling 補償
    const tilingAdjustmentX = (tilingX - 1.0) * 0.5;
    const tilingAdjustmentY = (tilingY - 1.0) * 0.5;
    
    // 最終結果
    return {
        x: baseOffsetX + anchorAdjustmentX + tilingAdjustmentX,
        y: baseOffsetY + anchorAdjustmentY + tilingAdjustmentY
    };
}
```

---

## 📊 數據來源映射

### 1. ContentSize (節點尺寸)
```typescript
const uiTransform = this.node.getComponent(UITransform);
const width = uiTransform.contentSize.width;
const height = uiTransform.contentSize.height;
```

**用途**: 決定 Ramp 效果覆蓋的實際範圍

### 2. Anchor Point (錨點)
```typescript
const anchorX = uiTransform.anchorPoint.x;  // 0.0 ~ 1.0
const anchorY = uiTransform.anchorPoint.y;  // 0.0 ~ 1.0
```

**用途**: 補償錨點偏移對 UV 原點的影響

### 3. Sprite Tiling (平鋪次數)
```typescript
const tilingOffset = material.getProperty('tilingOffset', 0) as Vec4;
const tilingX = tilingOffset.x;  // 1.0 = Simple, 3.0 = Tiled 3x3
const tilingY = tilingOffset.y;
```

**用途**: 
- Sprite 的平鋪模式（Simple, Sliced, Tiled）
- 影響紋理的有效尺寸

### 4. Texture Size (紋理原始尺寸)
```typescript
const spriteFrame = this.targetSprite.spriteFrame;

// 方法 1: 從 texture 獲取
if (spriteFrame.texture) {
    const textureWidth = spriteFrame.texture.width;
    const textureHeight = spriteFrame.texture.height;
}

// 方法 2: 從 rect 獲取（spriteFrame 的實際使用區域）
if (spriteFrame.rect) {
    const textureWidth = spriteFrame.rect.width;
    const textureHeight = spriteFrame.rect.height;
}
```

**用途**: 
- 紋理的原始像素尺寸
- 用於計算紋理與節點的比例關係

---

## 🔬 數學原理

### 填充比例 (Fill Ratio)

```
effectiveTextureSize = textureSize × tiling
fillRatio = contentSize / effectiveTextureSize
```

**例子 1: 紋理被拉伸**
```
紋理: 256 x 256
ContentSize: 1200 x 300
Tiling: 1 x 1

effectiveTexture = 256 x 256
fillRatio = [1200/256, 300/256] = [4.69, 1.17]

紋理被拉伸了 4.69x (寬度) 和 1.17x (高度)
```

**例子 2: 紋理平鋪**
```
紋理: 256 x 256
ContentSize: 768 x 768
Tiling: 3 x 3

effectiveTexture = 768 x 768
fillRatio = [768/768, 768/768] = [1.0, 1.0]

紋理完美填充，無拉伸
```

### Offset 計算

```
baseOffset = (1.0 - 1.0 / fillRatio) × 0.5
```

**為什麼這個公式正確？**

- 當 fillRatio = 1.0 時（完美填充）：
  ```
  baseOffset = (1.0 - 1.0/1.0) × 0.5 = 0.0  ✓ 無需補償
  ```

- 當 fillRatio = 2.0 時（拉伸 2 倍）：
  ```
  baseOffset = (1.0 - 1.0/2.0) × 0.5 = 0.25  ✓ 需要補償
  ```

- 當 fillRatio = 0.5 時（縮小 2 倍）：
  ```
  baseOffset = (1.0 - 1.0/0.5) × 0.5 = -0.5  ✓ 反向補償
  ```

---

## 🎯 實際測試案例

### 測試案例 1: Simple Sprite（無 Tiling）
```
紋理尺寸: 512 x 512
ContentSize: 1024 x 256
Tiling: 1 x 1
Anchor: 0.5, 0.5

計算過程:
effectiveTexture = 512 x 512
fillRatio = [1024/512, 256/512] = [2.0, 0.5]

baseOffset = [(1-1/2.0)*0.5, (1-1/0.5)*0.5]
           = [0.25, -0.5]

anchorAdjustment = [0.0, 0.0] (中心錨點)
tilingAdjustment = [0.0, 0.0] (無 Tiling)

finalOffset = [0.25, -0.5]
```

### 測試案例 2: Tiled Sprite (3x3)
```
紋理尺寸: 256 x 256
ContentSize: 768 x 768
Tiling: 3 x 3
Anchor: 0.5, 0.5

計算過程:
effectiveTexture = [256*3, 256*3] = [768, 768]
fillRatio = [768/768, 768/768] = [1.0, 1.0]

baseOffset = [(1-1/1.0)*0.5, (1-1/1.0)*0.5]
           = [0.0, 0.0]

anchorAdjustment = [0.0, 0.0]
tilingAdjustment = [(3-1)*0.5, (3-1)*0.5] = [1.0, 1.0]

finalOffset = [1.0, 1.0]
```

### 測試案例 3: 左下角錨點
```
紋理尺寸: 512 x 512
ContentSize: 512 x 512
Tiling: 1 x 1
Anchor: 0.0, 0.0 (左下角)

計算過程:
effectiveTexture = 512 x 512
fillRatio = [1.0, 1.0]

baseOffset = [0.0, 0.0] (完美填充)

anchorAdjustment = [0.5-0.0, 0.5-0.0] = [0.5, 0.5]
tilingAdjustment = [0.0, 0.0]

finalOffset = [0.5, 0.5]
```

---

## 📝 移除的固定參數

### 之前（錯誤）
```typescript
@property({ tooltip: '參考配置的 ContentSize 寬度' })
referenceWidth: number = 696;  // ❌ 固定值

@property({ tooltip: '參考配置的 ContentSize 高度' })
referenceHeight: number = 540;  // ❌ 固定值

@property({ tooltip: '參考配置的最佳 Ramp UV Offset X' })
referenceOffsetX: number = 0.31;  // ❌ 固定值

@property({ tooltip: '參考配置的最佳 Ramp UV Offset Y' })
referenceOffsetY: number = 0.24;  // ❌ 固定值
```

### 現在（正確）
```typescript
// 不需要任何參考參數！
// 所有數據都從實際物件動態獲取：
// - ContentSize 從 UITransform
// - Texture Size 從 SpriteFrame
// - Tiling 從 Material
// - Anchor從 UITransform
```

---

## 🧪 測試驗證步驟

### 步驟 1: 檢查 Console 輸出

**預期輸出**:
```
📐 RampUV 精準計算結果:
   ContentSize: (1024, 256)
   Anchor Point: (0.5, 0.5)
   NodeUVScale: (0.001953, 0.007813)
   公式: nodeUVScale = 2 / contentSize
   Sprite Tiling: (1, 1)
   紋理尺寸: 512 x 512
   RampUVOffset (自動): (0.2500, -0.5000)
   ↳ 有效紋理尺寸: [512, 512] (含 Tiling)
   ↳ 填充比例: [2.000, 0.500]
   ↳ 動態基礎 Offset: 基於紋理與節點比例計算
   ↳ Anchor 補償: [0.00, 0.00]
   ↳ Tiling 補償: [0.00, 0.00]
   💡 公式: offset = f(紋理尺寸, ContentSize, Tiling) + Anchor補償 + Tiling補償
```

**關鍵驗證點**:
- ✓ 顯示 "紋理尺寸"（從 Sprite 讀取）
- ✓ 顯示 "填充比例"（動態計算）
- ✓ 顯示 "動態基礎 Offset: 基於紋理與節點比例計算"
- ✓ **沒有任何固定的參考值**

### 步驟 2: 測試不同配置

**測試 A: 改變 ContentSize**
- 紋理保持不變
- 改變節點的 ContentSize
- offset 應該根據新的填充比例自動調整

**測試 B: 改變 Tiling**
- 從 Simple (1x1) 改為 Tiled (3x3)
- offset 應該根據新的有效紋理尺寸調整

**測試 C: 改變 Anchor**
- 從中心 (0.5, 0.5) 改為左下 (0.0, 0.0)
- offset 應該增加 0.5 的補償

**測試 D: 更換 Sprite**
- 使用不同尺寸的紋理
- offset 應該根據新紋理的尺寸自動重新計算

---

## 💡 關鍵優勢

### ✅ 完全動態
- 所有參數都從實際物件獲取
- 無固定魔法數字
- 無需手動配置參考值

### ✅ 自動適應
- 改變 ContentSize → 自動重新計算
- 改變 Sprite → 自動檢測新紋理尺寸
- 改變 Tiling → 自動調整有效尺寸
- 改變 Anchor → 自動補償

### ✅ 數學正確
- 基於紋理與節點的實際比例關係
- 考慮 Tiling 對有效尺寸的影響
- 考慮 Anchor Point 的偏移

### ✅ 透明可驗證
- Console 輸出完整的計算過程
- 顯示所有關鍵參數的來源
- 可以追蹤每一步計算

---

## 🚀 後續優化方向

1. **添加計算模式選項**:
   ```typescript
   offsetCalculationMode: 0 = 禁用, 1 = 基於紋理, 2 = 基於ContentSize
   ```

2. **處理無紋理情況**:
   - 當 Sprite 沒有設置紋理時的回退邏輯
   - 使用純色 Sprite 的情況

3. **支持 Atlas 圖集**:
   - 從 Atlas 中獲取正確的紋理區域尺寸
   - 處理 SpriteFrame 的 rect 和 originalSize

4. **性能優化**:
   - 緩存紋理尺寸（避免每幀讀取）
   - 只在紋理變化時重新計算

---

## 結論

**核心真理**: 
> 不應該有任何固定的參考值。
> 
> 所有數據都應該從場景中的實際物件動態獲取：
> - ContentSize 從 Node Component
> - Texture Size 從 Sprite 的 source texture
> - Tiling 從 Material 參數
> - Anchor Point 從 UITransform
> 
> 這樣才能真正實現「自動」和「動態」。

**這才是正確的解決方案！** 🎉
