# SkeletalAnimationController - 3D 模型動畫控制完整指南

## 概述

`SkeletalAnimationController` 是一個專為 FBX/GLB 等 3D 模型設計的動畫控制腳本，提供便捷的動畫片段播放、切換和進度控制功能。

### 特性

✅ **完整的動畫控制** - 播放、暫停、停止、恢復  
✅ **遞增/遞減播放** - 使用按鈕輕鬆切換動畫  
✅ **平滑轉換** - 交叉淡入淡出動畫過度  
✅ **速度控制** - 0.1x - 3.0x 播放速度  
✅ **進度控制** - 精確尋求到任意時間點  
✅ **實時 UI** - 自動更新動畫信息顯示  
✅ **循環控制** - 支持循環和單次播放模式  

---

## 安裝

### 將腳本添加到節點

1. 在場景中創建一個空節點
2. 添加 `SkeletalAnimationController` 組件
3. 在檢查器中配置所有必要的引用

### 最小配置

```typescript
// 至少需要設置：
controller.skeletalAnimation = model.getComponent(SkeletalAnimation);
controller.btnNext = nextButton;
controller.btnPrev = prevButton;
```

---

## 屬性 (Inspector Properties)

### 必需屬性

#### `skeletalAnimation: SkeletalAnimation`
包含 3D 動畫的 SkeletalAnimation 組件引用。

```typescript
@property(SkeletalAnimation)
public skeletalAnimation: SkeletalAnimation | null = null;
```

### 按鈕引用

#### `btnNext: Button`
播放下一個動畫的按鈕。

#### `btnPrev: Button`
播放上一個動畫的按鈕。

#### `btnPlay: Button` (可選)
播放當前動畫的按鈕。

#### `btnPause: Button` (可選)
暫停當前動畫的按鈕。

#### `btnStop: Button` (可選)
停止所有動畫的按鈕。

### 標籤引用

#### `labelClipName: Label` (可選)
顯示當前動畫名稱的標籤。
```
輸出格式: "動畫: 動畫名稱"
```

#### `labelClipIndex: Label` (可選)
顯示動畫進度的標籤。
```
輸出格式: "2 / 5"
```

#### `labelClipDuration: Label` (可選)
顯示當前動畫時長的標籤。
```
輸出格式: "時長: 2.50s"
```

### 配置屬性

#### `playbackSpeed: number` (預設: 1.0)
動畫播放速度倍數。範圍：0.1 - 3.0

```typescript
controller.playbackSpeed = 1.5; // 1.5 倍速
```

#### `isLooping: boolean` (預設: true)
是否循環播放動畫。

```typescript
controller.isLooping = false; // 播放一次後停止
```

#### `crossFadeTime: number` (預設: 0.3)
動畫過度時間（秒）。較大的值會更平滑但反應變慢。

```typescript
controller.crossFadeTime = 0.5; // 0.5 秒過度時間
```

---

## 方法 (Methods)

### 播放控制

#### `nextClip()`
播放下一個動畫片段。如果已是最後一個，循環到第一個。

```typescript
controller.nextClip();
// 輸出: [SkeletalAnimationController] 切換到下一個動畫: Animation_002
```

#### `prevClip()`
播放上一個動畫片段。如果已是第一個，循環到最後一個。

```typescript
controller.prevClip();
// 輸出: [SkeletalAnimationController] 切換到上一個動畫: Animation_001
```

#### `playCurrentClip()`
播放當前選中的動畫片段。如果有其他動畫在播放，使用平滑轉換。

```typescript
controller.playCurrentClip();
// 輸出: [SkeletalAnimationController] 播放動畫: Animation_001 (時長: 2.50s, 速度: 1x)
```

#### `pauseClip()`
暫停當前播放的動畫。設置播放速度為 0。

```typescript
controller.pauseClip();
// 輸出: [SkeletalAnimationController] 暫停動畫: Animation_001
```

#### `resumeClip()`
恢復被暫停的動畫播放。

```typescript
controller.resumeClip();
// 輸出: [SkeletalAnimationController] 恢復播放: Animation_001
```

#### `stopClip()`
停止所有動畫播放。

```typescript
controller.stopClip();
// 輸出: [SkeletalAnimationController] 停止所有動畫
```

### 動畫選擇

#### `jumpToClip(index: number)`
直接跳轉到指定索引的動畫。索引從 0 開始。

```typescript
controller.jumpToClip(2); // 跳轉到第 3 個動畫
// 輸出: [SkeletalAnimationController] 跳轉到動畫: Animation_003
```

**參數：**
- `index` (number) - 動畫索引 (0 ≤ index < 動畫總數)

