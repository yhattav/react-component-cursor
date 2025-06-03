// Position types
export type NullablePosition = {
  x: number | null;
  y: number | null;
};

// New API types
export type CursorPosition = {
  x: number;
  y: number;
};

export type CursorOffset = {
  x: number;
  y: number;
};

// Event handler types
export type CursorMoveHandler = (
  position: CursorPosition
) => void;

export type CursorVisibilityHandler = (
  isVisible: boolean,
  reason: 'container' | 'disabled'
) => void; 