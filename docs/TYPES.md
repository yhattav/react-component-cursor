# TypeScript Types Reference

Complete TypeScript type definitions for `@yhattav/react-component-cursor`.

## Core Types

### Import Statement

```tsx
import type {
  CustomCursorProps,
  CursorPosition,
  CursorOffset,
  CursorMoveHandler,
  CursorVisibilityHandler,
  CursorVisibilityReason,
} from '@yhattav/react-component-cursor';
```

---

### `CursorPosition`

```tsx
type CursorPosition = {
  x: number;
  y: number;
};
```

Represents a cursor position with x and y coordinates in pixels.

**Usage:**
```tsx
const handleMove = (position: CursorPosition) => {
  console.log(`Cursor at: ${position.x}, ${position.y}`);
};
```

---

### `CursorOffset`

```tsx
type CursorOffset = {
  x: number;
  y: number;
};
```

Offset values applied to cursor position. Positive values move right/down, negative values move left/up.

**Usage:**
```tsx
<CustomCursor 
  offset={{ x: 10, y: -5 }} // 10px right, 5px up
>
  <MyCursor />
</CustomCursor>
```

---

### `CursorMoveHandler`

```tsx
type CursorMoveHandler = (position: CursorPosition) => void;
```

Function type for the `onMove` callback.

**Usage:**
```tsx
const trackMovement: CursorMoveHandler = useCallback((position) => {
  // Track cursor movement
  analytics.track('cursor_move', position);
}, []);

<CustomCursor onMove={trackMovement}>
  <MyCursor />
</CustomCursor>
```

---

### `CursorVisibilityHandler`

```tsx
type CursorVisibilityHandler = (
  isVisible: boolean, 
  reason: CursorVisibilityReason
) => void;
```

Function type for the `onVisibilityChange` callback.

**Usage:**
```tsx
const handleVisibilityChange: CursorVisibilityHandler = (isVisible, reason) => {
  if (!isVisible && reason === 'touch') {
    console.log('Cursor hidden on touch device');
  }
};

<CustomCursor onVisibilityChange={handleVisibilityChange}>
  <MyCursor />
</CustomCursor>
```

---

### `CursorVisibilityReason`

```tsx
type CursorVisibilityReason = 
  | 'container'      // Cursor hidden/shown due to container bounds
  | 'disabled'       // Cursor hidden due to enabled=false
  | 'touch'          // Cursor hidden on touch devices
  | 'reducedMotion'  // Cursor hidden due to accessibility preferences
  | 'accessibility'  // Cursor hidden due to accessibility features
  | string;          // Future reasons (forward compatible)
```

Indicates why cursor visibility changed.

**Reason Details:**
- **`container`**: Cursor moved outside/inside container bounds
- **`disabled`**: Cursor disabled via `enabled={false}` prop
- **`touch`**: Automatically hidden on touch devices
- **`reducedMotion`**: Hidden due to `prefers-reduced-motion` setting
- **`accessibility`**: Hidden due to accessibility features
- **`string`**: Future-compatible for additional reasons

---

## Future-Ready Types (Reserved for v2+)

> **Note:** These types are reserved for future versions and are not yet implemented.

### Import Statement

```tsx
import type {
  CursorState,
  CursorMode,
} from '@yhattav/react-component-cursor';
```

### `CursorState`

```tsx
type CursorState = 
  | 'idle' 
  | 'hover' 
  | 'click' 
  | 'drag' 
  | string;
```

**Reserved for future versions.** Will enable cursor state management and automatic state-based styling.

**Planned Usage (v2+):**
```tsx
<CustomCursor state="hover">
  <StatefulCursor />
</CustomCursor>
```

### `CursorMode`

```tsx
type CursorMode = 
  | 'default' 
  | 'pointer' 
  | 'text' 
  | 'grab' 
  | 'grabbing' 
  | string;
```

**Reserved for future versions.** Will enable predefined cursor shapes/modes with automatic behavior.

**Planned Usage (v2+):**
```tsx
<CustomCursor mode="grab">
  <DragCursor />
</CustomCursor>
```

---

## Complete Props Interface

For the complete `CustomCursorProps` interface, see the [API Reference](API_REFERENCE.md).

## Back to Main Documentation

- [← Main README](../README.md)
- [API Reference](API_REFERENCE.md)
- [Performance Guide](PERFORMANCE.md)
- [SSR Guide](SSR.md) 