// 引入 Cocos Creator 核心模組和組件
import { _decorator, Component, Node, find, Label, input, Input, EventTouch, LabelAtlas, sp, log, tween, Sprite, Color, Animation, Button, SpriteFrame, Skeleton, AudioSource, UITransform } from 'cc';
import { AudioController } from './AudioController';
import { Data, Mode } from './DataController';
import { AllNode } from './LibCreator/libScript/CommonLibScript';
import { UCoin } from './LibCreator/libScript/JackpotScript/UCoin/UCoin';
import { ReelController } from './ReelController/ReelController';
const { ccclass, property } = _decorator;

let MessageConsole: Node = null; // 訊息控制台節點
let DropSymbolMap = null; // 掉落符號映射表

/**
 * 動畫控制器類別
 * 負責管理遊戲中所有動畫效果，包括：
 * - 大獎動畫（BigWin, MegaWin, SuperWin等）
 * - 橫幅廣告動畫
 * - 背景動畫
 * - 特殊場景轉場動畫
 */
@ccclass('AnimationController')
export class AnimationController extends Component {
    static Instance: AnimationController = new AnimationController(); // 單例模式實例
    @property({ type: SpriteFrame }) BannerArray = []; // 橫幅圖片陣列
    @property({ type: ReelController }) reelController; // 滾輪控制器
    @property({ type: AudioController }) audioController; // 音效控制器

    TransAnm; // 轉場動畫節點
    BigWinAnm; // 大獎動畫節點

    winBarNode; // 獲勝條節點
    WinBarAnm; // 獲勝條動畫
    BannerText; // 橫幅文字節點
    
    BkgAnmNode; // 背景動畫節點（主遊戲）
    BkgAnm; // 背景動畫組件（主遊戲）
    BkgAnmFsNode; // 背景動畫節點（免費遊戲）
    BkgAnmFs; // 背景動畫組件（免費遊戲）
    WinBarType = -1; // 獲勝條類型
    WinBarState = -1; // 獲勝條狀態
    scroll_num = 0; // 滾動數字當前值
    scroll_flag: boolean = false; // 滾動標記
    scroll_stop: boolean = false; // 滾動停止標記
    scroll_stop_time = 0; // 滾動停止計時
    five_anm_show = 0; // 五級動畫顯示索引
    five_anm_name: string[] = ["bigwin", "megawin", "superwin", "ultrawin", "ultimatewin"]; // 五級動畫名稱

    SlotWinNode; // 單輪得分節點
    tempRateIndex=null; // 暫存此把押注倍率

    /**
     * 載入時執行
     * 設定單例模式實例
     */
    protected onLoad(): void {
        AnimationController.Instance = this;
    }
    
    /**
     * 開始時執行
     * 初始化所有動畫節點和組件
     */
    /**
     * 開始時執行
     * 初始化所有動畫節點和組件
     */
    start() {
        MessageConsole = find("MessageController");
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;

        this.TransAnm = find("Canvas/BaseGame/Trans"); // 轉場動畫節點

        this.BigWinAnm = find("Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm"); // 大獎動畫節點
        this.winBarNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinBarAnm"); // 獲勝條節點
        this.WinBarAnm = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinBarAnm").getComponent(sp.Skeleton); // 獲勝條骨骼動畫
        this.BannerText = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBgCover/BannerText"); // 橫幅文字

        this.BkgAnmNode = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnm"); // 主遊戲背景動畫節點
        this.BkgAnm = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnm").getComponent(sp.Skeleton); // 主遊戲背景骨骼動畫
        this.BkgAnmFsNode = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnmFs"); // 免費遊戲背景動畫節點
        this.BkgAnmFs = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnmFs").getComponent(sp.Skeleton); // 免費遊戲背景骨骼動畫

        this.SlotWinNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/OneRoundScore"); // 單輪得分節點
    }

    /**
     * 每幀更新
     * @param deltaTime 幀間隔時間
     */
    update(deltaTime: number) {
        if (this.scroll_flag == false) { return; }
            
        this.ScroingWin(deltaTime); // 執行滾動獲勝數字動畫
    }

