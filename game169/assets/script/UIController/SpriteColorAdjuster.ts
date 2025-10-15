import { _decorator, Component, Sprite, Color, Material, Vec4 } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;

/**
 * 色彩調整模式
 */
export enum ColorAdjustMode {
    /** 亮度調整 */
    BRIGHTNESS = 'brightness',
    /** 對比度調整 */
    CONTRAST = 'contrast',
    /** 飽和度調整 */
    SATURATION = 'saturation',
    /** 色相調整 */
    HUE = 'hue',
    /** 整體顏色疊加 */
    TINT = 'tint',
    /** 灰階效果 */
    GRAYSCALE = 'grayscale'
}

/**
 * Sprite 色彩明暗調整組件
 * 
 * 功能：
 * - 🔆 亮度調整（-1 到 1）
 * - 🎨 對比度調整（-1 到 1）
 * - 🌈 飽和度調整（-1 到 1）
 * - 🎭 色相旋轉（0 到 360 度）
 * - 🎨 顏色疊加（Tint）
 * - ⚫ 灰階效果
 * - 🔄 支援運行時動態調整
 * - 💾 支援編輯器即時預覽
 * - 🎬 支援動畫過渡
 * 
 * 使用範例：
 * ```typescript
 * const adjuster = sprite.getComponent(SpriteColorAdjuster);
 * adjuster.setBrightness(0.5);  // 增加亮度
 * adjuster.setContrast(-0.3);   // 降低對比度
 * adjuster.setSaturation(0.8);  // 增加飽和度
 * adjuster.setGrayscale(true);  // 灰階效果
 * 
 * // 動畫過渡
 * adjuster.animateBrightness(-0.5, 1.0, () => {
 *     console.log('變暗完成');
 * });
 * ```
 */
@ccclass('SpriteColorAdjuster')
@executeInEditMode
@menu('自定義組件/UI/SpriteColorAdjuster')
export class SpriteColorAdjuster extends Component {
    
    // ==================== 屬性配置 ====================
    
    @property({
        displayName: "亮度",
        tooltip: "調整圖片亮度 (-1: 最暗, 0: 正常, 1: 最亮)",
        range: [-1, 1, 0.01],
        slide: true
    })
    private _brightness: number = 0;
    
    @property({
        displayName: "對比度",
        tooltip: "調整圖片對比度 (-1: 最低, 0: 正常, 1: 最高)",
        range: [-1, 1, 0.01],
        slide: true
    })
    private _contrast: number = 0;
    
    @property({
        displayName: "飽和度",
        tooltip: "調整圖片飽和度 (-1: 無色, 0: 正常, 1: 超飽和)",
        range: [-1, 1, 0.01],
        slide: true
    })
    private _saturation: number = 0;
    
    @property({
        displayName: "色相",
        tooltip: "旋轉色相 (0-360 度)",
        range: [0, 360, 1],
        slide: true
    })
    private _hue: number = 0;
    
    @property({
        displayName: "顏色疊加",
        tooltip: "疊加的顏色（用於染色效果）"
    })
    private _tintColor: Color = new Color(255, 255, 255, 255);
    
    @property({
        displayName: "疊加強度",
        tooltip: "顏色疊加的強度 (0: 無效果, 1: 完全疊加)",
        range: [0, 1, 0.01],
        slide: true
    })
    private _tintStrength: number = 0;
    
    @property({
        displayName: "灰階效果",
        tooltip: "將圖片轉為灰階"
    })
    private _grayscale: boolean = false;
    
    // ==================== 私有屬性 ====================
    
    /** Sprite 組件引用 */
    private sprite: Sprite | null = null;
    
    /** 原始顏色 */
    private originalColor: Color = new Color(255, 255, 255, 255);
    
    /** 是否已初始化 */
    private initialized: boolean = false;
    
    /** 動畫計時器 */
    private animationTimer: number = 0;
    
    /** 動畫持續時間 */
    private animationDuration: number = 0;
    
    /** 動畫起始值 */
    private animationStartValue: number = 0;
    
    /** 動畫目標值 */
    private animationTargetValue: number = 0;
    
    /** 動畫類型 */
    private animationType: ColorAdjustMode | null = null;
    
    /** 動畫完成回調 */
    private animationCallback: (() => void) | null = null;
    
    // ==================== 生命週期 ====================
    
    onLoad(): void {
        this.initialize();
    }
    
