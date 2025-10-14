import { _decorator, Label, Node, ScrollView, sp, tween, UIOpacity, Tween, SpriteFrame, Button, TweenEasing, v3 } from 'cc';
import { Singleton } from '../Common/Singleton';
import { Container } from '../Obj/Container';
import { DispatchEventType, EvtCtrl } from './EventController';
import { ErrorCs } from '../Common/ErrorConsole';
import { ICredit } from '../Interface/ICredit';

export interface BtnSpriteTypes {
    normal: SpriteFrame,
    press?: SpriteFrame,
    hover?: SpriteFrame,
    disabled?: SpriteFrame,
}

export enum SpriteType {
    PNG = ".png",
    JPG = ".jpg",
};

const { ccclass, property } = _decorator;
export namespace Mode {
    export enum CreditMode {
        Cent = 0,
        Dollar = 1,
        Credit = 2
    };
    export enum DigiMode {
        DOT = 0,
        COMMA = 1
    };
    export enum EVENTTYPE {
        COMMON = 0,
        REEL = 1,
        UI = 2,
        NOTICE = 3,
        ServerResponse = 4,
        Animation = 5,
        OTHER = 6,
    };
    export enum FSM {
        K_IDLE = 0,
        K_SPIN = 1,
        K_SPINSTOPING = 2,
        K_PRE_SHOWWIN = 3,
        K_SHOWWIN = 4,
        K_WAIT = 5,
        K_FEATURE_TRIGGER = 6,
        K_FEATURE_SHOWSCATTERWIN = 7,
        K_FEATURE_TRANSLATE = 8,
        K_FEATURE_WAIT_START = 9,
        K_FEATURE_SPIN = 10,
        K_FEATURE_SPINSTOPING = 11,
        K_FEATURE_PRE_SHOWWIN = 12,
        K_FEATURE_SHOWWIN = 13,
        K_FEATURE_WAIT = 14,
        K_FEATURE_CHEKRESULT = 15,
        K_FEATURE_RETRIGGER = 16,
        K_FEATURE_SHOW_RETIGGER = 17,
        K_ENDGAME = 18,
        K_FEATURE_PRE_WAIT_START = 19,
        K_FEATURE_CHANGESYB_MENUSHOW = 20,
        K_FEATURE_CHANGESYB_PRESHOWWIN = 21,
        K_FEATURE_CHANGESYB_SHOWWIN = 22,
        K_SHOWJP = 23,
        K_5LINE_SHOW = 24,
        K_BIGWIN_WAIT = 25,
        K_RESPIN = 26,
        K_EXPEND = 27,
        K_FEATURE_EXPEND = 28,
        K_COLLECT = 29,
        K_DROP = 30,
        K_FEATURE_DROP = 31,
        K_SHOWUC = 32,
        K_SHOW_REDPACKETJP = 33,
    };
    export enum SCENE_ID {
        BASE = 0,
        FEATURE0 = 1
    };
    export enum FiveLevelWinType {
        big = 0,
        mega = 1,
        super = 2,
        ultra = 3,
        ultimate = 4,
        non = 5
    };
    export enum EmsGid {
        eLoginCall = 100,
        eLoginRecall = 101,
        eConfigCall = 102,
        eConfigRecall = 103,
        eStripsCall = 104,
        eStripsRecall = 105,
        eResultCall = 106,
        eResultRecall = 107,
        eOptionCall = 108,
        eOptionRecall = 109,
        eCheckCall = 110,
        eCheckRecall = 111,
        eStateCall = 112,
        eStateRecall = 113,
        eSuicideCall = 114,
        eDataCall = 115,
        eDataRecall = 116,
        eCentInAsk = 200,
        eCentInReask = 201,
        eJackpotInfo = 202,
        eJackpotNotify = 203,
        eMemberInfoAsk = 301,
    }
    export enum JackPotPacketType {
        RedEnvelopeJackpot = "eRedPacket",
        Jackpot = "eJackpot",
    }

