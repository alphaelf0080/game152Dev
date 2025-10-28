# SkeletalAnimationController - 3D 模型動畫控制 (FBX/GLB) 快速開始

## ⚡ 快速上手指南

### 支持格式
✅ FBX - Autodesk FBX 格式  
✅ GLB/GLTF - 標準 3D 格式  
✅ 其他 Cocos Creator 支持的 3D 格式  

### 第 1 步: 準備 3D 模型

1. 在 Cocos Creator 中導入 3D 模型（FBX/GLB）
2. 將模型拖入場景
3. 確認模型節點上有 **SkeletalAnimation 組件**
4. 動畫片段應該自動從模型導入

### 第 2 步: 添加控制器

1. 創建一個**新的空節點**（命名為 `3DAnimationController`）
2. 添加組件：`script/SkeletalAnimationController.ts`
3. 在檢查器中設置：

```
Skeletal Animation    → 拖入包含 3D 動畫的節點
Btn Next             → 拖入"下一個"按鈕
Btn Prev             → 拖入"上一個"按鈕
Label Clip Name      → 拖入動畫名稱標籤
Label Clip Index     → 拖入進度標籤
Label Clip Duration  → 拖入時長標籤
```

### 第 3 步: 設置按鈕和標籤

創建 UI 元素：

**按鈕：**
- `btnNext` - 播放下一個動畫
- `btnPrev` - 播放上一個動畫
- `btnPlay` - 播放當前動畫（可選）
- `btnPause` - 暫停動畫（可選）
- `btnStop` - 停止動畫（可選）

**標籤：**
- `labelClipName` - 顯示當前動畫名稱
- `labelClipIndex` - 顯示動畫索引
- `labelClipDuration` - 顯示動畫時長

### 第 4 步: 運行測試

1. 按 **Play** 執行場景
2. 點擊 **Next** 切換動畫
3. 觀察 3D 模型動畫變化

✅ 成功！

---

## 🎮 基本操作

| 按鈕 | 功能 |
|------|------|
| **Next** | ⏩ 播放下一個動畫（遞增） |
| **Prev** | ⏪ 播放上一個動畫（遞減） |
| **Play** | ▶️ 播放當前動畫 |
| **Pause** | ⏸️ 暫停當前動畫 |
| **Stop** | ⏹️ 停止所有動畫 |

---

## 💻 代碼示例

### 基本使用

```typescript
import { SkeletalAnimationController } from './SkeletalAnimationController';

export class PlayerController extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    // 播放下一個動畫
    onNextAnimationClick() {
        this.animController?.nextClip();
    }

    // 播放上一個動畫
    onPrevAnimationClick() {
        this.animController?.prevClip();
    }
}
```

### 按名稱播放動畫

```typescript
// 直接按名稱播放特定動畫
this.animController.playByName('Attack');
this.animController.playByName('Idle');
this.animController.playByName('Run');
```

### 調整播放速度

```typescript
// 加速
this.animController.setPlaybackSpeed(1.5); // 1.5 倍速

// 減速
this.animController.setPlaybackSpeed(0.5); // 0.5 倍速

// 正常速度
this.animController.setPlaybackSpeed(1.0);
```

### 設置循環模式

```typescript
// 啟用循環播放
this.animController.setLooping(true);

// 禁用循環播放（只播放一次）
this.animController.setLooping(false);
```

### 獲取動畫信息

```typescript
// 獲取當前動畫詳細信息
const info = this.animController.getCurrentClipInfo();
console.log(`動畫: ${info.name}`);
console.log(`進度: ${info.index}/${info.total}`);
console.log(`時長: ${info.duration.toFixed(2)}s`);

// 獲取所有可用動畫
const allClips = this.animController.getAllClips();
allClips.forEach(clip => {
    console.log(`${clip.name} (${clip.duration.toFixed(2)}s)`);
});
```

### 播放進度控制

```typescript
// 獲取播放進度（0-1）
const progress = this.animController.getPlayProgress();
console.log(`進度: ${(progress * 100).toFixed(0)}%`);

// 尋求到指定時間
this.animController.seek(2.5); // 跳到 2.5 秒
```

### 檢查播放狀態

```typescript
if (this.animController.getIsPlaying()) {
    console.log('正在播放動畫:', this.animController.getCurrentClipName());
}

console.log(`當前索引: ${this.animController.getCurrentClipIndex()}`);
console.log(`總動畫數: ${this.animController.getClipCount()}`);
```

---

## 🎯 實用場景

### 場景 1: 遊戲角色動畫切換

```
Idle (待機)
   ↓ (按下移動鍵)
Walk (行走)
   ↓ (按下跑步鍵)
Run (奔跑)
   ↓ (按下攻擊鍵)
Attack (攻擊)
   ↓ (攻擊完成)
Idle (回到待機)
```

**代碼：**
```typescript
onKeyPress(key: string) {
    switch(key) {
        case 'Move':
            this.animController.playByName('Walk');
            break;
        case 'Sprint':
            this.animController.playByName('Run');
            break;
        case 'Attack':
            this.animController.playByName('Attack');
            break;
    }
}
```

### 場景 2: 鼓/樂器動畫播放

```
Take 001 (敲擊)
   ↓ (Next)
Take 002 (轉動)
   ↓ (Next)
Take 003 (搖晃)
```

**代碼：**
```typescript
playNextDrumAnimation() {
    this.animController.nextClip();
}

playPrevDrumAnimation() {
    this.animController.prevClip();
}
```

### 場景 3: 動畫編輯預覽

