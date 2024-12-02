import * as React from 'react';
import { createPortal } from 'react-dom';
import { useMousePosition, useSmoothAnimation } from './hooks';

export interface CustomCursorProps {
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

const ANIMATION_DURATION = '0.3s';
const ANIMATION_NAME = 'cursorFadeIn';

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
        zIndex: 9999,
        opacity: 0.5,
        // Center the circle around the cursor
        marginLeft: '-25px',
        marginTop: '-25px',
      }}
    />
  );
};

// Add this at the top level of the file
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
    id = 'unnamed-cursor',
    children,
    className = '',
    style = {},
    offsetX = 0,
    offsetY = 0,
    zIndex = 9999,
    smoothFactor = 1,
    containerRef,
    onMove,
    hideNativeCursor = true,
    onVisibilityChanged,
  }) => {
    const { position, setPosition, targetPosition, isVisible } =
      useMousePosition(containerRef, offsetX, offsetY);
    useSmoothAnimation(position, targetPosition, smoothFactor, setPosition);

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

    React.useEffect(() => {
      if (position.x !== null && position.y !== null) {
        onMove?.(position.x, position.y);
      }
    }, [position, onMove]);

    React.useEffect(() => {
      onVisibilityChanged?.(isVisible);
    }, [isVisible, onVisibilityChanged]);

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

    // console.log(`${id} state:`, {
    //   isVisible,
    //   position,
    //   targetPosition,
    //   portalContainer: !!portalContainer,
    //   shouldRender: !(
    //     !isVisible ||
    //     position.x === null ||
    //     position.y === null ||
    //     !portalContainer
    //   ),
    // });
    if (
      !isVisible ||
      position.x === null ||
      position.y === null ||
      !portalContainer
    )
      return null;
    return (
      <>
        {hideNativeCursor && (
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
