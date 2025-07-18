'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ImplementationStep {
  title: string;
  time: string;
  description: string;
  code: string;
  notes?: string[];
}

const implementationSteps: ImplementationStep[] = [
  {
    title: 'Basic Setup',
    time: '30 seconds',
    description: 'Install and create your first custom cursor',
    code: `npm install @yhattav/react-component-cursor

import { CustomCursor } from '@yhattav/react-component-cursor';

function App() {
  return (
    <div>
      <CustomCursor>
        <div className="w-4 h-4 bg-blue-500 rounded-full" />
      </CustomCursor>
      {/* Your app content */}
    </div>
  );
}`,
    notes: ['Zero configuration required', 'Works immediately', 'TypeScript ready']
  },
  {
    title: 'Design Enhancement',
    time: '2 minutes',
    description: 'Add smooth animations and custom styling',
    code: `<CustomCursor
  smoothness={5}
  offset={{ x: 10, y: -10 }}
  centered={false}
>
  <div className="cursor-design">
    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 
                    rounded-full border-2 border-white/30 shadow-lg">
      <div className="absolute inset-0 rounded-full border 
                      border-purple-300 animate-ping" />
    </div>
  </div>
</CustomCursor>`,
    notes: ['Smooth following animations', 'Custom positioning', 'CSS animations support']
  },
  {
    title: 'Production Patterns',
    time: '5 minutes',
    description: 'Container scoping, events, and optimization',
    code: `const containerRef = useRef<HTMLDivElement>(null);

<CustomCursor
  containerRef={containerRef}
  smoothness={3}
  onMove={(position) => {
    // Handle cursor movement
    console.log('Cursor at:', position);
  }}
  onVisibilityChange={(visible, reason) => {
    // Handle visibility changes
    setIsActive(visible);
  }}
  throttleMs={16} // 60fps optimization
>
  <InteractiveCursor state={cursorState} />
</CustomCursor>

<div ref={containerRef} className="scoped-area">
  {/* Cursor only works within this container */}
</div>`,
    notes: ['Container scoping', 'Event handling', 'Performance optimization', 'State management']
  },
  {
    title: 'Advanced Architecture',
    time: 'Advanced',
    description: 'Multiple instances, performance tuning, and patterns',
    code: `// Multiple cursors with shared performance
const cursors = useMemo(() => [
  { id: 'main', smoothness: 2, offset: { x: 0, y: 0 } },
  { id: 'trail', smoothness: 8, offset: { x: -20, y: -20 } },
], []);

// Performance monitoring
const [metrics, setMetrics] = useState({ fps: 60, memory: 0 });

useEffect(() => {
  const monitor = new PerformanceMonitor();
  monitor.on('update', setMetrics);
  return () => monitor.destroy();
}, []);

{cursors.map(cursor => (
  <CustomCursor
    key={cursor.id}
    {...cursor}
    showDevIndicator={process.env.NODE_ENV === 'development'}
  >
    <CursorComponent type={cursor.id} metrics={metrics} />
  </CustomCursor>
))}`,
    notes: ['Multiple instances', 'Performance monitoring', 'Development debugging', 'Production optimization']
  }
];

const communityLinks = [
  {
    icon: '📚',
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    link: 'https://github.com/yhattav/react-component-cursor#readme',
    color: 'blue'
  },
  {
    icon: '💬',
    title: 'GitHub Discussions',
    description: 'Community support and feature requests',
    link: 'https://github.com/yhattav/react-component-cursor/discussions',
    color: 'green'
  },
  {
    icon: '🐛',
    title: 'Issue Tracker',
    description: 'Bug reports and feature requests',
    link: 'https://github.com/yhattav/react-component-cursor/issues',
    color: 'red'
  },
  {
    icon: '🎨',
    title: 'Showcase Gallery',
    description: 'Community implementations and creative uses',
    link: '#',
    color: 'purple'
  }
];

const frameworkGuides = [
  { name: 'Next.js', setup: 'Works out of the box with SSR', status: '✅' },
  { name: 'Vite', setup: 'Zero configuration required', status: '✅' },
  { name: 'Create React App', setup: 'Standard React integration', status: '✅' },
  { name: 'Gatsby', setup: 'Static site generation support', status: '✅' },
  { name: 'Remix', setup: 'Full-stack React compatibility', status: '✅' }
];

export const ImplementationCommunitySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-500/10';
      case 'green': return 'border-green-500 bg-green-500/10';
      case 'red': return 'border-red-500 bg-red-500/10';
      case 'purple': return 'border-purple-500 bg-purple-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <section 
      id="implementation-community-section" 
      className="relative py-24 px-8 bg-gradient-to-br from-gray-900 to-black"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get Started & Stay Connected
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From basic setup to advanced patterns, plus community support and resources.
          </motion.p>
        </div>

        {/* Implementation Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Steps Navigation */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Progressive Implementation</h3>
            <div className="space-y-4">
              {implementationSteps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    activeStep === index
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{step.title}</h4>
                    <span className="text-sm bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm opacity-80">{step.description}</p>
                  {step.notes && activeStep === index && (
                    <motion.div 
                      className="mt-3 space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.notes.map((note, noteIndex) => (
                        <div key={noteIndex} className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {note}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">Implementation Code</h3>
              <button
                onClick={() => copyToClipboard(implementationSteps[activeStep].code)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50 border border-gray-600"
              >
                {copiedCode === implementationSteps[activeStep].code ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden">
              <pre className="p-6 text-sm text-gray-300 bg-black/30 overflow-x-auto">
                <code>{implementationSteps[activeStep].code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Framework Compatibility */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Framework Compatibility</h3>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {frameworkGuides.map((framework, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-gray-900/50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="text-2xl mb-2">{framework.status}</div>
                  <h4 className="font-semibold text-white mb-1">{framework.name}</h4>
                  <p className="text-xs text-gray-400">{framework.setup}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Community & Support */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Community & Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${getColorClass(link.color)}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl mb-3">{link.icon}</div>
                <h4 className="font-semibold text-white mb-2">{link.title}</h4>
                <p className="text-sm text-gray-300">{link.description}</p>
              </motion.a>
            ))}
          </div>
        </div>

        {/* GitHub Stats */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Open Source & Community Driven</h3>
            <p className="text-gray-300 mb-6">
              Built with love by the community, for the community. Star us on GitHub and join the growing ecosystem of creative developers.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg">⭐</div>
                <div className="text-gray-400">Star on GitHub</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-lg">🔧</div>
                <div className="text-gray-400">Contribute</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">💬</div>
                <div className="text-gray-400">Get Support</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold text-lg">🚀</div>
                <div className="text-gray-400">Build Amazing</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};