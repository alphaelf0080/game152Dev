import { _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { Singleton } from '../Common/Singleton';

export enum LogType {
    Normal,
    At,
    Trace,
}

class LogController extends Singleton<LogController> {
    log(type: LogType = LogType.Normal, message?: any, ...optionalParams: any[]) {
        if (DEBUG) {
            switch (type) {
                case LogType.Normal:
                default:
                    console.log(message, ...optionalParams);
                    break;
                case LogType.At:
                    let e = new Error();
                    let place = e.stack.split('\n')[2].split("(")[0];
                    console.log(place + " => \n" + message, ...optionalParams);
                    break;
                case LogType.Trace:
                    console.trace(message, ...optionalParams)
            }
        }
    }
}
export const logCtrl = LogController.getInstance(LogController);

