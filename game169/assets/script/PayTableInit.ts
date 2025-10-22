import { _decorator, Component, Node, Label, log, find, UITransform, SpriteFrame, resources, Color, Texture2D, TextAsset, error, HorizontalTextAlignment, JsonAsset, JavaScript, js, assetManager, TypeScript, Overflow, UI, Font } from 'cc';
import PayTable from "./pay_table_config.js";
import { UIController } from './LibCreator/libUIController/UIController';
import { Data, Mode } from './DataController';

const { ccclass, property } = _decorator;

let MessageConsole: Node = null;

@ccclass('PayTableInit')
export class PayTableInit extends Component {
    @property({ type: Font }) HelpAtlas: Font = null;


    @property({ type: Font }) fontName: Font = new Font();
    PayArray = [];
    mulAry = [];
    TextArr = [];
    UIController: UIController

    start() {
        MessageConsole = find("MessageController");
        resources.load("help/HelpTextConfig", (err: any, res: JsonAsset) => {  // 获取到 Json 数据
            if (err) {
                error(err.message || err);
                return;
            }
            const HelpText: object = res.json!;
            console.log(HelpText)
            this.initHelpText(HelpText);
        });

        this.InitPatable();

        this.node.active = false;
    }

    initHelpText(helpText) {
        let config = helpText.HelpTextConfig;
        let TextLabel = new Node();
        TextLabel.name = "TextLabel";
        find("Canvas/BaseGame/Page/HelpPage").addChild(TextLabel);
        TextLabel.setPosition(-360, -535);

        config.forEach((value) => {
            let node = new HelpNode();
            TextLabel.addChild(node);
            let label = node.addComponent(Label);
            if (value.Anchor.x == 0.5) {
                label.getComponent(UITransform).setContentSize(640, 0);
                label.overflow = Overflow.RESIZE_HEIGHT;
            } else if (value.Anchor.x == 0 || value.Anchor.x == 1) {
                if (value.fontSize == 24) {
                    label.overflow = Overflow.RESIZE_HEIGHT;
                } else {
                    label.overflow = Overflow.SHRINK;
                }
                label.getComponent(UITransform).setContentSize(420, 36);
                if (value.Anchor.x == 0) {
                    label.horizontalAlign = HorizontalTextAlignment.CENTER;
                } else {
                    label.horizontalAlign = HorizontalTextAlignment.RIGHT;
                }
            }
            label.lineHeight = 35;
            label.string = value.lineText[Data.Library.RES_LANGUAGE];
            if (this.fontName) {
                label.useSystemFont = false;
                label.font = this.fontName;
            }
            label.isBold = value.fontName == 'Tahoma Bold';
            label.fontSize = value.fontSize;
            label.color = new Color(value.color);
            node.setPosition(value.position.x, value.position.y);
            label.getComponent(UITransform).setAnchorPoint(value.Anchor);
            node.page = value.page;
            this.TextArr.push(node);
        });
    }

    InitPatable() {  //設置symbol倍率
        let PayElement = PayTable.PayTableConfig.element;

        for (let i = 0; i < PayElement.length; i++) {
            let ary = PayElement[i];
            let HelpLabel = new Node();
            HelpLabel.name = "HelpLabel" + i;
            find("Canvas/BaseGame/Page/HelpPage").addChild(HelpLabel);

            for (let j = 0; j < ary.length; j++) {
                let mulNode = new Node();  //存放倍率 ex: X3 X4 X5
                mulNode.name = "MulNode" + j;
                HelpLabel.addChild(mulNode);

                let payNode = new Node();  //存放賠率
                payNode.name = "PayNode" + j;
                HelpLabel.addChild(payNode);
                for (let k = 0; k < ary[j].pay.length; k++) {
                    let str = "";

                    if (k == 0) { str = "X3 -   "; }  //如果倍率有6或7連線以上則需要繼續新增
                    else if (k == 1) { str = "X4 -   "; }
                    else if (k == 2) { str = "X5 -   "; }
                    else { continue; }

                    let anchorX = ary[j].Anchor[0];
                    let anchorY = ary[j].Anchor[1];
                    let mulX = ary[j].position[0];
                    let mulY = ary[j].position[1] + k * 30;
                    let label = this.InitLabel("labelMul" + k, str, false, 26, anchorX, anchorY, mulX, mulY, null, false);
                    mulNode.addChild(label);
                    this.mulAry.push([label, ary[j].relative_res])

                    let payX = ary[j].position[0] + 70;
                    let payY = ary[j].position[1] + 3 + k * 31;
                    let label1 = this.InitLabel("labelPay" + k, "", true, 26, anchorX, anchorY, payX, payY, null, false);
                    payNode.addChild(label1);
                    this.PayArray.push([label1, ary[j].relative_res, (ary[j].pay[k] / PayTable.PayTableConfig.reference_bet).toFixed(2)]);

                }
                //另外加入的  這應該由美術直接寫在圖片裡就好
                if (i == 0 && j == 0) {
                    let label = this.InitLabel("labelWild", "WILD", false, 40, 0.5, 0.5, 0, 120, "#ffc258", true);
                    mulNode.addChild(label);
                    this.mulAry.push([label, ary[j].relative_res])

                    let label1 = this.InitLabel("labelBonus", "BONUS", false, 40, 0.5, 0.5, 0, -300, "#ffc258", true);
                    mulNode.addChild(label1);
                    this.mulAry.push([label1, ary[j].relative_res])
                }
            }
        }
    }

