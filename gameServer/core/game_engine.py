"""
主遊戲引擎 - 好運咚咚遊戲模擬器
實現遊戲的核心邏輯，包括狀態管理、旋轉處理、特色觸發等
"""

import json
import random
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum
from dataclasses import dataclass, asdict

class GameState(Enum):
    """遊戲狀態列舉 - 對應 TypeScript 中的 ESTATEID"""
    K_IDLE = 0
    K_SPIN = 1
    K_SPINSTOPING = 2
    K_PRE_SHOWWIN = 3
    K_SHOWWIN = 4
    K_WAIT = 5
    K_FEATURE_TRIGGER = 6
    K_FEATURE_SHOWSCATTERWIN = 7
    K_FEATURE_TRANSLATE = 8
    K_FEATURE_WAIT_START = 9
    K_FEATURE_SPIN = 10
    K_FEATURE_SPINSTOPING = 11
    K_FEATURE_PRE_SHOWWIN = 12
    K_FEATURE_SHOWWIN = 13
    K_FEATURE_WAIT = 14
    K_FEATURE_CHEKRESULT = 15
    K_FEATURE_RETRIGGER = 16
    K_FEATURE_SHOW_RETIGGER = 17
    K_ENDGAME = 18

class SpinType(Enum):
    """旋轉類型"""
    NORMAL = 0
    FEATURE_BUY_60X = 1
    FEATURE_BUY_80X = 2
    FEATURE_BUY_100X = 3

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

@dataclass
class SpinResult:
    """單次旋轉結果"""
    reel_result: List[List[int]]  # 5x3 滾輪結果
    win_lines: List[WinLine]
    total_credit: int
    scatter_win: int
    is_feature_trigger: bool
    feature_type: Optional[str] = None
    free_spins_awarded: int = 0
    multiplier: int = 1
    special_effects: List[str] = None

