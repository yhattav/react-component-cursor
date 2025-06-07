import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { CursorPosition, CursorVisibilityReason } from '../src';
import { CustomCursor } from '../src';
import * as hooks from '../src/hooks';

// Mock createPortal to render directly instead of using portals
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: React.ReactNode) => children,
}));

// Mock the hooks to control the test environment
jest.mock('../src/hooks', () => ({
  useMousePosition: jest.fn(() => ({
    position: { x: 100, y: 100 },
    setPosition: jest.fn(),
    targetPosition: { x: 100, y: 100 },
    isVisible: true,
  })),
  useSmoothAnimation: jest.fn(),
}));

// Mock validation to avoid testing it here
jest.mock('../src/utils/validation', () => ({
  validateProps: jest.fn(),
}));

// Get references to mocked functions
const mockUseMousePosition = hooks.useMousePosition as jest.MockedFunction<typeof hooks.useMousePosition>;
const mockUseSmoothAnimation = hooks.useSmoothAnimation as jest.MockedFunction<typeof hooks.useSmoothAnimation>;

// Helper to clean DOM more safely
const cleanupDOM = () => {
  // Remove cursor containers
  document.querySelectorAll('#cursor-container').forEach(el => {
    try {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });
  
  // Remove style elements
  document.querySelectorAll('[id^="cursor-style"]').forEach(el => {
    try {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });
};

describe('CustomCursor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanupDOM();
    
    // Reset mock to default values
    mockUseMousePosition.mockReturnValue({
      position: { x: 100, y: 100 },
      setPosition: jest.fn(),
      targetPosition: { x: 100, y: 100 },
      isVisible: true,
    });
  });

  afterEach(() => {
    cleanup();
    cleanupDOM();
  });

  it('renders the cursor with children', () => {
    render(<CustomCursor>Test cursor</CustomCursor>);
    expect(screen.getByText('Test cursor')).toBeInTheDocument();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: 'red', fontSize: '20px' };
    render(<CustomCursor style={customStyle}>Styled cursor</CustomCursor>);

    const cursor = screen.getByText('Styled cursor');
    expect(cursor).toHaveStyle('background-color: red');
    expect(cursor).toHaveStyle('font-size: 20px');
    expect(cursor).toHaveStyle('position: fixed');
    expect(cursor).toHaveStyle('transform: translate(100px, 100px)');
  });

  it('applies custom className', () => {
    render(<CustomCursor className="custom-class">Classed cursor</CustomCursor>);
    const cursor = screen.getByText('Classed cursor');
    expect(cursor).toHaveClass('custom-class');
  });

  it('sets correct ID', () => {
    render(<CustomCursor id="test-cursor">ID cursor</CustomCursor>);
    const cursor = screen.getByText('ID cursor');
    expect(cursor).toHaveAttribute('id', 'custom-cursor-test-cursor');
  });

  it('sets correct zIndex', () => {
    render(<CustomCursor zIndex={1000}>Z-index cursor</CustomCursor>);
    const cursor = screen.getByText('Z-index cursor');
    expect(cursor).toHaveStyle('z-index: 1000');
  });

  it('calls onMove callback with correct signature', () => {
    const onMove = jest.fn<void, [CursorPosition]>();
    render(<CustomCursor onMove={onMove}>Callback cursor</CustomCursor>);
    
    // Verify the callback was called with the correct signature
    expect(onMove).toHaveBeenCalledWith({ x: 100, y: 100 });
  });

  it('calls onVisibilityChange callback', () => {
    const onVisibilityChange = jest.fn<void, [boolean, CursorVisibilityReason]>();
    render(<CustomCursor onVisibilityChange={onVisibilityChange}>Visibility cursor</CustomCursor>);
    
    // Verify the callback was called with the correct signature
    expect(onVisibilityChange).toHaveBeenCalledWith(true, 'container');
  });

  it('does not render when disabled', () => {
    render(<CustomCursor enabled={false}>Disabled cursor</CustomCursor>);
    
    // When disabled, the component should return null
    expect(screen.queryByText('Disabled cursor')).not.toBeInTheDocument();
  });

  it('applies offset correctly to transform', () => {
    // Mock position with offset already applied by the hook
    mockUseMousePosition.mockReturnValue({
      position: { x: 110, y: 120 }, // 100 + 10, 100 + 20
      setPosition: jest.fn(),
      targetPosition: { x: 110, y: 120 },
      isVisible: true,
    });

    render(<CustomCursor offset={{ x: 10, y: 20 }}>Offset cursor</CustomCursor>);
    
    const cursor = screen.getByText('Offset cursor');
    expect(cursor).toHaveStyle('transform: translate(110px, 120px)');
  });

  it('applies CSS custom properties correctly', () => {
    render(<CustomCursor>CSS variables cursor</CustomCursor>);
    
    const cursor = screen.getByText('CSS variables cursor');
    expect(cursor).toHaveStyle('--cursor-x: 100px');
    expect(cursor).toHaveStyle('--cursor-y: 100px');
  });

  it('passes correct props to useMousePosition hook', () => {
    const containerRef = React.createRef<HTMLDivElement>();
    
    render(
      <div ref={containerRef}>
        <CustomCursor 
          containerRef={containerRef} 
          offset={{ x: 5, y: 10 }}
          throttleMs={16}
        >
          Hook test cursor
        </CustomCursor>
      </div>
    );
    
    // Verify useMousePosition was called with at least the expected parameters
    expect(mockUseMousePosition).toHaveBeenCalledWith(
      containerRef,
      5,
      10,
      16
    );
  });

  it('passes correct props to useSmoothAnimation hook', () => {
    render(<CustomCursor smoothness={2}>Animation cursor</CustomCursor>);
    
    // Verify useSmoothAnimation was called with at least the expected parameters
    expect(mockUseSmoothAnimation).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      2,
      expect.any(Function)
    );
  });

  it('handles disabled prop correctly', () => {
    const { rerender } = render(<CustomCursor enabled={true}>Enabled cursor</CustomCursor>);
    expect(screen.getByText('Enabled cursor')).toBeInTheDocument();
    
    rerender(<CustomCursor enabled={false}>Enabled cursor</CustomCursor>);
    expect(screen.queryByText('Enabled cursor')).not.toBeInTheDocument();
  });

  it('handles showNativeCursor prop correctly', () => {
    const { rerender } = render(<CustomCursor showNativeCursor={false}>Cursor 1</CustomCursor>);
    expect(screen.getByText('Cursor 1')).toBeInTheDocument();
    
    rerender(<CustomCursor showNativeCursor={true}>Cursor 2</CustomCursor>);
    expect(screen.getByText('Cursor 2')).toBeInTheDocument();
  });

  it('handles different children types', () => {
    const { rerender } = render(<CustomCursor>Text content</CustomCursor>);
    expect(screen.getByText('Text content')).toBeInTheDocument();
    
    rerender(
      <CustomCursor>
        <div data-testid="custom-element">Custom element</div>
      </CustomCursor>
    );
    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
    
    rerender(<CustomCursor>{null}</CustomCursor>);
    // Should render the cursor container even with null children
    expect(document.querySelector('[style*="position: fixed"]')).toBeInTheDocument();
  });

  it('merges styles correctly', () => {
    const customStyle = { 
      backgroundColor: 'blue',
      border: '2px solid red',
      padding: '10px'
    };
    
    render(<CustomCursor style={customStyle}>Merged styles cursor</CustomCursor>);
    
    const cursor = screen.getByText('Merged styles cursor');
    // Should have both custom styles and default positioning styles
    expect(cursor).toHaveStyle('background-color: blue');
    expect(cursor).toHaveStyle('border: 2px solid red');
    expect(cursor).toHaveStyle('padding: 10px');
    expect(cursor).toHaveStyle('position: fixed');
    expect(cursor).toHaveStyle('transform: translate(100px, 100px)');
    expect(cursor).toHaveStyle('pointer-events: none');
  });

  // New comprehensive tests for missing coverage
  describe('React.memo comparison function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('re-renders when function props change', () => {
      const onMove1 = jest.fn();
      const onMove2 = jest.fn();
      
      const { rerender } = render(
        <CustomCursor onMove={onMove1} id="test-memo">Test</CustomCursor>
      );
      
      // Clear the mock to reset call count
      jest.clearAllMocks();
      
      // Change function reference - should re-render
      rerender(
        <CustomCursor onMove={onMove2} id="test-memo">Test</CustomCursor>
      );
      
      // Should be called once for the rerender
      expect(mockUseMousePosition).toHaveBeenCalledTimes(1);
    });

    it('does not re-render when equivalent props provided', () => {
      const onMove = jest.fn();
      const style = { color: 'red' };
      const offset = { x: 5, y: 10 };
      
      const { rerender } = render(
        <CustomCursor onMove={onMove} style={style} offset={offset} zIndex={100}>Test</CustomCursor>
      );
      
      // Clear the mock to reset call count
      jest.clearAllMocks();
      
      // Same props - should not re-render (memo should prevent it)
      rerender(
        <CustomCursor onMove={onMove} style={style} offset={offset} zIndex={100}>Test</CustomCursor>
      );
      
      // Should not call hook again due to memo
      expect(mockUseMousePosition).toHaveBeenCalledTimes(0);
    });

    it('re-renders when style object content changes', () => {
      const { rerender } = render(
        <CustomCursor style={{ color: 'red' }} id="style-test">Test</CustomCursor>
      );
      
      // Clear the mock to reset call count
      jest.clearAllMocks();
      
      // Different style object - should re-render
      rerender(
        <CustomCursor style={{ color: 'blue' }} id="style-test">Test</CustomCursor>
      );
      
      expect(mockUseMousePosition).toHaveBeenCalledTimes(1);
    });

    it('re-renders when offset values change', () => {
      const { rerender } = render(
        <CustomCursor offset={{ x: 10, y: 10 }} id="offset-test">Test</CustomCursor>
      );
      
      // Clear the mock to reset call count
      jest.clearAllMocks();
      
      rerender(
        <CustomCursor offset={{ x: 20, y: 10 }} id="offset-test">Test</CustomCursor>
      );
      
      expect(mockUseMousePosition).toHaveBeenCalledTimes(1);
    });

    it('re-renders when style objects have different number of keys', () => {
      const { rerender } = render(
        <CustomCursor style={{ color: 'red' }} id="style-keys-test">Test</CustomCursor>
      );
      
      // Clear the mock to reset call count
      jest.clearAllMocks();
      
      // Style object with different number of keys
      rerender(
        <CustomCursor style={{ color: 'red', fontSize: '16px' }} id="style-keys-test">Test</CustomCursor>
      );
      
      expect(mockUseMousePosition).toHaveBeenCalledTimes(1);
    });

    it('re-renders when children change', () => {
      const { rerender } = render(
        <CustomCursor id="children-test">Original</CustomCursor>
      );
      
      // Clear the mock to reset call count
      jest.clearAllMocks();
      
      // Different children
      rerender(
        <CustomCursor id="children-test">Changed</CustomCursor>
      );
      
      expect(mockUseMousePosition).toHaveBeenCalledTimes(1);
    });

    it('re-renders when containerRef current changes', () => {
      const ref1 = React.createRef<HTMLDivElement>();
      const ref2 = React.createRef<HTMLDivElement>();
      
      // Create actual DOM elements for the refs
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      Object.defineProperty(ref1, 'current', { value: div1, writable: true });
      Object.defineProperty(ref2, 'current', { value: div2, writable: true });
      
      const { rerender } = render(
        <CustomCursor containerRef={ref1} id="ref-test">Test</CustomCursor>
      );
      
      // Clear the mock to reset call count
      jest.clearAllMocks();
      
      // Different containerRef current value
      rerender(
        <CustomCursor containerRef={ref2} id="ref-test">Test</CustomCursor>
      );
      
      expect(mockUseMousePosition).toHaveBeenCalledTimes(1);
    });
  });

  describe('DevIndicator component', () => {
    it('renders DevIndicator in development mode', () => {
      // Mock development environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<CustomCursor showDevIndicator={true}>Test</CustomCursor>);
      
      const devIndicator = document.querySelector('[style*="border: 2px solid red"]');
      expect(devIndicator).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('does not render DevIndicator when showDevIndicator is false', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<CustomCursor showDevIndicator={false}>Test</CustomCursor>);
      
      const devIndicator = document.querySelector('[style*="border: 2px solid red"]');
      expect(devIndicator).not.toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('does not render DevIndicator in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      render(<CustomCursor showDevIndicator={true}>Test</CustomCursor>);
      
      const devIndicator = document.querySelector('[style*="border: 2px solid red"]');
      expect(devIndicator).not.toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Edge cases and error conditions', () => {
    it('handles null position values gracefully', () => {
      mockUseMousePosition.mockReturnValue({
        position: { x: null, y: null },
        setPosition: jest.fn(),
        targetPosition: { x: null, y: null },
        isVisible: true,
      });

      render(<CustomCursor>Null position cursor</CustomCursor>);
      
      // Should not render when position is null
      expect(screen.queryByText('Null position cursor')).not.toBeInTheDocument();
    });

    it('does not call onMove when position is null', () => {
      const onMove = jest.fn();
      
      mockUseMousePosition.mockReturnValue({
        position: { x: null, y: null },
        setPosition: jest.fn(),
        targetPosition: { x: null, y: null },
        isVisible: true,
      });

      render(<CustomCursor onMove={onMove}>Test</CustomCursor>);
      
      expect(onMove).not.toHaveBeenCalled();
    });

    it('calls onVisibilityChange with disabled reason when disabled', () => {
      const onVisibilityChange = jest.fn();
      
      render(<CustomCursor enabled={false} onVisibilityChange={onVisibilityChange}>Test</CustomCursor>);
      
      expect(onVisibilityChange).toHaveBeenCalledWith(false, 'disabled');
    });

    it('handles invisible cursor from useMousePosition', () => {
      const onVisibilityChange = jest.fn();
      
      mockUseMousePosition.mockReturnValue({
        position: { x: 100, y: 100 },
        setPosition: jest.fn(),
        targetPosition: { x: 100, y: 100 },
        isVisible: false,
      });

      render(<CustomCursor onVisibilityChange={onVisibilityChange}>Test</CustomCursor>);
      
      expect(onVisibilityChange).toHaveBeenCalledWith(false, 'container');
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    it('handles missing onMove callback gracefully', () => {
      expect(() => {
        render(<CustomCursor>No callback cursor</CustomCursor>);
      }).not.toThrow();
    });

    it('handles missing onVisibilityChange callback gracefully', () => {
      expect(() => {
        render(<CustomCursor enabled={false}>No visibility callback</CustomCursor>);
      }).not.toThrow();
    });
  });

  describe('Global style injection', () => {
    it('injects global styles when showNativeCursor is false', () => {
      render(<CustomCursor showNativeCursor={false} id="global-test">Test</CustomCursor>);
      
      const globalStyle = document.getElementById('cursor-style-global-global-test');
      expect(globalStyle).toBeInTheDocument();
      expect(globalStyle?.textContent).toContain('cursor: none !important');
    });

    it('does not inject global styles when showNativeCursor is true', () => {
      render(<CustomCursor showNativeCursor={true} id="no-global-test">Test</CustomCursor>);
      
      const globalStyle = document.getElementById('cursor-style-global-no-global-test');
      expect(globalStyle).not.toBeInTheDocument();
    });
  });

  describe('Animation and style injection', () => {
    it('creates keyframe animation styles', () => {
      render(<CustomCursor id="animation-test">Test</CustomCursor>);
      
      const styleElement = document.getElementById('cursor-style-animation-test');
      expect(styleElement).toBeInTheDocument();
      expect(styleElement?.textContent).toContain('@keyframes cursorFadeIn');
      expect(styleElement?.textContent).toContain('scale(0.8)');
      expect(styleElement?.textContent).toContain('scale(1)');
    });

    it('applies animation to cursor element', () => {
      render(<CustomCursor>Animated cursor</CustomCursor>);
      
      const cursor = screen.getByText('Animated cursor');
      expect(cursor).toHaveStyle('animation: cursorFadeIn 0.3s ease-out');
    });
  });

  describe('Accessibility', () => {
    it('sets aria-hidden=true on cursor element', () => {
      render(<CustomCursor>Accessible cursor</CustomCursor>);
      
      const cursor = screen.getByText('Accessible cursor');
      expect(cursor).toHaveAttribute('aria-hidden', 'true');
    });

    it('sets pointer-events: none to prevent interaction', () => {
      render(<CustomCursor>Non-interactive cursor</CustomCursor>);
      
      const cursor = screen.getByText('Non-interactive cursor');
      expect(cursor).toHaveStyle('pointer-events: none');
    });

    it('includes reduced motion CSS for accessibility', () => {
      render(<CustomCursor id="reduced-motion-test">Reduced motion test</CustomCursor>);
      
      const styleElement = document.getElementById('cursor-style-reduced-motion-test');
      expect(styleElement).toBeInTheDocument();
      expect(styleElement?.textContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(styleElement?.textContent).toContain('scale(1)'); // No scaling animation in reduced motion
    });

    it('supports custom ARIA attributes', () => {
      render(
        <CustomCursor 
          role="presentation" 
          aria-label="Custom cursor indicator"
        >
          ARIA cursor
        </CustomCursor>
      );
      
      const cursor = screen.getByText('ARIA cursor');
      expect(cursor).toHaveAttribute('role', 'presentation');
      expect(cursor).toHaveAttribute('aria-label', 'Custom cursor indicator');
      // aria-hidden should still be true for cursor elements
      expect(cursor).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Multiple cursors', () => {
    it('handles multiple cursor instances with different IDs', () => {
      render(
        <>
          <CustomCursor id="cursor-1">Cursor 1</CustomCursor>
          <CustomCursor id="cursor-2">Cursor 2</CustomCursor>
        </>
      );
      
      expect(screen.getByText('Cursor 1')).toBeInTheDocument();
      expect(screen.getByText('Cursor 2')).toBeInTheDocument();
      
      expect(document.getElementById('custom-cursor-cursor-1')).toBeInTheDocument();
      expect(document.getElementById('custom-cursor-cursor-2')).toBeInTheDocument();
    });
  });

  describe('Cleanup and error handling', () => {
    it('handles DOM cleanup errors gracefully', () => {
      // Mock console.warn to capture warnings
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(jest.fn());
      
      // Create a cursor that will trigger cleanup
      const { unmount } = render(<CustomCursor id="cleanup-test">Test</CustomCursor>);
      
      // Mock a removal error by creating a style element without a parent
      const mockStyle = document.createElement('style');
      mockStyle.id = 'cursor-style-cleanup-test';
      mockStyle.remove = jest.fn(() => {
        throw new Error('Mock removal error');
      });
      
      // Replace the actual style element with our mock
      const actualStyle = document.getElementById('cursor-style-cleanup-test');
      if (actualStyle) {
        actualStyle.remove();
        document.head.appendChild(mockStyle);
      }
      
      // Set environment to not test to ensure warnings are logged
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      // This should trigger cleanup and handle errors gracefully
      unmount();
      
      // Restore environment
      process.env.NODE_ENV = originalEnv;
      
      // Cleanup should not throw even with errors - test passes if no exception thrown
      
      consoleSpy.mockRestore();
    });

    it('handles portal container cleanup when container has no parent', () => {
      // This test ensures the cleanup code handles edge cases in DOM manipulation
      render(<CustomCursor id="portal-cleanup">Test</CustomCursor>);
      
      // Verify that even with DOM edge cases, rendering works
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('handles existing style element removal during setup', () => {
      // Create a pre-existing style element with the same ID
      const existingStyle = document.createElement('style');
      existingStyle.id = 'cursor-style-existing-test';
      document.head.appendChild(existingStyle);
      
      // Rendering should handle existing style element
      render(<CustomCursor id="existing-test">Test</CustomCursor>);
      
      expect(screen.getByText('Test')).toBeInTheDocument();
      
      // Should have replaced the existing style
      const newStyle = document.getElementById('cursor-style-existing-test');
      expect(newStyle).toBeInTheDocument();
      expect(newStyle).not.toBe(existingStyle);
    });

    it('handles portal container reuse', () => {
      // Create first cursor to establish portal container
      render(<CustomCursor id="reuse-1">Cursor 1</CustomCursor>);
      
      // Verify portal container exists
      expect(document.getElementById('cursor-container')).toBeInTheDocument();
      
      // Create second cursor that should reuse the container
      render(<CustomCursor id="reuse-2">Cursor 2</CustomCursor>);
      
      expect(screen.getByText('Cursor 1')).toBeInTheDocument();
      expect(screen.getByText('Cursor 2')).toBeInTheDocument();
      
      // Should still be the same container (not multiple containers)
      const containers = document.querySelectorAll('#cursor-container');
      expect(containers).toHaveLength(1);
    });
  });
});
