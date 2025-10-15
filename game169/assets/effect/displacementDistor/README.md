# Displacement Distortion Shader - 快速使用指南

## 🚀 快速開始（5 步驟）

### 1️⃣ 創建材質

在 Assets 面板中：
- 右鍵點擊 → **Material** → 命名為 `MyDistortion.mtl`

### 2️⃣ 選擇 Effect

選中材質 → Inspector 面板 → **Effect** 下拉選單 → 選擇 **DisplacementDistortion**

### 3️⃣ 準備位移貼圖

需要一張**灰階圖片**（建議 256x256 或 512x512）：
- **灰色（128）** = 不扭曲
- **白色（255）** = 正方向扭曲
- **黑色（0）** = 負方向扭曲

💡 **快速獲取位移貼圖**：
- 使用 Photoshop 的雲彩濾鏡（Filter → Render → Clouds）
- 或使用在線 Perlin Noise 生成器

### 4️⃣ 應用到 Sprite

選擇場景中的 **Sprite** 節點：
- Inspector → **Sprite** 組件
- 將材質拖拽到 **CustomMaterial** 欄位

### 5️⃣ 調整參數

| 參數 | 預設值 | 說明 |
|------|--------|------|
| **位移貼圖** | - | 拖入你的灰階圖片 |
| **位移強度** | 0.1 | 扭曲程度（0-1） |
| **位移縮放** | 1.0 | 貼圖平鋪次數 |
| **動畫速度** | 1.0 | 動畫快慢（0=靜態） |
| **扭曲類型** | 0 | 0=XY / 1=X軸 / 2=Y軸 / 3=徑向 |

---

## 🎨 常見效果參數

### 水波效果
```
位移強度: 0.15
位移縮放: 1.5
動畫速度: 0.3
扭曲類型: 0
```

### 熱浪效果
```
位移強度: 0.08
位移縮放: 2.0
動畫速度: 0.5
扭曲類型: 2 (Y軸)
```

### 玻璃扭曲（靜態）
```
位移強度: 0.2
位移縮放: 3.0
動畫速度: 0.0
扭曲類型: 0
```

### 能量場
```
位移強度: 0.25
位移縮放: 1.0
動畫速度: 1.5
扭曲類型: 3 (徑向)
```

---

## 💻 腳本控制

```typescript
import { _decorator, Component, Sprite, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DistortionController')
export class DistortionController extends Component {
    @property(Material)
    material: Material = null!;
    
    start() {
        const sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.customMaterial = this.material;
        }
    }
    
    // 動態調整強度
    setStrength(value: number) {
        this.material?.setProperty('displacementStrength', value);
    }
    
    // 動態調整速度
    setSpeed(value: number) {
        this.material?.setProperty('timeSpeed', value);
    }
    
    // 切換扭曲類型 (0-3)
    setType(type: number) {
        this.material?.setProperty('distortionType', type);
    }
}
```

---

## ⚠️ 注意事項

1. ✋ **會打斷批次合併**：使用自定義材質會影響渲染批次
2. 📱 **移動設備**：建議位移貼圖不超過 512x512
3. 🎯 **效果不明顯**：確保位移貼圖不是純灰色，且位移強度 > 0

---

## 🐛 問題排查

| 問題 | 解決方法 |
|------|----------|
| 看不到效果 | 檢查是否設置位移貼圖、強度是否為 0 |
| 沒有動畫 | 確認動畫速度不為 0，場景正在運行 |
| 效果太強/太弱 | 調整位移強度（0.05-0.3 之間嘗試） |
| 編輯器看不到動畫 | 動畫需要在運行時才會播放 |

---

---

## 🎥 Camera 全屏後處理效果

`CameraDisplacementEffect.ts` 可以將扭曲效果應用到整個攝像機視圖（全屏效果）。

### 使用步驟

#### 1️⃣ 創建渲染用 Camera（新建獨立節點）

