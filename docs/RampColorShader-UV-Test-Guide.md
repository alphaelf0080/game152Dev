# RampColorShader UV 獨立系統 - 快速測試指南

## 🎯 測試目標

驗證 Sprite 的 UV 系統和 Effect 的 UV 系統完全獨立。

---

## 📋 測試準備

### 1. 創建測試場景

在 Cocos Creator 中：

1. 創建一個新的 Canvas
2. 添加一個 Sprite 節點
3. 設置 Sprite 的 SpriteFrame（使用任意紋理）

### 2. 應用 RampColorShader

1. 在 Sprite 的 Inspector 面板中
2. 找到 `CustomMaterial` 屬性
3. 創建一個新的 Material，選擇 `RampColorShader`

---

## 🧪 測試案例

### 測試 1: Simple Sprite + 單一漸層 ✅ 基礎測試

**設置：**
```typescript
// Sprite 設置
sprite.type = Sprite.Type.SIMPLE;

// Material 設置
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
material.setProperty('colorStart', new Color(255, 0, 0, 255));    // 紅色
material.setProperty('colorEnd', new Color(0, 0, 255, 255));      // 藍色
// RAMP_DIRECTION = 0 (Horizontal 水平)
```

**預期結果：**
- ✅ Sprite 正常顯示（不重複）
- ✅ 從左到右的紅→藍漸層
- ✅ 漸層覆蓋整個 Sprite

---

### 測試 2: Tiled Sprite (3x3) + 單一漸層 ⭐ 關鍵測試

**設置：**
```typescript
// Sprite 設置
sprite.type = Sprite.Type.TILED;  // 設置為 Tiled

// Material 設置
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));  // 不重複
material.setProperty('colorStart', new Color(255, 255, 0, 255));  // 黃色
material.setProperty('colorEnd', new Color(255, 0, 255, 255));    // 紫色
// RAMP_DIRECTION = 1 (Vertical 垂直)
```

**預期結果：**
- ✅ Sprite 紋理重複 3x3（或設定的次數）
- ✅ Ramp 效果是單一的垂直漸層（不重複）
- ✅ 漸層覆蓋整個 Sprite 區域（從上到下 黃→紫）

**❌ 修改前的錯誤行為：**
- Ramp 效果也重複 3x3
- 每個 tile 都有一個完整的漸層

---

### 測試 3: Tiled Sprite + 重複的圓形效果 ⭐ 關鍵測試

**設置：**
```typescript
// Sprite 設置
sprite.type = Sprite.Type.TILED;  // 2x2 重複

// Material 設置
material.setProperty('tilingOffset', new Vec4(4, 4, 0, 0));  // 效果重複 4x4
material.setProperty('colorStart', new Color(0, 0, 0, 255));
material.setProperty('colorEnd', new Color(255, 255, 255, 255));
// RAMP_DIRECTION = 2 (Circular 圓形)
```

**預期結果：**
- ✅ Sprite 紋理重複 2x2
- ✅ Ramp 效果（圓形）重複 4x4
- ✅ **兩者的重複數量不同，互不影響**

---

### 測試 4: Simple Sprite + tilingOffset 偏移 ✅ 獨立性測試

**設置：**
```typescript
// Sprite 設置
sprite.type = Sprite.Type.SIMPLE;

// Material 設置 - 注意偏移
material.setProperty('tilingOffset', new Vec4(1, 1, 0.5, 0));  // X 偏移 0.5
material.setProperty('colorStart', new Color(255, 0, 0, 255));
material.setProperty('colorEnd', new Color(0, 255, 0, 255));
// RAMP_DIRECTION = 0 (Horizontal)
```

**預期結果：**
- ✅ Sprite 紋理位置不變（不受 tilingOffset 影響）
- ✅ Ramp 效果向右偏移 50%
- ✅ 漸層中心在 Sprite 的右側

