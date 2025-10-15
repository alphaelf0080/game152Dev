# RampColorShader 中文化驗證指南

## ✅ 確認：代碼已修改

經過檢查，`RampColorShader.effect` 文件中的混合模式**已經成功改為繁體中文**：

```yaml
blendMode: { 
  value: 0, 
  editor: { 
    type: enum, 
    enumList: [
      '正常',      # 0
      '正片疊底',  # 1
      '濾色',      # 2
      '疊加',      # 3
      '變暗',      # 4
      '變亮',      # 5
      '顏色減淡',  # 6
      '顏色加深',  # 7
      '強光',      # 8
      '柔光',      # 9
      '差值',      # 10
      '排除',      # 11
      '色相',      # 12
      '飽和度',    # 13
      '顏色',      # 14
      '明度'       # 15
    ], 
    displayName: '混合模式' 
  } 
}
```

**Git 提交**: `453a587` (feat: RampColorShader 混合模式中文化)  
**推送狀態**: ✅ 已推送到 GitHub

---

## 🔍 為什麼在 Cocos Creator 中看不到中文？

### 可能的原因

#### 1. **Cocos Creator 快取問題** ⭐ 最常見
Cocos Creator 會快取 shader 編譯結果，需要強制重新編譯。

#### 2. **材質使用舊版本**
材質可能參考了舊的 shader 版本。

#### 3. **編輯器未重新載入**
編輯器可能需要完全重啟才能看到更改。

---

## 🔧 解決步驟

### 方法 1: 強制重新編譯（推薦）⭐

1. **關閉 Cocos Creator**
   
2. **清除快取目錄**
   ```bash
   cd /Users/alpha/Documents/projects/game152Dev/game169
   rm -rf library/
   rm -rf temp/
   rm -rf local/
   ```

3. **重新打開專案**
   - 開啟 Cocos Creator
   - 重新打開 game169 專案
   - 等待重新編譯完成（3-5 分鐘）

4. **驗證效果**
   - 選擇使用 RampColorShader 材質的節點
   - 在 Inspector 面板查看「混合模式」下拉選單
   - 應該顯示中文選項

---

### 方法 2: 重新導入 Shader

在 Cocos Creator 中：

1. **找到 Shader 文件**
   - Assets 面板
   - 導航到 `assets/effect/RampColorShader.effect`

2. **右鍵點擊該文件**
   - 選擇「重新導入」或「Reimport」

3. **等待編譯完成**
   - 觀察 Console 面板
   - 確認沒有錯誤訊息

4. **刷新材質**
   - 選擇使用該 shader 的材質
   - 在 Inspector 中重新選擇 Effect
   - 先選擇其他 effect，再選回 RampColorShader

---

### 方法 3: 重新創建材質

1. **創建新材質**
   - 右鍵點擊 `assets/material/` 目錄
   - 選擇「創建 → Material」
   - 命名為 `RampColorShader_Test.mtl`

2. **設定 Effect**
   - 選擇新材質
   - 在 Inspector 中的 Effect 下拉選單
   - 選擇 `RampColorShader`

3. **檢查混合模式**
   - 查看「混合模式」屬性
   - 應該顯示中文選項

4. **應用到節點**
   - 將新材質應用到 Sprite 節點
   - 測試各種混合模式

---

### 方法 4: 完全重啟編輯器

1. **儲存所有變更**
2. **完全關閉 Cocos Creator**（確保進程完全結束）
3. **重新啟動**
4. **重新打開專案**

---

## 🧪 驗證清單

完成上述步驟後，請驗證：

### ✅ 在編輯器中檢查

- [ ] Assets 面板可以看到 `RampColorShader.effect`
- [ ] 選擇材質後，Inspector 顯示完整的屬性面板
- [ ] 「混合模式」標籤顯示為**中文**
- [ ] 點擊下拉選單，可以看到 16 個**中文選項**
- [ ] 選項順序正確（正常、正片疊底、濾色...）

### ✅ 功能測試

- [ ] 選擇不同的混合模式，效果正常顯示
- [ ] 調整 Ramp 強度，效果變化正常
- [ ] 沒有編譯錯誤或警告
- [ ] Console 沒有錯誤訊息

---

## 🐛 如果還是看不到中文

### 檢查 1: 確認文件內容

在終端中執行：
```bash
cd /Users/alpha/Documents/projects/game152Dev
grep "enumList" game169/assets/effect/RampColorShader.effect
```

應該看到：
```
enumList: ['正常', '正片疊底', '濾色', '疊加', ...
```

