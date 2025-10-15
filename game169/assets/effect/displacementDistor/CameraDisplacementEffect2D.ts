import { _decorator, Component, Camera, RenderTexture, Sprite, gfx, Material } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Camera Post Process for 2D Projects
 * 2D 項目專用的全屏後處理效果
 * 使用 Sprite + Widget 代替 3D Plane
 */
@ccclass('CameraDisplacementEffect2D')
export class CameraDisplacementEffect2D extends Component {
    
    @property({ type: Camera, tooltip: '渲染場景的 Camera（通常是新建的 RenderCamera）' })
    renderCamera: Camera | null = null;
    
    @property({ type: Sprite, tooltip: '全屏 Sprite（使用 Widget 設為全屏）' })
    fullscreenSprite: Sprite | null = null;
    
    @property({ tooltip: 'RenderTexture 寬度（移動設備建議 512-1024）' })
    renderTextureWidth: number = 1024;
    
    @property({ tooltip: 'RenderTexture 高度（移動設備建議 512-1024）' })
    renderTextureHeight: number = 1024;
    
    private renderTexture: RenderTexture | null = null;
    
    start() {
        this.setupRenderTexture();
    }
    
    /**
     * 設置 RenderTexture 和雙攝像機系統
     */
    private setupRenderTexture() {
        if (!this.renderCamera || !this.fullscreenSprite) {
            console.error('[CameraDisplacementEffect2D] 未設置 RenderCamera 或 FullscreenSprite');
            console.error('請確認：');
            console.error('1. RenderCamera 已創建並連接');
            console.error('2. FullscreenSprite 已創建（帶 Widget 組件）');
            console.error('3. FullscreenSprite 已設置 CustomMaterial');
            return;
        }
        
        // 創建 RenderTexture
        this.renderTexture = new RenderTexture();
        this.renderTexture.reset({
            width: this.renderTextureWidth,
            height: this.renderTextureHeight,
            colorFormat: gfx.Format.RGBA8,
            depthStencilFormat: gfx.Format.DEPTH_STENCIL
        });
        
        // RenderCamera 渲染到 RenderTexture
        this.renderCamera.targetTexture = this.renderTexture;
        
        // 將 RenderTexture 設置給 Sprite 的材質
        const material = this.fullscreenSprite.customMaterial;
        if (material) {
            // 對於使用 DisplacementDistortion.effect 的材質
            // 主紋理會自動使用 cc_spriteTexture
            // 但我們需要將 RenderTexture 設置為主紋理的來源
            
            // 嘗試兩種可能的屬性名
            material.setProperty('mainTexture', this.renderTexture);
            // material.setProperty('cc_spriteTexture', this.renderTexture); // 備用方案
            
            console.log('[CameraDisplacementEffect2D] ✅ 設置完成');
            console.log(`  RenderTexture: ${this.renderTextureWidth}x${this.renderTextureHeight}`);
            console.log(`  RenderCamera Priority: ${this.renderCamera.priority}`);
            console.log(`  MainCamera Priority: ${this.node.getComponent(Camera)?.priority}`);
        } else {
            console.error('[CameraDisplacementEffect2D] ❌ Sprite 沒有設置 CustomMaterial！');
            console.error('請將 DisplacementDistortion.mtl 拖到 Sprite 的 CustomMaterial 欄位');
        }
    }
    
    /**
     * 動態調整渲染質量
     */
    public setRenderQuality(width: number, height: number) {
        if (this.renderTexture) {
            this.renderTexture.resize(width, height);
            console.log(`[CameraDisplacementEffect2D] 渲染質量已調整為: ${width}x${height}`);
        }
    }
    
    /**
     * 啟用/停用效果
     */
    public setEffectEnabled(enabled: boolean) {
        if (this.renderCamera) {
            this.renderCamera.enabled = enabled;
        }
        if (this.fullscreenSprite) {
            this.fullscreenSprite.node.active = enabled;
        }
    }
    
    onDestroy() {
        // 清理 RenderTexture
        if (this.renderTexture) {
            this.renderTexture.destroy();
            this.renderTexture = null;
        }
    }
}
