import { _decorator, Component, Sprite, Node, find, input, Input, sp, EventTouch, Size, AudioSource, Vec3, log, Color, Animation, easing, instantiate, SpriteFrame, Vertex, Vec2, Label, UITransform, Skeleton } from 'cc';
import { ErrorConsole } from '../MessageController/ErrorConsole';
import { SpreadController } from '../UIController/SpreadController';
import { ReelController } from './ReelController';
import { Data, Mode } from '../DataController';
const { ccclass, property } = _decorator;

let MessageConsole: Node = null;
let ERRORConsole: ErrorConsole = null;
let PayTable: Node = null;
let PaySymbolTable: Node = null;
let PaySymbolNum: Node = null;
let PaySymbolNum1: Node = null;
let PaySymbolBlock: Node = null;
let SpreadControll: SpreadController = null;
let DropSymbolMap = null;

@ccclass('Symbol')
export class Symbol extends Component {
    @property({ type: SpriteFrame }) SymPic = [];

    @property({ type: SpriteFrame }) BigSymPic = [];

    @property({ type: SpriteFrame }) GoldenSymPic = [];

    @property({ type: SpriteFrame }) BlurPic = [];

    @property({ type: sp.SkeletonData }) SpineAtlas = [];

    @property({ type: SpriteFrame }) SymbolPayTable = [];

    _posFAandBonus = [];
    _posNormal = [];

    ordIdx = 0;
    reelIndex = 0;
    reelCol = 0;
    SymIndex = 0;

    maskNode = null;
    anmNode = null;
    scatterAnmNode = null;

    changeSp = null;

    _unshowBonusIndex: number[] = [];


    start() {
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;

        MessageConsole = find("MessageController");
        ERRORConsole = MessageConsole.getComponent(ErrorConsole);
        SpreadControll = find("Canvas/BaseGame/Layer/Shake/Spread").getComponent(SpreadController);
        PayTable = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolPayTable");
        PaySymbolTable = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolPayTable/symbolPic");
        PaySymbolNum = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolPayTable/helpNumber");
        PaySymbolNum1 = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolPayTable/helpNumber1");
        PaySymbolBlock = find("Canvas/BaseGame/Layer/Shake/Animation/PaySymbolBlack");

        this.node.getChildByName("Anm").getComponent(sp.Skeleton).setEventListener((trackIndex, event) => {
            if (event.data.name === "combo") {
                if (SpreadControll._showCombo) {
                    SpreadControll._showCombo = false;
                    SpreadControll.handleSpineAnm(SpreadControll._comboLightAnm, "a", 0, "light", false);
                    SpreadControll.handleSpineAnm(SpreadControll._comboNumBeginAnm, "txt", 0, "num_begin", false);
                    SpreadControll.handleSpineAnm(SpreadControll._comboHitBeginAnm, "txt", 0, "hit_begin", false);
                }
                if (SpreadControll._startCount) {
                    SpreadControll._startCount = false;
                    SpreadControll.countLinkNum();
                }
            }
        });

        let col = Data.Library.REEL_CONFIG.REEL_COL;
        let row = Data.Library.REEL_CONFIG.REEL_ROW + 2
        for(let i = 0; i < col; i++) {
            for(let j = 0; j < row; j++) {
                if(j != 0 && j != row - 1) { continue; }

                this._unshowBonusIndex.push(i * row + j)
            }
        }

        this.maskNode = find("Canvas/BaseGame/Layer/Shake/Reel/reelMask/ReelCol" + this.reelCol);
        this.anmNode = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolAnm/AnmCol" + this.reelCol);
        this.scatterAnmNode = find("Canvas/BaseGame/Layer/Shake/Animation/SymbolScatter/ScatterAnmCol" + this.reelCol);

        this.changeSp = this.node.getChildByName("change").getComponent(sp.Skeleton);
        this.changeSp.setCompleteListener((trackEntry, loopCount) => {
            // 只处理特定动画的结束事件
            let animationName = trackEntry.animation.name;
            if (animationName === 'begin') {
                this.changeSp.enabled = false;
            }
        });
    }

    SetSymbol(sym: number): void {
        this.SymIndex = sym;        
        
        this.node.getChildByName("Anm").getComponent(sp.Skeleton).enabled = false;
        if(this.maskNode.blur == true) {
            this.node.getComponent(Sprite).spriteFrame = this.BlurPic[this.SymIndex];
        } else {
            this.node.getComponent(Sprite).spriteFrame = this.SymPic[this.SymIndex];
        }
    }

