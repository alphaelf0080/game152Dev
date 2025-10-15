import { _decorator, Component, Node, find, input, Input, EventTouch, Sprite, UITransform, sp, TweenAction, SpriteFrame, Vec3, log, tween, easing, instantiate, debug, AudioSource, Color, Animation } from 'cc';
import { Data, Mode } from '../DataController';
import { AllNode } from '../LibCreator/libScript/CommonLibScript';

import { Symbol } from './Symbol';
import { AnimationController } from '../AnimationController';
import { ShowWinController } from '../ShowWinController';
import { NodeCache } from './NodeCache';
import { StripManager } from './StripManager';
import { ReelUpdateManager } from './ReelUpdateManager';

const { ccclass, property } = _decorator;

let MessageConsole: Node = null;
let DropSymbolMap = null;

// 遊戲配置常量
const REEL_CONFIG = {
    DEFAULT_SYMBOL: 5,
    SYMBOL_DEPTH_BASE: 100
} as const;

interface BigSymbolIndex {
    NotBig: number,
    NormalBig: number,
    GoldBig: number
}


@ccclass('ReelController')
export class ReelController extends Component {
    // Strip 數據（保持原有變數供向後兼容）
    _strip = [];
    _CurStrip = [];
    _CurPayStrip = [];
    _reels = [];
    _reelposup = 0;
    _reelposleft = 0
    _reelpostop = 0;

    _curRngRuning = [];
    _curState = [];
    _script_tostop = [];

    // 節點快取
    _reelSlowAnm = null;
    screenSlowNode = null;
    symbolDarkNode = null;

    // 新增：管理器實例
    private nodeCache: NodeCache;
    private stripManager: StripManager;
    private updateManager: ReelUpdateManager;

    _topReelIndex: number = 6;

    bigSymbolIndex: BigSymbolIndex = {
        NotBig: 0,
        NormalBig: 1,
        GoldBig: 2
    };

    countStop: number = 0;
    alreadySetStrp: boolean = false;

    isSlowWaiting: boolean = false;

    _reelCol = Data.Library.REEL_CONFIG.REEL_COL;
    _reelRow = Data.Library.REEL_CONFIG.REEL_ROW;
    _realReelRow = Data.Library.REEL_CONFIG.REEL_ROW + 2;  //加2是因為上下各有一個隱藏的symbol
    _reel_W = Data.Library.REEL_CONFIG.REEL_SYMBOL_W;
    _reel_H = Data.Library.REEL_CONFIG.REEL_SYMBOL_H;
    _reelGapX = Data.Library.REEL_CONFIG.REEL_GAP_X;
    _reelGapY = Data.Library.REEL_CONFIG.REEL_GAP_Y;

    _startSpinBool: boolean = false;//開始spin時才會進update執行

    start() {
        console.log('=== ReelController.start() 開始初始化 ===');
        
        // 初始化管理器
        this.initializeManagers();
        console.log('✅ 管理器初始化完成');
        
        ShowWinController.Instance.init(this);

        MessageConsole = AllNode.Data.Map.get("MessageController");
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;

        // 使用節點快取系統預載入關鍵節點
        console.log('🔄 開始預載入節點快取...');
        this.nodeCache.preloadCriticalNodes(AllNode.Data.Map);
        this._reelSlowAnm = this.nodeCache.getNode("reelSlow", AllNode.Data.Map);
        this.screenSlowNode = this.nodeCache.getNode("ScreenSlowmote", AllNode.Data.Map);
        this.symbolDarkNode = this.nodeCache.getNode("reelBlack", AllNode.Data.Map);
        console.log('✅ 節點快取預載入完成');

        // 建立符號（Create Symbol）
        console.log('🔄 開始建立滾輪和符號...');
        let reelMask = AllNode.Data.Map.get("reelMask");  // 遮罩層
        let reelAnmNode = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolAnm");  // 一般動畫播放層
        let scatterAnmNode = AllNode.Data.Map.get('SymbolScatter');  // Scatter動畫播放層

        // 設置滾輪位置
        this._reelposleft = -280;
        this._reelposup = 355;
        console.log(`📍 滾輪位置設定: left=${this._reelposleft}, up=${this._reelposup}`);

        // 建立每一條滾輪
        // 建立每一條滾輪
        for (let i = 0; i < this._reelCol; i++) {
            let posX = this._reelposleft + (this._reel_W + this._reelGapX) * i;

            // 新增每一條滾輪節點
            let col = new ReelCol();
            col.name = "ReelCol" + i;
            col.setPosition(posX, this._reelposup);
            col.init(this, posX, this._reelposup, i, this._realReelRow);

            reelMask.addChild(col);
            this._reels.push(col);

            // 新增動畫層級節點
            let anmCol = new Node();
            anmCol.name = "AnmCol" + i;
            anmCol.setPosition(posX, this._reelposup);
            reelAnmNode.addChild(anmCol)

            // 新增 Scatter/Bonus 動畫層級節點
            let scatterCol = new Node();
            scatterCol.name = "ScatterAnmCol" + i;
            scatterCol.setPosition(posX, this._reelposup);
            scatterAnmNode.addChild(scatterCol);
        }
        
        console.log(`✅ 建立了 ${this._reelCol} 條滾輪`);

        this.SetReelActive(true);
        console.log('=== ReelController.start() 初始化完成 ===\n');
    }

