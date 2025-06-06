#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

/**
 * Performance Monitor
 * 
 * Tracks performance metrics over time and detects regressions
 * Generates historical reports and trend analysis
 */

class PerformanceMonitor {
  constructor() {
    this.resultsDir = path.join(__dirname, '..', 'performance-results');
    this.historyFile = path.join(this.resultsDir, 'history.json');
    this.baselineFile = path.join(this.resultsDir, 'baseline.json');
  }

  loadHistory() {
    try {
      if (fs.existsSync(this.historyFile)) {
        return JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
      }
    } catch (error) {
      console.warn('Warning: Could not load performance history:', error.message);
    }
    return { results: [], created: new Date().toISOString() };
  }

  loadBaseline() {
    try {
      if (fs.existsSync(this.baselineFile)) {
        return JSON.parse(fs.readFileSync(this.baselineFile, 'utf8'));
      }
    } catch (error) {
      console.warn('Warning: Could not load performance baseline:', error.message);
    }
    return null;
  }

  saveHistory(history) {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
    fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
  }

  saveBaseline(baseline) {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
    fs.writeFileSync(this.baselineFile, JSON.stringify(baseline, null, 2));
  }

  addResult(result) {
    const history = this.loadHistory();
    history.results.push({
      ...result,
      id: this.generateId(),
      addedAt: new Date().toISOString()
    });
    
    // Keep only last 100 results to prevent file from growing too large
    if (history.results.length > 100) {
      history.results = history.results.slice(-100);
    }
    
    this.saveHistory(history);
    return history;
  }

