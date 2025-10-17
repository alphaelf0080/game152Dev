# RampUV Offset 修復驗證指南

**日期**: 2025-10-17  
**修復**: offset 從錯誤的尺寸比例計算改為 UV 空間固定值

---

## 🔧 已修復的問題

### 修復前（❌ 錯誤）
```typescript
// 錯誤公式：offset 隨尺寸比例縮放
baseOffset = refOffset × (currentSize / refSize)

// 示例結果（錯誤）：
ContentSize [1200, 300], refSize [696, 540]
offset = [0.31 × 1.724, 0.24 × 0.556]
      = [0.5345, 0.1333]  ❌ 視覺效果錯誤
```

### 修復後（✅ 正確）
```typescript
// 正確公式：offset 在 UV 空間中保持固定
baseOffset = refOffset  (固定值，不隨尺寸變化)

// 示例結果（正確）：
ContentSize [1200, 300], refOffset [0.31, 0.24]
offset = [0.31, 0.24]  ✓ 視覺效果正確
```

---

## 🧪 測試步驟

### 步驟 1: 重新載入場景
1. 在 Cocos Creator 中重新載入場景
2. 確保新代碼已編譯

### 步驟 2: 檢查 Console 輸出

**預期輸出**（以 ContentSize [696, 540] 為例）：
```
📐 RampUV 精準計算結果:
   ContentSize: (696, 540)
   Anchor Point: (0.5, 0.5)
   NodeUVScale: (0.002874, 0.003704)
   公式: nodeUVScale = 2 / contentSize
   Sprite Tiling: (1, 1)
   參考 Offset: [0.31, 0.24] (在 UV 空間中固定)
   RampUVOffset (自動): (0.3100, 0.2400)
   ↳ 基礎 Offset: [0.31, 0.24] (UV 空間固定值)
   ↳ Anchor 補償: [0.00, 0.00]
   ↳ Tiling 補償: [0.00, 0.00]
   💡 公式: offset = refOffset (UV固定) + Anchor補償 + Tiling補償
   ✓ 此時 rampUVScale=[1.0,1.0] 表示單次完整覆蓋
```

**關鍵驗證點**：
- ✓ "參考 Offset" 顯示 `[0.31, 0.24] (在 UV 空間中固定)`
- ✓ "基礎 Offset" 顯示 `[0.31, 0.24] (UV 空間固定值)`
- ✓ "RampUVOffset (自動)" 顯示 `(0.3100, 0.2400)` (如果 Anchor 和 Tiling 都是預設值)
- ✓ 公式說明是 `offset = refOffset (UV固定) + ...`

### 步驟 3: 測試不同 ContentSize

#### 測試 A: 保持參考尺寸
```
ContentSize: [696, 540]
預期 offset: [0.31, 0.24]
```

#### 測試 B: 改變寬度
```
ContentSize: [1200, 540]
預期 offset: [0.31, 0.24]  (應該相同！)
```

#### 測試 C: 改變高度
```
ContentSize: [696, 300]
預期 offset: [0.31, 0.24]  (應該相同！)
```

#### 測試 D: 完全不同尺寸
```
ContentSize: [1200, 300]
預期 offset: [0.31, 0.24]  (應該相同！)
```

### 步驟 4: 驗證視覺效果

**關鍵問題**: 無論 ContentSize 如何變化，渐變效果的起始位置在 UV 空間中應該保持一致。

**檢查方式**：
1. 在參考配置 [696, 540] 下觀察渐變效果位置
2. 改變 ContentSize 到 [1200, 300]
3. 渐變效果的相對位置應該保持一致（在 UV 空間中）

---

## 📊 Inspector 檢查

### 檢查 RampShaderResetInspector 組件

**正常顯示**（這些是可配置的參考值）：
```
Reference Width: 696
Reference Height: 540
Reference Offset X: 0.31
Reference Offset Y: 0.24
Enable Manual Input: false (未勾選)
```

**Material 檢查**：
```
Ramp UV Offset: 應該顯示 [0.31, 0.24] 或類似值
```

**❌ 不應該出現的值**：
- Ramp UV Offset: [0.5345, 0.1333] ← 這是舊的錯誤計算結果

---

## 🐛 常見問題

### Q1: offset 還是顯示 [0.5345, 0.1333]

**原因**: 舊代碼還在運行，沒有重新編譯

**解決方法**:
1. 關閉 Cocos Creator
2. 刪除 `temp` 和 `library` 資料夾
3. 重新啟動 Cocos Creator
4. 等待完全編譯後再測試

### Q2: Console 輸出還是顯示 "比例係數"

**原因**: 日誌輸出還沒更新

**解決方法**: 代碼已經修復，只是日誌格式改變了

### Q3: 視覺效果沒有改變

**可能原因**:
1. 參考 offset [0.31, 0.24] 本身就不正確
2. 需要調整參考 offset 值

**解決方法**: 
1. 啟用 "Enable Manual Input"
2. 手動調整 offset 找到最佳值
3. 將最佳值設定為 Reference Offset X/Y
4. 關閉 "Enable Manual Input"

---

## ✅ 驗證清單

測試完成後，請確認：

- [ ] Console 輸出顯示 "UV 空間固定值"
- [ ] offset 值是 [0.31, 0.24]（或你設定的參考值）
- [ ] 改變 ContentSize 時 offset 保持不變
- [ ] 視覺效果在不同 ContentSize 下保持一致
- [ ] 不再出現 [0.5345, 0.1333] 這樣的錯誤值

---

## 🎯 成功標準

### ✓ 修復成功
- offset 在 UV 空間中保持固定
- 不隨 ContentSize 變化
- 視覺效果正確一致

### ✓ Inspector 顯示正常
- Reference 參數顯示（可配置）
- Ramp UV Offset 顯示正確值
- 沒有異常的大數值

### ✓ Console 日誌清晰
- 顯示 "UV 空間固定值"
- 解釋 offset 不隨尺寸變化
- 公式說明正確

---

## 📝 測試報告模板

```
測試日期: ___________
測試人員: ___________

測試案例 1: ContentSize [696, 540]
- offset 值: [_____, _____]
- 視覺效果: ☐ 正確 ☐ 錯誤
- 備註: ___________

測試案例 2: ContentSize [1200, 300]
- offset 值: [_____, _____]
- 視覺效果: ☐ 正確 ☐ 錯誤
- 與案例1一致: ☐ 是 ☐ 否
- 備註: ___________

測試案例 3: ContentSize [1392, 1080]
- offset 值: [_____, _____]
- 視覺效果: ☐ 正確 ☐ 錯誤
- 與案例1一致: ☐ 是 ☐ 否
- 備註: ___________

總結:
☐ 修復成功，offset 保持固定
☐ 仍有問題，需要進一步調整
☐ 其他: ___________
```

---

## 下一步

修復驗證成功後：
1. 更新項目文檔
2. 移除或重命名 Reference Width/Height（改為僅供參考）
3. 清理舊的錯誤文檔
4. 提交代碼

---

**重要提醒**: 
> 這次修復的核心是理解 **offset 在 UV 空間中應該保持固定**。
> 
> 如果測試後視覺效果還是不對，那麼問題不在公式，而在參考 offset 值本身需要調整。
