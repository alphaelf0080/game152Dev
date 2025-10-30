import { _decorator, Component } from 'cc';
import { Container } from './Container';
import { BtnClickAudioName } from '../Controller/AudioController';
const { ccclass, property } = _decorator;

@ccclass('BasePage')
export class BasePage extends Component {

    protected get _GVar(): any {
        return Container.getInstance().get("GVar");
    }

    protected get _audioCtrl(): any {
        return Container.getInstance().get("AudioController");
    }

    constructor() {
        super();
    }

    public openPage(delay?: number) {
        if (this._GVar.isMenuOn || this._GVar.isSpin) return;

        let self = this;
        this._audioCtrl.playSfx(BtnClickAudioName, false);
        function cb() {
            self._GVar.isMenuOn = true;
            self.node.active = true;
        }
        if (delay && delay > 0) {
            this.scheduleOnce(cb, delay);
        }
        else cb();
    }

    public closePage(delay?: number) {
        let self = this;

        function cb() {
            self._GVar.isMenuOn = false;
            self.node.active = false;
        }
        this._audioCtrl.playSfx(BtnClickAudioName, false);
        if (delay && delay > 0) {
            this.scheduleOnce(cb, delay);
        }
        else cb();
    }
}

