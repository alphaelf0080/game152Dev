/**
 * UIController - 遊戲主介面控制器
 * 負責管理老虎機遊戲的所有UI元件交互邏輯，包括：
 * - 下注滾輪控制
 * - 按鈕狀態管理  
 * - 音效播放控制
 * - 設定頁面切換
 * - 自動遊戲功能
 * - 特殊功能購買
 */

import { _decorator, Component, Node, find, Label, Sprite, sp, screen, SpriteFrame, Animation, instantiate, UITransform, tween, Button, AudioSource, Color, sys, VideoPlayer, Vec3, WebView, EventTouch, assetManager, AnimationClip } from 'cc';
import { GameVariable } from 'db://assets/script/MessageController/GameVariable';
import { MathConsole } from 'db://assets/script/MessageController/MathConsole';
import { TextAdjust } from 'db://assets/script/UIController/TextAdjust';
import { APIController } from 'db://assets/script/LibCreator/libLoadingInit/APIController';
import { PayTableInit } from 'db://assets/script/PayTableInit';
import { Data, Mode } from 'db://assets/script/DataController';
import { CommonVariableData, IEventData } from 'db://assets/script/LibCreator/libScript/CommonVariable';
import { AnimationController } from 'db://assets/script/AnimationController';
import { AllNode, Logger } from 'db://assets/script/LibCreator/libScript/CommonLibScript';
import { UCoin } from 'db://assets/script/LibCreator/libScript/JackpotScript/UCoin/UCoin';
import { AutoPages } from 'db://assets/script/LibCreator/libUIController/AutoBtn';
import { StateConsole } from 'db://assets/script/MessageController/StateConsole';

/**
 * 滾輪陣列介面 - 定義各類型滾輪的節點陣列
 */
interface ScrollA {
    Rate: Node[],    // 賠率滾輪節點陣列
    Bet: Node[],     // 下注滾輪節點陣列
    Line: Node[],    // 線數滾輪節點陣列
    Total: Node[],   // 總注滾輪節點陣列
}

/**
 * 滾輪索引介面 - 定義各類型滾輪的當前選中索引
 * 注意：使用小寫number，大寫Number為JavaScript內建物件型別
 */
interface ScrollI {
    Rate: number,    // 賠率滾輪當前索引
    Bet: number,     // 下注滾輪當前索引
    Line: number,    // 線數滾輪當前索引
    Total: number,   // 總注滾輪當前索引
}

/**
 * 滾輪顏色介面 - 定義各類型滾輪的顏色配置
 */
interface ScrollC {
    Total_1: Color,  // 總注滾輪主要顏色
    Total_2: Color,  // 總注滾輪次要顏色
    Total_3: Color,  // 總注滾輪第三顏色
    Bet_1: Color,    // 下注滾輪主要顏色
    Bet_2: Color,    // 下注滾輪次要顏色
}

type Constructor<T = {}> = new (...args: any[]) => T; //一個「可以用 new 建構」並回傳 T 型別實例的 class 類別。 T 就是泛型變數

const { ccclass, property } = _decorator;

/**
 * UIController - 遊戲主介面控制器類別
 * 繼承自Cocos Creator的Component，負責管理整個遊戲的UI交互邏輯
 */
@ccclass('UIController')
export class UIController extends Component {

    // =================================
    // 🎨 UI資源屬性區 (編輯器可見) 
    // =================================

    /** 加速按鈕 - 啟用狀態圖片 */
    @property({ type: SpriteFrame })
    public Tubro_act: SpriteFrame

    /** 加速按鈕 - 停用狀態圖片 */
    @property({ type: SpriteFrame })
    public Tubro_off: SpriteFrame

    /** 下注增加按鈕 - 啟用狀態圖片 */
    @property({ type: SpriteFrame })
    public BetAdd_act: SpriteFrame

    /** 下注增加按鈕 - 停用狀態圖片 */
    @property({ type: SpriteFrame })
    public BetAdd_off: SpriteFrame

    /** 下注減少按鈕 - 啟用狀態圖片 */
    @property({ type: SpriteFrame })
    public BetLess_act: SpriteFrame

    /** 下注減少按鈕 - 停用狀態圖片 */
    @property({ type: SpriteFrame })
    public BetLess_off: SpriteFrame

    /** 音效按鈕 - 啟用狀態圖片 */
    @property({ type: SpriteFrame })
    public Voice_act: SpriteFrame

    /** 音效按鈕 - 停用狀態圖片 */
    @property({ type: SpriteFrame })
    public Voice_off: SpriteFrame

    /** 說明頁面圖片陣列 */
    @property({ type: [SpriteFrame] })
    public HelpPages: SpriteFrame[] = [];

    /** 觸發資訊圖片陣列 */
    @property({ type: [SpriteFrame] })
    public TriggerInfo: SpriteFrame[] = [];

    /** 特殊功能購買按鈕節點 */
    @property({ type: Node })
    public featureBuyButton: Node;

    /** 自動遊戲頁面控制器 */
    @property({ type: AutoPages })
    public AutoPages: AutoPages;

    // =================================
    // 🔒 邏輯控制屬性區 (編輯器不可見)
    // =================================

    /** 轉輪狀態標記 */
    public spinState: number = 0;

    /** 說明頁面當前頁數 */
    public help_page: number = 0;

    /** 設定頁面當前頁數 */
    public settingPage: number = 0;

    /** 下注變更標記 (0:無變更, 1:增加, 2:減少) */
    public changeBetFlag: number = 0;

    /** 下注變更計時器 */
    public changeBetClock: number = 0;

    /** 最小幸運打擊倍數 */
    public minLuckyStrikeNum: number = 0;

    // =================================
    // 📦 滾輪控制相關屬性
    // =================================

    /** 滾輪節點陣列集合 - 包含所有類型滾輪的UI節點 */
    public ScrollArray: ScrollA = {
        Rate: [],    // 賠率滾輪節點陣列
        Bet: [],     // 下注滾輪節點陣列
        Line: [],    // 線數滾輪節點陣列
        Total: []    // 總注滾輪節點陣列
    }

    /** 滾輪當前索引集合 - 記錄各滾輪的選中位置 */
    public ScrollIndex: ScrollI = {
        Rate: 0,     // 賠率滾輪當前索引
        Bet: 0,      // 下注滾輪當前索引
        Line: 0,     // 線數滾輪當前索引
        Total: 0     // 總注滾輪當前索引
    }

    /** 滾輪顏色配置集合 - 定義各滾輪不同狀態的顏色 */
    public ScrollColor: ScrollC = {
        Total_1: new Color(213, 123, 33, 255),  // 總注滾輪選中顏色
        Total_2: new Color(213, 123, 33, 128),  // 總注滾輪鄰近顏色
        Total_3: new Color(213, 123, 33, 64),   // 總注滾輪遠端顏色
        Bet_1: new Color(255, 255, 255, 255),   // 下注滾輪選中顏色
        Bet_2: new Color(128, 128, 128, 255),   // 下注滾輪鄰近顏色
    }

    // =================================
    // 🔧 系統及元件引用屬性
    // =================================

    /** 節點查找函數 - 用於快速查找場景中的節點 */
    private getNode!: (key: string) => Node;

    /** 狀態控制台引用 - 管理遊戲狀態 */
    stateConsole: StateConsole | null = null;

    /** 訊息控制台節點 - 處理遊戲資料通訊 */
    messageConsole: Node | null = null;

    /** 遊戲變數控制器 - 管理遊戲核心資料 */
    gameData: GameVariable | null = null;

    /** 數學運算控制器 - 處理遊戲邏輯計算 */
    mathConsole: MathConsole | null = null;

    /** 下注按鈕節點 */
    betBtn: Node | null = null;

    /** 下注金額文字標籤 */
    betText: Label | null = null;

    /** 贏分按鈕節點 */
    winBtn: Node | null = null;

    /** 贏分金額文字標籤 */
    winText: Label | null = null;

    /** 信用點數節點 */
    creditNode: Node | null = null;

    /** 貨幣符號節點 */
    creditCCyNode: Node | null = null;

    /** 自動遊戲按鈕節點 */
    autoBtn: Node | null = null;

    /** 設定頁面1節點 */
    settingsPage: Node | null = null;

    /** 設定頁面2節點 */
    settingsPage2: Node | null = null;

    /** 下注減少按鈕節點 */
    betLessBtn: Node | null = null;

    /** 下注增加按鈕節點 */
    betPlusBtn: Node | null = null;

    /** 資訊控制器節點 */
    infoController: Node | null = null;

    /** 贏分總計 */
    winTotalCredit: number = 0;

    /** 選單按鈕節點 */
    menuBtn: Node | null = null;

    /** 加速按鈕節點 */
    turboBtn: Node | null = null;

    /** 音效按鈕節點 */
    voiceBtn: Node | null = null;

    // =================================
    // 🚀 生命週期方法
    // =================================

    /**
     * 組件載入時執行
     * 將UIController實例註冊到全域Data.Library中，供其他模組存取
     */
    protected override onLoad(): void {
        // 實例註冊到全域的 Data.Library.UIcontroller
        Data.Library.UIcontroller = this;
    }

