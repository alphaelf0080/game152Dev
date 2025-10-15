# 專案重構策略文件

## 文件資訊
- **建立日期**: 2025-10-15
- **適用專案**: game169 (Slot Game)
- **狀態**: 進行中

---

## 一、核心重構原則

### 1.1 統一模組化策略

**原則**: 將重複的功能抽取到統一的模組中，避免代碼重複

#### 節點管理統一化
```typescript
// ✅ 正確做法：使用統一的 NodeCache
import { NodeCache } from './NodeCache';

const cache = NodeCache.getInstance();
const node = cache.getNode('Canvas/BaseGame/Layer/...');
```

```typescript
// ❌ 避免：在各處使用 find()
const node = find('Canvas/BaseGame/Layer/...');
```

#### 資源載入統一化
```typescript
// ✅ 正確做法：使用統一的 ResourceLoader
import { ResourceLoader } from './ResourceLoader';

const loader = new ResourceLoader();
await loader.loadBundle('bundleName');
const assets = await loader.loadDir(path, type);
```

```typescript
// ❌ 避免：直接使用 assetManager
assetManager.loadBundle('bundleName', (err, bundle) => {
    bundle.loadDir(path, type, (err, assets) => {
        // 回調地獄...
    });
});
```

---

## 二、待重構檔案清單

### 2.1 高優先級（立即重構）

| 檔案 | 問題 | 重構目標 | 預估時間 |
|------|------|----------|----------|
| **SpreadController.ts** | 可能有重複的 find() | 整合到 NodeCache | 1-2 小時 |
| **UIController.ts** | 可能有資源載入邏輯 | 整合到 ResourceLoader | 2-3 小時 |
| **Symbol.ts** | 節點查找和資源管理 | 使用統一模組 | 2-3 小時 |
| **LoadingScene.ts** | 資源載入邏輯 | 整合到 ResourceLoader | 3-4 小時 |

### 2.2 中優先級（近期重構）

