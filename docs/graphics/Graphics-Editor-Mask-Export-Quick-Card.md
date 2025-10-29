# Graphics Editor - Mask 導出快速參考

## 🚀 一鍵導出 Mask 腳本

### 按鈕位置
```
Graphics Editor 右側面板
  └─ 生成的腳本代碼區域
      ├─ [複製代碼] (綠色)
      ├─ [導出為 TypeScript 腳本] (藍色)
      ├─ [導出為 Mask 腳本] (紫色) ← 新功能！
      └─ [清空所有繪圖] (紅色)
```

### 3 步驟使用

```
1. 繪製形狀
   └─ Graphics Editor 中設計遮罩形狀

2. 點擊導出
   └─ 點擊紫色「導出為 Mask 腳本」按鈕

3. 保存使用
   └─ 選擇保存位置，直接掛載到節點
```

## ✨ 自動優化功能

### 顏色轉換
```typescript
// 你繪製的：紅色 (255, 0, 0)
// 自動轉為：白色 (255, 255, 255) ← Mask 必須
```

### 移除描邊
```typescript
// 你的設置：有描邊
// 自動處理：只保留填充 ← Mask 不需要描邊
```

### 閉合路徑
```typescript
// 你的折線：可能未閉合
// 自動添加：g.close() ← 形成完整遮罩區域
```

### 內建除錯
```typescript
// 自動生成除錯模式
debugMode: boolean = false;  // ← 勾選顯示紅色遮罩區域
```

## 📦 生成的代碼結構

```typescript
@ccclass('CustomMask')
export class CustomMask extends Component {
    @property(Graphics) graphics: Graphics | null = null;
    @property(Mask) mask: Mask | null = null;
    @property debugMode: boolean = false;  // ← 除錯開關
    
    start() {
        this.drawMaskShape();  // ← 自動繪製
    }
    
    drawMaskShape() {
        // ← 你的遮罩形狀代碼在這裡
    }
}
```

## 🎯 兩種導出對比

| 特性 | TypeScript 腳本 | Mask 腳本 |
|------|----------------|-----------|
| 按鈕顏色 | 🔵 藍色 | 🟣 紫色 |
| 預設檔名 | CustomGraphics.ts | CustomMask.ts |
| 顏色 | 保留原色 | ✅ 自動白色 |
| 描邊 | 包含 | ✅ 移除 |
| 折線閉合 | 原樣 | ✅ 自動 |
| 除錯模式 | 無 | ✅ 內建 |
| 組件需求 | Graphics | Graphics + Mask |

## 🔧 節點設置

```
MaskNode
  ├─ UITransform        ← 必須
  ├─ Graphics           ← 必須
  ├─ Mask               ← 必須 (Type: GRAPHICS_STENCIL)
  └─ CustomMask.ts      ← 導出的腳本
  
子節點
  └─ Content            ← 被遮罩的內容
```

## 💡 常用形狀

### 矩形遮罩
```
工具：矩形
尺寸：720 x 1080
用途：捲軸區域
```

### 圓形遮罩
```
工具：圓形
半徑：100
用途：頭像
```

### 自定義遮罩
```
工具：折線
操作：點擊多個點 → ESC 鍵或「完成折線」
用途：不規則區域
```

## ⚠️ 重要提醒

### ✅ 可以做遮罩
- 矩形（填充）
- 圓形（填充）
- 折線（已閉合 + 填充）

### ❌ 無法做遮罩
- 單一線條（無法形成區域）
- 未閉合的折線（導出會有警告註釋）

## 🐛 除錯方法

### 看不到遮罩效果？
1. 勾選 `debugMode` → 顯示紅色半透明區域
2. 檢查內容是否在子節點
3. 確認 Mask Type 是 `GRAPHICS_STENCIL`

### 遮罩形狀不對？
1. 開啟 `debugMode` 查看實際區域
2. 回到 Graphics Editor 重新繪製
3. 重新導出覆蓋

## 📚 完整文檔

- 詳細指南：`docs/Graphics-Editor-Mask-Export-Feature.md`
- 使用說明：`docs/Graphics-Editor-Mask-Usage-Guide.md`
- 快速參考：`docs/Graphics-Editor-Mask-Quick-Reference.md`

## 🎉 優勢總結

1. ✅ **無需手動修改** - 自動優化顏色和代碼
2. ✅ **一鍵生成** - 點擊按鈕即可導出
3. ✅ **開箱即用** - 導出的代碼直接可用
4. ✅ **內建除錯** - debugMode 快速定位問題
5. ✅ **智能警告** - 自動檢測潛在問題
6. ✅ **完美適配** - 專門為 Cocos Creator Mask 優化

現在創建遮罩只需 3 步：**繪製 → 導出 → 使用** ！🎨✨
