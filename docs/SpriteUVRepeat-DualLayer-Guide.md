# SpriteUVRepeat - 雙層紋理 Shader 使用指南

## 概述

更新後的 `SpriteUVRepeat.effect` shader 現在支援第二層獨立紋理，擁有完全獨立的 UV 系統。

## 核心特性

### ✨ 功能
- ✅ **第一層（底層）**：原始紋理，受 `tilingOffset` 影響
- ✅ **第二層（頂層）**：獨立紋理，擁有獨立的 `layerTilingOffset`
- ✅ **獨立 UV 系統**：第二層 UV 完全不受第一層 `tilingOffset` 影響
- ✅ **透明度控制**：獨立的 `layerOpacity` 控制第二層混合
- ✅ **開關控制**：`useLayer` 參數控制是否使用第二層

## 參數說明

### 第一層參數

| 參數 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| mainTexture | Sampler2D | white | 底層紋理 |
| tilingOffset | Vec4 | [1, 1, 0, 0] | 底層 UV 重複和偏移 |

**tilingOffset 格式**：
```
x, y: 重複次數 (1 = 不重複, 2 = 重複 2 次)
z, w: 偏移 (0 = 無偏移)
```

### 第二層參數（獨立）

| 參數 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| layerTexture | Sampler2D | white | 頂層紋理 |
| layerTilingOffset | Vec4 | [1, 1, 0, 0] | 頂層 UV 重複和偏移（獨立） |
| layerOpacity | Float | 1.0 | 頂層透明度 (0~1) |
| useLayer | Float | 0.0 | 是否使用頂層 (0=否, 1=是) |

## 快速設置

### 步驟 1：創建材質

```
Assets → New → Material
命名：DualLayerSprite_mat
Effect：SpriteUVRepeat
```

### 步驟 2：設置底層

```
Inspector 面板：
Main Texture: 選擇你的底層紋理
Tiling Offset: [1, 1, 0, 0]  (不重複)
```

### 步驟 3：設置頂層

```
Inspector 面板：
Use Layer: 1.0 ← 啟用頂層
Layer Texture: 選擇你的頂層紋理
Layer Tiling Offset: [1, 1, 0, 0]  (獨立設置)
Layer Opacity: 1.0
```

### 步驟 4：應用到 Sprite

```
Sprite Component:
Custom Material: DualLayerSprite_mat
```

## 使用場景

### 場景 1：底層重複，頂層不重複

```yaml
底層:
  Texture: grass.png
  Tiling Offset: [3, 3, 0, 0]  ← 重複 3x3
  
頂層:
  Texture: overlay.png
  Tiling Offset: [1, 1, 0, 0]  ← 不重複，完整覆蓋
  Opacity: 0.5
```

**效果**：
- 背景是重複的草地紋理
- 上方有半透明的覆蓋層，不被底層重複影響

### 場景 2：底層和頂層都重複，但重複次數不同

```yaml
底層:
  Texture: pattern1.png
  Tiling Offset: [2, 2, 0, 0]  ← 2x2
  
頂層:
  Texture: pattern2.png
  Tiling Offset: [4, 4, 0, 0]  ← 4x4（獨立重複）
  Opacity: 0.7
```

**效果**：
- 兩層都重複，但頻率不同
- 創造複雜的視覺效果

### 場景 3：帶偏移的獨立效果

```yaml
底層:
  Texture: base.png
  Tiling Offset: [1, 1, 0.25, 0.25]  ← 偏移
  
頂層:
  Texture: detail.png
  Tiling Offset: [2, 2, 0, 0]  ← 完全獨立
  Opacity: 0.6
```

**效果**：
- 底層有偏移
- 頂層重複，完全不受底層偏移影響

### 場景 4：動態效果控制

```typescript
// 使用代碼控制頂層
const material = sprite.getMaterialInstance(0);

// 啟用頂層
material.setProperty('useLayer', 1.0);

// 設置頂層紋理
material.setProperty('layerTexture', newTexture);

// 控制頂層透明度
material.setProperty('layerOpacity', 0.5);

// 控制頂層 UV
material.setProperty('layerTilingOffset', new Vec4(2, 2, 0, 0));
```

## 完整配置示例

### 例子 1：地面 + 細節紋理

```
Node "Ground"
├─ Sprite
│  └─ Custom Material: Ground_mat
│  
Material Inspector:
  Main Texture: grass.png
  Tiling Offset: [4, 4, 0, 0]  底層重複 4x4
  
  Use Layer: 1.0
  Layer Texture: grass_detail.png
  Layer Tiling Offset: [8, 8, 0, 0]  頂層獨立重複 8x8
  Layer Opacity: 0.3
```

### 例子 2：角色 + 光環

```
Node "Character"
├─ Sprite
│  └─ Custom Material: Character_mat
│  
Material Inspector:
  Main Texture: character.png
  Tiling Offset: [1, 1, 0, 0]
  
  Use Layer: 1.0
  Layer Texture: glow.png
  Layer Tiling Offset: [2, 2, 0, 0]
  Layer Opacity: 0.6
```

### 例子 3：背景 + 天氣效果

```
Node "Background"
├─ Sprite
│  └─ Custom Material: BG_mat
│  
Material Inspector:
  Main Texture: sky.png
  Tiling Offset: [1, 1, 0, 0]
  
  Use Layer: 1.0
  Layer Texture: rain_overlay.png
  Layer Tiling Offset: [1, 1, 0, 0]
  Layer Opacity: 0.4
```

## 腳本代碼示例

### 基本用法

