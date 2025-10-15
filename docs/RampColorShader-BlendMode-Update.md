# RampColorShader 混合模式更新報告

**更新日期**: 2025-10-15  
**參考資料**: [Cocos Creator Shader 入門 ⑺ —— 圖層混合樣式的實現與 Render Texture](https://juejin.cn/post/7517852192637763636)

---

## 📋 更新內容

### 混合模式 (blendMode) 下拉式選單擴展

將原本的 8 種混合模式擴展為 **16 種**，涵蓋所有常見的 Photoshop 圖層混合效果。

---

## 🎨 支援的混合模式

### 1. **Normal** (正常)
- **效果**: 直接混合，無特殊處理
- **公式**: `mix(base, blend, intensity)`
- **用途**: 基本的顏色混合

### 2. **Multiply** (正片疊底)
- **效果**: 兩色相乘，結果更暗
- **公式**: `color.rgb * dst_color`
- **特性**: 
  - 黑色 × 任何顏色 = 黑色
  - 白色 × 任何顏色 = 原顏色
- **用途**: 陰影、加深效果

### 3. **Screen** (濾色)
- **效果**: 反轉後相乘再反轉，結果更亮
- **公式**: `color.rgb + dst_color.rgb * (1 - color.rgb)`
- **特性**:
  - 白色疊加 = 白色
  - 黑色疊加 = 原顏色
- **用途**: 高光、發光效果

### 4. **Overlay** (疊加)
- **效果**: 結合 Multiply 和 Screen，增強對比
- **公式**: 
  ```glsl
  base < 0.5 ? 2 * base * blend : 1 - 2 * (1 - base) * (1 - blend)
  ```
- **用途**: 增強對比度、質感疊加

### 5. **Darken** (變暗)
- **效果**: 保留較暗的像素
- **公式**: `min(base, blend)`
- **用途**: 暗部保護、選擇性變暗

### 6. **Lighten** (變亮)
- **效果**: 保留較亮的像素
- **公式**: `max(base, blend)`
- **用途**: 高光保護、選擇性提亮

### 7. **Color Dodge** (顏色加深)
- **效果**: 提亮底色，產生鮮豔效果
- **公式**: `base / (1 - blend)`
- **注意**: 使用 EPSILON 防止除零錯誤
- **用途**: 強烈的高光效果

### 8. **Color Burn** (顏色加深)
- **效果**: 加深底色，產生濃重效果
- **公式**: `1 - (1 - base) / blend`
- **注意**: 使用 EPSILON 防止除零錯誤
- **用途**: 強烈的陰影效果

### 9. **Hard Light** (強光)
- **效果**: Overlay 的反向版本
- **公式**: 
  ```glsl
  blend < 0.5 ? 2 * base * blend : 1 - 2 * (1 - base) * (1 - blend)
  ```
- **用途**: 戲劇性光照效果

### 10. **Soft Light** (柔光)
- **效果**: 更柔和的 Overlay 效果（Photoshop 公式）
- **公式**: 
  ```glsl
  // 分段計算，base ≤ 0.25 用三次多項式
  // base > 0.25 用 sqrt(base)
  ```
- **用途**: 柔和的對比增強、人像美化

### 11. **Difference** (差值)
- **效果**: 顏色差異的絕對值
- **公式**: `abs(base - blend)`
- **特性**: 相同顏色 = 黑色
- **用途**: 特殊效果、顏色反轉

### 12. **Exclusion** (排除)
- **效果**: 類似 Difference 但對比較低
- **公式**: `base + blend - 2 * base * blend`
- **用途**: 柔和的反轉效果

### 13. **Hue** (色相)
- **效果**: 使用混合色的色相，保留底色的飽和度和亮度
- **公式**: `setLum(setSat(blend, sat(base)), luminance(base))`
- **用途**: 改變顏色色調但保持明暗

### 14. **Saturation** (飽和度)
- **效果**: 使用混合色的飽和度，保留底色的色相和亮度
- **公式**: `setLum(setSat(base, sat(blend)), luminance(base))`
- **用途**: 調整鮮豔度

### 15. **Color** (顏色)
- **效果**: 使用混合色的色相和飽和度，保留底色的亮度
- **公式**: `setLum(blend, luminance(base))`
- **用途**: 上色、改變顏色但保持明暗關係

### 16. **Luminosity** (亮度)
- **效果**: 使用混合色的亮度，保留底色的色相和飽和度
- **公式**: `setLum(base, luminance(blend))`
- **用途**: 調整明暗但保持顏色

---

## 🔧 技術實現

### 新增輔助函數

```glsl
// 防止除零錯誤
const float EPSILON = 0.00001;

// 獲取亮度值（符合人眼感知）
float luminance(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

// 設置指定顏色的亮度值
vec3 setLum(vec3 c, float l) {
  float d = l - luminance(c);
  return c + vec3(d);
}

// 計算顏色的飽和度
float sat(vec3 c) {
  return max(max(c.r, c.g), c.b) - min(min(c.r, c.g), c.b);
}

// 飽和度調整
vec3 setSat(vec3 c, float s) {
  float l = luminance(c);
  vec3 grey = vec3(l);
  return mix(grey, c, s);
}
```

### 優化的混合計算

- 使用 `step()` 和 `mix()` 替代分支語句，提升 GPU 效率
- 統一使用 `clamp()` 確保顏色值在有效範圍
- 添加 EPSILON 防止除零錯誤

---

## 📊 混合模式對照表

| 索引 | 名稱 | 英文名稱 | 公式類型 | 效果傾向 |
|-----|------|---------|---------|---------|
| 0 | 正常 | Normal | 線性 | 中性 |
| 1 | 正片疊底 | Multiply | 線性 | 變暗 |
| 2 | 濾色 | Screen | 線性 | 變亮 |
| 3 | 疊加 | Overlay | 非線性 | 增強對比 |
| 4 | 變暗 | Darken | 比較 | 變暗 |
| 5 | 變亮 | Lighten | 比較 | 變亮 |
| 6 | 顏色減淡 | Color Dodge | 非線性 | 強烈變亮 |
| 7 | 顏色加深 | Color Burn | 非線性 | 強烈變暗 |
| 8 | 強光 | Hard Light | 非線性 | 強烈對比 |
| 9 | 柔光 | Soft Light | 非線性 | 柔和對比 |
| 10 | 差值 | Difference | 差異 | 反轉 |
| 11 | 排除 | Exclusion | 差異 | 柔和反轉 |
| 12 | 色相 | Hue | HSV | 改變色調 |
| 13 | 飽和度 | Saturation | HSV | 改變鮮豔度 |
| 14 | 顏色 | Color | HSV | 改變色彩 |
| 15 | 亮度 | Luminosity | HSV | 改變明暗 |

---

## 🎯 使用建議

### 常用組合

1. **金屬質感**
   - Multiply (正片疊底) + Ramp 紋理
   - 適合：金幣、金屬物品

2. **發光效果**
   - Screen (濾色) 或 Color Dodge
   - 適合：魔法特效、能量光環

3. **陰影疊加**
   - Multiply (正片疊底)
   - 適合：陰影、深度表現

4. **高光提亮**
   - Overlay (疊加) 或 Soft Light (柔光)
   - 適合：質感增強、細節突出

5. **顏色變換**
   - Hue (色相) 或 Color (顏色)
   - 適合：換色系統、動態著色

### 參數調整技巧

```
Ramp Intensity (Ramp 強度):
  0.0 = 完全不混合（原始顏色）
  0.5 = 50% 混合
  1.0 = 完全混合
  2.0 = 強烈混合（可能過度）

建議值：
  - 柔和效果：0.3 - 0.7
  - 正常效果：0.7 - 1.0
  - 強烈效果：1.0 - 1.5
```

---

## ⚠️ 注意事項

1. **性能考慮**
   - 複雜的混合模式（如 Soft Light、Hue）計算量較大
   - 建議在移動平台上謹慎使用複雜模式
   - 可以根據設備性能動態調整

2. **顏色空間**
   - Hue、Saturation、Color、Luminosity 模式使用 HSV 顏色空間
   - 可能在某些極端顏色下產生意外效果

3. **除零保護**
   - Color Dodge 和 Color Burn 已加入 EPSILON 保護
   - 避免在極端情況下出現 NaN 或 Infinity

---

## 📚 參考資料

### 原始文章
- **標題**: Cocos Creator Shader 入門 ⑺ —— 圖層混合樣式的實現與 Render Texture
- **作者**: VaJoy
- **連結**: https://juejin.cn/post/7517852192637763636

### Photoshop 混合模式文檔
- Adobe 官方文檔關於混合模式的數學公式
- W3C CSS 混合模式規範

### 相關檔案
- `RampColorShader.effect` - 主要的 Shader 檔案
- `RampColorShader-Guide.md` - 使用指南

---

## 🔄 更新歷史

| 日期 | 版本 | 更新內容 |
|------|------|---------|
| 2025-10-15 | v2.0 | 新增 16 種混合模式，優化計算效率 |
| 2025-10-14 | v1.0 | 初始版本，8 種基本混合模式 |

---

## ✨ 效果預覽建議

在 Cocos Creator 編輯器中測試：

1. 創建一個 Sprite 節點
2. 應用 RampColorShader 材質
3. 設定不同的混合模式
4. 調整 Ramp 強度觀察效果
5. 嘗試不同的 Ramp 方向和顏色組合

**推薦測試組合**:
- 水平 Ramp + Multiply = 漸變陰影
- 圓形 Ramp + Screen = 光暈效果
- 徑向 Ramp + Hue = 彩虹效果
- 垂直 Ramp + Overlay = 立體感

---

**更新者**: GitHub Copilot  
**審核**: 待團隊審核  
**狀態**: ✅ 完成
