# Cocos Creator 多相機架構設計方案
## Slot Game 2D UI + 3D Effects + Post-Processing

---

## 文件資訊
- **專案**: game169 - Slot Game
- **建立日期**: 2025-10-15
- **引擎版本**: Cocos Creator 3.x
- **架構目標**: 2D UI/Symbol + 3D Effects + Post-Processing

---

## 一、需求分析

### 1.1 專案視覺需求

本專案需要實現**三層渲染架構**：

| 層級 | 相機類型 | 主要內容 | 渲染順序 | Z 軸範圍 |
|------|----------|----------|----------|----------|
| **底層** | 2D Camera | UI、Reel、Symbols | 第一層 | -100 ~ 100 |
| **中層** | 3D Camera | 3D 物件、粒子特效 | 第二層 | 任意 3D 空間 |
| **頂層** | Post-Processing Camera | 全屏後處理效果 | 第三層 | 屏幕空間 |

### 1.2 技術挑戰

1. **渲染順序控制**: 確保 2D、3D、後處理按正確順序渲染
2. **Layer 隔離**: 避免不同相機互相干擾
3. **效能優化**: 多相機系統的效能管理
4. **UI 互動**: 確保 UI 點擊不受 3D 層影響
5. **深度管理**: 2D 和 3D 的深度系統不同

---

## 二、相機系統架構

### 2.1 整體架構圖

```
┌─────────────────────────────────────────────────────┐
│                   Screen Output                      │
│  (玩家看到的最終畫面)                                │
└─────────────────────────────────────────────────────┘
                        ▲
                        │
        ┌───────────────┴───────────────┐
        │  Post-Processing Camera       │
        │  Priority: 10                 │
        │  - 全屏扭曲效果                │
        │  - 顏色調整                    │
        │  - Bloom/Glow                 │
        └───────────────┬───────────────┘
                        ▲
                        │
        ┌───────────────┴───────────────┐
        │  3D Effects Camera            │
        │  Priority: 5                  │
        │  - 3D 粒子系統                │
        │  - 3D 特效物件                │
        │  - Spine 3D 動畫              │
        └───────────────┬───────────────┘
                        ▲
                        │
        ┌───────────────┴───────────────┐
        │  2D Main Camera               │
        │  Priority: 0                  │
        │  - UI 元素                    │
        │  - Reel Symbols (2D)          │
        │  - 按鈕、文字                 │
        │  - 背景圖片                   │
        └───────────────────────────────┘
```

### 2.2 相機配置詳解

#### 相機 1: Main2DCamera (2D 主相機)

**用途**: 渲染所有 2D UI 元素、Reel、Symbol

```typescript
// 相機配置
Priority: 0 (最先渲染)
Clear Flags: SOLID_COLOR
Background: #000000 (黑色背景)
Projection: ORTHO (正交投影)
Visibility Layers: 
  ✓ UI_2D
  ✓ Default
  ✓ Symbol
  ✓ Background
Culling Mask: 不包含 3D、PostProcess 層
```

**場景節點結構**:
```
Canvas (2D Root)
├─ Camera_2D (Main2DCamera)
└─ BaseGame
   └─ Layer
      ├─ Background (Layer: UI_2D)
      ├─ Shake
      │  ├─ Reel (Layer: Default)
      │  │  ├─ reelMask
      │  │  │  └─ symbol (Layer: Symbol)
      │  │  └─ ReelRoot
      │  └─ Animation
      │     ├─ SymbolAnm
      │     └─ BigwinAnm
      └─ UI
         ├─ TopBar (Layer: UI_2D)
         ├─ BottomBar (Layer: UI_2D)
         └─ Buttons (Layer: UI_2D)
```

#### 相機 2: Effects3DCamera (3D 特效相機)

**用途**: 渲染所有 3D 特效、粒子、動畫

```typescript
// 相機配置
Priority: 5 (第二層渲染)
Clear Flags: DEPTH_ONLY (只清除深度，保留顏色)
Projection: PERSPECTIVE (透視投影)
FOV: 60
Near: 0.1
Far: 1000
Visibility Layers:
  ✓ Effect_3D
  ✓ Particle
  ✓ FX
Culling Mask: 只渲染 3D 層
```

