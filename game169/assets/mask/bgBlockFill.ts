import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: 中心 (0,0)
 * 颜色模式: 同步 Inspector 中的 Graphics 组件颜色
 * 
 * @executeInEditMode - 在編輯器模式下也會執行，可以在 Scene 視窗中預覽圖形
 */
@ccclass('CustomGraphics')
@executeInEditMode(true)
export class CustomGraphics extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    onLoad() {
        // 在編輯器和運行時都執行繪製
        this.drawShapes();
    }

    start() {
        this.drawShapes();
    }

    private drawShapes() {
        if (!this.graphics) {
            console.warn('[CustomGraphics] Graphics component not found');
            return;
        }
        
        const g = this.graphics;
        g.clear();
        
        // 形狀 1: 矩形
        g.lineWidth = 2;
        // 🎨 使用 Inspector 中设置的颜色
        // g.fillColor = ... // 从 Inspector 继承
        // g.strokeColor = ... // 从 Inspector 继承
        g.rect(-400,900, 800, -1800);
        g.fill();
        g.stroke();

    }
}
