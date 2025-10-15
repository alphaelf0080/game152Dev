# ThreeLayerSprite Effect 載入問題修復指南

## 🐛 問題：Effect 無法在 Cocos Creator 中載入

### 已修復的問題

#### 1. **重複的 vertex 屬性定義**
```glsl
// ❌ 錯誤：a_color 被定義了兩次
#if USE_VERTEX_COLOR
  in vec3 a_color;     // 第一次
  out vec3 v_color;
#endif

in vec4 a_color;       // 第二次（衝突！）

// ✅ 修復：只定義一次
in vec3 a_position;
in vec2 a_texCoord;
in vec4 a_color;       // 只保留這個
```

#### 2. **不必要的 include**
```glsl
// ❌ 可能造成問題
#include <builtin/internal/embedded-alpha>  // 不需要

// ✅ 修復：只保留必要的
#include <builtin/internal/alpha-test>
```

#### 3. **重複的 USE_LOCAL 檢查**
```glsl
// ❌ 錯誤：重複 include
#include <builtin/uniforms/cc-local>

#if USE_LOCAL
  #include <builtin/uniforms/cc-local>  // 重複！
#endif

// ✅ 修復：移除重複
#include <builtin/uniforms/cc-local>

#if USE_LOCAL
  // 使用但不重複 include
#endif
```

---

## 📝 已創建的文件

### 1. ThreeLayerSprite.effect（已修復）
**路徑：** `game169/assets/effect/ThreeLayerSprite.effect`

**修復內容：**
- 移除重複的 `a_color` 定義
- 移除重複的 `cc-local` include
- 移除不必要的 `embedded-alpha` include
- 保留完整的三層混合功能

**功能：**
- 三層紋理
- 獨立 UV 控制（scale, offset, wrap）
- 多種混合模式
- 完整的不透明度控制

---

### 2. ThreeLayerSprite_Simple.effect（新建，測試用）
**路徑：** `game169/assets/effect/ThreeLayerSprite_Simple.effect`

**特點：**
- 簡化版本，更容易加載
- 只有兩層紋理
- 基本的 UV 控制
- 簡單混合模式

**用途：**
- 測試 effect 是否能正常載入
- 作為學習範例
- 快速原型開發

---

## 🔧 測試步驟

### 步驟 1: 重新導入 Effect

```
1. 在 Cocos Creator 中打開項目
2. 找到 game169/assets/effect/ThreeLayerSprite.effect
3. 右鍵 → "重新導入資源"
4. 等待編譯完成
5. 查看控制台是否有錯誤
```

### 步驟 2: 測試簡化版本

```
1. 右鍵點擊 ThreeLayerSprite_Simple.effect
2. 選擇 "新建 Material"
3. 命名為 "TestMaterial"
4. 設置屬性：
   - mainTexture: 選擇任意圖片
   - layer2Enabled: 0（先關閉第二層）
5. 創建 Sprite 節點測試
```

### 步驟 3: 測試完整版本

```
如果簡化版本正常工作：
1. 右鍵點擊 ThreeLayerSprite.effect
2. 選擇 "新建 Material"
3. 命名為 "ThreeLayerTest"
4. 設置基本參數後測試
```

---

## 🎯 Effect 對比

### 完整版 vs 簡化版

| 特性 | ThreeLayerSprite.effect | ThreeLayerSprite_Simple.effect |
|------|------------------------|-------------------------------|
| 層數 | 3 層 | 2 層 |
| UV Wrap | Clamp/Repeat/Mirror | 無（預設 Repeat） |
| 混合模式 | 5 種 | 1 種（Alpha 混合） |
| 文件大小 | 較大 | 較小 |
| 載入速度 | 較慢 | 較快 |
| 適用場景 | 複雜效果 | 簡單疊加 |

---

## 🔍 如果還是無法載入

### 檢查 1: 開發者工具
```
F12 → Console
查找以下關鍵字的錯誤：
- "shader"
- "effect"
- "compile"
- "ThreeLayerSprite"
```

### 檢查 2: Effect 編譯錯誤

