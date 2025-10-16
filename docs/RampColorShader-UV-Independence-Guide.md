# RampColorShader UV 獨立系統實現指南

## 📋 功能說明

實現了 **雙 UV 系統**，完全分離 Sprite 的 UV 和 Effect 的 UV，實現以下目標：

1. ✅ **效果範圍與 Sprite 一致** - Effect 覆蓋整個 Sprite 的顯示區域
2. ✅ **UV 系統完全獨立** - Sprite 的 Tiled Type 不會影響 Effect 的 UV 計算
3. ✅ **各自獨立控制** - Sprite 和 Effect 可以各自設置 repeat、offset、tiling

---

## 🎯 實現方案

### 核心概念：雙 UV 系統

```glsl
// Vertex Shader 輸出兩個 UV
out vec2 uv0;        // Sprite UV - 用於紋理採樣
out vec2 effectUV;   // Effect UV - 用於 Ramp 效果計算
```

### 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                     Vertex Shader                        │
├─────────────────────────────────────────────────────────┤
│  a_texCoord (輸入的紋理座標)                              │
│     │                                                    │
│     ├──► uv0 = a_texCoord                               │
│     │    (保持原始值，受 Sprite Tiled Type 影響)          │
│     │                                                    │
│     └──► effectUV = fract(a_texCoord)                   │
│          (標準化到 0-1 範圍，不受 Tiled Type 影響)        │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Fragment Shader                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  【Sprite 紋理採樣】                                      │
│  ├─ 使用 uv0                                             │
│  ├─ 受 Sprite Tiled Type 影響                            │
│  └─ texture(cc_spriteTexture, uv0)                      │
│                                                          │
│  【主紋理採樣】                                           │
│  ├─ 使用 uv0                                             │
│  ├─ 與 Sprite 保持一致                                   │
│  └─ texture(mainTexture, uv0)                           │
│                                                          │
│  【Ramp 效果計算】                                        │
│  ├─ 使用 effectUV (獨立 UV)                              │
│  ├─ 不受 Sprite Tiled Type 影響                          │
│  ├─ 可使用 tilingOffset 控制效果自己的 repeat/offset     │
│  └─ calculateRampCoord(effectUV)                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 技術細節

### 1. Vertex Shader 修改

```glsl
// 【修改前】單一 UV 系統
out vec2 uv0;

vec4 vert () {
    // ...
    uv0 = a_texCoord;  // 直接使用原始 texCoord
    return pos;
}

// 【修改後】雙 UV 系統
out vec2 uv0;        // Sprite UV
out vec2 effectUV;   // Effect 獨立 UV

vec4 vert () {
    // ...
    
    // uv0: 用於 Sprite 紋理採樣，保持原始 texCoord (受 Tiled Type 影響)
    uv0 = a_texCoord;
    
    // effectUV: 用於 Ramp 效果計算，使用 fract 標準化到 0-1 範圍
    // 即使 Sprite 設置為 Tiled 3x3，effectUV 也始終是 0-1
    effectUV = fract(a_texCoord);
    
    return pos;
}
```

#### 為什麼使用 `fract(a_texCoord)`？

| Sprite Tiled Type | a_texCoord 範圍 | fract(a_texCoord) | 說明 |
|-------------------|-----------------|-------------------|------|
| **Simple (1x1)** | 0.0 - 1.0 | 0.0 - 1.0 | 無變化 |
| **Tiled (3x3)** | 0.0 - 3.0 | 0.0 - 1.0 | 標準化到 0-1 |
| **Sliced** | 變動 | 0.0 - 1.0 | 標準化到 0-1 |

> `fract(x)` 返回 `x` 的小數部分，確保結果始終在 [0, 1) 範圍內。

---

### 2. Fragment Shader 修改

```glsl
// 【修改前】單一 UV
in vec2 uv0;

vec4 frag () {
    // Sprite 紋理
    o *= texture(cc_spriteTexture, uv0);
    
    // 主紋理 (應用 tilingOffset)
    vec2 mainUV = fract(uv0 * tilingOffset.xy) + tilingOffset.zw;
    o *= texture(mainTexture, mainUV);
    
    // Ramp 效果 (使用 uv0，會受 Sprite Tiled Type 影響)
    float rampCoord = calculateRampCoord(uv0);  // ❌ 問題！
    // ...
}

// 【修改後】雙 UV 系統
in vec2 uv0;        // Sprite UV
in vec2 effectUV;   // Effect 獨立 UV

vec4 frag () {
    // Sprite 紋理 (使用 uv0，保持原始行為)
    o *= texture(cc_spriteTexture, uv0);
    
    // 主紋理 (使用 uv0，與 Sprite 保持一致)
    o *= texture(mainTexture, uv0);
    
    // Ramp 效果 (使用 effectUV，完全獨立)
    float rampCoord = calculateRampCoord(effectUV);  // ✅ 解決！
    // ...
}
```

