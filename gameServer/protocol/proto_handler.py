"""
協議處理器 - 處理與 game.proto 相關的消息編碼和解碼
實現好運咚咚遊戲的協議通信功能 (簡化版本)
"""

from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict
import struct
import json
from enum import Enum

class EMSGID(Enum):
    """消息ID枚舉 - 對應 game.proto 中的定義"""
    eLoginCall = 100
    eLoginRecall = 101
    eConfigCall = 102
    eConfigRecall = 103
    eStripsCall = 104
    eStripsRecall = 105
    eResultCall = 106
    eResultRecall = 107
    eOptionCall = 108
    eOptionRecall = 109
    eCheckCall = 110
    eCheckRecall = 111
    eStateCall = 112
    eStateRecall = 113
    eSuicideCall = 114
    eDataCall = 115
    eDataRecall = 116
    eCentInAsk = 200
    eCentInReask = 201
    eJackpotInfo = 202
    eJackpotNotify = 203
    eMemberInfoAsk = 301

class StatusCode(Enum):
    """狀態碼枚舉"""
    kSuccess = 0
    kInvalid = 1
    kOffline = 2
    kNoEnoughCredit = 3
    kHostError = 4
    kOutOfDate = 5
    kFreeGameEnd = 6
    kNoMoreBets = 7

@dataclass
class Header:
    """消息頭"""
    msgid: EMSGID

@dataclass
class LoginCall:
    """登入請求"""
    msgid: EMSGID
    member_id: str
    password: str
    machine_id: str
    token: Optional[str] = None

@dataclass
class LoginRecall:
    """登入回應"""
    msgid: EMSGID
    status_code: StatusCode
    token: Optional[str] = None

@dataclass
class WinLine:
    """贏分線數據"""
    line_no: int
    symbol_id: int
    positions: List[int]
    credit: int
    multiplier: int
    credit_long: Optional[int] = None

@dataclass
class SlotResult:
    """老虎機結果"""
    module_id: str
    credit: int
    rng: List[int]
    win_line_group: List[WinLine]
    multiplier_alone: Optional[int] = None
    random_syb_pattern: List[int] = None
    strip_index: Optional[int] = None
    # 添加其他必要字段...

@dataclass
class ResultCall:
    """結果請求"""
    msgid: EMSGID
    token: str
    module_id: str
    bet: int
    line: int
    rate: int
    orientation: int = 1
    module_command: List[Dict] = None

@dataclass
class ResultRecall:
    """結果回應"""
    msgid: EMSGID
    status_code: StatusCode
    slot_result: Optional[SlotResult] = None

