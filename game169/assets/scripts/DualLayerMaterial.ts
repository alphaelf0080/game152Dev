import { _decorator, Component, Sprite, Material, RenderTexture, gfx } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 雙層材質 Sprite 組件
 * 可以在現有的 custom material 上層再覆蓋第二層 material
 * 
 * 工作原理：
 * 1. 第一層（底層）：原始 Sprite 的 custom material
 * 2. 第二層（頂層）：通過此組件設置的 overlay material
 * 
 * 支援混合模式、透明度調整等
 */
@ccclass('DualLayerMaterial')
@executeInEditMode
export class DualLayerMaterial extends Component {
    
    @property({
        type: Sprite,
        tooltip: '目標 Sprite 組件'
    })
    targetSprite: Sprite | null = null;

    @property({
        type: Material,
        tooltip: '第二層（覆蓋層）的材質'
    })
    overlayMaterial: Material | null = null;

    @property({
        tooltip: '第二層材質的透明度 (0~1)',
        range: [0, 1],
        slide: true,
        displayName: 'Overlay Opacity'
    })
    overlayOpacity: number = 1.0;

    @property({
        tooltip: '混合模式',
        type: gfx.BlendFactor,
        displayName: 'Blend Mode'
    })
    blendSrc: gfx.BlendFactor = gfx.BlendFactor.SRC_ALPHA;

    @property({
        type: gfx.BlendFactor,
        displayName: 'Blend Dst'
    })
    blendDst: gfx.BlendFactor = gfx.BlendFactor.ONE_MINUS_SRC_ALPHA;

    @property({
        tooltip: '是否啟用第二層材質',
        displayName: 'Enable Overlay'
    })
    enableOverlay: boolean = true;

    private lastOpacity: number = 1.0;
    private baseSprite: Sprite | null = null;
    private overlaySprite: Sprite | null = null;

    protected onLoad(): void {
        this.initializeSprites();
        this.applyOverlay();
    }

    protected onEnable(): void {
        this.initializeSprites();
        this.applyOverlay();
    }

    protected update(): void {
        // 檢測透明度是否改變
        if (this.overlayOpacity !== this.lastOpacity) {
            this.updateOverlayOpacity();
            this.lastOpacity = this.overlayOpacity;
        }

        // 檢測是否禁用/啟用
        if (this.overlaySprite) {
            this.overlaySprite.enabled = this.enableOverlay;
        }
    }

    /**
     * 初始化 Sprites
     */
    private initializeSprites(): void {
        if (!this.targetSprite) {
            this.targetSprite = this.getComponent(Sprite);
        }

        if (!this.targetSprite) {
            console.warn('[DualLayerMaterial] 找不到目標 Sprite 組件');
            return;
        }

        // 保存底層 Sprite
        this.baseSprite = this.targetSprite;

        // 查找或創建覆蓋層 Sprite
        const overlayName = `${this.targetSprite.node.name}_Overlay`;
        let overlayNode = this.targetSprite.node.getChildByName(overlayName);

        if (!overlayNode) {
            // 創建新的覆蓋層 Node
            // @ts-ignore
            overlayNode = new cc.Node(overlayName);
            overlayNode.parent = this.targetSprite.node;
            overlayNode.position.z = 0.1; // 稍微向前，確保在底層上方
        }

        // 獲取或添加 Sprite 組件
        this.overlaySprite = overlayNode.getComponent(Sprite);
        if (!this.overlaySprite) {
            this.overlaySprite = overlayNode.addComponent(Sprite);
        }

        console.log('[DualLayerMaterial] ✓ Sprites 初始化完成');
    }

    /**
     * 應用覆蓋層材質
     */
    private applyOverlay(): void {
        if (!this.baseSprite || !this.overlaySprite) {
            this.initializeSprites();
            return;
        }

        if (!this.overlayMaterial) {
            console.warn('[DualLayerMaterial] 覆蓋層材質未設置');
            return;
        }

        try {
            // 配置底層 Sprite（保持現有的 custom material）
            // this.baseSprite 的 custom material 保持不變

            // 配置覆蓋層 Sprite
            // 複製底層 Sprite 的紋理到覆蓋層
            const baseSpriteFrame = this.baseSprite.spriteFrame;
            if (baseSpriteFrame) {
                this.overlaySprite.spriteFrame = baseSpriteFrame;
            }

            // 設置覆蓋層的材質
            this.overlaySprite.customMaterial = this.overlayMaterial;

            // 同步大小
            const baseNode = this.baseSprite.node;
            const overlayNode = this.overlaySprite.node;
            
            if (baseNode.getComponent('cc.UITransform')) {
                const baseUITransform = baseNode.getComponent('cc.UITransform');
                // @ts-ignore
                const overlayUITransform = overlayNode.getComponent('cc.UITransform') || 
                                          overlayNode.addComponent('cc.UITransform');
                
                if (baseUITransform) {
                    overlayUITransform.contentSize = baseUITransform.contentSize;
                    overlayUITransform.anchorPoint = baseUITransform.anchorPoint;
                }
            }

            this.updateOverlayOpacity();

            console.log('[DualLayerMaterial] ✓ 覆蓋層材質已應用');
        } catch (error) {
            console.error('[DualLayerMaterial] ✗ 應用覆蓋層失敗:', error);
        }
    }

    /**
     * 更新覆蓋層透明度
     */
    private updateOverlayOpacity(): void {
        if (!this.overlaySprite) return;

        try {
            const color = this.overlaySprite.color;
            color.a = Math.round(this.overlayOpacity * 255);
            this.overlaySprite.color = color;

            console.log(`[DualLayerMaterial] 覆蓋層透明度: ${this.overlayOpacity}`);
        } catch (error) {
            console.error('[DualLayerMaterial] ✗ 更新透明度失敗:', error);
        }
    }

    /**
     * 設置覆蓋層材質
     */
    public setOverlayMaterial(material: Material): void {
        this.overlayMaterial = material;
        this.applyOverlay();
    }

    /**
     * 設置覆蓋層透明度
     */
    public setOverlayOpacity(opacity: number): void {
        this.overlayOpacity = Math.max(0, Math.min(1, opacity));
        this.updateOverlayOpacity();
    }

    /**
     * 啟用/禁用覆蓋層
     */
    public setOverlayEnabled(enabled: boolean): void {
        this.enableOverlay = enabled;
        if (this.overlaySprite) {
            this.overlaySprite.enabled = enabled;
        }
    }

    /**
     * 獲取覆蓋層 Sprite
     */
    public getOverlaySprite(): Sprite | null {
        return this.overlaySprite;
    }

    /**
     * 獲取底層 Sprite
     */
    public getBaseSprite(): Sprite | null {
        return this.baseSprite;
    }

    /**
     * 交換材質
     */
    public swapMaterials(): void {
        if (!this.baseSprite || !this.overlaySprite) return;

        const baseCustomMaterial = this.baseSprite.customMaterial;
        this.baseSprite.customMaterial = this.overlayMaterial;
        this.overlayMaterial = baseCustomMaterial;

        this.applyOverlay();
        console.log('[DualLayerMaterial] ✓ 材質已交換');
    }

    /**
     * 刪除覆蓋層
     */
    public removeOverlay(): void {
        if (this.overlaySprite && this.overlaySprite.node) {
            this.overlaySprite.node.destroy();
            this.overlaySprite = null;
            console.log('[DualLayerMaterial] ✓ 覆蓋層已刪除');
        }
    }
}
