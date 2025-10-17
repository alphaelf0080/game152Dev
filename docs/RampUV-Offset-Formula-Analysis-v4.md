# Ramp UV Offset 計算公式 - 基於實際測試值

## 📅 更新日期
2025-10-17

## 🎯 實際需求

根據實際測試，對於 ContentSize = [696, 540]：
- **X offset 需要 ≈ 0.31**
- **Y offset 需要 ≈ 0.24**

才能達到正確的 Ramp 效果（1 → 0）。

---

## 🔍 反推公式

### 步驟 1: 分析實際值

```
width = 696  → offset_x = 0.31
height = 540 → offset_y = 0.24
```

### 步驟 2: 嘗試不同公式

#### 公式 A: `offset = 0.5 - factor / size`

反推 factor：
```
offset_x = 0.31 = 0.5 - factor_x / 696
factor_x = (0.5 - 0.31) × 696 = 0.19 × 696 = 132.24

offset_y = 0.24 = 0.5 - factor_y / 540
factor_y = (0.5 - 0.24) × 540 = 0.26 × 540 = 140.40
```

#### 公式 B: 檢查 factor 是否為固定比例

```
factor_x / width = 132.24 / 696 = 0.19
factor_y / height = 140.40 / 540 = 0.26
```

**發現**：
- X 方向：`factor_x = width × 0.19`
- Y 方向：`factor_y = height × 0.26`

#### 公式 C: 簡化

如果 `factor = size × k`，則：
```
offset = 0.5 - (size × k) / size
       = 0.5 - k
```

所以：
```
offset_x = 0.5 - 0.19 = 0.31 ✓
offset_y = 0.5 - 0.26 = 0.24 ✓
```

---

## 💡 結論

### 方案 1: 固定常數（推薦）

如果這些值是基於特定設計需求或視覺效果的最佳值，直接使用固定常數：

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number
): { x: number, y: number } {
    return {
        x: 0.31,
        y: 0.24
    };
}
```

**優點**：
- 簡單直接
- 與實際測試值一致
- 適用於所有尺寸（如果這是最佳視覺效果）

**缺點**：
- 不考慮不同 contentSize 的差異
- 如果 contentSize 變化很大可能需要調整

---

### 方案 2: 基於比例計算

如果 offset 確實應該隨 contentSize 變化，使用比例公式：

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number
): { x: number, y: number } {
    // 基於觀察到的比例關係
    const ratioX = 0.19;  // 0.5 - 0.31
    const ratioY = 0.26;  // 0.5 - 0.24
    
    const offsetX = 0.5 - ratioX;
    const offsetY = 0.5 - ratioY;
    
    return {
        x: offsetX,  // = 0.31
        y: offsetY   // = 0.24
    };
}
```

這實際上等同於方案 1，因為比例是固定的。

---

### 方案 3: 參數化（最靈活）

如果需要根據不同情況調整：

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number,
    offsetFactorX: number = 0.19,  // 可調整的參數
    offsetFactorY: number = 0.26   // 可調整的參數
): { x: number, y: number } {
    const offsetX = 0.5 - offsetFactorX;
    const offsetY = 0.5 - offsetFactorY;
    
    return {
        x: offsetX,
        y: offsetY
    };
}

// 使用默認值
const offset1 = calculateAutoRampUVOffset(696, 540);
// { x: 0.31, y: 0.24 }

// 自定義參數
const offset2 = calculateAutoRampUVOffset(696, 540, 0.15, 0.20);
// { x: 0.35, y: 0.30 }
```

---

## 🧪 驗證不同尺寸

### 測試代碼

```typescript
// 方案 1: 固定常數
function testFixedOffset() {
    const testSizes = [
        [512, 512],
        [696, 540],
        [1024, 768],
        [1280, 720],
        [1920, 1080]
    ];
    
    console.log("=== 固定 Offset 方案 ===\n");
    
    testSizes.forEach(([w, h]) => {
        const offset = { x: 0.31, y: 0.24 };
        console.log(`ContentSize [${w}, ${h}]:`);
        console.log(`  Offset: [${offset.x}, ${offset.y}]`);
        console.log(`  X 像素偏移: ${(offset.x * w).toFixed(2)}px`);
        console.log(`  Y 像素偏移: ${(offset.y * h).toFixed(2)}px\n`);
    });
}
```

### 預期輸出

```
=== 固定 Offset 方案 ===

