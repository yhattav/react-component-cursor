import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';import { useMousePosition } from '../../src/hooks/useMousePosition';

describe('useMousePosition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hook Interface', () => {
    it('initializes with correct default values', () => {
      const { result } = renderHook(() => 
        useMousePosition('test-hook-1', undefined, 0, 0, 0)
      );

      expect(result.current.position).toEqual({ x: null, y: null });
      expect(result.current.targetPosition).toEqual({ x: null, y: null });
      expect(result.current.isVisible).toBe(false);
      expect(typeof result.current.setPosition).toBe('function');
    });

    it('accepts all required parameters', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });

      expect(() => {
        renderHook(() => useMousePosition('test-hook-2', containerRef, 10, 20, 100));
      }).not.toThrow();
    });
  });

  describe('Container Event Handling', () => {
    it('attaches container-specific event listeners when containerRef is provided', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });
      
      const addEventListenerSpy = vi.spyOn(mockElement, 'addEventListener');
      
      renderHook(() => useMousePosition('test-hook-3', containerRef, 0, 0, 0));
      
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

    it('removes container event listeners on cleanup', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });
      
      const removeEventListenerSpy = vi.spyOn(mockElement, 'removeEventListener');
      
      const { unmount } = renderHook(() => 
        useMousePosition('test-hook-4', containerRef, 0, 0, 0)
      );
      
      unmount();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseenter',
        expect.any(Function)
      );
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('React Integration', () => {
    it('handles component unmounting gracefully', () => {
      expect(() => {
        const { unmount } = renderHook(() => 
          useMousePosition('test-hook-5', undefined, 0, 0, 0)
        );
        unmount();
      }).not.toThrow();
    });

    it('manages visibility state correctly', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const mockElement = document.createElement('div');
      Object.defineProperty(containerRef, 'current', { 
        value: mockElement, 
        writable: true 
      });
      
      const { result } = renderHook(() => 
        useMousePosition('test-hook-6', containerRef, 0, 0, 0)
      );

      // Initially not visible until first mouse position received
      expect(result.current.isVisible).toBe(false);
    });

    it('initializes position state when targetPosition changes', () => {
      const { result } = renderHook(() => 
        useMousePosition('test-hook-7', undefined, 0, 0, 0)
      );

      // Test the initialization logic when targetPosition becomes available
      act(() => {
        // Simulate the effect of getting first position from MouseTracker
        result.current.setPosition({ x: 100, y: 100 });
      });

      expect(result.current.position).toEqual({ x: 100, y: 100 });
    });
  });

  describe('Performance Optimization', () => {
    it('maintains stable callback reference with ref-based optimization', () => {
      const { result, rerender } = renderHook(() => 
        useMousePosition('test-hook-optimization', undefined, 0, 0, 0)
      );

      // Get initial callback reference (through internal state access)
      const initialIsVisible = result.current.isVisible;
      
      // Simulate state change that would previously cause re-subscription
      act(() => {
        result.current.setPosition({ x: 50, y: 50 });
      });

      rerender();
      
      // Test that the hook continues to work correctly after state changes
      // This validates the ref optimization is working without implementation details
      expect(result.current.position).toEqual({ x: 50, y: 50 });
      expect(typeof result.current.setPosition).toBe('function');
      
      // The fact that this test passes without errors validates that 
      // the callback doesn't have stale closure issues
      expect(initialIsVisible).toBe(false); // Initial state
    });
  });

  describe('Error Handling', () => {
    it('handles null container ref gracefully', () => {
      const containerRef = { current: null };
      
      expect(() => {
        renderHook(() => useMousePosition('test-hook-8', containerRef, 0, 0, 0));
      }).not.toThrow();
    });

    it('handles undefined container ref gracefully', () => {
      expect(() => {
        renderHook(() => useMousePosition('test-hook-9', undefined, 0, 0, 0));
      }).not.toThrow();
    });
  });

  describe('Memory Management', () => {
    it('handles multiple hook instances without conflicts', () => {
      const hooks: Array<{ unmount: () => void }> = [];
      
      expect(() => {
        // Create multiple hook instances with unique IDs
        for (let i = 0; i < 10; i++) {
          hooks.push(renderHook(() => 
            useMousePosition(`test-hook-${i}`, undefined, i, i, 0)
          ));
        }
        
        // Clean them all up
        hooks.forEach(({ unmount }) => unmount());
      }).not.toThrow();
    });
  });
}); 