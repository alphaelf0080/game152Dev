@echo off
REM GS3 開發環境測試啟動腳本

echo ========================================
echo GS3 開發環境連接測試
echo ========================================
echo.
echo 環境配置:
echo - 伺服器: dev-gs3.iplaystar.net:1109
echo - 帳號: DEVMODE
echo - 密碼: TEST9
echo.
echo 測試方式:
echo.
echo 1. 標準測試 (按 Enter 或等待 5 秒)
echo    URL: http://localhost:7456/?dev_mode=true
echo.
echo 2. 自訂帳密測試
echo    URL: http://localhost:7456/?dev_mode=true^&agent_account=DEVMODE^&agent_password=TEST9
echo.
echo 3. 開啟 WebSocket 測試工具
echo    文件: test_gs3_websocket.html
echo.
echo ========================================
echo.

timeout /t 5 /nobreak

REM 嘗試在默認瀏覽器中打開
start http://localhost:7456/?dev_mode=true

echo.
echo ✅ 遊戲已在瀏覽器中打開
echo.
echo 檢查清單:
echo   □ 瀏覽器開發工具 (F12) 打開
echo   □ Console 標籤選中
echo   □ 查看是否有連接成功的日誌
echo   □ 查看代理商認證日誌
echo.
echo 預期日誌:
echo   [ProtoConsole] 🔧 開發模式：連到 GS3 開發伺服器
echo   [DEBUG] WebSocket URL: ws://dev-gs3.iplaystar.net:1109/slot
echo   [CreateSocket] 🔌 Creating WebSocket connection
echo   [ProtoConsole] 🔐 開發模式登入：DEVMODE / TEST9
echo.
echo 故障排除:
echo   如連接失敗，請檢查:
echo   1. 網路連接到 dev-gs3.iplaystar.net:1109
echo   2. WebSocket 路徑是否正確 (/slot, /ws, 等)
echo   3. 代理商帳密是否正確
echo   4. Protobuf 協議版本是否匹配
echo.
pause
