import React, { useEffect, useMemo } from 'react';
import { useMousePosition, useSmoothAnimation } from './hooks';

export interface CustomCursorProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  offsetX?: number;
  offsetY?: number;
  zIndex?: number;
  smoothFactor?: number;
  containerRef?: React.RefObject<HTMLElement>;
  onMove?: (x: number, y: number) => void;
}

const ANIMATION_DURATION = '0.3s';
const ANIMATION_NAME = 'cursorFadeIn';

export const CustomCursor: React.FC<CustomCursorProps> = React.memo(
  ({
    children,
    className = '',
    style = {},
    offsetX = 0,
    offsetY = 0,
    zIndex = 9999,
    smoothFactor = 1,
    containerRef,
    onMove,
  }) => {
    const { position, setPosition, targetPosition, isVisible } =
      useMousePosition(containerRef, offsetX, offsetY);

    useSmoothAnimation(position, targetPosition, smoothFactor, setPosition);

    useEffect(() => {
      const styleSheet = document.createElement('style');
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
        document.head.removeChild(styleSheet);
      };
    }, []);

    useEffect(() => {
      if (onMove && position.x !== null && position.y !== null) {
        onMove(position.x, position.y);
      }
    }, [position, onMove]);

    const cursorStyle = useMemo(
      () =>
        ({
          position: containerRef ? 'absolute' : 'fixed',
          top: 0,
          left: 0,
          transform: `translate(${position.x ?? 0}px, ${position.y ?? 0}px)`,
          pointerEvents: 'none',
          zIndex,
          opacity: 1,
          animation: `${ANIMATION_NAME} ${ANIMATION_DURATION} ease-out`,
          '--cursor-x': `${position.x ?? 0}px`,
          '--cursor-y': `${position.y ?? 0}px`,
          ...style,
        } as React.CSSProperties),
      [position.x, position.y, containerRef, zIndex, style]
    );

    if (!isVisible || position.x === null || position.y === null) return null;

    return (
      <div
        id="custom-cursor"
        style={cursorStyle}
        className={className}
        aria-hidden="true"
      >
        {children}
      </div>
    );
  }
);

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
