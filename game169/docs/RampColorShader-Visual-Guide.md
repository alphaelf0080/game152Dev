# RampColorShader UV System - Visual Comparison

## 📊 UV System Comparison

### Old System (v1.x) - Each Tile Has Independent 0-1 UV ❌

```
TILED 3x3 Sprite with Horizontal Ramp:

┌─────────┬─────────┬─────────┐
│ 0 → 1   │ 0 → 1   │ 0 → 1   │  Each tile:
│ ░░░░▒▒▒▒│ ░░░░▒▒▒▒│ ░░░░▒▒▒▒│  - Has its own 0-1 UV
├─────────┼─────────┼─────────┤  - Shows complete gradient
│ 0 → 1   │ 0 → 1   │ 0 → 1   │  - Effect repeats 9 times
│ ░░░░▒▒▒▒│ ░░░░▒▒▒▒│ ░░░░▒▒▒▒│
├─────────┼─────────┼─────────┤
│ 0 → 1   │ 0 → 1   │ 0 → 1   │
│ ░░░░▒▒▒▒│ ░░░░▒▒▒▒│ ░░░░▒▒▒▒│
└─────────┴─────────┴─────────┘

❌ Problems:
- Each tile repeats the effect
- Tile boundaries are visible
- Not an independent UV system
```

### New System (v2.0) - Entire Sprite Has Single 0-1 UV ✅

```
TILED 3x3 Sprite with Horizontal Ramp:

┌───────────────────────────────┐
│         0 ──────→ 1           │  Entire sprite:
│                               │  - Single 0-1 UV space
│  ░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓ │  - Continuous gradient
│                               │  - No tile boundaries
│                               │  - True independent UV
└───────────────────────────────┘

UV Coordinates:
Left edge   (tile 0): UV = 0.0
Center      (tile 1): UV = 0.5  
Right edge  (tile 2): UV = 1.0

✅ Correct:
- Single continuous effect
- No repetition
- Independent UV system
```

## 🔢 UV Calculation Examples

### TILED 3x3 Sprite

#### Vertex Positions and UV Coordinates

```
Grid Layout (a_texCoord values):

3.0 ┌─────────┬─────────┬─────────┐
    │ (0,2)   │ (1,2)   │ (2,2)   │
    │  to     │  to     │  to     │
    │ (1,3)   │ (2,3)   │ (3,3)   │
2.0 ├─────────┼─────────┼─────────┤
    │ (0,1)   │ (1,1)   │ (2,1)   │
    │  to     │  to     │  to     │
    │ (1,2)   │ (2,2)   │ (3,2)   │
1.0 ├─────────┼─────────┼─────────┤
    │ (0,0)   │ (1,0)   │ (2,0)   │
    │  to     │  to     │  to     │
    │ (1,1)   │ (2,1)   │ (3,1)   │
0.0 └─────────┴─────────┴─────────┘
   0.0       1.0       2.0       3.0
```

#### effectUV Calculation

```glsl
// Shader code:
vec2 tileCount = vec2(3.0, 3.0);
effectUV = a_texCoord / tileCount;
```

**Sample Points:**

| Tile | a_texCoord | effectUV | Position |
|------|------------|----------|----------|
| (0,0) | (0.0, 0.0) | (0.00, 0.00) | Bottom-left corner |
| (0,0) | (0.5, 0.5) | (0.17, 0.17) | Center of tile (0,0) |
| (1,1) | (1.5, 1.5) | (0.50, 0.50) | Center of tile (1,1) = CENTER |
| (2,2) | (2.5, 2.5) | (0.83, 0.83) | Center of tile (2,2) |
| (2,2) | (3.0, 3.0) | (1.00, 1.00) | Top-right corner |

✅ Result: effectUV ranges from (0,0) to (1,1) across entire sprite!

## 🎨 Visual Effect Examples

### Example 1: Horizontal Gradient

```
Settings:
  tilingOffset: [3, 3, 0, 0]
  rampUVScale: [1, 1]
  RAMP_DIRECTION: 0 (horizontal)
  colorStart: Black
  colorEnd: White

Result:
┌─────────────────────────────────────┐
│                                     │
│  ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                     │
└─────────────────────────────────────┘
 Black                            White

✅ Single smooth gradient
✅ No tile boundaries visible
```

### Example 2: Circular Gradient

```
Settings:
  tilingOffset: [3, 3, 0, 0]
  rampUVScale: [1, 1]
  RAMP_DIRECTION: 2 (circular)
  rampCenter: [0.5, 0.5]

Result:
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░███████░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░███████████████░░░░░░░░░░░ │
│ ░░░░░░░░░░░███████░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────┘
           Center at (0.5, 0.5)

✅ Single circular gradient
✅ Center at sprite center
✅ Symmetric around center
```

