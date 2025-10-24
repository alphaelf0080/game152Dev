import { _decorator, Component, sp, Color, log } from 'cc';
const { ccclass, property } = _decorator;
const { spine } = sp;

/**
 * 色彩混合模式枚舉（對應 Spine 的 BlendMode）
 */
export enum ColorBlendMode {
    NORMAL = 0,      // 正常混合 (sp.spine.BlendMode.Normal)
    ADDITIVE = 1,    // 加法混合（發光疊加）(sp.spine.BlendMode.Additive)
    MULTIPLY = 2,    // 乘法混合（變暗）(sp.spine.BlendMode.Multiply)
    SCREEN = 3       // 屏幕混合（變亮）(sp.spine.BlendMode.Screen)
}

/**
 * 淡入淡出色彩組態
 */
@ccclass('FadeColorConfig')
class FadeColorConfig {
    // Fade In 相關
    @property({ displayName: '淡入開始幀數' })
    fadeInStartFrame: number = 0;
    
    @property({ displayName: '淡入結束幀數' })
    fadeInEndFrame: number = 30;
    
    @property({ type: Color, displayName: '淡入開始色彩' })
    fadeInStartColor: Color = new Color(255, 255, 255, 0);
    
    @property({ type: Color, displayName: '淡入結束色彩' })
    fadeInEndColor: Color = new Color(255, 255, 255, 255);

    // Fade Out 相關
    @property({ displayName: '淡出開始幀數' })
    fadeOutStartFrame: number = 60;
    
    @property({ displayName: '淡出結束幀數' })
    fadeOutEndFrame: number = 90;
    
    @property({ type: Color, displayName: '淡出開始色彩' })
    fadeOutStartColor: Color = new Color(255, 255, 255, 255);
    
    @property({ type: Color, displayName: '淡出結束色彩' })
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
 * - 播放速度控制
 * - 正播/倒播控制
 * 
 * 用法:
 * - 在包含 sp.Skeleton 的節點上新增此組件
 * - 設定 FadeColorConfig 的四個時間點和對應的色彩
 * - 調整播放速度和方向
 */
@ccclass('SkeletonColorController')
export class SkeletonColorController extends Component {
    private skeletonComponent: sp.Skeleton | null = null;
    
    @property({ type: FadeColorConfig, displayName: '淡入淡出設定' })
    fadeConfig: FadeColorConfig = new FadeColorConfig();
    
    @property({ displayName: '自動播放淡入淡出' })
    autoPlay: boolean = false;
    
    @property({ displayName: '循環播放' })
    loop: boolean = true;
    
    // 播放控制
    @property({ displayName: '播放速度', range: [0.1, 5.0, 0.1], slide: true })
    playbackSpeed: number = 1.0;
    
    @property({ displayName: '倒播', tooltip: '勾選啟用倒播，取消勾選為正播\n⚠️ 必須同時勾選「控制骨骼動畫時間軸」才會影響骨骼動畫' })
    reversePlay: boolean = false;
    
    @property({ displayName: '控制骨骼動畫時間軸', tooltip: '啟用後會直接控制 sp.Skeleton 的動畫播放\n勾選此項後，播放速度和倒播才會影響骨骼動畫' })
    controlSkeletonAnimation: boolean = false;
    
    // Color Blend Mode 控制
    @property({ type: ColorBlendMode, displayName: '色彩混合模式', tooltip: '選擇骨骼的色彩混合模式\nNormal: 正常\nAdditive: 發光疊加\nMultiply: 變暗\nScreen: 變亮' })
    colorBlendMode: ColorBlendMode = ColorBlendMode.NORMAL;
    
    private isPlayingFadeAnimation: boolean = false;
    private currentFrame: number = 0;
    private lastReversePlay: boolean = false;
    private lastPlaybackSpeed: number = 1.0;
    private lastColorBlendMode: ColorBlendMode = ColorBlendMode.NORMAL;
    
    // 骨骼動畫控制
    private currentTrackEntry: sp.spine.TrackEntry | null = null;
    private animationDuration: number = 0;
    private currentAnimTime: number = 0;