**❌ 修改前的錯誤行為：**
- Sprite 紋理也會偏移

---

### 測試 5: 扭曲效果獨立性 ⭐ 進階測試

**設置：**
```typescript
// Sprite 設置
sprite.type = Sprite.Type.TILED;  // 3x3

// Material 設置
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
material.setProperty('distortionIntensity', 0.5);
material.setProperty('distortionFrequency', 10.0);
material.setProperty('colorStart', new Color(100, 200, 255, 255));
material.setProperty('colorEnd', new Color(255, 100, 200, 255));
// RAMP_DIRECTION = 1 (Vertical)
```

**預期結果：**
- ✅ Sprite 紋理正常重複 3x3（無扭曲）
- ✅ Ramp 效果有扭曲變形
- ✅ 扭曲只影響漸層，不影響 Sprite 紋理

---

### 測試 6: 圓角矩形效果 ✅ 幾何形狀測試

**設置：**
```typescript
// Sprite 設置
sprite.type = Sprite.Type.SIMPLE;

// Material 設置
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
material.setProperty('cornerRadius', 0.3);  // 圓角
material.setProperty('rectangleAspect', new Vec2(1.5, 1.0));
material.setProperty('colorStart', new Color(255, 100, 0, 255));
material.setProperty('colorEnd', new Color(255, 255, 0, 255));
// RAMP_DIRECTION = 4 (Rectangle Inset 內嵌矩形)
```

**預期結果：**
- ✅ 看到一個圓角矩形的漸層
- ✅ 矩形覆蓋整個 Sprite
- ✅ 寬高比為 1.5:1

---

## 🎨 視覺化測試

### 快速視覺測試代碼

臨時修改 fragment shader 來驗證 UV：

```glsl
vec4 frag () {
    // 【測試 1】視覺化 effectUV (應該始終是 0-1 範圍，無論 Sprite Type)
    return vec4(effectUV.x, effectUV.y, 0.0, 1.0);
    
    // 【測試 2】視覺化 uv0 (會隨 Sprite Tiled Type 變化)
    // return vec4(fract(uv0.x), fract(uv0.y), 0.0, 1.0);
    
    // 【測試 3】對比 - 左半邊 uv0，右半邊 effectUV
    // if (uv0.x < 0.5) {
    //     return vec4(fract(uv0.x)*2.0, fract(uv0.y), 0.0, 1.0);
    // } else {
    //     return vec4(effectUV.x*2.0, effectUV.y, 0.0, 1.0);
    // }
    
    // 正常代碼...
}
```

**預期視覺結果：**

| Sprite Type | effectUV 顯示 | uv0 顯示 |
|-------------|---------------|----------|
| Simple (1x1) | 左下黑 → 右上黃 | 左下黑 → 右上黃 |
| Tiled (3x3) | 左下黑 → 右上黃 | 重複 3x3 的色塊 |

---

## ✅ 驗證清單

在 Cocos Creator 中逐一驗證：

### 基礎功能
- [ ] Simple Sprite + 水平漸層正常顯示
- [ ] Simple Sprite + 垂直漸層正常顯示
- [ ] Simple Sprite + 圓形漸層正常顯示

### UV 獨立性 ⭐ 核心測試
- [ ] Tiled Sprite (3x3) + 單一漸層（不重複）
- [ ] Tiled Sprite + 效果重複 4x4（與 Sprite 不同）
- [ ] Sprite 紋理不受 tilingOffset 影響
- [ ] Effect 受 tilingOffset 影響（可調整 repeat/offset）

### 進階功能
- [ ] 扭曲效果只影響 Ramp，不影響 Sprite
- [ ] 圓角矩形效果覆蓋整個 Sprite
- [ ] 所有 6 種 RAMP_DIRECTION 都正常工作
- [ ] 所有 16 種 BLEND_MODE 都正常工作