**拋出異常：**
- 如果索引超出範圍，輸出警告但不拋出異常

#### `playByName(clipName: string)`
按動畫名稱直接播放指定的動畫。

```typescript
controller.playByName('Attack');
controller.playByName('Idle');
controller.playByName('Run');
```

**參數：**
- `clipName` (string) - 動畫片段的名稱

**拋出異常：**
- 如果找不到該名稱的動畫，輸出警告

### 配置

#### `setPlaybackSpeed(speed: number)`
設置動畫播放速度。自動限制在 0.1x - 3.0x。

```typescript
controller.setPlaybackSpeed(1.5); // 1.5 倍速
controller.setPlaybackSpeed(0.5); // 0.5 倍速
```

**參數：**
- `speed` (number) - 播放速度倍數

**自動調整：**
- 小於 0.1 的值會被設置為 0.1
- 大於 3.0 的值會被設置為 3.0

#### `setLooping(loop: boolean)`
設置動畫循環播放模式。

```typescript
controller.setLooping(true);   // 循環播放
controller.setLooping(false);  // 播放一次
```

**參數：**
- `loop` (boolean) - true 為循環，false 為單次

#### `seek(time: number)`
尋求到動畫的指定時間（秒）。用於精確控制播放進度。

```typescript
controller.seek(2.5); // 跳到 2.5 秒
controller.seek(0);   // 跳到開始
```

**參數：**
- `time` (number) - 目標時間（秒）

**限制：**
- 時間會被限制在 [0, 動畫時長] 範圍內

### 查詢信息

#### `getCurrentClipInfo(): { name, index, total, duration }`
獲取當前動畫的詳細信息。

```typescript
const info = controller.getCurrentClipInfo();
console.log(info);
// 輸出:
// {
//   name: "Attack",
//   index: 2,
//   total: 5,
//   duration: 2.5
// }
```

**返回值：**
- `name` (string) - 動畫名稱
- `index` (number) - 動畫在列表中的位置（1 開始）
- `total` (number) - 動畫總數
- `duration` (number) - 動畫時長（秒）

#### `getAllClips(): AnimationClipInfo[]`
獲取所有可用的動畫片段列表。

```typescript
const clips = controller.getAllClips();
clips.forEach(clip => {
    console.log(`${clip.name} - ${clip.duration.toFixed(2)}s`);
});
```

**返回值：**
返回包含所有動畫信息的數組。每個元素為：
```typescript
{
    name: string;      // 動畫名稱
    index: number;     // 原始索引
    duration: number;  // 動畫時長
}
```

#### `getCurrentClipName(): string`
獲取當前正在播放的動畫名稱。

```typescript
const name = controller.getCurrentClipName();
console.log(`現在播放: ${name}`);
```

#### `getCurrentClipIndex(): number`
獲取當前動畫的索引（0 開始）。

```typescript
const index = controller.getCurrentClipIndex();
console.log(`當前索引: ${index}`);
```

#### `getClipCount(): number`
獲取總共有多少個動畫片段。

```typescript
const count = controller.getClipCount();
console.log(`共 ${count} 個動畫`);
```

#### `getIsPlaying(): boolean`
檢查是否正在播放動畫。

```typescript
if (controller.getIsPlaying()) {
    console.log('正在播放動畫');
} else {
    console.log('未播放或已暫停');
}
```

#### `getPlayProgress(): number`
獲取當前播放進度，返回 0-1 之間的值。

```typescript
const progress = controller.getPlayProgress();
console.log(`進度: ${(progress * 100).toFixed(0)}%`);
```

**返回值：**
- 0.0 - 剛開始
- 0.5 - 播放一半
- 1.0 - 播放完成

---

## 事件和回調

### 事件流程

```
初始化
  ↓
掃描所有動畫片段
  ↓
自動播放第一個動畫
  ↓
監聽按鈕點擊事件
  ├─ [Next] → nextClip() → 更新 UI → 播放
  ├─ [Prev] → prevClip() → 更新 UI → 播放
  ├─ [Play] → playCurrentClip() → 播放
  ├─ [Pause] → pauseClip() → 暫停
  └─ [Stop] → stopClip() → 停止
```

### 實現監聽動畫完成

```typescript
export class MyController extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    private wasPlaying: boolean = false;

    update() {
        if (!this.animController) return;

        const isPlaying = this.animController.getIsPlaying();

        // 檢測動畫播放完成
        if (this.wasPlaying && !isPlaying) {
            this.onAnimationCompleted();
        }

        this.wasPlaying = isPlaying;
    }

    private onAnimationCompleted() {
        console.log('動畫播放完成!');
        // 自動切換到下一個動畫
        this.animController?.nextClip();
    }
}
```

