# RampColorShader 混合模式快速參考

## 🎨 16 種混合模式速查表

### 基礎混合 (Basic Blends)

| 模式 | 效果 | 適用場景 |
|------|------|---------|
| **Normal** | 正常混合 | 基本顏色疊加 |
| **Multiply** | 正片疊底（變暗） | 陰影、深度 |
| **Screen** | 濾色（變亮） | 高光、發光 |

### 對比增強 (Contrast)

| 模式 | 效果 | 適用場景 |
|------|------|---------|
| **Overlay** | 疊加 | 質感增強 |
| **Hard Light** | 強光 | 戲劇性光照 |
| **Soft Light** | 柔光 | 柔和對比 |

### 明暗控制 (Lightness)

| 模式 | 效果 | 適用場景 |
|------|------|---------|
| **Darken** | 變暗 | 暗部保護 |
| **Lighten** | 變亮 | 高光保護 |
| **Color Dodge** | 顏色減淡 | 強烈高光 |
| **Color Burn** | 顏色加深 | 強烈陰影 |

### 顏色差異 (Difference)

| 模式 | 效果 | 適用場景 |
|------|------|---------|
| **Difference** | 差值 | 反轉效果 |
| **Exclusion** | 排除 | 柔和反轉 |

### HSV 混合 (Color Adjustments)

| 模式 | 效果 | 適用場景 |
|------|------|---------|
| **Hue** | 色相替換 | 改變色調 |
| **Saturation** | 飽和度替換 | 調整鮮豔度 |
| **Color** | 顏色替換 | 上色系統 |
| **Luminosity** | 亮度替換 | 明暗調整 |

---

## 💡 實用組合推薦

### 遊戲 UI 效果

```
金屬按鈕:
  - Multiply + 水平 Ramp
  - 強度: 0.8

發光邊框:
  - Screen + 圓形 Ramp
  - 強度: 1.2

玻璃質感:
  - Overlay + 垂直 Ramp
  - 強度: 0.6
```

### 角色著色

```
換裝系統:
  - Hue + 水平 Ramp
  - 強度: 1.0

受傷效果:
  - Multiply + 紅色 Ramp
  - 強度: 0.5

冰凍效果:
  - Color + 藍白 Ramp
  - 強度: 0.7
```

### 特效動畫

```
能量光環:
  - Color Dodge + 圓形 Ramp
  - 強度: 1.5
  - 配合動畫調整中心點

火焰漸變:
  - Screen + 徑向 Ramp
  - 顏色: 黃→橙→紅
  - 強度: 1.0
```

---

## 🔧 編輯器設定建議

### 基礎設定
```
Ramp 方向: 水平 (最常用)
Ramp 中心點: (0.5, 0.5)
UV 縮放: (1.0, 1.0)
UV 偏移: (0.0, 0.0)
```

### 顏色設定
```
起始顏色: 黑色 (0, 0, 0, 1)
結束顏色: 白色 (1, 1, 1, 1)
或使用 Ramp 紋理
```

### 效果控制
```
亮度: 0.0 (不調整)
對比度: 1.0 (正常)
飽和度: 1.0 (正常)
Ramp 強度: 0.8 - 1.0 (推薦)
```

---

## 🎯 混合模式選擇流程圖

```
需要什麼效果？
    ↓
    ├─ 變暗？
    │   ├─ 柔和 → Multiply
    │   └─ 強烈 → Color Burn
    │
    ├─ 變亮？
    │   ├─ 柔和 → Screen
    │   └─ 強烈 → Color Dodge
    │
    ├─ 增強對比？
    │   ├─ 戲劇性 → Hard Light
    │   └─ 柔和 → Soft Light / Overlay
    │
    ├─ 改變顏色？
    │   ├─ 只改色調 → Hue
    │   ├─ 只改鮮豔度 → Saturation
    │   ├─ 改色彩保留亮度 → Color
    │   └─ 改亮度保留顏色 → Luminosity
    │
    └─ 特殊效果？
        ├─ 反轉 → Difference
        └─ 柔和反轉 → Exclusion
```

---

## ⚡ 性能提示

### 高性能模式 (移動設備)
- **推薦**: Normal, Multiply, Screen, Darken, Lighten
- **原因**: 計算簡單，GPU 友好

### 中等性能模式
- **推薦**: Overlay, Hard Light, Difference, Exclusion
- **原因**: 中等複雜度

### 高質量模式 (PC)
- **可用**: Soft Light, Color Dodge, Color Burn
- **可用**: Hue, Saturation, Color, Luminosity
- **原因**: 複雜計算，效果更精細

---

## 🐛 常見問題

### Q: 顏色看起來太強烈？
**A**: 降低 `Ramp 強度` 到 0.5 - 0.7

### Q: 沒有看到效果？
**A**: 檢查：
1. Ramp 強度是否 > 0
2. 起始和結束顏色是否不同
3. UV 縮放是否正確

### Q: Color Dodge/Burn 出現異常亮點？
**A**: 這是正常的，這兩種模式本身就會產生極端效果。可以：
1. 降低強度
2. 調整 Ramp 範圍
3. 使用其他混合模式

### Q: Hue/Saturation 模式效果不明顯？
**A**: 這些模式在灰階圖像上效果有限。確保底圖有足夠的顏色信息。

---

## 📖 公式參考

### Multiply (正片疊底)
```glsl
result = base * blend
```

### Screen (濾色)
```glsl
result = 1 - (1 - base) * (1 - blend)
// 或等效: base + blend - base * blend
```

### Overlay (疊加)
```glsl
if (base < 0.5)
    result = 2 * base * blend
else
    result = 1 - 2 * (1 - base) * (1 - blend)
```

### Soft Light (柔光 - Photoshop 公式)
```glsl
if (blend < 0.5)
    A = base - (1 - 2*blend) * base * (1 - base)
else
    G = (base <= 0.25) ? poly(base) : sqrt(base)
    B = base + (2*blend - 1) * (G - base)
    
result = (blend < 0.5) ? A : B
```

---

## 🎨 測試案例

### 案例 1: 金幣效果
```
混合模式: Multiply
Ramp 方向: 水平
起始顏色: RGB(0.6, 0.4, 0.1) - 深金色
結束顏色: RGB(1.0, 0.9, 0.3) - 亮金色
Ramp 強度: 0.9
對比度: 1.2
```

### 案例 2: 魔法光環
```
混合模式: Screen
Ramp 方向: 圓形
Ramp 中心: (0.5, 0.5)
起始顏色: RGB(0.3, 0.5, 1.0) - 藍色
結束顏色: RGB(1.0, 1.0, 1.0) - 白色
Ramp 強度: 1.3
反轉 Ramp: 是
```

### 案例 3: 火焰效果
```
混合模式: Color Dodge
Ramp 方向: 垂直
起始顏色: RGB(1.0, 0.0, 0.0) - 紅色
結束顏色: RGB(1.0, 1.0, 0.0) - 黃色
Ramp 強度: 1.0
亮度: +0.2
```

---

**最後更新**: 2025-10-15  
**版本**: v2.0  
**相關文檔**: RampColorShader-BlendMode-Update.md
