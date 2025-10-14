# Spin Server - 快速參考卡 🎯

## ⚡ 一分鐘啟動

```bash
# 啟動伺服器
cd gameServer
python spin_server.py
```

伺服器地址: **http://localhost:8000**

---

## 📡 API 速查

### POST /api/spin
```bash
curl -X POST http://localhost:8000/api/spin \
  -H "Content-Type: application/json" \
  -d '{"bet": 50, "spin_type": "normal"}'
```

### GET /api/health
```bash
curl http://localhost:8000/api/health
```

### GET /api/status
```bash
curl http://localhost:8000/api/status
```

---

## 🎮 Spin 類型

| 類型 | 值 | 說明 |
|------|------|------|
| 正常旋轉 | `"normal"` | 一般遊戲 |
| 特色購買 60x | `"feature_60x"` | 60 倍下注購買 |
| 特色購買 80x | `"feature_80x"` | 80 倍下注購買 |
| 特色購買 100x | `"feature_100x"` | 100 倍下注購買 |

---

## 📝 請求範例

```json
{
  "bet": 50,
  "spin_type": "normal",
  "player_id": "player123",
  "session_id": "session456"
}
```

---

## 📊 回應範例

```json
{
  "success": true,
  "data": {
    "module_id": "BS",
    "credit": 0,
    "rng": [17, 54, 70, 48, 22, ...],
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

---

## 💻 前端整合

```typescript
// 執行 Spin
async function spin(bet: number) {
    const res = await fetch('http://localhost:8000/api/spin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({bet, spin_type: 'normal'})
    });
    const result = await res.json();
    return result.data;
}
```

---

## 🧪 測試方法

### Python 測試
```bash
python test_spin_server.py
```

### HTML 測試
```
開啟 test_spin_client.html
```

### curl 測試
```bash
curl -X POST http://localhost:8000/api/spin \
  -H "Content-Type: application/json" \
  -d '{"bet": 50, "spin_type": "normal"}'
```

---

## 🔧 常見問題

### Q: 端口被佔用？
**A:** 修改 `spin_server.py` 中的端口號
```python
uvicorn.run(app, port=8001)  # 改為 8001
```

### Q: CORS 錯誤？
**A:** 伺服器已設定允許所有來源，檢查前端 URL 是否正確

### Q: 無法連線？
**A:** 確認伺服器已啟動，防火牆未阻擋

---

## 📁 檔案位置

```
gameServer/
├── spin_server.py              # 主程式
├── start_spin_server.py        # 啟動腳本
├── test_spin_server.py         # 測試腳本
├── test_spin_client.html       # 測試頁面
└── README_SPIN_SERVER.md       # README
```

---

## 📖 詳細文檔

- **README**: `gameServer/README_SPIN_SERVER.md`
- **快速開始**: `docs/Spin-Server-Quick-Start.md`
- **完整指南**: `docs/Spin-Server-Guide.md`
- **實現總結**: `docs/Spin-Server-Summary.md`

---

## ✅ 檢查清單

- [ ] FastAPI, uvicorn 已安裝
- [ ] 伺服器成功啟動
- [ ] http://localhost:8000 可訪問
- [ ] POST /api/spin 正常運作
- [ ] 前端能接收資料

---

**版本**: 1.0.0  
**更新**: 2025-10-14  
**快速支援**: 查看 `docs/Spin-Server-Guide.md`
