# Ramp UV Offset 正確設置指南 - 實現 1→0 效果

## 📅 更新日期
2025-10-17

## 🎯 目標
實現 Ramp 漸變效果：
- **水平方向**（RAMP_DIRECTION = 0）：**左 → 右 = 1 → 0**
- **垂直方向**（RAMP_DIRECTION = 1）：**上 → 下 = 1 → 0**

---

## ✅ 正確的設置方式

### 步驟 1: RampShaderResetInspector 組件設置

```typescript
// 已自動計算
nodeUVScale = [0.002874, 0.003704]  // 對於 [696, 540]

// 新的正確設置
rampUVOffset = [0.0, 0.0]  // ← 關鍵：設為 0！
```

### 步驟 2: Material 參數設置

在 Cocos Creator Inspector 中設置：

```
Node UV Scale:     [0.002874, 0.003704]  // 自動計算
Ramp UV Tiling:    [1.0, 1.0]            // 單次覆蓋
Ramp UV Offset:    [0.0, 0.0]            // 不偏移
反轉 Ramp:         1                     // ← 關鍵：必須設為 1！
```

---

## 📐 原理說明

### Shader UV 轉換流程

```glsl
// 步驟 1: a_position → normalizedUV
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;
// 結果：[0.0, 1.0]

// 步驟 2: 應用 offset 和 tiling
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
// 當 offset=0, scale=1: rampUV = normalizedUV

// 步驟 3: 提取 rampCoord
float rampCoord = rampUV.x;  // 水平方向
// 或
float rampCoord = rampUV.y;  // 垂直方向

// 步驟 4: 反轉（如果 invertRamp = 1）
if (invertRamp > 0.5) {
    rampCoord = 1.0 - rampCoord;  // ← 這裡實現 1→0！
}
```

### 為什麼 offset = 0.0？

#### 位置映射關係

| 位置 | nodeUV | normalizedUV | rampCoord | 反轉後 |
|------|--------|--------------|-----------|--------|
| **左/上邊緣** | -contentSize/2 | 0.0 | 0.0 | **1.0** ✓ |
| **中心** | 0 | 0.5 | 0.5 | **0.5** ✓ |
| **右/下邊緣** | contentSize/2 | 1.0 | 1.0 | **0.0** ✓ |

#### 計算驗證（ContentSize = [696, 540]）

**X 方向（水平）：**

**左邊緣**（nodeUV.x = -348）：
```
normalizedUV.x = (-348 × 0.002874 + 1.0) × 0.5
               = (-1.0 + 1.0) × 0.5
               = 0.0
rampUV.x = fract((0.0 + 0.0) × 1.0) = 0.0
rampCoord = 0.0
反轉後 = 1.0 - 0.0 = 1.0 ✓
```

**右邊緣**（nodeUV.x = 348）：
```
normalizedUV.x = (348 × 0.002874 + 1.0) × 0.5
               = (1.0 + 1.0) × 0.5
               = 1.0
rampUV.x = fract((1.0 + 0.0) × 1.0) = 0.0  // fract(1.0) = 0.0
rampCoord = 0.0
反轉後 = 1.0 - 0.0 = 1.0 ❌（應該是 0.0）
```

**等等，有問題！**

---

## 🔍 Fract 邊界問題分析

### 問題根源

```glsl
rampUV = fract((normalizedUV + offset) * scale);
```

當 `normalizedUV = 1.0` 時：
```
rampUV = fract(1.0) = 0.0
```

這會導致右/下邊緣的值跳變！

### 解決方案

實際上，`a_position` 的範圍是 `[-contentSize/2, contentSize/2)`（不包含最右邊的邊界）。

所以 `normalizedUV` 的實際範圍是 `[0.0, 1.0)`（不會真正達到 1.0）。

這樣就不會有 fract(1.0) 的問題！

#### 重新驗證

**右邊緣**（nodeUV.x ≈ 347.99...）：
```
normalizedUV.x ≈ 0.9999...
rampUV.x = fract(0.9999...) = 0.9999...
rampCoord ≈ 1.0
反轉後 ≈ 1.0 - 1.0 = 0.0 ✓
```

**完美！**

---

## 🎨 實際設置步驟

### 在 Cocos Creator 中

#### 1. 選擇節點
選擇有 `RampShaderResetInspector` 組件的 Sprite 節點。

#### 2. 檢查 RampShaderResetInspector 設置
```
✓ Target Sprite:          reelBaseColor
✓ Auto Calculate On Load: true
✓ Auto Calculate Offset:  true
✓ Show Detailed Logs:     true
```

#### 3. 檢查 Material 設置（MtrC.mtl）

在 **Effect** 區塊：
```
Effect: effect/RampColorShader
Technique: 0
```

在 **Pass 0** 區塊：

**必須設置的參數**：
```
RAMP DIRECTION:    0（水平）或 1（垂直）
BLEND MODE:        0（或你需要的混合模式）
USE TEXTURE:       勾選
主紋理:            cc.TextureBase
Node UV Scale:     [自動計算，例如 0.002874, 0.003704]
Ramp UV Tiling:    [1.0, 1.0]
Ramp UV Offset:    [0.0, 0.0]  ← 關鍵！
反轉 Ramp:         1            ← 關鍵！
```

**其他參數**：
```
使用 Ramp 紋理:    根據需求設置
Ramp 紋理:         cc.TextureBase（如果使用）
起始顏色:          000000
結束顏色:          FFFFFF
Ramp 中心點:       [0.5, 0.5]
Ramp 範圍:         [0.0, 1.0]
亮度調整:          0
對比度:            1
飽和度:            1
```

