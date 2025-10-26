# UIController 編輯器節點連結指南

## 📋 概述
UIController 組件中有 10 個 @property 屬性可在 Cocos Creator 編輯器中設定，無需依賴 find() 查詢。

## 🎯 需要連結的節點列表

| # | 屬性名稱 | 類型 | 場景中對應的節點 | 場景路徑 | 優先級 |
|---|---------|------|------------------|---------|--------|
| 1 | `messageConsoleNode` | Node | **MessageController** | Scene → MessageController | ⭐⭐⭐ 必須 |
| 2 | `betBtnNode` | Node | **BtnBet** | Canvas → BaseGame → BtnBet | ⭐⭐⭐ 必須 |
| 3 | `winBtnNode` | Node | **WinBtn** | Canvas → BaseGame → WinBtn | ⭐⭐⭐ 必須 |
| 4 | `creditNodeRef` | Node | **Credit** | Canvas → BaseGame → Credit | ⭐⭐ 重要 |
| 5 | `creditCurrencyNode` | Node | **CreditCurrency** | Canvas → BaseGame → CreditCurrency | ⭐⭐ 重要 |
| 6 | `autoBtnNode` | Node | **AutoButton** | Canvas → BaseGame → AutoButton | ⭐⭐ 重要 |
| 7 | `settingsPageNode` | Node | **SettingsPage** | Canvas → BaseGame → SettingsPage | ⭐⭐ 重要 |
| 8 | `settingsPage2Node` | Node | **SettingsPage2** | Canvas → BaseGame → SettingsPage2 | ⭐⭐ 重要 |
| 9 | `infoControllerNode` | Node | **InfoController** | Canvas → BaseGame → InfoController | ⭐ 可選 |

## 📐 其他已配置的屬性

| 屬性名稱 | 類型 | 用途 | 備註 |
|---------|------|------|------|
| `Tubro_act` | SpriteFrame | 加速按鈕 - 啟用圖片 | 需要拖放SpriteFrame資源 |
| `Tubro_off` | SpriteFrame | 加速按鈕 - 停用圖片 | 需要拖放SpriteFrame資源 |
| `BetAdd_act` | SpriteFrame | 下注增加 - 啟用圖片 | 需要拖放SpriteFrame資源 |
| `BetAdd_off` | SpriteFrame | 下注增加 - 停用圖片 | 需要拖放SpriteFrame資源 |
| `BetLess_act` | SpriteFrame | 下注減少 - 啟用圖片 | 需要拖放SpriteFrame資源 |
| `BetLess_off` | SpriteFrame | 下注減少 - 停用圖片 | 需要拖放SpriteFrame資源 |
| `Voice_act` | SpriteFrame | 音效按鈕 - 啟用圖片 | 需要拖放SpriteFrame資源 |
| `Voice_off` | SpriteFrame | 音效按鈕 - 停用圖片 | 需要拖放SpriteFrame資源 |
| `HelpPages` | SpriteFrame[] | 說明頁面圖片陣列 | 需要拖放多個SpriteFrame資源 |
| `TriggerInfo` | SpriteFrame[] | 觸發資訊圖片陣列 | 需要拖放多個SpriteFrame資源 |
| `featureBuyButton` | Node | 特殊功能購買按鈕 | Canvas → BaseGame → FeatureBuyButton |
| `AutoPages` | AutoPages | 自動遊戲頁面控制器 | 需要在場景中找到 AutoPages 組件 |

## 🔧 在 Cocos Creator 中設定步驟

### 1. 打開場景
- 打開 `game169/assets/scene/main.scene`

### 2. 選擇 UI 節點
- 在 Hierarchy 面板中找到 Canvas → BaseGame → UI
- 選擇附帶 UIController 組件的節點

### 3. 在 Inspector 面板中設定

#### 第一優先級（必須設定）✅
1. **messageConsoleNode**
   - 從 Hierarchy 拖 `MessageController` 到此欄位
   - 或在場景路徑找: Scene 根目錄 → MessageController

2. **betBtnNode**
   - 從 Hierarchy 拖 `Canvas → BaseGame → BtnBet` 到此欄位

3. **winBtnNode**
   - 從 Hierarchy 拖 `Canvas → BaseGame → WinBtn` 到此欄位

#### 第二優先級（強烈建議設定）⚡
4. **creditNodeRef**
   - 從 Hierarchy 拖 `Canvas → BaseGame → Credit` 到此欄位

5. **creditCurrencyNode**
   - 從 Hierarchy 拖 `Canvas → BaseGame → CreditCurrency` 到此欄位

6. **autoBtnNode**
   - 從 Hierarchy 拖 `Canvas → BaseGame → AutoButton` 到此欄位

7. **settingsPageNode**
   - 從 Hierarchy 拖 `Canvas → BaseGame → SettingsPage` 到此欄位

8. **settingsPage2Node**
   - 從 Hierarchy 拖 `Canvas → BaseGame → SettingsPage2` 到此欄位

#### 第三優先級（可選）📌
9. **infoControllerNode**
   - 從 Hierarchy 拖 `Canvas → BaseGame → InfoController` 到此欄位

## ✨ 好處說明

### ✅ 性能提升
- **避免運行時查詢**：不需要在遊戲運行時使用 find() 查詢節點
- **更快的初始化**：節點直接指派，無需搜尋

### ✅ 可維護性
- **一目瞭然**：Inspector 中清楚看到所有綁定的節點
- **容易調試**：可以快速檢查節點是否正確綁定
- **易於修改**：場景更新時只需拖放新節點，無需修改代碼

### ✅ 向後相容
- **自動 Fallback**：若編輯器中未設定，代碼仍會自動使用 find() 查詢
- **零風險升級**：現有場景仍可正常運行

## 📝 場景結構參考

```
Scene (main.scene)
├── Canvas
│   └── BaseGame
│       ├── BtnBet              ← betBtnNode
│       ├── WinBtn              ← winBtnNode
│       ├── Credit              ← creditNodeRef
│       ├── CreditCurrency      ← creditCurrencyNode
│       ├── AutoButton          ← autoBtnNode
│       ├── SettingsPage        ← settingsPageNode
│       ├── SettingsPage2       ← settingsPage2Node
│       ├── InfoController      ← infoControllerNode
│       └── FeatureBuyButton    ← featureBuyButton
├── MessageController           ← messageConsoleNode
└── [其他節點...]
```

## 🎓 提示

- 可以使用 **拖放** 方式快速連結節點
- 編輯器會自動驗證節點類型是否正確
- 若某些屬性保持未設定 (null)，代碼會自動使用 find() 查詢
- 建議完成這個連結過程以獲得最佳性能

## 🐛 調試

若在遊戲運行時出現"找不到節點"錯誤：

1. **檢查編輯器設定**
   - 確認是否在 Inspector 中正確設定了 @property 屬性
   - 確認拖放的節點是否正確

2. **檢查場景結構**
   - 確認場景中存在所需的節點
   - 確認節點名稱是否匹配

3. **查看控制台日誌**
   - 代碼會輸出詳細的調試信息
   - 搜尋 `[UIController]` 標籤查看初始化過程

---

**Last Updated**: 2025-10-26  
**Version**: 1.0  
**Status**: ✅ Ready for Implementation
