# 🔧 SpriteTextureRepeat 快速修復指南

## ❌ 你遇到的問題

截圖顯示 Console 中有大量錯誤：
```
[Scene] Illegal property name: tilingOffset
```

**原因**：Cocos Creator 3.8 的默認 Sprite shader **不支援** `tilingOffset` 屬性！

## ✅ 3 步快速修復

### 📝 步驟 1：創建自定義材質

```
1. 在 Assets 面板中右鍵
2. New → Material
3. 命名：SpriteUVRepeat_mat
4. 點擊剛創建的材質
5. Inspector 面板 → Effect 下拉選單
6. 選擇 "SpriteUVRepeat"
```

### 🖼️ 步驟 2：設置紋理 Wrap Mode

```
1. 選擇你的紋理（bg_baseColor）
2. Inspector 面板中找到 Wrap Mode
3. Wrap Mode U: Repeat  ← 改這個
4. Wrap Mode V: Repeat  ← 改這個
5. 點擊右上角綠色 ✓ 保存
```

### 🎨 步驟 3：應用材質到 Sprite

```
1. 選擇你的 Node (testSprit)
2. 在 Sprite 組件中：
   - Type: SIMPLE (不要用 SLICED)
   - CustomMaterial: 拖入 "SpriteUVRepeat_mat"
3. 完成！
```

## 🎯 正確的 Inspector 設置

### Sprite 組件應該看起來像這樣：

```yaml
cc.Sprite:
  Sprite Atlas: cc.SpriteAtlas
  Sprite Frame: bg_baseColor
  Type: SIMPLE              ← 重要！
  Size Mode: CUSTOM
  CustomMaterial:           ← 重要！
    - SpriteUVRepeat_mat    ← 拖入自定義材質
```

### SpriteTextureRepeat 組件：

```yaml
SpriteTextureRepeat:
  Target Sprite: testSprit  (自動)
  Repeat X: 4.0
  Repeat Y: 2.0
  Offset X: 0.0
  Offset Y: 0.0
```

## ✔️ 驗證成功

修復後，Console 應該顯示：

```
✅ [SpriteTextureRepeat] ✓ 材質初始化成功
✅ [SpriteTextureRepeat] ✓ 使用 tilingOffset: Repeat(4, 2), Offset(0, 0)
```

**不應該再看到**：
```
❌ Illegal property name: tilingOffset
```

## 🎬 測試效果

完成設置後，在編輯器中：

1. **測試重複**：
   - 改變 Repeat X 從 4 → 2
   - 應該看到紋理重複次數減少

2. **測試偏移**：
   - 改變 Offset X 從 0 → 0.5
   - 應該看到紋理向右移動

3. **實時預覽**：
   - 拖動滑桿，立即看到效果

## ⚠️ 常見錯誤

### 錯誤 1：還是看到 "Illegal property name"

**檢查**：
- [ ] CustomMaterial 是否已設置？
- [ ] 材質的 Effect 是否為 "SpriteUVRepeat"？
- [ ] 是否點擊了保存？

### 錯誤 2：看不到重複效果

**檢查**：
- [ ] 紋理 Wrap Mode 是否為 Repeat？
- [ ] Sprite Type 是否為 SIMPLE？
- [ ] Repeat X/Y 值是否 > 1？

### 錯誤 3：紋理顯示異常

**檢查**：
- [ ] 紋理是否可平鋪（seamless）？
- [ ] Content Size 是否合適？

## 📋 完整檢查清單

設置前檢查：
- [ ] SpriteUVRepeat.effect 文件存在
- [ ] SpriteTextureRepeat.ts 文件存在
- [ ] 沒有編譯錯誤

創建材質：
- [ ] 新建材質文件
- [ ] 設置 Effect 為 SpriteUVRepeat
- [ ] 保存材質

設置紋理：
- [ ] 選擇紋理
- [ ] Wrap Mode U: Repeat
- [ ] Wrap Mode V: Repeat
- [ ] 保存更改

應用到 Sprite：
- [ ] Sprite Type: SIMPLE
- [ ] CustomMaterial: SpriteUVRepeat_mat
- [ ] SpriteTextureRepeat 組件已添加

測試：
- [ ] 改變 Repeat 值有效果
- [ ] 改變 Offset 值有效果
- [ ] Console 無錯誤

## 🎓 原理說明

### 為什麼需要自定義 Shader？

Cocos Creator 的默認 Sprite shader (`builtin-sprite`) 不支援動態 UV 控制。

**默認 shader 只支援**：
- 基本紋理顯示
- 顏色混合
- Alpha 測試

**不支援**：
- ❌ UV Repeat
- ❌ UV Offset
- ❌ UV 動畫

### SpriteUVRepeat Shader 做了什麼？

```glsl
// Fragment Shader 中
vec2 uv = uv0 * tilingOffset.xy + tilingOffset.zw;
uv = fract(uv);  // 實現重複（wrap）
vec4 color = texture(mainTexture, uv);
```

1. **uv0**：原始 UV 坐標 (0~1)
2. **tilingOffset.xy**：重複次數（如 2, 2）
3. **tilingOffset.zw**：偏移量（如 0.5, 0）
4. **fract()**：取小數部分，實現循環重複

## 💡 使用技巧

### 技巧 1：無縫平鋪

使用可平鋪的紋理（seamless texture）效果最佳。

### 技巧 2：動態滾動

```typescript
// 在 update() 中
this.offsetX += 0.01;
if (this.offsetX > 1.0) this.offsetX -= 1.0;
```

### 技巧 3：性能優化

只在需要時改變參數，組件已內建變化檢測。

## 📞 還有問題？

如果按照上述步驟操作後仍然沒有效果：

1. **截圖提供**：
   - Inspector 中的 Sprite 組件
   - Inspector 中的材質設置
   - Console 完整日誌

2. **檢查文件**：
   - SpriteUVRepeat.effect 是否存在？
   - 是否有編譯錯誤？

3. **嘗試簡化測試**：
   - 創建新場景
   - 使用簡單紋理
   - 按步驟重新設置

---

**記住**：默認 Sprite 不支援 UV 重複，必須用自定義 shader！
