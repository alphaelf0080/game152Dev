# SkeletalAnimationController - 調試和診斷指南

## 🔍 問題：無法切換動畫或不會自動播放

### 症狀

- ❌ 點擊 BtnNext/BtnPrev 但動畫沒有切換
- ❌ 場景加載後動畫不會自動播放
- ❌ 控制台沒有相關日誌輸出
- ❌ SkeletalAnimation 組件有 clips，但控制器無法訪問

---

## 🔧 快速診斷步驟

### Step 1: 檢查控制台日誌

運行場景並打開 **Console** 面板，查看是否有以下日誌：

#### ✅ 成功的日誌輸出

```
[SkeletalAnimationController] 已加載 Clip: Take_003.animation (2.50s)
[SkeletalAnimationController] 已從 SkeletalAnimation 組件加載 9 個動畫片段
[SkeletalAnimationController] 初始化完成，共 9 個動畫片段
[SkeletalAnimationController] 準備播放: Take_003.animation
[SkeletalAnimationController] 可用 clips 數量: 9
[SkeletalAnimationController] ✓ 已開始播放: Take_003.animation
```

#### ❌ 常見的錯誤日誌

```
[SkeletalAnimationController] 未指定 SkeletalAnimation 組件，且未拖入任何 Clip 資源
[SkeletalAnimationController] 沒有可用的動畫片段
[SkeletalAnimationController] 無法播放動畫
[SkeletalAnimationController] 播放失敗: TypeError: xxx
```

---

### Step 2: 檢查檢查器配置

在 Cocos Creator 檢查器中驗證：

```
✓ Skeletal Animation     → 已指定 (如: Drum_LOW)
✓ Btn Next              → 已指定
✓ Btn Prev              → 已指定
✓ Is Looping            → ✅ 勾選
```

**檢查項目：**
- [ ] Skeletal Animation 不為空
- [ ] Animation 組件已附加到 Drum_LOW 節點
- [ ] SkeletalAnimation 組件中有 Clips

---

### Step 3: 驗證按鈕連接

**檢查按鈕是否正確連接：**

1. 在檢查器中點擊 **Btn Next** 欄位
2. 確認選中的是實際的按鈕節點
3. 場景中按下 **Play** 後點擊按鈕
4. 查看控制台是否有 `nextClip()` 的日誌

---

## 📋 常見問題排查

### 問題 A: 初始化時未找到 clips

**日誌：**
```
[SkeletalAnimationController] 未指定 SkeletalAnimation 組件，且未拖入任何 Clip 資源
[SkeletalAnimationController] 沒有可用的動畫片段
```

**原因：**
1. SkeletalAnimation 組件未指定
2. SkeletalAnimation 中沒有 clips
3. 既未指定組件也未拖入 Clip 資源

**解決方案：**
```
檢查清單:
□ SkeletalAnimation 屬性已指定 (拖入 Drum_LOW)
□ Drum_LOW 節點上有 SkeletalAnimation 組件
□ SkeletalAnimation 組件中有 Clips
  (右側檢查器 → SkeletalAnimation → Clips: 9)
```

---

### 問題 B: Clips 已加載但無法播放

**日誌：**
```
[SkeletalAnimationController] 已從 SkeletalAnimation 組件加載 9 個動畫片段
[SkeletalAnimationController] nextClip() → 切換到 [1] Take_001.animation
[SkeletalAnimationController] 準備播放: Take_001.animation
[SkeletalAnimationController] 播放失敗: TypeError: ...
```

**原因：**
1. Clip 名稱格式不匹配
2. SkeletalAnimation 的 play() 方法找不到該 clip
3. 動畫檔案損壞或格式不支持

**解決方案：**
1. **確認 Clip 名稱：**
   ```typescript
   // 在代碼中打印所有 clip 名稱
   const clips = this.skeletalAnimation.clips;
   clips.forEach((clip, i) => {
       console.log(`[${i}] ${clip.name}`);
   });
   ```

2. **檢查 Clip 格式：**
   - ✅ 支持: `.anim`, `.fbx`, `.glb`
   - ❌ 檢查是否有特殊字符或空格

3. **嘗試直接播放：**
   ```typescript
   // 測試代碼：直接調用 SkeletalAnimation.play()
   this.skeletalAnimation.play('Take_003.animation');
   ```

---

### 問題 C: 按鈕點擊沒有反應

**日誌：**
```
[SkeletalAnimationController] 按鈕監聽器已附加
(但點擊按鈕後沒有 nextClip() 日誌)
```

**原因：**
1. 按鈕未正確連接
2. 按鈕的 Button 組件 enabled = false
3. 按鈕被其他 UI 遮擋

**解決方案：**
```
檢查清單:
□ Btn Next 屬性已指定 (拖入按鈕)
□ 按鈕的 Button 組件已啟用
□ 按鈕的 Node 已啟用 (enabled = true)
□ 按鈕不被其他 UI 遮擋
□ 按鈕有正確的事件監聽
```

**驗證監聽器：**
在 playCurrentClip() 中添加：
```typescript
if (this.btnNext) {
    console.log('btnNext 已連接:', this.btnNext.node.name);
} else {
    console.warn('btnNext 未連接！');
}
```

---