    start(): void {
        console.log('🎨 SpriteColorAdjuster 啟動');
        this.applyAllAdjustments();
    }
    
    onDestroy(): void {
        // 還原原始顏色
        if (this.sprite && this.originalColor) {
            this.sprite.color = this.originalColor.clone();
        }
        console.log('🗑️ SpriteColorAdjuster 已銷毀');
    }
    
    update(deltaTime: number): void {
        // 處理動畫
        if (this.animationType && this.animationDuration > 0) {
            this.animationTimer += deltaTime;
            const progress = Math.min(this.animationTimer / this.animationDuration, 1);
            
            // 線性插值
            const currentValue = this.animationStartValue + 
                (this.animationTargetValue - this.animationStartValue) * progress;
            
            // 應用當前值
            switch (this.animationType) {
                case ColorAdjustMode.BRIGHTNESS:
                    this._brightness = currentValue;
                    break;
                case ColorAdjustMode.CONTRAST:
                    this._contrast = currentValue;
                    break;
                case ColorAdjustMode.SATURATION:
                    this._saturation = currentValue;
                    break;
                case ColorAdjustMode.HUE:
                    this._hue = currentValue;
                    break;
            }
            
            this.applyAllAdjustments();
            
            // 動畫完成
            if (progress >= 1) {
                this.animationType = null;
                this.animationDuration = 0;
                
                if (this.animationCallback) {
                    this.animationCallback();
                    this.animationCallback = null;
                }
            }
        }
    }
    
    // ==================== 初始化 ====================
    
    /**
     * 初始化組件
     */
    private initialize(): void {
        if (this.initialized) {
            return;
        }
        
        // 獲取 Sprite 組件
        this.sprite = this.getComponent(Sprite);
        
        if (!this.sprite) {
            console.warn('⚠️ SpriteColorAdjuster: 找不到 Sprite 組件');
            console.warn('   節點名稱:', this.node.name);
            console.warn('   節點組件:', this.node.components.map(c => c.name).join(', '));
            return;
        }
        
        // 保存原始顏色
        this.originalColor = this.sprite.color.clone();
        
        this.initialized = true;
        console.log('✅ SpriteColorAdjuster 初始化完成');
        console.log('   原始顏色:', this.originalColor);
        console.log('   當前設定 - 亮度:', this._brightness, '對比度:', this._contrast, '灰階:', this._grayscale);
    }
    
    // ==================== 屬性訪問器 ====================
    
    @property({ type: Number })
    get brightness(): number {
        return this._brightness;
    }
    
    set brightness(value: number) {
        this._brightness = Math.max(-1, Math.min(1, value));
        this.applyAllAdjustments();
    }
    
    @property({ type: Number })
    get contrast(): number {
        return this._contrast;
    }
    
    set contrast(value: number) {
        this._contrast = Math.max(-1, Math.min(1, value));
        this.applyAllAdjustments();
    }
    
    @property({ type: Number })
    get saturation(): number {
        return this._saturation;
    }
    
    set saturation(value: number) {
        this._saturation = Math.max(-1, Math.min(1, value));
        this.applyAllAdjustments();
    }
    
    @property({ type: Number })
    get hue(): number {
        return this._hue;
    }
    
    set hue(value: number) {
        this._hue = value % 360;
        this.applyAllAdjustments();
    }
    
    @property({ type: Color })
    get tintColor(): Color {
        return this._tintColor;
    }
    
    set tintColor(value: Color) {
        this._tintColor = value;
        this.applyAllAdjustments();
    }
    
    @property({
        range: [0, 1, 0.01],
        slide: true
    })
    get tintStrength(): number {
        return this._tintStrength;
    }
    
    set tintStrength(value: number) {
        this._tintStrength = Math.max(0, Math.min(1, value));
        this.applyAllAdjustments();
    }
    
    @property
    get grayscale(): boolean {
        return this._grayscale;
    }
    
    set grayscale(value: boolean) {
        this._grayscale = value;
        this.applyAllAdjustments();
    }
    
    // ==================== 公共方法 ====================
    
    /**
     * 設置亮度
     * @param value 亮度值 (-1 到 1)
     */
    setBrightness(value: number): void {
        this.brightness = value;
        console.log(`🔆 設置亮度: ${value}`);
    }
    
    /**
     * 設置對比度
     * @param value 對比度值 (-1 到 1)
     */
    setContrast(value: number): void {
        this.contrast = value;
        console.log(`🎨 設置對比度: ${value}`);
    }
    
