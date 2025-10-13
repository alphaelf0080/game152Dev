import { _decorator } from 'cc';
import { Singleton } from './Singleton';
import { logCtrl, LogType } from '../Controller/LogController';

class ErrorConsole extends Singleton<ErrorConsole> {
    public bklog(str, type?) {
        console.log("*bklog* " + str + " / " + (type != undefined ? type : ""));
    };

    public Code = {
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

    public Type = {
        NOTICE: 0,    //unlock
        WARNING: 1,   //unlock
        ALARM: 2,      //lock
        INSUFFICIENT_BALANCE: 3,
        INSUFFICIENT_BALANCE_DO_NOT_LOCK: 4
    };
}
export const ErrorCs = ErrorConsole.getInstance(ErrorConsole);