import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomCursor } from '../src';
import { MouseTracker } from '../src/utils/MouseTracker';

const DebugTestComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        ref={containerRef}
        data-testid="container"
        style={{
          width: 200,
          height: 200,
          backgroundColor: 'lightblue',
          position: 'relative'
        }}
      >
        Container
      </div>
      <CustomCursor 
        containerRef={containerRef}
        data-testid="cursor"
        showDevIndicator={false}
      >
        <div data-testid="cursor-content">🔥</div>
      </CustomCursor>
    </div>
  );
};

describe.skip('Debug Behavior Test', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    MouseTracker.resetInstance();
  });

  afterEach(() => {
    MouseTracker.resetInstance();
  });

  it('should debug cursor behavior step by step', () => {
    render(<DebugTestComponent />);
    
    console.log('=== STEP 1: Initial state ===');
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();

    // Check initial cursor state
    let cursorContent = screen.queryByTestId('cursor-content');
    console.log('Initial cursor visible:', !!cursorContent);
    expect(cursorContent).not.toBeInTheDocument();

    console.log('=== STEP 2: Mouse move on document (should not show cursor) ===');
    fireEvent.mouseMove(document, { clientX: 50, clientY: 50 });
    
    cursorContent = screen.queryByTestId('cursor-content');
    console.log('After document mousemove, cursor visible:', !!cursorContent);
    expect(cursorContent).not.toBeInTheDocument();

    console.log('=== STEP 3: Mouse move inside container (should show cursor) ===');
    // Use global mouse movement instead of container-specific movement
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    
    cursorContent = screen.queryByTestId('cursor-content');
    console.log('After container mousemove, cursor visible:', !!cursorContent);
    
    // Let's see what elements are actually in the DOM
    console.log('DOM content:', document.body.innerHTML);
    
    if (!cursorContent) {
      console.log('Cursor still not visible - checking for any cursor elements');
      const allCursorElements = document.querySelectorAll('[data-testid*="cursor"]');
      console.log('All cursor elements found:', allCursorElements.length);
      allCursorElements.forEach((el, i) => {
        console.log(`Cursor element ${i}:`, el.outerHTML);
      });
    }
  });
}); 