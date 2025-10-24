import { _decorator, Component, find, SpriteFrame, instantiate, Label, Node, Enum } from 'cc';
import { Data, Mode } from '../DataController';
const { ccclass, property } = _decorator;
let MessageConsole: Node = null;

@ccclass('GameVariable')
export class GameVariable extends Component {
    @property({ type: SpriteFrame }) SymbolPayTable = [];

    @property({ type: SpriteFrame }) TransPic = [];

    SPACEArr = [0, 10];

    DropSymbolMap = {
        DragonTrigger: [-1, -1],  //這款遊戲沒用到
        Multiplier: [],
        CurrIndex: 0,
        WinLineGroup: [],
    };


    protected onLoad(): void {
        if (Data.Library.GameData === null) {
            Data.Library.GameData = this;
            console.log('✅ GameVariable 已註冊到 Data.Library.GameData');
        } else {
            console.warn('⚠️ GameData 已存在，銷毀重複的 GameVariable 組件');
            this.destroy();
        }
    }

    start() {
        MessageConsole = find("MessageController");
        console.log('✅ GameVariable.start() 初始化完成');
        console.log(`   DropSymbolMap 已初始化: ${JSON.stringify(this.DropSymbolMap, null, 2)}`);
    }


    g_getCreditmode() {
        let mode = Data.Library.CommonLibScript.GetURLParameter("sm");
        if (mode.length == 0) {
            return Mode.CreditMode.Cent;
        }
        if (mode.substr(0, 1) == '0') {
            return Mode.CreditMode.Cent;
        }
        else if (mode.substr(0, 1) == '1') {
            return Mode.CreditMode.Dollar;
        }
        else if (mode.substr(0, 1) == '2') {
            return Mode.CreditMode.Credit;  //so far do no support
        }
    };


    getData() {
        console.log(Data)
    };

    getMode() {
        console.log(Mode)
    };
}