import { _decorator, Component, Sprite, director, find, SpriteFrame, screen, assetManager, sp, JsonAsset, ImageAsset, Texture2D, UITransform, Label, AudioSource, Button, resources, log, instantiate, JavaScript, LabelAtlas, SpriteAtlas, SkeletalAnimation, Skeleton, TextAsset, sys, VideoPlayer, View, macro, game, ProgressBar, Node, Widget, Color, SortingLayers, Asset } from 'cc';
import { APIController } from './APIController';
import { Data } from '../../DataController';
import { RedJackpot } from '../libScript/JackpotScript/RedPacketActivity/RedJackpot';
import { ActiveItem1 } from '../libScript/JackpotScript/RedPacketActivity/ActiveItem1';
import { Logger } from '../libScript/CommonLibScript';
import { IActivityTextConfig } from '../libScript/Interface/CommonInterface';
import { LoadingImageEnum } from '../libScript/CommonEnum';
const { ccclass, property } = _decorator;
@ccclass('LoadingScene')
export class LoadingScene extends Component {
    @property({ type: SpriteFrame })
    loadingBannerArr: SpriteFrame[] = [];
    loadBgNums: number = 1;
    loadBannerNums: number = 5;
    loadBar: Node = null;
    loadHead: Node = null;
    loadNum: Node = null;
    loader: Node = null;
    fakeLoad: Node = null;
    loadString: string = "Loading... "
    loadingRound: sp.Skeleton = null;
    loadingObjecyType: { rectBar: number, roundBar: number } = { rectBar: 0, roundBar: 1 };
    loadingType: number;
    redPacketType: number;
    localServer: boolean = false;
    apiData: APIController;
    static LoadingFinish: boolean = false;
    protected override start() {
        Logger.info("LoadingScene 開始初始化");
        if (sys.isMobile) {
            this.handleMobile();           // 專屬手機旋轉
        } else {
            this.setupResizeCallback();    // 桌機用 resize（例如拖拉視窗）
        }
        if (find("APIConsole/ApiCanvas/FakeLoad")) {
            this.fakeLoad = find("APIConsole/ApiCanvas/FakeLoad");
        }
        if (!this.localServer) {  //是否用local Server 
            Logger.debug("啟動 bootstrap 模式");
            window["hostInitialize"] = null;
            assetManager.loadRemote<JavaScript>("./bootstrap.min.js", (err) => {   //載入 ps.api 設定
                if (err) {
                    Logger.error('載入 bootstrap.min.js 失敗:', err);
                    alert('Error : ' + err);
                    return;
                }
                this.loadInit();
            });
        } else {
            Logger.debug("使用本地服務器模式");
            this.initVar();
            this.loadGame();
            this.handleLoadingType();
        }
    }

