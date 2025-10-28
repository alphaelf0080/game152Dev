# 清除 Cocos Creator 項目緩存
Write-Host "=== 清除 Cocos Creator 緩存 ===" -ForegroundColor Cyan
Write-Host "警告: 請確保已經關閉 Cocos Creator！" -ForegroundColor Red
Write-Host ""

$confirmation = Read-Host "確定要清除緩存嗎？(y/N)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "已取消操作" -ForegroundColor Yellow
    exit 0
}

$projectRoot = "..\.."
$cacheDirectories = @("library", "temp", "local")

Write-Host "`n開始清除緩存..." -ForegroundColor Yellow

foreach ($dir in $cacheDirectories) {
    $cachePath = Join-Path $projectRoot $dir
    if (Test-Path $cachePath) {
        Write-Host "  清除 $dir..." -ForegroundColor Gray
        Remove-Item -Path $cachePath -Recurse -Force -ErrorAction SilentlyContinue
        if (-not (Test-Path $cachePath)) {
            Write-Host "  ✓ $dir 已清除" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $dir 清除失敗（可能有文件被占用）" -ForegroundColor Red
        }
    } else {
        Write-Host "  - $dir 不存在，跳過" -ForegroundColor Gray
    }
}

Write-Host "`n✓ 緩存清除完成" -ForegroundColor Green
Write-Host "接下來:" -ForegroundColor Yellow
Write-Host "  1. 重新啟動 Cocos Creator" -ForegroundColor White
Write-Host "  2. 打開項目" -ForegroundColor White
Write-Host "  3. 在擴展管理器中重新載入 Graphics Editor" -ForegroundColor White
Write-Host "  4. 測試功能是否正常" -ForegroundColor White