---

### 3. calculateRampCoord 函數說明

```glsl
float calculateRampCoord(vec2 uv) {
    // uv 參數現在接收的是 effectUV (已經是 0-1 範圍)
    
    // tilingOffset 在這裡應用，只影響效果本身的 UV
    vec2 tiledUV = fract(uv * tilingOffset.xy) + tilingOffset.zw;
    
    // 應用扭曲
    if (distortionIntensity > 0.0) {
        vec2 distortionOffset = vec2(
            noise(tiledUV * distortionFrequency) - 0.5,
            noise(tiledUV * distortionFrequency + vec2(17.3, 29.7)) - 0.5
        );
        tiledUV += distortionOffset * distortionIntensity * 0.1;
    }
    
    // 應用 Ramp UV 變換
    vec2 transformedUV = (tiledUV - rampUVOffset) / rampUVScale;
    
    // ... 根據 RAMP_DIRECTION 計算最終座標
}
```

---

## 📊 行為對比表

### 場景 1: Sprite 設置為 Tiled (3x3)

| 項目 | 修改前 | 修改後 |
|------|--------|--------|
| **Sprite 紋理** | 重複 3x3 ✅ | 重複 3x3 ✅ |
| **Ramp 效果** | 重複 3x3 ❌ | 覆蓋整個 Sprite ✅ |
| **tilingOffset** | 影響 Sprite 和效果 ❌ | 只影響效果 ✅ |

### 場景 2: 調整 tilingOffset = (2, 2, 0, 0)

| 項目 | 修改前 | 修改後 |
|------|--------|--------|
| **Sprite 紋理** | 受影響 ❌ | 不受影響 ✅ |
| **Ramp 效果** | 重複 2x2 | 重複 2x2 ✅ |

### 場景 3: Sprite Simple (1x1) + tilingOffset = (1, 1, 0.5, 0)

| 項目 | 修改前 | 修改後 |
|------|--------|--------|
| **Sprite 紋理** | 偏移 0.5 ❌ | 不偏移 ✅ |
| **Ramp 效果** | 偏移 0.5 ✅ | 偏移 0.5 ✅ |

---

## 🎮 使用示例

### 示例 1: Sprite Tiled + 水平漸層效果

```typescript
// 設置 Sprite
sprite.type = Sprite.Type.TILED;  // Tiled 3x3
sprite.spriteFrame = tiledTexture;

// 設置 Material
const material = sprite.customMaterial;

// Ramp 效果設置
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));  // 不重複
material.setProperty('colorStart', new Color(255, 0, 0, 255));  // 紅色
material.setProperty('colorEnd', new Color(0, 0, 255, 255));    // 藍色
// 使用 RAMP_DIRECTION = 0 (Horizontal)

// 結果:
// ✅ Sprite 紋理重複 3x3
// ✅ Ramp 效果是單一的水平漸層，覆蓋整個 Sprite
```

### 示例 2: Simple Sprite + 重複的圓形效果

```typescript
// 設置 Sprite
sprite.type = Sprite.Type.SIMPLE;  // 1x1
sprite.spriteFrame = simpleTexture;

// 設置 Material
const material = sprite.customMaterial;

// Ramp 效果設置 - 重複 4x4 的圓形
material.setProperty('tilingOffset', new Vec4(4, 4, 0, 0));  // 重複 4x4
material.setProperty('colorStart', new Color(0, 0, 0, 255));
material.setProperty('colorEnd', new Color(255, 255, 255, 255));
// 使用 RAMP_DIRECTION = 2 (Circular)

// 結果:
// ✅ Sprite 紋理顯示 1 次
// ✅ Ramp 效果是 4x4 重複的圓形漸層
```

### 示例 3: Tiled Sprite + 扭曲效果

```typescript
// 設置 Sprite
sprite.type = Sprite.Type.TILED;  // 2x2
sprite.spriteFrame = tiledTexture;

// 設置 Material
const material = sprite.customMaterial;

// Ramp 效果設置 - 扭曲的垂直漸層
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
material.setProperty('distortionIntensity', 0.5);    // 中等扭曲
material.setProperty('distortionFrequency', 10.0);   // 高頻率
material.setProperty('colorStart', new Color(255, 255, 0, 255));
material.setProperty('colorEnd', new Color(255, 0, 255, 255));
// 使用 RAMP_DIRECTION = 1 (Vertical)

// 結果:
// ✅ Sprite 紋理重複 2x2
// ✅ Ramp 效果是單一的扭曲垂直漸層，覆蓋整個 Sprite
// ✅ 扭曲效果的頻率和強度獨立控制
```

---

## 🔍 調試技巧

### 1. 視覺化 effectUV

臨時修改 fragment shader 來查看 effectUV：

