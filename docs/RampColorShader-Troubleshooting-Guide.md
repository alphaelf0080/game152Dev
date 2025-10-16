# RampColorShader 問題診斷指南

## 🔍 問題診斷流程

### 步驟 1: 確認當前狀態

請回答以下問題:

1. **Sprite 類型**
   - [ ] Simple (標準 1x1)
   - [ ] Sliced (九宮格)
   - [ ] Tiled (平鋪重複)
   - [ ] Filled (填充)

2. **Ramp 設置**
   - RAMP_DIRECTION: ____ (0=水平, 1=垂直, 2=圓形, 3=徑向, 4=矩形內嵌, 5=矩形外擴)
   - tilingOffset: [____, ____, ____, ____]
   - colorStart: [____, ____, ____, ____]
   - colorEnd: [____, ____, ____, ____]

3. **問題描述**
   - [ ] Ramp 效果重複顯示(應該是單一漸層但重複了多次)
   - [ ] Ramp 效果位置錯誤(不在預期的位置)
   - [ ] Ramp 效果完全不顯示
   - [ ] Ramp 效果被 Sprite 的 Tiled Type 影響
   - [ ] 其他: _______________

---

## 🎯 常見問題與解決方案

### 問題 1: Sprite 是 Tiled 時,Ramp 效果也跟著重複

**症狀:**
- 設置 Sprite.Type = TILED (例如 3x3)
- Ramp 效果也重複了 3x3 次
- 期望: Ramp 應該是單一漸層,覆蓋整個 Sprite

**原因:**
當前的 shader 使用 `uv0` (即 `a_texCoord`) 來計算 Ramp 座標,而 `a_texCoord` 在 Tiled 模式下範圍會是 0-3 (如果是 3x3)。

**解決方案 A: 使用位置座標 (推薦)**

需要修改 vertex shader,使用 `a_position` 而不是 `a_texCoord`:

```glsl
// 在 vertex shader 中添加新的 varying
out vec2 uv0;        // 用於紋理採樣
out vec2 normalizedUV;  // 用於 Ramp 計算

vec4 vert () {
    // ... 現有代碼 ...
    
    uv0 = a_texCoord;  // 保持原樣
    
    // 新增: 使用 position 計算標準化 UV (範圍 0-1)
    // a_position 範圍是 [-0.5, 0.5],轉換到 [0, 1]
    normalizedUV = a_position.xy + vec2(0.5, 0.5);
    
    return pos;
}
```

然後在 fragment shader 中:

```glsl
in vec2 uv0;           // 用於紋理採樣
in vec2 normalizedUV;  // 用於 Ramp 計算

vec4 frag () {
    // ... 紋理採樣使用 uv0 ...
    
    // Ramp 計算使用 normalizedUV (不受 Tiled Type 影響)
    float rampCoord = calculateRampCoord(normalizedUV);
    
    // ...
}
```

**解決方案 B: 使用 fract() 標準化**

如果不想修改太多,可以在 `calculateRampCoord` 開頭添加:

```glsl
float calculateRampCoord(vec2 uv) {
    // 將 UV 標準化到 0-1 範圍 (處理 Tiled 情況)
    vec2 normalizedUV = fract(uv);
    
    // 然後使用 normalizedUV 進行計算
    vec2 tiledUV = fract(normalizedUV * tilingOffset.xy) + tilingOffset.zw;
    // ...
}
```

**注意:** 方案 B 會導致每個 tile 都有一個完整的 0-1 UV,可能不是您想要的。

---

### 問題 2: tilingOffset 影響了 Sprite 紋理

**症狀:**
- 調整 tilingOffset 時,不僅 Ramp 效果變化
- Sprite 的紋理顯示也變了

**原因:**
當前代碼可能在主紋理採樣時使用了 tilingOffset。

**解決方案:**

確認 fragment shader 中的紋理採樣邏輯:

```glsl
vec4 frag () {
    vec4 o = vec4(1, 1, 1, 1);
    
    #if USE_TEXTURE
      // Sprite 紋理 - 應該使用原始 uv0,不受 tilingOffset 影響
      o *= CCSampleWithAlphaSeparated(cc_spriteTexture, uv0);
    #endif
    
    // 主紋理 - 也應該使用 uv0
    if (useMainTexture > 0.5) {
      // ❌ 錯誤寫法:
      // vec2 mainUV = fract(uv0 * tilingOffset.xy) + tilingOffset.zw;
      
      // ✅ 正確寫法:
      vec4 mainTexColor = texture(mainTexture, uv0);
      o.rgb *= mainTexColor.rgb;
      o.a *= mainTexColor.a;
    }
    
    // Ramp 效果 - 只有這裡使用 tilingOffset
    float rampCoord = calculateRampCoord(uv0);  // tilingOffset 在函數內部應用
    
    // ...
}
```

