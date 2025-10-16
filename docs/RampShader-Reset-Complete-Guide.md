# RampColorShader 重置功能完整指南

## 📋 功能概述

RampColorShader 提供四種方式快速重置所有參數到預設值:

1. **🌟 RampShaderResetInspector (推薦)** - 編輯器自動化重置,最簡單
2. **RampShaderController** - UI 按鈕觸發重置
3. **RampShaderHelper** - 代碼直接調用
4. **resetAll 屬性** - 材質面板核取方塊 (需配合 Inspector)

---

## ⭐ 方法 1: RampShaderResetInspector (最推薦)

### 功能特點

- ✅ **零代碼**: 只需掛載組件
- ✅ **編輯器友好**: 直接在材質面板勾選核取方塊
- ✅ **自動化**: 勾選後自動執行並恢復核取方塊
- ✅ **即時反饋**: 控制台輸出重置日誌
- ✅ **安全**: 只在編輯器模式運行

### 使用步驟

#### 1. 添加組件

在使用 RampColorShader 的 Sprite 節點上添加 `RampShaderResetInspector` 組件:

```typescript
// 文件: assets/scripts/RampShaderResetInspector.ts
```

#### 2. 配置 (可選)

如果組件和 Sprite 不在同一節點:

- 在 Inspector 面板中
- 將目標 Sprite 拖到 `Target Sprite` 屬性
- 如果為空,會自動使用同節點的 Sprite

#### 3. 使用重置

在材質面板中:

1. 找到 **"🔄 重置所有參數"** 核取方塊
2. 勾選它
3. Inspector 自動:
   - 檢測到 resetAll = true
   - 執行重置所有參數
   - 將 resetAll 設回 false
4. 完成!

### 工作原理

```typescript
// 在 update() 中持續監控
protected update(dt: number): void {
    if (!EDITOR) return;  // 只在編輯器運行
    
    const resetAll = material.getProperty('resetAll');
    
    // 檢測到從 false 變為 true
    if (resetAll && !this.lastResetState) {
        this.resetAllParameters(material);      // 重置
        material.setProperty('resetAll', 0.0);  // 恢復核取方塊
    }
}
```

### 控制台輸出

```
🔄 Resetting all RampShader parameters...
✅ All parameters reset to defaults
```

### 手動觸發 (可選)

也可以在代碼中手動觸發:

```typescript
const inspector = node.getComponent(RampShaderResetInspector);
inspector.manualReset();
```

---

## 方法 2: RampShaderController 組件

### 功能特點

- ✅ UI 按鈕綁定
- ✅ 運行時重置
- ✅ 提供設定單個參數的方法
- ✅ 調試工具

### 使用步驟

#### 1. 添加組件

```typescript
// 在 Sprite 節點上添加 RampShaderController 組件
```

#### 2. 創建 UI 按鈕

在場景中創建一個 Button 節點:

```
Canvas
└── ResetButton (Button)
    └── Label (Label: "重置參數")
```

#### 3. 綁定按鈕

在 Inspector 面板中:
- 將 Button 拖到 RampShaderController 的 `Reset Button` 屬性

#### 4. 完成!

點擊按鈕即可重置所有參數

### 代碼示例

```typescript
import { RampShaderController } from './RampShaderController';

// 獲取組件
const controller = spriteNode.getComponent(RampShaderController);

// 重置所有參數
controller.resetShaderToDefaults();

// 設定單個參數
controller.setShaderParameter('brightness', 0.5);
controller.setShaderParameter('rampIntensity', 0.8);

// 調試: 打印當前參數
controller.logCurrentParameters();
```

---

## 方法 3: RampShaderHelper 工具類

### 功能特點

- ✅ 純靜態方法,無需實例化
- ✅ 可在任何腳本中使用
- ✅ 提供獲取單個參數預設值
- ✅ 批量設定參數

### 使用方法

```typescript
import { RampShaderHelper } from './RampShaderHelper';

// 重置所有參數
const material = sprite.customMaterial;
RampShaderHelper.resetToDefaults(material);

// 獲取單個參數的預設值
const defaultBrightness = RampShaderHelper.getDefaultValue('brightness');
const defaultColorStart = RampShaderHelper.getDefaultValue('colorStart');

// 批量設定參數
RampShaderHelper.setParameters(material, {
    brightness: 0.2,
    contrast: 1.5,
    saturation: 0.8
});

// 調試: 打印當前所有參數
RampShaderHelper.logCurrentValues(material);
```

