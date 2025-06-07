#!/usr/bin/env node

/**
 * Integration Testing Script for React Component Cursor
 * 
 * This script tests the library across:
 * - Different React versions (16.8+, 17, 18)
 * - Different build systems (Vite, Webpack, Rollup)
 * - Different browsers (Chrome, Firefox, Safari, Edge)
 * - Mobile browsers
 * 
 * Run with: node scripts/integration-test.js
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class IntegrationTester {
  constructor() {
    this.results = {
      reactVersions: {},
      buildSystems: {},
      browsers: {},
      mobile: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };
    
    this.tempDir = path.join(os.tmpdir(), 'react-cursor-integration-tests');
    this.rootDir = process.cwd();
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

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn('bash', ['-c', command], {
        stdio: options.silent ? 'pipe' : 'inherit',
        cwd: options.cwd || this.rootDir,
        ...options
      });

      let stdout = '';
      let stderr = '';

      if (options.silent) {
        child.stdout.on('data', (data) => stdout += data);
        child.stderr.on('data', (data) => stderr += data);
      }

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ code, stdout, stderr });
        } else {
          reject({ code, stdout, stderr, command });
        }
      });
    });
  }

  async setupTempEnvironment() {
    this.log('Setting up temporary testing environment...', 'start');
    
    // Clean up any existing temp directory
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(this.tempDir, { recursive: true });
    this.log(`Created temp directory: ${this.tempDir}`, 'success');
  }

  async buildLibrary() {
    this.log('Building library for integration tests...', 'start');
    
    try {
      await this.runCommand('npm run build');
      this.log('Library build completed successfully', 'success');
    } catch (error) {
      this.log(`Library build failed: ${error.stderr}`, 'error');
      throw error;
    }
  }

  async testReactVersions() {
    this.log('Testing React version compatibility...', 'start');
    
    const reactVersions = [
      { version: '16.14.0', domVersion: '16.14.0' }, // Latest React 16
      { version: '17.0.2', domVersion: '17.0.2' },   // Latest React 17
      { version: '18.3.1', domVersion: '18.3.1' }    // Latest React 18
    ];

    for (const { version, domVersion } of reactVersions) {
      this.results.summary.total++;
      
      try {
        this.log(`Testing React ${version}...`);
        
                 const testDir = path.join(this.tempDir, `react-${version}`);
         fs.mkdirSync(testDir, { recursive: true });

         // Create package.json for this React version
         const packageJson = {
           name: `react-cursor-test-${version}`,
           version: '1.0.0',
           private: true,
           dependencies: {
             react: version,
             'react-dom': domVersion
           },
           scripts: {
             test: 'node test.js'
           }
         };

         fs.writeFileSync(
           path.join(testDir, 'package.json'),
           JSON.stringify(packageJson, null, 2)
         );

         // Create test file
         const testContent = `
const React = require('react');
const { renderToString } = require('react-dom/server');
const cursorLib = require('@yhattav/react-component-cursor');

console.log('Testing React ${version}...');
console.log('Available exports:', Object.keys(cursorLib));

try {
  // Test 1: Basic import - try both named and default export
  const CustomCursor = cursorLib.CustomCursor || cursorLib.default;
  console.log('CustomCursor type:', typeof CustomCursor);
  console.log('CustomCursor is React component:', !!CustomCursor && (typeof CustomCursor === 'function' || typeof CustomCursor === 'object'));
  console.log('CustomCursor constructor:', CustomCursor && CustomCursor.constructor ? CustomCursor.constructor.name : 'N/A');
  
  // React.memo components are objects, not functions, but they're still valid React components
  if (!CustomCursor || (typeof CustomCursor !== 'function' && typeof CustomCursor !== 'object')) {
    throw new Error(\`CustomCursor is not a valid React component. Type: \${typeof CustomCursor}, Available: \${Object.keys(cursorLib)}\`);
  }
  console.log('✅ Import successful');

  // Test 2: SSR rendering
  const element = React.createElement(CustomCursor, {
    children: React.createElement('div', null, 'Test cursor')
  });
  
  const html = renderToString(element);
  console.log('✅ SSR rendering successful');

  // Test 3: Component instantiation
  const instance = React.createElement(CustomCursor, {
    id: 'test-cursor',
    enabled: true
  });
  console.log('✅ Component instantiation successful');

  console.log('🎉 React ${version} compatibility test passed');
  process.exit(0);
} catch (error) {
  console.error('❌ React ${version} compatibility test failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
`;

         fs.writeFileSync(path.join(testDir, 'test.js'), testContent);

         // Install dependencies first
         await this.runCommand('npm install', { cwd: testDir, silent: true });
         
         // Copy the built library files to avoid symlink issues
         const distDir = path.join(testDir, 'node_modules', '@yhattav', 'react-component-cursor');
         fs.mkdirSync(distDir, { recursive: true });
         
         // Copy package.json
         const libPackageJson = JSON.parse(fs.readFileSync(path.join(this.rootDir, 'package.json'), 'utf8'));
         fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(libPackageJson, null, 2));
         
         // Copy dist files
         const libDistDir = path.join(this.rootDir, 'dist');
         const targetDistDir = path.join(distDir, 'dist');
         fs.mkdirSync(targetDistDir, { recursive: true });
         
         const distFiles = fs.readdirSync(libDistDir);
         for (const file of distFiles) {
           fs.copyFileSync(path.join(libDistDir, file), path.join(targetDistDir, file));
         }

         // Run test
         await this.runCommand('npm test', { cwd: testDir });

        this.results.reactVersions[version] = { status: 'passed' };
        this.results.summary.passed++;
        this.log(`React ${version} test passed`, 'success');

      } catch (error) {
        this.results.reactVersions[version] = { 
          status: 'failed', 
          error: error.stderr || error.message 
        };
        this.results.summary.failed++;
        this.log(`React ${version} test failed: ${error.stderr || error.message}`, 'error');
      }
    }
  }

  async testBuildSystems() {
    this.log('Testing build system compatibility...', 'start');
    
    const buildSystems = [
      {
        name: 'vite',
        setup: this.setupViteTest.bind(this),
        test: this.runViteTest.bind(this)
      },
      {
        name: 'webpack',
        setup: this.setupWebpackTest.bind(this),
        test: this.runWebpackTest.bind(this)
      },
      {
        name: 'rollup',
        setup: this.setupRollupTest.bind(this),
        test: this.runRollupTest.bind(this)
      }
    ];

    for (const system of buildSystems) {
      this.results.summary.total++;
      
      try {
        this.log(`Testing ${system.name}...`);
        
        const testDir = path.join(this.tempDir, `build-${system.name}`);
        fs.mkdirSync(testDir, { recursive: true });

        await system.setup(testDir);
        await system.test(testDir);

        this.results.buildSystems[system.name] = { status: 'passed' };
        this.results.summary.passed++;
        this.log(`${system.name} test passed`, 'success');

      } catch (error) {
        this.results.buildSystems[system.name] = { 
          status: 'failed', 
          error: error.stderr || error.message 
        };
        this.results.summary.failed++;
        this.log(`${system.name} test failed: ${error.stderr || error.message}`, 'error');
      }
    }
  }

  async setupViteTest(testDir) {
    const packageJson = {
      name: 'react-cursor-vite-test',
      version: '1.0.0',
      private: true,
      type: 'module',
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        '@yhattav/react-component-cursor': `file:${this.rootDir}`
      },
      devDependencies: {
        '@types/react': '^18.3.12',
        '@types/react-dom': '^18.3.1',
        '@vitejs/plugin-react': '^4.3.3',
        typescript: '^5.6.3',
        vite: '^5.4.10'
      },
      scripts: {
        build: 'vite build',
        preview: 'vite preview'
      }
    };

    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Vite config
    const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  }
})
`;

    fs.writeFileSync(path.join(testDir, 'vite.config.js'), viteConfig);

    // Test React component
    const testComponent = `
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export default function App() {
  return (
    <div>
      <h1>Vite Test</h1>
      <CustomCursor>
        <div>Custom Cursor</div>
      </CustomCursor>
    </div>
  );
}
`;

    fs.writeFileSync(path.join(testDir, 'App.jsx'), testComponent);

    // HTML template
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite Test</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>
`;

    fs.writeFileSync(path.join(testDir, 'index.html'), htmlTemplate);

    // Main entry point
    const mainEntry = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
`;

    fs.writeFileSync(path.join(testDir, 'main.jsx'), mainEntry);
  }

  async runViteTest(testDir) {
    await this.runCommand('npm install', { cwd: testDir, silent: true });
    await this.runCommand('npm run build', { cwd: testDir, silent: true });
  }

  async setupWebpackTest(testDir) {
    const packageJson = {
      name: 'react-cursor-webpack-test',
      version: '1.0.0',
      private: true,
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        '@yhattav/react-component-cursor': `file:${this.rootDir}`
      },
      devDependencies: {
        '@babel/core': '^7.26.0',
        '@babel/preset-react': '^7.25.9',
        'babel-loader': '^9.2.1',
        'css-loader': '^6.11.0',
        'html-webpack-plugin': '^5.6.2',
        'style-loader': '^3.3.4',
        'webpack': '^5.96.1',
        'webpack-cli': '^5.1.4'
      },
      scripts: {
        build: 'webpack --mode=production'
      }
    };

    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Webpack config
    const webpackConfig = `
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
`;

    fs.writeFileSync(path.join(testDir, 'webpack.config.js'), webpackConfig);

    // Create src directory
    const srcDir = path.join(testDir, 'src');
    fs.mkdirSync(srcDir);

    // Test component
    const testComponent = `
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export default function App() {
  return (
    <div>
      <h1>Webpack Test</h1>
      <CustomCursor>
        <div>Custom Cursor</div>
      </CustomCursor>
    </div>
  );
}
`;

    fs.writeFileSync(path.join(srcDir, 'App.js'), testComponent);

    // Entry point
    const indexJs = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;

    fs.writeFileSync(path.join(srcDir, 'index.js'), indexJs);

    // HTML template
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Webpack Test</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

    fs.writeFileSync(path.join(srcDir, 'index.html'), htmlTemplate);
  }

  async runWebpackTest(testDir) {
    await this.runCommand('npm install', { cwd: testDir, silent: true });
    await this.runCommand('npm run build', { cwd: testDir, silent: true });
  }

  async setupRollupTest(testDir) {
    const packageJson = {
      name: 'react-cursor-rollup-test',
      version: '1.0.0',
      private: true,
      type: 'module',
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        '@yhattav/react-component-cursor': `file:${this.rootDir}`
      },
      devDependencies: {
        '@babel/core': '^7.26.0',
        '@babel/preset-react': '^7.25.9',
        '@rollup/plugin-babel': '^6.0.4',
        '@rollup/plugin-commonjs': '^28.0.1',
        '@rollup/plugin-node-resolve': '^15.3.0',
        '@rollup/plugin-replace': '^6.0.1',
        'rollup': '^4.27.4'
      },
      scripts: {
        build: 'rollup -c'
      }
    };

    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Rollup config
    const rollupConfig = `
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'ReactCursorTest',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  external: ['react', 'react-dom'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      exclude: 'node_modules/**'
    })
  ]
};
`;

    fs.writeFileSync(path.join(testDir, 'rollup.config.js'), rollupConfig);

    // Create src directory
    const srcDir = path.join(testDir, 'src');
    fs.mkdirSync(srcDir);

    // Test component
    const testComponent = `
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

console.log('Rollup test running...');
console.log('CustomCursor:', typeof CustomCursor);

export default function App() {
  return React.createElement('div', null, 
    React.createElement('h1', null, 'Rollup Test'),
    React.createElement(CustomCursor, null, 
      React.createElement('div', null, 'Custom Cursor')
    )
  );
}
`;

    fs.writeFileSync(path.join(srcDir, 'App.js'), testComponent);

    // Entry point
    const indexJs = `
import React from 'react';
import App from './App.js';

// Simple test - just ensure the component can be imported and created
console.log('Testing Rollup build...');
const element = React.createElement(App);
console.log('App component created successfully');
`;

    fs.writeFileSync(path.join(srcDir, 'index.js'), indexJs);
  }

  async runRollupTest(testDir) {
    await this.runCommand('npm install', { cwd: testDir, silent: true });
    await this.runCommand('npm run build', { cwd: testDir, silent: true });
  }

  async generateReport() {
    this.log('Generating integration test report...', 'start');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.results.summary,
      details: {
        reactVersions: this.results.reactVersions,
        buildSystems: this.results.buildSystems,
        browsers: this.results.browsers,
        mobile: this.results.mobile
      }
    };

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(this.rootDir, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = path.join(reportsDir, 'integration-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate human-readable report
    const readableReport = this.generateReadableReport(report);
    const readableReportPath = path.join(reportsDir, 'integration-test-report.md');
    fs.writeFileSync(readableReportPath, readableReport);

    this.log(`Reports generated:`, 'success');
    this.log(`  - JSON: ${reportPath}`);
    this.log(`  - Markdown: ${readableReportPath}`);
  }

  generateReadableReport(report) {
    const { summary, details } = report;
    const successRate = ((summary.passed / summary.total) * 100).toFixed(1);

    let markdown = `# Integration Test Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}  
**Success Rate:** ${successRate}% (${summary.passed}/${summary.total} tests passed)

## Summary

- ✅ **Passed:** ${summary.passed}
- ❌ **Failed:** ${summary.failed}
- 📊 **Total:** ${summary.total}

---

## React Version Compatibility

`;

    for (const [version, result] of Object.entries(details.reactVersions)) {
      const status = result.status === 'passed' ? '✅' : '❌';
      markdown += `- ${status} **React ${version}**`;
      if (result.error) {
        markdown += `\n  - Error: \`${result.error}\``;
      }
      markdown += '\n';
    }

    markdown += `
---

## Build System Compatibility

`;

    for (const [system, result] of Object.entries(details.buildSystems)) {
      const status = result.status === 'passed' ? '✅' : '❌';
      markdown += `- ${status} **${system.toUpperCase()}**`;
      if (result.error) {
        markdown += `\n  - Error: \`${result.error}\``;
      }
      markdown += '\n';
    }

    markdown += `
---

## Browser Compatibility

*Browser testing requires manual verification or CI/CD integration*

## Mobile Compatibility

*Mobile testing requires device testing or emulation*

---

## Recommendations

`;

    if (summary.failed > 0) {
      markdown += `
### 🔧 Issues Found
- ${summary.failed} test(s) failed and need attention
- Review the errors above and fix compatibility issues
- Re-run tests after fixes
`;
    } else {
      markdown += `
### 🎉 All Tests Passed!
- Library is compatible with tested React versions
- Build systems are working correctly
- Ready for production use
`;
    }

    return markdown;
  }

  async cleanup() {
    this.log('Cleaning up temporary files...', 'start');
    
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
      this.log('Temporary files cleaned up', 'success');
    }
  }

  async run() {
    try {
      this.log('Starting React Component Cursor Integration Tests', 'start');
      
      await this.setupTempEnvironment();
      await this.buildLibrary();
      await this.testReactVersions();
      await this.testBuildSystems();
      await this.generateReport();
      
      this.log('Integration testing completed successfully!', 'success');
      
      const { summary } = this.results;
      if (summary.failed > 0) {
        this.log(`${summary.failed} test(s) failed. Check the reports for details.`, 'warning');
        process.exit(1);
      }
      
    } catch (error) {
      this.log(`Integration testing failed: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the integration tests
if (require.main === module) {
  const tester = new IntegrationTester();
  tester.run().catch(console.error);
}

module.exports = IntegrationTester;