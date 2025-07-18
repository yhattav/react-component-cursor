'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';

interface ProductionApplicationsSectionProps {
  // Props interface for future extensibility
}

interface ApplicationDemo {
  id: string;
  title: string;
  description: string;
  category: string;
  cursorElement: React.ReactNode;
  cursorConfig: {
    smoothness?: number;
    offset?: { x: number; y: number };
    centered?: boolean;
  };
  code: string;
  features: string[];
}

const applicationDemos: ApplicationDemo[] = [
  {
    id: 'ecommerce',
    title: 'E-commerce Gallery Enhancement',
    description: 'Product image gallery with revealing cursor interactions and smooth animations',
    category: '🛍️ E-commerce',
    cursorElement: (
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg border-2 border-white/30 shadow-lg backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
      </div>
    ),
    cursorConfig: {
      smoothness: 8,
      offset: { x: 15, y: 15 },
      centered: false
    },
    code: `<CustomCursor
  smoothness={8}
  offset={{ x: 15, y: 15 }}
  centered={false}
  containerRef={galleryRef}
>
  <div className="gallery-cursor">
    <div className="preview-frame" />
    <div className="zoom-indicator" />
  </div>
</CustomCursor>`,
    features: ['Container Scoping', 'Smooth Animations', 'Visual Feedback']
  },
  {
    id: 'dashboard',
    title: 'Dashboard Interface States',
    description: 'Context-sensitive cursor states for different UI areas with accessibility features',
    category: '📊 Dashboard',
    cursorElement: (
      <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-600">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-white font-medium">Interactive</span>
      </div>
    ),
    cursorConfig: {
      smoothness: 3,
      offset: { x: 20, y: -10 },
      centered: false
    },
    code: `<CustomCursor
  smoothness={3}
  offset={{ x: 20, y: -10 }}
  onMove={handleAreaDetection}
  onVisibilityChange={handleAccessibility}
>
  <StatusIndicator 
    area={currentArea} 
    accessible={true}
  />
</CustomCursor>`,
    features: ['Event Handlers', 'State Management', 'ARIA Support']
  },
  {
    id: 'gaming',
    title: 'Interactive Experience Design',
    description: 'Gaming/interactive interface with custom cursor and mobile detection',
    category: '🎮 Gaming',
    cursorElement: (
      <div className="relative">
        <div className="w-8 h-8 border-2 border-cyan-400 rounded-full bg-cyan-400/20">
          <div className="absolute inset-0 rounded-full border border-cyan-300 animate-ping"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-1 h-4 bg-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-4 h-1 bg-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    ),
    cursorConfig: {
      smoothness: 1,
      offset: { x: 0, y: 0 },
      centered: true
    },
    code: `<CustomCursor
  smoothness={1}
  centered={true}
  showDevIndicator={false}
>
  <Crosshair 
    size="large"
    color="cyan"
    animated={true}
  />
</CustomCursor>`,
    features: ['Mobile Detection', 'Performance Optimized', 'Real-time Updates']
  },
  {
    id: 'accessibility',
    title: 'Accessibility & SSR Demo',
    description: 'Server-side rendering compatibility with accessibility features',
    category: '♿ Accessibility',
    cursorElement: (
      <div className="flex items-center gap-2 bg-green-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-green-500/50">
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        <span className="text-xs text-green-100 font-medium">A11Y Ready</span>
      </div>
    ),
    cursorConfig: {
      smoothness: 5,
      offset: { x: 10, y: -15 },
      centered: false
    },
    code: `<CustomCursor
  smoothness={5}
  offset={{ x: 10, y: -15 }}
  role="presentation"
  aria-label="Custom cursor indicator"
>
  <AccessibilityIndicator 
    reducedMotion={prefersReducedMotion}
    screenReader={true}
  />
</CustomCursor>`,
    features: ['SSR Compatible', 'Reduced Motion', 'Screen Reader Support']
  }
];

export const ProductionApplicationsSection: React.FC<ProductionApplicationsSectionProps> = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    interactionCount: 0
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const demoAreaRef = useRef<HTMLDivElement>(null);

  const currentDemo = applicationDemos[activeDemo];

  const handleCursorMove = useCallback(() => {
    setPerformanceMetrics(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1
    }));
  }, []);

  const copyCodeToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, []);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        setPerformanceMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime))
        }));
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(updateFPS);
    };
    
    updateFPS();
  }, []);

  return (
    <section 
      id="production-applications-section" 
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
            Real-World Design Patterns
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Production-ready implementations with code examples showing practical use cases, 
            performance optimizations, and accessibility features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Selection */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-white mb-6">Select Implementation</h3>
            <div className="space-y-3">
              {applicationDemos.map((demo, index) => (
                <motion.button
                  key={demo.id}
                  onClick={() => setActiveDemo(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    activeDemo === index
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-sm mb-1">{demo.category}</div>
                  <div className="font-semibold">{demo.title}</div>
                  <div className="text-sm opacity-80 mt-1">{demo.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {demo.features.map((feature) => (
                      <span 
                        key={feature}
                        className="text-xs px-2 py-1 bg-gray-700/50 rounded text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Demo Area */}
          <div className="lg:col-span-2">
            <div 
              ref={containerRef}
              className="relative"
              style={{ cursor: 'none' }}
            >
              <CustomCursor
                containerRef={containerRef}
                {...currentDemo.cursorConfig}
                onMove={handleCursorMove}
                showDevIndicator={false}
              >
                {currentDemo.cursorElement}
              </CustomCursor>

              {/* Interactive Demo Area */}
              <div 
                ref={demoAreaRef}
                className="bg-gray-800/30 rounded-xl p-8 border border-gray-700 mb-6 min-h-[300px] flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{currentDemo.category.split(' ')[0]}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{currentDemo.title}</h3>
                  <p className="text-gray-300 mb-6 max-w-md">{currentDemo.description}</p>
                  
                  {/* Performance Metrics */}
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-green-400 font-bold">{performanceMetrics.fps}</div>
                      <div className="text-gray-400">FPS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{performanceMetrics.interactionCount}</div>
                      <div className="text-gray-400">Interactions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">&lt; 10KB</div>
                      <div className="text-gray-400">Bundle</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div className="bg-gray-900/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h4 className="text-white font-semibold">Implementation Code</h4>
                  <button
                    onClick={() => copyCodeToClipboard(currentDemo.code)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50 border border-gray-600"
                  >
                    {copiedCode === currentDemo.code ? (
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
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-sm text-gray-300 bg-black/30 overflow-x-auto">
                  <code>{currentDemo.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};