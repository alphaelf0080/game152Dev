@echo off
chcp 65001 >nul
title 前端重新編譯助手

echo.
echo ============================================================
echo 🎮 前端重新編譯助手
echo ============================================================
echo.
echo ✅ 準備工作已完成:
echo    - Cocos Creator 已關閉
echo    - 快取已清除
echo    - 代碼已修改
echo.
echo ============================================================
echo.
echo 📋 接下來請執行以下步驟:
echo.
echo 1. 開啟 Cocos Creator
echo    - 從桌面或開始選單開啟
echo    - 或開啟專案: C:\projects\game152Dev\pss-on-00152
echo.
echo 2. 等待專案載入 (5-10 分鐘)
echo    - 等待進度條完成
echo    - 確保無錯誤訊息
echo.
echo 3. Build 專案
echo    - Project ^> Build... (或 Ctrl+Shift+B)
echo    - Platform: Web Desktop
echo    - 點擊 Build 按鈕
echo.
echo 4. 等待編譯完成 (3-5 分鐘)
echo    - 看到 "Build succeeded!"
echo.
echo ============================================================
echo.
echo 📖 詳細指引已在瀏覽器開啟
echo.
pause
echo.
echo 是否要啟動 Spin Server 進行測試? (Y/N)
set /p choice=請選擇: 

if /i "%choice%"=="Y" (
    echo.
    echo 🚀 正在啟動 Spin Server...
    cd /d C:\projects\game152Dev\gameServer
    start "Spin Server" cmd /k "python spin_server.py"
    timeout /t 3 >nul
    echo.
    echo ✅ Spin Server 已啟動
    echo.
    echo 🎮 在瀏覽器中開啟: http://localhost:7456/?localServer=true
    echo.
    echo 預期結果:
    echo   ✅ Console 顯示: [DEBUG] bksend - sending binary data
    echo   ✅ 登入成功
    echo   ✅ Reel 初始化完成
    echo.
    echo 如果看到 "sending JSON string" 表示編譯未生效
    echo 請清除瀏覽器快取並重新整理 (Ctrl+Shift+Delete, Ctrl+F5)
    echo.
    pause
) else (
    echo.
    echo 編譯完成後，手動執行以下命令啟動 Spin Server:
    echo   cd C:\projects\game152Dev\gameServer
    echo   python spin_server.py
    echo.
    echo 然後開啟: http://localhost:7456/?localServer=true
    echo.
    pause
)
