import { _decorator, Component, Graphics, Color, Node, Mask } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼（漸層填充版）
 * 坐標系統: 中心 (0,0)
 * 颜色模式: 同步 Inspector 顏色（僅描邊）
 *
 * 原理：
 * - 本節點：Graphics 作為 Mask（GRAPHICS_STENCIL），繪製圖形輪廓並 fill() 形成遮罩
 * - 子節點：Graphics 畫多條直條矩形以近似線性漸層，並旋轉子節點配合角度，顏色取漸層
 * - 描邊：於父節點以另一個 Graphics 疊加描邊（避免與遮罩共用）
 */
@ccclass('CustomGraphics')
@executeInEditMode(true)
export class CustomGraphics extends Component {
  @property(Graphics) graphics: Graphics = null;
  @property({ tooltip: '同步 Inspector 顏色（僅描邊適用）' }) syncInspectorColors: boolean = true;
  @property({ tooltip: '（可選）用於描邊的 Graphics，避免與遮罩共用' }) strokeGraphics: Graphics = null;
  @property({ tooltip: '漸層起始顏色' }) gradientStart: Color = new Color(36, 36, 36, 255);
  @property({ tooltip: '漸層結束顏色' }) gradientEnd: Color = new Color(94, 94, 94, 255);
  @property({ tooltip: '漸層角度（度數，0=左→右）' }) gradientAngle: number = 180;
  @property({ tooltip: '漸層細分步數（越大越平滑）' }) gradientSteps: number = 64;

  onLoad() { this.drawShapes(); }
  start() { this.drawShapes(); }
  update() { this.drawShapes(); }

  private lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }

  private drawShapes() {
    const g = this.graphics; if (!g) { console.warn('[CustomGraphics] Graphics not found'); return; }
    g.clear();
    let mask = this.node.getComponent(Mask); if (!mask) mask = this.node.addComponent(Mask); mask.type = Mask.Type.GRAPHICS_STENCIL;
    // 先繪製遮罩形狀（填充為白色）
    g.fillColor = new Color(255, 255, 255, 255);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    // 形狀 1: 矩形
    g.lineWidth = 2;
    g.rect(324, -813, 0, 0);
    g.fill();
    /* stroke overlay later */
    minX = Math.min(minX, 324); minY = Math.min(minY, -813); maxX = Math.max(maxX, 324); maxY = Math.max(maxY, -813);
    // 形狀 2: 矩形
    g.lineWidth = 2;
    g.roundRect(-359, 196, 719, -1094, 30);
    g.fill();
    /* stroke overlay later */
    minX = Math.min(minX, -359); minY = Math.min(minY, -898); maxX = Math.max(maxX, 360); maxY = Math.max(maxY, 196);
    let gradientNode = this.node.getChildByName('GradientFill');
    if (!gradientNode) { gradientNode = new Node('GradientFill'); this.node.addChild(gradientNode); }
    let gradG = gradientNode.getComponent(Graphics); if (!gradG) gradG = gradientNode.addComponent(Graphics);
    gradG.clear();
    const cx = (minX + maxX) / 2; const cy = (minY + maxY) / 2;
    gradientNode.setPosition(cx, cy); gradientNode.angle = this.gradientAngle;
    const bw = Math.max(1, (maxX - minX)); const bh = Math.max(1, (maxY - minY));
    const L = Math.sqrt(bw * bw + bh * bh) * 2; const n = Math.max(2, Math.floor(this.gradientSteps)); const stripW = L / n;
    for (let i = 0; i < n; i++) { const t = i / (n - 1); const r = Math.round(this.lerp(this.gradientStart.r, this.gradientEnd.r, t)); const g2 = Math.round(this.lerp(this.gradientStart.g, this.gradientEnd.g, t)); const b = Math.round(this.lerp(this.gradientStart.b, this.gradientEnd.b, t)); gradG.fillColor = new Color(r, g2, b, 255); const x = -L / 2 + i * stripW; gradG.rect(x, -L / 2, stripW + 0.5, L); gradG.fill(); }
    if (!this.strokeGraphics) this.strokeGraphics = this.node.addComponent(Graphics); const s = this.strokeGraphics; s.clear();
    s.lineWidth = 2;
    if (!this.syncInspectorColors) {
      s.strokeColor = new Color(0, 0, 0, 255);
    }
    s.rect(324, -813, 0, 0); s.stroke();
    s.lineWidth = 2;
    if (!this.syncInspectorColors) {
      s.strokeColor = new Color(0, 0, 0, 255);
    }
    s.roundRect(-359, 196, 719, -1094, 30); s.stroke();
  }
}
