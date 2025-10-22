import { _decorator, Component, Node, Sprite, SpriteFrame, sp, find,Font, log, SpriteAtlas, Label, LabelAtlas, Texture2D, Animation, UITransform, color } from 'cc';
import { Data } from '../DataController';
import { FontMapController } from '../FontMapController';

const { ccclass, property } = _decorator;
let MessageConsole: Node = null;

/** 橫幅控制器 - 負責管理遊戲中的橫幅顯示、動畫和轉換 */
@ccclass('BannerController')
export class BannerController extends Component {
    // UI 元件
    @property({ type: Sprite }) BannerText: Sprite; // 橫幅圖片精靈
    @property({ type: Label }) WinText: Label; // 贏金文字標籤
    @property({ type: Font }) WinTextFont: Font; // 贏金字體圖集


    @property({ type: SpriteFrame }) pageFrame: Array<SpriteFrame>; // 橫幅頁面框架陣列
    @property({ type: Label }) oneRoundScore: Label; // 單輪分數標籤

    // 計時器和狀態
    timer = 0; // 計時器，用於控制橫幅顯示持續時間
    pageCount = 0; // 目前頁面計數
    FontMap: { [key: string]: string } = null; // 數字字體映射
    scoreTextMap: { [key: string]: string } = null; // 分數文字映射

    MaxWidth = 512; // 最大寬度
    RunState = 0; // 執行狀態：0 = 淡出模式，1 = 滾動模式

    fiveLineAnmNode = null; // 五線動畫節點
    fiveLineAnm = null; // 五線動畫骨架

    protected onLoad(): void {
        // 初始化全域橫幅資料，若已存在則銷毀重複物件
        console.log('[BannerController] onLoad 初始化開始');
        if (Data.Library.BannerData === null) {
            Data.Library.BannerData = this;
            console.log('[BannerController] ✓ 已設定為全域 BannerData');
        }
        else {
            // 銷毀重複的控制器實例
            console.log('[BannerController] ⚠ 偵測到重複實例，禁用此物件');
            return;
        }
    }

    start() {
        // 找到訊息控制器
        console.log('[BannerController] start() 初始化開始');
        MessageConsole = find("MessageController");
        
        // 初始化橫幅數字字體映射
        let num = new FontMapController;
        this.FontMap = num.BannerNumInit();
        console.log('[BannerController] ✓ 字體映射已初始化');

        // 初始化分數文字映射
        let score = new FontMapController;
        this.scoreTextMap = score.SlotWinNumInit();
        console.log('[BannerController] ✓ 分數文字映射已初始化');

        // 尋找五線動畫節點
        this.fiveLineAnmNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/FiveLineAnm");
        this.fiveLineAnm = this.fiveLineAnmNode.getComponent(sp.Skeleton);
        console.log('[BannerController] ✓ 五線動畫節點已載入');
        
        // 設定五線動畫完成回呼函數
        this.fiveLineAnm.setCompleteListener((trackEntry) => {
            if (trackEntry.animation.name === 'begin') {
                console.log('[BannerController] 五線動畫完成');
                this.fiveLineAnmNode.active = false; // 動畫結束後隱藏節點
            }
        })
    }

    /** 設定數字（用於顯示贏金） */
    setNumber(numberString: String) {
        console.log('[BannerController] setNumber() 調用 - 數字:', numberString);
        // 若贏金為 0，不顯示
        if (Data.Library.MathConsole.getWinData()._wintotalcredit == 0) { 
            console.log('[BannerController] 贏金為 0，不顯示');
            return; 
        }
            
        // 將數字字符串轉換為字體映射文字
        this.WinText.string = "";
        for (let i = 0; i < numberString.length; i++) {
            this.WinText.string += this.FontMap[numberString[i]];
        }
        console.log('[BannerController] ✓ 贏金文字已設定:', this.WinText.string);
        
        // 如果包含「t」標記，播放動畫
        if (numberString.indexOf("t") > -1) {
            console.log('[BannerController] 播放贏金動畫');
            this.WinText.getComponent(Animation).play("ScaleJumpWinTxt");
        }
    }

