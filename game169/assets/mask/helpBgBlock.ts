import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: 中心 (0,0)
 * 颜色模式: 使用导出时的颜色
 * 
 * @executeInEditMode - 在編輯器模式下也會執行，可以在 Scene 視窗中預覽圖形
 */
@ccclass('CustomGraphics')
@executeInEditMode(true)
export class CustomGraphics extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    @property({ tooltip: '同步 Inspector 顏色（fillColor / strokeColor）' })
    syncInspectorColors: boolean = false;

    private _lastStrokeKey: string = '';
    private _lastFillKey: string = '';
    private _lastSync: boolean = false;

    onLoad() {
        // 在編輯器和運行時都執行繪製
        this.drawShapes();
        this.cacheColors();
    }

    start() {
        this.drawShapes();
        this.cacheColors();
    }

    update() {
        if (!this.graphics) return;
        // 在編輯器中即時同步 Inspector 顏色或切換模式
        const strokeKey = this.colorKey(this.graphics.strokeColor);
        const fillKey = this.colorKey(this.graphics.fillColor);
        if (this._lastStrokeKey !== strokeKey || this._lastFillKey !== fillKey || this._lastSync !== this.syncInspectorColors) {
            this._lastStrokeKey = strokeKey;
            this._lastFillKey = fillKey;
            this._lastSync = this.syncInspectorColors;
            this.drawShapes();
        }
    }

    private cacheColors() {
        if (!this.graphics) return;
        this._lastStrokeKey = this.colorKey(this.graphics.strokeColor);
        this._lastFillKey = this.colorKey(this.graphics.fillColor);
    }

    private colorKey(c: Color): string {
        return c ? (c.r + ',' + c.g + ',' + c.b + ',' + c.a) : '';
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
        if (!this.syncInspectorColors) {
            g.fillColor = new Color(45, 45, 45, 255);
            g.strokeColor = new Color(45, 45, 45, 255);
        } else {
            // 使用 Inspector 中的 fillColor / strokeColor
        }
        // 個別圓角矩形 (Canvas TL=28, TR=28, BR=0, BL=0)
        const x = -360, y = 483;
        const w = 720, h = 59;
        const rBL = 28, rBR = 28, rTR = 0, rTL = 0;
        g.moveTo(x + rTL, y);
        g.lineTo(x + w - rTR, y);
        if (rTR > 0) g.quadraticCurveTo(x + w, y, x + w, y + rTR);
        g.lineTo(x + w, y + h - rBR);
        if (rBR > 0) g.quadraticCurveTo(x + w, y + h, x + w - rBR, y + h);
        g.lineTo(x + rBL, y + h);
        if (rBL > 0) g.quadraticCurveTo(x, y + h, x, y + h - rBL);
        g.lineTo(x, y + rTL);
        if (rTL > 0) g.quadraticCurveTo(x, y, x + rTL, y);
        g.close();
        g.fill();
        g.stroke();

        // 形狀 2: 矩形
        g.lineWidth = 2;
        if (!this.syncInspectorColors) {
            g.fillColor = new Color(0, 0, 0, 240);
            g.strokeColor = new Color(0, 0, 0, 240);
        } else {
            // 使用 Inspector 中的 fillColor / strokeColor
        }
        g.rect(340, -397, 0, 0);
        g.fill();
        g.stroke();

        // 形狀 3: 矩形
        g.lineWidth = 2;
        if (!this.syncInspectorColors) {
            g.fillColor = new Color(0, 0, 0, 240);
            g.strokeColor = new Color(0, 0, 0, 240);
        } else {
            // 使用 Inspector 中的 fillColor / strokeColor
        }
        g.rect(-362, 482, 721, -1025);
        g.fill();
        g.stroke();

    }
}
