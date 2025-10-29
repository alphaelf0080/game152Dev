# 動畫控制器對比指南

## 兩種控制器概述

我已為您創建了兩個動畫控制器，用於不同的場景：

| 功能 | AnimationClipController | SkeletalAnimationController |
|------|----------------------|--------------------------|
| **用途** | 控制 Cocos 內置動畫 | 控制 3D 模型動畫 (FBX/GLB) |
| **組件類型** | Animation | SkeletalAnimation |
| **適用場景** | 2D 動畫、Sprite 動畫 | 3D 模型、骨骼動畫 |
| **動畫來源** | 場景內編輯的動畫片段 | 從 FBX/GLB 導入的動畫 |
| **交叉淡入淡出** | ❌ 不支持 | ✅ 支持平滑過度 |
| **播放進度控制** | ⚠️ 有限 | ✅ 完整支持 |
| **循環模式** | ❌ 不支持 | ✅ 支持 |

---

## 詳細對比

### 1. 組件類型

**AnimationClipController**
```typescript
@property(Animation)
public animationComponent: Animation | null = null;
```

**SkeletalAnimationController**
```typescript
@property(SkeletalAnimation)
public skeletalAnimation: SkeletalAnimation | null = null;
```

### 2. 初始化流程

#### AnimationClipController
```
1. 獲取 Animation.clips 陣列
2. 構建動畫列表
3. 等待用戶點擊按鈕
```

#### SkeletalAnimationController
```
1. 獲取 SkeletalAnimation.clips 陣列
2. 構建動畫列表
3. 自動播放第一個動畫
4. 等待用戶點擊按鈕
```

### 3. 方法對比

#### 共有方法
```typescript
// 兩者都支持
nextClip()              // 播放下一個
prevClip()              // 播放上一個
playCurrentClip()       // 播放當前
pauseClip()             // 暫停
stopClip()              // 停止
setPlaybackSpeed()      // 設置速度
jumpToClip()            // 跳轉到索引
getCurrentClipInfo()    // 獲取動畫信息
getAllClips()           // 獲取所有動畫
getClipCount()          // 獲取動畫總數
getIsPlaying()          // 是否播放中
```

#### SkeletalAnimationController 獨有方法
```typescript
playByName(clipName)        // 按名稱播放
resumeClip()                // 恢復播放
setLooping(loop)            // 設置循環模式
seek(time)                  // 尋求到時間
getPlayProgress()           // 獲取播放進度 (0-1)
getCurrentClipName()        // 獲取當前動畫名
```

### 4. 屬性對比

| 屬性 | AnimationClipController | SkeletalAnimationController |
|------|----------------------|--------------------------|
| `playbackSpeed` | ✅ | ✅ |
| `isLooping` | ❌ | ✅ |
| `crossFadeTime` | ❌ | ✅ |

### 5. 動畫過度方式

#### AnimationClipController
```typescript
// 直接切換（可能有斷層）
this.animationComponent.play(clipName);
```

#### SkeletalAnimationController
```typescript
// 平滑過度（0.3 秒交叉淡入淡出）
this.skeletalAnimation.crossFade(clipName, 0.3);
```

---

## 選擇指南

### 何時使用 AnimationClipController？

✅ **使用場景：**
- 在場景編輯器中創建的 Sprite 動畫
- 簡單的 2D 角色動畫
- 需要快速切換的短動畫序列
- 已使用 Animation 組件的項目

**示例：**
```typescript
// 2D 遊戲角色
// Character 節點上有 Animation 組件
// 包含 Idle、Walk、Run 等動畫
controller.nextClip(); // 快速播放下一個
```

### 何時使用 SkeletalAnimationController？

✅ **使用場景：**
- FBX/GLB 3D 模型
- 需要平滑動畫過度的場景
- 複雜的骨骼動畫系統
- 需要精確進度控制
- 需要按名稱快速查找動畫

**示例：**
```typescript
// 3D 遊戲角色或鼓
// Model 節點上有 SkeletalAnimation 組件
// 從 FBX 導入包含多個 Take (動畫)
controller.playByName('Take 002'); // 按名稱直接播放
controller.setLooping(false);      // 設置只播放一次
```

---

## 實現示例對比

### 播放下一個動畫

**AnimationClipController**
```typescript
// 簡單直接
export class GameController extends Component {
    @property(AnimationClipController)
    private animController: AnimationClipController | null = null;

    onNextButtonClick() {
        this.animController?.nextClip();
    }
}
```

**SkeletalAnimationController**
```typescript
// 功能更豐富
export class PlayerController extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    onNextButtonClick() {
        // 切換到下一個動畫
        this.animController?.nextClip();
        
        // 並且可以做更多事情
        this.animController?.setPlaybackSpeed(1.2);
        this.animController?.setLooping(false);
    }
}
```

### 獲取動畫信息

**AnimationClipController**
```typescript
const info = this.animController.getCurrentClipInfo();
console.log(`${info.name} (${info.index}/${info.total})`);
// 輸出: Idle (1/5)
```

**SkeletalAnimationController**
```typescript
const info = this.animController.getCurrentClipInfo();
console.log(`${info.name} (${info.index}/${info.total}) - ${info.duration.toFixed(2)}s`);
// 輸出: Take 001 (1/9) - 0.83s
```

