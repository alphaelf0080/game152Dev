import { _decorator, Component, Material, Sprite, Widget, Camera, RenderTexture, SpriteFrame, find, view, Size } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 相機後處理 - 程序化 Radio Wave 效果
 * 全屏應用程序化波形扭曲效果
 */
@ccclass('CameraProceduralWaveEffect')
export class CameraProceduralWaveEffect extends Component {
    @property({ tooltip: '目標相機節點路徑', multiline: false })
    cameraPath: string = 'Camera';

    @property({ tooltip: 'RenderTexture 寬度（0=自動）' })
    renderWidth: number = 0;

    @property({ tooltip: 'RenderTexture 高度（0=自動）' })
    renderHeight: number = 0;

    // ===== Wave 效果參數 =====
    @property({ tooltip: '位移強度', range: [0, 0.5, 0.01], slide: true })
    displacementStrength: number = 0.08;

    @property({ tooltip: '波形內半徑', range: [0, 1, 0.01], slide: true })
    waveInnerRadius: number = 0.2;

    @property({ tooltip: '波形寬度', range: [0.01, 1, 0.01], slide: true })
    waveWidth: number = 0.3;

    @property({ tooltip: '波形速度', range: [0, 5, 0.1], slide: true })
    waveSpeed: number = 1.0;

    @property({ tooltip: '波形頻率', range: [1, 20, 0.5], slide: true })
    waveFrequency: number = 5.0;

    @property({ tooltip: '波形振幅', range: [0, 2, 0.1], slide: true })
    waveAmplitude: number = 0.5;

    @property({ tooltip: '波形扭曲度', range: [0, 2, 0.1], slide: true })
    waveDistortion: number = 0.5;

    @property({ tooltip: '波形湍流', range: [0, 1, 0.05], slide: true })
    waveTurbulence: number = 0.0;

    // 預設效果選擇
    @property({ 
        type: String,
        tooltip: '預設效果：none, smooth, complex, water, shockwave, chaos'
    })
    presetEffect: string = 'none';

    private camera: Camera | null = null;
    private sprite: Sprite | null = null;
    private material: Material | null = null;
    private renderTexture: RenderTexture | null = null;

    onLoad() {
        this.setupRenderTexture();
        this.setupSprite();
        this.setupMaterial();
        this.applyPreset();
    }

    /**
     * 設置 RenderTexture
     */
    private setupRenderTexture() {
        // 獲取相機
        const cameraNode = find(this.cameraPath);
        if (!cameraNode) {
            console.error(`[CameraProceduralWaveEffect] 找不到相機: ${this.cameraPath}`);
            return;
        }

        this.camera = cameraNode.getComponent(Camera);
        if (!this.camera) {
            console.error('[CameraProceduralWaveEffect] 節點沒有 Camera 組件');
            return;
        }

        // 創建 RenderTexture
        this.renderTexture = new RenderTexture();
        
        // 獲取畫面大小
        const visibleSize = view.getVisibleSize();
        const width = this.renderWidth > 0 ? this.renderWidth : visibleSize.width;
        const height = this.renderHeight > 0 ? this.renderHeight : visibleSize.height;

        this.renderTexture.reset({
            width: width,
            height: height
        });

        // 將 RenderTexture 設置給相機
        this.camera.targetTexture = this.renderTexture;

        console.log(`[CameraProceduralWaveEffect] RenderTexture 創建: ${width}x${height}`);
    }

    /**
     * 設置全屏 Sprite
     */
    private setupSprite() {
        // 添加 Sprite 組件
        this.sprite = this.node.getComponent(Sprite);
        if (!this.sprite) {
            this.sprite = this.node.addComponent(Sprite);
        }

        // 添加 Widget 組件實現全屏
        let widget = this.node.getComponent(Widget);
        if (!widget) {
            widget = this.node.addComponent(Widget);
        }

        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;
        widget.updateAlignment();

        // 創建 SpriteFrame 並設置 RenderTexture
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = this.renderTexture!;
        this.sprite.spriteFrame = spriteFrame;

        console.log('[CameraProceduralWaveEffect] 全屏 Sprite 設置完成');
    }

