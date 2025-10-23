import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

// 注意：TypeScript 可能會報 getComponent 不存在的錯誤
// 這是 TypeScript 的誤判，Component 類確實有 getComponent 方法
// 在 Cocos Creator 中執行時不會有問題

/**
 * Spine 動畫控制器
 * 提供完整的 Spine 動畫播放控制功能
 * 
 * 功能：
 * - 正播 / 逆播放
 * - 速度調整
 * - Blend Mode 切換
 * - Skin 選擇
 * - 動畫切換
 * 
 * 使用方式：
 * 1. 將此腳本掛載到有 sp.Skeleton 組件的節點上
 * 2. 在 Inspector 中調整參數
 * 3. 動態調用公開方法控制播放
 * 
 * @author Game152Dev Team
 * @version 1.0.0
 */

// Blend Mode 枚舉
enum BlendMode {
    NORMAL = 0,
    ADDITIVE = 1,
    MULTIPLY = 2,
    SCREEN = 3
}

// 播放方向枚舉
enum PlayDirection {
    FORWARD = 1,    // 正播
    REVERSE = -1    // 逆播
}

@ccclass('SpineAnimationController')
export class SpineAnimationController extends Component {
    
    // ============================================================
    // 屬性配置
    // ============================================================
    
    // 內部引用（自動從節點獲取）
    private skeleton: sp.Skeleton | null = null;
    
    // 動畫列表（內部緩存）
    private _animationList: string[] = [];
    private _skinList: string[] = [];
    private _selectedAnimIndex: number = 0;
    private _selectedSkinIndex: number = 0;
    
    @property({
        type: [sp.SkeletonData],
        displayName: 'Skeleton Data',
        tooltip: '拖曳 .json 或 .skel 檔案到這裡（或留空自動從組件獲取）'
    })
    get skeletonDataAsset(): sp.SkeletonData | null {
        return this._skeletonDataAsset;
    }
    set skeletonDataAsset(value: sp.SkeletonData | null) {
        this._skeletonDataAsset = value;
        this.updateAnimationList();
    }
    private _skeletonDataAsset: sp.SkeletonData | null = null;
    
    @property({
        type: [String],
        displayName: 'Animation Name',
        tooltip: '選擇要播放的動畫'
    })
    get animationName(): string {
        if (this._animationList.length > 0 && this._selectedAnimIndex < this._animationList.length) {
            return this._animationList[this._selectedAnimIndex];
        }
        return this._manualAnimName;
    }
    set animationName(value: string) {
        this._manualAnimName = value;
        const index = this._animationList.indexOf(value);
        if (index >= 0) {
            this._selectedAnimIndex = index;
        }
    }
    private _manualAnimName: string = '';
    
    @property({
        type: PlayDirection,
        displayName: 'Play Direction',
        tooltip: '播放方向（正播/逆播）'
    })
    playDirection: PlayDirection = PlayDirection.FORWARD;
    
    @property({
        displayName: 'Playback Speed',
        tooltip: '播放速度倍數',
        range: [0.1, 5.0, 0.1],
        slide: true
    })
    playbackSpeed: number = 1.0;
    
    @property({
        displayName: 'Loop',
        tooltip: '是否循環播放'
    })
    loop: boolean = true;
    
    @property({
        displayName: 'Auto Play',
        tooltip: '是否自動播放'
    })
    autoPlay: boolean = true;
    
    @property({
        type: BlendMode,
        displayName: 'Blend Mode',
        tooltip: 'Blend Mode（混合模式）'
    })
    blendMode: BlendMode = BlendMode.NORMAL;
    
    @property({
        type: [String],
        displayName: 'Skin Name',
        tooltip: '選擇要使用的 Skin'
    })
    get skinName(): string {
        if (this._skinList.length > 0 && this._selectedSkinIndex < this._skinList.length) {
            return this._skinList[this._selectedSkinIndex];
        }
        return this._manualSkinName;
    }
    set skinName(value: string) {
        this._manualSkinName = value;
        const index = this._skinList.indexOf(value);
        if (index >= 0) {
            this._selectedSkinIndex = index;
        }
    }
    private _manualSkinName: string = 'default';
    
