"""
測試 JSON 輸出功能
"""

import os
import sys
import json

# 添加項目根目錄到路徑
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from simulation.simulator import GameSimulator, SimulationConfig

def test_json_export():
    """測試 JSON 輸出功能"""
    print("🧪 測試 JSON 輸出功能...")
    
    # 創建模擬器
    simulator = GameSimulator()
    
    # 配置小規模測試
    config = SimulationConfig(
        total_spins=100,  # 小規模測試
        base_bet=10,
        feature_buy_enabled=True,
        auto_buy_threshold=0.1
    )
    
    try:
        # 運行模擬並輸出 JSON
        result, json_files = simulator.run_simulation_with_json_export(
            config=config,
            export_json=True,
            output_dir="test_json_output"
        )
        
        print(f"✅ 模擬完成:")
        print(f"   總旋轉數: {result.total_spins}")
        print(f"   RTP: {result.rtp_percentage:.2f}%")
        print(f"   淨結果: {result.net_result:+}")
        
        if json_files:
            print(f"\n📁 JSON 檔案:")
            for file_type, file_path in json_files.items():
                print(f"   {file_type}: {file_path}")
                
                # 驗證檔案內容
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    print(f"   ✓ {file_type} 檔案有效 ({len(str(data))} 字元)")
                else:
                    print(f"   ❌ {file_type} 檔案不存在")
        
        return True
        
    except Exception as e:
        print(f"❌ 測試失敗: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_json_export()
    if success:
        print("\n🎉 JSON 輸出功能測試通過!")
    else:
        print("\n💥 JSON 輸出功能測試失敗!")
        sys.exit(1)