# RampUVController - Ramp UV 控制組件

## 概述

`RampUVController` 是一個**專為 RampColorShader 設計**的 UV 控制組件，可以實時控制 Ramp 效果的重複、偏移和主紋理的 Tiling。

**主要功能**：
- ✅ 控制 Ramp 效果的重複次數（rampUVScale）
- ✅ 控制 Ramp 效果的平移（rampUVOffset）
- ✅ 控制主紋理的 Tiling 次數
- ✅ 實時預覽和自動保存
- ✅ 詳細的調試日誌

## 快速開始

### 1. 添加組件

```
1. 選擇使用 RampColorShader 的 Sprite Node
2. Add Component → RampUVController
3. 自動檢測到 Sprite 和材質
4. 在 Inspector 中調整參數
```

### 2. 參數說明

| 參數 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| Target Sprite | Sprite | auto | 使用 RampColorShader 的 Sprite（自動檢測） |
| Ramp UV Scale | Vec2 | (1.0, 1.0) | Ramp 效果的重複次數<br/>(1,1)=不重複 \| (2,2)=重複2x2 |
| Ramp UV Offset | Vec2 | (0.0, 0.0) | Ramp 效果的平移偏移 |
| Main Texture Tiling X | float | 1.0 | 主紋理的 X 軸 Tiling |
| Main Texture Tiling Y | float | 1.0 | 主紋理的 Y 軸 Tiling |
| Auto Save | bool | true | 編輯時自動保存變更 |

### 3. 常見配置

#### 配置 1：Ramp 不重複（推薦）
```
Ramp UV Scale:        (1.0, 1.0)
Ramp UV Offset:       (0.0, 0.0)
Main Texture Tiling:  (1.0, 1.0)
```

#### 配置 2：Ramp 重複 2x2
```
Ramp UV Scale:        (2.0, 2.0)
Ramp UV Offset:       (0.0, 0.0)
Main Texture Tiling:  (1.0, 1.0)
```

#### 配置 3：Tiled 3x3 Sprite + Ramp 不重複
```
Ramp UV Scale:        (1.0, 1.0)
Ramp UV Offset:       (0.0, 0.0)
Main Texture Tiling:  (3.0, 3.0)  ← 因為是 Tiled3x3
```

#### 配置 4：Ramp 向下偏移
```
Ramp UV Scale:        (1.0, 1.0)
Ramp UV Offset:       (0.0, 0.5)  ← 向下偏移一半
Main Texture Tiling:  (1.0, 1.0)
```

## 工作原理

### Shader 中的實現

```glsl
// RampColorShader 使用以下參數
uniform RampProperties {
    vec4 tilingOffset;      // xy=主紋理Tiling, zw=offset
    vec2 rampUVScale;       // Ramp 重複次數
    vec2 rampUVOffset;      // Ramp 平移
    ...
};

// Fragment Shader 中
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

### 組件設置的對應關係

| 組件參數 | Shader 參數 | 說明 |
|---|---|---|
| Ramp UV Scale | rampUVScale | 直接應用 |
| Ramp UV Offset | rampUVOffset | 直接應用 |
| Main Texture Tiling X/Y | tilingOffset.xy | 主紋理 Tiling |

## 調試功能

### Console 日誌

組件會在 Console 中輸出詳細的操作日誌：

```
[RampUVController] 初始化完成
[RampUVController] ✓ 材質初始化成功
[RampUVController] ✓ UV 設置已應用
  - rampUVScale: [1.0, 1.0] ✓
  - rampUVOffset: [0.0, 0.0] ✓
  - tilingOffset: [1.0, 1.0, 0, 0] ✓
```

**日誌符號含義**：
- ✓ = 成功
- ✗ = 失敗
- ⚠️ = 警告

### 問題排查

#### 情況 1：沒有任何屬性被設置
```
[RampUVController] ⚠️ 沒有任何屬性被成功設置，請檢查 Shader 定義
```
**解決方案**：
- 確認 Sprite 使用的是 RampColorShader
- 確認 Material 是自定義的，不是默認材質
- 檢查 Shader 文件中是否定義了 `rampUVScale`、`rampUVOffset`、`tilingOffset`

#### 情況 2：無法找到 Sprite 組件
```
[RampUVController] ✗ 無法找到 Sprite 組件
```
**解決方案**：
- 確認 Node 上有 Sprite 組件
- 或者手動設置 Target Sprite 屬性

#### 情況 3：無法獲取材質
```
[RampUVController] ✗ 無法獲取材質，請確保 Sprite 使用了自定義材質
```
**解決方案**：
- 在 Sprite 的 Material 屬性中設置自定義材質（不是默認的 builtin-sprite）
- 確認自定義材質使用的是 RampColorShader

## 腳本 API

### 方法

```typescript
// 手動應用所有設置（用於運行時調整）
applyAllSettings(): void

