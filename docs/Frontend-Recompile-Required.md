# ⚠️ 前端代碼已修改 - 需要重新編譯

## 📅 修改時間
2025-01-14

## ✅ 已完成的修改

### ProtoConsole.ts 修改摘要
已移除所有 LocalServer 模式的 JSON 發送邏輯，統一使用 Protobuf：

1. **LoginCall** (line ~300)
   - ❌ 移除: LocalServer 模式發送 JSON.stringify()
   - ✅ 改為: 統一使用 Proto.encodeLoginCall()

2. **LoginRecall** (line ~325)
   - ❌ 移除: LocalServer 模式解析 JSON.parse()
   - ✅ 改為: 統一使用 Proto.decodeLoginRecall()

3. **StateCall** (line ~704)
   - ❌ 移除: LocalServer 模式發送 JSON.stringify()
   - ✅ 改為: 統一使用 Proto.encodeStateCall()

4. **StateRecall** (line ~740)
   - ✅ 已經使用 Proto.decodeStateRecall()（無需修改）

5. **ResultCall** (line ~586)
   - ✅ 已經使用 Proto.encodeResultCall()（無需修改）

6. **dispatch_msg** (line ~1060)
   - ✅ 已經統一使用 Protobuf 解析（無需修改）

## 🔧 需要重新編譯的原因

TypeScript 代碼已修改，但 Cocos Creator 的編譯輸出還沒更新。瀏覽器運行的是舊的 JavaScript 代碼。

### 當前症狀
```
[DEBUG] bksend - sending JSON string, length: 97
⚠️ 收到文字訊息: {"msgid":"eLoginCall",...}
```

說明前端還在發送 JSON，而不是 Protobuf 二進制。

## 🚀 重新編譯步驟

### 方法 A: 完整重新編譯（推薦）

1. **關閉 Cocos Creator**
   - 完全退出程式

2. **清除快取**
   ```bash
   cd C:\projects\game152Dev\pss-on-00152
   Remove-Item -Recurse -Force library\.cache
   Remove-Item -Recurse -Force temp\*
   ```

3. **重新開啟 Cocos Creator**
   - 開啟專案：`C:\projects\game152Dev\pss-on-00152`
   - 等待索引完成（可能需要 5-10 分鐘）

4. **Build 專案**
   - 選單：`Project > Build...`
   - 平台：Web Desktop
   - Build Path: 預設
   - 點擊 **Build**
   - 等待編譯完成

5. **測試**
   ```
   http://localhost:7456/?localServer=true
   ```

### 方法 B: 快速測試（臨時方案）

如果只是想快速驗證邏輯，可以暫時讓後端支援 JSON：

1. **在 spin_server.py 中添加 JSON 處理**
   ```python
   elif "text" in message_data:
       text_data = message_data["text"]
       logger.info(f"📨 收到 JSON 訊息: {text_data}")
       
       try:
           json_message = json.loads(text_data)
           msgid_str = json_message.get("msgid", "")
           
           # 轉換 JSON msgid 字串為數字
           if msgid_str == "eLoginCall":
               msgid = EMSGID.eLoginCall
           elif msgid_str == "eStateCall":
               msgid = EMSGID.eStateCall
           # ... 處理 JSON 訊息 ...
       except Exception as e:
           logger.error(f"JSON 解析失敗: {e}")
   ```

2. **回應也用 JSON**
   ```python
   response_json = {
       "msgid": "eLoginRecall",
       "status_code": "kSuccess",
       "token": json_message.get("token", "")
   }
   await websocket.send_text(json.dumps(response_json))
   ```

**缺點**: 
- 需要維護兩套邏輯
- 與正常模式不一致
- 長期不可持續

## ✅ 驗證編譯成功

編譯完成後，檢查 Console 日誌：

