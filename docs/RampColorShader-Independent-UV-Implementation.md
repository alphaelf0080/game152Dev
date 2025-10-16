# RampColorShader 獨立 UV 系統實現

## 🎯 問題解決

### 問題描述
當 Sprite 使用 Tiled Type（例如 3x3 重複）時，Ramp 效果也會跟著重複 3x3 次，而不是覆蓋整個 Sprite 範圍。

### 解決方案
實現雙 UV 系統：
- **uv0**: 用於 Sprite 紋理採樣（受 Tiled Type 影響）
- **effectUV**: 用於 Ramp 效果計算（完全獨立，不受影響）

---

## 🔧 技術實現

### 1. Vertex Shader 修改

```glsl
// 新增輸出
out vec2 uv0;        // Sprite 的 UV
out vec2 effectUV;   // Effect 的獨立 UV

vec4 vert () {
    // ... 原有代碼 ...
    
    // uv0: 保持原始行為，用於 Sprite 紋理
    uv0 = a_texCoord;
    
    // effectUV: 使用 position 座標，範圍固定為 [0, 1]
    // a_position 範圍是 [-0.5, 0.5]，轉換到 [0, 1]
    effectUV = a_position.xy + vec2(0.5, 0.5);
    
    return pos;
}
```

**關鍵點:**
- `a_texCoord` 在 Tiled 模式下範圍會變化（例如 [0, 3] 表示 3x3）
- `a_position` 始終是模型空間座標 [-0.5, 0.5]，與 Tiled Type 無關

### 2. Fragment Shader 修改

```glsl
// 新增輸入
in vec2 uv0;        // Sprite 的 UV
in vec2 effectUV;   // Effect 的獨立 UV

vec4 frag () {
    // Sprite 紋理 - 使用 uv0 (保持 Tiled 行為)
    o *= CCSampleWithAlphaSeparated(cc_spriteTexture, uv0);
    
    // 主紋理 - 使用 uv0 (與 Sprite 一致)
    if (useMainTexture > 0.5) {
        o *= texture(mainTexture, uv0);
    }
    
    // Ramp 效果 - 使用 effectUV (獨立系統)
    float rampCoord = calculateRampCoord(effectUV);
    
    // ...
}
```

---

## 📊 行為對比

### 修改前 ❌

| Sprite Type | a_texCoord 範圍 | Ramp 效果 |
|-------------|-----------------|-----------|
| Simple (1x1) | 0.0 - 1.0 | 單一漸層 ✅ |
| Tiled (3x3) | 0.0 - 3.0 | 重複 3x3 ❌ |

### 修改後 ✅

| Sprite Type | uv0 範圍 | effectUV 範圍 | Sprite 紋理 | Ramp 效果 |
|-------------|----------|---------------|-------------|-----------|
| Simple (1x1) | 0.0 - 1.0 | 0.0 - 1.0 | 正常顯示 | 單一漸層 ✅ |
| Tiled (3x3) | 0.0 - 3.0 | 0.0 - 1.0 | 重複 3x3 | 單一漸層 ✅ |

---

## 🎮 實際效果

### 場景: Sprite Tiled 3x3 + 垂直漸層

**修改前:**
```
┌───────────────────┐
│ 漸層1 漸層2 漸層3 │  ← Ramp 也重複了 3x3
│ 漸層4 漸層5 漸層6 │
│ 漸層7 漸層8 漸層9 │
└───────────────────┘
```

**修改後:**
```
┌───────────────────┐
│ ┌───────────────┐ │
│ │    紅色      │ │  ← 單一漸層
│ │      ↓       │ │     覆蓋整個
│ │    藍色      │ │     Sprite
│ └───────────────┘ │
└───────────────────┘
```

---

## ✅ 驗證方法

### 測試步驟

1. **設置 Sprite 為 Tiled**
   ```typescript
   sprite.type = Sprite.Type.TILED;
   ```

2. **設置 Ramp 效果**
   ```typescript
   material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
   material.setProperty('colorStart', new Color(255, 0, 0, 255));  // 紅色
   material.setProperty('colorEnd', new Color(0, 0, 255, 255));    // 藍色
   // RAMP_DIRECTION = 1 (垂直)
   ```

