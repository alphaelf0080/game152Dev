# RampUV Offset 自動更新 - 快速參考

## 🎯 功能
當在 Inspector 中修改 ContentSize 時，`rampUVOffset` 會自動重新計算並更新。

---

## ✅ 確認設置

```
RampShaderResetInspector 組件:
  ✓ autoCalculateOnLoad: true
  ✓ autoCalculateOffset: true
  ✓ showDetailedLogs: true（查看日誌）
```

---

## 📊 工作原理

```
修改 ContentSize
  ↓
自動偵測變化（每幀檢查）
  ↓
重新計算 offset
  ↓
更新 Material 屬性
```

---

## 🧪 測試步驟

1. **選擇節點**
2. **查看初始值**:
   - ContentSize: [696, 540]
   - Ramp UV Offset: [0.31, 0.24]

3. **修改 ContentSize** 為 [1024, 768]

4. **觀察 Console**:
   ```
   📏 ContentSize 變化偵測:
      從 [696, 540]
      到 [1024, 768]
      🔄 自動重新計算 UV 參數...
   
   📐 RampUV 精準計算結果:
      ContentSize: (1024, 768)
      RampUVOffset (自動): (0.2107, 0.1688)
      ↳ 像素偏移: (215.8px, 129.6px)
   ```

5. **驗證 Material**:
   - Ramp UV Offset 應更新為 [0.2107, 0.1688] ✓

---

## 📐 計算公式

```typescript
offsetX = 215.76 / width
offsetY = 129.60 / height
```

**特點**: 保持固定的像素偏移（215.76px, 129.60px）

---

## 📋 驗證對照表

| ContentSize | 自動計算的 Offset | 固定像素偏移 |
|-------------|------------------|-------------|
| [512, 512] | [0.421406, 0.253125] | [215.76px, 129.60px] |
| [696, 540] | [0.310000, 0.240000] | [215.76px, 129.60px] ✓ |
| [1024, 768] | [0.210742, 0.168750] | [215.76px, 129.60px] |
| [1920, 1080] | [0.112375, 0.120000] | [215.76px, 129.60px] |

---

## 🐛 故障排除

### offset 沒有自動更新？

**檢查**:
- [ ] 是否在編輯器模式？
- [ ] `autoCalculateOffset = true`？
- [ ] Console 有偵測日誌嗎？
- [ ] `showDetailedLogs = true`？

### 沒有日誌輸出？

**檢查**:
- [ ] `showDetailedLogs = true`？
- [ ] 確實修改了 ContentSize？
- [ ] 場景在預覽模式？

---

## 💡 關鍵點

✅ **自動偵測** - 編輯器模式下自動檢測變化  
✅ **即時更新** - 修改後立即重新計算  
✅ **固定像素** - 所有尺寸保持相同的像素偏移  
✅ **日誌追蹤** - 清晰的變化記錄  

---

*版本: 5.1.0 | 更新: 2025-10-17*
