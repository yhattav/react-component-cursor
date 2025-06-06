import React from 'react';
import { renderHook, act, fireEvent } from '@testing-library/react';
import { useMousePosition } from '../../src/hooks/useMousePosition';

// Mock global Date.now for throttle testing
const originalDateNow = Date.now;
const mockDateNow = jest.fn();

beforeAll(() => {
  Date.now = mockDateNow;
});

afterAll(() => {
  Date.now = originalDateNow;
});

beforeEach(() => {
  mockDateNow.mockReturnValue(0);
});

describe('useMousePosition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('initializes with null position', () => {
      const { result } = renderHook(() => 
        useMousePosition(undefined, 0, 0, 0)
      );

      expect(result.current.position).toEqual({ x: null, y: null });
      expect(result.current.targetPosition).toEqual({ x: null, y: null });
    });

    it('applies offset correctly', () => {
      const { result } = renderHook(() => 
        useMousePosition(undefined, 10, 20, 0)
      );

      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      });

      expect(result.current.targetPosition).toEqual({ x: 110, y: 120 });
    });

    it('handles throttling correctly', () => {
      const { result } = renderHook(() => 
        useMousePosition(undefined, 0, 0, 100)
      );

      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
      });

      // Only first event should be processed immediately
      expect(result.current.targetPosition).toEqual({ x: 100, y: 100 });
    });
  });

  describe('Event Listener Integration', () => {
    it('attaches event listeners to document by default', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      
      renderHook(() => useMousePosition(undefined, 0, 0, 0));
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      
      addEventListenerSpy.mockRestore();
    });

    it('attaches event listeners to container when provided', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });
      
      const addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener');
      
      renderHook(() => useMousePosition(containerRef, 0, 0, 0));
      
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mouseenter',
        expect.any(Function)
      );
      
      addEventListenerSpy.mockRestore();
    });

    it('removes event listeners on cleanup', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = renderHook(() => useMousePosition(undefined, 0, 0, 0));
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function)
      );
      
      removeEventListenerSpy.mockRestore();
    });

    it('handles event listener errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
        .mockImplementation(() => {
          throw new Error('Event listener error');
        });

      expect(() => {
        renderHook(() => useMousePosition(undefined, 0, 0, 0));
      }).not.toThrow();

      addEventListenerSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('Container Integration', () => {
    it('uses getBoundingClientRect for container positioning', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      const getBoundingClientRectSpy = jest.fn(() => ({
        left: 50,
        top: 25,
        right: 450,
        bottom: 325,
        width: 400,
        height: 300,
        x: 50,
        y: 25,
        toJSON: () => ({}),
      }));
      
      mockElement.getBoundingClientRect = getBoundingClientRectSpy;
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });
      
      renderHook(() => 
        useMousePosition(containerRef, 0, 0, 0)
      );

      act(() => {
        // Simulate mouse inside container
        fireEvent.mouseMove(mockElement, { clientX: 200, clientY: 150 });
      });

      // getBoundingClientRect should be called during mouse event processing
      expect(getBoundingClientRectSpy).toHaveBeenCalled();
    });

    it('handles getBoundingClientRect errors gracefully', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      
      mockElement.getBoundingClientRect = () => {
        throw new Error('getBoundingClientRect error');
      };
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });

      expect(() => {
        renderHook(() => 
          useMousePosition(containerRef, 0, 0, 0)
        );

        act(() => {
          fireEvent.mouseMove(mockElement, { clientX: 200, clientY: 150 });
        });
      }).not.toThrow();
    });

    it('handles visibility changes for container', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });
      
      const { result } = renderHook(() => 
        useMousePosition(containerRef, 0, 0, 0)
      );

      expect(result.current.isVisible).toBe(true); // Container exists

      act(() => {
        fireEvent.mouseLeave(mockElement);
      });

      expect(result.current.isVisible).toBe(false);

      act(() => {
        fireEvent.mouseEnter(mockElement);
      });

      expect(result.current.isVisible).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles null container ref gracefully', () => {
      const containerRef = { current: null };
      
      expect(() => {
        renderHook(() => useMousePosition(containerRef, 0, 0, 0));
      }).not.toThrow();
    });

    it('handles undefined container ref gracefully', () => {
      expect(() => {
        renderHook(() => useMousePosition(undefined, 0, 0, 0));
      }).not.toThrow();
    });

    it('handles missing document object', () => {
      const originalDocument = global.document;
      
      Object.defineProperty(global, 'document', {
        value: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        },
        writable: true,
        configurable: true
      });

      expect(() => {
        renderHook(() => useMousePosition(undefined, 0, 0, 0));
      }).not.toThrow();

      global.document = originalDocument;
    });

    it('handles missing event properties gracefully', () => {
      const { result } = renderHook(() => 
        useMousePosition(undefined, 0, 0, 0)
      );

      act(() => {
        // Event with missing clientX/clientY
        const event = new MouseEvent('mousemove', {});
        Object.defineProperty(event, 'clientX', { value: undefined, writable: true });
        Object.defineProperty(event, 'clientY', { value: undefined, writable: true });
        document.dispatchEvent(event);
      });

      // Should not crash
      expect(result.current.targetPosition.x).toEqual(expect.any(Number));
    });

    it('handles rapid mouse movements', () => {
      const { result } = renderHook(() => 
        useMousePosition(undefined, 0, 0, 0)
      );

      expect(() => {
        act(() => {
          for (let i = 0; i < 100; i++) {
            fireEvent.mouseMove(document, { 
              clientX: i * 10, 
              clientY: i * 5 
            });
          }
        });
      }).not.toThrow();

      // Last position should be captured
      expect(result.current.targetPosition.x).toBe(990);
      expect(result.current.targetPosition.y).toBe(495);
    });

    it('handles extreme coordinate values', () => {
      const { result } = renderHook(() => 
        useMousePosition(undefined, 0, 0, 0)
      );

      act(() => {
        fireEvent.mouseMove(document, { 
          clientX: Number.MAX_SAFE_INTEGER, 
          clientY: Number.MIN_SAFE_INTEGER 
        });
      });

      expect(result.current.targetPosition.x).toBe(Number.MAX_SAFE_INTEGER);
      expect(result.current.targetPosition.y).toBe(Number.MIN_SAFE_INTEGER);
    });

    it('optimizes re-renders by avoiding unnecessary updates', () => {
      let renderCount = 0;
      const TestComponent = () => {
        renderCount++;
        const { position } = useMousePosition(undefined, 0, 0, 0);
        return <div>{position.x}</div>;
      };

      renderHook(() => <TestComponent />);
      const initialRenderCount = renderCount;

      act(() => {
        // Send same position multiple times
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      });

      // Should not cause excessive re-renders
      expect(renderCount - initialRenderCount).toBeLessThan(5);
    });
  });

  describe('Memory and Performance', () => {
    it('cleans up throttle timers properly', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const { unmount } = renderHook(() => 
        useMousePosition(undefined, 0, 0, 100)
      );

      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      });

      unmount();

      // Should clean up any pending timers
      expect(clearTimeoutSpy).toHaveBeenCalled();
      
      clearTimeoutSpy.mockRestore();
    });

    it('handles memory pressure scenarios', () => {
      const hooks: Array<{ unmount: () => void }> = [];
      
      expect(() => {
        // Create many hook instances
        for (let i = 0; i < 50; i++) {
          hooks.push(renderHook(() => useMousePosition(undefined, i, i, 0)));
        }
        
        // Trigger events on all
        act(() => {
          fireEvent.mouseMove(document, { clientX: 500, clientY: 500 });
        });
        
        // Clean them all up
        hooks.forEach(({ unmount }) => unmount());
      }).not.toThrow();
    });
  });

  describe('Browser Compatibility', () => {
    it('works without modern event features', () => {
      const { result } = renderHook(() => 
        useMousePosition(undefined, 0, 0, 0)
      );

      act(() => {
        // Create basic event without modern properties
        const event = new Event('mousemove');
        Object.defineProperty(event, 'clientX', { value: 150, writable: true });
        Object.defineProperty(event, 'clientY', { value: 250, writable: true });
        document.dispatchEvent(event);
      });

      expect(result.current.targetPosition).toEqual({ x: 150, y: 250 });
    });

    it('handles missing performance API gracefully', () => {
      const originalPerformance = global.performance;
      Object.defineProperty(global, 'performance', {
        value: undefined,
        writable: true,
        configurable: true
      });

      expect(() => {
        renderHook(() => useMousePosition(undefined, 0, 0, 0));
      }).not.toThrow();

      global.performance = originalPerformance;
    });
  });
}); 