import { Material, Vec2, Vec4, Color } from 'cc';

/**
 * RampColorShader 輔助工具類
 * 提供參數重置和批量設定功能
 */
export class RampShaderHelper {
    
    /**
     * 所有參數的預設值
     */
    private static readonly DEFAULT_VALUES = {
        // 主紋理 UV 控制
        tilingOffset: new Vec4(1.0, 1.0, 0.0, 0.0),
        useMainTexture: 0.0,
        
        // Ramp 紋理和顏色控制
        useRampTexture: 0.0,
        colorStart: new Color(0, 0, 0, 255),
        colorEnd: new Color(255, 255, 255, 255),
        
        // Ramp 範圍控制
        rampCenter: new Vec2(0.5, 0.5),
        rampUVScale: new Vec2(1.0, 1.0),
        rampUVOffset: new Vec2(0.0, 0.0),
        rampRange: new Vec2(0.0, 1.0),
        
        // 顏色調整
        brightness: 0.0,
        contrast: 1.0,
        saturation: 1.0,
        
        // 強度控制
        rampIntensity: 1.0,
        
        // 進階控制
        invertRamp: 0.0,
        smoothness: 0.0,
        
        // 長方形 Ramp 控制
        rectangleAspect: new Vec2(1.0, 1.0),
        cornerRadius: 0.0,
        
        // 扭曲變形控制
        distortionIntensity: 0.0,
        distortionFrequency: 5.0,
    };
    
    /**
     * 重置材質的所有 Ramp Shader 參數到預設值
     * @param material 要重置的材質
     * @param passIndex Pass 索引 (預設 0)
     */
    public static resetToDefaults(material: Material, passIndex: number = 0): void {
        if (!material) {
            console.error('RampShaderHelper: Material is null or undefined');
            return;
        }
        
        try {
            // 主紋理 UV 控制
            material.setProperty('tilingOffset', this.DEFAULT_VALUES.tilingOffset.clone(), passIndex);
            material.setProperty('useMainTexture', this.DEFAULT_VALUES.useMainTexture, passIndex);
            
            // Ramp 紋理和顏色控制
            material.setProperty('useRampTexture', this.DEFAULT_VALUES.useRampTexture, passIndex);
            material.setProperty('colorStart', this.DEFAULT_VALUES.colorStart.clone(), passIndex);
            material.setProperty('colorEnd', this.DEFAULT_VALUES.colorEnd.clone(), passIndex);
            
            // Ramp 範圍控制
            material.setProperty('rampCenter', this.DEFAULT_VALUES.rampCenter.clone(), passIndex);
            material.setProperty('rampUVScale', this.DEFAULT_VALUES.rampUVScale.clone(), passIndex);
            material.setProperty('rampUVOffset', this.DEFAULT_VALUES.rampUVOffset.clone(), passIndex);
            material.setProperty('rampRange', this.DEFAULT_VALUES.rampRange.clone(), passIndex);
            
            // 顏色調整
            material.setProperty('brightness', this.DEFAULT_VALUES.brightness, passIndex);
            material.setProperty('contrast', this.DEFAULT_VALUES.contrast, passIndex);
            material.setProperty('saturation', this.DEFAULT_VALUES.saturation, passIndex);
            
            // 強度控制
            material.setProperty('rampIntensity', this.DEFAULT_VALUES.rampIntensity, passIndex);
            
            // 進階控制
            material.setProperty('invertRamp', this.DEFAULT_VALUES.invertRamp, passIndex);
            material.setProperty('smoothness', this.DEFAULT_VALUES.smoothness, passIndex);
            
            // 長方形 Ramp 控制
            material.setProperty('rectangleAspect', this.DEFAULT_VALUES.rectangleAspect.clone(), passIndex);
            material.setProperty('cornerRadius', this.DEFAULT_VALUES.cornerRadius, passIndex);
            
            // 扭曲變形控制
            material.setProperty('distortionIntensity', this.DEFAULT_VALUES.distortionIntensity, passIndex);
            material.setProperty('distortionFrequency', this.DEFAULT_VALUES.distortionFrequency, passIndex);
            
            console.log('RampShaderHelper: All parameters reset to defaults');
        } catch (error) {
            console.error('RampShaderHelper: Error resetting parameters', error);
        }
    }
    
    /**
     * 獲取特定參數的預設值
     * @param paramName 參數名稱
     * @returns 預設值
     */
    public static getDefaultValue(paramName: keyof typeof RampShaderHelper.DEFAULT_VALUES): any {
        const value = this.DEFAULT_VALUES[paramName];
        
        // 如果是對象類型,返回克隆以避免修改原始值
        if (value instanceof Vec2 || value instanceof Vec4 || value instanceof Color) {
            return value.clone();
        }
        
        return value;
    }
    
    /**
     * 批量設定參數
     * @param material 材質
     * @param params 參數對象
     * @param passIndex Pass 索引
     */
    public static setParameters(
        material: Material, 
        params: Partial<typeof RampShaderHelper.DEFAULT_VALUES>,
        passIndex: number = 0
    ): void {
        if (!material) {
            console.error('RampShaderHelper: Material is null or undefined');
            return;
        }
        
        for (const [key, value] of Object.entries(params)) {
            try {
                material.setProperty(key, value, passIndex);
            } catch (error) {
                console.error(`RampShaderHelper: Error setting parameter ${key}`, error);
            }
        }
    }
    
    /**
     * 打印當前材質的所有參數值 (用於調試)
     * @param material 材質
     * @param passIndex Pass 索引
     */
    public static logCurrentValues(material: Material, passIndex: number = 0): void {
        if (!material) {
            console.error('RampShaderHelper: Material is null or undefined');
            return;
        }
        
        console.log('=== RampColorShader Current Values ===');
        
        for (const key of Object.keys(this.DEFAULT_VALUES)) {
            try {
                const value = material.getProperty(key, passIndex);
                console.log(`${key}:`, value);
            } catch (error) {
                console.log(`${key}: Unable to get value`);
            }
        }
        
        console.log('=====================================');
    }
}
