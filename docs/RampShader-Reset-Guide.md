# RampColorShader 參數重置功能使用指南

## 📋 功能說明

提供一鍵重置 RampColorShader 所有參數到預設值的功能,方便快速恢復初始狀態。

## 🔧 實現方式

### 1. RampShaderHelper 工具類

**位置:** `assets/scripts/RampShaderHelper.ts`

**主要功能:**
- `resetToDefaults(material)` - 重置所有參數到預設值
- `getDefaultValue(paramName)` - 獲取特定參數的預設值
- `setParameters(material, params)` - 批量設定參數
- `logCurrentValues(material)` - 打印當前所有參數值 (調試用)

### 2. RampShaderController 組件

**位置:** `assets/scripts/RampShaderController.ts`

**功能:**
- 提供一鍵重置按鈕綁定
- 封裝常用操作方法
- 自動管理 Sprite 的 customMaterial

## 📖 使用方法

### 方法 1: 使用 RampShaderController 組件

```typescript
// 1. 在 Sprite 節點上添加 RampShaderController 組件
// 2. (可選) 拖入一個 Button 到 resetButton 屬性
// 3. 點擊按鈕即可重置所有參數

// 或者在代碼中調用:
const controller = this.node.getComponent(RampShaderController);
controller.resetShaderToDefaults();
```

### 方法 2: 直接使用 RampShaderHelper

```typescript
import { RampShaderHelper } from './RampShaderHelper';

// 獲取材質
const sprite = this.node.getComponent(Sprite);
const material = sprite.customMaterial;

// 重置所有參數
RampShaderHelper.resetToDefaults(material);

// 獲取特定參數的預設值
const defaultBrightness = RampShaderHelper.getDefaultValue('brightness');

// 批量設定參數
RampShaderHelper.setParameters(material, {
    brightness: 0.5,
    contrast: 1.2,
    saturation: 0.8
});

// 調試: 打印當前所有參數
RampShaderHelper.logCurrentValues(material);
```

### 方法 3: 在編輯器中手動重置

```typescript
// 創建一個臨時按鈕組件用於編輯器測試
import { _decorator, Component, Sprite } from 'cc';
import { RampShaderHelper } from './RampShaderHelper';

const { ccclass, menu } = _decorator;

@ccclass('ResetRampShader')
@menu('Tools/Reset Ramp Shader')
export class ResetRampShader extends Component {
    start() {
        const sprite = this.getComponent(Sprite);
        if (sprite && sprite.customMaterial) {
            RampShaderHelper.resetToDefaults(sprite.customMaterial);
            console.log('✅ Shader parameters reset to defaults');
        }
    }
}
```

## 🎯 預設值列表

```typescript
tilingOffset: [1.0, 1.0, 0.0, 0.0]  // Tiling & Offset
useMainTexture: 0.0                  // 不使用主紋理
useRampTexture: 0.0                  // 不使用 Ramp 紋理
colorStart: [0, 0, 0, 255]           // 起始顏色 (黑色)
colorEnd: [255, 255, 255, 255]       // 結束顏色 (白色)
rampCenter: [0.5, 0.5]               // Ramp 中心點
rampUVScale: [1.0, 1.0]              // UV 縮放
rampUVOffset: [0.0, 0.0]             // UV 偏移
rampRange: [0.0, 1.0]                // Ramp 範圍
brightness: 0.0                       // 亮度調整
contrast: 1.0                         // 對比度
saturation: 1.0                       // 飽和度
rampIntensity: 1.0                    // Ramp 強度
invertRamp: 0.0                       // 不反轉 Ramp
smoothness: 0.0                       // 平滑度
rectangleAspect: [1.0, 1.0]          // 長方形寬高比
cornerRadius: 0.0                     // 圓角半徑
distortionIntensity: 0.0              // 扭曲強度
distortionFrequency: 5.0              // 扭曲頻率
```

## 💡 使用場景

### 場景 1: UI 按鈕一鍵重置

1. 創建一個 UI 按鈕
2. 在使用 RampShader 的 Sprite 上添加 `RampShaderController` 組件
3. 將按鈕拖到 `resetButton` 屬性
4. 點擊按鈕即可重置

### 場景 2: 編輯器快速測試

