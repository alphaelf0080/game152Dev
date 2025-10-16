import { _decorator, Component, Material, Vec2, Vec4, Color, Sprite, UITransform } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

/**
 * RampShader 重置監控組件
 * 當檢測到 resetAll 參數為 true 時,自動重置所有參數並將 resetAll 設回 false
 * 同時自動計算並設置 nodeUVScale 參數
 */
@ccclass('RampShaderResetInspector')
@executeInEditMode
export class RampShaderResetInspector extends Component {
    
    @property({
        type: Sprite,
        tooltip: '使用 RampShader 的 Sprite 組件'
    })
    targetSprite: Sprite | null = null;
    
    private lastResetState: boolean = false;
    
    /**
     * 所有參數的預設值
     */
    private readonly DEFAULT_VALUES = {
        tilingOffset: new Vec4(1.0, 1.0, 0.0, 0.0),
        useMainTexture: 0.0,
        useRampTexture: 0.0,
        colorStart: new Color(0, 0, 0, 255),
        colorEnd: new Color(255, 255, 255, 255),
        nodeUVScale: new Vec2(1.0, 1.0),  // 將由 updateNodeUVScale 自動設置
        rampCenter: new Vec2(0.5, 0.5),
        rampUVScale: new Vec2(1.0, 1.0),
        rampUVOffset: new Vec2(0.0, 0.0),
        rampRange: new Vec2(0.0, 1.0),
        brightness: 0.0,
        contrast: 1.0,
        saturation: 1.0,
        rampIntensity: 1.0,
        invertRamp: 0.0,
        smoothness: 0.0,
        rectangleAspect: new Vec2(1.0, 1.0),
        cornerRadius: 0.0,
        distortionIntensity: 0.0,
        distortionFrequency: 5.0,
    };
    
    protected onLoad(): void {
        if (!this.targetSprite) {
            this.targetSprite = this.getComponent(Sprite);
        }
        
        // 初始化時自動設置 nodeUVScale
        this.updateNodeUVScale();
    }
    
    /**
     * 自動計算並更新 nodeUVScale
     */
    private updateNodeUVScale(): void {
        if (!this.targetSprite || !this.targetSprite.customMaterial) {
            return;
        }
        
        const material = this.targetSprite.customMaterial;
        
        try {
            const uiTransform = this.node.getComponent(UITransform);
            if (uiTransform) {
                const contentSize = uiTransform.contentSize;
                
                // 計算 nodeUVScale
                const nodeUVScaleX = 2.0 / contentSize.width;
                const nodeUVScaleY = 2.0 / contentSize.height;
                material.setProperty('nodeUVScale', new Vec2(nodeUVScaleX, nodeUVScaleY), 0);
                console.log(`📐 nodeUVScale set to (${nodeUVScaleX.toFixed(6)}, ${nodeUVScaleY.toFixed(6)}) for node with content size (${contentSize.width}, ${contentSize.height})`);
            }
        } catch (error) {
            console.error('Error updating nodeUVScale:', error);
        }
    }
    
    protected update(dt: number): void {
        // 只在編輯器模式下運行
        if (!EDITOR) {
            return;
        }
        
        this.checkAndResetIfNeeded();
    }
    
    /**
     * 檢查是否需要重置參數
     */
    private checkAndResetIfNeeded(): void {
        if (!this.targetSprite || !this.targetSprite.customMaterial) {
            return;
        }
        
        const material = this.targetSprite.customMaterial;
        
        try {
            const resetAll = material.getProperty('resetAll', 0) as number;
            const shouldReset = resetAll > 0.5;
            
            // 檢測到 resetAll 從 false 變為 true
            if (shouldReset && !this.lastResetState) {
                console.log('🔄 Resetting all RampShader parameters...');
                this.resetAllParameters(material);
                
                // 將 resetAll 設回 false
                material.setProperty('resetAll', 0.0, 0);
                
                console.log('✅ All parameters reset to defaults');
            }
            
            this.lastResetState = shouldReset;
            
        } catch (error) {
            // 靜默處理錯誤,避免在編輯器中頻繁輸出
        }
    }
    
    /**
     * 重置所有參數到預設值
     */
    private resetAllParameters(material: Material): void {
        try {
            // 首先更新 nodeUVScale（自動計算）
            const uiTransform = this.node.getComponent(UITransform);
            if (uiTransform) {
                const contentSize = uiTransform.contentSize;
                
                // 計算並設置 nodeUVScale
                const nodeUVScaleX = 2.0 / contentSize.width;
                const nodeUVScaleY = 2.0 / contentSize.height;
                material.setProperty('nodeUVScale', new Vec2(nodeUVScaleX, nodeUVScaleY), 0);
                console.log(`✨ nodeUVScale automatically set to (${nodeUVScaleX.toFixed(6)}, ${nodeUVScaleY.toFixed(6)}) based on content size (${contentSize.width}, ${contentSize.height})`);
            }
            
            // 設置其他參數到預設值
            // 主紋理 UV 控制
            material.setProperty('tilingOffset', this.DEFAULT_VALUES.tilingOffset.clone(), 0);
            material.setProperty('useMainTexture', this.DEFAULT_VALUES.useMainTexture, 0);
            
            // Ramp 紋理和顏色控制
            material.setProperty('useRampTexture', this.DEFAULT_VALUES.useRampTexture, 0);
            material.setProperty('colorStart', this.DEFAULT_VALUES.colorStart.clone(), 0);
            material.setProperty('colorEnd', this.DEFAULT_VALUES.colorEnd.clone(), 0);
            
            // Ramp 範圍控制
            material.setProperty('rampCenter', this.DEFAULT_VALUES.rampCenter.clone(), 0);
            material.setProperty('rampUVScale', this.DEFAULT_VALUES.rampUVScale.clone(), 0);
            material.setProperty('rampUVOffset', this.DEFAULT_VALUES.rampUVOffset.clone(), 0);  // 使用預設值 (0, 0)
            material.setProperty('rampRange', this.DEFAULT_VALUES.rampRange.clone(), 0);
            
            // 顏色調整
            material.setProperty('brightness', this.DEFAULT_VALUES.brightness, 0);
            material.setProperty('contrast', this.DEFAULT_VALUES.contrast, 0);
            material.setProperty('saturation', this.DEFAULT_VALUES.saturation, 0);
            
            // 強度控制
            material.setProperty('rampIntensity', this.DEFAULT_VALUES.rampIntensity, 0);
            
            // 進階控制
            material.setProperty('invertRamp', this.DEFAULT_VALUES.invertRamp, 0);
            material.setProperty('smoothness', this.DEFAULT_VALUES.smoothness, 0);
            
            // 長方形 Ramp 控制
            material.setProperty('rectangleAspect', this.DEFAULT_VALUES.rectangleAspect.clone(), 0);
            material.setProperty('cornerRadius', this.DEFAULT_VALUES.cornerRadius, 0);
            
            // 扭曲變形控制
            material.setProperty('distortionIntensity', this.DEFAULT_VALUES.distortionIntensity, 0);
            material.setProperty('distortionFrequency', this.DEFAULT_VALUES.distortionFrequency, 0);
            
        } catch (error) {
            console.error('Error resetting parameters:', error);
        }
    }
    
    /**
     * 手動觸發重置 (可在編輯器中通過按鈕調用)
     */
    public manualReset(): void {
        if (!this.targetSprite || !this.targetSprite.customMaterial) {
            console.warn('No custom material found');
            return;
        }
        
        this.resetAllParameters(this.targetSprite.customMaterial);
        console.log('✅ Manual reset completed');
    }
}
