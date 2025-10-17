# Ramp UV Offset - 快速參考卡（1→0 效果）

## 🎯 目標效果
- **水平**：左（亮）→ 右（暗）= **1 → 0**
- **垂直**：上（亮）→ 下（暗）= **1 → 0**

---

## ✅ 正確設置

### Material 參數
```
Node UV Scale:     [自動計算]
Ramp UV Tiling:    [1.0, 1.0]
Ramp UV Offset:    [0.0, 0.0]     ← offset 設為 0！
反轉 Ramp:         1               ← 必須是 1！
```

### TypeScript 代碼
```typescript
// RampShaderResetInspector.ts
public static calculateAutoRampUVOffset(
    width: number, 
    height: number
): { x: number, y: number } {
    return { x: 0.0, y: 0.0 };
}
```

---

## 📐 計算公式

| 參數 | 公式 | 範例 (696×540) |
|------|------|---------------|
| **nodeUVScale.x** | `2 / width` | `0.002874` |
| **nodeUVScale.y** | `2 / height` | `0.003704` |
| **rampUVOffset.x** | `0.0` | `0.0` |
| **rampUVOffset.y** | `0.0` | `0.0` |
| **invertRamp** | `1` | `1` |

---

## 🔍 原理

```glsl
// Shader 中的關鍵步驟
normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;  // [0, 1]
rampUV = fract((normalizedUV + 0.0) * 1.0);         // [0, 1]
rampCoord = rampUV.x;  // 或 rampUV.y
rampCoord = 1.0 - rampCoord;  // invertRamp = 1，反轉！
```

**結果**：
- 左/上（normalizedUV=0.0）→ rampCoord=1.0 ✓
- 右/下（normalizedUV≈1.0）→ rampCoord≈0.0 ✓

---

## ⚠️ 常見錯誤

### ❌ 錯誤 1: offset 不是 0
```
Ramp UV Offset: [0.498563, 0.498148]  // 錯誤！
```
**問題**：無法實現完整的 1→0 映射

### ❌ 錯誤 2: 沒有反轉
```
反轉 Ramp: 0  // 錯誤！
```
**問題**：會得到 0→1 而不是 1→0

### ❌ 錯誤 3: X 和 Y 不同
```
Ramp UV Offset: [0.5, 0.0]  // 錯誤！
```
**問題**：X 和 Y 方向的效果不一致

---

## 📋 檢查清單

- [ ] `rampUVOffset = [0.0, 0.0]`
- [ ] `rampUVScale = [1.0, 1.0]`
- [ ] `invertRamp = 1`
- [ ] `autoCalculateOffset = true`

---

## 🧪 測試方法

### Node.js 快速驗證
```bash
node -e "const w=696, h=540; console.log('Offset X:', 0.0); console.log('Offset Y:', 0.0); console.log('InvertRamp:', 1); console.log('左邊 (0.0) → 反轉後:', 1.0-0.0); console.log('右邊 (1.0) → 反轉後:', 1.0-1.0);"
```

### 預期輸出
```
Offset X: 0
Offset Y: 0
InvertRamp: 1
左邊 (0.0) → 反轉後: 1
右邊 (1.0) → 反轉後: 0
```

---

## 💡 關鍵洞察

1. **offset = 0.0** 是最簡單、最正確的設置
2. **invertRamp = 1** 實現反轉
3. **適用於所有尺寸** - 無需根據 contentSize 調整 offset
4. **X 和 Y 統一處理** - 都是 0.0

---

*版本: 3.0.0 | 更新: 2025-10-17*
