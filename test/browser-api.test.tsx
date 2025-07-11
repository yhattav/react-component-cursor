import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { CustomCursor } from '../src';
import { useMousePosition } from '../src/hooks';

describe('Browser API Integration', () => {
  beforeEach(async () => {
    // Clean up any lingering instances from previous tests
    const { CursorCoordinator } = await import('../src/utils/CursorCoordinator');
    const { MouseTracker } = await import('../src/utils/MouseTracker');
    CursorCoordinator.resetInstance();
    MouseTracker.resetInstance();
    vi.clearAllMocks();
  });
  describe('requestAnimationFrame Integration', () => {
    it('should call requestAnimationFrame for smooth animations', () => {
      const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
      const { unmount } = render(<CustomCursor smoothness={2}>Test</CustomCursor>);
      
      expect(rafSpy).toHaveBeenCalled();
      
      unmount();
      rafSpy.mockRestore();
    });

    it('should work with direct animation when smoothness is 1', () => {
      const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
      
      render(<CustomCursor smoothness={1}>Direct</CustomCursor>);
      
      // Should not use RAF when smoothness is 1 (direct positioning)
      expect(rafSpy).not.toHaveBeenCalled();
      
      rafSpy.mockRestore();
    });
  });

  describe('Event Listener Integration', () => {
    it('should attach document event listeners', async () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      render(<CustomCursor>Events</CustomCursor>);
      
      // Wait for dynamic import to complete and event listeners to be set up
      // The dynamic import happens in useMousePosition -> CursorCoordinator
      await vi.waitFor(
        () => {
          expect(addEventListenerSpy).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );
      
      addEventListenerSpy.mockRestore();
    });

    it('should remove event listeners on cleanup', async () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<CustomCursor>Cleanup</CustomCursor>);
      
      // Wait for dynamic import to complete first
      await vi.waitFor(
        () => {
          expect(document.addEventListener).toHaveBeenCalled();
        },
        { timeout: 1000 }
      );
      
      // Import the CursorCoordinator to check subscriber count
      const { CursorCoordinator } = await import('../src/utils/CursorCoordinator');
      const coordinator = CursorCoordinator.getInstance();
      
      // Verify we have a subscriber
      expect(coordinator.getSubscriberCount()).toBeGreaterThan(0);
      
      unmount();
      
      // Wait for async cleanup
      await vi.waitFor(
        () => {
          expect(coordinator.getSubscriberCount()).toBe(0);
        },
        { timeout: 1000 }
      );
      
      // Check if removeEventListener was called (should happen when last subscriber removed)
      expect(removeEventListenerSpy).toHaveBeenCalled();
      
      removeEventListenerSpy.mockRestore();
    }, 10000);
  });

  describe('Mouse Position Hook', () => {
    it('should initialize with null position', () => {
      const { result } = renderHook(() => useMousePosition('test-browser-1', undefined, 0, 0));
      
      expect(result.current.position).toEqual({ x: null, y: null });
      expect(typeof result.current.isVisible).toBe('boolean');
    });

    it('should handle container refs', () => {
      const container = document.createElement('div');
      
      expect(() => {
        renderHook(() => useMousePosition('test-browser-2', { current: container }, 0, 0));
      }).not.toThrow();
    });

    it('should handle null refs', () => {
      expect(() => {
        renderHook(() => useMousePosition('test-browser-3', { current: null }, 0, 0));
      }).not.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    it('should not use RAF for direct positioning', () => {
      const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
      
      render(<CustomCursor smoothness={1}>Direct</CustomCursor>);
      
      // Direct positioning should not trigger RAF
      expect(rafSpy).not.toHaveBeenCalled();
      
      rafSpy.mockRestore();
    });

    it('should use RAF for smooth animations', () => {
      const rafSpy = vi.spyOn(global, 'requestAnimationFrame');
      
      render(<CustomCursor smoothness={2}>Smooth</CustomCursor>);
      
      // Smooth animations should use RAF
      expect(rafSpy).toHaveBeenCalled();
      
      rafSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid mount/unmount', () => {
      expect(() => {
        for (let i = 0; i < 5; i++) {
          const { unmount } = render(<CustomCursor key={i}>Rapid {i}</CustomCursor>);
          unmount();
        }
      }).not.toThrow();
    });

    it('should work with different smoothness values', () => {
      expect(() => {
        render(<CustomCursor smoothness={0.1}>Smooth</CustomCursor>);
        render(<CustomCursor smoothness={1}>Direct</CustomCursor>);
        render(<CustomCursor smoothness={10}>Jerky</CustomCursor>);
      }).not.toThrow();
    });
  });

  describe('Animation Cleanup', () => {
    it('should cancel animation frames on unmount', () => {
      const cancelSpy = vi.spyOn(global, 'cancelAnimationFrame');
      
      const { unmount } = render(<CustomCursor smoothness={2}>Cleanup</CustomCursor>);
      unmount();
      
      expect(cancelSpy).toHaveBeenCalled();
      
      cancelSpy.mockRestore();
    });
  });
}); 