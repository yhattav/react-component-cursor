import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeBlock } from '../ui';

interface PackageManager {
  name: string;
  command: string;
  color: string;
}

const packageManagers: PackageManager[] = [
  { name: 'npm', command: 'npm install @yhattav/react-component-cursor', color: 'text-gray-300' },
  { name: 'yarn', command: 'yarn add @yhattav/react-component-cursor', color: 'text-gray-300' },
  { name: 'pnpm', command: 'pnpm add @yhattav/react-component-cursor', color: 'text-gray-300' },
];

function QuickStartSection() {
  const [selectedPackageManager, setSelectedPackageManager] = useState(0);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section id="quick-start-section" className="py-20 bg-gradient-to-b from-gray-900/50 to-black">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 flex flex-col"
          >
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Installation
            </h3>
            
            {/* Package Manager Tabs */}
            <div className="flex gap-2 mb-4">
              {packageManagers.map((pm, index) => (
                <button
                  key={pm.name}
                  onClick={() => setSelectedPackageManager(index)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    selectedPackageManager === index
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {pm.name}
                </button>
              ))}
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-6 relative group">
              <code className={`text-sm font-mono ${packageManagers[selectedPackageManager].color}`}>
                {packageManagers[selectedPackageManager].command}
              </code>
              <button
                onClick={() => copyToClipboard(packageManagers[selectedPackageManager].command)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                title="Copy to clipboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            <div className="text-gray-300 text-sm space-y-1 mt-auto">
              <p>✅ Zero dependencies • Works with React 16.8+</p>
              <p>✅ TypeScript ready • SSR compatible</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 flex flex-col"
          >
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Basic Usage
            </h3>
            <CodeBlock 
              code={`import { CustomCursor } from '@yhattav/react-component-cursor';

function App() {
  return (
    <CustomCursor>
      {/* Run wild! Any React component works */}
    </CustomCursor>

    <main>
      <h1>Welcome to my app!</h1>
    </main>
  );
}`}
              className="mb-6"
            />
            
            <div className="text-gray-300 text-sm space-y-1 mt-auto">
              <p>✅ Use any React component</p>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          {/* <div className="inline-flex items-center gap-6 px-6 py-3 bg-gray-800/30 rounded-full border border-gray-700">
            <span className="text-sm text-gray-300">Ready for production:</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-green-400">✓ SSR Support</span>
              <span className="text-blue-400">✓ TypeScript</span>
              <span className="text-purple-400">✓ {'<'}10KB</span>
              <span className="text-yellow-400">✓ 60fps</span>
            </div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}

export { QuickStartSection }; 