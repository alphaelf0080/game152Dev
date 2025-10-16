# RampColorShader 獨立 UV 系統實現

## 📋 需求說明

根據問題描述：
- shader 要有自己獨立的 UV 系統
- 整個合併起來的 tiledmap 就是 shader 的 UV 0~1，不 repeat
- UV 0~1 覆蓋範圍就是 node 的 content size
- 不受到 sprite 的 tiled 切割，是個完整的獨立 UV 系統

## 🔧 實現方法

### 關鍵變更

#### 1. Vertex Shader 修改

**之前的做法（v3）**：
```glsl
// 使用 fract() 和 tileInfo 間接計算
effectUV = fract(a_texCoord);
tileInfo = floor(a_texCoord);

// 在 fragment shader 中重建 globalUV
vec2 globalUV = (tileInfo + uvInTile) / tileCount;
```

**現在的做法（獨立 UV 系統）**：
```glsl
// 直接在 vertex shader 中計算獨立的 0-1 UV
uniform RampProperties {
    vec4 tilingOffset;  // xy = tiling count
};

vec2 tileCount = max(tilingOffset.xy, vec2(1.0, 1.0));
effectUV = a_texCoord / tileCount;
```

#### 2. Fragment Shader 簡化

**移除了**：
- `tileInfo` varying 變數
- 複雜的 globalUV 重建邏輯

**簡化後的計算**：
```glsl
float calculateRampCoord(vec2 uv) {
    // uv 已經是 0-1 範圍，覆蓋整個 node content size
    
    // 直接應用偏移
    vec2 baseUV = uv + tilingOffset.zw;
    
    // 應用 Ramp UV Tiling 和 Offset
    vec2 rampUV = fract(baseUV * rampUVScale) + rampUVOffset;
    
    // ... 後續處理
}
```

## 📊 工作原理

### Simple Sprite (Type = SIMPLE)

```yaml
輸入:
  a_texCoord 範圍: (0, 0) ~ (1, 1)
  tilingOffset.xy: (1, 1)

計算:
  effectUV = a_texCoord / (1, 1) = a_texCoord
  
結果:
  effectUV 範圍: (0, 0) ~ (1, 1) ✅
  覆蓋整個 sprite
```

### TILED 3x3 Sprite

```yaml
輸入:
  a_texCoord 範圍: (0, 0) ~ (3, 3)
    - Tile (0,0): UV (0,0) ~ (1,1)
    - Tile (1,0): UV (1,0) ~ (2,1)
    - Tile (2,2): UV (2,2) ~ (3,3)
    - etc.
  tilingOffset.xy: (3, 3)

計算:
  effectUV = a_texCoord / (3, 3)
  
結果:
  effectUV 範圍: (0, 0) ~ (1, 1) ✅
  覆蓋整個合併的 tiledmap
  
範例:
  - Tile (0,0) 左下角: a_texCoord=(0,0) → effectUV=(0,0)
  - Tile (1,1) 中心: a_texCoord=(1.5,1.5) → effectUV=(0.5,0.5)
  - Tile (2,2) 右上角: a_texCoord=(3,3) → effectUV=(1,1)
```

## ✅ 優點

### 1. 真正的獨立 UV 系統
- effectUV 永遠是 0-1 範圍
- 不受 sprite tiling 切割影響
- 整個 node content size 就是 UV 0~1 的覆蓋範圍

### 2. 更簡單的實現
- 不需要 `tileInfo` varying 變數
- 減少 vertex-fragment 數據傳輸
- Fragment shader 邏輯更清晰

### 3. 性能優化
- 減少一個 varying (tileInfo)
- 減少 fragment shader 計算量
- 更直接的 UV 計算

### 4. 更好的語義
- effectUV 直接表示在整個 sprite 上的位置
- 無需複雜的 globalUV 重建
- 代碼更容易理解和維護

## 🎯 使用方式

### 參數設定

| Sprite Type | tilingOffset.xy | 說明 |
|------------|----------------|------|
| SIMPLE | (1, 1) | 單一 sprite，effectUV 就是 a_texCoord |
| TILED 2x2 | (2, 2) | 2x2 拼接，effectUV = a_texCoord / 2 |
| TILED 3x3 | (3, 3) | 3x3 拼接，effectUV = a_texCoord / 3 |
| TILED NxM | (N, M) | NxM 拼接，effectUV = a_texCoord / (N,M) |

