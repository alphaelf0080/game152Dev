import { _decorator, Component, find, Label, LabelAtlas, sp, Node, SpriteFrame, AudioSource, UITransform, Sprite } from 'cc';
import { Data, Mode } from '../DataController';

import { FontMapController } from '../FontMapController';

const { ccclass, property } = _decorator;

let MessageConsole: Node = null;
let DropSymbolMap = null;

@ccclass('SpreadController')
export class SpreadController extends Component {
    @property({ type: SpriteFrame }) spreadPics: Array<SpriteFrame> = [];

    @property({ type: LabelAtlas }) ComboNum1: LabelAtlas

    @property({ type: LabelAtlas }) ComboNum2: LabelAtlas

    @property({ type: LabelAtlas }) ComboNum3: LabelAtlas
    
    _spread = null;
    _lineNum = null;
    _lineSpread = null;
    _node1 = null;
    _comboLightAnm = null;
    _comboSparkAnm = null;
    _comboNumBeginAnm = null;
    _comboHitBeginAnm = null;
    _comboGlowAnm = null;
    _lineCount = 0;
    _showCombo: boolean = true;
    _startCount: boolean = true;
    _startLight: boolean = false;
    _linkLevel = "a";

    _comboNum: { [key: string]: string } = null;


    start() {
        MessageConsole = find("MessageController");
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;
        this._node1 = find("Canvas/BaseGame/Layer/Shake/Spread/Node1");
        this._lineNum = find("Canvas/BaseGame/Layer/Shake/Spread/Node1/LineNum");
        this._lineSpread = find("Canvas/BaseGame/Layer/Shake/Spread/Node1/LineSpread");
        this._spread = find("Canvas/BaseGame/Layer/Shake/Spread/Spread");

        let num = new FontMapController;
        this._comboNum = num.ComboNumInit();

        this.initLineNum(this.ComboNum1);

        this._comboLightAnm = this.node.getChildByName("AnmNode").getChildByName("ComboLightAnm").getComponent(sp.Skeleton);
        this._comboLightAnm.setEventListener(function (trackIndex, event) {
            if (event.data.name === "light_in") {
                if (this._startLight === true) {
                    this._startLight = false;
                    this.handleSpineAnm(this._comboLightAnm, null, 0, "light", false);
                }
            }
        })

        let self = this;
        this._comboSparkAnm = this.node.getChildByName("AnmNode").getChildByName("ComboSparkAnm").getComponent(sp.Skeleton);
        this._comboNumBeginAnm = this.node.getChildByName("AnmNode").getChildByName("ComboNumBeginAnm").getComponent(sp.Skeleton);
        this._comboHitBeginAnm = this.node.getChildByName("AnmNode").getChildByName("ComboHitBeginAnm").getComponent(sp.Skeleton);
        this._comboGlowAnm = this.node.getChildByName("AnmNode").getChildByName("ComboGlowAnm").getComponent(sp.Skeleton);
        this._comboGlowAnm.setCompleteListener(function (trackIndex, event) {
            if (self._comboGlowAnm._state.tracks[0] && self._comboGlowAnm._state.tracks[0].animation.name == "end") {
                self._lineNum.getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(1);;
                self._node1.active = false;
            }
        })
    }

    protected onLoad(): void {
        Data.Library.SpreadController = this;
    }

    update(deltaTime: number) {
        if (this._node1.active) {
            let width = this._lineNum.getComponent(UITransform).width - this._lineSpread.getComponent(UITransform).width;
            this._node1.setPosition(width / 3, 577);
        }
    }

    HandleBroadcast(data: any) {
        switch(data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY: break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                this.HandleStateChange(data.EnventData);
                this._spread.getComponent(Sprite).spriteFrame = this.spreadPics[Data.Library.StateConsole.CurScene === Mode.SCENE_ID.BASE ? 0 : 1];
                break;

            default: break;
        }
    }

    HandleStateChange(state): void {
        switch (state) {
            case Mode.FSM.K_SPIN:
            case Mode.FSM.K_FEATURE_SPIN:
            case Mode.FSM.K_FEATURE_CHEKRESULT:
                if (this._lineCount) {
                    this.handleSpineAnm(this._comboNumBeginAnm, "txt", 0, "num_end", false);
                    this.handleSpineAnm(this._comboHitBeginAnm, "txt", 0, "hit_end", false);
                    this.handleSpineAnm(this._comboGlowAnm, this._linkLevel, 0, "end", false);
                    this._spread.active = true;
                }
                this._lineCount = 0;
                this._showCombo = true;
                this._linkLevel = "";
                break;
            case Mode.FSM.K_DROP:
            case Mode.FSM.K_FEATURE_DROP:
                this._startCount = true;
                break;
            default:
                break;
        }
    }

    handleSpineAnm(obj, skin, tracks, anm, loop) {
        obj.clearTracks();
        obj.setToSetupPose();
        if (skin !== null)
            obj.setSkin(skin);
        obj.addAnimation(tracks, anm, loop);
        obj.active = true;
    }

    initLineNum(numpng) {
        this._lineNum.getComponent(Label).font = numpng;
        this._lineSpread.getComponent(Label).font = numpng;
        this._lineSpread.getComponent(Label).string = this._comboNum["s"];
    }

    countLinkNum() {
        this._spread.active = false;
        this._node1.active = true;
        let lineArray = [0, 0, 0, 0, 0, 0];

        DropSymbolMap.WinPos[DropSymbolMap.CurrIndex].forEach(function (e) {
            let x = Math.floor(e / 10);
            lineArray[x]++;
        });

        lineArray = lineArray.filter(function (e) { return e !== 0 });

        let i = 0;

        this.schedule(() => {
            this._lineCount += lineArray[i];

            if (this._lineCount > 12 && this._linkLevel !== "c") {
                this.initLineNum(this.ComboNum3);
                this._linkLevel = "c";
                this.showLevelUp(this._linkLevel);
                find("AudioController/Sparks/SparkB").getComponent(AudioSource).play();
            } else if (this._lineCount > 6 && this._lineCount <= 12 && this._linkLevel !== "b") {
                this.initLineNum(this.ComboNum2);
                this._linkLevel = "b";
                this.showLevelUp(this._linkLevel);
                find("AudioController/Sparks/SparkC").getComponent(AudioSource).play();
            } else if (this._lineCount <= 6 && this._linkLevel !== "a") {
                this.initLineNum(this.ComboNum1);
                this._linkLevel = "a";
                this.showLevelUp(this._linkLevel);
            }

            this._lineNum.getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(this._lineCount);
            this.handleSpineAnm(this._comboLightAnm, this._linkLevel, 0, "light", false);
            this.handleSpineAnm(this._comboNumBeginAnm, "txt", 0, "num_loop", false);
            this.handleSpineAnm(this._comboHitBeginAnm, "txt", 0, "hit_loop", false);
            i++;

            if (i == lineArray.length) {
                this._comboNumBeginAnm.addAnimation(0, "num_result", false);
                this._comboHitBeginAnm.addAnimation(0, "hit_loop", false);
                this._comboNumBeginAnm.setSkin("txt");
                this._comboHitBeginAnm.setSkin("txt");
            }
            if (i === 1) {
                this._startLight = true;
            }
        }, 0.1, lineArray.length - 1)
    }

    showLevelUp(level) {
        this.handleSpineAnm(this._comboGlowAnm, level, 0, "glow", true);
        if (level !== "a") {
            this.handleSpineAnm(this._comboSparkAnm, level, 0, "sparks", false);
        }
    }
}


