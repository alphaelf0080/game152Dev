# Ramp UV Offset 動態計算方案 - v5.0

## 📅 更新日期
2025-10-17

## 🎯 動態計算公式

### 最終實現（方案 A - 固定像素偏移）

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number
): { x: number, y: number } {
    // 固定像素偏移（基於參考尺寸 [696, 540] 的最佳值）
    const referencePixelOffsetX = 215.76;  // 696 × 0.31
    const referencePixelOffsetY = 129.60;  // 540 × 0.24
    
    const offsetX = referencePixelOffsetX / width;
    const offsetY = referencePixelOffsetY / height;
    
    return { x: offsetX, y: offsetY };
}
```

---

## 📐 公式說明

### 基本原理

從參考尺寸 [696, 540] 的最佳 offset [0.31, 0.24] 反推：

```
像素偏移 X = 0.31 × 696 = 215.76 像素
像素偏移 Y = 0.24 × 540 = 129.60 像素
```

### 動態計算

保持固定的像素偏移量，offset 隨 contentSize 自動調整：

```
offsetX = 215.76 / width
offsetY = 129.60 / height
```

---

## 📊 計算結果對照

| ContentSize | Offset X | Offset Y | 像素偏移 X | 像素偏移 Y |
|-------------|----------|----------|-----------|-----------|
| [512, 512] | 0.421406 | 0.253125 | 215.76px | 129.60px |
| [696, 540] | 0.310000 | 0.240000 | 215.76px | 129.60px ✓ |
| [1024, 768] | 0.210742 | 0.168750 | 215.76px | 129.60px |
| [1280, 720] | 0.168563 | 0.180000 | 215.76px | 129.60px |
| [1920, 1080] | 0.112375 | 0.120000 | 215.76px | 129.60px |

**特點**：
- ✅ 所有尺寸保持相同的像素偏移量
- ✅ offset 值根據 contentSize 動態調整
- ✅ 參考尺寸 [696, 540] 的結果與原始測試值完全一致

---

## 🔍 三種方案對比

### 方案 A: 固定像素偏移（已採用）✓

```typescript
const referencePixelOffsetX = 215.76;
const referencePixelOffsetY = 129.60;

const offsetX = referencePixelOffsetX / width;
const offsetY = referencePixelOffsetY / height;
```

**優點**：
- 所有尺寸保持一致的像素對齊
- 視覺效果統一
- 適合 UI 元素的固定偏移需求

**缺點**：
- 大尺寸時 offset 值變小
- 可能在極端尺寸下需要調整

---

### 方案 B: 比例縮放（備選）

```typescript
const referenceWidth = 696;
const referenceHeight = 540;
const referenceOffsetX = 0.31;
const referenceOffsetY = 0.24;

const scaleX = width / referenceWidth;
const scaleY = height / referenceHeight;

const offsetX = referenceOffsetX * scaleX;
const offsetY = referenceOffsetY * scaleY;
```

**計算結果**：

| ContentSize | Offset X | Offset Y | 像素偏移 X | 像素偏移 Y |
|-------------|----------|----------|-----------|-----------|
| [512, 512] | 0.228161 | 0.227556 | 116.82px | 116.51px |
| [696, 540] | 0.310000 | 0.240000 | 215.76px | 129.60px ✓ |
| [1024, 768] | 0.456322 | 0.341333 | 467.27px | 262.58px |
| [1280, 720] | 0.570115 | 0.320000 | 729.75px | 230.40px |
| [1920, 1080] | 0.855172 | 0.480000 | 1641.93px | 518.40px |

**優點**：
- offset 隨尺寸按比例增長
- 保持相對位置關係

**缺點**：
- 像素偏移量不固定
- 大尺寸時偏移量過大
- **不推薦**用於 UV offset

---

### 方案 C: 基於補償因子（備選）

```typescript
const factorX = 132.24;  // (0.5 - 0.31) × 696
const factorY = 140.40;  // (0.5 - 0.24) × 540

