import { _decorator, Component, Graphics, Mask } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Graphics Editor 導出圖形用作 Mask 示例
 * 
 * 使用方式：
 * 1. 在 Graphics Editor 中繪製遮罩形狀
 * 2. 導出 TypeScript 代碼
 * 3. 將繪圖代碼複製到 drawMaskShape() 方法中
 * 4. 修改顏色為白色 (255, 255, 255, 255)
 * 5. 移除 stroke() 調用，只保留 fill()
 * 
 * 節點結構：
 * MaskNode (此腳本)
 *   ├─ UITransform
 *   ├─ Graphics
 *   ├─ Mask (Type: GRAPHICS_STENCIL)
 *   └─ GraphicsEditorMask (此腳本)
 *   
 * 子節點：被遮罩的內容
 *   ├─ Sprite / Label / 任何 UI 組件
 */
@ccclass('GraphicsEditorMask')
export class GraphicsEditorMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    @property(Mask)
    mask: Mask | null = null;
    
    @property({
        displayName: '顯示遮罩區域（除錯）',
        tooltip: '勾選後會用半透明紅色顯示遮罩形狀，方便調試'
    })
    debugMode: boolean = false;
    
    @property({
        displayName: '重繪遮罩',
        tooltip: '點擊此按鈕重新繪製遮罩形狀'
    })
    get redraw(): boolean {
        return false;
    }
    set redraw(value: boolean) {
        if (value) {
            this.drawMaskShape();
        }
    }
    
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
     * 將 Graphics Editor 導出的代碼貼到這裡
     */
    drawMaskShape() {
        const g = this.graphics;
        if (!g) {
            console.error('[GraphicsEditorMask] Graphics 組件未找到！');
            return;
        }
        
        // 清除之前的繪製
        g.clear();
        
        // 設置顏色
        if (this.debugMode) {
            // 除錯模式：紅色半透明
            g.fillColor.set(255, 0, 0, 128);
            console.log('[GraphicsEditorMask] 除錯模式：顯示遮罩區域（紅色半透明）');
        } else {
            // 正常模式：白色完全不透明（Mask 必須用白色）
            g.fillColor.set(255, 255, 255, 255);
        }
        
        // ============================================================
        // === 將 Graphics Editor 導出的繪圖代碼貼到這裡 ===
        // ============================================================
        
        // 示例：矩形遮罩（720x1080 的老虎機捲軸區域）
        g.rect(-360, 540, 720, -1080);
        g.fill();
        
        // 示例：圓形遮罩（半徑 100 的圓形頭像）
        // g.circle(0, 0, 100);
        // g.fill();
        
        // 示例：複雜折線遮罩
        // g.moveTo(-163, 123);
        // g.lineTo(218, 123);
        // g.lineTo(218, -384);
        // g.lineTo(-163, -384);
        // g.close(); // 閉合路徑
        // g.fill();
        
        // ============================================================
        // === 導出代碼結束 ===
        // ============================================================
        
        console.log('[GraphicsEditorMask] 遮罩形狀已繪製');
    }
    
    /**
     * 動態更新遮罩（可選）
     * 如果需要在運行時改變遮罩形狀，調用此方法
     */
    updateMask() {
        this.drawMaskShape();
    }
}