### 問題 D: 只加載一次，之後無法重新播放

**日誌：**
```
[SkeletalAnimationController] ✓ 已開始播放: Take_000.animation
(點擊 Next 後)
[SkeletalAnimationController] nextClip() → 切換到 [1] Take_001.animation
[SkeletalAnimationController] 準備播放: Take_001.animation
(但動畫沒有改變)
```

**原因：**
1. SkeletalAnimation 的 stop() 方法未生效
2. 新 clip 與舊 clip 名稱相同
3. 播放狀態管理出問題

**解決方案：**
```typescript
// 確保停止動畫後再播放新的
this.skeletalAnimation.stop();
setTimeout(() => {
    this.skeletalAnimation.play(clipName);
}, 50);
```

---

## 🧪 測試腳本

### 完整測試代碼

在另一個腳本中測試：

```typescript
import { Component, _decorator } from 'cc';
import { SkeletalAnimationController } from './SkeletalAnimationController';

const { ccclass, property } = _decorator;

@ccclass('TestAnimationController')
export class TestAnimationController extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    start() {
        if (!this.animController) {
            console.error('未指定 SkeletalAnimationController');
            return;
        }

        // 打印所有信息
        console.log('=== 動畫控制器診斷 ===');
        console.log('已加載 clips:', this.animController.getAllClips().length);
        
        // 列出所有 clip
        this.animController.getAllClips().forEach((clip, i) => {
            console.log(`  [${i}] ${clip.name} (${clip.duration}s)`);
        });

        // 測試播放
        console.log('\n開始測試播放...');
        this.testPlayback();
    }

    private testPlayback() {
        console.log('Current:', this.animController?.getCurrentClipInfo());
        
        // 延遲 2 秒後切換
        setTimeout(() => {
            console.log('>>> 嘗試 nextClip()');
            this.animController?.nextClip();
        }, 2000);

        // 延遲 4 秒後再切換
        setTimeout(() => {
            console.log('>>> 嘗試 nextClip()');
            this.animController?.nextClip();
        }, 4000);
    }
}
```

---

## 📊 調試檢查清單

### 基礎配置

- [ ] SkeletalAnimation 已指定
- [ ] Drum_LOW 節點上有 SkeletalAnimation 組件
- [ ] SkeletalAnimation 中有 Clips (9 個)
- [ ] Btn Next 已指定
- [ ] Btn Prev 已指定

### 組件狀態

- [ ] Button 組件已啟用
- [ ] Node 已啟用
- [ ] 控制器腳本已啟用
- [ ] 沒有編譯錯誤

### 運行時驗證

- [ ] 控制台無警告或錯誤
- [ ] 初始化日誌正確輸出
- [ ] 點擊按鈕有日誌反應
- [ ] 動畫確實播放

### 播放驗證

- [ ] 第一個 clip 自動播放
- [ ] 點擊 Next 切換到下一個
- [ ] 點擊 Prev 切換到上一個
- [ ] 循環播放正常
- [ ] 動畫時長正確

---

## 🛠️ 高級診斷

### 手動測試 SkeletalAnimation

在控制台運行以下代碼測試 SkeletalAnimation：

```javascript
// 假設 drum 是 SkeletalAnimation 組件
const drum = cc.find('Drum_LOW').getComponent('cc.SkeletalAnimation');

// 列出所有 clips
console.log('Clips:', drum.clips.map(c => c.name));

// 測試播放
drum.play('Take_000.animation');

// 測試停止
drum.stop();

// 查看狀態
console.log('State:', drum.state);
```

### 監聽播放完成事件

```typescript
private setupAnimationEvents() {
    const state = this.skeletalAnimation?.state;
    
    if (state) {
        // 監聽播放完成
        state.on('finished', () => {
            console.log('動畫播放完成');
            this.onAnimationFinished();
        });
    }
}

private onAnimationFinished() {
    // 動畫完成後的處理
    console.log('即將自動播放下一個');
    this.nextClip();
}
```

---

## 📝 常見解決方案

### 解決方案 1: 強制重新初始化

```typescript
// 場景加載後重新初始化
onLoad() {
    setTimeout(() => {
        this.initializeAnimationClips();
        this.attachButtonListeners();
    }, 500);
}
```

### 解決方案 2: 確保完整停止-播放循環

```typescript
private forcePlayClip(clipName: string) {
    // 確保完整停止
    this.skeletalAnimation.stop();
    
    // 延遲確保停止生效
    setTimeout(() => {
        this.skeletalAnimation.play(clipName);
    }, 100);
}
```

### 解決方案 3: 驗證 Clip 名稱

```typescript
private validateClipName(name: string): boolean {
    const clips = this.skeletalAnimation?.clips || [];
    return clips.some(c => c.name === name);
}
```

---

## 📚 相關文檔

- [SkeletalAnimationController-QuickStart.md](./SkeletalAnimationController-QuickStart.md)
- [SkeletalAnimationController-Guide.md](./SkeletalAnimationController-Guide.md)
- [SkeletalAnimationController-ClipResources.md](./SkeletalAnimationController-ClipResources.md)

---

**版本：** 2.2 (診斷和調試)  
**更新日期：** 2025-10-28  
**狀態：** 診斷工具已完成