---

## 🧪 測試驗證

### 測試代碼

在瀏覽器 Console 中執行：

```typescript
// 模擬 shader 計算
function testRampCalculation(width, height) {
    const nodeUVScale = {
        x: 2.0 / width,
        y: 2.0 / height
    };
    
    const rampUVOffset = { x: 0.0, y: 0.0 };
    const rampUVScale = { x: 1.0, y: 1.0 };
    const invertRamp = 1.0;
    
    // 測試點
    const testPoints = [
        { name: "左邊緣", nodeUV: { x: -width/2, y: 0 } },
        { name: "中心", nodeUV: { x: 0, y: 0 } },
        { name: "右邊緣", nodeUV: { x: width/2 - 0.1, y: 0 } }
    ];
    
    console.log(`\n=== ContentSize = [${width}, ${height}] ===\n`);
    console.log(`Node UV Scale: [${nodeUVScale.x.toFixed(6)}, ${nodeUVScale.y.toFixed(6)}]\n`);
    
    testPoints.forEach(point => {
        // 步驟 1: 計算 normalizedUV
        const scaledX = point.nodeUV.x * nodeUVScale.x;
        const normalizedX = (scaledX + 1.0) * 0.5;
        
        // 步驟 2: 應用 offset 和 tiling
        const rampUVX = ((normalizedX + rampUVOffset.x) * rampUVScale.x) % 1.0;
        
        // 步驟 3: rampCoord
        let rampCoord = rampUVX;
        
        // 步驟 4: 反轉
        if (invertRamp > 0.5) {
            rampCoord = 1.0 - rampCoord;
        }
        
        console.log(`${point.name}:`);
        console.log(`  nodeUV.x = ${point.nodeUV.x}`);
        console.log(`  normalizedUV.x = ${normalizedX.toFixed(4)}`);
        console.log(`  rampCoord = ${rampCoord.toFixed(4)}`);
        console.log(``);
    });
}

// 執行測試
testRampCalculation(696, 540);
```

### 預期輸出

```
=== ContentSize = [696, 540] ===

Node UV Scale: [0.002874, 0.003704]

左邊緣:
  nodeUV.x = -348
  normalizedUV.x = 0.0000
  rampCoord = 1.0000

中心:
  nodeUV.x = 0
  normalizedUV.x = 0.5000
  rampCoord = 0.5000

右邊緣:
  nodeUV.x = 347.9
  normalizedUV.x = 0.9999
  rampCoord = 0.0001
```

**結果**：左 → 右 = 1.0 → 0.0 ✓

---

## 📋 檢查清單

使用此清單確保設置正確：

### RampShaderResetInspector 組件
- [ ] `autoCalculateOnLoad = true`
- [ ] `autoCalculateOffset = true`
- [ ] Target Sprite 已正確設置

### Material 參數
- [ ] `nodeUVScale` 已自動計算（例如 [0.002874, 0.003704]）
- [ ] `rampUVScale = [1.0, 1.0]`
- [ ] **`rampUVOffset = [0.0, 0.0]`** ← 重要！
- [ ] **`反轉 Ramp = 1`** ← 重要！

### 視覺驗證
- [ ] 水平 Ramp：左側較亮（白色），右側較暗（黑色）
- [ ] 垂直 Ramp：上方較亮（白色），下方較暗（黑色）

---

## 🐛 常見問題

### Q1: 為什麼之前的 offset ≈ 0.498 不正確？

**A**: 那個 offset 是為了補償像素邊界，但並不能實現 1→0 的效果。  
真正的 1→0 效果需要使用 shader 的 `invertRamp` 參數。

### Q2: 如果不使用 invertRamp，能實現 1→0 嗎？

**A**: 理論上可以通過設置 `offset ≈ 1.0` 來實現，但由於 `fract` 函數的周期性，會有邊界問題。  
**推薦方案**：使用 `offset = 0.0` + `invertRamp = 1`。

### Q3: 為什麼 X 和 Y 的 offset 都是 0.0？

**A**: 因為我們使用 `invertRamp` 來統一反轉，不需要通過 offset 來實現不同的效果。  
X 和 Y 都設為 0.0 是最簡單、最正確的方式。

### Q4: autoCalculateOffset 現在計算的是什麼？

**A**: 現在 `calculateAutoRampUVOffset` 返回 `[0.0, 0.0]`，並自動設置到 Material。  
要實現 1→0 效果，記得在 Inspector 中手動設置 `反轉 Ramp = 1`。

---

## 📝 總結

### 核心公式

```typescript
// RampShaderResetInspector.ts
public static calculateAutoRampUVOffset(width, height) {
    return { x: 0.0, y: 0.0 };
}
```

### 關鍵設置

1. **rampUVOffset = [0.0, 0.0]**（自動計算）
2. **invertRamp = 1**（手動設置）

### 效果

- ✅ 水平：左(亮) → 右(暗) = 1 → 0
- ✅ 垂直：上(亮) → 下(暗) = 1 → 0
- ✅ 適用於所有 contentSize
- ✅ X 和 Y 方向都正確

---

## 🔄 更新歷史

- **v3.0.0** (2025-10-17): 重新推導公式，使用 `offset = 0.0` + `invertRamp = 1`
- **v2.0.0** (2025-10-17): 初版 `offset = 0.5 - 1/size`（不正確）
- **v1.0.0** (2025-10-17): 基礎實現

---

*最後更新: 2025-10-17*
*版本: 3.0.0 - 正確實現 1→0 效果*
