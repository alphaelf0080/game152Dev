import { CircularBuffer } from './CircularBuffer';

/**
 * Strip 管理器配置
 */
interface StripManagerConfig {
    reelCol: number;        // 滾輪列數
    realReelRow: number;    // 實際滾輪行數（包含隱藏行）
    reelRow: number;        // 可見滾輪行數
    topReelIndex: number;   // 頂部滾輪索引
}

/**
 * Strip 數據管理器
 * 使用環形緩衝區優化記憶體使用和效能
 */
export class StripManager {
    private config: StripManagerConfig;
    
    // 使用環形緩衝區替代原始陣列
    private stripBuffers: CircularBuffer<number>[] = [];
    private payBuffers: CircularBuffer<number>[] = [];
    
    // Strip 數據
    private strips: number[][] = [];
    private curRngRunning: number[] = [];
    private scriptToStop: number[][] = [];

    constructor(config: StripManagerConfig) {
        this.config = config;
        this.initializeBuffers();
    }

    /**
     * 初始化環形緩衝區
     */
    private initializeBuffers(): void {
        for (let i = 0; i < this.config.reelCol; i++) {
            this.stripBuffers[i] = new CircularBuffer<number>(this.config.realReelRow, 0);
            this.payBuffers[i] = new CircularBuffer<number>(this.config.realReelRow, 0);
            this.curRngRunning[i] = 0;
        }
    }

    /**
     * 設置 Strip 數據
     */
    setStrips(strips: number[][]): void {
        this.strips = strips;
    }

    /**
     * 獲取 Strip 數據
     */
    getStrips(): number[][] {
        return this.strips;
    }

    /**
     * 設置停止腳本數據
     */
    setScriptToStop(scriptToStop: number[][]): void {
        this.scriptToStop = scriptToStop;
    }

    /**
     * 更新符號信息（優化版本，使用環形緩衝區）
     */
    updateSymbolInfo(
        index: number, 
        num: number, 
        randomPayFunc: (symbol: number) => number,
        getSymbolExtraPayFunc: (symbol: number, isLastResult: boolean, finalPos: number, index: number) => number
    ): void {
        let symbol: number;
        let pay: number;

        if (num === -1) {
            // 從 strip 中獲取數據
            const strip = this.strips[index];
            this.curRngRunning[index] = this.curRngRunning[index] - 1;
            
            if (this.curRngRunning[index] < 0) {
                this.curRngRunning[index] = strip.length - 1;
            }
            if (this.curRngRunning[index] >= strip.length) {
                this.curRngRunning[index] = this.curRngRunning[index] % strip.length;
            }
            
            symbol = strip[this.curRngRunning[index]];
            pay = randomPayFunc(symbol);
        } else {
            // 從停止腳本中獲取數據
            symbol = this.scriptToStop[index][num];
            const isLastResult = this.scriptToStop[index].length <= this.config.reelRow && 
                                 this.scriptToStop[index].length > 0;
            const finalPos = this.scriptToStop[index].length - 1;
            pay = getSymbolExtraPayFunc(symbol, isLastResult, finalPos, index);
        }

        // 使用環形緩衝區的 O(1) 操作
        this.stripBuffers[index].unshift(symbol);
        this.payBuffers[index].unshift(pay);
    }

    /**
     * 獲取當前 Strip 數據（轉換為陣列）
     */
    getCurrentStrips(): number[][] {
        const result: number[][] = [];
        for (let i = 0; i < this.config.reelCol; i++) {
            result.push(this.stripBuffers[i].toArray());
        }
        return result;
    }

    /**
     * 獲取當前 Pay Strip 數據
     */
    getCurrentPayStrips(): number[][] {
        const result: number[][] = [];
        for (let i = 0; i < this.config.reelCol; i++) {
            result.push(this.payBuffers[i].toArray());
        }
        return result;
    }

    /**
     * 獲取指定滾輪的當前 Strip
     */
    getReelStrip(index: number): number[] {
        if (index < 0 || index >= this.config.reelCol) {
            return [];
        }
        return this.stripBuffers[index].toArray();
    }

    /**
     * 初始化 FOV Strip
     */
    initFovStrip(
        rng: number[],
        getSymbolExtraPayFunc: (symbol: number, isLastResult: boolean, finalPos: number, index: number) => number
    ): void {
        for (let i = 0; i < this.config.reelCol; i++) {
            let pos = ((rng[i] - 2) + this.strips[i].length) % this.strips[i].length;
            this.curRngRunning[i] = pos;

            // 重置緩衝區
            this.stripBuffers[i].reset();
            this.payBuffers[i].reset();

            for (let j = 0; j < this.config.realReelRow; j++) {
                pos = pos % this.strips[i].length;
                const symbol = this.strips[i][pos];
                const pay = getSymbolExtraPayFunc(
                    symbol,
                    j - 1 <= this.config.reelRow,
                    j - 1,
                    i
                );
                
                this.stripBuffers[i].set(j, symbol);
                this.payBuffers[i].set(j, pay);
                pos++;
            }
        }
    }

    /**
     * 設置所有 Strip（從 RNG 數據）
     */
    setAllStrip(rng: number[]): void {
        if (!rng || rng.length === 0) return;

        this.scriptToStop = [];

        for (let i = 0; i < rng.length; i++) {
            const tmpAry: number[] = [];
            let pos = rng[i] - 2;
            
            if (pos < 0) {
                pos = this.strips[i].length + pos;
            }

            for (let j = 0; j < this.config.realReelRow; j++) {
                tmpAry.push(this.strips[i][pos++]);
                if (pos >= this.strips[i].length) {
                    pos -= this.strips[i].length;
                }
            }
            
            this.scriptToStop.push(tmpAry);
        }
    }

    /**
     * 獲取當前 RNG Running 狀態
     */
    getCurRngRunning(): number[] {
        return [...this.curRngRunning];
    }

    /**
     * 重置管理器
     */
    reset(): void {
        this.strips = [];
        this.scriptToStop = [];
        this.curRngRunning.fill(0);
        
        for (let i = 0; i < this.config.reelCol; i++) {
            this.stripBuffers[i].reset(0);
            this.payBuffers[i].reset(0);
        }
    }
}
