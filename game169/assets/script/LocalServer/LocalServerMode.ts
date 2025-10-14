/**
 * 本地伺服器模式
 * 允許遊戲在開發和測試階段完全離線運行
 * 
 * 核心功能:
 * - 通過 URL 參數 ?localServer=true 自動啟用
 * - 自動載入本地 JSON 結果檔案
 * - 提供與正常伺服器一致的介面
 * - 支援結果循環和場景切換
 * 
 * 使用方式:
 * 1. 在場景中創建節點並添加此組件
 * 2. 設置 defaultJsonPath 屬性
 * 3. 在 URL 中添加 ?localServer=true
 * 4. 調用 getNextResult() 獲取每次 Spin 的結果
 * 
 * @author Cocos Creator Team
 * @date 2025-10-13
 */

import { _decorator, Component, Node } from 'cc';
import { URLParamParser } from './URLParamParser';
import { LocalResultProvider, GameResult } from './LocalResultProvider';

const { ccclass, property } = _decorator;

/**
 * 本地伺服器模式配置
 */
export interface LocalServerConfig {
    // 是否啟用本地模式
    enabled: boolean;
    
    // JSON 檔案路徑
    jsonPath: string;
    
    // 是否自動載入
    autoLoad: boolean;
}

@ccclass('LocalServerMode')
export class LocalServerMode extends Component {
    // ========== 編輯器屬性 ==========
    
    @property({
        tooltip: '預設的 JSON 檔案路徑（相對於 resources 目錄，不需 .json 副檔名）\n' +
                 '例如: local_results/batch_results_100_spins'
    })
    public defaultJsonPath: string = 'local_results/batch_results_100_spins';
    
    @property({
        tooltip: '是否啟用本地模式\n' +
                 '通常由 URL 參數自動控制，也可以手動設置'
    })
    public enableMode: boolean = false;
    
    @property({
        tooltip: '是否在啟動時自動載入 JSON\n' +
                 '建議保持為 true'
    })
    public autoLoad: boolean = true;
    
    @property({
        tooltip: '是否顯示詳細的調試日誌'
    })
    public verbose: boolean = true;
    
    // ========== 私有屬性 ==========
    
    // 結果提供者
    private resultProvider: LocalResultProvider = null;
    
    // 是否已初始化
    private isInitialized: boolean = false;
    
    // URL 配置
    private urlConfig: LocalServerConfig | null = null;
    
    // ========== 生命週期方法 ==========
    
    start() {
        this.log('LocalServerMode 正在初始化...');
        
        // 檢查 URL 參數
        this.checkURLParameters();
        
        // 初始化結果提供者
        this.initializeProvider();
        
        // 如果啟用了本地模式，自動載入 JSON
        if (this.enableMode && this.autoLoad) {
            this.loadJSON();
        }
        
        this.isInitialized = true;
        this.log('LocalServerMode 初始化完成');
    }
    
    // ========== 公開方法 ==========
    
    /**
     * 獲取下一個遊戲結果
     * @returns 遊戲結果，如果沒有結果則返回 null
     * 
     * @example
     * // 在 GameController 的 Spin 處理中
     * const result = this.localServerMode.getNextResult();
     * if (result) {
     *     await this.applyGameResult(result);
     * }
     */
    public getNextResult(): GameResult | null {
        if (!this.isLocalMode()) {
            this.warn('本地模式未啟用，無法獲取結果');
            return null;
        }
        
        if (!this.resultProvider) {
            this.warn('結果提供者未初始化');
            return null;
        }
        
        const result = this.resultProvider.getNextResult();
        
        if (result) {
            this.log(`獲取結果 - 贏分: ${result.totalWin}, 倍率: ${result.multiplier}x`);
        }
        
        return result;
    }
    
    /**
     * 載入 JSON 結果檔案
     * @param jsonPath 可選的 JSON 路徑，如果不提供則使用 defaultJsonPath
     * @returns Promise，載入完成後 resolve
     */
    public loadJSON(jsonPath?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.resultProvider) {
                const error = '結果提供者未初始化';
                this.error(error);
                reject(new Error(error));
                return;
            }
            
            const pathToLoad = jsonPath || this.urlConfig?.jsonPath || this.defaultJsonPath;
            
            this.log(`準備載入 JSON: ${pathToLoad}`);
            