class GameEngine:
    """主遊戲引擎類"""
    
    def __init__(self, config_path: str = "config/game_config.json", paytable_path: str = "config/paytable.json"):
        """初始化遊戲引擎"""
        self.load_config(config_path, paytable_path)
        self.reset_game_state()
        
    def load_config(self, config_path: str, paytable_path: str):
        """載入遊戲配置"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                self.config = json.load(f)
            with open(paytable_path, 'r', encoding='utf-8') as f:
                self.paytable = json.load(f)
        except FileNotFoundError as e:
            print(f"配置文件載入失敗: {e}")
            # 使用默認配置
            self._init_default_config()
    
    def _init_default_config(self):
        """初始化默認配置"""
        self.config = {
            "reel_config": {"reel_count": 5, "reel_height": 3},
            "symbols": {
                "P5": {"id": 0}, "P4": {"id": 1}, "P3": {"id": 2}, 
                "P2": {"id": 3}, "P1": {"id": 4}, "K": {"id": 5},
                "Q": {"id": 6}, "J": {"id": 7}, "T": {"id": 8},
                "BONUS": {"id": 9}, "WILD": {"id": 10}
            }
        }
        self.paytable = {"base_game": {}}
    
    def reset_game_state(self):
        """重置遊戲狀態"""
        self.current_state = GameState.K_IDLE
        self.player_credit = 1000000  # 初始玩家積分
        self.current_bet = self.config.get("base_bet", 50)
        self.free_spins_remaining = 0
        self.free_spins_total_win = 0
        self.feature_multiplier = 1
        self.drums_count = 0
        self.game_history = []
        
        # 滾輪條帶定義 (簡化版本)
        self.reel_strips = self._generate_reel_strips()
    
    def _generate_reel_strips(self) -> List[List[int]]:
        """生成滾輪條帶"""
        # 基礎遊戲滾輪條帶 (簡化版本)
        base_strips = [
            # 第1輪 - 較多低價值符號
            [4, 5, 6, 7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 9, 
             5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7],
            
            # 第2輪
            [5, 6, 7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 9,
             6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8],
            
            # 第3輪 - BONUS 符號較多
            [6, 7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 9,
             7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            
            # 第4輪
            [7, 8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 7, 8,
             1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 4, 5, 6],
            
            # 第5輪 - 較多高價值符號
            [8, 4, 5, 6, 7, 8, 3, 4, 5, 6, 7, 8, 2, 3, 4, 5, 6, 7, 8, 1,
             2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3]
        ]
        
        return base_strips
    
    def spin(self, spin_type: SpinType = SpinType.NORMAL) -> SpinResult:
        """執行一次旋轉"""
        self.current_state = GameState.K_SPIN
        
        # 檢查是否為特色購買
        if spin_type != SpinType.NORMAL:
            return self._handle_feature_buy(spin_type)
        
        # 正常旋轉邏輯
        reel_result = self._generate_reel_result()
        
        # 檢查免費旋轉觸發
        is_feature_trigger, free_spins = self._check_feature_trigger(reel_result)
        
        if is_feature_trigger:
            self.free_spins_remaining = free_spins
            self.current_state = GameState.K_FEATURE_TRIGGER
        
        # 計算贏分
        win_lines = self._calculate_wins(reel_result)
        total_credit = sum(line.credit for line in win_lines)
        
        # 創建旋轉結果
        result = SpinResult(
            reel_result=reel_result,
            win_lines=win_lines,
            total_credit=total_credit,
            scatter_win=0,
            is_feature_trigger=is_feature_trigger,
            free_spins_awarded=free_spins if is_feature_trigger else 0
        )
        
        # 更新遊戲狀態
        self.player_credit += total_credit - self.current_bet
        self.game_history.append(result)
        
        self.current_state = GameState.K_IDLE
        return result
    
    def _generate_reel_result(self) -> List[List[int]]:
        """生成滾輪結果"""
        result = []
        reel_height = self.config["reel_config"]["reel_height"]
        
        for reel_idx in range(self.config["reel_config"]["reel_count"]):
            strip = self.reel_strips[reel_idx]
            start_pos = random.randint(0, len(strip) - reel_height)
            reel_symbols = []
            
            for i in range(reel_height):
                symbol_idx = (start_pos + i) % len(strip)
                reel_symbols.append(strip[symbol_idx])
            
            result.append(reel_symbols)
        
        return result
    
    def _check_feature_trigger(self, reel_result: List[List[int]]) -> Tuple[bool, int]:
        """檢查免費旋轉觸發"""
        bonus_symbol_id = self.config["symbols"]["BONUS"]["id"]
        bonus_count = 0
        
        # 檢查前三輪是否有 BONUS 符號
        for reel_idx in range(min(3, len(reel_result))):
            for symbol in reel_result[reel_idx]:
                if symbol == bonus_symbol_id:
                    bonus_count += 1
                    break  # 每輪最多計算一個
        
        if bonus_count >= 3:
            return True, self.config.get("free_spins", {}).get("initial_spins", 7)
        
        return False, 0
    
    def _calculate_wins(self, reel_result: List[List[int]]) -> List[WinLine]:
        """計算贏分 - 243 Ways"""
        from .win_calculator import WinCalculator
        calculator = WinCalculator(self.config, self.paytable)
        return calculator.calculate_243_ways(reel_result)
    
    def _handle_feature_buy(self, spin_type: SpinType) -> SpinResult:
        """處理特色購買"""
        buy_configs = {
            SpinType.FEATURE_BUY_60X: {"cost": 60, "drums": 1},
            SpinType.FEATURE_BUY_80X: {"cost": 80, "drums": 2},
            SpinType.FEATURE_BUY_100X: {"cost": 100, "drums": 3}
        }
        
        config = buy_configs[spin_type]
        cost = self.current_bet * config["cost"]
        
        if self.player_credit < cost:
            raise ValueError("積分不足以購買特色")
        
        # 扣除購買費用
        self.player_credit -= cost
        
        # 設置免費旋轉
        self.free_spins_remaining = 7
        self.drums_count = config["drums"]
        
        # 強制觸發免費旋轉
        return self.spin_free_game()
    
    def spin_free_game(self) -> SpinResult:
        """免費旋轉"""
        if self.free_spins_remaining <= 0:
            raise ValueError("沒有剩餘的免費旋轉")
        
        self.current_state = GameState.K_FEATURE_SPIN
        self.free_spins_remaining -= 1
        
        # 生成免費旋轉結果 (可能有不同的滾輪條帶)
        reel_result = self._generate_reel_result()
        
        # 符號變換邏輯
        transformed_result = self._apply_symbol_transformation(reel_result)
        
        # 計算贏分
        win_lines = self._calculate_wins(transformed_result)
        base_credit = sum(line.credit for line in win_lines)
        
        # 應用戰鼓倍率
        drum_multiplier = self._calculate_drum_multiplier(base_credit > 0)
        total_credit = base_credit * drum_multiplier
        
        # 檢查再觸發
        is_retrigger, additional_spins = self._check_feature_trigger(transformed_result)
        if is_retrigger:
            self.free_spins_remaining += additional_spins
        
        result = SpinResult(
            reel_result=transformed_result,
            win_lines=win_lines,
            total_credit=total_credit,
            scatter_win=0,
            is_feature_trigger=is_retrigger,
            free_spins_awarded=additional_spins if is_retrigger else 0,
            multiplier=drum_multiplier
        )
        
        self.free_spins_total_win += total_credit
        self.game_history.append(result)
        
        if self.free_spins_remaining == 0:
            self.current_state = GameState.K_ENDGAME
            self.player_credit += self.free_spins_total_win
            self.free_spins_total_win = 0
            self.drums_count = 0
        
        return result
    
    def _apply_symbol_transformation(self, reel_result: List[List[int]]) -> List[List[int]]:
        """應用符號變換邏輯"""
        from .symbol_transformer import SymbolTransformer
        transformer = SymbolTransformer(self.config)
        return transformer.transform_symbols(reel_result)
    
    def _calculate_drum_multiplier(self, has_win: bool) -> int:
        """計算戰鼓倍率"""
        if not has_win or self.drums_count == 0:
            return 1
        
        total_multiplier = 0
        for _ in range(self.drums_count):
            # 隨機生成 1-10 的倍率
            drum_mult = random.randint(1, 10)
            total_multiplier += drum_mult
        
        return max(1, total_multiplier)
    
    def get_game_state(self) -> Dict[str, Any]:
        """獲取當前遊戲狀態"""
        return {
            "state": self.current_state.name,
            "player_credit": self.player_credit,
            "current_bet": self.current_bet,
            "free_spins_remaining": self.free_spins_remaining,
            "free_spins_total_win": self.free_spins_total_win,
            "drums_count": self.drums_count,
            "total_spins": len(self.game_history)
        }
    
    def get_statistics(self) -> Dict[str, Any]:
        """獲取遊戲統計信息"""
        if not self.game_history:
            return {"message": "沒有遊戲歷史"}
        
        total_spins = len(self.game_history)
        total_win = sum(result.total_credit for result in self.game_history)
        feature_triggers = sum(1 for result in self.game_history if result.is_feature_trigger)
        
        return {
            "total_spins": total_spins,
            "total_win": total_win,
            "feature_triggers": feature_triggers,
            "feature_trigger_rate": feature_triggers / total_spins if total_spins > 0 else 0,
            "average_win": total_win / total_spins if total_spins > 0 else 0,
            "rtp_estimate": (total_win / (total_spins * self.current_bet)) * 100 if total_spins > 0 else 0
        }