# RampColorShader UV Repeat 功能 - 使用指南

## ✅ 功能已添加

現在 RampColorShader 支持完整的 UV 控制：
1. **Sprite Tiling 標準化** - 處理 Tiled Sprite 不重複問題
2. **Ramp UV Repeat** - 讓 Ramp 效果本身可以重複 ✨ 新增
3. **獨立的 Offset 控制** - 兩層獨立的偏移控制

---

## 📊 參數說明

### tilingOffset (vec4)

#### XY - Sprite Tiling 數量
用於標準化 Sprite 的 UV（處理 Tiled Type）

| Sprite Type | 設定值 |
|------------|-------|
| Simple | (1, 1) |
| Tiled 2x2 | (2, 2) |
| Tiled 3x3 | (3, 3) |
| Tiled 4x4 | (4, 4) |

#### ZW - 基礎 Offset
Ramp 效果的基礎偏移（在重複之前應用）

```
(0, 0) = 無偏移
(0.5, 0) = 水平偏移 50%
(0, 0.5) = 垂直偏移 50%
```

### rampUVScale (vec2) - Ramp UV Tiling ⭐ 重點

控制 Ramp 效果的重複次數（**這就是您要的 repeat 功能**）

```
(1, 1) = 不重複（單一 Ramp 效果）
(2, 2) = Ramp 重複 2x2
(3, 3) = Ramp 重複 3x3
(4, 4) = Ramp 重複 4x4
(2, 1) = 水平重複 2 次，垂直不重複
(1, 3) = 水平不重複，垂直重複 3 次
```

### rampUVOffset (vec2) - Ramp UV Offset

Ramp 效果的額外偏移（在重複之後應用）

```
(0, 0) = 無偏移
(0.5, 0) = 水平偏移 50%
(0, 0.5) = 垂直偏移 50%
```

---

## 🎯 使用案例

### 案例 1: Simple Sprite + 不重複

```yaml
Sprite Type: Simple
參數設定:
  tilingOffset: (1, 1, 0, 0)
  rampUVScale: (1, 1)
  rampUVOffset: (0, 0)

結果: 單一 Ramp 效果覆蓋整個 Sprite
```

### 案例 2: Simple Sprite + Ramp 重複 2x2 ⭐

```yaml
Sprite Type: Simple
參數設定:
  tilingOffset: (1, 1, 0, 0)
  rampUVScale: (2, 2)  ← 讓 Ramp 重複
  rampUVOffset: (0, 0)

結果: Ramp 效果在 Sprite 上重複 2x2
```

### 案例 3: Tiled 3x3 Sprite + 不重複

```yaml
Sprite Type: Tiled 3x3
參數設定:
  tilingOffset: (3, 3, 0, 0)  ← 處理 Sprite Tiling
  rampUVScale: (1, 1)
  rampUVOffset: (0, 0)

結果: 單一 Ramp 效果覆蓋整個 Sprite（解決您原始的問題）
```

### 案例 4: Tiled 3x3 Sprite + Ramp 重複 2x2 ⭐⭐

```yaml
Sprite Type: Tiled 3x3
參數設定:
  tilingOffset: (3, 3, 0, 0)  ← 處理 Sprite Tiling
  rampUVScale: (2, 2)         ← Ramp 重複
  rampUVOffset: (0, 0)

結果: Ramp 效果重複 2x2（但整體範圍仍是整個 Sprite）
```

### 案例 5: 水平重複 4 次

```yaml
Sprite Type: Simple
參數設定:
  tilingOffset: (1, 1, 0, 0)
  rampUVScale: (4, 1)  ← 只在水平方向重複
  rampUVOffset: (0, 0)

結果: Ramp 效果水平重複 4 次，垂直方向單一
```

### 案例 6: 使用 Offset 動畫

```yaml
Sprite Type: Simple
參數設定:
  tilingOffset: (1, 1, 0, 0)
  rampUVScale: (2, 2)
  rampUVOffset: (動態改變)  ← 可用於動畫

結果: Ramp 重複 2x2，並且可以移動/動畫
```

---

## 🔄 UV 處理流程

```
原始 a_texCoord (effectUV)
    ↓
第一步：標準化（處理 Sprite Tiling）
    normalizedUV = uv / tilingOffset.xy
    ↓
第二步：應用基礎偏移
    tiledUV = fract(normalizedUV) + tilingOffset.zw
    ↓
第三步：應用 Ramp Tiling（重複）
    rampUV = fract(tiledUV * rampUVScale) + rampUVOffset
    ↓
第四步：扭曲變形（如果啟用）
    distortion effect
    ↓
第五步：Ramp 計算
    根據 RAMP_DIRECTION 計算最終顏色
```

---

## 🧪 測試步驟

### 測試 1: 基本重複功能

