import React from 'react';
import { motion } from 'framer-motion';
import { drawArrow } from '../../utils/physics/vectorUtils';
import { Point2D, Force } from '../../types/physics';

interface TrailPoint extends Point2D {
  timestamp: number;
}

interface ParticleRenderParams {
  position: Point2D;
  velocity: Point2D;
  force: Force;
  color?: string;
  size?: number;
  showVectors?: boolean;
  trails?: TrailPoint[];
}

export const ParticleRenderer: React.FC<ParticleRenderParams> = ({
  position,
  velocity,
  force,
  color = '#BADA55',
  size = 20,
  showVectors = true,
  trails = [],
}) => {
  return (
    <>
      {showVectors && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {/* Velocity vector */}
          {drawArrow(
            position.x,
            position.y,
            velocity.x,
            velocity.y,
            '#4CAF50',
            40
          )}

          {/* Force/Acceleration vector */}
          {drawArrow(
            position.x,
            position.y,
            force.fx,
            force.fy,
            '#FF4081',
            200
          )}
        </svg>
      )}
      <motion.div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: 'transparent',
          border: `2px solid ${color}`,
          borderRadius: '50%',
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.2s ease',
          boxShadow: `0 0 20px rgba(255,255,255,0.2)`,
        }}
      />

      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {trails.length > 1 &&
          trails.slice(0, -1).map((point, i) => {
            const nextPoint = trails[i + 1];
            const progress = 1 - i / (trails.length - 1);
            return (
              <line
                key={i}
                x1={point.x}
                y1={point.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                stroke={color}
                strokeWidth={size * progress * 0.8}
                strokeOpacity={progress * 0.4}
                strokeLinecap="round"
              />
            );
          })}
      </svg>
    </>
  );
};
