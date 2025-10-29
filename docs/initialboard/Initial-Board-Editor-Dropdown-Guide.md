# 🎨 初始盤面編輯器 - 下拉選單配置指南

## ✨ 更新：現在使用下拉選單！

**好消息**：現在不需要輸入數字了！改用**下拉選單**直接選擇符號！

---

## 🎯 新的編輯器介面

### 更新後的屬性面板

```
Inspector 面板（選中 InitialBoardConfig 節點後）
┌────────────────────────────────────────────┐
│ InitialBoardConfig 組件                    │
├────────────────────────────────────────────┤
│                                            │
│ Data Source: [EDITOR_CONFIG ▼]            │
│                                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   盤面配置                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                            │
│ 🎰 Reel 1（第1輪）                         │
│                                            │
│ Reel 1 Top:  [Q ▼]        ← 下拉選單！     │
│ Reel 1 Mid:  [紅包 ▼]     ← 下拉選單！     │
│ Reel 1 Bot:  [K ▼]        ← 下拉選單！     │
│                                            │
│ 🎰 Reel 2（第2輪）                         │
│                                            │
│ Reel 2 Top:  [金元寶 ▼]                   │
│ Reel 2 Mid:  [K ▼]                        │
│ Reel 2 Bot:  [紅包 ▼]                     │
│                                            │
│ 🎰 Reel 3（第3輪）                         │
│                                            │
│ Reel 3 Top:  [銅錢 ▼]                     │
│ Reel 3 Mid:  [A ▼]                        │
│ Reel 3 Bot:  [扇子 ▼]                     │
│                                            │
│ 🎰 Reel 4（第4輪）                         │
│                                            │
│ Reel 4 Top:  [鼓_Scatter ▼]               │
│ Reel 4 Mid:  [A ▼]                        │
│ Reel 4 Bot:  [J ▼]                        │
│                                            │
│ 🎰 Reel 5（第5輪）                         │
│                                            │
│ Reel 5 Top:  [Q ▼]                        │
│ Reel 5 Mid:  [紅包 ▼]                     │
│ Reel 5 Bot:  [Q ▼]                        │
│                                            │
│ Player Balance: [1000000____]              │
│ Initial Credit: [0____]                    │
│ Description: [測試盤面_______]             │
│ ☑ Verbose                                 │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📋 下拉選單選項

點擊任何一個下拉選單（▼）會顯示：

```
┌──────────────────┐
│ 鼓_Scatter       │  ← 特殊符號（觸發 Free Spin）
│ 紅包              │  ← 高價值符號
│ 金元寶            │  ← 高價值符號
│ 銅錢              │  ← 中價值符號
│ 扇子              │  ← 中價值符號
│ A                │  ← 低價值符號
│ K                │  ← 低價值符號
│ Q                │  ← 低價值符號（預設）
│ J                │  ← 低價值符號
│ Wild             │  ← 萬用符號（如果有）
└──────────────────┘
```

---

## 🖱️ 超簡單的操作方式

### 配置 Reel 1 為 [Q, 紅包, K]

**步驟**：
```
1. 找到 "Reel 1 Top"
2. 點擊下拉選單 [Q ▼]
3. 從選單選擇 "Q"（或其他符號）
4. 找到 "Reel 1 Mid"
5. 點擊下拉選單
6. 選擇 "紅包"
7. 找到 "Reel 1 Bot"
8. 點擊下拉選單
9. 選擇 "K"
10. 完成！
```

**就這麼簡單！** 不用記符號 ID，不用輸入數字！

---

## 🎯 視覺對照

### 盤面視覺化

```
遊戲畫面布局：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Q  | 金 | 錢 | 鼓 | Q   <- Row 1 (Top)
 紅 | K  | A  | A  | 紅  <- Row 2 (Mid)
 K  | 紅 | 扇 | J  | Q   <- Row 3 (Bot)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 R1   R2   R3   R4   R5
```

### 編輯器配置對應

```
Reel 1（第1輪，最左邊）：
  Top:  Q        → Row 1, 第1列
  Mid:  紅包     → Row 2, 第1列
  Bot:  K        → Row 3, 第1列

Reel 2（第2輪）：
  Top:  金元寶   → Row 1, 第2列
  Mid:  K        → Row 2, 第2列
  Bot:  紅包     → Row 3, 第2列

Reel 3（第3輪，中間）：
  Top:  銅錢     → Row 1, 第3列
  Mid:  A        → Row 2, 第3列
  Bot:  扇子     → Row 3, 第3列

Reel 4（第4輪）：
  Top:  鼓       → Row 1, 第4列（Scatter!）
  Mid:  A        → Row 2, 第4列
  Bot:  J        → Row 3, 第4列

Reel 5（第5輪，最右邊）：
  Top:  Q        → Row 1, 第5列
  Mid:  紅包     → Row 2, 第5列
  Bot:  Q        → Row 3, 第5列
