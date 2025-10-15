# Bundle 配置問題診斷與解決指南

## 🚨 問題症狀
- Sprite 在編輯器正常，Web 預覽消失
- Console 顯示 Bundle 配置錯誤
- 特定路徑：`Jackpot/dynamic` 和 `res/common/ui3.0/currency`

## 🔍 問題原因
Bundle 配置 ID 無效導致資源載入失敗，這不是 Shader 問題！

## 🛠️ 解決方法

### 方法 1: 清除快取（最常見有效）
```bash
# 刪除以下目錄：
- game169/build/
- game169/library/
- game169/temp/
```

### 方法 2: 重新啟動編輯器
1. 完全關閉 Cocos Creator
2. 重新開啟專案
3. 等待重新編譯（可能需要幾分鐘）

### 方法 3: 檢查 Bundle 設定
1. **項目設置 → 項目數據 → 壓縮類型**
2. 檢查是否有無效的 Bundle 配置
3. 移除或修正無效配置

### 方法 4: 資源重新匯入
1. 右鍵點擊 `assets` 資料夾
2. 選擇 **"重新匯入資源"**
3. 等待完成

### 方法 5: 檢查路徑問題
Bundle 錯誤中的路徑：
- `db://assets/Jackpot/dynamic`
- `db://assets/res/common/ui3.0/currency`

確保這些路徑存在且無特殊字符。

## 🎯 測試步驟

### 步驟 1: 清除快取
```
刪除 build, library, temp 資料夾
```

### 步驟 2: 重啟編輯器
```
關閉 → 重開 → 等待編譯完成
```

### 步驟 3: 簡單測試
```
1. 創建新場景
2. 添加簡單 Sprite（不使用自定義 Material）
3. Web 預覽測試
4. 如果正常，再測試自定義 Material
```

### 步驟 4: 逐步測試
```
1. 先測試 WebSafeSprite.effect
2. 確認勾選 USE_TEXTURE
3. 使用簡單紋理（如白色方塊）
4. 避免使用 Jackpot 或 currency 路徑下的資源
```

## 📋 預防措施

### 1. 定期清理
```
每週清理一次 build, library, temp
```

### 2. 路徑管理
```
避免使用特殊字符
保持路徑簡潔
不要有空格或中文
```

### 3. Bundle 配置
```
謹慎修改 Bundle 設定
備份重要配置
測試後再提交
```

## 🚨 緊急解決方案

如果上述方法都無效：

### 1. 使用其他路徑的資源
暫時避免使用 `Jackpot/dynamic` 路徑下的資源

### 2. 創建測試場景
```typescript
// 創建最簡單的測試
@ccclass('SpriteTest')
export class SpriteTest extends Component {
    start() {
        // 使用內建資源創建 Sprite
        const node = new Node();
        const sprite = node.addComponent(Sprite);
        
        // 使用簡單紋理
        resources.load('texture/white', Texture2D, (err, texture) => {
            if (!err) {
                const sf = new SpriteFrame();
                sf.texture = texture;
                sprite.spriteFrame = sf;
                
                // 測試自定義 Material
                resources.load('materials/WebSafeSprite', Material, (err, mat) => {
                    if (!err) {
                        sprite.customMaterial = mat;
                    }
                });
            }
        });
        
        this.node.addChild(node);
    }
}
```

## 💡 重要提醒

這個問題**不是 Shader 語法問題**，而是：
1. **資源管理問題**
2. **Bundle 配置問題** 
3. **專案編譯問題**

解決 Bundle 問題後，你的 Shader 應該就能正常工作了！

## 🔧 下一步

1. **立即清除快取並重啟**
2. **使用簡單資源測試**
3. **確認問題解決後再使用複雜 Shader**

記住：先解決資源載入問題，再優化 Shader 功能！🎯