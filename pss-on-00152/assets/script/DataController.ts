import { _decorator, Component, Label, ModelComponent, Node, find, Color, sp } from 'cc';
import { StateConsole } from './MessageController/StateConsole';
import { ErrorConsole } from './MessageController/ErrorConsole';
import { MathConsole } from './MessageController/MathConsole';
import { GameVariable } from './MessageController/GameVariable';
import { ProtoConsole } from './MessageController/ProtoConsole';
import { BannerController } from './UIController/BannerController';
import { UIController } from './LibCreator/libUIController/UIController';
import { CommonLibScript } from './LibCreator/libScript/CommonLibScript';
import { MultipleController } from './UIController/MultipleController';
import { FeatureBuy } from './UIController/FeatureBuyController';
import { SpreadController } from './UIController/SpreadController';
import { ICredit } from './LibCreator/libScript/Interface/ICredit';
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
        STATE = 3,
        ACTIONS = 4,
        OTHER = 5
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
        K_SHOWREDP = 33,
    };
    export enum SCENE_ID {
        BASE = 0,
        FEATURE0 = 1
    };
    export enum AUTOPLAYMODE {
        AUTOPLAY_DISABLE = 0,
        AUTOPLAY_ALWAYS = 1,
        AUTOPLAY_TILLBONUS = 2,
        AUTOPLAY_Num = 3,
    };
    export enum FIVE_LEVEL_WIN_TYPE {
        big = 0,
        mega = 1,
        super = 2,
        ultra = 3,
        ultimate = 4,
        non = 5
    };
    export enum PAYTYPE {
        K_xFORTEST = -1,
        K_xBET_NORMAL = 0,
        K_xTOTALBET = 1,
        K_xTOTALBET_BONUSTIMES = 2,
        K_xTOTALBETxRANDOM = 3
    };
    export function ShowSpine(obj, trackIndex, anmName, loop, skin) {
        obj.clearTracks();
        obj.setToSetupPose();
        obj.setAnimation(trackIndex, anmName, loop);
        if (skin !== null)
            obj.setSkin(skin);
    }
    interface ShowSpine {
        use: 'set' | 'add' | null,  //使用setAnimation | addAnimation
        trackIndex: number | null,  //動畫軌道 
        anmName: string | null,     //動畫名稱
        loop: boolean | null,       //是否重複撥放
        skin: string | null;        //是否更換皮膚
    }
    export function SpinePlay(obj: sp.Skeleton, config: Partial<ShowSpine> = { use: null, trackIndex: null, anmName: null, loop: null, skin: null }) {
        const { use, trackIndex, anmName, loop, skin } = config;

        if(skin != null) { obj.setSkin(skin) }  //可以只更換皮膚

        if(use == null || trackIndex == null || anmName == null || loop == null) { return; }

        if(!obj.enabled) { obj.enabled = true; }

        if(use == 'set') {
            obj.setAnimation(trackIndex, anmName, loop);
        } else {
            obj.addAnimation(trackIndex, anmName, loop);
        }
    }
    interface ClearSpine {  //針對sp.Skeleton的設置
        trackIndex: number,  //-1代表全部清除
        poseInit: boolean,   //是否初始化骨架
        enabled: boolean     //component enabled
    }
    export function ClearSpine(obj) {
        obj.clearTracks();
        obj.setToSetupPose();
        obj.active = false;
    }

    export function SpineInit(obj: sp.Skeleton, config: Partial<ClearSpine> = { trackIndex: -1, poseInit: true, enabled: false }) {  //config不輸入就代表 清除所有tracks、將骨架初始化、enabled設置為false 
        const { trackIndex, poseInit, enabled } = config;

        trackIndex == -1 ?obj.clearTracks() :obj.clearTrack(trackIndex);

        if(poseInit) { obj.setToSetupPose(); }

        if(enabled == null) { return; }
 
        obj.enabled = enabled;
    }

    export function isEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    export function ErrorInLoading(char: string) {
        if (find("APIConsole")) {
            find("APIConsole/ApiCanvas").addChild(find("Canvas/Notice"));
            find("APIConsole/ApiCanvas").active = true;
            find("APIConsole/ApiCanvas/Notice/BlackBg").active = true;
            find("APIConsole/ApiCanvas/Notice/InfoBg").active = true;
            find("APIConsole/ApiCanvas/Notice/InfoBg/state").getComponent(Label).string = char;
        } else {
            find("Canvas/Notice/BlackBg").active = true;
            find("Canvas/Notice/InfoBg").active = true;
            find("Canvas/Notice/InfoBg/state").getComponent(Label).string = char;
        }
    }

    export function long(credit: ICredit): number {
        let low = credit.low | 0;
        let high = credit.high | 0;
        let unsigned = !!credit.unsigned;
        if (unsigned)
            return ((high >>> 0) * 4294967296) + (low >>> 0);
        return high * 4294967296 + (low >>> 0);
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
}

