#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""測試 Protobuf 編碼"""

import sys
import os
import codecs

# 設置 stdout 為 UTF-8
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from protocol.simple_proto import (
    SlotResult, ResultRecall, StripsRecall,
    EMSGID, StatusCode
)

print("=" * 60)
print("測試 StripsRecall")
print("=" * 60)

strips_recall = StripsRecall()
data = strips_recall.SerializeToString()

print(f"✅ StripsRecall 序列化成功")
print(f"📊 長度: {len(data)} bytes")
print(f"🔍 module_id: {strips_recall.module_id}")
print(f"🎰 滾輪數量: {len(strips_recall.strips)}")
print()

print("=" * 60)
print("測試 SlotResult")
print("=" * 60)

slot_result = SlotResult(
    module_id="PSS-ON-00152",
    credit=100,
    rng=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
)
data = slot_result.SerializeToString()

print(f"✅ SlotResult 序列化成功")
print(f"📊 長度: {len(data)} bytes")
print(f"🔍 module_id: {slot_result.module_id}")
print(f"💰 credit: {slot_result.credit}")
print(f"🎲 rng: {slot_result.rng}")
print(f"📦 Hex: {data.hex()}")
print()

# 手動解析驗證
print("=" * 60)
print("手動解析 SlotResult")
print("=" * 60)

i = 0
field_count = 0
while i < len(data):
    tag = data[i]
    field_num = tag >> 3
    wire_type = tag & 7
    field_count += 1
    
    print(f"\n欄位 {field_count}:")
    print(f"  Tag: 0x{tag:02x} (field={field_num}, type={wire_type})")
    i += 1
    
    if wire_type == 0:  # varint
        value = 0
        shift = 0
        start = i
        while True:
            byte = data[i]
            value |= (byte & 0x7F) << shift
            i += 1
            if (byte & 0x80) == 0:
                break
            shift += 7
        print(f"  類型: varint")
        print(f"  值: {value}")
        print(f"  Bytes: {data[start:i].hex()}")
    elif wire_type == 2:  # length-delimited
        length = data[i]
        i += 1
        value = data[i:i+length]
        print(f"  類型: length-delimited")
        print(f"  長度: {length}")
        print(f"  值 (hex): {value.hex()}")
        try:
            print(f"  值 (string): {value.decode('utf-8')}")
        except:
            print(f"  值 (binary)")
        i += length

print()
print("=" * 60)
print("測試 ResultRecall")
print("=" * 60)

result_recall = ResultRecall(
    msgid=EMSGID.eResultRecall,
    status_code=StatusCode.kSuccess,
    result=slot_result,
    player_cent=1000000
)
data = result_recall.SerializeToString()

print(f"✅ ResultRecall 序列化成功")
print(f"📊 長度: {len(data)} bytes")
print(f"📦 Hex: {data.hex()}")
