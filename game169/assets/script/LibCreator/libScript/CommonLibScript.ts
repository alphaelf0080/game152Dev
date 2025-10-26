import { _decorator, Component, Node, find, game, input, Input, KeyCode, EventKeyboard, Label, Color, UITransform, Button, Sprite, LabelOutline } from 'cc';
import { Data } from '../../DataController';
const { ccclass, property } = _decorator;

@ccclass('CommonLibScript')
export class CommonLibScript extends Component {
    public initFps = false;
    public demoString: Node | null = null;
    protected override onLoad(): void {
        console.log("[CommonLibScript] ► 初始化開始...");
        
        // 設置全局實例
        if (Data.Library.CommonLibScript == null) {
            Data.Library.CommonLibScript = this;
            console.log("[CommonLibScript] ✓ 實例已建立");
        } else {
            console.log("[CommonLibScript] ⚠ 實例已存在，銷毀重複實例");
            this.destroy();
            return;
        }
        
        // 初始化各個處理器
        console.log("[CommonLibScript] → 開始處理場景節點...");
        this.handleNode();    // 將節點加入 AllNode.Data.Map 
        
        console.log("[CommonLibScript] → 開始判斷首頁按鈕...");
        this.handleHomeJudge(); // 判斷首頁按鈕是否顯示
        
        console.log("[CommonLibScript] → 開始設置鍵盤控制...");
        this.handleKeyboard();  // 新增空白鍵和 Enter 鍵來旋轉
        
        console.log("[CommonLibScript] → 開始設置帳號序號...");
        this.handleAccountSn(); // 新增帳號序號
        
        console.log("[CommonLibScript] → 開始設置試玩模式...");
        this.handleDemoMode();  // 試玩模式
        
        console.log("[CommonLibScript] → 開始設置遊戲版號...");
        this.handleGameVersion(); // 遊戲版號
        
        console.log("[CommonLibScript] ✓ 初始化完成");
    }

    handleGameVersion() {
        console.log("[CommonLibScript] 開始設置遊戲版號...");
        
        try {
            // 先設置默認版本號
            const gameVersionNode = AllNode.Data.Map.get("GameVersion");
            if (!gameVersionNode) {
                console.error("[CommonLibScript] ✗ 找不到 GameVersion 節點！");
                return;
            }
            
            const label = gameVersionNode.getComponent(Label);
            if (!label) {
                console.error("[CommonLibScript] ✗ GameVersion 節點上找不到 Label 組件！");
                return;
            }
            
            label.string = `ver123 build 1234`;
            console.log("[CommonLibScript] ✓ 設置默認版本號: ver123 build 1234");
            
            // 如果存在 psapi，使用遊戲伺服器版本號
            if (typeof window["psapi"] !== 'undefined') {
                const version = window["psapi"]?.hostInfo?.game_version;
                if (version?.rev && version?.build) {
                    label.string = `ver:${version.rev} build:${version.build}`;
                    console.log("[CommonLibScript] ✓ 使用伺服器版本號:", label.string);
                } else {
                    console.warn("[CommonLibScript] ⚠ psapi 版本資訊不完整");
                }
            } else {
                console.log("[CommonLibScript] ℹ psapi 未定義，使用本地版本號");
            }
        } catch (error) {
            console.error("[CommonLibScript] ✗ 設置版本號失敗:", error);
        }
    }

