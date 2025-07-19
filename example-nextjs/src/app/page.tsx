'use client';

import React from 'react';

// Section Components
import { HeroSection } from '../components/sections/hero-section';
import { QuickStartSection } from '../components/sections/quick-start-section';
import { PlaygroundSection } from '../components/sections/playground-section';
import { InteractiveExamplesSection } from '../components/sections/interactive-examples-section';
import { Footer } from '../components/sections/footer';
import { Header } from '../components/ui';

function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* HEADER */}
      <Header />
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. QUICK START SECTION */}
      <QuickStartSection />

      {/* 3. PLAYGROUND SECTION */}
      <PlaygroundSection />

      {/* 4. EXAMPLES SECTION */}
      <InteractiveExamplesSection />

      {/* 5. FOOTER */}
      <Footer />
    </main>
  );
}

export default HomePage; 