### API 文檔

#### resetToDefaults(material, passIndex = 0)

重置所有參數到預設值

**參數:**
- `material: Material` - 要重置的材質
- `passIndex: number` - Pass 索引,通常為 0

**返回:** `void`

#### getDefaultValue(paramName)

獲取特定參數的預設值

**參數:**
- `paramName: string` - 參數名稱

**返回:** 該參數的預設值 (克隆)

**範例:**
```typescript
const defaultTiling = RampShaderHelper.getDefaultValue('tilingOffset');
// Vec4(1.0, 1.0, 0.0, 0.0)
```

#### setParameters(material, params, passIndex = 0)

批量設定參數

**參數:**
- `material: Material` - 目標材質
- `params: Record<string, any>` - 參數對象
- `passIndex: number` - Pass 索引

**返回:** `void`

#### logCurrentValues(material, passIndex = 0)

打印當前所有參數值 (調試用)

**參數:**
- `material: Material` - 目標材質
- `passIndex: number` - Pass 索引

**輸出示例:**
```
=== RampShader Current Values ===
tilingOffset: (1, 1, 0, 0)
colorStart: (0, 0, 0, 255)
colorEnd: (255, 255, 255, 255)
brightness: 0
contrast: 1
...
```

---

## 方法 4: resetAll 屬性 (需配合 Inspector)

### 使用方式

1. 在材質面板找到 **"🔄 重置所有參數"** 核取方塊
2. 勾選它
3. **必須配合 RampShaderResetInspector 組件** 才能自動執行

### 注意事項

- ⚠️ 單獨勾選核取方塊不會執行重置
- ⚠️ 必須搭配 RampShaderResetInspector 組件
- ℹ️ 推薦直接使用方法 1 (RampShaderResetInspector)

---

## 📊 所有參數的預設值

| 參數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `tilingOffset` | `Vec4(1, 1, 0, 0)` | UV 平鋪和偏移 |
| `useMainTexture` | `0.0` | 不使用主紋理 |
| `useRampTexture` | `0.0` | 不使用 Ramp 紋理 |
| `colorStart` | `Color(0, 0, 0, 255)` | 黑色 |
| `colorEnd` | `Color(255, 255, 255, 255)` | 白色 |
| `rampCenter` | `Vec2(0.5, 0.5)` | 中心位置 |
| `rampUVScale` | `Vec2(1, 1)` | UV 縮放 |
| `rampUVOffset` | `Vec2(0, 0)` | UV 偏移 |
| `rampRange` | `Vec2(0, 1)` | 完整範圍 |
| `brightness` | `0.0` | 不調整亮度 |
| `contrast` | `1.0` | 原始對比度 |
| `saturation` | `1.0` | 原始飽和度 |
| `rampIntensity` | `1.0` | 完整強度 |
| `invertRamp` | `0.0` | 不反轉 |
| `smoothness` | `0.0` | 無平滑 |
| `rectangleAspect` | `Vec2(1, 1)` | 正方形 |
| `cornerRadius` | `0.0` | 直角 |
| `distortionIntensity` | `0.0` | 無扭曲 |
| `distortionFrequency` | `5.0` | 預設頻率 |

---

## 🎯 使用場景

### 場景 1: 編輯器快速調整

**需求:** 在編輯器中測試各種參數組合,需要快速重置

**推薦方案:** RampShaderResetInspector ⭐

```typescript
// 1. 掛載 RampShaderResetInspector 組件到 Sprite 節點
// 2. 調整各種參數測試效果
// 3. 在材質面板勾選 "🔄 重置所有參數"
// 4. 自動恢復預設值,繼續測試下一組參數
```

**優點:**
- 最快速,無需寫代碼
- 一鍵重置
- 即時看到效果

---

### 場景 2: 運行時 UI 控制

**需求:** 遊戲中提供"重置特效"按鈕給玩家

**推薦方案:** RampShaderController

```typescript
// 1. 添加 RampShaderController 組件到特效 Sprite
// 2. 創建 UI Button
// 3. 綁定按鈕到 controller.resetButton
// 4. 玩家點擊按鈕即可重置
```

**UI 層級:**
```
Canvas
├── EffectSprite (RampShaderController)
└── UI_Panel
    └── ResetButton
```

---

### 場景 3: 關卡切換重置

**需求:** 每次進入關卡時重置特效參數

**推薦方案:** RampShaderHelper

