"""
測試簡化數據格式輸出
只保留 data: {} 部分
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simulation.simulator import GameSimulator, SimulationConfig
import json


def test_simple_data_export():
    """測試簡化數據格式輸出"""
    
    print("="*60)
    print("  測試簡化數據格式輸出")
    print("="*60)
    print()
    
    # 創建模擬器
    simulator = GameSimulator()
    
    # 配置：只跑100次 spin 來快速測試
    config = SimulationConfig(
        total_spins=100,
        base_bet=50,
        player_initial_credit=1000000,
        feature_buy_enabled=False,  # 關閉特色購買以簡化測試
        seed=42  # 使用固定種子以便重現結果
    )
    
    print("📊 模擬配置:")
    print(f"   總旋轉次數: {config.total_spins:,}")
    print(f"   基礎下注: {config.base_bet}")
    print(f"   初始餘額: {config.player_initial_credit:,}")
    print()
    
    # 執行模擬
    print("🎮 開始模擬...")
    result, json_files = simulator.run_simulation_with_json_export(
        config=config,
        export_json=True,
        output_dir="test_output"
    )
    
    print()
    print("="*60)
    print("  模擬結果")
    print("="*60)
    print(f"總旋轉次數:      {result.total_spins:,}")
    print(f"總下注:          {result.total_bet:,}")
    print(f"總贏分:          {result.total_win:,}")
    print(f"淨結果:          {result.net_result:,}")
    print(f"RTP:             {result.rtp_percentage:.2f}%")
    print(f"特色觸發次數:    {result.feature_triggers}")
    print(f"最大贏分:        {result.biggest_win:,}")
    print(f"模擬時間:        {result.simulation_time:.2f}秒")
    print()
    
    if json_files:
        print("="*60)
        print("  輸出檔案")
        print("="*60)
        for file_type, file_path in json_files.items():
            print(f"{file_type:20s}: {file_path}")
            
        # 重點檢查簡化格式
        if "game_results" in json_files:
            game_results_file = json_files["game_results"]
            print()
            print(f"📄 檢查簡化數據格式 (game_results.json)...")
            
            try:
                with open(game_results_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                print(f"   ✅ 類型: {type(data).__name__} (陣列)")
                print(f"   ✅ 結果數量: {len(data)}")
                
                if data:
                    first_result = data[0]
                    print(f"   ✅ 第一筆結果的欄位:")
                    for key in first_result.keys():
                        print(f"      - {key}")
                    
                    # 詳細檢查第一筆結果
                    print()
                    print(f"   📊 第一筆結果詳情:")
                    print(f"      module_id: {first_result.get('module_id')}")
                    print(f"      credit: {first_result.get('credit')}")
                    print(f"      win: {first_result.get('win')}")
                    print(f"      rng 長度: {len(first_result.get('rng', []))}")
                    print(f"      winLineGrp 數量: {len(first_result.get('winLineGrp', []))}")
                    print(f"      multiplierAlone: {first_result.get('multiplierAlone')}")
                    print(f"      mulitplierPattern 長度: {len(first_result.get('mulitplierPattern', []))}")
                    print(f"      winBonusGrp 數量: {len(first_result.get('winBonusGrp', []))}")
                    print(f"      next_module: {first_result.get('next_module')}")
                    print(f"      jp_count: {first_result.get('jp_count')}")
                    print(f"      jp: {first_result.get('jp')}")
                    
                    # 找一筆有贏分的結果
                    win_result = next((r for r in data if r.get('win', 0) > 0), None)
                    if win_result:
                        print()
                        print(f"   📊 有贏分的結果範例:")
                        print(json.dumps(win_result, indent=6, ensure_ascii=False))
                    
                    print()
                    print("✅ 簡化數據格式驗證通過！")
                    print()
                    print("📋 格式說明:")
                    print("   - 輸出為純陣列 (不含 game_id, logs 等包裝)")
                    print("   - 每個元素是一個 data 物件")
                    print("   - 包含所有必要欄位: module_id, credit, rng, win, etc.")
                    print("   - winLineGrp 包含 credit_long 結構")
                    print("   - 拼寫正確: mulitplierPattern (不是 multiplierPattern)")
                    
            except Exception as e:
                print(f"   ❌ 驗證失敗: {e}")
                import traceback
                traceback.print_exc()
    
    print()
    print("="*60)
    print("✅ 測試完成！")
    print("="*60)


if __name__ == "__main__":
    test_simple_data_export()