    interface ShowSpine {
        trackIndex: number | null,  //動畫軌道 
        anmName: string | null,     //動畫名稱
        loop: boolean | null,       //是否重複撥放
        type: number | null,        // 1: setAnimation  2: addAnimation
        skin: string | null;        //是否更換皮膚
        isClearTrack: boolean;       //播放之前是否清除track
    }
    /**
     * 播放spine動畫
     * @param obj spine物件
     * @param config timeScale預設1、isClearTrack預設false
     * @returns 
     */
    export function showSpine(obj: sp.Skeleton, config?: Partial<ShowSpine>) {
        const mixConfig = {
            trackIndex: null,
            anmName: null,
            loop: null,
            type: null,
            skin: null,
            isClearTrack: false,
            ...config,
        }

        obj.node.active = true;
        if (mixConfig.skin) obj.setSkin(mixConfig.skin); //可以只更換皮膚
        if (mixConfig.trackIndex == null || mixConfig.anmName == null || mixConfig.loop == null || mixConfig.type == null) return;

        if (mixConfig.isClearTrack) obj.clearTrack(mixConfig.trackIndex);
        if (mixConfig.type === 1) obj.setAnimation(mixConfig.trackIndex, mixConfig.anmName, mixConfig.loop);
        else if (mixConfig.type === 2) obj.addAnimation(mixConfig.trackIndex, mixConfig.anmName, mixConfig.loop);
    }

    interface ClearSpine {  //針對sp.Skeleton的設置
        trackIndex: number,  //-1代表全部清除
        poseInit: boolean,   //是否初始化骨架
        visible: boolean     //節點是否關閉
    }
    /**
     * 清除spine動畫
     * @param obj spine物件
     * @param config config不輸入就代表 清除所有tracks、將骨架初始化、節點關閉 
     */
    export function clearSpine(obj: sp.Skeleton, config?: Partial<ClearSpine>) {
        const mixConfig = {
            trackIndex: -1,
            poseInit: true,
            visible: false,
            ...config,
        };
        (mixConfig.trackIndex === -1) ? obj.clearTracks() : obj.clearTrack(mixConfig.trackIndex);
        if (mixConfig.poseInit) obj.setToSetupPose();
        obj.node.active = mixConfig.visible;
    }

    export function setBtnSprites(btn: Button, sp: BtnSpriteTypes) {
        btn.normalSprite = sp.normal;
        btn.pressedSprite = sp.press;
        btn.hoverSprite = sp.hover;
        btn.disabledSprite = sp.disabled;
    }

    export function isEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    export function ErrorInLoading(char: string) {
        let uiCtrl = Container.getInstance().get("UIController");
        if (uiCtrl?.webViewNode) uiCtrl.webViewNode.active = false;
        EvtCtrl.dispatchEvent(DispatchEventType.All, { eventID: Data.Library.EVENTID[Mode.EVENTTYPE.NOTICE].eReconnect, args: { state: char } });
    }

    export function sendError(code: number) {
        ErrorCs.bklog(code, ErrorCs.Type.ALARM);
        Mode.ErrorInLoading(code.toString());
    }

    export function bindTouchEvents(node: Node, eventHandler: Function) {
        const events = [
            Node.EventType.TOUCH_START,
            Node.EventType.TOUCH_END,
            Node.EventType.TOUCH_CANCEL
        ];
        events.forEach(event => node.on(event, eventHandler, this));
    }

    export function bindScrollEvents(node: Node, eventHandler: Function) {
        const events = [
            ScrollView.EventType.SCROLLING,
            ScrollView.EventType.SCROLL_ENDED,
        ];
        events.forEach(event => node.on(event, eventHandler, this));
    }

    export function checkIndexBound(index: number, maxIndex: number): number {
        return index <= 0 ? 0 : index > maxIndex ? maxIndex : index;
    }

