# DualLayerMaterial - 雙層材質組件

## 概述

`DualLayerMaterial` 是一個強大的組件，可以在 Sprite 現有的 custom material 上層再覆蓋第二層 material。

**主要特性**：
- ✅ 保留原有的底層材質不變
- ✅ 在上層添加第二層材質覆蓋
- ✅ 支援透明度調整
- ✅ 支援混合模式設置
- ✅ 實時預覽和動態調整
- ✅ 自動同步紋理和尺寸

## 工作原理

### 架構

```
Sprite Node
├─ 第一層（底層）：保留原有的 custom material
│  └─ 顯示原始效果（如 UV repeat、顏色調整等）
│
└─ Overlay Node（自動創建）
   └─ 第二層（頂層）：添加的 overlay material
      └─ 在底層上方混合顯示
```

### 混合流程

1. **底層渲染**：原始 Sprite 使用其 custom material 渲染
2. **頂層渲染**：Overlay Sprite 使用 overlay material 渲染
3. **混合顯示**：根據透明度和混合模式混合兩層

## 快速開始

### 1. 添加組件

```
1. 選擇你的 Sprite Node
2. Add Component → DualLayerMaterial
3. 完成！
```

### 2. 設置覆蓋層材質

```
Inspector 面板：
- Target Sprite: 自動檢測
- Overlay Material: 選擇你想要的材質
- Overlay Opacity: 透明度 (0~1)
- Enable Overlay: 勾選啟用
```

### 3. 調整效果

```
- 改變 Overlay Opacity 調整透明度
- 改變 Blend Mode 調整混合方式
- 動態改變 Enable Overlay 控制顯示/隱藏
```

## 參數說明

| 參數 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| Target Sprite | Sprite | auto | 目標 Sprite 組件 |
| Overlay Material | Material | null | 覆蓋層材質 |
| Overlay Opacity | float | 1.0 | 覆蓋層透明度 (0~1) |
| Blend Src | BlendFactor | SRC_ALPHA | 混合源因子 |
| Blend Dst | BlendFactor | ONE_MINUS_SRC_ALPHA | 混合目標因子 |
| Enable Overlay | bool | true | 是否啟用覆蓋層 |

## 使用場景

### 場景 1：添加發光效果

```
原始 Sprite: 有 UV repeat 效果
+ 覆蓋層：發光/Glow 材質
= 既有 UV 重複，又有發光效果
```

配置：
```yaml
Bottom Layer: 原始 Custom Material (UV Repeat)
Overlay Material: Glow Material
Overlay Opacity: 0.5
```

### 場景 2：添加顏色調整

```
原始 Sprite: 基礎紋理
+ 覆蓋層：顏色映射/Ramp 材質
= 修改後的顏色效果
```

配置：
```yaml
Bottom Layer: 原始紋理
Overlay Material: RampColorShader
Overlay Opacity: 1.0
```

### 場景 3：添加特效疊加

```
原始 Sprite: 角色皮膚
+ 覆蓋層：燃燒/冰凍特效
= 受傷/增益狀態顯示
```

配置：
```yaml
Bottom Layer: 角色貼圖
Overlay Material: 特效材質
Overlay Opacity: 動態調整 (0~1)
```

### 場景 4：分層渲染

```
原始 Sprite: 白天場景
+ 覆蓋層：黑暗覆蓋 (昏暗時間)
= 時間變化效果
```

配置：
```yaml
Bottom Layer: 場景紋理
Overlay Material: 暗色覆蓋
Overlay Opacity: 根據時間調整
```

## 完整配置示例

### 例子 1：發光+顏色調整

```
Node "Character"
├─ UITransform: Content Size (200, 200)
├─ Sprite
│  ├─ Sprite Frame: character.png
│  ├─ Custom Material: CharacterRampShader
│  └─ Color: white
├─ DualLayerMaterial
│  ├─ Target Sprite: (自動)
│  ├─ Overlay Material: GlowMaterial
│  ├─ Overlay Opacity: 0.6
│  └─ Enable Overlay: true
```

結果：
- 底層：Character 使用 RampShader（顏色調整）
- 頂層：Glow 效果在底層上方
- 效果：既有顏色調整，又有發光效果

### 例子 2：動態傷害指示器

```
Node "Enemy"
├─ Sprite (Basic Texture)
├─ DualLayerMaterial
│  ├─ Overlay Material: RedOverlay
│  └─ Overlay Opacity: 0 (初始隱藏)

Script 中：
function takeDamage() {
    const dualLayer = node.getComponent('DualLayerMaterial');
    dualLayer.setOverlayOpacity(0.5);  // 顯示紅色覆蓋
    
    setTimeout(() => {
        dualLayer.setOverlayOpacity(0);  // 淡出
    }, 500);
}
```

## 腳本 API

### 基本方法

