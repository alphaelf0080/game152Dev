import { _decorator, Component, Node, Sprite, log } from 'cc';
import { SpriteColorAdjuster } from './SpriteColorAdjuster';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 最簡單的 SpriteColorAdjuster 測試
 * 
 * 使用方法：
 * 1. 將此組件掛到有 Sprite 的節點上
 * 2. 該節點也要有 SpriteColorAdjuster 組件
 * 3. 運行遊戲後會自動測試
 */
@ccclass('SimpleSpriteColorTest')
@executeInEditMode
export class SimpleSpriteColorTest extends Component {
    
    @property({
        displayName: "自動測試",
        tooltip: "啟動時自動測試效果"
    })
    autoTest: boolean = true;
    
    @property({
        displayName: "測試亮度",
        tooltip: "測試的亮度值",
        range: [-1, 1, 0.1],
        slide: true
    })
    private _testBrightness: number = 0;
    
    @property({
        range: [-1, 1, 0.1],
        slide: true
    })
    get testBrightness() {
        return this._testBrightness;
    }
    set testBrightness(value: number) {
        this._testBrightness = value;
        this.applyTest();
    }
    
    @property({
        displayName: "測試灰階",
        tooltip: "測試灰階效果"
    })
    private _testGrayscale: boolean = false;
    
    @property
    get testGrayscale() {
        return this._testGrayscale;
    }
    set testGrayscale(value: boolean) {
        this._testGrayscale = value;
        this.applyTest();
    }
    
    private adjuster: SpriteColorAdjuster | null = null;
    
    onLoad() {
        log('🧪 SimpleSpriteColorTest: onLoad');
        this.checkComponents();
    }
    
    start() {
        log('🧪 SimpleSpriteColorTest: start');
        
        if (this.autoTest) {
            this.runAutoTest();
        }
    }
    
    private checkComponents() {
        // 檢查 Sprite
        const sprite = this.getComponent(Sprite);
        if (!sprite) {
            console.error('❌ 節點上沒有 Sprite 組件！請添加 Sprite 組件。');
            return;
        }
        log('✅ 找到 Sprite 組件');
        
        if (!sprite.spriteFrame) {
            console.warn('⚠️ Sprite 沒有設置圖片！請設置 SpriteFrame。');
        } else {
            log('✅ Sprite 有圖片');
        }
        
        // 檢查 SpriteColorAdjuster
        this.adjuster = this.getComponent(SpriteColorAdjuster);
        if (!this.adjuster) {
            console.error('❌ 節點上沒有 SpriteColorAdjuster 組件！請添加 SpriteColorAdjuster 組件。');
            return;
        }
        log('✅ 找到 SpriteColorAdjuster 組件');
    }
    
    private applyTest() {
        if (!this.adjuster) {
            this.adjuster = this.getComponent(SpriteColorAdjuster);
        }
        
        if (!this.adjuster) {
            return;
        }
        
        log(`🎨 應用測試設定 - 亮度: ${this._testBrightness}, 灰階: ${this._testGrayscale}`);
        
        this.adjuster.setBrightness(this._testBrightness);
        this.adjuster.setGrayscale(this._testGrayscale);
    }
    
    private runAutoTest() {
        if (!this.adjuster) {
            console.error('❌ 找不到 SpriteColorAdjuster 組件，無法執行自動測試');
            return;
        }
        
        log('🚀 開始自動測試...');
        log('='.repeat(50));
        
        // 測試 1: 增加亮度
        log('測試 1: 設置亮度 = 0.5');
        this.adjuster.setBrightness(0.5);
        
        // 等待 1 秒後測試 2
        this.scheduleOnce(() => {
            log('測試 2: 設置亮度 = -0.5');
            this.adjuster!.setBrightness(-0.5);
            
            // 等待 1 秒後測試 3
            this.scheduleOnce(() => {
                log('測試 3: 還原亮度 = 0，啟用灰階');
                this.adjuster!.setBrightness(0);
                this.adjuster!.setGrayscale(true);
                
                // 等待 1 秒後測試 4
                this.scheduleOnce(() => {
                    log('測試 4: 關閉灰階，設置對比度 = 0.8');
                    this.adjuster!.setGrayscale(false);
                    this.adjuster!.setContrast(0.8);
                    
                    // 等待 1 秒後測試 5
                    this.scheduleOnce(() => {
                        log('測試 5: 還原所有設定');
                        this.adjuster!.setBrightness(0);
                        this.adjuster!.setContrast(0);
                        this.adjuster!.setSaturation(0);
                        this.adjuster!.setGrayscale(false);
                        
                        log('='.repeat(50));
                        log('✅ 自動測試完成！');
                    }, 1.0);
                }, 1.0);
            }, 1.0);
        }, 1.0);
    }
}
