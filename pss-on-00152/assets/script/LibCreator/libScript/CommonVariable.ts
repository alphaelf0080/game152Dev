import { _decorator, Component, Label, ModelComponent, Node, find } from 'cc';
import { Data } from 'db://assets/script/DataController';
const { ccclass, property } = _decorator;

export namespace CommonVariableData {

    //遊戲行為類型
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

    //購買功能類型
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

    // 玩家行為
    export function playerAction(): playAction {
        const { featureBuyType, isAutoPlay, isTurboOn } = Data.Library.StateConsole;

        switch (featureBuyType) {
            case FeatureBuyType.LuckyStrick100: return playAction.LuckyStrick100;
            case FeatureBuyType.LuckyStrick80: return playAction.LuckyStrick80;
            case FeatureBuyType.LuckyStrick60: return playAction.LuckyStrick60;
            case FeatureBuyType.Treasure1: return playAction.Treasure1;
            case FeatureBuyType.Treasure2: return playAction.Treasure2;
            case FeatureBuyType.Treasure3: return playAction.Treasure3;
            case FeatureBuyType.Treasure4: return playAction.Treasure4;
            case FeatureBuyType.Treasure5: return playAction.Treasure5;
            case FeatureBuyType.Treasure6: return playAction.Treasure6;
        }

        if (isAutoPlay && isTurboOn) return playAction.NormalAutoSpeed;
        if (isAutoPlay && !isTurboOn) return playAction.NormalAutoNSpeed;
        if (!isAutoPlay && isTurboOn) return playAction.NormalNAutoSpeed;
        return playAction.NormalNAutoNSpeed;
    }

    /** ScrollView 事件類型 */
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

export interface IEventData<T> {
    EnventID: string;
    EnventData?: T;
}