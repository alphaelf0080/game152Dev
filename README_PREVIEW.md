# 🎯 快速測試指南（使用 Cocos Preview）

## ✅ 你完全正確！

Cocos Creator 在 **Preview 模式**下會**自動編譯** TypeScript！

**不需要手動 Build！** 🎉

---

## 🚀 現在就測試（3 步驟）

### Step 1️⃣: 確認 Spin Server 正在運行

檢查是否已經啟動：
- 查看是否有終端顯示 "Spin Server" 
- 或檢查 8000 端口是否占用

如果沒有運行，執行：
```powershell
cd C:\projects\game152Dev\gameServer
python spin_server.py
```

✅ 看到以下訊息表示成功：
```
🎮 好運咚咚 Spin Server
✅ 遊戲引擎初始化成功！
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### Step 2️⃣: 開啟 Cocos Creator 並 Preview

1. **開啟 Cocos Creator**
   - 從桌面或開始選單

2. **打開專案**
   ```
   C:\projects\game152Dev\pss-on-00152
   ```

3. **等待專案載入**（第一次可能需要幾分鐘）

4. **點擊 Preview**
   - 點擊頂部工具列的 ▶️ **Preview** 按鈕
   - 或按快捷鍵: `Ctrl + P`
   - 瀏覽器會自動開啟

---

### Step 3️⃣: 啟用 LocalServer 模式

在瀏覽器的 URL 後面加上參數：

```
http://localhost:7456/?localServer=true
```

按 Enter，頁面會重新載入。

---

## ✅ 驗證成功

### 1. 開啟 Console (按 F12)

### 2. 查看前端日誌

**✅ 成功（使用 Protobuf）:**
```javascript
[DEBUG] bksend - sending binary data, byteLength: 29
[DEBUG] LocalServer - Received Protobuf message: 101
[DEBUG] Login successful
[DEBUG] StateRecall - status_code: kSuccess
[DEBUG] ResultRecall received
✅ Reel 初始化成功！
```

**❌ 失敗（還在使用 JSON）:**
```javascript
[DEBUG] bksend - sending JSON string, length: 97
```

### 3. 查看後端 Console

應該看到：
```
📨 收到 Protobuf 訊息 (29 bytes)
🔐 處理登入請求
✅ 登入成功 - 發送 11 bytes
📨 收到 Protobuf 訊息 (15 bytes)
🎰 處理 StateCall (K_SPIN)
✅ Spin 完成 - Win: 1250
📨 收到 Protobuf 訊息 (50 bytes)
🎮 處理 ResultCall
✅ ResultRecall 發送 - 85 bytes
```

---

## 🔄 如果還看到 "JSON string"

這表示 Preview 沒有編譯最新的代碼。請：

1. **關閉 Preview 視窗**
2. **在 Cocos Creator 中重新 Preview** (`Ctrl + P`)
3. **清除瀏覽器快取**
   - 按 `Ctrl + Shift + Delete`
   - 清除「快取的圖片和檔案」
   - 或按 `Ctrl + F5` 強制重新整理
4. **重新開啟**
   ```
   http://localhost:7456/?localServer=true
   ```

---

## 💡 修改代碼後

Preview 模式的好處：**自動重新編譯**

1. 修改 TypeScript 檔案（如 `ProtoConsole.ts`）
2. 儲存 (`Ctrl + S`)
3. Cocos Creator **自動重新編譯**
4. 瀏覽器**重新整理** (`F5`)
5. 查看新的變更

**不需要：**
- ❌ 手動 Build
- ❌ 關閉 Cocos Creator
- ❌ 清除大量快取

---

## 🎮 測試完整流程

1. ✅ **登入成功**: 遊戲畫面載入
2. ✅ **Reel 初始化**: 看到滾輪上的圖案
3. ✅ **點擊 Spin**: 滾輪開始旋轉
4. ✅ **顯示結果**: 看到中獎畫面和分數

---

## 🐛 常見問題

### Q: Preview 按鈕是灰色的
**A:** 等待專案完全載入，右下角進度條消失後就可以點擊

### Q: 瀏覽器沒有自動開啟
**A:** 手動開啟: `http://localhost:7456/?localServer=true`

### Q: 還是看到 "JSON string"
**A:** 
1. 確認 Preview 已重新啟動
2. 清除瀏覽器快取 (`Ctrl + Shift + Delete`)
3. 強制重新整理 (`Ctrl + F5`)

### Q: WebSocket 連接失敗
**A:** 
1. 確認 Spin Server 正在運行
2. 檢查 8000 端口沒有被其他程式占用
3. 查看後端 Console 的錯誤訊息

---

## ✅ 總結

### 開發流程：

```
1. 啟動 Spin Server ✅
2. 開啟 Cocos Creator ✅
3. Preview (Ctrl + P) ✅
4. 開啟 URL + ?localServer=true ✅
5. 測試遊戲 ✅
```

### 關鍵要點：

- ✅ **Preview = 自動編譯**（開發時使用）
- ✅ **修改代碼 = 自動重新編譯**
- ✅ **只需重新整理瀏覽器**
- ❌ **不需要手動 Build**（只有發布時才需要）

---

**現在就去試試 Preview 吧！** 🚀

按 `Ctrl + P` 開始測試！
