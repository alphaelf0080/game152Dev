/**
 * InitialBoardLoader - 初始盤面載入器
 * 
 * 功能：
 * 1. 在遊戲啟動時載入初始盤面數據
 * 2. 顯示初始畫面（無贏線、預設 symbol 排列）
 * 3. 確保與後續的模擬 JSON 檔案無縫銜接
 * 
 * 使用方法：
 * ```typescript
 * import { InitialBoardLoader } from "./InitialBoardLoader";
 * 
 * // 在遊戲初始化時
 * await InitialBoardLoader.loadAndDisplay();
 * ```
 */

import { _decorator } from 'cc';

const { ccclass } = _decorator;

export interface InitialBoardData {
    msgid: number;
    status_code: number;
    result: {
        module_id: string;
        credit: number;
        random_syb_pattern: number[][];
        win_line: any[];
        win_bonus_group: any[];
    };
    player_cent: number;
    next_module: string;
    cur_module_play_times: number;
    cur_module_total_times: number;
    accounting_sn: number;
}

export interface InitialBoardConfig {
    session_info: {
        session_id: number;
        description: string;
        purpose: string;
        created_at: string;
        version: string;
    };
    initial_state: InitialBoardData;
    notes?: any;
}

@ccclass('InitialBoardLoader')
export class InitialBoardLoader {
    
    /**
     * 預設的初始盤面 URL
     */
    private static DEFAULT_INITIAL_BOARD_URL = "http://localhost:9000/initial_board.json";
    
    /**
     * 快取的初始盤面數據
     */
    private static cachedInitialBoard: InitialBoardData | null = null;
    
    /**
     * 載入狀態
     */
    private static isLoaded: boolean = false;
    
    /**
     * 從 URL 參數獲取初始盤面路徑
     */
    private static getInitialBoardUrl(): string {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 檢查是否指定了初始盤面路徑
        const customUrl = urlParams.get('initial_board') || 
                         urlParams.get('initialBoard') ||
                         urlParams.get('init_board');
        
        if (customUrl) {
            console.log('[InitialBoardLoader] 使用自定義初始盤面:', customUrl);
            return customUrl;
        }
        
        console.log('[InitialBoardLoader] 使用預設初始盤面:', this.DEFAULT_INITIAL_BOARD_URL);
        return this.DEFAULT_INITIAL_BOARD_URL;
    }
    
