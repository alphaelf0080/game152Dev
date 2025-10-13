/**
 * 本地 JSON 模擬數據加載器
 * 用於載入和管理模擬遊戲結果的 JSON 檔案
 */

import { SimulatorConfigManager } from "./SimulatorConfig";

export interface JsonSpinResult {
    spin_number: number;
    bet_amount: number;
    msgid: number;
    status_code: number;
    result: {
        module_id: string;
        credit: number;
        random_syb_pattern: number[][];
        win_line?: Array<{
            line_id: number;
            symbol_id: number;
            symbol_count: number;
            credit: number;
            bonus_result?: any;
        }>;
        win_bonus_group?: any[];
        free_spins_result?: any;
        scatter_result?: any;
    };
    player_cent: number;
    next_module: string;
    cur_module_play_times: number;
    cur_module_total_times: number;
    accounting_sn: number;
}

export interface JsonBatchResults {
    session_info: {
        session_id: number;
        start_time: string;
        end_time: string;
        total_spins: number;
    };
    results: JsonSpinResult[];
}

/**
 * JSON 數據加載器類
 */
export class JsonDataLoader {
    private static instance: JsonDataLoader;
    private batchData: JsonBatchResults | null = null;
    private isLoaded: boolean = false;
    private isLoading: boolean = false;
    private loadPromise: Promise<boolean> | null = null;

    private constructor() {}

    public static getInstance(): JsonDataLoader {
        if (!JsonDataLoader.instance) {
            JsonDataLoader.instance = new JsonDataLoader();
        }
        return JsonDataLoader.instance;
    }

    /**
     * 載入 JSON 檔案
     */
    public async loadJsonFile(url: string): Promise<boolean> {
        // 如果正在載入，返回現有的 Promise
        if (this.isLoading && this.loadPromise) {
            return this.loadPromise;
        }

        // 如果已經載入，直接返回成功
        if (this.isLoaded && this.batchData) {
            console.log('[JsonDataLoader] 數據已載入，跳過重複載入');
            return true;
        }

        this.isLoading = true;
        this.loadPromise = this._loadJsonFile(url);
        
        return this.loadPromise;
    }

    private async _loadJsonFile(url: string): Promise<boolean> {
        try {
            console.log('[JsonDataLoader] 開始載入 JSON 檔案:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.batchData = await response.json();
            this.isLoaded = true;
            this.isLoading = false;
            
            console.log('[JsonDataLoader] JSON 檔案載入成功');
            console.log('[JsonDataLoader] 總 spin 數:', this.batchData?.results?.length || 0);
            
            return true;
        } catch (error) {
            console.error('[JsonDataLoader] 載入 JSON 檔案失敗:', error);
            this.isLoading = false;
            this.isLoaded = false;
            this.batchData = null;
            return false;
        }
    }

    /**
     * 根據索引獲取 spin 結果
     */
    public getSpinResult(index: number): JsonSpinResult | null {
        if (!this.isLoaded || !this.batchData || !this.batchData.results) {
            console.error('[JsonDataLoader] 數據尚未載入或無效');
            return null;
        }

        const config = SimulatorConfigManager.getInstance().getConfig();
        const results = this.batchData.results;
        
        // 如果索引超出範圍
        if (index >= results.length) {
            if (config.loopResults) {
                // 循環模式：重新開始
                const loopedIndex = index % results.length;
                console.log(`[JsonDataLoader] 循環模式：索引 ${index} -> ${loopedIndex}`);
                return results[loopedIndex];
            } else {
                // 非循環模式：返回最後一個結果
                console.warn(`[JsonDataLoader] 已到達最後一個結果 (索引: ${index})`);
                return results[results.length - 1];
            }
        }

        return results[index];
    }

    /**
     * 獲取下一個 spin 結果（自動管理索引）
     */
    public getNextSpinResult(): JsonSpinResult | null {
        const configManager = SimulatorConfigManager.getInstance();
        const index = configManager.getAndIncrementSpinIndex();
        return this.getSpinResult(index);
    }

    /**
     * 獲取總 spin 數
     */
    public getTotalSpins(): number {
        if (!this.isLoaded || !this.batchData) {
            return 0;
        }
        return this.batchData.results?.length || 0;
    }

    /**
     * 檢查是否已載入
     */
    public isDataLoaded(): boolean {
        return this.isLoaded && this.batchData !== null;
    }

    /**
     * 重置數據
     */
    public reset(): void {
        this.batchData = null;
        this.isLoaded = false;
        this.isLoading = false;
        this.loadPromise = null;
        console.log('[JsonDataLoader] 數據已重置');
    }

    /**
     * 將 JSON 結果轉換為遊戲可用的格式
     * （用於模擬伺服器回應）
     */
    public convertToGameFormat(jsonResult: JsonSpinResult): any {
        if (!jsonResult) {
            return null;
        }

        // 轉換為遊戲期望的格式
        const gameResult = {
            msgid: jsonResult.msgid || 107,  // eResultRecall
            status_code: jsonResult.status_code || 0,
            result: {
                module_id: jsonResult.result.module_id,
                credit: this.convertToLongFormat(jsonResult.result.credit),
                random_syb_pattern: jsonResult.result.random_syb_pattern,
                win_line: jsonResult.result.win_line?.map(line => ({
                    line_id: line.line_id,
                    symbol_id: line.symbol_id,
                    symbol_count: line.symbol_count,
                    credit: this.convertToLongFormat(line.credit),
                    bonus_result: line.bonus_result
                })) || [],
                win_bonus_group: jsonResult.result.win_bonus_group || [],
                free_spins_result: jsonResult.result.free_spins_result,
                scatter_result: jsonResult.result.scatter_result,
                cent_in_ask: []  // 可選：Jackpot/RedPacket 資訊
            },
            player_cent: this.convertToLongFormat(jsonResult.player_cent),
            next_module: jsonResult.next_module,
            cur_module_play_times: jsonResult.cur_module_play_times,
            cur_module_total_times: jsonResult.cur_module_total_times,
            accounting_sn: this.convertToLongFormat(jsonResult.accounting_sn)
        };

        return gameResult;
    }

    /**
     * 將數字轉換為 Long 格式（Cocos 使用的格式）
     */
    private convertToLongFormat(value: number): any {
        // 簡單實現：如果值在安全整數範圍內，直接返回
        if (value <= Number.MAX_SAFE_INTEGER && value >= Number.MIN_SAFE_INTEGER) {
            const low = value & 0xFFFFFFFF;
            const high = Math.floor(value / 0x100000000);
            return {
                low: low,
                high: high,
                unsigned: value >= 0
            };
        }
        return {
            low: value,
            high: 0,
            unsigned: value >= 0
        };
    }
}
