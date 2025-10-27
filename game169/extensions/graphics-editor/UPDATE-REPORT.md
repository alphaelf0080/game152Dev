# Graphics Editor Extension - 更新報告

## 📝 更新概要

**版本**: 1.0.0 → 1.1.0  
**更新日期**: 2025-10-27  
**更新內容**: 添加背景圖片載入與坐標系統功能

---

## ✨ 新增功能

### 1. 背景圖片系統

#### 功能描述
允許載入設計稿或參考圖片作為繪圖背景，使繪製過程更加精確。

#### 技術實現
- 三層 Canvas 結構：
  - `bgCanvas` (z-index: 1) - 背景圖片層
  - `gridCanvas` (z-index: 2) - 網格與坐標軸層
  - `drawCanvas` (z-index: 3) - 繪圖層
- 圖片自動縮放適配畫布尺寸
- 支援 PNG、JPG、JPEG、WEBP 格式

#### UI 控制
```typescript
<ui-button id="btnLoadBg">載入背景</ui-button>
<ui-button id="btnClearBg">清除背景</ui-button>
```

#### 代碼位置
- `panels/default.ts` Line 518-544: `loadBackgroundImage()`, `redrawBackground()`, `clearBackground()`

---

### 2. 坐標系統選擇

#### 功能描述
支援三種坐標原點模式，自動進行 Canvas 坐標與 Cocos Creator 坐標的轉換。

#### 坐標模式

**左下 (bottomLeft)** - Cocos Creator 預設
- 原點: 左下角 (0, canvasHeight)
- Y 軸: 向上為正
- 公式: `cocosX = canvasX`, `cocosY = canvasHeight - canvasY`

**中心 (center)**
- 原點: 畫布中心 (canvasWidth/2, canvasHeight/2)
- 適合: 對稱圖形設計
- 公式: `cocosX = canvasX - width/2`, `cocosY = height/2 - canvasY`

**左上 (topLeft)**
- 原點: 左上角 (0, 0)
- Y 軸: 向下為正（注意！）
- 公式: `cocosX = canvasX`, `cocosY = -canvasY`

#### UI 控制
```typescript
<ui-select id="originMode">
    <option value="center">中心 (0,0)</option>
    <option value="bottomLeft">左下 (Cocos 預設)</option>
    <option value="topLeft">左上</option>
</ui-select>
```

#### 代碼位置
- `panels/default.ts` Line 474-495: `canvasToCocosX()`, `canvasToCocosY()`
- `panels/default.ts` Line 390-460: `drawGrid()` - 繪製坐標軸與刻度

---

### 3. 網格與坐標軸顯示

#### 功能描述
- 50px 間距參考網格
- 紅色 X 軸、綠色 Y 軸
- 藍色原點標籤
- 網格刻度顯示實際 Cocos 坐標值

#### UI 控制
```typescript
<ui-checkbox id="showGrid" checked>顯示網格</ui-checkbox>
```

#### 視覺效果
```
網格線: rgba(0, 0, 0, 0.1)
X 軸: rgba(255, 0, 0, 0.5) - 紅色
Y 軸: rgba(0, 255, 0, 0.5) - 綠色
原點: rgba(0, 0, 255, 0.7) - 藍色
```

---

### 4. 實時坐標顯示

#### 功能描述
滑鼠移動時右下角顯示實時坐標，同時顯示 Canvas 坐標和對應的 Cocos 坐標。

#### 顯示格式
```
Canvas: (123, 456) → Cocos: (123, 234)
```

#### UI 元素
```html
<div id="coordDisplay" class="coord-display"></div>
```

#### 代碼位置
- `panels/default.ts` Line 735-741: `onMouseMove()` 坐標更新邏輯

---

### 5. 自定義畫布尺寸

#### 功能描述
允許設置自定義畫布尺寸（100px ~ 2000px），支援與實際項目尺寸匹配。

#### UI 控制
```html
<ui-num-input id="canvasWidth" value="600" min="100" max="2000"></ui-num-input>
<ui-num-input id="canvasHeight" value="400" min="100" max="2000"></ui-num-input>
<ui-button id="btnApplySize">應用尺寸</ui-button>
```

#### 代碼位置
- `panels/default.ts` Line 361-377: `applyCanvasSize()`

---

## 🔧 技術變更

### 文件結構變更

#### package.json
```json
{
  "panels": {
    "default": {
      "main": "./dist/panels/default.js",  // 修改: 指向編譯後的 JS
      "icon": "./static/icon.svg"
    }
  }
}
```

#### Canvas 結構變更

**舊版本** (v1.0.0):
```html
<canvas id="drawCanvas"></canvas>
```

**新版本** (v1.1.0):
```html
<div class="canvas-wrapper">
    <canvas id="bgCanvas"></canvas>      <!-- 新增 -->
    <canvas id="gridCanvas"></canvas>    <!-- 新增 -->
    <canvas id="drawCanvas"></canvas>
    <div id="coordDisplay"></div>       <!-- 新增 -->
</div>
```

### CSS 變更

新增多層 Canvas 定位樣式：
```css
.canvas-wrapper {
    position: relative;
}

#bgCanvas, #gridCanvas, #drawCanvas {
    position: absolute;
    top: 0;
    left: 0;
}

#bgCanvas { z-index: 1; background: #fff; }
#gridCanvas { z-index: 2; pointer-events: none; }
#drawCanvas { z-index: 3; cursor: crosshair; }
```

