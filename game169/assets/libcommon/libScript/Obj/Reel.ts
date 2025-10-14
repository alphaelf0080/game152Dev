import { _decorator, CCFloat, Component, Enum, instantiate, Node, Prefab, Size, tween, Tween, TweenEasing, UIOpacity, UITransform, v3, Vec3 } from 'cc';
import { SymbolState } from '../Interface/ISymbol';
import { Data, Mode, Model } from '../Controller/DataController';
import { ErrorCs } from '../Common/ErrorConsole';
import { DispatchEventType, EvtCtrl } from '../Controller/EventController';
import { Container } from './Container';
import * as IReel from '../Interface/IReel';
import { BaseSymbol } from './BaseSymbol';

export enum DropType {
    DropIn,
    DropOut,
    DropOutIn,
}

export enum DropBounceType {
    Symbol,
    Reel,
}

export interface ReelDropConfig {
    // 掉落型態
    dropType: DropType,
    // 實際顯示的symIndex
    curStrip?: number[],
    // symbol Pay
    curPayStrip?: number[],
    // DropIn是否使用Delay，不使用的話是異步方式，一個symbol掉完才換下一個，預設false
    isDropInUseSymbolDelay?: boolean,
    // DropOut是否使用Delay，不使用的話是異步方式，一個symbol掉完才換下一個，預設false
    isDropOutUseSymbolDelay?: boolean,
    // 是否要放慢掉落
    isNeedSlow?: boolean,
    /**
     * 掉落不直接用ReelDropBounceConfig當型態是因為方便用預設值
     */
    // 是否需要回彈
    isNeedBounce?: boolean,
    // 需要回彈的symbol
    dropBounceSymIndex?: BaseSymbol[],
    // 掉落回彈時類型
    dropBounceType?: DropBounceType,
    // 掉落回彈Easing，預設smooth
    dropBounceEasing?: TweenEasing,
    // callback
    cb?: Function,
    // 掉落Easing，預設smooth
    dropEasing?: TweenEasing,
}

export interface ReelDropBounceConfig {
    // 是否需要回彈
    isNeedBounce: boolean,
    // 需要回彈的symbol
    dropBounceSymIndex?: BaseSymbol[],
    // 掉落回彈時類型
    dropBounceType: DropBounceType,
    // 掉落回彈Easing，預設smooth
    dropBounceEasing?: TweenEasing,
}

const { ccclass, property } = _decorator;
@ccclass('Reel')
export class Reel extends Component implements IReel.IReel {

    @property(Node) reelMask: Node = null;
    @property(Node) reelBlack: Node = null;

    @property({ group: "Switch", displayName: "HasFreeGame", visible: true }) protected _hasFreeGame: boolean = true;
    @property({ group: "Switch", displayName: "IsUseStartSwing", visible: true }) protected _isUseStartSwing: boolean = true;
    @property({ group: "Switch", displayName: "IsUseEndSwing", visible: true }) protected _isUseRebounce: boolean = true;
    @property({ group: "Switch", displayName: "IsUseNormalRolling", visible: true }) protected _isUseNormalRolling: boolean = true;
    @property({ group: "Switch", displayName: "IsUseDropRolling", visible: true }) protected _isUseDropRolling: boolean = false;
    @property({ group: "Switch", displayName: "IsUseDropBounce", visible() { return this._isUseDropRolling } }) protected _isUseDropBounce: boolean = false;

    @property({ group: "Reel", type: Enum(IReel.ReelDirection), displayName: "ReelDirection", visible: true }) private _reelDir: IReel.ReelDirection = IReel.ReelDirection.TopToBottom;
    @property({ group: "Reel", displayName: "ReelPos", visible: true }) reelPos: Vec3 = v3(0, 0);
    @property({ group: "Reel", displayName: "ReelSymGap", visible: true }) private _reelSymGap: Size = new Size(0, 0);
    @property({ group: "Reel", displayName: "SymbolCount", visible: true, min: 0, max: Infinity }) private _symCount: number = 0;
    @property({ group: "Reel", displayName: "ExtraBaseSymbolCount", visible: true, min: 0, max: Infinity }) private _extraBaseSymCount: number = 1;
    @property({ group: "Reel", type: Enum(IReel.SymbolLeanTowards), displayName: "SymbolLeanTowards", visible: true }) private _symLTW: IReel.SymbolLeanTowards = IReel.SymbolLeanTowards.Negative;

    @property({ group: "Symbol", type: Prefab, displayName: "PfSymbol", visible: true }) private _pfSymbol: Prefab = null;
    @property({ group: "Symbol", displayName: "BaseSymbolSize", visible: true }) private _baseSymSize: Size = new Size(0, 0);

    @property({ group: "StartSwing", displayName: "StartSwingDis", visible() { return this._isUseStartSwing }, min: 0, max: Infinity }) protected _startSwingDis: number = 40;
    @property({ group: "StartSwing", displayName: "StartSwingTime", visible() { return this._isUseStartSwing }, min: 0, max: Infinity }) protected _startSwingTime: number = 0.15;

    @property({ group: "EndSwing", displayName: "EndSwingDis", visible() { return this._isUseRebounce }, min: 0, max: Infinity }) protected _endSwingDis: number = 40;
    @property({ group: "EndSwing", displayName: "EndBounceTime", visible() { return this._isUseRebounce }, min: 0, max: Infinity }) protected _endBounceTime: number = 0.15;
    @property({ group: "EndSwing", displayName: "EndPassBounceTime", visible() { return this._isUseRebounce }, min: 0, max: Infinity }) protected _endPassBounceTime: number = 0.05;

    @property({ group: "CommonReelSpeed", displayName: "PassMotionRate", visible: true, min: 0, max: Infinity }) protected _nmPassMotionRate: number = 10;

    @property({ group: "NormalReelSpeed", displayName: "MsToTopSpeed", visible() { return this._isUseNormalRolling }, min: 0, max: Infinity }) protected _nmMsToTopSpeed: number = 100;
    @property({ group: "NormalReelSpeed", displayName: "MsToTopAcc", visible() { return this._isUseNormalRolling }, min: 0, max: Infinity }) protected _nmMsToTopAcc: number = 0.2;
    @property({ group: "NormalReelSpeed", displayName: "CuriseSpeed", visible() { return this._isUseNormalRolling }, min: 0, max: Infinity }) protected _nmCuriseSpeed: number = 3.5;
    @property({ group: "NormalReelSpeed", displayName: "SlowCuriseSpeed", visible() { return this._isUseNormalRolling }, min: 0, max: Infinity }) protected _nmSlowCuriseSpeed: number = 3;
    @property({ group: "NormalReelSpeed", displayName: "LastSybSpeed", visible() { return this._isUseNormalRolling }, min: 0, max: Infinity }) protected _nmLastSybSpeed: number = 2.5;
    @property({ group: "NormalReelSpeed", displayName: "SlowMotionRate", visible() { return this._isUseNormalRolling }, min: 0, max: Infinity }) protected _nmSlowMotionRate: number = 0.2;
    /** 0: Normal  1: Turbo*/
    @property({ group: "NormalReelSpeed", type: CCFloat, displayName: "DisMultiple", visible() { return this._isUseNormalRolling }, min: 0, max: Infinity }) protected _dms: Array<number> = [25, 35];

