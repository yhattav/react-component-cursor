import * as React from 'react';
import { createPortal } from 'react-dom';
import { useMousePosition, useSmoothAnimation } from './hooks';
import {
  CursorPosition,
  CursorOffset,
  CursorMoveHandler,
  CursorVisibilityHandler,
  CursorVisibilityReason,
} from './types.js';
import { validateProps } from './utils/validation';
import { isSSR, safeDocument, isMobileDevice } from './utils/ssr';

// Clean props interface
export interface CustomCursorProps {
  // Core Configuration
  id?: string; // Auto-generated UUID if not provided
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
  centered?: boolean; // Auto-center cursor on mouse position (default: true)
  
  // Behavior
  throttleMs?: number; // Performance throttling
  
  // Development
  showDevIndicator?: boolean; // Show red debug circle in development (default: true)
  
  // Event Handlers
  onMove?: CursorMoveHandler;
  onVisibilityChange?: CursorVisibilityHandler;
  
  // Testing & Accessibility
  'data-testid'?: string;
  role?: string;
  'aria-label'?: string;
}

const ANIMATION_DURATION = '0.3s';
const ANIMATION_NAME = 'cursorFadeIn';
const DEFAULT_Z_INDEX = 9999;

const DevIndicator: React.FC<{
  position: { x: number | null; y: number | null };
  show: boolean;
}> = ({ position, show }) => {
  if (process.env.NODE_ENV !== 'development' || !show) return null;

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

// Custom comparison function for React.memo
const arePropsEqual = (
  prevProps: CustomCursorProps,
  nextProps: CustomCursorProps
): boolean => {
  // Check primitive props
  if (
    prevProps.id !== nextProps.id ||
    prevProps.enabled !== nextProps.enabled ||
    prevProps.className !== nextProps.className ||
    prevProps.zIndex !== nextProps.zIndex ||
    prevProps.smoothness !== nextProps.smoothness ||
    prevProps.centered !== nextProps.centered ||
    prevProps.throttleMs !== nextProps.throttleMs ||
    prevProps.showDevIndicator !== nextProps.showDevIndicator
  ) {
    return false;
  }

  // Check offset object
  if (
    prevProps.offset?.x !== nextProps.offset?.x ||
    prevProps.offset?.y !== nextProps.offset?.y
  ) {
    return false;
  }

  // Check containerRef
  if (prevProps.containerRef?.current !== nextProps.containerRef?.current) {
    return false;
  }

  // Check style object (shallow comparison)
  const prevStyle = prevProps.style || {};
  const nextStyle = nextProps.style || {};
  const prevStyleKeys = Object.keys(prevStyle);
  const nextStyleKeys = Object.keys(nextStyle);
  
  if (prevStyleKeys.length !== nextStyleKeys.length) {
    return false;
  }
  
  for (const key of prevStyleKeys) {
    if (prevStyle[key as keyof React.CSSProperties] !== nextStyle[key as keyof React.CSSProperties]) {
      return false;
    }
  }

  // Function props are assumed to be stable (should be wrapped in useCallback by consumers)
  // We'll do reference equality check
  if (
    prevProps.onMove !== nextProps.onMove ||
    prevProps.onVisibilityChange !== nextProps.onVisibilityChange
  ) {
    return false;
  }

  // Children comparison (basic reference check)
  if (prevProps.children !== nextProps.children) {
    return false;
  }

  return true;
};

// Generate a unique ID for each cursor instance
const generateCursorId = (): string => {
  return `cursor-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`;
};

export const CustomCursor: React.FC<CustomCursorProps> = React.memo(
  ({
    id,
    enabled = true,
    children,
    className = '',
    style = {},
    zIndex = DEFAULT_Z_INDEX,
    offset = { x: 0, y: 0 },
    smoothness = 1,
    containerRef,
    centered = true,
    throttleMs = 0,
    showDevIndicator = true,
    onMove,
    onVisibilityChange,
    'data-testid': dataTestId,
    role,
    'aria-label': ariaLabel,
  }) => {
    // Generate unique ID if not provided
    const cursorId = React.useMemo(() => id || generateCursorId(), [id]);

    // Validate props in development mode (always called first)
    validateProps({
      id: cursorId,
      enabled,
      children,
      className,
      style,
      zIndex,
      offset,
      smoothness,
      containerRef,
      centered,
      throttleMs,
      showDevIndicator,
      onMove,
      onVisibilityChange,
    });

    // Memoize offset values to avoid recreating object (always called)
    const offsetValues = React.useMemo(() => ({
      x: typeof offset === 'object' ? offset.x : 0,
      y: typeof offset === 'object' ? offset.y : 0,
    }), [offset]);

    // Check for mobile device early (after hooks are called)
    const isMobile = React.useMemo(() => isMobileDevice(), []);

    // Always call hooks, even if we'll return null (Rules of Hooks)
    const mousePositionHook = useMousePosition(cursorId, containerRef, offsetValues.x, offsetValues.y, throttleMs);
    const { position, setPosition, targetPosition, isVisible } = mousePositionHook;
    useSmoothAnimation(targetPosition, smoothness, setPosition);

    const [portalContainer, setPortalContainer] =
      React.useState<HTMLElement | null>(null);

    // Memoize portal container creation
    const getPortalContainerMemo = React.useCallback(() => {
      const doc = safeDocument();
      if (!doc) return null;

      const existingContainer = doc.getElementById('cursor-container');
      if (existingContainer) {
        return existingContainer;
      }

      const container = doc.createElement('div');
      container.id = 'cursor-container';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = DEFAULT_Z_INDEX.toString();
      doc.body.appendChild(container);
      return container;
    }, []);

    React.useEffect(() => {
      setPortalContainer(getPortalContainerMemo());
      return () => {
        const doc = safeDocument();
        if (!doc) return;
        
        const container = doc.getElementById('cursor-container');
        if (container && container.children.length === 0) {
          try {
            if (container.parentNode) {
              container.parentNode.removeChild(container);
            }
          } catch (e) {
            // Ignore cleanup errors in tests
            if (process.env.NODE_ENV !== 'test') {
              console.warn('Portal container cleanup failed:', e);
            }
          }
        }
      };
    }, [getPortalContainerMemo]);

    // Memoize style sheet content with reduced motion support
    const styleSheetContent = React.useMemo(() => {
      const centerTransform = centered ? ' translate(-50%, -50%)' : '';
      return `
        @keyframes ${ANIMATION_NAME} {
          from {
            opacity: 0;
            transform: translate(var(--cursor-x), var(--cursor-y))${centerTransform} scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(var(--cursor-x), var(--cursor-y))${centerTransform} scale(1);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          @keyframes ${ANIMATION_NAME} {
            from {
              opacity: 0;
              transform: translate(var(--cursor-x), var(--cursor-y))${centerTransform} scale(1);
            }
            to {
              opacity: 1;
              transform: translate(var(--cursor-x), var(--cursor-y))${centerTransform} scale(1);
            }
          }
        }
      `;
    }, [centered]);

    React.useEffect(() => {
      const doc = safeDocument();
      if (!doc) return;
      
      const styleId = `cursor-style-${cursorId}`;
      const existingStyle = doc.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      const styleSheet = doc.createElement('style');
      styleSheet.id = styleId;
      styleSheet.textContent = styleSheetContent;
      doc.head.appendChild(styleSheet);

      return () => {
        const style = doc.getElementById(styleId);
        if (style) {
          try {
            style.remove();
          } catch (e) {
            // Ignore cleanup errors in tests
            if (process.env.NODE_ENV !== 'test') {
              console.warn('Style cleanup failed:', e);
            }
          }
        }
      };
    }, [cursorId, styleSheetContent]);

    // Memoize move callback to avoid recreation
    const handleMove = React.useCallback(() => {
      if (position.x !== null && position.y !== null && typeof onMove === 'function') {
        const cursorPosition: CursorPosition = { x: position.x, y: position.y };
        onMove(cursorPosition);
      }
    }, [position.x, position.y, onMove]);

    // Handle move callback
    React.useEffect(() => {
      handleMove();
    }, [handleMove]);

    // Memoize visibility callback to avoid recreation
    const handleVisibilityChange = React.useCallback(() => {
      if (typeof onVisibilityChange === 'function') {
        const actuallyVisible = enabled && isVisible;
        const reason: CursorVisibilityReason = !enabled ? 'disabled' : 'container';
        onVisibilityChange(actuallyVisible, reason);
      }
    }, [enabled, isVisible, onVisibilityChange]);

    // Handle visibility callback
    React.useEffect(() => {
      handleVisibilityChange();
    }, [handleVisibilityChange]);

    // Handle mobile-specific visibility callback
    React.useEffect(() => {
      if (isMobile && typeof onVisibilityChange === 'function') {
        onVisibilityChange(false, 'touch');
      }
    }, [isMobile, onVisibilityChange]);

    // Early return for mobile devices - no cursor rendering
    if (isMobile) {
      return null;
    }

    const cursorStyle = React.useMemo(
      () => {
        const baseTransform = `translate(${position.x ?? 0}px, ${position.y ?? 0}px)`;
        const centerTransform = centered ? ' translate(-50%, -50%)' : '';
        
        return {
          position: 'fixed',
          top: 0,
          left: 0,
          transform: baseTransform + centerTransform,
          pointerEvents: 'none',
          zIndex,
          opacity: 1,
          visibility: 'visible',
          animation: `${ANIMATION_NAME} ${ANIMATION_DURATION} ease-out`,
          '--cursor-x': `${position.x ?? 0}px`,
          '--cursor-y': `${position.y ?? 0}px`,
          ...style,
        } as React.CSSProperties;
      },
      [position.x, position.y, zIndex, centered, style]
    );

    // Memoize global style content
    const globalStyleContent = React.useMemo(() => `
      #cursor-container {
        pointer-events: none !important;
      }
    `, []);

    // Determine if we should render anything (SSR safety + enabled check)
    const shouldRender = !isSSR() && 
                        enabled && 
                        isVisible && 
                        position.x !== null && 
                        position.y !== null && 
                        portalContainer;

    if (!shouldRender) return null;

    return (
      <>
        <style id={`cursor-style-global-${cursorId}`}>{globalStyleContent}</style>
        {createPortal(
          <React.Fragment key={`cursor-${cursorId}`}>
            <div
              id={`custom-cursor-${cursorId}`}
              style={cursorStyle}
              className={className}
              aria-hidden="true"
              data-testid={dataTestId}
              role={role}
              aria-label={ariaLabel}
            >
              {children}
            </div>
            <DevIndicator position={position} show={showDevIndicator} />
          </React.Fragment>,
          portalContainer
        )}
      </>
    );
  },
  arePropsEqual
);

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
