# LocalServer Protobuf 通訊狀態報告

## 📅 更新時間
2025-01-14 (當前進度)

## ✅ 已完成的工作

### 1. 前端修改 (ProtoConsole.ts)
- ✅ 統一使用 Protobuf 解析（移除 LocalServer 的 JSON 特殊處理）
- ✅ `dispatch_msg`: 所有模式都使用 `Proto.decodeHeader(uint8)`
- ✅ `StateRecall`: 移除 LocalServer 的 early return
- ✅ `ResultCall`: 移除 HTTP API 調用，統一使用 WebSocket

### 2. 後端修改 (spin_server.py)
- ✅ 導入 `simple_proto` 模組（EMSGID, StatusCode, ESTATEID, LoginRecall, StateRecall）
- ✅ WebSocket 端點改為 `receive()` 以支援 bytes 和 text 訊息
- ✅ 實現 LoginCall/LoginRecall Protobuf 處理
- ✅ 實現 StateCall (K_SPIN) 的 Spin 執行邏輯
- ✅ 發送 StateRecall Protobuf 回應

### 3. 手動 Protobuf 實現 (simple_proto.py)
- ✅ EMSGID 類：eLoginCall(100), eLoginRecall(101), eStateCall(112), eStateRecall(113)
- ✅ StatusCode 類：kSuccess(0), kInvalid(1), kOffline(2), kNoEnoughCredit(3)
- ✅ ESTATEID 類：K_IDLE(0), K_SPIN(1)
- ✅ LoginRecall.SerializeToString()
- ✅ StateRecall.SerializeToString()
- ✅ parse_protobuf_message() - 解析前端發送的訊息
- ✅ varint 編解碼函數

## ⚠️ 當前問題

### 問題 1: "reel 無初始化"
**現象**: 前端無法正常顯示遊戲畫面，reel（滾輪）沒有初始化

**原因分析**:
遊戲流程需要完整的 **ResultRecall** 訊息才能初始化 reel：

```
1. Frontend: LoginCall → Backend: LoginRecall ✅
2. Frontend: StateCall (K_SPIN) → Backend: StateRecall ✅
3. Frontend: ResultCall → Backend: ResultRecall ❌ (未實現)
4. Frontend: 使用 ResultRecall 中的遊戲結果初始化 reel
```

**缺失部分**: 
- Backend 沒有實現 `ResultCall` 處理
- Backend 沒有實現 `ResultRecall` Protobuf 序列化
- `simple_proto.py` 缺少 `ResultRecall` 訊息類

### 問題 2: ResultRecall 結構複雜
從 game.proto 中的定義：

```protobuf
message ResultRecall {
  required EMSGID      msgid                  = 1 [default=eResultRecall];
  required StatusCode status_code            = 2;
  optional SlotResult  result                 = 3;  // ⚠️ 複雜的嵌套結構
  optional uint64      player_cent            = 4;
  optional string      next_module            = 5;
  // ... 更多複雜字段
}

message SlotResult {
  repeated uint32 rng = 1;  // 滾輪結果
  optional uint64 credit = 2;  // 贏得分數
  repeated WinGroup win_group = 3;  // 中獎組合
  repeated WinBonusGroup win_bonus_group = 4;
  // ... 更多字段
}
```

**挑戰**: 
- SlotResult 包含大量嵌套結構（WinGroup, WinBonusGroup 等）
- 手動實現 Protobuf 序列化非常困難
- 需要正確處理 repeated 欄位和 optional 欄位

## 🎯 解決方案

### 方案 A: 完整實現 ResultRecall Protobuf（困難）
**優點**: 完全符合原始協議
**缺點**: 實現複雜，需要大量代碼

**步驟**:
1. 在 `simple_proto.py` 中實現 `SlotResult` 類
2. 實現 `WinGroup`, `WinBonusGroup` 等嵌套類
3. 實現 `ResultRecall` 類的 `SerializeToString()`
4. 在 `spin_server.py` 中處理 `ResultCall` 並發送 `ResultRecall`

