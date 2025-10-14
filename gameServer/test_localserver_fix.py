"""
LocalServer & 初始盤面修復 - 快速驗證腳本

用途: 快速驗證修復是否成功
使用: python test_localserver_fix.py
"""

import json
import os
from pathlib import Path

def print_header(title):
    """打印標題"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60 + "\n")

def print_section(title):
    """打印小節標題"""
    print(f"\n{'─'*60}")
    print(f"  {title}")
    print(f"{'─'*60}\n")

def check_file_modification(file_path, search_strings):
    """檢查檔案是否包含指定的修改內容"""
    if not os.path.exists(file_path):
        return False, f"❌ 檔案不存在: {file_path}"
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        results = []
        all_found = True
        
        for search_str in search_strings:
            if search_str in content:
                results.append(f"  ✅ 找到: {search_str[:50]}...")
            else:
                results.append(f"  ❌ 未找到: {search_str[:50]}...")
                all_found = False
        
        return all_found, "\n".join(results)
    
    except Exception as e:
        return False, f"❌ 讀取錯誤: {str(e)}"

def check_initial_board_json():
    """檢查初始盤面 JSON 檔案"""
    json_dir = Path("game_output")
    if not json_dir.exists():
        return False, "❌ 目錄不存在: game_output"
    
    json_files = list(json_dir.glob("initial_board_*.json"))
    
    if len(json_files) == 0:
        return False, "❌ 沒有找到初始盤面 JSON 檔案"
    
    results = [f"✅ 找到 {len(json_files)} 個初始盤面 JSON 檔案:"]
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 檢查必要的鍵
            if 'initial_state' in data and 'result' in data['initial_state']:
                pattern = data['initial_state']['result'].get('random_syb_pattern', [])
                if len(pattern) == 5 and all(len(reel) == 3 for reel in pattern):
                    results.append(f"  ✅ {json_file.name} - 格式正確")
                else:
                    results.append(f"  ⚠️ {json_file.name} - 格式可能有問題")
            else:
                results.append(f"  ❌ {json_file.name} - 缺少必要鍵")
        
        except Exception as e:
            results.append(f"  ❌ {json_file.name} - 讀取錯誤: {str(e)}")
    
    return True, "\n".join(results)

def main():
    print_header("🔧 LocalServer & 初始盤面修復驗證")
    
    print("本腳本會檢查以下內容:")
    print("  1. ProtoConsole.ts 的修改")
    print("  2. StateConsole.ts 的修改")
    print("  3. 初始盤面 JSON 檔案")
    print("  4. 文檔更新")
    
    # 檢查 1: ProtoConsole.ts
    print_section("1️⃣ 檢查 ProtoConsole.ts")
    
    proto_console_path = "../pss-on-00152/assets/script/MessageController/ProtoConsole.ts"
    proto_checks = [
        "Data.Library.USE_LOCAL_JSON = true",
        "console.log('[ProtoConsole] ✅ 已設定 Data.Library.USE_LOCAL_JSON = true')",
    ]
    
    success1, result1 = check_file_modification(proto_console_path, proto_checks)
    print(result1)
    
    if success1:
        print("\n✅ ProtoConsole.ts 修改正確")
    else:
        print("\n❌ ProtoConsole.ts 修改不完整")
    
    # 檢查 2: StateConsole.ts
    print_section("2️⃣ 檢查 StateConsole.ts")
    
    state_console_path = "../pss-on-00152/assets/script/MessageController/StateConsole.ts"
    state_checks = [
        "const initialRng = []",
        "const midSymbol = gameBoard.reels[i][1]",
        "this.LastRng = initialRng",
        "console.log('[StateConsole] 🎲 初始RNG值:'",
    ]
    
    success2, result2 = check_file_modification(state_console_path, state_checks)
    print(result2)
    
    if success2:
        print("\n✅ StateConsole.ts 修改正確")
    else:
        print("\n❌ StateConsole.ts 修改不完整")
    
    # 檢查 3: 初始盤面 JSON 檔案
    print_section("3️⃣ 檢查初始盤面 JSON 檔案")
    
    success3, result3 = check_initial_board_json()
    print(result3)
    
    if success3:
        print("\n✅ 初始盤面 JSON 檔案正常")
    else:
        print("\n❌ 初始盤面 JSON 檔案有問題")
    
    # 檢查 4: 文檔
    print_section("4️⃣ 檢查文檔")
    
    doc_files = [
        ("../docs/LocalServer-InitialBoard-Fix.md", "修復文檔"),
        ("../docs/DOCUMENTATION_INDEX.md", "文檔索引"),
    ]
    
    all_docs_ok = True
    for doc_path, doc_name in doc_files:
        if os.path.exists(doc_path):
            print(f"  ✅ {doc_name} 存在")
        else:
            print(f"  ❌ {doc_name} 不存在")
            all_docs_ok = False
    
    if all_docs_ok:
        print("\n✅ 文檔完整")
    else:
        print("\n❌ 文檔不完整")
    
    # 總結
    print_section("📊 驗證總結")
    
    total_checks = 4
    passed_checks = sum([success1, success2, success3, all_docs_ok])
    
    print(f"通過檢查: {passed_checks}/{total_checks}")
    
    if passed_checks == total_checks:
        print("\n🎉 所有檢查通過！修復應該已正確應用。")
        print("\n📝 下一步:")
        print("  1. 在 Cocos Creator 中打開專案")
        print("  2. 預覽遊戲，URL: http://localhost:7456/?localServer=true&initialBoard=initial_board_scatter_trigger")
        print("  3. 檢查 Console 日誌，驗證:")
        print("     - ✅ 顯示 '跳過 WebSocket 連接'")
        print("     - ✅ 顯示 '已設定 Data.Library.USE_LOCAL_JSON = true'")
        print("     - ✅ 顯示 '初始RNG值: [...]'")
        print("     - ✅ 畫面顯示配置的初始盤面")
        print("\n📖 詳細測試步驟請參考: docs/LocalServer-InitialBoard-Fix.md")
    else:
        print("\n⚠️ 部分檢查未通過，請檢查上述問題。")
    
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    main()
