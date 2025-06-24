import type { CustomCursorProps } from '../CustomCursor';

/**
 * Development-only validation that gets tree-shaken in production
 * Validates CustomCursor props and provides helpful error messages
 */
export function validateProps(props: CustomCursorProps): void {
  // The entire function body gets removed in production builds
  if (process.env.NODE_ENV !== 'development') return;

  const { 
    id, 
    smoothness, 
    throttleMs, 
    zIndex, 
    offset, 
    containerRef,
    centered,
    showDevIndicator,
    onMove,
    onVisibilityChange,
  } = props;

  // Validate id (empty strings are allowed since we auto-generate UUIDs)
  if (id !== undefined && typeof id !== 'string') {
    console.error(
      `CustomCursor: 'id' must be a string. Received: ${id} (${typeof id}). Note: empty strings are allowed and will auto-generate a UUID.`
    );
  }

  // Validate smoothness
  if (smoothness !== undefined) {
    if (typeof smoothness !== 'number' || isNaN(smoothness)) {
      console.error(
        `CustomCursor: 'smoothness' must be a number. Received: ${smoothness} (${typeof smoothness})`
      );
    } else if (smoothness < 0) {
      console.error(
        `CustomCursor: 'smoothness' must be non-negative. Received: ${smoothness}. Use 1 for no smoothing, higher values for more smoothing.`
      );
    } else if (smoothness > 20) {
      console.warn(
        `CustomCursor: 'smoothness' value ${smoothness} is very high. Values above 20 may cause poor performance. Consider using a lower value.`
      );
    }
  }

  // Validate throttleMs
  if (throttleMs !== undefined) {
    if (typeof throttleMs !== 'number' || isNaN(throttleMs)) {
      console.error(
        `CustomCursor: 'throttleMs' must be a number. Received: ${throttleMs} (${typeof throttleMs})`
      );
    } else if (throttleMs < 0) {
      console.error(
        `CustomCursor: 'throttleMs' must be non-negative. Received: ${throttleMs}. Use 0 for no throttling.`
      );
    } else if (throttleMs > 100) {
      console.warn(
        `CustomCursor: 'throttleMs' value ${throttleMs} is quite high. This may make the cursor feel sluggish. Consider using a lower value (0-50ms).`
      );
    }
  }

  // Validate zIndex
  if (zIndex !== undefined) {
    if (typeof zIndex !== 'number' || isNaN(zIndex)) {
      console.error(
        `CustomCursor: 'zIndex' must be a number. Received: ${zIndex} (${typeof zIndex})`
      );
    } else if (!Number.isInteger(zIndex)) {
      console.warn(
        `CustomCursor: 'zIndex' should be an integer. Received: ${zIndex}`
      );
    }
  }

  // Validate offset
  if (offset !== undefined) {
    if (typeof offset !== 'object' || offset === null) {
      console.error(
        `CustomCursor: 'offset' must be an object with x and y properties. Received: ${offset}`
      );
    } else {
      const { x, y } = offset as { x?: unknown; y?: unknown };
      if (typeof x !== 'number' || isNaN(x)) {
        console.error(
          `CustomCursor: 'offset.x' must be a number. Received: ${x} (${typeof x})`
        );
      }
      if (typeof y !== 'number' || isNaN(y)) {
        console.error(
          `CustomCursor: 'offset.y' must be a number. Received: ${y} (${typeof y})`
        );
      }
    }
  }

  // Validate containerRef
  if (containerRef !== undefined) {
    if (typeof containerRef !== 'object' || containerRef === null || !('current' in containerRef)) {
      console.error(
        `CustomCursor: 'containerRef' must be a React ref object (created with useRef). Received: ${containerRef}`
      );
    }
  }

  // Validate centered
  if (centered !== undefined && typeof centered !== 'boolean') {
    console.error(
      `CustomCursor: 'centered' must be a boolean. Received: ${centered} (${typeof centered})`
    );
  }

  // Validate showDevIndicator
  if (showDevIndicator !== undefined && typeof showDevIndicator !== 'boolean') {
    console.error(
      `CustomCursor: 'showDevIndicator' must be a boolean. Received: ${showDevIndicator} (${typeof showDevIndicator})`
    );
  }

  // Validate callbacks
  if (onMove !== undefined && typeof onMove !== 'function') {
    console.error(
      `CustomCursor: 'onMove' must be a function. Received: ${typeof onMove}`
    );
  }

  if (onVisibilityChange !== undefined && typeof onVisibilityChange !== 'function') {
    console.error(
      `CustomCursor: 'onVisibilityChange' must be a function. Received: ${typeof onVisibilityChange}`
    );
  }
} 