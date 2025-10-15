/**
 * InitialBoardConfig - 初始盤面配置組件
 * 
 * 功能：
 * 1. 在 Cocos Creator 編輯器中直接配置初始盤面
 * 2. 支援自定義符號排列、玩家餘額等
 * 3. 遊戲啟動時自動應用配置
 * 4. 可選擇從 JSON 檔案載入或使用編輯器設定
 * 
 * 使用方法：
 * 1. 在場景中創建節點
 * 2. 添加 InitialBoardConfig 組件
 * 3. 在屬性面板設定盤面配置
 * 4. 遊戲啟動時會自動應用
 * 
 * @author Game152 Team
 * @date 2025-10-14
 */

import { _decorator, Component, Node, JsonAsset, Enum } from 'cc';
import { InitialBoardData } from './InitialBoardLoader';

const { ccclass, property } = _decorator;

/**
 * 盤面數據來源
 */
export enum BoardDataSource {
    // 使用編輯器配置
    EDITOR_CONFIG = 0,
    // 從 JSON 檔案載入
    JSON_FILE = 1,
    // 從 URL 載入
    URL = 2
}

/**
 * 符號 ID 枚舉（用於下拉選單）
 */
export enum SymbolID {
    鼓_Scatter = 1,
    紅包 = 2,
    金元寶 = 3,
    銅錢 = 4,
    扇子 = 5,
    A = 6,
    K = 7,
    Q = 8,
    J = 9,
    Wild = 10
}

// 註冊枚舉到 Cocos Creator
Enum(SymbolID);

@ccclass('InitialBoardConfig')
export class InitialBoardConfig extends Component {
    
    // ========== 編輯器屬性 ==========
    
    @property({
        type: Enum(BoardDataSource),
        tooltip: '盤面數據來源\n' +
                 'EDITOR_CONFIG: 使用下方編輯器配置\n' +
                 'JSON_FILE: 從 Resources 載入 JSON\n' +
                 'URL: 從網路 URL 載入'
    })
    public dataSource: BoardDataSource = BoardDataSource.EDITOR_CONFIG;
    
    @property({
        visible: function() { return this.dataSource === BoardDataSource.JSON_FILE; },
        tooltip: 'JSON 資源檔案（從 Resources 目錄選擇）'
    })
    public jsonAsset: JsonAsset = null;
    
    @property({
        visible: function() { return this.dataSource === BoardDataSource.URL; },
        tooltip: 'JSON 檔案的 URL 路徑\n' +
                 '例如: http://localhost:9000/initial_board.json'
    })
    public jsonUrl: string = 'http://localhost:9000/initial_board.json';
    
    @property({
        tooltip: '是否在遊戲啟動時自動應用此配置'
    })
    public autoApplyOnStart: boolean = true;
    
    @property({
        tooltip: '是否在本地模式下才啟用\n' +
                 '勾選後只在 localServer=true 時生效'
    })
    public onlyInLocalMode: boolean = false;
    
    // ========== 盤面配置（編輯器可設定）==========
    
