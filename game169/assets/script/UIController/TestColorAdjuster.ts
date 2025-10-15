import { _decorator, Component, Node, Sprite } from 'cc';
import { SpriteColorAdjuster } from './SpriteColorAdjuster';
const { ccclass, property } = _decorator;

/**
 * 簡單的測試組件，用於驗證 SpriteColorAdjuster 是否正常工作
 * 
 * 使用方法：
 * 1. 將此組件掛載到任何節點上
 * 2. 指定一個帶有 Sprite 和 SpriteColorAdjuster 的目標節點
 * 3. 運行遊戲後會自動測試各種效果
 */
@ccclass('TestColorAdjuster')
export class TestColorAdjuster extends Component {
    
    @property({
        type: Node,
        displayName: "測試目標",
        tooltip: "要測試的節點（必須有 Sprite 和 SpriteColorAdjuster 組件）"
    })
    testTarget: Node | null = null;
    
    private adjuster: SpriteColorAdjuster | null = null;
    private testStep: number = 0;
    private testTimer: number = 0;
    
    start() {
        console.log('🧪 TestColorAdjuster 開始測試...');
        
        if (!this.testTarget) {
            console.error('❌ 請指定測試目標節點！');
            return;
        }
        
        // 獲取 SpriteColorAdjuster 組件
        this.adjuster = this.testTarget.getComponent(SpriteColorAdjuster);
        
        if (!this.adjuster) {
            console.error('❌ 目標節點上沒有 SpriteColorAdjuster 組件！');
            return;
        }
        
        // 檢查是否有 Sprite
        const sprite = this.testTarget.getComponent(Sprite);
        if (!sprite) {
            console.error('❌ 目標節點上沒有 Sprite 組件！');
            return;
        }
        
        console.log('✅ 組件檢查通過，開始測試...');
        this.runNextTest();
    }
    
    update(deltaTime: number) {
        this.testTimer += deltaTime;
        
        // 每 2 秒切換到下一個測試
        if (this.testTimer >= 2.0) {
            this.testTimer = 0;
            this.testStep++;
            this.runNextTest();
        }
    }
    
    private runNextTest() {
        if (!this.adjuster) return;
        
        // 重置所有效果
        this.adjuster.setBrightness(0);
        this.adjuster.setContrast(0);
        this.adjuster.setSaturation(0);
        this.adjuster.setHue(0);
        this.adjuster.tintStrength = 0;
        this.adjuster.setGrayscale(false);
        
        switch (this.testStep % 7) {
            case 0:
                console.log('🔆 測試 1: 增加亮度');
                this.adjuster.setBrightness(0.5);
                break;
            
            case 1:
                console.log('🌙 測試 2: 降低亮度');
                this.adjuster.setBrightness(-0.5);
                break;
            
            case 2:
                console.log('🎨 測試 3: 增加對比度');
                this.adjuster.setContrast(0.5);
                break;
            
            case 3:
                console.log('🌈 測試 4: 增加飽和度');
                this.adjuster.setSaturation(0.8);
                break;
            
            case 4:
                console.log('🎭 測試 5: 色相旋轉');
                this.adjuster.setHue(180);
                break;
            
            case 5:
                console.log('⚫ 測試 6: 灰階效果');
                this.adjuster.setGrayscale(true);
                break;
            
            case 6:
                console.log('✨ 測試 7: 還原正常');
                // 已經重置了
                break;
        }
    }
}
