import { assetManager, Asset, AssetManager, SpriteFrame, sp, LabelAtlas } from 'cc';

/**
 * Promise-based 資源載入器
 * 將 Cocos Creator 的回調式 API 轉換為 Promise 模式
 */
export class ResourceLoader {
    private bundle: AssetManager.Bundle | null = null;
    private bundleName: string = '';
    
    /**
     * 載入資源包
     * @param bundleName 資源包名稱
     */
    async loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        if (this.bundle && this.bundleName === bundleName) {
            return this.bundle;
        }
        
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    reject(new Error(`[ResourceLoader] 載入 Bundle 失敗: ${bundleName} - ${err.message}`));
                    return;
                }
                this.bundle = bundle;
                this.bundleName = bundleName;
                console.log(`[ResourceLoader] ✓ Bundle 載入成功: ${bundleName}`);
                resolve(bundle);
            });
        });
    }
    
    /**
     * 載入目錄中的所有資源
     * @param path 目錄路徑
     * @param type 資源類型
     * @param onProgress 進度回調
     */
    async loadDir<T extends Asset>(
        path: string,
        type: typeof Asset,
        onProgress?: (finished: number, total: number) => void
    ): Promise<T[]> {
        if (!this.bundle) {
            throw new Error('[ResourceLoader] Bundle 尚未載入，請先調用 loadBundle()');
        }
        
        return new Promise((resolve, reject) => {
            this.bundle!.loadDir(
                path,
                type,
                (finished, total) => {
                    if (onProgress) {
                        onProgress(finished, total);
                    }
                },
                (err, assets) => {
                    if (err) {
                        reject(new Error(`[ResourceLoader] 載入目錄失敗: ${path} - ${err.message}`));
                        return;
                    }
                    console.log(`[ResourceLoader] ✓ 載入目錄成功: ${path} (${assets.length} 個資源)`);
                    resolve(assets as T[]);
                }
            );
        });
    }
    
    /**
     * 載入單個資源
     * @param path 資源路徑
     * @param type 資源類型
     */
    async load<T extends Asset>(
        path: string,
        type: typeof Asset
    ): Promise<T> {
        if (!this.bundle) {
            throw new Error('[ResourceLoader] Bundle 尚未載入');
        }
        
        return new Promise((resolve, reject) => {
            this.bundle!.load(path, type, (err, asset) => {
                if (err) {
                    reject(new Error(`[ResourceLoader] 載入資源失敗: ${path} - ${err.message}`));
                    return;
                }
                resolve(asset as T);
            });
        });
    }
    
    /**
     * 釋放指定路徑的資源
     * @param path 資源路徑
     */
    release(path: string): void {
        if (this.bundle) {
            this.bundle.release(path);
            console.log(`[ResourceLoader] 釋放資源: ${path}`);
        }
    }
    
    /**
     * 釋放所有資源
     */
    releaseAll(): void {
        if (this.bundle) {
            this.bundle.releaseAll();
            console.log(`[ResourceLoader] 釋放所有資源: ${this.bundleName}`);
            this.bundle = null;
            this.bundleName = '';
        }
    }
    
    /**
     * 獲取當前 Bundle
     */
    getBundle(): AssetManager.Bundle | null {
        return this.bundle;
    }
}