    export function long(credit: ICredit): number {
        let low = credit.low | 0;
        let high = credit.high | 0;
        let unsigned = !!credit.unsigned;
        if (unsigned)
            return ((high >>> 0) * 4294967296) + (low >>> 0);
        return high * 4294967296 + (low >>> 0);
    }

    export function testOverFlow(num: number): boolean {
        if (num >= 1000000000000) {
            ErrorCs.bklog(ErrorCs.Code.Overflow, ErrorCs.Type.ALARM);
            Mode.ErrorInLoading(ErrorCs.Code.Overflow.toString());
            return true;
        }
        return false;
    };

    //產生min到max之間的亂數
    export function getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    type RoundingMode = 'round' | 'floor' | 'ceil';
    /**
     * 取某值到小數點第幾位
     * @param value 值，必須是有限數值
     * @param decimals 第幾位，必須大於0 
     * @param roundingMode 取值方法
     * @returns 
     */
    export function formatDecimal(value: number, decimals: number, roundingMode: RoundingMode = 'round'): number {
        // 驗證參數
        if (!Number.isInteger(decimals) || decimals < 0) {
            throw new Error('小數位數必須是非負整數');
        }

        if (!Number.isFinite(value)) {
            throw new Error('輸入必須是有限數值');
        }

        // 計算縮放因子
        const factor = Math.pow(10, decimals);
        // 根據不同的捨入模式處理數值
        let result: number;
        switch (roundingMode) {
            case 'round':
                result = Math.round(value * factor) / factor;
                break;
            case 'floor':
                result = Math.floor(value * factor) / factor;
                break;
            case 'ceil':
                result = Math.ceil(value * factor) / factor;
                break;
        }
        return result
    }

    //產生連續整數陣列
    export function genSuccessiveArr(start: number, end: number): number[] {
        return Array.from(new Array(end + 1).keys()).slice(start);
    }

    export function getCreditmode(): Mode.CreditMode {
        let mode = Mode.getURLParameter("sm");
        if (mode.length == 0) {
            return Mode.CreditMode.Cent;
        }
        if (mode.substr(0, 1) == '0') {
            return Mode.CreditMode.Cent;
        }
        else if (mode.substr(0, 1) == '1') {
            return Mode.CreditMode.Dollar;
        }
        else if (mode.substr(0, 1) == '2') {
            return Mode.CreditMode.Credit;  //so far do no support
        }
    };

    export function getURLParameter(sParam: string): string {
        if (typeof window["psapi"] !== 'undefined') {
            return window["psapi"].getURLParameter(sParam);
        }
        let sPageURL = window.location.search.substring(1);
        let sURLVariables = sPageURL.split('&');
        for (let i = 0; i < sURLVariables.length; i++) {
            let sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
        return 'eng';
    }

    //#region for spine listener
    /**
     * 監聽spine動畫播完時
     * @param spine spine
     * @param func 播完時callback
     * @param anmName 觸發callback動畫名稱，如沒有預設是null
     */
    export function setSpineCompleteListener(spine: sp.Skeleton, func: Function, anmName: string = null) {
        spine.setCompleteListener((track: sp.spine.TrackEntry) => {
            let condi: boolean = (anmName === null) ? true : track.animation.name === anmName;
            if (condi) {
                spine.setCompleteListener(null);
                func();
            }
        })
    }

    /**
     * 監聽spine動畫觸發事件時
     * @param spine spine
     * @param funcs 觸發事件時callback，需給陣列
     * @param evtNames 事件名稱，需給陣列
     * @param 
     */
    export function setSpineEventListener(spine: sp.Skeleton, funcs: Function[], evtNames: string[]) {
        spine.setEventListener((trackEntry: sp.spine.TrackEntry, event: sp.spine.Event) => {
            for (let i = 0; i < funcs.length; i++) {
                let evtName: string = evtNames[i];
                if (event.data.name === evtName) {
                    funcs[i]();
                }
            }
        })
        this.setSpineCompleteListener(spine, () => { spine.setEventListener(null); });
    }
    //#endregion

    export function delayTimer(delay: number) {
        return new Promise<void>((resolve, reject) => {
            this.scheduleOnce(() => {
                resolve();
            }, delay);
        });
    }
}

export namespace Data {
    @ccclass('Library')
    export class Library {
        // 本地簡易server預設位置
        public static dataLocalPath: string = "http://localhost:9000";
        // GameID不一樣在loadingScene跟SlotController裡都要設定
        public static DEF_GAMEID = "PSS-ON-00166";
        public static RES_LANGUAGE: string = "eng";
        public static localServer: boolean = false;
        public static SPIN_LATE: boolean = false;
        public static DEF_FEATUREBUY_MULTIPLE: number = 1;
        public static DEF_AUTOPLAY_IDLE_TIME: number = 0.3;
        public static DEF_AUTOPLAY_IDLE_TIME_WIN: number = 1;
        public static DIGIMODE: Mode.DigiMode = Mode.DigiMode.DOT;
        public static LuckyStrikeMaxBetting: number = 3;
        public static CHANGE_MULTIPLETIMES_CONDTION: number = 1000;