class REEL_CONFIG_Class {
    REEL_COL = 5;  //5排滾輪
    REEL_ROW = 3;  //每排3個

    /*滾輪立體圖  用來計算每顆滾輪賠率  只計算長寬
    X1234X
    111111
    222222
    333333
    444444
    */
    REEL_COL_FAKE = 5;  
    REEL_ROW_FAKE = 3;

    REEL_COL_LENGTH = 5;  //5是因為每排滾輪上下都各有1個隱藏的滾輪
    REEL_SYMBOL_W = 136;
    REEL_SYMBOL_H = 180;
    REEL_CENTER_X = 360;
    REEL_CENTER_Y = 816;
    REEL_WIDTH = 720;
    REEL_HEIGHT = 700;
    REEL_GAP_X = 4;
    REEL_GAP_Y = 0;
    REEL_TOP_Y = this.REEL_CENTER_Y + this.REEL_SYMBOL_H * 2
}

export namespace Data {
    @ccclass('Library')
    export class Library {
        static DEF_GAMEID = "PSS-ON-00152";
        static RES_LANGUAGE: string = "eng";
        static dataLocalPath: string = "http://localhost:9000";
        static localServer: boolean = true;
        static SPIN_LATE: boolean = true;
        static SPIN_PASS_CHECK: boolean = false;
        static DEF_FEATUREBUY_MULTIPLE: number[] = [];
        static DEF_AUTOPLAY_IDLE_TIME: number = 0.3;
        static DEF_AUTOPLAY_IDLE_TIME_WIN: number = 1;
        static CREDITMODE: Mode.CreditMode = Mode.CreditMode.Cent;
        static DIGIMODE: Mode.DigiMode = Mode.DigiMode.DOT;
        static FIVE_LEVEL_WIN_MULTIPLE = [15, 30, 50, 100, 200];
        static REEL_CONFIG = new REEL_CONFIG_Class();
        static LuckyStrikeMaxBetting: number = 3;
        static AutoBoardColor = new Color(255,255,255,255);
        /**
        * StateConsole作靜態儲存,並於StateConsole檢查有無重複掛載
        */
        static StateConsole: StateConsole = null;

        static MathConsole: MathConsole = null;

        static GameData: GameVariable = null;

        static ErrorData: ErrorConsole = null;

        static ProtoData: ProtoConsole = null;

        static BannerData: BannerController = null;

        static UIcontroller: UIController = null;

        static CommonLibScript: CommonLibScript = null;

        static MultipleController: MultipleController = null;

        static FeatureBuy: FeatureBuy = null;

        static SpreadController: SpreadController = null;

