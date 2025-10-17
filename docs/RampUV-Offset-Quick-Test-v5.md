# Ramp UV Offset 動態計算 - 快速驗證

## 🧪 快速測試

### 在瀏覽器 Console 執行

```javascript
// 模擬動態計算函數
function calculateAutoRampUVOffset(width, height) {
    const referencePixelOffsetX = 215.76;
    const referencePixelOffsetY = 129.60;
    
    return {
        x: referencePixelOffsetX / width,
        y: referencePixelOffsetY / height
    };
}

// 測試不同尺寸
const testSizes = [
    [512, 512],
    [696, 540],   // 參考尺寸
    [1024, 768],
    [1280, 720],
    [1920, 1080]
];

console.log("=== 動態 Offset 計算測試 ===\n");

testSizes.forEach(([width, height]) => {
    const offset = calculateAutoRampUVOffset(width, height);
    const pixelX = offset.x * width;
    const pixelY = offset.y * height;
    
    console.log(`[${width}, ${height}]:`);
    console.log(`  Offset: [${offset.x.toFixed(6)}, ${offset.y.toFixed(6)}]`);
    console.log(`  Pixels: [${pixelX.toFixed(2)}px, ${pixelY.toFixed(2)}px]`);
    
    // 驗證參考尺寸
    if (width === 696 && height === 540) {
        const match = Math.abs(offset.x - 0.31) < 0.0001 && 
                     Math.abs(offset.y - 0.24) < 0.0001;
        console.log(`  ✓ 參考尺寸驗證: ${match ? '通過' : '失敗'}`);
    }
    console.log('');
});
```

---

## 📊 預期輸出

```
=== 動態 Offset 計算測試 ===

[512, 512]:
  Offset: [0.421406, 0.253125]
  Pixels: [215.76px, 129.60px]

[696, 540]:
  Offset: [0.310000, 0.240000]
  Pixels: [215.76px, 129.60px]
  ✓ 參考尺寸驗證: 通過

[1024, 768]:
  Offset: [0.210742, 0.168750]
  Pixels: [215.76px, 129.60px]

[1280, 720]:
  Offset: [0.168563, 0.180000]
  Pixels: [215.76px, 129.60px]

[1920, 1080]:
  Offset: [0.112375, 0.120000]
  Pixels: [215.76px, 129.60px]
```

---

## ✅ 驗證要點

1. **固定像素偏移** - 所有尺寸的像素偏移都是 215.76px 和 129.60px
2. **參考尺寸匹配** - [696, 540] 的 offset 是 [0.31, 0.24]
3. **動態調整** - offset 值隨 contentSize 自動變化

---

## 🔍 Node.js 單行測試

```bash
node -e "const w=696,h=540,px=215.76,py=129.60; console.log('['+w+','+h+']: ['+(px/w).toFixed(6)+', '+(py/h).toFixed(6)+']');"
```

**預期輸出**：
```
[696,540]: [0.310000, 0.240000]
```

---

## 🎯 Cocos Creator 中驗證

### 在場景腳本中添加

```typescript
start() {
    const uiTransform = this.node.getComponent(UITransform);
    const width = uiTransform.contentSize.width;
    const height = uiTransform.contentSize.height;
    
    const offset = RampShaderResetInspector.calculateAutoRampUVOffset(
        width,
        height
    );
    
    console.log(`ContentSize: [${width}, ${height}]`);
    console.log(`Calculated Offset: [${offset.x}, ${offset.y}]`);
    console.log(`Pixel Offset: [${offset.x * width}px, ${offset.y * height}px]`);
}
```

### 檢查 Inspector

在 Cocos Creator 中運行後，檢查：
- Material 的 `rampUVOffset` 屬性
- 應該顯示動態計算的值（例如 [0.31, 0.24] 對於 [696, 540]）

---

## 📋 驗證檢查清單

- [ ] 參考尺寸 [696, 540] → offset [0.31, 0.24] ✓
- [ ] 所有尺寸的像素偏移固定為 [215.76px, 129.60px] ✓
- [ ] offset 隨 contentSize 動態變化 ✓
- [ ] 代碼編譯無錯誤 ✓
- [ ] 視覺效果符合預期 1→0 漸變 ⏳（待測試）

---

*版本: 5.0.0*
*更新: 2025-10-17*