        public static processPcts: { loadInit: number, preload: number, lanLoadRes: number, setSource: number } = {
            loadInit: 0.2,
            preload: 0.35,
            lanLoadRes: 0.15,
            setSource: 0.3,
        };

        public static EVENTID = {
            [Mode.EVENTTYPE.COMMON]: {
                eNETREADY: "netready",
                eInitGame: "eInitGame",
            },
            // etpReel : 1
            [Mode.EVENTTYPE.REEL]: {
                eREELSTOP: "ereelstop",
                eRESET_STRIP: "eresetstrip",
                eReelRollingEnd: "eReelRollingEnd",
                eReelSymbolDropEnd: "eReelSymbolDropEnd",
                eReelSymbolDropBounceEnd: "eReelSymbolDropBounceEnd",
                eReelDropInEnd: "eReelDropInEnd",
                eReelDropOutEnd: "eReelDropOutEnd",
                eReelEnd: "eReelEnd",   // 可以讓自己滾輪停止後程序處理完自己發送
                eReelPassSpin: "eReelPassSpin",
            },
            [Mode.EVENTTYPE.UI]: {
                eUI_SPIN: "euispin", // spin
                eUI_ClickSpin: "euiClickSpin", // spin btn be clicked
                eUI_ShowSymbolPayTable: "eUIShowSymbolPayTable",
                eUI_SetBtnFeatureBuyVisible: "eUI_SetBtnFeatureBuyVisible",
                eUI_EndJackpot: "eUI_EndJackpot",
                eUI_ShowSpinLittleHint: "eUI_ShowSpinLittleHint",
            },
            [Mode.EVENTTYPE.NOTICE]: {
                eNoBalance: "eNoBalance",
                eReconnect: "eReconnect",
                eTurboHint: "eTurboHint",
            },
            [Mode.EVENTTYPE.ServerResponse]: {
                eServerRecall: "eServerRecall",
            },
            [Mode.EVENTTYPE.Animation]: {
            },
            [Mode.EVENTTYPE.OTHER]: {
                eUpdateLoadingProcess: "eUpdateLoadingProcess",
                eOpenUCoin: "eOpenUCoin",
                eUpdateActivityJackpot: "eUpdateActivityJackpot",
                eLoadActivityJackpotComplete: "eLoadActivityJackpotComplete",
                eUpdateJackPot: "eUpdateJackPot",
            }
        };
        public static NEW_SCORING_WIN = {
            FPS: 50,
            DelaTime: 0.025,
            Range: [0, 15, 30, 50, 100, 200],
            Time: [0, 4, 4, 7, 4, 4, 3]
        };
        public static MQ_RANDOMSYB_WEIGHT = [
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 0, 0], TA: 40000 }, // HIT
            { RSYB: [0, 0, 0, 0, 0, 80, 600, 7, 8, 9], WT: [0, 0, 0, 0, 0, 5000, 5000, 0, 0, 0], TA: 40000 }, // HIT2
            { RSYB: [0, 0, 0, 0, 0, 40, 300, 7, 8, 9], WT: [0, 0, 0, 0, 0, 5000, 5000, 0, 0, 0], TA: 40000 } // HIT3
        ];
        public static FakeRandomData = { RSYB: [10000, 6000, 3000, 2000, 1000, 600, 180, 120, 30, 0], WT: [3, 12, 25, 50, 100, 250, 815, 1750, 3995, 3000], TA: 10000 };

