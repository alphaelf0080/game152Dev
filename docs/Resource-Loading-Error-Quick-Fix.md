# 資源載入錯誤快速修復方案

**問題類型**: 資源載入失敗  
**錯誤位置**: `debug.ts:92`, `load.ts`, `parser.ts`  
**嚴重程度**: 🔴 Critical - 阻止遊戲正常啟動

---

## 🔍 問題分析

### 錯誤堆疊解析

從堆疊追蹤可以看出，錯誤發生在資源載入管線 (Asset Loading Pipeline) 中：

```
download-dom-image.ts → downloader.ts → load.ts → parser.ts → utilities.ts
```

這表明：
1. ✅ 資源下載階段完成
2. ❌ 資源解析階段失敗
3. 🔍 資源引用存在，但實體檔案缺失

### 根本原因

這些資源 UUID 在場景檔案 (`main.scene`) 中被引用，但對應的實體檔案已經：
- 被刪除
- 被移動到其他位置
- Meta 檔案損壞
- 編譯過程中遺失

---

## 🚀 快速修復方案（3 步驟）

### 步驟 1: 搜尋並找回遺失的資源

在 PowerShell 中執行：

```powershell
# 切換到專案目錄
cd c:\projects\game152Dev

# 搜尋這 3 個 UUID 對應的 meta 檔案
$uuids = @(
    "7f4de0b3-fc1b-4f4c-82d1-4d4978483c31",
    "59a2c4af-6236-452e-be67-8e1bd1016a9a",
    "5d25d90c-6781-4e85-8c2e-24532374e271"
)

foreach ($uuid in $uuids) {
    Write-Host "`n=== 搜尋 UUID: $uuid ===" -ForegroundColor Yellow
    
    # 搜尋 meta 檔案
    $metaFiles = Get-ChildItem -Path "assets" -Recurse -Filter "*.meta" | 
        Where-Object { (Get-Content $_.FullName -Raw) -match $uuid }
    
    if ($metaFiles) {
        foreach ($meta in $metaFiles) {
            Write-Host "找到 Meta 檔案: $($meta.FullName)" -ForegroundColor Green
            
            # 檢查對應的資源檔案是否存在
            $resourceFile = $meta.FullName -replace '\.meta$', ''
            if (Test-Path $resourceFile) {
                Write-Host "  ✅ 資源檔案存在: $resourceFile" -ForegroundColor Green
            } else {
                Write-Host "  ❌ 資源檔案缺失: $resourceFile" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "❌ 找不到對應的 Meta 檔案" -ForegroundColor Red
    }
}
```

### 步驟 2: 修復場景引用

#### 選項 A: 使用文字編輯器（快速但需小心）

```powershell
# 備份場景檔案
Copy-Item "assets\scene\main.scene" "assets\scene\main.scene.backup"

# 使用 VSCode 開啟
code "assets\scene\main.scene"
```

然後：
1. 搜尋並移除或註解掉有問題的 UUID 引用
2. 或替換為有效的資源 UUID

#### 選項 B: 使用 Cocos Creator（安全但較慢）

1. 開啟 Cocos Creator
2. 開啟 `main.scene`
3. 查看 Console，Cocos 會標示哪些節點有問題
4. 逐一修復受影響的節點

### 步驟 3: 清除快取並重建

```powershell
# 停止所有執行中的 Cocos Creator 程序
Get-Process | Where-Object { $_.ProcessName -like "*CocosCreator*" } | Stop-Process -Force

# 清除編譯快取
Remove-Item -Path "library" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "temp" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "local" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n✅ 快取已清除，請重新開啟 Cocos Creator" -ForegroundColor Green
```

---

## 🛠️ 自動化修復腳本

將以下腳本儲存為 `fix-missing-resources.ps1`：

```powershell
# 資源遺失自動修復腳本
param(
    [string]$ProjectPath = "c:\projects\game152Dev",
    [switch]$AutoFix = $false
)

Write-Host "=== 資源遺失診斷與修復工具 ===" -ForegroundColor Cyan
Write-Host "專案路徑: $ProjectPath`n" -ForegroundColor Gray

# 切換到專案目錄
Set-Location $ProjectPath

# 遺失的 UUID 清單
$missingUUIDs = @(
    @{ UUID = "7f4de0b3-fc1b-4f4c-82d1-4d4978483c31"; Name = "miniSpin 按鈕" },
    @{ UUID = "59a2c4af-6236-452e-be67-8e1bd1016a9a"; Name = "miniSpin 提示" },
    @{ UUID = "5d25d90c-6781-4e85-8c2e-24532374e271"; Name = "FeatureBuy 按鈕" }
)

# 記錄找到的資源
$foundResources = @()
$missingResources = @()

# 步驟 1: 掃描所有資源
Write-Host "步驟 1: 掃描資源..." -ForegroundColor Yellow

foreach ($item in $missingUUIDs) {
    $uuid = $item.UUID
    $name = $item.Name
    
    Write-Host "`n檢查: $name ($uuid)" -ForegroundColor White
    
    # 搜尋 meta 檔案
    $metaFiles = Get-ChildItem -Path "assets" -Recurse -Filter "*.meta" -ErrorAction SilentlyContinue | 
        Where-Object { (Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue) -match $uuid }
    
    if ($metaFiles) {
        foreach ($meta in $metaFiles) {
            $resourceFile = $meta.FullName -replace '\.meta$', ''
            $exists = Test-Path $resourceFile
            
            $foundResources += @{
                UUID = $uuid
                Name = $name
                MetaPath = $meta.FullName
                ResourcePath = $resourceFile
                Exists = $exists
            }
            
            if ($exists) {
                Write-Host "  ✅ 資源完整: $resourceFile" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Meta 存在但資源檔案缺失: $resourceFile" -ForegroundColor Red
                $missingResources += $uuid
            }
        }
    } else {
        Write-Host "  ❌ 找不到任何相關檔案" -ForegroundColor Red
        $missingResources += $uuid
    }
}

# 步驟 2: 檢查場景引用
Write-Host "`n`n步驟 2: 檢查場景引用..." -ForegroundColor Yellow

$sceneFile = "assets\scene\main.scene"
if (Test-Path $sceneFile) {
    $sceneContent = Get-Content $sceneFile -Raw
    
    foreach ($uuid in $missingResources) {
        if ($sceneContent -match $uuid) {
            Write-Host "  ⚠️  場景中發現引用: $uuid" -ForegroundColor Magenta
        }
    }
}

# 步驟 3: 生成修復建議
Write-Host "`n`n步驟 3: 修復建議" -ForegroundColor Yellow

if ($missingResources.Count -eq 0) {
    Write-Host "  ✅ 所有資源完整，無需修復！" -ForegroundColor Green
} else {
    Write-Host "  發現 $($missingResources.Count) 個問題資源" -ForegroundColor Red
    Write-Host "`n  建議修復方案:" -ForegroundColor White
    Write-Host "  1. 從備份或版本控制還原遺失的檔案" -ForegroundColor Gray
    Write-Host "  2. 在 Cocos Creator 中重新指定資源" -ForegroundColor Gray
    Write-Host "  3. 移除場景中的無效引用" -ForegroundColor Gray
    
    if ($AutoFix) {
        Write-Host "`n  🔧 自動修復模式..." -ForegroundColor Cyan
        
        # 備份場景
        $backupFile = "$sceneFile.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $sceneFile $backupFile
        Write-Host "  ✅ 場景已備份: $backupFile" -ForegroundColor Green
        
        # 移除無效引用（註解掉包含問題 UUID 的行）
        $lines = Get-Content $sceneFile
        $fixedLines = @()
        
        foreach ($line in $lines) {
            $isProblematic = $false
            foreach ($uuid in $missingResources) {
                if ($line -match $uuid) {
                    $isProblematic = $true
                    break
                }
            }
            
            if ($isProblematic) {
                $fixedLines += "// FIXME: Missing resource - $line"
            } else {
                $fixedLines += $line
            }
        }
        
        $fixedLines | Set-Content $sceneFile -Encoding UTF8
        Write-Host "  ✅ 場景檔案已修復（無效引用已註解）" -ForegroundColor Green
    }
}

# 步驟 4: 清除快取
Write-Host "`n`n步驟 4: 清除快取" -ForegroundColor Yellow

if ($AutoFix) {
    $cacheFolders = @("library", "temp", "local")
    foreach ($folder in $cacheFolders) {
        if (Test-Path $folder) {
            Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  ✅ 已清除: $folder" -ForegroundColor Green
        }
    }
}

# 總結
Write-Host "`n`n=== 診斷完成 ===" -ForegroundColor Cyan
Write-Host "找到資源: $($foundResources.Count)" -ForegroundColor White
Write-Host "遺失資源: $($missingResources.Count)" -ForegroundColor White

if ($AutoFix -and $missingResources.Count -gt 0) {
    Write-Host "`n⚠️  請在 Cocos Creator 中重新開啟專案" -ForegroundColor Yellow
}
```

執行方式：

```powershell
# 只診斷，不修復
.\fix-missing-resources.ps1

# 自動修復
.\fix-missing-resources.ps1 -AutoFix
```

---

## 🎯 針對性修復

### 修復 miniSpinNode

```typescript
// 在適當的 Component 中添加此方法
private fixMiniSpinResources(): void {
    const miniSpinShow = find("Canvas/BaseGame/Page/miniSpinNode/miniSpinShow");
    const miniSpinNotice = find("Canvas/BaseGame/Page/miniSpinNode/miniSpinBg/miniSpinNotice");
    
    if (miniSpinShow) {
        const sprite = miniSpinShow.getComponent(Sprite);
        if (sprite && !sprite.spriteFrame) {
            // 方案 1: 設為透明
            miniSpinShow.active = false;
            console.warn("miniSpinShow 資源缺失，已隱藏");
            
            // 方案 2: 使用替代資源
            // resources.load("ui/default_button", SpriteFrame, (err, spriteFrame) => {
            //     if (!err && sprite) {
            //         sprite.spriteFrame = spriteFrame;
            //     }
            // });
        }
    }
    
    if (miniSpinNotice) {
        const sprite = miniSpinNotice.getComponent(Sprite);
        if (sprite && !sprite.spriteFrame) {
            miniSpinNotice.active = false;
            console.warn("miniSpinNotice 資源缺失，已隱藏");
        }
    }
}
```

### 修復 FeatureBuyPage

```typescript
private fixFeatureBuyButtons(): void {
    const buttons = [
        "Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage1/BuyBtn100",
        "Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage1/BuyBtn80",
        "Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage1/BuyBtn60"
    ];
    
    buttons.forEach(path => {
        const btn = find(path);
        if (btn) {
            const button = btn.getComponent(Button);
            if (button && !button.normalSprite) {
                // 方案 1: 隱藏按鈕
                btn.active = false;
                console.warn(`${path} 資源缺失，已隱藏`);
                
                // 方案 2: 使用預設資源
                // resources.load("ui/default_button", SpriteFrame, (err, spriteFrame) => {
                //     if (!err && button) {
                //         button.normalSprite = spriteFrame;
                //     }
                // });
            }
        }
    });
}
```

### 修復 Spine 動畫

```typescript
private fixSpineAnimations(): void {
    // 掃描所有 Spine 組件
    const canvas = find("Canvas");
    if (!canvas) return;
    
    this.fixSpineInNode(canvas);
}

private fixSpineInNode(node: Node): void {
    const spine = node.getComponent(sp.Skeleton);
    if (spine) {
        try {
            // 如果動畫名稱是 <None> 或空，清除它
            if (!spine.animation || spine.animation === '<None>' || spine.animation.trim() === '') {
                spine.animation = '';
                console.log(`已修復 Spine 動畫: ${this.getNodePath(node)}`);
            }
        } catch (e) {
            console.warn(`Spine 修復失敗: ${this.getNodePath(node)}`, e);
        }
    }
    
    // 遞迴處理子節點
    node.children.forEach(child => this.fixSpineInNode(child));
}

private getNodePath(node: Node): string {
    const path: string[] = [];
    let current = node;
    
    while (current && current.name !== 'Canvas') {
        path.unshift(current.name);
        current = current.parent;
    }
    
    return 'Canvas/' + path.join('/');
}
```

---

## 📋 執行檢查清單

- [ ] **診斷階段**
  - [ ] 執行 PowerShell 診斷腳本
  - [ ] 確認哪些資源真的缺失
  - [ ] 檢查是否有備份或版本控制記錄

- [ ] **修復階段**
  - [ ] 備份 `main.scene`
  - [ ] 選擇修復方案（手動/自動）
  - [ ] 執行修復
  - [ ] 驗證修復結果

- [ ] **清理階段**
  - [ ] 停止 Cocos Creator
  - [ ] 清除快取目錄
  - [ ] 重新啟動 Cocos Creator

- [ ] **測試階段**
  - [ ] 檢查 Console 是否還有錯誤
  - [ ] 測試受影響的功能
  - [ ] 確認遊戲可正常執行

---

## 🚨 緊急處理（如果遊戲無法啟動）

如果問題導致遊戲完全無法啟動，執行以下緊急步驟：

1. **停用問題節點**

在 `DataController.ts` 的 `start()` 方法中添加：

```typescript
start() {
    // 緊急修復：停用有問題的節點
    this.emergencyDisableProblematicNodes();
}

private emergencyDisableProblematicNodes(): void {
    const problematicPaths = [
        "Canvas/BaseGame/Page/miniSpinNode",
        "Canvas/BaseGame/Page/FeatureBuyPage"
    ];
    
    problematicPaths.forEach(path => {
        const node = find(path);
        if (node) {
            node.active = false;
            console.warn(`緊急停用: ${path}`);
        }
    });
}
```

2. **還原到已知可用的版本**

```powershell
# 如果使用 Git
git log --oneline | Select-Object -First 20
git checkout <last-working-commit> assets/scene/main.scene
```

---

**建立時間**: 2025-10-13  
**優先級**: 🔴 Critical  
**預估修復時間**: 15-30 分鐘
