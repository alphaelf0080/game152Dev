# ReelController 重構測試指南

**測試版本**: v1.0  
**測試日期**: 2025-10-15  
**重構階段**: Phase 1 - 效能優化

---

## 🧪 快速測試步驟

### 1. 編譯檢查

```bash
# 在 Cocos Creator 中
1. 開啟專案
2. 檢查控制台是否有編譯錯誤
3. 確認所有新檔案都被正確引入
```

### 2. 基本功能測試

#### 測試案例 1: 正常旋轉
- [ ] 點擊 Spin 按鈕
- [ ] 觀察滾輪是否正常旋轉
- [ ] 確認停止順序正確（從左到右）
- [ ] 檢查符號顯示正確

#### 測試案例 2: Turbo 模式
- [ ] 啟用 Turbo 模式
- [ ] 點擊 Spin
- [ ] 確認旋轉速度加快
- [ ] 檢查停止邏輯正常

#### 測試案例 3: SlowMotion 效果
- [ ] 觸發包含 SlowMotion 的旋轉
- [ ] 確認動畫效果正常
- [ ] 檢查音效播放正確
- [ ] 驗證畫面變暗效果

#### 測試案例 4: Feature 遊戲
- [ ] 進入 Feature 遊戲
- [ ] 測試旋轉功能
- [ ] 確認特殊動畫正常
- [ ] 檢查狀態切換正確

---

## 📊 效能測試

### 測試工具準備

在 ReelController.ts 的 update 方法中添加效能監控：

```typescript
update() {
    const startTime = performance.now();
    
    if (!this._startSpinBool || !this.updateManager.shouldUpdate()) {
        return;
    }
    
    // ... 更新邏輯
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // 只在執行時間超過閾值時記錄
    if (executionTime > 1.0) {
        console.warn(`Update took ${executionTime.toFixed(2)}ms`);
    }
}
```

### 效能指標檢查

#### FPS 測試
- [ ] 開啟 Cocos Creator 的 FPS 顯示
- [ ] 執行多次 Spin
- [ ] 記錄 FPS 範圍
- [ ] 預期：穩定在 58-60 FPS

#### Update 執行時間
- [ ] 監控控制台輸出
- [ ] 記錄 update 方法執行時間
- [ ] 預期：< 1ms

#### 記憶體使用
- [ ] 使用瀏覽器開發者工具
- [ ] 執行 30 次以上 Spin
- [ ] 觀察記憶體變化
- [ ] 預期：無持續增長（無記憶體洩漏）

---

## 🔍 功能詳細測試

### 節點快取測試

添加測試代碼：

```typescript
// 在 start() 方法中
console.log('=== NodeCache Test ===');
const cache = NodeCache.getInstance();

// 測試節點快取
const node1 = cache.getNode("reelSlow", AllNode.Data.Map);
const node2 = cache.getNode("reelSlow", AllNode.Data.Map);
console.log('Cache working:', node1 === node2); // 應該為 true

// 測試音效快取
const audio1 = cache.getReelStopAudio(1);
const audio2 = cache.getReelStopAudio(1);
console.log('Audio cache working:', audio1 === audio2); // 應該為 true
```

**預期結果**:
- ✅ Cache working: true
- ✅ Audio cache working: true

### 更新管理器測試

```typescript
// 在 StartRolling() 方法中添加
console.log('=== UpdateManager Test ===');
console.log('Dirty reels:', this.updateManager.getDirtyReels());
console.log('Should update:', this.updateManager.shouldUpdate());
```

**預期結果**:
- ✅ 開始時所有滾輪被標記為 dirty
- ✅ shouldUpdate() 返回 true
- ✅ 停止後 dirty 標記被清除

---

## ⚠️ 常見問題排查

### 問題 1: 滾輪不旋轉

**症狀**: 點擊 Spin 後滾輪沒有反應

**檢查項目**:
- [ ] 檢查 `updateManager.markAllReelsDirty()` 是否被呼叫
- [ ] 確認 `_startSpinBool` 被設置為 true
- [ ] 查看控制台是否有錯誤訊息

**解決方案**:
```typescript
// 在 StartRolling() 中確保
this.updateManager.setSpinning(true);
this.updateManager.markAllReelsDirty(this._reels.length);
this._startSpinBool = true;
```

### 問題 2: 音效不播放

**症狀**: 滾輪停止時沒有音效

**檢查項目**:
- [ ] 確認節點快取已預載入
- [ ] 檢查 `getReelStopAudio()` 返回值
- [ ] 驗證音效節點路徑正確

**解決方案**:
```typescript
// 檢查快取是否正確建立
const audio = this.nodeCache.getReelStopAudio(1);
if (!audio) {
    console.error('Audio not cached properly');
    // 手動查找並播放
    const node = find("AudioController/ReelStop/1");
    if (node) node.getComponent(AudioSource)?.play();
}
```

