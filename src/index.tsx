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
    if (smoothFactor === 1) {
      setPosition(targetPosition);
      return;
    }

    const smoothing = () => {
      setPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) / smoothFactor,
        y: prev.y + (targetPosition.y - prev.y) / smoothFactor
      }));

      animationFrameId = requestAnimationFrame(smoothing);
    };

    let animationFrameId = requestAnimationFrame(smoothing);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPosition, smoothFactor]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: containerRef ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        zIndex,
        transition: smoothFactor === 1 ? 'none' : undefined,
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

export default CustomCursor;