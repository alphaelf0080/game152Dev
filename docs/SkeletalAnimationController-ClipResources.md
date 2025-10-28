# SkeletalAnimationController - Clip 資源拖入指南

## 📋 功能概述

3D 動畫控制器已重構為 **Clip 資源拖入模式**，支持直接從 Cocos Creator assets 中拖入 AnimationClip 資源控制動畫。

### 工作流程

```
拖入 Clip 資源到檢查器
         ↓
點擊 BtnNext/BtnPrev
         ↓
播放對應的 Clip
         ↓
自動循環或單次播放
```

---

## 🎯 Clip 資源拖入方式

### 方式 1: 直接拖入（推薦）

**步驟：**
1. 打開 Cocos Creator 資源面板（Assets）
2. 找到 AnimationClip 文件（通常位置：`assets/animations/` 或 `assets/models/`）
3. 將 Clip 文件拖入檢查器的 **Animation Clip Resources** 區域
4. 重複以上步驟添加多個 Clip

**視覺示意：**
```
資源面板                          檢查器面板
├── assets/                       SkeletalAnimationController
│   ├── animations/               Animation Clip Resources
│   │   ├── Take_001.anim  ──────→ [0] Take_001
│   │   ├── Take_002.anim  ──────→ [1] Take_002
│   │   └── Take_003.anim  ──────→ [2] Take_003
```

### 方式 2: 通過 + 按鈕添加

**步驟：**
1. 在檢查器中找到 `Animation Clip Resources` 欄位
2. 點擊陣列旁的 `+` 按鈕增加新項
3. 在新項目的選擇框中點擊並選擇 AnimationClip 資源
4. 重複以上步驟添加多個 Clip

---

## 🔧 配置優先級

### 優先級邏輯

```
1️⃣ 優先使用：Animation Clip Resources（拖入的 Clip）
         ↓
         是否有拖入 Clip？
         ├─ 是 → 使用拖入的 Clip 資源
         └─ 否 → 進入備選方案
                ↓
2️⃣ 備選方案：SkeletalAnimation 組件中的 clips
         ↓
         使用 SkeletalAnimation.clips
```

### 配置場景

#### 場景 A: 只拖入 Clip（推薦）

```
Animation Clip Resources:
  [0] Take_001.anim
  [1] Take_002.anim
  [2] Take_003.anim

Result: ✅ 使用拖入的 Clip
```

#### 場景 B: 只設置 SkeletalAnimation

```
Animation Clip Resources: (空)
Skeletal Animation: [Drum_LOW]

Result: ✅ 自動使用 Drum_LOW 中的 clips
```

#### 場景 C: 同時設置（Clip 優先）

```
Animation Clip Resources:
  [0] Take_001.anim
  [1] Take_002.anim

Skeletal Animation: [Drum_LOW]

Result: ✅ 使用 Clip Resources（忽略 Skeletal Animation 中的 clips）
```

---

## 📦 Clip 資源位置和格式

### 常見位置

| 模型類型 | 資源路徑 | 文件格式 |
|---------|--------|--------|
| FBX 模型 | `assets/models/` | `.fbx` 或 `.anim` |
| GLB 模型 | `assets/models/` | `.glb` 或 `.anim` |
| 動畫文件 | `assets/animations/` | `.anim` |

### 識別 AnimationClip

**在資源面板中：**
- 📄 `.anim` 文件 - AnimationClip 資源
- 🎬 圖標顯示為 "▶️" - 可播放資源

**示例：**
```
assets/
├── models/
│   ├── Drum_LOW.fbx
│   ├── Drum_LOW.anim (← 可拖入的 Clip)
│   ├── Drum_LOW@Take_001.anim (← 可拖入的 Clip)
│   └── Drum_LOW@Take_002.anim (← 可拖入的 Clip)
├── animations/
│   ├── Attack.anim (← 可拖入)
│   └── Idle.anim (← 可拖入)
```

---

## 🎮 使用流程

### 完整設置流程

```
Step 1: 準備 Clip 資源
├─ 確保 AnimationClip 文件在 assets 中
└─ 記下文件位置和名稱

Step 2: 添加控制器
├─ 創建空節點
└─ 添加 SkeletalAnimationController 組件

Step 3: 拖入必要屬性
├─ Skeletal Animation: 拖入 3D 模型節點
├─ Btn Next/Prev: 拖入按鈕
└─ Animation Clip Resources: 拖入 Clip 資源

Step 4: 運行測試
├─ 運行場景
└─ 點擊 BtnNext/BtnPrev 測試播放
```

### 代碼示例

