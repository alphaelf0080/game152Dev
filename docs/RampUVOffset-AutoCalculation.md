# RampUVOffset 自動計算完整指南

## 問題解決

**問題**: `rampUVOffset` 無法自動處理

**解決方案**: 實施三層自動計算機制，確保 `rampUVOffset` 始終被正確設置

## 自動計算機制

### 層級 1：初始化時（onLoad）

```typescript
protected onLoad(): void {
    this.updateNodeUVScaleAndOffset();  // ← 立即計算並設置
}
```

- 時機：Component 加載時
- 作用：首次設置 `rampUVOffset`
- 計算：基於當前的 anchorPoint

### 層級 2：實時更新（update）

```typescript
protected update(dt: number): void {
    this.updateRampUVOffsetIfNeeded();  // ← 每幀檢查並更新
}
```

- 時機：編輯器模式下每幀執行
- 作用：監控 anchorPoint 變化
- 優勢：如果在編輯器中改變錨點，立即反映

### 層級 3：參數重置時

```typescript
private resetAllParameters(material: Material): void {
    // ... 計算 rampUVOffset
    material.setProperty('rampUVOffset', rampUVOffset, 0);  // ← 自動重新計算
}
```

- 時機：點擊"重置所有參數"按鈕時
- 作用：重新計算所有參數，包括 `rampUVOffset`
- 特點：**不使用 DEFAULT_VALUES 中的硬編碼值**

## 計算公式

### rampUVOffset 的計算方式

```typescript
// 第一步：獲取 anchorPoint 相對於中心的偏移
const anchorOffsetX = (anchorPoint.x - 0.5) * 2.0;  // [-1, 1] 範圍
const anchorOffsetY = (anchorPoint.y - 0.5) * 2.0;

// 第二步：反向補償，使 Ramp 中心始終在 node 幾何中心
const rampUVOffset = new Vec2(-anchorOffsetX, -anchorOffsetY);
```

### 具體例子

| Anchor Point | 計算過程 | 結果 | 說明 |
|---|---|---|---|
| (0.5, 0.5) | ((0.5-0.5)×2, (0.5-0.5)×2) = (0, 0) | ->(0, 0) | 中心，無偏移 |
| (0, 0) | ((0-0.5)×2, (0-0.5)×2) = (-1, -1) | ->(1, 1) | 左下，補償向右上 |
| (1, 1) | ((1-0.5)×2, (1-0.5)×2) = (1, 1) | ->(-1, -1) | 右上，補償向左下 |
| (0, 1) | ((0-0.5)×2, (1-0.5)×2) = (-1, 1) | ->(1, -1) | 左上，補償向右下 |
| (1, 0) | ((1-0.5)×2, (0-0.5)×2) = (1, -1) | ->(-1, 1) | 右下，補償向左上 |

## 工作流程

```
┌─────────────────────────────────────────┐
│  RampShaderResetInspector 組件加載      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  onLoad() 執行       │
        └──────────┬───────────┘
                   │
                   ▼
   ┌───────────────────────────────┐
   │  updateNodeUVScaleAndOffset()  │
   │  - 讀取 contentSize            │
   │  - 讀取 anchorPoint            │
   │  - 計算 nodeUVScale            │
   │  - 計算 rampUVOffset ◄─── 自動 │
   │  - 設置到材質                  │
   └───────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  每幀運行 update()    │
        └──────────┬───────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐      ┌──────────────────────┐
    │監控reset│      │updateRampUVOffsetIfN│
    │All flag │      │eeded()               │
    └────┬────┘      │- 持續監控 anchorPoin│
         │           │- 實時更新偏移 ◄─ 新增│
         ▼           └──────────────────────┘
    ┌─────────────┐
    │重置參數？   │
    └────┬────────┘
         │ Yes
         ▼
    ┌──────────────────────┐
    │ resetAllParameters() │
    │ - 重新計算所有參數   │
    │ - 計算 rampUVOffset  │◄─── 第三次計算
    └──────────────────────┘
```

## 控制台日誌

### 啟動時（onLoad）

```
📐 nodeUVScale set to (0.002874, 0.003704) for node with content size (696, 540)
🎯 rampUVOffset set to (0, 0) based on anchor point (0.5, 0.5)
```

### 編輯器中改變錨點

```
🎯 rampUVOffset set to (1, 1) based on anchor point (0.0, 0.0)
```

### 點擊重置按鈕

```
🔄 Resetting all RampShader parameters...
✨ nodeUVScale automatically set to (0.002874, 0.003704) based on content size (696, 540)
✨ rampUVOffset automatically set to (0, 0) based on anchor point (0.5, 0.5)
✅ All parameters reset to defaults
```

