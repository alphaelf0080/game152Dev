import { _decorator, Component, Node, find, game, input, Input, KeyCode, EventKeyboard, Label, Color, UITransform, Button, Sprite, LabelOutline } from 'cc';
import { Data } from '../../DataController';
const { ccclass, property } = _decorator;

@ccclass('CommonLibScript')
export class CommonLibScript extends Component {
    public initFps = false;
    public demoString: Node | null = null;
    protected override onLoad(): void {
        if (Data.Library.CommonLibScript == null)
            Data.Library.CommonLibScript = this;
        else
            this.destroy();
        this.handleNode();    // add Node to AllNode.Data.Map 
        this.handleHomeJudge(); // judge homebutton show
        this.handleKeyboard();  // 新增空白 enter spin
        this.handleAccountSn(); // 新增 單號
        this.handleDemoMode();  // 試玩模式
        this.handleGameVersion(); //遊戲版號
    }

    handleGameVersion() {
        AllNode.Data.Map.get("GameVersion").getComponent(Label).string = `ver123 build 1234`;
        if (typeof window["psapi"] !== 'undefined') {
            AllNode.Data.Map.get("GameVersion").getComponent(Label).string = `ver:${window["psapi"]?.hostInfo?.game_version.rev} build:${window["psapi"]?.hostInfo?.game_version.build}`;
        }
    }

    handleNode() {
        //從起始Canvas循環加入所有node
        if (AllNode.Data.Map.size == 0) {
            let canvasNode = find("Canvas");
            this.traverseNodes(canvasNode);
            let audioNode = find("AudioController");
            this.traverseNodes(audioNode);
        }
    }

    handleHomeJudge() {
        if (window.psapi?.hostInfo.return_type === 0) { // judge home show
            const layerPath = find("Canvas/BaseGame/Layer") ? find("Canvas/BaseGame/Layer/Shake/UI/SettingsPage2/HomeButton") : find("Canvas/BaseGame/UI/SettingsPage2/HomeButton")
            const ErrorInforButton = find("Canvas/Notice/InfoBg/check");
            if (layerPath)
                layerPath.active = false;
            if (ErrorInforButton)
                ErrorInforButton.active = false;
        }
    }

    handleKeyboard() {
        let Down = function (event: EventKeyboard) {  //add keyboard space to spin
            // 檢查是否應忽略按鍵
            if (find("APIConsole")) {
                if (find("APIConsole/ApiCanvas/WebView")) {
                    if (find("APIConsole/ApiCanvas/WebView").active == true) {
                        return;
                    }
                }
            }
            if (find("Canvas/Loader") && find("Canvas/Loader").active === true) {
                return;
            }
            switch (event.keyCode) {
                case KeyCode.SPACE:
                case KeyCode.ENTER:
                    Data.Library.UIcontroller.ClickSpin();
                    break;
            }
        };
        input.on(Input.EventType.KEY_DOWN, Down, this)
    }

    handleAccountSn() {
        let label = new Node(); // add accountSN text
        label.name = "accountSN"
        label.addComponent(Label);
        const LabelText = label.getComponent(Label)
        LabelText.color = new Color(255, 255, 255, 128)
        label.setPosition(-260, 620);
        LabelText.fontSize = 30;
        LabelText.enableOutline = true;
        LabelText.outlineColor = new Color(0, 0, 0, 255);
        LabelText.outlineWidth = 2;
        if (window.psapi?.hostInfo?.history_sn_enable && this.GetURLParameter('pm') !== '1') {
            find("Canvas").addChild(label);
        }
        label.active = false;
    }

    protected override update(deltaTime: number) {
        if (!this.initFps && deltaTime < 0.01) {
            game.frameRate = 59;
            this.initFps = true;
        }
        if (this.GetURLParameter('pm') == '1') {
            let yPos = this.demoString.parent.getPosition().y;
            yPos = -yPos - 640;
            if (AllNode.Data.Map.get("BetSCroll").active || AllNode.Data.Map.get("AutoPage").active)
                this.demoString.setPosition(100, 70 + yPos);
            else
                this.demoString.setPosition(100, 265 + yPos);
            this.demoString.active = !AllNode.Data.Map.get("HelpPage").active;
        }

        const webView = AllNode.Data.Map.get("WebView");
        const infoText = AllNode.Data.Map.get("InfoBg/text").parent;
        if (webView?.active && infoText?.active) {
            webView.active = false;
        }
    }
    /*靜態唯讀屬性
    1.節省記憶體：所有實例共享同一份資料。
    2.防止修改：readonly 確保資料不被意外更改。
    3.型別安全：編譯時檢查，避免拼字錯誤。
    4.語意清楚：常數資料用 static readonly，一目了然。
    */
    private static readonly DEMO_TEXT: Partial<Record<LangCode, string>> = { // 試玩文字
        'eng': 'DEMO',
        'sch': '试玩',
        'tch': '試玩',
        'tai': 'สาธิต'
    };