    /**
     * 初始化管理器實例
     * 建立 NodeCache、StripManager、ReelUpdateManager
     */
    private initializeManagers(): void {
        console.log('🔧 初始化管理器...');
        
        // 單例模式獲取節點快取管理器
        this.nodeCache = NodeCache.getInstance();
        console.log('  ✓ NodeCache 初始化完成');
        
        // 建立 Strip 數據管理器
        this.stripManager = new StripManager({
            reelCol: this._reelCol,
            realReelRow: this._realReelRow,
            reelRow: this._reelRow,
            topReelIndex: this._topReelIndex
        });
        console.log(`  ✓ StripManager 初始化完成 (cols=${this._reelCol}, rows=${this._realReelRow})`);
        
        // 建立滾輪更新管理器
        this.updateManager = new ReelUpdateManager();
        console.log('  ✓ ReelUpdateManager 初始化完成');
    }

    /**
     * 優化的 Update 循環
     * 只在需要時更新滾輪，減少不必要的計算
     * 使用條件化更新和早期退出模式提升效能
     */
    update() {
        // 早期退出：如果不需要更新，直接返回
        if (!this._startSpinBool || !this.updateManager.shouldUpdate()) {
            return;
        }

        const isTurbo = Data.Library.StateConsole.isTurboEnable;
        this.updateManager.setTurboEnabled(isTurbo);

        // 只更新標記為 dirty 的滾輪（需要更新的滾輪）
        const dirtyReels = this.updateManager.getDirtyReels();
        
        // 效能追蹤（開發時可啟用）
        // const startTime = performance.now();
        
        for (const reelIndex of dirtyReels) {
            const reel = this._reels[reelIndex];
            if (reel && reel.rolling) {
                reel.Rolling();  // 執行滾輪滾動邏輯
                
                if (isTurbo) {
                    reel.TurboFunc();  // Turbo 模式加速
                }
                
                // 如果滾輪完成旋轉，清除 dirty 標記
                if (!reel.rolling) {
                    this.updateManager.clearReelDirty(reelIndex);
                }
            }
        }
        
        // 效能追蹤（開發時可啟用）
        // const endTime = performance.now();
        // if (endTime - startTime > 1) {
        //     console.warn(`⚠️ Update took ${(endTime - startTime).toFixed(2)}ms`);
        // }
    }

    /**
     * 處理廣播事件
     * @param data 事件數據，包含 EnventID 和 EnventData
     */
    HandleBroadcast(data: any) {
        console.log(`📡 HandleBroadcast: ${data.EnventID}`);
        
        let temp_strip_index;
        switch (data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY:
                console.log('  🌐 處理 NETREADY 事件');
                let last_rng = Data.Library.StateConsole.LastRng;
                let module_id = Data.Library.MathConsole.Striptables[0]._id;
                temp_strip_index = Data.Library.StateConsole.LastStripIndex * this._reelCol;
                console.log(`  📊 LastRng: [${last_rng}], module_id: ${module_id}, strip_index: ${temp_strip_index}`);
                this.Setstrip(temp_strip_index, module_id, true, last_rng);
                break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                console.log('  🔄 處理 STATECHANGE 事件');
                this.HandleStateChange(data.EnventData);
                break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eRESET_STRIP:
                console.log('  🔁 處理 RESET_STRIP 事件');
                let curmodule_id = Data.Library.MathConsole.CurModuleid;
                temp_strip_index = Data.Library.MathConsole.getWinData().strip_index * this._reelCol;
                this.Setstrip(temp_strip_index, curmodule_id, false, [0, 0, 0, 0, 0, 0]);
                Data.Library.StateConsole.nextState();
                break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelStripsAlready:
                console.log('  ✅ 處理 ReelStripsAlready 事件');
                this.SetAllStrip();
                break;

            default: 
                console.log(`  ⚠️ 未處理的事件: ${data.EnventID}`);
                break;
        }
    }

