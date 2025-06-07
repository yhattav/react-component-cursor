import { test, expect } from '@playwright/test';

test.describe('Cursor Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toBeVisible();
    // Wait for app to be ready
    await expect(page.getByTestId('test-status')).toContainText('Test App Ready');
  });

  test('should maintain smooth animation during continuous movement', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, test that continuous touch interactions remain performant
      const startTime = performance.now();
      let frameCount = 0;
      
      // Simulate continuous touch movements
      for (let i = 0; i < 50; i++) {
        const x = 200 + Math.sin(i * 0.1) * 100;
        const y = 200 + Math.cos(i * 0.1) * 100;
        await page.touchscreen.tap(x, y);
        frameCount++;
        
        if (i % 10 === 0) {
          await page.waitForTimeout(5); // Brief pause
        }
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const fps = (frameCount / totalTime) * 1000;
      
      console.log(`Mobile touch performance: ${fps.toFixed(2)} touches/second over ${totalTime.toFixed(0)}ms`);
      
      // Mobile should handle touch interactions smoothly
      expect(fps).toBeGreaterThan(30); // At least 30 touches per second
      
      // Page should remain functional
      await expect(page.getByTestId('app-title')).toBeVisible();
      await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
      return;
    }

    // Desktop performance testing
    const cursor = page.getByTestId('cursor-simple');
    
    // Activate cursor
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);
    
    const startTime = performance.now();
    let frameCount = 0;
    
    // Perform continuous mouse movement in a circle
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * 2 * Math.PI;
      const x = 400 + Math.cos(angle) * 100;
      const y = 300 + Math.sin(angle) * 100;
      
      await page.mouse.move(x, y);
      frameCount++;
      
      // Small delay to simulate realistic movement
      if (i % 10 === 0) {
        await page.waitForTimeout(16); // ~60fps target
      }
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const fps = (frameCount / totalTime) * 1000;
    
    console.log(`Performance: ${fps.toFixed(2)} FPS over ${totalTime.toFixed(0)}ms`);
    
    // Should maintain reasonable frame rate
    expect(fps).toBeGreaterThan(45); // At least 45 FPS for smooth animation
    
    // Verify cursor is still responsive
    const finalBox = await cursor.boundingBox();
    expect(finalBox).toBeTruthy();
  });

  test('should not cause memory leaks during extended use', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, test that extended touch usage doesn't cause memory issues
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      
      // Simulate extended touch usage
      for (let i = 0; i < 100; i++) {
        const x = 100 + (i % 500);
        const y = 100 + ((i * 7) % 300);
        await page.touchscreen.tap(x, y);
        
        if (i % 20 === 0) {
          await page.waitForTimeout(5);
        }
      }
      
      // Force garbage collection if available
      await page.evaluate(() => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      });
      
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryIncrease = (finalMemory - initialMemory) / 1024; // KB
        console.log(`Mobile memory increase: ${memoryIncrease.toFixed(2)} KB`);
        
        // Should not increase memory significantly
        expect(memoryIncrease).toBeLessThan(500); // Less than 500KB increase
      }
      
      // Page should remain functional
      await expect(page.getByTestId('app-title')).toBeVisible();
      return;
    }

    // Desktop memory testing
    const cursor = page.getByTestId('cursor-simple');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // Perform extensive cursor movements
    for (let i = 0; i < 200; i++) {
      const x = 100 + (i % 600);
      const y = 100 + ((i * 7) % 400);
      await page.mouse.move(x, y);
      
      // Occasional pauses
      if (i % 50 === 0) {
        await page.waitForTimeout(10);
      }
    }
    
    // Move to final position for testing
    await page.mouse.move(500, 400);
    await page.waitForTimeout(100);
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });
    
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = (finalMemory - initialMemory) / 1024; // KB
      console.log(`Memory increase: ${memoryIncrease.toFixed(2)} KB`);
      
      // Should not increase memory significantly
      expect(memoryIncrease).toBeLessThan(1000); // Less than 1MB increase
    }
    
    // Verify cursor is still at expected position
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - 500)).toBeLessThan(15);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - 400)).toBeLessThan(15);
  });

  test('should handle rapid mode switching without performance degradation', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, test rapid UI mode switching
      const startTime = Date.now();
      
      // Rapidly switch cursor modes (even though cursors won't show)
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('toggle-cursor-mode').click();
        await page.waitForTimeout(10);
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      console.log(`Mobile mode switching: ${totalTime}ms for 10 switches`);
      
      // Should handle mode switching efficiently
      expect(totalTime).toBeLessThan(2000); // Less than 2 seconds
      
      // No cursors should be visible regardless of mode
      await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
      await expect(page.getByTestId('cursor-custom')).not.toBeVisible();
      
      // Page should remain functional
      await expect(page.getByTestId('app-title')).toBeVisible();
      return;
    }

    // Desktop performance testing
    const cursor = page.getByTestId('cursor-simple');
    
    // Activate cursor
    await page.mouse.move(300, 300);
    await page.waitForTimeout(100);
    
    const startTime = Date.now();
    
    // Rapidly switch between cursor modes
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('toggle-cursor-mode').click();
      await page.waitForTimeout(20); // Brief delay for state update
      
      // Move mouse to ensure cursor updates
      await page.mouse.move(300 + (i * 10), 300);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`Mode switching performance: ${totalTime}ms for 10 switches`);
    
    // Should handle rapid switching efficiently
    expect(totalTime).toBeLessThan(3000); // Less than 3 seconds for 10 switches
    
    // Move to final position for verification
    await page.mouse.move(600, 400);
    await page.waitForTimeout(100);
    
    // Verify cursor is positioned correctly
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - 600)).toBeLessThan(15);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - 400)).toBeLessThan(15);
  });

  test('should handle container mode switching efficiently', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, test container mode switching performance
      const startTime = Date.now();
      
      // Switch to container mode and back multiple times
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('toggle-container').click();
        await page.waitForTimeout(20);
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      console.log(`Mobile container switching: ${totalTime}ms for 10 switches`);
      
      // Should handle container switching efficiently
      expect(totalTime).toBeLessThan(2000);
      
      // No cursors should be visible
      await expect(page.getByTestId('cursor-container-element')).not.toBeVisible();
      await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
      
      // Page should remain functional
      await expect(page.getByTestId('app-title')).toBeVisible();
      return;
    }

    // Desktop container performance testing
    const startTime = Date.now();
    
    // Test rapid container mode switching with movements
    for (let i = 0; i < 20; i++) {
      await page.getByTestId('toggle-container').click();
      await page.waitForTimeout(20);
      
      // Move mouse during switch
      await page.mouse.move(200 + (i * 5), 200 + (i * 5));
      await page.waitForTimeout(10);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`Container mode performance: ${totalTime}ms for 20 movements`);
    
    // Should complete container switching in reasonable time
    expect(totalTime).toBeLessThan(5000); // 5 seconds for 20 rapid switches
    
    // Verify system is still responsive
    const isContainerMode = await page.getByTestId('toggle-container').textContent();
    expect(isContainerMode).toContain('Container Mode:');
  });
}); 