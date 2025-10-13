/**
 * 模擬結果處理器
 * 用於在本地 JSON 模式下模擬伺服器回應
 */

import { SimulatorConfigManager, ResultSourceMode } from "./SimulatorConfig";
import { JsonDataLoader } from "./JsonDataLoader";

export class SimulatedResultHandler {
    private static instance: SimulatedResultHandler;
    private configManager: SimulatorConfigManager;
    private dataLoader: JsonDataLoader;
    private isInitialized: boolean = false;

    private constructor() {
        this.configManager = SimulatorConfigManager.getInstance();
        this.dataLoader = JsonDataLoader.getInstance();
    }

    public static getInstance(): SimulatedResultHandler {
        if (!SimulatedResultHandler.instance) {
            SimulatedResultHandler.instance = new SimulatedResultHandler();
        }
        return SimulatedResultHandler.instance;
    }

    /**
     * 初始化模擬器（如果使用本地 JSON 模式）
     */
    public async initialize(): Promise<boolean> {
        if (this.isInitialized) {
            return true;
        }

        const config = this.configManager.getConfig();
        
        // 只有在本地 JSON 模式下才需要初始化
        if (config.mode === ResultSourceMode.LOCAL_JSON) {
            console.log('[SimulatedResultHandler] 初始化本地 JSON 模式');
            const success = await this.dataLoader.loadJsonFile(config.jsonFilePath);
            
            if (success) {
                console.log('[SimulatedResultHandler] 本地 JSON 數據載入成功');
                console.log('[SimulatedResultHandler] 可用 spin 數:', this.dataLoader.getTotalSpins());
                this.isInitialized = true;
                return true;
            } else {
                console.error('[SimulatedResultHandler] 本地 JSON 數據載入失敗');
                return false;
            }
        }

        // 伺服器模式不需要初始化
        this.isInitialized = true;
        return true;
    }

    /**
     * 檢查是否應該使用模擬結果
     */
    public shouldUseSimulatedResult(): boolean {
        return this.configManager.isLocalJsonMode() && this.dataLoader.isDataLoaded();
    }

    /**
     * 獲取模擬的遊戲結果
     * 這個方法會被 ProtoConsole 調用來替代真實的伺服器請求
     */
    public getSimulatedResult(): any | null {
        if (!this.shouldUseSimulatedResult()) {
            console.warn('[SimulatedResultHandler] 無法提供模擬結果：模式錯誤或數據未載入');
            return null;
        }

        const jsonResult = this.dataLoader.getNextSpinResult();
        if (!jsonResult) {
            console.error('[SimulatedResultHandler] 無法獲取下一個 spin 結果');
            return null;
        }

        // 轉換為遊戲格式
        const gameResult = this.dataLoader.convertToGameFormat(jsonResult);
        
        console.log(`[SimulatedResultHandler] 提供模擬結果 - Spin ${jsonResult.spin_number}`);
        console.log('[SimulatedResultHandler] 獲勝金額:', jsonResult.result.credit);
        
        return gameResult;
    }

    /**
     * 獲取當前模式的描述（用於調試）
     */
    public getModeDescription(): string {
        const config = this.configManager.getConfig();
        if (config.mode === ResultSourceMode.LOCAL_JSON) {
            const totalSpins = this.dataLoader.getTotalSpins();
            const currentIndex = config.currentSpinIndex;
            return `本地 JSON 模式 (${currentIndex}/${totalSpins} spins)`;
        }
        return '伺服器模式';
    }

    /**
     * 重置模擬器狀態
     */
    public reset(): void {
        this.configManager.resetSpinIndex();
        console.log('[SimulatedResultHandler] 模擬器已重置');
    }
}

/**
 * 全局輔助函數：檢查是否應該使用模擬結果
 */
export function shouldUseSimulatedResult(): boolean {
    return SimulatedResultHandler.getInstance().shouldUseSimulatedResult();
}

/**
 * 全局輔助函數：獲取模擬結果
 */
export function getSimulatedResult(): any | null {
    return SimulatedResultHandler.getInstance().getSimulatedResult();
}

/**
 * 全局輔助函數：初始化模擬器
 */
export async function initializeSimulator(): Promise<boolean> {
    return SimulatedResultHandler.getInstance().initialize();
}
