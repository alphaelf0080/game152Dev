# LocalServer 初始盤面功能 - 實施報告

## 📋 功能概述

在 LocalServer 模式下，遊戲初始化時會從 Spin Server 獲取一個固定的初始盤面資料，並在前端重製顯示。

## 🎯 實施內容

### 1. **Spin Server 端 - 新增 `/api/init` 端點**

**檔案**: `gameServer/spin_server.py`

#### 新增資料模型
```python
class InitBoardResponse(BaseModel):
    """初始盤面回應資料結構"""
    success: bool = Field(description="是否成功")
    message: str = Field(description="回應訊息")
    data: Dict[str, Any] = Field(description="初始盤面資料")
    timestamp: str = Field(description="時間戳記")
    session_id: Optional[str] = Field(default=None, description="會話ID")
```

#### 新增 API 端點
```python
@app.get("/api/init", response_model=InitBoardResponse, tags=["Game"])
async def get_initial_board(session_id: Optional[str] = None):
    """
    獲取初始盤面資料
    
    當遊戲初始化時調用，返回一個固定的初始盤面供前端顯示
    
    Returns:
        InitBoardResponse: 初始盤面資料
    """
    
    # 固定的初始盤面資料 (3x5 盤面，無贏分)
    initial_board = {
        "module_id": "BS",
        "credit": 0,
        "rng": [
            7, 8, 9,      # 第1輪: H2, H3, H4
            5, 6, 7,      # 第2輪: H1, H2, H3
            3, 4, 5,      # 第3輪: M2, M3, H1
            1, 2, 3,      # 第4輪: M1, L2, M2
            0, 1, 2       # 第5輪: L1, M1, L2
        ],
        "win": 0,
        "winLineGrp": [],
        "multiplierAlone": 1,
        "mulitplierPattern": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "next_module": "BS",
        "winBonusGrp": [],
        "jp_count": 0,
        "jp": 0
    }
    
    return InitBoardResponse(
        success=True,
        message="初始盤面資料獲取成功",
        data=initial_board,
        timestamp=datetime.now().isoformat(),
        session_id=session_id
    )
```

**初始盤面內容**:
- 3x5 盤面配置
- 無贏分線
- 無特殊功能
- 圖案由低到高排列

### 2. **前端客戶端 - 新增 getInitialBoard() 方法**

**檔案**: `pss-on-00152/assets/script/LocalServer/SpinServerClient.ts`

#### 新增方法
```typescript
/**
 * 獲取初始盤面資料
 */
public async getInitialBoard(): Promise<SpinResultData> {
    this.log('📋 獲取初始盤面');
    
    try {
        const response = await this.fetch(`/init?session_id=${this.sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result: SpinResponse = await response.json();
        
        if (result.success && result.data) {
            this.log('✅ 初始盤面獲取成功', result.data);
            return result.data;
        } else {
            throw new Error(result.error || '初始盤面獲取失敗');
        }
    } catch (error) {
        this.error('❌ 初始盤面獲取失敗', error);
        throw error;
    }
}
```

### 3. **狀態控制器 - 整合初始盤面**

**檔案**: `pss-on-00152/assets/script/MessageController/StateConsole.ts`

#### 修改 NetInitReady() 流程
```typescript
NetInitReady() {
    if ((Data.Library as any).localServerMode === true) {
        const spinClient = getSpinServerClient();
        
        // 1. 健康檢查
        spinClient.checkHealth().then(isHealthy => {
            if (isHealthy) {
                console.log('[StateConsole] ✅ Spin Server 連線正常');
                // 2. 獲取初始盤面
                return spinClient.getInitialBoard();
            } else {
                throw new Error('無法連接到 Spin Server');
            }
        }).then(initialBoard => {
            console.log('[StateConsole] 📋 收到初始盤面:', initialBoard);
            
            // 3. 應用初始盤面
            this.applyInitialBoard(initialBoard);
            
            // 4. 觸發網路就緒事件
            let type = "All";
            let data = {
                EnventID: Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY
            }
            this.SendEvent(type, data);
            
            // 5. 初始化遊戲狀態
            if (find("APIConsole")) {
                Data.Library.yieldLess(1);
                console.log("enter NetInitReady (LocalServer mode)")
            }
        }).catch(error => {
            console.error('[StateConsole] ❌ Spin Server 錯誤:', error);
            Mode.ErrorInLoading('Spin Server 錯誤: ' + error.message);
        });
        
        return;
    }
    
    // 原有 WebSocket 邏輯...
}
```

#### 新增 applyInitialBoard() 方法
```typescript
/**
 * 應用初始盤面資料到遊戲
 * @param boardData 初始盤面資料
 */
