import React, { useRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomCursor } from '../src/index';
import { MouseTracker } from '../src/utils/MouseTracker';

// Simple test component
function TestComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div 
        ref={containerRef}
        data-testid="cursor-container"
        style={{ 
          width: 300, 
          height: 200, 
          background: 'lightblue'
        }}
      >
        <CustomCursor
          containerRef={containerRef}
          data-testid="custom-cursor"
        >
          <div data-testid="cursor-content">Test Cursor</div>
        </CustomCursor>
        
        <p>Container content</p>
      </div>
    </div>
  );
}

describe.skip('Initial Hover Detection Bug', () => {
  // Expected behavior:
  // 1. Page loads with mouse already inside container → Cursor should be hidden
  // 2. Mouse moves inside container → Cursor should appear at correct position  
  // 3. Mouse enters container from outside → Cursor should appear immediately
  
  let container: HTMLElement;

  beforeEach(() => {
    // Clean up any existing DOM
    document.body.innerHTML = '';
    // Reset MouseTracker singleton between tests
    MouseTracker.resetInstance();
    // Create a clean container for each test
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // More thorough cleanup
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    document.body.innerHTML = '';
    // Clean up MouseTracker after each test
    MouseTracker.resetInstance();
  });

  it('should NOT show cursor when page loads with mouse already inside container', async () => {
    render(<TestComponent />, { container });
    
    const cursorContainer = screen.getByTestId('cursor-container');
    expect(cursorContainer).toBeInTheDocument();
    
    // Simulate the scenario: mouse is already inside when page loads
    // This means no mouseenter event, but MouseTracker detects position
    fireEvent.mouseMove(document, { clientX: 150, clientY: 100 });
    
    // Wait a bit to see if cursor appears (it shouldn't)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Cursor should NOT be visible yet (we don't know if it's actually inside)
    let cursorContent = screen.queryByTestId('cursor-content');
    expect(cursorContent).not.toBeInTheDocument();
    
    // Only when mouse actually moves inside the container should it appear
    fireEvent.mouseMove(cursorContainer, { clientX: 150, clientY: 100 });
    
    // Now cursor should appear
    await waitFor(() => {
      cursorContent = screen.queryByTestId('cursor-content');
      expect(cursorContent).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('should show cursor when mouse enters container from outside', async () => {
    render(<TestComponent />, { container });
    
    const cursorContainer = screen.getByTestId('cursor-container');
    expect(cursorContainer).toBeInTheDocument();
    
    // Initially, cursor should not be visible
    let cursorContent = screen.queryByTestId('cursor-content');
    expect(cursorContent).not.toBeInTheDocument();
    
    // Simulate global mouse movement into container bounds (replaces mouseenter)
    fireEvent.mouseMove(document, { clientX: 150, clientY: 100 });
    
    // Cursor should be visible after movement into bounds
    await waitFor(() => {
      cursorContent = screen.queryByTestId('cursor-content');
      expect(cursorContent).toBeInTheDocument();
    }, { timeout: 500 });
    
    expect(cursorContent).toBeInTheDocument();
  });

  it('should show cursor after mouseenter + mousemove (current working behavior)', async () => {
    render(<TestComponent />, { container });
    
    screen.getByTestId('cursor-container');
    
    // Initially, cursor should not be visible
    let cursorContent = screen.queryByTestId('cursor-content');
    expect(cursorContent).not.toBeInTheDocument();
    
    // Simulate global mouse movement into container bounds
    fireEvent.mouseMove(document, {
      clientX: 150,
      clientY: 100,
    });
    
    // Wait for cursor to appear
    await waitFor(() => {
      cursorContent = screen.queryByTestId('cursor-content');
      expect(cursorContent).toBeInTheDocument();
    });
    
    // This should work with current implementation
    expect(cursorContent).toBeVisible();
  });

  it('should hide cursor when mouse leaves container', async () => {
    render(<TestComponent />, { container });
    
    const cursorContainer = screen.getByTestId('cursor-container');
    
    // Make cursor visible first with global mouse movement
    fireEvent.mouseMove(document, {
      clientX: 150,
      clientY: 100,
    });
    
    // Wait for cursor to appear
    await waitFor(() => {
      const cursorContent = screen.queryByTestId('cursor-content');
      expect(cursorContent).toBeInTheDocument();
    });
    
    // Now simulate mouse leaving
    fireEvent.mouseLeave(cursorContainer);
    
    // Cursor should become invisible/hidden
    // Note: This might not remove from DOM but should hide via CSS
    const cursorContent = screen.queryByTestId('cursor-content');
    if (cursorContent) {
      // Check if it's hidden via CSS or removed from DOM
      const isHidden = cursorContent.style.opacity === '0' || 
                      cursorContent.style.display === 'none' ||
                      !cursorContent.parentElement;
      expect(isHidden).toBe(true);
    }
  });
}); 