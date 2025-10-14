# 🎮 前端重新編譯手冊

## ✅ 已完成的準備工作

1. ✅ Cocos Creator 已關閉
2. ✅ temp 目錄已清除
3. ✅ 前端代碼已修改（統一使用 Protobuf）
4. ✅ 後端已完成（支援完整 Protobuf 通訊）

## 📋 編譯步驟

### Step 1: 開啟 Cocos Creator

**方法 A: 從桌面或開始選單**
- 尋找 "Cocos Creator" 圖示
- 雙擊開啟

**方法 B: 從專案資料夾**
1. 開啟檔案總管
2. 導航到: `C:\projects\game152Dev\pss-on-00152`
3. 雙擊 `project.json` 檔案（會自動用 Cocos Creator 開啟）

**方法 C: 從 Cocos Dashboard**
- 開啟 Cocos Dashboard
- 點擊 "pss-on-00152" 專案

---

### Step 2: 等待專案載入 ⏳

**重要！請耐心等待 5-10 分鐘**

載入過程中會看到：
- 右下角顯示進度條
- Console 輸出載入訊息
- "Compiling..." 或 "Indexing..." 文字

**等到以下狀態才算完成：**
- ✅ 右下角進度條消失
- ✅ Assets 面板顯示所有資源
- ✅ Console 沒有錯誤訊息
- ✅ 可以點擊 Scene 中的物件

---

### Step 3: 開啟 Build 視窗

**方法 A: 使用選單**
1. 點擊頂部選單: `Project`
2. 選擇: `Build...`

**方法 B: 使用快捷鍵**
- 按下: `Ctrl + Shift + B`

---

### Step 4: 設定編譯選項

在 Build 視窗中：

1. **Platform (平台)**
   - 選擇: `Web Desktop`
   - ⚠️ 確保選對！不要選 Web Mobile

2. **Build Path (輸出路徑)**
   - 保持預設值
   - 通常是: `build/web-desktop`

3. **Start Scene (起始場景)**
   - 保持預設（第一個場景）

4. **Debug (調試模式)**
   - ✅ **取消勾選** Debug（正式版執行較快）
   - 或保持勾選（可查看詳細日誌）

5. **Source Maps**
   - 可選，不影響功能

---

### Step 5: 開始編譯 🔨

1. 點擊視窗底部的 **"Build"** 按鈕
2. 等待編譯過程

**編譯過程中會看到：**
```
Building...
Compiling scripts...
Generating assets...
Packing...
Build succeeded! (或 Build complete!)
```

**預計時間：3-5 分鐘**

---

### Step 6: 驗證編譯成功 ✅

**檢查以下項目：**

1. **Build 視窗顯示**
   ```
   ✅ Build succeeded!
   ```

2. **檔案已生成**
   - 開啟: `C:\projects\game152Dev\pss-on-00152\build\web-desktop`
   - 應該看到: `index.html`, `assets/`, `src/` 等檔案

3. **Console 無錯誤**
   - 查看 Cocos Creator 的 Console 面板
   - 應該沒有紅色錯誤訊息

---

### Step 7: 關閉 Cocos Creator（可選）

編譯完成後可以關閉 Cocos Creator，節省系統資源。

---

## 🧪 測試編譯結果

### 1. 啟動 Spin Server

開啟 PowerShell：
```powershell
cd C:\projects\game152Dev\gameServer
python spin_server.py
```

