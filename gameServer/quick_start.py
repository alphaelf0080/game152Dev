"""
一鍵啟動腳本 - 遊戲模擬器系統

此腳本提供互動式選單，幫助您快速：
1. 生成測試數據
2. 啟動 JSON 伺服器
3. 顯示測試 URL
4. 驗證系統配置
"""

import os
import sys
import json
import subprocess
from pathlib import Path


def print_banner():
    """顯示啟動橫幅"""
    print("\n" + "=" * 70)
    print("🎮 遊戲模擬器系統 - 快速啟動")
    print("=" * 70 + "\n")


def check_environment():
    """檢查環境配置"""
    print("檢查環境配置...")
    
    issues = []
    
    # 檢查 Python 版本
    if sys.version_info < (3, 7):
        issues.append("❌ Python 版本過低（需要 3.7+）")
    else:
        print("✓ Python 版本正確")
    
    # 檢查必要檔案
    required_files = [
        "main.py",
        "serve_json.py",
        "test_simulator_config.py"
    ]
    
    for file in required_files:
        if not Path(file).exists():
            issues.append(f"❌ 缺少檔案: {file}")
        else:
            print(f"✓ 找到檔案: {file}")
    
    # 檢查輸出目錄
    output_dir = Path("game_output")
    if not output_dir.exists():
        print("⚠️  game_output 目錄不存在，將自動創建")
        output_dir.mkdir(exist_ok=True)
    else:
        print("✓ game_output 目錄存在")
    
    if issues:
        print("\n" + "=" * 70)
        print("發現以下問題:")
        for issue in issues:
            print(f"  {issue}")
        print("=" * 70)
        return False
    
    print("\n✅ 環境檢查通過！\n")
    return True


def show_menu():
    """顯示主選單"""
    print("=" * 70)
    print("請選擇操作:")
    print("=" * 70)
    print("1. 🎲 生成測試數據（100 spins）")
    print("2. 🎲 生成測試數據（500 spins）")
    print("3. 🎲 生成測試數據（自定義 spins）")
    print("4. 🌐 啟動 JSON 伺服器")
    print("5. 📊 顯示測試 URL")
    print("6. ✅ 驗證現有 JSON 檔案")
    print("7. 🚀 完整流程（生成數據 + 啟動伺服器）")
    print("0. 🚪 退出")
    print("=" * 70)


def generate_test_data(spins):
    """生成測試數據"""
    print(f"\n正在生成 {spins} 次旋轉的測試數據...")
    
    try:
        result = subprocess.run(
            [sys.executable, "main.py", "--json", "--spins", str(spins)],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"✅ 成功生成測試數據！")
            
            # 找出剛生成的檔案
            output_dir = Path("game_output")
            json_files = sorted(
                output_dir.glob("batch_results_*.json"),
                key=lambda x: x.stat().st_mtime,
                reverse=True
            )
            
            if json_files:
                latest_file = json_files[0]
                print(f"檔案位置: {latest_file}")
                return latest_file
        else:
            print(f"❌ 生成失敗: {result.stderr}")
            return None
    
    except Exception as e:
        print(f"❌ 錯誤: {str(e)}")
        return None


def start_server():
    """啟動 JSON 伺服器"""
    print("\n啟動 JSON 伺服器...")
    print("按 Ctrl+C 停止伺服器\n")
    
    try:
        subprocess.run([
            sys.executable,
            "test_simulator_config.py"
        ])
    except KeyboardInterrupt:
        print("\n\n伺服器已停止")


def show_test_urls():
    """顯示測試 URL"""
    output_dir = Path("game_output")
    json_files = sorted(
        output_dir.glob("batch_results_*.json"),
        key=lambda x: x.stat().st_mtime,
        reverse=True
    )
    
    print("\n" + "=" * 70)
    print("📋 測試 URL 列表")
    print("=" * 70)
    
    if not json_files:
        print("\n⚠️  未找到 JSON 檔案")
        print("請先選擇選項 1, 2 或 3 生成測試數據\n")
        return
    
    # 基本 URL
    print("\n1️⃣  伺服器模式（正常遊戲）:")
    print("   http://localhost:7456/")
    
    print("\n2️⃣  模擬模式（預設 JSON）:")
    print("   http://localhost:7456/?sim_mode=local_json")
    
    print("\n3️⃣  模擬模式（指定 JSON 檔案）:")
    for i, json_file in enumerate(json_files[:5], 1):
        filename = json_file.name
        
        # 讀取檔案資訊
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
                num_spins = data['session_info']['total_spins']
                print(f"\n   {i}) {filename}")
                print(f"      包含 {num_spins} 個結果")
                print(f"      http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/{filename}")
        except Exception as e:
            print(f"\n   {i}) {filename}")
            print(f"      ⚠️  無法讀取檔案: {str(e)}")
    
    print("\n4️⃣  關閉循環模式:")
    print("   http://localhost:7456/?sim_mode=local_json&sim_loop=false")
    
    print("\n" + "=" * 70)
    print("💡 提示: 複製上面的 URL 貼到瀏覽器中使用")
    print("=" * 70 + "\n")


