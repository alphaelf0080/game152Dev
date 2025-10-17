# RampUV Offset 最終方案實現摘要

## 📅 日期：2025-01-17

## ✅ 問題解決

### 原始問題
用戶反饋：
> "offset 不會永遠0，一定是要偏移 contentSize, Tile Size, tile X 與 Y的數量，或是錨點到邊界的距離，座標相關計算後的數值"

### 正確理解
Offset 需要根據以下參數動態計算：
1. **Anchor Point** - 錨點位置影響座標原點
2. **Tiling (X, Y)** - 紋理重複次數
3. **Tile Size** - 單個 tile 的尺寸
4. **ContentSize** - 節點的實際尺寸

---

## 🎯 最終公式

```typescript
offset = anchorOffset + tilingOffset + tileSizeOffset

其中：
  anchorOffset    = anchor - 0.5
  tilingOffset    = (tiling - 1.0) / (2.0 × tiling)  [當 tiling > 1]
  tileSizeOffset  = (contentSize - tileSize×tiling) / (2×contentSize)
```

### 公式說明

#### 1️⃣ 錨點補償
```
anchorOffset = anchor - 0.5

驗證：
- anchor = 0.5 → offset = 0.0 ✓ (中心)
- anchor = 0.0 → offset = -0.5 ✓ (左下)
- anchor = 1.0 → offset = +0.5 ✓ (右上)
```

#### 2️⃣ Tiling 補償
```
tilingOffset = (tiling - 1.0) / (2.0 × tiling)

驗證：
- tiling = 1 → offset = 0.0 ✓
- tiling = 2 → offset = 0.25 ✓
- tiling = 3 → offset = 0.333 ✓
```

#### 3️⃣ Tile Size 補償
```
tileSizeOffset = (contentSize - tileSize×tiling) / (2×contentSize)

驗證：
- contentSize = tileSize×tiling → offset = 0.0 ✓ (完美對齊)
- contentSize > tileSize×tiling → offset > 0 ✓ (拉伸)
- contentSize < tileSize×tiling → offset < 0 ✓ (壓縮)
```

---

## 💻 代碼實現

### 位置
`game169/assets/scripts/RampShaderResetInspector.ts`

### 關鍵方法
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

### 日誌輸出

當 `showDetailedLogs = true` 時，會輸出詳細的計算過程：

```
📐 RampUV 精準計算結果:
   ContentSize: (1200, 300)
   Anchor Point: (0.5, 0.5)
   NodeUVScale: (0.001667, 0.006667)
   公式: nodeUVScale = 2 / contentSize
   Sprite Tiling: (3, 1)
   Tile Size: 256 x 256

   📍 RampUVOffset 計算詳情:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   最終 Offset: (0.5130, 0.0733)

   組成分析:
     1️⃣  錨點補償    = (0.0000, 0.0000)
        └─ 公式: anchor - 0.5
        └─ 當 anchor=0.5(中心) → offset=0.0 ✓
        └─ 當 anchor=0.0(左下) → offset=-0.5
        └─ 當 anchor=1.0(右上) → offset=+0.5

     2️⃣  Tiling 補償 = (0.3333, 0.0000)
        └─ 公式: (tiling - 1) / (2 × tiling)
        └─ 當 tiling=1 → offset=0.0 ✓
        └─ 當 tiling>1 → 補償 UV 重複

     3️⃣  TileSize 補償 = (0.1800, 0.0733)
        └─ 公式: (contentSize - tileSize×tiling) / (2×contentSize)
        └─ 當 contentSize = tileSize×tiling → offset=0.0 ✓
        └─ 當 contentSize > tileSize×tiling → 正補償
        └─ 當 contentSize < tileSize×tiling → 負補償

   💡 總公式: offset = 錨點補償 + Tiling補償 + TileSize補償
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✓ 此時 rampUVScale=[1.0,1.0] 表示單次完整覆蓋
```

---

## 📊 測試案例

### 案例 1: 標準配置
```
輸入:
  ContentSize: 696 × 540
  Anchor: (0.5, 0.5)
  Tiling: (1, 1)
  TileSize: 696 × 540

預期輸出:
  offset = (0.0, 0.0)
```

### 案例 2: 左下角錨點
```
輸入:
  ContentSize: 696 × 540
  Anchor: (0.0, 0.0)
  Tiling: (1, 1)
  TileSize: 696 × 540

預期輸出:
  offset = (-0.5, -0.5)
```

