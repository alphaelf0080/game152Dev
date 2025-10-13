"""
滾輪控制器 - 管理滾輪的旋轉和停止邏輯
實現好運咚咚遊戲的滾輪機制，包括慢動作效果
"""

from typing import List, Dict, Any, Tuple
import random
import time

class ReelState:
    """滾輪狀態列舉"""
    IDLE = "idle"
    SPINNING = "spinning"
    STOPPING = "stopping"
    STOPPED = "stopped"
    SLOW_MOTION = "slow_motion"

class ReelController:
    """滾輪控制器類"""
    
    def __init__(self, config: Dict[str, Any]):
        """初始化滾輪控制器"""
        self.config = config
        self.reel_config = config.get("reel_config", {})
        self.reel_count = self.reel_config.get("reel_count", 5)
        self.reel_height = self.reel_config.get("reel_height", 3)
        
        # 滾輪狀態
        self.reel_states = [ReelState.IDLE] * self.reel_count
        self.current_positions = [0] * self.reel_count
        self.target_positions = [0] * self.reel_count
        self.slow_motion_flags = [False] * self.reel_count
        
        # 滾輪條帶 (從 GameEngine 獲取或生成)
        self.reel_strips = self._generate_default_strips()
        
        # 旋轉參數
        self.spin_duration = 3.0  # 基礎旋轉時間 (秒)
        self.slow_motion_duration = 2.0  # 慢動作額外時間
        self.reel_stop_intervals = [0.0, 0.5, 1.0, 1.5, 2.0]  # 各滾輪停止時間偏移
    
    def _generate_default_strips(self) -> List[List[int]]:
        """生成默認的滾輪條帶"""
        # 這裡提供一個簡化的條帶生成邏輯
        # 實際遊戲中會從配置文件或服務器獲取
        
        base_symbols = [0, 1, 2, 3, 4, 5, 6, 7, 8]  # P5, P4, P3, P2, P1, K, Q, J, T
        bonus_symbol = 9  # BONUS
        wild_symbol = 10  # WILD
        
        strips = []
        for reel_idx in range(self.reel_count):
            strip = []
            strip_length = 40  # 每個滾輪40個符號
            
            for i in range(strip_length):
                if i % 15 == 0:  # 每15個位置放一個BONUS
                    strip.append(bonus_symbol)
                elif i % 20 == 0:  # 每20個位置放一個WILD
                    strip.append(wild_symbol)
                else:
                    # 隨機選擇基礎符號，權重向低價值符號傾斜
                    weights = [1, 2, 3, 4, 5, 6, 6, 7, 7]  # T, J 權重最高
                    symbol = random.choices(base_symbols, weights=weights)[0]
                    strip.append(symbol)
            
            strips.append(strip)
        
        return strips
    
    def set_reel_strips(self, strips: List[List[int]]):
        """設置滾輪條帶"""
        if len(strips) != self.reel_count:
            raise ValueError(f"條帶數量 {len(strips)} 與滾輪數量 {self.reel_count} 不匹配")
        
        self.reel_strips = strips
    
    def start_spin(self, target_result: List[List[int]], slow_motion_flags: List[bool] = None):
        """
        開始旋轉
        target_result: 目標結果 (5x3)
        slow_motion_flags: 慢動作標記 (對應每個滾輪)
        """
        if len(target_result) != self.reel_count:
            raise ValueError(f"目標結果滾輪數量 {len(target_result)} 與配置不匹配")
        
        # 設置慢動作標記
        if slow_motion_flags:
            self.slow_motion_flags = slow_motion_flags[:self.reel_count]
        else:
            self.slow_motion_flags = [False] * self.reel_count
        
        # 計算目標位置
        self.target_positions = self._calculate_target_positions(target_result)
        
        # 設置所有滾輪為旋轉狀態
        self.reel_states = [ReelState.SPINNING] * self.reel_count
        
        # 模擬旋轉過程
        self._simulate_spinning_process()
    
    def _calculate_target_positions(self, target_result: List[List[int]]) -> List[int]:
        """計算每個滾輪的目標位置"""
        target_positions = []
        
        for reel_idx in range(self.reel_count):
            reel_strip = self.reel_strips[reel_idx]
            target_symbols = target_result[reel_idx]
            
            # 在條帶中尋找匹配的位置
            strip_length = len(reel_strip)
            best_position = 0
            
            for start_pos in range(strip_length):
                match_count = 0
                for i in range(self.reel_height):
                    strip_symbol = reel_strip[(start_pos + i) % strip_length]
                    target_symbol = target_symbols[i]
                    if strip_symbol == target_symbol:
                        match_count += 1
                
                if match_count == self.reel_height:
                    best_position = start_pos
                    break
            
            target_positions.append(best_position)
        
        return target_positions
    
    def _simulate_spinning_process(self):
        """模擬旋轉過程"""
        spin_log = {
            "start_time": time.time(),
            "reel_stop_times": [],
            "slow_motion_reels": [],
            "final_positions": self.target_positions
        }
        
        # 模擬各滾輪的停止序列
        for reel_idx in range(self.reel_count):
            stop_time = self.reel_stop_intervals[reel_idx]
            
            # 檢查慢動作
            if self.slow_motion_flags[reel_idx]:
                stop_time += self.slow_motion_duration
                self.reel_states[reel_idx] = ReelState.SLOW_MOTION
                spin_log["slow_motion_reels"].append(reel_idx)
            
            spin_log["reel_stop_times"].append(stop_time)
        
        # 最終所有滾輪設為停止狀態
        self.reel_states = [ReelState.STOPPED] * self.reel_count
        self.current_positions = self.target_positions[:]
        
        return spin_log
    
    def get_current_symbols(self) -> List[List[int]]:
        """獲取當前顯示的符號"""
        current_symbols = []
        
        for reel_idx in range(self.reel_count):
            reel_strip = self.reel_strips[reel_idx]
            current_pos = self.current_positions[reel_idx]
            reel_symbols = []
            
            for i in range(self.reel_height):
                symbol_pos = (current_pos + i) % len(reel_strip)
                reel_symbols.append(reel_strip[symbol_pos])
            
            current_symbols.append(reel_symbols)
        
        return current_symbols
    
    def check_slow_motion_trigger(self, current_symbols: List[List[int]]) -> List[bool]:
        """
        檢查慢動作觸發條件
        根據遊戲規則：當前兩輪出現 BONUS 符號時，第三輪觸發慢動作
        """
        bonus_symbol_id = self.config.get("symbols", {}).get("BONUS", {}).get("id", 9)
        slow_motion_flags = [False] * self.reel_count
        
        # 檢查前兩輪是否有 BONUS
        bonus_in_reel_1 = any(symbol == bonus_symbol_id for symbol in current_symbols[0])
        bonus_in_reel_2 = any(symbol == bonus_symbol_id for symbol in current_symbols[1])
        
        # 如果前兩輪都有 BONUS，第三輪觸發慢動作
        if bonus_in_reel_1 and bonus_in_reel_2 and len(slow_motion_flags) > 2:
            slow_motion_flags[2] = True
        
        return slow_motion_flags
    
    def predict_feature_trigger(self, current_symbols: List[List[int]]) -> Dict[str, Any]:
        """
        預測特色觸發機率
        基於當前滾輪狀態分析觸發可能性
        """
        bonus_symbol_id = self.config.get("symbols", {}).get("BONUS", {}).get("id", 9)
        
        # 統計已停止滾輪中的 BONUS 數量
        bonus_count = 0
        bonus_positions = []
        
        for reel_idx in range(min(3, len(current_symbols))):  # 只檢查前3輪
            if self.reel_states[reel_idx] == ReelState.STOPPED:
                for pos, symbol in enumerate(current_symbols[reel_idx]):
                    if symbol == bonus_symbol_id:
                        bonus_count += 1
                        bonus_positions.append((reel_idx, pos))
                        break  # 每輪最多計算一個
        
        # 計算剩餘滾輪的觸發機率
        remaining_reels = 3 - len([r for r in self.reel_states[:3] if r == ReelState.STOPPED])
        needed_bonus = max(0, 3 - bonus_count)
        
        if needed_bonus > remaining_reels:
            trigger_probability = 0.0
        elif needed_bonus == 0:
            trigger_probability = 1.0
        else:
            # 簡化的機率計算 (實際遊戲中會基於滾輪條帶的精確分析)
            bonus_rate = 0.1  # 假設每輪 10% 機率出現 BONUS
            trigger_probability = bonus_rate ** needed_bonus
        
        return {
            "current_bonus_count": bonus_count,
            "needed_bonus": needed_bonus,
            "remaining_reels": remaining_reels,
            "trigger_probability": trigger_probability,
            "bonus_positions": bonus_positions
        }
    
    def get_reel_state_info(self) -> Dict[str, Any]:
        """獲取滾輪狀態信息"""
        return {
            "reel_states": [state for state in self.reel_states],
            "current_positions": self.current_positions[:],
            "target_positions": self.target_positions[:],
            "slow_motion_flags": self.slow_motion_flags[:],
            "is_all_stopped": all(state == ReelState.STOPPED for state in self.reel_states)
        }
    
    def reset(self):
        """重置滾輪控制器"""
        self.reel_states = [ReelState.IDLE] * self.reel_count
        self.current_positions = [0] * self.reel_count
        self.target_positions = [0] * self.reel_count
        self.slow_motion_flags = [False] * self.reel_count
    
    def validate_target_result(self, target_result: List[List[int]]) -> bool:
        """驗證目標結果是否可以在滾輪條帶中找到"""
        for reel_idx, target_symbols in enumerate(target_result):
            reel_strip = self.reel_strips[reel_idx]
            strip_length = len(reel_strip)
            
            found = False
            for start_pos in range(strip_length):
                match = True
                for i in range(len(target_symbols)):
                    strip_symbol = reel_strip[(start_pos + i) % strip_length]
                    if strip_symbol != target_symbols[i]:
                        match = False
                        break
                
                if match:
                    found = True
                    break
            
            if not found:
                return False
        
        return True