#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Performance Dashboard Generator
 * 
 * Creates visual charts and HTML dashboard from performance data
 * Generates GitHub Pages-compatible dashboard with trend visualizations
 */

class PerformanceDashboard {
  constructor() {
    this.resultsDir = path.join(__dirname, '..', 'performance-results');
    this.dashboardDir = path.join(__dirname, '..', 'docs');
    this.historyFile = path.join(this.resultsDir, 'history.json');
  }

  loadHistory() {
    try {
      if (fs.existsSync(this.historyFile)) {
        return JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
      }
    } catch (error) {
      console.warn('Warning: Could not load performance history:', error.message);
    }
    return { results: [] };
  }

  ensureDashboardDir() {
    if (!fs.existsSync(this.dashboardDir)) {
      fs.mkdirSync(this.dashboardDir, { recursive: true });
    }
  }

  generateChartData() {
    const history = this.loadHistory();
    const results = history.results || [];
    
    if (results.length === 0) {
      return null;
    }

    // Prepare data for charts
    const chartData = {
      timestamps: [],
      bundleSizes: [],
      memoryUsage: [],
      renderPerformance: [],
      testCounts: []
    };

    results.forEach(result => {
      const timestamp = new Date(result.timestamp).toLocaleDateString();
      chartData.timestamps.push(timestamp);
      
      // Bundle size data (use primary bundle size for more accurate reporting)
      const bundleSize = result.metrics?.bundleSize?.primary?.minified || result.metrics?.bundleSize?.total || 0;
      chartData.bundleSizes.push((bundleSize / 1024).toFixed(2)); // Convert to KB
      
      // Memory usage data  
      const memoryUsage = result.metrics?.memory?.maxHeapDelta || 0;
      chartData.memoryUsage.push((memoryUsage / 1024 / 1024).toFixed(2)); // Convert to MB
      
      // Render performance data
      const renderPerf = parseFloat(result.metrics?.renderPerformance?.passRate || 100);
      chartData.renderPerformance.push(renderPerf);
      
      // Test counts
      const testCount = result.passed || 0;
      chartData.testCounts.push(testCount);
    });

    return chartData;
  }

