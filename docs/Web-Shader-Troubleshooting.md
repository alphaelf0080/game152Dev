# Web 平台 Shader 問題診斷指南

## 🌐 編輯器正常但 Web 預覽消失的常見原因

### 1. **WebGL 精度問題** ⭐ 最常見
```glsl
// ❌ 問題代碼
precision highp float;

// ✅ 修正代碼  
precision mediump float;
```

**原因：** 部分設備/瀏覽器不支援 `highp` 精度
**解決：** 使用 `mediump float` 或條件精度聲明

### 2. **條件分支問題**
```glsl
// ❌ 可能有問題（某些 WebGL 實現）
if (layer2Enabled > 0.5) {
    o.rgb = mix(o.rgb, layer2Color.rgb, opacity);
}

// ✅ 更好的寫法
float useLayer2 = step(0.5, layer2Enabled);
o.rgb = mix(o.rgb, 
            mix(o.rgb, layer2Color.rgb, opacity),
            useLayer2);
```

### 3. **紋理綁定點限制**
```glsl
// ❌ 某些設備可能不支援高綁定點
layout(set = 2, binding = 13) uniform sampler2D layer2Texture;

// ✅ 使用標準方式
uniform sampler2D layer2Texture;
```

### 4. **複雜運算限制**
- 避免過多的循環
- 減少複雜的數學函數
- 限制 uniform 數量

## 🔧 修正策略

### 步驟 1: 使用 Web 優化版本
1. 測試 `WebOptimizedSprite.effect`
2. 確保勾選 USE_TEXTURE
3. 在 Web 預覽中檢查

### 步驟 2: 瀏覽器開發者工具檢查
```javascript
// 在瀏覽器 Console 執行
console.log('WebGL Info:');
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
console.log('Renderer:', gl.getParameter(gl.RENDERER));
console.log('Version:', gl.getParameter(gl.VERSION));
console.log('Max Texture Units:', gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));

// 檢查 highp 支援
const highpSupported = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0;
console.log('High precision supported:', highpSupported);
```

### 步驟 3: Cocos Creator 構建設定
1. **項目設置 → 構建發布 → Web**
2. **勾選 "調試模式"** 查看詳細錯誤
3. **Source Maps** 設為 true
4. **檢查 "WebGL 1.0 兼容模式"**

### 步驟 4: 漸進式測試
```
1. 先測試最簡單的 Shader (TestVisible.effect)
2. 確認基本功能正常後
3. 逐步添加複雜功能
4. 每次添加後在 Web 測試
```

## 📱 移動設備特殊考慮

### iOS Safari 已知問題：
- 對 `highp` 支援不完整
- 部分 GLSL 函數限制
- 紋理大小限制更嚴格

### Android Chrome 問題：
- 設備間差異很大
- 老舊設備性能限制
- GPU 驅動兼容性問題

## 🎯 最佳實踐

### Shader 編寫建議：
```glsl
// 1. 使用條件精度
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// 2. 避免動態分支
// 使用 step(), mix() 代替 if 語句

// 3. 限制紋理採樣
// 減少在循環中的 texture() 調用

// 4. 簡化數學運算
// 避免 pow(), exp() 等複雜函數
```

### 構建設定建議：
```
✅ 啟用調試模式（開發階段）
✅ 檢查 WebGL 1.0 兼容
✅ 測試多種瀏覽器
✅ 使用 Chrome DevTools Performance
```

## 🚨 緊急修復清單

如果 Shader 在 Web 不工作：

1. **立即改用 `mediump float`**
2. **移除所有 `if` 語句，改用 `mix()`**
3. **簡化 uniform 結構**
4. **測試 `WebOptimizedSprite.effect`**
5. **檢查瀏覽器 Console 錯誤**

## 📊 兼容性測試矩陣

| 瀏覽器 | 版本 | highp 支援 | 複雜 Shader | 多紋理 |
|--------|------|------------|------------|--------|
| Chrome | 80+ | ✅ | ✅ | ✅ |
| Firefox | 75+ | ✅ | ✅ | ✅ |
| Safari | 13+ | ⚠️ | ⚠️ | ✅ |
| Edge | 80+ | ✅ | ✅ | ✅ |
| Mobile Safari | 13+ | ❌ | ❌ | ⚠️ |
| Android Chrome | 70+ | ⚠️ | ⚠️ | ⚠️ |

## 🔍 調試技巧

### 在 Web 控制台檢查 Shader 錯誤：
```javascript
// 監聽 WebGL 錯誤
const originalGetError = WebGLRenderingContext.prototype.getError;
WebGLRenderingContext.prototype.getError = function() {
    const error = originalGetError.call(this);
    if (error !== this.NO_ERROR) {
        console.error('WebGL Error:', error);
        console.trace();
    }
    return error;
};
```

### Cocos Creator Web 調試：
1. **F12 開發者工具**
2. **Network 面板**檢查資源載入
3. **Console 面板**檢查 Shader 編譯錯誤
4. **Performance 面板**檢查渲染性能

記住：Web 平台的兼容性比編輯器更嚴格，始終以最保守的方式編寫 Shader！🎯