**場景節點結構**:
```
Effects3DRoot
├─ Camera_3D (Effects3DCamera)
│  └─ Position: (0, 0, 500)
│     Rotation: (0, 0, 0)
│
└─ EffectsLayer (Layer: Effect_3D)
   ├─ CoinRain_Particle
   │  └─ ParticleSystem (3D)
   │
   ├─ LightningBolt_3D
   │  └─ Spine3D Animation
   │
   ├─ BigWin_3D_Glow
   │  ├─ MeshRenderer (發光特效)
   │  └─ Animation
   │
   └─ BonusEffect_Container
      ├─ 3D Model (寶箱、金幣等)
      └─ Trail Renderer (拖尾效果)
```

#### 相機 3: PostProcessCamera (後製相機)

**用途**: 全屏後處理效果（扭曲、色彩調整、Glow）

```typescript
// 相機配置
Priority: 10 (最後渲染)
Clear Flags: DEPTH_ONLY
Projection: ORTHO
Visibility Layers:
  ✓ PostProcess
Culling Mask: 只渲染後處理層
```

**實現方式**:

**方案 A: RenderTexture 雙相機系統** (推薦)

```
PostProcessRoot
├─ RenderCamera (Priority: -1)
│  └─ 渲染前面兩個相機的結果到 RenderTexture
│
├─ PostProcessCamera (Priority: 10)
│  └─ 讀取 RenderTexture，應用效果
│
└─ FullscreenPlane (Layer: PostProcess)
   └─ Sprite + CustomMaterial
      └─ DisplacementDistortion Shader
```

---

## 三、Layer 配置方案

### 3.1 Layer 定義

在 **Project Settings → Layers** 中定義：

| Layer ID | Layer Name | 用途 | 相機 |
|----------|------------|------|------|
| 0 | Default | 預設物件、Reel | 2D Camera |
| 1 | UI_2D | UI 元素、按鈕 | 2D Camera |
| 2 | Symbol | Reel Symbol | 2D Camera |
| 3 | Background | 背景圖片 | 2D Camera |
| 20 | Effect_3D | 3D 特效物件 | 3D Camera |
| 21 | Particle | 粒子系統 | 3D Camera |
| 22 | FX | 其他特效 | 3D Camera |
| 30 | PostProcess | 後處理專用 | Post Camera |

### 3.2 Layer 使用原則

```typescript
// 在程式碼中設置 Layer
import { Node, Layers } from 'cc';

// 設置為 2D UI Layer
node.layer = Layers.Enum.UI_2D;

// 設置為 3D 特效 Layer
effectNode.layer = 1 << 20; // Effect_3D

// 設置為後處理 Layer
postProcessNode.layer = 1 << 30; // PostProcess
```

---

## 四、完整場景結構

### 4.1 Hierarchy 結構

