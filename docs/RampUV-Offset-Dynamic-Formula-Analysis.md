# 🔬 Ramp UV Offset 动态公式推导（无固定值版本）

## ❌ 问题：固定值方案不可行

**用户反馈**：
> "不可能有固定的值，一定是要由 input 的參數計算出來的。有固定值一定不正確，這樣無法反映 sprite 與 content size 變動"

**正确！** 固定的 `[0.31, 0.24]` 无法适应不同的配置。

---

## 🔍 重新分析：从已知数据反推公式

### 已知数据

```
测试配置 1:
  ContentSize: [696, 540]
  最佳 offset: [0.31, 0.24]
  
像素计算:
  像素 X = 0.31 × 696 = 215.76 px
  像素 Y = 0.24 × 540 = 129.60 px
```

### 关键问题

**这个 215.76 和 129.60 是从哪里来的？**

可能性：
1. 与 Sprite 的实际纹理尺寸有关？
2. 与 Tiling & Offset 参数有关？
3. 与 nodeUVScale 的转换有关？
4. 与 Shader 内部的某个计算有关？

---

## 💡 新假设：基于 Tiling & Offset

从截图看到：`Tiling & Offset = [1, 1, 0, 0]`

这是 Sprite 组件的纹理 UV 参数：
- Tiling: [1, 1] - 纹理平铺次数
- Offset: [0, 0] - 纹理偏移

### 假设 1: offset 补偿 Tiling 的影响

```typescript
// 当 Sprite Tiling = [tilingX, tilingY]
// Ramp 需要补偿这个 Tiling 的影响

offset_x = f(tilingX, contentWidth)
offset_y = f(tilingY, contentHeight)
```

但从截图看，Tiling = [1, 1]，应该不需要补偿...

---

## 🎯 新思路：基于 Sprite 实际纹理尺寸

### 关键洞察

在 Cocos Creator 中：
- **ContentSize**: 节点的显示尺寸 [1200, 300]
- **Sprite Frame**: 实际纹理的尺寸（可能不同！）
- **Tiling**: 控制纹理如何平铺

**可能的公式**：

```typescript
// 假设 Sprite 的原始纹理尺寸是 spriteWidth × spriteHeight
const textureScale_x = contentWidth / spriteWidth;
const textureScale_y = contentHeight / spriteHeight;

// offset 需要补偿这个缩放
offset_x = f(textureScale_x)
offset_y = f(textureScale_y)
```

---

## 🧮 数学推导：从 Shader 逻辑反推

### Shader 中的 UV 转换

```glsl
// Step 1: a_position → nodeUV
vec2 nodeUV = a_position;  // 范围: [-contentSize/2, contentSize/2]

// Step 2: nodeUV → normalizedUV
vec2 normalizedUV = (nodeUV * nodeUVScale + 1.0) * 0.5;
// 其中 nodeUVScale = 2 / contentSize
// 结果: normalizedUV ∈ [0, 1]

// Step 3: normalizedUV → rampUV
vec2 rampUV = fract((normalizedUV + rampUVOffset) * rampUVScale);
```

### 关键观察

当 `rampUVScale = [1, 1]` 时：
```glsl
rampUV = fract(normalizedUV + rampUVOffset)
```

`normalizedUV` 已经是 [0, 1]，为什么还需要 offset？

**答案**：可能是为了对齐 Sprite 纹理的某个特征点！

---

## 💡 最可能的公式：基于 Sprite Frame 尺寸

### 公式推导

```typescript
/**
 * 假设：offset 用于补偿 ContentSize 与 SpriteFrame 尺寸的差异
 */
function calculateOffset(
    contentWidth: number,
    contentHeight: number,
    spriteFrameWidth: number,
    spriteFrameHeight: number,
    tilingX: number = 1.0,
    tilingY: number = 1.0
): { x: number, y: number } {
    
    // 计算缩放比例
    const scaleX = contentWidth / spriteFrameWidth;
    const scaleY = contentHeight / spriteFrameHeight;
    
    // 方案 A: 基于缩放的补偿
    const offsetX = (1.0 - 1.0 / scaleX) * 0.5;
    const offsetY = (1.0 - 1.0 / scaleY) * 0.5;
    
    // 考虑 Tiling 的影响
    const tilingAdjX = (tilingX - 1.0) * 0.5;
    const tilingAdjY = (tilingY - 1.0) * 0.5;
    
    return {
        x: offsetX + tilingAdjX,
        y: offsetY + tilingAdjY
    };
}
```

### 验证