```typescript
// 獲取組件
const dualLayer = this.node.getComponent('DualLayerMaterial');

// 設置覆蓋層材質
dualLayer.setOverlayMaterial(newMaterial);

// 設置覆蓋層透明度 (0~1)
dualLayer.setOverlayOpacity(0.5);

// 啟用/禁用覆蓋層
dualLayer.setOverlayEnabled(true);
dualLayer.setOverlayEnabled(false);

// 獲取覆蓋層 Sprite
const overlaySprite = dualLayer.getOverlaySprite();

// 獲取底層 Sprite
const baseSprite = dualLayer.getBaseSprite();

// 交換材質
dualLayer.swapMaterials();

// 刪除覆蓋層
dualLayer.removeOverlay();
```

## 代碼示例

### 示例 1：簡單覆蓋

```typescript
onLoad() {
    const dualLayer = this.node.getComponent('DualLayerMaterial');
    dualLayer.setOverlayMaterial(this.glowMaterial);
    dualLayer.setOverlayOpacity(0.5);
}
```

### 示例 2：淡入淡出效果

```typescript
export class FadeOverlay extends Component {
    private dualLayer: any;
    
    onLoad() {
        this.dualLayer = this.node.getComponent('DualLayerMaterial');
        this.dualLayer.setOverlayOpacity(0);
    }
    
    update(dt: number) {
        // 淡入效果
        const currentOpacity = this.dualLayer.overlayOpacity;
        this.dualLayer.setOverlayOpacity(currentOpacity + dt * 0.5);
    }
}
```

### 示例 3：狀態指示

```typescript
export class CharacterStatus extends Component {
    private dualLayer: any;
    
    onLoad() {
        this.dualLayer = this.node.getComponent('DualLayerMaterial');
    }
    
    // 進入燃燒狀態
    burnEffect() {
        this.dualLayer.setOverlayMaterial(this.burnMaterial);
        this.dualLayer.setOverlayOpacity(0.7);
    }
    
    // 進入冰凍狀態
    freezeEffect() {
        this.dualLayer.setOverlayMaterial(this.freezeMaterial);
        this.dualLayer.setOverlayOpacity(0.5);
    }
    
    // 清除特效
    clearEffect() {
        this.dualLayer.setOverlayOpacity(0);
    }
}
```

### 示例 4：動畫循環

```typescript
export class PulseOverlay extends Component {
    private dualLayer: any;
    private time: number = 0;
    private speed: number = 2; // 秒
    
    onLoad() {
        this.dualLayer = this.node.getComponent('DualLayerMaterial');
    }
    
    update(dt: number) {
        this.time += dt;
        
        // 使用 sin 函數創建脈動效果
        const opacity = Math.abs(Math.sin(this.time * Math.PI / this.speed));
        this.dualLayer.setOverlayOpacity(opacity);
    }
}
```

## 常見問題

### Q1：能同時添加多個覆蓋層嗎？

A：可以，使用多個 DualLayerMaterial 組件：
```typescript
// 第一個覆蓋層
node.addComponent('DualLayerMaterial').overlayMaterial = material1;

// 第二個覆蓋層（覆蓋層的覆蓋層）
const overlayNode = node.getChildByName(`${node.name}_Overlay`);
overlayNode.addComponent('DualLayerMaterial').overlayMaterial = material2;
```

### Q2：如何保存/恢復狀態？

A：保存組件狀態：
```typescript
const dualLayer = node.getComponent('DualLayerMaterial');
const state = {
    material: dualLayer.overlayMaterial,
    opacity: dualLayer.overlayOpacity,
    enabled: dualLayer.enableOverlay
};

// 恢復狀態
dualLayer.setOverlayMaterial(state.material);
dualLayer.setOverlayOpacity(state.opacity);
dualLayer.setOverlayEnabled(state.enabled);
```

### Q3：覆蓋層 Node 會被銷毀嗎？

A：只有當你調用 `removeOverlay()` 時才會被銷毀。父 Node 銷毀時自動銷毀。

### Q4：性能考慮？

A：
- 雙層材質需要兩次渲染，性能消耗翻倍
- 適當使用，避免大量重疊層
- 可以用 `enableOverlay` 動態啟用/禁用以優化

### Q5：能調整覆蓋層的位置/旋轉嗎？

A：可以，通過 `getOverlaySprite().node` 訪問：
```typescript
const overlayNode = dualLayer.getOverlaySprite().node;
overlayNode.position.x += 10;
overlayNode.angle = 45;
overlayNode.scale.set(1.2, 1.2);
```

## 完整檢查清單

設置前：
- [ ] Sprite 有 custom material（底層）
- [ ] 準備好第二個 material（覆蓋層）
- [ ] DualLayerMaterial 組件已添加

設置中：
- [ ] Target Sprite 已自動或手動設置
- [ ] Overlay Material 已設置
- [ ] Overlay Opacity 設置合適值
- [ ] Enable Overlay 已勾選

測試中：
- [ ] 兩層效果都可見
- [ ] 改變 Opacity 有效果
- [ ] 改變 Enable Overlay 狀態變化
- [ ] 沒有明顯性能下降

## 檔案位置

- **組件**：`/assets/scripts/DualLayerMaterial.ts`
- **使用指南**：`/docs/DualLayerMaterial-Guide.md` (本文件)

---

**強大的分層渲染解決方案！** 現在你可以輕鬆創建複雜的視覺效果組合。
