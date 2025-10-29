import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: 左下 - Cocos Creator 預設
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
            g.fillColor = new Color(255, 0, 0, 255);
            g.strokeColor = new Color(0, 0, 0, 255);
        } else {
            // 使用 Inspector 中的 fillColor / strokeColor
        }
        // 個別圓角矩形 (TL=30, TR=30, BR=0, BL=0)
        const x = 90, y = 160;
        const w = 459, h = 171;
        const rTL = 30, rTR = 30, rBR = 0, rBL = 0;
        g.moveTo(x + rTL, y);
        g.lineTo(x + w - rTR, y);
        if (rTR > 0) {
            g.arc(x + w - rTR, y + rTR, rTR, -Math.PI / 2, 0, false);
        } else {
            g.lineTo(x + w, y);
        }
        g.lineTo(x + w, y + h - rBR);
        if (rBR > 0) {
            g.arc(x + w - rBR, y + h - rBR, rBR, 0, Math.PI / 2, false);
        } else {
            g.lineTo(x + w, y + h);
        }
        g.lineTo(x + rBL, y + h);
        if (rBL > 0) {
            g.arc(x + rBL, y + h - rBL, rBL, Math.PI / 2, Math.PI, false);
        } else {
            g.lineTo(x, y + h);
        }
        g.lineTo(x, y + rTL);
        if (rTL > 0) {
            g.arc(x + rTL, y + rTL, rTL, Math.PI, -Math.PI / 2, false);
        } else {
            g.lineTo(x, y);
        }
        g.close();
        g.fill();
        g.stroke();

    }
}
