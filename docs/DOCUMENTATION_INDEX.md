# 📚 遊戲模擬器系統 - 文檔索引

## 🔧 最新更新 (2025-10-14)

### 🆕 LocalServer 初始盤面功能完整實現 v3.0
**檔案**: `docs/LocalServer-InitialBoard-Complete-Report.md`  
**完成功能**:
- ✅ Spin Server `/api/init` 端點（返回初始盤面）
- ✅ SpinServerClient.getInitialBoard() 方法
- ✅ LocalServer 模式獨立初始化路徑
- ✅ 完整資料結構模擬（StateConsole、MathConsole）
- ✅ 測試通過，遊戲正常顯示

**問題解決**:
- NetInitReady 未被調用 → 直接在 ProtoConsole.start() 調用
- Striptables 為空 → 預先初始化結構
- strips 資料缺失 → 創建假資料（5滾輪×100符號）
- TotalArray 未初始化 → 模擬 ConfigRecall 流程

**關鍵檔案**:
- `gameServer/spin_server.py` - 新增 `/api/init` 端點
- `ProtoConsole.ts` - LocalServer 初始化重構
- `StateConsole.ts` - NetInitReady LocalServer 支援
- `SpinServerClient.ts` - getInitialBoard() 方法

**使用方式**:
```
http://localhost:7456/?localServer=true
```

---

### Spin Server - 遊戲後端伺服器 v1.0
**檔案**: `docs/Spin-Server-Summary.md`  
**新增功能**:
- ✅ FastAPI 後端伺服器
- ✅ POST /api/spin 端點（接收前端 spin 請求）
- ✅ GET /api/init 端點（返回初始盤面）
- ✅ GET /api/health 端點（健康檢查）
- ✅ CORS 跨域支援
- ✅ 完整的測試工具（Python + HTML）

**新增檔案**:
- `spin_server.py` - 主伺服器程式 (400+ 行)
- `test_spin_server.py` - 測試腳本 (246 行)
- `test_spin_client.html` - 網頁測試介面 (540 行)
- `start_spin_server.py` - 快速啟動腳本 (108 行)

**快速啟動**:
```bash
python spin_server.py
```

---

### LocalServer & 初始盤面修復 v2.1
**檔案**: `docs/LocalServer-InitialBoard-Fix.md`  
**修復內容**:
- ✅ LocalServer 模式正確跳過 WebSocket 連接
- ✅ 初始盤面正確顯示在遊戲中
- ✅ LastRng 數據轉換優化

**影響範圍**:
- `ProtoConsole.ts` - 新增 USE_LOCAL_JSON 標記設定
- `StateConsole.ts` - 初始盤面數據應用到 LastRng

---

## 快速導航

### 🚀 我該從哪裡開始？

| 您的角色 | 推薦文檔 | 路徑 |
|---------|---------|------|
| **新手開發者** | 快速開始指南 ⭐ | `docs/Simulator-Quick-Start.md` |
| **LocalServer 開發** | 初始盤面完整報告 🆕 | `docs/LocalServer-InitialBoard-Complete-Report.md` |
| **經驗豐富的開發者** | 系統總結 | `docs/Simulator-System-Summary.md` |
| **測試/QA 人員** | 使用指南 | `pss-on-00152/assets/script/config/SIMULATOR_GUIDE.md` |
| **技術主管** | 整合報告 | `docs/Simulator-Integration-Report.md` |
| **專案經理** | 最終報告 | `docs/Simulator-Final-Report.md` |
| **部署人員** | 實施檢查清單 | `docs/Simulator-Implementation-Checklist.md` |
| **調試/修復** | 問題修復報告 | `docs/LocalServer-InitialBoard-Fix.md` |
| **後端開發者** | Spin Server 🆕 | `docs/Spin-Server-Guide.md` |

---

## 📖 文檔列表

### 🎯 後端伺服器文檔

#### Spin-Server-Guide.md 🆕
**路徑**: `docs/Spin-Server-Guide.md`  
**類型**: 完整使用指南  
**適合**: 後端開發者、前端整合者  
**內容**:
- 概述與功能特點
- 快速開始（3 步驟）
- 完整 API 文檔（POST /api/spin, GET /api/health, GET /api/status）
- 測試方法（Python、HTML、curl、Postman）
- 前端整合範例（TypeScript、Cocos Creator）
- 故障排除
- 進階設定（生產環境部署）

**何時閱讀**: 需要建立或整合後端 Spin API 時

**預計閱讀時間**: 30 分鐘

---

