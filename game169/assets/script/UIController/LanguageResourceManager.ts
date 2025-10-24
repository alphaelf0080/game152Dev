import { Asset, SpriteFrame, sp, LabelAtlas } from 'cc';
import { ResourceLoader } from './ResourceLoader';
import { RESOURCE_LOAD_CONFIG, ResourceLoadConfig, groupResourcesByPriority } from './language-config';

/**
 * 語言資源管理器
 * 統一管理語言資源的載入、存儲和釋放
 * 支援並行載入和優先級管理
 */
export class LanguageResourceManager {
    private resources: Map<string, Asset> = new Map();
    private loading: Set<string> = new Set();
    private loader: ResourceLoader;
    private currentLanguage: string = '';
    
    constructor() {
        this.loader = new ResourceLoader();
    }
    
    /**
     * 載入 language bundle
     */
    async loadBundle(): Promise<void> {
        await this.loader.loadBundle('language');
    }
    
    /**
     * 按優先級載入所有語言資源
     * @param language 語言代碼
     * @param onProgress 進度回調
     */
    async loadByPriority(
        language: string,
        onProgress?: (progress: number, total: number) => void
    ): Promise<void> {
        this.currentLanguage = language;
        const grouped = groupResourcesByPriority();
        const priorities = Array.from(grouped.keys()).sort((a, b) => a - b);
        
        let totalCompleted = 0;
        const totalResources = RESOURCE_LOAD_CONFIG.length;
        
        console.log(`[LanguageResourceManager] 開始載入語言資源: ${language}`);
        console.log(`[LanguageResourceManager] 共 ${totalResources} 個資源，分 ${priorities.length} 個優先級`);
        
        // 按優先級依次載入（同優先級並行）
        for (const priority of priorities) {
            const configs = grouped.get(priority)!;
            console.log(`[LanguageResourceManager] 載入優先級 ${priority}: ${configs.length} 個資源`);
            
            // 並行載入同優先級的資源
            const loadTasks = configs.map(config => 
                this.loadResource(language, config)
                    .then(() => {
                        totalCompleted++;
                        if (onProgress) {
                            onProgress(totalCompleted, totalResources);
                        }
                    })
            );
            
            await Promise.all(loadTasks);
            console.log(`[LanguageResourceManager] ✓ 優先級 ${priority} 載入完成`);
        }
        
        console.log(`[LanguageResourceManager] ✓ 所有語言資源載入完成: ${this.resources.size} 個資源`);
    }
    
    /**
     * 載入單個資源配置
     */
    private async loadResource(language: string, config: ResourceLoadConfig): Promise<void> {
        const fullPath = `${language}${config.path}`;
        const cacheKey = config.key;
        
        // 避免重複載入
        if (this.loading.has(cacheKey)) {
            return;
        }
        
        this.loading.add(cacheKey);
        
        try {
            const assets = await this.loader.loadDir(fullPath, config.type);
            
            // 存儲資源到 Map
            assets.forEach(asset => {
                const resourceKey = `${cacheKey}_${asset.name}`;
                this.resources.set(resourceKey, asset);
            });
            
            console.log(`[LanguageResourceManager] ✓ ${cacheKey}: ${assets.length} 個資源`);
            
        } catch (error) {
            console.error(`[LanguageResourceManager] ✗ 載入失敗: ${cacheKey}`, error);
            throw error;
        } finally {
            this.loading.delete(cacheKey);
        }
    }
    
    /**
     * 獲取資源
     * @param key 資源鍵名（格式：resourceKey_assetName）
     */
    getResource(key: string): Asset | undefined {
        return this.resources.get(key);
    }
    
    /**
     * 獲取 SpriteFrame 資源
     */
    getSpriteFrame(key: string): SpriteFrame | undefined {
        const resource = this.getResource(key);
        return resource instanceof SpriteFrame ? resource : undefined;
    }
    
    /**
     * 獲取 SkeletonData 資源
     */
    getSkeletonData(key: string): sp.SkeletonData | undefined {
        const resource = this.getResource(key);
        return resource instanceof sp.SkeletonData ? resource : undefined;
    }
    
    /**
     * 獲取 LabelAtlas 資源
     */
    getLabelAtlas(key: string): LabelAtlas | undefined {
        const resource = this.getResource(key);
        return resource instanceof LabelAtlas ? resource : undefined;
    }
    
    /**
     * 檢查資源是否已載入
     */
    hasResource(key: string): boolean {
        return this.resources.has(key);
    }
    
    /**
     * 檢查資源是否正在載入
     */
    isLoading(key: string): boolean {
        return this.loading.has(key);
    }
    
    /**
     * 釋放特定語言的資源
     */
    releaseLanguageResources(language: string): void {
        console.log(`[LanguageResourceManager] 釋放語言資源: ${language}`);
        
        // 清除資源 Map
        this.resources.clear();
        
        // 釋放 Bundle 中的資源（可選，取決於是否需要完全釋放）
        // this.loader.releaseAll();
    }
    
    /**
     * 釋放所有資源
     */
    releaseAll(): void {
        console.log('[LanguageResourceManager] 釋放所有資源');
        this.resources.clear();
        this.loading.clear();
        this.loader.releaseAll();
    }
    
    /**
     * 獲取所有已載入的資源鍵名列表
     */
    getAllResourceKeys(): string[] {
        return Array.from(this.resources.keys());
    }
    
    /**
     * 獲取資源統計
     */
    getStats(): { totalResources: number; loadingResources: number; currentLanguage: string } {
        return {
            totalResources: this.resources.size,
            loadingResources: this.loading.size,
            currentLanguage: this.currentLanguage
        };
    }
    
    /**
     * 打印資源統計
     */
    printStats(): void {
        const stats = this.getStats();
        console.log('[LanguageResourceManager] 資源統計:');
        console.log(`  當前語言: ${stats.currentLanguage}`);
        console.log(`  已載入資源: ${stats.totalResources}`);
        console.log(`  載入中資源: ${stats.loadingResources}`);
    }
}
