import React, { useEffect, useState, useCallback } from 'react';
import { NullablePosition } from '../types.js';

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
  


  // Core function to check position against container bounds and update target
  const updateTargetWithBoundsCheck = useCallback((globalPosition: { x: number; y: number }) => {
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
  }, [containerRef, offsetX, offsetY]);

  // Handle updates from coordinator (mouse movement, scroll, resize) - unified callback
  const handleUpdate = useCallback((globalPosition: { x: number; y: number }) => {
    updateTargetWithBoundsCheck(globalPosition);
  }, [updateTargetWithBoundsCheck]);

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

  // Subscribe to CursorCoordinator (dynamically loaded)
  useEffect(() => {
    let isCleanedUp = false;
    // Use an object to store unsubscribe so cleanup can access latest value
    const subscriptionRef = { unsubscribe: null as (() => void) | null };

    // Dynamic import of the entire coordinator chunk
    import('../utils/CursorCoordinator').then(({ CursorCoordinator }) => {
      // Don't subscribe if component already unmounted
      if (isCleanedUp) return;
      
      const cursorCoordinator = CursorCoordinator.getInstance();
      
      subscriptionRef.unsubscribe = cursorCoordinator.subscribe({
        id,
        onPositionChange: handleUpdate,
        throttleMs,
      });
    });

    return () => {
      isCleanedUp = true;
      // Access the latest unsubscribe function via reference
      subscriptionRef.unsubscribe?.();
    };
  }, [id, throttleMs, handleUpdate]);

  // Sync position with targetPosition
  useEffect(() => {
    if (targetPosition.x !== null && targetPosition.y !== null) {
      setPosition(targetPosition);
    }
  }, [targetPosition]);

  return { position, setPosition, targetPosition, isVisible };
}