| 檔案 | 問題 | 重構目標 | 預估時間 |
|------|------|----------|----------|
| **DataController.ts** | 可能有節點快取 | 統一使用 NodeCache | 2-3 小時 |
| **ReelController/** | Reel 相關節點管理 | 使用 NodeCache | 4-5 小時 |
| **Animation/** | 動畫資源載入 | 使用 ResourceLoader | 3-4 小時 |

### 2.3 低優先級（長期重構）

| 檔案 | 問題 | 重構目標 | 預估時間 |
|------|------|----------|----------|
| 所有其他 UI 組件 | 散落的 find() | 逐步遷移到 NodeCache | 持續 |
| 所有資源載入 | 不統一的載入方式 | 逐步遷移到 ResourceLoader | 持續 |

---

## 三、重構模式指南

### 3.1 NodeCache 整合模式

#### 模式 A：類內部使用 NodeCache

**適用場景**: 需要多次查找節點的類

```typescript
import { _decorator, Component } from 'cc';
import { NodeCache } from './UIController/NodeCache';

const { ccclass } = _decorator;

@ccclass('ExampleController')
export class ExampleController extends Component {
    private nodeCache: NodeCache | null = null;
    
    onLoad() {
        // 獲取 NodeCache 實例
        this.nodeCache = NodeCache.getInstance();
        
        // 預載入常用節點
        this.nodeCache.preloadNodes([
            'Canvas/UI/Button1',
            'Canvas/UI/Button2',
            'Canvas/UI/Panel'
        ]);
    }
    
    private getButton1(): Node | null {
        return this.nodeCache?.getNode('Canvas/UI/Button1') || null;
    }
    
    onDestroy() {
        // 不需要清除快取，由 LangBunder 統一管理
        this.nodeCache = null;
    }
}
```

#### 模式 B：單次查找優化

**適用場景**: 只需要查找一次的節點

```typescript
import { NodeCache } from './UIController/NodeCache';

// 單次查找
const cache = NodeCache.getInstance();
const node = cache.getNode('Canvas/UI/Button');

if (node) {
    // 使用節點...
}
```

#### 模式 C：配置驅動查找

**適用場景**: 需要查找大量節點

```typescript
// 在配置檔案中定義
export const UI_NODE_PATHS = [
    'Canvas/UI/Button1',
    'Canvas/UI/Button2',
    'Canvas/UI/Panel1',
    // ...
];

// 在類中使用
import { NodeCache } from './UIController/NodeCache';
import { UI_NODE_PATHS } from './ui-config';

const cache = NodeCache.getInstance();
cache.preloadNodes(UI_NODE_PATHS);

// 之後直接使用快取查找
const button1 = cache.getNode('Canvas/UI/Button1');
```

### 3.2 ResourceLoader 整合模式

#### 模式 A：簡單資源載入

```typescript
import { ResourceLoader } from './UIController/ResourceLoader';
import { SpriteFrame } from 'cc';

async loadUIResources(): Promise<void> {
    const loader = new ResourceLoader();
    
    try {
        // 載入 bundle
        await loader.loadBundle('ui');
        
        // 載入目錄
        const sprites = await loader.loadDir<SpriteFrame>(
            'textures/buttons',
            SpriteFrame
        );
        
        // 使用資源...
        
    } catch (error) {
        console.error('載入失敗:', error);
    }
}
```

#### 模式 B：帶進度的資源載入

```typescript
async loadWithProgress(): Promise<void> {
    const loader = new ResourceLoader();
    await loader.loadBundle('resources');
    
    const assets = await loader.loadDir(
        'prefabs',
        Prefab,
        (finished, total) => {
            const progress = (finished / total) * 100;
            console.log(`載入進度: ${progress}%`);
            this.updateProgressBar(progress);
        }
    );
}
```

#### 模式 C：資源管理器封裝

```typescript
// 創建專用的資源管理器
class UIResourceManager {
    private loader: ResourceLoader;
    private resources: Map<string, Asset> = new Map();
    
    constructor() {
        this.loader = new ResourceLoader();
    }
    
    async initialize(): Promise<void> {
        await this.loader.loadBundle('ui');
        const sprites = await this.loader.loadDir('sprites', SpriteFrame);
        
        sprites.forEach(sprite => {
            this.resources.set(sprite.name, sprite);
        });
    }
    
    getSprite(name: string): SpriteFrame | undefined {
        return this.resources.get(name) as SpriteFrame;
    }
    
    release(): void {
        this.resources.clear();
        this.loader.releaseAll();
    }
}
```

---

## 四、重構檢查清單

### 4.1 重構前檢查

- [ ] 確認檔案功能和依賴關係
- [ ] 找出所有 `find()` 調用
- [ ] 找出所有 `assetManager` 調用
- [ ] 找出所有 `bundle.loadDir()` 調用
- [ ] 記錄當前的效能指標

### 4.2 重構中檢查

- [ ] 所有 `find()` 替換為 `NodeCache.getNode()`
- [ ] 所有回調式載入替換為 `async/await`
- [ ] 新增適當的錯誤處理
- [ ] 新增適當的型別定義
- [ ] 保持向後兼容性

### 4.3 重構後檢查

- [ ] 通過 TypeScript 編譯
- [ ] 功能測試通過
- [ ] 效能測試（對比重構前）
- [ ] 記憶體使用測試
- [ ] 更新相關文件

---

## 五、重構範例

### 5.1 範例：重構前

```typescript
// 重構前：混亂的節點查找和資源載入
export class OldController extends Component {
    start() {
        // 重複的 find() 調用
        const button1 = find('Canvas/UI/Button1');
        const button2 = find('Canvas/UI/Button2');
        
        // 回調地獄
        assetManager.loadBundle('ui', (err, bundle) => {
            bundle.loadDir('sprites', SpriteFrame, (err, sprites) => {
                sprites.forEach(sprite => {
                    // 處理...
                });
            });
        });
        
        // 再次查找相同節點（效能浪費）
        const button1Again = find('Canvas/UI/Button1');
    }
}
```

### 5.2 範例：重構後

```typescript
// 重構後：統一使用 NodeCache 和 ResourceLoader
import { NodeCache } from './UIController/NodeCache';
import { ResourceLoader } from './UIController/ResourceLoader';

export class NewController extends Component {
    private nodeCache: NodeCache | null = null;
    private resourceLoader: ResourceLoader | null = null;
    
    async start() {
        await this.initialize();
    }
    
    private async initialize(): Promise<void> {
        // 初始化管理器
        this.nodeCache = NodeCache.getInstance();
        this.resourceLoader = new ResourceLoader();
        
        // 預載入節點
        this.nodeCache.preloadNodes([
            'Canvas/UI/Button1',
            'Canvas/UI/Button2'
        ]);
        
        // 載入資源
        await this.loadResources();
        
        // 使用快取的節點
        const button1 = this.nodeCache.getNode('Canvas/UI/Button1');
        const button2 = this.nodeCache.getNode('Canvas/UI/Button2');
    }
    
    private async loadResources(): Promise<void> {
        try {
            await this.resourceLoader!.loadBundle('ui');
            const sprites = await this.resourceLoader!.loadDir<SpriteFrame>(
                'sprites',
                SpriteFrame,
                (finished, total) => {
                    console.log(`載入進度: ${finished}/${total}`);
                }
            );
            
            // 處理資源...
            
        } catch (error) {
            console.error('資源載入失敗:', error);
            // 錯誤處理...
        }
    }
    
    onDestroy() {
        this.resourceLoader?.releaseAll();
        this.nodeCache = null;
        this.resourceLoader = null;
    }
}
```

---

## 六、效能目標

### 6.1 重構效能目標

| 指標 | 目標 | 測量方法 |
|------|------|----------|
| 節點查找時間 | 減少 90%+ | 使用 NodeCache 統計 |
| 資源載入時間 | 減少 60%+ | 對比重構前後 |
| 記憶體使用 | 減少 20%+ | Chrome DevTools |
| 程式碼行數 | 減少 30%+ | 移除重複代碼 |
| 圈複雜度 | < 15 | ESLint 分析 |

### 6.2 程式碼品質目標

- **可讀性**: 使用有意義的變數名稱和註釋
- **可維護性**: 模組化設計，職責單一
- **可測試性**: 易於單元測試
- **型別安全**: 完整的 TypeScript 型別
- **錯誤處理**: 完善的 try-catch

---

## 七、重構時程規劃

### 7.1 第一階段（已完成）✅

**時間**: 2025-10-15  
**內容**: LangBunder.ts 重構
- ✅ 創建 NodeCache 模組
- ✅ 創建 ResourceLoader 模組
- ✅ 創建 LanguageResourceManager
- ✅ 重構 LangBunder.ts

### 7.2 第二階段（待執行）

**時間**: 待定  
**內容**: 核心控制器重構
- [ ] SpreadController.ts
- [ ] UIController.ts
- [ ] Symbol.ts
- [ ] LoadingScene.ts

### 7.3 第三階段（待執行）

**時間**: 待定  
**內容**: 遊戲邏輯重構
- [ ] ReelController 相關
- [ ] Animation 相關
- [ ] DataController

### 7.4 第四階段（持續）

**時間**: 持續進行  
**內容**: 全面優化
- [ ] 所有 UI 組件
- [ ] 所有資源載入
- [ ] 效能監控和優化

---

## 八、注意事項

### 8.1 重構原則

⚠️ **向後兼容**: 重構時必須保持向後兼容性  
⚠️ **逐步進行**: 不要一次性重構太多檔案  
⚠️ **充分測試**: 每次重構後都要進行完整測試  
⚠️ **文件更新**: 及時更新相關文件  
⚠️ **效能監控**: 持續監控效能指標  

### 8.2 禁止事項

❌ **不要**: 在重構時新增功能  
❌ **不要**: 跳過測試階段  
❌ **不要**: 忽略錯誤處理  
❌ **不要**: 破壞現有功能  
❌ **不要**: 過度設計  

### 8.3 最佳實踐

✅ **每次只重構一個檔案或模組**  
✅ **保留舊代碼作為註釋（暫時）**  
✅ **使用 Git 提交每個重構步驟**  
✅ **編寫測試覆蓋重構的代碼**  
✅ **記錄效能變化**  

---

## 九、重構模板

### 9.1 檔案重構模板

```typescript
// [FileName].ts - 重構版本

/* 
 * 重構歷史:
 * - 日期: 2025-XX-XX
 * - 改動: 
 *   1. 替換 find() 為 NodeCache
 *   2. 替換回調式載入為 ResourceLoader
 *   3. 新增錯誤處理
 * - 效能: 載入時間減少 XX%
 */

