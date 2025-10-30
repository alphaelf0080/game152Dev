import { Color } from "cc";
import { CreditMode, DigiMode } from "./LibEnum";
import { StateConsole } from "../../MessageController/StateConsole";
import { MathConsole } from "../../MessageController/MathConsole";
import { GameVariable } from "../../MessageController/GameVariable";
import { FeatureBuy } from "../../UIController/FeatureBuyController";
import { ErrorConsole } from "../../MessageController/ErrorConsole";
import { ProtoConsole } from "../../MessageController/ProtoConsole";
import { BannerController } from "../../UIController/BannerController";
import { CommonLibScript } from "../libScript/CommonLibScript";
import { UIController } from "../libUIController/UIController";
import { SpreadController } from "../../SpreadController";
import { AudioController } from "db://assets/Sound/audiocontroller/script/AudioController";

class REEL_CONFIG_Class {
    REEL_COL = 7;
    REEL_ROW = 5;

    REEL_COL_FAKE = 6;
    REEL_ROW_FAKE = 6;

    REEL_ROW_LENGTH = 7;
    REEL_SYMBOL_W = 120;
    REEL_SYMBOL_H = 100;

    REEL_CENTER_X = 360;
    REEL_CENTER_Y = 815;

    REEL_WIDTH = 720;
    REEL_HEIGHT = 700;

    REEL_GAP_X = 0;
    REEL_GAP_Y = 0;
}

export class Library {
    static DEF_GAMEID = "";

    static RES_LANGUAGE: string = "eng";
    static dataLocalPath: string = "http://localhost:9000";
    static localServer: boolean = false;
    static SPIN_LATE: boolean = false;
    static SPIN_PASS_CHECK: boolean = false;
    static isNewAudio: boolean = true;
    static DEF_FEATUREBUY_MULTIPLE;
    static DEF_AUTOPLAY_IDLE_TIME: number = 0.3;
    static DEF_AUTOPLAY_IDLE_TIME_WIN: number = 1;
    static CREDITMODE: CreditMode = CreditMode.Cent;
    static DIGIMODE: DigiMode = DigiMode.DOT;
    static FIVE_LEVEL_WIN_MULTIPLE = [8, 15, 30, 50, 100];
    static REEL_CONFIG = new REEL_CONFIG_Class();
    static LuckyStrikeMaxBetting: number = 5;
    static USE_LOCAL_FINISH_BTN: boolean = true;

    static StateConsole: StateConsole = null;
    static MathConsole: MathConsole = null;
    static GameData: GameVariable = null;
    static ErrorData: ErrorConsole = null;
    static ProtoData: ProtoConsole = null;
    static BannerData: BannerController = null;
    static UIcontroller: UIController = null;
    static CommonLibScript: CommonLibScript = null;
    static FeatureData: FeatureBuy = null;
    static SpreadData: SpreadController = null;
    static AudioController: AudioController = null;

    static AutoBoardColor = new Color(255, 230, 161, 255);
    static BetPageColor = "#ffe7a1";
    static BetPageTotalLayerColor1 = new Color(255, 231, 161, 255);
    static BetPageTotalLayerColor2 = new Color(255, 231, 161, 128);
    static BetPageTotalLayerColor3 = new Color(255, 231, 161, 64);

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
            eREELPOSBACKUPDATE: "ereelbackposupdate"
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
        Range: [0, 8, 15, 25, 50, 100],
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
    static MultTrigger = {
        StartMult: 1,
        EveryMult: [],
    }

    static Jackpot = class {
        static jackpotCentIn = [];
        static preJpWinMoney: number = 0;
        static curJpWinMoney: number = 0;
        static preJpPoolId: number = -1;
        static curJpPoolId: number = -1;
        static isOpenJackpot: boolean = false;

        /**換下一盤時，更新Jackpot贏獎資訊 */
        static updateJPWinInfo() {
            this.preJpWinMoney = this.curJpWinMoney;
            this.curJpWinMoney = 0;
            this.preJpPoolId = this.curJpPoolId;
            this.curJpPoolId = -1;
        }
    };

    static RedPacket = class {
        static LuckyDraw = null;
        static RedPackCentIn = [];
    }
};