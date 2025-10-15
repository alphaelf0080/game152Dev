import { _decorator, Component, Node, Sprite, Color } from 'cc';
import { SpriteColorAdjuster } from './SpriteColorAdjuster';
const { ccclass, property } = _decorator;

/**
 * SpriteColorAdjuster 使用範例
 * 展示各種色彩調整效果的實際應用
 */
@ccclass('SpriteColorAdjusterExample')
export class SpriteColorAdjusterExample extends Component {
    
    @property({ type: Node, displayName: "測試 Sprite 節點" })
    testSprite: Node | null = null;
    
    private adjuster: SpriteColorAdjuster | null = null;
    
    start() {
        if (!this.testSprite) {
            console.warn('請設置測試 Sprite 節點');
            return;
        }
        
        // 獲取或添加 SpriteColorAdjuster 組件
        this.adjuster = this.testSprite.getComponent(SpriteColorAdjuster);
        if (!this.adjuster) {
            this.adjuster = this.testSprite.addComponent(SpriteColorAdjuster);
        }
        
        console.log('🎨 SpriteColorAdjuster 範例已啟動');
        console.log('提示：可以在控制台調用以下方法測試效果：');
        console.log('  - example.testBrightness()');
        console.log('  - example.testContrast()');
        console.log('  - example.testSaturation()');
        console.log('  - example.testHue()');
        console.log('  - example.testGrayscale()');
        console.log('  - example.testTint()');
        console.log('  - example.testPresets()');
        console.log('  - example.testAnimations()');
        
        // 將實例綁定到 window 供控制台訪問
        (window as any).colorAdjusterExample = this;
    }
    
    // ==================== 基礎測試 ====================
    
    /**
     * 測試亮度調整
     */
    testBrightness() {
        console.log('🔆 測試亮度調整');
        
        // 變暗
        console.log('  → 變暗 (-0.5)');
        this.adjuster?.setBrightness(-0.5);
        
        // 2 秒後恢復
        this.scheduleOnce(() => {
            console.log('  → 恢復正常 (0)');
            this.adjuster?.setBrightness(0);
            
            // 再 2 秒後變亮
            this.scheduleOnce(() => {
                console.log('  → 變亮 (0.5)');
                this.adjuster?.setBrightness(0.5);
                
                // 再 2 秒後恢復
                this.scheduleOnce(() => {
                    console.log('  → 恢復正常');
                    this.adjuster?.reset();
                }, 2);
            }, 2);
        }, 2);
    }
    
    /**
     * 測試對比度調整
     */
    testContrast() {
        console.log('🎨 測試對比度調整');
        
        // 低對比度
        console.log('  → 低對比度 (-0.5)');
        this.adjuster?.setContrast(-0.5);
        
        this.scheduleOnce(() => {
            console.log('  → 高對比度 (0.8)');
            this.adjuster?.setContrast(0.8);
            
            this.scheduleOnce(() => {
                console.log('  → 恢復正常');
                this.adjuster?.reset();
            }, 2);
        }, 2);
    }
    
    /**
     * 測試飽和度調整
     */
    testSaturation() {
        console.log('🌈 測試飽和度調整');
        
        // 去色
        console.log('  → 去色 (-1)');
        this.adjuster?.setSaturation(-1);
        
        this.scheduleOnce(() => {
            console.log('  → 超飽和 (0.8)');
            this.adjuster?.setSaturation(0.8);
            
            this.scheduleOnce(() => {
                console.log('  → 恢復正常');
                this.adjuster?.reset();
            }, 2);
        }, 2);
    }
    
    /**
     * 測試色相旋轉
     */
    testHue() {
        console.log('🎭 測試色相旋轉');
        
        let hue = 0;
        const rotateHue = () => {
            hue += 30;
            if (hue > 360) {
                console.log('  → 恢復正常');
                this.adjuster?.reset();
                return;
            }
            
            console.log(`  → 色相: ${hue}°`);
            this.adjuster?.setHue(hue);
            this.scheduleOnce(rotateHue, 0.5);
        };
        
        rotateHue();
    }
    
    /**
     * 測試灰階效果
     */
    testGrayscale() {
        console.log('⚫ 測試灰階效果');
        
        console.log('  → 啟用灰階');
        this.adjuster?.setGrayscale(true);
        
        this.scheduleOnce(() => {
            console.log('  → 關閉灰階');
            this.adjuster?.setGrayscale(false);
        }, 2);
    }
    
