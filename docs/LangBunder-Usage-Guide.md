# LangBunder 使用手冊

## 📋 檔案資訊
**檔案名稱**: `LangBunder.ts`  
**檔案位置**: `assets/script/UIController/LangBunder.ts`  
**主要功能**: 多語系資源載入與管理系統  
**更新日期**: 2025-10-13

---

## 🎯 功能概述

`LangBunder` 是一個配置驅動的多語系資源載入器，負責：
- 載入不同語言的圖片、動畫、字體資源
- 動態更新 UI 元件的語系內容
- 管理資源的生命週期和記憶體
- 提供載入進度和錯誤追蹤

---

## 🚀 快速開始

### 1. **基本設置**

在 Cocos Creator 場景中添加 `LangBunder` 組件：

```typescript
// LangBunder 會自動在 start() 時初始化
// 無需手動調用任何方法
```

### 2. **配置檔案位置**

確保配置檔案存在於正確位置：
```
assets/resources/LangBunderConfig.json
```

### 3. **自動執行流程**

組件掛載到節點後會自動：
1. 載入配置檔案
2. 檢測語言參數（從 URL 獲取）
3. 載入對應語言的所有資源
4. 更新所有 UI 元件

---

## 📖 使用方法

### **方法一：作為組件使用（推薦）**

```typescript
// 在 Cocos Creator 編輯器中：
// 1. 選擇需要掛載的節點（通常是 Canvas 或根節點）
// 2. 在屬性檢查器中點擊「添加組件」
// 3. 搜尋並添加 "LangBunder" 組件
// 4. 組件會在場景啟動時自動執行
```

### **方法二：程式碼引用**

如果需要在其他腳本中使用：

```typescript
import { LangBunder } from './UIController/LangBunder';

// 獲取 LangBunder 實例
const langBunder = find("Canvas").getComponent(LangBunder);

// 檢查支援的語言列表
console.log(langBunder.LanguageArray);
```

---

## 🔄 完整執行流程

### **階段一：初始化 (Initialization)**

```
start() 
  ↓
initializeConfig()
  ↓ 
ConfigManager.loadConfig()
  ↓
載入 LangBunderConfig.json
  ↓
解析配置並設定支援的語言列表
```

**涉及檔案**:
- `LangBunderConfig.json` - 配置檔案
- `LangBunderTypes.ts` - 類型定義

**關鍵程式碼**:
```typescript
async start() {
    await this.initializeConfig();      // 載入配置
    this.initializeGlobalReferences();  // 初始化全域參考
    this.setupLanguage();               // 設定語言
}
```

---

### **階段二：語言設定 (Language Setup)**

```
setupLanguage()
  ↓
從 URL 獲取語言參數 (lang)
  ↓
檢查語言是否在支援列表中
  ↓
設定當前語言到 ResourceManager
  ↓
呼叫 LoadLangRes()
```

**URL 參數格式**:
```
https://game.example.com/?lang=sch
https://game.example.com/?lang=eng
```

**支援的語言代碼**:
```json
["eng", "esp", "ind", "jp", "kor", "mys", "por", "ru", 
 "sch", "tai", "tch", "vie", "tur", "xeng"]
```

---

### **階段三：資源載入 (Resource Loading)**

```
LoadLangRes()
  ↓
載入 language Bundle
  ↓
解析配置中的資源分類
  ├── animations (動畫資源)
  ├── sprites (圖片資源)
  └── fonts (字體資源)
  ↓
為每個資源類別創建載入任務
  ↓
並行執行所有載入任務
  ↓
loadResourceCategory() (通用載入器)
```

**載入任務分類**:
```typescript
// 動畫資源
- BigWin 動畫
- FeatureBuy 動畫
- 5Kind 動畫

// 圖片資源
- Banner 圖片
- FeatureBuy 圖片
- FreeSpin 圖片
- UI Common 圖片
- UI Main 圖片
- UCoin 圖片

// 字體資源
- 數字字體
```

---

### **階段四：資源處理 (Resource Processing)**

```
loadResourceCategory()
  ↓
bundle.loadDir() 載入資源目錄
  ↓
儲存資源到 ResourceManager
  ↓
updateTargetComponents() 更新 UI 元件
  ↓
executePostActions() 執行後處理動作
  ↓
executeCustomHandler() 執行自定義處理器
```

**UI 元件更新流程**:
```
updateTargetComponents()
  ↓
遍歷配置中的目標列表
  ↓
根據組件類型分派更新
  ├── Sprite → updateSpriteComponent()
  ├── Button → updateButtonComponent()
  ├── Label → updateLabelComponent()
  └── Spine → updateSpineComponent()
```

---

### **階段五：完成處理 (Completion)**

