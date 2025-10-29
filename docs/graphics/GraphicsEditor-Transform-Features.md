# Graphics Editor - 图形变换和调整功能

## 功能概述

为 Graphics Editor 添加了 Photoshop 风格的图形变换和调整功能，允许用户在绘制完成后对图形进行移动、缩放和调整。

## 核心功能

### 1. 图形选择和变换句柄

#### 显示方式
- **选中图形**：右键点击或 Ctrl/Cmd + 点击图形进行选中
- **变换句柄**：显示 8 个调整句柄
  - **4 个角**：用于对角线缩放（保持/不保持比例）
  - **4 个边中点**：用于水平/竖直方向缩放
  - **中心点**：黄色圆点，用于移动整个图形

#### 光标指示
| 句柄位置 | 光标样式 | 变换类型 |
|---------|--------|--------|
| 左上、右下角 | `nwse-resize` | 对角线缩放 |
| 右上、左下角 | `nesw-resize` | 对角线缩放（反向） |
| 上、下边中点 | `ns-resize` | 竖直缩放 |
| 左、右边中点 | `ew-resize` | 水平缩放 |
| 中心点 | `move` | 移动图形 |

### 2. 变换操作

#### 基本变换
```
# 移动图形
- 点击中心点 + 拖拽

# 缩放图形
- 点击任意边中点或角 + 拖拽

# 对角线缩放（四个角）
- 点击角句柄 + 拖拽
```

#### 快捷键修饰符

| 快捷键 | 功能 | 效果 |
|--------|------|------|
| **Shift** | 保持宽高比例 | 缩放时保持原始长宽比，不会变形 |
| **Alt** | 从中心点缩放 | 从图形中心向外/向内缩放，两边均匀 |
| **Shift + Alt** | 结合使用 | 保持比例且从中心缩放 |

#### 快捷键确认/取消

| 快捷键 | 功能 |
|--------|------|
| **Enter** | 确认当前变换，完成调整 |
| **Esc** | 取消变换，恢复到变换前的状态 |
| **Delete** | 删除当前选中的图形 |

### 3. 实时反馈

#### 尺寸显示标签
- **宽度标签**：显示在图形上方（`W: XXX`）
- **高度标签**：显示在图形左侧，旋转 90° 显示（`H: XXX`）
- 实时更新，显示像素精度值

#### 虚线框预览
- 变换过程中显示虚线边框
- 清晰直观地展示变换结果

### 4. 像素对齐（Snap to Pixel）

#### 功能说明
- **启用**（默认）：所有变换坐标和大小自动对齐到整数像素
- **禁用**：允许浮点数坐标和大小

#### 使用方法
```
工具栏 → 变換 → [对齐像素] 复选框
```

#### 代码实现
```typescript
// 启用对齐
const snapPixel = this.snapToPixel ? Math.round : (x: number) => x;
shape.startX = snapPixel(origShape.startX + deltaX);
shape.startY = snapPixel(origShape.startY + deltaY);
// ...
```

## 支持的图形类型

| 图形类型 | 移动 | 缩放 | 比例保持 | 中心缩放 |
|---------|------|------|--------|--------|
| 矩形（Rectangle） | ✅ | ✅ | ✅ | ✅ |
| 圆形（Circle） | ✅ | ✅ | ✅ | ✅ |
| 线条（Line） | ✅ | ✅ | ✅ | ✅ |
| 折线（Polyline） | ✅ | ✅ | ✅ | ✅ |

## 技术实现细节

### 类属性添加

```typescript
// 圖形變換相關
private isTransforming: boolean = false;
private transformMode: string = ''; // 'move', 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
private transformStartX: number = 0;
private transformStartY: number = 0;
private transformStartShape: any = null; // 深複製以支持 Esc 取消
private snapToPixel: boolean = true;
private keepAspectRatio: boolean = false; // Shift 鍵時啟用
private transformFromCenter: boolean = false; // Alt 鍵時啟用
private handleSize: number = 8;
```

