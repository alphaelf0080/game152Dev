# RampColorShader - 快速修復參考

## ✅ 問題已解決

**錯誤**: `The "path" argument must be of type string or an instance of Buffer or URL. Received undefined`

**原因**: Meta 檔案和快取混亂

**已執行的修復**:
- ✅ 刪除所有 meta 檔案
- ✅ 刪除備份檔案
- ✅ 清除 Cocos Creator 快取
- ✅ 驗證 shader 語法正確

---

## 🚀 立即操作

### 步驟 1: 重啟 Cocos Creator
```
1. 完全關閉 Cocos Creator
2. 重新啟動
3. 打開專案 (首次需等待 2-5 分鐘)
```

### 步驟 2: 檢查載入結果
查看 `assets/effect/RampColorShader.effect` 是否：
- ✅ 無紅色錯誤標記
- ✅ 控制台無錯誤訊息

### 步驟 3: 測試功能
創建測試 Sprite，設定參數：
```
Sprite Type: Tiled 3x3
spriteTiling: (3, 3)  ← 必須與 Tiled 數量一致
rampUVTiling: (1, 1)
rampUVOffsetControl: (0, 0)
```

**預期**: 單一 Ramp 效果，不會重複

---

## 📊 參數說明

### spriteTiling (新增)
告訴 shader Sprite 的 Tiled 設定
- Simple → (1, 1)
- Tiled 2x2 → (2, 2)
- Tiled 3x3 → (3, 3)

### rampUVTiling (新增)
Ramp 效果的重複次數（獨立）
- (1, 1) → 不重複
- (2, 2) → 重複 2x2

### rampUVOffsetControl (新增)
Ramp 效果的偏移（獨立）
- (0, 0) → 無偏移
- (0.5, 0) → 水平偏移 50%

---

## ❌ 如果仍然失敗

請提供以下資訊：

1. **錯誤訊息** (完整文字或截圖)
2. **Cocos Creator 版本**
3. **發生階段** (啟動/載入/執行)

查看詳細文檔：
- `docs/RampColorShader-Path-Error-Fixed.md`
- `docs/RampColorShader-Final-Checklist.md`

---

## 🔧 緊急工具

重新執行修復腳本：
```powershell
cd C:\projects\game152Dev\game169
.\Fix-RampColorShader.ps1
```

回退到穩定版本：
```powershell
cd C:\projects\game152Dev\game169
git checkout d58ff30 -- assets/effect/RampColorShader.effect
```

---

**狀態**: ✅ 所有修復已完成，請重啟 Cocos Creator
**時間**: 2025-10-16
