# 動畫片段控制器 (AnimationClipController) - 使用指南

## 功能概述

`AnimationClipController` 是一個 Cocos Creator 腳本，提供以下功能：

✅ **遞增播放** - 按鈕點擊後播放下一個動畫片段  
✅ **遞減播放** - 按鈕點擊後播放上一個動畫片段  
✅ **播放控制** - 支持播放、暫停、停止  
✅ **速度調節** - 動態調整播放速度（0.1x - 3.0x）  
✅ **UI 顯示** - 實時顯示當前動畫名稱和進度  

---

## 安裝方式

### 方式 1: 直接添加到節點

1. 在 Cocos Creator 編輯器中，創建或選擇一個空節點
2. 在該節點上添加 `AnimationClipController` 組件
3. 在檢查器面板中配置：
   - **Animation Component** - 拖入含有 Animation 組件的節點
   - **Btn Next** - 拖入「下一個」按鈕節點
   - **Btn Prev** - 拖入「上一個」按鈕節點
   - **Btn Play** - 拖入「播放」按鈕節點（可選）
   - **Btn Pause** - 拖入「暫停」按鈕節點（可選）
   - **Btn Stop** - 拖入「停止」按鈕節點（可選）
   - **Label Clip Name** - 拖入顯示動畫名稱的 Label
   - **Label Clip Index** - 拖入顯示進度的 Label

### 方式 2: 在代碼中動態創建

```typescript
const controller = node.addComponent(AnimationClipController);
controller.animationComponent = animationNode.getComponent(Animation);
controller.btnNext = nextButton;
controller.btnPrev = prevButton;
controller.labelClipName = nameLabel;
controller.labelClipIndex = indexLabel;
```

---

## API 文檔

### 公開方法

#### `nextClip()`
播放下一個動畫片段。如果已是最後一個，循環到第一個。

```typescript
controller.nextClip();
```

#### `prevClip()`
播放上一個動畫片段。如果已是第一個，循環到最後一個。

```typescript
controller.prevClip();
```

#### `playCurrentClip()`
播放當前選中的動畫片段。

```typescript
controller.playCurrentClip();
```

#### `pauseClip()`
暫停當前播放的動畫。

```typescript
controller.pauseClip();
```

#### `stopClip()`
停止所有動畫播放。

```typescript
controller.stopClip();
```

#### `setPlaybackSpeed(speed: number)`
設置播放速度。範圍: 0.1x - 3.0x

```typescript
controller.setPlaybackSpeed(1.5); // 1.5 倍速播放
```

#### `jumpToClip(index: number)`
直接跳轉到指定索引的動畫。

```typescript
controller.jumpToClip(2); // 跳轉到第 3 個動畫
```

#### `getCurrentClipInfo()`
獲取當前動畫信息。

```typescript
const info = controller.getCurrentClipInfo();
console.log(info); // { name: 'Attack', index: 2, total: 5 }
```

#### `getAllClips()`
獲取所有動畫片段列表。

```typescript
const clips = controller.getAllClips();
clips.forEach(clip => console.log(clip.name));
```

#### `getCurrentClipIndex()`
獲取當前動畫索引（0 開始）。

```typescript
const index = controller.getCurrentClipIndex();
```

#### `getClipCount()`
獲取動畫片段總數。

```typescript
const count = controller.getClipCount();
```

#### `getIsPlaying()`
獲取是否正在播放。

```typescript
if (controller.getIsPlaying()) {
    console.log('正在播放動畫');
}
```

---

## 屬性配置

### 編輯器屬性

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `animationComponent` | Animation | null | 包含動畫片段的 Animation 組件 |
| `btnNext` | Button | null | 下一個動畫按鈕 |
| `btnPrev` | Button | null | 上一個動畫按鈕 |
| `btnPlay` | Button | null | 播放按鈕（可選） |
| `btnPause` | Button | null | 暫停按鈕（可選） |
| `btnStop` | Button | null | 停止按鈕（可選） |
| `labelClipName` | Label | null | 動畫名稱標籤（可選） |
| `labelClipIndex` | Label | null | 進度標籤（可選） |
| `playbackSpeed` | Number | 1.0 | 播放速度 |
| `isLooping` | Boolean | false | 是否循環播放 |

