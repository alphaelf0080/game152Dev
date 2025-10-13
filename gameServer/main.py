"""
好運咚咚遊戲模擬器主程序
執行遊戲模擬並生成分析報告
"""

import json
import time
import argparse
from typing import Dict, Any
import os

# 添加項目根目錄到路徑
import sys
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

# 導入設定管理器
from config.config_manager import get_simulation_settings

from core.game_engine import GameEngine, SpinType
from simulation.simulator import GameSimulator, SimulationConfig
from features.feature_buy import FeatureBuyController, PurchaseOption

def print_banner():
    """打印程序橫幅"""
    banner = """
    ╔══════════════════════════════════════════╗
    ║        好運咚咚遊戲模擬器 v1.0            ║
    ║     Game Simulator for Lucky Drums       ║
    ╚══════════════════════════════════════════╝
    """
    print(banner)

def run_basic_demo():
    """運行基礎演示"""
    print("\n=== 基礎遊戲演示 ===")
    
    # 初始化遊戲引擎
    try:
        engine = GameEngine()
        print("✓ 遊戲引擎初始化成功")
    except Exception as e:
        print(f"✗ 遊戲引擎初始化失敗: {e}")
        return
    
    # 執行幾次旋轉
    print("\n執行 10 次基礎旋轉:")
    print("-" * 50)
    
    for i in range(10):
        try:
            result = engine.spin()
            status = "🎯 特色觸發!" if result.is_feature_trigger else "📊 正常旋轉"
            print(f"旋轉 {i+1:2d}: 贏分 {result.total_credit:6d} | {status}")
            
            # 如果觸發免費旋轉，執行免費旋轉
            if result.is_feature_trigger:
                fs_total = 0
                fs_count = 0
                while engine.free_spins_remaining > 0:
                    fs_result = engine.spin_free_game()
                    fs_total += fs_result.total_credit
                    fs_count += 1
                
                print(f"        免費旋轉: {fs_count} 次，總贏分 {fs_total}")
            
        except Exception as e:
            print(f"旋轉 {i+1} 錯誤: {e}")
    
    # 顯示遊戲統計
    stats = engine.get_statistics()
    print(f"\n📊 遊戲統計:")
    print(f"   總旋轉數: {stats['total_spins']}")
    print(f"   總贏分: {stats['total_win']}")
    print(f"   特色觸發: {stats['feature_triggers']} 次")
    print(f"   觸發率: {stats['feature_trigger_rate']:.2%}")
    print(f"   平均贏分: {stats['average_win']:.2f}")
    print(f"   估算 RTP: {stats['rtp_estimate']:.2f}%")

def run_feature_buy_demo():
    """運行特色購買演示"""
    print("\n=== 特色購買演示 ===")
    
    engine = GameEngine()
    
    # 測試不同的購買選項
    buy_options = [
        (SpinType.FEATURE_BUY_60X, "60倍 (1個戰鼓)"),
        (SpinType.FEATURE_BUY_80X, "80倍 (2個戰鼓)"),
        (SpinType.FEATURE_BUY_100X, "100倍 (3個戰鼓)")
    ]
    
    for spin_type, description in buy_options:
        print(f"\n測試購買選項: {description}")
        print("-" * 30)
        
        try:
            # 重置遊戲狀態
            engine.reset_game_state()
            engine.player_credit = 100000
            
            # 購買特色
            result = engine.spin(spin_type)
            print(f"✓ 成功購買，觸發免費旋轉")
            
            # 執行免費旋轉
            fs_results = []
            while engine.free_spins_remaining > 0:
                fs_result = engine.spin_free_game()
                fs_results.append(fs_result.total_credit)
                print(f"  免費旋轉 {len(fs_results):2d}: {fs_result.total_credit:6d} (倍率: {fs_result.multiplier}x)")
            
            total_fs_win = sum(fs_results)
            cost = engine.current_bet * {
                SpinType.FEATURE_BUY_60X: 60,
                SpinType.FEATURE_BUY_80X: 80,
                SpinType.FEATURE_BUY_100X: 100
            }[spin_type]
            
            profit = total_fs_win - cost
            print(f"\n📊 結果:")
            print(f"   購買成本: {cost}")
            print(f"   免費旋轉贏分: {total_fs_win}")
            print(f"   淨盈虧: {profit:+d}")
            print(f"   RTP: {(total_fs_win / cost * 100):.2f}%")
            
        except Exception as e:
            print(f"✗ 購買失敗: {e}")

