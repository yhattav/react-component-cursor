import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { GlowCursor, EmojiCursor, ParticleCursor } from '../cursors';
import { AVAILABLE_EMOJIS, PERFORMANCE_METRICS } from '../../lib/constants';

// Feature-specific cursor variants
const featureCursorVariants = [
  {
    id: 'default',
    element: <div className="w-4 h-4 bg-blue-500 rounded-full opacity-70" />,
    name: 'Default',
    description: 'Smooth tracking cursor'
  },
  {
    id: 'glow',
    element: <GlowCursor />,
    name: 'Glow Effect',
    description: 'Beautiful gradient glow'
  },
  {
    id: 'emoji',
    element: <EmojiCursor emoji="🎯" />,
    name: 'Emoji Cursor',
    description: 'Fun emoji interactions'
  },
  {
    id: 'particle',
    element: <ParticleCursor />,
    name: 'Particle Effect',
    description: 'Advanced particle animations'
  }
];

function FeaturesShowcaseSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [currentCursorIndex, setCursorIndex] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [isInPlayground, setIsInPlayground] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [interactionStats, setInteractionStats] = useState({
    movements: 0,
    clicks: 0,
    hovers: 0
  });

  // Handle cursor movement with feature-specific logic
  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    // Update movement stats
    setInteractionStats(prev => ({ ...prev, movements: prev.movements + 1 }));

    // Determine which feature area the cursor is in
    const element = document.elementFromPoint(position.x, position.y);
    const demoArea = element?.closest('.demo-area');
    const featureCard = element?.closest('.feature-card');
    const emojiSelector = element?.closest('.emoji-selector');
    const performanceArea = element?.closest('.performance-area');

    let newIndex = 0;
    if (performanceArea) {
      newIndex = 3; // Particle cursor for performance demo
      setPerformanceMode(true);
    } else if (emojiSelector) {
      newIndex = 2; // Emoji cursor in emoji area
      setPerformanceMode(false);
    } else if (featureCard?.classList.contains('glow-feature')) {
      newIndex = 1; // Glow cursor for glow feature
      setPerformanceMode(false);
    } else if (demoArea) {
      // In playground area, use selected cursor mode
      setIsInPlayground(true);
      setPerformanceMode(false);
    } else {
      newIndex = 0; // Default cursor
      setIsInPlayground(false);
      setPerformanceMode(false);
    }

    if (newIndex !== currentCursorIndex && !isInPlayground) {
      setCursorIndex(newIndex);
    }
  }, [currentCursorIndex, isInPlayground]);

  const handleCursorVisibilityChange = useCallback((isVisible: boolean) => {
    if (isVisible) {
      setInteractionStats(prev => ({ ...prev, hovers: prev.hovers + 1 }));
    }
  }, []);

  const changeCursorMode = (index: number) => {
    setCursorIndex(index);
    setInteractionStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setCursorIndex(2); // Switch to emoji cursor
    setInteractionStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
  };

  const currentCursor = featureCursorVariants[currentCursorIndex];
  const currentElement = currentCursorIndex === 2 
    ? <EmojiCursor emoji={selectedEmoji} />
    : currentCursor.element;

  return (
    <section ref={containerRef} className="relative py-20">
      <CustomCursor 
        containerRef={containerRef}
        smoothness={performanceMode ? 1 : 2} 
        className="z-40"
        onMove={handleCursorMove}
        onVisibilityChange={handleCursorVisibilityChange}
      >
        <motion.div
          key={`${currentCursor.id}-${selectedEmoji}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          {currentElement}
        </motion.div>
      </CustomCursor>

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

        {/* Feature Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featureCursorVariants.map((variant, index) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`feature-card ${variant.id === 'glow' ? 'glow-feature' : ''} bg-gray-800/30 rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                currentCursorIndex === index 
                  ? 'border-blue-500/50 bg-blue-900/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => changeCursorMode(index)}
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {variant.element}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{variant.name}</h3>
                <p className="text-gray-400 text-sm">{variant.description}</p>
                {currentCursorIndex === index && (
                  <div className="mt-3 text-xs text-blue-400 font-medium">
                    ✓ Active
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo Areas */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Playground Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="demo-area bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 min-h-[300px] flex flex-col"
          >
            <h4 className="text-xl font-semibold text-blue-400 mb-4">🎮 Interactive Playground</h4>
            <p className="text-gray-300 mb-6">
              Move your cursor around this area to experience the selected cursor style. 
              Click the feature cards above to switch between different cursor modes.
            </p>
            
            {/* Emoji Selector */}
            {currentCursorIndex === 2 && (
              <div className="emoji-selector mb-4">
                <p className="text-sm text-gray-400 mb-2">Select emoji:</p>
                <div className="flex gap-2 flex-wrap">
                  {AVAILABLE_EMOJIS.slice(0, 6).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        selectedEmoji === emoji 
                          ? 'bg-blue-500 scale-110 shadow-lg' 
                          : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 bg-blue-500/5 rounded-lg flex items-center justify-center border border-blue-500/20 min-h-[120px]">
              <div className="text-center">
                <span className="text-blue-400 text-lg block mb-2">
                  Current: {currentCursor.name}
                </span>
                <span className="text-sm text-gray-400">
                  {isInPlayground ? '🎯 You\'re in the playground!' : 'Hover to enter playground'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Performance Monitor */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="performance-area bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 min-h-[300px] flex flex-col"
          >
            <h4 className="text-xl font-semibold text-purple-400 mb-4">📊 Performance Monitor</h4>
            <p className="text-gray-300 mb-6">
              Watch the real-time performance metrics and interaction statistics. 
              Our cursors maintain smooth performance even with complex animations.
            </p>
            
            <div className="flex-1 bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800/30 rounded p-3">
                  <div className="text-green-400 text-sm mb-1">FPS</div>
                  <div className="text-green-400 font-mono text-lg">{PERFORMANCE_METRICS.fps}</div>
                </div>
                <div className="bg-gray-800/30 rounded p-3">
                  <div className="text-blue-400 text-sm mb-1">Memory</div>
                  <div className="text-blue-400 font-mono text-lg">{PERFORMANCE_METRICS.memory}</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Cursor Movements:</span>
                  <span className="text-white font-mono">{Math.min(interactionStats.movements, 9999)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Interactions:</span>
                  <span className="text-white font-mono">{interactionStats.clicks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Mode Changes:</span>
                  <span className="text-white font-mono">{interactionStats.hovers}</span>
                </div>
              </div>
              
              {performanceMode && (
                <div className="mt-3 text-xs text-purple-400 animate-pulse">
                  ⚡ High-performance mode active
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Current State Indicator */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg px-6 py-4 inline-block border border-gray-600/30">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${performanceMode ? 'bg-purple-400 animate-pulse' : 'bg-blue-400'} transition-colors`} />
                <span className="text-gray-300">
                  Mode: <span className="text-white font-semibold">{currentCursor.name}</span>
                </span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">
                Smoothness: <span className="text-white">{performanceMode ? 'High Performance' : 'Smooth'}</span>
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">
                {isInPlayground ? '🎮 In Playground' : '📍 Hover features to explore'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { FeaturesShowcaseSection }; 