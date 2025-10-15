# SpriteColorAdjuster 快速參考

> 快速查找常用方法和效果

---

## 🚀 快速開始

```typescript
// 添加組件
const adjuster = sprite.addComponent(SpriteColorAdjuster);

// 或獲取現有組件
const adjuster = sprite.getComponent(SpriteColorAdjuster);
```

---

## 📋 常用方法速查

### 基礎調整

| 方法 | 參數 | 說明 | 範例 |
|------|------|------|------|
| `setBrightness(value)` | -1 到 1 | 調整亮度 | `adjuster.setBrightness(0.5)` |
| `setContrast(value)` | -1 到 1 | 調整對比度 | `adjuster.setContrast(-0.3)` |
| `setSaturation(value)` | -1 到 1 | 調整飽和度 | `adjuster.setSaturation(0.8)` |
| `setHue(value)` | 0 到 360 | 旋轉色相 | `adjuster.setHue(180)` |
| `setGrayscale(bool)` | true/false | 灰階效果 | `adjuster.setGrayscale(true)` |
| `reset()` | 無 | 重置所有 | `adjuster.reset()` |

---

### 快捷方法

| 方法 | 說明 | 範例 |
|------|------|------|
| `lighten(amount)` | 變亮 | `adjuster.lighten(0.5)` |
| `darken(amount)` | 變暗 | `adjuster.darken(0.5)` |
| `desaturate(amount)` | 去色 | `adjuster.desaturate(0.8)` |

---

### 動畫方法

| 方法 | 參數 | 說明 |
|------|------|------|
| `animateBrightness(target, duration, callback?)` | 目標值, 秒數, 回調 | 亮度動畫 |
| `animateContrast(target, duration, callback?)` | 目標值, 秒數, 回調 | 對比度動畫 |
| `animateSaturation(target, duration, callback?)` | 目標值, 秒數, 回調 | 飽和度動畫 |
| `animateHue(target, duration, callback?)` | 目標值, 秒數, 回調 | 色相動畫 |
| `fadeIn(duration, callback?)` | 秒數, 回調 | 淡入效果 |
| `fadeOut(duration, callback?)` | 秒數, 回調 | 淡出效果 |

---

### 預設效果

| 方法 | 效果 |
|------|------|
| `applyNightMode()` | 🌙 夜間模式（暗+藍調） |
| `applySepia()` | 📷 懷舊泛黃 |
| `applyHighContrastBW()` | ⚫⚪ 高對比黑白 |
| `applyVibrant()` | ✨ 鮮豔效果 |

---

## 💡 常見場景代碼片段

### 按鈕按下效果
```typescript
onButtonPress() {
    adjuster.darken(0.3);
}

onButtonRelease() {
    adjuster.reset();
}
```

### 按鈕禁用
```typescript
onButtonDisabled() {
    adjuster.setGrayscale(true);
    adjuster.darken(0.2);
}
```

### 符號中獎高亮
```typescript
onSymbolWin() {
    adjuster.setBrightness(0.3);
    adjuster.setSaturation(0.5);
}
```

### 閃爍效果
```typescript
flash() {
    adjuster.animateBrightness(1, 0.3, () => {
        adjuster.animateBrightness(0, 0.3);
    });
}
```

### 淡入淡出
```typescript
// 淡出
adjuster.fadeOut(1.0, () => {
    sprite.active = false;
});

// 淡入
sprite.active = true;
adjuster.darken(1);
adjuster.fadeIn(1.0);
```

### 未收集物品灰色
```typescript
showUncollected() {
    adjuster.setGrayscale(true);
    adjuster.darken(0.3);
}

onCollected() {
    adjuster.setGrayscale(false);
    adjuster.reset();
}
```

### 滾輪模糊效果
```typescript
onReelSpin() {
    adjuster.setSaturation(-0.5);
    adjuster.setContrast(-0.3);
}

onReelStop() {
    adjuster.reset();
}
```

---

## 🎨 效果參數速查

### 亮度建議值
- `-1.0` = 全黑
- `-0.5` = 很暗（夜間）
- `-0.3` = 暗（按鈕按下）
- `0.0` = 正常
- `0.3` = 亮（高亮）
- `0.5` = 很亮
- `1.0` = 最亮（白色）

### 對比度建議值
- `-0.5` = 模糊柔和
- `-0.3` = 略低（模糊效果）
- `0.0` = 正常
- `0.3` = 略高
- `0.5` = 高對比
- `0.8` = 非常高對比

### 飽和度建議值
- `-1.0` = 完全灰階
- `-0.5` = 半灰（模糊）
- `0.0` = 正常
- `0.5` = 鮮豔
- `0.8` = 超鮮豔

### 色相建議值
- `0°` = 原色
- `60°` = 偏黃
- `120°` = 偏綠
- `180°` = 互補色
- `240°` = 偏藍
- `300°` = 偏紫

---

## ⚡ 效能建議

### ✅ 好的做法
```typescript
// 使用動畫
adjuster.animateBrightness(1, 2.0);

// 批量更新
adjuster._liveUpdate = false;
adjuster.setBrightness(0.5);
adjuster.setContrast(0.3);
adjuster._liveUpdate = true;
```

### ❌ 避免的做法
```typescript
// 不要在 update 中頻繁調整
update() {
    adjuster.setBrightness(Math.random()); // ❌
}

// 不要短時間內大量創建
for (let i = 0; i < 100; i++) {
    sprite.addComponent(SpriteColorAdjuster); // ❌
}
```

---

## 📚 詳細文檔

完整文檔請參考：[SpriteColorAdjuster-Guide.md](./SpriteColorAdjuster-Guide.md)

---

**版本**: 1.0  
**更新**: 2025-10-15