**控制動畫播放：**
```typescript
// 播放下一個 Clip
this.animController.nextClip();

// 播放上一個 Clip
this.animController.prevClip();

// 跳轉到指定索引
this.animController.jumpToClip(2);

// 按名稱播放
this.animController.playByName('Take_001');

// 設置循環
this.animController.setLooping(true);

// 調整速度
this.animController.setPlaybackSpeed(1.5);
```

---

## ✅ 驗證配置

### 檢查清單

- [ ] Clip 資源已從 assets 拖入檢查器
- [ ] Animation Clip Resources 陣列顯示所有 Clip
- [ ] Skeletal Animation 已指定（如果未拖入 Clip）
- [ ] Btn Next 和 Btn Prev 已指定
- [ ] 運行場景後無錯誤信息

### 控制台診斷

**成功輸出：**
```
[SkeletalAnimationController] 已從拖入資源加載 3 個動畫片段
[SkeletalAnimationController] 切換到下一個動畫: Take_001
[SkeletalAnimationController] 當前動畫: Take_001 (1/3)
```

**錯誤輸出：**
```
[SkeletalAnimationController] 未指定 SkeletalAnimation 組件，且未拖入任何 Clip 資源
[SkeletalAnimationController] 沒有可用的動畫片段
```

---

## 🐛 故障排除

### 問題 1: Clip 資源無法拖入

**原因：** 
- 拖入的不是 AnimationClip 文件
- 文件類型不支持

**解決方案：**
1. 確認拖入的是 `.anim` 文件
2. 如果是 FBX/GLB，先在 Cocos Creator 中解析為 AnimationClip
3. 嘗試手動選擇資源（點擊選擇框旁的圖標）

### 問題 2: Clip 已拖入但不播放

**原因：**
- Clip 名稱為空
- Clip 資源損壞

**解決方案：**
1. 檢查 Clip 資源是否有效
2. 查看控制台日誌確認加載情況
3. 確認 Skeletal Animation 組件已正確配置

### 問題 3: 只想使用 Skeletal Animation 中的 clips

**解決方案：**
- 將 **Animation Clip Resources** 保持空值
- 確保 Skeletal Animation 已指定
- 控制器會自動使用 SkeletalAnimation.clips

---

## 💡 最佳實踐

### ✅ 推薦做法

1. **使用 Clip 資源拖入模式**
   ```
   優點：
   - 清晰易見（檢查器中直觀顯示）
   - 靈活性強（可選擇任意 Clip）
   - 性能優化（預加載資源）
   ```

2. **組織 Clip 資源**
   ```
   assets/
   ├── models/
   │   ├── Drum_LOW.fbx
   │   └── Drum_LOW@*.anim (所有 Clip)
   ```

3. **命名規範**
   ```
   好: Take_001, Take_002, Idle, Attack
   差: clip1, animation, anim_001
   ```

### ❌ 避免做法

1. **不要混合使用兩種模式**
   ```
   ❌ 既拖入 Clip，又期望用 SkeletalAnimation.clips
   ✅ 選擇其中一種方式
   ```

2. **不要忘記設置控制器**
   ```
   ❌ 只拖入 Clip，但未添加控制器
   ✅ 完整配置所有屬性
   ```

---

## 📊 Clip 資源對比

| 特性 | Clip 拖入模式 | SkeletalAnimation 模式 |
|-----|-------------|-------------------|
| 設置方式 | 拖入 Clip 資源 | 自動從組件讀取 |
| 靈活性 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐ 低 |
| 易用性 | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐ 中等 |
| 性能 | ✅ 優化 | ✅ 正常 |
| 推薦度 | ⭐⭐⭐⭐⭐ 推薦 | ⭐⭐⭐ 備選 |

---

## 📚 相關文檔

- 📄 [SkeletalAnimationController-QuickStart.md](./SkeletalAnimationController-QuickStart.md) - 快速開始
- 📄 [SkeletalAnimationController-Guide.md](./SkeletalAnimationController-Guide.md) - 完整 API 文檔
- 📄 [AnimationControllers-Looping-Fix.md](./AnimationControllers-Looping-Fix.md) - 循環播放說明

---

## 🎬 高級用法

### 動態加載 Clip

```typescript
// 運行時動態加載 Clip
import { resources } from 'cc';

resources.load('animations/Attack.anim', AnimationClip, (err, clip) => {
    if (!err && clip) {
        this.animController.animationClipResources.push(clip);
        console.log('Clip 已動態加載');
    }
});
```

### 管理多個控制器

```typescript
// 同時控制多個 3D 模型動畫
this.controller1.nextClip();
this.controller2.prevClip();

// 同步多個控制器
this.controller1.jumpToClip(0);
this.controller2.jumpToClip(0);
```

---

**版本：** 2.1 (Clip 資源拖入模式)  
**更新日期：** 2025-10-28  
**狀態：** 推薦使用