        public static helpTexts: any[] = null;
        public static lanTexts: any = {};
        public static payTable: any = {};
    };

    // jackpot用
    export class Jackpot {
        static jackpotCentIn = [];
        static winByPoolId: number = -1;
        static preJpWinMoney: number = 0;
        static curJpWinMoney: number = 0;
        static preJpPoolId: number = -1;
        static curJpPoolId: number = -1;

        /**換下一盤時，更新Jackpot贏獎資訊 */
        static updateJPWinInfo() {
            this.preJpWinMoney = this.curJpWinMoney;
            this.curJpWinMoney = 0;
            this.preJpPoolId = this.curJpPoolId;
            this.curJpPoolId = -1;
        }
    };

    // 紅包用
    export class RedPacket {
        static luckyDraw = null;
        static redPackCentIn = [];
    }
}

export namespace Model {
    class Number extends Singleton<Number> {
        fontMap = {
            '0': 'AB',
            '1': 'CD',
            '2': 'EF',
            '3': 'GH',
            '4': 'IJ',
            '5': 'KL',
            '6': 'MN',
            '7': 'OP',
            '8': 'QR',
            '9': 'ST',
            '.': 'U',
            ',': 'V'
        };
        setNumber = function (target: Label, number: string, fontMap = this.fontMap): string {
            target.string = "";
            for (let i = 0; i < number.length; i++) {
                target.string += fontMap[number[i]];
            }
            return target.string;
        };
        changeSpStrByNumber(num: number | string): string {
            let numberString = num.toString();
            let returnString = "";
            for (let i = 0; i < numberString.length; i++) {
                returnString += this.fontMap[numberString[i]];
            }
            return returnString;
        };

        numberToCent(number: number): string {
            let strNum: string = number.toString();
            let dot = "."
            let cama = ","
            if (Data.Library.DIGIMODE == Mode.DigiMode.COMMA) {
                dot = ","
                cama = "."
            }
            if (strNum.length > 2) {
                let front = "";
                if (strNum.length > 5) {
                    let check = 0;
                    for (let i = strNum.length - 3; i >= 0; i--) {
                        if (check % 4 == 3) {
                            front = cama + front
                            check = 0;
                        }
                        front = strNum[i] + front;
                        check++;
                    }
                    strNum = (Mode.getCreditmode() === Mode.CreditMode.Dollar) ? front : front + dot + strNum.slice((strNum.length - 2));
                }
                else {
                    strNum = (Mode.getCreditmode() === Mode.CreditMode.Dollar) ? strNum.slice(0, (strNum.length - 2)) : strNum.slice(0, (strNum.length - 2)) + dot + strNum.slice((strNum.length - 2));
                }
            }
            else {
                if (Mode.getCreditmode() === Mode.CreditMode.Dollar) {
                    strNum = "0";
                }
                else {
                    strNum = (strNum.length == 2) ? "0" + dot + strNum : "0" + dot + "0" + strNum;
                }
            }
            return strNum;
        };

