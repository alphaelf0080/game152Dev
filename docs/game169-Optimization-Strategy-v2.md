# Game169 最佳化策略（下載、執行、維護）

> 日期：2025-10-16  
> 範圍：評估遊戲專案 `game169`，並針對「加快下載速度」、「提升執行效能」、「強化維護性」三大面向提出優化優先順序。建置流程已會自動剔除 `console.log()`，因此本報告忽略該項因素。

---

## 1. 下載速度優化

### 1.1 現況概覽
- `assets/` 資料夾：**64.53 MB**、3,534 個檔案
- 圖片：1,021 個 PNG，合計 **35.09 MB**
- 音訊：66 個 MP3，合計 **7.46 MB**（背景音樂單檔超過 800 KB）
- JSON 組態：99 個檔案，總量 **5.33 MB**（目前未壓縮）
- 多語言載入圖：19 個語系 × 約 380 KB ≈ **7.22 MB**

### 1.2 高影響力措施
1. **依平台設定紋理壓縮**
   - 在 `settings/builder.json` 配置 Android 採 ETC2、iOS 採 PVRTC、高階裝置可用 ASTC。  
   - 對 UI、符號表與背景圖可預期降低 50–70% 尺寸，且視覺損耗有限。

2. **重構語系載入圖資產**
   - 以共用底圖（建議改用 WebP）＋語系文字圖層取代完整圖片。  
   - 將文字覆蓋放入輕量的 `language-overlay` bundle，於登入後再載入。

3. **建立音訊重新編碼流程**
   - 批次將背景循環（`Basebackground.mp3`、`Featurebackground.mp3` 等）轉為 96 kbps AAC 或 Ogg。  
   - 按鈕／觸發音效改用 64 kbps 單聲道，可縮檔約 35%（如 `particle.mp3`、`WinRolling.mp3`）。

4. **延遲載入大型高解析圖集**
   - 將 Big Win、Feature Buy 等罕見效果獨立成 `event-effects` bundle。  
   - 於事件即將觸發時再用 `assetManager.loadBundle` 下載，並於當次遊戲快取。

5. **啟用 JSON 最小化與二進位組態**
   - 在建置設定開啟 `minifyJson`。  
   - 評估將固定表格（賠率、轉帶）改成 protobuf／flatbuffer 並搭配 gzip 發佈。

### 1.3 自動化支援
- 建立 CI 資產稽核：當 PNG > 512 KB 或 MP3 > 300 KB 時發出警示。  
- 於 `build/manifest.json` 追蹤各 bundle 大小，核心 bundle 超過 20 MB 則建置失敗。

### 1.4 建議拆分的 Bundle
- **core**：保留主場景 UI、滾輪運作必備的低解析符號圖、通用字型與常駐提示音效，首包目標 < 20 MB。  
- **language/ui**、**language/tutorial**：語系文字、圖標、教學素材分開打包，登入後再載入相對應語系。  
- **event-effects**：BigWin、MegaWin、FeatureBuy 等稀有特效（Spine＋圖集），事件觸發前再下載。  
- **mode-*（如 freegame、redpacket、jackpot）**：各子玩法的 prefab、動畫、音樂獨立成包，進入模式時動態載入。  
- **backgrounds**：大型背景與 loading 圖（例如 `resR/bg/BS_bg.png`），登入後或場景切換時再載入。  
- **audio/bg-music**、**audio/feature**：循環背景樂、特殊事件音樂延後載入，常駐音效仍放核心包。  
- **debug-tools**：Debug JSON Loader、測試用 prefab 等僅限內部使用的資源獨立成包。  
- **shader-lab**：自訂材質示例、RampColorShader 等研發用素材可拆成開發專用 bundle。

### 1.5 Debug 專屬資源
- `assets/script/Debug/DebugJSONLoader.ts`：本地 JSON 結果載入工具，只在內部測試使用。  
- `assets/script/Debug/DebugLoadButton.ts`：與 Debug Loader 搭配的測試按鈕，不應進正式版本。  
- 相關說明文件：`docs/Debug-JSON-Loader-Guide.md`, `docs/Debug-JSON-Loader-Guide-backup.md` 等，可隨 debug bundle 提供給測試人員。

---

## 2. 執行效能優化

### 2.1 觀察重點（排除 console logging）
- 符號生命週期已導入 `SymbolNodeCache`，但滾輪仍隨用隨建 prefab。
- `ReelController` 內多個排程（SlowMotion、Win 狀態）會重複建立音源節點。
- `SymbolAnimationController` 為非可視符號一樣頻繁啟停 Spine 動畫。
- 音訊以零散的 `AudioSource` 呼叫為主，缺乏共享混音管理。

### 2.2 建議優化項目
1. **符號／滾輪物件池**
   - 於載入階段先依滾輪欄位預熱符號、特效、音源節點池。  
   - 提供 `PoolStats` 調試資訊，目標是在連續中獎時減少超過 80% 的 GC 峰值。

