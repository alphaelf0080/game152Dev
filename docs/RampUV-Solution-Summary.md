# RampUV 精準計算 - 完整解決方案總結

## 📅 更新日期
2025-10-17

## 🎯 問題描述
當 ContentSize = [696, 540] 時，`rampUVScale = [1.0, 1.0]` 會導致 Ramp 效果重複太多次，需要精準的計算公式來實現單次完整覆蓋。

## ✅ 解決方案
在 `RampShaderResetInspector.ts` 組件中實現自動計算功能，**不修改 shader 文件**。

---

## 🔧 核心功能

### 1. 精準計算公式
```typescript
nodeUVScale = 2 / contentSize
```

**計算範例 (ContentSize = [696, 540]):**
```
nodeUVScale.x = 2 / 696 = 0.002874
nodeUVScale.y = 2 / 540 = 0.003704
```

### 2. 自動計算
- 組件在 `onLoad` 時自動計算並設定 `nodeUVScale`
- 根據節點的實際 `contentSize` 動態計算
- 無需手動配置

### 3. 手動控制
- 提供公開方法供代碼調用
- 支持動態尺寸調整
- 提供詳細的日誌輸出

---

## 📦 更新內容

### RampShaderResetInspector.ts 增強功能

#### 新增屬性
```typescript
@property({ tooltip: '是否在 onLoad 時自動計算 nodeUVScale' })
autoCalculateOnLoad: boolean = true;

@property({ tooltip: '是否顯示詳細的計算日誌' })
showDetailedLogs: boolean = true;
```

#### 新增方法

##### 1. 靜態計算方法
```typescript
public static calculateNodeUVScale(width: number, height: number): { x: number, y: number }
```
- 純計算方法，可在任何地方調用
- 返回精準的 nodeUVScale 值

##### 2. 手動重新計算
```typescript
public recalculateNodeUVScale(): void
```
- 重新計算並更新 nodeUVScale
- 適用於動態改變尺寸後

##### 3. 設定 RampUV 參數
```typescript
public setRampUVParams(tiling: Vec2, offset: Vec2): void
```
- 便捷設定 rampUVScale 和 rampUVOffset
- 自動顯示設定日誌

##### 4. 獲取當前尺寸
```typescript
public getContentSize(): { width: number, height: number } | null
```
- 獲取當前節點的 contentSize
- 方便外部查詢

##### 5. 打印計算指南
```typescript
public printCalculationGuide(): void
```
- 在控制台打印完整的計算公式和建議
- 包含當前節點的所有相關資訊

#### 增強的日誌輸出
- 顯示計算公式和步驟
- 提供效果說明和建議
- 可通過 `showDetailedLogs` 控制詳細程度

---

## 📚 文檔結構

### 1. RampShaderResetInspector-Usage-Guide.md
**完整使用指南**，包含：
- 核心功能說明
- 安裝與配置
- 所有方法的詳細說明
- 實際應用範例
- 進階用法
- 疑難排解

### 2. RampShaderResetInspector-Quick-Reference.md
**快速參考卡**，包含：
- 快速開始步驟
- 核心公式
- 常用方法
- 效果對照表
- 常見尺寸速查
- 故障排除

---

## 🚀 使用方法

### 最簡單的方式（推薦）

#### 步驟 1: 添加組件
在使用 RampShader 的節點上添加 `RampShaderResetInspector` 組件

#### 步驟 2: 完成！
組件會自動計算並設定 `nodeUVScale`，此時：
- `rampUVScale = [1.0, 1.0]` 表示單次完整覆蓋
- 無需額外配置

### 進階使用

#### 手動重新計算
```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();
```

#### 設定 RampUV 參數
```typescript
import { Vec2 } from 'cc';

// 單次完整覆蓋
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0, 0));

// 重複 2x2 次
inspector.setRampUVParams(new Vec2(2, 2), new Vec2(0, 0));

// 水平偏移 30%
inspector.setRampUVParams(new Vec2(1, 1), new Vec2(0.3, 0));
```

