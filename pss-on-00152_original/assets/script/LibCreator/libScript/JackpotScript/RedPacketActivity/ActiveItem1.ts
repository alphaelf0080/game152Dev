import { _decorator, Component, Node, find, sp, log, Label, resources, JsonAsset, instantiate, UITransform, clamp, Overflow, Sprite, Color, ImageAsset, Texture2D, SpriteAtlas, Skeleton, ScrollView, UIOpacity, SpriteFrame, LabelOutline, tween, assetManager } from 'cc';
import { RedJackpot } from 'db://assets/script/LibCreator/libScript/JackpotScript/RedPacketActivity/RedJackpot';
import { Data, Mode } from 'db://assets/script/DataController';
import { APIController } from 'db://assets/script/LibCreator/libLoadingInit/APIController';
import { CommonVariableData } from 'db://assets/script/LibCreator/libScript/CommonVariable';
import { AllNode, Logger } from 'db://assets/script/LibCreator/libScript/CommonLibScript';
import { AnimationController } from 'db://assets/script/AnimationController';
import { ActivityTip } from 'db://assets/script/LibCreator/libScript/JackpotScript/RedPacketActivity/ActivityTipsLangs';
import { IActivityRuleTextLine, IActivityTextConfig } from 'db://assets/script/LibCreator/libScript/Interface/CommonInterface';

const { ccclass, property } = _decorator;

const MAX_SCROLL_TENT_LEG = 5;
@ccclass('ActiveItem1')
export class ActiveItem1 extends Component {
    private init: boolean = false;
    private level: number = 0;
    private nextLevel: number = 0;
    private percent: number = 0;
    private banner: Node | null = null;  //Node | null 明確表示這個屬性可能還沒被賦值。
    private bannerState: boolean = true;
    private redPocketCollect: Node | null = null;
    private redPocketCollectAnm: sp.Skeleton | null = null;

    private SpinredCollect: Node | null = null;
    private luckyWin: number = 0;
    private lastTime: number = 0;
    private lastClock: Node | null = null;
    private scrollTent: Node | null = null;
    private scrollTentLeg: number = 0;
    private rBtn: Node | null = null;
    private lBtn: Node | null = null;
    private next: number = 0;
    private api: APIController | null = null;

    private gameList: Node | null = null;
    private clickBtn: Node | null = null;
    private MaxPriceText: Node | null = null;
    private MaxPriceNumber: Label | null = null;
    private ActiveRule3Node: Node | null = null;
    private ActiveRule3Number: Label | null = null;
    private RandomTimesNode: Node | null = null;
    private RandomTimesNumber: Label | null = null;
    private tipsNode: Node | null = null;
    private tipsText: Node | null = null;
    private curPercentText: Node | null = null;

    private stateConsole = Data.Library.StateConsole;

    protected override start(): void {
        if (find("APIConsole") === null) {
            this.getMap("JpRedPacket")?.getComponent(RedJackpot)?.initItem()
        }
        this.stateConsole = Data.Library.StateConsole;
    }

    getMap(node: string): Node {
        return AllNode.Data.Map.get(node)!;
    }