    /**
     * 設置飽和度
     * @param value 飽和度值 (-1 到 1)
     */
    setSaturation(value: number): void {
        this.saturation = value;
        console.log(`🌈 設置飽和度: ${value}`);
    }
    
    /**
     * 設置色相
     * @param value 色相角度 (0 到 360)
     */
    setHue(value: number): void {
        this.hue = value;
        console.log(`🎭 設置色相: ${value}°`);
    }
    
    /**
     * 設置顏色疊加
     * @param color 疊加顏色
     * @param strength 強度 (0 到 1)
     */
    setTint(color: Color, strength: number = 1): void {
        this.tintColor = color;
        this.tintStrength = strength;
        console.log(`🎨 設置顏色疊加: ${color.toString()}, 強度: ${strength}`);
    }
    
    /**
     * 設置灰階效果
     * @param enabled 是否啟用
     */
    setGrayscale(enabled: boolean): void {
        this.grayscale = enabled;
        console.log(`⚫ 灰階效果: ${enabled ? '啟用' : '關閉'}`);
    }
    
    /**
     * 重置所有調整
     */
    reset(): void {
        this._brightness = 0;
        this._contrast = 0;
        this._saturation = 0;
        this._hue = 0;
        this._tintStrength = 0;
        this._grayscale = false;
        this.applyAllAdjustments();
        console.log('🔄 重置所有色彩調整');
    }
    
    /**
     * 變暗效果
     * @param amount 變暗程度 (0 到 1)
     */
    darken(amount: number = 0.5): void {
        this.setBrightness(-Math.abs(amount));
    }
    
    /**
     * 變亮效果
     * @param amount 變亮程度 (0 到 1)
     */
    lighten(amount: number = 0.5): void {
        this.setBrightness(Math.abs(amount));
    }
    
    /**
     * 去色效果（降低飽和度）
     * @param amount 去色程度 (0 到 1)
     */
    desaturate(amount: number = 1): void {
        this.setSaturation(-Math.abs(amount));
    }
    
    // ==================== 動畫方法 ====================
    
    /**
     * 動畫調整亮度
     * @param targetValue 目標亮度
     * @param duration 持續時間（秒）
     * @param callback 完成回調
     */
    animateBrightness(targetValue: number, duration: number, callback?: () => void): void {
        this.startAnimation(ColorAdjustMode.BRIGHTNESS, this._brightness, targetValue, duration, callback);
    }
    
    /**
     * 動畫調整對比度
     * @param targetValue 目標對比度
     * @param duration 持續時間（秒）
     * @param callback 完成回調
     */
    animateContrast(targetValue: number, duration: number, callback?: () => void): void {
        this.startAnimation(ColorAdjustMode.CONTRAST, this._contrast, targetValue, duration, callback);
    }
    
    /**
     * 動畫調整飽和度
     * @param targetValue 目標飽和度
     * @param duration 持續時間（秒）
     * @param callback 完成回調
     */
    animateSaturation(targetValue: number, duration: number, callback?: () => void): void {
        this.startAnimation(ColorAdjustMode.SATURATION, this._saturation, targetValue, duration, callback);
    }
    
    /**
     * 動畫調整色相
     * @param targetValue 目標色相
     * @param duration 持續時間（秒）
     * @param callback 完成回調
     */
    animateHue(targetValue: number, duration: number, callback?: () => void): void {
        this.startAnimation(ColorAdjustMode.HUE, this._hue, targetValue, duration, callback);
    }
    
    /**
     * 淡入效果（從暗到亮）
     * @param duration 持續時間（秒）
     * @param callback 完成回調
     */
    fadeIn(duration: number = 0.5, callback?: () => void): void {
        this.animateBrightness(0, duration, callback);
    }
    
    /**
     * 淡出效果（從亮到暗）
     * @param duration 持續時間（秒）
     * @param callback 完成回調
     */
    fadeOut(duration: number = 0.5, callback?: () => void): void {
        this.animateBrightness(-1, duration, callback);
    }
    
    // ==================== 內部方法 ====================
    
    /**
     * 開始動畫
     */
    private startAnimation(
        type: ColorAdjustMode,
        startValue: number,
        targetValue: number,
        duration: number,
        callback?: () => void
    ): void {
        this.animationType = type;
        this.animationStartValue = startValue;
        this.animationTargetValue = targetValue;
        this.animationDuration = duration;
        this.animationTimer = 0;
        this.animationCallback = callback || null;
        
        console.log(`🎬 開始動畫: ${type}, ${startValue} → ${targetValue}, ${duration}s`);
    }
    
