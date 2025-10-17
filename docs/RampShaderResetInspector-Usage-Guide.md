# RampShaderResetInspector 使用指南

## 概述
`RampShaderResetInspector` 組件提供了自動計算 `nodeUVScale` 的功能，解決 RampUV 重複次數過多的問題。

---

## 🎯 核心功能

### 1. 自動計算 NodeUVScale
組件會根據節點的 `contentSize` 自動計算精準的 `nodeUVScale` 值。

**計算公式:**
```typescript
nodeUVScale = 2 / contentSize
```

**範例:**
- ContentSize = [696, 540]
- nodeUVScale = [2/696, 2/540] = [0.002874, 0.003704]

### 2. 重置所有參數
當 shader 的 `resetAll` 參數設為 true 時，自動重置所有參數到預設值。

### 3. 手動調用方法
提供多個公開方法供編輯器或代碼調用。

---

## 📦 安裝與設定

### 步驟 1: 添加組件
在使用 RampColorShader 的節點上添加 `RampShaderResetInspector` 組件。

### 步驟 2: 配置屬性

#### 屬性說明

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `targetSprite` | Sprite | null | 使用 RampShader 的 Sprite 組件（自動獲取） |
| `autoCalculateOnLoad` | boolean | true | 是否在 onLoad 時自動計算 nodeUVScale |
| `showDetailedLogs` | boolean | true | 是否顯示詳細的計算日誌 |

---

## 🔧 使用方法

### 方法 1: 自動計算（推薦）

組件會在 `onLoad` 時自動計算並設定 `nodeUVScale`。

```typescript
// 只需添加組件，無需額外代碼
// 組件會自動處理所有計算
```

### 方法 2: 手動重新計算

當節點的 `contentSize` 改變後，可以手動重新計算：

```typescript
// 獲取組件
const inspector = this.node.getComponent(RampShaderResetInspector);

// 重新計算 nodeUVScale
inspector.recalculateNodeUVScale();
```

### 方法 3: 設定 RampUV 參數

使用輔助方法設定 `rampUVScale` 和 `rampUVOffset`：

```typescript
import { Vec2 } from 'cc';

const inspector = this.node.getComponent(RampShaderResetInspector);

// 單次完整覆蓋
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0, 0));

// 重複 2x2 次
inspector.setRampUVParams(new Vec2(2, 2), new Vec2(0, 0));

// 水平偏移 50%
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0.5, 0));
```

### 方法 4: 打印計算指南

在控制台打印完整的計算公式和建議：

```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.printCalculationGuide();
```

輸出範例：
```
╔════════════════════════════════════════════════════════════════╗
║              RampUV 精準計算指南                                ║
╚════════════════════════════════════════════════════════════════╝

📐 當前節點資訊:
   ContentSize: [696, 540]

🔢 精準計算公式:
   nodeUVScale = 2 / contentSize

✨ 計算結果:
   nodeUVScale.x = 2 / 696 = 0.002874
   nodeUVScale.y = 2 / 540 = 0.003704

🎯 RampUVScale 效果說明:
   [1.0, 1.0]  → 完整覆蓋一次（單次，不重複）
   [2.0, 2.0]  → 重複 2x2 次
   [0.5, 0.5]  → 只覆蓋中心 50% 區域

📍 RampUVOffset 效果說明:
   [0.0, 0.0]  → 無偏移
   [0.5, 0.0]  → 水平偏移 50%
   [0.0, 0.5]  → 垂直偏移 50%

💡 推薦設定（單次完整覆蓋）:
   nodeUVScale: [0.002874, 0.003704]
   rampUVScale: [1.0, 1.0]
   rampUVOffset: [0.0, 0.0]
```

### 方法 5: 靜態方法計算

在其他地方計算 `nodeUVScale`：

```typescript
import { RampShaderResetInspector } from './RampShaderResetInspector';

// 計算 nodeUVScale
const scale = RampShaderResetInspector.calculateNodeUVScale(696, 540);
console.log(scale); // { x: 0.002874, y: 0.003704 }

// 直接使用
material.setProperty('nodeUVScale', new Vec2(scale.x, scale.y), 0);
```

---

## 💡 實際應用範例

### 範例 1: 696x540 節點 - 單次完整覆蓋

```typescript
// 自動設定（推薦）
// 只需添加 RampShaderResetInspector 組件即可

// 或手動設定
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();  // nodeUVScale = [0.002874, 0.003704]
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0, 0));
```

**效果**: 水平/垂直 Ramp 從一端到另一端完整覆蓋，無重複

### 範例 2: 696x540 節點 - 水平重複 3 次

```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();
inspector.setRampUVParams(new Vec2(3, 1), new Vec2(0, 0));
```

**效果**: 水平方向重複 3 次條紋，垂直方向完整覆蓋一次

### 範例 3: 696x540 節點 - 中心光暈效果

```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();
inspector.setRampUVParams(new Vec2(0.5, 0.5), new Vec2(0, 0));

// 同時需要在材質上設定:
// - RAMP_DIRECTION = 2 (圓形)
// - rampCenter = [0.5, 0.5]
```

**效果**: 從中心向外的圓形光暈，只覆蓋中心 50% 區域

### 範例 4: 696x540 節點 - 偏移的水平漸變

```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0.3, 0));

// 材質設定: RAMP_DIRECTION = 0 (水平)
```

