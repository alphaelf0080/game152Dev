# Cocos Creator 快取清除腳本
# 用於解決 shader 無法載入的問題

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Cocos Creator 快取清除工具" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\projects\game152Dev\game169"

# 檢查專案路徑
if (-not (Test-Path $projectPath)) {
    Write-Host "錯誤: 找不到專案路徑 $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath

Write-Host "專案路徑: $projectPath" -ForegroundColor Green
Write-Host ""

# 要刪除的目錄列表
$cacheDirs = @(
    "temp",
    "library",
    "local",
    "build",
    "profiles"
)

# 刪除快取目錄
Write-Host "開始清除快取..." -ForegroundColor Yellow
Write-Host ""

foreach ($dir in $cacheDirs) {
    $fullPath = Join-Path $projectPath $dir
    if (Test-Path $fullPath) {
        try {
            Write-Host "正在刪除: $dir\" -ForegroundColor White
            Remove-Item $fullPath -Recurse -Force -ErrorAction Stop
            Write-Host "  ✓ 成功刪除" -ForegroundColor Green
        }
        catch {
            Write-Host "  ✗ 刪除失敗: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  - $dir\ 不存在，跳過" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "快取清除完成！" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 啟動 Cocos Creator" -ForegroundColor White
Write-Host "2. 打開專案 (可能需要較長時間重新編譯)" -ForegroundColor White
Write-Host "3. 檢查 RampColorShader.effect 是否能正常載入" -ForegroundColor White
Write-Host "4. 查看控制台 (Console) 是否有錯誤訊息" -ForegroundColor White
Write-Host ""
Write-Host "如果仍然無法載入，請提供控制台的錯誤訊息。" -ForegroundColor Yellow
Write-Host ""
