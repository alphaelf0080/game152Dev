# RampColorShader 獨立 UV 系統 - 快速參考

## 🎯 核心概念

**獨立 UV 系統**: shader 的 UV 0~1 覆蓋整個 node content size，不受 sprite tiling 切割影響

## 📊 關鍵參數

### tilingOffset (Vec4)

**格式**: `[X, Y, Z, W]`

| 元素 | 說明 | 範例 |
|-----|------|------|
| **X, Y** | Sprite 的 tile 數量（橫向、縱向） | Simple: `1, 1`<br>TILED 3x3: `3, 3` |
| **Z, W** | Ramp 基礎偏移 | 通常: `0, 0` |

**⚠️ 重要**: X, Y 必須與 Sprite 的實際 tile 數量一致！

### rampUVScale (Vec2)

Ramp 效果在整個 sprite 上的重複次數

| 值 | 效果 |
|---|------|
| `[1, 1]` | 單一 Ramp 效果覆蓋整個 sprite |
| `[2, 2]` | Ramp 效果重複 2x2 次 |
| `[N, M]` | 水平重複 N 次，垂直重複 M 次 |

### rampUVOffset (Vec2)

Ramp 效果的偏移（用於動畫）

| 用途 | 範例 |
|-----|------|
| 靜態 | `[0, 0]` |
| 水平滾動 | `[time * 0.1, 0]` |
| 垂直滾動 | `[0, time * 0.1]` |

## 🔧 常用配置

### Simple Sprite

```yaml
Sprite:
  Type: SIMPLE
  
Material:
  tilingOffset: [1, 1, 0, 0]
  rampUVScale: [1, 1]
  rampUVOffset: [0, 0]
```

### TILED 3x3 Sprite

```yaml
Sprite:
  Type: TILED
  SizeMode: CUSTOM
  
Material:
  tilingOffset: [3, 3, 0, 0]  # ⭐ 必須設定為 3, 3
  rampUVScale: [1, 1]
  rampUVOffset: [0, 0]
```

### TILED 3x3 + 重複效果

```yaml
Sprite:
  Type: TILED
  
Material:
  tilingOffset: [3, 3, 0, 0]
  rampUVScale: [2, 2]  # Ramp 重複 2x2
  rampUVOffset: [0, 0]
```

## 🎨 Ramp 方向選項

| RAMP_DIRECTION | 效果 | rampCenter 影響 |
|---------------|------|----------------|
| 0 | 水平（左→右） | ❌ 無 |
| 1 | 垂直（下→上） | ❌ 無 |
| 2 | 圓形（中心→外） | ✅ 是 |
| 3 | 徑向（角度漸變） | ✅ 是 |
| 4 | 長方形內縮 | ✅ 是 |
| 5 | 長方形外擴 | ✅ 是 |

### rampCenter 參數

**座標系**: 0-1 範圍，相對於整個 sprite

```yaml
[0.5, 0.5]  # 中心（預設）
[0, 0]      # 左下角
[1, 1]      # 右上角
[0.25, 0.75] # 左上象限
```

## 💡 快速診斷

### 症狀 1: 每個 tile 都重複效果

**原因**: `tilingOffset.xy` 設定錯誤

**解決**: 
```yaml
# 檢查你的 Sprite Type 和實際 tile 數
SIMPLE → tilingOffset: [1, 1, 0, 0]
TILED 3x3 → tilingOffset: [3, 3, 0, 0]
```

### 症狀 2: 效果不連續

**原因**: `tilingOffset.zw` 不為零

**解決**:
```yaml
tilingOffset: [N, M, 0, 0]  # 確保 Z, W = 0
```

### 症狀 3: 圓形中心點偏移

**檢查**: 
```yaml
rampCenter: [0.5, 0.5]  # 應該在中心
RAMP_DIRECTION: 2       # 確認是圓形模式
```

## 📐 UV 座標系統

### 舊系統 (v1.x) ❌

```
TILED 3x3:
每個 tile 都有自己的 0-1 UV
→ 9 個獨立的 0-1 空間
→ 效果重複 9 次
```

### 新系統 (v2.0) ✅

```
TILED 3x3:
整個 sprite 共用一個 0-1 UV
→ 單一的 0-1 空間覆蓋所有 tile
→ 效果連續，不重複
```

## 🔄 從舊版本遷移

### 如果你之前使用 v1.x

**需要更改的參數**: 無

**需要驗證**:
1. `tilingOffset.xy` 是否正確設定
2. 視覺效果是否符合預期

### 預期變化

| 情況 | v1.x 行為 | v2.0 行為 |
|-----|----------|----------|
| Simple Sprite | 單一 Ramp | ✅ 相同 |
| TILED 3x3<br>tilingOffset=[3,3]<br>rampUVScale=[1,1] | 每個 tile 重複 | ✅ 單一連續 Ramp |
| TILED 3x3<br>tilingOffset=[1,1]<br>rampUVScale=[1,1] | 每個 tile 重複 | ⚠️ 需改為 [3,3] |

## 🎬 動畫範例

### 水平滾動

```typescript
update(dt: number) {
    this.offset.x += dt * 0.5;
    material.setProperty('rampUVOffset', this.offset);
}
```

### 脈衝效果

```typescript
update(dt: number) {
    const scale = 1 + Math.sin(this.time * 2) * 0.5;
    material.setProperty('rampUVScale', new Vec2(scale, scale));
    this.time += dt;
}
```

### 旋轉效果（徑向模式）

```typescript
update(dt: number) {
    // 使用 RAMP_DIRECTION = 3 (徑向)
    this.angle += dt * 0.5;
    const offset = new Vec2(this.angle / (Math.PI * 2), 0);
    material.setProperty('rampUVOffset', offset);
}
```

## 📋 設定檢查清單

建立新 Ramp 效果時的步驟：

- [ ] 1. 確認 Sprite Type (SIMPLE / TILED)
- [ ] 2. 如果是 TILED，計算 tile 數量
- [ ] 3. 設定 `tilingOffset.xy = [tile_x, tile_y]`
- [ ] 4. 設定 `tilingOffset.zw = [0, 0]`
- [ ] 5. 選擇 RAMP_DIRECTION
- [ ] 6. 設定顏色 (colorStart, colorEnd) 或 Ramp 紋理
- [ ] 7. 調整 rampUVScale (重複次數)
- [ ] 8. 測試效果

## 🆘 需要幫助？

查看詳細文件：
- 📖 **實現原理**: `RampColorShader-Independent-UV-System.md`
- 🧪 **測試指南**: `RampColorShader-Testing-Guide.md`

---

**版本**: RampColorShader v2.0  
**更新日期**: 2025-10-16
