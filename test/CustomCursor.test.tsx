import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { CustomCursor } from '../src';

describe('CustomCursor', () => {
  // Helper to simulate mouse movement
  const simulateMouseMove = (x: number, y: number) => {
    fireEvent.mouseMove(document, {
      clientX: x,
      clientY: y,
    });
  };

  beforeEach(() => {
    // Reset any cursor containers from previous tests
    const container = document.getElementById('cursor-container');
    if (container) {
      document.body.removeChild(container);
    }
  });

  it('renders without crashing', () => {
    render(<CustomCursor />);
    expect(document.getElementById('cursor-container')).toBeInTheDocument();
  });

  it('creates and removes cursor container properly', () => {
    const { unmount } = render(<CustomCursor />);
    expect(document.getElementById('cursor-container')).toBeInTheDocument();

    unmount();
    expect(document.getElementById('cursor-container')).not.toBeInTheDocument();
  });

  it('follows mouse movement', () => {
    render(<CustomCursor />);

    act(() => {
      simulateMouseMove(100, 100);
      jest.advanceTimersByTime(100);
    });

    const cursor = document.querySelector('[id^="custom-cursor-"]');
    expect(cursor).toHaveStyle({
      transform: 'translate(100px, 100px)',
    });
  });

  it('respects offset props', () => {
    render(<CustomCursor offsetX={10} offsetY={20} />);

    act(() => {
      simulateMouseMove(100, 100);
      jest.advanceTimersByTime(100);
    });

    const cursor = document.querySelector('[id^="custom-cursor-"]');
    expect(cursor).toHaveStyle({
      transform: 'translate(110px, 120px)',
    });
  });

  it('calls onMove callback with cursor position', () => {
    const onMove = jest.fn();
    render(<CustomCursor onMove={onMove} />);

    act(() => {
      simulateMouseMove(100, 100);
      jest.advanceTimersByTime(100);
    });

    expect(onMove).toHaveBeenCalledWith(100, 100);
  });

  it('applies custom styles', async () => {
    const customStyle = { backgroundColor: 'red' };
    render(<CustomCursor style={customStyle} />);

    await act(async () => {
      simulateMouseMove(100, 100);
      jest.advanceTimersByTime(100);
    });

    // Look in the document body instead of the container
    const cursor = document.querySelector('[id^="custom-cursor-"]');
    expect(cursor).toHaveStyle({ backgroundColor: 'red' });
  });

  it('handles container-specific cursor behavior', async () => {
    const containerRef = React.createRef<HTMLDivElement>();

    render(
      <>
        <div
          id="test-container"
          ref={containerRef}
          style={{
            width: '200px',
            height: '200px',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        ></div>
        <CustomCursor containerRef={containerRef} />
      </>
    );
    if (!containerRef.current) throw new Error('Container ref not found');
    jest.spyOn(containerRef.current, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    await act(async () => {
      if (!containerRef.current) throw new Error('Container ref not found');
      console.log(containerRef.current);
      // First trigger mouseEnter to set isVisible
      fireEvent.mouseEnter(containerRef.current, {
        clientX: 50,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      });

      // Then trigger mousemove ON THE CONTAINER to set position
      fireEvent.mouseMove(containerRef.current, {
        clientX: 50,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      });

      jest.runAllTimers();
    });

    const cursor = document.querySelector('[id^="custom-cursor-"]');
    console.log('Found cursor:', !!cursor);

    expect(cursor).toBeInTheDocument();
  });
});
