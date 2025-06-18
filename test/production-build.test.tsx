/**
 * Tests to verify that validation code is properly eliminated from production builds
 */

import fs from 'fs';
import path from 'path';

describe('Production Build Validation Elimination', () => {
  const distPath = path.join(__dirname, '..', 'dist');
  
  it('should not include validation code in production build', () => {
    // Check if the build files exist
    const cjsFile = path.join(distPath, 'index.js');
    const esmFile = path.join(distPath, 'index.mjs');
    
    expect(fs.existsSync(cjsFile)).toBe(true);
    expect(fs.existsSync(esmFile)).toBe(true);
    
    // Read the built files
    const cjsContent = fs.readFileSync(cjsFile, 'utf-8');
    const esmContent = fs.readFileSync(esmFile, 'utf-8');
    
    // These strings should NOT appear in production builds because validation is stripped
    const validationStrings = [
      'must be a non-empty string',
      'must be a number',
      'must be non-negative',
      'must be an object with x and y properties',
      'must be a React ref object',
      'must be a function',
      'validateProps',
    ];
    
    validationStrings.forEach(str => {
      expect(cjsContent).not.toContain(str);
      expect(esmContent).not.toContain(str);
    });
  });
  
  it('should have significantly smaller bundle size than before', () => {
    const cjsFile = path.join(distPath, 'index.js');
    const esmFile = path.join(distPath, 'index.mjs');
    
    const cjsStats = fs.statSync(cjsFile);
    const esmStats = fs.statSync(esmFile);
    
    // Bundle should be under 10KB (our target) and much smaller than the ~18KB we had before
    expect(cjsStats.size).toBeLessThan(10000);
    expect(esmStats.size).toBeLessThan(10000);
  });
  
  it('should still include essential component code', () => {
    const cjsFile = path.join(distPath, 'index.js');
    const cjsContent = fs.readFileSync(cjsFile, 'utf-8');
    
    // These essential patterns SHOULD still be present (minification-safe)
    const essentialPatterns = [
      'CustomCursor', // Export name should be preserved
      'createPortal', // React DOM function  
      'mousemove', // Event listener string
      'cursor-container', // HTML ID we create
      'require(', // Should have require statements
    ];
    
    essentialPatterns.forEach(pattern => {
      expect(cjsContent).toContain(pattern);
    });
  });
}); 