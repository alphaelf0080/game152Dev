# 🧪 快速验证指南 - Ramp UV Offset 公式

## 📋 验证目标

验证我们的通用公式是否正确：

```typescript
finalOffset = baseOffset + anchorAdjustment + tilingAdjustment
```

---

## ✅ 测试步骤

### 测试 1: ContentSize 不影响 Offset

**目的**：证明 offset 不随 ContentSize 变化

#### 步骤：

1. **设置初始配置**
   ```
   ContentSize: [1200, 300]
   Anchor Point: [0.5, 0.5]
   Tiling & Offset: [1, 1, 0, 0]
   ```

2. **查看 Console 输出**
   ```
   RampUVOffset (自動): (0.3100, 0.2400)
   ```

3. **改变 ContentSize**
   ```
   改为: [696, 540]
   改为: [512, 512]
   改为: [1920, 1080]
   ```

4. **验证结果**
   - ✅ 所有情况下 offset 都应该是 `[0.31, 0.24]`
   - ✅ Console 显示 "基礎值: [0.31, 0.24]"
   - ✅ Console 显示 "Anchor 補償: [0.00, 0.00]"
   - ✅ Console 显示 "Tiling 補償: [0.00, 0.00]"

---

### 测试 2: Anchor Point 的影响

**目的**：验证 Anchor 补偿公式 `(0.5 - anchor)`

#### 步骤：

1. **保持 ContentSize 不变**
   ```
   ContentSize: [1200, 300]
   Tiling: [1, 1]
   ```

2. **测试不同 Anchor Point**

   | Anchor | 预期 Adjustment | 预期 Offset | 计算公式 |
   |--------|----------------|-------------|----------|
   | [0.5, 0.5] | [0, 0] | [0.31, 0.24] | base + 0 |
   | [0, 0] | [0.5, 0.5] | [0.81, 0.74] | base + 0.5 |
   | [1, 1] | [-0.5, -0.5] | [-0.19, -0.26] | base - 0.5 |
   | [0.25, 0.75] | [0.25, -0.25] | [0.56, -0.01] | base + adj |

3. **验证 Console 输出**
   ```
   Anchor Point: (0, 0)
   RampUVOffset (自動): (0.8100, 0.7400)
   ↳ 基礎值: [0.31, 0.24]
   ↳ Anchor 補償: [0.50, 0.50]  ← 应该显示这个！
   ↳ Tiling 補償: [0.00, 0.00]
   ```

---

### 测试 3: Tiling 的影响

**目的**：验证 Tiling 补偿公式 `(tiling - 1) * 0.5`

#### 步骤：

1. **保持其他参数不变**
   ```
   ContentSize: [1200, 300]
   Anchor Point: [0.5, 0.5]
   ```

2. **测试不同 Tiling**

   | Tiling | 预期 Adjustment | 预期 Offset | 计算公式 |
   |--------|----------------|-------------|----------|
   | [1, 1] | [0, 0] | [0.31, 0.24] | base + 0 |
   | [2, 2] | [0.5, 0.5] | [0.81, 0.74] | base + 0.5 |
   | [3, 3] | [1.0, 1.0] | [1.31, 1.24] | base + 1.0 |
   | [1.5, 1.5] | [0.25, 0.25] | [0.56, 0.49] | base + 0.25 |

3. **如何改变 Tiling**
   
   在 `MtrC.mtl` 组件中：
   ```
   找到 "Tiling & Offset" 参数
   第一个值 (X): Tiling X
   第二个值 (Y): Tiling Y
   第三个值 (Z): Offset X
   第四个值 (W): Offset Y
   ```

4. **验证 Console 输出**
   ```
   Sprite Tiling: (2, 2)
   RampUVOffset (自動): (0.8100, 0.7400)
   ↳ 基礎值: [0.31, 0.24]
   ↳ Anchor 補償: [0.00, 0.00]
   ↳ Tiling 補償: [0.50, 0.50]  ← 应该显示这个！
   ```

---

### 测试 4: 组合测试

**目的**：验证所有因素同时起作用

#### 测试案例 A：

```
ContentSize: [1024, 768]
Anchor Point: [0, 0]
Tiling: [2, 2]

预期计算：
  base = [0.31, 0.24]
  anchorAdj = [0.5, 0.5]
  tilingAdj = [0.5, 0.5]
  
预期结果：offset = [1.31, 1.24]
```

