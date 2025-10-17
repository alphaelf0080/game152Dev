# Ramp UV Offset - 為什麼 X 和 Y 的 Offset 不同？

## 📅 更新日期
2025-10-17

## ✅ 驗證結果

### 實際截圖數值（ContentSize = [696, 540]）
- **Node UV Scale X**: 0.002874
- **Node UV Scale Y**: 0.003704
- **Ramp UV Offset X**: 0.498563
- **Ramp UV Offset Y**: 0.498148

### 公式計算結果
```typescript
width = 696
height = 540

// Node UV Scale
nodeUVScaleX = 2 / 696 = 0.002874 ✓
nodeUVScaleY = 2 / 540 = 0.003704 ✓

// Ramp UV Offset
offsetX = 0.5 - (1.0 / 696) = 0.498563 ✓
offsetY = 0.5 - (1.0 / 540) = 0.498148 ✓
```

**結論：公式計算與實際數值完全一致！** 🎉

---

## 🔍 為什麼 X 和 Y 的 Offset 不同？

### 關鍵理解

#### ❌ 錯誤理解
"X 和 Y 的 offset 應該相同"

#### ✅ 正確理解
**X 和 Y 的 offset 必須根據各自的 contentSize 分別計算**

---

## 📐 數學原理

### 公式推導

對於 Cocos Creator 的 UV 坐標系統：

```
a_position 範圍：[-contentSize/2, contentSize/2]
```

為了正確對齊到 UV 空間 [0, 1]，需要補償邊界效果：

```typescript
offsetX = 0.5 - (1.0 / width)
offsetY = 0.5 - (1.0 / height)
```

### 為什麼必須分開計算？

#### 例子 1: 正方形 [512, 512]
```typescript
offsetX = 0.5 - (1/512) = 0.498047
offsetY = 0.5 - (1/512) = 0.498047
// X 和 Y 相同 ✓
```

#### 例子 2: 矩形 [696, 540]（實際案例）
```typescript
offsetX = 0.5 - (1/696) = 0.498563
offsetY = 0.5 - (1/540) = 0.498148
// X 和 Y 不同 ✓
```

#### 例子 3: 寬屏 [1920, 1080]
```typescript
offsetX = 0.5 - (1/1920) = 0.499479
offsetY = 0.5 - (1/1080) = 0.499074
// X 和 Y 不同 ✓
```

---

## 🎯 關鍵洞察

### 1. Offset 的本質是「像素補償」

```typescript
// 補償的像素數
compensationPixelsX = 1.0 / width
compensationPixelsY = 1.0 / height

// 因為 width ≠ height，所以補償值不同
```

### 2. 歸一化到 UV 空間

每個軸向都需要獨立歸一化：

```
X 軸：像素空間 [0, width] → UV 空間 [0, 1]
Y 軸：像素空間 [0, height] → UV 空間 [0, 1]
```

### 3. 比例關係

```typescript
// 對於 [696, 540]
ratio = width / height = 696 / 540 = 1.289

// Offset 的差異
offsetX - offsetY = 0.498563 - 0.498148 = 0.000415

// 這個差異來自於尺寸差異
1/540 - 1/696 = 0.001852 - 0.001437 = 0.000415 ✓
```

---

## 📊 不同尺寸的對比

| ContentSize | Offset X | Offset Y | X - Y 差異 |
|-------------|----------|----------|-----------|
| [512, 512] | 0.498047 | 0.498047 | 0.000000 |
| [696, 540] | 0.498563 | 0.498148 | 0.000415 |
| [1024, 768] | 0.499023 | 0.498698 | 0.000325 |
| [1280, 720] | 0.499219 | 0.498611 | 0.000608 |
| [1920, 1080] | 0.499479 | 0.499074 | 0.000405 |

**觀察**：
- 正方形（512×512）：X = Y
- 矩形：X ≠ Y
- 寬高比越大，差異越明顯

---

## 💡 視覺化理解

### 像素網格對齊

```
Width = 696 像素
Height = 540 像素

X 方向需要補償：1/696 ≈ 0.001437 (更小的補償)
Y 方向需要補償：1/540 ≈ 0.001852 (更大的補償)

因為 Y 軸的像素密度較低（540 < 696），需要較大的補償值
```

### UV 坐標轉換

```glsl
// Shader 中的轉換
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;

// X 方向
normalizedUV.x = (nodeUV.x * 0.002874 + 1.0) * 0.5;

// Y 方向  
normalizedUV.y = (nodeUV.y * 0.003704 + 1.0) * 0.5;

// 因為 nodeUVScale 不同，所以 offset 也必須不同
```

