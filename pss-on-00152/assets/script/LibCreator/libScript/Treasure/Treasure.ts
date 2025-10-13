import { _decorator, Component, Node, sp, Label, Sprite, tween, Vec3, UIOpacity, UITransform, Color, Button, RichText, HorizontalTextAlignment, AudioSource, SpriteFrame, JsonAsset, ImageAsset, AssetManager } from 'cc';
import { Mode, Data } from '../../../DataController';
import { AllNode } from '../CommonLibScript';
import { PayTableInit } from '../../../PayTableInit';
import { AnimationController } from '../../../AnimationController';
import { LSInst } from '../LoadSource';
import { SpinePlay, SpineInit } from '../../LibCustomized/LibMode';


const { ccclass, property } = _decorator;

@ccclass('Treasure')
export class Treasure extends Component {
    @property({ group: "Icon", type: UIOpacity, displayName: "tIcon" }) tIcon: UIOpacity = null;
    @property({ group: "Icon", type: sp.Skeleton, displayName: "iconSpine" }) iconSpine: sp.Skeleton = null;
    @property({ group: "Icon", type: sp.Skeleton, displayName: "collect" }) collect: sp.Skeleton = null;
    @property({ group: "Icon", type: sp.Skeleton, displayName: "starSpine" }) starSpine: sp.Skeleton = null;
    @property({ group: "Icon", type: Node, displayName: "activityClock" }) activityClock: Node = null;

    @property({ group: "Event", type: Node, displayName: "EventNode" }) EventNode: Node = null;
    @property({ group: "Event", type: Node, displayName: "treasureChestAry" }) treasureChestAry = [];
    @property({ group: "Event", type: Node, displayName: "treasureChestNode" }) treasureChestNode: Node = null;
    @property({ group: "Event", type: Node, displayName: "choosenNode" }) choosenNode: Node = null;
    @property({ group: "Event", type: Node, displayName: "countdown" }) countdown: Node = null;
    @property({ group: "Event", type: Label, displayName: "countdownText" }) countdownText: Label = null;
    @property({ group: "Event", type: Sprite, displayName: "pickTxt" }) pickTxt: Sprite = null;

    @property({ group: "Transition", type: sp.Skeleton, displayName: "Transition" }) Transition: sp.Skeleton = null;

    @property({ group: "Rules", type: Node, displayName: "RulesNode" }) RulesNode: Node = null;
    @property({ group: "Rules", type: Sprite, displayName: "rulePage" }) rulePage: Sprite = null;
    @property({ group: "Rules", type: Node, displayName: "textLabel" }) TextLabel: Node = null;

    @property({ group: "other", type: Node, displayName: "soundNode" }) soundNode: Node = null;
    @property({ group: "other", type: Node, displayName: "skipBtn" }) skipBtn: Node = null;

    lastTime = null;

    /**紀錄規則表頁面索引 */
    pageIndex = 0;

    nowRound = 0;

    trackIndex = [1, 2, 3, 4];  // spine 軌道
    percentAni = ["25", "50", "75", "100"];  // 各區間對應的動畫名稱（例如：當進度達到 25% 時播放 "25" 動畫）
    percentPart = [0, 0.25, 0.5, 0.75, 1];  // 定義各進度區間：0%,25%,50%,75%,100%

    stateHandlers: Partial<Record<Mode.FSM, () => void>> // 狀態處理函式映射，根據 Mode.FSM 的不同狀態執行對應的函式 ,Record<K, T>：生成一個物件型別，key 必須來自 K，value 是 T。

    /**活動獎項索引0~9 共10個 */
    prizeIndex: number = null;
    /**FreeGame等級1~3(機率未更新前，可能到5) */
    star_Level: number = 0;
    /**活動上方磁條等級1~4 1最小、4最大 */
    coin_Level: number = -1;
    /**寶箱開到金額 */
    win_coin: number = 0;

    isBetBtnInit: boolean = false;

    /**倒數總計幾秒 */
    autoCountdownMax = 9;
    /**倒數秒數 */
    autoCountdownNum = 0;

    /**是否為兩倍速 */
    isDoubleSpeed: boolean = false;

    isPlayingAnm: boolean = false;
    playAnmTime: number = 0;

