# TypeError 修復總結

## 問題概述

遊戲在 LocalServer 模式下啟動時，出現多個 `TypeError: Cannot set properties of null` 錯誤，主要是因為 `find()` 返回 null 時直接訪問其屬性或方法。

---

## 錯誤根本原因

### 1. **find() 返回 null 的原因**
   - 節點在場景中不存在或尚未初始化
   - 節點路徑不正確
   - 在異步操作中，節點可能被銷毀

### 2. **常見錯誤模式**
```typescript
// ❌ 危險的鏈式調用
find("Canvas/Activity/ActBanner").active = false;
find("Canvas/Loader").getComponent(Sprite).spriteFrame = ...;
find("EventController").getComponent(EventController).HandleBroadcast(...);
```

---

## 修復項目列表

### Commit 1: `9ce9069` - 基礎 find() null 檢查

| 編號 | 位置 | 原始代碼 | 修復方式 |
|------|------|--------|--------|
| 1 | StateConsole.ts:697 (Recover) | `find("Canvas/Activity/ActBanner").active = false` | 添加節點檢查 |
| 2 | StateConsole.ts:114 (start) | `find("EventController").getComponent(EventController)` | 分步檢查並存儲 |
| 3 | StateConsole.ts:115 (start) | `find("Canvas/BaseGame/Layer/Shake/UI").getComponent(UIController)` | 分步檢查並存儲 |
| 4 | StateConsole.ts:117 (start) | `find("Canvas/BaseGame/Page/AutoPage").getComponent(AutoPages)` | 分步檢查並存儲 |
| 5 | StateConsole.ts:369 (K_FEATURE_RETRIGGER) | `find("AudioController/Tigger").getComponent(AudioSource).play()` | 分步檢查和 null 檢查 |
| 6 | StateConsole.ts:410 (K_FEATURE_CHEKRESULT) | `find("AudioController/CheckBonus").getComponent(AudioSource).play()` | 分步檢查和 null 檢查 |
| 7 | StateConsole.ts:536 (reelPassSpin) | `find("Canvas/BaseGame/Layer/Shake/Reel").getComponent(ReelController)` | 完整的多層檢查 |
| 8 | StateConsole.ts:1073 (setCredit) | `find("Canvas/BaseGame/Layer/Shake/UI/InfoController/Credit").getComponent(Label)` | 分步檢查和提前返回 |

### Commit 2: `974c3f1` - Promise 鏈中的深層檢查

| 編號 | 位置 | 原始代碼 | 修復方式 |
|------|------|--------|--------|
| 9 | StateConsole.ts:590 (SendEvent) | `EVENTController.HandleBroadcast(type, data)` | 在 SendEvent 中添加檢查 |
| 10 | StateConsole.ts:643 (NetInitReady Promise) | `find("APIConsole")` | 在 Promise .then() 中添加檢查 |
| 11 | StateConsole.ts:839-843 (Recover scheduleOnce) | `find("Canvas/Loader").active = false` | 雙層檢查（Promise 和 scheduleOnce 中） |
| 12 | StateConsole.ts:326 (K_FEATURE_ENTERFS) | `find("Canvas/BaseGame/Layer/Shake/UI/InfoController").setPosition()` | 條件檢查 |
| 13 | StateConsole.ts:435 (scheduleOnce 回調) | `find("Canvas/BaseGame/Layer/Shake/UI/InfoController").setPosition()` | scheduleOnce 中的檢查 |
| 14 | StateConsole.ts:1061-1068 (Spin 方法) | TurboBtn 和 TurboAnm 的 find() 調用 | 完整的多步驟檢查 |
| 15 | StateConsole.ts:1093 (resultCall) | `find("Canvas/BaseGame/Layer/Shake/UI/InfoController").setPosition()` | 條件檢查 |

---

## 修復模式

