# 緊急資源修復工具使用指南

## 🚨 問題描述

遊戲出現以下錯誤:
```
Can not find class 'ea630dZsN1HeYme0pj/1VW9'
The asset 7f4de0b3-fc1b-4f4c-82d1-4d4978483c31@f9941 is missing!
The asset 59a2c4af-6236-452e-be67-8e1bd1016a9a@f9941 is missing!
The asset 5d25d90c-6781-4e85-8c2e-24532374e271@f9941 is missing!
Spine: Animation not found: <None>
```

**根本原因**: 場景檔案引用的資源檔案已被刪除或移動，但引用還存在於 `main.scene` 中。

---

## ✅ 快速修復步驟

### 步驟 1: 使用緊急修復組件

1. **在 Cocos Creator 中開啟專案**

2. **開啟 main.scene**

3. **選擇 Canvas 節點**

4. **添加組件**:
   - 點擊「添加組件」→「自定義組件」
   - 選擇 `EmergencyResourceFix`

5. **配置組件屬性**:
   ```
   Auto Fix: ✅ (啟用自動修復)
   Hide Problematic Nodes: ✅ (隱藏有問題的節點)
   Log Details: ✅ (顯示詳細日誌)
   Fallback Sprite: (可選) 拖入一個預設圖片
   ```

6. **執行遊戲**:
   - 點擊「播放」按鈕
   - 查看 Console 輸出的修復報告

7. **檢查結果**:
   - 確認錯誤訊息是否消失
   - 測試遊戲功能是否正常

### 步驟 2: 清除場景中的無效引用 (徹底修復)

如果你想徹底解決問題而不只是隱藏,執行以下步驟:

#### 方案 A: 手動編輯場景檔案 (謹慎使用)

1. **備份場景**:
```powershell
cd c:\projects\game152Dev
Copy-Item "assets\scene\main.scene" "assets\scene\main.scene.backup"
```

2. **使用 VSCode 開啟場景**:
```powershell
code "assets\scene\main.scene"
```

3. **移除無效引用**:
   - 搜尋並定位到以下行號:
     * Line 4674, 4716: `7f4de0b3-fc1b-4f4c-82d1-4d4978483c31`
     * Line 35018: `ea630dZsN1HeYme0pj/1VW9`
   
   - 將整個組件定義註解掉或刪除

4. **儲存並重新開啟 Cocos Creator**

#### 方案 B: 在 Cocos Creator 中手動修復 (推薦)

1. **定位問題節點**:
   根據之前的分析,問題出現在:
   - `Canvas/BaseGame/Page/miniSpinNode/miniSpinShow`
   - `Canvas/BaseGame/Page/miniSpinNode/miniSpinBg/miniSpinNotice`
   - 某個掛載了未知組件 (ea630d...) 的節點

2. **移除未知組件**:
   - 在階層管理器中搜尋節點
   - 在屬性檢查器中找到標記為「Missing」的組件
   - 點擊齒輪圖示 → 「Remove Component」

3. **修復 Sprite**:
   - 選擇有問題的節點
   - 在 Sprite 組件中重新指定 SpriteFrame
   - 或者暫時停用該節點

4. **儲存場景**

### 步驟 3: 清除快取並重建

```powershell
# 停止 Cocos Creator
Get-Process | Where-Object { $_.ProcessName -like "*CocosCreator*" } | Stop-Process -Force

# 清除快取
cd c:\projects\game152Dev
Remove-Item -Path "library" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "temp" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n✅ 快取已清除，請重新開啟 Cocos Creator" -ForegroundColor Green
```

---

## 🔧 組件 API 說明

### 屬性

```typescript
// 是否自動修復問題
autoFix: boolean = true

// 是否隱藏有問題的節點 (最安全的修復方式)
hideProblematicNodes: boolean = false

// 是否輸出詳細日誌
logDetails: boolean = true

// 備用的 SpriteFrame (當資源缺失時使用)
fallbackSprite: SpriteFrame | null = null
```

### 方法

```typescript
// 手動執行修復
manualFix(): void

// 取得問題清單
getIssues(): ResourceIssue[]

// 取得統計資訊
getStats(): { total: number, fixed: number, pending: number }
```

