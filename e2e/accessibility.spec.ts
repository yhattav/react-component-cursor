import { test, expect } from '@playwright/test';

test.describe('Cursor Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toBeVisible();
  });

  test('should respect reduced motion preferences', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, no cursor should be visible regardless of motion preferences
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Touch interactions should still work
      await page.touchscreen.tap(100, 100);
      await page.waitForTimeout(100);
      
      // No cursor should be present
      await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
      
      // Page should remain functional
      await expect(page.getByTestId('app-title')).toBeVisible();
      await expect(page.getByTestId('test-status')).toContainText('Test App Ready');
      return;
    }

    // Desktop behavior
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Move mouse to activate cursor
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);
    
    const cursor = page.getByTestId('cursor-simple');
    
    // Move mouse and verify cursor still follows (but potentially with different animation)
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);
    
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    
    // Cursor should still be positioned correctly even with reduced motion
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - 200)).toBeLessThan(15);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - 200)).toBeLessThan(15);
  });

  test('should handle focus states properly', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, focus states should work but no cursor visible
      await page.getByTestId('toggle-cursor-mode').click();
      await page.waitForTimeout(50);
      
      // Focus an interactive element
      await page.getByTestId('toggle-cursor-mode').focus();
      await page.waitForTimeout(50);
      
      // No cursor should be visible
      await expect(page.getByTestId('cursor-custom')).not.toBeVisible();
      await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
      
      // But focus should work normally
      const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
      expect(focusedElement).toBe('toggle-cursor-mode');
      return;
    }

    // Desktop behavior
    // Switch to custom cursor mode
    await page.getByTestId('toggle-cursor-mode').click();
    await page.waitForTimeout(50);
    
    // Focus an interactive element
    await page.getByTestId('toggle-cursor-mode').focus();
    await page.mouse.move(300, 300);
    await page.waitForTimeout(50);
    
    const cursor = page.getByTestId('cursor-custom');
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - 300)).toBeLessThan(15);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - 300)).toBeLessThan(15);
  });

  test('should not interfere with screen reader navigation', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, verify touch accessibility works without cursor interference
      await page.touchscreen.tap(100, 100);
      await page.waitForTimeout(100);
      
      // No cursor elements should be present to interfere
      await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
      
      // Interactive elements should remain accessible
      const interactiveElements = await page.locator('[data-testid]').count();
      expect(interactiveElements).toBeGreaterThan(0);
      
      // Verify screen reader can navigate (aria attributes present)
      const titleElement = page.getByTestId('app-title');
      const hasAriaRole = await titleElement.evaluate(el => el.getAttribute('role') !== null || el.tagName.toLowerCase() === 'h1' || el.tagName.toLowerCase() === 'h2');
      expect(hasAriaRole).toBe(true);
      return;
    }

    // Desktop behavior
    // Move mouse to activate cursor
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);
    
    // Verify cursor elements don't interfere with accessibility tree
    const cursor = page.getByTestId('cursor-simple');
    const cursorComputedStyle = await cursor.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        pointerEvents: style.pointerEvents,
        position: style.position,
        zIndex: style.zIndex
      };
    });
    
    // Cursor should not interfere with pointer events
    expect(cursorComputedStyle.pointerEvents).toBe('none');
    // Position should be either fixed or static (both acceptable for cursor)
    expect(['fixed', 'static']).toContain(cursorComputedStyle.position);
    
    // Verify screen reader can still navigate interactive elements
    const interactiveElements = await page.locator('button, input, [tabindex]:not([tabindex="-1"])').count();
    expect(interactiveElements).toBeGreaterThan(0);
  });

  test('should handle high contrast mode', async ({ page, isMobile }) => {
    if (isMobile) {
      // On mobile, high contrast should work but no cursor visible
      await page.emulateMedia({ colorScheme: 'dark' });
      
      // Touch interaction
      await page.touchscreen.tap(100, 100);
      await page.waitForTimeout(50);
      
      // No cursor should be visible
      await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
      
      // Page should remain functional and respect contrast preferences
      await expect(page.getByTestId('app-title')).toBeVisible();
      
      // Background should respect color scheme
      const bodyStyle = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      expect(bodyStyle).toBeTruthy(); // Should have some background color
      return;
    }

    // Desktop behavior
    // Enable high contrast mode simulation
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Move mouse to activate cursor
    await page.mouse.move(100, 100);
    await page.waitForTimeout(50);
    
    const cursor = page.getByTestId('cursor-simple');
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    
    // Verify cursor has sufficient contrast (red background should be visible)
    const cursorStyle = await cursor.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        visibility: style.visibility
      };
    });
    
    expect(cursorStyle.backgroundColor).toBe('rgb(255, 0, 0)'); // Red cursor
    expect(cursorStyle.visibility).toBe('visible');
  });
}); 