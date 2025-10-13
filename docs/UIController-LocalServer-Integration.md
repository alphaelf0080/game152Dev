# UIController 整合 LocalServerMode 指南

## 概述

由於這個專案沒有獨立的 `GameController.ts`，主要的遊戲控制器是 **UIController.ts**。

**位置**: `pss-on-00152/assets/script/LibCreator/libUIController/UIController.ts`

## 整合步驟

### 步驟 1: 在 UIController 中添加 LocalServerMode 引用

在 UIController.ts 開頭添加 import：

```typescript
// 在檔案開頭的 import 區域添加
import { LocalServerMode } from 'db://assets/script/LocalServer/LocalServerMode';
import { GameResult } from 'db://assets/script/LocalServer/LocalResultProvider';
```

在 UIController 類別中添加屬性：

```typescript
@ccclass('UIController')
export class UIController extends Component {
    
    // ... 現有屬性 ...
    
    // ========== LocalServerMode 整合 ==========
    
    /** 本地伺服器模式節點 */
    @property(Node)
    public localServerNode: Node = null;
    
    /** 本地伺服器模式組件 */
    private localServerMode: LocalServerMode = null;
    
    /** 是否使用本地伺服器 */
    private isUsingLocalServer: boolean = false;
    
    // ... 其他屬性 ...
}
```

### 步驟 2: 在 start() 或 onLoad() 中初始化

在 UIController 的初始化方法中添加：

```typescript
start() {
    // ... 現有的初始化代碼 ...
    
    // 初始化 LocalServerMode
    this.initializeLocalServerMode();
    
    // ... 其他初始化代碼 ...
}

/**
 * 初始化本地伺服器模式
 */
private initializeLocalServerMode(): void {
    // 查找 LocalServerMode 節點
    if (!this.localServerNode) {
        this.localServerNode = find('LocalServerMode');
    }
    
    if (this.localServerNode) {
        this.localServerMode = this.localServerNode.getComponent(LocalServerMode);
        
        if (this.localServerMode && this.localServerMode.isLocalMode()) {
            this.isUsingLocalServer = true;
            console.log('[UIController] 使用本地伺服器模式');
            
            // 監聽本地伺服器事件
            this.localServerNode.on('local-server-ready', this.onLocalServerReady, this);
            this.localServerNode.on('result-index-changed', this.onResultIndexChanged, this);
            
        } else {
            console.log('[UIController] 使用正常伺服器模式');
        }
    }
}

/**
 * 本地伺服器就緒回調
 */
private onLocalServerReady(data: any): void {
    console.log('[UIController] 本地伺服器已就緒:', data);
    // 可以在這裡顯示提示或更新 UI
}

/**
 * 結果索引變化回調
 */
private onResultIndexChanged(data: { index: number, total: number }): void {
    // 可以在調試 UI 中顯示進度
    console.log(`[UIController] 本地結果: ${data.index}/${data.total}`);
}
```

### 步驟 3: 修改 Spin 邏輯

找到 `SpinClick()` 方法（約在 line 1620），或者在 StateConsole 的 Spin 方法中整合。

#### 方案 A: 在 StateConsole.Spin() 中整合（推薦）

在 `StateConsole.ts` 中添加本地模式支援：

```typescript
// 在 StateConsole.ts
import { LocalServerMode } from 'db://assets/script/LocalServer/LocalServerMode';

export class StateConsole extends Component {
    
    // 添加屬性
    private localServerMode: LocalServerMode = null;
    
    onLoad() {
        // 查找 LocalServerMode
        const localServerNode = find('LocalServerMode');
        if (localServerNode) {
            this.localServerMode = localServerNode.getComponent(LocalServerMode);
        }
    }
    
    /**
     * Spin 方法 - 修改以支援本地模式
     */
    public Spin(param: boolean) {
        // 檢查是否使用本地模式
        if (this.localServerMode && this.localServerMode.isLocalMode()) {
            console.log('[StateConsole] 使用本地結果');
            this.handleLocalSpin();
            return;
        }
        
        // 原有的正常 Spin 邏輯
        // ... 現有代碼 ...
    }
    
    /**
     * 處理本地模式 Spin
     */
    private handleLocalSpin(): void {
        // 從本地獲取結果
        const result = this.localServerMode.getNextResult();
        
        if (!result) {
            console.warn('[StateConsole] 沒有更多本地結果');
            return;
        }
        
        console.log('[StateConsole] 使用本地結果:', result);
        
        // 將結果轉換為遊戲需要的格式
        this.applyLocalResult(result);
    }
    
    /**
     * 套用本地結果
     */
    private applyLocalResult(result: GameResult): void {
        // 設置滾輪停止位置
        // result.reels 包含每個滾輪的符號
        
        // 觸發滾輪旋轉（使用本地結果）
        this.CurState = Mode.FSM.K_SPINSTART;
        
        // 將結果傳遞給 ReelController
        // 這裡需要根據你的實際 ReelController API 調整
        // Data.Library.ReelController.setStopPositions(result.reels);
        
        // 繼續正常的遊戲流程
        // ...
    }
}
```

