'use client';

import React from 'react';
import { BeautifulDesignExample } from './beautiful-design-example';
import { InteractiveComponentExample } from './interactive-component-example';
import { PerformanceOptimizedExample } from './performance-optimized-example';

function InteractiveExamplesSection() {
  return (
    <section id="interactive-examples-section" className="relative py-24 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Interactive Code Examples
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See the actual library in action. The code you see is exactly what&apos;s running in each container.
          </p>
        </div>

        {/* Three Example Containers */}
        <div className="grid lg:grid-cols-3 gap-8">
          <BeautifulDesignExample />
          <InteractiveComponentExample />
          <PerformanceOptimizedExample />
        </div>
      </div>
    </section>
  );
}

export { InteractiveExamplesSection }; 