### 使用範例

```typescript
// 在其他組件中使用
import { EmergencyResourceFix } from './EmergencyResourceFix';

// 取得修復組件
const fixer = this.node.getComponent(EmergencyResourceFix);

if (fixer) {
    // 手動執行修復
    fixer.manualFix();
    
    // 取得統計資訊
    const stats = fixer.getStats();
    console.log(`總問題: ${stats.total}, 已修復: ${stats.fixed}`);
    
    // 取得詳細問題清單
    const issues = fixer.getIssues();
    issues.forEach(issue => {
        console.log(`${issue.nodePath}: ${issue.details}`);
    });
}
```

---

## 📊 預期修復結果

執行組件後,你應該會在 Console 看到類似的輸出:

```
[EmergencyResourceFix] 開始檢測資源問題...
[EmergencyResourceFix] 已隱藏: Canvas/BaseGame/Page/miniSpinNode/miniSpinShow
[EmergencyResourceFix] 已隱藏: Canvas/BaseGame/Page/miniSpinNode/miniSpinBg/miniSpinNotice
[EmergencyResourceFix] 已清除無效 Spine 動畫: Canvas/某個節點

============================================================
[EmergencyResourceFix] 資源問題報告
============================================================
總問題數: 4
已修復: 4
未修復: 0
============================================================

【缺失的 Sprite】 共 2 個問題:
  1. ✅ 已修復 Canvas/BaseGame/Page/miniSpinNode/miniSpinShow
     └─ Sprite 組件缺少 SpriteFrame
  2. ✅ 已修復 Canvas/BaseGame/Page/miniSpinNode/miniSpinBg/miniSpinNotice
     └─ Sprite 組件缺少 SpriteFrame

【無效的 Spine 動畫】 共 1 個問題:
  1. ✅ 已修復 Canvas/某個節點
     └─ Spine 動畫名稱無效: "<None>"

============================================================
```

---

## ⚠️ 注意事項

1. **這是臨時解決方案**:
   - 組件只是隱藏或替換問題節點
   - 真正的修復是還原缺失的資源檔案或重新指定資源

2. **備份很重要**:
   - 在手動編輯 scene 檔案前一定要備份
   - 建議使用版本控制 (Git) 來追蹤變更

3. **根本解決方案**:
   - 找出為什麼資源會缺失 (誤刪? SVN/Git 同步問題?)
   - 建立資源管理流程,避免重複發生

4. **性能影響**:
   - 組件只在啟動時執行一次,對性能影響極小
   - 修復完成後可以移除組件

---

## 🔍 進階診斷

如果問題持續存在,執行完整診斷:

```powershell
# 執行完整資源掃描
cd c:\projects\game152Dev

# 檢查所有引用這些 UUID 的檔案
$uuids = @(
    "7f4de0b3-fc1b-4f4c-82d1-4d4978483c31",
    "59a2c4af-6236-452e-be67-8e1bd1016a9a",
    "5d25d90c-6781-4e85-8c2e-24532374e271",
    "ea630dZsN1HeYme0pj/1VW9"
)

foreach ($uuid in $uuids) {
    Write-Host "`n=== 搜尋: $uuid ===" -ForegroundColor Yellow
    
    # 搜尋所有檔案
    Get-ChildItem -Path "assets" -Recurse -File | 
        Where-Object { 
            $_.Extension -match '\.(scene|prefab|meta)$' 
        } | 
        ForEach-Object {
            $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
            if ($content -and $content -match $uuid) {
                Write-Host "  找到引用: $($_.FullName)" -ForegroundColor Cyan
            }
        }
}
```

---

## 📞 需要協助?

如果以上步驟無法解決問題:

1. 檢查 `docs/Resource-Loading-Error-Quick-Fix.md` 獲得更多資訊
2. 確認是否有其他錯誤訊息
3. 檢查 Cocos Creator 的版本是否正確
4. 嘗試從乾淨的專案備份還原

---

**建立時間**: 2025-10-13  
**組件版本**: 1.0.0  
**適用於**: Cocos Creator 3.x
