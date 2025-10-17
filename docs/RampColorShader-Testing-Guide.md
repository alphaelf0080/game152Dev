# RampColorShader + RampUVController 測試指南

## 目標

驗證 RampColorShader 和 RampUVController 是否正常工作。

## 快速診斷流程

### 步驟 1：檢查 Shader 設定

1. 打開 `RampColorShader.effect` 文件
2. 確認包含以下參數定義：
   ```glsl
   rampUVScale: { value: [1.0, 1.0], ... }
   rampUVOffset: { value: [0.0, 0.0], ... }
   tilingOffset: { value: [1.0, 1.0, 0.0, 0.0], ... }
   nodeUVScale: { value: [1.0, 1.0], ... }
   ```

### 步驟 2：建立測試場景

```
Scene "TestRamp"
├─ Node "RampSprite"
│  ├─ Transform: Position(0, 0, 0), Scale(1, 1, 1)
│  ├─ UITransform: Content Size (200, 200)
│  ├─ Sprite
│  │  ├─ Atlas: simple_sprite.png (或任何簡單紋理)
│  │  ├─ Frame: default
│  │  ├─ Type: Simple
│  │  ├─ Material: RampColorShader_mat
│  │  └─ Color: white
│  ├─ RampShaderResetInspector (用於 nodeUVScale 自動化)
│  └─ RampUVController (用於 UV 控制)
└─ Canvas (UI 用)
```

### 步驟 3：設定材質

1. 創建自定義材質 `RampColorShader_mat`
   - Effect: RampColorShader
   - 設置為 Sprite 的 Material

2. 在材質 Inspector 中檢查：
   - ✓ Ramp UV Scale: (1.0, 1.0)
   - ✓ Ramp UV Offset: (0.0, 0.0)
   - ✓ Tiling & Offset: (1.0, 1.0, 0.0, 0.0)
   - ✓ Node UV Scale: (應由 RampShaderResetInspector 自動設定)

### 步驟 4：檢查 Console 日誌

**期望輸出**：
```
[RampShaderResetInspector] 初始化成功
[RampShaderResetInspector] 材質初始化成功
[RampShaderResetInspector] ✓ 已自動設置 nodeUVScale

[RampUVController] 初始化完成
[RampUVController] ✓ 材質初始化成功
[RampUVController] ✓ UV 設置已應用
  - rampUVScale: [1.0, 1.0] ✓
  - rampUVOffset: [0.0, 0.0] ✓
  - tilingOffset: [1.0, 1.0, 0, 0] ✓
```

### 步驟 5：測試參數變更

#### 測試 5.1：改變 Ramp UV Scale

```
原始：Ramp UV Scale (1.0, 1.0)
修改為：Ramp UV Scale (2.0, 2.0)
預期結果：Ramp 效果在 Sprite 中重複 2x2 次
```

✓ 檢查點：
- [ ] 效果立即改變（因為 Auto Save 啟用）
- [ ] Console 中看到 `rampUVScale: [2.0, 2.0] ✓`
- [ ] Sprite 中看到 Ramp 效果重複了

#### 測試 5.2：改變 Ramp UV Offset

```
原始：Ramp UV Offset (0.0, 0.0)
修改為：Ramp UV Offset (0.5, 0.0)
預期結果：Ramp 效果向右移動一半
```

✓ 檢查點：
- [ ] Ramp 效果位置改變
- [ ] Console 中看到 `rampUVOffset: [0.5, 0.0] ✓`

#### 測試 5.3：改變 Main Texture Tiling

```
原始：Main Texture Tiling (1.0, 1.0)
修改為：Main Texture Tiling (3.0, 3.0)
預期結果：主紋理重複 3x3，Ramp 效果保持不變
```

✓ 檢查點：
- [ ] Sprite 紋理重複了
- [ ] Ramp 效果仍然覆蓋整個 Sprite
- [ ] Console 中看到 `tilingOffset: [3.0, 3.0, 0, 0] ✓`

### 步驟 6：運行遊戲測試

1. Play 遊戲
2. 檢查效果是否正常顯示
3. 查看 Console，應該看到類似的初始化日誌

## 常見問題排查

### 問題 1：Console 中沒有看到日誌

**可能原因**：
- 組件沒有添加到 Node
- Node 沒有啟用

