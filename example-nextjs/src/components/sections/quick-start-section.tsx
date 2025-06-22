import React from 'react';
import { motion } from 'framer-motion';

function QuickStartSection() {
  return (
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
  );
}

export { QuickStartSection }; 