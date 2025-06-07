'use client';

import { CustomCursor } from '@yhattav/react-component-cursor';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Demo cursor components
const GlowCursor = () => (
  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-sm opacity-80" />
);

const EmojiCursor = ({ emoji }: { emoji: string }) => (
  <div className="text-2xl select-none">{emoji}</div>
);

const TrailCursor = () => (
  <div className="relative">
    <div className="w-4 h-4 bg-red-500 rounded-full" />
    <div className="absolute top-0 left-0 w-4 h-4 bg-red-400 rounded-full animate-ping" />
  </div>
);

export default function HomePage() {
  const [cursorMode, setCursorMode] = useState<'glow' | 'emoji' | 'trail' | 'default'>('default');
  const [currentEmoji, setCurrentEmoji] = useState('🎯');

  const emojis = ['🎯', '⭐', '🚀', '🎨', '🔥', '💎', '🌟', '✨'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Custom Cursor Implementation - Demonstrates SSR compatibility */}
      {cursorMode !== 'default' && (
        <CustomCursor
          smoothness={cursorMode === 'trail' ? 3 : 1}
          onMove={(position) => {
            // Optional: Add analytics or debugging
            if (process.env.NODE_ENV === 'development') {
              console.log(`Cursor at: ${position.x}, ${position.y}`);
            }
          }}
        >
          {cursorMode === 'glow' && <GlowCursor />}
          {cursorMode === 'emoji' && <EmojiCursor emoji={currentEmoji} />}
          {cursorMode === 'trail' && <TrailCursor />}
        </CustomCursor>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            React Custom Cursor
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A lightweight, TypeScript-first React library for creating beautiful custom cursors with full SSR support
          </p>
          
          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">⚡ Lightweight</h3>
              <p className="text-gray-300 text-sm">Less than 10KB bundle size with zero dependencies</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">🔧 TypeScript-First</h3>
              <p className="text-gray-300 text-sm">Comprehensive type safety and IntelliSense support</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-pink-400 mb-2">🌐 SSR Ready</h3>
              <p className="text-gray-300 text-sm">Works seamlessly with Next.js, Gatsby, and all SSR frameworks</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Demo */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Try Different Cursor Styles</h2>
          <p className="text-gray-300 mb-8">
            Hover over the demo areas below to see the custom cursors in action
          </p>

          {/* Cursor Mode Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setCursorMode('default')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                cursorMode === 'default' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Default Cursor
            </button>
            <button
              onClick={() => setCursorMode('glow')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                cursorMode === 'glow' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Glow Effect
            </button>
            <button
              onClick={() => setCursorMode('emoji')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                cursorMode === 'emoji' 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Emoji Cursor
            </button>
            <button
              onClick={() => setCursorMode('trail')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                cursorMode === 'trail' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Trail Effect
            </button>
          </div>

          {/* Emoji Selector */}
          {cursorMode === 'emoji' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center gap-2 mb-8"
            >
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setCurrentEmoji(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    currentEmoji === emoji ? 'bg-pink-500' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Demo Areas */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-4">Interactive Area 1</h3>
            <p className="text-gray-300 mb-4">
              Move your cursor around this area to see the custom cursor in action. The cursor automatically adjusts based on your selection above.
            </p>
            <div className="w-full h-32 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
              <span className="text-blue-400">Hover here!</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-purple-400 mb-4">Interactive Area 2</h3>
            <p className="text-gray-300 mb-4">
              This demonstrates how the custom cursor works across different components and maintains smooth performance.
            </p>
            <div className="w-full h-32 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
              <span className="text-purple-400">Try different modes!</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Easy to Use</h2>
          <p className="text-gray-300 mb-8">
            Get started with just a few lines of code. Full SSR support included!
          </p>
          
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl mx-auto border border-gray-700">
            <pre className="text-left text-green-400 text-sm overflow-x-auto">
{`import { CustomCursor } from '@yhattav/react-component-cursor';

export default function App() {
  return (
    <>
      <CustomCursor>
        <div className="cursor-content">
          ✨ Custom Cursor
        </div>
      </CustomCursor>
      
      <main>
        {/* Your app content */}
      </main>
    </>
  );
}`}
            </pre>
          </div>
        </motion.div>
      </section>

      {/* Installation & Documentation */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Get Started</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-blue-400 mb-4">📦 Installation</h3>
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <code className="text-green-400 text-sm">
                  npm install @yhattav/react-component-cursor
                </code>
              </div>
              <p className="text-gray-300 text-sm">
                Zero dependencies, TypeScript included
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">📚 Documentation</h3>
              <p className="text-gray-300 mb-4">
                Comprehensive guides, examples, and API reference
              </p>
              <a 
                href="https://yhattav.github.io/react-component-cursor" 
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                View Documentation →
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p className="mb-4">
            Built with ❤️ by{' '}
            <a href="https://github.com/yhattav" className="text-blue-400 hover:text-blue-300 transition-colors">
              Yonatan Hattav
            </a>
          </p>
          <p className="text-sm">
            This page demonstrates SSR compatibility - the custom cursor only loads on the client side,
            preventing hydration mismatches while maintaining perfect SEO.
          </p>
        </div>
      </footer>
    </main>
  );
}
