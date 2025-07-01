'use client';

import React from 'react';
import { Playground } from '../../components/playground/playground';

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            CustomCursor Playground
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experiment with different cursor configurations and see the effects in real-time. 
            All controls are interactive and demonstrate the power of CustomCursor.
          </p>
        </div>
        
        <Playground 
          enabledProps={[
            'enabled',
            'smoothness', 
            'offset',
            'centered',
            'throttleMs',
            'zIndex',
            'showDevIndicator'
          ]}
        />
      </div>
    </main>
  );
}