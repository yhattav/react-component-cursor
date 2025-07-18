'use client';

import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { OrganicCloudCursor } from '../cursor-designs/organic-cloud-cursor';

// Simple card component to ensure consistent styling
interface ExampleCardProps {
  cursor?: React.ReactElement;
  title?: string;
}

function ExampleCard({ cursor, title }: ExampleCardProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative group flex items-center justify-center min-h-[350px] md:min-h-[400px] rounded-2xl bg-gray-800/40 border border-transparent transition-colors duration-300 overflow-hidden"
    >
      {/* Cursor for interactive cards */}
      {cursor ? (
        <CustomCursor containerRef={containerRef} className="z-50">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {cursor as any}
        </CustomCursor>
      ) : null}

      {/* Title overlay */}
      {title ? (
        <span className="absolute bottom-3 left-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
          {title}
        </span>
      ) : null}
    </div>
  );
}

// New grid-based Examples Section
function InteractiveExamplesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridWrapperRef = useRef<HTMLDivElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    const rect = gridWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: position.x - rect.left, y: position.y - rect.top });
  }, []);

  return (
    <section
      id="examples-section"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 group"
      style={{
        // Pass CSS variables for overlay
        '--cursor-x': `${cursorPos.x}px`,
        '--cursor-y': `${cursorPos.y}px`,
      } as React.CSSProperties}
    >
      {/* Overlay that reveals borders under a purple spotlight
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle 20px at var(--cursor-x) var(--cursor-y), rgba(168,85,247,0.5) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          transition: 'background-position 0.05s linear',
        }}
      /> */}

      {/* Subtle top border that becomes visible on hover */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Overlay moved into grid wrapper below — duplicate removed */}

      {/* Section Header */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Interactive Examples
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Explore real-time cursor designs. More examples coming soon.
        </p>
      </div>

      {/* Grid + overlay wrapper */}
      <div ref={gridWrapperRef} className="relative px-6">
        {/* Overlay grid that reveals borders */}
        <div
          className="pointer-events-none absolute inset-0 z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0"
          style={{
            color: 'rgba(168, 85, 247, 0.9)', // ultraviolet purple glow
            maskImage:
              'radial-gradient(circle 300px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)',
            WebkitMaskImage:
              'radial-gradient(circle 300px at var(--cursor-x) var(--cursor-y), #000 0%, transparent 65%)',
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-current" />
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {/* Example 1 – Organic Cloud Cursor */}
          <ExampleCard title="Organic Cloud Cursor" cursor={<OrganicCloudCursor />} />

          {/* Example 2 – Placeholder */}
          <ExampleCard title="Coming Soon" />

          {/* Example 3 – Placeholder */}
          <ExampleCard title="Coming Soon" />
        </div>
      </div>
      {/* CustomCursor to drive spotlight */}
      <CustomCursor containerRef={gridWrapperRef} smoothness={2} onMove={handleCursorMove} />
    </section>
  );
}

export { InteractiveExamplesSection }; 