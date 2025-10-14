#!/usr/bin/env python3
"""
初始盤面生成器

用於生成各種預設的初始盤面 JSON 檔案

使用方法:
    python generate_initial_boards.py
"""

import json
import random
from pathlib import Path
from datetime import datetime


def create_base_board(pattern, credit=0, player_cent=1000000, description=""):
    """創建基礎盤面結構"""
    return {
        "session_info": {
            "session_id": 0,
            "description": description or "初始盤面數據",
            "purpose": "用於遊戲初始化，顯示遊戲起始狀態",
            "created_at": datetime.now().strftime("%Y-%m-%d"),
            "version": "1.0"
        },
        "initial_state": {
            "msgid": 107,
            "status_code": 0,
            "result": {
                "module_id": "00152",
                "credit": credit,
                "random_syb_pattern": pattern,
                "win_line": [],
                "win_bonus_group": []
            },
            "player_cent": player_cent,
            "next_module": "BS",
            "cur_module_play_times": 0,
            "cur_module_total_times": 0,
            "accounting_sn": 0
        },
        "notes": {
            "random_syb_pattern": "5x3 的盤面，每個位置是 symbol ID",
            "credit": "初始獎金",
            "win_line": "獲勝線（初始為空）",
            "player_cent": f"玩家餘額 {player_cent}",
            "symbol_mapping": {
                "1-9": "普通 Symbol",
                "10": "Wild Symbol",
                "11": "Scatter Symbol",
                "12+": "特殊 Symbol"
            }
        }
    }


def generate_clean_board():
    """生成乾淨的初始盤面（無特殊符號）"""
    pattern = [
        [8, 3, 4],
        [2, 7, 6],
        [7, 2, 5],
        [1, 6, 9],
        [8, 2, 8]
    ]
    
    return create_base_board(
        pattern,
        description="乾淨的初始盤面 - 無特殊符號，適合一般開始"
    )


def generate_random_board():
    """生成隨機的初始盤面"""
    pattern = []
    for _ in range(5):
        column = [random.randint(1, 9) for _ in range(3)]
        pattern.append(column)
    
    return create_base_board(
        pattern,
        description="隨機生成的初始盤面"
    )


def generate_near_win_board():
    """生成接近獲勝的初始盤面（差一個就贏）"""
    pattern = [
        [7, 3, 7],  # 第 1 軸有兩個 7
        [7, 2, 6],  # 第 2 軸有一個 7
        [8, 2, 5],  # 第 3 軸沒有 7（差一個）
        [1, 6, 9],
        [8, 2, 8]
    ]
    
    return create_base_board(
        pattern,
        description="接近獲勝的初始盤面 - 營造緊張感"
    )


def generate_wild_board():
    """生成有 Wild 符號的初始盤面"""
    pattern = [
        [10, 3, 4],  # Wild 在頂部
        [2, 10, 6],  # Wild 在中間
        [7, 2, 10],  # Wild 在底部
        [1, 6, 9],
        [8, 2, 8]
    ]
    
    return create_base_board(
        pattern,
        description="包含 Wild 符號的初始盤面"
    )


def generate_scatter_board():
    """生成有 Scatter 符號的初始盤面（差一個 Free Spin）"""
    pattern = [
        [11, 3, 4],  # Scatter 在軸 1
        [2, 7, 6],
        [7, 11, 5],  # Scatter 在軸 3
        [1, 6, 9],
        [8, 2, 8]
    ]
    
    return create_base_board(
        pattern,
        description="包含 2 個 Scatter - 差一個就觸發 Free Spin"
    )


def generate_high_value_board():
    """生成高價值符號較多的初始盤面"""
    pattern = [
        [9, 8, 7],  # 高價值符號
        [9, 8, 7],
        [9, 8, 7],
        [6, 5, 4],
        [6, 5, 4]
    ]
    
    return create_base_board(
        pattern,
        description="高價值符號較多的初始盤面"
    )


def generate_low_balance_board():
    """生成低餘額的初始盤面（用於測試低餘額情境）"""
    pattern = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 2, 3],
        [4, 5, 6]
    ]
    
    return create_base_board(
        pattern,
        player_cent=10000,  # 只有 100 元
        description="低餘額初始盤面 - 用於測試低餘額警告"
    )


def generate_high_balance_board():
    """生成高餘額的初始盤面（用於測試大額投注）"""
    pattern = [
        [9, 8, 7],
        [6, 5, 4],
        [3, 2, 1],
        [9, 8, 7],
        [6, 5, 4]
    ]
    
    return create_base_board(
        pattern,
        player_cent=100000000,  # 1,000,000 元
        description="高餘額初始盤面 - 用於測試大額投注"
    )


def generate_symmetrical_board():
    """生成對稱的初始盤面（美觀）"""
    pattern = [
        [5, 4, 5],
        [4, 3, 4],
        [3, 2, 3],
        [4, 3, 4],
        [5, 4, 5]
    ]
    
    return create_base_board(
        pattern,
        description="對稱的初始盤面 - 視覺上更美觀"
    )


def generate_demo_board():
    """生成演示用的初始盤面（適合截圖和演示）"""
    pattern = [
        [7, 5, 3],
        [8, 6, 4],
        [9, 7, 5],
        [8, 6, 4],
        [7, 5, 3]
    ]
    
    return create_base_board(
        pattern,
        player_cent=1000000,
        description="演示用初始盤面 - 適合截圖和宣傳材料"
    )


def save_board(board, filename, output_dir="game_output"):
    """儲存盤面到 JSON 檔案"""
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    filepath = output_path / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(board, f, indent=2, ensure_ascii=False)
    
    print(f"✅ 已生成: {filepath}")
    return filepath


def main():
    """主函數"""
    print("\n" + "=" * 70)
    print("初始盤面生成器")
    print("=" * 70 + "\n")
    
    # 生成各種初始盤面
    boards = {
        "initial_board.json": generate_clean_board(),
        "initial_board_random.json": generate_random_board(),
        "initial_board_near_win.json": generate_near_win_board(),
        "initial_board_wild.json": generate_wild_board(),
        "initial_board_scatter.json": generate_scatter_board(),
        "initial_board_high_value.json": generate_high_value_board(),
        "initial_board_low_balance.json": generate_low_balance_board(),
        "initial_board_high_balance.json": generate_high_balance_board(),
        "initial_board_symmetrical.json": generate_symmetrical_board(),
        "initial_board_demo.json": generate_demo_board(),
    }
    
    print("正在生成初始盤面檔案...\n")
    
    for filename, board in boards.items():
        save_board(board, filename)
    
    print("\n" + "=" * 70)
    print(f"✨ 完成！共生成 {len(boards)} 個初始盤面檔案")
    print("=" * 70)
    
    # 顯示使用方法
    print("\n使用方法:")
    print("-" * 70)
    print("1. 啟動 JSON 伺服器:")
    print("   python serve_json.py 9000 game_output")
    print()
    print("2. 在瀏覽器中使用 URL 參數指定初始盤面:")
    print("   http://localhost:7456/?localServer=true&initial_board=http://localhost:9000/initial_board_wild.json")
    print()
    print("3. 可用的初始盤面:")
    for filename, board in boards.items():
        desc = board['session_info']['description']
        print(f"   - {filename:<35} {desc}")
    print("-" * 70 + "\n")


if __name__ == '__main__':
    main()
