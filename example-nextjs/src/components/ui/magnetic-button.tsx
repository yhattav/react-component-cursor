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
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  variant = 'default',
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
    const button = buttonRef.current;
    if (!container || !button) return;

    // Get button position to calculate relative offset
    const buttonRect = button.getBoundingClientRect();
    
    // Convert global cursor position to relative position within button
    const relativeX = position.x - buttonRect.left - buttonRect.width / 2;
    const relativeY = position.y - buttonRect.top - buttonRect.height / 2;
    
    // Limit the magnetic pull distance
    const maxPull = 8; // Maximum pixels to pull the button
    const limitedX = Math.max(-maxPull, Math.min(maxPull, relativeX * 0.1));
    const limitedY = Math.max(-maxPull, Math.min(maxPull, relativeY * 0.1));
    
    setCursorPosition({ x: limitedX, y: limitedY });
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
        return `${baseStyles} border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white`;
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