    delayTime: number = 0;

    /**玩家開到金幣箱 */
    isCoin: boolean = false;

    /**玩家開到卡片箱 */
    isCard: boolean = false;
    betRecord: number = -1;


    protected override update(dt: number): void {
        if (Data.Library.StateConsole.isMenuOn == true ||
            AllNode.Data.Map.get((Data.Library as any)?.isNewAudio ? "Trans" : "BaseGame/Trans")?.active ||
            AllNode.Data.Map.get("BigwinAnm").active == true
        ) {
            this.tIcon.opacity = 0;
        } else {
            this.tIcon.opacity = 255;
        }

        if (!this.isDoubleSpeed && this.isPlayingAnm) {
            this.playAnmTime += dt;
        }
    }


    HandleBroadcast(data: any) {
        if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY) { }  // NetReady   

        if (data.EnventID == Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE) {  // StateChange
            this.HandleStateChange(data.EnventData);
            return;
        }
    }

    HandleStateChange(state: Mode.FSM) {
        // Execute the handler for the current state
        if (this.stateHandlers[state]) {
            this.stateHandlers[state]();
        }
    }

    handleIdleState() {
        if (this.win_coin > 0) {
            let animationController = AllNode.Data.Map.get("Animation").getComponent(AnimationController);
            animationController.LocalCent += this.win_coin;
            let creditLabel = AllNode.Data.Map.get("Credit").getComponent(Label);
            creditLabel.string = Data.Library.StateConsole.NumberToCent(animationController.LocalCent);
            this.win_coin = 0;
        }
    }

    /**每次Spin更新資料 */
    updateData() {
        if (this.isTreasureActive()) {
            if (this.isActivityTimeOut()) {
                console.log("Treasure Active Time Out");
                return;
            }
            if (!this.node.active) {
                this.node.active = true;
                this.ActivityInit();
            }
            this.initializeClock();
            this.caculate_percent();
        } else {
            if (this.node.active) {
                this.node.active = false;
            }
        }
    }

    private async ActivityInit() {
        return new Promise<any>(async (resolve, reject) => {
            let lang = Data.Library.RES_LANGUAGE;
            let commonPath = "Activity/Treasure";

            await LSInst.loadBundle(commonPath)
                .then((bundle: AssetManager.Bundle) => {
                    bundle.load(`resource/${lang}/ActivityTextConfig`, JsonAsset, (err: any, res: JsonAsset) => {
                        // 获取到 Json 数据
                        const HelpText: object = res.json!;
                        console.log(HelpText)
                        Data.Treasure.ruleText = HelpText;
                        this.InitHelpText(HelpText);
                    })
                })

            Promise.all([
                LSInst.loadBundleSrc(commonPath, "resource/" + lang + "/rule", ImageAsset),
                LSInst.loadBundleSrc(commonPath, "resource/" + lang + "/pickoneTxt", ImageAsset)
            ]).then(([rulePng, pickoneTxt]: [SpriteFrame, SpriteFrame]) => {
                this.rulePage.spriteFrame = rulePng;
                this.pickTxt.spriteFrame = pickoneTxt;
            })


            this.stateHandlers = {
                [Mode.FSM.K_IDLE]: () => {
                    this.handleIdleState();
                },
                [Mode.FSM.K_SHOWTREASURE]: () => {
                    this.PacketSceneOpen();
                },
                [Mode.FSM.K_FEATURE_WAIT_START]: () => {
                    this.ControlBetBtn();
                },
                [Mode.FSM.K_ENDGAME]: () => {
                    if (this.isCard) {
                        this.ControlBetBtn(true);
                    }
                }
            }

            //處理Spine監聽器
            this.collect.setCompleteListener((trackIndex) => {
                if (trackIndex.animation.name == 'hit') {
                    this.collect.getCurrent(5).alpha = 0;
                }
            })

            for (let i = 0; i < this.treasureChestAry.length; i++) {
                let card = this.treasureChestAry[i].getChildByName('card').getComponent(sp.Skeleton);
                let glow = this.treasureChestAry[i].getChildByName('glow').getComponent(sp.Skeleton);
                let chest = this.treasureChestAry[i].getChildByName('chest').getComponent(sp.Skeleton);

                card.setCompleteListener((trackIndex) => {
                    let anmName = trackIndex.animation.name;
                    if (anmName.substring(0, 12) == 'card_open_lv') {
                        let level = anmName.slice(-1);
                        SpinePlay(card, { use: 'add', trackIndex: 0, anmName: `card_shrink_lv${level}`, loop: false })
                        SpinePlay(glow, { use: 'add', trackIndex: 0, anmName: 'card_shrink', loop: false })
                        SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: 'card_shrink', loop: false })
                        SpinePlay(chest, { use: 'add', trackIndex: 0, anmName: 'card_idle', loop: true })
                    }
                })

                card.setEventListener((trackEntry, event: sp.spine.Event) => {
                    if (event.data.name == "star") {
                        this.PlaySound("starHit");
                    } else if (event.data.name == "stage_call") {
                        this.PlaySound("stageCall");
                    }
                })

                chest.setEventListener((trackEntry, event: sp.spine.Event) => {
                    if (event.data.name === 'open') {
                        this.PlaySound("chestOpen");
                        this.TreasureNonSelectOpen();
                    } else if (event.data.name === 'skip') {
                        this.SwitchSkipButton(1);
                    } else if (event.data.name === 'skip_off') {
                        this.SwitchSkipButton(0);
                    }
                })
            }

            this.Transition.setEventListener((trackEntry, event: sp.spine.Event) => {
                if (event.data.name == "bg_fall") {
                    this.PlaySound("dropHeavy");
                }
            })
        })
    }

    private isTreasureActive(): boolean {
        return Data.Treasure.msg != null && Data.Treasure.msg.enable === true;
    }

    private isActivityTimeOut(): boolean {
        return Data.Treasure.msg.server_time > Data.Treasure.msg.end_time;
    }
    //end

    /**更新時間 */
    private initializeClock() {
        this.lastTime = Data.Treasure.msg.end_time - Data.Treasure.msg.server_time;
        const { days, hours, minutes, seconds } = this.calculateTimeUnits(this.lastTime);

        const updateClock = () => {
            this.updateClockDisplay(days, hours, minutes, seconds);
        };

        const countdown = () => {
            this.lastTime -= 1;
            this.lastTime > 0 ? updateClock() : this.unschedule(countdown);
        };
        this.schedule(countdown);
    }

    private calculateTimeUnits(timeInSeconds: number) {
        const days = Math.floor(timeInSeconds / (24 * 60 * 60));
        const hours = Math.floor((timeInSeconds / (60 * 60)) % 24);
        const minutes = Math.floor((timeInSeconds / 60) % 60);
        const seconds = Math.floor(timeInSeconds % 60);

        return { days, hours, minutes, seconds };
    }

    private updateClockDisplay(days: number, hours: number, minutes: number, seconds: number) {
        let timeString = `${days}D `;
        if (Data.Library.RES_LANGUAGE === "tai") {
            timeString = `${days}วัน `;
        }
        if (days <= 0) {
            timeString = "";
        }

        timeString += this.formatTimeUnit(days, hours, "H", "ชม.");
        timeString += this.formatTimeUnit(days, minutes, "M", "น.");
        if (days <= 0) {
            timeString += seconds;
        }

        this.activityClock.getComponent(Label).string = timeString;
    }

    private formatTimeUnit(days, unit: number, suffix: string, taiSuffix: string): string {
        let formattedUnit = unit < 10 ? `0${unit}` : `${unit}`;
        if (days <= 0) {
            formattedUnit += ":";
        } else if (Data.Library.RES_LANGUAGE === "tai") {
            formattedUnit += taiSuffix;
        } else {
            formattedUnit += suffix;
        }
        return formattedUnit;
    }
    //end

    /**更新Icon進度條 */
    caculate_percent() {
        if (this.nowRound > Data.Treasure.msg.cur_round) {
            SpineInit(this.collect);
            SpinePlay(this.collect, { use: 'set', trackIndex: 0, anmName: '0', loop: false });
        }

        let progress = Data.Treasure.msg.cur_round / Data.Treasure.msg.max_round // 進度比例 (0 ~ 1)

        this.nowRound = Data.Treasure.msg.cur_round;

        if (Data.Treasure.TreaseCentIn != null) {
            progress = 1;
        } else if (progress >= 1 && Data.Treasure.TreaseCentIn == null) {
            progress = 0.99;
        }

        this.CaculateProgress(progress);
        this.PlayStarAni(progress);

        let level: number = null;
        if (Data.Treasure.TreaseCentIn == null) {
            level = Data.Treasure.msg.prob_config_idx == 0 ? 1 : Data.Treasure.msg.prob_config_idx;
        } else {
            level = Data.Treasure.TreaseCentIn.prob_config_idx;
        }
        this.PlayIconAni(progress, `lv${level}`);

    }

    CaculateProgress(progress: number) {
        for (let i = 0; i < this.percentAni.length; i++) {
            if (progress >= this.percentPart[i] && progress < this.percentPart[i + 1]) {
                if (this.collect.getCurrent(this.trackIndex[i]) == null) {
                    SpinePlay(this.collect, { use: 'add', trackIndex: this.trackIndex[i], anmName: this.percentAni[i], loop: false });
                }
                this.collect.getCurrent(this.trackIndex[i]).alpha = (progress - this.percentPart[i]) * 4;

            } else if (progress >= this.percentPart[i] && progress >= this.percentPart[i + 1]) {
                if (this.collect.getCurrent(this.trackIndex[i]) == null) {
                    SpinePlay(this.collect, { use: 'add', trackIndex: this.trackIndex[i], anmName: this.percentAni[i], loop: false });
                }
                this.collect.getCurrent(this.trackIndex[i]).alpha = 1;
            }
        }
        SpinePlay(this.collect, { use: 'set', trackIndex: 5, anmName: 'hit', loop: false });
    }

    /**播放進度條星星動畫 */
    PlayStarAni(progress: number) {
        let ani = progress < 0.9 ? 'normal' : 'highlight';
        SpineInit(this.starSpine);
        SpinePlay(this.starSpine, { use: 'set', trackIndex: 0, anmName: ani, loop: false });
    }

    /**播放Icon動畫 */
    PlayIconAni(progress: number, skin: string) {
        SpineInit(this.iconSpine);
        if (progress < 0.9) {
            SpinePlay(this.iconSpine, { use: 'set', trackIndex: 0, anmName: 'normal', loop: false, skin: skin });
        } else if (progress >= 0.9 && progress < 1) {
            SpinePlay(this.iconSpine, { use: 'set', trackIndex: 0, anmName: '99_begin', loop: false, skin: skin });
            SpinePlay(this.iconSpine, { use: 'add', trackIndex: 0, anmName: '99_idle', loop: true, skin: skin });
        } else {
            SpinePlay(this.iconSpine, { use: 'set', trackIndex: 0, anmName: '100_begin', loop: false, skin: skin });
            this.PlaySound("gaugeFull");
        }
    }

    /**開啟紅包畫面 */
    PacketSceneOpen() {
        tween(this.EventNode)
            .delay(2)
            .call(() => {
                //資料送給後端 判斷是否為獎金
                if (Data.Treasure.TreaseCentIn.featurebuy_type == 0) {  //獎金
                    this.win_coin = Data.Treasure.TreaseCentIn.cent;
                    this.prizeIndex = Data.Treasure.msg.prize_list.indexOf(this.win_coin);
                    if (this.prizeIndex >= 0 && this.prizeIndex < 4) {  //只會有0~3需要顯示level
                        this.coin_Level = Math.abs(this.prizeIndex - 4);
                    } else {
                        this.coin_Level = -1;
                    }

                    this.isCoin = true;
                    this.isCard = false;
                    this.delayTime = 7;

                    Data.Treasure.isWaiting = true;
                } else {
                    Data.Library.ProtoData.TreasureResult();
                    this.prizeIndex = Data.Treasure.msg.prize_list.lastIndexOf(Data.Treasure.TreaseCentIn.cent);
                    this.star_Level = Math.abs(this.prizeIndex + 1 - Data.Treasure.msg.prize_list.length) + 1;
                    this.isBetBtnInit = true;

                    this.isCard = true;
                    this.isCoin = false;
                    if (this.star_Level == 1 || this.star_Level == 2) {
                        this.delayTime = 8;
                    } else if (this.star_Level == 3) {
                        this.delayTime = 11;
                    } else if (this.star_Level == 4) {
                        this.delayTime = 13;
                    }
                }

                this.PrizeLock();
                this.EventNode.getComponent(UIOpacity).opacity = 255;

                this.TreasureChestInit();

                this.Transition.node.active = true;
                SpinePlay(this.Transition, { use: 'set', trackIndex: 0, anmName: 'begin', loop: false })
                SpinePlay(this.Transition, { use: 'add', trackIndex: 1, anmName: 'end', loop: false })
            })
            .to(0.75, { position: new Vec3(0, 0) }, { easing: 'bounceOut' })
            .call(() => {
                SpineInit(this.collect);
                SpinePlay(this.collect, { use: 'set', trackIndex: 0, anmName: '0', loop: false });
                let levelNum = Data.Treasure.msg.prob_config_idx == 0 ? 1 : Data.Treasure.msg.prob_config_idx;
                this.PlayIconAni(0, `lv${levelNum}`);
                this.AutoCoundownOccur(true);
            })
            .start();
    }

    /**關閉紅包畫面 */
    PacketSceneClose() {
        this.isPlayingAnm = false;
        this.isDoubleSpeed = false;
        this.playAnmTime = 0;
        this.autoCountdownNum = 0;

        tween(this.EventNode.getComponent(UIOpacity))
            .to(0.25, { opacity: 0 })
            .call(() => {
                this.EventNode.position = new Vec3(0, 1600);
                this.Transition.node.active = false;

                this.treasureChestNode.addChild(this.choosenNode.children[0]);

                Data.Treasure.TreaseCentIn = null;
                Data.Library.StateConsole.nextState();
            })
            .start();
    }
    //end

    /**鎖住獎勵 */
    PrizeLock() {
        let child = this.EventNode.getChildByName('prize').children;
        for (let i = 0; i < child.length; i++) {
            let numNode = child[i].getChildByName('num');
            let lockNode = child[i].getChildByName('lock');

            if (i == 0) {  //index0 是卡牌獎勵 此獎勵每種級距都會出現
                numNode.active = false;
                lockNode.active = false;
            } else {
                numNode.active = true;
                numNode.getComponent(Label).string = Data.Library.StateConsole.NumberToCent(Data.Treasure.msg.prize_list[i - 1]);
                lockNode.active = this.LockActive(Data.Treasure.TreaseCentIn.prob_config_idx, i);
            }
        }
    }
    LockActive(level: number, prize: number): boolean {
        if (level == 1) { return true };
        if (level == 5) { return false };
        return prize < (6 - level);
    }

    ControlBetBtn(useRecord: boolean = false) {
        if (!this.isBetBtnInit) { return; }

        if (!useRecord) {  //將玩家壓注改為最小
            this.betRecord = Data.Library.StateConsole.TotalIndex;
            Data.Library.StateConsole.TotalIndex = 0;
        } else {  //將玩家壓注恢復
            Data.Library.StateConsole.TotalIndex = this.betRecord;
            this.betRecord = -1;
            this.isCard = false;
            this.isBetBtnInit = false;
        }

        AllNode.Data.Map.get("BtnBet").getChildByName("Bet").getComponent(Label).string = Data.Library.StateConsole.NumberToCent(Data.Library.StateConsole.TotalArray[Data.Library.StateConsole.TotalIndex]);
        Data.Library.StateConsole.BetIndex = Data.Library.StateConsole.TotalArrayX[Data.Library.StateConsole.TotalIndex][0];
        Data.Library.StateConsole.RateIndex = Data.Library.StateConsole.TotalArrayX[Data.Library.StateConsole.TotalIndex][1];
        if (Data.Library.StateConsole.TotalIndex == 0) {
            AllNode.Data.Map.get("SettingsPage").getChildByName("BetLessBtn").getComponent(Sprite).spriteFrame = Data.Library.UIcontroller.BetLess_off;
            AllNode.Data.Map.get("SettingsPage").getChildByName("BetLessBtn").getComponent(Button).enabled = false;
        }
        if (Data.Library.StateConsole.TotalIndex < Data.Library.StateConsole.TotalArray.length - 1) {
            AllNode.Data.Map.get("SettingsPage").getChildByName("BetPlusBtn").getComponent(Sprite).spriteFrame = Data.Library.UIcontroller.BetAdd_act;
            AllNode.Data.Map.get("SettingsPage").getChildByName("BetPlusBtn").getComponent(Button).enabled = true;
        }
        if (Data.Library.UIcontroller.featureBuyButton.isValid) {
            if (Data.Library.LuckyStrikeMaxBetting < Data.Library.StateConsole.getRateXBet() * Data.Library.UIcontroller.minLuckyStrikeNum) {
                Data.Library.UIcontroller.featureBuyButton.active = false;
            } else {
                Data.Library.UIcontroller.featureBuyButton.active = true;
            }
        }
        AllNode.Data.Map.get("HelpPage").getComponent(PayTableInit).checkPay();
        Data.Library.UIcontroller.handleMiniSpin();
    }


    /**寶箱動作: 初始化 */
    TreasureChestInit() {
        for (let i = 0; i < this.treasureChestAry.length; i++) {
            let chest = this.treasureChestAry[i].getChildByName('chest').getComponent(sp.Skeleton);
            let glow = this.treasureChestAry[i].getChildByName('glow').getComponent(sp.Skeleton);
            let card = this.treasureChestAry[i].getChildByName('card').getComponent(sp.Skeleton);

            SpineInit(chest);
            SpineInit(glow);
            SpineInit(card);

            this.SocketParentControl(chest.node, 255);
            this.SocketParentControl(card.node, 0);

            SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: 'idle', loop: false })
        }

        let cardFx = this.EventNode.getChildByName('cardFx').getComponent(sp.Skeleton);
        let sign = this.EventNode.getChildByName('sign').getComponent(sp.Skeleton);

        SpineInit(cardFx);
        SpineInit(sign);

        sign.node.active = false;

        this.schedule(this.ChestShiny, 5);
    }

    /**隨機撥放寶箱閃光 */
    ChestShiny() {
        if (Data.Treasure.isWaiting) {
            let ran = Math.floor(Math.random() * this.treasureChestAry.length);
            for (let i = 0; i < this.treasureChestAry.length; i++) {
                let anm = i == ran ? 'idle2' : 'idle';
                let chest = this.treasureChestAry[i].getChildByName('chest').getComponent(sp.Skeleton);
                SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: anm, loop: false })
            }
        }
    }

    AutoCoundownOccur(occur: boolean) {
        this.countdown.active = occur;
        if (occur) {
            this.countdownText.string = `${this.autoCountdownMax}`;
            this.schedule(this.AutoCountdown, 1)
        } else {
            this.unschedule(this.AutoCountdown);
        }
    }

    /**自動選取寶箱 */
    AutoCountdown() {
        if (this.autoCountdownNum == this.autoCountdownMax) {
            let ran = Math.floor(Math.random() * this.treasureChestAry.length);
            this.chooseTreasure(null, ran);
        }
        this.countdownText.string = `${this.autoCountdownMax - ++this.autoCountdownNum}`;
    }

    chooseTreasure(btn, str) {
        if (!Data.Treasure.isWaiting) { return; }

        Data.Treasure.isWaiting = false;
        this.AutoCoundownOccur(false);

        this.unschedule(this.ChestShiny);

        this.TreasureOpen(parseInt(str));
    }

    /**寶箱動作: 開啟選擇的寶箱 */
    TreasureOpen(index: number) {
        let cardFx = this.EventNode.getChildByName('cardFx').getComponent(sp.Skeleton);
        let sign = this.EventNode.getChildByName('sign').getComponent(sp.Skeleton);
        let chest = this.treasureChestAry[index].getChildByName('chest').getComponent(sp.Skeleton);
        let glow = this.treasureChestAry[index].getChildByName('glow').getComponent(sp.Skeleton);
        let card = this.treasureChestAry[index].getChildByName('card').getComponent(sp.Skeleton);

        sign.node.active = true;
        this.choosenNode.addChild(this.treasureChestAry[index]);

        this.PlaySound("chestOpen");
        let level = null;

        if (this.isCoin) {
            this.SocketParentControl(card.node, 0);
            this.SocketNumControl(chest.node, Data.Library.StateConsole.NumberToCent(this.win_coin));

            if (this.coin_Level <= 1) {
                SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: 'coin_open_small', loop: false })
                SpinePlay(chest, { use: 'add', trackIndex: 0, anmName: 'coin_idle', loop: true })
            } else {
                SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: 'coin_open', loop: false })
                SpinePlay(chest, { use: 'add', trackIndex: 0, anmName: 'coin_enlarge_idle', loop: false })
                SpinePlay(chest, { use: 'add', trackIndex: 0, anmName: 'coin_shrink', loop: false })
                SpinePlay(chest, { use: 'add', trackIndex: 0, anmName: 'coin_idle', loop: true })
            }

            if (this.coin_Level >= 1 && this.coin_Level <= 4) {
                SpinePlay(sign, { use: 'set', trackIndex: 0, anmName: `coin_open${this.coin_Level}`, loop: false })
                SpinePlay(sign, { use: 'add', trackIndex: 0, anmName: `coin_open_loop${this.coin_Level}`, loop: true })
                level = this.coin_Level;
            }
            this.isCoin = false;
        }

        if (this.isCard) {
            let cardSkin = this.star_Level == 1 ? "4star" : "5star";
            level = 5

            this.SocketParentControl(chest.node, 255);
            this.SocketNumControl(card.node, Data.Library.StateConsole.FeatureGameCurTotalspins);

            SpinePlay(cardFx, { use: 'set', trackIndex: 0, anmName: `card_open_lv${this.star_Level}`, loop: false, skin: `lv${this.star_Level}` })

            SpinePlay(card, { use: 'set', trackIndex: 0, anmName: `card_open_lv${this.star_Level}`, loop: false, skin: cardSkin })

            SpinePlay(glow, { use: 'set', trackIndex: 0, anmName: 'card_open', loop: false, skin: `lv${this.star_Level}` })

            SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: 'card_open', loop: false, skin: `lv${this.star_Level}` })
            SpinePlay(chest, { use: 'add', trackIndex: 0, anmName: 'card_enlarge_idle', loop: false })

            SpinePlay(sign, { use: 'set', trackIndex: 0, anmName: 'card_open', loop: false })
            SpinePlay(sign, { use: 'add', trackIndex: 0, anmName: 'card_open_loop', loop: true })
        }

        if (level != null) {
            this.scheduleOnce(() => {
                this.PlaySound(`rewardLv${level}`);
            }, 1)
        }

        this.isPlayingAnm = true;

        this.scheduleOnce(this.PacketSceneClose, this.delayTime)
    }

    SwitchSkipButton(state: number) { //0: 初始化、1:開啟、2:關閉
        let spine = this.skipBtn.getChildByName("spine").getComponent(sp.Skeleton);
        if (state == 0) {
            this.skipBtn.active = false;
            SpineInit(spine)
        } else if (state == 1) {
            this.skipBtn.active = true;
            SpinePlay(spine, { use: 'set', trackIndex: 0, anmName: 'idle', loop: false })
        } else if (state == 2) {
            SpinePlay(spine, { use: 'set', trackIndex: 0, anmName: 'hit', loop: false })
            SpinePlay(spine, { use: 'add', trackIndex: 0, anmName: 'none', loop: false })
        }
    }

    /**動畫兩倍速 */
    DoubleSpeed() {
        if (!this.isPlayingAnm || this.isDoubleSpeed) { return; }

        this.SwitchSkipButton(2);

        this.isDoubleSpeed = true;

        let children = this.choosenNode.children;
        let child = children[0].children;

        this.EventNode.getChildByName('cardFx').getComponent(sp.Skeleton).timeScale = 2;
        this.EventNode.getChildByName('sign').getComponent(sp.Skeleton).timeScale = 2;
        for (let i = 0; i < child.length; i++) {
            if (child[i].name == 'click') { continue; }

            child[i].getComponent(sp.Skeleton).timeScale = 2;
        }

        this.unschedule(this.PacketSceneClose);

        let delay = Math.floor((this.delayTime - this.playAnmTime) / 2) + 1;
        this.scheduleOnce(this.PacketSceneClose, delay)
    }

    /**寶箱動作: 開啟未選擇的寶箱 */
    TreasureNonSelectOpen() {
        let ranStart = 5 - Data.Treasure.TreaseCentIn.prob_config_idx;
        let ranEnd = Data.Treasure.msg.prize_list.length;
        let len = ranEnd - ranStart;

        let existPrize: number[] = [this.prizeIndex];  //已出現過的獎項

        let child = this.treasureChestNode.children;
        for (let i = 0; i < child.length; i++) {
            let chest = child[i].getChildByName('chest').getComponent(sp.Skeleton);
            let card = child[i].getChildByName('card').getComponent(sp.Skeleton);

            let ranPrize: number;
            while (true) {
                ranPrize = ranStart + Math.floor(Math.random() * len);

                if (existPrize.indexOf(ranPrize) == -1) {
                    existPrize.push(ranPrize);
                    break;
                }
            }

            let prize = Data.Treasure.msg.featurebuy_list[ranPrize] == 0 ? 'coin' : 'card';
            SpineInit(chest, { trackIndex: -1, poseInit: false, enabled: true })
            SpineInit(card, { trackIndex: -1, poseInit: false, enabled: true })
            switch (prize) {
                case 'card':
                    this.SocketParentControl(card.node, 255);
                    this.SocketParentControl(chest.node, 255);
                    SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: 'card_open_non-selected', loop: false });
                    SpinePlay(card, { use: 'set', trackIndex: 0, anmName: 'card_open_non-select', loop: false });
                    break;
                case 'coin':
                    this.SocketParentControl(card.node, 0);
                    this.SocketNumControl(chest.node, Data.Library.StateConsole.NumberToCent(Data.Treasure.msg.prize_list[ranPrize]), 178);
                    SpinePlay(chest, { use: 'set', trackIndex: 0, anmName: 'coin_open_non-selected', loop: false });
                    break;
                default:
                    break;
            }
        }
    }

    /**撥放音效 */
    PlaySound(str: string) {
        if (Data.Library.StateConsole.isMute == false)
            this.soundNode.getChildByName(str).getComponent(AudioSource).play();
    }

    /**父節點透明度控制 & 關閉子節點(socket)
     * @param node 父節點
     * @param opacity 透明度
    */
    SocketParentControl(node: Node, opacity: number) {
        if (node == null || opacity == null) { return; }

        node.getComponent(UIOpacity).opacity = opacity;

        let socket = node.getChildByName('socket');
        socket.active = false;
        socket.getChildByName('num').getComponent(Label).string = '';
    }

    /**開啟父節點opacity & 開啟子節點(socket)active & 更新label.opacity及label.string
     *@param node 父節點
     *@param num label.string
     *@param opacity label.color 的透明度
    */
    SocketNumControl(node: Node, num: number = null, opacity = 255) {
        if (node == null || num == null) { return; }

        let socket = node.getChildByName('socket');
        let label = socket.getChildByName('num').getComponent(Label);
        label.color = new Color(255, 255, 255, opacity);
        label.string = `${num}`;

        node.getComponent(UIOpacity).opacity = 255;
        socket.active = true;
    }
    //end

    /**開關規則表 */
    RulePageOccur(btn, occur) {
        let bool: boolean = JSON.parse(occur);
        if (bool && (Data.Library.StateConsole.isMenuOn ||
            AllNode.Data.Map.get((Data.Library as any)?.isNewAudio ? "Trans" : "BaseGame/Trans")?.active ||
            AllNode.Data.Map.get("BigwinAnm").active)
        ) { return; }

        Data.Library.StateConsole.isMenuOn = bool;

        this.RulesNode.active = bool;
    }

    /**規則表初始化 */
    InitHelpText(helpText) {
        let config = helpText.HelpTextConfig;

        config.forEach((value, index) => {
            let height = 22;
            let y = value.position.y - 460 - index * height;

            let labelNode = new Node();
            labelNode.setPosition(0, y);
            labelNode.addComponent(RichText);
            labelNode.addComponent(UITransform)

            let label = labelNode.getComponent(RichText);
            label.lineHeight = height;
            label.horizontalAlign = HorizontalTextAlignment.LEFT
            label.string = value.lineText;
            label.fontSize = value.fontSize;
            label.maxWidth = 580

            this.TextLabel.addChild(labelNode);
        })
    }
}