ContentSize [512, 512]:
  Offset: [0.31, 0.24]
  X 像素偏移: 158.72px
  Y 像素偏移: 122.88px

ContentSize [696, 540]:
  Offset: [0.31, 0.24]
  X 像素偏移: 215.76px
  Y 像素偏移: 129.60px

ContentSize [1024, 768]:
  Offset: [0.31, 0.24]
  X 像素偏移: 317.44px
  Y 像素偏移: 184.32px

ContentSize [1280, 720]:
  Offset: [0.31, 0.24]
  X 像素偏移: 396.80px
  Y 像素偏移: 172.80px

ContentSize [1920, 1080]:
  Offset: [0.31, 0.24]
  X 像素偏移: 595.20px
  Y 像素偏移: 259.20px
```

**觀察**：
- 像素偏移隨 contentSize 線性增長
- 這可能是合理的，也可能需要調整

---

## 🤔 深入思考

### 問題：為什麼是 0.31 和 0.24？

這些值可能來自：

1. **視覺設計需求**
   - 基於黃金比例或三分法則
   - 視覺上最佳的漸變起始點

2. **Shader UV 對齊**
   - 補償某些 UV 變換的偏移
   - 與 `rampUVScale` 配合使用的最佳值

3. **特定測試案例**
   - 針對 [696, 540] 調試出的最佳值
   - 可能不適用於其他尺寸

### 建議：進一步測試

測試不同 contentSize 下的最佳 offset 值：

| ContentSize | 最佳 offset_x | 最佳 offset_y | 規律 |
|-------------|--------------|--------------|------|
| [512, 512] | ? | ? | 待測試 |
| [696, 540] | 0.31 | 0.24 | 已知 ✓ |
| [1024, 768] | ? | ? | 待測試 |

如果發現規律，可以推導出更準確的公式。

---

## 📝 當前實現建議

基於現有信息，推薦使用 **方案 1（固定常數）**：

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number
): { x: number, y: number } {
    // 基於實際測試的最佳值（ContentSize = [696, 540]）
    // 這些值能產生正確的 1→0 Ramp 效果
    return {
        x: 0.31,
        y: 0.24
    };
}
```

**理由**：
1. 與實際測試結果一致
2. 簡單明確
3. 如果發現不適用於其他尺寸，可以隨時調整為動態計算

---

## 🔄 未來優化

如果需要根據 contentSize 動態調整，可以考慮：

### 選項 A: 線性插值

```typescript
// 基於參考尺寸 [696, 540] 的縮放
const refWidth = 696;
const refHeight = 540;
const refOffsetX = 0.31;
const refOffsetY = 0.24;

const offsetX = refOffsetX * (width / refWidth);
const offsetY = refOffsetY * (height / refHeight);
```

### 選項 B: 固定像素偏移

```typescript
// 保持固定的像素偏移量
const pixelOffsetX = 0.31 * 696;  // ≈ 215.76
const pixelOffsetY = 0.24 * 540;  // ≈ 129.60

const offsetX = pixelOffsetX / width;
const offsetY = pixelOffsetY / height;
```

### 選項 C: 基於寬高比

```typescript
const aspectRatio = width / height;
// 根據寬高比調整 offset...
```

這需要更多測試數據來確定最佳方法。

---

*最後更新: 2025-10-17*
*版本: 4.0.0 - 基於實際測試值的固定常數*