    protected override update() {
        this.updateActiveShow()
        this.updateScrollBtn();
    }
    /*
     * 動態新增活動對話框
     */
    private addDialogSprite(res: SpriteFrame) {
        const parent = AllNode.Data.Map.get("ActivityRound");
        if (!res || !parent) return;

        const dialogNode = new Node('Dialog');
        dialogNode.setPosition(90, 550);
        const sprite = dialogNode.addComponent(Sprite);    // 用回傳值，避免重複 getComponent
        sprite.spriteFrame = res;
        sprite.sizeMode = Sprite.SizeMode.RAW;
        dialogNode.active = true;
        parent.addChild(dialogNode);
        this.tipsNode = dialogNode;
        this.tipsNode.active = false;

        const dialogText = new Node('dialogText');
        const dialogTextUI = dialogText.addComponent(UITransform);
        dialogTextUI.setContentSize(160, 70);
        const dialogTextLabel = dialogText.addComponent(Label);
        dialogTextLabel.string = ActivityTip['sch'].title;
        dialogTextLabel.overflow = Overflow.SHRINK;
        dialogTextLabel.verticalAlign = Label.VerticalAlign.TOP;
        dialogTextLabel.lineHeight = dialogTextLabel.fontSize * 1.2;
        dialogTextLabel.color = new Color(0, 0, 0, 255);
        dialogNode.addChild(dialogText);
        this.tipsText = dialogText;
        //
        const curPercentText = new Node('CurPercentText');
        curPercentText.setPosition(70, 550);
        parent.addChild(curPercentText);
        curPercentText.setSiblingIndex(0);
        const curPercentTextLabel = curPercentText.addComponent(Label);
        curPercentTextLabel.color = new Color(255, 255, 255, 255);
        curPercentTextLabel.enableOutline = true;
        curPercentTextLabel.outlineColor = new Color(0, 0, 0, 255);
        curPercentTextLabel.outlineWidth = 2;
        this.curPercentText = curPercentText;

        this.handleCurPercentText(this.percent);
    }

    private handleCurPercentText(percent: number) {
        if (!this.curPercentText) return;
        const curPercentTextLabel = this.curPercentText.getComponent(Label);
        if (curPercentTextLabel) {
            curPercentTextLabel.string = `${percent}%`;
            curPercentTextLabel.fontSize = 25 + 20 * (percent / 100);
        }
    }

    private updateActiveShow() {
        const red = this.redPocketCollect;
        if (!red) return;

        // 取或補一個 UIOpacity，避免沒有元件時報錯
        const opacity = red.getComponent(UIOpacity) ?? red.addComponent(UIOpacity);

        const soundNodeActive = !!AllNode.Data.Map.get((Data.Library as any)?.isNewAudio ? "Trans" : "BaseGame/Trans")?.active

        if (this.stateConsole?.isMenuOn || soundNodeActive || this.getMap("BigwinAnm")?.active) {
            opacity.opacity = 0;
            this.getMap("ActivityRule").active = false;
        } else {
            opacity.opacity = 255;
        }
    }

    private updateScrollBtn() {
        if (!this.scrollTent) return;
        if (this.scrollTentLeg <= MAX_SCROLL_TENT_LEG || !this.getMap("ScrollView").active) {
            this.toggleScrollButtons(false);
            return;
        }
        this.lBtn && (this.lBtn.active = this.scrollTent.getPosition().x <= -337);
        this.rBtn && (this.rBtn.active = this.scrollTent.getPosition().x >= (-333 - 134 * (this.scrollTentLeg - MAX_SCROLL_TENT_LEG)));
    }

    private toggleScrollButtons(state: boolean) {
        this.rBtn && (this.rBtn.active = state);
        this.lBtn && (this.lBtn.active = state);
    }

    public ScrollCallback(event: Event, event_id: number) {
        if ([CommonVariableData.ScrollEventType.SCROLLING, CommonVariableData.ScrollEventType.SCROLL_ENDED].indexOf(event_id)) {
            this.scrollToNext();
        }
    }

    private scrollToNext() {
        if (this.next === 1 && this.lBtn?.active) {
            this.scrollTent?.setPosition(-335, 0);
        } else if (this.next === 2 && this.rBtn?.active) {
            this.scrollTent?.setPosition((-335 - 134 * (this.scrollTentLeg - MAX_SCROLL_TENT_LEG)), 0);
        }
        this.next = 0;
    }

    public ScrollLeft() {
        this.scrollTent?.setPosition(-335, 0);
        this.next = 1;
    }

    public ScrollRight() {
        this.scrollTent?.setPosition((-335 - 134 * (this.scrollTentLeg - MAX_SCROLL_TENT_LEG)), 0);
        this.next = 2;
    }

    public HandleBroadcast(data: any) {
        if (data.EnventID == Data?.Library?.EVENTID[Mode.EVENTTYPE.COMMON]?.eNETREADY) {
            this.handleNetReady();   // NetReady         
        }
        if (data.EnventID == Data?.Library?.EVENTID[Mode.EVENTTYPE.STATE]?.eSTATECHANGE) {
            // StateChange
            this.HandleStateChange(data.EnventData);
            return;
        }
    }