---

### 問題 3: Ramp 完全不顯示

**檢查清單:**

1. **確認 Ramp 強度**
   ```typescript
   material.setProperty('rampIntensity', 1.0);  // 應該 > 0
   ```

2. **確認顏色設置**
   ```typescript
   // 兩個顏色應該不同,才能看到漸層
   material.setProperty('colorStart', new Color(255, 0, 0, 255));
   material.setProperty('colorEnd', new Color(0, 0, 255, 255));
   ```

3. **確認混合模式**
   ```typescript
   // 確認 BLEND_MODE 設置正確
   // 0 = Normal(正常混合)
   ```

4. **確認 useRampTexture**
   ```typescript
   material.setProperty('useRampTexture', 0.0);  // 0 = 使用顏色漸變
   ```

5. **調試: 直接輸出 Ramp 顏色**
   
   臨時修改 fragment shader:
   ```glsl
   vec4 frag () {
       // 跳過所有紋理,直接顯示 Ramp
       float rampCoord = calculateRampCoord(uv0);
       vec3 rampColor = getRampColor(rampCoord);
       return vec4(rampColor, 1.0);  // 直接返回 Ramp 顏色
   }
   ```

---

### 問題 4: Ramp 方向錯誤

**確認 RAMP_DIRECTION 設置:**

| 值 | 方向 | 說明 |
|----|------|------|
| 0 | Horizontal | 從左到右的水平漸層 |
| 1 | Vertical | 從下到上的垂直漸層 |
| 2 | Circular | 從中心向外的圓形漸層 |
| 3 | Radial | 角度漸層(放射狀) |
| 4 | Rectangle Inset | 矩形內嵌(從外向內) |
| 5 | Rectangle Outset | 矩形外擴(從內向外) |

**測試代碼:**
```typescript
// 測試水平漸層
material.define('RAMP_DIRECTION', 0);
material.setProperty('colorStart', new Color(255, 0, 0, 255));  // 左側紅色
material.setProperty('colorEnd', new Color(0, 0, 255, 255));    // 右側藍色
```

---

## 🛠️ 快速診斷工具

### TypeScript 診斷腳本