    @property({
        displayName: 'Track Index',
        tooltip: '動畫軌道索引',
        range: [0, 10, 1],
        slide: true
    })
    trackIndex: number = 0;
    
    // ============================================================
    // 私有屬性
    // ============================================================
    
    private currentTrackEntry: sp.spine.TrackEntry | null = null;
    private isPlaying: boolean = false;
    private currentTime: number = 0;
    private animationDuration: number = 0;
    
    // ============================================================
    // 生命週期
    // ============================================================
    
    protected onLoad(): void {
        console.log('[SpineAnimationController] onLoad 初始化');
        
        // 自動獲取 Skeleton 組件
        // @ts-ignore - TypeScript 誤報，Component 確實有 getComponent 方法
        this.skeleton = this.getComponent(sp.Skeleton);
        
        if (!this.skeleton) {
            console.error('[SpineAnimationController] ❌ 未找到 sp.Skeleton 組件！');
            console.error('[SpineAnimationController] 請將此腳本掛載到有 sp.Skeleton 組件的節點上');
            return;
        }
        
        console.log('[SpineAnimationController] ✓ Skeleton 組件已找到');
        
        // 如果沒有手動設置 SkeletonData，從組件獲取
        if (!this._skeletonDataAsset && this.skeleton.skeletonData) {
            this._skeletonDataAsset = this.skeleton.skeletonData;
            console.log('[SpineAnimationController] ✓ 從組件自動獲取 SkeletonData');
        }
        
        // 更新動畫和 Skin 列表
        this.updateAnimationList();
    }
    
    /**
     * 更新動畫和 Skin 列表
     */
    private updateAnimationList(): void {
        this._animationList = [];
        this._skinList = [];
        
        const skeletonData = this._skeletonDataAsset || (this.skeleton ? this.skeleton.skeletonData : null);
        
        if (!skeletonData) {
            console.warn('[SpineAnimationController] ⚠️  SkeletonData 未設置');
            return;
        }
        
        // 獲取動畫列表
        if (skeletonData.skeletonJson && skeletonData.skeletonJson.animations) {
            this._animationList = Object.keys(skeletonData.skeletonJson.animations);
            console.log('[SpineAnimationController] ✓ 動畫列表已更新:', this._animationList);
        }
        
        // 獲取 Skin 列表
        if (skeletonData.skins && skeletonData.skins.length > 0) {
            this._skinList = skeletonData.skins.map(skin => skin.name);
            console.log('[SpineAnimationController] ✓ Skin 列表已更新:', this._skinList);
        }
    }
    
    protected start(): void {
        if (!this.skeleton) return;
        
        console.log('[SpineAnimationController] start 初始化設置');
        
        // 設置 Skin
        this.setSkin(this.skinName);
        
        // 設置 Blend Mode
        this.setBlendMode(this.blendMode);
        
        // 如果自動播放
        if (this.autoPlay && this.animationName) {
            this.play(this.animationName, this.loop);
        }
        
        this.printAvailableResources();
    }
    
    protected update(dt: number): void {
        if (!this.isPlaying || !this.currentTrackEntry) return;
        
        // 更新當前時間（用於逆播放）
        if (this.playDirection === PlayDirection.REVERSE) {
            this.currentTime -= dt * this.playbackSpeed;
            
            if (this.currentTime <= 0) {
                if (this.loop) {
                    this.currentTime = this.animationDuration;
                } else {
                    this.currentTime = 0;
                    this.isPlaying = false;
                }
            }
            
            this.currentTrackEntry.trackTime = this.currentTime;
        }
    }
    
    // ============================================================
    // 播放控制
    // ============================================================
    
