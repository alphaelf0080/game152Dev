import { _decorator, Component, find, instantiate, Label, sp, Sprite, SpriteFrame, Node, log, Button, Color, AudioSource, UITransform, sys, View, game } from 'cc';
import { EventController } from './EventController';
import { UIController } from '../LibCreator/libUIController/UIController';
import { ReelController } from '../ReelController/ReelController';
import { AnimationController } from '../AnimationController';
import { LoadingScene } from '../LibCreator/libLoadingInit/LoadingScene';
import { Data, Mode } from '../DataController';
import { UCoin } from '../LibCreator/libScript/JackpotScript/UCoin/UCoin';
import { AllNode } from '../LibCreator/libScript/CommonLibScript';

import { FontMapController } from '../FontMapController';
import { AutoPages } from '../LibCreator/libUIController/AutoBtn';
import { getSpinServerClient } from '../LocalServer/SpinServerClient';

const { ccclass, property } = _decorator;
let MessageConsole: Node = null;
let EVENTController: EventController = null;
let mUIController: UIController = null;
let DropSymbolMap = null;
let AutoPage:AutoPages =null;
@ccclass('StateConsole')
export class StateConsole extends Component {
    @property({ type: SpriteFrame }) Banner = [];

    clock = 0;
    BuyFs = false;

