import { _decorator, Component, math, sp, Sprite, SpriteFrame, UITransform, v3, Vec3 } from 'cc';
import { ISymbol, SymbolState } from '../Interface/ISymbol';
import { Container } from './Container';
const { ccclass, property } = _decorator;

@ccclass('BaseSymbol')
export class BaseSymbol extends Component implements ISymbol {
    @property(Sprite) spt: Sprite = null;
    @property(sp.Skeleton) anm: sp.Skeleton = null;
    @property({ type: SpriteFrame }) symPic = [];
    @property({ type: SpriteFrame }) symBlurPic = [];
    @property({ type: sp.SkeletonData }) spineAtlas = [];

    // 節點的siblingIndex
    ordIdx: number = -1;
    reelIndex: number = -1;
    reelPos: Vec3 = v3(0, 0);
    // 0 & 10 :空symbol 1:Scatter 2~9:對應symbol
    symIndex: number = -1;
    symPay: number = 0;
    symPos: Vec3 = v3(0, 0);
    curPos: Vec3 = v3(0, 0);
    // -1代表是沒顯示的symbol
    winPos: number = -1;

    protected get _GVar(): any {
        return Container.getInstance().get("GVar");
    }

    getContentSize(): math.Size {
        return this.node.getComponent(UITransform).contentSize;
    }

    //繼承後撰寫，不用abstract原因是讀component時會讀不到
    resetSymbol() {

    };

    setOrder() {
        this.node.setSiblingIndex(this.ordIdx);
    }

    //繼承後撰寫，不用abstract原因是讀component時會讀不到
    setSymbol(state: SymbolState, isBlurEnable: boolean, symIndex?: number, pay?: number) {

    };

    //繼承後撰寫，不用abstract原因是讀component時會讀不到
    playAnm(anm: any, args?: any) {

    };

    //繼承後撰寫，不用abstract原因是讀component時會讀不到
    clickSymbol(): void {
       
    }
}

