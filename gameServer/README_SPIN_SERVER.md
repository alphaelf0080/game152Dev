# Spin Server - README

## 🎮 好運咚咚遊戲後端伺服器

一個基於 FastAPI 的後端伺服器，接收前端 spin 請求並回傳遊戲結果。

---

## ⚡ 快速開始

```bash
# 1. 安裝依賴
pip install fastapi uvicorn requests

# 2. 啟動伺服器
python spin_server.py

# 3. 測試 API
python test_spin_server.py
```

伺服器啟動後訪問: http://localhost:8000

---

## 📡 API 端點

### POST /api/spin
執行遊戲旋轉

```bash
curl -X POST http://localhost:8000/api/spin \
  -H "Content-Type: application/json" \
  -d '{"bet": 50, "spin_type": "normal"}'
```

**回應範例:**
```json
{
  "success": true,
  "data": {
    "module_id": "BS",
    "win": 173,
    "rng": [17, 54, 70, ...],
    "winLineGrp": [...],
    "multiplierAlone": 1,
    ...
  }
}
```

### GET /api/health
健康檢查

### GET /api/status
伺服器狀態

---

## 🧪 測試工具

### 1. Python 測試腳本
```bash
python test_spin_server.py
```

### 2. HTML 網頁測試介面
```
開啟 test_spin_client.html
```

---

## 💻 前端整合

```typescript
async function executeSpin(bet: number) {
    const response = await fetch('http://localhost:8000/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bet: bet,
            spin_type: 'normal'
        })
    });

    const result = await response.json();
    
    if (result.success && result.data) {
        return result.data;
    }
}
```

---

## 📖 完整文檔

- **快速開始:** `docs/Spin-Server-Quick-Start.md`
- **完整指南:** `docs/Spin-Server-Guide.md`
- **實現總結:** `docs/Spin-Server-Summary.md`

---

## 📁 檔案說明

| 檔案 | 說明 |
|------|------|
| `spin_server.py` | 主伺服器程式 |
| `start_spin_server.py` | 快速啟動腳本 |
| `test_spin_server.py` | Python 測試腳本 |
| `test_spin_client.html` | 網頁測試介面 |

---

## ✅ 功能特點

- ✅ RESTful API 設計
- ✅ CORS 跨域支援
- ✅ 即時生成遊戲結果
- ✅ 簡化資料格式（與 game_results.json 一致）
- ✅ 完整的錯誤處理
- ✅ 統計資訊記錄
- ✅ 健康檢查端點

---

## 🛠️ 技術棧

- FastAPI - Web 框架
- Uvicorn - ASGI 伺服器
- Pydantic - 資料驗證
- GameEngine - 遊戲邏輯
- SimpleDataExporter - 格式轉換

---

**版本:** 1.0.0  
**建立日期:** 2025-10-14  
**狀態:** ✅ 完成並測試
