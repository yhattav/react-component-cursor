import React, { useState } from 'react';
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
  onDelete?: () => void;
}

export const ParticleRenderer: React.FC<ParticleRenderParams> = ({
  position,
  velocity,
  force,
  color = '#BADA55',
  size = 10,
  showVectors = true,
  trails = [],
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Trail SVG - lowest layer */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
          zIndex: 1,
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

      {/* Vector arrows - middle layer */}
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
            zIndex: 2,
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

      {/* Particle div - top layer */}
      <motion.div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: isHovered ? 'rgba(255, 82, 82, 0.6)' : 'transparent',
          border: `2px solid ${isHovered ? '#ff5252' : color}`,
          borderRadius: '50%',
          position: 'fixed',
          left: position.x,
          top: position.y,
          transformOrigin: 'center center',
          cursor: 'pointer',
          boxShadow: isHovered
            ? '0 0 10px rgba(255, 82, 82, 0.5), inset 0 0 8px rgba(255, 255, 255, 0.3)'
            : '0 0 20px rgba(255,255,255,0.2)',
          zIndex: 3,
        }}
        animate={{
          transform: isHovered
            ? `translate(-50%, -50%) scale(${Math.max(20 / size, 1.2)})`
            : 'translate(-50%, -50%) scale(1)',
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
      />
    </>
  );
};