    /**
     * 設置材質
     */
    private setupMaterial() {
        if (!this.sprite) return;

        // 創建材質
        this.material = new Material();
        this.material.initialize({
            effectName: 'DisplacementDistortion_ProceduralWave'
        });

        // 應用到 Sprite
        this.sprite.customMaterial = this.material;

        // 設置初始參數
        this.updateAllParameters();

        console.log('[CameraProceduralWaveEffect] 材質設置完成');
    }

    /**
     * 更新所有材質參數
     */
    private updateAllParameters() {
        if (!this.material) return;

        this.material.setProperty('useProceduralWave', 1);
        this.material.setProperty('displacementStrength', this.displacementStrength);
        this.material.setProperty('waveInnerRadius', this.waveInnerRadius);
        this.material.setProperty('waveWidth', this.waveWidth);
        this.material.setProperty('waveSpeed', this.waveSpeed);
        this.material.setProperty('waveFrequency', this.waveFrequency);
        this.material.setProperty('waveAmplitude', this.waveAmplitude);
        this.material.setProperty('waveDistortion', this.waveDistortion);
        this.material.setProperty('waveTurbulence', this.waveTurbulence);
    }

    /**
     * 應用預設效果
     */
    private applyPreset() {
        switch (this.presetEffect.toLowerCase()) {
            case 'smooth':
                this.applySmoothRipple();
                break;
            case 'complex':
                this.applyComplexWave();
                break;
            case 'water':
                this.applyWaterRipple();
                break;
            case 'shockwave':
                this.applyShockwave();
                break;
            case 'chaos':
                this.applyChaoticTurbulence();
                break;
            default:
                // 使用當前設置的參數
                this.updateAllParameters();
                break;
        }
    }

    // ===== 預設效果方法 =====

    public applySmoothRipple() {
        this.displacementStrength = 0.05;
        this.waveInnerRadius = 0.1;
        this.waveWidth = 0.4;
        this.waveSpeed = 0.5;
        this.waveFrequency = 3;
        this.waveAmplitude = 0.3;
        this.waveDistortion = 0.2;
        this.waveTurbulence = 0;
        this.updateAllParameters();
    }

    public applyComplexWave() {
        this.displacementStrength = 0.15;
        this.waveInnerRadius = 0.2;
        this.waveWidth = 0.3;
        this.waveSpeed = 2.0;
        this.waveFrequency = 8;
        this.waveAmplitude = 0.7;
        this.waveDistortion = 1.0;
        this.waveTurbulence = 0.3;
        this.updateAllParameters();
    }

    public applyWaterRipple() {
        this.displacementStrength = 0.08;
        this.waveInnerRadius = 0.3;
        this.waveWidth = 0.2;
        this.waveSpeed = 1.5;
        this.waveFrequency = 12;
        this.waveAmplitude = 0.4;
        this.waveDistortion = 0.8;
        this.waveTurbulence = 0.1;
        this.updateAllParameters();
    }

    public applyShockwave() {
        this.displacementStrength = 0.25;
        this.waveInnerRadius = 0.05;
        this.waveWidth = 0.15;
        this.waveSpeed = 3.0;
        this.waveFrequency = 1;
        this.waveAmplitude = 1.5;
        this.waveDistortion = 0.1;
        this.waveTurbulence = 0;
        this.updateAllParameters();
    }

    public applyChaoticTurbulence() {
        this.displacementStrength = 0.12;
        this.waveInnerRadius = 0.15;
        this.waveWidth = 0.5;
        this.waveSpeed = 1.0;
        this.waveFrequency = 6;
        this.waveAmplitude = 0.6;
        this.waveDistortion = 1.5;
        this.waveTurbulence = 0.8;
        this.updateAllParameters();
    }

    onDestroy() {
        // 清理資源
        if (this.renderTexture) {
            this.renderTexture.destroy();
        }
        if (this.camera) {
            this.camera.targetTexture = null;
        }
    }
}
