'use client';

import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

interface WarpCursorProps {
  amount: number;
  start: number;
  offset: number;
  children: JSX.Element;
  containerRef: React.RefObject<HTMLElement | null>;
  cursorOffset?: { x: number; y: number };
  className?: string;
}

function WarpCursor({ 
  amount, 
  start, 
  offset, 
  children, 
  containerRef, 
  cursorOffset = { x: 5, y: 5 },
  className = "z-50"
}: WarpCursorProps) {
  return (
    <>
      {Array.from({ length: amount }, (_, index) => {
        const smoothness = start + (index * offset);
        
        return (
          <CustomCursor
            key={index}
            containerRef={containerRef}
            className={className}
            smoothness={smoothness}
            offset={cursorOffset}
          >
            {children}
          </CustomCursor>
        );
      })}
    </>
  );
}

export { WarpCursor }; 