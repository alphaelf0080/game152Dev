#!/usr/bin/env python3
"""測試 ConfigRecall Protobuf 序列化"""

import sys
import os

# 添加專案根目錄到路徑
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from protocol.simple_proto import ConfigRecall, EMSGID, StatusCode

# 創建 ConfigRecall
config_recall = ConfigRecall(
    msgid=EMSGID.eConfigRecall,
    status_code=StatusCode.kSuccess,
    bet_5_arr=[1, 2, 5, 10, 20],
    line_5_arr=[30, 30, 30, 30, 30],
    rate_arr=[1, 10, 25, 50, 100],
    player_cent=1000000
)

# 序列化
data = config_recall.SerializeToString()

print(f"✅ ConfigRecall 序列化成功")
print(f"📊 總長度: {len(data)} bytes")
print(f"🔍 Hex: {data.hex()}")
print(f"\n📋 內容解析:")
print(f"  - bet_5_arr: {config_recall.bet_5_arr}")
print(f"  - line_5_arr: {config_recall.line_5_arr}")
print(f"  - rate_arr: {config_recall.rate_arr}")
print(f"  - player_cent: {config_recall.player_cent}")

# 手動解析驗證
print(f"\n🔬 手動驗證:")
i = 0
while i < len(data):
    tag = data[i]
    field_num = tag >> 3
    wire_type = tag & 7
    print(f"  Byte {i}: tag={tag:02x} field={field_num} wire_type={wire_type}")
    i += 1
    
    if wire_type == 0:  # varint
        value = 0
        shift = 0
        while True:
            byte = data[i]
            value |= (byte & 0x7F) << shift
            i += 1
            if (byte & 0x80) == 0:
                break
            shift += 7
        print(f"    → varint value: {value}")
    elif wire_type == 2:  # length-delimited
        length = data[i]
        i += 1
        print(f"    → length: {length}")
        print(f"    → data: {data[i:i+length].hex()}")
        i += length
