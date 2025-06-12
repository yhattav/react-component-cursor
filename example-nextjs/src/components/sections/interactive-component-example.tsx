'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CodeSnippet } from '../ui/code-snippet';

/**
 * Interactive Cursor Component with State Management
 * Demonstrates React state integration and event handling
 */
function InteractiveCursor() {
  const [clicks, setClicks] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    setIsActive(true);
    
    // Reset active state after animation
    setTimeout(() => setIsActive(false), 200);
  };

  return (
    <div 
      className={`w-10 h-10 border-2 rounded-full relative transition-all duration-150 cursor-pointer ${
        isActive 
          ? 'border-green-400 bg-green-400/20 shadow-lg shadow-green-400/50 scale-125' 
          : 'border-green-500 bg-green-500/10'
      }`}
      onClick={handleClick}
    >
      {/* Click counter */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-mono">
          {clicks} clicks
        </div>
      </div>
      
      {/* Inner elements */}
      <div className="absolute inset-2 flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isActive ? 'bg-green-300 scale-150' : 'bg-green-500 animate-pulse'
        }`} />
      </div>
      
      {/* Orbital rings */}
      <div className="absolute inset-0 rounded-full border border-green-400/30 animate-spin" 
           style={{ animationDuration: '3s' }} />
      <div className="absolute inset-1 rounded-full border border-green-300/20 animate-spin" 
           style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
      
      {/* Click ripple effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75" />
      )}
    </div>
  );
}

// Pre-highlighted code string showing the ACTUAL implementation
const codeString = `<span class="text-blue-400">import</span> { <span class="text-green-400">CustomCursor</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'@yhattav/react-component-cursor'</span>;
<span class="text-blue-400">import</span> { <span class="text-green-400">useState</span>, <span class="text-green-400">useEffect</span>, <span class="text-green-400">useRef</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'react'</span>;

<span class="text-blue-400">function</span> <span class="text-green-400">InteractiveCursor</span>() {
  <span class="text-blue-400">const</span> [<span class="text-yellow-300">clicks</span>, <span class="text-yellow-300">setClicks</span>] = <span class="text-green-400">useState</span>(<span class="text-orange-400">0</span>);
  <span class="text-blue-400">const</span> [<span class="text-yellow-300">isActive</span>, <span class="text-yellow-300">setIsActive</span>] = <span class="text-green-400">useState</span>(<span class="text-orange-400">false</span>);
  <span class="text-blue-400">const</span> <span class="text-yellow-300">containerRef</span> = <span class="text-green-400">useRef</span>(<span class="text-orange-400">null</span>);

  <span class="text-green-400">useEffect</span>(() => {
    <span class="text-blue-400">const</span> <span class="text-yellow-300">handleClick</span> = () => {
      <span class="text-yellow-300">setClicks</span>(prev => prev + <span class="text-orange-400">1</span>);
      <span class="text-yellow-300">setIsActive</span>(<span class="text-orange-400">true</span>);
      <span class="text-green-400">setTimeout</span>(() => <span class="text-yellow-300">setIsActive</span>(<span class="text-orange-400">false</span>), <span class="text-orange-400">200</span>);
    };
    
    <span class="text-yellow-300">containerRef.current</span>?.<span class="text-green-400">addEventListener</span>(<span class="text-yellow-300">'click'</span>, <span class="text-yellow-300">handleClick</span>);
    <span class="text-blue-400">return</span> () => <span class="text-yellow-300">containerRef.current</span>?.<span class="text-green-400">removeEventListener</span>(<span class="text-yellow-300">'click'</span>, <span class="text-yellow-300">handleClick</span>);
  }, []);

  <span class="text-blue-400">return</span> (
    &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">ref</span>={<span class="text-yellow-300">containerRef</span>}&gt;
      &lt;<span class="text-red-400">CustomCursor</span> <span class="text-blue-300">containerRef</span>={<span class="text-yellow-300">containerRef</span>}&gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>={<span class="text-yellow-300">isActive</span> ? <span class="text-yellow-300">'active'</span> : <span class="text-yellow-300">'idle'</span>}&gt;
          &lt;<span class="text-purple-400">div</span>&gt;{<span class="text-yellow-300">clicks</span>} clicks&lt;/<span class="text-purple-400">div</span>&gt;
          &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"orbital-rings"</span> /&gt;
        &lt;/<span class="text-purple-400">div</span>&gt;
      &lt;/<span class="text-red-400">CustomCursor</span>&gt;
    &lt;/<span class="text-purple-400">div</span>&gt;
  );
}`;

/**
 * Complete Interactive Component Example - Self-Contained
 * This component includes its own CustomCursor implementation with real state management
 */
function InteractiveComponentExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerClicks, setContainerClicks] = useState(0);

  useEffect(() => {
    const handleClick = () => {
      setContainerClicks(prev => prev + 1);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
      return () => container.removeEventListener('click', handleClick);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        relative p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm
        bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-teal-900/40
        border-green-500/30 hover:border-green-400/50
        hover:shadow-xl hover:shadow-green-500/10
        transform hover:scale-[1.01] hover:-translate-y-1
        cursor-pointer
      "
    >
      {/* THIS is the actual CustomCursor implementation */}
      <CustomCursor
        id="interactive-component-cursor"
        containerRef={containerRef}
        smoothness={1}
        showNativeCursor={false}
        showDevIndicator={false}
      >
        <InteractiveCursor />
      </CustomCursor>

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Interactive Component</h3>
          <p className="text-gray-300 text-sm">React component with state, animations, and click tracking. Try clicking!</p>
        </div>

        {/* Code snippet showing the actual implementation */}
        <CodeSnippet
          code={codeString}
          filename="interactive-cursor.tsx"
          className="bg-green-950/50"
        />

        {/* Additional interactive content */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-green-950/30 rounded-lg p-3 border border-green-800/30">
            <div className="text-green-400 font-mono mb-1">State Updates</div>
            <div className="text-white font-bold">Real-time</div>
          </div>
          
          <div className="bg-green-950/30 rounded-lg p-3 border border-green-800/30">
            <div className="text-green-400 font-mono mb-1">Container Clicks</div>
            <div className="text-white font-bold">{containerClicks}</div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Click to interact • Container clicks: {containerClicks}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
    </div>
  );
}

export { InteractiveComponentExample }; 