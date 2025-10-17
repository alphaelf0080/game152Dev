# 修復 SpriteTextureRepeat "沒有效果" 問題

## 問題原因

**Cocos Creator 3.8 的默認 Sprite shader (`builtin-sprite`) 不支援動態 UV 重複！**

你看到的錯誤：
```
[Scene] Illegal property name: tilingOffset
```

這表示默認 shader 沒有 `tilingOffset` 這個屬性。

## 解決方案

### 方案 1：使用自定義 Shader（推薦）✅

#### 步驟 1：創建材質

```
1. 在 Assets 中右鍵 → New → Material
2. 命名為 "SpriteUVRepeat_mat"
3. 選擇這個材質
4. Inspector → Effect → 選擇 "SpriteUVRepeat"
```

#### 步驟 2：設置紋理 Wrap Mode

```
1. 選擇你的紋理文件（如 bg_baseColor）
2. Inspector 面板
3. Wrap Mode U: Repeat
4. Wrap Mode V: Repeat
5. 點擊右上角的綠色 ✓ 按鈕保存
```

#### 步驟 3：應用到 Sprite

```
1. 選擇你的 Sprite Node（如 testSprit）
2. Sprite Component → CustomMaterial
3. 將 "SpriteUVRepeat_mat" 拖到 CustomMaterial 欄位
4. ✅ 完成！
```

#### 步驟 4：使用 SpriteTextureRepeat 組件

```
現在調整 Repeat X/Y 和 Offset X/Y 應該可以看到效果了！
```

### 方案 2：使用 Sprite Type = TILED

如果不想用自定義 shader，可以使用 Cocos 內建的 Tiled 功能：

```
1. Sprite Component → Type → 選擇 "TILED"
2. 這樣 Sprite 會自動重複紋理
3. 但是無法動態控制重複次數
```

**限制**：
- 只能靜態重複，不能用 SpriteTextureRepeat 動態控制
- 重複次數由 Content Size / 紋理尺寸決定

## 完整設置流程

### 當前你的設置

根據截圖：
```
Node: testSprit
├─ UITransform: Content Size (160, 160)
├─ Sprite
│  ├─ Sprite Atlas: cc.SpriteAtlas
│  ├─ Sprite Frame: bg_baseColor
│  ├─ Type: SLICED ← 這個需要改！
│  └─ CustomMaterial: cc.Material
└─ SpriteTextureRepeat
   ├─ Repeat X: 4
   ├─ Repeat Y: 2
   ├─ Offset X: 0
   └─ Offset Y: 0
```

### 需要修改的地方

#### 修改 1：改變 Sprite Type

```
Sprite Component → Type → 選擇 "SIMPLE"
```

**為什麼**：SLICED 類型不適合 UV 重複

#### 修改 2：設置自定義材質

```
1. 創建材質（使用 SpriteUVRepeat shader）
2. Sprite Component → CustomMaterial → 拖入材質
```

#### 修改 3：設置紋理 Wrap Mode

```
選擇 bg_baseColor 紋理
Inspector → Wrap Mode U/V: Repeat
保存
```

## 驗證步驟

完成上述設置後：

### 1. 檢查 Console

應該看到：
```
[SpriteTextureRepeat] ✓ 材質初始化成功
[SpriteTextureRepeat] ✓ 使用 tilingOffset: Repeat(4, 2), Offset(0, 0)
```

**不應該看到**：
```
❌ Illegal property name: tilingOffset
```

### 2. 檢查視覺效果

改變 Repeat X 從 4 到 2，應該看到：
- 紋理重複次數減少
- 視覺效果立即改變

### 3. 測試偏移

改變 Offset X 從 0 到 0.5，應該看到：
- 紋理向右移動

## 快速測試場景

### 最小化測試

```
1. 創建新 Node "TestUVRepeat"

2. 添加組件：
   - UITransform: (200, 200)
   - Sprite: 
     * 選擇任何簡單紋理
     * Type: SIMPLE
     * CustomMaterial: SpriteUVRepeat_mat
   - SpriteTextureRepeat:
     * Repeat X: 2.0
     * Repeat Y: 2.0

3. 確保紋理 Wrap Mode 設為 Repeat

4. 應該看到紋理重複 2x2 次
```

## 常見錯誤

### 錯誤 1：Illegal property name

**原因**：使用了默認 shader  
**解決**：使用 SpriteUVRepeat 自定義 shader

### 錯誤 2：看不到重複效果

**原因**：紋理 Wrap Mode 設置錯誤  
**解決**：設置為 Repeat

### 錯誤 3：紋理拉伸變形

**原因**：Sprite Type 設為 SLICED  
**解決**：改為 SIMPLE

## 文件清單

確保以下文件存在：

- ✅ `/assets/scripts/SpriteTextureRepeat.ts` - 組件腳本
- ✅ `/assets/effect/SpriteUVRepeat.effect` - 自定義 shader
- ✅ 材質文件（需要自己創建）

## 下一步

1. 按照上述步驟設置
2. 重新測試
3. 如果還有問題，提供新的截圖：
   - Console 日誌
   - Sprite Inspector
   - 材質 Inspector

---

**核心要點**：默認 Sprite shader 不支援 UV 重複，必須使用自定義 shader！