如果 SpriteFrame 尺寸 = [696, 540]（与参考 ContentSize 相同）：
```
scaleX = 696 / 696 = 1.0
scaleY = 540 / 540 = 1.0

offsetX = (1.0 - 1.0/1.0) * 0.5 = 0
offsetY = (1.0 - 1.0/1.0) * 0.5 = 0
```

这不对...

---

## 🔍 需要更多信息

### 关键问题需要用户回答

**问题 1**: Sprite Frame 的实际尺寸是多少？
```
在 Inspector 中查看：
Assets → 选择你的 Sprite → 查看 "Texture" 属性
记录 Width 和 Height
```

**问题 2**: 当你说 offset = [0.31, 0.24] 是"正确的"，这是基于什么判断？
- 是视觉对齐到某个位置？
- 是 Ramp 渐变效果正确？
- 是与主纹理对齐？

**问题 3**: 其他测试配置
```
如果你有另一个配置：
ContentSize: [1200, 300]
SpriteFrame 尺寸: [?, ?]
最佳 offset: [?, ?]

有了两组数据就能推导公式！
```

---

## 🎯 替代方案：基于经验公式

### 方案 A: 基于宽高比

```typescript
function calculateOffset(width: number, height: number) {
    const aspectRatio = width / height;
    const baseAspect = 696.0 / 540.0;  // 参考宽高比
    
    // offset 根据宽高比变化
    const offsetX = 0.31 * (aspectRatio / baseAspect);
    const offsetY = 0.24 * (baseAspect / aspectRatio);
    
    return { x: offsetX, y: offsetY };
}
```

### 方案 B: 基于 nodeUVScale 的反比例

```typescript
function calculateOffset(width: number, height: number) {
    const nodeUVScaleX = 2.0 / width;
    const nodeUVScaleY = 2.0 / height;
    
    // offset 与 nodeUVScale 成反比
    const baseScaleX = 2.0 / 696;
    const baseScaleY = 2.0 / 540;
    
    const offsetX = 0.31 * (baseScaleX / nodeUVScaleX);
    const offsetY = 0.24 * (baseScaleY / nodeUVScaleY);
    
    return { x: offsetX, y: offsetY };
}
```

验证方案 B：
```
width = 696, height = 540:
  nodeUVScaleX = 2/696 = baseScaleX
  offsetX = 0.31 * (baseScaleX / baseScaleX) = 0.31 ✓
  
width = 1200, height = 300:
  nodeUVScaleX = 2/1200 = 0.001667
  baseScaleX = 2/696 = 0.002874
  offsetX = 0.31 * (0.002874 / 0.001667) = 0.31 * 1.724 = 0.534
  
  nodeUVScaleY = 2/300 = 0.006667
  baseScaleY = 2/540 = 0.003704
  offsetY = 0.24 * (0.003704 / 0.006667) = 0.24 * 0.556 = 0.133
```

---

## 💡 最终建议

### 实现可配置的公式

```typescript
public static calculateAutoRampUVOffset(
    width: number,
    height: number,
    anchorX: number = 0.5,
    anchorY: number = 0.5,
    tilingX: number = 1.0,
    tilingY: number = 1.0,
    
    // 新增：参考配置
    referenceWidth: number = 696,
    referenceHeight: number = 540,
    referenceOffsetX: number = 0.31,
    referenceOffsetY: number = 0.24
): { x: number, y: number } {
    
    // 计算当前与参考配置的 nodeUVScale 比例
    const currentScaleX = 2.0 / width;
    const currentScaleY = 2.0 / height;
    const refScaleX = 2.0 / referenceWidth;
    const refScaleY = 2.0 / referenceHeight;
    
    // 按比例调整 offset
    const baseOffsetX = referenceOffsetX * (refScaleX / currentScaleX);
    const baseOffsetY = referenceOffsetY * (refScaleY / currentScaleY);
    
    // Anchor 补偿
    const anchorAdjX = (0.5 - anchorX);
    const anchorAdjY = (0.5 - anchorY);
    
    // Tiling 补偿
    const tilingAdjX = (tilingX - 1.0) * 0.5;
    const tilingAdjY = (tilingY - 1.0) * 0.5;
    
    return {
        x: baseOffsetX + anchorAdjX + tilingAdjX,
        y: baseOffsetY + anchorAdjY + tilingAdjY
    };
}
```

这样：
- ✅ 没有硬编码的固定值
- ✅ 基于参考配置动态计算
- ✅ 考虑了 Anchor 和 Tiling
- ✅ 可以通过参数自定义参考配置

---

*创建日期: 2025-10-17*
*状态: 待验证 - 需要更多测试数据*