```

---

## 📊 完整配置範例

### 範例 1：乾淨起始盤面

**目標盤面**：
```
 Q  | 金 | 錢 | 鼓 | Q
 紅 | K  | A  | A  | 紅
 K  | 紅 | 扇 | J  | Q
```

**編輯器設定**：
```
Reel 1:  Top=[Q]        Mid=[紅包]     Bot=[K]
Reel 2:  Top=[金元寶]   Mid=[K]        Bot=[紅包]
Reel 3:  Top=[銅錢]     Mid=[A]        Bot=[扇子]
Reel 4:  Top=[鼓_Scatter] Mid=[A]     Bot=[J]
Reel 5:  Top=[Q]        Mid=[紅包]     Bot=[Q]
```

---

### 範例 2：接近 Free Spin（3 個 Scatter）

**目標盤面**：
```
 鼓 | 錢 | 鼓 | 紅 | 鼓  ← 3個Scatter在Top行!
 紅 | 扇 | K  | 金 | A
 金 | A  | Q  | 錢 | K
```

**編輯器設定**：
```
Reel 1:  Top=[鼓_Scatter]  Mid=[紅包]     Bot=[金元寶]
Reel 2:  Top=[銅錢]        Mid=[扇子]     Bot=[A]
Reel 3:  Top=[鼓_Scatter]  Mid=[K]        Bot=[Q]
Reel 4:  Top=[紅包]        Mid=[金元寶]   Bot=[銅錢]
Reel 5:  Top=[鼓_Scatter]  Mid=[A]        Bot=[K]
```

---

### 範例 3：Wild 符號展示

**目標盤面**：
```
 Wild | Q  | Wild | K  | Wild  ← Wild 在 Top
 紅   | 金 | 紅   | 金 | 紅
 K    | A  | J    | A  | Q
```

**編輯器設定**：
```
Reel 1:  Top=[Wild]     Mid=[紅包]     Bot=[K]
Reel 2:  Top=[Q]        Mid=[金元寶]   Bot=[A]
Reel 3:  Top=[Wild]     Mid=[紅包]     Bot=[J]
Reel 4:  Top=[K]        Mid=[金元寶]   Bot=[A]
Reel 5:  Top=[Wild]     Mid=[紅包]     Bot=[Q]
```

---

## 🆚 新舊方式對比

### ❌ 舊方式（數字輸入）

```
Reel 1: [8, 2, 7]
        ↑  ↑  ↑
需要記住：8=Q, 2=紅包, 7=K
容易輸入錯誤的數字
```

### ✅ 新方式（下拉選單）

```
Reel 1 Top:  [Q ▼]        ← 直接看到符號名稱
Reel 1 Mid:  [紅包 ▼]     ← 一目了然
Reel 1 Bot:  [K ▼]        ← 不會選錯
```

**優勢**：
- ✅ 不用記符號 ID
- ✅ 看到符號名稱，直接選擇
- ✅ 不會輸入無效的數字
- ✅ 更直觀、更快速

---

## 💡 使用技巧

### 技巧 1：快速配置相同符號

如果想要某一輪全是相同符號：
```
Reel 3 Top:  [紅包 ▼]
Reel 3 Mid:  [紅包 ▼]  ← 選同樣的
Reel 3 Bot:  [紅包 ▼]  ← 選同樣的

結果：紅包 | 紅包 | 紅包（垂直一條線）
```

---

### 技巧 2：快速配置 Scatter 測試

想測試 2 個 Scatter 接近觸發：
```
Reel 1 Top:  [鼓_Scatter ▼]  ← 第1個
Reel 3 Top:  [鼓_Scatter ▼]  ← 第2個
其他位置選非 Scatter

下次 Spin 如果出現第3個 Scatter → 觸發 Free Spin!
```

---

### 技巧 3：測試不同價值符號

```
高價值盤面：
  多選 [紅包] 和 [金元寶]

低價值盤面：
  多選 [A], [K], [Q], [J]

混合盤面：
  高低價值混合
```

---

## 🎬 完整操作演示

### 從零開始配置一個盤面（< 3 分鐘）

```
1. 打開 Cocos Creator
   ↓
2. 選中 InitialBoardConfig 節點
   ↓
3. 確認 Data Source = EDITOR_CONFIG
   ↓
4. 配置 Reel 1:
   - 點擊 "Reel 1 Top" 下拉選單
   - 選擇 "Q"
   - 點擊 "Reel 1 Mid" 下拉選單
   - 選擇 "紅包"
   - 點擊 "Reel 1 Bot" 下拉選單
   - 選擇 "K"
   ↓
5. 配置 Reel 2:
   - Top: "金元寶"
   - Mid: "K"
   - Bot: "紅包"
   ↓
6. 配置 Reel 3:
   - Top: "銅錢"
   - Mid: "A"
   - Bot: "扇子"
   ↓
