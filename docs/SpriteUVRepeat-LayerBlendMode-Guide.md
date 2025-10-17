# SpriteUVRepeat - 第二層 Blend Mode 功能指南

## 更新內容

為 `SpriteUVRepeat.effect` shader 的第二層增加了 **16 種混合模式** 和 **混合強度控制**，參考自 `RampColorShader` 的實現。

## 新增參數

### Layer Blend Mode
- **類型**: Float
- **預設值**: 0.0 (Normal)
- **範圍**: 0 ~ 15
- **說明**: 第二層與底層的混合模式

### Layer Blend Intensity
- **類型**: Float
- **預設值**: 1.0
- **範圍**: 0 ~ 1
- **說明**: 混合強度 (0=完全使用底層, 1=完全使用混合結果)

## 16 種混合模式詳解

| 模式 | 值 | 效果說明 | 應用場景 |
|---|---|---|---|
| **Normal** | 0 | 正常透明度混合 | 基礎覆蓋 |
| **Multiply** | 1 | 正片疊底 | 陰影、暗化、紋理疊加 |
| **Screen** | 2 | 濾色 | 光源、發光效果 |
| **Overlay** | 3 | 疊加 | 對比度強化、紋理混合 |
| **Darken** | 4 | 變暗 | 取兩層中較暗的顏色 |
| **Lighten** | 5 | 變亮 | 取兩層中較亮的顏色 |
| **Color Dodge** | 6 | 顏色減淡 | 高亮、光效 |
| **Color Burn** | 7 | 顏色加深 | 深色效果、燒紙效果 |
| **Hard Light** | 8 | 強光 | 快速對比度調整 |
| **Soft Light** | 9 | 柔光 | 溫和的光效、陰影 |
| **Difference** | 10 | 差值 | 反相、光學效果 |
| **Exclusion** | 11 | 排除 | 對比效果 |
| **Hue** | 12 | 色相 | 保留底層飽和度和亮度 |
| **Saturation** | 13 | 飽和度 | 改變飽和度 |
| **Color** | 14 | 顏色 | 保留底層亮度 |
| **Luminosity** | 15 | 亮度 | 改變亮度 |

## 快速設置示例

### 示例 1：發光效果（Screen Mode）

```yaml
Layer Blend Mode: 2.0          # Screen
Layer Blend Intensity: 1.0     # 完全應用混合
Layer Opacity: 0.6             # 控制發光強度
Layer Texture: glow.png        # 發光紋理
```

**效果**：
- 第二層使用 Screen 模式，創造發光效果
- 顏色會變亮，適合光暈、火焰等效果

### 示例 2：陰影加強（Multiply Mode）

```yaml
Layer Blend Mode: 1.0          # Multiply
Layer Blend Intensity: 1.0
Layer Opacity: 0.8
Layer Texture: shadow.png      # 陰影紋理
```

**效果**：
- 第二層使用 Multiply 模式，加深陰影
- 顏色會變暗，適合陰影、污漬效果

### 示例 3：細節紋理（Overlay Mode）

```yaml
Layer Blend Mode: 3.0          # Overlay
Layer Blend Intensity: 0.7
Layer Opacity: 0.5
Layer Texture: detail.png      # 細節紋理
```

**效果**：
- 增強對比度，保留細節
- 適合增加質感和層次感

### 示例 4：光效合成（Color Dodge Mode）

```yaml
Layer Blend Mode: 6.0          # Color Dodge
Layer Blend Intensity: 0.8
Layer Opacity: 0.4
Layer Texture: light.png       # 光效紋理
```

**效果**：
- 高亮區域變得更亮
- 適合魔法光效、激光等

## 混合強度使用技巧

### 調整混合強度以獲得最佳效果

```typescript
// 完全應用混合模式
material.setProperty('layerBlendIntensity', 1.0);

// 50% 混合（溫和效果）
material.setProperty('layerBlendIntensity', 0.5);

// 30% 混合（微妙效果）
material.setProperty('layerBlendIntensity', 0.3);

// 0% 混合（不應用混合，完全使用底層）
material.setProperty('layerBlendIntensity', 0.0);
```