#### Spin-Server-Quick-Start.md 🆕
**路徑**: `docs/Spin-Server-Quick-Start.md`  
**類型**: 快速開始  
**適合**: 所有開發者  
**內容**:
- 3 步驟快速啟動
- API 端點說明
- 前端整合範例
- 測試結果範例
- 常見問題解答

**何時閱讀**: 想快速啟動 Spin Server 時

**預計閱讀時間**: 5 分鐘

---

#### Spin-Server-Summary.md 🆕
**路徑**: `docs/Spin-Server-Summary.md`  
**類型**: 實現總結  
**適合**: 專案經理、技術主管  
**內容**:
- 完成項目清單
- 新建檔案說明
- 核心功能介紹
- 技術架構圖
- 測試驗證結果
- 前端整合方案
- 與 LocalServer 模式對比

**何時閱讀**: 需要了解 Spin Server 全貌時

**預計閱讀時間**: 15 分鐘

---

### 🔧 問題修復文檔

#### LocalServer-InitialBoard-Fix.md
**路徑**: `docs/LocalServer-InitialBoard-Fix.md`  
**類型**: 問題修復報告  
**適合**: 開發者、調試人員  
**內容**:
- 問題總結（WebSocket 跳過、初始盤面顯示）
- 解決方案詳解
- 代碼修改說明
- ReelController 工作流程
- 完整測試步驟
- 調試技巧
- 驗證清單

**何時閱讀**: 遇到 LocalServer 或初始盤面問題時

**預計閱讀時間**: 25 分鐘

---

### 核心文檔

#### 1. README_SIMULATOR.md
**路徑**: `README_SIMULATOR.md`  
**類型**: 專案概述  
**適合**: 所有人  
**內容**:
- 專案簡介
- 主要特性
- 5 分鐘快速開始
- 使用方法
- 文檔索引

**何時閱讀**: 第一次接觸專案時

---

#### 2. Simulator-Quick-Start.md ⭐
**路徑**: `docs/Simulator-Quick-Start.md`  
**類型**: 快速開始指南  
**適合**: 新手  
**內容**:
- 5 分鐘快速上手
- 步驟化教程
- 常用 URL 模板
- 驗證方法
- 常見問題

**何時閱讀**: 想立即開始使用時

**預計閱讀時間**: 5 分鐘

---

#### 3. SIMULATOR_GUIDE.md
**路徑**: `pss-on-00152/assets/script/config/SIMULATOR_GUIDE.md`  
**類型**: 詳細使用說明  
**適合**: 開發者、測試人員  
**內容**:
- 功能特性詳解
- 完整使用方法
- URL 參數說明
- JSON 檔案格式
- 代碼整合示例
- 實際使用範例
- 調試資訊
- 故障排除

**何時閱讀**: 需要深入了解功能時

**預計閱讀時間**: 20 分鐘

---

#### 4. Simulator-System-Summary.md
**路徑**: `docs/Simulator-System-Summary.md`  
**類型**: 系統總結  
**適合**: 開發者、技術主管  
**內容**:
- 完成工作總結
- 核心特性
- 使用場景
- 技術細節
- 注意事項
- 未來擴展

**何時閱讀**: 需要了解整體架構時

**預計閱讀時間**: 15 分鐘

---

#### 5. Simulator-Integration-Report.md
**路徑**: `docs/Simulator-Integration-Report.md`  
**類型**: 整合報告  
**適合**: 開發者、技術主管  
**內容**:
- 新增檔案詳解
- 修改檔案說明
- 使用方法
- 工作流程
- 數據格式
- 調試資訊
- 優點分析

**何時閱讀**: 需要了解實施細節時

**預計閱讀時間**: 25 分鐘

---

#### 6. Simulator-Implementation-Checklist.md
**路徑**: `docs/Simulator-Implementation-Checklist.md`  
**類型**: 實施檢查清單  
**適合**: QA、部署人員  
**內容**:
- 實施完成度檢查
- 測試檢查清單
- 文檔檢查清單
- 部署檢查清單
- 使用場景驗證

**何時閱讀**: 進行測試或部署時

**預計閱讀時間**: 30 分鐘（含測試）

---

#### 7. Simulator-Final-Report.md
**路徑**: `docs/Simulator-Final-Report.md`  
**類型**: 最終完成報告  
**適合**: 專案經理、技術主管  
**內容**:
- 執行摘要
- 實施統計
- 功能檢查表
- 技術實現
- 優勢分析
- 性能指標
- 未來路線圖

**何時閱讀**: 需要整體評估時

**預計閱讀時間**: 20 分鐘

---

### 初始盤面系統文檔

