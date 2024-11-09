import { Point2D, Force, GravityPoint } from '../types/physics';

export const calculateGravitationalForce = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  mass: number,
  G = 0.1,
  minDistance = 30,
  maxForce = 2
): Force => {
  if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
    return { fx: 0, fy: 0 };
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return { fx: 0, fy: 0 };

  const force = Math.min(
    (G * (mass * 1)) / Math.max(distance * distance, minDistance * minDistance),
    maxForce
  );

  const falloffStart = minDistance * 2;
  const smoothingFactor =
    distance < falloffStart ? Math.pow(distance / falloffStart, 0.5) : 1;

  const dirX = dx / distance;
  const dirY = dy / distance;

  return {
    fx: Number.isFinite(dirX * force) ? dirX * force * smoothingFactor : 0,
    fy: Number.isFinite(dirY * force) ? dirY * force * smoothingFactor : 0,
  };
};

export const calculateTotalForce = (
  cursorPos: Point2D,
  pointerPos: Point2D,
  gravityPoints: GravityPoint[],
  offset: Point2D,
  pointerMass = 50000
): Force => {
  let totalFx = 0;
  let totalFy = 0;

  // Add pointer gravitational pull
  const pointerForce = calculateGravitationalForce(
    cursorPos.x,
    cursorPos.y,
    pointerPos.x,
    pointerPos.y,
    pointerMass
  );
  totalFx += pointerForce.fx;
  totalFy += pointerForce.fy;

  // Add gravity points force
  gravityPoints.forEach((point) => {
    const force = calculateGravitationalForce(
      cursorPos.x,
      cursorPos.y,
      point.x + offset.x,
      point.y + offset.y,
      point.mass
    );
    totalFx += force.fx;
    totalFy += force.fy;
  });

  return { fx: totalFx, fy: totalFy };
};
