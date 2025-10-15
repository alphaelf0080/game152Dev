# ThreeLayerSprite.effect - 官方語法修正

## 問題發現

之前根據錯誤訊息推測應該使用 `main()` 函數和 `gl_Position` / `gl_FragColor`，但這是**錯誤的**！

查閱官方文檔後發現：
- 文檔：https://docs.cocos.com/creator/3.8/manual/en/shader/write-effect-2d-sprite-gradient.html
- Cocos Creator 3.8 使用**自定義函數名稱** `vert()` 和 `frag()`
- 這些函數**返回 vec4**，而不是設置 gl_* 變量

## 正確語法對比

### ❌ 錯誤寫法（之前的修改）

```glsl
CCEffect %{
  techniques:
  - passes:
    - vert: sprite-vs
      frag: sprite-fs
}%

CCProgram sprite-vs %{
  void main() {
    // ...
    gl_Position = pos;
  }
}%

CCProgram sprite-fs %{
  void main() {
    // ...
    gl_FragColor = color;
  }
}%
```

### ✅ 正確寫法（官方標準）

```glsl
CCEffect %{
  techniques:
  - passes:
    - vert: sprite-vs:vert
      frag: sprite-fs:frag
}%

CCProgram sprite-vs %{
  vec4 vert() {
    // ...
    return pos;  // 返回位置，不設置 gl_Position
  }
}%

CCProgram sprite-fs %{
  vec4 frag() {
    // ...
    return color;  // 返回顏色，不設置 gl_FragColor
  }
}%
```

## 關鍵差異

### 1. CCEffect 中的引用

**錯誤**：
```yaml
- vert: sprite-vs
  frag: sprite-fs
```

**正確**：
```yaml
- vert: sprite-vs:vert
  frag: sprite-fs:frag
```

`program:function` 格式，明確指定入口函數名稱。

### 2. Vertex Shader 函數簽名

**錯誤**：
```glsl
void main() {
    vec4 pos = ...;
    gl_Position = pos;
}
```

**正確**：
```glsl
vec4 vert() {
    vec4 pos = ...;
    return pos;  // 引擎會自動設置 gl_Position
}
```

### 3. Fragment Shader 函數簽名

**錯誤**：
```glsl
void main() {
    vec4 color = ...;
    gl_FragColor = color;
}
```

**正確**：
```glsl
vec4 frag() {
    vec4 color = ...;
    return color;  // 引擎會自動設置 gl_FragColor
}
```

## 為什麼會誤解

之前看到的錯誤訊息：
```
Error EFX2403: entry function 'main' not found at line 1
```

這讓我們以為需要 `main()` 函數，但實際上：
1. Cocos Creator 使用自定義編譯流程
2. 引擎會將 `vert()` 和 `frag()` 函數包裝成標準 GLSL
3. 開發者不需要（也不應該）直接使用 `main()`

## 官方示例分析

從官方 2D Sprite Gradient 教程：

```glsl
CCProgram sprite-vs %{
  precision highp float;
  #include <builtin/uniforms/cc-global>
  
  in vec3 a_position;
  in vec2 a_texCoord;
  in vec4 a_color;

  out vec4 color;
  out vec2 uv0;

  vec4 vert () {
    vec4 pos = vec4(a_position, 1);
    
    #if USE_LOCAL
      pos = cc_matWorld * pos;
    #endif
    
    pos = cc_matViewProj * pos;
    
    uv0 = a_texCoord;
    color = a_color;

    return pos;  // 👈 返回位置
  }
}%

CCProgram sprite-fs %{
  precision highp float;
  #include <builtin/internal/alpha-test>
  
  in vec4 color;
  in vec2 uv0;
  
  #pragma builtin(local)
  layout(set = 2, binding = 11) uniform sampler2D cc_spriteTexture;
  
  uniform Constant {
    vec4 startColor;
    vec4 endColor;
  };
  
  vec4 frag () {
    vec4 o = vec4(1, 1, 1, 1);
    
    #if USE_TEXTURE
      o *= texture(cc_spriteTexture, uv0);
      o.rgb *= mix(startColor, endColor, vec4(uv0.x)).rgb;
    #endif
    
    o *= color;
    ALPHA_TEST(o);
    
    return o;  // 👈 返回顏色
  }
}%
```

## 已修正的檔案

