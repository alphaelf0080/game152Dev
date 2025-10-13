import { _decorator, Component, Node, resources, JsonAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugJSONLoader')
export class DebugJSONLoader extends Component {
    @property
    jsonFilePath: string = 'debug/test_results';
    
    @property
    autoLoad: boolean = false;
    
    @property
    loopPlayback: boolean = false;
    
    @property
    playbackDelay: number = 2.0; // 秒
    
    @property
    filterMinWin: number = 0; // 過濾條件：最小贏分
    
    private currentResultIndex: number = 0;
    private allResults: any[] = [];
    private isPlaying: boolean = false;
    
    start() {
        if (CC_DEBUG && this.autoLoad) {
            this.loadJSONResults();
        }
    }
    
    /**
     * 從本地載入 JSON 結果檔案
     */
    public loadJSONResults() {
        console.log(`[DebugJSONLoader] 開始載入: ${this.jsonFilePath}`);
        
        resources.load(this.jsonFilePath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error('[DebugJSONLoader] 載入失敗:', err);
                return;
            }
            
            try {
                const jsonData = jsonAsset.json;
                console.log('[DebugJSONLoader] 載入成功:', {
                    session_id: jsonData.session_info?.session_id,
                    total_spins: jsonData.session_info?.total_spins
                });
                
                // 解析並套用結果
                if (jsonData.results && Array.isArray(jsonData.results)) {
                    this.processBatchResults(jsonData.results);
                }
            } catch (error) {
                console.error('[DebugJSONLoader] 解析 JSON 失敗:', error);
            }
        });
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