# MultiLayerSprite Shader - 多層精靈 Shader 完整指南

## 更新日期
2025年10月22日

## 概述

`MultiLayerSprite.effect` 是一個高度靈活的多層 Sprite Shader，支援 **2-8 層**的組合，每層都具有完全獨立的 UV 控制、色彩調整和混合模式。

### 核心特性

- ✅ **預定義層數**：支援 2、3、4、5、6、7、8 層選擇
- ✅ **獨立 UV 系統**：每層可獨立控制 Scale、Repeat、Offset、WrapMode
- ✅ **色彩調整**：每層獨立的 Hue、Saturation、Value、Contrast
- ✅ **混合模式**：所有層（除底層外）支援 12 種混合模式
- ✅ **邊界處理**：所有層都支援 Clamp 邊界透明化、Repeat 無縫重複、Mirror 鏡像模式
- ✅ **透明度控制**：每層都有獨立的 Opacity（0-100%）與 alpha 相乘

## 快速開始

### 1. 在編輯器中選擇層數

```properties
layerCount: 4  # 選擇使用 4 層 (2-8 之間)
```

### 2. 配置每層參數

```typescript
const material = sprite.getMaterial(0);

// 第 0 層（底層）
material.setProperty('layer0Scale', cc.v2(1.0, 1.0));
material.setProperty('layer0Opacity', 100.0);

// 第 1 層
material.setProperty('layer1Scale', cc.v2(2.0, 2.0));
material.setProperty('layer1BlendMode', 2.0); // Screen 混合
material.setProperty('layer1Opacity', 50.0);

// 第 2 層
material.setProperty('layer2Scale', cc.v2(1.5, 1.5));
material.setProperty('layer2BlendMode', 3.0); // Overlay 混合
```

## 參數完整列表

### Layer Count（層數控制）

| 參數 | 值範圍 | 說明 |
|------|--------|------|
| `layerCount` | 2.0 - 8.0 | 選擇使用的層數 |

### 每層參數結構（以 Layer N 為例）

#### UV 控制參數

| 參數 | 預設值 | 範圍 | 說明 |
|------|--------|------|------|
| `layerN_Scale` | [1.0, 1.0] | 0.1-10.0 | UV 縮放（中心基準） |
| `layerN_Repeat` | [1.0, 1.0] | 0.5-10.0 | 紋理重複次數 |
| `layerN_Offset` | [0.0, 0.0] | -2.0~2.0 | UV 位移 |
| `layerN_WrapMode` | 0.0 | 0/1/2 | **0**=Clamp **1**=Repeat **2**=Mirror |

#### 色彩和透明度參數

| 參數 | 預設值 | 範圍 | 說明 |
|------|--------|------|------|
| `layerN_Opacity` | 100.0 | 0-100 | 不透明度（%） |
| `layerN_Hue` | 0.0 | -180~180 | 色相調整（度數） |
| `layerN_Saturation` | 0.0 | -100~100 | 飽和度調整 |
| `layerN_Value` | 0.0 | -100~100 | 明度調整 |
| `layerN_Contrast` | 0.0 | -50~100 | 對比度調整 |

#### 混合模式參數（Layer 1-7 專用）

| 參數 | 預設值 | 範圍 | 說明 |
|------|--------|------|------|
| `layerN_BlendMode` | 0.0 | 0-11 | 混合模式選擇 |
| `layerN_BlendIntensity` | 1.0 | 0-1 | 混合強度 |

### 混合模式映射表

| 值 | 名稱 | 效果 |
|----|------|------|
| 0 | Normal | 正常混合 |
| 1 | Multiply | 相乘（變暗） |
| 2 | Screen | 屏幕（變亮） |
| 3 | Overlay | 疊加 |
| 4 | Darken | 變暗 |
| 5 | Lighten | 變亮 |
| 6 | Color Dodge | 顏色減淡 |
| 7 | Color Burn | 顏色加深 |
| 8 | Hard Light | 強光 |
| 9 | Soft Light | 柔光 |
| 10 | Difference | 差值 |
| 11 | Exclusion | 排除 |

## 實用代碼範例

### 範例 1：2 層基礎設置

```typescript
// 使用 2 層
material.setProperty('layerCount', 2.0);

// 底層：主要紋理
material.setProperty('layer0Scale', cc.v2(1.0, 1.0));
material.setProperty('layer0Opacity', 100.0);

// 第 1 層：光暈效果
material.setProperty('layer1Scale', cc.v2(1.2, 1.2));
material.setProperty('layer1BlendMode', 2.0); // Screen
material.setProperty('layer1Opacity', 60.0);
```

### 範例 2：4 層複雜合成

