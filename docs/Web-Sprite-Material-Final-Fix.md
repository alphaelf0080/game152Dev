# Web 平台 Sprite Material 終極解決方案

## 🚨 問題現象
- 編輯器預覽：✅ 正常顯示
- Web 預覽：❌ Sprite 消失

## 🎯 終極解決步驟

### 步驟 1: 使用 WebSafeSprite.effect
這是最保守、最兼容的版本：
```
創建 Material → 選擇 WebSafeSprite.effect → 勾選 USE_TEXTURE
```

### 步驟 2: 檢查 Cocos Creator 構建設定
1. **項目設置 → 構建發布 → Web**
2. **勾選 "調試模式"**
3. **Source Maps: true**
4. **MD5 Cache: false**（暫時關閉）

### 步驟 3: 瀏覽器調試
按 F12 開啟開發者工具，檢查：
```javascript
// 在 Console 執行
console.clear();
console.log('=== WebGL 診斷 ===');

const canvas = document.querySelector('canvas');
if (!canvas) {
    console.error('找不到 Canvas 元素');
} else {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.error('WebGL 不支援');
    } else {
        console.log('✅ WebGL 可用');
        console.log('版本:', gl.getParameter(gl.VERSION));
        console.log('渲染器:', gl.getParameter(gl.RENDERER));
        
        // 檢查精度支援
        const highp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        console.log('highp 支援:', highp.precision > 0);
        
        // 檢查紋理單元
        console.log('最大紋理單元:', gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
    }
}
```

## 🔍 可能的根本原因

### 1. WebGL 版本兼容性
某些設備只支援 WebGL 1.0 的舊語法

### 2. Cocos Creator 版本問題
3.8.x 版本在某些情況下可能有 Web 編譯問題

### 3. 瀏覽器安全策略
CORS 或其他安全限制

## 🛠️ 進階診斷

### 如果 WebSafeSprite.effect 還是不行：

1. **測試純色 Shader**：
```glsl
vec4 frag () {
    return vec4(1.0, 0.0, 0.0, 1.0); // 純紅色
}
```

2. **檢查 Console 錯誤**：
   - Shader 編譯錯誤
   - 紋理載入錯誤
   - WebGL 上下文丟失

3. **測試不同瀏覽器**：
   - Chrome（最好的支援）
   - Firefox
   - Safari（最嚴格）

## 📱 移動設備特殊處理

### iOS Safari 已知問題：
```javascript
// 檢查是否為 iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
if (isIOS) {
    console.warn('iOS Safari 檢測到，可能需要特殊處理');
}
```

### 解決方案：
1. **強制使用 WebGL 1.0 語法**
2. **移除所有高精度聲明**
3. **使用最基本的 GLSL 函數**

## 🚨 最後手段

如果所有方法都失敗，可以嘗試：

### 1. 回退到內建 Material
暫時不使用自定義 Shader

### 2. 條件載入
```typescript
// 在腳本中檢測平台
if (sys.isBrowser) {
    // Web 平台使用簡化版本
    sprite.customMaterial = webSafeMaterial;
} else {
    // 編輯器/原生平台使用完整版本
    sprite.customMaterial = fullFeatureMaterial;
}
```

### 3. 動態 Shader 生成
根據設備能力動態選擇 Shader

## 📞 支援聯絡

如果問題持續存在，請提供：
1. **瀏覽器 Console 完整錯誤日志**
2. **設備和瀏覽器版本**
3. **Cocos Creator 版本**
4. **構建設定截圖**

記住：Web 平台的 WebGL 支援差異很大，最保守的方法通常是最可靠的！🎯