    /**
     * 處理遊戲狀態變更
     * @param state 新的遊戲狀態
     */
    HandleStateChange(state) {
        console.log(`🎮 狀態變更: ${state}`);
        
        switch (state) {
            case Mode.FSM.K_IDLE: 
                console.log('  💤 進入 IDLE 狀態');
                break;

            case Mode.FSM.K_SPIN:
            case Mode.FSM.K_FEATURE_SPIN:
                console.log('  🎰 開始旋轉 (SPIN)');
                this.StartRolling();
                break;

            case Mode.FSM.K_SPINSTOPING:
            case Mode.FSM.K_FEATURE_SPINSTOPING:
                console.log('  🛑 滾輪停止中 (SPINSTOPING)');
                if (Data.Library.SPIN_LATE == true) {
                    console.log('    ⏰ SPIN_LATE 模式，延遲開始旋轉');
                    this._reels.forEach((reel) => { reel.BefRolling(); })  // 開始旋轉
                    this._startSpinBool = true;
                }
                break;

            case Mode.FSM.K_EXPEND: 
                console.log('  📏 EXPEND 狀態');
                break;
            case Mode.FSM.K_FEATURE_EXPEND: 
                console.log('  📏 FEATURE_EXPEND 狀態');
                break;

            case Mode.FSM.K_DROP: 
                console.log('  ⬇️ DROP 狀態');
                break;
            case Mode.FSM.K_FEATURE_DROP: 
                console.log('  ⬇️ FEATURE_DROP 狀態');
                break;

            case Mode.FSM.K_SHOWWIN:
            case Mode.FSM.K_FEATURE_SHOWWIN:
                console.log('  🎉 顯示贏分 (SHOWWIN)');
                ShowWinController.Instance.isNextRound = false;
                DropSymbolMap.CurrIndex = 0;
                ShowWinController.Instance.WinLineControl();
                break;

            case Mode.FSM.K_FEATURE_TRIGGER:
            case Mode.FSM.K_FEATURE_RETRIGGER:
                console.log('  🎊 Feature 觸發/重觸發');
                this._reelSlowAnm.active = false;
                this.symbolDarkNode.children.forEach(function (e) {
                    e.active = true;
                });
                if (this.symbolDarkNode.getComponent(Sprite).color.a == 0) {
                    this.symbolDarkNode.getComponent(Animation).stop();
                    this.symbolDarkNode.getComponent(Animation).play("fadeIn");
                }

                for (let i = 0; i < this._reels.length; i++) {
                    for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                        if (j == 0 || j == this._realReelRow - 1) { continue; }
                        this._reels[i].symbolAry[j].getComponent(Symbol).playScatterAnimation("loop", false);
                    }
                }
                break;
            case Mode.FSM.K_WAIT:
            case Mode.FSM.K_FEATURE_WAIT:
                console.log('  ⏳ 等待狀態 (WAIT)');
                // if (Data.Library.StateConsole.CurScene == Mode.SCENE_ID.FEATURE0) {
                //     this.symbolDarkNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);                   
                // }
                for (let i = 0; i < this._reels.length; i++) {
                    for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                        if (j == 0 || j == this._realReelRow - 1) { continue; }
                        let symbolComponent = this._reels[i].symbolAry[j].getComponent(Symbol)
                        if (symbolComponent.SymIndex == 1 && symbolComponent.isSlow == true) {
                            symbolComponent.StopSymbolAnimation();
                        }
                    }
                }
                break;
            case Mode.FSM.K_FEATURE_TRANSLATE:
                console.log('  🔄 Feature 轉場 (TRANSLATE)');
                this.HandleTranslate();
                break;
            case Mode.FSM.K_FEATURE_CHEKRESULT:
                console.log('  ✔️ 檢查結果 (CHECKRESULT)');
                this.HandleCheckresult();
                break;
            default:
                console.log(`  ⚠️ 未處理的狀態: ${state}`);
                break;
        }
    }

    /**
     * 開始滾輪旋轉
     * 初始化旋轉相關狀態並標記所有滾輪需要更新
     */
    StartRolling() {
        console.log('🎰 === StartRolling 開始 ===');
        this.countStop = 0;

        ShowWinController.Instance.isNextRound = true;
        ShowWinController.Instance.isShowOneRound = false;

        AnimationController.Instance.ShowOneRoundScore(false, -1);  // 關閉滾輪中間秀分數的 Node

        this.ShowDark(false);
        this.StopAllSymbolAnimation();
        this.ResetAllSymbolDepth();

        // 設置更新管理器狀態 - 標記所有滾輪需要更新
        console.log('🔄 設置更新管理器狀態...');
        this.updateManager.setSpinning(true);
        this.updateManager.markAllReelsDirty(this._reels.length);
        console.log(`  ✓ 已標記 ${this._reels.length} 個滾輪為 dirty 狀態`);

        if (Data.Library.SPIN_LATE) {
            console.log('  ⏰ SPIN_LATE 模式：先請求結果');
            Data.Library.StateConsole.resultCall();
        } else {
            console.log('  ⚡ 正常模式：立即開始旋轉');
            this._reels.forEach((reel) => { reel.BefRolling(); })  // 開始旋轉
            this._startSpinBool = true;
            this.scheduleOnce(() => {  // 0.1 秒後取得封包
                console.log('  📦 請求遊戲結果...');
                Data.Library.StateConsole.resultCall();
                this.alreadySetStrp = false;
            }, 0.1)
        }
        console.log('🎰 === StartRolling 完成 ===\n');
    }

    /**
     * 設置滾輪節點的啟用狀態
     * @param occur true 啟用，false 停用
     */
    /**
     * 設置滾輪節點的啟用狀態
     * @param occur true 啟用，false 停用
     */
    SetReelActive(occur: boolean) {
        console.log(`🔧 設置滾輪 Active: ${occur}`);
        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                this._reels[i].symbolAry[j].active = occur;
            }
        }
    }

    /**
     * 用索引取得滾輪符號節點
     * @param index 符號的線性索引（0 到 reelCol * realReelRow - 1）
     * @returns 符號節點，若索引無效則返回 undefined
     */
    GetSymbol(index: number): Node {
        if (index < 0 || index > this._realReelRow * this._reelCol - 1) { 
            console.warn(`⚠️ GetSymbol: 索引 ${index} 超出範圍 [0, ${this._realReelRow * this._reelCol - 1}]`);
            return; 
        }

        let col = Math.floor(index / this._realReelRow);  // 計算列索引
        let row = index % this._realReelRow;  // 計算行索引

        return this._reels[col].symbolAry[row];
    }

    /**
     * 取得真實可見的符號（未實作）
     * @param index 可見符號索引
     */
    GetRealSymbol(index: number) {
        if (index < 0 || index > this._reelRow * this._reelCol - 1) { 
            console.warn(`⚠️ GetRealSymbol: 索引 ${index} 超出範圍`);
            return; 
        }
    }

    /**
     * 重置所有符號的深度（Z-index）
     * 將所有符號恢復到初始深度位置
     */
    /**
     * 重置所有符號的深度（Z-index）
     * 將所有符號恢復到初始深度位置
     */
    ResetAllSymbolDepth() {
        console.log('🔄 重置所有符號深度...');
        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                this._reels[i].symbolAry[j].getComponent(Symbol).ResetSymbolDepth();
            }
        }
    }

    /**
     * 滾輪停止回調
     * 當滾輪停止時處理 SlowMotion 效果和音效
     * 全部滾輪停止後進入下一狀態
     */
    CallStopping(): void {
        // 檢查是否在正確的停止狀態
        if (Data.Library.StateConsole.CurState != Mode.FSM.K_SPINSTOPING && 
            Data.Library.StateConsole.CurState != Mode.FSM.K_FEATURE_SPINSTOPING) { 
            return; 
        }

        let next = this.countStop + 1;
        console.log(`🛑 CallStopping: 滾輪 ${this.countStop} 已停止，下一個: ${next}`);
        
        if (!Data.Library.StateConsole.isTurboEnable) {
            // 非 Turbo 模式下檢查 SlowMotion
            if (Data.Library.MathConsole.getWinData()._slowmotion_flag[next] == 1) {
                console.log(`  ⏱️ SlowMotion 效果啟動於滾輪 ${next}`);
                // 使用快取的音效組件
                const slowMotionAudio = this.nodeCache.getNode("SlowMotion", AllNode.Data.Map)?.getComponent(AudioSource);
                const osSlowMotionAudio = this.nodeCache.getNode("OsSlowMotion", AllNode.Data.Map)?.getComponent(AudioSource);
                
                if (slowMotionAudio) slowMotionAudio.play();
                if (osSlowMotionAudio) osSlowMotionAudio.play();
                
                this.isSlowWaiting = true;
                this._reels[next].SlowMotion();
                this.SlowMotionAnm(true, next);
            } else {
                // 停止 SlowMotion 音效
                const slowMotionAudio = this.nodeCache.getNode("SlowMotion", AllNode.Data.Map)?.getComponent(AudioSource);
                if (slowMotionAudio?.playing) {
                    slowMotionAudio.stop();
                }
                this.isSlowWaiting = false;
                this.SlowMotionAnm(false, -1);
                
                // 播放滾輪停止音效（使用快取）
                const reelStopAudio = this.nodeCache.getReelStopAudio(this.countStop + 1);
                if (reelStopAudio) {
                    console.log(`  🔊 播放滾輪停止音效: ${this.countStop + 1}`);
                    reelStopAudio.play();
                }
            }
        }

        // 檢查是否所有滾輪都已停止
        if (this.countStop++ >= this._reels.length - 1) {
            console.log('✅ 所有滾輪已停止，進入下一狀態');
            this._startSpinBool = false;
            this.updateManager.setSpinning(false);
            this.updateManager.clearAllDirty();
            Data.Library.StateConsole.nextState();
        }
    }

    /**
     * SlowMotion 動畫效果
     * @param occur true 啟動效果，false 關閉效果
     * @param index 滾輪索引（-1 表示全部）
     */
    /**
     * SlowMotion 動畫效果
     * @param occur true 啟動效果，false 關閉效果
     * @param index 滾輪索引（-1 表示全部）
     * 注意：此遊戲的 bonus symbol 只會出現在前三排滾輪，動畫位置固定
     */
    SlowMotionAnm(occur: boolean, index: number) {
        console.log(`⏱️ SlowMotion 動畫: ${occur ? '啟動' : '關閉'}, 滾輪: ${index}`);
        
        this.ShowDark(occur);  // 控制畫面變暗效果
        this._reelSlowAnm.active = occur;
        this.screenSlowNode.active = occur;

        let slowAnm = this._reelSlowAnm.getComponent(sp.Skeleton);
        let screenSlow = this.screenSlowNode.getComponent(sp.Skeleton);
        if (occur) {
            Mode.ShowSpine(slowAnm, 0, 'loop', true, null);
            Mode.ShowSpine(screenSlow, 0, 'loop', true, null);
        } else {
            Mode.ClearSpine(slowAnm);
            Mode.ClearSpine(screenSlow);
        }

        // 控制壓暗遮罩，只顯示指定滾輪
        let children = this.symbolDarkNode.children;
        children.forEach(child => {
            if (child.name == 'reel' + index) {
                child.active = false;  // 不壓暗當前滾輪
            } else {
                child.active = true;   // 壓暗其他滾輪
            }
        })
    }

    /**
     * 更新符號資訊
     * 從 strips 中抽取 RNG 數據並更新符號
     * @param index 滾輪索引
     * @param num -1 表示從 strip 隨機取值，其他值表示從停止腳本取值
     */
    /**
     * 更新符號資訊
     * 從 strips 中抽取 RNG 數據並更新符號
     * @param index 滾輪索引
     * @param num -1 表示從 strip 隨機取值，其他值表示從停止腳本取值
     */
    UpdateSymbolInfo(index: number, num: number) {
        // console.log(`📊 更新符號資訊: 滾輪=${index}, num=${num}`);
        
        if (num == -1) {
            // 從 strip 中隨機取值（旋轉中）
            let strip = this._strip[index];
            this._curRngRuning[index] = this._curRngRuning[index] - 1;
            if (this._curRngRuning[index] < 0) { 
                this._curRngRuning[index] = strip.length - 1; 
            }
            if (this._curRngRuning[index] >= strip.length) { 
                this._curRngRuning[index] = this._curRngRuning[index] % strip.length; 
            }
            let symbol = strip[this._curRngRuning[index]];

            this._CurStrip[index].unshift(symbol);
            this._CurStrip[index].pop();
            this._CurPayStrip[index].unshift(this.RandomPay(symbol));
            this._CurPayStrip[index].pop();
        } else {
            // 從停止腳本取值（停止時）
            let syb = this._script_tostop[index][num];

            this._CurStrip[index].unshift(syb);
            this._CurStrip[index].pop();
            this._CurPayStrip[index].unshift(this.GetSymbolExtraPay(syb, this._script_tostop[index].length <= this._reelRow && this._script_tostop[index].length > 0, this._script_tostop[index].length - 1, index));
            this._CurPayStrip[index].pop();
        }

        this._reels[index].GetStrips(this._CurStrip[index])  // 將資料更新進滾輪陣列
    }

    /**
     * 設置所有滾輪的停止位置
     * 根據 RNG 結果計算每個滾輪應該停止的符號序列
     */
    SetAllStrip() {
        let rng = Data.Library.MathConsole.getWinData()._rng;
        if (rng == null || rng.length == 0) { 
            console.warn('⚠️ SetAllStrip: RNG 數據為空');
            return; 
        }

        console.log(`📊 設置停止 Strip，RNG: [${rng}]`);
        this._script_tostop = [];

        for (let i = 0; i < rng.length; i++) {
            let tmpAry = [];
            let pos = rng[i] - 2;
            if (pos < 0) { pos = this._strip[i].length + pos; }
            for (let j = 0; j < this._realReelRow; j++) {
                tmpAry.push(this._strip[i][pos++]);
                if (pos >= this._strip[i].length) { pos -= this._strip[i].length; }
            }
            this._script_tostop.push(tmpAry);
        }
        console.log('停止腳本:', this._script_tostop);

        this.alreadySetStrp = true;
        this._reels.forEach(reel => { reel.AlreadyGetStrip(); })
        console.log('✅ 所有滾輪已接收停止腳本');
    }

    /**
     * 判斷兩個陣列是否完全相同
     * @param ary1 陣列1
     * @param ary2 陣列2
     * @returns true 如果內容完全相同
     */
    ArrayAreEqual(ary1: number[], ary2: number[]): boolean {
        if (ary1.length != ary2.length) { return false; }
        return ary1.every((value, index) => value === ary2[index]);
    }

    /**
     * 控制滾輪壓暗效果
     * @param occur true 顯示壓暗，false 取消壓暗
     */
    ShowDark(occur: boolean): void {
        // console.log(`🌑 滾輪壓暗: ${occur}`);
        this.symbolDarkNode.getComponent(Animation).stop();

        let currentColor = this.symbolDarkNode.getComponent(Sprite);

        if (occur && currentColor.color.a > 0) {
            currentColor.color = new Color(255, 255, 255, 255);
            return;
        }

        if (occur) {
            currentColor.color = new Color(255, 255, 255, 255);
            //this.symbolDarkNode.getComponent(Animation).play("fadeIn");
        } else {
            currentColor.color = new Color(255, 255, 255, 0);
        }
    }

    /**
     * 停止所有滾輪動畫
     * 遍歷所有滾輪的 Symbol 並停止其動畫播放
     */
    StopAllSymbolAnimation() {
        // console.log('⏸ 停止所有 Symbol 動畫');
        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                this._reels[i].symbolAry[j].getComponent(Symbol).StopSymbolAnimation();
            }
        }
    }

    /**
     * 檢查兩個陣列是否有共同元素
     * 使用 Set 資料結構提高效能
     * @param array1 陣列1
     * @param array2 陣列2
     * @returns true 如果有任何共同元素
     */
    HasCommonElement(array1: number[], array2: number[]): boolean {
        const setArray2 = new Set(array2);  // 將其中一個陣列轉換為Set，以便高效檢查存在性

        for (const element of array1) {  // 遍歷第一個陣列並檢查每個元素是否存在於第二個陣列中
            if (setArray2.has(element)) {
                return true; // 發現共同元素，返回true
            }
        }

        return false;  // 完成遍歷且未找到共同元素，返回false
    }

    /**
     * 處理 Feature 轉場
     * 切換場景並處理 FG 相關邏輯
     */
    HandleTranslate() {
        console.log('🔄 HandleTranslate: Feature 轉場開始');
        ShowWinController.Instance.isNextRound = true;
        AnimationController.Instance.ShowOneRoundScore(false, -1);

        this.symbolDarkNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);
        this._reelSlowAnm.active = false;

        // 保存當前畫面符號到 LastBsResult 並重置狀態
        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                let index = i * this._reels[i].symbolAry.length + j;
                let symbol = this._reels[i].symbolAry[j].getComponent(Symbol);
                Data.Library.MathConsole.LastBsResult.Reel[index] = symbol.SymIndex;
                symbol.StopSymbolAnimation();
                symbol.ResetSymbolDepth();
            }
        }
        console.log('✅ 轉場處理完成，符號已保存至 LastBsResult');
    }

    /**
     * 處理免費遊戲結束後的檢查結果
     * 恢復基礎遊戲畫面的符號狀態
     */
    HandleCheckresult() {
        console.log('✔️ HandleCheckresult: 檢查結果並恢復畫面');
        ShowWinController.Instance.isNextRound = true;
        AnimationController.Instance.ShowOneRoundScore(false, -1);
        this._reelSlowAnm.active = false;
        this.StopAllSymbolAnimation();
        this.ResetAllSymbolDepth();

        this.scheduleOnce(() => {
            console.log('  🔄 恢復 LastBsResult 符號狀態');
            for (let i = 0; i < Data.Library.MathConsole.LastBsResult.Reel.length; i++) {
                let symbolIndex = Data.Library.MathConsole.LastBsResult.Reel[i];
                let reel = this.GetSymbol(i);
                reel.getComponent(Symbol).SetSymbol(symbolIndex);
                reel.getComponent(Symbol).playScatterAnimation('loop', false);
            }
            console.log('  ✅ 符號恢復完成');
        }, 1);
    }

    /**
     * 設置 RNG 輪條數據
     * @param startIndex 起始索引
     * @param id Strip ID
     * @param isChangeNow 是否立即生效
     * @param rng RNG 陣列
     */
    Setstrip(startIndex: number, id: string, isChangeNow: boolean, rng: number[]) {
        console.log(`📋 Setstrip: id=${id}, startIndex=${startIndex}, isChangeNow=${isChangeNow}`);
        this._strip = [];
        let stirptable = Data.Library.MathConsole.getStriptable(id);
        for (let i = 0; i < this._reelCol; i++) {
            this._strip.push(stirptable._strips[(i + startIndex)]);
        }
        console.log('  Strip 數據:', this._strip);
        if (isChangeNow) { 
            console.log('  ⚡ 立即初始化 FOV Strip');
            this.Initfovstrip(isChangeNow, rng); 
        }
    }

    /**
     * 初始化 FOV (Field of View) Strip
     * 根據 RNG 位置初始化當前可見的符號條
     * @param isChangeNow 是否立即更新畫面
     * @param rng RNG 陣列
     */
    Initfovstrip(isChangeNow: boolean, rng: number[]) {
        console.log('🔍 Initfovstrip: 初始化可見符號條');
        this._CurStrip = [];
        this._CurPayStrip = [];
        this._curRngRuning = [];
        
        for (let i = 0; i < this._reelCol; i++) {
            let fovstrip = [];
            let paystrip = [];
            let pos = ((rng[i] - 2) + this._strip[i].length) % this._strip[i].length;
            this._curRngRuning.push(pos);
            
            for (let j = 0; j < this._realReelRow; j++) {
                pos = pos % this._strip[i].length;
                fovstrip.push(this._strip[i][pos]);
                paystrip.push(this.GetSymbolExtraPay(this._strip[i][pos], j - 1 <= this._reelRow, j - 1, i));
                pos++;
            }
            this._CurStrip.push(fovstrip);
            this._CurPayStrip.push(paystrip);
        }
        console.log('  ✅ FOV Strip 初始化完成');
        
        if (isChangeNow) { 
            console.log('  🔄 立即更新滾輪畫面');
            this.UpdateReel(isChangeNow); 
        }
    }

    /**
     * 更新滾輪畫面
     * 將 Strip 數據同步到實際的滾輪符號顯示
     * @param isChangeNow 是否立即生效
     */
    UpdateReel(isChangeNow: boolean): void {
        console.log('🔄 UpdateReel: 更新滾輪符號顯示');
        for (let i = 0; i < this._reelCol; i++) {
            let paytrip = this._CurPayStrip[i];
            for (let j = 0; j < paytrip.length; j++) {
                let symbol = paytrip[j];
                if (symbol === undefined) { 
                    console.warn(`  ⚠️ 符號 undefined，使用預設值 ${REEL_CONFIG.DEFAULT_SYMBOL}`);
                    symbol = REEL_CONFIG.DEFAULT_SYMBOL;
                }
                let idx = i * paytrip.length + j;
                let a = Math.floor(idx / Data.Library.REEL_CONFIG.REEL_COL_LENGTH);
                let b = idx % Data.Library.REEL_CONFIG.REEL_COL_LENGTH - 1;
                if (idx % Data.Library.REEL_CONFIG.REEL_COL_LENGTH != 0 && idx % Data.Library.REEL_CONFIG.REEL_COL_LENGTH != (Data.Library.REEL_CONFIG.REEL_COL_LENGTH - 1)) {
                    Data.Library.StateConsole.SymbolMap[(a * this._reelRow + b)] = symbol;
                }
            }
        }

        // 將 Strip 數據同步到各滾輪並設置符號
        for (let i = 0; i < this._reels.length; i++) {
            this._reels[i].GetStrips(this._CurStrip[i])
            this._reels[i].SetSymbol(isChangeNow);
        }

        // 保存符號狀態到 LastBsResult
        for (let i = 0; i < this._reels.length; i++) {
            let symbolLen = this._reels[i].symbolAry.length
            for (let j = 0; j < symbolLen; j++) {
                let index = i * symbolLen + j;
                Data.Library.MathConsole.LastBsResult.Reel[index] = this._reels[i].symbolAry[j].getComponent(Symbol).SymIndex;
            }
        }
        console.log('  ✅ 滾輪更新完成');
    }

    /**
     * 取得符號的額外賠付值
     * 根據是否為最終結果、位置等判斷使用哪個賠付數據
     * @param symbol 符號 ID
     * @param isLastResult 是否為最終結果
     * @param finalPos 最終位置
     * @param index 滾輪索引
     * @returns 賠付值
     */
    GetSymbolExtraPay(symbol, isLastResult, finalPos, index) {
        let ret = 0;
        
        if (isLastResult && Data.Library.MathConsole.getWinData()._payOfPos.length) {
            // 使用當前結果的 payOfPos
            if (index === this._topReelIndex)
                ret = Data.Library.MathConsole.getWinData()._payOfPos[index * this._reelRow + (3 - finalPos)];
            else
                ret = Data.Library.MathConsole.getWinData()._payOfPos[index * this._reelRow + finalPos];
        }
        else if (isLastResult && Data.Library.StateConsole.LastPay) {
            // 使用上次的 LastPay
            ret = Data.Library.StateConsole.LastPay[index * this._reelRow + finalPos];
        }
        else {
            // 使用隨機賠付
            ret = this.RandomPay(symbol);
        }
        
        if (ret === undefined) ret = 0;
        if (ret === 0) if (Math.random() > 0.5) ret = 10;

        return ret;
    }

    RandomPay(sym) {
        if (sym === 10) return 0;
        if (sym >= 10) { return; }

        let _md = sym;
        let maxNum = Data.Library.MQ_RANDOMSYB_WEIGHT[_md].TA - 1;
        let minNum = 0;
        let rng = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        
        for (let i = 0; i < Data.Library.MQ_RANDOMSYB_WEIGHT[_md].RSYB.length; i++) {
            if (rng < Data.Library.MQ_RANDOMSYB_WEIGHT[_md].WT[i]) {
                return Data.Library.MQ_RANDOMSYB_WEIGHT[_md].RSYB[i];
            }
            rng -= Data.Library.MQ_RANDOMSYB_WEIGHT[_md].WT[i];
        }
        return 0;
    }
}

