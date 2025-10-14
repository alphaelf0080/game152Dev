/**
 * 本地結果提供者
 * 負責從 JSON 檔案載入遊戲結果，並提供給遊戲使用
 * 
 * 功能:
 * - 從 resources 目錄載入 JSON 檔案
 * - 管理結果列表和當前索引
 * - 提供循環讀取功能
 * - 將 Proto 格式轉換為遊戲格式
 * 
 * @author Cocos Creator Team
 * @date 2025-10-13
 */

import { _decorator, Component, resources, JsonAsset } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 遊戲結果格式（轉換後）
 */
export interface GameResult {
    // 滾輪符號
    reels: number[][];
    
    // 贏線資訊
    winLines: WinLine[];
    
    // 總贏分
    totalWin: number;
    
    // 倍率
    multiplier: number;
    
    // 免費旋轉
    freeSpins: FreeSpinInfo | null;
    
    // 戰鼓特性
    warDrums: any | null;
    
    // 原始數據（調試用）
    raw: any;
}

/**
 * 贏線資訊
 */
export interface WinLine {
    symbolId: number;
    count: number;
    positions: number[];
    winCredit: number;
    isWild: boolean;
}

/**
 * 免費旋轉資訊
 */
export interface FreeSpinInfo {
    type: string;
    count: number;
    isRetrigger: boolean;
}

/**
 * JSON 載入回調
 */
export interface LoadCallback {
    onSuccess?: (totalResults: number) => void;
    onError?: (error: string) => void;
}

@ccclass('LocalResultProvider')
export class LocalResultProvider extends Component {
    // ========== 私有屬性 ==========
    
    // 所有結果（Proto 格式）
    private allResults: any[] = [];
    
    // 當前結果索引
    private currentIndex: number = 0;
    
    // 是否已載入
    private isLoaded: boolean = false;
    
    // 當前載入的檔案路徑
    private currentPath: string = '';
    
    // ========== 公開方法 ==========
    
