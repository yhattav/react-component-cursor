import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { CustomCursor } from '../src';
import { useMousePosition } from '../src/hooks';

describe('Browser API Integration', () => {
  describe('requestAnimationFrame Integration', () => {
    it('should call requestAnimationFrame for smooth animations', () => {
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
      const { unmount } = render(<CustomCursor smoothness={2}>Test</CustomCursor>);
      
      expect(rafSpy).toHaveBeenCalled();
      
      unmount();
      rafSpy.mockRestore();
    });

    it('should handle missing RAF gracefully', () => {
      const originalRAF = global.requestAnimationFrame;
      const originalCAF = global.cancelAnimationFrame;
      
      Object.defineProperty(global, 'requestAnimationFrame', {
        value: undefined,
        writable: true,
        configurable: true
      });
      Object.defineProperty(global, 'cancelAnimationFrame', {
        value: undefined,
        writable: true,
        configurable: true
      });

      expect(() => {
        render(<CustomCursor smoothness={2}>No RAF</CustomCursor>);
      }).not.toThrow();

      global.requestAnimationFrame = originalRAF;
      global.cancelAnimationFrame = originalCAF;
    });

    it('should handle RAF errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { /* mock */ });
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame')
        .mockImplementation(() => {
          throw new Error('RAF error');
        });

      expect(() => {
        render(<CustomCursor smoothness={2}>RAF Error</CustomCursor>);
      }).not.toThrow();

      rafSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('Event Listener Integration', () => {
    it('should attach document event listeners', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      
      render(<CustomCursor>Events</CustomCursor>);
      
      expect(addEventListenerSpy).toHaveBeenCalled();
      addEventListenerSpy.mockRestore();
    });

    it('should remove event listeners on cleanup', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<CustomCursor>Cleanup</CustomCursor>);
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalled();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Mouse Position Hook', () => {
    it('should initialize with null position', () => {
      const { result } = renderHook(() => useMousePosition(undefined, 0, 0));
      
      expect(result.current.position).toEqual({ x: null, y: null });
      expect(typeof result.current.isVisible).toBe('boolean');
    });

    it('should handle container refs', () => {
      const container = document.createElement('div');
      
      expect(() => {
        renderHook(() => useMousePosition({ current: container }, 0, 0));
      }).not.toThrow();
    });

    it('should handle null refs', () => {
      expect(() => {
        renderHook(() => useMousePosition({ current: null }, 0, 0));
      }).not.toThrow();
    });
  });

  describe('SSR Compatibility', () => {
    it('should handle missing window', () => {
      const originalWindow = global.window;
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
        configurable: true
      });

      expect(() => {
        render(<CustomCursor>SSR</CustomCursor>);
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle missing performance.now', () => {
      const originalPerformance = global.performance;
      Object.defineProperty(global, 'performance', {
        value: undefined,
        writable: true,
        configurable: true
      });

      expect(() => {
        render(<CustomCursor>No Performance</CustomCursor>);
      }).not.toThrow();

      global.performance = originalPerformance;
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

  describe('Browser Feature Detection', () => {
    it('should work with polyfilled RAF', () => {
      const originalRAF = global.requestAnimationFrame;
      
      global.requestAnimationFrame = (callback: FrameRequestCallback) => {
        return setTimeout(() => callback(Date.now()), 16) as unknown as number;
      };

      expect(() => {
        render(<CustomCursor smoothness={2}>Polyfilled</CustomCursor>);
      }).not.toThrow();

      global.requestAnimationFrame = originalRAF;
    });
  });
}); 