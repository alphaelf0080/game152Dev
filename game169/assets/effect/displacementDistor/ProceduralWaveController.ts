import { _decorator, Component, Material, Sprite, Camera, RenderTexture, SpriteFrame, find } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 程序化 Radio Wave 效果控制器
 * 展示如何使用 DisplacementDistortion_ProceduralWave Effect
 */
@ccclass('ProceduralWaveController')
export class ProceduralWaveController extends Component {
    @property({ tooltip: '使用程序化波形（而非位移貼圖）' })
    useProceduralWave: boolean = true;

    // ===== 基礎參數 =====
    @property({ tooltip: '位移強度', range: [0, 1, 0.01], slide: true })
    displacementStrength: number = 0.1;

    // ===== Radio Wave 參數 =====
    @property({ tooltip: '波形內半徑', range: [0, 1, 0.01], slide: true })
    waveInnerRadius: number = 0.2;

    @property({ tooltip: '波形寬度', range: [0.01, 1, 0.01], slide: true })
    waveWidth: number = 0.3;

    @property({ tooltip: '波形速度', range: [0, 5, 0.1], slide: true })
    waveSpeed: number = 1.0;

    @property({ tooltip: '波形頻率（周向波的數量）', range: [1, 20, 0.5], slide: true })
    waveFrequency: number = 5.0;

    @property({ tooltip: '波形振幅', range: [0, 2, 0.1], slide: true })
    waveAmplitude: number = 0.5;

    @property({ tooltip: '波形扭曲度', range: [0, 2, 0.1], slide: true })
    waveDistortion: number = 0.5;

    @property({ tooltip: '波形湍流強度', range: [0, 1, 0.05], slide: true })
    waveTurbulence: number = 0.0;

    // ===== 動畫控制 =====
    @property({ tooltip: '啟用自動動畫' })
    enableAutoAnimation: boolean = false;

    @property({ tooltip: '動畫週期（秒）' })
    animationCycle: number = 3.0;

    // 私有變量
    private material: Material | null = null;
    private sprite: Sprite | null = null;
    private animationTime: number = 0;

    onLoad() {
        this.sprite = this.getComponent(Sprite);
        
        if (!this.sprite) {
            console.error('[ProceduralWaveController] 需要 Sprite 組件！');
            return;
        }

        this.initializeMaterial();
    }

    /**
     * 初始化材質
     */
    private initializeMaterial() {
        // 創建材質
        this.material = new Material();
        this.material.initialize({
            effectName: 'DisplacementDistortion_ProceduralWave'
        });

        // 應用到 Sprite
        this.sprite!.customMaterial = this.material;

        // 設置初始參數
        this.updateAllParameters();
    }

    /**
     * 更新所有材質參數
     */
    private updateAllParameters() {
        if (!this.material) return;

        // 基礎參數
        this.material.setProperty('displacementStrength', this.displacementStrength);
        this.material.setProperty('useProceduralWave', this.useProceduralWave ? 1 : 0);

        // Wave 參數
        this.material.setProperty('waveInnerRadius', this.waveInnerRadius);
        this.material.setProperty('waveWidth', this.waveWidth);
        this.material.setProperty('waveSpeed', this.waveSpeed);
        this.material.setProperty('waveFrequency', this.waveFrequency);
        this.material.setProperty('waveAmplitude', this.waveAmplitude);
        this.material.setProperty('waveDistortion', this.waveDistortion);
        this.material.setProperty('waveTurbulence', this.waveTurbulence);
    }

    update(deltaTime: number) {
        if (!this.enableAutoAnimation || !this.material) return;

        this.animationTime += deltaTime;
        const t = (this.animationTime % this.animationCycle) / this.animationCycle;
        const phase = t * Math.PI * 2;

        // 動態調整內半徑（呼吸效果）
        const radius = 0.2 + Math.sin(phase) * 0.1;
        this.material.setProperty('waveInnerRadius', radius);

        // 動態調整頻率（變化圖案）
        const freq = 5 + Math.sin(phase * 0.5) * 2;
        this.material.setProperty('waveFrequency', freq);
    }

    // ===== 公共方法 - 預設效果 =====

    /**
     * 應用柔和波紋效果
     */
    public applySmoothRipple() {
        this.useProceduralWave = true;
        this.waveInnerRadius = 0.1;
        this.waveWidth = 0.4;
        this.waveSpeed = 0.5;
        this.waveFrequency = 3;
        this.waveAmplitude = 0.3;
        this.waveDistortion = 0.2;
        this.waveTurbulence = 0;
        this.displacementStrength = 0.05;
        this.updateAllParameters();
    }

    /**
     * 應用快速複雜波形
     */
    public applyComplexWave() {
        this.useProceduralWave = true;
        this.waveInnerRadius = 0.2;
        this.waveWidth = 0.3;
        this.waveSpeed = 2.0;
        this.waveFrequency = 8;
        this.waveAmplitude = 0.7;
        this.waveDistortion = 1.0;
        this.waveTurbulence = 0.3;
        this.displacementStrength = 0.15;
        this.updateAllParameters();
    }

    /**
     * 應用水波紋效果
     */
    public applyWaterRipple() {
        this.useProceduralWave = true;
        this.waveInnerRadius = 0.3;
        this.waveWidth = 0.2;
        this.waveSpeed = 1.5;
        this.waveFrequency = 12;
        this.waveAmplitude = 0.4;
        this.waveDistortion = 0.8;
        this.waveTurbulence = 0.1;
        this.displacementStrength = 0.08;
        this.updateAllParameters();
    }

    /**
     * 應用衝擊波效果
     */
    public applyShockwave() {
        this.useProceduralWave = true;
        this.waveInnerRadius = 0.05;
        this.waveWidth = 0.15;
        this.waveSpeed = 3.0;
        this.waveFrequency = 1;
        this.waveAmplitude = 1.5;
        this.waveDistortion = 0.1;
        this.waveTurbulence = 0;
        this.displacementStrength = 0.25;
        this.updateAllParameters();
    }

    /**
     * 應用混亂湍流效果
     */
    public applyChaoticTurbulence() {
        this.useProceduralWave = true;
        this.waveInnerRadius = 0.15;
        this.waveWidth = 0.5;
        this.waveSpeed = 1.0;
        this.waveFrequency = 6;
        this.waveAmplitude = 0.6;
        this.waveDistortion = 1.5;
        this.waveTurbulence = 0.8;
        this.displacementStrength = 0.12;
        this.updateAllParameters();
    }

    /**
     * 重置為預設值
     */
    public resetToDefault() {
        this.useProceduralWave = true;
        this.displacementStrength = 0.1;
        this.waveInnerRadius = 0.2;
        this.waveWidth = 0.3;
        this.waveSpeed = 1.0;
        this.waveFrequency = 5.0;
        this.waveAmplitude = 0.5;
        this.waveDistortion = 0.5;
        this.waveTurbulence = 0.0;
        this.updateAllParameters();
    }
}