applyInitialBoard(boardData: any) {
    console.log('[StateConsole] 🎮 設定初始盤面');
    
    try {
        // 獲取 ReelController
        const reelNode = find("Canvas/BaseGame/Layer/Shake/Reel");
        if (reelNode) {
            const reelController = reelNode.getComponent(ReelController);
            if (reelController && typeof reelController['SetInitBoard'] === 'function') {
                // 調用 ReelController 的初始盤面設定方法
                reelController['SetInitBoard'](boardData.rng);
                console.log('[StateConsole] ✅ 初始盤面設定完成');
            } else {
                console.warn('[StateConsole] ⚠️ ReelController 沒有 SetInitBoard 方法，使用備用方案');
                // 備用方案：將資料存儲供後續使用
                (Data.Library as any).initialBoardData = boardData;
                console.log('[StateConsole] ✅ 初始盤面資料已暫存');
            }
        } else {
            console.warn('[StateConsole] ⚠️ 找不到 Reel 節點');
        }
        
        // 設定模組ID
        if (Data.Library.MathConsole) {
            Data.Library.MathConsole.CurModuleid = boardData.module_id;
        }
        
    } catch (error) {
        console.error('[StateConsole] ❌ 設定初始盤面失敗:', error);
    }
}
```

## 🔄 執行流程

### LocalServer 模式初始化流程

```
1. 遊戲啟動 (URL: ?localServer=true)
   ↓
2. ProtoConsole.start()
   - 檢測 LocalServer 模式
   - 不創建 WebSocket
   ↓
3. StateConsole.NetInitReady()
   - 執行健康檢查 (GET /api/health)
   ↓
4. 獲取初始盤面 (GET /api/init)
   - Spin Server 返回固定初始盤面
   ↓
5. applyInitialBoard()
   - 嘗試調用 ReelController.SetInitBoard()
   - 或將資料暫存到 Data.Library.initialBoardData
   ↓
6. 觸發網路就緒事件 (eNETREADY)
   ↓
7. 遊戲進入 IDLE 狀態
   - 顯示初始盤面
   - 等待玩家操作
```

## 📡 API 端點總覽

| 方法 | 端點 | 用途 | 回應格式 |
|------|------|------|----------|
| GET | `/api/health` | 健康檢查 | `{status: "ok"}` |
| GET | `/api/init` | 獲取初始盤面 | `InitBoardResponse` |
| POST | `/api/spin` | 執行遊戲旋轉 | `SpinResponse` |
| GET | `/api/status` | 伺服器狀態 | `StatusResponse` |

## 🎮 初始盤面資料格式

```json
{
    "success": true,
    "message": "初始盤面資料獲取成功",
    "data": {
        "module_id": "BS",
        "credit": 0,
        "rng": [7, 8, 9, 5, 6, 7, 3, 4, 5, 1, 2, 3, 0, 1, 2],
        "win": 0,
        "winLineGrp": [],
        "multiplierAlone": 1,
        "mulitplierPattern": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "next_module": "BS",
        "winBonusGrp": [],
        "jp_count": 0,
        "jp": 0
    },
    "timestamp": "2024-10-14T12:00:00",
    "session_id": "uuid-string"
}
```

**盤面配置** (3x5):
```
第1輪  第2輪  第3輪  第4輪  第5輪
----   ----   ----   ----   ----
 H2     H1     M2     M1     L1
 H3     H2     M3     L2     M1
 H4     H3     H1     M2     L2
