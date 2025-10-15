import { _decorator, Component, Sprite, Material, SpriteFrame, Vec2 } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 三層 Sprite 控制器
 * 適用於 ThreeLayerSprite.effect
 */
@ccclass('ThreeLayerSpriteController')
@executeInEditMode
export class ThreeLayerSpriteController extends Component {
    // ===== 第一層（基礎層）=====
    @property({ group: { name: '第一層（基礎層）', id: '1' } })
    private _layer1Group = true;
    
    @property({ group: { name: '第一層（基礎層）', id: '1' }, tooltip: '第一層貼圖（使用 Sprite 本身的 SpriteFrame）' })
    layer1UVScale: Vec2 = new Vec2(1, 1);
    
    @property({ group: { name: '第一層（基礎層）', id: '1' }, tooltip: 'UV 偏移（可用於滾動動畫）' })
    layer1UVOffset: Vec2 = new Vec2(0, 0);
    
    @property({ group: { name: '第一層（基礎層）', id: '1' }, type: Sprite.WrapMode, tooltip: 'UV 包裹模式' })
    layer1UVWrap: Sprite.WrapMode = Sprite.WrapMode.CLAMP;
    
    // ===== 第二層 =====
    @property({ group: { name: '第二層', id: '2' } })
    private _layer2Group = true;
    
    @property({ group: { name: '第二層', id: '2' }, tooltip: '啟用第二層' })
    layer2Enabled: boolean = false;
    
    @property({ group: { name: '第二層', id: '2' }, type: SpriteFrame, tooltip: '第二層貼圖' })
    layer2Texture: SpriteFrame | null = null;
    
    @property({ group: { name: '第二層', id: '2' } })
    layer2UVScale: Vec2 = new Vec2(1, 1);
    
    @property({ group: { name: '第二層', id: '2' } })
    layer2UVOffset: Vec2 = new Vec2(0, 0);
    
    @property({ group: { name: '第二層', id: '2' }, type: Sprite.WrapMode })
    layer2UVWrap: Sprite.WrapMode = Sprite.WrapMode.CLAMP;
    
    @property({ group: { name: '第二層', id: '2' }, type: BlendMode, tooltip: '混合模式' })
    layer2BlendMode: BlendMode = BlendMode.Normal;
    
    @property({ group: { name: '第二層', id: '2' }, range: [0, 1, 0.01], tooltip: '不透明度' })
    layer2Opacity: number = 1.0;
    
    // ===== 第三層 =====
    @property({ group: { name: '第三層', id: '3' } })
    private _layer3Group = true;
    
    @property({ group: { name: '第三層', id: '3' }, tooltip: '啟用第三層' })
    layer3Enabled: boolean = false;
    
    @property({ group: { name: '第三層', id: '3' }, type: SpriteFrame, tooltip: '第三層貼圖' })
    layer3Texture: SpriteFrame | null = null;
    
    @property({ group: { name: '第三層', id: '3' } })
    layer3UVScale: Vec2 = new Vec2(1, 1);
    
    @property({ group: { name: '第三層', id: '3' } })
    layer3UVOffset: Vec2 = new Vec2(0, 0);
    
    @property({ group: { name: '第三層', id: '3' }, type: Sprite.WrapMode })
    layer3UVWrap: Sprite.WrapMode = Sprite.WrapMode.CLAMP;
    
    @property({ group: { name: '第三層', id: '3' }, type: BlendMode })
    layer3BlendMode: BlendMode = BlendMode.Normal;
    
    @property({ group: { name: '第三層', id: '3' }, range: [0, 1, 0.01] })
    layer3Opacity: number = 1.0;
    
    // ===== 動畫控制 =====
    @property({ group: { name: '動畫', id: '4' }, tooltip: '第一層 UV 滾動速度' })
    layer1ScrollSpeed: Vec2 = new Vec2(0, 0);
    
    @property({ group: { name: '動畫', id: '4' }, tooltip: '第二層 UV 滾動速度' })
    layer2ScrollSpeed: Vec2 = new Vec2(0, 0);
    
    @property({ group: { name: '動畫', id: '4' }, tooltip: '第三層 UV 滾動速度' })
    layer3ScrollSpeed: Vec2 = new Vec2(0, 0);
    
    private sprite: Sprite | null = null;
    private material: Material | null = null;
    
    onLoad() {
        this.sprite = this.getComponent(Sprite);
        if (!this.sprite) {
            console.error('[ThreeLayerSpriteController] 需要 Sprite 組件');
            return;
        }
        
        this.setupMaterial();
    }
    
    start() {
        this.updateAllProperties();
    }
    
    private setupMaterial() {
        if (!this.sprite) return;
        
        // 創建材質
        this.material = new Material();
        this.material.initialize({ effectName: 'ThreeLayerSprite' });
        
        // 應用到 Sprite（使用 setMaterial 或 setSharedMaterial）
        this.sprite.setMaterial(this.material, 0);
        
        console.log('[ThreeLayerSpriteController] 材質已初始化');
    }
    
