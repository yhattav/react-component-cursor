'use client';

import React, { useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { OrganicCloudCursor } from '../cursor-designs/organic-cloud-cursor';
import { AnimatedGrid } from '../ui';

// Simple card component without border effects (back to original)
interface ExampleCardProps {
  cursor?: React.ReactElement;
  title?: string;
}

function ExampleCard({ cursor, title }: ExampleCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null!);

  return (
    <div className="relative group flex items-center justify-center min-h-[350px] md:min-h-[400px] bg-gray-800/40 transition-colors duration-300 overflow-hidden">
      {/* Cursor for interactive cards */}
      {cursor ? (
        <CustomCursor containerRef={containerRef} className="z-50">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {cursor as any}
        </CustomCursor>
      ) : null}

      {/* Content container */}
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        {/* Card content goes here */}
      </div>

      {/* Title overlay */}
      {title ? (
        <span className="absolute bottom-3 left-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
          {title}
        </span>
      ) : null}
    </div>
  );
}

// Simplified section using AnimatedGrid
function InteractiveExamplesSection() {
  const sectionRef = useRef<HTMLElement>(null!);

  return (
    <section
      id="examples-section"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 group"
    >
      {/* Subtle top border that becomes visible on hover */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Section Header */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Interactive Examples
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Explore real-time cursor designs. More examples coming soon.
        </p>
      </div>

      {/* AnimatedGrid with border reveal effect */}
      <AnimatedGrid 
        cols={{ base: 1, sm: 2, lg: 3 }}
        borderColor="rgba(168, 85, 247, 0.9)"
        borderThickness={2}
        gap={4}
        glowRadius={300}
        smoothness={20}
        className="px-6 bg-red-500/10"
      >
        {/* Example 1 – Organic Cloud Cursor */}
        <ExampleCard title="Organic Cloud Cursor" cursor={<OrganicCloudCursor />} />

        {/* Example 2 – Placeholder */}
        <ExampleCard title="Coming Soon" />

        {/* Example 3 – Placeholder */}
        <ExampleCard title="Coming Soon" />
      </AnimatedGrid>
    </section>
  );
}

export { InteractiveExamplesSection }; 