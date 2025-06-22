import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { SOCIAL_PROOF } from '../../lib/constants';

// Proof section cursor variants that change based on interaction state
const proofCursorVariants = [
  {
    id: 'default',
    element: <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse" />,
    name: 'Default'
  },
  {
    id: 'hovering',
    element: <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg shadow-green-400/50 animate-bounce" />,
    name: 'Hovering'
  },
  {
    id: 'interactive',
    element: (
      <div className="relative">
        <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" />
        <div className="absolute inset-0 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping opacity-60" />
      </div>
    ),
    name: 'Interactive'
  }
];

function ProofSection() {
  const [currentCursorIndex, setCursorIndex] = useState(0);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Handle cursor movement to change cursor appearance based on hover targets
  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    // Check if cursor is over interactive elements
    const element = document.elementFromPoint(position.x, position.y);
    const isOverCard = element?.closest('.proof-card') !== null;
    const isOverButton = element?.closest('.proof-button') !== null;
    
    let newIndex = 0;
    if (isOverButton) {
      newIndex = 2; // Interactive cursor for buttons
    } else if (isOverCard) {
      newIndex = 1; // Hovering cursor for cards
    } else {
      newIndex = 0; // Default cursor
    }
    
    if (newIndex !== currentCursorIndex) {
      setCursorIndex(newIndex);
    }
    
    setIsHoveringCard(isOverCard);
  }, [currentCursorIndex]);

  const handleInteraction = () => {
    setInteractionCount(prev => prev + 1);
  };

  const currentCursor = proofCursorVariants[currentCursorIndex];

  return (
    <section className="relative py-20 bg-gradient-to-b from-transparent to-gray-900/50">
      <CustomCursor 
        smoothness={3} 
        className="z-40"
        onMove={handleCursorMove}
      >
        <motion.div
          key={currentCursor.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
        >
          {currentCursor.element}
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
          <div className="proof-card bg-gray-800/30 rounded-xl p-8 border border-gray-700 transition-all duration-300 hover:border-red-500/50">
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

          <div className="proof-card bg-gray-800/30 rounded-xl p-8 border border-green-500/50 transition-all duration-300 hover:border-green-400/70">
            <h3 className="text-xl font-semibold text-green-400 mb-4">✅ After: Dynamic & Engaging</h3>
            <div className="bg-gray-900 rounded-lg p-6 mb-4 relative overflow-hidden">
              <div className="text-green-400 text-center py-8">
                Interactive, branded experience ✨
                <br />
                <span className="text-sm opacity-80">Hover to see the magic!</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Custom cursors that match your design, enhance interactions, and delight users.
            </p>
            <button 
              className="proof-button mt-4 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              onClick={handleInteraction}
            >
              Try Interaction ({interactionCount})
            </button>
          </div>
        </motion.div>

        {/* Cursor State Indicator */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg px-6 py-3 inline-block border border-gray-600/30">
            <div className="flex items-center gap-4 text-sm">
              <div className={`w-3 h-3 rounded-full ${isHoveringCard ? 'bg-green-400' : 'bg-blue-400'} transition-colors`} />
              <span className="text-gray-300">
                Cursor: <span className="text-white font-semibold">{currentCursor.name}</span>
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Interactions: {interactionCount}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Hover over cards to see changes</span>
            </div>
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
              <span className="font-semibold">{SOCIAL_PROOF.stars}</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-2xl">📦</span>
              <span className="font-semibold">{SOCIAL_PROOF.downloads}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <span className="text-2xl">🚀</span>
              <span className="font-semibold">{SOCIAL_PROOF.status}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { ProofSection }; 