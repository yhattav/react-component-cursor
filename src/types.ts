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

// Forward-compatible visibility reasons
export type CursorVisibilityReason = 'container' | 'disabled' | 'touch' | 'reducedMotion' | 'accessibility' | string;

// Event handler types with forward compatibility
export type CursorMoveHandler = (
  position: CursorPosition
) => void;

export type CursorVisibilityHandler = (
  isVisible: boolean,
  reason: CursorVisibilityReason
) => void;

// Future-ready state types (optional for now, will enable advanced features)
export type CursorState = 'idle' | 'hover' | 'click' | 'drag' | string;

// Future-ready mode types (optional for now, will enable shapes/modes support)
export type CursorMode = 'default' | 'pointer' | 'text' | 'grab' | 'grabbing' | string; 