```
Scene
│
├─ 【2D 系統】Canvas (2D Root)
│  ├─ Camera_2D ────────────────── Main2DCamera (Priority: 0)
│  │  ├─ Component: Camera
│  │  ├─ Projection: ORTHO
│  │  ├─ Visibility: [UI_2D, Default, Symbol, Background]
│  │  └─ Clear Flags: SOLID_COLOR
│  │
│  └─ BaseGame
│     └─ Layer
│        ├─ Background_Layer (Layer: Background, Z: -100)
│        │  └─ bg_main.png
│        │
│        ├─ Shake_Layer (Layer: Default)
│        │  ├─ Reel (Z: 0)
│        │  │  ├─ reelMask
│        │  │  │  └─ symbol (Layer: Symbol, Z: 10)
│        │  │  └─ ReelRoot
│        │  │
│        │  └─ Animation (Z: 20)
│        │     ├─ SymbolAnm
│        │     ├─ SymbolScatter
│        │     └─ BigwinAnm
│        │
│        └─ UI_Layer (Layer: UI_2D, Z: 100)
│           ├─ TopBar
│           │  ├─ Balance
│           │  ├─ Bet
│           │  └─ Win
│           │
│           ├─ BottomBar
│           │  ├─ AutoPlay
│           │  ├─ Spin
│           │  └─ BetSettings
│           │
│           └─ Popups
│              ├─ FreeGamePopup
│              └─ BonusPopup
│
├─ 【3D 系統】Effects3DRoot
│  ├─ Camera_3D ────────────────── Effects3DCamera (Priority: 5)
│  │  ├─ Position: (0, 0, 500)
│  │  ├─ Component: Camera
│  │  ├─ Projection: PERSPECTIVE
│  │  ├─ FOV: 60
│  │  ├─ Visibility: [Effect_3D, Particle, FX]
│  │  ├─ Clear Flags: DEPTH_ONLY
│  │  └─ Blend Mode: ALPHA_BLEND
│  │
│  └─ EffectsContainer (Layer: Effect_3D)
│     ├─ ParticleEffects
│     │  ├─ CoinRain_Particle
│     │  │  └─ ParticleSystem (3D)
│     │  ├─ Sparkle_Particle
│     │  └─ FireWorks_Particle
│     │
│     ├─ 3D_Animations
│     │  ├─ BigWin_3D_Glow
│     │  │  ├─ MeshRenderer
│     │  │  └─ MaterialInstance (Emissive)
│     │  │
│     │  ├─ Bonus_Treasure_3D
│     │  │  ├─ 3D Model
│     │  │  └─ Animation
│     │  │
│     │  └─ FreeGame_Portal_3D
│     │     ├─ Spine3D
│     │     └─ Trail Renderer
│     │
│     └─ DynamicEffects
│        ├─ LightningBolt (程序化生成)
│        ├─ WaveEffect (Shader)
│        └─ RippleEffect
│
└─ 【後處理系統】PostProcessRoot
   ├─ RenderCamera ─────────────── Render to Texture (Priority: -1)
   │  ├─ Component: Camera
   │  ├─ Projection: ORTHO
   │  ├─ Visibility: [所有前面的 Layers]
   │  ├─ Target Texture: SceneRT.rt
   │  └─ Clear Flags: SOLID_COLOR
   │
   ├─ PostProcessCamera ─────────── Post Effects (Priority: 10)
   │  ├─ Component: Camera
   │  ├─ Component: CameraDisplacementEffect2D
   │  │  ├─ Render Camera: RenderCamera
   │  │  ├─ Fullscreen Sprite: FullscreenSprite
   │  │  ├─ Render Texture Width: 1024
   │  │  └─ Render Texture Height: 1024
   │  ├─ Projection: ORTHO
   │  ├─ Visibility: [PostProcess]
   │  └─ Clear Flags: DEPTH_ONLY
   │
   └─ FullscreenSprite (Layer: PostProcess)
      ├─ Component: Sprite
      ├─ Component: Widget (全屏)
      │  ├─ Align: All Edges
      │  └─ Margin: 0
      └─ Custom Material: DisplacementDistortion.mtl
         ├─ Shader: DisplacementDistortion
         ├─ Property: mainTexture (來自 RenderCamera)
         ├─ Property: displacementMap
         ├─ Property: strength
         └─ Property: frequency
```

---

## 五、程式碼實現

### 5.1 相機管理器

