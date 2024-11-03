import { useEffect } from 'react';
import { Position, TargetPosition } from '../types';

const SMOOTHING_THRESHOLD = 0.1;

export function useSmoothAnimation(
  position: Position,
  targetPosition: TargetPosition,
  smoothFactor: number,
  setPosition: React.Dispatch<React.SetStateAction<Position>>
) {
  useEffect(() => {
    if (position.x === null || position.y === null) return;

    let animationFrameId: number;

    if (smoothFactor === 1) {
      setPosition(targetPosition);
      return;
    }

    const smoothing = () => {
      setPosition((prev) => {
        if (prev.x === null || prev.y === null) return prev;

        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;

        if (
          Math.abs(dx) < SMOOTHING_THRESHOLD &&
          Math.abs(dy) < SMOOTHING_THRESHOLD
        ) {
          return prev;
        }

        return {
          x: prev.x + dx / smoothFactor,
          y: prev.y + dy / smoothFactor,
        };
      });

      animationFrameId = requestAnimationFrame(smoothing);
    };

    animationFrameId = requestAnimationFrame(smoothing);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [position.x, position.y, targetPosition, smoothFactor, setPosition]);

  return null;
}
