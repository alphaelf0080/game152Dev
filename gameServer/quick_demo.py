"""
好運咚咚遊戲模擬器快速演示
展示主要功能和分析結果
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.game_engine import GameEngine, SpinType
from features.war_drums import WarDrumsFeature
from features.feature_buy import FeatureBuyController
import random
import time

def run_quick_demo():
    """運行快速演示"""
    print("╔══════════════════════════════════════════╗")
    print("║        好運咚咚遊戲模擬器快速演示          ║")
    print("║     Lucky Drums Game Simulator Demo     ║")
    print("╚══════════════════════════════════════════╝\n")
    
    # 初始化遊戲引擎
    engine = GameEngine()
    print("🎰 遊戲引擎初始化完成")
    print(f"   初始積分: {engine.player_credit:,}")
    print(f"   基礎押注: {engine.current_bet}")
    
    # 1. 基礎遊戲演示
    print(f"\n=== 1. 基礎遊戲演示 ===")
    base_game_wins = []
    feature_triggered = False
    
    for i in range(20):
        result = engine.spin()
        base_game_wins.append(result.total_credit)
        
        if result.is_feature_trigger and not feature_triggered:
            feature_triggered = True
            print(f"🎯 第 {i+1} 次旋轉觸發免費旋轉！")
            print(f"   獲得 {result.free_spins_awarded} 次免費旋轉")
            
            # 執行免費旋轉
            fs_wins = []
            fs_count = 0
            while engine.free_spins_remaining > 0:
                fs_result = engine.spin_free_game()
                fs_wins.append(fs_result.total_credit)
                fs_count += 1
                if fs_result.multiplier > 1:
                    print(f"   免費旋轉 {fs_count}: {fs_result.total_credit} (倍率: {fs_result.multiplier}x)")
            
            total_fs_win = sum(fs_wins)
            print(f"   免費旋轉總贏分: {total_fs_win}")
            break
    
    if not feature_triggered:
        total_base_win = sum(base_game_wins)
        print(f"📊 基礎遊戲統計 (20次旋轉):")
        print(f"   總贏分: {total_base_win}")
        print(f"   平均贏分: {total_base_win / 20:.1f}")
        print(f"   有贏分的旋轉: {sum(1 for w in base_game_wins if w > 0)} 次")
    
    # 2. 特色購買演示
    print(f"\n=== 2. 特色購買演示 ===")
    
    # 重置遊戲狀態
    engine.reset_game_state()
    engine.player_credit = 100000
    
    # 測試 100x 購買選項
    try:
        print("🛒 購買 100x 特色 (3個戰鼓)")
        initial_credit = engine.player_credit
        
        # 購買特色
        result = engine.spin(SpinType.FEATURE_BUY_100X)
        cost = initial_credit - engine.player_credit
        
        print(f"   購買成本: {cost}")
        print(f"   剩餘積分: {engine.player_credit}")
        
        # 執行免費旋轉
        fs_results = []
        multipliers = []
        
        while engine.free_spins_remaining > 0:
            fs_result = engine.spin_free_game()
            fs_results.append(fs_result.total_credit)
            multipliers.append(fs_result.multiplier)
        
        total_win = sum(fs_results)
        profit = total_win - cost
        
        print(f"   免費旋轉次數: {len(fs_results)}")
        print(f"   總贏分: {total_win}")
        print(f"   淨盈虧: {profit:+d}")
        print(f"   RTP: {(total_win / cost * 100):.1f}%")
        print(f"   平均倍率: {sum(multipliers) / len(multipliers):.1f}x")
        print(f"   最高倍率: {max(multipliers)}x")
        
    except Exception as e:
        print(f"   購買失敗: {e}")
    
    # 3. 戰鼓系統演示
    print(f"\n=== 3. 戰鼓系統演示 ===")
    
    war_drums = WarDrumsFeature(engine.config)
    
    print("🥁 模擬不同戰鼓配置:")
    for drums_count in [1, 2, 3]:
        war_drums.set_active_drums(drums_count)
        
        results = []
        for _ in range(10):
            drum_results = war_drums.roll_drums(has_win=True)
            total_mult = war_drums.calculate_total_multiplier(drum_results)
            results.append(total_mult)
        
        avg_mult = sum(results) / len(results)
        max_mult = max(results)
        
        print(f"   {drums_count} 個戰鼓: 平均倍率 {avg_mult:.1f}x, 最高 {max_mult}x")
    
    # 4. 快速統計分析
    print(f"\n=== 4. 快速統計分析 ===")
    
    print("📈 執行 1000 次旋轉統計...")
    
    # 重置並執行大量模擬
    engine.reset_game_state()
    engine.player_credit = 1000000
    
    wins = []
    feature_count = 0
    total_bet = 0
    
    for _ in range(1000):
        result = engine.spin()
        wins.append(result.total_credit)
        total_bet += engine.current_bet
        
        if result.is_feature_trigger:
            feature_count += 1
            # 快速執行免費旋轉
            while engine.free_spins_remaining > 0:
                fs_result = engine.spin_free_game()
                wins.append(fs_result.total_credit)
    
    total_win = sum(wins)
    rtp = (total_win / total_bet) * 100 if total_bet > 0 else 0
    
    print(f"📊 統計結果:")
    print(f"   總旋轉數: 1,000")
    print(f"   總押注: {total_bet:,}")
    print(f"   總贏分: {total_win:,}")
    print(f"   RTP: {rtp:.2f}%")
    print(f"   特色觸發: {feature_count} 次 ({feature_count/10:.1f}%)")
    print(f"   平均贏分: {total_win/1000:.1f}")
    print(f"   最大單贏: {max(wins):,}")
    print(f"   有贏分比例: {sum(1 for w in wins if w > 0)/len(wins):.1%}")
    
    # 5. 購買策略分析
    print(f"\n=== 5. 購買策略分析 ===")
    
    feature_buy = FeatureBuyController(engine.config)
    options = feature_buy.get_available_options()
    
    print("💰 購買選項分析:")
    for option_name, option_data in options.items():
        cost = 50 * option_data["cost_multiplier"]  # 假設基礎押注50
        print(f"   {option_data['option_name']}: ")
        print(f"      成本: {cost} ({option_data['cost_multiplier']}x)")
        print(f"      戰鼓: {option_data['drums_count']} 個")
        print(f"      每戰鼓成本: {cost/option_data['drums_count']:.0f}")
    
    print(f"\n✅ 演示完成！遊戲模擬器運行正常。")
    print(f"💡 可以使用 'python main.py --all' 運行完整分析")

if __name__ == "__main__":
    random.seed(42)  # 固定隨機種子確保結果可重現
    run_quick_demo()