### 方案 B: 使用最小化 ResultRecall（推薦 ⭐）
只實現前端初始化 reel 所需的最小字段：

```python
class ResultRecall:
    msgid: int = EMSGID.eResultRecall  # field 1
    status_code: int = StatusCode.kSuccess  # field 2
    result: SlotResult  # field 3 (最小版本)
    player_cent: int = 0  # field 4

class SlotResult:
    rng: list[int]  # field 1 - 滾輪結果（最重要！）
    credit: int = 0  # field 2 - 贏得分數
    # 其他字段暫時省略
```

**優點**: 
- 實現相對簡單
- 滿足最基本需求（reel 初始化）
- 可以逐步擴展

**缺點**: 
- 可能缺少某些遊戲功能（如特殊獎勵）

### 方案 C: 回退到 JSON 格式（最簡單）
修改前端，在 LocalServer 模式下使用 JSON 而非 Protobuf：

**步驟**:
1. 前端 `dispatch_msg` 添加 LocalServer 特殊處理
2. 後端發送 JSON 格式的遊戲結果
3. 前端手動調用 `FillWinData` 處理結果

**優點**: 
- 實現最快
- 可讀性好，便於調試

**缺點**: 
- 與正常模式不一致
- 需要維護兩套邏輯

## 📋 下一步行動計劃

### 推薦: 方案 B - 最小化 ResultRecall

#### Step 1: 實現 `SlotResult` 類（最小版本）
```python
# 在 simple_proto.py 中添加
class SlotResult:
    def __init__(self, rng: list[int], credit: int = 0):
        self.rng = rng
        self.credit = credit
    
    def SerializeToString(self) -> bytes:
        data = bytearray()
        
        # Field 1: rng (repeated uint32)
        for value in self.rng:
            data.append((1 << 3) | 0)  # Tag: field=1, wire_type=0
            data.extend(Header._encode_varint(value))
        
        # Field 2: credit (uint64)
        if self.credit > 0:
            data.append((2 << 3) | 0)
            data.extend(Header._encode_varint(self.credit))
        
        return bytes(data)
```

#### Step 2: 實現 `ResultRecall` 類
```python
class ResultRecall:
    def __init__(self, msgid: int, status_code: int, result: SlotResult, player_cent: int = 0):
        self.msgid = msgid
        self.status_code = status_code
        self.result = result
        self.player_cent = player_cent
    
    def SerializeToString(self) -> bytes:
        data = bytearray()
        
        # Field 1: msgid
        data.append((1 << 3) | 0)
        data.extend(Header._encode_varint(self.msgid))
        
        # Field 2: status_code
        data.append((2 << 3) | 0)
        data.extend(Header._encode_varint(self.status_code))
        
        # Field 3: result (embedded message)
        result_bytes = self.result.SerializeToString()
        data.append((3 << 3) | 2)  # wire_type=2 for embedded message
        data.extend(Header._encode_varint(len(result_bytes)))
        data.extend(result_bytes)
        
        # Field 4: player_cent (optional)
        if self.player_cent > 0:
            data.append((4 << 3) | 0)
            data.extend(Header._encode_varint(self.player_cent))
        
        return bytes(data)
```

#### Step 3: 在 spin_server.py 中處理 ResultCall
```python
# 在 WebSocket 端點中添加
elif msgid == EMSGID.eResultCall:  # 106
    logger.info("🎮 處理 ResultCall")
    
    if last_spin_result is None:
        logger.error("❌ 沒有可用的 Spin 結果")
        # 發送錯誤回應
        result_recall = ResultRecall(
            msgid=EMSGID.eResultRecall,
            status_code=StatusCode.kInvalid,
            result=SlotResult(rng=[], credit=0),
            player_cent=0
        )
    else:
        # 使用存儲的 Spin 結果
        slot_result = SlotResult(
            rng=last_spin_result['reel_results'],
            credit=last_spin_result['total_win']
        )
        result_recall = ResultRecall(
            msgid=EMSGID.eResultRecall,
            status_code=StatusCode.kSuccess,
            result=slot_result,
            player_cent=last_spin_result.get('player_credit', 1000000)
        )
    
    response_data = result_recall.SerializeToString()
    await websocket.send_bytes(response_data)
    logger.info(f"✅ ResultRecall 發送 - {len(response_data)} bytes")
```

