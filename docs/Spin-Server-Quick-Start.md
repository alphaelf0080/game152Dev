# Spin Server - 快速開始指南

## 🚀 快速啟動（3 步驟）

### 1️⃣ 確認安裝依賴

```bash
cd gameServer
pip install fastapi uvicorn requests
```

### 2️⃣ 啟動伺服器

```bash
python spin_server.py
```

看到以下訊息表示成功：
```
============================================================
🎮 好運咚咚 Spin Server
============================================================
🎮 初始化遊戲引擎...
✅ 遊戲引擎初始化成功！
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 3️⃣ 測試 API

**選項 A: 使用測試腳本**
```bash
python test_spin_server.py
```

**選項 B: 使用瀏覽器測試頁面**
```
開啟 test_spin_client.html
```

**選項 C: 使用 curl**
```bash
curl -X POST http://localhost:8000/api/spin ^
  -H "Content-Type: application/json" ^
  -d "{\"bet\": 50, \"spin_type\": \"normal\"}"
```

---

## 📋 API 端點

### POST /api/spin - 執行遊戲旋轉

**請求:**
```json
{
  "bet": 50,
  "spin_type": "normal"
}
```

**回應:**
```json
{
  "success": true,
  "data": {
    "module_id": "BS",
    "credit": 0,
    "rng": [17, 54, 70, 48, 22, 26, 14, 11, ...],
    "win": 173,
    "winLineGrp": [...],
    "multiplierAlone": 1,
    "mulitplierPattern": [1, 1, 1, ...],
    "next_module": "BS",
    "winBonusGrp": [],
    "jp_count": 0,
    "jp": 0
  },
  "timestamp": "2025-10-14T10:30:00"
}
```

### GET /api/health - 健康檢查

```bash
curl http://localhost:8000/api/health
```

### GET /api/status - 伺服器狀態

```bash
curl http://localhost:8000/api/status
```

---

## 🎯 前端整合範例

```typescript
// 執行 Spin
async function executeSpin(bet: number): Promise<any> {
    const response = await fetch('http://localhost:8000/api/spin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bet: bet,
            spin_type: 'normal'
        })
    });

    const result = await response.json();
    
    if (result.success && result.data) {
        return result.data;
    } else {
        throw new Error(result.error);
    }
}

// 使用
try {
    const gameResult = await executeSpin(50);
    console.log('Win:', gameResult.win);
    console.log('RNG:', gameResult.rng);
} catch (error) {
    console.error('Spin failed:', error);
}
```

---

## 📊 測試結果範例

```
============================================================
  🧪 Spin Server API 測試
============================================================

============================================================
  1. 測試健康檢查
============================================================
狀態碼: 200
回應: {
  "status": "ok",
  "timestamp": "2025-10-14T10:30:00.123456",
  "version": "1.0.0"
}
✅ 健康檢查通過

============================================================
  3. 測試正常 Spin
============================================================
請求資料: {
  "bet": 50,
  "spin_type": "normal"
}

狀態碼: 200

回應:
  Success: True
  Timestamp: 2025-10-14T10:30:00.123456

遊戲結果:
  Module ID: BS
  Win: 173
  Multiplier: 1
  RNG: [17, 54, 70, 48, 22, 26, 14, 11, ...]

✅ 正常 Spin 測試通過
```

---

## 🔧 常見問題

### Q: 端口被佔用怎麼辦？

**A:** 更換端口號
```bash
# 編輯 spin_server.py，修改 main() 函數中的 port 參數
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Q: CORS 錯誤？

**A:** 伺服器已設定允許所有來源，如需限制：
```python
# 在 spin_server.py 中修改
allow_origins=["http://localhost:7456"]
```

### Q: 如何查看詳細日誌？

**A:** 使用 debug 模式啟動
```bash
uvicorn spin_server:app --reload --log-level debug
```

---

## 📁 相關檔案

- `spin_server.py` - 主伺服器程式
- `test_spin_server.py` - Python 測試腳本
- `test_spin_client.html` - 網頁測試介面
- `docs/Spin-Server-Guide.md` - 完整文檔

---

## ✅ 完成檢查清單

- [ ] 已安裝 fastapi, uvicorn, requests
- [ ] 伺服器成功啟動
- [ ] 健康檢查通過
- [ ] Spin API 正常運作
- [ ] 前端可以正確接收資料

---

**快速參考:** `docs/Spin-Server-Guide.md`  
**建立日期:** 2025-10-14  
**版本:** 1.0.0
