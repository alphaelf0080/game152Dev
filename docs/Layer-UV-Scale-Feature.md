# 第二層 UV Scale 功能說明

## 概述
為 SpriteUVRepeat Shader 的第二層添加了獨立的 UV 縮放功能，允許對第二層紋理進行縮放控制。

## 更新日期
2025年10月19日

## 功能特點

### 1. UV Scale 屬性
- **屬性名稱**: Layer UV Scale (第二層UV縮放)
- **類型**: Vec2
- **預設值**: [1.0, 1.0]
- **作用**: 獨立控制第二層紋理的 UV 縮放比例

### 2. 縮放原理
- **中心點縮放**: 使用公式 `uv = (uv - 0.5) * scale + 0.5`
- **避免偏移**: 確保縮放時紋理中心點保持不變
- **獨立控制**: 不影響 Tiling Offset 的效果

### 3. 使用方式

#### 在 Inspector 中調整
```
第二層UV縮放: [X, Y]
- X: 1.0 = 正常寬度
     0.5 = 放大 2 倍
     2.0 = 縮小一半
- Y: 1.0 = 正常高度
     0.5 = 放大 2 倍
     2.0 = 縮小一半
```

#### 在代碼中設置
```typescript
const controller = node.getComponent(SpriteUVRepeatController);
controller.layerUVScale = new Vec2(0.5, 0.5); // 放大 2 倍
controller.layerUVScale = new Vec2(2.0, 2.0); // 縮小一半
```

## 處理順序

第二層 UV 變換順序：
1. **Tiling Offset** - 先應用平鋪和偏移
2. **UV Scale** - 再應用縮放（本次新增）
3. **fract()** - 最後取小數部分（循環）

## 技術實現

### Shader 更改
1. 添加屬性定義：
```yaml
layerUVScale: { value: [1.0, 1.0], editor: { displayName: 'Layer UV Scale' } }
```

2. 添加 uniform 變數：
```glsl
vec2 layerUVScale;  // 第二層 UV 縮放 (預設 [1.0, 1.0])
```

3. 應用縮放邏輯：
```glsl
vec2 uv1 = v_uv1 * layerTilingOffset.xy + layerTilingOffset.zw;
// 應用 UV 縮放 (中心點縮放，避免偏移)
uv1 = (uv1 - 0.5) * layerUVScale + 0.5;
uv1 = fract(uv1);
```

### TypeScript 控制器更改
1. 導入 Vec2 類型
2. 添加公開屬性 `layerUVScale`
3. 添加私有追蹤變數 `lastUVScale`
4. 在 `update()` 中檢測變化
5. 在 `updateMaterial()` 中同步到 shader
6. 記錄最新值以追蹤變化

## 應用場景

### 1. 紋理細節控制
- 放大第二層紋理以顯示更多細節
- 縮小第二層紋理以增加重複次數

### 2. 視覺效果調整
- 配合 Tiling 實現複雜的紋理模式
- 動態調整紋理密度

### 3. 性能優化
- 使用較小的紋理配合縮放
- 減少紋理資源大小

## 注意事項

1. **與 Tiling 的關係**
   - UV Scale 在 Tiling 之後應用
   - 兩者可以獨立調整，互不干擾

2. **縮放中心**
   - 縮放以 UV 空間的中心點 (0.5, 0.5) 為基準
   - 不會造成紋理位置偏移

3. **性能影響**
   - UV Scale 計算非常輕量
   - 對性能影響可忽略不計

## 相關文件

- `game169/assets/effect/SpriteUVRepeat.effect` - Shader 定義
- `game169/assets/script/SpriteUVRepeatController.ts` - TypeScript 控制器

## 完整功能列表

第二層目前支援的所有功能：
1. ✅ 獨立 UV 系統
2. ✅ Tiling Offset (平鋪和偏移)
3. ✅ **UV Scale (縮放)** - 新增
4. ✅ Layer Opacity (透明度 0-100)
5. ✅ Blend Mode (12種混合模式)
6. ✅ Blend Intensity (混合強度)
7. ✅ HSV 調整 (色相、飽和度、明度)
8. ✅ Contrast (對比度)
9. ✅ Tint Color (染色顏色 RGBA)
10. ✅ Color Invert (顏色反轉)
