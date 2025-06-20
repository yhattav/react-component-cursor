'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CodeSnippet } from '../ui/code-snippet';

/**
 * Performance Optimized Cursor Component
 * Demonstrates React optimization patterns: useCallback, useMemo, React.memo
 */
const PerformanceOptimizedCursor = React.memo(function PerformanceOptimizedCursor() {
  const [frameCount, setFrameCount] = useState(0);

  // Memoized cursor style for performance
  const cursorStyle = useMemo(() => ({
    transition: 'transform 100ms ease-out',
    willChange: 'transform',
  }), []);

  // Memoized particles configuration
  const particles = useMemo(() => (
    [...Array(6)].map((_, i) => ({
      id: i,
      size: 2 + (i % 3),
      delay: i * 100,
      radius: 15 + (i * 5),
      speed: 2 + (i % 2),
    }))
  ), []);

  // Optimized frame update handler
  const handleFrameUpdate = useCallback(() => {
    setFrameCount(prev => prev + 1);
  }, []);

  return (
    <div 
      className="w-12 h-12 relative"
      style={cursorStyle}
      onMouseMove={handleFrameUpdate}
    >
      {/* GPU-accelerated particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/60 animate-pulse"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${24 + Math.cos(frameCount * 0.02 + particle.delay) * particle.radius}px`,
            top: `${24 + Math.sin(frameCount * 0.02 + particle.delay) * particle.radius}px`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${1000 + particle.speed * 500}ms`,
            willChange: 'transform',
          }}
        />
      ))}
      
      {/* Central core with efficient rendering */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg">
          {/* Performance indicator */}
          <div className="absolute -inset-1 rounded-full border border-blue-300/50 animate-spin"
               style={{ animationDuration: '1s' }} />
          
          {/* Center dot */}
          <div className="absolute inset-2 rounded-full bg-white/80 shadow-inner" />
        </div>
      </div>
      
      {/* Frame rate indicator */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-mono whitespace-nowrap">
          {Math.round(frameCount / 10)} fps
        </div>
      </div>
    </div>
  );
});

// Pre-highlighted code string showing the ACTUAL implementation
const codeString = `<span class="text-blue-400">import</span> { <span class="text-green-400">CustomCursor</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'@yhattav/react-component-cursor'</span>;
<span class="text-blue-400">import</span> { <span class="text-green-400">useCallback</span>, <span class="text-green-400">useMemo</span>, <span class="text-green-400">memo</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'react'</span>;

<span class="text-blue-400">const</span> <span class="text-green-400">OptimizedCursor</span> = <span class="text-green-400">memo</span>(<span class="text-blue-400">function</span> <span class="text-green-400">OptimizedCursor</span>() {
  <span class="text-blue-400">const</span> <span class="text-yellow-300">containerRef</span> = <span class="text-green-400">useRef</span>(<span class="text-orange-400">null</span>);
  <span class="text-blue-400">const</span> [<span class="text-yellow-300">frameCount</span>, <span class="text-yellow-300">setFrameCount</span>] = <span class="text-green-400">useState</span>(<span class="text-orange-400">0</span>);

  <span class="text-gray-400">// Memoized callbacks for performance</span>
  <span class="text-blue-400">const</span> <span class="text-yellow-300">handleMove</span> = <span class="text-green-400">useCallback</span>(() => {
    <span class="text-yellow-300">setFrameCount</span>(prev => prev + <span class="text-orange-400">1</span>);
  }, []);

  <span class="text-blue-400">const</span> <span class="text-yellow-300">cursorStyle</span> = <span class="text-green-400">useMemo</span>(() => ({
    <span class="text-blue-300">willChange</span>: <span class="text-yellow-300">'transform'</span>,
    <span class="text-blue-300">transition</span>: <span class="text-yellow-300">'transform 100ms ease-out'</span>,
  }), []);

  <span class="text-blue-400">const</span> <span class="text-yellow-300">particles</span> = <span class="text-green-400">useMemo</span>(() => 
    [...<span class="text-green-400">Array</span>(<span class="text-orange-400">6</span>)].<span class="text-green-400">map</span>((_, i) => ({
      <span class="text-blue-300">id</span>: i,
      <span class="text-blue-300">size</span>: <span class="text-orange-400">2</span> + (i % <span class="text-orange-400">3</span>),
      <span class="text-blue-300">radius</span>: <span class="text-orange-400">15</span> + (i * <span class="text-orange-400">5</span>),
    })), []
  );

  <span class="text-blue-400">return</span> (
    &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">ref</span>={<span class="text-yellow-300">containerRef</span>}&gt;
      &lt;<span class="text-red-400">CustomCursor</span> 
        <span class="text-blue-300">containerRef</span>={<span class="text-yellow-300">containerRef</span>}
        <span class="text-blue-300">onMove</span>={<span class="text-yellow-300">handleMove</span>}
      &gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">style</span>={<span class="text-yellow-300">cursorStyle</span>}&gt;
          {<span class="text-yellow-300">particles</span>.<span class="text-green-400">map</span>(particle => (
            &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">key</span>={<span class="text-yellow-300">particle.id</span>} <span class="text-blue-300">className</span>=<span class="text-yellow-300">"gpu-particle"</span> /&gt;
          ))}
        &lt;/<span class="text-purple-400">div</span>&gt;
      &lt;/<span class="text-red-400">CustomCursor</span>&gt;
    &lt;/<span class="text-purple-400">div</span>&gt;
  );
});`;

/**
 * Complete Performance Optimized Example - Self-Contained
 * This component includes its own CustomCursor implementation with performance optimizations
 */
function PerformanceOptimizedExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalFrames, setTotalFrames] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Optimized callback for move events
  const handleMoveOptimized = useCallback(() => {
    setTotalFrames(prev => prev + 1);
  }, []);

  const handleVisibilityChange = useCallback((visible: boolean) => {
    setIsActive(visible);
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        relative p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm
        bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-cyan-900/40
        border-blue-500/30 hover:border-blue-400/50
        hover:shadow-xl hover:shadow-blue-500/10
        transform hover:scale-[1.01] hover:-translate-y-1
      "
    >
      {/* THIS is the actual CustomCursor implementation */}
      <CustomCursor
        id="performance-optimized-cursor"
        containerRef={containerRef}
        smoothness={1}
        showDevIndicator={false}
        onMove={handleMoveOptimized}
        onVisibilityChange={handleVisibilityChange}
      >
        <PerformanceOptimizedCursor />
      </CustomCursor>

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Performance Optimized</h3>
          <p className="text-gray-300 text-sm">Efficient rendering with memoization, callbacks, and GPU acceleration</p>
        </div>

        {/* Code snippet showing the actual implementation */}
        <CodeSnippet
          code={codeString}
          filename="optimized-cursor.tsx"
          className="bg-blue-950/50"
        />

        {/* Performance metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-blue-950/30 rounded-lg p-3 border border-blue-800/30">
            <div className="text-blue-400 font-mono mb-1">Frame Rate</div>
            <div className="text-white font-bold">{Math.round(totalFrames / 10)} FPS</div>
          </div>
          
          <div className="bg-blue-950/30 rounded-lg p-3 border border-blue-800/30">
            <div className="text-blue-400 font-mono mb-1">Status</div>
            <div className={`font-bold ${isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Optimized with React.memo, useCallback & GPU acceleration
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
}

export { PerformanceOptimizedExample }; 