#### 8. Initial-Board-5min-Start.md ⭐
**路徑**: `docs/Initial-Board-5min-Start.md`  
**類型**: 5分鐘快速開始  
**適合**: 所有人  
**內容**:
- 編輯器配置步驟
- 符號 ID 速查表
- 常用盤面範例
- 驗證方法

**何時閱讀**: 想快速配置初始盤面時

**預計閱讀時間**: 5 分鐘

---

#### 9. Initial-Board-Editor-Config-Guide.md
**路徑**: `docs/Initial-Board-Editor-Config-Guide.md`  
**類型**: 編輯器配置詳細指南  
**適合**: 開發者  
**內容**:
- 三種配置方式詳解
- 編輯器直接配置
- 從 Resources 載入
- 從 URL 載入
- 完整範例
- 進階配置
- 工作流程
- 故障排除

**何時閱讀**: 需要深入了解編輯器配置時

**預計閱讀時間**: 20 分鐘

---

#### 10. Initial-Board-Guide.md
**路徑**: `docs/Initial-Board-Guide.md`  
**類型**: 完整系統指南  
**適合**: 開發者  
**內容**:
- 系統架構
- 完整功能說明
- URL 載入方式
- JSON 格式
- 整合指南

**何時閱讀**: 需要了解整體系統時

**預計閱讀時間**: 25 分鐘

---

#### 11. Initial-Board-Quick-Reference.md
**路徑**: `docs/Initial-Board-Quick-Reference.md`  
**類型**: 快速參考  
**適合**: 所有人  
**內容**:
- 快速操作指令
- 常用 URL 範例
- 故障排除
- 常見問題

**何時閱讀**: 需要快速查詢時

**預計閱讀時間**: 10 分鐘

---

#### 12. Initial-Board-Implementation-Summary.md
**路徑**: `docs/Initial-Board-Implementation-Summary.md`  
**類型**: 實施總結  
**適合**: 技術主管、專案經理  
**內容**:
- 完成內容總覽
- 系統架構
- 使用方法
- 核心特性
- 驗證方法
- 技術細節

**何時閱讀**: 需要整體評估時

**預計閱讀時間**: 15 分鐘

---

### 工具腳本

#### 13. generate_initial_boards.py
**路徑**: `gameServer/generate_initial_boards.py`  
**類型**: Python 工具腳本  
**適合**: 開發者  
**用途**: 自動生成 10 種預設初始盤面 JSON 檔案
**使用方法**:
```powershell
cd gameServer
python generate_initial_boards.py
```

---

#### 14. quick_start.py
**路徑**: `gameServer/quick_start.py`  
**類型**: Python 腳本  
**功能**:
- 互動式選單
- 生成測試數據
- 啟動 JSON 伺服器
- 顯示測試 URL
- 驗證 JSON 檔案

**使用方法**:
```bash
cd gameServer
python quick_start.py
```

---

#### 9. serve_json.py
**路徑**: `gameServer/serve_json.py`  
**類型**: Python 腳本  
**功能**:
- HTTP 伺服器
- CORS 支援
- 提供 JSON 檔案

**使用方法**:
```bash
python serve_json.py [port] [directory]
# 範例: python serve_json.py 9000 game_output
```

---

#### 10. test_simulator_config.py
**路徑**: `gameServer/test_simulator_config.py`  
**類型**: Python 腳本  
**功能**:
- 快速測試
- JSON 驗證
- URL 生成
- 自動啟動伺服器

**使用方法**:
```bash
python test_simulator_config.py
```

---

## 🎯 按需求查找文檔

### 我想...

#### 🚀 快速開始使用
➡️ **閱讀**: `Simulator-Quick-Start.md`  
➡️ **運行**: `quick_start.py`

#### 🔍 深入了解功能
➡️ **閱讀**: `SIMULATOR_GUIDE.md`

#### 🏗️ 了解架構設計
➡️ **閱讀**: `Simulator-System-Summary.md`  
➡️ **參考**: `Simulator-Integration-Report.md`

#### ✅ 進行測試驗證
➡️ **閱讀**: `Simulator-Implementation-Checklist.md`  
➡️ **運行**: `quick_start.py` → 選項 6

#### 🐛 排除故障
➡️ **閱讀**: `SIMULATOR_GUIDE.md` → 故障排除章節  
➡️ **參考**: `Simulator-Quick-Start.md` → 常見問題

#### 📊 評估專案成果
➡️ **閱讀**: `Simulator-Final-Report.md`

#### 🔧 部署到環境
➡️ **閱讀**: `Simulator-Implementation-Checklist.md`  
➡️ **參考**: `Simulator-Integration-Report.md`

---