2. **視野驅動的動畫預算**
   - 建立 `SymbolViewportCuller`，依滾輪遮罩狀態啟停 spine／particle。  
   - 滾輪離開畫面時改用預渲染圖，回到可視範圍再切回動態骨骼。

3. **幀預算守門機制**
   - 以輕量 profiler（例如 `PerformanceTimer`）包覆 `update()`、`HandleBroadcast`。  
   - 彙整各狀態轉換的平均耗時，監控是否超過 4 ms。

4. **音訊混音服務化**
   - 以集中 `AudioBus` 管理播放／停止／淡入淡出，取代零散的 `getComponent(AudioSource)`。  
   - 只保留固定數量的 `AudioSource` 元件重複使用，避免執行期新增元件。

5. **粒子與物理節流**
   - 對慶祝粒子在非中獎時調整 `simulatorSpeed = 0`，暫停更新。  
   - 確認 `ParticleSystem.AutoRemoveOnFinish` 啟用，釋放 GPU 記憶體。

6. **動態圖集與貼圖串流**
   - 確認常用 UI 素材（如 `symbolSheet.png`）已納入動態或預先打包的圖集以降低 draw call。  
   - 針對大型貼圖提供 LOD：先載入低解析版本，必要時再替換成高解析。

### 2.3 工具推薦
- 在測試環境開啟 Cocos Profiler HUD，於 Turbo／SlowMotion 壓力測試下記錄幀時間與 draw call。  
- 建立 E2E 自動化測試：執行自動旋轉、觸發特效，統計平均 FPS 與 CPU 使用率，並於每次提交輸出圖表。

---

## 3. 維護性強化

### 3.1 既有痛點
- 場景節點路徑大量硬編成字串（如 `"Canvas/BaseGame/..."`），分散於多個模組。  
- TypeScript 組態介面未明確定義，部分 API 仍返回 `any`。  
- 錯誤處理不一致：部分載入失敗僅 `return`，未回報或提供後備方案。  
- `docs/` 內 60+ 篇 Markdown 缺乏統一規範，新人上手需依賴口耳傳承。

### 3.2 行動方案
1. **集中式路徑註冊表**
   - 建立 `assets/script/config/ScenePaths.ts`，以具型別的存取函式（如 `getReelColumn(index: number)`）。  
   - 以註冊表替換散落的 `find()` 字串，讓編譯時即可發現錯誤。

2. **型別化資源配置**
   - 針對 `LoadSource` 定義 `ResourceDescriptor`、`BundleDescriptor` 介面，統一載入流程。  
   - 將原生 JSON 陣列改以 `.d.ts` 或 zod 驗證，提升執行期防護力。

3. **統一錯誤與遙測管線**
   - 導入 `ErrorTracker.report(error, context, payload)`，連結伺服器日誌。  
   - 區分可回復錯誤（改用預設資源）與嚴重錯誤（跳錯誤視窗），並紀錄事件。

4. **模組化文件系統**
   - 撰寫 `docs/game169/README.md` 作為入口，依主題（Shader、Bundle、Performance）建立索引。  
   - 以 PR 模板要求更新各子系統的變更紀錄（Reel、UI、本地化等）。

5. **測試與驗證規劃**
   - 使用 Jest 為 `SymbolNodeCache`、`SymbolAnimationController`、`LanguageResourceManager` 建立單元測試。  
   - 新增冒煙測試：自動旋轉 → 進入特殊關卡 → 驗證事件總線輸出。

### 3.3 治理建議
- 每兩週安排技術債檢視會議，集中評估上述維護性項目。  
- 為 `assets/script/ReelController`、`assets/script/UIController` 指定 codeowner，確保風格一致。

---

## 4. 路線圖摘要

| 優先級 | 項目 | 負責團隊 | 預估工期 | 成功指標 |
|--------|------|----------|----------|-----------|
| P0 | 紋理壓縮＋語系資產重構 | 客戶端建置、美術 | 3 天 | 核心 bundle < 20 MB |
| P0 | 符號／滾輪物件池與動畫裁切 | Reel 團隊 | 5 天 | 連續中獎時 FPS +10 |
| P1 | 音訊重新編碼流程 | 音效／技術美術 | 2 天 | 音訊 bundle < 4 MB |
| P1 | 型別化配置與路徑註冊表 | 平台組 | 4 天 | 編譯期擋下型別錯誤 |
| P2 | 遙測整合＋文件重整 | 共享資源組 | 1 個 Sprint | 平均除錯時間 < 30 分 |

---

## 5. 結論

透過平台導向的資產壓縮、延後下載非必要內容，以及在執行階段運用物件池與視野管理，可望將首次載入體積縮減 **~60%**，並將高負載情境下的 FPS 提升至 50 高段。搭配型別化設定、路徑註冊表與系統化文件，能有效降低新成員上手所需時間，並降低功能演進時的回歸風險。

在排除 `console.log()` 影響後，優化重點更能聚焦於結構性提升，為遊戲長期營運奠定穩定基礎。