```typescript
material.setProperty('layerCount', 4.0);

// Layer 0: 基礎層
material.setProperty('layer0Scale', cc.v2(1.0, 1.0));

// Layer 1: 細節層（Screen 混合）
material.setProperty('layer1Scale', cc.v2(1.5, 1.5));
material.setProperty('layer1BlendMode', 2.0);
material.setProperty('layer1BlendIntensity', 0.8);
material.setProperty('layer1Opacity', 70.0);

// Layer 2: 紋理層（Multiply 混合）
material.setProperty('layer2Scale', cc.v2(2.0, 2.0));
material.setProperty('layer2Repeat', cc.v2(3.0, 3.0));
material.setProperty('layer2BlendMode', 1.0);
material.setProperty('layer2Opacity', 40.0);

// Layer 3: 特效層（Overlay 混合）
material.setProperty('layer3Scale', cc.v2(1.1, 1.1));
material.setProperty('layer3BlendMode', 3.0);
material.setProperty('layer3Opacity', 50.0);
```

### 範例 3：動畫滾動效果（8 層）

```typescript
material.setProperty('layerCount', 8.0);
let scrollOffset = 0;

this.schedule(() => {
  scrollOffset += 0.01;
  
  // 每層以不同速度滾動
  for (let i = 0; i < 8; i++) {
    const speed = 1.0 + (i * 0.2); // 越上面的層越快
    material.setProperty(`layer${i}Offset`, cc.v2(scrollOffset * speed, 0.0));
    material.setProperty(`layer${i}WrapMode`, 1.0); // Repeat 模式
  }
}, 0.016); // 60 FPS
```

### 範例 4：色彩漸變動畫（多層）

```typescript
material.setProperty('layerCount', 3.0);
let hueShift = 0;

this.schedule(() => {
  hueShift = (hueShift + 2.0) % 360.0;
  
  // 給每層不同的色相偏移
  material.setProperty('layer0Hue', hueShift);
  material.setProperty('layer1Hue', hueShift + 60.0); // +60 度
  material.setProperty('layer2Hue', hueShift + 120.0); // +120 度
}, 0.05);
```

### 範例 5：動態 Wrap Mode 切換

```typescript
// 使用 Repeat 創建無縫背景
for (let i = 0; i < 5; i++) {
  material.setProperty(`layer${i}WrapMode`, 1.0); // Repeat
  material.setProperty(`layer${i}Repeat`, cc.v2(2.0 + i * 0.5, 2.0));
}

// 使用 Mirror 創建對稱效果
material.setProperty('layer5WrapMode', 2.0); // Mirror
material.setProperty('layer5Scale', cc.v2(0.8, 0.8));
```

### 範例 6：UI 按鈕多層效果

```typescript
// 使用 3 層創建豐富的按鈕效果
material.setProperty('layerCount', 3.0);

// 底層：按鈕主體
material.setProperty('layer0Opacity', 100.0);

// 第 1 層：高亮邊框（Lighten）
material.setProperty('layer1Scale', cc.v2(1.1, 1.1));
material.setProperty('layer1BlendMode', 5.0); // Lighten
material.setProperty('layer1Opacity', 40.0);

// 第 2 層：發光效果（Screen）
material.setProperty('layer2Scale', cc.v2(1.2, 1.2));
material.setProperty('layer2BlendMode', 2.0); // Screen
material.setProperty('layer2Opacity', 30.0);
material.setProperty('layer2Hue', 120.0); // 綠色光暈
```

## 應用場景

### 1. 角色變身系統

```
Layer 0: 基礎身體
Layer 1: 衣著層
Layer 2: 飾品層
Layer 3: 特效光暈
```

### 2. 複雜背景合成

```
Layer 0: 遠景
Layer 1: 中景（慢速滾動）
Layer 2: 近景（快速滾動）
Layer 3: 天氣效果
Layer 4: 光線效果
```

### 3. 卡牌系統

```
Layer 0: 卡牌背景
Layer 1: 插圖
Layer 2: 邊框
Layer 3: 稀有度效果
Layer 4: 文字背景
```

### 4. 遊戲 UI 視覺豐富化

```
Layer 0: UI 框架
Layer 1: 細節紋理
Layer 2: 光暈效果
Layer 3: 動畫層
```

### 5. 特殊效果合成

```
Layer 0: 主要元素
Layer 1-3: 不同顏色的光線層（Screen 混合）
Layer 4-5: 紋理細節（Overlay 混合）
Layer 6-7: 特效層（Multiply/Screen 混合）
```

## 性能優化指南

### ✅ 性能影響

| 層數 | 預計開銷 | 是否推薦 |
|------|---------|---------|
| 2-3 層 | ~2-3ms | ✅ 強烈推薦 |
| 4-5 層 | ~3-5ms | ✅ 推薦 |
| 6-7 層 | ~5-8ms | ⚠️ 謹慎使用 |
| 8 層 | ~8-12ms | ⚠️ 需謹慎測試 |

### 💡 優化建議

1. **合理選擇層數**
   - 不要為了豐富效果而無限增加層數
   - 根據實際視覺需求選擇層數