常見錯誤訊息：
```
❌ "uniform block exceeds size limit"
→ Uniform 變數太多，需要減少

❌ "binding point conflict"
→ sampler2D 綁定點重複

❌ "undefined attribute"
→ vertex 屬性未定義

❌ "syntax error"
→ GLSL 語法錯誤
```

### 檢查 3: 綁定點是否衝突

確認沒有其他 effect 使用相同綁定點：
```glsl
// 檢查這些綁定點是否被其他 shader 使用
layout(set = 2, binding = 11)  // mainTexture
layout(set = 2, binding = 12)  // layer2Texture
layout(set = 2, binding = 13)  // layer3Texture
```

---

## 🛠️ 進階修復方法

### 方法 1: 使用內建 Sprite Shader 作為基礎

```glsl
// 從 builtin-sprite.effect 複製框架
// 只修改 fragment shader 的紋理採樣部分
// 保持 vertex shader 不變
```

### 方法 2: 減少 Uniform 變數

```glsl
// 如果 uniform block 太大
// 可以考慮：
1. 合併相似的變數（如 scale 和 offset 合併為 vec4）
2. 使用 texture 傳遞參數
3. 移除不常用的功能
```

### 方法 3: 使用 Macro 控制功能

```glsl
// 在 CCEffect 中添加 defines
techniques:
- passes:
  - defines:
    - USE_LAYER2: false
    - USE_LAYER3: false

// 在 shader 中使用
#if USE_LAYER2
  // 第二層代碼
#endif
```

---

## 📚 Cocos Creator 3.8 Effect 規範

### 必須遵守的規則

1. **Vertex Attributes**
   ```glsl
   // 2D Sprite 標準屬性
   in vec3 a_position;  // 必須
   in vec2 a_texCoord;  // 必須
   in vec4 a_color;     // 必須（不要定義兩次！）
   ```

2. **Uniform Binding**
   ```glsl
   // 必須使用 #pragma builtin(local)
   #pragma builtin(local)
   layout(set = 2, binding = X) uniform sampler2D textureName;
   ```

3. **Includes 順序**
   ```glsl
   // 按照這個順序
   #include <builtin/uniforms/cc-global>
   #include <builtin/uniforms/cc-local>
   #include <builtin/internal/alpha-test>
   ```

4. **Function Names**
   ```glsl
   // 必須使用這些函數名
   vec4 vert()   // vertex shader
   vec4 frag()   // fragment shader
   ```

---

## ✅ 測試檢查表

使用這個檢查表確認 effect 正常工作：

- [ ] Effect 文件無紅色感嘆號
- [ ] 可以創建新材質
- [ ] 材質的 Effect 下拉選單中能找到 ThreeLayerSprite
- [ ] 材質的屬性面板正常顯示
- [ ] 可以設置 mainTexture
- [ ] Sprite 使用材質後正常顯示
- [ ] 調整 UV Scale/Offset 有效果
- [ ] 啟用第二層後能看到混合效果
- [ ] 控制台無 shader 錯誤

---

## 🆘 如果還有問題

請提供以下信息：

1. **控制台完整錯誤訊息**
   ```
   複製 F12 開發者工具中的所有紅色錯誤
   ```

2. **Effect 文件內容**
   ```
   確認是否使用了修復後的版本
   ```

3. **Cocos Creator 版本**
   ```
   確認版本：3.8.4
   ```

4. **測試結果**
   ```
   - 簡化版本是否能載入？
   - 控制台有什麼錯誤？
   - 材質能否創建？
   ```

---

## 📊 修復總結

| 項目 | 修復前 | 修復後 |
|------|--------|--------|
| `a_color` 定義 | 2 次（錯誤） | 1 次 |
| `cc-local` include | 2 次（重複） | 1 次 |
| `embedded-alpha` | 包含 | 移除 |
| 測試版本 | 無 | 已創建 Simple 版本 |

---

**修復時間：** 2025-10-15  
**測試狀態：** 等待 Cocos Creator 驗證  
**相關文件：** ThreeLayerSprite.effect, ThreeLayerSprite_Simple.effect
