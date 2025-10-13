import { _decorator, Component, Node, find, Label, sp, tween, Sprite, assetManager, Color, Button, Texture2D, Vec2, instantiate, Vec3, UIOpacity } from 'cc';
import { ActiveItem1 } from 'db://assets/script/LibCreator/libScript/JackpotScript/RedPacketActivity/ActiveItem1';
import { Data } from 'db://assets/script/DataController';
import { APIController } from 'db://assets/script/LibCreator/libLoadingInit/APIController';
const { ccclass, property } = _decorator;
const DEF_AUTO_REVEAL_TIME = 10;
const SYMBOL_COUNT = 8;
@ccclass('RedJackpot')
export class RedJackpot extends Component {
    jpBlock: Node | null = null;
    autoRevealLabel: Node | null = null;
    anmPickOne: sp.Skeleton | null = null;
    anmMBoard: sp.Skeleton | null = null;
    anmSymbolBg: sp.Skeleton | null = null;
    NormalNum: Node | null = null;
    bigWinNum: Node | null = null;
    winRedPacket: Node | null = null;
    redSymbolBtn: Node | null = null;
    anmMSymbolArr: Node[] = [];
    btnSymbolArr: Node[] = [];
    fakeNumberArr: Node[] = [];
    symbolBtnPos: Vec3[] = [];
    symbolAnmPos: Vec3[] = [];
    selectNum: number = 0;
    timeAcc: number = 0;
    timeDec: number = DEF_AUTO_REVEAL_TIME;
    startCount: boolean = false;
    jpNumber: number = 0;
    _init: boolean = false;
    fakeNumString: number[] = [];

    public initItem(): void {
        //取得主要節點
        this.jpBlock = find("Canvas/JackPot/JpRedPacket/JpBlock");
        this.autoRevealLabel = find("Canvas/JackPot/JpRedPacket/AutoRevealLabel");
        this.NormalNum = find("Canvas/JackPot/JpRedPacket/NumberSymbol");
        this.bigWinNum = find("Canvas/JackPot/JpRedPacket/NumberBigSymbol");
        this.winRedPacket = find("Canvas/JackPot/JpRedPacket/WinRedPacketSym");
        this.redSymbolBtn = find("Canvas/JackPot/JpRedPacket/SymbolBtn");
        this.winRedPacket.getComponent(UIOpacity).opacity = 0;
        this.bigWinNum.getComponent(UIOpacity).opacity = 0;
        this.NormalNum.getComponent(UIOpacity).opacity = 0;
        this.node.active = false;

        //是否取用自訂資源
        let checkDisable = true;
        let API: APIController = null;
        if (find("APIConsole")) {
            API = find("APIConsole").getComponent(APIController);
            if (API.getPsImages()?.type[3] == 1) {
                checkDisable = false
            }
        }

        //取得資源
        if (checkDisable == false) {
            this.winRedPacket.getComponent(Sprite).spriteFrame = API.RedpackData.RpsymSprite;
            this.redSymbolBtn.getComponent(Sprite).spriteFrame = API.RedpackData.SymbolBtnSprite;
            this.node.getChildByName("BoardAnm").getComponent(sp.Skeleton).skeletonData = API.RedpackData.BoardAnm;
            this.node.getChildByName("PickOneAnm").getComponent(sp.Skeleton).skeletonData = API.RedpackData.PickOneAnm;
            this.node.getChildByName("SymbolBg").getComponent(sp.Skeleton).skeletonData = API.RedpackData.SymbolBgAnm;
            this.node.getChildByName("SymbolAnm").getComponent(sp.Skeleton).skeletonData = API.RedpackData.SymbolAnm;
        }

        //設定按鈕位置
        this.symbolAnmPos = [
            new Vec3(247, 905, 0), new Vec3(473, 905, 0),
            new Vec3(247, 711, 0), new Vec3(473, 711, 0),
            new Vec3(247, 517, 0), new Vec3(473, 517, 0),
            new Vec3(247, 323, 0), new Vec3(473, 323, 0)]
        // SymbolAnm位置
        this.anmPickOne = this.node.getChildByName("PickOneAnm").getComponent(sp.Skeleton);
        this.anmMBoard = this.node.getChildByName("BoardAnm").getComponent(sp.Skeleton);
        this.anmSymbolBg = this.node.getChildByName("SymbolBg").getComponent(sp.Skeleton);

        // 複製紅包動畫跟按鈕，並設置事件
        const cloneRedPacketAnm = find("Canvas/JackPot/JpRedPacket/SymbolAnm");
        const cloneRedPacketBtn = find("Canvas/JackPot/JpRedPacket/SymbolBtn");

        for (let i = 0; i < SYMBOL_COUNT; i++) {
            // SymbolBtn
            const RedPacketBtn = instantiate(cloneRedPacketBtn);
            RedPacketBtn.name = "SymbolBtn" + i;
            RedPacketBtn.active = false;
            find("Canvas/JackPot/JpRedPacket").addChild(RedPacketBtn);
            RedPacketBtn.setPosition(this.symbolAnmPos[i]);
            this.btnSymbolArr.push(RedPacketBtn);

            // SymbolAnm
            let RedPacketAnm = instantiate(cloneRedPacketAnm);
            (RedPacketAnm as any)._getscore = false;
            RedPacketAnm.name = "RedPacketAnm" + i;
            RedPacketAnm.active = false;
            find("Canvas/JackPot/JpRedPacket").addChild(RedPacketAnm);
            RedPacketAnm.setPosition(this.symbolAnmPos[i]);
            this.anmMSymbolArr.push(RedPacketAnm);

            // Spine事件
            RedPacketAnm.getComponent(sp.Skeleton).setEventListener((trackEntry, event: sp.spine.Event) => {
                if (event.data.name === 'number') this.anmNumberFunc(RedPacketAnm);
                if (event.data.name === 'end') this.anmEndFunc(RedPacketAnm);
            })
            this.fakeNumberArr.push(RedPacketAnm.getChildByName("fakeNumber"));
        }
        // PickOne動畫結束後，顯示所有按鈕
        this.anmPickOne?.setCompleteListener((trackIndex) => {
            if (trackIndex.animation.name == "begin_m") {
                this.btnSymbolArr.forEach((e, index) => {
                    e.active = true;
                });
            }
        });
        // 初始化自動選擇提示文字
        this.autoRevealLabel.getComponent(Label).string = "";
        this._init = true;
    }

