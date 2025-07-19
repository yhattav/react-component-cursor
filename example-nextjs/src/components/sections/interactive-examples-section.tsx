'use client';

import React, { useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { OrganicCloudCursor } from '../cursor-designs/organic-cloud-cursor';
import { WarpCursor } from '../cursor-designs/warp-cursor';
import { AnimatedGrid } from '../ui';
import { GrCursor } from "react-icons/gr";

// Simple card component - pure layout, no cursor knowledge
interface ExampleCardProps {
  title?: string;
  children?: React.ReactNode;
}

function ExampleCard({ title, children }: ExampleCardProps) {
  return (
    <div className="relative group flex items-center justify-center min-h-[350px] md:min-h-[400px] bg-gray-800/40 transition-colors duration-300 overflow-hidden">
      {children}

      {/* Title overlay */}
      {title ? (
        <span className="absolute bottom-3 left-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
          {title}
        </span>
      ) : null}
    </div>
  );
}

// Counter cursor that displays the click count
function CounterCursor({ count, isAnimating }: { count: number; isAnimating: boolean }) {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-md opacity-60" />
      
      {/* Main counter badge */}
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-xl backdrop-blur-sm border border-white/20">
        <div className={`font-bold text-xl tabular-nums transition-all duration-200 ${
          isAnimating ? 'scale-125 text-yellow-200' : 'scale-100'
        }`}>
          {count}
        </div>
        
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-full pointer-events-none" />
      </div>
    </div>
  );
}

// Example 1: Organic Cloud Cursor
function OrganicCloudExample() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <CustomCursor containerRef={containerRef} smoothness={20} className="z-50">
        <OrganicCloudCursor amount={4}/>
      </CustomCursor>
      <CustomCursor containerRef={containerRef} smoothness={17} className="z-50">
        <OrganicCloudCursor amount={2}/>
      </CustomCursor>
      <CustomCursor containerRef={containerRef} smoothness={15} className="z-50">
        <OrganicCloudCursor amount={3}/>
      </CustomCursor>
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        {/* Content area */}
      </div>
    </>
  );
}

// Example 2: Click Counter
function ClickCounterExample() {
  const [count, setCount] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const incrementCounter = React.useCallback(() => {
    setCount(prevCount => prevCount + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  }, []);

  return (
    <>
      <CustomCursor 
        containerRef={containerRef} 
        className="z-50"
        offset={{ x: 20, y: -20 }}
      >
        <CounterCursor count={count} isAnimating={isAnimating} />
      </CustomCursor>
      <div 
        ref={containerRef} 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={incrementCounter}
      >
        {/* Clickable content area */}
      </div>
    </>
  );
}

// Example 3: Icon Cursor Replacement
function IconCursorExample() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <WarpCursor
        amount={10}
        start={1}
        offset={1}
        containerRef={containerRef}
        cursorOffset={{ x: 5, y: 5 }}
      >
        <div className="flex items-center justify-center w-6 h-6 text-white">
          <GrCursor size={20} className="drop-shadow-lg opacity-30" />
        </div>
      </WarpCursor>
      <div 
        ref={containerRef} 
        className="relative w-full h-full flex items-center justify-center"
        style={{ cursor: 'none' }}
      >

      </div>
    </>
  );
}

// Simplified section using AnimatedGrid
function InteractiveExamplesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="examples-section"
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 group"
    >
      {/* Subtle top border that becomes visible on hover */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
          Interactive Examples
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
          Explore real-time cursor designs. More examples coming soon.
        </p>
      </div>

      {/* AnimatedGrid with border reveal effect */}
      <AnimatedGrid 
        cols={{ base: 1, sm: 2, lg: 3 }}
        borderColor="rgba(168, 85, 247, 0.9)"
        borderThickness={1}
        gap={16}
        glowRadius={300}
        smoothness={20}
        className="px-4 sm:px-6"
      >
        {/* Example 1 – Organic Cloud Cursor */}
        <ExampleCard title="Organic Cloud Cursor">
          <OrganicCloudExample />
        </ExampleCard>

        {/* Example 2 – Click Counter */}
        <ExampleCard title="Click Counter">
          <ClickCounterExample />
        </ExampleCard>

        {/* Example 3 – Icon Cursor */}
        <ExampleCard title="Warp Cursor">
          <IconCursorExample />
        </ExampleCard>
      </AnimatedGrid>
    </section>
  );
}

export { InteractiveExamplesSection }; 