```typescript
// CameraManager.ts
import { _decorator, Component, Camera, Node, Layers, log } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 多相機系統管理器
 * 統一管理 2D、3D、後處理相機
 */
@ccclass('CameraManager')
export class CameraManager extends Component {
    
    // 相機引用
    @property({ type: Camera, tooltip: '2D 主相機' })
    camera2D: Camera | null = null;
    
    @property({ type: Camera, tooltip: '3D 特效相機' })
    camera3D: Camera | null = null;
    
    @property({ type: Camera, tooltip: '後處理相機' })
    cameraPostProcess: Camera | null = null;
    
    @property({ type: Camera, tooltip: 'RenderTexture 相機' })
    cameraRender: Camera | null = null;
    
    // 配置選項
    @property({ tooltip: '啟用 3D 特效' })
    enable3DEffects: boolean = true;
    
    @property({ tooltip: '啟用後處理' })
    enablePostProcess: boolean = true;
    
    @property({ tooltip: '動態調整相機優先級' })
    dynamicPriority: boolean = true;
    
    // 靜態實例（單例模式）
    private static instance: CameraManager | null = null;
    
    static getInstance(): CameraManager | null {
        return CameraManager.instance;
    }
    
    onLoad() {
        // 設置單例
        if (CameraManager.instance) {
            log('[CameraManager] 警告: 場景中存在多個 CameraManager');
        }
        CameraManager.instance = this;
        
        // 自動查找相機
        this.autoFindCameras();
        
        // 初始化相機設置
        this.initializeCameras();
    }
    
    /**
     * 自動查找場景中的相機
     */
    private autoFindCameras(): void {
        if (!this.camera2D) {
            const node2D = this.node.scene.getChildByPath('Canvas/Camera_2D');
            if (node2D) {
                this.camera2D = node2D.getComponent(Camera);
            }
        }
        
        if (!this.camera3D) {
            const node3D = this.node.scene.getChildByPath('Effects3DRoot/Camera_3D');
            if (node3D) {
                this.camera3D = node3D.getComponent(Camera);
            }
        }
        
        if (!this.cameraPostProcess) {
            const nodePost = this.node.scene.getChildByPath('PostProcessRoot/PostProcessCamera');
            if (nodePost) {
                this.cameraPostProcess = nodePost.getComponent(Camera);
            }
        }
        
        if (!this.cameraRender) {
            const nodeRender = this.node.scene.getChildByPath('PostProcessRoot/RenderCamera');
            if (nodeRender) {
                this.cameraRender = nodeRender.getComponent(Camera);
            }
        }
    }
    
    /**
     * 初始化所有相機的設置
     */
    private initializeCameras(): void {
        log('[CameraManager] 初始化相機系統...');
        
        // 配置 2D 相機
        if (this.camera2D) {
            this.setup2DCamera(this.camera2D);
            log('[CameraManager] ✓ 2D 相機配置完成');
        }
        
        // 配置 3D 相機
        if (this.camera3D) {
            this.setup3DCamera(this.camera3D);
            log('[CameraManager] ✓ 3D 相機配置完成');
        }
        
        // 配置後處理相機
        if (this.cameraPostProcess && this.cameraRender) {
            this.setupPostProcessCamera(this.cameraRender, this.cameraPostProcess);
            log('[CameraManager] ✓ 後處理相機配置完成');
        }
        
        log('[CameraManager] 相機系統初始化完成');
    }
    
    /**
     * 配置 2D 相機
     */
    private setup2DCamera(camera: Camera): void {
        camera.priority = 0;
        camera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
        camera.projection = Camera.ProjectionType.ORTHO;
        
        // 設置可見層
        camera.visibility = 
            (1 << Layers.Enum.UI_2D) |
            (1 << Layers.Enum.DEFAULT) |
            (1 << 2) | // Symbol Layer
            (1 << 3);  // Background Layer
    }
    
    /**
     * 配置 3D 相機
     */
    private setup3DCamera(camera: Camera): void {
        camera.priority = 5;
        camera.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
        camera.projection = Camera.ProjectionType.PERSPECTIVE;
        camera.fov = 60;
        camera.near = 0.1;
        camera.far = 1000;
        
        // 設置可見層（3D 專用層）
        camera.visibility = 
            (1 << 20) | // Effect_3D Layer
            (1 << 21) | // Particle Layer
            (1 << 22);  // FX Layer
    }
    
    /**
     * 配置後處理相機
     */
    private setupPostProcessCamera(renderCamera: Camera, postCamera: Camera): void {
        // RenderCamera 設置
        renderCamera.priority = -1;
        renderCamera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
        renderCamera.projection = Camera.ProjectionType.ORTHO;
        
        // 渲染所有前面的層
        renderCamera.visibility = 
            (1 << Layers.Enum.UI_2D) |
            (1 << Layers.Enum.DEFAULT) |
            (1 << 2) | (1 << 3) |  // Symbol, Background
            (1 << 20) | (1 << 21) | (1 << 22);  // 3D Layers
        
        // PostProcessCamera 設置
        postCamera.priority = 10;
        postCamera.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
        postCamera.projection = Camera.ProjectionType.ORTHO;
        postCamera.visibility = (1 << 30); // PostProcess Layer only
    }
    
    /**
     * 動態開關 3D 特效
     */
    public toggle3DEffects(enabled: boolean): void {
        if (this.camera3D) {
            this.camera3D.enabled = enabled;
            this.enable3DEffects = enabled;
            log(`[CameraManager] 3D 特效已${enabled ? '啟用' : '停用'}`);
        }
    }
    
    /**
     * 動態開關後處理
     */
    public togglePostProcess(enabled: boolean): void {
        if (this.cameraPostProcess && this.cameraRender) {
            this.cameraPostProcess.enabled = enabled;
            this.cameraRender.enabled = enabled;
            this.enablePostProcess = enabled;
            log(`[CameraManager] 後處理已${enabled ? '啟用' : '停用'}`);
        }
    }
    
    /**
     * 根據效能動態調整
     * @param quality 品質等級 0-2 (低、中、高)
     */
    public setQualityLevel(quality: number): void {
        switch (quality) {
            case 0: // 低品質
                this.toggle3DEffects(false);
                this.togglePostProcess(false);
                break;
            case 1: // 中品質
                this.toggle3DEffects(true);
                this.togglePostProcess(false);
                break;
            case 2: // 高品質
                this.toggle3DEffects(true);
                this.togglePostProcess(true);
                break;
        }
        log(`[CameraManager] 品質等級設定為: ${['低', '中', '高'][quality]}`);
    }
    
    /**
     * 取得 2D 世界座標到螢幕座標
     */
    public worldToScreen2D(worldPos: Vec3): Vec3 {
        if (!this.camera2D) return worldPos;
        
        const screenPos = new Vec3();
        this.camera2D.convertToUINode(worldPos, this.node, screenPos);
        return screenPos;
    }
    
    /**
     * 取得 3D 世界座標到螢幕座標
     */
    public worldToScreen3D(worldPos: Vec3): Vec3 {
        if (!this.camera3D) return worldPos;
        
        const screenPos = new Vec3();
        this.camera3D.worldToScreen(worldPos, screenPos);
        return screenPos;
    }
    
    onDestroy() {
        if (CameraManager.instance === this) {
            CameraManager.instance = null;
        }
    }
}
```

