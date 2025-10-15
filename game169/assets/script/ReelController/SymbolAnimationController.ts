import { _decorator, Node, sp, Sprite, Animation } from 'cc';
import { Symbol } from './Symbol';

/**
 * 符號類型枚舉
 * 定義各種符號的 ID
 */
export enum SymbolType {
    /** Wild 符號 */
    WILD = 0,
    /** Scatter 符號 */
    SCATTER = 1,
    /** 高分符號起始 */
    HIGH_VALUE_START = 2,
    /** 高分符號結束 */
    HIGH_VALUE_END = 6,
    /** 低分符號起始 */
    LOW_VALUE_START = 7
}

/**
 * 動畫類型枚舉
 * 定義 Spine 動畫的名稱
 */
export enum SymbolAnimationType {
    /** 待機動畫 */
    IDLE = 'idle',
    /** 循環動畫 */
    LOOP = 'loop',
    /** 擊中動畫 */
    HIT = 'hit',
    /** 慢動作動畫 */
    SLOW_MOTION = 'slowmotion',
    /** 開始動畫 */
    BEGIN = 'begin',
    /** 爆炸動畫 */
    EXPLO = 'explo'
}

/**
 * 符號配置常量
 */
export const SYMBOL_CONFIG = {
    /** Wild 符號索引 */
    WILD_INDEX: 0,
    /** Scatter 符號索引 */
    SCATTER_INDEX: 1,
    /** 高分符號最大索引 */
    HIGH_VALUE_MAX: 6,
    /** 最大深度（用於 setSiblingIndex） */
    MAX_DEPTH: 99,
    /** 預設時間縮放 */
    DEFAULT_TIME_SCALE: 1
} as const;

/**
 * 動畫配置介面
 */
export interface AnimationConfig {
    /** Spine 骨架索引（在 SpineAtlas 陣列中的位置） */
    skeletonIndex?: number;
    /** 動畫名稱 */
    animationName: string;
    /** 是否循環播放 */
    loop: boolean;
    /** 時間縮放（播放速度） */
    timeScale?: number;
    /** 是否清除現有軌道 */
    clearTracks?: boolean;
    /** 是否啟用 Sprite 組件 */
    enableSprite?: boolean;
}

/**
 * Symbol 動畫控制器
 * 職責：統一管理符號的動畫播放邏輯
 * 
 * 優勢：
 * - 消除程式碼重複（原本 4+ 處相同邏輯）
 * - 統一動畫設置流程
 * - 提供型別安全的 API
 * - 易於擴展和維護
 */
export class SymbolAnimationController {
    private symbol: Symbol;
    
    /**
     * 建構函數
     * @param symbol Symbol 組件實例
     */
    constructor(symbol: Symbol) {
        this.symbol = symbol;
        console.log(`🎬 SymbolAnimationController 已創建 (reelCol: ${symbol.reelCol})`);
    }
    
    // ==================== 通用動畫方法 ====================
    
    /**
     * 播放 Spine 動畫（通用方法）
     * @param config 動畫配置
     */
    playSpineAnimation(config: AnimationConfig): void {
        const anmNode = this.symbol.node.getChildByName("Anm");
        if (!anmNode) {
            console.warn('⚠️ 找不到動畫節點 "Anm"');
            return;
        }
        
        const spine = anmNode.getComponent(sp.Skeleton);
        if (!spine) {
            console.warn('⚠️ 找不到 Skeleton 組件');
            return;
        }
        
        // 設置骨架數據
        if (config.skeletonIndex !== undefined) {
            spine.skeletonData = this.symbol.SpineAtlas[config.skeletonIndex];
        }
        
        // 設置時間縮放
        spine.timeScale = config.timeScale ?? SYMBOL_CONFIG.DEFAULT_TIME_SCALE;
        
        // 清除現有軌道（預設為 true）
        if (config.clearTracks !== false) {
            this.clearSpineAnimation(spine);
        }
        
        // 播放動畫
        spine.addAnimation(0, config.animationName, config.loop);
        spine.enabled = true;
        
        // 控制 Sprite 顯示
        if (config.enableSprite !== undefined) {
            const spriteComponent = this.symbol.node.getComponent(Sprite);
            if (spriteComponent) {
                spriteComponent.enabled = config.enableSprite;
            }
        }
        
        console.log(`▶️ 播放 Spine 動畫: ${config.animationName} (loop: ${config.loop})`);
    }
    