/**
 * 滾輪列類別
 * 管理單一滾輪列的旋轉、停止、符號更新等行為
 */
class ReelCol extends Node {
    index: number = null;  // 滾輪索引
    parents = null;  // 父物件參考
    originX: number = 0;  // Scene 上的 X 軸座標
    originY: number = 0;  // Scene 上的 Y 軸座標
    reelColX: number = 0;  // 此 column 的 X 軸座標
    reelColY: number = 0;  // 此 column 的 Y 軸座標
    symbolW: number = Data.Library.REEL_CONFIG.REEL_SYMBOL_W;  // symbol 寬度
    symbolH: number = Data.Library.REEL_CONFIG.REEL_SYMBOL_H;  // symbol 高度
    symbolGapX: number = Data.Library.REEL_CONFIG.REEL_GAP_X;  // symbol 之間 X 間距
    symbolGapY: number = Data.Library.REEL_CONFIG.REEL_GAP_Y;  // symbol 之間 Y 間距
    realReelRow: number = null;  // 實際滾輪行數

    symbolAry = [];  // 符號陣列
    posX_Ary = [];  // 每個 symbol 的 X 軸座標
    posY_Ary = [];  // 每個 symbol 的 Y 軸座標

    rolling: boolean = false;  // 是否正在旋轉
    negativeDir: boolean = false;  // 負方向旋轉
    blur: boolean = false;  // 模糊效果

