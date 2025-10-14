# Spin Server - 遊戲後端伺服器使用指南

## 📋 目錄

- [概述](#概述)
- [功能特點](#功能特點)
- [快速開始](#快速開始)
- [API 文檔](#api-文檔)
- [測試方法](#測試方法)
- [前端整合](#前端整合)
- [故障排除](#故障排除)

---

## 概述

Spin Server 是一個基於 FastAPI 的後端伺服器，用於處理遊戲前端的 spin 請求並回傳遊戲結果資料。

### 主要功能
- ✅ 接收前端 spin 請求
- ✅ 執行遊戲邏輯（使用 GameEngine）
- ✅ 回傳簡化的遊戲結果格式（與 `game_results.json` 一致）
- ✅ 支援正常旋轉和特色購買
- ✅ CORS 跨域支援
- ✅ RESTful API 設計

---

## 功能特點

### 1. RESTful API
- **POST /api/spin** - 執行遊戲旋轉
- **GET /api/health** - 健康檢查
- **GET /api/status** - 伺服器狀態

### 2. 資料格式
回傳格式與 `SimpleDataExporter` 一致：
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
  "timestamp": "2025-10-14T10:30:00",
  "session_id": "session123"
}
```

### 3. CORS 支援
自動處理跨域請求，允許前端直接呼叫 API。

---

## 快速開始

### 前置需求
確保已安裝所需套件：
```bash
cd gameServer
pip install fastapi uvicorn requests
```

### 啟動伺服器

**方法 1: 直接執行**
```bash
python spin_server.py
```

**方法 2: 使用 uvicorn（生產環境）**
```bash
uvicorn spin_server:app --host 0.0.0.0 --port 8000 --reload
```

### 啟動成功畫面
```
============================================================
🎮 好運咚咚 Spin Server
============================================================
📍 位置: C:\projects\game152Dev\gameServer
🚀 啟動中...
============================================================

🎮 初始化遊戲引擎...
✅ 遊戲引擎初始化成功！
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 驗證伺服器
開啟瀏覽器，訪問：
```
http://localhost:8000
```

應該會看到：
```json
{
  "message": "好運咚咚 Spin Server",
  "version": "1.0.0",
  "endpoints": {
    "spin": "POST /api/spin",
    "health": "GET /api/health",
    "status": "GET /api/status"
  }
}
```

---

## API 文檔

### 1. POST /api/spin

執行遊戲旋轉並回傳結果。

**請求 URL:**
```
POST http://localhost:8000/api/spin
```

**請求標頭:**
```
Content-Type: application/json
```

**請求主體:**
```json
{
  "bet": 50,
  "spin_type": "normal",
  "player_id": "player123",
  "session_id": "session456"
}
```

**請求參數:**
| 參數 | 類型 | 必填 | 說明 | 預設值 |
|------|------|------|------|--------|
| bet | int | 是 | 下注金額 (1-10000) | 50 |
| spin_type | string | 是 | 旋轉類型 | "normal" |
| player_id | string | 否 | 玩家 ID | null |
| session_id | string | 否 | 會話 ID | null |

**spin_type 可選值:**
- `"normal"` - 正常旋轉
- `"feature_60x"` - 特色購買 60x
- `"feature_80x"` - 特色購買 80x
- `"feature_100x"` - 特色購買 100x

**回應範例 (成功):**
```json
{
  "success": true,
  "data": {
    "module_id": "BS",
    "credit": 9999950,
    "rng": [17, 54, 70, 48, 22, 26, 14, 11, 16, 82, 74, 44, 91, 23, 5],
    "win": 173,
    "winLineGrp": [
      {
        "win_line_type": 0,
        "line_no": 65535,
        "symbol_id": 7,
        "pos": [14, 24, 5],
        "credit": 173,
        "multiplier": 1,
        "credit_long": {
          "low": 173,
          "high": 0,
          "unsigned": true
        }
      }
    ],
    "multiplierAlone": 1,
    "mulitplierPattern": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "next_module": "BS",
    "winBonusGrp": [],
    "jp_count": 0,
    "jp": 0
  },
  "error": null,
  "timestamp": "2025-10-14T10:30:00.123456",
  "session_id": "session456"
}
```

**回應範例 (失敗):**
```json
{
  "success": false,
  "data": null,
  "error": "遊戲引擎錯誤: xxx",
  "timestamp": "2025-10-14T10:30:00.123456",
  "session_id": "session456"
}
```

---

### 2. GET /api/health

健康檢查端點，用於監控伺服器狀態。

**請求 URL:**
```
GET http://localhost:8000/api/health
```

**回應範例:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-14T10:30:00.123456",
  "version": "1.0.0"
}
```

---

### 3. GET /api/status

取得伺服器運行狀態和統計資訊。

**請求 URL:**
```
GET http://localhost:8000/api/status
```

**回應範例:**
```json
{
  "status": "running",
  "total_spins": 1523,
  "total_wins": 687,
  "uptime_seconds": 3600.5,
  "engine_ready": true
}
```

---

## 測試方法

### 方法 1: 使用 Python 測試腳本

執行完整測試套件：
```bash
python test_spin_server.py
```

測試項目包括：
1. ✅ 健康檢查
2. ✅ 狀態查詢
3. ✅ 正常 Spin
4. ✅ 連續 10 次 Spin
5. ✅ 特色購買

### 方法 2: 使用 HTML 測試頁面

1. 確保伺服器已啟動
2. 開啟 `test_spin_client.html`
3. 在瀏覽器中操作測試

功能：
- 🔌 即時顯示伺服器狀態
- 🎰 可調整下注金額和旋轉類型
- 🎲 單次或批次執行 Spin
- 📊 即時顯示滾輪結果和贏分
- 📝 完整的執行記錄

### 方法 3: 使用 curl

**測試健康檢查:**
```bash
curl http://localhost:8000/api/health
```

**測試狀態查詢:**
```bash
curl http://localhost:8000/api/status
```

**測試 Spin:**
```bash
curl -X POST http://localhost:8000/api/spin \
  -H "Content-Type: application/json" \
  -d '{
    "bet": 50,
    "spin_type": "normal",
    "player_id": "test_player",
    "session_id": "test_session"
  }'
```

### 方法 4: 使用 Postman

1. 創建新請求
2. 設定方法為 `POST`
3. URL: `http://localhost:8000/api/spin`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "bet": 50,
  "spin_type": "normal"
}
```

---

## 前端整合

### JavaScript / TypeScript

```typescript
// Spin Server API 客戶端
class SpinServerClient {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:8000/api') {
        this.baseUrl = baseUrl;
    }

    /**
     * 執行遊戲旋轉
     */
    async executeSpin(bet: number, spinType: string = 'normal'): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/spin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bet: bet,
                    spin_type: spinType,
                    player_id: this.getPlayerId(),
                    session_id: this.getSessionId()
                })
            });

            const result = await response.json();

            if (result.success && result.data) {
                return result.data;
            } else {
                throw new Error(result.error || 'Spin failed');
            }
        } catch (error) {
            console.error('Spin request failed:', error);
            throw error;
        }
    }

    /**
     * 檢查伺服器健康狀態
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            const data = await response.json();
            return data.status === 'ok';
        } catch {
            return false;
        }
    }

    /**
     * 取得伺服器狀態
     */
    async getStatus(): Promise<any> {
        const response = await fetch(`${this.baseUrl}/status`);
        return await response.json();
    }

    private getPlayerId(): string {
        // 實作取得玩家 ID 的邏輯
        return 'player_001';
    }

    private getSessionId(): string {
        // 實作取得會話 ID 的邏輯
        return `session_${Date.now()}`;
    }
}

