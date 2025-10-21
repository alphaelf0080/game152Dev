# SpriteUVRepeat Shader - 第二層透明度與 Alpha Channel 相乘更新

## 更新日期
2025年10月21日

## 更新內容

### 第二層透明度計算改進

之前第二層的 `layerOpacity` 參數獨立控制透明度，現在改為與紋理本身的 alpha channel 相乘。

## 改動說明

### 修改前
```glsl
// 只使用 layerOpacity 參數
float effectiveOpacity = layerOpacity / 100.0;
```

### 修改後
```glsl
// layerOpacity 與紋理的 alpha channel 相乘
float effectiveOpacity = (layerOpacity / 100.0) * layerColor.a;
```

## 效果說明

### 透明度計算公式
```
最終透明度 = (layerOpacity / 100) × 紋理 Alpha
```

### 範例說明

#### 範例 1：完全不透明的紋理
```
紋理 Alpha = 1.0 (完全不透明)
layerOpacity = 50

最終透明度 = (50 / 100) × 1.0 = 0.5 (50% 透明)
```

#### 範例 2：半透明紋理
```
紋理 Alpha = 0.5 (50% 透明)
layerOpacity = 100

最終透明度 = (100 / 100) × 0.5 = 0.5 (50% 透明)
```

#### 範例 3：半透明紋理 + layerOpacity
```
紋理 Alpha = 0.5 (50% 透明)
layerOpacity = 50

最終透明度 = (50 / 100) × 0.5 = 0.25 (25% 透明)
```

#### 範例 4：完全透明區域
```
紋理 Alpha = 0.0 (完全透明)
layerOpacity = 100 (任意值)

最終透明度 = (100 / 100) × 0.0 = 0.0 (完全透明)
結果：該區域不會顯示任何內容
```

## 優點

### 1. 保留紋理透明資訊
- 使用帶有 alpha channel 的 PNG 圖片時，透明區域會被正確保留
- 不會將透明區域強制覆蓋到底層

### 2. 更精細的控制
- `layerOpacity`：全域控制第二層的整體透明度
- 紋理 Alpha：像素級別的透明度控制
- 兩者相乘提供最大靈活性

### 3. 符合直覺的行為
- 紋理的透明區域保持透明
- 即使 `layerOpacity = 100`，透明區域也不會顯示

## 應用場景

### 場景 1：漸層遮罩效果
```typescript
// 使用帶有漸層 alpha 的紋理
// 紋理中心 alpha = 1.0，邊緣 alpha = 0.0
const material = this.node.getComponent(Sprite).getMaterial(0);
material.setProperty('layerOpacity', 80.0);

// 結果：
// - 中心區域：80% 不透明
// - 邊緣區域：完全透明
// - 中間漸層：平滑過渡
```

### 場景 2：形狀遮罩
```typescript
// 使用圓形或其他形狀的紋理（PNG with alpha）
// 形狀內部 alpha = 1.0，外部 alpha = 0.0
material.setProperty('layerOpacity', 100.0);

// 結果：
// - 形狀內部：完全顯示第二層
// - 形狀外部：完全透明，顯示底層
```

### 場景 3：粒子效果
```typescript
// 使用帶有柔邊的粒子紋理
material.setProperty('layerOpacity', 60.0);
material.setProperty('layerBlendMode', 2.0); // Screen

// 結果：
// - 粒子中心：明亮且半透明
// - 粒子邊緣：柔和淡出
// - 保留粒子的自然形狀
```

### 場景 4：動態透明度動畫
```typescript
// 使用帶透明度的紋理，動畫控制 layerOpacity
cc.tween(this)
  .to(1.0, {}, {
    onUpdate: (target, ratio) => {
      const opacity = cc.misc.lerp(0, 100, ratio);
      material.setProperty('layerOpacity', opacity);
    }
  })
  .start();

// 結果：
// - 紋理從完全透明淡入
// - 保持紋理本身的 alpha 形狀
// - 不透明區域按比例出現
```

