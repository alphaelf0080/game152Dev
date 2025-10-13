# LocalServerMode 本地伺服器模式 - 使用指南

## 一、概述

**LocalServerMode** 是一個允許遊戲在開發和測試階段完全離線運行的系統。通過在 URL 中添加參數 `localServer=true`，遊戲會自動從本地 JSON 檔案讀取預先產生的遊戲結果，完全繞過遊戲伺服器。

### 核心特性

- ✅ **URL 參數啟動** - 通過 `?localServer=true` 自動啟用
- ✅ **自動載入** - 初始化時自動載入 JSON 檔案
- ✅ **無縫整合** - 與正常 Spin 流程完全一致
- ✅ **結果循環** - 用完自動從頭開始
- ✅ **完全離線** - 不需要連接遊戲伺服器
- ✅ **場景切換** - 支援動態切換不同測試場景

### 使用場景

1. **離線開發** - 在沒有網路或伺服器的環境下開發
2. **前端測試** - 測試遊戲表演而不依賴後端
3. **特定場景測試** - 測試大獎、免費旋轉等特殊情況
4. **展示模式** - 用於展示或演示

## 二、快速開始

### 2.1 基本設置（5 分鐘）

#### 步驟 1: 產生測試數據

```bash
cd gameServer

# 產生 100 次旋轉的測試數據
python main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/local_results
```

這會產生檔案：
```
pss-on-00152/assets/resources/local_results/
└── batch_results_20251013_100_spins.json
```

#### 步驟 2: 創建 LocalServerMode 節點

在 Cocos Creator 編輯器中：

1. 打開 `main.scene` 或 `load.scene`（遊戲初始場景）
2. 在場景根節點下創建新節點，命名為 `LocalServerMode`
3. 添加 `LocalServerMode` 組件
4. 在 Inspector 面板設置：
   - **Default Json Path**: `local_results/batch_results_20251013_100_spins`

#### 步驟 3: 在 URL 中啟用

在瀏覽器中打開遊戲時添加參數：

```
http://localhost:7456/?localServer=true
```

完成！現在點擊 Spin 按鈕會自動使用本地 JSON 的結果。

### 2.2 驗證是否正常運作

打開瀏覽器的 Console（F12），應該會看到：

```
[LocalServerMode] URL 參數檢測到本地伺服器模式
[LocalServerMode] 開始載入 JSON: local_results/batch_results_20251013_100_spins
[LocalServerMode] 載入成功: 100 筆結果
[GameController] 本地伺服器已就緒: {totalResults: 100, currentIndex: 0}
[GameController] 使用本地伺服器模式
```

## 三、詳細實作步驟

### 3.1 創建核心組件

#### LocalServerMode.ts

將此檔案放在 `pss-on-00152/assets/script/LocalServer/LocalServerMode.ts`：

