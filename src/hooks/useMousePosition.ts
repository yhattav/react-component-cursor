import { useEffect, useState } from 'react';
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
    element.addEventListener(
      'mousemove',
      updateTargetPosition as EventListener
    );

    if (containerRef?.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
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
      }
    };
  }, [containerRef, offsetX, offsetY, position.x, position.y]);

  return { position, setPosition, targetPosition, isVisible };
}
