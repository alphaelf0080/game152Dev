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
        K_SHOW_MULT = 29,
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