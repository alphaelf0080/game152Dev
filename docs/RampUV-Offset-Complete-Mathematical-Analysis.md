# 🔬 Ramp UV Offset 完整数学推导

## 📊 从截图提取的关键参数

### 截图 1 & 2 的参数：
```
ContentSize:        [1200, 300]
Anchor Point:       [0.5, 0.5]
Tiling & Offset:    [1, 1, 0, 0]
Node UV Scale:      [0.001667, 0.006667]
Ramp UV Offset:     [0.6, 0.432]  ← 当前自动计算的值（错误）
```

### 已知参考数据：
```
ContentSize:        [696, 540]
最佳 Offset:        [0.31, 0.24]
```

---

## 🧮 核心数学分析

### 1. Shader 中的 UV 转换流程

```glsl
// Step 1: nodeUV 的范围
// a_position 范围: [-contentSize/2, contentSize/2]
// 例如 [1200, 300] → X: [-600, 600], Y: [-150, 150]

// Step 2: 标准化到 [0, 1]
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;

// 其中 nodeUVScale = 2 / contentSize
// 所以: nodeUV * nodeUVScale = nodeUV * (2 / contentSize)
//                             = [-contentSize/2, contentSize/2] * (2/contentSize)
//                             = [-1, 1]
// 然后: [-1, 1] + 1.0 = [0, 2]
// 最后: [0, 2] * 0.5 = [0, 1] ✓

// Step 3: 应用 Tiling & Offset
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

### 2. Anchor Point 的影响

**关键发现**: Anchor Point = [0.5, 0.5] 表示节点中心点

```
如果 AnchorPoint = [0.5, 0.5]:
  节点中心 = (0, 0)
  节点左下角 = (-width/2, -height/2) = (-600, -150)
  节点右上角 = (width/2, height/2) = (600, 150)

如果 AnchorPoint = [0, 0]:
  节点中心 = (width/2, height/2)
  节点左下角 = (0, 0)
  节点右上角 = (width, height)
```

**重要**: 在 shader 中，a_position 已经考虑了 Anchor Point！
所以 nodeUV 的范围始终是相对于 Anchor Point 的。

### 3. Tiling & Offset 的作用

从截图看到 `Tiling & Offset = [1, 1, 0, 0]`：

```
这是 Sprite 组件的纹理参数，不是 Shader 参数！

Tiling = [1, 1]   → 纹理平铺 1 次（不重复）
Offset = [0, 0]   → 纹理无偏移
```

**关键**: 这个参数影响的是 **主纹理的 UV**，不是 Ramp 的 UV！

---

## 💡 新的理解：Offset 的真正含义

### 问题：为什么需要 offset？

从 shader 逻辑看：

```glsl
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

当 `rampUVScale = [1, 1]` 时：
```glsl
rampUV = fract(normalizedUV + rampUVOffset);
```

`normalizedUV` 的范围是 [0, 1]，如果我们想让 Ramp 从某个特定位置开始，就需要 offset。

### 关键推导

**假设**: offset [0.31, 0.24] 的目标是让 Ramp 在某个特定的像素位置对齐

让我们从 **像素空间** 推导：

```
ContentSize = [696, 540]
offset = [0.31, 0.24]

在 UV 空间 [0, 1] 中：
  offset = [0.31, 0.24]

对应的像素位置（相对于左下角）：
  pixelX = 0.31 × 696 = 215.76 px
  pixelY = 0.24 × 540 = 129.60 px
```

**但这是从哪里测量的？**

考虑 Anchor Point = [0.5, 0.5]：
```
节点中心 = (0, 0)
左下角 = (-348, -270)  // (-696/2, -540/2)
右上角 = (348, 270)    // (696/2, 540/2)

如果 offset 表示从左下角的偏移：
  实际位置 = (-348 + 215.76, -270 + 129.60)
           = (-132.24, -140.40)
```

---

## 🎯 通用公式推导

### 方案 1: 固定相对位置（最可能！）

**假设**: offset 表示 Ramp 起始点在 UV 空间中的固定相对位置

```typescript
// 如果目标是让 Ramp 总是从 31% 和 24% 的位置开始
offset = [0.31, 0.24]  // 常数！
```

**验证**:
- [696, 540] → offset [0.31, 0.24] ✓
- [1200, 300] → offset [0.31, 0.24] ?

这意味着 **offset 不随 ContentSize 变化**！

---

### 方案 2: 固定像素偏移

**假设**: offset 对应的像素距离是固定的

```typescript
const fixedPixelX = 215.76;  // 固定
const fixedPixelY = 129.60;  // 固定

offset_x = fixedPixelX / width;
offset_y = fixedPixelY / height;
```

**验证**:
- [696, 540] → [215.76/696, 129.60/540] = [0.31, 0.24] ✓
- [1200, 300] → [215.76/1200, 129.60/300] = [0.180, 0.432] ?

**问题**: 这会让 offset 随尺寸变化，可能不是你想要的。

---

### 方案 3: 基于 Anchor Point 的补偿

**假设**: offset 用于补偿 Anchor Point 的影响

```typescript
// 当 AnchorPoint = [0.5, 0.5] 时
// 节点中心在 (0, 0)
// 可能需要补偿到某个特定位置

const anchorX = 0.5;
const anchorY = 0.5;

// 补偿公式（示例）
offset_x = 0.5 - anchorX + adjustment_x;
offset_y = 0.5 - anchorY + adjustment_y;
```

