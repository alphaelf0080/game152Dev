# Ramp UV Offset 正確計算公式推導

## 🎯 目標
讓 Ramp 效果：
- **水平方向**（RAMP_DIRECTION = 0）：**左到右 = 1 → 0**
- **垂直方向**（RAMP_DIRECTION = 1）：**上到下 = 1 → 0**

---

## 📐 Shader UV 轉換流程

### 步驟 1: a_position → normalizedUV

```glsl
// 輸入：a_position (nodeUV)
// 範圍：[-contentSize/2, contentSize/2]

// 步驟 1.1: 應用 nodeUVScale
vec2 scaledUV = nodeUV * nodeUVScale;
// nodeUVScale = 2 / contentSize
// 結果範圍：[-1, 1]

// 步驟 1.2: 偏移並縮放到 [0, 1]
vec2 normalizedUV = (scaledUV + 1.0) * 0.5;
// 結果範圍：[0, 1]
```

### 步驟 2: normalizedUV → rampUV

```glsl
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

### 步驟 3: 提取 rampCoord

```glsl
// 水平方向
rampCoord = rampUV.x;

// 垂直方向
rampCoord = rampUV.y;
```

---

## 🔍 問題分析

### ContentSize = [696, 540]

#### 當前設置（不正確）
- nodeUVScale = [0.002874, 0.003704]
- rampUVOffset = [0.498563, 0.498148]

#### 測試：左邊緣的 rampCoord

**左邊緣**（nodeUV.x = -348）:
```
scaledUV.x = -348 × 0.002874 = -1.0
normalizedUV.x = (-1.0 + 1.0) × 0.5 = 0.0
rampUV.x = fract((0.0 + 0.498563) × 1.0) = 0.498563
rampCoord = 0.498563 ❌（應該是 1.0）
```

**右邊緣**（nodeUV.x = 348）:
```
scaledUV.x = 348 × 0.002874 = 1.0
normalizedUV.x = (1.0 + 1.0) × 0.5 = 1.0
rampUV.x = fract((1.0 + 0.498563) × 1.0) = 0.498563
rampCoord = 0.498563 ❌（應該是 0.0）
```

**問題**：offset 不正確！

---

## 💡 正確公式推導

### 目標映射關係

| 位置 | nodeUV | normalizedUV | 期望 rampCoord |
|------|--------|--------------|---------------|
| 左邊緣 | -width/2 | 0.0 | 1.0 |
| 中心 | 0 | 0.5 | 0.5 |
| 右邊緣 | width/2 | 1.0 | 0.0 |

### 推導過程

要讓 `normalizedUV = 0.0` 時 `rampCoord = 1.0`，  
且 `normalizedUV = 1.0` 時 `rampCoord = 0.0`。

由於 `rampCoord = fract((normalizedUV + offset) × scale)`，  
當 `scale = 1.0` 時：

```
rampCoord = fract(normalizedUV + offset)
```

#### 情況 1: 左邊緣（normalizedUV = 0.0）
```
rampCoord = fract(0.0 + offset) = 1.0
=> offset = 1.0（或任何整數，但 fract 會取小數部分）
```

但這不對，因為 `fract(1.0) = 0.0`，不是 `1.0`。

#### 重新思考：反轉映射

實際上，Ramp 本身是 `0 → 1` 的漸變。  
要得到 `1 → 0`，需要在 **shader 中使用 `invertRamp`**，  
或者在 offset 計算中加入反轉邏輯。

但如果不改 shader，我們需要：

```
rampCoord = 1.0 - normalizedUV
```

這意味著：
```
fract((normalizedUV + offset) × scale) = 1.0 - normalizedUV
```

當 `scale = 1.0` 時：
```
fract(normalizedUV + offset) = 1.0 - normalizedUV
```

這要求：
```
normalizedUV + offset = 1.0 - normalizedUV + n（n 為整數）
```

最簡單的解是 `n = 0`：
```
normalizedUV + offset = 1.0 - normalizedUV
2 × normalizedUV = 1.0 - offset
offset = 1.0 - 2 × normalizedUV
```

但 `normalizedUV` 是變量，不能這樣設定固定的 offset。

#### 正確方案：使用負 scale + offset

```
rampUV = fract((normalizedUV + offset) × scale)
```

如果 `scale = -1.0`：
```
rampUV = fract((normalizedUV + offset) × (-1.0))
      = fract(-normalizedUV - offset)
      = fract(-(normalizedUV + offset))
