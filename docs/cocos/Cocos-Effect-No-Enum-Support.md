# Cocos Creator Effect 無法實現下拉選單的說明

**日期**: 2025-10-15  
**結論**: ❌ **Cocos Creator 的 .effect 文件 properties 不支援 enum 類型下拉選單**

---

## 🔍 調查結果

### 官方文檔確認

根據 Cocos Creator 3.8 官方文檔：
- **Pass 可選配置參數** (https://docs.cocos.com/creator/manual/zh/shader/pass-parameter-list.html)
- **editor.type** 只有 **2 個有效值**：
  - `vector` - 向量類型（預設）
  - `color` - 顏色選擇器

**沒有 `enum` 這個類型！**

```yaml
# ❌ 不支援的語法
properties:
  myProperty: { 
    value: 0,
    editor: {
      type: enum,  # ← 無效！官方不支援
      enumList: [...]
    }
  }
```

---

## 🎯 `cullMode` 為什麼有下拉選單？

您提到的 `cullMode` 有下拉選單，是因為它是：
- **渲染管線狀態 (RasterizerState)** 的一部分
- **不是 properties** 中的自定義屬性
- 引擎內建的狀態選項

```yaml
rasterizerState:
  cullMode: none  # 這是管線狀態，不是 property
```

---

## 💡 替代方案

### 方案1: 使用 Macro 定義（有下拉選單）

**優點**: 有真正的下拉選單  
**缺點**: 編譯時決定，每個組合生成不同 Shader

```glsl
CCProgram sprite-fs %{
  // 定義宏選項
  #pragma define-meta BLEND_MODE range([0, 15])
  #pragma define-meta RAMP_DIRECTION range([0, 3])
  
  // 在代碼中使用
  #if BLEND_MODE == 0
    // Normal
  #elif BLEND_MODE == 1
    // Multiply
  #elif BLEND_MODE == 2
    // Screen
  // ... 16 個分支
  #endif
}%
```

**顯示效果**:
```
┌────────────────────────────────┐
│ BLEND_MODE:  [0 ▼]             │  ← 數字下拉選單
│   ├─ 0                          │     (0-15)
│   ├─ 1                          │
│   ├─ 2                          │
│   └─ ...                        │
└────────────────────────────────┘
```

### 方案2: 使用 Properties (float) - 數字輸入框

**優點**: 運行時可動態改變  
**缺點**: 沒有下拉選單，只有數字輸入框

```yaml
properties:
  blendMode: { 
    value: 0.0,  # ← 必須是 float
    editor: {
      displayName: 'Blend Mode (0=Normal, 1=Multiply...)',
      range: [0, 15],  # 可選：限制範圍
      slide: true  # 可選：顯示滑桿
    }
  }
```

**顯示效果**:
```
┌────────────────────────────────┐
│ Blend Mode: [ 0 ] ↕            │  ← 數字輸入框
│ ━━━━━━━●━━━━━━━━━━             │  ← 滑桿
└────────────────────────────────┘
```

### 方案3: 使用 TypeScript 組件控制

創建自定義組件，在 Inspector 中提供下拉選單：

```typescript
import { _decorator, Component, Material, Enum } from 'cc';
const { ccclass, property } = _decorator;

export enum BlendMode {
  Normal = 0,
  Multiply = 1,
  Screen = 2,
  Overlay = 3,
  // ... 16 個選項
}

Enum(BlendMode);

@ccclass('RampColorController')
export class RampColorController extends Component {
  @property({ type: Enum(BlendMode) })
  blendMode: BlendMode = BlendMode.Normal;
  
  @property({ type: Material })
  targetMaterial: Material | null = null;
  
  onLoad() {
    this.updateMaterial();
  }
  
  updateMaterial() {
    if (this.targetMaterial) {
      this.targetMaterial.setProperty('blendMode', this.blendMode);
    }
  }
}
```

**優點**: 
- ✅ 真正的中文下拉選單
- ✅ 運行時可動態改變
- ✅ 類型安全

**缺點**:
- 需要額外的 TypeScript 組件
- 不能直接在材質面板調整

---

## 📊 方案比較

| 特性 | Macro | Properties (float) | TypeScript Component |
|------|-------|-------------------|---------------------|
| 下拉選單 | ✅ (數字 0-15) | ❌ (數字輸入框) | ✅ (中文選項) |
| 中文選項 | ❌ | ❌ | ✅ |
| 運行時改變 | ❌ | ✅ | ✅ |
| 直接在材質面板 | ✅ | ✅ | ❌ |
| 性能 | ⚡ 最佳（編譯時） | ⚡ 好（運行時分支） | ⚡ 好（運行時設置） |
| 實現複雜度 | 低 | 低 | 中 |

---

## ✅ 推薦方案

### 目前最佳方案：**Properties (float) + 滑桿**

```yaml
properties:
  blendMode: { 
    value: 0.0,
    editor: {
      displayName: 'Blend Mode (0=Normal, 1=Multiply, 2=Screen...)',
      tooltip: '0:Normal 1:Multiply 2:Screen 3:Overlay 4:Darken 5:Lighten 6:ColorDodge 7:ColorBurn 8:HardLight 9:SoftLight 10:Difference 11:Exclusion 12:Hue 13:Saturation 14:Color 15:Luminosity',
      range: [0, 15],
      slide: true
    }
  }
  
  rampDirection: {
    value: 0.0,
    editor: {
      displayName: 'Ramp Direction (0=H, 1=V, 2=C, 3=R)',
      tooltip: '0:Horizontal 1:Vertical 2:Circular 3:Radial',
      range: [0, 3],
      slide: true
    }
  }
```

**顯示效果**:
```
┌──────────────────────────────────────────┐
│ Blend Mode (0=Normal, 1=Multiply, 2=S... │
│ [ 0 ] ↕  ━━●━━━━━━━━━━━━━━━━━           │  ← 滑桿可拖動
│ ⓘ 0:Normal 1:Multiply 2:Screen...       │  ← Tooltip 說明
│                                           │
│ Ramp Direction (0=H, 1=V, 2=C, 3=R)      │
│ [ 0 ] ↕  ●━━━━━━━                        │  ← 滑桿可拖動  
│ ⓘ 0:Horizontal 1:Vertical 2:Circular... │  ← Tooltip 說明
└──────────────────────────────────────────┘
```

---

## 🎯 結論

**Cocos Creator .effect 文件不支援 enum 類型的下拉選單**。

之前的所有嘗試（包括改格式、改中文/英文等）都無法成功，因為：
- ❌ `editor.type: enum` 不是有效的類型
- ❌ `enumList` 不是有效的屬性
- ✅ 只支援 `vector` 和 `color` 兩種類型

**實際可行的方案只有三種**:
1. 使用 **macro** - 有數字下拉選單但沒有中文
2. 使用 **float property** - 數字輸入框 + 滑桿
3. 使用 **TypeScript component** - 完整的中文下拉選單但不在材質面板

**建議採用方案 2（float + 滑桿）**，這是最簡單且最直觀的方式。

---

**參考文檔**:
- https://docs.cocos.com/creator/manual/zh/shader/pass-parameter-list.html
- https://docs.cocos.com/creator/manual/zh/shader/macros.html
