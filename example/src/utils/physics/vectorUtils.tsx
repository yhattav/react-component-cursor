import { Point2D } from '../types/physics';

export const drawArrow = (
  x: number,
  y: number,
  vectorX: number,
  vectorY: number,
  color: string,
  scale: number = 1
) => {
  const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY) * scale;
  const angle = Math.atan2(vectorY, vectorX);

  const endX =
    x + (vectorX / Math.sqrt(vectorX * vectorX + vectorY * vectorY)) * length;
  const endY =
    y + (vectorY / Math.sqrt(vectorX * vectorX + vectorY * vectorY)) * length;

  const arrowSize = Math.min(length * 0.2, 10);
  const arrowAngle = Math.PI / 6;

  const arrowPoint1X = endX - arrowSize * Math.cos(angle - arrowAngle);
  const arrowPoint1Y = endY - arrowSize * Math.sin(angle - arrowAngle);
  const arrowPoint2X = endX - arrowSize * Math.cos(angle + arrowAngle);
  const arrowPoint2Y = endY - arrowSize * Math.sin(angle + arrowAngle);

  return (
    <>
      <line x1={x} y1={y} x2={endX} y2={endY} stroke={color} strokeWidth="2" />
      <line
        x1={endX}
        y1={endY}
        x2={arrowPoint1X}
        y2={arrowPoint1Y}
        stroke={color}
        strokeWidth="2"
      />
      <line
        x1={endX}
        y1={endY}
        x2={arrowPoint2X}
        y2={arrowPoint2Y}
        stroke={color}
        strokeWidth="2"
      />
    </>
  );
};
