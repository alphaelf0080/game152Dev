# Cocos Creator Slot Game 立體效果實現指南

## 問題
如何在 Cocos Creator 將 slot game 的 UI symbol reel bg 等各層，表現的像是會隨著鏡頭晃動有立體的感覺？

## 解決方案

在 Cocos Creator 中創造 slot game 的立體晃動效果，可以通過視差滾動（Parallax）和深度層次來實現。以下是幾種主要方法：

### 1. 使用視差滾動組件

```typescript
import { _decorator, Component, Node, Vec3, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ParallaxController')
export class ParallaxController extends Component {
    @property([Node])
    parallaxLayers: Node[] = [];
    
    @property([Number])
    parallaxSpeeds: number[] = [0.1, 0.3, 0.5, 0.8, 1.0]; // 不同層的移動速度
    
    @property(Camera)
    camera: Camera = null;
    
    private originalPositions: Vec3[] = [];
    
    start() {
        // 記錄初始位置
        this.parallaxLayers.forEach(layer => {
            this.originalPositions.push(layer.position.clone());
        });
    }
    
    update() {
        // 根據攝像機晃動調整各層位置
        const cameraOffset = this.camera.node.position;
        
        this.parallaxLayers.forEach((layer, index) => {
            const speed = this.parallaxSpeeds[index] || 1.0;
            const newPos = this.originalPositions[index].clone();
            newPos.x += cameraOffset.x * speed;
            newPos.y += cameraOffset.y * speed;
            layer.setPosition(newPos);
        });
    }
}
```

### 2. 攝像機晃動控制器

```typescript
import { _decorator, Component, Camera, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {
    @property(Camera)
    camera: Camera = null;
    
    private originalPosition: Vec3 = new Vec3();
    
    start() {
        this.originalPosition = this.camera.node.position.clone();
    }
    
    // 開始搖晃效果
    startShake(intensity: number = 10, duration: number = 0.5) {
        tween(this.camera.node)
            .to(0.05, { position: new Vec3(
                this.originalPosition.x + Math.random() * intensity - intensity/2,
                this.originalPosition.y + Math.random() * intensity - intensity/2,
                this.originalPosition.z
            )})
            .to(0.05, { position: new Vec3(
                this.originalPosition.x + Math.random() * intensity - intensity/2,
                this.originalPosition.y + Math.random() * intensity - intensity/2,
                this.originalPosition.z
            )})
            .repeat(duration * 10)
            .to(0.1, { position: this.originalPosition })
            .start();
    }
    
    // 微妙的漂浮效果
    startFloating() {
        tween(this.camera.node)
            .to(2, { position: new Vec3(
                this.originalPosition.x + 5,
                this.originalPosition.y + 3,
                this.originalPosition.z
            )})
            .to(2, { position: new Vec3(
                this.originalPosition.x - 5,
                this.originalPosition.y - 3,
                this.originalPosition.z
            )})
            .union()
            .repeatForever()
            .start();
    }
}
```

### 3. Symbol 深度效果

```typescript
import { _decorator, Component, Node, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolDepthEffect')
export class SymbolDepthEffect extends Component {
    @property(Number)
    depthFactor: number = 0.8; // 深度係數
    
    @property(Number)
    scaleVariation: number = 0.05; // 縮放變化
    
    private originalScale: Vec3 = new Vec3();
    private originalPosition: Vec3 = new Vec3();
    
    start() {
        this.originalScale = this.node.scale.clone();
        this.originalPosition = this.node.position.clone();
    }
    
    // 響應攝像機移動
    updateDepthEffect(cameraOffset: Vec3) {
        // 位置偏移
        const offsetX = cameraOffset.x * this.depthFactor;
        const offsetY = cameraOffset.y * this.depthFactor;
        
        this.node.setPosition(
            this.originalPosition.x + offsetX,
            this.originalPosition.y + offsetY,
            this.originalPosition.z
        );
        
        // 縮放效果
        const scaleChange = (Math.abs(offsetX) + Math.abs(offsetY)) * this.scaleVariation;
        const newScale = this.originalScale.clone();
        newScale.multiplyScalar(1 + scaleChange);
        this.node.setScale(newScale);
    }
}
```

### 4. Reel 滾動時的深度效果

```typescript
import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReelDepthController')
export class ReelDepthController extends Component {
    @property([Node])
    reelColumns: Node[] = [];
    
    // 添加滾動時的深度變化
    spinWithDepth(columnIndex: number) {
        const reel = this.reelColumns[columnIndex];
        
        // 滾動開始時縮小
        tween(reel)
            .to(0.1, { scale: new Vec3(0.95, 0.95, 1) })
            .to(0.1, { scale: new Vec3(1.05, 1.05, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
            
        // 添加輕微的 Z 軸旋轉
        tween(reel)
            .to(0.2, { eulerAngles: new Vec3(0, 0, 2) })
            .to(0.2, { eulerAngles: new Vec3(0, 0, -2) })
            .to(0.2, { eulerAngles: new Vec3(0, 0, 0) })
            .start();
    }
}
```

### 5. 層級設置建議

在 Cocos Creator 中，建議按以下順序設置層級（Z-order）：

1. **背景層**: Z = -100, 視差速度 = 0.1
2. **裝飾背景**: Z = -50, 視差速度 = 0.3  
3. **Reel 背景**: Z = 0, 視差速度 = 0.5
4. **Symbol 層**: Z = 10, 視差速度 = 0.8
5. **UI 效果**: Z = 50, 視差速度 = 1.0
6. **前景裝飾**: Z = 100, 視差速度 = 1.2

## 使用方法

1. 將這些腳本掛載到對應的節點上
2. 設置不同層的視差速度
3. 在適當時機調用攝像機晃動效果
4. 調整各層的 `depthFactor` 來達到理想的立體感

這樣就能創造出具有深度感和立體效果的 slot game 界面了。

## 實現要點

- **視差滾動**: 不同層以不同速度響應攝像機移動
- **攝像機晃動**: 增加動態感和互動回饋
- **深度係數**: 控制各層的立體感強度
- **層級管理**: 合理安排 Z-order 創造深度層次
- **動畫配合**: 結合縮放和旋轉增強效果

---

## 相關文檔

- **[立體效果實作指南](./Cocos-Creator-Depth-Effects-Implementation-Guide.md)** - 詳細的好運咚咚遊戲實作步驟、節點佈局和整合方法

---
*創建日期: 2025年10月13日*
*更新日期: 2025年10月13日*
*相關項目: game152Dev - 好運咚咚 slot game*