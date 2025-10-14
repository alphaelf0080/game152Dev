#!/usr/bin/env python3
"""
測試 Spin Server API
驗證伺服器功能是否正常運作
"""

import requests
import json
from datetime import datetime


def print_section(title):
    """打印分隔線"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def test_health_check():
    """測試健康檢查端點"""
    print_section("1. 測試健康檢查")
    
    try:
        response = requests.get("http://localhost:8000/api/health")
        print(f"狀態碼: {response.status_code}")
        print(f"回應: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            print("✅ 健康檢查通過")
            return True
        else:
            print("❌ 健康檢查失敗")
            return False
    except Exception as e:
        print(f"❌ 請求失敗: {e}")
        return False


def test_status():
    """測試狀態端點"""
    print_section("2. 測試伺服器狀態")
    
    try:
        response = requests.get("http://localhost:8000/api/status")
        print(f"狀態碼: {response.status_code}")
        print(f"回應: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            print("✅ 狀態查詢成功")
            return True
        else:
            print("❌ 狀態查詢失敗")
            return False
    except Exception as e:
        print(f"❌ 請求失敗: {e}")
        return False


def test_normal_spin():
    """測試正常旋轉"""
    print_section("3. 測試正常 Spin")
    
    request_data = {
        "bet": 50,
        "spin_type": "normal",
        "player_id": "test_player_001",
        "session_id": "test_session_001"
    }
    
    print(f"請求資料: {json.dumps(request_data, indent=2, ensure_ascii=False)}")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/spin",
            json=request_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\n狀態碼: {response.status_code}")
        result = response.json()
        
        print(f"\n回應:")
        print(f"  Success: {result.get('success')}")
        print(f"  Timestamp: {result.get('timestamp')}")
        print(f"  Session ID: {result.get('session_id')}")
        
        if result.get('data'):
            data = result['data']
            print(f"\n遊戲結果:")
            print(f"  Module ID: {data.get('module_id')}")
            print(f"  Credit: {data.get('credit')}")
            print(f"  Win: {data.get('win')}")
            print(f"  Multiplier Alone: {data.get('multiplierAlone')}")
            print(f"  RNG: {data.get('rng')}")
            print(f"  Win Line Groups: {len(data.get('winLineGrp', []))} 條")
            print(f"  Win Bonus Groups: {len(data.get('winBonusGrp', []))} 個")
            print(f"  Next Module: {data.get('next_module')}")
            
            # 完整資料（縮排顯示）
            print(f"\n完整資料:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if result.get('error'):
            print(f"\n❌ 錯誤: {result['error']}")
            return False
        else:
            print("\n✅ 正常 Spin 測試通過")
            return True
            
    except Exception as e:
        print(f"❌ 請求失敗: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_multiple_spins():
    """測試連續多次旋轉"""
    print_section("4. 測試連續 10 次 Spin")
    
    total_bet = 0
    total_win = 0
    win_count = 0
    
    for i in range(10):
        request_data = {
            "bet": 50,
            "spin_type": "normal",
            "session_id": f"test_session_{i}"
        }
        
        try:
            response = requests.post(
                "http://localhost:8000/api/spin",
                json=request_data
            )
            
            result = response.json()
            
            if result.get('success') and result.get('data'):
                data = result['data']
                win = data.get('win', 0)
                bet = request_data['bet']
                
                total_bet += bet
                total_win += win
                if win > 0:
                    win_count += 1
                
                status = "💰 贏" if win > 0 else "  "
                print(f"  Spin {i+1:2d}: 下注 {bet:3d} | 贏分 {win:6d} | {status}")
            else:
                print(f"  Spin {i+1:2d}: ❌ 失敗 - {result.get('error', 'Unknown')}")
                
        except Exception as e:
            print(f"  Spin {i+1:2d}: ❌ 錯誤 - {e}")
    
    print(f"\n統計:")
    print(f"  總下注: {total_bet}")
    print(f"  總贏分: {total_win}")
    print(f"  贏分次數: {win_count}/10")
    print(f"  RTP: {(total_win / total_bet * 100):.2f}%")
    print(f"\n✅ 連續 Spin 測試完成")
    
    return True


def test_feature_buy():
    """測試特色購買"""
    print_section("5. 測試特色購買 (60x)")
    
    request_data = {
        "bet": 50,
        "spin_type": "feature_60x",
        "player_id": "test_player_001",
        "session_id": "test_feature_session"
    }
    
    print(f"請求資料: {json.dumps(request_data, indent=2, ensure_ascii=False)}")
    
    try:
        response = requests.post(
            "http://localhost:8000/api/spin",
            json=request_data
        )
        
        print(f"\n狀態碼: {response.status_code}")
        result = response.json()
        
        if result.get('success') and result.get('data'):
            data = result['data']
            print(f"\n遊戲結果:")
            print(f"  Win: {data.get('win')}")
            print(f"  Multiplier: {data.get('multiplierAlone')}")
            print(f"  Next Module: {data.get('next_module')}")
            print(f"\n✅ 特色購買測試通過")
            return True
        else:
            print(f"\n❌ 特色購買測試失敗: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ 請求失敗: {e}")
        return False


def main():
    """執行所有測試"""
    print("\n" + "=" * 60)
    print("  🧪 Spin Server API 測試")
    print("=" * 60)
    print(f"  時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  目標: http://localhost:8000")
    print("=" * 60)
    
    # 檢查伺服器是否運行
    print("\n檢查伺服器連線...")
    try:
        response = requests.get("http://localhost:8000/", timeout=2)
        print("✅ 伺服器正在運行")
    except:
        print("❌ 無法連線到伺服器")
        print("\n請先啟動伺服器:")
        print("  python spin_server.py")
        return
    
    # 執行測試
    tests = [
        ("健康檢查", test_health_check),
        ("狀態查詢", test_status),
        ("正常 Spin", test_normal_spin),
        ("連續 Spin", test_multiple_spins),
        ("特色購買", test_feature_buy)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"\n❌ 測試 '{test_name}' 發生異常: {e}")
            results.append((test_name, False))
    
    # 顯示測試總結
    print_section("測試總結")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {status} - {test_name}")
    
    print(f"\n總計: {passed}/{total} 測試通過")
    
    if passed == total:
        print("\n🎉 所有測試通過！")
    else:
        print(f"\n⚠️  {total - passed} 個測試失敗")


if __name__ == "__main__":
    main()
