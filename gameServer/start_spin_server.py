#!/usr/bin/env python3
"""
Spin Server 快速啟動腳本
自動檢查依賴並啟動伺服器
"""

import sys
import subprocess
import os

def check_dependencies():
    """檢查並安裝依賴"""
    print("🔍 檢查依賴套件...")
    
    required_packages = {
        'fastapi': 'fastapi',
        'uvicorn': 'uvicorn',
        'requests': 'requests'
    }
    
    missing_packages = []
    
    for package_name, pip_name in required_packages.items():
        try:
            __import__(package_name)
            print(f"  ✅ {package_name} 已安裝")
        except ImportError:
            print(f"  ❌ {package_name} 未安裝")
            missing_packages.append(pip_name)
    
    if missing_packages:
        print(f"\n📦 需要安裝以下套件: {', '.join(missing_packages)}")
        response = input("是否立即安裝？(y/n): ")
        
        if response.lower() == 'y':
            print("\n安裝中...")
            try:
                subprocess.check_call([
                    sys.executable, "-m", "pip", "install"
                ] + missing_packages)
                print("\n✅ 所有依賴已安裝！")
            except subprocess.CalledProcessError as e:
                print(f"\n❌ 安裝失敗: {e}")
                return False
        else:
            print("\n請手動安裝依賴:")
            print(f"  pip install {' '.join(missing_packages)}")
            return False
    
    return True


def check_config_files():
    """檢查配置檔案"""
    print("\n🔍 檢查配置檔案...")
    
    config_files = [
        'config/game_config.json',
        'config/paytable.json'
    ]
    
    all_exists = True
    for file_path in config_files:
        if os.path.exists(file_path):
            print(f"  ✅ {file_path} 存在")
        else:
            print(f"  ⚠️  {file_path} 不存在（將使用預設配置）")
            all_exists = False
    
    return all_exists


def start_server(host="0.0.0.0", port=8000):
    """啟動伺服器"""
    print("\n" + "=" * 60)
    print("🚀 啟動 Spin Server")
    print("=" * 60)
    print(f"📍 主機: {host}")
    print(f"📍 端口: {port}")
    print(f"📍 URL: http://localhost:{port}")
    print("=" * 60)
    print("\n按 Ctrl+C 停止伺服器\n")
    
    try:
        import uvicorn
        from spin_server import app
        
        uvicorn.run(
            app,
            host=host,
            port=port,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\n👋 伺服器已停止")
    except Exception as e:
        print(f"\n❌ 啟動失敗: {e}")
        import traceback
        traceback.print_exc()


def main():
    """主程式"""
    print("\n" + "=" * 60)
    print("  🎮 好運咚咚 Spin Server - 快速啟動")
    print("=" * 60)
    
    # 檢查依賴
    if not check_dependencies():
        print("\n❌ 依賴檢查失敗，請安裝所需套件後重試")
        sys.exit(1)
    
    # 檢查配置
    check_config_files()
    
    # 啟動伺服器
    start_server()


if __name__ == "__main__":
    main()
