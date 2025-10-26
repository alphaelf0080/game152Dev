import { _decorator, Component, Node, find, game, input, Input, KeyCode, EventKeyboard, Label, Color, UITransform, Button, Sprite, LabelOutline } from 'cc';
import { Data } from '../../DataController';
const { ccclass, property } = _decorator;

/**
 * 通用庫腳本
 * 
 * 主要功能：
 * 1. 初始化場景節點並建立全局映射（AllNode.Data.Map）
 * 2. 設置遊戲版本號顯示
 * 3. 處理首頁按鈕顯示邏輯
 * 4. 設置鍵盤快捷鍵（空白鍵和 Enter 鍵）
 * 5. 設置帳號序號顯示
 * 6. 處理試玩模式（DEMO Mode）
 * 7. 管理遊戲幀率
 * 
 * 使用方式：
 * - 將此組件掛載到場景中的任意節點上
 * - onLoad 時會自動初始化所有功能
 * - 透過 Data.Library.CommonLibScript 訪問全局實例
 */
@ccclass('CommonLibScript')
export class CommonLibScript extends Component {
    /** 是否已初始化幀率 */
    public initFps = false;
    
    /** 試玩模式的 DEMO 文字節點 */
    public demoString: Node | null = null;
    
    /**
     * 載入時執行 - 初始化全局實例和各項功能
     */
    protected onLoad(): void {
        console.log("[CommonLibScript] ► 初始化開始...");
        
        // 設置全局實例
        if (Data.Library.CommonLibScript == null) {
            Data.Library.CommonLibScript = this;
            console.log("[CommonLibScript] ✓ 實例已建立");
        } else {
            console.log("[CommonLibScript] ⚠ 實例已存在，跳過初始化");
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

    /**
     * 判斷首頁按鈕是否顯示
     * - 當 return_type 為 0 時，隱藏首頁返回按鈕和錯誤訊息確認按鈕
     * - 根據場景層級結構查找按鈕路徑
     */
    handleHomeJudge() {
        // 檢查 psapi 的返回類型設定
        if (window.psapi?.hostInfo.return_type === 0) {
            console.log("[CommonLibScript] return_type = 0, 隱藏首頁按鈕");
            
            // 根據場景結構查找首頁按鈕路徑（支援兩種層級結構）
            const layerPath = find("Canvas/BaseGame/Layer") 
                ? find("Canvas/BaseGame/Layer/Shake/UI/SettingsPage2/HomeButton") 
                : find("Canvas/BaseGame/UI/SettingsPage2/HomeButton");
            
            // 查找錯誤訊息的確認按鈕
            const ErrorInforButton = find("Canvas/Notice/InfoBg/check");
            
            // 隱藏找到的按鈕
            if (layerPath) {
                layerPath.active = false;
                console.log("[CommonLibScript] ✓ 隱藏首頁按鈕");
            }
            
            if (ErrorInforButton) {
                ErrorInforButton.active = false;
                console.log("[CommonLibScript] ✓ 隱藏錯誤訊息確認按鈕");
            }
        }
    }

    /**
     * 設置鍵盤控制
     * - 監聽空白鍵和 Enter 鍵來觸發旋轉
     * - 在特定情況下（API 控制台、載入中）忽略按鍵
     */
    handleKeyboard() {
        // 定義按鍵按下的處理函數
        let Down = function (event: EventKeyboard) {
            // 如果 API 控制台的 WebView 正在顯示，忽略按鍵
            if (find("APIConsole")) {
                if (find("APIConsole/ApiCanvas/WebView")) {
                    if (find("APIConsole/ApiCanvas/WebView").active == true) {
                        console.log("[CommonLibScript] API 控制台啟用中，忽略按鍵");
                        return;
                    }
                }
            }
            
            // 如果載入器正在顯示，忽略按鍵
            if (find("Canvas/Loader") && find("Canvas/Loader").active === true) {
                console.log("[CommonLibScript] 載入中，忽略按鍵");
                return;
            }
            
            // 處理空白鍵和 Enter 鍵
            switch (event.keyCode) {
                case KeyCode.SPACE:
                    console.log("[CommonLibScript] 按下空白鍵，觸發旋轉");
                    Data.Library.UIcontroller.ClickSpin();
                    break;
                case KeyCode.ENTER:
                    console.log("[CommonLibScript] 按下 Enter 鍵，觸發旋轉");
                    Data.Library.UIcontroller.ClickSpin();
                    break;
            }
        };
        
        // 註冊鍵盤按下事件監聽器
        input.on(Input.EventType.KEY_DOWN, Down, this);
        console.log("[CommonLibScript] ✓ 鍵盤控制已設置");
    }

    /**
     * 設置帳號序號顯示
     * - 創建一個顯示帳號序號的文字標籤
     * - 只在啟用歷史序號且非試玩模式時添加到場景
     * - 預設為隱藏狀態
     */
    handleAccountSn() {
        console.log("[CommonLibScript] 開始設置帳號序號...");
        
        // 創建新的節點用於顯示序號
        let label = new Node();
        label.name = "accountSN";
        
        // 添加 Label 組件並設置樣式
        label.addComponent(Label);
        const LabelText = label.getComponent(Label);
        
        // 設置文字顏色（半透明白色）
        LabelText.color = new Color(255, 255, 255, 128);
        
        // 設置位置和字體大小
        label.setPosition(-260, 620);
        LabelText.fontSize = 30;
        
        // 設置黑色描邊效果
        LabelText.enableOutline = true;
        LabelText.outlineColor = new Color(0, 0, 0, 255);
        LabelText.outlineWidth = 2;
        
        // 只在啟用歷史序號功能且非試玩模式時，將標籤加入場景
        if (window.psapi?.hostInfo?.history_sn_enable && this.GetURLParameter('pm') !== '1') {
            find("Canvas").addChild(label);
            console.log("[CommonLibScript] ✓ 帳號序號標籤已添加到場景");
        } else {
            console.log("[CommonLibScript] ℹ 帳號序號功能未啟用或處於試玩模式");
        }
        
        // 預設隱藏
        label.active = false;
    }

    /**
     * 每幀更新函數
     * - 自動調整遊戲幀率為 59 FPS
     * - 在試玩模式下調整 DEMO 標籤位置
     * - 處理 WebView 和錯誤訊息的顯示衝突
     * @param deltaTime 距離上一幀的時間間隔
     */
    protected update(deltaTime: number) {
        // 當幀率穩定後（deltaTime < 0.01），設置為 59 FPS
        if (!this.initFps && deltaTime < 0.01) {
            game.frameRate = 59;
            this.initFps = true;
            console.log("[CommonLibScript] ✓ 遊戲幀率已設置為 59 FPS");
        }
        
        // 試玩模式下動態調整 DEMO 標籤位置
        if (this.GetURLParameter('pm') == '1') {
            let yPos = this.demoString.parent.getPosition().y;
            yPos = -yPos - 640;
            
            // 根據下注捲軸或自動頁面是否開啟，調整 Y 座標
            if (AllNode.Data.Map.get("BetSCroll").active || AllNode.Data.Map.get("AutoPage").active)
                this.demoString.setPosition(100, 70 + yPos);
            else
                this.demoString.setPosition(100, 265 + yPos);
            
            // 當幫助頁面顯示時，隱藏 DEMO 標籤
            this.demoString.active = !AllNode.Data.Map.get("HelpPage").active;
        }

        // 防止 WebView 和錯誤訊息同時顯示
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

    /**
     * 從 URL 獲取指定參數
     * - 優先使用 psapi 的 getURLParameter 方法
     * - 如果 psapi 不存在，則手動解析 URL 查詢字串
     * @param sParam 要查詢的參數名稱
     * @param defaultlang 當參數不存在時返回的預設值，預設為 'eng'
     * @returns 參數值或預設值
     */
    public GetURLParameter(sParam, defaultlang: string = 'eng'): string {
        console.log('[CommonLibScript] 嘗試獲取 URL 參數:', sParam);
        // 如果 psapi 已定義，使用其內建方法
        if (typeof window["psapi"] !== 'undefined') {
            return window["psapi"].getURLParameter(sParam);
        }
        
        // 手動解析 URL 查詢字串
        let sPageURL = window.location.search.substring(1); // 移除開頭的 '?'
        let sURLVariables = sPageURL.split('&'); // 分割各個參數
        
        // 遍歷所有參數
        for (let i = 0; i < sURLVariables.length; i++) {
            let sParameterName = sURLVariables[i].split('='); // 分割參數名和值
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }

        console.log('[CommonLibScript] ⚠ 找不到 URL 參數:', sParam, '，返回預設值:', defaultlang);
        
        // 如果找不到指定參數，返回預設值
        return defaultlang;
    }

    /**
     * 根據名稱獲取節點
     * @param name 節點名稱或路徑
     * @returns 找到的節點或 undefined
     */
    getAllNode(name: string) {
        return AllNode.Data.Map.get(name);
    }
}

/**
 * AllNode 命名空間
 * 用於儲存和管理場景中的所有節點
 */
export namespace AllNode {
    @ccclass('Data')
    export class Data {
        /**
         * 所有場景節點的靜態儲存映射
         * - 使用 Map 結構儲存節點名稱和節點物件的對應關係
         * - 循環遍歷場景時會自動加入
         * 
         * 使用注意事項：
         * 1. 使用前請先至 IDE 檢查有無重名節點
         * 2. 如有重名，請使用完整路徑：get("parentNodeName/NodeName")
         * 3. 排除的節點請參考 AllNode.Data.ExcludeNode
         */
        public static Map: Map<string, Node> = new Map();
        
        /**
         * 排除節點列表
         * - 這些節點不會被加入到 Map 中
         * - 預設排除: symbol（符號）、view（視圖）、scrollBar（捲軸）
         */
        public static ExcludeNode: Array<string> = ["symbol", "view", "scrollBar"];
    }
}


/**
 * Logger 工具類
 * 提供統一的日誌輸出介面，支援除錯模式開關
 */
export class Logger {
    /** 是否啟用除錯模式 */
    static isDebugMode: boolean = false;

    /**
     * 設置除錯模式
     * @param mode true 啟用，false 停用
     */
    static setDebugMode(mode: boolean) {
        this.isDebugMode = mode;
    }

    /**
     * 獲取調用者資訊（檔案名稱和行號）
     * @returns 調用者資訊字串
     */
    private static getCallerInfo(): string {
        const err = new Error();
        const stackLines = err.stack?.split('\n') || [];
        // 根據 TS 編譯結果和執行環境，可能要調整 index
        const callerLine = stackLines[3] || '';
        return callerLine.trim();
    }

    /**
     * 輸出一般資訊日誌
     * @param message 訊息內容
     * @param args 額外參數
     */
    static info(message: string, ...args: any[]) {
        if (this.isDebugMode)
            console.log(`[INFO] ${message} \n @${this.getCallerInfo()}`, ...args);
    }

    /**
     * 輸出除錯日誌
     * @param message 訊息內容
     * @param args 額外參數
     */
    static debug(message: any, ...args: any[]) {
        if (this.isDebugMode) {
            console.log(`[DEBUG] @${this.getCallerInfo()}`, message, ...args);
        }
    }

    /**
     * 輸出警告日誌
     * @param message 訊息內容
     * @param args 額外參數
     */
    static warn(message: string, ...args: any[]) {
        if (this.isDebugMode)
            console.warn(`[WARN] ${message} \n @${this.getCallerInfo()}`, ...args);
    }

    /**
     * 輸出錯誤日誌
     * @param message 訊息內容
     * @param args 額外參數
     */
    static error(message: string, ...args: any[]) {
        if (this.isDebugMode)
            console.error(`[ERROR] ${message} \n @${this.getCallerInfo()}`, ...args);
    }

    /**
     * 輸出載入中日誌
     * @param message 訊息內容
     * @param args 額外參數
     */
    static loading(message: string, ...args: any[]) {
        if (this.isDebugMode) {
            console.log(`[LOADING] ${message} \n @${this.getCallerInfo()}`, ...args);
        }
    }
}

// 將 Logger 設置為全局可訪問
globalThis.Logger = Logger;

// 將 Data 設置為全局可訪問
globalThis.Data = Data;

// 將 AllNode.Data.Map 設置為全局可訪問
globalThis.AllNode = AllNode?.Data?.Map;
