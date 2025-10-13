"""
簡化測試文件 - 驗證遊戲模擬器核心功能
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_basic_functionality():
    """測試基礎功能"""
    print("=== 好運咚咚遊戲模擬器測試 ===\n")
    
    try:
        # 測試核心引擎
        from core.game_engine import GameEngine, SpinType
        print("✓ 成功導入 GameEngine")
        
        engine = GameEngine()
        print("✓ 成功初始化遊戲引擎")
        
        # 測試基礎旋轉
        result = engine.spin()
        print(f"✓ 基礎旋轉測試: 贏分 {result.total_credit}")
        
        # 測試贏分計算
        from core.win_calculator import WinCalculator
        calculator = WinCalculator(engine.config, engine.paytable)
        print("✓ 成功初始化贏分計算器")
        
        # 測試符號變換
        from core.symbol_transformer import SymbolTransformer
        transformer = SymbolTransformer(engine.config)
        print("✓ 成功初始化符號變換器")
        
        # 測試免費旋轉
        from features.free_spins import FreeSpinsFeature
        free_spins = FreeSpinsFeature(engine.config)
        print("✓ 成功初始化免費旋轉功能")
        
        # 測試戰鼓
        from features.war_drums import WarDrumsFeature
        war_drums = WarDrumsFeature(engine.config)
        print("✓ 成功初始化戰鼓功能")
        
        # 測試特色購買
        from features.feature_buy import FeatureBuyController
        feature_buy = FeatureBuyController(engine.config)
        print("✓ 成功初始化特色購買功能")
        
        print(f"\n🎉 所有核心模組測試通過！")
        
        # 顯示簡單的遊戲狀態
        game_state = engine.get_game_state()
        print(f"\n📊 當前遊戲狀態:")
        for key, value in game_state.items():
            print(f"   {key}: {value}")
        
        return True
        
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_win_calculation():
    """測試贏分計算"""
    print("\n=== 贏分計算測試 ===")
    
    try:
        from core.game_engine import GameEngine
        from core.win_calculator import WinCalculator
        
        engine = GameEngine()
        calculator = WinCalculator(engine.config, engine.paytable)
        
        # 測試案例：創建一個有贏分的滾輪結果
        test_reel = [
            [4, 5, 6],  # P1, K, Q
            [4, 4, 7],  # P1, P1, J
            [4, 8, 2],  # P1, T, P3
            [3, 1, 0],  # P2, P4, P5
            [5, 6, 7]   # K, Q, J
        ]
        
        win_lines = calculator.calculate_243_ways(test_reel)
        
        print(f"測試滾輪結果: {test_reel}")
        print(f"找到 {len(win_lines)} 條贏分線:")
        
        total_credit = 0
        for line in win_lines:
            symbol_name = calculator._get_symbol_name(line.symbol_id)
            print(f"   線 {line.line_no}: {symbol_name} x{len(line.positions)//line.ways} = {line.credit} (Ways: {line.ways})")
            total_credit += line.credit
        
        print(f"總贏分: {total_credit}")
        
        return True
        
    except Exception as e:
        print(f"❌ 贏分計算測試失敗: {e}")
        return False

def test_feature_simulation():
    """測試特色功能"""
    print("\n=== 特色功能測試 ===")
    
    try:
        from features.war_drums import WarDrumsFeature
        from features.feature_buy import FeatureBuyController, PurchaseOption
        
        # 測試戰鼓
        config = {"war_drums": {"multiplier_range": [1, 10]}}
        war_drums = WarDrumsFeature(config)
        war_drums.set_active_drums(3)
        
        # 模擬戰鼓結果
        drum_results = war_drums.roll_drums(has_win=True)
        total_multiplier = war_drums.calculate_total_multiplier(drum_results)
        
        print(f"戰鼓測試:")
        print(f"   戰鼓數量: 3")
        print(f"   各戰鼓倍率: {[drum.multiplier for drum in drum_results]}")
        print(f"   總倍率: {total_multiplier}x")
        print(f"   特效: {[drum.effect_type for drum in drum_results]}")
        
        # 測試特色購買
        feature_buy = FeatureBuyController(config)
        options = feature_buy.get_available_options()
        
        print(f"\n特色購買選項:")
        for option_name, option_data in options.items():
            print(f"   {option_data['option_name']}: {option_data['cost_multiplier']}x 押注，{option_data['drums_count']} 個戰鼓")
        
        return True
        
    except Exception as e:
        print(f"❌ 特色功能測試失敗: {e}")
        return False

if __name__ == "__main__":
    print("開始測試好運咚咚遊戲模擬器...")
    
    success = True
    success &= test_basic_functionality()
    success &= test_win_calculation()
    success &= test_feature_simulation()
    
    if success:
        print(f"\n🎉 所有測試通過！遊戲模擬器可以正常運行。")
    else:
        print(f"\n❌ 部分測試失敗，請檢查錯誤信息。")