  generateId() {
    return `perf_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  detectRegressions(newResult, baseline = null) {
    const regressions = [];
    const improvements = [];
    
    baseline = baseline || this.loadBaseline();
    
    if (!baseline) {
      return { regressions: [], improvements: [], hasBaseline: false };
    }

    // Check bundle size regression
    if (newResult.metrics.bundleSize && baseline.metrics.bundleSize) {
      const newSize = newResult.metrics.bundleSize.total;
      const baselineSize = baseline.metrics.bundleSize.total;
      const increase = newSize - baselineSize;
      const increasePercent = (increase / baselineSize * 100).toFixed(2);
      
      if (increase > 1024) { // More than 1KB increase
        regressions.push({
          type: 'bundleSize',
          metric: 'total',
          current: newSize,
          baseline: baselineSize,
          change: increase,
          changePercent: increasePercent,
          severity: increase > 2048 ? 'high' : 'medium'
        });
      } else if (increase < -512) { // More than 0.5KB decrease
        improvements.push({
          type: 'bundleSize',
          metric: 'total',
          current: newSize,
          baseline: baselineSize,
          change: increase,
          changePercent: increasePercent
        });
      }
    }

    // Check memory regression
    if (newResult.metrics.memory && baseline.metrics.memory) {
      const newMemory = newResult.metrics.memory.maxHeapDelta;
      const baselineMemory = baseline.metrics.memory.maxHeapDelta;
      const increase = newMemory - baselineMemory;
      const increasePercent = (increase / baselineMemory * 100).toFixed(2);
      
      if (increase > 512 * 1024) { // More than 512KB increase
        regressions.push({
          type: 'memory',
          metric: 'maxHeapDelta',
          current: newMemory,
          baseline: baselineMemory,
          change: increase,
          changePercent: increasePercent,
          severity: increase > 1024 * 1024 ? 'high' : 'medium'
        });
      } else if (increase < -256 * 1024) { // More than 256KB decrease
        improvements.push({
          type: 'memory',
          metric: 'maxHeapDelta',
          current: newMemory,
          baseline: baselineMemory,
          change: increase,
          changePercent: increasePercent
        });
      }
    }

    // Check render performance regression
    if (newResult.metrics.renderPerformance && baseline.metrics.renderPerformance) {
      const newPassRate = parseFloat(newResult.metrics.renderPerformance.passRate);
      const baselinePassRate = parseFloat(baseline.metrics.renderPerformance.passRate);
      const decrease = newPassRate - baselinePassRate;
      
      if (decrease < -5) { // More than 5% decrease in pass rate
        regressions.push({
          type: 'renderPerformance',
          metric: 'passRate',
          current: newPassRate,
          baseline: baselinePassRate,
          change: decrease,
          changePercent: decrease.toFixed(2),
          severity: decrease < -10 ? 'high' : 'medium'
        });
      } else if (decrease > 2) { // More than 2% improvement
        improvements.push({
          type: 'renderPerformance',
          metric: 'passRate',
          current: newPassRate,
          baseline: baselinePassRate,
          change: decrease,
          changePercent: decrease.toFixed(2)
        });
      }
    }

    return { regressions, improvements, hasBaseline: true };
  }

  generateTrendReport(numResults = 10) {
    const history = this.loadHistory();
    const recentResults = history.results.slice(-numResults);
    
    if (recentResults.length < 2) {
      return { trend: 'insufficient_data', analysis: 'Need at least 2 results for trend analysis' };
    }

    const trends = {
      bundleSize: this.calculateTrend(recentResults, 'metrics.bundleSize.total'),
      memory: this.calculateTrend(recentResults, 'metrics.memory.maxHeapDelta'),
      renderPerformance: this.calculateTrend(recentResults, 'metrics.renderPerformance.passRate'),
      overallHealth: 'stable'
    };

    // Determine overall health
    const negativeFields = ['bundleSize', 'memory'];
    const positiveFields = ['renderPerformance'];
    
    let healthScore = 0;
    negativeFields.forEach(field => {
      if (trends[field] === 'improving') healthScore += 1;
      if (trends[field] === 'degrading') healthScore -= 1;
    });
    
    positiveFields.forEach(field => {
      if (trends[field] === 'improving') healthScore += 1;
      if (trends[field] === 'degrading') healthScore -= 1;
    });

    if (healthScore > 0) trends.overallHealth = 'improving';
    else if (healthScore < 0) trends.overallHealth = 'degrading';
    
    return {
      trends,
      analysis: this.generateTrendAnalysis(trends),
      dataPoints: recentResults.length,
      timespan: {
        from: recentResults[0].timestamp,
        to: recentResults[recentResults.length - 1].timestamp
      }
    };
  }

  calculateTrend(results, path) {
    const values = results.map(result => this.getNestedValue(result, path)).filter(v => v !== null);
    
    if (values.length < 2) return 'insufficient_data';
    
    const first = values[0];
    const last = values[values.length - 1];
    const change = (last - first) / first;
    
    if (Math.abs(change) < 0.05) return 'stable'; // Less than 5% change
    return change > 0 ? 'increasing' : 'decreasing';
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  generateTrendAnalysis(trends) {
    const analysis = [];
    
    if (trends.bundleSize === 'increasing') {
      analysis.push('⚠️ Bundle size is trending upward - consider code optimization');
    } else if (trends.bundleSize === 'decreasing') {
      analysis.push('✅ Bundle size is improving - good optimization work');
    }
    
    if (trends.memory === 'increasing') {
      analysis.push('⚠️ Memory usage is trending upward - check for potential leaks');
    } else if (trends.memory === 'decreasing') {
      analysis.push('✅ Memory usage is improving - efficient memory management');
    }
    
    if (trends.renderPerformance === 'decreasing') {
      analysis.push('⚠️ Render performance is declining - investigate performance bottlenecks');
    } else if (trends.renderPerformance === 'increasing') {
      analysis.push('✅ Render performance is improving - good optimization');
    }
    
    if (trends.overallHealth === 'improving') {
      analysis.push('📈 Overall performance is trending positively');
    } else if (trends.overallHealth === 'degrading') {
      analysis.push('📉 Overall performance needs attention');
    } else {
      analysis.push('📊 Performance is stable');
    }
    
    return analysis.length > 0 ? analysis : ['No significant trends detected'];
  }

  setBaseline(result) {
    this.saveBaseline({
      ...result,
      setAt: new Date().toISOString(),
      description: 'Performance baseline'
    });
    
    console.log('✅ Performance baseline set successfully');
    return true;
  }

  generateReport(result) {
    console.log('\n📊 Performance Monitoring Report');
    console.log('='.repeat(50));
    
    // Regression analysis
    const { regressions, improvements, hasBaseline } = this.detectRegressions(result);
    
    if (hasBaseline) {
      console.log(`\n🔍 Regression Analysis:`);
      
      if (regressions.length > 0) {
        console.log('  ❌ Regressions detected:');
        regressions.forEach(reg => {
          const changeStr = reg.type === 'bundleSize' ? 
            `${(reg.change / 1024).toFixed(2)}KB (${reg.changePercent}%)` :
            reg.type === 'memory' ?
            `${(reg.change / 1024 / 1024).toFixed(2)}MB (${reg.changePercent}%)` :
            `${reg.changePercent}%`;
          
          console.log(`     • ${reg.type}.${reg.metric}: +${changeStr} [${reg.severity}]`);
        });
      }
      
      if (improvements.length > 0) {
        console.log('  ✅ Improvements detected:');
        improvements.forEach(imp => {
          const changeStr = imp.type === 'bundleSize' ? 
            `${Math.abs(imp.change / 1024).toFixed(2)}KB (${Math.abs(imp.changePercent)}%)` :
            imp.type === 'memory' ?
            `${Math.abs(imp.change / 1024 / 1024).toFixed(2)}MB (${Math.abs(imp.changePercent)}%)` :
            `${Math.abs(imp.changePercent)}%`;
          
          console.log(`     • ${imp.type}.${imp.metric}: -${changeStr}`);
        });
      }
      
      if (regressions.length === 0 && improvements.length === 0) {
        console.log('  📊 No significant changes detected');
      }
    } else {
      console.log('\n🔍 No baseline set - use --set-baseline to establish baseline metrics');
    }
    
    // Trend analysis
    const trendReport = this.generateTrendReport();
    console.log(`\n📈 Trend Analysis (last ${trendReport.dataPoints} results):`);
    
    if (trendReport.analysis) {
      trendReport.analysis.forEach(item => console.log(`  ${item}`));
    }
    
    return {
      regressions,
      improvements,
      trends: trendReport,
      hasBaseline
    };
  }

  async monitor(latestResultPath) {
    try {
      // Load the latest benchmark result
      const latestResult = JSON.parse(fs.readFileSync(latestResultPath, 'utf8'));
      
      // Add to history
      this.addResult(latestResult);
      
      // Generate monitoring report
      const report = this.generateReport(latestResult);
      
      // Check if we need to fail due to regressions
      const highSeverityRegressions = report.regressions.filter(r => r.severity === 'high');
      
      if (highSeverityRegressions.length > 0) {
        console.log('\n❌ Critical performance regressions detected!');
        process.exit(1);
      }
      
      console.log('\n✅ Performance monitoring complete');
      return report;
      
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI handling
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  const args = process.argv.slice(2);
  
  if (args.includes('--set-baseline')) {
    const latestPath = path.join(__dirname, '..', 'performance-results', 'latest.json');
    if (fs.existsSync(latestPath)) {
      const latest = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
      monitor.setBaseline(latest);
    } else {
      console.error('❌ No latest benchmark result found. Run performance-benchmark first.');
      process.exit(1);
    }
  } else {
    const latestPath = path.join(__dirname, '..', 'performance-results', 'latest.json');
    if (fs.existsSync(latestPath)) {
      monitor.monitor(latestPath);
    } else {
      console.error('❌ No latest benchmark result found. Run performance-benchmark first.');
      process.exit(1);
    }
  }
}

module.exports = { PerformanceMonitor }; 