### 檢查 2: 確認 Cocos Creator 版本

確認您使用的是 **Cocos Creator 3.8.x**：
- 打開 Cocos Creator
- 選單：幫助 → 關於
- 確認版本號

**注意**: 如果版本太舊（< 3.6），可能不支援中文屬性名稱。

### 檢查 3: 查看 Console 錯誤

在 Cocos Creator 中：
1. 打開 Console 面板（快捷鍵：Ctrl/Cmd + 0）
2. 查找紅色錯誤訊息
3. 特別注意 shader 編譯錯誤

常見錯誤訊息：
```
Failed to compile effect...
Syntax error in shader...
Invalid property name...
```

### 檢查 4: 材質文件版本

查看材質文件（.mtl）：
```bash
cat game169/assets/material/testMtr.mtl
```

確認它引用的是正確的 effect：
```json
{
  "__type__": "cc.Material",
  "_effectAsset": {
    "__uuid__": "...",  // 應該指向 RampColorShader
  }
}
```

---

## 📸 預期顯示效果

在 Inspector 面板中，您應該看到：

```
┌────────────────────────────────┐
│ RampColorShader                │
├────────────────────────────────┤
│                                │
│ [Ramp 紋理]  [選擇]            │
│ ☐ 使用 Ramp 紋理               │
│                                │
│ 起始顏色:    ■ [色板]          │
│ 結束顏色:    ■ [色板]          │
│                                │
│ Ramp 方向:   [水平 ▼]          │
│ Ramp 中心點: 0.5, 0.5          │
│ UV 縮放:     1.0, 1.0          │
│ UV 偏移:     0.0, 0.0          │
│ Ramp 範圍:   0.0, 1.0          │
│                                │
│ 亮度調整:    [━━●━━━━] 0.0     │
│ 對比度:      [━━●━━━━] 1.0     │
│ 飽和度:      [━━●━━━━] 1.0     │
│                                │
│ 混合模式:    [正常 ▼]    ✓     │  ← 這裡應該是中文
│   ├─ 正常                      │
│   ├─ 正片疊底                  │
│   ├─ 濾色                      │
│   ├─ 疊加                      │
│   ├─ 變暗                      │
│   ├─ 變亮                      │
│   ├─ 顏色減淡                  │
│   ├─ 顏色加深                  │
│   ├─ 強光                      │
│   ├─ 柔光                      │
│   ├─ 差值                      │
│   ├─ 排除                      │
│   ├─ 色相                      │
│   ├─ 飽和度                    │
│   ├─ 顏色                      │
│   └─ 明度                      │
│                                │
│ Ramp 強度:   [━━●━━━━] 1.0     │
│                                │
│ ☐ 反轉 Ramp                    │
│ 平滑度:      [━━●━━━━] 0.0     │
└────────────────────────────────┘
```

---

## 🆘 緊急方案：手動檢查文件

如果上述方法都不行，請直接打開文件確認：

```bash
# 1. 打開文件
open -a "Visual Studio Code" /Users/alpha/Documents/projects/game152Dev/game169/assets/effect/RampColorShader.effect

# 2. 搜索 "enumList"
# 3. 確認內容是中文
```

或在終端查看：
```bash
cd /Users/alpha/Documents/projects/game152Dev
cat game169/assets/effect/RampColorShader.effect | grep -A 1 "enumList"
```

應該輸出：
```
enumList: ['正常', '正片疊底', '濾色', '疊加', '變暗', '變亮', '顏色減淡', '顏色加深', '強光', '柔光', '差值', '排除', '色相', '飽和度', '顏色', '明度']
```

---

## 💬 如果問題持續

請提供以下資訊：

1. **Cocos Creator 版本**
   ```
   例如：3.8.4
   ```

2. **當前看到的混合模式選項**
   ```
   例如：Normal, Multiply, Screen... (英文)
   或：正常、正片疊底、濾色... (中文)
   ```

3. **Console 錯誤訊息**（如果有）

4. **截圖**：Inspector 面板顯示的內容

---

## ✅ 成功標誌

當您看到以下情況，表示中文化成功：

- ✅ 下拉選單顯示「正常」而不是 "Normal"
- ✅ 選項包含「正片疊底」「濾色」等中文
- ✅ 總共有 16 個選項
- ✅ 選擇不同選項，效果正常工作

---

**最後更新**: 2025-10-15  
**文件狀態**: ✅ 已確認中文化  
**Git 狀態**: ✅ 已提交並推送  
**需要操作**: 重新編譯 Cocos Creator 專案
