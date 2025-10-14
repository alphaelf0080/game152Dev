import { _decorator, Component, Node, Sprite, SpriteFrame, sp, find, log, SpriteAtlas, Label, LabelAtlas, Texture2D, Animation, UITransform, color } from 'cc';
import { Data } from '../DataController';
import { FontMapController } from '../FontMapController';

const { ccclass, property } = _decorator;
let MessageConsole: Node = null;
@ccclass('BannerController')
export class BannerController extends Component {
    @property({ type: Sprite }) BannerText: Sprite;

    @property({ type: Label }) WinText: Label;

    @property({ type: LabelAtlas }) WinTextFont: LabelAtlas;

    @property({ type: SpriteFrame }) pageFrame: Array<SpriteFrame>;

    @property({ type: Label }) oneRoundScore: Label;

    timer = 0;
    pageCount = 0;
    FontMap: { [key: string]: string } = null;
    scoreTextMap: { [key: string]: string } = null;

    MaxWidth = 512;
    RunState = 0;

    fiveLineAnmNode = null;
    fiveLineAnm = null;


    protected onLoad(): void {
        if (Data.Library.BannerData === null) {
            Data.Library.BannerData = this;
        }
        else {
            this.destroy();
        }
    }

    start() {
        MessageConsole = find("MessageController");
        let num = new FontMapController;
        this.FontMap = num.BannerNumInit();

        let score = new FontMapController;
        this.scoreTextMap = score.SlotWinNumInit();

        this.fiveLineAnmNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/FiveLineAnm");
        this.fiveLineAnm = this.fiveLineAnmNode.getComponent(sp.Skeleton);
        this.fiveLineAnm.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'begin') {
                this.fiveLineAnmNode.active = false;
            }
        })
    }

    setNumber(numberString: String) {
        if (Data.Library.MathConsole.getWinData()._wintotalcredit == 0) { return; }
            
        this.WinText.string = "";
        for (let i = 0; i < numberString.length; i++) {
            this.WinText.string += this.FontMap[numberString[i]];
        }
        if (numberString.indexOf("t") > -1) {
            this.WinText.getComponent(Animation).play("ScaleJumpWinTxt");
        }
    }

    OneRoundScore(numberString) {
        this.oneRoundScore.string = "";
        for (let i = 0; i < numberString.length; i++) {
            this.oneRoundScore.string += this.scoreTextMap[numberString[i]];
        }
        this.oneRoundScore.getComponent(Animation).play("ScaleJumpWinTxt");
    }

    PlayFiveLineAnm() {
        this.fiveLineAnmNode.active = true;

        this.fiveLineAnm.clearTracks();
        this.fiveLineAnm.setToSetupPose();
        this.fiveLineAnm.setAnimation(0, 'begin_m', false);
    }

    resetBanner() {
        this.timer = 0;
        this.pageCount++;
        this.pageCount = this.pageCount % this.pageFrame.length;
        this.BannerText.spriteFrame = this.pageFrame[this.pageCount];
        if (this.pageFrame[this.pageCount].getRect().width >= 500) {
            this.BannerText.getComponent(UITransform).setAnchorPoint(0, 0.5);
            this.BannerText.node.setPosition(-200, 0);
            this.BannerText.color = color(255, 255, 255, 0);
            this.RunState = 1;
        } else {
            this.BannerText.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
            this.BannerText.node.setPosition(0, 0);
            this.BannerText.color = color(255, 255, 255, 0);
            this.RunState = 0;
        }
    }

    update(deltaTime: number) {
        let change = false;
        if (deltaTime > 0.05) deltaTime = 0.05;
        this.timer += deltaTime;
        if (this.timer >= 2 && this.RunState == 0) {
            let c = this.BannerText.color.a - 765 * deltaTime;
            if (c <= 0) {
                this.BannerText.color = color(255, 255, 255, 0);
                change = true;
            } else {
                this.BannerText.color = color(255, 255, 255, c);
            }
        } else if (this.RunState == 1) {
            let run = this.timer * 200;
            this.BannerText.node.setPosition(-200 - run, 0);
            if (run >= this.pageFrame[this.pageCount].getRect().width + 55) {
                change = true;
            }
            if (this.BannerText.color.a < 255) {
                let c = this.BannerText.color.a + 765 * deltaTime;
                if (c >= 255) {
                    this.BannerText.color = color(255, 255, 255, 255);
                } else {
                    this.BannerText.color = color(255, 255, 255, c);
                }
            }
        } else {
            if (this.BannerText.color.a < 255) {
                let c = this.BannerText.color.a + 765 * deltaTime;
                if (c >= 255) {
                    this.BannerText.color = color(255, 255, 255, 255);
                } else {
                    this.BannerText.color = color(255, 255, 255, c);
                }
            }
        }
        if (change == true) {
            this.timer = 0;
            this.pageCount++;
            this.pageCount = this.pageCount % this.pageFrame.length;
            this.BannerText.spriteFrame = this.pageFrame[this.pageCount];
            if (this.pageFrame[this.pageCount].getRect().width >= 500) {
                this.BannerText.getComponent(UITransform).setAnchorPoint(0, 0.5);
                this.BannerText.node.setPosition(-200, 0);
                this.BannerText.color = color(255, 255, 255, 0);
                this.RunState = 1;
            } else {
                this.BannerText.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
                this.BannerText.node.setPosition(0, 0);
                this.BannerText.color = color(255, 255, 255, 0);
                this.RunState = 0;
            }
        }
    }
}