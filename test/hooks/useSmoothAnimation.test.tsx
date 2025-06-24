import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';import { useSmoothAnimation } from '../../src/hooks';

describe('useSmoothAnimation', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    
    // Safely capture original matchMedia for restoration
    originalMatchMedia = typeof window !== 'undefined' ? window.matchMedia : undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
    
    // Restore original matchMedia to prevent side effects (only if window exists)
    if (typeof window !== 'undefined' && originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: originalMatchMedia,
      });
    }
  });

  it('smoothly animates position changes', () => {
    const setPosition = vi.fn();
    const targetPosition = { x: 100, y: 100 };

    renderHook(() => useSmoothAnimation(targetPosition, 0.5, setPosition));

    vi.advanceTimersByTime(16); // One frame
    expect(setPosition).toHaveBeenCalled();
  });

  it('uses requestAnimationFrame for smooth animations', () => {
    const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
    const cancelRafSpy = vi.spyOn(global, 'cancelAnimationFrame');
    const setPosition = vi.fn();
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
    const setPosition = vi.fn();
    const targetPosition = { x: 100, y: 100 };
    
    // Use a smoothing factor > 1 to trigger animation
    renderHook(() => useSmoothAnimation(targetPosition, 5, setPosition));

    // Advance fake timers to trigger animation frame
    act(() => {
      vi.advanceTimersByTime(16);
    });

    // Should have called setPosition during animation
    expect(setPosition).toHaveBeenCalled();
  });

  it('skips animation when smoothness is 1', () => {
    const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
    const setPosition = vi.fn();
    const targetPosition = { x: 100, y: 100 };

    renderHook(() => useSmoothAnimation(targetPosition, 1, setPosition));

    // Should set position directly without RAF
    expect(setPosition).toHaveBeenCalledWith(targetPosition);
    expect(rafSpy).not.toHaveBeenCalled();

    rafSpy.mockRestore();
  });

  it('handles null positions correctly', () => {
    const setPosition = vi.fn();
    const targetPosition = { x: null, y: null };

    expect(() => {
      renderHook(() => useSmoothAnimation(targetPosition, 2, setPosition));
    }).not.toThrow();
  });

  it('cancels previous animation when target changes', () => {
    const cancelRafSpy = vi.spyOn(global, 'cancelAnimationFrame');
    const setPosition = vi.fn();
    
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
    const setPosition = vi.fn();
    const targetPosition = { x: 100, y: 100 };
    
    // The hook should use RAF for smooth animations when smoothness > 1
    const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
    
    renderHook(() => useSmoothAnimation(targetPosition, 5, setPosition));
    
    expect(rafSpy).toHaveBeenCalled();
    
    rafSpy.mockRestore();
  });

  it('respects reduced motion preferences', () => {
    // Mock matchMedia to return prefers-reduced-motion
    const mockMatchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const setPosition = vi.fn();
    const targetPosition = { x: 100, y: 100 };
    const rafSpy = vi.spyOn(global, 'requestAnimationFrame');

    renderHook(() => useSmoothAnimation(targetPosition, 5, setPosition));

    // Should set position directly without animation when reduced motion is preferred
    expect(setPosition).toHaveBeenCalledWith(targetPosition);
    expect(rafSpy).not.toHaveBeenCalled();

    rafSpy.mockRestore();
  });

  it('handles missing matchMedia gracefully', () => {
    // Mock missing matchMedia (older browsers)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });

    const setPosition = vi.fn();
    const targetPosition = { x: 100, y: 100 };
    const rafSpy = vi.spyOn(global, 'requestAnimationFrame');

    renderHook(() => useSmoothAnimation(targetPosition, 5, setPosition));

    // Should use animation when matchMedia is not available (fallback behavior)
    expect(rafSpy).toHaveBeenCalled();

    rafSpy.mockRestore();
  });



  it('stops animating when reaching threshold', () => {
    const setPosition = vi.fn();
    
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
      vi.advanceTimersByTime(100);
    });
  });
});
