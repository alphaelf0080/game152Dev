# SpriteUVRepeat Shader - 第二層獨立 UV 系統

## 更新日期
2025年10月21日

## 更新內容

### 第二層 UV 完全獨立

第二層 UV 現在完全獨立於第一層和 Sprite 的九宮格切割，使用頂點位置生成 UV 坐標而非紋理坐標。

## 改動說明

### 修改前
```glsl
// Vertex Shader
v_uv1 = a_texCoord;  // 使用紋理坐標（受九宮格影響）
```

### 修改後
```glsl
// Vertex Shader
v_uv1 = a_position.xy * 0.01 + 0.5;  // 使用頂點位置（完全獨立）
```

## 技術原理

### UV 坐標來源比較

#### 第一層（底層）
- **UV 來源**：`a_texCoord`（紋理坐標）
- **特性**：
  - 受 Sprite 九宮格切割影響
  - 範圍始終是 0-1
  - 正確映射到紋理

#### 第二層（頂層）- 舊版
- **UV 來源**：`a_texCoord`（紋理坐標）
- **問題**：
  - 受九宮格影響，導致拉伸變形
  - 與第一層同步，無法獨立控制
  - 九宮格邊緣區域會重複

#### 第二層（頂層）- 新版
- **UV 來源**：`a_position.xy`（頂點位置）
- **優點**：
  - 完全不受九宮格影響
  - 基於幾何位置，更穩定
  - 可獨立縮放和平移
  - 適合做背景紋理和特效

### 頂點位置轉 UV 的計算

```glsl
// Sprite 的頂點坐標通常是：
// 中心為原點 (0, 0)
// 範圍：[-width/2, width/2] × [-height/2, height/2]

// 轉換為 0-1 範圍的 UV：
v_uv1 = a_position.xy * 0.01 + 0.5;

// 0.01 是縮放因子（根據典型 Sprite 尺寸調整）
// + 0.5 將中心對齊到 UV 空間的 (0.5, 0.5)
```

## 實際效果

### 使用九宮格 Sprite 時

#### 情境：使用九宮格切割的按鈕或面板

**第一層（底層）**：
```
九宮格切割後：
┌─────┬───────────┬─────┐
│ 角  │   上邊    │ 角  │  ← 正確映射紋理
├─────┼───────────┼─────┤
│ 左邊│   中間    │ 右邊│  ← 中間區域拉伸
├─────┼───────────┼─────┤
│ 角  │   下邊    │ 角  │
└─────┴───────────┴─────┘
```

**第二層 - 舊版（使用 a_texCoord）**：
```
問題：
┌─────┬───────────┬─────┐
│ 正常│   拉伸    │ 正常│  ← 中間區域紋理變形
├─────┼───────────┼─────┤
│拉伸 │   變形    │ 拉伸│  ← 跟隨九宮格拉伸
├─────┼───────────┼─────┤
│ 正常│   拉伸    │ 正常│
└─────┴───────────┴─────┘
```

**第二層 - 新版（使用 a_position）**：
```
改善：
┌─────┬───────────┬─────┐
│     │           │     │
│     │           │     │  ← 紋理均勻分布
│     │  完整映射  │     │  ← 不受九宮格影響
│     │           │     │
│     │           │     │
└─────┴───────────┴─────┘
```

## 使用範例

### 範例 1：按鈕背景紋理

```typescript
// 九宮格按鈕 + 第二層漸層效果
const material = this.button.getComponent(Sprite).getMaterial(0);

// 第一層：按鈕紋理（受九宮格影響，正常）
// 第二層：漸層或光澤效果（不受九宮格影響）

material.setProperty('layerTilingOffset', cc.v4(1.0, 1.0, 0.0, 0.0));
material.setProperty('layerOpacity', 30.0);
material.setProperty('layerBlendMode', 2.0); // Screen

// 結果：按鈕可以任意拉伸，第二層效果始終均勻分布
```

### 範例 2：面板裝飾紋理

```typescript
// 九宮格面板 + 第二層裝飾圖案
const material = this.panel.getComponent(Sprite).getMaterial(0);

// 第一層：面板邊框和背景（九宮格拉伸）
// 第二層：重複的裝飾圖案（獨立平鋪）

material.setProperty('layerTilingOffset', cc.v4(3.0, 3.0, 0.0, 0.0));
material.setProperty('layerOpacity', 20.0);
material.setProperty('layerBlendMode', 1.0); // Multiply

// 結果：裝飾圖案均勻重複，不會因九宮格而變形
```

### 範例 3：對話框背景動畫

```typescript
// 九宮格對話框 + 第二層動態紋理
const material = this.dialog.getComponent(Sprite).getMaterial(0);

// 第二層 UV 動畫（滾動效果）
let offset = 0;
this.schedule(() => {
  offset += 0.01;
  material.setProperty('layerTilingOffset', 
    cc.v4(2.0, 2.0, offset, offset)
  );
}, 0.016);

// 結果：紋理平滑滾動，不受對話框尺寸和九宮格影響
```

### 範例 4：UI 元素高亮