    /**
     * 載入 JSON 結果檔案
     * @param jsonPath JSON 檔案路徑（相對於 resources，不需 .json 副檔名）
     * @param callback 載入回調
     * 
     * @example
     * provider.loadJSON('local_results/batch_100_spins', {
     *     onSuccess: (count) => console.log(`載入 ${count} 筆結果`),
     *     onError: (err) => console.error('載入失敗:', err)
     * });
     */
    public loadJSON(jsonPath: string, callback?: LoadCallback): void {
        console.log(`[LocalResultProvider] 開始載入 JSON: ${jsonPath}`);
        
        this.currentPath = jsonPath;
        this.isLoaded = false;
        this.allResults = [];
        this.currentIndex = 0;
        
        resources.load(jsonPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                const errorMsg = `載入 JSON 失敗: ${err.message}`;
                console.error('[LocalResultProvider]', errorMsg);
                console.error('[LocalResultProvider] 檔案路徑:', jsonPath);
                console.error('[LocalResultProvider] 請確認:');
                console.error('  1. 檔案是否在 assets/resources/ 目錄下');
                console.error('  2. 路徑是否正確（不含 resources/ 前綴和 .json 副檔名）');
                console.error('  3. 檔案是否已在 Cocos Creator 中刷新');
                
                if (callback?.onError) {
                    callback.onError(errorMsg);
                }
                return;
            }
            
            try {
                const jsonData = jsonAsset.json;
                
                // 驗證 JSON 格式
                if (!this.validateJSON(jsonData)) {
                    const errorMsg = 'JSON 格式錯誤: 找不到有效的 results 陣列';
                    console.error('[LocalResultProvider]', errorMsg);
                    
                    if (callback?.onError) {
                        callback.onError(errorMsg);
                    }
                    return;
                }
                
                // 提取結果
                this.allResults = jsonData.results;
                this.currentIndex = 0;
                this.isLoaded = true;
                
                console.log(`[LocalResultProvider] 載入成功:`);
                console.log(`  - 檔案: ${jsonPath}`);
                console.log(`  - 結果數量: ${this.allResults.length}`);
                console.log(`  - Session ID: ${jsonData.session_info?.session_id || 'N/A'}`);
                
                // 發送事件
                this.node.emit('json-loaded', {
                    path: jsonPath,
                    totalResults: this.allResults.length,
                    sessionInfo: jsonData.session_info
                });
                
                if (callback?.onSuccess) {
                    callback.onSuccess(this.allResults.length);
                }
                
            } catch (error) {
                const errorMsg = `解析 JSON 失敗: ${error.message}`;
                console.error('[LocalResultProvider]', errorMsg);
                
                if (callback?.onError) {
                    callback.onError(errorMsg);
                }
            }
        });
    }
    
    /**
     * 獲取下一個遊戲結果
     * @returns 轉換後的遊戲結果，如果沒有結果則返回 null
     * 
     * @example
     * const result = provider.getNextResult();
     * if (result) {
     *     console.log('滾輪:', result.reels);
     *     console.log('贏分:', result.totalWin);
     * }
     */
    public getNextResult(): GameResult | null {
        if (!this.isLoaded || this.allResults.length === 0) {
            console.warn('[LocalResultProvider] 沒有可用的結果');
            return null;
        }
        
        // 獲取當前結果
        const protoResult = this.allResults[this.currentIndex];
        
        // 記錄當前索引（用於事件）
        const oldIndex = this.currentIndex;
        
        // 移動到下一個索引（循環）
        this.currentIndex = (this.currentIndex + 1) % this.allResults.length;
        
        // 如果循環了，發送事件
        if (this.currentIndex === 0 && oldIndex > 0) {
            console.log('[LocalResultProvider] 結果已循環到開頭');
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
     * 獲取指定索引的結果（不改變當前索引）
     * @param index 結果索引
     * @returns 遊戲結果，如果索引無效返回 null
     */
    public getResultAt(index: number): GameResult | null {
        if (!this.isLoaded || index < 0 || index >= this.allResults.length) {
            return null;
        }
        
        return this.convertToGameFormat(this.allResults[index]);
    }
    
    /**
     * 重置索引到開頭
     */
    public reset(): void {
        this.currentIndex = 0;
        console.log('[LocalResultProvider] 索引已重置');
    }
    
    /**
     * 設置當前索引
     * @param index 新的索引值
     */
    public setIndex(index: number): void {
        if (index >= 0 && index < this.allResults.length) {
            this.currentIndex = index;
            console.log(`[LocalResultProvider] 索引設置為: ${index}`);
        }
    }
    
    /**
     * 獲取當前狀態資訊
     */
    public getInfo(): any {
        return {
            isLoaded: this.isLoaded,
            currentPath: this.currentPath,
            totalResults: this.allResults.length,
            currentIndex: this.currentIndex,
            hasMore: this.allResults.length > 0
        };
    }
    
    /**
     * 檢查是否已載入
     */
    public isReady(): boolean {
        return this.isLoaded && this.allResults.length > 0;
    }
    
    // ========== 私有方法 ==========
    
    /**
     * 驗證 JSON 格式
     */
    private validateJSON(jsonData: any): boolean {
        if (!jsonData) {
            return false;
        }
        
        if (!jsonData.results || !Array.isArray(jsonData.results)) {
            return false;
        }
        
        if (jsonData.results.length === 0) {
            console.warn('[LocalResultProvider] JSON 檔案中沒有結果');
            return false;
        }
        
        return true;
    }
    
    /**
     * 將 Proto 格式轉換為遊戲格式
     */
    private convertToGameFormat(protoResult: any): GameResult {
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
    private convertWinGroups(winGroups: any[]): WinLine[] {
        if (!winGroups || winGroups.length === 0) {
            return [];
        }
        
        return winGroups.map(group => ({
            symbolId: group.symbol_id || 0,
            count: group.symbol_count || 0,
            positions: group.symbol_positions || [],
            winCredit: group.win_credit || 0,
            isWild: group.is_wild || false
        }));
    }
    
    /**
     * 轉換獎勵群組（免費旋轉等）
     */
    private convertBonusGroup(bonusGroups: any[]): FreeSpinInfo | null {
        if (!bonusGroups || bonusGroups.length === 0) {
            return null;
        }
        
        const bonus = bonusGroups[0];
        return {
            type: bonus.win_bonus_type || 'UNKNOWN',
            count: bonus.win_bonus_count || 0,
            isRetrigger: bonus.is_retrigger || false
        };
    }
}
