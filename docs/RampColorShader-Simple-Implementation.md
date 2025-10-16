# RampColorShader 最簡化實現 - nodeUVScale 自動化

## 問題回顧

用户需要：**Ramp 效果層有獨立的 UV 系統，整個 node 的 content size 對應 0~1 的 UV 範圍，不受 sprite tiling 切割**

## 解決方案

### 核心原理

Shader 中：
- `a_position` 的範圍是 `[-contentSize/2, contentSize/2]`
- 需要轉換為 `[0, 1]` 的 UV 範圍
- **公式**：`normalizedUV = (a_position * nodeUVScale + 1.0) * 0.5`
- 其中 `nodeUVScale = 2.0 / contentSize`

### 自動化實現

**文件**：`RampShaderResetInspector.ts`

**只做一件事**：自動計算和設置 `nodeUVScale`

```typescript
private updateNodeUVScale(): void {
    const uiTransform = this.node.getComponent(UITransform);
    if (uiTransform) {
        const contentSize = uiTransform.contentSize;
        const nodeUVScale = new Vec2(
            2.0 / contentSize.width,
            2.0 / contentSize.height
        );
        material.setProperty('nodeUVScale', nodeUVScale, 0);
    }
}
```

## 工作流程

```
1. 添加 RampShaderResetInspector 組件到 node
2. onLoad() 時調用 updateNodeUVScale()
3. 自動計算 nodeUVScale = 2.0 / contentSize
4. 設置到 Shader 材質
5. Ramp 效果正確顯示，不受 tiling 影響
```

## 使用方法

### 在 Cocos Creator 中

1. 選擇使用 RampColorShader 的 node
2. Add Component → RampShaderResetInspector
3. 在 targetSprite 中選擇該 node 的 Sprite 組件
4. **完成！** nodeUVScale 自動設置

### 驗證

在 Inspector 中查看 Node UV Scale 的值：

**例子**：Content Size = (696, 540)
```
Node UV Scale: (0.002874, 0.003704)
計算：2/696 ≈ 0.002874, 2/540 ≈ 0.003704 ✅
```

## 參數說明

### Shader 中的關鍵參數

| 參數 | 類型 | 說明 |
|---|---|---|
| `nodeUVScale` | Vec2 | **自動化** - 基於 content size 計算 |
| `rampUVScale` | Vec2 | **用戶調整** - 控制 ramp 重複次數（1.0 = 不重複） |
| `rampUVOffset` | Vec2 | **用戶調整** - 控制 ramp 位置偏移（通常保持 0, 0） |

### 配置步驟

1. **Content Size**：確保 Node 上有正確的 UITransform Content Size
2. **Sprite**：設置 RampColorShader 作為自定義材質
3. **nodeUVScale**：自動設置 ✅
4. **rampUVScale**：在編輯器中調整（1.0 為默認）
5. **rampUVOffset**：保持 (0, 0)（或用戶手動調整）

## 完整示例

### 場景配置

```
Node "RampSprite"
├─ Content Size: (696, 540)
├─ Anchor Point: (0.5, 0.5)  ← 任何值都可以
├─ Components:
│  ├─ UITransform ✅ (自動)
│  ├─ Sprite ✅
│  │  └─ Custom Material: RampColorShader
│  └─ RampShaderResetInspector ← 添加這個
```

### Shader 設置（Inspector）

```
Effect: RampColorShader
Technique: 0

Pass 0:
  Tiling & Offset: (1, 1, 0, 0)           ← 主紋理
  Ramp UV Tiling: (1, 1)                  ← rampUVScale
  Ramp UV Offset: (0, 0)                  ← rampUVOffset
  Node UV Scale: (0.002874, 0.003704)     ← nodeUVScale ✅ 自動
  
  其他參數: 根據需要調整
```

## 常見問題

### Q1：Node UV Scale 為什麼是這個值？

A：基於 node 的 content size 自動計算：
- Content Size = (696, 540)
- nodeUVScale.x = 2.0 / 696 ≈ 0.002874
- nodeUVScale.y = 2.0 / 540 ≈ 0.003704

### Q2：改變 Content Size 後需要手動更新嗎？

A：**不需要**。下次重啟遊戲或點擊"重置所有參數"按鈕時會自動重新計算。

編輯器中改變 Content Size 後，可以：
- 方法 1：重新加載場景
- 方法 2：手動點擊"重置所有參數"按鈕
- 方法 3：重啟 Cocos Creator

### Q3：為什麼 Ramp 效果還是被 tiling 切割？

A：檢查以下幾點：
1. ✅ 是否添加了 RampShaderResetInspector 組件？
2. ✅ 是否設置了 targetSprite？
3. ✅ Shader 中是否在使用 `nodeUVScale`？
4. ✅ Console 是否有初始化日誌？

如果都正確但還是有問題，檢查 Shader 代碼中 `calculateRampCoord` 函數是否正確應用了 `nodeUVScale`。

### Q4：Node UV Scale 應該設置什麼值？

A：**不要手動設置**，讓腳本自動計算。如果需要特殊效果，調整：
- `rampUVScale`：改變 ramp 重複
- `rampUVOffset`：改變 ramp 位置

### Q5：不同大小的 node 需要不同的設置嗎？

A：**不需要**。nodeUVScale 會根據每個 node 的 content size 自動計算。每個使用 RampShaderResetInspector 的 node 都會有正確的值。

## Shader 實現細節

### Vertex Shader

```glsl
// 直接傳遞 a_position
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
    
    // 應用 rampUVScale 和 rampUVOffset
    vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
    
    // ... 後續 ramp 計算（方向、中心、範圍等）...
}
```

## 總結

✅ **完全自動化**：
- nodeUVScale 根據 content size 自動計算
- 無需手動設置任何參數
- 每個 node 自動適配

✅ **簡潔高效**：
- 只修改一個腳本
- 只自動化一個參數
- 用戶可自由調整其他參數

✅ **使用方便**：
- 添加組件即可
- 無需配置
- 立即有效

---

**現在 Ramp 效果應該能正確顯示，不受 sprite tiling 切割！**
