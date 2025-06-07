import { useEffect, useCallback } from 'react';
import { NullablePosition } from '../types.js';
import { isSSR } from '../utils/ssr';

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

      animationFrameId = requestAnimationFrame(smoothing);
    };

    animationFrameId = requestAnimationFrame(smoothing);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [calculateNewPosition, setPosition, targetPosition]);

  useEffect(() => {
    // Skip animation during SSR
    if (isSSR()) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = !isSSR() && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If smoothFactor is 1 or user prefers reduced motion, set position directly
    if (smoothFactor === 1 || prefersReducedMotion) {
      setPosition(targetPosition);
      return;
    }

    return animate();
  }, [smoothFactor, targetPosition.x, targetPosition.y, animate, setPosition]);
}