    wait: number = 0;  // 等待計數
    nowSpeed: number = 1;  // 當前速度
    maxSpeed: number = 102;  // 最大速度
    nowMove: number = 0;  // 當前移動量
    maxMove: number = 10;  // 最大移動量
    space: number = -4;  // 間距

    strips: number[] = [];  // Strip 數據
    isSetSymbol: boolean = false;  // 是否重設滾輪圖片
    isLastRound: boolean = false;  // 是否為最後一輪
    isSlomotion: boolean = false;  // 是否在 SlowMotion
    lastRngCount: number = -1;  // 上次 RNG 計數

    /**
     * 初始化滾輪列
     * @param parent 父組件
     * @param x X 座標
     * @param y Y 座標
     * @param index 滾輪索引
     * @param totalRow 總行數
     */
    init(parent: Component, x: number, y: number, index: number, totalRow: number) {
        console.log(`🎲 ReelCol.init: index=${index}, totalRow=${totalRow}`);
        this.parents = parent;
        this.index = index;
        this.reelColX = x;
        this.reelColY = y;
        this.realReelRow = totalRow;

        let clone = find("Canvas/BaseGame/Layer/Shake/Reel/reelMask/symbol");
        for (let i = 0; i < totalRow; i++) {
            let reelIndex = this.index * this.realReelRow + i;
            let instance = instantiate(clone);
            let posX = 0;
            let posY = -((this.symbolH + this.symbolGapY) * i);
            
            this.posX_Ary.push(posX);
            this.posY_Ary.push(posY);

            instance.setPosition(0, posY);
            instance.getComponent(Symbol).reelIndex = reelIndex;
            instance.getComponent(Symbol).reelCol = this.index;
            
            // 使用配置常量計算深度
            const depthIndex = REEL_CONFIG.SYMBOL_DEPTH_BASE - reelIndex;
            instance.getComponent(Symbol).ordIdx = depthIndex;
            instance.setSiblingIndex(depthIndex);

            this.addChild(instance);
            this.symbolAry.push(instance);
        }

        this.originX = this.parents._reelposleft;
        this.originY = this.parents._reelposup;
        console.log(`  ✅ 滾輪 ${index} 初始化完成，共 ${totalRow} 個符號`);
    }