    /**
     * 載入初始盤面數據
     */
    public static async loadInitialBoard(): Promise<InitialBoardData | null> {
        // 如果已經載入，直接返回快取
        if (this.isLoaded && this.cachedInitialBoard) {
            console.log('[InitialBoardLoader] 使用快取的初始盤面數據');
            return this.cachedInitialBoard;
        }
        
        const url = this.getInitialBoardUrl();
        
        try {
            console.log('[InitialBoardLoader] 🔄 正在載入初始盤面...');
            console.log('[InitialBoardLoader] URL:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data: InitialBoardConfig = await response.json();
            
            // 驗證數據格式
            if (!data.initial_state) {
                throw new Error('初始盤面數據格式錯誤：缺少 initial_state');
            }
            
            // 快取數據
            this.cachedInitialBoard = data.initial_state;
            this.isLoaded = true;
            
            console.log('[InitialBoardLoader] ✅ 初始盤面載入成功');
            console.log('[InitialBoardLoader] 盤面:', data.initial_state.result.random_syb_pattern);
            console.log('[InitialBoardLoader] 玩家餘額:', data.initial_state.player_cent);
            
            return this.cachedInitialBoard;
            
        } catch (error) {
            console.error('[InitialBoardLoader] ❌ 載入初始盤面失敗:', error);
            console.error('[InitialBoardLoader] 將使用預設盤面');
            
            // 返回硬編碼的預設盤面
            return this.getDefaultBoard();
        }
    }
    
    /**
     * 獲取預設的初始盤面（硬編碼備用）
     */
    private static getDefaultBoard(): InitialBoardData {
        console.log('[InitialBoardLoader] 使用硬編碼的預設盤面');
        
        return {
            msgid: 107,
            status_code: 0,
            result: {
                module_id: "00152",
                credit: 0,
                random_syb_pattern: [
                    [8, 3, 4],
                    [2, 7, 6],
                    [7, 2, 5],
                    [1, 6, 9],
                    [8, 2, 8]
                ],
                win_line: [],
                win_bonus_group: []
            },
            player_cent: 1000000,
            next_module: "BS",
            cur_module_play_times: 0,
            cur_module_total_times: 0,
            accounting_sn: 0
        };
    }
    
    /**
     * 將初始盤面數據轉換為遊戲可用的格式
     * 轉換為與 ResultRecall 相同的格式
     */
    public static convertToGameFormat(initialBoard: InitialBoardData): any {
        console.log('[InitialBoardLoader] 轉換初始盤面為遊戲格式...');
        
        // 轉換為 Long 格式（與 JsonDataLoader 相同）
        const convertToLong = (value: number) => {
            return {
                low: value & 0xFFFFFFFF,
                high: Math.floor(value / 0x100000000),
                unsigned: true
            };
        };
        
        // 構建遊戲格式的數據
        const gameFormat = {
            msgid: initialBoard.msgid,
            status_code: initialBoard.status_code,
            player_cent: convertToLong(initialBoard.player_cent),
            result: {
                module_id: initialBoard.result.module_id,
                credit: convertToLong(initialBoard.result.credit),
                random_syb_pattern: initialBoard.result.random_syb_pattern,
                win_line: initialBoard.result.win_line,
                win_bonus_group: initialBoard.result.win_bonus_group
            },
            next_module: initialBoard.next_module,
            cur_module_play_times: initialBoard.cur_module_play_times,
            cur_module_total_times: initialBoard.cur_module_total_times,
            accounting_sn: convertToLong(initialBoard.accounting_sn)
        };
        
        console.log('[InitialBoardLoader] ✅ 轉換完成');
        return gameFormat;
    }
    
    /**
     * 載入並顯示初始盤面
     * 這是主要的對外接口
     */
    public static async loadAndDisplay(): Promise<boolean> {
        try {
            console.log('[InitialBoardLoader] 🎮 開始初始化遊戲盤面...');
            
            // 載入初始盤面數據
            const initialBoard = await this.loadInitialBoard();
            
            if (!initialBoard) {
                console.error('[InitialBoardLoader] 無法獲取初始盤面數據');
                return false;
            }
            
            // 轉換為遊戲格式
            const gameFormat = this.convertToGameFormat(initialBoard);
            
            // 創建模擬的 WebSocket 事件
            const mockEvent = {
                data: gameFormat
            };
            
            console.log('[InitialBoardLoader] 📊 初始盤面數據已準備');
            console.log('[InitialBoardLoader] 等待 ResultRecall 處理...');
            
            // 注意：這裡不直接調用 ResultRecall
            // 而是將數據存儲起來，在適當的時機使用
            this.cachedInitialBoard = initialBoard;
            
            console.log('[InitialBoardLoader] ✅ 初始盤面載入完成');
            return true;
            
        } catch (error) {
            console.error('[InitialBoardLoader] ❌ 初始化失敗:', error);
            return false;
        }
    }
    
    /**
     * 獲取已載入的初始盤面數據
     */
    public static getCachedBoard(): InitialBoardData | null {
        return this.cachedInitialBoard;
    }
    
    /**
     * 獲取遊戲格式的初始盤面
     */
    public static getGameFormatBoard(): any | null {
        if (this.cachedInitialBoard) {
            return this.convertToGameFormat(this.cachedInitialBoard);
        }
        return null;
    }
    
    /**
     * 檢查是否已載入初始盤面
     */
    public static isInitialBoardLoaded(): boolean {
        return this.isLoaded && this.cachedInitialBoard !== null;
    }
    
    /**
     * 清除快取（用於重新載入）
     */
    public static clearCache(): void {
        console.log('[InitialBoardLoader] 清除初始盤面快取');
        this.cachedInitialBoard = null;
        this.isLoaded = false;
    }
}

/**
 * 全局輔助函數
 */

/**
 * 載入初始盤面
 */
export async function loadInitialBoard(): Promise<InitialBoardData | null> {
    return await InitialBoardLoader.loadInitialBoard();
}

/**
 * 載入並顯示初始盤面
 */
export async function initializeGameBoard(): Promise<boolean> {
    return await InitialBoardLoader.loadAndDisplay();
}

/**
 * 獲取初始盤面（遊戲格式）
 */
export function getInitialBoardData(): any | null {
    return InitialBoardLoader.getGameFormatBoard();
}

/**
 * 檢查初始盤面是否已載入
 */
export function isInitialBoardReady(): boolean {
    return InitialBoardLoader.isInitialBoardLoaded();
}