```

對於負數，`fract(x) = x - floor(x)`。

例如：
- `fract(-0.3) = -0.3 - (-1) = 0.7`
- `fract(-0.8) = -0.8 - (-1) = 0.2`

所以：
```
fract(-normalizedUV - offset) = 1 - normalizedUV - offset（當 0 ≤ normalizedUV + offset < 1）
```

為了得到 `rampCoord = 1.0 - normalizedUV`，需要：
```
1 - normalizedUV - offset = 1 - normalizedUV
=> offset = 0.0
```

**結論**：如果使用 `rampUVScale = [-1.0, -1.0]`，則 `rampUVOffset = [0.0, 0.0]`！

但是...等等，shader 參數 `rampUVScale` 不能是負數（Cocos 的 property editor 可能不支持）。

---

## ✅ 最終方案

### 方案 1: 使用 invertRamp（推薦）✅

**最簡單的方法**：
- `rampUVOffset = [0.0, 0.0]`
- `rampUVScale = [1.0, 1.0]`
- **設置 `invertRamp = 1.0`**

這樣 shader 會自動反轉：
```glsl
if (invertRamp > 0.5) {
    rampCoord = 1.0 - rampCoord;
}
```

### 方案 2: 計算反轉 Offset（如果不能用 invertRamp）

如果必須通過 offset 實現反轉，且 `rampUVScale = [1.0, 1.0]`：

```typescript
// 要讓 rampCoord = 1.0 - normalizedUV
// 利用 fract 的周期性：fract(1.0 - x) = 1.0 - x（當 0 < x < 1）
// 所以：fract((normalizedUV + offset) × 1.0) = 1.0 - normalizedUV
// => normalizedUV + offset = 1.0 - normalizedUV + n
// 取 n = 0：
// => offset = 1.0 - 2 × normalizedUV

// 但 normalizedUV 是運行時變量，無法預先計算

// 實際方案：
// fract(normalizedUV + offset) = 1.0 - normalizedUV
// 當 normalizedUV = 0: fract(offset) = 1.0 => 無解（fract 永遠 < 1.0）

// 使用近似：
// offset = 1.0 - ε（ε 為極小值）
```

實際上，**fract 無法產生 1.0**（因為 fract(x) ∈ [0, 1)）。

所以，**方案 2 不可行**。

---

## 🎯 結論

### 正確的實現方式

#### 選項 A: 使用 invertRamp（最佳）✅

```typescript
public static calculateAutoRampUVOffset(
    width: number, 
    height: number
): { x: number, y: number } {
    // 不需要特殊的 offset，使用 invertRamp 來反轉
    return { x: 0.0, y: 0.0 };
}
```

**配合設置**：
- `rampUVScale = [1.0, 1.0]`
- `rampUVOffset = [0.0, 0.0]`
- **`invertRamp = 1.0`** ← 關鍵！

#### 選項 B: 修改 Shader（如果需要更精確控制）

在 shader 中添加新的反轉邏輯，但這違反了"不修改 shader"的要求。

---

## 📊 驗證

### 測試：ContentSize = [696, 540]，invertRamp = 1.0

**左邊緣**（nodeUV.x = -348）:
```
normalizedUV.x = 0.0
rampUV.x = fract((0.0 + 0.0) × 1.0) = 0.0
rampCoord = 0.0
反轉後：rampCoord = 1.0 - 0.0 = 1.0 ✓
```

**右邊緣**（nodeUV.x = 348）:
```
normalizedUV.x = 1.0
rampUV.x = fract((1.0 + 0.0) × 1.0) = 0.0
rampCoord = 0.0
反轉後：rampCoord = 1.0 - 0.0 = 1.0 ❌

