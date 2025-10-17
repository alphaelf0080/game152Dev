# Ramp UV Offset 計算 - 快速參考卡

## 🎯 三種計算方法

### 1️⃣ 像素偏移（最精準）
```typescript
// 公式: offset = 像素 / contentSize
inspector.setRampUVOffsetByPixels(100, 50);  // 右100px，上50px
```

### 2️⃣ 百分比偏移（最直觀）
```typescript
// 公式: offset = 百分比 / 100
inspector.setRampUVOffsetByPercent(25, 10);  // 右25%，上10%
```

### 3️⃣ 直接設定（最靈活）
```typescript
// 範圍: 0.0 ~ 1.0
inspector.setRampUVParams(new Vec2(1,1), new Vec2(0.25, 0.1));
```

---

## 📊 快速對照表

### ContentSize = [696, 540]

| 效果 | 像素 (X/Y) | 百分比 | Offset 值 |
|------|-----------|--------|-----------|
| 無偏移 | 0 / 0 | 0% | 0.00 |
| 輕微偏移 | 69.6 / 54 | 10% | 0.10 |
| 四分之一 | 174 / 135 | 25% | 0.25 |
| 三分之一 | 229.7 / 178.2 | 33% | 0.33 |
| 中心偏移 | 348 / 270 | 50% | 0.50 |
| 四分之三 | 522 / 405 | 75% | 0.75 |
| 完整循環 | 696 / 540 | 100% | 1.00 |

---

## 🔢 計算公式速查

### 正向計算

```typescript
// 像素 → Offset
offset = 像素偏移 / contentSize

// 百分比 → Offset
offset = 百分比 / 100
```

### 反向計算

```typescript
// Offset → 像素
像素 = offset × contentSize

// Offset → 百分比
百分比 = offset × 100
```

---

## 💻 代碼範例

### 基礎使用
```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);

// 像素方法
inspector.setRampUVOffsetByPixels(100, 0);

// 百分比方法
inspector.setRampUVOffsetByPercent(25, 0);

// 直接設定
inspector.setRampUVParams(
    new Vec2(1, 1),      // tiling
    new Vec2(0.25, 0)    // offset
);
```

### 靜態方法
```typescript
// 計算 offset（像素）
const offset1 = RampShaderResetInspector.calculateRampUVOffsetFromPixels(
    100, 50,   // 像素偏移
    696, 540   // contentSize
);

// 計算 offset（百分比）
const offset2 = RampShaderResetInspector.calculateRampUVOffsetFromPercent(25, 10);

// 反向計算：offset → 像素
const pixels = RampShaderResetInspector.offsetToPixels(0.25, 0.1, 696, 540);

// 反向計算：offset → 百分比
const percent = RampShaderResetInspector.offsetToPercent(0.25, 0.1);
```

---

## 🎬 常見效果

### 水平偏移
```typescript
// 向右偏移 25%
inspector.setRampUVOffsetByPercent(25, 0);
```

### 垂直偏移
```typescript
// 向上偏移 10%
inspector.setRampUVOffsetByPercent(0, 10);
```

### 對角線偏移
```typescript
// 向右上偏移 30%
inspector.setRampUVOffsetByPercent(30, 30);
```

### 動態滾動
```typescript
update(dt: number) {
    this.offset += 0.1 * dt;  // 每秒偏移 10%
    if (this.offset > 1.0) this.offset -= 1.0;
    
    inspector.setRampUVParams(new Vec2(1,1), new Vec2(this.offset, 0));
}
```

---

## 📐 常見尺寸參考

### 像素轉 Offset

| ContentSize | 100px → Offset | 200px → Offset |
|-------------|---------------|---------------|
| [512, 512] | 0.1953 | 0.3906 |
| [696, 540] | 0.1437 / 0.1852 | 0.2874 / 0.3704 |
| [1024, 768] | 0.0977 / 0.1302 | 0.1953 / 0.2604 |
| [1280, 720] | 0.0781 / 0.1389 | 0.1563 / 0.2778 |

---

## 🔄 反向偏移（負值）

```typescript
// 向左偏移 = 1.0 - 向右偏移
const leftOffset = 1.0 - 0.25;  // 0.75

// 向下偏移 = 1.0 - 向上偏移
const downOffset = 1.0 - 0.25;  // 0.75

inspector.setRampUVParams(new Vec2(1,1), new Vec2(leftOffset, 0));
```

---

## 🐛 快速檢查清單

| 問題 | 檢查項目 |
|------|---------|
| 偏移無效 | ✓ nodeUVScale 已正確設定 |
| 方向錯誤 | ✓ RAMP_DIRECTION 正確 |
| 效果不明顯 | ✓ rampUVScale 設定 |
| 重複模式錯誤 | ✓ 考慮 tiling 影響 |

---

## 📊 詳細日誌

```typescript
// 啟用詳細日誌
inspector.showDetailedLogs = true;

// 查看完整計算指南
inspector.printCalculationGuide();
```

輸出範例：
```
🎯 RampUV 參數已設定:
   Tiling: (1, 1)
   Offset: (0.2500, 0.1000)
   ↳ 像素偏移: (174.0px, 54.0px)
   ↳ 百分比: (25.0%, 10.0%)
```

---

## 📄 完整文檔
詳細說明: `docs/RampUV-Offset-Calculation-Guide.md`

---

*快速參考 - 2025-10-17*
