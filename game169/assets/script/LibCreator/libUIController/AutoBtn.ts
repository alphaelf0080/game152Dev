import { _decorator, Component, Node, Graphics, Color, log, Label, Font, UITransform, Button, EventTouch, sp, Sprite, AudioSource, SpriteFrame } from 'cc';
import { Data } from '../../DataController';
import { AllNode } from '../libScript/CommonLibScript';
import { Mode } from '../../DataController';
import { UCoin } from '../libScript/JackpotScript/UCoin/UCoin';
import { AutoLang } from './AutoLang';
import { SpinePlay, SpineInit } from '../LibCustomized/LibMode';

const { ccclass, property } = _decorator;

const screenWidth = 720;    //螢幕寬
const screenHeight = 1900;  //螢幕高

interface radiusConfig {
    angle: number,
    topLeft: boolean,
    topRight: boolean,
    bottomLeft: boolean,
    bottomRight: boolean
}

interface position {
    x: number,  // 寬度(左右)
    y: number,  // 長度(上下)
    z: number,  // 深度
}

interface graphicsConfig {
    pos: Partial<position>,
    WHD: Partial<position>,  //長寬高
    lineWidth: number,
    radius: radiusConfig
    color: Color,
    use: 'fill' | 'stroke'  //fill會填滿框格、stroke會描邊框線
}

interface labelConfig {
    name: string,
    pos: Partial<position>
    labelStr: string,
    fontSize: number,
    color: Color,
    isBold: boolean,
}

export const REEL = {
    MAX_LINES: 50,
    SPEED: 120,
}
@ccclass('AutoPages')
export class AutoPages extends Component {
    @property({ type: SpriteFrame }) btnCloseN: SpriteFrame;
    @property({ type: SpriteFrame }) btnCloseP: SpriteFrame;

    title: string = '';            //標題
    autoSpin: string = '';         //連續轉
    tilFreeGame: string = '';      //持續轉至免費遊戲

    titleColor = new Color(61, 61, 61, 255);            //Title框顏色
    clickedColor = new Color(0, 255, 255, 255);         //點擊顏色
    disClickedColor = new Color(122, 122, 122, 255);    //未點擊顏色
    colorBlack = new Color(0, 0, 0, 255);               //全黑色
    blackAlpha50 = new Color(0, 0, 0, 128)              //半透明黑色

    InfoController: Node | null = null;
    AutoBtn: Node | null = null;
    AutoBtnSp: sp.Skeleton | null = null;
    SpinAnmAuto: Node | null = null;
    SpinNum: Node | null = null;
    SpinAnm: Node | null = null;

    chooseBtnAry = ['10', '30', '50', '80', '1000'];  //基本自動轉數
    defaultBtnAry = ['1', '2'];  //持續轉、直到免費轉


    protected override start(): void {

        REEL.MAX_LINES = 50;
        this.getComponent(UITransform).setContentSize(720, 1280);
        this.getComponent(UITransform).setAnchorPoint(0, 0);

        this.AutoBtn = AllNode.Data.Map.get("AutoButton");
        this.AutoBtnSp = this.AutoBtn.getChildByName("AutoAnm").getComponent(sp.Skeleton);
        this.InfoController = AllNode.Data.Map.get("InfoController");
        this.SpinAnmAuto = AllNode.Data.Map.get("SpinAnmAuto");
        this.SpinNum = AllNode.Data.Map.get("SpinNum");
        this.SpinAnm = AllNode.Data.Map.get("SpinAnm");
    }

    init(color: Color) {
        this.clickedColor = color;

        this.GetText();
        this.MakeBlock();

        this.AutoBtn.getComponent(Button).node.on(Node.EventType.TOUCH_START, this.IFBtnAuto, this);
        this.AutoBtn.getComponent(Button).node.on(Node.EventType.TOUCH_END, this.IFBtnAuto, this);
        this.AutoBtn.getComponent(Button).node.on(Node.EventType.TOUCH_CANCEL, this.IFBtnAuto, this);

        this.InfoController.setPosition(360, 225);
        if (Data.Library.StateConsole.isAutoPlay == false) {
            SpineInit(this.AutoBtnSp);
            SpinePlay(this.AutoBtnSp, { use: 'add', trackIndex: 0, anmName: 'normal', loop: true });
        }

        Data.Library.StateConsole.isMenuOn = false;
        this.node.active = false;
    }

    GetText() {  //取得語系
        const lang = AutoLang[Data.Library.RES_LANGUAGE] || AutoLang["eng"];
        this.title = lang.title;
        this.autoSpin = lang.autoSpin;
        this.tilFreeGame = lang.tilFreeGame;
    }

