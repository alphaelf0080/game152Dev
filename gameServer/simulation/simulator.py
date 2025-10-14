"""
遊戲模擬器 - 執行大量遊戲模擬以分析遊戲數學模型
"""

import random
import time
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import json
import statistics

# 相對導入
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.game_engine import GameEngine, SpinType, SpinResult
from features.free_spins import FreeSpinsFeature
from features.war_drums import WarDrumsFeature
from features.feature_buy import FeatureBuyController, PurchaseOption
from protocol.json_exporter import ProtoJSONExporter, export_simulation_results_to_json
from protocol.event_log_exporter import export_simulation_to_event_log
from protocol.simple_data_exporter import export_simulation_to_simple_data

@dataclass
class SimulationConfig:
    """模擬配置"""
    total_spins: int = 10000  # 修改默認模擬次數為10,000次
    base_bet: int = 50
    player_initial_credit: int = 1000000
    feature_buy_enabled: bool = True
    auto_buy_threshold: float = 0.1  # 10% 機率自動購買特色
    seed: Optional[int] = None

@dataclass
class SimulationResult:
    """模擬結果"""
    total_spins: int
    total_bet: int
    total_win: int
    net_result: int
    feature_triggers: int
    feature_buys: int
    biggest_win: int
    rtp_percentage: float
    feature_trigger_rate: float
    average_win_per_spin: float
    simulation_time: float

