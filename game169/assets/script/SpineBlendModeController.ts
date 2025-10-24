import { _decorator, Component, sp, Material, log } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Spine 混合模式枚舉
 */
export enum SpineBlendMode {
    NORMAL = 0,      // 正常混合
    ADDITIVE = 1,    // 加法混合（發光）
    MULTIPLY = 2,    // 乘法混合（變暗）
    SCREEN = 3       // 濾色混合（變亮）
}

/**
 * Spine 混合模式控制器（使用自定義 Shader）
 * 
 * 功能：
 * - 透過自定義 Shader 實現 Spine 骨骼動畫的混合模式控制
 * - 支援 4 種混合模式：Normal, Additive, Multiply, Screen
 * - 可在 Inspector 中即時調整並預覽效果
 * 
 * 使用方式：
 * 1. 將此腳本附加到有 sp.Skeleton 組件的節點上
 * 2. 在 Inspector 中設置 Blend Mode Material（使用 SpineBlendMode.effect）
 * 3. 調整 Blend Mode 下拉選單選擇混合模式
 * 
 * @author AI Assistant
 * @date 2025-01-24
 */
@ccclass('SpineBlendModeController')
export class SpineBlendModeController extends Component {
    
    @property({ type: Material, displayName: '混合模式材質', tooltip: '使用 SpineBlendMode.effect 創建的材質' })
    blendModeMaterial: Material | null = null;
    
    @property({ 
        type: SpineBlendMode, 
        displayName: '混合模式', 
        tooltip: 'Normal: 正常混合\nAdditive: 發光疊加效果\nMultiply: 顏色變暗效果\nScreen: 濾色變亮效果' 
    })
    blendMode: SpineBlendMode = SpineBlendMode.NORMAL;
    
    private skeletonComponent: sp.Skeleton | null = null;
    private materialInstance: Material | null = null;
    private lastBlendMode: SpineBlendMode = SpineBlendMode.NORMAL;
    
    onLoad() {
        // 獲取 Spine 骨骼組件
        this.skeletonComponent = this.getComponent(sp.Skeleton);
        
        if (!this.skeletonComponent) {
            log('[SpineBlendModeController] ⚠️ 未找到 sp.Skeleton 組件');
            return;
        }
        
        // 初始化材質
        this.initializeMaterial();
        
        // 應用初始混合模式
        this.applyBlendMode(this.blendMode);
        this.lastBlendMode = this.blendMode;
        
        log('[SpineBlendModeController] ✅ 初始化完成');
    }
    
    update() {
        // 檢測混合模式是否改變
        if (this.blendMode !== this.lastBlendMode) {
            this.applyBlendMode(this.blendMode);
            this.lastBlendMode = this.blendMode;
        }
    }
    
    /**
     * 初始化材質實例
     */
    private initializeMaterial() {
        if (!this.skeletonComponent) {
            return;
        }
        
        if (this.blendModeMaterial) {
            // 使用提供的材質創建實例
            this.materialInstance = new Material();
            this.materialInstance.copy(this.blendModeMaterial);
            this.skeletonComponent.customMaterial = this.materialInstance;
            log('[SpineBlendModeController] 📦 已套用自定義混合模式材質');
        } else {
            log('[SpineBlendModeController] ⚠️ 請在 Inspector 中指定混合模式材質');
        }
    }
    
    /**
     * 應用混合模式到 Shader
     */
    private applyBlendMode(mode: SpineBlendMode) {
        if (!this.materialInstance) {
            log('[SpineBlendModeController] ⚠️ 材質實例未初始化');
            return;
        }
        
        // 直接設置材質屬性
        try {
            // 方法1: 使用 setProperty
            this.materialInstance.setProperty('blendMode', mode);
            log(`[SpineBlendModeController] 🔧 設置 blendMode 屬性: ${mode}`);
            
            // 方法2: 透過 pass 設置 uniform
            const pass = this.materialInstance.passes[0];
            if (pass) {
                const handle = pass.getHandle('blendMode');
                if (handle !== undefined) {
                    pass.setUniform(handle, mode);
                    log(`[SpineBlendModeController] 🔧 設置 uniform handle: ${handle} = ${mode}`);
                } else {
                    log('[SpineBlendModeController] ⚠️ 找不到 blendMode uniform handle');
                }
            }
        } catch (e) {
            log('[SpineBlendModeController] ❌ 設置 uniform 錯誤:', e);
        }
        
        // 根據混合模式調整 OpenGL 混合狀態
        this.updateBlendState(mode);
        
        // 標記需要更新
        if (this.skeletonComponent) {
            this.skeletonComponent.markForUpdateRenderData();
        }
        
        const modeNames = ['NORMAL (正常)', 'ADDITIVE (發光)', 'MULTIPLY (變暗)', 'SCREEN (變亮)'];
        log(`[SpineBlendModeController] 🎨 混合模式已切換: ${modeNames[mode]}`);
    }
    
    /**
     * 更新 OpenGL 混合狀態
     */
    private updateBlendState(mode: SpineBlendMode) {
        if (!this.materialInstance || !this.skeletonComponent) {
            return;
        }
        
        const pass = this.materialInstance.passes[0];
        if (!pass) {
            return;
        }
        
        // 根據混合模式設置 premultipliedAlpha
        switch (mode) {
            case SpineBlendMode.NORMAL:
                this.skeletonComponent.premultipliedAlpha = true;
                break;
            case SpineBlendMode.ADDITIVE:
                // Additive 模式通常不需要 premultiplied alpha
                this.skeletonComponent.premultipliedAlpha = false;
                break;
            case SpineBlendMode.MULTIPLY:
            case SpineBlendMode.SCREEN:
                this.skeletonComponent.premultipliedAlpha = true;
                break;
        }
    }
    
    /**
     * 公開方法：設置混合模式
     */
    public setBlendMode(mode: SpineBlendMode) {
        this.blendMode = mode;
        this.applyBlendMode(mode);
    }
    
    /**
     * 公開方法：獲取當前混合模式
     */
    public getBlendMode(): SpineBlendMode {
        return this.blendMode;
    }
    
    /**
     * 公開方法：循環切換混合模式（用於測試）
     */
    public toggleBlendMode() {
        this.blendMode = (this.blendMode + 1) % 4;
        this.applyBlendMode(this.blendMode);
    }
}
