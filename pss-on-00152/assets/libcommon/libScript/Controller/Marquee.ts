import { _decorator, Component, Node, find, tween, Vec3, Label, sp, Font } from 'cc';
import { Mode, Model } from './DataController';
const { ccclass, property } = _decorator;

/**
 *  let Marquee = {
    PlayerId: ["xxxxxxx"],
    WinNum: [1000],
    WinType: [2],
    WinLevel: [1],
    ShowTime: [5],
    DelayTime: [2],
    CurrentIndex: 0,
}
 */
let Marquee = {
    PlayerId: [],
    WinNum: [],
    WinType: [],
    WinLevel: [],
    ShowTime: [],
    DelayTime: [],
    CurrentIndex: 0,
};

@ccclass('MarqueeData')
export class MarqueeData extends Component {
    marqueeBg: Node = null;
    marqueePlayerId: Node = null;
    marqueeWinNum: Node = null;
    marqueeAnm: Node = null;
    currentMarqueeData = null;
    nowBgTween=null;
    nowAnmTween=null;

    @property({ type: Font })
    public WinNumRes = [];

    start() {
        this.marqueeBg = find("Canvas/Marquee/MarqueeBg");
        this.marqueePlayerId = find("Canvas/Marquee/MarqueeBg/PlayerID");
        this.marqueeWinNum = find("Canvas/Marquee/MarqueeBg/WinNum");
        this.marqueeAnm = find("Canvas/Marquee/MarqueeAnm");
        this.node.active = false;
        //this.setMarqueeData(Marquee)
    }

    InitMarqueeData() {
        let Marquee = {
            PlayerId: [],
            WinNum: [],
            WinType: [],
            WinLevel: [],
            ShowTime: [],
            DelayTime: [],
            CurrentIndex: -1,
        };
    }

    setMarqueeData(data) {
        for (let i = 0; i < data.length; i++) {
            Marquee.PlayerId[i] = data[i].data1;
            Marquee.WinNum[i] = data[i].data2;
            Marquee.WinType[i] = data[i].type;
            Marquee.WinLevel[i] = data[i].level;
            Marquee.ShowTime[i] = data[i].show_time;
            Marquee.DelayTime[i] = data[i].delay_time;
        }
        this.node.active = true;
        this.handleMaqueeShow(Marquee);
    }

    handleMaqueeShow(MarqueeData) {
        let index = Marquee.CurrentIndex;
        if (MarqueeData.WinType.length === 0 || this.marqueePlayerId == null) {
            this.node.active =  false;
            return;
        }
        let type = MarqueeData.WinType[index];
        let level = MarqueeData.WinLevel[index];
        let ShowTime = MarqueeData.ShowTime[index];
        let DelayTime = MarqueeData.DelayTime[index];

        this.marqueePlayerId.getComponent(Label).string = MarqueeData.PlayerId[index];

        let number_res = this.WinNumRes[0];
        if ((type === 1 && level === 1) || (type === 3 && level === 1)) {
            number_res = this.WinNumRes[0];
        } else if ((type === 1 && level === 2) || (type === 3 && (level === 2 || level === 3))) {
            number_res = this.WinNumRes[1];
        } else if ((type === 2 && level === 1)) {
            number_res = this.WinNumRes[2];
        } else if ((type === 2 && level === 2)) {
            number_res = this.WinNumRes[3];
        }

        let IconAnm = "win_LV1";
        if (type === 1) {
            IconAnm = "win_LV" + level;
        } else if (type === 2) {
            IconAnm = "multiple_LV" + level;
        } else if (type === 3) {
            IconAnm = "redenvelope_Lv" + level;
        } else {
            this.marqueeAnm.active = false;
        }

        this.marqueeWinNum.getComponent(Label).font = number_res;

        Mode.showSpine(this.marqueeAnm.getComponent(sp.Skeleton), { trackIndex: 0, anmName: IconAnm, loop: true, type: 1 });
        let resultNumber = MarqueeData.WinNum[index];

        if (type === 2) {
            this.marqueeWinNum.getComponent(Label).string = resultNumber + "X";
        } else {
            this.marqueeWinNum.getComponent(Label).string = Model.MdNum.formatCredit(resultNumber, false);
        }

        if(this.nowBgTween!=null)
            this.nowBgTween.stop();

        this.nowBgTween = tween(this.marqueeBg)
            .to(0.25, {
                scale: new Vec3(1, 1, 1),                     // 缩放缓动
            })
            .delay(ShowTime)
            .to(0.25, {
                scale: new Vec3(1, 0, 1),                     // 缩放缓动
            })
            .delay(DelayTime)
            .call(() => {
                Marquee.CurrentIndex++;
                if (Marquee.CurrentIndex === Marquee.PlayerId.length)
                    Marquee.CurrentIndex = 0;
                this.handleMaqueeShow(Marquee)
            })
            .start();

        if(this.nowAnmTween!=null)
            this.nowAnmTween.stop();

        this.nowAnmTween = tween(this.marqueeAnm)
            .to(0.25, {
                scale: new Vec3(1, 1, 1),                     // 缩放缓动
            })
            .delay(ShowTime)
            .to(0.25, {
                scale: new Vec3(1, 0, 1),                     // 缩放缓动
            })
            .start();
    }
}

