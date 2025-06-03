import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NullablePosition } from '../types';

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
  const [isVisible, setIsVisible] = useState(containerRef?.current !== null);

  const positionRef = useRef(position);
  positionRef.current = position;

  const updateTargetPosition = useCallback(
    (e: MouseEvent) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInside) {
          const newPosition = {
            x: e.clientX + offsetX,
            y: e.clientY + offsetY,
          };
          if (
            newPosition.x !== targetPosition.x ||
            newPosition.y !== targetPosition.y
          ) {
            setTargetPosition(newPosition);
          }
        }
      } else {
        const newPosition = {
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
        };
        if (
          newPosition.x !== targetPosition.x ||
          newPosition.y !== targetPosition.y
        ) {
          setTargetPosition(newPosition);
        }
      }
    },
    [containerRef, offsetX, offsetY, targetPosition.x, targetPosition.y]
  );

  // Create throttled version if needed
  const throttledUpdateTargetPosition = React.useMemo(() => {
    return throttleMs > 0 ? throttle(updateTargetPosition, throttleMs) : updateTargetPosition;
  }, [updateTargetPosition, throttleMs]);

  useEffect(() => {
    const handleMouseLeave = () => {
      if (containerRef?.current) {
        setIsVisible(false);
      }
    };

    const handleMouseEnter = () => {
      if (containerRef?.current) {
        setIsVisible(true);
      }
    };

    const element = containerRef?.current || document;
    
    // Always listen to mousemove (simplified)
    element.addEventListener(
      'mousemove',
      throttledUpdateTargetPosition as EventListener
    );

    if (containerRef?.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
      containerRef.current.addEventListener('mouseenter', handleMouseEnter as EventListener);
    }

    return () => {
      element.removeEventListener(
        'mousemove',
        throttledUpdateTargetPosition as EventListener
      );
      if (containerRef?.current) {
        containerRef.current.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );
        containerRef.current.removeEventListener(
          'mouseenter',
          handleMouseEnter as EventListener
        );
      }
    };
  }, [containerRef, throttledUpdateTargetPosition]);

  // Initialize position when we get the first valid targetPosition
  useEffect(() => {
    if (position.x === null && position.y === null) {
      setPosition(targetPosition);
    }
  }, [targetPosition, position.x, position.y]);

  return { position, setPosition, targetPosition, isVisible };
}
