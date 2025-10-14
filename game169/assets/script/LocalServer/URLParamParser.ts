/**
 * URL 參數解析工具
 * 用於解析瀏覽器 URL 的查詢參數
 * 
 * 使用範例:
 * - URLParamParser.isParamTrue('localServer')  // 檢查 ?localServer=true
 * - URLParamParser.getParam('jsonPath')        // 獲取 ?jsonPath=xxx
 * 
 * @author Cocos Creator Team
 * @date 2025-10-13
 */

import { sys } from 'cc';

export class URLParamParser {
    /**
     * 解析當前 URL 的所有參數
     * @returns 參數物件 { key: value }
     * 
     * @example
     * // URL: http://localhost:7456/?localServer=true&jsonPath=test&debug=1
     * // 返回: { localServer: 'true', jsonPath: 'test', debug: '1' }
     */
    public static parseURL(): Record<string, string> {
        const params: Record<string, string> = {};
        
        // 只在瀏覽器環境下解析
        if (!sys.isBrowser) {
            console.warn('[URLParamParser] 非瀏覽器環境，無法解析 URL 參數');
            return params;
        }
        
        try {
            const url = window.location.href;
            const queryString = url.split('?')[1];
            
            if (!queryString) {
                return params;
            }
            
            // 分割參數對
            const pairs = queryString.split('&');
            
            for (const pair of pairs) {
                const [key, value] = pair.split('=');
                if (key) {
                    // URL 解碼
                    const decodedKey = decodeURIComponent(key);
                    const decodedValue = decodeURIComponent(value || 'true');
                    params[decodedKey] = decodedValue;
                }
            }
            
            console.log('[URLParamParser] 解析的參數:', params);
        } catch (error) {
            console.error('[URLParamParser] 解析 URL 失敗:', error);
        }
        
        return params;
    }
    
    /**
     * 獲取單一參數值
     * @param key 參數名稱
     * @returns 參數值，如果不存在返回 null
     * 
     * @example
     * // URL: http://localhost:7456/?jsonPath=test_data
     * URLParamParser.getParam('jsonPath')  // 返回: 'test_data'
     * URLParamParser.getParam('notExist')  // 返回: null
     */
    public static getParam(key: string): string | null {
        const params = this.parseURL();
        return params[key] || null;
    }
    
    /**
     * 檢查參數是否存在且為 true
     * @param key 參數名稱
     * @returns 如果參數值為 'true' 或 '1' 返回 true
     * 
     * @example
     * // URL: http://localhost:7456/?localServer=true&debug=1
     * URLParamParser.isParamTrue('localServer')  // true
     * URLParamParser.isParamTrue('debug')        // true
     * URLParamParser.isParamTrue('notExist')     // false
     */
    public static isParamTrue(key: string): boolean {
        const value = this.getParam(key);
        return value === 'true' || value === '1';
    }
    
    /**
     * 檢查參數是否存在
     * @param key 參數名稱
     * @returns 參數是否存在
     */
    public static hasParam(key: string): boolean {
        const params = this.parseURL();
        return key in params;
    }
    
    /**
     * 獲取整數參數
     * @param key 參數名稱
     * @param defaultValue 預設值
     * @returns 整數值
     * 
     * @example
     * // URL: http://localhost:7456/?count=100
     * URLParamParser.getParamInt('count', 0)  // 100
     * URLParamParser.getParamInt('notExist', 50)  // 50
     */
    public static getParamInt(key: string, defaultValue: number = 0): number {
        const value = this.getParam(key);
        if (value === null) {
            return defaultValue;
        }
        
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    
    /**
     * 獲取浮點數參數
     * @param key 參數名稱
     * @param defaultValue 預設值
     * @returns 浮點數值
     */
    public static getParamFloat(key: string, defaultValue: number = 0.0): number {
        const value = this.getParam(key);
        if (value === null) {
            return defaultValue;
        }
        
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }
    
    /**
     * 獲取所有參數的字串表示（用於調試）
     * @returns 參數字串
     */
    public static toString(): string {
        const params = this.parseURL();
        return JSON.stringify(params, null, 2);
    }
}
