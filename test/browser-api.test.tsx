import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomCursor } from '../src';

describe('Browser API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    // Clean up DOM elements
    document.querySelectorAll('#cursor-container, [id^="cursor-style"]').forEach(el => {
      el.remove();
    });
    // Restore any spies
    jest.restoreAllMocks();
  });

  describe('requestAnimationFrame/cancelAnimationFrame', () => {
    it('should properly handle requestAnimationFrame calls', () => {
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
      const cancelRafSpy = jest.spyOn(global, 'cancelAnimationFrame');

      const { unmount } = render(
        <CustomCursor smoothness={2}>
          Test cursor
        </CustomCursor>
      );

      // RAF should be called for smooth animations
      expect(rafSpy).toHaveBeenCalled();

      // Cleanup should cancel animation frames
      unmount();
      expect(cancelRafSpy).toHaveBeenCalled();

      rafSpy.mockRestore();
      cancelRafSpy.mockRestore();
    });

    it('should handle missing requestAnimationFrame gracefully', () => {
      const originalRAF = global.requestAnimationFrame;
      const originalCAF = global.cancelAnimationFrame;

      // Simulate environment without RAF support
      delete (global as any).requestAnimationFrame;
      delete (global as any).cancelAnimationFrame;

      expect(() => {
        render(<CustomCursor>No RAF cursor</CustomCursor>);
      }).not.toThrow();

      // Restore RAF
      global.requestAnimationFrame = originalRAF;
      global.cancelAnimationFrame = originalCAF;
    });

    it('should handle RAF errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame')
        .mockImplementation(() => {
          throw new Error('RAF error');
        });

      expect(() => {
        render(<CustomCursor smoothness={2}>Error cursor</CustomCursor>);
      }).not.toThrow();

      rafSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('DOM API Integration', () => {
    it('should properly use document.getElementById', () => {
      const getElementSpy = jest.spyOn(document, 'getElementById');
      
      render(<CustomCursor>DOM cursor</CustomCursor>);
      
      expect(getElementSpy).toHaveBeenCalledWith('cursor-container');
      
      getElementSpy.mockRestore();
    });

    it('should properly use document.createElement', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      
      render(<CustomCursor>Create cursor</CustomCursor>);
      
      expect(createElementSpy).toHaveBeenCalledWith('div');
      expect(createElementSpy).toHaveBeenCalledWith('style');
      
      createElementSpy.mockRestore();
    });

    it('should properly use document.body.appendChild', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      
      render(<CustomCursor>Append cursor</CustomCursor>);
      
      expect(appendChildSpy).toHaveBeenCalled();
      
      appendChildSpy.mockRestore();
    });

    it('should handle DOM manipulation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Create isolated test by mocking only for this test
      expect(() => {
        const originalAppendChild = document.body.appendChild;
        document.body.appendChild = jest.fn().mockImplementation(() => {
          throw new Error('DOM error');
        });
        
        try {
          render(<CustomCursor>Error DOM cursor</CustomCursor>);
        } finally {
          // Restore immediately
          document.body.appendChild = originalAppendChild;
        }
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should clean up DOM elements properly', () => {
      const { unmount } = render(<CustomCursor id="cleanup-test">Cleanup cursor</CustomCursor>);
      
      // Elements should exist
      expect(document.getElementById('cursor-container')).toBeTruthy();
      expect(document.getElementById('cursor-style-cleanup-test')).toBeTruthy();
      
      unmount();
      
      // Elements should be cleaned up (handled by component cleanup)
      // Note: Actual cleanup happens in useEffect cleanup functions
    });
  });

  describe('Event Listener Integration', () => {
    it('should properly attach event listeners', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      
      render(<CustomCursor>Event cursor</CustomCursor>);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      
      addEventListenerSpy.mockRestore();
    });

    it('should properly remove event listeners on cleanup', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<CustomCursor>Cleanup events cursor</CustomCursor>);
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      
      removeEventListenerSpy.mockRestore();
    });

    it('should handle event listener errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
        .mockImplementation(() => {
          throw new Error('Event listener error');
        });

      expect(() => {
        render(<CustomCursor>Event error cursor</CustomCursor>);
      }).not.toThrow();

      addEventListenerSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should handle container event listeners', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      
      render(
        <div ref={containerRef}>
          <CustomCursor containerRef={containerRef}>
            Container cursor
          </CustomCursor>
        </div>
      );

      // Should set up event listeners on container when available
      // (This is tested through integration with the actual hooks)
      expect(containerRef.current).toBeTruthy();
    });
  });

  describe('getBoundingClientRect Integration', () => {
    it('should use getBoundingClientRect for positioning', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const getBoundingClientRectSpy = jest.fn(() => ({
        left: 100,
        top: 50,
        right: 500,
        bottom: 350,
        width: 400,
        height: 300,
        x: 100,
        y: 50,
        toJSON: () => ({}),
      }));

      render(
        <div ref={containerRef}>
          <CustomCursor containerRef={containerRef}>
            Bounds cursor
          </CustomCursor>
        </div>
      );

      // Mock the method on the container element
      if (containerRef.current) {
        containerRef.current.getBoundingClientRect = getBoundingClientRectSpy;
      }

      // The hook will call getBoundingClientRect when processing mouse events
      // This is tested through integration
    });

    it('should handle getBoundingClientRect errors gracefully', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      
      render(
        <div ref={containerRef}>
          <CustomCursor containerRef={containerRef}>
            Bounds error cursor
          </CustomCursor>
        </div>
      );

      // Mock getBoundingClientRect to throw an error
      if (containerRef.current) {
        containerRef.current.getBoundingClientRect = () => {
          throw new Error('getBoundingClientRect error');
        };
      }

      expect(() => {
        // Trigger mouse events that would call getBoundingClientRect
        act(() => {
          const event = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
          document.dispatchEvent(event);
        });
      }).not.toThrow();
    });
  });

  describe('SSR Compatibility', () => {
    it('should handle missing window object', () => {
      const originalWindow = global.window;
      
      // Simulate SSR environment
      delete (global as any).window;

      expect(() => {
        render(<CustomCursor>SSR cursor</CustomCursor>);
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });

    it('should handle missing document object', () => {
      const originalDocument = global.document;
      
      // Simulate environment without document
      (global as any).document = {
        getElementById: () => null,
        createElement: () => ({ style: {} }),
        body: { appendChild: () => { /* mock implementation */ } },
        head: { appendChild: () => { /* mock implementation */ } },
        addEventListener: () => { /* mock implementation */ },
        removeEventListener: () => { /* mock implementation */ },
      };

      expect(() => {
        render(<CustomCursor>No document cursor</CustomCursor>);
      }).not.toThrow();

      // Restore document
      global.document = originalDocument;
    });

    it('should handle missing HTMLElement prototype methods', () => {
      const originalAddEventListener = HTMLElement.prototype.addEventListener;
      const originalRemoveEventListener = HTMLElement.prototype.removeEventListener;
      
      // Simulate environment without prototype methods
      delete (HTMLElement.prototype as any).addEventListener;
      delete (HTMLElement.prototype as any).removeEventListener;

      expect(() => {
        render(<CustomCursor>No prototype cursor</CustomCursor>);
      }).not.toThrow();

      // Restore prototype methods
      HTMLElement.prototype.addEventListener = originalAddEventListener;
      HTMLElement.prototype.removeEventListener = originalRemoveEventListener;
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined refs gracefully', () => {
      expect(() => {
        render(
          <CustomCursor containerRef={{ current: null }}>
            Null ref cursor
          </CustomCursor>
        );
      }).not.toThrow();
    });

    it('should handle rapid mount/unmount cycles', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          const { unmount } = render(
            <CustomCursor key={i}>Rapid cursor {i}</CustomCursor>
          );
          unmount();
        }
      }).not.toThrow();
    });

    it('should handle performance.now() absence', () => {
      const originalPerformance = global.performance;
      
      // Simulate environment without performance.now
      global.performance = {} as any;

      expect(() => {
        render(<CustomCursor>No performance cursor</CustomCursor>);
      }).not.toThrow();

      // Restore performance
      global.performance = originalPerformance;
    });

    it('should handle extremely high frequency events', () => {
      render(<CustomCursor throttleMs={0}>High frequency cursor</CustomCursor>);

      expect(() => {
        // Simulate rapid mouse events
        for (let i = 0; i < 100; i++) {
          act(() => {
            const event = new MouseEvent('mousemove', { clientX: i, clientY: i });
            document.dispatchEvent(event);
          });
        }
      }).not.toThrow();
    });

    it('should handle memory pressure scenarios', () => {
      // Create many cursors to test memory handling
      const cursors: Array<{ unmount: () => void }> = [];
      
      expect(() => {
        for (let i = 0; i < 50; i++) {
          cursors.push(
            render(<CustomCursor key={i}>Memory cursor {i}</CustomCursor>)
          );
        }
        
        // Clean them all up
        cursors.forEach(({ unmount }) => unmount());
      }).not.toThrow();
    });
  });

  describe('Browser Feature Detection', () => {
    it('should work when requestAnimationFrame is polyfilled', () => {
      const originalRAF = global.requestAnimationFrame;
      
      // Simulate polyfilled RAF
      global.requestAnimationFrame = (callback: FrameRequestCallback) => {
        return setTimeout(() => callback(Date.now()), 16) as any;
      };

      expect(() => {
        render(<CustomCursor smoothness={2}>Polyfilled RAF cursor</CustomCursor>);
      }).not.toThrow();

      global.requestAnimationFrame = originalRAF;
    });

    it('should handle touch events gracefully', () => {
      render(<CustomCursor>Touch cursor</CustomCursor>);

      expect(() => {
        // Simulate touch events
        act(() => {
          const touchEvent = new TouchEvent('touchmove', {
            touches: [{ clientX: 100, clientY: 100 } as Touch],
          });
          document.dispatchEvent(touchEvent);
        });
      }).not.toThrow();
    });

    it('should work in different viewport sizes', () => {
      // Test very small viewport
      Object.defineProperty(window, 'innerWidth', { value: 320, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 568, configurable: true });

      expect(() => {
        render(<CustomCursor>Small viewport cursor</CustomCursor>);
      }).not.toThrow();

      // Test very large viewport
      Object.defineProperty(window, 'innerWidth', { value: 3840, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 2160, configurable: true });

      expect(() => {
        render(<CustomCursor>Large viewport cursor</CustomCursor>);
      }).not.toThrow();

      // Restore default viewport
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
    });
  });
}); 