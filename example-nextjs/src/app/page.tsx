'use client';

import React from 'react';

// Section Components
import { HeroSection } from '../components/sections/hero-section';
import { ProofSection } from '../components/sections/proof-section';
import { FeaturesShowcaseSection } from '../components/sections/features-showcase-section';
import { InteractiveExamplesSection } from '../components/sections/interactive-examples-section';
import { PlaygroundSection } from '../components/sections/playground-section';
import { QuickStartSection } from '../components/sections/quick-start-section';
import { Footer } from '../components/sections/footer';

function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* 1. HERO SECTION - The Hook (0-3 seconds) */}
      <HeroSection />

      {/* 2. PROOF SECTION - Why This Matters (3-10 seconds) */}
      <ProofSection />

      {/* 3. FEATURES SHOWCASE - What You Get (10-30 seconds) */}
      <FeaturesShowcaseSection />

      {/* 4. INTERACTIVE EXAMPLES - See It In Action (30-60 seconds) */}
      <InteractiveExamplesSection />

      {/* 5. PLAYGROUND - Experiment & Generate Code */}
      <PlaygroundSection />

      {/* 6. QUICK START - Get Started (60+ seconds) */}
      <QuickStartSection />

      {/* 7. FOOTER */}
      <Footer />
    </main>
  );
}

export default HomePage; 