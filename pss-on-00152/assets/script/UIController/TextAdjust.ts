import { _decorator, Component, Node, UITransform, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TextAdjust')
export class TextAdjust extends Component {
    @property({ type: CCFloat }) MaxWidth = 0.0;

    @property({ type: CCFloat }) ContentWidth = 0.0;

    @property({ type: Node }) Content: Node;
    

    update(deltaTime: number) {
        if (this.MaxWidth) {
            if (this.ContentWidth > 0 && this.Content != null) {
                let size = 1;
                let tmpMax = this.MaxWidth - this.ContentWidth - 1;
                if (this.node.getComponent(UITransform).width > tmpMax) {
                    size = tmpMax / this.node.getComponent(UITransform).width;
                    this.node.setScale(size, 1, 1);
                }
                else {
                    this.node.setScale(1, 1, 1);
                }
                let tmpX = this.node.getPosition().x - (this.node.getComponent(UITransform).width / 2) * size - 1;
                this.Content.setPosition(tmpX, 0);
            }
            else {
                if (this.node.getComponent(UITransform).width > this.MaxWidth) {
                    let size = this.MaxWidth / this.node.getComponent(UITransform).width;
                    this.node.setScale(size, 1, 1);
                }
                else {
                    this.node.setScale(1, 1, 1);
                }
            }
        }
    }

    setContentWidth(width) {
        this.ContentWidth = width;
    }
}