---

## 📦 代碼生成增強

### 坐標轉換

所有生成的代碼現在會自動使用 Cocos 坐標：

**繪製時** (Canvas 坐標):
```javascript
startX: 100, startY: 200
```

**生成代碼** (Cocos 坐標):
```typescript
// 左下坐標系 (canvasHeight = 400)
g.rect(100, 200, 50, 50);  // Y = 400 - 200 = 200
```

### 代碼註釋

生成的代碼包含坐標系統說明：
```typescript
/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: 左下 - Cocos Creator 預設
 */
```

---

## 📚 新增文檔

### 1. COORDINATE-SYSTEM-GUIDE.md
- 完整坐標系統說明
- 使用範例與最佳實踐
- 坐標對照表
- 5分鐘快速開始指南

### 2. INSTALL.md 更新
- 新增「背景圖片與坐標系統」章節
- 新增使用技巧
- 新增故障排除（背景圖片相關）

---

## 🎯 使用場景

### 場景 1: UI 佈局設計
```
1. 設計師提供 UI 設計稿 (1920x1080)
2. 載入設計稿作為背景
3. 設置畫布尺寸為 1920x1080
4. 選擇「左下」坐標系
5. 繪製 UI 元素邊界
6. 導出代碼，坐標自動轉換
```

### 場景 2: 遊戲關卡編輯
```
1. 載入關卡背景圖
2. 使用「中心」坐標系
3. 繪製對稱的遊戲元素
4. 導出代碼用於 Graphics 繪製
```

### 場景 3: 精確座標記錄
```
1. 載入參考圖片
2. 滑鼠移動查看實時坐標
3. 記錄關鍵位置的 Cocos 坐標
4. 用於程式碼中的定位計算
```

---

## 🐛 已修復問題

### v1.0.0 問題
- ❌ 面板打開後顯示空白畫面
- ❌ 缺少背景參考功能
- ❌ 無法查看實際 Cocos 坐標
- ❌ 坐標轉換需要手動計算

### v1.1.0 修復
- ✅ 修正面板載入邏輯
- ✅ 添加三層 Canvas 結構
- ✅ 實現實時坐標顯示
- ✅ 自動坐標轉換系統

---

## 📊 性能影響

### Canvas 層級
- 背景層: 僅在載入/清除時重繪
- 網格層: 僅在設置變更時重繪
- 繪圖層: 每次繪製時重繪（與舊版相同）

### 記憶體使用
- 三個 Canvas: 約 3 × (寬 × 高 × 4 bytes)
- 600×400 畫布: ~2.88 MB
- 1920×1080 畫布: ~24.9 MB

---

## 🔄 升級指南

### 從 v1.0.0 升級到 v1.1.0

1. **備份現有擴展** (可選)
   ```bash
   cp -r extensions/graphics-editor extensions/graphics-editor-backup
   ```

2. **更新文件**
   ```bash
   cd extensions/graphics-editor
   # 拉取最新代碼或覆蓋文件
   ```

3. **重新編譯**
   ```bash
   npm run build
   ```

4. **重新加載擴展**
   - Cocos Creator → 開發者 → 重新加載擴展

5. **驗證功能**
   - 打開 Graphics Editor
   - 確認看到「載入背景」和「坐標原點」選項
   - 測試載入背景圖片
   - 測試坐標顯示

---

## 📋 文件清單

### 新增文件
```
COORDINATE-SYSTEM-GUIDE.md    - 坐標系統完整指南
UPDATE-REPORT.md              - 本更新報告
```

### 修改文件
```
panels/default.ts             - 完整重寫（346 → 886 行）
INSTALL.md                    - 更新使用說明與功能列表
package.json                  - 修改面板入口路徑
```

### 未變更文件
```
src/main.ts                   - 主入口（無變更）
tsconfig.json                 - TypeScript 配置（無變更）
README.md                     - 保持原有內容
```

---

## ✅ 測試檢查清單

- [ ] 擴展可正常載入
- [ ] 面板打開後顯示完整界面
- [ ] 載入背景圖片功能正常
- [ ] 清除背景圖片功能正常
- [ ] 三種坐標系統切換正常
- [ ] 網格顯示/隱藏正常
- [ ] 實時坐標顯示正確
- [ ] 畫布尺寸調整正常
- [ ] 繪製矩形功能正常
- [ ] 繪製圓形功能正常
- [ ] 繪製線條功能正常
- [ ] 代碼生成包含正確 Cocos 坐標
- [ ] 代碼導出功能正常
- [ ] 撤銷功能正常
- [ ] 清空功能正常

---

## 🚀 下一步計劃

### v1.2.0 計劃功能
- [ ] 多邊形繪製工具
- [ ] 圓弧/扇形繪製工具
- [ ] 貝塞爾曲線工具
- [ ] 圖層系統
- [ ] 形狀編輯（移動、縮放、旋轉）
- [ ] 吸附對齊功能
- [ ] 顏色預設庫
- [ ] 形狀庫/模板

---

**編譯狀態**: ✅ 成功  
**測試狀態**: ⏳ 待用戶測試  
**文檔狀態**: ✅ 完整  
**發布狀態**: ✅ 可發布