---

## 使用案例

### 案例 1: 遊戲角色控制

```typescript
export class PlayerController extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    update(deltaTime: number) {
        if (Input.getKey(KeyCode.W)) {
            this.animController?.playByName('Walk');
        } else if (Input.getKey(KeyCode.SHIFT_LEFT)) {
            this.animController?.playByName('Run');
            this.animController?.setPlaybackSpeed(1.5);
        } else if (Input.getKey(KeyCode.SPACE)) {
            this.animController?.playByName('Jump');
        } else {
            this.animController?.playByName('Idle');
            this.animController?.setPlaybackSpeed(1.0);
        }
    }
}
```

### 案例 2: 樂器動畫循環

```typescript
// 自動循環播放所有動畫（如播放不同的擊鼓動作）
async playAllDrumAnimations() {
    const count = this.animController.getClipCount();
    
    for (let i = 0; i < count; i++) {
        this.animController.jumpToClip(i);
        
        // 等待動畫播放完成
        const info = this.animController.getCurrentClipInfo();
        await this.wait(info.duration * 1000);
    }
}

private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 案例 3: 動畫編輯器

```typescript
export class AnimationPreviewPanel extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    @property(Slider)
    private speedSlider: Slider | null = null;

    @property(Slider)
    private progressSlider: Slider | null = null;

    onSpeedChanged(value: number) {
        // 將滑塊值 (0-1) 轉換為速度 (0.1-3.0)
        const speed = 0.1 + value * 2.9;
        this.animController?.setPlaybackSpeed(speed);
    }

    onProgressChanged(value: number) {
        const info = this.animController?.getCurrentClipInfo();
        if (info) {
            const time = value * info.duration;
            this.animController?.seek(time);
        }
    }

    update() {
        // 實時更新進度滑塊
        const progress = this.animController?.getPlayProgress() || 0;
        if (this.progressSlider) {
            this.progressSlider.progress = progress;
        }
    }
}
```

---

## 日誌輸出

所有操作都會輸出詳細的日誌便於調試：

```
[SkeletalAnimationController] 已加載 9 個動畫片段
[SkeletalAnimationController] 按鈕監聽器已附加
[SkeletalAnimationController] 播放動畫: Take 001 (時長: 0.83s, 速度: 1x)
[SkeletalAnimationController] 切換到下一個動畫: Take 002
[SkeletalAnimationController] 交叉淡入淡出轉換: Take 002 (轉換時間: 0.3s)
[SkeletalAnimationController] 暫停動畫: Take 002
[SkeletalAnimationController] 恢復播放: Take 002
[SkeletalAnimationController] UI 已更新 - 當前: 2/9
```

---

## 最佳實踐

### 1. 性能優化

```typescript
// ❌ 不要頻繁調用 setPlaybackSpeed
update() {
    this.controller.setPlaybackSpeed(1.5); // 每幀調用一次
}

// ✅ 只在需要時更改
onSpeedValueChanged(value: number) {
    this.controller.setPlaybackSpeed(value); // 只在事件中調用
}
```

### 2. 狀態管理

```typescript
// ✅ 使用狀態機管理動畫
class AnimationState {
    idle = () => this.controller.playByName('Idle');
    walk = () => this.controller.playByName('Walk');
    run = () => this.controller.playByName('Run');
    attack = () => this.controller.playByName('Attack');
}
```

### 3. 錯誤處理

```typescript
// ✅ 檢查動畫是否存在
if (this.controller.getClipCount() > 0) {
    this.controller.playCurrentClip();
} else {
    console.error('沒有可用的動畫');
}
```

---

## 常見問題

### Q: 動畫不流暢？
**A:** 增加 `crossFadeTime` 值（例如改為 0.5 或 0.8）

### Q: 如何檢測動畫播放完成？
**A:** 在 `update()` 中監控 `getIsPlaying()` 的狀態變化

### Q: 支持多個 3D 模型嗎？
**A:** 支持。為每個模型創建一個獨立的 SkeletalAnimationController

### Q: 可以同時播放多個動畫嗎？
**A:** 當前版本只支持單個動畫播放。同時播放需要多個 SkeletalAnimation 組件

---

## 版本信息

- **版本**: 1.0.0
- **Cocos Creator**: 3.8+
- **支持格式**: FBX, GLB, GLTF 及其他 Cocos 支持的 3D 格式
- **TypeScript**: 5.0+

---

## 許可證

MIT License - 自由使用和修改

---

需要幫助？查看代碼註解或檢查控制台日誌！🎮
