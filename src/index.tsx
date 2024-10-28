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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateTargetPosition = (e: MouseEvent) => {
      if (containerRef?.current) {
        // Get container's bounding rect
        const rect = containerRef.current.getBoundingClientRect();
        
        // Check if mouse is inside the container
        const isInside = 
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        setIsVisible(isInside);
        
        if (isInside) {
          // Calculate position relative to container
          setTargetPosition({
            x: e.clientX - rect.left + offsetX,
            y: e.clientY - rect.top + offsetY,
          });
        }
      } else {
        // Global positioning
        setIsVisible(true);
        setTargetPosition({
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
        });
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
  }, [containerRef, offsetX, offsetY]);

  useEffect(() => {
    let animationFrameId: number;

    if (smoothFactor === 1) {
      setPosition(targetPosition);
      return;
    }

    const smoothing = () => {
      setPosition(prev => {
        // Only update if the difference is significant
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

  // Create keyframes animation only once when component mounts
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
  }, []); // Empty dependency array - runs once on mount

  // Update the cursor style to use CSS variables
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
  } as React.CSSProperties; // Type assertion needed for CSS variables

  useEffect(() => {
    if (onMove) {
      onMove(position.x, position.y);
    }
  }, [position, onMove]);

  if (!isVisible) return null;

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
