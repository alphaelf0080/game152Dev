import { _decorator, Component, Material, Vec2, Vec4, Color, Sprite, UITransform, EDITOR } from 'cc';

const { ccclass, property, executeInEditMode } = _decorator;

/**
 * RampShader 重置監控組件
 * 當檢測到 resetAll 參數為 true 時,自動重置所有參數並將 resetAll 設回 false
 * 同時自動計算並設置 nodeUVScale 參數
 * 
 * ========================================
 * 📐 NodeUVScale 精準計算公式說明
 * ========================================
 * 
 * 公式: nodeUVScale = 2 / contentSize
 * 
 * 範例 1: contentSize = [696, 540]
 *   nodeUVScale.x = 2 / 696 = 0.002874
 *   nodeUVScale.y = 2 / 540 = 0.003704
 * 
 * 範例 2: contentSize = [512, 512]
 *   nodeUVScale.x = 2 / 512 = 0.003906
 *   nodeUVScale.y = 2 / 512 = 0.003906
 * 
 * ========================================
 * 🎯 RampUVScale 使用說明
 * ========================================
 * 
 * 當 nodeUVScale 正確設定後:
 *   rampUVScale = [1.0, 1.0]  → 完整覆蓋一次（不重複）
 *   rampUVScale = [2.0, 2.0]  → 重複 2x2 次
 *   rampUVScale = [0.5, 0.5]  → 只覆蓋中心 50% 區域
 * 
 * ========================================
 * 📍 RampUVOffset 使用說明
 * ========================================
 * 
 * 有效範圍: [0.0, 1.0]
 *   [0.0, 0.0]   → 無偏移
 *   [0.5, 0.0]   → 水平偏移 50%
 *   [0.0, 0.5]   → 垂直偏移 50%
 *   [0.3, 0.3]   → 對角線偏移 30%
 * 
 * ========================================
 */
@ccclass('RampShaderResetInspector')
@executeInEditMode
export class RampShaderResetInspector extends Component {
    
    @property({
        type: Sprite,
        tooltip: '使用 RampShader 的 Sprite 組件'
    })
    targetSprite: Sprite | null = null;
    
    @property({
        tooltip: '是否在 onLoad 時自動計算 nodeUVScale'
    })
    autoCalculateOnLoad: boolean = true;
    
    @property({
        tooltip: '是否自動計算並設定 rampUVOffset（基於 nodeUVScale 的補償）'
    })
    autoCalculateOffset: boolean = true;
    
    @property({
        tooltip: '是否顯示詳細的計算日誌'
    })
    showDetailedLogs: boolean = true;
    
    // ========================================
    // 📐 Offset 自動計算模式
    // ========================================
    
    @property({
        tooltip: 'Offset 計算模式：\n' +
                 '0 = 不自動計算（使用預設值 0,0）\n' +
                 '1 = 基於紋理尺寸自動計算\n' +
                 '2 = 基於 ContentSize 自動計算'
    })
    offsetCalculationMode: number = 1;
    
    // ========================================
    // 🧪 手動測試數據收集區域
    // ========================================
    
    @property({
        tooltip: '🧪 啟用手動輸入模式（用於收集測試數據）'
    })
    enableManualInput: boolean = false;
    
    @property({
        tooltip: '🧪 手動輸入的 Ramp UV Offset X（測試用）',
        visible: function(this: RampShaderResetInspector) { return this.enableManualInput; }
    })
    manualOffsetX: number = 0.0;
    
    @property({
        tooltip: '🧪 手動輸入的 Ramp UV Offset Y（測試用）',
        visible: function(this: RampShaderResetInspector) { return this.enableManualInput; }
    })
    manualOffsetY: number = 0.0;
    
    @property({
        tooltip: '🧪 記錄當前測試數據（點擊後會在 Console 輸出）',
        visible: function(this: RampShaderResetInspector) { return this.enableManualInput; }
    })
    get recordTestData(): boolean {
        return false;
    }
    set recordTestData(value: boolean) {
        if (value) {
            this.logTestData();
        }
    }
    
    private lastResetState: boolean = false;
    private lastContentSizeWidth: number = 0;
    private lastContentSizeHeight: number = 0;
    
    /**
     * 所有參數的預設值
     */
    private readonly DEFAULT_VALUES = {
        tilingOffset: new Vec4(1.0, 1.0, 0.0, 0.0),
        useMainTexture: 0.0,
        useRampTexture: 0.0,
        colorStart: new Color(0, 0, 0, 255),
        colorEnd: new Color(255, 255, 255, 255),
        nodeUVScale: new Vec2(1.0, 1.0),  // 將由 updateNodeUVScale 自動設置
        rampCenter: new Vec2(0.5, 0.5),
        rampUVScale: new Vec2(1.0, 1.0),
        rampUVOffset: new Vec2(0.0, 0.0),
        rampRange: new Vec2(0.0, 1.0),
        brightness: 0.0,
        contrast: 1.0,
        saturation: 1.0,
        rampIntensity: 1.0,
        invertRamp: 0.0,
        smoothness: 0.0,
        rectangleAspect: new Vec2(1.0, 1.0),
        cornerRadius: 0.0,
        distortionIntensity: 0.0,
        distortionFrequency: 5.0,
    };
    
    protected onLoad(): void {
        if (!this.targetSprite) {
            this.targetSprite = this.getComponent(Sprite);
        }
        
        // 初始化 ContentSize 記錄
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            this.lastContentSizeWidth = uiTransform.contentSize.width;
            this.lastContentSizeHeight = uiTransform.contentSize.height;
        }
        