    /**
     * 開始旋轉前的準備
     * 初始化滾輪旋轉相關參數
     */
    BefRolling() {
        console.log(`🎬 ReelCol.BefRolling: 滾輪 ${this.index} 準備開始旋轉`);
        this.wait = Data.Library.StateConsole.isTurboEnable ? 0 : this.index * this.space;
        this.nowSpeed = 1;
        this.nowMove = 0;
        this.negativeDir = true;
        this.isLastRound = false;
        this.isSlomotion = false;
        this.blur = true;

        this.lastRngCount = -1;

        this.rolling = true;
        this.parents._nowStopReel = 0;
    }

    /**
     * 滾輪旋轉邏輯
     * 處理加速、減速、停止等階段
     */
    Rolling() {
        if (!this.rolling) { return; }
        if (this.wait++ < 0) { return; }  // 用來間隔每條滾輪時間

        let vec = this.getPosition();

        // 反方向移動（啟動階段）
        if (this.negativeDir) {
            if (Math.abs(this.reelColY - vec.y) < Math.floor(this.symbolH / 3)) {
                this.setPosition(this.reelColX, vec.y + this.nowSpeed);
                if (this.nowSpeed < this.maxSpeed) { this.nowSpeed++; }  // 慢慢加速
                return;
            } else { this.negativeDir = false; }
        }

        // 正常移動階段
        if (this.nowMove <= this.maxMove) {
            if (vec.y - this.nowSpeed > this.reelColY - this.symbolH) {
                this.setPosition(this.reelColX, vec.y - this.nowSpeed)
                this.isSetSymbol = false;
            } else {
                this.setPosition(this.reelColX, this.reelColY);
                this.isSetSymbol = true;
            }
            
            // 速度控制
            if (!this.isSlomotion && this.nowSpeed < this.maxSpeed) { this.nowSpeed += 4; }
            if (!this.isLastRound) { this.nowMove--; }
            if (this.isLastRound && this.nowMove < 0) { this.nowMove = 0; }
            
            if (this.isSetSymbol) {
                // 計算當前 RNG 位置
                if (this.maxMove - this.nowMove >= 0 && this.maxMove - this.nowMove < this.realReelRow) {
                    this.lastRngCount = this.maxMove - this.nowMove;
                    this.blur = false;
                } else { 
                    this.lastRngCount = -1; 
                }

                // SlowMotion 等待控制
                if (this.parents.isSlowWaiting && this.maxMove - this.nowMove < this.realReelRow && !this.isSlomotion) {
                    this.lastRngCount = -1;
                }

                if (!this.parents.isSlowWaiting || (this.parents.isSlowWaiting && this.isSlomotion)) {
                    this.nowMove++;
                }

                // 更新符號資訊
                this.parents.UpdateSymbolInfo(this.index, this.lastRngCount);
                this.SetSymbol(false);
            }
        } else {
            // 最後處理 swing back（回彈效果）
            if (Math.abs(this.reelColY - vec.y) < Math.floor(this.symbolH / 6)) {
                // 將滾輪往下推 1/6
                this.setPosition(this.reelColX, vec.y - Math.floor(this.maxSpeed / 8));
                return;
            } else {
                // 將滾輪設回原位
                this.setPosition(this.reelColX, this.reelColY);
                this.AllFinish();
            }
        }
    }

