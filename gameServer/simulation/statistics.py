"""
統計分析器 - 分析遊戲模擬數據並生成統計報告
"""

import statistics
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class WinDistribution:
    """贏分分布統計"""
    mean: float
    median: float
    std_dev: float
    min_win: int
    max_win: int
    percentiles: Dict[int, float]

class StatisticsAnalyzer:
    """統計分析器類"""
    
    def __init__(self):
        """初始化統計分析器"""
        self.analysis_cache = {}
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """計算百分位數 (簡化實現)"""
        sorted_data = sorted(data)
        index = int(len(sorted_data) * percentile / 100)
        return sorted_data[min(index, len(sorted_data) - 1)]
    
    def analyze_win_distribution(self, win_data: List[int]) -> WinDistribution:
        """分析贏分分布"""
        if not win_data:
            return WinDistribution(0, 0, 0, 0, 0, {})
        
        mean_win = statistics.mean(win_data)
        median_win = statistics.median(win_data)
        std_dev = statistics.stdev(win_data) if len(win_data) > 1 else 0
        
        # 計算百分位數
        percentiles = {}
        for p in [10, 25, 50, 75, 90, 95, 99]:
            percentiles[p] = self._percentile(win_data, p)
        
        return WinDistribution(
            mean=mean_win,
            median=median_win,
            std_dev=std_dev,
            min_win=min(win_data),
            max_win=max(win_data),
            percentiles=percentiles
        )
    
    def calculate_basic_stats(self, data: List[float]) -> Dict[str, float]:
        """計算基礎統計指標"""
        if not data:
            return {}
        
        return {
            "count": len(data),
            "mean": statistics.mean(data),
            "median": statistics.median(data),
            "std_dev": statistics.stdev(data) if len(data) > 1 else 0,
            "min": min(data),
            "max": max(data),
            "sum": sum(data)
        }