⚠️ **重要**：這是一個**全新的 Camera 節點**，不是修改現有的主攝像機！

在 **Hierarchy 面板的根層級**（與 Main Camera 平行）創建：
```
場景根目錄
├─ Main Camera (已存在，保持不動)
├─ Canvas (已存在的 UI，保持不動)
├─ 你的遊戲物件們 (保持不動)
└─ RenderCamera (← 新建這個！)
```

創建步驟：
1. 在 **Hierarchy 面板空白處右鍵**
2. 選擇 **Create → Camera**
3. 命名為 `RenderCamera`
4. 設置屬性：
   - **Priority**: `-1`（比主攝像機的 0 小，先渲染）
   - **Visibility**: 勾選 `Default`、`UI` 等所有遊戲內容的 Layers
   - **Clear Flags**: `SOLID_COLOR` 或 `SKYBOX`
   - **位置**: 可以和 Main Camera 相同位置

💡 **理解**：這個 Camera 負責把整個場景渲染到一張紋理上。

#### 2️⃣ 創建全屏 Plane（作為 Main Camera 的子節點）

在 **Main Camera 節點下**創建一個全屏平面：

```
Main Camera
└─ FullscreenPlane (← 新建這個！作為 Main Camera 的子節點)
```

創建步驟：
1. **選中 Main Camera 節點**
2. 右鍵 → **Create → 3D Object → Plane**
3. 命名為 `FullscreenPlane`
4. 設置屬性：
   - **Position**: `(0, 0, 5)`（在攝像機前方 5 單位）
   - **Rotation**: `(0, 0, 0)`
   - **Scale**: `(8, 1, 6)` 左右（需調整到剛好覆蓋屏幕）

💡 **為什麼作為子節點**：這樣 Plane 會跟隨攝像機移動/旋轉，始終在鏡頭前方。

#### 3️⃣ 設置主 Camera（修改現有的 Main Camera）

⚠️ **這是修改你現有的主攝像機**，不是新建！

調整主攝像機（用於最終顯示）：
- 選中你現有的 **Main Camera**
- 修改設置：
  - **Priority**: `0` 或保持預設（確保大於 RenderCamera 的 -1）
  - **Clear Flags**: `SOLID_COLOR`
  - **Visibility**: 
    - ✅ **取消勾選** `Default`（不渲染遊戲物件）
    - ✅ **取消勾選** `UI`（不渲染 UI）
    - ✅ **只勾選** 一個新 Layer（如 `PostProcessPlane`）或留空使用 Default

💡 **關鍵點**：主攝像機現在只負責看到那個全屏 Plane，不再直接看遊戲內容。

#### 3.5️⃣ 設置 Layer（可選但建議）

為了更好地控制渲染，創建專用 Layer：

1. 菜單欄 → **Project → Project Settings**
2. 左側選擇 **Layers**
3. 找一個空的 **User Layer**（如 User Layer 0）
4. 命名為 `PostProcessPlane`
5. 將 `FullscreenPlane` 節點的 **Layer** 設為 `PostProcessPlane`
6. 主 Camera 的 **Visibility** 只勾選 `PostProcessPlane`

這樣可以清晰分離：
- RenderCamera 看遊戲內容（Default, UI 等）
- Main Camera 只看 Plane（PostProcessPlane）

#### 4️⃣ 添加組件

在主 Camera 節點上：
- 添加 `CameraDisplacementEffect` 組件
- **Target Camera**: 拖入 RenderCamera
- **Fullscreen Plane**: 拖入全屏 Plane 的 MeshRenderer

#### 5️⃣ 配置材質

給全屏 Plane 應用材質：
- 使用 `DisplacementDistortion.effect` 創建材質
- 設置位移貼圖和參數
- 應用到 Plane 的 MeshRenderer

### 場景結構示例