3. **預期結果**
   - ✅ Sprite 紋理重複顯示（保持 Tiled 行為）
   - ✅ Ramp 效果是單一的紅→藍垂直漸層
   - ✅ Ramp 覆蓋整個 Sprite 範圍

---

## 🔍 技術細節

### 為什麼使用 a_position 而不是 fract(a_texCoord)?

| 方法 | 優點 | 缺點 |
|------|------|------|
| `fract(a_texCoord)` | 簡單 | Tiled 時每個 tile 都是 0-1，效果還是會重複 |
| `a_position + 0.5` | 真正獨立，不受 Tiled 影響 | 需要理解座標系統 |

**a_position 座標系統:**
```
      (-0.5, 0.5)  -------- (0.5, 0.5)
           |                    |
           |     (0, 0)         |
           |                    |
      (-0.5, -0.5) -------- (0.5, -0.5)
```

轉換後的 effectUV:
```
      (0, 1)  -------- (1, 1)
        |                 |
        |     (0.5, 0.5)  |
        |                 |
      (0, 0)  -------- (1, 0)
```

---

## 📝 參數說明

### tilingOffset 的新語義

**修改後:**
- `tilingOffset` 只影響 Ramp 效果的重複和偏移
- 不再影響 Sprite 紋理和主紋理

**示例:**
```typescript
// tilingOffset = (2, 2, 0, 0) - Ramp 效果重複 2x2
material.setProperty('tilingOffset', new Vec4(2, 2, 0, 0));

// 結果:
// - Sprite 紋理: 保持原樣 (Tiled 3x3)
// - Ramp 效果: 重複 2x2 (獨立控制)
```

---

## 🎓 使用建議

### 1. 簡單場景 (Simple Sprite)

```typescript
sprite.type = Sprite.Type.SIMPLE;
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
// 行為與修改前完全一致
```

### 2. Tiled Sprite + 單一 Ramp

```typescript
sprite.type = Sprite.Type.TILED;  // 紋理重複 3x3
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));  // Ramp 不重複
// Ramp 效果是單一漸層，覆蓋整個 Sprite ✅
```

### 3. Tiled Sprite + 重複 Ramp

```typescript
sprite.type = Sprite.Type.TILED;  // 紋理重複 3x3
material.setProperty('tilingOffset', new Vec4(4, 4, 0, 0));  // Ramp 重複 4x4
// Sprite 和 Ramp 有不同的重複次數，完全獨立 ✅
```

---

## ⚠️ 重要變更

### 向後兼容性

- **Simple Sprite**: ✅ 完全兼容，行為不變
- **Tiled/Sliced Sprite**: ⚠️ 行為改變
  - **修改前**: Ramp 跟著重複
  - **修改後**: Ramp 不重複，覆蓋整個 Sprite

### 主紋理行為變更

**修改前:**
```glsl
vec2 mainUV = fract(uv0 * tilingOffset.xy) + tilingOffset.zw;
vec4 mainTexColor = texture(mainTexture, mainUV);
```

**修改後:**
```glsl
vec4 mainTexColor = texture(mainTexture, uv0);
```

**影響:**
- 主紋理現在與 Sprite 紋理行為一致
- 不再受 `tilingOffset` 影響
- 如需主紋理獨立 tiling，使用紋理自己的 wrap mode

---

## 🚀 性能影響

### 額外開銷

| 項目 | 增加 | 影響 |
|------|------|------|
| Vertex Shader | +1 varying (effectUV) | 極小 |
| Fragment Shader | +1 input | 極小 |
| 計算 | `a_position + 0.5` | 可忽略 |

**結論:** 性能影響幾乎為零，可放心使用。

---

## 📚 相關文檔

- `RampColorShader-UV-Independence-Guide.md` - 完整技術指南
- `RampColorShader-UV-Test-Guide.md` - 測試指南
- `RampColorShader-Troubleshooting-Guide.md` - 問題診斷

---

**版本:** 2.1  
**更新日期:** 2024-10-16  
**重大變更:** 是 (實現獨立 UV 系統)  
**向後兼容:** 部分 (Simple Sprite 完全兼容，Tiled Sprite 行為改變)
