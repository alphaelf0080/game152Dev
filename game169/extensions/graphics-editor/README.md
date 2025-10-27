# Graphics Editor Extension for Cocos Creator

## 功能介紹

這是一個 Cocos Creator 3.8+ 的編輯器擴展，提供可視化的 2D Graphics 繪圖工具，並能將繪製的圖形自動轉換為 TypeScript 腳本代碼。

## 主要特性

### 🎨 繪圖工具
- ✅ **矩形 (Rectangle)** - 繪製填充/描邊矩形
- ✅ **圓形 (Circle)** - 繪製填充/描邊圓形
- ✅ **線條 (Line)** - 繪製直線
- 🔄 **多邊形 (Polygon)** - 繪製多邊形 (計劃中)
- 🔄 **圓弧 (Arc)** - 繪製圓弧 (計劃中)

### 🎯 功能特性
- **實時預覽** - 繪製時即時顯示效果
- **顏色選擇** - 自由設置填充色和描邊色
- **線寬調整** - 可調整描邊線條寬度 (0-20)
- **填充模式** - 可選擇填充、描邊或兩者兼具
- **撤銷操作** - 支援 Ctrl+Z 撤銷上一步操作
- **命令記錄** - 實時顯示繪圖命令列表

### 💾 代碼生成
- **自動生成** - 自動生成完整的 TypeScript 組件代碼
- **即時預覽** - 實時顯示生成的代碼
- **一鍵導出** - 導出為 `.ts` 腳本文件
- **標準格式** - 符合 Cocos Creator 3.8 標準

## 安裝方法

1. 將 `graphics-editor` 文件夾複製到項目的 `extensions` 目錄下：
   ```
   your-project/
   └── extensions/
       └── graphics-editor/
   ```

2. 在 Cocos Creator 編輯器中，打開 **擴展 > 擴展管理器**

3. 找到 **Graphics Editor** 並啟用

## 使用方法

### 1. 打開編輯器

在 Cocos Creator 菜單欄選擇：
```
擴展 > Graphics Editor > 打開 Graphics 編輯器
```

### 2. 繪製圖形

1. **選擇工具**：點擊工具欄中的繪圖工具按鈕（矩形、圓形、線條等）
2. **設置顏色**：
   - 點擊「填充」色塊選擇填充顏色
   - 點擊「描邊」色塊選擇描邊顏色
3. **調整參數**：
   - 設置線寬（0-20）
   - 勾選或取消「填充」和「描邊」選項
4. **繪製**：
   - 在畫布上按住滑鼠左鍵拖動
   - 放開滑鼠完成繪製

### 3. 查看命令

右側邊欄「繪圖命令記錄」區域會實時顯示所有繪圖命令。

### 4. 預覽代碼

「生成的腳本代碼」區域會顯示完整的 TypeScript 代碼。

### 5. 導出腳本

點擊「導出為 TypeScript 腳本」按鈕，會自動下載 `CustomGraphics.ts` 文件。

### 6. 使用生成的腳本

1. 將導出的 `.ts` 文件放入項目的 `assets/script` 目錄
2. 在場景中創建一個節點
3. 添加 `Graphics` 組件
4. 添加生成的 `CustomGraphics` 組件
5. 將 `Graphics` 組件拖到 `CustomGraphics` 的 `graphics` 屬性上
6. 運行場景查看效果

## 生成的代碼示例

```typescript
import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomGraphics')
export class CustomGraphics extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    start() {
        this.drawShapes();
    }

    private drawShapes() {
        const g = this.graphics;
        
        // 清除之前的繪製
        g.clear();
        
        // 形狀 1: 矩形
        g.lineWidth = 2;
        g.fillColor = new Color(255, 0, 0, 255);
        g.strokeColor = new Color(0, 0, 0, 255);
        g.rect(100, 100, 200, 150);
        g.fill();
        g.stroke();

        // 形狀 2: 圓形
        g.lineWidth = 3;
        g.fillColor = new Color(0, 0, 255, 255);
        g.circle(300, 200, 50);
        g.fill();
        g.stroke();
    }
}
```

## 快捷鍵

- `Ctrl + Z` - 撤銷上一步操作

## 技術規格

- **Cocos Creator 版本**：3.8.0 或更高
- **開發語言**：TypeScript, HTML, CSS
- **依賴**：無外部依賴

## Graphics API 參考

基於 Cocos Creator 3.8 官方文檔：
https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/graphics.html

### 主要 API

| 方法 | 說明 |
|------|------|
| `clear()` | 清除所有繪製內容 |
| `moveTo(x, y)` | 移動畫筆到指定位置 |
| `lineTo(x, y)` | 繪製線條到指定位置 |
| `rect(x, y, w, h)` | 繪製矩形 |
| `circle(x, y, r)` | 繪製圓形 |
| `arc(x, y, r, startAngle, endAngle)` | 繪製圓弧 |
| `fill()` | 填充路徑 |
| `stroke()` | 描邊路徑 |

## 注意事項

1. 生成的代碼使用 Cocos Creator 3.8 的 API
2. 坐標系統：左上角為原點 (0, 0)
3. 顏色值範圍：0-255
4. 建議在實際使用前測試生成的代碼

## 待開發功能

- [ ] 多邊形繪製工具
- [ ] 圓弧繪製工具
- [ ] 貝塞爾曲線工具
- [ ] 圖層管理
- [ ] 形狀編輯（移動、縮放、旋轉）
- [ ] 網格對齊
- [ ] 座標顯示
- [ ] 圖形庫（預設形狀）

## 版本歷史

### v1.0.0 (2025-10-27)
- ✅ 初始版本發布
- ✅ 支援矩形、圓形、線條繪製
- ✅ 顏色和線寬調整
- ✅ 代碼生成和導出功能

## 授權

MIT License

## 反饋與支持

如有問題或建議，請聯繫開發者。
