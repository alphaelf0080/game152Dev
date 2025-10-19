# 🔴 關鍵錯誤修復：a_texCoord 變量名損壞

## 問題發現
2025-10-19 修復了導致 shader 完全無法載入的致命錯誤

## 錯誤詳情

### 症狀
- Cocos Creator 報錯：`The "path" argument must be of type string...`
- Effect meta 文件：`"imported": false`
- Shader 無法編譯和導入

### 根本原因
**GLSL 變量名中混入中文字符**

```glsl
❌ 錯誤代碼：
in vec2 a_texCoo法rd;    // "法" 是錯誤的中文字符

✅ 正確代碼：
in vec2 a_texCoord;      // 正確的變量名
```

### 影響範圍
- **嚴重度**: 🔴 致命錯誤
- **影響**: 整個 shader 無法編譯
- **表現**: Cocos Creator 無法讀取 effect 文件

## 修復方案

### Commit 信息
- **Commit**: `f56a137`
- **日期**: 2025-10-19
- **描述**: Fix critical syntax error in a_texCoord

### 具體修改
```diff
- in vec2 a_texCoo法rd;
+ in vec2 a_texCoord;
```

## 為什麼會發生

### 可能原因
1. **輸入法問題**: 在英文輸入時不小心切換到中文
2. **複製貼上**: 從其他文件複製時帶入了錯誤字符
3. **編輯器問題**: 某些情況下字符編碼轉換錯誤

### 為什麼難以發現
1. **視覺相似**: "法" 混在英文中不易察覺
2. **位置隱蔽**: 在 vertex shader 的輸入聲明中
3. **錯誤信息混淆**: Cocos Creator 的錯誤提示不直接指向語法錯誤

## 檢測方法

### 1. 使用 grep 查找非 ASCII 字符
```bash
grep -n "[^[:ascii:]]" game169/assets/effect/SpriteUVRepeat.effect
```

### 2. 檢查特定中文字符
```bash
grep -n "法\|類\|變\|數" game169/assets/effect/SpriteUVRepeat.effect
```

### 3. 使用 hexdump 查看字節
```bash
hexdump -C game169/assets/effect/SpriteUVRepeat.effect | grep -i "texcoord"
```

## 預防措施

### 1. 編輯 Shader 文件時
- ✅ 確保輸入法處於英文模式
- ✅ 使用 VS Code 的語法高亮檢查
- ✅ 定期運行字符檢查腳本

### 2. Git Hooks
可以添加 pre-commit hook 檢查：
```bash
#!/bin/bash
# .git/hooks/pre-commit
for file in $(git diff --cached --name-only | grep "\.effect$"); do
  if grep -q "[^[:ascii:]]" "$file"; then
    echo "Error: Non-ASCII characters found in $file"
    exit 1
  fi
done
```

### 3. VS Code 設置
在 `.vscode/settings.json` 中添加：
```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false,
  "[glsl]": {
    "editor.detectIndentation": false
  }
}
```

## 驗證修復

### 1. 檢查文件編碼
```bash
file game169/assets/effect/SpriteUVRepeat.effect
# 應該顯示: UTF-8 Unicode text
```

### 2. 驗證無非 ASCII 字符
```bash
grep -P "[^\x00-\x7F]" game169/assets/effect/SpriteUVRepeat.effect | grep -v "^//"
# 應該只有註釋中的中文，代碼部分不應有輸出
```

### 3. Cocos Creator 測試
- 清除緩存：`rm -rf game169/library game169/temp`
- 重新打開項目
- 檢查 effect.meta 文件：`"imported": true`

## 時間線

| 時間 | 事件 |
|------|------|
| 2025-10-19 13:56 | 添加 UV Scale 功能 |
| 2025-10-19 14:01 | 發現 shader 無法載入 |
| 2025-10-19 14:15 | 嘗試修復對齊問題（未解決）|
| 2025-10-19 14:30 | 嘗試 vec2 → vec4（未解決）|
| 2025-10-19 15:00 | **發現 a_texCoord 損壞** |
| 2025-10-19 15:05 | 修復並驗證成功 |

## 教訓總結

### 🎯 關鍵教訓
1. **GLSL 語法錯誤可能非常隱蔽**
2. **Cocos Creator 的錯誤信息有時不夠明確**
3. **使用 git diff 查看所有更改非常重要**
4. **字符編碼問題需要專門的檢測工具**

### 🔧 最佳實踐
1. 每次編輯後運行 `git diff` 檢查意外更改
2. 使用字符編碼檢查工具
3. 保持輸入法處於正確模式
4. 定期清理和驗證代碼

## 參考命令

### 快速診斷腳本
```bash
#!/bin/bash
# check-shader.sh
echo "檢查 Shader 文件..."
echo "1. 查找非 ASCII 字符："
grep -n "[^[:ascii:]]" game169/assets/effect/SpriteUVRepeat.effect | grep -v "//" || echo "  ✅ 無問題"

echo "2. 檢查 meta 文件導入狀態："
grep "imported" game169/assets/effect/SpriteUVRepeat.effect.meta

echo "3. 驗證關鍵變量："
grep "a_texCoord\|v_uv0\|v_uv1" game169/assets/effect/SpriteUVRepeat.effect | head -5
```

## 相關文件
- **修復 Commit**: `f56a137`
- **Shader 文件**: `game169/assets/effect/SpriteUVRepeat.effect`
- **之前的嘗試**: commits `0524b0c`, `437cd99`, `c40bd46`

## 結論

這是一個**低級但致命的錯誤**，由字符編碼問題導致。修復很簡單，但發現過程曲折，因為錯誤信息沒有直接指向問題所在。

**總結**: 當遇到 shader 無法載入時，除了檢查 GLSL 語法和對齊問題外，還應該檢查是否有意外的字符編碼問題。
