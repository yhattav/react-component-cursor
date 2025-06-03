import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { CursorPosition } from '../src';
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

// Get references to mocked functions
const mockUseMousePosition = hooks.useMousePosition as jest.MockedFunction<typeof hooks.useMousePosition>;
const mockUseSmoothAnimation = hooks.useSmoothAnimation as jest.MockedFunction<typeof hooks.useSmoothAnimation>;

describe('CustomCursor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock to default values
    mockUseMousePosition.mockReturnValue({
      position: { x: 100, y: 100 },
      setPosition: jest.fn(),
      targetPosition: { x: 100, y: 100 },
      isVisible: true,
    });
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
    const onVisibilityChange = jest.fn<void, [boolean, 'container' | 'disabled']>();
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
});
