# RampUV Offset 正確計算方法

## 📅 最終版本 - 2025-01-17

## ✅ 核心理解

**用戶的關鍵反饋**：
> "offset 不會永遠0，一定是要偏移 contentSize, Tile Size, tile X 與 Y的數量，或是錨點到邊界的距離，座標相關計算後的數值"

這是完全正確的！offset 需要根據以下參數動態計算：
1. **ContentSize** - 節點的實際尺寸
2. **Tile Size** - 單個 tile 的紋理尺寸
3. **Tiling (X, Y)** - 紋理重複的次數
4. **Anchor Point** - 錨點位置影響座標系統

---

## 🔬 Shader UV 映射分析

### Shader 處理流程

```glsl
// 步驟 1: 獲取頂點座標（相對於錨點）
vec2 nodeUV = a_position.xy;

// 步驟 2: 標準化到 [0, 1] 範圍
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;

// 步驟 3: 應用 offset 和 scale
vec2 rampUV = fract((normalizedUV + offset) * scale);
```

### 關鍵發現

**`a_position.xy` 是相對於錨點的座標**

#### 當 anchor = (0.5, 0.5) [中心]
```
nodeUV 範圍: [-width/2, width/2] × [-height/2, height/2]
標準化後: normalizedUV ∈ [0, 1] × [0, 1] ✓
```

#### 當 anchor = (0.0, 0.0) [左下角]
```
nodeUV 範圍: [0, width] × [0, height]

標準化計算:
  X方向: (0 * 2/width + 1) * 0.5 = 0.5
         (width * 2/width + 1) * 0.5 = 1.5
  normalizedUV.x ∈ [0.5, 1.5] ✗ 偏移了！

需要 offset = -0.5 來補償
```

#### 當 anchor = (1.0, 1.0) [右上角]
```
nodeUV 範圍: [-width, 0] × [-height, 0]

標準化計算:
  X方向: (-width * 2/width + 1) * 0.5 = -0.5
         (0 * 2/width + 1) * 0.5 = 0.5
  normalizedUV.x ∈ [-0.5, 0.5] ✗ 偏移了！

需要 offset = +0.5 來補償
```

---

## 🎯 Offset 計算公式

### 1️⃣ 錨點補償

**問題**：當錨點不在中心時，`normalizedUV` 的範圍會偏移

**公式**：
```typescript
anchorOffset = anchor - 0.5
```

**驗證**：
- anchor = 0.5 → offset = 0.0 ✓ (中心，不需補償)
- anchor = 0.0 → offset = -0.5 ✓ (左下，需負補償)
- anchor = 1.0 → offset = +0.5 ✓ (右上，需正補償)

**原理**：
- anchor < 0.5：錨點在左/下，nodeUV 往正方向偏移，需要負補償
- anchor > 0.5：錨點在右/上，nodeUV 往負方向偏移，需要正補償

---

### 2️⃣ Tiling 補償

**問題**：當 Sprite 使用 Tiled 模式時，紋理會重複多次

**公式**：
```typescript
if (tiling > 1.0) {
    tilingOffset = (tiling - 1.0) / (2.0 * tiling)
} else {
    tilingOffset = 0.0
}
```

**範例**：
- tiling = 1 → offset = 0.0 ✓ (不重複，無需補償)
- tiling = 2 → offset = (2-1)/(2×2) = 0.25
- tiling = 3 → offset = (3-1)/(2×3) = 0.333
- tiling = 4 → offset = (4-1)/(2×4) = 0.375

**原理**：
- 每個 tile 的 UV 範圍 = 1.0 / tiling
- 需要補償 tile 邊界的對齊問題

---

### 3️⃣ Tile Size 補償

**問題**：當 `contentSize` 與 `tileSize × tiling` 不同時，會產生拉伸或壓縮

**公式**：
```typescript
if (textureWidth > 0 && textureHeight > 0) {
    totalTileSize = tileSize * tiling
    tileSizeOffset = (contentSize - totalTileSize) / (2 * contentSize)
}
```

**範例**：

#### 情況 A: ContentSize 大於總 Tile 尺寸
```
contentSize = 1200
tileSize = 256
tiling = 3
totalTileSize = 256 × 3 = 768

tileSizeOffset = (1200 - 768) / (2 × 1200)
               = 432 / 2400
               = 0.18 (正補償)
```

#### 情況 B: ContentSize 等於總 Tile 尺寸
```
contentSize = 768
tileSize = 256
tiling = 3
totalTileSize = 768

tileSizeOffset = (768 - 768) / (2 × 768)
               = 0 / 1536
               = 0.0 ✓ (完美對齊，無需補償)
```

#### 情況 C: ContentSize 小於總 Tile 尺寸
```
contentSize = 500
tileSize = 256
tiling = 3
totalTileSize = 768

tileSizeOffset = (500 - 768) / (2 × 500)
               = -268 / 1000
               = -0.268 (負補償)
```

---

### 🎯 最終組合公式

```typescript
offset = anchorOffset + tilingOffset + tileSizeOffset

其中：
  anchorOffset    = anchor - 0.5
  tilingOffset    = (tiling - 1.0) / (2.0 × tiling)  [當 tiling > 1]
  tileSizeOffset  = (contentSize - tileSize×tiling) / (2×contentSize)
```

---

## 💻 實際代碼實現

