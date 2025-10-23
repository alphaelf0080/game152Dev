import { _decorator, Component, sp, Color, log } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 淡入淡出色彩組態
 */
class FadeColorConfig {
    // Fade In 相關
    @property
    fadeInStartFrame: number = 0;
    
    @property
    fadeInEndFrame: number = 30;
    
    @property({ type: Color })
    fadeInStartColor: Color = new Color(255, 255, 255, 0);
    
    @property({ type: Color })
    fadeInEndColor: Color = new Color(255, 255, 255, 255);

    // Fade Out 相關
    @property
    fadeOutStartFrame: number = 60;
    
    @property
    fadeOutEndFrame: number = 90;
    
    @property({ type: Color })
    fadeOutStartColor: Color = new Color(255, 255, 255, 255);
    
    @property({ type: Color })
    fadeOutEndColor: Color = new Color(255, 255, 255, 0);
}

/**
 * SkeletonColorController
 * Spine 骨骼色彩控制器 - 控制同節點上的 sp.Skeleton 組件的顏色
 * 
 * 功能:
 * - 基本色彩設定與取得
 * - 色彩淡入淡出動畫 (Fade In/Out)
 * - 四個時間點的色彩控制 (淡入開始/結束, 淡出開始/結束)
 * 
 * 用法:
 * - 在包含 sp.Skeleton 的節點上新增此組件
 * - 設定 FadeColorConfig 的四個時間點和對應的色彩
 * - 呼叫 playFadeAnimation(currentFrame) 進行動畫播放
 */
@ccclass('SkeletonColorController')
export class SkeletonColorController extends Component {
    private skeletonComponent: sp.Skeleton | null = null;
    
    @property({ type: FadeColorConfig })
    fadeConfig: FadeColorConfig = new FadeColorConfig();
    
    private isPlayingFadeAnimation: boolean = false;
    private currentFrame: number = 0;

    onLoad() {
        // Get the sp.Skeleton component on the same node
        this.skeletonComponent = this.node.getComponent(sp.Skeleton);
        
        if (!this.skeletonComponent) {
            log(`[SkeletonColorController] No sp.Skeleton component found on node: ${this.node.name}`);
        }
    }

    update(deltaTime: number) {
        if (this.isPlayingFadeAnimation) {
            this.currentFrame += deltaTime * 60; // Assuming 60 FPS
        }
    }

    /**
     * 播放淡入淡出動畫
     * @param currentFrame 當前幀數
     */
    public playFadeAnimation(currentFrame: number) {
        this.currentFrame = currentFrame;
        this.isPlayingFadeAnimation = true;
        this.updateFadeColor();
    }

    /**
     * 停止淡入淡出動畫
     */
    public stopFadeAnimation() {
        this.isPlayingFadeAnimation = false;
    }

    /**
     * 根據當前幀數更新骨骼的淡入淡出色彩
     */
    private updateFadeColor() {
        const config = this.fadeConfig;
        let targetColor: Color;

        // 淡入階段
        if (this.currentFrame >= config.fadeInStartFrame && this.currentFrame <= config.fadeInEndFrame) {
            const fadeInProgress = (this.currentFrame - config.fadeInStartFrame) / 
                                   (config.fadeInEndFrame - config.fadeInStartFrame);
            targetColor = this.interpolateColor(config.fadeInStartColor, config.fadeInEndColor, fadeInProgress);
        }
        // 淡出階段
        else if (this.currentFrame >= config.fadeOutStartFrame && this.currentFrame <= config.fadeOutEndFrame) {
            const fadeOutProgress = (this.currentFrame - config.fadeOutStartFrame) / 
                                    (config.fadeOutEndFrame - config.fadeOutStartFrame);
            targetColor = this.interpolateColor(config.fadeOutStartColor, config.fadeOutEndColor, fadeOutProgress);
        }
        // 淡入之前 - 使用淡入開始色彩
        else if (this.currentFrame < config.fadeInStartFrame) {
            targetColor = new Color(
                config.fadeInStartColor.r,
                config.fadeInStartColor.g,
                config.fadeInStartColor.b,
                config.fadeInStartColor.a
            );
        }
        // 淡出之後 - 使用淡出結束色彩
        else {
            targetColor = new Color(
                config.fadeOutEndColor.r,
                config.fadeOutEndColor.g,
                config.fadeOutEndColor.b,
                config.fadeOutEndColor.a
            );
        }

        this.setSkeletonColor(targetColor);
    }

    /**
     * 在兩個色彩之間進行線性插值
     * @param colorA 起始色彩
     * @param colorB 結束色彩
     * @param progress 進度 (0 到 1)
     * @returns 插值後的色彩
     */
    private interpolateColor(colorA: Color, colorB: Color, progress: number): Color {
        progress = Math.max(0, Math.min(1, progress)); // 限制在 0-1 之間
        
        return new Color(
            Math.round(colorA.r + (colorB.r - colorA.r) * progress),
            Math.round(colorA.g + (colorB.g - colorA.g) * progress),
            Math.round(colorA.b + (colorB.b - colorA.b) * progress),
            Math.round(colorA.a + (colorB.a - colorA.a) * progress)
        );
    }

    /**
     * 根據骨骼動畫幀數自動更新淡入淡出效果
     * 適用於與 sp.Skeleton animation 同步
     * @param animationFrame 當前動畫幀數
     */
    public updateByAnimationFrame(animationFrame: number) {
        this.playFadeAnimation(animationFrame);
    }

    /**
     * Set the color of the skeleton
     * @param color The color to set
     */
    public setSkeletonColor(color: Color) {
        if (this.skeletonComponent) {
            this.skeletonComponent.color = color;
        }
    }

    /**
     * Get the current color of the skeleton
     * @returns The current color, or null if skeleton not found
     */
    public getSkeletonColor(): Color | null {
        if (this.skeletonComponent) {
            return this.skeletonComponent.color;
        }
        return null;
    }

    /**
     * Set skeleton color by RGB values (0-255)
     * @param r Red value (0-255)
     * @param g Green value (0-255)
     * @param b Blue value (0-255)
     * @param a Alpha value (0-255), default 255
     */
    public setSkeletonColorRGB(r: number, g: number, b: number, a: number = 255) {
        if (this.skeletonComponent) {
            this.skeletonComponent.color = new Color(r, g, b, a);
        }
    }

    /**
     * Tint the skeleton color with a multiplier
     * @param tintColor The tint color to apply
     */
    public tintSkeletonColor(tintColor: Color) {
        if (this.skeletonComponent) {
            const currentColor = this.skeletonComponent.color;
            const tintedColor = new Color(
                Math.round(currentColor.r * tintColor.r / 255),
                Math.round(currentColor.g * tintColor.g / 255),
                Math.round(currentColor.b * tintColor.b / 255),
                currentColor.a
            );
            this.skeletonComponent.color = tintedColor;
        }
    }

    /**
     * Reset the skeleton color to white (default)
     */
    public resetSkeletonColor() {
        if (this.skeletonComponent) {
            this.skeletonComponent.color = Color.WHITE;
        }
    }

    /**
     * Get reference to the skeleton component directly
     */
    public getSkeleton(): sp.Skeleton | null {
        return this.skeletonComponent;
    }
}
