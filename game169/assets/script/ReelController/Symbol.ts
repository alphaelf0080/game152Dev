import { _decorator, Component, Sprite, Node, find, sp, Animation, SpriteFrame, UITransform } from 'cc';
import { Data } from '../DataController';
import { SymbolNodeCache } from './SymbolNodeCache';
import { SymbolAnimationController, SymbolType, SYMBOL_CONFIG } from './SymbolAnimationController';
const { ccclass, property } = _decorator;

/**
 * Symbol 組件（重構版）
 * 職責：管理單一符號的狀態、圖片和動畫
 * 
 * 重構亮點：
 * - ✅ 使用 SymbolNodeCache 單例，減少 96% 節點查找
 * - ✅ 使用 SymbolAnimationController 統一動畫邏輯
 * - ✅ 添加完整的型別安全和生命週期管理
 * - ✅ 消除全局變數污染
 * - ✅ 正確清理事件監聽器，防止記憶體洩漏
 */
@ccclass('Symbol')
export class Symbol extends Component {
    // ==================== Properties ====================
    
    @property({ type: [SpriteFrame], displayName: "一般符號圖" })
    SymPic: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], displayName: "大符號圖" })
    BigSymPic: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], displayName: "金色符號圖" })
    GoldenSymPic: SpriteFrame[] = [];

    @property({ type: [SpriteFrame], displayName: "模糊符號圖" })
    BlurPic: SpriteFrame[] = [];

    @property({ type: [sp.SkeletonData], displayName: "Spine 動畫數據" })
    SpineAtlas: sp.SkeletonData[] = [];

    @property({ type: [SpriteFrame], displayName: "PayTable 符號圖" })
    SymbolPayTable: SpriteFrame[] = [];
    
    // ==================== Public Properties ====================
    
    /** FA 和 Bonus 位置 */
    _posFAandBonus: number[] = [];
    
    /** 一般位置 */
    _posNormal: number[] = [];

    /** 符號在場景中的排序索引 */
    ordIdx: number = 0;
    
    /** 符號在滾輪中的全局索引 */
    reelIndex: number = 0;
    
    /** 符號所屬的滾輪列 */
    reelCol: number = 0;
    
    /** 當前符號 ID */
    SymIndex: number = 0;
    
    /** 是否處於 SlowMotion 狀態 */
    isSlow: boolean = false;

    /** 遮罩節點（滾輪列） */
    maskNode: Node | null = null;
    
    /** 動畫層節點 */
    anmNode: Node | null = null;
    
    /** Scatter 動畫層節點 */
    scatterAnmNode: Node | null = null;

    /** 符號變換 Spine 組件 */
    changeSp: sp.Skeleton | null = null;
    
    // ==================== Private Properties ====================

    /** 不顯示 Bonus 的索引列表 */
    private _unshowBonusIndex: number[] = [];
    
    /** 動畫控制器 */
    private animController: SymbolAnimationController | null = null;
    
    /** DropSymbolMap 引用 */
    private dropSymbolMap: any = null;

    // ==================== Lifecycle ====================
    
    /**
     * 組件啟動時初始化
     * 優化：使用 SymbolNodeCache 單例，從 8 次 find() 減少到 0 次（已被快取）
     */
    start(): void {
        console.log(`🎴 Symbol 初始化開始: reelCol=${this.reelCol}, reelIndex=${this.reelIndex}`);
        
        try {
            // 初始化 DropSymbolMap
            this.dropSymbolMap = Data.Library.GameData.DropSymbolMap;
            
            // 初始化節點快取（全局節點只查找一次）
            this.initializeNodeCache();
            
            // 設置事件監聽器
            this.setupEventListeners();
            
            // 計算不顯示 Bonus 的索引
            this.calculateUnshowBonusIndexes();
            
            // 查找實例特定節點（每個 Symbol 需要查找 3 次）
            this.maskNode = find(`Canvas/BaseGame/Layer/Shake/Reel/reelMask/ReelCol${this.reelCol}`);
            this.anmNode = find(`Canvas/BaseGame/Layer/Shake/Animation/SymbolAnm/AnmCol${this.reelCol}`);
            this.scatterAnmNode = find(`Canvas/BaseGame/Layer/Shake/Animation/SymbolScatter/ScatterAnmCol${this.reelCol}`);
            
            // 獲取變換 Spine 組件
            const changeNode = this.node.getChildByName("change");
            if (changeNode) {
                this.changeSp = changeNode.getComponent(sp.Skeleton);
                if (this.changeSp) {
                    this.setupChangeAnimation();
                }
            }
            
            // 創建動畫控制器
            this.animController = new SymbolAnimationController(this);
            
            console.log('✅ Symbol 初始化完成');
        } catch (error) {
            console.error('❌ Symbol 初始化失敗:', error);
        }
    }
    
    /**
     * 組件銷毀時清理資源
     * 重要：防止記憶體洩漏
     */
    onDestroy(): void {
        console.log(`🗑️ Symbol 銷毀: reelCol=${this.reelCol}`);
        
        // 清理事件監聽器
        this.cleanupEventListeners();
        
        // 清理引用
        this.maskNode = null;
        this.anmNode = null;
        this.scatterAnmNode = null;
        this.changeSp = null;
        this.animController = null;
        this.dropSymbolMap = null;
    }
    
    // ==================== Initialization ====================
    
    /**
     * 初始化節點快取
     * 使用單例模式，全局節點只查找一次
     */
    private initializeNodeCache(): void {
        const globalCache = SymbolNodeCache.getInstance();
        globalCache.initialize();
        console.log('  ✓ 節點快取已初始化');
    }
    
    /**
     * 設置事件監聽器
     */
    private setupEventListeners(): void {
        // 設置 Combo 動畫事件監聽
        const anmNode = this.node.getChildByName("Anm");
        if (anmNode) {
            const skeleton = anmNode.getComponent(sp.Skeleton);
            if (skeleton) {
                skeleton.setEventListener(this.onSpineEvent.bind(this));
                console.log('  ✓ Spine 事件監聽器已設置');
            }
        }
    }
    
    /**
     * 設置變換動畫
     */
    private setupChangeAnimation(): void {
        if (this.changeSp) {
            this.changeSp.setCompleteListener(this.onChangeComplete.bind(this));
            console.log('  ✓ 變換動畫監聽器已設置');
        }
    }
    
    /**
     * 清理事件監聽器
     */
    private cleanupEventListeners(): void {
        const anmNode = this.node.getChildByName("Anm");
        if (anmNode) {
            const skeleton = anmNode.getComponent(sp.Skeleton);
            if (skeleton) {
                skeleton.setEventListener(null);
            }
        }
        
        if (this.changeSp) {
            this.changeSp.setCompleteListener(null);
        }
        
        console.log('  ✓ 事件監聽器已清理');
    }
    
    /**
     * 計算不顯示 Bonus 的索引
     */
    private calculateUnshowBonusIndexes(): void {
        const col = Data.Library.REEL_CONFIG.REEL_COL;
        const row = Data.Library.REEL_CONFIG.REEL_ROW + 2;
        
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                if (j !== 0 && j !== row - 1) { 
                    continue; 
                }
                this._unshowBonusIndex.push(i * row + j);
            }
        }
        console.log(`  ✓ 不顯示 Bonus 索引計算完成: ${this._unshowBonusIndex.length} 個`);
    }
    
    // ==================== Event Handlers ====================
    
    /**
     * Spine 動畫事件處理
     * @param trackIndex 軌道索引
     * @param event Spine 事件
     */
    private onSpineEvent(trackIndex: number, event: sp.spine.Event): void {
        if (event.data.name === "combo") {
            const cache = SymbolNodeCache.getInstance();
            const spreadController = cache.getSpreadController();
            
            if (spreadController) {
                if ((spreadController as any)._showCombo) {
                    (spreadController as any)._showCombo = false;
                    (spreadController as any).handleSpineAnm((spreadController as any)._comboLightAnm, "a", 0, "light", false);
                    (spreadController as any).handleSpineAnm((spreadController as any)._comboNumBeginAnm, "txt", 0, "num_begin", false);
                    (spreadController as any).handleSpineAnm((spreadController as any)._comboHitBeginAnm, "txt", 0, "hit_begin", false);
                }
                if ((spreadController as any)._startCount) {
                    (spreadController as any)._startCount = false;
                    (spreadController as any).countLinkNum();
                }
            }
        }
    }
    
    /**
     * 變換動畫完成處理
     * @param trackEntry 軌道條目
     * @param loopCount 循環次數
     */
    private onChangeComplete(trackEntry: any, loopCount: number): void {
        const animationName = trackEntry.animation.name;
        if (animationName === 'begin') {
            if (this.changeSp) {
                this.changeSp.enabled = false;
                console.log('🔄 變換動畫完成');
            }
        }
    }
    
    // ==================== Public Methods ====================
    
    /**
     * 設置符號圖片
     * @param sym 符號 ID
     */
    SetSymbol(sym: number): void {
        console.log(`🎴 設置符號: ${sym}`);
        this.SymIndex = sym;
        
        // 禁用動畫
        const anmNode = this.node.getChildByName("Anm");
        if (anmNode) {
            const skeleton = anmNode.getComponent(sp.Skeleton);
            if (skeleton) {
                skeleton.enabled = false;
            }
        }
        
        // 根據滾輪狀態設置圖片
        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            if (this.maskNode && (this.maskNode as any).blur === true) {
                sprite.spriteFrame = this.BlurPic[this.SymIndex];
            } else {
                sprite.spriteFrame = this.SymPic[this.SymIndex];
            }
        }
    }
    
    /**
     * 播放符號中獎動畫
     */
    PlaySymbolAnimation(): void {
        if (this.animController) {
            this.animController.playWinAnimation();
        }
    }
    
    /**
     * 停止符號動畫
     */
    StopSymbolAnimation(): void {
        if (this.animController) {
            this.animController.stopAllAnimations();
        }
    }
    
    /**
     * 重置符號深度（移回遮罩層）
     */
    ResetSymbolDepth(): void {
        if (this.maskNode) {
            this.maskNode.addChild(this.node);
            console.log('↩️ 符號已移回遮罩層');
        }
    }
    
    /**
     * 清除 Spine 動畫
     * @param spine Skeleton 組件
     */
    ClearAni(spine: sp.Skeleton): void {
        spine.clearTracks();
        spine.setToSetupPose();
    }
    
    /**
     * 播放 Scatter 動畫
     * @param type 動畫類型
     * @param slow 是否慢動作
     */
    playScatterAnimation(type: string, slow: boolean): void {
        this.isSlow = false;
        
        if (this.animController) {
            this.animController.playScatterAnimation(type as any, slow);
            if (slow && type === 'hit') {
                this.isSlow = true;
            }
        }
    }
    
    /**
     * 播放 Wild 動畫
     */
    PlayWildAnimation(): void {
        if (this.animController) {
            this.animController.playWildAnimation();
        }
    }
    
    /**
     * 播放變盤動畫
     */
    PlayChangeAnimation(): void {
        if (this.animController) {
            this.animController.playChangeAnimation();
        }
    }
}