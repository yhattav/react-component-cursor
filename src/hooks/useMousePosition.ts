import { useEffect, useState, useCallback, useRef } from 'react';
import { Position, TargetPosition } from '../types';

export function useMousePosition(
  containerRef: React.RefObject<HTMLElement> | undefined,
  offsetX: number,
  offsetY: number
) {
  const [position, setPosition] = useState<Position>({ x: null, y: null });
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({
    x: 0,
    y: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

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
            x: e.clientX - rect.left + offsetX,
            y: e.clientY - rect.top + offsetY,
          };
          setTargetPosition(newPosition);
          if (
            positionRef.current.x === null ||
            positionRef.current.y === null
          ) {
            setPosition(newPosition);
          }
        }
      } else {
        const newPosition = {
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
        };
        setTargetPosition(newPosition);
        if (positionRef.current.x === null || positionRef.current.y === null) {
          setPosition(newPosition);
        }
      }
    },
    [containerRef, offsetX, offsetY]
  );

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
    element.addEventListener(
      'mousemove',
      updateTargetPosition as EventListener
    );

    if (containerRef?.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
      containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      element.removeEventListener(
        'mousemove',
        updateTargetPosition as EventListener
      );
      if (containerRef?.current) {
        containerRef.current.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );
        containerRef.current.removeEventListener(
          'mouseenter',
          handleMouseEnter
        );
      }
    };
  }, [containerRef, updateTargetPosition]);

  return { position, setPosition, targetPosition, isVisible };
}