def run_simulation_analysis(spins: int = None, export_json: bool = False, json_dir: str = "json_output"):
    """運行模擬分析"""
    settings = get_simulation_settings()
    if spins is None:
        spins = settings.basic_total_spins
    
    print(f"\n=== 運行 {spins:,} 次旋轉模擬分析 ===")
    if export_json:
        print(f"📁 JSON 結果將輸出至: {json_dir}")
    
    simulator = GameSimulator()
    
    # 配置模擬參數
    config = SimulationConfig(
        total_spins=spins,
        base_bet=settings.default_bet,
        player_initial_credit=1000000,
        feature_buy_enabled=True,
        auto_buy_threshold=0.08,  # 8% 機率購買特色
        seed=42  # 固定種子確保結果可重現
    )
    
    print("🔄 執行模擬中...")
    start_time = time.time()
    
    try:
        if export_json:
            # 使用支援 JSON 輸出的模擬方法
            result, json_files = simulator.run_simulation_with_json_export(
                config=config, 
                export_json=True, 
                output_dir=json_dir
            )
        else:
            # 使用標準模擬方法
            result = simulator.run_basic_simulation(config)
        
        print(f"✓ 模擬完成 (用時 {result.simulation_time:.2f} 秒)")
        print("\n📊 模擬結果:")
        print("-" * 50)
        print(f"總旋轉數:     {result.total_spins:,}")
        print(f"總押注:       {result.total_bet:,}")
        print(f"總贏分:       {result.total_win:,}")
        print(f"淨結果:       {result.net_result:+,}")
        print(f"RTP:          {result.rtp_percentage:.2f}%")
        print(f"特色觸發:     {result.feature_triggers:,} 次 ({result.feature_trigger_rate:.2%})")
        print(f"特色購買:     {result.feature_buys:,} 次")
        print(f"最大單贏:     {result.biggest_win:,}")
        print(f"平均每轉贏分: {result.average_win_per_spin:.2f}")
        
        if export_json and 'json_files' in locals():
            print(f"\n📁 JSON 檔案已輸出至 {json_dir} 目錄")
        
    except Exception as e:
        print(f"✗ 模擬失敗: {e}")

def run_feature_buy_analysis():
    """運行特色購買分析"""
    print("\n=== 特色購買策略分析 ===")
    
    simulator = GameSimulator()
    
    print("🔄 分析不同購買選項...")
    
    try:
        settings = get_simulation_settings()
        analysis = simulator.run_feature_buy_analysis(spins_per_option=settings.feature_buy_spins_per_option)
        
        print("\n📊 購買選項分析結果:")
        print("-" * 60)
        print(f"{'選項':<15} {'成本':<8} {'平均贏分':<10} {'RTP':<8} {'盈利率':<8}")
        print("-" * 60)
        
        for option_name, data in analysis.items():
            option_display = option_name.replace('FEATURE_BUY_', '').replace('X', 'x')
            print(f"{option_display:<15} {data['cost']:<8} {data['average_win']:<10.0f} {data['rtp']:<8.1f}% {data['win_rate']:<8.1%}")
        
        # 找出最佳選項
        best_option = max(analysis.items(), key=lambda x: x[1]['rtp'])
        print(f"\n🏆 最佳 RTP 選項: {best_option[0].replace('FEATURE_BUY_', '').replace('X', 'x')} ({best_option[1]['rtp']:.1f}%)")
        
        most_profitable = max(analysis.items(), key=lambda x: x[1]['profit_margin'])
        print(f"💰 最高盈利選項: {most_profitable[0].replace('FEATURE_BUY_', '').replace('X', 'x')} (平均盈利 {most_profitable[1]['profit_margin']:.0f})")
        
    except Exception as e:
        print(f"✗ 分析失敗: {e}")

