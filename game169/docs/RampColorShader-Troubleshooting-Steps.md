# RampColorShader 載入失敗排查步驟

## 當前狀態 (2025-10-16)
- ✅ Shader 語法完全正確
- ✅ 所有 properties 格式正確
- ✅ 所有 uniforms 正確定義
- ✅ varying 變數正確宣告
- ✅ VS Code 語法檢查通過

## 如果 Cocos Creator 仍顯示載入失敗

### 步驟 1: 清除快取並重新載入
1. **關閉 Cocos Creator**
2. **刪除快取目錄**：
   ```
   刪除: C:\projects\game152Dev\game169\temp\
   刪除: C:\projects\game152Dev\game169\library\
   ```
3. **重新啟動 Cocos Creator**
4. **等待資源重新編譯**（可能需要幾分鐘）

### 步驟 2: 檢查控制台錯誤
在 Cocos Creator 中打開控制台（Console），查看具體錯誤訊息：
- **語法錯誤**：會顯示行號和錯誤類型
- **連結錯誤**：會顯示 uniform 或 varying 不匹配
- **編譯錯誤**：會顯示 GLSL 編譯器的錯誤

### 步驟 3: 驗證檔案完整性
```powershell
# 確認檔案大小（應該約 16-17 KB）
cd C:\projects\game152Dev\game169
(Get-Item assets/effect/RampColorShader.effect).Length

# 確認檔案行數（應該是 501 行）
(Get-Content assets/effect/RampColorShader.effect).Count
```

### 步驟 4: 逐步測試

#### 4.1 測試基礎版本（不使用新功能）
創建一個測試場景，使用 Simple Sprite，設定參數：
```
spriteTiling: (1, 1)
rampUVTiling: (1, 1)
rampUVOffsetControl: (0, 0)
```
這應該產生與原始版本相同的效果。

#### 4.2 測試 Tiled Sprite
- Sprite Type: Tiled 2x2
- spriteTiling: (2, 2)
- 觀察效果是否正確（不應重複）

### 步驟 5: 回退測試
如果仍然失敗，可以回退到穩定版本：
```powershell
cd C:\projects\game152Dev\game169
git checkout d58ff30 -- assets/effect/RampColorShader.effect
```

然後在 Cocos Creator 中確認穩定版本可以載入。

### 步驟 6: 增量測試
從穩定版本開始，逐步添加修改：

1. **只添加 properties**（不修改 shader 代碼）
2. **添加 effectUV varying**
3. **添加 uniforms**
4. **添加 normalizeEffectUV 函數**
5. **修改 calculateRampCoord**
6. **修改主函數調用**

每一步都在 Cocos Creator 中驗證是否能載入。

## 可能的具體錯誤及解決方案

### 錯誤 1: "varying not matching"
**原因**: vertex shader 和 fragment shader 的 varying 宣告不一致
**檢查**:
- Vertex shader: `out vec2 effectUV;`
- Fragment shader: `in vec2 effectUV;`

### 錯誤 2: "uniform not found"
**原因**: properties 和 uniforms 不匹配
**檢查**: 
- properties 中的 `spriteTiling`、`rampUVTiling`、`rampUVOffsetControl`
- uniforms 中的對應變數

### 錯誤 3: "syntax error"
**原因**: GLSL 語法錯誤
**檢查**:
- 函數定義是否完整
- 分號是否遺漏
- 括號是否配對

### 錯誤 4: "type mismatch"
**原因**: 變數類型不匹配
**檢查**:
- `spriteTiling` 應該是 `vec2`
- `rampUVTiling` 應該是 `vec2`
- `rampUVOffsetControl` 應該是 `vec2`

## 確認修改內容

### 應該修改的地方（共 6 處）

1. **Properties 區塊**（添加 3 行）:
```yaml
spriteTiling: { value: [1.0, 1.0], ... }
rampUVTiling: { value: [1.0, 1.0], ... }
rampUVOffsetControl: { value: [0.0, 0.0], ... }
```

2. **Vertex Shader - out 宣告**（添加 1 行）:
```glsl
out vec2 effectUV;
```

3. **Vertex Shader - 賦值**（添加 1 行）:
```glsl
effectUV = a_texCoord;
```

4. **Fragment Shader - in 宣告**（添加 1 行）:
```glsl
in vec2 effectUV;
```

5. **Fragment Shader - uniforms**（添加 3 行）:
```glsl
vec2 spriteTiling;
vec2 rampUVTiling;
vec2 rampUVOffsetControl;
```

6. **Fragment Shader - normalizeEffectUV 函數**（添加 3 行）:
```glsl
vec2 normalizeEffectUV(vec2 uv) {
    return uv / max(spriteTiling, vec2(1.0, 1.0));
}
```

7. **Fragment Shader - calculateRampCoord 修改**（修改 3 行）:
```glsl
vec2 normalizedUV = normalizeEffectUV(uv);
vec2 tiledUV = fract(normalizedUV * rampUVTiling) + rampUVOffsetControl;
```

8. **Fragment Shader - 主函數調用**（修改 1 行）:
```glsl
float rampCoord = calculateRampCoord(effectUV);
```

## 驗證清單

- [ ] 檔案大小正常（約 16-17 KB）
- [ ] 檔案行數正常（501 行）
- [ ] VS Code 沒有語法錯誤標記
- [ ] `useMainTexture` 是 `value: 0.0` 而非 `value: [0.0]`
- [ ] 所有 vec2 properties 使用 `[1.0, 1.0]` 格式
- [ ] vertex shader 有 `out vec2 effectUV;`
- [ ] fragment shader 有 `in vec2 effectUV;`
- [ ] uniforms 有 `vec2 spriteTiling;` 等三個變數
- [ ] 有 `normalizeEffectUV()` 函數
- [ ] `calculateRampCoord` 使用新的 UV 系統
- [ ] 主函數調用 `calculateRampCoord(effectUV)`

## 聯絡資訊
如果以上步驟都無法解決問題，請提供：
1. Cocos Creator 控制台的完整錯誤訊息
2. Cocos Creator 版本號
3. 作業系統版本
4. 截圖（如果有視覺化的錯誤提示）