---

## 使用示例

### 示例 1: 基本使用

```typescript
// 在某個控制器腳本中
export class TestController extends Component {
    @property(AnimationClipController)
    private animController: AnimationClipController | null = null;

    onLoad() {
        // 組件會自動初始化
    }

    // 外部調用
    public nextAnimation() {
        this.animController?.nextClip();
    }

    public prevAnimation() {
        this.animController?.prevClip();
    }
}
```

### 示例 2: 帶速度控制

```typescript
// 播放下一個動畫並加速
this.animController.setPlaybackSpeed(1.5);
this.animController.nextClip();

// 播放上一個動畫並減速
this.animController.setPlaybackSpeed(0.5);
this.animController.prevClip();
```

### 示例 3: 獲取動畫信息

```typescript
const info = this.animController.getCurrentClipInfo();
console.log(`當前動畫: ${info.name} (${info.index}/${info.total})`);

// 列出所有可用動畫
const clips = this.animController.getAllClips();
clips.forEach((clip, index) => {
    console.log(`${index + 1}. ${clip.name}`);
});
```

### 示例 4: 連續播放所有動畫

```typescript
public async playAllClips() {
    const count = this.animController.getClipCount();
    
    for (let i = 0; i < count; i++) {
        this.animController.jumpToClip(i);
        
        // 等待動畫播放完成
        await this.sleep(2000); // 調整等待時間
    }
}

private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 工作流程

### 播放流程圖

```
初始化
  ↓
掃描所有動畫片段
  ↓
顯示第一個動畫信息
  ↓
按鈕點擊事件
  ├─ [下一個] → currentIndex++ → 更新顯示 → 播放
  ├─ [上一個] → currentIndex-- → 更新顯示 → 播放
  ├─ [播放] → 播放當前動畫
  ├─ [暫停] → 凍結動畫狀態
  └─ [停止] → 停止所有動畫
```

---

## 常見問題

### Q: 動畫不播放？
**A:** 檢查以下項：
1. Animation 組件是否正確指定
2. 動畫片段是否添加到 Animation 組件中
3. 檢查控制台日誌是否有錯誤信息

### Q: 按鈕不響應？
**A:** 確保：
1. 按鈕節點已正確指定
2. 按鈕節點上有 Button 組件
3. 檢查按鈕是否被禁用（enabled = false）

### Q: 如何自定義按鈕行為？
**A:** 可以從代碼中調用相應方法：
```typescript
customButton.node.on(Button.EventType.click, () => {
    this.animController.nextClip();
    // 添加自定義邏輯
});
```

### Q: 支持多個 Animation 組件嗎？
**A:** 目前不支持。如需控制多個，可創建多個 AnimationClipController 實例。

---

## 調試

### 啟用詳細日誌

所有重要操作都會打印到控制台。查看日誌以診斷問題：

```
[AnimationClipController] 已加載 5 個動畫片段
[AnimationClipController] 切換到下一個動畫: Attack
[AnimationClipController] 播放動畫: Attack (速度: 1x)
```

### 檢查動畫信息

```typescript
const info = this.animController.getCurrentClipInfo();
console.log(`動畫: ${info.name}`);
console.log(`索引: ${info.index}/${info.total}`);
console.log(`播放中: ${this.animController.getIsPlaying()}`);
```

---

## 最佳實踐

1. **初始化檢查** - 確保所有必需的引用都已設置
2. **日誌輸出** - 在生產環境中可移除詳細日誌
3. **錯誤處理** - 調用方法前檢查 clip count
4. **性能** - 避免頻繁調用 setPlaybackSpeed()

---

## 版本信息

- **版本**: 1.0.0
- **Cocos Creator 版本**: 3.8+
- **TypeScript**: 5.0+

---

## 許可證

MIT License - 自由使用和修改

---

需要幫助？查看代碼註解或提交 Issue！🎬