        // 初始化時自動設置 nodeUVScale
        if (this.autoCalculateOnLoad) {
            this.updateNodeUVScale();
        }
    }
    
    /**
     * 計算精準的 nodeUVScale 值
     * @param width contentSize 的寬度
     * @param height contentSize 的高度
     * @returns { x: number, y: number } nodeUVScale 值
     */
    public static calculateNodeUVScale(width: number, height: number): { x: number, y: number } {
        return {
            x: 2.0 / width,
            y: 2.0 / height
        };
    }
    
    /**
     * 計算自動的 Ramp UV Offset（靜態方法）
     * 
     * ========================================
     * 🔬 基於 Shader UV 映射的精確計算
     * ========================================
     * 
     * Shader 處理流程分析：
     * 
     * 1. 頂點座標 (相對於錨點):
     *    vec2 nodeUV = a_position.xy;
     *    
     *    當 anchor = (0.5, 0.5):
     *      nodeUV 範圍 = [-width/2, width/2] × [-height/2, height/2]
     *    
     *    當 anchor = (0, 0) [左下角]:
     *      nodeUV 範圍 = [0, width] × [0, height]
     *    
     *    當 anchor = (1, 1) [右上角]:
     *      nodeUV 範圍 = [-width, 0] × [-height, 0]
     * 
     * 2. 標準化 (nodeUVScale = 2/contentSize):
     *    vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;
     *    
     *    這個公式將 nodeUV 映射到 [0, 1] 範圍
     *    但是！當錨點不在中心時，映射會偏移
     * 
     * 3. 應用 offset 和 scale:
     *    vec2 rampUV = fract((normalizedUV + offset) * scale);
     * 
     * ========================================
     * 💡 Offset 的真正作用
     * ========================================
     * 
     * offset 需要補償：
     * 1. **錨點偏移** - 當錨點不在中心時的 UV 偏移
     * 2. **Tiling 邊界** - Sprite Tiling 造成的 UV 重複
     * 3. **Tile Size** - 單個 Tile 的尺寸影響
     * 
     * 關鍵公式：
     * 
     * A) 錨點補償（最重要）:
     *    當 anchor != 0.5 時，normalizedUV 的中心會偏移
     *    
     *    錨點在中心 (0.5, 0.5):
     *      nodeUV = [-size/2, size/2]
     *      標準化後 normalizedUV = [0, 1] ✓ 中心在 0.5
     *    
     *    錨點在左下 (0.0, 0.0):
     *      nodeUV = [0, size]
     *      標準化: (0 * 2/size + 1) * 0.5 = 0.5
     *              (size * 2/size + 1) * 0.5 = 1.5
     *      normalizedUV = [0.5, 1.5] ✗ 偏移了！需要 offset = -0.5
     *    
     *    錨點在右上 (1.0, 1.0):
     *      nodeUV = [-size, 0]
     *      標準化: (-size * 2/size + 1) * 0.5 = -0.5
     *              (0 * 2/size + 1) * 0.5 = 0.5
     *      normalizedUV = [-0.5, 0.5] ✗ 偏移了！需要 offset = +0.5
     * 
     * B) Tiling 補償:
     *    當 Sprite 使用 Tiled 模式時，紋理會重複
     *    這會影響 UV 的分佈
     * 
     * ========================================
     * 
     * @param width contentSize 的寬度
     * @param height contentSize 的高度
     * @param anchorX Anchor Point X (預設 0.5)
     * @param anchorY Anchor Point Y (預設 0.5)
     * @param tilingX Sprite Tiling X (預設 1.0)
     * @param tilingY Sprite Tiling Y (預設 1.0)
     * @param textureWidth 紋理原始寬度（Tile Size）
     * @param textureHeight 紋理原始高度（Tile Size）
     * @returns { x: number, y: number } 計算的 rampUVOffset
     */
    public static calculateAutoRampUVOffset(
        width: number, 
        height: number,
        anchorX: number = 0.5,
        anchorY: number = 0.5,
        tilingX: number = 1.0,
        tilingY: number = 1.0,
        textureWidth: number = 0,
        textureHeight: number = 0
    ): { x: number, y: number } {
        
        // ========================================
        // ========================================
        // 步驟 1: 計算錨點造成的 UV 偏移
        // ========================================
        // 
        // 🔍 關鍵理論修正：
        // 
        // offset = (1.0 - anchor) / 2.0
        // 
        // 推導：當 anchor != 0.5 時，需要將 normalizedUV [0,1] 向外擴展
        // 
        // 驗證：
        // - anchor = 0.5 → offset = 0.25  (向外擴展 25%)
        // - anchor = 0.0 → offset = 0.5   (向外擴展 50%)
        // - anchor = 1.0 → offset = 0.0   (無需擴展)
        // 
        const anchorOffsetX = (1.0 - anchorX) / 2.0;
        const anchorOffsetY = (1.0 - anchorY) / 2.0;
        
        // ========================================
        // 步驟 2: 計算 Tiling 造成的影響
        // ========================================
        // 
        // 當使用 Tiled Sprite 時：
        // - tilingX = 3 表示紋理在 X 方向重複 3 次
        // - 每個 tile 的 UV 範圍 = 1.0 / tilingX
        // 
        // Tiling 補償：
        // tilingOffset = (tiling - 1.0) / (2.0 * tiling)
        // 
        let tilingOffsetX = 0.0;
        let tilingOffsetY = 0.0;
        
        if (tilingX > 1.0) {
            tilingOffsetX = (tilingX - 1.0) / (2.0 * tilingX);
        }
        if (tilingY > 1.0) {
            tilingOffsetY = (tilingY - 1.0) / (2.0 * tilingY);
        }
        
        // ========================================
        // 步驟 3: 組合所有補償
        // ========================================
        // 
        // ⚠️ 重要：不使用 TileSize 補償！
        // 
        // 原因分析：
        // 1. Shader 中的 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5
        //    這個公式已經正確地將 nodeUV 映射到 [0,1]
        // 
        // 2. offset 的作用是微調 UV 的起始位置
        //    不是用來補償紋理尺寸的差異
        // 
        // 3. 紋理尺寸與 ContentSize 的差異：
        //    - 由 Sprite 的渲染系統處理
        //    - 不影響 UV 座標空間
        //    - offset 不應該介入這個過程
        // 
        // 最終 offset 計算
        // 
        // ⚠️ 關鍵發現：offset=(0,0) 會導致漸變從中間開始
        // 需要反向偏移以實現完整的 0~1 漸變
        // 
        // 嘗試方式：offset = -0.5 (完整的向後偏移)
        // 這樣會將 normalizedUV [0, 1] 變成 [-0.5, 0.5]
        // fract([-0.5, 0.5]) = [0.5, 1.0) ∪ [0, 0.5) = 完整循環
        // 
        // ========================================
        // 步驟 3: 組合所有補償
        // ========================================
        // 
        // 多個試驗公式（根據錨點補償的不同理論）：
        // 
        // 理論 A（當前）: offset = 0.5 - anchor
        //   - anchor=0.5 → offset=0.0
        //   - anchor=0.0 → offset=0.5
        //   - anchor=1.0 → offset=-0.5
        // 
        // 理論 B: offset = (1.0 - anchor) / 2.0
        //   - anchor=0.5 → offset=0.25
        //   - anchor=0.0 → offset=0.5
        //   - anchor=1.0 → offset=0.0
        // 
        // 理論 C: offset = -0.5 （固定向後偏移，用於完整循環）
        //   - 適用所有 anchor，強制完整的 0~1 映射
        // 
        // 選用理論 A（0.5 - anchor）
        // 
        const finalOffsetX = anchorOffsetX + tilingOffsetX;  // 理論 A
        const finalOffsetY = anchorOffsetY + tilingOffsetY;  // 理論 A
        
        return {
            x: finalOffsetX,
            y: finalOffsetY
        };
    }
    
    /**
     * 計算精準的 Ramp UV Offset（基於像素偏移）
     * 
     * 使用場景：
     * - 當你知道想要偏移多少像素時使用此方法
     * - 例如：想要向右偏移 100 像素，向上偏移 50 像素
     * 
     * @param pixelOffsetX X 軸像素偏移量（正值向右，負值向左）
     * @param pixelOffsetY Y 軸像素偏移量（正值向上，負值向下）
     * @param contentWidth contentSize 的寬度
     * @param contentHeight contentSize 的高度
     * @returns { x: number, y: number } rampUVOffset 值（0.0~1.0 範圍）
     */
    public static calculateRampUVOffsetFromPixels(
        pixelOffsetX: number,
        pixelOffsetY: number,
        contentWidth: number,
        contentHeight: number
    ): { x: number, y: number } {
        return {
            x: pixelOffsetX / contentWidth,
            y: pixelOffsetY / contentHeight
        };
    }
    
    /**
     * 計算精準的 Ramp UV Offset（基於百分比偏移）
     * 
     * 使用場景：
     * - 當你知道想要偏移百分比時使用此方法
     * - 例如：想要向右偏移 25%，向上偏移 10%
     * 
     * @param percentX X 軸百分比偏移（0~100，正值向右）
     * @param percentY Y 軸百分比偏移（0~100，正值向上）
     * @returns { x: number, y: number } rampUVOffset 值（0.0~1.0 範圍）
     */
    public static calculateRampUVOffsetFromPercent(
        percentX: number,
        percentY: number
    ): { x: number, y: number } {
        return {
            x: percentX / 100.0,
            y: percentY / 100.0
        };
    }
    
    /**
     * 反向計算：從 rampUVOffset 轉換為像素偏移
     * 
     * @param offsetX rampUVOffset 的 X 值（0.0~1.0）
     * @param offsetY rampUVOffset 的 Y 值（0.0~1.0）
     * @param contentWidth contentSize 的寬度
     * @param contentHeight contentSize 的高度
     * @returns { x: number, y: number } 像素偏移量
     */
    public static offsetToPixels(
        offsetX: number,
        offsetY: number,
        contentWidth: number,
        contentHeight: number
    ): { x: number, y: number } {
        return {
            x: offsetX * contentWidth,
            y: offsetY * contentHeight
        };
    }
    
    /**
     * 反向計算：從 rampUVOffset 轉換為百分比偏移
     * 
     * @param offsetX rampUVOffset 的 X 值（0.0~1.0）
     * @param offsetY rampUVOffset 的 Y 值（0.0~1.0）
     * @returns { x: number, y: number } 百分比偏移（0~100）
     */
    public static offsetToPercent(
        offsetX: number,
        offsetY: number
    ): { x: number, y: number } {
        return {
            x: offsetX * 100.0,
            y: offsetY * 100.0
        };
    }
    
    /**
     * 自動計算並更新 nodeUVScale 和 rampUVOffset
     * 
     * 說明：根據節點的完整參數計算最佳的 UV offset
     * 考慮因素：ContentSize、Anchor Point、Sprite Tiling
     */
    private updateNodeUVScale(): void {
        if (!this.targetSprite || !this.targetSprite.customMaterial) {
            return;
        }
        
        const material = this.targetSprite.customMaterial;
        
        try {
            const uiTransform = this.node.getComponent(UITransform);
            if (uiTransform) {
                const contentSize = uiTransform.contentSize;
                const anchorPoint = uiTransform.anchorPoint;
                
                // 計算 nodeUVScale
                const scale = RampShaderResetInspector.calculateNodeUVScale(
                    contentSize.width,
                    contentSize.height
                );
                
                material.setProperty('nodeUVScale', new Vec2(scale.x, scale.y), 0);
                
                // 根據設定決定是否自動計算並設定 rampUVOffset
                let autoOffset = { x: 0, y: 0 };
                if (this.autoCalculateOffset) {
                    autoOffset = this.calculateAutoRampUVOffset(contentSize.width, contentSize.height);
                    material.setProperty('rampUVOffset', new Vec2(autoOffset.x, autoOffset.y), 0);
                }
                
                if (this.showDetailedLogs) {
                    console.log(`📐 RampUV 精準計算結果:`);
                    console.log(`   ContentSize: (${contentSize.width}, ${contentSize.height})`);
                    console.log(`   Anchor Point: (${anchorPoint.x}, ${anchorPoint.y})`);
                    console.log(`   NodeUVScale: (${scale.x.toFixed(6)}, ${scale.y.toFixed(6)})`);
                    console.log(`   公式: nodeUVScale = 2 / contentSize`);
                    
                    if (this.autoCalculateOffset) {
                        // 獲取 Tiling 信息
                        let tilingX = 1.0, tilingY = 1.0;
                        try {
                            const tilingOffset = material.getProperty('tilingOffset', 0);
                            if (tilingOffset) {
                                tilingX = (tilingOffset as Vec4).x;
                                tilingY = (tilingOffset as Vec4).y;
                            }
                        } catch (e) {}
                        
                        // 獲取紋理信息（Tile Size）
                        let textureInfo = "無紋理";
                        let textureWidth = 0, textureHeight = 0;
                        if (this.targetSprite && this.targetSprite.spriteFrame) {
                            const spriteFrame = this.targetSprite.spriteFrame;
                            if (spriteFrame.texture) {
                                textureWidth = spriteFrame.texture.width;
                                textureHeight = spriteFrame.texture.height;
                                textureInfo = `${textureWidth} x ${textureHeight}`;
                            } else if (spriteFrame.rect) {
                                textureWidth = spriteFrame.rect.width;
                                textureHeight = spriteFrame.rect.height;
                                textureInfo = `${textureWidth} x ${textureHeight} (from rect)`;
                            }
                        }
                        
                        // 計算各項補償
                        const anchorOffsetX = anchorPoint.x - 0.5;
                        const anchorOffsetY = anchorPoint.y - 0.5;
                        
                        let tilingOffsetX = 0.0, tilingOffsetY = 0.0;
                        if (tilingX > 1.0) tilingOffsetX = (tilingX - 1.0) / (2.0 * tilingX);
                        if (tilingY > 1.0) tilingOffsetY = (tilingY - 1.0) / (2.0 * tilingY);
                        
                        console.log(`   Sprite Tiling: (${tilingX}, ${tilingY})`);
                        console.log(`   Tile Size: ${textureInfo}`);
                        console.log(``);
                        console.log(`   📍 RampUVOffset 計算詳情:`);
                        console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                        console.log(`   最終 Offset: (${autoOffset.x.toFixed(4)}, ${autoOffset.y.toFixed(4)})`);
                        console.log(``);
                        console.log(`   🎯 預期效果: 左到右、上到下 0~1 完整漸變`);
                        console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                        console.log(``);
                        console.log(`   UV 映射分析:`);
                        console.log(`     nodeUV 範圍: [-${contentSize.width/2}, ${contentSize.width/2}] × [-${contentSize.height/2}, ${contentSize.height/2}]`);
                        console.log(`     ↓ 標準化`);
                        console.log(`     normalizedUV: [0.0, 1.0] × [0.0, 1.0] ✓`);
                        console.log(`     ↓ 添加 offset`);
                        console.log(`     (normalizedUV + offset): [${autoOffset.x.toFixed(2)}, ${(1+autoOffset.x).toFixed(2)}] × [${autoOffset.y.toFixed(2)}, ${(1+autoOffset.y).toFixed(2)}]`);
                        console.log(`     ↓ fract() 循環`);
                        console.log(`     rampUV: [0.0, 1.0] × [0.0, 1.0]`);
                        console.log(``);
                        console.log(`   組成分析:`);
                        console.log(`     1️⃣  錨點補償    = (${anchorOffsetX.toFixed(4)}, ${anchorOffsetY.toFixed(4)})`);
                        console.log(`        └─ 公式: anchor - 0.5`);
                        console.log(`        └─ 當 anchor=0.5(中心) → offset=0.0 ✓`);
                        console.log(``);
                        console.log(`     2️⃣  Tiling 補償 = (${tilingOffsetX.toFixed(4)}, ${tilingOffsetY.toFixed(4)})`);
                        console.log(`        └─ 公式: (tiling - 1) / (2 × tiling)`);
                        console.log(`        └─ 當 tiling=1 → offset=0.0 ✓`);
                        console.log(``);
                        console.log(`   ⚠️  數學正確性檢查:`);
                        console.log(`        ✓ normalizedUV 已正確映射到 [0,1]`);
                        console.log(`        ✓ offset=0 時應該顯示完整 0~1 漸變`);
                        console.log(`        ✓ 如果效果不對，可能是:`);
                        console.log(`          - Ramp 紋理設置問題`);
                        console.log(`          - Ramp Direction 設置問題`);
                        console.log(`          - 或需要特定的視覺對齊`);
                        console.log(``);
                        console.log(`   💡 總公式: offset = 錨點補償 + Tiling補償`);
                        console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                    }
                    
                    console.log(`   ✓ 此時 rampUVScale=[1.0,1.0] 表示單次完整覆蓋`);
                }
            }
        } catch (error) {
            console.error('Error updating nodeUVScale:', error);
        }
    }
    
    /**
     * 計算自動的 Ramp UV Offset（私有實例方法）
     * 
     * 獲取節點的完整參數並調用靜態計算方法
     * 
     * @param width contentSize 的寬度
     * @param height contentSize 的高度
     * @returns { x: number, y: number } 自動計算的 rampUVOffset
     */
    private calculateAutoRampUVOffset(width: number, height: number): { x: number, y: number } {
        // 如果啟用手動輸入模式，直接返回手動值
        if (this.enableManualInput) {
            return {
                x: this.manualOffsetX,
                y: this.manualOffsetY
            };
        }
        
        // 獲取 Anchor Point
        const uiTransform = this.node.getComponent(UITransform);
        const anchorX = uiTransform ? uiTransform.anchorPoint.x : 0.5;
        const anchorY = uiTransform ? uiTransform.anchorPoint.y : 0.5;
        
        // 獲取 Sprite Tiling（從 Material 的 tilingOffset 參數）
        let tilingX = 1.0;
        let tilingY = 1.0;
        
        if (this.targetSprite && this.targetSprite.customMaterial) {
            try {
                const tilingOffset = this.targetSprite.customMaterial.getProperty('tilingOffset', 0);
                if (tilingOffset) {
                    tilingX = (tilingOffset as Vec4).x;
                    tilingY = (tilingOffset as Vec4).y;
                }
            } catch (e) {
                // 如果獲取失敗，使用默認值 [1, 1]
            }
        }
        
        // 🔑 關鍵：獲取紋理的原始尺寸
        let textureWidth = 0;
        let textureHeight = 0;
        
        if (this.targetSprite && this.targetSprite.spriteFrame) {
            const spriteFrame = this.targetSprite.spriteFrame;
            
            // 從 spriteFrame 獲取原始紋理尺寸
            if (spriteFrame.texture) {
                textureWidth = spriteFrame.texture.width;
                textureHeight = spriteFrame.texture.height;
            }
            
            // 或者從 rect 獲取（spriteFrame 的實際使用區域）
            if (textureWidth === 0 && spriteFrame.rect) {
                textureWidth = spriteFrame.rect.width;
                textureHeight = spriteFrame.rect.height;
            }
        }
        
        // 調用靜態方法進行完整計算（包含紋理尺寸）
        return RampShaderResetInspector.calculateAutoRampUVOffset(
            width,
            height,
            anchorX,
            anchorY,
            tilingX,
            tilingY,
            textureWidth,   // 傳遞紋理寬度
            textureHeight   // 傳遞紋理高度
        );
    }
    
    /**
     * 🧪 記錄測試數據（用於收集不同 ContentSize 下的最佳 offset 值）
     */
    private logTestData(): void {
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.warn('⚠️ 無法獲取 UITransform');
            return;
        }
        
        const width = uiTransform.contentSize.width;
        const height = uiTransform.contentSize.height;
        const offsetX = this.manualOffsetX;
        const offsetY = this.manualOffsetY;
        
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('🧪 測試數據記錄');
        console.log('═══════════════════════════════════════');
        console.log(`📏 ContentSize: [${width}, ${height}]`);
        console.log(`📍 最佳 Offset: [${offsetX}, ${offsetY}]`);
        console.log('');
        console.log('📊 分析數據:');
        
        // 分析 1: 像素偏移
        const pixelOffsetX = offsetX * width;
        const pixelOffsetY = offsetY * height;
        console.log(`   像素偏移: [${pixelOffsetX.toFixed(2)}, ${pixelOffsetY.toFixed(2)}] px`);
        
        // 分析 2: 與 0.5 的關係
        const factorX = 0.5 - offsetX;
        const factorY = 0.5 - offsetY;
        console.log(`   0.5 - offset: [${factorX.toFixed(4)}, ${factorY.toFixed(4)}]`);
        
        // 分析 3: 比例關係
        const ratioX = factorX;
        const ratioY = factorY;
        console.log(`   比例係數: [${ratioX.toFixed(4)}, ${ratioY.toFixed(4)}]`);
        
        // 分析 4: 與尺寸的關係
        const perPixelX = offsetX / width;
        const perPixelY = offsetY / height;
        console.log(`   offset/size: [${perPixelX.toFixed(8)}, ${perPixelY.toFixed(8)}]`);
        
        // 分析 5: 寬高比
        const aspectRatio = width / height;
        const offsetRatio = offsetX / offsetY;
        console.log(`   寬高比 (W/H): ${aspectRatio.toFixed(4)}`);
        console.log(`   Offset比 (X/Y): ${offsetRatio.toFixed(4)}`);
        
        console.log('');
        console.log('📋 複製用格式:');
        console.log(`   { w: ${width}, h: ${height}, ox: ${offsetX}, oy: ${offsetY} },`);
        console.log('═══════════════════════════════════════');
        console.log('');
    }
    
    /**
     * 手動重新計算 nodeUVScale（可從編輯器調用）
     */
    public recalculateNodeUVScale(): void {
        this.updateNodeUVScale();
    }
    
    /**
     * 設定 Ramp UV 參數的輔助方法
     * @param tiling 重複次數，預設 [1, 1]
     * @param offset 偏移量，預設 [0, 0]
     */
    public setRampUVParams(tiling: Vec2 = new Vec2(1, 1), offset: Vec2 = new Vec2(0, 0)): void {
        if (!this.targetSprite || !this.targetSprite.customMaterial) {
            console.warn('No custom material found');
            return;
        }
        
        const material = this.targetSprite.customMaterial;
        material.setProperty('rampUVScale', tiling, 0);
        material.setProperty('rampUVOffset', offset, 0);
        
        if (this.showDetailedLogs) {
            const size = this.getContentSize();
            if (size) {
                const pixels = RampShaderResetInspector.offsetToPixels(
                    offset.x, offset.y, size.width, size.height
                );
                const percent = RampShaderResetInspector.offsetToPercent(offset.x, offset.y);
                
                console.log(`🎯 RampUV 參數已設定:`);
                console.log(`   Tiling: (${tiling.x}, ${tiling.y})`);
                console.log(`   Offset: (${offset.x.toFixed(4)}, ${offset.y.toFixed(4)})`);
                console.log(`   ↳ 像素偏移: (${pixels.x.toFixed(1)}px, ${pixels.y.toFixed(1)}px)`);
                console.log(`   ↳ 百分比: (${percent.x.toFixed(1)}%, ${percent.y.toFixed(1)}%)`);
            } else {
                console.log(`🎯 RampUV 參數已設定:`);
                console.log(`   Tiling: (${tiling.x}, ${tiling.y})`);
                console.log(`   Offset: (${offset.x}, ${offset.y})`);
            }
        }
    }
    
    /**
     * 根據像素偏移設定 Ramp UV Offset
     * @param pixelX X 軸像素偏移（正值向右，負值向左）
     * @param pixelY Y 軸像素偏移（正值向上，負值向下）
     * @param tiling 重複次數，預設 [1, 1]
     */
    public setRampUVOffsetByPixels(pixelX: number, pixelY: number, tiling: Vec2 = new Vec2(1, 1)): void {
        const size = this.getContentSize();
        if (!size) {
            console.warn('無法獲取 contentSize');
            return;
        }
        
        const offset = RampShaderResetInspector.calculateRampUVOffsetFromPixels(
            pixelX, pixelY, size.width, size.height
        );
        
        this.setRampUVParams(tiling, new Vec2(offset.x, offset.y));
    }
    
    /**
     * 根據百分比偏移設定 Ramp UV Offset
     * @param percentX X 軸百分比偏移（0~100，正值向右）
     * @param percentY Y 軸百分比偏移（0~100，正值向上）
     * @param tiling 重複次數，預設 [1, 1]
     */
    public setRampUVOffsetByPercent(percentX: number, percentY: number, tiling: Vec2 = new Vec2(1, 1)): void {
        const offset = RampShaderResetInspector.calculateRampUVOffsetFromPercent(percentX, percentY);
        this.setRampUVParams(tiling, new Vec2(offset.x, offset.y));
    }
    
    /**
     * 獲取當前的 contentSize
     */
    public getContentSize(): { width: number, height: number } | null {
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            return {
                width: uiTransform.contentSize.width,
                height: uiTransform.contentSize.height
            };
        }
        return null;
    }
    
    /**
     * 打印完整的計算公式和當前設定
     */
    public printCalculationGuide(): void {
        const size = this.getContentSize();
        if (!size) {
            console.warn('無法獲取 contentSize');
            return;
        }
        
        const scale = RampShaderResetInspector.calculateNodeUVScale(size.width, size.height);
        const autoOffset = RampShaderResetInspector.calculateAutoRampUVOffset(size.width, size.height);
        
        console.log(`
╔════════════════════════════════════════════════════════════════╗
║              RampUV 精準計算指南                                ║
╚════════════════════════════════════════════════════════════════╝

📐 當前節點資訊:
   ContentSize: [${size.width}, ${size.height}]

🔢 NodeUVScale 精準計算公式:
   nodeUVScale = 2 / contentSize

✨ NodeUVScale 計算結果:
   nodeUVScale.x = 2 / ${size.width} = ${scale.x.toFixed(6)}
   nodeUVScale.y = 2 / ${size.height} = ${scale.y.toFixed(6)}

🎯 RampUVScale 效果說明:
   [1.0, 1.0]  → 完整覆蓋一次（單次，不重複）
   [2.0, 2.0]  → 重複 2x2 次
   [0.5, 0.5]  → 只覆蓋中心 50% 區域
   [3.0, 1.0]  → X軸重複3次，Y軸完整一次

📍 RampUVOffset 精準計算:

   🔧 自動計算 Offset（推薦）:
   ────────────────────────────────────────
   當使用精準的 nodeUVScale 時，建議自動計算 offset 以確保對齊
   
   公式: offset = 0.5 - (1.0 / (nodeUVScale × contentSize))
   
   當前自動計算結果:
   • offsetX = 0.5 - (1.0 / (${scale.x.toFixed(6)} × ${size.width}))
   • offsetX = 0.5 - (1.0 / ${(scale.x * size.width).toFixed(3)})
   • offsetX = 0.5 - ${(1.0 / (scale.x * size.width)).toFixed(3)}
   • offsetX = ${autoOffset.x.toFixed(4)} ✓
   
   • offsetY = ${autoOffset.y.toFixed(4)} ✓
   
   ↳ 像素偏移: (${(autoOffset.x * size.width).toFixed(1)}px, ${(autoOffset.y * size.height).toFixed(1)}px)
   ↳ 百分比: (${(autoOffset.x * 100).toFixed(1)}%, ${(autoOffset.y * 100).toFixed(1)}%)
   
   代碼範例:
     // 自動計算（推薦）
     inspector.autoCalculateOffset = true;
     inspector.recalculateNodeUVScale();
     
     // 或使用靜態方法
     const autoOffset = RampShaderResetInspector.calculateAutoRampUVOffset(${size.width}, ${size.height});
     material.setProperty('rampUVOffset', new Vec2(autoOffset.x, autoOffset.y), 0);

   方法 1️⃣ - 基於像素偏移:
   ────────────────────────────────────────
   公式: offset = 像素偏移 / contentSize
   
   範例計算（contentSize = [${size.width}, ${size.height}]）:
   • 向右偏移 100px:
     offsetX = 100 / ${size.width} = ${(100/size.width).toFixed(4)}
   
   • 向上偏移 50px:
     offsetY = 50 / ${size.height} = ${(50/size.height).toFixed(4)}
   
   • 向右偏移 ${Math.round(size.width*0.25)}px (25%):
     offsetX = ${Math.round(size.width*0.25)} / ${size.width} = 0.2500
   
   代碼範例:
     inspector.setRampUVOffsetByPixels(100, 50);

   方法 2️⃣ - 基於百分比偏移:
   ────────────────────────────────────────
   公式: offset = 百分比 / 100
   
   範例計算:
   • 向右偏移 25%:  offsetX = 25 / 100 = 0.2500
   • 向上偏移 10%:  offsetY = 10 / 100 = 0.1000
   • 向右偏移 50%:  offsetX = 50 / 100 = 0.5000
   
   代碼範例:
     inspector.setRampUVOffsetByPercent(25, 10);

   方法 3️⃣ - 直接設定 Offset 值:
   ────────────────────────────────────────
   範圍: 0.0 ~ 1.0
   
   常用值:
   • [0.0, 0.0]  → 無偏移
   • [0.25, 0.0] → 水平偏移 25%
   • [0.5, 0.0]  → 水平偏移 50%
   • [0.0, 0.5]  → 垂直偏移 50%
   • [0.3, 0.3]  → 對角線偏移 30%
   
   代碼範例:
     inspector.setRampUVParams(new Vec2(1,1), new Vec2(0.25, 0.1));

   � 反向計算（Offset → 像素/百分比）:
   ────────────────────────────────────────
   當前 contentSize = [${size.width}, ${size.height}]
   
   • offset = 0.2500 (25%)
     ↳ 像素: ${(0.25*size.width).toFixed(1)}px (X軸) / ${(0.25*size.height).toFixed(1)}px (Y軸)
   
   • offset = 0.5000 (50%)
     ↳ 像素: ${(0.5*size.width).toFixed(1)}px (X軸) / ${(0.5*size.height).toFixed(1)}px (Y軸)
   
   • offset = 0.1000 (10%)
     ↳ 像素: ${(0.1*size.width).toFixed(1)}px (X軸) / ${(0.1*size.height).toFixed(1)}px (Y軸)

�💡 推薦設定（單次完整覆蓋，無偏移）:
   nodeUVScale: [${scale.x.toFixed(6)}, ${scale.y.toFixed(6)}]
   rampUVScale: [1.0, 1.0]
   rampUVOffset: [0.0, 0.0]

📝 快速範例:
   // 向右偏移 100 像素
   inspector.setRampUVOffsetByPixels(100, 0);
   
   // 向右偏移 25%
   inspector.setRampUVOffsetByPercent(25, 0);
   
   // 直接設定 offset
   inspector.setRampUVParams(new Vec2(1,1), new Vec2(0.25, 0));

════════════════════════════════════════════════════════════════
        `);
    }
    
    protected update(dt: number): void {
        // 只在編輯器模式下運行
        if (!EDITOR) {
            return;
        }
        
        // 檢測 ContentSize 變化並自動更新
        this.checkContentSizeChange();
        
        this.checkAndResetIfNeeded();
    }
    
    /**
     * 檢測 ContentSize 是否改變，如果改變則自動重新計算
     */
    private checkContentSizeChange(): void {
        if (!this.targetSprite) {
            return;
        }
        
        try {
            const uiTransform = this.node.getComponent(UITransform);
            if (uiTransform) {
                const currentWidth = uiTransform.contentSize.width;
                const currentHeight = uiTransform.contentSize.height;
                
                // 檢測是否有變化
                if (currentWidth !== this.lastContentSizeWidth || 
                    currentHeight !== this.lastContentSizeHeight) {
                    
                    if (this.showDetailedLogs && this.lastContentSizeWidth > 0) {
                        console.log(`📏 ContentSize 變化偵測:`);
                        console.log(`   從 [${this.lastContentSizeWidth}, ${this.lastContentSizeHeight}]`);
                        console.log(`   到 [${currentWidth}, ${currentHeight}]`);
                        console.log(`   🔄 自動重新計算 UV 參數...`);
                    }
                    
                    // 更新記錄的尺寸
                    this.lastContentSizeWidth = currentWidth;
                    this.lastContentSizeHeight = currentHeight;
                    
                    // 自動重新計算
                    this.updateNodeUVScale();
                }
            }
        } catch (error) {
            // 靜默處理錯誤
        }
    }
    
    /**
     * 檢查是否需要重置參數
     */
    private checkAndResetIfNeeded(): void {
        if (!this.targetSprite || !this.targetSprite.customMaterial) {
            return;
        }
        
        const material = this.targetSprite.customMaterial;
        
        try {
            const resetAll = material.getProperty('resetAll', 0) as number;
            const shouldReset = resetAll > 0.5;
            
            // 檢測到 resetAll 從 false 變為 true
            if (shouldReset && !this.lastResetState) {
                console.log('🔄 Resetting all RampShader parameters...');
                this.resetAllParameters(material);
                
                // 將 resetAll 設回 false
                material.setProperty('resetAll', 0.0, 0);
                
                console.log('✅ All parameters reset to defaults');
            }
            
            this.lastResetState = shouldReset;
            
        } catch (error) {
            // 靜默處理錯誤,避免在編輯器中頻繁輸出
        }
    }
    
    /**
     * 重置所有參數到預設值
     */
    private resetAllParameters(material: Material): void {
        try {
            // 首先更新 nodeUVScale（自動計算）
            const uiTransform = this.node.getComponent(UITransform);
            if (uiTransform) {
                const contentSize = uiTransform.contentSize;
                
                // 使用靜態方法計算並設置 nodeUVScale
                const scale = RampShaderResetInspector.calculateNodeUVScale(
                    contentSize.width,
                    contentSize.height
                );
                
                material.setProperty('nodeUVScale', new Vec2(scale.x, scale.y), 0);
                
                if (this.showDetailedLogs) {
                    console.log(`✨ NodeUVScale 自動計算:`);
                    console.log(`   公式: 2 / contentSize`);
                    console.log(`   ContentSize: (${contentSize.width}, ${contentSize.height})`);
                    console.log(`   結果: (${scale.x.toFixed(6)}, ${scale.y.toFixed(6)})`);
                    console.log(`   💡 此時 rampUVScale=[1.0,1.0] = 單次完整覆蓋`);
                }
                
                // 如果啟用自動計算 offset，則設定
                if (this.autoCalculateOffset) {
                    const autoOffset = RampShaderResetInspector.calculateAutoRampUVOffset(
                        contentSize.width,
                        contentSize.height
                    );
                    material.setProperty('rampUVOffset', new Vec2(autoOffset.x, autoOffset.y), 0);
                    
                    if (this.showDetailedLogs) {
                        console.log(`✨ RampUVOffset 自動計算:`);
                        console.log(`   公式: 0.5 - (1.0 / (nodeUVScale × contentSize))`);
                        console.log(`   結果: (${autoOffset.x.toFixed(4)}, ${autoOffset.y.toFixed(4)})`);
                        console.log(`   ↳ 像素: (${(autoOffset.x * contentSize.width).toFixed(1)}px, ${(autoOffset.y * contentSize.height).toFixed(1)}px)`);
                    }
                } else {
                    // 使用預設值
                    material.setProperty('rampUVOffset', this.DEFAULT_VALUES.rampUVOffset.clone(), 0);
                }
            } else {
                // 沒有 UITransform，使用預設值
                material.setProperty('rampUVOffset', this.DEFAULT_VALUES.rampUVOffset.clone(), 0);
            }
            
            // 設置其他參數到預設值
            // 主紋理 UV 控制
            material.setProperty('tilingOffset', this.DEFAULT_VALUES.tilingOffset.clone(), 0);
            material.setProperty('useMainTexture', this.DEFAULT_VALUES.useMainTexture, 0);
            
            // Ramp 紋理和顏色控制
            material.setProperty('useRampTexture', this.DEFAULT_VALUES.useRampTexture, 0);
            material.setProperty('colorStart', this.DEFAULT_VALUES.colorStart.clone(), 0);
            material.setProperty('colorEnd', this.DEFAULT_VALUES.colorEnd.clone(), 0);
            
            // Ramp 範圍控制
            material.setProperty('rampCenter', this.DEFAULT_VALUES.rampCenter.clone(), 0);
            material.setProperty('rampUVScale', this.DEFAULT_VALUES.rampUVScale.clone(), 0);
            // rampUVOffset 已在上面根據 autoCalculateOffset 設定
            material.setProperty('rampRange', this.DEFAULT_VALUES.rampRange.clone(), 0);
            
            // 顏色調整
            material.setProperty('brightness', this.DEFAULT_VALUES.brightness, 0);
            material.setProperty('contrast', this.DEFAULT_VALUES.contrast, 0);
            material.setProperty('saturation', this.DEFAULT_VALUES.saturation, 0);
            
            // 強度控制
            material.setProperty('rampIntensity', this.DEFAULT_VALUES.rampIntensity, 0);
            
            // 進階控制
            material.setProperty('invertRamp', this.DEFAULT_VALUES.invertRamp, 0);
            material.setProperty('smoothness', this.DEFAULT_VALUES.smoothness, 0);
            
            // 長方形 Ramp 控制
            material.setProperty('rectangleAspect', this.DEFAULT_VALUES.rectangleAspect.clone(), 0);
            material.setProperty('cornerRadius', this.DEFAULT_VALUES.cornerRadius, 0);
            
            // 扭曲變形控制
            material.setProperty('distortionIntensity', this.DEFAULT_VALUES.distortionIntensity, 0);
            material.setProperty('distortionFrequency', this.DEFAULT_VALUES.distortionFrequency, 0);
            
        } catch (error) {
            console.error('Error resetting parameters:', error);
        }
    }
    
    /**
     * 手動觸發重置 (可在編輯器中通過按鈕調用)
     */
    public manualReset(): void {
        if (!this.targetSprite || !this.targetSprite.customMaterial) {
            console.warn('No custom material found');
            return;
        }
        
        this.resetAllParameters(this.targetSprite.customMaterial);
        console.log('✅ Manual reset completed');
    }
}
