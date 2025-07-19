import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { AnimatedParticles } from '../ui/animated-particles';
import { ScrollIndicator } from '../ui/scroll-indicator';
import { StatsBadges } from '../ui/stats-badges';
import { MagneticButton } from '../ui/magnetic-button';
import { ANIMATION_DURATIONS } from '../../lib/constants';

// Cursor variants for the hero section
const heroCursorVariants = [
  {
    id: 'glow',
    element: <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-70" />,
    name: 'Glow Effect'
  },
  {
    id: 'particle',
    element: <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />,
    name: 'Particle'
  },
  {
    id: 'emoji',
    element: <div className="text-3xl">✨</div>,
    name: 'Emoji'
  },
  {
    id: 'ring',
    element: <div className="w-6 h-6 border-2 border-purple-400 rounded-full bg-purple-400/20" />,
    name: 'Ring'
  }
];

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const statsBadges = ['TypeScript', 'Zero Dependencies', '<10KB', 'Enterprise Ready'];

  // Handle cursor movement to trigger state changes
  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    // Change cursor variant based on position in hero area
    const section = document.querySelector('.hero-section');
    if (section) {
      const rect = section.getBoundingClientRect();
      const relativeX = (position.x - rect.left) / rect.width;
      const relativeY = (position.y - rect.top) / rect.height;
      
      // Divide hero area into quadrants to determine cursor variant
      let newIndex = 0;
      if (relativeX < 0.5 && relativeY < 0.5) newIndex = 0; // Top-left: glow
      else if (relativeX >= 0.5 && relativeY < 0.5) newIndex = 1; // Top-right: particle
      else if (relativeX < 0.5 && relativeY >= 0.5) newIndex = 2; // Bottom-left: emoji
      else newIndex = 3; // Bottom-right: ring
      
      if (newIndex !== currentCursorIndex) {
        setCurrentCursorIndex(newIndex);
      }
    }
  }, [currentCursorIndex]);

  const handleCursorVisibilityChange = useCallback((isVisible: boolean) => {
    setIsHovering(isVisible);
  }, []);

  const currentCursor = heroCursorVariants[currentCursorIndex];

  return (
    <div ref={containerRef} className="relative">
      <CustomCursor 
        containerRef={containerRef}
        smoothness={2} 
        className="z-50"
        onMove={handleCursorMove}
        onVisibilityChange={handleCursorVisibilityChange}
      >
        <motion.div
          key={currentCursor.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          {currentCursor.element}
        </motion.div>
      </CustomCursor>

      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <AnimatedParticles count={20} />

        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: ANIMATION_DURATIONS.hero / 1000 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Professional Cursor Enhancement
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                for React Applications
              </span>
            </h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Production-ready • SSR Compatible • Performance Optimized • Design-First
            </motion.p>

            <StatsBadges badges={statsBadges} delay={0.8} />

            {/* Primary CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <MagneticButton 
                onClick={() => {
                  // Navigate to the Playground section
                  const playgroundSection = document.getElementById('playground-section');
                  if (playgroundSection) {
                    playgroundSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                data-testid="explore-playground-magnetic"
              >
                Explore Playground
              </MagneticButton>
              <MagneticButton 
                variant="outline"
                onClick={() => {
                  // Navigate to the Examples section
                  const examplesSection = document.getElementById('examples-section');
                  if (examplesSection) {
                    examplesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                data-testid="view-examples-magnetic"
              >
                View Examples ↓
              </MagneticButton>
            </motion.div>

            {/* Cursor State Indicator */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg px-4 py-2 inline-block border border-gray-600/30">
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${isHovering ? 'bg-green-400' : 'bg-gray-400'} transition-colors`} />
                  <span className="text-gray-300">
                    Current: <span className="text-white font-semibold">{currentCursor.name}</span>
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">Move around to see different cursors</span>
                </div>
              </div>
            </motion.div>

            <ScrollIndicator />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export { HeroSection }; 