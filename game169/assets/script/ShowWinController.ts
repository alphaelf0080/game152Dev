import { _decorator, Component, Node, find, input, Input, EventTouch, Sprite, UITransform, sp, TweenAction, SpriteFrame, Vec3, log, tween, easing, instantiate, debug, AudioSource, Color, Animation } from 'cc';

import { Data, Mode } from './DataController';
import { AllNode } from './LibCreator/libScript/CommonLibScript';

import { Symbol } from './ReelController/Symbol';
import { AnimationController } from './AnimationController';
import { MultipleController } from './UIController/MultipleController';

const { ccclass, property } = _decorator;
let DropSymbolMap = null;


export class ShowWinController {
    static Instance: ShowWinController = new ShowWinController();
    reelController = null;

    isNextRound: boolean = false;
    isShowOneRound: boolean = false;


    init(reelConThis) {  //保存ReelController的this
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;
        this.reelController = reelConThis;
    }

    /*贏分動畫表現*/
    WinLineControl() {  //控制秀出贏分
        if(DropSymbolMap.WinLineGroup.length == 0) { return; }

        if(Data.Library.StateConsole.isTurboEnable && !this.isShowOneRound) {
            let delay = this.DetectChanging(-1);

            this.reelController.scheduleOnce(() => {
                this.ShowAllLine();
            }, delay)
            return;
        }

        let curIndex = DropSymbolMap.CurrIndex++;
        if(curIndex < DropSymbolMap.WinLineGroup.length) {
            let delay = 0;
            if(!this.isShowOneRound && !this.isNextRound) { delay = this.DetectChanging(curIndex); }

            
                this.reelController.scheduleOnce(() => {
                    this.ShowWinLine(curIndex); 
                }, delay)
                       
        } else {
            this.ShowOneRound();
            //當有2種連線時只有BS顯示切換
            if( Data.Library.StateConsole.CurScene === Mode.SCENE_ID.BASE){
            this.reelController.scheduleOnce(() => {
                DropSymbolMap.CurrIndex = 0;
                this.WinLineControl();
            }, 1.2)
            }
        }
    }

    DetectChanging(index: number): number {  //偵測是否變盤、五連線
        let winGroup = DropSymbolMap.WinLineGroup;
        let delay: number = 0;
        let fiveLineBool = false;  //五連線偵測

        if(index == -1) {  //ShowAllLine
            for(let i = 0; i < winGroup.length; i++) {
                if(winGroup[i].isFiveLine) {
                    fiveLineBool = true;
                }
            }
        } else {  //ShowOneLine
            const { change, symbolId, pos, isFiveLine } = winGroup[index];
            if(change) {
                let showOriginalSymbolTime=0.3;
                delay += (1+showOriginalSymbolTime);
                this.reelController.scheduleOnce(()=>{
                this.reelController.StopAllSymbolAnimation();
                this.reelController.ResetAllSymbolDepth();
                this.reelController.ShowDark(false);//要先去除壓黑
                AnimationController.Instance.ShowOneRoundScore(false, 0);
                //顯示倍率
                    if(Data.Library.StateConsole.CurScene == Mode.SCENE_ID.FEATURE0
                        &&symbolId<7
                        &&symbolId>1
                        &&((DropSymbolMap.HaveChange&&change)||!DropSymbolMap.HaveChange)) {            
                            AnimationController.Instance.Prep_ShowWinLine(true);
                            MultipleController.Instance.SetMultipleNum(DropSymbolMap.Multiplier[0]);
                            MultipleController.Instance.ShowMultiple(true);                              
                    }
                //this.reelController.scheduleOnce(()=>{
                    for(let i = 0; i < pos.length; i++) {
                        let symbol = this.reelController.GetSymbol(pos[i]);
                        if(symbol.getComponent(Symbol).SymIndex == 0) { continue; }
                        symbol.getComponent(Symbol).PlayChangeAnimation();//展示變盤
                        symbol.getComponent(Symbol).SetSymbol(symbolId);
                    }
                },showOriginalSymbolTime)
                
            }
            if(isFiveLine) { fiveLineBool = true; }
        }

        if(fiveLineBool) {
            delay += 1.3;
            this.reelController.scheduleOnce(() => {
                this.reelController.ShowDark(true);
                Data.Library.BannerData.PlayFiveLineAnm();
                AllNode.Data.Map.get("FiveLineSound").getComponent(AudioSource).play();
            }, 1.3)
        }

        return delay;
    }

