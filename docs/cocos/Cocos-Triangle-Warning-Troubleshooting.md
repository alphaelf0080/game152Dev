# Cocos Creator 三角形驚嘆號錯誤診斷指南

## 🚨 問題：資源無法載入，顯示三角形驚嘆號

當 Cocos Creator 中的資源（Sprite、Material、Effect 等）顯示**黃色或紅色三角形驚嘆號**時，表示該資源無法正確載入。

---

## 🔍 常見原因

### 1. Effect/Shader 編譯錯誤

**症狀：**
- Material 顯示三角形驚嘆號
- 控制台顯示 shader 編譯錯誤

**檢查方法：**
```
1. 打開「開發者」→「開發者工具」(F12)
2. 查看 Console 標籤
3. 搜索 "shader" 或 "effect" 相關錯誤
```

**常見錯誤：**
- GLSL 語法錯誤
- Uniform 綁定衝突
- Sampler 綁定點重複

**修復方法：**
```glsl
// ❌ 錯誤：綁定點衝突
layout(set = 2, binding = 11) uniform sampler2D mainTexture;
layout(set = 2, binding = 11) uniform sampler2D layer2Texture;  // 重複！

// ✅ 正確：使用不同綁定點
layout(set = 2, binding = 11) uniform sampler2D mainTexture;
layout(set = 2, binding = 12) uniform sampler2D layer2Texture;
layout(set = 2, binding = 13) uniform sampler2D layer3Texture;
```

---

### 2. 材質引用的 Effect 丟失

**症狀：**
- Material 資源顯示三角形驚嘆號
- 屬性檢查器中 "Effect" 字段為空或顯示紅色

**檢查方法：**
```
1. 選擇材質資源（.mtl 文件）
2. 查看屬性檢查器中的 "Effect" 字段
3. 如果為空或紅色，表示引用丟失
```

**修復方法：**
```
方法 A: 重新設置 Effect
1. 選擇材質
2. 在 "Effect" 下拉選單中選擇正確的 effect
3. 例如：builtin-sprite、ThreeLayerSprite 等
4. 保存場景

方法 B: 刪除並重新創建材質
1. 刪除有問題的材質
2. 右鍵點擊 effect 文件 → "新建材質"
3. 重新設置參數
```

---

### 3. Sprite 引用的材質或圖片丟失

**症狀：**
- Sprite 節點顯示三角形驚嘆號
- 屬性檢查器中 "SpriteFrame" 或 "CustomMaterial" 為空

**檢查方法：**
```
1. 選擇 Sprite 節點
2. 查看屬性檢查器中：
   - SpriteFrame: 是否有圖片？
   - CustomMaterial: 是否有材質？
```

**修復方法：**
```
SpriteFrame 丟失：
1. 從資源管理器拖入新的圖片到 SpriteFrame
2. 或點擊 "選擇資源" 選擇圖片

CustomMaterial 丟失：
1. 清空 CustomMaterial（設為 None）
2. 或重新設置正確的材質
```

---

### 4. 預製體（Prefab）引用丟失

**症狀：**
- 場景中的節點顯示三角形驚嘆號
- 該節點是從 Prefab 實例化的

**檢查方法：**
```
1. 選擇節點
2. 查看屬性檢查器頂部
3. 如果顯示 "Prefab: Missing"，表示預製體丟失
```

**修復方法：**
```
方法 A: 斷開預製體連接
1. 右鍵點擊節點 → "斷開預製體"
2. 節點變為普通節點

方法 B: 重新連接預製體
1. 刪除該節點
2. 從資源管理器重新拖入正確的預製體
```

---

### 5. 組件腳本丟失

**症狀：**
- 節點上的組件顯示 "Script Missing"
- 組件旁邊有三角形驚嘆號

**檢查方法：**
```
1. 選擇節點
2. 查看屬性檢查器中的組件列表
3. 如果顯示 "Missing Script" 或灰色，表示腳本丟失
```

**修復方法：**
```
原因 1: 腳本被刪除或移動
解決：重新添加正確的組件

原因 2: 腳本編譯錯誤
解決：
1. 打開開發者工具（F12）
2. 查看編譯錯誤
3. 修復 TypeScript 錯誤
4. 等待自動重新編譯

原因 3: @ccclass 名稱不匹配
解決：檢查腳本中的 @ccclass('ClassName') 是否正確
```

---

## 🛠️ 針對 ThreeLayerSprite.effect 的檢查

### 檢查清單

1. **Effect 文件本身：**
   ```
   ✅ 文件存在：game169/assets/effect/ThreeLayerSprite.effect
   ✅ 語法正確（已驗證）
   ✅ 綁定點不重複（11, 12, 13）
   ```

2. **Material 資源：**
   ```
   - 是否有使用 ThreeLayerSprite.effect 的材質？
   - 材質的 Effect 字段是否正確設置？
   - 材質的紋理參數是否設置？
   ```

3. **場景中的使用：**
   ```
   - 哪些 Sprite 使用了這個材質？
   - Sprite 的 SpriteFrame 是否設置？
   - CustomMaterial 是否正確連接？
   ```

### 修復步驟

#### 步驟 1: 驗證 Effect 編譯

