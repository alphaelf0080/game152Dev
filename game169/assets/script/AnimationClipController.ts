/**
 * 動畫片段控制器 - 支持遞增/遞減播放動畫
 * 
 * 功能：
 * - 為按鈕添加遞增/遞減動畫播放功能
 * - 支持循環播放、單次播放模式
 * - 支持動畫速度調節
 * - 提供暫停、恢復、停止功能
 */

import { _decorator, Component, Node, Animation, Button, Label, Node as CCNode } from 'cc';

const { ccclass, property } = _decorator;

interface AnimationClip {
    name: string;
    index: number;
}

@ccclass('AnimationClipController')
export class AnimationClipController extends Component {
    // 動畫組件引用
    @property(Animation)
    public animationComponent: Animation | null = null;

    // UI 按鈕引用
    @property(Button)
    public btnNext: Button | null = null; // 下一個動畫按鈕

    @property(Button)
    public btnPrev: Button | null = null; // 上一個動畫按鈕

    @property(Button)
    public btnPlay: Button | null = null; // 播放按鈕

    @property(Button)
    public btnPause: Button | null = null; // 暫停按鈕

    @property(Button)
    public btnStop: Button | null = null; // 停止按鈕

    // UI 標籤
    @property(Label)
    public labelClipName: Label | null = null; // 顯示當前動畫名稱

    @property(Label)
    public labelClipIndex: Label | null = null; // 顯示當前動畫索引

    // 配置
    @property({ type: Number, tooltip: '動畫播放速度' })
    public playbackSpeed: number = 1.0;

    @property({ type: Boolean, tooltip: '是否循環播放', default: true })
    public isLooping: boolean = true;

    // 內部狀態
    private animationClips: AnimationClip[] = [];
    private currentClipIndex: number = 0;
    private isPlaying: boolean = false;

    onLoad() {
        this.initializeAnimationClips();
        this.attachButtonListeners();
    }

    /**
     * 初始化動畫片段列表
     */
    private initializeAnimationClips() {
        if (!this.animationComponent) {
            console.warn('[AnimationClipController] 未指定 Animation 組件');
            return;
        }

        // 從 Animation 組件獲取所有動畫片段
        const clips = this.animationComponent.clips;
        this.animationClips = [];

        if (clips && clips.length > 0) {
            clips.forEach((clip, index) => {
                this.animationClips.push({
                    name: clip.name,
                    index: index
                });
            });

            console.log(`[AnimationClipController] 已加載 ${this.animationClips.length} 個動畫片段`);
            this.currentClipIndex = 0;
            this.updateDisplay();
        } else {
            console.warn('[AnimationClipController] 未找到任何動畫片段');
        }
    }

    /**
     * 附加按鈕監聽器
     */
    private attachButtonListeners() {
        if (this.btnNext) {
            this.btnNext.node.on(Button.EventType.click, () => this.nextClip());
        }

        if (this.btnPrev) {
            this.btnPrev.node.on(Button.EventType.click, () => this.prevClip());
        }

        if (this.btnPlay) {
            this.btnPlay.node.on(Button.EventType.click, () => this.playCurrentClip());
        }

        if (this.btnPause) {
            this.btnPause.node.on(Button.EventType.click, () => this.pauseClip());
        }

        if (this.btnStop) {
            this.btnStop.node.on(Button.EventType.click, () => this.stopClip());
        }

        console.log('[AnimationClipController] 按鈕監聽器已附加');
    }

    /**
     * 播放下一個動畫片段
     */
    public nextClip() {
        if (this.animationClips.length === 0) {
            console.warn('[AnimationClipController] 沒有可用的動畫片段');
            return;
        }

        this.currentClipIndex++;
        if (this.currentClipIndex >= this.animationClips.length) {
            this.currentClipIndex = 0; // 循環到第一個
        }

        console.log(`[AnimationClipController] 切換到下一個動畫: ${this.animationClips[this.currentClipIndex].name}`);
        this.updateDisplay();
        this.playCurrentClip();
    }

    /**
     * 播放上一個動畫片段
     */
    public prevClip() {
        if (this.animationClips.length === 0) {
            console.warn('[AnimationClipController] 沒有可用的動畫片段');
            return;
        }

        this.currentClipIndex--;
        if (this.currentClipIndex < 0) {
            this.currentClipIndex = this.animationClips.length - 1; // 循環到最後一個
        }

        console.log(`[AnimationClipController] 切換到上一個動畫: ${this.animationClips[this.currentClipIndex].name}`);
        this.updateDisplay();
        this.playCurrentClip();
    }

