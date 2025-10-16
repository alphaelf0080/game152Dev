# RampColorShader 獨立 UV 系統 - 修正版本

## 🎯 問題解決

### 原始問題
1. ❌ 使用 `a_position` 導致效果重複數百次
2. ❌ tilingOffset 將 tiling 和 offset 混在一起，難以調整
3. ❌ 需要設置到 0.001 才能正常顯示

### 解決方案
1. ✅ 添加 `spriteTiling` 參數讓用戶指定 Sprite 的重複次數
2. ✅ 分離 `rampUVTiling` 和 `rampUVOffsetControl` 為獨立參數
3. ✅ 使用可靠的 UV 標準化方法

---

## 🔧 新增參數

### 1. spriteTiling (必須設置)

**類型:** Vec2  
**預設值:** `[1.0, 1.0]`  
**用途:** 告訴 shader 您的 Sprite 重複了多少次

**設置方法:**

```typescript
// Simple Sprite (不重複)
material.setProperty('spriteTiling', new Vec2(1, 1));

// Tiled Sprite 3x3
material.setProperty('spriteTiling', new Vec2(3, 3));

// Tiled Sprite 5x2 (寬5次，高2次)
material.setProperty('spriteTiling', new Vec2(5, 2));
```

**重要:** 這個值必須與您的 Sprite Tiled Type 設置一致！

### 2. rampUVTiling (獨立的 Ramp 重複)

**類型:** Vec2  
**預設值:** `[1.0, 1.0]`  
**用途:** 控制 Ramp 效果自己的重複次數（不影響 Sprite）

**示例:**

```typescript
// Ramp 效果不重複（覆蓋整個 Sprite）
material.setProperty('rampUVTiling', new Vec2(1, 1));

// Ramp 效果重複 2x2
material.setProperty('rampUVTiling', new Vec2(2, 2));

// Ramp 效果只在 X 方向重複 4 次
material.setProperty('rampUVTiling', new Vec2(4, 1));
```

### 3. rampUVOffsetControl (獨立的 Ramp 偏移)

**類型:** Vec2  
**預設值:** `[0.0, 0.0]`  
**用途:** 控制 Ramp 效果的偏移（不影響 Sprite）

**示例:**

```typescript
// 不偏移
material.setProperty('rampUVOffsetControl', new Vec2(0, 0));

// 向右偏移 50%
material.setProperty('rampUVOffsetControl', new Vec2(0.5, 0));

// 對角偏移
material.setProperty('rampUVOffsetControl', new Vec2(0.3, 0.3));
```

---

## 📊 完整示例

### 示例 1: Simple Sprite + 單一漸層

```typescript
import { Sprite, Material, Vec2, Color } from 'cc';

// Sprite 設置
sprite.type = Sprite.Type.SIMPLE;

// Material 設置
const material = sprite.customMaterial;

// 1. 告訴 shader Sprite 不重複
material.setProperty('spriteTiling', new Vec2(1, 1));

// 2. Ramp 效果也不重複
material.setProperty('rampUVTiling', new Vec2(1, 1));
material.setProperty('rampUVOffsetControl', new Vec2(0, 0));

// 3. 設置漸層顏色
material.setProperty('colorStart', new Color(255, 0, 0, 255));  // 紅色
material.setProperty('colorEnd', new Color(0, 0, 255, 255));    // 藍色

// 結果: 從左到右紅→藍的單一漸層
```

### 示例 2: Tiled Sprite 3x3 + 單一 Ramp ⭐ 關鍵示例

```typescript
// Sprite 設置 - 重複 3x3
sprite.type = Sprite.Type.TILED;

// Material 設置
const material = sprite.customMaterial;

// ⚠️ 重要！告訴 shader Sprite 重複了 3x3
material.setProperty('spriteTiling', new Vec2(3, 3));

// Ramp 效果不重複（覆蓋整個 Sprite）
material.setProperty('rampUVTiling', new Vec2(1, 1));
material.setProperty('rampUVOffsetControl', new Vec2(0, 0));

// 設置漸層
material.setProperty('colorStart', new Color(255, 255, 0, 255));  // 黃色
material.setProperty('colorEnd', new Color(255, 0, 255, 255));    // 紫色
// RAMP_DIRECTION = 1 (垂直)

// 結果:
// ✅ Sprite 紋理重複 3x3
// ✅ Ramp 效果是單一的垂直漸層（黃→紫）
// ✅ Ramp 覆蓋整個 Sprite 範圍
```

### 示例 3: Tiled Sprite 3x3 + Ramp 重複 4x4

