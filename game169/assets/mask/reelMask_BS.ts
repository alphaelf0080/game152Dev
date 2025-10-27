import { _decorator, Component, Graphics, Mask } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Graphics Editor 生成的 Mask（遮罩）代碼
 * 坐標系統: 中心 (0,0)
 * 
 * 使用說明：
 * 1. 將此腳本掛載到節點上
 * 2. 添加 Graphics 組件
 * 3. 添加 Mask 組件（Type: GRAPHICS_STENCIL）
 * 4. 在 Mask 節點下添加子節點作為被遮罩的內容
 */
@ccclass('CustomMask')
export class CustomMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    @property(Mask)
    mask: Mask | null = null;
    
    @property({
        displayName: '顯示遮罩區域（除錯）',
        tooltip: '勾選後會用半透明紅色顯示遮罩形狀，方便調試'
    })
    debugMode: boolean = false;
    
    start() {
        // 自動獲取組件
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
        
        if (!this.mask) {
            this.mask = this.getComponent(Mask);
        }
        
        // 繪製遮罩
        this.drawMaskShape();
    }
    
    /**
     * 繪製遮罩形狀
     */
    drawMaskShape() {
        const g = this.graphics;
        if (!g) {
            console.error('[CustomMask] Graphics 組件未找到！');
            return;
        }
        
        g.clear();
        
        // Mask 必須使用白色（除錯模式除外）
        if (this.debugMode) {
            // 除錯模式：紅色半透明
            g.fillColor.set(255, 0, 0, 128);
        } else {
            // 正常模式：白色完全不透明
            g.fillColor.set(255, 255, 255, 255);
        }
        
        // 遮罩形狀 1: 折線
        g.moveTo(-50347, 359);
        g.lineTo(-50274, 351);
        g.lineTo(-50213, 351);
        g.lineTo(-50072, 351);
        g.lineTo(-49933, 349);
        g.lineTo(-49792, 351);
        g.lineTo(-49651, 356);
        g.lineTo(-49653, -179);
        g.lineTo(-50348, -178);
        g.lineTo(-50352, 356);
        g.close(); // 閉合路徑
        g.fill();

    }
}