    MakeBlock() {  //製作壓暗背景
        this.node.addComponent(Graphics);
        this.CreateRectangle(this.node, {
            pos: { x: 0, y: -300 },
            WHD: { x: screenWidth, y: screenHeight },
            color: this.blackAlpha50,
            use: 'fill'
        });

        this.node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            this.SwitchAutoPage(false);
            event.propagationStopped = true;
        })

        this.MakeButton();
    }

    MakeTitle(nodeY: number) {  //製作標題
        let node = this.CreateNode('TitleFrame', 0, nodeY);

        node.addComponent(Graphics);
        let width = screenWidth;
        let height = 60;
        this.CreateRectangle(node, {
            pos: { x: 0, y: 0 },
            WHD: { x: width, y: height },
            radius: { angle: 30, topLeft: true, topRight: true, bottomLeft: false, bottomRight: false },
            color: this.titleColor,
            use: 'fill'
        });

        this.CreateLabel(node, {
            name: 'text',
            pos: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
            labelStr: this.title,
            fontSize: 36,
            color: this.clickedColor,
            isBold: true
        });

        let btnNode = new Node();  //新增關閉鍵
        btnNode.name = 'closeBtn';
        btnNode.setPosition(screenWidth - 40, Math.floor(height / 2));
        btnNode.setScale(0.6, 0.6);
        btnNode.addComponent(Sprite);
        btnNode.addComponent(Button);

        btnNode.getComponent(Sprite).spriteFrame = this.btnCloseN;

        btnNode.getComponent(Button).node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            this.SwitchAutoPage(false);
            btnNode.getComponent(Sprite).spriteFrame = this.btnCloseN;
        });
        btnNode.getComponent(Button).node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            btnNode.getComponent(Sprite).spriteFrame = this.btnCloseP;
        });
        btnNode.getComponent(Button).node.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            btnNode.getComponent(Sprite).spriteFrame = this.btnCloseN;
        });
        node.addChild(btnNode)

        this.node.addChild(node);
    }

    MakeButton() {  //製作自動轉按鈕
        let mount = 5;  //一排有5個
        let height = 65;  //單個按鈕高度
        let frameX = screenWidth;  //總寬
        let gapY = Math.floor(height / 3) //按鈕上下的間距
        let gapValue = Math.floor(this.chooseBtnAry.length / mount) + (this.chooseBtnAry.length % mount == 0 ? 0 : 1) + 1;  //計算總共會有幾行，+1是defaultBtn佔一行
        let frameY = (height * 2) + (gapValue - 1) * (height + gapY)  //總高

        let nodeY = 60;
        let node = this.CreateNode('Frame', 0, nodeY);  //製作ButtonFrame

        node.addComponent(Graphics);
        this.CreateRectangle(node, {
            pos: { x: 0, y: 0 },
            WHD: { x: frameX, y: frameY },
            color: this.colorBlack,
            use: 'fill'
        });

        for (let i = 0; i < this.chooseBtnAry.length + 2; i++) {  //用迴圈製作每一個按鈕及文字
            let width = 120;  //單個按鈕寬度
            let gapX = Math.floor((screenWidth - width * mount) / (mount + 1));  //按鈕左右間距
            let x = gapX + (gapX + width) * (i % mount);
            let y = frameY - (height * 1.5) - ((gapY + height) * Math.floor(i / mount));
            let str = this.chooseBtnAry[i];

            if (i >= this.chooseBtnAry.length) {
                width = Math.floor((screenWidth - gapX * 3) / 2);
                let j = i - this.chooseBtnAry.length;
                x = (gapX * (j + 1)) + (frameX - gapX * 3) / 2 * j;
                y = frameY - (height * 1.5) - ((gapY + height) * (gapValue - 1));
                str = this.defaultBtnAry[j];
            }

            let BtnNode = this.CreateNode('BtnFrame', x, y);

            BtnNode.addComponent(Graphics);
            let config: Partial<graphicsConfig> = {
                pos: { x: 0, y: 0 },
                WHD: { x: width, y: height },
                radius: { angle: 15, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                lineWidth: 5,
                color: this.disClickedColor,
                use: 'stroke'
            }
            this.CreateRectangle(BtnNode, config);

            let textStr: string = str == '1' ? this.autoSpin : str == '2' ? this.tilFreeGame : str;
            this.CreateLabel(BtnNode, {
                name: 'text',
                pos: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
                labelStr: textStr,
                fontSize: 30,
                color: this.disClickedColor,
                isBold: true
            });

            BtnNode.getComponent(UITransform).setContentSize(width, height);
            BtnNode.getComponent(UITransform).setAnchorPoint(0, 0);

            BtnNode.addComponent(Button);
            BtnNode.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
                config.color = this.clickedColor;
                this.CreateRectangle(BtnNode, config);
                BtnNode.getChildByName('text').getComponent(Label).color = this.clickedColor;
                event.propagationStopped = true;
            }, this);
            BtnNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
                config.color = this.disClickedColor;
                this.CreateRectangle(BtnNode, config);
                BtnNode.getChildByName('text').getComponent(Label).color = this.disClickedColor;
                event.propagationStopped = true;

                this.ChooseAutoOption(str);
            }, this);
            BtnNode.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
                config.color = this.disClickedColor;
                this.CreateRectangle(BtnNode, config);
                BtnNode.getChildByName('text').getComponent(Label).color = this.disClickedColor;
                event.propagationStopped = true;
            }, this);

            node.addChild(BtnNode);
        }
        this.node.addChild(node);

        this.MakeTitle(nodeY + frameY);
    }

    CreateNode(name: string, posX: number, posY: number): Node {
        let node = new Node();
        node.name = name;
        node.setPosition(posX, posY);

        return node;
    }

    CreateRectangle(node: Node, config: Partial<graphicsConfig>) {
        const { pos, WHD, lineWidth, radius, color, use } = config;

        let graphics = node.getComponent(Graphics);
        graphics.clear();

        if (radius == null) {
            graphics.rect(pos.x, pos.y, WHD.x, WHD.y);

        } else {
            const { angle, topLeft, topRight, bottomLeft, bottomRight } = radius;

            graphics.moveTo(pos.x + (topLeft ? angle : 0), pos.y);

            if (bottomRight) {  // 底邊線 + 右下角判断
                graphics.lineTo(pos.x + WHD.x - angle, pos.y);
                graphics.quadraticCurveTo(pos.x + WHD.x, pos.y, pos.x + WHD.x, pos.y + angle);
            } else {
                graphics.lineTo(pos.x + WHD.x, pos.y);
            }

            if (topRight) {  // 右邊线 + 右上角判断
                graphics.lineTo(pos.x + WHD.x, pos.y + WHD.y - angle);
                graphics.quadraticCurveTo(pos.x + WHD.x, pos.y + WHD.y, pos.x + WHD.x - angle, pos.y + WHD.y);
            } else {
                graphics.lineTo(pos.x + WHD.x, pos.y + WHD.y);
            }

            if (topLeft) {  // 上邊線 + 左下角判断
                graphics.lineTo(pos.x + angle, pos.y + WHD.y);
                graphics.quadraticCurveTo(pos.x, pos.y + WHD.y, pos.x, pos.y + WHD.y - angle);
            } else {
                graphics.lineTo(pos.x, pos.y + WHD.y);
            }

            if (bottomLeft) {  // 左邊線 + 左下角判断
                graphics.lineTo(pos.x, pos.y + angle);
                graphics.quadraticCurveTo(pos.x, pos.y, pos.x + angle, pos.y);
            } else {
                graphics.lineTo(pos.x, pos.y);
            }
        }

        if (use == 'fill') {
            graphics.fillColor = color;
            graphics.fill();
        } else if (use == 'stroke') {
            graphics.lineWidth = lineWidth;
            graphics.strokeColor = color;
        }

        graphics.close();
        graphics.stroke();
    }

    CreateLabel(node: Node, config: labelConfig) {
        const { name, pos, labelStr, fontSize, color, isBold } = config;

        let labelNode = this.CreateNode(name, pos.x, pos.y);

        labelNode.addComponent(Label);
        let label = labelNode.getComponent(Label);
        label.string = labelStr;
        label.fontSize = fontSize;
        label.lineHeight = fontSize;
        label.color = color;
        label.isBold = isBold;

        node.addChild(labelNode);
    }

    IFBtnAuto(event: EventTouch) {
        if (Data.Library.StateConsole.isMenuOn == true) { return; }
        if (event.type == "touch-start" && Data.Library.StateConsole.isAutoPlay == false) {
            SpineInit(this.AutoBtnSp);
            SpinePlay(this.AutoBtnSp, { use: 'add', trackIndex: 0, anmName: 'hit', loop: true });
        } else if (event.type == "touch-end") {
            if (Data.Library.StateConsole.isAutoPlay == true) {
                (Data.Library as any)?.isNewAudio
                    ? Data.Library.AudioController.playSfx('BetClick')
                    : AllNode.Data.Map.get("BtnClick2").getComponent(AudioSource).play();
                this.AutoStop();
            } else if (Data.Library.StateConsole.CurState == Mode.FSM.K_IDLE && Data.Library.StateConsole.isAutoPlay == false) {
                this.SwitchAutoPage(true);
            }
        } else if (event.type == "touch-cancel") {
            if (Data.Library.StateConsole.isAutoPlay == false) {
                SpineInit(this.AutoBtnSp);
                SpinePlay(this.AutoBtnSp, { use: 'add', trackIndex: 0, anmName: 'normal', loop: true });
            } else {
                SpineInit(this.AutoBtnSp);
                SpinePlay(this.AutoBtnSp, { use: 'add', trackIndex: 0, anmName: 'stop', loop: true });
            }
        }
    }

    AutoStop() {
        Data.Library.StateConsole.isAutoPlay = false;
        Data.Library.StateConsole.AutoMode = Mode.AUTOPLAYMODE.AUTOPLAY_DISABLE;
        SpineInit(this.AutoBtnSp, { trackIndex: 1 });
        SpinePlay(this.AutoBtnSp, { use: 'add', trackIndex: 1, anmName: 'end', loop: false });
        this.SpinNum.active = false;
        this.SpinAnm.active = true;
        this.SpinAnmAuto.active = false;

        if (Data.Library.StateConsole.CurState != Mode.FSM.K_IDLE) {
            this.AutoBtn.getComponent(Button).interactable = false;
            this.scheduleOnce(() => {
                if (Data.Library.StateConsole.CurState != Mode.FSM.K_IDLE) {
                    this.AutoBtn.getChildByName("AutoDis").getComponent(Sprite).color = new Color(255, 255, 255, 255);
                    this.AutoBtnSp.color = new Color(255, 255, 255, 0);
                }
            }, 0.2);
        }
    }

    ChooseAutoOption(type: string) {
        if (type == '1') {
            Data.Library.StateConsole.AutoMode = Mode.AUTOPLAYMODE.AUTOPLAY_ALWAYS;
        } else if (type == '2') {
            Data.Library.StateConsole.AutoMode = Mode.AUTOPLAYMODE.AUTOPLAY_TILLBONUS;
        } else {
            Data.Library.StateConsole.AutoMode = Mode.AUTOPLAYMODE.AUTOPLAY_Num;
            Data.Library.StateConsole.AutoModeNum = Number(type) - 1;
        }

        this.handleSpinAnm();
        Data.Library.StateConsole.isAutoPlay = true;
        this.SwitchAutoPage(false);
        Data.Library.StateConsole.Spin(false);
    }

    handleSpinAnm() {
        this.SpinAnmAuto.active = true;
        SpineInit(this.SpinAnmAuto.getComponent(sp.Skeleton));
        if (Data.Library.StateConsole.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_ALWAYS || Data.Library.StateConsole.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_TILLBONUS) {
            SpinePlay(this.SpinAnmAuto.getComponent(sp.Skeleton), { use: 'add', trackIndex: 0, anmName: 'always', loop: true });
        } else if (Data.Library.StateConsole.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_Num) {
            SpinePlay(this.SpinAnmAuto.getComponent(sp.Skeleton), { use: 'add', trackIndex: 0, anmName: 'auto', loop: true });
            this.SpinNum.getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(Data.Library.StateConsole.AutoModeNum);
            this.SpinNum.active = true;
        }
        this.SpinAnm.active = false;
    }

    SwitchAutoPage(occur: boolean) {
        if (occur) {
            if (Data.Library.StateConsole.miniSpinCost && Data.Library.StateConsole.miniSpinCost > Data.Library.StateConsole.getCurTotoBetInCent()) {
                if (UCoin.running === false)
                    return;
            }
            if (Data.Library.StateConsole.isMenuOn == true) { return; }
            if (Data.Library.StateConsole.CurState != Mode.FSM.K_IDLE) { return; }
            (Data.Library as any)?.isNewAudio
                ? Data.Library.AudioController.playSfx('Btnclick')
                : AllNode.Data.Map.get("BtnClick").getComponent(AudioSource).play();
            this.InfoController.setPosition(360, 32);
            SpineInit(this.AutoBtnSp, { trackIndex: 1 });
            SpinePlay(this.AutoBtnSp, { use: 'add', trackIndex: 1, anmName: 'begin', loop: false });

            Data.Library.StateConsole.isMenuOn = occur;
            this.node.active = occur;
        } else {
            this.InfoController.setPosition(360, 225);
            (Data.Library as any)?.isNewAudio
                ? Data.Library.AudioController.playSfx('BetClick')
                : AllNode.Data.Map.get("BtnClick2").getComponent(AudioSource).play();
            if (Data.Library.StateConsole.isAutoPlay == false) {
                SpineInit(this.AutoBtnSp);
                SpinePlay(this.AutoBtnSp, { use: 'add', trackIndex: 0, anmName: 'normal', loop: true });
            }

            Data.Library.StateConsole.isMenuOn = occur;
            this.node.active = occur;
        }
    }
}