    @property({ group: "DropReelSpeed", displayName: "DropInTime", visible() { return this._isUseDropRolling }, min: 0, max: Infinity }) protected _dpDropInTime: number = 0.2;
    @property({ group: "DropReelSpeed", displayName: "DropOutTime", visible() { return this._isUseDropRolling }, min: 0, max: Infinity }) protected _dpDropOutTime: number = 0.2;
    @property({ group: "DropReelSpeed", displayName: "DropInSymbolDelay", visible() { return this._isUseDropRolling }, min: 0, max: Infinity }) protected _dpDropInSymbolDelay: number = 0;
    @property({ group: "DropReelSpeed", displayName: "DropOutSymbolDelay", visible() { return this._isUseDropRolling }, min: 0, max: Infinity }) protected _dpDropOutSymbolDelay: number = 0;
    @property({ group: "DropReelSpeed", displayName: "DropbounceDis", visible() { return this._isUseDropRolling && this._isUseDropBounce }, min: 0, max: Infinity }) protected _dpBounceDis: number = 20;
    @property({ group: "DropReelSpeed", displayName: "DropbounceTime", visible() { return this._isUseDropRolling && this._isUseDropBounce }, min: 0, max: Infinity }) protected _dpBounceTime: number = 0.1;

    reelConfig: IReel.IReelConfig = {
        reelIndex: null,
        reelDir: null,
        reelPos: null,
        reelSymGap: null,
        col: null,
        row: null,
        showSymCount: null,
        extraBaseSymCount: null,
        symLTw: null,
    };

    symbolConfig: IReel.IReelSymbolConfig = {
        pfSymbol: null,
        baseSymSize: null,
    };

    protected _reelIndex: number = -1;
    protected _reelPosTop = 0;
    protected _reelPosBottom = 0;
    protected _reelPosLeft = 0;
    protected _reelPosRight = 0;
    protected _topBoundY = 0;
    protected _bottomBoundY = 0;
    protected _rightBoundX = 0;
    protected _leftBoundX = 0;

    protected _speedupRate = 1;
    private _dt = 0.016;

    public symbols: BaseSymbol[] = [];
    public emptySymbols: number[] = [];
    public showSymbols: number[] = [];
    protected _strip: number[] = [];
    protected _curStripIndex: number = 0;
    protected _curStrip: number[] = [];
    protected _curPayStrip: number[] = [];
    protected _curSymIndexStrip: number[] = [];
    protected _curRng: number = 0;
    protected _curRngRuning: number = 0;
    protected _curTurboEnable: boolean = false;

    // tween用
    protected _rollingDis = { v: 0 };

    protected _blurEnable: boolean = false;
    protected _curSpeed: number = 0;
    protected _isSpeedToTop: boolean = false;
    protected _isStopping: boolean = false;
    protected _isChangeRealSym: boolean = false;
    protected _changeSymCount: number = 0;
    // 用來改變scatter變慢速度用
    protected _totalChangeSymCount: number = 0;
    protected _baseChangeSymCount: number = 0;
    protected _stopMult: number = 1;
    protected _isNeedSlow: boolean = false;
    // 這裡預設資料由上到下，由左到右
    protected _reelLastIndexs: number = -1;
    protected _twReel: Tween<object> = null;
    protected _twEasing: TweenEasing = "smooth";
    protected _spinStopResolve: any = null;

    protected _reelPhysic: {
        normal: IReel.INormalSpeed,
        drop: IReel.IDropSpeed,
        common: IReel.ICommonSpeed,
    } =
        {
            normal: {
                // speed
                msToTopSpeed: 0,
                msToTopAcc: 0,
                curiseSpeed: 0,
                slowCuriseSpeed: 0,
                lastSybSpeed: 0,
                // time
                startSwingTime: 0,
                endBounceTime: 0,
                endPassBounceTime: 0,
                // rate
                slowMotionRate: 0,
            },
            drop: {
                dropInTime: 0,
                dropOutTime: 0,
                dropInSymbolDelay: 0,
                dropOutSymbolDelay: 0,
                dropBounceTime: 0,
            },
            common: {
                passMotionRate: 0,
            }
        }

    private get _GVar(): any {
        return Container.getInstance().get("GVar");
    }

    protected get _contentSize(): Size {
        return this.node.getComponent(UITransform).contentSize;
    }

    protected set _contentSize(size: Size) {
        this.node.getComponent(UITransform).contentSize = size;
    }

    public get isHorizen(): boolean {
        return (this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight || this.reelConfig.reelDir === IReel.ReelDirection.RightToLeft);
    }

    public get isVertical(): boolean {
        return (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom || this.reelConfig.reelDir === IReel.ReelDirection.BottomToTop);
    }

    public get isRollingPostiveDir(): boolean {
        return (this.reelConfig.reelDir === IReel.ReelDirection.BottomToTop || this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight);
    }

    public get isInOrderDataDir(): boolean {
        return (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom || this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight);
    }

    public get refBound(): number {
        return (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom) ? this._bottomBoundY :
            (this.reelConfig.reelDir === IReel.ReelDirection.BottomToTop) ? this._topBoundY :
                (this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight) ? this._rightBoundX : this._leftBoundX;
    }

    protected get _totalExtraSymbolCount(): number {
        return this._extraBaseSymCount * 2;
    }

    public get totalSymbolCount(): number {
        return this._GVar.reelRow + this._totalExtraSymbolCount;
    }

    public get extraNodeCount(): number {
        return this._GVar.reelRow - this._symCount;
    }

    protected get _finalDms(): number {
        return this._curTurboEnable ? this._dms[1] : this._dms[0];
    }

    public get scCount(): number {
        return this._curSymIndexStrip.filter((e, i) => e === 1 && this.emptySymbols.indexOf(i) === -1).length;
    }

    public get extraBaseSymCount(): number {
        return this._extraBaseSymCount;
    }

    constructor(reelConfig: IReel.IReelConfig, reelSymbolConfig: IReel.IReelSymbolConfig) {
        super();
        if (reelConfig && reelSymbolConfig) {
            this.initParameters(reelConfig, reelSymbolConfig);
            this.initReel(reelConfig.reelIndex);
        }
    }

    protected start(): void {
        // 先初始化參數值
        this._waitInitSymbolsArr();
    }
    
    private _waitInitSymbolsArr(){
        if(this._GVar) {
            this._initShowAndEmptySymbols();
        }
        else{
            this.scheduleOnce(()=>{
                this._waitInitSymbolsArr();
            },0)
        }
    }

    //#region initial
    /**
     * 如不是在場景設置，可用此接口設置
     * @param reelConfig reel的參數資料
     * @param reelSymbolConfig reel裡symbol的參數資料
     */
    initParameters(reelConfig: IReel.IReelConfig, reelSymbolConfig: IReel.IReelSymbolConfig) {
        this._reelIndex = reelConfig.reelIndex;
        this._reelDir = reelConfig.reelDir;
        this.reelPos = reelConfig.reelPos;
        this._reelSymGap = reelConfig.reelSymGap;
        this._symCount = reelConfig.showSymCount;
        this._extraBaseSymCount = reelConfig.extraBaseSymCount;
        this._symLTW = reelConfig.symLTw;

        this._pfSymbol = reelSymbolConfig.pfSymbol;
        this._baseSymSize = reelSymbolConfig.baseSymSize;
    }

