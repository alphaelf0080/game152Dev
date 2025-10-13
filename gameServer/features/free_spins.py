"""
免費旋轉特色功能
實現好運咚咚遊戲的免費旋轉機制
"""

from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
import random

@dataclass
class FreeSpinsConfig:
    """免費旋轉配置"""
    initial_spins: int = 7
    max_spins: int = 70
    trigger_symbol_count: int = 3
    retrigger_spins: int = 7

class FreeSpinsFeature:
    """免費旋轉特色類"""
    
    def __init__(self, config: Dict[str, Any]):
        """初始化免費旋轉特色"""
        self.config = config
        self.free_spins_config = FreeSpinsConfig(
            initial_spins=config.get("free_spins", {}).get("initial_spins", 7),
            max_spins=config.get("free_spins", {}).get("max_spins", 70),
            trigger_symbol_count=config.get("free_spins", {}).get("trigger_symbols", 3),
            retrigger_spins=config.get("free_spins", {}).get("retrigger_symbols", 7)
        )
        
        # 狀態管理
        self.is_active = False
        self.remaining_spins = 0
        self.total_win = 0
        self.current_spin = 0
        self.retrigger_count = 0
        
        # 特色專用滾輪條帶 (如果有的話)
        self.feature_reel_strips = None
        
    def trigger(self, trigger_type: str = "normal") -> Dict[str, Any]:
        """
        觸發免費旋轉
        trigger_type: "normal" (正常觸發) 或 "buy" (購買觸發)
        """
        if self.is_active:
            raise ValueError("免費旋轉已經處於活動狀態")
        
        self.is_active = True
        self.remaining_spins = self.free_spins_config.initial_spins
        self.total_win = 0
        self.current_spin = 0
        self.retrigger_count = 0
        
        return {
            "triggered": True,
            "initial_spins": self.remaining_spins,
            "trigger_type": trigger_type,
            "message": f"免費旋轉觸發！獲得 {self.remaining_spins} 次免費旋轉"
        }
    
    def check_trigger_condition(self, reel_result: List[List[int]]) -> bool:
        """檢查觸發條件"""
        bonus_symbol_id = self.config.get("symbols", {}).get("BONUS", {}).get("id", 9)
        
        # 檢查前三輪是否有足夠的 BONUS 符號
        bonus_reels = 0
        for reel_idx in range(min(3, len(reel_result))):
            for symbol in reel_result[reel_idx]:
                if symbol == bonus_symbol_id:
                    bonus_reels += 1
                    break  # 每輪最多計算一個
        
        return bonus_reels >= self.free_spins_config.trigger_symbol_count
    
    def check_retrigger(self, reel_result: List[List[int]]) -> Tuple[bool, int]:
        """檢查再觸發"""
        if not self.is_active:
            return False, 0
        
        if self.check_trigger_condition(reel_result):
            additional_spins = self.free_spins_config.retrigger_spins
            
            # 檢查是否超過最大旋轉次數
            total_after_retrigger = self.remaining_spins + additional_spins
            max_additional = self.free_spins_config.max_spins - (self.current_spin + self.remaining_spins)
            
            if max_additional > 0:
                actual_additional = min(additional_spins, max_additional)
                self.remaining_spins += actual_additional
                self.retrigger_count += 1
                
                return True, actual_additional
        
        return False, 0
    
    def execute_spin(self, base_win: int, multiplier: int = 1) -> Dict[str, Any]:
        """執行一次免費旋轉"""
        if not self.is_active or self.remaining_spins <= 0:
            raise ValueError("沒有可用的免費旋轉")
        
        self.current_spin += 1
        self.remaining_spins -= 1
        
        # 計算此次旋轉的贏分
        spin_win = base_win * multiplier
        self.total_win += spin_win
        
        # 檢查是否結束
        is_final_spin = self.remaining_spins == 0
        
        spin_result = {
            "spin_number": self.current_spin,
            "remaining_spins": self.remaining_spins,
            "spin_win": spin_win,
            "total_win": self.total_win,
            "multiplier": multiplier,
            "is_final": is_final_spin
        }
        
        if is_final_spin:
            self.complete()
        
        return spin_result
    
    def complete(self) -> Dict[str, Any]:
        """完成免費旋轉"""
        if not self.is_active:
            return {"message": "免費旋轉未處於活動狀態"}
        
        final_result = {
            "completed": True,
            "total_spins": self.current_spin,
            "total_win": self.total_win,
            "retrigger_count": self.retrigger_count,
            "average_win_per_spin": self.total_win / self.current_spin if self.current_spin > 0 else 0
        }
        
        # 重置狀態
        self.is_active = False
        self.remaining_spins = 0
        self.current_spin = 0
        self.retrigger_count = 0
        
        return final_result
    
    def get_feature_status(self) -> Dict[str, Any]:
        """獲取特色狀態"""
        return {
            "is_active": self.is_active,
            "remaining_spins": self.remaining_spins,
            "current_spin": self.current_spin,
            "total_win": self.total_win,
            "retrigger_count": self.retrigger_count,
            "progress": {
                "completed_spins": self.current_spin,
                "remaining_spins": self.remaining_spins,
                "completion_percentage": (self.current_spin / (self.current_spin + self.remaining_spins)) * 100 if (self.current_spin + self.remaining_spins) > 0 else 0
            }
        }
    
    def simulate_feature_outcome(self, num_simulations: int = 1000) -> Dict[str, Any]:
        """模擬免費旋轉結果"""
        simulation_results = []
        
        for _ in range(num_simulations):
            # 模擬一輪完整的免費旋轉
            sim_spins = self.free_spins_config.initial_spins
            sim_total_win = 0
            sim_retriggers = 0
            
            for spin in range(sim_spins):
                # 模擬基礎贏分 (簡化)
                base_win = random.randint(0, 1000)
                
                # 模擬倍率 (戰鼓)
                multiplier = random.randint(1, 30)  # 假設最大30倍
                
                sim_total_win += base_win * multiplier
                
                # 模擬再觸發 (5% 機率)
                if random.random() < 0.05 and sim_spins < self.free_spins_config.max_spins:
                    additional = min(7, self.free_spins_config.max_spins - sim_spins)
                    sim_spins += additional
                    sim_retriggers += 1
            
            simulation_results.append({
                "total_spins": sim_spins,
                "total_win": sim_total_win,
                "retriggers": sim_retriggers
            })
        
        # 計算統計
        total_wins = [r["total_win"] for r in simulation_results]
        total_spins = [r["total_spins"] for r in simulation_results]
        retriggers = [r["retriggers"] for r in simulation_results]
        
        return {
            "simulations": num_simulations,
            "average_win": sum(total_wins) / len(total_wins),
            "max_win": max(total_wins),
            "min_win": min(total_wins),
            "average_spins": sum(total_spins) / len(total_spins),
            "retrigger_rate": sum(1 for r in retriggers if r > 0) / len(retriggers),
            "average_retriggers": sum(retriggers) / len(retriggers)
        }
    
    def get_symbol_transformation_weights(self) -> Dict[str, float]:
        """獲取免費旋轉中的符號變換權重"""
        # 根據遊戲說明，免費旋轉中 P 系列符號會變換
        return {
            "P1": 0.25,  # 25% 機率變成 P1
            "P2": 0.20,  # 20% 機率變成 P2
            "P3": 0.20,  # 20% 機率變成 P3
            "P4": 0.15,  # 15% 機率變成 P4
            "P5": 0.10   # 10% 機率變成 P5 (約30%相對於P1)
        }
    
    def reset(self):
        """重置免費旋轉狀態"""
        self.is_active = False
        self.remaining_spins = 0
        self.total_win = 0
        self.current_spin = 0
        self.retrigger_count = 0