```
場景 Hierarchy（最終結構）
│
├─ Main Camera (現有的，修改設置)
│  ├─ Priority: 0
│  ├─ Visibility: [PostProcessPlane] 或留空
│  ├─ Clear Flags: SOLID_COLOR
│  ├─ Components:
│  │  └─ CameraDisplacementEffect (新增)
│  │     ├─ Target Camera: → RenderCamera
│  │     ├─ Fullscreen Plane: → FullscreenPlane/MeshRenderer
│  │     └─ Render Texture: 1024 x 1024
│  └─ FullscreenPlane (新建，作為子節點)
│     ├─ Layer: PostProcessPlane
│     ├─ Position: (0, 0, 5)
│     ├─ Scale: (8, 1, 6)
│     └─ MeshRenderer
│        └─ Material: DisplacementDistortion.mtl
│
├─ RenderCamera (全新建立！)
│  ├─ Priority: -1
│  ├─ Visibility: [Default, UI, ...]（所有遊戲內容）
│  └─ Clear Flags: SOLID_COLOR
│
├─ Canvas (你的 UI，保持不變)
│  └─ Layer: UI
│
├─ Sprite (你的遊戲物件，保持不變)
│  └─ Layer: Default
│
└─ ... (其他遊戲物件，保持不變)
```

### 📝 總結層級關係

| 節點 | 類型 | 位置 | 說明 |
|------|------|------|------|
| **RenderCamera** | 新建 | 根層級 | 獨立節點，與 Main Camera 平行 |
| **FullscreenPlane** | 新建 | Main Camera 子節點 | 跟隨攝像機 |
| **Main Camera** | 修改 | 根層級（已存在） | 只是修改設置 |
| **遊戲物件們** | 不動 | 原位置 | 完全不用動 |

### 參數說明

| 參數 | 說明 |
|------|------|
| **Target Camera** | 用於渲染場景內容的攝像機 |
| **Fullscreen Plane** | 用於顯示扭曲效果的全屏平面 |
| **Render Texture Width** | 渲染紋理寬度（預設 1024） |
| **Render Texture Height** | 渲染紋理高度（預設 1024） |

### 代碼範例

```typescript
import { _decorator, Component, Camera, MeshRenderer } from 'cc';
import { CameraDisplacementEffect } from './CameraDisplacementEffect';
const { ccclass, property } = _decorator;

@ccclass('PostProcessController')
export class PostProcessController extends Component {
    @property(CameraDisplacementEffect)
    effect: CameraDisplacementEffect = null!;
    
    start() {
        // 效果會自動初始化
    }
    
    // 動態調整渲染質量
    setRenderQuality(width: number, height: number) {
        this.effect.renderTextureWidth = width;
        this.effect.renderTextureHeight = height;
        // 需要重新初始化
    }
}
```

### ⚠️ 注意事項

1. **性能影響**: 全屏後處理會影響性能，建議：
   - 移動設備: 512x512 或 1024x1024
   - PC: 1024x1024 或更高

2. **渲染順序**: 確保 RenderCamera 的 Priority 小於主 Camera

3. **Layer 設置**: 
   - RenderCamera 渲染遊戲內容的 Layers
   - 主 Camera 只渲染 Plane 的 Layer

4. **UI 渲染**: 如果需要 UI 不受扭曲影響，將 UI Camera 的 Priority 設為最高

### 🎯 適用場景

- 全屏熱浪效果（沙漠場景）
- 水下畫面扭曲
- 醉酒/暈眩效果
- 時空扭曲
- 魔法屏障效果
- 爆炸衝擊波

---

## 📁 相關檔案

- `DisplacementDistortion.effect` - Shader 主檔案
- `DisplacementDistortion.ts` - 材質組件
- `DisplacementEffectExamples.ts` - 使用範例
- `CameraDisplacementEffect.ts` - Camera 後處理版本

---

**完整文檔**: 請參考 `docs/DisplacementDistortion_Usage_Guide.md`
