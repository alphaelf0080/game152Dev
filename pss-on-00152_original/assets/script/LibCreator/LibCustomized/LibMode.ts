import { sp, find, Label } from "cc";
import { CreditMode } from "./LibEnum";
import { Library } from "./LibData";


//#region for spine
/**
 * 監聽spine動畫播完時
 * @param spine spine
 * @param func 播完時callback
 * @param anmName 觸發callback動畫名稱
 */
export function setSpineCompleteListener(spine: sp.Skeleton, func: Function, anmName?: string) {
    spine.setCompleteListener((track: sp.spine.TrackEntry) => {
        let condi: boolean = !anmName || track?.animation?.name === anmName;
        if (condi) {
            spine.setCompleteListener(null);
            func();
        }
    })
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

    if (skin != null) { obj.setSkin(skin) }  //可以只更換皮膚

    if (use == null || trackIndex == null || anmName == null || loop == null) { return; }

    if (!obj.enabled) { obj.enabled = true; }

    if (use == 'set') {
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
export function SpineInit(obj: sp.Skeleton, config: Partial<ClearSpine> = { trackIndex: -1, poseInit: true, enabled: false }) {  //config不輸入就代表 清除所有tracks、將骨架初始化、enabled設置為false 
    const { trackIndex, poseInit, enabled } = config;

    if (trackIndex != null) {
        trackIndex == -1 ? obj.clearTracks() : obj.clearTrack(trackIndex);
    }

    if (poseInit) { obj.setToSetupPose(); }

    if (enabled != null) {
        obj.enabled = enabled;
    }
}

//#region for Json
export function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}


export function getCreditmode(): CreditMode {
    let mode = getURLParameter("sm");
    if (mode.length == 0) {
        return CreditMode.Cent;
    }
    if (mode.substr(0, 1) == '0') {
        return CreditMode.Cent;
    }
    else if (mode.substr(0, 1) == '1') {
        return CreditMode.Dollar;
    }
    else if (mode.substr(0, 1) == '2') {
        return CreditMode.Credit;  //so far do no support
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


export function ErrorInLoading(char: string) {
    if (find("APIConsole")) {
        find("APIConsole/ApiCanvas").addChild(find("Canvas/Notice"));
        if (find("APIConsole/ApiCanvas/WebView")) {
            find("APIConsole/ApiCanvas").addChild(find("APIConsole/ApiCanvas/WebView"));
        }
        else {
            find("APIConsole/ApiCanvas").addChild(find("Canvas/WebView"));
        }
        find("APIConsole/ApiCanvas/WebView").setSiblingIndex(0);
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

export function NumberToCent(number: number): string {
    number = number / 100;
    let numberStr = number.toFixed(2);
    numberStr = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');  // 添加逗号分隔符

    if (Library.CREDITMODE == CreditMode.Dollar) {
        return numberStr.slice(0, -3);
    } else {
        return numberStr;  // 添加逗号分隔符
    }
}


/**
 * 將數字轉換為下注金額格式顯示
 * @param value 輸入數字（通常是分為單位）
 * @returns 格式化後的金額字串
 * @example
 * NumberToBetNum(1) -> "0.01"
 * NumberToBetNum(25) -> "0.25" 
 * NumberToBetNum(1000) -> "10.00"
 * NumberToBetNum(150000) -> "1,500.00"
 */
export function NumberToBetNum(value: number | string): string {
    const numberStr = value.toString();
    const numValue = parseInt(numberStr, 10);

    if (numberStr.length > 2) {
        // 大於 99：轉為元並加千分位逗號
        const amount = (numValue / 100).toFixed(2);
        return parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        // 小於等於 99：轉為小數格式
        return (numValue / 100).toFixed(2);
    };
}


interface ICredit {
    high: number;
    low: number;
    unsigned: boolean;
}
export function long(credit: ICredit): number {
    let low = credit.low | 0;
    let high = credit.high | 0;
    let unsigned = !!credit.unsigned;
    if (unsigned)
        return ((high >>> 0) * 4294967296) + (low >>> 0);
    return high * 4294967296 + (low >>> 0);
}


export function TestOverFlow(num: number) {
    if (num >= 1000000000000) {

        Library.ErrorData.bklog(Library.ErrorData.Code.Overflow, Library.ErrorData.Type.ALARM);
        ErrorInLoading(Library.ErrorData.Code.Overflow.toString());
        return false;
    }
    return true;
};