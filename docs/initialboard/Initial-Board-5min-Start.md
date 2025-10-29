# 🚀 初始盤面 - 5分鐘快速開始

## 最簡單的方式：編輯器配置

### 步驟 1：創建節點（30 秒）

在 Cocos Creator 中：

```
Hierarchy 視圖
└── Canvas
    └── [右鍵] → Create Empty Node
        └── 命名: InitialBoardConfig
```

### 步驟 2：添加組件（30 秒）

```
1. 選中 InitialBoardConfig 節點
2. Inspector → Add Component
3. 搜索: InitialBoardConfig
4. 點擊添加
```

### 步驟 3：配置盤面（2 分鐘）

在 Inspector 面板中設定：

```
┌───────────────────────────────────┐
│ InitialBoardConfig                │
├───────────────────────────────────┤
│ ▼ Data Source                     │
│   └─ EDITOR_CONFIG (選這個)       │
│                                   │
│ ✓ Auto Apply On Start             │
│ □ Only In Local Mode              │
│                                   │
│ ▼ 盤面配置                        │
│   Reel 1: [8, 2, 7]               │
│   Reel 2: [3, 7, 2]               │
│   Reel 3: [4, 6, 5]               │
│   Reel 4: [1, 6, 9]               │
│   Reel 5: [8, 2, 8]               │
│                                   │
│   Player Balance: 1000000         │
│   Description: "測試盤面"         │
│                                   │
│ ✓ Verbose                         │
└───────────────────────────────────┘
```

### 步驟 4：運行遊戲（1 分鐘）

```
1. 保存場景 (Ctrl+S)
2. 點擊預覽按鈕
3. 等待遊戲載入
4. 查看初始盤面 ✅
```

---

## 完成！🎉

你的遊戲現在會在啟動時顯示你設定的初始盤面。

---

## 符號 ID 速查表

| ID | 符號 | 類型 |
|----|------|------|
| 1 | 🥁 鼓 | Scatter |
| 2 | 🧧 紅包 | 高價值 |
| 3 | 💰 金元寶 | 高價值 |
| 4 | 🪙 銅錢 | 中價值 |
| 5 | 🪭 扇子 | 中價值 |
| 6 | 🅰️ A | 低價值 |
| 7 | 🅺 K | 低價值 |
| 8 | 🅾️ Q | 低價值 |
| 9 | 🅹 J | 低價值 |

---

## 常用盤面範例

### 乾淨盤面（預設）
```
Reel 1: [8, 2, 7]  # Q, 紅包, K
Reel 2: [3, 7, 2]  # 金元寶, K, 紅包
Reel 3: [4, 6, 5]  # 銅錢, A, 扇子
Reel 4: [1, 6, 9]  # 鼓, A, J
Reel 5: [8, 2, 8]  # Q, 紅包, Q
```

### 接近 Free Spin（2 個 Scatter）
```
Reel 1: [1, 2, 3]  # 鼓(Scatter), 紅包, 金元寶
Reel 2: [4, 5, 6]  # 銅錢, 扇子, A
Reel 3: [1, 7, 8]  # 鼓(Scatter), K, Q
Reel 4: [2, 3, 4]  # 紅包, 金元寶, 銅錢
Reel 5: [5, 6, 7]  # 扇子, A, K
```

### 高價值展示
```
Reel 1: [2, 2, 2]  # 全紅包
Reel 2: [3, 3, 3]  # 全金元寶
Reel 3: [2, 3, 2]  # 紅包+金元寶
Reel 4: [3, 2, 3]  # 金元寶+紅包
Reel 5: [2, 2, 2]  # 全紅包
```

---

## 驗證是否成功

### 控制台日誌（按 F12）

成功時會看到：

```
✅ [InitialBoardConfig] 組件載入
✅ [InitialBoardConfig] 已註冊為全局實例
✅ [InitialBoardConfig] 🎮 開始應用初始盤面配置...
✅ [InitialBoardConfig] ✅ 初始盤面配置應用成功
✅ [InitialBoardConfig] 📊 盤面配置:
   盤面排列:
     Row 1: [8, 3, 4, 1, 8]
     Row 2: [2, 7, 6, 6, 2]
     Row 3: [7, 2, 5, 9, 8]
```

---

## 💡 提示

- **修改盤面**：直接在 Inspector 改數字，保存後重新預覽
- **檢查日誌**：勾選 `Verbose` 可以看到詳細信息
- **禁用功能**：取消勾選 `Auto Apply On Start`
- **只在測試時用**：勾選 `Only In Local Mode`

---

## 下一步

- 📚 [詳細使用指南](Initial-Board-Editor-Config-Guide.md)
- 🎮 [與模擬器整合](Simulator-Quick-Start.md)
- 📝 [JSON 檔案配置](Initial-Board-Quick-Reference.md)

---

**就這麼簡單！開始測試你的遊戲吧！** 🎮✨