import { _decorator, Component } from 'cc';
import { NodeCache } from './UIController/NodeCache';
import { ResourceLoader } from './UIController/ResourceLoader';

const { ccclass, property } = _decorator;

@ccclass('ClassName')
export class ClassName extends Component {
    // 使用統一的管理器
    private nodeCache: NodeCache | null = null;
    private resourceLoader: ResourceLoader | null = null;
    
    async start() {
        await this.initialize();
    }
    
    private async initialize(): Promise<void> {
        this.nodeCache = NodeCache.getInstance();
        this.resourceLoader = new ResourceLoader();
        
        // 預載入節點
        // 載入資源
        // 初始化邏輯
    }
    
    onDestroy() {
        // 清理資源
        this.resourceLoader?.releaseAll();
        this.nodeCache = null;
        this.resourceLoader = null;
    }
}

/* ============================================================
 * 舊版代碼（保留作為參考）
 * ============================================================
 * 
 * // 舊版 find() 調用
 * const node = find('Canvas/...');
 * 
 * // 舊版資源載入
 * assetManager.loadBundle('name', (err, bundle) => {
 *     // ...
 * });
 * 
 * ============================================================
 */
```

---

## 十、總結

本重構策略的核心目標：

1. **統一節點管理**: 所有節點查找使用 NodeCache
2. **統一資源載入**: 所有資源載入使用 ResourceLoader
3. **提升效能**: 減少重複操作，提升載入速度
4. **提升品質**: 更好的程式碼結構和可維護性
5. **保持兼容**: 不破壞現有功能

**重構原則**: 逐步進行，充分測試，持續優化

---

**文件版本**: 1.0  
**最後更新**: 2025-10-15  
**狀態**: 🔄 進行中（第一階段已完成）
