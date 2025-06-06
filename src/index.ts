export { default as CustomCursor } from './CustomCursor';
export type { CustomCursorProps } from './CustomCursor';

// New API types
export type {
  CursorPosition,
  CursorOffset,
  CursorMoveHandler,
  CursorVisibilityHandler,
  CursorVisibilityReason,
  CursorState,
  CursorMode,
  NullablePosition,
} from './types.js';

// SSR utilities for advanced use cases
export {
  isSSR,
  isBrowser,
  browserOnly,
  safeDocument,
  safeWindow,
} from './utils/ssr';
