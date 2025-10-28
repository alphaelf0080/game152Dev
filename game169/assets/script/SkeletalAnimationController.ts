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

import { _decorator, Component, Node, SkeletalAnimation, Button, Label, AnimationClip } from 'cc';

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

    // UI 標籤
    @property(Label)
    public labelClipName: Label | null = null; // 顯示當前動畫名稱

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
        this.validateSetup();
        this.initializeAnimationClips();
        this.attachButtonListeners();
        this.validateLabelSetup();
    }

    /**
     * 驗證所有必要組件是否已設置
     */
    private validateSetup() {
        console.log(`\n[SkeletalAnimationController] ========== Setup 驗證 ==========`);

        // 檢查 SkeletalAnimation
        if (!this.skeletalAnimation) {
            console.error(`[SkeletalAnimationController] ❌ CRITICAL: skeletalAnimation 未設置！`);
            console.error(`[SkeletalAnimationController]    請在 Inspector 中拖入 SkeletalAnimation 組件`);
        } else {
            console.log(`[SkeletalAnimationController] ✓ SkeletalAnimation 已設置: ${this.skeletalAnimation.name}`);
        }

        // 檢查按鈕
        if (!this.btnNext) {
            console.error(`[SkeletalAnimationController] ❌ btnNext 未設置！`);
        } else {
            console.log(`[SkeletalAnimationController] ✓ btnNext 已設置: ${this.btnNext.name}`);
        }

        if (!this.btnPrev) {
            console.error(`[SkeletalAnimationController] ❌ btnPrev 未設置！`);
        } else {
            console.log(`[SkeletalAnimationController] ✓ btnPrev 已設置: ${this.btnPrev.name}`);
        }

        // 檢查 Label
        if (!this.labelClipName) {
            console.error(`[SkeletalAnimationController] ❌ labelClipName 未設置！`);
        } else {
            console.log(`[SkeletalAnimationController] ✓ labelClipName 已設置: ${this.labelClipName.name}`);
        }

        // 檢查 Clip 資源
        if (!this.animationClipResources || this.animationClipResources.length === 0) {
            console.warn(`[SkeletalAnimationController] ⚠️ animationClipResources 為空`);
        } else {
            console.log(`[SkeletalAnimationController] ✓ 已配置 ${this.animationClipResources.length} 個 Clip 資源`);
        }

        console.log(`[SkeletalAnimationController] ========== 驗證完成 ==========\n`);
    }

    start() {
        // 在 start 中播放第一個動畫，確保所有組件都已初始化
        if (this.animationClips.length > 0) {
            console.log(`[SkeletalAnimationController] start() 開始自動播放第一個動畫...`);
            this.playCurrentClip();
        }
    }

    /**
     * 驗證 Label 設置
     */
    private validateLabelSetup() {
        console.log(`[SkeletalAnimationController] ===== Label 設置驗證 =====`);
        
        if (!this.labelClipName) {
            console.error(`[SkeletalAnimationController] ❌ CRITICAL: labelClipName 未設置！`);
            console.error(`[SkeletalAnimationController]    請在 Inspector 中拖入 Label 節點到 labelClipName 欄位`);
            return;
        }

        console.log(`[SkeletalAnimationController] ✓ labelClipName 已設置: ${this.labelClipName.name}`);
        
        if (!this.labelClipName.enabled) {
            console.warn(`[SkeletalAnimationController] ⚠️ Label 組件已禁用，啟用中...`);
            this.labelClipName.enabled = true;
        }

        const labelNode = this.labelClipName.node;
        if (!labelNode.active) {
            console.warn(`[SkeletalAnimationController] ⚠️ Label 節點未激活，激活中...`);
            labelNode.active = true;
        }

        console.log(`[SkeletalAnimationController] ✓ Label 組件已啟用`);
        console.log(`[SkeletalAnimationController] ✓ Label 節點已激活`);
        console.log(`[SkeletalAnimationController] ===== 驗證完成 =====\n`);
    }

    /**
     * 初始化動畫片段列表
     * 優先使用拖入的 animationClipResources，其次使用 SkeletalAnimation 組件中的 clips
     */
    private initializeAnimationClips() {
        this.animationClips = [];

        console.log(`[SkeletalAnimationController] ========== 初始化開始 ==========`);

        // 優先使用拖入的 Clip 資源
        if (this.animationClipResources && this.animationClipResources.length > 0) {
            console.log(`[SkeletalAnimationController] 使用拖入的 Clip 資源 (${this.animationClipResources.length} 個)`);
            
            this.animationClipResources.forEach((clip, index) => {
                if (clip) {
                    const clipName = clip.name || `Clip_${index}`;
                    const clipDuration = clip.duration || 0;
                    
                    this.animationClips.push({
                        name: clipName,
                        index: index,
                        duration: clipDuration
                    });
                    
                    console.log(`  [${index}] ${clipName} (時長: ${clipDuration.toFixed(2)}s)`);
                }
            });

            console.log(`[SkeletalAnimationController] ✓ 已加載 ${this.animationClips.length} 個 Clip 資源`);
        } 
        // 備選方案：從 SkeletalAnimation 組件獲取動畫片段
        else if (this.skeletalAnimation) {
            console.log(`[SkeletalAnimationController] 使用 SkeletalAnimation 組件中的 Clips`);
            
            const clips = this.skeletalAnimation.clips;
            
            if (clips && clips.length > 0) {
                console.log(`[SkeletalAnimationController] 發現 ${clips.length} 個 Clips`);
                
                clips.forEach((clip, index) => {
                    const clipName = clip.name;
                    const clipDuration = clip.duration || 0;
                    
                    this.animationClips.push({
                        name: clipName,
                        index: index,
                        duration: clipDuration
                    });
                    
                    console.log(`  [${index}] ${clipName} (時長: ${clipDuration.toFixed(2)}s)`);
                });

                console.log(`[SkeletalAnimationController] ✓ 已加載 ${this.animationClips.length} 個 Clips`);
            } else {
                console.warn('[SkeletalAnimationController] ❌ SkeletalAnimation 組件中未找到任何 Clips');
            }
        } else {
            console.warn('[SkeletalAnimationController] ❌ 未指定 SkeletalAnimation 組件，且未拖入任何 Clip 資源');
        }

        if (this.animationClips.length > 0) {
            this.currentClipIndex = 0;
            console.log(`[SkeletalAnimationController] ✓ 初始化完成，共 ${this.animationClips.length} 個動畫`);
            console.log(`[SkeletalAnimationController] ========== 初始化結束 ==========\n`);
        } else {
            console.error('[SkeletalAnimationController] ❌ 沒有可用的動畫片段');
        }
    }

    /**
     * 附加按鈕監聽器
     */
    private attachButtonListeners() {
        console.log(`\n[SkeletalAnimationController] ========== 附加按鈕監聽器 ==========`);

        // 附加 Next 按鈕
        if (this.btnNext && this.btnNext.node) {
            try {
                // 使用 'click' 字符串事件
                this.btnNext.node.on('click', () => {
                    console.log(`[SkeletalAnimationController] 🔘 btnNext 被點擊`);
                    this.nextClip();
                }, this);
                console.log(`[SkeletalAnimationController] ✓ btnNext 監聽器已附加`);
            } catch (error) {
                console.error(`[SkeletalAnimationController] ❌ 附加 btnNext 監聽器失敗:`, error);
            }
        } else {
            console.error(`[SkeletalAnimationController] ❌ btnNext 或其 node 為 null，無法附加監聽器`);
        }

        // 附加 Prev 按鈕
        if (this.btnPrev && this.btnPrev.node) {
            try {
                this.btnPrev.node.on('click', () => {
                    console.log(`[SkeletalAnimationController] 🔘 btnPrev 被點擊`);
                    this.prevClip();
                }, this);
                console.log(`[SkeletalAnimationController] ✓ btnPrev 監聽器已附加`);
            } catch (error) {
                console.error(`[SkeletalAnimationController] ❌ 附加 btnPrev 監聽器失敗:`, error);
            }
        } else {
            console.error(`[SkeletalAnimationController] ❌ btnPrev 或其 node 為 null，無法附加監聽器`);
        }

        // 附加 Play 按鈕
        if (this.btnPlay && this.btnPlay.node) {
            try {
                this.btnPlay.node.on('click', () => {
                    console.log(`[SkeletalAnimationController] 🔘 btnPlay 被點擊`);
                    this.playCurrentClip();
                }, this);
                console.log(`[SkeletalAnimationController] ✓ btnPlay 監聽器已附加`);
            } catch (error) {
                console.error(`[SkeletalAnimationController] ❌ 附加 btnPlay 監聽器失敗:`, error);
            }
        } else {
            console.error(`[SkeletalAnimationController] ❌ btnPlay 或其 node 為 null`);
        }

        // 附加 Pause 按鈕
        if (this.btnPause && this.btnPause.node) {
            try {
                this.btnPause.node.on('click', () => {
                    console.log(`[SkeletalAnimationController] 🔘 btnPause 被點擊`);
                    this.pauseClip();
                }, this);
                console.log(`[SkeletalAnimationController] ✓ btnPause 監聽器已附加`);
            } catch (error) {
                console.error(`[SkeletalAnimationController] ❌ 附加 btnPause 監聽器失敗:`, error);
            }
        } else {
            console.error(`[SkeletalAnimationController] ❌ btnPause 或其 node 為 null`);
        }

        // 附加 Stop 按鈕
        if (this.btnStop && this.btnStop.node) {
            try {
                this.btnStop.node.on('click', () => {
                    console.log(`[SkeletalAnimationController] 🔘 btnStop 被點擊`);
                    this.stopClip();
                }, this);
                console.log(`[SkeletalAnimationController] ✓ btnStop 監聽器已附加`);
            } catch (error) {
                console.error(`[SkeletalAnimationController] ❌ 附加 btnStop 監聽器失敗:`, error);
            }
        } else {
            console.error(`[SkeletalAnimationController] ❌ btnStop 或其 node 為 null`);
        }

        console.log(`[SkeletalAnimationController] ========== 按鈕監聽器附加完成 ==========\n`);
    }

    /**
     * 播放下一個動畫片段
     */
    public nextClip() {
        console.log(`\n[SkeletalAnimationController] ━━━━━ nextClip() 被調用 ━━━━━`);
        
        if (this.animationClips.length === 0) {
            console.warn('[SkeletalAnimationController] ❌ 沒有可用的動畫片段');
            return;
        }

        const prevIndex = this.currentClipIndex;
        
        this.currentClipIndex++;
        if (this.currentClipIndex >= this.animationClips.length) {
            this.currentClipIndex = 0; // 循環到第一個
        }

        const nextClipName = this.animationClips[this.currentClipIndex].name;
        console.log(`[SkeletalAnimationController] ==== NEXT CLIP ====`);
        console.log(`[SkeletalAnimationController] 從 [${prevIndex}] 轉換到 [${this.currentClipIndex}] ${nextClipName}`);
        console.log(`[SkeletalAnimationController] 準備調用 playCurrentClip()...`);
        
        this.playCurrentClip();
        
        console.log(`[SkeletalAnimationController] playCurrentClip() 調用完成`);
        console.log(`[SkeletalAnimationController] ━━━━━ nextClip() 結束 ━━━━━\n`);
    }

    /**
     * 播放上一個動畫片段
     */
    public prevClip() {
        console.log(`\n[SkeletalAnimationController] ━━━━━ prevClip() 被調用 ━━━━━`);
        
        if (this.animationClips.length === 0) {
            console.warn('[SkeletalAnimationController] ❌ 沒有可用的動畫片段');
            return;
        }

        const prevIndex = this.currentClipIndex;
        
        this.currentClipIndex--;
        if (this.currentClipIndex < 0) {
            this.currentClipIndex = this.animationClips.length - 1; // 循環到最後一個
        }

        const prevClipName = this.animationClips[this.currentClipIndex].name;
        console.log(`[SkeletalAnimationController] ==== PREV CLIP ====`);
        console.log(`[SkeletalAnimationController] 從 [${prevIndex}] 轉換到 [${this.currentClipIndex}] ${prevClipName}`);
        console.log(`[SkeletalAnimationController] 準備調用 playCurrentClip()...`);
        
        this.playCurrentClip();
        
        console.log(`[SkeletalAnimationController] playCurrentClip() 調用完成`);
        console.log(`[SkeletalAnimationController] ━━━━━ prevClip() 結束 ━━━━━\n`);
    }

    /**
     * 播放當前動畫片段
     * 使用正確的 SkeletalAnimation API 確保穩定播放
     */
    public playCurrentClip() {
        if (!this.skeletalAnimation) {
            console.error('[SkeletalAnimationController] ❌ SkeletalAnimation 未指定');
            console.error('[SkeletalAnimationController] ⚠️ 解決方案：在 Inspector 中拖入 SkeletalAnimation 組件');
            return;
        }

        if (this.animationClips.length === 0) {
            console.error('[SkeletalAnimationController] ❌ 沒有可用的動畫片段');
            console.error('[SkeletalAnimationController] ⚠️ 解決方案：');
            console.error('[SkeletalAnimationController]    1. 將 Clip 資源拖入 animationClipResources 欄位');
            console.error('[SkeletalAnimationController]    2. 或確保 SkeletalAnimation 組件中有 Clips');
            return;
        }

        const clipInfo = this.animationClips[this.currentClipIndex];
        const clipName = clipInfo.name;
        const clipDuration = clipInfo.duration;

        console.log(`\n[SkeletalAnimationController] >>> 播放 [${this.currentClipIndex}/${this.animationClips.length}] ${clipName}`);

        try {
            // 確保停止所有現有動畫
            this.skeletalAnimation.stop();
            
            console.log(`[SkeletalAnimationController]   - 已停止現有動畫`);

            // 立即播放新動畫（使用正確的 API）
            this.skeletalAnimation.play(clipName);
            
            console.log(`[SkeletalAnimationController]   - 已調用 play('${clipName}')`);

            // 立即獲取播放狀態並配置
            const state = this.skeletalAnimation.state;
            
            if (state) {
                // 設置播放速度
                state.speed = this.playbackSpeed;
                
                // 設置循環模式 (wrapMode: 0=Default, 1=Once, 2=Loop)
                state.wrapMode = this.isLooping ? 2 : 1;
                
                console.log(`[SkeletalAnimationController]   - 循環: ${this.isLooping ? 'ON' : 'OFF'}`);
                console.log(`[SkeletalAnimationController]   - 速度: ${this.playbackSpeed}x`);
                console.log(`[SkeletalAnimationController]   - 時長: ${clipDuration.toFixed(2)}s`);
            } else {
                console.warn('[SkeletalAnimationController]   ⚠️ 無法獲取播放狀態');
            }

            this.currentAnimationName = clipName;
            this.isPlaying = true;

            console.log(`[SkeletalAnimationController] ✓ 播放開始\n`);

        } catch (error) {
            console.error(`[SkeletalAnimationController] ❌ 播放失敗:`);
            console.error(`     Clip 名稱: ${clipName}`);
            console.error(`     錯誤: ${error}`);
            console.error(`[SkeletalAnimationController] ⚠️ 可能的原因：`);
            console.error(`     1. Clip 名稱拼寫錯誤`);
            console.error(`     2. Clip 尚未加載`);
            console.error(`     3. SkeletalAnimation 狀態異常\n`);
        }

        this.updateDisplay();
    }

    /**
     * 暫停當前動畫
     */
    public pauseClip() {
        if (!this.skeletalAnimation) {
            console.warn('[SkeletalAnimationController] SkeletalAnimation 未指定');
            return;
        }

        try {
            const state = this.skeletalAnimation.state;
            if (state) {
                state.speed = 0;
                this.isPlaying = false;
                console.log(`[SkeletalAnimationController] ⏸️  暫停動畫: ${this.currentAnimationName}`);
            }
        } catch (error) {
            console.warn('[SkeletalAnimationController] ❌ 暫停動畫失敗:', error);
        }

        this.updateDisplay();
    }

    /**
     * 恢復播放
     */
    public resumeClip() {
        if (!this.skeletalAnimation) {
            console.warn('[SkeletalAnimationController] SkeletalAnimation 未指定');
            return;
        }

        try {
            const state = this.skeletalAnimation.state;
            if (state) {
                state.speed = this.playbackSpeed;
                this.isPlaying = true;
                console.log(`[SkeletalAnimationController] ▶️  恢復播放: ${this.currentAnimationName}`);
            }
        } catch (error) {
            console.warn('[SkeletalAnimationController] ❌ 恢復播放失敗:', error);
        }

        this.updateDisplay();
    }

    /**
     * 停止當前動畫（真正停止，不會自動回放）
     */
    public stopClip() {
        if (!this.skeletalAnimation) {
            console.warn('[SkeletalAnimationController] SkeletalAnimation 未指定');
            return;
        }

        try {
            // 停止播放
            this.skeletalAnimation.stop();
            
            // 重置狀態
            this.isPlaying = false;
            this.currentAnimationName = '';
            
            console.log('[SkeletalAnimationController] ⏹️  停止所有動畫');
        } catch (error) {
            console.warn('[SkeletalAnimationController] ❌ 停止動畫失敗:', error);
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
     * 更新顯示（Label 和日誌）
     */
    private updateDisplay() {
        const clipName = this.animationClips[this.currentClipIndex]?.name || '無';
        const clipIndex = this.currentClipIndex + 1;
        const totalClips = this.animationClips.length;

        console.log(`[SkeletalAnimationController] ====== Label 更新 ======`);
        console.log(`[SkeletalAnimationController] 當前 Clip: [${this.currentClipIndex}/${this.animationClips.length}] ${clipName}`);

        // 更新 Label 顯示
        if (this.labelClipName) {
            try {
                // 檢查 Label 組件狀態
                if (!this.labelClipName.enabled) {
                    console.warn(`[SkeletalAnimationController] ⚠️ Label 組件已禁用，自動啟用...`);
                    this.labelClipName.enabled = true;
                }

                if (!this.labelClipName.node.active) {
                    console.warn(`[SkeletalAnimationController] ⚠️ Label 節點已禁用，自動激活...`);
                    this.labelClipName.node.active = true;
                }

                // 更新文本
                const oldText = this.labelClipName.string;
                this.labelClipName.string = `${clipName}`;
                
                if (oldText !== clipName) {
                    console.log(`[SkeletalAnimationController] ✓ Label 文本已更新: "${oldText}" → "${clipName}"`);
                } else {
                    console.log(`[SkeletalAnimationController] ℹ️  Label 文本未變更（仍為 "${clipName}"）`);
                }

                console.log(`[SkeletalAnimationController] ✓ Label 組件狀態:`);
                console.log(`[SkeletalAnimationController]    - 啟用: ${this.labelClipName.enabled}`);
                console.log(`[SkeletalAnimationController]    - 節點激活: ${this.labelClipName.node.active}`);
                console.log(`[SkeletalAnimationController]    - 當前文本: "${this.labelClipName.string}"`);
            } catch (error) {
                console.error(`[SkeletalAnimationController] ❌ Label 更新失敗:`, error);
            }
        } else {
            console.error(`[SkeletalAnimationController] ❌ CRITICAL: labelClipName 為 null，無法更新 Label`);
            console.error(`[SkeletalAnimationController]    請檢查 Inspector 中 labelClipName 是否正確配置`);
        }

        console.log(`[SkeletalAnimationController] ====== 更新完成 ======\n`);
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