        numberToCent2(number: number): string {
            let strNum: string = number.toString();
            let dot = "."
            let cama = ","
            if (Data.Library.DIGIMODE == Mode.DigiMode.COMMA) {
                dot = ","
                cama = "."
            }

            let result: string;

            if (strNum.length > 2) {
                let front = "";
                if (strNum.length > 5) {
                    let check = 0;
                    for (let i = strNum.length - 3; i >= 0; i--) {
                        if (check % 4 == 3) {
                            front = cama + front
                            check = 0;
                        }
                        front = strNum[i] + front;
                        check++;
                    }
                    result = (Mode.getCreditmode() === Mode.CreditMode.Dollar) ? front : front + dot + strNum.slice((strNum.length - 2));
                }
                else {
                    result = (Mode.getCreditmode() === Mode.CreditMode.Dollar) ? strNum.slice(0, (strNum.length - 2)) : strNum.slice(0, (strNum.length - 2)) + dot + strNum.slice((strNum.length - 2));
                }
            }
            else {
                if (Mode.getCreditmode() === Mode.CreditMode.Dollar) {
                    result = "0";
                }
                else {
                    result = (strNum.length == 2) ? "0" + dot + strNum : "0" + dot + "0" + strNum;
                }
            }

            // 如果不是 Dollar 模式，檢查是否需要移除 .00 或 ,00
            if (Mode.getCreditmode() !== Mode.CreditMode.Dollar) {
                if (result.endsWith(dot + "00")) {
                    result = result.slice(0, -3); // 移除 .00 或 ,00
                }
            }

            return result;
        };

        numberToCentK(number: number): string {
            // 先用原本的 numberToCent 轉換
            let centString = this.numberToCent(number);

            // 計算實際的元值（number 是分，除以 100 得到元）
            let dollarValue = number / 100;

            let dot = "."
            if (Data.Library.DIGIMODE == Mode.DigiMode.COMMA) {
                dot = ","
            }

            // 如果元值 >= 1000，轉換為 k 格式
            if (dollarValue >= 1000) {
                let kValue = dollarValue / 1000;

                if (kValue >= 100) {
                    // 100k 以上，不顯示小數
                    return Math.floor(kValue) + "k";
                } else if (kValue >= 10) {
                    // 10k - 99.9k，顯示一位小數
                    return kValue.toFixed(1).replace(".", dot) + "k";
                } else {
                    // 1k - 9.99k，顯示兩位小數
                    return kValue.toFixed(2).replace(".", dot) + "k";
                }
            }

            // 小於 1000 元，返回原本的格式
            return centString;
        }

        numberToCentK2(number: number): string {
            // 先用原本的 numberToCent 轉換
            let centString = this.numberToCent2(number);

            // 計算實際的元值（number 是分，除以 100 得到元）
            let dollarValue = number / 100;

            let dot = "."
            if (Data.Library.DIGIMODE == Mode.DigiMode.COMMA) {
                dot = ","
            }

            // 如果元值 >= 1000，轉換為 k 格式
            if (dollarValue >= 1000) {
                let kValue = dollarValue / 1000;

                if (kValue >= 100) {
                    // 100k 以上，不顯示小數
                    return Math.floor(kValue) + "k";
                } else if (kValue >= 10) {
                    // 10k - 99.9k，顯示一位小數，但如果小數為0則不顯示
                    let formatted = kValue.toFixed(1);
                    if (formatted.endsWith('.0') || formatted.endsWith(',0')) {
                        return Math.floor(kValue) + "k";
                    }
                    return formatted.replace(".", dot) + "k";
                } else {
                    // 1k - 9.99k，顯示兩位小數，但如果小數為0則不顯示
                    let formatted = kValue.toFixed(2);
                    if (formatted.endsWith('.00') || formatted.endsWith(',00')) {
                        return Math.floor(kValue) + "k";
                    } else if (formatted.endsWith('0')) {
                        // 如果只有最後一位是0，則只顯示一位小數
                        return kValue.toFixed(1).replace(".", dot) + "k";
                    }
                    return formatted.replace(".", dot) + "k";
                }
            }

            // 小於 1000 元，返回原本的格式
            return centString;
        }

        


