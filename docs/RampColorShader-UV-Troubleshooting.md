# RampColorShader UV 問題診斷指南

## 問題：Shader 被 Sprite Tiled 效果分割

### 快速診斷步驟

#### 步驟 1: 可視化 UV（添加調試代碼）

在 `frag()` 函數中，在 `return o;` 之前添加以下代碼來可視化 UV：

```glsl
vec4 frag () {
    vec4 o = vec4(1, 1, 1, 1);
    
    // ... 原有代碼 ...
    
    // === 調試代碼開始 ===
    // 取消註解以下其中一行來可視化不同的 UV
    
    // 1. 顯示 effectUV（應該每個 tile 都是 0-1 的漸變）
    o.rgb = vec3(effectUV, 0.0);
    return o;
    
    // 2. 顯示 tileInfo（不同 tile 應該有不同顏色）
    // o.rgb = vec3(tileInfo / tilingOffset.xy, 0.0);
    // return o;
    
    // 3. 顯示 globalUV（整個 sprite 應該是連續的 0-1 漸變）
    // vec2 globalUV = (tileInfo + effectUV) / tilingOffset.xy;
    // o.rgb = vec3(globalUV, 0.0);
    // return o;
    // === 調試代碼結束 ===
    
    ALPHA_TEST(o);
    return o;
}
```

#### 步驟 2: 確認參數設定

**Critical: 檢查 tilingOffset.xy 是否正確設定**

在 Cocos Creator Inspector 中：

| Sprite Type | tilingOffset 應該設為 |
|------------|---------------------|
| SIMPLE | `[1, 1, 0, 0]` |
| TILED 2x2 | `[2, 2, 0, 0]` |
| TILED 3x3 | `[3, 3, 0, 0]` |
| TILED 5x3 | `[5, 3, 0, 0]` |

⚠️ **如果這個值不正確，shader 絕對會被分割！**

### 診斷結果分析

#### 情況 A: effectUV 顯示每個 tile 都重複 0-1 漸變
**表示**: `fract(a_texCoord)` 正常工作
**問題**: 可能在 globalUV 計算中出錯
**解決**: 檢查 tilingOffset.xy 是否正確

#### 情況 B: effectUV 顯示整個 sprite 是一個完整的漸變
**表示**: `fract()` 沒有生效，或者 sprite 是 SIMPLE 類型
**問題**: Vertex shader 的 effectUV 計算可能有誤
**解決**: 檢查 sprite 類型設定

#### 情況 C: tileInfo 顯示所有 tile 都是同一顏色
**表示**: `floor(a_texCoord)` 沒有正確提取 tile 索引
**問題**: Sprite 可能是 SIMPLE 類型，或者引擎問題
**解決**: 確認 Sprite Type 設為 TILED

#### 情況 D: globalUV 不連續，在每個 tile 邊界跳躍
**表示**: globalUV 計算公式有問題
**問題**: tilingOffset.xy 設定錯誤
**解決**: 修正 tilingOffset.xy

### 常見問題與解決方案

#### 問題 1: 每個 tile 都重複同樣的 Ramp 效果

**原因**: 
- `tilingOffset.xy` 設為 `[1, 1]` 但 sprite 是 TILED 3x3
- globalUV 計算被跳過或錯誤

**解決**:
```yaml
# 對於 TILED 3x3 sprite
tilingOffset: [3, 3, 0, 0]  # 必須設為 3,3！
rampUVScale: [1, 1]         # 不重複
```

#### 問題 2: Ramp 效果完全錯亂

**原因**:
- effectUV 沒有正確傳遞
- tileInfo 計算錯誤

**檢查 Vertex Shader**:
```glsl
// 確保這兩行存在
effectUV = fract(a_texCoord);  // ✅ 正確
tileInfo = floor(a_texCoord);  // ✅ 正確

// 錯誤示例:
// effectUV = a_texCoord;  // ❌ 缺少 fract()
```

#### 問題 3: SIMPLE sprite 上也有問題

**原因**:
- `tilingOffset.xy` 沒有設為 `[1, 1]`
- globalUV 計算除以錯誤的值

**解決**:
```yaml
# 對於 SIMPLE sprite
tilingOffset: [1, 1, 0, 0]  # 必須設為 1,1！
```

### 完整測試流程

#### 測試 1: SIMPLE Sprite

1. **創建測試場景**:
   - 新增 Sprite 節點
   - Sprite Type: SIMPLE
   - 指定任意紋理

2. **設定 Material**:
   ```yaml
   tilingOffset: [1, 1, 0, 0]
   rampUVScale: [1, 1]
   RAMP_DIRECTION: 0  # 水平
   BLEND_MODE: 1      # Multiply
   colorStart: [1, 0, 0, 1]  # 紅色
   colorEnd: [0, 0, 1, 1]    # 藍色
   ```

3. **預期結果**:
   - 從左到右的紅→藍漸變
   - 整個 sprite 一個完整的漸變

#### 測試 2: TILED 3x3 Sprite

