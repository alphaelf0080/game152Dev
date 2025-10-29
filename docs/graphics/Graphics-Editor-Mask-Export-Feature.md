# Graphics Editor - Mask 導出功能

## 🎉 v1.1.0 新功能

Graphics Editor 現在支持一鍵導出專門用於 Mask（遮罩）的 TypeScript 腳本！

## ✨ 新增功能

### 導出為 Mask 腳本按鈕

在 Graphics Editor 的右側面板新增了 **"導出為 Mask 腳本"** 按鈕（紫色），點擊後會生成專門優化用於 Cocos Creator Mask 組件的代碼。

### 與普通導出的區別

| 功能 | 導出為 TypeScript 腳本 | 導出為 Mask 腳本 |
|------|----------------------|-----------------|
| **用途** | 通用圖形繪製 | Mask（遮罩）專用 |
| **顏色** | 保留原始顏色和透明度 | 自動轉為白色 (255,255,255,255) |
| **描邊** | 包含描邊代碼 | 移除描邊，只保留填充 |
| **組件** | Graphics | Graphics + Mask |
| **折線處理** | 按原樣導出 | 自動添加 close() 閉合路徑 |
| **除錯模式** | 無 | 內建除錯模式（紅色半透明） |

## 📦 導出的代碼特點

### 1. 自動優化顏色

**普通導出：**
```typescript
g.fillColor = new Color(255, 0, 0, 255);  // 保留原始紅色
g.strokeColor = new Color(0, 0, 0, 255);  // 黑色描邊
```

**Mask 導出：**
```typescript
// Mask 必須使用白色（除錯模式除外）
if (this.debugMode) {
    g.fillColor.set(255, 0, 0, 128);  // 除錯：紅色半透明
} else {
    g.fillColor.set(255, 255, 255, 255);  // 正常：白色
}
```

### 2. 移除不必要的描邊

**普通導出：**
```typescript
g.rect(-360, 540, 720, -1080);
g.fill();
g.stroke();  // 包含描邊
```

**Mask 導出：**
```typescript
g.rect(-360, 540, 720, -1080);
g.fill();  // 只需填充，無描邊
```

### 3. 自動處理折線閉合

**普通導出：**
```typescript
g.moveTo(-163, 123);
g.lineTo(218, 123);
g.lineTo(218, -384);
// 可能未閉合
g.fill();
```

**Mask 導出：**
```typescript
g.moveTo(-163, 123);
g.lineTo(218, 123);
g.lineTo(218, -384);
g.close(); // 自動閉合路徑
g.fill();
```

### 4. 智能警告系統

Mask 導出會自動檢測並添加警告註釋：

```typescript
// ⚠️ 注意：單一線條無法形成遮罩區域
g.moveTo(0, 0);
g.lineTo(100, 100);

// ⚠️ 警告：未閉合的折線無法形成遮罩區域
// g.close(); // 取消註釋以閉合路徑
```

## 🎯 使用流程

### Step 1: 在 Graphics Editor 中繪製

1. 開啟：**擴展 → Graphics Editor**
2. 繪製遮罩形狀（矩形/圓形/折線）
3. 點擊：**導出為 Mask 腳本**（紫色按鈕）
4. 選擇保存位置，默認檔名：`CustomMask.ts`

### Step 2: 創建 Mask 節點

```
MaskNode
  ├─ UITransform
  ├─ Graphics
  ├─ Mask (Type: GRAPHICS_STENCIL)
  └─ CustomMask.ts (導出的腳本)
```

### Step 3: 配置組件

1. **Mask 組件：**
   - Type: `GRAPHICS_STENCIL`
   - Inverted: `false`
   
2. **腳本屬性：**
   - Graphics: 拖入 Graphics 組件
   - Mask: 拖入 Mask 組件
   - Debug Mode: 除錯時勾選（顯示紅色半透明）

### Step 4: 添加被遮罩內容

在 MaskNode 下創建子節點，添加 Sprite、Label 等組件。

## 🔧 導出的完整代碼結構

