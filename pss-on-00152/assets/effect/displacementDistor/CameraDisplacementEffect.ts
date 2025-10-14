import { _decorator, Component, Camera, RenderTexture, view, gfx, MeshRenderer, Material } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Camera Post Process Example
 * 展示如何將 Displacement 效果應用到整個 Camera
 */
@ccclass('CameraDisplacementEffect')
export class CameraDisplacementEffect extends Component {
    
    @property({ type: Camera, tooltip: '要處理的 Camera' })
    targetCamera: Camera | null = null;
    
    @property({ type: MeshRenderer, tooltip: '全屏 Plane 的 MeshRenderer' })
    fullscreenPlane: MeshRenderer | null = null;
    
    @property({ tooltip: 'RenderTexture 解析度' })
    renderTextureWidth: number = 1024;
    
    @property({ tooltip: 'RenderTexture 解析度' })
    renderTextureHeight: number = 1024;
    
    private renderTexture: RenderTexture | null = null;
    
    start() {
        this.setupCameraRenderTexture();
    }
    
    /**
     * 設置 Camera 使用 RenderTexture
     */
    private setupCameraRenderTexture() {
        if (!this.targetCamera) {
            console.error('[CameraDisplacementEffect] 未設置 Target Camera');
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
        
        // 將 Camera 渲染到 RenderTexture
        this.targetCamera.targetTexture = this.renderTexture;
        
        // 設置全屏 Plane 的材質使用此 RenderTexture
        if (this.fullscreenPlane) {
            const material = this.fullscreenPlane.getMaterial(0);
            if (material) {
                material.setProperty('mainTexture', this.renderTexture);
                console.log('[CameraDisplacementEffect] Camera RenderTexture 已設置');
            }
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