// 使用範例
const client = new SpinServerClient();

async function handleSpinClick() {
    try {
        const result = await client.executeSpin(50, 'normal');
        console.log('Spin result:', result);
        
        // 套用遊戲結果
        applyGameResult(result);
    } catch (error) {
        console.error('Spin error:', error);
    }
}

function applyGameResult(data: any) {
    // 套用滾輪結果
    console.log('RNG:', data.rng);
    console.log('Win:', data.win);
    console.log('Win Lines:', data.winLineGrp);
    
    // 實作您的遊戲邏輯...
}
```

### Cocos Creator 整合

```typescript
// 在 UIController 或 GameController 中整合
import { _decorator, Component } from 'cc';

@ccclass('SpinServerController')
export class SpinServerController extends Component {
    private apiBaseUrl = 'http://localhost:8000/api';

    /**
     * 執行 Spin（整合到現有 ClickSpin 方法）
     */
    async executeSpin(bet: number) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/spin`, {
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
                // 轉換並套用結果
                this.applySpinResult(result.data);
            } else {
                console.error('Spin failed:', result.error);
            }
        } catch (error) {
            console.error('Spin request error:', error);
        }
    }

    /**
     * 套用 Spin 結果
     */
    private applySpinResult(data: any) {
        // 轉換 RNG 為滾輪格式
        const reels = this.convertRngToReels(data.rng);
        
        // 設定滾輪結果
        // this.reelController.setTargetReels(reels);
        
        // 設定贏分資訊
        // this.winDisplay.show(data.win);
        
        console.log('Applied spin result:', {
            win: data.win,
            multiplier: data.multiplierAlone,
            winLines: data.winLineGrp.length
        });
    }

    /**
     * 轉換 RNG 為 5x3 滾輪格式
     */
    private convertRngToReels(rng: number[]): number[][] {
        const reels: number[][] = [];
        for (let col = 0; col < 5; col++) {
            const reel = [];
            for (let row = 0; row < 3; row++) {
                reel.push(rng[row * 5 + col]);
            }
            reels.push(reel);
        }
        return reels;
    }
}
```

---

## 故障排除

### 問題 1: 無法啟動伺服器

**錯誤訊息:**
```
Address already in use
```

**解決方法:**
1. 檢查端口是否被佔用：
```bash
netstat -ano | findstr :8000
```

2. 更換端口或關閉佔用程式：
```bash
# 更換端口
uvicorn spin_server:app --port 8001
```

---

### 問題 2: CORS 錯誤

**錯誤訊息:**
```
Access to fetch has been blocked by CORS policy
```

**解決方法:**
伺服器已設定 CORS，但如果仍有問題：

1. 確認 `spin_server.py` 中的 CORS 設定：
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允許所有來源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. 或指定特定域名：
```python
allow_origins=["http://localhost:7456", "http://127.0.0.1:7456"]
```

---

### 問題 3: 遊戲引擎初始化失敗

**錯誤訊息:**
```
❌ 遊戲引擎初始化失敗: ...
```

**解決方法:**
1. 檢查配置檔案是否存在：
```bash
ls config/game_config.json
ls config/paytable.json
```

2. 確認專案路徑正確
3. 查看完整錯誤訊息

---

### 問題 4: 回傳資料格式不正確

**症狀:**
前端無法正確解析回傳的資料。

**解決方法:**
1. 檢查回應的 `data` 欄位結構
2. 確認 `SimpleDataExporter` 正常運作
3. 查看伺服器日誌

---

## 進階設定

### 修改端口

編輯 `spin_server.py` 的 `main()` 函數：
```python
uvicorn.run(
    app,
    host="0.0.0.0",
    port=8080,  # 改為您想要的端口
    log_level="info"
)
```

### 生產環境部署

使用 gunicorn + uvicorn workers：
```bash
gunicorn spin_server:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### 啟用日誌

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

---

## 檔案結構

```
gameServer/
├── spin_server.py              # 主伺服器程式
├── test_spin_server.py         # Python 測試腳本
├── test_spin_client.html       # HTML 測試頁面
├── core/
│   └── game_engine.py          # 遊戲引擎
├── protocol/
│   └── simple_data_exporter.py # 資料格式轉換
└── config/
    ├── game_config.json        # 遊戲配置
    └── paytable.json           # 賠率表
```

---

## 總結

✅ **已完成功能:**
1. FastAPI 後端伺服器
2. POST /api/spin 端點
3. 簡化資料格式輸出
4. CORS 跨域支援
5. Python 測試腳本
6. HTML 測試頁面
7. 完整文檔

✅ **測試驗證:**
- 健康檢查 ✓
- 狀態查詢 ✓
- 正常 Spin ✓
- 連續 Spin ✓
- 特色購買 ✓

✅ **可立即使用:**
```bash
# 啟動伺服器
python spin_server.py

# 測試 API
python test_spin_server.py

# 或使用瀏覽器測試
# 開啟 test_spin_client.html
```

---

**建立日期:** 2025-10-14  
**版本:** 1.0.0  
**狀態:** ✅ 完成並測試
