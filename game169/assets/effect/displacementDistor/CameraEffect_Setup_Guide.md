# Camera Displacement Effect - 完整設置指南

> 本指南將一步步教你如何設置全屏攝像機後處理扭曲效果

---

## 📋 概述

`CameraDisplacementEffect` 將扭曲效果應用到整個攝像機視圖，實現全屏後處理效果。

**原理**: 
1. 一個攝像機（RenderCamera）渲染場景到 RenderTexture
2. 將 RenderTexture 貼到全屏 Plane 上
3. Plane 使用扭曲 Shader 處理紋理
4. 主攝像機只渲染這個 Plane

---

## 🎯 步驟 1: 創建場景結構

### 1.1 創建渲染攝像機

在 **Hierarchy** 面板：
```
右鍵 → Create → Camera
```

設置屬性：
- **Name**: `RenderCamera`
- **Priority**: `-1` （比主攝像機先渲染）
- **Visibility**: 勾選所有要渲染的 Layers（例如 Default, UI 等）
- **Clear Flags**: `SOLID_COLOR` 或 `SKYBOX`

### 1.2 創建全屏 Plane

在 **Hierarchy** 面板：
```
右鍵 → Create → 3D Object → Plane
```

設置屬性：
- **Name**: `FullscreenPlane`
- **Position**: `(0, 0, 5)` （在主攝像機前方）
- **Rotation**: `(0, 0, 0)`
- **Scale**: 根據攝像機視野調整（通常 `(10, 1, 10)` 左右）

💡 **調整 Plane 大小**：
- 運行場景，調整 Scale 直到 Plane 完全覆蓋屏幕
- 或使用腳本自動計算適配大小

### 1.3 設置 Layer

創建專用 Layer（可選但推薦）：

1. **Project Settings** → **Layers**
2. 添加新 Layer：`PostProcessPlane`
3. 將 `FullscreenPlane` 的 Layer 設為 `PostProcessPlane`

### 1.4 配置主攝像機

選擇 **Main Camera**，設置：
- **Priority**: `0` 或更高（確保在 RenderCamera 之後）
- **Visibility**: 只勾選 `PostProcessPlane` Layer
- **Clear Flags**: `SOLID_COLOR`
- **Background Color**: 黑色或透明

---

## 🎨 步驟 2: 創建並配置材質

### 2.1 創建材質

在 **Assets** 面板：
```
右鍵 → Material → 命名為 "FullscreenDistortion.mtl"
```

### 2.2 選擇 Effect

選中材質 → **Inspector** 面板：
- **Effect**: 選擇 `DisplacementDistortion`

### 2.3 設置參數

| 參數 | 建議值 | 說明 |
|------|--------|------|
| **位移貼圖** | 雲彩/噪點紋理 | 必須設置 |
| **位移強度** | 0.05 - 0.15 | 全屏效果建議較小值 |
| **位移縮放** | 1.5 - 2.0 | 貼圖平鋪 |
| **動畫速度** | 0.3 - 1.0 | 動畫速度 |
| **扭曲類型** | 0 | XY 雙軸 |

### 2.4 應用材質

將 `FullscreenDistortion.mtl` 拖拽到 `FullscreenPlane` 的 **MeshRenderer** 組件上。

---

## 🔧 步驟 3: 添加腳本組件

### 3.1 添加組件

選擇 **Main Camera** 節點：
```
Add Component → 搜索 "CameraDisplacementEffect"
```

### 3.2 設置引用

在 **CameraDisplacementEffect** 組件中：

| 屬性 | 設置 |
|------|------|
| **Target Camera** | 拖入 `RenderCamera` 節點 |
| **Fullscreen Plane** | 拖入 `FullscreenPlane` 的 **MeshRenderer** |
| **Render Texture Width** | 1024（PC）或 512（移動） |
| **Render Texture Height** | 1024（PC）或 512（移動） |

---

## ✅ 步驟 4: 測試運行

### 4.1 運行場景

點擊 **Play** 按鈕運行場景。

### 4.2 驗證效果