### 預期日誌（正確）
```
[DEBUG] bksend - sending binary data, byteLength: 29
📨 收到 Protobuf 訊息 (29 bytes)
🔐 處理登入請求
✅ 登入成功 - 發送 11 bytes
```

### 錯誤日誌（需重新編譯）
```
[DEBUG] bksend - sending JSON string, length: 97
⚠️ 收到文字訊息: {"msgid":"eLoginCall",...}
```

## 📋 完整測試檢查清單

編譯完成後，執行以下測試：

- [ ] 1. **啟動 Spin Server**
  ```bash
  cd gameServer
  python spin_server.py
  ```

- [ ] 2. **開啟遊戲**
  ```
  http://localhost:7456/?localServer=true
  ```

- [ ] 3. **檢查 LoginCall/LoginRecall**
  - Console 顯示 "sending binary data"
  - 後端顯示 "收到 Protobuf 訊息"
  - 登入成功

- [ ] 4. **檢查 StateCall/StateRecall**
  - 點擊 Spin
  - 前端發送 Protobuf StateCall
  - 後端執行 Spin
  - 後端發送 StateRecall

- [ ] 5. **檢查 ResultCall/ResultRecall**
  - 自動發送 ResultCall
  - 後端返回 ResultRecall（包含遊戲結果）
  - Reel 初始化成功
  - 顯示滾輪和遊戲結果

- [ ] 6. **完整 Spin 流程**
  - 滾輪正常旋轉
  - 顯示中獎畫面
  - 分數正確累加

## 🐛 常見問題

### Q1: Console 還是顯示 "sending JSON string"
**A**: TypeScript 代碼沒有重新編譯，按照方法 A 重新編譯。

### Q2: 編譯後還是不行
**A**: 清除瀏覽器快取（Ctrl + Shift + Delete），然後重新整理頁面。

### Q3: Cocos Creator 編譯太慢
**A**: 
1. 確保沒有其他大型程式在執行
2. 只編譯必要的平台（Web Desktop）
3. 關閉不需要的資源檔案索引

### Q4: WebSocket 連接斷開
**A**: 
1. 檢查 Spin Server 是否正在運行
2. 檢查 8000 端口是否被占用
3. 查看後端 Console 的錯誤訊息

## 📚 相關文件
- `/pss-on-00152/assets/script/MessageController/ProtoConsole.ts` - 前端 WebSocket 通訊
- `/gameServer/spin_server.py` - 後端 WebSocket 伺服器
- `/docs/Cocos-Creator-Recompile-Guide.md` - 詳細的重新編譯指南
- `/docs/LocalServer-Protobuf-Status.md` - Protobuf 實現狀態

## 💡 下一步

完成重新編譯後：
1. 測試完整的遊戲流程
2. 確認 Reel 初始化成功
3. 測試多次 Spin
4. 檢查分數是否正確計算
5. 測試特殊遊戲功能（如果有）

## 🎯 目標狀態

最終應該看到：
```
前端 Console:
[DEBUG] bksend - sending binary data, byteLength: 29
[DEBUG] bksend - sending binary data, byteLength: 15
[DEBUG] bksend - sending binary data, byteLength: 50
[DEBUG] LocalServer - Received Protobuf message: 101
[DEBUG] Login successful
[DEBUG] StateRecall - status_code: kSuccess
[DEBUG] ResultRecall received
✅ Reel 初始化成功！

後端 Console:
📨 收到 Protobuf 訊息 (29 bytes)
🔐 處理登入請求
✅ 登入成功 - 發送 11 bytes
📨 收到 Protobuf 訊息 (15 bytes)
🎰 處理 StateCall (K_SPIN)
✅ Spin 完成 - Win: 1250, 發送 10 bytes
📨 收到 Protobuf 訊息 (50 bytes)
🎮 處理 ResultCall
📊 Spin 結果: reel=[5,12,3,8,15,...], win=1250
✅ ResultRecall 發送 - 85 bytes, rng count: 30
```