### 5.2 3D 特效管理器

```typescript
// Effects3DManager.ts
import { _decorator, Component, Node, ParticleSystem, Animation, Vec3, macro } from 'cc';
import { CameraManager } from './CameraManager';

const { ccclass, property } = _decorator;

/**
 * 3D 特效管理器
 * 管理所有 3D 特效的生成、播放、回收
 */
@ccclass('Effects3DManager')
export class Effects3DManager extends Component {
    
    @property({ type: Node, tooltip: '3D 特效容器' })
    effectsContainer: Node | null = null;
    
    @property({ type: [Node], tooltip: '預製體池' })
    effectPrefabs: Node[] = [];
    
    // 特效池
    private effectPool: Map<string, Node[]> = new Map();
    private activeEffects: Node[] = [];
    
    // 單例
    private static instance: Effects3DManager | null = null;
    
    static getInstance(): Effects3DManager | null {
        return Effects3DManager.instance;
    }
    
    onLoad() {
        Effects3DManager.instance = this;
        this.initializePool();
    }
    
    /**
     * 初始化特效池
     */
    private initializePool(): void {
        this.effectPrefabs.forEach(prefab => {
            const poolArray: Node[] = [];
            // 預先生成 3 個實例
            for (let i = 0; i < 3; i++) {
                const instance = instantiate(prefab);
                instance.active = false;
                instance.setParent(this.effectsContainer);
                poolArray.push(instance);
            }
            this.effectPool.set(prefab.name, poolArray);
        });
    }
    
    /**
     * 播放 3D 特效
     * @param effectName 特效名稱
     * @param position 世界座標位置
     * @param autoRecycle 是否自動回收
     */
    public playEffect(effectName: string, position: Vec3, autoRecycle: boolean = true): Node | null {
        const effect = this.getEffectFromPool(effectName);
        if (!effect) {
            console.warn(`[Effects3DManager] 找不到特效: ${effectName}`);
            return null;
        }
        
        // 設置位置
        effect.setWorldPosition(position);
        effect.active = true;
        
        // 播放粒子系統
        const particle = effect.getComponent(ParticleSystem);
        if (particle) {
            particle.play();
            
            // 自動回收
            if (autoRecycle) {
                const duration = particle.duration;
                this.scheduleOnce(() => {
                    this.recycleEffect(effect);
                }, duration);
            }
        }
        
        // 播放動畫
        const anim = effect.getComponent(Animation);
        if (anim) {
            anim.play();
            
            if (autoRecycle) {
                const clip = anim.defaultClip;
                if (clip) {
                    this.scheduleOnce(() => {
                        this.recycleEffect(effect);
                    }, clip.duration);
                }
            }
        }
        
        this.activeEffects.push(effect);
        return effect;
    }
    
    /**
     * 在 2D 位置播放 3D 特效
     * @param effectName 特效名稱
     * @param position2D 2D 世界座標
     * @param depth 3D 深度（相機距離）
     */
    public playEffectAt2DPosition(effectName: string, position2D: Vec3, depth: number = 0): Node | null {
        // 將 2D 座標轉換為 3D 空間
        const cameraManager = CameraManager.getInstance();
        if (!cameraManager) return null;
        
        // 計算 3D 位置
        const position3D = new Vec3(position2D.x, position2D.y, depth);
        
        return this.playEffect(effectName, position3D);
    }
    
    /**
     * 從池中獲取特效
     */
    private getEffectFromPool(effectName: string): Node | null {
        const pool = this.effectPool.get(effectName);
        if (!pool) return null;
        
        // 找到不活躍的實例
        let effect = pool.find(e => !e.active);
        
        // 如果池中沒有，創建新實例
        if (!effect) {
            const prefab = this.effectPrefabs.find(p => p.name === effectName);
            if (prefab) {
                effect = instantiate(prefab);
                effect.setParent(this.effectsContainer);
                pool.push(effect);
            }
        }
        
        return effect || null;
    }
    
    /**
     * 回收特效到池
     */
    private recycleEffect(effect: Node): void {
        effect.active = false;
        
        // 從活躍列表移除
        const index = this.activeEffects.indexOf(effect);
        if (index >= 0) {
            this.activeEffects.splice(index, 1);
        }
        
        // 停止粒子和動畫
        const particle = effect.getComponent(ParticleSystem);
        if (particle) particle.stop();
        
        const anim = effect.getComponent(Animation);
        if (anim) anim.stop();
    }
    
    /**
     * 停止所有特效
     */
    public stopAllEffects(): void {
        this.activeEffects.forEach(effect => {
            this.recycleEffect(effect);
        });
        this.activeEffects = [];
    }
    
    onDestroy() {
        this.stopAllEffects();
        Effects3DManager.instance = null;
    }
}
```

