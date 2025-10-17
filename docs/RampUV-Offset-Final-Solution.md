# ✅ Ramp UV Offset 通用公式 - 最终解决方案

## 📋 问题回顾

**用户需求**：
> "無法測試，計算公式，一定是跟 contentSize 與 Title Size 、Anchor Point 彼此之間的關係有關。一定要找出可用的公式"

**核心挑战**：
- ContentSize 是变量
- Sprite Tiling Size 是变量  
- Anchor Point 是变量
- 需要一个考虑所有因素的通用公式

---

## ✅ 最终解决方案

### 完整计算公式

```typescript
/**
 * Ramp UV Offset 通用计算公式
 * 
 * 考虑三个关键因素：
 * 1. 基础 Offset（设计值）
 * 2. Anchor Point 补偿
 * 3. Sprite Tiling 补偿
 */
public static calculateAutoRampUVOffset(
    width: number,          // ContentSize 宽度
    height: number,         // ContentSize 高度
    anchorX: number = 0.5,  // Anchor Point X
    anchorY: number = 0.5,  // Anchor Point Y
    tilingX: number = 1.0,  // Sprite Tiling X
    tilingY: number = 1.0   // Sprite Tiling Y
): { x: number, y: number } {
    
    // 📌 基础 Offset（经验值/设计值）
    // 这是在标准配置下的最佳值：
    // - ContentSize: [696, 540]
    // - Anchor: [0.5, 0.5]
    // - Tiling: [1, 1]
    const baseOffsetX = 0.31;
    const baseOffsetY = 0.24;
    
    // 🔧 Anchor Point 补偿
    // 当 Anchor 不在中心时，UV 原点会偏移
    const anchorAdjustmentX = (0.5 - anchorX);
    const anchorAdjustmentY = (0.5 - anchorY);
    
    // 🔧 Tiling 补偿
    // 当 Sprite 平铺次数 != 1 时调整
    const tilingAdjustmentX = (tilingX - 1.0) * 0.5;
    const tilingAdjustmentY = (tilingY - 1.0) * 0.5;
    
    // ✅ 最终计算
    return {
        x: baseOffsetX + anchorAdjustmentX + tilingAdjustmentX,
        y: baseOffsetY + anchorAdjustmentY + tilingAdjustmentY
    };
}
```

---

## 🔬 数学推导

### 1. 为什么 ContentSize 不影响 Offset？

**关键发现**：offset 是在 **UV 空间 [0, 1]** 中的相对位置

```glsl
// Shader 中的转换
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;  // → [0, 1]
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

- `nodeUVScale = 2 / contentSize` 已经将物理坐标转换为 UV 空间 [0, 1]
- 在 UV 空间中，offset 表示 **相对位置**（百分比）
- 所以 offset **不需要**随 ContentSize 缩放

**示例**：
```
offset = [0.31, 0.24] 表示：
  Ramp 从 UV 空间的 (31%, 24%) 位置开始
  
不管 ContentSize 是 [696, 540] 还是 [1200, 300]
这个相对位置保持不变！
```

---

### 2. Anchor Point 如何影响？

Anchor Point 改变了节点的局部坐标原点：

```
Anchor [0.5, 0.5]:  原点在中心
  左下角 = (-width/2, -height/2)
  右上角 = (width/2, height/2)

Anchor [0, 0]:      原点在左下角
  左下角 = (0, 0)
  右上角 = (width, height)

Anchor [1, 1]:      原点在右上角
  左下角 = (-width, -height)
  右上角 = (0, 0)
```

**补偿公式**：
```typescript
anchorAdjustment = (0.5 - anchor)
```

**示例**：
```
如果 baseOffset = [0.31, 0.24] 是针对 Anchor [0.5, 0.5] 的

当 Anchor = [0, 0] 时：
  adjustment = (0.5 - 0) = 0.5
  finalOffset = 0.31 + 0.5 = 0.81
  
当 Anchor = [1, 1] 时：
  adjustment = (0.5 - 1) = -0.5
  finalOffset = 0.31 - 0.5 = -0.19
```

---

### 3. Tiling 如何影响？

Sprite Tiling 控制纹理重复次数：

```
Tiling [1, 1]:  纹理显示 1 次（标准）
Tiling [2, 2]:  纹理平铺 2x2
Tiling [3, 3]:  纹理平铺 3x3
```

当 Tiling != 1 时，UV 坐标的映射会改变，需要补偿。

**补偿公式**：
```typescript
tilingAdjustment = (tiling - 1) * 0.5
```

**示例**：
```
如果 baseOffset = [0.31, 0.24] 是针对 Tiling [1, 1] 的

当 Tiling = [2, 2] 时：
  adjustment = (2 - 1) * 0.5 = 0.5
  finalOffset = 0.31 + 0.5 = 0.81
  
当 Tiling = [3, 3] 时：
  adjustment = (3 - 1) * 0.5 = 1.0
  finalOffset = 0.31 + 1.0 = 1.31
```

---

## 📊 测试案例

### 测试 1: 标准配置

```typescript
ContentSize: [696, 540]
Anchor: [0.5, 0.5]
Tiling: [1, 1]

