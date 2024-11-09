import { Point2D, Force, GravityPoint } from '../types/physics';

// Basic physics calculations
export const calculateDistance = (p1: Point2D, p2: Point2D): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const calculateDirectionVector = (p1: Point2D, p2: Point2D): Point2D => {
  const distance = calculateDistance(p1, p2);
  if (distance === 0) return { x: 0, y: 0 };
  return {
    x: (p2.x - p1.x) / distance,
    y: (p2.y - p1.y) / distance,
  };
};

// Newton's law of universal gravitation (simplified)
export const calculateGravityMagnitude = (
  distance: number,
  mass: number,
  G = 0.1,
  minDistance = 30,
  maxForce = 2
): number => {
  const force = Math.min(
    (G * mass) / Math.max(distance * distance, minDistance * minDistance),
    maxForce
  );
  return force;
};

// Force falloff calculation
export const calculateForceFalloff = (
  distance: number,
  falloffStartDistance: number
): number => {
  return distance < falloffStartDistance
    ? Math.pow(distance / falloffStartDistance, 0.5)
    : 1;
};

// Updated main functions using the extracted physics calculations
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

  const p1: Point2D = { x: x1, y: y1 };
  const p2: Point2D = { x: x2, y: y2 };

  const distance = calculateDistance(p1, p2);
  if (distance === 0) return { fx: 0, fy: 0 };

  const forceMagnitude = calculateGravityMagnitude(
    distance,
    mass,
    G,
    minDistance,
    maxForce
  );

  const dirVector = calculateDirectionVector(p1, p2);

  const forceFalloff = calculateForceFalloff(distance, minDistance * 2);

  return {
    fx: Number.isFinite(dirVector.x * forceMagnitude)
      ? dirVector.x * forceMagnitude * forceFalloff
      : 0,
    fy: Number.isFinite(dirVector.y * forceMagnitude)
      ? dirVector.y * forceMagnitude * forceFalloff
      : 0,
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
