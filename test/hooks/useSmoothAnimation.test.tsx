import { renderHook, act } from '@testing-library/react';
import { useSmoothAnimation } from '../../src/hooks';

describe('useSmoothAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('smoothly animates position changes', () => {
    const setPosition = jest.fn();
    const targetPosition = { x: 100, y: 100 };

    renderHook(() => useSmoothAnimation(targetPosition, 0.5, setPosition));

    jest.advanceTimersByTime(16); // One frame
    expect(setPosition).toHaveBeenCalled();
  });

  it('uses requestAnimationFrame for smooth animations', () => {
    const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
    const cancelRafSpy = jest.spyOn(global, 'cancelAnimationFrame');
    const setPosition = jest.fn();
    const targetPosition = { x: 100, y: 100 };

    const { unmount } = renderHook(() => 
      useSmoothAnimation(targetPosition, 2, setPosition)
    );

    expect(rafSpy).toHaveBeenCalled();

    unmount();
    expect(cancelRafSpy).toHaveBeenCalled();

    rafSpy.mockRestore();
    cancelRafSpy.mockRestore();
  });

    it('smoothly interpolates between positions', () => {
    const setPosition = jest.fn();
    const targetPosition = { x: 100, y: 100 };
    
    // Use a smoothing factor > 1 to trigger animation
    renderHook(() => useSmoothAnimation(targetPosition, 5, setPosition));

    // Advance fake timers to trigger animation frame
    act(() => {
      jest.advanceTimersByTime(16);
    });

    // Should have called setPosition during animation
    expect(setPosition).toHaveBeenCalled();
  });

  it('skips animation when smoothness is 1', () => {
    const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
    const setPosition = jest.fn();
    const targetPosition = { x: 100, y: 100 };

    renderHook(() => useSmoothAnimation(targetPosition, 1, setPosition));

    // Should set position directly without RAF
    expect(setPosition).toHaveBeenCalledWith(targetPosition);
    expect(rafSpy).not.toHaveBeenCalled();

    rafSpy.mockRestore();
  });

  it('handles null positions correctly', () => {
    const setPosition = jest.fn();
    const targetPosition = { x: null, y: null };

    expect(() => {
      renderHook(() => useSmoothAnimation(targetPosition, 2, setPosition));
    }).not.toThrow();
  });

  it('cancels previous animation when target changes', () => {
    const cancelRafSpy = jest.spyOn(global, 'cancelAnimationFrame');
    const setPosition = jest.fn();
    
    const { rerender } = renderHook(
      ({ target }) => useSmoothAnimation(target, 2, setPosition),
      { initialProps: { target: { x: 100, y: 100 } } }
    );

    // Change target position
    rerender({ target: { x: 200, y: 200 } });

    expect(cancelRafSpy).toHaveBeenCalled();

    cancelRafSpy.mockRestore();
  });

  it('respects smoothness factor in calculations', () => {
    const setPosition = jest.fn();
    const targetPosition = { x: 100, y: 100 };
    
    // The hook should use RAF for smooth animations when smoothness > 1
    const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
    
    renderHook(() => useSmoothAnimation(targetPosition, 5, setPosition));
    
    expect(rafSpy).toHaveBeenCalled();
    
    rafSpy.mockRestore();
  });

  it('stops animating when reaching threshold', () => {
    const setPosition = jest.fn();
    
    // Mock setPosition to simulate position updates
    setPosition.mockImplementation((updateFn) => {
      if (typeof updateFn === 'function') {
        const currentPos = { x: 99.9, y: 99.9 }; // Very close to target
        const newPos = updateFn(currentPos);
        // Position should not change much due to threshold
        expect(Math.abs(newPos.x - currentPos.x)).toBeLessThan(1);
      }
    });

    const targetPosition = { x: 100, y: 100 };

    renderHook(() => useSmoothAnimation(targetPosition, 10, setPosition));

    act(() => {
      jest.advanceTimersByTime(100);
    });
  });
});
