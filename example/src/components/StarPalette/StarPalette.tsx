import React from 'react';
import { motion } from 'framer-motion';
import { StarTemplate } from '../../types/star';
import { STAR_TEMPLATES } from '../../constants/physics';

interface StarPaletteProps {
  onStarDragStart: (template: StarTemplate) => void;
  onStarDragEnd: (
    template: StarTemplate,
    e: MouseEvent | TouchEvent | PointerEvent
  ) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export const StarPalette: React.FC<StarPaletteProps> = ({
  onStarDragStart,
  onStarDragEnd,
  containerRef,
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
    </>
  );
};