### 邊界情況
- [ ] tilingOffset = (0.5, 0.5, 0, 0) - 效果放大 2 倍
- [ ] tilingOffset = (2, 2, 0, 0) - 效果縮小到 1/4
- [ ] tilingOffset = (1, 1, 0.5, 0.5) - 效果中心偏移
- [ ] distortionIntensity = 1.0 - 最大扭曲

---

## 🐛 常見問題排查

### 問題 1: Ramp 效果還是重複了

**檢查：**
1. 確認使用的是修改後的 shader
2. 查看 git diff 確認 `effectUV` 已添加
3. 確認 `calculateRampCoord(effectUV)` 而不是 `calculateRampCoord(uv0)`

**調試：**
```glsl
// 在 fragment shader 中臨時添加
vec4 frag () {
    // 應該看到單一漸層，不重複
    return vec4(effectUV.x, effectUV.y, 0.0, 1.0);
}
```

---

### 問題 2: Sprite 紋理位置錯誤

**檢查：**
1. 確認 Sprite 紋理使用 `uv0` 而不是 `effectUV`
2. 查看這行代碼：
   ```glsl
   o *= CCSampleWithAlphaSeparated(cc_spriteTexture, uv0);  // 應該是 uv0
   ```

---

### 問題 3: 主紋理行為改變

**說明：**
修改後，主紋理（useMainTexture）不再應用 tilingOffset。

**修改前：**
```glsl
vec2 mainUV = fract(uv0 * tilingOffset.xy) + tilingOffset.zw;
vec4 mainTexColor = texture(mainTexture, mainUV);
```

**修改後：**
```glsl
vec4 mainTexColor = texture(mainTexture, uv0);
```

**原因：** 主紋理應該與 Sprite 行為一致。如需主紋理 tiling，使用紋理自己的 wrap mode。

---

## 📊 性能測試

### 測試方法

1. 創建 100 個使用 RampColorShader 的 Sprite
2. 觀察 FPS 和 Draw Call

**預期結果：**
- 性能影響極小（+1 varying 變數）
- FPS 下降 < 1%
- Draw Call 不變

---

## 🎓 理解測試

### 核心概念驗證

如果以下測試都通過，說明 UV 獨立系統工作正常：

1. ✅ **測試 2 通過** → Sprite Tiled Type 不影響 Effect
2. ✅ **測試 3 通過** → 兩個 UV 系統可以獨立設置重複次數
3. ✅ **測試 4 通過** → tilingOffset 只影響 Effect
4. ✅ **測試 5 通過** → 扭曲等效果只作用於 Ramp

---

## 📝 測試報告模板

```markdown
# RampColorShader UV 獨立系統測試報告

**測試日期:** 2024-10-16
**測試人員:** [你的名字]
**Cocos Creator 版本:** 3.8.x

## 測試結果

### 基礎功能測試
- [ ] ✅ / ❌ Simple Sprite 正常顯示
- [ ] ✅ / ❌ 所有 Ramp 方向正常工作

### UV 獨立性測試 (核心)
- [ ] ✅ / ❌ Tiled Sprite 不影響 Effect UV
- [ ] ✅ / ❌ tilingOffset 只影響 Effect
- [ ] ✅ / ❌ 兩者可獨立設置重複次數

### 進階功能測試
- [ ] ✅ / ❌ 扭曲效果正常
- [ ] ✅ / ❌ 圓角矩形正常
- [ ] ✅ / ❌ 所有混合模式正常

### 性能測試
- FPS 變化: ____%
- 記憶體變化: ____%

## 問題記錄
(記錄發現的任何問題)

## 結論
[ ] ✅ 通過所有測試
[ ] ⚠️ 部分問題需要修復
[ ] ❌ 重大問題，需要重新實現
```

---

**測試重點:** 測試 2 和測試 3 是最關鍵的，必須通過！

**完成標準:** 至少通過測試 1-4，且無明顯視覺錯誤。
