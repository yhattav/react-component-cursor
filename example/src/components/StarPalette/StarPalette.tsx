import React from 'react';
import { motion } from 'framer-motion';
import { StarTemplate } from '../../types/star';
import { Point2D } from '../../types/physics';
import { STAR_TEMPLATES } from '../../constants/physics';

interface StarPaletteProps {
  onStarDragStart: (template: StarTemplate) => void;
  onStarDragEnd: (
    template: StarTemplate,
    e: MouseEvent | TouchEvent | PointerEvent
  ) => void;
  containerRef: React.RefObject<HTMLElement>;
  isDraggingNewStar: boolean;
  dragPosition: Point2D | null;
  newStarTemplate: StarTemplate | null;
  setDragPosition: (position: Point2D) => void;
}

export const StarPalette: React.FC<StarPaletteProps> = ({
  onStarDragStart,
  onStarDragEnd,
  containerRef,
  isDraggingNewStar,
  dragPosition,
  newStarTemplate,
  setDragPosition,
}) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '15px',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
        }}
      >
        {STAR_TEMPLATES.map((template, index) => (
          <motion.div
            key={index}
            drag
            dragSnapToOrigin
            dragConstraints={containerRef}
            whileDrag={{ scale: 1.1, zIndex: 1000 }}
            onDragStart={() => onStarDragStart(template)}
            onDragEnd={(e) => onStarDragEnd(template, e)}
            onDrag={(event, info) => {
              setDragPosition({ x: info.point.x, y: info.point.y });
            }}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
              position: 'relative',
              touchAction: 'none',
            }}
          >
            <div
              style={{
                width: template.size,
                height: template.size,
                backgroundColor: template.color,
                borderRadius: '50%',
                boxShadow: `0 0 15px ${template.color}`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '100%',
                marginLeft: '10px',
                color: template.color,
                fontSize: '12px',
                whiteSpace: 'nowrap',
                opacity: 0,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
              }}
              className="star-label"
            >
              {template.label}
            </div>
          </motion.div>
        ))}
      </div>

      {isDraggingNewStar && dragPosition && newStarTemplate && (
        <motion.div
          style={{
            position: 'fixed',
            left: dragPosition.x,
            top: dragPosition.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 1001,
          }}
        >
          <div
            style={{
              width: newStarTemplate.size,
              height: newStarTemplate.size,
              backgroundColor: newStarTemplate.color,
              borderRadius: '50%',
              boxShadow: `0 0 15px ${newStarTemplate.color}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: `${newStarTemplate.mass / 100}px`,
              height: `${newStarTemplate.mass / 100}px`,
              background: `radial-gradient(circle at center, 
                ${newStarTemplate.color}20 0%, 
                ${newStarTemplate.color}10 30%, 
                ${newStarTemplate.color}05 60%, 
                transparent 70%
              )`,
              transform: 'translate(-50%, -50%)',
              animation: 'pulse 2s infinite ease-in-out',
            }}
          />
        </motion.div>
      )}
    </>
  );
};
