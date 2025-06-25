import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  'data-testid'?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
  'data-testid': dataTestId,
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    const container = containerRef.current;
    if (!container) return;

    // Get container position to calculate relative offset
    const containerRect = container.getBoundingClientRect();
    
    // Convert global cursor position to relative position within container
    const relativeX = position.x - containerRect.left - containerRect.width / 2;
    const relativeY = position.y - containerRect.top - containerRect.height / 2;
    
    setCursorPosition({ x: relativeX, y: relativeY });
    setIsHovering(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  const handleVisibilityChange = useCallback((isVisible: boolean) => {
    if (!isVisible) {
      setCursorPosition({ x: 0, y: 0 });
      setIsHovering(false);
    }
  }, []);

  return (
    <>
      <div ref={containerRef} className="inline-block">
        <motion.button
          ref={buttonRef}
          className={`
            inline-flex items-center justify-center
            bg-gradient-to-r from-blue-500 to-purple-600 
            hover:from-blue-600 hover:to-purple-700 
            text-white font-bold py-4 px-8 rounded-lg text-lg 
            transition-colors duration-300 shadow-xl
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `}
          onClick={handleClick}
          animate={{
            x: cursorPosition.x,
            y: cursorPosition.y,
            scale: isHovering ? 1.05 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 35,
            mass: 1.2
          }}
          whileTap={{ scale: 0.95 }}
          data-testid={dataTestId}
        >
          {children}
        </motion.button>
      </div>

      <CustomCursor 
        containerRef={containerRef}
        smoothness={1}
        className="z-50"
        centered={true}
        onMove={handleCursorMove}
        onVisibilityChange={handleVisibilityChange}
        style={{ opacity: 0 }}
        id={`magnetic-cursor-${dataTestId}`}
      />
    </>
  );
}; 