**應該看到**：
- ✅ 整個畫面有扭曲效果
- ✅ 扭曲會動態變化（如果動畫速度 > 0）
- ✅ 場景內容正常渲染

**如果看不到效果**：
- ❌ 檢查 RenderCamera 是否正在渲染內容
- ❌ 檢查 Plane 是否覆蓋整個屏幕
- ❌ 檢查材質是否正確設置位移貼圖
- ❌ 檢查 Layer 和 Visibility 設置

---

## 🎓 完整場景結構示例

```
Scene
├─ Main Camera (主攝像機)
│  ├─ Priority: 0
│  ├─ Visibility: [PostProcessPlane]
│  └─ Components:
│     └─ CameraDisplacementEffect
│        ├─ Target Camera: RenderCamera
│        ├─ Fullscreen Plane: FullscreenPlane/MeshRenderer
│        ├─ Render Texture Width: 1024
│        └─ Render Texture Height: 1024
│
├─ RenderCamera (渲染攝像機)
│  ├─ Priority: -1
│  ├─ Visibility: [Default, UI, etc.]
│  └─ Clear Flags: SOLID_COLOR
│
├─ FullscreenPlane (全屏平面)
│  ├─ Layer: PostProcessPlane
│  ├─ Position: (0, 0, 5)
│  ├─ Scale: (10, 1, 10)
│  └─ MeshRenderer
│     └─ Material: FullscreenDistortion.mtl
│        └─ Effect: DisplacementDistortion
│
└─ 遊戲內容 (精靈、3D物體等)
   └─ Layer: Default
```

---

## 💻 進階：腳本動態控制

### 動態調整扭曲參數

```typescript
import { _decorator, Component, MeshRenderer, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PostProcessController')
export class PostProcessController extends Component {
    @property(MeshRenderer)
    plane: MeshRenderer = null!;
    
    private material: Material = null!;
    
    start() {
        this.material = this.plane.getMaterial(0)!;
    }
    
    // 調整扭曲強度
    setDistortionStrength(value: number) {
        this.material.setProperty('displacementStrength', value);
    }
    
    // 開始/停止動畫
    toggleAnimation(enable: boolean) {
        this.material.setProperty('timeSpeed', enable ? 1.0 : 0.0);
    }
    
    // 切換扭曲類型
    setDistortionType(type: number) {
        // 0=XY, 1=X, 2=Y, 3=Radial
        this.material.setProperty('distortionType', type);
    }
    
    // 製作淡入效果
    fadeInDistortion(duration: number) {
        let elapsed = 0;
        const update = (dt: number) => {
            elapsed += dt;
            const t = Math.min(elapsed / duration, 1.0);
            this.setDistortionStrength(t * 0.15);
            
            if (t >= 1.0) {
                this.unschedule(update);
            }
        };
        this.schedule(update);
    }
}
```

### 動態切換後處理

```typescript
import { _decorator, Component } from 'cc';
import { CameraDisplacementEffect } from './CameraDisplacementEffect';
const { ccclass, property } = _decorator;

@ccclass('EffectToggle')
export class EffectToggle extends Component {
    @property(CameraDisplacementEffect)
    effect: CameraDisplacementEffect = null!;
    
    // 啟用/禁用後處理
    toggleEffect(enable: boolean) {
        this.effect.enabled = enable;
    }
    
    // 受到傷害時觸發扭曲
    onPlayerHit() {
        this.effect.enabled = true;
        this.scheduleOnce(() => {
            this.effect.enabled = false;
        }, 0.5); // 0.5 秒後關閉
    }
}
```

---

## 🎯 實際應用場景

### 場景 1: 水下效果

```
位移強度: 0.08
位移縮放: 1.5
動畫速度: 0.3
扭曲類型: 0 (XY)
```

配合藍色 tint 和降低透明度。

### 場景 2: 醉酒效果

```
位移強度: 0.12
位移縮放: 2.0
動畫速度: 0.5
扭曲類型: 3 (徑向)
```

配合模糊效果更佳。

### 場景 3: 熱浪效果

```
位移強度: 0.05
位移縮放: 3.0
動畫速度: 1.0
扭曲類型: 2 (Y軸)
```

