# 好運咚咚遊戲 - 立體效果實作指南

## 目錄
1. [節點層級架構](#節點層級架構)
2. [編輯器中的節點佈局](#編輯器中的節點佈局)
3. [腳本組件實作](#腳本組件實作)
4. [整合到現有專案](#整合到現有專案)
5. [效果調整與優化](#效果調整與優化)

---

## 1. 節點層級架構

### 1.1 當前遊戲節點結構分析

根據好運咚咚遊戲的場景結構，當前的節點層級為：

```
Canvas
├── Camera
└── BaseGame
    └── Layer
        └── Shake
            ├── Background (背景層)
            ├── Animation
            │   ├── SymbolAnm (符號動畫)
            │   ├── SymbolScatter (Scatter 動畫)
            │   ├── SymbolPayTable (支付表)
            │   └── PaySymbolBlack (支付符號黑幕)
            ├── Spread (擴展層)
            ├── reelMask (捲軸遮罩)
            └── UI 元素
```

### 1.2 建議的立體效果節點架構

為了實現立體視差效果，建議重新組織節點結構如下：

```
Canvas
├── Camera (添加 CameraShake 組件)
└── BaseGame
    └── Layer
        └── ParallaxRoot (新增 - 添加 ParallaxController 組件)
            ├── Layer_BG_Far (Z: -100, 視差: 0.1)
            │   └── background_far (最遠背景)
            ├── Layer_BG_Mid (Z: -50, 視差: 0.3)
            │   └── decorative_elements (裝飾元素)
            ├── Layer_Reel_BG (Z: 0, 視差: 0.5)
            │   ├── reel_frame (捲軸框架)
            │   └── reelMask
            ├── Layer_Symbols (Z: 10, 視差: 0.8)
            │   ├── Shake (原 Shake 節點，保留 Symbol 相關)
            │   │   ├── Reel0, Reel1, Reel2, Reel3, Reel4
            │   │   └── Symbols (添加 SymbolDepthEffect 組件)
            │   └── Animation
            │       ├── SymbolAnm
            │       └── SymbolScatter
            ├── Layer_UI_Effects (Z: 50, 視差: 1.0)
            │   ├── PaySymbolBlack
            │   ├── SymbolPayTable
            │   └── particle_effects (特效)
            └── Layer_Foreground (Z: 100, 視差: 1.2)
                ├── frame_decorations (前景框架裝飾)
                └── UI (最上層 UI)
```

---

## 2. 編輯器中的節點佈局

### 2.1 步驟一：創建視差根節點

1. **在編輯器中操作**：
   - 在 `Canvas/BaseGame/Layer` 下創建新節點 `ParallaxRoot`
   - 設置 ParallaxRoot 的位置為 (0, 0, 0)
   - 將原有的 `Shake` 節點移動到 ParallaxRoot 下

2. **添加視差控制器組件**：
   ```typescript
   // 創建 ParallaxController.ts 並掛載到 ParallaxRoot
   ```

### 2.2 步驟二：創建並配置各層級節點

#### Layer_BG_Far (最遠背景層)
```
屬性設置：
- Position: (0, 0, -100)
- Scale: (1, 1, 1)
- 視差速度: 0.1
```

**在編輯器中**：
1. 右鍵 ParallaxRoot → 創建空節點 → 命名為 `Layer_BG_Far`
2. 設置 Position Z 為 -100
3. 將背景圖片拖入此層作為子節點
4. 可以添加緩慢移動的雲、山脈等遠景元素

#### Layer_BG_Mid (中景裝飾層)
```
屬性設置：
- Position: (0, 0, -50)
- Scale: (1, 1, 1)
- 視差速度: 0.3
```

**在編輯器中**：
1. 創建 `Layer_BG_Mid` 節點
2. 設置 Position Z 為 -50
3. 添加裝飾性元素：鼓、鈸、花紋等
4. 這些元素會比背景移動稍快

#### Layer_Reel_BG (捲軸背景層)
```
屬性設置：
- Position: (0, 0, 0)
- Scale: (1, 1, 1)
- 視差速度: 0.5
```

**在編輯器中**：
1. 創建 `Layer_Reel_BG` 節點
2. 設置 Position Z 為 0
3. 將原有的 `reelMask` 移動到此層
4. 添加捲軸框架和背景裝飾

#### Layer_Symbols (符號層 - 最重要)
```
屬性設置：
- Position: (0, 0, 10)
- Scale: (1, 1, 1)
- 視差速度: 0.8
```

**在編輯器中**：
1. 創建 `Layer_Symbols` 節點
2. 設置 Position Z 為 10
3. 將原有的 Reel 節點結構移動到此層：
   ```
   Layer_Symbols/
   ├── Shake/
   │   ├── Reel0/ (每個 Reel 添加 ReelDepthController)
   │   ├── Reel1/
   │   ├── Reel2/
   │   ├── Reel3/
   │   └── Reel4/
   └── Animation/
       ├── SymbolAnm
       └── SymbolScatter
   ```

4. **對每個 Symbol 添加深度效果**：
   - 為每個 Symbol prefab 添加 `SymbolDepthEffect` 組件
   - 設置 depthFactor = 0.8
   - 設置 scaleVariation = 0.05

#### Layer_UI_Effects (UI 效果層)
```
屬性設置：
- Position: (0, 0, 50)
- Scale: (1, 1, 1)
- 視差速度: 1.0
```

**在編輯器中**：
1. 創建 `Layer_UI_Effects` 節點
2. 設置 Position Z 為 50
3. 移動特效和 UI 元素到此層：
   - PaySymbolBlack
   - SymbolPayTable
   - 粒子特效系統

#### Layer_Foreground (前景層)
```
屬性設置：
- Position: (0, 0, 100)
- Scale: (1, 1, 1)
- 視差速度: 1.2
```

**在編輯器中**：
1. 創建 `Layer_Foreground` 節點
2. 設置 Position Z 為 100
3. 添加前景裝飾元素（選配）：
   - 框架裝飾
   - 前景特效
   - 按鈕 UI

### 2.3 節點屬性配置表

| 層級名稱 | Z軸位置 | 視差速度 | 用途 | 移動速度感受 |
|---------|--------|---------|------|------------|
| Layer_BG_Far | -100 | 0.1 | 遠景背景 | 非常慢 |
| Layer_BG_Mid | -50 | 0.3 | 中景裝飾 | 慢 |
| Layer_Reel_BG | 0 | 0.5 | 捲軸背景 | 中等 |
| Layer_Symbols | 10 | 0.8 | 遊戲符號 | 快 |
| Layer_UI_Effects | 50 | 1.0 | UI 特效 | 正常速度 |
| Layer_Foreground | 100 | 1.2 | 前景裝飾 | 最快 |

---

## 3. 腳本組件實作

### 3.1 創建腳本檔案

在 `pss-on-00152/assets/script/` 下創建新資料夾 `DepthEffects/`：

```
script/
└── DepthEffects/
    ├── ParallaxController.ts
    ├── CameraShake.ts
    ├── SymbolDepthEffect.ts
    └── ReelDepthController.ts
```

### 3.2 ParallaxController.ts

```typescript
import { _decorator, Component, Node, Vec3, Camera, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ParallaxController')
export class ParallaxController extends Component {
    @property([Node])
    parallaxLayers: Node[] = [];
    
    @property([Number])
    parallaxSpeeds: number[] = [0.1, 0.3, 0.5, 0.8, 1.0, 1.2];
    
    @property({ type: Camera })
    mainCamera: Camera = null;
    
    @property(Boolean)
    enableEffect: boolean = true;
    
    private originalPositions: Vec3[] = [];
    private cameraOriginalPos: Vec3 = new Vec3();
    
    onLoad() {
        // 自動尋找 Camera
        if (!this.mainCamera) {
            const cameraNode = find("Canvas/Camera");
            if (cameraNode) {
                this.mainCamera = cameraNode.getComponent(Camera);
            }
        }
        
        // 自動尋找所有 Layer_ 開頭的子節點
        if (this.parallaxLayers.length === 0) {
            this.node.children.forEach(child => {
                if (child.name.startsWith('Layer_')) {
                    this.parallaxLayers.push(child);
                }
            });
        }
        
        // 記錄初始位置
        this.parallaxLayers.forEach(layer => {
            this.originalPositions.push(layer.position.clone());
        });
        
        if (this.mainCamera) {
            this.cameraOriginalPos = this.mainCamera.node.position.clone();
        }
    }
    
    update(deltaTime: number) {
        if (!this.enableEffect || !this.mainCamera) return;
        
        // 計算攝像機偏移
        const cameraOffset = new Vec3();
        Vec3.subtract(cameraOffset, this.mainCamera.node.position, this.cameraOriginalPos);
        
        // 應用視差效果到各層
        this.parallaxLayers.forEach((layer, index) => {
            if (!layer) return;
            
            const speed = this.parallaxSpeeds[index] || 1.0;
            const newPos = this.originalPositions[index].clone();
            
            // 根據視差速度計算新位置
            newPos.x += cameraOffset.x * speed;
            newPos.y += cameraOffset.y * speed;
            
            layer.setPosition(newPos);
        });
    }
    
    /**
     * 動態啟用/禁用視差效果
     */
    setEnableEffect(enable: boolean) {
        this.enableEffect = enable;
        
        // 禁用時恢復原始位置
        if (!enable) {
            this.parallaxLayers.forEach((layer, index) => {
                if (layer) {
                    layer.setPosition(this.originalPositions[index]);
                }
            });
        }
    }
}
```

### 3.3 CameraShake.ts

```typescript
import { _decorator, Component, Camera, Vec3, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {
    @property(Camera)
    camera: Camera = null;
    
    @property(Number)
    defaultIntensity: number = 10;
    
    @property(Number)
    defaultDuration: number = 0.5;
    
    @property(Boolean)
    enableFloating: boolean = false;
    
    @property(Number)
    floatingIntensityX: number = 5;
    
    @property(Number)
    floatingIntensityY: number = 3;
    
    @property(Number)
    floatingDuration: number = 2.0;
    
    private originalPosition: Vec3 = new Vec3();
    private currentTween: Tween<Node> = null;
    
    start() {
        if (!this.camera) {
            this.camera = this.getComponent(Camera);
        }
        
        if (this.camera) {
            this.originalPosition = this.camera.node.position.clone();
            
            if (this.enableFloating) {
                this.startFloating();
            }
        }
    }
    
    /**
     * 開始搖晃效果 - 用於大獎、特殊事件
     * @param intensity 搖晃強度
     * @param duration 持續時間
     */
    startShake(intensity: number = this.defaultIntensity, duration: number = this.defaultDuration) {
        if (!this.camera) return;
        
        // 停止當前動畫
        this.stopCurrentTween();
        
        const node = this.camera.node;
        const shakeCount = Math.floor(duration * 20); // 每秒20次搖晃
        
        let currentTween = tween(node);
        
        for (let i = 0; i < shakeCount; i++) {
            const randomX = this.originalPosition.x + (Math.random() * intensity - intensity / 2);
            const randomY = this.originalPosition.y + (Math.random() * intensity - intensity / 2);
            
            currentTween = currentTween.to(0.05, { 
                position: new Vec3(randomX, randomY, this.originalPosition.z) 
            });
        }
        
        this.currentTween = currentTween
            .to(0.1, { position: this.originalPosition })
            .call(() => {
                if (this.enableFloating) {
                    this.startFloating();
                }
            })
            .start();
    }
    
    /**
     * 微妙的漂浮效果 - 持續運行
     */
    startFloating() {
        if (!this.camera) return;
        
        this.stopCurrentTween();
        
        const node = this.camera.node;
        
        this.currentTween = tween(node)
            .to(this.floatingDuration, { 
                position: new Vec3(
                    this.originalPosition.x + this.floatingIntensityX,
                    this.originalPosition.y + this.floatingIntensityY,
                    this.originalPosition.z
                ) 
            })
            .to(this.floatingDuration, { 
                position: new Vec3(
                    this.originalPosition.x - this.floatingIntensityX,
                    this.originalPosition.y - this.floatingIntensityY,
                    this.originalPosition.z
                ) 
            })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 停止所有效果
     */
    stopAllEffects() {
        this.stopCurrentTween();
        if (this.camera) {
            this.camera.node.setPosition(this.originalPosition);
        }
    }
    
    /**
     * 停止當前 tween
     */
    private stopCurrentTween() {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
    }
    
    onDestroy() {
        this.stopCurrentTween();
    }
}
```

### 3.4 SymbolDepthEffect.ts

```typescript
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolDepthEffect')
export class SymbolDepthEffect extends Component {
    @property(Number)
    depthFactor: number = 0.8; // 深度係數，0-1 之間
    
    @property(Number)
    scaleVariation: number = 0.05; // 縮放變化幅度
    
    @property(Boolean)
    enableEffect: boolean = true;
    
    private originalScale: Vec3 = new Vec3();
    private originalPosition: Vec3 = new Vec3();
    
    start() {
        this.originalScale = this.node.scale.clone();
        this.originalPosition = this.node.position.clone();
    }
    
    /**
     * 更新深度效果 - 由外部調用（如 ParallaxController）
     * @param cameraOffset 攝像機偏移量
     */
    updateDepthEffect(cameraOffset: Vec3) {
        if (!this.enableEffect) return;
        
        // 位置偏移
        const offsetX = cameraOffset.x * this.depthFactor;
        const offsetY = cameraOffset.y * this.depthFactor;
        
        this.node.setPosition(
            this.originalPosition.x + offsetX,
            this.originalPosition.y + offsetY,
            this.originalPosition.z
        );
        
        // 縮放效果 - 模擬透視
        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        const scaleChange = distance * this.scaleVariation * 0.01;
        
        const newScale = this.originalScale.clone();
        const scaleFactor = 1 + scaleChange;
        newScale.x *= scaleFactor;
        newScale.y *= scaleFactor;
        
        this.node.setScale(newScale);
    }
    
    /**
     * 重置到原始狀態
     */
    reset() {
        this.node.setPosition(this.originalPosition);
        this.node.setScale(this.originalScale);
    }
}
```

### 3.5 ReelDepthController.ts

```typescript
import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ReelDepthController')
export class ReelDepthController extends Component {
    @property([Node])
    reelColumns: Node[] = [];
    
    @property(Boolean)
    enableDepthEffect: boolean = true;
    
    @property(Number)
    scaleIntensity: number = 0.05;
    
    @property(Number)
    rotationIntensity: number = 2;
    
    /**
     * 添加滾動時的深度變化效果
     * @param columnIndex 捲軸索引
     */
    spinWithDepth(columnIndex: number) {
        if (!this.enableDepthEffect) return;
        if (columnIndex < 0 || columnIndex >= this.reelColumns.length) return;
        
        const reel = this.reelColumns[columnIndex];
        if (!reel) return;
        
        const originalScale = reel.scale.clone();
        const originalRotation = reel.eulerAngles.clone();
        
        // 滾動開始時的縮放效果
        tween(reel)
            .to(0.1, { scale: new Vec3(
                originalScale.x * (1 - this.scaleIntensity), 
                originalScale.y * (1 - this.scaleIntensity), 
                1
            )})
            .to(0.1, { scale: new Vec3(
                originalScale.x * (1 + this.scaleIntensity), 
                originalScale.y * (1 + this.scaleIntensity), 
                1
            )})
            .to(0.1, { scale: originalScale })
            .start();
            
        // 添加輕微的 Z 軸旋轉
        tween(reel)
            .to(0.2, { eulerAngles: new Vec3(0, 0, this.rotationIntensity) })
            .to(0.2, { eulerAngles: new Vec3(0, 0, -this.rotationIntensity) })
            .to(0.2, { eulerAngles: originalRotation })
            .start();
    }
    
    /**
     * 停止時的彈跳效果
     * @param columnIndex 捲軸索引
     */
    stopBounce(columnIndex: number) {
        if (!this.enableDepthEffect) return;
        if (columnIndex < 0 || columnIndex >= this.reelColumns.length) return;
        
        const reel = this.reelColumns[columnIndex];
        if (!reel) return;
        
        const originalScale = reel.scale.clone();
        
        tween(reel)
            .to(0.1, { scale: new Vec3(
                originalScale.x * 1.1, 
                originalScale.y * 0.9, 
                1
            )})
            .to(0.15, { scale: originalScale })
            .start();
    }
}
```

---

## 4. 整合到現有專案

### 4.1 在 ReelController.ts 中整合

修改 `pss-on-00152/assets/script/ReelController/ReelController.ts`：

```typescript
import { ReelDepthController } from '../DepthEffects/ReelDepthController';
import { CameraShake } from '../DepthEffects/CameraShake';

@ccclass('ReelController')
export class ReelController extends Component {
    // 添加新屬性
    private reelDepthController: ReelDepthController = null;
    private cameraShake: CameraShake = null;
    
    start() {
        // ... 現有代碼 ...
        
        // 初始化深度效果控制器
        const parallaxRoot = find("Canvas/BaseGame/Layer/ParallaxRoot");
        if (parallaxRoot) {
            this.reelDepthController = parallaxRoot.getComponent(ReelDepthController);
        }
        
        // 初始化攝像機晃動
        const camera = find("Canvas/Camera");
        if (camera) {
            this.cameraShake = camera.getComponent(CameraShake);
        }
    }
    
    // 在開始滾動時調用
    startSpin(columnIndex: number) {
        // ... 現有代碼 ...
        
        // 添加深度效果
        if (this.reelDepthController) {
            this.reelDepthController.spinWithDepth(columnIndex);
        }
    }
    
    // 在停止滾動時調用
    stopSpin(columnIndex: number) {
        // ... 現有代碼 ...
        
        // 添加停止彈跳效果
        if (this.reelDepthController) {
            this.reelDepthController.stopBounce(columnIndex);
        }
    }
    
    // 在大獎時調用
    onBigWin() {
        // ... 現有代碼 ...
        
        // 添加攝像機晃動
        if (this.cameraShake) {
            this.cameraShake.startShake(15, 1.0);
        }
    }
}
```

### 4.2 在編輯器中的最終設置

1. **選擇 ParallaxRoot 節點**：
   - 添加組件 `ParallaxController`
   - 將各層節點拖入 `parallaxLayers` 陣列
   - 設置對應的 `parallaxSpeeds`

2. **選擇 Camera 節點**：
   - 添加組件 `CameraShake`
   - 勾選 `enableFloating` 啟用微漂浮
   - 調整 `floatingIntensityX/Y` 控制漂浮幅度

3. **選擇每個 Reel 節點**：
   - 添加組件 `ReelDepthController`
   - 將 5 個 reel 節點拖入 `reelColumns` 陣列

4. **Symbol Prefab 修改**：
   - 打開 Symbol prefab
   - 添加組件 `SymbolDepthEffect`
   - 設置 `depthFactor` = 0.8
   - 設置 `scaleVariation` = 0.05

---

## 5. 效果調整與優化

### 5.1 視差速度調整建議

根據不同場景需求調整視差速度：

#### 微妙效果（推薦用於正常遊戲）
```
Layer_BG_Far:      0.05
Layer_BG_Mid:      0.15
Layer_Reel_BG:     0.3
Layer_Symbols:     0.5
Layer_UI_Effects:  0.8
Layer_Foreground:  1.0
```

#### 明顯效果（用於特殊模式）
```
Layer_BG_Far:      0.1
Layer_BG_Mid:      0.3
Layer_Reel_BG:     0.5
Layer_Symbols:     0.8
Layer_UI_Effects:  1.0
Layer_Foreground:  1.2
```

#### 誇張效果（用於 Free Spin 或特殊獎勵）
```
Layer_BG_Far:      0.2
Layer_BG_Mid:      0.5
Layer_Reel_BG:     0.7
Layer_Symbols:     1.0
Layer_UI_Effects:  1.3
Layer_Foreground:  1.5
```

### 5.2 效能優化建議

1. **限制更新頻率**：
```typescript
// 在 ParallaxController 中添加
private updateInterval: number = 0.016; // 約60fps
private timeSinceLastUpdate: number = 0;

update(deltaTime: number) {
    this.timeSinceLastUpdate += deltaTime;
    
    if (this.timeSinceLastUpdate < this.updateInterval) {
        return;
    }
    
    this.timeSinceLastUpdate = 0;
    // ... 執行視差更新 ...
}
```

2. **只在需要時啟用**：
```typescript
// 在特定場景啟用/禁用
onEnterFreeSpinMode() {
    this.parallaxController.setEnableEffect(true);
}

onExitFreeSpinMode() {
    this.parallaxController.setEnableEffect(false);
}
```

3. **使用物件池**：
   - Symbol 已經使用物件池，確保 SymbolDepthEffect 組件正確重置

### 5.3 調試工具

添加調試開關：

```typescript
// 在 ParallaxController 中添加
@property(Boolean)
debugMode: boolean = false;

@property(Number)
debugSpeed: number = 1.0;

update(deltaTime: number) {
    if (this.debugMode) {
        // 手動控制攝像機位置進行測試
        const time = Date.now() * 0.001 * this.debugSpeed;
        this.mainCamera.node.setPosition(
            Math.sin(time) * 50,
            Math.cos(time) * 30,
            0
        );
    }
    
    // ... 其他代碼 ...
}
```

### 5.4 測試檢查清單

- [ ] 各層視差速度是否合理
- [ ] Symbol 滾動時是否有深度效果
- [ ] 大獎時攝像機是否晃動
- [ ] 效果是否流暢（60fps）
- [ ] 不同解析度下是否正常
- [ ] 移動設備上效能是否可接受
- [ ] Free Spin 模式下效果是否增強
- [ ] UI 按鈕是否不受視差影響

---

## 6. 進階效果（選配）

### 6.1 根據遊戲狀態動態調整

```typescript
export class DynamicDepthManager extends Component {
    private parallaxController: ParallaxController;
    
    // 根據遊戲狀態切換效果強度
    onGameStateChange(state: GameState) {
        switch(state) {
            case GameState.NormalSpin:
                this.setDepthIntensity(0.5);
                break;
            case GameState.FreeSpin:
                this.setDepthIntensity(1.0);
                break;
            case GameState.BigWin:
                this.setDepthIntensity(1.5);
                break;
        }
    }
    
    private setDepthIntensity(multiplier: number) {
        const baseSpeed = [0.1, 0.3, 0.5, 0.8, 1.0, 1.2];
        this.parallaxController.parallaxSpeeds = baseSpeed.map(s => s * multiplier);
    }
}
```

### 6.2 添加景深模糊效果（需要渲染紋理）

```typescript
// 為遠景層添加模糊效果
// 注意：這需要額外的性能開銷
import { Material } from 'cc';

@ccclass('DepthBlurEffect')
export class DepthBlurEffect extends Component {
    @property(Material)
    blurMaterial: Material = null;
    
    @property(Number)
    blurIntensity: number = 0.5;
    
    // 根據深度應用模糊效果
    // 實作細節取決於專案的渲染管線設置
}
```

---

## 總結

這套立體效果系統：

1. **模組化**: 每個組件獨立，易於維護
2. **可配置**: 所有參數都可在編輯器中調整
3. **效能友好**: 通過開關和優化保證流暢運行
4. **易於整合**: 最小化對現有代碼的修改
5. **靈活擴展**: 可根據需求添加更多效果

建議逐步實施：
1. 先實現基本的視差滾動
2. 然後添加攝像機漂浮效果
3. 最後加入 Symbol 和 Reel 的深度效果

每個階段都進行充分測試，確保不影響遊戲原有功能。

---

*文檔版本: 1.0*  
*創建日期: 2025-10-13*  
*適用專案: 好運咚咚 (PSS-ON-00152)*
