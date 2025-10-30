# 📚 GS3 開發環境 - 資源索引

快速找到您需要的文件和資訊。

## 🎯 我想要...

### 快速開始測試
- **最簡單的方式**: 執行 `.\test_gs3_dev.ps1`
- **或直接打開遊戲**: http://localhost:7456/?dev_mode=true
- **查看快速指南**: [GS3-QUICK-START.md](./GS3-QUICK-START.md)

### 了解連接過程
- **完整總結**: [test_gs3_dev_summary.md](./test_gs3_dev_summary.md)
- **詳細文檔**: [docs/GS3-Dev-Environment-Testing.md](./docs/GS3-Dev-Environment-Testing.md)

### 測試 WebSocket 連接
- **測試工具**: 打開 [test_gs3_websocket.html](./test_gs3_websocket.html)
- **手動測試**: 查看[詳細文檔](./docs/GS3-Dev-Environment-Testing.md#%E6%89%8B%E5%8B%95%E6%B5%8B%E8%A9%A6)中的 JavaScript 代碼

### 診斷連接問題
- **故障排除**: [GS3-QUICK-START.md#-故障排除](./GS3-QUICK-START.md#-故障排除)
- **問題分析**: [docs/Dev-Mode-GS3-Connection-Issue.md](./docs/Dev-Mode-GS3-Connection-Issue.md)

### 查看代碼修改
- **核心文件**: `game169/assets/script/MessageController/ProtoConsole.ts`
- **修改摘要**: [test_gs3_dev_summary.md#-代碼更改摘要](./test_gs3_dev_summary.md#-代碼更改摘要)

### 了解環境配置
- **伺服器資訊**: dev-gs3.iplaystar.net:1109
- **代理商帳號**: DEVMODE
- **代理商密碼**: TEST9
- **詳細配置**: [test_gs3_dev_summary.md#-環境配置](./test_gs3_dev_summary.md#-環境配置)

## 📁 文件架構

```
c:\projects\game152Dev\
│
├── 🚀 快速開始
│   ├── GS3-QUICK-START.md ⭐ 從這裡開始
│   ├── test_gs3_dev.ps1 (PowerShell 腳本)
│   └── test_gs3_dev.bat (Batch 腳本)
│
├── 📖 文檔
│   ├── test_gs3_dev_summary.md (完整總結)
│   ├── docs/
│   │   ├── GS3-Dev-Environment-Testing.md (詳細指南)
│   │   └── Dev-Mode-GS3-Connection-Issue.md (問題分析)
│   └── 📚-RESOURCE-INDEX.md (本文件)
│
├── 🧪 測試工具
│   ├── test_gs3_websocket.html (WebSocket 測試)
│   └── gameServer/spin_server.py (本地伺服器參考)
│
└── 💻 源代碼
    └── game169/assets/script/MessageController/
        └── ProtoConsole.ts (核心實現)
```

## 📖 詳細文檔索引

| 文檔 | 用途 | 難度 |
|------|------|------|
| [GS3-QUICK-START.md](./GS3-QUICK-START.md) | 快速開始指南 | ⭐ 簡單 |
| [test_gs3_dev_summary.md](./test_gs3_dev_summary.md) | 完整實施總結 | ⭐⭐ 中等 |
| [docs/GS3-Dev-Environment-Testing.md](./docs/GS3-Dev-Environment-Testing.md) | 詳細測試指南 | ⭐⭐⭐ 深入 |
| [docs/Dev-Mode-GS3-Connection-Issue.md](./docs/Dev-Mode-GS3-Connection-Issue.md) | 連接問題分析 | ⭐⭐⭐ 技術 |

## 🚀 最常用的命令

### PowerShell
```powershell
# 方式 1: 使用測試腳本 (推薦)
cd c:\projects\game152Dev
.\test_gs3_dev.ps1

# 方式 2: 檢查網路連接
Test-NetConnection -ComputerName dev-gs3.iplaystar.net -Port 1109

# 方式 3: 查看 Git 日誌
git log --oneline -10
```

### URL 參數

| 參數 | 值 | 用途 |
|------|-----|------|
| `?dev_mode=true` | - | 連接 GS3 開發伺服器 (DEVMODE/TEST9) |
| `?localServer=true` | - | 連接本地測試伺服器 (ws://localhost:8000/ws) |
| `?agent_account=X` | 帳號 | 自訂代理商帳號 |
| `?agent_password=Y` | 密碼 | 自訂代理商密碼 |

## ✨ 特色功能

### 開發模式 (`?dev_mode=true`)
```
自動連接到 GS3 開發伺服器
使用 DEVMODE / TEST9 認證
跳過 psapi 檢查
添加詳細日誌
```

### LocalServer 模式 (`?localServer=true`)
```
連接本地測試伺服器 (ws://localhost:8000/ws)
用於本地開發測試
無需 GS3 連接
```

### 代理商認證
```
自動帳號: DEVMODE
自動密碼: TEST9
支援 URL 參數自訂
開發模式自動啟用
```

## 🔍 常見問題

### Q: 我該從哪裡開始？
**A**: 打開 [GS3-QUICK-START.md](./GS3-QUICK-START.md) 或執行 `.\test_gs3_dev.ps1`

### Q: WebSocket 連接失敗怎麼辦？
**A**: 查看 [GS3-QUICK-START.md#-故障排除](./GS3-QUICK-START.md#-故障排除) 或 [docs/Dev-Mode-GS3-Connection-Issue.md](./docs/Dev-Mode-GS3-Connection-Issue.md)

### Q: 如何測試不同的路徑？
**A**: 打開 [test_gs3_websocket.html](./test_gs3_websocket.html) 進行自動測試，或查看詳細文檔中的手動測試方法

### Q: 代理商帳密是什麼？
**A**: 帳號: `DEVMODE`, 密碼: `TEST9` (可在 URL 中自訂)

### Q: 如何自訂代理商帳密？
**A**: 使用 `?agent_account=X&agent_password=Y` 參數

## 📊 重要配置

```
GS3 伺服器:     dev-gs3.iplaystar.net
GS3 端口:       1109
WebSocket 路徑: /slot (主要), /ws (備用)
協議:          WebSocket (ws://)
帳號:          DEVMODE
密碼:          TEST9
啟動參數:      ?dev_mode=true
```

## 📞 技術聯繫

遇到問題時提供以下信息：
1. 完整的 URL (包括所有參數)
2. 瀏覽器 Console 的完整日誌
3. Network 標籤中的 WebSocket 連接詳情
4. 時間戳記和錯誤訊息

## ✅ 驗收清單

測試完成後檢查以下項目：

- [ ] WebSocket 連接成功
- [ ] 代理商認證成功 (DEVMODE/TEST9)
- [ ] 收到 LoginRecall 消息
- [ ] 遊戲狀態數據加載
- [ ] UI 正常渲染
- [ ] 可以進行遊戲操作

## 🔗 快速鏈接

- **快速開始**: [GS3-QUICK-START.md](./GS3-QUICK-START.md)
- **完整總結**: [test_gs3_dev_summary.md](./test_gs3_dev_summary.md)
- **詳細文檔**: [docs/GS3-Dev-Environment-Testing.md](./docs/GS3-Dev-Environment-Testing.md)
- **問題分析**: [docs/Dev-Mode-GS3-Connection-Issue.md](./docs/Dev-Mode-GS3-Connection-Issue.md)
- **測試工具**: [test_gs3_websocket.html](./test_gs3_websocket.html)
- **測試遊戲**: http://localhost:7456/?dev_mode=true

## 📅 版本資訊

- **更新日期**: 2025-10-30
- **版本**: 1.0
- **狀態**: ✅ 完成實施

## 🎓 學習資源

1. **初級**: 打開遊戲並查看 Console 日誌
2. **中級**: 使用 WebSocket 測試工具測試不同路徑
3. **進階**: 查看 ProtoConsole.ts 源代碼並進行修改

## 🚀 下一步

1. ✅ 閱讀快速開始指南
2. ✅ 執行測試腳本或打開遊戲
3. ✅ 檢查瀏覽器日誌
4. ✅ 驗證連接和認證
5. ✅ 報告測試結果

---

**提示**: 如果您第一次來，建議按照以下順序閱讀：
1. [GS3-QUICK-START.md](./GS3-QUICK-START.md) (5 分鐘)
2. [test_gs3_dev_summary.md](./test_gs3_dev_summary.md) (10 分鐘)
3. [docs/GS3-Dev-Environment-Testing.md](./docs/GS3-Dev-Environment-Testing.md) (視需要)

**最後**, 祝您測試順利！🎮
