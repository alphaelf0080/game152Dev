import { _decorator, Button, Component, Label, Node, Sprite, UIOpacity } from 'cc';
import { DispatchEventType, EvtCtrl } from './EventController';
import { Data, Mode, Model } from './DataController';
import { APIController } from '../../libLoadingInit/APIController';
import { Container } from '../Obj/Container';
import { IDependency } from '../Interface/IDependency';

/**
 * root節點在場景要開啟
 */

const { ccclass, property } = _decorator;

@ccclass('NoticeController')
export class NoticeController extends Component implements IDependency {
    @property(Button) btnBlack: Button = null;
    @property(Node) turboOnHint: Node = null;
    @property(Node) turboOffHint: Node = null;

    @property({ group: "InfoBg", type: Node, displayName: "InfoBg" }) infoBg: Node = null;
    @property({ group: "InfoBg", type: Label, displayName: "InfoBgTxt" }) infoBgTxt: Label = null;
    @property({ group: "InfoBg", type: Button, displayName: "InfoBgBtnCheck" }) infoBgBtnCheck: Button = null;
    @property({ group: "InfoBg", type: Label, displayName: "InfoBgState" }) infoBgState: Label = null;

    @property({ group: "InfoNoBalance", type: Node, displayName: "InfoNoBalance" }) infoNoBalance: Node = null;
    @property({ group: "InfoNoBalance", type: Button, displayName: "InfoNoBalanceBtnCheck" }) infoNoBalanceBtnCheck: Button = null;
    @property({ group: "InfoNoBalance", type: Label, displayName: "InfoNoBalanceTxt" }) infoNoBalanceTxt: Label = null;

    private get _apiCtrl(): APIController {
        return Container.getInstance().get("APIController");
    }

    protected onLoad(): void {
        EvtCtrl.registerObserver(DispatchEventType.All, this.node);
        this.registerDep();
        this._openListener();
    }

    registerDep(): void {
        Container.getInstance().register("NoticeController", this);
    }

    protected onDestroy(): void {
        this._closeListener();
    }

    private _openListener() {
        this.infoBgBtnCheck.node.on(Button.EventType.CLICK, this._infoBgCheck, this);
        this.infoNoBalanceBtnCheck.node.on(Button.EventType.CLICK, this._infoNoBalanceCheck, this);
    }

    private _closeListener() {
        if (this.infoBgBtnCheck.isValid) this.infoBgBtnCheck.node.off(Button.EventType.CLICK, this._infoBgCheck, this);
        if (this.infoNoBalanceBtnCheck.isValid) this.infoNoBalanceBtnCheck.node.off(Button.EventType.CLICK, this._infoNoBalanceCheck, this);
    }

    setLanText() {
        const langStrs = Data.Library.lanTexts;
        this.infoBgTxt.string = langStrs.reconnetMsg;
        this.infoNoBalanceTxt.string = langStrs.insufficientBalance;
    }

    handleBroadcast(data: any) {
        switch (data.eventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.NOTICE].eReconnect:
                this._setInfoBgVisible(true);
                this._setInfoState(data.args.state);
                break;
            case Data.Library.EVENTID[Mode.EVENTTYPE.NOTICE].eNoBalance:
                this._setInfoNoBalanceVisible(true);
                break;
            case Data.Library.EVENTID[Mode.EVENTTYPE.NOTICE].eTurboHint:
                this._setTurboHintVisible(data.args.isTurboOn);
                break;
        }
    }

    private _setInfoBgVisible(visible: boolean) {
        this.btnBlack.node.active = visible;
        this.infoBg.active = visible;
    }

    private _setInfoNoBalanceVisible(visible: boolean) {
        this.btnBlack.node.active = visible;
        this.infoNoBalance.active = visible;
    }

    private _setTurboHintVisible(isTurboOn: boolean) {
        this.turboOnHint.active = isTurboOn;
        this.turboOffHint.active = !isTurboOn;
        let showNode: Node = isTurboOn ? this.turboOnHint : this.turboOffHint;
        Model.MdTw.twFadeInOut(0.5, 0.5, 0.3).clone(showNode.getComponent(UIOpacity)).start();
    }

    private _setInfoState(state: string) {
        this.infoBgState.string = state;
    }

    private _infoBgCheck() {
        if (this._apiCtrl) this._apiCtrl.goHome();
    }

    private _infoNoBalanceCheck() {
        this._setInfoNoBalanceVisible(false);
    }
}

