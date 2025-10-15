# SpriteColorAdjuster 故障排除指南

## 🚨 問題：Sprite 完全沒有改變

如果調整 SpriteColorAdjuster 的屬性後，Sprite 完全沒有視覺變化，請按照以下步驟排查：

---

## ✅ 檢查清單

### 第 1 步：檢查組件設置

1. **確認節點有 Sprite 組件**
   ```
   - 選擇節點
   - 查看屬性檢查器
   - 必須有 「cc.Sprite」 組件
   - Sprite 的 「SpriteFrame」 必須設置了圖片
   ```

2. **確認節點有 SpriteColorAdjuster 組件**
   ```
   - 同一個節點必須同時有：
     ✓ cc.Sprite
     ✓ SpriteColorAdjuster
   ```

3. **檢查 Sprite 顏色**
   ```
   - 查看 Sprite 組件的 「Color」 屬性
   - 如果是 (0, 0, 0, 255) 全黑，任何調整都看不出效果
   - 建議設為 (255, 255, 255, 255) 白色
   ```

### 第 2 步：檢查控制台輸出

運行遊戲後，控制台應該顯示：

```
✅ SpriteColorAdjuster 初始化完成
   原始顏色: Color { r: 255, g: 255, b: 255, a: 255 }
   當前設定 - 亮度: 0 對比度: 0 灰階: false
🎨 SpriteColorAdjuster 啟動
🎨 顏色已更新: 原始: (255, 255, 255) → 新: (255, 255, 255)
```

**如果看到警告：**

```
⚠️ SpriteColorAdjuster: 找不到 Sprite 組件
   節點名稱: MyNode
   節點組件: ...
```
→ **解決方法：** 為節點添加 Sprite 組件

**如果看到：**
```
⚠️ Sprite 沒有設置圖片！請設置 SpriteFrame.
```
→ **解決方法：** 為 Sprite 組件設置圖片

### 第 3 步：測試調整效果

在屬性檢查器中調整以下值，觀察變化：

#### 測試 1: 亮度（最明顯）
```
亮度 = 0.5   → 圖片應該變亮
亮度 = -0.5  → 圖片應該變暗
亮度 = -1.0  → 圖片應該全黑
```

#### 測試 2: 灰階（最容易確認）
```
灰階 = 勾選  → 圖片應該變成黑白
灰階 = 取消  → 圖片還原彩色
```

#### 測試 3: 對比度
```
對比度 = 0.5   → 圖片應該更銳利
對比度 = -0.5  → 圖片應該更灰濛
```

### 第 4 步：使用測試組件

如果手動調整還是沒效果，使用自動測試組件：

#### 方法 A: SimpleSpriteColorTest（推薦）

1. **設置節點：**
   ```
   創建或選擇一個節點：
   - 添加 Sprite 組件，設置圖片
   - 添加 SpriteColorAdjuster 組件
   - 添加 SimpleSpriteColorTest 組件
   - 勾選 SimpleSpriteColorTest 的「自動測試」
   ```

2. **運行遊戲：**
   ```
   - 點擊播放按鈕
   - 觀察圖片每秒變化一次
   - 查看控制台的測試輸出
   ```

3. **預期結果：**
   ```
   0秒: 圖片變亮（亮度 +0.5）
   1秒: 圖片變暗（亮度 -0.5）
   2秒: 圖片變黑白（灰階）
   3秒: 圖片高對比（對比度 +0.8）
   4秒: 圖片還原正常
   ```

#### 方法 B: 在編輯器中測試

1. **調整 SimpleSpriteColorTest 屬性：**
   ```
   - 取消勾選「自動測試」
   - 拖動「測試亮度」滑桿
   - 應該即時看到效果
   ```

2. **如果在編輯器中也沒效果：**
   ```
   → 可能是 @executeInEditMode 在編輯器中的問題
   → 嘗試運行遊戲後測試
   ```

---

## 🔍 常見問題

### 問題 1: 編輯器中調整屬性沒反應

**原因：** `@executeInEditMode` 有時在編輯器中不穩定

**解決方法：**
```typescript
// 嘗試以下步驟：
1. 保存場景（Ctrl+S）
2. 重新整理資源（Ctrl+R）
3. 重啟 Cocos Creator
4. 運行遊戲測試（編輯器預覽可能不準確）
```

### 問題 2: 運行時調用方法沒效果

**檢查代碼：**
```typescript
// ❌ 錯誤：可能組件還沒初始化
onLoad() {
    const adjuster = this.node.getComponent(SpriteColorAdjuster);
    adjuster.setBrightness(0.5);  // 太早調用
}

// ✅ 正確：在 start 中調用
start() {
    const adjuster = this.node.getComponent(SpriteColorAdjuster);
    if (adjuster) {
        adjuster.setBrightness(0.5);
    }
}

// ✅ 更好：延遲調用
start() {
    this.scheduleOnce(() => {
        const adjuster = this.node.getComponent(SpriteColorAdjuster);
        if (adjuster) {
            adjuster.setBrightness(0.5);
        }
    }, 0.1);
}
```

### 問題 3: Sprite 的原始顏色不是白色

**問題：** 如果 Sprite 的 Color 設置為其他顏色，調整效果可能不明顯

