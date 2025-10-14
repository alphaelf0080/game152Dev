# LocalServer WebSocket JSON 通訊修正

**日期**: 2025-10-14  
**狀態**: ✅ 已完成實現，待測試

## 📋 問題描述

### 原始錯誤
```
INFO:     127.0.0.1:55036 - "WebSocket /ws" [accepted]
INFO:__main__:🔌 WebSocket 連接建立: Address(host='127.0.0.1', port=55036)
INFO:     connection open
ERROR:__main__:❌ WebSocket 錯誤: 'text'
INFO:__main__:🔌 清理 WebSocket 連接
```

### 根本原因
1. **前端**: 發送 **Protobuf 二進制訊息** (`ArrayBuffer`)
2. **後端**: 嘗試接收 **JSON 文字訊息** (`receive_text()`)
3. **衝突**: 訊息格式不匹配導致解析失敗

---

## 🔧 解決方案

### 方案選擇
選擇 **方案 B**：修改前端在 LocalServer 模式下發送 **JSON 文字** 而非 Protobuf

**原因**:
- 不需要實現完整的 Protobuf 解析器
- LocalServer 是開發/調試工具，簡化協議更合適
- 後端已經設計為 JSON API
- 實現快速，測試簡單

---

## 📝 修改內容

### 1. ProtoConsole.ts - StateCall 函數

**修改前**:
```typescript
let StateCall = function () {
    // ... 構建訊息 ...
    const message = Proto.encodeStateCall(msg);
    bksend(message);  // 發送二進制 Protobuf
};
```

**修改後**:
```typescript
let StateCall = function () {
    gToken = Data.Library.CommonLibScript.GetURLParameter('access_token');
    let msg = {
        msgid: "eStateCall",
        token: gToken,
        stateid: Mode.FSM[Data.Library.StateConsole.CurState],
        reserved: 0
    };
    netlog("STATEConsole.CurState : " + Mode.FSM[Data.Library.StateConsole.CurState]);
    
    // LocalServer 模式下發送 JSON 文字
    if ((Data.Library as any).localServerMode) {
        console.log('[DEBUG] LocalServer mode - sending JSON:', msg);
        
        // 計算當前下注金額
        const betIndex = Data.Library.StateConsole.BetIndex || 0;
        const rateIndex = Data.Library.StateConsole.RateIndex || 0;
        const betArray = Data.Library.StateConsole.BetArray || [1, 2, 5, 10, 20, 50, 100];
        const rateArray = Data.Library.StateConsole.RateArray || [1];
        const lineArray = Data.Library.StateConsole.LineArray || [25];
        const bet = betArray[betIndex] * rateArray[rateIndex] * lineArray[0];
        
        const jsonMsg = {
            msgid: msg.msgid,
            stateid: msg.stateid,
            bet: bet,
            spin_type: "normal"
        };
        console.log('[DEBUG] Sending bet:', bet, '(betIndex:', betIndex, ', rateIndex:', rateIndex, ')');
        bksend(JSON.stringify(jsonMsg));  // 發送 JSON 字串
    } else {
        // 正常模式使用 Protobuf
        const message = Proto.encodeStateCall(msg);
        bksend(message);
    }
};
```

**關鍵改進**:
- ✅ LocalServer 模式下發送 JSON 字串
- ✅ 正確計算 `bet` 金額（betIndex × rateIndex × lineArray）
- ✅ 添加調試日誌顯示下注金額
- ✅ 保留正常模式的 Protobuf 編碼

---

### 2. ProtoConsole.ts - dispatch_msg 函數

**修改前**:
```typescript
let dispatch_msg = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeHeader(uint8);
    action_dispatch(Proto.encodeEMSGID[message.msgid], evt);
};
```

