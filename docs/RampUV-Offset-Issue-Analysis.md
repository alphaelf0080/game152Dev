# 問題分析：Ramp UV Offset 計算數值

## 📊 當前情況

### 從截圖觀察到：

**ContentSize = [696, 700]**（注意：高度是 700，不是 540！）

**Material 中的實際值：**
- Node UV Scale: [0.002874, 0.002857]
- Ramp UV Offset: [0.31, 0.185143]

---

## 🔍 計算驗證

### 驗證 Node UV Scale

```
nodeUVScale.x = 2 / 696 = 0.002874 ✓ 正確
nodeUVScale.y = 2 / 700 = 0.002857 ✓ 正確
```

### 驗證 Ramp UV Offset（使用當前公式）

**當前公式**（基於 [696, 540] 的參考數據）：
```
referencePixelOffsetX = 215.76  // 696 × 0.31
referencePixelOffsetY = 129.60  // 540 × 0.24

offsetX = 215.76 / 696 = 0.310000 ✓ 正確
offsetY = 129.60 / 700 = 0.185143 ✓ 正確（自動計算）
```

---

## ❓ 問題所在

### 關鍵發現

1. **參考數據不匹配**：
   - 代碼中的參考：ContentSize = [696, **540**]
   - 實際使用的：ContentSize = [696, **700**]

2. **Y 方向的計算**：
   - 如果高度是 540：offset_y = 129.60 / 540 = 0.24 ✓
   - 如果高度是 700：offset_y = 129.60 / 700 = 0.185143（當前值）

3. **期望 vs 實際**：
   - 你期望：offset_y = 0.24（對於所有高度？）
   - 實際計算：offset_y = 129.60 / height（動態變化）

---

## 💡 解決方案

### 選項 A: 更新參考數據（如果 [696, 700] 才是正確的）

如果你的實際測試是基於 [696, 700]，需要更新參考像素：

```typescript
const referencePixelOffsetX = 215.76;  // 696 × 0.31
const referencePixelOffsetY = 168.00;  // 700 × 0.24 ← 更新這裡！
```

**驗證**：
- offsetX = 215.76 / 696 = 0.31 ✓
- offsetY = 168.00 / 700 = 0.24 ✓

---

### 選項 B: 使用固定 offset（如果希望所有尺寸都用 0.24）

如果你希望 Y 方向永遠是 0.24（不隨高度變化）：

```typescript
public static calculateAutoRampUVOffset(width: number, height: number): { x: number, y: number } {
    // X 方向動態計算
    const referencePixelOffsetX = 215.76;
    const offsetX = referencePixelOffsetX / width;
    
    // Y 方向固定值
    const offsetY = 0.24;  // 固定常數
    
    return { x: offsetX, y: offsetY };
}
```

---

### 選項 C: 分別配置參考尺寸

如果 X 和 Y 使用不同的參考尺寸：

```typescript
public static calculateAutoRampUVOffset(width: number, height: number): { x: number, y: number } {
    // X 方向基於 width=696
    const referenceWidthX = 696;
    const referenceOffsetX = 0.31;
    const referencePixelOffsetX = referenceWidthX * referenceOffsetX;  // 215.76
    
    // Y 方向基於 height=700（或 540？）
    const referenceHeightY = 700;  // ← 確認這個值！
    const referenceOffsetY = 0.24;
    const referencePixelOffsetY = referenceHeightY * referenceOffsetY;  // 168.00
    
    const offsetX = referencePixelOffsetX / width;
    const offsetY = referencePixelOffsetY / height;
    
    return { x: offsetX, y: offsetY };
}
```

---

## 🎯 需要確認的問題

請回答以下問題以確定正確的修正方式：

### 問題 1: 參考尺寸是什麼？
- [ ] A. [696, 540] - Y 方向參考高度是 540
- [ ] B. [696, 700] - Y 方向參考高度是 700
- [ ] C. 其他尺寸

### 問題 2: 期望的 offset 行為？
- [ ] A. 固定像素偏移 - offset 隨尺寸變化（當前實現）
- [ ] B. 固定 offset 值 - 所有尺寸都用 [0.31, 0.24]
- [ ] C. X 動態，Y 固定

### 問題 3: 實際測試數據？
請提供你手動測試得到最佳效果時的數據：
- ContentSize = [?, ?]
- 最佳 offset = [?, ?]

---

## 📊 當前行為分析

### 對於 ContentSize = [696, 700]

**當前計算**：
```
offsetX = 215.76 / 696 = 0.31 ✓
offsetY = 129.60 / 700 = 0.185143 ← 這是基於 height=540 的參考數據
```

**如果改用 height=700 作為參考**：
```
referencePixelOffsetY = 700 × 0.24 = 168.00
offsetY = 168.00 / 700 = 0.24 ✓
```

---

## 🔧 推薦修正（假設參考高度應該是 700）

```typescript
public static calculateAutoRampUVOffset(width: number, height: number): { x: number, y: number } {
    // 基於實際測試的參考尺寸 [696, 700]
    const referencePixelOffsetX = 215.76;  // 696 × 0.31
    const referencePixelOffsetY = 168.00;  // 700 × 0.24 ← 修正
    
    const offsetX = referencePixelOffsetX / width;
    const offsetY = referencePixelOffsetY / height;
    
    return { x: offsetX, y: offsetY };
}
```

---

## 📋 測試驗證

### 測試案例 1: [696, 700]
```
offsetX = 215.76 / 696 = 0.310000 ✓
offsetY = 168.00 / 700 = 0.240000 ✓
```

### 測試案例 2: [696, 540]
```
offsetX = 215.76 / 696 = 0.310000 ✓
offsetY = 168.00 / 540 = 0.311111 ← 會變化
```

### 測試案例 3: [1024, 768]
```
offsetX = 215.76 / 1024 = 0.210742
offsetY = 168.00 / 768 = 0.218750
```

---

*創建日期: 2025-10-17*
*待確認：正確的參考尺寸和期望行為*
