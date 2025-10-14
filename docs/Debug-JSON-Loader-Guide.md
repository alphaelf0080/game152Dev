# 好運咚咚 - 讀取本地遊戲結果 JSON 使用指南

## 目錄
1. [概述](#概述)
2. [功能特點](#功能特點)
3. [快速開始](#快速開始)
4. [詳細實作步驟](#詳細實作步驟)
5. [使用方式](#使用方式)
6. [進階功能](#進階功能)
7. [故障排除](#故障排除)

---

## 概述

`LocalServerMode` 是一個 Debug 功能，用於在 Cocos Creator 中完全替代遊戲伺服器，直接從本地 JSON 檔案讀取遊戲結果。當啟用 `localServer` 模式時，遊戲將：

1. **跳過開發伺服器連線** - 不需要連接任何遊戲伺服器
2. **初始化時載入 JSON** - 自動載入指定的本地結果檔案
3. **Spin 時取結果** - 每次按下 SPIN 按鈕時，從 JSON 中依序取出一場結果
4. **自動套用表演** - 將結果自動套用到遊戲表演（滾輪、贏線、特效等）

### 使用場景

- ✅ **離線開發** - 完全不需要遊戲伺服器即可開發測試
- ✅ **固定結果測試** - 使用預設的結果序列測試遊戲邏輯
- ✅ **特定場景重現** - 準確重現問題或展示特定獎項
- ✅ **演示模式** - 用於展示、錄製影片或客戶展示
- ✅ **效能測試** - 排除網路因素的純客戶端效能測試

---

## 功能特點

### 1. 自動化離線模式
- **啟動參數檢測** - 檢測 URL 參數 `localServer=true`
- **自動載入結果** - 初始化時自動載入指定 JSON 檔案
- **替代伺服器** - 完全跳過遊戲伺服器連線邏輯

### 2. Spin 自動取結果
- **依序取結果** - 每次 SPIN 按鈕觸發時自動取下一場結果
- **循環播放** - 結果用完後自動從頭開始
- **即時套用** - 結果直接套用到遊戲表演

### 3. 完整的遊戲流程模擬
- **Proto 格式解析** - 自動解析模擬器產生的標準格式
- **遊戲狀態管理** - 處理點數、贏分、免費旋轉等狀態
- **特效觸發** - 自動觸發對應的遊戲特效和動畫

---

## 快速開始

### 前置需求

1. 已經使用模擬器產生 JSON 結果檔案
2. Cocos Creator 專案已正常運行
3. 基本的 TypeScript 和 Cocos Creator 知識

### 30 秒快速開始

```bash
# 1. 產生測試 JSON（在 gameServer 目錄）
cd gameServer
#python3 main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/local_results


python main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/local_results

# 2. 整合 LocalServerMode 到遊戲（一次性設置）

# 3. 啟動遊戲時加上參數
# 瀏覽器：http://localhost:7456/?localServer=true
# 或在編輯器的 Preview 設置中添加 URL 參數

# 4. 直接玩遊戲！
# - 按 SPIN 按鈕 → 自動從 JSON 取結果
# - 完全不需要連接伺服器
```

---

## 詳細實作步驟

### 步驟 1: 創建 LocalServerMode 核心腳本

在 `pss-on-00152/assets/script/` 下創建 `LocalServer/` 資料夾：

```
script/
└── LocalServer/
    ├── LocalServerMode.ts      (主要核心)
    ├── URLParamParser.ts       (URL 參數解析)
    └── LocalResultProvider.ts  (結果提供者)
```

#### LocalServerMode.ts（主要核心）

```typescript
import { _decorator, Component, resources, JsonAsset, sys } from 'cc';
import { URLParamParser } from './URLParamParser';
const { ccclass, property } = _decorator;

/**
 * 本地伺服器模式 - 替代遊戲伺服器
 * 當 URL 參數包含 localServer=true 時啟用
 */
@ccclass('LocalServerMode')
export class LocalServerMode extends Component {
    @property
    defaultJsonPath: string = 'local_results/batch_results';
    
    @property
    enableMode: boolean = false; // 是否啟用本地模式
    
    private allResults: any[] = [];
    private currentIndex: number = 0;
    private isInitialized: boolean = false;
    
    // 單例模式
    private static _instance: LocalServerMode = null;
    
    public static get Instance(): LocalServerMode {
        return LocalServerMode._instance;
    }
    
    onLoad() {
        // 設置單例
        if (LocalServerMode._instance) {
            this.node.destroy();
            return;
        }
        LocalServerMode._instance = this;
        
        // 檢查 URL 參數
        this.checkURLParams();
    }
    
    /**
     * 檢查 URL 參數決定是否啟用本地模式
     */
    private checkURLParams() {
        const urlParams = URLParamParser.parseURL();
        
        // 檢查是否有 localServer 參數
        if (urlParams.localServer === 'true' || urlParams.localServer === '1') {
            this.enableMode = true;
            console.log('[LocalServerMode] 已啟用本地伺服器模式');
            
            // 如果有指定 JSON 路徑，使用指定的路徑
            if (urlParams.jsonPath) {
                this.defaultJsonPath = urlParams.jsonPath;
            }
            
            // 初始化載入結果
            this.initializeLocalResults();
        } else {
            this.enableMode = false;
            console.log('[LocalServerMode] 使用正常伺服器模式');
        }
    }
    
    /**
     * 初始化：載入本地 JSON 結果檔案
     */
    private initializeLocalResults() {
        console.log(`[LocalServerMode] 開始載入結果: ${this.defaultJsonPath}`);
        
        resources.load(this.defaultJsonPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error('[LocalServerMode] 載入結果失敗:', err);
                console.error('[LocalServerMode] 請確認檔案位於 assets/resources/ 目錄下');
                this.enableMode = false;
                return;
            }
            
            try {
                const jsonData = jsonAsset.json;
                
                if (jsonData.results && Array.isArray(jsonData.results)) {
                    this.allResults = jsonData.results;
                    this.currentIndex = 0;
                    this.isInitialized = true;
                    
                    console.log(`[LocalServerMode] 載入成功: ${this.allResults.length} 筆結果`);
                    console.log('[LocalServerMode] Session ID:', jsonData.session_info?.session_id);
                    
                    // 發送初始化完成事件
                    this.node.emit('local-server-ready', {
                        totalResults: this.allResults.length,
                        sessionInfo: jsonData.session_info
                    });
                } else {
                    console.error('[LocalServerMode] JSON 格式錯誤：找不到 results 陣列');
                    this.enableMode = false;
                }
            } catch (error) {
                console.error('[LocalServerMode] 解析 JSON 失敗:', error);
                this.enableMode = false;
            }
        });
    }
    
    /**
     * 檢查是否啟用本地模式
     */
    public isLocalMode(): boolean {
        return this.enableMode && this.isInitialized;
    }
    
    /**
     * 獲取下一場遊戲結果（每次 SPIN 時調用）
     * @returns 遊戲結果物件，如果沒有更多結果則循環
     */
    public getNextResult(): any {
        if (!this.isInitialized || this.allResults.length === 0) {
            console.error('[LocalServerMode] 尚未初始化或沒有可用結果');
            return null;
        }
        
        // 獲取當前結果
        const resultData = this.allResults[this.currentIndex];
        const protoResult = resultData.result_recall?.result;
        
        if (!protoResult) {
            console.error('[LocalServerMode] 結果格式錯誤:', resultData);
            this.currentIndex = (this.currentIndex + 1) % this.allResults.length;
            return null;
        }
        
        // 轉換為遊戲格式
        const gameResult = this.convertToGameResult(protoResult, this.currentIndex + 1);
        
        // 移到下一個結果（循環）
        this.currentIndex = (this.currentIndex + 1) % this.allResults.length;
        
        console.log(`[LocalServerMode] 提供結果 ${this.currentIndex}/${this.allResults.length}:`, {
            credit: gameResult.totalWin,
            multiplier: gameResult.multiplier,
            hasFreeSpin: !!gameResult.freeSpins
        });
        
        // 如果循環一輪了，記錄一下
        if (this.currentIndex === 0) {
            console.log('[LocalServerMode] 結果已循環，重新開始');
        }
        
        return gameResult;
    }
    
    /**
     * 轉換 Proto 格式到遊戲格式
     */
    private convertToGameResult(protoResult: any, spinNumber: number): any {
        return {
            spinNumber: spinNumber,
            reels: this.convertSymbolPattern(protoResult.random_syb_pattern),
            winLines: this.convertWinLines(protoResult.win_line_group),
            totalWin: protoResult.credit || 0,
            multiplier: protoResult.external_multiplier || 1,
            freeSpins: this.convertBonusGroup(protoResult.win_bonus_group),
            rawProtoData: protoResult // 保留原始資料
        };
    }
    
    /**
     * 轉換符號圖案：Proto 一維陣列 [15] → 遊戲 5x3 二維陣列
     */
    private convertSymbolPattern(pattern: number[]): number[][] {
        if (!pattern || pattern.length !== 15) {
            console.warn('[LocalServerMode] 符號圖案長度錯誤');
            return [[], [], [], [], []];
        }
        
        const reels: number[][] = [[], [], [], [], []];
        
        // Proto 格式: [r0s0, r0s1, r0s2, r1s0, r1s1, r1s2, ...]
        // 轉換為: [[r0s0, r0s1, r0s2], [r1s0, r1s1, r1s2], ...]
        for (let i = 0; i < pattern.length; i++) {
            const reelIndex = Math.floor(i / 3);
            reels[reelIndex].push(pattern[i]);
        }
        
        return reels;
    }
    
    /**
     * 轉換贏線資訊
     */
    private convertWinLines(winLineGroup: any[]): any[] {
        if (!winLineGroup || winLineGroup.length === 0) {
            return [];
        }
        
        return winLineGroup.map(winLine => ({
            type: winLine.win_line_type || 0,
            lineNo: winLine.line_no,
            symbolId: winLine.symbol_id,
            positions: winLine.pos || [],
            credit: winLine.credit || 0,
            multiplier: winLine.multiplier || 1
        }));
    }
    
    /**
     * 轉換獎勵群組（免費旋轉等）
     */
    private convertBonusGroup(bonusGroup: any[]): any {
        if (!bonusGroup || bonusGroup.length === 0) {
            return null;
        }
        
        const bonus = bonusGroup[0];
        return {
            type: bonus.win_bonus_type,
            count: bonus.win_bonus_count || 0,
            isRetrigger: bonus.is_retrigger || false
        };
    }
    
    /**
     * 獲取當前狀態資訊
     */
    public getStatusInfo(): any {
        return {
            enabled: this.enableMode,
            initialized: this.isInitialized,
            totalResults: this.allResults.length,
            currentIndex: this.currentIndex,
            remainingResults: this.allResults.length - this.currentIndex
        };
    }
    
    /**
     * 重置到第一個結果
     */
    public reset() {
        this.currentIndex = 0;
        console.log('[LocalServerMode] 已重置到第一個結果');
    }
}
```

#### URLParamParser.ts（URL 參數解析工具）

```typescript
import { sys } from 'cc';

/**
 * URL 參數解析器
 */
export class URLParamParser {
    /**
     * 解析當前 URL 的參數
     * @returns 參數物件 { key: value }
     */
    public static parseURL(): Record<string, string> {
        const params: Record<string, string> = {};
        
        // 只在瀏覽器環境下解析
        if (sys.isBrowser) {
            const url = window.location.href;
            const queryString = url.split('?')[1];
            
            if (queryString) {
                const pairs = queryString.split('&');
                
                for (const pair of pairs) {
                    const [key, value] = pair.split('=');
                    if (key) {
                        params[decodeURIComponent(key)] = decodeURIComponent(value || 'true');
                    }
                }
            }
        }
        
        return params;
    }
    
    /**
     * 獲取單一參數值
     */
    public static getParam(key: string): string | null {
        const params = this.parseURL();
        return params[key] || null;
    }
    
    /**
     * 檢查參數是否存在且為 true
     */
    public static isParamTrue(key: string): boolean {
        const value = this.getParam(key);
        return value === 'true' || value === '1';
    }
}
```

```

## 三、使用方法

### 3.1 開發環境配置

#### 準備 JSON 結果檔案

使用遊戲模擬器產生測試數據：

```bash
cd gameServer

# 產生 100 次一般旋轉結果
python main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/local_results

# 產生特定場景測試
python main.py --simulate 50 --feature big_win --json --json-dir ../pss-on-00152/assets/resources/local_results

# 產生免費旋轉測試
python main.py --simulate 20 --feature free_spins --json --json-dir ../pss-on-00152/assets/resources/local_results
```

#### 檔案結構

```
pss-on-00152/assets/resources/local_results/
├── batch_results_20251013_100_spins.json    # 主要使用
├── test_big_win.json                        # 大獎測試
├── test_free_spins.json                     # 免費旋轉測試  
└── demo_showcase.json                       # 展示模式
```

**注意事項**：
- 檔案必須放在 `assets/resources/` 目錄下
- LocalServerMode 的路徑設置不需要 `resources/` 前綴
- 路徑不需要包含 `.json` 副檔名

### 3.2 編輯器設置

#### 步驟 1: 創建 LocalServerMode 節點

1. 打開 `main.scene` 或 `load.scene`
2. 在場景根節點下創建新節點
3. 命名為 `LocalServerMode`
4. 添加 `LocalServerMode` 組件
5. 設置為持久節點（如需要跨場景使用）

#### 步驟 2: 配置組件屬性

在 Inspector 面板中設置：

```
LocalServerMode 組件:
└── Default Json Path: "local_results/batch_results_20251013_100_spins"
```

**說明**：
- `enableMode` 屬性由 URL 參數自動控制，無需手動設置
- 路徑使用相對於 `resources/` 的路徑
- 系統會自動添加 `.json` 副檔名

#### 步驟 3: 連接到 GameController

在 GameController 節點上：

1. 找到或添加 `GameController` 組件
2. 將 `LocalServerMode` 節點拖入 `localServerNode` 屬性

### 3.3 啟動本地模式

#### 瀏覽器中啟動

在 URL 後添加參數：

```
# 本地預覽
http://localhost:7456/?localServer=true

# 指定其他 JSON 檔案
http://localhost:7456/?localServer=true&jsonPath=local_results/test_big_win

# 多個參數組合
http://localhost:7456/?localServer=true&jsonPath=local_results/demo&debug=true
```

#### 程式中啟動（可選）

也可以在程式中強制啟用：

```typescript
// 在 GameController 或初始化腳本中
const localServer = this.node.getComponent(LocalServerMode);
if (localServer) {
    localServer.enableMode = true;
    // 系統會自動載入 JSON
}
    
    /**
     * 處理批量遊戲結果
     */
    private processBatchResults(results: any[]) {
        // 過濾結果
        let filteredResults = results;
        if (this.filterMinWin > 0) {
            filteredResults = results.filter(r => {
                const credit = r.result_recall?.result?.credit || 0;
                return credit >= this.filterMinWin;
            });
            console.log(`[DebugJSONLoader] 過濾後: ${filteredResults.length}/${results.length} 筆結果`);
        }
        
        this.allResults = filteredResults;
        this.currentResultIndex = 0;
        
        if (this.loopPlayback) {
            this.startLoopPlayback();
        } else {
            // 一次性套用所有結果
            this.applyNextResult();
        }
    }
    
    /**
     * 套用下一個結果
     */
    private applyNextResult() {
        if (this.currentResultIndex >= this.allResults.length) {
            console.log('[DebugJSONLoader] 所有結果已套用');
            return;
        }
        
        const resultData = this.allResults[this.currentResultIndex];
        const protoResult = resultData.result_recall?.result;
        
        if (protoResult) {
            this.applyGameResult(protoResult, this.currentResultIndex + 1);
        }
        
        this.currentResultIndex++;
    }
    
    /**
     * 開始循環播放
     */
    private startLoopPlayback() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        console.log(`[DebugJSONLoader] 開始循環播放，延遲: ${this.playbackDelay}秒`);
        
        this.schedule(() => {
            if (this.currentResultIndex >= this.allResults.length) {
                this.currentResultIndex = 0; // 循環重播
                console.log('[DebugJSONLoader] 循環重新開始');
            }
            
            this.applyNextResult();
        }, this.playbackDelay);
    }
    
    /**
     * 停止循環播放
     */
    public stopLoopPlayback() {
        this.unscheduleAllCallbacks();
        this.isPlaying = false;
        console.log('[DebugJSONLoader] 停止循環播放');
    }
    
    /**
     * 套用單次遊戲結果
     */
    private applyGameResult(result: any, spinNumber: number) {
        console.log(`[DebugJSONLoader] 套用第 ${spinNumber} 次結果:`, {
            credit: result.credit,
            symbols: result.random_syb_pattern?.length,
            winLines: result.win_line_group?.length || 0,
            multiplier: result.external_multiplier || 1
        });
        
        // 轉換 Proto 格式到遊戲格式
        const gameResult = {
            spinNumber: spinNumber,
            reels: this.convertSymbolPattern(result.random_syb_pattern),
            winLines: this.convertWinLines(result.win_line_group),
            totalWin: result.credit || 0,
            multiplier: result.external_multiplier || 1,
            freeSpins: this.convertBonusGroup(result.win_bonus_group),
            rawProtoData: result // 保留原始資料供進階使用
        };
        
        // 發送事件通知遊戲控制器
        this.node.emit('debug-result-loaded', gameResult);
        
        // 也可以直接調用遊戲控制器（需要引用）
        // if (this.gameController) {
        //     this.gameController.processPreloadedResult(gameResult);
        // }
    }
    
    /**
     * 轉換符號圖案：Proto 一維陣列 → 遊戲 5x3 二維陣列
     */
    private convertSymbolPattern(pattern: number[]): number[][] {
        if (!pattern || pattern.length !== 15) {
            console.warn('[DebugJSONLoader] 符號圖案格式錯誤');
            return [[], [], [], [], []];
        }
        
        const reels: number[][] = [[], [], [], [], []];
        
        // Proto 格式: [r0s0, r0s1, r0s2, r1s0, r1s1, r1s2, ...]
        for (let i = 0; i < pattern.length; i++) {
            const reelIndex = Math.floor(i / 3);
            reels[reelIndex].push(pattern[i]);
        }
        
        return reels;
    }
    
    /**
     * 轉換贏線資訊
     */
    private convertWinLines(winLineGroup: any[]): any[] {
        if (!winLineGroup || winLineGroup.length === 0) {
            return [];
        }
        
        return winLineGroup.map(winLine => ({
            type: winLine.win_line_type || 0,
            lineNo: winLine.line_no,
            symbolId: winLine.symbol_id,
            positions: winLine.pos || [],
            credit: winLine.credit || 0,
            multiplier: winLine.multiplier || 1
        }));
    }
    
    /**
     * 轉換獎勵群組（免費旋轉等）
     */
    private convertBonusGroup(bonusGroup: any[]): any {
        if (!bonusGroup || bonusGroup.length === 0) {
            return null;
        }
        
        const bonus = bonusGroup[0];
        return {
            type: bonus.win_bonus_type,
            count: bonus.win_bonus_count || 0,
            isRetrigger: bonus.is_retrigger || false
        };
    }
    
    /**
     * 手動載入按鈕觸發
     */
    public onLoadButtonClick() {
        this.loadJSONResults();
    }
    
    /**
     * 設定 JSON 檔案路徑
     */
    public setJSONPath(path: string) {
        this.jsonFilePath = path;
        console.log(`[DebugJSONLoader] 設定路徑: ${path}`);
    }
    
    /**
     * 獲取當前載入的結果資訊
     */
    public getLoadedInfo(): any {
        return {
            totalResults: this.allResults.length,
            currentIndex: this.currentResultIndex,
            isPlaying: this.isPlaying
        };
    }
    
    onDestroy() {
        this.stopLoopPlayback();
    }
}
```

### 步驟 2: 整合到遊戲主控制器

修改遊戲的主控制器來檢查並使用本地模式：

```typescript
// filepath: pss-on-00152/assets/script/GameController.ts
import { _decorator, Component, Node, find } from 'cc';
import { LocalServerMode } from './LocalServer/LocalServerMode';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    localServerNode: Node = null;
    
    private localServerMode: LocalServerMode = null;
    private isUsingLocalServer: boolean = false;
    
    start() {
        // 初始化本地伺服器模式
        this.initializeLocalServer();
        
        // 根據模式決定初始化邏輯
        if (this.isUsingLocalServer) {
            console.log('[GameController] 使用本地伺服器模式');
            this.initializeLocalMode();
        } else {
            console.log('[GameController] 使用正常伺服器模式');
            this.initializeNormalMode();
        }
    }
    
    /**
     * 初始化本地伺服器模式
     */
    private initializeLocalServer() {
        // 查找或創建 LocalServerMode
        if (!this.localServerNode) {
            this.localServerNode = find('LocalServerMode');
        }
        
        if (this.localServerNode) {
            this.localServerMode = this.localServerNode.getComponent(LocalServerMode);
            
            if (this.localServerMode && this.localServerMode.isLocalMode()) {
                this.isUsingLocalServer = true;
                
                // 監聽本地伺服器就緒事件
                this.localServerNode.on('local-server-ready', this.onLocalServerReady, this);
            }
        }
    }
    
    /**
     * 本地伺服器就緒回調
     */
    private onLocalServerReady(data: any) {
        console.log('[GameController] 本地伺服器已就緒:', data);
        // 可以在這裡進行額外的初始化
    }
    
    /**
     * 初始化本地模式
     */
    private initializeLocalMode() {
        // 跳過伺服器連線
        console.log('[GameController] 跳過伺服器連線');
        
        // 初始化遊戲 UI
        this.initializeGameUI();
        
        // 設置初始點數（本地模式使用固定點數或從 JSON 讀取）
        this.setPlayerCredit(10000);
        
        // 啟用遊戲控制
        this.enableGameControls();
    }
    
    /**
     * 初始化正常模式
     */
    private initializeNormalMode() {
        // 連接遊戲伺服器
        this.connectToGameServer();
        
        // ... 其他正常初始化邏輯
    }
    
    /**
     * SPIN 按鈕點擊處理
     */
    public onSpinButtonClick() {
        if (this.isUsingLocalServer) {
            // 本地模式：從 LocalServerMode 獲取結果
            this.handleLocalSpin();
        } else {
            // 正常模式：向伺服器請求
            this.handleNormalSpin();
        }
    }
    
    /**
     * 處理本地模式的 SPIN
     */
    private handleLocalSpin() {
        console.log('[GameController] 本地 SPIN');
        
        // 檢查是否可以開始遊戲
        if (!this.canStartSpin()) {
            return;
        }
        
        // 禁用 SPIN 按鈕
        this.disableSpinButton();
        
        // 從本地伺服器獲取結果
        const result = this.localServerMode.getNextResult();
        
        if (!result) {
            console.error('[GameController] 無法獲取本地結果');
            this.enableSpinButton();
            return;
        }
        
        // 扣除下注金額（本地模式可以是模擬的）
        this.deductBet();
        
        // 套用結果到遊戲
        this.applyGameResult(result);
    }
    
    /**
     * 處理正常模式的 SPIN
     */
    private handleNormalSpin() {
        console.log('[GameController] 正常 SPIN - 向伺服器請求');
        
        // ... 原有的伺服器請求邏輯
        // this.sendSpinRequest();
    }
    
    /**
     * 套用遊戲結果到表演
     */
    private applyGameResult(result: any) {
        console.log('[GameController] 套用遊戲結果:', {
            spinNumber: result.spinNumber,
            totalWin: result.totalWin,
            multiplier: result.multiplier
        });
        
        // 開始遊戲序列
        this.startGameSequence(result);
    }
    
    /**
     * 開始遊戲表演序列
     */
    private async startGameSequence(result: any) {
        try {
            // 1. 開始滾輪旋轉
            await this.startReelSpin(result.reels);
            
            // 2. 停止滾輪並顯示結果
            await this.stopReelSpin(result.reels);
            
            // 3. 檢查並顯示贏線
            if (result.winLines.length > 0) {
                await this.showWinLines(result.winLines);
            }
            
            // 4. 顯示倍率特效
            if (result.multiplier > 1) {
                await this.showMultiplierEffect(result.multiplier);
            }
            
            // 5. 更新贏分
            if (result.totalWin > 0) {
                await this.showWinAmount(result.totalWin);
                this.addPlayerCredit(result.totalWin);
            }
            
            // 6. 檢查免費旋轉觸發
            if (result.freeSpins) {
                await this.triggerFreeSpins(result.freeSpins);
            }
            
            // 7. 完成，重新啟用按鈕
            this.enableSpinButton();
            
        } catch (error) {
            console.error('[GameController] 遊戲序列錯誤:', error);
            this.enableSpinButton();
        }
    }
    
    /**
     * 開始滾輪旋轉（需要根據專案實際的 ReelController 實作）
     */
    private startReelSpin(targetReels: number[][]): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 開始滾輪旋轉');
            
            // 設置目標符號
            // this.reelController.setTargetSymbols(targetReels);
            
            // 開始旋轉動畫
            // this.reelController.startSpin();
            
            // 模擬旋轉時間（實際應該監聽 ReelController 的完成事件）
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
    
    /**
     * 停止滾輪（需要根據專案實際的 ReelController 實作）
     */
    private stopReelSpin(targetReels: number[][]): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 停止滾輪');
            
            // 停止滾輪並顯示結果
            // this.reelController.stopSpin();
            
            // 模擬停止動畫時間
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
    
    /**
     * 顯示贏線（需要根據專案實際的 WinLineController 實作）
     */
    private showWinLines(winLines: any[]): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 顯示贏線:', winLines.length);
            
            // 顯示贏線動畫
            // this.winLineController.showWinLines(winLines);
            
            // 模擬贏線動畫時間
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }
    
    /**
     * 顯示倍率特效
     */
    private showMultiplierEffect(multiplier: number): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 顯示倍率:', multiplier);
            
            // 播放倍率特效
            // this.multiplierEffectController.show(multiplier);
            
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }
    
    /**
     * 顯示贏分
     */
    private showWinAmount(amount: number): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 顯示贏分:', amount);
            
            // 播放贏分數字跳動動畫
            // this.winAmountDisplay.countUp(amount);
            
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
    
    /**
     * 觸發免費旋轉
     */
    private triggerFreeSpins(freeSpinData: any): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 觸發免費旋轉:', freeSpinData);
            
            // 播放免費旋轉觸發動畫
            // this.freeSpinController.trigger(freeSpinData.count);
            
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }
    
    // 輔助方法
    private canStartSpin(): boolean {
        // 檢查是否可以開始 SPIN
        return true; // 實際需要檢查遊戲狀態、餘額等
    }
    
    private disableSpinButton() {
        // 禁用 SPIN 按鈕
        console.log('[GameController] 禁用 SPIN 按鈕');
    }
    
    private enableSpinButton() {
        // 啟用 SPIN 按鈕
        console.log('[GameController] 啟用 SPIN 按鈕');
    }
    
    private deductBet() {
        // 扣除下注金額
        console.log('[GameController] 扣除下注');
    }
    
    private setPlayerCredit(amount: number) {
        // 設置玩家點數
        console.log('[GameController] 設置點數:', amount);
    }
    
    private addPlayerCredit(amount: number) {
        // 增加玩家點數
        console.log('[GameController] 增加點數:', amount);
    }
    
    private connectToGameServer() {
        // 連接遊戲伺服器
        console.log('[GameController] 連接伺服器');
    }
    
    private initializeGameUI() {
        // 初始化遊戲 UI
        console.log('[GameController] 初始化 UI');
    }
    
    private enableGameControls() {
        // 啟用遊戲控制
        console.log('[GameController] 啟用遊戲控制');
    }
}
```

@ccclass('DebugLoadButton')
export class DebugLoadButton extends Component {
    @property(DebugJSONLoader)
    jsonLoader: DebugJSONLoader = null;
    
    @property(Button)
    loadButton: Button = null;
    
    @property(Button)
    stopButton: Button = null;
    
    @property(Label)
    infoLabel: Label = null;
    
    start() {
        if (this.loadButton) {
            this.loadButton.node.on('click', this.onLoadClick, this);
        }
        
        if (this.stopButton) {
            this.stopButton.node.on('click', this.onStopClick, this);
        }
        
        this.schedule(this.updateInfo, 0.5);
    }
    
    onLoadClick() {
        if (this.jsonLoader) {
            this.jsonLoader.onLoadButtonClick();
        }
    }
    
    onStopClick() {
        if (this.jsonLoader) {
            this.jsonLoader.stopLoopPlayback();
        }
    }
    
    updateInfo() {
        if (!this.jsonLoader || !this.infoLabel) return;
        
        const info = this.jsonLoader.getLoadedInfo();
        this.infoLabel.string = `Results: ${info.currentIndex}/${info.totalResults}\n` +
                                 `Playing: ${info.isPlaying}`;
    }
}
```

### 步驟 2: 準備 JSON 檔案

#### 2.1 使用模擬器產生 JSON

```bash
cd gameServer

# 產生 100 次旋轉的結果
python main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/debug

# 產生特定場景（大獎、免費旋轉等）
python main.py --simulate 50 --json --json-dir ../pss-on-00152/assets/resources/debug
```

#### 2.2 檔案放置位置

```
pss-on-00152/assets/resources/debug/
├── batch_results_20251013_174940_100_spins.json
├── summary_report_1760349018.json
├── test_big_win.json
└── test_free_spins.json
```

**重要**：
- JSON 檔案必須放在 `assets/resources/` 目錄下
- 載入時路徑不需要包含 `resources/` 前綴和 `.json` 副檔名

### 步驟 3: 在編輯器中設定

#### 3.1 創建 Debug 節點

在 Cocos Creator 編輯器中：

1. 打開 `main.scene`
2. 在 `Canvas` 下創建新節點 `DebugManager`
3. 添加組件 `DebugJSONLoader`

#### 3.2 配置組件屬性

```
DebugJSONLoader 組件屬性:
├── Json File Path: "debug/batch_results_20251013_174940_100_spins"
├── Auto Load: false (首次測試建議關閉)
├── Loop Playback: false
├── Playback Delay: 2.0
└── Filter Min Win: 0
```

#### 3.3 創建控制 UI（選用）

如果需要手動控制：

```
Canvas/
└── UI/
    └── DebugPanel/
        ├── LoadButton (Button)
        ├── StopButton (Button)
        └── InfoLabel (Label)
```

為 `DebugPanel` 添加 `DebugLoadButton` 組件，並連接引用。

### 步驟 4: 整合到遊戲控制器

修改或創建遊戲控制器來處理載入的結果：

```typescript
// filepath: pss-on-00152/assets/script/GameController.ts
import { _decorator, Component, Node } from 'cc';
import { DebugJSONLoader } from './Debug/DebugJSONLoader';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    debugManager: Node = null;
    
    start() {
        // 監聽 Debug 結果載入事件
        if (this.debugManager) {
            this.debugManager.on('debug-result-loaded', this.onDebugResultLoaded, this);
        }
    }
    
    /**
     * 處理預載的遊戲結果（用於 Debug）
     */
    private onDebugResultLoaded(gameResult: any) {
        console.log('[GameController] 收到 Debug 結果:', gameResult.spinNumber);
        
        // 設定滾輪結果
        this.setReelResults(gameResult.reels);
        
        // 設定贏線
        this.setWinLines(gameResult.winLines);
        
        // 設定總贏分
        this.updateWinAmount(gameResult.totalWin);
        
        // 設定倍率
        if (gameResult.multiplier > 1) {
            this.showMultiplier(gameResult.multiplier);
        }
        
        // 處理免費旋轉觸發
        if (gameResult.freeSpins) {
            this.triggerFreeSpins(gameResult.freeSpins);
        }
        
        // 開始播放遊戲動畫
        this.playGameSequence();
    }
    
    /**
     * 設定滾輪結果
     */
    private setReelResults(reels: number[][]) {
        // 實作依據專案的 ReelController
        console.log('[GameController] 設定滾輪結果:', reels);
        
        // 範例：
        // this.reelController.setTargetSymbols(reels);
    }
    
    /**
     * 設定贏線
     */
    private setWinLines(winLines: any[]) {
        console.log('[GameController] 設定贏線:', winLines.length);
        
        // 範例：
        // this.winLineController.setWinLines(winLines);
    }
    
    /**
     * 更新贏分顯示
     */
    private updateWinAmount(amount: number) {
        console.log('[GameController] 更新贏分:', amount);
        
        // 範例：
        // this.creditDisplay.updateWinAmount(amount);
    }
    
    /**
     * 顯示倍率
     */
    private showMultiplier(multiplier: number) {
        console.log('[GameController] 顯示倍率:', multiplier);
        
        // 範例：
        // this.multiplierDisplay.show(multiplier);
    }
    
    /**
     * 觸發免費旋轉
     */
    private triggerFreeSpins(freeSpinData: any) {
        console.log('[GameController] 觸發免費旋轉:', freeSpinData);
        
        // 範例：
        // this.freeSpinController.trigger(freeSpinData.count);
    }
    
    /**
     * 播放遊戲序列動畫
     */
    private playGameSequence() {
        // 實作遊戲的完整動畫序列
        // 1. 滾輪旋轉
        // 2. 停止
        // 3. 顯示贏線
        // 4. 播放特效
        // 5. 更新點數
    }
}
```

---

## 使用方式

### 方式 1: 自動載入模式

最簡單的使用方式，適合快速測試：

```typescript
// 在編輯器中設定
DebugJSONLoader:
├── jsonFilePath: "debug/test_results"
└── autoLoad: true  // 啟用自動載入
```

遊戲啟動時會自動載入並開始播放結果。

### 方式 2: 手動載入模式

需要手動控制載入時機：

```typescript
// 在編輯器中設定
DebugJSONLoader:
├── jsonFilePath: "debug/test_results"
└── autoLoad: false  // 關閉自動載入

// 在程式碼中手動觸發
const loader = this.debugManager.getComponent(DebugJSONLoader);
loader.loadJSONResults();
```

### 方式 3: 循環播放模式

持續重複播放，適合展示和壓力測試：

```typescript
// 在編輯器中設定
DebugJSONLoader:
├── jsonFilePath: "debug/test_results"
├── loopPlayback: true  // 啟用循環播放
└── playbackDelay: 2.0  // 每 2 秒播放一次
```

### 方式 4: 動態切換 JSON 檔案

```typescript
const loader = this.debugManager.getComponent(DebugJSONLoader);

// 載入大獎場景
loader.setJSONPath("debug/test_big_win");
loader.loadJSONResults();

// 載入免費旋轉場景
loader.setJSONPath("debug/test_free_spins");
loader.loadJSONResults();
```

---

## 進階功能

### 1. 結果過濾

只載入符合特定條件的結果：

```typescript
// 在編輯器中設定
DebugJSONLoader:
└── filterMinWin: 500  // 只載入贏分 >= 500 的結果

// 或在程式碼中動態設定
const loader = this.debugManager.getComponent(DebugJSONLoader);
loader.filterMinWin = 1000;
loader.loadJSONResults();
```

### 2. 自訂測試場景

創建特定場景的 JSON 檔案：

#### test_big_win.json
```json
{
  "session_info": {
    "session_id": 9999,
    "total_spins": 1,
    "description": "測試大獎 - 全符號相同 + 10倍"
  },
  "results": [
    {
      "spin_number": 1,
      "bet_amount": 10,
      "result_recall": {
        "msgid": 107,
        "status_code": 0,
        "result": {
          "module_id": "00152",
          "credit": 5000,
          "random_syb_pattern": [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          "win_line_group": [
            {
              "win_line_type": 0,
              "line_no": 1,
              "symbol_id": 1,
              "pos": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              "credit": 500,
              "multiplier": 1
            }
          ],
          "external_multiplier": 10
        }
      }
    }
  ]
}
```

#### test_free_spins.json
```json
{
  "session_info": {
    "session_id": 9998,
    "total_spins": 1,
    "description": "測試免費旋轉觸發"
  },
  "results": [
    {
      "spin_number": 1,
      "bet_amount": 10,
      "result_recall": {
        "msgid": 107,
        "status_code": 0,
        "result": {
          "module_id": "00152",
          "credit": 0,
          "random_syb_pattern": [2,3,1,4,5,1,6,7,1,8,9,2,3,4,5],
          "win_line_group": [],
          "win_bonus_group": [
            {
              "win_bonus_type": 1,
              "win_bonus_count": 10,
              "is_retrigger": false
            }
          ],
          "external_multiplier": 1
        }
      }
    }
  ]
}
```

### 3. 批量場景測試

```typescript
export class DebugScenarioManager extends Component {
    @property(DebugJSONLoader)
    loader: DebugJSONLoader = null;
    
    private scenarios = [
        "debug/test_big_win",
        "debug/test_free_spins",
        "debug/test_retrigger",
        "debug/test_multiplier"
    ];
    
    private currentScenario = 0;
    
    start() {
        this.testNextScenario();
    }
    
    testNextScenario() {
        if (this.currentScenario >= this.scenarios.length) {
            console.log('[DebugScenarioManager] 所有場景測試完成');
            return;
        }
        
        const scenario = this.scenarios[this.currentScenario];
        console.log(`[DebugScenarioManager] 測試場景 ${this.currentScenario + 1}:`, scenario);
        
        this.loader.setJSONPath(scenario);
        this.loader.loadJSONResults();
        
        this.currentScenario++;
        
        // 5 秒後測試下一個場景
        this.scheduleOnce(() => {
            this.testNextScenario();
        }, 5);
    }
}
```

### 4. 結果分析和統計

```typescript
export class DebugResultAnalyzer extends Component {
    private totalWins: number = 0;
    private totalSpins: number = 0;
    private maxWin: number = 0;
    private winCount: number = 0;
    
    start() {
        const debugManager = find("Canvas/DebugManager");
        if (debugManager) {
            debugManager.on('debug-result-loaded', this.analyzeResult, this);
        }
    }
    
    analyzeResult(gameResult: any) {
        this.totalSpins++;
        
        if (gameResult.totalWin > 0) {
            this.winCount++;
            this.totalWins += gameResult.totalWin;
            
            if (gameResult.totalWin > this.maxWin) {
                this.maxWin = gameResult.totalWin;
            }
        }
        
        // 每 10 次輸出統計
        if (this.totalSpins % 10 === 0) {
            this.printStatistics();
        }
    }
    
    printStatistics() {
        const avgWin = this.totalWins / this.totalSpins;
        const hitRate = (this.winCount / this.totalSpins) * 100;
        
        console.log('=== Debug 結果統計 ===');
        console.log(`總旋轉次數: ${this.totalSpins}`);
        console.log(`中獎次數: ${this.winCount}`);
        console.log(`中獎率: ${hitRate.toFixed(2)}%`);
        console.log(`平均贏分: ${avgWin.toFixed(2)}`);
        console.log(`最高單次贏分: ${this.maxWin}`);
        console.log('====================');
    }
}
```

### 5. UI 控制面板

創建完整的 Debug UI 面板：

```typescript
export class DebugPanel extends Component {
    @property(DebugJSONLoader)
    loader: DebugJSONLoader = null;
    
    @property(EditBox)
    filePathInput: EditBox = null;
    
    @property(Toggle)
    loopToggle: Toggle = null;
    
    @property(Slider)
    delaySlider: Slider = null;
    
    @property(Label)
    statusLabel: Label = null;
    
    @property([String])
    presetPaths: string[] = [];
    
    start() {
        this.setupUI();
    }
    
    setupUI() {
        // 載入按鈕
        this.node.getChildByName('LoadButton').on('click', () => {
            if (this.filePathInput) {
                this.loader.setJSONPath(this.filePathInput.string);
            }
            this.loader.loadJSONResults();
        });
        
        // 停止按鈕
        this.node.getChildByName('StopButton').on('click', () => {
            this.loader.stopLoopPlayback();
        });
        
        // 循環切換
        if (this.loopToggle) {
            this.loopToggle.node.on('toggle', () => {
                this.loader.loopPlayback = this.loopToggle.isChecked;
            });
        }
        
        // 延遲調整
        if (this.delaySlider) {
            this.delaySlider.node.on('slide', () => {
                this.loader.playbackDelay = this.delaySlider.progress * 5; // 0-5秒
            });
        }
        
        // 預設場景按鈕
        this.presetPaths.forEach((path, index) => {
            const btn = this.node.getChildByName(`Preset${index}`);
            if (btn) {
                btn.on('click', () => {
                    this.loader.setJSONPath(path);
                    this.loader.loadJSONResults();
                });
            }
        });
        
        // 更新狀態
        this.schedule(this.updateStatus, 0.5);
    }
    
    updateStatus() {
        if (!this.statusLabel || !this.loader) return;
        
        const info = this.loader.getLoadedInfo();
        this.statusLabel.string = 
            `已載入: ${info.totalResults} 筆\n` +
            `當前: ${info.currentIndex}\n` +
            `播放中: ${info.isPlaying ? '是' : '否'}`;
    }
}
```

---

## 故障排除

### 問題 1: 找不到 JSON 檔案

**症狀**：
```
[DebugJSONLoader] 載入失敗: Error: Failed to load resources/debug/xxx.json
```

**解決方案**：
1. 確認檔案在 `assets/resources/` 目錄下
2. 檢查路徑拼寫（區分大小寫）
3. 不要包含 `resources/` 前綴和 `.json` 副檔名
4. 確認檔案已正確匯入 Cocos Creator

```bash
# 正確的檔案結構
pss-on-00152/assets/resources/debug/test.json

# 正確的載入路徑
jsonFilePath = "debug/test"  // ✅
jsonFilePath = "resources/debug/test"  // ❌
jsonFilePath = "debug/test.json"  // ❌
```

### 問題 2: JSON 格式錯誤

**症狀**：
```
[DebugJSONLoader] 解析 JSON 失敗: SyntaxError
```

**解決方案**：
1. 使用 JSON 驗證工具檢查格式（如 jsonlint.com）
2. 確認是模擬器產生的正確格式
3. 檢查是否有多餘的逗號或引號

```bash
# 驗證 JSON 格式
python -m json.tool test.json
```

### 問題 3: 結果沒有套用到遊戲

**症狀**：
- JSON 載入成功，但遊戲沒有反應
- 控制台顯示 `[DebugJSONLoader] 套用第 X 次結果` 但沒有後續動作

**解決方案**：
1. 確認已監聽 `debug-result-loaded` 事件
2. 檢查 GameController 的 `onDebugResultLoaded` 方法實作
3. 確認 debugManager 節點引用正確

```typescript
// 檢查事件監聽
start() {
    if (this.debugManager) {
        this.debugManager.on('debug-result-loaded', this.onDebugResultLoaded, this);
        console.log('[GameController] Debug 事件監聽已設定');  // 確認執行
    } else {
        console.error('[GameController] debugManager 未設定！');
    }
}
```

### 問題 4: 符號顯示錯誤

**症狀**：
- 符號位置不正確
- 符號 ID 不匹配

**解決方案**：
1. 檢查 `convertSymbolPattern` 方法的轉換邏輯
2. 確認遊戲使用的符號 ID 範圍
3. 驗證 Proto 格式和遊戲格式的對應關係

```typescript
// Debug 符號轉換
private convertSymbolPattern(pattern: number[]): number[][] {
    console.log('[Debug] 原始符號圖案:', pattern);
    const reels = [[], [], [], [], []];
    
    for (let i = 0; i < pattern.length; i++) {
        const reelIndex = Math.floor(i / 3);
        const symbolId = pattern[i];
        reels[reelIndex].push(symbolId);
        console.log(`Reel ${reelIndex}, Pos ${i % 3}: Symbol ${symbolId}`);
    }
    
    console.log('[Debug] 轉換後滾輪:', reels);
    return reels;
}
```

### 問題 5: 循環播放不工作

**症狀**：
- 只播放一次就停止
- 延遲時間不正確

**解決方案**：
1. 確認 `loopPlayback` 已啟用
2. 檢查 `playbackDelay` 設定
3. 確認沒有呼叫 `stopLoopPlayback()`

```typescript
// Debug 循環播放
private startLoopPlayback() {
    console.log('[Debug] 循環播放設定:', {
        isPlaying: this.isPlaying,
        loopPlayback: this.loopPlayback,
        delay: this.playbackDelay,
        results: this.allResults.length
    });
    
    // ... 其他代碼
}
```

### 問題 6: 效能問題

**症狀**：
- 載入大量結果時遊戲卡頓
- 記憶體使用過高

**解決方案**：
1. 使用結果過濾減少載入量
2. 分批載入大檔案
3. 及時清理不需要的資料

```typescript
// 分批載入
private processBatchResults(results: any[]) {
    const batchSize = 50;  // 每批 50 筆
    
    for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        this.scheduleOnce(() => {
            this.processBatch(batch);
        }, i / batchSize * 0.1);  // 每批間隔 0.1 秒
    }
}
```

---

## 效能優化建議

### 1. 限制同時載入的結果數量

```typescript
@property
maxResults: number = 100;

private processBatchResults(results: any[]) {
    if (results.length > this.maxResults) {
        console.warn(`[DebugJSONLoader] 結果過多，限制為前 ${this.maxResults} 筆`);
        results = results.slice(0, this.maxResults);
    }
    // ... 處理結果
}
```

### 2. 使用物件池

```typescript
// 重用遊戲物件，避免頻繁創建銷毀
private symbolPool: Node[] = [];

getSymbol(): Node {
    if (this.symbolPool.length > 0) {
        return this.symbolPool.pop();
    }
    return instantiate(this.symbolPrefab);
}

recycleSymbol(symbol: Node) {
    symbol.active = false;
    this.symbolPool.push(symbol);
}
```

### 3. 延遲載入資源

```typescript
// 不要一次載入所有動畫，按需載入
private loadAnimationAsync(symbolId: number) {
    resources.load(`animations/symbol_${symbolId}`, sp.SkeletonData, (err, asset) => {
        if (!err) {
            this.playSymbolAnimation(asset);
        }
    });
}
```

---

## 完整使用範例

### 場景 1: 快速測試特定結果

```bash
# 1. 產生測試資料
cd gameServer
python main.py --simulate 10 --json --json-dir ../pss-on-00152/assets/resources/test

# 2. 在 Cocos Creator 中設定
# DebugJSONLoader:
#   - jsonFilePath: "test/batch_results_xxx"
#   - autoLoad: true
#   - loopPlayback: false

# 3. 運行遊戲，觀察 10 次結果
```

### 場景 2: 壓力測試

```bash
# 1. 產生大量資料
python main.py --simulate 1000 --json --json-dir ../pss-on-00152/assets/resources/stress

# 2. 設定循環播放
# DebugJSONLoader:
#   - jsonFilePath: "stress/batch_results_xxx"
#   - loopPlayback: true
#   - playbackDelay: 0.5

# 3. 長時間運行，監控效能
```

### 場景 3: 特殊場景展示

```bash
# 1. 創建自訂場景 JSON
# 例如：test_showcase.json（包含精彩畫面）

# 2. 設定展示模式
# DebugJSONLoader:
#   - jsonFilePath: "showcase/test_showcase"
#   - loopPlayback: true
#   - playbackDelay: 3.0
#   - filterMinWin: 1000  # 只顯示大獎

# 3. 用於展示或錄製影片
```

---

## 注意事項

### 1. Debug 模式限制

```typescript
// 只在 Debug 模式下啟用
start() {
    if (CC_DEBUG && this.autoLoad) {
        this.loadJSONResults();
    }
}

// 或使用環境變數
if (process.env.NODE_ENV === 'development') {
    // 啟用 Debug 功能
}
```

### 2. 正式版本處理

```typescript
// 條件編譯，正式版本不包含 Debug 程式碼
if (CC_DEBUG) {
    import('./Debug/DebugJSONLoader').then(module => {
        this.debugLoader = this.node.addComponent(module.DebugJSONLoader);
    });
}
```

### 3. 資料安全

- Debug 檔案不要包含敏感資訊
- 不要提交 Debug JSON 到版本控制
- 在 `.gitignore` 中排除：

```gitignore
# .gitignore
assets/resources/debug/*.json
assets/resources/test/*.json
```

---

## 相關文件

- **[JSON 輸出指南](./JSON-Export-Guide.md)** - 模擬器 JSON 產生說明
- **[模擬器使用指南](../gameServer/README.md)** - 遊戲模擬器完整文檔
- **[遊戲測試指南](./Game-Testing-Guide.md)** - 遊戲測試最佳實踐

---

## 總結

DebugJSONLoader 提供了一個強大且靈活的方式來測試遊戲客戶端：

✅ **快速測試** - 無需連接伺服器即可測試各種場景  
✅ **可重現** - 使用固定的 JSON 資料重現問題  
✅ **易於使用** - 編輯器中簡單配置即可使用  
✅ **高度自訂** - 支援自訂場景和測試流程  
✅ **效能友好** - 提供多種優化選項  

建議在開發過程中充分利用此工具，可以大幅提升開發效率和測試品質！

---

*文檔版本: 1.0*  
*創建日期: 2025-10-13*  
*適用專案: 好運咚咚 (PSS-ON-00152)*  
*相關模組: gameServer 模擬器*
