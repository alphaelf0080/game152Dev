# Scene Converter Extension

Cocos Creator 擴展插件 - 在 2D 和 3D 項目之間轉換場景結構

## 📋 功能特點

- ✅ 導出 2D 項目的場景結構為 JSON
- ✅ 在 3D 項目中重建場景結構
- ✅ 自動處理 2D Sprite 組件
- ✅ 保留 Widget、UITransform 等 UI 組件
- ✅ 保留節點層級關係
- ✅ 保留變換資訊（位置、旋轉、縮放）
- ✅ 自動標記需要手動處理的資源引用

## 🚀 安裝

### 方法 1: 直接複製

1. 將 `scene-converter` 資料夾複製到你的 Cocos Creator 項目的 `extensions/` 目錄
2. 重啟 Cocos Creator 或在菜單中選擇 **擴展 → 擴展管理器 → 刷新**

### 方法 2: 從源碼編譯

```bash
cd extensions/scene-converter
npm install
npm run build
```

## 📖 使用方法

### 步驟 1: 在 2D 項目中導出場景

1. 打開你的 2D 項目
2. 打開要轉換的場景
3. 菜單 → **面板 → Scene Converter**
4. 點擊 **「導出場景結構」**
5. JSON 檔案會自動保存到 `scene-exports/` 資料夾

### 步驟 2: 複製檔案到 3D 項目

將導出的 JSON 檔案複製到你的 3D 項目資料夾中

### 步驟 3: 在 3D 項目中導入場景

1. 打開你的 3D 項目
2. 創建新場景或打開要導入到的場景
3. 菜單 → **面板 → Scene Converter**
4. 點擊 **「選擇 JSON 檔案」** 選擇導出的 JSON
5. 點擊 **「導入場景結構」**
6. 等待導入完成

### 步驟 4: 手動調整

導入後需要手動處理：

- **重新連接資源**：
  - Sprite 的 SpriteFrame
  - MeshRenderer 的 Mesh 和 Material
  - 其他資源引用

- **檢查組件**：
  - 確保自定義組件腳本存在
  - 檢查組件屬性是否正確

- **調整座標**：
  - 2D 和 3D 座標系可能不同
  - 根據需要調整節點位置

## ⚙️ 支援的組件

### 完全支援
- ✅ cc.Sprite（自動標記為 2D）
- ✅ cc.UITransform
- ✅ cc.Widget
- ✅ cc.Camera
- ✅ cc.MeshRenderer
- ✅ cc.Transform

### 部分支援
- ⚠️ 自定義組件（需要目標項目中有相同腳本）
- ⚠️ 資源引用（保留 UUID，需手動重新連接）

## 🎯 最佳實踐

### 2D Sprite 在 3D 項目中

**好消息**：Cocos Creator 3.x 的 3D 項目完全支援 2D Sprite！

- ✅ 無需轉換為 MeshRenderer
- ✅ Widget 組件正常工作
- ✅ UI 系統完全可用

### 座標系統

- **2D 項目**：通常使用 2D 座標系（X, Y）
- **3D 項目**：使用 3D 座標系（X, Y, Z）

建議：
- 導入後檢查 Z 軸座標
- 根據需要調整 Camera 位置和視野

### 資源管理

1. **在導出前**：
   - 確保所有資源都已正確引用
   - 檢查材質和紋理

2. **在導入後**：
   - 在 3D 項目中導入相同的資源
   - 手動重新連接資源引用

## 🔧 開發者資訊

### 項目結構

```
scene-converter/
├── package.json          # 擴展配置
├── tsconfig.json        # TypeScript 配置
├── src/
│   ├── main.ts          # 主邏輯
│   └── panels/
│       └── default/
│           └── index.html  # UI 面板
└── dist/                # 編譯輸出
```

### API

#### 導出場景
```typescript
Editor.Message.request('scene-converter', 'export-scene', scenePath)
```

#### 導入場景
```typescript
Editor.Message.request('scene-converter', 'import-scene', jsonPath)
```

### JSON 格式

```json
{
  "name": "Node",
  "position": { "x": 0, "y": 0, "z": 0 },
  "rotation": { "x": 0, "y": 0, "z": 0, "w": 1 },
  "scale": { "x": 1, "y": 1, "z": 1 },
  "active": true,
  "layer": 0,
  "components": [
    {
      "type": "cc.Sprite",
      "enabled": true,
      "spriteFrame": "uuid",
      "is2D": true
    }
  ],
  "children": []
}
```

## ⚠️ 已知限制

1. **資源引用**：UUID 在不同項目中不同，需手動重新連接
2. **自定義組件**：需要兩個項目都有相同的腳本
3. **複雜材質**：Shader 參數可能需要手動調整
4. **動畫**：動畫組件需要手動處理
5. **物理組件**：剛體和碰撞器需要手動調整

## 🐛 故障排除

### 導出失敗
- 確保場景已保存
- 檢查控制台錯誤訊息
- 嘗試導出較小的場景測試

### 導入失敗
- 檢查 JSON 檔案格式
- 確保目標場景已打開
- 查看控制台錯誤訊息

### 組件遺失
- 確保目標項目有相應的組件腳本
- 檢查 Cocos Creator 版本兼容性

## 📝 更新日誌

### v1.0.0 (2025-10-14)
- ✨ 初始版本
- ✅ 基本的場景導出/導入功能
- ✅ 2D Sprite 自動標記
- ✅ Widget 組件支援
- ✅ 圖形化操作面板

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**注意**：此擴展是為了簡化 2D 到 3D 項目的場景遷移，但仍需要手動調整部分內容。建議在測試項目中先試用。