#### 查看計算指南
```typescript
inspector.printCalculationGuide();
```

#### 在其他地方使用
```typescript
const scale = RampShaderResetInspector.calculateNodeUVScale(696, 540);
material.setProperty('nodeUVScale', new Vec2(scale.x, scale.y), 0);
```

---

## 📊 效果對比

### 問題：ContentSize = [696, 540]

| 設定方式 | nodeUVScale | rampUVScale | 效果 |
|---------|-------------|-------------|------|
| **修改前** | [1.0, 1.0] | [1.0, 1.0] | ❌ 重複多次，難以控制 |
| **修改後** | [0.002874, 0.003704] | [1.0, 1.0] | ✅ 單次完整覆蓋 |

### 計算原理

```
修改前：
  nodeUV 範圍：[-348, 348] × [-270, 270]
  nodeUVScale：[1.0, 1.0]
  結果：UV 範圍錯誤，導致重複

修改後：
  nodeUV 範圍：[-348, 348] × [-270, 270]
  nodeUVScale：[0.002874, 0.003704]
  轉換過程：
    1. nodeUV * nodeUVScale = [-1, 1]
    2. ([-1, 1] + 1.0) * 0.5 = [0, 1] ✓
  結果：正確的 UV 範圍，實現單次覆蓋
```

---

## 💡 實際應用範例

### 範例 1: 696x540 節點 - 單次水平漸變
```typescript
// 只需添加 RampShaderResetInspector 組件
// 材質設定: RAMP_DIRECTION = 0 (水平)
// 效果: 從左到右完整的漸變，無重複
```

### 範例 2: 696x540 節點 - 重複條紋
```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.setRampUVParams(new Vec2(5, 1), new Vec2(0, 0));
// 效果: 水平方向 5 條重複的漸變條紋
```

### 範例 3: 696x540 節點 - 中心光暈
```typescript
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.setRampUVParams(new Vec2(0.8, 0.8), new Vec2(0, 0));
// 材質設定: RAMP_DIRECTION = 2 (圓形)
// 效果: 中心 80% 區域的圓形光暈
```

### 範例 4: 動態調整
```typescript
// 動態改變尺寸
uiTransform.setContentSize(1024, 768);

// 重新計算
const inspector = this.node.getComponent(RampShaderResetInspector);
inspector.recalculateNodeUVScale();
// nodeUVScale 自動更新為 [0.001953, 0.002604]
```

---

## 📐 常見尺寸對照表

| ContentSize | NodeUVScale | 公式驗證 |
|-------------|-------------|---------|
| [512, 512] | [0.003906, 0.003906] | 2/512 = 0.003906 ✓ |
| [696, 540] | [0.002874, 0.003704] | 2/696 = 0.002874 ✓ |
| [1024, 768] | [0.001953, 0.002604] | 2/1024 = 0.001953 ✓ |
| [1280, 720] | [0.001563, 0.002778] | 2/1280 = 0.001563 ✓ |
| [1920, 1080] | [0.001042, 0.001852] | 2/1920 = 0.001042 ✓ |

---

## 🔍 技術細節

### Shader 中的計算流程

```glsl
// 步驟 1: 規範化 nodeUV
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;

// 步驟 2: 應用 Tiling 和 Offset
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);

// 步驟 3: 根據 RAMP_DIRECTION 計算 rampCoord
float rampCoord = calculateRampCoord(rampUV);
```

### 為什麼是 2 / contentSize？

因為 Cocos Creator 的 `a_position` 範圍是：
```
[-contentSize/2, contentSize/2]
```

要將其轉換為 [-1, 1]，需要：
```
scale = 1 / (contentSize/2) = 2 / contentSize
```

完整轉換過程：
```
原始範圍：[-contentSize/2, contentSize/2]
步驟1：× (2/contentSize) → [-1, 1]
步驟2：+ 1.0 → [0, 2]
步驟3：× 0.5 → [0, 1] ✓
```

