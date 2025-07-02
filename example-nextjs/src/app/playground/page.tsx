'use client';

import React from 'react';
import { Playground } from '../../components/playground/playground';

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16">
        
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