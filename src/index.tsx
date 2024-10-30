import React, { useEffect, useState } from 'react';

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

export const CustomCursor: React.FC<CustomCursorProps> = ({
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
  const [position, setPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateTargetPosition = (e: MouseEvent) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInside = 
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        setIsVisible(isInside);
        
        if (isInside) {
          const newPosition = {
            x: e.clientX - rect.left + offsetX,
            y: e.clientY - rect.top + offsetY,
          };
          setTargetPosition(newPosition);
          if (position.x === null || position.y === null) {
            setPosition(newPosition);
          }
        }
      } else {
        setIsVisible(true);
        const newPosition = {
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
        };
        setTargetPosition(newPosition);
        if (position.x === null || position.y === null) {
          setPosition(newPosition);
        }
      }
    };

    const handleMouseLeave = () => {
      if (containerRef?.current) {
        setIsVisible(false);
      }
    };

    const element = containerRef?.current || document;
    element.addEventListener('mousemove', updateTargetPosition as EventListener);
    
    if (containerRef?.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      element.removeEventListener('mousemove', updateTargetPosition as EventListener);
      if (containerRef?.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [containerRef, offsetX, offsetY, position.x, position.y]);

  useEffect(() => {
    if (position.x === null || position.y === null) return;

    let animationFrameId: number;

    if (smoothFactor === 1) {
      setPosition(targetPosition);
      return;
    }

    const smoothing = () => {
      setPosition(prev => {
        if (prev.x === null || prev.y === null) return prev;
        
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;
        
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return prev;
        }

        return {
          x: prev.x + dx / smoothFactor,
          y: prev.y + dy / smoothFactor
        };
      });

      animationFrameId = requestAnimationFrame(smoothing);
    };

    animationFrameId = requestAnimationFrame(smoothing);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetPosition, smoothFactor]);

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes cursorFadeIn {
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

  if (!isVisible || position.x === null || position.y === null) return null;

  const cursorStyle: React.CSSProperties = {
    position: containerRef ? 'absolute' : 'fixed',
    top: 0,
    left: 0,
    transform: `translate(${position.x}px, ${position.y}px)`,
    pointerEvents: 'none',
    zIndex,
    opacity: 1,
    animation: 'cursorFadeIn 0.3s ease-out',
    '--cursor-x': `${position.x}px`,
    '--cursor-y': `${position.y}px`,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      style={cursorStyle}
      className={className}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

export default CustomCursor;
