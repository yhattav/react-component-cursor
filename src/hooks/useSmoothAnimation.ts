import { useEffect, useCallback } from 'react';
import { NullablePosition } from '../types.js';

const SMOOTHING_THRESHOLD = 0.1;

export function useSmoothAnimation(
  targetPosition: NullablePosition,
  smoothFactor: number,
  setPosition: React.Dispatch<React.SetStateAction<NullablePosition>>
): void {
  // Memoize the smoothing calculation
  const calculateNewPosition = useCallback(
    (currentPosition: NullablePosition) => {
      if (
        currentPosition.x === null ||
        currentPosition.y === null ||
        targetPosition.x === null ||
        targetPosition.y === null
      ) {
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

      // Handle missing requestAnimationFrame gracefully
      if (typeof requestAnimationFrame === 'function') {
        animationFrameId = requestAnimationFrame(smoothing);
      } else {
        // Fallback to setTimeout if RAF is not available
        animationFrameId = setTimeout(smoothing, 16) as unknown as number;
      }
    };

    // Handle missing requestAnimationFrame gracefully
    try {
      if (typeof requestAnimationFrame === 'function') {
        animationFrameId = requestAnimationFrame(smoothing);
      } else {
        // Fallback to setTimeout if RAF is not available
        animationFrameId = setTimeout(smoothing, 16) as unknown as number;
      }
    } catch (error) {
      // Handle RAF errors gracefully
      console.error('Animation frame error:', error);
      // Fallback to direct position setting
      setPosition(targetPosition);
    }

    return () => {
      if (animationFrameId) {
        if (typeof cancelAnimationFrame === 'function') {
          cancelAnimationFrame(animationFrameId);
        } else {
          clearTimeout(animationFrameId);
        }
      }
    };
  }, [calculateNewPosition, setPosition, targetPosition]);

  useEffect(() => {
    // If smoothFactor is 1, just set position directly
    if (smoothFactor === 1) {
      setPosition(targetPosition);
      return;
    }

    return animate();
  }, [smoothFactor, targetPosition, animate, setPosition]);
}
