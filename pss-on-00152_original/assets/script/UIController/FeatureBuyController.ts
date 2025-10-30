import { _decorator, Component, Node, SpriteFrame, Sprite, sp, Label, UIOpacity, AudioSource } from 'cc';
import { AllNode } from '../LibCreator/libScript/CommonLibScript';
import { Data, Mode } from '../DataController';
import { UCoin } from '../LibCreator/libScript/JackpotScript/UCoin/UCoin';
const { ccclass, property } = _decorator;

@ccclass('FeatureBuy')
export class FeatureBuy extends Component {
    @property({ type: SpriteFrame }) featureBuyTextArr: Array<SpriteFrame>;

    _priceArr: number[] = [];

    
    protected onLoad(): void {
        Data.Library.FeatureBuy = this;
    }

    start() { 
        if(Data.Library.RES_LANGUAGE=="tch"){
            AllNode.Data.Map.get("FeatureBuyDiscount").active=false;
        }
    }


    update() {
        AllNode.Data.Map.get("FeatureBuyAnm").getComponent(sp.Skeleton).color = AllNode.Data.Map.get("FeatureBuyButton").getComponent(Sprite).color;
    }

    HandleBroadcast(data: any) {
        switch(data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.ACTIONS].eUPDATE_CREDITWINNUMS:
            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                if (Data.Library.LuckyStrikeMaxBetting < Data.Library.StateConsole.getRateXBet() * Data.Library.DEF_FEATUREBUY_MULTIPLE[0]) {
                    AllNode.Data.Map.get("FeatureBuyAnm").active = false;
                    AllNode.Data.Map.get("FeatureBuyButton").active = false;
                } else {
                    AllNode.Data.Map.get("FeatureBuyAnm").active = true;
                    AllNode.Data.Map.get("FeatureBuyButton").active = true;
                }
                break;

            default: break;
        }
    }
    
    updateFeatureBuyNum() {
        let FeatureBuyNumNode = ["FeatureBuyCost100", "FeatureBuyCost80", "FeatureBuyCost60"];  //兩頁式FeatureBuy
        let betRateNumber = Data.Library.StateConsole.BetArray[Data.Library.StateConsole.BetIndex] * Data.Library.StateConsole.RateArray[Data.Library.StateConsole.RateIndex] / 100;
        for (let i = 0; i < Data.Library.DEF_FEATUREBUY_MULTIPLE.length; i++) {
            this._priceArr[i] = betRateNumber * Data.Library.DEF_FEATUREBUY_MULTIPLE[i];
            AllNode.Data.Map.get('FeatureBuyCostNum').getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(this._priceArr[i]);  //更改AllNode.Data.Map.get(FeatureBuyNumNode[i])
        }

        Data.Library.StateConsole.featureBuyType = 0;  //新增這個 因為此遊戲沒有分FeatureBuy機率 所以默認為取第0個值
    }

    openFeatureBuy() {
        if (Data.Library.StateConsole.isMenuOn == true) return;
        if (Data.Library.StateConsole.isAutoPlay == true) return;
        if (Data.Library.StateConsole.CurState != Mode.FSM.K_IDLE) return;
        AllNode.Data.Map.get("Open").getComponent(AudioSource).play();
        AllNode.Data.Map.get("FeatureBuyPage").getComponent(UIOpacity).opacity = 255;
        AllNode.Data.Map.get("FeatureBuyPage1").active = false;  //直接修改開啟第二頁FeatureBuy(因為此遊戲只有一頁)
        AllNode.Data.Map.get("FeatureBuyPage2").active = true;
        AllNode.Data.Map.get("FeatureBuyBlock").active = true;
        this.updateFeatureBuyNum();
        Data.Library.StateConsole.isMenuOn = true;
    }

    closeFeatureBuy() {
        AllNode.Data.Map.get("FeatureBuy/Trans").getComponent(AudioSource).play();
        AllNode.Data.Map.get("FeatureBuyPage").getComponent(UIOpacity).opacity = 0;
        AllNode.Data.Map.get("FeatureBuyBlock").active = false;
        AllNode.Data.Map.get("FeatureBuyPage1").active = false;
        AllNode.Data.Map.get("FeatureBuyPage2").active = false;
        Data.Library.StateConsole.isMenuOn = false;
    }

    FeatureBuyConfirmInfor(event: Event, tag: number) {
        if (Data.Library.StateConsole.CurState !== Mode.FSM.K_IDLE || Data.Library.StateConsole.isAutoPlay === true)
            return;
        AllNode.Data.Map.get("Buy").getComponent(AudioSource).play();
        let costSkin = ["cost60", "cost50", "cost30"]
        AllNode.Data.Map.get("FeatureBuyPage1").active = false;
        AllNode.Data.Map.get("FeatureBuyPage2").active = true;
        Data.Library.StateConsole.featureBuyType = tag;
        AllNode.Data.Map.get("FeatureBuyText").getComponent(Sprite).spriteFrame = this.featureBuyTextArr[tag];
        Mode.ShowSpine(AllNode.Data.Map.get("BuyBtnAnm2").getComponent(sp.Skeleton), 0, "idle2", true, costSkin[tag]);
        AllNode.Data.Map.get("FeatureBuyCostNum").getComponent(Label).string = Data.Library.StateConsole.SpriteNumberInNumber(this._priceArr[tag]);
    }

    BackFeatureBuyInfor() {
        AllNode.Data.Map.get("BtnClick2").getComponent(AudioSource).play();
        Data.Library.StateConsole.featureBuyType = -1;
        AllNode.Data.Map.get("FeatureBuyPage1").active = true;
        AllNode.Data.Map.get("FeatureBuyPage2").active = false;
        Mode.ShowSpine(AllNode.Data.Map.get("BuyBtnAnm2").getComponent(sp.Skeleton), 0, "idle1", true, "cost30");
    }

    FeatureBuyConfirm() {
        if (Data.Library.StateConsole.CurState !== Mode.FSM.K_IDLE || Data.Library.StateConsole.isAutoPlay === true) { return; }

        this.closeFeatureBuy();

        AllNode.Data.Map.get("Buy").getComponent(AudioSource).play();
        Data.Library.StateConsole.Spin(true);
    }

}

