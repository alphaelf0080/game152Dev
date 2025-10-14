# 簡化的 Protobuf 訊息定義（用於 LocalServer WebSocket）
# 不使用完整的 game.proto，僅定義必要的訊息結構

from dataclasses import dataclass
from typing import Optional
import struct

# 訊息 ID 定義
class EMSGID:
    eLoginCall = 100
    eLoginRecall = 101
    eConfigCall = 102
    eConfigRecall = 103
    eStripsCall = 104
    eStripsRecall = 105
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
class WinLine:
    """中獎線數據結構"""
    win_line_type: int = 0  # field 1 (required) - 0: kCommon, 1: kXTotalBet, 2: kXTotalBetTrigger
    line_no: int = -1       # field 2 (required)
    symbol_id: int = 0      # field 3 (required)
    pos: list = None        # field 4 (repeated int32) - 中獎位置
    credit: int = 0         # field 5 (required)
    multiplier: int = 1     # field 6 (required)
    credit_long: int = 0    # field 7 (optional uint64)
    
    def __post_init__(self):
        if self.pos is None:
            self.pos = []
        if self.credit_long == 0:
            self.credit_long = self.credit
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        data = bytearray()
        
        # Field 1: win_line_type (enum/int32) - REQUIRED
        data.append((1 << 3) | 0)
        data.extend(Header._encode_varint(self.win_line_type))
        
        # Field 2: line_no (int32) - REQUIRED
        data.append((2 << 3) | 0)
        data.extend(Header._encode_varint(self.line_no))
        
        # Field 3: symbol_id (int32) - REQUIRED
        data.append((3 << 3) | 0)
        data.extend(Header._encode_varint(self.symbol_id))
        
        # Field 4: pos (repeated int32)
        for value in self.pos:
            data.append((4 << 3) | 0)
            data.extend(Header._encode_varint(value))
        
        # Field 5: credit (int32) - REQUIRED
        data.append((5 << 3) | 0)
        data.extend(Header._encode_varint(self.credit))
        
        # Field 6: multiplier (int32) - REQUIRED
        data.append((6 << 3) | 0)
        data.extend(Header._encode_varint(self.multiplier))
        
        # Field 7: credit_long (uint64) - optional
        if self.credit_long > 0:
            data.append((7 << 3) | 0)
            data.extend(Header._encode_varint(self.credit_long))
        
        return bytes(data)

@dataclass
class SlotResult:
    """遊戲結果（支援 243 ways）"""
    module_id: str = "BS"      # field 1 (required) - 基礎遊戲模組 ID
    credit: int = 0            # field 2 (required)
    rng: list = None           # field 3 (repeated int32)
    win_line_group: list = None # field 4 (repeated WinLine) - 中獎線組
    
    def __post_init__(self):
        if self.rng is None:
            self.rng = []
        if self.win_line_group is None:
            self.win_line_group = []
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        data = bytearray()
        
        # Field 1: module_id (string) - REQUIRED
        module_id_bytes = self.module_id.encode('utf-8')
        data.append((1 << 3) | 2)  # Tag: field=1, wire_type=2
        data.extend(Header._encode_varint(len(module_id_bytes)))
        data.extend(module_id_bytes)
        
        # Field 2: credit (uint64) - REQUIRED
        data.append((2 << 3) | 0)
        data.extend(Header._encode_varint(self.credit))
        
        # Field 3: rng (repeated int32)
        for value in self.rng:
            data.append((3 << 3) | 0)  # Tag: field=3, wire_type=0
            data.extend(Header._encode_varint(value))
        
        # Field 4: win_line_group (repeated WinLine)
        for win_line in self.win_line_group:
            win_line_bytes = win_line.SerializeToString()
            data.append((4 << 3) | 2)  # Tag: field=4, wire_type=2 (length-delimited)
            data.extend(Header._encode_varint(len(win_line_bytes)))
            data.extend(win_line_bytes)
        
        return bytes(data)

@dataclass
class ResultRecall:
    """結果回應（最小版本）"""
    msgid: int = EMSGID.eResultRecall
    status_code: int = StatusCode.kSuccess
    result: Optional['SlotResult'] = None
    player_cent: int = 0
    next_module: str = "BS"  # field 5 - 下一個模組 ID（基礎遊戲）
    
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
        
        # Field 5: next_module (string) - optional
        if self.next_module:
            next_module_bytes = self.next_module.encode('utf-8')
            data.append((5 << 3) | 2)  # Tag: field=5, wire_type=2
            data.extend(Header._encode_varint(len(next_module_bytes)))
            data.extend(next_module_bytes)
        
        return bytes(data)

