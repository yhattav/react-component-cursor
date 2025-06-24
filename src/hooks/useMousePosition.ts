import React, { useEffect, useState, useCallback } from 'react';
import { NullablePosition } from '../types.js';
import { MouseTracker } from '../utils/MouseTracker';

export function useMousePosition(
  id: string,
  containerRef: React.RefObject<HTMLElement> | undefined,
  offsetX: number,
  offsetY: number,
  throttleMs = 0
): {
  position: NullablePosition;
  setPosition: React.Dispatch<React.SetStateAction<NullablePosition>>;
  targetPosition: NullablePosition;
  isVisible: boolean;
} {
  const [position, setPosition] = useState<NullablePosition>({ x: null, y: null });
  const [targetPosition, setTargetPosition] = useState<NullablePosition>({
    x: null,
    y: null,
  });
  const [isVisible, setIsVisible] = useState(false);

  // Handle position updates from the mouse tracker
  const handlePositionUpdate = useCallback((newPosition: { x: number; y: number }) => {
    // Set visible immediately when we get first position (only if not already visible)
    if (!isVisible) setIsVisible(true);
    
    setTargetPosition(prev => {
      // Only update if position actually changed
      if (prev.x !== newPosition.x || prev.y !== newPosition.y) {
        return newPosition;
      }
      return prev;
    });
  }, [isVisible]);

  // Handle container-specific mouse leave/enter
  useEffect(() => {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      // Don't set visible yet - wait for position update from MouseTracker
    };

    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [containerRef]);

  // Subscribe to mouse tracker
  useEffect(() => {
    const mouseTracker = MouseTracker.getInstance();
    
    const unsubscribe = mouseTracker.subscribe({
      id,
      callback: handlePositionUpdate,
      containerRef,
      throttleMs,
      offsetX,
      offsetY,
    });

    return unsubscribe;
  }, [id, containerRef, offsetX, offsetY, throttleMs, handlePositionUpdate]);

  // Initialize position when we get the first valid targetPosition
  useEffect(() => {
    if (position.x === null && position.y === null && targetPosition.x !== null && targetPosition.y !== null) {
      setPosition(targetPosition);
    }
  }, [targetPosition, position.x, position.y]);

  return { position, setPosition, targetPosition, isVisible };
}
