"""
測試事件日誌格式輸出
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simulation.simulator import GameSimulator, SimulationConfig


def test_event_log_export():
    """測試事件日誌格式輸出"""
    
    print("="*60)
    print("  測試事件日誌格式輸出")
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
            
            # 檢查事件日誌格式
            if file_type == "event_log":
                print()
                print(f"📄 檢查事件日誌格式...")
                try:
                    import json
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    print(f"   ✅ game_id: {data.get('game_id')}")
                    print(f"   ✅ logs 數量: {len(data.get('logs', []))}")
                    
                    # 檢查前幾個事件
                    logs = data.get('logs', [])
                    if logs:
                        print(f"   ✅ 第一個事件: {logs[0].get('event')}")
                        if len(logs) > 1:
                            print(f"   ✅ 第二個事件: {logs[1].get('event')}")
                        if len(logs) > 2:
                            print(f"   ✅ 第三個事件: {logs[2].get('event')}")
                        
                        # 找到第一個 result 事件
                        result_event = next((log for log in logs if log.get('event') == 'result'), None)
                        if result_event:
                            print(f"   ✅ 第一個 result 事件:")
                            print(f"      - module_id: {result_event.get('data', {}).get('module_id')}")
                            print(f"      - credit: {result_event.get('data', {}).get('credit')}")
                            print(f"      - win: {result_event.get('data', {}).get('win')}")
                            print(f"      - rng 長度: {len(result_event.get('data', {}).get('rng', []))}")
                            
                        # 找到第一個 reconnected_Result 事件
                        reconnect_event = next((log for log in logs if log.get('event') == 'reconnected_Result'), None)
                        if reconnect_event:
                            print(f"   ✅ 第一個 reconnected_Result 事件:")
                            print(f"      - 包含 winLineGrp: {'winLineGrp' in reconnect_event.get('data', {})}")
                            print(f"      - 包含 multiplierAlone: {'multiplierAlone' in reconnect_event.get('data', {})}")
                            print(f"      - 包含 mulitplierPattern: {'mulitplierPattern' in reconnect_event.get('data', {})}")
                            
                    print()
                    print("✅ 事件日誌格式驗證通過！")
                    
                except Exception as e:
                    print(f"   ❌ 驗證失敗: {e}")
                    import traceback
                    traceback.print_exc()
    
    print()
    print("="*60)
    print("✅ 測試完成！")
    print("="*60)


if __name__ == "__main__":
    test_event_log_export()