    CurScene: Mode.SCENE_ID = Mode.SCENE_ID.BASE;
    CurState: Mode.FSM = Mode.FSM.K_IDLE;
    PreState: Mode.FSM = Mode.FSM.K_FEATURE_PRE_SHOWWIN;
    BetArray = [1, 2, 5, 10, 20];
    LineArray = [30, 30, 30, 30, 30];
    RateArray = [1, 10, 25, 50, 100, 500];
    TotalArray = [];
    TotalArrayX = [];
    BetIndex = 0;
    LineIndex = 0;
    RateIndex = 0;
    TotalIndex = 0;
    LngArray = ['eng', 'tch', 'sch'];
    LngIndex = 0;
    PlayerCent = 1000000;
    MaxBet = 0;
    AccountingUnit = 0;
    LobbyLogged = false;
    LastRng = [1, 3, 12, 23, 13, 1];
    LastStripIndex = 0;
    LastPay = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 150, 2, 0, 100, 20, 0, 10, 0, 200, 200, 50, 5, 0, 0, 0, 0, 0];
    isFreeGame = false;
    isMute = false;
    isMenuOn = false;
    isTurboOn = false;
    isTurboEnable = false;
    isAutoPlay = false;
    isBgmSoundPlayed = false;
    AutoMode = 0;
    AutoModeNum = 0;
    FreeGameInfo = {
        played_times: 0,
        total_times: 0,
        total_win: 0,
        ini_cent: 0
    };
    ScatterMap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    SymbolMap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    ServerRecoverData = null;
    FeatureTotalWin = 0;
    FeatureAutoEnter = 10;
    FeatureMaxTimes = 70;
    FeatureTriggerTimes = 0;
    FeatureGameCurSpins = 0;
    FeatureGameCurTotalspins = 0;
    featureBuyType = -1;

    miniSpinCost = 0;  // spin最小花費

    FontMap: { [key: string]: string } = null;
    WildFontMap: { [key: string]: string } = null;

    minifps = 60;
    spinTimeOut: number = 0
    overSpinTimeOut: number = 30;

    isPlusFreeTimes = false;

    UIController: UIController

    MainReelBgNode = null;
    FreeReelBgNode = null;
    FreeUiNode = null;
    BannerWinNode = null;
    BannerTextNode = null;
    BannerBgNode = null;
    SpinNumNode = null;
    WinTextNode = null;
    BannerReTextNode = null;
    BannerMaxTextNode = null;
    FreeSpinNumNode = null;
    FreeSpinNumNode_1 = null;
    FreeSpinNumNode_2 = null;
    Win =null;

    protected onLoad(): void {
        if (Data.Library.StateConsole === null) {
            Data.Library.StateConsole = this;
        } else {
            this.destroy();
        }
    }

    start() {
        MessageConsole = find("MessageController");
        EVENTController = find("EventController").getComponent(EventController);
        mUIController = find("Canvas/BaseGame/Layer/Shake/UI").getComponent(UIController);
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;
        AutoPage = find("Canvas/BaseGame/Page/AutoPage").getComponent(AutoPages);

        this.CurState = Mode.FSM.K_IDLE;
        this.PreState = Mode.FSM.K_SHOWUC;

        this.BannerTextNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBgCover/BannerText");
        this.BannerBgNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBg");
        this.BannerWinNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin");
        this.MainReelBgNode = find("Canvas/BaseGame/Layer/Shake/Reel/reelbg");
        this.FreeReelBgNode = find("Canvas/BaseGame/Layer/Shake/Reel/reelbgFs");
        this.FreeUiNode = find("Canvas/BaseGame/Layer/Shake/UI/FSUI");
        this.SpinNumNode = find("Canvas/BaseGame/Layer/Shake/UI/SettingsPage/SpinBtn/SpinNum");
        this.WinTextNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinText");
        this.BannerReTextNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/BannerReText");
        this.BannerMaxTextNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/BannerMaxText");
        this.FreeSpinNumNode = find("Canvas/BaseGame/Layer/Shake/UI/FSUI/FreeSpinNum");
        this.FreeSpinNumNode_1 = find("Canvas/BaseGame/Layer/Shake/UI/FSUI/FreeSpinNum_1");
        this.FreeSpinNumNode_2 = find("Canvas/BaseGame/Layer/Shake/UI/FSUI/FreeSpinNum_2");

        this.Win = AllNode.Data.Map.get("WinBtn");
        let micheck = 0;
        let miarray = [];
        this.schedule((deltaTime: number) => {
            if (this.CurState == Mode.FSM.K_SPINSTOPING) {
                if (this.minifps > (1 / deltaTime)) {
                    micheck += 1;
                    miarray.push((1 / deltaTime));
                    if (micheck > 30) {
                        micheck = 0;
                        miarray.sort(function (a, b) {
                            return a - b;
                        });
                        this.minifps = miarray[15];
                    }
                }
            }
        });

        let num = new FontMapController;
        this.FontMap = num.BasicInit();

        let wildNum = new FontMapController;
        this.WildFontMap = wildNum.WildNumInit();
    }

    update(deltaTime: number) {
        this.clock += deltaTime;
        if (this.CurState == Mode.FSM.K_FEATURE_WAIT_START) {
            if (this.clock >= this.FeatureAutoEnter) {
                this.clock = 0;
                AnimationController.Instance.StartFsAnm();
            }
        } else {
            this.clock = 0;
        }

        if (this.CurState === Mode.FSM.K_SPIN || this.CurState === Mode.FSM.K_SPINSTOPING) {
            this.spinTimeOut += deltaTime;
            if (this.spinTimeOut > this.overSpinTimeOut) {
                this.spinTimeOut = 0;
                this.enabled = false;
                Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.SpinningTImeOut, Data.Library.ErrorData.Type.ALARM);
                Mode.ErrorInLoading(Data.Library.ErrorData.Code.SpinningTImeOut.toString())
            }
        }
    }

    nextState() {
        this.bef_nextState();
        log(Mode.FSM[this.CurState]);
        switch (this.CurState) {
            case Mode.FSM.K_IDLE:
                Data.Library.MathConsole.ResetWinData();
                this.notifyStateChange();
                if (this.isAutoPlay) {
                    let dela = Data.Library.DEF_AUTOPLAY_IDLE_TIME;
                    if (Data.Library.MathConsole.getWinData()._wintotalcredit > 0) {
                        dela = Data.Library.DEF_AUTOPLAY_IDLE_TIME_WIN;
                    }
                    this.scheduleOnce(() => {
                        if (this.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_Num) {
                            this.AutoModeNum -= 1;
                            this.SpinNumNode.getComponent(Label).string = this.SpriteNumberInNumber(this.AutoModeNum);
                        }
                        this.Spin(false);
                    }, dela);
                }
                break;
            case Mode.FSM.K_SPIN:
                this.spinTimeOut = 0;
                this.ResetReelSpeed(false);
                this.BannerBgNode.active = true;
                this.BannerWinNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);
                // this.BannerTextNode.active = true;
                if (this.isAutoPlay == true && this.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_Num) {
                    if (this.AutoModeNum <= 0) {
                        AutoPage.AutoStop();
                    }
                }
                this.notifyStateChange();
                break;
            case Mode.FSM.K_SPINSTOPING:
                this.notifyStateChange();
                break;
                
            case Mode.FSM.K_EXPEND: break;
            case Mode.FSM.K_FEATURE_EXPEND: break;
            case Mode.FSM.K_DROP: break;
            case Mode.FSM.K_FEATURE_DROP: break;

            case Mode.FSM.K_SHOWWIN:
            case Mode.FSM.K_FEATURE_SHOWWIN:
                AllNode.Data.Map.get("SpinLoop").getComponent(AudioSource).stop();  //停止旋轉音樂

                this.WinTextNode.active = true;
                this.BannerReTextNode.active = false;
                this.BannerMaxTextNode.active = false;

                if(Data.Library.StateConsole.CurScene==Mode.SCENE_ID.FEATURE0&&DropSymbolMap.WinLineGroup.length>0){
                    for(let i=0;i<DropSymbolMap.WinLineGroup.length;i++){
                        Data.Library.StateConsole.FeatureTotalWin += DropSymbolMap.WinLineGroup[i].credit;
                    }
                    this.Win.getChildByName("Win").getComponent(Label).string = Data.Library.StateConsole.NumberToCent(Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin));
                }                    
                // if (DropSymbolMap.CurrIndex == 0) {
                //     find("Canvas/BaseGame/Layer/Shake/UI/InfoController/WinBtn/Win").getComponent(Label).string = this.NumberToCent(0);
                // }
                if (Data.Library.MathConsole.getWinData()._wintotalcredit > 0 && DropSymbolMap.WinLineGroup.length > 0) {  //WinPos更換WinLineGroup
                    this.notifyStateChange();
                } else {
                    this.nextState();
                }
                break;
            case Mode.FSM.K_WAIT:
                this.notifyStateChange();
                if(!UCoin.running || Data.Library.StateConsole.CurScene !== Mode.SCENE_ID.BASE ||
                    (UCoin.running && Data.Library.StateConsole.CurScene === Mode.SCENE_ID.BASE && Data.Library.MathConsole.getWinData()._wintotalcredit <= 0)){
                    this.nextState();  
                }
                break;
            case Mode.FSM.K_ENDGAME:
                this.notifyStateChange();
                this.nextState();
                break;
            case Mode.FSM.K_SHOWUC:
                this.notifyStateChange();
                break;
            case Mode.FSM.K_SHOWREDP:
                if (Data.RedPacket.RedPackCentIn.length > 0) {
                    this.notifyStateChange();
                } else {
                    this.nextState();
                }
                break
            case Mode.FSM.K_SHOWJP:
                if (Data.Jackpot.preJpWinMoney > 0 || (Data.Jackpot.jackpotCentIn.length > 0 && Data.Jackpot.jackpotCentIn.some(e => e.type === "eJackpot"))) {
                    this.notifyStateChange();
                } else {
                    this.nextState();
                }
                break;

            case Mode.FSM.K_FEATURE_TRIGGER: 
                this.scheduleOnce(function () {
                    this.nextState();
                }, 1.5);
                break;

            case Mode.FSM.K_FEATURE_SHOWSCATTERWIN: break;

            case Mode.FSM.K_FEATURE_TRANSLATE:
                this.notifyStateChange();
                this.scheduleOnce(function () {
                    Data.Library.MathConsole.swapWinData();
                    this.BannerBgNode.active = true;
                    this.BannerWinNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);
                    AllNode.Data.Map.get("WinText").active = true;
                    this.nextState();
                }, 0.7);
                break;
            case Mode.FSM.K_FEATURE_WAIT_START:
                this.BannerTextNode.active = true;
                this.ChangeBackGround('fs');

                let freeSpinNum = AllNode.Data.Map.get("FreeSpinNum");
                let num = this.FeatureGameCurTotalspins;
                freeSpinNum.getComponent(Label).fontSize = num >= 100 ?125 :174;
                freeSpinNum.getComponent(Label).string = this.SpriteNumberInNumber(num);
                freeSpinNum.active = true;
  
                this.SwitchFreeUiNode('1');
                find("Canvas/BaseGame/Layer/Shake/UI/InfoController").setPosition(360, 32);
                this.BannerBgNode.getComponent(Sprite).spriteFrame = this.Banner[1];
                this.BannerWinNode.getComponent(Sprite).spriteFrame = this.Banner[1];
                Data.Library.MathConsole.CurModuleid = Data.Library.MathConsole.NextModuleid;
                this.FeatureTotalWin = Data.Library.MathConsole.getWinData()._wintotalcredit;
                this.CurScene = Mode.SCENE_ID.FEATURE0;
                this.ServerRecoverData = null;
                this.notifyStateChange();
                break;
            case Mode.FSM.K_FEATURE_SPIN:
                this.FeatureTriggerTimes = 0;
                this.BannerTextNode.active = true;
                this.isPlusFreeTimes = false;
                this.spinTimeOut = 0;
                this.ResetReelSpeed(true);
                let last = this.FeatureGameCurTotalspins - this.FeatureGameCurSpins - 1;
                if (last > 0) {
                    this.FreeSpinNumNode.getComponent(Label).string = this.SpriteNumberInNumber(last);
                    let scale = last > 99 ?0.7 :1;
                    this.FreeSpinNumNode.setScale(scale, scale);
                }
                else {
                    this.SwitchFreeUiNode('2');
                }
                this.notifyStateChange();
                break;
            case Mode.FSM.K_FEATURE_SPINSTOPING:
                this.notifyStateChange();
                break;
            case Mode.FSM.K_FEATURE_WAIT:
                Data.Library.MathConsole.ResetWinData();
                this.notifyStateChange();
                let delay = 0.7;
                if (Data.Library.MathConsole.getWinData()._wintotalcredit > 0) {
                    delay = 1;
                }
                this.scheduleOnce(() => {
                    this.BannerBgNode.active = true;
                    this.BannerWinNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);
                    this.nextState();
                }, delay);
                break;
            case Mode.FSM.K_FEATURE_RETRIGGER:
                if(find("AudioController/Tigger").getComponent(AudioSource).playing ==false){
                    find("AudioController/Tigger").getComponent(AudioSource).play();
                }
                let start = this.FeatureGameCurTotalspins - this.FeatureGameCurSpins - this.FeatureTriggerTimes - 1;
                if (start <= 0) {
                    start = 1;
                    this.FreeSpinNumNode.getComponent(Label).string = this.SpriteNumberInNumber(1);
                    this.SwitchFreeUiNode('1');
                }
                this.BannerTextNode.active = false;
                this.WinTextNode.active = false;
                if (this.FeatureGameCurTotalspins >= this.FeatureMaxTimes) {
                    this.BannerMaxTextNode.active = true;
                } else {
                    this.BannerReTextNode.active = true;
                }
                if (this.FeatureTriggerTimes > 0) {
                    this.schedule(() => {
                        if (start < (this.FeatureGameCurTotalspins - this.FeatureGameCurSpins - 1)) {
                            start += 1;
                            this.FreeSpinNumNode.getComponent(Label).string = this.SpriteNumberInNumber(start);
                            let scale = start > 99 ?0.7 :1;
                            this.FreeSpinNumNode.setScale(scale, scale);
                        }
                    }, 0.2, (this.FeatureTriggerTimes - 1));
                }
                this.scheduleOnce(() => {
                    this.BannerBgNode.active = false;
                    this.isPlusFreeTimes = true;
                    Data.Library.MathConsole.getWinData()._wintotalcredit = 0;
                    this.nextState();
                }, 1 + 0.2 * this.FeatureTriggerTimes);
                this.notifyStateChange();
                break;
            case Mode.FSM.K_FEATURE_CHEKRESULT:
                find("AudioController/CheckBonus").getComponent(AudioSource).play();
                this.FeatureTriggerTimes = 0;
                this.FeatureGameCurSpins = 0;
                this.FeatureGameCurTotalspins = 0;
                Data.Library.MathConsole.CurModuleid = Data.Library.MathConsole.Striptables[0]._id;
                Data.Library.MathConsole.NextModuleid = Data.Library.MathConsole.Striptables[0]._id;
                this.CurScene = Mode.SCENE_ID.BASE;
                this.notifyStateChange();
                // this.scheduleOnce(() => {
                //     this.nextState();
                // }, 4);

                this.scheduleOnce(function () {
                    this.BannerBgNode.active = true;
                    this.BannerTextNode.active = true;
                    this.ChangeBackGround('bs');
                    this.SwitchFreeUiNode('-1');
                    find("Canvas/BaseGame/Layer/Shake/UI/InfoController").setPosition(360, 225);
                    this.BannerBgNode.getComponent(Sprite).spriteFrame = this.Banner[0];
                    this.BannerWinNode.getComponent(Sprite).spriteFrame = this.Banner[0];
                    this.BannerWinNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);
                }, 3);
                break;
            default:
                break;
        }
    }

    bef_nextState() {
        switch (this.CurState) {
            case Mode.FSM.K_IDLE:
                this.indicate_nextstate(Mode.FSM.K_SPIN);
                break;
            case Mode.FSM.K_SPIN:
                this.indicate_nextstate(Mode.FSM.K_SPINSTOPING);
                break;
            case Mode.FSM.K_SPINSTOPING:
                this.indicate_nextstate(Mode.FSM.K_SHOWWIN);
                break;
            case Mode.FSM.K_EXPEND: break;
            case Mode.FSM.K_DROP: break;
            case Mode.FSM.K_SHOWWIN:
                if (this.isBonusTrigger()) {
                    this.indicate_nextstate(Mode.FSM.K_FEATURE_TRIGGER);
                } else {
                    this.indicate_nextstate(Mode.FSM.K_WAIT);
                }
                break;
            case Mode.FSM.K_WAIT:
                this.indicate_nextstate(Mode.FSM.K_ENDGAME);
                break;
            case Mode.FSM.K_ENDGAME:
                this.indicate_nextstate(Mode.FSM.K_SHOWREDP);
                break;
            case Mode.FSM.K_SHOWREDP:
                this.indicate_nextstate(Mode.FSM.K_SHOWJP);
                break;
            case Mode.FSM.K_SHOWJP:
                this.indicate_nextstate(Mode.FSM.K_SHOWUC);
                break;
            case Mode.FSM.K_SHOWUC:
                this.indicate_nextstate(Mode.FSM.K_IDLE);
                break;
            case Mode.FSM.K_FEATURE_TRIGGER:
                this.indicate_nextstate(Mode.FSM.K_FEATURE_TRANSLATE);
                break;
            case Mode.FSM.K_FEATURE_SHOWSCATTERWIN: break;
            case Mode.FSM.K_FEATURE_TRANSLATE:
                this.indicate_nextstate(Mode.FSM.K_FEATURE_WAIT_START);
                break;
            case Mode.FSM.K_FEATURE_WAIT_START:
                this.indicate_nextstate(Mode.FSM.K_FEATURE_SPIN);
                break;
            case Mode.FSM.K_FEATURE_SPIN:
                this.indicate_nextstate(Mode.FSM.K_FEATURE_SPINSTOPING);
                break;
            case Mode.FSM.K_FEATURE_SPINSTOPING:
                this.indicate_nextstate(Mode.FSM.K_FEATURE_SHOWWIN);
                break;
                
            case Mode.FSM.K_FEATURE_EXPEND: break;
            case Mode.FSM.K_FEATURE_DROP: break;

            case Mode.FSM.K_FEATURE_SHOWWIN:
                if (this.isBonusTrigger() && !this.isPlusFreeTimes) {
                    this.indicate_nextstate(Mode.FSM.K_FEATURE_RETRIGGER);
                } else {
                    this.indicate_nextstate(Mode.FSM.K_FEATURE_WAIT);
                }
                break;
            case Mode.FSM.K_FEATURE_WAIT:
                if (this.isBonusEnd()) {
                    this.indicate_nextstate(Mode.FSM.K_FEATURE_CHEKRESULT);
                } else {
                    this.indicate_nextstate(Mode.FSM.K_FEATURE_SPIN);
                }
                break;
            case Mode.FSM.K_FEATURE_RETRIGGER:
                this.indicate_nextstate(Mode.FSM.K_FEATURE_SHOWWIN);
                break;
            case Mode.FSM.K_FEATURE_CHEKRESULT:
                this.indicate_nextstate(Mode.FSM.K_WAIT);
                break;
            default:
                break;
        }
    }

    indicate_nextstate(state) {
        this.PreState = this.CurState;
        this.CurState = state;
        Data.Library.ProtoData.SendMsg(112, null); // EMSGID.eStateCall = 112
        console.log("State trace pre : " + Mode.FSM[this.PreState] + " / cur : " + Mode.FSM[this.CurState]);
    }

    reelPassSpin() {
        if (Data.Library.SPIN_LATE == true) {
            if (Data.Library.SPIN_PASS_CHECK == true) {
                find("Canvas/BaseGame/Layer/Shake/Reel").getComponent(ReelController).StopAllSymbolAnimation();
            }
        }
        else {
            find("Canvas/BaseGame/Layer/Shake/Reel").getComponent(ReelController).StopAllSymbolAnimation();
        }
    }

    ResetReelSpeed(inBonus) {  //開關Turbo
        this.isTurboEnable = (this.isTurboOn == true && inBonus == false);
    }

    getCurTotalBet() {
        let totalbet = this.LineArray[this.LineIndex] * this.BetArray[this.BetIndex];
        return totalbet;
    }

    getRateXBet() {
        let totalbet = this.RateArray[this.RateIndex] * this.BetArray[this.BetIndex];
        return totalbet;
    }

    credit2CentbyCurRate(credit) {
        let cent = credit * this.RateArray[this.RateIndex];
        return cent;
    }

    getCurBet() {
        var bet = this.BetArray[this.BetIndex];
        return bet;
    }

    getCurRate() {
        var rate = this.RateArray[this.RateIndex];
        return rate;
    }

    getCurTotoBetInCent() {
        let ttbet = this.getCurTotalBet();
        let ttbetincent = this.credit2CentbyCurRate(ttbet);
        return ttbetincent;
    }

    SendEvent(type: string, data: any) {
        EVENTController.HandleBroadcast(type, data);
    }

    NetInitReady() {
        console.log('[DEBUG] NetInitReady called');
        console.log('[DEBUG] localServerMode:', (Data.Library as any).localServerMode);
        
        // ========== LocalServer 模式：檢查 Spin Server 連線 ==========
        if ((Data.Library as any).localServerMode === true) {
            console.log('[StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線');
            console.log('[DEBUG] About to create SpinServerClient');
            
            try {
                const spinClient = getSpinServerClient();
                console.log('[DEBUG] SpinServerClient created successfully');
                
                // 執行健康檢查
                console.log('[DEBUG] Calling checkHealth()');
                spinClient.checkHealth().then(isHealthy => {
                    console.log('[DEBUG] checkHealth completed, result:', isHealthy);
                    
                    if (isHealthy) {
                        console.log('[StateConsole] ✅ Spin Server 連線正常');
                        
                        // 獲取初始盤面
                        console.log('[DEBUG] Calling getInitialBoard()');
                        return spinClient.getInitialBoard();
                    } else {
                        console.error('[StateConsole] ❌ Spin Server 連線失敗');
                        throw new Error('無法連接到 Spin Server');
                    }
                }).then(initialBoard => {
                    console.log('[StateConsole] 📋 收到初始盤面:', initialBoard);
                    
                    // 設定初始盤面到遊戲中
                    this.applyInitialBoard(initialBoard);
                    
                    // 觸發網路就緒事件
                    let type = "All";
                    let data = {
                        EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY
                    }
                    this.SendEvent(type, data);
                    
                    // 初始化遊戲狀態
                    if (this.ServerRecoverData != null && this.ServerRecoverData != undefined) {
                        this.Recover();
                    } else {
                        if (find("APIConsole")) {
                            Data.Library.yieldLess(1);
                            console.log("enter NetInitReady (LocalServer mode)")
                        }
                    }
                }).catch(error => {
                    console.error('[DEBUG] Promise chain error:', error);
                    console.error('[StateConsole] ❌ Spin Server 錯誤:', error);
                    Mode.ErrorInLoading('Spin Server 錯誤: ' + error.message);
                });
            } catch (error) {
                console.error('[DEBUG] Exception in NetInitReady:', error);
                Mode.ErrorInLoading('SpinServerClient 初始化失敗: ' + error.message);
            }
            
            return; // 不執行原有 WebSocket 邏輯
        }
        // ==========================================================
        
        console.log('[DEBUG] Using normal WebSocket mode');
        
        // 原有邏輯
        let type = "All";
        let data = {
            EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY
        }
        this.SendEvent(type, data);

        if (this.ServerRecoverData != null && this.ServerRecoverData != undefined) {
            this.Recover();
        } else {
            if (find("APIConsole")) {
                Data.Library.yieldLess(1);
                console.log("enter NetInitReady")
            }
        }
    }
    
    /**
     * 應用初始盤面資料到遊戲
     * @param boardData 初始盤面資料
     */
    applyInitialBoard(boardData: any) {
        console.log('[StateConsole] 🎮 設定初始盤面');
        
        // 輸出初始盤面的完整資料
        console.log('[StateConsole] 📋 初始盤面完整資料:', boardData);
        
        // 詳細輸出各項資料
        if (boardData) {
            console.log('[StateConsole] 📊 盤面詳細資訊:');
            console.log('  ├─ RNG 資料:', boardData.rng);
            console.log('  ├─ 模組 ID:', boardData.module_id);
            console.log('  ├─ Session ID:', boardData.session_id);
            console.log('  ├─ 信用額度:', boardData.credit);
            console.log('  ├─ 贏分:', boardData.win);
            console.log('  ├─ 倍率:', boardData.multiplier);
            console.log('  └─ 完整物件:', JSON.stringify(boardData, null, 2));
        }
        
        try {
            // 獲取 ReelController
            const reelNode = find("Canvas/BaseGame/Layer/Shake/Reel");
            if (reelNode) {
                const reelController = reelNode.getComponent(ReelController);
                if (reelController && typeof reelController['SetInitBoard'] === 'function') {
                    // 調用 ReelController 的初始盤面設定方法
                    console.log('[StateConsole] 🔄 正在設定 RNG 盤面資料...');
                    reelController['SetInitBoard'](boardData.rng);
                    console.log('[StateConsole] ✅ 初始盤面設定完成');
                } else {
                    console.warn('[StateConsole] ⚠️ ReelController 沒有 SetInitBoard 方法，使用備用方案');
                    // 備用方案：將資料存儲到 Data.Library 供後續使用
                    (Data.Library as any).initialBoardData = boardData;
                    console.log('[StateConsole] ✅ 初始盤面資料已暫存');
                }
            } else {
                console.warn('[StateConsole] ⚠️ 找不到 Reel 節點');
            }
            
            // 設定模組ID
            if (Data.Library.MathConsole) {
                const oldModuleId = Data.Library.MathConsole.CurModuleid;
                Data.Library.MathConsole.CurModuleid = boardData.module_id;
                console.log('[StateConsole] 🔄 模組 ID 變更: ' + oldModuleId + ' → ' + boardData.module_id);
            }
            
        } catch (error) {
            console.error('[StateConsole] ❌ 設定初始盤面失敗:', error);
        }
    }

    Recover() {
        console.log(this.ServerRecoverData)
        find("Canvas/Activity/ActBanner").active = false;
        // Mode.ShowSpine(AllNode.Data.Map.get("BkgAnm").getComponent(sp.Skeleton), 0, "idle", true, "fs");
        AnimationController.Instance.BkgAnmActive('');

        if (this.ServerRecoverData.cur_module == "BS") {
            let result = this.ServerRecoverData.base_result;
            let cent = Long(result.credit.low, result.credit.high, result.credit.unsigned);
            if (TestOverFlow(cent) == true) {
                Data.Library.MathConsole.getWinData()._wintotalcredit = cent;
            }
            for (let i = 0; i < this.ServerRecoverData.bonus_times_counter.length; i++) {
                if (this.ServerRecoverData.bonus_times_counter[i].module_id == this.ServerRecoverData.next_module) {
                    Data.Library.MathConsole.getWinData()._nextmodule = this.ServerRecoverData.bonus_times_counter[i].module_id;
                    Data.Library.MathConsole.getWinData()._triggerTimes = this.ServerRecoverData.bonus_times_counter[i].total_times;
                    Data.Library.MathConsole.getWinData()._wintype = Mode.PAYTYPE.K_xTOTALBET_BONUSTIMES;
                    Data.Library.MathConsole.NextModuleid = Data.Library.MathConsole.getWinData()._nextmodule;
                    this.FeatureGameCurTotalspins = Data.Library.MathConsole.getWinData()._triggerTimes;
                    this.FeatureTriggerTimes = Data.Library.MathConsole.getWinData()._triggerTimes;
                }
            }
        } else {
            this.CurScene = Mode.SCENE_ID.FEATURE0;
            let BSresult = this.ServerRecoverData.base_result;
            let cent = Long(BSresult.credit.low, BSresult.credit.high, BSresult.credit.unsigned);
            if (TestOverFlow(cent) == true) {
                Data.Library.MathConsole.LastBsResult.TotalWin = cent;
            }
            for (let i = 0; i < this.ServerRecoverData.bonus_times_counter.length; i++) {
                if (this.ServerRecoverData.bonus_times_counter[i].module_id == this.ServerRecoverData.cur_module) {
                    Data.Library.MathConsole.CurModuleid = this.ServerRecoverData.cur_module;
                    Data.Library.MathConsole.NextModuleid = this.ServerRecoverData.next_module;
                    this.FeatureGameCurTotalspins = this.ServerRecoverData.bonus_times_counter[i].total_times;
                    this.FeatureGameCurSpins = this.ServerRecoverData.bonus_times_counter[i].played_times - 1;
                    let FSWin = Long(this.ServerRecoverData.win_credit_long.low, this.ServerRecoverData.win_credit_long.high, this.ServerRecoverData.win_credit_long.unsigned);
                    if (TestOverFlow(FSWin) == true) {
                        this.FeatureTotalWin = FSWin;
                    } else {
                        this.FeatureTotalWin = this.ServerRecoverData.win_credit;
                    }
                }
            }

            let result = this.ServerRecoverData.bonus_result_group[0].slot_result;
            if (result.credit) {
                let GameWin = Long(result.credit.low, result.credit.high, result.credit.unsigned);
                if (TestOverFlow(GameWin) == true) {
                    this.FeatureTotalWin -= GameWin;
                }
            }

            if (result.win_bonus_group) {
                if (result.win_bonus_group.length > 0) {
                    let triggerTimes = result.win_bonus_group[0].times;
                    if (triggerTimes > 0) {
                        this.FeatureGameCurTotalspins -= triggerTimes;
                    }
                }
            }
            let last = this.FeatureGameCurTotalspins - this.FeatureGameCurSpins - 1;
            if (last > 0) {
                this.FreeSpinNumNode.getComponent(Label).string = this.SpriteNumberInNumber(last);
                let scale = last > 99 ?0.7 :1;
                this.FreeSpinNumNode.setScale(scale, scale);
                this.SwitchFreeUiNode('1');
            }
            else {
                this.SwitchFreeUiNode('2');
            }
        }
        Data.Library.yieldLess(1);
        console.log("enter Recover");
    }

    RecoverGame() {
        if (this.ServerRecoverData == null || this.ServerRecoverData == undefined) { return; }

        if (sys.isMobile == true && sys.os != sys.OS.IOS) {
            View.instance.enableAutoFullScreen(true);
        }
        let wait = 0.2;
        if (this.ServerRecoverData.cur_module == "BS") {
            wait = 0.4;
            this.CurState = Mode.FSM.K_FEATURE_TRANSLATE;
            this.notifyStateChange();
            this.scheduleOnce(function () {
                Data.Library.MathConsole.swapWinData();
                this.BannerBgNode.active = true;
                this.BannerWinNode.getComponent(Sprite).color = new Color(255, 255, 255, 0);
                this.BannerTextNode.active = true;
                this.nextState();
            }, 0.3);
        } else {
            this.CurState = Mode.FSM.K_FEATURE_SPIN;
            this.notifyStateChange();
        }

        if (find("Canvas/Loader")) {
            this.scheduleOnce(function () {
                find("Canvas/Loader").active = false;
            }, wait);
        }
    }

    notifyStateChange() {
        let type = "All";
        let data = {
            EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE,
            EnventData: this.CurState
        }
        this.SendEvent(type, data);
    }

    notifyReelChange() {
        let type = "All";
        let data = {
            EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eRESET_STRIP
        }
        this.SendEvent(type, data);
    }

    notifyReelStripReady() {
        let type = "All";
        let data = {
            EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.REEL].eReelStripsAlready
        }
        this.SendEvent(type, data);
    }

    NetReceiveResult() {
        if (this.CurState == Mode.FSM.K_SPIN || this.CurState == Mode.FSM.K_FEATURE_SPIN) {
            Data.Library.MathConsole.checkBonusData();
            this.notifyReelChange();
            this.notifyReelStripReady();
            this.ServerRecoverData = null;
        }
    }

    isBonusTrigger(): boolean {
        let cur_windata = Data.Library.MathConsole.getWinData();  //current base game windata
        if (cur_windata._wintype == Mode.PAYTYPE.K_xTOTALBET_BONUSTIMES) {
            if (this.isAutoPlay == true && this.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_TILLBONUS) {
                AutoPage.AutoStop();
            }
            return true;
        }
        return false;
    }

    isBonusEnd(): boolean {
        this.FeatureGameCurSpins++;
        if (this.FeatureGameCurSpins >= this.FeatureGameCurTotalspins) {
            return true;
        } else {
            return false;
        }
    }

    is5levelBigwinShow() {
        let windataCredit = Data.Library.MathConsole.getWinData()._wintotalcredit;
        if (windataCredit >= (this.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultimate]))
            return Mode.FIVE_LEVEL_WIN_TYPE.ultimate;
        else if (windataCredit >= (this.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultra]))
            return Mode.FIVE_LEVEL_WIN_TYPE.ultra;
        else if (windataCredit >= (this.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.super]))
            return Mode.FIVE_LEVEL_WIN_TYPE.super;
        else if (windataCredit >= (this.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.mega]))
            return Mode.FIVE_LEVEL_WIN_TYPE.mega;
        else if (windataCredit >= (this.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.big]))
            return Mode.FIVE_LEVEL_WIN_TYPE.big;
        return Mode.FIVE_LEVEL_WIN_TYPE.non;
    }

    NumberToCent(number) {
        number = number.toString();
        let dot = "."
        let cama = ","
        if (Data.Library.DIGIMODE == Mode.DigiMode.COMMA) {
            dot = ","
            cama = "."
        }
        if (number.length > 2) {
            let front = "";
            if (number.length > 5) {
                let check = 0;
                for (let i = number.length - 3; i >= 0; i--) {
                    if (check % 4 == 3) {
                        front = cama + front
                        check = 0;
                    }
                    front = number[i] + front;
                    check++;
                }
                if (Data.Library.CREDITMODE == Mode.CreditMode.Dollar) {
                    number = front;
                } else {
                    number = front + dot + number.slice((number.length - 2));
                }
            } else {
                if (Data.Library.CREDITMODE == Mode.CreditMode.Dollar) {
                    number = number.slice(0, (number.length - 2));
                } else {
                    number = number.slice(0, (number.length - 2)) + dot + number.slice((number.length - 2));
                }
            }
        } else {
            if (Data.Library.CREDITMODE == Mode.CreditMode.Dollar) {
                number = "0";
            } else {
                if (number.length == 2) {
                    number = "0" + dot + number;
                } else {
                    number = "0" + dot + "0" + number;
                }
            }
        }
        return number;
    };

    NumberToBetNum(number) {
        number = number.toString();
        if (number.length > 2) {
            let front = "";
            if (number.length > 5) {
                let check = 0;
                for (let i = number.length - 3; i >= 0; i--) {
                    if (check % 4 == 3) {
                        front = "," + front
                        check = 0;
                    }
                    front = number[i] + front;
                    check++;
                }
            }
            else {
                front = number.slice(0, (number.length - 2));
            }
            if (number.slice((number.length - 2)) == "00") {
                number = front;
            }
            else if (number.slice((number.length - 1)) == "0") {
                number = front + "." + number.slice((number.length - 2), 2);
            }
            else {
                number = front + "." + number.slice((number.length - 2));
            }
        }
        else {
            if (number.length == 2) {
                if (number.slice(1) == "0") {
                    number = "0." + number.slice(0, 1);
                }
                else {
                    number = "0." + number;
                }
            }
            else {
                number = "0.0" + number;
            }
        }
        return number;
    };

    SpriteNumberInNumber(num: number) {
        let NumberString = num.toString();
        let ReturnString = "";
        for (let i = 0; i < NumberString.length; i++) {
            ReturnString += this.FontMap[NumberString[i]];
        }
        return ReturnString;
    };

    SpriteNumberInWildNumber(num: number) {
        let unit = "";

        if (num >= 100 * 1000 * 1000 * 1000) {
            num = num / (100 * 1000 * 1000 * 1000);
            unit = "B";
        } else if (num >= 100 * 1000 * 1000) {
            num = num / (100 * 1000 * 1000);
            unit = "M";
        } else if (num >= 100 * 1000) {
            num = num / (100 * 1000);
            unit = "K";
        } else {
            num /= 100;
        }
        let NumberString: string
        if(num > 0 && num < 100) {
            let floorNumber = Math.floor(num * 10) / 10;  //無條件捨去小數點後第二位
            NumberString = floorNumber.toFixed(1);
        }else {
            NumberString = num.toString();
        }
        NumberString += unit;
        let ReturnString = "";
        for (let i = 0; i < NumberString.length; i++) {
            ReturnString += this.WildFontMap[NumberString[i]];
        }
        return ReturnString;
    };

    Spin(buy) {
        if (this.CurState == Mode.FSM.K_IDLE) {
            this.BuyFs = buy;
            if (this.BuyFs == true) {
                if (this.isTurboOn == true) {
                    this.isTurboOn = false;
                    find("Canvas/BaseGame/Layer/Shake/UI/SettingsPage/TurboBtn").getComponent(Sprite).spriteFrame = mUIController.Tubro_off;
                    find("Canvas/BaseGame/Layer/Shake/UI/SettingsPage/TurboBtn/TurboAnm").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
                }
            }
            this.nextState();
        }
    }

    resultCall() {
        if (this.CurState == Mode.FSM.K_SPIN || this.CurState == Mode.FSM.K_FEATURE_SPIN) {
            if (this.CurState == Mode.FSM.K_FEATURE_SPIN && this.ServerRecoverData != null && this.ServerRecoverData != undefined) {
                this.ChangeBackGround('fs');
                find("Canvas/BaseGame/Layer/Shake/UI/InfoController").setPosition(360, 32);
                this.BannerBgNode.getComponent(Sprite).spriteFrame = this.Banner[1];
                this.BannerWinNode.getComponent(Sprite).spriteFrame = this.Banner[1];

                Data.Library.ProtoData.FillWinData(Data.Library.MathConsole.getWinData(), this.ServerRecoverData.bonus_result_group[0].slot_result);
                this.scheduleOnce(() => {
                    this.NetReceiveResult();
                }, 0.1);
            }
            else {
                Data.Library.ProtoData.SendMsg(106, this.BuyFs); // EMSGID.eResultCall = 106
            }
        }
    }

    wallet = null;
    setCredit(cent) {
        if (this.wallet == null) this.wallet = find("Canvas/BaseGame/Layer/Shake/UI/InfoController/Credit").getComponent(Label);
        if (UCoin.running == false) this.wallet.string = this.NumberToCent(cent);
    }

    dataCall() {
        Data.Library.ProtoData.SendMsg(115, null); // EMSGID.eDataCall = 115
    }

    ChangeBackGround(scene: string = 'bs') {
        this.MainReelBgNode.active = scene == 'bs';

        this.FreeReelBgNode.active = scene == 'fs';
        this.FreeUiNode.active = scene == 'fs';
    }
    
    SwitchFreeUiNode(str: string) {
        this.FreeSpinNumNode.active = str == '1';
        this.FreeSpinNumNode_1.active = str == '1';
        this.FreeSpinNumNode_2.active = str == '2';
    }
}

let Long = function (low, high, unsigned) {
    low = low | 0;
    high = high | 0;
    unsigned = !!unsigned;
    if (unsigned)
        return ((high >>> 0) * 4294967296) + (low >>> 0);
    return high * 4294967296 + (low >>> 0);
}

let TestOverFlow = function (num) {
    if (num >= 1000000000000) {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.Overflow, Data.Library.ErrorData.Type.ALARM);
        return false;
    }
    return true;
};