# SpriteUVController - Sprite UV 控制組件

## 概述

`SpriteUVController` 是一個通用的 Sprite UV 控制組件，可以套用在任何使用自定義 shader 的 sprite 上。

**主要功能**：
- ✅ 設定 UV Repeat（重複次數/Tiling）
- ✅ 設定 UV Scale（縮放比例）
- ✅ 設定 UV Offset（平移偏移）
- ✅ 實時預覽（編輯模式下自動應用）
- ✅ 支援任何自定義 shader

## 使用方法

### 1. 添加組件

```
1. 選擇使用自定義 shader 的 Sprite Node
2. Add Component → SpriteUVController
3. 在 Inspector 中設置參數
```

### 2. 參數說明

| 參數 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| Target Sprite | Sprite | auto | 目標 Sprite 組件（自動檢測） |
| UV Repeat | Vec2 | (1.0, 1.0) | UV 重複次數（Tiling）<br/>(1,1)=不重複 \| (2,2)=重複2x2 |
| UV Scale | Vec2 | (1.0, 1.0) | UV 縮放比例<br/>(1,1)=無縮放 \| (0.5,0.5)=放大2倍 |
| UV Offset | Vec2 | (0.0, 0.0) | UV 平移偏移<br/>(0,0)=無偏移 |
| Auto Save | bool | true | 編輯時自動保存變更 |

### 3. 常見配置

#### 3.1 不重複（全圖覆蓋）
```
UV Repeat:  (1.0, 1.0)
UV Scale:   (1.0, 1.0)
UV Offset:  (0.0, 0.0)
```

#### 3.2 重複 2x2
```
UV Repeat:  (2.0, 2.0)
UV Scale:   (1.0, 1.0)
UV Offset:  (0.0, 0.0)
```

#### 3.3 放大 2 倍（佔用四分之一空間）
```
UV Repeat:  (1.0, 1.0)
UV Scale:   (0.5, 0.5)
UV Offset:  (0.0, 0.0)
```

#### 3.4 縮小 2 倍（拉伸）
```
UV Repeat:  (1.0, 1.0)
UV Scale:   (2.0, 2.0)
UV Offset:  (0.0, 0.0)
```

#### 3.5 向右偏移 0.5
```
UV Repeat:  (1.0, 1.0)
UV Scale:   (1.0, 1.0)
UV Offset:  (0.5, 0.0)
```

## Shader 適配

### 支援的 Shader 參數名稱

組件會自動嘗試設置以下參數名稱：

1. **uvRepeat**、**uvScale**、**uvOffset**（推薦）
2. **tilingRepeat**、**tilingScale**、**tilingOffset**
3. **rampUVScale**、**rampUVOffset**

### 添加到自定義 Shader

在 shader 的 `CCEffect` 部分添加以下屬性定義：

```glsl
CCEffect %{
  techniques:
  - passes:
    - vert: sprite-vs:vert
      frag: sprite-fs:frag
      properties:
        mainTexture: { ... }
        
        # 添加 UV 控制參數
        uvRepeat: { 
          value: [1.0, 1.0], 
          editor: { displayName: 'UV Repeat' } 
        }
        uvScale: { 
          value: [1.0, 1.0], 
          editor: { displayName: 'UV Scale' } 
        }
        uvOffset: { 
          value: [0.0, 0.0], 
          editor: { displayName: 'UV Offset' } 
        }
}%
```

### Shader 中使用 UV 參數

在 Fragment Shader 中使用這些參數：

```glsl
// 計算最終的 UV 坐標
vec2 finalUV = uv0;

// 1. 應用偏移
finalUV = finalUV + uvOffset;

// 2. 應用縮放
finalUV = finalUV * uvScale;

// 3. 應用重複（實現 Tiling）
finalUV = fract(finalUV * uvRepeat);

// 使用最終的 UV 採樣紋理
vec4 texColor = texture(mainTexture, finalUV);
```

## 腳本 API

### 方法

```typescript
// 應用所有 UV 設置
applyAllSettings(): void

// 重置為預設值
resetToDefault(): void

// 分別設置各個參數
setUVRepeat(x: number, y: number): void
setUVScale(x: number, y: number): void
setUVOffset(x: number, y: number): void

// 同時設置所有參數
setAllUVParameters(repeat: Vec2, scale: Vec2, offset: Vec2): void
```

