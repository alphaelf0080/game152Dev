import { _decorator, Component, find, instantiate, Node } from 'cc';
import { Data, Mode } from '../DataController';
const { ccclass, property } = _decorator;
let MessageConsole: Node = null;
@ccclass('MathConsole')
export class MathConsole extends Component {
    start() {
        MessageConsole = find("MessageController");
        this.WinData1 = instantiate(WinData);
        this.WinData_Bonus1 = instantiate(WinData);
    }

    protected onLoad(): void {
        Data.Library.MathConsole = this;
    }

    swapWinData() {
        this.WinData_Bonus1._wintotalcredit = this.WinData1._wintotalcredit;
    }

    getWinData() {
        if (Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE) {
            return this.WinData1;
        } else {
            return this.WinData_Bonus1;
        }
    }

    ResetWinData() {
        this.WinData1._wintype = -1;
        this.WinData1._triggerTimes = 0;
        this.WinData_Bonus1._wintype = -1;
        this.WinData_Bonus1._triggerTimes = 0;
    }

    getStriptable(id: string) {
        for (let i = 0; i < this.Striptables.length; i++) {
            if (this.Striptables[i]._id == id) {
                return this.Striptables[i];
            }
        }
        return null;
    }

    checkBonusData() {
        let WinData = this.getWinData();
        this.NextModuleid = WinData._nextmodule;
        let triggerrounds = WinData._triggerTimes;
        if (triggerrounds && triggerrounds > 0) {
            WinData._wintype = Mode.PAYTYPE.K_xTOTALBET_BONUSTIMES;
            if (Data.Library.StateConsole.FeatureGameCurTotalspins == Data.Library.StateConsole.FeatureMaxTimes) {
                Data.Library.StateConsole.FeatureTriggerTimes = 0;
                return;
            }
            if ((Data.Library.StateConsole.FeatureGameCurTotalspins + triggerrounds) > Data.Library.StateConsole.FeatureMaxTimes) {
                triggerrounds = Data.Library.StateConsole.FeatureMaxTimes - Data.Library.StateConsole.FeatureGameCurTotalspins;
            }
            Data.Library.StateConsole.FeatureGameCurTotalspins += triggerrounds;
            Data.Library.StateConsole.FeatureTriggerTimes = triggerrounds;
        }
    }

    WinData1;
    WinData_Bonus1;
    PayOfPos = [];
    Paytables = [];
    Striptables = [];
    StripTable = {
        _id: "non",
        _strips: [],
        _strips_lenght: [],
        setStrips: function (strips) {
            this._strips = strips;
            this._strips_lenght = [];
            for (let i = 0; i < this._strips.length; i++) {
                this._strips_lenght.push(this._strips[i].length);
            }
        }
    };
    CurModuleid = "BS";
    NextModuleid = "BS";
    LastBsResult = {
        Reel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        TotalWin: 0
    }
}

let WinData = {
    _rng: [],
    _winpos: [],
    _winlinenolist: [],
    _winlinesyblist: [],
    _winlinecreditlist: [],
    _winlinetypelist: [],
    _winlinemulitplierlist: [],
    _winTriggerRounds: [],
    _symbolmap: [],
    _wintype: 0,
    _nextmodule: "non",
    _scatterWin: 0,
    _wintotalcredit: 0,
    _mulitplier: 1,
    _scatter_sound: [-1, -1, -1, -1, -1, -1],
    _slowmotion_flag: [0, 0, 0, 0, 0, 0, 0],
    _dropslowmotionflag: false,
    _payOfPos: [],
    _reSpinTimes: [],
    _symbolmapPattern: [],
    _triggerTimes: 0,
    clearall: function () {
        this._rng = [];
        this._winpos = [];
        this._winlinenolist = [];
        this._winlinesyblist = [];
        this._winlinecreditlist = [];
        this._winTriggerRounds = [];
        this._winlinetypelist = [];
        this._winlinemulitplierlist = [];
        this._wintype = -1;
        this._nextmodule = "non";
        this._wintotalcredit = 0;
        this._mulitplier = 1;
        this._scatter_sound = [-1, -1, -1, -1, -1, -1];
        this._slowmotion_flag = [0, 0, 0, 0, 0, 0, 0];
        this._dropslowmotionflag = false;
        this._payOfPos = [];
        this._reSpinTimes = [];
        this._symbolmapPattern = [];
        this._triggerTimes = 0;
    }
};