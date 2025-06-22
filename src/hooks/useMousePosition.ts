import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NullablePosition } from '../types.js';
import { isSSR } from '../utils/ssr';

// Throttle utility function
const throttle = <T extends (...args: never[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
};

export function useMousePosition(
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
  // Cursor is only visible when it actually has a position and should be shown
  const [isVisible, setIsVisible] = useState(false);

  const positionRef = useRef(position);
  positionRef.current = position;

  // Memoize container element to avoid re-creating listeners
  const containerElement = React.useMemo(() => containerRef?.current, [containerRef?.current]);

  const updateTargetPosition = useCallback(
    (e: MouseEvent) => {
      if (containerElement) {
        const rect = containerElement.getBoundingClientRect();
        const isInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInside) {
          // Set visible immediately when we get first valid position
          setIsVisible(true);
          const newPosition = {
            x: e.clientX + offsetX,
            y: e.clientY + offsetY,
          };
          setTargetPosition(prev => {
            // Only update if position actually changed
            if (prev.x !== newPosition.x || prev.y !== newPosition.y) {
              return newPosition;
            }
            return prev;
          });
        }
      } else {
        // Global cursor - set visible immediately when we get first position
        setIsVisible(true);
        const newPosition = {
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
        };
        setTargetPosition(prev => {
          // Only update if position actually changed
          if (prev.x !== newPosition.x || prev.y !== newPosition.y) {
            return newPosition;
          }
          return prev;
        });
      }
    },
    [containerElement, offsetX, offsetY]
  );

  // Create throttled version if needed - memoize to avoid recreation
  const throttledUpdateTargetPosition = React.useMemo(() => {
    return throttleMs > 0 ? throttle(updateTargetPosition, throttleMs) : updateTargetPosition;
  }, [updateTargetPosition, throttleMs]);

  // Memoize mouse event handlers to prevent recreation
  const handleMouseLeave = React.useCallback(() => {
    if (containerElement) {
      setIsVisible(false);
    }
  }, [containerElement]);

  const handleMouseEnter = React.useCallback(() => {
    if (containerElement) {
      // Don't set visible yet - wait for first mouse move to get position
      // setIsVisible(true) will happen in updateTargetPosition when position is set
    }
  }, [containerElement]);

  useEffect(() => {
    // Skip event listener setup during SSR
    if (isSSR()) return;
    
    const element = containerElement || document;
    
    // Always listen to mousemove (simplified)
    element.addEventListener(
      'mousemove',
      throttledUpdateTargetPosition as EventListener
    );

    if (containerElement) {
      containerElement.addEventListener('mouseleave', handleMouseLeave);
      containerElement.addEventListener('mouseenter', handleMouseEnter as EventListener);
      
      // Check initial hover state - prepare for immediate visibility on first move
      const checkInitialHover = () => {
        if (containerElement.matches(':hover')) {
          // Don't set visible yet - cursor will become visible on first mouse move
          // This ensures cursor appears immediately after first movement when already hovering
        }
      };
      
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(checkInitialHover, 10);
      
      return () => {
        clearTimeout(timeoutId);
        element.removeEventListener(
          'mousemove',
          throttledUpdateTargetPosition as EventListener
        );
        containerElement.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );
        containerElement.removeEventListener(
          'mouseenter',
          handleMouseEnter as EventListener
        );
      };
    }

    return () => {
      element.removeEventListener(
        'mousemove',
        throttledUpdateTargetPosition as EventListener
      );
    };
  }, [containerElement, throttledUpdateTargetPosition, handleMouseLeave, handleMouseEnter]);

  // Initialize position when we get the first valid targetPosition - optimize to avoid unnecessary updates
  useEffect(() => {
    if (position.x === null && position.y === null && targetPosition.x !== null && targetPosition.y !== null) {
      setPosition(targetPosition);
    }
  }, [targetPosition, position.x, position.y]);

  return { position, setPosition, targetPosition, isVisible };
}
