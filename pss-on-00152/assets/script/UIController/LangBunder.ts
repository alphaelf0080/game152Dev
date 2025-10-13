import { _decorator, Component, find, Node, Sprite, SpriteFrame, assetManager, log, Button, LabelAtlas, Label, sp, JavaScript, View, sys, macro, VideoPlayer, UITransform, instantiate } from 'cc';
import { SpreadController } from './SpreadController';
import { LoadingScene } from '../LibCreator/libLoadingInit/LoadingScene';
import { Data } from '../DataController';
import { UIController } from '../LibCreator/libUIController/UIController';
import { Symbol } from '../ReelController/Symbol';


const { ccclass, property } = _decorator;
let MessageConsole: Node = null;
let SymbolTs: Symbol = null;

@ccclass('LangBunder')
export class LangBunder extends Component {
    LanguageArray = ["eng", "esp", "ind", "jp", "kor", "mys", "por", "ru", "sch", "tai", "tch", "vie", "tur","xeng"];

    
    start() {
        // local build using
        // if (sys.isMobile == true) {
        //     View.instance.setOrientation(macro.ORIENTATION_PORTRAIT);
        // }
        MessageConsole = find("MessageController");
        SymbolTs = find("Canvas/BaseGame/Layer/Shake/Reel/reelMask/symbol").getComponent(Symbol);
        Data.Library.RES_LANGUAGE = Data.Library.CommonLibScript.GetURLParameter('lang');
        if (this.LanguageArray.indexOf(Data.Library.RES_LANGUAGE) >= 0) {
            this.LoadLangRes();
        }
    }