### 使用範例

```typescript
import { Vec2 } from 'cc';

// 在另一個腳本中獲取並控制
const uvController = this.node.getComponent('SpriteUVController');

// 設置為 2x2 重複
uvController.setUVRepeat(2.0, 2.0);

// 放大 2 倍
uvController.setUVScale(0.5, 0.5);

// 向上偏移 0.25
uvController.setUVOffset(0.0, 0.25);

// 重置為默認值
uvController.resetToDefault();

// 同時設置所有參數
uvController.setAllUVParameters(
    new Vec2(2.0, 2.0),  // repeat
    new Vec2(1.0, 1.0),  // scale
    new Vec2(0.0, 0.0)   // offset
);
```

## 常見問題

### Q1：如何知道我的 Shader 是否支援這個組件？

A：檢查你的 shader 文件中是否定義了 UV 控制參數：
- 查找 `uvRepeat`、`uvScale`、`uvOffset`（或類似的名稱）
- 如果沒有，需要先在 shader 中添加這些參數定義

### Q2：為什麼設置後沒有看到效果？

A：
1. ✅ 確認 targetSprite 正確指向使用自定義 shader 的 Sprite
2. ✅ 確認自定義 shader 中定義了 `uvRepeat`、`uvScale`、`uvOffset` 參數
3. ✅ 確認 Auto Save 選項已啟用
4. ✅ 在編輯器中修改參數值，應該會自動刷新預覽
5. ✅ 如果還是沒有效果，檢查 shader 中是否正確使用了這些參數

### Q3：可以在運行時動態改變 UV 嗎？

A：可以。調用腳本 API 方法即可：

```typescript
// 在遊戲中動態改變
const uvController = this.node.getComponent('SpriteUVController');
uvController.setUVRepeat(3.0, 3.0);  // 改為 3x3 重複
```

### Q4：如何實現 UV 動畫效果？

A：在另一個腳本中持續改變 UV Offset：

```typescript
export class UVAnimator extends Component {
    private uvController: any;
    private speed: number = 1.0;
    
    onLoad() {
        this.uvController = this.node.getComponent('SpriteUVController');
    }
    
    update(dt: number) {
        const newOffsetX = (this.uvController.uvOffset.x + this.speed * dt) % 1.0;
        this.uvController.setUVOffset(newOffsetX, this.uvController.uvOffset.y);
    }
}
```

### Q5：UV Scale 和 UV Repeat 的區別是什麼？

A：
- **UV Scale**：改變 UV 坐標的範圍
  - (1, 1) = 正常（UV 從 0 到 1）
  - (0.5, 0.5) = 放大（只顯示 UV 0 到 0.5 的部分，因此看起來更大）
  - (2, 2) = 縮小（UV 從 0 到 2，但只有 0-1 显示，因此看起來更小）

- **UV Repeat**：在 Tiling 後應用 fract()
  - (1, 1) = 不重複
  - (2, 2) = 重複 2x2 次
  - (0.5, 0.5) = 半個紋理（只顯示上面的四分之一重複）

## 與 RampShaderResetInspector 的區別

| 特性 | SpriteUVController | RampShaderResetInspector |
|---|---|---|
| 用途 | 通用 UV 控制 | Ramp Shader 專用 |
| 功能 | 控制任何 UV 參數 | 自動計算 nodeUVScale |
| 參數 | uvRepeat, uvScale, uvOffset | nodeUVScale, rampUVScale, 等 |
| 適用 | 任何自定義 shader | 只適用 RampColorShader |

## 完整使用流程

### 步驟 1：準備 Shader
確保 shader 中定義了 UV 參數（如 uvRepeat、uvScale、uvOffset）

### 步驟 2：添加組件
在 Sprite Node 上添加 `SpriteUVController` 組件

### 步驟 3：配置參數
在 Inspector 中設置：
- UV Repeat：根據需要設置重複次數
- UV Scale：根據需要設置縮放
- UV Offset：根據需要設置偏移

### 步驟 4：測試
在編輯器中即時預覽效果

### 步驟 5：調整
根據需要微調參數直到滿意為止

---

**Ready to use!** 現在可以在 Cocos Creator 中使用 SpriteUVController 控制任何 sprite 的 UV 參數。
