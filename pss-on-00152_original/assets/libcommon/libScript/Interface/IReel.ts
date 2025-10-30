import { Prefab, Size, TweenEasing, Vec3 } from "cc";

/**滾輪滾動方向 */
export enum ReelDirection {
    TopToBottom,
    BottomToTop,
    LeftToRight,
    RightToLeft,
}

/** 滾輪介面定義*/
export interface IReel {
    // 滾輪的必要資料
    reelConfig: IReelConfig,
    // symbol的必要資料
    symbolConfig: IReelSymbolConfig,

    /**重置滾輪參數 */
    reset(): void;

    /**
     * 初始化滾輪參數
     * @param reelConfig 滾輪的必要資料
     * @param reelSymbolConfig symbol的必要資料
     */
    initParameters(reelConfig: IReelConfig, reelSymbolConfig: IReelSymbolConfig): void;

    /**
     * 初始化滾輪參數與symbol顯示
     * @param reelIndex 第幾個滾輪
     * @param isPosReverse 生成symbol時，位置是否點顛倒，原由上到下、由左到右
     * @param triggerExpectScCount 觸發期待的scatter數量 
     */
    initReel(reelIndex: number, isPosReverse?: boolean, triggerExpectScCount?: number): void;

    /**
     * 滾輪壓黑開關
     * @param visible 是否顯示 
     */
    setReelBlackVisible(visible: boolean): void;

    /**
     * 更改滾輪滾動參數倍率，預設是1
     * @param rate 參數倍率
     */
    changeReelPhysicSpeedByRate(rate: number): void;

    // /**
    //  * 開始滾動
    //  * @param easing 緩動函數，預設是smooth 
    //  */
    // startRolling(easing: TweenEasing): void;

    // /**
    //  * 停止滾輪
    //  * @param isNeedSlow 是否需變成慢滾動 
    //  * @param pass 是否急停
    //  */
    // spinStop(isNeedSlow: boolean, pass: boolean): void;
}

export interface IReelConfig {
    // 第幾個滾輪
    reelIndex: number,
    // 滾輪滾動方向
    reelDir: ReelDirection,
    // 滾輪初始位置
    reelPos: Vec3,
    // 滾動symbol間距
    reelSymGap: Size,
    // 此slot總行數
    col: number,
    // 此slot總列數
    row: number,
    // 此滾輪顯示的symbol數量
    showSymCount: number,
    // 此滾輪額外產生的symbol數
    extraBaseSymCount: number,
    // 如顯示的symbol數小於slot定義的數量(行數或列數)，顯示的symbol靠向哪裡
    symLTw: SymbolLeanTowards,
}

export interface IReelSymbolConfig {
    // symbol prefab
    pfSymbol: Prefab,
    // 基礎symbol的size
    baseSymSize: Size,
}

export enum SymbolLeanTowards {
    // 靠向正數值方向，指往上或往右
    Postive,
    // 靠向正數值方向，指往下或往左
    Negative,
}

export interface INormalSpeed {
    // 帶加速度到此值後，轉定速
    msToTopSpeed: number,
    // 剛開始轉時加速度
    msToTopAcc: number,
    // 定速
    curiseSpeed: number,
    // 定速變慢
    slowCuriseSpeed: number,
    // 最後停止前速度
    lastSybSpeed: number,
    // 起頭額外滾動的速度
    startSwingTime: number,
    // 最後回彈的速度
    endBounceTime: number,
    // 最後急停回彈的速度
    endPassBounceTime: number,
    // 期待時速度放慢的倍率(0<x<1)
    slowMotionRate: number,
}

export interface IDropSpeed {
    // DropIn掉落時間
    dropInTime: number,
    // DropOut掉落時間
    dropOutTime: number,
    // DropIn每個symbol掉落的延遲
    dropInSymbolDelay: number,
    // DropIn每個symbol掉落的延遲
    dropOutSymbolDelay: number,
    // 回彈時間
    dropBounceTime: number,
}

export interface ICommonSpeed {
    // 急停時加速倍率
    passMotionRate: number
}
