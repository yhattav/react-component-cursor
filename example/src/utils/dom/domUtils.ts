import { Point2D } from '../types/physics';

export const getContainerOffset = (
  containerRef: React.RefObject<HTMLElement>
): Point2D => {
  const containerRect = containerRef.current?.getBoundingClientRect();
  return {
    x: containerRect?.left || 0,
    y: containerRect?.top || 0,
  };
};