    InitLabel(name: string, str: string, useSystemFont: boolean, fontSize: number, anchorX: number, anchorY: number, x: number, y: number, color: string, isFontBold: boolean): Node {
        let label = new Node();
        label.name = name;
        label.addComponent(Label);
        label.getComponent(Label).string = str;
        label.getComponent(Label).useSystemFont = useSystemFont;
        label.getComponent(Label).fontSize = fontSize;
        label.getComponent(Label).isBold = isFontBold;
        label.getComponent(UITransform).setAnchorPoint(anchorX, anchorY);
        label.setPosition(x, y);
        if (useSystemFont) { label.getComponent(Label).font = this.HelpAtlas; }
        if (color) { label.getComponent(Label).color = new Color(color) }

        return label;
    }

    closeHelp() {
        Data.Library.UIcontroller.HelpClose();
    }

    nextHelp() {
        Data.Library.UIcontroller.HelpPlus();
        this.checkPayPage();
    }

    prevHelp() {
        Data.Library.UIcontroller.HelpLess();
        this.checkPayPage();
    }

    checkPay() {
        let bet = Data.Library.StateConsole.getCurTotoBetInCent();
        for (let i = 0; i < this.PayArray.length; i++) {
            let cent = Data.Library.StateConsole.NumberToCent(this.PayArray[i][2] * bet);
            this.PayArray[i][0].getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(cent);
        }
        // let Fa1 = this.node.getChildByName("FaLabel").getChildByName("1");
        // let Fa2 = this.node.getChildByName("FaLabel").getChildByName("2");

        // let cent = Data.Library.StateConsole.NumberToCent(1 * bet);
        // Fa1.getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(cent) + "WX";
        // let cent2 = Data.Library.StateConsole.NumberToCent(1000 * bet);
        // Fa2.getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(cent2);
        // if (Fa2.getComponent(UITransform).width > 250) {
        //     let scale = 250 / Fa2.getComponent(UITransform).width;
        //     Fa2.setScale(scale, scale);
        // } else {
        //     Fa2.setScale(1, 1);
        // }
        this.checkPayPage();
        this.notifyUpdateCredit();
    }

    notifyUpdateCredit() {
        let type = "All";
        let data = {
            EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.ACTIONS].eUPDATE_CREDITWINNUMS,
            EnventData: null
        }
        Data.Library.StateConsole.SendEvent(type, data);
    }

    checkPayPage() {
        for (let i = 0; i < this.PayArray.length; i++) {
            let bool = this.PayArray[i][1] == (Data.Library.UIcontroller.help_page + 1);
            this.PayArray[i][0].active = bool;
        }
        for (let i = 0; i < this.mulAry.length; i++) {
            let bool = this.mulAry[i][1] == (Data.Library.UIcontroller.help_page + 1);
            this.mulAry[i][0].active = bool;
        }

        for (let i = 0; i < this.TextArr.length; i++) {
            if (this.TextArr[i].page === (Data.Library.UIcontroller.help_page + 1)) {
                this.TextArr[i].active = true;
            } else {
                this.TextArr[i].active = false;
            }
        }

        // if (Data.Library.UIcontroller.help_page == 0) {
        //     this.node.getChildByName("FaLabel").active = true;
        // }
        // else {
        //     this.node.getChildByName("FaLabel").active = false;
        // }
    }
}

class HelpNode extends Node {
    page: string;
}