  generateHTML(chartData) {
    const latestResult = this.loadHistory().results?.slice(-1)[0];
    const timestamp = latestResult ? new Date(latestResult.timestamp).toLocaleString() : 'N/A';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Component Cursor - Performance Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f6f8fa;
            color: #24292f;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 1px solid #d1d9e0;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #0969da;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            color: #656d76;
            font-size: 1.1em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: #f6f8fa;
            border-radius: 6px;
            padding: 20px;
            text-align: center;
            border: 1px solid #d1d9e0;
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #0969da;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #656d76;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .chart-container {
            background: white;
            border: 1px solid #d1d9e0;
            border-radius: 6px;
            padding: 20px;
            height: 400px;
            position: relative;
        }
        .chart-container canvas {
            max-height: 350px !important;
            height: 350px !important;
        }
        .chart-title {
            font-size: 1.2em;
            font-weight: 600;
            margin-bottom: 15px;
            color: #24292f;
        }
        .status-good { color: #1a7f37; }
        .status-warning { color: #bf8700; }
        .status-error { color: #d1242f; }
        .footer {
            text-align: center;
            color: #656d76;
            font-size: 0.9em;
            border-top: 1px solid #d1d9e0;
            padding-top: 20px;
        }
        .github-link {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            background: #24292f;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
        }
        .github-link:hover {
            background: #32383f;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Performance Dashboard</h1>
            <p>React Component Cursor Library Performance Monitoring</p>
            <p><strong>Last Updated:</strong> ${timestamp}</p>
            <a href="https://github.com/yhattav/react-component-cursor" class="github-link">View on GitHub</a>
        </div>

        ${chartData ? this.generateStatsSection(chartData) : '<p>No performance data available yet.</p>'}
        
        ${chartData ? this.generateChartsSection(chartData) : ''}
        
        <div class="footer">
            <p>🚀 Automatically generated from CI/CD performance benchmarks</p>
            <p>Data updates on every push to main branch</p>
        </div>
    </div>

    ${chartData ? this.generateChartScripts(chartData) : ''}
</body>
</html>`;
  }

  generateStatsSection(chartData) {
    if (!chartData || chartData.bundleSizes.length === 0) return '';
    
    const latest = chartData.bundleSizes.length - 1;
    const currentBundleSize = chartData.bundleSizes[latest];
    const currentMemory = chartData.memoryUsage[latest];
    const currentPerformance = chartData.renderPerformance[latest];
    const currentTests = chartData.testCounts[latest];
    
    const bundleStatus = currentBundleSize < 8 ? 'status-good' : currentBundleSize < 12 ? 'status-warning' : 'status-error';
    const memoryStatus = currentMemory < 1 ? 'status-good' : currentMemory < 5 ? 'status-warning' : 'status-error';
    const perfStatus = currentPerformance >= 95 ? 'status-good' : currentPerformance >= 80 ? 'status-warning' : 'status-error';
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value ${bundleStatus}">${currentBundleSize} KB</div>
                <div class="stat-label">Bundle Size</div>
            </div>
            <div class="stat-card">
                <div class="stat-value ${memoryStatus}">${currentMemory} MB</div>
                <div class="stat-label">Memory Usage</div>
            </div>
            <div class="stat-card">
                <div class="stat-value ${perfStatus}">${currentPerformance}%</div>
                <div class="stat-label">Test Pass Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value status-good">${currentTests}</div>
                <div class="stat-label">Tests Passing</div>
            </div>
        </div>`;
  }

  generateChartsSection(chartData) {
    if (!chartData || chartData.bundleSizes.length === 0) return '';
    
    return `
        <div class="charts-grid">
            <div class="chart-container">
                <div class="chart-title">Bundle Size Trend</div>
                <canvas id="bundleSizeChart" width="400" height="200"></canvas>
            </div>
            <div class="chart-container">
                <div class="chart-title">Memory Usage Trend</div>
                <canvas id="memoryChart" width="400" height="200"></canvas>
            </div>
            <div class="chart-container">
                <div class="chart-title">Test Performance Trend</div>
                <canvas id="performanceChart" width="400" height="200"></canvas>
            </div>
            <div class="chart-container">
                <div class="chart-title">Passing Tests Count</div>
                <canvas id="testsChart" width="400" height="200"></canvas>
            </div>
        </div>`;
  }

  generateChartScripts(chartData) {
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      layout: {
        padding: 10
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f6f8fa' }
        },
        x: {
          grid: { color: '#f6f8fa' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    };

    return `
    <script>
        // Bundle Size Chart
        new Chart(document.getElementById('bundleSizeChart'), {
            type: 'line',
            data: {
                labels: ${JSON.stringify(chartData.timestamps)},
                datasets: [{
                    data: ${JSON.stringify(chartData.bundleSizes)},
                    borderColor: '#0969da',
                    backgroundColor: 'rgba(9, 105, 218, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...${JSON.stringify(commonOptions)},
                scales: {
                    ...${JSON.stringify(commonOptions.scales)},
                    y: {
                        ...${JSON.stringify(commonOptions.scales.y)},
                        title: { display: true, text: 'Size (KB)' }
                    }
                }
            }
        });

        // Memory Usage Chart
        new Chart(document.getElementById('memoryChart'), {
            type: 'line',
            data: {
                labels: ${JSON.stringify(chartData.timestamps)},
                datasets: [{
                    data: ${JSON.stringify(chartData.memoryUsage)},
                    borderColor: '#8250df',
                    backgroundColor: 'rgba(130, 80, 223, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...${JSON.stringify(commonOptions)},
                scales: {
                    ...${JSON.stringify(commonOptions.scales)},
                    y: {
                        ...${JSON.stringify(commonOptions.scales.y)},
                        title: { display: true, text: 'Memory (MB)' }
                    }
                }
            }
        });

        // Performance Chart
        new Chart(document.getElementById('performanceChart'), {
            type: 'line',
            data: {
                labels: ${JSON.stringify(chartData.timestamps)},
                datasets: [{
                    data: ${JSON.stringify(chartData.renderPerformance)},
                    borderColor: '#1a7f37',
                    backgroundColor: 'rgba(26, 127, 55, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                ...${JSON.stringify(commonOptions)},
                scales: {
                    ...${JSON.stringify(commonOptions.scales)},
                    y: {
                        ...${JSON.stringify(commonOptions.scales.y)},
                        min: 0,
                        max: 100,
                        title: { display: true, text: 'Pass Rate (%)' }
                    }
                }
            }
        });

        // Tests Count Chart
        new Chart(document.getElementById('testsChart'), {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(chartData.timestamps)},
                datasets: [{
                    data: ${JSON.stringify(chartData.testCounts)},
                    backgroundColor: 'rgba(26, 127, 55, 0.8)',
                    borderColor: '#1a7f37',
                    borderWidth: 1
                }]
            },
            options: {
                ...${JSON.stringify(commonOptions)},
                scales: {
                    ...${JSON.stringify(commonOptions.scales)},
                    y: {
                        ...${JSON.stringify(commonOptions.scales.y)},
                        title: { display: true, text: 'Tests Passing' }
                    }
                }
            }
        });
    </script>`;
  }

  async generate() {
    console.log('📊 Generating Performance Dashboard...');
    
    this.ensureDashboardDir();
    
    const chartData = this.generateChartData();
    if (!chartData) {
      console.log('⚠️  No performance data available for dashboard generation');
      return false;
    }
    
    const html = this.generateHTML(chartData);
    const dashboardPath = path.join(this.dashboardDir, 'index.html');
    
    fs.writeFileSync(dashboardPath, html);
    
    console.log(`✅ Dashboard generated: ${dashboardPath}`);
    console.log(`📈 Data points: ${chartData.timestamps.length}`);
    console.log(`🔗 View locally: file://${dashboardPath}`);
    
    return true;
  }
}

// CLI execution
if (require.main === module) {
  const dashboard = new PerformanceDashboard();
  dashboard.generate().catch(error => {
    console.error('❌ Dashboard generation failed:', error);
    process.exit(1);
  });
}

module.exports = { PerformanceDashboard }; 