    /**
     * 組件啟動時執行 - 初始化所有UI元件和事件綁定
     * 主要工作包括：
     * 1. 設定節點查找函數
     * 2. 取得狀態控制台引用
     * 3. 初始化各種UI元件引用
     * 4. 載入貨幣圖片資源
     * 5. 建立滾輪UI
     * 6. 綁定事件監聽器
     */
    protected override start() {
        // 綁定節點查找函數
        this.getNode = AllNode.Data.Map.get.bind(AllNode.Data.Map);
        if (!this.getNode) throw new Error('getNode 尚未注入');

        this.stateConsole = Data.Library.StateConsole;

        // 取得主要控制器元件
        this.messageConsole = find("MessageController");
        this.gameData = this.getComponentSafe(this.messageConsole, GameVariable);
        this.mathConsole = this.getComponentSafe(this.messageConsole, MathConsole);

        // 初始化下注和贏分相關UI元件
        this.betBtn = this.getNode("BtnBet");
        this.betText = this.getComponentFromChild(this.betBtn, "Bet", Label);
        this.winBtn = this.getNode("WinBtn");
        this.winText = this.getComponentFromChild(this.winBtn, "Win", Label);

        // 初始化信用點數和設定相關UI元件
        this.creditNode = this.getNode("Credit");
        this.creditCCyNode = this.getNode("CreditCurrency");
        this.autoBtn = this.getNode("AutoButton");
        this.autoBtn.setPosition(630, 110);
        this.settingsPage = this.getNode("SettingsPage");
        this.settingsPage2 = this.getNode("SettingsPage2");
        this.betLessBtn = this.settingsPage.getChildByName("BetLessBtn");
        this.betPlusBtn = this.settingsPage.getChildByName("BetPlusBtn");
        this.infoController = this.getNode("InfoController");
        this.menuBtn = this.settingsPage.getChildByName("MenuButton");
        this.turboBtn = this.settingsPage.getChildByName("TurboBtn");
        this.voiceBtn = this.settingsPage2.getChildByName("VoiceButton");

        if (this.featureBuyButton == null)
            this.featureBuyButton = this.getNode("FeatureBuyButton");
        let currency = Data.Library.CommonLibScript.GetURLParameter("ccy").toUpperCase();
        let currencyPath = `${currency}/spriteFrame`; // 确保路径正确

        assetManager.loadBundle('currency', (err, bundle) => {
            if (err) {
                Logger.error("Bundle 加載失败:", err);
                return;
            }
            // let assets = bundle.getDirWithPath('', Asset);
            // console.log("Bundle 资源列表:", assets.map(asset => asset.path));
            bundle.load(currencyPath, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    Logger.error(`無法加載 ${currencyPath} 資源:`, err);
                    // 如果找不到，隐藏货币 UI 
                    //typeScript 的 可選鏈接運算子 ?. 只能用在 取值（讀取），不能用來 做賦值（寫入）。
                    this.safeHideNode(this.creditCCyNode);
                    this.safeHideNode(this.betBtn, ["BetCurrency"]);
                    this.safeHideNode(this.winBtn, ["WinCurrency"]);
                    this.safeHideNode(this.getNode("Currency"));
                    return;
                }
                if (spriteFrame) {
                    Logger.info(`✅ 成功加載 ${currencyPath} 貨幣符號`, spriteFrame);

                    // 更新 UI
                    this.creditNode?.getComponent(TextAdjust)?.setContentWidth(spriteFrame.rect.width);
                    this.creditNode?.setPosition((-210 + spriteFrame.rect.width / 2), -1);
                    this.betBtn?.getChildByName("Bet")?.getComponent(TextAdjust)?.setContentWidth(spriteFrame.rect.width);
                    this.betBtn?.getChildByName("Bet")?.setPosition((33 + spriteFrame.rect.width / 2), -1);
                    this.winBtn?.getChildByName("Win")?.getComponent(TextAdjust)?.setContentWidth(spriteFrame.rect.width);
                    this.winBtn?.getChildByName("Win")?.setPosition((31 + spriteFrame.rect.width / 2), -1);

                    // 設置 SpriteFrame
                    this.safeSetNode(this.creditCCyNode, [], Sprite, (comp) => {
                        comp.spriteFrame = spriteFrame;
                    })
                    this.safeSetNode(this.betBtn, ["BetCurrency"], Sprite, (comp) => {
                        comp.spriteFrame = spriteFrame;
                    })
                    this.safeSetNode(this.winBtn, ["WinCurrency"], Sprite, (comp) => {
                        comp.spriteFrame = spriteFrame;
                    })
                    this.safeSetNode(this.getNode("Currency"), [], Sprite, (comp) => {
                        comp.spriteFrame = spriteFrame;
                    })
                } else {
                    Logger.warn(`⚠️ 未找到 ${currencyPath} 在 Bundle 中`);

                    // 如果找不到，隐藏货币 UI
                    this.safeHideNode(this.creditCCyNode);
                    this.safeHideNode(this.betBtn, ["BetCurrency"]);
                    this.safeHideNode(this.winBtn, ["WinCurrency"]);
                    this.safeHideNode(this.getNode("Currency"));
                }
            });
        });

        if (Data.Library.RES_LANGUAGE === "ind") {
            assetManager.loadBundle('prefab', (err, bundle) => {
                bundle.loadDir('LibPrefab/miniSpinCost/ind', SpriteFrame, (err, assets) => {
                    const miniSpinShowIndex = assets.findIndex(item => item.name === "popuiSpin");
                    const miniSpinNoticeIndex = assets.findIndex(item => item.name === "popui_txt_02");
                    this.safeSetNode(this.getNode("miniSpinShow"), [], Sprite, (comp) => {
                        comp.spriteFrame = assets[miniSpinShowIndex];
                    })
                    this.safeSetNode(this.getNode("miniSpinNotice"), [], Sprite, (comp) => {
                        comp.spriteFrame = assets[miniSpinNoticeIndex];
                    })
                })
            })
        }
        this.safeSetNode(this.getNode("WebView/Back"), [], Sprite, (comp) => {
            comp.color = Data.Library.AutoBoardColor;
            comp.grayscale = true;
        })
        //針對Test-IDR大數字修改
        this.getNode("ScrollT")?.setPosition(250, -7);
        this.safeSetNode(this.getNode("ScrollT"), [], UITransform, (comp) => {
            comp.setContentSize(150, 250);
        })
        this.safeSetNode(this.getNode("ScrollT"), ["view"], UITransform, (comp) => {
            comp.setContentSize(150, 250);
        })
        this.safeSetNode(this.getNode("ScrollT"), ["view", "content", "item"], UITransform, (comp) => {
            comp.setContentSize(150, 50.4);
        })
        this.safeSetNode(this.getNode("ScrollT"), ["view", "content", "item"], Label, (comp) => {
            comp.lineHeight = 60;
        })
        this.getNode("ScrollUpT")?.setPosition(250, 153);
        this.getNode("ScrollDownT")?.setPosition(250, -167);
    }

    safeSetNode<T extends Component>(node: Node | null, names: (string)[],
        compType: new () => T, Setter: (Comp: T) => void) {
        if (!node) {
            console.warn(`⚠️ safeSetNode：初始節點為 null`);
            return;
        }
        let curChild: Node = node;
        for (const n of names) {
            const next = curChild.getChildByName(n);
            if (!next) {
                console.warn(`找不到節點：${n}`);
                return;
            }
            curChild = next;
        }
        const comp = curChild.getComponent(compType);
        if (!comp) {
            console.warn(`節點 ${curChild.name} 缺少組件 ${compType.name}`);
            return;
        }
        try {
            Setter(comp);
        } catch (err) {
            console.error(err);
        }
    }

    safeHideNode(node: Node | null, path: string[] = []) {
        let target = node;
        for (const p of path) {
            target = target?.getChildByName(p) || null;
        }
        if (target) target.active = false;
    }

    handleMiniSpin = () => {
        if (this.stateConsole.miniSpinCost === undefined)
            return;
        if (UCoin.running === true) {
            this.getNode("miniSpinShow").active = false;
            this.getNode("miniSpinBg").active = false;
            return;
        }
        if (this.stateConsole.miniSpinCost > this.stateConsole.getCurTotoBetInCent()) {
            this.getNode("miniSpinShow").active = true;
            this.getNode("miniSpinBg").active = false;
            if (this.stateConsole.isAutoPlay === true) {
                this.AutoPages.AutoStop();
                this.handleButtonState();
            }
        } else {
            this.getNode("miniSpinShow").active = false;
            this.getNode("miniSpinBg").active = false;
        }
        if (this.stateConsole.CurScene === Mode.SCENE_ID.FEATURE0 || this.stateConsole.CurState === Mode.FSM.K_FEATURE_CHEKRESULT ||
            this.stateConsole.CurState === Mode.FSM.K_SHOWWIN) {
            this.getNode("miniSpinShow").active = false;
        }
    }

    /**
     * 從指定節點安全取得指定類型的組件。
     * @param node 節點
     * @param type 組件類別（如 Label, Sprite 等）
     * @returns 組件實例，若不存在則拋出錯誤
     * type: new () => T  // new 表示這是一個建構子型別（可以用 new 建立實例  ()表示這個建構子不需要參數 => T 表示建構子會回傳一個 T 型別的物件
     */
    getComponentSafe<T extends Component>(node: Node | null, type: new () => T): T {
        if (!node) throw new Error("Node 為 null");
        const comp = node.getComponent(type);
        if (!comp) throw new Error(`Node 缺少組件：${type.name} `);
        return comp;
    }

    /**
     * 從父節點的指定子節點中，安全取得指定類型的組件。
     * @param parent 父節點
     * @param childName 子節點名稱
     * @param type 組件類別
     * @returns 組件實例，若不存在則拋出錯誤
     */
    getComponentFromChild<T extends Component>(parent: Node | null, childName: string, type: new () => T): T {
        if (!parent) throw new Error("父節點為 null");
        const child = parent.getChildByName(childName);
        if (!child) throw new Error(`找不到子節點：${childName} `);
        const comp = child.getComponent(type);
        if (!comp) throw new Error(`子節點 ${childName} 缺少元件 ${type.name} `);
        return comp;
    }

    handleMiniSpinNoticeShow(btn: EventTouch, show: string) {
        if (this.stateConsole.isMenuOn == true || this.stateConsole.CurState !== Mode.FSM.K_IDLE) return;
        this.getNode("miniSpinBg").active = JSON.parse(show);
        this.getNode("miniSpinBlock").active = JSON.parse(show);
    }

    /**
     * 設定幸運打擊最小倍數
     * 從設定檔中取得特殊功能購買的最小倍數值
     */
    setluckyStrike() {
        if (Array.isArray(Data.Library.DEF_FEATUREBUY_MULTIPLE)) {
            const minValue = Math.min(...Data.Library.DEF_FEATUREBUY_MULTIPLE);
            this.minLuckyStrikeNum = minValue;
        } else {
            this.minLuckyStrikeNum = Data.Library.DEF_FEATUREBUY_MULTIPLE;
        }
        this.checkFeatureBuyButtonActive();
    }

    /**
     * 每幀更新函數
     * 處理需要持續監控的UI狀態和計時器
     * 
     * @param deltaTime - 與上一幀的時間間隔（秒）
     * 
     * 主要功能：
     * 1. 監控下注按鈕的長按狀態
     * 2. 自動關閉教學頁面的計時器
     */
    protected override update(deltaTime: number) {
        // 下注增減按鈕長按處理
        if (this.changeBetFlag == 1) {
            // 下注增加按鈕被長按
            this.changeBetClock += deltaTime;
            if (this.changeBetClock > 0.1) {
                this.changeBetClock = 0;
            }
        } else if (this.changeBetFlag == 2) {
            // 下注減少按鈕被長按
            this.changeBetClock += deltaTime;
            if (this.changeBetClock > 0.1) {
                this.changeBetClock = 0;
            }
        } else {
            // 無按鈕被按下，重置計時器
            this.changeBetClock = 0;
        }

        // 教學頁面自動關閉計時器（40秒後自動關閉）
        if (this.getNode("Teacher") != null && this.getNode("Teacher").active == true) {
            this.autoCloseTeach += deltaTime;
            if (this.autoCloseTeach >= 40)
                this.CloseTeach();
        }
    }

    /**
     * 按鈕事件綁定輔助函數
     * 為指定按鈕綁定觸摸事件監聽器（開始、結束、取消）
     * 
     * @param button - 要綁定事件的按鈕節點
     * @param eventHandler - 事件處理函數
     */
    bindButtonEevent = (button: Node, eventHandler: Function) => {
        const events = [
            Node.EventType.TOUCH_START,  // 觸摸開始
            Node.EventType.TOUCH_END,    // 觸摸結束
            Node.EventType.TOUCH_CANCEL  // 觸摸取消
        ]
        events.forEach(event => button.getComponent(Button).node.on(event, eventHandler, this))
    }

    // =================================
    // 📡 事件廣播處理區
    // =================================

    /**
     * 處理系統廣播事件
     * 主要處理網路就緒和狀態變更事件
     * 
     * @param data - 廣播事件資料
     * 
     * 處理的事件類型：
     * 1. eNETREADY: 網路連線就緒，初始化UI元件
     * 2. eSTATECHANGE: 遊戲狀態變更，更新UI顯示
     * 3. eUpdateCoinAfterJp: 彩金後更新金幣
     */
    public HandleBroadcast(data: IEventData<Mode.FSM>) {
        if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY) {
            // 網路就緒事件 - 初始化所有UI元件和滾輪
            this.winTotalCredit = this.mathConsole.getWinData()._wintotalcredit;

            // 綁定主要按鈕事件
            this.bindButtonEevent(this.betBtn, this.IFBtnBet);
            this.bindButtonEevent(this.winBtn, this.IFBtnWin);
            this.turboBtn.getComponent(Button).node.on(Node.EventType.TOUCH_END, this.IFBtnTurbo, this);
            this.voiceBtn.getComponent(Button).node.on(Node.EventType.TOUCH_END, this.ChangeAudioState, this);

            const setupScrolls = (scrollKey: string, arr: number[]) => {
                const content = find(`Canvas/BaseGame/Page/BetSCroll/Scroll${scrollKey}/view/content`);
                const item = find(`Canvas/BaseGame/Page/BetSCroll/Scroll${scrollKey}/view/content/item`);
                for (let i = 0; i < arr.length; i++) {
                    const node = i === 0 ? item : instantiate(item);
                    node.setPosition(0, (-100 - 50 * i));
                    node.getComponent(Label).string = scrollKey === 'B' ? arr[i].toString() : Data.Library.CommonLibScript.NumberToBetNum(arr[i]);
                    if (i == 1) {
                        node.getComponent(Label).fontSize = 30;
                    } else {
                        node.getComponent(Label).getComponent(Label).fontSize = scrollKey === 'T' ? 25 : 0;
                    }
                    content.addChild(node);
                    this.ScrollArray[scrollKey === "R" ? "Rate" : scrollKey === "B" ? "Bet" : "Total"].push(node);
                    if (i === arr.length - 1) {
                        const separator = instantiate(find(`Canvas/BaseGame/Page/BetSCroll/Scroll${scrollKey}/view/content/-`));
                        separator.setPosition(0, (-100 - 50 * (i + 1)));
                        content.addChild(separator);
                        content.getComponent(UITransform).setContentSize(110, (300 + 50 * (i - 1)));
                    }
                }
            }

            setupScrolls("R", this.stateConsole.RateArray);
            setupScrolls("B", this.stateConsole.BetArray);
            setupScrolls('T', this.stateConsole.TotalArray);

            // LineScroll
            let ScrollLineclone = find("Canvas/BaseGame/Page/BetSCroll/ScrollL/view/content/item");
            ScrollLineclone.getComponent(Label).string = this.stateConsole.LineArray[0].toString();

            let total = this.stateConsole.BetArray[this.stateConsole.BetIndex] * this.stateConsole.RateArray[this.stateConsole.RateIndex] * this.stateConsole.LineArray[0];
            this.stateConsole.TotalIndex = this.stateConsole.TotalArray.indexOf(total);
            if (this.stateConsole.TotalIndex == 0) {
                this.betLessBtn.getComponent(Sprite).spriteFrame = this.BetLess_off;
                this.betLessBtn.getComponent(Button).enabled = false;
            } else {
                this.betLessBtn.getComponent(Sprite).spriteFrame = this.BetLess_act;
                this.betLessBtn.getComponent(Button).enabled = true;
            }
            function bindTouchEvents(nodeId: string, eventHandler: (event: EventTouch) => void) {
                const events = [
                    Node.EventType.TOUCH_START,
                    Node.EventType.TOUCH_END,
                    Node.EventType.TOUCH_CANCEL
                ];
                const node = this.getNode(nodeId);
                events.forEach(event => node.on(event, eventHandler, this));
            }
            // 使用 `call` 方法來綁定 `this`，並使用該函數來綁定事件
            bindTouchEvents.call(this, "MaxBetAlpha", this.MaxAnmState);
            bindTouchEvents.call(this, "ScrollUpR", this.ScrollSingleBtn);
            bindTouchEvents.call(this, "ScrollDownR", this.ScrollSingleBtn);
            bindTouchEvents.call(this, "ScrollUpB", this.ScrollSingleBtn);
            bindTouchEvents.call(this, "ScrollDownB", this.ScrollSingleBtn);
            bindTouchEvents.call(this, "ScrollUpT", this.ScrollSingleBtn);
            bindTouchEvents.call(this, "ScrollDownT", this.ScrollSingleBtn);

            // 更新顯示的金額
            this.updateUI();

            // 初始化自動頁面
            if (Data.Library.AutoBoardColor != null) {
                this.AutoPages.init(Data.Library.AutoBoardColor);
            }

            this.setluckyStrike();
            this.handleMiniSpin();
            this.handleSpinAnm(0);
            return;
        } else if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE) {
            this.winTotalCredit = this.mathConsole.getWinData()._wintotalcredit;
            // StateChange
            this.HandleStateChange(data.EnventData);
            this.handleMiniSpin();
        } else if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.ACTIONS].eUpdateCoinAfterJp) {
            if (!UCoin.running) {
                let animationController = this.getNode("Animation").getComponent(AnimationController);
                this.stateConsole.setCredit(animationController.LocalCent);
            }
        }
    }

    /**
     * 更新UI顯示資訊
     * 刷新信用點數、下注金額、贏分等核心數據的顯示
     */
    updateUI() {
        this.creditNode.getComponent(Label).string = this.stateConsole.NumberToCent(this.stateConsole.PlayerCent);
        this.betText.string = this.stateConsole.NumberToCent(this.stateConsole.TotalArray[this.stateConsole.TotalIndex]);
        this.winText.string = this.stateConsole.NumberToCent(0);

        let MaxBetNum = this.getNode("MaxBetNum");
        if (this.gameData.g_getCreditmode() === Mode.CreditMode.Credit) {
            MaxBetNum.getComponent(Label).string = this.stateConsole.MaxBet.toString();
        } else {
            MaxBetNum.getComponent(Label).string = (this.stateConsole.MaxBet / 100).toString();
        }
    }

    /**
     * 閒置狀態處理
     * 當遊戲進入閒置狀態時更新玩家金幣和按鈕狀態
     */
    idleState() {
        // this.stateConsole.PlayerCent = this.getNode("Animation").getComponent(AnimationController).LocalCent;
        this.handleButtonState();
    }

    /**
     * 按鈕狀態管理
     * 根據當前遊戲狀態控制各種按鈕的啟用/停用狀態
     * 
     * 主要功能：
     * 1. 控制自動遊戲按鈕狀態
     * 2. 控制選單按鈕交互性
     * 3. 更新下注增減按鈕的圖片和功能
     */
    handleButtonState() {
        this.handleSpinAnm(0);
        if (this.stateConsole.isAutoPlay) return

        // 自動遊戲按鈕狀態控制
        this.autoBtn.getComponent(Button).interactable = true;
        this.autoBtn.getChildByName("AutoDis").getComponent(Sprite).color = new Color(255, 255, 255, 0);
        this.autoBtn.getChildByName("AutoAnm").getComponent(sp.Skeleton).color = new Color(255, 255, 255, 255);

        // 選單按鈕控制器
        if (this.menuBtn.getChildByName("Click")) {
            this.menuBtn.getChildByName("Click").getComponent(Button).interactable = true;
        } else {
            this.menuBtn.getComponent(Button).interactable = true;
        }

        // 下注減少按鈕狀態（最小值時停用）
        this.betLessBtn.getComponent(Sprite).spriteFrame = this.stateConsole.TotalIndex === 0 ? this.BetLess_off : this.BetLess_act
        this.betLessBtn.getComponent(Button).enabled = this.stateConsole.TotalIndex !== 0;

        // 下注增加按鈕狀態（最大值時停用）
        const isMaxBet = this.stateConsole.TotalIndex === (this.stateConsole.TotalArray.length - 1);
        this.betPlusBtn.getComponent(Sprite).spriteFrame = isMaxBet ? this.BetAdd_off : this.BetAdd_act;
        this.betPlusBtn.getComponent(Button).enabled = !isMaxBet;
    }

    // =================================
    // 🎯 遊戲狀態變更處理區
    // =================================

    /**
     * 處理遊戲狀態變更事件
     * 根據不同的遊戲狀態更新UI元件的顯示和行為
     * 
     * @param state - 遊戲狀態枚舉值
     * 
     * 處理的狀態包括：
     * - K_IDLE: 閒置狀態
     * - K_SPIN: 轉輪狀態  
     * - K_SHOWWIN: 顯示獎金
     * - K_FEATURE_*: 各種特殊功能狀態
     */
    public HandleStateChange(state: Mode.FSM) {

        /**
         * 設定文字標籤顏色的輔助函數
         * @param color - 要設定的顏色
         */
        const setLabelColor = (color: Color) => {
            this.creditNode.getComponent(Label).color = color;
            this.betText.color = color;
            this.winText.color = color;
            this.creditCCyNode.getComponent(Sprite).color = color;
            this.betBtn.getChildByName("BetCurrency").getComponent(Sprite).color = color;
            this.winBtn.getChildByName("WinCurrency").getComponent(Sprite).color = color;
        }

        /**
         * 設定贏分顯示的輔助函數
         * @param value - 贏分數值
         */
        const setWinLabel = (value: number) => {
            this.winText.string = this.stateConsole.NumberToCent(value);
        }

        /**
         * 停用下注按鈕的輔助函數
         */
        const disableBetButtons = () => {
            this.betLessBtn.getComponent(Sprite).spriteFrame = this.BetLess_off;
            this.betPlusBtn.getComponent(Sprite).spriteFrame = this.BetAdd_off;
            this.betLessBtn.getComponent(Button).enabled = false;
            this.betPlusBtn.getComponent(Button).enabled = false;
        };

        /**
         * 停用自動遊戲UI的輔助函數
         */
        const disableAutoPlayUI = () => {
            this.autoBtn.getComponent(Button).interactable = false;
            this.autoBtn.getChildByName("AutoDis").getComponent(Sprite).color = new Color(255, 255, 255, 255);
            this.autoBtn.getChildByName("AutoAnm").getComponent(sp.Skeleton).color = new Color(255, 255, 255, 0);
        }

        switch (state) {
            case Mode.FSM.K_IDLE:
                this.featureBuyButton.getComponent(Button).enabled = true;
                this.idleState();
                break;
            case Mode.FSM.K_SPIN:
                setLabelColor(new Color(255, 255, 255, 255))
                setWinLabel(0);
                this.handleSpinAnm(1);
                if (this.stateConsole.isAutoPlay == false) {
                    disableAutoPlayUI();
                }
                if (this.menuBtn.getChildByName("Click")) {
                    this.menuBtn.getChildByName("Click").getComponent(Button).interactable = false;
                } else {
                    this.menuBtn.getComponent(Button).interactable = false;
                }
                disableBetButtons();
                break;
            case Mode.FSM.K_SPINSTOPING:
                this.creditNode.getComponent(Label).string = this.stateConsole.NumberToCent(this.stateConsole.PlayerCent);
                this.betText.string = this.stateConsole.NumberToCent(this.stateConsole.TotalArray[this.stateConsole.TotalIndex]);
                break;
            case Mode.FSM.K_EXPEND:
            case Mode.FSM.K_FEATURE_EXPEND:
                if (this.gameData.DropSymbolMap.CurrIndex < this.gameData.DropSymbolMap.SymMap.length && this.winTotalCredit > 0) {
                    this.handleSpinAnm(4);
                }
                break;
            case Mode.FSM.K_DROP:
                if (this.winTotalCredit > 0 && this.gameData.DropSymbolMap.DragonTrigger[this.gameData.DropSymbolMap.CurrIndex] < 0) {
                    setWinLabel(this.stateConsole.credit2CentbyCurRate(this.winTotalCredit));
                }
                break;
            case Mode.FSM.K_FEATURE_DROP:
                if (this.winTotalCredit > 0 && this.gameData.DropSymbolMap.DragonTrigger[this.gameData.DropSymbolMap.CurrIndex] < 0) {
                    setWinLabel(this.stateConsole.credit2CentbyCurRate(this.stateConsole.FeatureTotalWin));
                }
                break;
            case Mode.FSM.K_SHOWWIN:
                if (this.winTotalCredit > 0) {
                    this.handleSpinAnm(4);
                    setWinLabel(this.stateConsole.credit2CentbyCurRate(this.winTotalCredit));
                }
                break;
            case Mode.FSM.K_FEATURE_SHOWWIN:
                if (this.winTotalCredit > 0) {
                    this.handleSpinAnm(4);
                }
                setWinLabel(this.stateConsole.credit2CentbyCurRate(this.stateConsole.FeatureTotalWin));
                break;
            case Mode.FSM.K_WAIT:
                setLabelColor(new Color(176, 224, 230, 255));
                if (this.winTotalCredit > 0) {
                    this.handleSpinAnm(2);
                    setWinLabel(this.stateConsole.credit2CentbyCurRate(this.winTotalCredit));
                }
                break;
            case Mode.FSM.K_FEATURE_WAIT:
                if (this.winTotalCredit > 0) {
                    this.handleSpinAnm(2);
                }
                break;
            case Mode.FSM.K_FEATURE_WAIT_START:
                this.handleSpinAnm(0);
                setWinLabel(this.stateConsole.credit2CentbyCurRate(this.winTotalCredit));
                break;
            case Mode.FSM.K_FEATURE_TRIGGER:
                this.handleSpinAnm(4);
                break;
            case Mode.FSM.K_FEATURE_SHOWSCATTERWIN:
                setWinLabel(this.stateConsole.credit2CentbyCurRate(this.winTotalCredit));
                this.handleSpinAnm(4);
                break;
            case Mode.FSM.K_FEATURE_TRANSLATE:
                setWinLabel(this.stateConsole.credit2CentbyCurRate(this.winTotalCredit));
                this.mathConsole.LastBsResult.TotalWin = this.winTotalCredit;
                break;
            case Mode.FSM.K_FEATURE_SPIN:
                setLabelColor(new Color(255, 255, 255, 255));
                setWinLabel(this.stateConsole.credit2CentbyCurRate(this.stateConsole.FeatureTotalWin));
                break;
            case Mode.FSM.K_SHOWUC:
                this.handleSpinAnm(4);
                break;
            default:
                break;
        }
    }

    // =================================
    // 🏠 導航按鈕控制區
    // =================================

    /**
     * 前往遊戲記錄頁面
     * 開啟內嵌式WebView顯示玩家的遊戲歷史記錄
     * 
     * 安全檢查：
     * - 選單未開啟
     * - 遊戲處於閒置狀態
     * - 非自動遊戲模式
     */
    public goRecord() {
        if (this.stateConsole.isMenuOn == true) return;
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) return;
        if (this.stateConsole.isAutoPlay == true) return;
        if (find("APIConsole")) {
            if (find("Canvas/WebView")) {
                find("APIConsole/ApiCanvas/WidthBg").active = false;
                find("APIConsole/ApiCanvas").addChild(find("Canvas/WebView"));
                find("APIConsole/ApiCanvas").active = true;
            }
            // 組合遊戲記錄URL
            let url = window["psapi"].hostInfo.history_url;
            if (!url || url == "") {
                url = window["psapi"].origin + "/gamehistory/";
            }
            url = url + "?host_id=" + window["psapi"].hostInfo.host_id + "&lang=" + window["psapi"].hostInfo.lang + "&game_id=" + window["psapi"].hostInfo.game_id + "&count=20&page=1&uid=" + window["psapi"].getURLParameter("uid");
            find("APIConsole/ApiCanvas/WebView/WebView").getComponent(WebView).url = "../PSImages/3/FakeLoading/index.html?url=" + url;
            find("APIConsole/ApiCanvas/WebView").active = true;
        }
    }

    /**
     * 返回遊戲大廳
     * 透過API控制器返回主遊戲選單
     * 
     * 安全檢查：
     * - 選單未開啟
     * - 遊戲處於閒置狀態
     */
    public goHome() {
        if (this.stateConsole.isMenuOn == true) return;
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) return;
        if (find("APIConsole")) {
            find("APIConsole").getComponent(APIController).goHome();
        }
    }

    // =================================
    // 🎮 主要按鈕交互控制區
    // =================================

    /**
     * 下注按鈕交互處理
     * 控制下注按鈕的視覺回饋和設定頁面切換
     * 
     * @param event - 觸摸事件物件
     * 
     * 功能說明：
     * - touch-start: 按下時改變按鈕外觀
     * - touch-end/cancel: 放開時恢復外觀，並處理設定頁面邏輯
     */
    public IFBtnBet(event: EventTouch) {
        if (event.type == "touch-start") {
            // 安全檢查：選單開啟或非閒置狀態時不執行
            if (this.stateConsole.isMenuOn == true) return;
            if (this.stateConsole.CurState != Mode.FSM.K_IDLE) return;
            // 按下時的視覺回饋
            this.betBtn.getChildByName("BetBg_On").active = false;
            this.betBtn.getChildByName("BetBg_Off").active = true;
        } else {
            // 恢復正常外觀
            this.betBtn.getChildByName("BetBg_On").active = true;
            this.betBtn.getChildByName("BetBg_Off").active = false;

            // 如果當前在設定頁面2，切換回設定頁面1
            if (this.settingPage === 1) {
                this.settingsPage.setPosition(0, 0);
                this.settingsPage.active = true;
                this.settingsPage2.setPosition(0, -160);
                this.settingsPage2.active = false;

                // 啟用特殊功能購買按鈕
                if (this.featureBuyButton.isValid) {
                    this.featureBuyButton.getComponent(Button).enabled = true;
                    this.featureBuyButton.getComponent(Animation).play("fadeIn");
                    // 處理特殊功能動畫（如果存在）
                    if (this.getNode("FeatureBuyAnm") &&
                        this.getNode("FeatureBuyAnm").getComponent(Animation) &&
                        this.getNode("FeatureBuyAnm").getComponent(Animation).clips.some((element) => element.name === "fadeInSpine")) {
                        this.getNode("FeatureBuyAnm").getComponent(Animation).play("fadeInSpine");
                    }
                }

                // 啟用設定頁面上的所有按鈕
                this.settingsPage.children.forEach(element => {
                    if (element.getComponent(Button)) {
                        element.getComponent(Button).interactable = true;
                    }
                });
            }
        }
    }

    /**
     * 贏分按鈕交互處理
     * 提供贏分按鈕的視覺回饋效果
     * 
     * @param event - 觸摸事件物件
     */
    public IFBtnWin(event: EventTouch) {
        if (event.type == "touch-start") {
            // 安全檢查
            if (this.stateConsole.isMenuOn == true) return;
            if (this.stateConsole.CurState != Mode.FSM.K_IDLE) return;
            // 按下時的視覺回饋
            this.winBtn.getChildByName("WinBg_On").active = false;
            this.winBtn.getChildByName("WinBg_Off").active = true;
        } else {
            // 恢復正常外觀
            this.winBtn.getChildByName("WinBg_On").active = true;
            this.winBtn.getChildByName("WinBg_Off").active = false;
        }
    }

    /**
     * 加速模式按鈕控制
     * 切換遊戲的加速/正常速度模式
     * 
     * @param event - 觸摸事件物件
     * 
     * 功能說明：
     * - 切換加速狀態 (isTurboOn)
     * - 更新按鈕外觀和動畫
     * - 顯示對應的提示動畫
     */
    public IFBtnTurbo(event: EventTouch) {
        if (event.type == "touch-end") {
            // 安全檢查
            if (this.stateConsole.isMenuOn == true) return;
            if (this.stateConsole.CurScene != Mode.SCENE_ID.BASE) return;

            // 播放點擊音效
            (Data.Library as any)?.isNewAudio
                ? Data.Library.AudioController.playSfx('Turboclick')
                : this.getNode("TurboClick").getComponent(AudioSource).play();

            // 切換加速狀態
            this.stateConsole.isTurboOn = !this.stateConsole.isTurboOn;

            if (this.stateConsole.isTurboOn == true) {
                // 啟用加速模式
                this.turboBtn.getComponent(Sprite).spriteFrame = this.Tubro_act;
                this.turboBtn.getChildByName("TurboAnm").getComponent(sp.Skeleton).clearTracks();
                this.turboBtn.getChildByName("TurboAnm").getComponent(sp.Skeleton).setToSetupPose();
                this.turboBtn.getChildByName("TurboAnm").getComponent(sp.Skeleton).addAnimation(0, 'loop', true);

                // 顯示加速開啟提示
                this.getNode("turboOff").getComponent(Animation).stop();
                this.getNode("turboOff").active = false;
                this.getNode("turboOn").active = true;
                this.getNode("turboOn").getComponent(Animation).play("fadeIn&Out");
            } else {
                // 關閉加速模式
                this.turboBtn.getComponent(Sprite).spriteFrame = this.Tubro_off;
                this.turboBtn.getChildByName("TurboAnm").getComponent(sp.Skeleton).addAnimation(1, 'end', false);

                this.getNode("turboOn").getComponent(Animation).stop();
                this.getNode("turboOn").active = false;
                this.getNode("turboOff").active = true;
                this.getNode("turboOff").getComponent(Animation).play("fadeIn&Out");
            }
        }
    }

    public SettingCheagePage(event: EventTouch, page: string) {
        if (this.stateConsole.isMenuOn == true) return;
        if (this.stateConsole.isAutoPlay == true) return;
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) return;

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        let showObject: Node;
        let closeObject: Node;
        if (page === '0') {
            this.settingPage = 0;
            showObject = this.settingsPage;
            closeObject = this.settingsPage2;
            featureBuyButtonState.call(this, true, "fadeIn", "fadeInSpine");
        } else if (page === '1') {
            this.settingPage = 1;
            showObject = this.settingsPage2;
            closeObject = this.settingsPage;
            featureBuyButtonState.call(this, false, "fadeOut", "fadeOutSpine");
        }

        if (this.getNode("miniSpinShow")) {
            if (page === '1') {
                this.getNode("miniSpinShow").active = false;
            } else {
                this.handleMiniSpin();
            }
        }

        function featureBuyButtonState(buttonenable: boolean, anm: string, anm2: string) {
            if (this.featureBuyButton.isValid) {
                this.featureBuyButton.getComponent(Button).enabled = buttonenable;
                this.featureBuyButton.getComponent(Animation).play(anm);
                if (this.getNode("FeatureBuyAnm") &&
                    this.getNode("FeatureBuyAnm").getComponent(Animation) &&
                    this.getNode("FeatureBuyAnm")?.getComponent(Animation)?.clips.some((element: AnimationClip) => element.name === anm2)) {
                    this.getNode("FeatureBuyAnm").getComponent(Animation).play(anm2);
                }
            }
        };

        showObject.active = true;

        closeObject.children.forEach(element => {
            if (element.getComponent(Button)) {
                element.getComponent(Button).interactable = false;
            }
        });
        showObject.children.forEach(element => {
            if (element.getComponent(Button)) {
                element.getComponent(Button).interactable = false;
            }
        });

        tween()
            .target(showObject)
            .by(0.25, {
                position: new Vec3(0, 160, 0)
            })
            .call(() => {
                showObject.children.forEach(element => {
                    if (element.getComponent(Button)) {
                        element.getComponent(Button).interactable = true;
                    }
                });
            })
            .start();

        tween()
            .target(closeObject)
            .by(0.25, { position: new Vec3(0, -160, 0) })
            .call(() => {
                closeObject.active = false;
            })
            .start();
    }

    public ChangeAudioState(event: { type: string }) {
        if (this.stateConsole.isMenuOn == true) return;
        if (event.type == "touch-end") {
            this.stateConsole.isMute = !this.stateConsole.isMute;
            if ((Data.Library as any)?.isNewAudio) {
                Data.Library.AudioController.setMute(this.stateConsole.isMute);
            }
            if (this.stateConsole.isMute == true) {
                this.voiceBtn.getComponent(Sprite).spriteFrame = this.Voice_off;
                this.menuBtn.getChildByName("VoiceOff").active = true;
            } else {
                (Data.Library as any)?.isNewAudio
                    ? Data.Library.AudioController.playSfx('BetClick')
                    : this.getNode("BtnClick2").getComponent(AudioSource).play();
                this.voiceBtn.getComponent(Sprite).spriteFrame = this.Voice_act;
                this.menuBtn.getChildByName("VoiceOff").active = false;
            }
        }
    }

    // =================================
    // 🎯 滾輪控制方法區
    // =================================

    /**
     * 滾輪滑動回調函數
     * 處理三種滾輪類型（賠率Rate、下注Bet、總注Total）的滑動事件
     * 
     * @param event - 滑動事件物件
     * @param event_id - 事件類型ID (SCROLLING進行中 / SCROLL_ENDED結束)
     * @param type - 滾輪類型標識 ("R"賠率, "B"下注, "T"總注)
     * 
     * 功能說明：
     * 1. 監聽滾輪滑動狀態，計算當前選中項目
     * 2. 更新滾輪視覺效果（字體大小、顏色）
     * 3. 當滑動結束時，同步更新相關滾輪位置
     * 4. 處理下注邏輯關聯（下注×賠率=總注）
     */
    public ScrollCallback(_event: Event, event_id: CommonVariableData.ScrollEventType, type: string) { //_event 命名方式會讓 ESLint/TSLint 和 TS 認為這個參數是「刻意未使用」的。
        // 只處理滑動中和滑動結束事件
        const isScrolling = event_id === CommonVariableData.ScrollEventType.SCROLLING;
        const isScrollEnd = event_id === CommonVariableData.ScrollEventType.SCROLL_ENDED;
        if (!isScrolling && !isScrollEnd) return;

        // 根據類型標識確定滾輪鍵值
        type ScrollKey = keyof ScrollA;
        let scrollKey: ScrollKey | null = type.includes("R") ? "Rate" : type.includes("B") ? "Bet" : type.includes("T") ? "Total" : null;
        if (!scrollKey) return;

        // 取得滾輪內容節點和相關數據
        const contentPath = `Canvas/BaseGame/Page/BetSCroll/Scroll${type}/view/content`;
        const content = find(contentPath);
        const scrollArray = this.ScrollArray[scrollKey];
        const posY = content.getPosition().y;

        // 根據位置計算當前選中索引（每個項目間距50像素，基準位置125）
        const index = this.clampIndex(Math.floor(Math.round((posY - 125) / 50)), scrollArray.length);

        // 更新滾輪視覺效果和播放音效
        this.updateScrollVisual(scrollArray, index, scrollKey, true);
        this.playClickIfChanged(scrollArray[index].getComponent(Label), 40);

        // 滑動結束時的處理
        if (isScrollEnd) {
            // 修正滾輪位置到精確位置
            content.setPosition(0, (125 + 50 * index));
            this.ScrollIndex[scrollKey] = index;

            // 當下注或賠率變更時，自動計算並更新總注
            if (scrollKey === "Bet" || scrollKey === "Rate") {
                const total = this.stateConsole.BetArray[this.ScrollIndex.Bet] *
                    this.stateConsole.RateArray[this.ScrollIndex.Rate] *
                    this.stateConsole.LineArray[0];
                this.ScrollIndex.Total = this.stateConsole.TotalArray.indexOf(total);
                find("Canvas/BaseGame/Page/BetSCroll/ScrollT/view/content").setPosition(0, 125 + 50 * this.ScrollIndex.Total);
            }

            // 當總注變更時，從預設組合中取得對應的下注和賠率
            if (scrollKey === "Total") {
                const [bet, rate] = this.stateConsole.TotalArrayX[this.ScrollIndex.Total];
                this.ScrollIndex.Bet = bet;
                this.ScrollIndex.Rate = rate;
                find("Canvas/BaseGame/Page/BetSCroll/ScrollB/view/content").setPosition(0, 125 + 50 * bet);
                find("Canvas/BaseGame/Page/BetSCroll/ScrollR/view/content").setPosition(0, 125 + 50 * rate);
            }

            // 更新滾輪按鈕狀態和視覺效果
            this.ScrollHL();
        }
    }

    /**
     * 更新滾輪按鈕狀態 (ScrollHL = Scroll Highlight)
     * 功能：
     * 1. 刷新所有滾輪的視覺效果
     * 2. 控制上下箭頭按鈕的顯示/隱藏狀態
     * 3. 在邊界位置禁用對應方向的按鈕
     */
    public ScrollHL() {
        // 更新三種滾輪的視覺效果
        this.updateScrollVisual(this.ScrollArray.Bet, this.ScrollIndex.Bet, "Bet");
        this.updateScrollVisual(this.ScrollArray.Rate, this.ScrollIndex.Rate, "Rate");
        this.updateScrollVisual(this.ScrollArray.Total, this.ScrollIndex.Total, "Total");

        // 控制下注滾輪箭頭按鈕顯示狀態
        this.getNode("ScrollUpB").active = this.ScrollIndex.Bet === 0 ? false : true;
        this.getNode("ScrollDownB").active = this.ScrollIndex.Bet === (this.ScrollArray.Bet.length - 1) ? false : true;

        // 控制賠率滾輪箭頭按鈕顯示狀態
        this.getNode("ScrollUpR").active = this.ScrollIndex.Rate === 0 ? false : true;
        this.getNode("ScrollDownR").active = this.ScrollIndex.Rate === (this.ScrollArray.Rate.length - 1) ? false : true;

        // 控制總注滾輪箭頭按鈕顯示狀態
        this.getNode("ScrollUpT").active = this.ScrollIndex.Total === 0 ? false : true;
        this.getNode("ScrollDownT").active = this.ScrollIndex.Total === (this.ScrollArray.Total.length - 1) ? false : true;
    }

    /**
     * 索引值限制函數
     * 確保索引值在有效範圍內（0 到 maxLength-1）
     * 
     * @param index - 原始索引值
     * @param maxLength - 陣列最大長度
     * @returns 限制後的安全索引值
     */
    private clampIndex(index: number, maxLength: number): number {
        return Math.max(0, Math.min(index, maxLength - 1));
    }

    /**
     * 更新滾輪視覺效果
     * 根據當前選中項目設定各個選項的字體大小和顏色
     * 
     * @param array - 滾輪節點陣列
     * @param index - 當前選中索引
     * @param type - 滾輪類型（用於顏色配置）
     * 
     * 視覺規則：
     * - 選中項目(index): 字體40px，主要顏色
     * - 相鄰項目(index±1): 字體30px，次要顏色
     * - 遠端項目(index±2以上): 字體0px（隱藏） total:25px 
     */
    private updateScrollVisual(array: Node[], index: number, type: string, soundBool?: boolean) {
        array.forEach((e, idx) => {
            if (idx <= (index - 2)) {
                // 遠端項目：
                e.getComponent(Label).fontSize = type === 'Total' ? 25 : 0;
                e.getComponent(Label).color = this.ScrollColor.Total_3;
            } else if (idx == (index - 1)) {
                // 上方相鄰項目：中等字體
                e.getComponent(Label).fontSize = 30;
                e.getComponent(Label).color = type === 'Total' ? this.ScrollColor.Total_2 : this.ScrollColor.Bet_2;
            } else if (idx == index) {
                // 選中項目：最大字體，播放切換音效
                if (e.getComponent(Label).fontSize != 40 && soundBool) {
                    (Data.Library as any)?.isNewAudio
                        ? Data.Library.AudioController.playSfx('BetClick')
                        : this.getNode("BtnClick2").getComponent(AudioSource).play();
                }
                e.getComponent(Label).fontSize = 40;
                e.getComponent(Label).color = type === 'Total' ? this.ScrollColor.Total_1 : this.ScrollColor.Bet_1;
            } else if (idx == (index + 1)) {
                // 下方相鄰項目：中等字體
                e.getComponent(Label).fontSize = 30;
                e.getComponent(Label).color = type === 'Total' ? this.ScrollColor.Total_2 : this.ScrollColor.Bet_2;
            } else if (idx >= (index + 2)) {
                // 遠端項目：
                e.getComponent(Label).fontSize = type === 'Total' ? 25 : 0;
                e.getComponent(Label).color = this.ScrollColor.Total_3;
            }
        });
    }

    /**
     * 條件式音效播放
     * 當字體大小改變時播放點擊音效
     * 
     * @param label - 文字標籤元件
     * @param targetSize - 目標字體大小
     */
    private playClickIfChanged(label: Label, targetSize: number) {
        if (label.fontSize !== targetSize) {
            (Data.Library as any)?.isNewAudio
                ? Data.Library.AudioController.playSfx('BetClick')
                : this.getNode("BtnClick2").getComponent(AudioSource).play();
        }
    }

    /**
     * 滾輪單一按鈕控制 - 處理上下箭頭按鈕的點擊事件
     * 支援三種操作狀態：按下(touch-start)、放開(touch-end)、取消(touch-cancel)
     * 
     * @param event - 觸摸事件物件
     * 
     * 功能說明：
     * 1. 按下時：改變按鈕位置提供視覺回饋
     * 2. 放開時：執行滾輪索引變更，更新相關滾輪，播放音效
     * 3. 取消時：恢復按鈕位置
     * 
     * 支援的滾輪類型：
     * - Rate(R): 賠率滾輪，影響總注計算
     * - Bet(B): 下注滾輪，影響總注計算  
     * - Total(T): 總注滾輪，直接設定下注組合
     */
    public ScrollSingleBtn(event: EventTouch) {
        // 解析按鈕類型和方向
        const name = event.target._name;
        const type = name.includes("R") ? "Rate" : name.includes("B") ? "Bet" : name.includes("T") ? "Total" : null;
        if (!type) return;
        const isUp = event.target.getPosition().y > 0; // Y座標大於0表示向上按鈕

        if (event.type == "touch-start") {
            // 按下時改變按鈕位置（視覺回饋）
            const Y = isUp ? 163 : -177;
            const X = type === "Rate" ? -244 : type === "Bet" ? -78 : 250;
            event.target.setPosition(X, Y);
            return;
        }

        if (event.type == "touch-end" || event.type == "touch-cancel") {
            // 播放按鈕點擊音效
            (Data.Library as any)?.isNewAudio
                ? Data.Library.AudioController.playSfx('BetClick')
                : this.getNode("BtnClick2").getComponent(AudioSource).play();

            if (type === "Rate" || type === "Bet") {
                // 獲取最大索引值，防止數組越界
                const maxIndex = type === "Rate" ? this.stateConsole.RateArray.length - 1 : this.stateConsole.BetArray.length - 1;
                // 安全的索引計算，確保在有效範圍內 (0 到 maxIndex)
                this.ScrollIndex[type] = Math.max(0, Math.min(maxIndex, this.ScrollIndex[type] + (isUp ? -1 : 1)));

                // 重新計算總注索引（下注 × 賠率 × 線數）
                const total = this.stateConsole.BetArray[this.ScrollIndex.Bet] *
                    this.stateConsole.RateArray[this.ScrollIndex.Rate] *
                    this.stateConsole.LineArray[0];
                this.ScrollIndex.Total = this.stateConsole.TotalArray.indexOf(total);

                // 恢復按鈕位置
                event.target.setPosition(type === "Rate" ? -244 : -78, isUp ? 153 : -167);

            } else if (type === "Total") {
                // 獲取最大索引值，防止數組越界
                const maxIndex = this.stateConsole.TotalArray.length - 1;
                // 安全的索引計算，確保在有效範圍內 (0 到 maxIndex)
                this.ScrollIndex.Total = Math.max(0, Math.min(maxIndex, this.ScrollIndex.Total + (isUp ? -1 : 1)));

                // 從預設總注組合中獲取對應的下注和賠率索引
                const [bet, rate] = this.stateConsole.TotalArrayX[this.ScrollIndex.Total];
                this.ScrollIndex.Bet = bet;
                this.ScrollIndex.Rate = rate;

                // 恢復按鈕位置
                event.target.setPosition(250, isUp ? 153 : -167);
            }

            // 統一更新所有滾輪的視覺位置
            find("Canvas/BaseGame/Page/BetSCroll/ScrollB/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Bet));
            find("Canvas/BaseGame/Page/BetSCroll/ScrollR/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Rate));
            find("Canvas/BaseGame/Page/BetSCroll/ScrollT/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Total));

            // 更新滾輪按鈕狀態和視覺效果
            this.ScrollHL();
        }
    }

    /**
     * 關閉下注滾輪頁面
     * 功能：隱藏滾輪選擇界面，恢復正常遊戲狀態
     */
    public BetScrollClose() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        this.stateConsole.isMenuOn = false;
        this.getNode("BetSCroll").active = false;
        this.infoController.setPosition(360, 225);
    }

    /**
     * 最大下注動畫狀態控制
     * 處理最大下注按鈕的三種狀態：按下、放開、取消
     * 
     * @param event - 觸摸事件物件
     * 
     * 功能說明：
     * - touch-start: 播放按壓動畫效果
     * - touch-end: 播放完整動畫，設定所有滾輪到最大值
     * - touch-cancel: 恢復正常狀態
     */
    public MaxAnmState(event: EventTouch) {
        if (event.type == "touch-start") {
            // 按下時播放按壓動畫
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).clearTracks();
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).setToSetupPose();
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).addAnimation(0, 'hit', true);
        } else if (event.type == "touch-end") {
            // 放開時執行最大下注邏輯
            if ((Data.Library as any)?.isNewAudio) {
                Data.Library.AudioController.stopSfx('FestBet');
                Data.Library.AudioController.playSfx('FestBet');
            } else {
                this.getNode("MaxBet").getComponent(AudioSource).stop();
                this.getNode("MaxBet").getComponent(AudioSource).play();
            }
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).clearTrack(1);
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).addAnimation(1, 'begin', false);

            // 設定所有滾輪到最大值
            this.ScrollIndex.Bet = this.ScrollArray.Bet.length - 1;
            this.ScrollIndex.Rate = this.ScrollArray.Rate.length - 1;
            this.ScrollIndex.Total = this.ScrollArray.Total.length - 1;
            this.scheduleOnce(() => {
                find("Canvas/BaseGame/Page/BetSCroll/ScrollB/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Bet));
                find("Canvas/BaseGame/Page/BetSCroll/ScrollR/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Rate));
                find("Canvas/BaseGame/Page/BetSCroll/ScrollT/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Total));
                this.ScrollHL();
            }, 0.35);
        } else {
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).clearTracks();
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).setToSetupPose();
            this.getNode("MaxBetAnm").getComponent(sp.Skeleton).addAnimation(0, 'normal', true);
        }
    }

    public BetCheck() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('CheckClick')
            : this.getNode("AudioController/BetCheck").getComponent(AudioSource).play();
        this.stateConsole.isMenuOn = false;
        this.stateConsole.BetIndex = this.ScrollIndex.Bet;
        this.stateConsole.RateIndex = this.ScrollIndex.Rate;
        this.stateConsole.TotalIndex = this.ScrollIndex.Total;
        this.betText.string = this.stateConsole.NumberToCent(this.stateConsole.TotalArray[this.stateConsole.TotalIndex]);
        this.getNode("BetSCroll").active = false;
        this.infoController.setPosition(360, 225);
        if (this.stateConsole.TotalIndex == 0) {
            this.betLessBtn.getComponent(Sprite).spriteFrame = this.BetLess_off;
            this.betLessBtn.getComponent(Button).enabled = false;
        } else {
            this.betLessBtn.getComponent(Sprite).spriteFrame = this.BetLess_act;
            this.betLessBtn.getComponent(Button).enabled = true;
        }
        if (this.stateConsole.TotalIndex == this.stateConsole.TotalArray.length - 1) {
            this.betPlusBtn.getComponent(Sprite).spriteFrame = this.BetAdd_off;
            this.betPlusBtn.getComponent(Button).enabled = false;
        } else {
            this.betPlusBtn.getComponent(Sprite).spriteFrame = this.BetAdd_act;
            this.betPlusBtn.getComponent(Button).enabled = true;
        }
        this.checkFeatureBuyButtonActive();
        this.getNode("HelpPage").getComponent(PayTableInit).checkPay();
        this.handleMiniSpin();
    }

    public BetPlus() {
        if (this.stateConsole.isMenuOn == true) { return; }
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) { return; }

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        if (this.stateConsole.TotalIndex < this.stateConsole.TotalArray.length - 1)
            this.stateConsole.TotalIndex += 1;
        this.betText.string = this.stateConsole.NumberToCent(this.stateConsole.TotalArray[this.stateConsole.TotalIndex]);
        this.stateConsole.BetIndex = this.stateConsole.TotalArrayX[this.stateConsole.TotalIndex][0];
        this.stateConsole.RateIndex = this.stateConsole.TotalArrayX[this.stateConsole.TotalIndex][1];
        if (this.stateConsole.TotalIndex > 0) {
            this.betLessBtn.getComponent(Sprite).spriteFrame = this.BetLess_act;
            this.betLessBtn.getComponent(Button).enabled = true;
        }
        if (this.stateConsole.TotalIndex == this.stateConsole.TotalArray.length - 1) {
            this.betPlusBtn.getComponent(Sprite).spriteFrame = this.BetAdd_off;
            this.betPlusBtn.getComponent(Button).enabled = false;
        }
        this.checkFeatureBuyButtonActive();
        this.getNode("HelpPage").getComponent(PayTableInit).checkPay();
        this.handleMiniSpin();
    }

    public BetLess() {
        if (this.stateConsole.isMenuOn == true) { return; }
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) { return; }

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        if (this.stateConsole.TotalIndex > 0)
            this.stateConsole.TotalIndex -= 1;
        this.betText.string = this.stateConsole.NumberToCent(this.stateConsole.TotalArray[this.stateConsole.TotalIndex]);
        this.stateConsole.BetIndex = this.stateConsole.TotalArrayX[this.stateConsole.TotalIndex][0];
        this.stateConsole.RateIndex = this.stateConsole.TotalArrayX[this.stateConsole.TotalIndex][1];
        if (this.stateConsole.TotalIndex == 0) {
            this.betLessBtn.getComponent(Sprite).spriteFrame = this.BetLess_off;
            this.betLessBtn.getComponent(Button).enabled = false;
        }
        if (this.stateConsole.TotalIndex < this.stateConsole.TotalArray.length - 1) {
            this.betPlusBtn.getComponent(Sprite).spriteFrame = this.BetAdd_act;
            this.betPlusBtn.getComponent(Button).enabled = true;
        }
        this.checkFeatureBuyButtonActive();
        this.getNode("HelpPage").getComponent(PayTableInit).checkPay();
        this.handleMiniSpin();
    }

    public checkFeatureBuyButtonActive() {
        if (this.featureBuyButton.isValid) {
            this.featureBuyButton.active = Data.Library.LuckyStrikeMaxBetting >= this.stateConsole.getRateXBet() * this.minLuckyStrikeNum;
        }
    }

    public OpenScroll() {
        if (this.stateConsole.isMenuOn == true) return;
        if (this.stateConsole.isAutoPlay == true) return;
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) return;

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('Btnclick')
            : this.getNode("BtnClick").getComponent(AudioSource).play();
        this.stateConsole.isMenuOn = true;
        this.ScrollIndex.Bet = this.stateConsole.BetIndex;
        this.ScrollIndex.Rate = this.stateConsole.RateIndex;
        this.ScrollIndex.Total = this.stateConsole.TotalIndex;
        find("Canvas/BaseGame/Page/BetSCroll/ScrollB/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Bet));
        find("Canvas/BaseGame/Page/BetSCroll/ScrollR/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Rate));
        find("Canvas/BaseGame/Page/BetSCroll/ScrollT/view/content").setPosition(0, (125 + 50 * this.ScrollIndex.Total));
        this.ScrollHL();
        this.getNode("BetSCroll").active = true;
        this.infoController.setPosition(360, 32);
    }

    // FeatureBuy
    public OpenFeatureBuyPage() {
        if (this.stateConsole.isMenuOn == true) return;
        if (this.stateConsole.isAutoPlay == true) return;
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) return;
        this._isClose = false;
        this.stateConsole.isMenuOn = true;
        let number = this.stateConsole.BetArray[this.stateConsole.BetIndex] * this.stateConsole.RateArray[this.stateConsole.RateIndex] * this.minLuckyStrikeNum;
        this.getNode("FeatureBuyNum").getComponent(Label).string = this.stateConsole.SpriteNumberInNumber(this.stateConsole.NumberToCent(number));
        this.getNode("FeatureBuyBlock").getComponent(Sprite).enabled = true;
        this.getNode("FeatureBuyPage").active = true;
        this.getNode("FeatureBuyBlock").active = true;
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('featurebuy_btn1')
            : this.getNode("Open").getComponent(AudioSource).play();
        this.getNode("FeatureBuyPage").getComponent(Animation).play("scaleIn");
    }

    _isClose = false;
    public CloseFeatureBuyPage() {
        if (this._isClose == true) return;
        this._isClose = true;
        this.getNode("FeatureBuyBlock").getComponent(Sprite).enabled = false;
        this.getNode("FeatureBuyPage").getComponent(Animation).play("scaleOut");

        if ((Data.Library as any)?.isNewAudio) {
            Data.Library.AudioController.playSfx('featurebuy_btn2');
            Data.Library.AudioController.playSfx('featurebuy_trans');
        } else {
            this.getNode("FeatureBuy/Close").getComponent(AudioSource).play();
            this.getNode("FeatureBuy/Trans").getComponent(AudioSource).play();
        }

        this.scheduleOnce(() => {
            this.stateConsole.isMenuOn = false;
            this.getNode("FeatureBuyPage").active = false;
            this.getNode("FeatureBuyBlock").active = false;
        }, 0.4);
    }

    public BuyFeature() {
        if (this._isClose == true) { return; }
        this.stateConsole.isMenuOn = false;
        this.getNode("FeatureBuyPage").active = false;
        this.getNode("FeatureBuyBlock").active = false;
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) { return; }

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('featurebuy_buyclick')
            : this.getNode("Buy").getComponent(AudioSource).play();
        this.stateConsole.Spin(true);
    }


    _passFlag = false;
    // Spin
    public ClickSpin() {
        if (this.stateConsole.isMenuOn == true) return;
        if (this.stateConsole.isAutoPlay === true) {
            this.AutoPages.AutoStop();
            return;
        }

        if (this.miniSpinBlock()) {
            Logger.debug("Mini spin is blocked.");
            return;
        }

        if (this.stateConsole.CurState == Mode.FSM.K_IDLE) {
            this._passFlag = false;
            if ((Data.Library as any)?.isNewAudio) {
                Data.Library.AudioController.playSfx('Spinclick');
                Data.Library.AudioController.playSfx('SpinLoop', true);
            } else {
                this.getNode("SpinClick").getComponent(AudioSource).play();
                this.getNode("SpinLoop").getComponent(AudioSource).play();
            }

            this.stateConsole.Spin(false);
        } else {
            if ((Data.Library as any)?.isNewAudio) {
                Data.Library.AudioController.playSfx('Btnclick');
                Data.Library.AudioController.stopSfx('SpinLoop');
            } else {
                this.getNode("BtnClick").getComponent(AudioSource).play();
                this.getNode("SpinLoop").getComponent(AudioSource).stop();
            }
            if (this.stateConsole.CurState == Mode.FSM.K_SPINSTOPING && this._passFlag == false) {
                this._passFlag = true;
                this.stateConsole.reelPassSpin();
            }
        }
    }

    public miniSpinBlock() {
        if (this.stateConsole.miniSpinCost && this.stateConsole.miniSpinCost > this.stateConsole.getCurTotoBetInCent()) {
            if (UCoin.running === false)
                return true;
        }
    }

    public handleSpinAnm(state: number) {
        switch (state) {
            case 0: //idle
                this.spinState = 0;
                this.getNode("SpinAnm").getComponent(sp.Skeleton).clearTracks();
                this.getNode("SpinAnm").getComponent(sp.Skeleton).setToSetupPose();
                this.getNode("SpinAnm").getComponent(sp.Skeleton).setAnimation(0, 'idle', true);
                break;
            case 1:  //start
                this.spinState = 1;
                this.getNode("SpinAnm").getComponent(sp.Skeleton).addAnimation(1, 'loop', true);
                this.getNode("SpinAnm").getComponent(sp.Skeleton).addAnimation(2, 'begin', false);
                break;
            case 2:  //win
                this.spinState = 2;
                this.getNode("SpinAnm").getComponent(sp.Skeleton).clearTracks();
                this.getNode("SpinAnm").getComponent(sp.Skeleton).setToSetupPose();
                this.getNode("SpinAnm").getComponent(sp.Skeleton).addAnimation(0, 'idle', true);
                break;
            case 3:  //auto
                this.spinState = 3;
                this.getNode("SpinAnmAuto").active = true;
                this.getNode("SpinAnmAuto").getComponent(sp.Skeleton).clearTracks();
                this.getNode("SpinAnmAuto").getComponent(sp.Skeleton).setToSetupPose();
                if (this.stateConsole.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_ALWAYS || this.stateConsole.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_TILLBONUS) {
                    this.getNode("SpinAnmAuto").getComponent(sp.Skeleton).addAnimation(0, 'always', true);
                } else if (this.stateConsole.AutoMode == Mode.AUTOPLAYMODE.AUTOPLAY_Num) {
                    this.getNode("SpinAnmAuto").getComponent(sp.Skeleton).addAnimation(0, 'auto', true);
                    this.getNode("SpinNum").getComponent(Label).string = this.stateConsole.SpriteNumberInNumber(this.stateConsole.AutoModeNum);
                    this.getNode("SpinNum").active = true;
                }
                this.getNode("SpinAnm").active = false;
                break;
            case 4:  //disabled
                this.getNode("SpinAnm").getComponent(sp.Skeleton).clearTracks();
                this.getNode("SpinAnm").getComponent(sp.Skeleton).setToSetupPose();
                this.getNode("SpinAnm").getComponent(sp.Skeleton).addAnimation(0, 'disabled', true);
                break;
            default:
                break
        }
    }

    //Help
    public HelpOpen() {
        if (this.stateConsole.isMenuOn == true) { return; }
        if (this.stateConsole.isAutoPlay == true) { return; }
        if (this.stateConsole.CurState != Mode.FSM.K_IDLE) { return; }

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        this.stateConsole.isMenuOn = true;
        this.settingsPage2.active = false;
        this.help_page = 0;
        this.getNode("HelpPage").active = true;
        this.getNode("HelpPage").getComponent(PayTableInit).checkPay();
        this.getNode("Pages").getComponent(Sprite).spriteFrame = this.HelpPages[0];
    }

    public HelpClose() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        this.stateConsole.isMenuOn = false;
        this.settingsPage2.active = true;
        this.getNode("HelpPage").active = false;
    }

    public HelpPlus() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        this.help_page += 1;
        if (this.help_page > this.HelpPages.length - 1)
            this.help_page = 0;
        this.getNode("Pages").getComponent(Sprite).spriteFrame = this.HelpPages[this.help_page];
    }

    public HelpLess() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : this.getNode("BtnClick2").getComponent(AudioSource).play();
        this.help_page -= 1;
        if (this.help_page < 0)
            this.help_page = this.HelpPages.length - 1;
        this.getNode("Pages").getComponent(Sprite).spriteFrame = this.HelpPages[this.help_page];
    }

    // =================================
    // 📚 教學系統控制區
    // =================================

    /** 是否不再顯示教學的標記 */
    nevetTeach = false;
    /** 教學自動關閉計時器 */
    autoCloseTeach = 0;

    /**
     * 關閉教學頁面
     * 隱藏教學界面並在移動裝置上嘗試進入全螢幕模式
     */
    public CloseTeach() {
        this.autoCloseTeach = 0;
        this.getNode("Teacher").active = false;

        // 移動裝置全螢幕處理（iOS除外）
        if (sys.isMobile == true && sys.os != sys.OS.IOS) {
            if (window["psapi"] && !window["psapi"].allowFullscr) return;
            screen.requestFullScreen();

            // 安全起見，延遲檢查是否全螢幕成功
            this.scheduleOnce(() => {
                if (!screen.fullScreen()) {
                    // 再次嘗試進入全螢幕，透過點擊事件觸發
                    const canvas = document.getElementById('GameCanvas');
                    if (canvas) {
                        canvas.addEventListener("touchend", () => {
                            screen.requestFullScreen().catch(() => { });
                        }, { once: true });
                    }
                }
            }, 0.5);
        }

        // 將設定儲存到本地存儲
        sys.localStorage.setItem(Data.Library.DEF_GAMEID + '_teach', this.nevetTeach ? 'true' : 'false');
    }

    /**
     * 開啟「不再顯示教學」選項
     * 啟用此選項後，教學頁面將不會再自動顯示
     */
    public NeverTeachOn() {
        this.nevetTeach = true;
        this.getNode("NeverUseOn").active = true;
        this.getNode("NeverUseOff").active = false;
    }

    /**
     * 關閉「不再顯示教學」選項
     * 停用此選項後，教學頁面會在適當時機顯示
     */
    public NeverTeachOff() {
        this.nevetTeach = false;
        this.getNode("NeverUseOn").active = false;
        this.getNode("NeverUseOff").active = true;
    }

    /**
     * 測試用教學播放功能
     * 手動開啟教學頁面並播放教學影片
     */
    public TestTeachPlayOnClick() {
        this.getNode("Teacher").active = true;
        this.getNode("VideoPlayer").getComponent(VideoPlayer).play();
    }
}

