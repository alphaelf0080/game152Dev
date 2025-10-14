# 🎴 初始盤面編輯器 - 快速參考卡

## ⚡ 30 秒速查

### 編輯器配置（最簡單）
```
1. 創建節點 → InitialBoardConfig
2. 添加組件 → InitialBoardConfig
3. Data Source → EDITOR_CONFIG
4. 配置 Reel 1-5 → [8,2,7] [3,7,2] [4,6,5] [1,6,9] [8,2,8]
5. 保存並預覽 ✅
```

---

## 🎯 符號 ID 速查

| ID | 符號 | 類型 | ID | 符號 | 類型 |
|----|------|------|----|------|------|
| 1 | 🥁 鼓 | Scatter | 6 | 🅰️ A | 低價值 |
| 2 | 🧧 紅包 | 高價值 | 7 | 🅺 K | 低價值 |
| 3 | 💰 金元寶 | 高價值 | 8 | 🅾️ Q | 低價值 |
| 4 | 🪙 銅錢 | 中價值 | 9 | 🅹 J | 低價值 |
| 5 | 🪭 扇子 | 中價值 | 10 | ⭐ Wild | 特殊 |

---

## 📋 常用盤面

### 乾淨起始
```typescript
[8,2,7] [3,7,2] [4,6,5] [1,6,9] [8,2,8]
```

### 接近 Free Spin (2 Scatter)
```typescript
[1,2,3] [4,5,6] [1,7,8] [2,3,4] [5,6,7]
```

### 高價值展示
```typescript
[2,2,2] [3,3,3] [2,3,2] [3,2,3] [2,2,2]
```

---

## 🔧 編輯器屬性

```
┌─────────────────────────┐
│ Data Source             │
│  ● EDITOR_CONFIG  ← 用這個
│  ○ JSON_FILE            │
│  ○ URL                  │
├─────────────────────────┤
│ ✓ Auto Apply On Start   │
│ □ Only In Local Mode    │
├─────────────────────────┤
│ Reel 1: [8, 2, 7]       │
│ Reel 2: [3, 7, 2]       │
│ Reel 3: [4, 6, 5]       │
│ Reel 4: [1, 6, 9]       │
│ Reel 5: [8, 2, 8]       │
├─────────────────────────┤
│ Player Balance: 1000000 │
│ Description: "測試盤面" │
│ ✓ Verbose               │
└─────────────────────────┘
```

---

## ✅ 驗證檢查

### 控制台日誌
```javascript
✅ [InitialBoardConfig] 組件載入
✅ [InitialBoardConfig] 🎮 開始應用...
✅ [InitialBoardConfig] ✅ 配置應用成功
```

### 瀏覽器控制台
```javascript
// 檢查是否就緒
window.GameInitialBoard.isReady  // → true

// 查看盤面
window.GameInitialBoard.data.result.random_syb_pattern
// → [[8,2,7], [3,7,2], ...]
```

---

## 🐛 快速故障排除

| 問題 | 解決方法 |
|------|---------|
| 盤面沒顯示 | 檢查 `Auto Apply On Start` 是否勾選 |
| 符號顯示錯誤 | 確認符號 ID 是否正確 |
| 餘額不對 | `Player Balance` 單位是「分」，1000000 = 10000.00 元 |
| 組件找不到 | 確認檔案已加入專案，重新編譯 |

---

## 📁 檔案路徑

```
pss-on-00152/assets/script/config/
└── InitialBoardConfig.ts  ← 配置組件

gameServer/game_output/
└── initial_board_template.json  ← JSON 範本
```

---

## 📚 詳細文檔

- **5分鐘開始**: `docs/Initial-Board-5min-Start.md`
- **完整指南**: `docs/Initial-Board-Editor-Config-Guide.md`
- **系統報告**: `docs/Initial-Board-Editor-System-Report.md`

---

## 💡 Pro 技巧

### 快速切換盤面
```typescript
// 在運行時修改
const config = find('Canvas/InitialBoardConfig')
    .getComponent(InitialBoardConfig);
config.reel1 = [1, 1, 1];  // 改為 3 個 Scatter
await config.applyConfiguration();
```

### 只在本地模式啟用
```
勾選 "Only In Local Mode"
→ 正式環境自動跳過
```

### 批量測試
```
Data Source: URL
→ 改 URL 參數即可切換盤面
```

---

## 🎯 使用場景

| 場景 | 推薦方式 |
|------|---------|
| 快速測試新功能 | 編輯器配置 ⭐ |
| 準備演示 Demo | JSON 檔案 |
| CI/CD 自動測試 | URL 載入 |
| 團隊協作開發 | JSON 檔案 |

---

## ⚙️ 三種方式對比

|  | 編輯器 | JSON | URL |
|--|--------|------|-----|
| **速度** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡ |
| **易用** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **協作** | ⚠️ 場景衝突 | ✅ 容易 | ✅ 容易 |
| **動態** | ❌ | ⚠️ | ✅ |

---

**印出來貼在電腦旁邊！** 📌
