# RampColorShader 診斷報告

## 檔案狀態檢查

### 1. 檔案資訊
- 檔案大小: 18,458 bytes
- 行數: 506 lines
- 編碼: UTF-8

### 2. 關鍵修改檢查

#### ✅ Properties 區塊
```yaml
spriteTiling: { value: [1.0, 1.0] }
rampUVTiling: { value: [1.0, 1.0] }
rampUVOffsetControl: { value: [0.0, 0.0] }
```

#### ✅ Vertex Shader
```glsl
out vec2 effectUV;
effectUV = a_texCoord;
```

#### ✅ Fragment Shader  
```glsl
in vec2 effectUV;
```

#### ✅ Uniforms
```glsl
vec2 spriteTiling;
vec2 rampUVTiling;
vec2 rampUVOffsetControl;
```

#### ✅ Functions
```glsl
vec2 normalizeEffectUV(vec2 uv) { ... }
float calculateRampCoord(vec2 uv) { ... }
```

#### ✅ Usage
```glsl
float rampCoord = calculateRampCoord(effectUV);
```

## 可能的問題原因

### 1. Cocos Creator 快取問題 ⭐ **最可能**
**症狀**: 語法完全正確但無法載入
**原因**: Cocos Creator 快取了舊版本的編譯結果
**解決方案**:
```powershell
# 完全清除快取
cd C:\projects\game152Dev\game169
Remove-Item temp\ -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item library\ -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item local\ -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item build\ -Recurse -Force -ErrorAction SilentlyContinue

# 重新啟動 Cocos Creator
```

### 2. Meta 檔案損壞
**症狀**: 資源無法識別或載入
**解決方案**:
```powershell
cd C:\projects\game152Dev\game169
Remove-Item assets\effect\RampColorShader.effect.meta -Force
# 重新啟動 Cocos Creator 讓它重新生成 meta 檔案
```

### 3. Uniform 綁定限制
**症狀**: 添加新 uniform 後無法載入
**原因**: 某些 GPU 或 WebGL 實現有 uniform 數量限制
**檢查**: 當前 RampProperties uniform 塊有 17 個變數

**可能的解決方案**: 合併某些 uniform
```glsl
// 原本：
vec2 rampUVTiling;
vec2 rampUVOffsetControl;

// 合併為：
vec4 rampUVTilingOffset;  // xy = tiling, zw = offset
```

### 4. 變數名稱衝突
**症狀**: 特定變數名稱導致編譯失敗
**檢查**: `rampUVOffsetControl` 和既有的 `rampUVOffset` 可能造成混淆

**解決方案**: 重新命名
```glsl
// 將 rampUVOffsetControl 改為 rampUVOffsetAdjust
vec2 rampUVOffsetAdjust;
```

### 5. 函數調用順序問題
**症狀**: 函數在使用前未定義
**檢查**: `normalizeEffectUV` 必須在 `calculateRampCoord` 之前定義

**當前狀態**: ✅ 正確（normalizeEffectUV 在 line 236，calculateRampCoord 在 line 244）

### 6. GLSL 版本兼容性
**症狀**: 某些語法在特定 GLSL 版本不支持
**檢查**: 
- `max(vec2, vec2)` - ✅ 支持
- `fract()` - ✅ 支持
- `if` 語句 - ✅ 支持

## 下一步診斷步驟

### 步驟 1: 獲取具體錯誤訊息
請提供 Cocos Creator 控制台的**完整錯誤訊息**，包括：
- 錯誤類型（Error / Warning）
- 錯誤文字
- 行號（如果有）
- 檔案路徑

### 步驟 2: 測試簡化版本
使用 `RampColorShader_minimal.effect` 測試：
1. 只添加 `spriteTiling` 一個參數
2. 如果成功，逐步添加其他參數
3. 找出具體是哪個修改導致問題

### 步驟 3: 檢查 Cocos Creator 版本
某些功能可能需要特定版本：
- Cocos Creator 3.8.0
- Cocos Creator 3.8.1
- Cocos Creator 3.8.2

### 步驟 4: 測試不同瀏覽器/平台
如果是 WebGL 相關問題：
- Chrome
- Firefox
- Edge
- 原生平台

### 步驟 5: 檢查專案設定
檢查 `settings/project.json` 中的 shader 相關設定

## 建議的測試流程

### Test 1: 原始版本（d58ff30）
```powershell
git checkout d58ff30 -- assets/effect/RampColorShader.effect
```
**預期**: 應該能正常載入
**如果失敗**: 專案或環境有問題

### Test 2: 只添加 properties
添加三個新 properties，但不修改 shader 代碼
**預期**: 應該能正常載入（properties 不會影響編譯）
**如果失敗**: properties 語法有問題

### Test 3: 添加 varying
添加 `effectUV` varying
**預期**: 應該能正常載入
**如果失敗**: varying 數量超過限制

### Test 4: 添加 uniforms
添加三個新 uniforms
**預期**: 應該能正常載入
**如果失敗**: uniform 數量或名稱有問題

### Test 5: 添加函數
添加 `normalizeEffectUV` 函數但不調用
**預期**: 應該能正常載入
**如果失敗**: 函數語法有問題

### Test 6: 完整版本
所有修改都添加
**預期**: 應該能正常載入並運作
**如果失敗**: 回到上一個成功的步驟，仔細檢查差異

## 緊急回退方案

如果所有方法都失敗，使用原始版本 + 手動調整：

```glsl
// 在原始版本的 calculateRampCoord 中
// 不使用 normalizeEffectUV，直接在這裡處理
float calculateRampCoord(vec2 uv) {
    // 手動標準化（假設 Tiled 3x3）
    vec2 normalizedUV = uv / 3.0;  // 硬編碼，不理想但可用
    
    vec2 tiledUV = fract(normalizedUV * tilingOffset.xy) + tilingOffset.zw;
    // ... 其餘代碼不變
}
```

## 總結

**當前狀態**: Shader 語法完全正確，VS Code 無錯誤標記

**最可能的問題**: Cocos Creator 快取問題

**建議行動**:
1. ⭐ 完全清除 Cocos Creator 快取並重啟
2. ⭐ 提供控制台的具體錯誤訊息
3. 嘗試簡化版本逐步測試