應該看到：
```
============================================================
🎮 好運咚咚 Spin Server
============================================================
✅ 遊戲引擎初始化成功！
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### 2. 開啟遊戲

在瀏覽器中開啟：
```
http://localhost:7456/?localServer=true
```

---

### 3. 檢查 Console 日誌

**✅ 正確的日誌（Protobuf 模式）:**
```javascript
[DEBUG] bksend - sending binary data, byteLength: 29  ← ✅ 正確！
[DEBUG] LocalServer - Received Protobuf message: 101
[DEBUG] Login successful
[DEBUG] StateRecall - status_code: kSuccess
[DEBUG] ResultRecall received
✅ Reel 初始化成功！
```

**❌ 錯誤的日誌（舊代碼未更新）:**
```javascript
[DEBUG] bksend - sending JSON string, length: 97  ← ❌ 錯誤！
```

如果還是看到 "JSON string"，請：
1. 確認編譯已完成（Build succeeded）
2. 清除瀏覽器快取：`Ctrl + Shift + Delete`
3. 強制重新整理：`Ctrl + F5`
4. 重新開啟瀏覽器

---

### 4. 測試完整流程

1. ✅ **登入成功**: 看到遊戲畫面
2. ✅ **Reel 初始化**: 看到滾輪上的圖案
3. ✅ **點擊 Spin**: 滾輪開始旋轉
4. ✅ **顯示結果**: 看到中獎畫面和分數

---

## 🐛 常見問題排除

### Q1: 編譯時出現 "TypeScript compilation error"
**解決方法:**
1. 確認 TypeScript 代碼沒有語法錯誤
2. 查看 Console 的具體錯誤訊息
3. 檢查是否有缺少的套件

### Q2: Build 按鈕是灰色的（無法點擊）
**解決方法:**
1. 等待專案完全載入
2. 確認已選擇 Platform (Web Desktop)
3. 重新開啟 Cocos Creator

### Q3: 編譯很慢（超過 10 分鐘）
**解決方法:**
1. 檢查電腦 CPU/記憶體使用率
2. 關閉其他大型程式
3. 重新啟動 Cocos Creator

### Q4: 編譯後測試還是顯示 "JSON string"
**解決方法:**
1. 確認編譯成功（Build succeeded）
2. 檢查 build 目錄是否有新檔案
3. 清除瀏覽器快取並強制重新整理
4. 確認開啟的是 localhost:7456（不是其他端口）
5. 檢查 ProtoConsole.ts 是否已修改（應該沒有 JSON.stringify）

### Q5: 遊戲無法載入或白屏
**解決方法:**
1. 開啟瀏覽器 Console (F12) 查看錯誤
2. 確認 Spin Server 正在運行
3. 檢查 8000 端口是否被占用
4. 查看後端 Console 的錯誤訊息

---

## 📚 相關文檔

- `/docs/Cocos-Creator-Recompile-Guide.md` - 詳細編譯指南
- `/docs/LocalServer-Protobuf-Status.md` - Protobuf 實現狀態
- `/docs/Frontend-Recompile-Required.md` - 為什麼需要重新編譯

---

## ✅ 完成後的檢查清單

- [ ] Cocos Creator 已開啟
- [ ] 專案已完全載入（無進度條）
- [ ] Build 視窗已開啟
- [ ] Platform 選擇 Web Desktop
- [ ] 點擊 Build 按鈕
- [ ] 編譯成功（Build succeeded）
- [ ] Spin Server 已啟動
- [ ] 遊戲可以開啟
- [ ] Console 顯示 "binary data"（不是 JSON）
- [ ] Reel 初始化成功
- [ ] 可以正常 Spin

---

## 🎯 預期最終結果

**前端 Console:**
```
[DEBUG] bksend - sending binary data, byteLength: 29
[DEBUG] bksend - sending binary data, byteLength: 15
[DEBUG] bksend - sending binary data, byteLength: 50
[DEBUG] LoginRecall (LocalServer) status: kSuccess
[DEBUG] StateRecall - status_code: kSuccess
[DEBUG] ResultRecall received
✅ Reel 初始化成功！
```

**後端 Console:**
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

**遊戲畫面:**
- ✅ 滾輪顯示正常
- ✅ 可以點擊 Spin
- ✅ 滾輪旋轉動畫流暢
- ✅ 中獎時顯示獲勝畫面
- ✅ 分數正確累加

---

**編譯完成後，回到此處繼續測試！** 🎮
