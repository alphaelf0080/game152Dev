# 📝 初始盤面編輯器配置指南

## 概述

這個系統讓你可以直接在 Cocos Creator 編輯器中設定初始盤面，無需編寫 JSON 檔案或修改代碼。

---

## 🎯 三種配置方式

### 方式 1️⃣：編輯器直接配置（推薦）⭐

**適用場景**：快速測試、開發階段、簡單盤面

**步驟**：

1. **在場景中創建節點**
   - 打開你的遊戲主場景
   - 在 Hierarchy 中右鍵 → 創建空節點
   - 命名為 `InitialBoardConfig`

2. **添加組件**
   - 選中剛創建的節點
   - 在 Inspector 中點擊「添加組件」
   - 搜索並添加 `InitialBoardConfig`

3. **配置盤面**
   ```
   ┌─────────────────────────────────┐
   │ InitialBoardConfig 組件         │
   ├─────────────────────────────────┤
   │ Data Source: EDITOR_CONFIG      │ ← 選擇編輯器配置
   │ Auto Apply On Start: ✓          │ ← 勾選自動應用
   │ Only In Local Mode: □           │ ← 是否只在本地模式啟用
   │                                 │
   │ ━━━ 盤面配置 ━━━               │
   │ Reel 1: [8, 2, 7]              │ ← 第1輪的符號
   │ Reel 2: [3, 7, 2]              │ ← 第2輪
   │ Reel 3: [4, 6, 5]              │ ← 第3輪
   │ Reel 4: [1, 6, 9]              │ ← 第4輪
   │ Reel 5: [8, 2, 8]              │ ← 第5輪
   │                                 │
   │ Player Balance: 1000000         │ ← 玩家餘額（分）
   │ Initial Credit: 0               │ ← 初始積分
   │ Description: "測試盤面"         │ ← 說明
   │ Verbose: ✓                      │ ← 顯示日誌
   └─────────────────────────────────┘
   ```

4. **符號 ID 參考**
   ```
   1 = 鼓（Scatter）
   2 = 紅包
   3 = 金元寶
   4 = 銅錢
   5 = 扇子
   6 = A
   7 = K
   8 = Q
   9 = J
   10 = Wild（如果有）
   ```

5. **保存並運行**
   - 保存場景
   - 點擊預覽（瀏覽器預覽或模擬器）
   - 遊戲啟動時會自動顯示你配置的盤面

---

### 方式 2️⃣：從 Resources 載入 JSON

**適用場景**：需要版本控制、複雜配置、團隊共享

**步驟**：

1. **準備 JSON 檔案**
   - 使用 `initial_board_template.json` 作為範本
   - 複製並修改為你的配置
   - 命名範例：`my_custom_board.json`

2. **放入 Resources 目錄**
   ```
   pss-on-00152/
   └── assets/
       └── resources/
           └── initial_boards/
               ├── clean_board.json
               ├── wild_board.json
               └── my_custom_board.json
   ```

3. **在編輯器中配置**
   ```
   ┌─────────────────────────────────┐
   │ InitialBoardConfig 組件         │
   ├─────────────────────────────────┤
   │ Data Source: JSON_FILE          │ ← 選擇 JSON 檔案
   │ Json Asset: [選擇你的JSON]      │ ← 拖入你的 JSON
   │ Auto Apply On Start: ✓          │
   └─────────────────────────────────┘
   ```

4. **運行遊戲**
   - 遊戲啟動時會自動載入 JSON 配置

---

### 方式 3️⃣：從 URL 載入

**適用場景**：本地伺服器測試、動態配置、批量測試

**步驟**：

1. **啟動 JSON 伺服器**
   ```powershell
   cd gameServer
   python serve_json.py 9000 game_output
   ```

2. **在編輯器中配置**
   ```
   ┌─────────────────────────────────┐
   │ InitialBoardConfig 組件         │
   ├─────────────────────────────────┤
   │ Data Source: URL                │ ← 選擇 URL
   │ Json Url: http://localhost:9000/initial_board.json
   │ Auto Apply On Start: ✓          │
   └─────────────────────────────────┘
   ```

3. **或者使用 URL 參數**（無需編輯器配置）
   ```
   http://localhost:7456/?localServer=true&initial_board=http://localhost:9000/initial_board_wild.json
   ```

---

## 📊 完整範例

### 範例 1：乾淨的起始盤面

```typescript
// 在編輯器中設定
Reel 1: [8, 3, 4]  // Q, 金元寶, 銅錢
Reel 2: [2, 7, 6]  // 紅包, K, A
Reel 3: [7, 2, 5]  // K, 紅包, 扇子
Reel 4: [1, 6, 9]  // 鼓, A, J
Reel 5: [8, 2, 8]  // Q, 紅包, Q

Player Balance: 1000000  // 10000.00 元
Description: "乾淨起始盤面"
```