    handleDemoMode() {
        if (this.GetURLParameter('pm') == '1') { //pm = 1 demo Mode
            this.demoString = new Node();
            this.demoString.name = "DEMO";
            find("Canvas/BaseGame/Page").addChild(this.demoString);
            this.demoString.addComponent(Label);
            this.demoString.getComponent(Label).string = CommonLibScript.DEMO_TEXT[Data.Library.RES_LANGUAGE] || CommonLibScript.DEMO_TEXT['eng'];
            this.demoString.getComponent(Label).isBold = true;
            this.demoString.getComponent(Label).fontSize = 35;
            this.demoString.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
            this.demoString.setPosition(100, 265);
            AllNode.Data.Map.get("HistoryButton").active = false;
            AllNode.Data.Map.get("WinBtn").getComponent(Button).enabled = false;
            AllNode.Data.Map.get("WinBg_Off").getComponent(Sprite).spriteFrame = AllNode.Data.Map.get("WinBg_On").getComponent(Sprite).spriteFrame;
            AllNode.Data.Map.get("WinBg_Off").setPosition(AllNode.Data.Map.get("WinBg_On").getPosition());
        }
    }

    /**
    * 循環加入Node方法
    */
    traverseNodes(node: Node) {
        if (node) {
            if (AllNode.Data.ExcludeNode.indexOf(node.name) === -1) {
                if (!AllNode.Data.Map.has(node.name)) {
                    AllNode.Data.Map.set(node.name, node); // 如果key沒有被建立過直接存                   
                } else {
                    let tempNode = null;
                    tempNode = AllNode.Data.Map.get(node.name);
                    if (!AllNode.Data.Map.get(tempNode.parent.name + "/" + tempNode.name))//要將已建立過的node確認有沒有拉出來幫其建立parent的資料                
                        AllNode.Data.Map.set(tempNode.parent.name + "/" + tempNode.name, tempNode);
                    AllNode.Data.Map.set(node.parent.name + "/" + node.name, node);
                }
                node.children.forEach(childNode => {
                    this.traverseNodes(childNode);
                });
            }
        }
    }
    /**
     * 將數字轉換為下注金額格式顯示
     * @param value 輸入數字（通常是分為單位）
     * @returns 格式化後的金額字串
     * @example
     * NumberToBetNum(1) -> "0.01"
     * NumberToBetNum(25) -> "0.25" 
     * NumberToBetNum(1000) -> "10.00"
     * NumberToBetNum(150000) -> "1,500.00"
     */
    public NumberToBetNum(value: number | string): string {
        const numberStr = value.toString();
        const numValue = parseInt(numberStr, 10);

        if (numberStr.length > 2) {
            // 大於 99：轉為元並加千分位逗號
            const amount = (numValue / 100).toFixed(2);
            return parseFloat(amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            // 小於等於 99：轉為小數格式
            return (numValue / 100).toFixed(2);
        };
    }

    public GetURLParameter(sParam, defaultlang: string = 'eng'): string {
        if (typeof window["psapi"] !== 'undefined') {
            return window["psapi"].getURLParameter(sParam);
        }
        let sPageURL = window.location.search.substring(1);
        let sURLVariables = sPageURL.split('&');
        for (let i = 0; i < sURLVariables.length; i++) {
            let sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
        return defaultlang;
    }

    getAllNode(name: string) {
        return AllNode.Data.Map.get(name);
    }
}


export namespace AllNode {
    @ccclass('Data')
    export class Data {
        /**
       * AllSceneNode作靜態儲存,並循環加入,使用前請先至IDE檢查有無重名,如有請用get("parentNodeName / NodeName"),排除的Node請用AllNode.Data.ExcludeNode查看
       */
        public static Map: Map<string, Node> = new Map();
        /**
       * ExcludeNode作靜態儲存,不要加入的Node
       */
        public static ExcludeNode: Array<string> = ["symbol", "view", "scrollBar"];
    }
}


export class Logger {
    static isDebugMode: boolean = false;

    static setDebugMode(mode: boolean) {
        this.isDebugMode = mode;
    }

    private static getCallerInfo(): string {
        const err = new Error();
        const stackLines = err.stack?.split('\n') || [];
        // 根據 TS 編譯結果和執行環境，可能要調整 index
        const callerLine = stackLines[3] || '';
        return callerLine.trim();
    }

    static info(message: string, ...args: any[]) {
        if (this.isDebugMode)
            console.log(`[INFO] ${message} \n @${this.getCallerInfo()}`, ...args);
    }

    static debug(message: any, ...args: any[]) {
        if (this.isDebugMode) {
            console.log(`[DEBUG] @${this.getCallerInfo()}`, message, ...args);
        }
    }

    static warn(message: string, ...args: any[]) {
        if (this.isDebugMode)
            console.warn(`[WARN] ${message} \n @${this.getCallerInfo()}`, ...args);
    }

    static error(message: string, ...args: any[]) {
        if (this.isDebugMode)
            console.error(`[ERROR] ${message} \n @${this.getCallerInfo()}`, ...args);
    }

    static loading(message: string, ...args: any[]) {
        if (this.isDebugMode) {
            console.log(`[LOADING] ${message} \n @${this.getCallerInfo()}`, ...args);
        }
    }
}
// 將 Logger 設置為全局可訪問
globalThis.Logger = Logger;

globalThis.Data = Data;

globalThis.AllNode = AllNode?.Data?.Map;
