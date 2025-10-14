# WebSocket Bypass Fix for LocalServerMode

## Problem
When using `?localServer=true`, the game still attempted to connect to the WebSocket server, causing errors:
```
ProtoConsole.ts:108 WebSocket connection to 'ws://dev-gs.iplaystar.net:81/slot' failed:
```

## Root Cause Analysis

### Game Communication Flow
```
UIController.ClickSpin()
    ↓
StateConsole.Spin()
    ↓
StateConsole.nextState()
    ↓
StateConsole.resultCall()
    ↓
ProtoConsole.SendMsg(106)
    ↓
WebSocket.send()
```

### Problems Identified
1. **ProtoConsole.start()** - Was creating WebSocket connection unconditionally
2. **StateConsole.resultCall()** - Was calling `SendMsg(106)` even in local mode

## Solution Implementation

### 1. ProtoConsole.ts Modification
**File**: `pss-on-00152/assets/script/MessageController/ProtoConsole.ts`

**Change**: Modified `start()` method to check local mode before creating WebSocket

```typescript
start() {
    // Check if using LocalServerMode
    const localServerNode = find('LocalServerMode');
    if (localServerNode) {
        const localMode = localServerNode.getComponent(LocalServerMode);
        if (localMode && localMode.isLocalMode()) {
            console.log('[ProtoConsole] LocalServerMode detected, skipping WebSocket creation');
            return;
        }
    }

    // Original WebSocket creation code...
    this.CreateSocket();
}
```

**Result**: WebSocket connection is never created when `?localServer=true` is present

### 2. StateConsole.ts Modification
**File**: `pss-on-00152/assets/script/MessageController/StateConsole.ts`

**Changes**:
1. Added imports:
```typescript
import { LocalServerMode } from '../LocalServer/LocalServerMode';
import { GameResult } from '../LocalServer/LocalResultProvider';
```

2. Modified `resultCall()` method to bypass `SendMsg()` in local mode:
```typescript
resultCall() {
    if (this.CurState == Mode.FSM.K_SPIN || this.CurState == Mode.FSM.K_FEATURE_SPIN) {
        // Check if using LocalServerMode
        const localServerNode = find('LocalServerMode');
        if (localServerNode) {
            const localMode = localServerNode.getComponent(LocalServerMode);
            if (localMode && localMode.isLocalMode()) {
                console.log('[StateConsole] Using local mode, skipping SendMsg');
                // In local mode, result is already set by UIController.handleLocalSpin()
                // Just trigger NetReceiveResult after a short delay
                this.scheduleOnce(() => {
                    this.NetReceiveResult();
                }, 0.1);
                return;
            }
        }

        // Original server communication code...
        if (this.CurState == Mode.FSM.K_FEATURE_SPIN && this.ServerRecoverData != null) {
            // ... recovery code ...
        } else {
            Data.Library.ProtoData.SendMsg(106, this.BuyFs);
        }
    }
}
```

**Result**: Network calls are completely bypassed in local mode

## How It Works Now

### With ?localServer=true
```
1. UIController initializes LocalServerMode
   ↓
2. User clicks Spin button
   ↓
3. UIController.ClickSpin() detects local mode
   ↓
4. UIController.handleLocalSpin() gets local JSON result
   ↓
5. Result is applied to Data.Library.ProtoData
   ↓
6. StateConsole.Spin() proceeds normally
   ↓
7. StateConsole.resultCall() detects local mode
   ↓
8. Directly calls NetReceiveResult() (bypasses SendMsg)
   ↓
9. Game displays result normally
```

### Without ?localServer=true (Normal Server Mode)
```
1. ProtoConsole.start() creates WebSocket connection
   ↓
2. User clicks Spin button
   ↓
3. UIController.ClickSpin() proceeds normally
   ↓
4. StateConsole.resultCall() calls SendMsg(106)
   ↓
5. WebSocket sends request to server
   ↓
6. Server responds with result
   ↓
7. NetReceiveResult() processes server response
   ↓
8. Game displays result
```

## Modified Files Summary

| File | Lines Modified | Purpose |
|------|----------------|---------|
| ProtoConsole.ts | ~30 lines | Skip WebSocket creation in local mode |
| StateConsole.ts | ~15 lines | Skip SendMsg() and directly call NetReceiveResult() |

## Backup Files Created
- `ProtoConsole.ts.backup` - Original before WebSocket bypass
- `StateConsole.ts.backup` - Original before SendMsg bypass

## Testing Checklist

### Local Mode Test (?localServer=true)
- [ ] No WebSocket connection attempts
- [ ] No network errors in console
- [ ] Spin button works
- [ ] Results display correctly
- [ ] Multiple spins work sequentially
- [ ] JSON file switching works (if multiple scenarios)

### Server Mode Test (no URL parameter)
- [ ] WebSocket connects successfully
- [ ] Spin button works
- [ ] Server results display correctly
- [ ] Multiple spins work
- [ ] Disconnection handling works

## Console Output Verification

### Expected in Local Mode:
```
[LocalServerMode] Initialized in LOCAL mode
[LocalServerMode] Loaded X results from: scenarios/base_game.json
[UIController] Using local server mode, handling spin locally
[UIController] Got local result: { ... }
[StateConsole] Using local mode, skipping SendMsg
```

### Expected in Server Mode:
```
[ProtoConsole] Creating WebSocket connection
[ProtoConsole] WebSocket connected
[ProtoConsole] Sending message: 106
[ProtoConsole] Received response: ...
```

## Key Design Principles

1. **Non-Invasive**: Normal server mode is completely unaffected
2. **Early Detection**: Local mode is checked at the earliest possible points
3. **Complete Bypass**: No network code executes in local mode
4. **Clear Logging**: Console messages indicate which mode is active
5. **Fail-Safe**: If LocalServerMode is not available, falls back to normal behavior

## Future Enhancements

### Potential Improvements:
1. Add local mode indicator in UI (e.g., red banner)
2. Add hot-reload for JSON files without page refresh
3. Add result history view for debugging
4. Add manual result selection interface
5. Add result validation before applying

## Related Documentation
- `LocalServer/README.md` - LocalServerMode system overview
- `LocalServer/QUICK_REFERENCE.md` - Quick integration guide
- `docs/LocalServer-Mode-Guide.md` - User guide
- `UIController-LocalServer-Integration.md` - UIController integration details

---

**Last Updated**: 2024-01-XX  
**Status**: ✅ Complete - WebSocket bypass fully implemented