    /**
     * 初始化滾輪與底下的symbol
     * @param reelIndex 第幾個滾輪
     * @param isLayerReverse symbol層級是否顛倒
     */
    initReel(reelIndex: number, isLayerReverse: boolean = false) {
        this._reelIndex = reelIndex;
        // 設定reelConfig
        this.reelConfig.reelIndex = this._reelIndex;
        this.reelConfig.reelDir = this._reelDir;
        this.reelConfig.reelPos = this.reelPos;
        this.node.setPosition(this.reelPos);
        this.reelConfig.reelSymGap = this._reelSymGap;
        this.reelConfig.showSymCount = (this._symCount > this._GVar.reelRow) ? this._GVar.reelRow : this._symCount;
        this.reelConfig.extraBaseSymCount = this._extraBaseSymCount;
        this.reelConfig.symLTw = this._symLTW;
        // 設定symbolConfig
        this.symbolConfig.pfSymbol = this._pfSymbol;
        this.symbolConfig.baseSymSize = this._baseSymSize;

        let xMult: number = this.isHorizen ? this.reelConfig.showSymCount : 1;
        let xGap: number = (xMult - 1) * this.reelConfig.reelSymGap.width;
        let yMult: number = this.isVertical ? this.reelConfig.showSymCount : 1;
        let yGap: number = (yMult - 1) * this.reelConfig.reelSymGap.height;
        let newSize: Size = new Size(xMult * this.symbolConfig.baseSymSize.width + xGap, yMult * this.symbolConfig.baseSymSize.height + yGap);
        this._contentSize = newSize;
        this.reelMask.getComponent(UITransform).contentSize = newSize;
        this.reelBlack.getComponent(UITransform).contentSize = newSize;

        let halfCount = Math.floor(this._symCount / 2);
        let baseCount: number = this._extraBaseSymCount + halfCount;
        let baseExtraCount: number = (this._symLTW === IReel.SymbolLeanTowards.Postive ? -1 : 1) * (this._symCount % 2 === 0 ? 0.5 : 0);
        let extraCount: number = this.extraNodeCount - (baseExtraCount === 0 ? 0 : 1);
        let totalCount: number = baseCount + baseExtraCount + extraCount;
        // 以Top開始為準
        if (this.isVertical) {
            this._reelPosTop = totalCount * this.symbolConfig.baseSymSize.height + ((Math.ceil(totalCount) - 1) * this.reelConfig.reelSymGap.height);
            this._reelPosBottom = this._reelPosTop - (this.totalSymbolCount - 1) * this.symbolConfig.baseSymSize.height;
        }
        // 以Left開始為準
        else if (this.isHorizen) {
            this._reelPosLeft = -totalCount * this.symbolConfig.baseSymSize.width - ((Math.ceil(totalCount) - 1) * this.reelConfig.reelSymGap.width);
            this._reelPosRight = this._reelPosLeft + (this.totalSymbolCount - 1) * this.symbolConfig.baseSymSize.width;;
        }

        if (this.isVertical) {
            this._topBoundY = this._reelPosTop + this.symbolConfig.baseSymSize.height;
            this._bottomBoundY = this._reelPosBottom - this.symbolConfig.baseSymSize.height;

        }
        else if (this.isHorizen) {
            this._leftBoundX = this._reelPosLeft - this.symbolConfig.baseSymSize.width;
            this._rightBoundX = this._reelPosRight + this.symbolConfig.baseSymSize.width;
        }

        for (let i = 0; i < this.totalSymbolCount; i++) {
            let symbol: Node = instantiate(this.symbolConfig.pfSymbol);
            let symbolComp: BaseSymbol = symbol.getComponent(BaseSymbol);
            let x: number = this.isHorizen ? this._reelPosLeft + (i * this.symbolConfig.baseSymSize.width) + (i * this.reelConfig.reelSymGap.width) : 0
            let y: number = this.isHorizen ? 0 : this._reelPosTop - (i * this.symbolConfig.baseSymSize.height) - (i * this.reelConfig.reelSymGap.height);
            symbol.setParent(this.reelMask);
            symbol.setPosition(v3(x, y));
            symbolComp.symPos = v3(x, y);
            symbolComp.curPos = v3(x, y);
            symbolComp.reelIndex = this.reelConfig.reelIndex;
            if (this.showSymbols.indexOf(i) > -1) symbolComp.winPos = this._reelIndex * 10 + (i - this.extraBaseSymCount + 1);
            symbol.name = this._reelIndex.toString() + i.toString();
            // reelIndex * 10 + rowIndex，排序用會多*10是用在節點是移到外部而不在滾輪裡時用
            symbolComp.ordIdx = this._reelIndex * 10 + (isLayerReverse ? (this.totalSymbolCount - 1 - i) : i);
            this.symbols.push(symbolComp);
        }

        this.changeReelPhysicSpeedByRate(1);
        this._setEmptySymbolsVisible(false);

        this._reelLastIndexs = (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom || this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight) ? this.totalSymbolCount - 1 : 0;
    }

    // 設定空symbol陣列
    private _initShowAndEmptySymbols(){
        this.showSymbols = Mode.genSuccessiveArr(0, this.totalSymbolCount - 1);
        let behind: number[] = this.showSymbols.slice(this.totalSymbolCount - this._extraBaseSymCount, this.totalSymbolCount);
        this.emptySymbols = this.emptySymbols.concat(behind);
        this.showSymbols.splice(this.totalSymbolCount - this._extraBaseSymCount, this._extraBaseSymCount);
        let front: number[] = this.showSymbols.slice(0, this._extraBaseSymCount);
        this.emptySymbols = this.emptySymbols.concat(front);
        this.showSymbols.splice(0, this._extraBaseSymCount);
        if (this.extraNodeCount > 0) {
            let remainEmpty: number[] = [];
            if (this._reelDir === IReel.ReelDirection.TopToBottom || this._reelDir === IReel.ReelDirection.BottomToTop) {
                let start: number = (this._symLTW === IReel.SymbolLeanTowards.Postive) ? this.showSymbols.length - this.extraNodeCount : 0;
                let end: number = (this._symLTW === IReel.SymbolLeanTowards.Postive) ? this.showSymbols.length : this.extraNodeCount;
                remainEmpty = this.showSymbols.slice(start, end);
                this.showSymbols.splice(start, this._extraBaseSymCount);
            }
            else if (this._reelDir === IReel.ReelDirection.LeftToRight || this._reelDir === IReel.ReelDirection.RightToLeft) {
                let start: number = (this._symLTW === IReel.SymbolLeanTowards.Postive) ? 0 : this.showSymbols.length - this.extraNodeCount;
                let end: number = (this._symLTW === IReel.SymbolLeanTowards.Postive) ? this.extraNodeCount : this.showSymbols.length;
                remainEmpty = this.showSymbols.slice(start, end);
            }
            this.emptySymbols = this.emptySymbols.concat(remainEmpty).sort((a, b) => a - b);
        }
    }
    //#endregion