## 完整配置示例

### 角色發光效果

```yaml
Material "CharacterGlow":
  Main Texture: character.png
  Tiling Offset: [1, 1, 0, 0]
  
  Use Layer: 1.0
  Layer Texture: character_glow.png
  Layer Tiling Offset: [1, 1, 0, 0]
  Layer Blend Mode: 2.0                    # Screen
  Layer Blend Intensity: 0.8
  Layer Opacity: 0.6
```

### 地面光影效果

```yaml
Material "GroundLighting":
  Main Texture: grass.png
  Tiling Offset: [4, 4, 0, 0]
  
  Use Layer: 1.0
  Layer Texture: grass_shadow.png
  Layer Tiling Offset: [4, 4, 0, 0]
  Layer Blend Mode: 1.0                    # Multiply
  Layer Blend Intensity: 0.7
  Layer Opacity: 0.5
```

### 特效覆蓋

```yaml
Material "FireEffect":
  Main Texture: base_sprite.png
  Tiling Offset: [1, 1, 0, 0]
  
  Use Layer: 1.0
  Layer Texture: fire_overlay.png
  Layer Tiling Offset: [2, 2, 0, 0]
  Layer Blend Mode: 6.0                    # Color Dodge
  Layer Blend Intensity: 0.9
  Layer Opacity: 0.8
```

## 腳本代碼示例

### 基本用法

```typescript
const material = sprite.getMaterialInstance(0);

// 啟用第二層
material.setProperty('useLayer', 1.0);

// 設置 Screen 混合模式
material.setProperty('layerBlendMode', 2.0);

// 設置混合強度
material.setProperty('layerBlendIntensity', 0.8);

// 設置透明度
material.setProperty('layerOpacity', 0.6);
```

### 動態混合模式切換

```typescript
export class LayerBlendController extends Component {
    private material: any;
    private currentBlendMode: number = 0;
    
    onLoad() {
        this.material = this.node.getComponent(Sprite).getMaterialInstance(0);
        this.material.setProperty('useLayer', 1.0);
    }
    
    switchBlendMode(mode: number) {
        if (mode >= 0 && mode <= 15) {
            this.currentBlendMode = mode;
            this.material.setProperty('layerBlendMode', mode);
            console.log(`Blend mode switched to: ${mode}`);
        }
    }
    
    setBlendIntensity(intensity: number) {
        this.material.setProperty('layerBlendIntensity', Math.clamp(intensity, 0, 1));
    }
    
    cycleBlendMode() {
        this.currentBlendMode = (this.currentBlendMode + 1) % 16;
        this.switchBlendMode(this.currentBlendMode);
    }
}
```

### 動態漸變效果

```typescript
export class LayerBlendFade extends Component {
    private material: any;
    private blendIntensity: number = 0.0;
    private targetIntensity: number = 1.0;
    private fadeSpeed: number = 1.0;
    
    onLoad() {
        this.material = this.node.getComponent(Sprite).getMaterialInstance(0);
        this.material.setProperty('useLayer', 1.0);
        this.material.setProperty('layerBlendMode', 2.0);  // Screen mode
    }
    
    update(dt: number) {
        if (Math.abs(this.blendIntensity - this.targetIntensity) > 0.01) {
            this.blendIntensity += (this.targetIntensity - this.blendIntensity) * this.fadeSpeed * dt;
            this.material.setProperty('layerBlendIntensity', this.blendIntensity);
        }
    }
    
    fadeIn() {
        this.targetIntensity = 1.0;
    }
    
    fadeOut() {
        this.targetIntensity = 0.0;
    }
}
```

### 混合模式組合效果