**效果**: 水平漸變向右偏移 30%

### 範例 5: 動態調整尺寸

當節點的 `contentSize` 動態改變時：

```typescript
import { UITransform, Vec2 } from 'cc';

// 改變節點尺寸
const uiTransform = this.node.getComponent(UITransform);
uiTransform.setContentSize(1024, 768);

// 重新計算 nodeUVScale
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();  // 自動更新為 [0.001953, 0.002604]
```

---

## 📊 常見尺寸對照表

| ContentSize | NodeUVScale | 說明 |
|-------------|-------------|------|
| [512, 512] | [0.003906, 0.003906] | 正方形，小尺寸 |
| [696, 540] | [0.002874, 0.003704] | 您當前的尺寸 |
| [1024, 768] | [0.001953, 0.002604] | 4:3 比例 |
| [1280, 720] | [0.001563, 0.002778] | 16:9 比例 |
| [1920, 1080] | [0.001042, 0.001852] | Full HD |

---

## 🔍 進階用法

### 在自定義組件中使用

```typescript
import { _decorator, Component, Material, Vec2 } from 'cc';
import { RampShaderResetInspector } from './RampShaderResetInspector';

const { ccclass, property } = _decorator;

@ccclass('MyRampController')
export class MyRampController extends Component {
    
    @property(Material)
    rampMaterial: Material = null;
    
    onLoad() {
        // 獲取 contentSize
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            const size = uiTransform.contentSize;
            
            // 計算 nodeUVScale
            const scale = RampShaderResetInspector.calculateNodeUVScale(
                size.width,
                size.height
            );
            
            // 應用到材質
            this.rampMaterial.setProperty('nodeUVScale', new Vec2(scale.x, scale.y), 0);
            this.rampMaterial.setProperty('rampUVScale', new Vec2(1, 1), 0);
            this.rampMaterial.setProperty('rampUVOffset', new Vec2(0, 0), 0);
        }
    }
    
    // 動畫漸變效果
    animateRampOffset(duration: number = 2.0) {
        this.schedule((dt) => {
            const offset = (Date.now() % (duration * 1000)) / (duration * 1000);
            this.rampMaterial.setProperty('rampUVOffset', new Vec2(offset, 0), 0);
        }, 0.016); // 60 FPS
    }
}
```

### 批量設定多個節點

```typescript
import { Node } from 'cc';
import { RampShaderResetInspector } from './RampShaderResetInspector';

export class RampBatchSetup {
    
    static setupAllRampNodes(parentNode: Node) {
        const inspectors = parentNode.getComponentsInChildren(RampShaderResetInspector);
        
        inspectors.forEach(inspector => {
            inspector.recalculateNodeUVScale();
            inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0, 0));
            console.log(`✓ 設定完成: ${inspector.node.name}`);
        });
        
        console.log(`📦 已設定 ${inspectors.length} 個節點`);
    }
}
```

---

## 🐛 疑難排解

### Q1: 計算後還是重複太多次？

**檢查項目:**
1. 確認 `nodeUVScale` 是否正確設定
2. 檢查 `rampUVScale` 是否為 [1.0, 1.0]
3. 確認組件的 `autoCalculateOnLoad` 是否為 true
4. 查看控制台日誌，確認計算值

**解決方法:**
```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.showDetailedLogs = true;
inspector.recalculateNodeUVScale();
inspector.printCalculationGuide();
```

### Q2: 不同節點效果不一致？

**原因:** 每個不同尺寸的節點需要獨立計算 `nodeUVScale`。

**解決方法:**
- 為每個節點添加獨立的 `RampShaderResetInspector` 組件
- 或使用不同的材質實例（不要共用同一個材質）

### Q3: 動態改變尺寸後效果錯誤？

**原因:** `contentSize` 改變後需要重新計算 `nodeUVScale`。

**解決方法:**
```typescript
// 改變尺寸後立即重新計算
uiTransform.setContentSize(newWidth, newHeight);
inspector.recalculateNodeUVScale();
```

### Q4: 偏移沒有效果？

**檢查項目:**
1. `rampUVOffset` 值是否在 0.0~1.0 範圍內
2. 確認 `RAMP_DIRECTION` 設定正確
3. 對於水平漸變，只調整 X 分量
4. 對於垂直漸變，只調整 Y 分量

---

## 📚 相關文檔

- [RampColorShader 完整指南](./Cocos-Creator-Ramp-Shader-Guide.md)
- [Shader 開發文檔](./Cocos-Creator-Shader-Development.md)

---

## 🎓 總結

### 關鍵要點
1. ✅ 使用 `RampShaderResetInspector` 組件自動計算 `nodeUVScale`
2. ✅ 公式: `nodeUVScale = 2 / contentSize`
3. ✅ 設定正確後，`rampUVScale = [1.0, 1.0]` 表示單次完整覆蓋
4. ✅ 不同尺寸節點需要獨立計算

### 推薦工作流程
1. 在節點上添加 `RampShaderResetInspector` 組件
2. 啟用 `autoCalculateOnLoad` 和 `showDetailedLogs`
3. 運行場景，查看控制台日誌確認計算正確
4. 根據需要調整 `rampUVScale` 和 `rampUVOffset`
5. 使用 `printCalculationGuide()` 查看完整建議

---

*最後更新: 2025-10-17*