    LoadLangRes() {  //修改圖片語系
        assetManager.loadBundle('language', (err, bundle) => {
            Data.Library.yieldAdd(1);  //BigWin Anm
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/anm/bigwin', sp.SkeletonData, function (err, SkeletonData) {
                SkeletonData.forEach(function (e) {
                    LngRes["AnmBigWin_" + e.name] = e;
                });
                setLngSprite("Spine", "AnmBigWin", find("Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinSlogan").getComponent(sp.Skeleton));
                setLngSprite("Spine", "AnmBigWin", find("Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinSlogan2").getComponent(sp.Skeleton));
                setLngSprite("Spine", "AnmBigWin", find("Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinTitle").getComponent(sp.Skeleton));
                setLngSprite("Spine", "AnmBigWin", find("Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinTitle2").getComponent(sp.Skeleton));
                Data.Library.yieldLess(1);
                log("enter language AnmBigWin");
            });

            // Data.Library.yieldAdd(1);  //轉場 Anm
            // bundle.loadDir(Data.Library.RES_LANGUAGE + '/anm/trans', sp.SkeletonData, function (err, SkeletonData) {
            //     SkeletonData.forEach(function (e) {
            //         LngRes["AnmTrans_" + e.name] = e;
            //     });
            //     setLngSprite("Spine", "AnmTrans", find("Canvas/BaseGame/Trans/TransTextAnm").getComponent(sp.Skeleton));
            //     Data.Library.yieldLess(1);
            //     log("enter language transAnm");
            // });

            Data.Library.yieldAdd(1);  //FeatureBuy Anm
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/anm/featureBuy', sp.SkeletonData, function (err, SkeletonData) {
                SkeletonData.forEach(function (e) {
                    LngRes["AnmFBuy_" + e.name] = e;
                });
                setLngSprite("Spine", "AnmFBuy", find("Canvas/BaseGame/Layer/Shake/UI/BsUI/FeatureBuyButton/FeatureBuyAnm").getComponent(sp.Skeleton));
                find("Canvas/BaseGame/Layer/Shake/UI/BsUI/FeatureBuyButton/FeatureBuyAnm").getComponent(sp.Skeleton).setAnimation(0, "idle", true);
                Data.Library.yieldLess(1);
                log("enter language FeatureBuy");
            });

            Data.Library.yieldAdd(1);  //5連線 Anm
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/anm/5kind', sp.SkeletonData, function (err, SkeletonData) {
                SkeletonData.forEach(function (e) {
                    LngRes["5kind_" + e.name] = e;
                });
                setLngSprite("Spine", "5kind", find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/FiveLineAnm").getComponent(sp.Skeleton));
                Data.Library.yieldLess(1);
                log("enter language 5kind");
            });

            Data.Library.yieldAdd(1);  //跑馬燈 圖片
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/pic/banner', SpriteFrame, function (err, spriteFrame) {
                spriteFrame.forEach(function (e) {
                    LngRes["Banner_" + e.name] = e;
                });
                for (let i = 0; i < Data.Library.BannerData.pageFrame.length; i++) {  //序列化(在cocos dashboard放入圖片)
                    Data.Library.BannerData.pageFrame[i] = LngRes["Banner_banner_0" + (i + 1)]
                }
                find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBgCover/BannerText").getComponent(Sprite).spriteFrame = LngRes["Banner_banner_01"];
                Data.Library.BannerData.resetBanner();
                find("Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBgCover/BannerText").active = true;
                Data.Library.yieldLess(1);
                log("enter language banner")
            });

            Data.Library.yieldAdd(1);  //FeatureBuy 圖片
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/pic/feature_buy3.0', SpriteFrame, function (err, spriteFrame) {
                spriteFrame.forEach(function (e) {
                    LngRes["FeatureBuy_" + e.name] = e;
                });
                setLngSprite("Btn", "FeatureBuy", find("Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyStartBtn").getComponent(Button));
                setLngSprite("Btn", "FeatureBuy", find("Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyBackBtn2").getComponent(Button));
                setLngSprite("Sprite", "FeatureBuy", find("Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyText").getComponent(Sprite));
                setLngSprite("Sprite", "FeatureBuy", find("Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyTitle").getComponent(Sprite));
                setLngSprite("Sprite", "FeatureBuy", find("Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyLabel").getComponent(Sprite));
                setLngSprite("Sprite", "FeatureBuy", find("Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyDiscount").getComponent(Sprite));

                Data.Library.yieldLess(1);
                log("enter language feature_buy3")
            });

            // Data.Library.yieldAdd(1);  //教學影片框 圖片(這款遊戲沒用到)
            // bundle.loadDir(Data.Library.RES_LANGUAGE + '/pic/info', SpriteFrame, function (err, spriteFrame) {
            //     spriteFrame.forEach(function (e) {
            //         LngRes["Info_" + e.name] = e;
            //     });
            //     setLngSprite("Sprite", "Info", find("Canvas/Teacher/InfoBg").getComponent(Sprite));
            //     setLngSprite("Sprite", "Info", find("Canvas/Teacher/NeverUseOn").getComponent(Sprite));
            //     setLngSprite("Sprite", "Info", find("Canvas/Teacher/NeverUseOff").getComponent(Sprite));
            //     Data.Library.yieldLess(1);
            //     log("enter language Teacher")
            // });

            Data.Library.yieldAdd(1);  //freeGame 圖片
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/pic/fs', SpriteFrame, function (err, spriteFrame) {
                spriteFrame.forEach(function (e) {
                    LngRes["Fs_" + e.name] = e;
                });

                setLngSprite("Sprite", "Fs", find("Canvas/BaseGame/Layer/Shake/UI/FSUI/FreeSpinNum_1").getComponent(Sprite));
                setLngSprite("Sprite", "Fs", find("Canvas/BaseGame/Layer/Shake/UI/FSUI/FreeSpinNum_2").getComponent(Sprite));
                setLngSprite("Sprite", "Fs", find("Canvas/BaseGame/Trans/TransNum").getComponent(Sprite));
                setLngSprite("Sprite", "Fs", find("Canvas/BaseGame/Trans/TransEnd").getComponent(Sprite));
                setLngSprite("Btn", "Fs", find("Canvas/BaseGame/Trans/TransBtN").getComponent(Button));
                setLngSprite("Sprite", "Fs", find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/BannerReText").getComponent(Sprite));
                setLngSprite("Sprite", "Fs", find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/BannerMaxText").getComponent(Sprite));
                // if (find("APIConsole/ApiCanvas/Loader")) {
                // setLngSprite("Btn", "Fs", find("APIConsole/ApiCanvas/Loader/StartGame/Btn").getComponent(Button));
                // }
                Data.Library.yieldLess(1);
                log("enter language fs")
            });

            Data.Library.yieldAdd(1);  //跑馬燈 字體
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/num', LabelAtlas, function (err, labelAtlas) {
                labelAtlas.forEach(function (e) {
                    LngRes["Num_" + e.name] = e;
                });
                setLngSprite("Num", "Num", find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinText").getComponent(Label));
                Data.Library.yieldLess(1);
                log("enter language num")
            });

            Data.Library.yieldAdd(1);  //UI3.0 圖片
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/ui3.0/common', SpriteFrame, function (err, spriteFrame) {
                spriteFrame.forEach(function (e) {
                    LngRes["Msg_" + e.name] = e;
                });
                setLngSprite("Sprite", "Msg", find("Canvas/BaseGame/Page/HelpPage/HelpBg/Notice").getComponent(Sprite));
                setLngSprite("Sprite", "Msg", find("Canvas/Notice/InfoBg/text").getComponent(Sprite));
                setLngSprite("Sprite", "Msg", find("Canvas/Notice/InfoNoBalance/text").getComponent(Sprite));
                Data.Library.yieldLess(1);
                log("enter language common")
            });

            Data.Library.yieldAdd(1);  //UI3.0 圖片
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/ui3.0', SpriteFrame, function (err, spriteFrame) {
                spriteFrame.forEach(function (e) {
                    LngRes["UI3_" + e.name] = e;
                });
                setLngSprite("Sprite", "UI3", find("Canvas/BaseGame/Page/HelpPage/HelpBg/Title").getComponent(Sprite));
                setLngSprite("Sprite", "UI3", find("Canvas/BaseGame/Page/BetSCroll/ScrollBg/text1").getComponent(Sprite));
                setLngSprite("Sprite", "UI3", find("Canvas/BaseGame/Page/BetSCroll/ScrollBg/text2").getComponent(Sprite));
                setLngSprite("Sprite", "UI3", find("Canvas/BaseGame/Page/BetSCroll/MaxBetAnm/MaxBetTxt").getComponent(Sprite));
                setLngSprite("Sprite", "UI3", find("Canvas/Notice/turboOn").getComponent(Sprite));
                setLngSprite("Sprite", "UI3", find("Canvas/Notice/turboOff").getComponent(Sprite));    
                setLngSprite("Sprite", "UI3", find("Canvas/BaseGame/Layer/Shake/UI/GameWay").getComponent(Sprite));            
                Data.Library.yieldLess(1);
                log("enter language ui3.0")
            });

            Data.Library.yieldAdd(1);  //UI COIN 圖片
            bundle.loadDir(Data.Library.RES_LANGUAGE + '/UCoin/pic', SpriteFrame, function (err, spriteFrame) {
                spriteFrame.forEach(function (e) {
                    LngRes["UCoin_" + e.name] = e;
                });
                setLngSprite("Sprite", "UCoin", find("Canvas/Ucoin/UcoinRule/Reward").getComponent(Sprite));
                setLngSprite("Sprite", "UCoin", find("Canvas/Ucoin/UcoinRule/Rule/Rule1").getComponent(Sprite));
                setLngSprite("Sprite", "UCoin", find("Canvas/Ucoin/UcoinRule/Rule/Rule2").getComponent(Sprite));
                setLngSprite("Sprite", "UCoin", find("Canvas/Ucoin/UcoinRule/Rule/Rule3").getComponent(Sprite));
                setLngSprite("Sprite", "UCoin", find("Canvas/Ucoin/UcoinRule/Rule/Rule4").getComponent(Sprite));
                setLngSprite("Sprite", "UCoin", find("Canvas/Ucoin/UcoinTextEnd/Notice").getComponent(Sprite));
                Data.Library.yieldLess(1);
                log("enter language UCoin/pic")
            });

            Data.Library.yieldLoad = true;
            log("enter language yieldLoad")

            if (!find("Canvas/Loader")) {
                let updateWait = function () {
                    if (Data.Library.yieldCount == -1) {
                        log("enter language yieldLoad === -1")
                        this.unschedule(updateWait);
                        this.scheduleOnce(function () {
                            if (Data.Library.StateConsole.ServerRecoverData) {
                                Data.Library.StateConsole.RecoverGame();
                            }
                        }, 0.1);
                    }
                };
                this.schedule(updateWait);
            }
        });
    }
}

let LngRes = [];
let setLngSprite = function (type, dir, target) {
    if (type == "Btn") {
        target.normalSprite = LngRes[dir + "_" + target.normalSprite.name];
        target.pressedSprite = LngRes[dir + "_" + target.pressedSprite.name];
        target.hoverSprite = LngRes[dir + "_" + target.hoverSprite.name];
        target.disabledSprite = LngRes[dir + "_" + target.disabledSprite.name];
    }
    else if (type == "Num") {
        target.font = LngRes[dir + "_" + target.font.name];
    }
    else if (type == "Spine") {
        target.skeletonData = LngRes[dir + "_" + target.skeletonData.name];
    }
    else if (type == "Sprite") {
        target.spriteFrame = LngRes[dir + "_" + target.spriteFrame.name];
    }
    else {
        target = LngRes[dir + "_" + target.name];
    }
}