---

## ⚠️ 注意事項

### 1. 不同尺寸需要獨立計算
每個不同 `contentSize` 的節點需要：
- 添加獨立的 `RampShaderResetInspector` 組件
- 或使用不同的材質實例

### 2. 動態尺寸需要重新計算
當節點的 `contentSize` 改變後，必須調用：
```typescript
inspector.recalculateNodeUVScale();
```

### 3. 材質共用問題
如果多個節點共用同一個材質實例：
- 它們必須有相同的 `contentSize`
- 否則效果會不一致

### 4. 編輯器模式
組件使用 `@executeInEditMode`，在編輯器中也會運行：
- 可以即時看到效果
- 修改 `contentSize` 後需手動刷新

---

## 🐛 疑難排解

### 問題 1: 還是重複太多次

**可能原因:**
- `autoCalculateOnLoad` 未啟用
- `nodeUVScale` 沒有正確設定
- `rampUVScale` 不是 [1.0, 1.0]

**解決方法:**
```typescript
inspector.showDetailedLogs = true;
inspector.recalculateNodeUVScale();
inspector.printCalculationGuide();
```

### 問題 2: 控制台沒有日誌

**檢查:**
- `showDetailedLogs` 是否為 true
- 組件是否正確添加到節點上
- `targetSprite` 是否有 customMaterial

### 問題 3: 效果與預期不符

**檢查清單:**
1. ✓ nodeUVScale 計算正確
2. ✓ rampUVScale = [1.0, 1.0]
3. ✓ rampUVOffset = [0.0, 0.0]
4. ✓ RAMP_DIRECTION 設定正確
5. ✓ 材質類型是 RampColorShader

---

## 📝 文件清單

### 修改的文件
- ✅ `game169/assets/scripts/RampShaderResetInspector.ts` - 增強功能

### 新增的文件
- ✅ `docs/RampShaderResetInspector-Usage-Guide.md` - 完整使用指南
- ✅ `docs/RampShaderResetInspector-Quick-Reference.md` - 快速參考卡
- ✅ `docs/RampUV-Solution-Summary.md` - 本文件（總結）

### 未修改的文件
- ⭕ `game169/assets/effect/RampColorShader.effect` - **保持不變**

---

## 🎓 總結

### 核心成果
1. ✅ **精準公式**: `nodeUVScale = 2 / contentSize`
2. ✅ **自動計算**: 組件自動處理所有計算
3. ✅ **易於使用**: 只需添加組件即可
4. ✅ **靈活控制**: 提供豐富的 API
5. ✅ **完整文檔**: 詳細的使用指南和範例

### 關鍵優勢
- 🎯 **不修改 Shader**: 所有邏輯在 TypeScript 組件中
- 🚀 **自動化**: 無需手動計算和配置
- 📊 **精確**: 保證單次完整覆蓋
- 🔧 **靈活**: 支持各種尺寸和動態調整
- 📚 **完善**: 詳細文檔和範例

### 推薦工作流程
1. 在節點上添加 `RampShaderResetInspector` 組件
2. 啟用 `autoCalculateOnLoad` 和 `showDetailedLogs`
3. 運行場景，確認計算正確
4. 根據需要調整 `rampUVScale` 和 `rampUVOffset`
5. 使用 `printCalculationGuide()` 查看完整資訊

---

## 📞 快速幫助

### 查看計算結果
```typescript
inspector.printCalculationGuide();
```

### 重新計算
```typescript
inspector.recalculateNodeUVScale();
```

### 查看文檔
- 完整指南: `docs/RampShaderResetInspector-Usage-Guide.md`
- 快速參考: `docs/RampShaderResetInspector-Quick-Reference.md`

---

*最後更新: 2025-10-17*
*版本: 1.0.0*
*作者: GitHub Copilot*