    async loadingFinish() {
        return new Promise<void>((resolve) => {
            if (Data.Library.yieldCount === 0) {
                resolve();
            } else {
                const check = () => {
                    if (Data.Library.yieldCount === 0) {
                        this.unschedule(check);
                        resolve();
                    }
                };
                this.schedule(check, 0.1);
            }
        });
    }

    private async handleNetReady() {
        if (find("APIConsole")) {
            this.api = (find("APIConsole")?.getComponent(APIController) ?? null);
            const psImages = this.api?.getPsImages();
            if (psImages && psImages.type[3] === 1) {
                Logger.debug("active init");
                let updateWait = () => {
                    if (Data.Library.yieldCount === 0) {
                        this.unschedule(updateWait);
                        this.updateText()  //更新活動規則表第三條規則賠率
                        Logger.debug("updateWait activeitem");

                        this.banner = find("Canvas/Activity/ActBanner/Anm");
                        const skeleton = this.banner?.getComponent(sp.Skeleton);
                        if (skeleton && this.api?.ActBannerJson) {
                            skeleton.skeletonData = this.api?.ActBannerJson;
                            skeleton?.clearTracks();
                            skeleton?.setToSetupPose();
                            skeleton?.addAnimation(0, 'loop', true);
                        }
                        this.bannerState = true;
                        const show = Data.RedPacket.LuckyDraw != null && Data.RedPacket.LuckyDraw.enable;
                        this.getMap("ActBanner").active = show;
                        if (show) this.ActivityOpen()
                    }
                }
                this.schedule(updateWait);
                return;
            }
        } else {
            if (assetManager.resources) {
                assetManager.resources.load('act/activitytextconfigx', (err: any, res: JsonAsset) => {
                    if (err || !res) {
                        console.error('活動文字設定載入失敗:', err);
                        return;
                    }
                    const actText = res.json as IActivityTextConfig; // Cast to IActivityTextConfig
                    this.loadActText(actText.HelpTextConfig, actText.maxSegmentLength);
                });
                assetManager.resources.load('pic/dialog/spriteFrame', SpriteFrame, (err: any, res: SpriteFrame) => {
                    if (err || !res) {
                        console.error('對話框圖資載入失敗:', err);
                        return;
                    }
                    this.addDialogSprite(res);
                });
            } else {
                console.error('assetManager.resources is null.');
            }
        }

        this.getMap("ActBanner").active = false;
    }

    public HandleStateChange(state: number) {
        const stateHandlers: Record<number, () => void> = {
            [Mode.FSM.K_IDLE]: () => {
                this.handleIdleState();
            },
            [Mode.FSM.K_SPIN]: () => {
                this.handleSpinState();
            },
            [Mode.FSM.K_SHOWREDP]: () => {
                this.handleShowJackpotState();
            }
        };

        // Execute the handler for the current state
        if (stateHandlers[state]) {
            stateHandlers[state]();
        } else {
            // Handle unknown state if necessary
        }
    }

    // State handling functions
    handleIdleState() {
        if (this.luckyWin > 0) {
            let animationController = this.getMap("Animation").getComponent(AnimationController);
            animationController.LocalCent += this.luckyWin;
            let creditLabel = this.getMap("Credit").getComponent(Label);
            creditLabel.string = this.stateConsole.NumberToCent(animationController.LocalCent);
            this.luckyWin = 0;
        }
    }

    handleSpinState() {
        if (this.redPocketCollect && this.SpinredCollect) {
            this.SpinredCollect.getComponent(sp.Skeleton).addAnimation(0, 'collect', false);
        }
    }

