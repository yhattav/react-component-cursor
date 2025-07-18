'use client';

import React from 'react';
import { Playground } from '../playground/playground';

export const PlaygroundSection: React.FC = () => {
  return (
    <section id="playground-section" className="relative py-24 px-8 bg-gradient-to-br from-gray-900 to-black" aria-labelledby="playground-heading">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="playground-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
            Interactive Playground
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experiment with cursor properties in real-time and generate ready-to-use code for your project.
          </p>
        </div>
        
        <Playground />
      </div>
    </section>
  );
};