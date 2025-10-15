#!/bin/bash
# RampColorShader 中文化 - Cocos Creator 快取清理腳本
# 使用方法: bash clear-cocos-cache.sh

echo "🧹 開始清理 Cocos Creator 快取..."
echo ""

# 設定專案路徑
PROJECT_PATH="/Users/alpha/Documents/projects/game152Dev/game169"

# 檢查專案是否存在
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ 錯誤：找不到專案目錄"
    echo "   路徑: $PROJECT_PATH"
    exit 1
fi

cd "$PROJECT_PATH"

echo "📁 專案路徑: $PROJECT_PATH"
echo ""

# 清理快取目錄
echo "🗑️  清理快取目錄..."

if [ -d "library" ]; then
    echo "   - 刪除 library/"
    rm -rf library/
fi

if [ -d "temp" ]; then
    echo "   - 刪除 temp/"
    rm -rf temp/
fi

if [ -d "local" ]; then
    echo "   - 刪除 local/"
    rm -rf local/
fi

if [ -d "build" ]; then
    echo "   - 刪除 build/ (可選)"
    # rm -rf build/  # 取消註解以刪除 build 目錄
fi

echo ""
echo "✅ 快取清理完成！"
echo ""
echo "📋 下一步："
echo "   1. 開啟 Cocos Creator"
echo "   2. 打開 game169 專案"
echo "   3. 等待重新編譯（3-5 分鐘）"
echo "   4. 檢查 RampColorShader 材質的混合模式選單"
echo ""
echo "🎯 預期結果："
echo "   混合模式下拉選單應顯示中文選項："
echo "   正常、正片疊底、濾色、疊加、變暗、變亮..."
echo ""