```typescript
export class LevelManager extends Component {
    @property(Sprite)
    effectSprite: Sprite = null;
    
    onLevelStart(): void {
        // 重置特效參數
        const material = this.effectSprite.customMaterial;
        RampShaderHelper.resetToDefaults(material);
        
        console.log('特效參數已重置');
    }
}
```

---

### 場景 4: 技能系統參數管理

**需求:** 不同技能使用不同參數配置,需要快速切換

**推薦方案:** RampShaderHelper + 自定義配置

```typescript
export class SkillEffectManager extends Component {
    @property(Sprite)
    effectSprite: Sprite = null;
    
    // 技能配置
    private skillConfigs = {
        fireball: {
            colorStart: new Color(255, 100, 0, 255),
            colorEnd: new Color(255, 255, 0, 255),
            distortionIntensity: 0.3,
            rampIntensity: 1.2
        },
        ice: {
            colorStart: new Color(100, 200, 255, 255),
            colorEnd: new Color(200, 230, 255, 255),
            smoothness: 0.5,
            brightness: 0.2
        }
    };
    
    useSkill(skillName: string): void {
        const material = this.effectSprite.customMaterial;
        
        // 先重置到預設值
        RampShaderHelper.resetToDefaults(material);
        
        // 再套用技能特定參數
        const config = this.skillConfigs[skillName];
        if (config) {
            RampShaderHelper.setParameters(material, config);
        }
    }
}
```

**使用:**
```typescript
skillManager.useSkill('fireball');  // 火球術效果
skillManager.useSkill('ice');       // 寒冰術效果
```

---

### 場景 5: 調試參數調整

**需求:** 開發時需要查看當前參數值,調整並測試

**推薦方案:** RampShaderHelper.logCurrentValues

```typescript
export class EffectDebugger extends Component {
    @property(Sprite)
    effectSprite: Sprite = null;
    
    protected start(): void {
        const material = this.effectSprite.customMaterial;
        
        // 打印初始參數
        console.log('=== 初始參數 ===');
        RampShaderHelper.logCurrentValues(material);
        
        // 調整一些參數
        RampShaderHelper.setParameters(material, {
            brightness: 0.5,
            contrast: 1.3,
            saturation: 0.7
        });
        
        // 打印調整後參數
        console.log('=== 調整後參數 ===');
        RampShaderHelper.logCurrentValues(material);
        
        // 重置
        RampShaderHelper.resetToDefaults(material);
        
        // 確認重置成功
        console.log('=== 重置後參數 ===');
        RampShaderHelper.logCurrentValues(material);
    }
}
```

---

## 🛠️ 擴展建議

### 1. 儲存/載入參數預設組

```typescript
export class RampShaderPresetManager {
    private presets: Map<string, any> = new Map();
    
    // 儲存當前參數為預設組
    savePreset(name: string, material: Material): void {
        const params = {
            tilingOffset: material.getProperty('tilingOffset'),
            colorStart: material.getProperty('colorStart'),
            // ... 其他參數
        };
        this.presets.set(name, params);
    }
    
    // 載入預設組
    loadPreset(name: string, material: Material): void {
        const params = this.presets.get(name);
        if (params) {
            RampShaderHelper.setParameters(material, params);
        }
    }
    
    // 重置到預設值
    resetToDefaults(material: Material): void {
        RampShaderHelper.resetToDefaults(material);
    }
}
```

### 2. 參數動畫漸變

```typescript
export class RampShaderAnimator extends Component {
    // 從當前參數漸變到預設值
    async resetWithAnimation(material: Material, duration: number = 1.0): Promise<void> {
        const currentBrightness = material.getProperty('brightness');
        const targetBrightness = 0.0;
        
        await this.tween(currentBrightness, targetBrightness, duration, (value) => {
            material.setProperty('brightness', value);
        });
        
        // 最後確保完全重置
        RampShaderHelper.resetToDefaults(material);
    }
}
```

---

## ❓ 常見問題

### Q1: 勾選 resetAll 核取方塊沒有反應?

**A:** 需要同時掛載 `RampShaderResetInspector` 組件。單獨的核取方塊只是 UI 指示器,不會執行重置。

**解決方案:**
```typescript
// 在 Sprite 節點上添加
node.addComponent(RampShaderResetInspector);
```

---

### Q2: 如何只重置部分參數?

**A:** 使用 `RampShaderHelper.setParameters` 手動設定:

