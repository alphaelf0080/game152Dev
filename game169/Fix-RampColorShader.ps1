# RampColorShader 錯誤修復腳本
# 修復 "path argument must be of type string" 錯誤

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "RampColorShader 錯誤修復工具" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\projects\game152Dev\game169"
$shaderFile = "assets\effect\RampColorShader.effect"
$shaderPath = Join-Path $projectPath $shaderFile

# 檢查專案路徑
if (-not (Test-Path $projectPath)) {
    Write-Host "錯誤: 找不到專案路徑 $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath

Write-Host "專案路徑: $projectPath" -ForegroundColor Green
Write-Host ""

# 1. 檢查 shader 檔案
Write-Host "步驟 1: 檢查 shader 檔案..." -ForegroundColor Yellow
if (Test-Path $shaderPath) {
    $fileInfo = Get-Item $shaderPath
    Write-Host "  ✓ 檔案存在" -ForegroundColor Green
    Write-Host "    大小: $($fileInfo.Length) bytes" -ForegroundColor White
    Write-Host "    修改時間: $($fileInfo.LastWriteTime)" -ForegroundColor White
    
    # 檢查檔案內容
    $content = Get-Content $shaderPath -Raw
    if ($content -match 'CCEffect') {
        Write-Host "  ✓ 檔案格式正確" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 檔案格式錯誤！" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ✗ 檔案不存在！" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. 清理 meta 檔案
Write-Host "步驟 2: 清理 meta 檔案..." -ForegroundColor Yellow
$metaFiles = @(
    "$shaderFile.meta",
    "assets\effect\RampColorShader.effect.backup.meta",
    "assets\effect\RampColorShader_minimal.effect.meta"
)

foreach ($meta in $metaFiles) {
    $metaPath = Join-Path $projectPath $meta
    if (Test-Path $metaPath) {
        try {
            Remove-Item $metaPath -Force
            Write-Host "  ✓ 刪除: $meta" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ 無法刪除: $meta - $_" -ForegroundColor Red
        }
    }
}

Write-Host ""

# 3. 清理備份檔案
Write-Host "步驟 3: 清理備份檔案..." -ForegroundColor Yellow
$backupFiles = @(
    "assets\effect\RampColorShader.effect.backup",
    "assets\effect\RampColorShader_minimal.effect"
)

foreach ($backup in $backupFiles) {
    $backupPath = Join-Path $projectPath $backup
    if (Test-Path $backupPath) {
        try {
            Remove-Item $backupPath -Force
            Write-Host "  ✓ 刪除: $backup" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ 無法刪除: $backup - $_" -ForegroundColor Red
        }
    }
}

Write-Host ""

# 4. 清除 Cocos Creator 快取
Write-Host "步驟 4: 清除 Cocos Creator 快取..." -ForegroundColor Yellow
$cacheDirs = @("temp", "library", "local", "build", "profiles")

foreach ($dir in $cacheDirs) {
    $fullPath = Join-Path $projectPath $dir
    if (Test-Path $fullPath) {
        try {
            Remove-Item $fullPath -Recurse -Force -ErrorAction Stop
            Write-Host "  ✓ 刪除: $dir\" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ 刪除失敗: $dir\ - $_" -ForegroundColor Red
        }
    }
}

Write-Host ""

# 5. 驗證 shader 語法
Write-Host "步驟 5: 驗證 shader 語法..." -ForegroundColor Yellow
$content = Get-Content $shaderPath -Raw

$checks = @(
    @{ Name = "CCEffect 標記"; Pattern = "CCEffect %\{" },
    @{ Name = "useMainTexture 格式"; Pattern = "useMainTexture:\s*\{\s*value:\s*0\.0" },
    @{ Name = "spriteTiling 定義"; Pattern = "spriteTiling:\s*\{\s*value:\s*\[1\.0,\s*1\.0\]" },
    @{ Name = "rampUVTiling 定義"; Pattern = "rampUVTiling:\s*\{\s*value:\s*\[1\.0,\s*1\.0\]" },
    @{ Name = "rampUVOffsetControl 定義"; Pattern = "rampUVOffsetControl:\s*\{\s*value:\s*\[0\.0,\s*0\.0\]" },
    @{ Name = "effectUV varying (vertex)"; Pattern = "out vec2 effectUV;" },
    @{ Name = "effectUV varying (fragment)"; Pattern = "in vec2 effectUV;" },
    @{ Name = "normalizeEffectUV 函數"; Pattern = "vec2 normalizeEffectUV\(vec2 uv\)" },
    @{ Name = "calculateRampCoord 調用"; Pattern = "calculateRampCoord\(effectUV\)" }
)

$allPassed = $true
foreach ($check in $checks) {
    if ($content -match $check.Pattern) {
        Write-Host "  ✓ $($check.Name)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($check.Name) 缺失！" -ForegroundColor Red
        $allPassed = $false
    }
}

Write-Host ""

# 6. 總結
Write-Host "==================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "修復完成！" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "下一步操作：" -ForegroundColor Yellow
    Write-Host "1. 啟動 Cocos Creator" -ForegroundColor White
    Write-Host "2. 打開專案" -ForegroundColor White
    Write-Host "3. Cocos Creator 會自動重新生成 .meta 檔案" -ForegroundColor White
    Write-Host "4. 檢查 shader 是否能正常載入" -ForegroundColor White
} else {
    Write-Host "發現問題！" -ForegroundColor Red
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "請檢查上方標記為 ✗ 的項目" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "如果仍有問題，請查看：" -ForegroundColor Yellow
Write-Host "- docs\RampColorShader-Final-Checklist.md" -ForegroundColor White
Write-Host "- docs\RampColorShader-Diagnostic-Report.md" -ForegroundColor White
Write-Host ""
