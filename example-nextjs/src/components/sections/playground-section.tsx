'use client';

import React from 'react';
import { Playground } from '../playground/playground';

export const PlaygroundSection: React.FC = () => {
  return (
    <section id="playground-section" className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-gray-900 to-black" aria-labelledby="playground-heading">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 id="playground-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Interactive Playground
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Experiment with cursor properties in real-time and generate ready-to-use code for your project.
          </p>
        </div>
        
        <Playground />
      </div>
    </section>
  );
};