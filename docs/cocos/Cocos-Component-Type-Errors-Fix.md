# Cocos Creator 組件錯誤修復報告

## 🐛 錯誤清單

### 1. Singleton 類重複註冊錯誤

**錯誤訊息：**
```
[Scene] A Class already exists with the same __cid__ : Singleton.
```

**原因：**
兩個相同的 `Singleton` 類都使用了 `@ccclass('Singleton')`，造成 Cocos Creator 組件系統衝突。

**位置：**
- `game169/assets/script/LibCreator/libScript/Singleton.ts`
- `game169/assets/libcommon/libScript/Common/Singleton.ts`

**修復：**
移除 `@ccclass('Singleton')` 裝飾器。Singleton 是泛型基類，不應該註冊為 Cocos 組件。

```typescript
// 修改前 ❌
@ccclass('Singleton')
export class Singleton<T> {
  // ...
}

// 修改後 ✅
// Singleton 是泛型基類，不需要註冊為 Cocos 組件
export class Singleton<T> {
  // ...
}
```

---

### 2. CameraProceduralWaveEffect 屬性類型錯誤

**錯誤訊息：**
```
[Scene] The type of "CameraProceduralWaveEffect.presetEffect" must be CCString, not String.
[Scene] No needs to indicate the 'cc.String' attribute for "CameraProceduralWaveEffect.presetEffect"
```

**原因：**
在 Cocos Creator 3.x 中，`string` 類型會自動推斷，不需要（也不應該）顯式指定 `type: String`。

**位置：**
`game169/assets/effect/displacementDistor/CameraProceduralWaveEffect.ts`

**修復：**
移除 `type: String` 宣告。

```typescript
// 修改前 ❌
@property({ 
    type: String,  // ← 不需要
    tooltip: '預設效果：none, smooth, complex, water, shockwave, chaos'
})
presetEffect: string = 'none';

// 修改後 ✅
@property({ 
    tooltip: '預設效果：none, smooth, complex, water, shockwave, chaos'
})
presetEffect: string = 'none';
```

---

### 3. DisplacementDistortion 數值類型錯誤

**錯誤訊息：**
```
[Scene] The type of "DisplacementDistortion.displacementStrength" must be CCFloat or CCInteger, not Number.
[Scene] The type of "DisplacementDistortion.displacementScale" must be CCFloat or CCInteger, not Number.
[Scene] The type of "DisplacementDistortion.timeSpeed" must be CCFloat or CCInteger, not Number.
```

**原因：**
在 Cocos Creator 3.x 中，`number` 類型會自動推斷為 `CCFloat`，不需要顯式指定 `type: Number`。

**位置：**
`game169/assets/effect/displacementDistor/DisplacementDistortion.ts`

**修復：**
移除屬性 getter 中的 `type: Number` 宣告。

```typescript
// 修改前 ❌
@property({ type: Number })
get displacementStrength() {
    return this._displacementStrength;
}

// 修改後 ✅
@property
get displacementStrength() {
    return this._displacementStrength;
}
```

---

### 4. DisplacementDistortion 枚舉類型錯誤

**錯誤訊息：**
```
[Scene] You are explicitly specifying `undefined` type to cc property "_distortionType"
[Scene] You are explicitly specifying `undefined` type to cc property "distortionType"
```

**原因：**
1. `DistortionType` 枚舉定義在檔案底部，在類別中使用時還未定義
2. 枚舉類型需要使用 `Enum()` 包裝

**位置：**
`game169/assets/effect/displacementDistor/DisplacementDistortion.ts`

**修復：**
1. 將 `DistortionType` 枚舉移到檔案開頭（在類別定義之前）
2. 使用 `Enum(DistortionType)` 來正確宣告枚舉類型
3. 從 `cc` 匯入 `Enum`

```typescript
// 修改前 ❌
import { _decorator, Component, ... } from 'cc';

@ccclass('DisplacementDistortion')
export class DisplacementDistortion extends Component {
    @property({ type: DistortionType })  // ← DistortionType 尚未定義
    private _distortionType: DistortionType = DistortionType.XY;
}

// 檔案底部
export enum DistortionType {
    XY = 0,
    X_Only = 1,
    Y_Only = 2,
    Radial = 3
}

// 修改後 ✅
import { _decorator, Component, ..., Enum } from 'cc';

export enum DistortionType {
    XY = 0,
    X_Only = 1,
    Y_Only = 2,
    Radial = 3
}

@ccclass('DisplacementDistortion')
export class DisplacementDistortion extends Component {
    @property({ 
        tooltip: '扭曲類型',
        type: Enum(DistortionType)  // ← 使用 Enum() 包裝
    })
    private _distortionType: DistortionType = DistortionType.XY;
    
    @property({ type: Enum(DistortionType) })
    get distortionType() {
        return this._distortionType;
    }
}
```

