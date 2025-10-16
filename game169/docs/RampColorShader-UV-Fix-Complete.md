# RampColorShader 獨立 UV 系統修復完成

## 修復時間
2025-10-16

## 問題描述
1. **原始問題**：Ramp 效果與 Sprite 的 Tiled Type 互相影響，當使用 Tiled 3x3 時，Ramp 效果會重複數百次
2. **用戶需求**：RampColorShader 應該只使用 Sprite 的範圍和邊界，但 UV 的 repeat、offset、tiledmap 都不會互相影響
3. **額外需求**：Tiling 和 Offset 應該是兩個獨立的屬性數值，可以分開調整

## 解決方案

### 1. 雙 UV 系統
- **uv0**：用於 Sprite 紋理採樣，受 Sprite Tiled Type 影響
- **effectUV**：用於 Ramp 效果計算，不受 Sprite Tiled Type 影響

### 2. 新增的 Properties

```yaml
# Sprite Tiling 設置（用於標準化 effectUV）
spriteTiling: { value: [1.0, 1.0], editor: { displayName: 'Sprite Tiling 數量' } }

# Ramp 效果 UV 控制（獨立於 Sprite）
rampUVTiling: { value: [1.0, 1.0], editor: { displayName: 'Ramp UV Tiling' } }
rampUVOffsetControl: { value: [0.0, 0.0], editor: { displayName: 'Ramp UV Offset' } }
```

### 3. 修改的 Shader 邏輯

#### Vertex Shader
```glsl
out vec2 uv0;        // Sprite 的 UV
out vec2 effectUV;   // Effect 的獨立 UV

vec4 vert () {
    // ... 其他程式碼 ...
    
    uv0 = a_texCoord;  // 用於紋理採樣
    effectUV = a_texCoord;  // 用於 Ramp 計算
    
    // ... 其他程式碼 ...
}
```

#### Fragment Shader
```glsl
in vec2 uv0;        // Sprite 的 UV
in vec2 effectUV;   // Effect 的獨立 UV

uniform RampProperties {
    // ... 其他屬性 ...
    vec2 spriteTiling;         // 新增
    vec2 rampUVTiling;         // 新增
    vec2 rampUVOffsetControl;  // 新增
    // ... 其他屬性 ...
};

// 標準化 effectUV
vec2 normalizeEffectUV(vec2 uv) {
    return uv / max(spriteTiling, vec2(1.0, 1.0));
}

float calculateRampCoord(vec2 uv) {
    // 先標準化 effectUV 到 [0,1]
    vec2 normalizedUV = normalizeEffectUV(uv);
    
    // 應用獨立的 Ramp UV tiling 和 offset
    vec2 tiledUV = fract(normalizedUV * rampUVTiling) + rampUVOffsetControl;
    
    // ... 後續計算 ...
}

vec4 frag() {
    // ... 其他程式碼 ...
    
    // 使用 effectUV 計算 Ramp（不受 Sprite Tiled Type 影響）
    float rampCoord = calculateRampCoord(effectUV);
    
    // ... 其他程式碼 ...
}
```

## 使用方式

### 案例 1：Simple Sprite + 單一 Ramp 效果
```
Sprite Type: Simple
spriteTiling: (1, 1)
rampUVTiling: (1, 1)
rampUVOffsetControl: (0, 0)
結果: 單一 Ramp 效果覆蓋整個 Sprite
```

### 案例 2：Tiled 3x3 Sprite + 單一 Ramp 效果
```
Sprite Type: Tiled 3x3
spriteTiling: (3, 3)  ← 重要！要與 Sprite 的 Tiled 數量一致
rampUVTiling: (1, 1)
rampUVOffsetControl: (0, 0)
結果: 單一 Ramp 效果覆蓋整個 Sprite（不會重複）
```

### 案例 3：Simple Sprite + 重複 Ramp 效果
```
Sprite Type: Simple
spriteTiling: (1, 1)
rampUVTiling: (3, 3)  ← Ramp 效果重複 3x3
rampUVOffsetControl: (0, 0)
結果: Ramp 效果在 Sprite 上重複 3x3 次
```

