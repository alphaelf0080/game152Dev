import { Size, sp, Sprite, SpriteFrame, Vec3 } from "cc";

export enum SymbolState {
    Default,
    Idle,
    Rolling,
    RollingEnd,
    Drop,
    Change,
    Dark,
    FsToBs,
}

export interface ISymbol {
    // symbol上顯示圖的節點
    spt: Sprite;
    // symbol上播動畫的節點
    anm: sp.Skeleton;
    // 所有symbol圖
    symPic: SpriteFrame[];
    // 所有模糊symbol圖
    symBlurPic: SpriteFrame[];
    // 所有symbol spine動畫
    spineAtlas: sp.SkeletonData[];

    // 節點的siblingIndex
    ordIdx: number;
    // 在第幾個滾輪上
    reelIndex: number;
    // 滾輪的位置
    reelPos: Vec3;
    // 0 & 10 :空symbol 1:Scatter 2~9:對應symbol
    symIndex: number;
    // symbol的分數值
    symPay: number;
    // symbol的原位置
    symPos: Vec3;
    // symbol現在的位置
    curPos: Vec3;
    // symbol的winPos位置
    winPos:number;

    /**當前symbol大小，如symbol有變動大小，需自行先call Node裡的setContentSize設定*/
    getContentSize(): Size;

    /**將Symbol的父節點設定回reelMask，與顯示symbol圖 */
    resetSymbol(): void;

    // setSymbol(sym: number, pay: number, isBlurEnable: boolean, isStop: boolean): void;
    setSymbol(state: SymbolState, isBlurEnable: boolean, symIndex?: number, pay?: number): void;

    playAnm(anm: any, args?: any): void;

    /**for symbol table*/
    clickSymbol(): void;
}