### 播放控制

**AnimationClipController**
```typescript
// 基本控制
controller.playCurrentClip();  // 播放
// 沒有暫停、恢復功能
```

**SkeletalAnimationController**
```typescript
// 高級控制
controller.playCurrentClip();  // 播放
controller.pauseClip();        // 暫停
controller.resumeClip();       // 恢復
controller.stopClip();         // 停止
controller.seek(2.5);          // 跳到 2.5 秒
```

---

## 遷移指南

### 從 AnimationClipController 遷移到 SkeletalAnimationController

如果您已經在使用 AnimationClipController，現在想切換到 SkeletalAnimationController：

**步驟 1: 替換組件引用**
```typescript
// 舊代碼
@property(Animation)
private animController: AnimationClipController | null = null;

// 新代碼
@property(SkeletalAnimation)
private animController: SkeletalAnimationController | null = null;
```

**步驟 2: 更新引用指向**
- 從指向 Animation 組件改為指向 SkeletalAnimation 組件
- 在檢查器中拖入新的 SkeletalAnimationController

**步驟 3: 享受新功能**
```typescript
// 現在可以使用新功能
controller.playByName('AttackSpecial');
controller.setLooping(false);
controller.seek(1.5);
```

---

## 兼容性總結

### Cocos Creator 版本
- ✅ 3.8 及以上

### 支持的動畫格式

**AnimationClipController**
- 場景內編輯的 Animation 片段

**SkeletalAnimationController**
- FBX (Autodesk)
- GLB / GLTF (標準格式)
- 其他 Cocos Creator 支持的 3D 格式

---

## 效能比較

| 方面 | AnimationClipController | SkeletalAnimationController |
|------|----------------------|--------------------------|
| **CPU 占用** | 低 | 中等（骨骼計算） |
| **內存** | 低 | 中等（3D 數據） |
| **動畫過度** | 無 | 有（更流暢） |
| **適合場景數量** | 無限 | 取決於 3D 模型複雜度 |

---

## 最佳實踐

### 同時使用兩個控制器

```typescript
export class GameManager extends Component {
    @property(AnimationClipController)
    private spriteAnimController: AnimationClipController | null = null;

    @property(SkeletalAnimationController)
    private modelAnimController: SkeletalAnimationController | null = null;

    // 2D 角色動畫
    playCharacterAttack() {
        this.spriteAnimController?.playByName('Attack');
    }

    // 3D 環境物體動畫
    playDrumBeat() {
        this.modelAnimController?.playByName('Beat_001');
    }
}
```

---

## 快速決策樹

```
你的動畫來自？
│
├─ FBX/GLB 3D 模型？
│  └─ YES → 使用 SkeletalAnimationController ✅
│
├─ Sprite/2D 動畫？
│  └─ YES → 使用 AnimationClipController ✅
│
└─ 不確定？
   ├─ 需要精確進度控制？ → SkeletalAnimationController
   ├─ 需要按名稱播放？ → SkeletalAnimationController
   ├─ 需要平滑過度？ → SkeletalAnimationController
   └─ 其他情況 → AnimationClipController
```

---

## 文件位置總結

### AnimationClipController
- **腳本**: `game169/assets/script/AnimationClipController.ts`
- **測試**: `game169/assets/script/AnimationControllerTest.ts`
- **快速指南**: `docs/AnimationClipController-QuickStart.md`
- **完整文檔**: `docs/AnimationClipController-Guide.md`

### SkeletalAnimationController
- **腳本**: `game169/assets/script/SkeletalAnimationController.ts`
- **測試**: `game169/assets/script/SkeletalAnimationControllerTest.ts`
- **快速指南**: `docs/SkeletalAnimationController-QuickStart.md`
- **完整文檔**: `docs/SkeletalAnimationController-Guide.md`

---

## 常見問題

### Q: 可以同時使用兩個控制器嗎？
**A:** 可以！為不同的動畫組件創建不同的控制器實例即可。

### Q: 如何在两個控制器之間切換？
**A:** 只需更改組件引用和腳本，不需修改游戲邏輯。

### Q: 如果我有 2D 和 3D 混合的場景？
**A:** 使用 AnimationClipController 控制 2D 動畫，SkeletalAnimationController 控制 3D 動畫。

### Q: 性能差異大嗎？
**A:** SkeletalAnimationController 因為涉及骨骼計算，CPU占用略高，但對現代設備影響不大。

---

## 總結

| 需求 | 推薦方案 |
|------|--------|
| **簡單的 2D 動畫切換** | AnimationClipController |
| **3D 模型動畫控制** | SkeletalAnimationController |
| **需要平滑過度** | SkeletalAnimationController |
| **按名稱快速播放** | SkeletalAnimationController |
| **精確進度控制** | SkeletalAnimationController |
| **簡單快速** | AnimationClipController |

---

## 下一步

選擇適合你的控制器，查看相應的快速開始指南開始使用！

- [AnimationClipController 快速開始](./AnimationClipController-QuickStart.md)
- [SkeletalAnimationController 快速開始](./SkeletalAnimationController-QuickStart.md)

祝您使用愉快！🎬
