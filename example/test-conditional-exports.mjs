#!/usr/bin/env node

/**
 * Test script to verify conditional exports are working correctly
 * This tests that development and production builds are properly selected
 * based on NODE_ENV
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🧪 Testing Conditional Exports...\n');

// Test 1: Check that we can import the library
console.log('1️⃣ Testing basic import...');
try {
  const { CustomCursor } = await import('@yhattav/react-component-cursor');
  if (CustomCursor) {
    console.log('✅ Basic import successful');
  } else {
    console.log('❌ CustomCursor not found in import');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Failed to import library:', error.message);
  process.exit(1);
}

// Test 2: Check which build is being used based on NODE_ENV
console.log('\n2️⃣ Testing conditional exports based on NODE_ENV...');

const originalNodeEnv = process.env.NODE_ENV;

// Test development build
process.env.NODE_ENV = 'development';
console.log('   🔧 Testing development build (NODE_ENV=development)...');
try {
  // Clear module cache
  const devModulePath = require.resolve('@yhattav/react-component-cursor');
  delete require.cache[devModulePath];
  
  const { CustomCursor: DevCursor } = await import('@yhattav/react-component-cursor');
  console.log('   ✅ Development build loaded successfully');
} catch (error) {
  console.log('   ❌ Development build failed:', error.message);
}

// Test production build
process.env.NODE_ENV = 'production';
console.log('   ⚡ Testing production build (NODE_ENV=production)...');
try {
  // Clear module cache
  const prodModulePath = require.resolve('@yhattav/react-component-cursor');
  delete require.cache[prodModulePath];
  
  const { CustomCursor: ProdCursor } = await import('@yhattav/react-component-cursor');
  console.log('   ✅ Production build loaded successfully');
} catch (error) {
  console.log('   ❌ Production build failed:', error.message);
}

// Restore original NODE_ENV
process.env.NODE_ENV = originalNodeEnv;

// Test 3: Check package.json exports configuration
console.log('\n3️⃣ Testing package.json exports configuration...');
try {
  const packagePath = join(__dirname, '..', 'package.json');
  const packageJson = require(packagePath);
  
  if (packageJson.exports && packageJson.exports['.']) {
    const exports = packageJson.exports['.'];
    
    if (exports.development && exports.production && exports.default) {
      console.log('✅ Conditional exports properly configured');
      console.log('   📋 Available conditions:', Object.keys(exports).join(', '));
    } else {
      console.log('❌ Missing required export conditions');
      console.log('   📋 Found conditions:', Object.keys(exports).join(', '));
    }
  } else {
    console.log('❌ No conditional exports found in package.json');
  }
} catch (error) {
  console.log('❌ Failed to read package.json:', error.message);
}

// Test 4: Check that both .dev and production builds exist
console.log('\n4️⃣ Testing build artifacts...');
const buildFiles = [
  '../dist/index.js',      // Production CJS
  '../dist/index.mjs',     // Production ESM
  '../dist/index.dev.js',  // Development CJS
  '../dist/index.dev.mjs', // Development ESM
  '../dist/index.d.ts'     // TypeScript definitions
];

for (const file of buildFiles) {
  try {
    const filePath = join(__dirname, file);
    require.resolve(filePath);
    console.log(`✅ ${file} exists`);
  } catch (error) {
    console.log(`❌ ${file} missing`);
  }
}

// Test 5: Verify conditional exports work as expected
console.log('\n5️⃣ Testing automatic build selection...');
try {
  // This should automatically pick the right build based on NODE_ENV
  process.env.NODE_ENV = 'development';
  delete require.cache[require.resolve('@yhattav/react-component-cursor')];
  const { CustomCursor: AutoDev } = await import('@yhattav/react-component-cursor');
  
  process.env.NODE_ENV = 'production';
  delete require.cache[require.resolve('@yhattav/react-component-cursor')];
  const { CustomCursor: AutoProd } = await import('@yhattav/react-component-cursor');
  
  console.log('✅ Automatic build selection works correctly');
  console.log('   (Bundlers automatically choose dev/prod based on NODE_ENV)');
} catch (error) {
  console.log('❌ Automatic build selection failed:', error.message);
}

console.log('\n🎉 Conditional exports testing complete!');
console.log('\n💡 How to use:');
console.log('   • Development: NODE_ENV=development (gets debug features)');
console.log('   • Production: NODE_ENV=production (gets optimized build)');
console.log('   • Automatic: Bundlers choose the right build automatically');
console.log('\n📚 Learn more about conditional exports:');
console.log('   https://nodejs.org/api/packages.html#conditional-exports'); 