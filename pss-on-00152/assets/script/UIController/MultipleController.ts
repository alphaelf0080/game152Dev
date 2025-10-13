import { _decorator, Component, Node, Label, Animation, sp, UITransform, Vec2, Vec3, find, AudioSource } from 'cc';
import { AllNode } from '../LibCreator/libScript/CommonLibScript';
import { Data, Mode } from '../DataController';

import { FontMapController } from '../FontMapController';

const { ccclass, property } = _decorator;

let DropSymbolMap = null;

@ccclass('MultipleController')
export class MultipleController extends Component {
    static Instance: MultipleController = new MultipleController();
    @property({ type: sp.Skeleton }) BkgAnmFs;
    _multipleNode = null;
    _multipleNumX = null;
    _multipleNumAnmOnes = null;
    _multipleNumAnmTen = null;
    _multipleNumAnmHundred = null;
    _multipleAnm = null;
    _multipleNumAnmArr = [];

    mulNum: { [key: string]: string } = null;


    protected onLoad(): void {
        Data.Library.MultipleController = this;
        MultipleController.Instance = this;
    }

    start() {
        this._multipleNode = AllNode.Data.Map.get("Multiple");
        this._multipleAnm = AllNode.Data.Map.get("MultipleAnm");
        this._multipleNumX = AllNode.Data.Map.get("MultipleNum");

        this._multipleNumAnmOnes = AllNode.Data.Map.get("MultipleNumAnmOnes");
        this._multipleNumAnmTen = AllNode.Data.Map.get("MultipleNumAnmTen");
        this._multipleNumAnmHundred = AllNode.Data.Map.get("MultipleNumAnmHundred");
        this._multipleNumAnmArr.push(this._multipleNumAnmOnes);
        this._multipleNumAnmArr.push(this._multipleNumAnmTen);
        this._multipleNumAnmArr.push(this._multipleNumAnmHundred);

        let mul = new FontMapController();
        this.mulNum = mul.MultipleNumInit();

        DropSymbolMap = Data.Library.GameData.DropSymbolMap;
    }

    update(deltaTime: number) { }

    HandleBroadcast(data: any) {
        switch(data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY: break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                this.HandleStateChange(data.EnventData);
                break;

            default: break;
        }
    }

    HandleStateChange(state) {
        this.BkgAnmFs;
        switch (state) {
            case Mode.FSM.K_FEATURE_WAIT_START: break;
            case Mode.FSM.K_SPIN: break;

            case Mode.FSM.K_FEATURE_SPIN:
                if (Data.Library.MathConsole.getWinData()._wintotalcredit&&this.BkgAnmFs.getCurrent(1)&&this.BkgAnmFs.getCurrent(1).animation.name=="multiple_open") {
                    this.ShowMultiple(false);
                }
                break;

            case Mode.FSM.K_EXPEND:
            case Mode.FSM.K_FEATURE_EXPEND: break;

            case Mode.FSM.K_DROP:
            case Mode.FSM.K_FEATURE_DROP: break;

            case Mode.FSM.K_FEATURE_SHOWWIN: break;

            case Mode.FSM.K_FEATURE_CHEKRESULT:
                //Data.Library.MathConsole.getWinData()._wintotalcredit在斷線最後一把沒有值時會干擾
                if (this.BkgAnmFs.getCurrent(1)&&this.BkgAnmFs.getCurrent(1).animation.name=="multiple_open") {
                    this.ShowMultiple(false);
                }
                break;
        }
    }

    ShowMultiple(occur: boolean) {
        if(occur) {
            this._multipleNumX.active = true;
            this._multipleNumX.scale = 0;
            this._multipleNumX.getComponent(Animation).play('ScaleJumpWinTxt');
            AllNode.Data.Map.get("MultiplierBack").getComponent(AudioSource).play();
        } else {
            this._multipleNumX.getComponent(Animation).play('scaleOut');
        }
    }

    SetMultipleNum(num) {
        let numSt = num.toString();
        let str = this.mulNum['x'];
        for(let i = 0; i < numSt.length; i++) {
            str += this.mulNum[numSt[i]];
        }
        this._multipleNumX.getComponent(Label).string = str;
    }
}