    handleShowJackpotState() {
        if (Data.RedPacket.LuckyDraw?.enable == true) {
            if (Data.Jackpot.isOpenJackpot) find("Canvas/JackPotX").active = false;
            this.luckyWin = 0;
            for (let i = 0; i < Data.RedPacket.RedPackCentIn.length; i++) {
                if (Data.RedPacket.RedPackCentIn[i].type == "eRedPacket") {
                    this.luckyWin = this.luckyWin + Data.RedPacket.RedPackCentIn[i].cent;
                }
            }
            this.getMap("JpRedPacket").active = true;
            this.getMap("JpRedPacket").getComponent(RedJackpot).showJackpot(this.luckyWin);
        }
    }

    public CloseBanner() {
        if (this.bannerState) {
            this.bannerState = false;
            this.banner.getComponent(sp.Skeleton).addAnimation(1, 'end', false);
            this.banner.getComponent(sp.Skeleton).setCompleteListener((trackIndex) => {
                if (trackIndex.animation.name == "end") {
                    this.getMap("ActBanner").active = false;
                }
            });
        }
    }

    public loadActText(AText: IActivityRuleTextLine[], Max: number) {
        Logger.info("load Rule Text");
        let textContainer = find("Canvas/Activity/ActivityRule/Text/Contain");
        let baseText = find("Canvas/Activity/ActivityRule/Text/Contain/Label");

        textContainer.setPosition(-360, -460);
        AText.forEach((textConfig, i) => {
            let clone = i === 0 ? baseText : instantiate(baseText);
            clone.name = `Label${i}`;
            this.configureTextLabel(clone, textConfig, Max);
            textContainer.addChild(clone);
            if (i === 0) this.gameList = clone;
            if (i === 1) this.MaxPriceText = clone;
            if (i === 2) this.MaxPriceNumber = clone.getComponent(Label);
            if (i === 3) this.ActiveRule3Node = clone;
            if (i === 4) this.ActiveRule3Number = clone.getComponent(Label);
            if (i === 5) this.RandomTimesNode = clone;
            if (i === 6) this.RandomTimesNumber = clone.getComponent(Label);
        });

        this.setClickLabel();
        this.initScrollTent()
    }

    private updateText() {
        let bet: number;
        if (Data.Library.StateConsole.miniSpinCost !== 0) {
            bet = Data.Library.StateConsole.miniSpinCost;
        } else {
            bet = Data.Library.StateConsole.LineArray[0] * Data.Library.StateConsole.BetArray[0] * Data.Library.StateConsole.RateArray[0];
        }
        this.ActiveRule3Number.string = `${Data.Library.StateConsole.NumberToCent(bet * 4)}`;
        this.MaxPriceNumber.string = Data.Library.FakeRandomData.RSYB[0].toLocaleString();
    }

    private configureTextLabel(clone: Node, textConfig: IActivityRuleTextLine, maxSegmentLength: number) {
        const label = clone.getComponent(Label);
        label.useSystemFont = true;
        label.color = new Color(textConfig.color);
        label.string = textConfig.lineText;
        label.fontSize = textConfig.fontSize;
        label.lineHeight = textConfig.fontSize;
        label.overflow = Overflow.RESIZE_HEIGHT
        label.isBold = textConfig.fontName.toLowerCase().includes("bold");

        const isOverflow = this.autoSegmentText(textConfig.lineText, maxSegmentLength);
        label.overflow = isOverflow ? Overflow.RESIZE_HEIGHT : Overflow.NONE;

        const transform = clone.getComponent(UITransform);
        transform.width = isOverflow ? 592 : transform.width;
        transform.height = isOverflow ? textConfig.fontSize * 2 : transform.height;
        transform.setAnchorPoint(textConfig.Anchor.x, textConfig.Anchor.y);

        const yOffset = clone.name === "Label4" ? textConfig.fontSize * 1.5 : textConfig.fontSize;
        clone.setPosition(textConfig.position.x, isOverflow ? (textConfig.position.y - yOffset) : textConfig.position.y);
    }

    private autoSegmentText(text: string, maxSegmentLength: number) {
        return text.length > maxSegmentLength;
    }