#### Step 4: 在 StateCall 中存儲結果
```python
# 在執行 Spin 後添加
result = game_engine.execute_spin(bet, spin_type_enum)
result_data = simple_exporter.export_spin_result(result)

# 存儲結果供 ResultCall 使用
last_spin_result = result_data

# 發送 StateRecall...
```

#### Step 5: 添加 ResultCall msgid
```python
# 在 simple_proto.py 的 EMSGID 類中添加
class EMSGID:
    eLoginCall = 100
    eLoginRecall = 101
    eResultCall = 106
    eResultRecall = 107
    eStateCall = 112
    eStateRecall = 113
```

## 🧪 測試步驟

1. **啟動 Spin Server**
   ```bash
   cd gameServer
   python spin_server.py
   ```

2. **刷新遊戲**
   ```
   http://localhost:7456/?localServer=true
   ```

3. **檢查 Console 日誌**
   - ✅ LoginCall/LoginRecall 成功
   - ✅ StateCall (K_SPIN) 執行
   - ✅ StateRecall 接收
   - ✅ ResultCall 自動發送
   - ✅ ResultRecall 接收並包含遊戲結果
   - ✅ Reel 初始化成功

4. **測試 Spin**
   - 點擊 Spin 按鈕
   - 觀察滾輪是否正常旋轉
   - 檢查是否顯示遊戲結果

## 📚 相關文件
- `/gameServer/spin_server.py` - 後端 WebSocket 伺服器
- `/gameServer/protocol/simple_proto.py` - 手動 Protobuf 實現
- `/pss-on-00152/assets/script/MessageController/ProtoConsole.ts` - 前端 WebSocket 通訊
- `/pss-on-00152/assets/script/LibCreator/libProto/game.proto` - 完整 Protobuf 定義（參考用）

## 💡 技術筆記

### Protobuf Wire Types
- **0 (Varint)**: int32, int64, uint32, uint64, sint32, sint64, bool, enum
- **1 (64-bit)**: fixed64, sfixed64, double
- **2 (Length-delimited)**: string, bytes, embedded messages, packed repeated fields
- **5 (32-bit)**: fixed32, sfixed32, float

### Field Tag 計算
```python
tag = (field_number << 3) | wire_type
```

例如：
- Field 1, Varint: `(1 << 3) | 0 = 8 = 0x08`
- Field 2, String: `(2 << 3) | 2 = 18 = 0x12`
- Field 3, Embedded: `(3 << 3) | 2 = 26 = 0x1A`

### Embedded Message 編碼
```python
# 1. 序列化內嵌訊息
embedded_bytes = inner_message.SerializeToString()

# 2. 寫入 Tag (wire_type=2)
data.append((field_number << 3) | 2)

# 3. 寫入長度 (varint)
data.extend(encode_varint(len(embedded_bytes)))

# 4. 寫入訊息內容
data.extend(embedded_bytes)
```

## 🐛 已知問題

1. **WebSocket 'bytes' KeyError**: ✅ 已修復（改用 `receive()` 並檢查訊息類型）
2. **Reel 無初始化**: ⏳ 進行中（需實現 ResultRecall）
3. **Game.proto 編譯錯誤**: enum kSilver 和 kGold 重複定義（暫不影響，使用手動實現）

## 📈 進度追蹤
- [x] 前端統一使用 Protobuf
- [x] 後端 LoginCall/LoginRecall
- [x] 後端 StateCall/StateRecall
- [ ] 後端 ResultCall/ResultRecall
- [ ] Reel 初始化測試
- [ ] 完整 Spin 流程測試
