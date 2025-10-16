# RampColorShader 獨立 UV 系統 - 最終檢查清單

## ✅ 已完成的工作

### 1. Shader 修改
- [x] 添加 3 個新 properties (`spriteTiling`, `rampUVTiling`, `rampUVOffsetControl`)
- [x] 添加 `effectUV` varying (vertex → fragment)
- [x] 添加 3 個新 uniforms 到 RampProperties
- [x] 實作 `normalizeEffectUV()` 函數
- [x] 修改 `calculateRampCoord()` 使用新的 UV 系統
- [x] 修改主函數調用 `calculateRampCoord(effectUV)`

### 2. 檔案狀態
- [x] 檔案大小: 18,458 bytes
- [x] 行數: 506 lines
- [x] 編碼: UTF-8
- [x] VS Code 語法檢查: 無錯誤
- [x] 所有修改點已驗證

### 3. 文檔
- [x] 完整使用指南: `RampColorShader-UV-Fix-Complete.md`
- [x] 排查步驟: `RampColorShader-Troubleshooting-Steps.md`
- [x] 診斷報告: `RampColorShader-Diagnostic-Report.md`

### 4. 環境清理
- [x] 清除 Cocos Creator 快取 (temp/, library/, profiles/)
- [x] 刪除 .meta 檔案 (重新生成)
- [x] 創建清除腳本: `Clear-CocosCache.ps1`

## 🎯 立即要做的事

### 步驟 1: 重啟 Cocos Creator
1. 完全關閉 Cocos Creator
2. 重新啟動 Cocos Creator
3. 打開專案（第一次可能需要 2-5 分鐘重新編譯所有資源）

### 步驟 2: 檢查 Shader
1. 在專案資源面板中找到 `assets/effect/RampColorShader.effect`
2. 查看是否有錯誤標記（紅色圖示）
3. 如果有錯誤，點擊查看具體訊息

### 步驟 3: 查看控制台
打開 Cocos Creator 的控制台（Console），查找以下類型的訊息：
- **紅色錯誤** - 嚴重錯誤，shader 無法載入
- **黃色警告** - 警告訊息，可能不影響使用
- **藍色資訊** - 一般資訊訊息

### 步驟 4: 測試基礎功能
如果 shader 成功載入：

1. **創建測試場景**
   - 新增一個 Sprite 節點
   - 添加 RampColorShader Material
   - 設定基礎參數

2. **測試 Simple Sprite**
   ```
   Sprite Type: Simple
   spriteTiling: (1, 1)
   rampUVTiling: (1, 1)
   rampUVOffsetControl: (0, 0)
   ```
   **預期結果**: 單一 Ramp 效果覆蓋整個 Sprite

3. **測試 Tiled Sprite** 
   ```
   Sprite Type: Tiled 3x3
   spriteTiling: (3, 3)  ← 關鍵！
   rampUVTiling: (1, 1)
   rampUVOffsetControl: (0, 0)
   ```
   **預期結果**: 單一 Ramp 效果覆蓋整個 Sprite（不應重複數百次）

## ❌ 如果仍然無法載入

### 情況 A: 控制台顯示具體錯誤
請提供：
1. 完整的錯誤文字
2. 錯誤類型 (Compile Error / Link Error / Syntax Error)
3. 行號（如果有）
4. 相關的變數或函數名稱

### 情況 B: 沒有錯誤但 shader 不生效
可能原因：
1. Material 沒有正確綁定到 Sprite
2. Shader 參數設定錯誤
3. 紋理或資源載入問題

### 情況 C: Cocos Creator 當機或卡住
1. 等待 5-10 分鐘（可能在重新編譯）
2. 查看 Task Manager 中 Cocos Creator 的 CPU 使用率
3. 如果完全卡死，強制關閉後再重啟

## 🔄 備用方案

### 方案 1: 使用簡化版本
檔案: `RampColorShader_minimal.effect`
- 只包含基礎修改
- 如果成功，逐步添加功能

### 方案 2: 回退到穩定版本
```powershell
cd C:\projects\game152Dev\game169
git checkout d58ff30 -- assets/effect/RampColorShader.effect
```
然後在 Cocos Creator 中確認原始版本可以正常運作。

### 方案 3: 手動調整
如果無法使用自動 UV 標準化，可以：
1. 使用固定的 spriteTiling 值（硬編碼）
2. 為不同的 Sprite Type 創建不同的 Material 預設值
3. 在遊戲代碼中動態設定 spriteTiling

## 📊 技術細節參考

### UV 系統架構
```
原始 a_texCoord (Tiled 3x3 時範圍 [0,3])
    ↓
effectUV (傳遞原始值)
    ↓
normalizeEffectUV (除以 spriteTiling) → [0,1]
    ↓
應用 rampUVTiling 和 rampUVOffsetControl
    ↓
應用 rampUVScale 和 rampUVOffset (進階調整)
    ↓
根據 RAMP_DIRECTION 計算 rampCoord
    ↓
從 rampTexture 或 colorStart/End 獲取顏色
```

### 參數說明
1. **spriteTiling**: 告訴 shader Sprite 的 Tiled Type
   - Simple: (1, 1)
   - Tiled 2x2: (2, 2)
   - Tiled 3x3: (3, 3)

2. **rampUVTiling**: Ramp 效果的重複次數（獨立於 Sprite）
   - (1, 1): 不重複
   - (2, 2): 重複 2x2
   - (3, 3): 重複 3x3

3. **rampUVOffsetControl**: Ramp 效果的偏移（獨立於 Sprite）
   - (0, 0): 無偏移
   - (0.5, 0): 水平偏移 50%
   - (0, 0.5): 垂直偏移 50%

### 向後兼容性
- 如果不設定新參數，shader 行為與原始版本相同
- 既有的 `rampUVScale` 和 `rampUVOffset` 仍然可用
- 既有的 Material 不需要修改即可繼續使用

## 📝 問題報告格式

如果需要進一步協助，請提供：

```
## 環境資訊
- Cocos Creator 版本: 
- 作業系統: 
- 顯示卡: 

## 錯誤資訊
[貼上控制台的完整錯誤訊息]

## 重現步驟
1. 
2. 
3. 

## 截圖
[如果有視覺化的錯誤，請提供截圖]

## 已嘗試的解決方案
- [ ] 清除快取並重啟
- [ ] 刪除 .meta 檔案
- [ ] 測試原始版本 (d58ff30)
- [ ] 測試簡化版本
- [ ] 其他: 
```

## 🎉 成功指標

當以下所有條件都滿足時，表示修復成功：

- [ ] Cocos Creator 成功載入 shader（資源面板無錯誤標記）
- [ ] 控制台無相關錯誤訊息
- [ ] Simple Sprite + spriteTiling(1,1) 顯示正常
- [ ] Tiled 3x3 Sprite + spriteTiling(3,3) 顯示單一 Ramp 效果（不重複）
- [ ] 調整 rampUVTiling 可以讓 Ramp 重複
- [ ] 調整 rampUVOffsetControl 可以偏移 Ramp

## 聯絡資訊

如果以上步驟都無法解決問題，請回報：
1. 完整的錯誤訊息或控制台輸出
2. Cocos Creator 版本號
3. 作業系統版本
4. 已嘗試的解決方案清單

---

**最後更新**: 2025-10-16
**版本**: RampColorShader UV Fix v1.0
**狀態**: 等待 Cocos Creator 測試結果
