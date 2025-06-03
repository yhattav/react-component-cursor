# CustomCursor API Audit & Consistency Proposal

## 🎯 Current State Analysis

### Existing Props Interface
```typescript
interface CustomCursorProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  offsetX?: number;
  offsetY?: number;
  zIndex?: number;
  smoothFactor?: number;
  containerRef?: React.RefObject<HTMLElement>;
  onMove?: (x: number, y: number) => void;
  hideNativeCursor?: boolean;
  onVisibilityChanged?: (isVisible: boolean) => void;
}
```

## 🚨 Issues Identified

### 1. Naming Inconsistencies
- **Mixed Conventions**: `offsetX`/`offsetY` vs `onMove`/`onVisibilityChanged`
- **Negative Boolean**: `hideNativeCursor` (should be positive: `showNativeCursor`)
- **Unclear Naming**: `smoothFactor` could be `smoothness` or `animationSpeed`

### 2. Type Structure Issues
- **Position Types**: `Position` allows null but `TargetPosition` doesn't
- **Missing Unions**: No enums for common values (cursor states, update modes)
- **Loose Types**: `onMove` callback could include more context

### 3. Prop Organization
- **Mixed Concerns**: Styling, behavior, and event props mixed together
- **No Logical Grouping**: Props not organized by functionality
- **Missing Relationships**: Some props affect others but no clear indication

### 4. Missing Essential Props
- **Control Props**: No `disabled`, `enabled`, or `active` prop
- **Update Control**: No way to control when cursor updates
- **Boundary Control**: No way to constrain cursor within bounds
- **Performance**: No `throttle` or `debounce` options

### 5. Default Value Issues
- **High zIndex**: Default 9999 may be too aggressive
- **Magic Numbers**: Hardcoded animation values
- **Inconsistent Defaults**: Some props have defaults, others don't

## 💡 Proposed Solution

### 1. Reorganized Props Interface

```typescript
// Core types
export type CursorPosition = {
  x: number;
  y: number;
};

export type CursorOffset = {
  x: number;
  y: number;
};

export type CursorBounds = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type CursorUpdateMode = 'mousemove' | 'mouseenter' | 'both';

export type CursorState = 'idle' | 'moving' | 'hidden' | 'disabled';

// Event handler types
export type CursorMoveHandler = (
  position: CursorPosition,
  state: CursorState
) => void;

export type CursorVisibilityHandler = (
  isVisible: boolean,
  reason: 'container' | 'bounds' | 'disabled'
) => void;

export type CursorStateHandler = (
  state: CursorState,
  previousState: CursorState
) => void;

// Main props interface - organized by concern
export interface CustomCursorProps {
  // Core Configuration
  id?: string;
  enabled?: boolean;
  
  // Content & Styling
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
  
  // Positioning & Movement
  offset?: CursorOffset | { x: number; y: number };
  smoothness?: number; // 0 = instant, higher = smoother
  bounds?: CursorBounds;
  containerRef?: React.RefObject<HTMLElement>;
  
  // Behavior
  showNativeCursor?: boolean;
  updateOn?: CursorUpdateMode;
  throttleMs?: number;
  
  // Event Handlers
  onMove?: CursorMoveHandler;
  onVisibilityChange?: CursorVisibilityHandler;
  onStateChange?: CursorStateHandler;
}
```

### 2. Improved Type Definitions

```typescript
// Consistent position types
export type Position = {
  x: number;
  y: number;
};

export type NullablePosition = {
  x: number | null;
  y: number | null;
};

// State management
export const CURSOR_STATES = {
  IDLE: 'idle',
  MOVING: 'moving', 
  HIDDEN: 'hidden',
  DISABLED: 'disabled'
} as const;

export const UPDATE_MODES = {
  MOUSEMOVE: 'mousemove',
  MOUSEENTER: 'mouseenter', 
  BOTH: 'both'
} as const;
```

### 3. Breaking Changes Summary

| Current Prop | New Prop | Change Type | Reason |
|--------------|----------|-------------|---------|
| `offsetX` & `offsetY` | `offset` | **Breaking** | Single object is cleaner |
| `hideNativeCursor` | `showNativeCursor` | **Breaking** | Positive boolean is clearer |
| `smoothFactor` | `smoothness` | **Breaking** | More intuitive naming |
| `onVisibilityChanged` | `onVisibilityChange` | **Breaking** | Consistent with React naming |
| - | `enabled` | **New** | Essential control prop |
| - | `updateOn` | **New** | Performance control |
| - | `bounds` | **New** | Constraint control |
| - | `throttleMs` | **New** | Performance control |
| - | `onStateChange` | **New** | Better state management |

### 4. Enhanced Event Handlers

```typescript
// Before: Limited context
onMove?: (x: number, y: number) => void;

// After: Rich context
onMove?: (position: CursorPosition, state: CursorState) => void;

// Before: Basic visibility
onVisibilityChanged?: (isVisible: boolean) => void;

// After: Contextual visibility
onVisibilityChange?: (isVisible: boolean, reason: 'container' | 'bounds' | 'disabled') => void;
```

## 🔄 Migration Strategy

### Phase 1: Backward Compatible Additions
1. Add new props alongside existing ones
2. Add deprecation warnings for old props
3. Maintain full backward compatibility

### Phase 2: Gradual Migration
1. Update documentation to show new API
2. Provide migration guide and codemod
3. Add migration helper utilities

### Phase 3: Breaking Changes (v2.0)
1. Remove deprecated props
2. Update all examples and documentation
3. Release with clear migration path

## 📝 Implementation Plan

### 1. Type Definitions Update
- [ ] Create new type definitions in `types.ts`
- [ ] Export all types from main index
- [ ] Add JSDoc comments for all types

### 2. Props Interface Evolution
- [ ] Extend `CustomCursorProps` with new props
- [ ] Add deprecation warnings for old props
- [ ] Implement prop validation

### 3. Component Logic Updates
- [ ] Support both old and new prop formats
- [ ] Add new functionality (bounds, throttling, etc.)
- [ ] Improve event handler context

### 4. Documentation & Examples
- [ ] Update README with new API
- [ ] Create migration guide
- [ ] Add TypeScript examples

## ✅ Success Criteria

### API Consistency
- [ ] All prop names follow consistent conventions
- [ ] Types are logically organized and named
- [ ] Event handlers provide rich context
- [ ] Default values are sensible and documented

### Developer Experience
- [ ] Clear TypeScript autocomplete
- [ ] Helpful error messages for invalid props
- [ ] Logical prop grouping
- [ ] Comprehensive documentation

### Backward Compatibility
- [ ] Existing code continues to work
- [ ] Clear migration path provided
- [ ] Deprecation warnings are helpful
- [ ] No breaking changes until v2.0

---

**Next Steps**: Review this proposal and approve the direction before implementation begins. 