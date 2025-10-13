"""
戰鼓倍率特色功能
實現好運咚咚遊戲的戰鼓倍率機制
"""

from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
import random

@dataclass
class DrumResult:
    """單個戰鼓結果"""
    drum_id: int
    multiplier: int
    effect_type: str  # "normal", "震波", "華麗"

@dataclass
class WarDrumsConfig:
    """戰鼓配置"""
    max_drums: int = 3
    min_multiplier: int = 1
    max_multiplier: int = 10
    shock_wave_range: Tuple[int, int] = (5, 9)  # 震波特效範圍
    gorgeous_multiplier: int = 10  # 華麗特效倍率

class WarDrumsFeature:
    """戰鼓倍率特色類"""
    
    def __init__(self, config: Dict[str, Any]):
        """初始化戰鼓特色"""
        self.config = config
        self.war_drums_config = WarDrumsConfig()
        
        # 從配置中載入參數
        war_drums_settings = config.get("war_drums", {})
        if "multiplier_range" in war_drums_settings:
            range_values = war_drums_settings["multiplier_range"]
            self.war_drums_config.min_multiplier = range_values[0]
            self.war_drums_config.max_multiplier = range_values[1]
        
        # 特效設定
        special_effects = war_drums_settings.get("special_effects", {})
        if "震波" in special_effects:
            shock_range = special_effects["震波"]["range"]
            self.war_drums_config.shock_wave_range = (shock_range[0], shock_range[1])
        
        if "華麗" in special_effects:
            gorgeous_range = special_effects["華麗"]["range"]
            self.war_drums_config.gorgeous_multiplier = gorgeous_range[0]
        
        # 當前狀態
        self.active_drums = 0
        self.drum_history = []
        
        # 倍率權重分布 (基於真實老虎機邏輯)
        self.multiplier_weights = self._generate_multiplier_weights()
    
    def _generate_multiplier_weights(self) -> Dict[int, float]:
        """生成倍率權重分布"""
        # 低倍率權重較高，高倍率權重較低
        weights = {}
        total_weight = 0
        
        for mult in range(self.war_drums_config.min_multiplier, self.war_drums_config.max_multiplier + 1):
            # 反比例權重：倍率越高，權重越低
            weight = 100 / (mult ** 1.5)  # 平方根倒數權重
            weights[mult] = weight
            total_weight += weight
        
        # 標準化權重
        for mult in weights:
            weights[mult] = weights[mult] / total_weight
        
        return weights
    
    def set_active_drums(self, drum_count: int):
        """設置活動戰鼓數量"""
        if drum_count < 0 or drum_count > self.war_drums_config.max_drums:
            raise ValueError(f"戰鼓數量必須在 0-{self.war_drums_config.max_drums} 之間")
        
        self.active_drums = drum_count
    
    def roll_drums(self, has_win: bool = True) -> List[DrumResult]:
        """
        滾動戰鼓獲得倍率
        has_win: 是否有贏分 (只有贏分時戰鼓才會開啟)
        """
        if not has_win or self.active_drums == 0:
            return []
        
        drum_results = []
        
        for drum_id in range(self.active_drums):
            multiplier = self._roll_single_drum()
            effect_type = self._determine_effect_type(multiplier)
            
            drum_result = DrumResult(
                drum_id=drum_id,
                multiplier=multiplier,
                effect_type=effect_type
            )
            
            drum_results.append(drum_result)
        
        # 記錄歷史
        self.drum_history.append(drum_results)
        
        return drum_results
    
    def _roll_single_drum(self) -> int:
        """滾動單個戰鼓"""
        multipliers = list(self.multiplier_weights.keys())
        weights = list(self.multiplier_weights.values())
        
        return random.choices(multipliers, weights=weights)[0]
    
    def _determine_effect_type(self, multiplier: int) -> str:
        """根據倍率確定特效類型"""
        if multiplier == self.war_drums_config.gorgeous_multiplier:
            return "華麗"
        elif (self.war_drums_config.shock_wave_range[0] <= multiplier <= 
              self.war_drums_config.shock_wave_range[1]):
            return "震波"
        else:
            return "normal"
    
    def calculate_total_multiplier(self, drum_results: List[DrumResult]) -> int:
        """計算總倍率 (所有戰鼓倍率相加)"""
        if not drum_results:
            return 1
        
        total = sum(drum.multiplier for drum in drum_results)
        return max(1, total)  # 確保至少為1
    
    def apply_drums_to_win(self, base_win: int, drum_results: List[DrumResult]) -> Dict[str, Any]:
        """將戰鼓倍率應用到贏分"""
        if not drum_results or base_win == 0:
            return {
                "base_win": base_win,
                "total_multiplier": 1,
                "final_win": base_win,
                "drum_results": drum_results,
                "special_effects": []
            }
        
        total_multiplier = self.calculate_total_multiplier(drum_results)
        final_win = base_win * total_multiplier
        
        # 收集特效信息
        special_effects = []
        for drum in drum_results:
            if drum.effect_type != "normal":
                special_effects.append({
                    "drum_id": drum.drum_id,
                    "effect": drum.effect_type,
                    "multiplier": drum.multiplier
                })
        
        return {
            "base_win": base_win,
            "total_multiplier": total_multiplier,
            "final_win": final_win,
            "drum_results": drum_results,
            "special_effects": special_effects
        }
    
    def get_drums_breakdown(self, drum_results: List[DrumResult]) -> Dict[str, Any]:
        """獲取戰鼓詳細分解"""
        if not drum_results:
            return {"message": "沒有戰鼓結果"}
        
        breakdown = {
            "total_drums": len(drum_results),
            "individual_multipliers": [drum.multiplier for drum in drum_results],
            "total_multiplier": self.calculate_total_multiplier(drum_results),
            "effects_count": {
                "normal": sum(1 for drum in drum_results if drum.effect_type == "normal"),
                "震波": sum(1 for drum in drum_results if drum.effect_type == "震波"),
                "華麗": sum(1 for drum in drum_results if drum.effect_type == "華麗")
            },
            "max_single_multiplier": max(drum.multiplier for drum in drum_results),
            "min_single_multiplier": min(drum.multiplier for drum in drum_results)
        }
        
        return breakdown
    
    def simulate_drums_distribution(self, num_simulations: int = 10000) -> Dict[str, Any]:
        """模擬戰鼓分布統計"""
        simulation_data = {
            "multiplier_frequency": {i: 0 for i in range(1, 11)},
            "effect_frequency": {"normal": 0, "震波": 0, "華麗": 0},
            "total_multipliers": []
        }
        
        for _ in range(num_simulations):
            # 模擬3個戰鼓
            drums = []
            for _ in range(3):
                multiplier = self._roll_single_drum()
                effect = self._determine_effect_type(multiplier)
                drums.append(DrumResult(0, multiplier, effect))
            
            # 統計
            total_mult = self.calculate_total_multiplier(drums)
            simulation_data["total_multipliers"].append(total_mult)
            
            for drum in drums:
                simulation_data["multiplier_frequency"][drum.multiplier] += 1
                simulation_data["effect_frequency"][drum.effect_type] += 1
        
        # 計算統計信息
        total_multipliers = simulation_data["total_multipliers"]
        
        return {
            "simulations": num_simulations,
            "multiplier_distribution": {
                mult: count / (num_simulations * 3) for mult, count in simulation_data["multiplier_frequency"].items()
            },
            "effect_distribution": {
                effect: count / (num_simulations * 3) for effect, count in simulation_data["effect_frequency"].items()
            },
            "total_multiplier_stats": {
                "average": sum(total_multipliers) / len(total_multipliers),
                "max": max(total_multipliers),
                "min": min(total_multipliers),
                "median": sorted(total_multipliers)[len(total_multipliers) // 2]
            }
        }
    
    def get_purchase_option_analysis(self) -> Dict[str, Any]:
        """分析不同購買選項的戰鼓效果"""
        options = {
            "60x_1_drum": {"cost": 60, "drums": 1},
            "80x_2_drums": {"cost": 80, "drums": 2},
            "100x_3_drums": {"cost": 100, "drums": 3}
        }
        
        analysis = {}
        
        for option_name, option_data in options.items():
            drums_count = option_data["drums"]
            cost = option_data["cost"]
            
            # 模擬該選項的平均倍率
            total_multipliers = []
            for _ in range(1000):
                drum_results = []
                for _ in range(drums_count):
                    mult = self._roll_single_drum()
                    drum_results.append(DrumResult(0, mult, "normal"))
                
                total_mult = self.calculate_total_multiplier(drum_results)
                total_multipliers.append(total_mult)
            
            avg_multiplier = sum(total_multipliers) / len(total_multipliers)
            
            analysis[option_name] = {
                "cost": cost,
                "drums": drums_count,
                "average_multiplier": avg_multiplier,
                "cost_per_multiplier": cost / avg_multiplier,
                "expected_value": avg_multiplier / cost  # 倍率/成本比
            }
        
        return analysis
    
    def get_feature_status(self) -> Dict[str, Any]:
        """獲取戰鼓特色狀態"""
        return {
            "active_drums": self.active_drums,
            "total_drum_sessions": len(self.drum_history),
            "config": {
                "max_drums": self.war_drums_config.max_drums,
                "multiplier_range": (self.war_drums_config.min_multiplier, self.war_drums_config.max_multiplier),
                "shock_wave_range": self.war_drums_config.shock_wave_range,
                "gorgeous_multiplier": self.war_drums_config.gorgeous_multiplier
            }
        }
    
    def reset(self):
        """重置戰鼓狀態"""
        self.active_drums = 0
        self.drum_history = []