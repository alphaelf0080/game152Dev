/**
 * Spin Server API 客戶端
 * 
 * 提供與後端 Spin Server (gameServer/spin_server.py) 通訊的功能
 * 
 * @author Game Development Team
 * @date 2025-10-14
 */

import { _decorator, Component } from 'cc';

const { ccclass } = _decorator;

/**
 * Spin Server 配置
 */
export interface SpinServerConfig {
    // API 基礎 URL
    baseUrl: string;
    
    // 超時時間（毫秒）
    timeout: number;
    
    // 是否啟用日誌
    verbose: boolean;
}

/**
 * Spin 請求參數
 */
export interface SpinRequest {
    bet: number;
    spin_type: string;
    player_id?: string;
    session_id?: string;
}

/**
 * Spin 回應資料
 */
export interface SpinResponse {
    success: boolean;
    data?: SpinResultData;
    error?: string;
    timestamp: string;
    session_id?: string;
}

/**
 * 遊戲結果資料（對應 SimpleDataExporter 格式）
 */
export interface SpinResultData {
    module_id: string;
    credit: number;
    rng: number[];
    win: number;
    winLineGrp: WinLineData[];
    multiplierAlone: number;
    mulitplierPattern: number[];
    next_module: string;
    winBonusGrp: any[];
    jp_count: number;
    jp: number;
}

/**
 * 贏線資料
 */
export interface WinLineData {
    win_line_type: number;
    line_no: number;
    symbol_id: number;
    pos: number[];
    credit: number;
    multiplier: number;
    credit_long: {
        low: number;
        high: number;
        unsigned: boolean;
    };
}

@ccclass('SpinServerClient')
export class SpinServerClient {
    private config: SpinServerConfig;
    private sessionId: string;
    
    constructor(config?: Partial<SpinServerConfig>) {
        this.config = {
            baseUrl: 'http://localhost:8000/api',
            timeout: 30000,
            verbose: true,
            ...config
        };
        
        this.sessionId = this.generateSessionId();
        this.log('SpinServerClient 已初始化', {
            baseUrl: this.config.baseUrl,
            sessionId: this.sessionId
        });
    }
    
    /**
     * 執行 Spin 請求
     */
    public async executeSpin(bet: number, spinType: string = 'normal'): Promise<SpinResultData> {
        const request: SpinRequest = {
            bet: bet,
            spin_type: spinType,
            session_id: this.sessionId
        };
        
        this.log('🎲 執行 Spin 請求', request);
        
        try {
            const response = await this.fetch('/spin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });
            
            const result: SpinResponse = await response.json();
            
            if (result.success && result.data) {
                this.log('✅ Spin 成功', {
                    win: result.data.win,
                    module: result.data.module_id
                });
                return result.data;
            } else {
                throw new Error(result.error || 'Spin 失敗');
            }
        } catch (error) {
            this.error('❌ Spin 請求失敗', error);
            throw error;
        }
    }
    
    /**
     * 健康檢查
     */
    public async checkHealth(): Promise<boolean> {
        console.log('[DEBUG SpinServerClient] checkHealth() called');
        console.log('[DEBUG SpinServerClient] baseUrl:', this.config.baseUrl);
        
        try {
            const url = `${this.config.baseUrl}/health`;
            console.log('[DEBUG SpinServerClient] Fetching URL:', url);
            
            const response = await this.fetch('/health', {
                method: 'GET'
            });
            
            console.log('[DEBUG SpinServerClient] Response received');
            console.log('[DEBUG SpinServerClient] Response status:', response.status);
            console.log('[DEBUG SpinServerClient] Response ok:', response.ok);
            
            const data = await response.json();
            console.log('[DEBUG SpinServerClient] Response data:', data);
            
            const isHealthy = data.status === 'ok';
            
            this.log(isHealthy ? '✅ 伺服器健康' : '⚠️ 伺服器異常', data);
            return isHealthy;
        } catch (error) {
            console.error('[DEBUG SpinServerClient] checkHealth error:', error);
            this.error('❌ 健康檢查失敗', error);
            return false;
        }
    }
    
    /**
     * 獲取伺服器狀態
     */
    public async getStatus(): Promise<any> {
        try {
            const response = await this.fetch('/status', {
                method: 'GET'
            });
            
            const data = await response.json();
            this.log('📊 伺服器狀態', data);
            return data;
        } catch (error) {
            this.error('❌ 獲取狀態失敗', error);
            throw error;
        }
    }
    
    /**
     * 獲取初始盤面資料
     */
    public async getInitialBoard(): Promise<SpinResultData> {
        this.log('📋 獲取初始盤面');
        
        try {
            const response = await this.fetch(`/init?session_id=${this.sessionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const result: SpinResponse = await response.json();
            
            if (result.success && result.data) {
                this.log('✅ 初始盤面獲取成功', result.data);
                return result.data;
            } else {
                throw new Error(result.error || '初始盤面獲取失敗');
            }
        } catch (error) {
            this.error('❌ 初始盤面獲取失敗', error);
            throw error;
        }
    }
    
    /**
     * 執行 Fetch 請求
     */
    private async fetch(endpoint: string, options: RequestInit): Promise<Response> {
        const url = `${this.config.baseUrl}${endpoint}`;
        console.log('[DEBUG SpinServerClient] fetch() called');
        console.log('[DEBUG SpinServerClient] Full URL:', url);
        console.log('[DEBUG SpinServerClient] Options:', options);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('[DEBUG SpinServerClient] Request timeout!');
            controller.abort();
        }, this.config.timeout);
        
        try {
            console.log('[DEBUG SpinServerClient] Calling native fetch...');
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            console.log('[DEBUG SpinServerClient] Native fetch completed');
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                console.error('[DEBUG SpinServerClient] Response not ok:', response.status, response.statusText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            console.log('[DEBUG SpinServerClient] Response ok, returning');
            return response;
        } catch (error) {
            console.error('[DEBUG SpinServerClient] Fetch error:', error);
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`請求超時 (${this.config.timeout}ms)`);
            }
            
            throw error;
        }
    }
    
    /**
     * 生成會話 ID
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * 日誌輸出
     */
    private log(message: string, data?: any) {
        if (!this.config.verbose) return;
        
        if (data) {
            console.log(`[SpinServerClient] ${message}`, data);
        } else {
            console.log(`[SpinServerClient] ${message}`);
        }
    }
    
    /**
     * 錯誤輸出
     */
    private error(message: string, error?: any) {
        if (error) {
            console.error(`[SpinServerClient] ${message}`, error);
        } else {
            console.error(`[SpinServerClient] ${message}`);
        }
    }
    
    /**
     * 更新配置
     */
    public updateConfig(config: Partial<SpinServerConfig>) {
        this.config = {
            ...this.config,
            ...config
        };
        this.log('配置已更新', this.config);
    }
    
    /**
     * 獲取當前配置
     */
    public getConfig(): SpinServerConfig {
        return { ...this.config };
    }
}

/**
 * 全域 Spin Server 客戶端實例
 */
let globalSpinServerClient: SpinServerClient | null = null;

/**
 * 獲取全域 Spin Server 客戶端
 */
export function getSpinServerClient(config?: Partial<SpinServerConfig>): SpinServerClient {
    if (!globalSpinServerClient) {
        globalSpinServerClient = new SpinServerClient(config);
    } else if (config) {
        globalSpinServerClient.updateConfig(config);
    }
    return globalSpinServerClient;
}

/**
 * 重置全域客戶端
 */
export function resetSpinServerClient() {
    globalSpinServerClient = null;
}
