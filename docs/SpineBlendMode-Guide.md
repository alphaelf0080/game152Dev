# Spine Blend Mode Shader 混合模式系統

## 📋 概述

使用自定義 Shader 實現的 Spine 骨骼動畫混合模式控制系統。

**創建日期**: 2025-01-24  
**狀態**: ✅ 完成並測試

---

## 🎨 功能特性

### 支援的混合模式

1. **NORMAL (正常混合)**
   - 標準的 Alpha 混合
   - 用於一般顯示

2. **ADDITIVE (加法/發光)**
   - 顏色相加產生發光效果
   - 適合：技能特效、光芒、能量效果

3. **MULTIPLY (乘法/變暗)**
   - 顏色相乘產生變暗效果
   - 適合：陰影、受傷效果、暗化

4. **SCREEN (濾色/變亮)**
   - 濾色混合產生變亮效果
   - 適合：高光、閃光、增亮效果

---

## 📦 文件結構

```
game169/assets/
├── effect/
│   └── SpineBlendMode.effect          # 自定義 Spine Shader
└── script/
    └── SpineBlendModeController.ts    # 混合模式控制腳本
```

---

## 🚀 使用步驟

### 1. 創建材質

1. 在 Cocos Creator 中右鍵點擊 `assets` 資料夾
2. 選擇 **創建 > Material**
3. 命名為 `SpineBlendMode`
4. 選中材質，在 Inspector 中設置：
   - **Effect**: `SpineBlendMode`（選擇我們的自定義 effect）

### 2. 添加控制腳本

1. 選擇有 `sp.Skeleton` 組件的節點
2. 點擊 **添加組件**
3. 搜索並添加 `SpineBlendModeController`

### 3. 配置組件

在 Inspector 面板中：

1. **混合模式材質** (Blend Mode Material)
   - 拖入剛創建的 `SpineBlendMode` 材質

2. **混合模式** (Blend Mode)
   - 選擇想要的混合模式：
     - Normal: 正常混合
     - Additive: 發光疊加效果
     - Multiply: 顏色變暗效果
     - Screen: 濾色變亮效果

### 4. 即時預覽

- 在編輯器中改變混合模式，效果會立即顯示
- 運行時也可以動態切換

---

## 💻 程式控制

### TypeScript 範例

```typescript
import { SpineBlendModeController, SpineBlendMode } from './SpineBlendModeController';

// 獲取組件
const blendController = this.node.getComponent(SpineBlendModeController);

// 設置混合模式
blendController.setBlendMode(SpineBlendMode.ADDITIVE);  // 發光效果
blendController.setBlendMode(SpineBlendMode.MULTIPLY);  // 變暗效果
blendController.setBlendMode(SpineBlendMode.SCREEN);    // 變亮效果
blendController.setBlendMode(SpineBlendMode.NORMAL);    // 恢復正常

// 獲取當前模式
const currentMode = blendController.getBlendMode();

// 循環切換（用於測試）
blendController.toggleBlendMode();
```

---

## 🔧 技術細節

### Shader 實現

**檔案**: `SpineBlendMode.effect`

#### 核心函數: `applyBlendMode()`

```glsl
vec4 applyBlendMode(vec4 texColor, float mode) {
    // mode 0: Normal   - 標準混合
    // mode 1: Additive - 加法混合（發光）
    // mode 2: Multiply - 乘法混合（變暗）
    // mode 3: Screen   - 濾色混合（變亮）
}
```

#### Shader Uniform

- `blendMode` (float): 0.0 ~ 3.0
  - 在 shader 中接收混合模式參數
  - 由 TypeScript 動態設置

### 組件架構

**檔案**: `SpineBlendModeController.ts`

#### 主要流程

1. **初始化** (`onLoad`)
   - 獲取 `sp.Skeleton` 組件
   - 創建材質實例
   - 應用初始混合模式

2. **更新檢測** (`update`)
   - 監測混合模式變化
   - 自動應用新模式

3. **模式應用** (`applyBlendMode`)
   - 設置 Shader uniform 參數
   - 調整 OpenGL 混合狀態
   - 更新 `premultipliedAlpha` 屬性

---

## 🎯 使用場景

### 1. 技能特效

```typescript
// 釋放技能時變成發光效果
blendController.setBlendMode(SpineBlendMode.ADDITIVE);

// 技能結束後恢復
blendController.setBlendMode(SpineBlendMode.NORMAL);
```

