# UIController LocalServerMode 整合完成報告

## ✅ 整合完成

**日期**: 2025-10-13  
**檔案**: `pss-on-00152/assets/script/LibCreator/libUIController/UIController.ts`  
**備份**: `UIController.ts.backup`

## 📝 修改摘要

### 1. Import 添加 (Line 25-26)

```typescript
import { LocalServerMode } from 'db://assets/script/LocalServer/LocalServerMode';
import { GameResult } from 'db://assets/script/LocalServer/LocalResultProvider';
```

### 2. 類別屬性添加 (Line 241-252)

```typescript
// =================================
// 🎮 LocalServerMode 整合
// =================================

/** 本地伺服器模式節點 */
@property({ type: Node, tooltip: '本地伺服器模式節點（用於離線測試）' })
public localServerNode: Node = null;

/** 本地伺服器模式組件 */
private localServerMode: LocalServerMode | null = null;

/** 是否使用本地伺服器 */
private isUsingLocalServer: boolean = false;
```

### 3. 初始化方法添加 (Line 405-467)

在 `start()` 方法末尾調用：
```typescript
// 初始化 LocalServerMode
this.initializeLocalServerMode();
```

新增方法：
- `initializeLocalServerMode()` - 初始化本地伺服器模式
- `onLocalServerReady()` - 本地伺服器就緒回調
- `onResultIndexChanged()` - 結果索引變化回調
- `onResultsCycled()` - 結果循環回調

### 4. Spin 邏輯修改 (Line 1706-1720)

在 `ClickSpin()` 方法中添加本地模式檢查：

```typescript
// ========== LocalServerMode 整合 ==========
if (this.isUsingLocalServer) {
    console.log('[UIController] 🎲 使用本地結果進行 Spin');
    this.handleLocalSpin();
} else {
    this.stateConsole.Spin(false);
}
// =========================================
```

### 5. 本地模式處理方法 (Line 1905-2018)

新增方法：
- `handleLocalSpin()` - 處理本地模式 Spin
- `switchTestScenario()` - 切換測試場景
- `getLocalServerInfo()` - 獲取本地模式狀態
- `toggleLocalMode()` - 手動切換本地模式

## 🎮 使用方式

### 步驟 1: 產生測試數據

```bash
cd gameServer
python main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/local_results
```

### 步驟 2: 在編輯器中設置

1. 打開 `main.scene` 或 `load.scene`
2. 在根節點下創建新節點，命名為 `LocalServerMode`
3. 添加 `LocalServerMode` 組件
4. 設置 `defaultJsonPath` 為 `local_results/batch_results_xxx`
5. 在 UIController 節點上：
   - 將 `LocalServerMode` 節點拖入 `localServerNode` 屬性

### 步驟 3: 啟動測試

在瀏覽器中打開：
```
http://localhost:7456/?localServer=true
```

### 步驟 4: 驗證

打開瀏覽器 Console (F12)，應該看到：

```
[LocalServerMode] LocalServerMode 正在初始化...
[LocalServerMode] URL 參數檢測到本地伺服器模式
[LocalServerMode] 準備載入 JSON: local_results/batch_results_xxx
[LocalServerMode] JSON 載入成功: 100 筆結果
[UIController] 🎮 使用本地伺服器模式
[UIController] 📦 本地結果數: 100
[UIController] ✅ 本地伺服器已就緒
```

點擊 Spin 按鈕時：
```
[UIController] 🎲 使用本地結果進行 Spin
[UIController] 📦 獲取本地結果:
  - 滾輪: [[1,2,3], [4,5,6], ...]
  - 贏分: 150
  - 倍率: 1
  - 贏線數: 2
```

## 🔧 進階功能

### 切換測試場景

在 Console 中執行：
```javascript
// 獲取 UIController
const ui = cc.find('Canvas').getComponent('UIController');

// 切換到大獎場景
ui.switchTestScenario('big_win');

// 切換到免費旋轉場景
ui.switchTestScenario('free_spins');
```

### 查看本地模式狀態

```javascript
const ui = cc.find('Canvas').getComponent('UIController');
console.log(ui.getLocalServerInfo());
```

輸出：
```json
{
  "isEnabled": true,
  "enableMode": true,
  "isInitialized": true,
  "isReady": true,
  "provider": {
    "isLoaded": true,
    "currentPath": "local_results/batch_100_spins",
    "totalResults": 100,
    "currentIndex": 25,
    "hasMore": true
  }
}
```