```typescript
import { _decorator, Component, Graphics, Mask } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Graphics Editor 生成的 Mask（遮罩）代碼
 * 坐標系統: 中心 (0,0)
 * 
 * 使用說明：
 * 1. 將此腳本掛載到節點上
 * 2. 添加 Graphics 組件
 * 3. 添加 Mask 組件（Type: GRAPHICS_STENCIL）
 * 4. 在 Mask 節點下添加子節點作為被遮罩的內容
 */
@ccclass('CustomMask')
export class CustomMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    @property(Mask)
    mask: Mask | null = null;
    
    @property({
        displayName: '顯示遮罩區域（除錯）',
        tooltip: '勾選後會用半透明紅色顯示遮罩形狀，方便調試'
    })
    debugMode: boolean = false;
    
    start() {
        // 自動獲取組件
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
        
        if (!this.mask) {
            this.mask = this.getComponent(Mask);
        }
        
        // 繪製遮罩
        this.drawMaskShape();
    }
    
    drawMaskShape() {
        const g = this.graphics;
        if (!g) {
            console.error('[CustomMask] Graphics 組件未找到！');
            return;
        }
        
        g.clear();
        
        // Mask 必須使用白色（除錯模式除外）
        if (this.debugMode) {
            g.fillColor.set(255, 0, 0, 128);  // 除錯模式
        } else {
            g.fillColor.set(255, 255, 255, 255);  // 正常模式
        }
        
        // === 這裡是從 Graphics Editor 生成的遮罩形狀 ===
        // 遮罩形狀 1: 矩形
        g.rect(-360, 540, 720, -1080);
        g.fill();
        // === 生成代碼結束 ===
    }
}
```

## 🎨 實際應用示例

### 示例 1：老虎機捲軸遮罩

```typescript
// 在 Graphics Editor 中繪製 720x1080 的矩形
// 點擊「導出為 Mask 腳本」
// 生成的代碼：

drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255);
    
    // 遮罩形狀 1: 矩形
    g.rect(-360, 540, 720, -1080);
    g.fill();
}
```

### 示例 2：圓形頭像遮罩

```typescript
// 在 Graphics Editor 中繪製圓形
// 點擊「導出為 Mask 腳本」
// 生成的代碼：

drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255);
    
    // 遮罩形狀 1: 圓形
    g.circle(0, 0, 100);
    g.fill();
}
```

### 示例 3：自定義形狀遮罩

```typescript
// 在 Graphics Editor 中使用折線工具繪製
// 記得點擊「完成折線」或按 ESC 鍵閉合
// 點擊「導出為 Mask 腳本」
// 生成的代碼：

drawMaskShape() {
    const g = this.graphics;
    g.clear();
    g.fillColor.set(255, 255, 255, 255);
    
    // 遮罩形狀 1: 折線
    g.moveTo(-163, 123);
    g.lineTo(218, 123);
    g.lineTo(218, -384);
    g.lineTo(-163, -384);
    g.close(); // 自動閉合路徑
    g.fill();
}
```

## 🐛 除錯技巧

### 使用內建除錯模式

導出的代碼自帶除錯模式，只需在 Inspector 中勾選 `debugMode`：

```typescript
// debugMode = true 時
g.fillColor.set(255, 0, 0, 128);  // 紅色半透明，可以看到遮罩區域

// debugMode = false 時
g.fillColor.set(255, 255, 255, 255);  // 白色不透明，正常遮罩
```

這樣可以輕鬆檢查遮罩形狀是否正確！

## ⚡ 性能優化

導出的 Mask 代碼已經過優化：

- ✅ 只在 `start()` 中繪製一次
- ✅ 無不必要的描邊計算
- ✅ 最小化顏色設置
- ✅ 自動錯誤檢測

## 📊 按鈕對比

| 按鈕 | 顏色 | 用途 | 導出檔名 |
|------|------|------|---------|
| **複製代碼** | 綠色 | 複製到剪貼板 | - |
| **導出為 TypeScript 腳本** | 藍色 | 通用圖形繪製 | CustomGraphics.ts |
| **導出為 Mask 腳本** | 紫色 | Mask 遮罩專用 | CustomMask.ts |
| **清空所有繪圖** | 紅色 | 清除畫布 | - |

## 🎉 總結

**導出為 Mask 腳本**功能讓創建遮罩變得更簡單：

1. ✅ 無需手動修改顏色為白色
2. ✅ 無需刪除描邊代碼
3. ✅ 自動處理折線閉合
4. ✅ 內建除錯模式
5. ✅ 智能警告提示
6. ✅ 開箱即用

現在你可以在 Graphics Editor 中設計任意複雜的遮罩形狀，一鍵導出，立即使用！🎨✨
