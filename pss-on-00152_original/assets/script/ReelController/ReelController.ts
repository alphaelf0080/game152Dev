import { _decorator, Component, Node, find, input, Input, EventTouch, Sprite, UITransform, sp, TweenAction, SpriteFrame, Vec3, log, tween, easing, instantiate, debug, AudioSource, Color, Animation } from 'cc';
import { Data, Mode } from '../DataController';
import { AllNode } from '../LibCreator/libScript/CommonLibScript';

import { Symbol } from './Symbol';
import { AnimationController } from '../AnimationController';
import { ShowWinController } from '../ShowWinController';

const { ccclass, property } = _decorator;

let MessageConsole: Node = null;
let DropSymbolMap = null;

interface BigSymbolIndex {
    NotBig: number,
    NormalBig: number,
    GoldBig: number
}


@ccclass('ReelController')
export class ReelController extends Component {
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

    _reelSlowAnm = null;
    screenSlowNode = null;
    symbolDarkNode = null;

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
        ShowWinController.Instance.init(this);

        MessageConsole = AllNode.Data.Map.get("MessageController");
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;

        this._reelSlowAnm = AllNode.Data.Map.get("reelSlow");
        this.screenSlowNode = AllNode.Data.Map.get("ScreenSlowmote");
        this.symbolDarkNode = AllNode.Data.Map.get("reelBlack");

        // Create Symbol
        let reelMask = AllNode.Data.Map.get("reelMask");  //遮罩層
        let reelAnmNode = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolAnm");  //一般動畫播放層
        let scatterAnmNode = AllNode.Data.Map.get('SymbolScatter');  //Scatter動畫播放層


        this._reelposleft = -280;
        this._reelposup = 355;

        for (let i = 0; i < this._reelCol; i++) {
            let posX = this._reelposleft + (this._reel_W + this._reelGapX) * i;

            let col = new ReelCol();  //新增每一條滾輪Node
            col.name = "ReelCol" + i;
            col.setPosition(posX, this._reelposup);
            col.init(this, posX, this._reelposup, i, this._realReelRow);

            reelMask.addChild(col);
            this._reels.push(col);

            let anmCol = new Node();  //新增動畫層級Node
            anmCol.name = "AnmCol" + i;
            anmCol.setPosition(posX, this._reelposup);
            reelAnmNode.addChild(anmCol)

            let scatterCol = new Node();  //新增Bonus動畫層級Node
            scatterCol.name = "ScatterAnmCol" + i;
            scatterCol.setPosition(posX, this._reelposup);
            scatterAnmNode.addChild(scatterCol);
        }

