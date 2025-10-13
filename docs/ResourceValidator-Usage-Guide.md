# 資源驗證工具使用指南

**工具名稱**: ResourceValidator  
**檔案位置**: `assets/script/Tools/ResourceValidator.ts`  
**用途**: 自動檢測並修復場景中缺少的資源

---

## 📖 功能說明

ResourceValidator 是一個強大的資源檢測工具，可以：

- ✅ 自動掃描場景中所有節點
- ✅ 檢測缺少的 Sprite、Button、Spine 資源
- ✅ 找出未知或損壞的組件
- ✅ 自動修復缺少的資源（可選）
- ✅ 生成詳細的檢測報告
- ✅ 支援定期檢測

---

## 🚀 快速開始

### 步驟 1: 掛載組件

1. 在 Cocos Creator 中開啟 `main.scene`
2. 選擇 `Canvas` 節點
3. 點擊「添加組件」→「自定義組件」→「ResourceValidator」

### 步驟 2: 設置預設資源

在屬性面板中設置以下資源（用於自動修復）：

| 屬性 | 說明 | 是否必填 |
|------|------|---------|
| Default Sprite Frame | 預設圖片 | 可選 |
| Default Button Normal | 預設按鈕一般狀態圖片 | 可選 |
| Default Button Pressed | 預設按鈕按下狀態圖片 | 可選 |
| Default Button Hover | 預設按鈕懸停狀態圖片 | 可選 |

### 步驟 3: 配置選項

| 選項 | 說明 | 預設值 |
|------|------|--------|
| 自動修復 | 是否自動修復缺少的資源 | false |
| 詳細日誌 | 是否輸出詳細的檢測日誌 | true |
| 檢測間隔 | 定期檢測的時間間隔（秒），0 表示只在啟動時檢測一次 | 0 |

### 步驟 4: 執行檢測

1. 儲存場景
2. 點擊「執行」按鈕
3. 查看 Console 輸出的檢測報告

---

## 📋 檢測報告範例

```
============================================================
📋 資源驗證報告
============================================================

📊 統計資訊:
   缺少資源: 6 個
   已修復資源: 0 個
   未知組件: 1 個

❌ 缺少的資源詳情:

   【Sprite.spriteFrame】- 1 個:
      • Canvas/BaseGame/Page/miniSpinNode/miniSpinShow

   【Button.normalSprite】- 3 個:
      • Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage1/BuyBtn100
      • Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage1/BuyBtn80
      • Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage1/BuyBtn60

   【Spine.animation(<None>)】- 2 個:
      • Canvas/BaseGame/Layer/Shake/Animation/BonusController
      • Canvas/BaseGame/Layer/Shake/Animation/WildController

⚠️  未知組件詳情:
   • Unknown Component (null) at Canvas/BaseGame/Page/TestNode

============================================================
報告結束
============================================================
```

---

## 🔧 使用場景

### 場景 1: 快速診斷問題

當遊戲出現資源遺失錯誤時：

1. 將 `autoFix` 設為 `false`
2. 將 `verboseLog` 設為 `true`
3. 執行遊戲，查看完整的錯誤報告

### 場景 2: 自動修復資源

當需要快速修復缺少的資源時：

1. 設置好所有預設資源
2. 將 `autoFix` 設為 `true`
3. 執行遊戲，工具會自動修復並記錄

### 場景 3: 定期監控

在開發過程中持續監控資源狀態：

1. 將 `checkInterval` 設為 `60`（每 60 秒檢測一次）
2. 將 `verboseLog` 設為 `false`（減少日誌輸出）
3. 背景運行，有問題時會自動提醒

---

## 💻 程式化使用

### 方法 1: 從其他腳本觸發檢測

```typescript
import { ResourceValidator } from './Tools/ResourceValidator';

// 取得 ResourceValidator 組件
const canvas = find("Canvas");
const validator = canvas?.getComponent(ResourceValidator);

if (validator) {
    // 手動觸發檢測
    validator.validate();
    
    // 取得統計資訊
    const missingCount = validator.getMissingCount();
    const fixedCount = validator.getFixedCount();
    
    console.log(`缺少: ${missingCount}, 已修復: ${fixedCount}`);
}
```

