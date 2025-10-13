
import { SpriteFrame, sp } from 'cc'; // Adjust the import path if needed

/*
20250814
*/
// Vec2Like type definition (add or import as needed)
type Vec2Like = { x: number; y: number; };

//活動文件格式
export interface IActivityRuleTextLine {
    lineText: string;
    fontName: string;
    fontSize: number;
    color: string;          // e.g. "#ffea00"
    position: Vec2Like;     // 2D UI 座標
    Anchor: Vec2Like;       // UITransform 錨點
    page: number;           // 第幾頁（若有分頁 UI，可用來篩選）
}

// 活動文件格式
export interface IActivityTextConfig {
    HelpTextConfig: IActivityRuleTextLine[];
    maxSegmentLength: number;
}


//紅包檔案
export interface IRedPacketConfig {
    RpsymSprite: SpriteFrame | null;
    SymbolBtnSprite: SpriteFrame | null;
    BoardAnm: sp.SkeletonData | null;
    PickOneAnm: sp.SkeletonData | null;
    SymbolBgAnm: sp.SkeletonData | null;
    SymbolAnm: sp.SkeletonData | null;
    ActivityCollectAnm: sp.SkeletonData | null;
    Dialog: SpriteFrame | null;
}

export interface IActivityUI {
    close: SpriteFrame | null;
    rule: SpriteFrame | null;
}