    onLoad() {
        // Get the sp.Skeleton component on the same node
        this.skeletonComponent = this.node.getComponent(sp.Skeleton);
        
        if (!this.skeletonComponent) {
            log(`[SkeletonColorController] No sp.Skeleton component found on node: ${this.node.name}`);
        } else {
            // 初始化播放控制
            this.lastReversePlay = this.reversePlay;
            this.lastPlaybackSpeed = this.playbackSpeed;
            this.lastColorBlendMode = this.colorBlendMode;
            
            // 獲取當前動畫信息
            this.initializeAnimationInfo();
            
            this.applyPlaybackSettings();
            
            // 應用初始混合模式
            this.applyColorBlendMode(this.colorBlendMode);
        }
        
        // 如果設定為自動播放，則啟動動畫
        if (this.autoPlay) {
            this.startFadeAnimation();
        }
    }

    update(deltaTime: number) {
        // 檢測播放設定是否改變
        if (this.reversePlay !== this.lastReversePlay || this.playbackSpeed !== this.lastPlaybackSpeed) {
            this.applyPlaybackSettings();
            this.lastReversePlay = this.reversePlay;
            this.lastPlaybackSpeed = this.playbackSpeed;
        }
        
        // 每幀持續應用混合模式（Spine 渲染可能會重置）
        if (this.skeletonComponent && this.skeletonComponent.skeleton) {
            this.applyColorBlendModeToSlots(this.colorBlendMode);
        }
        
        // 檢測混合模式是否改變（用於 log 和 premultipliedAlpha 設置）
        if (this.colorBlendMode !== this.lastColorBlendMode) {
            this.applyColorBlendMode(this.colorBlendMode);
            this.lastColorBlendMode = this.colorBlendMode;
        }
        
        // 手動控制骨骼動畫時間（倒播模式）
        if (this.controlSkeletonAnimation && this.reversePlay && this.currentTrackEntry) {
            this.updateReverseAnimation(deltaTime);
        }
        
        if (this.isPlayingFadeAnimation) {
            this.currentFrame += deltaTime * 60; // Assuming 60 FPS
            
            // 檢查是否需要循環
            if (this.loop && this.currentFrame > this.fadeConfig.fadeOutEndFrame) {
                this.currentFrame = this.fadeConfig.fadeInStartFrame;
            }
            
            this.updateFadeColor(); // 更新色彩
        }
    }