```typescript
// 任意尺寸的 UI 元素 + 高亮效果
const material = this.uiElement.getComponent(Sprite).getMaterial(0);

// 第二層：放射狀漸層高亮
material.setProperty('layerMirrorH', 1.0);
material.setProperty('layerMirrorV', 1.0);
material.setProperty('layerOpacity', 40.0);
material.setProperty('layerBlendMode', 2.0); // Screen

// 結果：高亮效果始終居中，不受元素拉伸影響
```

### 範例 5：進度條填充效果

```typescript
// 九宮格進度條 + 第二層紋理
const material = this.progressBar.getComponent(Sprite).getMaterial(0);

// 第二層：斜線紋理（視覺豐富度）
material.setProperty('layerTilingOffset', cc.v4(5.0, 2.0, 0.0, 0.0));
material.setProperty('layerOpacity', 30.0);

// 動畫：進度變化時
this.progressBar.node.width = progress * maxWidth;

// 結果：進度條寬度改變，第二層紋理不會拉伸變形
```

## 調整建議

### layerTilingOffset 的使用

由於第二層 UV 基於頂點位置生成，`layerTilingOffset` 的效果會與之前不同：

#### Tiling (X, Y) - 縮放
```typescript
// 較小的值 = 放大紋理（看到更少內容）
material.setProperty('layerTilingOffset', cc.v4(0.5, 0.5, 0.0, 0.0));

// 1.0 = 基礎大小
material.setProperty('layerTilingOffset', cc.v4(1.0, 1.0, 0.0, 0.0));

// 較大的值 = 縮小紋理（重複更多次）
material.setProperty('layerTilingOffset', cc.v4(3.0, 3.0, 0.0, 0.0));
```

#### Offset (Z, W) - 偏移
```typescript
// 水平和垂直偏移
material.setProperty('layerTilingOffset', cc.v4(1.0, 1.0, 0.5, 0.5));

// 動畫滾動
let offset = 0;
this.schedule(() => {
  offset += 0.01;
  material.setProperty('layerTilingOffset', 
    cc.v4(2.0, 2.0, offset, 0)
  );
}, 0.016);
```

### 初始設定建議

根據不同的 Sprite 尺寸，可能需要調整 tiling 值：

```typescript
// 小型 UI 元素（< 100px）
layerTilingOffset: [0.5, 0.5, 0, 0]

// 中型 UI 元素（100-300px）
layerTilingOffset: [1.0, 1.0, 0, 0]

// 大型 UI 元素（> 300px）
layerTilingOffset: [2.0, 2.0, 0, 0]
```

## 優點總結

### 1. 不受九宮格影響
- ✅ 第二層紋理不會因九宮格拉伸而變形
- ✅ 適合做背景效果和裝飾圖案
- ✅ UI 元素可以任意縮放

### 2. 完全獨立控制
- ✅ 第二層 UV 與第一層完全分離
- ✅ 可以獨立設定 tiling 和 offset
- ✅ 支援獨立的鏡像和縮放

### 3. 更好的視覺效果
- ✅ 紋理分布更均勻
- ✅ 動畫效果更自然
- ✅ 適合做全局效果

### 4. 彈性更高
- ✅ 適用於各種尺寸的 Sprite
- ✅ 支援動態縮放和拉伸
- ✅ 不需要調整紋理本身

## 注意事項

### 1. Tiling 值可能需要調整
由於 UV 生成方式改變，之前的 `layerTilingOffset` 設定可能需要重新調整。

### 2. 頂點位置的範圍
Sprite 的頂點位置範圍取決於其尺寸，公式中的 `0.01` 是基於典型尺寸的估算值。

### 3. 不同尺寸的一致性
如果需要在不同尺寸的 Sprite 上保持相同的視覺效果，需要根據尺寸調整 tiling 值。

### 4. 效能影響
- ✅ 幾乎沒有額外的效能開銷
- ✅ 只在 vertex shader 中多一次計算

## 技術細節

### Vertex Shader 改動
```glsl
// 添加世界位置輸出（供未來擴展使用）
out vec3 v_worldPos;

// 在 vert() 函數中
v_worldPos = pos.xyz;  // 儲存世界空間位置

// 生成獨立 UV
v_uv1 = a_position.xy * 0.01 + 0.5;
```

### Fragment Shader 改動
```glsl
// 添加世界位置輸入
in vec3 v_worldPos;

// UV 處理保持不變，但基礎 UV 來源已改變
vec2 uv1 = v_uv1 * layerTilingOffset.xy + layerTilingOffset.zw;
```

## 相容性

- ✅ Cocos Creator 3.8+
- ✅ 向下相容現有功能
- ✅ 不影響第一層渲染
- ✅ 所有混合模式正常工作

## 最佳實踐

1. **測試不同尺寸**：在最小和最大尺寸下測試效果
2. **調整 Tiling**：根據實際視覺效果微調 tiling 值
3. **使用漸層 Alpha**：配合透明度漸層可創造更自然的效果
4. **結合鏡像**：使用鏡像功能可減少紋理重複感
5. **動畫平滑**：使用補間動畫平滑過渡 offset 值

## 總結

這個改動讓第二層 UV 系統真正獨立：
- ✅ 不受第一層影響
- ✅ 不受九宮格切割影響
- ✅ 基於幾何位置，更穩定
- ✅ 適合各種 UI 特效和背景效果
- ✅ 提供更大的創作彈性
