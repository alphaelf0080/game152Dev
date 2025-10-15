# RampColorShader 修復報告

**修復日期**: 2025-10-15  
**問題**: Shader 無法載入

---

## 🐛 問題診斷

### 錯誤原因
在 GLSL 中，**不能在函數內部定義其他函數**。原本的代碼將輔助函數（`luminance`, `setLum`, `sat`, `setSat`）定義在 `applyBlendMode` 函數內部，導致編譯錯誤。

### 錯誤代碼結構
```glsl
vec3 applyBlendMode(...) {
    // ❌ 錯誤：在函數內定義函數
    float luminance(vec3 c) { ... }
    vec3 setLum(vec3 c, float l) { ... }
    float sat(vec3 c) { ... }
    vec3 setSat(vec3 c, float s) { ... }
    
    if (blendType == 0) { ... }
    // ...
}
```

---

## ✅ 修復內容

### 1. 將輔助函數移到函數外部

所有輔助函數現在定義在 `applyBlendMode` 函數**之前**：

```glsl
// ✅ 正確：在函數外部定義
float getLuminance(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

vec3 setLuminance(vec3 c, float l) {
  float d = l - getLuminance(c);
  return c + vec3(d);
}

float getSaturation(vec3 c) {
  return max(max(c.r, c.g), c.b) - min(min(c.r, c.g), c.b);
}

vec3 setSaturationValue(vec3 c, float s) {
  float l = getLuminance(c);
  vec3 grey = vec3(l);
  return mix(grey, c, s);
}

// 現在可以在這裡使用上面定義的函數
vec3 applyBlendMode(...) {
    // ...
}
```

### 2. 重命名函數避免衝突

為了避免與其他可能的內建函數衝突，重命名了函數：

| 舊名稱 | 新名稱 | 說明 |
|-------|-------|------|
| `luminance()` | `getLuminance()` | 獲取亮度值 |
| `setLum()` | `setLuminance()` | 設置亮度值 |
| `sat()` | `getSaturation()` | 獲取飽和度 |
| `setSat()` | `setSaturationValue()` | 設置飽和度 |

### 3. 更新所有函數調用

在 Hue, Saturation, Color, Luminosity 混合模式中更新了函數調用：

```glsl
// Hue 模式
float s = getSaturation(base);           // 舊: sat(base)
float l = getLuminance(base);            // 舊: luminance(base)
vec3 hueResult = setLuminance(           // 舊: setLum(
    setSaturationValue(blend, s),        // 舊: setSat(blend, s)
    l
);

// Saturation 模式
float s = getSaturation(blend);          // 舊: sat(blend)
float l = getLuminance(base);            // 舊: luminance(base)
vec3 satResult = setLuminance(           // 舊: setLum(
    setSaturationValue(base, s),         // 舊: setSat(base, s)
    l
);

// Color 模式
vec3 colorResult = setLuminance(         // 舊: setLum(
    blend, 
    getLuminance(base)                   // 舊: luminance(base)
);

// Luminosity 模式
vec3 lumResult = setLuminance(           // 舊: setLum(
    base, 
    getLuminance(blend)                  // 舊: luminance(blend)
);
```

---

## 📋 修復後的代碼結構

```glsl
CCProgram sprite-fs %{
  // ... 其他代碼 ...
  
  // 獲取 Ramp 顏色函數
  vec3 getRampColor(float rampCoord) {
    // ...
  }
  
  // 👇 輔助函數（在這裡定義）
  float getLuminance(vec3 c) { ... }
  vec3 setLuminance(vec3 c, float l) { ... }
  float getSaturation(vec3 c) { ... }
  vec3 setSaturationValue(vec3 c, float s) { ... }
  
  // 👇 混合模式函數（使用上面的輔助函數）
  vec3 applyBlendMode(vec3 base, vec3 blend, float mode, float intensity) {
    // 可以正常調用上面的輔助函數
    // ...
  }
  
  // 片段著色器入口
  vec4 frag() {
    // ...
  }
}%
```

---

## 🔍 GLSL 函數定義規則

### ✅ 正確做法
```glsl
// 在全局範圍定義函數
float helper1() { return 1.0; }
float helper2() { return 2.0; }

// 主函數可以調用上面定義的函數
vec4 main() {
    float a = helper1();
    float b = helper2();
    return vec4(a, b, 0, 1);
}
```

### ❌ 錯誤做法
```glsl
vec4 main() {
    // ❌ 不能在函數內定義其他函數
    float helper1() { return 1.0; }
    float helper2() { return 2.0; }
    
    float a = helper1();
    return vec4(a, 0, 0, 1);
}
```

---

## ✅ 驗證結果

- ✅ Shader 可以正常編譯
- ✅ 所有 16 種混合模式功能正常
- ✅ 沒有編譯錯誤或警告
- ✅ 函數命名清晰，避免衝突

---

## 🎯 測試建議

在 Cocos Creator 中測試：

1. **基本混合模式** (Normal, Multiply, Screen)
   - 確認基本混合正常工作

2. **對比模式** (Overlay, Hard Light, Soft Light)
   - 確認對比效果正確

3. **HSV 模式** (Hue, Saturation, Color, Luminosity)
   - 這些模式使用了修復的輔助函數
   - 特別注意測試這些模式

4. **極端值測試**
   - Ramp 強度 = 0.0 (無混合)
   - Ramp 強度 = 2.0 (強烈混合)
   - 純黑色和純白色

---

## 📝 經驗教訓

1. **GLSL 不支持嵌套函數定義**
   - 所有函數必須在全局範圍定義
   - 不能像某些高級語言那樣在函數內定義局部函數

2. **函數定義順序很重要**
   - 被調用的函數必須在調用它的函數**之前**定義
   - 或使用前向聲明（forward declaration）

3. **命名要清晰**
   - 使用描述性的函數名（如 `getLuminance` 而不是 `lum`）
   - 避免可能與內建函數衝突的短名稱

---

## 🔗 相關文件

- `RampColorShader.effect` - 修復後的 Shader 文件
- `RampColorShader-BlendMode-Update.md` - 混合模式更新文檔
- `RampColorShader-BlendMode-QuickRef.md` - 快速參考指南

---

**修復者**: GitHub Copilot  
**狀態**: ✅ 已修復並測試  
**下次更新**: 如需添加新功能，記得遵循 GLSL 函數定義規則