    reset() {
        // 依最後結果改_curRngRuning值
        this._curRngRuning = (this._curRng - 2 < 0) ? this._curRng - 2 + this._strip.length : this._curRng - 2;
        this.setReelBlackVisible(false);

        this._stopMult = 1;
        this._isNeedSlow = false;
        this._curSpeed = 0;
        this._rollingDis.v = 0;
        this._twReel = null;
        this._twEasing = "smooth";
        this._isStopping = false;
        this._isChangeRealSym = false;
        this._reelLastIndexs = (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom || this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight) ? this.totalSymbolCount - 1 : 0;
        this._changeSymCount = 0;
        this._baseChangeSymCount = 0;
        this.symbols.forEach((e) => e.resetSymbol());
    }

    /**
     * 設定當前滾輪資料
     * @param data 滾輪資料 
     * @description rng 當前滾輪rng
     * @description strip 當前滾條
     * @description curStrip 當前對應滾條用的symbol值
     * @description curPayStrip 當前對應滾條用的symbol pay值
     * @description curSymIndexStrip 當前實際symbol值
     */
    setReelData(data: { rng?: number, strip?: number[], curStrip?: number[], curPayStrip?: number[], curSymIndexStrip: number[] }) {
        if (data.strip) this._strip = data.strip;
        if (data.curStrip) this._curStrip = data.curStrip;
        if (data.curPayStrip) this._curPayStrip = data.curPayStrip;
        this._curSymIndexStrip = data.curSymIndexStrip;
        if (data.rng) this._curRng = data.rng;
    }

    setStopSymMult(mult: number) {
        // 倍數必須是整數且大於1
        this._stopMult = (mult <= 1) ? 1 : Math.floor(mult);
    }

    setReelBlackVisible(visible: boolean) {
        Tween.stopAllByTarget(this.reelBlack.getComponent(UIOpacity));
        if (visible) {
            if (!this.reelBlack.active) {
                this.reelBlack.active = true;
                tween(this.reelBlack.getComponent(UIOpacity)).to(0.5, { opacity: 255 }).start();
            }
            else this.reelBlack.getComponent(UIOpacity).opacity = 255;
        }
        else {
            if (this.reelBlack.active)
                tween(this.reelBlack.getComponent(UIOpacity)).to(0.5, { opacity: 0 }).call(() => { this.reelBlack.active = false; }).start();
            else {
                this.reelBlack.getComponent(UIOpacity).opacity = 0;
                this.reelBlack.active = false;
            }
        }
    }

    private _setEmptySymbolsVisible(visible: boolean) {
        this.emptySymbols.forEach(e => this.symbols[e].node.active = visible);
    }

    changeReelPhysicSpeedByRate(rate: number) {
        /*------------ Normal ------------*/
        // speed
        this._reelPhysic.normal.msToTopSpeed = this._nmMsToTopSpeed * rate;
        this._reelPhysic.normal.msToTopAcc = this._nmMsToTopAcc * rate;
        this._reelPhysic.normal.curiseSpeed = this._nmCuriseSpeed * rate;
        this._reelPhysic.normal.slowCuriseSpeed = this._nmSlowCuriseSpeed * rate;
        this._reelPhysic.normal.lastSybSpeed = this._nmLastSybSpeed * rate;
        // time
        this._reelPhysic.normal.startSwingTime = this._startSwingTime / rate;
        this._reelPhysic.normal.endBounceTime = this._endBounceTime / rate;
        this._reelPhysic.normal.endPassBounceTime = this._endPassBounceTime / rate;
        // rate
        this._reelPhysic.normal.slowMotionRate = this._nmSlowMotionRate;
        /*------------ Drop ------------*/
        this._reelPhysic.drop.dropInTime = this._dpDropInTime / rate;
        this._reelPhysic.drop.dropOutTime = this._dpDropOutTime / rate;
        this._reelPhysic.drop.dropInSymbolDelay = this._dpDropInSymbolDelay / rate;
        this._reelPhysic.drop.dropOutSymbolDelay = this._dpDropOutSymbolDelay / rate;
        this._reelPhysic.drop.dropBounceTime = this._dpBounceTime / rate;
        /*------------ Common ------------*/
        this._reelPhysic.common.passMotionRate = this._nmPassMotionRate;
    }

    protected _rollingMult(): number {
        let adjustChangeCount: number = this._totalChangeSymCount - this._GVar.reelRow;
        let hasChangeCount: number = this._totalChangeSymCount - this._changeSymCount;
        let rate: number = (this._changeSymCount <= this._GVar.reelRow) ? this._reelPhysic.normal.slowMotionRate :
            (hasChangeCount <= Math.floor(adjustChangeCount * 0.6)) ? this._reelPhysic.normal.slowMotionRate + (1 - this._reelPhysic.normal.slowMotionRate) * 0.2 :
                (hasChangeCount > Math.floor(adjustChangeCount * 0.6) && hasChangeCount <= Math.floor(adjustChangeCount * 0.8)) ? this._reelPhysic.normal.slowMotionRate + (1 - this._reelPhysic.normal.slowMotionRate) * 0.13 :
                    this._reelPhysic.normal.slowMotionRate + (1 - this._reelPhysic.normal.slowMotionRate) * 0.1;

        return (this._GVar.curGameResult && this._isNeedSlow && !this._curTurboEnable) ? rate : 1;
    }

    protected _getSymNextIndex(symIndex: number): number {
        return symIndex + 1 > this.totalSymbolCount - 1 ? 0 : symIndex + 1;
    }

    protected _getSymPreIndex(symIndex: number): number {
        return symIndex - 1 < 0 ? this.totalSymbolCount - 1 : symIndex - 1;
    }

    protected _isReachBound(dis: number) {
        return (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom) ? dis <= this._bottomBoundY :
            (this.reelConfig.reelDir === IReel.ReelDirection.BottomToTop) ? dis >= this._topBoundY :
                (this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight) ? dis >= this._rightBoundX : dis <= this._leftBoundX;
    }

    //#region normal reel rolling
    protected _calNormalDis() {
        let dis: number = 0;
        if (!this._isSpeedToTop && !this._isStopping) {
            dis = (this._curSpeed * this._dt + 0.5 * this._reelPhysic.normal.msToTopAcc * Math.pow(this._dt, 2)) * this._finalDms;
            this._curSpeed = (this._curSpeed + this._reelPhysic.normal.msToTopAcc * this._dt) * this._finalDms;
            if (this._curSpeed >= this._reelPhysic.normal.msToTopSpeed) this._isSpeedToTop = true;
        }
        else if (this._isSpeedToTop && !this._isStopping) {
            dis = this._reelPhysic.normal.curiseSpeed * this._finalDms;
        }
        else {
            dis = this._GVar.isPassSpin ? this._reelPhysic.common.passMotionRate * this._finalDms
                : (this._changeSymCount >= 3 ? this._reelPhysic.normal.slowCuriseSpeed : this._reelPhysic.normal.lastSybSpeed) * this._finalDms * this._rollingMult();
        }
        return dis;
    }

