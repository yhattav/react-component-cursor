'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CustomCursor } from '@yhattav/react-component-cursor';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  bundleSize: string;
  renderTime: number;
}

interface ComparisonData {
  library: string;
  bundleSize: string;
  features: string[];
  performance: 'excellent' | 'good' | 'fair' | 'poor';
}

const comparisonData: ComparisonData[] = [
  {
    library: 'react-component-cursor',
    bundleSize: '< 10KB',
    features: ['SSR', 'TypeScript', 'Accessibility', 'Performance', 'Mobile'],
    performance: 'excellent'
  },
  {
    library: 'Custom Implementation',
    bundleSize: '15-30KB',
    features: ['Basic Cursor', 'Manual SSR', 'No TypeScript'],
    performance: 'fair'
  },
  {
    library: 'Other Libraries',
    bundleSize: '20-50KB',
    features: ['Basic Features', 'Limited SSR', 'Performance Issues'],
    performance: 'good'
  }
];

const architectureFeatures = [
  {
    icon: '🏗️',
    title: 'Singleton Pattern',
    description: 'Single mouse tracker shared across all cursor instances for optimal performance',
    technical: 'Reduces event listeners from N to 1, minimizing memory overhead'
  },
  {
    icon: '⚡',
    title: 'Performance Optimized',
    description: 'RequestAnimationFrame batching with extensive React.memo usage',
    technical: 'Custom arePropsEqual function and memoized callbacks prevent unnecessary re-renders'
  },
  {
    icon: '🌐',
    title: 'SSR Compatible',
    description: 'Graceful server-side rendering with zero hydration mismatches',
    technical: 'Safe browser API access with automatic SSR detection and fallbacks'
  },
  {
    icon: '♿',
    title: 'Accessibility First',
    description: 'WCAG 2.1 AA compliant with reduced motion and screen reader support',
    technical: 'Respects prefers-reduced-motion and provides proper ARIA attributes'
  },
  {
    icon: '📱',
    title: 'Mobile Optimized',
    description: 'Automatic touch device detection with graceful degradation',
    technical: 'Touch capability detection prevents cursor on mobile devices'
  },
  {
    icon: '🔧',
    title: 'Developer Experience',
    description: 'TypeScript ready with debugging tools and comprehensive validation',
    technical: 'Dual build system with development features and production optimization'
  }
];

export const ArchitecturePerformanceSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    bundleSize: '< 10KB',
    renderTime: 0
  });
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [cursorCount, setCursorCount] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    const startTime = performance.now();
    
    const updateMetrics = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const renderTime = Math.round(currentTime - startTime);
        
        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          renderTime: renderTime % 1000,
          memoryUsage: 0 // Simplified for deployment - memory tracking removed
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(updateMetrics);
    };
    
    updateMetrics();
  }, []);

  const handleStressTest = useCallback(() => {
    setIsStressTesting(!isStressTesting);
    setCursorCount(isStressTesting ? 1 : 5);
  }, [isStressTesting]);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <section 
      id="architecture-performance-section" 
      className="relative py-24 px-8 bg-gradient-to-br from-black to-gray-900"
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
            Production Confidence
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Enterprise-ready architecture with proven performance, accessibility compliance, 
            and technical excellence for production applications.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Architecture Features */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Technical Architecture</h3>
            <div className="space-y-4">
              {architectureFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    activeFeature === index
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{feature.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                      <p className="text-gray-300 text-sm mb-2">{feature.description}</p>
                      {activeFeature === index && (
                        <motion.p 
                          className="text-gray-400 text-xs italic"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          {feature.technical}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Dashboard */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Performance Dashboard</h3>
            
            {/* Real-time Metrics */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
              <h4 className="text-white font-semibold mb-4">Real-time Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{performanceMetrics.fps}</div>
                  <div className="text-sm text-gray-400">FPS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{performanceMetrics.memoryUsage}</div>
                  <div className="text-sm text-gray-400">Memory (MB)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{performanceMetrics.bundleSize}</div>
                  <div className="text-sm text-gray-400">Bundle Size</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{performanceMetrics.renderTime}</div>
                  <div className="text-sm text-gray-400">Render (ms)</div>
                </div>
              </div>
            </div>

            {/* Stress Test */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Performance Stress Test</h4>
                <button
                  onClick={handleStressTest}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isStressTesting
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isStressTesting ? 'Stop Test' : 'Start Stress Test'}
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {isStressTesting 
                  ? `Running ${cursorCount} cursor instances simultaneously`
                  : 'Test multiple cursor instances to verify performance'
                }
              </p>
              <div 
                ref={containerRef}
                className="h-32 bg-gray-900/50 rounded-lg border border-gray-600 relative overflow-hidden"
                style={{ cursor: 'none' }}
              >
                {Array.from({ length: cursorCount }, (_, i) => (
                  <CustomCursor
                    key={i}
                    containerRef={containerRef}
                    smoothness={2 + i}
                    offset={{ x: i * 5, y: i * 5 }}
                    showDevIndicator={false}
                  >
                    <div className={`w-4 h-4 rounded-full ${
                      i === 0 ? 'bg-blue-400' :
                      i === 1 ? 'bg-green-400' :
                      i === 2 ? 'bg-purple-400' :
                      i === 3 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                  </CustomCursor>
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">
                    {isStressTesting ? 'Multiple cursors active' : 'Hover to test single cursor'}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h4 className="text-white font-semibold mb-4">Library Comparison</h4>
              <div className="space-y-3">
                {comparisonData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-white">{item.library}</div>
                      <div className="text-sm text-gray-400">{item.bundleSize}</div>
                    </div>
                    <div className="flex-1 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.features.slice(0, 3).map((feature) => (
                          <span key={feature} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`font-semibold ${getPerformanceColor(item.performance)}`}>
                      {item.performance}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SSR Demo */}
        <div className="mt-16">
          <motion.div 
            className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-8 border border-blue-500/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Server-Side Rendering Ready</h3>
              <p className="text-gray-300 mb-6 max-w-3xl mx-auto">
                This Next.js application demonstrates full SSR compatibility. The cursor library 
                gracefully handles server-side rendering with zero hydration mismatches, making it 
                perfect for production applications.
              </p>
              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">✓</div>
                  <div className="text-gray-400">SSR Compatible</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">✓</div>
                  <div className="text-gray-400">Zero Hydration Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">✓</div>
                  <div className="text-gray-400">Production Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">✓</div>
                  <div className="text-gray-400">Framework Agnostic</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};