### 5.3 使用範例

```typescript
// 在遊戲邏輯中使用
import { CameraManager } from './CameraManager';
import { Effects3DManager } from './Effects3DManager';

// 在 BigWin 觸發時播放 3D 特效
public onBigWinTriggered(symbolPosition: Vec3): void {
    const effectManager = Effects3DManager.getInstance();
    if (effectManager) {
        // 在 Symbol 位置播放 3D 粒子特效
        effectManager.playEffectAt2DPosition(
            'CoinRain_Particle',  // 特效名稱
            symbolPosition,        // 2D 位置
            100                    // 3D 深度
        );
    }
}

// 動態調整相機品質
public onQualitySettingChanged(quality: number): void {
    const cameraManager = CameraManager.getInstance();
    if (cameraManager) {
        cameraManager.setQualityLevel(quality);
    }
}

// 切換後處理效果
public toggleDistortionEffect(enabled: boolean): void {
    const cameraManager = CameraManager.getInstance();
    if (cameraManager) {
        cameraManager.togglePostProcess(enabled);
    }
}
```

---

## 六、效能優化策略

### 6.1 相機效能優化

```typescript
/**
 * 相機效能優化管理器
 */
export class CameraPerformanceOptimizer {
    
    /**
     * 根據設備效能動態調整
     */
    public static autoOptimize(): void {
        const isMobile = sys.isMobile;
        const isLowEnd = this.detectLowEndDevice();
        
        const cameraManager = CameraManager.getInstance();
        if (!cameraManager) return;
        
        if (isLowEnd) {
            // 低階設備：關閉 3D 和後處理
            cameraManager.setQualityLevel(0);
            this.reduceRenderTextureSize();
        } else if (isMobile) {
            // 移動設備：開啟 3D，關閉後處理
            cameraManager.setQualityLevel(1);
        } else {
            // PC：全開
            cameraManager.setQualityLevel(2);
        }
    }
    
    /**
     * 偵測低階設備
     */
    private static detectLowEndDevice(): boolean {
        // 根據設備資訊判斷
        const gl = sys.capabilities;
        const maxTextureSize = gl['maxTextureSize'] || 4096;
        
        // 低於 2048 判定為低階
        return maxTextureSize < 2048;
    }
    
    /**
     * 降低 RenderTexture 大小
     */
    private static reduceRenderTextureSize(): void {
        const postEffect = find('PostProcessRoot/PostProcessCamera')
            ?.getComponent(CameraDisplacementEffect2D);
        
        if (postEffect) {
            postEffect.setRenderQuality(512, 512);
        }
    }
}
```

### 6.2 Culling 優化

```typescript
/**
 * 視錐剔除優化
 */
export class CullingOptimizer {
    
    /**
     * 設置物件的剔除距離
     */
    public static setObjectCulling(node: Node, maxDistance: number): void {
        // 距離相機超過 maxDistance 就隱藏
        const camera = CameraManager.getInstance()?.camera3D;
        if (!camera) return;
        
        const cameraPos = camera.node.worldPosition;
        const objectPos = node.worldPosition;
        const distance = Vec3.distance(cameraPos, objectPos);
        
        node.active = distance <= maxDistance;
    }
    
    /**
     * 批次處理多個物件的剔除
     */
    public static batchCulling(nodes: Node[], maxDistance: number): void {
        nodes.forEach(node => this.setObjectCulling(node, maxDistance));
    }
}
```

