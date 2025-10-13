"""
符號變換器 - 處理免費旋轉中的符號變換邏輯
實現好運咚咚遊戲中 P 系列符號的隨機變換機制
"""

from typing import List, Dict, Any, Tuple
import random

class SymbolTransformer:
    """符號變換器類"""
    
    def __init__(self, config: Dict[str, Any]):
        """初始化符號變換器"""
        self.config = config
        self.symbols = config.get("symbols", {})
        
        # P 系列符號 ID
        self.p_symbols = {
            "P1": self._get_symbol_id("P1"),
            "P2": self._get_symbol_id("P2"),
            "P3": self._get_symbol_id("P3"),
            "P4": self._get_symbol_id("P4"),
            "P5": self._get_symbol_id("P5")
        }
        
        # 變換權重 (根據遊戲說明，高階符號機率較低)
        self.transform_weights = {
            "P1": 25,  # 最高機率
            "P2": 20,
            "P3": 20,
            "P4": 15,
            "P5": 10   # 最低機率 (~30% 相對於 P1)
        }
    
    def _get_symbol_id(self, symbol_name: str) -> int:
        """獲取符號ID"""
        return self.symbols.get(symbol_name, {}).get("id", -1)
    
    def _get_symbol_name(self, symbol_id: int) -> str:
        """根據ID獲取符號名稱"""
        for name, data in self.symbols.items():
            if data.get("id") == symbol_id:
                return name
        return "UNKNOWN"
    
    def transform_symbols(self, reel_result: List[List[int]]) -> List[List[int]]:
        """
        應用符號變換邏輯
        在免費旋轉中，所有 P 系列符號會隨機變換成其他 P 系列符號
        """
        transformed_result = []
        
        for reel_symbols in reel_result:
            transformed_reel = []
            for symbol in reel_symbols:
                transformed_symbol = self._transform_single_symbol(symbol)
                transformed_reel.append(transformed_symbol)
            transformed_result.append(transformed_reel)
        
        return transformed_result
    
    def _transform_single_symbol(self, symbol_id: int) -> int:
        """變換單個符號"""
        symbol_name = self._get_symbol_name(symbol_id)
        
        # 只變換 P 系列符號
        if symbol_name in self.p_symbols:
            return self._random_p_symbol()
        
        # 檢查是否為特殊的寶藏符號變換
        if self._is_treasure_symbol(symbol_id):
            return self._apply_treasure_transform(symbol_id)
        
        return symbol_id
    
    def _random_p_symbol(self) -> int:
        """隨機選擇一個 P 系列符號"""
        symbols = list(self.p_symbols.keys())
        weights = [self.transform_weights[symbol] for symbol in symbols]
        
        chosen_symbol = random.choices(symbols, weights=weights)[0]
        return self.p_symbols[chosen_symbol]
    
    def _is_treasure_symbol(self, symbol_id: int) -> bool:
        """檢查是否為寶藏符號 (簡化實現)"""
        # 在實際遊戲中，這可能基於特定的遊戲狀態或標記
        return False
    
    def _apply_treasure_transform(self, symbol_id: int) -> int:
        """應用寶藏符號變換 (全盤變換邏輯)"""
        # 實現「全盤寶藏圖標」變換邏輯
        # 當出現寶藏符號時，所有相同類型的符號都會變成該符號
        return symbol_id
    
    def apply_special_transforms(self, reel_result: List[List[int]], transform_type: str = "V") -> List[List[int]]:
        """
        應用特殊變換模式
        transform_type: "V" (垂直變換) 或 "X" (交叉變換)
        """
        if transform_type == "V":
            return self._apply_v_transform(reel_result)
        elif transform_type == "X":
            return self._apply_x_transform(reel_result)
        else:
            return reel_result
    
    def _apply_v_transform(self, reel_result: List[List[int]]) -> List[List[int]]:
        """
        應用 V 型變換
        基於遊戲說明圖片，特定位置的符號進行變換
        """
        transformed_result = [reel[:] for reel in reel_result]  # 深拷貝
        
        # V 型變換邏輯 (根據圖片示例)
        # 變換第2、3輪的特定位置
        if len(transformed_result) >= 3:
            # 第2輪第1行 P3 -> T
            if transformed_result[1][1] == self.p_symbols["P3"]:
                transformed_result[1][1] = self._get_symbol_id("T")
            
            # 第3輪第2行 P3 -> P4  
            if transformed_result[2][2] == self.p_symbols["P3"]:
                transformed_result[2][2] = self.p_symbols["P4"]
        
        return transformed_result
    
    def _apply_x_transform(self, reel_result: List[List[int]]) -> List[List[int]]:
        """
        應用 X 型變換
        對角線或交叉模式的符號變換
        """
        transformed_result = [reel[:] for reel in reel_result]  # 深拷貝
        
        # X 型變換邏輯 (可以根據具體需求實現)
        # 例如：對角線位置的符號進行特殊變換
        reel_count = len(transformed_result)
        reel_height = len(transformed_result[0]) if reel_count > 0 else 0
        
        for i in range(min(reel_count, reel_height)):
            # 主對角線變換
            if i < reel_count and i < len(transformed_result[i]):
                symbol = transformed_result[i][i]
                if self._get_symbol_name(symbol) in self.p_symbols:
                    transformed_result[i][i] = self._random_p_symbol()
        
        return transformed_result
    
    def simulate_transformation_sequence(self, reel_result: List[List[int]], sequence: List[str]) -> List[List[List[int]]]:
        """
        模擬變換序列
        sequence: 變換類型的序列，如 ["V", "X", "normal"]
        返回每一步變換後的結果
        """
        results = [reel_result]  # 初始狀態
        current_result = [reel[:] for reel in reel_result]
        
        for transform_type in sequence:
            if transform_type == "normal":
                current_result = self.transform_symbols(current_result)
            else:
                current_result = self.apply_special_transforms(current_result, transform_type)
            
            # 添加深拷貝的結果
            results.append([reel[:] for reel in current_result])
        
        return results
    
    def get_transformation_stats(self, original: List[List[int]], transformed: List[List[int]]) -> Dict[str, Any]:
        """獲取變換統計信息"""
        total_symbols = 0
        changed_symbols = 0
        p_symbol_changes = 0
        
        for reel_idx in range(len(original)):
            for pos in range(len(original[reel_idx])):
                total_symbols += 1
                original_symbol = original[reel_idx][pos]
                transformed_symbol = transformed[reel_idx][pos]
                
                if original_symbol != transformed_symbol:
                    changed_symbols += 1
                    
                    # 檢查是否為 P 系列符號變換
                    orig_name = self._get_symbol_name(original_symbol)
                    trans_name = self._get_symbol_name(transformed_symbol)
                    
                    if orig_name in self.p_symbols and trans_name in self.p_symbols:
                        p_symbol_changes += 1
        
        return {
            "total_symbols": total_symbols,
            "changed_symbols": changed_symbols,
            "change_rate": changed_symbols / total_symbols if total_symbols > 0 else 0,
            "p_symbol_changes": p_symbol_changes,
            "p_change_rate": p_symbol_changes / changed_symbols if changed_symbols > 0 else 0
        }
    
    def preview_transformation(self, reel_result: List[List[int]]) -> Dict[str, Any]:
        """預覽變換結果"""
        transformed = self.transform_symbols(reel_result)
        stats = self.get_transformation_stats(reel_result, transformed)
        
        return {
            "original": reel_result,
            "transformed": transformed,
            "statistics": stats
        }