**重要**: `tilingOffset.xy` 必須設定為正確的 tile 數量！

### 效果示例

#### 水平 Ramp (RAMP_DIRECTION = 0)

```yaml
TILED 3x3 Sprite:
  tilingOffset: (3, 3, 0, 0)
  rampUVScale: (1, 1)
  RAMP_DIRECTION: 0 (水平)

結果:
  ✅ 單一水平漸變從左到右覆蓋整個 sprite
  ✅ 不會在每個 tile 內重複
```

#### Ramp 重複效果

```yaml
TILED 3x3 Sprite:
  tilingOffset: (3, 3, 0, 0)
  rampUVScale: (2, 2)
  RAMP_DIRECTION: 0 (水平)

結果:
  ✅ 水平漸變在整個 sprite 上重複 2 次
  ✅ 重複是基於整個 sprite，不是每個 tile
```

## 🔄 與舊版本對比

### v3 版本 (使用 tileInfo)
```glsl
// Vertex Shader
effectUV = fract(a_texCoord);
tileInfo = floor(a_texCoord);

// Fragment Shader
vec2 uvInTile = uv;
vec2 globalUV = (tileInfo + uvInTile) / tileCount;
```

**缺點**：
- 需要額外的 varying 變數
- Fragment shader 需要重建 globalUV
- 邏輯較複雜

### 新版本 (獨立 UV 系統)
```glsl
// Vertex Shader
uniform RampProperties { vec4 tilingOffset; };
effectUV = a_texCoord / max(tilingOffset.xy, vec2(1.0, 1.0));

// Fragment Shader
// uv 已經是 0-1 範圍，直接使用
vec2 baseUV = uv + tilingOffset.zw;
```

**優點**：
- ✅ 更簡單直接
- ✅ 減少數據傳輸
- ✅ 更好的語義
- ✅ 真正的獨立 UV 系統

## 📝 技術細節

### Uniform 在 Vertex Shader 中的使用

為了在 vertex shader 中訪問 `tilingOffset`，我們在 vertex shader 中聲明了 `RampProperties` uniform block：

```glsl
CCProgram sprite-vs %{
  // 聲明需要的 uniform
  uniform RampProperties {
    vec4 tilingOffset;
  };
  
  vec4 vert() {
    // 可以使用 tilingOffset
    vec2 tileCount = max(tilingOffset.xy, vec2(1.0, 1.0));
    effectUV = a_texCoord / tileCount;
  }
}%
```

Fragment shader 中也有完整的 `RampProperties` 定義，GLSL 會自動處理 uniform block 的共享。

### 為什麼這樣更好

1. **符合需求**: 真正實現了"整個合併起來的 tiledmap 就是 shader 的 UV 0~1"
2. **不受切割影響**: UV 計算完全獨立於 sprite 的 tiling 方式
3. **完整獨立**: effectUV 是一個完整的 0-1 UV 系統，覆蓋整個 node content size

## ✅ 驗證

### 測試案例 1: TILED 3x3 單一 Ramp

```yaml
設定:
  Sprite Type: TILED
  tilingOffset: (3, 3, 0, 0)
  rampUVScale: (1, 1)
  RAMP_DIRECTION: 0 (水平)

預期:
  ✅ 單一水平漸變覆蓋整個 sprite
  ✅ 左邊是起始色，右邊是結束色
  ✅ 沒有在 tile 邊界處重複
```

### 測試案例 2: Simple Sprite

```yaml
設定:
  Sprite Type: SIMPLE
  tilingOffset: (1, 1, 0, 0)
  rampUVScale: (1, 1)
  RAMP_DIRECTION: 0 (水平)

預期:
  ✅ 行為與 v3 版本一致
  ✅ 單一水平漸變
```

## 🎉 總結

這個新的實現方式：
- ✅ **完全符合需求**: 獨立的 UV 系統，UV 0~1 覆蓋整個 node content size
- ✅ **更簡單**: 減少了 varying 變數和計算複雜度
- ✅ **更高效**: 減少數據傳輸和計算量
- ✅ **更清晰**: 代碼邏輯直觀易懂
- ✅ **向後兼容**: 對於 Simple Sprite 行為不變

---

**實現日期**: 2025-10-16  
**版本**: RampColorShader v2.0 - Independent UV System  
**狀態**: ✅ 完成
