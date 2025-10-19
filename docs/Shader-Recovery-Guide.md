# Shader 載入問題診斷和恢復指南

## 當前狀態
**日期**: 2025-10-19  
**問題**: SpriteUVRepeat.effect 持續無法載入  
**錯誤**: `The "path" argument must be of type string or an instance of Buffer or URL. Received undefined`

## 已執行的操作

### 1. 恢復到可工作版本
```bash
git checkout dddef4a -- game169/assets/effect/SpriteUVRepeat.effect
```

這個版本包含：
- ✅ 基礎雙層 UV 系統
- ✅ 12 種混合模式
- ✅ HSV 和 Contrast 調整
- ✅ Tint Color
- ✅ Color Invert
- ❌ **不包含 UV Scale** (這是導致問題的功能)

### 2. 清除所有緩存
```bash
rm -rf game169/library game169/temp
rm -f game169/assets/effect/SpriteUVRepeat.effect.meta
```

## 測試步驟

### 階段 1: 驗證基礎版本
1. **重新啟動 Cocos Creator**
2. **等待重新編譯** (約 2-3 分鐘)
3. **檢查 Console** - 不應有錯誤
4. **檢查 meta 文件**:
   ```bash
   cat game169/assets/effect/SpriteUVRepeat.effect.meta | grep imported
   ```
   應該顯示: `"imported": true`

### 階段 2: 如果基礎版本可以載入
說明問題確實出在 UV Scale 功能上。可能的原因：

#### 可能原因 A: Uniform 塊大小限制
Cocos Creator 3.8 對 uniform 塊大小有限制。當前版本已經有：
- 3 個 vec4 (48 bytes)
- 9 個 float (36 bytes)  
- **總計**: 84 bytes

添加 `vec4 layerUVScale` 會增加到 100 bytes，可能超出某些限制。

#### 可能原因 B: 屬性數量限制
Properties 部分已經有 13 個屬性，可能接近上限。

#### 可能原因 C: Meta 文件損壞
多次編輯可能導致 meta 文件內部狀態不一致。

## 解決方案選項

### 方案 1: 使用現有屬性實現 UV Scale
不添加新的 uniform，而是重用 `layerTilingOffset` 的未使用部分。

**優點**: 不增加 uniform 塊大小  
**缺點**: 語義不清晰

### 方案 2: 移除較少使用的功能
如果必須添加 UV Scale，可以考慮移除：
- `layerColorInvert` (較少使用)
- 或者將一些 float 合併到 vec4

### 方案 3: 創建新的 Effect
如果真的需要所有功能 + UV Scale，創建一個新的 effect 文件：
- `SpriteUVRepeatAdvanced.effect`
- 完全重寫，優化 uniform 佈局

### 方案 4: 使用 Compute Shader 或 Custom Material
對於複雜需求，可能需要更高級的方案。

## 臨時解決方案: 在 TypeScript 中實現 UV Scale

如果 shader 層面無法添加，可以在 TypeScript 中調整 `layerTilingOffset`：

```typescript
// SpriteUVRepeatController.ts
@property({ displayName: '第二層UV縮放' })
public layerUVScale: Vec2 = new Vec2(1, 1);

private updateUVScale() {
  // 將 UV Scale 應用到 Tiling
  const adjustedTiling = new Vec4(
    this.layerTiling.x * this.layerUVScale.x,
    this.layerTiling.y * this.layerUVScale.y,
    this.layerOffset.x,
    this.layerOffset.y
  );
  
  material.setProperty('layerTilingOffset', adjustedTiling);
}
```

**注意**: 這個方案不是中心點縮放，可能有偏移。

## 推薦行動方案

### 立即執行 (如果基礎版本可以載入)

1. **保留當前可工作版本**
   ```bash
   git add game169/assets/effect/SpriteUVRepeat.effect
   git commit -m "Revert to working version without UV Scale"
   git push origin main
   ```

2. **創建功能分支測試 UV Scale**
   ```bash
   git checkout -b feature/uv-scale-test
   ```

3. **使用最小化方案測試**
   - 只添加 UV Scale，不包含其他更改
   - 測試是否能載入

### 如果基礎版本也無法載入

說明問題更深層，可能是：
1. Cocos Creator 安裝損壞
2. 項目配置問題
3. 系統權限問題

需要執行：
```bash
# 完全重置項目
cd /Users/alpha/Documents/projects/game152Dev
rm -rf game169/library game169/temp game169/local
rm -rf game169/assets/**/*.meta

# 重新打開 Cocos Creator
```

## 檔案備份

當前可工作版本已保存在 `dddef4a` commit:
```bash
# 隨時可以恢復
git checkout dddef4a -- game169/assets/effect/SpriteUVRepeat.effect
```

帶 UV Scale 的版本已保存在 stash:
```bash
# 查看
git stash list

# 恢復
git stash pop
```

## 調試命令集

```bash
# 檢查 effect 文件編碼
file game169/assets/effect/SpriteUVRepeat.effect

# 檢查非 ASCII 字符
grep -P "[^\x00-\x7F]" game169/assets/effect/SpriteUVRepeat.effect | grep -v "^//"

# 檢查 uniform 塊大小
grep -A 20 "uniform Constant" game169/assets/effect/SpriteUVRepeat.effect

# 檢查 properties 數量
grep "value:" game169/assets/effect/SpriteUVRepeat.effect | wc -l

# 查看最近的日誌
tail -100 game169/temp/logs/project.log | grep -i "error\|effect"
```

## 下一步

請執行階段 1 的測試，並回報結果。根據結果我們可以：
- ✅ 如果可以載入 → 採用推薦行動方案
- ❌ 如果還是無法載入 → 需要更深層的診斷

## 相關 Commits

- `dddef4a`: 可工作版本 (Tint Color + Color Invert)
- `0119796`: 首次添加 UV Scale
- `437cd99`: 嘗試修復對齊
- `0524b0c`: vec2 → vec4
- `c40bd46`: 調整順序
- `f56a137`: 修復 texCoord 錯誤
- `3161d76`: 添加文檔

## 總結

當前策略是**先確保基礎功能可用**，然後再逐步添加 UV Scale。如果 UV Scale 確實導致問題，我們有多個備選方案。