    public setSymbols(state: SymbolState, symIndexs?: number[], pays?: number[]) {
        for (let i = 0; i < this.symbols.length; i++) {
            let symbol: BaseSymbol = this.symbols[i];
            let symIndex: number = (symIndexs && symIndexs.length > 0) ? symIndexs[i] : symbol.symIndex;
            let symPay: number = (pays && pays.length > 0) ? pays[i] : symbol.symPay;
            symbol.setSymbol(state, this._blurEnable, symIndex, symPay);
        }
    }

    startRolling(easing: TweenEasing = "smooth") {
        let self = this;
        this._curTurboEnable = this._GVar.isTurboEnable;
        this._blurEnable = true;
        this._twEasing = easing;
        this._setEmptySymbolsVisible(true);
        if (this._isUseStartSwing) {
            this._twReel = tween(this._rollingDis).set({ v: 0 })
                .to(this._reelPhysic.normal.startSwingTime, { v: this._startSwingDis }, {
                    easing: self._twEasing,
                    onUpdate(target: { v: number, uuid: string }, ratio: number) {
                        let value: number = target.v * ratio * (self.isRollingPostiveDir ? -1 : 1);
                        for (let i = 0; i < self.symbols.length; i++) {
                            let symbol: BaseSymbol = self.symbols[i];
                            let curPos: Vec3 = symbol.curPos;
                            let x: number = self.isHorizen ? curPos.x + value : curPos.x;
                            let y: number = self.isVertical ? curPos.y + value : curPos.y;
                            symbol.node.setPosition(x, y, 0);
                            if (ratio === 1) symbol.curPos = symbol.node.getPosition();
                        }
                    },
                })
                .call(() => { this._rolling(); })
                .start();
        }
        else this._rolling();
    }

    private _rolling() {
        let self = this;
        let dis: number = this._calNormalDis();
        this._twReel = tween(this._rollingDis).set({ v: 0 })
            .to(this._dt, { v: dis }, {
                easing: self._twEasing,
                onUpdate(target: { v: number, uuid: string }, ratio: number) {
                    let lastIndex: number = self._reelLastIndexs;
                    let diff: number = target.v * ratio * (self.isRollingPostiveDir ? 1 : -1);
                    for (let i = 0; i < self.symbols.length; i++) {
                        if (i !== lastIndex) {
                            let symbol: BaseSymbol = self.symbols[i];
                            self._changeSymbolPos(i, symbol, diff);
                        }
                    }
                    let lastSymbol: BaseSymbol = self.symbols[lastIndex];
                    self._changeSymbolPos(lastIndex, lastSymbol, diff);
                },
            })
            .call(() => { this._rolling(); })
            .start();
    }

    public spinStop(isNeedSlow: boolean) {
        return new Promise<void>((resolve, reject) => {
            this._spinStopResolve = resolve;
            let rng = this._curRng || 0;
            if (rng >= this._strip.length) {
                Mode.sendError(ErrorCs.Code.RngError);
                this._spinStopResolve();
                return;
            }
            this._isNeedSlow = isNeedSlow;

            const { keyIndex, curIndex } = this._getStopIndexs();
            let extraCount: number = this.totalSymbolCount - (curIndex + 1);
            this._baseChangeSymCount = extraCount + (keyIndex + 1);
            this._changeSymCount = this._baseChangeSymCount + (this._stopMult - 1) * this.totalSymbolCount;
            this._totalChangeSymCount = this._changeSymCount;

            if(this._twReel) this._twReel.stop();
            this._isStopping = true;
            this._blurEnable = false;

            let dis: number = this._calNormalDis() * (this.isRollingPostiveDir ? 1 : -1);
            this._rollingSlowDown(dis);
        });
    }


    /**
     * 取得停輪的關鍵symbol index資訊
     * @returns keyIndex 基準symbol本來的index
     * @returns curIndex 基準symbol目前的index
     */
    protected _getStopIndexs(): { keyIndex: number, curIndex: number } {
        let keyIndex: number;
        let allY: number[] = this.symbols.map((e) => e.node.getPosition().y).sort((a, b) => b - a);

        if (this._reelDir === IReel.ReelDirection.TopToBottom) {
            keyIndex = this.showSymbols[this.showSymbols.length - 1];
            allY = this.symbols.map((e) => e.node.getPosition().y).sort((a, b) => b - a);
        }
        else if (this._reelDir === IReel.ReelDirection.BottomToTop) {
            keyIndex = this.showSymbols[0];
            allY = this.symbols.map((e) => e.node.getPosition().y).sort((a, b) => b - a);
        }
        else if (this._reelDir === IReel.ReelDirection.LeftToRight) {
            keyIndex = this.showSymbols[this.showSymbols.length - 1];
            allY = this.symbols.map((e) => e.node.getPosition().x).sort((a, b) => a - b);
        }
        else if (this._reelDir === IReel.ReelDirection.RightToLeft) {
            keyIndex = this.showSymbols[0];
            allY = this.symbols.map((e) => e.node.getPosition().x).sort((a, b) => a - b);
        }

        let keyY: number = this.symbols[keyIndex].node.getPosition().y;
        let curIndex: number = allY.indexOf(keyY);
        return { keyIndex: keyIndex, curIndex: curIndex };
    }

    /**
     * 滾動減速
     * @param dis 位移距離，需傳正值，在onUpdate裡才會更改正負
     */
    private _rollingSlowDown(dis: number) {
        let self = this;
        this._twReel = tween(this._rollingDis).set({ v: 0 })
            .to(this._dt, { v: dis }, {
                easing: self._twEasing,
                onUpdate(target: { v: number, uuid: string }, ratio: number) {
                    let lastIndex: number = self._reelLastIndexs;
                    let diff: number = target.v * ratio * (self.isRollingPostiveDir ? 1 : -1);
                    for (let i = 0; i < self.symbols.length; i++) {
                        if (i !== lastIndex) {
                            let symbol: BaseSymbol = self.symbols[i];
                            self._changeSymbolPos(i, symbol, diff);
                        }
                    }
                    let lastSymbol: BaseSymbol = self.symbols[lastIndex];
                    self._changeSymbolPos(lastIndex, lastSymbol, diff);
                },
            })
            .call(() => {
                if (this._changeSymCount <= 0) {
                    (this._isUseRebounce) ? this._rollingBounce() : this._rollingEnd();
                }
                else {
                    let newDis: number = this._calNormalDis();
                    if (this._changeSymCount === 1) {
                        let symbol: BaseSymbol = this.symbols[this._reelLastIndexs];
                        let curPosX: number = symbol.curPos.x;
                        let curPosY: number = symbol.curPos.y;
                        let refPosValue: number = (this.isHorizen ? curPosX : curPosY);
                        let changeDis: number = refPosValue + newDis * (self.isRollingPostiveDir ? 1 : -1);

                        newDis = (this.isRollingPostiveDir) ?
                            (changeDis >= this.refBound) ? this.refBound - refPosValue : newDis :
                            (changeDis <= this.refBound) ? refPosValue - this.refBound : newDis;
                    }
                    this._rollingSlowDown(newDis);
                }
            })
            .start();
    }

