# EDITOR 變數定義問題修復

## 問題描述

**錯誤信息**：
```
ReferenceError: EDITOR is not defined
at SpriteUVController.update (...)
```

**原因**：
在 Cocos Creator 3.8 中，`EDITOR` 全局變數在某些環境下不可用，特別是在編輯器預覽模式下。

## 修復方案

### 修改的文件

1. **SpriteUVController.ts**
2. **RampUVController.ts**
3. **RampShaderResetInspector.ts**

### 修復方法

**移除前**：
```typescript
// @ts-ignore
declare const EDITOR: boolean;

protected update(): void {
    if (!EDITOR) return;  // ❌ 錯誤：EDITOR 未定義
    // ...
}
```

**修復後**：
```typescript
// 直接移除 EDITOR 檢查
protected update(): void {
    // @executeInEditMode 已經自動處理編輯器模式邏輯
    // ...
}
```

## 工作原理

Cocos Creator 的 `@executeInEditMode` 裝飾器已經自動處理了編輯器模式下的邏輯執行，無需手動檢查 `EDITOR` 全局變數。

### 執行流程

```
@executeInEditMode
↓
Cocos Creator 在編輯器中自動調用 update()
↓
無需手動檢查 EDITOR 變數
```

## 驗證

✅ 所有 `EDITOR` 參考已移除：
- SpriteUVController.ts ✓
- RampUVController.ts ✓
- RampShaderResetInspector.ts ✓

## 測試

運行場景後應該看不到任何 "EDITOR is not defined" 的錯誤。

## 其他注意事項

如果未來有其他組件需要區分編輯模式和運行模式，可以使用以下方法：

```typescript
// 方法 1：使用 isEditor 屬性
if (this.isEditor) {
    // 編輯器模式
}

// 方法 2：使用 DEBUG 標誌
if (DEBUG) {
    // 調試模式
}

// 方法 3：導入並使用 settings
import { settings } from 'cc';
if (settings.isDebugInfoEnabled()) {
    // 調試信息啟用
}
```

---

**修復完成**。現在所有三個組件都應該可以正常運行，不會再出現 "EDITOR is not defined" 的錯誤。