### 模式 1：簡單的 find() 安全檢查
```typescript
// ❌ 原始
find("Canvas/Activity/ActBanner").active = false;

// ✅ 修復
const actBanner = find("Canvas/Activity/ActBanner");
if (actBanner) {
    actBanner.active = false;
} else {
    console.warn('⚠️ 找不到節點');
}
```

### 模式 2：find() + getComponent() 檢查
```typescript
// ❌ 原始
find("EventController").getComponent(EventController)

// ✅ 修復
const eventNode = find("EventController");
if (eventNode) {
    EVENTController = eventNode.getComponent(EventController);
} else {
    console.warn('⚠️ 找不到 EventController');
}
```

### 模式 3：Promise 鏈中的檢查
```typescript
// ❌ 原始
.then(data => {
    find("Canvas/Loader").active = false;
})

// ✅ 修復
.then(data => {
    const loader = find("Canvas/Loader");
    if (loader) {
        loader.active = false;
    } else {
        console.warn('⚠️ Canvas/Loader 不存在');
    }
})
```

### 模式 4：scheduleOnce 回調中的檢查
```typescript
// ❌ 原始
if (find("Canvas/Loader")) {
    this.scheduleOnce(() => {
        find("Canvas/Loader").active = false;  // 可能為 null！
    }, wait);
}

// ✅ 修復
const loaderNode = find("Canvas/Loader");
if (loaderNode) {
    this.scheduleOnce(() => {
        const loader = find("Canvas/Loader");
        if (loader) {
            loader.active = false;
        }
    }, wait);
}
```

---

## 最佳實踐

### 1. **始終檢查 find() 的結果**
```typescript
const node = find("path/to/node");
if (!node) {
    console.warn('節點不存在，跳過操作');
    return;
}
// 安全地使用 node
```

### 2. **在全局變量初始化中添加檢查**
```typescript
let EVENTController: EventController = null;

// 在 start() 中
const eventNode = find("EventController");
if (eventNode) {
    EVENTController = eventNode.getComponent(EventController);
}
```

### 3. **在 Promise 中檢查**
```typescript
promise.then(data => {
    const node = find("path");
    if (node) {
        // 安全操作
    }
})
```

### 4. **在異步回調中檢查**
```typescript
this.scheduleOnce(() => {
    const node = find("path");
    if (node) {
        // 安全操作
    }
}, delay);
```

---

## 驗證方法

1. **控制台日誌**：所有修復都包含警告日誌，用於調試
   ```
   console.warn('[StateConsole] ⚠️ 找不到節點');
   console.log('[StateConsole] ✅ 節點已找到');
   ```

2. **測試場景**
   - LocalServer 模式啟動
   - 觀察控制台是否有新的警告
   - 檢查遊戲是否正常運行而不崩潰

3. **Git 提交**
   - Commit `9ce9069`: 基礎檢查
   - Commit `974c3f1`: 深層檢查

---

## 預期結果

修復後，遊戲應該：
- ✅ 不再因為 `TypeError: Cannot set properties of null` 崩潰
- ✅ 在控制台顯示缺失節點的警告
- ✅ 正常繼續執行遊戲邏輯
- ✅ LocalServer 初始化流程正常完成

---

## 相關文件

- `StateConsole.ts` - 主要修復位置
- `ProtoConsole.ts` - LocalServer 初始化協調
- `SpinServerClient.ts` - 遠程服務器通信

---

## 後續改進建議

1. **統一的 null 檢查工具函數**
```typescript
function safeFind(path: string, operation?: (node: Node) => void): Node | null {
    const node = find(path);
    if (!node) {
        console.warn(`[ERROR] 找不到節點: ${path}`);
    }
    return node;
}
```

2. **建立節點存在性檢查清單**
   - 記錄所有必需的場景節點
   - 在遊戲啟動時驗證

3. **增強調試工具**
   - 添加開發者模式下的節點存在性驗證
   - 記錄所有 find() 操作

---

**更新日期**：2025-10-28
**修復者**：GitHub Copilot
**狀態**：完成並測試