    private updateAllProperties() {
        if (!this.material) return;
        
        // 第一層
        this.material.setProperty('layer1_UVScale', this.layer1UVScale);
        this.material.setProperty('layer1_UVOffset', this.layer1UVOffset);
        this.material.setProperty('layer1_UVWrap', this.wrapModeToFloat(this.layer1UVWrap));
        
        // 第二層
        this.material.setProperty('layer2_Enabled', this.layer2Enabled ? 1.0 : 0.0);
        this.material.setProperty('layer2_UVScale', this.layer2UVScale);
        this.material.setProperty('layer2_UVOffset', this.layer2UVOffset);
        this.material.setProperty('layer2_UVWrap', this.wrapModeToFloat(this.layer2UVWrap));
        this.material.setProperty('layer2_BlendMode', this.layer2BlendMode);
        this.material.setProperty('layer2_Opacity', this.layer2Opacity);
        
        if (this.layer2Texture && this.layer2Texture.texture) {
            this.material.setProperty('layer2Texture', this.layer2Texture.texture);
        }
        
        // 第三層
        this.material.setProperty('layer3_Enabled', this.layer3Enabled ? 1.0 : 0.0);
        this.material.setProperty('layer3_UVScale', this.layer3UVScale);
        this.material.setProperty('layer3_UVOffset', this.layer3UVOffset);
        this.material.setProperty('layer3_UVWrap', this.wrapModeToFloat(this.layer3UVWrap));
        this.material.setProperty('layer3_BlendMode', this.layer3BlendMode);
        this.material.setProperty('layer3_Opacity', this.layer3Opacity);
        
        if (this.layer3Texture && this.layer3Texture.texture) {
            this.material.setProperty('layer3Texture', this.layer3Texture.texture);
        }
    }
    
    update(dt: number) {
        if (!this.material) return;
        
        // UV 滾動動畫
        if (this.layer1ScrollSpeed.x !== 0 || this.layer1ScrollSpeed.y !== 0) {
            this.layer1UVOffset.x += this.layer1ScrollSpeed.x * dt;
            this.layer1UVOffset.y += this.layer1ScrollSpeed.y * dt;
            this.material.setProperty('layer1_UVOffset', this.layer1UVOffset);
        }
        
        if (this.layer2Enabled && (this.layer2ScrollSpeed.x !== 0 || this.layer2ScrollSpeed.y !== 0)) {
            this.layer2UVOffset.x += this.layer2ScrollSpeed.x * dt;
            this.layer2UVOffset.y += this.layer2ScrollSpeed.y * dt;
            this.material.setProperty('layer2_UVOffset', this.layer2UVOffset);
        }
        
        if (this.layer3Enabled && (this.layer3ScrollSpeed.x !== 0 || this.layer3ScrollSpeed.y !== 0)) {
            this.layer3UVOffset.x += this.layer3ScrollSpeed.x * dt;
            this.layer3UVOffset.y += this.layer3ScrollSpeed.y * dt;
            this.material.setProperty('layer3_UVOffset', this.layer3UVOffset);
        }
    }
    
    private wrapModeToFloat(mode: Sprite.WrapMode): number {
        switch (mode) {
            case Sprite.WrapMode.CLAMP: return 0.0;
            case Sprite.WrapMode.REPEAT: return 1.0;
            case Sprite.WrapMode.MIRROR: return 2.0;
            default: return 0.0;
        }
    }
    
    // ===== 公開方法 =====
    
    /**
     * 設置第二層貼圖
     */
    public setLayer2Texture(spriteFrame: SpriteFrame | null) {
        this.layer2Texture = spriteFrame;
        if (this.material && spriteFrame && spriteFrame.texture) {
            this.material.setProperty('layer2Texture', spriteFrame.texture);
        }
    }
    
    /**
     * 設置第三層貼圖
     */
    public setLayer3Texture(spriteFrame: SpriteFrame | null) {
        this.layer3Texture = spriteFrame;
        if (this.material && spriteFrame && spriteFrame.texture) {
            this.material.setProperty('layer3Texture', spriteFrame.texture);
        }
    }
    
    /**
     * 啟用/停用第二層
     */
    public setLayer2Enabled(enabled: boolean) {
        this.layer2Enabled = enabled;
        if (this.material) {
            this.material.setProperty('layer2_Enabled', enabled ? 1.0 : 0.0);
        }
    }
    
    /**
     * 啟用/停用第三層
     */
    public setLayer3Enabled(enabled: boolean) {
        this.layer3Enabled = enabled;
        if (this.material) {
            this.material.setProperty('layer3_Enabled', enabled ? 1.0 : 0.0);
        }
    }
    
    /**
     * 設置第二層混合模式
     */
    public setLayer2BlendMode(mode: BlendMode) {
        this.layer2BlendMode = mode;
        if (this.material) {
            this.material.setProperty('layer2_BlendMode', mode);
        }
    }
    
    /**
     * 設置第三層混合模式
     */
    public setLayer3BlendMode(mode: BlendMode) {
        this.layer3BlendMode = mode;
        if (this.material) {
            this.material.setProperty('layer3_BlendMode', mode);
        }
    }
}

/**
 * 混合模式枚舉
 */
export enum BlendMode {
    Normal = 0,
    Multiply = 1,
    Add = 2,
    Screen = 3,
    Overlay = 4
}