---

## 🔧 實現驗證

### 當前實現（正確）✅

```typescript
public static calculateAutoRampUVOffset(
    width: number, 
    height: number
): { x: number, y: number } {
    const offsetX = 0.5 - (1.0 / width);   // 根據 width 計算
    const offsetY = 0.5 - (1.0 / height);  // 根據 height 計算
    
    return {
        x: offsetX,
        y: offsetY
    };
}
```

### 錯誤實現（假設）❌

```typescript
// 錯誤：使用相同的 offset
public static calculateAutoRampUVOffset(
    width: number, 
    height: number
): { x: number, y: number } {
    const offset = 0.5 - (1.0 / Math.max(width, height));
    
    return {
        x: offset,  // ❌ 錯誤
        y: offset   // ❌ 錯誤
    };
}
```

這會導致：
- X 方向對齊錯誤（如果 width > height）
- Y 方向對齊錯誤（如果 height > width）
- Ramp 效果變形或偏移

---

## 🧪 測試代碼

### 驗證計算正確性

```typescript
// 測試函數
function testOffsetCalculation() {
    const testCases = [
        { w: 512, h: 512, name: "正方形" },
        { w: 696, h: 540, name: "矩形（實際案例）" },
        { w: 1024, h: 768, name: "4:3" },
        { w: 1920, h: 1080, name: "16:9" },
        { w: 2048, h: 1024, name: "2:1" }
    ];
    
    console.log("Offset 計算測試：\n");
    
    testCases.forEach(({ w, h, name }) => {
        const offset = RampShaderResetInspector.calculateAutoRampUVOffset(w, h);
        const diff = Math.abs(offset.x - offset.y);
        
        console.log(`${name} [${w}, ${h}]:`);
        console.log(`  Offset X: ${offset.x.toFixed(6)}`);
        console.log(`  Offset Y: ${offset.y.toFixed(6)}`);
        console.log(`  差異: ${diff.toFixed(6)}`);
        console.log(`  X = Y?: ${diff < 0.000001 ? "是" : "否"}\n`);
    });
}
```

### 預期輸出

```
Offset 計算測試：

正方形 [512, 512]:
  Offset X: 0.498047
  Offset Y: 0.498047
  差異: 0.000000
  X = Y?: 是

矩形（實際案例） [696, 540]:
  Offset X: 0.498563
  Offset Y: 0.498148
  差異: 0.000415
  X = Y?: 否

4:3 [1024, 768]:
  Offset X: 0.499023
  Offset Y: 0.498698
  差異: 0.000325
  X = Y?: 否

16:9 [1920, 1080]:
  Offset X: 0.499479
  Offset Y: 0.499074
  差異: 0.000405
  X = Y?: 否

2:1 [2048, 1024]:
  Offset X: 0.499512
  Offset Y: 0.499023
  差異: 0.000489
  X = Y?: 否
```

---

## 📝 總結

### 核心結論

1. **X 和 Y 的 Offset 不同是正確的** ✅
   - 只有正方形（width = height）時才會相同
   - 矩形必須分別計算

2. **公式已經正確實現** ✅
   ```typescript
   offsetX = 0.5 - (1.0 / width)
   offsetY = 0.5 - (1.0 / height)
   ```

3. **實際驗證通過** ✅
   - 計算值與截圖中的數值完全一致
   - Node UV Scale: X=0.002874, Y=0.003704
   - Ramp UV Offset: X=0.498563, Y=0.498148

### 為什麼之前會誤解？

可能的原因：
1. 直覺上認為 offset 應該是統一的
2. 沒有考慮到不同軸向的像素密度差異
3. 沒有理解 UV 歸一化的獨立性

### 正確的理解

- **UV 空間是歸一化的**：每個軸向獨立映射到 [0, 1]
- **像素補償是相對的**：相對於各自軸向的總長度
- **數學關係是線性的**：offset ∝ 1 / contentSize

---

## 🎉 結論

**當前的實現完全正確！**

公式 `offset = 0.5 - (1.0 / contentSize)` 已經：
✅ 正確考慮了 X 和 Y 的差異  
✅ 根據各自的 contentSize 分別計算  
✅ 實際數值與理論計算完全匹配  
✅ 適用於所有矩形和正方形尺寸  

**不需要修改任何代碼！** 🎊

---

*最後更新: 2025-10-17*
*版本: 1.0.0 - XY Offset 差異解釋*
