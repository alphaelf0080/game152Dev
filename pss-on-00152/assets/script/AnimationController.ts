import { _decorator, Component, Node, find, Label, input, Input, EventTouch, LabelAtlas, sp, log, tween, Sprite, Color, Animation, Button, SpriteFrame, Skeleton, AudioSource, UITransform } from 'cc';
import { AudioController } from './AudioController';
import { Data, Mode } from './DataController';
import { AllNode } from './LibCreator/libScript/CommonLibScript';
import { UCoin } from './LibCreator/libScript/JackpotScript/UCoin/UCoin';
import { ReelController } from './ReelController/ReelController';
const { ccclass, property } = _decorator;

let MessageConsole: Node = null;
let DropSymbolMap = null;

@ccclass('AnimationController')
export class AnimationController extends Component {
    static Instance: AnimationController = new AnimationController();
    @property({ type: SpriteFrame }) BannerArray = [];
    @property({ type: ReelController }) reelController;
    @property({ type: AudioController }) audioController;

    TransAnm;
    BigWinAnm;

    winBarNode;
    WinBarAnm;
    BannerText;
    
    BkgAnmNode;
    BkgAnm;
    BkgAnmFsNode;
    BkgAnmFs;
    WinBarType = -1;
    WinBarState = -1;
    scroll_num = 0;
    scroll_flag: boolean = false;
    scroll_stop: boolean = false;
    scroll_stop_time = 0;
    five_anm_show = 0;
    five_anm_name: string[] = ["bigwin", "megawin", "superwin", "ultrawin", "ultimatewin"];

    SlotWinNode;
    tempRateIndex=null;//暫存此把押注倍率

    protected onLoad(): void {
        AnimationController.Instance = this;
    }
    
    start() {
        MessageConsole = find("MessageController");
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;

        this.TransAnm = find("Canvas/BaseGame/Trans");

        this.BigWinAnm = find("Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm");
        this.winBarNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinBarAnm");
        this.WinBarAnm = find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinBarAnm").getComponent(sp.Skeleton);
        this.BannerText = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBgCover/BannerText");

        this.BkgAnmNode = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnm");
        this.BkgAnm = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnm").getComponent(sp.Skeleton);
        this.BkgAnmFsNode = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnmFs");
        this.BkgAnmFs = find("Canvas/BaseGame/Layer/Shake/UI/BkgAnmFs").getComponent(sp.Skeleton);

        this.SlotWinNode = find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/OneRoundScore");
    }

    update(deltaTime: number) {
        if (this.scroll_flag == false) { return; }
            
        this.ScroingWin(deltaTime);
    }

    HandleBroadcast(data: any) {
        switch(data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY: break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                this.HandleStateChange(data.EnventData);
                AllNode.Data.Map.get("BsUI").active = Data.Library.StateConsole.CurScene === Mode.SCENE_ID.BASE ? true : false;
                break;

            default: break;
        }
    }

