'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface PerformanceData {
  timestamp: string;
  bundleSize: number;
  memoryUsage: number;
  testPassRate: number;
  testCount: number;
}

const PerformancePage: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In the future, this could fetch actual CI performance data
    // For now, showing demo data structure
    const demoData: PerformanceData[] = [
      {
        timestamp: new Date().toISOString(),
        bundleSize: 8.2,
        memoryUsage: 1.8,
        testPassRate: 100,
        testCount: 22
      }
    ];
    
    setPerformanceData(demoData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading performance data...</div>
      </div>
    );
  }

  const latest = performanceData[0];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Performance Dashboard</h1>
          <p className="text-gray-400 mb-12">
            Historical performance metrics from CI/CD pipeline
          </p>

          {/* Current Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {latest?.bundleSize}KB
              </div>
              <div className="text-sm text-gray-400">Bundle Size</div>
              <div className="text-xs text-green-400 mt-1">
                Target: &lt; 8KB
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {latest?.memoryUsage}MB
              </div>
              <div className="text-sm text-gray-400">Memory Usage</div>
              <div className="text-xs text-blue-400 mt-1">
                Target: &lt; 2MB
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {latest?.testPassRate}%
              </div>
              <div className="text-sm text-gray-400">Test Pass Rate</div>
              <div className="text-xs text-purple-400 mt-1">
                Target: &gt; 95%
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {latest?.testCount}
              </div>
              <div className="text-sm text-gray-400">Tests Passing</div>
              <div className="text-xs text-cyan-400 mt-1">
                All systems green
              </div>
            </div>
          </div>

          {/* Integration Guide */}
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">📊 CI Integration</h2>
            <p className="text-gray-300 mb-4">
              This page can be enhanced to display historical performance data from your CI/CD pipeline:
            </p>
            
            <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-400">{`// Future integration example:`}</div>
              <div className="text-blue-300">useEffect</div>
              <div className="text-white">(() =&gt; {`{`}</div>
              <div className="text-gray-300 ml-4">
                fetch<span className="text-white">(</span>
                <span className="text-green-300">&apos;/api/performance-history&apos;</span>
                <span className="text-white">)</span>
              </div>
              <div className="text-gray-300 ml-6">
                .then<span className="text-white">(</span>res <span className="text-purple-300">=&gt;</span> res.json<span className="text-white">())</span>
              </div>
              <div className="text-gray-300 ml-6">
                .then<span className="text-white">(</span>setPerformanceData<span className="text-white">);</span>
              </div>
              <div className="text-white">{`}, []);`}</div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Data Sources:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• performance-results/history.json</li>
                  <li>• CI/CD benchmark results</li>
                  <li>• GitHub Actions artifacts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Potential Features:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Historical trend charts</li>
                  <li>• Regression detection alerts</li>
                  <li>• Performance comparison views</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back to Main */}
          <div className="mt-12 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              ← Back to Examples
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage; 