### 方法 2: 在載入完成後自動檢測

```typescript
// 在 LoadingScene 或 GameController 中
start() {
    this.scheduleOnce(() => {
        const canvas = find("Canvas");
        const validator = canvas?.getComponent(ResourceValidator);
        if (validator) {
            validator.validate();
        }
    }, 2); // 延遲 2 秒，確保所有資源載入完成
}
```

---

## 🎯 針對當前問題的修復步驟

### 問題 1: 缺少 UUID 資源

**受影響節點**:
- `Canvas/BaseGame/Page/miniSpinNode/miniSpinShow`
- `Canvas/BaseGame/Page/miniSpinNode/miniSpinBg/miniSpinNotice`
- `Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage1/BuyBtn*`

**修復步驟**:

1. **找到原始圖片資源**
   ```bash
   # 搜尋可能的圖片檔案
   Get-ChildItem -Path assets\res -Recurse -Include *.png,*.jpg | Where-Object { $_.Name -like "*spin*" -or $_.Name -like "*buy*" }
   ```

2. **在 Cocos Creator 中重新指定**
   - 開啟 `main.scene`
   - 選擇受影響的節點
   - 在屬性面板中重新拖入正確的 SpriteFrame

3. **或使用 ResourceValidator 自動修復**
   - 設置一個預設圖片
   - 啟用自動修復
   - 執行遊戲

### 問題 2: 未知組件 `ea630dZsN1HeYme0pj/1VW9`

**修復步驟**:

1. **搜尋組件檔案**
   ```bash
   cd c:\projects\game152Dev\assets\script
   Get-ChildItem -Recurse -Filter "*.ts" | Select-String "@ccclass"
   ```

2. **檢查場景檔案**
   - 開啟 `main.scene`
   - 搜尋節點中是否有「Missing Script」或紅色感嘆號
   - 移除損壞的組件

3. **或使用工具檢測**
   - 執行 ResourceValidator
   - 查看「未知組件詳情」部分
   - 找到並修復對應節點

### 問題 3: Spine 動畫 `<None>`

**修復步驟**:

1. **使用 ResourceValidator 自動修復**
   - 啟用自動修復
   - 工具會自動設置為第一個可用動畫

2. **手動修復**
   - 選擇受影響的 Spine 節點
   - 在 Animation 屬性中選擇正確的動畫
   - 或清空動畫名稱

---

## 📊 效能考量

### 記憶體使用

- 每次檢測會遍歷整個場景樹
- 建議不要設置過短的檢測間隔（< 10 秒）
- 檢測完成後會自動釋放臨時資料

### 執行時間

- 一般場景（< 500 個節點）: ~50ms
- 複雜場景（500-1000 個節點）: ~100-200ms
- 超大場景（> 1000 個節點）: ~300-500ms

### 最佳實踐

- ✅ 只在開發階段啟用
- ✅ 發布版本前移除此組件
- ✅ 使用 `checkInterval = 0`（只檢測一次）
- ✅ 問題修復後關閉 `verboseLog`

---

## 🐛 疑難排解

### Q: 工具沒有輸出報告

**A**: 檢查以下項目：
- 組件是否正確掛載到 Canvas
- Console 是否已開啟
- 是否有編譯錯誤

### Q: 自動修復沒有作用

**A**: 確認：
- `autoFix` 是否設為 `true`
- 是否已設置對應的預設資源
- 預設資源是否有效

### Q: 檢測速度太慢

**A**: 優化方法：
- 減少檢測間隔
- 關閉 `verboseLog`
- 只在需要時手動觸發檢測

---

## 🔄 版本歷史

| 版本 | 日期 | 變更內容 |
|------|------|---------|
| 1.0 | 2025-10-13 | 初始版本，支援基本檢測與修復 |

---

## 📞 技術支援

如有問題，請參考：
- [資源遺失修復指南](./Resource-Missing-Fix-Guide.md)
- [ReelController 重構報告](./ReelController-Refactor-Phase1-Report.md)

---

**最後更新**: 2025-10-13  
**維護者**: Development Team
