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

  // Generate gap classes
  const gapClass = gap > 0 ? `gap-${gap}` : 'gap-0';
  
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
      {/* Overlay grid that reveals borders */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 ${gridClasses} ${overlayClassName}`}
        style={{
          color: borderColor,
          maskImage: `radial-gradient(circle ${glowRadius}px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)`,
          WebkitMaskImage: `radial-gradient(circle ${glowRadius}px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)`,
        }}
      >
        {[...Array(childCount)].map((_, i) => (
          <div key={i} className="border border-current" />
        ))}
      </div>

      {/* Content Grid */}
      <div className={gridClasses}>
        {children}
      </div>

      {/* CustomCursor to drive the effect */}
      <CustomCursor containerRef={gridWrapperRef} smoothness={smoothness} onMove={handleCursorMove} />
    </div>
  );
}

export { AnimatedGrid }; 