# SpriteTextureRepeat - 紋理重複控制組件

## 概述

`SpriteTextureRepeat` 是一個簡單易用的組件，可以在 Cocos Creator 3.8 中控制 Sprite 紋理的重複次數和偏移。

## 快速開始

### 1. 添加組件

```
1. 選擇你的 Sprite Node
2. Add Component → 搜索 "SpriteTextureRepeat"
3. 完成！組件會自動檢測 Sprite
```

### 2. 調整參數

在 Inspector 中可以看到四個滑桿：

| 參數 | 範圍 | 預設值 | 說明 |
|---|---|---|---|
| Repeat X | 0.1 ~ 10.0 | 1.0 | X 方向重複次數 |
| Repeat Y | 0.1 ~ 10.0 | 1.0 | Y 方向重複次數 |
| Offset X | -1.0 ~ 1.0 | 0.0 | X 方向偏移 |
| Offset Y | -1.0 ~ 1.0 | 0.0 | Y 方向偏移 |

### 3. 即時預覽

在編輯器中移動滑桿，可以即時看到效果！

## 使用場景

### 場景 1：平鋪背景

```
目標：創建無縫重複的背景
設定：
  - Repeat X: 3.0
  - Repeat Y: 3.0
  - Offset X: 0.0
  - Offset Y: 0.0

效果：背景紋理重複 3x3 次
```

### 場景 2：滾動紋理

```
目標：創建移動的背景效果
設定：
  - Repeat X: 2.0
  - Repeat Y: 1.0
  - 在代碼中動態改變 Offset X

效果：紋理向左或向右滾動
```

### 場景 3：縮放紋理

```
目標：放大或縮小紋理
設定：
  - Repeat X: 0.5  (放大 2 倍)
  - Repeat Y: 0.5  (放大 2 倍)
  
效果：紋理變大，只顯示原紋理的一部分
```

## 配置示例

### 示例 1：不重複（默認）

```yaml
Repeat X: 1.0
Repeat Y: 1.0
Offset X: 0.0
Offset Y: 0.0

效果：紋理正常顯示，填滿整個 Sprite
```

### 示例 2：水平重複 3 次

```yaml
Repeat X: 3.0
Repeat Y: 1.0
Offset X: 0.0
Offset Y: 0.0

效果：紋理在水平方向重複 3 次
```

### 示例 3：垂直重複 2 次

```yaml
Repeat X: 1.0
Repeat Y: 2.0
Offset X: 0.0
Offset Y: 0.0

效果：紋理在垂直方向重複 2 次
```

### 示例 4：2x2 重複

```yaml
Repeat X: 2.0
Repeat Y: 2.0
Offset X: 0.0
Offset Y: 0.0

效果：紋理重複 4 次（2x2 網格）
```

### 示例 5：帶偏移的重複

```yaml
Repeat X: 2.0
Repeat Y: 2.0
Offset X: 0.25
Offset Y: 0.0

效果：紋理重複並向右偏移
```

## 腳本 API

### 基本方法

```typescript
import { SpriteTextureRepeat } from './SpriteTextureRepeat';

// 獲取組件
const textureRepeat = this.node.getComponent(SpriteTextureRepeat);

// 設置重複次數
textureRepeat.setRepeat(2.0, 2.0);

// 設置偏移
textureRepeat.setOffset(0.5, 0.0);

// 重置為默認值
textureRepeat.reset();

// 手動應用設置
textureRepeat.apply();
```

### 動畫示例

#### 示例 1：滾動背景

```typescript
import { _decorator, Component } from 'cc';
import { SpriteTextureRepeat } from './SpriteTextureRepeat';

const { ccclass } = _decorator;

@ccclass('ScrollingBackground')
export class ScrollingBackground extends Component {
    private textureRepeat: SpriteTextureRepeat;
    private offsetX: number = 0;
    private speed: number = 0.1; // 滾動速度

    onLoad() {
        this.textureRepeat = this.getComponent(SpriteTextureRepeat);
        // 設置紋理重複
        this.textureRepeat.setRepeat(2.0, 1.0);
    }

    update(dt: number) {
        // 更新偏移
        this.offsetX += this.speed * dt;
        
        // 當偏移超過 1.0 時重置（無縫循環）
        if (this.offsetX > 1.0) {
            this.offsetX -= 1.0;
        }
        
        // 應用偏移
        this.textureRepeat.setOffset(this.offsetX, 0);
    }
}
```

#### 示例 2：呼吸效果

```typescript
import { _decorator, Component } from 'cc';
import { SpriteTextureRepeat } from './SpriteTextureRepeat';

const { ccclass } = _decorator;

@ccclass('BreathingEffect')
export class BreathingEffect extends Component {
    private textureRepeat: SpriteTextureRepeat;
    private time: number = 0;

    onLoad() {
        this.textureRepeat = this.getComponent(SpriteTextureRepeat);
    }

    update(dt: number) {
        this.time += dt;
        
        // 使用 sin 函數創建呼吸效果
        const scale = 1.0 + Math.sin(this.time * 2) * 0.2;
        
        this.textureRepeat.setRepeat(scale, scale);
    }
}
```

