# 自動查找 Label 功能說明

## 📋 功能概述

動畫控制器現已支持 **自動查找 Label 組件** 功能，無需在檢查器中手動拖入 Label 節點！

### 工作原理

控制器會在 `onLoad()` 時自動遞迴查找 SkeletalAnimation/Animation 節點及其子節點中的 Label 組件。

---

## 🎯 2D 動畫控制器 (AnimationClipController)

### 自動查找規則

| 查找對象 | 匹配關鍵字 | 說明 |
|---------|----------|------|
| `labelClipName` | `name`, `clipname`, `animation` | 顯示動畫名稱 |
| `labelClipIndex` | `index`, `progress` | 顯示動畫索引 |

### 推薦的節點結構

```
Canvas (場景根)
├── Sprite (2D 動畫)
│   ├── AnimationController (控制器)
│   └── UIPanel
│       ├── Label_ClipName ✓ (自動查找)
│       └── Label_ClipIndex ✓ (自動查找)
└── Buttons
    ├── BtnNext
    └── BtnPrev
```

### 配置示例

**檢查器設置：**
```
Animation Component → [Sprite]
Btn Next           → [BtnNext]
Btn Prev           → [BtnPrev]
Auto Find Labels   → ✅ 勾選
```

**結果：** Label 自動查找到並更新 ✓

---

## 🎮 3D 動畫控制器 (SkeletalAnimationController)

### 自動查找規則

| 查找對象 | 匹配關鍵字 | 說明 |
|---------|----------|------|
| `labelClipName` | `name`, `clipname`, `animation` | 顯示動畫名稱 |
| `labelClipIndex` | `index`, `progress` | 顯示動畫索引 |
| `labelClipDuration` | `duration`, `time` | 顯示動畫時長 |

### 推薦的節點結構

```
Drum_LOW (3D 模型)
├── SkeletalAnimation
├── Canvas (UI 容器)
│   ├── Label_ClipName ✓ (自動查找)
│   ├── Label_ClipIndex ✓ (自動查找)
│   └── Label_Duration ✓ (自動查找)
└── AnimationController
    └── SkeletalAnimationController (控制器)
```

### 配置示例

**檢查器設置：**
```
Skeletal Animation  → [Drum_LOW]
Btn Next           → [BtnNext]
Btn Prev           → [BtnPrev]
Auto Find Labels   → ✅ 勾選
```

**結果：** 所有 Label 自動查找到並更新 ✓

---

## 🔧 自動查找查詢機制

### 遞迴查詢流程

```typescript
// 查找流程示意
檢查當前節點名稱
  ↓
是否包含目標關鍵字？
  ├─ 是 → 查找 Label 組件 → 找到？返回 ✓
  └─ 否 → 檢查子節點（遞迴）
    ↓
子節點名稱包含關鍵字？
  ├─ 是 → 返回 ✓
  └─ 否 → 繼續遞迴...
```

### 匹配算法

- ✅ **大小寫不敏感** - `ClipName`, `clipName`, `CLIPNAME` 都能匹配
- ✅ **子字符串匹配** - `Label_ClipName` 包含 `clipname` 時匹配
- ✅ **優先級順序** - 按定義的順序查找，找到第一個即停止
- ✅ **跳過已指定** - 如果檢查器已手動指定，則跳過自動查找

---

## 🚀 使用流程

### 流程圖

```
1. 添加控制器組件
           ↓
2. 檢查器中設置動畫組件和按鈕
           ↓
3. 運行場景 (onLoad 觸發)
           ↓
4. 控制器自動查找 Label
           ↓
5. Label 自動更新 ✓
```

### 快速步驟 (3 步)

#### 步驟 1: 添加控制器
```
新建空節點 → 添加 SkeletalAnimationController.ts 組件
```

#### 步驟 2: 配置必要屬性
```
Skeletal Animation → 拖入 3D 模型
Btn Next          → 拖入下一個按鈕
Btn Prev          → 拖入上一個按鈕
Auto Find Labels  → ✅ 勾選
```

#### 步驟 3: 準備 Label 節點
```
在 3D 模型節點下創建 UI 節點 (或作為子節點)
⚠️ 重要: 按照節點命名規則，節點名稱要包含關鍵字
例: "Label_ClipName", "LabelIndex", "DurationTime"
```

---

## ✅ 驗證自動查找是否成功

### 方法 1: 檢查控制台日誌

運行場景後查看控制台，應該看到類似輸出：

**成功查找：**
```
[SkeletalAnimationController] 自動查找到 Label - ClipName: Label_ClipName
[SkeletalAnimationController] 自動查找到 Label - ClipIndex: Label_ClipIndex
[SkeletalAnimationController] 自動查找到 Label - ClipDuration: Label_Duration
[SkeletalAnimationController] 自動查找標籤完成 - Name: ✓, Index: ✓, Duration: ✓
```

**未找到：**
```
[SkeletalAnimationController] 自動查找標籤完成 - Name: ✗, Index: ✗, Duration: ✗
```

### 方法 2: 檢查檢查器