7. 配置 Reel 4:
   - Top: "鼓_Scatter"
   - Mid: "A"
   - Bot: "J"
   ↓
8. 配置 Reel 5:
   - Top: "Q"
   - Mid: "紅包"
   - Bot: "Q"
   ↓
9. 設定 Player Balance: 1000000
   ↓
10. Description: "測試盤面"
    ↓
11. 確認 Auto Apply On Start 已勾選 ✓
    ↓
12. 按 Ctrl+S 保存
    ↓
13. 預覽遊戲
    ↓
14. 檢查盤面顯示 ✅
```

---

## 🔍 驗證配置

### 方法 1：視覺檢查

在編輯器中，從上到下查看每個 Reel：
```
✓ Reel 1: Q, 紅包, K
✓ Reel 2: 金元寶, K, 紅包
✓ Reel 3: 銅錢, A, 扇子
✓ Reel 4: 鼓_Scatter, A, J
✓ Reel 5: Q, 紅包, Q

所有下拉選單都已設定 → 可以保存！
```

---

### 方法 2：控制台日誌

運行遊戲後查看控制台：
```javascript
[InitialBoardConfig] 使用編輯器配置創建盤面
[InitialBoardConfig] ✅ 初始盤面配置應用成功
[InitialBoardConfig] 📊 盤面配置:
  Row 1: [8, 3, 4, 1, 8]  ← Q, 金元寶, 銅錢, 鼓, Q
  Row 2: [2, 7, 6, 6, 2]  ← 紅包, K, A, A, 紅包
  Row 3: [7, 2, 5, 9, 8]  ← K, 紅包, 扇子, J, Q
```

---

### 方法 3：遊戲畫面

遊戲啟動後，檢查盤面是否符合預期：
```
看到的畫面應該與配置一致：
 Q  | 金 | 錢 | 鼓 | Q   ← 檢查 Top 行
 紅 | K  | A  | A  | 紅  ← 檢查 Mid 行
 K  | 紅 | 扇 | J  | Q   ← 檢查 Bot 行
```

---

## ❓ 常見問題

### Q1：找不到某個符號選項？

**A**：確認下拉選單中有這些選項：
```
✓ 鼓_Scatter
✓ 紅包
✓ 金元寶
✓ 銅錢
✓ 扇子
✓ A, K, Q, J
✓ Wild
```

如果某個選項看起來不對，可能是遊戲設計不同。
請參考遊戲的實際符號設定。

---

### Q2：為什麼 "鼓" 叫做 "鼓_Scatter"？

**A**：為了提醒這是 **Scatter 符號**（特殊符號）。

```
普通符號：點擊就選
特殊符號：帶有說明
  - 鼓_Scatter ← 觸發 Free Spin 的符號
  - Wild ← 萬用符號，可替代其他符號
```

---

### Q3：可以所有位置都選 Wild 嗎？

**A**：技術上可以，但可能不符合遊戲設計。

```
✓ 可以選：測試用，看效果
⚠️ 注意：實際遊戲中可能不會這樣出現
💡 建議：依照遊戲設計合理配置
```

---

### Q4：下拉選單沒有反應？

**A**：檢查以下幾點：

```
1. Data Source 是否選擇 EDITOR_CONFIG
   ❌ JSON_FILE → 不會顯示下拉選單
   ❌ URL → 不會顯示下拉選單
   ✅ EDITOR_CONFIG → 顯示下拉選單

2. 組件是否正確添加
   - 確認節點上有 InitialBoardConfig 組件

3. TypeScript 是否編譯成功
   - 檢查控制台是否有錯誤
   - 重新編譯專案
```

---

### Q5：修改配置後沒生效？

**A**：記得保存場景！

```
1. 修改下拉選單
2. 按 Ctrl+S 保存場景  ← 重要！
3. 重新預覽遊戲
4. 檢查效果
```

---

## 🎉 總結

### 新的下拉選單方式

```
✅ 優點：
  - 不用記符號 ID
  - 直接看到符號名稱
  - 不會選錯或輸入無效值
  - 操作更直觀
  - 配置更快速

📊 配置時間：
  舊方式（數字）：~5分鐘（需要查表）
  新方式（下拉）：~3分鐘（直接選擇）⚡
```

---

### 配置流程

```
選節點 → 確認 Data Source → 點下拉選單 → 選符號 → 保存 → 預覽 ✅
```

**就這麼簡單！**

---

## 📚 相關文檔

- [5分鐘快速開始](Initial-Board-5min-Start.md)
- [完整使用指南](Initial-Board-Editor-Config-Guide.md)
- [快速參考卡](Initial-Board-Quick-Card.md)

---

**享受全新的下拉選單配置體驗！** 🎮✨

---

**版本**: 2.0（下拉選單版本）  
**更新日期**: 2025-10-14  
**改進**: 數字輸入 → 下拉選單選擇