    private setClickLabel() {
        this.clickBtn = this.getMap("Contain/Click");
        const clickLabel: Partial<Record<LangCode, string>> = {
            sch: "<点这儿>",
            tch: "<點擊這兒>",
            ind: "<Klik di sini>",
            tai: "<คลิกที่นี่>",
            kor: "<여기를 클릭하세요>",
        };
        const defaultText = "<Click here>";
        this.clickBtn.getComponent(Label).string = clickLabel[Data.Library.RES_LANGUAGE] || defaultText;
    }

    private adjustTextPositions() {
        this.updateText();
        // btn position
        this.clickBtn.setPosition(this.gameList.getPosition().x + this.gameList.getComponent(UITransform).contentSize.width + 10, this.gameList.getPosition().y);

        //第2段位置
        const MaxPriceTextPos = this.MaxPriceText.getPosition();
        const MaxPriceTextWidth = this.MaxPriceText.getComponent(UITransform).width;
        find("Canvas/Activity/ActivityRule/Text/Contain/Currency").setPosition(MaxPriceTextPos.x + MaxPriceTextWidth + 20, MaxPriceTextPos.y);
        this.MaxPriceNumber.node.setPosition(MaxPriceTextPos.x + MaxPriceTextWidth + 30, MaxPriceTextPos.y);

        //第3段位置
        const Rule3Width = this.ActiveRule3Node.getComponent(UITransform).width;
        const textPos = this.ActiveRule3Node.getPosition();
        this.ActiveRule3Number.node.setPosition(textPos.x + Rule3Width + 10, textPos.y);

        //第4段位置
        const RandomTimesWidth = this.RandomTimesNode.getComponent(UITransform).width;
        const textPos2 = this.RandomTimesNode.getPosition();
        this.RandomTimesNumber.node.setPosition(textPos2.x + RandomTimesWidth + 10, textPos2.y);
    }


    private initScrollTent() {
        if (!this.api) return;

        this.scrollTent = find("Canvas/Activity/ActivityRule/ScrollView/view/content");
        let Icon = find("Canvas/Activity/ActivityRule/ScrollView/view/content/Sprite");
        let SArray = this.api.ActivityGame;
        if (SArray.length > 0) {
            for (let i = 0; i < SArray.length; i++) {
                let clone = Icon;
                if (i > 0) {
                    clone = instantiate(Icon);
                }
                clone.getComponent(Sprite).spriteFrame = SArray[i];
                clone.getComponent(UITransform).width = 134;
                clone.getComponent(UITransform).height = 134;
                clone.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
                clone.setScale(0.85, 0.85);
                clone.setPosition(67 + 134 * i, 0);
                this.scrollTent.addChild(clone);
            }
            this.scrollTent.getComponent(UITransform).width = 134 * SArray.length;
            this.scrollTentLeg = SArray.length;
        } else {
            find("Canvas/Activity/ActivityRule/ScrollView/view/content/Sprite").active = false;
        }
        find("Canvas/Activity/ActivityRule/Rule").getComponent(Sprite).spriteFrame = this.api.ActivityUI.rule;
        find("Canvas/Activity/ActivityRule/CloseActivityWindow").getComponent(Sprite).spriteFrame = this.api.ActivityUI.close;
    }

    public ScrollEnable() {
        this.getMap("ScrollView").active = !this.getMap("ScrollView").active;
    }

    public ActivityOpen() {
        this.getMap("ScrollView").active = false;
        this.getMap("ActivityRule").active = true;
        this.scheduleOnce(() => {
            this.adjustTextPositions();
        }, 0.01);
    }

    public ActivityClose() {
        this.getMap("ScrollView").active = false;
        this.getMap("ActivityRule").active = false;
    }

    _initRedp = true;
    public updateData() {
        if (this.isLuckyDrawActive()) {
            this.redPocketCollect = this.getMap("ActivityRound");
            this.redPocketCollectAnm = this.redPocketCollect.getComponent(sp.Skeleton);
            if (this.isActivityTimeOut()) {
                Logger.info("Activity Time Out");
                return;
            }

            this.initializeClock(this._initRedp);
            if (this._initRedp) {
                this._initRedp = false;
                this.addDialogSprite(this.api?.RedpackData.Dialog);
                this.activateRedPocket();
            }
            this.checkAndUpdateLevel();
        } else {
            this.deactivateRedPocket();
        }
    }