### 关键方法

#### `getHandleAtPosition(x: number, y: number): string | null`
- 检测鼠标位置是否在任何变换句柄上
- 返回句柄模式（'move', 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'）或 null

#### `updateShapeTransform(deltaX: number, deltaY: number, e: MouseEvent)`
- 根据变换模式和修饰符计算新的图形坐标
- 处理 Shift（保持比例）和 Alt（中心缩放）
- 应用像素对齐

#### `drawTransformHandles(bounds: any)`
- 绘制 8 个白色方形句柄
- 绘制 4 个边中点句柄
- 绘制黄色圆点表示移动中心
- 绘制宽高尺寸标签

### 事件流程

```
mousedown
  ├─ 检测是否在句柄上 → getHandleAtPosition()
  ├─ 是 → 设置 isTransforming = true
  └─ 保存当前图形状态（用于 Esc 取消）

mousemove
  ├─ 如果 isTransforming
  │  ├─ 计算鼠标移动距离 (deltaX, deltaY)
  │  ├─ 更新图形坐标 → updateShapeTransform()
  │  └─ 重绘画布
  └─ 检查句柄并更新光标

mouseup
  ├─ 如果 isTransforming
  │  └─ 设置 isTransforming = false
  ├─ 更新代码预览
  └─ 重绘画布

键盘事件
  ├─ Enter: 确认变换
  ├─ Esc: 恢复状态
  ├─ Shift: 控制 keepAspectRatio
  └─ Alt: 控制 transformFromCenter
```

## 用户体验流程

### 基本流程

1. **选择图形**
   ```
   右键点击图形 或 Ctrl/Cmd + 点击
   → 显示蓝色虚线框和变换句柄
   ```

2. **开始变换**
   ```
   点击任意句柄 + 拖拽
   → 实时显示虚线预览框和尺寸标签
   ```

3. **应用修饰符**（可选）
   ```
   按住 Shift 保持比例
   或 Alt 从中心缩放
   或 Shift + Alt 同时使用
   ```

4. **完成变换**
   ```
   松开鼠标 或 按 Enter 键
   → 变换生效
   ```

5. **取消变换**（如需要）
   ```
   按 Esc 键
   → 恢复到变换前状态
   ```

### 高级操作

#### 精确的像素调整
```
1. 启用"对齐像素"复选框（默认启用）
2. 进行变换，坐标自动对齐到整数
3. 禁用"对齐像素"进行浮点调整
```

#### 保持比例的缩放
```
1. 选中图形
2. 按住 Shift 键
3. 拖拽任意角句柄
4. 松开鼠标完成
```

#### 从中心缩放
```
1. 选中图形
2. 按住 Alt 键
3. 拖拽任意边中点或角
4. 图形从中心向外或向内缩放
```

## 代码生成影响

- 变换后的图形坐标会自动保存到 `shape` 对象
- 代码导出会使用变换后的坐标
- 圆角、颜色、填充模式等属性保持不变

## 调试信息

启用浏览器控制台可以查看：

```javascript
// 变换开始
[Graphics Editor] 已選取圖形 1

// 快捷键操作
[Graphics Editor] Snap to pixel: 啟用
[Graphics Editor] Snap to pixel: 禁用
```

## 兼容性

- ✅ 所有现代浏览器（Chrome, Firefox, Safari, Edge）
- ✅ 触摸设备不支持（鼠标事件）
- ✅ 支持多监视器高 DPI 屏幕

## 后续改进空间

- [ ] 触摸设备支持（touch 事件）
- [ ] 旋转变换功能
- [ ] 变换历史记录（Undo/Redo）
- [ ] 多选图形同时变换
- [ ] 对齐网格功能
- [ ] 吸附到其他图形
- [ ] 变换状态的 JSON 导出/导入

## 提交信息

**Commit**: 1d9350c
**Branch**: main
**Date**: 2025年10月28日

feat: Graphics Editor - 添加图形变换和调整功能 (Photoshop风格)