```typescript
// Sprite 設置 - 重複 3x3
sprite.type = Sprite.Type.TILED;
material.setProperty('spriteTiling', new Vec2(3, 3));

// Ramp 效果重複 4x4（與 Sprite 不同！）
material.setProperty('rampUVTiling', new Vec2(4, 4));
material.setProperty('rampUVOffsetControl', new Vec2(0, 0));

// 設置圓形漸層
material.setProperty('colorStart', new Color(0, 0, 0, 255));
material.setProperty('colorEnd', new Color(255, 255, 255, 255));
// RAMP_DIRECTION = 2 (圓形)

// 結果:
// ✅ Sprite 紋理重複 3x3
// ✅ Ramp 圓形效果重複 4x4
// ✅ 兩者完全獨立！
```

### 示例 4: 偏移效果

```typescript
// Sprite 設置
sprite.type = Sprite.Type.SIMPLE;
material.setProperty('spriteTiling', new Vec2(1, 1));

// Ramp 不重複，但偏移 50%
material.setProperty('rampUVTiling', new Vec2(1, 1));
material.setProperty('rampUVOffsetControl', new Vec2(0.5, 0));  // 向右偏移一半

// 水平漸層
material.setProperty('colorStart', new Color(255, 0, 0, 255));
material.setProperty('colorEnd', new Color(0, 255, 0, 255));
// RAMP_DIRECTION = 0 (水平)

// 結果:
// 漸層的中心點向右移動了 50%
// 左邊會看到更多綠色，右邊更多紅色
```

---

## 🎓 技術原理

### UV 標準化流程

```glsl
// Vertex Shader
effectUV = a_texCoord;  // 直接傳遞原始 texCoord

// Fragment Shader
vec2 normalizeEffectUV(vec2 uv) {
    // 使用 spriteTiling 將 UV 標準化到 [0,1]
    // Simple Sprite (1,1): uv / 1 = uv (不變)
    // Tiled 3x3 (3,3): uv / 3 (從 [0,3] 映射到 [0,1])
    return uv / max(spriteTiling, vec2(1.0, 1.0));
}

float calculateRampCoord(vec2 uv) {
    // 1. 標準化
    vec2 normalizedUV = normalizeEffectUV(uv);  // 現在是 [0,1]
    
    // 2. 應用 Ramp 自己的 tiling 和 offset
    vec2 tiledUV = fract(normalizedUV * rampUVTiling) + rampUVOffsetControl;
    
    // 3. 後續正常的 Ramp 計算...
}
```

### 為什麼需要 spriteTiling 參數？

因為在 shader 中無法自動檢測 Sprite 的 Tiled Type：

| 方法 | 問題 |
|------|------|
| 使用 `a_position` | 在某些情況下座標系不穩定，導致重複數百次 |
| 使用 `fract(a_texCoord)` | 會讓每個 tile 都變成 0-1，效果還是重複 |
| 使用 `max(a_texCoord)` | Fragment shader 中每個像素的值不同，無法得到一致的最大值 |
| **用戶指定 `spriteTiling`** | ✅ 簡單可靠，用戶明確知道自己的設置 |

---

## ⚙️ 參數對照表

| 舊參數 (廢棄) | 新參數 | 說明 |
|--------------|--------|------|
| `tilingOffset.xy` (用於 Ramp) | `rampUVTiling` | Ramp 的重複次數 |
| `tilingOffset.zw` (用於 Ramp) | `rampUVOffsetControl` | Ramp 的偏移 |
| (無) | `spriteTiling` | **新增** Sprite 的重複次數 |
| `tilingOffset` (用於主紋理) | `tilingOffset` | 保留，用於主紋理 |

**向後兼容性:**
- ⚠️ 需要手動添加 `spriteTiling` 參數設置
- ⚠️ 需要將原本的 `tilingOffset` (用於 Ramp) 改為 `rampUVTiling` 和 `rampUVOffsetControl`

---

## 🐛 故障排除

### 問題 1: Ramp 效果還是重複很多次

**原因:** 沒有正確設置 `spriteTiling`

**解決方案:**

```typescript
// 檢查您的 Sprite Type
console.log('Sprite Type:', sprite.type);

// 如果是 TILED，查看實際重複次數
// 然後設置 spriteTiling
if (sprite.type === Sprite.Type.TILED) {
    // 假設是 3x3
    material.setProperty('spriteTiling', new Vec2(3, 3));
}
```

### 問題 2: 不知道 Sprite 重複了多少次

**方法 1: 查看 Sprite 屬性**
- 在 Inspector 面板查看 Sprite 組件
- 如果 Type = TILED，查看 Size 和 SpriteFrame 的原始大小
- 計算: tilingCount = Sprite.Size / SpriteFrame.Size

**方法 2: 使用診斷腳本**