    update(deltaTime: number): void {
        if (!this._init || !this.startCount) return;
        // 計算剩餘秒數
        let timeString = Math.ceil(DEF_AUTO_REVEAL_TIME - this.timeAcc);
        if (timeString !== this.timeDec)
            this.timeDec = timeString;
        // 根據語言切換提示文字
        let downString1 = "Auto-picked after ";
        let downString2 = " seconds";
        switch (Data.Library.RES_LANGUAGE) {
            case "tai":
                downString1 = "เลือกโดยอัตโนมัติหลังจาก ";
                downString2 = " วินาที";
                break;
            case "tch":
                downString1 = "自動選擇於 ";
                downString2 = " 秒後";
                break;
        }
        this.autoRevealLabel.getComponent(Label).string = downString1 + this.timeDec + downString2;
        this.timeAcc += deltaTime;
        if (this.timeAcc >= DEF_AUTO_REVEAL_TIME) {
            // 倒數結束，自動觸發第一個按鈕
            this.btnTouchEnable(this.btnSymbolArr[0].getComponent(Button));
        }
    }
    /**
     * 處理紅包動畫的數字事件
     */
    public anmNumberFunc(anm: Node): void {
        let num = Number(anm.name.match(/\d+/g)[0])
        // 判斷是否為 fake 數字動畫
        if ((this.anmMSymbolArr[num] as any)._getscore == false) {
            if (this.fakeNumString[num] == 0) return;
            this.fakeNumberArr[num].active = true;
            this.fakeNumberArr[num].getComponent(UIOpacity).opacity = 0;
            tween(this.fakeNumberArr[num].getComponent(UIOpacity))
                .to(.5, { opacity: 255 })
                .start();
            return;
        }
        // 得分動畫
        if (this.jpNumber > 0) {
            tween(this.bigWinNum.getComponent(UIOpacity))
                .to(.5, { opacity: 255 })
                .start();
            this.anmMSymbolArr[num].setSiblingIndex(50);
            this.bigWinNum.setSiblingIndex(50);
        } else {
            this.anmMSymbolArr[num].setSiblingIndex(50);
        }
    }
    /**
       * 處理紅包動畫的結束事件
       */
    public anmEndFunc(anm: Node): void {
        let num = Number(anm.name.match(/\d+/g)[0]) //回傳值是陣列，內容是字串中所有找到的數字（以字串型態）。
        // 非得分動畫直接返回
        if (!(this.anmMSymbolArr[num] as any)._getscore) {
            return;
        }
        // 其他 symbol 動畫 timeScale = 1
        for (let i = 0; i < SYMBOL_COUNT; i++) {
            // fake data
            if (i != num) {
                this.anmMSymbolArr[i].getComponent(sp.Skeleton).timeScale = 1;
            }
        }
        // 得分動畫 UI 處理
        if (this.jpNumber > 0) {
            this.winRedPacket?.setPosition(this.symbolAnmPos[num].x, this.symbolAnmPos[num].y + 15);
            this.winRedPacket.getComponent(UIOpacity).opacity = 255;
            this.winRedPacket?.setSiblingIndex(50);
            this.NormalNum.setPosition(this.symbolAnmPos[num].x, (this.symbolAnmPos[num].y - 14));
            this.NormalNum.getComponent(UIOpacity).opacity = 255;
            this.NormalNum.setSiblingIndex(50);
            this.anmMSymbolArr[num].active = false;
            tween(this.bigWinNum.getComponent(UIOpacity))
                .to(.5, { opacity: 0 })
                .start();
        } else {
            this.anmMSymbolArr[num].getComponent(sp.Skeleton).timeScale = 0;
        }
        // 1.9秒後 fake symbol timeScale = 0
        this.scheduleOnce(() => {
            for (let i = 0; i < SYMBOL_COUNT; i++) {
                if (i != num) {
                    this.anmMSymbolArr[i].getComponent(sp.Skeleton).timeScale = 0;
                }
            }
        }, 1.9);
        // 2.5秒後結束動畫與 UI 處理
        this.scheduleOnce(() => {
            this.anmMSymbolArr[num].getComponent(sp.Skeleton).timeScale = 1;
            this.anmMBoard.addAnimation(1, "end", false);
            tween(this.node.getComponent(UIOpacity))
                .to(0.5, { opacity: 0 })
                .call(() => {
                    for (let i = 0; i < SYMBOL_COUNT; i++) {
                        this.anmMSymbolArr[i].getComponent(sp.Skeleton).timeScale = 1;
                        this.anmMSymbolArr[i].active = false;
                    }
                    find("Canvas/JackPot").getComponent(ActiveItem1).endJackpot();
                })
                .start();
        }, 2.5);
    }
    /**
         * 顯示中獎紅包動畫與數字
         */
    public showJackpot(win: number): void {
        this.startCount = true;
        this.node.active = true;
        this.node.getComponent(UIOpacity).opacity = 255;
        // 所有按鈕可點擊
        this.btnSymbolArr.forEach((e) => {
            e.getComponent(Button).interactable = true;
        });

        this.jpNumber = win;
        if (this.jpNumber > 0) {
            // 顯示中獎數字
            this.NormalNum.getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(Data.Library.StateConsole.NumberToCent(this.jpNumber));
            this.NormalNum.active = true;

            this.bigWinNum.getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(Data.Library.StateConsole.NumberToCent(this.jpNumber));
            this.bigWinNum.active = true;
        } else {
            this.NormalNum.active = false;
            this.bigWinNum.active = false;
        }

        // 初始化所有 fake 數字透明度
        this.fakeNumberArr.forEach((e) => {
            e.getComponent(UIOpacity).opacity = 0;
        });
        this.winRedPacket.getComponent(UIOpacity).opacity = 0;
        this.bigWinNum.getComponent(UIOpacity).opacity = 0;
        this.NormalNum.getComponent(UIOpacity).opacity = 0;

        // 重設所有紅包按鈕與動畫位置
        for (let i = 0; i < SYMBOL_COUNT; i++) {
            this.btnSymbolArr[i].setPosition(this.symbolAnmPos[i]);
            this.anmMSymbolArr[i].setPosition(this.symbolAnmPos[i]);
        }

        // 播放主動畫
        this.handleSpineAnm(this.anmPickOne, null, 0, "begin_m", false);
        this.anmPickOne.addAnimation(0, "loop_m", true);
        this.anmPickOne.node.setSiblingIndex(100);

        this.handleSpineAnm(this.anmMBoard, null, 0, "begin", false);
        this.anmMBoard.addAnimation(0, "loop", true);
    }