@dataclass
class ConfigRecall:
    """配置回應（最小版本）"""
    msgid: int = EMSGID.eConfigRecall
    status_code: int = StatusCode.kSuccess
    bet_5_arr: list = None  # field 3
    line_5_arr: list = None  # field 4
    rate_arr: list = None  # field 5
    rate_default_index: int = 0  # field 6
    player_cent: int = 1000000  # field 9
    
    def __post_init__(self):
        if self.bet_5_arr is None:
            self.bet_5_arr = [1, 2, 5, 10, 20]
        if self.line_5_arr is None:
            self.line_5_arr = [30, 30, 30, 30, 30]
        if self.rate_arr is None:
            self.rate_arr = [1, 10, 25, 50, 100]
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        data = bytearray()
        
        # Field 1: msgid (varint)
        data.append((1 << 3) | 0)
        data.extend(Header._encode_varint(self.msgid))
        
        # Field 2: status_code (varint)
        data.append((2 << 3) | 0)
        data.extend(Header._encode_varint(self.status_code))
        
        # Field 3: bet_5_arr (repeated int32)
        for value in self.bet_5_arr:
            data.append((3 << 3) | 0)
            data.extend(Header._encode_varint(value))
        
        # Field 4: line_5_arr (repeated int32)
        for value in self.line_5_arr:
            data.append((4 << 3) | 0)
            data.extend(Header._encode_varint(value))
        
        # Field 5: rate_arr (repeated int32)
        for value in self.rate_arr:
            data.append((5 << 3) | 0)
            data.extend(Header._encode_varint(value))
        
        # Field 6: rate_default_index (int32) - optional
        if self.rate_default_index >= 0:
            data.append((6 << 3) | 0)
            data.extend(Header._encode_varint(self.rate_default_index))
        
        # Field 9: player_cent (uint64)
        if self.player_cent > 0:
            data.append((9 << 3) | 0)
            data.extend(Header._encode_varint(self.player_cent))
        
        return bytes(data)

@dataclass
class StripsRecall:
    """滾輪條帶回應"""
    msgid: int = EMSGID.eStripsRecall
    status_code: int = StatusCode.kSuccess
    module_id: str = "BS"  # 基礎遊戲模組 ID
    strips: list = None  # field 3: repeated StripData
    
    def __post_init__(self):
        if self.strips is None:
            # 預設滾輪條帶（5個滾輪）
            self.strips = [
                [4, 5, 6, 7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 9, 
                 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7],
                [5, 6, 7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 9,
                 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8],
                [6, 7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 9,
                 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                [7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 7, 8,
                 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 4, 5, 6],
                [8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 7, 8, 1,
                 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 0]
            ]
    
    def SerializeToString(self) -> bytes:
        """序列化為 protobuf 格式"""
        data = bytearray()
        
        # Field 1: msgid (varint)
        data.append((1 << 3) | 0)
        data.extend(Header._encode_varint(self.msgid))
        
        # Field 2: status_code (varint)
        data.append((2 << 3) | 0)
        data.extend(Header._encode_varint(self.status_code))
        
        # Field 3: allstrips (repeated StripData)
        # 構建 StripData 訊息
        strip_data = bytearray()
        
        # Field 1 of StripData: module_id (string) - REQUIRED!
        module_id_bytes = self.module_id.encode('utf-8')
        strip_data.append((1 << 3) | 2)  # Tag: field=1, wire_type=2
        strip_data.extend(Header._encode_varint(len(module_id_bytes)))
        strip_data.extend(module_id_bytes)
        
        # Field 2 of StripData: strips (repeated Strip)
        for strip in self.strips:
            # 構建 Strip 訊息
            strip_msg = bytearray()
            # Field 1 of Strip: strip_arr (repeated int32)
            for symbol in strip:
                strip_msg.append((1 << 3) | 0)
                strip_msg.extend(Header._encode_varint(symbol))
            
            # 添加 Strip 到 StripData
            strip_data.append((2 << 3) | 2)  # Tag: field=2, wire_type=2
            strip_data.extend(Header._encode_varint(len(strip_msg)))
            strip_data.extend(strip_msg)
        
        # 將 StripData 作為嵌套訊息添加
        data.append((3 << 3) | 2)  # Tag: field=3, wire_type=2
        data.extend(Header._encode_varint(len(strip_data)))
        data.extend(strip_data)
        
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