## 關鍵改進

### 改進 1：多層計算
- ✅ 初始化時計算一次
- ✅ 實時監控並更新
- ✅ 重置時重新計算

### 改進 2：不依賴硬編碼預設值
- ✅ `rampUVOffset` **不再使用** `DEFAULT_VALUES` 中的 `(0, 0)`
- ✅ 始終基於實際的 anchorPoint 動態計算
- ✅ 避免硬編碼值覆蓋正確計算的值

### 改進 3：實時反應編輯器變化
- ✅ 在編輯器中改變 anchorPoint 時，立即反映到 Shader
- ✅ 每幀輕量級檢查和更新
- ✅ 無需手動按按鈕或重新加載

## 使用方法

### 1. 添加組件

選擇使用 RampColorShader 的 node：
1. Inspector → Add Component
2. 搜索 `RampShaderResetInspector`
3. 在 `targetSprite` 中選擇該 node 的 Sprite

### 2. 自動處理

完成！`rampUVOffset` 會自動：
- ✅ 在加載時計算
- ✅ 在編輯器中實時更新
- ✅ 在重置參數時重新計算

### 3. 驗證

檢查控制台日誌確認：
```
🎯 rampUVOffset set to (X, Y) based on anchor point (A, B)
```

## 常見問題

### Q: rampUVOffset 為什麼重要？

A: 不同的 anchorPoint 導致 node 的幾何中心位置不同。不進行補償，Ramp 效果會顯示在錯誤的位置。例如：
- anchorPoint = (0, 0)：node 的左下角是位置原點
- anchorPoint = (0.5, 0.5)：node 的中心是位置原點
- 沒有 rampUVOffset 補償，Ramp 效果會偏移

### Q: 為什麼需要三層計算機制？

A: 確保 `rampUVOffset` 始終正確，即使：
1. Component 首次加載
2. 在編輯器中改變 anchorPoint
3. 點擊重置按鈕
4. 切換場景

### Q: 性能會受影響嗎？

A: 不會。實時更新（`updateRampUVOffsetIfNeeded`）非常輕量級：
- 只讀取兩個簡單值
- 簡單的算術運算
- 只在值變化時設置 Shader 屬性
- 只在編輯器模式運行

### Q: 能否手動設置 rampUVOffset？

A: 可以。但不推薦。自動計算涵蓋所有常見場景。如需特殊效果，可以在運行時通過腳本修改。

## 完整工作流程示例

```
1. 創建 node，設置 Content Size = (696, 540)
   
2. 添加 Sprite 和 RampColorShader
   
3. 添加 RampShaderResetInspector 組件
   
4. Component 加載
   ↓
   🎯 rampUVOffset 自動設置為 (0, 0)

5. 編輯器中改變 Anchor Point 為 (0, 0)
   ↓
   🎯 rampUVOffset 自動更新為 (1, 1)

6. 點擊"重置所有參數"按鈕
   ↓
   🎯 rampUVOffset 重新計算為 (0, 0)（因為 anchorPoint 已改回）

7. 在任何情況下，Ramp 效果始終正確顯示
   ✅ 完成
```

## 技術細節

### updateNodeUVScaleAndOffset()

```typescript
private updateNodeUVScaleAndOffset(): void {
    // 獲取 UITransform
    // 計算 nodeUVScale = 2.0 / contentSize
    // 計算 rampUVOffset = -(anchorPoint - 0.5) * 2.0
    // 設置到材質
}
```

**呼叫時機**：
- onLoad() 時一次
- 需要時手動調用

### updateRampUVOffsetIfNeeded()

```typescript
private updateRampUVOffsetIfNeeded(): void {
    // 獲取當前 anchorPoint
    // 計算 rampUVOffset
    // 設置到材質
}
```

**呼叫時機**：
- 每幀自動調用（編輯器模式）
- 輕量級實時監控

### resetAllParameters()

```typescript
private resetAllParameters(material: Material): void {
    // 首先計算 nodeUVScale 和 rampUVOffset
    // 然後設置所有其他參數
    // 注意：不使用 DEFAULT_VALUES.rampUVOffset
}
```

**呼叫時機**：
- 點擊"重置所有參數"按鈕時

## 總結

`rampUVOffset` 現在是**完全自動化**的：

| 操作 | 自動化程度 |
|---|---|
| 初始化 | ✅ 完全自動 |
| 編輯器改變 anchorPoint | ✅ 實時自動 |
| 重置參數 | ✅ 自動重新計算 |
| 手動設置 | ⚠️ 可以但不推薦 |

無需再手動計算或設置任何數值！
