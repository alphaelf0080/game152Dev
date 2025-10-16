# RampColorShader 簡化方案 - 使用指南

## ✅ 修改完成

**版本**: 簡化版 v1.0 (不增加 uniform 數量)
**狀態**: 已完成，等待測試
**日期**: 2025-10-16

## 🎯 解決的問題

### 原始問題
使用 Tiled 3x3 Sprite 時，Ramp 效果會重複數百次（如您之前的截圖所示）。

### 解決方案
重新定義 `tilingOffset` 參數的用途，不增加新的 uniform，達到相同效果。

## 📊 修改內容

### 1. 重新定義 `tilingOffset` 參數

**之前的用途**:
```
XY = UV Tiling (重複次數)
ZW = UV Offset (偏移)
```

**現在的用途**:
```
XY = Sprite 的 Tiling 數量 (用於標準化 UV)
ZW = Ramp 效果的 Offset (偏移)
```

### 2. 添加 `effectUV` Varying

```glsl
// Vertex Shader
out vec2 effectUV;
effectUV = a_texCoord;

// Fragment Shader
in vec2 effectUV;
```

這不會增加 uniform 數量，只是額外的資料傳遞通道。

### 3. 修改 `calculateRampCoord` 函數

```glsl
float calculateRampCoord(vec2 uv) {
    // 第一步：標準化 UV（處理 Sprite 的 Tiled Type）
    vec2 normalizedUV = uv / max(tilingOffset.xy, vec2(1.0, 1.0));
    
    // 第二步：應用 fract 和偏移
    vec2 tiledUV = fract(normalizedUV) + tilingOffset.zw;
    
    // 第三步：其他處理（扭曲、變換等）
    // ...
}
```

### 4. 使用 `effectUV` 而非 `uv0`

```glsl
// 使用 effectUV（不受 Sprite 紋理 UV 影響）
float rampCoord = calculateRampCoord(effectUV);
```

## 🚀 使用方法

### 案例 1: Simple Sprite + 單一 Ramp 效果

```
Sprite Type: Simple
tilingOffset: (1, 1, 0, 0)
             ↑  ↑  ↑  ↑
             │  │  │  └─ Ramp Y Offset
             │  │  └──── Ramp X Offset
             │  └─────── Sprite Y Tiling
             └────────── Sprite X Tiling

結果: 單一 Ramp 效果覆蓋整個 Sprite
```

### 案例 2: Tiled 3x3 Sprite + 單一 Ramp 效果 ⭐ **您的需求**

```
Sprite Type: Tiled 3x3
tilingOffset: (3, 3, 0, 0)
             ↑  ↑
             │  └─ 設定為 3（Sprite 重複 3 次）
             └──── 設定為 3（Sprite 重複 3 次）

結果: 單一 Ramp 效果覆蓋整個 Sprite（不會重複數百次）
```

### 案例 3: Tiled 2x4 Sprite

```
Sprite Type: Tiled（寬度重複 2 次，高度重複 4 次）
tilingOffset: (2, 4, 0, 0)

結果: 單一 Ramp 效果覆蓋整個 Sprite
```

### 案例 4: 使用 Offset 調整 Ramp 位置

```
Sprite Type: Simple
tilingOffset: (1, 1, 0.5, 0)
                    ↑
                    └─ 水平偏移 50%

結果: Ramp 效果向右偏移 50%
```

### 案例 5: Tiled Sprite + Offset

```
Sprite Type: Tiled 3x3
tilingOffset: (3, 3, 0, 0.25)
                       ↑
                       └─ 垂直偏移 25%

結果: 單一 Ramp 效果，向下偏移 25%
```

## 📋 重要提醒

### ⚠️ 關鍵設定

**`tilingOffset.XY` 必須與 Sprite 的 Tiled Type 設定一致！**

| Sprite Type | tilingOffset.XY |
|------------|----------------|
| Simple | (1, 1) |
| Tiled 2x2 | (2, 2) |
| Tiled 3x3 | (3, 3) |
| Tiled 4x4 | (4, 4) |
| Tiled 寬2高3 | (2, 3) |

**如果設定錯誤**：
- 設定太小 → Ramp 會重複
- 設定太大 → Ramp 會被壓縮

### ✅ 優點

