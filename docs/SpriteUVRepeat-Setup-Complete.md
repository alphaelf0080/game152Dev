# ✅ SpriteUVRepeat 完整設置步驟

## 🔴 當前問題

截圖顯示：
- ⚠️ SpriteUVRepeat.effect 有警告（黃色三角形）
- ❌ Console: "illegal property name: tilingOffset"

## ✨ 已修復

shader 已更新為 Cocos Creator 3.8 完全兼容版本。

## 📋 完整設置步驟

### 步驟 1：確認 Shader 已載入

```
1. 查看 Assets 面板
2. 找到 effect/SpriteUVRepeat
3. ✅ 確認沒有黃色警告標記
4. 如果有警告：
   - 右鍵 → Reimport Asset
   - 等待重新編譯
```

### 步驟 2：創建材質

```
1. Assets 面板右鍵
2. Create → Material
3. 命名：UVRepeat_mat
4. 選擇這個材質
5. Inspector 面板：
   - Effect: 選擇 "SpriteUVRepeat"
   - Main Texture: 拖入你的紋理
   - Tiling Offset: [1, 1, 0, 0]
```

### 步驟 3：設置紋理

```
選擇紋理文件（如 bg_baseColor）：

Inspector 面板：
☑️ Wrap Mode S: REPEAT
☑️ Wrap Mode T: REPEAT
☑️ Filter Mode: BILINEAR
點擊右上角 Apply 按鈕
```

### 步驟 4：設置 Sprite

```
選擇你的 Node (testSprit)：

Sprite 組件：
- Type: SIMPLE ← 重要！不要用 SLICED
- Sprite Frame: bg_baseColor
- Custom Material: 拖入 UVRepeat_mat ← 重要！
```

### 步驟 5：使用組件

```
SpriteTextureRepeat 組件：
- Target Sprite: testSprit (自動)
- Repeat X: 4
- Repeat Y: 2
- Offset X: 0
- Offset Y: 0
```

## ✅ 驗證成功

完成後，Console 應該顯示：

```
✅ [SpriteTextureRepeat] ✓ 材質初始化成功
✅ [SpriteTextureRepeat] ✓ 使用 tilingOffset: Repeat(4, 2), Offset(0, 0)
```

**不應該再看到**：
```
❌ illegal property name: tilingOffset
```

## 🎬 測試效果

1. **改變 Repeat X**: 4 → 2
   - 應該看到紋理重複次數減少

2. **改變 Offset X**: 0 → 0.5
   - 應該看到紋理向右移動

3. **實時調整**
   - 拖動滑桿立即看到效果

## ⚠️ 常見問題

### 問題 1：Shader 有警告標記

**解決**：
```
1. 右鍵 SpriteUVRepeat.effect
2. 選擇 "Reimport Asset"
3. 等待編譯完成
4. 確認警告消失
```

### 問題 2：還是看到 "illegal property name"

**原因**：材質沒有正確使用 SpriteUVRepeat shader

**檢查**：
```
1. 選擇材質文件
2. Inspector → Effect
3. 確認是 "SpriteUVRepeat"，不是 "builtin-sprite"
4. 如果錯誤，重新選擇正確的 Effect
```

### 問題 3：CustomMaterial 顯示 "cc.Material"

**原因**：材質沒有正確拖入

**解決**：
```
1. 從 Assets 面板拖動 UVRepeat_mat
2. 拖到 Sprite 組件的 CustomMaterial 欄位
3. 確認顯示材質名稱，不是 "cc.Material"
```

### 問題 4：看不到重複效果

**檢查**：
```
☑️ 紋理 Wrap Mode 是 REPEAT
☑️ Sprite Type 是 SIMPLE
☑️ CustomMaterial 已正確設置
☑️ Repeat 值大於 1
```

## 📊 正確配置對照表

### Assets 面板

```
effect/
  ├─ SpriteUVRepeat ✅ (無警告標記)
  ├─ RampColorShader
  └─ ...

material/
  └─ UVRepeat_mat ✅
      Effect: SpriteUVRepeat
      Main Texture: bg_baseColor
```

### Inspector - Sprite 組件

```yaml
cc.Sprite:
  Sprite Frame: bg_baseColor
  Type: SIMPLE              ✅
  Size Mode: CUSTOM
  Custom Material:
    - UVRepeat_mat          ✅ (不是 cc.Material)
```

### Inspector - SpriteTextureRepeat 組件

```yaml
SpriteTextureRepeat:
  Script: SpriteTextureRepeat.ts  ✅
  Target Sprite: testSprit
  Repeat X: 4.0
  Repeat Y: 2.0
  Offset X: 0.0
  Offset Y: 0.0
```

### Console 日誌（成功）

```
✅ [SpriteTextureRepeat] ✓ 材質初始化成功
✅ [SpriteTextureRepeat] ✓ 使用 tilingOffset: Repeat(4, 2), Offset(0, 0)
```

## 🔧 手動測試

如果還是不行，試試直接在材質 Inspector 中改變 Tiling Offset 值：

```
選擇 UVRepeat_mat 材質
Inspector 面板：
  Tiling Offset: [2, 2, 0, 0]

應該立即看到效果改變
```

如果手動改變有效，說明 shader 正確，問題在組件設置。

## 📞 故障排除檢查清單

- [ ] SpriteUVRepeat.effect 無警告標記
- [ ] 材質的 Effect 是 SpriteUVRepeat
- [ ] 紋理 Wrap Mode 是 REPEAT
- [ ] Sprite Type 是 SIMPLE
- [ ] CustomMaterial 已正確設置（不是 cc.Material）
- [ ] SpriteTextureRepeat 組件已添加
- [ ] Console 無 "illegal property name" 錯誤
- [ ] 改變參數有視覺效果

## 💡 重新開始

如果問題持續，建議完全重新設置：

```
1. 刪除當前材質
2. 重新導入 SpriteUVRepeat.effect
3. 創建新材質
4. 按步驟重新設置
5. 測試簡單場景
```

---

**核心要點**：確保 Shader 正確編譯，材質正確使用 Shader，Sprite 正確使用材質！
