import { _decorator, Component, Sprite, Material, Vec4 } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

/**
 * Sprite 紋理重複控制組件
 * 適用於 Cocos Creator 3.8
 * 可以控制 Sprite 紋理在 X 和 Y 方向的重複次數
 */
@ccclass('SpriteTextureRepeat')
@executeInEditMode
export class SpriteTextureRepeat extends Component {
    
    @property({
        type: Sprite,
        tooltip: '目標 Sprite 組件，如果不設置會自動查找'
    })
    targetSprite: Sprite | null = null;

    @property({
        tooltip: 'X 方向的重複次數 (1 = 不重複, 2 = 重複 2 次)',
        slide: true,
        range: [0.1, 10, 0.1],
        displayName: 'Repeat X'
    })
    repeatX: number = 1.0;

    @property({
        tooltip: 'Y 方向的重複次數 (1 = 不重複, 2 = 重複 2 次)',
        slide: true,
        range: [0.1, 10, 0.1],
        displayName: 'Repeat Y'
    })
    repeatY: number = 1.0;

    @property({
        tooltip: 'X 方向的偏移',
        slide: true,
        range: [-1, 1, 0.01],
        displayName: 'Offset X'
    })
    offsetX: number = 0.0;

    @property({
        tooltip: 'Y 方向的偏移',
        slide: true,
        range: [-1, 1, 0.01],
        displayName: 'Offset Y'
    })
    offsetY: number = 0.0;

    private material: Material | null = null;
    private lastRepeatX: number = 1.0;
    private lastRepeatY: number = 1.0;
    private lastOffsetX: number = 0.0;
    private lastOffsetY: number = 0.0;

    protected onLoad(): void {
        this.initMaterial();
        this.applyRepeat();
        
        // 顯示使用提示
        if (!this.material) {
            console.error('[SpriteTextureRepeat] ❌ 初始化失敗！');
            console.error('[SpriteTextureRepeat] 請確保：');
            console.error('[SpriteTextureRepeat] 1. Sprite 有自定義材質（CustomMaterial）');
            console.error('[SpriteTextureRepeat] 2. 材質使用 SpriteUVRepeat shader');
            console.error('[SpriteTextureRepeat] 3. 紋理 Wrap Mode 設為 Repeat');
        }
    }

    protected onEnable(): void {
        this.initMaterial();
        this.applyRepeat();
    }

    protected update(): void {
        // 檢測參數是否改變
        if (this.repeatX !== this.lastRepeatX ||
            this.repeatY !== this.lastRepeatY ||
            this.offsetX !== this.lastOffsetX ||
            this.offsetY !== this.lastOffsetY) {
            
            this.applyRepeat();
            
            this.lastRepeatX = this.repeatX;
            this.lastRepeatY = this.repeatY;
            this.lastOffsetX = this.offsetX;
            this.lastOffsetY = this.offsetY;
        }
    }

    /**
     * 初始化材質
     */
    private initMaterial(): void {
        if (!this.targetSprite) {
            this.targetSprite = this.getComponent(Sprite);
        }

        if (!this.targetSprite) {
            console.warn('[SpriteTextureRepeat] 找不到 Sprite 組件');
            return;
        }

        // 獲取或創建自定義材質實例
        this.material = this.targetSprite.customMaterial;
        
        if (!this.material) {
            // 如果沒有自定義材質，獲取共享材質並創建實例
            const sharedMaterial = this.targetSprite.sharedMaterial;
            if (sharedMaterial) {
                this.material = this.targetSprite.getMaterialInstance(0);
            }
        }

        if (this.material) {
            console.log('[SpriteTextureRepeat] ✓ 材質初始化成功');
        } else {
            console.warn('[SpriteTextureRepeat] ✗ 無法獲取材質');
        }
    }

    /**
     * 應用紋理重複設置
     */
    private applyRepeat(): void {
        if (!this.material) {
            this.initMaterial();
        }

        if (!this.material) {
            return;
        }

        try {
            // 方法 1: 嘗試使用 tilingOffset（自定義 shader）
            let success = false;
            
            const tilingOffset = new Vec4(
                this.repeatX,
                this.repeatY,
                this.offsetX,
                this.offsetY
            );

            try {
                this.material.setProperty('tilingOffset', tilingOffset);
                success = true;
                console.log(`[SpriteTextureRepeat] ✓ 使用 tilingOffset: Repeat(${this.repeatX}, ${this.repeatY}), Offset(${this.offsetX}, ${this.offsetY})`);
            } catch (e) {
                // tilingOffset 不存在，嘗試其他方法
            }

            // 方法 2: 使用 mainTiling（某些 shader）
            if (!success) {
                try {
                    this.material.setProperty('mainTiling', new Vec4(this.repeatX, this.repeatY, 0, 0));
                    this.material.setProperty('mainOffset', new Vec4(this.offsetX, this.offsetY, 0, 0));
                    success = true;
                    console.log(`[SpriteTextureRepeat] ✓ 使用 mainTiling/mainOffset`);
                } catch (e) {
                    // 這個也不存在
                }
            }

            // 方法 3: 直接修改 Sprite 的 UV（Cocos Creator 3.8 不支援默認 Sprite）
            if (!success) {
                console.warn(`[SpriteTextureRepeat] ⚠️ 默認 Sprite shader 不支援 UV 重複`);
                console.warn(`[SpriteTextureRepeat] 解決方案：請使用自定義 shader 或將 Sprite Type 設為 TILED`);
            }
            
        } catch (error) {
            console.error('[SpriteTextureRepeat] ✗ 應用紋理重複失敗:', error);
        }
    }

    /**
     * 設置重複次數
     * @param x X 方向重複次數
     * @param y Y 方向重複次數
     */
    public setRepeat(x: number, y: number): void {
        this.repeatX = x;
        this.repeatY = y;
        this.applyRepeat();
    }

    /**
     * 設置偏移
     * @param x X 方向偏移
     * @param y Y 方向偏移
     */
    public setOffset(x: number, y: number): void {
        this.offsetX = x;
        this.offsetY = y;
        this.applyRepeat();
    }

    /**
     * 重置為默認值
     */
    public reset(): void {
        this.repeatX = 1.0;
        this.repeatY = 1.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.applyRepeat();
    }

    /**
     * 手動應用設置
     */
    public apply(): void {
        this.applyRepeat();
    }
}
