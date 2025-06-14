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

    it('should work with direct animation when smoothness is 1', () => {
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
      
      render(<CustomCursor smoothness={1}>Direct</CustomCursor>);
      
      // Should not use RAF when smoothness is 1 (direct positioning)
      expect(rafSpy).not.toHaveBeenCalled();
      
      rafSpy.mockRestore();
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

  describe('Performance Optimization', () => {
    it('should not use RAF for direct positioning', () => {
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
      
      render(<CustomCursor smoothness={1}>Direct</CustomCursor>);
      
      // Direct positioning should not trigger RAF
      expect(rafSpy).not.toHaveBeenCalled();
      
      rafSpy.mockRestore();
    });

    it('should use RAF for smooth animations', () => {
      const rafSpy = jest.spyOn(global, 'requestAnimationFrame');
      
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
      const cancelSpy = jest.spyOn(global, 'cancelAnimationFrame');
      
      const { unmount } = render(<CustomCursor smoothness={2}>Cleanup</CustomCursor>);
      unmount();
      
      expect(cancelSpy).toHaveBeenCalled();
      
      cancelSpy.mockRestore();
    });
  });
}); 