```glsl
vec4 frag () {
    // 臨時: 視覺化 effectUV
    return vec4(effectUV.x, effectUV.y, 0.0, 1.0);
    
    // 結果:
    // - 左下角是黑色 (0, 0)
    // - 右上角是黃色 (1, 1)
    // - 無論 Sprite Tiled Type 如何設置，顏色分布始終一致
}
```

### 2. 對比 uv0 和 effectUV

```glsl
vec4 frag () {
    // 顯示 uv0 (會受 Tiled Type 影響)
    // return vec4(fract(uv0.x), fract(uv0.y), 0.0, 1.0);
    
    // 顯示 effectUV (不受 Tiled Type 影響)
    return vec4(effectUV.x, effectUV.y, 0.0, 1.0);
}
```

### 3. 檢查 Ramp 計算

在 `calculateRampCoord` 開頭添加：

```glsl
float calculateRampCoord(vec2 uv) {
    // 調試: 直接返回 UV
    // return uv.x;  // 查看輸入的 UV 是否正確
    
    vec2 tiledUV = fract(uv * tilingOffset.xy) + tilingOffset.zw;
    
    // 調試: 查看 tilingOffset 應用後的結果
    // return tiledUV.x;
    
    // ... 正常邏輯
}
```

---

## ⚠️ 注意事項

### 1. useMainTexture 的行為改變

**修改前：**
```glsl
// 主紋理會應用 tilingOffset
vec2 mainUV = fract(uv0 * tilingOffset.xy) + tilingOffset.zw;
vec4 mainTexColor = texture(mainTexture, mainUV);
```

**修改後：**
```glsl
// 主紋理與 Sprite 保持一致，不應用 tilingOffset
vec4 mainTexColor = texture(mainTexture, uv0);
```

> **原因：** 主紋理應該作為 Sprite 的一部分，與 Sprite 的 UV 行為保持一致。如果需要主紋理有獨立的 tiling，可以在材質中設置主紋理自己的 wrap mode。

### 2. tilingOffset 的新語義

| 參數 | 修改前 | 修改後 |
|------|--------|--------|
| **作用對象** | Sprite + Effect | 只有 Effect |
| **用途** | UV 控制（混淆） | 效果的 repeat/offset |

### 3. 向後兼容性

- ✅ **Simple Sprite (1x1)**: 行為完全一致，無影響
- ⚠️ **Tiled/Sliced Sprite**: Ramp 效果不再重複，改為覆蓋整個 Sprite
- ✅ **useMainTexture = 0**: 無影響
- ⚠️ **useMainTexture = 1**: 主紋理不再應用 tilingOffset

---

## 📈 性能影響

### 計算成本

| 項目 | 修改前 | 修改後 | 變化 |
|------|--------|--------|------|
| **Vertex Shader** | 1 個 UV 傳遞 | 2 個 UV 傳遞 | +1 varying |
| **Fragment Shader** | 接收 1 個 UV | 接收 2 個 UV | +1 varying |
| **額外計算** | 無 | `fract(a_texCoord)` | 1 次 fract |

**結論：** 性能影響極小，幾乎可以忽略。

### Varying 變數

```glsl
// 修改前: 3 個 varying
out vec4 color;
out vec2 uv0;

// 修改後: 4 個 varying
out vec4 color;
out vec2 uv0;
out vec2 effectUV;
```

> 現代 GPU 對 varying 變數的數量限制很高（通常 16+），增加 1 個完全沒問題。

---

## 🎯 總結

### 解決的問題

1. ✅ **Sprite Tiled Type 影響效果** → 現在完全獨立
2. ✅ **tilingOffset 影響 Sprite** → 現在只影響效果
3. ✅ **效果範圍不一致** → 現在始終覆蓋整個 Sprite
4. ✅ **無法獨立控制** → 現在各自獨立

### 技術要點

- 🔑 **雙 UV 系統**: `uv0` (Sprite) + `effectUV` (Effect)
- 🔑 **fract() 標準化**: 確保 effectUV 始終在 0-1 範圍
- 🔑 **分離控制**: Sprite 和 Effect 各自使用自己的 UV

### 使用建議

1. **Simple Sprite**: 無需修改現有項目，行為一致
2. **Tiled Sprite**: 檢查 Ramp 效果是否符合預期（不再重複）
3. **useMainTexture**: 如需主紋理 tiling，使用紋理自己的 wrap mode

---

## 📚 相關文件

- `RampColorShader.effect` - Shader 源碼
- `RampShader-Reset-Complete-Guide.md` - 參數重置功能指南
- `requests.md` - 功能需求記錄

---

**版本:** 2.0  
**更新日期:** 2024-10-16  
**相容性:** Cocos Creator 3.8+  
**重大變更:** 是 (Tiled Sprite 效果行為改變)
