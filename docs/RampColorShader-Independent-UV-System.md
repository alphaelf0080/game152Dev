# RampColorShader 獨立 UV 系統說明

## 日期
2025-10-16

## 概述
RampColorShader 實現了一個**完全獨立的 UV 座標系統**，專門用於 Ramp 效果計算。這個系統不受 Cocos Creator Sprite 的 Tiled Map 模式影響，確保 Ramp 效果能夠：

1. 在 SIMPLE sprite 上正確顯示
2. 在 TILED sprite (如 3x3 tiled) 上保持連續性
3. 支援獨立的 UV repeat/tiling 控制
4. 完全不干擾 sprite 原始紋理的 UV 映射

## 問題背景

### Cocos Creator Sprite UV 系統
在 Cocos Creator 中，當使用不同的 Sprite Type 時，vertex shader 接收到的 `a_texCoord` 會有不同的值：

| Sprite Type | UV 範圍 | 說明 |
|------------|---------|------|
| SIMPLE | 0.0 ~ 1.0 | 標準的 0-1 UV 空間 |
| SLICED | 變化 | 根據 9-slice 切片而變化 |
| TILED (3x3) | 0.0 ~ 3.0 | 每個 tile 佔據一個單位的 UV 空間 |
| TILED (5x2) | 0.0 ~ 5.0 (X), 0.0 ~ 2.0 (Y) | 根據 tile 數量而定 |

### 問題
如果 Ramp 效果直接使用 `a_texCoord`：
- ❌ SIMPLE sprite: 正常工作
- ❌ TILED 3x3 sprite: Ramp 會在每個 tile 上重複 3 次（UV 0-3 範圍）
- ❌ UV repeat 控制會與 sprite tiling 相互干擾

### 需求
需要一個**獨立的 UV 系統**：
- ✅ 無論 sprite 是 SIMPLE 還是 TILED，Ramp 效果都應該可控
- ✅ 可以選擇讓 Ramp 在整個 sprite 上連續顯示
- ✅ 也可以選擇讓 Ramp 在每個 tile 上獨立重複
- ✅ 不影響 sprite 原始紋理的採樣

## 解決方案：獨立 UV 系統

### 架構設計

```
Vertex Shader:
┌─────────────────────────────────────────┐
│ 輸入: a_texCoord (來自 Cocos Engine)    │
│                                         │
│ SIMPLE:  0.0 ~ 1.0                      │
│ TILED:   0.0 ~ tileCount                │
└──────────────┬──────────────────────────┘
               │
               ├─────────────────────────────┐
               │                             │
               ▼                             ▼
    ┌──────────────────┐          ┌─────────────────┐
    │ uv0              │          │ effectUV        │
    │ (原始 UV)        │          │ (獨立 UV)       │
    │ 用於 sprite      │          │ 用於 Ramp       │
    │ 紋理採樣         │          │ 效果計算        │
    └──────────────────┘          └─────────────────┘
               │                             │
               │                             │
               ▼                             ▼
    Fragment Shader:                Fragment Shader:
    CCSampleWithAlpha...          calculateRampCoord()
    (sprite texture)              (ramp effect)
```

### 實現細節

#### 1. Vertex Shader - 建立獨立 UV
```glsl
// 輸出兩套 UV 系統
out vec2 uv0;        // Sprite 紋理專用（原始 UV）
out vec2 effectUV;   // Ramp 效果專用（獨立 UV，0-1 範圍）
out vec2 tileInfo;   // Tile 索引資訊

vec4 vert () {
    // ... 位置計算 ...
    
    // uv0: 保持原始 UV（用於 sprite 紋理採樣）
    uv0 = a_texCoord;
    
    // effectUV: 使用 fract() 確保每個 tile 都有完整的 0-1 UV 空間
    // SIMPLE: fract(0.0~1.0) = 0.0~1.0
    // TILED 3x3: fract(0.0~3.0) = 重複 3 次 0.0~1.0
    effectUV = fract(a_texCoord);
    
    // tileInfo: 記錄當前 tile 的索引
    // SIMPLE: floor(0.0~1.0) = (0, 0)
    // TILED 3x3: floor(0.0~3.0) = (0,0), (1,0), (2,0), ..., (2,2)
    tileInfo = floor(a_texCoord);
    
    // ...
}
```

**關鍵技術：`fract()` 函數**
- `fract(x)` 返回 x 的小數部分
- 將任意範圍的 UV 標準化到 0-1
- 每個 tile 都獲得完整的 0-1 UV 空間

