import React, { useRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomCursor } from '../src/index';

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

describe('Initial Hover Detection Bug', () => {
  beforeEach(() => {
    // Clean up any existing DOM
    document.body.innerHTML = '';
  });

  it('should show cursor immediately when mouse enters container (currently fails - demonstrates bug)', async () => {
    render(<TestComponent />);
    
    const cursorContainer = screen.getByTestId('cursor-container');
    expect(cursorContainer).toBeInTheDocument();
    
    // Initially, cursor should not be visible
    let cursorContent = screen.queryByTestId('cursor-content');
    expect(cursorContent).not.toBeInTheDocument();
    
    // Simulate mouse entering the container
    fireEvent.mouseEnter(cursorContainer);
    
    // BUG: The cursor should be visible immediately after mouseenter
    // but currently it's not until mousemove happens
    
    // Wait a bit to see if cursor appears
    await waitFor(() => {
      cursorContent = screen.queryByTestId('cursor-content');
    }, { timeout: 100 });
    
    // This assertion SHOULD PASS when bug is fixed, currently FAILS
    // demonstrating that cursor doesn't appear on mouseenter alone
    expect(cursorContent).toBeInTheDocument();
  });

  it('should show cursor after mouseenter + mousemove (current working behavior)', async () => {
    render(<TestComponent />);
    
    const cursorContainer = screen.getByTestId('cursor-container');
    
    // Initially, cursor should not be visible
    let cursorContent = screen.queryByTestId('cursor-content');
    expect(cursorContent).not.toBeInTheDocument();
    
    // Simulate mouse entering the container
    fireEvent.mouseEnter(cursorContainer);
    
    // Then simulate mouse movement
    fireEvent.mouseMove(cursorContainer, {
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
    render(<TestComponent />);
    
    const cursorContainer = screen.getByTestId('cursor-container');
    
    // Make cursor visible first
    fireEvent.mouseEnter(cursorContainer);
    fireEvent.mouseMove(cursorContainer, {
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