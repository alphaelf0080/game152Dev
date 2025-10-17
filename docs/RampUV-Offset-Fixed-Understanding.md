# RampUV Offset 正確理解 - UV 空間固定值

**日期**: 2025-10-17  
**問題**: offset 計算公式錯誤，基於尺寸比例的動態計算是錯誤的假設

---

## ❌ 錯誤的理解（之前的方案）

### 錯誤公式
```typescript
baseOffset = refOffset × (currentSize / refSize)
```

### 為什麼這是錯的？

**錯誤假設**: offset 應該隨 ContentSize 按比例縮放

**實際情況**: 
- offset 是在 **UV 空間 [0, 1]** 中的相對位置
- UV 空間是標準化的，與實際像素尺寸無關
- 當 ContentSize 改變時，`nodeUVScale` 會自動調整以確保 normalizedUV ∈ [0, 1]
- **offset 應該在 UV 空間中保持固定**，以維持相同的視覺效果

### 錯誤結果示例

```
ContentSize: [1200, 300]
錯誤計算: offset = [0.31, 0.24] × [1200/696, 300/540]
         = [0.31 × 1.724, 0.24 × 0.556]
         = [0.5345, 0.1333]  ❌ 錯誤！
```

這會導致視覺效果錯誤，因為 offset 在 UV 空間中被錯誤地放大/縮小了。

---

## ✅ 正確的理解

### 核心概念

**UV 空間是標準化的**：
- 無論 ContentSize 是多少，UV 坐標始終在 [0, 1] 範圍內
- `nodeUVScale = 2 / contentSize` 確保了這個標準化
- offset 在 UV 空間中的位置應該保持固定

### 正確公式

```typescript
// 基礎 offset 直接使用參考值（在 UV 空間中保持固定）
baseOffsetX = referenceOffsetX;  // 0.31 (固定)
baseOffsetY = referenceOffsetY;  // 0.24 (固定)

// 只添加必要的補償
finalOffset = baseOffset + anchorCompensation + tilingCompensation
```

### Shader UV 轉換流程

```glsl
// Step 1: nodeUV 範圍 = [-contentSize/2, contentSize/2]
vec2 nodeUV = a_position;

// Step 2: normalizedUV 標準化到 [0, 1]
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;
// nodeUVScale = 2 / contentSize 確保標準化

// Step 3: rampUV 計算
vec2 rampUV = fract((normalizedUV + offset) * scale);
```

**關鍵理解**:
- 無論 ContentSize 如何變化，normalizedUV 始終 ∈ [0, 1]
- offset 在這個 [0, 1] 的空間中應用
- 因此 offset 應該保持固定，不隨 ContentSize 變化

---

## 📊 正確示例

### 測試案例 1: 參考配置
```
ContentSize: [696, 540]
Reference Offset: [0.31, 0.24]
Anchor: [0.5, 0.5]
Tiling: [1.0, 1.0]

計算結果:
baseOffset = [0.31, 0.24]  (UV 空間固定)
anchorCompensation = [0.0, 0.0]
tilingCompensation = [0.0, 0.0]
finalOffset = [0.31, 0.24]  ✓ 正確！
```

### 測試案例 2: 不同尺寸
```
ContentSize: [1200, 300]
Reference Offset: [0.31, 0.24]
Anchor: [0.5, 0.5]
Tiling: [1.0, 1.0]

計算結果:
baseOffset = [0.31, 0.24]  (UV 空間固定，不變！)
anchorCompensation = [0.0, 0.0]
tilingCompensation = [0.0, 0.0]
finalOffset = [0.31, 0.24]  ✓ 正確！
```

### 測試案例 3: 不同 Anchor
```
ContentSize: [696, 540]
Reference Offset: [0.31, 0.24]
Anchor: [0.0, 0.0]  (左下角)
Tiling: [1.0, 1.0]

計算結果:
baseOffset = [0.31, 0.24]  (UV 空間固定)
anchorCompensation = [0.5, 0.5]  (0.5 - 0.0)
tilingCompensation = [0.0, 0.0]
finalOffset = [0.81, 0.74]  ✓ 正確！
```

---

## 🔧 代碼修復

### 修復前（錯誤）
```typescript
// 計算當前配置的 nodeUVScale
const currentScaleX = 2.0 / width;
const currentScaleY = 2.0 / height;

// 計算參考配置的 nodeUVScale
const refScaleX = 2.0 / referenceWidth;
const refScaleY = 2.0 / referenceHeight;

// 錯誤：基於比例動態計算 offset
const baseOffsetX = referenceOffsetX * (refScaleX / currentScaleX);
const baseOffsetY = referenceOffsetY * (refScaleY / currentScaleY);
// ❌ 這會導致 offset 隨尺寸錯誤縮放
```

