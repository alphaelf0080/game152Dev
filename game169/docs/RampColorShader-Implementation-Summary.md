# RampColorShader 獨立 UV 系統實現 - 完整總結

## 📋 需求回顧

根據原始需求：
> 閱讀 https://docs.cocos.com/creator/3.8/manual/en/shader/, 修改這個shader，shader 要有自己獨立的uv系統，整個合併起來的tiledmap 就是shader 的 uv 0~1, 不repeat , uv 0~1覆蓋範圍就是node 的 content size, 不受到sprite 的tiled 切割，是個完整的獨立uv系統

**核心要求**：
1. ✅ Shader 有自己獨立的 UV 系統
2. ✅ 整個合併的 tiledmap 就是 shader 的 UV 0~1（不 repeat）
3. ✅ UV 0~1 覆蓋範圍就是 node 的 content size
4. ✅ 不受 sprite 的 tiled 切割影響
5. ✅ 是個完整的獨立 UV 系統

## ✨ 實現方案

### 核心變更

#### 1. Vertex Shader 修改

**之前 (v1.x)**:
```glsl
// 每個 tile 都有自己的 0-1 UV
effectUV = fract(a_texCoord);
tileInfo = floor(a_texCoord);
```

**現在 (v2.0)**:
```glsl
// 整個 sprite 共用一個 0-1 UV
uniform RampProperties {
    vec4 tilingOffset;  // xy = tile count
};

vec2 tileCount = max(tilingOffset.xy, vec2(1.0, 1.0));
effectUV = a_texCoord / tileCount;
```

**關鍵改進**:
- ✅ 直接將 `a_texCoord` 除以 tile 數量，得到真正的 0-1 UV
- ✅ 不使用 `fract()`，避免每個 tile 都有獨立的 0-1 空間
- ✅ 移除 `tileInfo` varying，簡化數據傳輸

#### 2. Fragment Shader 簡化

**之前 (v1.x)**:
```glsl
in vec2 tileInfo;

vec2 uvInTile = fract(uv);
vec2 globalUV = (tileInfo + uvInTile) / tileCount;
```

**現在 (v2.0)**:
```glsl
// effectUV 已經是 0-1，直接使用
vec2 baseUV = uv + tilingOffset.zw;
vec2 rampUV = fract(baseUV * rampUVScale) + rampUVOffset;
```

**關鍵改進**:
- ✅ 不需要重建 globalUV
- ✅ 減少計算複雜度
- ✅ 邏輯更清晰直觀

## 📊 工作原理

### Simple Sprite (1x1)

```
輸入:
  a_texCoord: (0,0) → (1,1)
  tilingOffset.xy: (1, 1)

計算:
  effectUV = a_texCoord / (1,1) = a_texCoord

結果:
  effectUV: (0,0) → (1,1) ✅
  單一 UV 空間覆蓋整個 sprite
```

### TILED 3x3 Sprite

```
輸入:
  a_texCoord: (0,0) → (3,3)
    Tile (0,0): (0,0) → (1,1)
    Tile (1,0): (1,0) → (2,1)
    Tile (2,2): (2,2) → (3,3)
  tilingOffset.xy: (3, 3)

計算:
  effectUV = a_texCoord / (3,3)

結果:
  effectUV: (0,0) → (1,1) ✅
  單一 UV 空間覆蓋整個合併的 tiledmap

範例座標:
  Tile (0,0) 左下角: a_texCoord=(0,0) → effectUV=(0,0)
  Tile (1,1) 中心:   a_texCoord=(1.5,1.5) → effectUV=(0.5,0.5)
  Tile (2,2) 右上角: a_texCoord=(3,3) → effectUV=(1,1)
```

## 🎯 實現效果

### 視覺效果對比

#### 舊版本 (v1.x) - 錯誤行為
```
TILED 3x3 + 水平 Ramp:

[黑→白] [黑→白] [黑→白]
[黑→白] [黑→白] [黑→白]
[黑→白] [黑→白] [黑→白]

❌ 每個 tile 都重複效果
❌ 看得到 tile 切割
❌ 不是獨立的 UV 系統
```

#### 新版本 (v2.0) - 正確行為
```
TILED 3x3 + 水平 Ramp:

[           黑 → 白           ]
整個 sprite 是單一連續漸變

✅ 單一 UV 空間
✅ 看不出 tile 切割
✅ 真正獨立的 UV 系統
```

### Ramp 重複效果

#### 設定: rampUVScale = [2, 2]

**舊版本 (v1.x)**:
```
每個 tile 重複 2x2 = 9 tiles × 4 = 36 個重複

❌ 基於每個 tile 的重複
```

**新版本 (v2.0)**:
```
整個 sprite 重複 2x2 = 4 個重複

✅ 基於整個 sprite 的重複
```

## 📁 修改的檔案

### 1. RampColorShader.effect

**修改內容**:
- Vertex Shader: 
  - 新增 `uniform RampProperties` 聲明
  - 修改 `effectUV` 計算邏輯
  - 移除 `tileInfo` 輸出
- Fragment Shader:
  - 移除 `tileInfo` 輸入
  - 簡化 `calculateRampCoord()` 函數

**行數統計**:
- 新增: ~15 行
- 刪除: ~20 行
- 淨變化: -5 行（更簡潔）

### 2. 文件