```typescript
// 獲取材質實例
const material = sprite.getMaterialInstance(0);

// 啟用第二層
material.setProperty('useLayer', 1.0);

// 設置第二層紋理
material.setProperty('layerTexture', textureAsset.getGFXTexture());

// 設置第二層 UV
material.setProperty('layerTilingOffset', new Vec4(2, 2, 0, 0));

// 設置第二層透明度
material.setProperty('layerOpacity', 0.5);
```

### 動態淡入淡出

```typescript
export class LayerFadeEffect extends Component {
    private material: any;
    private targetOpacity: number = 1.0;
    private currentOpacity: number = 0.0;
    private fadeSpeed: number = 1.0;
    
    onLoad() {
        this.material = this.node.getComponent(Sprite).getMaterialInstance(0);
        this.material.setProperty('useLayer', 1.0);
    }
    
    update(dt: number) {
        if (Math.abs(this.currentOpacity - this.targetOpacity) > 0.01) {
            this.currentOpacity += (this.targetOpacity - this.currentOpacity) * this.fadeSpeed * dt;
            this.material.setProperty('layerOpacity', this.currentOpacity);
        }
    }
    
    fadeIn() {
        this.targetOpacity = 1.0;
    }
    
    fadeOut() {
        this.targetOpacity = 0.0;
    }
}
```

### 動態 UV 滾動

```typescript
export class LayerUVScroll extends Component {
    private material: any;
    private scrollX: number = 0;
    private scrollY: number = 0;
    private scrollSpeed: number = 0.5;
    
    onLoad() {
        this.material = this.node.getComponent(Sprite).getMaterialInstance(0);
        this.material.setProperty('useLayer', 1.0);
    }
    
    update(dt: number) {
        this.scrollX += this.scrollSpeed * dt;
        this.scrollY += this.scrollSpeed * dt;
        
        // 保持在 [0, 1] 範圍內
        this.scrollX = this.scrollX % 1.0;
        this.scrollY = this.scrollY % 1.0;
        
        // 設置獨立的 layer tiling offset
        const offset = new Vec4(2, 2, this.scrollX, this.scrollY);
        this.material.setProperty('layerTilingOffset', offset);
    }
}
```

### 多層效果切換

```typescript
export class MultiLayerEffect extends Component {
    private material: any;
    private currentEffect: number = 0;
    
    private effects = [
        { texture: null, tiling: [1, 1, 0, 0], opacity: 1.0 },
        { texture: null, tiling: [2, 2, 0, 0], opacity: 0.5 },
        { texture: null, tiling: [4, 4, 0, 0], opacity: 0.3 },
    ];
    
    onLoad() {
        this.material = this.node.getComponent(Sprite).getMaterialInstance(0);
    }
    
    switchEffect(effectIndex: number) {
        if (effectIndex >= this.effects.length) return;
        
        const effect = this.effects[effectIndex];
        this.material.setProperty('useLayer', 1.0);
        this.material.setProperty('layerTexture', effect.texture);
        this.material.setProperty('layerTilingOffset', new Vec4(
            effect.tiling[0], effect.tiling[1],
            effect.tiling[2], effect.tiling[3]
        ));
        this.material.setProperty('layerOpacity', effect.opacity);
    }
}
```

## 關鍵點

### ✅ 獨立 UV 系統的工作原理

```glsl
// 底層 UV - 受 tilingOffset 影響
vec2 uv0 = v_uv0 * tilingOffset.xy + tilingOffset.zw;

// 頂層 UV - 使用獨立的 layerTilingOffset
vec2 uv1 = v_uv1 * layerTilingOffset.xy + layerTilingOffset.zw;

// 重要：兩個 UV 計算完全獨立！
```

### ✅ 透明度混合

```glsl
// 使用第二層的 alpha 和 layerOpacity 進行混合
finalColor = mix(baseColor, layerColor, layerColor.a * layerOpacity);
```

## 參數對照表

### Inspector 顯示

```
SpriteUVRepeat Shader:
├─ Alpha Threshold: 0.5
│
├─ Main Texture: (底層)
│  └─ Tiling Offset: [1, 1, 0, 0]
│
└─ Layer Settings: (頂層 - 獨立)
   ├─ Use Layer: 0.0
   ├─ Layer Texture: white
   ├─ Layer Tiling Offset: [1, 1, 0, 0]
   └─ Layer Opacity: 1.0
```

## 常見問題

### Q1：第二層 UV 會受底層 tilingOffset 影響嗎？

**A**：不會。頂層使用完全獨立的 `layerTilingOffset`，完全不受底層影響。

### Q2：如何只顯示第二層？

**A**：
```typescript
material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));  // 底層顯示原始
material.setProperty('layerOpacity', 1.0);  // 頂層完全不透明
```

### Q3：如何禁用第二層？

**A**：
```typescript
material.setProperty('useLayer', 0.0);  // 禁用頂層
```

### Q4：性能如何？

**A**：
- 兩層採樣比單層多一次紋理查詢
- 在現代 GPU 上通常可接受
- 適當使用 `useLayer` 開關優化

## 完整檢查清單

- [ ] Shader 已更新到支援雙層版本
- [ ] 材質已創建
- [ ] 底層紋理已設置
- [ ] 頂層紋理已設置
- [ ] `useLayer` 已設置為 1.0
- [ ] `layerTilingOffset` 已配置
- [ ] `layerOpacity` 已調整
- [ ] 在編輯器中看到預期效果

---

**強大的雙層紋理系統！** 現在你可以創建複雜的視覺效果，同時保持完全的 UV 獨立性。