    /** 設定單輪分數顯示 */
    OneRoundScore(numberString) {
        console.log('[BannerController] OneRoundScore() 調用 - 分數:', numberString);
        // 將數字轉換為字體映射文字
        this.oneRoundScore.string = "";
        for (let i = 0; i < numberString.length; i++) {
            this.oneRoundScore.string += this.scoreTextMap[numberString[i]];
        }
        console.log('[BannerController] ✓ 單輪分數已設定:', this.oneRoundScore.string);
        // 播放分數動畫
        this.oneRoundScore.getComponent(Animation).play("ScaleJumpWinTxt");
    }

    /** 播放五線動畫 */
    PlayFiveLineAnm() {
        console.log('[BannerController] PlayFiveLineAnm() 調用 - 開始播放五線動畫');
        this.fiveLineAnmNode.active = true;

        // 重置動畫狀態
        this.fiveLineAnm.clearTracks();
        this.fiveLineAnm.setToSetupPose();
        
        // 播放「開始」動畫
        console.log('[BannerController] ✓ 五線動畫已播放');
        this.fiveLineAnm.setAnimation(0, 'begin_m', false);
    }

    /** 重置橫幅 - 切換到下一頁面 */
    resetBanner() {
        this.timer = 0;
        this.pageCount++;
        this.pageCount = this.pageCount % this.pageFrame.length; // 循環頁面
        console.log('[BannerController] resetBanner() - 切換到頁面:', this.pageCount);
        
        // 設定新的橫幅圖片
        this.BannerText.spriteFrame = this.pageFrame[this.pageCount];
        
        // 判斷是否為寬橫幅（寬度 >= 500），決定顯示模式
        if (this.pageFrame[this.pageCount].getRect().width >= 500) {
            // 寬橫幅：使用滾動模式
            console.log('[BannerController] 寬橫幅 - 使用滾動模式');
            this.BannerText.getComponent(UITransform).setAnchorPoint(0, 0.5);
            this.BannerText.node.setPosition(-200, 0);
            this.BannerText.color = color(255, 255, 255, 0);
            this.RunState = 1; // 滾動模式
        } else {
            // 窄橫幅：使用淡出模式
            console.log('[BannerController] 窄橫幅 - 使用淡出模式');
            this.BannerText.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
            this.BannerText.node.setPosition(0, 0);
            this.BannerText.color = color(255, 255, 255, 0);
            this.RunState = 0; // 淡出模式
        }
    }

    /** 主更新迴圈 - 控制橫幅的顯示效果（淡出或滾動） */
    update(deltaTime: number) {
        let change = false; // 標記是否需要切換到下一頁面
        
        // 限制最大 deltaTime，防止幀率波動
        if (deltaTime > 0.05) deltaTime = 0.05;
        
        this.timer += deltaTime;
        
        // 淡出模式：等待 2 秒後逐漸淡出
        if (this.timer >= 2 && this.RunState == 0) {
            let c = this.BannerText.color.a - 765 * deltaTime; // 淡出速度
            if (c <= 0) {
                console.log('[BannerController] 淡出模式 - 淡出完成，準備切換');
                this.BannerText.color = color(255, 255, 255, 0);
                change = true; // 完全淡出，準備切換
            } else {
                this.BannerText.color = color(255, 255, 255, c);
            }
        } 
        // 滾動模式：寬橫幅從左邊滾動到右邊
        else if (this.RunState == 1) {
            let run = this.timer * 200; // 滾動距離
            this.BannerText.node.setPosition(-200 - run, 0);
            
            // 檢查是否已滾動超出螢幕
            if (run >= this.pageFrame[this.pageCount].getRect().width + 55) {
                console.log('[BannerController] 滾動模式 - 滾動完成，準備切換');
                change = true; // 滾動完成，準備切換
            }
            
            // 淡入效果
            if (this.BannerText.color.a < 255) {
                let c = this.BannerText.color.a + 765 * deltaTime;
                if (c >= 255) {
                    this.BannerText.color = color(255, 255, 255, 255);
                } else {
                    this.BannerText.color = color(255, 255, 255, c);
                }
            }
        } 
        // 預設模式：無動作，只有淡入
        else {
            if (this.BannerText.color.a < 255) {
                let c = this.BannerText.color.a + 765 * deltaTime;
                if (c >= 255) {
                    this.BannerText.color = color(255, 255, 255, 255);
                } else {
                    this.BannerText.color = color(255, 255, 255, c);
                }
            }
        }
        
        // 如果準備切換，重置並載入下一頁面
        if (change == true) {
            this.resetBanner();
        }
    }
}