### 案例 3: Tiled 3×3
```
輸入:
  ContentSize: 768 × 768
  Anchor: (0.5, 0.5)
  Tiling: (3, 3)
  TileSize: 256 × 256

預期輸出:
  offset = (0.333, 0.333)
```

### 案例 4: 拉伸的 Tiled Sprite
```
輸入:
  ContentSize: 1200 × 300
  Anchor: (0.5, 0.5)
  Tiling: (3, 1)
  TileSize: 256 × 256

預期輸出:
  offset = (0.513, 0.073)

計算過程:
  anchorOffset  = (0.0, 0.0)
  tilingOffset  = (0.333, 0.0)
  tileSizeOffset = (0.180, 0.073)
  總和 = (0.513, 0.073) ✓
```

---

## 🔄 與之前方案的對比

### ❌ 錯誤方案 1: offset = 0
- 問題：忽略所有參數影響
- 結果：只在標準配置下正確

### ❌ 錯誤方案 2: 固定參考值 [0.31, 0.24]
- 問題：只對特定尺寸有效
- 結果：無法通用

### ❌ 錯誤方案 3: 簡單比例計算
- 問題：`offset = refOffset × (size / refSize)`
- 結果：沒考慮錨點和 Tiling

### ✅ 正確方案: 多因素組合計算
- 優點：基於實際參數動態計算
- 優點：沒有固定魔法數字
- 優點：適用於所有情境
- 優點：數學上可驗證

---

## 📝 關鍵洞察

### Shader UV 映射原理

```glsl
// Cocos Creator Shader 處理流程
vec2 nodeUV = a_position.xy;  // 相對於錨點的座標
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;
vec2 rampUV = fract((normalizedUV + offset) * scale);
```

**關鍵發現**：
1. `a_position.xy` 是相對於**錨點**的座標，不是絕對座標
2. 當錨點改變時，座標範圍會改變
3. `normalizedUV` 的映射會受到錨點影響
4. `offset` 需要補償這個影響

### 為什麼需要三項補償？

1. **錨點補償**：修正座標系統原點的偏移
2. **Tiling 補償**：修正 UV 重複時的邊界對齊
3. **Tile Size 補償**：修正紋理拉伸/壓縮的影響

每個因素都是獨立的，必須分別計算後相加。

---

## 🧪 測試建議

請在 Cocos Creator 中測試以下情況：

### 測試 1: 改變 Anchor Point
1. 將錨點設為 (0.0, 0.0) 左下角
2. 觀察 Console 日誌中的 offset 值
3. 檢查渲染效果是否正確

### 測試 2: 使用 Tiled Sprite
1. 設定 Sprite Type 為 Tiled
2. 設定 Tiling 為 (3, 3)
3. 觀察 offset 計算是否包含 Tiling 補償

### 測試 3: 改變 ContentSize
1. 動態修改節點的 width 和 height
2. 觀察 offset 是否正確更新
3. 檢查渲染效果是否始終正確

### 測試 4: 綜合測試
1. 同時改變 Anchor、Tiling、ContentSize
2. 驗證三項補償是否正確組合
3. 確認沒有視覺錯誤

---

## ✅ 完成狀態

- ✅ 正確理解 offset 的計算邏輯
- ✅ 實現三項補償公式
- ✅ 更新日誌輸出顯示詳細計算過程
- ✅ 移除所有固定魔法數字
- ✅ 創建詳細文檔說明
- ⏳ 等待 Cocos Creator 中的實際測試驗證

---

## 📚 相關文檔

1. **RampUV-Offset-Calculation-Based-on-Parameters.md** - 詳細計算公式和原理
2. **RampShaderResetInspector.ts** - 實際代碼實現
3. **本文檔** - 實現摘要和測試指南

---

## 🎯 下一步

請在 Cocos Creator 中：
1. 重新加載場景
2. 選擇使用 RampShader 的節點
3. 查看 Console 輸出的計算詳情
4. 驗證視覺效果是否正確
5. 回報任何問題或需要調整的地方

如果視覺效果不正確，請提供：
- Console 中的完整日誌輸出
- 當前的參數值（ContentSize、Anchor、Tiling、TileSize）
- 預期的效果描述
- 實際的視覺效果截圖
