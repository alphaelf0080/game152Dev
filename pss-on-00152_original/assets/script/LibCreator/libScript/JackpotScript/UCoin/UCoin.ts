import { _decorator, AudioSource, Component, Node, find, Label, sp, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { Data, Mode } from '../../../../DataController';
import { AnimationController } from '../../../../AnimationController';
import { AllNode } from 'db://assets/script/LibCreator/libScript/CommonLibScript';
import { StateConsole } from 'db://assets/script/MessageController/StateConsole';

const { ccclass, property } = _decorator;
@ccclass('UCoin')
export class UCoin extends Component {
    item = {
        Rule: null,
        Detail: null,
        Wallet: null,
        WalletOut: null,
        Current: null,
        TotalNum: null,
        TotalTime: null,
        BarAct: null,
        BarHead: null,
        BarCent: null,
        AnmCoin: null,
        AnmHead: null,
        AnmRound: null,
        HelpPage: []
    };
    public static variable = {
        Init: false,
        AnmEnd: false,
        InCancel: false,
        IsCashOut: false,
        IsMaxChase: false,
        CleanType: 0, // 0餘額轉出 1餘額清除 2餘額保留
        Wallet: 0,
        Current: 0,
        Balance: 0,
        Total: 0,
        Time: {
            Hour: 0,
            Min: 0,
            Sec: 0
        },
        PreCent: 0,
        HelpRead: 0,
        HelpPages: 5,
        AnmCent: 0,
        MaxCashOut: 0,
        TransferCent: 0,
        JackPotWin: 0,

    };
    public static running = false;
    stateConsole: StateConsole | null = null;

    static getCredit(data) {
        return Long(data.low, data.high, data.unsigned);
    }

    start() {
        this.stateConsole = Data.Library.StateConsole;
        this.item.Rule = find("Canvas/Ucoin/UcoinRule");
        this.item.Detail = find("Canvas/Ucoin/UcoinRule/Rule");
        this.item.Wallet = find("Canvas/Ucoin/UcoinRule/Reward/Wallet");
        this.item.WalletOut = find("Canvas/Ucoin/UcoinText/Wallet/Num");
        this.item.Current = find("Canvas/Ucoin/UcoinRule/Reward/Current");
        this.item.TotalNum = find("Canvas/Ucoin/UcoinRule/Reward/Total");
        this.item.TotalTime = find("Canvas/Ucoin/UcoinRule/Reward/Time");
        this.item.BarAct = find("Canvas/Ucoin/UcoinRule/Reward/BarA");
        this.item.BarHead = find("Canvas/Ucoin/UcoinRule/Reward/BarH");
        this.item.BarCent = find("Canvas/Ucoin/UcoinRule/Reward/Precent");
        this.item.HelpPage.push(find("Canvas/Ucoin/UcoinRule/Rule/Rule1"));
        this.item.HelpPage.push(find("Canvas/Ucoin/UcoinRule/Rule/Rule2"));
        this.item.HelpPage.push(find("Canvas/Ucoin/UcoinRule/Rule/Rule3"));
        this.item.HelpPage.push(find("Canvas/Ucoin/UcoinRule/Rule/Rule4"));
        this.item.HelpPage.push(find("Canvas/Ucoin/UcoinRule/Rule/Rule5"));

        this.item.AnmCoin = find("Canvas/Ucoin/UcoinRound/Coin").getComponent(sp.Skeleton);
        this.item.AnmCoin.clearTracks();
        this.item.AnmCoin.setToSetupPose();
        this.item.AnmCoin.addAnimation(0, "low", true);

        this.item.AnmHead = find("Canvas/Ucoin/UcoinRound/Light").getComponent(sp.Skeleton);
        this.item.AnmHead.clearTracks();
        this.item.AnmHead.setToSetupPose();
        this.item.AnmHead.addAnimation(0, "idle", true);
        this.item.AnmHead.addAnimation(1, "50", true);
        this.item.AnmHead._state.tracks[1].alpha = 0; // 0 ~ 2

        this.item.AnmRound = find("Canvas/Ucoin/UcoinRound").getComponent(sp.Skeleton);
        this.item.AnmRound.clearTracks();
        this.item.AnmRound.setToSetupPose();
        this.item.AnmRound.addAnimation(0, "50", true);
        this.item.AnmRound._state.tracks[0].alpha = 0; // 50 0 ~ 1 100 0.5 ~ 1

        this.item.TotalTime.setPosition(265, -218);
        if (Data.Library.RES_LANGUAGE == "tai") {
            this.item.TotalTime.setPosition(205, -218);
            UCoin.variable.HelpPages = 3;
        } else if (Data.Library.RES_LANGUAGE == "sch" || Data.Library.RES_LANGUAGE == "tch") {
            this.item.TotalTime.setPosition(140, -218);
            UCoin.variable.HelpPages = 2;
        }
    }

    update(deltaTime: number) {
        if (UCoin.variable.Init == true) {
            UCoin.variable.Time.Sec -= deltaTime;
            if (UCoin.variable.Time.Sec < 0 && (UCoin.variable.Time.Min > 0 || UCoin.variable.Time.Hour > 0)) {
                UCoin.variable.Time.Min -= 1;
                UCoin.variable.Time.Sec = 60;
                if (UCoin.variable.Time.Min < 0) {
                    UCoin.variable.Time.Hour -= 1;
                    UCoin.variable.Time.Min = 59;
                }
            } else if (UCoin.variable.Time.Sec < 0) {
                UCoin.variable.Time.Hour = 0;
                UCoin.variable.Time.Min = 0;
                UCoin.variable.Time.Sec = 0;
            }
            this.updateTime();
        }
        if (UCoin.running == true) this.updateRound();

        if (this.stateConsole.isMenuOn == true ||
            AllNode.Data.Map.get((Data.Library as any)?.isNewAudio ? "Trans" : "BaseGame/Trans")?.active ||
            AllNode.Data.Map.get("BigwinAnm")?.active
        ) {
            this.node.getComponent(UIOpacity).opacity = 0;
            this.item.Detail.active = false;
            this.item.Rule.active = false;
        } else {
            this.node.getComponent(UIOpacity).opacity = 255;
        }
    }

    public HandleBroadcast(data: any) {
        if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY) {
            // NetReady
            return;
        }
        else if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE) {
            // StateChange
            if ((UCoin.variable.Init == true || UCoin.variable.IsCashOut == true) && UCoin.variable.InCancel == false) {
                this.HandleStateChange(data.EnventData);
            } else if (data.EnventData == Mode.FSM.K_SHOWUC) {
                if (UCoin.variable.Time.Sec == 0 && UCoin.variable.Time.Min == 0 && UCoin.variable.Time.Hour == 0 && UCoin.running == true) {
                    UCoin.variable.Init = false;
                    this.node.active = false;
                    this.enabled = false;
                    UCoin.running = false;
                }
                this.stateConsole.nextState();
            }
            return;
        }
        else if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.ACTIONS].eUpdateCoinAfterJp) {
            if (UCoin.running) {
                UCoin.variable.Wallet = UCoin.variable.Balance + Data.Jackpot.preJpWinMoney;
                this.item.AnmCoin.setAnimation(1, "win", false);
                this.scheduleOnce(() => {
                    this.item.Wallet.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Wallet);
                    this.item.WalletOut.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Wallet);
                }, 0.4);
            }
        }
    }

    HandleStateChange(state) {
        switch (state) {
            case Mode.FSM.K_SPINSTOPING:
                let loop = "low";
                if (UCoin.variable.PreCent >= 70) loop = "middle";
                if (this.item.AnmCoin._state.tracks[0].animation.name != loop) {
                    this.item.AnmCoin.clearTracks();
                    this.item.AnmCoin.setToSetupPose();
                    this.item.AnmCoin.addAnimation(0, loop, true);
                }
                this.item.AnmCoin.addAnimation(1, "spin", false);
                break;
            case Mode.FSM.K_WAIT:
                if (UCoin.variable.IsCashOut == true) {
                    this.item.Wallet.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Balance);
                    this.item.WalletOut.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Balance);
                } else if (Data.Library.MathConsole.getWinData()._wintotalcredit > 0) {
                    this.item.AnmCoin.clearTrack(1);
                    this.scheduleOnce(() => {
                        this.item.Wallet.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Balance);
                        this.item.WalletOut.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Balance);
                    }, 0.5);
                }
                if (UCoin.running && (
                    (this.stateConsole.CurScene == Mode.SCENE_ID.BASE && Data.Library.MathConsole.getWinData()._wintotalcredit > 0))
                ) {
                    this.item.AnmCoin.setAnimation(1, "win", false);
                    this.item.AnmCoin.setCompleteListener(() => {
                        this.item.AnmCoin.setCompleteListener(null);
                        this.stateConsole.nextState();
                    })
                }
                break;
            case Mode.FSM.K_FEATURE_CHEKRESULT:
                UCoin.variable.Balance = UCoin.variable.Wallet + this.stateConsole.credit2CentbyCurRate(this.stateConsole.FeatureTotalWin);
                this.stateConsole.dataCall();
                break;
            case Mode.FSM.K_SHOWUC:
                if (UCoin.variable.IsCashOut == true) {
                    UCoin.variable.InCancel = true;
                    UCoin.variable.IsCashOut = false;
                    this.item.Detail.active = false;
                    this.item.Rule.active = false;
                    this.item.AnmCoin.addAnimation(1, "full", false);
                    this.item.AnmCoin.addAnimation(1, "get", false);

                    this.scheduleOnce(() => {
                        let CreditLabel = AllNode.Data.Map.get("Credit");
                        AllNode.Data.Map.get("Animation").getComponent(AnimationController).LocalCent = this.stateConsole.PlayerCent + UCoin.variable.TransferCent;
                        CreditLabel.getComponent(Label).string = this.stateConsole.NumberToCent(AllNode.Data.Map.get("Animation").getComponent(AnimationController).LocalCent);
                    }, 5);

                    this.scheduleOnce(() => {
                        let CreditLabel = AllNode.Data.Map.get("Credit");
                        tween(CreditLabel)
                            .to(0.1, { scale: new Vec3(0.95, 0.95, 1) })
                            .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
                            .to(0.1, { scale: new Vec3(1, 1, 1) })
                            .call(() => {
                                this.item.WalletOut.active = false;
                                find("Canvas/Ucoin/UcoinTextEnd/Notice/Num").getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.TransferCent);
                                AllNode.Data.Map.get("UcoinTextEnd").active = true;
                                AllNode.Data.Map.get("UcoinTextEnd/Close").active = false;
                            })
                            .start();
                    }, 3.2);
                    this.scheduleOnce(() => {
                        UCoin.variable.AnmEnd = true;
                    }, 2.3);
                    this.scheduleOnce(() => {
                        AllNode.Data.Map.get("UcoinTextEnd/Close").active = true;
                        UCoin.running = false;
                        this.stateConsole.nextState();
                    }, 5.3);
                } else {
                    if (UCoin.variable.Time.Sec == 0 && UCoin.variable.Time.Min == 0 && UCoin.variable.Time.Hour == 0 && UCoin.running == true) {
                        UCoin.variable.Init = false;
                        this.node.active = false;
                        this.enabled = false;
                        UCoin.running = false;
                    }
                    this.stateConsole.nextState();
                }
                break;
        }
    }

    handleMaxCashout() {
        if (UCoin.variable.MaxCashOut !== undefined && UCoin.variable.MaxCashOut !== 0) {
            UCoin.variable.IsMaxChase = true;
            let maxCashoutNode = new Node();
            maxCashoutNode.name = "MaxCashout";
            maxCashoutNode.addComponent(Label);
            maxCashoutNode.getComponent(Label).fontSize = 40;
            this.item.HelpPage[UCoin.variable.HelpPages - 1].addChild(maxCashoutNode);
            let maxCashNumber = this.stateConsole.NumberToCent(UCoin.variable.MaxCashOut);
            if (Data.Library.RES_LANGUAGE === "sch" || Data.Library.RES_LANGUAGE == "tch") {
                maxCashoutNode.setPosition(0, -220);
                maxCashoutNode.getComponent(Label).string = "最大提領額度 : " + maxCashNumber;
            } else if (Data.Library.RES_LANGUAGE === "tai") {
                maxCashoutNode.setPosition(0, -200);
                maxCashoutNode.getComponent(Label).string = "ยอดถอนสูงสุด : " + maxCashNumber;
            } else {
                maxCashoutNode.setPosition(0, -150);
                maxCashoutNode.getComponent(Label).string = "Max Withdraw : " + maxCashNumber;
            }
        }
    }

    public initData(data) {
        if (data.ups_switch == true) {
            UCoin.variable.CleanType = data.overage_type;
            UCoin.variable.Wallet = UCoin.getCredit(data.upscoin_cent);
            UCoin.variable.Current = UCoin.getCredit(data.coin_in);
            UCoin.variable.Total = UCoin.getCredit(data.threshold);
            UCoin.variable.Balance = UCoin.variable.Wallet;
            UCoin.variable.MaxCashOut = data?.max_cashout ? UCoin.getCredit(data.max_cashout) : 0;

            this.handleMaxCashout();  // 是否有最大出金

            this.updateItem(true);

            if (data.remain_time.indexOf("-") > -1) {
                UCoin.variable.Time.Hour = 0;
                UCoin.variable.Time.Min = 0;
                UCoin.variable.Time.Sec = 0;
            } else {
                let temp = data.remain_time.split("T");
                let temp2 = temp[1].replace(/[^0-9]/ig, "");
                UCoin.variable.Time.Hour = parseInt(temp[0]) * 24 + parseInt(temp2.substr(0, 2));
                UCoin.variable.Time.Min = parseInt(temp2.substr(2, 2));
                UCoin.variable.Time.Sec = parseInt(temp2.substr(4, 2));
            }
            this.updateTime();

            if (UCoin.variable.Current >= UCoin.variable.Total) {
                UCoin.variable.Current = UCoin.variable.Total;
                if (this.stateConsole.ServerRecoverData) {
                    UCoin.variable.IsCashOut = true;
                    UCoin.variable.Init = false;
                }
            } else {
                UCoin.variable.Init = true;
            }
            this.node.active = true;
            UCoin.running = true;
        } else {
            UCoin.variable.Init = false;
            this.node.active = false;
            this.enabled = false;
            UCoin.running = false;
        }
    }

    public updateData(data, next, win, jackpotWin?: number) {
        if (data.coin_in === undefined && data.is_transfer === undefined
            && data.transfer_cent === undefined) {
            UCoin.variable.Init = false;
            this.node.active = false;
            this.enabled = false;
            UCoin.running = false;
            return;
        }

        /**
         * UCOIN不會跟紅包或寶箱(treasure)同時出現
         * 有機率會跟jackpot一起出現，UCoin金額會加上jackpot值，為了顯示，所以這裡要判斷扣掉
         * 這裡額外紀錄的原因是為了可能進FS再出來後，UCoin要扣除jackpot值
         */
        if (typeof jackpotWin === 'number') UCoin.variable.JackPotWin = jackpotWin;
        let resultWin = this.stateConsole.credit2CentbyCurRate(win);
        // 防止後端還沒更新新的GS做的判斷
        let hasUpscoinValue: boolean = data?.upscoin_cent;
        if (UCoin.variable.Init == true) {
            if (data.is_transfer) {
                UCoin.variable.TransferCent = UCoin.getCredit(data.transfer_cent);
                UCoin.variable.Wallet = UCoin.variable.Balance;
                UCoin.variable.Wallet = UCoin.variable.Wallet - this.stateConsole.getCurTotoBetInCent();
                UCoin.variable.Balance = UCoin.variable.IsMaxChase ? Math.min(UCoin.variable.Wallet + resultWin, UCoin.variable.MaxCashOut) : (UCoin.variable.Wallet + resultWin)
                this.stateConsole.PlayerCent = this.stateConsole.PlayerCent - UCoin.variable.TransferCent;
                UCoin.variable.Current = UCoin.variable.Total;
                UCoin.variable.IsCashOut = true;
                UCoin.variable.Init = false;
            } else {
                let temp = data.remain_time.split("T");
                let temp2 = temp[1].replace(/[^0-9]/ig, "");
                UCoin.variable.Time.Hour = parseInt(temp[0]) * 24 + parseInt(temp2.substr(0, 2));
                UCoin.variable.Time.Min = parseInt(temp2.substr(2, 2));
                UCoin.variable.Time.Sec = parseInt(temp2.substr(4, 2));
                this.updateTime();

                UCoin.variable.Wallet = UCoin.getCredit(data.upscoin_cent) - UCoin.variable.JackPotWin;
                UCoin.variable.Current = UCoin.getCredit(data.coin_in);
                UCoin.variable.Total = UCoin.getCredit(data.threshold);
                // 這裡不能先加jackpotWin，盤面贏分時就會顯示加完jackpotWin的金額
                UCoin.variable.Balance = UCoin.variable.Wallet + resultWin;

                if (UCoin.variable.Current >= UCoin.variable.Total) UCoin.variable.Current = UCoin.variable.Total;
                if (next.indexOf("FS") >= 0) {
                    if (UCoin.variable.Current == UCoin.variable.Total) {
                        UCoin.variable.IsCashOut = true;
                        UCoin.variable.Init = false;
                    }
                }
            }
            this.updateItem(false);
        } else if (data.is_transfer && next == "CK") {
            UCoin.variable.TransferCent = UCoin.getCredit(data.transfer_cent);
            UCoin.variable.Balance = hasUpscoinValue ? UCoin.getCredit(data.upscoin_cent) - UCoin.variable.JackPotWin :
                UCoin.variable.TransferCent;
            UCoin.variable.Current = UCoin.variable.Total;
            UCoin.variable.IsCashOut = true;
            UCoin.variable.Init = false;
        }
    }


    updateTime() {
        const { Hour, Min, Sec } = UCoin.variable.Time;
        if (Hour > 0 || Min > 0 || Sec > 0) {
            const hourStr = Hour > 0 ? `${Hour}:` : "";
            const minStr = Min < 10 ? `0${Min}` : `${Min}`;
            const secStr = Math.floor(Sec) < 10 ? `0${Math.floor(Sec)}` : `${Math.floor(Sec)}`;
            this.item.TotalTime.getComponent(Label).string = `${hourStr}${minStr}:${secStr}`;
        } else {
            this.item.TotalTime.getComponent(Label).string = "00:00:00";
            if (this.stateConsole.CurState == Mode.FSM.K_IDLE) {
                UCoin.variable.Init = false;
                this.node.active = false;
                this.enabled = false;
                UCoin.running = false;
            }
        }
    }

    updateItem(init) {
        let precent = UCoin.variable.Current / UCoin.variable.Total;
        if (precent >= 1) precent = 1;
        UCoin.variable.PreCent = Math.floor(precent * 100);
        this.item.Wallet.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Wallet);
        this.item.WalletOut.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Wallet);
        this.item.Current.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Current);
        this.item.TotalNum.getComponent(Label).string = this.stateConsole.NumberToCent(UCoin.variable.Total);
        this.item.BarCent.getComponent(Label).string = UCoin.variable.PreCent.toString() + "%";
        this.item.BarAct.getComponent(UITransform).width = Math.floor(394 * precent);
        this.item.BarHead.setPosition((Math.floor(394 * precent) - 197), -143.5);
    }

    initRound() {
        UCoin.variable.AnmCent = UCoin.variable.PreCent;
        if (UCoin.variable.AnmCent > 100) UCoin.variable.AnmCent = 100;

        let alpha = Math.floor(UCoin.variable.AnmCent * 2) / 100;
        this.item.AnmHead.clearTracks();
        this.item.AnmHead.setToSetupPose();
        this.item.AnmHead.addAnimation(0, "idle", true);
        this.item.AnmHead.addAnimation(1, "50", true);
        this.item.AnmHead._state.tracks[1].alpha = alpha;

        this.item.AnmRound.clearTracks();
        this.item.AnmRound.setToSetupPose();
        if (alpha >= 1) {
            this.item.AnmRound.addAnimation(0, "100", true);
            this.item.AnmRound._state.tracks[0].alpha = alpha / 2;
        } else {
            this.item.AnmRound.addAnimation(0, "50", true);
            this.item.AnmRound._state.tracks[0].alpha = alpha;
        }
    }

    updateRound() {
        if (UCoin.variable.AnmEnd == true) {
            if (UCoin.variable.AnmCent > 0) {
                UCoin.variable.AnmCent -= 2;
                if (UCoin.variable.AnmCent < 0) UCoin.variable.AnmCent = 0;

                let alpha = Math.floor(UCoin.variable.AnmCent * 2) / 100;
                this.item.AnmHead._state.tracks[1].alpha = alpha;
                if (alpha < 1) {
                    if (this.item.AnmRound._state.tracks[0].animation.name != "50") {
                        this.item.AnmRound.clearTracks();
                        this.item.AnmRound.setToSetupPose();
                        this.item.AnmRound.addAnimation(0, "50", true);
                    }
                    this.item.AnmRound._state.tracks[0].alpha = alpha;
                } else {
                    this.item.AnmRound._state.tracks[0].alpha = alpha / 2;
                }
            }
        }
        else if (UCoin.variable.PreCent > UCoin.variable.AnmCent) {
            UCoin.variable.AnmCent += 1;
            if (UCoin.variable.IsCashOut == true) UCoin.variable.AnmCent += 3;
            if (UCoin.variable.AnmCent > 100) UCoin.variable.AnmCent = 100;

            let alpha = Math.floor(UCoin.variable.AnmCent * 2) / 100;
            this.item.AnmHead._state.tracks[1].alpha = alpha;
            if (alpha >= 1) {
                if (this.item.AnmRound._state.tracks[0].animation.name != "100") {
                    this.item.AnmRound.clearTracks();
                    this.item.AnmRound.setToSetupPose();
                    this.item.AnmRound.addAnimation(0, "100", true);
                }
                this.item.AnmRound._state.tracks[0].alpha = alpha / 2;
            } else {
                this.item.AnmRound._state.tracks[0].alpha = alpha;
            }
        } else if (UCoin.variable.PreCent < UCoin.variable.AnmCent) {
            this.initRound();
        }
    }

    public OpenRule() {
        if (UCoin.variable.InCancel == true) { return; }

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('Btnclick')
            : AllNode.Data.Map.get("BtnClick").getComponent(AudioSource).play();
        this.item.Rule.active = true;
    }

    public CloseRule() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : AllNode.Data.Map.get("BtnClick2").getComponent(AudioSource).play();
        this.item.Rule.active = false;
    }

    public OpenDetail() {
        if (UCoin.variable.InCancel == true) { return; }
        if (this.item.Rule.active == false) { return; }

        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('Btnclick')
            : AllNode.Data.Map.get("BtnClick").getComponent(AudioSource).play();
        this.item.Detail.active = true;
    }

    public CloseDetail() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('BetClick')
            : AllNode.Data.Map.get("BtnClick2").getComponent(AudioSource).play();
        this.item.Detail.active = false;
    }

    public CloseUcoin() {
        this.node.active = false;
        this.enabled = false;
    }

    public nextPage() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('Btnclick')
            : AllNode.Data.Map.get("BtnClick").getComponent(AudioSource).play();
        if (this.item.Rule.active == true) {
            let last = UCoin.variable.HelpRead;
            UCoin.variable.HelpRead += 1;
            if (UCoin.variable.HelpRead >= UCoin.variable.HelpPages) UCoin.variable.HelpRead = 0;
            this.item.HelpPage[UCoin.variable.HelpRead].active = true;
            this.item.HelpPage[last].active = false;
        }
    }

    public prevPage() {
        (Data.Library as any)?.isNewAudio
            ? Data.Library.AudioController.playSfx('Btnclick')
            : AllNode.Data.Map.get("BtnClick").getComponent(AudioSource).play();
        if (this.item.Rule.active == true) {
            let last = UCoin.variable.HelpRead;
            UCoin.variable.HelpRead -= 1;
            if (UCoin.variable.HelpRead < 0) UCoin.variable.HelpRead = UCoin.variable.HelpPages - 1;
            this.item.HelpPage[UCoin.variable.HelpRead].active = true;
            this.item.HelpPage[last].active = false;
        }
    }
}

let Long = function (low, high, unsigned) {
    low = low | 0;
    high = high | 0;
    unsigned = !!unsigned;
    if (unsigned)
        return ((high >>> 0) * 4294967296) + (low >>> 0);
    return high * 4294967296 + (low >>> 0);
}