```typescript
const material = sprite.customMaterial;

// 只重置顏色相關參數
RampShaderHelper.setParameters(material, {
    colorStart: RampShaderHelper.getDefaultValue('colorStart'),
    colorEnd: RampShaderHelper.getDefaultValue('colorEnd')
});

// 只重置調整參數
RampShaderHelper.setParameters(material, {
    brightness: 0.0,
    contrast: 1.0,
    saturation: 1.0
});
```

---

### Q3: 如何在多個 Sprite 上批量重置?

**A:**

```typescript
// 方法 1: 遍歷所有 Sprite
const sprites = this.node.getComponentsInChildren(Sprite);
sprites.forEach(sprite => {
    if (sprite.customMaterial) {
        RampShaderHelper.resetToDefaults(sprite.customMaterial);
    }
});

// 方法 2: 使用標籤篩選
const effectNodes = director.getScene().getChildByTag('effect-sprite');
effectNodes.forEach(node => {
    const sprite = node.getComponent(Sprite);
    if (sprite?.customMaterial) {
        RampShaderHelper.resetToDefaults(sprite.customMaterial);
    }
});
```

---

### Q4: 重置後如何驗證參數正確?

**A:** 使用 `logCurrentValues` 比對:

```typescript
const material = sprite.customMaterial;

console.log('重置前:');
RampShaderHelper.logCurrentValues(material);

RampShaderHelper.resetToDefaults(material);

console.log('重置後:');
RampShaderHelper.logCurrentValues(material);

// 手動驗證特定參數
const brightness = material.getProperty('brightness');
const defaultBrightness = RampShaderHelper.getDefaultValue('brightness');
console.assert(brightness === defaultBrightness, '亮度重置失敗');
```

---

### Q5: RampShaderResetInspector 為什麼只在編輯器運行?

**A:** 這是設計行為,因為:

1. `@executeInEditMode` 裝飾器使組件在編輯器中運行
2. `if (!EDITOR) return;` 檢查防止運行時執行
3. 運行時重置應該使用 `RampShaderController` 或直接調用 `RampShaderHelper`

**運行時重置:**
```typescript
// 不要在運行時使用 RampShaderResetInspector
// 應該使用:
RampShaderHelper.resetToDefaults(material);
```

---

## 📁 文件結構

```
assets/
├── effect/
│   └── RampColorShader.effect         # Shader 文件 (含 resetAll 屬性)
├── scripts/
│   ├── RampShaderHelper.ts            # 工具類
│   ├── RampShaderController.ts        # UI 控制組件
│   └── RampShaderResetInspector.ts    # 編輯器自動化組件 ⭐
└── docs/
    └── RampShader-Reset-Complete-Guide.md  # 本文檔
```

---

## 🎓 總結

### 快速選擇指南

| 場景 | 推薦方案 | 難度 |
|-----|---------|------|
| 編輯器快速測試 | RampShaderResetInspector | ⭐ 最簡單 |
| 運行時 UI 按鈕 | RampShaderController | ⭐⭐ 簡單 |
| 代碼控制 | RampShaderHelper | ⭐⭐⭐ 中等 |
| 自定義邏輯 | 組合使用 | ⭐⭐⭐⭐ 進階 |

### 最佳實踐

1. ✅ **編輯器調試**: 使用 RampShaderResetInspector
2. ✅ **運行時重置**: 使用 RampShaderController 或 RampShaderHelper
3. ✅ **參數管理**: 使用 RampShaderHelper.setParameters 批量設定
4. ✅ **調試驗證**: 使用 RampShaderHelper.logCurrentValues
5. ⚠️ **避免**: 單獨使用 resetAll 核取方塊 (需配合 Inspector)

---

## 🆘 技術支援

如遇問題,請檢查:

1. ✅ RampShaderResetInspector 組件已正確添加到節點
2. ✅ Sprite 有正確的 customMaterial 使用 RampColorShader
3. ✅ 控制台是否有錯誤訊息
4. ✅ TypeScript 文件是否正確導入

**調試代碼:**
```typescript
// 檢查組件
const inspector = node.getComponent(RampShaderResetInspector);
console.log('Inspector:', inspector);

// 檢查材質
const sprite = node.getComponent(Sprite);
console.log('Material:', sprite?.customMaterial);
console.log('Effect:', sprite?.customMaterial?.effectName);

// 檢查參數
const resetAll = sprite?.customMaterial?.getProperty('resetAll');
console.log('resetAll:', resetAll);
```

---

**版本:** 1.0  
**更新日期:** 2024  
**相容性:** Cocos Creator 3.8+