```typescript
// filepath: pss-on-00152/assets/script/LocalServer/LocalServerMode.ts
import { _decorator, Component, Node, resources, JsonAsset } from 'cc';
import { URLParamParser } from './URLParamParser';

const { ccclass, property } = _decorator;

/**
 * 本地伺服器模式 - 使用本地 JSON 檔案替代遊戲伺服器
 * 
 * 使用方式:
 * 1. 在 URL 中添加參數: ?localServer=true
 * 2. 系統會自動載入 defaultJsonPath 指定的 JSON 檔案
 * 3. 每次 Spin 調用 getNextResult() 獲取下一個結果
 */
@ccclass('LocalServerMode')
export class LocalServerMode extends Component {
    @property({
        tooltip: '預設的 JSON 檔案路徑（相對於 resources 目錄）'
    })
    public defaultJsonPath: string = 'local_results/batch_results_100_spins';
    
    @property({
        tooltip: '是否啟用本地模式（通常由 URL 參數自動控制）'
    })
    public enableMode: boolean = false;
    
    // 當前載入的所有結果
    private allResults: any[] = [];
    
    // 當前結果索引
    private currentIndex: number = 0;
    
    // 是否已載入
    private isLoaded: boolean = false;
    
    start() {
        // 檢查 URL 參數
        if (URLParamParser.isParamTrue('localServer')) {
            this.enableMode = true;
            console.log('[LocalServerMode] URL 參數檢測到本地伺服器模式');
        }
        
        // 如果啟用了本地模式，自動載入 JSON
        if (this.enableMode) {
            // 檢查是否有自定義路徑
            const customPath = URLParamParser.getParam('jsonPath');
            const pathToLoad = customPath || this.defaultJsonPath;
            
            this.loadLocalJSON(pathToLoad);
        }
    }
    
    /**
     * 載入本地 JSON 檔案
     * @param jsonPath JSON 檔案路徑（相對於 resources，不需 .json 副檔名）
     */
    public loadLocalJSON(jsonPath: string) {
        console.log(`[LocalServerMode] 開始載入 JSON: ${jsonPath}`);
        
        resources.load(jsonPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error('[LocalServerMode] 載入 JSON 失敗:', err);
                console.error('[LocalServerMode] 路徑:', jsonPath);
                return;
            }
            
            try {
                const jsonData = jsonAsset.json;
                
                // 解析 JSON 數據
                if (jsonData.results && Array.isArray(jsonData.results)) {
                    this.allResults = jsonData.results;
                    this.currentIndex = 0;
                    this.isLoaded = true;
                    
                    console.log(`[LocalServerMode] 載入成功: ${this.allResults.length} 筆結果`);
                    
                    // 發送就緒事件
                    this.node.emit('local-server-ready', {
                        totalResults: this.allResults.length,
                        currentIndex: this.currentIndex
                    });
                } else {
                    console.error('[LocalServerMode] JSON 格式錯誤: 找不到 results 陣列');
                }
            } catch (error) {
                console.error('[LocalServerMode] 解析 JSON 失敗:', error);
            }
        });
    }
    
    /**
     * 獲取下一個遊戲結果
     * @returns 轉換後的遊戲結果，如果沒有結果則返回 null
     */
    public getNextResult(): any {
        if (!this.isLoaded || this.allResults.length === 0) {
            console.warn('[LocalServerMode] 沒有可用的結果');
            return null;
        }
        
        // 獲取當前結果
        const protoResult = this.allResults[this.currentIndex];
        
        // 移動到下一個索引
        this.currentIndex = (this.currentIndex + 1) % this.allResults.length;
        
        // 如果循環了，發送事件
        if (this.currentIndex === 0) {
            console.log('[LocalServerMode] 結果已循環到開頭');
            this.node.emit('results-cycled');
        }
        
        // 發送索引變化事件
        this.node.emit('result-index-changed', {
            index: this.currentIndex,
            total: this.allResults.length
        });
        
        // 轉換為遊戲格式
        return this.convertToGameFormat(protoResult);
    }
    
    /**
     * 將 Proto 格式轉換為遊戲格式
     */
    private convertToGameFormat(protoResult: any): any {
        return {
            // 滾輪符號
            reels: protoResult.stop_positions || [],
            
            // 贏線資訊
            winLines: this.convertWinGroups(protoResult.win_groups || []),
            
            // 總贏分
            totalWin: protoResult.total_win || 0,
            
            // 倍率
            multiplier: protoResult.multiplier || 1,
            
            // 免費旋轉
            freeSpins: this.convertBonusGroup(protoResult.bonus_groups || []),
            
            // 戰鼓特性
            warDrums: protoResult.war_drums_info || null,
            
            // 原始數據（供調試用）
            raw: protoResult
        };
    }
    
    /**
     * 轉換贏線群組
     */
    private convertWinGroups(winGroups: any[]): any[] {
        return winGroups.map(group => ({
            symbolId: group.symbol_id,
            count: group.symbol_count,
            positions: group.symbol_positions || [],
            winCredit: group.win_credit || 0,
            isWild: group.is_wild || false
        }));
    }
    
    /**
     * 轉換獎勵群組（免費旋轉等）
     */
    private convertBonusGroup(bonusGroups: any[]): any {
        if (!bonusGroups || bonusGroups.length === 0) {
            return null;
        }
        
        const bonus = bonusGroups[0];
        return {
            type: bonus.win_bonus_type,
            count: bonus.win_bonus_count || 0,
            isRetrigger: bonus.is_retrigger || false
        };
    }
    
    /**
     * 檢查是否處於本地模式
     */
    public isLocalMode(): boolean {
        return this.enableMode && this.isLoaded;
    }
    
    /**
     * 獲取當前狀態資訊
     */
    public getInfo(): any {
        return {
            enableMode: this.enableMode,
            isLoaded: this.isLoaded,
            totalResults: this.allResults.length,
            currentIndex: this.currentIndex
        };
    }
}
```

#### URLParamParser.ts

將此檔案放在 `pss-on-00152/assets/script/LocalServer/URLParamParser.ts`：