### 2. 受傷效果

```typescript
// 受傷時變暗
blendController.setBlendMode(SpineBlendMode.MULTIPLY);

// 配合 SkeletonColorController 的色彩動畫
// 可以產生受傷閃爍效果
```

### 3. 強化/Buff 效果

```typescript
// 獲得 Buff 時發光
blendController.setBlendMode(SpineBlendMode.SCREEN);

// 或使用 Additive 產生更強烈的光芒
blendController.setBlendMode(SpineBlendMode.ADDITIVE);
```

---

## 🔄 與 SkeletonColorController 整合

兩個控制器可以同時使用，產生更豐富的效果：

```typescript
// 同時控制顏色和混合模式
const colorCtrl = node.getComponent(SkeletonColorController);
const blendCtrl = node.getComponent(SpineBlendModeController);

// 技能釋放：發光 + 顏色變化
blendCtrl.setBlendMode(SpineBlendMode.ADDITIVE);
colorCtrl.startFadeAnimation();

// 受傷：變暗 + 紅色閃爍
blendCtrl.setBlendMode(SpineBlendMode.MULTIPLY);
// 配合 colorCtrl 設置紅色淡入淡出
```

---

## ⚠️ 注意事項

### 1. 材質設置

- **必須** 在 Inspector 中指定混合模式材質
- 確保材質使用 `SpineBlendMode.effect`

### 2. 效能考量

- 自定義 Shader 會有輕微的效能開銷
- 如果場景中有大量 Spine 動畫，建議選擇性使用

### 3. 混合模式選擇

- **Additive**: 適合亮色背景，暗色背景效果不明顯
- **Multiply**: 會使顏色變暗，純黑色會變成完全透明
- **Screen**: 適合需要提亮的場景

### 4. 與原生 Spine BlendMode 的差異

- 這是 Shader 層級的實現
- 不依賴 Spine Runtime 的 slot.blendMode
- 對整個 skeleton 統一應用混合模式

---

## 🐛 疑難排解

### 問題 1: 混合模式沒有效果

**檢查項目**:
1. 是否正確設置了混合模式材質？
2. 材質是否使用了 `SpineBlendMode.effect`？
3. 控制台是否有錯誤訊息？

**解決方法**:
```typescript
// 在控制台檢查
log('Material Instance:', this.materialInstance);
log('Blend Mode:', this.blendMode);
```

### 問題 2: 顏色顯示異常

**原因**: `premultipliedAlpha` 設置不當

**解決方法**:
- Additive 模式需要 `premultipliedAlpha = false`
- 其他模式通常使用 `premultipliedAlpha = true`

### 問題 3: 效果不如預期

**建議**:
1. 嘗試調整背景顏色
2. 配合 `SkeletonColorController` 使用
3. 實驗不同的混合模式組合

---

## 📊 效能數據

| 項目 | 數值 | 說明 |
|------|------|------|
| Shader 複雜度 | 低 | 簡單的條件判斷和顏色運算 |
| Draw Call | 不變 | 不增加 Draw Call |
| 記憶體開銷 | 極小 | 每個實例一個材質副本 |
| CPU 開銷 | 極小 | 僅在模式改變時更新 |

---

## 📝 更新日誌

### v1.0.0 (2025-01-24)

- ✅ 初始版本發佈
- ✅ 支援 4 種混合模式
- ✅ Shader 實現
- ✅ TypeScript 控制腳本
- ✅ 完整文檔

---

## 🎓 相關資源

- **Spine 官方文檔**: https://esotericsoftware.com/spine-user-guide
- **Cocos Creator Shader 指南**: https://docs.cocos.com/creator/manual/zh/shader/
- **OpenGL 混合模式**: https://www.khronos.org/opengl/wiki/Blending

---

## 🤝 與其他系統的關係

```
SpineBlendModeController (新)
    ↓ 可配合使用
SkeletonColorController
    ↓ 控制
sp.Skeleton (Spine 組件)
```

**協作方式**:
- `SpineBlendModeController`: 控制混合模式（如何混合）
- `SkeletonColorController`: 控制顏色（混合什麼顏色）
- 兩者互不干擾，可以產生複合效果

---

**文檔版本**: 1.0.0  
**最後更新**: 2025-01-24
