import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { GravityPoint } from '../../types/star';

interface GravityPointProps {
  point: GravityPoint;
  index: number;
  onDrag: (e: any, info: PanInfo, index: number) => void;
  onDragEnd: () => void;
  containerRef: React.RefObject<HTMLElement>;
}

export const GravityPointComponent: React.FC<GravityPointProps> = ({
  point,
  index,
  onDrag,
  onDragEnd,
  containerRef,
}) => {
  return (
    <motion.div
      key={`point-${index}`}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDrag={(e, info) => onDrag(e, info, index)}
      onDragEnd={onDragEnd}
      initial={{ x: point.x, y: point.y }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        cursor: 'grab',
        zIndex: 2,
      }}
      dragConstraints={containerRef}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${point.mass / 100}px`,
          height: `${point.mass / 100}px`,
          background: `radial-gradient(circle at center, 
            ${point.color}20 0%, 
            ${point.color}10 30%, 
            ${point.color}05 60%, 
            transparent 70%
          )`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite ease-in-out',
        }}
      />

      <div
        style={{
          width: '16px',
          height: '16px',
          backgroundColor: point.color,
          borderRadius: '50%',
          transition: 'all 0.3s ease',
          boxShadow: `0 0 10px ${point.color}`,
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: point.color,
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}
      >
        {point.label}
        <div
          style={{
            width: '50px',
            height: '4px',
            background: `linear-gradient(90deg, ${point.color} ${
              point.mass / 1000
            }%, transparent ${point.mass / 1000}%)`,
            borderRadius: '2px',
            marginTop: '4px',
          }}
        />
      </div>
    </motion.div>
  );
};