#### 方案 B: 在 UIController 中攔截（簡單但侵入性較大）

```typescript
// 在 UIController.ts 的 SpinClick() 方法中
public SpinClick() {
    // ... 現有的檢查邏輯 ...
    
    if (this.stateConsole.CurState == Mode.FSM.K_IDLE) {
        this._passFlag = false;
        
        // 播放音效
        if ((Data.Library as any)?.isNewAudio) {
            Data.Library.AudioController.playSfx('Spinclick');
            Data.Library.AudioController.playSfx('SpinLoop', true);
        }
        
        // ========== 本地模式整合 ==========
        if (this.isUsingLocalServer) {
            this.handleLocalSpin();
        } else {
            this.stateConsole.Spin(false);
        }
        // ==================================
        
    } else {
        // ... 現有的 stop 邏輯 ...
    }
}

/**
 * 處理本地模式 Spin
 */
private handleLocalSpin(): void {
    const result = this.localServerMode.getNextResult();
    
    if (!result) {
        console.warn('[UIController] 沒有更多本地結果');
        return;
    }
    
    console.log('[UIController] 本地結果:', result);
    
    // 將結果傳遞給 StateConsole
    // 需要在 StateConsole 中添加接收本地結果的方法
    (this.stateConsole as any).applyLocalResult(result);
}
```

### 步驟 4: 在場景中設置

1. **在編輯器中創建節點**:
   - 打開 `main.scene` 或 `load.scene`
   - 在根節點下創建 `LocalServerMode` 節點
   - 添加 `LocalServerMode` 組件
   - 設置 `defaultJsonPath` 屬性

2. **連接到 UIController**:
   - 選擇 `UIController` 節點
   - 將 `LocalServerMode` 節點拖入 `localServerNode` 屬性

### 步驟 5: 準備測試數據

```bash
cd gameServer
python main.py --simulate 100 --json --json-dir ../pss-on-00152/assets/resources/local_results
```

### 步驟 6: 測試

在瀏覽器中打開：
```
http://localhost:7456/?localServer=true
```

## 進階整合

### 顯示本地模式狀態

在 UI 中顯示當前是否使用本地模式：

```typescript
// 在 UIController 中添加
private updateLocalModeUI(): void {
    if (this.isUsingLocalServer) {
        // 顯示本地模式指示器
        const indicator = this.getNode('LocalModeIndicator');
        if (indicator) {
            indicator.active = true;
        }
        
        // 更新進度顯示
        if (this.localServerMode) {
            const info = this.localServerMode.getInfo();
            console.log(`本地模式: ${info.provider.currentIndex}/${info.provider.totalResults}`);
        }
    }
}
```

### 動態切換場景

添加按鈕來切換測試場景：

```typescript
/**
 * 切換測試場景（由 UI 按鈕調用）
 */
public switchTestScenario(event: any, scenarioName: string): void {
    if (this.localServerMode && this.localServerMode.isLocalMode()) {
        this.localServerMode.switchScenario(scenarioName)
            .then(() => {
                console.log(`切換到場景: ${scenarioName}`);
            })
            .catch((error) => {
                console.error('切換場景失敗:', error);
            });
    }
}
```

## 故障排除

### 問題 1: 找不到 LocalServerMode 節點

**檢查**:
- 節點名稱是否正確（區分大小寫）
- 節點是否在正確的場景中
- 使用 `find('LocalServerMode')` 時路徑是否正確

### 問題 2: 結果格式不匹配

**解決**:
- 檢查 `LocalResultProvider.ts` 中的 `convertToGameFormat()` 方法
- 確保轉換後的格式與遊戲期望的格式一致
- 可能需要調整欄位名稱或結構

### 問題 3: 滾輪不顯示正確結果

**檢查**:
- ReelController 的 API 是否正確調用
- 符號 ID 是否匹配
- 位置索引是否正確

## 相關檔案

- **UIController.ts**: 主遊戲控制器
- **StateConsole.ts**: 遊戲狀態機
- **ReelController.ts**: 滾輪控制
- **ProtoConsole.ts**: 伺服器通訊（需要跳過）
- **LocalServerMode.ts**: 本地伺服器核心

## 總結

整合流程：
1. ✅ 在 UIController 添加 LocalServerMode 引用
2. ✅ 初始化時檢測本地模式
3. ✅ 在 Spin 邏輯中添加本地模式分支
4. ✅ 將本地結果套用到遊戲流程
5. ✅ 在場景中設置節點
6. ✅ 測試並調試

**推薦方案**: 在 StateConsole.Spin() 中整合，這樣更符合遊戲架構，侵入性最小。
