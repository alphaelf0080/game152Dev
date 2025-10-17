# Ramp UV Offset 通用计算公式推导

## 📊 问题定义

**核心需求**：
- ContentSize 和 Sprite Tiled Size 都是变量
- 需要根据实际的 ContentSize 动态计算出正确的 offset
- 不能使用固定的参考像素值

---

## 🔍 已知数据分析

### 测试数据 1
- ContentSize = [696, 540]
- 手动测试最佳 offset = [0.31, 0.24]

### 反推分析

```
offset_x = 0.31
offset_y = 0.24

如果公式是: offset = 0.5 - factor / size

则:
factor_x = (0.5 - 0.31) × 696 = 0.19 × 696 = 132.24
factor_y = (0.5 - 0.24) × 540 = 0.26 × 540 = 140.40
```

### 关键观察

```
factor_x / width = 132.24 / 696 = 0.19
factor_y / height = 140.40 / 540 = 0.26

比例不同！X 是 19%，Y 是 26%
```

---

## 💡 可能的通用公式

### 方案 1: 固定比例系数

```typescript
offset_x = 0.5 - 0.19  // 固定
offset_y = 0.5 - 0.26  // 固定

// 即：
offset = [0.31, 0.24]  // 常数，不随 size 变化
```

**适用场景**: 如果这是视觉设计上的最佳值

---

### 方案 2: 基于比例因子

```typescript
const factorX = 0.19;  // X 方向的固定系数
const factorY = 0.26;  // Y 方向的固定系数

offset_x = 0.5 - factorX;  // = 0.31
offset_y = 0.5 - factorY;  // = 0.24
```

**结果**: 与方案 1 相同，都是固定值

---

### 方案 3: 基于 Tiling（最可能！）

如果 offset 需要根据 **Sprite 的 Tiling 模式** 调整：

```typescript
// 假设 Tiling & Offset = [tilingX, tilingY, offsetX, offsetY]
// 从截图看 Tiling 是 [1, 1]

// 可能的公式：
offset_x = (tiling_x - 1) / 2 + baseOffset_x
offset_y = (tiling_y - 1) / 2 + baseOffset_y
```

但这也不太对...

---

### 方案 4: 基于 nodeUVScale 的补偿

```typescript
// nodeUVScale = 2 / contentSize
const nodeUVScale_x = 2.0 / width;   // 0.002874 for 696
const nodeUVScale_y = 2.0 / height;  // 0.003704 for 540

// 可能的关系：
offset = f(nodeUVScale)

// 测试：
// offset_x = 0.31 ≈ nodeUVScale_x × k ?
// k = 0.31 / 0.002874 ≈ 107.87

// 这个 k 值没有明显意义...
```

---

### 方案 5: 基于 UV 空间的对齐需求

在 Shader 中：
```glsl
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

如果我们需要让 rampUV 在某个特定位置开始/结束：

```
目标: 让 rampUV 从 X 位置开始

normalizedUV 范围: [0, 1]
需要偏移到: X

offset = X - normalizedUV_start
```

但 normalizedUV_start = 0，所以 offset = X

**这意味着 offset 就是起始位置！**

---

## 🎯 新的理解

### 假设：offset 代表 Ramp 的起始位置

如果 offset = [0.31, 0.24] 表示：
- 水平方向：Ramp 从 31% 位置开始
- 垂直方向：Ramp 从 24% 位置开始

**这样的话，offset 可能确实是固定的设计值！**

---

## 🔍 需要更多信息

### 问题 1: Sprite Tiling 的影响
从截图看到 "Tiling & Offset = [1, 1, 0, 0]"

**请回答**:
1. 当 Sprite 是 SIMPLE 模式时，Tiling 是多少？
2. 当 Sprite 是 TILED 模式时，Tiling 是多少（例如 3x3）？
3. 不同 Tiling 下，offset 需要如何调整？

### 问题 2: 不同 ContentSize 的测试
**请提供更多测试数据**:

| ContentSize | 手动测试的最佳 offset |
|-------------|---------------------|
| [696, 540] | [0.31, 0.24] |
| [512, 512] | [?, ?] |
| [1024, 768] | [?, ?] |
| ... | ... |

有了多组数据，我们就能找出规律！

### 问题 3: 视觉效果的要求
**请描述**:
1. offset = [0.31, 0.24] 时，视觉效果是什么？
   - Ramp 从左边 31% 的位置开始？
   - 还是其他效果？

2. 当 ContentSize 变化时，你期望：
   - Ramp 的起始位置保持在相同的相对位置（31%）？
   - 还是起始位置应该动态调整？

---

## 💡 临时解决方案

在收集更多数据之前，我建议使用 **可配置的参数**：

```typescript
@property({ tooltip: 'X 方向的 offset 系数 (0.5 - this = offset_x)' })
offsetFactorX: number = 0.19;  // 0.5 - 0.19 = 0.31

@property({ tooltip: 'Y 方向的 offset 系数 (0.5 - this = offset_y)' })
offsetFactorY: number = 0.26;  // 0.5 - 0.26 = 0.24

public static calculateAutoRampUVOffset(
    width: number,
    height: number,
    factorX: number = 0.19,
    factorY: number = 0.26
): { x: number, y: number } {
    return {
        x: 0.5 - factorX,
        y: 0.5 - factorY
    };
}
```

这样你可以在 Inspector 中调整参数，找出不同情况下的规律。

---

## 🧪 建议的测试方法

### 步骤 1: 固定 Sprite 模式
选择一个 Sprite 模式（SIMPLE 或 TILED），保持不变

### 步骤 2: 测试不同 ContentSize
记录每个尺寸下的最佳 offset：

```
测试记录：
[512, 512] -> offset [?, ?]
[696, 540] -> offset [0.31, 0.24] ✓
[696, 700] -> offset [?, ?]
[1024, 768] -> offset [?, ?]
[1280, 720] -> offset [?, ?]
```

### 步骤 3: 分析规律
找出 offset 与 width/height 的关系：

```javascript
// 在浏览器 Console 测试
const data = [
    { w: 696, h: 540, ox: 0.31, oy: 0.24 },
    { w: 512, h: 512, ox: ?, oy: ? },
    // ... 更多数据
];

// 检查线性关系
data.forEach(d => {
    console.log(`[${d.w}, ${d.h}]:`);
    console.log(`  offset: [${d.ox}, ${d.oy}]`);
    console.log(`  offset × size: [${d.ox * d.w}, ${d.oy * d.h}]`);
    console.log(`  0.5 - offset: [${0.5 - d.ox}, ${0.5 - d.oy}]`);
});
```

---

## 📝 当前实现的问题

**问题**: 使用固定像素偏移 [215.76, 129.60]
```typescript
offset_x = 215.76 / width
offset_y = 129.60 / height
```

**结果**:
- [696, 540] → [0.31, 0.24] ✓
- [696, 700] → [0.31, 0.185] ✗ (你说不正确)

**说明**: 固定像素偏移的方案不适用于你的情况！

---

## ✅ 下一步行动

1. **收集更多测试数据** - 不同 ContentSize 下的最佳 offset
2. **分析 Sprite Tiling 的影响** - SIMPLE vs TILED 模式
3. **确定视觉效果需求** - offset 的实际含义
4. **推导通用公式** - 基于收集的数据

---

*创建日期: 2025-10-17*
*状态: 待收集更多测试数据*