class ProtoHandler:
    """協議處理器類"""
    
    def __init__(self):
        """初始化協議處理器"""
        self.encoding = 'utf-8'
        
    def encode_message(self, message_obj: Any) -> bytes:
        """
        編碼消息為二進制格式 (簡化版本)
        實際應用中會使用 protobuf 編碼
        """
        try:
            # 轉換為字典
            if hasattr(message_obj, '__dict__'):
                message_dict = asdict(message_obj) if hasattr(message_obj, '__dataclass_fields__') else message_obj.__dict__
            else:
                message_dict = message_obj
            
            # 處理枚舉值
            message_dict = self._serialize_enums(message_dict)
            
            # 轉換為 JSON 字符串
            json_str = json.dumps(message_dict, ensure_ascii=False)
            
            # 編碼為字節
            json_bytes = json_str.encode(self.encoding)
            
            # 添加長度前綴 (4字節)
            length = len(json_bytes)
            length_bytes = struct.pack('<I', length)
            
            return length_bytes + json_bytes
            
        except Exception as e:
            raise ValueError(f"消息編碼失敗: {e}")
    
    def decode_message(self, data: bytes, message_type: type) -> Any:
        """
        解碼二進制消息 (簡化版本)
        實際應用中會使用 protobuf 解碼
        """
        try:
            # 讀取長度前綴
            if len(data) < 4:
                raise ValueError("數據長度不足")
            
            length = struct.unpack('<I', data[:4])[0]
            
            if len(data) < 4 + length:
                raise ValueError("數據不完整")
            
            # 提取 JSON 數據
            json_bytes = data[4:4+length]
            json_str = json_bytes.decode(self.encoding)
            
            # 解析 JSON
            message_dict = json.loads(json_str)
            
            # 反序列化枚舉
            message_dict = self._deserialize_enums(message_dict, message_type)
            
            # 創建對象
            if hasattr(message_type, '__dataclass_fields__'):
                return message_type(**message_dict)
            else:
                obj = message_type()
                for key, value in message_dict.items():
                    setattr(obj, key, value)
                return obj
                
        except Exception as e:
            raise ValueError(f"消息解碼失敗: {e}")
    
    def _serialize_enums(self, obj: Any) -> Any:
        """序列化枚舉值"""
        if isinstance(obj, dict):
            return {key: self._serialize_enums(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self._serialize_enums(item) for item in obj]
        elif isinstance(obj, Enum):
            return obj.value
        else:
            return obj
    
    def _deserialize_enums(self, obj: Any, target_type: type) -> Any:
        """反序列化枚舉值"""
        if isinstance(obj, dict) and hasattr(target_type, '__dataclass_fields__'):
            fields = target_type.__dataclass_fields__
            result = {}
            
            for key, value in obj.items():
                if key in fields:
                    field_type = fields[key].type
                    if hasattr(field_type, '__origin__'):  # 處理泛型類型
                        result[key] = value
                    elif issubclass(field_type, Enum):
                        result[key] = field_type(value)
                    else:
                        result[key] = value
                else:
                    result[key] = value
            
            return result
        else:
            return obj
    
    def create_login_call(self, member_id: str, password: str, machine_id: str, token: str = None) -> LoginCall:
        """創建登入請求"""
        return LoginCall(
            msgid=EMSGID.eLoginCall,
            member_id=member_id,
            password=password,
            machine_id=machine_id,
            token=token
        )
    
    def create_login_recall(self, status_code: StatusCode, token: str = None) -> LoginRecall:
        """創建登入回應"""
        return LoginRecall(
            msgid=EMSGID.eLoginRecall,
            status_code=status_code,
            token=token
        )
    
    def create_result_call(self, token: str, module_id: str, bet: int, line: int, rate: int,
                          module_commands: List[Dict] = None) -> ResultCall:
        """創建結果請求"""
        return ResultCall(
            msgid=EMSGID.eResultCall,
            token=token,
            module_id=module_id,
            bet=bet,
            line=line,
            rate=rate,
            module_command=module_commands or []
        )
    
    def create_result_recall(self, status_code: StatusCode, slot_result: SlotResult = None) -> ResultRecall:
        """創建結果回應"""
        return ResultRecall(
            msgid=EMSGID.eResultRecall,
            status_code=status_code,
            slot_result=slot_result
        )
    
    def create_slot_result(self, module_id: str, credit: int, rng: List[int], 
                          win_lines: List[WinLine], **kwargs) -> SlotResult:
        """創建老虎機結果"""
        return SlotResult(
            module_id=module_id,
            credit=credit,
            rng=rng,
            win_line_group=win_lines,
            **kwargs
        )
    
    def create_win_line(self, line_no: int, symbol_id: int, positions: List[int], 
                       credit: int, multiplier: int = 1) -> WinLine:
        """創建贏分線"""
        return WinLine(
            line_no=line_no,
            symbol_id=symbol_id,
            positions=positions,
            credit=credit,
            multiplier=multiplier
        )
    
    def parse_module_command(self, command_data: Dict[str, Any]) -> Dict[str, Any]:
        """解析模組命令"""
        command_id = command_data.get("id", "kSpinIndex")
        
        if command_id == "kSpinIndex":
            return {
                "type": "spin_index",
                "spin_idx": command_data.get("spin_idx", 0)
            }
        elif command_id == "kSelectSubGame":
            return {
                "type": "select_subgame",
                "sub_game_id": command_data.get("sub_game_id", [])
            }
        elif command_id == "kExtraData":
            return {
                "type": "extra_data",
                "index": command_data.get("index", 0),
                "data": command_data.get("data", [])
            }
        else:
            return {
                "type": "unknown",
                "raw_data": command_data
            }
    
    def create_spin_index_command(self, spin_idx: int = 0) -> Dict[str, Any]:
        """創建旋轉索引命令"""
        return {
            "id": "kSpinIndex",
            "spin_idx": spin_idx
        }
    
    def validate_message(self, message_obj: Any, expected_type: type) -> bool:
        """驗證消息類型"""
        return isinstance(message_obj, expected_type)
    
    def get_message_size(self, encoded_data: bytes) -> int:
        """獲取消息大小"""
        if len(encoded_data) < 4:
            return 0
        return struct.unpack('<I', encoded_data[:4])[0]
    
    def is_complete_message(self, buffer: bytes) -> bool:
        """檢查緩衝區是否包含完整消息"""
        if len(buffer) < 4:
            return False
        
        expected_length = self.get_message_size(buffer)
        return len(buffer) >= 4 + expected_length
    
    def extract_complete_messages(self, buffer: bytes) -> List[bytes]:
        """從緩衝區提取所有完整消息"""
        messages = []
        offset = 0
        
        while offset < len(buffer):
            remaining = buffer[offset:]
            
            if not self.is_complete_message(remaining):
                break
            
            message_length = self.get_message_size(remaining)
            message_data = remaining[:4 + message_length]
            messages.append(message_data)
            
            offset += 4 + message_length
        
        return messages