    /**
     * 清除 Spine 動畫軌道
     * @param spine Skeleton 組件
     */
    private clearSpineAnimation(spine: sp.Skeleton): void {
        spine.clearTracks();
        spine.setToSetupPose();
    }
    
    // ==================== 特定動畫方法 ====================
    
    /**
     * 播放 Wild 動畫
     * Wild 符號會播放 idle 動畫並隱藏 Sprite
     */
    playWildAnimation(): void {
        if (this.symbol.SymIndex !== SymbolType.WILD) {
            console.warn(`⚠️ 當前符號 (${this.symbol.SymIndex}) 不是 Wild，無法播放 Wild 動畫`);
            return;
        }
        
        console.log('🌟 播放 Wild 動畫');
        
        this.playSpineAnimation({
            skeletonIndex: SymbolType.WILD,
            animationName: SymbolAnimationType.IDLE,
            loop: true,
            timeScale: SYMBOL_CONFIG.DEFAULT_TIME_SCALE,
            enableSprite: false
        });
    }
    
    /**
     * 播放 Scatter 動畫
     * @param type 動畫類型 (idle/loop/hit/slowmotion)
     * @param slow 是否為慢動作
     */
    playScatterAnimation(type: 'idle' | 'loop' | 'hit' | 'slowmotion', slow: boolean = false): void {
        if (this.symbol.SymIndex !== SymbolType.SCATTER) {
            console.warn(`⚠️ 當前符號 (${this.symbol.SymIndex}) 不是 Scatter，無法播放 Scatter 動畫`);
            return;
        }
        
        console.log(`💫 播放 Scatter 動畫: ${type} (slow: ${slow})`);
        
        const anmNode = this.symbol.node.getChildByName("Anm");
        if (!anmNode) {
            console.warn('⚠️ 找不到動畫節點');
            return;
        }
        
        const spine = anmNode.getComponent(sp.Skeleton);
        if (!spine) {
            console.warn('⚠️ 找不到 Skeleton 組件');
            return;
        }
        
        // 設置骨架和時間縮放
        spine.skeletonData = this.symbol.SpineAtlas[SymbolType.SCATTER];
        spine.timeScale = SYMBOL_CONFIG.DEFAULT_TIME_SCALE;
        this.clearSpineAnimation(spine);
        
        // 根據類型播放動畫
        switch (type) {
            case 'loop':
                spine.addAnimation(0, SymbolAnimationType.LOOP, true);
                break;
            case 'hit':
                spine.addAnimation(0, SymbolAnimationType.HIT, false);
                if (slow) {
                    this.symbol.isSlow = true;
                    spine.addAnimation(0, SymbolAnimationType.SLOW_MOTION, true);
                } else {
                    spine.addAnimation(0, SymbolAnimationType.IDLE, true);
                }
                break;
            case 'idle':
                spine.addAnimation(0, SymbolAnimationType.IDLE, true);
                break;
            case 'slowmotion':
                this.symbol.isSlow = true;
                spine.addAnimation(0, SymbolAnimationType.SLOW_MOTION, true);
                break;
        }
        
        spine.enabled = true;
        
        // 隱藏 Sprite
        const spriteComponent = this.symbol.node.getComponent(Sprite);
        if (spriteComponent) {
            spriteComponent.enabled = false;
        }
        
        // 移動到 Scatter 動畫層
        if (this.symbol.scatterAnmNode) {
            this.symbol.scatterAnmNode.addChild(this.symbol.node);
            this.symbol.node.setSiblingIndex(SYMBOL_CONFIG.MAX_DEPTH);
        }
    }
    
