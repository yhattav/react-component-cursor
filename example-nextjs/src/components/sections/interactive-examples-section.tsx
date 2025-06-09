'use client';

import React, { useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

interface CodeExampleProps {
  title: string;
  description: string;
  code: string;
  theme: 'purple' | 'green' | 'blue';
  cursorComponent: JSX.Element;
}

function CodeExample({ title, description, code, theme, cursorComponent }: CodeExampleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const themeClasses = {
    purple: {
      bg: 'bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-red-900/40',
      border: 'border-purple-500/30 hover:border-purple-400/50',
      glow: 'hover:shadow-xl hover:shadow-purple-500/10',
      code: 'bg-purple-950/50'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-teal-900/40',
      border: 'border-green-500/30 hover:border-green-400/50',
      glow: 'hover:shadow-xl hover:shadow-green-500/10',
      code: 'bg-green-950/50'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-purple-900/40',
      border: 'border-blue-500/30 hover:border-blue-400/50',
      glow: 'hover:shadow-xl hover:shadow-blue-500/10',
      code: 'bg-blue-950/50'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      ref={containerRef}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm
        ${currentTheme.bg} ${currentTheme.border} ${currentTheme.glow}
        transform hover:scale-[1.01] hover:-translate-y-1
      `}
    >
      {/* The library handles everything - just pass the containerRef! */}
      <CustomCursor
        id={`example-cursor-${theme}`}
        containerRef={containerRef}
        smoothness={1}
        showNativeCursor={false}
        showDevIndicator={false}
      >
        {cursorComponent}
      </CustomCursor>

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>

        {/* Code block */}
        <div className={`rounded-lg p-4 ${currentTheme.code} border border-white/10`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-gray-400 text-xs font-mono">cursor-example.tsx</div>
          </div>
          
          <pre className="text-sm font-mono text-gray-200 leading-relaxed overflow-x-auto">
            <code dangerouslySetInnerHTML={{ __html: code }} />
          </pre>
        </div>

        {/* Simple status indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          Hover to see the library in action
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none"></div>
    </div>
  );
}

function InteractiveExamplesSection() {
  const examples: CodeExampleProps[] = [
    {
      title: 'Beautiful Design',
      description: 'Stunning gradient cursor with glow effects and smooth animations',
      theme: 'purple',
      cursorComponent: (
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
      ),
      code: `<span class="text-blue-400">import</span> { <span class="text-green-400">CustomCursor</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'@yhattav/react-component-cursor'</span>;

<span class="text-blue-400">function</span> <span class="text-green-400">App</span>() {
  <span class="text-blue-400">return</span> (
    &lt;<span class="text-red-400">CustomCursor</span>&gt;
      &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"gradient-cursor"</span>&gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"glow-effect"</span> /&gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"cursor-core"</span> /&gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"particles"</span> /&gt;
      &lt;/<span class="text-purple-400">div</span>&gt;
    &lt;/<span class="text-red-400">CustomCursor</span>&gt;
  );
}`
    },
    {
      title: 'Interactive Component',
      description: 'Complex React component with state, animations, and visual feedback',
      theme: 'green',
      cursorComponent: (
        <div className="w-10 h-10 border-2 border-green-500 bg-green-500/10 rounded-full relative">
          {/* Click indicator */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              Interactive
            </div>
          </div>
          
          {/* Inner elements */}
          <div className="absolute inset-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          {/* Orbital rings */}
          <div className="absolute inset-0 rounded-full border border-green-400/30 animate-spin" 
               style={{ animationDuration: '3s' }} />
          <div className="absolute inset-1 rounded-full border border-green-300/20 animate-spin" 
               style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        </div>
      ),
      code: `<span class="text-blue-400">import</span> { <span class="text-green-400">CustomCursor</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'@yhattav/react-component-cursor'</span>;
<span class="text-blue-400">import</span> { <span class="text-green-400">useState</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'react'</span>;

<span class="text-blue-400">function</span> <span class="text-green-400">InteractiveCursor</span>() {
  <span class="text-blue-400">const</span> [<span class="text-yellow-300">clicks</span>, <span class="text-yellow-300">setClicks</span>] = <span class="text-green-400">useState</span>(<span class="text-orange-400">0</span>);

  <span class="text-blue-400">return</span> (
    &lt;<span class="text-red-400">CustomCursor</span>&gt;
      &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"interactive-cursor"</span>&gt;
        &lt;<span class="text-purple-400">div</span>&gt;Clicks: {<span class="text-yellow-300">clicks</span>}&lt;/<span class="text-purple-400">div</span>&gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"orbital-rings"</span> /&gt;
      &lt;/<span class="text-purple-400">div</span>&gt;
    &lt;/<span class="text-red-400">CustomCursor</span>&gt;
  );
}`
    },
    {
      title: 'Container Scoped',
      description: 'Cursor that only works within specific containers - perfect for focused interactions',
      theme: 'blue',
      cursorComponent: (
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 rounded-xl p-3 shadow-2xl backdrop-blur-sm border border-white/20 min-w-[100px]">
          {/* Header */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            </div>
            <div className="text-white/70 text-xs font-mono">scope.tsx</div>
          </div>
          
          {/* Content */}
          <div className="space-y-1">
            <div className="text-xs font-mono text-cyan-200">
              containerRef
            </div>
            <div className="text-xs font-mono text-white/80">
              ✓ Active
            </div>
          </div>
          
          {/* Floating particle */}
          <div className="absolute -top-1 -right-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      ),
      code: `<span class="text-blue-400">import</span> { <span class="text-green-400">CustomCursor</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'@yhattav/react-component-cursor'</span>;
<span class="text-blue-400">import</span> { <span class="text-green-400">useRef</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'react'</span>;

<span class="text-blue-400">function</span> <span class="text-green-400">ScopedCursor</span>() {
  <span class="text-blue-400">const</span> <span class="text-yellow-300">containerRef</span> = <span class="text-green-400">useRef</span>(<span class="text-orange-400">null</span>);

  <span class="text-blue-400">return</span> (
    &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">ref</span>={<span class="text-yellow-300">containerRef</span>}&gt;
      &lt;<span class="text-red-400">CustomCursor</span> <span class="text-blue-300">containerRef</span>={<span class="text-yellow-300">containerRef</span>}&gt;
        &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">className</span>=<span class="text-yellow-300">"floating-ui"</span>&gt;
          Only in this container!
        &lt;/<span class="text-purple-400">div</span>&gt;
      &lt;/<span class="text-red-400">CustomCursor</span>&gt;
    &lt;/<span class="text-purple-400">div</span>&gt;
  );
}`
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hover over each example to experience the <strong>@yhattav/react-component-cursor</strong> library in real-time. 
            The code you see is actually powering the interactive demo.
          </p>
        </div>

        {/* Examples grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <CodeExample key={index} {...example} />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">
            Ready to add these to your app?
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}

export { InteractiveExamplesSection }; 