```typescript
import { _decorator, Component, Sprite, Material, Color, Vec2, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RampShaderDiagnostic')
export class RampShaderDiagnostic extends Component {
    
    @property(Sprite)
    targetSprite: Sprite = null;
    
    start() {
        this.diagnose();
    }
    
    diagnose() {
        if (!this.targetSprite) {
            console.error('❌ No target sprite assigned');
            return;
        }
        
        console.log('=== RampShader 診斷報告 ===');
        
        // 1. Sprite 基本信息
        console.log(`\n1. Sprite 信息:`);
        console.log(`  - Type: ${this.getSpriteTypeName(this.targetSprite.type)}`);
        console.log(`  - SpriteFrame: ${this.targetSprite.spriteFrame?.name || 'null'}`);
        
        // 2. Material 信息
        const material = this.targetSprite.customMaterial;
        if (!material) {
            console.error('  ❌ No custom material assigned');
            return;
        }
        
        console.log(`\n2. Material 信息:`);
        console.log(`  - Effect: ${material.effectName}`);
        
        // 3. Ramp 參數
        console.log(`\n3. Ramp 參數:`);
        this.logProperty(material, 'tilingOffset');
        this.logProperty(material, 'colorStart');
        this.logProperty(material, 'colorEnd');
        this.logProperty(material, 'rampIntensity');
        this.logProperty(material, 'useRampTexture');
        
        // 4. 檢查常見問題
        console.log(`\n4. 問題檢查:`);
        this.checkCommonIssues(material);
    }
    
    private getSpriteTypeName(type: number): string {
        const types = ['SIMPLE', 'SLICED', 'TILED', 'FILLED'];
        return types[type] || 'UNKNOWN';
    }
    
    private logProperty(material: Material, propName: string) {
        try {
            const value = material.getProperty(propName);
            console.log(`  - ${propName}: ${this.valueToString(value)}`);
        } catch (e) {
            console.log(`  - ${propName}: [無法讀取]`);
        }
    }
    
    private valueToString(value: any): string {
        if (value instanceof Vec2) {
            return `Vec2(${value.x.toFixed(2)}, ${value.y.toFixed(2)})`;
        } else if (value instanceof Vec4) {
            return `Vec4(${value.x.toFixed(2)}, ${value.y.toFixed(2)}, ${value.z.toFixed(2)}, ${value.w.toFixed(2)})`;
        } else if (value instanceof Color) {
            return `Color(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
        } else if (typeof value === 'number') {
            return value.toFixed(2);
        }
        return String(value);
    }
    
    private checkCommonIssues(material: Material) {
        let hasIssue = false;
        
        // 檢查 1: rampIntensity 是否為 0
        const intensity = material.getProperty('rampIntensity') as number;
        if (intensity <= 0) {
            console.warn('  ⚠️ rampIntensity 為 0,效果不可見');
            hasIssue = true;
        }
        
        // 檢查 2: 顏色是否相同
        const colorStart = material.getProperty('colorStart') as Color;
        const colorEnd = material.getProperty('colorEnd') as Color;
        if (colorStart && colorEnd && colorStart.equals(colorEnd)) {
            console.warn('  ⚠️ colorStart 與 colorEnd 相同,看不到漸層');
            hasIssue = true;
        }
        
        // 檢查 3: Sprite 是否為 Tiled
        if (this.targetSprite.type === Sprite.Type.TILED) {
            console.warn('  ⚠️ Sprite Type 為 TILED,Ramp 效果可能會重複');
            console.log('     建議: 使用獨立 UV 系統來解決');
            hasIssue = true;
        }
        
        if (!hasIssue) {
            console.log('  ✅ 未發現常見問題');
        }
    }
    
    // 快速修復: 設置為標準測試配置
    @property
    applyTestConfig: boolean = false;
    
    update() {
        if (this.applyTestConfig) {
            this.applyTestConfig = false;
            this.setTestConfig();
        }
    }
    
    private setTestConfig() {
        const material = this.targetSprite?.customMaterial;
        if (!material) return;
        
        console.log('🔧 應用測試配置...');
        
        material.setProperty('tilingOffset', new Vec4(1, 1, 0, 0));
        material.setProperty('colorStart', new Color(255, 0, 0, 255));
        material.setProperty('colorEnd', new Color(0, 0, 255, 255));
        material.setProperty('rampIntensity', 1.0);
        material.setProperty('useRampTexture', 0.0);
        material.setProperty('brightness', 0.0);
        material.setProperty('contrast', 1.0);
        material.setProperty('saturation', 1.0);
        
        console.log('✅ 測試配置已應用 (紅→藍 水平漸層)');
        this.diagnose();
    }
}
```

### 使用方法

1. 將上述腳本保存為 `RampShaderDiagnostic.ts`
2. 添加到場景中的某個節點
3. 將您的 Sprite 拖到 `targetSprite` 屬性
4. 運行場景,查看控制台輸出

---

## 📊 問題決策樹

```
Ramp 效果不正確
    │
    ├─ 完全看不到效果
    │   ├─ rampIntensity = 0? → 設置為 1.0
    │   ├─ colorStart = colorEnd? → 設置不同顏色
    │   └─ 混合模式錯誤? → 設置為 0 (Normal)
    │
    ├─ 效果重複顯示
    │   ├─ Sprite Type = TILED? → 使用獨立 UV (方案 A)
    │   └─ tilingOffset 設置錯誤? → 檢查 XY 值
    │
    ├─ 效果位置錯誤
    │   ├─ rampUVOffset 設置? → 調整偏移
    │   ├─ rampCenter 設置? → 調整中心點
    │   └─ RAMP_DIRECTION 錯誤? → 選擇正確方向
    │
    └─ Sprite 紋理也受影響
        └─ 檢查 useMainTexture 邏輯 → 確保使用 uv0
```

---

## 💡 最佳實踐建議

### 如果您希望 Ramp 效果與 Sprite Type 無關

**推薦修改:** 實現雙 UV 系統

1. **vertex shader:** 添加 `normalizedUV`
2. **fragment shader:** Sprite 紋理用 `uv0`,Ramp 用 `normalizedUV`
3. **結果:** 無論 Sprite 如何設置,Ramp 都是單一漸層

### 如果您希望保持當前行為

確保:
1. Sprite Type = SIMPLE 時效果最佳
2. tilingOffset 只用於控制 Ramp 重複,不影響 Sprite
3. 文檔中說明 Tiled Sprite 的限制

---

## 🆘 仍然無法解決?

請提供以下信息:

1. **截圖:** 當前效果 vs 期望效果
2. **配置:**
   ```typescript
   // 您的完整材質配置
   sprite.type = ?
   material.setProperty('tilingOffset', ?);
   material.setProperty('colorStart', ?);
   material.setProperty('colorEnd', ?);
   // RAMP_DIRECTION = ?
   // BLEND_MODE = ?
   ```
3. **Cocos Creator 版本:** ?
4. **錯誤信息:** (如果有)

---

**診斷工具版本:** 1.0  
**更新日期:** 2024-10-16