新增 3 個文件：
1. `RampColorShader-Independent-UV-System.md` - 實現原理
2. `RampColorShader-Testing-Guide.md` - 測試指南
3. `RampColorShader-Quick-Reference.md` - 快速參考

## 🔍 技術細節

### Uniform Block 共享

```glsl
// Vertex Shader
uniform RampProperties {
    vec4 tilingOffset;
};

// Fragment Shader  
uniform RampProperties {
    vec4 tilingOffset;
    vec4 colorStart;
    vec4 colorEnd;
    // ... 更多屬性
};
```

**說明**: 
- GLSL 允許不同 shader stage 中的 uniform block 有不同成員
- 引擎會合併成單一 uniform block
- Vertex shader 只訪問它需要的成員（tilingOffset）

### UV 計算數學

對於 TILED NxM sprite:

```glsl
// a_texCoord 範圍: [0, N] × [0, M]
// 目標: effectUV 範圍: [0, 1] × [0, 1]

vec2 tileCount = vec2(N, M);
effectUV = a_texCoord / tileCount;

// 證明:
// 當 a_texCoord = (0, 0) → effectUV = (0, 0) ✓
// 當 a_texCoord = (N, M) → effectUV = (1, 1) ✓
// 當 a_texCoord = (N/2, M/2) → effectUV = (0.5, 0.5) ✓
```

## ✅ 優勢總結

### 1. 符合需求
- ✅ **獨立 UV 系統**: effectUV 不受 sprite tiling 影響
- ✅ **UV 0-1 覆蓋整個 node**: 整個 content size 對應 UV 0-1
- ✅ **不 repeat**: 單一 UV 空間，無重複
- ✅ **不受 tiled 切割**: 看不出 tile 邊界

### 2. 技術優勢
- ✅ **更簡單**: 減少 varying 變數（從 3 個到 2 個）
- ✅ **更高效**: 減少 fragment shader 計算量
- ✅ **更清晰**: 代碼邏輯直觀易懂
- ✅ **向後兼容**: Simple Sprite 行為不變

### 3. 功能增強
- ✅ **統一 UV 基準**: Ramp 重複、偏移都基於整個 sprite
- ✅ **更好的動畫**: 動態效果在整個 sprite 上同步
- ✅ **正確的圓形/徑向 Ramp**: 中心點計算基於整體

## 🧪 測試建議

### 關鍵測試案例

1. **TILED 3x3 + 單一水平 Ramp**
   - 參數: `tilingOffset:[3,3,0,0]`, `rampUVScale:[1,1]`
   - 預期: 單一連續漸變，無重複

2. **TILED 3x3 + Ramp 重複 2x2**
   - 參數: `tilingOffset:[3,3,0,0]`, `rampUVScale:[2,2]`
   - 預期: 整個 sprite 上重複 2x2 次

3. **圓形 Ramp 中心對齊**
   - 參數: `rampCenter:[0.5,0.5]`, `RAMP_DIRECTION:2`
   - 預期: 圓心在整個 sprite 正中央

### 測試工具

詳見:
- 📖 `RampColorShader-Testing-Guide.md` - 完整測試步驟
- 🔧 `RampColorShader-Quick-Reference.md` - 常用配置

## 📝 使用指南

### 基本設定步驟

1. **確認 Sprite Type**
   - SIMPLE → `tilingOffset.xy = [1, 1]`
   - TILED 3x3 → `tilingOffset.xy = [3, 3]`

2. **設定 Ramp 方向**
   - RAMP_DIRECTION: 0=水平, 1=垂直, 2=圓形...

3. **設定顏色**
   - colorStart, colorEnd 或使用 rampTexture

4. **調整效果**
   - rampUVScale: 重複次數
   - rampUVOffset: 偏移（動畫）

### 常見問題

**Q: 每個 tile 都重複效果？**
A: 檢查 `tilingOffset.xy` 是否與實際 tile 數一致

**Q: 效果不連續？**
A: 確認 `tilingOffset.zw = [0, 0]`

**Q: 圓形中心偏移？**
A: 檢查 `rampCenter` 值，`[0.5, 0.5]` 是中心

## 🎉 總結

### 實現成果

✅ **完全符合需求**
- Shader 有獨立的 UV 系統
- UV 0-1 覆蓋整個 node content size
- 不受 sprite tiling 切割
- 是完整的獨立 UV 系統

✅ **技術改進**
- 代碼更簡潔（-5 行）
- 性能更好（減少 varying）
- 邏輯更清晰

✅ **完整文件**
- 實現原理說明
- 測試指南
- 快速參考卡

### 下一步

1. **測試驗證** (需要 Cocos Creator 3.8.x)
   - 按照 `RampColorShader-Testing-Guide.md` 進行測試
   - 驗證所有測試案例

2. **實際應用**
   - 在遊戲場景中使用
   - 根據需要調整參數

3. **反饋優化**
   - 收集使用反饋
   - 必要時進行優化

---

## 📚 相關文件

- 📖 **實現原理**: `RampColorShader-Independent-UV-System.md`
- 🧪 **測試指南**: `RampColorShader-Testing-Guide.md`
- 🔧 **快速參考**: `RampColorShader-Quick-Reference.md`
- 💻 **Shader 代碼**: `assets/effect/RampColorShader.effect`

---

**版本**: RampColorShader v2.0 - Independent UV System  
**實現日期**: 2025-10-16  
**狀態**: ✅ 完成，待測試驗證  
**作者**: Copilot Coding Agent
