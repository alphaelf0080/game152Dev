"""
模擬設定管理器
管理所有模擬相關的設定參數
"""

import json
import os
from typing import Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class SimulationSettings:
    """模擬設定數據類"""
    # 通用設定
    default_spins: int = 50000
    default_bet: int = 10
    
    # 基礎模擬
    basic_total_spins: int = 100000
    basic_report_interval: int = 10000
    
    # 購買功能分析
    feature_buy_spins_per_option: int = 10000
    
    # 波動性分析
    volatility_num_sessions: int = 200
    volatility_spins_per_session: int = 10000
    
    # 功能特定設定
    free_spins_simulations: int = 5000
    war_drums_simulations: int = 20000
    feature_buy_simulations: int = 5000
    
    # 效能設定
    max_memory_mb: int = 512
    progress_reporting: bool = True
    detailed_logging: bool = False
    
    # 輸出設定
    save_detailed_results: bool = False
    export_csv: bool = False
    chart_generation: bool = False


class ConfigManager:
    """設定管理器"""
    
    def __init__(self, config_path: Optional[str] = None):
        """
        初始化設定管理器
        
        Args:
            config_path: 設定檔路徑，預設為 config/simulation_config.json
        """
        if config_path is None:
            config_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), 
                'config', 
                'simulation_config.json'
            )
        
        self.config_path = config_path
        self.settings = self._load_settings()
    
    def _load_settings(self) -> SimulationSettings:
        """載入設定檔"""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    config_data = json.load(f)
                
                return SimulationSettings(
                    # 通用設定
                    default_spins=config_data.get('general', {}).get('default_spins', 50000),
                    default_bet=config_data.get('general', {}).get('default_bet', 10),
                    
                    # 基礎模擬
                    basic_total_spins=config_data.get('basic_simulation', {}).get('total_spins', 100000),
                    basic_report_interval=config_data.get('basic_simulation', {}).get('report_interval', 10000),
                    
                    # 購買功能分析
                    feature_buy_spins_per_option=config_data.get('feature_buy_analysis', {}).get('spins_per_option', 10000),
                    
                    # 波動性分析
                    volatility_num_sessions=config_data.get('volatility_analysis', {}).get('num_sessions', 200),
                    volatility_spins_per_session=config_data.get('volatility_analysis', {}).get('spins_per_session', 10000),
                    
                    # 功能特定設定
                    free_spins_simulations=config_data.get('feature_specific', {}).get('free_spins', {}).get('num_simulations', 5000),
                    war_drums_simulations=config_data.get('feature_specific', {}).get('war_drums', {}).get('num_simulations', 20000),
                    feature_buy_simulations=config_data.get('feature_specific', {}).get('feature_buy', {}).get('num_simulations', 5000),
                    
                    # 效能設定
                    max_memory_mb=config_data.get('performance', {}).get('max_memory_mb', 512),
                    progress_reporting=config_data.get('performance', {}).get('progress_reporting', True),
                    detailed_logging=config_data.get('performance', {}).get('detailed_logging', False),
                    
                    # 輸出設定
                    save_detailed_results=config_data.get('output', {}).get('save_detailed_results', False),
                    export_csv=config_data.get('output', {}).get('export_csv', False),
                    chart_generation=config_data.get('output', {}).get('chart_generation', False)
                )
            else:
                print(f"設定檔不存在: {self.config_path}，使用預設設定")
                return SimulationSettings()
                
        except Exception as e:
            print(f"載入設定檔失敗: {e}，使用預設設定")
            return SimulationSettings()
    
    def save_settings(self) -> bool:
        """儲存設定到檔案"""
        try:
            config_data = {
                "general": {
                    "description": "通用模擬設定",
                    "default_spins": self.settings.default_spins,
                    "default_bet": self.settings.default_bet
                },
                "basic_simulation": {
                    "description": "基礎遊戲模擬設定",
                    "total_spins": self.settings.basic_total_spins,
                    "report_interval": self.settings.basic_report_interval
                },
                "feature_buy_analysis": {
                    "description": "購買功能分析設定",
                    "spins_per_option": self.settings.feature_buy_spins_per_option,
                    "analyze_all_options": True
                },
                "volatility_analysis": {
                    "description": "波動性分析設定",
                    "num_sessions": self.settings.volatility_num_sessions,
                    "spins_per_session": self.settings.volatility_spins_per_session,
                    "calculate_percentiles": [1, 5, 10, 25, 50, 75, 90, 95, 99]
                },
                "feature_specific": {
                    "free_spins": {
                        "description": "免費旋轉模擬設定",
                        "num_simulations": self.settings.free_spins_simulations
                    },
                    "war_drums": {
                        "description": "戰鼓模擬設定", 
                        "num_simulations": self.settings.war_drums_simulations
                    },
                    "feature_buy": {
                        "description": "購買功能模擬設定",
                        "num_simulations": self.settings.feature_buy_simulations
                    }
                },
                "performance": {
                    "description": "效能設定",
                    "max_memory_mb": self.settings.max_memory_mb,
                    "progress_reporting": self.settings.progress_reporting,
                    "detailed_logging": self.settings.detailed_logging
                },
                "output": {
                    "description": "輸出設定",
                    "save_detailed_results": self.settings.save_detailed_results,
                    "export_csv": self.settings.export_csv,
                    "chart_generation": self.settings.chart_generation
                }
            }
            
            # 確保目錄存在
            os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
            
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(config_data, f, indent=4, ensure_ascii=False)
            
            return True
            
        except Exception as e:
            print(f"儲存設定檔失敗: {e}")
            return False
    
    def get_setting(self, key: str, default_value: Any = None) -> Any:
        """取得特定設定值"""
        return getattr(self.settings, key, default_value)
    
    def update_setting(self, key: str, value: Any) -> bool:
        """更新特定設定值"""
        try:
            if hasattr(self.settings, key):
                setattr(self.settings, key, value)
                return True
            else:
                print(f"未知的設定鍵: {key}")
                return False
        except Exception as e:
            print(f"更新設定失敗: {e}")
            return False
    
    def print_current_settings(self):
        """印出目前的設定"""
        print("\n=== 目前模擬設定 ===")
        print(f"預設旋轉次數:         {self.settings.default_spins:,}")
        print(f"預設下注額:           {self.settings.default_bet}")
        print(f"基礎模擬旋轉次數:     {self.settings.basic_total_spins:,}")
        print(f"購買功能分析次數:     {self.settings.feature_buy_spins_per_option:,}")
        print(f"波動性分析會話數:     {self.settings.volatility_num_sessions}")
        print(f"每會話旋轉次數:       {self.settings.volatility_spins_per_session:,}")
        print(f"免費旋轉模擬次數:     {self.settings.free_spins_simulations:,}")
        print(f"戰鼓模擬次數:         {self.settings.war_drums_simulations:,}")
        print(f"進度報告:             {'開啟' if self.settings.progress_reporting else '關閉'}")
        print(f"詳細記錄:             {'開啟' if self.settings.detailed_logging else '關閉'}")


# 全域設定管理器實例
config_manager = ConfigManager()

def get_simulation_settings() -> SimulationSettings:
    """取得模擬設定"""
    return config_manager.settings

def update_simulation_setting(key: str, value: Any) -> bool:
    """更新模擬設定"""
    return config_manager.update_setting(key, value)

def save_simulation_settings() -> bool:
    """儲存模擬設定"""
    return config_manager.save_settings()