"""
特色購買控制器
實現好運咚咚遊戲的特色購買功能
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
import random

class PurchaseOption(Enum):
    """購買選項列舉"""
    OPTION_60X = "60x_1_drum"
    OPTION_80X = "80x_2_drums"
    OPTION_100X = "100x_3_drums"

@dataclass
class PurchaseConfig:
    """購買配置"""
    cost_multiplier: int
    drums_count: int
    option_name: str
    description: str

class FeatureBuyController:
    """特色購買控制器"""
    
    def __init__(self, config: Dict[str, Any]):
        """初始化特色購買控制器"""
        self.config = config
        
        # 載入購買選項配置
        feature_buy_config = config.get("feature_buy", {})
        self.purchase_options = {
            PurchaseOption.OPTION_60X: PurchaseConfig(
                cost_multiplier=feature_buy_config.get("option_1", {}).get("cost", 60),
                drums_count=feature_buy_config.get("option_1", {}).get("drums", 1),
                option_name=feature_buy_config.get("option_1", {}).get("name", "P3-X3"),
                description="60倍押注，免費旋轉時上方有1個鼓"
            ),
            PurchaseOption.OPTION_80X: PurchaseConfig(
                cost_multiplier=feature_buy_config.get("option_2", {}).get("cost", 80),
                drums_count=feature_buy_config.get("option_2", {}).get("drums", 2),
                option_name=feature_buy_config.get("option_2", {}).get("name", "P3-X4"),
                description="80倍押注，免費旋轉時上方有2個鼓"
            ),
            PurchaseOption.OPTION_100X: PurchaseConfig(
                cost_multiplier=feature_buy_config.get("option_3", {}).get("cost", 100),
                drums_count=feature_buy_config.get("option_3", {}).get("drums", 3),
                option_name=feature_buy_config.get("option_3", {}).get("name", "P3-X5"),
                description="100倍押注，免費旋轉時上方有3個鼓"
            )
        }
        
        # 購買歷史記錄
        self.purchase_history = []
        self.total_purchased = 0
        self.total_cost = 0
    
    def get_available_options(self) -> Dict[str, Dict[str, Any]]:
        """獲取可用的購買選項"""
        options = {}
        
        for option_enum, config in self.purchase_options.items():
            options[option_enum.value] = {
                "cost_multiplier": config.cost_multiplier,
                "drums_count": config.drums_count,
                "option_name": config.option_name,
                "description": config.description
            }
        
        return options
    
    def calculate_purchase_cost(self, option: PurchaseOption, current_bet: int) -> int:
        """計算購買成本"""
        if option not in self.purchase_options:
            raise ValueError(f"無效的購買選項: {option}")
        
        config = self.purchase_options[option]
        return current_bet * config.cost_multiplier
    
    def validate_purchase(self, option: PurchaseOption, current_bet: int, player_credit: int) -> Dict[str, Any]:
        """驗證購買條件"""
        if option not in self.purchase_options:
            return {
                "valid": False,
                "error": "無效的購買選項",
                "error_code": "INVALID_OPTION"
            }
        
        cost = self.calculate_purchase_cost(option, current_bet)
        
        if player_credit < cost:
            return {
                "valid": False,
                "error": f"積分不足。需要 {cost} 積分，當前只有 {player_credit} 積分",
                "error_code": "INSUFFICIENT_CREDIT",
                "required_credit": cost,
                "current_credit": player_credit,
                "shortage": cost - player_credit
            }
        
        return {
            "valid": True,
            "cost": cost,
            "option_config": self.purchase_options[option]
        }
    
    def execute_purchase(self, option: PurchaseOption, current_bet: int, player_credit: int) -> Dict[str, Any]:
        """執行購買"""
        validation = self.validate_purchase(option, current_bet, player_credit)
        
        if not validation["valid"]:
            return validation
        
        cost = validation["cost"]
        config = validation["option_config"]
        
        # 記錄購買
        purchase_record = {
            "option": option.value,
            "cost": cost,
            "drums_count": config.drums_count,
            "option_name": config.option_name,
            "bet_amount": current_bet,
            "timestamp": self._get_timestamp()
        }
        
        self.purchase_history.append(purchase_record)
        self.total_purchased += 1
        self.total_cost += cost
        
        return {
            "success": True,
            "purchase_record": purchase_record,
            "remaining_credit": player_credit - cost,
            "drums_awarded": config.drums_count,
            "free_spins_awarded": 7,  # 固定7次免費旋轉
            "message": f"成功購買 {config.option_name}！獲得7次免費旋轉和{config.drums_count}個戰鼓"
        }
    
    def get_purchase_recommendations(self, current_bet: int, player_credit: int) -> Dict[str, Any]:
        """獲取購買建議"""
        recommendations = {}
        
        for option_enum, config in self.purchase_options.items():
            cost = self.calculate_purchase_cost(option_enum, current_bet)
            affordable = player_credit >= cost
            
            # 計算性價比 (簡化分析)
            drums_per_cost = config.drums_count / config.cost_multiplier
            risk_level = "低" if config.cost_multiplier <= 60 else "中" if config.cost_multiplier <= 80 else "高"
            
            recommendation = {
                "option": option_enum.value,
                "cost": cost,
                "affordable": affordable,
                "drums_count": config.drums_count,
                "cost_multiplier": config.cost_multiplier,
                "drums_per_cost_ratio": drums_per_cost,
                "risk_level": risk_level,
                "recommendation_score": drums_per_cost * (1.2 if affordable else 0.5)
            }
            
            # 添加具體建議
            if not affordable:
                recommendation["suggestion"] = f"需要更多積分。還需要 {cost - player_credit} 積分"
            elif config.cost_multiplier == 60:
                recommendation["suggestion"] = "最經濟的選擇，適合保守玩家"
            elif config.cost_multiplier == 80:
                recommendation["suggestion"] = "平衡風險與回報，推薦選擇"
            else:
                recommendation["suggestion"] = "最高潛力，適合激進玩家"
            
            recommendations[option_enum.value] = recommendation
        
        # 排序推薦 (按推薦分數)
        sorted_recommendations = sorted(
            recommendations.items(),
            key=lambda x: x[1]["recommendation_score"],
            reverse=True
        )
        
        return {
            "recommendations": dict(sorted_recommendations),
            "top_recommendation": sorted_recommendations[0][0] if sorted_recommendations else None,
            "player_profile": self._analyze_player_profile(player_credit, current_bet)
        }
    
    def _analyze_player_profile(self, player_credit: int, current_bet: int) -> Dict[str, Any]:
        """分析玩家檔案"""
        credit_bet_ratio = player_credit / current_bet if current_bet > 0 else 0
        
        if credit_bet_ratio > 2000:
            profile = "高額玩家"
            suggestion = "可以考慮高風險高回報的選項"
        elif credit_bet_ratio > 1000:
            profile = "中等玩家"
            suggestion = "建議選擇平衡型選項"
        elif credit_bet_ratio > 200:
            profile = "保守玩家"
            suggestion = "建議選擇低成本選項"
        else:
            profile = "謹慎玩家"
            suggestion = "建議累積更多積分後再購買"
        
        return {
            "profile": profile,
            "credit_bet_ratio": credit_bet_ratio,
            "suggestion": suggestion
        }
    
    def get_purchase_statistics(self) -> Dict[str, Any]:
        """獲取購買統計"""
        if not self.purchase_history:
            return {"message": "沒有購買歷史"}
        
        # 選項統計
        option_counts = {}
        option_costs = {}
        
        for record in self.purchase_history:
            option = record["option"]
            option_counts[option] = option_counts.get(option, 0) + 1
            option_costs[option] = option_costs.get(option, 0) + record["cost"]
        
        # 計算平均成本
        average_cost = self.total_cost / self.total_purchased if self.total_purchased > 0 else 0
        
        # 最受歡迎的選項
        most_popular_option = max(option_counts.items(), key=lambda x: x[1])[0] if option_counts else None
        
        return {
            "total_purchases": self.total_purchased,
            "total_cost": self.total_cost,
            "average_cost_per_purchase": average_cost,
            "option_counts": option_counts,
            "option_total_costs": option_costs,
            "most_popular_option": most_popular_option,
            "purchase_frequency": {
                option: count / self.total_purchased for option, count in option_counts.items()
            }
        }
    
    def simulate_purchase_outcomes(self, option: PurchaseOption, num_simulations: int = 1000) -> Dict[str, Any]:
        """模擬購買結果"""
        from .free_spins import FreeSpinsFeature
        from .war_drums import WarDrumsFeature
        
        # 獲取配置
        config = self.purchase_options[option]
        
        # 初始化特色
        free_spins = FreeSpinsFeature(self.config)
        war_drums = WarDrumsFeature(self.config)
        war_drums.set_active_drums(config.drums_count)
        
        simulation_results = []
        
        for _ in range(num_simulations):
            # 模擬7次免費旋轉
            total_win = 0
            
            for spin in range(7):
                # 模擬基礎贏分
                base_win = max(0, int(random.gauss(200, 100)))  # 正態分布，平均200
                
                # 模擬戰鼓倍率
                drum_results = war_drums.roll_drums(base_win > 0)
                total_multiplier = war_drums.calculate_total_multiplier(drum_results)
                
                spin_win = base_win * total_multiplier
                total_win += spin_win
            
            simulation_results.append(total_win)
        
        # 統計分析
        avg_win = sum(simulation_results) / len(simulation_results)
        cost = config.cost_multiplier * 50  # 假設50為基礎押注
        
        return {
            "option": option.value,
            "simulations": num_simulations,
            "average_win": avg_win,
            "max_win": max(simulation_results),
            "min_win": min(simulation_results),
            "cost": cost,
            "average_rtp": (avg_win / cost) * 100 if cost > 0 else 0,
            "profit_probability": sum(1 for win in simulation_results if win > cost) / len(simulation_results),
            "drums_count": config.drums_count
        }
    
    def _get_timestamp(self) -> str:
        """獲取時間戳"""
        import datetime
        return datetime.datetime.now().isoformat()
    
    def reset_statistics(self):
        """重置統計數據"""
        self.purchase_history = []
        self.total_purchased = 0
        self.total_cost = 0