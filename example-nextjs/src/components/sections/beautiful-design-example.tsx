'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CodeSnippet } from '../ui/code-snippet';

/**
 * Beautiful Design Cursor Component
 * Demonstrates advanced visual effects with organic cloud backdrop
 */
function BeautifulDesignCursor() {
  // Pre-generate stable random values to prevent jumpy animations
  const particles = React.useMemo(() => 
    [...Array(12)].map((_, i) => ({
      id: i,
      size: 20 + (Math.sin(i * 2.3) * 0.5 + 0.5) * 40,
      baseX: Math.sin(i * 1.7) * 60,
      baseY: Math.cos(i * 1.3) * 60,
      moveRangeX: 15 + (Math.sin(i * 3.1) * 0.5 + 0.5) * 20,
      moveRangeY: 15 + (Math.cos(i * 2.7) * 0.5 + 0.5) * 20,
      hue: 147 + (Math.sin(i * 1.9) * 0.5 + 0.5) * 89,
      saturation: 51 + (Math.cos(i * 2.1) * 0.5 + 0.5) * 134,
      lightness: 234 + (Math.sin(i * 1.1) * 0.5 + 0.5) * 21,
      opacity: 0.4 + (Math.cos(i * 1.5) * 0.5 + 0.5) * 0.15,
      blur: 8 + (Math.sin(i * 2.9) * 0.5 + 0.5) * 16,
      duration: 8 + (Math.cos(i * 1.8) * 0.5 + 0.5) * 6,
      delay: (Math.sin(i * 0.7) * 0.5 + 0.5) * 4,
    })), []
  );

  const smallParticles = React.useMemo(() => 
    [...Array(8)].map((_, i) => ({
      id: i,
      size: 8 + (Math.sin(i * 3.2) * 0.5 + 0.5) * 15,
      baseX: Math.sin(i * 2.4) * 40,
      baseY: Math.cos(i * 1.8) * 40,
      moveRangeX: 8 + (Math.sin(i * 2.6) * 0.5 + 0.5) * 12,
      moveRangeY: 8 + (Math.cos(i * 3.4) * 0.5 + 0.5) * 12,
      hue: 236 + (Math.sin(i * 2.2) * 0.5 + 0.5) * 19,
      saturation: 72 + (Math.cos(i * 1.6) * 0.5 + 0.5) * 103,
      lightness: 153 + (Math.sin(i * 2.8) * 0.5 + 0.5) * 102,
      opacity: 0.4 + (Math.cos(i * 2.0) * 0.5 + 0.5) * 0.1,
      blur: 4 + (Math.sin(i * 1.4) * 0.5 + 0.5) * 8,
      duration: 6 + (Math.cos(i * 2.5) * 0.5 + 0.5) * 4,
      delay: (Math.sin(i * 1.2) * 0.5 + 0.5) * 3,
    })), []
  );

  return (
    <div className="relative">
      {/* Particle-based organic cloud effect */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.baseX}px`,
            top: `${particle.baseY}px`,
            background: `rgba(${Math.round(particle.hue)}, ${Math.round(particle.saturation)}, ${Math.round(particle.lightness)}, ${particle.opacity})`,
            filter: `blur(${particle.blur}px)`,
          }}
          animate={{
            x: [
              -particle.moveRangeX, 
              particle.moveRangeX * 0.7, 
              -particle.moveRangeX * 0.3, 
              particle.moveRangeX, 
              -particle.moveRangeX
            ],
            y: [
              -particle.moveRangeY, 
              particle.moveRangeY * 0.5, 
              particle.moveRangeY, 
              -particle.moveRangeY * 0.8, 
              -particle.moveRangeY
            ],
            scale: [1, 1.2, 0.8, 1.1, 1],
            opacity: [particle.opacity, particle.opacity * 1.8, particle.opacity * 0.6, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Additional smaller particles for depth */}
      {smallParticles.map((particle) => (
        <motion.div
          key={`small-${particle.id}`}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.baseX}px`,
            top: `${particle.baseY}px`,
            background: `rgba(${Math.round(particle.hue)}, ${Math.round(particle.saturation)}, ${Math.round(particle.lightness)}, ${particle.opacity})`,
            filter: `blur(${particle.blur}px)`,
          }}
          animate={{
            x: [
              -particle.moveRangeX, 
              particle.moveRangeX * 0.6, 
              particle.moveRangeX, 
              -particle.moveRangeX * 0.4, 
              -particle.moveRangeX
            ],
            y: [
              particle.moveRangeY, 
              -particle.moveRangeY * 0.7, 
              -particle.moveRangeY, 
              particle.moveRangeY * 0.3, 
              particle.moveRangeY
            ],
            scale: [0.8, 1.3, 1.0, 0.9, 0.8],
            opacity: [particle.opacity, particle.opacity * 1.6, particle.opacity * 0.8, particle.opacity * 1.2, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Main cursor */}
      <div >
        {/* Inner highlight
        <div className="absolute top-1 left-1 w-2 h-2 bg-white/50 rounded-full backdrop-blur-sm" />
         */}
        {/* Center dot */}
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full animate-pulse" /> */}
        
        {/* Trailing particles */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full shadow-sm"
              style={{
                left: `${24 + i * 6}px`,
                top: `${14 + Math.sin(i) * 4}px`,
                opacity: 0.8 - i * 0.2,
                animationDelay: `${i * 150}ms`,
                animation: 'pulse 2s infinite',
              }}
            />
          ))}
        </div>
        
        {/* Rotating ring effect */}
        <div 
          className="absolute -inset-1 rounded-full border border-gradient-to-r from-purple-300/30 via-pink-300/30 to-red-300/30 animate-spin"
          style={{ animationDuration: '4s' }} 
        />
      </div>
      
      {/* Subtle outer particles */}
      <div className="absolute -inset-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={`outer-${i}`}
            className="absolute w-0.5 h-0.5 bg-purple-300/60 rounded-full animate-ping"
            style={{
              left: `${Math.cos(i * 2.1) * 20 + 20}px`,
              top: `${Math.sin(i * 2.1) * 20 + 20}px`,
              animationDelay: `${i * 800}ms`,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Pre-highlighted code string showing the ACTUAL implementation
const codeString = `<span class="text-blue-400">import</span> { <span class="text-green-400">CustomCursor</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'@yhattav/react-component-cursor'</span>;
<span class="text-blue-400">import</span> { <span class="text-green-400">motion</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'framer-motion'</span>;

<span class="text-blue-400">function</span> <span class="text-green-400">BeautifulCursor</span>() {
  <span class="text-blue-400">const</span> <span class="text-yellow-300">containerRef</span> = <span class="text-green-400">useRef</span>(<span class="text-orange-400">null</span>);

  <span class="text-blue-400">return</span> (
    &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">ref</span>={<span class="text-yellow-300">containerRef</span>}&gt;
      &lt;<span class="text-red-400">CustomCursor</span> 
        <span class="text-blue-300">containerRef</span>={<span class="text-yellow-300">containerRef</span>}
        <span class="text-blue-300">showNativeCursor</span>={<span class="text-orange-400">false</span>}
      &gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"relative"</span>&gt;
          &lt;<span class="text-red-400">motion.div</span> 
            <span class="text-blue-300">animate</span>={{
              <span class="text-blue-300">scale</span>: [<span class="text-orange-400">1</span>, <span class="text-orange-400">1.1</span>, <span class="text-orange-400">0.95</span>, <span class="text-orange-400">1</span>],
              <span class="text-blue-300">rotate</span>: [<span class="text-orange-400">0</span>, <span class="text-orange-400">5</span>, <span class="text-orange-400">-3</span>, <span class="text-orange-400">0</span>],
            }}
            <span class="text-blue-300">style</span>={{
              <span class="text-blue-300">background</span>: <span class="text-yellow-300">'radial-gradient(...)'</span>,
              <span class="text-blue-300">filter</span>: <span class="text-yellow-300">'blur(18px) brightness(0.5)'</span>,
              <span class="text-blue-300">borderRadius</span>: <span class="text-yellow-300">'60% 40% 70% 30%'</span>,
            }}
          /&gt;
          &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"gradient-cursor"</span>&gt;
            {<span class="text-gray-400">/* Beautiful design elements */</span>}
          &lt;/<span class="text-purple-400">div</span>&gt;
        &lt;/<span class="text-purple-400">div</span>&gt;
      &lt;/<span class="text-red-400">CustomCursor</span>&gt;
    &lt;/<span class="text-purple-400">div</span>&gt;
  );
}`;

/**
 * Complete Beautiful Design Example - Self-Contained
 * This component includes its own CustomCursor implementation
 */
function BeautifulDesignExample() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="
        relative p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm
        bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-red-900/40
        border-purple-500/30 hover:border-purple-400/50
        hover:shadow-xl hover:shadow-purple-500/10
        transform hover:scale-[1.01] hover:-translate-y-1
      "
    >
      {/* THIS is the actual CustomCursor implementation */}
      <CustomCursor
        id="beautiful-design-cursor"
        containerRef={containerRef}
        smoothness={10}
        showNativeCursor={false}
        showDevIndicator={false}
      >
        <BeautifulDesignCursor />
      </CustomCursor>

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Beautiful Design</h3>
          <p className="text-gray-300 text-sm">Stunning gradient cursor with organic cloud backdrop and smooth animations</p>
        </div>

        {/* Code snippet showing the actual implementation */}
        <CodeSnippet
          code={codeString}
          filename="beautiful-cursor.tsx"
          className="bg-purple-950/50"
        />

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Hover to see the organic cloud effect
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
}

export { BeautifulDesignExample }; 