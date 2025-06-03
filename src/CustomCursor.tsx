import * as React from 'react';
import { createPortal } from 'react-dom';
import { useMousePosition, useSmoothAnimation } from './hooks';
import {
  CursorPosition,
  CursorOffset,
  CursorMoveHandler,
  CursorVisibilityHandler,
} from './types';

// Simplified props interface
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
  containerRef?: React.RefObject<HTMLElement>;
  
  // Behavior
  showNativeCursor?: boolean;
  throttleMs?: number; // Performance throttling
  
  // Event Handlers
  onMove?: CursorMoveHandler;
  onVisibilityChange?: CursorVisibilityHandler;

  // Legacy props (deprecated but supported)
  /** @deprecated Use offset.x instead */
  offsetX?: number;
  /** @deprecated Use offset.y instead */
  offsetY?: number;
  /** @deprecated Use smoothness instead */
  smoothFactor?: number;
  /** @deprecated Use showNativeCursor={false} instead */
  hideNativeCursor?: boolean;
  /** @deprecated Use onVisibilityChange instead */
  onVisibilityChanged?: (isVisible: boolean) => void;
}

const ANIMATION_DURATION = '0.3s';
const ANIMATION_NAME = 'cursorFadeIn';

// Utility to show deprecation warnings
const warnDeprecated = (oldProp: string, newProp: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `react-component-cursor: "${oldProp}" is deprecated. Use "${newProp}" instead.`
    );
  }
};

// Create a memoized portal target
const getPortalContainer = () => {
  const existingContainer = document.getElementById('cursor-container');
  if (existingContainer) {
    return existingContainer;
  }

  const container = document.createElement('div');
  container.id = 'cursor-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
};

const DevIndicator: React.FC<{
  position: { x: number | null; y: number | null };
}> = ({ position }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${position.x ?? 0}px, ${position.y ?? 0}px)`,
        width: '50px',
        height: '50px',
        border: '2px solid red',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 10000,
        opacity: 0.5,
        // Center the circle around the cursor
        marginLeft: '-25px',
        marginTop: '-25px',
      }}
    />
  );
};

// Global style creation
const createGlobalStyle = () => `
  body, 
  body * {
    cursor: none !important;
  }
  
  #cursor-container {
    pointer-events: none !important;
  }
`;

export const CustomCursor: React.FC<CustomCursorProps> = React.memo(
  ({
    // New API props with defaults
    id = 'unnamed-cursor',
    enabled = true,
    children,
    className = '',
    style = {},
    zIndex = 999, // Lower default zIndex
    offset,
    smoothness,
    containerRef,
    showNativeCursor = false, // Default to false (hide native cursor)
    throttleMs = 0,
    onMove,
    onVisibilityChange,
    
    // Legacy props (deprecated)
    offsetX,
    offsetY,
    smoothFactor,
    hideNativeCursor,
    onVisibilityChanged,
  }) => {
    // Handle legacy props with warnings
    React.useEffect(() => {
      if (offsetX !== undefined) warnDeprecated('offsetX', 'offset.x');
      if (offsetY !== undefined) warnDeprecated('offsetY', 'offset.y');
      if (smoothFactor !== undefined) warnDeprecated('smoothFactor', 'smoothness');
      if (hideNativeCursor !== undefined) warnDeprecated('hideNativeCursor', 'showNativeCursor');
      if (onVisibilityChanged !== undefined) warnDeprecated('onVisibilityChanged', 'onVisibilityChange');
    }, [offsetX, offsetY, smoothFactor, hideNativeCursor, onVisibilityChanged]);

    // Resolve props (new API takes precedence over legacy)
    const resolvedOffset = React.useMemo(() => {
      if (offset) return offset;
      return {
        x: offsetX ?? 0,
        y: offsetY ?? 0,
      };
    }, [offset, offsetX, offsetY]);

    const resolvedSmoothness = smoothness ?? smoothFactor ?? 1;
    const resolvedShowNativeCursor = showNativeCursor ?? (hideNativeCursor !== undefined ? !hideNativeCursor : false);

    const { position, setPosition, targetPosition, isVisible } =
      useMousePosition(containerRef, resolvedOffset.x, resolvedOffset.y, throttleMs);
    useSmoothAnimation(targetPosition, resolvedSmoothness, setPosition);

    const [portalContainer, setPortalContainer] =
      React.useState<HTMLElement | null>(null);

    React.useEffect(() => {
      setPortalContainer(getPortalContainer());
      return () => {
        const container = document.getElementById('cursor-container');
        if (container && !container.children.length) {
          document.body.removeChild(container);
        }
      };
    }, []);

    React.useEffect(() => {
      const styleId = `cursor-style-${id}`;
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.textContent = `
        @keyframes ${ANIMATION_NAME} {
          from {
            opacity: 0;
            transform: translate(var(--cursor-x), var(--cursor-y)) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(var(--cursor-x), var(--cursor-y)) scale(1);
          }
        }
      `;
      document.head.appendChild(styleSheet);

      return () => {
        const style = document.getElementById(styleId);
        if (style) {
          style.remove();
        }
      };
    }, [id]);

    // Handle move callback with new signature (backward compatible)
    React.useEffect(() => {
      if (position.x !== null && position.y !== null) {
        const cursorPosition: CursorPosition = { x: position.x, y: position.y };
        onMove?.(cursorPosition);
      }
    }, [position, onMove]);

    // Handle visibility callback with new signature and legacy support
    React.useEffect(() => {
      const actuallyVisible = enabled && isVisible;
      const reason: 'container' | 'disabled' = !enabled ? 'disabled' : 'container';

      onVisibilityChange?.(actuallyVisible, reason);
      // Legacy callback support
      onVisibilityChanged?.(actuallyVisible);
    }, [enabled, isVisible, onVisibilityChange, onVisibilityChanged]);

    const cursorStyle = React.useMemo(
      () =>
        ({
          position: 'fixed',
          top: 0,
          left: 0,
          transform: `translate(${position.x ?? 0}px, ${position.y ?? 0}px)`,
          pointerEvents: 'none',
          zIndex,
          opacity: 1,
          visibility: 'visible',
          animation: `${ANIMATION_NAME} ${ANIMATION_DURATION} ease-out`,
          '--cursor-x': `${position.x ?? 0}px`,
          '--cursor-y': `${position.y ?? 0}px`,
          ...style,
        } as React.CSSProperties),
      [position.x, position.y, zIndex, style]
    );

    const shouldRender = enabled && 
                        isVisible && 
                        position.x !== null && 
                        position.y !== null && 
                        portalContainer;

    if (!shouldRender) return null;

    return (
      <>
        {!resolvedShowNativeCursor && (
          <style id={`cursor-style-global-${id}`}>{createGlobalStyle()}</style>
        )}
        {createPortal(
          <React.Fragment key={`cursor-${id}`}>
            <div
              id={`custom-cursor-${id}`}
              style={cursorStyle}
              className={className}
              aria-hidden="true"
            >
              {children}
            </div>
            <DevIndicator position={position} />
          </React.Fragment>,
          portalContainer
        )}
      </>
    );
  }
);

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
