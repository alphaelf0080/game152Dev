# SpriteColorAdjuster 使用指南

> **組件**: SpriteColorAdjuster.ts  
> **位置**: `game169/assets/script/UIController/`  
> **功能**: 為 Sprite 節點提供色彩明暗調整功能

---

## 📋 功能概覽

### ✨ 核心功能

| 功能 | 說明 | 範圍 |
|------|------|------|
| 🔆 亮度調整 | 調整圖片明暗 | -1（最暗）到 1（最亮） |
| 🎨 對比度調整 | 調整對比強度 | -1（最低）到 1（最高） |
| 🌈 飽和度調整 | 調整色彩鮮豔度 | -1（灰階）到 1（超飽和） |
| 🎭 色相旋轉 | 改變色調 | 0 到 360 度 |
| 🎨 顏色疊加 | 染色效果 | 任意顏色 + 強度 |
| ⚫ 灰階效果 | 黑白效果 | 開/關 |
| 🎬 動畫過渡 | 平滑過渡效果 | 支援所有調整 |
| 💾 編輯器預覽 | 即時預覽 | 支援 |

---

## 🚀 快速開始

### 1. 添加組件

在 Cocos Creator 編輯器中：

1. 選擇需要調整的 Sprite 節點
2. 點擊「添加組件」
3. 選擇「自定義組件 > UI > SpriteColorAdjuster」

或在代碼中：

```typescript
const adjuster = sprite.addComponent(SpriteColorAdjuster);
```

---

### 2. 基本使用

#### 方式 1: 編輯器配置

在屬性檢查器中直接調整滑桿：

- **亮度**: -1.0 到 1.0
- **對比度**: -1.0 到 1.0
- **飽和度**: -1.0 到 1.0
- **色相**: 0 到 360
- **灰階效果**: 勾選框

勾選「即時更新」可以看到即時預覽效果。

---

#### 方式 2: 代碼控制

```typescript
import { SpriteColorAdjuster } from './UIController/SpriteColorAdjuster';

// 獲取組件
const adjuster = sprite.getComponent(SpriteColorAdjuster);

// 調整亮度
adjuster.setBrightness(0.5);  // 增加亮度

// 調整對比度
adjuster.setContrast(-0.3);   // 降低對比度

// 調整飽和度
adjuster.setSaturation(0.8);  // 增加飽和度

// 灰階效果
adjuster.setGrayscale(true);  // 啟用黑白效果
```

---

## 📚 詳細 API

### 🔆 亮度調整

```typescript
// 設置亮度
adjuster.setBrightness(0.5);     // 變亮
adjuster.setBrightness(-0.5);    // 變暗
adjuster.setBrightness(0);       // 正常

// 快捷方法
adjuster.lighten(0.5);           // 變亮 50%
adjuster.darken(0.5);            // 變暗 50%

// 動畫過渡
adjuster.animateBrightness(-1, 2.0, () => {
    console.log('淡出完成');
});
```

---

### 🎨 對比度調整

```typescript
// 設置對比度
adjuster.setContrast(0.5);       // 高對比
adjuster.setContrast(-0.5);      // 低對比
adjuster.setContrast(0);         // 正常

// 動畫過渡
adjuster.animateContrast(0.8, 1.0);
```

---

### 🌈 飽和度調整

```typescript
// 設置飽和度
adjuster.setSaturation(0.8);     // 鮮豔
adjuster.setSaturation(-1);      // 無色（類似灰階）
adjuster.setSaturation(0);       // 正常

// 快捷方法
adjuster.desaturate(0.5);        // 去色 50%

// 動畫過渡
adjuster.animateSaturation(-1, 1.5);
```

---

### 🎭 色相旋轉

```typescript
// 設置色相
adjuster.setHue(120);            // 旋轉 120 度（綠色系）
adjuster.setHue(240);            // 旋轉 240 度（藍色系）
adjuster.setHue(0);              // 原始色相

// 動畫過渡
adjuster.animateHue(180, 2.0);   // 2 秒內旋轉到 180 度
```

---

### 🎨 顏色疊加（Tint）

```typescript
import { Color } from 'cc';

// 設置顏色疊加
adjuster.setTint(new Color(255, 0, 0, 255), 0.5);  // 紅色疊加 50%
adjuster.setTint(new Color(0, 0, 255, 255), 0.3);  // 藍色疊加 30%

// 分別設置
adjuster.tintColor = new Color(255, 200, 0, 255);
adjuster.tintStrength = 0.7;
```