    // Reel 1
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 1 輪 - 上方符號'
    })
    public reel1_top: SymbolID = SymbolID.Q;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 1 輪 - 中間符號'
    })
    public reel1_mid: SymbolID = SymbolID.紅包;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 1 輪 - 下方符號'
    })
    public reel1_bot: SymbolID = SymbolID.K;
    
    // Reel 2
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 2 輪 - 上方符號'
    })
    public reel2_top: SymbolID = SymbolID.金元寶;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 2 輪 - 中間符號'
    })
    public reel2_mid: SymbolID = SymbolID.K;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 2 輪 - 下方符號'
    })
    public reel2_bot: SymbolID = SymbolID.紅包;
    
    // Reel 3
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 3 輪 - 上方符號'
    })
    public reel3_top: SymbolID = SymbolID.銅錢;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 3 輪 - 中間符號'
    })
    public reel3_mid: SymbolID = SymbolID.A;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 3 輪 - 下方符號'
    })
    public reel3_bot: SymbolID = SymbolID.扇子;
    
    // Reel 4
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 4 輪 - 上方符號'
    })
    public reel4_top: SymbolID = SymbolID.鼓_Scatter;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 4 輪 - 中間符號'
    })
    public reel4_mid: SymbolID = SymbolID.A;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 4 輪 - 下方符號'
    })
    public reel4_bot: SymbolID = SymbolID.J;
    
    // Reel 5
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 5 輪 - 上方符號'
    })
    public reel5_top: SymbolID = SymbolID.Q;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 5 輪 - 中間符號'
    })
    public reel5_mid: SymbolID = SymbolID.紅包;
    
    @property({
        type: Enum(SymbolID),
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '第 5 輪 - 下方符號'
    })
    public reel5_bot: SymbolID = SymbolID.Q;
    
    @property({
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '玩家餘額（分為單位）\n' +
                 '1000000 = 10000.00 元'
    })
    public playerBalance: number = 1000000;
    
    @property({
        visible: function() { return this.dataSource === BoardDataSource.EDITOR_CONFIG; },
        tooltip: '初始積分'
    })
    public initialCredit: number = 0;
    
    @property({
        tooltip: '是否顯示詳細日誌'
    })
    public verbose: boolean = true;
    
    @property({
        tooltip: '配置說明（僅供參考）\n' +
                 '例如: 乾淨盤面 / Wild 盤面 / 演示盤面等'
    })
    public description: string = '預設初始盤面';
    
    // ========== 符號 ID 參考 ==========
    
    @property({
        displayName: "━━━━ 符號 ID 參考 ━━━━",
        readonly: true,
        tooltip: '符號 ID 對照表（僅供參考）：\n' +
                 '1 = 鼓（Scatter）\n' +
                 '2 = 紅包\n' +
                 '3 = 金元寶\n' +
                 '4 = 銅錢\n' +
                 '5 = 扇子\n' +
                 '6 = A\n' +
                 '7 = K\n' +
                 '8 = Q\n' +
                 '9 = J\n' +
                 '10 = Wild（如果有）'
    })
    public _symbolReference: string = "請參考遊戲設計文檔";
    
    // ========== 私有屬性 ==========
    
    private cachedBoardData: InitialBoardData | null = null;
    private isApplied: boolean = false;
    
    // ========== 生命週期方法 ==========
    
    onLoad() {
        this.log('InitialBoardConfig 組件載入');
        
        // 註冊為全局單例，方便其他組件訪問
        if (!window['InitialBoardConfigInstance']) {
            window['InitialBoardConfigInstance'] = this;
            this.log('已註冊為全局實例');
        }
    }
    
    start() {
        if (this.autoApplyOnStart) {
            this.applyConfiguration();
        }
    }
    
    // ========== 公開方法 ==========
    
    /**
     * 應用配置
     * 將配置的盤面設定應用到遊戲中
     */
    public async applyConfiguration(): Promise<boolean> {
        // 檢查是否僅在本地模式下啟用
        if (this.onlyInLocalMode && !this.isLocalMode()) {
            this.log('非本地模式，跳過初始盤面配置');
            return false;
        }
        
        this.log('🎮 開始應用初始盤面配置...');
        this.log(`數據來源: ${BoardDataSource[this.dataSource]}`);
        
        try {
            // 根據數據來源載入配置
            let boardData: InitialBoardData;
            
            switch (this.dataSource) {
                case BoardDataSource.EDITOR_CONFIG:
                    boardData = this.createBoardFromEditorConfig();
                    break;
                    
                case BoardDataSource.JSON_FILE:
                    boardData = await this.loadFromJsonAsset();
                    break;
                    
                case BoardDataSource.URL:
                    boardData = await this.loadFromUrl();
                    break;
                    
                default:
                    throw new Error('未知的數據來源');
            }
            
            // 快取數據
            this.cachedBoardData = boardData;
            this.isApplied = true;
            
            this.log('✅ 初始盤面配置應用成功');
            this.logBoardData(boardData);
            
            // 觸發事件通知其他系統
            this.notifyBoardReady(boardData);
            
            return true;
            
        } catch (error) {
            console.error('[InitialBoardConfig] ❌ 應用配置失敗:', error);
            return false;
        }
    }
    
    /**
     * 獲取配置的盤面數據
     */
    public getBoardData(): InitialBoardData | null {
        if (!this.isApplied) {
            console.warn('[InitialBoardConfig] 配置尚未應用，請先調用 applyConfiguration()');
        }
        return this.cachedBoardData;
    }
    
    /**
     * 重置配置（重新載入）
     */
    public reset(): void {
        this.log('重置配置');
        this.cachedBoardData = null;
        this.isApplied = false;
    }
    
    // ========== 私有方法 ==========
    
    /**
     * 從編輯器配置創建盤面數據
     */
    private createBoardFromEditorConfig(): InitialBoardData {
        this.log('使用編輯器配置創建盤面');
        
        // 從下拉選單屬性組合成 reels 陣列
        const reels = [
            [this.reel1_top, this.reel1_mid, this.reel1_bot],
            [this.reel2_top, this.reel2_mid, this.reel2_bot],
            [this.reel3_top, this.reel3_mid, this.reel3_bot],
            [this.reel4_top, this.reel4_mid, this.reel4_bot],
            [this.reel5_top, this.reel5_mid, this.reel5_bot]
        ];
        
        // 驗證符號 ID 是否有效（1-10）
        for (let i = 0; i < reels.length; i++) {
            for (let j = 0; j < reels[i].length; j++) {
                const symbolId = reels[i][j];
                if (symbolId < 1 || symbolId > 10) {
                    console.warn(`[InitialBoardConfig] Reel ${i + 1} 位置 ${j + 1} 的符號 ID ${symbolId} 超出範圍，使用預設值`);
                    reels[i][j] = 8; // 預設使用 Q
                }
            }
        }
        
        const boardData: InitialBoardData = {
            msgid: 107,
            status_code: 0,
            result: {
                module_id: "00152",
                credit: this.initialCredit,
                random_syb_pattern: reels,
                win_line: [],
                win_bonus_group: []
            },
            player_cent: this.playerBalance,
            next_module: "BS",
            cur_module_play_times: 0,
            cur_module_total_times: 0,
            accounting_sn: 0
        };
        
        return boardData;
    }
    
    /**
     * 從 JSON Asset 載入
     */
    private async loadFromJsonAsset(): Promise<InitialBoardData> {
        if (!this.jsonAsset) {
            throw new Error('未設定 JSON 資源檔案');
        }
        
        this.log('從 JSON Asset 載入:', this.jsonAsset.name);
        
        const jsonData = this.jsonAsset.json;
        if (!jsonData || !jsonData.initial_state) {
            throw new Error('JSON 格式錯誤：缺少 initial_state');
        }
        
        return jsonData.initial_state as InitialBoardData;
    }
    
    /**
     * 從 URL 載入
     */
    private async loadFromUrl(): Promise<InitialBoardData> {
        if (!this.jsonUrl) {
            throw new Error('未設定 JSON URL');
        }
        
        this.log('從 URL 載入:', this.jsonUrl);
        
        const response = await fetch(this.jsonUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        if (!jsonData.initial_state) {
            throw new Error('JSON 格式錯誤：缺少 initial_state');
        }
        
        return jsonData.initial_state as InitialBoardData;
    }
    
    /**
     * 檢查是否為本地模式
     */
    private isLocalMode(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('localServer') === 'true' || 
               urlParams.get('local') === 'true' ||
               urlParams.get('sim_mode') === 'local_json';
    }
    
    /**
     * 通知盤面已就緒
     */
    private notifyBoardReady(boardData: InitialBoardData): void {
        // 存儲到全局物件供其他系統訪問
        if (!window['GameInitialBoard']) {
            window['GameInitialBoard'] = {};
        }
        window['GameInitialBoard'].data = boardData;
        window['GameInitialBoard'].isReady = true;
        
        this.log('已通知其他系統：初始盤面已就緒');
    }
    
    /**
     * 日誌輸出
     */
    private log(message: string, ...args: any[]): void {
        if (this.verbose) {
            console.log(`[InitialBoardConfig] ${message}`, ...args);
        }
    }
    
    /**
     * 輸出盤面數據
     */
    private logBoardData(boardData: InitialBoardData): void {
        if (!this.verbose) return;
        
        console.log('[InitialBoardConfig] ━━━━━━━━━━━━━━━━━━━━');
        console.log('[InitialBoardConfig] 📊 盤面配置:');
        console.log('[InitialBoardConfig]   說明:', this.description);
        console.log('[InitialBoardConfig]   盤面排列:');
        
        const pattern = boardData.result.random_syb_pattern;
        for (let row = 0; row < 3; row++) {
            const rowSymbols = pattern.map(reel => reel[row]);
            console.log(`[InitialBoardConfig]     Row ${row + 1}: [${rowSymbols.join(', ')}]`);
        }
        
        console.log('[InitialBoardConfig]   玩家餘額:', boardData.player_cent, `(${(boardData.player_cent / 100).toFixed(2)} 元)`);
        console.log('[InitialBoardConfig]   初始積分:', boardData.result.credit);
        console.log('[InitialBoardConfig] ━━━━━━━━━━━━━━━━━━━━');
    }
    
    // ========== 靜態輔助方法 ==========
    
    /**
     * 獲取全局實例
     */
    public static getInstance(): InitialBoardConfig | null {
        return window['InitialBoardConfigInstance'] || null;
    }
    
    /**
     * 獲取全局配置的盤面數據
     */
    public static getGlobalBoardData(): InitialBoardData | null {
        const instance = this.getInstance();
        return instance ? instance.getBoardData() : null;
    }
}

/**
 * 全局輔助函數
 */

/**
 * 獲取初始盤面配置實例
 */
export function getInitialBoardConfig(): InitialBoardConfig | null {
    return InitialBoardConfig.getInstance();
}

/**
 * 獲取初始盤面數據
 */
export function getEditorConfiguredBoard(): InitialBoardData | null {
    return InitialBoardConfig.getGlobalBoardData();
}

/**
 * 檢查編輯器配置是否就緒
 */
export function isEditorBoardReady(): boolean {
    const globalData = window['GameInitialBoard'];
    return globalData && globalData.isReady === true;
}

