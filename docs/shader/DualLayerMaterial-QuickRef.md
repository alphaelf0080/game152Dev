# DualLayerMaterial 快速參考

## 概述

在 Sprite 現有的 custom material 上方再添加第二層 material。

## 3 步快速設置

### 1️⃣ 添加組件
```
Select Sprite Node → Add Component → DualLayerMaterial
```

### 2️⃣ 設置覆蓋層材質
```
Inspector 中：
- Overlay Material: 拖入你的材質
- Overlay Opacity: 0~1 調整透明度
```

### 3️⃣ 調整效果
```
改變 Opacity 滑桿即時預覽效果
```

## 場景配置

### 架構圖

```
Sprite Node (你的原始 Node)
├─ Sprite Component
│  └─ Custom Material: 底層材質 (保持不變)
│
└─ DualLayerMaterial 組件
   └─ Overlay Material: 頂層材質 (新添加)
      └─ 自動創建 Overlay Node
         └─ 自動創建 Overlay Sprite
```

### 正確的 Inspector 設置

```yaml
Sprite Component:
  Sprite Frame: your_texture
  Custom Material: BaseShader ← 保持不變

DualLayerMaterial:
  Target Sprite: (自動)
  Overlay Material: OverlayShader ← 新增
  Overlay Opacity: 0.5
  Enable Overlay: ✓
```

## 常用配置

### 配置 1：發光效果
```
底層：原始紋理
頂層：Glow Material
透明度：0.5
```

### 配置 2：顏色調整
```
底層：基礎紋理 + RampShader
頂層：顏色映射
透明度：1.0
```

### 配置 3：受傷指示
```
底層：角色紋理
頂層：紅色覆蓋
透明度：0 (預設) → 受傷時改為 0.7
```

### 配置 4：動態效果
```
底層：場景紋理
頂層：特效材質
透明度：動畫循環 (0~1)
```

## 關鍵參數

| 參數 | 作用 | 預設值 |
|---|---|---|
| **Overlay Material** | 覆蓋層使用的材質 | null |
| **Overlay Opacity** | 覆蓋層透明度 | 1.0 |
| **Enable Overlay** | 是否顯示覆蓋層 | true |
| **Blend Src/Dst** | 混合模式 | SRC_ALPHA / ONE_MINUS_SRC_ALPHA |

## 代碼控制

### 基本用法

```typescript
const dual = node.getComponent('DualLayerMaterial');

// 設置材質
dual.setOverlayMaterial(newMaterial);

// 設置透明度
dual.setOverlayOpacity(0.5);

// 啟用/禁用
dual.setOverlayEnabled(true);
dual.setOverlayEnabled(false);

// 刪除覆蓋層
dual.removeOverlay();
```

### 動態效果示例

```typescript
// 淡入淡出
let opacity = 0;
const interval = setInterval(() => {
    opacity += 0.01;
    dual.setOverlayOpacity(Math.min(opacity, 1));
    if (opacity >= 1) clearInterval(interval);
}, 16);

// 脈動
let time = 0;
update(dt) {
    time += dt;
    const opacity = Math.abs(Math.sin(time * Math.PI));
    dual.setOverlayOpacity(opacity);
}

// 狀態切換
function burnEffect() {
    dual.setOverlayMaterial(burnMaterial);
    dual.setOverlayOpacity(0.7);
}

function clearEffect() {
    dual.setOverlayOpacity(0);
}
```

## 方法列表

```typescript
// 設置覆蓋層材質
setOverlayMaterial(material: Material): void

// 設置透明度 (0~1)
setOverlayOpacity(opacity: number): void

// 啟用/禁用覆蓋層
setOverlayEnabled(enabled: boolean): void

// 獲取覆蓋層 Sprite
getOverlaySprite(): Sprite | null

// 獲取底層 Sprite
getBaseSprite(): Sprite | null

// 交換底層和頂層材質
swapMaterials(): void

// 刪除覆蓋層
removeOverlay(): void
```

## 工作流程

### 場景 1：一次性效果

```
1. 添加組件
2. 設置 Overlay Material
3. 設置 Opacity = 0.5
4. 完成
```

### 場景 2：動態效果

```typescript
onLoad() {
    this.dual = node.getComponent('DualLayerMaterial');
    this.dual.setOverlayOpacity(0);  // 初始隱藏
}

takeDamage() {
    this.dual.setOverlayMaterial(damageRedMaterial);
    this.dual.setOverlayOpacity(0.7);
    
    // 淡出
    setTimeout(() => {
        this.dual.setOverlayOpacity(0);
    }, 500);
}
```

### 場景 3：多層疊加

```typescript
// 第一個覆蓋層
const dual1 = node.addComponent('DualLayerMaterial');
dual1.overlayMaterial = material1;

// 第二個覆蓋層（在第一個覆蓋層上）
const overlayNode = node.getChildByName(`${node.name}_Overlay`);
const dual2 = overlayNode.addComponent('DualLayerMaterial');
dual2.overlayMaterial = material2;
```

## 常見問題

### Q: 如何只隱藏覆蓋層？
```typescript
dual.setOverlayOpacity(0);  // 隱藏
dual.setOverlayOpacity(1);  // 顯示
```

### Q: 如何交換底層和頂層？
```typescript
dual.swapMaterials();
```

### Q: 能否改變覆蓋層的位置？
```typescript
const overlayNode = dual.getOverlaySprite().node;
overlayNode.position.set(10, 10, 0);
```

### Q: 性能如何？
- 每個覆蓋層額外的渲染調用
- 對性能有影響但通常可接受
- 避免過多層疊加

## 完整示例

```typescript
export class EnemyHealth extends Component {
    private dualLayer: any;
    private isHurt: boolean = false;
    
    onLoad() {
        this.dualLayer = this.node.getComponent('DualLayerMaterial');
        this.dualLayer.setOverlayOpacity(0);
    }
    
    takeDamage(amount: number) {
        if (this.isHurt) return;
        
        this.isHurt = true;
        this.dualLayer.setOverlayMaterial(this.redFlash);
        
        // 閃爍效果
        let flashes = 0;
        const flash = () => {
            flashes++;
            this.dualLayer.setOverlayOpacity(flashes % 2 === 0 ? 0.5 : 0);
            
            if (flashes < 6) {
                setTimeout(flash, 100);
            } else {
                this.dualLayer.setOverlayOpacity(0);
                this.isHurt = false;
            }
        };
        
        flash();
    }
}
```

## 文件位置

- 組件：`/assets/scripts/DualLayerMaterial.ts`
- 指南：`/docs/DualLayerMaterial-Guide.md`
- 參考：`/docs/DualLayerMaterial-QuickRef.md` (本文件)

---

**快速上手、強大功能！** 🎨
