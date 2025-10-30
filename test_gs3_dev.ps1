#!/usr/bin/env pwsh
# GS3 開發環境測試啟動腳本 (PowerShell 版本)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GS3 開發環境連接測試" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "環境配置:" -ForegroundColor Green
Write-Host "- 伺服器: dev-gs3.iplaystar.net:1109"
Write-Host "- 帳號: DEVMODE"
Write-Host "- 密碼: TEST9"
Write-Host ""
Write-Host "測試方式:" -ForegroundColor Green
Write-Host ""
Write-Host "1. 標準測試 (按 Enter 開始)" -ForegroundColor Yellow
Write-Host "   URL: http://localhost:7456/?dev_mode=true"
Write-Host ""
Write-Host "2. 自訂帳密測試" -ForegroundColor Yellow
Write-Host "   URL: http://localhost:7456/?dev_mode=true&agent_account=DEVMODE&agent_password=TEST9"
Write-Host ""
Write-Host "3. 開啟 WebSocket 測試工具" -ForegroundColor Yellow
Write-Host "   文件: test_gs3_websocket.html"
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "按 Enter 開始測試..." -ForegroundColor Magenta
Read-Host

# 測試網路連接
Write-Host ""
Write-Host "🔍 測試網路連接..." -ForegroundColor Cyan

$connTest = Test-NetConnection -ComputerName dev-gs3.iplaystar.net -Port 1109 -WarningAction SilentlyContinue
if ($connTest.TcpTestSucceeded) {
    Write-Host "✅ 網路連接成功: dev-gs3.iplaystar.net:1109" -ForegroundColor Green
} else {
    Write-Host "❌ 網路連接失敗: dev-gs3.iplaystar.net:1109" -ForegroundColor Red
    Write-Host "   請檢查防火牆和網路設置" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 在瀏覽器中打開遊戲..." -ForegroundColor Cyan

# 在默認瀏覽器中打開
Start-Process "http://localhost:7456/?dev_mode=true"

Write-Host ""
Write-Host "✅ 遊戲已在瀏覽器中打開" -ForegroundColor Green
Write-Host ""
Write-Host "檢查清單:" -ForegroundColor Green
Write-Host "  □ 瀏覽器開發工具 (F12) 打開"
Write-Host "  □ Console 標籤選中"
Write-Host "  □ 查看是否有連接成功的日誌"
Write-Host "  □ 查看代理商認證日誌"
Write-Host ""
Write-Host "預期日誌:" -ForegroundColor Yellow
Write-Host "  [ProtoConsole] 🔧 開發模式：連到 GS3 開發伺服器"
Write-Host "  [DEBUG] WebSocket URL: ws://dev-gs3.iplaystar.net:1109/slot"
Write-Host "  [CreateSocket] 🔌 Creating WebSocket connection"
Write-Host "  [ProtoConsole] 🔐 開發模式登入：DEVMODE / TEST9"
Write-Host ""
Write-Host "故障排除:" -ForegroundColor Yellow
Write-Host "  如連接失敗，請檢查:"
Write-Host "  1. 網路連接到 dev-gs3.iplaystar.net:1109"
Write-Host "  2. WebSocket 路徑是否正確 (/slot, /ws, 等)"
Write-Host "  3. 代理商帳密是否正確 (DEVMODE / TEST9)"
Write-Host "  4. Protobuf 協議版本是否匹配"
Write-Host ""
Write-Host "📖 查看詳細文檔: docs/GS3-Dev-Environment-Testing.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "按 Enter 繼續或查看其他選項..." -ForegroundColor Magenta
Read-Host

Write-Host ""
Write-Host "🔧 其他測試選項:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 打開 WebSocket 測試工具"
Write-Host "2. 查看測試文檔"
Write-Host "3. 測試其他路徑"
Write-Host "4. 退出"
Write-Host ""
$choice = Read-Host "選擇 (1-4)"

switch ($choice) {
    "1" {
        Write-Host "打開 WebSocket 測試工具..." -ForegroundColor Cyan
        Start-Process "c:\projects\game152Dev\test_gs3_websocket.html"
    }
    "2" {
        Write-Host "打開測試文檔..." -ForegroundColor Cyan
        & "c:\projects\game152Dev\docs\GS3-Dev-Environment-Testing.md" | Start-Process
    }
    "3" {
        Write-Host ""
        Write-Host "測試其他路徑:" -ForegroundColor Cyan
        Write-Host "1. 測試 /ws 路徑"
        Write-Host "2. 測試 / 根路徑"
        Write-Host "3. 測試所有路徑"
        Write-Host ""
        $pathChoice = Read-Host "選擇 (1-3)"
        
        switch ($pathChoice) {
            "1" {
                Start-Process "http://localhost:7456/?dev_mode=true"
                Write-Host "在 Console 中執行: new WebSocket('ws://dev-gs3.iplaystar.net:1109/ws')" -ForegroundColor Yellow
            }
            "2" {
                Write-Host "在 Console 中執行: new WebSocket('ws://dev-gs3.iplaystar.net:1109/')" -ForegroundColor Yellow
            }
            "3" {
                Write-Host "打開 WebSocket 測試工具..." -ForegroundColor Cyan
                Start-Process "c:\projects\game152Dev\test_gs3_websocket.html"
            }
        }
    }
    "4" {
        Write-Host "退出。" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host "無效選擇。" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ 完成" -ForegroundColor Green
