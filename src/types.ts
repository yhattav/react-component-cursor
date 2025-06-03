// Legacy position types (kept for internal use)
export type Position = {
  x: number;
  y: number;
};

export type NullablePosition = {
  x: number | null;
  y: number | null;
};

// Legacy type for backward compatibility
export type TargetPosition = {
  x: number;
  y: number;
};

// Essential new types (simplified)
export type CursorPosition = {
  x: number;
  y: number;
};

export type CursorOffset = {
  x: number;
  y: number;
};

// Enhanced event handler types (backward compatible)
export type CursorMoveHandler = (
  position: CursorPosition
) => void;

export type CursorVisibilityHandler = (
  isVisible: boolean,
  reason: 'container' | 'disabled'
) => void; 