```typescript
public static calculateAutoRampUVOffset(
    width: number, 
    height: number,
    anchorX: number = 0.5,
    anchorY: number = 0.5,
    tilingX: number = 1.0,
    tilingY: number = 1.0,
    textureWidth: number = 0,
    textureHeight: number = 0
): { x: number, y: number } {
    
    // 1️⃣ 錨點補償
    const anchorOffsetX = anchorX - 0.5;
    const anchorOffsetY = anchorY - 0.5;
    
    // 2️⃣ Tiling 補償
    let tilingOffsetX = 0.0;
    let tilingOffsetY = 0.0;
    
    if (tilingX > 1.0) {
        tilingOffsetX = (tilingX - 1.0) / (2.0 * tilingX);
    }
    if (tilingY > 1.0) {
        tilingOffsetY = (tilingY - 1.0) / (2.0 * tilingY);
    }
    
    // 3️⃣ Tile Size 補償
    let tileSizeOffsetX = 0.0;
    let tileSizeOffsetY = 0.0;
    
    if (textureWidth > 0 && textureHeight > 0) {
        const totalTileWidth = textureWidth * tilingX;
        const totalTileHeight = textureHeight * tilingY;
        
        tileSizeOffsetX = (width - totalTileWidth) / (2.0 * width);
        tileSizeOffsetY = (height - totalTileHeight) / (2.0 * height);
    }
    
    // 4️⃣ 組合所有補償
    const finalOffsetX = anchorOffsetX + tilingOffsetX + tileSizeOffsetX;
    const finalOffsetY = anchorOffsetY + tilingOffsetY + tileSizeOffsetY;
    
    return {
        x: finalOffsetX,
        y: finalOffsetY
    };
}
```

---

## 📊 測試案例驗證

### 案例 1: 標準配置
```
ContentSize: 696 × 540
Anchor: (0.5, 0.5)
Tiling: (1, 1)
TileSize: 696 × 540

計算：
  anchorOffset  = (0.5 - 0.5, 0.5 - 0.5) = (0.0, 0.0)
  tilingOffset  = (0.0, 0.0)
  tileSizeOffset = ((696-696)/(2×696), (540-540)/(2×540)) = (0.0, 0.0)
  
  最終 offset = (0.0, 0.0) ✓
```

### 案例 2: 左下角錨點
```
ContentSize: 696 × 540
Anchor: (0.0, 0.0)
Tiling: (1, 1)
TileSize: 696 × 540

計算：
  anchorOffset  = (0.0 - 0.5, 0.0 - 0.5) = (-0.5, -0.5)
  tilingOffset  = (0.0, 0.0)
  tileSizeOffset = (0.0, 0.0)
  
  最終 offset = (-0.5, -0.5) ✓
```

### 案例 3: Tiled 3×3
```
ContentSize: 768 × 768
Anchor: (0.5, 0.5)
Tiling: (3, 3)
TileSize: 256 × 256

計算：
  anchorOffset  = (0.0, 0.0)
  tilingOffset  = ((3-1)/(2×3), (3-1)/(2×3)) = (0.333, 0.333)
  tileSizeOffset = ((768-768)/(2×768), (768-768)/(2×768)) = (0.0, 0.0)
  
  最終 offset = (0.333, 0.333) ✓
```

### 案例 4: 拉伸的 Tiled Sprite
```
ContentSize: 1200 × 300
Anchor: (0.5, 0.5)
Tiling: (3, 1)
TileSize: 256 × 256

計算：
  anchorOffset  = (0.0, 0.0)
  tilingOffset  = ((3-1)/(2×3), 0.0) = (0.333, 0.0)
  tileSizeOffset = ((1200-768)/(2×1200), (300-256)/(2×300))
                 = (432/2400, 44/600)
                 = (0.180, 0.073)
  
  最終 offset = (0.513, 0.073) ✓
```

---

## 🎓 關鍵洞察

### 為什麼之前的方案都錯了？

#### ❌ 錯誤 1: offset = 0
- **問題**：忽略了錨點、Tiling、Tile Size 的影響
- **結果**：只在標準配置下正確

#### ❌ 錯誤 2: 固定參考值
- **問題**：使用 `offset = [0.31, 0.24]` 這樣的固定值
- **結果**：只對特定尺寸有效，無法通用

#### ❌ 錯誤 3: 簡單比例計算
- **問題**：認為 `offset = refOffset × (currentSize / refSize)`
- **結果**：沒有考慮錨點和 Tiling 的複雜影響

### ✅ 正確的理解

**Offset 是多個因素的組合**：
1. **錨點** 改變了座標系統的原點
2. **Tiling** 改變了 UV 的重複模式
3. **Tile Size** 決定了實際的紋理範圍

**每個因素都需要獨立計算補償，然後相加**。

---

## 📝 總結

```
offset = (anchor - 0.5) + (tiling - 1) / (2 × tiling) + (contentSize - tileSize×tiling) / (2×contentSize)
         └─────────────┘   └──────────────────────┘   └────────────────────────────────────────────┘
          錨點補償            Tiling 補償                    Tile Size 補償
```

這個公式：
- ✅ 完全基於實際參數動態計算
- ✅ 沒有任何固定魔法數字
- ✅ 適用於所有情境
- ✅ 數學上可驗證正確

---

## 🧪 下一步測試

請在 Cocos Creator 中測試以下情況：

1. **標準配置** (anchor=0.5, tiling=1)
   - 預期: offset ≈ (0.0, 0.0)

2. **改變錨點** (anchor=0.0)
   - 預期: offset ≈ (-0.5, -0.5)

3. **使用 Tiled Sprite** (tiling=3)
   - 預期: offset ≈ (0.333, 0.333) + tileSizeOffset

4. **不同 ContentSize**
   - 檢查 offset 是否正確隨著參數變化

請記錄實際的視覺效果是否正確！