### ThreeLayerSprite_Simple.effect
- ✅ 修改 CCEffect：`vert: sprite-vs:vert`
- ✅ 修改 vertex shader：`vec4 vert() { return pos; }`
- ✅ 修改 fragment shader：`vec4 frag() { return color; }`

### ThreeLayerSprite.effect
- ✅ 修改 CCEffect：`vert: sprite-vs:vert`
- ✅ 修改 vertex shader：`vec4 vert() { return pos; }`
- ✅ 修改 fragment shader：`vec4 frag() { return o; }`

## 其他保持不變的部分

以下修改仍然是正確的：

### ✅ UBO 對齊優化
```glsl
uniform Properties {
  vec2 layer1_UVScale;
  vec2 layer1_UVOffset;
  vec2 layer2_UVScale;
  vec2 layer2_UVOffset;
  // ... 所有 vec2 放在一起
  
  float layer1_UVWrap;
  float layer2_Enabled;
  // ... 所有 float 放在一起
};
```

### ✅ Texture Binding Points
```glsl
#pragma builtin(local)
layout(set = 2, binding = 11) uniform sampler2D mainTexture;

#pragma builtin(local)
layout(set = 2, binding = 12) uniform sampler2D layer2Texture;

#pragma builtin(local)
layout(set = 2, binding = 13) uniform sampler2D layer3Texture;
```

### ✅ In/Out 變量
```glsl
// Vertex Shader
in vec3 a_position;
in vec2 a_texCoord;
in vec4 a_color;

out vec2 v_uv0;
out vec4 v_color;

// Fragment Shader
in vec2 v_uv0;
in vec4 v_color;
```

## 測試清單

### 1. Cocos Creator 編輯器測試
- [ ] 導入兩個 .effect 檔案
- [ ] 創建 Material（基於 ThreeLayerSprite_Simple）
- [ ] 創建 Material（基於 ThreeLayerSprite）
- [ ] 檢查是否有編譯錯誤

### 2. Inspector 屬性檢查
- [ ] 所有屬性是否正確顯示
- [ ] Enum 屬性（Wrap Mode, Blend Mode）是否有下拉選單
- [ ] Color 屬性是否有顏色選擇器
- [ ] Range 屬性（Opacity）是否有滑桿

### 3. 功能測試 - Simple 版本
- [ ] 設置主紋理，是否正確顯示
- [ ] 調整 UV Scale/Offset，是否生效
- [ ] 啟用第二層，設置第二層紋理
- [ ] 測試混合效果
- [ ] 調整不透明度

### 4. 功能測試 - 完整版本
- [ ] 測試所有三層
- [ ] 測試 5 種混合模式（Normal, Multiply, Add, Screen, Overlay）
- [ ] 測試 3 種 Wrap 模式（Clamp, Repeat, MirrorRepeat）
- [ ] 測試 UV 動畫（通過腳本動態修改 Offset）

### 5. 性能測試
- [ ] 單層 FPS
- [ ] 雙層 FPS
- [ ] 三層 FPS
- [ ] 多個 Sprite 同時使用此 shader

## 學到的教訓

1. **官方文檔優先**：遇到問題應該先查官方文檔，而不是根據錯誤訊息猜測
2. **Cocos Creator 有自己的 Shader 系統**：不是標準 GLSL，而是 Cocos Effect 格式
3. **函數命名很重要**：`vert()` / `frag()` 是約定俗成的，不能隨意使用 `main()`
4. **CCEffect 語法很嚴格**：必須使用 `program:function` 格式明確指定入口點

## 下一步

現在 shader 語法已經完全符合官方標準，可以：

1. 在 Cocos Creator 中測試載入
2. 創建測試場景驗證功能
3. 編寫使用範例和教程
4. 優化性能和視覺效果

## 參考資料

- [Cocos Creator 3.8 - 2D Sprite Shader: Gradient](https://docs.cocos.com/creator/3.8/manual/en/shader/write-effect-2d-sprite-gradient.html)
- [Cocos Creator 3.8 - Shader Overview](https://docs.cocos.com/creator/3.8/manual/en/shader/index.html)
- [Cocos Creator 3.8 - Effect Syntax](https://docs.cocos.com/creator/3.8/manual/en/shader/effect-syntax.html)
- [Cocos Creator 3.8 - UBO Layout](https://docs.cocos.com/creator/3.8/manual/en/shader/ubo-layout.html)