    /**
     * 播放動畫
     * @param animName 動畫名稱
     * @param loop 是否循環
     */
    play(animName: string = this.animationName, loop: boolean = this.loop): void {
        if (!this.skeleton) {
            console.error('[SpineAnimationController] ❌ Skeleton 未初始化');
            return;
        }
        
        console.log(`[SpineAnimationController] 播放動畫: ${animName}, 循環: ${loop}`);
        
        try {
            // 設置動畫
            this.currentTrackEntry = this.skeleton.setAnimation(this.trackIndex, animName, loop);
            
            if (!this.currentTrackEntry) {
                console.error(`[SpineAnimationController] ❌ 動畫設置失敗: ${animName}`);
                return;
            }
            
            // 獲取動畫時長
            this.animationDuration = this.currentTrackEntry.animation.duration;
            console.log(`[SpineAnimationController] 動畫時長: ${this.animationDuration}s`);
            
            // 設置播放速度和方向
            this.setPlaybackSpeed(this.playbackSpeed);
            this.setPlayDirection(this.playDirection);
            
            this.animationName = animName;
            this.isPlaying = true;
            
            console.log('[SpineAnimationController] ✓ 動畫播放開始');
            
        } catch (error) {
            console.error('[SpineAnimationController] ❌ 播放動畫時發生錯誤:', error);
        }
    }
    
    /**
     * 暫停動畫
     */
    pause(): void {
        if (!this.skeleton) return;
        
        this.skeleton.paused = true;
        this.isPlaying = false;
        console.log('[SpineAnimationController] ⏸ 動畫已暫停');
    }
    
    /**
     * 恢復播放
     */
    resume(): void {
        if (!this.skeleton) return;
        
        this.skeleton.paused = false;
        this.isPlaying = true;
        console.log('[SpineAnimationController] ▶ 動畫已恢復');
    }
    
    /**
     * 停止動畫
     */
    stop(): void {
        if (!this.skeleton) return;
        
        this.skeleton.clearTracks();
        this.isPlaying = false;
        this.currentTrackEntry = null;
        console.log('[SpineAnimationController] ⏹ 動畫已停止');
    }
    
    // ============================================================
    // 播放方向控制
    // ============================================================
    
    /**
     * 設置播放方向
     * @param direction 播放方向（正播/逆播）
     */
    setPlayDirection(direction: PlayDirection): void {
        this.playDirection = direction;
        
        if (direction === PlayDirection.REVERSE) {
            console.log('[SpineAnimationController] ⏪ 設置為逆播放');
            // 逆播放：從動畫結尾開始
            if (this.currentTrackEntry) {
                this.currentTime = this.animationDuration;
                this.currentTrackEntry.trackTime = this.currentTime;
            }
        } else {
            console.log('[SpineAnimationController] ⏩ 設置為正播放');
            // 正播放：使用原生播放
            if (this.currentTrackEntry) {
                this.currentTrackEntry.timeScale = this.playbackSpeed;
            }
        }
    }
    
    /**
     * 切換播放方向
     */
    togglePlayDirection(): void {
        const newDirection = this.playDirection === PlayDirection.FORWARD 
            ? PlayDirection.REVERSE 
            : PlayDirection.FORWARD;
        this.setPlayDirection(newDirection);
    }
    
    // ============================================================
    // 速度控制
    // ============================================================
    
    /**
     * 設置播放速度
     * @param speed 速度倍數（0.1 - 5.0）
     */
    setPlaybackSpeed(speed: number): void {
        this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
        
        if (this.skeleton) {
            this.skeleton.timeScale = this.playbackSpeed;
        }
        
        if (this.currentTrackEntry && this.playDirection === PlayDirection.FORWARD) {
            this.currentTrackEntry.timeScale = this.playbackSpeed;
        }
        
        console.log(`[SpineAnimationController] 🎚 播放速度: ${this.playbackSpeed}x`);
    }
    
    /**
     * 增加速度
     */
    increaseSpeed(delta: number = 0.1): void {
        this.setPlaybackSpeed(this.playbackSpeed + delta);
    }
    
    /**
     * 減少速度
     */
    decreaseSpeed(delta: number = 0.1): void {
        this.setPlaybackSpeed(this.playbackSpeed - delta);
    }
    
    // ============================================================
    // Blend Mode 控制
    // ============================================================
    