**修改後**:
```typescript
let dispatch_msg = function (evt) {
    // LocalServer 模式下處理 JSON 回應
    if ((Data.Library as any).localServerMode) {
        try {
            const message = JSON.parse(evt.data);
            console.log('[DEBUG] Received JSON message:', message.msgid);
            
            // 根據 msgid 分發到對應的處理函數
            if (message.msgid === "eLoginRecall") {
                console.log('[DEBUG] Login successful');
                const mockEvt = { data: evt.data, jsonMessage: message };
                action_dispatch(Proto.encodeEMSGID.eLoginRecall, mockEvt);
            } else if (message.msgid === "eStateRecall") {
                console.log('[DEBUG] State recall received, status:', message.status_code);
                const mockEvt = { data: evt.data, jsonMessage: message };
                
                // 存儲結果數據
                if (message.status_code === "kSuccess" && message.result) {
                    console.log('[DEBUG] Processing spin result');
                    (Data.Library as any).localServerSpinResult = message.result;
                }
                
                action_dispatch(Proto.encodeEMSGID.eStateRecall, mockEvt);
            }
        } catch (e) {
            console.error('[ERROR] Failed to parse JSON message:', e);
        }
    } else {
        // 正常模式使用 Protobuf
        let uint8 = RecombineBuffer(evt.data);
        const message = Proto.decodeHeader(uint8);
        action_dispatch(Proto.encodeEMSGID[message.msgid], evt);
    }
};
```

**關鍵改進**:
- ✅ 解析 JSON 訊息而非 Protobuf
- ✅ 根據 `msgid` 正確分發事件
- ✅ 存儲 Spin 結果到 `Data.Library.localServerSpinResult`
- ✅ 創建模擬事件 (`mockEvt`) 傳遞給原有的處理函數

---

### 3. ProtoConsole.ts - StateRecall 函數

**修改前**:
```typescript
let StateRecall = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeStateRecall(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    // ... 錯誤處理 ...
};
```

**修改後**:
```typescript
let StateRecall = function (evt) {
    // LocalServer 模式下直接返回成功
    if ((Data.Library as any).localServerMode) {
        console.log('[DEBUG] StateRecall in LocalServer mode');
        // 結果已經由 dispatch_msg 處理並存儲
        return;
    }
    
    // 正常模式使用 Protobuf
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeStateRecall(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    netlog("[@StateRecall] status_code " + StatusCode);
    if (StatusCode != Proto.encodeStatusCode.kSuccess) {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.SetStateError, Data.Library.ErrorData.Type.ALARM);
        Mode.ErrorInLoading(Data.Library.ErrorData.Code.SetStateError.toString());
    }
};
```

**關鍵改進**:
- ✅ LocalServer 模式下跳過 Protobuf 解析
- ✅ 保留正常模式的完整錯誤處理
- ✅ 簡化 LocalServer 流程（結果已在 `dispatch_msg` 中處理）

---

## 🔄 完整通訊流程

### LocalServer 模式 - Spin 流程

```
1. 用戶按下 Spin 按鈕
   ↓
2. StateCall() 被調用
   ↓
3. 計算下注金額: bet = betArray[betIndex] × rateArray[rateIndex] × lineArray[0]
   ↓
4. 構建 JSON 訊息:
   {
       "msgid": "eStateCall",
       "stateid": "K_SPIN",
       "bet": 50,
       "spin_type": "normal"
   }
   ↓
5. 通過 WebSocket 發送 JSON 字串到 ws://localhost:8000/ws
   ↓
6. Spin Server 接收並解析 JSON
   ↓
7. 執行遊戲邏輯: game_engine.execute_spin(bet, spin_type)
   ↓
8. 返回 JSON 回應:
   {
       "msgid": "eStateRecall",
       "status_code": "kSuccess",
       "result": {
           "initial_board": [...],
           "final_board": [...],
           "win": 1000,
           "total_win": 1000,
           ...
       }
   }
   ↓
9. 前端 dispatch_msg() 接收並解析 JSON
   ↓
10. 存儲結果到 Data.Library.localServerSpinResult
    ↓
11. 調用 action_dispatch(eStateRecall) 觸發遊戲更新
    ↓
12. 遊戲顯示結果（滾輪動畫、獲勝畫面等）
```

---

## ✅ 測試步驟

### 1. 驗證 Spin Server 已啟動

在終端中應該看到:
```
============================================================
🎮 好運咚咚 Spin Server
============================================================
🚀 啟動中...
✅ 遊戲引擎初始化成功！
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 2. 開啟遊戲

瀏覽器開啟: `http://localhost:7456/?localServer=true`

### 3. 檢查初始化日誌

