/**
 * 遊戲結果來源配置
 * 用於選擇使用開發伺服器或本地模擬 JSON 檔案
 */

export enum ResultSourceMode {
    /** 使用開發伺服器（正常模式） */
    SERVER = "server",
    /** 使用本地 JSON 模擬檔案 */
    LOCAL_JSON = "local_json"
}

export interface SimulatorConfig {
    /** 結果來源模式 */
    mode: ResultSourceMode;
    
    /** 本地 JSON 檔案路徑（當 mode 為 LOCAL_JSON 時使用） */
    jsonFilePath: string;
    
    /** 當前使用的 spin 索引（從 JSON 檔案中） */
    currentSpinIndex: number;
    
    /** 是否循環使用 JSON 資料（當到達最後一筆時重新開始） */
    loopResults: boolean;
}

/**
 * 模擬器配置管理器
 */
export class SimulatorConfigManager {
    private static instance: SimulatorConfigManager;
    private config: SimulatorConfig;

    private constructor() {
        // 預設配置
        this.config = {
            mode: ResultSourceMode.SERVER,  // 預設使用伺服器模式
            jsonFilePath: "http://localhost:9000/batch_results.json",  // 預設 JSON 路徑
            currentSpinIndex: 0,
            loopResults: true  // 預設循環使用
        };

        // 從 URL 參數讀取配置
        this.loadConfigFromURL();
    }

    public static getInstance(): SimulatorConfigManager {
        if (!SimulatorConfigManager.instance) {
            SimulatorConfigManager.instance = new SimulatorConfigManager();
        }
        return SimulatorConfigManager.instance;
    }

    /**
     * 從 URL 參數載入配置
     * 支援的參數：
     * - sim_mode: "server" 或 "local_json"
     * - sim_json: JSON 檔案的 URL 路徑
     * - sim_loop: "true" 或 "false"
     */
    private loadConfigFromURL(): void {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 讀取模式
        const mode = urlParams.get('sim_mode');
        if (mode === 'local_json') {
            this.config.mode = ResultSourceMode.LOCAL_JSON;
            console.log('[SimulatorConfig] 使用本地 JSON 模式');
        } else {
            this.config.mode = ResultSourceMode.SERVER;
            console.log('[SimulatorConfig] 使用伺服器模式');
        }
        
        // 讀取 JSON 路徑
        const jsonPath = urlParams.get('sim_json');
        if (jsonPath) {
            this.config.jsonFilePath = jsonPath;
            console.log('[SimulatorConfig] JSON 路徑:', jsonPath);
        }
        
        // 讀取循環設定
        const loop = urlParams.get('sim_loop');
        if (loop === 'false') {
            this.config.loopResults = false;
            console.log('[SimulatorConfig] 關閉循環模式');
        }
    }

    /**
     * 獲取當前配置
     */
    public getConfig(): SimulatorConfig {
        return { ...this.config };
    }

    /**
     * 檢查是否使用本地 JSON 模式
     */
    public isLocalJsonMode(): boolean {
        return this.config.mode === ResultSourceMode.LOCAL_JSON;
    }

    /**
     * 獲取當前 spin 索引並自動遞增
     */
    public getAndIncrementSpinIndex(): number {
        const currentIndex = this.config.currentSpinIndex;
        this.config.currentSpinIndex++;
        return currentIndex;
    }

    /**
     * 重置 spin 索引
     */
    public resetSpinIndex(): void {
        this.config.currentSpinIndex = 0;
        console.log('[SimulatorConfig] 重置 spin 索引');
    }

    /**
     * 設置配置（用於運行時修改）
     */
    public setConfig(config: Partial<SimulatorConfig>): void {
        this.config = { ...this.config, ...config };
        console.log('[SimulatorConfig] 配置已更新:', this.config);
    }
}
