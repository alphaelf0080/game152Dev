import { _decorator, Component, Node } from 'cc';
import { logCtrl, LogType } from './LogController';
import { Singleton } from '../Common/Singleton';

export enum DispatchEventType {
    BS = "BS",
    FS = "FS",
    All = "All",
}
class EventController extends Singleton<EventController> {

    private _bsArrary: any[] = [];
    private _fsArrary: any[] = [];
    private _allArrary: any[] = [];

    public registerObserver(type: DispatchEventType, node: Node) {
        if (type === DispatchEventType.BS || type === DispatchEventType.All) this._bsArrary.push(node);
        else if (type === DispatchEventType.FS || type === DispatchEventType.All) this._fsArrary.push(node);
        this._allArrary.push(node);
    }

    public unRegisterObserver(type: DispatchEventType, node: Node) {
        let arr: any[] = (type === DispatchEventType.All) ? this._allArrary : (type === DispatchEventType.FS) ? this._fsArrary : this._bsArrary;
        let index: number = arr.indexOf(node);
        arr.splice(index, 1);
    }

    public dispatchEvent(type: DispatchEventType, data: any) {
        let arr = (type === DispatchEventType.All) ? this._allArrary : (type === DispatchEventType.FS) ? this._fsArrary : this._bsArrary;
        for (let i = 0; i < arr.length; i++) {
            let Coms = arr[i].getComponents(Component);
            for (let j = 0; j < Coms.length; j++) {
                if (Coms[j].handleBroadcast) {
                    Coms[j].handleBroadcast(data);
                }
            }
        }
        logCtrl.log(LogType.At,"EventController GET Event : " + data.eventID + " / type : " + type)
    }
}
export const EvtCtrl = EventController.getInstance(EventController);