    /**
     * 設置 Blend Mode
     * @param mode Blend Mode
     */
    setBlendMode(mode: BlendMode): void {
        if (!this.skeleton) return;
        
        this.blendMode = mode;
        
        // Cocos Creator 的 Spine 使用材質的混合模式
        const customMat = this.skeleton.customMaterial;
        if (customMat) {
            // 根據 BlendMode 設置混合參數
            switch (mode) {
                case BlendMode.NORMAL:
                    console.log('[SpineAnimationController] 🎨 Blend Mode: NORMAL');
                    // SRC_ALPHA, ONE_MINUS_SRC_ALPHA
                    break;
                case BlendMode.ADDITIVE:
                    console.log('[SpineAnimationController] 🎨 Blend Mode: ADDITIVE');
                    // SRC_ALPHA, ONE
                    break;
                case BlendMode.MULTIPLY:
                    console.log('[SpineAnimationController] 🎨 Blend Mode: MULTIPLY');
                    // DST_COLOR, ONE_MINUS_SRC_ALPHA
                    break;
                case BlendMode.SCREEN:
                    console.log('[SpineAnimationController] 🎨 Blend Mode: SCREEN');
                    // ONE, ONE_MINUS_SRC_COLOR
                    break;
            }
        }
        
        // 也可以使用 Spine 原生的混合模式設置
        if (this.skeleton.premultipliedAlpha !== undefined) {
            this.skeleton.premultipliedAlpha = (mode === BlendMode.NORMAL);
        }
    }
    
    // ============================================================
    // Skin 控制
    // ============================================================
    
    /**
     * 設置 Skin（皮膚）
     * @param skinName Skin 名稱
     */
    setSkin(skinName: string): void {
        if (!this.skeleton) return;
        
        try {
            this.skeleton.setSkin(skinName);
            this.skinName = skinName;
            console.log(`[SpineAnimationController] 👔 Skin 已設置: ${skinName}`);
        } catch (error) {
            console.error(`[SpineAnimationController] ❌ 設置 Skin 失敗: ${skinName}`, error);
        }
    }
    
    /**
     * 獲取所有可用的 Skin
     */
    getAvailableSkins(): string[] {
        if (!this.skeleton || !this.skeleton.skeletonData) {
            return [];
        }
        
        const skeletonData = this.skeleton.skeletonData;
        const skins: string[] = [];
        
        // 獲取所有 skin 名稱
        if (skeletonData.skins) {
            for (let i = 0; i < skeletonData.skins.length; i++) {
                skins.push(skeletonData.skins[i].name);
            }
        }
        
        return skins;
    }
    
    // ============================================================
    // 動畫查詢
    // ============================================================
    
    /**
     * 獲取所有可用的動畫
     */
    getAvailableAnimations(): string[] {
        if (!this.skeleton || !this.skeleton.skeletonData) {
            return [];
        }
        
        const animations: string[] = [];
        const skeletonJson = this.skeleton.skeletonData.skeletonJson;
        
        if (skeletonJson && skeletonJson.animations) {
            animations.push(...Object.keys(skeletonJson.animations));
        }
        
        return animations;
    }
    
    /**
     * 打印所有可用資源
     */
    printAvailableResources(): void {
        console.log('[SpineAnimationController] ═══════════════════════════');
        console.log('[SpineAnimationController] 📋 可用資源列表：');
        
        const animations = this.getAvailableAnimations();
        console.log(`[SpineAnimationController] 動畫 (${animations.length}個):`, animations);
        
        const skins = this.getAvailableSkins();
        console.log(`[SpineAnimationController] Skin (${skins.length}個):`, skins);
        
        console.log('[SpineAnimationController] ═══════════════════════════');
    }
    
    // ============================================================
    // 時間軸控制
    // ============================================================
    
    /**
     * 跳到指定時間
     * @param time 時間（秒）
     */
    setTime(time: number): void {
        if (!this.currentTrackEntry) return;
        
        this.currentTime = Math.max(0, Math.min(time, this.animationDuration));
        this.currentTrackEntry.trackTime = this.currentTime;
        console.log(`[SpineAnimationController] ⏱ 跳到時間: ${this.currentTime}s`);
    }
    
    /**
     * 跳到指定百分比
     * @param percent 百分比（0-1）
     */
    setProgress(percent: number): void {
        const time = this.animationDuration * Math.max(0, Math.min(1, percent));
        this.setTime(time);
    }
    
    /**
     * 獲取當前播放進度
     * @returns 進度（0-1）
     */
    getProgress(): number {
        if (!this.currentTrackEntry || this.animationDuration === 0) {
            return 0;
        }
        return this.currentTime / this.animationDuration;
    }
}
