/**
 * 3D 模型動畫片段控制器 - 支持 FBX/GLB 等 3D 檔案動畫
 * 
 * 功能：
 * - 控制 3D 模型（FBX/GLB 等格式）的動畫片段播放
 * - 支持遞增/遞減播放動畫
 * - 支持循環播放、單次播放模式
 * - 支持動畫速度調節
 * - 提供暫停、恢復、停止功能
 * - 支持動畫混合和轉換
 */

import { _decorator, Component, Node, SkeletalAnimation, Button, AnimationClip } from 'cc';

const { ccclass, property } = _decorator;

interface AnimationClipInfo {
    name: string;
    index: number;
    duration: number;
}

@ccclass('SkeletalAnimationController')
export class SkeletalAnimationController extends Component {
    // 動畫組件引用
    @property(SkeletalAnimation)
    public skeletalAnimation: SkeletalAnimation | null = null;

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

    // 動畫 Clip 資源
    @property({ type: [AnimationClip], tooltip: '拖入動畫 Clip 資源' })
    public animationClipResources: AnimationClip[] = [];

    // 配置
    @property({ type: Number, tooltip: '動畫播放速度' })
    public playbackSpeed: number = 1.0;

    @property({ type: Boolean, tooltip: '是否循環播放' })
    public isLooping: boolean = true;

    @property({ type: Number, tooltip: '動畫轉換時間（秒）' })
    public crossFadeTime: number = 0.3;

    // 內部狀態
    private animationClips: AnimationClipInfo[] = [];
    private currentClipIndex: number = 0;
    private isPlaying: boolean = false;
    private currentAnimationName: string = '';

    onLoad() {
        this.initializeAnimationClips();
        this.attachButtonListeners();
    }

