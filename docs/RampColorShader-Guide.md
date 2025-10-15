# RampColorShader 使用指南

## 🎨 功能特色

這個 Shader 提供了強大的 Ramp 顏色調整功能，支援多種方向、混合模式和顏色調整選項。

## 📋 屬性說明

### 🌈 Ramp 控制
- **Ramp 紋理** - 用於顏色映射的漸變紋理
- **使用 Ramp 紋理** - 切換使用紋理或顏色漸變
- **起始顏色** / **結束顏色** - 手動漸變的顏色設定

### 📐 方向和範圍
- **Ramp 方向**：
  - `水平` - 從左到右的漸變
  - `垂直` - 從下到上的漸變  
  - `圓形` - 從中心向外的圓形漸變
  - `徑向` - 圍繞中心的角度漸變

- **Ramp 中心點** - 圓形/徑向模式的中心座標 (0-1)
- **UV 縮放** - 控制漸變的密度
- **UV 偏移** - 移動漸變的位置
- **Ramp 範圍** - X=起始位置, Y=結束位置 (0-1)

### 🎨 顏色調整
- **亮度調整** (-1 到 1) - 整體明暗調整
- **對比度** (0 到 3) - 明暗對比強度
- **飽和度** (0 到 3) - 顏色鮮豔程度

### 🔀 混合模式
- `Normal` - 標準混合
- `Multiply` - 相乘（變暗）
- `Add` - 相加（變亮）
- `Screen` - 濾色（柔和變亮）
- `Overlay` - 疊加（增強對比）
- `SoftLight` - 柔光
- `ColorDodge` - 顏色減淡
- `ColorBurn` - 顏色加深

### ⚙️ 進階控制
- **Ramp 強度** (0-2) - 混合效果的強度
- **反轉 Ramp** - 反轉漸變方向
- **平滑度** (0-1) - 邊緣平滑程度

## 🚀 使用範例

### 1. 基礎水平漸變
```
Ramp 方向: 水平
起始顏色: 黑色 (0,0,0,1)
結束顏色: 白色 (1,1,1,1)
混合模式: Multiply
Ramp 強度: 1.0
```

### 2. 圓形光暈效果
```
Ramp 方向: 圓形
Ramp 中心點: (0.5, 0.5)
起始顏色: 白色 (1,1,1,1)
結束顏色: 黑色 (0,0,0,1)
混合模式: Multiply
Ramp 範圍: (0.0, 0.8)
平滑度: 0.5
```

### 3. 徑向彩虹效果
```
Ramp 方向: 徑向
使用 Ramp 紋理: 1 (使用彩虹漸變紋理)
混合模式: Overlay
Ramp 強度: 0.7
飽和度: 1.5
```

### 4. 動態亮度調整
```
Ramp 方向: 垂直
起始顏色: 深藍 (0,0,0.3,1)
結束顏色: 亮黃 (1,1,0.5,1)
亮度調整: 0.2
對比度: 1.3
混合模式: SoftLight
```

## 🎭 創意應用

### 1. 環境光效
- 使用圓形漸變模擬光源照射
- 配合 SoftLight 混合模式

### 2. 時間變化
- 腳本動態調整 UV 偏移來創建移動效果
- 使用水平漸變模擬日夜循環

### 3. 材質質感
- 垂直漸變配合 Multiply 創建金屬質感
- 圓形漸變製作寶石光澤

### 4. 特效增強
- 徑向漸變製作魔法陣效果
- Add 混合模式創建發光邊緣

## 📝 腳本控制範例

```typescript
// 動態調整 Ramp 偏移（創建動畫效果）
@property(Material)
rampMaterial: Material = null;

update(deltaTime: number) {
    if (this.rampMaterial) {
        const time = director.getTotalTime();
        const offset = new Vec2(Math.sin(time) * 0.2, 0);
        this.rampMaterial.setProperty('rampUVOffset', offset);
    }
}

// 動態切換混合模式
setBlendMode(mode: number) {
    this.rampMaterial.setProperty('blendMode', mode);
}

// 顏色脈衝效果
createPulseEffect() {
    const intensity = (Math.sin(director.getTotalTime() * 3) + 1) * 0.5;
    this.rampMaterial.setProperty('rampIntensity', intensity);
}
```

## 🔧 最佳化建議

1. **紋理解析度**：Ramp 紋理使用 256x1 或 512x1 即可
2. **平滑度設定**：過高的平滑度會增加計算負擔
3. **混合模式**：Complex 混合模式（Overlay, SoftLight）消耗更多 GPU
4. **動畫頻率**：避免每幀更新所有屬性

## 🎨 Ramp 紋理製作

### Photoshop/其他圖像編輯器：
1. 創建 256x1 像素的圖像
2. 使用漸變工具從左到右繪製想要的顏色變化
3. 保存為 PNG 格式
4. 在 Cocos Creator 中設置 Wrap Mode 為 Clamp

### 程序化生成：
```typescript
// 創建彩虹 Ramp 紋理
createRainbowRamp(): Texture2D {
    const width = 256;
    const height = 1;
    const data = new Uint8Array(width * height * 4);
    
    for (let x = 0; x < width; x++) {
        const hue = (x / width) * 360;
        const rgb = this.hsvToRgb(hue, 1, 1);
        const idx = x * 4;
        data[idx] = rgb.r * 255;
        data[idx + 1] = rgb.g * 255;
        data[idx + 2] = rgb.b * 255;
        data[idx + 3] = 255;
    }
    
    // 創建紋理...
}
```

這個 Shader 為你提供了極大的創作自由度，可以實現從簡單的明暗調整到複雜的視覺特效！🌟