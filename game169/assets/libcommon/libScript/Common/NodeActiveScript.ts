import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeActiveScript')
export class NodeActiveScript extends Component {
    @property({ type: Node })
    public Target = [];

    public setTargetEnable() {
        if (this.Target.length > 0) {
            for (let i = 0; i < this.Target.length; i++) {
                this.Target[i].active = true;
            }
        }
    }

    public setTargetDisable() {
        if (this.Target.length > 0) {
            for (let i = 0; i < this.Target.length; i++) {
                this.Target[i].active = false;
            }
        }
    }

}

