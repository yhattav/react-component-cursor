'use client';

import React, { useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CodeSnippet } from '../ui/code-snippet';
import { OrganicCloudCursor } from '../cursor-designs';



// Pre-highlighted code string showing the ACTUAL implementation
const codeString = `<span class="text-blue-400">import</span> { <span class="text-green-400">CustomCursor</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'@yhattav/react-component-cursor'</span>;
<span class="text-blue-400">import</span> { <span class="text-green-400">motion</span> } <span class="text-blue-400">from</span> <span class="text-yellow-300">'framer-motion'</span>;

<span class="text-blue-400">function</span> <span class="text-green-400">BeautifulCursor</span>() {
  <span class="text-blue-400">const</span> <span class="text-yellow-300">containerRef</span> = <span class="text-green-400">useRef</span>(<span class="text-orange-400">null</span>);

  <span class="text-blue-400">return</span> (
    &lt;<span class="text-purple-400">div</span> <span class="text-blue-300">ref</span>={<span class="text-yellow-300">containerRef</span>}&gt;
      &lt;<span class="text-red-400">CustomCursor</span> 
        <span class="text-blue-300">containerRef</span>={<span class="text-yellow-300">containerRef</span>}
        
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
        smoothness={30}
        showDevIndicator={false}
      >
        <OrganicCloudCursor />
      </CustomCursor>
      <CustomCursor
        id="beautiful-design-cursor2"
        containerRef={containerRef}
        smoothness={40}
        showDevIndicator={false}
      >
        <OrganicCloudCursor />
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