---

### ⚫ 灰階效果

```typescript
// 啟用灰階
adjuster.setGrayscale(true);

// 關閉灰階
adjuster.setGrayscale(false);
```

---

### 🔄 重置

```typescript
// 重置所有調整
adjuster.reset();
```

---

## 🎬 動畫效果

### 淡入淡出

```typescript
// 淡出效果（變暗）
adjuster.fadeOut(1.0, () => {
    console.log('淡出完成');
    sprite.active = false;
});

// 淡入效果（變亮）
sprite.active = true;
adjuster.darken(1);  // 先設置為最暗
adjuster.fadeIn(1.0, () => {
    console.log('淡入完成');
});
```

---

### 自定義動畫

```typescript
// 亮度動畫
adjuster.animateBrightness(-0.5, 2.0, () => {
    console.log('亮度動畫完成');
});

// 對比度動畫
adjuster.animateContrast(0.8, 1.5);

// 飽和度動畫
adjuster.animateSaturation(-1, 2.0, () => {
    // 變為灰階後再變回彩色
    adjuster.animateSaturation(0, 2.0);
});

// 色相旋轉動畫
adjuster.animateHue(360, 3.0);  // 3 秒內完整旋轉一圈
```

---

## 🎨 預設效果

組件提供了幾種常用的預設效果：

### 🌙 夜間模式

```typescript
adjuster.applyNightMode();
// 效果：降低亮度、飽和度，添加藍色調
```

### 📷 懷舊效果

```typescript
adjuster.applySepia();
// 效果：泛黃、低飽和度、略高對比度
```

### ⚫⚪ 高對比黑白

```typescript
adjuster.applyHighContrastBW();
// 效果：灰階 + 高對比度
```

### ✨ 鮮豔效果

```typescript
adjuster.applyVibrant();
// 效果：高飽和度、高對比度、略亮
```

---

## 💡 使用場景

### 1. 按鈕狀態反饋

```typescript
// 按鈕按下變暗
onButtonPress() {
    const adjuster = this.button.getComponent(SpriteColorAdjuster);
    adjuster.darken(0.3);
}

// 按鈕釋放恢復
onButtonRelease() {
    const adjuster = this.button.getComponent(SpriteColorAdjuster);
    adjuster.reset();
}

// 按鈕禁用變灰
onButtonDisabled() {
    const adjuster = this.button.getComponent(SpriteColorAdjuster);
    adjuster.setGrayscale(true);
    adjuster.darken(0.2);
}
```

---

### 2. 符號中獎高亮

```typescript
// 中獎符號變亮
onSymbolWin(symbol: Node) {
    const adjuster = symbol.getComponent(SpriteColorAdjuster);
    
    // 增加亮度和飽和度
    adjuster.setBrightness(0.3);
    adjuster.setSaturation(0.5);
    
    // 或使用鮮豔效果
    adjuster.applyVibrant();
}

// 中獎動畫：閃爍效果
playWinAnimation(symbol: Node) {
    const adjuster = symbol.getComponent(SpriteColorAdjuster);
    
    const flash = () => {
        adjuster.animateBrightness(0.8, 0.3, () => {
            adjuster.animateBrightness(0, 0.3, flash);
        });
    };
    
    flash();
}
```

---

### 3. 場景氛圍切換

```typescript
// 切換到夜間模式
switchToNightMode() {
    const backgrounds = this.node.getChildByName('Backgrounds').children;
    
    backgrounds.forEach(bg => {
        const adjuster = bg.getComponent(SpriteColorAdjuster) || 
                        bg.addComponent(SpriteColorAdjuster);
        adjuster.applyNightMode();
    });
}

// 日夜循環動畫
dayNightCycle() {
    const adjuster = this.background.getComponent(SpriteColorAdjuster);
    
    // 日 → 夜
    adjuster.animateBrightness(-0.4, 5.0, () => {
        // 夜 → 日
        adjuster.animateBrightness(0, 5.0, () => {
            this.dayNightCycle();  // 循環
        });
    });
}
```

---

### 4. 卡片收集效果

