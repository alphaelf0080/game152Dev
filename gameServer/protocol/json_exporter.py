"""
遊戲結果 JSON 輸出器
根據 proto 定義將遊戲結果輸出為 JSON 格式
"""

import json
import os
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict


@dataclass
class WinLineData:
    """WinLine 數據結構"""
    win_line_type: int = 0  # 0: kCommon, 1: kXTotalBet, 2: kXTotalBetTrigger
    line_no: int = -1
    symbol_id: int = 0
    pos: List[int] = None
    credit: int = 0
    multiplier: int = 1
    credit_long: int = 0
    
    def __post_init__(self):
        if self.pos is None:
            self.pos = []
        if self.credit_long == 0:
            self.credit_long = self.credit


@dataclass
class WinBonusData:
    """WinBonus 數據結構"""
    module_id: str = ""
    times: int = 0


@dataclass
class SubResultData:
    """SubResult 數據結構"""
    sub_game_id: int = 1
    credit: int = 0
    win_line_group: List[WinLineData] = None
    rng: List[int] = None
    win_bonus_group: List[WinBonusData] = None
    trigger_super_scatter: List[bool] = None
    
    def __post_init__(self):
        if self.win_line_group is None:
            self.win_line_group = []
        if self.rng is None:
            self.rng = []
        if self.win_bonus_group is None:
            self.win_bonus_group = []
        if self.trigger_super_scatter is None:
            self.trigger_super_scatter = []


@dataclass
class SlotResultData:
    """SlotResult 數據結構 (按照 proto 定義)"""
    module_id: str = "00152"
    credit: int = 0
    rng: List[int] = None
    win_line_group: List[WinLineData] = None
    multiplier_alone: Optional[int] = None
    mulitplier_pattern: List[int] = None
    random_syb_pattern: List[int] = None
    bonus_multiplier: Optional[int] = None
    win_bonus_group: List[WinBonusData] = None
    be_locked_pattern: List[int] = None
    position_pay: List[int] = None
    golden_wild_flag: List[bool] = None
    pay_of_scatter: List[int] = None
    capture_award: Optional[int] = None
    win_line_multiple: Optional[int] = None
    overlap: List[bool] = None
    pay_of_pos: List[int] = None
    exp_wild: List[bool] = None
    pre_exp_wild: List[bool] = None
    trigger_respin_times: Optional[int] = None
    push_wild: List[bool] = None
    sub_result: List[SubResultData] = None
    icon_accumulate: Optional[int] = None
    scatter_type: List[int] = None
    pre_scatter_type: List[int] = None
    full_pay: Optional[int] = None
    block_reel_index: Optional[int] = None
    trigger_super_scatter: List[bool] = None
    strip_index: Optional[int] = None
    random_bonus_times: Optional[int] = None
    bonus_multiplier_list: List[int] = None
    bonus_multiplier_index: Optional[int] = None
    col_cascade_count: List[int] = None
    external_multiplier: Optional[int] = None
    pre_no_win_acc: Optional[int] = None
    no_win_acc: Optional[int] = None
    respin_types: List[int] = None
    respin_costs: List[int] = None
    jackpot_rng: Optional[int] = None
    jackpot_type: Optional[int] = None
    capture_award_list: List[int] = None
    capture_award_index: Optional[int] = None
    golden_scatter_flag: List[bool] = None
    full_symbol: Optional[int] = None
    pay_of_star: List[int] = None
    collect_counter: Optional[int] = None
    cur_collect_counter: Optional[int] = None
    upgrade_id: List[int] = None
    change_symbol_id: Optional[int] = None
    full_symbol_pattern: List[int] = None
    avg_bet: Optional[int] = None
    trigger_bonus_total_bet: Optional[int] = None
    respin_reels: List[int] = None
    next_strip_index: Optional[int] = None
    last_player_opt_index: Optional[int] = None
    cur_star_counts: List[int] = None
    cur_random_prize: List[int] = None
    crush_syb_pattern: List[int] = None
    bonus_symbol_pos: Optional[int] = None
    
    def __post_init__(self):
        # 初始化所有 List 欄位
        list_fields = [
            'rng', 'win_line_group', 'mulitplier_pattern', 'random_syb_pattern',
            'win_bonus_group', 'be_locked_pattern', 'position_pay', 'golden_wild_flag',
            'pay_of_scatter', 'overlap', 'pay_of_pos', 'exp_wild', 'pre_exp_wild',
            'push_wild', 'sub_result', 'scatter_type', 'pre_scatter_type',
            'trigger_super_scatter', 'bonus_multiplier_list', 'col_cascade_count',
            'respin_types', 'respin_costs', 'capture_award_list', 'golden_scatter_flag',
            'pay_of_star', 'upgrade_id', 'full_symbol_pattern', 'respin_reels',
            'cur_star_counts', 'cur_random_prize', 'crush_syb_pattern'
        ]
        
        for field in list_fields:
            if getattr(self, field) is None:
                setattr(self, field, [])


