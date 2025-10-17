# RampUV Offset = 0 才是數學正確答案

## 📅 最終理解 - 2025-01-17

## 🎯 用戶需求

> "要 左到右 上到下 0~1的 漸變效果，不要從中間開始漸變"

## 🔬 Shader UV 映射分析

### Shader 代碼

```glsl
// 步驟 1: nodeUV 來自頂點座標
nodeUV = a_position.xy;  // 範圍: [-contentSize/2, contentSize/2]

// 步驟 2: 標準化到 [0, 1]
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;

// 步驟 3: 應用 offset 和 scale
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);

// 步驟 4: 使用 rampUV 計算漸變
rampCoord = rampUV.x;  // 或 rampUV.y (取決於方向)
```

### 數學驗證

假設：
- ContentSize = 1200 × 300
- Anchor = 0.5 × 0.5 (中心錨點)
- nodeUVScale = [2/1200, 2/300] = [0.001667, 0.006667]

**左邊界** (x = -600):
```
nodeUV.x = -600
normalizedUV.x = (-600 × 0.001667 + 1.0) × 0.5
               = (-1.0 + 1.0) × 0.5
               = 0.0 ✓
```

**中心** (x = 0):
```
nodeUV.x = 0
normalizedUV.x = (0 × 0.001667 + 1.0) × 0.5
               = 1.0 × 0.5
               = 0.5 ✓
```

**右邊界** (x = 600):
```
nodeUV.x = 600
normalizedUV.x = (600 × 0.001667 + 1.0) × 0.5
               = (1.0 + 1.0) × 0.5
               = 1.0 ✓
```

### 結論

**normalizedUV 已經正確映射到 [0, 1]**

- 左邊界 → 0.0 (漸變起點) ✓
- 中心   → 0.5 (漸變中點) ✓
- 右邊界 → 1.0 (漸變終點) ✓

**這正是用戶要的"左到右 0~1 漸變"！**

---

## 💡 為什麼 offset = 0.0 是正確的？

### 當 rampUVScale = 1.0, offset = 0.0:

```
rampUV = fract((normalizedUV + 0.0) × 1.0)
       = fract(normalizedUV)
       = normalizedUV  (因為已經在 [0,1] 範圍內)
```

**結果**：
- 左邊 rampUV = 0.0 → 漸變色 A (起始色)
- 中間 rampUV = 0.5 → 漸變色 B (中間色)
- 右邊 rampUV = 1.0 → 漸變色 C (結束色)

**這就是完整的 0~1 漸變！**

---

## ❓ 那為什麼之前需要 offset = [0.31, 0.24]？

### 可能的原因

1. **Ramp 紋理設置問題**
   - 如果 Ramp 紋理本身有偏移
   - 或者紋理採樣有問題

2. **視覺對齊需求**
   - 可能想要漸變的"視覺中心"對齊到某個特定位置
   - 這是**藝術需求**，不是數學需求

3. **其他 Shader 參數影響**
   - Ramp Center
   - Ramp Range
   - Distortion

4. **誤解需求**
   - 之前可能混淆了"完整漸變"和"特定視覺效果"

---

## ✅ 正確的公式

```typescript
offset = anchorOffset + tilingOffset

其中：
  anchorOffset = anchor - 0.5
  tilingOffset = (tiling - 1) / (2 × tiling)  [當 tiling > 1]
```

### 標準配置

```
ContentSize: 任意
Anchor: (0.5, 0.5)
Tiling: (1, 1)

→ offset = (0.0, 0.0) ✓

結果: 完整的左到右、上到下 0~1 漸變
```

---

## 🧪 如何驗證

### 測試步驟

1. **設置參數**:
   - Anchor Point = 0.5 × 0.5
   - Tiling = 1 × 1
   - Ramp UV Scale = 1 × 1
   - Ramp UV Offset = 0 × 0

2. **檢查 Ramp Direction**:
   - 0 = 水平 (左到右)
   - 1 = 垂直 (上到下)

3. **檢查 Ramp 紋理**:
   - 應該是簡單的黑到白漸變
   - 或使用顏色漸變 (colorStart → colorEnd)

4. **預期效果**:
   - 水平: 左側是起始色，右側是結束色
   - 垂直: 上側是起始色，下側是結束色

---

## 🎨 如果效果不對怎麼辦？

### 檢查清單

- [ ] Ramp Direction 設置正確
- [ ] Ramp UV Scale = 1.0
- [ ] Ramp UV Offset = 0.0
- [ ] Node UV Scale 正確計算
- [ ] Anchor Point = 0.5 (標準錨點)
- [ ] 沒有使用 Tiled Sprite
- [ ] Ramp 紋理/顏色設置正確
- [ ] Ramp Range = [0.0, 1.0]
- [ ] Ramp Center = [0.5, 0.5] (對圓形/徑向 ramp)

### 如果仍然不對

可能需要**手動調整 offset** 來達到特定的視覺效果。

**這是正常的！** offset 參數的存在就是為了讓你能夠微調漸變的位置。

**數學上 offset = 0.0 是正確的**，但**藝術上**可能需要不同的值。

---

## 📝 總結

```
數學正確答案: offset = 0.0
└─ 對於標準配置 (anchor=0.5, tiling=1)
└─ 產生完整的 0~1 漸變
└─ 左到右、上到下

如果需要其他效果: 手動調整 offset
└─ 這是藝術選擇，不是數學錯誤
└─ offset 就是用來微調視覺效果的
```

**不要再找複雜的公式了！**

**offset = 0** 就是你需要的完整 0~1 漸變的答案！

如果視覺效果不對，檢查其他 Shader 參數，或者根據需要手動調整 offset。
