'use client';

import React from 'react';
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
      className="relative group flex items-center justify-center min-h-[350px] md:min-h-[400px] rounded-2xl bg-gray-800/40 border border-transparent hover:border-blue-500/50 transition-colors duration-300 overflow-hidden"
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
  return (
    <section
      id="examples-section"
      className="relative py-24 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 group"
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

      {/* Examples Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 px-6">
          {/* Example 1 – Organic Cloud Cursor */}
          <ExampleCard title="Organic Cloud Cursor" cursor={<OrganicCloudCursor />} />

          {/* Example 2 – Placeholder */}
          <ExampleCard title="Coming Soon" />

          {/* Example 3 – Placeholder */}
          <ExampleCard title="Coming Soon" />
      </div>
    </section>
  );
}

export { InteractiveExamplesSection }; 