/**
 * =================================
 * 📋 UIController 總覽
 * =================================
 * 
 * 此檔案為老虎機遊戲的主要UI控制器，負責管理整個遊戲介面的交互邏輯。
 * 
 * 🎯 主要功能模組：
 * 
 * 1. 📦 滾輪系統 (Scroll System)
 *    - 三種滾輪類型：賠率(Rate)、下注(Bet)、總注(Total)
 *    - 支援滑動和按鈕控制
 *    - 自動計算下注組合關係
 * 
 * 2. 🎮 按鈕控制 (Button Controls)  
 *    - 主要遊戲按鈕：下注、贏分、加速
 *    - 設定按鈕：音效、選單切換
 *    - 視覺回饋和狀態管理
 * 
 * 3. 🎯 狀態管理 (State Management)
 *    - 遊戲狀態變更處理
 *    - UI元件狀態同步
 *    - 按鈕啟用/停用邏輯
 * 
 * 4. 🎪 特殊功能 (Special Features)
 *    - 特殊功能購買系統
 *    - 自動遊戲控制
 *    - 教學系統管理
 * 
 * 5. 🔧 工具函數 (Utility Functions)
 *    - 事件綁定輔助
 *    - 數值限制和驗證
 *    - UI更新和同步
 * 
 * 🔗 依賴關係：
 * - StateConsole: 遊戲狀態管理
 * - GameVariable: 遊戲變數控制  
 * - MathConsole: 數學運算處理
 * - CommonLibScript: 通用工具函數
 * 
 * 📱 支援平台：
 * - 桌面瀏覽器
 * - 移動裝置 (iOS/Android)
 * - 響應式UI適配
 * 
 * 🎨 UI架構：
 * - 模組化設計，功能分離
 * - 事件驅動的交互模式
 * - 統一的視覺回饋系統
 * 
 * 💡 設計模式：
 * - 單例模式 (通過Data.Library.UIcontroller存取)
 * - 觀察者模式 (事件廣播處理)
 * - 狀態模式 (遊戲狀態管理)
 */