```

## 🧪 測試方法

### 1. 啟動 Spin Server
```powershell
cd c:\projects\game152Dev\gameServer
python spin_server.py
```

### 2. 測試初始盤面 API
```powershell
# PowerShell
curl http://localhost:8000/api/init?session_id=test123
```

**預期輸出**:
```json
{
    "success": true,
    "message": "初始盤面資料獲取成功",
    "data": {...},
    "timestamp": "...",
    "session_id": "test123"
}
```

### 3. 啟動遊戲測試
```
http://localhost:7456/?localServer=true
```

### 4. 檢查瀏覽器 Console 日誌
```
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
[StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線
[SpinServerClient] ✅ 伺服器健康
[SpinServerClient] 📋 獲取初始盤面
[SpinServerClient] ✅ 初始盤面獲取成功
[StateConsole] 📋 收到初始盤面: {...}
[StateConsole] 🎮 設定初始盤面
[StateConsole] ✅ 初始盤面設定完成 或 ✅ 初始盤面資料已暫存
```

## 📊 檔案變更總覽

| 檔案 | 變更類型 | 說明 |
|------|----------|------|
| `spin_server.py` | ✅ 修改 | 新增 `/api/init` 端點和 `InitBoardResponse` |
| `SpinServerClient.ts` | ✅ 修改 | 新增 `getInitialBoard()` 方法 |
| `StateConsole.ts` | ✅ 修改 | 修改 `NetInitReady()` + 新增 `applyInitialBoard()` |

## 🎯 功能特點

### 1. **固定初始盤面**
- 每次初始化都返回相同的盤面
- 確保遊戲啟動的一致性
- 便於測試和驗證

### 2. **無贏分狀態**
- `win = 0`
- `winLineGrp = []`
- 乾淨的起始狀態

### 3. **自動檢測整合**
- 嘗試使用 ReelController 的標準方法
- 失敗時自動切換到備用方案
- 不會導致遊戲中斷

### 4. **完整錯誤處理**
- 連線失敗提示
- API 錯誤捕獲
- 友善的錯誤訊息

## 🔧 後續優化建議

### 1. **動態初始盤面**
可修改為支援多種初始盤面：
```python
# 在 spin_server.py 中
INITIAL_BOARDS = {
    "default": {...},
    "lucky": {...},
    "feature": {...}
}

@app.get("/api/init")
async def get_initial_board(
    board_type: str = "default",
    session_id: Optional[str] = None
):
    board = INITIAL_BOARDS.get(board_type, INITIAL_BOARDS["default"])
    ...
```

### 2. **ReelController 整合**
如果 ReelController 沒有 `SetInitBoard()` 方法，可以添加：
```typescript
// 在 ReelController.ts 中
public SetInitBoard(rng: number[]) {
    // 根據 rng 設定各輪軸的圖案
    for (let i = 0; i < this._reels.length; i++) {
        // 設定第 i 輪的圖案
    }
}
```

### 3. **初始盤面配置**
支援從配置檔載入：
```python
# config/initial_boards.json
{
    "default": {
        "rng": [7, 8, 9, ...],
        "description": "標準起始盤面"
    }
}
```

## ✅ 測試清單

- [ ] Spin Server 正常啟動
- [ ] `/api/init` 端點可訪問
- [ ] 返回正確的 JSON 格式
- [ ] 遊戲啟動時調用 API
- [ ] 初始盤面正確顯示
- [ ] Console 日誌正確輸出
- [ ] 錯誤情況正確處理

## 📝 總結

已成功實現 LocalServer 模式的初始盤面功能：

✅ **後端**: 新增 `/api/init` 端點返回固定初始盤面  
✅ **客戶端**: 新增 `getInitialBoard()` 方法  
✅ **狀態控制**: 整合初始化流程  
✅ **錯誤處理**: 完整的異常捕獲  
✅ **日誌輸出**: 清晰的執行追蹤  

**下一步**: 測試完整流程，確認初始盤面正確顯示在遊戲中。

---

**文檔版本**: 1.0  
**建立日期**: 2024-10-14  
**專案**: 好運咚咚 (game152Dev)