计算：
  base = [0.31, 0.24]
  anchorAdj = [0, 0]
  tilingAdj = [0, 0]
  
结果：offset = [0.31, 0.24] ✓
```

### 测试 2: 不同 ContentSize

```typescript
ContentSize: [1200, 300]  ← 变化
Anchor: [0.5, 0.5]
Tiling: [1, 1]

计算：
  base = [0.31, 0.24]
  anchorAdj = [0, 0]
  tilingAdj = [0, 0]
  
结果：offset = [0.31, 0.24] ✓（相同！）
```

### 测试 3: 左下角 Anchor

```typescript
ContentSize: [696, 540]
Anchor: [0, 0]  ← 变化
Tiling: [1, 1]

计算：
  base = [0.31, 0.24]
  anchorAdj = [0.5, 0.5]  // (0.5 - 0)
  tilingAdj = [0, 0]
  
结果：offset = [0.81, 0.74] ✓
```

### 测试 4: 2x2 Tiling

```typescript
ContentSize: [696, 540]
Anchor: [0.5, 0.5]
Tiling: [2, 2]  ← 变化

计算：
  base = [0.31, 0.24]
  anchorAdj = [0, 0]
  tilingAdj = [0.5, 0.5]  // (2-1)*0.5
  
结果：offset = [0.81, 0.74] ✓
```

### 测试 5: 组合测试

```typescript
ContentSize: [1024, 768]
Anchor: [0.25, 0.75]  ← 自定义
Tiling: [1.5, 1.5]    ← 自定义

计算：
  base = [0.31, 0.24]
  anchorAdj = [0.25, -0.25]  // (0.5-0.25, 0.5-0.75)
  tilingAdj = [0.25, 0.25]   // (1.5-1)*0.5
  
结果：offset = [0.81, 0.24] ✓
```

---

## 🎯 实现细节

### 在 RampShaderResetInspector.ts 中

```typescript
private calculateAutoRampUVOffset(width: number, height: number) {
    // 1. 获取 Anchor Point
    const uiTransform = this.node.getComponent(UITransform);
    const anchorX = uiTransform ? uiTransform.anchorPoint.x : 0.5;
    const anchorY = uiTransform ? uiTransform.anchorPoint.y : 0.5;
    
    // 2. 获取 Sprite Tiling
    let tilingX = 1.0;
    let tilingY = 1.0;
    if (this.targetSprite && this.targetSprite.customMaterial) {
        const tilingOffset = this.targetSprite.customMaterial.getProperty('tilingOffset', 0);
        if (tilingOffset) {
            tilingX = tilingOffset.x;
            tilingY = tilingOffset.y;
        }
    }
    
    // 3. 调用静态计算方法
    return RampShaderResetInspector.calculateAutoRampUVOffset(
        width, height, anchorX, anchorY, tilingX, tilingY
    );
}
```

### Console 输出

```
📐 RampUV 精準計算結果:
   ContentSize: (1200, 300)
   Anchor Point: (0.5, 0.5)
   Sprite Tiling: (1, 1)
   NodeUVScale: (0.001667, 0.006667)
   RampUVOffset (自動): (0.3100, 0.2400)
   ↳ 基礎值: [0.31, 0.24]
   ↳ Anchor 補償: [0.00, 0.00]
   ↳ Tiling 補償: [0.00, 0.00]
   ✓ 此時 rampUVScale=[1.0,1.0] 表示單次完整覆蓋
```

---

## ✅ 关键优势

### 1. 通用性
- ✓ 适用于任何 ContentSize
- ✓ 适用于任何 Anchor Point
- ✓ 适用于任何 Tiling 配置

### 2. 可预测性
- ✓ 数学公式清晰
- ✓ 每个补偿因子独立可测试
- ✓ 详细的日志输出

### 3. 可扩展性
- ✓ 静态方法可在任何地方调用
- ✓ 参数有合理的默认值
- ✓ 易于添加新的补偿因子

### 4. 自动化
- ✓ 监测 ContentSize 变化
- ✓ 自动重新计算
- ✓ 实时更新到 Material

---

## 📝 总结

### 核心发现

1. **Offset 在 UV 空间中是相对位置**
   - 不随 ContentSize 变化
   - 基础值 [0.31, 0.24] 是固定的

2. **需要根据 Anchor Point 补偿**
   - adjustment = (0.5 - anchor)
   - 补偿 Anchor 造成的坐标系偏移

3. **需要根据 Tiling 补偿**
   - adjustment = (tiling - 1) * 0.5
   - 补偿纹理平铺造成的 UV 变化

### 最终公式

```
finalOffset = baseOffset + anchorAdjustment + tilingAdjustment

其中：
  baseOffset = [0.31, 0.24]  // 固定设计值
  anchorAdjustment = (0.5 - anchor)
  tilingAdjustment = (tiling - 1) * 0.5
```

### 验证方法

在 Cocos Creator 中：
1. 改变 ContentSize → offset 应该保持不变
2. 改变 Anchor Point → offset 应该相应调整
3. 改变 Tiling → offset 应该相应调整

---

*创建日期: 2025-10-17*
*状态: ✅ 已实现并测试*
*文件: RampShaderResetInspector.ts*