### Example 3: Repeated Pattern

```
Settings:
  tilingOffset: [3, 3, 0, 0]
  rampUVScale: [3, 3]  ← Repeat 3x3
  RAMP_DIRECTION: 0 (horizontal)

Old System (WRONG):
┌─────────┬─────────┬─────────┐
│░▒░▒░▒│░▒░▒░▒│░▒░▒░▒│  Each tile repeats 3x
│░▒░▒░▒│░▒░▒░▒│░▒░▒░▒│  = 9 tiles × 3 = 27 repetitions
└─────────┴─────────┴─────────┘

New System (CORRECT):
┌───────────────────────────────┐
│░░░▒▒▒███░░░▒▒▒███░░░▒▒▒███│  3 repetitions across
│░░░▒▒▒███░░░▒▒▒███░░░▒▒▒███│  entire sprite
│░░░▒▒▒███░░░▒▒▒███░░░▒▒▒███│  (3 horizontal × 3 vertical)
└───────────────────────────────┘

✅ Repeat pattern based on entire sprite
✅ Not per-tile repetition
```

## 📐 Key Parameters Guide

### tilingOffset.xy - Tile Count

```
Must match your sprite configuration:

Simple Sprite:           TILED 2x2:           TILED 3x3:
┌─────────────┐         ┌─────┬─────┐        ┌───┬───┬───┐
│             │         │     │     │        │   │   │   │
│   [1, 1]    │         │ [2, │  2] │        │[3,│ 3,│ 3]│
│             │         │     │     │        │   │   │   │
└─────────────┘         └─────┴─────┘        └───┴───┴───┘

tilingOffset: [1,1,0,0]  tilingOffset: [2,2,0,0]  tilingOffset: [3,3,0,0]
```

### rampUVScale - Repeat Count

```
Controls how many times the ramp repeats across the ENTIRE sprite:

[1, 1] - No repeat:      [2, 2] - 2x2 repeat:    [3, 1] - 3x1 repeat:
┌─────────────────┐      ┌────────┬────────┐     ┌───┬───┬───┐
│                 │      │        │        │     │   │   │   │
│  ░░░░░░░▒▒▒▒▒▒▒ │      │ ░░▒▒▒  │ ░░▒▒▒  │     │░░▒│░░▒│░░▒│
│                 │      ├────────┼────────┤     │   │   │   │
└─────────────────┘      │ ░░▒▒▒  │ ░░▒▒▒  │     └───┴───┴───┘
                         └────────┴────────┘
```

### rampCenter - Center Point (for circular/radial)

```
Coordinate system: [0-1, 0-1] relative to entire sprite

[0.0, 0.0]              [0.5, 0.5]              [1.0, 1.0]
Bottom-left             Center                  Top-right
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│              ⊙  │     │        ⊙        │     │  ⊙              │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘

[0.25, 0.75]            [0.75, 0.25]
Custom positions
```

## 🔧 Troubleshooting Visual Guide

### Problem: Tiling Effect Visible

```
What you see (WRONG):
┌─────┬─────┬─────┐
│░░▒▒▒│░░▒▒▒│░░▒▒▒│  ← Tile boundaries visible
│     │     │     │     Each tile has same gradient
└─────┴─────┴─────┘

Cause: tilingOffset.xy incorrect

Solution: Set to actual tile count
tilingOffset: [3, 3, 0, 0]  (for 3x3)

What you should see (CORRECT):
┌───────────────────┐
│░░░░░░░░▒▒▒▒▒▒▒▓▓▓│  ← Smooth, continuous
│                   │     No tile boundaries
└───────────────────┘
```

### Problem: Effect Jumps/Discontinuous

```
What you see:
┌───────────────────┐
│  ▒▒▒███████░░░░   │  ← Offset/wrapped
│                   │
└───────────────────┘

Cause: tilingOffset.zw not [0, 0]

Solution: Reset offset
tilingOffset: [3, 3, 0, 0]
                    ^^^^
                    Must be 0, 0
```

## ✅ Quick Verification

### Test Setup
```yaml
1. Create TILED 3x3 Sprite
2. Apply RampColorShader
3. Set:
   tilingOffset: [3, 3, 0, 0]
   rampUVScale: [1, 1]
   RAMP_DIRECTION: 0
   colorStart: Black [0,0,0,255]
   colorEnd: White [255,255,255,255]
```

### Expected Result
```
✅ PASS if you see:
   - Single smooth gradient left to right
   - No visible tile boundaries
   - Continuous color transition

❌ FAIL if you see:
   - 3 or 9 separate gradients
   - Tile grid visible
   - Color jumps at tile edges
```

---

**Visual Guide Version**: 1.0  
**For**: RampColorShader v2.0 - Independent UV System  
**Date**: 2025-10-16