**視覺化**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Q  | 紅 | K  | 鼓 | Q   <- Row 1
 金 | K  | 紅 | A  | 紅  <- Row 2
 錢 | A  | 扇 | J  | Q   <- Row 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 範例 2：2 個 Scatter（接近 Free Spin）

```typescript
Reel 1: [1, 2, 3]  // 鼓（Scatter!）, 紅包, 金元寶
Reel 2: [4, 5, 6]  // 銅錢, 扇子, A
Reel 3: [1, 7, 8]  // 鼓（Scatter!）, K, Q
Reel 4: [2, 3, 4]  // 紅包, 金元寶, 銅錢
Reel 5: [5, 6, 7]  // 扇子, A, K

Player Balance: 500000
Description: "2 個 Scatter - 接近觸發"
```

**視覺化**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 鼓 | 錢 | 鼓 | 紅 | 扇  <- Row 1 (2個Scatter!)
 紅 | 扇 | K  | 金 | A   <- Row 2
 金 | A  | Q  | 錢 | K   <- Row 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 範例 3：高價值符號展示

```typescript
Reel 1: [2, 2, 2]  // 全是紅包
Reel 2: [3, 3, 3]  // 全是金元寶
Reel 3: [2, 3, 2]  // 紅包+金元寶
Reel 4: [3, 2, 3]  // 金元寶+紅包
Reel 5: [2, 2, 2]  // 全是紅包

Player Balance: 2000000
Description: "高價值符號展示"
```

---

## 🔧 進階配置

### 條件啟用

**只在本地模式下啟用初始盤面**：

```
┌─────────────────────────────────┐
│ Only In Local Mode: ✓           │ ← 勾選此選項
└─────────────────────────────────┘
```

這樣配置後：
- ✅ URL 包含 `?localServer=true` → 使用初始盤面
- ✅ URL 包含 `?sim_mode=local_json` → 使用初始盤面
- ❌ 正常連線伺服器 → 忽略初始盤面配置

---

### 動態切換配置

**在遊戲運行時切換**：

```typescript
// 獲取配置組件
const config = find('Canvas/InitialBoardConfig').getComponent(InitialBoardConfig);

// 修改盤面
config.reel1 = [1, 1, 1];  // 全是 Scatter
config.reel2 = [1, 1, 1];
config.reel3 = [1, 1, 1];

// 重新應用
await config.applyConfiguration();
```

---

### 從代碼獲取配置

```typescript
import { getInitialBoardConfig, getEditorConfiguredBoard } from './config/InitialBoardConfig';

// 獲取配置組件實例
const config = getInitialBoardConfig();

// 獲取當前盤面數據
const boardData = getEditorConfiguredBoard();

if (boardData) {
    console.log('盤面排列:', boardData.result.random_syb_pattern);
    console.log('玩家餘額:', boardData.player_cent);
}
```

---

## 🎮 工作流程

### 典型開發流程

```
1. 開發初期
   ┌─────────────────────┐
   │ 使用編輯器直接配置  │ ← 快速迭代
   │ Data Source = EDITOR │
   └─────────────────────┘

2. 測試階段
   ┌─────────────────────┐
   │ 創建 JSON 檔案      │ ← 版本控制
   │ Data Source = JSON  │
   └─────────────────────┘

3. 批量測試
   ┌─────────────────────┐
   │ 使用 URL 載入       │ ← 動態切換
   │ Data Source = URL   │
   └─────────────────────┘

4. 正式發佈
   ┌─────────────────────┐
   │ 移除組件或禁用      │ ← 連接真實伺服器
   │ Only In Local = ✓   │
   └─────────────────────┘
```

---

## 🔍 調試和驗證

### 查看控制台日誌

啟用 `Verbose` 選項後，會輸出詳細日誌：

```javascript
[InitialBoardConfig] InitialBoardConfig 組件載入
[InitialBoardConfig] 已註冊為全局實例
[InitialBoardConfig] 🎮 開始應用初始盤面配置...
[InitialBoardConfig] 數據來源: EDITOR_CONFIG
[InitialBoardConfig] 使用編輯器配置創建盤面
[InitialBoardConfig] ✅ 初始盤面配置應用成功
[InitialBoardConfig] ━━━━━━━━━━━━━━━━━━━━
[InitialBoardConfig] 📊 盤面配置:
[InitialBoardConfig]   說明: 測試盤面
[InitialBoardConfig]   盤面排列:
[InitialBoardConfig]     Row 1: [8, 3, 4, 1, 8]
[InitialBoardConfig]     Row 2: [2, 7, 6, 6, 2]
[InitialBoardConfig]     Row 3: [7, 2, 5, 9, 8]
[InitialBoardConfig]   玩家餘額: 1000000 (10000.00 元)
[InitialBoardConfig]   初始積分: 0
[InitialBoardConfig] ━━━━━━━━━━━━━━━━━━━━
[InitialBoardConfig] 已通知其他系統：初始盤面已就緒
```

