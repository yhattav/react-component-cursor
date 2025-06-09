'use client';

import React, { useState, useEffect } from 'react';

interface InteractiveCursorProps {
  x: number;
  y: number;
}

function InteractiveCursor({ x, y }: InteractiveCursorProps) {
  const [clicks, setClicks] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setClicks(prev => prev + 1);
      setIsActive(true);
      
      // Add ripple effect
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
      
      // Reset active state
      setTimeout(() => setIsActive(false), 200);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className="pointer-events-none fixed z-50 transition-all duration-150 ease-out"
        style={{
          left: x - 20,
          top: y - 20,
          transform: isActive ? 'scale(1.5)' : 'scale(1)',
        }}
      >
        <div className="relative">
          {/* Core cursor */}
          <div className={`w-10 h-10 border-2 rounded-full transition-all duration-150 ${
            isActive 
              ? 'border-green-400 bg-green-400/20 shadow-lg shadow-green-400/50' 
              : 'border-green-500 bg-green-500/10'
          }`}>
            {/* Click counter */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {clicks}
              </div>
            </div>
            
            {/* Inner elements */}
            <div className="absolute inset-2 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive ? 'bg-green-300 scale-150' : 'bg-green-500'
              }`} />
            </div>
            
            {/* Orbital rings */}
            <div className="absolute inset-0 rounded-full border border-green-400/30 animate-spin" 
                 style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 rounded-full border border-green-300/20 animate-spin" 
                 style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="pointer-events-none fixed z-40"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
          }}
        >
          <div className="w-12 h-12 border-2 border-green-400 rounded-full animate-ping opacity-75" />
        </div>
      ))}
    </>
  );
}

export { InteractiveCursor }; 