'use client';

import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

interface GridColumns {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

interface AnimatedGridProps {
  children: React.ReactNode;
  cols?: GridColumns;
  gap?: number;
  borderColor?: string;
  borderThickness?: number;
  glowRadius?: number;
  smoothness?: number;
  className?: string;
  overlayClassName?: string;
}

function AnimatedGrid({
  children,
  cols = { base: 1, sm: 2, lg: 3 },
  gap = 0,
  borderColor = 'rgba(168, 85, 247, 0.9)',
  borderThickness = 1,
  glowRadius = 300,
  smoothness = 2,
  className = '',
  overlayClassName = '',
}: AnimatedGridProps) {
  const gridWrapperRef = useRef<HTMLDivElement>(null!);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Generate Tailwind grid classes from columns config
  const generateGridClasses = useCallback(() => {
    const classes: string[] = [];
    
    if (cols.base) classes.push(`grid-cols-${cols.base}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    return classes.join(' ');
  }, [cols]);

  // Use CSS properties directly for full flexibility
  const gridStyles = {
    gap: gap > 0 ? `${gap}px` : '0px',
  };

  const borderStyles = {
    borderWidth: `${borderThickness}px`,
    borderStyle: 'solid',
  };
  
  // Count children to create matching overlay cells
  const childCount = React.Children.count(children);

  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    const rect = gridWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: position.x - rect.left, y: position.y - rect.top });
  }, []);

  const gridClasses = `grid ${generateGridClasses()}`;

  // Only show effect when we have a valid cursor position
  const hasValidCursor = cursorPos !== null;

  return (
    <div 
      ref={gridWrapperRef} 
      className={`relative ${className}`}
      style={{
        '--cursor-x': hasValidCursor ? `${cursorPos.x}px` : '0px',
        '--cursor-y': hasValidCursor ? `${cursorPos.y}px` : '0px',
      } as React.CSSProperties}
    >
      {/* Content area wrapper - this defines the exact area we want to overlay */}
      <div className="relative">
        {/* Overlay grid that reveals borders - only render when cursor is active */}
        {hasValidCursor && (
          <div
            className={`pointer-events-none absolute inset-0 z-20 ${gridClasses} ${overlayClassName}`}
            style={{
              color: borderColor,
              maskImage: `radial-gradient(circle ${glowRadius}px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)`,
              WebkitMaskImage: `radial-gradient(circle ${glowRadius}px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)`,
              ...gridStyles,
            }}
          >
            {[...Array(childCount)].map((_, i) => (
              <div 
                key={i} 
                className={`border-current ${gap > 0 ? 'rounded-sm' : ''}`}
                style={{
                  ...borderStyles,
                  borderColor: 'currentColor',
                  backgroundColor: 'transparent',
                  boxSizing: 'border-box'
                }}
              />
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div className={gridClasses} style={gridStyles}>
          {children}
        </div>
      </div>

      {/* CustomCursor to drive the effect */}
      <CustomCursor smoothness={smoothness} onMove={handleCursorMove} />
    </div>
  );
}

export { AnimatedGrid }; 