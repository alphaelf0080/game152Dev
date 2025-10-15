/**
 * 環形緩衝區
 * 用於高效處理滾輪符號數據，避免頻繁的陣列重分配
 */
export class CircularBuffer<T> {
    private buffer: T[];
    private head: number = 0;
    private readonly size: number;

    constructor(size: number, defaultValue?: T) {
        this.size = size;
        this.buffer = new Array(size);
        
        if (defaultValue !== undefined) {
            this.buffer.fill(defaultValue);
        }
    }

    /**
     * 在緩衝區開頭插入元素（替代 unshift）
     */
    unshift(item: T): void {
        this.head = (this.head - 1 + this.size) % this.size;
        this.buffer[this.head] = item;
    }

    /**
     * 移除並返回緩衝區末尾元素（替代 pop）
     */
    pop(): T {
        const index = (this.head + this.size - 1) % this.size;
        return this.buffer[index];
    }

    /**
     * 從緩衝區開頭移除元素（替代 shift）
     */
    shift(): T {
        const item = this.buffer[this.head];
        this.head = (this.head + 1) % this.size;
        return item;
    }

    /**
     * 獲取指定索引的元素
     */
    get(index: number): T {
        if (index < 0 || index >= this.size) {
            throw new Error(`Index ${index} out of bounds [0, ${this.size})`);
        }
        return this.buffer[(this.head + index) % this.size];
    }

    /**
     * 設置指定索引的元素
     */
    set(index: number, value: T): void {
        if (index < 0 || index >= this.size) {
            throw new Error(`Index ${index} out of bounds [0, ${this.size})`);
        }
        this.buffer[(this.head + index) % this.size] = value;
    }

    /**
     * 獲取緩衝區大小
     */
    getSize(): number {
        return this.size;
    }

    /**
     * 轉換為普通陣列
     */
    toArray(): T[] {
        const result: T[] = [];
        for (let i = 0; i < this.size; i++) {
            result.push(this.get(i));
        }
        return result;
    }

    /**
     * 重置緩衝區
     */
    reset(defaultValue?: T): void {
        this.head = 0;
        if (defaultValue !== undefined) {
            this.buffer.fill(defaultValue);
        }
    }
}