```
1. 創建 Simple Sprite
2. 添加 RampColorShader Material
3. 設定:
   - tilingOffset: (1, 1, 0, 0)
   - rampUVScale: (2, 2)  ← 測試重複
4. 預期: Ramp 效果重複 2x2
5. 調整 rampUVScale 到 (3, 3)
6. 預期: Ramp 效果重複 3x3
```

### 測試 2: Tiled Sprite + Ramp 重複

```
1. 創建 Tiled 3x3 Sprite
2. 設定:
   - tilingOffset: (3, 3, 0, 0)  ← 先解決 Sprite Tiling
   - rampUVScale: (1, 1)         ← 先不重複
3. 確認: 單一 Ramp 效果（不會重複數百次）
4. 調整 rampUVScale: (2, 2)     ← 啟用重複
5. 預期: Ramp 在整個 Sprite 範圍內重複 2x2
```

### 測試 3: 方向性重複

```
1. Simple Sprite
2. 測試水平重複:
   - rampUVScale: (4, 1)
   - 預期: 水平 4 條 Ramp
3. 測試垂直重複:
   - rampUVScale: (1, 4)
   - 預期: 垂直 4 條 Ramp
```

### 測試 4: Offset 動畫

```
1. Simple Sprite
2. 設定:
   - rampUVScale: (2, 2)
   - rampUVOffset: (0, 0) → (1, 0) → (0, 0) 循環
3. 預期: Ramp 效果滾動動畫
```

---

## 📊 參數組合建議

### 簡單場景

| 目的 | tilingOffset | rampUVScale | rampUVOffset |
|-----|-------------|-------------|--------------|
| 單一 Ramp | (1,1,0,0) | (1,1) | (0,0) |
| 重複 2x2 | (1,1,0,0) | (2,2) | (0,0) |
| 重複 3x3 | (1,1,0,0) | (3,3) | (0,0) |
| 水平重複 | (1,1,0,0) | (4,1) | (0,0) |

### Tiled Sprite 場景

| Sprite Type | tilingOffset | rampUVScale | 效果 |
|------------|-------------|-------------|------|
| Tiled 3x3 | (3,3,0,0) | (1,1) | 單一 Ramp |
| Tiled 3x3 | (3,3,0,0) | (2,2) | Ramp 重複 2x2 |
| Tiled 2x2 | (2,2,0,0) | (3,3) | Ramp 重複 3x3 |

---

## ⚠️ 注意事項

### 1. 參數順序很重要

UV 處理順序：
1. Sprite Tiling 標準化（`tilingOffset.xy`）
2. 基礎偏移（`tilingOffset.zw`）
3. Ramp Tiling（`rampUVScale`）
4. Ramp Offset（`rampUVOffset`）

### 2. 兩層偏移的差異

- **tilingOffset.zw**: 在 Ramp 重複**之前**應用
- **rampUVOffset**: 在 Ramp 重複**之後**應用

通常只需要使用其中一個。

### 3. 性能考慮

- 較大的重複數值（如 10x10）會增加視覺複雜度
- 但不會顯著影響性能（都是 GPU 計算）

### 4. 與其他效果的組合

- **扭曲效果**: 在 Ramp Tiling 之後應用
- **混合模式**: 不影響 UV 計算
- **顏色調整**: 不影響 UV 計算

---

## 🎨 創意用法

### 動畫效果

```typescript
// 在 TypeScript 中動態修改
material.setProperty('rampUVOffset', new Vec2(
    Math.sin(time) * 0.5,
    Math.cos(time) * 0.5
));
```

### 條紋效果

```yaml
rampUVScale: (10, 1)  # 10 條垂直條紋
或
rampUVScale: (1, 10)  # 10 條水平條紋
```

### 棋盤效果

```yaml
rampUVScale: (8, 8)
RAMP_DIRECTION: 選擇適合的方向
```

---

## ✅ 總結

**現在您可以：**

1. ✅ **處理 Tiled Sprite** - 設定 `tilingOffset.xy` 為 Sprite 的 Tiling 數量
2. ✅ **Ramp 不重複** - 設定 `rampUVScale = (1, 1)`
3. ✅ **Ramp 重複** - 設定 `rampUVScale` 為想要的重複次數 ⭐
4. ✅ **獨立控制** - Sprite Tiling 和 Ramp Tiling 完全獨立
5. ✅ **靈活偏移** - 兩層 offset 控制
6. ✅ **方向性重複** - 可以只在一個方向重複

**所有功能都不增加 uniform 數量，避免載入失敗！**

---

**立即測試**: 設定 `rampUVScale` 到 (2, 2) 看看 Ramp 重複效果！🚀

**時間**: 2025-10-16 18:30
**版本**: RampColorShader Simplified + UV Repeat v1.0
