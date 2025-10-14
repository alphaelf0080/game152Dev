# 初始盤面功能 - 快速測試指南

## 🚀 快速測試步驟

### 1️⃣ 啟動 Spin Server
```powershell
cd c:\projects\game152Dev\gameServer
python spin_server.py
```

**預期輸出**:
```
🎮 好運咚咚 Spin Server 啟動
📍 服務地址: http://localhost:8000
📡 API 端點:
   GET    /api/init     - 獲取初始盤面  ← 新增
   POST   /api/spin     - 執行遊戲旋轉
   GET    /api/health   - 健康檢查
   GET    /api/status   - 服務器狀態
```

### 2️⃣ 測試初始盤面 API
```powershell
# 測試 API 是否正常
curl http://localhost:8000/api/init
```

**預期回應**:
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
        ...
    }
}
```

### 3️⃣ 啟動遊戲 (LocalServer 模式)
```
http://localhost:7456/?localServer=true
```

### 4️⃣ 檢查瀏覽器 Console

**應該看到這些日誌** (按順序):
```
✅ [ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
✅ [StateConsole] 🌐 LocalServer 模式：檢查 Spin Server 連線
✅ [SpinServerClient] ✅ 伺服器健康
✅ [SpinServerClient] 📋 獲取初始盤面
✅ [SpinServerClient] ✅ 初始盤面獲取成功
✅ [StateConsole] 📋 收到初始盤面: {module_id: "BS", ...}
✅ [StateConsole] 🎮 設定初始盤面
✅ [StateConsole] ✅ 初始盤面設定完成
```

### 5️⃣ 檢查 Spin Server 日誌

**應該看到**:
```
💚 健康檢查 - Status: 200
📋 返回初始盤面資料 - session: xxx
```

## 🎮 初始盤面內容

**3x5 盤面配置**:
```
輪1   輪2   輪3   輪4   輪5
----  ----  ----  ----  ----
 H2    H1    M2    M1    L1   ← 上排
 H3    H2    M3    L2    M1   ← 中排
 H4    H3    H1    M2    L2   ← 下排
```

**符號索引**:
- 0 = L1 (低符號1)
- 1 = M1 (中符號1)
- 2 = L2 (低符號2)
- 3 = M2 (中符號2)
- 4 = M3 (中符號3)
- 5 = H1 (高符號1)
- 6 = H2 (高符號2)
- 7 = H3 (高符號3)
- 8 = H4 (高符號4)
- 9 = H4 (最高符號)

**RNG 陣列**: `[7, 8, 9, 5, 6, 7, 3, 4, 5, 1, 2, 3, 0, 1, 2]`

## ❌ 錯誤排查

### 問題 1: Spin Server 無法啟動
**檢查**:
```powershell
# 確認 Python 環境
python --version

# 確認依賴已安裝
pip list | findstr fastapi
```

### 問題 2: /api/init 返回 404
**檢查**:
```powershell
# 訪問 API 文檔
http://localhost:8000/docs
```
→ 應該看到 `/api/init` 端點

### 問題 3: 前端無日誌輸出
**檢查**:
- URL 是否包含 `?localServer=true`
- 瀏覽器 Console 是否有錯誤
- Spin Server 是否正在運行

### 問題 4: 初始盤面未顯示
**可能原因**:
1. ReelController 沒有 `SetInitBoard()` 方法
   - 會看到警告: "⚠️ ReelController 沒有 SetInitBoard 方法"
   - 資料會暫存到 `Data.Library.initialBoardData`

2. Reel 節點不存在
   - 會看到警告: "⚠️ 找不到 Reel 節點"

**解決方案**: 
- 檢查 ReelController 是否已實現 `SetInitBoard()` 方法
- 或在後續 Spin 時使用暫存的初始盤面資料

## 📊 完整測試流程

```
1. 啟動 Spin Server
   ↓
2. 測試 /api/init (curl)
   ↓
3. 啟動遊戲 (?localServer=true)
   ↓
4. 檢查 Console 日誌
   ↓
5. 確認初始盤面顯示
   ↓
6. 測試 Spin 功能
```

## 🔍 驗證清單

- [ ] Spin Server 正常啟動 (port 8000)
- [ ] `/api/init` 端點可訪問
- [ ] 返回正確 JSON 格式
- [ ] 遊戲使用 LocalServer 模式啟動
- [ ] Console 顯示正確日誌順序
- [ ] 初始盤面資料正確接收
- [ ] 盤面顯示正確 (如果 ReelController 支援)
- [ ] 可以進行 Spin 操作

## 💡 提示

### 查看完整 API 文檔
```
http://localhost:8000/docs
```

### 查看伺服器狀態
```powershell
curl http://localhost:8000/api/status
```

### 測試不同會話ID
```powershell
curl http://localhost:8000/api/init?session_id=test123
curl http://localhost:8000/api/init?session_id=test456
```

## 📚 相關文檔

| 文檔 | 內容 |
|------|------|
| `LocalServer-InitialBoard-Implementation.md` | 完整實施報告 |
| `LocalServer-SpinServer-Integration.md` | LocalServer 整合說明 |
| `Spin-Server-Guide.md` | Spin Server 詳細指南 |

---

**快速參考** | **版本**: 1.0 | **日期**: 2024-10-14
