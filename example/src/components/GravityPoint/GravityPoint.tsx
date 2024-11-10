import React, { useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { GravityPoint, Point2D } from '../../types/star';
import debounce from 'lodash/debounce';

interface GravityPointComponentProps {
  point: GravityPoint;
  index: number;
  onDrag: (point: Point2D, index: number) => void;
  onDragEnd: () => void;
  onDelete: (index: number) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export const GravityPointComponent: React.FC<GravityPointComponentProps> = ({
  point,
  index,
  onDrag,
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

  const handlePointerUp = () => {
    clearTimeout(timeoutRef.current);
    if (!isDraggingRef.current) {
      onDelete(index);
    }
    isDraggingRef.current = false;
  };

  useEffect(() => {
    if (!elementRef.current) return;

    const updateFinalPosition = debounce(() => {
      console.count('CALLED');
      const element = elementRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const finalX = rect.left + rect.width / 2;
        const finalY = rect.top + rect.height / 2;
        onDrag({ x: finalX, y: finalY }, index);
      }
    }, 50);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style' &&
          mutation.target instanceof HTMLElement
        ) {
          const oldTransform = (mutation.oldValue || '').match(
            /transform: ([^;]+)/
          )?.[1];
          const newTransform = mutation.target.style.transform;
          if (
            oldTransform !== newTransform &&
            newTransform !== 'none' &&
            oldTransform !== 'none'
          ) {
            updateFinalPosition();
          }
        }
      }
    });

    observer.observe(elementRef.current, {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true,
    });

    return () => {
      observer.disconnect();
      updateFinalPosition.cancel();
    };
  }, [index, onDrag, containerRef]);

  return (
    <motion.div
      ref={elementRef}
      drag
      dragMomentum={true}
      dragElastic={0}
      onDrag={(e, info) => {
        isDraggingRef.current = true;
        onDrag({ x: info.point.x, y: info.point.y }, index);
      }}
      onDragEnd={onDragEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      data-point={index}
      style={{
        position: 'absolute',
        left: point.x,
        top: point.y,
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