def run_volatility_analysis():
    """運行波動性分析"""
    print("\n=== 波動性分析 ===")
    
    simulator = GameSimulator()
    
    settings = get_simulation_settings()
    print(f"🔄 執行 {settings.volatility_num_sessions} 個遊戲會話 (每個 {settings.volatility_spins_per_session:,} 次旋轉)...")
    
    try:
        volatility = simulator.run_volatility_analysis(
            num_sessions=settings.volatility_num_sessions, 
            spins_per_session=settings.volatility_spins_per_session
        )
        
        print("\n📊 波動性分析結果:")
        print("-" * 40)
        print(f"總會話數:       {volatility['total_sessions']}")
        print(f"每會話旋轉數:   {volatility['spins_per_session']}")
        print(f"平均結果:       {volatility['mean_result']:+.0f}")
        print(f"標準差:         {volatility['standard_deviation']:.0f}")
        print(f"波動性指數:     {volatility['volatility_index']:.2f}")
        print(f"盈利會話:       {volatility['positive_sessions']} ({volatility['win_rate']:.1%})")
        print(f"虧損會話:       {volatility['negative_sessions']}")
        print(f"最大贏利:       {volatility['max_win']:+.0f}")
        print(f"最大虧損:       {volatility['max_loss']:+.0f}")
        
        print(f"\n📈 百分位數分布:")
        for percentile, value in volatility['percentiles'].items():
            print(f"  {percentile:<6}: {value:+8.0f}")
        
    except Exception as e:
        print(f"✗ 波動性分析失敗: {e}")

def show_settings():
    """顯示目前設定"""
    from config.config_manager import config_manager
    config_manager.print_current_settings()

def main():
    """主函數"""
    parser = argparse.ArgumentParser(description="好運咚咚遊戲模擬器")
    parser.add_argument("--demo", action="store_true", help="運行基礎演示")
    parser.add_argument("--feature-demo", action="store_true", help="運行特色購買演示")
    parser.add_argument("--simulate", type=int, metavar="N", help="運行 N 次旋轉的模擬分析")
    parser.add_argument("--feature-analysis", action="store_true", help="運行特色購買分析")
    parser.add_argument("--volatility", action="store_true", help="運行波動性分析")
    parser.add_argument("--all", action="store_true", help="運行所有分析")
    parser.add_argument("--settings", action="store_true", help="顯示目前的模擬設定")
    parser.add_argument("--config", type=str, metavar="FILE", help="使用指定的設定檔")
    parser.add_argument("--json", action="store_true", help="輸出 JSON 格式的詳細結果")
    parser.add_argument("--json-dir", type=str, metavar="DIR", default="json_output", help="JSON 輸出目錄")
    
    args = parser.parse_args()
    
    print_banner()
    
    # 如果沒有指定參數，運行默認演示
    if not any(vars(args).values()):
        print("沒有指定參數，運行默認演示...")
        args.demo = True
        args.feature_demo = True
        args.simulate = 5000
    
    try:
        # 處理設定相關命令
        if args.settings:
            show_settings()
            return
        
        if args.config:
            from config.config_manager import ConfigManager
            config_manager = ConfigManager(args.config)
            print(f"使用設定檔: {args.config}")
        
        if args.demo or args.all:
            run_basic_demo()
        
        if args.feature_demo or args.all:
            run_feature_buy_demo()
        
        if args.simulate or args.all:
            spins = args.simulate if args.simulate else None
            run_simulation_analysis(spins, export_json=args.json, json_dir=args.json_dir)
        
        if args.feature_analysis or args.all:
            run_feature_buy_analysis()
        
        if args.volatility or args.all:
            run_volatility_analysis()
        
        print(f"\n✅ 程序執行完成!")
        
    except KeyboardInterrupt:
        print(f"\n⚠️  程序被用戶中斷")
    except Exception as e:
        print(f"\n❌ 程序執行錯誤: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()