def validate_json_files():
    """驗證 JSON 檔案"""
    output_dir = Path("game_output")
    json_files = list(output_dir.glob("batch_results_*.json"))
    
    print("\n" + "=" * 70)
    print("📊 JSON 檔案驗證")
    print("=" * 70 + "\n")
    
    if not json_files:
        print("⚠️  未找到 JSON 檔案\n")
        return
    
    for json_file in json_files:
        print(f"檔案: {json_file.name}")
        
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
            
            # 驗證結構
            if 'session_info' not in data or 'results' not in data:
                print("  ❌ 格式錯誤: 缺少必要欄位")
                continue
            
            num_spins = len(data['results'])
            session_spins = data['session_info'].get('total_spins', 0)
            
            print(f"  ✓ 格式正確")
            print(f"  ✓ 包含 {num_spins} 個結果")
            
            if num_spins != session_spins:
                print(f"  ⚠️  結果數量不匹配 (session_info 顯示 {session_spins})")
            
            # 檔案大小
            file_size = json_file.stat().st_size / 1024  # KB
            print(f"  ✓ 檔案大小: {file_size:.2f} KB")
            
        except json.JSONDecodeError as e:
            print(f"  ❌ JSON 格式錯誤: {str(e)}")
        except Exception as e:
            print(f"  ❌ 驗證失敗: {str(e)}")
        
        print()
    
    print("=" * 70 + "\n")


def full_workflow():
    """完整工作流程"""
    print("\n" + "=" * 70)
    print("🚀 完整工作流程")
    print("=" * 70 + "\n")
    
    # 1. 生成數據
    print("步驟 1/2: 生成測試數據")
    spins = input("請輸入 spin 次數 (預設 100): ").strip()
    
    if not spins:
        spins = 100
    else:
        try:
            spins = int(spins)
        except ValueError:
            print("❌ 無效的數字，使用預設值 100")
            spins = 100
    
    json_file = generate_test_data(spins)
    
    if not json_file:
        print("\n❌ 數據生成失敗，工作流程中止")
        return
    
    # 2. 顯示 URL
    print("\n步驟 2/2: 顯示測試 URL 並啟動伺服器")
    show_test_urls()
    
    input("按 Enter 鍵啟動伺服器...")
    
    # 3. 啟動伺服器
    start_server()


def main():
    """主函數"""
    print_banner()
    
    # 檢查環境
    if not check_environment():
        print("\n請修正上述問題後重新運行此腳本")
        return
    
    # 主選單循環
    while True:
        show_menu()
        
        choice = input("\n請輸入選項 (0-7): ").strip()
        
        if choice == "0":
            print("\n👋 再見！\n")
            break
        
        elif choice == "1":
            generate_test_data(100)
            input("\n按 Enter 繼續...")
        
        elif choice == "2":
            generate_test_data(500)
            input("\n按 Enter 繼續...")
        
        elif choice == "3":
            spins = input("請輸入 spin 次數: ").strip()
            try:
                spins = int(spins)
                generate_test_data(spins)
            except ValueError:
                print("❌ 無效的數字")
            input("\n按 Enter 繼續...")
        
        elif choice == "4":
            start_server()
        
        elif choice == "5":
            show_test_urls()
            input("\n按 Enter 繼續...")
        
        elif choice == "6":
            validate_json_files()
            input("\n按 Enter 繼續...")
        
        elif choice == "7":
            full_workflow()
        
        else:
            print("\n❌ 無效的選項，請重新選擇")
            input("\n按 Enter 繼續...")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 操作已取消\n")
    except Exception as e:
        print(f"\n❌ 發生錯誤: {str(e)}\n")
