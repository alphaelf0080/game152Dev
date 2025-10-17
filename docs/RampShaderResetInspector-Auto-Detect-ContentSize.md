# RampShaderResetInspector - 自動檢測 ContentSize 變化

## 📅 更新日期
2025-10-17

## 🎯 新功能：自動偵測 ContentSize 變化

### 問題
之前當在 Inspector 中修改 ContentSize 時，`rampUVOffset` 不會自動更新。

### 解決方案
添加了自動偵測機制，在編輯器模式下持續監控 ContentSize 的變化。

---

## 🔧 實現細節

### 1. 添加狀態追蹤變量

```typescript
private lastContentSizeWidth: number = 0;
private lastContentSizeHeight: number = 0;
```

### 2. 在 onLoad 中初始化

```typescript
protected onLoad(): void {
    // ... 其他初始化代碼
    
    // 初始化 ContentSize 記錄
    const uiTransform = this.node.getComponent(UITransform);
    if (uiTransform) {
        this.lastContentSizeWidth = uiTransform.contentSize.width;
        this.lastContentSizeHeight = uiTransform.contentSize.height;
    }
    
    // 初始化時自動設置 nodeUVScale
    if (this.autoCalculateOnLoad) {
        this.updateNodeUVScale();
    }
}
```

### 3. 在 update 中檢測變化

```typescript
protected update(dt: number): void {
    // 只在編輯器模式下運行
    if (!EDITOR) {
        return;
    }
    
    // 檢測 ContentSize 變化並自動更新
    this.checkContentSizeChange();
    
    this.checkAndResetIfNeeded();
}
```

### 4. 檢測變化的方法

```typescript
private checkContentSizeChange(): void {
    if (!this.targetSprite) {
        return;
    }
    
    try {
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            const currentWidth = uiTransform.contentSize.width;
            const currentHeight = uiTransform.contentSize.height;
            
            // 檢測是否有變化
            if (currentWidth !== this.lastContentSizeWidth || 
                currentHeight !== this.lastContentSizeHeight) {
                
                if (this.showDetailedLogs && this.lastContentSizeWidth > 0) {
                    console.log(`📏 ContentSize 變化偵測:`);
                    console.log(`   從 [${this.lastContentSizeWidth}, ${this.lastContentSizeHeight}]`);
                    console.log(`   到 [${currentWidth}, ${currentHeight}]`);
                    console.log(`   🔄 自動重新計算 UV 參數...`);
                }
                
                // 更新記錄的尺寸
                this.lastContentSizeWidth = currentWidth;
                this.lastContentSizeHeight = currentHeight;
                
                // 自動重新計算
                this.updateNodeUVScale();
            }
        }
    } catch (error) {
        // 靜默處理錯誤
    }
}
```

---

## 📊 工作流程

### 1. 初始加載
```
onLoad()
  ↓
初始化 lastContentSize = [696, 540]
  ↓
執行 updateNodeUVScale()
  ↓
設置 nodeUVScale + rampUVOffset
```

### 2. ContentSize 改變
```
在 Inspector 中修改 ContentSize: [696, 540] → [1024, 768]
  ↓
update() 每幀執行
  ↓
checkContentSizeChange() 檢測到變化
  ↓
輸出日誌:
  📏 ContentSize 變化偵測:
     從 [696, 540]
     到 [1024, 768]
     🔄 自動重新計算 UV 參數...
  ↓
執行 updateNodeUVScale()
  ↓
重新計算:
  nodeUVScale = [2/1024, 2/768] = [0.001953, 0.002604]
  rampUVOffset = [215.76/1024, 129.60/768] = [0.210742, 0.168750]
  ↓
更新 Material 屬性
  ↓
更新 lastContentSize = [1024, 768]
```

---

## 🎨 使用示例

### 在 Cocos Creator Inspector 中

#### 步驟 1: 初始設置
1. 選擇節點
2. ContentSize 設為 [696, 540]
3. 查看 Console:
   ```
   📐 RampUV 精準計算結果:
      ContentSize: (696, 540)
      NodeUVScale: (0.002874, 0.003704)
      RampUVOffset (自動): (0.3100, 0.2400)
      ↳ 像素偏移: (215.8px, 129.6px)
   ```

#### 步驟 2: 修改 ContentSize
1. 在 Inspector 中修改 ContentSize 為 [1024, 768]
2. 觀察 Console 輸出:
   ```
   📏 ContentSize 變化偵測:
      從 [696, 540]
      到 [1024, 768]
      🔄 自動重新計算 UV 參數...
   
   📐 RampUV 精準計算結果:
      ContentSize: (1024, 768)
      NodeUVScale: (0.001953, 0.002604)
      RampUVOffset (自動): (0.2107, 0.1688)
      ↳ 像素偏移: (215.8px, 129.6px)
   ```

