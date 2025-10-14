// 使用範例腳本
// 示範各種 Displacement 效果的應用場景

import { _decorator, Component, Texture2D, tween, Vec4 } from 'cc';
import { DisplacementDistortion } from './DisplacementDistortion';
const { ccclass, property } = _decorator;

@ccclass('DisplacementEffectExamples')
export class DisplacementEffectExamples extends Component {
    
    @property({ type: DisplacementDistortion })
    displacement: DisplacementDistortion | null = null;
    
    private time: number = 0;
    
    start() {
        // 取消註解以測試不同效果
        // this.heatWaveEffect();
        // this.underwaterEffect();
        // this.shockwaveEffect();
        // this.pulseEffect();
    }
    
    /**
     * 熱浪效果
     * 快速波動的扭曲,模擬熱氣上升
     */
    heatWaveEffect() {
        if (!this.displacement) return;
        
        this.displacement.displacementStrength = 0.05;
        this.displacement.displacementScale = 2.0;
        this.displacement.timeSpeed = 2.0;
        this.displacement.distortionType = 2; // Y 軸
    }
    
    /**
     * 水下效果
     * 緩慢的波動,模擬水下視覺
     */
    underwaterEffect() {
        if (!this.displacement) return;
        
        this.displacement.displacementStrength = 0.03;
        this.displacement.displacementScale = 1.5;
        this.displacement.timeSpeed = 0.5;
        this.displacement.distortionType = 0; // XY
    }
    
    /**
     * 衝擊波效果
     * 從中心向外擴散的扭曲
     */
    shockwaveEffect() {
        if (!this.displacement) return;
        
        this.displacement.distortionType = 3; // 徑向
        
        // 使用 Tween 製作衝擊波動畫
        tween(this.displacement)
            .to(0.5, { displacementStrength: 0.3 }, { 
                easing: 'quadOut'
            })
            .to(0.5, { displacementStrength: 0 })
            .start();
    }
    
    /**
     * 脈動效果
     * 週期性的強度變化
     */
    pulseEffect() {
        if (!this.displacement) return;
        
        this.displacement.displacementScale = 1.0;
        this.displacement.timeSpeed = 0.0;
        this.displacement.distortionType = 0;
    }
    
    update(dt: number) {
        // 如果使用 pulseEffect,在這裡更新
        if (this.displacement) {
            this.time += dt;
            const strength = Math.sin(this.time * 2.0) * 0.5 + 0.5;
            // this.displacement.setStrength(strength * 0.1);
        }
    }
    
    /**
     * 觸發爆炸效果
     * 可以在遊戲事件中調用
     */
    public triggerExplosion() {
        if (!this.displacement) return;
        
        this.displacement.distortionType = 3; // 徑向
        this.displacement.setStrength(0);
        
        tween(this.displacement)
            .to(0.2, { displacementStrength: 0.4 }, { easing: 'quadOut' })
            .to(0.8, { displacementStrength: 0 }, { easing: 'quadIn' })
            .start();
    }
    
    /**
     * 觸發擊中效果
     */
    public triggerHitEffect() {
        if (!this.displacement) return;
        
        this.displacement.distortionType = 0; // XY
        
        tween(this.displacement)
            .to(0.1, { displacementStrength: 0.2 })
            .to(0.3, { displacementStrength: 0 })
            .start();
    }
    
    /**
     * 動態切換扭曲模式
     */
    public switchDistortionMode(mode: number) {
        if (!this.displacement) return;
        this.displacement.distortionType = mode;
    }
}