    private _rollingBounce() {
        var self = this;
        let fwdTime: number = this._endSwingDis / (this._calNormalDis() * this._finalDms);
        let backTime: number = this._GVar.isPassSpin ? this._reelPhysic.normal.endPassBounceTime : this._reelPhysic.normal.endBounceTime;
        let fwdDis: number = this._endSwingDis * (this.isRollingPostiveDir ? 1 : -1);
        let backDis: number = this._endSwingDis * (this.isRollingPostiveDir ? -1 : 1);

        this._twReel = tween(self._rollingDis).set({ v: 0 })
            .to(fwdTime, { v: fwdDis }, {
                onUpdate(target: { v: number, uuid: string }, ratio: number) {
                    let diff: number = target.v * ratio;
                    for (let i = 0; i < self.symbols.length; i++) {
                        let symbol: BaseSymbol = self.symbols[i];
                        let curPos: Vec3 = symbol.curPos;
                        let newX: number = (self.isHorizen) ? curPos.x + diff : curPos.x;
                        let newY: number = (self.isHorizen) ? curPos.y : curPos.y + diff;
                        symbol.node.setPosition(newX, newY);
                        if (ratio === 1) symbol.curPos = symbol.node.getPosition();
                    }
                },
            })
            .to(backTime, { v: backDis }, {
                onUpdate(target: { v: number, uuid: string }, ratio: number) {
                    let diff: number = target.v * ratio;
                    for (let i = 0; i < self.symbols.length; i++) {
                        let symbol: BaseSymbol = self.symbols[i];
                        let curPos: Vec3 = symbol.curPos;
                        let newX: number = (self.isHorizen) ? curPos.x + diff : curPos.x;
                        let newY: number = (self.isHorizen) ? curPos.y : curPos.y + diff;
                        symbol.node.setPosition(newX, newY);

                        if (ratio === 1) {
                            symbol.curPos = symbol.symPos;
                        }
                    }
                },
            })
            .call(() => { self._rollingEnd(); })
            .start();
    }

    private _rollingEnd() {
        // TODO:最後停止時，symbol位置有些偏差，有空再修改不用停止後再調位置
        this.symbols.forEach(e => e.node.setPosition(e.symPos));
        for (let i = 0; i < this.symbols.length; i++) {
            if (i === this.symbols.length - 1) {
                if (this._twReel) {
                    this._twReel.stop();
                    this._twReel = null;
                }
                this._setEmptySymbolsVisible(false);
                EvtCtrl.dispatchEvent(DispatchEventType.All, { eventID: Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelRollingEnd, reelIndex: this._reelIndex });
                this._resolveReelStop();
            }
        }
    }

    private _resolveReelStop() {
        if (this._spinStopResolve) {
            this._spinStopResolve();
            this._spinStopResolve = null;
        }
    }

    private _changeSymbolPos(rowIndex: number, symbol: BaseSymbol, diff: number) {
        let curPos: Vec3 = symbol.curPos;
        let newX: number = this.isHorizen ? curPos.x + diff : curPos.x;
        let newY: number = this.isVertical ? curPos.y + diff : curPos.y;

        if (this._reelLastIndexs === rowIndex && this._isReachBound(this.isHorizen ? newX : newY)) {
            let nextIndex: number = (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom || this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight) ? this._getSymNextIndex(rowIndex) : this._getSymPreIndex(rowIndex);
            let preIndex: number = (this.reelConfig.reelDir === IReel.ReelDirection.TopToBottom || this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight) ? this._getSymPreIndex(rowIndex) : this._getSymNextIndex(rowIndex);
            let nextSymbolPos: Vec3 = this.symbols[nextIndex].node.getPosition();
            let nextSymSize: Size = this.symbols[nextIndex].node.getComponent(UITransform).contentSize;

            if (this._isStopping) {
                this._changeSymCount--;
                if (this._changeSymCount === (this._baseChangeSymCount - 1)) {
                    this._isChangeRealSym = true;
                }
            }

            let nextSymIndex: number = (this._isChangeRealSym) ? this._curSymIndexStrip[rowIndex] : this._getNextChangeSymIndex();
            let pay: number = (this._isChangeRealSym) ? this._curPayStrip[rowIndex] : this._randomPay(nextSymIndex);
            if (!this._isChangeRealSym) nextSymIndex = this._randomSymbol(nextSymIndex)//this._GVar.countSymbolPay(nextSymIndex, pay);
            symbol.setSymbol(SymbolState.Rolling, this._blurEnable, nextSymIndex, pay);
            let symSize: Size = symbol.node.getComponent(UITransform).contentSize;

            newX = this.isHorizen ? nextSymbolPos.x + (this.reelConfig.reelDir === IReel.ReelDirection.LeftToRight ? -1 : 1) * (nextSymSize.width * 0.5 + symSize.width * 0.5) : newX;
            newY = this.isVertical ? nextSymbolPos.y + (this.reelConfig.reelDir === IReel.ReelDirection.BottomToTop ? -1 : 1) * (nextSymSize.height * 0.5 + symSize.height * 0.5) : newY;
            this._reelLastIndexs = preIndex;
        }
        let newPos: Vec3 = v3(newX, newY);
        symbol.curPos = newPos;
        symbol.node.setPosition(newPos);
    }

    private _getNextChangeSymIndex() {
        let stripLen: number = this._strip.length;
        let curRngIndex: number = this._curRngRuning;
        let newRngIndex: number = curRngIndex + (this.reelConfig.reelDir === IReel.ReelDirection.BottomToTop || this.reelConfig.reelDir === IReel.ReelDirection.RightToLeft ? 1 : -1);
        newRngIndex = (newRngIndex > stripLen - 1) ? newRngIndex % stripLen : (newRngIndex < 0) ? stripLen - 1 : newRngIndex;
        this._curRngRuning = newRngIndex;
        return this._strip[this._curRngRuning];
    }

    private _randomPay(sym) {
        if (sym <= 1 || sym >= 10)
            return 0;
        let _md = Math.floor(Math.random() * 2) + 1;//(sym - 2) % 2;
        let maxNum = Data.Library.MQ_RANDOMSYB_WEIGHT[_md].TA - 1;
        let minNum = 0;
        let rng = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        for (let i = 0; i < Data.Library.MQ_RANDOMSYB_WEIGHT[_md].RSYB.length; i++) {
            if (rng < Data.Library.MQ_RANDOMSYB_WEIGHT[_md].WT[i]) {
                return Data.Library.MQ_RANDOMSYB_WEIGHT[_md].RSYB[sym];//Data.Library.MQ_RANDOMSYB_WEIGHT[_md].RSYB[i]
            }
            rng -= Data.Library.MQ_RANDOMSYB_WEIGHT[_md].WT[i];
        }
        return 0;
    }

