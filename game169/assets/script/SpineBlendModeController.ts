import { _decorator, Component, sp, Material, log, Enum } from 'cc';
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

Enum(SpineBlendMode);

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
            log('[SpineBlendModeController] ❌ 未找到 sp.Skeleton 組件');
            return;
        }
        
        // 初始化材質
        this.initializeMaterial();
        
        // 應用初始狀態
        this.applyBlendMode(this.blendMode);
        this.lastBlendMode = this.blendMode;
        
        log('[SpineBlendModeController] ✅ 初始化完成');
    }
    
    update() {
        // 檢測狀態是否改變
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
     * 應用混合模式
     */
    private applyBlendMode(mode: SpineBlendMode) {
        if (!this.materialInstance) {
            log('[SpineBlendModeController] ⚠️ 材質實例未初始化');
            return;
        }
        
        try {
            // 設置 shader uniform
            this.materialInstance.setProperty('blendMode', mode);
            
            // 透過 pass 設置
            const pass = this.materialInstance.passes[0];
            if (pass) {
                const handle = pass.getHandle('blendMode');
                if (handle !== undefined) {
                    pass.setUniform(handle, mode);
                    log(`[SpineBlendModeController] ✅ 設置 blendMode: ${mode}`);
                }
            }
        } catch (e) {
            log('[SpineBlendModeController] ❌ 設置 uniform 錯誤:', e);
        }
        
        // 標記需要更新
        if (this.skeletonComponent) {
            this.skeletonComponent.markForUpdateRenderData();
        }
        
        const modeNames = ['NORMAL (正常)', 'ADDITIVE (發光)', 'MULTIPLY (變暗)', 'SCREEN (變亮)'];
        log(`[SpineBlendModeController] 🎨 混合模式: ${modeNames[mode]}`);
    }
    
    /**
     * 設置混合模式（公開 API）
     */
    public setBlendMode(mode: SpineBlendMode) {
        this.blendMode = mode;
        this.applyBlendMode(mode);
    }
    
    /**
     * 獲取當前混合模式
     */
    public getBlendMode(): SpineBlendMode {
        return this.blendMode;
    }
    
    /**
     * 切換到下一個混合模式
     */
    public toggleBlendMode() {
        this.blendMode = (this.blendMode + 1) % 4;
        this.applyBlendMode(this.blendMode);
    }
}