## 📂 按檔案類型查找

### TypeScript 原始碼

| 檔案 | 路徑 | 功能 |
|------|------|------|
| SimulatorConfig.ts | `pss-on-00152/assets/script/config/` | 配置管理 |
| JsonDataLoader.ts | `pss-on-00152/assets/script/config/` | 數據載入 |
| SimulatedResultHandler.ts | `pss-on-00152/assets/script/config/` | 結果處理 |

### Python 工具腳本

| 檔案 | 路徑 | 功能 |
|------|------|------|
| quick_start.py | `gameServer/` | 互動式啟動 |
| serve_json.py | `gameServer/` | HTTP 伺服器 |
| test_simulator_config.py | `gameServer/` | 測試工具 |

### Markdown 文檔

| 檔案 | 路徑 | 類型 |
|------|------|------|
| README_SIMULATOR.md | 專案根目錄 | 專案概述 |
| Simulator-Quick-Start.md | `docs/` | 快速開始 |
| Simulator-System-Summary.md | `docs/` | 系統總結 |
| Simulator-Integration-Report.md | `docs/` | 整合報告 |
| Simulator-Implementation-Checklist.md | `docs/` | 檢查清單 |
| Simulator-Final-Report.md | `docs/` | 最終報告 |
| SIMULATOR_GUIDE.md | `pss-on-00152/assets/script/config/` | 使用指南 |

---

## 🔄 建議閱讀順序

### 方案 A: 快速上手（適合趕時間的人）

1. `README_SIMULATOR.md` (2 分鐘)
2. `Simulator-Quick-Start.md` (5 分鐘)
3. 運行 `quick_start.py`
4. 開始使用 ✅

**總時間**: ~10 分鐘

---

### 方案 B: 全面理解（適合開發者）

1. `README_SIMULATOR.md` (2 分鐘)
2. `Simulator-Quick-Start.md` (5 分鐘)
3. `SIMULATOR_GUIDE.md` (20 分鐘)
4. `Simulator-System-Summary.md` (15 分鐘)
5. `Simulator-Integration-Report.md` (25 分鐘)
6. 查看原始碼

**總時間**: ~70 分鐘

---

### 方案 C: 專案管理（適合主管）

1. `README_SIMULATOR.md` (2 分鐘)
2. `Simulator-Final-Report.md` (20 分鐘)
3. `Simulator-System-Summary.md` (15 分鐘)
4. Demo 演示

**總時間**: ~40 分鐘

---

### 方案 D: 測試部署（適合 QA/DevOps）

1. `Simulator-Quick-Start.md` (5 分鐘)
2. `Simulator-Implementation-Checklist.md` (30 分鐘)
3. `SIMULATOR_GUIDE.md` → 故障排除 (10 分鐘)
4. 執行測試

**總時間**: ~50 分鐘

---

## 🆘 需要幫助？

### 按問題類型查找

| 問題類型 | 查看文檔 | 章節 |
|---------|---------|------|
| **如何開始** | Quick-Start | 全文 |
| **功能不理解** | SIMULATOR_GUIDE | 功能特性 |
| **無法載入 JSON** | SIMULATOR_GUIDE | 故障排除 |
| **結果不正確** | SIMULATOR_GUIDE | 數據格式 |
| **性能問題** | Final-Report | 性能指標 |
| **部署問題** | Implementation-Checklist | 部署檢查 |
| **架構疑問** | System-Summary | 技術細節 |

---

## 📊 文檔覆蓋範圍

```
專案概述        ████████████████████  100%
快速開始        ████████████████████  100%
使用說明        ████████████████████  100%
技術細節        ████████████████████  100%
整合報告        ████████████████████  100%
測試驗證        ████████████████████  100%
故障排除        ████████████████████  100%
最佳實踐        ████████████████████  100%
```

---

## 🎉 快速連結

### 最常用的 3 個文檔

1. 🥇 [快速開始指南](docs/Simulator-Quick-Start.md) - 5 分鐘上手
2. 🥈 [使用指南](pss-on-00152/assets/script/config/SIMULATOR_GUIDE.md) - 詳細說明
3. 🥉 [系統總結](docs/Simulator-System-Summary.md) - 技術概覽

### 最常用的 3 個工具

1. 🛠️ `quick_start.py` - 互動式啟動
2. 🌐 `serve_json.py` - HTTP 伺服器
3. ✅ `test_simulator_config.py` - 測試驗證

---

**索引版本**: 1.0  
**最後更新**: 2025-01-13  
**維護狀態**: ✅ 活躍維護

**開始使用**: `python gameServer/quick_start.py` 🚀
