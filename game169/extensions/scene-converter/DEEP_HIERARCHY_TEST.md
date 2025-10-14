# 深層節點樹測試指南

## 更新內容 (2025-10-14)

### ✨ 新功能：支援任意深度的節點樹

現在 Scene Converter 擴展已經增強，能夠正確處理任意深度的節點結構：

#### 1. **深度追踪**
- 每個節點遍歷時會記錄當前層級深度
- 使用縮排顯示層級結構，更直觀

#### 2. **詳細的層級日誌**
```
[Scene Converter] 層級 0: Canvas 有 3 個子節點
  └─ [1/3] Background
  [Scene Converter] 層級 1: Background 有 0 個子節點
  └─ [2/3] MainMenu
    [Scene Converter] 層級 1: MainMenu 有 5 個子節點
      └─ [1/5] Title
      └─ [2/5] ButtonGroup
        [Scene Converter] 層級 2: ButtonGroup 有 3 個子節點
          └─ [1/3] StartButton
          └─ [2/3] OptionsButton
          └─ [3/3] QuitButton
        [Scene Converter] ✓ 層級 2: ButtonGroup 的 3 個子節點處理完成
      └─ [3/5] Logo
      └─ [4/5] Footer
      └─ [5/5] Settings
    [Scene Converter] ✓ 層級 1: MainMenu 的 5 個子節點處理完成
  └─ [3/3] Camera
```

#### 3. **節點樹統計**
導出完成後會顯示完整統計：
```
[Scene Converter] 📊 節點樹統計:
  - 總節點數: 47
  - 最大深度: 12
  - 葉子節點: 28
  - 有子節點的節點: 19
```

### 🔍 關鍵改進

#### UUID 提取邏輯
```javascript
// 處理嵌套 UUID 對象：{ uuid: { uuid: 'actualString' } }
while (typeof childUuid === 'object' && childUuid !== null) {
    if (childUuid.uuid) {
        childUuid = childUuid.uuid;
    } else if (childUuid.value) {
        childUuid = childUuid.value;
    } else {
        break;
    }
}
```

#### 遞歸深度傳遞
```javascript
// traverseNode 現在接受 depth 參數
async traverseNode(node, depth = 0) {
    // 處理當前節點...
    
    // 遞歸處理子節點時傳遞 depth + 1
    const childData = await exports.methods.traverseNode(child, depth + 1);
}
```

## 測試場景建議

### 場景 1: 扁平結構（1-2 層）
```
Scene
├─ Canvas
│  ├─ Background
│  └─ Label
└─ Camera
```

### 場景 2: 中等深度（5-6 層）
```
Scene
├─ Canvas
│  ├─ GameUI
│  │  ├─ TopBar
│  │  │  ├─ Score
│  │  │  └─ Lives
│  │  └─ BottomBar
│  │     ├─ Skills
│  │     │  ├─ Skill1
│  │     │  └─ Skill2
│  │     └─ Items
└─ Camera
```

### 場景 3: 深層嵌套（10+ 層）
```
Scene
├─ Canvas
│  └─ RootContainer
│     └─ Level1
│        └─ Level2
│           └─ Level3
│              └─ Level4
│                 └─ Level5
│                    └─ Level6
│                       └─ Level7
│                          └─ Level8
│                             └─ Level9
│                                └─ DeepestNode
└─ Camera
```

## 使用步驟

1. **打開 Cocos Creator 2D 專案**
2. **打開測試場景**（建議使用複雜的場景結構）
3. **開啟擴展面板**：擴展 → Scene Converter
4. **點擊「導出場景」按鈕**
5. **觀察控制台輸出**：
   - 檢查層級結構是否正確顯示
   - 確認所有子節點都被處理
   - 查看最終統計數據

6. **檢查導出的 JSON**：
   - 打開 `項目目錄/scene-exports/scene-*.json`
   - 驗證 `children` 數組是否完整
   - 檢查最深節點是否存在

## 預期結果

✅ **成功標準：**
- 所有層級的節點都被正確導出
- 控制台顯示完整的層級結構
- JSON 文件包含所有節點（包括最深層的節點）
- 統計數據準確（總節點數、最大深度等）

⚠️ **可能的問題：**
- 如果某個節點無法查詢，會顯示警告但繼續處理其他節點
- 非常深的結構（20+ 層）可能需要較長時間

## 驗證節點完整性

使用以下方法驗證導出的 JSON：

```javascript
// 在瀏覽器控制台或 Node.js 中運行
function countNodes(node) {
    let count = 1;
    if (node.children) {
        node.children.forEach(child => {
            count += countNodes(child);
        });
    }
    return count;
}

// 讀取 JSON
const data = require('./scene-exports/scene-1728901234567.json');
const total = data.children.reduce((sum, root) => sum + countNodes(root), 0);
console.log('總節點數:', total);
```

## 性能考量

- **小型場景（< 50 節點）**：幾秒內完成
- **中型場景（50-200 節點）**：10-30 秒
- **大型場景（200+ 節點）**：可能需要 1 分鐘以上

每個節點都需要一次 API 查詢，深層結構會導致大量的查詢操作。

## 下一步

完成導出測試後：
1. 打開 **3D 專案**
2. 開啟 Scene Converter 擴展
3. 點擊「選擇文件」選擇導出的 JSON
4. 點擊「導入場景」按鈕
5. 驗證節點結構是否正確重建