    /**
     * 播放當前動畫片段
     */
    public playCurrentClip() {
        if (!this.animationComponent || this.animationClips.length === 0) {
            console.warn('[AnimationClipController] 無法播放動畫');
            return;
        }

        const clipName = this.animationClips[this.currentClipIndex].name;
        const state = this.animationComponent.getState(clipName);

        if (state) {
            // 設置循環模式
            state.isMotionFrozen = false;
            state.speed = this.playbackSpeed;
            
            // 設置 wrapMode: 0 = Default, 1 = Once (無循環), 2 = Loop (循環)
            state.wrapMode = this.isLooping ? 2 : 1;

            // 播放動畫
            this.animationComponent.play(clipName);
            this.isPlaying = true;

            console.log(`[AnimationClipController] 播放動畫: ${clipName} (速度: ${this.playbackSpeed}x, 循環: ${this.isLooping})`);
        } else {
            console.warn(`[AnimationClipController] 找不到動畫狀態: ${clipName}`);
        }

        this.updateDisplay();
    }

    /**
     * 暫停當前動畫
     */
    public pauseClip() {
        if (!this.animationComponent) {
            return;
        }

        const clipName = this.animationClips[this.currentClipIndex]?.name;
        if (clipName) {
            const state = this.animationComponent.getState(clipName);
            if (state) {
                state.isMotionFrozen = true;
                this.isPlaying = false;
                console.log(`[AnimationClipController] 暫停動畫: ${clipName}`);
            }
        }

        this.updateDisplay();
    }

    /**
     * 停止當前動畫
     */
    public stopClip() {
        if (!this.animationComponent) {
            return;
        }

        this.animationComponent.stop();
        this.isPlaying = false;

        console.log('[AnimationClipController] 停止所有動畫');
        this.updateDisplay();
    }

    /**
     * 設置播放速度
     */
    public setPlaybackSpeed(speed: number) {
        this.playbackSpeed = Math.max(0.1, Math.min(speed, 3.0)); // 限制在 0.1x - 3.0x

        if (this.animationComponent && this.animationClips.length > 0) {
            const clipName = this.animationClips[this.currentClipIndex].name;
            const state = this.animationComponent.getState(clipName);
            if (state) {
                state.speed = this.playbackSpeed;
            }
        }

        console.log(`[AnimationClipController] 播放速度已設置為: ${this.playbackSpeed}x`);
    }

    /**
     * 設置循環模式
     */
    public setLooping(loop: boolean) {
        this.isLooping = loop;

        if (this.animationComponent && this.animationClips.length > 0) {
            const clipName = this.animationClips[this.currentClipIndex].name;
            const state = this.animationComponent.getState(clipName);
            if (state) {
                // 0 = Default, 1 = Once (無循環), 2 = Loop (循環)
                state.wrapMode = loop ? 2 : 1;
            }
        }

        console.log(`[AnimationClipController] 循環模式: ${loop ? '開啟' : '關閉'}`);
    }

    /**
     * 獲取當前動畫信息
     */
    public getCurrentClipInfo(): { name: string; index: number; total: number } {
        return {
            name: this.animationClips[this.currentClipIndex]?.name || '無',
            index: this.currentClipIndex + 1,
            total: this.animationClips.length
        };
    }

    /**
     * 獲取所有動畫片段列表
     */
    public getAllClips(): AnimationClip[] {
        return [...this.animationClips];
    }

    /**
     * 跳轉到指定索引的動畫
     */
    public jumpToClip(index: number) {
        if (index < 0 || index >= this.animationClips.length) {
            console.warn(`[AnimationClipController] 索引超出範圍: ${index}`);
            return;
        }

        this.currentClipIndex = index;
        console.log(`[AnimationClipController] 跳轉到動畫: ${this.animationClips[this.currentClipIndex].name}`);
        this.updateDisplay();
        this.playCurrentClip();
    }

    /**
     * 更新 UI 顯示
     */
    private updateDisplay() {
        if (this.labelClipName) {
            const clipName = this.animationClips[this.currentClipIndex]?.name || '無';
            this.labelClipName.string = `動畫: ${clipName}`;
        }

        if (this.labelClipIndex) {
            const indexText = `${this.currentClipIndex + 1} / ${this.animationClips.length}`;
            this.labelClipIndex.string = indexText;
        }

        console.debug(`[AnimationClipController] UI 已更新 - 當前: ${this.currentClipIndex + 1}/${this.animationClips.length}`);
    }

    /**
     * 獲取是否正在播放
     */
    public getIsPlaying(): boolean {
        return this.isPlaying;
    }

    /**
     * 獲取當前動畫索引
     */
    public getCurrentClipIndex(): number {
        return this.currentClipIndex;
    }

    /**
     * 獲取動畫片段總數
     */
    public getClipCount(): number {
        return this.animationClips.length;
    }
}