### 6.3 Draw Call 優化

| 優化項目 | 建議 |
|---------|------|
| **合併材質** | 相同 Shader 的物件使用相同材質實例 |
| **靜態批次** | 標記靜態物件為 Static |
| **動態批次** | 小於 300 頂點的物件自動批次 |
| **Layer 分離** | 不同相機渲染不同 Layer，避免重複渲染 |
| **UI 優化** | 使用 UIBatcher，減少 UI Draw Call |

---

## 七、常見問題與解決

### 7.1 3D 特效與 2D UI 對齊問題

**問題**: 3D 特效無法精確對齊 2D Symbol

**解決方案**:
```typescript
// 使用座標轉換
public align3DEffectTo2DSymbol(symbol2DNode: Node, effect3DNode: Node): void {
    const cameraManager = CameraManager.getInstance();
    
    // 1. 取得 2D 世界座標
    const pos2D = symbol2DNode.worldPosition;
    
    // 2. 計算螢幕座標
    const screenPos = cameraManager.worldToScreen2D(pos2D);
    
    // 3. 轉換回 3D 相機空間
    const camera3D = cameraManager.camera3D;
    const ray = camera3D.screenPointToRay(screenPos.x, screenPos.y);
    
    // 4. 設置 3D 物件位置（在相機前方固定距離）
    const depth = 100;
    const pos3D = new Vec3(
        ray.o.x + ray.d.x * depth,
        ray.o.y + ray.d.y * depth,
        ray.o.z + ray.d.z * depth
    );
    
    effect3DNode.setWorldPosition(pos3D);
}
```

### 7.2 UI 互動被 3D 層阻擋

**問題**: UI 按鈕無法點擊

**解決方案**:
1. 確保 3D 相機使用 `DEPTH_ONLY` 清除模式
2. UI 使用獨立的 Layer
3. 設置 3D 相機的 Visibility 不包含 UI Layer

```typescript
// 在 CameraManager 中
camera3D.clearFlags = Camera.ClearFlag.DEPTH_ONLY;
camera3D.visibility = (1 << 20) | (1 << 21); // 只渲染 3D 層
```

### 7.3 後處理影響 UI

**問題**: 後處理扭曲了 UI 元素

**解決方案 A**: UI 獨立渲染
```
創建第四個 UI Camera (Priority: 15)
只渲染 UI Layer
不經過 RenderTexture
```

**解決方案 B**: 調整 RenderCamera
```typescript
// RenderCamera 不渲染 UI
renderCamera.visibility &= ~(1 << Layers.Enum.UI_2D);

// UI 直接由 PostProcessCamera 渲染
postProcessCamera.visibility |= (1 << Layers.Enum.UI_2D);
```

### 7.4 效能問題

**症狀**: FPS 降低，卡頓

**診斷步驟**:
1. 檢查 Draw Call 數量（Stats 面板）
2. 檢查 RenderTexture 解析度
3. 檢查 3D 粒子數量
4. 使用 Profiler 分析

**優化方案**:
```typescript
// 根據 FPS 動態調整
let fpsThreshold = 30;

update(dt: number) {
    const fps = 1 / dt;
    
    if (fps < fpsThreshold) {
        // 降級效果
        CameraManager.getInstance()?.toggle3DEffects(false);
        CameraManager.getInstance()?.togglePostProcess(false);
    }
}
```

---

## 八、實施步驟

### 階段一：基礎架構（1-2 天）

**步驟 1**: 配置 Layers
- [ ] Project Settings → Layers
- [ ] 創建所有需要的 Layer（UI_2D, Symbol, Effect_3D, Particle, PostProcess）

**步驟 2**: 重新組織場景結構
- [ ] 創建 Canvas (2D Root)
- [ ] 創建 Effects3DRoot
- [ ] 創建 PostProcessRoot
- [ ] 移動現有節點到正確位置

**步驟 3**: 配置相機
- [ ] 設置 Main2DCamera
- [ ] 設置 Effects3DCamera
- [ ] 測試基本渲染

### 階段二：3D 系統整合（2-3 天）

**步驟 4**: 創建 3D 特效
- [ ] 建立 3D 粒子系統
- [ ] 建立 3D 模型和動畫
- [ ] 設置正確的 Layer

**步驟 5**: 實現 Effects3DManager
- [ ] 特效池系統
- [ ] 座標轉換邏輯
- [ ] 測試 3D 特效播放