    private isLuckyDrawActive(): boolean {
        return Data.RedPacket.LuckyDraw != null && Data.RedPacket.LuckyDraw.enable === true;
    }

    private isActivityTimeOut(): boolean {
        return Data.RedPacket.LuckyDraw.server_time > Data.RedPacket.LuckyDraw.end_time;
    }

    private activateRedPocket() {
        this.node.active = true;
        this.SpinredCollect = this.getMap("RoundCollect");
        this.lastClock = find("Canvas/Activity/ActivityRound/Click/Label");
        this.redPocketCollect.active = true;
        this.getMap("JpRedPacket").active = false;
    }

    private initializeClock(init: boolean) {
        this.lastTime = Data.RedPacket.LuckyDraw.end_time - Data.RedPacket.LuckyDraw.server_time;
        const updateClock = () => {
            const { days, hours, minutes, seconds } = this.calculateTimeUnits(this.lastTime);
            this.updateClockDisplay(days, hours, minutes, seconds);
        };

        const countdown = () => {
            this.lastTime -= 1;
            if (this.lastTime > 0) {
                updateClock();
            } else {
                this.unschedule(countdown);
            }
        };
        if (init)
            this.schedule(countdown, 1);
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

        this.lastClock.getComponent(Label).string = timeString;
    }

    private formatTimeUnit(days: number, unit: number, suffix: string, taiSuffix: string): string {
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

    private checkAndUpdateLevel() {
        this.nextLevel = Math.floor((Data.RedPacket.LuckyDraw.cur_round / Data.RedPacket.LuckyDraw.max_round) * 4);
        this.percent = Math.round(Data.RedPacket.LuckyDraw.cur_round / Data.RedPacket.LuckyDraw.max_round * 100);
        Logger.info(`Act Trigger: ${Data.RedPacket.LuckyDraw.cur_round} / ${Data.RedPacket.LuckyDraw.max_round}`);
        Logger.info(`Act Percent: ${this.percent}%`);

        if (Data.RedPacket.RedPackCentIn.length > 0) {
            this.nextLevel = 4;
        } else if (this.nextLevel >= 3) {
            this.nextLevel = 3;
        }

        if (!this.init) {
            this.init = true;
            this.initializeRedPocketAnimation();
        }
        this.updateLevel(this.percent);
        this.handleTip(Data.RedPacket.LuckyDraw.cur_round, Data.RedPacket.LuckyDraw.max_round, this.percent);
    }

    private lastShownTipLevel: number = 0;  // 上一次顯示的級距（0 表示還沒顯示過）
    private handleTip(curRound: number, maxRound: number, percent: number) {
        const lang = Data.Library.RES_LANGUAGE;
        let leftRound = maxRound - curRound;
        let titleTemplate: string = "";

        const step = 10;
        const level = Math.ceil(percent / step); // e.g. 25% → level=2，35% → level=3
        this.handleCurPercentText(percent);
        let shouldShow = false;
        if (level > this.lastShownTipLevel) {
            this.lastShownTipLevel = level;
            shouldShow = true;
        }

        if (percent >= 70) {  //70% 以上 show tilte2
            titleTemplate = ActivityTip[lang].title2.replace('Y', leftRound.toString());
        } else {
            titleTemplate = ActivityTip[lang].title.replace('X', percent.toString());
        }
        if (this.tipsText) {
            this.tipsText.getComponent(Label).string = titleTemplate;
        }
        if (shouldShow) {
            this.showTipsNode();
        }
    }

    private showTipsNode() {
        if (!this.tipsNode) return;
        const fadeTime = 0.3; // 淡入/淡出時間（秒）
        const stayTime = 3;   // 停留時間

        // 確保有 UIOpacity 組件（可重複使用）
        let uiOpacity = this.tipsNode.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.tipsNode.addComponent(UIOpacity);
        }

        this.tipsNode.active = true;
        uiOpacity.opacity = 0;

        // 清除前一個 tween（避免重疊）
        tween(this.tipsNode).stop();

        // 開始淡入 → 停留 → 淡出
        tween(uiOpacity)
            .to(fadeTime, { opacity: 255 }) // 淡入
            .delay(stayTime)                // 停留
            .to(fadeTime, { opacity: 0 })   // 淡出
            .call(() => {
                this.tipsNode.active = false;
            })
            .start();
    }