    /**
     * 應用所有調整
     */
    private applyAllAdjustments(): void {
        // 確保已初始化
        if (!this.initialized) {
            this.initialize();
        }
        
        if (!this.sprite) {
            console.warn('⚠️ SpriteColorAdjuster: Sprite 組件不存在');
            return;
        }
        
        // 從原始顏色開始
        let r = this.originalColor.r;
        let g = this.originalColor.g;
        let b = this.originalColor.b;
        let a = this.originalColor.a;
        
        // 1. 應用灰階效果
        if (this._grayscale) {
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = g = b = gray;
        }
        
        // 2. 應用亮度調整
        if (this._brightness !== 0) {
            const brightnessFactor = this._brightness * 255;
            r = Math.max(0, Math.min(255, r + brightnessFactor));
            g = Math.max(0, Math.min(255, g + brightnessFactor));
            b = Math.max(0, Math.min(255, b + brightnessFactor));
        }
        
        // 3. 應用對比度調整
        if (this._contrast !== 0) {
            const contrastFactor = (1 + this._contrast);
            r = Math.max(0, Math.min(255, ((r / 255 - 0.5) * contrastFactor + 0.5) * 255));
            g = Math.max(0, Math.min(255, ((g / 255 - 0.5) * contrastFactor + 0.5) * 255));
            b = Math.max(0, Math.min(255, ((b / 255 - 0.5) * contrastFactor + 0.5) * 255));
        }
        
        // 4. 應用飽和度調整
        if (this._saturation !== 0) {
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            const saturationFactor = 1 + this._saturation;
            r = Math.max(0, Math.min(255, gray + (r - gray) * saturationFactor));
            g = Math.max(0, Math.min(255, gray + (g - gray) * saturationFactor));
            b = Math.max(0, Math.min(255, gray + (b - gray) * saturationFactor));
        }
        
        // 5. 應用色相旋轉
        if (this._hue !== 0) {
            const hsl = this.rgbToHsl(r, g, b);
            hsl.h = (hsl.h + this._hue / 360) % 1;
            const rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;
        }
        
        // 6. 應用顏色疊加
        if (this._tintStrength > 0) {
            const tintR = this._tintColor.r;
            const tintG = this._tintColor.g;
            const tintB = this._tintColor.b;
            
            r = r * (1 - this._tintStrength) + tintR * this._tintStrength;
            g = g * (1 - this._tintStrength) + tintG * this._tintStrength;
            b = b * (1 - this._tintStrength) + tintB * this._tintStrength;
        }
        
        // 應用到 Sprite
        const newColor = new Color(
            Math.round(r),
            Math.round(g),
            Math.round(b),
            Math.round(a)
        );
        
        this.sprite.color = newColor;
        
        console.log('🎨 顏色已更新:', 
            `原始: (${Math.round(this.originalColor.r)}, ${Math.round(this.originalColor.g)}, ${Math.round(this.originalColor.b)})`,
            `→ 新: (${newColor.r}, ${newColor.g}, ${newColor.b})`
        );
    }
    
    /**
     * RGB 轉 HSL
     */
    private rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;
        
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        
        return { h, s, l };
    }
    
    /**
     * HSL 轉 RGB
     */
    private hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    // ==================== 預設效果 ====================
    
    /**
     * 夜間模式效果
     */
    applyNightMode(): void {
        this.setBrightness(-0.4);
        this.setSaturation(-0.3);
        this.setTint(new Color(100, 100, 150, 255), 0.2);
        console.log('🌙 應用夜間模式');
    }
    
    /**
     * 懷舊效果
     */
    applySepia(): void {
        this.setGrayscale(false);
        this.setTint(new Color(255, 240, 200, 255), 0.4);
        this.setContrast(0.1);
        console.log('📷 應用懷舊效果');
    }
    
    /**
     * 高對比黑白效果
     */
    applyHighContrastBW(): void {
        this.setGrayscale(true);
        this.setContrast(0.5);
        console.log('⚫⚪ 應用高對比黑白效果');
    }
    
    /**
     * 鮮豔效果
     */
    applyVibrant(): void {
        this.setSaturation(0.5);
        this.setContrast(0.2);
        this.setBrightness(0.1);
        console.log('✨ 應用鮮豔效果');
    }
}
