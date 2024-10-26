import React, { useEffect, useState } from 'react';

export interface CustomCursorProps {
  /**
   * Custom content to be rendered as cursor
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom styles to apply to cursor container
   */
  style?: React.CSSProperties;
  /**
   * Offset X position from actual cursor (in pixels)
   */
  offsetX?: number;
  /**
   * Offset Y position from actual cursor (in pixels)
   */
  offsetY?: number;
  /**
   * Z-index for the cursor element
   */
  zIndex?: number;
  /**
   * Smooth factor for cursor movement (1 = instant, higher = smoother)
   */
  smoothFactor?: number;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({
  children,
  className = '',
  style = {},
  offsetX = 0,
  offsetY = 0,
  zIndex = 9999,
  smoothFactor = 1,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateTargetPosition = (e: MouseEvent) => {
      setTargetPosition({ 
        x: e.clientX + offsetX, 
        y: e.clientY + offsetY 
      });
    };

    document.addEventListener('mousemove', updateTargetPosition);
    return () => document.removeEventListener('mousemove', updateTargetPosition);
  }, [offsetX, offsetY]);

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

  return (
    <div
      style={{
        position: 'fixed',
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
      <div className='random-comp'      style={{
        width: '20px',
        height: '20px',
        backgroundColor: '#3b82f6',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)'
      }}>

      </div>
      {children}
    </div>
  );
};

// Export the default component
export default CustomCursor;