    /**
     * 開始淡入淡出動畫（從頭開始）
     */
    public startFadeAnimation() {
        this.currentFrame = this.fadeConfig.fadeInStartFrame;
        this.isPlayingFadeAnimation = true;
        this.updateFadeColor();
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
        // 淡入和淡出之間 - 保持淡入結束色彩
        else if (this.currentFrame > config.fadeInEndFrame && this.currentFrame < config.fadeOutStartFrame) {
            targetColor = new Color(
                config.fadeInEndColor.r,
                config.fadeInEndColor.g,
                config.fadeInEndColor.b,
                config.fadeInEndColor.a
            );
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

    // ============================================================
    // 播放控制方法
    // ============================================================

    /**
     * 應用播放設定（速度和方向）
     */
    private applyPlaybackSettings() {
        if (!this.skeletonComponent) return;

        if (this.controlSkeletonAnimation) {
            if (this.reversePlay) {
                // 倒播模式：暫停自動播放，手動控制時間
                this.skeletonComponent.paused = false;
                this.skeletonComponent.timeScale = 0; // 停止自動更新
                log(`[SkeletonColorController] 播放設定已更新 - 倒播模式啟動 (速度: ${this.playbackSpeed}x)`);
            } else {
                // 正播模式：使用正常的 timeScale
                this.skeletonComponent.paused = false;
                this.skeletonComponent.timeScale = this.playbackSpeed;
                log(`[SkeletonColorController] 播放設定已更新 - 正播模式 (速度: ${this.playbackSpeed}x)`);
            }
        } else {
            // 不控制骨骼動畫時，確保正常播放
            this.skeletonComponent.paused = false;
            this.skeletonComponent.timeScale = 1.0;
            log(`[SkeletonColorController] 播放設定已更新 - 僅色彩動畫 (速度: ${this.playbackSpeed}, 方向: ${this.reversePlay ? '倒播' : '正播'})`);
        }
    }

    /**
     * 初始化動畫信息
     */
    private initializeAnimationInfo() {
        if (!this.skeletonComponent) return;

        // 獲取當前播放的動畫軌道
        const state = this.skeletonComponent.getState();
        if (state) {
            this.currentTrackEntry = state.getCurrent(0);
            if (this.currentTrackEntry && this.currentTrackEntry.animation) {
                this.animationDuration = this.currentTrackEntry.animation.duration;
                this.currentAnimTime = this.animationDuration; // 倒播從結尾開始
                log(`[SkeletonColorController] 動畫信息已初始化 - 時長: ${this.animationDuration}秒`);
            }
        }
    }

    /**
     * 更新倒播動畫
     */
    private updateReverseAnimation(deltaTime: number) {
        if (!this.currentTrackEntry || !this.skeletonComponent) return;

        // 重新獲取當前軌道（可能已改變）
        const state = this.skeletonComponent.getState();
        if (state) {
            this.currentTrackEntry = state.getCurrent(0);
        }

        if (!this.currentTrackEntry) {
            this.initializeAnimationInfo();
            return;
        }

        // 更新動畫時長
        if (this.currentTrackEntry.animation) {
            this.animationDuration = this.currentTrackEntry.animation.duration;
        }

        // 向後更新時間（倒播）
        this.currentAnimTime -= deltaTime * this.playbackSpeed;

        // 處理循環
        if (this.currentAnimTime < 0) {
            if (this.loop || this.currentTrackEntry.loop) {
                this.currentAnimTime = this.animationDuration;
            } else {
                this.currentAnimTime = 0;
            }
        }

        // 手動設置動畫時間
        this.currentTrackEntry.trackTime = this.currentAnimTime;
        
        // 強制更新骨骼
        this.skeletonComponent.updateWorldTransform();
    }

    /**
     * 設定播放速度
     * @param speed 播放速度倍數 (0.1 ~ 5.0)
     */
    public setPlaybackSpeed(speed: number) {
        this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
        this.applyPlaybackSettings();
    }

    /**
     * 取得當前播放速度
     */
    public getPlaybackSpeed(): number {
        return this.playbackSpeed;
    }

    /**
     * 設定播放方向
     * @param reverse true 為倒播，false 為正播
     */
    public setReversePlay(reverse: boolean) {
        this.reversePlay = reverse;
        this.applyPlaybackSettings();
    }

    /**
     * 取得當前播放方向
     * @returns true 為倒播，false 為正播
     */
    public isReversePlaying(): boolean {
        return this.reversePlay;
    }

    /**
     * 切換播放方向
     */
    public togglePlayDirection() {
        this.reversePlay = !this.reversePlay;
        this.applyPlaybackSettings();
    }

    /**
     * 設定是否控制骨骼動畫時間軸
     * @param control true 為控制骨骼動畫，false 為僅控制色彩動畫
     */
    public setControlSkeletonAnimation(control: boolean) {
        this.controlSkeletonAnimation = control;
        if (!control && this.skeletonComponent) {
            // 如果不控制骨骼動畫，重置 timeScale
            this.skeletonComponent.timeScale = 1.0;
        }
        this.applyPlaybackSettings();
    }

    /**
     * 暫停骨骼動畫
     */
    public pauseSkeletonAnimation() {
        if (this.skeletonComponent && this.controlSkeletonAnimation) {
            this.skeletonComponent.paused = true;
            log('[SkeletonColorController] 骨骼動畫已暫停');
        }
    }

    /**
     * 恢復骨骼動畫
     */
    public resumeSkeletonAnimation() {
        if (this.skeletonComponent && this.controlSkeletonAnimation) {
            this.skeletonComponent.paused = false;
            log('[SkeletonColorController] 骨骼動畫已恢復');
        }
    }

    /**
     * 停止骨骼動畫
     */
    public stopSkeletonAnimation() {
        if (this.skeletonComponent) {
            this.skeletonComponent.clearTracks();
            log('[SkeletonColorController] 骨骼動畫已停止');
        }
    }

    // ============================================================
    // Color Blend Mode 控制
    // ============================================================

    /**
     * 僅應用混合模式到 slots（每幀調用）
     * @param mode 混合模式
     */
    private applyColorBlendModeToSlots(mode: ColorBlendMode) {
        if (!this.skeletonComponent || !this.skeletonComponent.skeleton) {
            return;
        }

        // 將 ColorBlendMode 映射到 Spine 的 BlendMode 數值
        let spineBlendModeValue: number;
        
        switch (mode) {
            case ColorBlendMode.NORMAL:
                spineBlendModeValue = 0; // spine.BlendMode.Normal
                break;
            case ColorBlendMode.ADDITIVE:
                spineBlendModeValue = 1; // spine.BlendMode.Additive
                break;
            case ColorBlendMode.MULTIPLY:
                spineBlendModeValue = 2; // spine.BlendMode.Multiply
                break;
            case ColorBlendMode.SCREEN:
                spineBlendModeValue = 3; // spine.BlendMode.Screen
                break;
            default:
                spineBlendModeValue = 0;
                break;
        }

        // 對所有 slot 應用混合模式
        const skeleton = this.skeletonComponent.skeleton;
        const slots = skeleton.slots;
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (slot && slot.data) {
                (slot.data as any).blendMode = spineBlendModeValue;
            }
        }
    }

    /**
     * 應用色彩混合模式（使用 Spine Skeleton 的 premultipliedAlpha + blendMode）
     * @param mode 混合模式
     */
    private applyColorBlendMode(mode: ColorBlendMode) {
        if (!this.skeletonComponent) {
            log('[SkeletonColorController] ⚠️ 無法套用混合模式：skeleton 組件未找到');
            return;
        }

        // 根據混合模式調整 premultipliedAlpha
        // Additive 模式需要關閉 premultipliedAlpha
        if (mode === ColorBlendMode.ADDITIVE) {
            this.skeletonComponent.premultipliedAlpha = false;
            log('[SkeletonColorController] 🎨 色彩混合模式: ADDITIVE (發光疊加) - 已關閉 premultipliedAlpha');
        } else {
            // 其他模式使用預乘 Alpha
            this.skeletonComponent.premultipliedAlpha = true;
        }

        // 獲取 Spine skeleton 實例
        const skeleton = this.skeletonComponent.skeleton;
        if (!skeleton) {
            log('[SkeletonColorController] ⚠️ 無法獲取 skeleton 實例');
            return;
        }

        let modeName = '';
        switch (mode) {
            case ColorBlendMode.NORMAL:
                modeName = 'NORMAL (正常)';
                break;
            case ColorBlendMode.ADDITIVE:
                modeName = 'ADDITIVE (發光疊加)';
                break;
            case ColorBlendMode.MULTIPLY:
                modeName = 'MULTIPLY (乘法變暗)';
                break;
            case ColorBlendMode.SCREEN:
                modeName = 'SCREEN (濾色變亮)';
                break;
        }
        
        log(`[SkeletonColorController] 🎨 色彩混合模式: ${modeName}`);

        // 立即應用一次到 slots
        this.applyColorBlendModeToSlots(mode);
        
        // 強制更新 skeleton 狀態
        if (this.skeletonComponent.isAnimationCached()) {
            this.skeletonComponent.invalidAnimationCache();
        }
        
        // 標記需要更新渲染數據
        this.skeletonComponent.markForUpdateRenderData();
        
        log(`[SkeletonColorController] ✅ 色彩混合模式已套用到 ${skeleton.slots.length} 個 slots`);
    }

    /**
     * 設定色彩混合模式
     * @param mode 混合模式
     */
    public setColorBlendMode(mode: ColorBlendMode) {
        this.colorBlendMode = mode;
        this.applyColorBlendMode(mode);
    }

    /**
     * 取得當前色彩混合模式
     */
    public getColorBlendMode(): ColorBlendMode {
        return this.colorBlendMode;
    }
}


