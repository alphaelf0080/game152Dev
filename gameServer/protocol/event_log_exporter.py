"""
事件日誌格式 JSON 輸出器
根據 sampleResult.json 的格式輸出遊戲結果
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from pathlib import Path


class EventLogExporter:
    """
    事件日誌格式的遊戲結果輸出器
    
    輸出格式:
    {
        "game_id": "PSS-ON-00152",
        "logs": [
            {
                "event": "connection",
                "message": "Socket connection established.",
                "time": "2025-10-14T10:00:00.000+08:00",
                "serial": 0
            },
            {
                "event": "result",
                "data": { ... },
                "time": "2025-10-14T10:00:01.000+08:00",
                "serial": 1
            }
        ]
    }
    """
    
    def __init__(self, game_id: str = "PSS-ON-00152", start_time: datetime = None):
        """
        初始化事件日誌輸出器
        
        Args:
            game_id: 遊戲 ID
            start_time: 開始時間（用於生成時間戳）
        """
        self.game_id = game_id
        self.start_time = start_time or datetime.now()
        self.serial_counter = 0
        self.logs = []
        
    def add_connection_event(self, message: str = "Socket connection established.") -> None:
        """添加連線事件"""
        event = {
            "event": "connection",
            "message": message,
            "time": self._generate_timestamp(),
            "serial": self.serial_counter
        }
        self.logs.append(event)
        self.serial_counter += 1
        
    def add_disconnection_event(self, message: str = "Connection Closed !!") -> None:
        """添加斷線事件"""
        event = {
            "event": "disconnection",
            "message": message,
            "time": self._generate_timestamp(),
            "serial": self.serial_counter
        }
        self.logs.append(event)
        self.serial_counter += 1
        
    def add_signin_event(self, member_id: str = "robot001", 
                        access_token: str = None) -> None:
        """添加登入請求事件"""
        if access_token is None:
            access_token = self._generate_mock_token()
            
        event = {
            "event": "sendRequest_nodejs_success",
            "url": f"https://dev.iplaystar.net/api/signin?prefix=PS&member_id={member_id}&password=1234&mode=0",
            "statusCode": 200,
            "data": {
                "status_code": 0,
                "access_token": access_token
            },
            "time": self._generate_timestamp(),
            "serial": self.serial_counter
        }
        self.logs.append(event)
        self.serial_counter += 1
        
    def add_result_event(self, game_result: Dict[str, Any], 
                        is_reconnected: bool = False) -> None:
        """
        添加遊戲結果事件
        
        Args:
            game_result: 遊戲結果數據
            is_reconnected: 是否為重連結果（包含更多資訊）
        """
        event_type = "reconnected_Result" if is_reconnected else "result"
        
        # 轉換遊戲結果格式
        data = self._convert_game_result(game_result, is_reconnected)
        
        event = {
            "event": event_type,
            "data": data,
            "time": self._generate_timestamp(),
            "serial": self.serial_counter
        }
        self.logs.append(event)
        self.serial_counter += 1
        
    def _convert_game_result(self, game_result: Dict[str, Any], 
                           is_reconnected: bool = False) -> Dict[str, Any]:
        """
        將內部遊戲結果格式轉換為 sampleResult.json 的格式
        
        Args:
            game_result: 內部遊戲結果
            is_reconnected: 是否為重連結果
            
        Returns:
            轉換後的結果數據
        """
        data = {
            "module_id": game_result.get("module_id", "BS"),
            "credit": game_result.get("player_balance", game_result.get("credit", 0)),
            "rng": game_result.get("rng", game_result.get("strip_positions", [])),
            "win": game_result.get("total_win", game_result.get("win", 0)),
            "next_module": game_result.get("next_module", "BS"),
            "jp_count": game_result.get("jp_count", 0),
            "jp": game_result.get("jp", 0)
        }
        
        # 如果是重連結果，添加額外資訊
        if is_reconnected:
            # winLineGrp
            win_lines = game_result.get("win_lines", [])
            if win_lines:
                data["winLineGrp"] = self._convert_win_lines(win_lines)
            else:
                data["winLineGrp"] = []
                
            # multiplierAlone
            multiplier = game_result.get("multiplier", 1)
            data["multiplierAlone"] = multiplier if multiplier > 1 else None
            
            # mulitplierPattern (注意拼寫：mulitplier)
            multiplier_pattern = game_result.get("multiplier_pattern", [])
            if multiplier_pattern:
                data["mulitplierPattern"] = multiplier_pattern
            else:
                # 生成預設的 1 陣列（20個元素）
                data["mulitplierPattern"] = []
                
            # winBonusGrp
            win_bonus = game_result.get("win_bonus", [])
            if win_bonus:
                data["winBonusGrp"] = self._convert_win_bonus(win_bonus)
            else:
                data["winBonusGrp"] = []
                
        return data
        
    def _convert_win_lines(self, win_lines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """轉換 win_lines 格式"""
        converted = []
        for line in win_lines:
            converted_line = {
                "win_line_type": line.get("win_line_type", 0),
                "line_no": line.get("line_no", -1),
                "symbol_id": line.get("symbol_id", 0),
                "pos": line.get("positions", line.get("pos", [])),
                "credit": line.get("win_amount", line.get("credit", 0)),
                "mul": line.get("multiplier", line.get("mul", 1)),
                "change": line.get("change", False),
                "symbol_id_s": line.get("symbol_id", 0),
                "is_five_line": line.get("is_five_line", False)
            }
            converted.append(converted_line)
        return converted
        
    def _convert_win_bonus(self, win_bonus: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """轉換 win_bonus 格式"""
        converted = []
        for bonus in win_bonus:
            converted_bonus = {
                "module_id": bonus.get("module_id", "FS"),
                "times": bonus.get("times", 0)
            }
            converted.append(converted_bonus)
        return converted
        
    def _generate_timestamp(self, delay_ms: int = 2000) -> str:
        """
        生成時間戳
        
        Args:
            delay_ms: 與上一個事件的間隔（毫秒）
            
        Returns:
            ISO 8601 格式的時間戳
        """
        # 計算當前事件時間
        current_time = self.start_time + timedelta(milliseconds=self.serial_counter * delay_ms)
        
        # 格式化為 ISO 8601 with timezone
        # 格式: 2025-09-19T12:26:47.168+08:00
        timestamp = current_time.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]  # 保留 3 位毫秒
        timestamp += "+08:00"  # 添加時區
        
        return timestamp
        
    def _generate_mock_token(self) -> str:
        """生成模擬的 access token"""
        # 使用時間戳生成唯一 token
        import hashlib
        import base64
        
        content = f"{self.start_time.isoformat()}-{self.serial_counter}"
        token_bytes = hashlib.sha256(content.encode()).digest()
        token = base64.b64encode(token_bytes).decode()[:50]
        
        # 模擬 Laravel 的 token 格式
        mock_token = f"eyJpdiI6InRlc3QiLCJ2YWx1ZSI6Int{{token}}"
        return mock_token
        
    def export_to_json(self, output_path: str, pretty: bool = True) -> str:
        """
        輸出為 JSON 檔案
        
        Args:
            output_path: 輸出路徑
            pretty: 是否格式化輸出
            
        Returns:
            輸出檔案的完整路徑
        """
        # 確保目錄存在
        os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else ".", exist_ok=True)
        
        # 構建完整數據
        output_data = {
            "game_id": self.game_id,
            "logs": self.logs
        }
        
        # 寫入檔案
        with open(output_path, 'w', encoding='utf-8') as f:
            if pretty:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            else:
                json.dump(output_data, f, ensure_ascii=False)
                
        return os.path.abspath(output_path)
        
    def get_json_string(self, pretty: bool = True) -> str:
        """
        獲取 JSON 字串
        
        Args:
            pretty: 是否格式化輸出
            
        Returns:
            JSON 字串
        """
        output_data = {
            "game_id": self.game_id,
            "logs": self.logs
        }
        
        if pretty:
            return json.dumps(output_data, indent=2, ensure_ascii=False)
        else:
            return json.dumps(output_data, ensure_ascii=False)


def export_simulation_to_event_log(results: List[Dict[str, Any]], 
                                   output_path: str,
                                   game_id: str = "PSS-ON-00152",
                                   add_connection_events: bool = True,
                                   reconnect_interval: int = 50) -> str:
    """
    將模擬結果輸出為事件日誌格式
    
    Args:
        results: 遊戲結果列表
        output_path: 輸出路徑
        game_id: 遊戲 ID
        add_connection_events: 是否添加連線/斷線事件
        reconnect_interval: 每隔多少個 spin 進行一次重連
        
    Returns:
        輸出檔案的完整路徑
    """
    exporter = EventLogExporter(game_id=game_id)
    
    # 添加初始登入和連線事件
    if add_connection_events:
        exporter.add_signin_event()
        exporter.add_connection_event()
    
    # 添加遊戲結果
    for i, result in enumerate(results):
        # 每隔一定數量的 spin，模擬斷線重連
        if add_connection_events and i > 0 and i % reconnect_interval == 0:
            exporter.add_disconnection_event()
            exporter.add_signin_event()
            exporter.add_connection_event()
            # 重連後的第一個結果包含完整資訊
            exporter.add_result_event(result, is_reconnected=True)
        else:
            exporter.add_result_event(result, is_reconnected=False)
    
    # 添加最終斷線事件
    if add_connection_events:
        exporter.add_disconnection_event()
    
    # 輸出檔案
    return exporter.export_to_json(output_path)


# 測試程式碼
if __name__ == "__main__":
    # 測試資料
    test_results = [
        {
            "module_id": "BS",
            "player_balance": 10000000,
            "rng": [17, 54, 70, 48, 22, 26, 14, 11],
            "total_win": 173,
            "next_module": "BS",
            "jp_count": 0,
            "jp": 0,
            "win_lines": [
                {
                    "win_line_type": 0,
                    "line_no": 0,
                    "symbol_id": 7,
                    "positions": [0, 1, 2],
                    "win_amount": 173,
                    "multiplier": 1
                }
            ]
        },
        {
            "module_id": "BS",
            "player_balance": 9999950,
            "rng": [36, 5, 56, 68, 31, 36, 14, 62],
            "total_win": 0,
            "next_module": "BS",
            "jp_count": 0,
            "jp": 0,
            "win_lines": []
        },
        {
            "module_id": "BS",
            "player_balance": 9999900,
            "rng": [109, 56, 77, 66, 1, 48, 10, 66],
            "total_win": 0,
            "next_module": "BS",
            "jp_count": 0,
            "jp": 0,
            "win_lines": []
        }
    ]
    
    # 輸出測試
    output_file = export_simulation_to_event_log(
        results=test_results,
        output_path="test_output/event_log_test.json",
        add_connection_events=True,
        reconnect_interval=2
    )
    
    print(f"✅ 測試輸出完成: {output_file}")