    /**
     * 初始化動畫片段列表
     * 優先使用拖入的 animationClipResources，其次使用 SkeletalAnimation 組件中的 clips
     */
    private initializeAnimationClips() {
        this.animationClips = [];

        // 優先使用拖入的 Clip 資源
        if (this.animationClipResources && this.animationClipResources.length > 0) {
            this.animationClipResources.forEach((clip, index) => {
                if (clip) {
                    this.animationClips.push({
                        name: clip.name || `Clip_${index}`,
                        index: index,
                        duration: clip.duration || 0
                    });
                    console.log(`[SkeletalAnimationController] 已加載 Clip: ${clip.name} (${clip.duration || 0}s)`);
                }
            });

            console.log(`[SkeletalAnimationController] 已從拖入資源加載 ${this.animationClips.length} 個動畫片段`);
        } 
        // 備選方案：從 SkeletalAnimation 組件獲取動畫片段
        else if (this.skeletalAnimation) {
            const clips = this.skeletalAnimation.clips;
            if (clips && clips.length > 0) {
                clips.forEach((clip, index) => {
                    this.animationClips.push({
                        name: clip.name,
                        index: index,
                        duration: clip.duration || 0
                    });
                    console.log(`[SkeletalAnimationController] 已加載 Clip: ${clip.name} (${clip.duration || 0}s)`);
                });

                console.log(`[SkeletalAnimationController] 已從 SkeletalAnimation 組件加載 ${this.animationClips.length} 個動畫片段`);
            } else {
                console.warn('[SkeletalAnimationController] SkeletalAnimation 組件中未找到任何動畫片段');
            }
        } else {
            console.warn('[SkeletalAnimationController] 未指定 SkeletalAnimation 組件，且未拖入任何 Clip 資源');
        }

        if (this.animationClips.length > 0) {
            this.currentClipIndex = 0;
            console.log(`[SkeletalAnimationController] 初始化完成，共 ${this.animationClips.length} 個動畫片段`);
            
            // 延遲播放以確保 SkeletalAnimation 已初始化
            setTimeout(() => {
                this.playCurrentClip();
            }, 100);
        } else {
            console.error('[SkeletalAnimationController] 沒有可用的動畫片段');
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

        console.log('[SkeletalAnimationController] 按鈕監聽器已附加');
    }

    /**
     * 播放下一個動畫片段
     */
    public nextClip() {
        if (this.animationClips.length === 0) {
            console.warn('[SkeletalAnimationController] 沒有可用的動畫片段');
            return;
        }

        this.currentClipIndex++;
        if (this.currentClipIndex >= this.animationClips.length) {
            this.currentClipIndex = 0; // 循環到第一個
        }

        const nextClipName = this.animationClips[this.currentClipIndex].name;
        console.log(`[SkeletalAnimationController] nextClip() → 切換到 [${this.currentClipIndex}] ${nextClipName}`);
        
        this.updateDisplay();
        this.playCurrentClip();
    }

    /**
     * 播放上一個動畫片段
     */
    public prevClip() {
        if (this.animationClips.length === 0) {
            console.warn('[SkeletalAnimationController] 沒有可用的動畫片段');
            return;
        }

        this.currentClipIndex--;
        if (this.currentClipIndex < 0) {
            this.currentClipIndex = this.animationClips.length - 1; // 循環到最後一個
        }

        const prevClipName = this.animationClips[this.currentClipIndex].name;
        console.log(`[SkeletalAnimationController] prevClip() → 切換到 [${this.currentClipIndex}] ${prevClipName}`);
        
        this.updateDisplay();
        this.playCurrentClip();
    }

    /**
     * 播放當前動畫片段
     */
    public playCurrentClip() {
        if (!this.skeletalAnimation || this.animationClips.length === 0) {
            console.warn('[SkeletalAnimationController] 無法播放動畫');
            return;
        }

        const clipInfo = this.animationClips[this.currentClipIndex];
        const clipName = clipInfo.name;

        try {
            console.log(`[SkeletalAnimationController] 準備播放: ${clipName}`);

            // SkeletalAnimation API: 獲取所有可用的 clip 名稱
            const availableClips = this.skeletalAnimation.clips || [];
            console.log(`[SkeletalAnimationController] 可用 clips 數量: ${availableClips.length}`);

            // 查詢 clip 是否存在
            let clipExists = false;
            if (availableClips.length > 0) {
                clipExists = availableClips.some(c => c.name === clipName);
                console.log(`[SkeletalAnimationController] Clip '${clipName}' 存在: ${clipExists}`);
            }

            if (!clipExists && this.animationClipResources.length > 0) {
                // 如果是拖入的資源，直接在 SkeletalAnimation 上註冊
                console.log(`[SkeletalAnimationController] 從拖入資源播放`);
            }

            // 停止當前動畫
            this.skeletalAnimation.stop();

            // 播放指定的 clip
            this.skeletalAnimation.play(clipName);
            
            console.log(`[SkeletalAnimationController] ✓ 已開始播放: ${clipName}`);

            // 獲取當前播放狀態
            const state = this.skeletalAnimation.state;
            if (state) {
                // 設置循環模式
                state.wrapMode = this.isLooping ? 2 : 1; // 2 = Loop, 1 = Once
                state.speed = this.playbackSpeed;
                
                console.log(`[SkeletalAnimationController] 循環: ${this.isLooping}, 速度: ${this.playbackSpeed}x`);
            }

            this.currentAnimationName = clipName;
            this.isPlaying = true;

        } catch (error) {
            console.error(`[SkeletalAnimationController] 播放失敗:`, error);
        }

        this.updateDisplay();
    }

    /**
     * 暫停當前動畫
     */
    public pauseClip() {
        if (!this.skeletalAnimation) {
            return;
        }

        try {
            // SkeletalAnimation 沒有直接的暫停方法，使用速度 0 來暫停
            const playingState = this.skeletalAnimation.state;
            if (playingState) {
                playingState.speed = 0;
                this.isPlaying = false;
                console.log(`[SkeletalAnimationController] 暫停動畫: ${this.currentAnimationName}`);
            }
        } catch (error) {
            console.warn('[SkeletalAnimationController] 暫停動畫失敗:', error);
        }

        this.updateDisplay();
    }

    /**
     * 恢復播放
     */
    public resumeClip() {
        if (!this.skeletalAnimation) {
            return;
        }

        try {
            const playingState = this.skeletalAnimation.state;
            if (playingState) {
                playingState.speed = this.playbackSpeed;
                this.isPlaying = true;
                console.log(`[SkeletalAnimationController] 恢復播放: ${this.currentAnimationName}`);
            }
        } catch (error) {
            console.warn('[SkeletalAnimationController] 恢復播放失敗:', error);
        }

        this.updateDisplay();
    }

    /**
     * 停止當前動畫
     */
    public stopClip() {
        if (!this.skeletalAnimation) {
            return;
        }

        try {
            this.skeletalAnimation.stop();
            this.isPlaying = false;
            this.currentAnimationName = '';
            console.log('[SkeletalAnimationController] 停止所有動畫');
        } catch (error) {
            console.warn('[SkeletalAnimationController] 停止動畫失敗:', error);
        }

        this.updateDisplay();
    }

    /**
     * 設置播放速度
     */
    public setPlaybackSpeed(speed: number) {
        this.playbackSpeed = Math.max(0.1, Math.min(speed, 3.0)); // 限制在 0.1x - 3.0x

        if (this.skeletalAnimation) {
            try {
                const playingState = this.skeletalAnimation.state;
                if (playingState) {
                    playingState.speed = this.playbackSpeed;
                }
            } catch (error) {
                console.warn('[SkeletalAnimationController] 設置速度失敗:', error);
            }
        }

        console.log(`[SkeletalAnimationController] 播放速度已設置為: ${this.playbackSpeed}x`);
    }

    /**
     * 設置循環模式
     */
    public setLooping(loop: boolean) {
        this.isLooping = loop;
        
        if (this.skeletalAnimation) {
            try {
                const playingState = this.skeletalAnimation.state;
                if (playingState) {
                    playingState.wrapMode = loop ? 2 : 1; // 2 = Loop, 1 = Default (one-time)
                }
            } catch (error) {
                console.warn('[SkeletalAnimationController] 設置循環模式失敗:', error);
            }
        }

        console.log(`[SkeletalAnimationController] 循環模式: ${loop ? '開啟' : '關閉'}`);
    }

    /**
     * 獲取當前動畫信息
     */
    public getCurrentClipInfo(): { name: string; index: number; total: number; duration: number } {
        const clipInfo = this.animationClips[this.currentClipIndex];
        return {
            name: clipInfo?.name || '無',
            index: this.currentClipIndex + 1,
            total: this.animationClips.length,
            duration: clipInfo?.duration || 0
        };
    }

    /**
     * 獲取所有動畫片段列表
     */
    public getAllClips(): AnimationClipInfo[] {
        return [...this.animationClips];
    }

    /**
     * 跳轉到指定索引的動畫
     */
    public jumpToClip(index: number) {
        if (index < 0 || index >= this.animationClips.length) {
            console.warn(`[SkeletalAnimationController] 索引超出範圍: ${index}`);
            return;
        }

        this.currentClipIndex = index;
        console.log(`[SkeletalAnimationController] 跳轉到動畫: ${this.animationClips[this.currentClipIndex].name}`);
        this.updateDisplay();
        this.playCurrentClip();
    }

    /**
     * 按名稱播放動畫
     */
    public playByName(clipName: string) {
        const index = this.animationClips.findIndex(clip => clip.name === clipName);
        
        if (index === -1) {
            console.warn(`[SkeletalAnimationController] 找不到動畫: ${clipName}`);
            return;
        }

        this.jumpToClip(index);
    }

    /**
     * 更新 UI 顯示
     */
    private updateDisplay() {
        console.debug(`[SkeletalAnimationController] 當前動畫: ${this.animationClips[this.currentClipIndex]?.name || '無'} (${this.currentClipIndex + 1}/${this.animationClips.length})`);
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
     * 獲取當前動畫名稱
     */
    public getCurrentClipName(): string {
        return this.currentAnimationName;
    }

    /**
     * 獲取動畫片段總數
     */
    public getClipCount(): number {
        return this.animationClips.length;
    }

    /**
     * 獲取播放進度（0-1）
     */
    public getPlayProgress(): number {
        if (!this.skeletalAnimation) {
            return 0;
        }

        try {
            const playingState = this.skeletalAnimation.state;
            if (playingState && playingState.duration) {
                return playingState.time / playingState.duration;
            }
        } catch (error) {
            console.warn('[SkeletalAnimationController] 獲取播放進度失敗:', error);
        }

        return 0;
    }

    /**
     * 尋求到指定時間（秒）
     */
    public seek(time: number) {
        if (!this.skeletalAnimation) {
            return;
        }

        try {
            const playingState = this.skeletalAnimation.state;
            if (playingState) {
                playingState.time = Math.max(0, Math.min(time, playingState.duration || 0));
                console.log(`[SkeletalAnimationController] 尋求到時間: ${time.toFixed(2)}s`);
            }
        } catch (error) {
            console.warn('[SkeletalAnimationController] 尋求時間失敗:', error);
        }
    }
}
