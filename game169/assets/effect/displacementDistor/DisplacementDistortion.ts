import { _decorator, Component, Material, MeshRenderer, Sprite, Vec4, Texture2D, SpriteFrame } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * Displacement Distortion Controller
 * 控制位移扭曲效果的組件
 * 將此組件附加到帶有 MeshRenderer 或 Sprite 的節點上
 */
@ccclass('DisplacementDistortion')
@executeInEditMode
export class DisplacementDistortion extends Component {
    
    @property({ tooltip: '主紋理 (要被扭曲的畫面)' })
    private _mainTexture: Texture2D | null = null;
    
    @property({ type: Texture2D })
    get mainTexture() {
        return this._mainTexture;
    }
    set mainTexture(value: Texture2D | null) {
        this._mainTexture = value;
        this.updateMaterial();
    }
    
    @property({ tooltip: '位移貼圖 (灰階貼圖，用於控制扭曲)' })
    private _displacementMap: Texture2D | null = null;
    
    @property({ type: Texture2D })
    get displacementMap() {
        return this._displacementMap;
    }
    set displacementMap(value: Texture2D | null) {
        this._displacementMap = value;
        this.updateMaterial();
    }
    
    @property({ 
        tooltip: '位移強度',
        range: [0, 1, 0.01],
        slide: true
    })
    private _displacementStrength: number = 0.1;
    
    @property({ 
        type: Number,
        range: [0, 1, 0.01],
        slide: true
    })
    get displacementStrength() {
        return this._displacementStrength;
    }
    set displacementStrength(value: number) {
        this._displacementStrength = value;
        this.updateMaterial();
    }
    
    @property({ tooltip: '位移貼圖縮放' })
    private _displacementScale: number = 1.0;
    
    @property({ type: Number })
    get displacementScale() {
        return this._displacementScale;
    }
    set displacementScale(value: number) {
        this._displacementScale = value;
        this.updateMaterial();
    }
    
    @property({ tooltip: '動畫速度 (設為 0 則靜態)' })
    private _timeSpeed: number = 0.0;
    
    @property({ type: Number })
    get timeSpeed() {
        return this._timeSpeed;
    }
    set timeSpeed(value: number) {
        this._timeSpeed = value;
        this.updateMaterial();
    }
    
    @property({ 
        tooltip: '扭曲類型',
        type: DistortionType
    })
    private _distortionType: DistortionType = DistortionType.XY;
    
    @property({ type: DistortionType })
    get distortionType() {
        return this._distortionType;
    }
    set distortionType(value: DistortionType) {
        this._distortionType = value;
        this.updateMaterial();
    }
    
    @property({ tooltip: '是否自動創建材質' })
    autoCreateMaterial: boolean = true;
    
    private _material: Material | null = null;
    private _meshRenderer: MeshRenderer | null = null;
    private _sprite: Sprite | null = null;
    
    onLoad() {
        this.initComponents();
        if (this.autoCreateMaterial) {
            this.createMaterial();
        }
    }
    
    start() {
        this.updateMaterial();
    }
    
    /**
     * 初始化組件引用
     */
    private initComponents() {
        this._meshRenderer = this.getComponent(MeshRenderer);
        this._sprite = this.getComponent(Sprite);
    }
    
    /**
     * 創建材質
     */
    private createMaterial() {
        // 嘗試從 MeshRenderer 或 Sprite 獲取材質
        if (this._meshRenderer) {
            const existingMaterial = this._meshRenderer.getMaterial(0);
            if (existingMaterial) {
                this._material = existingMaterial;
            }
        } else if (this._sprite) {
            const existingMaterial = this._sprite.getMaterial(0);
            if (existingMaterial) {
                this._material = existingMaterial;
            }
        }
        
        if (!this._material) {
            console.warn('[DisplacementDistortion] 未找到材質，請手動設置 DisplacementDistortion.effect');
        }
    }
    
    /**
     * 更新材質參數
     */
    private updateMaterial() {
        if (!this._material) {
            this.createMaterial();
            if (!this._material) return;
        }
        
        // 設置主紋理
        if (this._mainTexture) {
            this._material.setProperty('mainTexture', this._mainTexture);
        }
        
        // 設置位移貼圖
        if (this._displacementMap) {
            this._material.setProperty('displacementMap', this._displacementMap);
        }
        
        // 設置參數
        const params = new Vec4(
            this._displacementStrength,
            this._displacementScale,
            this._timeSpeed,
            this._distortionType
        );
        this._material.setProperty('displacementParams', params);
    }
    
    /**
     * 運行時動態更新強度
     */
    public setStrength(strength: number) {
        this._displacementStrength = strength;
        this.updateMaterial();
    }
    
    /**
     * 設置位移貼圖
     */
    public setDisplacementMap(texture: Texture2D) {
        this._displacementMap = texture;
        this.updateMaterial();
    }
    
    /**
     * 設置主紋理
     */
    public setMainTexture(texture: Texture2D) {
        this._mainTexture = texture;
        this.updateMaterial();
    }
}

/**
 * 扭曲類型枚舉
 */
export enum DistortionType {
    XY = 0,      // XY 軸都扭曲
    X_Only = 1,  // 只有 X 軸
    Y_Only = 2,  // 只有 Y 軸
    Radial = 3   // 徑向扭曲
}