    /**
     * 播放符號中獎動畫
     * 根據符號類型播放不同的動畫（高分/低分）
     */
    playWinAnimation(): void {
        const symIndex = this.symbol.SymIndex;
        
        console.log(`🎉 播放中獎動畫: Symbol ${symIndex}`);
        
        // 低分符號使用幀動畫
        if (symIndex > SymbolType.HIGH_VALUE_END) {
            const lowAnm = this.symbol.node.getChildByName("lowSymAnm");
            if (lowAnm) {
                lowAnm.active = true;
                const animation = lowAnm.getComponent(Animation);
                if (animation) {
                    animation.play();
                    console.log('  ▶️ 播放低分符號幀動畫');
                }
            }
        } else {
            // 高分符號使用 Spine 動畫
            this.playSpineAnimation({
                skeletonIndex: symIndex,
                animationName: SymbolAnimationType.LOOP,
                loop: true,
                enableSprite: false
            });
            console.log('  ▶️ 播放高分符號 Spine 動畫');
        }
        
        // 移動到動畫層
        if (this.symbol.anmNode) {
            this.symbol.anmNode.addChild(this.symbol.node);
        }
        
        // 啟動粒子效果
        const particle = this.symbol.node.getChildByName("particle");
        if (particle) {
            particle.active = true;
            const particleAnim = particle.getComponent(Animation);
            if (particleAnim) {
                particleAnim.play();
                console.log('  ✨ 啟動粒子效果');
            }
        }
    }
    
    /**
     * 停止所有動畫
     * 將符號恢復到待機狀態
     */
    stopAllAnimations(): void {
        console.log('⏹️ 停止所有動畫');
        
        const anmNode = this.symbol.node.getChildByName("Anm");
        if (anmNode) {
            const spine = anmNode.getComponent(sp.Skeleton);
            if (spine) {
                this.clearSpineAnimation(spine);
                
                // Wild 和 Scatter 回到 idle
                if (this.symbol.SymIndex === SymbolType.WILD || 
                    this.symbol.SymIndex === SymbolType.SCATTER) {
                    spine.skeletonData = this.symbol.SpineAtlas[this.symbol.SymIndex];
                    spine.addAnimation(0, SymbolAnimationType.IDLE, true);
                } else if (this.symbol.SymIndex > SymbolType.HIGH_VALUE_END) {
                    // 低分符號停止幀動畫
                    const lowAnm = this.symbol.node.getChildByName("lowSymAnm");
                    if (lowAnm) {
                        lowAnm.active = false;
                        const animation = lowAnm.getComponent(Animation);
                        if (animation) {
                            animation.stop();
                        }
                    }
                } else {
                    // 其他符號禁用 Spine
                    spine.enabled = false;
                }
            }
        }
        
        // 停止粒子效果
        const particle = this.symbol.node.getChildByName("particle");
        if (particle) {
            const particleAnim = particle.getComponent(Animation);
            if (particleAnim) {
                particleAnim.stop();
            }
            particle.active = false;
        }
        
        // 啟用 Sprite 顯示
        const spriteComponent = this.symbol.node.getComponent(Sprite);
        if (spriteComponent) {
            spriteComponent.enabled = true;
        }
    }
    
    /**
     * 播放變盤動畫
     * 用於符號變換的過場動畫
     */
    playChangeAnimation(): void {
        console.log('🔄 播放變盤動畫');
        
        if (!this.symbol.changeSp) {
            console.warn('⚠️ changeSp 未初始化');
            return;
        }
        
        this.symbol.changeSp.timeScale = SYMBOL_CONFIG.DEFAULT_TIME_SCALE;
        this.clearSpineAnimation(this.symbol.changeSp);
        this.symbol.changeSp.setAnimation(0, SymbolAnimationType.BEGIN, false);
        this.symbol.changeSp.enabled = true;
    }
}