```typescript
function getSpriteTeiling(sprite: Sprite): Vec2 {
    if (sprite.type !== Sprite.Type.TILED) {
        return new Vec2(1, 1);
    }
    
    const spriteSize = sprite.node.getComponent(UITransform).contentSize;
    const frameSize = sprite.spriteFrame.originalSize;
    
    return new Vec2(
        Math.round(spriteSize.width / frameSize.width),
        Math.round(spriteSize.height / frameSize.height)
    );
}

// 使用
const tiling = getSpriteTiling(sprite);
console.log('Sprite Tiling:', tiling);
material.setProperty('spriteTiling', tiling);
```

### 問題 3: 需要動態調整

**示例:** Sprite 的 tiling 在運行時改變

```typescript
export class DynamicRampController extends Component {
    @property(Sprite)
    sprite: Sprite = null;
    
    updateRampUV() {
        const material = this.sprite.customMaterial;
        
        // 計算當前的 tiling
        const tiling = this.calculateTiling();
        
        // 更新 shader
        material.setProperty('spriteTiling', tiling);
    }
    
    private calculateTiling(): Vec2 {
        if (this.sprite.type !== Sprite.Type.TILED) {
            return new Vec2(1, 1);
        }
        
        const transform = this.sprite.node.getComponent(UITransform);
        const frameSize = this.sprite.spriteFrame.originalSize;
        
        return new Vec2(
            Math.max(1, Math.round(transform.width / frameSize.width)),
            Math.max(1, Math.round(transform.height / frameSize.height))
        );
    }
}
```

---

## 📝 快速設置檢查清單

使用 RampColorShader 時，請依序檢查：

- [ ] 1. 確認 Sprite Type
  - Simple → `spriteTiling = (1, 1)`
  - Tiled N×M → `spriteTiling = (N, M)`

- [ ] 2. 設置 Ramp UV
  - 想要單一效果 → `rampUVTiling = (1, 1)`
  - 想要重複效果 → `rampUVTiling = (N, M)`

- [ ] 3. 設置偏移（可選）
  - 不偏移 → `rampUVOffsetControl = (0, 0)`
  - 需要偏移 → `rampUVOffsetControl = (X, Y)`

- [ ] 4. 設置顏色和方向
  - `colorStart` 和 `colorEnd`
  - `RAMP_DIRECTION` 宏

- [ ] 5. 測試效果
  - 檢查是否重複正確
  - 檢查偏移是否正確

---

## 🎨 實戰示例

### 老虎機遊戲 - 捲軸光效

```typescript
// 捲軸背景使用 Tiled 3x1 (垂直重複3次)
sprite.type = Sprite.Type.TILED;

// 設置 shader
material.setProperty('spriteTiling', new Vec2(1, 3));  // 注意：只在 Y 方向重複

// 光效不重複，垂直掃過
material.setProperty('rampUVTiling', new Vec2(1, 1));
material.setProperty('rampUVOffsetControl', new Vec2(0, 0));
material.setProperty('colorStart', new Color(255, 255, 255, 0));    // 透明
material.setProperty('colorEnd', new Color(255, 255, 255, 255));    // 白色
// RAMP_DIRECTION = 1 (垂直)
// BLEND_MODE = 1 (Add 加法混合)

// 動畫：讓光效從下往上掃
tween(material)
    .to(2.0, { 'rampUVOffsetControl': new Vec2(0, 1) })
    .start();
```

### UI 按鈕 - 漸層背景

```typescript
// 按鈕背景 Simple Sprite
sprite.type = Sprite.Type.SIMPLE;

// 設置 shader
material.setProperty('spriteTiling', new Vec2(1, 1));

// 對角漸層，從左下到右上
material.setProperty('rampUVTiling', new Vec2(1, 1));
material.setProperty('colorStart', new Color(0, 100, 255, 255));    // 深藍
material.setProperty('colorEnd', new Color(0, 200, 255, 255));      // 淺藍
// RAMP_DIRECTION = 3 (徑向) 配合 rampCenter 調整
material.setProperty('rampCenter', new Vec2(0, 0));  // 從左下角開始
```

---

## 🚀 性能說明

新增的參數和計算對性能影響極小：

| 項目 | 影響 |
|------|------|
| `spriteTiling` 參數 | 1 個 Vec2 uniform |
| `rampUVTiling` 參數 | 1 個 Vec2 uniform |
| `rampUVOffsetControl` 參數 | 1 個 Vec2 uniform |
| `normalizeEffectUV()` 函數 | 1 次除法，可忽略 |

**結論:** 性能影響 < 1%，完全可以放心使用。

---

## 📚 相關文檔

- `RampColorShader-Troubleshooting-Guide.md` - 問題診斷指南
- `RampColorShader-Independent-UV-Implementation.md` - 技術實現詳解

---

**版本:** 2.2 (修正版)  
**更新日期:** 2024-10-16  
**重大變更:** 是 (添加 spriteTiling 參數，分離 tiling 和 offset)  
**向後兼容:** 否 (需要手動設置新參數)