在瀏覽器 Console 中應該看到:
```
[DEBUG] URL Search Params: ?localServer=true
[DEBUG] isLocalServerMode: true
[ProtoConsole] 🌐 LocalServer 模式：使用 Spin Server API
[DEBUG] LocalServer mode - creating WebSocket to local Spin Server
[DEBUG] WebSocket URL: ws://localhost:8000/ws
[DEBUG] Creating WebSocket connection to Spin Server
[DEBUG] WebSocket connected, readyState: 1
```

### 4. 按下 Spin 按鈕

### 5. 檢查前端 Console 日誌

應該看到:
```
*netlog* -> STATEConsole.CurState : K_SPIN
[DEBUG] LocalServer mode - sending JSON: {...}
[DEBUG] Sending bet: 50 (betIndex: 0, rateIndex: 0)
[DEBUG] Received JSON message: eStateRecall
[DEBUG] State recall received, status: kSuccess
[DEBUG] Processing spin result
[DEBUG] StateRecall in LocalServer mode
```

### 6. 檢查 Spin Server 終端日誌

應該看到:
```
INFO:     127.0.0.1:xxxxx - "WebSocket /ws" [accepted]
INFO:__main__:🔌 WebSocket 連接建立: Address(host='127.0.0.1', port=xxxxx)
INFO:     connection open
INFO:__main__:📨 收到 WebSocket 訊息: eStateCall
INFO:__main__:🎰 執行 Spin: bet=50, type=normal
INFO:__main__:✅ Spin 完成 - Win: 1000
```

### 7. 驗證遊戲行為

- ✅ 滾輪開始旋轉
- ✅ 滾輪停止並顯示結果
- ✅ 獲勝金額正確顯示（如果有獲勝）
- ✅ 餘額正確更新
- ✅ 無錯誤訊息

---

## 🐛 可能的問題

### 問題 1: 仍然出現 `'text'` 錯誤

**原因**: 前端代碼未刷新或編譯未完成

**解決**:
1. 強制刷新瀏覽器（Ctrl + Shift + R）
2. 清除瀏覽器快取
3. 檢查 Cocos Creator 是否已重新編譯

---

### 問題 2: 滾輪不轉動

**原因**: Spin 結果未正確處理

**檢查**:
1. Console 中是否有 `[DEBUG] Processing spin result`
2. `Data.Library.localServerSpinResult` 是否有數據
3. 可能需要在 `StateConsole.ts` 中添加 LocalServer 結果處理邏輯

**下一步**: 檢查 `StateConsole.ts` 的 Spin 結果處理流程

---

### 問題 3: JSON 解析錯誤

**原因**: 訊息格式不匹配

**檢查**:
1. Spin Server 返回的 JSON 格式
2. 前端期望的欄位名稱
3. 是否需要格式轉換

---

## 📊 測試結果記錄

### 測試環境
- Spin Server: http://localhost:8000
- 遊戲 URL: http://localhost:7456/?localServer=true
- 測試時間: [待填寫]

### 測試結果

| 測試項目 | 預期結果 | 實際結果 | 狀態 |
|---------|---------|---------|------|
| WebSocket 連接 | 成功建立連接 | [待測試] | ⏳ |
| JSON 訊息發送 | 無錯誤 | [待測試] | ⏳ |
| JSON 訊息接收 | 正確解析 | [待測試] | ⏳ |
| Spin 結果處理 | 正確存儲 | [待測試] | ⏳ |
| 滾輪動畫 | 正常播放 | [待測試] | ⏳ |
| 獲勝顯示 | 正確顯示 | [待測試] | ⏳ |
| 餘額更新 | 正確更新 | [待測試] | ⏳ |

---

## 📚 相關文檔

- [LocalServer-InitialBoard-Complete-Report.md](LocalServer-InitialBoard-Complete-Report.md) - 初始盤面實現
- [LocalServer-SpinServer-Integration.md](LocalServer-SpinServer-Integration.md) - Spin Server 整合
- [LocalServer-Quick-Reference.md](LocalServer-Quick-Reference.md) - 快速參考

---

## 🎯 下一步

1. **立即測試**: 按照上述測試步驟驗證功能
2. **記錄結果**: 填寫測試結果表格
3. **處理問題**: 如果有錯誤，根據「可能的問題」章節排查
4. **完善功能**: 如果需要，添加 LocalServer 結果處理邏輯
5. **更新文檔**: 記錄最終實現細節

---

**實現者**: GitHub Copilot  
**審查狀態**: ⏳ 待測試驗證