    PlaySymbolAnimation(): void {
        let anm = null;
        if(this.SymIndex > 6) {  //低分物件
            anm = this.node.getChildByName("lowSymAnm");
            anm.active = true;
            anm.getComponent(Animation).play();
        } else {  //高分物件
            anm = this.node.getChildByName("Anm").getComponent(sp.Skeleton);
            anm.skeletonData = this.SpineAtlas[this.SymIndex];
            this.ClearAni(anm);
            anm.addAnimation(0, "loop", true);
            anm.enabled = true;
            this.node.getComponent(Sprite).enabled = false;            
        }

        this.anmNode.addChild(this.node);

        let partical = this.node.getChildByName("particle");
        partical.active = true;
        partical.getComponent(Animation).play();
    }

    StopSymbolAnimation(): void {
        let spine = this.node.getChildByName("Anm").getComponent(sp.Skeleton);
        this.ClearAni(spine);        
        if(this.SymIndex == 0 || this.SymIndex == 1) {
            spine.skeletonData = this.SpineAtlas[this.SymIndex];
            spine.addAnimation(0, "idle", true);            
        } else if(this.SymIndex > 6) {
            let lowAnm = this.node.getChildByName("lowSymAnm");
            lowAnm.active = false;
            lowAnm.getComponent(Animation).stop();
        } else {
            spine.enabled = false;
        }
        let partical = this.node.getChildByName("particle");
        partical.getComponent(Animation).stop();
        partical.active = false;
        this.node.getComponent(Sprite).enabled = true;
    }

    ResetSymbolDepth(): void {
        this.maskNode.addChild(this.node);
    }

    ClearAni(spine: sp.Skeleton): void {
        spine.clearTracks();
        spine.setToSetupPose();
    }

    isSlow = false;
    playScatterAnimation(type: string, slow: boolean) {
        this.isSlow = false;

        if(this.SymIndex != 1) { return; }

        let spine = this.node.getChildByName("Anm").getComponent(sp.Skeleton);
        this.node.getComponent(Sprite).enabled = false;
        spine.skeletonData = this.SpineAtlas[1];
        spine.timeScale = 1;
        this.ClearAni(spine)
        if (type == "loop") {
            spine.addAnimation(0, 'loop', true);
        } else if (type == "hit") {
            spine.addAnimation(0, 'hit', false);
            if (slow == true) {
                this.isSlow = true;
                spine.addAnimation(0, 'slowmotion', true);
            } else {
                spine.addAnimation(0, 'idle', true);
            }
        }
        else if (type == "idle"){
            spine.addAnimation(0, 'idle', true);
        }else {
            this.isSlow = true;
            spine.addAnimation(0, 'slowmotion', true);
        }
        spine.enabled = true;

        this.scatterAnmNode.addChild(this.node);
        this.node.setSiblingIndex(99);
    }
    
    PlayWildAnimation(): void {
        if(this.SymIndex != 0) { return; }

        let spine = this.node.getChildByName("Anm").getComponent(sp.Skeleton);
        this.node.getComponent(Sprite).enabled = false;
        spine.skeletonData = this.SpineAtlas[0];
        spine.timeScale = 1;
        this.ClearAni(spine);
        spine.addAnimation(0, 'idle', true);
        spine.enabled = true;
    }

    PlayChangeAnimation(): void {  //播放變盤動畫
        this.changeSp.timeScale = 1;
        this.ClearAni(this.changeSp);
        this.changeSp.setAnimation(0, 'begin', false);
        this.changeSp.enabled = true;
    }

    

    playDragonAnimation(type: number) {  //這款遊戲沒用到
        let spine = this.node.getChildByName("Anm").getComponent(sp.Skeleton);
        if (type == 0) {
            spine.skeletonData = this.SpineAtlas[2];
            spine.timeScale = 1;
            this.ClearAni(spine);
            spine.addAnimation(0, 'idle', true);
            spine.enabled = true;
            this.node.getComponent(Sprite).enabled = false;

            find("Canvas/BaseGame/Layer/Shake/Reel/reelMask").addChild(this.node);
            this.node.setSiblingIndex(this.ordIdx);
        } else {
            spine.timeScale = 1;
            spine.addAnimation(1, 'begin', false);
            spine.addAnimation(1, 'explo', false);
            find("Canvas/BaseGame/Layer/Shake/Animation/SymbolDragon").addChild(this.node);
        }
    }
}