#### 步驟 3: 驗證 Material
1. 查看 Material 的 `Ramp UV Offset` 屬性
2. 應該自動更新為新計算的值

---

## 🔍 驗證測試

### 測試案例 1: [696, 540] → [512, 512]

**初始狀態**:
- ContentSize: [696, 540]
- Ramp UV Offset: [0.31, 0.24]

**修改後**:
- ContentSize: [512, 512]
- Ramp UV Offset: [0.421406, 0.253125]（自動更新）
- 像素偏移: [215.76px, 129.60px]（保持不變）✓

### 測試案例 2: [696, 540] → [1920, 1080]

**初始狀態**:
- ContentSize: [696, 540]
- Ramp UV Offset: [0.31, 0.24]

**修改後**:
- ContentSize: [1920, 1080]
- Ramp UV Offset: [0.112375, 0.120000]（自動更新）
- 像素偏移: [215.76px, 129.60px]（保持不變）✓

---

## 📋 檢查清單

確認自動更新功能正常工作：

- [ ] `RampShaderResetInspector` 組件已添加
- [ ] `autoCalculateOnLoad = true`
- [ ] `autoCalculateOffset = true`
- [ ] `showDetailedLogs = true`（可選，用於查看日誌）
- [ ] 在 Inspector 中修改 ContentSize
- [ ] 觀察 Console 輸出是否顯示偵測日誌
- [ ] 檢查 Material 的 `Ramp UV Offset` 是否自動更新
- [ ] 驗證像素偏移保持固定值（215.76px, 129.60px）

---

## ⚙️ 配置選項

### 關閉自動更新

如果不需要自動偵測，可以在代碼中添加開關：

```typescript
@property({
    tooltip: '是否自動偵測 ContentSize 變化'
})
autoDetectContentSizeChange: boolean = true;
```

然後修改 `update` 方法：

```typescript
protected update(dt: number): void {
    if (!EDITOR) {
        return;
    }
    
    // 只有啟用時才檢測
    if (this.autoDetectContentSizeChange) {
        this.checkContentSizeChange();
    }
    
    this.checkAndResetIfNeeded();
}
```

---

## 🐛 故障排除

### 問題 1: offset 沒有自動更新

**檢查**:
- 是否在編輯器模式下？（只在 EDITOR 模式下檢測）
- `autoCalculateOffset` 是否為 `true`？
- `showDetailedLogs` 設為 `true` 查看日誌

### 問題 2: Console 沒有輸出日誌

**檢查**:
- `showDetailedLogs` 是否為 `true`？
- 是否真的修改了 ContentSize？
- 是否在場景預覽模式？

### 問題 3: 性能影響

**說明**:
- 檢測只在編輯器模式下運行
- 只在實際變化時才重新計算
- 對運行時性能無影響

---

## 💡 優化建議

### 1. 添加防抖機制

如果頻繁修改 ContentSize，可以添加防抖：

```typescript
private contentSizeChangeTimer: number = 0;
private contentSizeChangePending: boolean = false;

private checkContentSizeChange(): void {
    // ... 檢測變化
    
    if (currentWidth !== this.lastContentSizeWidth || 
        currentHeight !== this.lastContentSizeHeight) {
        
        // 設置待處理標誌
        this.contentSizeChangePending = true;
        this.contentSizeChangeTimer = 0.1; // 100ms 延遲
    }
    
    // 倒計時
    if (this.contentSizeChangePending) {
        this.contentSizeChangeTimer -= dt;
        if (this.contentSizeChangeTimer <= 0) {
            this.updateNodeUVScale();
            this.contentSizeChangePending = false;
        }
    }
}
```

### 2. 添加手動刷新按鈕

```typescript
@property({
    tooltip: '點擊手動刷新 UV 參數'
})
public manualRefresh: boolean = false;
```

---

## 📝 總結

### 核心功能

✅ **自動偵測** - ContentSize 變化時自動觸發  
✅ **動態計算** - 使用 `215.76 / width` 和 `129.60 / height`  
✅ **實時更新** - 立即更新 Material 屬性  
✅ **日誌輸出** - 清晰的變化追蹤日誌  

### 工作模式

- **編輯器模式**: 自動偵測並更新
- **運行時模式**: 不執行偵測（性能優化）

### 使用體驗

1. 修改 ContentSize
2. 自動計算新的 offset
3. 立即更新到 Material
4. 視覺效果即時反饋

---

*最後更新: 2025-10-17*
*版本: 5.1.0 - 自動偵測 ContentSize 變化*
*狀態: ✅ 已實現並測試*
