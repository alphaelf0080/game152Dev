import { _decorator} from 'cc';
import { Container } from '../Obj/Container';

export namespace CommonVariableData {
    export enum playAction {
        NormalNAutoNSpeed = 0,
        NormalNAutoSpeed = 1,
        NormalAutoNSpeed = 2,
        NormalAutoSpeed = 3,
        LuckyStrick100 = 4,
        LuckyStrick80 = 5,
        LuckyStrick60 = 6,
        Treasure1 = 7,
        Treasure2 = 8,
        Treasure3 = 9,
        Treasure4 = 10,
        Treasure5 = 11,
        Treasure6 = 12,
    }

    export enum FeatureBuyType {
        LuckyStrick100 = 0,
        LuckyStrick80 = 1,
        LuckyStrick60 = 2,
        Treasure1 = 3,
        Treasure2 = 4,
        Treasure3 = 5,
        Treasure4 = 6,
        Treasure5 = 7,
        Treasure6 = 8,
    }

    export function playerAction(): playAction {
        let actionIndex = playAction.NormalNAutoNSpeed;
        // instance
        let GVar:any = Container.getInstance().get("GVar");
  
        if (GVar.featureBuyType == FeatureBuyType.LuckyStrick100) {
            actionIndex = playAction.LuckyStrick100;
        } else if (GVar.featureBuyType == FeatureBuyType.LuckyStrick80) {
            actionIndex = playAction.LuckyStrick80;
        } else if (GVar.featureBuyType == FeatureBuyType.LuckyStrick60) {
            actionIndex = playAction.LuckyStrick60;
        } else if(GVar.featureBuyType == FeatureBuyType.Treasure1) {
            actionIndex = playAction.Treasure1
        } else if(GVar.featureBuyType == FeatureBuyType.Treasure2) {
            actionIndex = playAction.Treasure2
        } else if(GVar.featureBuyType == FeatureBuyType.Treasure3) {
            actionIndex = playAction.Treasure3
        } else if(GVar.featureBuyType == FeatureBuyType.Treasure4) {
            actionIndex = playAction.Treasure4
        } else if(GVar.featureBuyType == FeatureBuyType.Treasure5) {
            actionIndex = playAction.Treasure5
        } else if(GVar.featureBuyType == FeatureBuyType.Treasure6) {
            actionIndex = playAction.Treasure6
        } else if (GVar.isAutoPlay && GVar.isTurboOn) {
            actionIndex = playAction.NormalAutoSpeed;
        } else if (GVar.isAutoPlay && GVar.isTurboOn === false) {
            actionIndex = playAction.NormalAutoNSpeed;
        } else if (GVar.isAutoPlay === false && GVar.isTurboOn) {
            actionIndex = playAction.NormalNAutoSpeed;
        } else {
            actionIndex = playAction.NormalNAutoNSpeed;
        }
        return actionIndex;
    }

    export enum ScrollEventType {
        SCROLL_TO_TOP = 0,
        SCROLL_TO_BOTTOM = 1,
        SCROLL_TO_LEFT = 2,
        SCROLL_TO_RIGHT = 3,
        SCROLLING = 4,
        BOUNCE_TOP = 5,
        BOUNCE_BOTTOM = 6,
        BOUNCE_LEFT = 7,
        BOUNCE_RIGHT = 8,
        SCROLL_ENDED = 9,
        TOUCH_UP = 10,
        AUTOSCROLL_ENDED_WITH_THRESHOLD = 11,
        SCROLL_BEGAN = 12
    }
}