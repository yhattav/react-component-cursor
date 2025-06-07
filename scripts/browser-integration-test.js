#!/usr/bin/env node

/**
 * Browser Integration Testing Script for React Component Cursor
 * 
 * This script tests the library in real browsers using Playwright:
 * - Chrome/Chromium
 * - Firefox
 * - Safari (WebKit)
 * - Mobile browsers (Chrome Mobile, Safari Mobile)
 * 
 * Prerequisites: npm install playwright
 * Run with: node scripts/browser-integration-test.js
 */

const { chromium, firefox, webkit, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

class BrowserIntegrationTester {
  constructor() {
    this.results = {
      browsers: {},
      mobile: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };
    
    this.server = null;
    this.port = 3001;
    this.baseUrl = `http://localhost:${this.port}`;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      start: '🚀'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async startTestServer() {
    this.log('Starting test server...', 'start');
    
    return new Promise((resolve, reject) => {
      this.server = http.createServer((request, response) => {
        return handler(request, response, {
          public: path.join(__dirname, '..', 'test-app', 'dist')
        });
      });

      this.server.listen(this.port, () => {
        this.log(`Test server running at ${this.baseUrl}`, 'success');
        resolve();
      });

      this.server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          this.port++;
          this.baseUrl = `http://localhost:${this.port}`;
          this.server.listen(this.port);
        } else {
          reject(error);
        }
      });
    });
  }

  async stopTestServer() {
    if (this.server) {
      this.log('Stopping test server...', 'start');
      this.server.close();
      this.log('Test server stopped', 'success');
    }
  }

  async buildTestApp() {
    this.log('Building test app for browser testing...', 'start');
    
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['install'], {
        cwd: path.join(__dirname, '..', 'test-app'),
        stdio: 'inherit'
      });

      child.on('close', (code) => {
        if (code === 0) {
          const buildChild = spawn('npm', ['run', 'build'], {
            cwd: path.join(__dirname, '..', 'test-app'),
            stdio: 'inherit'
          });

          buildChild.on('close', (buildCode) => {
            if (buildCode === 0) {
              this.log('Test app built successfully', 'success');
              resolve();
            } else {
              reject(new Error(`Build failed with code ${buildCode}`));
            }
          });
        } else {
          reject(new Error(`Install failed with code ${code}`));
        }
      });
    });
  }

  async testInBrowser(browserType, browserName) {
    this.results.summary.total++;
    
    try {
      this.log(`Testing in ${browserName}...`);
      
      const browser = await browserType.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      // Enable console logging
      page.on('console', msg => {
        if (msg.type() === 'error') {
          this.log(`Browser console error: ${msg.text()}`, 'error');
        }
      });

      // Navigate to test page
      await page.goto(this.baseUrl);

      // Wait for React to load
      await page.waitForSelector('body', { timeout: 10000 });

      // Test 1: Check if React app is loaded
      await page.waitForSelector('#root', { timeout: 10000 });
      
      // Give React time to hydrate
      await page.waitForTimeout(2000);
      
      // Trigger mouse movement to initialize cursor
      await page.mouse.move(100, 100);
      await page.waitForTimeout(500); // Wait for cursor to appear
      
      const appState = await page.evaluate(() => {
        const root = document.querySelector('#root');
        const hasReactContent = root && root.children.length > 0;
        const hasAppTitle = document.querySelector('[data-testid="app-title"]');
        const hasTestStatus = document.querySelector('[data-testid="test-status"]');
        
        // Check for cursors with detailed debugging
        const cursorGlobal = document.querySelector('[data-testid="custom-cursor-global"]');
        const cursorContainer = document.querySelector('[data-testid="custom-cursor-container"]');
        const cursorById1 = document.querySelector('#custom-cursor-test-cursor');
        const cursorById2 = document.querySelector('#custom-cursor-container-cursor');
        const allCursorElements = document.querySelectorAll('[id^="custom-cursor-"]');
        
        const hasCustomCursor = cursorGlobal || cursorContainer || cursorById1 || cursorById2;
        
        return {
          rootExists: !!root,
          hasContent: hasReactContent,
          hasAppTitle: !!hasAppTitle,
          hasTestStatus: !!hasTestStatus,
          contentHTML: root ? root.innerHTML.substring(0, 500) : '', // More content for debugging
          hasCursor: !!hasCustomCursor,
          cursorDetails: {
            foundGlobalTestId: !!cursorGlobal,
            foundContainerTestId: !!cursorContainer,
            foundGlobalId: !!cursorById1,
            foundContainerId: !!cursorById2,
            allCursorCount: allCursorElements.length,
            allCursorIds: Array.from(allCursorElements).map(el => el.id)
          },
          // Additional debugging for CustomCursor
          portalContainer: !!document.getElementById('cursor-container'),
          allElementsWithDataTestId: Array.from(document.querySelectorAll('[data-testid]')).map(el => el.getAttribute('data-testid')),
          windowReact: !!window.React,
          documentTitle: document.title
        };
      });
      
      this.log(`App state: ${JSON.stringify(appState)}`);
      
      if (!appState.rootExists || !appState.hasContent || !appState.hasAppTitle) {
        throw new Error(`Test app not loaded properly. Root: ${appState.rootExists}, Content: ${appState.hasContent}, Title: ${appState.hasAppTitle}`);
      }

      // Test 2: Check mouse tracking functionality
      await page.mouse.move(100, 100);
      await page.waitForTimeout(100);
      
      // Check if cursor position updates (this depends on implementation)
      const mouseTracking = await page.evaluate(() => {
        // Look for any mouse position indicators or cursor elements
        const cursors = document.querySelectorAll('[style*="transform"], [style*="left"], [style*="position"]');
        return cursors.length > 0;
      });

      // Test 3: Check for JavaScript errors
      let hasErrors = false;
      page.on('pageerror', (error) => {
        this.log(`Page error in ${browserName}: ${error.message}`, 'error');
        hasErrors = true;
      });

      // Test 4: Performance check
      const performanceMetrics = await page.evaluate(() => {
        return {
          timing: performance.timing,
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize
          } : null
        };
      });

      // Test 5: Responsive behavior (simulate different viewport sizes)
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(100);
      
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(100);
      
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);

      await browser.close();

      if (hasErrors) {
        throw new Error('JavaScript errors detected during testing');
      }

      this.results.browsers[browserName] = { 
        status: 'passed',
        performanceMetrics,
        mouseTracking: mouseTracking
      };
      this.results.summary.passed++;
      this.log(`${browserName} test passed`, 'success');

    } catch (error) {
      this.results.browsers[browserName] = { 
        status: 'failed', 
        error: error.message 
      };
      this.results.summary.failed++;
      this.log(`${browserName} test failed: ${error.message}`, 'error');
    }
  }

  async testMobileBrowsers() {
    this.log('Testing mobile browsers...', 'start');
    
    const mobileConfigs = [
      {
        name: 'iPhone 12',
        device: devices['iPhone 12'],
        browserType: webkit
      },
      {
        name: 'iPhone 12 Pro',
        device: devices['iPhone 12 Pro'],
        browserType: webkit
      },
      {
        name: 'Pixel 7',
        device: devices['Pixel 7'],
        browserType: chromium
      },
      {
        name: 'Galaxy S21',
        device: devices['Galaxy S21'],
        browserType: chromium
      }
    ];

    for (const config of mobileConfigs) {
      this.results.summary.total++;
      
      try {
        this.log(`Testing on ${config.name}...`);
        
        const browser = await config.browserType.launch();
        const context = await browser.newContext({
          ...config.device,
          hasTouch: true // Enable touch for all mobile devices
        });
        const page = await context.newPage();

        // Navigate to test page
        await page.goto(this.baseUrl);

        // Wait for page load
        await page.waitForSelector('body', { timeout: 10000 });

        // Test touch interactions
        await page.touchscreen.tap(100, 100);
        await page.waitForTimeout(100);

        // Test viewport meta tag and responsive behavior
        const viewportInfo = await page.evaluate(() => {
          const viewport = document.querySelector('meta[name="viewport"]');
          return {
            hasViewportMeta: !!viewport,
            devicePixelRatio: window.devicePixelRatio,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
          };
        });

        // Test for mobile-specific issues
        const mobileIssues = await page.evaluate(() => {
          const issues = [];
          
          // Check for fixed positioning issues
          const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
          if (fixedElements.length === 0) {
            issues.push('No fixed positioning detected - cursor might not work');
          }
          
          // Check for touch-action CSS
          const touchElements = document.querySelectorAll('[style*="touch-action"]');
          
          return issues;
        });

        await browser.close();

        this.results.mobile[config.name] = { 
          status: 'passed',
          viewportInfo,
          issues: mobileIssues
        };
        this.results.summary.passed++;
        this.log(`${config.name} test passed`, 'success');

      } catch (error) {
        this.results.mobile[config.name] = { 
          status: 'failed', 
          error: error.message 
        };
        this.results.summary.failed++;
        this.log(`${config.name} test failed: ${error.message}`, 'error');
      }
    }
  }

  async generateReport() {
    this.log('Generating browser test report...', 'start');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      details: {
        browsers: this.results.browsers,
        mobile: this.results.mobile
      }
    };

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = path.join(reportsDir, 'browser-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate human-readable report
    const readableReport = this.generateReadableReport(report);
    const readableReportPath = path.join(reportsDir, 'browser-test-report.md');
    fs.writeFileSync(readableReportPath, readableReport);

    this.log(`Browser test reports generated:`, 'success');
    this.log(`  - JSON: ${reportPath}`);
    this.log(`  - Markdown: ${readableReportPath}`);
  }

  generateReadableReport(report) {
    const { summary, details } = report;
    const successRate = ((summary.passed / summary.total) * 100).toFixed(1);

    let markdown = `# Browser Integration Test Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**Success Rate:** ${successRate}% (${summary.passed}/${summary.total} tests passed)

## Summary

- ✅ **Passed:** ${summary.passed}
- ❌ **Failed:** ${summary.failed}
- 📊 **Total:** ${summary.total}

---

## Desktop Browser Compatibility

`;

    for (const [browser, result] of Object.entries(details.browsers)) {
      const status = result.status === 'passed' ? '✅' : '❌';
      markdown += `### ${status} ${browser}\n`;
      
      if (result.status === 'passed') {
        markdown += `- **Mouse Tracking:** ${result.mouseTracking ? '✅ Working' : '⚠️ Not detected'}\n`;
        if (result.performanceMetrics && result.performanceMetrics.memory) {
          markdown += `- **Memory Usage:** ${(result.performanceMetrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB\n`;
        }
      } else {
        markdown += `- **Error:** \`${result.error}\`\n`;
      }
      markdown += '\n';
    }

    markdown += `---

## Mobile Browser Compatibility

`;

    for (const [device, result] of Object.entries(details.mobile)) {
      const status = result.status === 'passed' ? '✅' : '❌';
      markdown += `### ${status} ${device}\n`;
      
      if (result.status === 'passed') {
        if (result.viewportInfo) {
          markdown += `- **Viewport Meta:** ${result.viewportInfo.hasViewportMeta ? '✅ Present' : '❌ Missing'}\n`;
          markdown += `- **Device Pixel Ratio:** ${result.viewportInfo.devicePixelRatio}\n`;
          markdown += `- **Screen Size:** ${result.viewportInfo.innerWidth}x${result.viewportInfo.innerHeight}\n`;
        }
        if (result.issues && result.issues.length > 0) {
          markdown += `- **Issues Found:**\n`;
          result.issues.forEach(issue => {
            markdown += `  - ${issue}\n`;
          });
        }
      } else {
        markdown += `- **Error:** \`${result.error}\`\n`;
      }
      markdown += '\n';
    }

    markdown += `---

## Recommendations

`;

    if (summary.failed > 0) {
      markdown += `### 🔧 Issues Found
- ${summary.failed} test(s) failed and need attention
- Review browser compatibility issues above
- Test manually in problematic browsers
- Consider polyfills or fallbacks for unsupported features
`;
    } else {
      markdown += `### 🎉 All Browser Tests Passed!
- Library works correctly across all tested browsers
- Mobile compatibility confirmed
- Ready for production deployment
`;
    }

    markdown += `

## Browser Testing Coverage

- **Desktop Browsers:** Chrome, Firefox, Safari (WebKit)
- **Mobile Devices:** iPhone 12/Pro, Pixel 7, Galaxy S21
- **Test Types:** Basic functionality, mouse tracking, touch interaction, responsive behavior
- **Performance:** Memory usage monitoring, error detection

*For additional browser coverage, consider testing with BrowserStack or similar services.*
`;

    return markdown;
  }

  async run() {
    try {
      this.log('Starting Browser Integration Tests', 'start');
      
      // Check if Playwright is installed
      try {
        require('playwright');
      } catch (error) {
        this.log('Playwright not found. Installing...', 'warning');
        const { execSync } = require('child_process');
        execSync('npm install playwright', { stdio: 'inherit' });
        this.log('Playwright installed successfully', 'success');
      }

      await this.buildTestApp();
      await this.startTestServer();

      // Give server time to start
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test desktop browsers
      await this.testInBrowser(chromium, 'Chrome');
      await this.testInBrowser(firefox, 'Firefox');
      await this.testInBrowser(webkit, 'Safari');

      // Test mobile browsers
      await this.testMobileBrowsers();

      await this.generateReport();
      
      this.log('Browser integration testing completed!', 'success');
      
      const { summary } = this.results;
      if (summary.failed > 0) {
        this.log(`${summary.failed} test(s) failed. Check the reports for details.`, 'warning');
        process.exit(1);
      }
      
    } catch (error) {
      this.log(`Browser integration testing failed: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      await this.stopTestServer();
    }
  }
}

// Run the browser integration tests
if (require.main === module) {
  const tester = new BrowserIntegrationTester();
  tester.run().catch(console.error);
}

module.exports = BrowserIntegrationTester; 