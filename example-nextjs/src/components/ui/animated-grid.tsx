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
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

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

  // Generate gap classes - ensure we use valid Tailwind gap values
  const generateGapClass = useCallback(() => {
    if (gap === 0) return 'gap-0';
    if (gap <= 1) return 'gap-1';
    if (gap <= 2) return 'gap-2'; 
    if (gap <= 3) return 'gap-3';
    if (gap <= 4) return 'gap-4';
    if (gap <= 6) return 'gap-6';
    if (gap <= 8) return 'gap-8';
    if (gap <= 10) return 'gap-10';
    if (gap <= 12) return 'gap-12';
    return 'gap-4'; // Default fallback
  }, [gap]);

  const gapClass = generateGapClass();
  
  // Generate border thickness class
  const getBorderClass = useCallback(() => {
    if (borderThickness === 1) return 'border';
    if (borderThickness === 2) return 'border-2';
    if (borderThickness === 4) return 'border-4';
    if (borderThickness === 8) return 'border-8';
    return 'border'; // Default fallback
  }, [borderThickness]);
  
  // Count children to create matching overlay cells
  const childCount = React.Children.count(children);

  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    const rect = gridWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: position.x - rect.left, y: position.y - rect.top });
  }, []);

  const gridClasses = `grid ${generateGridClasses()} ${gapClass}`;

  return (
    <div 
      ref={gridWrapperRef} 
      className={`relative ${className}`}
      style={{
        '--cursor-x': `${cursorPos.x}px`,
        '--cursor-y': `${cursorPos.y}px`,
      } as React.CSSProperties}
    >
      {/* Content area wrapper - this defines the exact area we want to overlay */}
      <div className="relative">
        {/* Overlay grid that reveals borders - positioned exactly over content grid */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 ${gridClasses} ${overlayClassName}`}
          style={{
            color: borderColor,
            maskImage: `radial-gradient(circle ${glowRadius}px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)`,
            WebkitMaskImage: `radial-gradient(circle ${glowRadius}px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)`,
          }}
        >
          {[...Array(childCount)].map((_, i) => (
            <div 
              key={i} 
              className={`${getBorderClass()} border-current ${gap > 0 ? 'rounded-sm' : ''}`}
              style={gap > 0 ? { 
                backgroundColor: 'transparent',
                boxSizing: 'border-box'
              } : undefined}
            />
          ))}
        </div>

        {/* Content Grid */}
        <div className={gridClasses}>
          {children}
        </div>
      </div>

      {/* CustomCursor to drive the effect */}
      <CustomCursor containerRef={gridWrapperRef} smoothness={smoothness} onMove={handleCursorMove} />
    </div>
  );
}

export { AnimatedGrid }; 