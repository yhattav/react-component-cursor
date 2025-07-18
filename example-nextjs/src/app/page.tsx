'use client';

import React from 'react';

// Section Components
import { HeroSection } from '../components/sections/hero-section';
import { PlaygroundSection } from '../components/sections/playground-section';
import { InteractiveExamplesSection } from '../components/sections/interactive-examples-section';
import { Footer } from '../components/sections/footer';

function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. PLAYGROUND SECTION */}
      <PlaygroundSection />

      {/* 3. EXAMPLES SECTION */}
      <InteractiveExamplesSection />

      {/* 4. FOOTER */}
      <Footer />
    </main>
  );
}

export default HomePage; 