#### 2. Fragment Shader - 重建全局 UV
```glsl
float calculateRampCoord(vec2 uv) {
    // uv = effectUV (0-1 範圍)
    // tileInfo = 當前 tile 索引
    
    vec2 tileCount = tilingOffset.xy;  // 必須與 Sprite Type 匹配
    
    // 步驟 1: 重建全局 UV（跨所有 tiles）
    // 公式: globalUV = (tileIndex + uvInTile) / tileCount
    vec2 globalUV = (tileInfo + uv) / tileCount;
    
    // 範例（3x3 TILED）:
    // Tile (0,0) 中心: (0 + 0.5, 0 + 0.5) / 3 = (0.167, 0.167)
    // Tile (1,0) 中心: (1 + 0.5, 0 + 0.5) / 3 = (0.500, 0.167)
    // Tile (2,2) 中心: (2 + 0.5, 2 + 0.5) / 3 = (0.833, 0.833)
    // 結果: 完整的 0-1 全局 UV 空間！
    
    // 步驟 2: 應用基礎偏移
    vec2 baseUV = globalUV + tilingOffset.zw;
    
    // 步驟 3: 應用 Ramp UV Tiling
    vec2 rampUV = fract(baseUV * rampUVScale) + rampUVOffset;
    
    // 步驟 4: 計算 Ramp 座標（根據方向）
    // ...
}
```

### UV 轉換數學

#### SIMPLE Sprite (1x1)
```
Input:  a_texCoord = 0.0 ~ 1.0
        tileInfo = (0, 0)
        effectUV = fract(0.0~1.0) = 0.0 ~ 1.0
        
Global: (0 + 0.0~1.0) / 1 = 0.0 ~ 1.0 ✅
```

#### TILED 3x3 Sprite
```
Tile (0,0):
  Input:  a_texCoord = 0.0 ~ 1.0
          tileInfo = (0, 0)
          effectUV = fract(0.0~1.0) = 0.0 ~ 1.0
  Global: (0 + 0.0~1.0) / 3 = 0.000 ~ 0.333 ✅

Tile (1,0):
  Input:  a_texCoord = 1.0 ~ 2.0
          tileInfo = (1, 0)
          effectUV = fract(1.0~2.0) = 0.0 ~ 1.0
  Global: (1 + 0.0~1.0) / 3 = 0.333 ~ 0.667 ✅

Tile (2,2):
  Input:  a_texCoord = 2.0 ~ 3.0 (X), 2.0 ~ 3.0 (Y)
          tileInfo = (2, 2)
          effectUV = fract(2.0~3.0) = 0.0 ~ 1.0
  Global: (2 + 0.0~1.0) / 3 = 0.667 ~ 1.000 ✅

結果: 完整的 0-1 全局 UV，Ramp 效果連續！
```

## 使用指南

### 參數設定

#### 1. tilingOffset (XY 部分)
**含義**: Sprite 的 Tile 數量

| Sprite Type | 設定值 | 說明 |
|------------|--------|------|
| SIMPLE | `[1, 1, _, _]` | 單一 tile |
| SLICED | `[1, 1, _, _]` | 視為單一 tile |
| TILED 3x3 | `[3, 3, _, _]` | 3x3 = 9 個 tiles |
| TILED 5x2 | `[5, 2, _, _]` | 5x2 = 10 個 tiles |

⚠️ **重要**: 此值必須與 Sprite 組件的設定匹配！

#### 2. rampUVScale
**含義**: Ramp 效果的重複次數（相對於整個 sprite）

```yaml
# 水平方向重複 2 次
rampUVScale: [2, 1]

# 2x2 重複
rampUVScale: [2, 2]

# 不重複（預設）
rampUVScale: [1, 1]
```

**效果**:
- `[1, 1]`: Ramp 在整個 sprite 上顯示一次
- `[2, 1]`: Ramp 水平重複 2 次
- `[3, 3]`: Ramp 在 3x3 網格中重複

#### 3. tilingOffset (ZW 部分)
**含義**: Ramp 的基礎偏移

```yaml
# 水平偏移 0.5
tilingOffset: [_, _, 0.5, 0]

# 對角偏移
tilingOffset: [_, _, 0.25, 0.25]
```

#### 4. rampUVOffset
**含義**: Ramp UV 的額外偏移（在 tiling 之後應用）

```yaml
# 細微調整偏移
rampUVOffset: [0.1, 0.1]
```

### 使用案例

#### 案例 1: SIMPLE Sprite + 水平漸變 + 2x 重複
```yaml
Sprite Type: SIMPLE
tilingOffset: [1, 1, 0, 0]       # SIMPLE = 1x1
rampUVScale: [2, 1]              # 水平重複 2 次
RAMP_DIRECTION: 0                # 水平
BLEND_MODE: 1                    # Multiply
```

**效果**: 水平漸變在 sprite 上重複 2 次

#### 案例 2: TILED 3x3 + 圓形漸變 + 連續
```yaml
Sprite Type: TILED (3x3)
tilingOffset: [3, 3, 0, 0]       # TILED 3x3
rampUVScale: [1, 1]              # 不重複
rampCenter: [0.5, 0.5]           # 中心點
RAMP_DIRECTION: 2                # 圓形
BLEND_MODE: 9                    # Soft Light
```

**效果**: 圓形漸變從整個 3x3 sprite 的中心向外擴散（連續的，不是每個 tile 重複）

#### 案例 3: TILED 3x3 + 每個 Tile 獨立重複
```yaml
Sprite Type: TILED (3x3)
tilingOffset: [3, 3, 0, 0]       # TILED 3x3
rampUVScale: [3, 3]              # 重複 3x3 次
RAMP_DIRECTION: 0                # 水平
BLEND_MODE: 2                    # Screen
```

