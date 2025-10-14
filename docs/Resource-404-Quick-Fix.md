# 資源 404 錯誤快速修復

**日期**: 2025-10-14  
**錯誤**: `Error: download failed: assets/internal/import/60/60f7195c-ec2a-45eb-ba94-8955f60e81d0.json, status: 404`

## 🔍 問題原因

這個錯誤表示瀏覽器無法載入某個內部資源檔案。可能的原因：

1. **Cocos Creator 專案需要重新構建**
2. **資源檔案丟失或未正確生成**
3. **快取問題導致引用舊的資源 UUID**
4. **專案資料庫損壞**

---

## ✅ 解決方案

### 方案 1: 重新構建專案（推薦）

1. **開啟 Cocos Creator**
   - 開啟專案: `c:\projects\game152Dev\pss-on-00152`

2. **清理快取**
   ```
   選單: 開發者 -> 重新編譯腳本
   選單: 開發者 -> 重新構建原生引擎
   ```

3. **重新構建**
   ```
   選單: 專案 -> 構建發布
   - 選擇 Web Mobile 平台
   - 點擊「構建」
   ```

4. **刷新瀏覽器**
   ```
   Ctrl + Shift + R (強制刷新，清除快取)
   ```

---

### 方案 2: 使用預覽模式（臨時）

如果 Cocos Creator 無法使用，可以嘗試：

1. **使用內建預覽伺服器**
   ```
   在 Cocos Creator 中:
   選單: 專案 -> 預覽
   ```
   
2. **添加 LocalServer 參數**
   ```
   在瀏覽器 URL 加上: ?localServer=true
   例如: http://localhost:7456/?localServer=true
   ```

---

### 方案 3: 清理專案資料庫

如果重新構建仍有問題：

1. **關閉 Cocos Creator**

2. **刪除快取目錄**
   ```powershell
   Remove-Item -Recurse -Force "c:\projects\game152Dev\pss-on-00152\library"
   Remove-Item -Recurse -Force "c:\projects\game152Dev\pss-on-00152\temp"
   ```

3. **重新開啟 Cocos Creator**
   - Creator 會自動重新生成資料庫

4. **重新構建專案**

---

### 方案 4: 檢查構建輸出

1. **檢查構建目錄**
   ```powershell
   Get-ChildItem "c:\projects\game152Dev\pss-on-00152\build" -Recurse | 
   Where-Object { $_.Name -like "*60f7195c*" }
   ```

2. **查看構建日誌**
   - 在 Cocos Creator 的「構建」面板查看錯誤訊息

---

## 🔧 WebSocket 測試（資源問題解決後）

資源問題解決後，按照以下步驟測試 WebSocket Spin 功能：

### 1. 確認 Spin Server 運行

```powershell
# 應該看到:
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 2. 開啟遊戲

```
http://localhost:7456/?localServer=true
```

### 3. 檢查 Console 日誌

**初始化階段** 應該看到:
```
[DEBUG] isLocalServerMode: true
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
[DEBUG] WebSocket URL: ws://localhost:8000/ws
[DEBUG] Creating WebSocket connection to Spin Server
```

### 4. 按下 Spin 按鈕

**前端 Console** 應該看到:
```
*netlog* -> STATEConsole.CurState : K_SPIN
[DEBUG] LocalServer mode - sending JSON: {...}
[DEBUG] Sending bet: 50 (betIndex: 0, rateIndex: 0)
[DEBUG] Received JSON message: eStateRecall
[DEBUG] State recall received, status: kSuccess
```

**Spin Server 終端** 應該看到:
```
📨 收到 WebSocket 訊息: eStateCall
🎰 執行 Spin: bet=50, type=normal
✅ Spin 完成 - Win: xxx
```

---

## 🐛 常見問題

### Q1: 刪除快取後專案載入很慢

**A**: 正常現象。Cocos Creator 需要重新生成所有資源的資料庫索引。

---

### Q2: 仍然出現 404 錯誤

**A**: 可能的解決方法：
1. 確認構建目標是 **Web Mobile**
2. 檢查構建輸出目錄是否完整
3. 嘗試刪除 `build` 目錄並重新構建
4. 檢查 Cocos Creator 版本是否正確

---

### Q3: WebSocket 連接失敗

**A**: 檢查：
1. Spin Server 是否正在運行 (`http://localhost:8000`)
2. 防火牆是否阻擋連接
3. 瀏覽器 Console 中的具體錯誤訊息

---

## 📊 診斷檢查清單

在報告問題前，請檢查以下項目：

- [ ] Cocos Creator 已開啟專案
- [ ] 專案已重新構建（Web Mobile）
- [ ] 瀏覽器已強制刷新（Ctrl + Shift + R）
- [ ] Spin Server 正在運行（http://localhost:8000）
- [ ] 遊戲 URL 包含 `?localServer=true`
- [ ] 瀏覽器 Console 沒有其他錯誤
- [ ] 已檢查 Network 面板的失敗請求

---

## 🎯 快速測試命令

```powershell
# 1. 檢查 Spin Server 狀態
Test-NetConnection -ComputerName localhost -Port 8000

# 2. 測試 Spin Server API
Invoke-RestMethod -Uri "http://localhost:8000/api/init" -Method GET

# 3. 檢查構建目錄
Test-Path "c:\projects\game152Dev\pss-on-00152\build\web-mobile"

# 4. 查看專案快取大小
Get-ChildItem "c:\projects\game152Dev\pss-on-00152\library" -Recurse | 
Measure-Object -Property Length -Sum | 
Select-Object @{Name="Size(MB)"; Expression={[math]::Round($_.Sum/1MB, 2)}}
```

---

## 📚 相關文檔

- [LocalServer-WebSocket-JSON-Fix.md](LocalServer-WebSocket-JSON-Fix.md) - WebSocket JSON 通訊修復
- [LocalServer-InitialBoard-Complete-Report.md](LocalServer-InitialBoard-Complete-Report.md) - 初始盤面實現
- [LocalServer-Quick-Reference.md](LocalServer-Quick-Reference.md) - 快速參考

---

**狀態**: ⏳ 待使用 Cocos Creator 重新構建專案  
**優先級**: 🔴 高（阻擋測試）
