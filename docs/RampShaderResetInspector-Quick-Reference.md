# RampShaderResetInspector - 快速參考

## 🚀 快速開始

### 1. 添加組件
在使用 RampShader 的節點上添加 `RampShaderResetInspector` 組件

### 2. 自動計算（完成！）
組件會在 onLoad 時自動計算並設定 `nodeUVScale`

---

## 🎯 核心公式

```typescript
nodeUVScale = 2 / contentSize
```

### 範例: ContentSize = [696, 540]
```
nodeUVScale.x = 2 / 696 = 0.002874
nodeUVScale.y = 2 / 540 = 0.003704
```

---

## 🔧 常用方法

### 手動重新計算
```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();
```

### 設定 RampUV 參數
```typescript
import { Vec2 } from 'cc';

// 單次完整覆蓋
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0, 0));

// 重複 2x2 次
inspector.setRampUVParams(new Vec2(2, 2), new Vec2(0, 0));

// 水平偏移 50%
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0.5, 0));
```

### 打印計算指南
```typescript
inspector.printCalculationGuide();
```

### 靜態方法計算
```typescript
const scale = RampShaderResetInspector.calculateNodeUVScale(696, 540);
// 返回: { x: 0.002874, y: 0.003704 }
```

---

## 📊 RampUVScale 效果

| 值 | 效果 |
|----|------|
| `[1.0, 1.0]` | 單次完整覆蓋（推薦） |
| `[2.0, 2.0]` | 重複 2x2 次 |
| `[3.0, 1.0]` | X軸重複3次，Y軸完整 |
| `[0.5, 0.5]` | 只覆蓋中心 50% 區域 |

---

## 📍 RampUVOffset 效果

| 值 | 效果 |
|----|------|
| `[0.0, 0.0]` | 無偏移 |
| `[0.5, 0.0]` | 水平偏移 50% |
| `[0.0, 0.5]` | 垂直偏移 50% |
| `[0.3, 0.3]` | 對角線偏移 30% |

---

## 📐 常見尺寸速查

| ContentSize | NodeUVScale |
|-------------|-------------|
| `[512, 512]` | `[0.003906, 0.003906]` |
| `[696, 540]` | `[0.002874, 0.003704]` |
| `[1024, 768]` | `[0.001953, 0.002604]` |
| `[1280, 720]` | `[0.001563, 0.002778]` |

---

## ⚙️ 組件屬性

| 屬性 | 預設值 | 說明 |
|------|--------|------|
| `autoCalculateOnLoad` | true | 自動計算 |
| `showDetailedLogs` | true | 顯示詳細日誌 |
| `targetSprite` | null | 自動獲取 |

---

## 💡 實際應用

### 單次完整覆蓋
```typescript
// 自動完成，無需額外代碼
// nodeUVScale: 自動計算
// rampUVScale: [1.0, 1.0]
// rampUVOffset: [0.0, 0.0]
```

### 水平重複 3 次
```typescript
inspector.setRampUVParams(new Vec2(3, 1), new Vec2(0, 0));
```

### 中心光暈（50% 區域）
```typescript
inspector.setRampUVParams(new Vec2(0.5, 0.5), new Vec2(0, 0));
// 材質設定: RAMP_DIRECTION = 2 (圓形)
```

### 動態調整尺寸
```typescript
uiTransform.setContentSize(1024, 768);
inspector.recalculateNodeUVScale();
```

---

## 🐛 故障排除

| 問題 | 解決方案 |
|------|---------|
| 還是重複太多次 | 檢查 nodeUVScale 和 rampUVScale |
| 不同節點效果不同 | 每個節點需要獨立組件 |
| 動態改變尺寸後錯誤 | 調用 recalculateNodeUVScale() |
| 偏移無效 | 檢查 RAMP_DIRECTION 設定 |

---

## 📄 完整文檔
詳細說明: `docs/RampShaderResetInspector-Usage-Guide.md`

---

*快速參考 - 2025-10-17*