```
查看所有動畫 → 調整速度 → 調整播放時間 → 導出
```

**代碼：**
```typescript
// 預覽所有動畫
previewAllAnimations() {
    const clips = this.animController.getAllClips();
    clips.forEach(clip => {
        console.log(`動畫: ${clip.name} - 時長: ${clip.duration}s`);
    });
}

// 調整速度預覽
setPreviewSpeed(speed: number) {
    this.animController.setPlaybackSpeed(speed);
}
```

---

## ⚙️ 配置參數

### 編輯器屬性

| 屬性 | 類型 | 預設 | 說明 |
|------|------|------|------|
| `skeletalAnimation` | SkeletalAnimation | null | 3D 模型的動畫組件 |
| `btnNext` | Button | null | 下一個按鈕 |
| `btnPrev` | Button | null | 上一個按鈕 |
| `btnPlay` | Button | null | 播放按鈕（可選） |
| `btnPause` | Button | null | 暫停按鈕（可選） |
| `btnStop` | Button | null | 停止按鈕（可選） |
| `labelClipName` | Label | null | 動畫名稱標籤 |
| `labelClipIndex` | Label | null | 進度標籤 |
| `labelClipDuration` | Label | null | 時長標籤 |
| `playbackSpeed` | Number | 1.0 | 播放速度 |
| `isLooping` | Boolean | true | 是否循環播放 |
| `crossFadeTime` | Number | 0.3 | 動畫轉換時間（秒） |

### 速度設置指南

```
0.5x  - 超慢速（調試/分析用）
0.75x - 慢速
1.0x  - 正常速度（預設）
1.25x - 快速
1.5x  - 很快速
2.0x  - 超快速（2 倍速）
3.0x  - 極限速度（最大值）
```

---

## 🔧 故障排除

### 問題: 找不到 SkeletalAnimation 組件

**解決方案：**
1. 檢查 3D 模型是否正確導入
2. 確保模型節點上有 **SkeletalAnimation** 組件
3. 查看控制台警告信息

### 問題: 動畫不切換

**解決方案：**
1. 檢查按鈕是否正確連接
2. 確認 SkeletalAnimation 已正確指定
3. 查看控制台日誌判斷原因

### 問題: 動畫斷裂/不流暢

**解決方案：**
1. 增加 `crossFadeTime`（默認 0.3 秒）
2. 確保 FBX/GLB 文件格式正確
3. 檢查模型骨骼綁定是否正確

### 問題: UI 標籤不更新

**解決方案：**
1. 確保 Label 組件已連接
2. 檢查 Label 文字顏色
3. 檢查 Label 的 enabled 屬性

---

## 📚 完整 API 列表

### 播放控制

```typescript
nextClip()                    // 播放下一個
prevClip()                    // 播放上一個
playCurrentClip()             // 播放當前
playByName(name)              // 按名稱播放
pauseClip()                   // 暫停
resumeClip()                  // 恢復
stopClip()                    // 停止
```

### 設置

```typescript
setPlaybackSpeed(speed)       // 設置速度
setLooping(loop)              // 設置循環
seek(time)                    // 尋求時間
jumpToClip(index)             // 跳轉到索引
```

### 查詢

```typescript
getCurrentClipInfo()          // 獲取當前動畫信息
getAllClips()                 // 獲取所有動畫
getCurrentClipName()          // 獲取當前名稱
getCurrentClipIndex()         // 獲取當前索引
getClipCount()                // 獲取動畫總數
getIsPlaying()                // 是否正在播放
getPlayProgress()             // 獲取播放進度
```

---

## 🚀 進階用法

### 自動循環播放所有動畫

```typescript
async playAllAnimationsInSequence() {
    const count = this.animController.getClipCount();
    
    for (let i = 0; i < count; i++) {
        this.animController.jumpToClip(i);
        
        // 等待動畫完成
        const info = this.animController.getCurrentClipInfo();
        await this.wait(info.duration * 1000);
    }
}

private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 建立動畫狀態機

```typescript
class AnimationStateMachine {
    constructor(controller: SkeletalAnimationController) {
        this.controller = controller;
    }

    setState(state: string) {
        this.currentState = state;
        this.controller.playByName(state);
    }

    transition(fromState: string, toState: string) {
        if (this.currentState === fromState) {
            this.setState(toState);
        }
    }
}
```

### 監聽動畫完成事件

```typescript
update() {
    if (this.wasPlaying && !this.animController.getIsPlaying()) {
        console.log('動畫播放完成');
        this.onAnimationComplete();
    }
    this.wasPlaying = this.animController.getIsPlaying();
}

private onAnimationComplete() {
    console.log(`${this.animController.getCurrentClipName()} 已播放完成`);
    // 自動切換到下一個動畫
    this.animController.nextClip();
}
```

---

## 📝 文件位置

- **腳本**: `assets/script/SkeletalAnimationController.ts`
- **文檔**: `docs/SkeletalAnimationController-Guide.md`

---

## 💡 提示

1. ✅ 支持任何 Cocos Creator 兼容的 3D 模型格式
2. ✅ 自動讀取模型內的所有動畫片段
3. ✅ 平滑的動畫轉換（交叉淡入淡出）
4. ✅ 完整的播放進度控制
5. ✅ 實時 UI 反饋

---

## 🎬 下一步

1. ✅ 導入 3D 模型到場景
2. ✅ 添加 SkeletalAnimationController 組件
3. ✅ 連接按鈕和標籤
4. ✅ 測試動畫切換
5. ✅ 整合到遊戲邏輯

**開始控制你的 3D 動畫吧！** 🎉