    private _randomSymbol(sym) {
        //0,1,2,3,4,10
        if (sym < 1)
            return 0;
        if (sym >= 10)
            return 10;
        if (sym === 1)
            return 1;
        let _md = 0;//(sym - 2) % 2;
        let maxNum = Data.Library.MQ_RANDOMSYB_WEIGHT[_md].TA - 1;
        let minNum = 0;
        let rng = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        for (let i = 0; i < Data.Library.MQ_RANDOMSYB_WEIGHT[_md].RSYB.length; i++) {
            if (rng < Data.Library.MQ_RANDOMSYB_WEIGHT[_md].WT[i]) {
                return Data.Library.MQ_RANDOMSYB_WEIGHT[_md].RSYB[i];
            }
            rng -= Data.Library.MQ_RANDOMSYB_WEIGHT[_md].WT[i];
        }
        // return 0;
    }
    //#endregion
    // //#region drop reel rolling
    /**
     * 開始掉落
     * DropIn 跟 DropOut 各別symbol掉落結束都會送eReelSymbolDropEnd事件
     * DropIn 掉落結束會送eReelDropInEnd事件
     * DropOut 掉落結束會送eReelDropOutEnd事件
     * @param config 滾論掉落的相關設定參數
     * @returns 
     */
    public startDrop(config: Partial<ReelDropConfig>) {
        return new Promise<void>(async (resolve, reject) => {
            const mixConfig = {
                dropType: null,
                curStrip: null,
                curPayStrip: null,
                isDropInUseSymbolDelay: false,
                isDropOutUseSymbolDelay: false,
                isNeedSlow: false,
                cb: null,
                dropEasing: "smooth" as TweenEasing,
                isNeedBounce: true,
                dropBounceSymIndex: null,
                dropBounceType: DropBounceType.Symbol,
                dropBounceEasing: "smooth" as TweenEasing,
                ...config,
            }
            const dropBounceConfig: ReelDropBounceConfig = {
                isNeedBounce: mixConfig.isNeedBounce,
                dropBounceSymIndex: mixConfig.dropBounceSymIndex,
                dropBounceType: mixConfig.dropBounceType,
                dropBounceEasing: mixConfig.dropBounceEasing,
            }
            if (!this._isUseDropRolling || mixConfig.dropType == null) return;
            if (mixConfig.dropType !== DropType.DropIn && (mixConfig.isDropOutUseSymbolDelay == null || mixConfig.dropEasing == null)) return;
            if (mixConfig.dropType !== DropType.DropOut && (mixConfig.curStrip == null || mixConfig.curPayStrip == null || mixConfig.isDropInUseSymbolDelay == null || mixConfig.dropEasing == null || dropBounceConfig.dropBounceEasing == null)) return;

            if (config.dropType !== DropType.DropIn) await this._dropOut(mixConfig.isNeedSlow, mixConfig.isDropOutUseSymbolDelay, mixConfig.dropEasing);
            if (config.dropType !== DropType.DropOut) await this._dropIn(mixConfig.curStrip, mixConfig.curPayStrip, mixConfig.isNeedSlow, mixConfig.isDropInUseSymbolDelay, mixConfig.dropEasing, dropBounceConfig);
            if (config.cb) config.cb();
            resolve();
        });
    }

    private async _dropIn(curStrip: number[], curPayStrip: number[], isNeedSlow: boolean, isUseSymbolDelay: boolean, dropEasing: TweenEasing, dropBounceConfig: ReelDropBounceConfig) {
        return new Promise<void>(async (resolve, reject) => {
            let self = this;
            let startIndex: number = (this.isInOrderDataDir) ? this.symbols.length - 1 - this._extraBaseSymCount : this._extraBaseSymCount;
            let endIndex: number = (this.isInOrderDataDir) ? this._extraBaseSymCount : this.symbols.length - 1 - this._extraBaseSymCount;
            async function dropFunc(symbol: BaseSymbol, startPos: Vec3, targetPos: Vec3, isLast: boolean) {
                await self._dropTwFunc(DropType.DropIn, symbol, startPos, targetPos, isUseSymbolDelay, dropEasing, dropBounceConfig);
                if (isLast) {
                    if (self._isUseDropBounce && dropBounceConfig.isNeedBounce && dropBounceConfig.dropBounceType === DropBounceType.Reel) {
                        await self._dropInBounce(symbol, dropBounceConfig.dropBounceType, dropBounceConfig.dropBounceEasing);
                    }
                    self._sentDropEvt(Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelDropInEnd);
                    resolve();
                }
            }

            for (let i = startIndex; (this.isInOrderDataDir ? i >= endIndex : i <= endIndex); (this.isInOrderDataDir ? i-- : i++)) {
                let symbol: BaseSymbol = this.symbols[i];
                let startPosX: number = (this.isVertical) ? symbol.symPos.x :
                    (this._reelDir === IReel.ReelDirection.RightToLeft ? this._rightBoundX : this._leftBoundX) +
                    (this._reelDir === IReel.ReelDirection.RightToLeft ? 1 : -1) * (this.isInOrderDataDir ? startIndex - i : i - startIndex) * (this._baseSymSize.width + this._reelSymGap.width);

                let startPosY: number = (this.isHorizen) ? symbol.symPos.y :
                    (this._reelDir === IReel.ReelDirection.TopToBottom ? this._topBoundY : this._bottomBoundY) +
                    (this._reelDir === IReel.ReelDirection.TopToBottom ? 1 : -1) * (this.isInOrderDataDir ? startIndex - i : i - startIndex) * (this._baseSymSize.height + this._reelSymGap.height);

                let isLast: boolean = (i === endIndex);
                let startPos: Vec3 = v3(startPosX, startPosY);
                let targetPos: Vec3 = symbol.symPos;

                symbol.setSymbol(SymbolState.Drop, this._blurEnable, curStrip[i], curPayStrip[i]);
                symbol.node.setPosition(startPos);
                symbol.curPos = startPos;
                if (isUseSymbolDelay) {
                    let delay: number = this._reelPhysic.drop.dropInSymbolDelay * (this.isInOrderDataDir ? startIndex - i : i - startIndex) * (isNeedSlow ? this._stopMult : 1);
                    this.scheduleOnce(async () => {
                        dropFunc(symbol, startPos, targetPos, isLast);
                    }, delay);
                }
                else dropFunc(symbol, startPos, targetPos, isLast);
            }
        })
    }

