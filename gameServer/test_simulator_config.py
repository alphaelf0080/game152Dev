"""
快速測試腳本：驗證模擬器配置和 JSON 檔案提供

此腳本將：
1. 啟動 HTTP 伺服器提供 JSON 檔案（端口 9000）
2. 顯示可用的測試 URL
3. 驗證 JSON 檔案格式
"""

import os
import sys
import json
import subprocess
import time
from pathlib import Path


def find_json_files():
    """找出所有可用的 JSON 結果檔案"""
    output_dir = Path(__file__).parent / "game_output"
    if not output_dir.exists():
        return []
    
    json_files = list(output_dir.glob("batch_results_*.json"))
    return sorted(json_files, key=lambda x: x.stat().st_mtime, reverse=True)


def validate_json_file(file_path):
    """驗證 JSON 檔案格式"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 檢查必要欄位
        required_fields = ['session_info', 'results']
        for field in required_fields:
            if field not in data:
                return False, f"缺少必要欄位: {field}"
        
        # 檢查結果數量
        num_results = len(data['results'])
        if num_results == 0:
            return False, "結果數量為 0"
        
        return True, f"有效 JSON 檔案，包含 {num_results} 個結果"
    
    except json.JSONDecodeError as e:
        return False, f"JSON 格式錯誤: {str(e)}"
    except Exception as e:
        return False, f"驗證失敗: {str(e)}"


def print_test_urls(json_files, port=9000):
    """顯示測試 URL"""
    print("\n" + "=" * 80)
    print("遊戲模擬器測試 URL")
    print("=" * 80)
    
    # 基本遊戲 URL（使用伺服器模式）
    print("\n1. 伺服器模式（正常遊戲）:")
    print("   http://localhost:7456/")
    
    # 本地 JSON 模式（使用預設路徑）
    print("\n2. 本地 JSON 模式（使用預設檔案）:")
    print("   http://localhost:7456/?sim_mode=local_json")
    
    # 為每個 JSON 檔案生成測試 URL
    if json_files:
        print("\n3. 指定 JSON 檔案:")
        for i, json_file in enumerate(json_files[:5], 1):  # 只顯示最新的 5 個
            filename = json_file.name
            url = f"http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:{port}/{filename}"
            print(f"   {i}) {filename}")
            print(f"      {url}")
            
            # 驗證檔案
            is_valid, message = validate_json_file(json_file)
            print(f"      [{message}]")
    
    # 關閉循環模式
    print("\n4. 關閉循環模式（結果用完後停止）:")
    print(f"   http://localhost:7456/?sim_mode=local_json&sim_loop=false")
    
    print("\n" + "=" * 80)
    print("\n提示:")
    print(f"  - JSON 伺服器端口: {port}")
    print(f"  - 遊戲客戶端端口: 7456 (Cocos Creator 預設)")
    print(f"  - 按 Ctrl+C 停止伺服器")
    print("=" * 80 + "\n")


def start_http_server(port=9000):
    """啟動 HTTP 伺服器"""
    output_dir = Path(__file__).parent / "game_output"
    
    # 確保目錄存在
    output_dir.mkdir(exist_ok=True)
    
    print(f"\n正在啟動 HTTP 伺服器...")
    print(f"提供目錄: {output_dir.absolute()}")
    print(f"端口: {port}\n")
    
    try:
        # 啟動伺服器
        subprocess.run([
            sys.executable,
            "serve_json.py",
            str(port),
            str(output_dir)
        ])
    except KeyboardInterrupt:
        print("\n\n伺服器已停止")


def main():
    """主函數"""
    print("\n" + "=" * 80)
    print("遊戲模擬器快速測試")
    print("=" * 80)
    
    # 檢查 JSON 檔案
    json_files = find_json_files()
    
    if not json_files:
        print("\n⚠️  警告: 未找到 JSON 結果檔案")
        print("請先運行以下命令生成測試數據:")
        print("  python main.py --json --spins 100")
        print("\n")
        response = input("是否繼續啟動伺服器? (y/n): ")
        if response.lower() != 'y':
            return
    else:
        print(f"\n✓ 找到 {len(json_files)} 個 JSON 結果檔案")
    
    # 顯示測試 URL
    print_test_urls(json_files)
    
    # 啟動 HTTP 伺服器
    start_http_server()


if __name__ == '__main__':
    main()
