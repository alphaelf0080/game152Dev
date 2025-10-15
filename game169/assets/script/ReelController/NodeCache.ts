import { _decorator, Node, find, Component, AudioSource } from 'cc';

const { ccclass } = _decorator;

/**
 * 節點快取管理器
 * 用於快取常用節點，避免重複的 find() 查找操作
 */
@ccclass('NodeCache')
export class NodeCache {
    private static instance: NodeCache;
    private nodeCache = new Map<string, Node>();
    private componentCache = new Map<string, Component>();

    static getInstance(): NodeCache {
        if (!this.instance) {
            this.instance = new NodeCache();
        }
        return this.instance;
    }

    /**
     * 預載入關鍵節點
     * 在遊戲啟動時呼叫，減少運行時的查找開銷
     */
    preloadCriticalNodes(allNodeMap: Map<string, Node>): void {
        const criticalPaths = [
            "reelSlow",
            "ScreenSlowmote",
            "reelBlack",
            "SlowMotion",
            "OsSlowMotion",
            "MessageController"
        ];

        criticalPaths.forEach(path => {
            const node = allNodeMap.get(path);
            if (node) {
                this.nodeCache.set(path, node);
            }
        });

        // 預快取音效節點
        for (let i = 1; i <= 6; i++) {
            const path = `AudioController/ReelStop/${i}`;
            const node = find(path);
            if (node) {
                const audioSource = node.getComponent(AudioSource);
                if (audioSource) {
                    this.componentCache.set(`reelStop_${i}`, audioSource);
                }
            }
        }
    }

    /**
     * 獲取快取的節點
     */
    getNode(key: string, allNodeMap?: Map<string, Node>): Node | null {
        if (!this.nodeCache.has(key)) {
            const node = allNodeMap?.get(key) || find(key);
            if (node) {
                this.nodeCache.set(key, node);
            }
        }
        return this.nodeCache.get(key) || null;
    }

    /**
     * 獲取滾輪停止音效
     */
    getReelStopAudio(reelIndex: number): AudioSource | null {
        const key = `reelStop_${reelIndex}`;
        return this.componentCache.get(key) as AudioSource || null;
    }

    /**
     * 快取組件
     */
    cacheComponent<T extends Component>(key: string, component: T): void {
        this.componentCache.set(key, component);
    }

    /**
     * 獲取快取的組件
     */
    getComponent<T extends Component>(key: string): T | null {
        return this.componentCache.get(key) as T || null;
    }

    /**
     * 清除快取
     */
    clear(): void {
        this.nodeCache.clear();
        this.componentCache.clear();
    }
}
