# Scene Converter Extension - 快速使用指南

## 🎯 這個擴展做什麼？

將你的 Cocos Creator 2D 項目場景自動轉換到 3D 項目，自動處理 Sprite 和其他組件。

## ⚡ 快速開始（3 步驟）

### 1️⃣ 在 2D 項目中導出

```
打開 2D 項目 → 打開場景 → 菜單 Panel/Scene Converter → 點擊「導出場景結構」
```

導出的 JSON 會保存在 `scene-exports/` 資料夾

### 2️⃣ 複製 JSON 到 3D 項目

將 JSON 檔案複製到你的 3D 項目資料夾

### 3️⃣ 在 3D 項目中導入

```
打開 3D 項目 → 打開/創建場景 → Panel/Scene Converter → 選擇 JSON → 導入
```

## ✅ 完成！

場景結構已重建，但你需要：
- 重新連接 Sprite 的圖片
- 重新連接材質
- 檢查座標位置

## 📋 自動處理的內容

- ✅ 節點層級結構
- ✅ 位置、旋轉、縮放
- ✅ Sprite 組件（標記為 2D）
- ✅ Widget 組件（全屏對齊等）
- ✅ Camera 組件
- ✅ 所有自定義組件（如果 3D 項目有相同腳本）

## ⚠️ 需要手動處理

- ❌ 資源引用（SpriteFrame, Material 等）→ 需手動重新拖拽
- ❌ 複雜動畫 → 可能需要調整
- ❌ 物理組件 → 可能需要重新設置

## 🔧 安裝擴展

### 方法 1: 直接使用（推薦）

將 `scene-converter` 資料夾放到你的項目 `extensions/` 目錄：

```
YourProject/
└── extensions/
    └── scene-converter/  ← 放這裡
```

重啟 Cocos Creator 即可。

### 方法 2: 全局安裝

放到 Cocos Creator 的全局擴展目錄：

**Windows**: 
```
C:\Users\你的用戶名\.CocosCreator\extensions\
```

**macOS**: 
```
~/.CocosCreator/extensions/
```

## 💡 重要提示

### Sprite 在 3D 項目中可用！

**好消息**：Cocos Creator 3.x 的 3D 項目完全支援 2D Sprite，所以：

- ✅ 不需要轉換為 3D Mesh
- ✅ Widget 正常工作
- ✅ UI 系統完全可用
- ✅ 只需重新連接圖片資源

### 關於座標系統

- 2D 項目：主要使用 X, Y
- 3D 項目：使用 X, Y, Z

導入後記得：
- 檢查 Z 軸座標（可能都是 0）
- 調整 Camera 位置（如果需要）

## 🎨 實際案例

假設你有一個 2D 項目的 UI 場景：

**導出前（2D 項目）**:
```
Canvas
├─ Background (Sprite + Widget)
├─ Button (Sprite + Widget)
└─ Text (Label)
```

**導入後（3D 項目）**:
```
Canvas
├─ Background (Sprite + Widget) ← 結構保留
├─ Button (Sprite + Widget)     ← 組件保留
└─ Text (Label)                 ← 層級保留
```

只需要重新拖拽圖片到 SpriteFrame 欄位！

## 📚 詳細文檔

查看 `extensions/scene-converter/README.md` 獲取完整文檔。

## 🐛 遇到問題？

### 看不到擴展面板？
- 檢查 `extensions/scene-converter/` 是否在正確位置
- 重啟 Cocos Creator
- 檢查控制台是否有錯誤

### 導出/導入失敗？
- 確保場景已保存
- 檢查控制台錯誤訊息
- 嘗試更小的測試場景

### 組件遺失？
- 確保 3D 項目有相同的腳本
- 檢查 Cocos Creator 版本是否一致

---

**提示**：建議先在測試項目中嘗試，確認流程後再處理正式項目！
