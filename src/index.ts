export { default as CustomCursor } from './CustomCursor';
export type { CustomCursorProps } from './CustomCursor';

export { CursorSpotlight } from './CursorSpotlight';
export type { CursorSpotlightProps } from './CursorSpotlight';

export { AnimatedBorder } from './AnimatedBorder';
export type { AnimatedBorderProps } from './AnimatedBorder';

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
