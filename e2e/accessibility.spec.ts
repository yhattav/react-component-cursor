import { test, expect } from '@playwright/test';

test.describe('Cursor Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toBeVisible();
  });

  test('should respect reduced motion preferences', async ({ page }) => {
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

  test('should handle focus states properly', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify buttons can be focused and activated via keyboard
    const toggleButton = page.getByTestId('toggle-cursor-mode');
    await toggleButton.focus();
    
    // Verify focus is visible
    await expect(toggleButton).toBeFocused();
    
    // Activate via keyboard
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('toggle-cursor-mode')).toContainText('Current: custom');
    
    // Verify cursor still works after keyboard interaction
    const cursor = page.getByTestId('cursor-custom');
    await page.mouse.move(300, 300);
    await page.waitForTimeout(50);
    
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - 300)).toBeLessThan(15);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - 300)).toBeLessThan(15);
  });

  test('should not interfere with screen reader navigation', async ({ page }) => {
    // Activate cursor first
    await page.mouse.move(150, 150);
    await page.waitForTimeout(100);
    
    // Verify important elements have proper accessibility attributes
    const title = page.getByTestId('app-title');
    expect(await title.getAttribute('role')).toBeFalsy(); // h1 has implicit role
    
    const buttons = [
      page.getByTestId('toggle-cursor-mode'),
      page.getByTestId('toggle-container')
    ];
    
    for (const button of buttons) {
      // Verify buttons are properly accessible
      expect(await button.evaluate(el => el.tagName.toLowerCase())).toBe('button');
      expect(await button.textContent()).toBeTruthy();
    }
    
    // Verify cursor elements don't interfere with accessibility tree
    const cursor = page.getByTestId('cursor-simple');
    const cursorComputedStyle = await cursor.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        pointerEvents: style.pointerEvents,
        position: style.position
      };
    });
    
    expect(cursorComputedStyle.pointerEvents).toBe('none');
    expect(cursorComputedStyle.position).toBe('static');
  });

  test('should handle high contrast mode', async ({ page }) => {
    // Move mouse to activate cursor
    await page.mouse.move(150, 150);
    await page.waitForTimeout(100);
    
    // Simulate high contrast mode by checking if elements are still visible
    const cursor = page.getByTestId('cursor-simple');
    
    // Move cursor to verify it's still functional
    await page.mouse.move(250, 250);
    await page.waitForTimeout(50);
    
    const cursorBox = await cursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    
    // Verify cursor has sufficient contrast (red background should be visible)
    await expect(cursor).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    
    // Switch to custom cursor and verify it's also visible
    await page.getByTestId('toggle-cursor-mode').click();
    const customCursor = page.getByTestId('cursor-custom');
    await expect(customCursor).toHaveCSS('background-color', 'rgb(0, 102, 255)');
    await expect(customCursor).toBeVisible();
  });
}); 