---

## 📋 修復總結

| 錯誤類型 | 檔案 | 修復方法 |
|---------|------|---------|
| 重複註冊組件 | Singleton.ts (2個) | 移除 `@ccclass()` |
| String 類型錯誤 | CameraProceduralWaveEffect.ts | 移除 `type: String` |
| Number 類型錯誤 | DisplacementDistortion.ts | 移除 `type: Number` |
| 枚舉類型錯誤 | DisplacementDistortion.ts | 移動枚舉位置 + 使用 `Enum()` |

---

## 🎯 Cocos Creator 3.x 屬性宣告最佳實踐

### ✅ 正確的寫法

```typescript
import { _decorator, Component, Enum } from 'cc';
const { ccclass, property } = _decorator;

export enum MyEnum {
    Value1 = 0,
    Value2 = 1
}

@ccclass('MyComponent')
export class MyComponent extends Component {
    // 1. 基本類型 - 自動推斷
    @property({ tooltip: '數值' })
    myNumber: number = 0;
    
    @property({ tooltip: '字串' })
    myString: string = '';
    
    @property({ tooltip: '布林值' })
    myBoolean: boolean = false;
    
    // 2. 範圍數值 - 使用 range 和 slide
    @property({ 
        tooltip: '亮度',
        range: [0, 1, 0.01],
        slide: true
    })
    brightness: number = 0.5;
    
    // 3. 枚舉類型 - 使用 Enum()
    @property({ 
        tooltip: '類型',
        type: Enum(MyEnum)
    })
    myEnum: MyEnum = MyEnum.Value1;
    
    // 4. 物件類型 - 需要指定 type
    @property({ type: Node })
    targetNode: Node | null = null;
    
    @property({ type: Sprite })
    targetSprite: Sprite | null = null;
    
    // 5. Getter/Setter - 只在 getter 上加 @property
    private _value: number = 0;
    
    @property({ 
        range: [0, 10, 0.1],
        slide: true
    })
    get value() {
        return this._value;
    }
    set value(val: number) {
        this._value = val;
        this.onValueChanged();
    }
}
```

### ❌ 錯誤的寫法

```typescript
// ❌ 不要顯式指定基本類型
@property({ type: Number })
myNumber: number = 0;

@property({ type: String })
myString: string = '';

@property({ type: Boolean })
myBoolean: boolean = false;

// ❌ 枚舉類型不要直接使用
@property({ type: MyEnum })  // 錯誤！
myEnum: MyEnum = MyEnum.Value1;

// ❌ 不要將泛型基類註冊為組件
@ccclass('Singleton')  // 錯誤！
export class Singleton<T> { }

// ❌ 不要在 setter 上加 @property
@property
get value() { return this._value; }

@property  // 錯誤！
set value(val: number) { this._value = val; }
```

---

## 🔍 驗證步驟

1. **編譯檢查：**
   ```bash
   ✅ TypeScript 編譯無錯誤
   ```

2. **Cocos Creator 檢查：**
   ```
   - 打開 Cocos Creator 3.8.4
   - 檢查控制台無錯誤訊息
   - 驗證所有組件正常顯示
   ```

3. **屬性面板檢查：**
   ```
   - SpriteColorAdjuster: 所有滑桿正常顯示
   - DisplacementDistortion: 枚舉下拉選單正常顯示
   - CameraProceduralWaveEffect: 文字輸入正常
   ```

---

## 📚 修復的檔案清單

1. ✅ `game169/assets/script/LibCreator/libScript/Singleton.ts`
2. ✅ `game169/assets/libcommon/libScript/Common/Singleton.ts`
3. ✅ `game169/assets/effect/displacementDistor/CameraProceduralWaveEffect.ts`
4. ✅ `game169/assets/effect/displacementDistor/DisplacementDistortion.ts`

---

## 🚀 下一步

1. **在 Cocos Creator 中測試：**
   - 重新整理資源（Ctrl+R）
   - 檢查控制台無錯誤
   - 測試各組件的屬性面板

2. **功能測試：**
   - 測試 SpriteColorAdjuster 色彩調整
   - 測試 DisplacementDistortion 扭曲效果
   - 測試 CameraProceduralWaveEffect 波浪效果

3. **提交修復：**
   ```bash
   git add .
   git commit -m "fix: 修復 Cocos Creator 組件屬性類型錯誤"
   git push origin main
   ```

---

**修復時間：** 2025-10-15  
**修復者：** GitHub Copilot  
**測試狀態：** 代碼編譯通過，待 Cocos Creator 運行時驗證
