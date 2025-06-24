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
  const [targetPosition, setTargetPosition] = useState<NullablePosition>({ x: null, y: null });

  // Simple rule: visible if we have a valid position
  const isVisible = targetPosition.x !== null && targetPosition.y !== null;
  


  // Handle position updates from MouseTracker
  const handlePositionUpdate = useCallback((globalPosition: { x: number; y: number }) => {
    // Apply offsets
    const adjustedPosition = {
      x: globalPosition.x + offsetX,
      y: globalPosition.y + offsetY,
    };

    // Check container bounds if specified
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      const isInside = 
        globalPosition.x >= rect.left &&
        globalPosition.x <= rect.right &&
        globalPosition.y >= rect.top &&
        globalPosition.y <= rect.bottom;
        
      if (isInside) {
        setTargetPosition(adjustedPosition);
      } else {
        setTargetPosition({ x: null, y: null });
      }
    } else {
      setTargetPosition(adjustedPosition);
    }
  }, [id, containerRef, offsetX, offsetY]);

  // Handle mouse leave - hide cursor
  useEffect(() => {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    
    const handleMouseLeave = () => {
      setTargetPosition({ x: null, y: null });
    };

    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  // Subscribe to MouseTracker
  useEffect(() => {
    const mouseTracker = MouseTracker.getInstance();
    
    const unsubscribe = mouseTracker.subscribe({
      id,
      callback: handlePositionUpdate,
      throttleMs,
    });

    return () => {
      unsubscribe();
    };
  }, [id, throttleMs, handlePositionUpdate]);

  // Sync position with targetPosition
  useEffect(() => {
    if (targetPosition.x !== null && targetPosition.y !== null) {
      setPosition(targetPosition);
    }
  }, [targetPosition]);

  return { position, setPosition, targetPosition, isVisible };
}
