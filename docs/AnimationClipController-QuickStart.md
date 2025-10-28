# AnimationClipController - 快速開始指南

## ⚡ 5 分鐘上手

### 第 1 步: 準備場景

在 Cocos Creator 中：
1. 打開你的遊戲場景
2. 創建或選擇一個含有 **Animation 組件**的節點

### 第 2 步: 添加控制器

1. 創建一個**新的空節點**（命名為 `AnimationController`）
2. 在該節點上添加組件：`script/AnimationClipController.ts`
3. 在檢查器面板中設置以下屬性：

```
Animation Component    → 拖入包含動畫的節點
Btn Next              → 拖入"下一個"按鈕節點
Btn Prev              → 拖入"上一個"按鈕節點
Label Clip Name       → 拖入用於顯示動畫名稱的標籤
Label Clip Index      → 拖入用於顯示進度的標籤
```

### 第 3 步: 設置按鈕

創建 4 個按鈕節點（至少需要 Next 和 Prev）：

- **btnNext** - 下一個動畫
- **btnPrev** - 上一個動畫
- **btnPlay** - 播放（可選）
- **btnStop** - 停止（可選）

### 第 4 步: 運行

1. 按下 **Play** 按鈕運行場景
2. 點擊 **Next** 按鈕播放下一個動畫
3. 點擊 **Prev** 按鈕播放上一個動畫

✅ 完成！

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

## 💻 代碼使用示例

### 從另一個腳本控制

```typescript
import { AnimationClipController } from './AnimationClipController';

export class MyController extends Component {
    @property(AnimationClipController)
    private animController: AnimationClipController | null = null;

    // 播放下一個
    playNext() {
        this.animController?.nextClip();
    }

    // 播放上一個
    playPrev() {
        this.animController?.prevClip();
    }

    // 改變速度
    setSpeed(speed: number) {
        this.animController?.setPlaybackSpeed(speed);
    }
}
```

### 獲取當前動畫信息

```typescript
const info = this.animController.getCurrentClipInfo();
console.log(`當前: ${info.name} (${info.index}/${info.total})`);
```

### 播放所有動畫

```typescript
const count = this.animController.getClipCount();
for (let i = 0; i < count; i++) {
    this.animController.jumpToClip(i);
    // 等待動畫播放完...
}
```

---

## 🎯 常用場景

### 場景 1: 角色動畫切換
```
Idle → Walk → Run → Jump → Landing
    ↑                       ↓
    └───────────────────────┘
```
使用 Next/Prev 按鈕循環播放動畫。

### 場景 2: 動畫編輯預覽
```
預覽所有動畫 → 調整速度 → 選擇導出
```
使用 Speed Up/Down 按鈕調整播放速度。

### 場景 3: 技能動畫列表
```
技能 1: 攻擊  → 技能 2: 防守 → 技能 3: 閃避
```
使用索引直接跳轉到指定動畫。

---

## ⚙️ 配置參數

在編輯器中調整：

- **Playback Speed** (預設: 1.0)
  - 0.5 = 半速播放
  - 1.0 = 正常速度
  - 2.0 = 2 倍速播放

- **Is Looping** (預設: false)
  - true = 動畫循環播放
  - false = 動畫播放一次

---

## 🔧 故障排除

### 問題: 按鈕點擊沒有反應

**解決方案：**
1. 檢查按鈕節點是否正確指定
2. 確認按鈕的 enabled 屬性為 true
3. 查看控制台是否有錯誤信息

### 問題: 動畫不播放

**解決方案：**
1. 確保 Animation 組件中有動畫片段
2. 檢查動畫片段的名稱是否正確
3. 在控制台查看是否有「找不到動畫」的警告

### 問題: UI 標籤不更新

**解決方案：**
1. 確保 Label 組件已正確指定
2. 檢查 Label 文字顏色是否與背景相同

---

## 📚 完整 API 列表

### 主要方法

```typescript
nextClip()              // 播放下一個
prevClip()              // 播放上一個
playCurrentClip()       // 播放當前
pauseClip()             // 暫停
stopClip()              // 停止
setPlaybackSpeed(n)     // 設置速度
jumpToClip(index)       // 跳轉到索引
```

### 查詢方法

```typescript
getCurrentClipInfo()    // 獲取當前動畫信息
getAllClips()           // 獲取所有動畫列表
getCurrentClipIndex()   // 獲取當前索引
getClipCount()          // 獲取動畫總數
getIsPlaying()          // 是否正在播放
```

---

## 🚀 進階用法

### 自動循環播放所有動畫

```typescript
async playAllAnimation() {
    const count = this.animController.getClipCount();
    for (let i = 0; i < count; i++) {
        this.animController.jumpToClip(i);
        await this.wait(3000); // 等待 3 秒
    }
}
```

### 創建動畫選擇菜單

```typescript
const clips = this.animController.getAllClips();
clips.forEach((clip, index) => {
    const menuItem = createMenuItem(clip.name);
    menuItem.onClick(() => {
        this.animController.jumpToClip(index);
    });
});
```

### 動畫播放完成回調

```typescript
// 在主腳本中定期檢查
update() {
    if (!this.animController.getIsPlaying()) {
        // 動畫已播放完成
        this.onAnimationComplete();
    }
}
```

---

## 📝 文件位置

- **腳本**: `assets/script/AnimationClipController.ts`
- **測試**: `assets/script/AnimationControllerTest.ts`
- **文檔**: `docs/AnimationClipController-Guide.md`

---

## 💡 提示

1. **快速測試** - 使用 AnimationControllerTest 快速驗證功能
2. **日誌調試** - 所有操作都會輸出到控制台
3. **邊界檢查** - 自動循環到第一個/最後一個動畫
4. **速度限制** - 速度限制在 0.1x - 3.0x 以保證穩定性

---

## 🎬 下一步

1. ✅ 添加控制器到場景
2. ✅ 連接按鈕和 Label
3. ✅ 測試基本功能
4. ✅ 根據需要自定義按鈕行為
5. ✅ 整合到你的遊戲邏輯中

**祝你使用愉快！** 🎉