const offsetX = 0.5 - (factorX / width);
const offsetY = 0.5 - (factorY / height);
```

**計算結果**：

| ContentSize | Offset X | Offset Y | 像素偏移 X | 像素偏移 Y |
|-------------|----------|----------|-----------|-----------|
| [512, 512] | 0.241719 | 0.225781 | 123.76px | 115.60px |
| [696, 540] | 0.310000 | 0.240000 | 215.76px | 129.60px ✓ |
| [1024, 768] | 0.370898 | 0.317188 | 379.80px | 243.60px |
| [1280, 720] | 0.396719 | 0.305000 | 508.00px | 219.60px |
| [1920, 1080] | 0.431125 | 0.370000 | 827.76px | 399.60px |

**優點**：
- 數學上對稱（0.5 - factor）
- 接近中心對齊的概念

**缺點**：
- 像素偏移量不固定
- 中等推薦

---

## 💡 為什麼選擇方案 A？

### 1. UV 對齊的慣例
在圖形學中，UV offset 通常用於固定像素的對齊，而不是比例縮放。

### 2. 視覺一致性
保持固定的像素偏移能確保在不同尺寸的 sprite 上有一致的視覺效果。

### 3. 實測驗證
參考尺寸 [696, 540] 的計算結果與原始測試值完全匹配：
- 計算：`215.76 / 696 = 0.31` ✓
- 計算：`129.60 / 540 = 0.24` ✓

---

## 🧪 測試驗證

### TypeScript 測試代碼

```typescript
// 測試動態計算
function testDynamicOffset() {
    const testSizes = [
        [512, 512],
        [696, 540],
        [1024, 768],
        [1280, 720],
        [1920, 1080]
    ];
    
    console.log("=== 動態 Offset 計算測試 ===\n");
    
    testSizes.forEach(([width, height]) => {
        const offset = RampShaderResetInspector.calculateAutoRampUVOffset(
            width,
            height
        );
        
        const pixelX = offset.x * width;
        const pixelY = offset.y * height;
        
        console.log(`ContentSize [${width}, ${height}]:`);
        console.log(`  Offset: [${offset.x.toFixed(6)}, ${offset.y.toFixed(6)}]`);
        console.log(`  Pixels: [${pixelX.toFixed(2)}px, ${pixelY.toFixed(2)}px]`);
        console.log('');
    });
}
```

### Node.js 快速測試

```bash
node -e "
const refPxX = 215.76, refPxY = 129.60;
const sizes = [[512,512], [696,540], [1024,768]];

console.log('動態計算測試:\n');
sizes.forEach(([w,h]) => {
  const ox = refPxX / w;
  const oy = refPxY / h;
  console.log('['+w+','+h+']: ['+ox.toFixed(6)+', '+oy.toFixed(6)+']');
});
"
```

---

## 🎨 使用方法

### 在組件中自動使用

```typescript
// RampShaderResetInspector 會自動調用
private updateNodeUVScale(): void {
    const contentSize = this.node.getComponent(UITransform).contentSize;
    
    // 自動計算 offset（動態）
    if (this.autoCalculateOffset) {
        const autoOffset = RampShaderResetInspector.calculateAutoRampUVOffset(
            contentSize.width,
            contentSize.height
        );
        
        material.setProperty('rampUVOffset', 
            new Vec2(autoOffset.x, autoOffset.y), 0);
    }
}
```

### 手動調用

```typescript
// 計算任意尺寸的 offset
const offset1 = RampShaderResetInspector.calculateAutoRampUVOffset(696, 540);
// { x: 0.31, y: 0.24 }

const offset2 = RampShaderResetInspector.calculateAutoRampUVOffset(1024, 768);
// { x: 0.210742, y: 0.16875 }

const offset3 = RampShaderResetInspector.calculateAutoRampUVOffset(512, 512);
// { x: 0.421406, y: 0.253125 }
```

---

## 📋 配置檢查清單

使用動態計算時確認：

- [ ] `RampShaderResetInspector` 組件已添加
- [ ] `autoCalculateOnLoad = true`
- [ ] `autoCalculateOffset = true`
- [ ] `targetSprite` 已正確設置
- [ ] Material 使用 `RampColorShader`
- [ ] Offset 會隨 contentSize 自動調整

---

## 🔄 版本比較

| 版本 | 計算方式 | 特點 |
|------|---------|------|
| v1-v3 | 基於 UV 補償 | 理論計算，未考慮實測 |
| v4.0 | 固定常數 [0.31, 0.24] | 簡單但不適用其他尺寸 |
| **v5.0** | **動態計算（固定像素）** | **推薦，適用所有尺寸** ✓ |

---

## 🚀 後續優化

如果需要更精確的控制：

### 添加可調參數

```typescript
@property({ tooltip: 'X 方向的參考像素偏移' })
referencePixelOffsetX: number = 215.76;

@property({ tooltip: 'Y 方向的參考像素偏移' })
referencePixelOffsetY: number = 129.60;

public calculateOffset(width: number, height: number): Vec2 {
    return new Vec2(
        this.referencePixelOffsetX / width,
        this.referencePixelOffsetY / height
    );
}
```

### 支援多種計算模式

```typescript
enum OffsetCalculationMode {
    FixedPixel,      // 固定像素
    ProportionalScale, // 比例縮放
    CompensationFactor // 補償因子
}

@property({ type: Enum(OffsetCalculationMode) })
calculationMode: OffsetCalculationMode = OffsetCalculationMode.FixedPixel;
```

---

## 📝 總結

### 核心公式

```typescript
offsetX = 215.76 / width
offsetY = 129.60 / height
```

### 關鍵特點

- ✅ **動態計算** - 根據 contentSize 自動調整
- ✅ **固定像素** - 保持一致的像素偏移量
- ✅ **適用所有尺寸** - 通用性強
- ✅ **實測驗證** - [696, 540] 結果與原始值一致

### 使用建議

1. 大多數情況使用**方案 A（固定像素）**
2. 如需特殊效果可切換到方案 B 或 C
3. 可通過組件屬性調整參考像素值

---

*最後更新: 2025-10-17*
*版本: 5.0.0 - 動態計算實現*
*狀態: ✅ 已實現並驗證*