**解決方案**：
```
1. 確認 Node 已添加 RampShaderResetInspector 和 RampUVController
2. 確認 Node 已啟用（打勾）
3. 重新加載場景
```

### 問題 2：看到警告 "✗ 無法獲取材質"

**可能原因**：
- Sprite 使用的是默認材質，不是自定義材質

**解決方案**：
```
1. 在 Sprite 組件中查找 Material 屬性
2. 點擊空白處選擇自定義材質
3. 確保材質使用的是 RampColorShader Effect
```

### 問題 3：參數改變後沒有看到效果

**可能原因**：
- Auto Save 未啟用
- Material 沒有正確應用 Shader

**解決方案**：
```
1. 確認 Auto Save 已打勾
2. 嘗試手動點擊 Console 中的 "Play" 按鈕（如果有）
3. 重新加載場景
4. 檢查 Shader 文件是否有編譯錯誤
```

### 問題 4：看到 "✗ 設置 xxx 失敗" 錯誤

**可能原因**：
- Shader 中沒有定義該參數
- 參數名稱不符

**解決方案**：
```
1. 打開 RampColorShader.effect
2. 搜索參數名稱（如 "rampUVScale"）
3. 確認拼寫一致
4. 確認參數在 properties 部分定義
```

## 完整檢查清單

### 前置條件
- [ ] RampColorShader.effect 文件存在
- [ ] RampShaderResetInspector.ts 文件存在
- [ ] RampUVController.ts 文件存在

### Shader 檢查
- [ ] rampUVScale 參數已定義
- [ ] rampUVOffset 參數已定義
- [ ] tilingOffset 參數已定義
- [ ] nodeUVScale 參數已定義
- [ ] Shader 無編譯錯誤

### 場景設定
- [ ] Sprite Node 有正確的 Content Size（UITransform）
- [ ] Sprite 組件有紋理
- [ ] Sprite 組件使用自定義材質（RampColorShader）
- [ ] 材質正確應用到 Sprite

### 組件檢查
- [ ] RampShaderResetInspector 已添加到 Node
- [ ] RampUVController 已添加到 Node
- [ ] Target Sprite 已自動檢測或手動設置
- [ ] Auto Save 已啟用

### 運行時檢查
- [ ] Console 中有初始化成功日誌
- [ ] 改變參數後看到 ✓ 標記
- [ ] 修改參數後視覺效果改變
- [ ] 運行遊戲時效果正常

## 高級測試

### 測試 1：動態改變 UV 參數

創建腳本 `TestRampDynamic.ts`：

```typescript
import { Component, _decorator } from 'cc';

const { ccclass } = _decorator;

@ccclass('TestRampDynamic')
export class TestRampDynamic extends Component {
    private uvController: any;
    private time: number = 0;

    onLoad() {
        this.uvController = this.node.getComponent('RampUVController');
    }

    update(dt: number) {
        this.time += dt;

        // 循環改變 Ramp UV Scale
        const scale = 1.0 + Math.sin(this.time) * 0.5;
        this.uvController.setRampUVScale(scale, scale);

        // 循環改變 Ramp UV Offset
        const offsetX = Math.sin(this.time * 2) * 0.3;
        const offsetY = Math.cos(this.time * 2) * 0.3;
        this.uvController.setRampUVOffset(offsetX, offsetY);

        console.log(`[Test] Scale: ${scale.toFixed(2)}, Offset: [${offsetX.toFixed(2)}, ${offsetY.toFixed(2)}]`);
    }
}
```

添加到 Node，看效果是否隨著時間平滑變化。

### 測試 2：多個 Sprite 同時使用

創建多個 Sprite Node，每個都有自己的 RampUVController，驗證是否能獨立控制。

### 測試 3：不同類型 Sprite 測試

- [ ] Simple Sprite （單個紋理）
- [ ] Tiled Sprite （重複紋理）
- [ ] 不同尺寸的 Sprite

## 性能測試

使用 Profiler 檢查：
- [ ] CPU 使用率正常
- [ ] Memory 使用無異常增長
- [ ] FPS 穩定

## 測試結束

✓ 如果所有檢查都通過，RampColorShader 和 RampUVController 已準備好用於生產環境。

如果有任何問題，查看具體的日誌信息並參考 Console 中的錯誤提示進行調試。