```typescript
// filepath: pss-on-00152/assets/script/LocalServer/URLParamParser.ts
import { sys } from 'cc';

/**
 * URL 參數解析工具
 * 用於解析瀏覽器 URL 的查詢參數
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

### 3.2 整合到 GameController

修改遊戲的主控制器：

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
    private isSpinning: boolean = false;
    
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
        // 查找 LocalServerMode 節點
        if (!this.localServerNode) {
            this.localServerNode = find('LocalServerMode');
        }
        
        if (this.localServerNode) {
            this.localServerMode = this.localServerNode.getComponent(LocalServerMode);
            
            if (this.localServerMode && this.localServerMode.isLocalMode()) {
                this.isUsingLocalServer = true;
                
                // 監聽本地伺服器事件
                this.localServerNode.on('local-server-ready', this.onLocalServerReady, this);
                this.localServerNode.on('result-index-changed', this.onResultIndexChanged, this);
                this.localServerNode.on('results-cycled', this.onResultsCycled, this);
            }
        }
    }
    
    /**
     * 本地伺服器就緒回調
     */
    private onLocalServerReady(data: any) {
        console.log('[GameController] 本地伺服器已就緒:', data);
    }
    
    /**
     * 結果索引變化回調
     */
    private onResultIndexChanged(data: { index: number, total: number }) {
        console.log(`[GameController] 當前結果: ${data.index}/${data.total}`);
    }
    
    /**
     * 結果循環回調
     */
    private onResultsCycled() {
        console.log('[GameController] 測試數據已循環到開頭');
    }
    
    /**
     * 初始化本地模式
     */
    private initializeLocalMode() {
        // 本地模式不需要連接伺服器
        console.log('[GameController] 本地模式: 跳過伺服器連接');
        
        // 初始化遊戲 UI
        this.initializeGameUI();
        
        // 啟用遊戲控制
        this.enableGameControls();
    }
    
    /**
     * 初始化正常模式
     */
    private initializeNormalMode() {
        // 連接遊戲伺服器
        this.connectToGameServer();
        
        // 初始化遊戲 UI
        this.initializeGameUI();
    }
    
    /**
     * 處理 Spin 按鈕點擊
     */
    public onSpinButtonClick() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.disableSpinButton();
        
        // 檢查模式並處理
        if (this.isUsingLocalServer) {
            this.handleLocalSpin();
        } else {
            this.handleNormalSpin();
        }
    }
    
    /**
     * 本地模式 Spin 處理
     */
    private async handleLocalSpin() {
        // 從本地獲取下一個結果
        const result = this.localServerMode.getNextResult();
        
        if (!result) {
            console.warn('[GameController] 沒有更多結果');
            this.enableSpinButton();
            this.isSpinning = false;
            return;
        }
        
        console.log('[GameController] 使用本地結果:', result);
        
        // 套用結果到遊戲表演
        await this.applyGameResult(result);
        
        this.isSpinning = false;
    }
    
    /**
     * 正常模式 Spin 處理
     */
    private async handleNormalSpin() {
        try {
            // 向伺服器請求結果
            const result = await this.requestSpinFromServer();
            
            // 套用結果
            await this.applyGameResult(result);
            
            this.isSpinning = false;
        } catch (error) {
            console.error('[GameController] Spin 錯誤:', error);
            this.enableSpinButton();
            this.isSpinning = false;
        }
    }
    
    /**
     * 套用遊戲結果（本地和正常模式通用）
     */
    private async applyGameResult(result: any) {
        console.log('[GameController] 套用遊戲結果:', result);
        
        // 扣除點數（如果需要）
        // this.deductPlayerCredit(this.currentBet);
        
        // 開始遊戲序列
        await this.startGameSequence(result);
        
        this.enableSpinButton();
    }
    
    /**
     * 執行遊戲序列
     */
    private async startGameSequence(result: any) {
        try {
            // 1. 開始滾輪旋轉
            await this.startReelSpin(result.reels);
            
            // 2. 停止滾輪並顯示結果
            await this.stopReelSpin(result.reels);
            
            // 3. 檢查並顯示贏線
            if (result.winLines && result.winLines.length > 0) {
                await this.showWinLines(result.winLines);
            }
            
            // 4. 顯示倍率特效
            if (result.multiplier > 1) {
                await this.showMultiplierEffect(result.multiplier);
            }
            
            // 5. 更新贏分
            if (result.totalWin > 0) {
                await this.showWinAmount(result.totalWin);
                // this.addPlayerCredit(result.totalWin);
            }
            
            // 6. 檢查免費旋轉觸發
            if (result.freeSpins) {
                await this.triggerFreeSpins(result.freeSpins);
            }
            
            // 7. 檢查戰鼓特性
            if (result.warDrums) {
                await this.triggerWarDrums(result.warDrums);
            }
            
        } catch (error) {
            console.error('[GameController] 遊戲序列錯誤:', error);
        }
    }
    
    // ========== 以下為遊戲表演方法（需要根據專案實際實作） ==========
    
    private startReelSpin(targetReels: number[][]): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 開始滾輪旋轉');
            // 實作滾輪旋轉動畫
            setTimeout(() => resolve(), 1000);
        });
    }
    
    private stopReelSpin(targetReels: number[][]): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 停止滾輪');
            // 實作滾輪停止動畫
            setTimeout(() => resolve(), 1500);
        });
    }
    
    private showWinLines(winLines: any[]): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 顯示贏線:', winLines.length);
            // 實作贏線顯示
            setTimeout(() => resolve(), 2000);
        });
    }
    
    private showMultiplierEffect(multiplier: number): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 顯示倍率:', multiplier);
            // 實作倍率特效
            setTimeout(() => resolve(), 1000);
        });
    }
    
    private showWinAmount(amount: number): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 顯示贏分:', amount);
            // 實作贏分動畫
            setTimeout(() => resolve(), 1500);
        });
    }
    
    private triggerFreeSpins(freeSpins: any): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 觸發免費旋轉:', freeSpins);
            // 實作免費旋轉流程
            setTimeout(() => resolve(), 2000);
        });
    }
    
    private triggerWarDrums(warDrums: any): Promise<void> {
        return new Promise((resolve) => {
            console.log('[GameController] 觸發戰鼓:', warDrums);
            // 實作戰鼓特性流程
            setTimeout(() => resolve(), 2000);
        });
    }
    
    private requestSpinFromServer(): Promise<any> {
        return new Promise((resolve, reject) => {
            // 實作伺服器通訊
            console.log('[GameController] 向伺服器請求結果');
            setTimeout(() => {
                resolve({
                    reels: [[1,2,3], [4,5,6], [7,8,9]],
                    winLines: [],
                    totalWin: 0,
                    multiplier: 1
                });
            }, 500);
        });
    }
    
    private disableSpinButton() {
        console.log('[GameController] 禁用 Spin 按鈕');
        // 實作按鈕禁用
    }
    
    private enableSpinButton() {
        console.log('[GameController] 啟用 Spin 按鈕');
        // 實作按鈕啟用
    }
    
    private connectToGameServer() {
        console.log('[GameController] 連接遊戲伺服器');
        // 實作伺服器連接
    }
    
    private initializeGameUI() {
        console.log('[GameController] 初始化遊戲 UI');
        // 實作 UI 初始化
    }
    
    private enableGameControls() {
        console.log('[GameController] 啟用遊戲控制');
        // 實作控制啟用
    }
}
```

