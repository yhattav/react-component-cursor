import { test, expect } from '@playwright/test';

test.describe('Custom Cursor Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-title')).toBeVisible();
    
    // Wait for React to fully hydrate and the cursor to be ready
    await expect(page.getByTestId('test-status')).toContainText('Test App Ready');
    await page.waitForTimeout(500); // Additional wait for cursor initialization
  });

  test('should display the test app with default cursor', async ({ page }) => {
    // Verify app loads correctly
    await expect(page.getByTestId('app-title')).toHaveText('React Cursor Library Test');
    await expect(page.getByTestId('test-status')).toContainText('Test App Ready');
    
    // Verify default state
    await expect(page.getByTestId('toggle-cursor-mode')).toContainText('Current: simple');
    await expect(page.getByTestId('toggle-container')).toContainText('Container Mode: OFF');
  });

  test('should render custom cursor element', async ({ page }) => {
    // Move mouse to activate the cursor
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);
    
    // Verify global cursor is present
    await expect(page.getByTestId('custom-cursor-global')).toBeVisible();
    await expect(page.getByTestId('cursor-simple')).toBeVisible();
    
    // Verify cursor styling
    const simpleCursor = page.getByTestId('cursor-simple');
    await expect(simpleCursor).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    await expect(simpleCursor).toHaveCSS('border-radius', '50%');
  });

  test('should switch between cursor modes', async ({ page }) => {
    // Move mouse to activate the cursor
    await page.mouse.move(150, 150);
    await page.waitForTimeout(100);
    
    // Start with simple cursor
    await expect(page.getByTestId('cursor-simple')).toBeVisible();
    await expect(page.getByTestId('cursor-custom')).not.toBeVisible();
    
    // Switch to custom cursor
    await page.getByTestId('toggle-cursor-mode').click();
    await expect(page.getByTestId('toggle-cursor-mode')).toContainText('Current: custom');
    
    // Verify custom cursor is now visible
    await expect(page.getByTestId('cursor-simple')).not.toBeVisible();
    await expect(page.getByTestId('cursor-custom')).toBeVisible();
    await expect(page.getByTestId('cursor-custom')).toHaveCSS('background-color', 'rgb(0, 102, 255)');
    
    // Switch back
    await page.getByTestId('toggle-cursor-mode').click();
    await expect(page.getByTestId('toggle-cursor-mode')).toContainText('Current: simple');
    await expect(page.getByTestId('cursor-simple')).toBeVisible();
    await expect(page.getByTestId('cursor-custom')).not.toBeVisible();
  });

  test('should track mouse movement', async ({ page }) => {
    // Activate cursor first
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);
    
    const cursor = page.getByTestId('cursor-simple');
    
    // Get initial position
    const initialBox = await cursor.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Move mouse to different positions and verify cursor follows
    const testPositions = [
      { x: 100, y: 100 },
      { x: 300, y: 200 },
      { x: 500, y: 150 }
    ];
    
    for (const position of testPositions) {
      await page.mouse.move(position.x, position.y);
      
      // Wait a brief moment for smooth animation
      await page.waitForTimeout(50);
      
      const cursorBox = await cursor.boundingBox();
      expect(cursorBox).toBeTruthy();
      
      // Cursor should be near the mouse position (accounting for transform: translate(-50%, -50%))
      // We allow some tolerance for smooth animation delays
      expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - position.x)).toBeLessThan(20);
      expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - position.y)).toBeLessThan(20);
    }
  });

  test('should handle hover interactions', async ({ page }) => {
    const hoverArea1 = page.getByTestId('hover-area-1');
    const hoverArea2 = page.getByTestId('hover-area-2');
    const cursor = page.getByTestId('cursor-simple');
    
    // Move to hover area 1
    await hoverArea1.hover();
    await page.waitForTimeout(50);
    
    const area1Box = await hoverArea1.boundingBox();
    const cursor1Box = await cursor.boundingBox();
    expect(area1Box).toBeTruthy();
    expect(cursor1Box).toBeTruthy();
    
    // Verify cursor is within hover area bounds (with some tolerance)
    expect(cursor1Box!.x + cursor1Box!.width / 2).toBeGreaterThan(area1Box!.x - 10);
    expect(cursor1Box!.x + cursor1Box!.width / 2).toBeLessThan(area1Box!.x + area1Box!.width + 10);
    
    // Move to hover area 2
    await hoverArea2.hover();
    await page.waitForTimeout(50);
    
    const area2Box = await hoverArea2.boundingBox();
    const cursor2Box = await cursor.boundingBox();
    expect(area2Box).toBeTruthy();
    expect(cursor2Box).toBeTruthy();
    
    // Verify cursor moved to new position
    expect(cursor2Box!.x + cursor2Box!.width / 2).toBeGreaterThan(area2Box!.x - 10);
    expect(cursor2Box!.x + cursor2Box!.width / 2).toBeLessThan(area2Box!.x + area2Box!.width + 10);
  });

  test('should switch to container mode', async ({ page }) => {
    // Switch to container mode
    await page.getByTestId('toggle-container').click();
    await expect(page.getByTestId('toggle-container')).toContainText('Container Mode: ON');
    
    // Move mouse to activate container cursor
    const container = page.getByTestId('cursor-container');
    const containerBox = await container.boundingBox();
    await page.mouse.move(containerBox!.x + 100, containerBox!.y + 100);
    await page.waitForTimeout(100);
    
    // Verify global cursor is hidden and container cursor is visible
    await expect(page.getByTestId('custom-cursor-global')).not.toBeVisible();
    await expect(page.getByTestId('cursor-container')).toBeVisible();
    await expect(page.getByTestId('custom-cursor-container')).toBeVisible();
    await expect(page.getByTestId('cursor-container-element')).toBeVisible();
    
    // Verify container cursor styling
    const containerCursor = page.getByTestId('cursor-container-element');
    await expect(containerCursor).toHaveCSS('background-color', 'rgb(0, 255, 0)');
    await expect(containerCursor).toHaveCSS('border-radius', '50%');
  });

  test('should track mouse movement within container', async ({ page }) => {
    // Switch to container mode
    await page.getByTestId('toggle-container').click();
    await page.waitForTimeout(200);
    
    const container = page.getByTestId('cursor-container');
    const containerCursor = page.getByTestId('cursor-container-element');
    
    // Get container bounds
    const containerBox = await container.boundingBox();
    expect(containerBox).toBeTruthy();
    
    // Move mouse within container and verify cursor follows
    const containerCenterX = containerBox!.x + containerBox!.width / 2;
    const containerCenterY = containerBox!.y + containerBox!.height / 2;
    
    await page.mouse.move(containerCenterX, containerCenterY);
    await page.waitForTimeout(50);
    
    const cursorBox = await containerCursor.boundingBox();
    expect(cursorBox).toBeTruthy();
    
    // Verify cursor is positioned correctly within container
    expect(Math.abs(cursorBox!.x + cursorBox!.width / 2 - containerCenterX)).toBeLessThan(10);
    expect(Math.abs(cursorBox!.y + cursorBox!.height / 2 - containerCenterY)).toBeLessThan(10);
  });

  test('should maintain performance during rapid mouse movement', async ({ page }) => {
    const cursor = page.getByTestId('cursor-simple');
    
    // Perform rapid mouse movements
    const movements: { x: number; y: number }[] = [];
    for (let i = 0; i < 20; i++) {
      movements.push({
        x: 100 + (i * 20),
        y: 100 + Math.sin(i * 0.5) * 50
      });
    }
    
    const startTime = Date.now();
    
    for (const movement of movements) {
      await page.mouse.move(movement.x, movement.y);
      // Minimal delay to simulate realistic mouse movement
      await page.waitForTimeout(5);
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Verify cursor is still responsive after rapid movements
    await page.waitForTimeout(50);
    const finalCursorBox = await cursor.boundingBox();
    expect(finalCursorBox).toBeTruthy();
    
    // Performance expectation: Should handle 20 movements in reasonable time
    expect(totalTime).toBeLessThan(1000); // Should complete in under 1 second
    
    // Verify cursor is at final position
    const lastMovement = movements[movements.length - 1];
    expect(Math.abs(finalCursorBox!.x + finalCursorBox!.width / 2 - lastMovement.x)).toBeLessThan(15);
    expect(Math.abs(finalCursorBox!.y + finalCursorBox!.height / 2 - lastMovement.y)).toBeLessThan(15);
  });
}); 