1. **創建測試場景**:
   - 新增 Sprite 節點
   - Sprite Type: TILED
   - Size Type: CUSTOM
   - Size: 任意大小（會自動 3x3 tiling）

2. **設定 Material**:
   ```yaml
   tilingOffset: [3, 3, 0, 0]  # ⚠️ 關鍵！必須是 3,3
   rampUVScale: [1, 1]
   RAMP_DIRECTION: 0  # 水平
   BLEND_MODE: 1
   colorStart: [1, 0, 0, 1]
   colorEnd: [0, 0, 1, 1]
   ```

3. **預期結果**:
   - 整個 3x3 sprite 從左到右的連續漸變
   - 跨越所有 9 個 tiles
   - 沒有重複或跳躍

#### 測試 3: TILED 3x3 + Ramp 重複

1. **使用測試 2 的設定**

2. **修改參數**:
   ```yaml
   rampUVScale: [3, 1]  # 水平重複 3 次
   ```

3. **預期結果**:
   - 整個 sprite 上有 3 次完整的紅→藍漸變
   - 每個 tile 列（垂直方向）有一次完整漸變

### 調試輸出建議

在 `calculateRampCoord()` 函數開頭添加：

```glsl
float calculateRampCoord(vec2 uv) {
    vec2 tileCount = max(tilingOffset.xy, vec2(1.0, 1.0));
    vec2 uvInTile = uv;
    vec2 globalUV = (tileInfo + uvInTile) / tileCount;
    
    // === 調試輸出 ===
    // 取消註解來輸出中間值（通過顏色可視化）
    
    // 檢查 tile 數量
    // return tileCount.x / 10.0;  // 應該顯示灰色（3/10 = 0.3）
    
    // 檢查 tile 索引
    // return tileInfo.x / tileCount.x;  // 每列不同灰度
    
    // 檢查 globalUV
    // return globalUV.x;  // 整個 sprite 應該是連續漸變
    // === 調試輸出結束 ===
    
    // ... 繼續正常計算 ...
}
```

### Cocos Creator 設定檢查清單

#### Sprite 組件
- [ ] Sprite Type 設為 TILED
- [ ] Size Type 設為 CUSTOM（或其他非預設值）
- [ ] Trim 關閉（避免 UV 偏移）

#### Material 參數
- [ ] tilingOffset.xy = Sprite 的實際 tile 數量
- [ ] rampUVScale = 期望的 Ramp 重複次數
- [ ] RAMP_DIRECTION = 選擇正確的方向
- [ ] USE_TEXTURE = 勾選（確保 sprite 紋理顯示）

#### 常見錯誤設定
❌ tilingOffset = `[1, 1, 0, 0]` 但 Sprite Type = TILED 3x3
❌ rampUVScale 設得太大導致看起來像分割
❌ 忘記清除 Cocos Creator 的 cache

### 如果問題仍然存在

#### 方案 A: 簡化測試
暫時移除所有複雜功能，只保留基本的水平漸變：

```glsl
vec4 frag () {
    vec4 o = vec4(1, 1, 1, 1);
    
    #if USE_TEXTURE
      o *= CCSampleWithAlphaSeparated(cc_spriteTexture, uv0);
    #endif
    
    // 直接使用 globalUV 測試
    vec2 globalUV = (tileInfo + effectUV) / max(tilingOffset.xy, vec2(1.0));
    
    // 簡單的水平漸變
    o.rgb *= mix(vec3(1, 0, 0), vec3(0, 0, 1), globalUV.x);
    
    return o;
}
```

#### 方案 B: 檢查引擎版本
Cocos Creator 3.8.x 的不同小版本可能有不同的 UV 處理方式。

確認：
- Cocos Creator 版本
- 是否有自定義的 sprite 組件
- 是否使用了特殊的 render 模式

#### 方案 C: 強制重新編譯
```bash
cd /path/to/game169
rm -rf library/ temp/ local/
# 重新開啟 Cocos Creator
```

### 預期行為總結

| Sprite Type | tilingOffset | Ramp 行為 |
|------------|--------------|-----------|
| SIMPLE | [1, 1, _, _] | 整個 sprite 一次漸變 |
| TILED 3x3 | [3, 3, _, _] | 整個 9-tile sprite 一次連續漸變 |
| TILED 3x3 | [1, 1, _, _] | ❌ 每個 tile 重複（錯誤設定） |
| TILED 3x3 + rampUVScale [3,1] | [3, 3, _, _] | 整個 sprite 水平重複 3 次 |

### 聯絡支援

如果經過以上所有步驟仍然無法解決，請提供：

1. **螢幕截圖**: 
   - 顯示 effectUV 的調試輸出
   - 顯示 globalUV 的調試輸出
   - Inspector 中的所有 material 參數

2. **配置信息**:
   - Sprite Type
   - Sprite Size
   - tilingOffset 值
   - rampUVScale 值

3. **Cocos Creator 版本**: 例如 3.8.4

4. **預期 vs 實際**: 描述你期望看到什麼，以及實際看到了什麼