        static EVENTID = [
            // common : 0
            {
                eRESERVED: "ereserved",
                eNETREADY: "netready",
                eCHANGESCENE: "echangescene"
            },
            // etpReel : 1
            {
                eREELCHANGE: "ereelchange", // reel controllor to notify reel layer to update reel symbol
                eREELPOSUPDATE: "ereelposupdate", // reel controllor to notify reel layer to updat reel positon
                eREELFASTPASS: "ereelfastpass",
                eREELSYMBOLCHANGE: "ereelsymbolchange",
                eREELSTOP: "ereelstop",
                eRESET_STRIP: "eresetstrip",
                eREELPOSBACKUPDATE: "ereelbackposupdate",
                eReelStripsAlready: "callSetAllStrips",
            },
            {
                eUI_SPIN: "euispin", // ui notify state controllor  spin be clicked
                eUI_CHANGEBET: "echangebet",
                eUI_CHANGELINE: "echangeline",
                eUI_CHANGERATE: "echangerate",
                eUI_CHANGEAUTO: "echangeauto",
                eUI_OPNE_BETMENU: "eopenbetmenu",
                eUI_OPEN_AUTOMENU: "eopenautomenu",
                eUI_OPEN_HELPMENU: "eopenhelpmenu",
                eUI_ClICK_SOUND_BUTTON: "eclicksoundbtn"
            },
            {
                eSTATECHANGE: "eStateChange" // boardcast to scene state change
            },
            {
                eGLITTER_WIN_LINES: "eglitterwinlines",
                eUPDATE_CREDITWINNUMS: "eupdatecreditwinnums",
                eShowServerMultiplierOptions: "eshowservermultiplieroptions",
                eShowServerSpinsOptions: "eshowserverspinoptions",
                eUPDATE_JPNUMS: "epudatejpnums",
                eCLOSE_JPPERFORM: "eclosejpperform",
                eSHOW_JPPERFORM: "eshowjpperform",
                eREDATD_INTO: "eredatainto,",
                eREADYDATE_REDATD: "ereadydateredate",
                eUPDATE_RETIMENUMS: "epudateretime",
                eCLOSE_REPERFORM: "eclosereperform",
                eINFO_SHOW: "einfoshow",
                eUPDATE_REWINNUMS: "eupdatereeinnums",
                eRedFastOpen: "eredfastopen",
                eUpdateCoinAfterJp: "eUpdateCoinAfterJp",
            },
            // etpOther: end
            {
                eTILEMSSAGE: "etilemessage",
                eDEMOMODECHANGE: "edemomodechange",
                eReserved: "eOtherReserved"
            }
        ];
        static NEW_SCORING_WIN = {
            FPS: 50,
            DelaTime: 0.025,
            Range: [0, 15, 30, 50, 100, 200],
            Time: [0, 4, 4, 7, 4, 4, 3]
        };
        static MQ_RANDOMSYB_WEIGHT = [
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
            { RSYB: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], WT: [5000, 0, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 0], TA: 40000 }, //HIT
        ];
        static yieldLoad = false;
        static yieldCount: number = 0;
        static yieldAdd = function (num: number) {
            this.yieldCount += num ? num : 1;
        }
        static yieldLess = function (num: number) {
            this.yieldCount -= num ? num : 1;
        }
        static FakeRandomData = { RSYB: [10000, 6000, 3000, 2000, 1000, 600, 180, 120, 30, 0], WT: [3, 12, 25, 50, 100, 250, 815, 1750, 3995, 3000], TA: 10000 };
    };
    
    export class Jackpot {
        static jackpotCentIn = [];
        static preJpWinMoney: number = 0;
        static curJpWinMoney: number = 0;
        static preJpPoolId: number = -1;
        static curJpPoolId: number = -1;
        static isOpenJackpot:boolean = false;

        /**換下一盤時，更新Jackpot贏獎資訊 */
        static updateJPWinInfo() {
            this.preJpWinMoney = this.curJpWinMoney;
            this.curJpWinMoney = 0;
            this.preJpPoolId = this.curJpPoolId;
            this.curJpPoolId = -1;
        }
    };

    export class RedPacket {
        static LuckyDraw = null;
        static RedPackCentIn = [];
    }
}

export namespace Model {
    @ccclass('Number') export class Number {
        static BasicFontMap = {
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
        static SetNumber = function (target: Label, number: string, BasicFontMap = Number.BasicFontMap) {
            target.string = "";
            for (let i = 0; i < number.length; i++) {
                target.string += BasicFontMap[number[i]];
            }
            return target.string;
        };
    }
}