    LocalCent = 0;
    _preTrigger = false;
    HandleStateChange(state: Mode.FSM) {
        switch (state) {
            case Mode.FSM.K_IDLE: break;

            case Mode.FSM.K_SPIN: 
                this.BkgAnmSwitch(false);                
                this.tempRateIndex=null;
                break;

            case Mode.FSM.K_SPINSTOPING:
                this.LocalCent = Data.Library.StateConsole.PlayerCent;
                break;

            case Mode.FSM.K_EXPEND:
            case Mode.FSM.K_FEATURE_EXPEND: break;
            case Mode.FSM.K_DROP:
            case Mode.FSM.K_FEATURE_DROP: break;

            case Mode.FSM.K_SHOWWIN:
            case Mode.FSM.K_FEATURE_SHOWWIN: 
            if (!UCoin.running) {
                this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.MathConsole.getWinData()._wintotalcredit);
                if (Data.Library.StateConsole.CurScene == Mode.SCENE_ID.FEATURE0) {
                    this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin);
                }
                Data.Library.StateConsole.setCredit(this.LocalCent);
            }
            break;
            case Mode.FSM.K_WAIT:
            case Mode.FSM.K_FEATURE_WAIT:
                if (Data.Library.MathConsole.getWinData()._wintotalcredit > 0) {
                    if (this._preTrigger == true) {
                        find("Canvas/BaseGame/Layer/Shake/UI/InfoController/WinBtn/Win").getComponent(Label).string = Data.Library.StateConsole.NumberToCent(Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin));
                        find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).color = new Color(255, 255, 255, 255);
                    }

                    
                    this.SetBannerNumber(Data.Library.MathConsole.getWinData()._wintotalcredit, 't');
                    find("AudioController/WinRolling/Loop").getComponent(AudioSource).stop();
                    find("AudioController/WinRolling/End").getComponent(AudioSource).play();
                    this.BigWinAnm.active = false;
                }
                break;

            case Mode.FSM.K_FEATURE_SHOWSCATTERWIN: break;

            case Mode.FSM.K_FEATURE_TRANSLATE:
                find("AudioController/WinRolling/Loop").getComponent(AudioSource).stop();
                find("AudioController/WinRolling/End").getComponent(AudioSource).play();
                this.BkgAnmActive('');
                if (!UCoin.running) {
                    this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.MathConsole.getWinData()._wintotalcredit);
                    Data.Library.StateConsole.setCredit(this.LocalCent);
                }
                this.SetBannerNumber(Data.Library.MathConsole.getWinData()._wintotalcredit)
                this.BigWinAnm.active = false;

                this.TransAnm.active = true;
                Mode.ShowSpine(this.TransAnm.getComponent(sp.Skeleton), 0, "begin", false, null);
                this.TransAnm.getComponent(sp.Skeleton).addAnimation(0, 'loop', true);

                this.scheduleOnce(function () {
                    find("Canvas/BaseGame/Trans/TransBtN").active = true;
                    find("Canvas/BaseGame/Trans/TransBtN").getComponent(Button).enabled = false;
                    find("Canvas/BaseGame/Trans/TransBtN").getComponent(Animation).play("fadeIn");

                    find("Canvas/BaseGame/Trans/TransNum").active = true;
                    find("Canvas/BaseGame/Trans/TransNum").getComponent(Sprite).color = new Color(255, 255, 255, 0);
                    find("Canvas/BaseGame/Trans/TransNum").getComponent(Animation).play("fadeIn");
                }, 0.2);
                break;
            case Mode.FSM.K_FEATURE_WAIT_START:
                this.HandleWinBar();
                AllNode.Data.Map.get("SettingsPage").active = false;
                Data.Library.MathConsole.getWinData()._wintotalcredit = 0;
                find("Canvas/BaseGame/Trans/TransBtN").getComponent(Button).enabled = true;
                break;
            case Mode.FSM.K_FEATURE_SPIN:
                this.HandleFeatureSpin();
                break;
            case Mode.FSM.K_FEATURE_SPINSTOPING:
                if (!UCoin.running) {
                    this.LocalCent = Data.Library.StateConsole.PlayerCent + Data.Library.StateConsole.credit2CentbyCurRate(Data.Library.StateConsole.FeatureTotalWin);
                    Data.Library.StateConsole.setCredit(this.LocalCent);
                }
                break;
            case Mode.FSM.K_FEATURE_RETRIGGER:
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

    BkgAnmActive(BkgStr: string) {
        let occur = BkgStr == 'MainGame' ?true :false;
        this.BkgAnmNode.active = occur;
        this.BkgAnmFsNode.active = !occur;

        if(occur) {
            Mode.ShowSpine(this.BkgAnm, 0, "idle", true, null);
        } else {
            Mode.ShowSpine(this.BkgAnmFs, 0, "idle", true, null);
        }
    }

    BkgAnmSwitch(occur: boolean) {
        let bkg = Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE ?this.BkgAnm :this.BkgAnmFs;
        if(occur) {
            bkg.setAnimation(0, "win_begin", false);
            bkg.addAnimation(0, "win_loop", true);

            if(Data.Library.StateConsole.CurScene != Mode.SCENE_ID.BASE) {
                bkg.addAnimation(1, "multiple_open", false);
            }
        } else {
            bkg.setAnimation(0, "idle", true);

            if(Data.Library.StateConsole.CurScene != Mode.SCENE_ID.BASE) {
                bkg.addAnimation(1, "multiple_close", false);
            }
        }
    }

    HandleFeatureSpin() {
        this._preTrigger = false;
        AllNode.Data.Map.get("SettingsPage").active = false;
        if (Data.Library.MathConsole.getWinData()._wintotalcredit&&this.BkgAnmFs.getCurrent(1)&&this.BkgAnmFs.getCurrent(1).animation.name=="multiple_open") {
            this.Prep_ShowWinLine(false);
        }
    }

    Prep_ShowWinLine(occur: boolean) {
        this.BkgAnmSwitch(occur);

        this.winBarNode.active = occur;
        this.BannerText.active = !occur;
    }

    HandleWinBar() {
        let nowScene = Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE ?0 :1;

        find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).spriteFrame = this.BannerArray[nowScene];
    }

    ShowOneRoundScore(occur: boolean, winScore: number) {
        this.SlotWinNode.active = occur;
        if(occur) {
            //let str = Data.Library.StateConsole.NumberToCent(Data.Library.StateConsole.credit2CentbyCurRate(winScore));
            if(this.tempRateIndex==null){ 
                this.tempRateIndex=Data.Library.StateConsole.RateIndex;
            }
            let str=Data.Library.StateConsole.NumberToCent(winScore*Data.Library.StateConsole.RateArray[this.tempRateIndex]);
            Data.Library.BannerData.OneRoundScore(str);
            if(Data.Library.StateConsole.CurScene !== Mode.SCENE_ID.FEATURE0){
                this.SlotWinNode.getComponent(Animation).play('fadeIn');//fs裡面不fade
            }            
        }
    }

    ShowBannerAnm() {
        this.scroll_num = 0;
        this.scroll_flag = true;
        this.scroll_stop = false;
        this._bigWinSkip = 0;
        this.scroll_stop_time = 0;
        this.five_anm_show = 0;
        find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).color = new Color(255, 255, 255, 255);
        if (Data.Library.MathConsole.getWinData()._wintotalcredit >= 15 * Data.Library.StateConsole.getCurTotalBet()) {  //大獎
            this.audioController.PlayingRandomBigWinSound();
            this.BigWinAnm.active = true;
            this.BigWinAnm.getChildByName("Node1").active = true;
            this.BigWinAnm.getChildByName("Node2").active = false;
            this.BigWinAnm.getChildByName("Node3").active = false;

            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinSlogan").getComponent(sp.Skeleton));
            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinSlogan2").getComponent(sp.Skeleton));
            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinTitle").getComponent(sp.Skeleton));
            Mode.ClearSpine(this.BigWinAnm.getChildByName("BWinTitle2").getComponent(sp.Skeleton));

            Mode.ShowSpine(this.BigWinAnm.getChildByName("Node1").getComponent(sp.Skeleton), 0, "bigwin_begin", false, null);
            this.BigWinAnm.getChildByName("Node1").getComponent(sp.Skeleton).addAnimation(0, 'bigwin_loop', true);

            find("AudioController").getComponent(AudioController).MusicState = 2;
            this.PlayWinUpdate();
        } else {  //小獎
            //this.audioController.PlayingRandomWinSound();
            Mode.ShowSpine(this.WinBarAnm, 0, "loop2", true, null);
            this.WinBarAnm.color = new Color(255, 255, 255, 255);            
            find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBg").active = false;
            this.WinBarType = 2;
        }
    }

    _bigWinSkip = 0;

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

    PlayWinUpdate() {
        if (this._bigWinSkip == 2) { return; }

        let RanAnm = "0" + Math.floor(Math.random() * 6 + 1).toString();

        let solgn = this.BigWinAnm.getChildByName("BWinSlogan");
        let wtitle = this.BigWinAnm.getChildByName("BWinTitle");
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
        if(Data.Library.RES_LANGUAGE === "tai"){
            wtitle.setScale(0.8,1);
            wtitle.setPosition(75,0);
        }            

        if (find("AudioController/BigWin/Base").getComponent(AudioSource).playing == false) {
            find("AudioController/BigWin/Base").getComponent(AudioSource).play();
        }
        if (this.five_anm_show >= 3) {
            find("AudioController/BigWin/Super").getComponent(AudioSource).play();
        } else if (this.five_anm_show == 2) {
            find("AudioController/BigWin/Mega").getComponent(AudioSource).play();
        } else if (this.five_anm_show == 1) {
            find("AudioController/BigWin/Big").getComponent(AudioSource).play();
        }
        this._bigWinSkip = 1;
    }

    ScroingWin(dt) {
        if (this.scroll_num >= Data.Library.MathConsole.getWinData()._wintotalcredit) {
            this.scroll_flag = false;
            return;
        }
        this.scroll_stop_time += dt;

        let curMultiple = this.scroll_num / Data.Library.StateConsole.getCurTotalBet();
        let winMultiple = Data.Library.MathConsole.getWinData()._wintotalcredit / Data.Library.StateConsole.getCurTotalBet();
        let range = Data.Library.NEW_SCORING_WIN.Range.length;
        for (let i = 1; i < Data.Library.NEW_SCORING_WIN.Range.length; i++) {
            if (curMultiple < Data.Library.NEW_SCORING_WIN.Range[i]) {
                range = i;
                break;
            }
        }

        let speed = ((winMultiple - Data.Library.NEW_SCORING_WIN.Range[Data.Library.NEW_SCORING_WIN.Range.length - 1]) * Data.Library.StateConsole.getCurTotalBet()) / Data.Library.NEW_SCORING_WIN.Time[range];
        if (range < Data.Library.NEW_SCORING_WIN.Range.length) {
            speed = ((Data.Library.NEW_SCORING_WIN.Range[range] - Data.Library.NEW_SCORING_WIN.Range[range - 1]) * Data.Library.StateConsole.getCurTotalBet()) / Data.Library.NEW_SCORING_WIN.Time[range];
        }

        if(Data.Library.MathConsole.getWinData()._wintotalcredit < 5 * Data.Library.StateConsole.getCurTotalBet()){
            this.scroll_num=Data.Library.MathConsole.getWinData()._wintotalcredit;
            this.scroll_flag = false;
        }else if (Data.Library.MathConsole.getWinData()._wintotalcredit >= Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.big] * Data.Library.StateConsole.getCurTotalBet()) {            
            this.scroll_num += speed * Data.Library.NEW_SCORING_WIN.DelaTime;
        } else {
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

        this.SetBannerNumber(this.scroll_num);
        //this.ShowOneRoundScore(true,this.scroll_num);BannerWin就不再更新上面小黑塊分數
        this.reelController.ShowDark(true);
        if (Data.Library.MathConsole.getWinData()._wintotalcredit >= 15 * Data.Library.StateConsole.getCurTotalBet()) {
            this.BigWinAnm.getChildByName("BWinTxt").getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(Data.Library.StateConsole.NumberToCent(Math.floor(Data.Library.StateConsole.credit2CentbyCurRate(this.scroll_num))));
            this.BigWinAnm.getChildByName("BWinTxt").getComponent(Label).color = new Color(255, 255, 255, 255);
        }

        if (next) {
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
                this.scheduleOnce(function () {
                    Data.Library.StateConsole.nextState();
                }, 1.5);
            }
        } else if (Data.Library.StateConsole.is5levelBigwinShow() != Mode.FIVE_LEVEL_WIN_TYPE.non) {
            if (this.scroll_num >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultimate]) && this.five_anm_show == 3) {
                this._bigWinSkip = 0;
                this.five_anm_show = 4;
                this.PlayWinUpdate();
            } else if (this.scroll_num >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.ultra]) && this.five_anm_show == 2) {
                this._bigWinSkip = 0;
                this.five_anm_show = 3;
                this.PlayWinUpdate();
            } else if (this.scroll_num >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.super]) && this.five_anm_show == 1) {
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

    SetBannerNumber(num: number, strIdx: string = 'w') {
        Data.Library.BannerData.setNumber(strIdx + Data.Library.StateConsole.NumberToCent(Math.floor(Data.Library.StateConsole.credit2CentbyCurRate(num))));
    }

    StopBigWin() {  //直接加在cocos dashboard上面的按鈕 'Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BigwinSkip'
        if (this._bigWinSkip != 1) { return; }
        if (this.scroll_num < Data.Library.MathConsole.getWinData()._wintotalcredit && this.scroll_stop_time >= 1) {
            this._bigWinSkip = 2;
            let checkAnm = false;
            let checkTitle = false;
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
                    this.BigWinAnm.getChildByName("Node1").active = false;
                    this.BigWinAnm.getChildByName("Node2").active = false;
                    this.BigWinAnm.getChildByName("Node3").active = true;
                    Mode.ShowSpine(this.BigWinAnm.getChildByName("Node3").getComponent(sp.Skeleton), 0, "superwin_loop", true, null);
                }
            } else if (Data.Library.MathConsole.getWinData()._wintotalcredit >= (Data.Library.StateConsole.getCurTotalBet() * Data.Library.FIVE_LEVEL_WIN_MULTIPLE[Mode.FIVE_LEVEL_WIN_TYPE.mega]) && this.five_anm_show <= 1) {
                this.five_anm_show = 1;
                checkTitle = true;

                this.BigWinAnm.getChildByName("Node1").active = false;
                this.BigWinAnm.getChildByName("Node2").active = true;
                this.BigWinAnm.getChildByName("Node3").active = false;
                Mode.ShowSpine(this.BigWinAnm.getChildByName("Node2").getComponent(sp.Skeleton), 0, "megawin_loop", true, null);
            }

            if (checkTitle == true) {
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