    private _resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    // 設置 resize 回調
    setupResizeCallback() {
        View.instance.setResizeCallback(() => {
            const rect = game.canvas.getBoundingClientRect();
            Logger.debug("觸發視窗大小調整回調", rect);
            // 不重複呼叫 orientation 設定，或加 debounce 機制（可選）
            clearTimeout(this._resizeTimeout);
            this._resizeTimeout = setTimeout(() => {
                View.instance.setOrientation(macro.ORIENTATION_AUTO);
            }, 200); // 加長時間避免干擾
        });
    }
    // 處理手機裝置
    handleMobile() {
        if (!sys.isMobile) return;
        Logger.debug("檢測到手機裝置，設置為直向模式");
        View.instance.setOrientation(macro.ORIENTATION_PORTRAIT);
    }
    // 初始化變數
    initVar() {
        Data.Library.RES_LANGUAGE = (GetURLParameter('lang') as LangCode) || 'eng';
        const loadStrings: Record<string, string> = {
            eng: "Loading...", sch: "载入中...", tch: "載入中...", tai: "กำลังโหลด...",
            ind: "Memuat...", kor: "다운로드중...", vie: "Đang tải vào...", jp: "ロード中...",
            ru: "Загрузка...", por: "Carregando...", esp: "Cargando...", tur: "Yükleniyor..."
        };
        this.loadString = loadStrings[Data.Library.RES_LANGUAGE] || loadStrings['eng'];
        if (typeof window["psapi"] !== 'undefined')
            Data.Library.DEF_GAMEID = window["psapi"].hostInfo.game_id;

        // 快取節點
        this.loader = find("APIConsole/ApiCanvas/Loader");
        this.loadBar = find("APIConsole/ApiCanvas/Loader/StartBefore/BarUp");
        this.loadHead = find("APIConsole/ApiCanvas/Loader/StartBefore/BarHead");
        this.loadNum = find("APIConsole/ApiCanvas/Loader/StartBefore/BarNum");

        //進度條
        this.loadNum.getComponent(Label).string = this.loadString + "1%";

        this.apiData = this.node.getComponent(APIController);
        //在所有場景切換之間都會保留，不會被自動銷毀。
        director.addPersistRootNode(this.node);
        // 顯示遊戲版本
        this.addGameVersion();
    }
    // 添加遊戲版本顯示
    addGameVersion() {
        let label = new Node(); // add accountSN text
        find("APIConsole/ApiCanvas/Loader").addChild(label);
        label.name = "GameVersion";
        label.layer = 1 << 25; // 設定為第 25 層（UI_2D）
        label.addComponent(Label);
        const labelComp = label.getComponent(Label);
        labelComp.fontSize = 20;
        labelComp.string = "ver 0000";
        if (typeof window.psapi !== 'undefined') {
            const version = window.psapi.hostInfo.game_version.rev;
            Logger.debug(`遊戲版本: ${version}`);
            labelComp.string = `ver:${version}`;
        }
        let widget = label.addComponent(Widget);
        widget.isAlignRight = true; // 啟用對齊右側
        widget.right = 10; // 設定右邊距
        widget.isAlignBottom = true; // 啟用對齊底部
        widget.bottom = 150; // 設定底部
    }

    //判斷loading bar 是哪個模式 圓形或是方形
    handleLoadingType() {
        this.loadingObjecyType = {
            rectBar: 0,
            roundBar: 1,
        }
        this.loadingType = this.loadHead.active === true ? this.loadingObjecyType.rectBar : this.loadingObjecyType.roundBar;
        if (this.loadingType === this.loadingObjecyType.roundBar) {
            this.loadingRound = this.loadBar.getChildByName("loading_bar").getComponent(sp.Skeleton);
            this.loadingRound.clearTracks();
            this.loadingRound.setToSetupPose();
            this.loadingRound.setAnimation(0, "idle", true);
            this.loadingRound.addAnimation(1, "0", false);
            this.loadingRound.getCurrent(1).alpha = 0;
        }
    }

    // load 遠端動畫
    async loadSpine(path: [string, string, string, string], onSuccess: (asset: sp.SkeletonData) => void): Promise<void> {
        try {
            const loadRemote = <T extends Asset>(url: string): Promise<T> =>
                new Promise<T>((resolve, reject) => {
                    assetManager.loadRemote<T>(url, (err, asset) => {
                        if (err) {
                            Logger.error(`載入資源失敗: ${url}`, err);
                            reject(err);
                            return;
                        }
                        resolve(asset as T); // 確保回傳類型正確
                    });
                });

            // 加載資源
            const imageAsset = await loadRemote<ImageAsset>(path[0]);
            const atlasAsset = await loadRemote<TextAsset>(path[1]);
            const jsonAsset = await loadRemote<JsonAsset>(path[2]);

            // 組合 Spine 資源
            const texture = new Texture2D();
            texture.image = imageAsset;

            const spineAtlas = atlasAsset.text;
            const spineJson = jsonAsset.json as sp.spine.SkeletonJson;

            const asset = new sp.SkeletonData();
            asset._uuid = path[2];
            asset.skeletonJson = spineJson;
            asset.atlasText = spineAtlas;
            asset.textures = [texture];
            asset.textureNames = [path[3]];

            // 成功回調
            onSuccess(asset);
        } catch (error) {
            Logger.error("載入 Spine 資源失敗:", error);
        }
    }

