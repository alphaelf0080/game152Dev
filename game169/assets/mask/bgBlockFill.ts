import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: 中心 (0,0)
 * 颜色模式: 同步 Inspector 中的 Graphics 组件颜色
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
        // 🎨 使用 Inspector 中设置的颜色
        // g.fillColor = ... // 从 Inspector 继承
        // g.strokeColor = ... // 从 Inspector 继承
        g.roundRect(-360, 100, 720, -200, 20);
        g.fill();
        g.stroke();

    }
}