```
waitForAllLoading()
  ↓
Promise.all() 等待所有任務完成
  ↓
更新載入統計資訊
  ↓
設定 yieldLoad = true
  ↓
handlePostLoadingTasks()
  ↓
檢查 yieldCount 狀態
  ↓
恢復遊戲狀態 (如果需要)
```

---

## 📝 配置檔案使用

### **配置檔案結構**

```json
{
  "languages": ["eng", "sch", "tch", ...],
  "resourceCategories": {
    "animations": {
      "bigwin": {
        "path": "anm/bigwin",
        "type": "sp.SkeletonData",
        "prefix": "AnmBigWin",
        "targets": [
          "Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinSlogan"
        ]
      }
    },
    "sprites": {
      "banner": {
        "path": "pic/banner",
        "type": "SpriteFrame",
        "prefix": "Banner",
        "targets": [
          "Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBgCover/BannerText"
        ],
        "customHandler": "updateBannerData"
      }
    },
    "fonts": {
      "numbers": {
        "path": "num",
        "type": "LabelAtlas",
        "prefix": "Num",
        "targets": [
          {
            "path": "Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinText",
            "componentType": "Label"
          }
        ]
      }
    }
  }
}
```

### **配置欄位說明**

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `path` | string | ✅ | 資源在 language bundle 中的相對路徑 |
| `type` | string | ✅ | 資源類型：`SpriteFrame`, `sp.SkeletonData`, `LabelAtlas` |
| `prefix` | string | ✅ | 資源存儲的前綴，用於在 ResourceManager 中識別 |
| `targets` | array | ✅ | 需要更新的 UI 元件節點路徑列表 |
| `postActions` | array | ❌ | 載入後執行的動作（如設定動畫） |
| `customHandler` | string | ❌ | 自定義處理器名稱（特殊邏輯處理） |

---

## 🎨 新增資源類型

### **步驟一：修改配置檔案**

在 `LangBunderConfig.json` 中添加新的資源類別：

```json
{
  "resourceCategories": {
    "sprites": {
      "newResource": {
        "path": "pic/newResource",
        "type": "SpriteFrame",
        "prefix": "NewRes",
        "targets": [
          "Canvas/NewNode/Sprite"
        ]
      }
    }
  }
}
```

### **步驟二：準備資源檔案**

確保資源存在於 language bundle 中：
```
assets/language/
  ├── eng/
  │   └── pic/
  │       └── newResource/
  │           ├── image1.png
  │           └── image2.png
  ├── sch/
  │   └── pic/
  │       └── newResource/
  │           ├── image1.png
  │           └── image2.png
  └── ...其他語言
```

### **完成！**

不需要修改任何程式碼，系統會自動載入新資源！

---

## 🔧 進階功能

### **1. 後處理動作 (Post Actions)**

用於資源載入後執行特定操作：

```json
{
  "postActions": [
    {
      "type": "setAnimation",
      "target": "Canvas/BaseGame/UI/AnimNode",
      "params": [0, "idle", true]
    },
    {
      "type": "setActive",
      "target": "Canvas/BaseGame/UI/SomeNode",
      "params": [true]
    }
  ]
}
```

**支援的動作類型**:
- `setAnimation`: 設定 Spine 動畫
- `setActive`: 設定節點啟用狀態

---

### **2. 自定義處理器 (Custom Handlers)**

用於特殊的業務邏輯處理：

```json
{
  "customHandler": "updateBannerData"
}
```

**內建處理器**:
- `updateBannerData`: 更新橫幅資料的特殊邏輯

**添加新處理器**:

在 `LangBunder.ts` 的 `executeCustomHandler()` 方法中添加：

```typescript
private executeCustomHandler(handlerName: string, categoryConfig: ResourceCategoryConfig): void {
    switch (handlerName) {
        case 'updateBannerData':
            this.handleBannerDataUpdate(categoryConfig);
            break;
        case 'yourNewHandler':  // 新增處理器
            this.handleYourNewLogic(categoryConfig);
            break;
        default:
            console.warn(`未知的自定義處理器: ${handlerName}`);
    }
}

private handleYourNewLogic(categoryConfig: ResourceCategoryConfig): void {
    // 實作您的自定義邏輯
}
```

---

### **3. 複雜目標配置**

支援不同組件類型的精確配置：

```json
{
  "targets": [
    "Canvas/Simple/Path",  // 簡單路徑，預設為 Sprite
    {
      "path": "Canvas/Complex/Path",
      "componentType": "Button"  // 明確指定組件類型
    },
    {
      "path": "Canvas/Another/Path",
      "componentType": "Label"
    }
  ]
}
```