**步驟 6**: 整合到遊戲邏輯
- [ ] BigWin 特效
- [ ] FreeGame 特效
- [ ] Bonus 特效

### 階段三：後處理系統（1-2 天）

**步驟 7**: 設置 RenderTexture 系統
- [ ] 創建 RenderCamera
- [ ] 創建 PostProcessCamera
- [ ] 創建 FullscreenSprite

**步驟 8**: 實現後處理效果
- [ ] Displacement Distortion
- [ ] 其他效果（可選）

**步驟 9**: 優化和測試
- [ ] 效能測試
- [ ] 移動設備測試
- [ ] UI 互動測試

### 階段四：優化和完善（1-2 天）

**步驟 10**: 效能優化
- [ ] 實現 CameraPerformanceOptimizer
- [ ] 實現 CullingOptimizer
- [ ] Draw Call 優化

**步驟 11**: 測試和修復
- [ ] 完整功能測試
- [ ] Bug 修復
- [ ] 文件更新

---

## 九、效能基準

### 9.1 目標 FPS

| 平台 | 目標 FPS | 可接受 FPS |
|------|----------|-----------|
| PC | 60 | 50+ |
| 高階手機 | 60 | 50+ |
| 中階手機 | 30-60 | 30+ |
| 低階手機 | 30 | 25+ |

### 9.2 Draw Call 目標

| 場景 | 目標 Draw Call | 最大 Draw Call |
|------|---------------|---------------|
| 正常遊戲 | < 50 | 100 |
| BigWin | < 80 | 150 |
| FreeGame | < 100 | 180 |

### 9.3 記憶體使用

| 資源 | 建議大小 |
|------|----------|
| RenderTexture | 1024x1024 (PC), 512x512 (Mobile) |
| 3D 粒子 | 最多同時 5 個系統 |
| 材質實例 | 共享材質，減少實例化 |

---

## 十、總結

### 10.1 架構優勢

✅ **清晰分離**: 2D、3D、後處理完全分離，互不干擾
✅ **高度可控**: 每個系統可獨立開關和調整
✅ **效能彈性**: 可根據設備動態調整品質
✅ **易於維護**: 模組化設計，易於擴展和維護
✅ **向後兼容**: 不影響現有 2D 系統

### 10.2 技術要點

🔑 **Priority 控制**: 使用相機優先級控制渲染順序
🔑 **Layer 隔離**: 使用 Layer 系統隔離不同類型物件
🔑 **座標轉換**: 正確處理 2D 和 3D 座標轉換
🔑 **深度管理**: DEPTH_ONLY 避免覆蓋前面的渲染
🔑 **效能優化**: 動態調整品質，確保流暢運行

### 10.3 後續擴展

🚀 **更多 3D 特效**: 天氣效果、環境光、動態陰影
🚀 **進階後處理**: Bloom、Color Grading、Motion Blur
🚀 **VR/AR 支援**: 架構已支援立體渲染
🚀 **特效編輯器**: 視覺化特效配置工具

---

## 十一、參考資料

### 11.1 相關文件

- [LangBunder-Optimization-Analysis.md](./LangBunder-Optimization-Analysis.md) - 語言資源優化分析
- [Cocos-Creator-Depth-Effects-Implementation-Guide.md](./Cocos-Creator-Depth-Effects-Implementation-Guide.md) - 立體效果實現指南
- [Cocos-Creator-Slot-Game-Depth-Effects.md](./Cocos-Creator-Slot-Game-Depth-Effects.md) - Slot 遊戲深度效果
- [CameraEffect_Setup_Guide.md](../game169/assets/effect/displacementDistor/CameraEffect_Setup_Guide.md) - 後處理設置指南

### 11.2 Cocos Creator 官方文件

- [Camera 組件](https://docs.cocos.com/creator/manual/zh/render/camera.html)
- [Layers 系統](https://docs.cocos.com/creator/manual/zh/concepts/scene/node-component.html#layers)
- [RenderTexture](https://docs.cocos.com/creator/manual/zh/render/render-texture.html)
- [後處理效果](https://docs.cocos.com/creator/manual/zh/render/post-processing.html)

### 11.3 範例專案

查看 `game169/assets/effect/displacementDistor/` 目錄中的完整後處理效果實現。

---

**文件版本**: 1.0  
**最後更新**: 2025-10-15  
**作者**: AI Assistant  
**審核狀態**: 待審核  
**實施狀態**: 設計階段
