/**
 * 滾輪更新管理器
 * 優化 update 循環，減少不必要的更新操作
 */
export class ReelUpdateManager {
    private dirtyReels: Set<number> = new Set();
    private isSpinning: boolean = false;
    private turboEnabled: boolean = false;

    /**
     * 標記滾輪需要更新
     */
    markReelDirty(index: number): void {
        this.dirtyReels.add(index);
    }

    /**
     * 標記所有滾輪需要更新
     */
    markAllReelsDirty(reelCount: number): void {
        for (let i = 0; i < reelCount; i++) {
            this.dirtyReels.add(i);
        }
    }

    /**
     * 清除指定滾輪的更新標記
     */
    clearReelDirty(index: number): void {
        this.dirtyReels.delete(index);
    }

    /**
     * 清除所有滾輪的更新標記
     */
    clearAllDirty(): void {
        this.dirtyReels.clear();
    }

    /**
     * 檢查滾輪是否需要更新
     */
    isReelDirty(index: number): boolean {
        return this.dirtyReels.has(index);
    }

    /**
     * 獲取需要更新的滾輪數量
     */
    getDirtyReelCount(): number {
        return this.dirtyReels.size;
    }

    /**
     * 設置旋轉狀態
     */
    setSpinning(spinning: boolean): void {
        this.isSpinning = spinning;
    }

    /**
     * 獲取旋轉狀態
     */
    isCurrentlySpinning(): boolean {
        return this.isSpinning;
    }

    /**
     * 設置 Turbo 模式
     */
    setTurboEnabled(enabled: boolean): void {
        this.turboEnabled = enabled;
    }

    /**
     * 獲取 Turbo 狀態
     */
    isTurboEnabled(): boolean {
        return this.turboEnabled;
    }

    /**
     * 檢查是否需要更新
     */
    shouldUpdate(): boolean {
        return this.isSpinning && this.dirtyReels.size > 0;
    }

    /**
     * 獲取所有需要更新的滾輪索引
     */
    getDirtyReels(): number[] {
        return Array.from(this.dirtyReels);
    }

    /**
     * 重置管理器
     */
    reset(): void {
        this.dirtyReels.clear();
        this.isSpinning = false;
        this.turboEnabled = false;
    }
}
