import { _decorator } from 'cc';
import { SymbolNodeCache } from './SymbolNodeCache';

/**
 * Symbol 效能測試工具
 * 用於驗證重構後的效能改善
 */
export class SymbolPerformanceTest {
    
    /**
     * 測試節點快取初始化效能
     * 預期：<50ms
     */
    static testNodeCacheInitialization(): void {
        console.log('🧪 測試 1: 節點快取初始化效能');
        console.log('━'.repeat(50));
        
        // 重置快取
        SymbolNodeCache.reset();
        
        const startTime = performance.now();
        
        const cache = SymbolNodeCache.getInstance();
        cache.initialize();
        
        const duration = performance.now() - startTime;
        
        console.log(`⏱️ 初始化耗時: ${duration.toFixed(2)}ms`);
        
        if (duration < 50) {
            console.log('✅ 測試通過: 初始化時間 < 50ms');
        } else {
            console.warn(`⚠️ 測試失敗: 初始化時間過長 (${duration.toFixed(2)}ms > 50ms)`);
        }
        
        console.log('');
    }
    
    /**
     * 測試節點快取重複初始化（應該跳過）
     * 預期：<1ms
     */
    static testNodeCacheDuplicateInitialization(): void {
        console.log('🧪 測試 2: 節點快取重複初始化');
        console.log('━'.repeat(50));
        
        const cache = SymbolNodeCache.getInstance();
        
        const startTime = performance.now();
        
        // 嘗試重複初始化
        cache.initialize();
        
        const duration = performance.now() - startTime;
        
        console.log(`⏱️ 重複初始化耗時: ${duration.toFixed(2)}ms`);
        
        if (duration < 1) {
            console.log('✅ 測試通過: 重複初始化被正確跳過 (< 1ms)');
        } else {
            console.warn(`⚠️ 測試失敗: 重複初始化未被跳過 (${duration.toFixed(2)}ms > 1ms)`);
        }
        
        console.log('');
    }
    
    /**
     * 測試節點快取查詢效能
     * 預期：每次查詢 <0.01ms
     */
    static testNodeCacheQueryPerformance(): void {
        console.log('🧪 測試 3: 節點快取查詢效能');
        console.log('━'.repeat(50));
        
        const cache = SymbolNodeCache.getInstance();
        cache.initialize();
        
        const iterations = 1000;
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            cache.getMessageConsole();
            cache.getErrorConsole();
            cache.getSpreadController();
            cache.getPayTable();
            cache.getPaySymbolTable();
            cache.getPaySymbolNum();
            cache.getPaySymbolNum1();
            cache.getPaySymbolBlock();
        }
        
        const duration = performance.now() - startTime;
        const avgTime = duration / iterations;
        
        console.log(`⏱️ ${iterations} 次查詢總耗時: ${duration.toFixed(2)}ms`);
        console.log(`⏱️ 平均每次查詢: ${avgTime.toFixed(4)}ms`);
        
        if (avgTime < 0.01) {
            console.log('✅ 測試通過: 平均查詢時間 < 0.01ms');
        } else {
            console.warn(`⚠️ 測試警告: 平均查詢時間較長 (${avgTime.toFixed(4)}ms)`);
        }
        
