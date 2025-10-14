import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CommonScript')
export class CommonScript extends Component {
    @property({ type: Node }) Target = [];

    setTargetEnable() {
        if (this.Target.length > 0) {
            for (let i = 0; i < this.Target.length; i++) {
                this.Target[i].active = true;
            }
        }
    }

    setTargetDisable() {
        if (this.Target.length > 0) {
            for (let i = 0; i < this.Target.length; i++) {
                this.Target[i].active = false;
            }
        }
    }

}