```
1. 在資源管理器中找到 ThreeLayerSprite.effect
2. 右鍵 → "編輯"
3. 保存（Ctrl+S）觸發重新編譯
4. 查看控制台是否有錯誤
```

#### 步驟 2: 重新創建材質

```
1. 右鍵點擊 ThreeLayerSprite.effect
2. 選擇 "新建 Material"
3. 命名為 "ThreeLayerSprite_Test"
4. 設置材質屬性：
   - mainTexture: 選擇一張測試圖片
   - layer2_Enabled: 0（暫時關閉）
   - layer3_Enabled: 0（暫時關閉）
```

#### 步驟 3: 測試材質

```
1. 創建測試場景
2. 創建 Sprite 節點
3. 設置 SpriteFrame（任意圖片）
4. 在 CustomMaterial 中選擇剛創建的材質
5. 運行遊戲，觀察是否正常顯示
```

---

## 🔧 快速修復方法

### 方法 1: 重新導入資源

```
1. 選擇有問題的資源（effect/material/texture）
2. 右鍵 → "重新導入資源"
3. 等待資源重新編譯
```

### 方法 2: 清除緩存

```
1. 關閉 Cocos Creator
2. 刪除項目中的以下文件夾：
   - library/
   - temp/
   - local/
3. 重新打開項目
4. 等待資源重新編譯（可能需要幾分鐘）
```

### 方法 3: 重新編譯腳本

```
1. 打開「開發者」→「重新編譯腳本」
2. 等待編譯完成
3. 檢查控制台是否有錯誤
```

### 方法 4: 檢查資源 UUID

有時資源引用會因為 UUID 改變而丟失：

```
1. 打開場景的 .scene 文件（用文本編輯器）
2. 搜索 "Missing" 或空的引用
3. 比對 .meta 文件中的 UUID
4. 手動修正引用（高級用法）
```

---

## 📋 診斷檢查表

使用這個檢查表逐一排查：

- [ ] 打開開發者工具（F12），檢查控制台錯誤
- [ ] 檢查 Effect 文件語法是否正確
- [ ] 檢查 Material 的 Effect 字段是否設置
- [ ] 檢查 Sprite 的 SpriteFrame 是否設置
- [ ] 檢查 Sprite 的 CustomMaterial 是否設置
- [ ] 檢查組件腳本是否編譯成功
- [ ] 檢查預製體引用是否完整
- [ ] 嘗試重新導入資源
- [ ] 嘗試清除緩存並重新打開項目
- [ ] 嘗試創建新的測試材質

---

## 🆘 如果以上都無效

### 提供以下信息以便診斷：

1. **控制台完整錯誤訊息：**
   ```
   複製開發者工具中的所有紅色/黃色錯誤訊息
   ```

2. **截圖：**
   ```
   - 顯示三角形驚嘆號的位置
   - 屬性檢查器的設置
   - 控制台的錯誤訊息
   ```

3. **資源信息：**
   ```
   - 哪個資源顯示三角形驚嘆號？
   - 該資源的路徑？
   - 最近對該資源做了什麼修改？
   ```

4. **Cocos Creator 版本：**
   ```
   - 當前版本：3.8.4
   - 項目類型：2D 或 3D
   ```

---

## 💡 預防措施

為了避免資源加載錯誤：

1. **總是通過編輯器操作資源**
   - 不要直接在文件系統中移動/刪除資源
   - 使用編輯器的 "移動"、"重命名" 功能

2. **定期備份項目**
   - 使用 Git 版本控制
   - 定期提交重要變更

3. **測試後再提交**
   - 確保資源正常加載
   - 運行遊戲測試功能

4. **保持控制台乾淨**
   - 及時修復警告和錯誤
   - 不要忽視黃色警告

---

## 🎯 ThreeLayerSprite.effect 特定檢查

### 驗證 Shader 綁定點

```glsl
// 確認這三行的綁定點不衝突
layout(set = 2, binding = 11) uniform sampler2D mainTexture;     // ✓
layout(set = 2, binding = 12) uniform sampler2D layer2Texture;   // ✓
layout(set = 2, binding = 13) uniform sampler2D layer3Texture;   // ✓
```

### 驗證 Uniform Block

```glsl
uniform Properties {
    // 所有屬性都必須與 CCEffect 中的 properties 匹配
    vec2 layer1_UVScale;    // ✓ 對應 layer1_UVScale: { value: [1.0, 1.0] }
    vec2 layer1_UVOffset;   // ✓
    float layer1_UVWrap;    // ✓
    // ... 其他屬性
};
```

### 創建測試材質的命令

可以通過以下方式快速創建測試材質：

```typescript
// 在控制台執行（如果支持）
// 或創建臨時腳本
import { Material } from 'cc';

const mat = new Material();
mat.initialize({
    effectName: 'ThreeLayerSprite',
    technique: 0
});

// 設置參數
mat.setProperty('layer2_Enabled', 0);
mat.setProperty('layer3_Enabled', 0);
```

---

**更新日期：** 2025-10-15  
**適用版本：** Cocos Creator 3.8.x  
**文件狀態：** ThreeLayerSprite.effect 語法正確，無編譯錯誤