    private _dropOut(isNeedSlow: boolean, isUseSymbolDelay: boolean, dropEasing: TweenEasing = "smooth") {
        return new Promise<void>((resolve, reject) => {
            let self = this;
            let startIndex: number = (this.isInOrderDataDir) ? this.symbols.length - 1 - this._extraBaseSymCount : this._extraBaseSymCount;
            let endIndex: number = (this.isInOrderDataDir) ? this._extraBaseSymCount : this.symbols.length - 1 - this._extraBaseSymCount;
            let refSymbol: BaseSymbol = this.symbols[endIndex];
            let dis: number = (this._reelDir === IReel.ReelDirection.TopToBottom) ? Math.abs(refSymbol.symPos.y - this._bottomBoundY) :
                (this._reelDir === IReel.ReelDirection.BottomToTop) ? Math.abs(this._topBoundY - refSymbol.symPos.y) :
                    (this._reelDir === IReel.ReelDirection.LeftToRight) ? Math.abs(this._rightBoundX - refSymbol.symPos.x) :
                        Math.abs(refSymbol.symPos.x - this._leftBoundX);

            dis = dis + (this.isVertical ? this._baseSymSize.y : this._baseSymSize.x);

            async function dropFunc(symbol: BaseSymbol, targetPos: Vec3, isLast: boolean) {
                await self._dropTwFunc(DropType.DropOut, symbol, symbol.symPos, targetPos, isUseSymbolDelay, dropEasing);
                if (isLast) {
                    self._sentDropEvt(Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelDropOutEnd);
                    resolve();
                }
            }

            for (let i = startIndex; (this.isInOrderDataDir ? i >= endIndex : i <= endIndex); (this.isInOrderDataDir ? i-- : i++)) {
                let symbol: BaseSymbol = this.symbols[i];
                let targetPosX: number = symbol.symPos.x + (this.isHorizen ? (this._reelDir === IReel.ReelDirection.LeftToRight ? 1 : -1) * dis : 0);
                let targetPosY: number = symbol.symPos.y + (this.isVertical ? (this._reelDir === IReel.ReelDirection.TopToBottom ? 1 : -1) * -dis : 0);
                let targetPos: Vec3 = v3(targetPosX, targetPosY);
                let isLast: boolean = (this.isInOrderDataDir) ? (i === this._extraBaseSymCount) : (i === this.symbols.length - this._extraBaseSymCount - 1);
                symbol.curPos = symbol.symPos;
                if (isUseSymbolDelay) {
                    let delay: number = this._reelPhysic.drop.dropOutSymbolDelay * (this.isInOrderDataDir ? startIndex - i : i - startIndex) * (isNeedSlow ? this._stopMult : 1);
                    this.scheduleOnce(async () => {
                        dropFunc(symbol, targetPos, isLast);
                    }, delay);
                }
                else dropFunc(symbol, targetPos, isLast);
            }
        })
    }

    private _sentDropEvt(evtType: string, dropType?: DropType, symbol?: BaseSymbol) {
        let args;
        switch (evtType) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelDropInEnd:
            case Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelDropOutEnd:
                args = { reelIndex: this._reelIndex };
                break;
            case Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelSymbolDropEnd:
                args = { type: dropType, reelIndex: this._reelIndex, symbol: symbol };
                break;
        }
        if (args) {
            EvtCtrl.dispatchEvent(DispatchEventType.All, { eventID: evtType, args: args });
        }
    }

    private _dropTwFunc(dropType: DropType, symbol: BaseSymbol, startPos: Vec3, targetPos: Vec3, isUseSymbolDelay: boolean, dropEasing: TweenEasing, dropBounceConfig?: ReelDropBounceConfig) {
        return new Promise<void>((resolve, reject) => {
            let self = this;
            let curPos: Vec3 = symbol.curPos;
            let refSymV: number = (this.isVertical) ? curPos.y : curPos.x;
            let refTargetV: number = (this.isVertical) ? targetPos.y : targetPos.x;
            let dis: number = (this.isVertical) ? targetPos.y - startPos.y : targetPos.x - startPos.x;
            let dropTime: number = (dropType === DropType.DropIn) ? this._reelPhysic.drop.dropInTime : this._reelPhysic.drop.dropOutTime;
            let subDis: number = Math.abs(dis) / (dropTime / this._dt) * (this._GVar.isPassSpin ? this._reelPhysic.common.passMotionRate : 1) * (this.isRollingPostiveDir ? 1 : -1);
            let changePosV: number = refSymV + subDis;
            subDis = (this.isRollingPostiveDir) ? (changePosV >= refTargetV) ? refTargetV - refSymV : subDis
                : (changePosV <= refTargetV) ? refTargetV - refSymV : subDis;

            tween(this._rollingDis).set({ v: 0 })
                .to(this._dt, { v: subDis }, {
                    easing: dropEasing,
                    onUpdate(target: { v: number, uuid: string }, ratio: number) {
                        let dis: number = target.v * ratio;
                        let x: number = self.isHorizen ? curPos.x + dis : curPos.x;
                        let y: number = self.isVertical ? curPos.y + dis : curPos.y;
                        symbol.node.setPosition(x, y);
                    },
                })
                .call(async () => {
                    let condi: boolean = (this.isRollingPostiveDir) ? refSymV + subDis >= refTargetV : refSymV + subDis <= refTargetV;
                    if (condi) {
                        symbol.curPos = symbol.symPos;
                        if (isUseSymbolDelay) this._sentDropEvt(Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelSymbolDropEnd, dropType, symbol);
                        if (this._isUseDropBounce && dropType === DropType.DropIn && dropBounceConfig.isNeedBounce && dropBounceConfig.dropBounceType === DropBounceType.Symbol) {
                            if (dropBounceConfig.dropBounceSymIndex.indexOf(symbol) > -1) {
                                await this._dropInBounce(symbol, dropBounceConfig.dropBounceType, dropBounceConfig.dropBounceEasing);
                                if (isUseSymbolDelay) this._sentDropEvt(Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelSymbolDropBounceEnd, dropType, symbol);
                            }
                        }
                        resolve();
                    }
                    else {
                        symbol.curPos = symbol.node.getPosition();
                        resolve(this._dropTwFunc(dropType, symbol, startPos, targetPos, isUseSymbolDelay, dropEasing, dropBounceConfig));
                    }
                })
                .start();
        })
    }

    private _dropInBounce(symbol: BaseSymbol, dropBounceType: DropBounceType, easing: TweenEasing) {
        return new Promise<void>((resolve, reject) => {
            let startDis: number = this._dpBounceDis * (this.isRollingPostiveDir ? -1 : 1);
            let endDis: number = this._dpBounceDis * (this.isRollingPostiveDir ? 1 : -1);
            let startTargetPos: Vec3 = (this.isVertical) ? v3(0, startDis) : v3(startDis, 0);
            let endTargetPos: Vec3 = (this.isVertical) ? v3(0, endDis) : v3(endDis, 0);

            let tw: Tween<Node> = tween()
                .by(this._reelPhysic.drop.dropBounceTime, { position: startTargetPos }, { easing: easing })
                .by(this._reelPhysic.drop.dropBounceTime, { position: endTargetPos }, { easing: easing })

            if (dropBounceType === DropBounceType.Reel) {
                for (let i = this.symbols.length - 1; i >= 0; i--) {
                    tw.clone(this.symbols[i].node).call(() => {
                        if (i === 0) resolve();
                    }).start();
                }
            }
            else {
                tw.clone(symbol.node).call(() => { resolve(); }).start();
            }

        })
    }
    //#endregion
    //#region change reel rolling
    /**
     * 滾動是播動畫轉換的話使用。
     * @param curStrip 變化完實際的symbol Index
     * @param curPayStrip symbol pay
     * @param delay 多久後轉換
     * @param cb callback
     */
    startChange(curStrip: number[], curPayStrip: number[], delay: number, cb: Function) {
        this.scheduleOnce(() => {
            this.setSymbols(SymbolState.Change, curStrip, curPayStrip);
        }, delay);
    }
    //#endregion
}