    /**
     * 處理廣播事件
     * @param data 事件資料
     */
    /**
     * 處理廣播事件
     * @param data 事件資料
     */
    HandleBroadcast(data: any) {
        switch(data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY: break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                this.HandleStateChange(data.EnventData);
                // 根據當前場景顯示或隱藏基礎UI
                AllNode.Data.Map.get("BsUI").active = Data.Library.StateConsole.CurScene === Mode.SCENE_ID.BASE ? true : false;
                break;

            default: break;
        }
    }

    LocalCent = 0; // 本地金幣暫存
    _preTrigger = false; // 前置觸發標記
    
    /**
     * 處理狀態變化
     * @param state 當前遊戲狀態
     */
    HandleStateChange(state: Mode.FSM) {
        switch (state) {
            case Mode.FSM.K_IDLE: break; // 閒置狀態

            case Mode.FSM.K_SPIN: 
                this.BkgAnmSwitch(false); // 關閉背景動畫                
                this.tempRateIndex=null; // 清空暫存倍率
                break;

            case Mode.FSM.K_SPINSTOPING: // 滾輪停止中
                this.LocalCent = Data.Library.StateConsole.PlayerCent;
                break;

            case Mode.FSM.K_EXPEND:
            case Mode.FSM.K_FEATURE_EXPEND: break; // 擴展狀態
            case Mode.FSM.K_DROP:
            case Mode.FSM.K_FEATURE_DROP: break; // 掉落狀態

            case Mode.FSM.K_SHOWWIN: // 顯示獲勝
            case Mode.FSM.K_FEATURE_SHOWWIN: 
            if (!UCoin.running) {
                // 計算本地金幣（玩家金幣 + 本輪獲勝金額）
                this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.MathConsole.getWinData()._wintotalcredit);
                if (Data.Library.StateConsole.CurScene == Mode.SCENE_ID.FEATURE0) {
                    // 在免費遊戲中使用總獲勝金額
                    this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin);
                }
                Data.Library.StateConsole.setCredit(this.LocalCent);
            }
            break;
            case Mode.FSM.K_WAIT: // 等待狀態
            case Mode.FSM.K_FEATURE_WAIT:
                if (Data.Library.MathConsole.getWinData()._wintotalcredit > 0) {
                    if (this._preTrigger == true) {
                        // 更新獲勝金額顯示
                        find("Canvas/BaseGame/Layer/Shake/UI/InfoController/WinBtn/Win").getComponent(Label).string = Data.Library.StateConsole.NumberToCent(Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin));
                        find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).color = new Color(255, 255, 255, 255);
                    }

                    
                    this.SetBannerNumber(Data.Library.MathConsole.getWinData()._wintotalcredit, 't');
                    // 停止獲勝滾動音效
                    find("AudioController/WinRolling/Loop").getComponent(AudioSource).stop();
                    find("AudioController/WinRolling/End").getComponent(AudioSource).play();
                    this.BigWinAnm.active = false;
                }
                break;

            case Mode.FSM.K_FEATURE_SHOWSCATTERWIN: break; // 顯示Scatter獲勝

            case Mode.FSM.K_FEATURE_TRANSLATE: // 免費遊戲轉場
                find("AudioController/WinRolling/Loop").getComponent(AudioSource).stop();
                find("AudioController/WinRolling/End").getComponent(AudioSource).play();
                this.BkgAnmActive('');
                if (!UCoin.running) {
                    this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.MathConsole.getWinData()._wintotalcredit);
                    Data.Library.StateConsole.setCredit(this.LocalCent);
                }
                this.SetBannerNumber(Data.Library.MathConsole.getWinData()._wintotalcredit)
                this.BigWinAnm.active = false;

                // 顯示轉場動畫
                this.TransAnm.active = true;
                Mode.ShowSpine(this.TransAnm.getComponent(sp.Skeleton), 0, "begin", false, null);
                this.TransAnm.getComponent(sp.Skeleton).addAnimation(0, 'loop', true);

                // 延遲顯示轉場按鈕和數字
                this.scheduleOnce(function () {
                    find("Canvas/BaseGame/Trans/TransBtN").active = true;
                    find("Canvas/BaseGame/Trans/TransBtN").getComponent(Button).enabled = false;
                    find("Canvas/BaseGame/Trans/TransBtN").getComponent(Animation).play("fadeIn");

                    find("Canvas/BaseGame/Trans/TransNum").active = true;
                    find("Canvas/BaseGame/Trans/TransNum").getComponent(Sprite).color = new Color(255, 255, 255, 0);
                    find("Canvas/BaseGame/Trans/TransNum").getComponent(Animation).play("fadeIn");
                }, 0.2);
                break;
            case Mode.FSM.K_FEATURE_WAIT_START: // 等待免費遊戲開始
                this.HandleWinBar();
                AllNode.Data.Map.get("SettingsPage").active = false;
                Data.Library.MathConsole.getWinData()._wintotalcredit = 0;
                find("Canvas/BaseGame/Trans/TransBtN").getComponent(Button).enabled = true;
                break;
            case Mode.FSM.K_FEATURE_SPIN: // 免費遊戲旋轉
                this.HandleFeatureSpin();
                break;
            case Mode.FSM.K_FEATURE_SPINSTOPING: // 免費遊戲停止中
                if (!UCoin.running) {
                    this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin);
                    Data.Library.StateConsole.setCredit(this.LocalCent);
                }
                break;
            case Mode.FSM.K_FEATURE_RETRIGGER: // 免費遊戲重新觸發
                if (this.WinBarType < 0) {
                    find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).color = new Color(255, 255, 255, 255);
                }
                this._preTrigger = true;
                break;
            case Mode.FSM.K_FEATURE_CHEKRESULT:
                let WinString = Data.Library.StateConsole.SpriteNumberInNumber(Data.Library.StateConsole.NumberToCent(Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin)));
                this.TransAnm.active = true;
                Mode.ShowSpine(this.TransAnm.getComponent(sp.Skeleton), 0, "begin", false, null);
                this.TransAnm.getComponent(sp.Skeleton).addAnimation(0, 'loop', true);
                // AllNode.Data.Map.get("TransTextAnm").active = true;
                // Mode.ShowSpine(AllNode.Data.Map.get("TransTextAnm").getComponent(sp.Skeleton), 0, "won_begin", false, null);
                // AllNode.Data.Map.get("TransTextAnm").getComponent(sp.Skeleton).addAnimation(0, 'won_loop', true);
                find("Canvas/BaseGame/Trans/TransEnd").active = true;
                find("Canvas/BaseGame/Trans/TransEnd").getComponent(Sprite).color = new Color(255, 255, 255, 0);
                find("Canvas/BaseGame/Trans/TransEnd").getComponent(Animation).play("fadeIn");
                AllNode.Data.Map.get("CheckResultNum").active = true;
                AllNode.Data.Map.get("CheckResultNum").getComponent(Label).string = WinString;
                find("Canvas/BaseGame/Trans/TransNum").active = false;
                find("Canvas/BaseGame/Trans/TransBtN").active = false;

                AllNode.Data.Map.get("SettingsPage").active = true;
                this.scheduleOnce(() => {
                    Data.Library.MathConsole.getWinData()._wintotalcredit = Data.Library.StateConsole.FeatureTotalWin;
                    this.WinBarAnm.setToSetupPose();
                    this.HandleWinBar();
                    this.WinBarAnm.color = new Color(255, 255, 255, 255);
                    this.winBarNode.active = false;
                    Data.Library.BannerData.resetBanner();
                    this.BannerText.active = true;
                    this.TransAnm.getComponent(sp.Skeleton).setAnimation(1, 'end', false);
                    //AllNode.Data.Map.get("TransTextAnm").getComponent(sp.Skeleton).setAnimation(1, 'won_end', false);
                    find("Canvas/BaseGame/Trans/TransEnd").getComponent(Sprite).color = new Color(255, 255, 255, 255);
                    find("Canvas/BaseGame/Trans/TransEnd").getComponent(Animation).play("fadeOut");
                    AllNode.Data.Map.get("CheckResultNum").active = false;
                    this.BkgAnmActive('MainGame');
                }, 3.3);
                this.scheduleOnce(() => {
                    this.TransAnm.active = false;
                    // AllNode.Data.Map.get("TransTextAnm").active = false;
                }, 3.9);
                this.scheduleOnce(() => {
                    this.ShowBannerAnm();
                    let WinNumber = Data.Library.StateConsole.FeatureTotalWin;
                    this.ShowOneRoundScore(true,WinNumber);
                }, 4.5)
                break;
            default:
                break;
        }
    }

    /**
     * 切換背景動畫
     * @param BkgStr 背景字串 ('MainGame' 為主遊戲背景, 否則為免費遊戲背景)
     */
    BkgAnmActive(BkgStr: string) {
        let occur = BkgStr == 'MainGame' ?true :false;
        this.BkgAnmNode.active = occur; // 主遊戲背景
        this.BkgAnmFsNode.active = !occur; // 免費遊戲背景

        if(occur) {
            Mode.ShowSpine(this.BkgAnm, 0, "idle", true, null);
        } else {
            Mode.ShowSpine(this.BkgAnmFs, 0, "idle", true, null);
        }
    }

    /**
     * 切換背景動畫狀態（獲勝/閒置）
     * @param occur true為獲勝動畫, false為閒置動畫
     */
    BkgAnmSwitch(occur: boolean) {
        // 根據當前場景選擇對應的背景動畫
        let bkg = Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE ?this.BkgAnm :this.BkgAnmFs;
        if(occur) {
            // 獲勝動畫
            bkg.setAnimation(0, "win_begin", false);
            bkg.addAnimation(0, "win_loop", true);

            if(Data.Library.StateConsole.CurScene != Mode.SCENE_ID.BASE) {
                bkg.addAnimation(1, "multiple_open", false);
            }
        } else {
            // 閒置動畫
            bkg.setAnimation(0, "idle", true);

            if(Data.Library.StateConsole.CurScene != Mode.SCENE_ID.BASE) {
                bkg.addAnimation(1, "multiple_close", false);
            }
        }
    }

    /**
     * 處理免費遊戲旋轉
     */
    /**
     * 處理免費遊戲旋轉
     */
    HandleFeatureSpin() {
        this._preTrigger = false;
        AllNode.Data.Map.get("SettingsPage").active = false;
        // 如果有獲勝且倍率面板開啟中，準備顯示獲勝線
        if (Data.Library.MathConsole.getWinData()._wintotalcredit&&this.BkgAnmFs.getCurrent(1)&&this.BkgAnmFs.getCurrent(1).animation.name=="multiple_open") {
            this.Prep_ShowWinLine(false);
        }
    }

    /**
     * 準備顯示獲勝線
     * @param occur true為顯示, false為隱藏
     */
    Prep_ShowWinLine(occur: boolean) {
        this.BkgAnmSwitch(occur);

        this.winBarNode.active = occur;
        this.BannerText.active = !occur;
    }

    /**
     * 處理獲勝條顯示
     * 根據當前場景（主遊戲/免費遊戲）設定對應的橫幅圖片
     */
    HandleWinBar() {
        let nowScene = Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE ?0 :1;

        find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).spriteFrame = this.BannerArray[nowScene];
    }

    /**
     * 顯示單輪得分
     * @param occur 是否顯示
     * @param winScore 獲勝分數
     */
    ShowOneRoundScore(occur: boolean, winScore: number) {
        this.SlotWinNode.active = occur;
        if(occur) {
            //let str = Data.Library.StateConsole.NumberToCent(Data.Library.StateConsole.credit2CentbyCurRate(winScore));
            // 如果還沒暫存倍率，使用當前倍率
            if(this.tempRateIndex==null){ 
                this.tempRateIndex=Data.Library.StateConsole.RateIndex;
            }
            let str=Data.Library.StateConsole.NumberToCent(winScore*Data.Library.StateConsole.RateArray[this.tempRateIndex]);
            Data.Library.BannerData.OneRoundScore(str);
            // 在免費遊戲中不播放淡入動畫
            if(Data.Library.StateConsole.CurScene !== Mode.SCENE_ID.FEATURE0){
                this.SlotWinNode.getComponent(Animation).play('fadeIn');
            }            
        }
    }

    /**
     * 顯示橫幅動畫（獲勝動畫）
     */
    ShowBannerAnm() {
        this.scroll_num = 0;
        this.scroll_flag = true;
        this.scroll_stop = false;
        this._bigWinSkip = 0;
        this.scroll_stop_time = 0;
        this.five_anm_show = 0;
        find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).color = new Color(255, 255, 255, 255);
        if (Data.Library.MathConsole.getWinData()._wintotalcredit >= 15 * Data.Library.StateConsole.getCurTotalBet()) {  // 大獎（15倍以上）
            this.audioController.PlayingRandomBigWinSound();
            this.BigWinAnm.active = true;
            this.BigWinAnm.getChildByName("Node1").active = true;
            this.BigWinAnm.getChildByName("Node2").active = false;
            this.BigWinAnm.getChildByName("Node3").active = false;

            // 清除舊的骨骼動畫
            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinSlogan").getComponent(sp.Skeleton));
            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinSlogan2").getComponent(sp.Skeleton));
            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinTitle").getComponent(sp.Skeleton));
            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinTitle2").getComponent(sp.Skeleton));

            // 播放BigWin動畫
            Mode.ShowSpine(this.BigWinAnm.getChildByName("Node1").getComponent(sp.Skeleton), 0, "bigwin_begin", false, null);
            this.BigWinAnm.getChildByName("Node1").getComponent(sp.Skeleton).addAnimation(0, 'bigwin_loop', true);

            find("AudioController").getComponent(AudioController).MusicState = 2;
            this.PlayWinUpdate();
        } else {  // 小獎（15倍以下）
            //this.audioController.PlayingRandomWinSound();
            Mode.ShowSpine(this.WinBarAnm, 0, "loop2", true, null);
            this.WinBarAnm.color = new Color(255, 255, 255, 255);            
            find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBg").active = false;
            this.WinBarType = 2;
        }
    }

    _bigWinSkip = 0; // 大獎跳過標記

    /**
     * 開始免費遊戲動畫
     */
    StartFsAnm() {
        find("AudioController/BtnClick").getComponent(AudioSource).play();
        this.TransAnm.getComponent(sp.Skeleton).setAnimation(1, 'end', false);
        // AllNode.Data.Map.get("TransTextAnm").getComponent(sp.Skeleton).setAnimation(1, 'trans_end', false);
        find("Canvas/BaseGame/Trans/TransBtN").getComponent(Button).enabled = false;
        find("Canvas/BaseGame/Trans/TransBtN").getComponent(Animation).play("fadeOut");
        find("Canvas/BaseGame/Trans/TransNum").getComponent(Sprite).color = new Color(255, 255, 255, 255);
        find("Canvas/BaseGame/Trans/TransNum").getComponent(Animation).play("fadeOut");
        this.scheduleOnce(() => {
            this.TransAnm.active = false;
            Data.Library.StateConsole.nextState();
        }, 0.5);
    }

    /**
     * 播放獲勝動畫更新（五級大獎動畫）
     */
    /**
     * 播放獲勝動畫更新（五級大獎動畫）
     */
    PlayWinUpdate() {
        if (this._bigWinSkip == 2) { return; }

        // 隨機選擇動畫編號（1-6）
        let RanAnm = "0" + Math.floor(Math.random() * 6 + 1).toString();

        let solgn = this.BigWinAnm.getChildByName("BWinSlogan");
        let wtitle = this.BigWinAnm.getChildByName("BWinTitle");
        // 使用雙緩衝切換動畫（避免閃爍）
        if (this.five_anm_show % 2 == 1) {
            solgn = this.BigWinAnm.getChildByName("BWinSlogan2");
            wtitle = this.BigWinAnm.getChildByName("BWinTitle2");
            this.BigWinAnm.getChildByName("BWinSlogan").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
            this.BigWinAnm.getChildByName("BWinTitle").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
        }
        else if (this.five_anm_show > 0) {
            this.BigWinAnm.getChildByName("BWinSlogan2").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
            this.BigWinAnm.getChildByName("BWinTitle2").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
        }

        if (this.five_anm_show >= 1) {
            solgn.active=true;
        }

        Mode.ShowSpine(solgn.getComponent(sp.Skeleton), 0, "begin", false, RanAnm);
        solgn.getComponent(sp.Skeleton).addAnimation(0, 'loop', true);


        Mode.ShowSpine(wtitle.getComponent(sp.Skeleton), 0, "begin", false, this.five_anm_name[this.five_anm_show]);
        wtitle.getComponent(sp.Skeleton).addAnimation(0, 'loop', true);
        // 針對泰文進行位置調整
        if(Data.Library.RES_LANGUAGE === "tai"){
            wtitle.setScale(0.8,1);
            wtitle.setPosition(75,0);
        }            

        // 播放基礎大獎音效
        if (find("AudioController/BigWin/Base").getComponent(AudioSource).playing == false) {
            find("AudioController/BigWin/Base").getComponent(AudioSource).play();
        }
        // 根據等級播放對應音效
        if (this.five_anm_show >= 3) {
            find("AudioController/BigWin/Super").getComponent(AudioSource).play();
        } else if (this.five_anm_show == 2) {
            find("AudioController/BigWin/Mega").getComponent(AudioSource).play();
        } else if (this.five_anm_show == 1) {
            find("AudioController/BigWin/Big").getComponent(AudioSource).play();
        }
        this._bigWinSkip = 1;
    }

    /**
     * 滾動獲勝分數動畫
     * @param dt 時間增量
     */
    /**
     * 滾動獲勝分數動畫
     * @param dt 時間增量
     */
    ScroingWin(dt) {
        if (this.scroll_num >= Data.Library.MathConsole.getWinData()._wintotalcredit) {
            this.scroll_flag = false;
            return;
        }
        this.scroll_stop_time += dt;

        // 計算當前倍數和獲勝倍數
        let curMultiple = this.scroll_num / Data.Library.StateConsole.getCurTotalBet();
        let winMultiple = Data.Library.MathConsole.getWinData()._wintotalcredit / Data.Library.StateConsole.getCurTotalBet();
        let range = Data.Library.NEW_SCORING_WIN.Range.length;
        // 根據倍數範圍計算速度
        for (let i = 1; i < Data.Library.NEW_SCORING_WIN.Range.length; i++) {
            if (curMultiple < Data.Library.NEW_SCORING_WIN.Range[i]) {
                range = i;
                break;
            }
        }

        // 計算滾動速度
        let speed = ((winMultiple - Data.Library.NEW_SCORING_WIN.Range[Data.Library.NEW_SCORING_WIN.Range.length - 1]) * Data.Library.StateConsole.getCurTotalBet()) / Data.Library.NEW_SCORING_WIN.Time[range];
        if (range < Data.Library.NEW_SCORING_WIN.Range.length) {
            speed = ((Data.Library.NEW_SCORING_WIN.Range[range] - Data.Library.NEW_SCORING_WIN.Range[range - 1]) * Data.Library.StateConsole.getCurTotalBet()) / Data.Library.NEW_SCORING_WIN.Time[range];
        }

        // 根據獲勝金額選擇滾動方式
        if(Data.Library.MathConsole.getWinData()._wintotalcredit < 5 * Data.Library.StateConsole.getCurTotalBet()){
            // 小於5倍直接跳到最終值
            this.scroll_num=Data.Library.MathConsole.getWinData()._wintotalcredit;
            this.scroll_flag = false;
        }else if (Data.Library.MathConsole.getWinData()._wintotalcredit >= Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.big] * Data.Library.StateConsole.getCurTotalBet()) {            
            // 大獎使用固定速度
            this.scroll_num += speed * Data.Library.NEW_SCORING_WIN.DelaTime;
        } else {
            // 一般獎勵播放滾動音效並使用動態速度
            if (find("AudioController/WinRolling/Loop").getComponent(AudioSource).playing == false) {
                find("AudioController/WinRolling/Loop").getComponent(AudioSource).play();
            }
            this.scroll_num += Data.Library.MathConsole.getWinData()._wintotalcredit * dt;
        }

        let next: boolean = false;
        if (this.scroll_num >= Data.Library.MathConsole.getWinData()._wintotalcredit || this.scroll_stop == true) {
            this.scroll_num = Data.Library.MathConsole.getWinData()._wintotalcredit;
            this.scroll_flag = false;
            next = true
        }

        // 更新顯示數字
        this.SetBannerNumber(this.scroll_num);
        //this.ShowOneRoundScore(true,this.scroll_num);BannerWin就不再更新上面小黑塊分數
        this.reelController.ShowDark(true);
        if (Data.Library.MathConsole.getWinData()._wintotalcredit >= 15 * Data.Library.StateConsole.getCurTotalBet()) {
            // 更新大獎文字顯示
            this.BigWinAnm.getChildByName("BWinTxt").getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(Data.Library.StateConsole.NumberToCent(Math.floor(Data.Library.StateConsole.credit2CentbyCurRate(this.scroll_num))));
            this.BigWinAnm.getChildByName("BWinTxt").getComponent(Label).color = new Color(255, 255, 255, 255);
        }

        if (next) {
            // 滾動結束處理
            this._bigWinSkip = 2;
            if (Data.Library.MathConsole.getWinData()._wintotalcredit >= 15 * Data.Library.StateConsole.getCurTotalBet()) {
                find("AudioController/BigWin/Base").getComponent(AudioSource).stop();
                find("AudioController/BigWin/End").getComponent(AudioSource).play();

                let solgn = this.BigWinAnm.getChildByName("BWinSlogan");
                let wtitle = this.BigWinAnm.getChildByName("BWinTitle");
                if (this.five_anm_show % 2 == 1) {
                    solgn = this.BigWinAnm.getChildByName("BWinSlogan2");
                    wtitle = this.BigWinAnm.getChildByName("BWinTitle2");
                }
                solgn.getComponent(sp.Skeleton).addAnimation(1, 'result', false);
                wtitle.getComponent(sp.Skeleton).addAnimation(1, 'result', false);

                // 恢復背景音樂
                if (Data.Library.StateConsole.CurScene == Mode.SCENE_ID.FEATURE0) {
                    find("AudioController/FsMusic").getComponent(AudioSource).play();
                    find("AudioController").getComponent(AudioController).MusicState = 3;
                } else {
                    find("AudioController/BsMusic").getComponent(AudioSource).play();
                    find("AudioController").getComponent(AudioController).MusicState = 1;
                }
                this.scheduleOnce(function () {
                    solgn.getComponent(sp.Skeleton).addAnimation(2, 'end', false);
                    wtitle.getComponent(sp.Skeleton).addAnimation(2, 'end', false);

                    // 結束對應的節點動畫
                    if (this.BigWinAnm.getChildByName("Node3").active == true) {
                        this.BigWinAnm.getChildByName("Node3").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
                    } else if (this.BigWinAnm.getChildByName("Node2").active == true) {
                        this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
                    } else {
                        this.BigWinAnm.getChildByName("Node1").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
                    }
                    solgn.active=false;
                    this.BigWinAnm.getChildByName("BWinTxt").getComponent(Animation).play("fadeOutTxt");
                }, 2);
                this.scheduleOnce(function () {
                    Data.Library.StateConsole.nextState();
                }, 2.5);
            } else {
                // 小獎直接進入下一狀態
                this.scheduleOnce(function () {
                    Data.Library.StateConsole.nextState();
                }, 1.5);
            }
        } else if (Data.Library.StateConsole.is5levelBigwinShow() != Mode.FIVE_LEVEL_WIN_TYPE.non) {
            // 根據獲勝倍數觸發不同等級的大獎動畫
            if (this.scroll_num >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultimate]) && this.five_anm_show == 3) {
                // Ultimate Win（終極獎）
                this._bigWinSkip = 0;
                this.five_anm_show = 4;
                this.PlayWinUpdate();
            } else if (this.scroll_num >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultra]) && this.five_anm_show == 2) {
                // Ultra Win（超級獎）
                this._bigWinSkip = 0;
                this.five_anm_show = 3;
                this.PlayWinUpdate();
            } else if (this.scroll_num >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.super]) && this.five_anm_show == 1) {
                // Super Win（特級獎）
                this._bigWinSkip = 0;
                this.BigWinAnm.getChildByName("Node1").active = false;
                this.BigWinAnm.getChildByName("Node2").active = true;
                this.BigWinAnm.getChildByName("Node3").active = true;

                this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
                this.BigWinAnm.getChildByName("Node3").getComponent(sp.Skeleton).clearTracks();
                this.BigWinAnm.getChildByName("Node3").getComponent(sp.Skeleton).setToSetupPose();
                this.BigWinAnm.getChildByName("Node3").getComponent(sp.Skeleton).addAnimation(0, 'superwin_begin', false);
                this.BigWinAnm.getChildByName("Node3").getComponent(sp.Skeleton).addAnimation(0, 'superwin_loop', true);

                this.five_anm_show = 2;
                this.PlayWinUpdate();
            } else if (this.scroll_num >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.mega]) && this.five_anm_show == 0) {
                // Mega Win（巨額獎）
                this._bigWinSkip = 0;
                this.BigWinAnm.getChildByName("Node1").active = true;
                this.BigWinAnm.getChildByName("Node2").active = true;
                this.BigWinAnm.getChildByName("Node3").active = false;

                this.BigWinAnm.getChildByName("Node1").getComponent(sp.Skeleton).addAnimation(1, 'end', false);
                this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton).clearTracks();
                this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton).setToSetupPose();
                this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton).addAnimation(0, 'megawin_begin', false);
                this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton).addAnimation(0, 'megawin_loop', true);

                this.five_anm_show = 1;
                this.PlayWinUpdate();
            }
        }
    }

    /**
     * 設定橫幅數字顯示
     * @param num 要顯示的數字
     * @param strIdx 前綴字串（'w' 或 't'）
     */
    SetBannerNumber(num: number, strIdx: string = 'w') {
        Data.Library.BannerData.setNumber(strIdx + Data.Library.StateConsole.NumberToCent(Math.floor(Data.Library.StateConsole.credit2CentbyCurRate(num))));
    }

    /**
     * 停止大獎動畫（跳過滾動）
     * 直接加在 Cocos Dashboard 上面的按鈕
     * 'Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BigwinSkip'
     */
    StopBigWin() {
        if (this._bigWinSkip != 1) { return; }
        // 必須等待至少1秒才能跳過
        if (this.scroll_num < Data.Library.MathConsole.getWinData()._wintotalcredit && this.scroll_stop_time >= 1) {
            this._bigWinSkip = 2;
            let checkAnm = false;
            let checkTitle = false;
            // 判斷應該跳到哪個等級的大獎動畫
            if (Data.Library.MathConsole.getWinData()._wintotalcredit >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.super])) {
                if (Data.Library.MathConsole.getWinData()._wintotalcredit >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultimate]) && this.five_anm_show <= 4) {
                    this.five_anm_show = 4;
                    checkAnm = true;
                    checkTitle = true;
                } else if (Data.Library.MathConsole.getWinData()._wintotalcredit >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultra]) && this.five_anm_show <= 3) {
                    this.five_anm_show = 3;
                    checkAnm = true;
                    checkTitle = true;
                } else if (this.five_anm_show <= 2) {
                    this.five_anm_show = 2;
                    checkAnm = true;
                    checkTitle = true;
                }

                if (checkAnm == true) {
                    // 顯示 SuperWin 動畫（Node3）
                    this.BigWinAnm.getChildByName("Node1").active = false;
                    this.BigWinAnm.getChildByName("Node2").active = false;
                    this.BigWinAnm.getChildByName("Node3").active = true;
                    Mode.ShowSpine(this.BigWinAnm.getChildByName("Node3").getComponent(sp.Skeleton), 0, "superwin_loop", true, null);
                }
            } else if (Data.Library.MathConsole.getWinData()._wintotalcredit >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.mega]) && this.five_anm_show <= 1) {
                // 顯示 MegaWin 動畫（Node2）
                this.five_anm_show = 1;
                checkTitle = true;

                this.BigWinAnm.getChildByName("Node1").active = false;
                this.BigWinAnm.getChildByName("Node2").active = true;
                this.BigWinAnm.getChildByName("Node3").active = false;
                Mode.ShowSpine(this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton), 0, "megawin_loop", true, null);
            }

            if (checkTitle == true) {
                // 更新標題和標語
                let solgn = this.BigWinAnm.getChildByName("BWinSlogan");
                let wtitle = this.BigWinAnm.getChildByName("BWinTitle");
                if (this.five_anm_show % 2 == 1) {
                    solgn = this.BigWinAnm.getChildByName("BWinSlogan2");
                    wtitle = this.BigWinAnm.getChildByName("BWinTitle2");
                }
                if (this.five_anm_show >= 1) {
                    solgn.active=true;
                }
                Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinSlogan").getComponent(sp.Skeleton));
                Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinSlogan2").getComponent(sp.Skeleton));
                solgn.getComponent(sp.Skeleton).setSkin("02");
                solgn.getComponent(sp.Skeleton).addAnimation(0, 'loop', true);

                Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinTitle").getComponent(sp.Skeleton));
                Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinTitle2").getComponent(sp.Skeleton));
                wtitle.getComponent(sp.Skeleton).setSkin(this.five_anm_name[this.five_anm_show]);
                wtitle.getComponent(sp.Skeleton).addAnimation(0, 'loop', true);
            }

            this.scroll_stop = true;
        }
    }
}