    // load 遠端圖檔，並檢查圖片是否存在
    async loadRemotePicWithCheck(url: string, onSuccess: (sf: SpriteFrame) => void) {

        async function checkImageExists(url: string): Promise<boolean> {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok;  // 200~299 為 true
            } catch (err) {
                Logger.warn(`🔍 檢查圖片失敗: ${url}`, err);
                return false;
            }
        }

        const exists = await checkImageExists(url);
        if (!exists) {
            Logger.warn(`🛑 圖片不存在: ${url}`);
            return;
        }

        this.loadRemotePic(url, onSuccess);
    }

    // ImageAsset 創建 SpriteFrame (轉換成 Texture2D 再封裝 SpriteFrame)
    createSpriteFrameFromImageAsset(imageAsset: ImageAsset): SpriteFrame {
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture;
        return spriteFrame;
    }

    /**
     * 異步加載遠端圖像資源
     * @param filePath 圖像文件的遠端路徑
     * @returns Promise<ImageAsset> 返回Promise包裝的ImageAsset，成功時resolve圖像資源，失敗時reject錯誤
     * @description 將callback形式的assetManager.loadRemote轉換為Promise形式，便於使用async/await語法
     */
    tryLoad(filePath: string): Promise<ImageAsset> {
        return new Promise<ImageAsset>((resolve, reject) => {
            assetManager.loadRemote<ImageAsset>(filePath, (err, imageAsset) => {
                if (err) {
                    reject(err); // 加載失敗
                } else if (!imageAsset) {
                    reject(new Error(`No image content: ${filePath}`));
                } else {
                    resolve(imageAsset);
                }
            });
        });
    }

    // load 遠端圖檔
    async loadRemotePic(basePath: string, onSuccess: (spriteFrame: SpriteFrame) => void): Promise<void> {
        try {
            let imageAssetRes: ImageAsset | null = null;
            imageAssetRes = await this.tryLoad(basePath)// try加載
            const spriteFrame = this.createSpriteFrameFromImageAsset(imageAssetRes);
            onSuccess(spriteFrame); // 成功回調
        } catch (err) {
            Logger.error('圖片載入失敗:', err);
        }
    }

    // 添加 Promise 處理
    private addPromiseProcess(proms: Promise<void>[], func: (...args: any[]) => Promise<void>, ...args: any[]) {
        const prom = func(...args);
        proms.push(prom);
    }

    // 初始化設定
    async loadInit() {
        if (window["hostInitialize"]) {
            this.initVar();
            this.handleLoadingType();
            window["hostInitialize"]();
            this.apiData.getHostSocket();
            this.loader.active = true;
            Data.Library.SPIN_LATE = window["psapi"].hostInfo.reel_spin == 0 ? true : false; // true : 後轉  false : 先轉
            let BandBg = `../HostImages/${LoadingImageEnum.BUSINESS_BANNER}/SLOT/${Data.Library.RES_LANGUAGE}/loading_bg_ps.png`;
            if (this.apiData.getHostImages()[LoadingImageEnum.BUSINESS_BANNER]) {
                Logger.debug("載入商業橫幅圖像", this.apiData.getHostImages()[LoadingImageEnum.BUSINESS_BANNER]);
                BandBg = this.apiData.getHostImages()[LoadingImageEnum.BUSINESS_BANNER].h[0];
            }
            if (this.loadingType === this.loadingObjecyType.roundBar) {
                BandBg = BandBg.replace(".png", "1.png")
            }

            let proms: Promise<void>[] = [];

            this.addPromiseProcess(proms, this.loadRemotePic.bind(this), BandBg, (spriteFrame: SpriteFrame) => {
                this.loader.getChildByName("AdBg").getComponent(Sprite).spriteFrame = spriteFrame;
                this.loader.getChildByName("AdBg").setPosition(0, -800);
                if (this.loadingType === this.loadingObjecyType.roundBar) {
                    this.loader.getChildByName("AdBg").setPosition(-360, 0);
                }
                Logger.loading("廣告背景圖載入完成");
            });

            let LoadingImagePath = "";
            let LoadingImageObject = "";
            let LoadingImageClass = this.apiData.getHostImages()[LoadingImageEnum.LOADING];
            const defaultLoadingImage = `../HostImages/0/${Data.Library.DEF_GAMEID}/${Data.Library.RES_LANGUAGE}/loading_bg_01.jpg`;
            if (LoadingImageClass !== undefined) {
                LoadingImageObject = LoadingImageClass["v"];
                LoadingImagePath = LoadingImageObject[(Math.floor(Math.random() * LoadingImageObject.length))];
                Logger.debug("載入圖像配置", { LoadingImageObject, LoadingImagePath });
                this.addPromiseProcess(proms, this.loadRemotePicWithCheck.bind(this), LoadingImagePath, (spriteFrame: SpriteFrame) => {
                    this.loader.getChildByName("LoadBg").getComponent(Sprite).spriteFrame = spriteFrame;
                    if (LoadingImagePath.indexOf("ad") === -1)
                        this.loader.getChildByName("LoadBg").setPosition(0, 800);
                    else
                        this.loader.getChildByName("LoadBg").setPosition(0, 640);
                    Logger.loading("載入背景圖載入完成");
                })
            } else {
                this.addPromiseProcess(proms, this.loadRemotePicWithCheck.bind(this), defaultLoadingImage, (spriteFrame: SpriteFrame) => {
                    this.loader.getChildByName("LoadBg").getComponent(Sprite).spriteFrame = spriteFrame;
                    this.loader.getChildByName("LoadBg").setPosition(0, 800);
                    Logger.loading("預設載入背景圖載入完成");
                })
            }

            if (this.loader.getChildByName("FinishBg")) {
                this.addPromiseProcess(proms, this.loadRemotePicWithCheck.bind(this), defaultLoadingImage, (spriteFrame: SpriteFrame) => {
                    this.loader.getChildByName("FinishBg").getComponent(Sprite).spriteFrame = spriteFrame;
                    Logger.loading("完成背景圖載入完成");
                })
            }

            let FisishBtnPath = '../HostImages/0/' + Data.Library.DEF_GAMEID + '/' + Data.Library.RES_LANGUAGE + '/btn_strar_game_n.png';
            this.addPromiseProcess(proms, this.loadRemotePic.bind(this), FisishBtnPath, (spriteFrame: SpriteFrame) => {
                this.loader.getChildByName("StartGame").getChildByName("Btn").getComponent(Sprite).spriteFrame = spriteFrame;
                Logger.loading("開始遊戲按鈕載入完成");
            })

            let ranBan = Math.floor(Math.random() * this.loadBannerNums);
            for (let b = 0; b < this.loadBannerNums; b++) {
                let banner_res = '../HostImages/0/' + Data.Library.DEF_GAMEID + '/' + Data.Library.RES_LANGUAGE + '/loading_banner_0' + b + '.png';
                this.addPromiseProcess(proms, this.loadRemotePic.bind(this), banner_res, (spriteFrame: SpriteFrame) => {
                    this.loadingBannerArr.push(spriteFrame);
                    if (b == ranBan)
                        this.loader.getChildByName("StartBefore").getChildByName("Banner").getComponent(Sprite).spriteFrame = spriteFrame;
                    Logger.loading(`載入橫幅 ${b} 完成`);
                })
            }

            //----------------------------- redpacket --------------------------------

            if (this.apiData.getPsImages?.().type?.[3] === 1) {  //判斷紅包RESOURCE是否開啟
                let PSMode: string | number = 0;
                let activityResLanguage = Data.Library.RES_LANGUAGE === "tai" ? "tai" : "eng";
                PSMode = this.apiData.getPsImages().mode;
                this.redPacketType = 3 + this.apiData.RedpacketType;
                Logger.debug(`紅包類型: ${this.apiData.RedpacketType}`);

                // Banner Spine
                let ActBannerDir = "../PSImages/" + this.redPacketType + "/" + PSMode + "/" + activityResLanguage + "/anm/banner/";
                let BannerSpineArr = [ActBannerDir + "banner.png", ActBannerDir + "banner.atlas", ActBannerDir + "banner_m.json", "banner.png"]
                this.addPromiseProcess(proms, this.loadSpine, BannerSpineArr, (asset: sp.SkeletonData) => {
                    this.apiData.ActBannerJson = asset;
                    Logger.loading("紅包橫幅動畫載入完成");
                });

                // Collect Spine
                let boardDir = "../PSImages/" + this.redPacketType + "/Creator/anm/common/";
                let redPacketSpineArr = [boardDir + "round_red_envelope.png", boardDir + "round_red_envelope.atlas", boardDir + "round_red_envelope.json", "round_red_envelope.png"];
                this.addPromiseProcess(proms, this.loadSpine, redPacketSpineArr, (asset: sp.SkeletonData) => {
                    this.apiData.RedpackData.ActivityCollectAnm = asset;
                    Logger.loading("紅包收集動畫載入完成");
                });

                // dialog Spr
                let diaglogSprite = "../PSImages/" + this.redPacketType + "/Creator/pic/dialog.png";
                this.addPromiseProcess(proms, this.loadRemotePic.bind(this), diaglogSprite, (spriteFrame: SpriteFrame) => {
                    this.apiData.RedpackData.Dialog = spriteFrame;
                    Logger.loading("對話框圖片載入完成");
                });

                // 活動遊戲 icon
                if (this.apiData.getPSEvents) {
                    let event = window["getPSEvents"]();
                    if (event.length > 0) {
                        let Gamelist = event[0].game_id?.split(',') || [];
                        let isUfa = PSMode === 1 ? "gameSmallUFA" : "gameSmallPic";
                        Gamelist.forEach((gameId: string) => {
                            let icon = `../PSImages/${this.redPacketType}/${isUfa}/${gameId.toLowerCase()}.png`;
                            this.addPromiseProcess(proms, this.loadRemotePic.bind(this), icon, (spriteFrame: SpriteFrame) => {
                                this.apiData.ActivityGame.push(spriteFrame);
                                Logger.loading(`遊戲圖示 ${gameId} 載入完成`);
                            });
                        });
                    }
                }

                // 規則圖
                let ActRule = `../PSImages/${this.redPacketType}/${PSMode}/pic/rule_1.png`
                this.addPromiseProcess(proms, this.loadRemotePic.bind(this), ActRule, (spriteFrame: SpriteFrame) => {
                    this.apiData.ActivityUI.rule = spriteFrame;
                    Logger.loading("活動規則圖載入完成");
                })

                // 關閉按鈕
                let ActClose = "../PSImages/" + this.redPacketType + "/common/ps_activity/round/btn_close.png";
                this.addPromiseProcess(proms, this.loadRemotePic.bind(this), ActClose, (spriteFrame: SpriteFrame) => {
                    this.apiData.ActivityUI.close = spriteFrame;
                    Logger.loading("關閉按鈕載入完成");
                })

                // 活動文字設定
                let ActJson = "../PSImages/" + this.redPacketType + "/" + PSMode + "/" + (["xeng", "bmm"].includes(Data.Library.RES_LANGUAGE) ? "eng" : Data.Library.RES_LANGUAGE) + "/activitytextconfigx.json"

                let prom = new Promise<void>((resolve, reject) => {
                    assetManager.loadRemote<JsonAsset>(ActJson, (err, JsonAsset) => {
                        if (err) {
                            return;
                        }
                        //Record<string, object> 只允許物件 {}（不能是 string、number、null、undefined）
                        const ActText = JsonAsset.json as IActivityTextConfig;
                        this.apiData.ActivityText = ActText.HelpTextConfig;
                        this.apiData.ActivityTextMax = ActText.maxSegmentLength;
                        Logger.loading("活動文字配置載入完成");
                        resolve();
                    });
                })
                proms.push(prom);

                let FakeData = "../PSImages/" + this.redPacketType + "/" + PSMode + "/RedPacketFakeData.js"
                let promFakeData = new Promise<void>((resolve, reject) => {
                    assetManager.loadRemote<JavaScript>(FakeData, (err, loadedScript) => {
                        if (window["RedPacketFakeData"]) {
                            Data.Library.FakeRandomData = window["RedPacketFakeData"];
                        }
                        resolve();
                        Logger.loading("假資料載入完成");
                    });
                })
                proms.push(promFakeData);

            }

            await Promise.all(proms);
            this.loadGame();
        } else {
            setTimeout(() => {
                this.loadInit();
            }, 100);
        }
    }

    async handleResRedpacketInside() {  //紅包中獎之後的動畫表現

        if (this.apiData.getPsImages && this.apiData.getPsImages().type[3] !== 1) {
            return;
        }
        // ------------------ redpacket inside ------------------
        Logger.debug("開始載入紅包內部資源");

        let promsRedpacket: Promise<void>[] = [];

        let rpsym = "../PSImages/" + this.redPacketType + "/Creator/pic/rpsym.png";
        this.addPromiseProcess(promsRedpacket, this.loadRemotePic.bind(this), rpsym, (spriteFrame: SpriteFrame) => {
            this.apiData.RedpackData.RpsymSprite = spriteFrame;
            Logger.loading("紅包符號圖片載入完成");
        })

        let symbol = "../PSImages/" + this.redPacketType + "/Creator/pic/symbol.png";
        this.addPromiseProcess(promsRedpacket, this.loadRemotePic.bind(this), symbol, (spriteFrame: SpriteFrame) => {
            this.apiData.RedpackData.SymbolBtnSprite = spriteFrame;
            Logger.loading("符號按鈕圖片載入完成");
        })

        let UseLanguage = ["tai", "eng", "tch"];
        let CreatorLanguage = UseLanguage.indexOf(Data.Library.RES_LANGUAGE) !== -1 ? Data.Library.RES_LANGUAGE : "eng";
        let boardDir = "../PSImages/" + this.redPacketType + "/Creator/anm/" + CreatorLanguage + "/";

        let boardSpineArr = [boardDir + "board_m.png", boardDir + "board_m.atlas", boardDir + "board_m.json", "board_m.png"];
        this.addPromiseProcess(promsRedpacket, this.loadSpine, boardSpineArr, (asset: sp.SkeletonData) => {
            this.apiData.RedpackData.BoardAnm = asset;
            Logger.loading("面板動畫載入完成");
        });

        let boardSpinePickArr = [boardDir + "pickone.png", boardDir + "pickone.atlas", boardDir + "pickone.json", "pickone.png"];
        this.addPromiseProcess(promsRedpacket, this.loadSpine, boardSpinePickArr, (asset: sp.SkeletonData) => {
            this.apiData.RedpackData.PickOneAnm = asset;
            Logger.loading("選擇動畫載入完成");
        });

        let boardSpineSymbolbgArr = [boardDir + "symbol_bg.png", boardDir + "symbol_bg.atlas", boardDir + "symbol_bg.json", "symbol_bg.png"];
        this.addPromiseProcess(promsRedpacket, this.loadSpine, boardSpineSymbolbgArr, (asset: sp.SkeletonData) => {
            this.apiData.RedpackData.SymbolBgAnm = asset;
            Logger.loading("符號背景動畫載入完成");
        });

        let boardSpineSymbolMArr = [boardDir + "symbol_m.png", boardDir + "symbol_m.atlas", boardDir + "symbol_m.json", "symbol_m.png"];
        this.addPromiseProcess(promsRedpacket, this.loadSpine, boardSpineSymbolMArr, (asset: sp.SkeletonData) => {
            this.apiData.RedpackData.SymbolAnm = asset;
            Logger.loading("符號動畫載入完成");
        });

        await Promise.all(promsRedpacket);
        this.loadingRedpacketInside()
    }

    loadingRedpacketInside() {
        Logger.debug("初始化紅包內部元件");
        if (find("Canvas/JackPot/JpRedPacket")) {
            Logger.debug("找到紅包元件，開始初始化");
            find("Canvas/JackPot/JpRedPacket").getComponent(RedJackpot).initItem();
        }
    }

    LoadingRedpacketInit() {
        if (this.apiData.getPsImages && this.apiData.getPsImages().type[3] !== 1) {
            return;
        }
        Logger.debug("初始化紅包活動");
        if (find("Canvas/JackPot")) {
            Logger.debug("找到活動元件，開始初始化");
            find("Canvas/JackPot").getComponent(ActiveItem1).initItem();
        }
    }

    private updateFakeSchedule: ((dt: number) => void) | null = null;
    async loadGame() {
        const scene = "main";
        //因為CustomizeMode預設為false,在LangBunder才會判定給值所以用是否為null判定
        if (Data.Library.CustomizeMode == null) {
            Data.Library.yieldAdd(1);
        }
        Logger.info("開始載入遊戲場景");

        // 假載入
        this.scheduleFakeLoading()

        await this.loadSceneAsync(scene);

        Logger.info("場景載入完成");
        // 1. 初始化紅包活動
        this.LoadingRedpacketInit();
        // 2. 移動載入器到主場景
        find("Canvas").addChild(this.loader);
        find("APIConsole/ApiCanvas").active = false;
        // 3. 移動假載入元件
        if (this.fakeLoad) {
            find("Canvas").addChild(this.fakeLoad);
        }
        // 4. 開始監控載入完成狀態
        let updateWait = () => {
            if (Data.Library.yieldCount == 0 && Data.Library.yieldLoad == true) {
                Logger.info("所有載入作業完成");
                LoadingScene.LoadingFinish = true;
                this.handleResRedpacketInside();
                this.fakeLoadingShow(false);
                this.unschedule(updateWait);
                this.scheduleOnce(() => {
                    if (!this.loader.active) {
                        this.loadingEndShow();
                    }
                }, 0.1);
            }
        };
        this.schedule(updateWait);
        // // 場景載入完成
        // let OnFinish = () => {

        // }
        // // 載入主場景
        // director.loadScene(scene, OnFinish);
    }

    private loadSceneAsync(scene: string): Promise<void> {
        return new Promise<void>((resolve) => {
            director.loadScene(scene, () => {
                Logger.info(`場景 ${scene} 載入完成`);
                resolve();
            });
        });
    }

    private scheduleFakeLoading() {
        this.updateFakeSchedule = (dt) => {
            this.updateFakeLoad(dt);
        };
        this.schedule(this.updateFakeSchedule);
    }

    private fakePercent: number = 0;
    private logged: number = 0;
    updateFakeLoad(dt: number) {
        let fakedelaytime = 6.0;
        this.fakePercent += dt * (100 / fakedelaytime);
        this.fakeProgress(this.fakePercent / 100);

        let ranBan = Math.floor(Math.random() * this.loadBannerNums);
        if (this.fakePercent > 75 && this.logged < 75) {
            this.logged = 75;
            this.loader.getChildByName("StartBefore").getChildByName("Banner").getComponent(Sprite).spriteFrame = this.loadingBannerArr[ranBan];
        } else if (this.fakePercent > 50 && this.logged < 50) {
            this.logged = 50;
            this.loader.getChildByName("StartBefore").getChildByName("Banner").getComponent(Sprite).spriteFrame = this.loadingBannerArr[ranBan];
        } else if (this.fakePercent > 25 && this.logged < 25) {
            this.logged = 25;
            this.loader.getChildByName("StartBefore").getChildByName("Banner").getComponent(Sprite).spriteFrame = this.loadingBannerArr[ranBan];
        }

        if (this.fakePercent >= 100) {
            this.unschedule(this.updateFakeSchedule);
        }
    }

    fakeProgress(percent: number) {
        this.loadNum.getComponent(Label).string = this.loadString + Math.floor(percent * 100) + "%";
        this.loadBar.getComponent(UITransform).width = 600 * percent;
        this.loadHead.setPosition(600 * percent - 312, -430);

        if (this.loadingType === this.loadingObjecyType.roundBar) {
            let precentPart = [0, 0.25, 0.5, 0.75, 1];
            let precentText = ["25", "50", "75", "100"];
            let spineTracks = [2, 3, 4, 5];
            for (let i = 0; i < precentText.length; i++) {
                if (percent >= precentPart[i] && percent < precentPart[i + 1]) {
                    if (this.loadingRound.getCurrent(spineTracks[i]) === null) {
                        this.loadingRound.addAnimation(spineTracks[i], precentText[i], false);
                        this.loadingRound.getCurrent(spineTracks[i]).alpha = 0;
                    }
                    if (this.loadingRound.getCurrent(spineTracks[i]))
                        this.loadingRound.getCurrent(spineTracks[i]).alpha = (percent - precentPart[i]) * 4;
                }
            }
        }

        if (percent >= 1) {
            this.loader.getChildByName("LoadBg").active = false;
            this.loader.getChildByName("FinishBg").active = true;
            this.loader.getChildByName("StartBefore").active = false;
            this.loader.getChildByName("StartGame").active = true;
        }
    }

    onProgress(now: number, total: number) {
        let pre = now / total;
        if (pre >= 0.99) pre = 0.99;
    }

    public CloseLoading() {
        this.fakeLoadingShow(true);
        this.loader.active = false;
        if (LoadingScene.LoadingFinish === true) {
            this.fakeLoadingShow(false);
            this.loader.active = false;
            this.loadingEndShow();
        }
        if (this.loader.getChildByName("StartGame").getChildByName("Btn").getComponent(AudioSource))
            this.loader.getChildByName("StartGame").getChildByName("Btn").getComponent(AudioSource).play();
    }

    public async loadingEndShow() {
        this.scheduleOnce(async () => {
            if (find("APIConsole")) {
                find("APIConsole/ApiCanvas/Camera").active = false;
            }
            if (Data.Library.StateConsole.ServerRecoverData) {
                Data.Library.StateConsole.RecoverGame();
                this.handleFullScreen();
            } else {
                let teacherUrl = "https://dev-api.iplaystar.net/game/Guides/PSS-ON-00158_Guide.mp4";
                if (typeof window["psapi"] !== "undefined") {
                    teacherUrl = window.location.href.split(Data.Library.DEF_GAMEID)[0] + "Guides/" + Data.Library.DEF_GAMEID + "_Guide.mp4";
                }
                try {
                    const response = await fetch(teacherUrl);
                    const value = response.status;
                    this.scheduleOnce(() => {
                        this.loader.active = false;
                        if (value == 200) {
                            if (find("Canvas/Teacher") != null && sys.localStorage.getItem(Data.Library.DEF_GAMEID + '_teach') != "true") {
                                if (!(Data.Library.DEF_GAMEID === "PSS-ON-00158" && Data.Library.RES_LANGUAGE === "tch")) {
                                    find("Canvas/Teacher").active = true;
                                    let videoPlayer = find("Canvas/Teacher/VideoPlayer").getComponent(VideoPlayer);
                                    videoPlayer.remoteURL = teacherUrl;
                                    videoPlayer.play();
                                    videoPlayer.loop = true;
                                }
                            }
                        }
                        this.handleFullScreen();
                    }, 0.1);
                } catch (err) {
                    Logger.error("取得教學影片失敗", err);
                    this.handleFullScreen();
                }
            }
        }, 0.1);
    }

    fakeLoadingShow(show: boolean) {
        if (this.fakeLoad) {
            this.fakeLoad.active = show;
        }
    }

    handleFullScreen() {
        if (window["psapi"] && !window["psapi"].allowFullscr) return;
        if (find("Canvas/Teacher") != null && find("Canvas/Teacher").active) return;
        if (sys.isMobile && sys.os !== sys.OS.IOS) {
            screen.requestFullScreen().catch((err) => {
                Logger.warn("進入全螢幕失敗", err)
            });
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
    }
}

let GetURLParameter = function (sParam: string): string {
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
    return 'eng';
}