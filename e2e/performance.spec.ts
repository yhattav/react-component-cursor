import { test, expect } from '@playwright/test';

test.describe('Cursor Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toBeVisible();
  });

  test('should maintain smooth animation during continuous movement', async ({ page }) => {
    // Enable performance monitoring
    await page.evaluate(() => {
      (window as any).performanceData = {
        frameCount: 0,
        startTime: performance.now(),
        frames: []
      };
      
      function measureFrame() {
        const now = performance.now();
        (window as any).performanceData.frameCount++;
        (window as any).performanceData.frames.push(now);
        requestAnimationFrame(measureFrame);
      }
      
      requestAnimationFrame(measureFrame);
    });
    
    const cursor = page.getByTestId('cursor-simple');
    
    // Perform continuous circular movement for 2 seconds
    const centerX = 400;
    const centerY = 300;
    const radius = 100;
    const duration = 2000; // 2 seconds
    const steps = 60; // 30 FPS target
    
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      await page.mouse.move(x, y);
      await page.waitForTimeout(duration / steps);
    }
    
    // Get performance metrics
    const performanceData = await page.evaluate(() => {
      const data = (window as any).performanceData;
      const endTime = performance.now();
      const totalTime = endTime - data.startTime;
      
      return {
        frameCount: data.frameCount,
        totalTime: totalTime,
        averageFPS: (data.frameCount / totalTime) * 1000
      };
    });
    
    // Verify cursor ended up at expected position
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    
    // Performance expectations
    expect(performanceData.averageFPS).toBeGreaterThan(30); // At least 30 FPS
    expect(performanceData.totalTime).toBeLessThan(5000); // Should complete within 5 seconds
    
    console.log(`Performance: ${performanceData.averageFPS.toFixed(2)} FPS over ${performanceData.totalTime.toFixed(0)}ms`);
  });

  test('should not cause memory leaks during extended use', async ({ page }) => {
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return null;
    });
    
    // Skip if memory API not available
    if (initialMemory === null) {
      test.skip(true, 'Performance memory API not available');
      return;
    }
    
    // Activate cursor first
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);
    
    // Perform many cursor movements to stress test
    const cursor = page.getByTestId('cursor-simple');
    
    for (let round = 0; round < 5; round++) {
      // Perform random movements
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 800 + 100;
        const y = Math.random() * 600 + 100;
        await page.mouse.move(x, y);
        await page.waitForTimeout(10);
      }
      
      // Force garbage collection if available
      await page.evaluate(() => {
        if ('gc' in window) {
          (window as any).gc();
        }
      });
      
      await page.waitForTimeout(100);
    }
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return null;
    });
    
    if (finalMemory !== null) {
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseKB = memoryIncrease / 1024;
      
      console.log(`Memory increase: ${memoryIncreaseKB.toFixed(2)} KB`);
      
      // Memory should not increase significantly (allow up to 500KB for test overhead)
      expect(memoryIncreaseKB).toBeLessThan(500);
    }
    
    // Verify cursor is still responsive
    await page.mouse.move(500, 400);
    await page.waitForTimeout(50);
    
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - 500)).toBeLessThan(15);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - 400)).toBeLessThan(15);
  });

  test('should handle rapid mode switching without performance degradation', async ({ page }) => {
    const startTime = Date.now();
    
    // Rapidly switch between cursor modes
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('toggle-cursor-mode').click();
      await page.waitForTimeout(50);
      
      // Move cursor during mode switch
      await page.mouse.move(200 + i * 20, 200 + i * 10);
      await page.waitForTimeout(50);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete rapidly
    expect(duration).toBeLessThan(2000);
    
    // Verify final state is correct
    const toggleButton = page.getByTestId('toggle-cursor-mode');
    const buttonText = await toggleButton.textContent();
    expect(buttonText).toContain('Current:');
    
    // Verify cursor is still responsive
    const currentMode = buttonText?.includes('simple') ? 'cursor-simple' : 'cursor-custom';
    const cursor = page.getByTestId(currentMode);
    
    await page.mouse.move(600, 400);
    await page.waitForTimeout(50);
    
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - 600)).toBeLessThan(15);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - 400)).toBeLessThan(15);
  });

  test('should handle container mode switching efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Test container mode performance
    await page.getByTestId('toggle-container').click();
    await page.waitForTimeout(100);
    
    const container = page.getByTestId('cursor-container');
    const containerBox = await container.boundingBox();
    expect(containerBox).toBeTruthy();
    
    // Perform movements in container
    const centerX = containerBox!.x + containerBox!.width / 2;
    const centerY = containerBox!.y + containerBox!.height / 2;
    
    for (let i = 0; i < 20; i++) {
      const x = centerX + (Math.random() - 0.5) * 200;
      const y = centerY + (Math.random() - 0.5) * 150;
      await page.mouse.move(x, y);
      await page.waitForTimeout(25);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should handle container movements efficiently
    expect(duration).toBeLessThan(1500);
    
    // Verify container cursor is still responsive
    const containerCursor = page.getByTestId('cursor-container-element');
    await expect(containerCursor).toBeVisible();
    
    console.log(`Container mode performance: ${duration}ms for 20 movements`);
  });
}); 