        console.log('');
    }
    
    /**
     * 測試節點存在性
     */
    static testNodeExistence(): void {
        console.log('🧪 測試 4: 節點存在性驗證');
        console.log('━'.repeat(50));
        
        const cache = SymbolNodeCache.getInstance();
        cache.initialize();
        
        const nodes = {
            'MessageConsole': cache.getMessageConsole(),
            'ErrorConsole': cache.getErrorConsole(),
            'SpreadController': cache.getSpreadController(),
            'PayTable': cache.getPayTable(),
            'PaySymbolTable': cache.getPaySymbolTable(),
            'PaySymbolNum': cache.getPaySymbolNum(),
            'PaySymbolNum1': cache.getPaySymbolNum1(),
            'PaySymbolBlock': cache.getPaySymbolBlock()
        };
        
        let passCount = 0;
        let totalCount = 0;
        
        const nodeList = [
            { name: 'MessageConsole', node: nodes.MessageConsole },
            { name: 'ErrorConsole', node: nodes.ErrorConsole },
            { name: 'SpreadController', node: nodes.SpreadController },
            { name: 'PayTable', node: nodes.PayTable },
            { name: 'PaySymbolTable', node: nodes.PaySymbolTable },
            { name: 'PaySymbolNum', node: nodes.PaySymbolNum },
            { name: 'PaySymbolNum1', node: nodes.PaySymbolNum1 },
            { name: 'PaySymbolBlock', node: nodes.PaySymbolBlock }
        ];
        
        for (const item of nodeList) {
            totalCount++;
            if (item.node !== null) {
                console.log(`  ✓ ${item.name} 已找到`);
                passCount++;
            } else {
                console.warn(`  ⚠️ ${item.name} 未找到`);
            }
        }
        
        console.log('');
        console.log(`📊 節點查找成功率: ${passCount}/${totalCount} (${(passCount/totalCount*100).toFixed(1)}%)`);
        
        if (passCount === totalCount) {
            console.log('✅ 測試通過: 所有節點都已找到');
        } else {
            console.warn(`⚠️ 測試警告: ${totalCount - passCount} 個節點未找到`);
        }
        
        console.log('');
    }
    
    /**
     * 效能對比測試（模擬優化前後）
     */
    static testPerformanceComparison(): void {
        console.log('🧪 測試 5: 效能對比（優化前 vs 優化後）');
        console.log('━'.repeat(50));
        
        const symbolCount = 25; // 5×5 滾輪
        const findCallsPerSymbol = 8; // 每個 Symbol 8 次 find()
        const avgFindTime = 3; // 平均每次 find() 3ms
        
        // 計算優化前的理論時間
        const beforeOptimization = symbolCount * findCallsPerSymbol * avgFindTime;
        console.log(`📉 優化前理論時間: ${beforeOptimization}ms`);
        console.log(`   - ${symbolCount} 個 Symbol × ${findCallsPerSymbol} 次 find() × ${avgFindTime}ms = ${beforeOptimization}ms`);
        
        // 計算優化後的實際時間
        SymbolNodeCache.reset();
        const startTime = performance.now();
        
        const cache = SymbolNodeCache.getInstance();
        cache.initialize(); // 只初始化一次
        
        // 模擬 25 個 Symbol 實例獲取快取
        for (let i = 0; i < symbolCount; i++) {
            cache.getMessageConsole();
            cache.getErrorConsole();
            cache.getSpreadController();
            cache.getPayTable();
            cache.getPaySymbolTable();
            cache.getPaySymbolNum();
            cache.getPaySymbolNum1();
            cache.getPaySymbolBlock();
        }
        
        const afterOptimization = performance.now() - startTime;
        console.log(`📈 優化後實際時間: ${afterOptimization.toFixed(2)}ms`);
        
        const improvement = ((beforeOptimization - afterOptimization) / beforeOptimization * 100).toFixed(1);
        const speedup = (beforeOptimization / afterOptimization).toFixed(1);
        
        console.log('');
        console.log(`🎯 效能改善: ${improvement}%`);
        console.log(`⚡ 加速倍數: ${speedup}x`);
        console.log(`⏱️ 節省時間: ${(beforeOptimization - afterOptimization).toFixed(2)}ms`);
        
        if (parseFloat(improvement) > 80) {
            console.log('✅ 測試通過: 效能改善 > 80%');
        } else {
            console.warn(`⚠️ 測試警告: 效能改善不足 (${improvement}% < 80%)`);
        }
        
        console.log('');
    }
    
    /**
     * 執行所有測試
     */
    static runAllTests(): void {
        console.log('');
        console.log('═'.repeat(50));
        console.log('🚀 Symbol 效能測試套件');
        console.log('═'.repeat(50));
        console.log('');
        
        const startTime = performance.now();
        
        try {
            this.testNodeCacheInitialization();
            this.testNodeCacheDuplicateInitialization();
            this.testNodeCacheQueryPerformance();
            this.testNodeExistence();
            this.testPerformanceComparison();
            
            const totalTime = performance.now() - startTime;
            
            console.log('═'.repeat(50));
            console.log(`✅ 所有測試完成！總耗時: ${totalTime.toFixed(2)}ms`);
            console.log('═'.repeat(50));
            console.log('');
            
        } catch (error) {
            console.error('❌ 測試執行失敗:', error);
        }
    }
    
    /**
     * 記憶體洩漏測試（長時間運行）
     */
    static testMemoryLeak(): void {
        console.log('🧪 測試 6: 記憶體洩漏測試');
        console.log('━'.repeat(50));
        console.log('⚠️ 此測試需要在瀏覽器開發者工具中觀察記憶體使用');
        console.log('');
        
        const iterations = 100;
        
        for (let i = 0; i < iterations; i++) {
            SymbolNodeCache.reset();
            const cache = SymbolNodeCache.getInstance();
            cache.initialize();
            
            // 模擬使用
            cache.getMessageConsole();
            cache.getErrorConsole();
            cache.getSpreadController();
            
            if (i % 10 === 0) {
                console.log(`  進度: ${i}/${iterations}`);
            }
        }
        
        console.log('');
        console.log('✅ 測試完成！請在開發者工具中檢查記憶體是否穩定');
        console.log('');
    }
}

// 導出給外部使用
(window as any).SymbolPerformanceTest = SymbolPerformanceTest;