    /**
     * 測試顏色疊加
     */
    testTint() {
        console.log('🎨 測試顏色疊加');
        
        // 紅色疊加
        console.log('  → 紅色疊加 (0.5)');
        this.adjuster?.setTint(new Color(255, 0, 0, 255), 0.5);
        
        this.scheduleOnce(() => {
            console.log('  → 藍色疊加 (0.5)');
            this.adjuster?.setTint(new Color(0, 0, 255, 255), 0.5);
            
            this.scheduleOnce(() => {
                console.log('  → 綠色疊加 (0.5)');
                this.adjuster?.setTint(new Color(0, 255, 0, 255), 0.5);
                
                this.scheduleOnce(() => {
                    console.log('  → 恢復正常');
                    this.adjuster?.reset();
                }, 2);
            }, 2);
        }, 2);
    }
    
    // ==================== 預設效果測試 ====================
    
    /**
     * 測試預設效果
     */
    testPresets() {
        console.log('✨ 測試預設效果');
        
        const presets = [
            { name: '夜間模式', fn: 'applyNightMode' },
            { name: '懷舊效果', fn: 'applySepia' },
            { name: '高對比黑白', fn: 'applyHighContrastBW' },
            { name: '鮮豔效果', fn: 'applyVibrant' }
        ];
        
        let index = 0;
        const applyNext = () => {
            if (index >= presets.length) {
                console.log('  → 恢復正常');
                this.adjuster?.reset();
                return;
            }
            
            const preset = presets[index];
            console.log(`  → ${preset.name}`);
            (this.adjuster as any)[preset.fn]();
            
            index++;
            this.scheduleOnce(applyNext, 3);
        };
        
        applyNext();
    }
    
    // ==================== 動畫測試 ====================
    
    /**
     * 測試動畫效果
     */
    testAnimations() {
        console.log('🎬 測試動畫效果');
        
        // 淡出
        console.log('  → 淡出效果 (2 秒)');
        this.adjuster?.fadeOut(2, () => {
            console.log('  → 淡出完成');
            
            // 淡入
            console.log('  → 淡入效果 (2 秒)');
            this.adjuster?.fadeIn(2, () => {
                console.log('  → 淡入完成');
            });
        });
    }
    
    /**
     * 測試閃爍效果
     */
    testFlash() {
        console.log('⚡ 測試閃爍效果');
        
        let count = 0;
        const flash = () => {
            if (count >= 5) {
                console.log('  → 閃爍完成');
                this.adjuster?.reset();
                return;
            }
            
            this.adjuster?.animateBrightness(1, 0.2, () => {
                this.adjuster?.animateBrightness(0, 0.2, flash);
            });
            
            count++;
        };
        
        flash();
    }
    
    /**
     * 測試彩虹循環效果
     */
    testRainbow() {
        console.log('🌈 測試彩虹循環效果');
        
        this.adjuster?.animateHue(360, 3, () => {
            console.log('  → 彩虹循環完成');
            this.adjuster?.reset();
        });
    }
    
    // ==================== 實際應用場景 ====================
    
    /**
     * 模擬按鈕按下效果
     */
    simulateButtonPress() {
        console.log('🔘 模擬按鈕按下');
        
        // 按下變暗
        this.adjuster?.darken(0.3);
        
        // 0.5 秒後釋放
        this.scheduleOnce(() => {
            console.log('  → 按鈕釋放');
            this.adjuster?.reset();
        }, 0.5);
    }
    
    /**
     * 模擬符號中獎高亮
     */
    simulateSymbolWin() {
        console.log('🎰 模擬符號中獎高亮');
        
        // 閃爍 3 次
        let count = 0;
        const flash = () => {
            if (count >= 3) {
                console.log('  → 中獎動畫完成');
                this.adjuster?.reset();
                return;
            }
            
            this.adjuster?.animateBrightness(0.8, 0.3, () => {
                this.adjuster?.animateSaturation(0.5, 0, () => {
                    this.adjuster?.animateBrightness(0, 0.3, () => {
                        this.adjuster?.animateSaturation(0, 0, flash);
                    });
                });
            });
            
            count++;
        };
        
        flash();
    }
    
    /**
     * 模擬日夜循環
     */
    simulateDayNightCycle() {
        console.log('🌅 模擬日夜循環');
        
        const cycle = () => {
            console.log('  → 進入夜晚');
            this.adjuster?.animateBrightness(-0.4, 5, () => {
                console.log('  → 進入白天');
                this.adjuster?.animateBrightness(0, 5, cycle);
            });
        };
        
        cycle();
    }
    
    /**
     * 停止所有效果
     */
    stopAll() {
        console.log('⏹️ 停止所有效果');
        this.unscheduleAllCallbacks();
        this.adjuster?.reset();
    }
}

// 將類綁定到 window 供控制台使用
(window as any).SpriteColorAdjusterExample = SpriteColorAdjusterExample;