### 在瀏覽器控制台驗證

```javascript
// 檢查配置是否就緒
window.GameInitialBoard.isReady
// → true

// 查看盤面數據
window.GameInitialBoard.data
// → { msgid: 107, status_code: 0, result: {...}, ... }

// 查看符號排列
window.GameInitialBoard.data.result.random_syb_pattern
// → [[8,2,7], [3,7,2], [4,6,5], [1,6,9], [8,2,8]]
```

---

## 📁 檔案結構

```
pss-on-00152/assets/script/config/
├── InitialBoardConfig.ts         ← 編輯器配置組件（新增）
├── InitialBoardLoader.ts         ← URL/檔案載入器
└── SimulatedResultHandler.ts     ← 模擬器處理器

gameServer/game_output/
├── initial_board.json             ← 預設盤面
├── initial_board_template.json    ← 編輯範本（新增）
├── initial_board_wild.json        ← Wild 盤面
├── initial_board_scatter.json     ← Scatter 盤面
└── ... (其他預設盤面)
```

---

## 🆚 三種方式對比

| 特性 | 編輯器配置 | JSON 檔案 | URL 載入 |
|------|-----------|----------|---------|
| **設定難度** | ⭐ 最簡單 | ⭐⭐ 中等 | ⭐⭐⭐ 較複雜 |
| **需要伺服器** | ❌ 不需要 | ❌ 不需要 | ✅ 需要 |
| **版本控制** | ⚠️ 需要場景檔 | ✅ 獨立檔案 | ✅ 獨立檔案 |
| **動態切換** | ⚠️ 需重新編譯 | ⚠️ 需重新編譯 | ✅ 只改 URL |
| **團隊共享** | ⚠️ 場景衝突 | ✅ 容易共享 | ✅ 容易共享 |
| **適用場景** | 快速測試 | 正式配置 | 批量測試 |
| **學習曲線** | 5 分鐘 | 15 分鐘 | 30 分鐘 |

---

## 💡 最佳實踐

### ✅ 推薦做法

1. **開發階段**：使用編輯器配置，快速迭代
2. **測試階段**：轉換為 JSON 檔案，納入版本控制
3. **CI/CD**：使用 URL 載入，自動化測試
4. **正式環境**：禁用初始盤面，連接真實伺服器

### ❌ 避免做法

1. ❌ 在正式環境啟用編輯器配置（可能洩漏測試數據）
2. ❌ 將測試 JSON 檔案打包到正式版本
3. ❌ 在多人協作時使用編輯器配置（容易衝突）
4. ❌ 硬編碼初始盤面數據（難以維護）

---

## 🐛 故障排除

### 問題：初始盤面沒有顯示

**檢查清單**：
- [ ] 組件是否已添加到場景
- [ ] `Auto Apply On Start` 是否勾選
- [ ] `Only In Local Mode` 設定是否正確
- [ ] 控制台是否有錯誤訊息
- [ ] 盤面數據格式是否正確（每個 reel 必須 3 個符號）

**解決方法**：
```typescript
// 在控制台執行
const config = find('Canvas/InitialBoardConfig').getComponent(InitialBoardConfig);
config.verbose = true;  // 啟用詳細日誌
await config.applyConfiguration();  // 手動應用
```

### 問題：符號顯示錯誤

**原因**：符號 ID 設定不正確

**解決方法**：
1. 檢查符號 ID 對照表
2. 確認遊戲中實際使用的符號 ID
3. 在 `_symbolReference` 屬性中查看參考資訊

### 問題：餘額顯示不正確

**原因**：單位換算問題

**解決方法**：
- `Player Balance` 單位是「分」（cent）
- 1000000 分 = 10000.00 元
- 公式：實際金額 = `player_cent / 100`

---

## 📚 相關文檔

- **初始盤面系統總覽**：`Initial-Board-Guide.md`
- **快速參考**：`Initial-Board-Quick-Reference.md`
- **實施總結**：`Initial-Board-Implementation-Summary.md`
- **模擬器指南**：`Simulator-Quick-Start.md`

---

## 🎯 快速開始（5 分鐘）

1. **創建節點** → 在場景添加空節點
2. **添加組件** → `InitialBoardConfig`
3. **配置盤面** → 設定 5 個 reels 的符號
4. **保存運行** → 預覽遊戲

**就這麼簡單！** 🎉

---

**版本**: 1.0  
**最後更新**: 2025-10-14  
**狀態**: ✅ 生產就緒
