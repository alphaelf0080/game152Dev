"""
243 Ways 贏分計算器
實現好運咚咚遊戲的 243 Ways 贏分機制
"""

from typing import List, Dict, Any, Tuple
from dataclasses import dataclass
import json

@dataclass
class WinLine:
    """贏分線數據結構"""
    line_no: int
    symbol_id: int
    positions: List[int]
    credit: int
    multiplier: int
    ways: int = 1
    win_type: str = "normal"  # normal, scatter, feature

class WinCalculator:
    """243 Ways 贏分計算器"""
    
    def __init__(self, config: Dict[str, Any], paytable: Dict[str, Any]):
        """初始化計算器"""
        self.config = config
        self.paytable = paytable
        self.symbols = config.get("symbols", {})
        self.wild_symbol_id = self._get_symbol_id("WILD")
        self.scatter_symbol_id = self._get_symbol_id("BONUS")
    
    def _get_symbol_id(self, symbol_name: str) -> int:
        """獲取符號ID"""
        return self.symbols.get(symbol_name, {}).get("id", -1)
    
    def _get_symbol_name(self, symbol_id: int) -> str:
        """根據ID獲取符號名稱"""
        for name, data in self.symbols.items():
            if data.get("id") == symbol_id:
                return name
        return "UNKNOWN"
    
    def calculate_243_ways(self, reel_result: List[List[int]]) -> List[WinLine]:
        """計算 243 Ways 贏分"""
        win_lines = []
        
        # 計算普通符號的 Ways 贏分
        ways_wins = self._calculate_ways_wins(reel_result)
        win_lines.extend(ways_wins)
        
        # 計算散佈符號贏分
        scatter_wins = self._calculate_scatter_wins(reel_result)
        win_lines.extend(scatter_wins)
        
        return win_lines
    
    def _calculate_ways_wins(self, reel_result: List[List[int]]) -> List[WinLine]:
        """計算 Ways 贏分"""
        win_lines = []
        
        # 檢查每種可能的符號組合
        for symbol_id in range(len(self.symbols)):
            if symbol_id == self.scatter_symbol_id:
                continue  # 散佈符號單獨處理
            
            symbol_name = self._get_symbol_name(symbol_id)
            ways_data = self._find_ways_for_symbol(reel_result, symbol_id)
            
            if ways_data["count"] >= 3:  # 至少3連才有贏分
                payout = self._get_payout(symbol_name, ways_data["count"])
                if payout > 0:
                    credit = payout * ways_data["ways"]
                    
                    win_line = WinLine(
                        line_no=len(win_lines) + 1,
                        symbol_id=symbol_id,
                        positions=ways_data["positions"],
                        credit=credit,
                        multiplier=1,
                        ways=ways_data["ways"],
                        win_type="normal"
                    )
                    win_lines.append(win_line)
        
        return win_lines
    
    def _find_ways_for_symbol(self, reel_result: List[List[int]], target_symbol: int) -> Dict[str, Any]:
        """找到指定符號的 Ways 數據"""
        reel_count = len(reel_result)
        consecutive_count = 0
        ways_multiplier = 1
        all_positions = []
        
        # 從左到右檢查連續的滾輪
        for reel_idx in range(reel_count):
            reel_symbols = reel_result[reel_idx]
            symbol_count_in_reel = 0
            reel_positions = []
            
            # 計算當前滾輪中目標符號的數量（包括 WILD 替代）
            for pos, symbol in enumerate(reel_symbols):
                if symbol == target_symbol or symbol == self.wild_symbol_id:
                    symbol_count_in_reel += 1
                    reel_positions.append(reel_idx * 3 + pos)  # 轉換為絕對位置
            
            if symbol_count_in_reel > 0:
                consecutive_count += 1
                ways_multiplier *= symbol_count_in_reel
                all_positions.extend(reel_positions)
            else:
                break  # 連續中斷
        
        return {
            "count": consecutive_count,
            "ways": ways_multiplier,
            "positions": all_positions
        }
    
    def _calculate_scatter_wins(self, reel_result: List[List[int]]) -> List[WinLine]:
        """計算散佈符號贏分"""
        if self.scatter_symbol_id == -1:
            return []
        
        # 計算全盤散佈符號數量
        scatter_count = 0
        scatter_positions = []
        
        for reel_idx, reel_symbols in enumerate(reel_result):
            for pos, symbol in enumerate(reel_symbols):
                if symbol == self.scatter_symbol_id:
                    scatter_count += 1
                    scatter_positions.append(reel_idx * 3 + pos)
        
        if scatter_count >= 3:  # 至少3個才有散佈贏分
            symbol_name = self._get_symbol_name(self.scatter_symbol_id)
            payout = self._get_scatter_payout(symbol_name, scatter_count)
            
            if payout > 0:
                win_line = WinLine(
                    line_no=999,  # 散佈贏分使用特殊線號
                    symbol_id=self.scatter_symbol_id,
                    positions=scatter_positions,
                    credit=payout,
                    multiplier=1,
                    ways=1,
                    win_type="scatter"
                )
                return [win_line]
        
        return []
    
    def _get_payout(self, symbol_name: str, count: int) -> int:
        """獲取符號賠付"""
        base_game_pays = self.paytable.get("base_game", {})
        symbol_pays = base_game_pays.get(symbol_name, {})
        return symbol_pays.get(str(count), 0)
    
    def _get_scatter_payout(self, symbol_name: str, count: int) -> int:
        """獲取散佈符號賠付"""
        scatter_pays = self.paytable.get("scatter_pays", {})
        symbol_pays = scatter_pays.get(symbol_name, {})
        return symbol_pays.get(str(count), 0)
    
    def validate_win_line(self, win_line: WinLine, reel_result: List[List[int]]) -> bool:
        """驗證贏分線的正確性"""
        if win_line.win_type == "scatter":
            return self._validate_scatter_win(win_line, reel_result)
        else:
            return self._validate_ways_win(win_line, reel_result)
    
    def _validate_scatter_win(self, win_line: WinLine, reel_result: List[List[int]]) -> bool:
        """驗證散佈贏分"""
        expected_count = len(win_line.positions)
        actual_count = 0
        
        for reel_idx, reel_symbols in enumerate(reel_result):
            for pos, symbol in enumerate(reel_symbols):
                if symbol == win_line.symbol_id:
                    actual_count += 1
        
        return actual_count == expected_count
    
    def _validate_ways_win(self, win_line: WinLine, reel_result: List[List[int]]) -> bool:
        """驗證 Ways 贏分"""
        # 重新計算該符號的 Ways 數據
        ways_data = self._find_ways_for_symbol(reel_result, win_line.symbol_id)
        
        # 驗證 Ways 數量
        expected_ways = ways_data["ways"]
        return win_line.ways == expected_ways
    
    def get_win_summary(self, win_lines: List[WinLine]) -> Dict[str, Any]:
        """獲取贏分摘要"""
        if not win_lines:
            return {
                "total_lines": 0,
                "total_credit": 0,
                "total_ways": 0,
                "symbols_won": []
            }
        
        total_credit = sum(line.credit for line in win_lines)
        total_ways = sum(line.ways for line in win_lines if line.win_type != "scatter")
        symbols_won = list(set(self._get_symbol_name(line.symbol_id) for line in win_lines))
        
        return {
            "total_lines": len(win_lines),
            "total_credit": total_credit,
            "total_ways": total_ways,
            "symbols_won": symbols_won,
            "has_scatter": any(line.win_type == "scatter" for line in win_lines)
        }