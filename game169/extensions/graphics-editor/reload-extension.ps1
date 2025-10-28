# Graphics Editor 擴展重載腳本
Write-Host "=== Graphics Editor 擴展診斷與重載 ===" -ForegroundColor Cyan

# 1. 檢查編譯狀態
Write-Host "`n[步驟 1] 檢查編譯文件..." -ForegroundColor Yellow
$jsFile = "dist\panels\default.js"
if (Test-Path $jsFile) {
    $fileInfo = Get-Item $jsFile
    Write-Host "✓ 文件存在: $($fileInfo.FullName)" -ForegroundColor Green
    Write-Host "  最後修改: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
    Write-Host "  文件大小: $([math]::Round($fileInfo.Length/1KB, 2)) KB" -ForegroundColor Gray
    
    # 檢查 rectRadius 相關代碼
    $rectRadiusCount = (Select-String -Path $jsFile -Pattern "rectRadius" | Measure-Object).Count
    Write-Host "  rectRadius 出現次數: $rectRadiusCount" -ForegroundColor Gray
    
    if ($rectRadiusCount -ge 5) {
        Write-Host "  ✓ 圓角矩形功能代碼已包含" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 圓角矩形功能代碼不完整" -ForegroundColor Red
    }
} else {
    Write-Host "✗ 編譯文件不存在，需要先編譯" -ForegroundColor Red
    exit 1
}

# 2. 重新編譯
Write-Host "`n[步驟 2] 重新編譯擴展..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 編譯成功" -ForegroundColor Green
} else {
    Write-Host "✗ 編譯失敗" -ForegroundColor Red
    exit 1
}

# 3. 檢查 Cocos Creator 項目緩存
Write-Host "`n[步驟 3] 檢查項目緩存..." -ForegroundColor Yellow
$projectRoot = "..\.."
$cacheDirectories = @("library", "temp", "local")

foreach ($dir in $cacheDirectories) {
    $cachePath = Join-Path $projectRoot $dir
    if (Test-Path $cachePath) {
        $size = (Get-ChildItem $cachePath -Recurse -File | Measure-Object -Property Length -Sum).Sum
        Write-Host "  $dir 目錄大小: $([math]::Round($size/1MB, 2)) MB" -ForegroundColor Gray
    } else {
        Write-Host "  $dir 目錄不存在" -ForegroundColor Gray
    }
}

# 4. 給出操作指示
Write-Host "`n[步驟 4] 接下來的操作:" -ForegroundColor Yellow
Write-Host "  1. 在 Cocos Creator 中打開「擴展管理器」" -ForegroundColor White
Write-Host "     菜單 → 擴展 → 擴展管理器" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. 找到「Graphics Editor」擴展" -ForegroundColor White
Write-Host "     點擊右側的「重新載入」按鈕（刷新圖標 🔄）" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. 重新打開 Graphics Editor 面板" -ForegroundColor White
Write-Host "     菜單 → 擴展 → Graphics Editor" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. 測試功能:" -ForegroundColor White
Write-Host "     - 檢查是否有「圓角:」輸入框" -ForegroundColor Gray
Write-Host "     - 設置圓角值為 0，繪製普通矩形" -ForegroundColor Gray
Write-Host "     - 設置圓角值為 10-20，繪製圓角矩形" -ForegroundColor Gray
Write-Host "     - 測試中鍵平移功能" -ForegroundColor Gray
Write-Host "     - 測試其他工具（圓形、線條）" -ForegroundColor Gray

Write-Host "`n=== 如果問題仍然存在 ===" -ForegroundColor Cyan
Write-Host "執行以下命令清除緩存（需要關閉 Cocos Creator）:" -ForegroundColor Yellow
Write-Host "  .\clear-cache.ps1" -ForegroundColor White

Write-Host "`n✓ 診斷完成" -ForegroundColor Green
