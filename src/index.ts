export { default as CustomCursor } from './CustomCursor';
// If you have types to export:
export type { CustomCursorProps } from './CustomCursor';

// Legacy types for backward compatibility
export type { Position, TargetPosition } from './types';

// New simplified API types
export type {
  CursorPosition,
  CursorOffset,
  CursorMoveHandler,
  CursorVisibilityHandler,
  NullablePosition,
} from './types';