但从你的数据看，AnchorPoint = [0.5, 0.5] 时 offset = [0.31, 0.24]，
这不是简单的 `0.5 - 0.5 = 0`。

---

### 方案 4: 基于 Tiling 的补偿

**假设**: offset 与 Sprite 的 Tiling 有关

```typescript
const tilingX = 1;  // 从截图
const tilingY = 1;

// 可能的公式
offset_x = f(contentSize, tiling, anchor);
```

但从截图看，Tiling = [1, 1] 是常数，所以可能不是主要因素。

---

## 🔍 关键问题：到底要对齐到哪里？

让我重新思考：**你说 offset [0.31, 0.24] 是"正确的"，这意味着什么？**

### 可能的含义 1: 视觉对齐

从截图的红色箭头看，可能是要对齐到某个特定的视觉位置。

**问题**: 这个位置是：
- A. 相对于节点左下角的固定百分比（31%, 24%）？
- B. 相对于节点中心的固定距离？
- C. 相对于某个纹理特征的对齐？

### 可能的含义 2: Ramp 梯度的起始点

如果 offset 控制 Ramp 从哪里开始：

```
offset = [0.31, 0.24] 表示：
  Ramp 从 UV (0.31, 0.24) 开始
  然后向右/向上渐变到 1.0
```

**在这种情况下，offset 应该是固定的！**

---

## ✅ 推荐的通用公式

基于以上分析，我认为 **方案 1（固定相对位置）** 最合理：

```typescript
/**
 * 计算 Ramp UV Offset
 * 
 * 结论: offset 表示 Ramp 在 UV 空间中的起始相对位置
 * 这个位置是固定的，不随 ContentSize 变化
 * 
 * 但可能需要根据 Anchor Point 调整！
 */
public static calculateAutoRampUVOffset(
    width: number,
    height: number,
    anchorX: number = 0.5,
    anchorY: number = 0.5
): { x: number, y: number } {
    
    // 基础 offset（经验值）
    const baseOffsetX = 0.31;
    const baseOffsetY = 0.24;
    
    // 根据 Anchor Point 调整
    // 如果 Anchor 在中心 (0.5, 0.5)，不需要调整
    // 如果 Anchor 不在中心，需要补偿
    
    const anchorAdjustmentX = (0.5 - anchorX);
    const anchorAdjustmentY = (0.5 - anchorY);
    
    return {
        x: baseOffsetX + anchorAdjustmentX,
        y: baseOffsetY + anchorAdjustmentY
    };
}
```

**验证**:
- AnchorPoint = [0.5, 0.5]:
  - adjustment = [0, 0]
  - offset = [0.31, 0.24] ✓

- AnchorPoint = [0, 0]:
  - adjustment = [0.5, 0.5]
  - offset = [0.81, 0.74]

- AnchorPoint = [1, 1]:
  - adjustment = [-0.5, -0.5]
  - offset = [-0.19, -0.26]

---

## 🧪 最终公式（考虑所有因素）

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number,
    anchorX: number = 0.5,
    anchorY: number = 0.5,
    tilingX: number = 1,
    tilingY: number = 1
): { x: number, y: number } {
    
    // 基础偏移（这是关键的魔法数字）
    // 可能来自：
    // 1. 设计需求（Ramp 从 31% 位置开始）
    // 2. 纹理对齐需求
    // 3. shader 内部计算的补偿
    const baseOffsetX = 0.31;
    const baseOffsetY = 0.24;
    
    // Anchor Point 补偿
    const anchorAdjX = (0.5 - anchorX);
    const anchorAdjY = (0.5 - anchorY);
    
    // Tiling 补偿（如果 tiling != 1）
    const tilingAdjX = (tilingX - 1.0) * 0.5;
    const tilingAdjY = (tilingY - 1.0) * 0.5;
    
    return {
        x: baseOffsetX + anchorAdjX + tilingAdjX,
        y: baseOffsetY + anchorAdjY + tilingAdjY
    };
}
```

---

## 🎯 测试计划

### 测试 1: 验证 Anchor Point 影响

保持 ContentSize = [1200, 300]，改变 Anchor Point：

```
Anchor [0.5, 0.5] → offset 应该是 [0.31, 0.24]
Anchor [0, 0]     → offset 应该是 [0.81, 0.74]
Anchor [1, 1]     → offset 应该是 [-0.19, -0.26]
```

### 测试 2: 验证 Tiling 影响

保持 ContentSize = [1200, 300]，Anchor [0.5, 0.5]，改变 Tiling：

```
Tiling [1, 1] → offset 应该是 [0.31, 0.24]
Tiling [2, 2] → offset 应该是 [0.81, 0.74]
Tiling [3, 3] → offset 应该是 [1.31, 1.24]
```

### 测试 3: 验证 ContentSize 不影响

保持 Anchor [0.5, 0.5]，Tiling [1, 1]，改变 ContentSize：

```
ContentSize [696, 540]   → offset [0.31, 0.24]
ContentSize [1200, 300]  → offset [0.31, 0.24]
ContentSize [512, 512]   → offset [0.31, 0.24]
```

**如果这个测试通过，就证明 offset 是固定的！**

---

*创建日期: 2025-10-17*
*状态: 待验证假设*
