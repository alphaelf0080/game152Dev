# 動畫控制系統 - 完整解決方案

## 🎬 項目概述

我為您的 Cocos Creator 項目創建了一個完整的動畫控制系統，包含兩個強大的控制器，可以處理所有類型的動畫需求。

---

## 📦 提供的組件

### 1. AnimationClipController (2D 動畫控制器)
**用於控制場景內編輯的 2D 動畫**

✅ 遞增/遞減播放動畫  
✅ 播放、暫停、停止控制  
✅ 動態速度調節  
✅ 實時 UI 顯示  

📂 位置：`game169/assets/script/AnimationClipController.ts`

### 2. SkeletalAnimationController (3D 動畫控制器)
**用於控制 FBX/GLB 等 3D 模型動畫**

✅ 遞增/遞減播放動畫  
✅ 平滑的交叉淡入淡出過度  
✅ 精確的播放進度控制  
✅ 按名稱直接播放動畫  
✅ 循環/單次播放模式  
✅ 實時 UI 顯示  

📂 位置：`game169/assets/script/SkeletalAnimationController.ts`

---

## 🚀 快速開始

### 安裝 AnimationClipController

```
1. 在場景中創建空節點
2. 添加組件: AnimationClipController
3. 拖入 Animation 組件
4. 連接按鈕和標籤
5. 運行！
```

### 安裝 SkeletalAnimationController

```
1. 導入 3D 模型（FBX/GLB）到場景
2. 創建空節點並添加組件: SkeletalAnimationController
3. 拖入 SkeletalAnimation 組件
4. 連接按鈕和標籤
5. 運行！
```

---

## 📚 完整文檔

### AnimationClipController
- 📖 [快速開始指南](./AnimationClipController-QuickStart.md)
- 📘 [完整 API 文檔](./AnimationClipController-Guide.md)

### SkeletalAnimationController
- 📖 [快速開始指南](./SkeletalAnimationController-QuickStart.md)
- 📘 [完整 API 文檔](./SkeletalAnimationController-Guide.md)

### 比較和選擇
- 📊 [控制器對比指南](./AnimationControllers-Comparison.md)

---

## 💻 核心功能對比

| 功能 | 2D 動畫 | 3D 動畫 |
|------|--------|--------|
| 遞增播放 (nextClip) | ✅ | ✅ |
| 遞減播放 (prevClip) | ✅ | ✅ |
| 播放控制 | ✅ | ✅ |
| 暫停/恢復 | ❌ | ✅ |
| 速度控制 | ✅ | ✅ |
| 循環模式 | ❌ | ✅ |
| 按名稱播放 | ❌ | ✅ |
| 進度控制 | ⚠️ 有限 | ✅ 完整 |
| 交叉淡入淡出 | ❌ | ✅ |
| UI 顯示 | ✅ | ✅ |

---

## 🎮 使用場景

### 2D 遊戲 (AnimationClipController)
```typescript
// 角色動畫
controller.playByName('Idle');
controller.playByName('Walk');
controller.playByName('Attack');

// 或使用按鈕切換
controller.nextClip();  // 下一個動畫
controller.prevClip();  // 上一個動畫
```

### 3D 遊戲 (SkeletalAnimationController)
```typescript
// 角色動畫
controller.playByName('Idle');
controller.playByName('Run');
controller.playByName('Attack');

// 或使用按鈕切換（支持平滑過度）
controller.nextClip();  // 下一個動畫（平滑過度）
controller.prevClip();  // 上一個動畫（平滑過度）

// 高級功能
controller.setPlaybackSpeed(1.5);      // 加速
controller.setLooping(false);          // 只播放一次
controller.seek(2.5);                  // 跳到 2.5 秒
const progress = controller.getPlayProgress(); // 獲取進度
```

### 樂器/鼓動畫 (如您的示例)
```typescript
// 使用 SkeletalAnimationController 控制鼓的各種敲擊動畫
controller.nextClip();     // 下一種敲擊方式
controller.prevClip();     // 上一種敲擊方式
controller.jumpToClip(2);  // 直接跳到第 3 種敲擊方式
```

---

## 📋 API 快速參考

### 共有 API (兩個控制器都支持)

```typescript
// 播放控制
nextClip()                    // 播放下一個
prevClip()                    // 播放上一個
playCurrentClip()             // 播放當前
stopClip()                    // 停止

// 動畫選擇
jumpToClip(index)             // 跳轉到索引
getCurrentClipInfo()          // 獲取當前信息
getAllClips()                 // 獲取所有動畫
getClipCount()                // 獲取動畫總數

// 配置
setPlaybackSpeed(speed)       // 設置速度

// 狀態查詢
getIsPlaying()                // 是否播放中
getCurrentClipIndex()         // 當前索引
```

### 3D 動畫獨有 API

```typescript
// 播放控制
pauseClip()                   // 暫停
resumeClip()                  // 恢復
playByName(name)              // 按名稱播放

// 配置
setLooping(loop)              // 設置循環模式

// 進度控制
seek(time)                    // 跳到指定時間
getPlayProgress()             // 獲取進度 (0-1)

// 狀態查詢
getCurrentClipName()          // 當前動畫名
```

---

## 🛠️ 配置參數

### 編輯器檢查器設置

**按鈕（可選）：**
- `Btn Next` - 播放下一個動畫
- `Btn Prev` - 播放上一個動畫
- `Btn Play` - 播放當前動畫
- `Btn Pause` - 暫停動畫
- `Btn Stop` - 停止動畫

