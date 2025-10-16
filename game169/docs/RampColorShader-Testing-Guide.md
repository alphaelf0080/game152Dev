# RampColorShader Independent UV System - Testing Guide

## 📋 測試目的

驗證新的獨立 UV 系統是否正確實現，確保：
1. UV 0~1 覆蓋整個 node content size
2. 不受 sprite tiling 切割影響
3. Ramp 效果在整個 sprite 上連續，不在每個 tile 重複

## 🧪 測試環境準備

### 1. 開啟 Cocos Creator 3.8.x
確保使用與專案相容的版本

### 2. 清除快取（可選但建議）
在專案根目錄執行：
```bash
# Windows
.\Clear-CocosCache.ps1

# macOS/Linux
./clear-cocos-cache.sh
```

### 3. 重新開啟專案
讓 Cocos Creator 重新編譯 shader

## 🎯 測試案例

### 測試 1: Simple Sprite - 基礎驗證 ✅

**目的**: 確保 Simple Sprite 的行為保持不變

#### 設定
1. 建立一個新的 Sprite Node
2. Sprite 設定：
   - Type: `SIMPLE`
   - SizeMode: `TRIMMED` 或 `RAW`
3. 套用 RampColorShader Material
4. Material 參數：
   ```yaml
   tilingOffset: [1, 1, 0, 0]
   rampUVScale: [1, 1]
   rampUVOffset: [0, 0]
   RAMP_DIRECTION: 0 (水平)
   colorStart: 黑色 [0, 0, 0, 255]
   colorEnd: 白色 [255, 255, 255, 255]
   ```

#### 預期結果
- ✅ 單一水平漸變從左到右
- ✅ 左邊黑色，右邊白色
- ✅ 平滑過渡，無斷層

---

### 測試 2: TILED 3x3 Sprite - 核心測試 ⭐

**目的**: 驗證獨立 UV 系統在 TILED sprite 上的正確性

#### 設定
1. 建立一個新的 Sprite Node
2. Sprite 設定：
   - Type: `TILED`
   - SizeMode: `CUSTOM`
   - 設定足夠大的尺寸（例如 600x600）確保是 3x3 拼接
3. 套用 RampColorShader Material
4. Material 參數：
   ```yaml
   tilingOffset: [3, 3, 0, 0]  ⭐ 重要！必須設定為 3x3
   rampUVScale: [1, 1]
   rampUVOffset: [0, 0]
   RAMP_DIRECTION: 0 (水平)
   colorStart: 黑色 [0, 0, 0, 255]
   colorEnd: 白色 [255, 255, 255, 255]
   ```

#### 預期結果
- ✅ **單一連續的水平漸變**覆蓋整個 sprite
- ✅ 左邊黑色，右邊白色
- ✅ **漸變平滑過渡，不會在 tile 邊界處重複**
- ✅ 整個 sprite 看起來像一個完整的漸變，看不出 tile 切割

#### ❌ 錯誤示例（舊版本行為）
如果看到以下情況，表示 shader 有問題：
- ❌ 每個 tile 內都有一個完整的漸變（黑→白→黑→白...）
- ❌ 在 tile 邊界處有明顯的顏色跳躍
- ❌ 漸變效果重複 3 次

---

### 測試 3: TILED 3x3 + 垂直 Ramp

**目的**: 驗證不同方向的 Ramp 效果

#### 設定
同測試 2，但修改：
```yaml
RAMP_DIRECTION: 1 (垂直)
```

#### 預期結果
- ✅ 單一垂直漸變從下到上
- ✅ 下方黑色，上方白色
- ✅ 平滑過渡，無重複

---

### 測試 4: TILED 3x3 + Ramp 重複效果

**目的**: 驗證 rampUVScale 參數在新系統中的正確性

#### 設定
```yaml
tilingOffset: [3, 3, 0, 0]
rampUVScale: [2, 2]  ⭐ 改為 2x2 重複
rampUVOffset: [0, 0]
RAMP_DIRECTION: 0 (水平)
```

#### 預期結果
- ✅ 水平漸變在整個 sprite 上**重複 2 次**
- ✅ 每個重複單元跨越多個 tile
- ✅ 重複基準點是整個 sprite，不是每個 tile
- ✅ 效果應該是：黑→白→黑→白（2 個完整週期）

#### ❌ 錯誤示例
- ❌ 每個 tile 內都重複 2 次（會看到 6 個週期）
- ❌ 重複不連續

---

### 測試 5: 圓形 Ramp

**目的**: 驗證圓形 Ramp 的中心點計算正確性

#### 設定
```yaml
tilingOffset: [3, 3, 0, 0]
rampUVScale: [1, 1]
rampCenter: [0.5, 0.5]
RAMP_DIRECTION: 2 (圓形 - 從中心向外)
```

#### 預期結果
- ✅ 圓形漸變的**中心點在整個 sprite 的正中央**
- ✅ 從中心向外呈現黑→白的徑向漸變
- ✅ 邊緣顏色均勻

#### ❌ 錯誤示例
- ❌ 每個 tile 都有一個圓形漸變（會看到 9 個圓）
- ❌ 圓心不在整體中央

---

### 測試 6: 動態偏移動畫

**目的**: 驗證動態 UV offset 是否作用於整個 sprite

#### 方法
使用 TypeScript 腳本動態調整 `rampUVOffset`：

