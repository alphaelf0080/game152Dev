# RampColorShader 混合模式和 UV Tiling 修復報告

## 修復日期
2025年10月15日

## 問題描述

### 1. Blend Mode 混合方式錯誤
- **問題**：混合模式的計算順序不正確
- **原因**：先應用了混合模式，然後才乘以主紋理，導致混合效果異常

### 2. Tiled UV 沒有重複
- **問題**：設定 tilingOffset 後，紋理沒有正確重複
- **原因**：沒有使用 `fract()` 函數來確保 UV 座標在 0-1 範圍內循環

## 修復方案

### UV Tiling 修復

**修復前：**
```glsl
vec2 mainUV = uv0 * tilingOffset.xy + tilingOffset.zw;
```

**修復後：**
```glsl
vec2 mainUV = fract(uv0 * tilingOffset.xy) + tilingOffset.zw;
```

**說明：**
- `fract()` 函數取得小數部分，確保 UV 值在 0-1 範圍內循環
- 這樣當 tilingOffset.xy > 1.0 時，紋理會正確重複
- offset 在 fract 之後加上，確保偏移正確

### Blend Mode 混合順序修復

**修復前：**
```glsl
// 如果有主紋理，也採樣它
vec4 mainTexColor = texture(mainTexture, mainUV);
o *= mainTexColor;

// 計算 Ramp 座標
float rampCoord = calculateRampCoord(uv0);

// 獲取 Ramp 顏色
vec3 rampColor = getRampColor(rampCoord);

// 應用混合模式
o.rgb = applyBlendMode(o.rgb, rampColor, rampIntensity);
```

**修復後：**
```glsl
// 採樣主紋理（使用 tiling UV）
vec4 mainTexColor = texture(mainTexture, mainUV);

// 計算 Ramp 座標（使用原始 UV）
float rampCoord = calculateRampCoord(uv0);

// 獲取 Ramp 顏色
vec3 rampColor = getRampColor(rampCoord);

// 先將主紋理和 sprite 紋理混合
o.rgb *= mainTexColor.rgb;
o.a *= mainTexColor.a;

// 再應用 Ramp 混合模式（base=原始紋理, blend=rampColor）
o.rgb = applyBlendMode(o.rgb, rampColor, rampIntensity);
```

**說明：**
1. **sprite 紋理採樣**：使用原始 UV（`uv0`），不受 tiling 影響
2. **主紋理採樣**：使用 tiling UV（`mainUV`），支援重複和偏移
3. **混合順序**：
   - 先將 sprite 和主紋理相乘（正常的紋理混合）
   - 再將結果與 rampColor 進行混合模式運算
4. **Alpha 處理**：正確處理透明度通道

## UV 座標使用說明

### 兩種 UV 的用途

1. **原始 UV (`uv0`)**
   - 用於 sprite 紋理採樣
   - 用於計算 Ramp 座標
   - 保持 0-1 範圍，不受 tiling 影響

2. **Tiling UV (`mainUV`)**
   - 只用於主紋理採樣
   - 支援 UV 重複（tiling）
   - 支援 UV 偏移（offset）

## 混合模式工作原理

### 混合公式
```glsl
result = applyBlendMode(base, blend, intensity)
```

- **base**：原始紋理顏色（sprite × mainTexture）
- **blend**：Ramp 顏色（從 rampTexture 或顏色漸變取得）
- **intensity**：混合強度（rampIntensity 參數）

### 16 種混合模式

| 模式編號 | 名稱 | 說明 |
|---------|------|------|
| 0 | Normal | 正常混合 |
| 1 | Multiply | 相乘（變暗） |
| 2 | Screen | 濾色（變亮） |
| 3 | Overlay | 覆蓋（對比） |
| 4 | Darken | 變暗 |
| 5 | Lighten | 變亮 |
| 6 | Color Dodge | 顏色加深 |
| 7 | Color Burn | 顏色加亮 |
| 8 | Hard Light | 強光 |
| 9 | Soft Light | 柔光 |
| 10 | Difference | 差異 |
| 11 | Exclusion | 排除 |
| 12 | Hue | 色相 |
| 13 | Saturation | 飽和度 |
| 14 | Color | 顏色 |
| 15 | Luminosity | 亮度 |

## 使用範例

### 範例 1：2x2 重複紋理
```yaml
tilingOffset: [2.0, 2.0, 0.0, 0.0]  # XY=tiling, ZW=offset
```
- 紋理會在水平和垂直方向各重複 2 次

### 範例 2：偏移紋理
```yaml
tilingOffset: [1.0, 1.0, 0.5, 0.5]
```
- 紋理偏移半個單位

### 範例 3：滾動紋理（需要動畫）
```yaml
tilingOffset: [1.0, 1.0, time * 0.1, 0.0]
```
- 通過動畫改變 offset，實現紋理滾動效果

### 範例 4：Multiply 混合模式
```
BLEND_MODE: 1  # Multiply
rampIntensity: 1.0
```
- Ramp 顏色會與原始紋理相乘
- 適合製作陰影或變暗效果

## 測試步驟

1. **清除快取**
   ```bash
   cd /Users/alpha/Documents/projects/game152Dev/game169
   rm -rf library/ temp/ local/
   ```

2. **重新開啟專案**
   - 在 Cocos Creator 中重新開啟專案

3. **測試 UV Tiling**
   - 選擇使用 RampColorShader 的材質
   - 調整 `tilingOffset` 為 `[2, 2, 0, 0]`
   - 確認主紋理有 2x2 重複

4. **測試 Blend Mode**
   - 設定 `BLEND_MODE` 為 1（Multiply）
   - 確認 Ramp 顏色正確混合到紋理上
   - 嘗試不同的混合模式

## 技術細節

### fract() 函數
```glsl
float fract(float x);  // 返回 x 的小數部分
vec2 fract(vec2 v);    // 對向量的每個分量執行 fract
```

**範例：**
- `fract(0.7) = 0.7`
- `fract(1.3) = 0.3`
- `fract(2.8) = 0.8`
- `fract(vec2(2.3, 1.7)) = vec2(0.3, 0.7)`

這確保了 UV 座標在 0-1 範圍內循環，實現紋理重複效果。

### 混合模式強度控制
```glsl
result = mix(base, blendResult, intensity);
```
- `intensity = 0.0`：完全使用原始顏色
- `intensity = 0.5`：50% 混合
- `intensity = 1.0`：完全使用混合結果

## 相關文件
- [RampColorShader-Guide.md](./RampColorShader-Guide.md) - 完整使用指南
- [RampColorShader-UV-Controls.md](./RampColorShader-UV-Controls.md) - UV 控制詳細說明
- [Cocos-Effect-No-Enum-Support.md](./Cocos-Effect-No-Enum-Support.md) - 關於 enum 不支援的說明

## Git 提交
```bash
git add game169/assets/effect/RampColorShader.effect
git commit -m "Fix blend mode order and UV tiling with fract()"
git push origin main
```