    /**
     * 取得 Strip 數據
     * @param strip 符號序列
     */
    GetStrips(strip: number[]) {
        this.strips = strip;
    }

    /**
     * 設置符號
     * @param isChangeNow 是否立即生效
     */
    SetSymbol(isChangeNow: boolean) {
        for (let i = 0; i < this.symbolAry.length; i++) {
            this.symbolAry[i].getComponent(Symbol).SetSymbol(this.strips[i]);
        }
        if (isChangeNow) { this.AllInit(); }
    }

    /**
     * SlowMotion 效果
     * 降低速度並調整移動量
     */
    SlowMotion() {
        console.log(`⏱️ ReelCol.SlowMotion: 滾輪 ${this.index} 啟動慢動作`);
        this.nowSpeed = Math.floor(this.maxSpeed / 3);
        this.nowMove = Math.floor(this.maxMove / 2);
        this.isSlomotion = true;
    }

    /**
     * Turbo 加速功能
     */
    TurboFunc() {
        if (this.nowSpeed < this.maxSpeed) { this.nowSpeed++; }
        if (this.isLastRound && this.maxMove - this.nowMove > 6) { this.nowMove++; }
    }

    /**
     * 初始化所有符號動畫
     */
    AllInit() {
        for (let i = 0; i < this.symbolAry.length; i++) {
            if (i == 0 || i == this.realReelRow - 1) { continue; }
            this.symbolAry[i].getComponent(Symbol).playScatterAnimation('idle', false);
            this.symbolAry[i].getComponent(Symbol).PlayWildAnimation();
        }
    }

    /**
     * 滾輪停止後的處理
     */
    AllFinish() {
        console.log(`🛑 ReelCol.AllFinish: 滾輪 ${this.index} 停止完成`);
        this.parents.CallStopping(this.index);
        this.rolling = false;

        // 播放符號的 hit 動畫
        for (let i = 0; i < this.symbolAry.length; i++) {
            if (i == 0 || i == this.realReelRow - 1) { continue; }
            this.symbolAry[i].getComponent(Symbol).playScatterAnimation('hit', false);
            this.symbolAry[i].getComponent(Symbol).PlayWildAnimation();
        }
    }

    /**
     * 已收到封包結果的回調
     * 標記為最後一輪，準備停止
     */
    AlreadyGetStrip() {
        console.log(`📥 ReelCol.AlreadyGetStrip: 滾輪 ${this.index} 收到 Strip 數據`);
        this.isLastRound = true;
    }
}