    handleNode() {
        // 從起始 Canvas 循環加入所有節點
        console.log("[CommonLibScript] 開始掃描場景節點...");
        console.log("[CommonLibScript] AllNode.Data.Map 當前大小:", AllNode.Data.Map.size);
        
        if (AllNode.Data.Map.size == 0) {
            console.log("[CommonLibScript] → 查找 Canvas 節點...");
            let canvasNode = find("Canvas");
            
            if (canvasNode) {
                console.log("[CommonLibScript] ✓ 找到 Canvas 節點");
                this.traverseNodes(canvasNode);
            } else {
                console.error("[CommonLibScript] ✗ 找不到 Canvas 節點！");
            }
            
            console.log("[CommonLibScript] → 查找 AudioController 節點...");
            let audioNode = find("AudioController");
            
            if (audioNode) {
                console.log("[CommonLibScript] ✓ 找到 AudioController 節點");
                this.traverseNodes(audioNode);
            } else {
                console.warn("[CommonLibScript] ⚠ 找不到 AudioController 節點");
            }
            
            console.log("[CommonLibScript] ✓ 節點掃描完成，總計:", AllNode.Data.Map.size, "個節點");
        } else {
            console.log("[CommonLibScript] ⚠ AllNode.Data.Map 已包含節點，跳過初始化");
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
        const demoParam = this.GetURLParameter('pm');
        console.log("[CommonLibScript] 檢查試玩模式參數 (pm):", demoParam);
        
        if (demoParam == '1') {
            console.log("[CommonLibScript] ✓ 進入試玩模式");
            
            try {
                this.demoString = new Node();
                this.demoString.name = "DEMO";
                
                const basePage = find("Canvas/BaseGame/Page");
                if (!basePage) {
                    console.error("[CommonLibScript] ✗ 找不到 Canvas/BaseGame/Page");
                    return;
                }
                
                basePage.addChild(this.demoString);
                this.demoString.addComponent(Label);
                
                const demoLabel = this.demoString.getComponent(Label);
                const language = Data.Library.RES_LANGUAGE;
                const demoText = CommonLibScript.DEMO_TEXT[language] || CommonLibScript.DEMO_TEXT['eng'];
                
                demoLabel.string = demoText;
                demoLabel.isBold = true;
                demoLabel.fontSize = 35;
                
                console.log("[CommonLibScript] ✓ DEMO 標籤已設置 (語言:", language, ", 文字:", demoText + ")");
                
                this.demoString.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
                this.demoString.setPosition(100, 265);
                
                // 隱藏歷史記錄按鈕
                const historyBtn = AllNode.Data.Map.get("HistoryButton");
                if (historyBtn) {
                    historyBtn.active = false;
                    console.log("[CommonLibScript] ✓ 隱藏 HistoryButton");
                } else {
                    console.warn("[CommonLibScript] ⚠ 找不到 HistoryButton");
                }
                
                // 禁用贏得按鈕
                const winBtn = AllNode.Data.Map.get("WinBtn");
                if (winBtn) {
                    winBtn.getComponent(Button).enabled = false;
                    console.log("[CommonLibScript] ✓ 禁用 WinBtn");
                } else {
                    console.warn("[CommonLibScript] ⚠ 找不到 WinBtn");
                }
                
                // 同步贏得背景
                const winBgOff = AllNode.Data.Map.get("WinBg_Off");
                const winBgOn = AllNode.Data.Map.get("WinBg_On");
                
                if (winBgOff && winBgOn) {
                    winBgOff.getComponent(Sprite).spriteFrame = winBgOn.getComponent(Sprite).spriteFrame;
                    winBgOff.setPosition(winBgOn.getPosition());
                    console.log("[CommonLibScript] ✓ 同步 WinBg 外觀");
                } else {
                    console.warn("[CommonLibScript] ⚠ 找不到 WinBg_Off 或 WinBg_On");
                }
            } catch (error) {
                console.error("[CommonLibScript] ✗ 設置試玩模式失敗:", error);
            }
        } else {
            console.log("[CommonLibScript] ℹ 未啟用試玩模式");
        }
    }

    /**
    * 遞迴遍歷所有子節點並將其加入全局映射
    * @param node 要遍歷的節點
    */
    traverseNodes(node: Node) {
        if (!node) {
            console.warn("[CommonLibScript] ⚠ traverseNodes 收到 null 節點");
            return;
        }
        
        // 檢查是否需要排除此節點
        if (AllNode.Data.ExcludeNode.indexOf(node.name) !== -1) {
            console.log("[CommonLibScript] ⊘ 跳過排除的節點:", node.name);
            return;
        }
        
        try {
            // 如果節點還未被記錄，直接加入
            if (!AllNode.Data.Map.has(node.name)) {
                AllNode.Data.Map.set(node.name, node);
                console.log("[CommonLibScript] ✓ 添加節點:", node.name);
            } else {
                // 節點已存在，需要使用完整路徑來區分
                let tempNode = AllNode.Data.Map.get(node.name);
                const parentPath = tempNode?.parent?.name;
                
                if (parentPath && !AllNode.Data.Map.has(parentPath + "/" + tempNode.name)) {
                    AllNode.Data.Map.set(parentPath + "/" + tempNode.name, tempNode);
                    console.log("[CommonLibScript] ✓ 添加路徑節點:", parentPath + "/" + tempNode.name);
                }
                
                const currentPath = node.parent?.name + "/" + node.name;
                AllNode.Data.Map.set(currentPath, node);
                console.log("[CommonLibScript] ✓ 添加路徑節點:", currentPath);
            }
            
            // 遞迴處理所有子節點
            if (node.children && node.children.length > 0) {
                console.log("[CommonLibScript] ↳ 處理", node.name, "的", node.children.length, "個子節點");
                node.children.forEach(childNode => {
                    this.traverseNodes(childNode);
                });
            }
        } catch (error) {
            console.error("[CommonLibScript] ✗ 遍歷節點失敗:", node.name, error);
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
