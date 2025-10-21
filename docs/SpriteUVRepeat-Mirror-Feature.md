# SpriteUVRepeat Shader - 鏡射功能說明

## 更新日期
2025年10月21日

## 新增功能

### 底層（Base Layer）鏡射功能
為主紋理（mainTexture）添加了水平和垂直鏡射控制：

- **Base Mirror Horizontal（底層水平鏡射）**
  - 參數名：`baseMirrorH`
  - 值範圍：0-1
  - 0 = 關閉鏡射
  - 1 = 開啟水平鏡射（左右翻轉）

- **Base Mirror Vertical（底層垂直鏡射）**
  - 參數名：`baseMirrorV`
  - 值範圍：0-1
  - 0 = 關閉鏡射
  - 1 = 開啟垂直鏡射（上下翻轉）

### 第二層（Layer）鏡射功能
為第二層紋理（layerTexture）添加了獨立的水平和垂直鏡射控制：

- **Layer Mirror Horizontal（第二層水平鏡射）**
  - 參數名：`layerMirrorH`
  - 值範圍：0-1
  - 0 = 關閉鏡射
  - 1 = 開啟水平鏡射（左右翻轉）

- **Layer Mirror Vertical（第二層垂直鏡射）**
  - 參數名：`layerMirrorV`
  - 值範圍：0-1
  - 0 = 關閉鏡射
  - 1 = 開啟垂直鏡射（上下翻轉）

## 技術實現

### UV 鏡射函數
```glsl
vec2 applyMirror(vec2 uv, float mirrorH, float mirrorV) {
  vec2 result = uv;
  
  // 水平鏡射（如果啟用）
  if (mirrorH > 0.5) {
    result.x = 1.0 - result.x;
  }
  
  // 垂直鏡射（如果啟用）
  if (mirrorV > 0.5) {
    result.y = 1.0 - result.y;
  }
  
  return result;
}
```

### 應用流程

1. **底層紋理**：
   - 計算 UV 坐標（考慮 tiling 和 offset）
   - 應用 fract 來實現重複
   - 應用鏡射變換
   - 採樣紋理

2. **第二層紋理**：
   - 使用獨立的 UV 坐標系統
   - 計算 UV 坐標（使用 layerTilingOffset）
   - 應用 fract 來實現重複
   - 應用獨立的鏡射變換
   - 採樣紋理

## 使用範例

### 範例 1：底層水平鏡射
```typescript
// 在 Cocos Creator 中設定
material.setProperty('baseMirrorH', 1.0); // 開啟水平鏡射
material.setProperty('baseMirrorV', 0.0); // 關閉垂直鏡射
```

### 範例 2：第二層雙向鏡射
```typescript
// 同時開啟第二層的水平和垂直鏡射
material.setProperty('layerMirrorH', 1.0); // 開啟水平鏡射
material.setProperty('layerMirrorV', 1.0); // 開啟垂直鏡射
```

### 範例 3：創建對稱效果
```typescript
// 底層正常，第二層鏡射，創建對稱疊加效果
material.setProperty('baseMirrorH', 0.0);
material.setProperty('baseMirrorV', 0.0);
material.setProperty('layerMirrorH', 1.0);
material.setProperty('layerMirrorV', 0.0);
material.setProperty('layerOpacity', 50.0); // 半透明疊加
```

## 特點優勢

1. **獨立控制**：底層和第二層的鏡射完全獨立，互不影響
2. **靈活性**：可以單獨控制水平或垂直鏡射，或同時開啟
3. **效能優化**：使用簡單的 if 判斷，對效能影響極小
4. **易於使用**：布林型參數（0或1），直觀易懂

## 應用場景

1. **對稱圖案**：創建鏡像對稱的紋理效果
2. **花紋設計**：通過鏡射創建複雜的重複花紋
3. **特效製作**：結合混合模式創建獨特的視覺效果
4. **資源優化**：使用鏡射減少需要的紋理資源
5. **動態效果**：通過腳本控制鏡射開關，創建動態變化效果

## 注意事項

1. 鏡射在 UV tiling 和 offset 之後應用
2. 參數值為浮點數，但建議只使用 0.0 或 1.0
3. 鏡射不影響其他效果（HSV調整、混合模式等）
4. 兩層的鏡射完全獨立，可以創建複雜的組合效果

## 相容性

- Cocos Creator 3.8+
- 支援所有現有的 SpriteUVRepeat 功能
- 向下相容：不設定鏡射參數時，默認為關閉狀態（0.0）