### 手動切換模式

```javascript
const ui = cc.find('Canvas').getComponent('UIController');

// 啟用本地模式
ui.toggleLocalMode(true);

// 停用本地模式
ui.toggleLocalMode(false);
```

## 📊 整合方案

### 當前實作方案

UIController 檢測本地模式並調用 `handleLocalSpin()`，該方法嘗試三種方式與 StateConsole 整合：

1. **方案 1**: `applyLocalResult(result)` - StateConsole 有專門方法
2. **方案 2**: `setLocalResult(result)` + `Spin()` - 暫存結果後調用正常流程
3. **方案 3**: 直接調用 `Spin()` - StateConsole 自動檢測本地模式

### 建議下一步

需要在 **StateConsole.ts** 中實作其中一種方案。推薦方案 3（最小侵入性）：

```typescript
// 在 StateConsole.ts 中
public Spin(param: boolean) {
    // 檢查是否有本地模式
    const localServerNode = find('LocalServerMode');
    if (localServerNode) {
        const localMode = localServerNode.getComponent('LocalServerMode');
        if (localMode && localMode.isLocalMode()) {
            // 從本地模式獲取結果
            const result = localMode.getNextResult();
            if (result) {
                this.applyResult(result);
                return;
            }
        }
    }
    
    // 正常的伺服器請求邏輯
    // ...
}
```

## 🐛 故障排除

### 問題 1: 找不到 LocalServerMode 節點

**檢查**:
- 節點名稱必須完全是 `LocalServerMode`（區分大小寫）
- 節點在場景根層級（不是在 Canvas 下）
- UIController 的 `localServerNode` 屬性已連接

### 問題 2: 沒有載入 JSON

**檢查**:
- URL 參數正確: `?localServer=true`
- JSON 檔案在 `assets/resources/local_results/` 目錄下
- 路徑設置正確（不含 `resources/` 和 `.json`）
- Cocos Creator 中已刷新資源

### 問題 3: Spin 沒有使用本地結果

**檢查**:
- Console 是否顯示 "使用本地伺服器模式"
- `isUsingLocalServer` 是否為 true
- StateConsole 是否有處理本地結果的邏輯

### 問題 4: 編譯錯誤

當前的編譯錯誤（AudioController 相關）是原本就存在的，與本次整合無關。

## 📁 修改的檔案

```
pss-on-00152/assets/script/LibCreator/libUIController/
├── UIController.ts          (已修改，+160 行)
└── UIController.ts.backup   (原始備份)
```

## ✨ 新增功能總結

| 功能 | 方法 | 說明 |
|------|------|------|
| 初始化 | `initializeLocalServerMode()` | 自動檢測 URL 參數並初始化 |
| Spin 處理 | `handleLocalSpin()` | 從本地獲取結果並處理 |
| 場景切換 | `switchTestScenario()` | 動態切換測試場景 |
| 狀態查詢 | `getLocalServerInfo()` | 獲取本地模式詳細資訊 |
| 模式切換 | `toggleLocalMode()` | 手動啟用/停用本地模式 |
| 事件回調 | `onLocalServerReady()` 等 | 監聽本地模式事件 |

## 🎯 下一步行動

1. ✅ **完成** - UIController 整合
2. ⏳ **進行中** - 在編輯器中設置 LocalServerMode 節點
3. ⏳ **待辦** - StateConsole 整合（建議方案 3）
4. ⏳ **待辦** - 測試完整流程
5. ⏳ **待辦** - 添加 UI 指示器顯示本地模式狀態

## 📚 相關文檔

- [LocalServer-Mode-Guide.md](../../../docs/LocalServer-Mode-Guide.md) - 完整使用指南
- [UIController-LocalServer-Integration.md](../../../docs/UIController-LocalServer-Integration.md) - 詳細整合說明
- [LocalServer/README.md](../../LocalServer/README.md) - 模組文檔
- [LocalServer/QUICK_REFERENCE.md](../../LocalServer/QUICK_REFERENCE.md) - 快速參考

## 🎉 完成狀態

✅ Import 添加  
✅ 類別屬性添加  
✅ 初始化邏輯  
✅ Spin 邏輯修改  
✅ 本地模式處理方法  
✅ 事件監聽  
✅ 調試方法  
✅ 備份原始檔案  

**整合成功！可以開始測試了。**
