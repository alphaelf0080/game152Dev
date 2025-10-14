# 簡化的 Protobuf 訊息定義（用於 LocalServer WebSocket）
# 不使用完整的 game.proto，僅定義必要的訊息結構

from dataclasses import dataclass
from typing import Optional
import struct

# 訊息 ID 定義
class EMSGID:
    eLoginCall = 100
    eLoginRecall = 101
    eResultCall = 106
    eResultRecall = 107
    eStateCall = 112
    eStateRecall = 113

# 狀態碼
class StatusCode:
    kSuccess = 0
    kInvalid = 1
    kOffline = 2
    kNoEnoughCredit = 3

class ESTATEID:
    K_IDLE = 0
    K_SPIN = 1

@dataclass
class Header:
    """Protobuf Header"""
    msgid: int
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        # 簡化版本：field_number=1, wire_type=0 (varint)
        # Tag = (field_number << 3) | wire_type = (1 << 3) | 0 = 8
        data = bytearray()
        data.append(8)  # Tag
        data.extend(self._encode_varint(self.msgid))
        return bytes(data)
    
    @staticmethod
    def _encode_varint(value: int) -> bytes:
        """編碼 varint"""
        result = bytearray()
        while value > 127:
            result.append((value & 127) | 128)
            value >>= 7
        result.append(value & 127)
        return bytes(result)

@dataclass
class LoginRecall:
    """登入回應"""
    msgid: int = EMSGID.eLoginRecall
    status_code: int = StatusCode.kSuccess
    token: Optional[str] = ""
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        data = bytearray()
        
        # Field 1: msgid (varint)
        data.append((1 << 3) | 0)  # Tag: field=1, wire_type=0
        data.extend(Header._encode_varint(self.msgid))
        
        # Field 2: status_code (varint)
        data.append((2 << 3) | 0)  # Tag: field=2, wire_type=0
        data.extend(Header._encode_varint(self.status_code))
        
        # Field 3: token (string) - optional
        if self.token:
            token_bytes = self.token.encode('utf-8')
            data.append((3 << 3) | 2)  # Tag: field=3, wire_type=2 (length-delimited)
            data.extend(Header._encode_varint(len(token_bytes)))
            data.extend(token_bytes)
        
        return bytes(data)

@dataclass
class StateRecall:
    """狀態回應"""
    msgid: int = EMSGID.eStateRecall
    status_code: int = StatusCode.kSuccess
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        data = bytearray()
        
        # Field 1: msgid (varint)
        data.append((1 << 3) | 0)
        data.extend(Header._encode_varint(self.msgid))
        
        # Field 2: status_code (varint)
        data.append((2 << 3) | 0)
        data.extend(Header._encode_varint(self.status_code))
        
        return bytes(data)

@dataclass
class SlotResult:
    """遊戲結果（最小版本）"""
    rng: list
    credit: int = 0
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
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

@dataclass
class ResultRecall:
    """結果回應（最小版本）"""
    msgid: int = EMSGID.eResultRecall
    status_code: int = StatusCode.kSuccess
    result: Optional['SlotResult'] = None
    player_cent: int = 0
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        data = bytearray()
        
        # Field 1: msgid (varint)
        data.append((1 << 3) | 0)
        data.extend(Header._encode_varint(self.msgid))
        
        # Field 2: status_code (varint)
        data.append((2 << 3) | 0)
        data.extend(Header._encode_varint(self.status_code))
        
        # Field 3: result (embedded message) - optional
        if self.result:
            result_bytes = self.result.SerializeToString()
            data.append((3 << 3) | 2)  # Tag: field=3, wire_type=2 (length-delimited)
            data.extend(Header._encode_varint(len(result_bytes)))
            data.extend(result_bytes)
        
        # Field 4: player_cent (uint64) - optional
        if self.player_cent > 0:
            data.append((4 << 3) | 0)
            data.extend(Header._encode_varint(self.player_cent))
        
        return bytes(data)

def parse_protobuf_message(data: bytes) -> dict:
    """解析前端發送的 protobuf 訊息（簡化版本）"""
    result = {}
    i = 0
    
    while i < len(data):
        # 讀取 tag
        tag = data[i]
        i += 1
        
        field_number = tag >> 3
        wire_type = tag & 7
        
        if wire_type == 0:  # varint
            value, bytes_read = _decode_varint(data[i:])
            i += bytes_read
            
            # 根據 field_number 映射
            if field_number == 1:
                result['msgid'] = value
            elif field_number == 2:
                result['token'] = value
            elif field_number == 3:
                result['stateid'] = value
            elif field_number == 4:
                result['reserved'] = value
                
        elif wire_type == 2:  # length-delimited (string/bytes)
            length, bytes_read = _decode_varint(data[i:])
            i += bytes_read
            value = data[i:i+length]
            i += length
            
            # 嘗試解碼為字串
            try:
                value_str = value.decode('utf-8')
                if field_number == 2:
                    result['token'] = value_str
                elif field_number == 4:
                    result['machine_id'] = value_str
                elif field_number == 2:
                    result['member_id'] = value_str
                elif field_number == 3:
                    result['password'] = value_str
            except:
                result[f'field_{field_number}'] = value
        else:
            # 跳過不支援的 wire type
            break
    
    return result

def _decode_varint(data: bytes) -> tuple:
    """解碼 varint，返回 (value, bytes_read)"""
    value = 0
    shift = 0
    bytes_read = 0
    
    for byte in data:
        bytes_read += 1
        value |= (byte & 127) << shift
        if not (byte & 128):
            break
        shift += 7
    
    return value, bytes_read

# 測試函數
if __name__ == "__main__":
    # 測試 LoginRecall
    login_recall = LoginRecall(
        msgid=EMSGID.eLoginRecall,
        status_code=StatusCode.kSuccess,
        token="test_token"
    )
    data = login_recall.SerializeToString()
    print(f"LoginRecall bytes: {data.hex()}")
    print(f"Length: {len(data)}")
    
    # 測試 StateRecall
    state_recall = StateRecall(
        msgid=EMSGID.eStateRecall,
        status_code=StatusCode.kSuccess
    )
    data = state_recall.SerializeToString()
    print(f"StateRecall bytes: {data.hex()}")
    print(f"Length: {len(data)}")