@dataclass
class ResultRecallData:
    """ResultRecall 數據結構"""
    msgid: int = 107  # eResultRecall
    status_code: int = 0  # 成功
    result: Optional[SlotResultData] = None
    player_cent: int = 0
    next_module: str = ""
    cur_module_play_times: int = 1
    cur_module_total_times: int = 1
    accounting_sn: int = 0


class ProtoJSONExporter:
    """Proto JSON 輸出器"""
    
    def __init__(self, output_dir: str = "output"):
        """
        初始化輸出器
        
        Args:
            output_dir: 輸出目錄
        """
        self.output_dir = output_dir
        self.ensure_output_dir()
        self.session_id = int(time.time())
        
    def ensure_output_dir(self):
        """確保輸出目錄存在"""
        os.makedirs(self.output_dir, exist_ok=True)
        
    def convert_game_result_to_proto_json(self, game_result: Dict[str, Any], 
                                        spin_number: int, bet_amount: int) -> Dict[str, Any]:
        """
        將遊戲結果轉換為 proto JSON 格式
        
        Args:
            game_result: 遊戲引擎返回的結果
            spin_number: 旋轉編號
            bet_amount: 下注金額
            
        Returns:
            proto 格式的 JSON 數據
        """
        # 創建 SlotResult
        slot_result = SlotResultData()
        slot_result.module_id = "00152"
        slot_result.credit = game_result.get('total_win', 0)
        
        # 設置 RNG (轉輪結果)
        if 'reels' in game_result:
            slot_result.random_syb_pattern = []
            for reel in game_result['reels']:
                slot_result.random_syb_pattern.extend(reel)
        
        # 設置贏線信息
        if 'wins' in game_result and game_result['wins']:
            for win in game_result['wins']:
                win_line = WinLineData()
                win_line.win_line_type = 0  # kCommon
                win_line.line_no = win.get('way_id', -1)
                win_line.symbol_id = win.get('symbol', 0)
                win_line.pos = win.get('positions', [])
                win_line.credit = win.get('pay', 0)
                win_line.multiplier = win.get('multiplier', 1)
                win_line.credit_long = win.get('pay', 0)
                
                slot_result.win_line_group.append(win_line)
        
        # 設置免費旋轉獎勵
        if 'free_spins_awarded' in game_result and game_result['free_spins_awarded'] > 0:
            win_bonus = WinBonusData()
            win_bonus.module_id = "free_spins"
            win_bonus.times = game_result['free_spins_awarded']
            slot_result.win_bonus_group.append(win_bonus)
        
        # 設置戰鼓倍率
        if 'war_drums_result' in game_result:
            drums_result = game_result['war_drums_result']
            if drums_result.get('total_multiplier', 1) > 1:
                slot_result.external_multiplier = drums_result['total_multiplier']
                
                # 記錄戰鼓圖案
                if 'drums' in drums_result:
                    slot_result.bonus_multiplier_list = [
                        drum.get('multiplier', 1) for drum in drums_result['drums']
                    ]
        
        # 設置散佈符號相關
        if 'scatter_count' in game_result:
            slot_result.pay_of_scatter = [game_result.get('scatter_pay', 0)]
        
        # 設置特殊標記
        if 'is_feature_buy' in game_result and game_result['is_feature_buy']:
            slot_result.avg_bet = bet_amount
            slot_result.trigger_bonus_total_bet = bet_amount
        
        # 創建 ResultRecall
        result_recall = ResultRecallData()
        result_recall.result = slot_result
        result_recall.player_cent = game_result.get('remaining_credit', 0)
        result_recall.accounting_sn = self.session_id * 10000 + spin_number
        
        # 轉換為字典並移除 None 值
        return self._clean_dict(asdict(result_recall))
    
    def _clean_dict(self, data: Any) -> Any:
        """
        清理字典，移除 None 值和空列表
        
        Args:
            data: 要清理的數據
            
        Returns:
            清理後的數據
        """
        if isinstance(data, dict):
            cleaned = {}
            for key, value in data.items():
                cleaned_value = self._clean_dict(value)
                if cleaned_value is not None:
                    if isinstance(cleaned_value, list):
                        if cleaned_value:  # 只保留非空列表
                            cleaned[key] = cleaned_value
                    else:
                        cleaned[key] = cleaned_value
            return cleaned
        elif isinstance(data, list):
            return [self._clean_dict(item) for item in data if item is not None]
        else:
            return data
    
    def save_single_result(self, game_result: Dict[str, Any], spin_number: int, 
                          bet_amount: int, filename: str = None) -> str:
        """
        保存單次遊戲結果到 JSON 檔案
        
        Args:
            game_result: 遊戲結果
            spin_number: 旋轉編號
            bet_amount: 下注金額
            filename: 檔案名稱（可選）
            
        Returns:
            保存的檔案路徑
        """
        proto_json = self.convert_game_result_to_proto_json(game_result, spin_number, bet_amount)
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"game_result_{timestamp}_spin_{spin_number}.json"
        
        filepath = os.path.join(self.output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(proto_json, f, indent=2, ensure_ascii=False)
        
        return filepath
    
    def save_batch_results(self, results: List[Dict[str, Any]], 
                          bet_amounts: List[int] = None, 
                          filename: str = None) -> str:
        """
        批量保存遊戲結果到 JSON 檔案
        
        Args:
            results: 遊戲結果列表
            bet_amounts: 下注金額列表
            filename: 檔案名稱（可選）
            
        Returns:
            保存的檔案路徑
        """
        if bet_amounts is None:
            bet_amounts = [10] * len(results)  # 預設下注額
        
        batch_data = {
            "session_info": {
                "session_id": self.session_id,
                "total_spins": len(results),
                "timestamp": datetime.now().isoformat(),
                "game_module": "00152"
            },
            "results": []
        }
        
        for i, (result, bet) in enumerate(zip(results, bet_amounts)):
            proto_json = self.convert_game_result_to_proto_json(result, i + 1, bet)
            batch_data["results"].append({
                "spin_number": i + 1,
                "bet_amount": bet,
                "result_recall": proto_json
            })
        
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"batch_results_{timestamp}_{len(results)}_spins.json"
        
        filepath = os.path.join(self.output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(batch_data, f, indent=2, ensure_ascii=False)
        
        return filepath
    
    def create_summary_report(self, results: List[Dict[str, Any]], 
                            bet_amounts: List[int] = None) -> Dict[str, Any]:
        """
        創建摘要報告
        
        Args:
            results: 遊戲結果列表
            bet_amounts: 下注金額列表
            
        Returns:
            摘要報告字典
        """
        if not results:
            return {}
        
        if bet_amounts is None:
            bet_amounts = [10] * len(results)
        
        total_spins = len(results)
        total_bet = sum(bet_amounts)
        total_win = sum(result.get('total_win', 0) for result in results)
        
        win_spins = sum(1 for result in results if result.get('total_win', 0) > 0)
        feature_triggers = sum(1 for result in results if result.get('free_spins_awarded', 0) > 0)
        war_drums_triggers = sum(1 for result in results 
                               if result.get('war_drums_result', {}).get('total_multiplier', 1) > 1)
        
        max_win = max((result.get('total_win', 0) for result in results), default=0)
        
        return {
            "summary": {
                "total_spins": total_spins,
                "total_bet": total_bet,
                "total_win": total_win,
                "net_result": total_win - total_bet,
                "rtp_percentage": (total_win / total_bet * 100) if total_bet > 0 else 0,
                "win_frequency": (win_spins / total_spins * 100) if total_spins > 0 else 0,
                "feature_frequency": (feature_triggers / total_spins * 100) if total_spins > 0 else 0,
                "war_drums_frequency": (war_drums_triggers / total_spins * 100) if total_spins > 0 else 0,
                "max_single_win": max_win,
                "session_id": self.session_id,
                "timestamp": datetime.now().isoformat()
            }
        }


# 輔助函數
def export_simulation_results_to_json(results: List[Dict[str, Any]], 
                                     bet_amounts: List[int] = None,
                                     output_dir: str = "json_output",
                                     include_summary: bool = True) -> Dict[str, str]:
    """
    將模擬結果輸出為 JSON 檔案
    
    Args:
        results: 遊戲結果列表
        bet_amounts: 下注金額列表
        output_dir: 輸出目錄
        include_summary: 是否包含摘要報告
        
    Returns:
        包含檔案路徑的字典
    """
    exporter = ProtoJSONExporter(output_dir)
    file_paths = {}
    
    # 保存批量結果
    batch_file = exporter.save_batch_results(results, bet_amounts)
    file_paths["batch_results"] = batch_file
    
    # 保存摘要報告
    if include_summary:
        summary = exporter.create_summary_report(results, bet_amounts)
        summary_file = os.path.join(output_dir, f"summary_report_{exporter.session_id}.json")
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        file_paths["summary_report"] = summary_file
    
    return file_paths