運行場景後，檢查器中應該看到 Label 字段被自動填充：

```
Label Clip Name     → Label_ClipName (自動填充) ✓
Label Clip Index    → Label_ClipIndex (自動填充) ✓
Label Clip Duration → Label_Duration (自動填充) ✓
```

### 方法 3: 觀察 UI 更新

- ✓ 點擊按鈕切換動畫
- ✓ Label 自動顯示當前動畫名稱
- ✓ Label 自動顯示進度 (如 "1 / 9")
- ✓ Label 自動顯示時長 (如 "2.50s")

---

## 🐛 故障排除

### 問題 1: Label 仍未被查找到

**原因：** 節點名稱不包含關鍵字

**解決方案：**
1. 檢查節點名稱是否包含匹配關鍵字
2. 推薦命名格式：
   - `Label_ClipName` 或 `TextClipName` (包含 name)
   - `Label_ClipIndex` 或 `TextProgress` (包含 index/progress)
   - `Label_Duration` 或 `TextTime` (包含 duration/time)

3. 手動在檢查器中拖入 Label（備選方案）

### 問題 2: 自動查找失敗但有手動指定

**預期行為：** 控制器優先使用手動指定的 Label

**驗證：** 控制台應顯示
```
[SkeletalAnimationController] 標籤已手動指定，跳過自動查找
```

### 問題 3: 性能問題（場景有很多子節點）

**解決方案：**
1. 確保 Label 節點靠近 SkeletalAnimation 節點（減少遞迴深度）
2. 手動指定 Label 而不使用自動查找
3. 禁用 `Auto Find Labels` 選項

**禁用自動查找：**
```typescript
// 代碼中禁用
animController.autoFindLabels = false;
```

---

## 💡 最佳實踐

### ✅ 推薦做法

1. **使用描述性名稱**
   ```
   好: Label_AnimationName, Label_ClipIndex, Label_Duration
   差: Text1, Text2, Text3
   ```

2. **集中 UI 結構**
   ```
   ✓ 3D模型
     ├─ UI面板
     │  ├─ Label_ClipName
     │  └─ Label_ClipIndex
   ```

3. **保持層級淺**
   ```
   ✓ 3D模型 (1級)
     └─ UIPanel (2級)
        └─ Label_ClipName (3級) ✓
   
   ✗ 3D模型 (太深的層級會影響查找性能)
     └─ Panel1
        └─ Panel2
           └─ SubPanel
              └─ Label
   ```

### ❌ 避免做法

1. **不要使用無關的名稱**
   ```
   ❌ Label, Text, TextItem (無關鍵字)
   ✅ Label_ClipName (包含關鍵字)
   ```

2. **不要把 Label 放得太深**
   ```
   ❌ 3D模型 > UI > Panel > SubPanel > SubSubPanel > Label
   ✅ 3D模型 > UIPanel > Label
   ```

3. **不要忘記啟用 Auto Find Labels**
   ```
   ❌ Auto Find Labels: 不勾選 (不會自動查找)
   ✅ Auto Find Labels: ✅ 勾選
   ```

---

## 📖 相關文檔

- 📄 [AnimationClipController-QuickStart.md](./AnimationClipController-QuickStart.md)
- 📄 [SkeletalAnimationController-QuickStart.md](./SkeletalAnimationController-QuickStart.md)
- 📄 [AnimationClipController-Guide.md](./AnimationClipController-Guide.md)
- 📄 [SkeletalAnimationController-Guide.md](./SkeletalAnimationController-Guide.md)
- 📄 [AnimationControllers-Looping-Fix.md](./AnimationControllers-Looping-Fix.md)

---

## 🎬 代碼示例

### 禁用和啟用自動查找

```typescript
// 禁用自動查找（使用手動配置）
animController.autoFindLabels = false;
animController.labelClipName = customLabel1;
animController.labelClipIndex = customLabel2;

// 啟用自動查找
animController.autoFindLabels = true;
// 重新加載場景或調用初始化方法
```

### 在代碼中驗證 Label

```typescript
onLoad() {
    // 等待自動查找完成
    this.scheduleOnce(() => {
        if (this.animController.labelClipName) {
            console.log('Label 查找成功！');
        } else {
            console.warn('Label 查找失敗，請手動配置');
        }
    }, 0.1);
}
```

---

## 📊 技術細節

### 自動查找算法時間複雜度

| 場景 | 節點數 | 查找時間 | 說明 |
|-----|-------|--------|------|
| 小場景 | < 50 | < 1ms | 推薦深度 |
| 中等場景 | 50-500 | 1-5ms | 正常 |
| 大場景 | > 500 | > 5ms | 考慮禁用自動查找 |

### 性能優化建議

1. **保持層級淺** - 最多 3-4 層子節點
2. **命名簡潔** - 避免過長的節點名稱
3. **靠近目標** - Label 放在 SkeletalAnimation 節點附近
4. **必要時禁用** - 大型場景可禁用此功能

---

**版本：** 2.0 (自動查找功能)  
**更新日期：** 2025-10-28
