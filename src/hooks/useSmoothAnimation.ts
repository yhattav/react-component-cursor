import { useEffect, useCallback } from 'react';
import { Position, TargetPosition } from '../types';

const SMOOTHING_THRESHOLD = 0.1;

export function useSmoothAnimation(
  targetPosition: TargetPosition,
  smoothFactor: number,
  setPosition: React.Dispatch<React.SetStateAction<Position>>
): void {
  // Memoize the smoothing calculation
  const calculateNewPosition = useCallback(
    (currentPosition: Position) => {
      if (currentPosition.x === null || currentPosition.y === null) {
        return currentPosition;
      }

      const dx = targetPosition.x - currentPosition.x;
      const dy = targetPosition.y - currentPosition.y;

      if (
        Math.abs(dx) < SMOOTHING_THRESHOLD &&
        Math.abs(dy) < SMOOTHING_THRESHOLD
      ) {
        return currentPosition;
      }

      return {
        x: currentPosition.x + dx / smoothFactor,
        y: currentPosition.y + dy / smoothFactor,
      };
    },
    [targetPosition.x, targetPosition.y, smoothFactor]
  );

  // Memoize the animation frame callback
  const animate = useCallback(() => {
    let animationFrameId: number;

    const smoothing = () => {
      setPosition((prev) => {
        const newPosition = calculateNewPosition(prev);

        // Only trigger update if position actually changed
        if (newPosition.x === prev.x && newPosition.y === prev.y) {
          return prev;
        }

        return newPosition;
      });

      animationFrameId = requestAnimationFrame(smoothing);
    };

    animationFrameId = requestAnimationFrame(smoothing);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [calculateNewPosition, setPosition]);

  useEffect(() => {
    // If smoothFactor is 1, just set position directly
    if (smoothFactor === 1) {
      setPosition(targetPosition);
      return;
    }

    return animate();
  }, [smoothFactor, targetPosition, animate, setPosition]);
}
