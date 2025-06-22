'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';

// Components
import { HeroSection } from '../components/sections/hero-section';
import { ProofSection } from '../components/sections/proof-section';
import { InteractiveExamplesSection } from '../components/sections/interactive-examples-section';
import { GlowCursor, EmojiCursor, ParticleCursor } from '../components/cursors';

// Constants and types
import { 
  AVAILABLE_EMOJIS, 
  PERFORMANCE_METRICS,
  type DemoCursorMode 
} from '../lib/constants';

export default function HomePage() {
  const [demoCursorMode, setDemoCursorMode] = useState<DemoCursorMode>('default');
  const [currentEmoji, setCurrentEmoji] = useState('🎯');

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* 1. HERO SECTION - The Hook (0-3 seconds) */}
      <HeroSection />

      {/* 2. PROOF SECTION - Why This Matters (3-10 seconds) */}
      <ProofSection />

      {/* 3. CORE FEATURES SHOWCASE - What You Get (10-30 seconds) */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features, Simple API
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create stunning cursor experiences, with the performance and flexibility you demand.
            </p>
          </motion.div>

          {/* Interactive Demo Section */}
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Any React Component as Cursor</h3>
              <p className="text-gray-300 mb-6">
                Try different cursor styles and see the smooth performance in action
              </p>

              {/* Demo Cursor Controls */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                  onClick={() => setDemoCursorMode('default')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    demoCursorMode === 'default' 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setDemoCursorMode('glow')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    demoCursorMode === 'glow' 
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Glow Effect
                </button>
                <button
                  onClick={() => setDemoCursorMode('emoji')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    demoCursorMode === 'emoji' 
                      ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Emoji
                </button>
                <button
                  onClick={() => setDemoCursorMode('particle')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    demoCursorMode === 'particle' 
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Particle
                </button>
              </div>

              {/* Emoji Selector */}
              {demoCursorMode === 'emoji' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-center gap-2 mb-8"
                >
                  {AVAILABLE_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setCurrentEmoji(emoji)}
                      className={`text-2xl p-3 rounded-lg transition-all ${
                        currentEmoji === emoji ? 'bg-pink-500 scale-110' : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Demo Areas with Custom Cursors */}
            {demoCursorMode !== 'default' && (
              <CustomCursor
                id="demo-cursor"
                smoothness={demoCursorMode === 'particle' ? 1 : 2}
                showDevIndicator={false}
                className="z-40"
              >
                {demoCursorMode === 'glow' && <GlowCursor />}
                {demoCursorMode === 'emoji' && <EmojiCursor emoji={currentEmoji} />}
                {demoCursorMode === 'particle' && <ParticleCursor />}
              </CustomCursor>
            )}

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 min-h-[300px] flex flex-col justify-center"
              >
                <h4 className="text-xl font-semibold text-blue-400 mb-4">Interactive Playground</h4>
                <p className="text-gray-300 mb-6">
                  Move your cursor around this area to experience the selected cursor style. 
                  Notice the smooth 60fps performance and responsive animations.
                </p>
                <div className="flex-1 bg-blue-500/5 rounded-lg flex items-center justify-center border border-blue-500/20 min-h-[120px]">
                  <span className="text-blue-400 text-center">
                    🎮 Hover and move around!<br />
                    <span className="text-sm opacity-70">Try different cursor modes above</span>
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 min-h-[300px] flex flex-col justify-center"
              >
                <h4 className="text-xl font-semibold text-purple-400 mb-4">Performance Monitor</h4>
                <p className="text-gray-300 mb-6">
                  Watch the real-time performance metrics. Our cursors maintain 60fps even with complex animations.
                </p>
                <div className="flex-1 bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-400 text-sm">FPS:</span>
                    <span className="text-green-400 font-mono">{PERFORMANCE_METRICS.fps}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-400 text-sm">Memory:</span>
                    <span className="text-blue-400 font-mono">{PERFORMANCE_METRICS.memory}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 text-sm">Bundle:</span>
                    <span className="text-purple-400 font-mono">{PERFORMANCE_METRICS.bundle}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE EXAMPLES - See It In Action (30-60 seconds) */}
      <InteractiveExamplesSection />

      {/* Quick Start Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple installation, intuitive API, and comprehensive TypeScript support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 rounded-xl p-8 border border-gray-700"
            >
              <h3 className="text-2xl font-semibold text-blue-400 mb-6 flex items-center gap-3">
                <span>📦</span> Installation
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <code className="text-green-400 text-sm font-mono">
                  npm install @yhattav/react-component-cursor
                </code>
              </div>
              <p className="text-gray-300">
                Zero dependencies, works with any React 16.8+ project.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 rounded-xl p-8 border border-gray-700"
            >
              <h3 className="text-2xl font-semibold text-purple-400 mb-6 flex items-center gap-3">
                <span>⚡</span> Basic Usage
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-6 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`import { CustomCursor } from 
  '@yhattav/react-component-cursor';

<CustomCursor>
  <div>✨ Your cursor!</div>
</CustomCursor>`}
                </pre>
              </div>
              <p className="text-gray-300">
                That&apos;s it! Add any React component as your cursor.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 mb-4">
            Built with ❤️ by{' '}
            <a href="https://github.com/yhattav" className="text-blue-400 hover:text-blue-300 transition-colors">
              Yonatan Hattav
            </a>
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Open source React library for creating engaging cursor experiences. 
            Perfect for interactive websites, creative portfolios, and modern applications.
          </p>
        </div>
      </footer>
    </main>
  );
} 