# RampUV Offset - 移除 TileSize 補償

## 📅 最終修正 - 2025-01-17

## ❌ 錯誤的方向：TileSize 補償

### 之前的錯誤理解

我之前實現了 TileSize 補償：
```typescript
tileSizeOffset = (contentSize - tileSize×tiling) / (2×contentSize)
```

**問題**：
1. ❌ 假設 offset 需要補償紋理尺寸與節點尺寸的差異
2. ❌ 產生了錯誤的補償值 (0.4667, 0.3667)
3. ❌ 這不是 offset 的真正作用

---

## ✅ 正確的理解：Offset 的真正作用

### Shader UV 映射流程

```glsl
// 步驟 1: 獲取頂點座標（相對於錨點）
vec2 nodeUV = a_position.xy;

// 步驟 2: 標準化到 [0, 1]
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;

// 步驟 3: 應用 offset 和 scale
vec2 rampUV = fract((normalizedUV + offset) * scale);
```

### 關鍵發現

**`normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5` 已經正確標準化了 UV**

驗證（當 anchor = 0.5, nodeUVScale = 2/contentSize）：
```
nodeUV ∈ [-size/2, size/2]

左邊界: (-size/2) * (2/size) = -1
  normalizedUV = (-1 + 1.0) * 0.5 = 0 ✓

右邊界: (size/2) * (2/size) = 1
  normalizedUV = (1 + 1.0) * 0.5 = 1.0 ✓
```

**結論**：UV 已經被正確映射到 [0, 1]，不需要根據紋理尺寸進行補償！

---

## 🎯 正確的 Offset 計算公式

```typescript
offset = anchorOffset + tilingOffset

其中：
  anchorOffset = anchor - 0.5
  tilingOffset = (tiling - 1) / (2 × tiling)  [當 tiling > 1]
```

### 為什麼不需要 TileSize 補償？

1. **紋理尺寸由 Sprite 系統處理**
   - Cocos Creator 的 Sprite 組件負責處理紋理的縮放
   - UV 座標空間始終是 [0, 1]
   - 與實際紋理尺寸無關

2. **nodeUVScale 已經標準化了座標**
   - `nodeUVScale = 2 / contentSize`
   - 這個公式確保 UV 正確映射到 [0, 1]
   - 不需要額外的補償

3. **offset 的作用是微調起始位置**
   - 不是用來補償尺寸差異
   - 只補償錨點和 Tiling 的影響

---

## 📊 修正前後對比

### ❌ 錯誤的計算（修正前）

```
ContentSize: 1200 × 300
Anchor: (0.5, 0.5)
Tiling: (1, 1)
TileSize: 80 × 40 (假設)

計算：
  anchorOffset  = (0.0, 0.0)
  tilingOffset  = (0.0, 0.0)
  tileSizeOffset = ((1200-80)/(2×1200), (300-40)/(2×300))
                 = (0.4667, 0.4333)
  
  最終 offset = (0.4667, 0.4333) ✗ 錯誤！
```

### ✅ 正確的計算（修正後）

```
ContentSize: 1200 × 300
Anchor: (0.5, 0.5)
Tiling: (1, 1)

計算：
  anchorOffset  = (0.5 - 0.5, 0.5 - 0.5) = (0.0, 0.0)
  tilingOffset  = (0.0, 0.0)
  
  最終 offset = (0.0, 0.0) ✓ 正確！
```

---

## 💻 代碼修改

### 移除的錯誤代碼

```typescript
// ❌ 已刪除
let tileSizeOffsetX = 0.0;
let tileSizeOffsetY = 0.0;

if (textureWidth > 0 && textureHeight > 0) {
    const totalTileWidth = textureWidth * tilingX;
    const totalTileHeight = textureHeight * tilingY;
    
    tileSizeOffsetX = (width - totalTileWidth) / (2.0 * width);
    tileSizeOffsetY = (height - totalTileHeight) / (2.0 * height);
}

const finalOffset = anchorOffset + tilingOffset + tileSizeOffset; // ❌
```

### 正確的代碼

```typescript
// ✅ 正確
const anchorOffsetX = anchorX - 0.5;
const anchorOffsetY = anchorY - 0.5;

let tilingOffsetX = 0.0;
let tilingOffsetY = 0.0;

if (tilingX > 1.0) {
    tilingOffsetX = (tilingX - 1.0) / (2.0 * tilingX);
}
if (tilingY > 1.0) {
    tilingOffsetY = (tilingY - 1.0) / (2.0 * tilingY);
}

const finalOffsetX = anchorOffsetX + tilingOffsetX; // ✅
const finalOffsetY = anchorOffsetY + tilingOffsetY; // ✅
```

---

## 🧪 測試案例

### 案例 1: 標準配置
```
ContentSize: 1200 × 300
Anchor: (0.5, 0.5)
Tiling: (1, 1)

預期結果:
  offset = (0.0, 0.0) ✓
```

### 案例 2: 左下角錨點
```
ContentSize: 1200 × 300
Anchor: (0.0, 0.0)
Tiling: (1, 1)

預期結果:
  offset = (-0.5, -0.5) ✓
```

### 案例 3: Tiled 3×3
```
ContentSize: 768 × 768
Anchor: (0.5, 0.5)
Tiling: (3, 3)

預期結果:
  offset = (0.333, 0.333) ✓
```

### 案例 4: 不同 ContentSize（關鍵測試）
```
測試 A: ContentSize = 696 × 540
測試 B: ContentSize = 1200 × 300
測試 C: ContentSize = 512 × 512

所有情況下（anchor=0.5, tiling=1）:
  預期 offset = (0.0, 0.0) ✓
```

---

## 🎓 關鍵洞察

### 為什麼之前會錯誤？

1. **過度思考了問題**
   - 認為 offset 需要補償各種尺寸差異
   - 實際上 Shader 和 Sprite 系統已經處理好了

2. **誤解了 UV 座標空間**
   - UV 座標空間始終是 [0, 1]
   - 與實際像素尺寸無關

3. **沒有充分理解 Shader 代碼**
   - `normalizedUV` 的公式已經正確標準化
   - 不需要額外補償

### 正確的理解

**Offset 只需要補償兩個因素**：
1. **錨點** - 改變了座標系統的原點
2. **Tiling** - 改變了 UV 的重複模式

**不需要補償的**：
- ❌ 紋理尺寸
- ❌ ContentSize 與紋理尺寸的差異
- ❌ 拉伸或壓縮

---

## 📝 總結

```
✅ 正確公式：
offset = (anchor - 0.5) + (tiling - 1) / (2 × tiling)
         └─────────────┘   └──────────────────────┘
          錨點補償            Tiling 補償
```

**原則**：
- ✅ 沒有任何固定魔法數字
- ✅ 完全基於實際參數
- ✅ 簡單明確
- ✅ 數學上可驗證

---

## 🔄 下一步

請在 Cocos Creator 中測試：
1. 標準配置 → offset 應該是 (0, 0)
2. 改變錨點 → offset 應該變化
3. 改變 ContentSize → offset 應該保持不變（對於標準錨點和 tiling）
4. 使用 Tiled Sprite → offset 應該包含 tiling 補償

如果視覺效果仍然不正確，可能需要重新檢查：
- Shader 代碼本身是否正確
- RampUVScale 的設定
- 其他 Shader 參數的影響