```typescript
import { _decorator, Component, Material, Vec2 } from 'cc';

@ccclass('RampAnimTest')
export class RampAnimTest extends Component {
    private material: Material | null = null;
    private time: number = 0;

    start() {
        // 獲取 material (假設在 Sprite component 上)
        const sprite = this.getComponent(Sprite);
        this.material = sprite?.customMaterial;
    }

    update(deltaTime: number) {
        if (!this.material) return;
        
        this.time += deltaTime;
        
        // 水平移動 Ramp effect
        const offset = new Vec2(this.time * 0.2, 0);
        this.material.setProperty('rampUVOffset', offset);
    }
}
```

#### 設定
```yaml
tilingOffset: [3, 3, 0, 0]
rampUVScale: [2, 2]
RAMP_DIRECTION: 0 (水平)
```

#### 預期結果
- ✅ Ramp 效果在**整個 sprite 上**平滑移動
- ✅ **所有 tile 同步移動**（不是各自移動）
- ✅ 移動連續，無斷層

#### ❌ 錯誤示例
- ❌ 每個 tile 內的效果各自移動
- ❌ 在 tile 邊界處有跳躍

---

### 測試 7: 不同 Tiling 數量

**目的**: 驗證系統對不同 tiling 配置的適應性

#### 測試 7.1: TILED 2x2
```yaml
tilingOffset: [2, 2, 0, 0]
rampUVScale: [1, 1]
RAMP_DIRECTION: 0
```

預期：單一連續漸變覆蓋 2x2 sprite

#### 測試 7.2: TILED 5x5
```yaml
tilingOffset: [5, 5, 0, 0]
rampUVScale: [1, 1]
RAMP_DIRECTION: 0
```

預期：單一連續漸變覆蓋 5x5 sprite

#### 測試 7.3: TILED 3x1 (非方形)
```yaml
tilingOffset: [3, 1, 0, 0]
rampUVScale: [1, 1]
RAMP_DIRECTION: 0
```

預期：單一水平漸變覆蓋 3x1 sprite

---

## 🐛 常見問題排查

### 問題 1: 每個 tile 都重複效果

**原因**: `tilingOffset.xy` 設定錯誤

**解決**:
1. 檢查 Sprite 的 Type 和實際尺寸
2. 確認 `tilingOffset.xy` 與 tile 數量一致
   - SIMPLE → `[1, 1]`
   - TILED 3x3 → `[3, 3]`
   - 依此類推

### 問題 2: 效果不連續/有接縫

**可能原因**:
1. Shader 版本不正確（使用舊版本）
2. `tilingOffset.zw` 不為零

**解決**:
1. 確認使用最新的 shader 代碼
2. 重設 `tilingOffset.zw = [0, 0]`

### 問題 3: Shader 載入失敗

**可能原因**: 快取問題

**解決**:
1. 清除 Cocos Creator 快取
2. 重新啟動 Cocos Creator
3. 檢查 Console 是否有 shader 編譯錯誤

### 問題 4: 圓形 Ramp 中心點偏移

**原因**: `rampCenter` 參數理解錯誤

**說明**:
- `rampCenter = [0.5, 0.5]` → 整體中心
- `rampCenter = [0, 0]` → 左下角
- `rampCenter = [1, 1]` → 右上角

座標是相對於整個 sprite 的 0-1 UV 空間

---

## ✅ 測試檢查清單

### 基礎功能
- [ ] Simple Sprite 顯示正確
- [ ] TILED 3x3 單一連續 Ramp
- [ ] 不同方向 Ramp 都正確（水平、垂直、圓形等）

### 進階功能
- [ ] Ramp 重複效果正確（基於整個 sprite）
- [ ] 動態 offset 動畫平滑
- [ ] 不同 tiling 配置都正常（2x2, 5x5, 非方形等）

### 視覺驗證
- [ ] 無 tile 邊界可見
- [ ] 漸變平滑無斷層
- [ ] 顏色過渡正確

### 效能
- [ ] 無明顯性能下降
- [ ] 無記憶體洩漏
- [ ] 渲染幀率穩定

---

## 📊 測試報告範本

```markdown
## RampColorShader 測試報告

**測試日期**: YYYY-MM-DD
**測試人員**: 
**Cocos Creator 版本**: 3.8.x

### 測試結果

| 測試案例 | 結果 | 備註 |
|---------|------|------|
| 測試 1: Simple Sprite | ✅ / ❌ |  |
| 測試 2: TILED 3x3 | ✅ / ❌ |  |
| 測試 3: 垂直 Ramp | ✅ / ❌ |  |
| 測試 4: Ramp 重複 | ✅ / ❌ |  |
| 測試 5: 圓形 Ramp | ✅ / ❌ |  |
| 測試 6: 動態動畫 | ✅ / ❌ |  |
| 測試 7: 其他 Tiling | ✅ / ❌ |  |

### 問題記錄


### 總結


```

---

## 🎉 成功標準

當所有以下條件都滿足時，測試通過：

1. ✅ Simple Sprite 行為與之前一致
2. ✅ TILED sprite 顯示單一連續的 Ramp 效果
3. ✅ 看不出 tile 切割的痕跡
4. ✅ Ramp 重複效果基於整個 sprite，不是每個 tile
5. ✅ 動態效果（offset、scale）在整個 sprite 上同步
6. ✅ 所有 RAMP_DIRECTION 選項都正常工作
7. ✅ 不同 tiling 配置（2x2, 3x3, 5x5 等）都正確

---

**文件版本**: 1.0  
**對應 Shader 版本**: RampColorShader v2.0 - Independent UV System  
**建立日期**: 2025-10-16
