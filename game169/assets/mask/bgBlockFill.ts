import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: 中心 (0,0)
 */
@ccclass('CustomGraphics')
export class CustomGraphics extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    start() {
        this.drawShapes();
    }

    private drawShapes() {
        const g = this.graphics;
        g.clear();
        
        // 形狀 1: 矩形
        g.lineWidth = 2;
        g.fillColor = new Color(0, 0, 0, 128);
        g.strokeColor = new Color(0, 0, 0, 128);
        g.roundRect(-100, 50, 200, -100, 20);
        g.fill();
        g.stroke();

    }
}
