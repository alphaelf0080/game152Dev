import { _decorator, Component, Node } from 'cc';
import { Data, Mode } from "../DataController";
const { ccclass, property } = _decorator;
@ccclass('ErrorConsole')
export class ErrorConsole extends Component {
    bklog(str, type?) {
        console.log("*bklog* " + str + " / " + type);
    };

    Code = {
        Unknown: 0,
        NetDisconnect: 1,
        LoginError: 2,
        SpinningTImeOut: 3,
        Overflow: 4,
        RngError: 5,
        SetConfigError: 6,
        SetStripError: 7,
        GetResultError: 8,
        GetOptionsResultError: 9,
        CheckResultError: 10,
        JackpotDataError: 11,
        JackpotServerOffline: 12,
        SetStateError: 13,
        HostError: 14,
        GetMedalResultError: 15,
        OutOfDate: 16,
        ErrorTime: 17
    };

    Type = {
        NOTICE: 0,    //unlock
        WARNING: 1,   //unlock
        ALARM: 2,      //lock
        INSUFFICIENT_BALANCE: 3,
        INSUFFICIENT_BALANCE_DO_NOT_LOCK: 4
    };


    protected onLoad(): void {
        if (Data.Library.ErrorData === null) {
            Data.Library.ErrorData = this;
        }
        else {
            this.destroy();
        }
    }
}