### 場景 5：UI 元素遮罩
```typescript
// 按鈕高亮效果
// 使用圓形漸層紋理（中心亮，邊緣透明）
material.setProperty('layerOpacity', 50.0);
material.setProperty('layerBlendMode', 2.0); // Screen

function onButtonHover() {
  cc.tween(material)
    .to(0.2, {}, {
      onUpdate: (target, ratio) => {
        const opacity = cc.misc.lerp(50, 100, ratio);
        material.setProperty('layerOpacity', opacity);
      }
    })
    .start();
}

// 結果：
// - 懸停時高亮效果增強
// - 邊緣保持柔和過渡
// - 不會出現硬邊
```

## 與其他功能的配合

### 與混合模式配合
```typescript
// Screen 混合模式 + 漸層 alpha 紋理
material.setProperty('layerBlendMode', 2.0); // Screen
material.setProperty('layerOpacity', 80.0);

// 效果：發光效果，邊緣自然淡出
```

### 與鏡像配合
```typescript
// 四象限鏡像 + alpha 紋理
material.setProperty('layerMirrorH', 1.0);
material.setProperty('layerMirrorV', 1.0);
material.setProperty('layerOpacity', 70.0);

// 效果：對稱的漸層效果，保留透明區域
```

### 與色彩調整配合
```typescript
// HSV 調整 + alpha 保留
material.setProperty('layerHue', 120.0);
material.setProperty('layerSaturation', 50.0);
material.setProperty('layerOpacity', 60.0);

// 效果：改變顏色但保留透明度資訊
```

## 技術細節

### Shader 實現
```glsl
// 採樣第二層紋理（包含 RGBA）
vec4 layerColor = texture(layerTexture, uv1);

// 計算有效透明度（兩個透明度相乘）
float effectiveOpacity = (layerOpacity / 100.0) * layerColor.a;

// 使用有效透明度進行混合
vec3 finalRGB = mix(baseColor.rgb, blendedRGB, effectiveOpacity);
```

### 數學說明
- `layerOpacity`：範圍 0-100，轉換為 0.0-1.0
- `layerColor.a`：範圍 0.0-1.0（紋理的 alpha channel）
- `effectiveOpacity`：兩者相乘，範圍 0.0-1.0

### 與之前版本的差異
| 版本 | layerOpacity = 50 | 紋理 Alpha = 0.5 | 最終結果 |
|------|------------------|-----------------|---------|
| **舊版** | 強制 50% 透明 | 被忽略 | 0.5 |
| **新版** | 50% 基礎透明度 | 乘以 0.5 | 0.25 |

## 注意事項

1. **紋理格式**：
   - 使用 PNG 格式以保留 alpha channel
   - JPG 格式沒有 alpha channel，效果等同於 alpha = 1.0

2. **layerOpacity 的作用**：
   - 現在是"乘數"而非"覆蓋值"
   - 設為 100 不代表完全不透明（取決於紋理 alpha）
   - 設為 0 會讓整個第二層完全透明

3. **效能考量**：
   - 沒有額外的效能開銷
   - 只是一個簡單的乘法運算

4. **相容性**：
   - 向下相容
   - 使用不透明紋理（alpha = 1.0）時，行為與之前相同

## 最佳實踐

### 1. 使用帶 Alpha 的紋理
```
推薦：使用柔邊、漸層 alpha 的 PNG 紋理
避免：硬邊的完全不透明/透明二值化紋理
```

### 2. layerOpacity 設定建議
```
- 完全顯示：設為 100
- 柔和疊加：設為 50-70
- 微弱效果：設為 20-30
- 淡入動畫：從 0 漸變到目標值
```

### 3. 測試流程
```
1. 先設 layerOpacity = 100，確認紋理 alpha 效果
2. 調整 layerOpacity 達到期望的整體透明度
3. 結合混合模式測試視覺效果
```

## 總結

這個改動讓第二層的透明度控制更加靈活和直覺：
- ✅ 保留紋理的透明資訊
- ✅ 提供全域透明度控制
- ✅ 適合創建各種漸層和遮罩效果
- ✅ 與其他功能完美配合
- ✅ 沒有額外效能開銷
