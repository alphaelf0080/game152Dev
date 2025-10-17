import { _decorator, Component, Sprite, Button, Material } from 'cc';
import { RampShaderHelper } from './RampShaderHelper';

const { ccclass, property, requireComponent } = _decorator;

/**
 * RampShader 控制組件
 * 提供一鍵重置功能
 */
@ccclass('RampShaderController')
@requireComponent(Sprite)
export class RampShaderController extends Component {
    
    @property(Button)
    resetButton: Button | null = null;
    
    private sprite: Sprite | null = null;
    
    protected onLoad(): void {
        this.sprite = this.getComponent(Sprite);
        
        // 如果有指定重置按鈕,綁定點擊事件
        if (this.resetButton) {
            this.resetButton.node.on(Button.EventType.CLICK, this.onResetButtonClick, this);
        }
    }
    
    protected onDestroy(): void {
        if (this.resetButton) {
            this.resetButton.node.off(Button.EventType.CLICK, this.onResetButtonClick, this);
        }
    }
    
    /**
     * 重置按鈕點擊事件
     */
    private onResetButtonClick(): void {
        this.resetShaderToDefaults();
    }
    
    /**
     * 重置 Shader 參數到預設值
     */
    public resetShaderToDefaults(): void {
        if (!this.sprite || !this.sprite.customMaterial) {
            console.warn('RampShaderController: No custom material found');
            return;
        }
        
        RampShaderHelper.resetToDefaults(this.sprite.customMaterial);
        console.log('Shader parameters reset to defaults');
    }
    
    /**
     * 設定特定參數
     * @param paramName 參數名稱
     * @param value 參數值
     */
    public setShaderParameter(paramName: string, value: any): void {
        if (!this.sprite || !this.sprite.customMaterial) {
            console.warn('RampShaderController: No custom material found');
            return;
        }
        
        try {
            this.sprite.customMaterial.setProperty(paramName, value);
        } catch (error) {
            console.error(`Error setting parameter ${paramName}:`, error);
        }
    }
    
    /**
     * 獲取材質 (供外部使用)
     */
    public getMaterial(): Material | null {
        return this.sprite?.customMaterial || null;
    }
    
    /**
     * 打印當前參數值 (調試用)
     */
    public logCurrentParameters(): void {
        if (!this.sprite || !this.sprite.customMaterial) {
            console.warn('RampShaderController: No custom material found');
            return;
        }
        
        RampShaderHelper.logCurrentValues(this.sprite.customMaterial);
    }
}