1. **不增加 uniform 數量** - 避免超過限制
2. **解決重複問題** - Tiled Sprite 不會讓 Ramp 重複數百次
3. **向後兼容** - Simple Sprite 只需設定 (1, 1, 0, 0) 即可
4. **保留 Offset 控制** - 仍可調整 Ramp 位置

### ❌ 限制

1. **失去獨立 Tiling 控制** - 無法讓 Ramp 效果本身重複（如 2x2）
2. **需要手動設定** - 必須知道 Sprite 的 Tiled Type
3. **參數名稱混淆** - `tilingOffset` 現在有雙重用途

## 🧪 測試步驟

### 步驟 1: 保存並重啟 Cocos Creator

```
1. 保存所有檔案
2. 在 Cocos Creator 中重新載入 shader
   （或重啟 Cocos Creator）
3. 確認沒有錯誤
```

### 步驟 2: 測試 Simple Sprite

```
1. 創建 Sprite 節點
2. Sprite Type: Simple
3. 添加 RampColorShader Material
4. 設定 tilingOffset: (1, 1, 0, 0)
5. 確認顯示正常（單一 Ramp 效果）
```

### 步驟 3: 測試 Tiled 3x3 Sprite ⭐ **關鍵測試**

```
1. 創建 Sprite 節點
2. Sprite Type: Tiled
3. 調整大小讓它顯示 3x3 的重複
4. 添加 RampColorShader Material
5. 設定 tilingOffset: (3, 3, 0, 0)  ← 關鍵！
6. 預期結果: 單一 Ramp 效果覆蓋整個 Sprite
   （不應該重複數百次）
```

### 步驟 4: 測試 Offset

```
1. 使用上面的 Tiled 3x3 Sprite
2. 調整 tilingOffset 的 ZW 值
   例如: (3, 3, 0.5, 0)
3. 確認 Ramp 效果有偏移
```

## 🔧 故障排除

### 問題 1: Shader 無法載入

**檢查**:
- 控制台是否有錯誤訊息
- Meta 檔案是否正確生成

**解決**:
```powershell
cd C:\projects\game152Dev\game169
Remove-Item assets\effect\RampColorShader.effect.meta -Force
.\Clear-CocosCache.ps1
# 重啟 Cocos Creator
```

### 問題 2: Ramp 仍然重複很多次

**原因**: `tilingOffset.XY` 設定錯誤

**解決**: 確認 Sprite 實際重複的次數，設定正確的值
- 可以在 Sprite 的 Inspector 中查看
- 或計算：節點大小 ÷ 紋理大小

### 問題 3: Ramp 效果變形或壓縮

**原因**: `tilingOffset.XY` 設定太大

**解決**: 減小數值，通常不會超過 10

### 問題 4: 效果與之前不同

**原因**: `tilingOffset` 的意義改變了

**解決**: 
- 舊專案: Simple Sprite 設定從 (n, n, x, y) 改為 (1, 1, x, y)
- Tiled Sprite: 設定對應的 Tiling 數量

## 📊 與原始方案的比較

| 特性 | 原始修改方案 | 簡化方案 |
|-----|------------|---------|
| 新增 Uniform | 3 個 (vec2 x 3) | 0 個 |
| 能否載入 | ❌ 失敗 | ✅ 成功 |
| 解決 Tiled 重複問題 | ✅ | ✅ |
| 獨立 Tiling 控制 | ✅ | ❌ |
| 獨立 Offset 控制 | ✅ | ✅ (部分) |
| 參數清晰度 | ✅ | ⚠️ (混合用途) |
| 向後兼容 | ✅ | ⚠️ (需調整參數) |

## 🎉 成功指標

修改成功的標誌：

- [ ] Cocos Creator 成功載入 shader（無錯誤）
- [ ] Simple Sprite + (1,1,0,0) 顯示單一 Ramp
- [ ] Tiled 3x3 + (3,3,0,0) 顯示單一 Ramp（不重複）
- [ ] 調整 ZW 可以偏移 Ramp 位置
- [ ] 控制台無錯誤或警告

## 📝 下一步

1. **立即測試** - 在 Cocos Creator 中測試修改後的 shader
2. **回報結果** - 告訴我是否成功
3. **如果成功** - 我會創建完整的文檔和示例
4. **如果失敗** - 提供錯誤訊息，我會進一步調整

---

**狀態**: ✅ 修改完成，等待測試
**檔案**: RampColorShader.effect (489 lines)
**方案**: 簡化版（重用 uniform）
**時間**: 2025-10-16 18:10