    public btnTouchEnable(btn: Button): void {
        // 關閉所有按鈕
        this.btnSymbolArr.forEach((e) => {
            e.getComponent(Button).interactable = false;
            e.active = false;
        });

        this.anmPickOne.addAnimation(1, "end_m", false);

        // 取得按下的按鈕索引
        let index = Number(btn.target.name.match(/\d+/g)[0])
        this.selectNum = index;

        // 產生 fake 數據，最多允許 5 個 0
        let RanCheck = 0;
        for (let a = 0; a < SYMBOL_COUNT; a++) {
            let fake = this.getFakeData();
            if (fake == 0) RanCheck++;
            if (RanCheck >= 5) {
                while (fake == 0) {
                    fake = this.getFakeData();
                }
            }
            this.fakeNumString[a] = fake;
        };
        this.fakeNumString.sort(() => { return Math.random() > 0.5 ? -1 : 1; }); // 隨機排序 fake 數據
        // 播放主動畫
        this.handleSpineAnm(this.anmMSymbolArr[0].getComponent(sp.Skeleton), null, 0, "big_m", true);

        for (let i = 0; i < SYMBOL_COUNT; i++) {
            // 顯示 fake 數字
            this.fakeNumberArr[i].getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(Data.Library.StateConsole.NumberToCent(this.fakeNumString[i] * 100));
            this.anmMSymbolArr[i].active = true;
            if (i !== index) {
                (this.anmMSymbolArr[i] as any)._getscore = false;
                if (this.fakeNumString[i] === 0) {
                    this.handleSpineAnm(this.anmMSymbolArr[i].getComponent(sp.Skeleton), null, 0, "none_m", false);
                } else {
                    this.handleSpineAnm(this.anmMSymbolArr[i].getComponent(sp.Skeleton), null, 0, "small_m", false);
                }
                this.anmMSymbolArr[i].getComponent(sp.Skeleton).timeScale = 0;
            } else {
                (this.anmMSymbolArr[i] as any)._getscore = true;
                if (this.jpNumber > 0) {
                    this.anmMSymbolArr[i].setPosition(360, 532);
                    this.handleSpineAnm(this.anmMSymbolArr[i].getComponent(sp.Skeleton), null, 0, "big_m", false);
                    this.anmSymbolBg.node.setSiblingIndex(99);
                    this.handleSpineAnm(this.anmSymbolBg, null, 0, "big_m", false);
                } else {
                    this.anmMSymbolArr[i].setPosition(this.symbolAnmPos[i]);
                    this.handleSpineAnm(this.anmMSymbolArr[i].getComponent(sp.Skeleton), null, 0, "none_m", false);
                }

                this.anmMSymbolArr[i].setSiblingIndex(100);
                this.handleSpineAnm(this.anmPickOne, null, 0, "end_m", false);
                this.bigWinNum.setSiblingIndex(100);
            }
        }
        // 重設倒數
        this.timeAcc = 0;
        this.timeDec = DEF_AUTO_REVEAL_TIME;
        this.startCount = false;
    }

    public handleSpineAnm(obj: sp.Skeleton, skin: string | null, tracks: number, anm: string, loop: boolean): void {
        obj.node.active = true;
        obj.clearTracks();
        obj.setToSetupPose();
        if (skin !== null)
            obj.setSkin(skin);
        obj.setAnimation(tracks, anm, loop);
    }
    /**
       * 取得一組 fake 數據
       */
    public getFakeData(): number {
        let maxNum = Data.Library.FakeRandomData.TA - 1;
        let minNum = 0;
        let rng = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

        for (let i = 0; i < Data.Library.FakeRandomData.RSYB.length; i++) {
            if (rng < Data.Library.FakeRandomData.WT[i]) {
                return Data.Library.FakeRandomData.RSYB[i];
            }
            rng -= Data.Library.FakeRandomData.WT[i];
        }
        return 1;
    }
}

