import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
  'data-testid'?: string;
  /** Maximum pixels the button can be pulled toward the cursor */
  maxPull?: number;
  /** How responsive the magnetic effect is (0-1, where 1 is very sensitive) */
  sensitivity?: number;
  /** Scale factor when hovering */
  hoverScale?: number;
}

// Default magnetic effect constants
const DEFAULT_MAX_PULL = 15;
const DEFAULT_SENSITIVITY = 0.3;
const DEFAULT_HOVER_SCALE = 1.05;

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  disabled = false,
  'data-testid': dataTestId,
  maxPull = DEFAULT_MAX_PULL,
  sensitivity = DEFAULT_SENSITIVITY,
  hoverScale = DEFAULT_HOVER_SCALE,
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    const container = containerRef.current;
    if (!container) return;

    // Get container position to calculate relative offset (fixed reference point)
    const containerRect = container.getBoundingClientRect();
    
    // Convert global cursor position to relative position within container
    const relativeX = position.x - containerRect.left - containerRect.width / 2;
    const relativeY = position.y - containerRect.top - containerRect.height / 2;
    
    // Apply magnetic pull with configurable limits
    const limitedX = Math.max(-maxPull, Math.min(maxPull, relativeX * sensitivity));
    const limitedY = Math.max(-maxPull, Math.min(maxPull, relativeY * sensitivity));
    
    setCursorPosition({ x: limitedX, y: limitedY });
    setIsHovering(true);
  }, [maxPull, sensitivity]);

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

  // Define styles based on variant
  const getButtonStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-bold py-4 px-8 rounded-lg text-lg 
      transition-colors duration-300 w-60
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;
    
    switch (variant) {
      case 'outline':
        return `${baseStyles} text-purple-400 hover:bg-purple-400 hover:text-white shadow-[inset_0_0_0_2px_rgb(168_85_247)] hover:shadow-[inset_0_0_0_2px_rgb(168_85_247)]`;
      default:
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl`;
    }
  };

  return (
    <>
      <div ref={containerRef} className="inline-block">
        <motion.button
          ref={buttonRef}
          className={`${getButtonStyles()} ${className}`}
          onClick={handleClick}
          animate={{
            x: cursorPosition.x,
            y: cursorPosition.y,
            scale: isHovering ? hoverScale : 1
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