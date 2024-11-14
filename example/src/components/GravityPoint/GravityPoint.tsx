import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GravityPoint } from '../../types/star';
import { Point2D } from '../../utils/types/physics';
interface GravityPointComponentProps {
  point: GravityPoint;
  index: number;
  onDrag: () => void;
  onDragEnd: () => void;
  reportNewPosition: (point: Point2D, index: number) => void;
  onDelete: (index: number) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export const GravityPointComponent: React.FC<GravityPointComponentProps> = ({
  point,
  index,
  onDrag,
  reportNewPosition,
  onDragEnd,
  onDelete,
  containerRef,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isDraggingRef = useRef(false);

  const handlePointerDown = () => {
    isDraggingRef.current = false;
    timeoutRef.current = setTimeout(() => {
      isDraggingRef.current = true;
    }, 200); // Wait 200ms before considering it a drag
  };

  const reportPosition = (newPosition: Point2D) => {
    const container = containerRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const finalPosition = {
        x: Math.round(newPosition.x + containerRect.left),
        y: Math.round(newPosition.y + containerRect.top),
      };
      reportNewPosition(finalPosition, index);
    }
  };

  const handlePointerUp = () => {
    clearTimeout(timeoutRef.current);
    if (!isDraggingRef.current) {
      onDelete(index);
    }
    isDraggingRef.current = false;
  };

  return (
    <motion.div
      ref={elementRef}
      onUpdate={(latest) => {
        console.log('LATEST', latest);
        reportPosition({ x: Number(latest.x), y: Number(latest.y) });
      }}
      drag
      dragMomentum={false}
      //dragElastic={0}
      onDrag={() => {
        isDraggingRef.current = true;
        onDrag();
      }}
      initial={{ x: point.x, y: point.y }}
      onDragEnd={onDragEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      data-point={index}
      style={{
        position: 'absolute',
        cursor: 'grab',
        zIndex: 2,
      }}
      dragConstraints={containerRef}
      whileDrag={{ cursor: 'grabbing' }}
      whileHover={{
        scale: 1.1,
      }}
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