    private initializeRedPocketAnimation() {
        const skeleton = this.redPocketCollect.getComponent(sp.Skeleton);
        skeleton.clearTracks();
        skeleton.setToSetupPose();
        skeleton.addAnimation(0, '0begin', false);
        skeleton.addAnimation(0, '0', true);
    }

    private deactivateRedPocket() {
        if (this.redPocketCollect) {
            this.redPocketCollect.active = false;
            this.getMap("ActBanner").active = false;
        }
    }

    public initItem() {
        Logger.info("initItem");
        this.api = find("APIConsole")?.getComponent(APIController);

        this.getMap("ActivityRound").getComponent(sp.Skeleton).skeletonData = this.api.RedpackData.ActivityCollectAnm;
        this.redPocketCollect = this.getMap("ActivityRound");
        this.redPocketCollectAnm = this.redPocketCollect.getComponent(sp.Skeleton);
        if (this.api && this.api.getPsImages) {
            if (this.api.getPsImages().type[3] == 1) {
                this.rBtn = find("Canvas/Activity/ActivityRule/RightBtn");
                this.rBtn.getComponent(Sprite).type = 0;  // type SIMPLE
                this.lBtn = find("Canvas/Activity/ActivityRule/LeftBtn");
                this.loadActText(this.api.ActivityText, this.api.ActivityTextMax);
                return;
            }
        }
    }

    public endJackpot() {
        const anim = this.redPocketCollectAnm;
        if (!anim) return; // Cocos 綁定常見 null 安全
        this.getMap("JpRedPacket").active = false;
        this.lastShownTipLevel = 0; // Reset the tip level after jackpot end
        if (Data.Jackpot.isOpenJackpot) {
            const jackPotX = find("Canvas/JackPotX");
            if (jackPotX) jackPotX.active = true;
        }
        if (this.luckyWin > 0) {
            anim.addAnimation(1, 'get', false);
            this.scheduleOnce(() => {
                anim.addAnimation(2, 'end', false);
            }, 2.6667);
            this.scheduleOnce(() => {
                this.level = 0;
                anim.clearTracks();
                anim.setToSetupPose();
                anim.addAnimation(0, '0begin', false);
                anim.addAnimation(0, '0', true);
                this.stateConsole.nextState();
            }, 3);
        } else {
            anim.clearTracks();
            anim.addAnimation(1, 'end', false);

            this.scheduleOnce(() => {
                this.level = 0;
                anim.clearTracks();
                anim.setToSetupPose();
                anim.addAnimation(0, '0begin', false);
                anim.addAnimation(0, '0', true);
                this.stateConsole.nextState();
            }, 0.3333);
        }
    }

    public updateLevel(percent: number) {
        const anim = this.redPocketCollectAnm;
        if (!anim) return; // Cocos 綁定常見 null 安全
        if (this.nextLevel > this.level) {
            this.level = this.nextLevel;
            if (this.level == 4) {
                anim.clearTracks();
                anim.setToSetupPose();
                anim.addAnimation(0, '100', true);
                anim.timeScale = 1;
                return;
            } else {
                anim.addAnimation(1, 'end', false);
                let Rank = Math.floor(this.level * 25).toString();
                this.scheduleOnce(() => {
                    anim.clearTracks();
                    anim.setToSetupPose();
                    anim.addAnimation(0, Rank + 'begin', false);
                    anim.addAnimation(0, Rank, true);
                }, 0.5);
            }
        }
        if (percent > 75) {
            anim.timeScale = 1 + (percent - 75) * 0.1;
        }
    }

    public closeWindow() {
        this.getMap("ActivityRule").active = false;
    }
}