// 重置為預設值
resetToDefault(): void

// 分別設置各個參數
setRampUVScale(x: number, y: number): void
setRampUVOffset(x: number, y: number): void
setMainTextureTiling(x: number, y: number): void
```

### 使用範例

```typescript
// 在另一個腳本中獲取並控制
const uvController = this.node.getComponent('RampUVController');

// 設置 Ramp 重複 2x2
uvController.setRampUVScale(2.0, 2.0);

// Ramp 向右偏移
uvController.setRampUVOffset(0.25, 0.0);

// 設置主紋理 Tiling（用於 Tiled 精靈）
uvController.setMainTextureTiling(3.0, 3.0);

// 重置為默認值
uvController.resetToDefault();
```

### 運行時動畫示例

```typescript
export class RampUVAnimator extends Component {
    private uvController: any;
    private time: number = 0;
    
    onLoad() {
        this.uvController = this.node.getComponent('RampUVController');
    }
    
    update(dt: number) {
        this.time += dt;
        
        // Ramp 效果順時針旋轉
        const offsetX = Math.sin(this.time) * 0.2;
        const offsetY = Math.cos(this.time) * 0.2;
        
        this.uvController.setRampUVOffset(offsetX, offsetY);
    }
}
```

## 與 SpriteUVController 的區別

| 特性 | RampUVController | SpriteUVController |
|---|---|---|
| 用途 | RampColorShader 專用 | 通用 UV 控制 |
| 參數 | rampUVScale, rampUVOffset, tilingOffset | uvRepeat, uvScale, uvOffset |
| 調試 | 詳細日誌 | 基礎日誌 |
| 主要紋理控制 | ✓ 支援 tilingOffset | ✗ 不支援 |
| 兼容性 | RampColorShader 只 | 任何自定義 shader |

## 完整使用流程

### 場景配置

```
Node "RampSpriteEffect"
├─ Transform
│  └─ Position: (0, 0, 0)
├─ Sprite
│  ├─ Atlas/Texture: your_texture
│  ├─ Type: Simple (or Tiled)
│  └─ Material: RampColorShader_mat ← 自定義材質
└─ RampUVController ← 添加這個組件
   ├─ Target Sprite: (自動)
   ├─ Ramp UV Scale: (1, 1)
   ├─ Ramp UV Offset: (0, 0)
   └─ Auto Save: true
```

### 步驟 1：設置 Sprite

1. 選擇有 Sprite 的 Node
2. 在 Sprite 組件中：
   - 設置紋理
   - 在 Material 中選擇 RampColorShader 的自定義材質

### 步驟 2：添加 RampUVController

1. Add Component → RampUVController
2. 組件自動檢測 Sprite 和材質
3. 檢查 Console 是否有成功日誌

### 步驟 3：調整參數

1. 根據需要調整 Ramp UV Scale（重複）
2. 根據需要調整 Ramp UV Offset（偏移）
3. 如果是 Tiled 精靈，設置正確的 Main Texture Tiling

### 步驟 4：測試

1. 在編輯器中即時預覽效果
2. 運行遊戲確認效果
3. 如果有問題，查看 Console 日誌進行調試

## 常見問題

### Q1：編輯器中修改參數後沒有看到效果？

A：
1. 確認 Auto Save 已啟用
2. 檢查 Console 日誌，看是否有錯誤信息
3. 嘗試點擊 GameObject 來刷新編輯器
4. 確認 RampColorShader 正確加載

### Q2：運行時修改參數無效？

A：
```typescript
// 確保在運行時調用 applyAllSettings()
const uvController = this.node.getComponent('RampUVController');
uvController.setRampUVScale(2.0, 2.0);
uvController.applyAllSettings();
```

### Q3：如何為不同的精靈使用不同的配置？

A：為每個 Sprite Node 添加一個 RampUVController 組件，各自獨立設置參數。

### Q4：Tiling 精靈（Tiled3x3）應該怎麼設置？

A：
```
Main Texture Tiling X: 3.0  ← 因為是 3x3
Main Texture Tiling Y: 3.0
Ramp UV Scale: (1.0, 1.0)  ← 不重複
```

### Q5：如何實現 Ramp 效果的平滑過渡？

A：使用 Tween 或持續的 update() 循環：
```typescript
// 方法 1：使用 Tween
tween(this.node)
    .by(1.0, { rampUVOffset: new Vec2(0.5, 0) })
    .start();

// 方法 2：在 update() 中
update(dt: number) {
    const current = this.node.getComponent('RampUVController').rampUVOffset;
    current.x += dt * 0.5;
    this.node.getComponent('RampUVController').applyAllSettings();
}
```

---

**Ready to use!** 現在可以在 Cocos Creator 中使用 RampUVController 實時控制 Ramp 效果。