**解決方法：**
```typescript
// 檢查 Sprite 的 Color 屬性
// 建議設為 (255, 255, 255, 255)

// 或在代碼中重置：
const sprite = this.getComponent(Sprite);
sprite.color = new Color(255, 255, 255, 255);
```

### 問題 4: 圖片本身是純色或單調

**問題：** 純白、純黑、或單一顏色的圖片，調整效果不明顯

**測試建議：**
- 使用彩色圖片測試（如遊戲角色、按鈕）
- 避免使用純白或純黑圖片
- 灰階效果在彩色圖片上最明顯

### 問題 5: 調整值太小

**問題：** 亮度設為 0.1 或 -0.1，變化太細微

**建議：**
```typescript
// 測試時使用極端值
adjuster.setBrightness(0.8);   // 明顯變亮
adjuster.setBrightness(-0.8);  // 明顯變暗
adjuster.setGrayscale(true);   // 一定能看出效果
```

---

## 🧪 最小可運行示例

### 場景設置

```
場景層級：
Canvas
└── TestSprite (Node)
    ├── cc.Sprite (設置任意圖片)
    ├── SpriteColorAdjuster
    └── SimpleSpriteColorTest (勾選「自動測試」)
```

### 手動測試代碼

創建一個腳本 `ManualTest.ts`：

```typescript
import { _decorator, Component, Sprite, Color } from 'cc';
import { SpriteColorAdjuster } from './SpriteColorAdjuster';
const { ccclass } = _decorator;

@ccclass('ManualTest')
export class ManualTest extends Component {
    start() {
        console.log('=== 手動測試開始 ===');
        
        // 1. 檢查組件
        const sprite = this.getComponent(Sprite);
        const adjuster = this.getComponent(SpriteColorAdjuster);
        
        console.log('Sprite:', sprite ? '✓' : '✗');
        console.log('SpriteColorAdjuster:', adjuster ? '✓' : '✗');
        
        if (!sprite || !adjuster) {
            console.error('組件檢查失敗！');
            return;
        }
        
        // 2. 重置 Sprite 顏色
        sprite.color = new Color(255, 255, 255, 255);
        console.log('Sprite 顏色已重置為白色');
        
        // 3. 測試亮度
        this.scheduleOnce(() => {
            console.log('測試: 亮度 = 0.8');
            adjuster.setBrightness(0.8);
            console.log('當前 Sprite 顏色:', sprite.color);
        }, 0.5);
        
        // 4. 測試灰階
        this.scheduleOnce(() => {
            console.log('測試: 灰階 = true');
            adjuster.setBrightness(0);
            adjuster.setGrayscale(true);
            console.log('當前 Sprite 顏色:', sprite.color);
        }, 1.5);
        
        // 5. 還原
        this.scheduleOnce(() => {
            console.log('還原所有設定');
            adjuster.setBrightness(0);
            adjuster.setGrayscale(false);
            console.log('當前 Sprite 顏色:', sprite.color);
        }, 2.5);
    }
}
```

---

## 📊 調試檢查表

用這個檢查表逐一確認：

- [ ] 節點有 Sprite 組件
- [ ] Sprite 有設置圖片（SpriteFrame 不為空）
- [ ] 節點有 SpriteColorAdjuster 組件
- [ ] Sprite.color 是白色 (255, 255, 255, 255)
- [ ] 控制台顯示「✅ SpriteColorAdjuster 初始化完成」
- [ ] 控制台顯示「🎨 SpriteColorAdjuster 啟動」
- [ ] 控制台顯示「🎨 顏色已更新」
- [ ] 調整亮度到 0.8 或 -0.8，看到明顯變化
- [ ] 勾選灰階，圖片變黑白
- [ ] 使用 SimpleSpriteColorTest 自動測試成功

---

## 🆘 如果以上都無效

### 最後的檢查

1. **檢查 Cocos Creator 版本：**
   ```
   組件是為 Cocos Creator 3.x 設計的
   確認您使用的是 3.0 或更高版本
   ```

2. **檢查 TypeScript 編譯：**
   ```
   - 打開「開發者」→「開發者工具」
   - 查看是否有編譯錯誤
   - 嘗試「開發者」→「重新編譯腳本」
   ```

3. **檢查組件執行順序：**
   ```typescript
   // 在 SpriteColorAdjuster 的各個生命週期方法中添加 log
   onLoad() {
       console.log('📌 SpriteColorAdjuster.onLoad');
       this.initialize();
   }
   
   start() {
       console.log('📌 SpriteColorAdjuster.start');
       this.applyAllAdjustments();
   }
   ```

4. **檢查是否有其他組件干擾：**
   ```
   - 移除節點上的其他自定義組件
   - 只保留 Sprite 和 SpriteColorAdjuster
   - 重新測試
   ```

5. **創建全新測試場景：**
   ```
   1. 新建場景
   2. 創建 Sprite 節點
   3. 添加組件
   4. 測試
   ```

### 報告問題

如果問題依然存在，請提供以下信息：

```
- Cocos Creator 版本：
- 操作系統：
- 控制台完整輸出（複製貼上）：
- Sprite 組件設置截圖：
- SpriteColorAdjuster 組件設置截圖：
- 測試代碼（如有）：
```

---

**更新日期：** 2025-10-15  
**版本：** 1.1（添加調試輸出）