## 四、高級功能

### 4.1 切換不同測試場景

通過 URL 參數切換：

```
# 基礎旋轉測試
http://localhost:7456/?localServer=true&jsonPath=local_results/batch_100_spins

# 大獎測試
http://localhost:7456/?localServer=true&jsonPath=local_results/test_big_win

# 免費旋轉測試
http://localhost:7456/?localServer=true&jsonPath=local_results/test_free_spins

# 戰鼓特性測試
http://localhost:7456/?localServer=true&jsonPath=local_results/test_war_drums
```

### 4.2 程式中動態切換

```typescript
/**
 * 動態切換測試場景
 */
public switchTestScenario(scenarioName: string) {
    if (!this.localServerMode) return;
    
    const scenarios = {
        'basic': 'local_results/batch_100_spins',
        'big_win': 'local_results/test_big_win',
        'free_spins': 'local_results/test_free_spins',
        'war_drums': 'local_results/test_war_drums',
    };
    
    const path = scenarios[scenarioName];
    if (path) {
        this.localServerMode.loadLocalJSON(path);
    }
}
```

### 4.3 創建測試 UI

可選：創建一個測試面板來控制本地模式：

```typescript
@ccclass('DebugPanel')
export class DebugPanel extends Component {
    @property(Node)
    gameController: Node = null;
    
    @property(Node)
    localServerNode: Node = null;
    
    @property(Label)
    statusLabel: Label = null;
    
    private controller: GameController = null;
    private localServer: LocalServerMode = null;
    
    start() {
        this.controller = this.gameController.getComponent(GameController);
        this.localServer = this.localServerNode.getComponent(LocalServerMode);
        
        // 定時更新狀態
        this.schedule(this.updateStatus, 0.5);
    }
    
    /**
     * 切換場景按鈕
     */
    onSwitchScenarioClick(event: any, customEventData: string) {
        if (this.controller) {
            this.controller.switchTestScenario(customEventData);
        }
    }
    
    /**
     * 更新狀態顯示
     */
    updateStatus() {
        if (!this.localServer || !this.statusLabel) return;
        
        const info = this.localServer.getInfo();
        this.statusLabel.string = 
            `模式: ${info.enableMode ? '本地' : '正常'}\n` +
            `已載入: ${info.isLoaded ? '是' : '否'}\n` +
            `總結果: ${info.totalResults}\n` +
            `當前索引: ${info.currentIndex}`;
    }
}
```

