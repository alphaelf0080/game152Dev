# LocalServer 前端調試指南

## 問題：ReelController._strips 為 null

### 調試步驟

#### 步驟 1：檢查初始化狀態

在遊戲載入完成（看到遊戲畫面）後，在瀏覽器 Console 執行：

```javascript
console.log('=== 初始化狀態檢查 ===');
console.log('CurModuleid:', Data.Library.MathConsole.CurModuleid);
console.log('Striptables 長度:', Data.Library.MathConsole.Striptables.length);

if (Data.Library.MathConsole.Striptables.length > 0) {
  console.log('Striptables[0]._id:', Data.Library.MathConsole.Striptables[0]._id);
  console.log('Striptables[0]._strips 長度:', Data.Library.MathConsole.Striptables[0]._strips ? Data.Library.MathConsole.Striptables[0]._strips.length : 'null');
  
  if (Data.Library.MathConsole.Striptables[0]._strips) {
    console.log('第一個滾輪長度:', Data.Library.MathConsole.Striptables[0]._strips[0] ? Data.Library.MathConsole.Striptables[0]._strips[0].length : 'null');
  }
} else {
  console.error('❌ Striptables 陣列是空的！');
}

console.log('ID 匹配測試:');
let testId = 'PSS-ON-00152';
console.log('測試 ID:', testId);
console.log('getStriptable 結果:', Data.Library.MathConsole.getStriptable(testId));
```

**預期結果**：
```
CurModuleid: "PSS-ON-00152"
Striptables 長度: 1
Striptables[0]._id: "PSS-ON-00152"
Striptables[0]._strips 長度: 5
第一個滾輪長度: 40
getStriptable 結果: {Object with _strips}
```

**如果失敗**：
- Striptables 長度為 0 → StripsRecall 未正確處理
- _id 不匹配 → Protobuf 解碼問題
- _strips 是 null → setStrips() 未正確調用

---

#### 步驟 2：點擊 Spin 前檢查

在點擊 Spin 按鈕之前執行：

```javascript
console.log('=== Spin 前狀態 ===');
console.log('Striptables 是否仍存在:', Data.Library.MathConsole.Striptables.length > 0);
console.log('CurModuleid:', Data.Library.MathConsole.CurModuleid);
```

---

#### 步驟 3：收到 ResultRecall 後立即檢查

點擊 Spin，等收到 ResultRecall（看到 `[@ResultRecall] status_code` 日誌）後立即執行：

```javascript
console.log('=== ResultRecall 後狀態 ===');
console.log('Striptables 長度:', Data.Library.MathConsole.Striptables.length);
console.log('CurModuleid:', Data.Library.MathConsole.CurModuleid);

// 檢查最後收到的 result
let windata = Data.Library.MathConsole.getWinData();
console.log('WinData:', windata);
console.log('strip_index:', windata ? windata.strip_index : 'null');
```

---

#### 步驟 4：手動測試 getStriptable

```javascript
console.log('=== 手動測試 getStriptable ===');

// 測試不同的 ID 格式
let testIds = [
  'PSS-ON-00152',
  'pss-on-00152',  // 小寫
  'PSS-ON-00152 ', // 帶空格
  ' PSS-ON-00152'  // 前面空格
];

testIds.forEach(id => {
  let result = Data.Library.MathConsole.getStriptable(id);
  console.log(`getStriptable("${id}"):`, result ? '✅ 找到' : '❌ null');
});

// 列出所有 Striptables 的 _id
console.log('\n所有 Striptables 的 _id:');
for (let i = 0; i < Data.Library.MathConsole.Striptables.length; i++) {
  console.log(`  [${i}] _id: "${Data.Library.MathConsole.Striptables[i]._id}"`);
  console.log(`      字元碼:`, Array.from(Data.Library.MathConsole.Striptables[i]._id).map(c => c.charCodeAt(0)));
}
```

---

## 可能的問題與解決方案

### 問題 A：Striptables 陣列是空的

**原因**：StripsRecall 處理失敗

**解決方案**：檢查瀏覽器 Console 是否有 StripsRecall 相關的錯誤訊息。

---

### 問題 B：module_id 不匹配

**原因**：字串編碼問題（UTF-8 vs ASCII）或前後端 ID 不一致

**解決方案**：
1. 檢查 `Striptables[0]._id` 的確切值
2. 比較前後端的 module_id

---

### 問題 C：Striptables 在 Spin 後被清空

**原因**：某個事件處理器錯誤地清空了陣列

**解決方案**：在 Spin 前後都檢查 Striptables.length

---

### 問題 D：getStriptable() 邏輯問題

**原因**：字串比較失敗（例如：大小寫、空格、編碼）

**解決方案**：手動測試不同格式的 ID

---

## 緊急修復（臨時方案）

如果確認 `Striptables[0]` 存在但 `getStriptable()` 返回 null，可以臨時執行：

```javascript
// 強制設置 CurModuleid
if (Data.Library.MathConsole.Striptables.length > 0) {
  Data.Library.MathConsole.CurModuleid = Data.Library.MathConsole.Striptables[0]._id;
  console.log('✅ 已強制同步 CurModuleid:', Data.Library.MathConsole.CurModuleid);
}

// 或者直接修復 getStriptable 調用
// 在 ProtoConsole.ts 的 FillWinData 函數第 777 行之前添加：
// if (!Data.Library.MathConsole.getStriptable(slot_result_proto.module_id) && Data.Library.MathConsole.Striptables.length > 0) {
//   slot_result_proto.module_id = Data.Library.MathConsole.Striptables[0]._id;
// }
```

---

## 後端狀態確認

後端已確認正確發送：
- ✅ StripsRecall: module_id = "PSS-ON-00152", 5 個滾輪
- ✅ SlotResult: module_id = "PSS-ON-00152", credit, rng[15]
- ✅ Protobuf 編碼完全符合 game.proto 定義

問題一定在前端解析或狀態管理。