2. **避免過度的色彩調整**
   - RGB ↔ HSV 轉換有開銷
   - 能用紋理解決就不用 HSV

3. **選擇合適的 Wrap Mode**
   - Clamp 和 Repeat 計算快
   - Mirror 計算量稍大

4. **動畫層數控制**
   - 避免每幀都改變所有層參數
   - 只更新變化的層

5. **混合模式優化**
   - 複雜混合模式有額外開銷
   - Normal 和 Multiply 相對快速

## 常見問題

### Q: 可以支援超過 8 層嗎？

A: 當前設計支援 2-8 層。如需更多層，建議：
1. 直接修改 Shader 添加更多層定義
2. 考慮使用層級系統（多個 Sprite 疊加）

### Q: 層與層之間有混合邊界嗎？

A: 沒有。透明度使用 `mix()` 函數平滑混合，所有層都無縫融合。

### Q: 如何實現分層動畫？

A: 使用 `schedule()` 或 `cc.tween()` 動態更改參數：

```typescript
cc.tween(material)
  .to(2.0, { layer1Hue: 180 }, {
    onUpdate: (target, ratio) => {
      material.setProperty('layer1Hue', cc.misc.lerp(0, 180, ratio));
    }
  })
  .start();
```

### Q: 第 0 層為什麼沒有混合模式？

A: 第 0 層是底層，所有其他層都混合到它上面。為底層設置混合模式會影響最終效果，因此不提供。

### Q: 邊界透明化對性能有影響嗎？

A: 幾乎沒有。只需多一個浮點比較和乘法操作。

### Q: 可以在運行時改變層數嗎？

A: 可以。只需更改 `layerCount` 參數：

```typescript
material.setProperty('layerCount', 4.0); // 切換到 4 層
```

## 故障排除

### 問題：邊界出現奇怪的顏色

**解決**：
- 檢查 Wrap Mode：Clamp 應該顯示透明
- 驗證邊界紋理是否正確

### 問題：性能下降明顯

**解決**：
- 減少層數
- 簡化色彩調整
- 使用更簡單的混合模式

### 問題：層之間看不到邊界

**解決**：
- 增加 Opacity 對比度
- 使用不同的 Hue 值區分層
- 調整混合模式

## 最佳實踐

### ✅ Do（應該做）

1. ✅ 根據視覺需求選擇合適層數
2. ✅ 使用 Repeat 創建無縫背景
3. ✅ 為動畫層使用 Offset 而非 Scale
4. ✅ 在各層使用不同的 Repeat 值創建視差效果
5. ✅ 使用 BlendIntensity 微調混合強度

### ❌ Don't（不應該做）

1. ❌ 無故使用 8 層（除非真的需要）
2. ❌ 在每幀都改變所有 12+ 個參數
3. ❌ 混淆 Wrap Mode 的含義（0=Clamp 1=Repeat 2=Mirror）
4. ❌ 為底層設置混合模式
5. ❌ 在移動設備上過度使用複雜混合模式

## TypeScript 輔助代碼

```typescript
// 層配置接口
interface LayerConfig {
  scale: cc.Vec2;
  repeat: cc.Vec2;
  offset: cc.Vec2;
  wrapMode: number; // 0=Clamp, 1=Repeat, 2=Mirror
  opacity: number; // 0-100
  hue: number; // -180~180
  saturation: number; // -100~100
  value: number; // -100~100
  contrast: number; // -50~100
  blendMode?: number; // 0-11 (Layer 1-7)
  blendIntensity?: number; // 0-1 (Layer 1-7)
}

// 應用層配置的輔助函數
function applyLayerConfig(material: cc.Material, layerIndex: number, config: LayerConfig) {
  const prefix = `layer${layerIndex}`;
  material.setProperty(`${prefix}Scale`, config.scale);
  material.setProperty(`${prefix}Repeat`, config.repeat);
  material.setProperty(`${prefix}Offset`, config.offset);
  material.setProperty(`${prefix}WrapMode`, config.wrapMode);
  material.setProperty(`${prefix}Opacity`, config.opacity);
  material.setProperty(`${prefix}Hue`, config.hue);
  material.setProperty(`${prefix}Saturation`, config.saturation);
  material.setProperty(`${prefix}Value`, config.value);
  material.setProperty(`${prefix}Contrast`, config.contrast);
  
  if (layerIndex > 0) {
    material.setProperty(`${prefix}BlendMode`, config.blendMode || 0);
    material.setProperty(`${prefix}BlendIntensity`, config.blendIntensity || 1.0);
  }
}
```

## 總結

MultiLayerSprite Shader 提供了一個強大且靈活的多層 Sprite 解決方案，支援 2-8 層的任意組合。通過合理使用層、UV 控制、色彩調整和混合模式，可以創建出視覺效果非常豐富的遊戲資源。

**記住：性能和視覺效果的平衡是關鍵。選擇最少的層數來實現你的設計目標！** 🎨