#### 示例 3：UV 動畫

```typescript
import { _decorator, Component } from 'cc';
import { SpriteTextureRepeat } from './SpriteTextureRepeat';

const { ccclass, property } = _decorator;

@ccclass('UVAnimator')
export class UVAnimator extends Component {
    @property
    scrollSpeedX: number = 0.1;

    @property
    scrollSpeedY: number = 0.1;

    @property
    repeatX: number = 1.0;

    @property
    repeatY: number = 1.0;

    private textureRepeat: SpriteTextureRepeat;
    private offsetX: number = 0;
    private offsetY: number = 0;

    onLoad() {
        this.textureRepeat = this.getComponent(SpriteTextureRepeat);
        this.textureRepeat.setRepeat(this.repeatX, this.repeatY);
    }

    update(dt: number) {
        this.offsetX += this.scrollSpeedX * dt;
        this.offsetY += this.scrollSpeedY * dt;
        
        // 保持偏移在 [0, 1] 範圍內
        this.offsetX = this.offsetX % 1.0;
        this.offsetY = this.offsetY % 1.0;
        
        this.textureRepeat.setOffset(this.offsetX, this.offsetY);
    }
}
```

## 工作原理

### 技術細節

組件通過設置材質的 `tilingOffset` 參數來控制紋理重複：

```typescript
// tilingOffset 是一個 Vec4
// x = Repeat X (X 方向重複次數)
// y = Repeat Y (Y 方向重複次數)
// z = Offset X (X 方向偏移)
// w = Offset Y (Y 方向偏移)

const tilingOffset = new Vec4(repeatX, repeatY, offsetX, offsetY);
material.setProperty('tilingOffset', tilingOffset);
```

### 材質要求

此組件適用於大多數 Cocos Creator 內建 shader，包括：
- `builtin-sprite` (默認 Sprite shader)
- `builtin-unlit`
- 自定義 shader（如果定義了 `tilingOffset` 參數）

## 常見問題

### Q1：改變參數後沒有看到效果？

**A**：可能的原因：
1. Sprite 的 Type 設置為 `Sliced` 或 `Filled` - 改為 `Simple` 或 `Tiled`
2. 紋理的 Wrap Mode 設置錯誤 - 在紋理 Inspector 中設置為 `Repeat`

**解決方案**：
```
1. 選擇 Sprite Node
2. Sprite Component → Type → 選擇 "Simple" 或 "Tiled"
3. 選擇紋理資源
4. Inspector → Wrap Mode U/V → 選擇 "Repeat"
```

### Q2：如何設置紋理的 Wrap Mode？

**A**：
```
1. 在 Assets 中選擇紋理文件
2. Inspector 面板中找到 "Wrap Mode"
3. Wrap Mode U: Repeat
4. Wrap Mode V: Repeat
5. 點擊 Apply 按鈕
```

### Q3：可以動態改變重複次數嗎？

**A**：可以，在任何腳本中調用：
```typescript
const repeat = this.node.getComponent(SpriteTextureRepeat);
repeat.setRepeat(3.0, 3.0);
```

### Q4：Offset 的範圍是什麼？

**A**：
- 0.0 = 不偏移
- 0.5 = 偏移半個紋理
- 1.0 = 偏移一整個紋理（相當於回到起點）
- 可以使用負值向相反方向偏移

### Q5：Repeat 值小於 1.0 會怎樣？

**A**：
- 1.0 = 正常大小
- 0.5 = 放大 2 倍（只顯示紋理的一半）
- 2.0 = 縮小並重複 2 次
- 0.1 = 放大 10 倍（只顯示紋理的十分之一）

## 使用技巧

### 技巧 1：創建無縫滾動背景

```
1. 使用可平鋪的紋理（seamless texture）
2. 設置 Repeat X: 2.0 或更高
3. 在 update() 中持續增加 Offset X
4. 當 Offset X > 1.0 時，減去 1.0（循環）
```

### 技巧 2：創建動態水波效果

```
1. 使用水紋理
2. 設置 Repeat: (2.0, 2.0)
3. 用 sin/cos 函數動態改變 Offset
4. 創建波動效果
```

### 技巧 3：優化性能

```
1. 只在需要時調用 setRepeat() 或 setOffset()
2. 避免在 update() 中設置相同的值
3. 組件已經內建了參數變化檢測
```

## 完整場景示例

### 場景：滾動雲朵背景

```
Node "CloudBackground"
├─ Transform: Position(0, 0, 0), Scale(1, 1, 1)
├─ UITransform: Content Size(1920, 1080)
├─ Sprite
│  ├─ Texture: cloud_seamless.png
│  ├─ Type: Simple
│  └─ Wrap Mode U/V: Repeat
├─ SpriteTextureRepeat
│  ├─ Repeat X: 3.0
│  ├─ Repeat Y: 1.0
│  ├─ Offset X: 0.0
│  └─ Offset Y: 0.0
└─ ScrollingBackground (自定義腳本)
   └─ speed: 0.05
```

---

**簡單、易用、高效！** 現在你可以輕鬆控制 Sprite 的紋理重複效果了！
