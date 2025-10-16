# RampColorShader nodeUVScale 自動計算指南

## 概述

`RampColorShader` 現在支持自動計算和設置 `nodeUVScale` 參數，無需手動計算。

## 原理

### 問題背景
Ramp 效果層需要獨立的 UV 系統，不受 sprite tiling 的影響。但不同的 node 有不同的 content size，導致需要為每個 node 計算不同的 UV 縮放因子。

### 解決方案
- **Shader 端**：在 Fragment Shader 中保存原始的 `a_position`（範圍 `[-contentSize/2, contentSize/2]`）
- **腳本端**：在 `RampShaderResetInspector` 組件中自動計算 `nodeUVScale = 1/contentSize * 2`
- **結果**：自動將位置規範化到正確的 [0, 1] UV 範圍

## 自動計算公式

```typescript
const contentSize = uiTransform.contentSize;
const nodeUVScale = new Vec2(
    2.0 / contentSize.width,
    2.0 / contentSize.height
);
```

### 計算過程詳解

1. **位置範圍轉換**：
   - 原始 `a_position` 範圍：`[-contentSize/2, contentSize/2]`
   - 乘以 `nodeUVScale = 2/contentSize`：`[-1, 1]`
   - 加 1.0 再乘 0.5：`[0, 1]`

2. **公式推導**：
   ```
   normalizedUV = (a_position * nodeUVScale + 1.0) * 0.5
                = (a_position * (2/contentSize) + 1.0) * 0.5
   ```

## 使用方法

### 1. 在 Cocos Creator 中使用

只需將 `RampShaderResetInspector` 組件添加到使用 RampColorShader 的 node 上：

1. 選擇 node
2. 在 Inspector 中點擊 "Add Component"
3. 搜索並添加 `RampShaderResetInspector`
4. 在 "Target Sprite" 中選擇該 node 上的 Sprite 組件

**自動化**：
- ✅ 在 `onLoad()` 時自動計算並設置 `nodeUVScale`
- ✅ 在重置參數時自動重新計算 `nodeUVScale`

### 2. 計算驗證

當組件運行時，會在控制台輸出日誌：

```
📐 nodeUVScale set to (0.002874, 0.003704) for node with content size (696, 540)
```

這表示：
- Content Size：696 × 540
- nodeUVScale：(2/696, 2/540) = (0.002874, 0.003704)

### 3. 手動驗證公式

如需驗證，可用計算器驗證：
- Node Width = 696 → nodeUVScale.x = 2 ÷ 696 ≈ 0.00287
- Node Height = 540 → nodeUVScale.y = 2 ÷ 540 ≈ 0.00370

## Shader 實現細節

### Vertex Shader
```glsl
// 直接傳遞原始 a_position（不進行任何假設的計算）
nodeUV = a_position.xy;  // 範圍：[-contentSize/2, contentSize/2]
```

### Fragment Shader - calculateRampCoord
```glsl
float calculateRampCoord(vec2 uv) {
    // 應用 nodeUVScale 進行規範化
    // uv * nodeUVScale：[-1, 1]
    // + 1.0：[0, 2]
    // * 0.5：[0, 1]
    vec2 normalizedUV = (uv * nodeUVScale + 1.0) * 0.5;
    
    // 然後應用 rampUVScale 和 rampUVOffset
    vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
    
    // ... 後續 Ramp 計算
}
```

## 常見問題

### Q1: 為什麼需要 nodeUVScale？
A: 因為不同的 node 有不同的尺寸。例如一個 696×540 的 node 和一個 256×256 的 node 需要不同的 UV 縮放因子才能正確顯示相同的 Ramp 效果。

### Q2: nodeUVScale 會自動更新嗎？
A: 會的。每次重置參數（點擊 "重置所有參數" 按鈕）時，都會自動重新計算 `nodeUVScale`。如果需要在運行時動態更新 node 尺寸，需要手動調用 `updateNodeUVScale()` 方法。

### Q3: 如果沒有 UITransform 組件怎麼辦？
A: 腳本會自動檢查並在找不到 UITransform 時輸出錯誤信息。確保 node 上有 UITransform 組件（通常是自動添加的）。

### Q4: 能否手動設置 nodeUVScale？
A: 可以。自動計算只是默認值。你仍然可以在編輯器中手動修改 nodeUVScale 來實現特殊的效果。

## 完整流程

```
1. 添加 RampShaderResetInspector 組件到 node
   ↓
2. onLoad() 調用 updateNodeUVScale()
   ↓
3. 讀取 UITransform.contentSize
   ↓
4. 計算 nodeUVScale = (2/width, 2/height)
   ↓
5. 設置到材質的 nodeUVScale 屬性
   ↓
6. Shader 接收 nodeUVScale，正確規範化 UV
   ↓
7. Ramp 效果正確顯示，不受 sprite tiling 影響
```

## 測試確認

測試時請確認：

1. ✅ Ramp 效果覆蓋整個 node
2. ✅ Ramp 效果不被 sprite tiling 切割
3. ✅ 設置 rampUVScale = 1.0 時，效果顯示正常
4. ✅ 改變 rampUVScale 值時，效果按比例變化
5. ✅ 控制台輸出正確的 nodeUVScale 計算值
