import { _decorator, Component, sp, Material, log } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Spine 加法混合模式控制器（簡化測試版本）
 * 
 * 功能：
 * - 測試 Spine 的加法混合效果
 * - 簡單的開關控制
 * 
 * 使用方式：
 * 1. 將此腳本附加到有 sp.Skeleton 組件的節點上
 * 2. 在 Inspector 中設置 Blend Mode Material（使用 SpineBlendMode.effect）
 * 3. 勾選 Use Additive 測試加法混合效果
 * 
 * @author AI Assistant
 * @date 2025-01-24
 */
@ccclass('SpineBlendModeController')
export class SpineBlendModeController extends Component {
    
    @property({ type: Material, displayName: '混合模式材質', tooltip: '使用 SpineBlendMode.effect 創建的材質' })
    blendModeMaterial: Material | null = null;
    
    @property({ 
        displayName: '使用加法混合', 
        tooltip: '勾選後啟用發光效果（Additive Blend）' 
    })
    useAdditive: boolean = false;
    
    private skeletonComponent: sp.Skeleton | null = null;
    private materialInstance: Material | null = null;
    private lastUseAdditive: boolean = false;
    
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
        this.applyAdditive(this.useAdditive);
        this.lastUseAdditive = this.useAdditive;
        
        log('[SpineBlendModeController] ✅ 初始化完成');
    }
    
    update() {
        // 檢測狀態是否改變
        if (this.useAdditive !== this.lastUseAdditive) {
            this.applyAdditive(this.useAdditive);
            this.lastUseAdditive = this.useAdditive;
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
     * 應用加法混合
     */
    private applyAdditive(enabled: boolean) {
        if (!this.materialInstance) {
            log('[SpineBlendModeController] ⚠️ 材質實例未初始化');
            return;
        }
        
        const value = enabled ? 1.0 : 0.0;
        
        try {
            // 設置 shader uniform
            this.materialInstance.setProperty('useAdditive', value);
            log(`[SpineBlendModeController] 🔧 設置 useAdditive: ${value} ${enabled ? '(啟用發光)' : '(正常模式)'}`);
            
            // 嘗試通過 pass 設置
            const pass = this.materialInstance.passes[0];
            if (pass) {
                const handle = pass.getHandle('useAdditive');
                if (handle !== undefined) {
                    pass.setUniform(handle, value);
                    log(`[SpineBlendModeController] ✅ Uniform handle: ${handle}, value: ${value}`);
                } else {
                    log('[SpineBlendModeController] ⚠️ 找不到 useAdditive uniform handle');
                }
            }
        } catch (e) {
            log('[SpineBlendModeController] ❌ 設置 uniform 錯誤:', e);
        }
        
        // 標記需要更新
        if (this.skeletonComponent) {
            this.skeletonComponent.markForUpdateRenderData();
        }
        
        log(`[SpineBlendModeController] 🎨 混合模式已更新: ${enabled ? 'Additive (加法發光)' : 'Normal (正常)'}`);
    }
    
    /**
     * 設置加法混合（公開 API）
     */
    public setAdditive(enabled: boolean) {
        this.useAdditive = enabled;
        this.applyAdditive(enabled);
    }
    
    /**
     * 獲取當前狀態
     */
    public isAdditive(): boolean {
        return this.useAdditive;
    }
    
    /**
     * 切換加法混合
     */
    public toggleAdditive() {
        this.setAdditive(!this.useAdditive);
    }
}
