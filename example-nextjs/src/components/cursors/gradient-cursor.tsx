'use client';

import React from 'react';

interface GradientCursorProps {
  x: number;
  y: number;
}

function GradientCursor({ x, y }: GradientCursorProps) {
  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-100 ease-out"
      style={{
        left: x - 16,
        top: y - 16,
        transform: 'translate(0, 0)',
      }}
    >
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full blur-sm opacity-60 animate-pulse" />
        
        {/* Main cursor */}
        <div className="relative w-8 h-8 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full shadow-lg">
          {/* Inner highlight */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full" />
          
          {/* Trailing particles */}
          <div className="absolute inset-0 w-full h-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-40"
                style={{
                  left: `${20 + i * 8}px`,
                  top: `${12 + i * 2}px`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { GradientCursor }; 