class GameSimulator:
    """遊戲模擬器類"""
    
    def __init__(self, config_path: str = "config/game_config.json", paytable_path: str = "config/paytable.json"):
        """初始化模擬器"""
        self.game_engine = GameEngine(config_path, paytable_path)
        self.simulation_history = []
        self.detailed_logs = []
        
    def run_basic_simulation(self, config: SimulationConfig) -> SimulationResult:
        """運行基礎模擬"""
        if config.seed:
            random.seed(config.seed)
        
        start_time = time.time()
        
        # 重置遊戲引擎
        self.game_engine.reset_game_state()
        self.game_engine.player_credit = config.player_initial_credit
        self.game_engine.current_bet = config.base_bet
        
        # 模擬變量
        total_bet = 0
        total_win = 0
        feature_triggers = 0
        feature_buys = 0
        biggest_win = 0
        spin_results = []
        
        # 執行模擬
        for spin_num in range(config.total_spins):
            # 決定是否購買特色
            should_buy_feature = (
                config.feature_buy_enabled and 
                random.random() < config.auto_buy_threshold and
                self.game_engine.free_spins_remaining == 0
            )
            
            if should_buy_feature:
                # 隨機選擇購買選項
                buy_options = [SpinType.FEATURE_BUY_60X, SpinType.FEATURE_BUY_80X, SpinType.FEATURE_BUY_100X]
                spin_type = random.choice(buy_options)
                feature_buys += 1
            else:
                spin_type = SpinType.NORMAL
            
            # 執行旋轉
            try:
                if self.game_engine.free_spins_remaining > 0:
                    result = self.game_engine.spin_free_game()
                else:
                    result = self.game_engine.spin(spin_type)
                
                # 記錄統計
                bet_amount = config.base_bet
                if spin_type != SpinType.NORMAL:
                    multipliers = {
                        SpinType.FEATURE_BUY_60X: 60,
                        SpinType.FEATURE_BUY_80X: 80,
                        SpinType.FEATURE_BUY_100X: 100
                    }
                    bet_amount *= multipliers[spin_type]
                
                total_bet += bet_amount
                total_win += result.total_credit
                
                if result.total_credit > biggest_win:
                    biggest_win = result.total_credit
                
                if result.is_feature_trigger:
                    feature_triggers += 1
                
                # 記錄詳細結果
                spin_data = {
                    "spin_number": spin_num + 1,
                    "spin_type": spin_type.name if hasattr(spin_type, 'name') else str(spin_type),
                    "bet_amount": bet_amount,
                    "win_amount": result.total_credit,
                    "is_feature_trigger": result.is_feature_trigger,
                    "free_spins_remaining": self.game_engine.free_spins_remaining,
                    "player_credit": self.game_engine.player_credit
                }
                spin_results.append(spin_data)
                
            except Exception as e:
                print(f"旋轉 {spin_num + 1} 發生錯誤: {e}")
                continue
        
        # 計算最終統計
        simulation_time = time.time() - start_time
        net_result = total_win - total_bet
        rtp_percentage = (total_win / total_bet * 100) if total_bet > 0 else 0
        feature_trigger_rate = (feature_triggers / config.total_spins) if config.total_spins > 0 else 0
        average_win_per_spin = total_win / config.total_spins if config.total_spins > 0 else 0
        
        result = SimulationResult(
            total_spins=config.total_spins,
            total_bet=total_bet,
            total_win=total_win,
            net_result=net_result,
            feature_triggers=feature_triggers,
            feature_buys=feature_buys,
            biggest_win=biggest_win,
            rtp_percentage=rtp_percentage,
            feature_trigger_rate=feature_trigger_rate,
            average_win_per_spin=average_win_per_spin,
            simulation_time=simulation_time
        )
        
        # 保存結果
        self.simulation_history.append(result)
        self.detailed_logs.append(spin_results)
        
        return result
    
    def run_feature_buy_analysis(self, spins_per_option: int = 1000) -> Dict[str, Any]:
        """運行特色購買分析"""
        analysis_results = {}
        
        for option in [SpinType.FEATURE_BUY_60X, SpinType.FEATURE_BUY_80X, SpinType.FEATURE_BUY_100X]:
            option_name = option.name
            results = []
            
            for _ in range(spins_per_option):
                # 重置遊戲狀態
                self.game_engine.reset_game_state()
                self.game_engine.player_credit = 1000000
                
                try:
                    # 購買並執行特色
                    result = self.game_engine.spin(option)
                    
                    # 執行免費旋轉
                    free_spin_total = 0
                    while self.game_engine.free_spins_remaining > 0:
                        fs_result = self.game_engine.spin_free_game()
                        free_spin_total += fs_result.total_credit
                    
                    results.append(free_spin_total)
                    
                except Exception as e:
                    print(f"特色購買分析錯誤 ({option_name}): {e}")
                    continue
            
            if results:
                # 計算統計
                cost_multipliers = {
                    SpinType.FEATURE_BUY_60X: 60,
                    SpinType.FEATURE_BUY_80X: 80,
                    SpinType.FEATURE_BUY_100X: 100
                }
                
                cost = 50 * cost_multipliers[option]  # 假設基礎押注為50
                avg_win = statistics.mean(results)
                
                analysis_results[option_name] = {
                    "cost": cost,
                    "average_win": avg_win,
                    "max_win": max(results),
                    "min_win": min(results),
                    "median_win": statistics.median(results),
                    "win_rate": sum(1 for r in results if r > cost) / len(results),
                    "rtp": (avg_win / cost) * 100,
                    "profit_margin": avg_win - cost,
                    "samples": len(results)
                }
        
        return analysis_results
    
    def run_volatility_analysis(self, num_sessions: int = 100, spins_per_session: int = 1000) -> Dict[str, Any]:
        """運行波動性分析"""
        session_results = []
        
        for session in range(num_sessions):
            config = SimulationConfig(
                total_spins=spins_per_session,
                base_bet=50,
                player_initial_credit=1000000,
                feature_buy_enabled=False,  # 純正常旋轉
                seed=None
            )
            
            result = self.run_basic_simulation(config)
            session_results.append(result.net_result)
        
        # 計算波動性指標
        mean_result = statistics.mean(session_results)
        std_dev = statistics.stdev(session_results) if len(session_results) > 1 else 0
        
        # 分析分布
        positive_sessions = sum(1 for r in session_results if r > 0)
        break_even_sessions = sum(1 for r in session_results if r == 0)
        negative_sessions = sum(1 for r in session_results if r < 0)
        
        # 風險指標
        max_loss = min(session_results)
        max_win = max(session_results)
        
        return {
            "total_sessions": num_sessions,
            "spins_per_session": spins_per_session,
            "mean_result": mean_result,
            "standard_deviation": std_dev,
            "volatility_index": std_dev / abs(mean_result) if mean_result != 0 else float('inf'),
            "positive_sessions": positive_sessions,
            "break_even_sessions": break_even_sessions,
            "negative_sessions": negative_sessions,
            "win_rate": positive_sessions / num_sessions,
            "max_loss": max_loss,
            "max_win": max_win,
            "percentiles": {
                "25th": self._percentile(session_results, 25),
                "50th": self._percentile(session_results, 50),
                "75th": self._percentile(session_results, 75),
                "90th": self._percentile(session_results, 90),
                "95th": self._percentile(session_results, 95)
            }
        }
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """計算百分位數"""
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        return sorted_data[min(index, len(sorted_data) - 1)]
    
    def run_rtp_verification(self, target_rtp: float = 96.0, tolerance: float = 1.0, 
                           max_spins: int = 1000000) -> Dict[str, Any]:
        """運行 RTP 驗證"""
        config = SimulationConfig(
            total_spins=max_spins,
            base_bet=50,
            player_initial_credit=10000000,  # 增加初始積分
            feature_buy_enabled=True,
            auto_buy_threshold=0.05  # 降低購買頻率
        )
        
        result = self.run_basic_simulation(config)
        
        rtp_difference = abs(result.rtp_percentage - target_rtp)
        within_tolerance = rtp_difference <= tolerance
        
        return {
            "target_rtp": target_rtp,
            "actual_rtp": result.rtp_percentage,
            "difference": rtp_difference,
            "within_tolerance": within_tolerance,
            "tolerance": tolerance,
            "total_spins": result.total_spins,
            "total_bet": result.total_bet,
            "total_win": result.total_win,
            "confidence_interval": self._calculate_rtp_confidence_interval(result),
            "recommendation": self._get_rtp_recommendation(result.rtp_percentage, target_rtp, tolerance)
        }
    
    def _calculate_rtp_confidence_interval(self, result: SimulationResult, confidence: float = 0.95) -> Dict[str, float]:
        """計算 RTP 信賴區間"""
        # 簡化的信賴區間計算
        import math
        
        if result.total_spins == 0:
            return {"lower": 0, "upper": 0}
        
        # 假設正態分布
        z_score = 1.96 if confidence == 0.95 else 2.58  # 95% 或 99% 信賴區間
        
        # 估計標準誤差
        p = result.rtp_percentage / 100
        se = math.sqrt(p * (1 - p) / result.total_spins) * 100
        
        margin_of_error = z_score * se
        
        return {
            "lower": max(0, result.rtp_percentage - margin_of_error),
            "upper": min(100, result.rtp_percentage + margin_of_error),
            "margin_of_error": margin_of_error
        }
    
    def _get_rtp_recommendation(self, actual_rtp: float, target_rtp: float, tolerance: float) -> str:
        """獲取 RTP 調整建議"""
        difference = actual_rtp - target_rtp
        
        if abs(difference) <= tolerance:
            return "RTP 在可接受範圍內，無需調整"
        elif difference > tolerance:
            return f"RTP 過高 ({difference:.2f}%)，建議降低賠付率或增加低價值符號"
        else:
            return f"RTP 過低 ({-difference:.2f}%)，建議提高賠付率或增加高價值符號"
    
    def export_simulation_data(self, filename: str, format: str = "json") -> bool:
        """導出模擬數據"""
        try:
            data = {
                "simulation_history": [asdict(result) for result in self.simulation_history],
                "detailed_logs": self.detailed_logs,
                "export_timestamp": time.time()
            }
            
            if format.lower() == "json":
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
            else:
                raise ValueError(f"不支持的格式: {format}")
            
            return True
            
        except Exception as e:
            print(f"導出數據失敗: {e}")
            return False
    
    def get_simulation_summary(self) -> Dict[str, Any]:
        """獲取模擬摘要"""
        if not self.simulation_history:
            return {"message": "沒有模擬歷史"}
        
        results = self.simulation_history
        
        return {
            "total_simulations": len(results),
            "total_spins": sum(r.total_spins for r in results),
            "average_rtp": statistics.mean([r.rtp_percentage for r in results]),
            "rtp_range": {
                "min": min(r.rtp_percentage for r in results),
                "max": max(r.rtp_percentage for r in results)
            },
            "feature_trigger_rates": {
                "average": statistics.mean([r.feature_trigger_rate for r in results]),
                "min": min(r.feature_trigger_rate for r in results),
                "max": max(r.feature_trigger_rate for r in results)
            },
            "biggest_wins": [r.biggest_win for r in results],
            "total_simulation_time": sum(r.simulation_time for r in results)
        }
    
    def run_simulation_with_json_export(self, config: SimulationConfig = None, 
                                      export_json: bool = True,
                                      output_dir: str = "json_output") -> Tuple[SimulationResult, Optional[Dict[str, str]]]:
        """
        運行模擬並輸出 JSON 格式結果
        
        Args:
            config: 模擬配置
            export_json: 是否輸出 JSON
            output_dir: JSON 輸出目錄
            
        Returns:
            模擬結果和 JSON 檔案路徑（如果啟用）
        """
        if config is None:
            config = SimulationConfig()
        
        print(f"🎮 開始遊戲模擬 ({config.total_spins:,} 次旋轉)")
        if export_json:
            print(f"📁 JSON 輸出至: {output_dir}")
        
        # 重設遊戲引擎
        self.game_engine = GameEngine()
        
        start_time = time.time()
        detailed_results = []  # 存儲詳細的每次旋轉結果
        bet_amounts = []       # 存儲每次下注金額
        
        total_bet = 0
        total_win = 0
        feature_triggers = 0
        feature_buys = 0
        biggest_win = 0
        
        # 執行模擬
        for spin_num in range(config.total_spins):
            # 決定是否購買特色
            should_buy_feature = (
                config.feature_buy_enabled and 
                random.random() < config.auto_buy_threshold and
                self.game_engine.free_spins_remaining == 0
            )
            
            if should_buy_feature:
                buy_options = [SpinType.FEATURE_BUY_60X, SpinType.FEATURE_BUY_80X, SpinType.FEATURE_BUY_100X]
                spin_type = random.choice(buy_options)
                feature_buys += 1
            else:
                spin_type = SpinType.NORMAL
            
            # 執行旋轉
            try:
                if self.game_engine.free_spins_remaining > 0:
                    result = self.game_engine.spin_free_game()
                else:
                    result = self.game_engine.spin(spin_type)
                
                # 計算下注金額
                bet_amount = config.base_bet
                if spin_type != SpinType.NORMAL:
                    multipliers = {
                        SpinType.FEATURE_BUY_60X: 60,
                        SpinType.FEATURE_BUY_80X: 80,
                        SpinType.FEATURE_BUY_100X: 100
                    }
                    bet_amount *= multipliers[spin_type]
                
                total_bet += bet_amount
                total_win += result.total_credit
                bet_amounts.append(bet_amount)
                
                if result.total_credit > biggest_win:
                    biggest_win = result.total_credit
                
                if result.is_feature_trigger:
                    feature_triggers += 1
                
                # 構建詳細結果（符合 proto 結構）
                detailed_result = {
                    "spin_number": spin_num + 1,
                    "reels": result.reel_result if hasattr(result, 'reel_result') else getattr(result, 'reels', []),
                    "total_win": result.total_credit,
                    "wins": [],
                    "free_spins_awarded": result.free_spins_awarded if result.is_feature_trigger else 0,
                    "scatter_count": getattr(result, 'scatter_count', 0),
                    "scatter_pay": getattr(result, 'scatter_pay', result.scatter_win if hasattr(result, 'scatter_win') else 0),
                    "war_drums_result": {},
                    "is_feature_buy": spin_type != SpinType.NORMAL,
                    "remaining_credit": self.game_engine.player_credit,
                    "bet_amount": bet_amount,
                    "spin_type": spin_type.name if hasattr(spin_type, 'name') else str(spin_type)
                }
                
                # 添加贏線信息
                if hasattr(result, 'win_lines') and result.win_lines:
                    for win_line in result.win_lines:
                        win_info = {
                            "symbol": win_line.symbol_id,
                            "pay": win_line.credit,
                            "positions": win_line.positions,
                            "multiplier": win_line.multiplier,
                            "way_id": win_line.line_no
                        }
                        detailed_result["wins"].append(win_info)
                elif hasattr(result, 'win_details') and result.win_details:
                    for win in result.win_details:
                        win_info = {
                            "symbol": win.get('symbol', 0),
                            "pay": win.get('pay', 0),
                            "positions": win.get('positions', []),
                            "multiplier": win.get('multiplier', 1),
                            "way_id": win.get('way_id', -1)
                        }
                        detailed_result["wins"].append(win_info)
                
                # 添加戰鼓結果
                if hasattr(result, 'war_drums_multiplier') and result.war_drums_multiplier > 1:
                    detailed_result["war_drums_result"] = {
                        "total_multiplier": result.war_drums_multiplier,
                        "drums": getattr(result, 'war_drums_details', [])
                    }
                
                detailed_results.append(detailed_result)
                
                # 進度報告
                if (spin_num + 1) % 1000 == 0:
                    progress = (spin_num + 1) / config.total_spins * 100
                    print(f"📊 進度: {progress:.1f}% ({spin_num + 1:,}/{config.total_spins:,})")
                    
            except Exception as e:
                print(f"旋轉 {spin_num + 1} 發生錯誤: {e}")
                bet_amounts.append(config.base_bet)  # 添加預設下注額
                continue
        
        # 計算最終統計
        simulation_time = time.time() - start_time
        net_result = total_win - total_bet
        rtp_percentage = (total_win / total_bet * 100) if total_bet > 0 else 0
        feature_trigger_rate = (feature_triggers / config.total_spins) if config.total_spins > 0 else 0
        average_win_per_spin = total_win / config.total_spins if config.total_spins > 0 else 0
        
        simulation_result = SimulationResult(
            total_spins=config.total_spins,
            total_bet=total_bet,
            total_win=total_win,
            net_result=net_result,
            feature_triggers=feature_triggers,
            feature_buys=feature_buys,
            biggest_win=biggest_win,
            rtp_percentage=rtp_percentage,
            feature_trigger_rate=feature_trigger_rate,
            average_win_per_spin=average_win_per_spin,
            simulation_time=simulation_time
        )
        
        # 保存到歷史
        self.simulation_history.append(simulation_result)
        
        # 輸出 JSON 檔案
        json_files = None
        if export_json and detailed_results:
            try:
                # 1. 簡化數據格式輸出（主要格式）✨
                simple_data_path = os.path.join(output_dir, "game_results.json")
                simple_data_file = export_simulation_to_simple_data(
                    results=detailed_results,
                    output_path=simple_data_path
                )
                json_files = {"game_results": simple_data_file}
                print(f"✅ 遊戲結果已保存 (簡化格式):")
                print(f"   game_results: {simple_data_file}")
                
                # 2. 原有格式輸出（備用）
                original_files = export_simulation_results_to_json(
                    results=detailed_results,
                    bet_amounts=bet_amounts,
                    output_dir=output_dir,
                    include_summary=True
                )
                json_files.update(original_files)
                print(f"✅ 原格式檔案已保存:")
                for file_type, file_path in original_files.items():
                    print(f"   {file_type}: {file_path}")
                
                # 3. 事件日誌格式輸出（可選）
                event_log_path = os.path.join(output_dir, "event_log_results.json")
                event_log_file = export_simulation_to_event_log(
                    results=detailed_results,
                    output_path=event_log_path,
                    game_id="PSS-ON-00152",
                    add_connection_events=True,
                    reconnect_interval=50  # 每50個spin模擬一次斷線重連
                )
                json_files["event_log"] = event_log_file
                print(f"✅ 事件日誌格式已保存:")
                print(f"   event_log: {event_log_file}")
                
            except Exception as e:
                print(f"❌ JSON 輸出失敗: {e}")
                import traceback
                traceback.print_exc()
        
        return simulation_result, json_files