**效果**: 每個 tile 都有完整的水平漸變（9 個獨立的漸變）

#### 案例 4: UV 滾動動畫（需要腳本）
```typescript
// 在 TypeScript 腳本中動態更新 tilingOffset.zw
update(dt: number) {
    this.offset += dt * 0.1;
    this.material.setProperty('tilingOffset', 
        new Vec4(1, 1, this.offset, 0));
}
```

**效果**: Ramp 效果水平滾動

## 技術優勢

### 1. 完全獨立
- ✅ Sprite 紋理採樣使用 `uv0`（原始 UV）
- ✅ Ramp 計算使用 `effectUV`（獨立 UV）
- ✅ 兩者互不干擾

### 2. 靈活控制
- ✅ 支援 SIMPLE 和 TILED sprite
- ✅ 可選擇連續或重複模式
- ✅ 獨立的 tiling 和 offset 控制

### 3. 數學精確
- ✅ 使用 `fract()` 確保 0-1 範圍
- ✅ 正確的全局 UV 重建
- ✅ 無精度損失

### 4. 效能優化
- ✅ 在 vertex shader 中預計算 `effectUV` 和 `tileInfo`
- ✅ Fragment shader 只需簡單的數學運算
- ✅ 無額外的紋理採樣

## 調試技巧

### 可視化 UV
在 fragment shader 中添加：
```glsl
// 顯示 tile 內的 UV（應該是 0-1）
o.rgb = vec3(effectUV, 0.0);

// 顯示 tile 索引（不同顏色）
o.rgb = vec3(tileInfo / tilingOffset.xy, 0.0);

// 顯示全局 UV
vec2 globalUV = (tileInfo + effectUV) / tilingOffset.xy;
o.rgb = vec3(globalUV, 0.0);
```

### 驗證連續性
在 3x3 TILED sprite 上：
1. 設定 `RAMP_DIRECTION = 0` (水平)
2. 設定 `rampUVScale = [1, 1]` (不重複)
3. 觀察漸變是否從左到右連續
4. 如果每個 tile 都重複，檢查 `tilingOffset.xy` 是否正確設為 `[3, 3]`

## 與標準 Cocos Shader 的對比

### 標準 2D Sprite Shader
```glsl
// 只有一套 UV
in vec2 uv0;

vec4 frag() {
    vec4 color = texture(cc_spriteTexture, uv0);
    // 直接使用 uv0，TILED sprite 會自動重複紋理
    return color;
}
```

**限制**:
- ❌ UV 範圍受 Sprite Type 影響
- ❌ TILED sprite 上的效果會重複
- ❌ 無法控制效果的連續性

### RampColorShader（本實現）
```glsl
// 雙 UV 系統
in vec2 uv0;        // Sprite 紋理
in vec2 effectUV;   // Ramp 效果（獨立）
in vec2 tileInfo;   // Tile 索引

vec4 frag() {
    // Sprite 紋理：使用原始 UV
    vec4 color = texture(cc_spriteTexture, uv0);
    
    // Ramp 效果：使用獨立 UV 系統
    float rampCoord = calculateRampCoord(effectUV);
    // 可以完全控制 Ramp 的行為
    
    return applyBlendMode(color.rgb, rampColor, intensity);
}
```

**優勢**:
- ✅ 獨立的 UV 控制
- ✅ 支援連續和重複模式
- ✅ 靈活的參數設定
- ✅ 不干擾原始紋理

## Cocos Creator 文檔參考

根據 [Cocos Creator 3.8 Shader 文檔](https://docs.cocos.com/creator/3.8/manual/en/shader/):

1. **UV 座標傳遞**: Vertex shader 通過 `in vec2 a_texCoord` 接收 UV，通過 `out` 傳遞給 fragment shader
2. **多重輸出**: 可以定義多個 `out` 變量傳遞不同的資料
3. **fract() 函數**: GLSL 內建函數，返回小數部分
4. **floor() 函數**: GLSL 內建函數，返回整數部分

## 總結

RampColorShader 的獨立 UV 系統是一個精心設計的解決方案，完美解決了以下問題：

1. **問題**: Sprite Tiled 模式會影響 UV 範圍
   **解決**: 使用 `fract()` 建立標準化的 0-1 UV 空間

2. **問題**: 需要跨 tiles 的連續效果
   **解決**: 通過 tileInfo 重建全局 UV

3. **問題**: 需要獨立的 tiling 控制
   **解決**: 分離 sprite tiling 和 ramp tiling

4. **問題**: 不能干擾原始紋理
   **解決**: 雙 UV 系統，各司其職

這個設計充分展示了 shader 編程的靈活性和數學的優雅性，為 2D 遊戲視覺效果提供了強大而靈活的工具。

## 相關文件
- `game169/assets/effect/RampColorShader.effect`: 主 shader 檔案
- `docs/RampColorShader-Guide.md`: 完整使用指南
- `docs/RampColorShader-UV-Controls.md`: UV 控制詳解
- [Cocos Creator Shader 文檔](https://docs.cocos.com/creator/3.8/manual/en/shader/)