### 問題 3: SlowMotion 效果異常

**症狀**: SlowMotion 動畫或音效不正常

**檢查項目**:
- [ ] 確認 `isSlowWaiting` 狀態正確
- [ ] 檢查節點快取是否包含相關節點
- [ ] 驗證動畫播放邏輯

**解決方案**:
```typescript
// 在 CallStopping() 中添加除錯訊息
console.log('SlowMotion flag:', Data.Library.MathConsole.getWinData()._slowmotion_flag[next]);
console.log('isSlowWaiting:', this.isSlowWaiting);
```

### 問題 4: 效能未改善

**症狀**: FPS 仍然不穩定

**檢查項目**:
- [ ] 確認 update() 方法的早期退出邏輯有效
- [ ] 檢查是否有其他效能瓶頸
- [ ] 使用 Profiler 分析

**解決方案**:
```typescript
// 添加更詳細的效能監控
let updateCount = 0;
let totalTime = 0;

update() {
    if (!this._startSpinBool || !this.updateManager.shouldUpdate()) {
        return;
    }
    
    const start = performance.now();
    // ... 更新邏輯
    const end = performance.now();
    
    updateCount++;
    totalTime += (end - start);
    
    if (updateCount % 60 === 0) {
        console.log(`Avg update time: ${(totalTime / 60).toFixed(2)}ms`);
        totalTime = 0;
    }
}
```

---

## 📋 測試檢查清單

### 基礎功能 ✅
- [ ] 正常 Spin
- [ ] Turbo Spin
- [ ] SlowMotion 效果
- [ ] 音效播放
- [ ] 動畫顯示
- [ ] 符號更新

### 進階功能 ✅
- [ ] Feature 遊戲進入
- [ ] Feature 遊戲旋轉
- [ ] 轉場效果
- [ ] 結果檢查
- [ ] 重新整理恢復

### 效能指標 ✅
- [ ] FPS ≥ 58
- [ ] Update 時間 < 1ms
- [ ] 無記憶體洩漏
- [ ] 載入時間正常
- [ ] 低端設備測試

### 相容性 ✅
- [ ] 與現有系統互動正常
- [ ] 狀態切換正確
- [ ] 事件處理正常
- [ ] 數據同步正確

---

## 📊 測試結果記錄

### 測試環境

| 項目 | 資訊 |
|------|------|
| 日期 | ____________ |
| 測試者 | ____________ |
| Cocos 版本 | ____________ |
| 瀏覽器 | ____________ |
| 設備 | ____________ |

### 測試結果

| 測試項目 | 狀態 | 備註 |
|----------|------|------|
| 基礎功能 | ☐ Pass ☐ Fail | ____________ |
| Turbo 模式 | ☐ Pass ☐ Fail | ____________ |
| SlowMotion | ☐ Pass ☐ Fail | ____________ |
| Feature 遊戲 | ☐ Pass ☐ Fail | ____________ |
| FPS 效能 | ☐ Pass ☐ Fail | 平均: ____ FPS |
| Update 時間 | ☐ Pass ☐ Fail | 平均: ____ ms |
| 記憶體 | ☐ Pass ☐ Fail | ____________ |

### 問題記錄

| 問題描述 | 嚴重程度 | 解決狀態 |
|----------|----------|----------|
| ____________ | ☐ High ☐ Medium ☐ Low | ☐ 已解決 ☐ 處理中 |
| ____________ | ☐ High ☐ Medium ☐ Low | ☐ 已解決 ☐ 處理中 |

---

## 🎯 驗收標準

重構被認為成功，必須滿足以下條件：

### 必要條件 (Must Have)
- ✅ 所有基礎功能正常運作
- ✅ 無編譯錯誤或警告
- ✅ 無功能退化
- ✅ FPS 不低於重構前

### 期望條件 (Should Have)
- ✅ FPS 提升至穩定 60
- ✅ Update 執行時間 < 1ms
- ✅ 無明顯記憶體洩漏
- ✅ 載入時間未增加

### 加分條件 (Nice to Have)
- ✅ 效能提升明顯可感知
- ✅ 程式碼可讀性提升
- ✅ 團隊反饋正面
- ✅ 易於後續維護

---

## 📞 問題回報

如測試中發現問題，請記錄以下資訊：

1. **問題描述**: 詳細說明問題現象
2. **重現步驟**: 列出重現問題的步驟
3. **預期行為**: 說明預期應該如何運作
4. **實際行為**: 說明實際發生了什麼
5. **截圖/錄影**: 如有可能，提供視覺證據
6. **控制台訊息**: 複製相關的錯誤或警告訊息
7. **測試環境**: 說明測試時的環境配置

---

**文件維護**: GitHub Copilot  
**版本**: v1.0  
**最後更新**: 2025-10-15