## 五、故障排除

### 5.1 無法載入 JSON 檔案

**問題**: Console 顯示 "載入 JSON 失敗"

**檢查清單**:
1. ✅ JSON 檔案是否在 `assets/resources/` 目錄下
2. ✅ 路徑是否正確（不含 `resources/` 前綴和 `.json` 副檔名）
3. ✅ JSON 檔案格式是否正確（有 `results` 陣列）
4. ✅ 檔案是否已在 Cocos Creator 中刷新（重新整理資源）

**解決方案**:
```typescript
// 確認路徑格式正確
// ❌ 錯誤: "assets/resources/local_results/test.json"
// ❌ 錯誤: "/local_results/test"
// ✅ 正確: "local_results/test"
```

### 5.2 URL 參數無效

**問題**: 添加了 `?localServer=true` 但仍連接伺服器

**檢查清單**:
1. ✅ URL 格式是否正確（使用 `?` 和 `&`）
2. ✅ 是否在瀏覽器環境（原生環境不支援）
3. ✅ LocalServerMode 節點是否存在並啟用
4. ✅ 是否在遊戲初始場景添加

**解決方案**:
```
# 正確的 URL 格式
http://localhost:7456/?localServer=true

# 多參數
http://localhost:7456/?localServer=true&jsonPath=test_data&debug=1
```

### 5.3 結果格式不匹配

**問題**: 遊戲表演異常或數據錯誤

**原因**: Proto 格式與遊戲格式不一致

**解決方案**:
修改 `convertToGameFormat` 方法以匹配你的遊戲格式：

```typescript
private convertToGameFormat(protoResult: any): any {
    // 根據實際的遊戲格式調整
    return {
        reels: protoResult.stop_positions || [],
        winLines: this.convertWinGroups(protoResult.win_groups || []),
        totalWin: protoResult.total_win || 0,
        // ... 其他欄位
    };
}
```

### 5.4 結果用完後沒有循環

**問題**: 達到結果末尾後無法繼續 Spin

**檢查**:
- `getNextResult()` 方法中的循環邏輯：
  ```typescript
  this.currentIndex = (this.currentIndex + 1) % this.allResults.length;
  ```

**解決**: 確認上述代碼存在，使用模運算（`%`）實現自動循環。

### 5.5 本地模式和正常模式切換問題

**問題**: 切換模式後行為異常

**解決方案**:
```typescript
/**
 * 切換模式時重新初始化
 */
public switchMode(useLocalServer: boolean) {
    // 清理當前模式
    if (useLocalServer) {
        this.disconnectFromServer();
        this.isUsingLocalServer = true;
    } else {
        this.isUsingLocalServer = false;
        this.connectToGameServer();
    }
    
    // 重新初始化
    if (useLocalServer) {
        this.initializeLocalMode();
    } else {
        this.initializeNormalMode();
    }
}
```

## 六、常見問題 (FAQ)

### Q1: 本地模式會影響發布版本嗎？

**A**: 不會。只有在 URL 中明確添加 `?localServer=true` 時才會啟用。發布版本中，玩家不會添加這個參數，所以會正常連接伺服器。

### Q2: 可以在原生平台（iOS/Android）使用嗎？

**A**: 原生平台不支援 URL 參數解析。如需在原生平台測試，可以手動設置：
```typescript
// 在 LocalServerMode 組件上
public enableMode: boolean = true;  // 手動啟用
```

