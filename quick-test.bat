@echo off
chcp 65001 >nul
title 快速啟動測試

echo.
echo ============================================================
echo 🎮 快速啟動測試 - 使用 Cocos Preview 自動編譯
echo ============================================================
echo.
echo ✅ Cocos Creator 會在 Preview 時自動編譯 TypeScript
echo ✅ 不需要手動 Build！
echo.
echo ============================================================
echo.

REM 檢查 Spin Server 是否已經在運行
tasklist /FI "WINDOWTITLE eq Spin Server*" 2>NUL | find /I "python.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Spin Server 已在運行
) else (
    echo 🚀 正在啟動 Spin Server...
    cd /d "%~dp0gameServer"
    start "Spin Server" cmd /k "python spin_server.py"
    timeout /t 3 >nul
    echo ✅ Spin Server 已啟動
)

echo.
echo ============================================================
echo 📋 接下來請執行：
echo ============================================================
echo.
echo 1. 開啟 Cocos Creator
echo    - 打開專案: %~dp0pss-on-00152
echo.
echo 2. 點擊 Preview 按鈕 (或按 Ctrl+P)
echo    - TypeScript 會自動編譯
echo    - 瀏覽器會自動開啟
echo.
echo 3. 在瀏覽器 URL 加上參數:
echo    http://localhost:7456/?localServer=true
echo.
echo 4. 檢查 Console (F12):
echo    ✅ 應該看到: [DEBUG] bksend - sending binary data
echo    ❌ 不應該看到: sending JSON string
echo.
echo ============================================================
echo.
echo 💡 提示:
echo    - Preview 會自動編譯，不需要手動 Build
echo    - 修改代碼後，儲存並重新整理瀏覽器即可
echo    - 如果看到 JSON string，清除瀏覽器快取 (Ctrl+Shift+Delete)
echo.
echo ============================================================
echo.
pause

REM 詢問是否要開啟測試 URL
echo.
echo 是否要在瀏覽器開啟測試 URL? (Y/N)
set /p openBrowser=請選擇: 

if /i "%openBrowser%"=="Y" (
    echo.
    echo 🌐 正在開啟瀏覽器...
    start http://localhost:7456/?localServer=true
    echo.
    echo ✅ 瀏覽器已開啟
    echo.
    echo 📝 檢查 Console (F12):
    echo    - 按 F12 開啟開發者工具
    echo    - 切換到 Console 標籤
    echo    - 查看日誌訊息
    echo.
    echo 預期結果:
    echo    ✅ [DEBUG] bksend - sending binary data, byteLength: 29
    echo    ✅ 📨 收到 Protobuf 訊息 (後端)
    echo    ✅ 登入成功
    echo    ✅ Reel 初始化完成
    echo.
) else (
    echo.
    echo 請手動在瀏覽器開啟:
    echo http://localhost:7456/?localServer=true
    echo.
)

echo.
echo ============================================================
echo 📚 詳細文檔: docs\Auto-Compile-Guide.md
echo ============================================================
echo.
pause
