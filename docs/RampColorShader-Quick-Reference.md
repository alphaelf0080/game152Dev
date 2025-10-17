# RampColorShader UV 控制 - 快速參考卡

## 📋 組件列表

| 組件 | 功能 | 用途 |
|---|---|---|
| **RampShaderResetInspector** | 自動計算 nodeUVScale | 確保 Ramp 不被 Sprite Tiling 切割 |
| **RampUVController** | 控制 rampUVScale 和 rampUVOffset | 控制 Ramp 效果的重複和平移 |

## 🚀 三步快速設定

### 步驟 1：準備 Sprite
```
Sprite Component:
  - Texture: ✓
  - Type: Simple (or Tiled)
  - Material: RampColorShader 自定義材質 ← 重要！
  - Content Size: 設置合適的尺寸
```

### 步驟 2：添加組件
```
Add Component:
  1. RampShaderResetInspector ← 自動計算 nodeUVScale
  2. RampUVController ← 控制 Ramp 效果
```

### 步驟 3：調整參數
```
在 RampUVController Inspector 中：
  - Ramp UV Scale: (1, 1) ~ (N, N)
  - Ramp UV Offset: (0, 0) ~ (1, 1)
  - Main Texture Tiling: 根據 Sprite 類型設置
```

## 🎯 常用配置

### Simple Sprite（不重複）
```yaml
RampShaderResetInspector:
  - ✓ 自動設置

RampUVController:
  Ramp UV Scale: (1.0, 1.0)
  Ramp UV Offset: (0.0, 0.0)
  Main Texture Tiling: (1.0, 1.0)
```

### Simple Sprite + Ramp 重複 2x2
```yaml
RampUVController:
  Ramp UV Scale: (2.0, 2.0)
  Ramp UV Offset: (0.0, 0.0)
  Main Texture Tiling: (1.0, 1.0)
```

### Tiled3x3 Sprite
```yaml
RampUVController:
  Ramp UV Scale: (1.0, 1.0)  ← 不重複
  Ramp UV Offset: (0.0, 0.0)
  Main Texture Tiling: (3.0, 3.0)  ← 3x3 Tiling
```

## 📊 參數速查

### nodeUVScale（自動計算）
- **由誰設置**：RampShaderResetInspector
- **公式**：`nodeUVScale = 2.0 / contentSize`
- **用途**：正確規範化節點空間 UV（0~1）
- **人工干預**：不需要，自動計算

### rampUVScale（手動調整）
- **由誰設置**：RampUVController
- **預設值**：(1.0, 1.0)
- **用途**：控制 Ramp 效果的重複次數
- **範圍**：(0.1, 0.1) ~ (5.0, 5.0)
- **效果**：
  - (1, 1) = 不重複
  - (2, 2) = 重複 2x2
  - (0.5, 0.5) = 放大 2 倍

### rampUVOffset（手動調整）
- **由誰設置**：RampUVController
- **預設值**：(0.0, 0.0)
- **用途**：平移 Ramp 效果位置
- **範圍**：(-1.0, -1.0) ~ (1.0, 1.0)
- **常用值**：
  - (0.5, 0) = 向右平移一半
  - (0, 0.5) = 向上平移一半

### tilingOffset（主紋理）
- **由誰設置**：RampUVController
- **格式**：Vec4(tilingX, tilingY, offsetX, offsetY)
- **用途**：控制主紋理的 Tiling
- **常用值**：
  - (1, 1, 0, 0) = Simple 精靈
  - (3, 3, 0, 0) = Tiled3x3 精靈

## 🔍 故障排查

| 問題 | 原因 | 解決方案 |
|---|---|---|
| 沒有看到 Ramp 效果 | 沒有使用自定義材質 | 設置 Sprite.Material = RampColorShader |
| Ramp 被 Sprite Tiling 切割 | nodeUVScale 未正確設置 | 確認 RampShaderResetInspector 已添加 |
| 改變參數無效果 | Auto Save 未啟用 | 勾選 RampUVController 的 Auto Save |
| Console 中有警告 | 組件找不到材質 | 確保 Sprite 有自定義材質 |

## 💻 運行時代碼

```typescript
// 獲取控制器
const uvCtrl = this.node.getComponent('RampUVController');

// 改變 Ramp 重複
uvCtrl.setRampUVScale(2.0, 2.0);

// 改變 Ramp 位置
uvCtrl.setRampUVOffset(0.25, 0.0);

// 改變主紋理 Tiling
uvCtrl.setMainTextureTiling(3.0, 3.0);

// 重置為默認
uvCtrl.resetToDefault();

// 手動應用
uvCtrl.applyAllSettings();
```

## 📁 文件位置

```
/game169/assets/scripts/
├─ RampShaderResetInspector.ts    ← 自動計算 nodeUVScale
├─ RampUVController.ts             ← 控制 rampUVScale/Offset
└─ SpriteUVController.ts           ← 通用 UV 控制（備選）

/game169/assets/effect/
└─ RampColorShader.effect          ← Shader 文件

/docs/
├─ RampColorShader-Simple-Implementation.md    ← 實現原理
├─ RampUVController-Guide.md                   ← 詳細使用指南
└─ RampColorShader-Testing-Guide.md            ← 測試指南
```

## ✅ 檢查清單

### 初次設定
- [ ] Sprite 有自定義材質（RampColorShader）
- [ ] 添加了 RampShaderResetInspector
- [ ] 添加了 RampUVController
- [ ] Console 中看到成功日誌

### 調整效果
- [ ] 設置合適的 Ramp UV Scale
- [ ] 設置合適的 Ramp UV Offset
- [ ] 如果是 Tiled Sprite，設置正確的 Main Texture Tiling

### 運行遊戲
- [ ] 效果正常顯示
- [ ] 沒有 Console 錯誤
- [ ] 性能正常

## 🎬 常見效果

### 效果 1：彩虹漸變覆蓋整個角色
```
Ramp UV Scale: (1.0, 1.0)
Ramp UV Offset: (0.0, 0.0)
useRampTexture: 1
rampIntensity: 1.0
```

### 效果 2：縱向條紋
```
Ramp UV Scale: (10.0, 1.0)  ← 橫向重複 10 次
Ramp UV Offset: (0.0, 0.0)
```

### 效果 3：動態掃光
```
// 在 update() 中
const offset = Math.sin(time) * 0.3;
uvCtrl.setRampUVOffset(offset, 0.0);
```

### 效果 4：旋轉光暈
```
// 配合旋轉節點使用
node.angle += speed * dt;
uvCtrl.setRampUVScale(2.0, 2.0);
```

## 📞 更多幫助

- 詳細使用指南：參考 `RampUVController-Guide.md`
- 測試步驟：參考 `RampColorShader-Testing-Guide.md`
- 實現原理：參考 `RampColorShader-Simple-Implementation.md`

---

**快速總結**：
1. 添加 RampShaderResetInspector（自動）
2. 添加 RampUVController（手動調整）
3. 在 Inspector 中設置參數
4. 完成！🎉
