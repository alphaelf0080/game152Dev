# Cocos Creator 自動編譯腳本
# 用於編譯 pss-on-00152 專案

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎮 Cocos Creator 自動編譯腳本" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\projects\game152Dev\pss-on-00152"
$cocosCreatorPath = "C:\CocosCreator\Creator\3.8.5\CocosCreator.exe"

# 檢查專案路徑
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ 錯誤: 專案路徑不存在: $projectPath" -ForegroundColor Red
    exit 1
}

# 檢查 Cocos Creator 路徑
if (-not (Test-Path $cocosCreatorPath)) {
    Write-Host "⚠️ 警告: Cocos Creator 路徑可能不正確" -ForegroundColor Yellow
    Write-Host "   當前路徑: $cocosCreatorPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "請手動執行以下步驟:" -ForegroundColor Yellow
    Write-Host "1. 開啟 Cocos Creator" -ForegroundColor White
    Write-Host "2. 開啟專案: $projectPath" -ForegroundColor White
    Write-Host "3. 等待索引完成（5-10 分鐘）" -ForegroundColor White
    Write-Host "4. 選單: Project > Build..." -ForegroundColor White
    Write-Host "5. 平台: Web Desktop" -ForegroundColor White
    Write-Host "6. 點擊 Build 按鈕" -ForegroundColor White
    Write-Host "7. 等待編譯完成" -ForegroundColor White
    Write-Host ""
    
    # 嘗試尋找 Cocos Creator
    $possiblePaths = @(
        "C:\CocosCreator\Creator\3.8.5\CocosCreator.exe",
        "C:\CocosCreator\Creator\3.8.4\CocosCreator.exe",
        "C:\CocosCreator\Creator\3.8.3\CocosCreator.exe",
        "C:\Program Files\CocosCreator\CocosCreator.exe",
        "C:\Program Files (x86)\CocosCreator\CocosCreator.exe"
    )
    
    Write-Host "正在尋找 Cocos Creator..." -ForegroundColor Yellow
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            Write-Host "✅ 找到: $path" -ForegroundColor Green
            $cocosCreatorPath = $path
            break
        }
    }
    
    if (-not (Test-Path $cocosCreatorPath)) {
        Write-Host ""
        Write-Host "無法自動找到 Cocos Creator，請手動編譯。" -ForegroundColor Red
        Read-Host "按 Enter 鍵結束"
        exit 1
    }
}

Write-Host "📂 專案路徑: $projectPath" -ForegroundColor Green
Write-Host "🔧 Cocos Creator: $cocosCreatorPath" -ForegroundColor Green
Write-Host ""

# 啟動 Cocos Creator
Write-Host "🚀 正在啟動 Cocos Creator..." -ForegroundColor Cyan
Start-Process -FilePath $cocosCreatorPath -ArgumentList "--project", $projectPath

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✅ Cocos Creator 已啟動" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "請在 Cocos Creator 中執行以下步驟:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. ⏳ 等待專案索引完成（可能需要 5-10 分鐘）" -ForegroundColor White
Write-Host "   - 查看右下角的進度條" -ForegroundColor Gray
Write-Host "   - 等待所有資源載入完成" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🔨 開始編譯:" -ForegroundColor White
Write-Host "   - 選單: Project > Build..." -ForegroundColor Gray
Write-Host "   - 或按快捷鍵: Ctrl + Shift + B" -ForegroundColor Gray
Write-Host ""
Write-Host "3. ⚙️ 編譯設定:" -ForegroundColor White
Write-Host "   - Platform: Web Desktop" -ForegroundColor Gray
Write-Host "   - Build Path: 保持預設" -ForegroundColor Gray
Write-Host "   - Debug: 取消勾選（正式版）" -ForegroundColor Gray
Write-Host ""
Write-Host "4. ▶️ 點擊 'Build' 按鈕" -ForegroundColor White
Write-Host ""
Write-Host "5. ⏳ 等待編譯完成（可能需要 3-5 分鐘）" -ForegroundColor White
Write-Host "   - 查看 Console 輸出" -ForegroundColor Gray
Write-Host "   - 等待出現 'Build succeeded'" -ForegroundColor Gray
Write-Host ""
Write-Host "6. ✅ 編譯完成後:" -ForegroundColor White
Write-Host "   - 可以關閉 Cocos Creator" -ForegroundColor Gray
Write-Host "   - 啟動 Spin Server: cd gameServer; python spin_server.py" -ForegroundColor Gray
Write-Host "   - 測試遊戲: http://localhost:7456/?localServer=true" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# 等待用戶確認
Read-Host "編譯完成後按 Enter 鍵繼續測試"

Write-Host ""
Write-Host "🧪 準備測試環境..." -ForegroundColor Cyan

# 檢查 Spin Server 是否正在運行
$spinServerRunning = Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*spin*" }
if ($spinServerRunning) {
    Write-Host "✅ Spin Server 正在運行" -ForegroundColor Green
} else {
    Write-Host "⚠️ Spin Server 未運行，正在啟動..." -ForegroundColor Yellow
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd C:\projects\game152Dev\gameServer; python spin_server.py"
    Start-Sleep -Seconds 3
    Write-Host "✅ Spin Server 已啟動" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎮 測試遊戲" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "在瀏覽器中開啟: http://localhost:7456/?localServer=true" -ForegroundColor White
Write-Host ""
Write-Host "預期結果:" -ForegroundColor Yellow
Write-Host "  ✅ [DEBUG] bksend - sending binary data, byteLength: 29" -ForegroundColor White
Write-Host "  ✅ 後端收到 Protobuf 訊息" -ForegroundColor White
Write-Host "  ✅ 登入成功" -ForegroundColor White
Write-Host "  ✅ Reel 初始化完成" -ForegroundColor White
Write-Host ""
Write-Host "如果還是看到 'sending JSON string'，請:" -ForegroundColor Yellow
Write-Host "  1. 確認編譯已完成" -ForegroundColor White
Write-Host "  2. 清除瀏覽器快取 (Ctrl + Shift + Delete)" -ForegroundColor White
Write-Host "  3. 重新整理頁面 (Ctrl + F5)" -ForegroundColor White
Write-Host ""
