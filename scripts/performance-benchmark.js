#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Performance Benchmark Runner
 * 
 * This script runs comprehensive performance benchmarks and generates
 * metrics for CI/CD monitoring and performance regression detection.
 */

const BENCHMARK_CONFIG = {
  // Performance thresholds in milliseconds
  thresholds: {
    singleCursorRender: 50,
    multipleCursorsRender: 200,
    complexChildrenRender: 100,
    rapidUpdates: 100,
    memoryLeakLimit: 1024 * 1024, // 1MB
    bundleSize: 15 * 1024, // 15KB (more realistic threshold)
  },
  
  // Test repetitions for statistical accuracy
  repetitions: 5,
  
  // Memory test configurations
  memoryTests: {
    mountUnmountCycles: 20,
    rapidUpdateCycles: 100,
  }
};

class PerformanceBenchmark {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      environment: this.getEnvironmentInfo(),
      metrics: {},
      status: 'pending',
      passed: 0,
      failed: 0,
      warnings: [],
      errors: []
    };
  }

  getEnvironmentInfo() {
    return {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      cpu: require('os').cpus()[0]?.model || 'unknown',
      cores: require('os').cpus().length,
    };
  }

  async runBundleSizeAnalysis() {
    console.log('📦 Analyzing bundle size...');
    
    try {
      // Ensure build is up to date
      console.log('  Building library...');
      execSync('npm run build', { stdio: 'pipe' });
      
      const distPath = path.join(__dirname, '..', 'dist');
      const stats = {
        esm: this.getFileSize(path.join(distPath, 'index.mjs')),
        cjs: this.getFileSize(path.join(distPath, 'index.js')),
        types: this.getFileSize(path.join(distPath, 'index.d.ts')),
        esmDev: this.getFileSize(path.join(distPath, 'index.dev.mjs')),
        cjsDev: this.getFileSize(path.join(distPath, 'index.dev.js')),
        // Add gzipped sizes (most important for real-world usage)
        esmGzipped: this.getGzippedSize(path.join(distPath, 'index.mjs')),
        cjsGzipped: this.getGzippedSize(path.join(distPath, 'index.js')),
      };
      
      // Use the smaller of the two production bundles (what users actually download)
      const primaryBundleSize = Math.min(stats.esm, stats.cjs);
      const primaryGzippedSize = Math.min(stats.esmGzipped, stats.cjsGzipped);
      const bundleFormat = stats.esm <= stats.cjs ? 'ESM' : 'CJS';
      
      // Use realistic thresholds based on actual usage
      const minifiedThreshold = 8 * 1024; // 8KB minified (generous for this library)
      const gzippedThreshold = 3 * 1024;  // 3KB gzipped (realistic target)
      
      const minifiedPassed = primaryBundleSize <= minifiedThreshold;
      const gzippedPassed = primaryGzippedSize <= gzippedThreshold;
      const overallPassed = minifiedPassed && gzippedPassed;
      
      this.results.metrics.bundleSize = {
        formats: {
          esm: { 
            minified: stats.esm, 
            gzipped: stats.esmGzipped,
            dev: stats.esmDev 
          },
          cjs: { 
            minified: stats.cjs, 
            gzipped: stats.cjsGzipped,
            dev: stats.cjsDev 
          },
          types: stats.types
        },
        primary: {
          format: bundleFormat,
          minified: primaryBundleSize,
          gzipped: primaryGzippedSize
        },
        thresholds: {
          minified: minifiedThreshold,
          gzipped: gzippedThreshold
        },
        checks: {
          minified: minifiedPassed,
          gzipped: gzippedPassed,
          overall: overallPassed
        },
        // For backwards compatibility with dashboard
        total: primaryBundleSize,
        passed: overallPassed
      };
      
      if (overallPassed) {
        this.results.passed++;
        console.log(`  ✅ Bundle size (${bundleFormat}): ${(primaryBundleSize / 1024).toFixed(2)}KB minified, ${(primaryGzippedSize / 1024).toFixed(2)}KB gzipped`);
      } else {
        this.results.failed++;
        const issues = [];
        if (!minifiedPassed) issues.push(`minified ${(primaryBundleSize / 1024).toFixed(2)}KB > ${(minifiedThreshold / 1024).toFixed(2)}KB`);
        if (!gzippedPassed) issues.push(`gzipped ${(primaryGzippedSize / 1024).toFixed(2)}KB > ${(gzippedThreshold / 1024).toFixed(2)}KB`);
        this.results.errors.push(`Bundle size exceeded thresholds: ${issues.join(', ')}`);
        console.log(`  ❌ Bundle size thresholds exceeded: ${issues.join(', ')}`);
      }
      
    } catch (error) {
      this.results.failed++;
      this.results.errors.push(`Bundle analysis failed: ${error.message}`);
      console.error(`  ❌ Bundle analysis failed: ${error.message}`);
    }
  }

  getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch {
      return 0;
    }
  }

  getGzippedSize(filePath) {
    try {
      const { execSync } = require('child_process');
      const result = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' });
      return parseInt(result.trim(), 10);
    } catch {
      return 0;
    }
  }

  async runPerformanceTests() {
    console.log('🧪 Running performance tests...');
    
    try {
      // Run performance tests with detailed output
      const output = execSync('npm test -- --testPathPattern=performance.test.tsx --json', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Extract JSON from output (Jest may include extra output)
      const jsonStart = output.indexOf('{');
      const jsonEnd = output.lastIndexOf('}') + 1;
      const jsonString = output.slice(jsonStart, jsonEnd);
      
      // Parse Jest output
      const testResults = JSON.parse(jsonString);
      const perfTestSuite = testResults.testResults.find(suite => 
        suite.name.includes('performance.test.tsx')
      );
      
      if (perfTestSuite) {
        const passedTests = perfTestSuite.assertionResults.filter(test => test.status === 'passed').length;
        const failedTests = perfTestSuite.assertionResults.filter(test => test.status === 'failed').length;
        const totalTime = perfTestSuite.endTime - perfTestSuite.startTime;
        
        this.results.metrics.performanceTests = {
          passed: passedTests,
          failed: failedTests,
          total: passedTests + failedTests,
          executionTime: totalTime,
          averageTestTime: totalTime / (passedTests + failedTests),
          details: perfTestSuite.assertionResults.map(test => ({
            name: test.title,
            status: test.status,
            duration: test.duration || 0
          }))
        };
        
        this.results.passed += passedTests;
        this.results.failed += failedTests;
        
        console.log(`  ✅ Performance tests: ${passedTests}/${passedTests + failedTests} passed in ${totalTime}ms`);
        
        if (failedTests > 0) {
          this.results.errors.push(`${failedTests} performance tests failed`);
        }
      }
      
    } catch (error) {
      this.results.failed++;
      this.results.errors.push(`Performance tests failed: ${error.message}`);
      console.error(`  ❌ Performance tests failed: ${error.message}`);
    }
  }

  async runMemoryBenchmark() {
    console.log('🧠 Running memory benchmarks...');
    
    try {
      // Simulate memory-intensive operations
      const results = [];
      for (let i = 0; i < BENCHMARK_CONFIG.repetitions; i++) {
        const before = process.memoryUsage();
        
        // Run memory test (simulate component mount/unmount cycles)
        execSync('npm test -- --testNamePattern="does not leak memory" --silent', { stdio: 'pipe' });
        
        const after = process.memoryUsage();
        results.push({
          iteration: i + 1,
          heapUsedDelta: after.heapUsed - before.heapUsed,
          heapTotalDelta: after.heapTotal - before.heapTotal,
          externalDelta: after.external - before.external
        });
      }
      
      const avgHeapDelta = results.reduce((sum, r) => sum + r.heapUsedDelta, 0) / results.length;
      const maxHeapDelta = Math.max(...results.map(r => r.heapUsedDelta));
      const memoryEfficient = maxHeapDelta <= BENCHMARK_CONFIG.thresholds.memoryLeakLimit;
      
      this.results.metrics.memory = {
        iterations: BENCHMARK_CONFIG.repetitions,
        averageHeapDelta: avgHeapDelta,
        maxHeapDelta: maxHeapDelta,
        threshold: BENCHMARK_CONFIG.thresholds.memoryLeakLimit,
        passed: memoryEfficient,
        details: results
      };
      
      if (memoryEfficient) {
        this.results.passed++;
        console.log(`  ✅ Memory usage: max ${(maxHeapDelta / 1024 / 1024).toFixed(2)}MB delta (threshold: ${(BENCHMARK_CONFIG.thresholds.memoryLeakLimit / 1024 / 1024).toFixed(2)}MB)`);
      } else {
        this.results.failed++;
        this.results.errors.push(`Memory usage ${(maxHeapDelta / 1024 / 1024).toFixed(2)}MB exceeds threshold`);
        console.log(`  ❌ Memory usage exceeds threshold`);
      }
      
    } catch (error) {
      this.results.failed++;
      this.results.errors.push(`Memory benchmark failed: ${error.message}`);
      console.error(`  ❌ Memory benchmark failed: ${error.message}`);
    }
  }

  async runRenderPerformanceBenchmark() {
    console.log('⚡ Running render performance benchmarks...');
    
    try {
      // Run specific render performance tests
      const renderTests = [
        'renders within acceptable time limits',
        'handles multiple cursors efficiently', 
        'renders with complex children efficiently'
      ];
      
      const results = {};
      
      for (const testName of renderTests) {
        try {
          const startTime = Date.now();
          execSync(`npm test -- --testPathPattern=performance.test.tsx --testNamePattern="${testName}" --silent`, { 
            stdio: 'pipe' 
          });
          const endTime = Date.now();
          
          results[testName] = {
            executionTime: endTime - startTime,
            status: 'passed'
          };
        } catch (error) {
          results[testName] = {
            executionTime: null,
            status: 'failed',
            error: error.message
          };
        }
      }
      
      const passedRenderTests = Object.values(results).filter(r => r.status === 'passed').length;
      const totalRenderTests = Object.keys(results).length;
      
      this.results.metrics.renderPerformance = {
        tests: results,
        passed: passedRenderTests,
        total: totalRenderTests,
        passRate: (passedRenderTests / totalRenderTests * 100).toFixed(2)
      };
      
      this.results.passed += passedRenderTests;
      this.results.failed += (totalRenderTests - passedRenderTests);
      
      console.log(`  ✅ Render performance: ${passedRenderTests}/${totalRenderTests} tests passed`);
      
    } catch (error) {
      this.results.failed++;
      this.results.errors.push(`Render performance benchmark failed: ${error.message}`);
      console.error(`  ❌ Render performance benchmark failed: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n📊 Performance Benchmark Report');
    console.log('='.repeat(50));
    
    const totalTests = this.results.passed + this.results.failed;
    const passRate = totalTests > 0 ? (this.results.passed / totalTests * 100).toFixed(2) : 0;
    
    console.log(`📈 Overall: ${this.results.passed}/${totalTests} tests passed (${passRate}%)`);
    console.log(`⏱️  Timestamp: ${this.results.timestamp}`);
    console.log(`🖥️  Environment: ${this.results.environment.platform} ${this.results.environment.arch}`);
    console.log(`🔧 Node.js: ${this.results.environment.node}`);
    
    // Bundle size report
    if (this.results.metrics.bundleSize) {
      const bs = this.results.metrics.bundleSize;
      console.log(`\n📦 Bundle Size:`);
      if (bs.primary) {
        console.log(`   Primary (${bs.primary.format}): ${(bs.primary.minified / 1024).toFixed(2)}KB minified, ${(bs.primary.gzipped / 1024).toFixed(2)}KB gzipped`);
        console.log(`   Targets: <${(bs.thresholds.minified / 1024).toFixed(2)}KB minified, <${(bs.thresholds.gzipped / 1024).toFixed(2)}KB gzipped`);
      } else {
        // Fallback for old format
        console.log(`   Total: ${(bs.total / 1024).toFixed(2)}KB`);
      }
    }
    
    // Memory report
    if (this.results.metrics.memory) {
      const mem = this.results.metrics.memory;
      console.log(`\n🧠 Memory Performance:`);
      console.log(`   Max heap delta: ${(mem.maxHeapDelta / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   Avg heap delta: ${(mem.averageHeapDelta / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Render performance report
    if (this.results.metrics.renderPerformance) {
      const rp = this.results.metrics.renderPerformance;
      console.log(`\n⚡ Render Performance:`);
      console.log(`   Pass rate: ${rp.passRate}%`);
    }
    
    // Errors and warnings
    if (this.results.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      this.results.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      this.results.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    // Set final status
    this.results.status = this.results.failed === 0 ? 'passed' : 'failed';
    
    return this.results;
  }

  async saveResults() {
    const resultsDir = path.join(__dirname, '..', 'performance-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const fileName = `benchmark-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(resultsDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(this.results, null, 2));
    
    // Also save as latest.json for easy access
    const latestPath = path.join(resultsDir, 'latest.json');
    fs.writeFileSync(latestPath, JSON.stringify(this.results, null, 2));
    
    console.log(`\n💾 Results saved to: ${filePath}`);
    return filePath;
  }

  async run() {
    console.log('🚀 Starting Performance Benchmark Suite\n');
    
    await this.runBundleSizeAnalysis();
    await this.runPerformanceTests();
    await this.runMemoryBenchmark();
    await this.runRenderPerformanceBenchmark();
    
    const report = this.generateReport();
    await this.saveResults();
    
    console.log('\n🏁 Benchmark complete!');
    
    // Exit with error code if any tests failed
    if (this.results.failed > 0) {
      process.exit(1);
    }
    
    return report;
  }
}

// CLI execution
if (require.main === module) {
  const benchmark = new PerformanceBenchmark();
  benchmark.run().catch(error => {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  });
}

module.exports = { PerformanceBenchmark, BENCHMARK_CONFIG }; 