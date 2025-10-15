# Sprite Material 消失問題診斷指南

## 🚨 問題現象
Sprite 套用自定義 Material 後變成透明或完全消失

## 🔍 逐步診斷流程

### 步驟 1: 檢查 USE_TEXTURE 設定
**最重要的檢查！**

1. 選擇你的 Material 資產
2. 在 Inspector 面板查找 **USE_TEXTURE** 選項
3. **確保這個選項被勾選 ✅**

```
Material Inspector:
┌─────────────────────────┐
│ [✅] USE_TEXTURE        │  ← 必須勾選！
│ [ ] USE_LOCAL           │
│ [ ] IS_GRAY             │
│ alphaThreshold: 0.5     │
└─────────────────────────┘
```

### 步驟 2: 檢查基本設定
1. **Sprite 組件**：確保設置了有效的 SpriteFrame
2. **Material**：確保 Effect 編譯成功（無紅色錯誤）
3. **Alpha 閾值**：將 `alphaThreshold` 設為 0.0

### 步驟 3: 使用測試 Shader
使用我提供的 `TestVisible.effect` 進行測試：

1. 創建 Material 基於 `TestVisible.effect`
2. **勾選 USE_TEXTURE**
3. 應用到 Sprite
4. 如果仍然不可見，問題可能在別處

### 步驟 4: 檢查 Console 錯誤
查看 Cocos Creator Console 面板：
- Shader 編譯錯誤
- 紋理載入錯誤
- 渲染錯誤

## 🛠️ 常見解決方案

### 解決方案 1: USE_TEXTURE 未勾選
```
症狀：Sprite 完全消失
原因：Shader 沒有讀取 Sprite 的紋理
解決：勾選 Material 的 USE_TEXTURE 選項
```

### 解決方案 2: Alpha 閾值過高
```
症狀：半透明區域消失
原因：alphaThreshold 設置過高導致像素被丟棄
解決：降低 alphaThreshold 值（建議 0.0-0.1）
```

### 解決方案 3: 紋理綁定問題
```
症狀：使用自定義紋理的 Shader 不顯示
原因：紋理綁定點錯誤或缺少 #pragma builtin(local)
解決：
#pragma builtin(local)
layout(set = 2, binding = 12) uniform sampler2D cc_spriteTexture;
```

### 解決方案 4: Blend 模式問題
```
症狀：Sprite 看起來很奇怪或過暗
原因：混合模式設置錯誤
解決：檢查 Material 的混合模式設置
```

### 解決方案 5: 頂點色彩問題
```
症狀：Sprite 變成純黑色
原因：沒有正確應用頂點顏色
解決：確保 Shader 中有 o *= color;
```

## 📋 測試清單

### ✅ 基礎檢查
- [ ] Sprite 組件有 SpriteFrame
- [ ] SpriteFrame 有有效紋理
- [ ] Material 基於正確的 Effect
- [ ] Console 無錯誤訊息

### ✅ Material 設定
- [ ] USE_TEXTURE 已勾選
- [ ] alphaThreshold = 0.0
- [ ] 測試顏色屬性可見（如果有）

### ✅ Shader 檢查
- [ ] cc_spriteTexture 正確綁定
- [ ] CCSampleWithAlphaSeparated 函數調用
- [ ] 頂點顏色正確應用
- [ ] ALPHA_TEST 正確調用

## 🔧 快速修復腳本

如果需要通過腳本動態檢查：

```typescript
@ccclass('SpriteVisibilityChecker')
export class SpriteVisibilityChecker extends Component {
    
    @property(Sprite)
    sprite: Sprite = null;
    
    start() {
        this.checkSpriteVisibility();
    }
    
    checkSpriteVisibility() {
        if (!this.sprite) {
            console.warn('No Sprite component found!');
            return;
        }
        
        // 檢查 SpriteFrame
        if (!this.sprite.spriteFrame) {
            console.error('Sprite has no SpriteFrame!');
            return;
        }
        
        // 檢查紋理
        if (!this.sprite.spriteFrame.texture) {
            console.error('SpriteFrame has no texture!');
            return;
        }
        
        // 檢查 Material
        if (!this.sprite.customMaterial) {
            console.log('Using default material');
            return;
        }
        
        console.log('Sprite setup looks correct');
        
        // 檢查 Alpha
        const color = this.sprite.color;
        if (color.a === 0) {
            console.warn('Sprite alpha is 0!');
        }
        
        // 檢查節點可見性
        if (!this.node.active) {
            console.warn('Node is inactive!');
        }
    }
    
    // 強制重新設置 Material
    resetMaterial() {
        const material = this.sprite.customMaterial;
        this.sprite.customMaterial = null;
        this.scheduleOnce(() => {
            this.sprite.customMaterial = material;
        }, 0.1);
    }
}
```

## 🎯 最終測試步驟

1. **使用 TestVisible.effect 創建 Material**
2. **勾選 USE_TEXTURE**
3. **應用到簡單的 Sprite（例如白色方塊）**
4. **如果可見，逐步替換成你的目標 Shader**
5. **每次更換後檢查是否還可見**

這樣可以精確定位問題所在！🔍✨

## 💡 預防措施

- 總是從簡單的 Shader 開始測試
- 每次修改後立即測試可見性
- 保留一份工作正常的備份 Shader
- 使用有意義的測試顏色（如紅色、藍色）來確認 Shader 生效