```typescript
// 在任意組件中臨時添加:
import { RampShaderHelper } from './RampShaderHelper';

// 在 start() 或按鈕回調中:
const sprite = this.node.getComponent(Sprite);
RampShaderHelper.resetToDefaults(sprite.customMaterial);
```

### 場景 3: 參數預設組合

```typescript
// 預設組合 1: 高對比黑白漸變
RampShaderHelper.setParameters(material, {
    colorStart: new Color(0, 0, 0, 255),
    colorEnd: new Color(255, 255, 255, 255),
    contrast: 2.0,
    brightness: 0.2
});

// 預設組合 2: 柔和彩色漸變
RampShaderHelper.setParameters(material, {
    colorStart: new Color(100, 150, 255, 255),
    colorEnd: new Color(255, 100, 150, 255),
    smoothness: 0.8,
    saturation: 1.5
});

// 預設組合 3: 扭曲效果
RampShaderHelper.setParameters(material, {
    distortionIntensity: 0.3,
    distortionFrequency: 10.0,
    smoothness: 0.5
});
```

## 🔍 調試工具

```typescript
// 打印當前所有參數值
const sprite = this.node.getComponent(Sprite);
RampShaderHelper.logCurrentValues(sprite.customMaterial);

// 控制台輸出:
// === RampColorShader Current Values ===
// tilingOffset: Vec4(1, 1, 0, 0)
// brightness: 0.5
// contrast: 1.2
// ...
// =====================================
```

## ⚠️ 注意事項

1. **材質檢查:** 確保 Sprite 有設定 `customMaterial` 且使用 RampColorShader
2. **Pass 索引:** 預設使用 Pass 0,如果使用多 Pass 材質需要指定索引
3. **即時更新:** 參數修改會立即生效,無需重新啟動
4. **紋理資源:** `resetToDefaults()` 不會重置 `mainTexture` 和 `rampTexture` 的紋理資源引用

## 🚀 擴展功能

如果需要保存/載入參數預設組合,可以擴展 RampShaderHelper:

```typescript
// 保存當前參數為預設組合
public static savePreset(material: Material, presetName: string): void {
    const params = {};
    for (const key of Object.keys(this.DEFAULT_VALUES)) {
        params[key] = material.getProperty(key);
    }
    // 保存到本地存儲或配置文件
    localStorage.setItem(`ramp_preset_${presetName}`, JSON.stringify(params));
}

// 載入預設組合
public static loadPreset(material: Material, presetName: string): void {
    const data = localStorage.getItem(`ramp_preset_${presetName}`);
    if (data) {
        const params = JSON.parse(data);
        this.setParameters(material, params);
    }
}
```

## 📝 完整範例

```typescript
import { _decorator, Component, Sprite, Button } from 'cc';
import { RampShaderHelper } from './RampShaderHelper';

const { ccclass, property } = _decorator;

@ccclass('RampShaderDemo')
export class RampShaderDemo extends Component {
    
    @property(Sprite)
    targetSprite: Sprite = null;
    
    @property(Button)
    resetBtn: Button = null;
    
    @property(Button)
    preset1Btn: Button = null;
    
    @property(Button)
    preset2Btn: Button = null;
    
    start() {
        this.resetBtn.node.on('click', this.onReset, this);
        this.preset1Btn.node.on('click', this.onPreset1, this);
        this.preset2Btn.node.on('click', this.onPreset2, this);
    }
    
    onReset() {
        RampShaderHelper.resetToDefaults(this.targetSprite.customMaterial);
    }
    
    onPreset1() {
        // 高對比預設
        RampShaderHelper.setParameters(this.targetSprite.customMaterial, {
            contrast: 2.0,
            brightness: 0.2,
            saturation: 1.5
        });
    }
    
    onPreset2() {
        // 扭曲預設
        RampShaderHelper.setParameters(this.targetSprite.customMaterial, {
            distortionIntensity: 0.5,
            distortionFrequency: 15.0,
            smoothness: 0.7
        });
    }
}
```

## 📚 相關文件

- `RampColorShader.effect` - Shader 主文件
- `RampShaderHelper.ts` - 工具類
- `RampShaderController.ts` - 控制組件

---

**創建日期:** 2025-10-16
**版本:** 1.0.0
