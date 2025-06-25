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
  
  it('should have optimized bundle sizes with dynamic imports', () => {
    const cjsFile = path.join(distPath, 'index.js');
    const esmFile = path.join(distPath, 'index.mjs');
    
    const cjsStats = fs.statSync(cjsFile);
    const esmStats = fs.statSync(esmFile);
    
    // Main bundle should be small (core functionality only)
    expect(cjsStats.size).toBeLessThan(8000); // ~7KB for main bundle
    expect(esmStats.size).toBeLessThan(7000); // ~6KB for ESM main bundle
    
    // Check that coordinator chunks exist and are reasonably sized (production only)
    const coordinatorFiles = fs.readdirSync(distPath).filter(file => 
      file.includes('CursorCoordinator') && 
      (file.endsWith('.js') || file.endsWith('.mjs')) &&
      !file.includes('.dev.') // Exclude dev builds
    );
    
    expect(coordinatorFiles.length).toBeGreaterThan(0);
    
    coordinatorFiles.forEach(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeLessThan(5000); // Coordinator chunk should be < 5KB
      expect(stats.size).toBeGreaterThan(1000); // But should contain substantial code
    });
  });
  
  it('should still include essential component code', () => {
    const cjsFile = path.join(distPath, 'index.js');
    const cjsContent = fs.readFileSync(cjsFile, 'utf-8');
    
    // These essential patterns SHOULD still be present in main bundle (minification-safe)
    const essentialPatterns = [
      'CustomCursor', // Export name should be preserved
      'createPortal', // React DOM function  
      'cursor-container', // HTML ID we create
      'require(', // Should have require statements
      'CursorCoordinator', // Dynamic import reference
    ];
    
    essentialPatterns.forEach(pattern => {
      expect(cjsContent).toContain(pattern);
    });
  });

  it('should have mousemove in the coordinator chunk (dynamic import)', () => {
    const coordinatorFiles = fs.readdirSync(distPath).filter(file => 
      file.includes('CursorCoordinator') && file.endsWith('.js') && !file.includes('.dev.')
    );
    
    expect(coordinatorFiles.length).toBeGreaterThan(0);
    
    const coordinatorFile = path.join(distPath, coordinatorFiles[0]);
    const coordinatorContent = fs.readFileSync(coordinatorFile, 'utf-8');
    
    // mousemove should be in the coordinator chunk, not main bundle
    expect(coordinatorContent).toContain('mousemove');
  });
}); 