# 動畫循環播放功能修復指南

## 📝 修改內容

點擊 **BtnNext** 和 **BtnPrev** 後，動畫現在會**立即播放**並**自動循環撥放**。

### 🔄 更新內容

#### **2D 動畫控制器 (AnimationClipController)**

```typescript
// 預設現在為循環播放
@property({ type: Boolean, tooltip: '是否循環播放', default: true })
public isLooping: boolean = true;  // ← 改為 true（之前是 false）

// playCurrentClip() 中已設置循環模式
public playCurrentClip() {
    // ...
    state.wrapMode = this.isLooping ? 2 : 1;  // ← 新增
    // ...
}

// 新增方法：動態改變循環模式
public setLooping(loop: boolean) {
    this.isLooping = loop;
    const state = this.animationComponent.getState(clipName);
    state.wrapMode = loop ? 2 : 1;  // 2 = Loop, 1 = Once
}
```

#### **3D 動畫控制器 (SkeletalAnimationController)**

```typescript
// 3D 控制器 playCurrentClip() 已更新
public playCurrentClip() {
    // ...
    // 設置循環模式
    const playingState = this.skeletalAnimation.state;
    if (playingState) {
        playingState.speed = this.playbackSpeed;
        playingState.wrapMode = this.isLooping ? 2 : 1;  // ← 新增
    }
    // ...
}
```

---

## 🎬 使用流程

### 步驟 1: 在檢查器中配置

在 Cocos Creator 檢查器中設置控制器屬性：

| 屬性 | 值 | 說明 |
|-----|------|------|
| **Animation/SkeletalAnimation** | [拖入動畫組件] | 目標動畫組件 |
| **Btn Next** | [BtnNext 按鈕] | 下一個動畫按鈕 |
| **Btn Prev** | [BtnPrev 按鈕] | 上一個動畫按鈕 |
| **Is Looping** | ✅ 勾選 | 開啟循環播放（已預設） |
| **Playback Speed** | 1.0 | 播放速度 |

### 步驟 2: 使用按鈕

- **點擊 BtnNext** → 切換至下一個動畫 → **立即播放** → **循環撥放**
- **點擊 BtnPrev** → 切換至上一個動畫 → **立即播放** → **循環撥放**

---

## 🔧 動態控制循環模式

### 在代碼中改變循環模式

```typescript
// TypeScript 代碼示例

@property(AnimationClipController)
private animController: AnimationClipController | null = null;

// 禁用循環（單次播放）
this.animController?.setLooping(false);

// 啟用循環
this.animController?.setLooping(true);

// 獲取當前循環狀態
const isLooping = this.animController?.isLooping;
```

### 常見場景

```typescript
// 場景 1: 敵人死亡動畫（不循環）
this.animController.setLooping(false);
this.animController.jumpToClip(3);  // 跳轉到死亡動畫
// 播放一次後停止

// 場景 2: 空閒動畫（循環）
this.animController.setLooping(true);
this.animController.jumpToClip(0);  // 跳轉到空閒動畫
// 自動循環播放

// 場景 3: 攻擊動畫完成後回到空閒
this.animController.setLooping(false);
this.animController.jumpToClip(2);  // 播放攻擊（一次）
// 添加完成回調後切回空閒循環
```

---

## 🎯 wrapMode 值說明

| wrapMode | 值 | 說明 |
|----------|-----|------|
| **Loop** | 2 | 動畫循環播放（自動重新開始） |
| **Once** | 1 | 動畫單次播放（播完即停止） |
| **Default** | 0 | 默認行為 |

---

## ✨ 行為對比

### 之前 (修改前)

```
點擊 BtnNext
  ↓
切換至下一個動畫
  ↓
停止撥放（需手動點擊 BtnPlay 才能播放）
  ↓
不循環
```

### 之後 (修改後) ✅

```
點擊 BtnNext
  ↓
切換至下一個動畫
  ↓
立即播放 ✅
  ↓
自動循環 ✅
```

---

## 🐛 故障排除

### 問題 1: 動畫不循環

**檢查清單：**
- ☑️ 確認 `isLooping` 勾選為 ✅
- ☑️ 確認已調用 `setLooping(true)` 或按鈕點擊後自動設置
- ☑️ 檢查控制台日誌確認 wrapMode 被設置為 2

```typescript
// 診斷代碼
const info = animController.getCurrentClipInfo();
console.log(`當前動畫: ${info.name}, 循環: ${animController.isLooping}`);
```

### 問題 2: 按鈕點擊後動畫不播放

**檢查清單：**
- ☑️ 確認 BtnNext/BtnPrev 已在檢查器中配置
- ☑️ 確認 Animation/SkeletalAnimation 組件已指定
- ☑️ 檢查控制台是否有錯誤訊息

```typescript
// 測試代碼
if (!this.animationComponent) {
    console.error('Animation 組件未指定！');
}
```

### 問題 3: 循環模式改不了

**解決方案：**
```typescript
// 方式 1: 通過屬性改變
animController.isLooping = false;
animController.playCurrentClip();  // 重新播放以應用新設置

// 方式 2: 通過方法改變（推薦）
animController.setLooping(false);
```

---

## 📦 Git 提交信息

```
commit 6bdd120
fix: 點擊 BtnNext/BtnPrev 後立即播放並循環撥放動畫

- AnimationClipController: 預設循環播放為 true
- SkeletalAnimationController: playCurrentClip() 設置循環模式
- 兩個控制器新增 setLooping(loop) 方法
- 點擊按鈕後立即撥放，且默認循環模式已啟用
```

---

## 📚 相關文檔

- 📖 [AnimationClipController-Guide.md](./AnimationClipController-Guide.md) - 2D 控制器完整文檔
- 📖 [SkeletalAnimationController-Guide.md](./SkeletalAnimationController-Guide.md) - 3D 控制器完整文檔
- 📖 [AnimationControllers-Comparison.md](./AnimationControllers-Comparison.md) - 功能對比指南

---

## ✅ 驗證清單

使用此清單驗證功能是否正常：

- [ ] 場景中添加了動畫控制器
- [ ] Animation/SkeletalAnimation 組件已綁定
- [ ] BtnNext 和 BtnPrev 按鈕已配置
- [ ] `isLooping` 勾選為 ✅
- [ ] 點擊 BtnNext → 動畫立即播放且循環 ✓
- [ ] 點擊 BtnPrev → 動畫立即播放且循環 ✓
- [ ] 控制台無錯誤訊息 ✓

---

**更新日期:** 2025-10-28  
**版本:** 2.0 (循環播放功能)