            this.resultProvider.loadJSON(pathToLoad, {
                onSuccess: (totalResults) => {
                    this.log(`JSON 載入成功: ${totalResults} 筆結果`);
                    
                    // 發送本地伺服器就緒事件
                    this.node.emit('local-server-ready', {
                        totalResults: totalResults,
                        currentIndex: 0,
                        jsonPath: pathToLoad
                    });
                    
                    resolve();
                },
                onError: (error) => {
                    this.error(`JSON 載入失敗: ${error}`);
                    reject(new Error(error));
                }
            });
        });
    }
    
    /**
     * 切換到不同的測試場景
     * @param scenarioName 場景名稱或完整路徑
     * 
     * @example
     * // 使用預設場景
     * localServerMode.switchScenario('big_win');
     * 
     * // 使用完整路徑
     * localServerMode.switchScenario('local_results/test_free_spins');
     */
    public switchScenario(scenarioName: string): Promise<void> {
        this.log(`切換場景: ${scenarioName}`);
        
        // 預定義場景（可以擴展）
        const scenarios: Record<string, string> = {
            'basic': 'local_results/batch_100_spins',
            'big_win': 'local_results/test_big_win',
            'free_spins': 'local_results/test_free_spins',
            'war_drums': 'local_results/test_war_drums',
            'max_win': 'local_results/test_max_win',
            'demo': 'local_results/demo_showcase',
        };
        
        // 如果是預定義場景，使用對應路徑，否則直接使用輸入值
        const path = scenarios[scenarioName] || scenarioName;
        
        return this.loadJSON(path);
    }
    
    /**
     * 重置結果索引到開頭
     */
    public reset(): void {
        if (this.resultProvider) {
            this.resultProvider.reset();
            this.log('結果索引已重置');
        }
    }
    
    /**
     * 設置結果索引
     * @param index 新的索引值
     */
    public setIndex(index: number): void {
        if (this.resultProvider) {
            this.resultProvider.setIndex(index);
        }
    }
    
    /**
     * 檢查是否處於本地模式
     * @returns 是否啟用且已就緒
     */
    public isLocalMode(): boolean {
        return this.enableMode && 
               this.resultProvider !== null && 
               this.resultProvider.isReady();
    }
    
    /**
     * 獲取當前狀態資訊
     */
    public getInfo(): any {
        const providerInfo = this.resultProvider ? this.resultProvider.getInfo() : null;
        
        return {
            // 本地模式狀態
            enableMode: this.enableMode,
            isInitialized: this.isInitialized,
            isReady: this.isLocalMode(),
            
            // URL 配置
            urlConfig: this.urlConfig,
            
            // 結果提供者資訊
            provider: providerInfo,
            
            // 配置
            defaultJsonPath: this.defaultJsonPath,
            autoLoad: this.autoLoad,
        };
    }
    
    /**
     * 啟用本地模式
     */
    public enable(): void {
        this.enableMode = true;
        this.log('本地模式已啟用');
        
        if (this.autoLoad && !this.resultProvider?.isReady()) {
            this.loadJSON();
        }
    }
    
    /**
     * 停用本地模式
     */
    public disable(): void {
        this.enableMode = false;
        this.log('本地模式已停用');
    }
    
    // ========== 私有方法 ==========
    
    /**
     * 檢查 URL 參數
     */
    private checkURLParameters(): void {
        // 檢查是否啟用本地模式
        if (URLParamParser.isParamTrue('localServer')) {
            this.enableMode = true;
            this.log('URL 參數檢測到本地伺服器模式');
            
            // 檢查是否有自定義 JSON 路徑
            const customPath = URLParamParser.getParam('jsonPath');
            
            // 檢查其他配置
            const autoLoad = !URLParamParser.hasParam('noAutoLoad');
            
            // 保存 URL 配置
            this.urlConfig = {
                enabled: true,
                jsonPath: customPath || this.defaultJsonPath,
                autoLoad: autoLoad
            };
            
            this.log('URL 配置:', this.urlConfig);
        }
    }
    
    /**
     * 初始化結果提供者
     */
    private initializeProvider(): void {
        // 創建結果提供者節點
        const providerNode = new Node('LocalResultProvider');
        providerNode.setParent(this.node);
        
        // 添加組件
        this.resultProvider = providerNode.addComponent(LocalResultProvider);
        
        // 監聽事件
        this.setupEventListeners();
        
        this.log('結果提供者已初始化');
    }
    
    /**
     * 設置事件監聽
     */
    private setupEventListeners(): void {
        if (!this.resultProvider) return;
        
        const providerNode = this.resultProvider.node;
        
        // JSON 載入完成
        providerNode.on('json-loaded', (data: any) => {
            this.log(`JSON 已載入: ${data.totalResults} 筆結果`);
            this.node.emit('local-server-ready', data);
        });
        
        // 結果索引變化
        providerNode.on('result-index-changed', (data: any) => {
            if (this.verbose) {
                this.log(`結果索引: ${data.index}/${data.total}`);
            }
            this.node.emit('result-index-changed', data);
        });
        
        // 結果循環
        providerNode.on('results-cycled', () => {
            this.log('結果已循環到開頭');
            this.node.emit('results-cycled');
        });
    }
    
    // ========== 日誌方法 ==========
    
    private log(message: string, ...args: any[]): void {
        if (this.verbose) {
            console.log(`[LocalServerMode] ${message}`, ...args);
        }
    }
    
    private warn(message: string, ...args: any[]): void {
        console.warn(`[LocalServerMode] ${message}`, ...args);
    }
    
    private error(message: string, ...args: any[]): void {
        console.error(`[LocalServerMode] ${message}`, ...args);
    }
    
    // ========== 調試方法 ==========
    
    /**
     * 打印當前狀態（用於調試）
     */
    public debugPrintStatus(): void {
        console.log('========== LocalServerMode Status ==========');
        console.log(JSON.stringify(this.getInfo(), null, 2));
        console.log('==========================================');
    }
    
    onDestroy() {
        this.log('LocalServerMode 正在銷毀');
    }
}