```typescript
export class LayerBlendCombo extends Component {
    private material: any;
    
    private blendPresets = [
        { mode: 0, intensity: 1.0, opacity: 1.0, name: 'Normal' },
        { mode: 2, intensity: 0.8, opacity: 0.6, name: 'Glow' },
        { mode: 1, intensity: 0.7, opacity: 0.5, name: 'Shadow' },
        { mode: 3, intensity: 0.6, opacity: 0.7, name: 'Detail' },
        { mode: 6, intensity: 0.9, opacity: 0.8, name: 'Light' },
    ];
    
    onLoad() {
        this.material = this.node.getComponent(Sprite).getMaterialInstance(0);
        this.material.setProperty('useLayer', 1.0);
    }
    
    applyPreset(presetName: string) {
        const preset = this.blendPresets.find(p => p.name === presetName);
        if (!preset) return;
        
        this.material.setProperty('layerBlendMode', preset.mode);
        this.material.setProperty('layerBlendIntensity', preset.intensity);
        this.material.setProperty('layerOpacity', preset.opacity);
        console.log(`Applied preset: ${presetName}`);
    }
}
```

## 混合模式選擇建議

### 根據效果選擇：

**發光/光效** → Screen (2) 或 Color Dodge (6)
**陰影/暗化** → Multiply (1) 或 Color Burn (7)
**細節/紋理** → Overlay (3) 或 Soft Light (9)
**對比強化** → Hard Light (8) 或 Overlay (3)
**特殊效果** → Difference (10) 或 Exclusion (11)
**顏色調整** → Hue (12)、Saturation (13) 或 Color (14)

## 工作原理

### RGB 混合流程

```glsl
// 1. 採樣底層和頂層
vec4 baseColor = texture(mainTexture, uv0);
vec4 layerColor = texture(layerTexture, uv1);

// 2. 根據 layerBlendMode 選擇混合方式
vec3 blendedRGB = applyLayerBlendMode(
    baseColor.rgb,           // 底層顏色
    layerColor.rgb,          // 頂層顏色
    layerBlendMode,          // 混合模式
    layerBlendIntensity      // 混合強度
);

// 3. Alpha 混合
float finalAlpha = mix(baseColor.a, layerColor.a, layerColor.a * layerOpacity);

// 4. 最終結果
finalColor = vec4(blendedRGB, finalAlpha);
```

### 混合強度的作用

```
若混合強度 = 0.5：
最終顏色 = 0.5 * 混合結果 + 0.5 * 底層顏色
```

## 常見問題

### Q1：怎樣選擇合適的混合模式？

**A**：
- 根據視覺效果需求選擇
- 發光效果用 Screen (2)
- 陰影效果用 Multiply (1)
- 紋理細節用 Overlay (3)
- 測試不同模式找到最佳效果

### Q2：混合強度應該設置多少？

**A**：
- 1.0 = 完全應用混合模式
- 0.5 = 50% 混合（更溫和）
- 0.3 = 30% 混合（微妙效果）
- 根據效果強度調整

### Q3：如何同時控制透明度和混合效果？

**A**：
```typescript
// Layer Opacity 控制 alpha 混合
material.setProperty('layerOpacity', 0.6);  // 60% 透明

// Layer Blend Intensity 控制混合模式強度
material.setProperty('layerBlendIntensity', 0.8);  // 80% 混合
```

### Q4：Can I use different blend modes at runtime?

**A**: Yes! Simply change the property:
```typescript
material.setProperty('layerBlendMode', newBlendMode);
```

## 性能考慮

- ✅ Blend mode 計算在 GPU 上完成
- ✅ 使用簡單的 if-else 分支，現代 GPU 優化很好
- ✅ 不會顯著增加渲染成本
- ✅ 支援實時動態切換

## 完整參數檢查清單

- [ ] `useLayer` = 1.0 （啟用第二層）
- [ ] `layerBlendMode` 設置正確（0-15）
- [ ] `layerBlendIntensity` 設置合理（0-1）
- [ ] `layerOpacity` 設置適當（0-1）
- [ ] `Layer Texture` 已分配
- [ ] 在編輯器中看到預期效果

---

**強大的混合模式系統！** 現在你有 16 種不同的方式來混合層，創造各種視覺效果！