        formatCredit(credit: number, isUseFloor: boolean = true, isUseFont: boolean = false): string {
            if (isUseFloor) credit = Math.floor(credit);
            let formatStr: string = this.numberToCent(credit);
            return isUseFont ? this.changeSpStrByNumber(formatStr) : formatStr;
        }
    }
    export const MdNum = Number.getInstance(Number);

    class TweenAnm extends Singleton<TweenAnm> {
        twFadeIn(time: number): Tween<UIOpacity> {
            return tween().set({ opacity: 0 }).to(time, { opacity: 255 });
        }
        twFadeOut(time: number): Tween<UIOpacity> {
            return tween().set({ opacity: 255 }).to(time, { opacity: 0 });
        }
        twFadeInOut(fadeInTime: number = 0.5, fadeOutTime: number = 0.5, delayTime: number = 0.2): Tween<UIOpacity> {
            return tween().set({ opacity: 0 }).to(fadeInTime, { opacity: 255 }).delay(delayTime).to(fadeOutTime, { opacity: 0 });
        }
        twFadeOutIn(fadeInTime: number = 0.5, fadeOutTime: number = 0.5, delayTime: number = 0.2): Tween<UIOpacity> {
            return tween().set({ opacity: 255 }).to(fadeOutTime, { opacity: 0 }).delay(delayTime).to(fadeInTime, { opacity: 255 });
        }
        twScale(initScale: number, scale: number, time: number = 0.2, easing: TweenEasing = "smooth"): Tween<Node> {
            return tween().set({ scale: v3(initScale, initScale, 1) }).to(time, { scale: v3(scale, scale, 1) }, { easing: easing });
        }
        twScaleOutIn(outScale: number, inScale: number, time: number = 0.2, easing: TweenEasing = "smooth"): Tween<Node> {
            return tween().to(time, { scale: v3(outScale, outScale, 1) }).to(time, { scale: v3(inScale, inScale, 1) }, { easing: easing });
        }
        twScaleJump(): Tween<Node> {
            return tween().set({ scale: v3(1, 1) }).to(0.2, { scale: v3(v3(1.15, 1.15)) }).to(0.1, { scale: v3(v3(0.95, 0.95)) }).to(0.1, { scale: v3(v3(1, 1)) });
        }
        twDefaultShake(): Tween<Node> {
            return tween().to(0.08, { position: v3(0, -5) }).to(0.08, { position: v3(0, 15) }).to(0.13, { position: v3(0, -15) }).to(0.06, { position: v3(0, 15) })
                .to(0.03, { position: v3(0, -15) }).to(0.03, { position: v3(0, 15) }).to(0.06, { position: v3(0, -15) }).to(0.06, { position: v3(0, 15) })
                .to(0.06, { position: v3(0, -15) }).to(0.06, { position: v3(0, 15) }).to(0.06, { position: v3(0, -15) }).to(0.06, { position: v3(0, 15) })
                .to(0.06, { position: v3(0, -15) }).to(0.06, { position: v3(0, 15) }).to(0.06, { position: v3(0, -15) }).to(0.06, { position: v3(0, 15) })
                .to(0.06, { position: v3(0, -15) }).to(0.06, { position: v3(0, 15) }).to(0.06, { position: v3(0, -15) }).to(0.13, { position: v3(0, 10) })
                .to(0.13, { position: v3(0, -8) }).to(0.16, { position: v3(0, 5) }).to(0.16, { position: v3(0, -4) }).to(0.13, { position: v3(0, 2) }).to(0.06, { position: v3(0, 0) });
        }
    }
    export const MdTw = TweenAnm.getInstance(TweenAnm);
}