```typescript
// 未收集的卡片顯示為灰色
showUncollectedCard(card: Node) {
    const adjuster = card.getComponent(SpriteColorAdjuster) || 
                    card.addComponent(SpriteColorAdjuster);
    adjuster.setGrayscale(true);
    adjuster.darken(0.3);
}

// 收集後恢復顏色（動畫）
onCardCollected(card: Node) {
    const adjuster = card.getComponent(SpriteColorAdjuster);
    
    // 先閃白
    adjuster.animateBrightness(1, 0.2, () => {
        // 恢復正常 + 移除灰階
        adjuster.setGrayscale(false);
        adjuster.animateBrightness(0, 0.5);
    });
}
```

---

### 5. 滾輪模糊效果

```typescript
// 滾輪旋轉時降低飽和度和對比度
onReelStartSpin(reel: Node) {
    const symbols = reel.children;
    
    symbols.forEach(symbol => {
        const adjuster = symbol.getComponent(SpriteColorAdjuster) || 
                        symbol.addComponent(SpriteColorAdjuster);
        adjuster.setSaturation(-0.5);
        adjuster.setContrast(-0.3);
    });
}

// 停止時恢復
onReelStop(reel: Node) {
    const symbols = reel.children;
    
    symbols.forEach(symbol => {
        const adjuster = symbol.getComponent(SpriteColorAdjuster);
        if (adjuster) {
            adjuster.reset();
        }
    });
}
```

---

## ⚙️ 進階配置

### 屬性說明

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| brightness | number | 0 | 亮度（-1 到 1） |
| contrast | number | 0 | 對比度（-1 到 1） |
| saturation | number | 0 | 飽和度（-1 到 1） |
| hue | number | 0 | 色相（0 到 360） |
| tintColor | Color | 白色 | 疊加顏色 |
| tintStrength | number | 0 | 疊加強度（0 到 1） |
| grayscale | boolean | false | 灰階效果 |
| liveUpdate | boolean | true | 即時更新 |

---

### 效能優化建議

1. **避免頻繁調整**
   ```typescript
   // ❌ 不好的做法
   update() {
       adjuster.setBrightness(Math.sin(Date.now() / 1000));
   }
   
   // ✅ 好的做法
   adjuster.animateBrightness(1, 2.0);
   ```

2. **批量操作時關閉即時更新**
   ```typescript
   adjuster._liveUpdate = false;
   adjuster.setBrightness(0.5);
   adjuster.setContrast(0.3);
   adjuster.setSaturation(0.8);
   adjuster._liveUpdate = true;
   adjuster.applyAllAdjustments();  // 手動觸發一次更新
   ```

3. **不使用時移除組件**
   ```typescript
   sprite.removeComponent(SpriteColorAdjuster);
   ```

---

## 🐛 常見問題

### Q: 為什麼調整沒有效果？

A: 檢查以下幾點：
1. 確認節點上有 Sprite 組件
2. 確認 Sprite 有設置 SpriteFrame
3. 確認「即時更新」已啟用
4. 查看控制台是否有錯誤訊息

---

### Q: 可以同時使用多個效果嗎？

A: 可以！所有效果會按照以下順序疊加：
1. 灰階
2. 亮度
3. 對比度
4. 飽和度
5. 色相
6. 顏色疊加

---

### Q: 動畫能中斷嗎？

A: 可以透過設置新的目標值來覆蓋當前動畫：
```typescript
adjuster.animateBrightness(1, 5.0);  // 5 秒變亮
// 中途改變
adjuster.animateBrightness(-1, 2.0); // 2 秒變暗
```

---

### Q: 如何保存原始顏色？

A: 組件會自動保存原始顏色，調用 `reset()` 即可恢復：
```typescript
adjuster.reset();
```

---

## 📊 效能考量

| 操作 | CPU 消耗 | 建議 |
|------|---------|------|
| 靜態調整 | 極低 | 可大量使用 |
| 動畫過渡 | 低 | 同時不超過 20 個 |
| 編輯器預覽 | 低 | 可即時調整 |

---

## 🔗 相關資源

- [Cocos Creator 官方文檔](https://docs.cocos.com/creator/manual/zh/)
- [Color 類 API](https://docs.cocos.com/creator/api/zh/class/Color)
- [Sprite 組件](https://docs.cocos.com/creator/manual/zh/render/sprite.html)

---

**組件版本**: 1.0  
**最後更新**: 2025-10-15  
**維護者**: AI Assistant