    ShowWinLine(index: number) {  //一條一條秀出贏分
        if(this.isNextRound) {
            this.reelController.unschedule(this.ShowWinLine);
            return;
        }

        this.reelController.StopAllSymbolAnimation();
        this.reelController.ResetAllSymbolDepth();
        this.reelController.ShowDark(true);

        const {change, pos, credit, symbolId } = DropSymbolMap.WinLineGroup[index];

        for(let i = 0; i < pos.length; i++) {
            let symbol = this.reelController.GetSymbol(pos[i]);
            symbol.getComponent(Symbol).PlaySymbolAnimation();
        }

        if(!Data.Library.StateConsole.isBonusTrigger()){
            AnimationController.Instance.ShowOneRoundScore(true, credit);
        }
        else if(find("AudioController/Tigger").getComponent(AudioSource).playing ==false){
            find("AudioController/Tigger").getComponent(AudioSource).play();
        }
            

        if(!this.isShowOneRound && index == DropSymbolMap.WinLineGroup.length - 1) {  //在最後一次Banner洗分 
            AnimationController.Instance.ShowBannerAnm();
        }

        if(!this.isShowOneRound && Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE && index == 0) {
            AnimationController.Instance.BkgAnmSwitch(true);
        } else if(!this.isShowOneRound && Data.Library.StateConsole.CurScene != Mode.SCENE_ID.BASE) {//不用放在ShowAllLine 因為freeGame不能選擇是否要turbo
            //有贏分開始顯示贏分banner                  
            AnimationController.Instance.SetBannerNumber(credit, 'w');            
            AnimationController.Instance.winBarNode.active = true;
            AnimationController.Instance.BannerText.active = false;
            find("Canvas/BaseGame/Layer/Shake/Animation/BannerWin").getComponent(Sprite).color = new Color(255, 255, 255, 255);
        }

        this.reelController.scheduleOnce(() => {
            if(!this.isNextRound) {
                this.WinLineControl();
            }
        }, 1.2)
    }

    ShowAllLine(): void {  //一次秀出所有贏分
        this.reelController.StopAllSymbolAnimation();
        this.reelController.ResetAllSymbolDepth();
        this.reelController.ShowDark(true);

        let winGroup = DropSymbolMap.WinLineGroup;
        let AllLineWin = 0;
        for(let i = 0; i < winGroup.length; i++) {
            const { credit, pos } = winGroup[i];
            AllLineWin += credit;
            for(let j = 0; j < pos.length; j++) {
                let symbol = this.reelController.GetSymbol(pos[j]);
                symbol.getComponent(Symbol).PlaySymbolAnimation();
            }
        }

        AnimationController.Instance.BkgAnmSwitch(true);
        AnimationController.Instance.ShowOneRoundScore(true, AllLineWin);
        AnimationController.Instance.ShowBannerAnm();
		
		//增加turbo Trigger判定
        if (Data.Library.StateConsole.isBonusTrigger() && find("AudioController/Tigger").getComponent(AudioSource).playing == false) {
            find("AudioController/Tigger").getComponent(AudioSource).play();
        }

        this.reelController.scheduleOnce(() => {
            this.ShowOneRound();
        }, 1.2)
    }

    ShowOneRound() {
        if(this.isShowOneRound) { return; }

        this.isShowOneRound = true;
        // Data.Library.StateConsole.nextState();
    }
/*贏分動畫表現 END*/
}