**標籤（可選）：**
- `Label Clip Name` - 動畫名稱
- `Label Clip Index` - 進度（2/5）
- `Label Clip Duration` - 時長（3D 動畫）

**屬性：**
- `Playback Speed` - 播放速度（預設 1.0）
- `Is Looping` - 循環模式（3D 動畫）
- `Cross Fade Time` - 過度時間（3D 動畫，預設 0.3s）

---

## 📁 文件結構

```
game169/
├── assets/
│   └── script/
│       ├── AnimationClipController.ts              # 2D 動畫控制器
│       ├── AnimationControllerTest.ts              # 2D 測試腳本
│       ├── SkeletalAnimationController.ts          # 3D 動畫控制器
│       └── SkeletalAnimationControllerTest.ts      # 3D 測試腳本
│
docs/
├── AnimationClipController-QuickStart.md           # 2D 快速開始
├── AnimationClipController-Guide.md                # 2D 完整文檔
├── SkeletalAnimationController-QuickStart.md       # 3D 快速開始
├── SkeletalAnimationController-Guide.md            # 3D 完整文檔
└── AnimationControllers-Comparison.md              # 對比指南
```

---

## 💡 實用示例

### 示例 1: 基本播放控制

```typescript
import { SkeletalAnimationController } from './SkeletalAnimationController';

export class PlayerController extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    // 播放下一個動畫
    onNextClick() {
        this.animController?.nextClip();
    }

    // 播放上一個動畫
    onPrevClick() {
        this.animController?.prevClip();
    }
}
```

### 示例 2: 按名稱播放

```typescript
// 直接播放特定動畫
this.animController.playByName('Attack');
this.animController.playByName('Idle');
this.animController.playByName('Run');
```

### 示例 3: 速度控制

```typescript
// 加速
this.animController.setPlaybackSpeed(1.5); // 1.5 倍速

// 減速
this.animController.setPlaybackSpeed(0.5); // 0.5 倍速

// 恢復正常
this.animController.setPlaybackSpeed(1.0);
```

### 示例 4: 循環播放所有動畫

```typescript
async playAllAnimationsSequentially() {
    const count = this.animController.getClipCount();
    
    for (let i = 0; i < count; i++) {
        this.animController.jumpToClip(i);
        const info = this.animController.getCurrentClipInfo();
        
        // 等待動畫播放完成
        await this.wait(info.duration * 1000);
    }
}

private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 🔍 調試技巧

### 查看所有動畫

```typescript
const clips = this.animController.getAllClips();
clips.forEach(clip => {
    console.log(`${clip.name} - ${clip.duration.toFixed(2)}s`);
});
```

### 監控播放進度

```typescript
update() {
    const progress = this.animController.getPlayProgress();
    console.log(`進度: ${(progress * 100).toFixed(0)}%`);
}
```

### 檢查播放狀態

```typescript
const info = this.animController.getCurrentClipInfo();
console.log(`播放: ${info.name} (${info.index}/${info.total})`);
console.log(`正在播放: ${this.animController.getIsPlaying()}`);
```

---

## ⚡ 性能優化

### 建議配置

**2D 動畫：**
- 速度調整：必要時才調用
- UI 更新：使用事件而非 update()

**3D 動畫：**
- 交叉淡入淡出時間：0.2-0.5 秒
- 不要在每幀調用 setPlaybackSpeed()
- 使用 seek() 進行精確定位

---

## 🐛 常見問題

### Q: 動畫不播放？
**A:** 
1. 檢查組件是否正確指定（Animation vs SkeletalAnimation）
2. 確認動畫片段已添加到組件中
3. 查看控制台警告信息

### Q: 動畫切換不流暢？
**A:** （3D 動畫）增加 `crossFadeTime` 值，例如從 0.3 改為 0.5

### Q: 按鈕不響應？
**A:** 
1. 確保按鈕節點已在檢查器中指定
2. 檢查按鈕的 enabled 屬性
3. 查看控制台錯誤信息

### Q: 如何在兩個控制器之間切換？
**A:** 创建兩個控制器實例，分別管理不同的動畫組件

---

## 📊 提交歷史

```
commit ba50fcf - feat: 添加 3D 模型動畫控制器
commit 45c55cf - feat: 添加動畫片段控制器
commit 3efaa4b - docs: 添加動畫控制器對比指南
```

---

## 🎯 下一步建議

1. ✅ 根據你的需求選擇合適的控制器
2. ✅ 閱讀相應的快速開始指南
3. ✅ 在你的場景中實現控制器
4. ✅ 根據需要調整配置參數
5. ✅ 整合到你的遊戲邏輯中

---

## 📞 支持資源

- 📖 查看對應控制器的快速開始指南
- 📘 查看完整 API 文檔
- 💻 參考 Test 測試腳本示例
- 🔍 查看控制台輸出的詳細日誌

---

## 🎉 總結

您現在擁有：

✅ 2 個功能完整的動畫控制器  
✅ 4 份詳細的快速開始指南  
✅ 4 份完整的 API 文檔  
✅ 2 個測試示例腳本  
✅ 1 份對比選擇指南  

**可以立即開始在項目中使用！** 🚀

---

祝您使用愉快！如有任何問題，請查閱相應的文檔。🎬

**最後更新：2025-10-28**