#### 测试案例 B：

```
ContentSize: [512, 512]
Anchor Point: [1, 1]
Tiling: [1, 1]

预期计算：
  base = [0.31, 0.24]
  anchorAdj = [-0.5, -0.5]
  tilingAdj = [0, 0]
  
预期结果：offset = [-0.19, -0.26]
```

---

## 🔍 如何检查计算是否正确

### 方法 1: 查看 Console 日志

打开 Cocos Creator 的 Console 面板，你应该看到：

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

**关键检查点**：
- ✅ "基礎值" 应该总是 `[0.31, 0.24]`
- ✅ "Anchor 補償" 应该等于 `(0.5 - Anchor)`
- ✅ "Tiling 補償" 应该等于 `(Tiling - 1) * 0.5`
- ✅ "RampUVOffset" 应该等于 三者之和

### 方法 2: 查看 Inspector 面板

在 `MtrC.mtl` 组件中，查看 `Ramp UV Offset` 的值：

```
Ramp UV Offset:
  X: 0.31
  Y: 0.24
```

这个值应该与 Console 中的 "RampUVOffset (自動)" 匹配。

### 方法 3: 观察视觉效果

在 Scene 视图中：
- ✅ Ramp 渐变应该从 1（亮）→ 0（暗）
- ✅ 没有意外的重复或跳跃
- ✅ 红色箭头指向的位置应该正确对齐

---

## 📊 预期结果总结

### 当所有参数为标准配置时：

```
ContentSize: 任意
Anchor: [0.5, 0.5]
Tiling: [1, 1]

→ Offset 应该总是 [0.31, 0.24]
```

### 当改变 Anchor 时：

```
Anchor [0, 0]   → Offset [0.81, 0.74]  (增加 0.5)
Anchor [1, 1]   → Offset [-0.19, -0.26] (减少 0.5)
Anchor [0.5, 0.5] → Offset [0.31, 0.24]  (不变)
```

### 当改变 Tiling 时：

```
Tiling [1, 1]   → Offset [0.31, 0.24]  (不变)
Tiling [2, 2]   → Offset [0.81, 0.74]  (增加 0.5)
Tiling [3, 3]   → Offset [1.31, 1.24]  (增加 1.0)
```

---

## ⚠️ 常见问题

### Q1: Console 没有输出日志？

**解决方案**：
1. 确保 `Show Detailed Logs` 已勾选 ✓
2. 确保 `Auto Calculate On Load` 已勾选 ✓
3. 尝试手动点击 `Recalculate Node UV Scale` 按钮

### Q2: Offset 值不对？

**检查清单**：
1. ✅ 确认 `Auto Calculate Offset` 已勾选
2. ✅ 确认 `Enable Manual Input` 未勾选（除非你在手动测试）
3. ✅ 检查 Anchor Point 是否正确
4. ✅ 检查 Tiling 是否正确

### Q3: 视觉效果不正确？

**可能原因**：
1. `nodeUVScale` 可能没有正确设置
2. `rampUVScale` 可能不是 [1, 1]
3. Sprite 的主纹理可能有问题
4. Shader 可能有其他参数影响

---

## ✅ 验证清单

测试完成后，勾选以下项目：

- [ ] 测试 1: 不同 ContentSize，offset 保持不变
- [ ] 测试 2: Anchor [0.5, 0.5] → offset [0.31, 0.24]
- [ ] 测试 2: Anchor [0, 0] → offset [0.81, 0.74]
- [ ] 测试 2: Anchor [1, 1] → offset [-0.19, -0.26]
- [ ] 测试 3: Tiling [1, 1] → offset [0.31, 0.24]
- [ ] 测试 3: Tiling [2, 2] → offset [0.81, 0.74]
- [ ] 测试 4: 组合测试通过
- [ ] Console 日志正确显示所有补偿值
- [ ] 视觉效果符合预期

---

## 🎯 下一步

如果所有测试通过：
- ✅ 公式已验证正确
- ✅ 可以在生产环境使用
- ✅ 适用于所有配置组合

如果有测试失败：
- ⚠️ 检查失败的具体案例
- ⚠️ 查看 Console 输出的详细信息
- ⚠️ 可能需要调整基础值或补偿公式

---

*创建日期: 2025-10-17*
*状态: 待验证*