適合沙漠、火焰場景。

### 場景 4: 爆炸衝擊波

```typescript
// 從中心向外擴散的衝擊波
onExplosion() {
    let strength = 0;
    const maxStrength = 0.3;
    const duration = 0.5;
    
    const update = (dt: number) => {
        strength += (maxStrength / duration) * dt;
        this.material.setProperty('displacementStrength', strength);
        
        if (strength >= maxStrength) {
            this.unschedule(update);
            // 漸漸恢復
            this.fadeOut();
        }
    };
    this.schedule(update);
}
```

---

## ⚙️ 性能優化建議

### RenderTexture 解析度

| 平台 | 建議解析度 | 說明 |
|------|-----------|------|
| **高端 PC** | 1920x1080 或更高 | 保持原生解析度 |
| **中端 PC** | 1280x720 | 平衡性能與質量 |
| **移動設備** | 512x512 或 1024x1024 | 優先性能 |
| **低端移動** | 256x256 或 512x512 | 最低配置 |

### 動態調整質量

```typescript
import { sys } from 'cc';

start() {
    // 根據平台自動調整
    if (sys.isMobile) {
        this.effect.renderTextureWidth = 512;
        this.effect.renderTextureHeight = 512;
    } else {
        this.effect.renderTextureWidth = 1280;
        this.effect.renderTextureHeight = 720;
    }
}
```

### 條件啟用

只在需要時啟用後處理：

```typescript
update(dt: number) {
    // 只有在特定條件下啟用
    const needEffect = this.player.isUnderwater || this.player.isDrunk;
    this.effect.enabled = needEffect;
}
```

---

## 🐛 常見問題

### Q1: 看到黑屏或空白

**原因**: 
- RenderCamera 沒有正確渲染
- Plane 沒有覆蓋屏幕
- Layer 設置錯誤

**解決**:
1. 檢查 RenderCamera 的 Visibility
2. 調整 Plane 的位置和縮放
3. 確認主 Camera 只能看到 Plane 的 Layer

### Q2: 效果不明顯

**原因**:
- 位移強度太小
- 位移貼圖是純灰色
- 沒有設置位移貼圖

**解決**:
1. 增加位移強度（0.1 - 0.2）
2. 確認位移貼圖有黑白對比
3. 檢查材質參數

### Q3: 性能問題/卡頓

**原因**:
- RenderTexture 解析度太高
- 設備性能不足

**解決**:
1. 降低 RenderTexture 解析度
2. 使用條件啟用
3. 簡化位移貼圖（降低解析度）

### Q4: UI 也被扭曲了

**原因**:
- RenderCamera 渲染了 UI Layer

**解決**:
1. 確保 UI Camera 的 Priority 最高
2. RenderCamera 的 Visibility 不要包含 UI Layer
3. 或創建單獨的 UI Camera

### Q5: 邊緣有黑邊

**原因**:
- Plane 沒有完全覆蓋屏幕
- 攝像機視野角度問題

**解決**:
1. 增加 Plane 的 Scale
2. 調整 Plane 的位置（Z 軸）
3. 確保 Plane 的寬高比與屏幕一致

---

## 📚 相關資源

- [Cocos Creator Camera 文檔](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/camera-component.html)
- [RenderTexture 文檔](https://docs.cocos.com/creator/3.8/manual/zh/asset/render-texture.html)
- [後處理效果最佳實踐](https://docs.cocos.com/creator/3.8/manual/zh/shader/)

---

## ✨ 總結

使用 `CameraDisplacementEffect` 的關鍵點：

1. ✅ 雙攝像機設置（渲染 + 顯示）
2. ✅ 全屏 Plane 正確縮放
3. ✅ Layer 隔離（避免重複渲染）
4. ✅ RenderTexture 解析度適配平台
5. ✅ 材質參數合理設置

完成設置後，你就擁有了一個強大的全屏扭曲後處理系統！

---

**更新日期**: 2025-10-14  
**版本**: 1.0  
**兼容性**: Cocos Creator 3.8.4+