### 修復後（正確）
```typescript
// 基礎 offset 直接使用參考值（在 UV 空間中保持固定）
let baseOffsetX = referenceOffsetX;  // 0.31 (固定)
let baseOffsetY = referenceOffsetY;  // 0.24 (固定)
// ✓ offset 在 UV 空間中保持固定
```

---

## 💡 關鍵洞察

### 為什麼之前會有誤解？

1. **混淆了 UV 空間和像素空間**
   - offset 是在標準化的 UV 空間 [0, 1] 中
   - 不是在像素空間中

2. **誤以為 offset 需要"補償" ContentSize 變化**
   - 實際上 `nodeUVScale` 已經處理了標準化
   - offset 只需要在標準化後的空間中應用

3. **過度複雜化**
   - 試圖創建一個"動態"公式
   - 實際上簡單的固定值就是正確答案

### Reference Width/Height 的真正作用

**不是用來計算比例的！** 而是：
- 記錄你測試時的配置（用於文檔/參考）
- 提醒你在哪個配置下找到的最佳 offset
- 但計算時 **不應該使用這些值做比例換算**

正確的屬性命名應該是：
```typescript
@property({ tooltip: '📝 這個 offset 是在哪個 ContentSize 下測試的（僅供參考）' })
testContentSizeWidth: number = 696;

@property({ tooltip: '📝 這個 offset 是在哪個 ContentSize 下測試的（僅供參考）' })
testContentSizeHeight: number = 540;
```

---

## 🎯 最終正確公式

```typescript
/**
 * 計算 RampUV Offset
 * 
 * @param referenceOffsetX - 在 UV 空間中的基礎 offset X (0.0-1.0)
 * @param referenceOffsetY - 在 UV 空間中的基礎 offset Y (0.0-1.0)
 * @param anchorX - Anchor Point X (預設 0.5)
 * @param anchorY - Anchor Point Y (預設 0.5)
 * @param tilingX - Sprite Tiling X (預設 1.0)
 * @param tilingY - Sprite Tiling Y (預設 1.0)
 */
function calculateRampUVOffset(
    referenceOffsetX: number,
    referenceOffsetY: number,
    anchorX: number = 0.5,
    anchorY: number = 0.5,
    tilingX: number = 1.0,
    tilingY: number = 1.0
): { x: number, y: number } {
    // 基礎 offset (在 UV 空間中固定)
    let offsetX = referenceOffsetX;
    let offsetY = referenceOffsetY;
    
    // Anchor Point 補償
    offsetX += (0.5 - anchorX);
    offsetY += (0.5 - anchorY);
    
    // Tiling 補償
    offsetX += (tilingX - 1.0) * 0.5;
    offsetY += (tilingY - 1.0) * 0.5;
    
    return { x: offsetX, y: offsetY };
}
```

**注意**: 不需要 `width`, `height`, `referenceWidth`, `referenceHeight` 參數！

---

## 📝 測試驗證

### 測試步驟

1. **設定參考 offset**: `[0.31, 0.24]`
2. **測試不同 ContentSize**:
   - [696, 540] → offset 應該是 `[0.31, 0.24]`
   - [1200, 300] → offset 應該是 `[0.31, 0.24]`
   - [1392, 1080] → offset 應該是 `[0.31, 0.24]`
   
3. **驗證視覺效果**: 渐变效果的起始位置在 UV 空間中應該保持一致

### 預期結果

無論 ContentSize 如何變化：
- ✓ offset 在 UV 空間中保持固定
- ✓ 視覺效果一致
- ✓ 不會出現錯誤的縮放

---

## 🔄 下一步

1. ✅ 修復代碼（已完成）
2. ⏳ 在 Cocos Creator 中測試驗證
3. ⏳ 更新文檔
4. ⏳ 移除不必要的 Reference Width/Height 參數（或重新命名為參考用）

---

## 結論

**核心真理**: 
> offset 在 UV 空間中應該保持固定，不隨 ContentSize 變化。
> 
> nodeUVScale 已經處理了標準化，我們只需要在標準化的 UV 空間 [0, 1] 中應用固定的 offset。

這才是真正的"自動"和"動態" - 不是通過複雜的公式計算，而是通過正確理解 UV 空間的本質。
