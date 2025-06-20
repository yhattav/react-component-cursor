'use client';

import React from 'react';

interface ContainerCursorProps {
  x: number;
  y: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function ContainerCursor({ x, y, containerRef }: ContainerCursorProps) {
  const containerRect = containerRef.current?.getBoundingClientRect();
  
  if (!containerRect) return null;

  // Calculate relative position within the container
  const relativeX = x - containerRect.left;
  const relativeY = y - containerRect.top;
  
  // Create a morphing container that follows the cursor
  return (
    <div
      className="pointer-events-none fixed z-50 transition-all duration-200 ease-out"
      style={{
        left: x - 60,
        top: y - 40,
        transform: `rotate(${(relativeX - containerRect.width / 2) * 0.1}deg)`,
      }}
    >
      {/* Main floating container */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-purple-500/30 rounded-2xl blur-lg animate-pulse" />
        
        {/* Main container */}
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 rounded-xl p-4 shadow-2xl backdrop-blur-sm border border-white/20 min-w-[120px]">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <div className="text-white/70 text-xs font-mono">cursor.tsx</div>
          </div>
          
          {/* Content */}
          <div className="space-y-1">
            <div className="text-xs font-mono text-cyan-200">
              &lt;CustomCursor&gt;
            </div>
            <div className="text-xs font-mono text-white/80 ml-2">
              {`{ x: ${Math.round(relativeX)}, y: ${Math.round(relativeY)} }`}
            </div>
            <div className="text-xs font-mono text-cyan-200">
              &lt;/CustomCursor&gt;
            </div>
          </div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-xl border-2 border-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-50 animate-pulse" />
          
          {/* Floating particles */}
          <div className="absolute -top-2 -right-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" 
                 style={{ animationDelay: '0ms', animationDuration: '1s' }} />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                 style={{ animationDelay: '300ms', animationDuration: '1.2s' }} />
          </div>
          <div className="absolute top-1/2 -right-3">
            <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" 
                 style={{ animationDelay: '600ms', animationDuration: '0.8s' }} />
          </div>
        </div>
        
        {/* Trailing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-xl transform scale-110 -z-10 animate-pulse" 
             style={{ animationDelay: '150ms' }} />
      </div>
    </div>
  );
}

export { ContainerCursor }; 