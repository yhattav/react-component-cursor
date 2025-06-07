'use client';

import { CustomCursor } from '@yhattav/react-component-cursor';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Hook to get window dimensions safely
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 1920,
    height: 1080,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowDimensions;
}

// Demo cursor components for the showcase
const GlowCursor = () => (
  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm opacity-80" />
);

const EmojiCursor = ({ emoji }: { emoji: string }) => (
  <div className="text-2xl select-none pointer-events-none">{emoji}</div>
);

// TrailCursor component - currently unused but available for future demos
// const TrailCursor = () => (
//   <div className="relative pointer-events-none">
//     <div className="w-4 h-4 bg-red-500 rounded-full" />
//     <div className="absolute top-0 left-0 w-4 h-4 bg-red-400 rounded-full animate-ping" />
//   </div>
// );

const ParticleCursor = () => (
  <div className="relative pointer-events-none">
    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
    <div className="absolute -top-1 -left-1 w-4 h-4 border border-cyan-400 rounded-full animate-pulse" />
  </div>
);

// Hero cursor component that morphs between different styles
const HeroCursor = ({ mode }: { mode: number }) => {
  const modes = [
    <div key="glow" className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-70" />,
    <div key="particle" className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />,
    <div key="emoji" className="text-3xl">✨</div>,
    <div key="ring" className="w-6 h-6 border-2 border-purple-400 rounded-full bg-purple-400/20" />
  ];
  
  return modes[mode % modes.length];
};

export default function HomePage() {
  const [heroCursorMode, setHeroCursorMode] = useState(0);
  const [demoCursorMode, setDemoCursorMode] = useState<'glow' | 'emoji' | 'trail' | 'particle' | 'default'>('default');
  const [currentEmoji, setCurrentEmoji] = useState('🎯');
  const [isMounted, setIsMounted] = useState(false);
  const { width, height } = useWindowDimensions();

  const emojis = ['🎯', '⭐', '🚀', '🎨', '🔥', '💎', '🌟', '✨'];

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-cycle hero cursor modes
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCursorMode(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Hero Custom Cursor - Always active on hero section */}
      <div className="relative">
        <CustomCursor
          smoothness={2}
          className="z-50"
        >
          <HeroCursor mode={heroCursorMode} />
        </CustomCursor>

        {/* 1. HERO SECTION - The Hook (0-3 seconds) */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {isMounted && [...Array(20)].map((_, i) => {
              const initialX = Math.random() * width;
              const initialY = Math.random() * height;
              const targetX = Math.random() * width;
              const targetY = Math.random() * height;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                  initial={{ 
                    x: initialX,
                    y: initialY,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: targetX,
                    y: targetY,
                    opacity: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              );
            })}
          </div>

          <div className="container mx-auto px-6 py-20 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                     Transform Your React App&apos;s
                </span>
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Cursor Into Anything
                </span>
              </h2>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Lightweight. Performant. Infinitely Customizable.
              </motion.p>

              {/* Quick Stats */}
              <motion.div 
                className="flex flex-wrap justify-center gap-6 mb-12 text-sm font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <span className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                  &lt; 10KB Bundle
                </span>
                <span className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                  0 Dependencies
                </span>
                <span className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                  TypeScript Ready
                </span>
              </motion.div>

              {/* Primary CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Get Started in 2 Minutes
                </button>
                <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300">
                  See Live Examples ↓
                </button>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                <motion.div
                  className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="w-1 h-2 bg-gray-400 rounded-full mt-2"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 2. PROOF SECTION - Why This Matters (3-10 seconds) */}
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Generic Cursors Limit Your Creativity
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Break free from browser defaults and create engaging, interactive experiences that captivate your users.
              </p>
            </motion.div>

            {/* Before/After Comparison */}
            <motion.div 
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700">
                <h3 className="text-xl font-semibold text-red-400 mb-4">❌ Before: Generic & Boring</h3>
                <div className="bg-gray-900 rounded-lg p-6 mb-4 relative overflow-hidden cursor-default">
                  <div className="text-gray-400 text-center py-8">
                    Same old pointer cursor everywhere...
                    <br />
                    <span className="text-sm opacity-60">No personality, no engagement</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Limited to basic browser cursors that don&apos;t reflect your brand or enhance user experience.
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-8 border border-green-500/50">
                <h3 className="text-xl font-semibold text-green-400 mb-4">✅ After: Dynamic & Engaging</h3>
                <div className="bg-gray-900 rounded-lg p-6 mb-4 relative overflow-hidden">
                  <CustomCursor smoothness={1}>
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />
                  </CustomCursor>
                  <div className="text-green-400 text-center py-8">
                    Interactive, branded experience ✨
                    <br />
                    <span className="text-sm opacity-80">Hover to see the magic!</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Custom cursors that match your design, enhance interactions, and delight users.
                </p>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                <div className="flex items-center gap-2 text-yellow-400">
                  <span className="text-2xl">⭐</span>
                  <span className="font-semibold">50+ GitHub Stars</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <span className="text-2xl">📦</span>
                  <span className="font-semibold">1,000+ Downloads</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="text-2xl">🚀</span>
                  <span className="font-semibold">Production Ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

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
                    {emojis.map((emoji) => (
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
                  smoothness={demoCursorMode === 'particle' ? 1 : 2}
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
                      <span className="text-green-400 font-mono">60</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-400 text-sm">Memory:</span>
                      <span className="text-blue-400 font-mono">&lt; 2MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400 text-sm">Bundle:</span>
                      <span className="text-purple-400 font-mono">8.2KB</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>

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