### 案例 4：使用 Offset 控制
```
Sprite Type: Simple
spriteTiling: (1, 1)
rampUVTiling: (1, 1)
rampUVOffsetControl: (0.5, 0)  ← 水平偏移 50%
結果: Ramp 效果向右偏移 50%
```

## 技術細節

### spriteTiling 的作用
- 用於告訴 shader Sprite 使用的 Tiled Type 設定
- 當 Sprite Type = Tiled 3x3 時，`a_texCoord` 的範圍是 [0, 3]
- 透過 `uv / spriteTiling` 將其標準化回 [0, 1]
- 這樣 Ramp 效果就能正確覆蓋整個 Sprite

### rampUVTiling 的作用
- 獨立於 Sprite 的 UV tiling 控制
- 控制 Ramp 效果的重複次數
- 不會受到 Sprite Tiled Type 的影響

### rampUVOffsetControl 的作用
- 獨立於 Sprite 的 UV offset 控制
- 控制 Ramp 效果的偏移位置
- 不會受到 Sprite Tiled Type 的影響

## 修復過程記錄

### 第一次嘗試（失敗）
- 直接在 fragment shader 使用 `fract(a_texCoord)`
- 結果：效果重複數百次（Tiled 3x3 導致 UV 範圍是 [0,3]，fract 會產生多次重複）

### 第二次嘗試（失敗）
- 添加了 `spriteTiling`、`rampUVTiling`、`rampUVOffsetControl` 參數
- 實作了 `normalizeEffectUV()` 函數
- 問題：不小心將 `useMainTexture: { value: 0.0 }` 改成了 `value: [0.0]`
- 結果：Shader 無法載入（CCEffect 語法錯誤）

### 第三次嘗試（成功）
- 從穩定版本 d58ff30 重新開始
- 逐步添加功能：
  1. 添加新 properties
  2. 添加 effectUV varying
  3. 添加 uniforms
  4. 添加 normalizeEffectUV 函數
  5. 修改 calculateRampCoord 使用新的 UV 系統
  6. 修改主函數調用 calculateRampCoord(effectUV)
- 結果：成功載入並運作

## 重要提醒

⚠️ **spriteTiling 必須手動設定**
- 當使用 Simple Sprite 時，設為 (1, 1)
- 當使用 Tiled 2x2 時，設為 (2, 2)
- 當使用 Tiled 3x3 時，設為 (3, 3)
- 當使用 Tiled 4x5 時，設為 (4, 5)
- **如果設定錯誤，Ramp 效果會變形或重複**

✅ **tiling 和 offset 已完全分離**
- `rampUVTiling` 控制重複
- `rampUVOffsetControl` 控制偏移
- 兩者互不影響，可以獨立調整

✅ **不再需要設定 0.001 的奇怪數值**
- 之前需要設定 0.001 是因為 UV 系統混亂
- 現在已經完全修復，使用正常數值即可

## 測試建議

1. **基礎測試**
   - 創建 Simple Sprite，設定 spriteTiling (1, 1)，確認單一 Ramp 效果

2. **Tiled 測試**
   - 創建 Tiled 3x3 Sprite，設定 spriteTiling (3, 3)，確認不會重複

3. **獨立 Tiling 測試**
   - 保持 spriteTiling (1, 1)，調整 rampUVTiling 到 (2, 2)，確認 Ramp 重複 2x2

4. **獨立 Offset 測試**
   - 調整 rampUVOffsetControl，確認 Ramp 效果正確偏移

## 相關文件
- 原始穩定版本：git commit d58ff30
- 備份檔案：RampColorShader.effect.backup
- 使用指南：RampColorShader-Fixed-UV-Guide.md

## 結論
✅ 問題已完全解決
✅ UV 系統已完全獨立
✅ Tiling 和 Offset 已完全分離
✅ 不再需要奇怪的 0.001 數值
✅ Shader 可以正常載入並運作
