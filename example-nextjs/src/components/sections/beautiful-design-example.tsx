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
  return (
    <div className="relative">
      {/* Organic cloud backdrop with negative color effect */}
      <motion.div 
        className="absolute -inset-12 opacity-80"
        animate={{
          scale: [1, 1.1, 0.95, 1],
          rotate: [0, 5, -3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(ellipse 70% 100% at 30% 40%, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 80%)',
          filter: 'blur(18px) brightness(0.5) contrast(1.6) backdrop-blur(8px)',
          borderRadius: '60% 40% 70% 30%',
        }}
      />
      
      {/* Secondary organic shape */}
      <motion.div 
        className="absolute -inset-10 opacity-70"
        animate={{
          scale: [0.8, 1.2, 0.9, 0.8],
          rotate: [0, -8, 12, 0],
          x: [0, 3, -2, 0],
          y: [0, -2, 4, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          background: 'radial-gradient(ellipse 80% 120% at 60% 30%, rgba(236, 72, 153, 0.4) 0%, rgba(147, 51, 234, 0.15) 40%, transparent 70%)',
          filter: 'blur(15px) invert(0.15) hue-rotate(15deg) saturate(1.3)',
          borderRadius: '40% 60% 30% 70%',
        }}
      />
      
      {/* Third flowing shape */}
      <motion.div 
        className="absolute -inset-8 opacity-60"
        animate={{
          scale: [1.1, 0.7, 1.3, 1.1],
          rotate: [0, 15, -10, 0],
          x: [0, -4, 3, 0],
          y: [0, 2, -3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 70% 60%, rgba(147, 51, 234, 0.45) 0%, rgba(168, 85, 247, 0.2) 30%, transparent 60%)',
          filter: 'blur(20px) brightness(0.6) saturate(1.8) contrast(1.4)',
          borderRadius: '50% 30% 80% 20%',
        }}
      />
      
      {/* Enhanced outer glow */}
      <div 
        className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/25 to-red-500/30" 
        style={{ filter: 'blur(8px)' }} 
      />
      
      {/* Main cursor */}
      <div className="relative w-8 h-8 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full shadow-2xl border border-white/20">
        {/* Inner highlight */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-white/50 rounded-full backdrop-blur-sm" />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
        
        {/* Trailing particles */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full shadow-sm"
              style={{
                left: `${24 + i * 6}px`,
                top: `${14 + Math.sin(i) * 4}px`,
                opacity: 0.6 - i * 0.1,
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
        smoothness={1}
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