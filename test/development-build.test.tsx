/**
 * Tests to verify that development builds include validation code and dev features
 */

import fs from 'fs';
import path from 'path';

describe('Development Build Features', () => {
  const distPath = path.join(__dirname, '..', 'dist');
  
  it('should include validation code in development build', () => {
    // Check if the development build files exist
    const cjsDevFile = path.join(distPath, 'index.dev.js');
    const esmDevFile = path.join(distPath, 'index.dev.mjs');
    
    expect(fs.existsSync(cjsDevFile)).toBe(true);
    expect(fs.existsSync(esmDevFile)).toBe(true);
    
    // Read the development build files
    const cjsDevContent = fs.readFileSync(cjsDevFile, 'utf-8');
    const esmDevContent = fs.readFileSync(esmDevFile, 'utf-8');
    
    // These strings SHOULD appear in development builds
    const validationStrings = [
      'must be a string',
      'must be a number', 
      'must be non-negative',
      'validateProps',
    ];
    
    validationStrings.forEach(str => {
      expect(cjsDevContent).toContain(str);
      expect(esmDevContent).toContain(str);
    });
  });
  
  it('should include DevIndicator in development build', () => {
    const cjsDevFile = path.join(distPath, 'index.dev.js');
    const cjsDevContent = fs.readFileSync(cjsDevFile, 'utf-8');
    
    // Development features that should be present
    const devFeatures = [
      'DevIndicator',
      'border: "2px solid red"', // Red ring styling
      'borderRadius: "50%"',     // Circle shape
    ];
    
    devFeatures.forEach(feature => {
      expect(cjsDevContent).toContain(feature);
    });
  });
  
  it('should be larger than production build', () => {
    const prodFile = path.join(distPath, 'index.js');
    const devFile = path.join(distPath, 'index.dev.js');
    
    const prodStats = fs.statSync(prodFile);
    const devStats = fs.statSync(devFile);
    
    // Development build should be larger due to included validation/debug code
    expect(devStats.size).toBeGreaterThan(prodStats.size);
    
    // But still reasonable size for development
    expect(devStats.size).toBeLessThan(25000); // 25KB limit for dev
  });
  
  it('should include essential component code', () => {
    const cjsDevFile = path.join(distPath, 'index.dev.js');
    const cjsDevContent = fs.readFileSync(cjsDevFile, 'utf-8');
    
    // Essential functionality should still be present in main bundle
    const mainBundlePatterns = [
      'CustomCursor',
      'createPortal',
      'cursor-container',
    ];
    
    mainBundlePatterns.forEach(pattern => {
      expect(cjsDevContent).toContain(pattern);
    });
    
    // mousemove should be in the coordinator chunk (dynamic import)
    const coordinatorFiles = fs.readdirSync(distPath).filter(file => 
      file.includes('CursorCoordinator') && file.includes('.dev.js')
    );
    
    expect(coordinatorFiles.length).toBeGreaterThan(0);
    
    const coordinatorFile = path.join(distPath, coordinatorFiles[0]);
    const coordinatorContent = fs.readFileSync(coordinatorFile, 'utf-8');
    
    expect(coordinatorContent).toContain('mousemove');
  });
}); 