**支援的組件類型**:
- `Sprite`: 圖片組件
- `Button`: 按鈕組件
- `Label`: 文字組件
- `Spine`: Spine 動畫組件

---

## 📊 載入統計與監控

### **載入統計資訊**

系統會自動追蹤載入統計：

```typescript
interface LoaderStats {
    totalTasks: number;        // 總任務數
    completedTasks: number;    // 已完成任務數
    failedTasks: number;       // 失敗任務數
    startTime: number;         // 開始時間
    endTime?: number;          // 結束時間
}
```

### **查看載入日誌**

載入過程中會輸出詳細日誌：

```
配置檔案載入成功
配置初始化完成，支援語言: [...]
開始載入 10 個資源類別
animations 資源載入完成: anm/bigwin
sprites 資源載入完成: pic/banner
...
所有語言資源載入完成! 統計: 總計 10, 成功 10, 失敗 0, 耗時 1234ms
```

---

## ⚠️ 錯誤處理

### **配置載入失敗**

如果配置檔案載入失敗，系統會：
1. 輸出錯誤日誌
2. 使用預設配置繼續運行
3. 支援 14 種語言的基本載入

### **資源載入失敗**

單個資源載入失敗時：
1. 記錄到失敗統計中
2. 輸出詳細錯誤訊息
3. 繼續載入其他資源
4. 不會中斷整體流程

### **節點找不到**

如果配置中的目標節點不存在：
1. 輸出警告訊息
2. 跳過該節點的更新
3. 繼續處理其他節點

---

## 🔍 除錯技巧

### **1. 檢查配置是否載入**

在瀏覽器控制台查看日誌：
```
配置檔案載入成功
配置初始化完成，支援語言: [...]
```

### **2. 檢查語言參數**

確認 URL 中的語言參數：
```javascript
// 在瀏覽器控制台執行
console.log(new URLSearchParams(window.location.search).get('lang'));
```

### **3. 檢查資源路徑**

確認資源是否存在於正確位置：
```
assets/language/[語言代碼]/[配置中的path]
```

### **4. 查看載入統計**

在載入完成後的日誌中查看統計資訊：
```
所有語言資源載入完成! 統計: 總計 10, 成功 9, 失敗 1, 耗時 1234ms
```

---

## 🎯 最佳實踐

### **1. 配置組織**

建議按功能分類資源：
```json
{
  "resourceCategories": {
    "animations": { /* 所有動畫 */ },
    "sprites": { 
      "ui": { /* UI圖片 */ },
      "game": { /* 遊戲內圖片 */ }
    }
  }
}
```

### **2. 命名規範**

- **prefix**: 使用大駝峰命名，如 `AnmBigWin`, `UIMain`
- **path**: 使用小寫和斜線，如 `anm/bigwin`, `pic/banner`
- **targets**: 使用完整的節點路徑

### **3. 效能考量**

- 資源會並行載入，不需要手動優化順序
- 使用節點快取避免重複查找
- 資源管理器會自動清理舊語言資源

### **4. 維護建議**

- 定期檢查配置檔案格式
- 確保所有語言的資源檔案同步
- 使用版本控制追蹤配置變更

---

## 📚 相關文件

- **類型定義**: `LangBunderTypes.ts`
- **配置檔案**: `LangBunderConfig.json`
- **分析報告**: `docs/LangBunder-Analysis.md`
- **重構報告**: `docs/LangBunder-Refactor-Report.md`
- **配置重構**: `docs/LangBunder-Config-Refactor.md`

---

## 🆘 常見問題

### **Q: 如何新增一種語言？**

A: 在配置檔案的 `languages` 陣列中添加語言代碼，並準備對應的資源檔案。

### **Q: 如何修改載入的資源？**

A: 直接修改 `LangBunderConfig.json` 配置檔案，不需要改動程式碼。

### **Q: 載入失敗怎麼辦？**

A: 檢查：
1. 配置檔案格式是否正確
2. 資源檔案是否存在
3. 節點路徑是否正確
4. 瀏覽器控制台的錯誤訊息

### **Q: 如何測試不同語言？**

A: 在 URL 中添加或修改 `lang` 參數：
```
?lang=eng  // 英文
?lang=sch  // 簡體中文
?lang=tch  // 繁體中文
```

### **Q: 可以動態切換語言嗎？**

A: 目前的設計是在遊戲啟動時載入語言。如需動態切換，需要：
1. 清理當前資源
2. 更新語言參數
3. 重新呼叫 `LoadLangRes()`

---

## 📞 技術支援

如遇到問題，請檢查：
1. 瀏覽器控制台的錯誤訊息
2. 載入統計資訊
3. 配置檔案格式
4. 資源檔案是否完整

**文件版本**: v2.0  
**最後更新**: 2025-10-13