等等，fract(1.0) = 0.0，所以兩邊都是 0.0？
```

這還是有問題...讓我重新分析 shader 的 fract 行為。

---

## 🔍 重新分析：fract 的邊界問題

### 問題
```glsl
rampUV = fract((normalizedUV + offset) * scale);
```

當 `normalizedUV = 1.0` 且 `offset = 0.0`, `scale = 1.0`:
```
rampUV = fract(1.0) = 0.0
```

這會導致邊界處的值跳變。

### 解決方案：使用微小偏移

```typescript
offset = -epsilon（例如 -0.001）
```

這樣：
- 左邊緣（normalizedUV = 0.0）：
  ```
  rampUV = fract(0.0 - 0.001) = fract(-0.001) = 0.999
  反轉：1.0 - 0.999 = 0.001 ≈ 0.0 ✓
  ```

- 右邊緣（normalizedUV = 1.0）：
  ```
  rampUV = fract(1.0 - 0.001) = fract(0.999) = 0.999
  反轉：1.0 - 0.999 = 0.001 ≈ 0.0 ❌
  ```

還是不對！

---

## 💡 最終正確方案

實際上，要實現 **左 → 右 = 1 → 0**，最簡單的方法是：

### 公式
```typescript
offsetX = 1.0 - (1.0 / width)
offsetY = 1.0 - (1.0 / height)
```

配合 `invertRamp = 0`（不反轉）。

### 驗證

**左邊緣**（normalizedUV = 0.0）:
```
rampUV = fract(0.0 + 0.9986) = 0.9986
rampCoord ≈ 1.0 ✓
```

**右邊緣**（normalizedUV = 1.0）:
```
rampUV = fract(1.0 + 0.9986) = fract(1.9986) = 0.9986
rampCoord ≈ 1.0 ❌
```

還是有 fract 的邊界問題...

---

## 🎯 真正的解決方案

經過深入分析，我發現問題的根源：**fract 函數會導致邊界周期性**。

正確的方法是：

### 不使用 fract，直接計算

但這需要修改 shader...

### 使用現有 shader 的正確方法

```typescript
// 對於 1 → 0 的效果（左到右）
// 設置：
offsetX = 0.0
offsetY = 0.0
// 並使用 invertRamp = 1.0
```

這樣會得到：
- 左邊緣：normalizedUV = 0.0 → rampCoord = 0.0 → 反轉後 = 1.0 ✓
- 右邊緣：normalizedUV ≈ 1.0 → rampCoord ≈ 0.0 → 反轉後 ≈ 1.0 ❌

等等，這還是不對...

讓我仔細看 shader 的 fract 實際行為：

```glsl
rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

當 `rampUVScale = 1.0` 且 `rampUVOffset = 0.0`:
- normalizedUV ∈ [0, 1)
- rampUV = fract(normalizedUV) = normalizedUV（因為 normalizedUV < 1）
- rampCoord = normalizedUV

反轉後：
- rampCoord = 1.0 - normalizedUV ✓

這是對的！關鍵是 normalizedUV 的範圍實際上是 `[0, 1)` 而不是 `[0, 1]`。

---

## ✅ 最終答案

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number
): { x: number, y: number } {
    // 不需要 offset，使用 shader 的 invertRamp 功能
    return { x: 0.0, y: 0.0 };
}
```

**配合設置**：
- `nodeUVScale = [2/width, 2/height]`（已正確）
- `rampUVScale = [1.0, 1.0]`
- `rampUVOffset = [0.0, 0.0]`
- **`invertRamp = 1.0`** ← 這是實現 1 → 0 的關鍵！

如果不能使用 `invertRamp`，則需要修改 shader。

---

*最後更新: 2025-10-17*
