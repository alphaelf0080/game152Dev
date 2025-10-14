"""
簡化的遊戲結果 JSON 輸出器
只輸出 data 部分，不包含事件日誌結構
"""

import json
import os
from typing import Dict, List, Any, Optional
from pathlib import Path


class SimpleDataExporter:
    """
    簡化的遊戲結果輸出器
    
    輸出格式:
    [
        {
            "module_id": "BS",
            "credit": 9999950,
            "rng": [17, 54, 70, 48, 22, 26, 14, 11],
            "win": 100,
            "winLineGrp": [...],
            "multiplierAlone": 1,
            "mulitplierPattern": [1, 1, 1, ...],
            "next_module": "BS",
            "winBonusGrp": [],
            "jp_count": 0,
            "jp": 0
        },
        ...
    ]
    """
    
    def __init__(self):
        """初始化簡化輸出器"""
        self.results = []
        
    def add_result(self, game_result: Dict[str, Any]) -> None:
        """
        添加遊戲結果
        
        Args:
            game_result: 遊戲結果數據
        """
        data = self._convert_game_result(game_result)
        self.results.append(data)
        
    def _convert_game_result(self, game_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        將內部遊戲結果格式轉換為輸出格式
        
        Args:
            game_result: 內部遊戲結果
            
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
        
        # winLineGrp
        win_lines = game_result.get("win_lines", [])
        if win_lines:
            data["winLineGrp"] = self._convert_win_lines(win_lines)
        else:
            data["winLineGrp"] = []
            
        # multiplierAlone
        multiplier = game_result.get("multiplier", 1)
        data["multiplierAlone"] = multiplier if multiplier > 1 else 1
        
        # mulitplierPattern (注意拼寫：mulitplier)
        multiplier_pattern = game_result.get("multiplier_pattern", [])
        if multiplier_pattern:
            data["mulitplierPattern"] = multiplier_pattern
        else:
            # 生成預設的 1 陣列（20個元素）
            data["mulitplierPattern"] = [1] * 20
            
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
            win_amount = line.get("win_amount", line.get("credit", 0))
            multiplier = line.get("multiplier", line.get("mul", 1))
            
            converted_line = {
                "win_line_type": line.get("win_line_type", 0),
                "line_no": line.get("line_no", 65535),
                "symbol_id": line.get("symbol_id", 255),
                "pos": line.get("positions", line.get("pos", [])),
                "credit": win_amount,
                "multiplier": multiplier,
                "credit_long": {
                    "low": win_amount,
                    "high": 0,
                    "unsigned": True
                }
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
        
        # 寫入檔案
        with open(output_path, 'w', encoding='utf-8') as f:
            if pretty:
                json.dump(self.results, f, indent=2, ensure_ascii=False)
            else:
                json.dump(self.results, f, ensure_ascii=False)
                
        return os.path.abspath(output_path)
        
    def get_json_string(self, pretty: bool = True) -> str:
        """
        獲取 JSON 字串
        
        Args:
            pretty: 是否格式化輸出
            
        Returns:
            JSON 字串
        """
        if pretty:
            return json.dumps(self.results, indent=2, ensure_ascii=False)
        else:
            return json.dumps(self.results, ensure_ascii=False)


def export_simulation_to_simple_data(results: List[Dict[str, Any]], 
                                    output_path: str) -> str:
    """
    將模擬結果輸出為簡化數據格式
    
    Args:
        results: 遊戲結果列表
        output_path: 輸出路徑
        
    Returns:
        輸出檔案的完整路徑
    """
    exporter = SimpleDataExporter()
    
    # 添加所有遊戲結果
    for result in results:
        exporter.add_result(result)
    
    # 輸出檔案
    return exporter.export_to_json(output_path)


# 測試程式碼
if __name__ == "__main__":
    # 測試資料
    test_results = [
        {
            "module_id": "BS",
            "player_balance": 9999950,
            "rng": [17, 54, 70, 48, 22, 26, 14, 11],
            "total_win": 173,
            "next_module": "BS",
            "jp_count": 0,
            "jp": 0,
            "multiplier": 1,
            "win_lines": [
                {
                    "win_line_type": 0,
                    "line_no": 65535,
                    "symbol_id": 7,
                    "positions": [14, 24, 5],
                    "win_amount": 173,
                    "multiplier": 1
                }
            ]
        },
        {
            "module_id": "BS",
            "player_balance": 9999900,
            "rng": [36, 5, 56, 68, 31, 36, 14, 62],
            "total_win": 0,
            "next_module": "BS",
            "jp_count": 0,
            "jp": 0,
            "multiplier": 1,
            "win_lines": []
        }
    ]
    
    # 輸出測試
    output_file = export_simulation_to_simple_data(
        results=test_results,
        output_path="test_output/simple_data_test.json"
    )
    
    print(f"✅ 測試輸出完成: {output_file}")
    
    # 顯示內容
    with open(output_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"\n📊 輸出了 {len(data)} 筆結果")
    print(f"\n第一筆結果:")
    print(json.dumps(data[0], indent=2, ensure_ascii=False))
