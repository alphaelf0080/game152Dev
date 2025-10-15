# RampColorShader UV 控制功能

**新增日期**: 2025-10-15  
**功能**: 添加主紋理 UV Tiling, Offset 和 Wrap Mode 控制

---

## 🎯 新增功能

### 1. 主紋理 (Main Texture)
- **屬性名稱**: `mainTexture`
- **類型**: Texture2D
- **用途**: 可以疊加在 Sprite 紋理之上的額外紋理層

### 2. Tiling & Offset
- **屬性名稱**: `tilingOffset`
- **類型**: vec4 (四個浮點數)
- **格式**: `[Tiling.X, Tiling.Y, Offset.X, Offset.Y]`
- **預設值**: `[1.0, 1.0, 0.0, 0.0]`

**參數說明**:
- **Tiling.X (第1個值)**: 水平方向重複次數
- **Tiling.Y (第2個值)**: 垂直方向重複次數
- **Offset.X (第3個值)**: 水平方向偏移
- **Offset.Y (第4個值)**: 垂直方向偏移

### 3. Wrap Mode (包裹模式)
- **addressU**: 水平方向包裹模式 = `repeat`
- **addressV**: 垂直方向包裹模式 = `repeat`

**可用的包裹模式**:
- `repeat` - 重複 (預設)
- `clamp` - 夾取 (邊緣拉伸)
- `mirror` - 鏡像
- `border` - 邊框

---

## 📊 使用範例

### 範例 1: 重複紋理 2x2
```yaml
tilingOffset: [2.0, 2.0, 0.0, 0.0]
```
效果：紋理在水平和垂直方向各重複 2 次

### 範例 2: 重複紋理並偏移
```yaml
tilingOffset: [3.0, 3.0, 0.5, 0.5]
```
效果：紋理重複 3x3 次，並向右上偏移 0.5

### 範例 3: 拉伸紋理
```yaml
tilingOffset: [0.5, 0.5, 0.0, 0.0]
```
效果：紋理放大 2 倍（Tiling < 1 會放大）

### 範例 4: 動畫 UV 滾動
在 TypeScript 中：
```typescript
const material = this.getComponent(UITransform).getMaterial(0);
let time = 0;

this.schedule(() => {
  time += 0.01;
  // 水平滾動
  material.setProperty('tilingOffset', [1, 1, time, 0]);
}, 0.016); // 60 FPS
```

---

## 🔧 技術細節

### Shader 代碼實現

```glsl
uniform RampProperties {
  vec4 tilingOffset;  // xy = tiling, zw = offset
  // ... 其他屬性
};

vec4 frag() {
  // 應用 Tiling 和 Offset
  vec2 mainUV = uv0 * tilingOffset.xy + tilingOffset.zw;
  
  // 使用轉換後的 UV 採樣紋理
  vec4 mainTexColor = texture(mainTexture, mainUV);
  // ...
}
```

### Sampler 配置

```yaml
mainTexture: { 
  value: white,
  sampler: {
    minFilter: linear,      # 縮小時線性過濾
    magFilter: linear,      # 放大時線性過濾
    mipFilter: none,        # 不使用 mipmap
    addressU: repeat,       # 水平重複
    addressV: repeat        # 垂直重複
  }
}
```

---

## 🎨 應用場景

### 1. 重複圖案
```
Tiling: [4, 4, 0, 0]
Wrap: repeat
```
用於：瓷磚、地板、牆壁等重複紋理

### 2. 無縫滾動背景
```
Tiling: [1, 1, offset_x, 0]
Wrap: repeat
```
用於：移動的雲、水流、傳送帶效果

### 3. UV 動畫
```typescript
// 旋轉 UV
const angle = time * 0.5;
const cos = Math.cos(angle);
const sin = Math.sin(angle);
// 需要額外的 UV 變換矩陣支持
```

### 4. 部分紋理截取
```
Tiling: [0.5, 0.5, 0.25, 0.25]
Wrap: clamp
```
用於：從大圖集中截取特定區域

---

## 📋 Inspector 面板顯示

```
┌──────────────────────────────────────┐
│ Main Texture:    [選擇紋理]          │
│                                       │
│ Tiling & Offset: [1.0, 1.0, 0.0, 0.0]│
│   X: 1.0  ━━●━━━━━━  (Tiling X)      │
│   Y: 1.0  ━━●━━━━━━  (Tiling Y)      │
│   Z: 0.0  ●━━━━━━━━  (Offset X)      │
│   W: 0.0  ●━━━━━━━━  (Offset Y)      │
│ ⓘ XY=Tiling(重複), ZW=Offset(偏移)   │
└──────────────────────────────────────┘
```

---

## 🔄 與其他功能的配合

### 與 Ramp Texture 配合
- **Main Texture**: 提供基礎顏色/圖案
- **Ramp Texture**: 提供顏色映射/漸變
- 兩者可以獨立控制 UV

### 與 Blend Mode 配合
```
1. 載入 Main Texture (應用 Tiling/Offset)
2. 計算 Ramp Color
3. 使用 Blend Mode 混合兩者
```

### UV 層級
```
Level 1: Sprite UV (cc_spriteTexture) 
         ↓ 應用 tilingOffset
Level 2: Main Texture UV
         ↓ 
Level 3: Ramp Calculation UV (使用 rampUVScale/rampUVOffset)
```

---

## ⚠️ 注意事項

### 1. Wrap Mode 限制
如果紋理資源本身設置了 Wrap Mode，material 的設置可能會被覆蓋。
建議在紋理資源的 Inspector 中檢查 Wrap Mode 設置。

### 2. Tiling 值建議
- `Tiling = 1.0` - 正常大小
- `Tiling > 1.0` - 重複（數字越大重複越多）
- `Tiling < 1.0` - 放大（數字越小放大越多）
- `Tiling = 0.0` - ⚠️ 會導致除零錯誤，避免使用

### 3. Offset 範圍
- Offset 通常在 `[0, 1]` 範圍內
- 可以使用負值或大於 1 的值
- 配合 `repeat` wrap mode 時，offset > 1 會回繞

### 4. 性能考量
- 使用 `repeat` wrap mode 比其他模式略快
- Tiling 值不影響性能
- 動態修改 tilingOffset 的性能消耗很小

---

## 🎯 快速參考

| 需求 | Tiling | Offset | Wrap |
|------|--------|--------|------|
| 重複 2x2 | `[2, 2, 0, 0]` | - | repeat |
| 放大 2x | `[0.5, 0.5, 0, 0]` | - | any |
| 水平滾動 | `[1, 1, t, 0]` | t 遞增 | repeat |
| 截取中心 | `[0.5, 0.5, 0.25, 0.25]` | - | clamp |
| 鏡像平鋪 | `[2, 2, 0, 0]` | - | mirror |

---

## 📚 相關文檔

- [Pass 可選配置參數 - Sampler](https://docs.cocos.com/creator/manual/zh/shader/pass-parameter-list.html#property-%E5%8F%82%E6%95%B0%E5%88%97%E8%A1%A8)
- [紋理資源](https://docs.cocos.com/creator/manual/zh/asset/texture.html)

---

**更新歷史**:
- 2025-10-15: 初版建立，添加 UV Tiling/Offset/Wrap 功能
