# rampUVOffset 自動化驗證指南

## 問題診斷

如果 `rampUVOffset` 沒有被自動化，可能的原因：

### ❌ 問題 1：`update` 被 EDITOR 條件阻擋
**症狀**：運行時 rampUVOffset 沒有更新

**原因**：之前的代碼在 `update` 開始時檢查 `if (!EDITOR) return;`，導致運行時不執行

**解決**：✅ 已修復
- `updateRampUVOffsetIfNeeded()` 現在在 `update` 最開始執行
- `EDITOR` 檢查只作用於重置檢查，不影響 `rampUVOffset` 更新

### ❌ 問題 2：每幀更新不穩定
**症狀**：rampUVOffset 時有時無

**原因**：可能條件檢查過多導致某些幀跳過

**解決**：✅ 已改進
- 簡化邏輯，直接計算和設置
- 移除不必要的條件檢查
- 確保每幀都執行

## 驗證步驟

### 1️⃣ 在 Cocos Creator 中測試

#### 測試 A：基礎自動化
```
1. 創建一個 node，設置 Content Size = (696, 540)
2. 添加 Sprite 和 RampColorShader
3. 添加 RampShaderResetInspector 組件
4. 在 Inspector 中查看 rampUVOffset 值
   期望：應該顯示計算後的值，不是 (0, 0)
```

#### 測試 B：改變錨點後自動更新
```
1. 在 Inspector 中改變 Node 的 Anchor Point
   例如：從 (0.5, 0.5) 改為 (0, 0)
   
2. 立即查看 rampUVOffset 值
   期望：應該自動變為 (1, 1)
   
3. 改為 (1, 1)
   期望：應該自動變為 (-1, -1)
```

#### 測試 C：運行時檢查
```
1. 點擊 Play 按鈕開始運行
2. 打開 Console 面板
3. 添加以下代碼到腳本進行驗證：
   
   private lastRampUVOffset: Vec2 = new Vec2(0, 0);
   
   private updateNodeUVScaleAndOffset(): void {
       // ... 現有代碼 ...
       console.log(`✅ rampUVOffset update: ${rampUVOffset}`);
   }
   
4. 期望：在 Console 中看到每幀的更新日誌
```

## 工作流程確認

### 完整的自動化流程

```
Component 加載 (onLoad)
    ↓
updateNodeUVScaleAndOffset()
    - 計算 nodeUVScale ✅
    - 計算 rampUVOffset ✅
    - 設置到材質 ✅
    ↓
Console 輸出：
📐 nodeUVScale set to ...
🎯 rampUVOffset set to ...

    ↓
    ↓
每幀運行 (update) ← ✅ 現在在運行時也執行
    ↓
updateRampUVOffsetIfNeeded()
    - 讀取當前 anchorPoint ✅
    - 計算 rampUVOffset ✅
    - 設置到材質 ✅
    ↓
編輯器中改變 anchorPoint
    ↓
    ↓ (下一幀)
    ↓
updateRampUVOffsetIfNeeded()
    - 讀取新的 anchorPoint ✅
    - 重新計算 rampUVOffset ✅
    - 立即反映變化 ✅
```

## 关键修复

### 修復前的問題
```typescript
protected update(dt: number): void {
    if (!EDITOR) {
        return;  // ❌ 運行時直接返回，不執行 updateRampUVOffsetIfNeeded
    }
    this.checkAndResetIfNeeded();
    this.updateRampUVOffsetIfNeeded();  // ❌ 永遠到不了
}
```

### 修復後的改進
```typescript
protected update(dt: number): void {
    this.updateRampUVOffsetIfNeeded();  // ✅ 先執行，運行時也有效
    
    if (!EDITOR) {
        return;  // ✅ 只在運行時跳過重置檢查
    }
    
    this.checkAndResetIfNeeded();  // ✅ 編輯器模式才檢查重置
}
```

## 預期行為檢查表

### ✅ onLoad 時
- [ ] Console 輸出 `📐 nodeUVScale set to ...`
- [ ] Console 輸出 `🎯 rampUVOffset set to ...`
- [ ] rampUVOffset 不是 (0, 0)（除非 anchorPoint 正好是 0.5, 0.5）

### ✅ 編輯器中改變 anchorPoint 時
- [ ] 實時看到 Inspector 中 rampUVOffset 值改變
- [ ] 無需點擊任何按鈕，立即生效
- [ ] rampUVOffset = -(anchorPoint - 0.5) * 2.0

### ✅ 運行時
- [ ] 遊戲運行中，改變節點的錨點
- [ ] rampUVOffset 自動更新
- [ ] Ramp 效果位置始終正確

### ✅ 重置參數時
- [ ] Console 輸出 `✨ rampUVOffset automatically set to ...`
- [ ] rampUVOffset 重新根據當前 anchorPoint 計算
- [ ] 不使用硬編碼的 (0, 0) 預設值

## 調試技巧

### 1. 添加調試日誌
修改 `updateRampUVOffsetIfNeeded()` 添加日誌：

```typescript
private updateRampUVOffsetIfNeeded(): void {
    if (!this.targetSprite || !this.targetSprite.customMaterial) {
        return;
    }
    
    try {
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            const anchorPoint = uiTransform.anchorPoint;
            const anchorOffsetX = (anchorPoint.x - 0.5) * 2.0;
            const anchorOffsetY = (anchorPoint.y - 0.5) * 2.0;
            const rampUVOffset = new Vec2(-anchorOffsetX, -anchorOffsetY);
            this.targetSprite.customMaterial.setProperty('rampUVOffset', rampUVOffset, 0);
            
            // 調試：每 60 幀輸出一次
            if (frameCount % 60 === 0) {
                console.log(`[Debug] rampUVOffset: (${rampUVOffset.x}, ${rampUVOffset.y})`);
            }
        }
    } catch (error) {
        console.error('Error updating rampUVOffset:', error);
    }
}
```

### 2. 檢查 Material 是否存在
```typescript
console.log('targetSprite:', this.targetSprite);
console.log('customMaterial:', this.targetSprite?.customMaterial);
console.log('UITransform:', this.node.getComponent(UITransform));
```

### 3. 驗證 Shader 是否接收參數
在 Shader 中添加臨時調試代碼：
```glsl
// Fragment Shader 中
float rampCoord = calculateRampCoord(nodeUV);

// 調試：使用 rampUVOffset 的值來著色
// vec3 debugColor = vec3(abs(rampUVOffset), 0.0);
// 如果看到不同顏色，說明 rampUVOffset 在改變
```

## 確認修復成功

如果你看到：

```
✅ onLoad 時自動設置 rampUVOffset
✅ 編輯器中改變 anchorPoint 時自動更新
✅ 運行時持續監控並更新
✅ 每幀都有正確的值
✅ 不依賴硬編碼預設值
```

那麼 **rampUVOffset 自動化已成功！** 🎉