        this.SetReelActive(true);
    }

    update() {
        if (this._startSpinBool) {
            this._reels.forEach(reel => {
                reel.Rolling();
                if (Data.Library.StateConsole.isTurboEnable) { reel.TurboFunc(); }
            })
        }
    }

    HandleBroadcast(data: any) {
        let temp_strip_index;
        switch (data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY:
                let last_rng = Data.Library.StateConsole.LastRng;
                let module_id = Data.Library.MathConsole.Striptables[0]._id;
                temp_strip_index = Data.Library.StateConsole.LastStripIndex * this._reelCol;
                this.Setstrip(temp_strip_index, module_id, true, last_rng);
                break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                this.HandleStateChange(data.EnventData);
                break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eRESET_STRIP:
                let curmodule_id = Data.Library.MathConsole.CurModuleid;
                temp_strip_index = Data.Library.MathConsole.getWinData().strip_index * this._reelCol;
                this.Setstrip(temp_strip_index, curmodule_id, false, [0, 0, 0, 0, 0, 0]);
                Data.Library.StateConsole.nextState();
                break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelStripsAlready:
                this.SetAllStrip();
                break;

            default: break;
        }
    }

    HandleStateChange(state) {
        switch (state) {
            case Mode.FSM.K_IDLE: break;

            case Mode.FSM.K_SPIN:
            case Mode.FSM.K_FEATURE_SPIN:
                this.StartRolling();
                break;

            case Mode.FSM.K_SPINSTOPING:
            case Mode.FSM.K_FEATURE_SPINSTOPING:
                if (Data.Library.SPIN_LATE == true) {
                    this._reels.forEach((reel) => { reel.BefRolling(); })  //開始旋轉
                    this._startSpinBool = true;
                }
                break;

            case Mode.FSM.K_EXPEND: break;
            case Mode.FSM.K_FEATURE_EXPEND: break;

            case Mode.FSM.K_DROP: break;
            case Mode.FSM.K_FEATURE_DROP: break;

            case Mode.FSM.K_SHOWWIN:
            case Mode.FSM.K_FEATURE_SHOWWIN:
                ShowWinController.Instance.isNextRound = false;
                DropSymbolMap.CurrIndex = 0;
                ShowWinController.Instance.WinLineControl();
                break;

            case Mode.FSM.K_FEATURE_TRIGGER:
            case Mode.FSM.K_FEATURE_RETRIGGER:
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
                this.HandleTranslate();
                break;
            case Mode.FSM.K_FEATURE_CHEKRESULT:
                this.HandleCheckresult();
                break;
            default:
                break;
        }
    }

    StartRolling() {
        this.countStop = 0;

        ShowWinController.Instance.isNextRound = true;
        ShowWinController.Instance.isShowOneRound = false;

        AnimationController.Instance.ShowOneRoundScore(false, -1);  //關閉滾輪中間秀分數的Node

        this.ShowDark(false);
        this.StopAllSymbolAnimation();
        this.ResetAllSymbolDepth();

        if (Data.Library.SPIN_LATE) {
            Data.Library.StateConsole.resultCall();
        } else {
            this._reels.forEach((reel) => { reel.BefRolling(); })  //開始旋轉
            this._startSpinBool = true;
            this.scheduleOnce(() => {  //取得封包
                Data.Library.StateConsole.resultCall();
                this.alreadySetStrp = false;
            }, 0.1)
        }
    }

    SetReelActive(occur: boolean) {  //設置單個滾輪Node Active
        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                this._reels[i].symbolAry[j].active = occur;
            }
        }
    }

    GetSymbol(index: number): Node {  //用index取得滾輪行列數
        if (index < 0 || index > this._realReelRow * this._reelCol - 1) { return; }

        let col = Math.floor(index / this._realReelRow);
        let row = index % this._realReelRow;

        return this._reels[col].symbolAry[row];
    }

    GetRealSymbol(index: number) {
        if (index < 0 || index > this._reelRow * this._reelCol - 1) { return; }
    }

    ResetAllSymbolDepth() {  //將滾輪symbol Node位置初始化
        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                this._reels[i].symbolAry[j].getComponent(Symbol).ResetSymbolDepth();
            }
        }
    }

    CallStopping(): void {  //全部滾輪都已完成旋轉 則呼叫停止 進入下一狀態: K_SHOWWIN || K_FEATURE_SHOWWIN
        if (Data.Library.StateConsole.CurState != Mode.FSM.K_SPINSTOPING && Data.Library.StateConsole.CurState != Mode.FSM.K_FEATURE_SPINSTOPING) { return; }

        let next = this.countStop + 1;
        if (!Data.Library.StateConsole.isTurboEnable) {
            if (Data.Library.MathConsole.getWinData()._slowmotion_flag[next] == 1) {  //判斷slowMotion
                AllNode.Data.Map.get("SlowMotion").getComponent(AudioSource).play();
                AllNode.Data.Map.get("OsSlowMotion").getComponent(AudioSource).play();
                this.isSlowWaiting = true;
                this._reels[next].SlowMotion();
                this.SlowMotionAnm(true, next);
            } else {
                if (AllNode.Data.Map.get("SlowMotion").getComponent(AudioSource).playing) {
                    AllNode.Data.Map.get("SlowMotion").getComponent(AudioSource).stop();
                }
                this.isSlowWaiting = false;
                this.SlowMotionAnm(false, -1);
                find("AudioController/ReelStop/" + (this.countStop + 1)).getComponent(AudioSource).play();
            }
        }

        if (this.countStop++ >= this._reels.length - 1) {
            this._startSpinBool = false;
            Data.Library.StateConsole.nextState();
        }
    }

    SlowMotionAnm(occur: boolean, index: number) {  //不同遊戲需修改: 因為此遊戲的bonus symbol只會出現在前三排滾輪且固定只會有三個，slowMotion動畫固定放在第三排不需重新設置position
        this.ShowDark(occur);
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

        let children = this.symbolDarkNode.children;
        children.forEach(child => {
            if (child.name == 'reel' + index) {
                child.active = false;
            } else {
                child.active = true;
            }
        })
    }

    UpdateSymbolInfo(index: number, num: number) {  //從strips中抽取RNG數據
        if (num == -1) {
            let strip = this._strip[index];
            this._curRngRuning[index] = this._curRngRuning[index] - 1;
            if (this._curRngRuning[index] < 0) { this._curRngRuning[index] = strip.length - 1; }
            if (this._curRngRuning[index] >= strip.length) { this._curRngRuning[index] = this._curRngRuning[index] % strip.length; }
            let symbol = strip[this._curRngRuning[index]];

            this._CurStrip[index].unshift(symbol);
            this._CurStrip[index].pop();
            this._CurPayStrip[index].unshift(this.RandomPay(symbol));
            this._CurPayStrip[index].pop();
        } else {
            let syb = this._script_tostop[index][num];

            this._CurStrip[index].unshift(syb);
            this._CurStrip[index].pop();
            this._CurPayStrip[index].unshift(this.GetSymbolExtraPay(syb, this._script_tostop[index].length <= this._reelRow && this._script_tostop[index].length > 0, this._script_tostop[index].length - 1, index));
            this._CurPayStrip[index].pop();
        }

        this._reels[index].GetStrips(this._CurStrip[index])  //將資料更新進滾輪陣列
    }

    SetAllStrip() {
        let rng = Data.Library.MathConsole.getWinData()._rng;
        if (rng == null || rng.length == 0) { return; }

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
        console.log(this._script_tostop)

        this.alreadySetStrp = true;
        this._reels.forEach(reel => { reel.AlreadyGetStrip(); })
    }

    ArrayAreEqual(ary1: number[], ary2: number[]): boolean {  //判斷兩個陣列的內容是否完全相統(僅限number)
        if (ary1.length != ary2.length) { return false; }
        return ary1.every((value, index) => value === ary2[index]);
    }

    ShowDark(occur: boolean): void {  //滾輪壓暗
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

    StopAllSymbolAnimation() {  //停止所有滾輪動畫
        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                this._reels[i].symbolAry[j].getComponent(Symbol).StopSymbolAnimation();
            }
        }
    }

    HasCommonElement(array1: number[], array2: number[]): boolean {
        const setArray2 = new Set(array2);  // 將其中一個陣列轉換為Set，以便高效檢查存在性

        for (const element of array1) {  // 遍歷第一個陣列並檢查每個元素是否存在於第二個陣列中
            if (setArray2.has(element)) {
                return true; // 發現共同元素，返回true
            }
        }

        return false;  // 完成遍歷且未找到共同元素，返回false
    }

    HandleTranslate() {  //轉場處理
        ShowWinController.Instance.isNextRound = true;
        AnimationController.Instance.ShowOneRoundScore(false, -1);

        this.symbolDarkNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);
        this._reelSlowAnm.active = false;

        for (let i = 0; i < this._reels.length; i++) {
            for (let j = 0; j < this._reels[i].symbolAry.length; j++) {
                let index = i * this._reels[i].symbolAry.length + j;
                let symbol = this._reels[i].symbolAry[j].getComponent(Symbol);
                Data.Library.MathConsole.LastBsResult.Reel[index] = symbol.SymIndex;
                symbol.StopSymbolAnimation();
                symbol.ResetSymbolDepth();
            }
        }
    }

    HandleCheckresult() {  //免費遊戲結束後處理
        ShowWinController.Instance.isNextRound = true;
        AnimationController.Instance.ShowOneRoundScore(false, -1);
        this._reelSlowAnm.active = false;
        this.StopAllSymbolAnimation();
        this.ResetAllSymbolDepth();

        this.scheduleOnce(() => {
            for (let i = 0; i < Data.Library.MathConsole.LastBsResult.Reel.length; i++) {
                let symbolIndex = Data.Library.MathConsole.LastBsResult.Reel[i];
                let reel = this.GetSymbol(i);
                reel.getComponent(Symbol).SetSymbol(symbolIndex);
                reel.getComponent(Symbol).playScatterAnimation('loop', false);
            }
        }, 1);
    }

    Setstrip(startIndex: number, id: string, isChangeNow: boolean, rng: number[]) {  //設置RNG輪條數據
        this._strip = [];
        let stirptable = Data.Library.MathConsole.getStriptable(id);
        for (let i = 0; i < this._reelCol; i++) {
            this._strip.push(stirptable._strips[(i + startIndex)]);
        }
        console.log(this._strip)
        if (isChangeNow) { this.Initfovstrip(isChangeNow, rng); }  //初次進入遊戲或重新整理時 將畫面滾輪更新到上次關遊戲前那盤
    }

    Initfovstrip(isChangeNow: boolean, rng: number[]) {
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
        if (isChangeNow) { this.UpdateReel(isChangeNow); }
    }

    UpdateReel(isChangeNow: boolean): void {
        for (let i = 0; i < this._reelCol; i++) {
            let paytrip = this._CurPayStrip[i];
            for (let j = 0; j < paytrip.length; j++) {
                let symbol = paytrip[j];
                if (symbol === undefined) { symbol = 5; }  //為甚麼要等於5?
                let idx = i * paytrip.length + j;
                let a = Math.floor(idx / Data.Library.REEL_CONFIG.REEL_COL_LENGTH);
                let b = idx % Data.Library.REEL_CONFIG.REEL_COL_LENGTH - 1;
                if (idx % Data.Library.REEL_CONFIG.REEL_COL_LENGTH != 0 && idx % Data.Library.REEL_CONFIG.REEL_COL_LENGTH != (Data.Library.REEL_CONFIG.REEL_COL_LENGTH - 1)) {
                    Data.Library.StateConsole.SymbolMap[(a * this._reelRow + b)] = symbol;
                }
            }
        }

        for (let i = 0; i < this._reels.length; i++) {
            this._reels[i].GetStrips(this._CurStrip[i])
            this._reels[i].SetSymbol(isChangeNow);
        }

        for (let i = 0; i < this._reels.length; i++) {
            let symbolLen = this._reels[i].symbolAry.length
            for (let j = 0; j < symbolLen; j++) {
                let index = i * symbolLen + j;

                Data.Library.MathConsole.LastBsResult.Reel[index] = this._reels[i].symbolAry[j].getComponent(Symbol).SymIndex;
            }
        }
    }

    GetSymbolExtraPay(symbol, isLastResult, finalPos, index) {
        let ret = 0;
        if (isLastResult && Data.Library.MathConsole.getWinData()._payOfPos.length) {
            if (index === this._topReelIndex)
                ret = Data.Library.MathConsole.getWinData()._payOfPos[index * this._reelRow + (3 - finalPos)];
            else
                ret = Data.Library.MathConsole.getWinData()._payOfPos[index * this._reelRow + finalPos];
        }
        else if (isLastResult && Data.Library.StateConsole.LastPay) {
            ret = Data.Library.StateConsole.LastPay[index * this._reelRow + finalPos];
        }
        else {
            ret = this.RandomPay(symbol);
        }
        if (ret === undefined)
            ret = 0;
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


class ReelCol extends Node {
    index: number = null;
    parents = null;
    originX: number = 0;  //Scene上面的X軸
    originY: number = 0;  //Scene上面的Y軸
    reelColX: number = 0;  //此column的X軸
    reelColY: number = 0;  //此column的Y軸
    symbolW: number = Data.Library.REEL_CONFIG.REEL_SYMBOL_W;  //symbol寬度
    symbolH: number = Data.Library.REEL_CONFIG.REEL_SYMBOL_H;  //symbol長度
    symbolGapX: number = Data.Library.REEL_CONFIG.REEL_GAP_X;  //symbol之間X間距
    symbolGapY: number = Data.Library.REEL_CONFIG.REEL_GAP_Y;  //symbol之間Y間距
    realReelRow: number = null;  //滾輪行數

    symbolAry = [];
    posX_Ary = [];  //裝每個symbol的X軸
    posY_Ary = [];  //裝每個symbol的Y軸

    rolling: boolean = false;
    negativeDir: boolean = false;
    blur: boolean = false;

    wait: number = 0;
    nowSpeed: number = 1;
    maxSpeed: number = 102;
    nowMove: number = 0;
    maxMove: number = 10;
    space: number = -4;

    strips: number[] = [];
    isSetSymbol: boolean = false;  //是否重設滾輪圖片
    isLastRound: boolean = false;
    isSlomotion: boolean = false;  //是否在slowmotion
    lastRngCount: number = -1;

    init(parent: Component, x: number, y: number, index: number, totalRow: number) {
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
            //如果是頂部多一排的遊戲 再用判斷式修改posX, posY就好
            this.posX_Ary.push(posX);
            this.posY_Ary.push(posY);

            instance.setPosition(0, posY);
            instance.getComponent(Symbol).reelIndex = reelIndex;
            instance.getComponent(Symbol).reelCol = this.index;
            instance.getComponent(Symbol).ordIdx = 100 - reelIndex;
            instance.setSiblingIndex(100 - reelIndex);

            this.addChild(instance);
            this.symbolAry.push(instance);
        }

        this.originX = this.parents._reelposleft;
        this.originY = this.parents._reelposup;
    }

    BefRolling() {  //將一些滾輪資料初始化
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

    Rolling() {
        if (!this.rolling) { return; }
        if (this.wait++ < 0) { return; }  //用來間隔每條滾輪時間

        let vec = this.getPosition();

        if (this.negativeDir) {  //像反方向移動
            if (Math.abs(this.reelColY - vec.y) < Math.floor(this.symbolH / 3)) {
                this.setPosition(this.reelColX, vec.y + this.nowSpeed);
                if (this.nowSpeed < this.maxSpeed) { this.nowSpeed++; }  //慢慢加速
                return;
            } else { this.negativeDir = false; }
        }

        if (this.nowMove <= this.maxMove) {  //正常移動
            if (vec.y - this.nowSpeed > this.reelColY - this.symbolH) {
                this.setPosition(this.reelColX, vec.y - this.nowSpeed)
                this.isSetSymbol = false;
            } else {
                this.setPosition(this.reelColX, this.reelColY);
                this.isSetSymbol = true;
            }
            if (!this.isSlomotion && this.nowSpeed < this.maxSpeed) { this.nowSpeed += 4; }
            if (!this.isLastRound) { this.nowMove--; }
            if (this.isLastRound && this.nowMove < 0) { this.nowMove = 0; }//假設延遲,有軸受到影響要變回從0開始才能控制順序
            if (this.isSetSymbol) {
                if (this.maxMove - this.nowMove >= 0 && this.maxMove - this.nowMove < this.realReelRow) {
                    this.lastRngCount = this.maxMove - this.nowMove;
                    this.blur = false;
                } else { this.lastRngCount = -1; }

                //還沒slowmotion完要讓他this.lastRngCount為-1
                if (this.parents.isSlowWaiting && this.maxMove - this.nowMove < this.realReelRow && !this.isSlomotion) {
                    this.lastRngCount = -1;
                }

                if (!this.parents.isSlowWaiting || (this.parents.isSlowWaiting && this.isSlomotion)) {
                    this.nowMove++;
                }

                this.parents.UpdateSymbolInfo(this.index, this.lastRngCount);  //更新symbol符號陣列
                this.SetSymbol(false);  //更新symbol
            }
        } else {  //最後處理swing back           
            if (Math.abs(this.reelColY - vec.y) < Math.floor(this.symbolH / 6)) {  //將滾輪往下推6分之一
                this.setPosition(this.reelColX, vec.y - Math.floor(this.maxSpeed / 8));
                return;
            } else {  //將滾輪設回原位
                this.setPosition(this.reelColX, this.reelColY);
                this.AllFinish();
            }
        }
    }

    GetStrips(strip: number[]) {
        this.strips = strip;
    }

    SetSymbol(isChangeNow: boolean) {
        for (let i = 0; i < this.symbolAry.length; i++) {
            this.symbolAry[i].getComponent(Symbol).SetSymbol(this.strips[i]);
        }
        if (isChangeNow) { this.AllInit(); }
    }

    SlowMotion() {
        this.nowSpeed = Math.floor(this.maxSpeed / 3);
        this.nowMove = Math.floor(this.maxMove / 2);
        this.isSlomotion = true;
    }

    TurboFunc() {
        if (this.nowSpeed < this.maxSpeed) { this.nowSpeed++; }
        if (this.isLastRound && this.maxMove - this.nowMove > 6) { this.nowMove++; }
    }

    AllInit() {
        for (let i = 0; i < this.symbolAry.length; i++) {
            if (i == 0 || i == this.realReelRow - 1) { continue; }
            this.symbolAry[i].getComponent(Symbol).playScatterAnimation('idle', false);
            this.symbolAry[i].getComponent(Symbol).PlayWildAnimation();
        }
    }

    AllFinish() {
        this.parents.CallStopping(this.index);
        this.rolling = false;

        for (let i = 0; i < this.symbolAry.length; i++) {
            if (i == 0 || i == this.realReelRow - 1) { continue; }
            this.symbolAry[i].getComponent(Symbol).playScatterAnimation('hit', false);
            this.symbolAry[i].getComponent(Symbol).PlayWildAnimation();
        }
    }

    AlreadyGetStrip() {  //已收到封包結果
        this.isLastRound = true;
    }
}