### Q3: 如何產生特定的測試場景？

**A**: 使用模擬器的參數：
```bash
# 只產生大獎結果
python main.py --simulate 50 --filter-min-win 1000 --json

# 產生免費旋轉
python main.py --simulate 30 --feature free_spins --json
```

### Q4: JSON 檔案很大，載入很慢怎麼辦？

**A**: 
1. 減少測試次數（100 次通常足夠）
2. 分割成多個小檔案
3. 使用過濾條件只保留需要的結果

### Q5: 如何在團隊中共享測試場景？

**A**:
1. 將 JSON 檔案提交到 Git
2. 在團隊文檔中記錄 URL：
   ```
   大獎測試: http://localhost:7456/?localServer=true&jsonPath=local_results/big_win
   免費旋轉: http://localhost:7456/?localServer=true&jsonPath=local_results/free_spins
   ```

## 七、最佳實踐

### 7.1 組織測試場景

建議的目錄結構：

```
pss-on-00152/assets/resources/local_results/
├── basic/
│   ├── normal_100_spins.json       # 一般旋轉
│   └── low_variance_50_spins.json  # 低變異測試
├── features/
│   ├── free_spins_trigger.json     # 免費旋轉觸發
│   ├── war_drums_test.json         # 戰鼓特性
│   └── retrigger_test.json         # 重觸發測試
├── edge_cases/
│   ├── max_win.json                # 最大獎
│   ├── min_win.json                # 最小獎
│   └── no_win_sequence.json        # 連續不中
└── demos/
    ├── showcase.json                # 展示模式
    └── tutorial.json                # 教學模式
```

### 7.2 命名規範

```
# 格式: <類型>_<特徵>_<次數>.json
batch_normal_100_spins.json
test_big_win_50_spins.json
demo_showcase_20_spins.json
edge_max_multiplier_10_spins.json
```

### 7.3 測試工作流程

1. **開發新功能**
   ```
   http://localhost:7456/?localServer=true&jsonPath=local_results/basic/normal_100
   ```

2. **測試特定功能**
   ```
   http://localhost:7456/?localServer=true&jsonPath=local_results/features/free_spins
   ```

3. **壓力測試**
   ```
   http://localhost:7456/?localServer=true&jsonPath=local_results/edge_cases/max_win
   ```

4. **展示/演示**
   ```
   http://localhost:7456/?localServer=true&jsonPath=local_results/demos/showcase
   ```

### 7.4 版本控制

在 `.gitignore` 中：
```
# 排除個人測試檔案
/assets/resources/local_results/personal/

# 保留共享測試場景
!/assets/resources/local_results/basic/
!/assets/resources/local_results/features/
!/assets/resources/local_results/demos/
```

## 八、與其他系統整合

### 8.1 與 GameDebugger 整合

```typescript
@ccclass('GameDebugger')
export class GameDebugger extends Component {
    @property(Node)
    localServerNode: Node = null;
    
    /**
     * 獲取當前測試狀態
     */
    public getDebugInfo(): any {
        const localServer = this.localServerNode.getComponent(LocalServerMode);
        
        return {
            mode: localServer.isLocalMode() ? 'LOCAL' : 'NORMAL',
            ...localServer.getInfo()
        };
    }
}
```

### 8.2 與 UI 調試面板整合

```typescript
/**
 * 在調試面板顯示本地模式狀態
 */
private updateDebugPanel() {
    if (this.debugPanel && this.localServerMode) {
        const info = this.localServerMode.getInfo();
        this.debugPanel.setMode(info.enableMode ? 'LOCAL' : 'NORMAL');
        this.debugPanel.setProgress(info.currentIndex, info.totalResults);
    }
}
```

## 九、總結

LocalServerMode 提供了一個強大的離線開發和測試解決方案：

✅ **簡單**: 只需添加 URL 參數即可啟用
✅ **無侵入**: 不影響正常遊戲邏輯
✅ **靈活**: 支援多種測試場景切換
✅ **高效**: 無需等待伺服器回應
✅ **可靠**: 結果可重現，便於調試

立即開始使用：
```
http://localhost:7456/?localServer=true
```

## 十、相關資源

- [遊戲模擬器使用指南](./Simulator-Quick-Start.md)
- [JSON 匯出指南](./JSON-Export-Guide.md)
- [遊戲伺服器 API 文檔](../gameServer/README.md)
- [專案文檔索引](./DOCUMENTATION_INDEX.md)
