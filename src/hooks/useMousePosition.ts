import { useEffect, useState, useCallback, useRef } from 'react';
import { Position } from '../types';

export function useMousePosition(
  containerRef: React.RefObject<HTMLElement> | undefined,
  offsetX: number,
  offsetY: number
): {
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  targetPosition: Position;
  isVisible: boolean;
} {
  const [position, setPosition] = useState<Position>({ x: null, y: null });
  const [targetPosition, setTargetPosition] = useState<Position>({
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
    [containerRef, offsetX, offsetY]
  );
  // useEffect(() => {
  //   console.log('targetPosition', targetPosition);
  // }, [targetPosition]);

  // useEffect(() => {
  //   console.log('position', position);
  // }, [position]);

  // useEffect(() => {
  //   console.log('isVisible', isVisible);
  // }, [isVisible]);

  // useEffect(() => {
  //   console.log('offsetX', offsetX);
  // }, [offsetX]);

  // useEffect(() => {
  //   console.log('offsetY', offsetY);
  // }, [offsetY]);

  // useEffect(() => {
  //   console.log('containerRef', containerRef);
  // }, [containerRef]);

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

  // Initialize position when we get the first valid targetPosition
  useEffect(() => {
    if (position.x === null && position.y === null) {
      setPosition(targetPosition);
    }
  }, [targetPosition]);

  return { position, setPosition, targetPosition, isVisible };
}
