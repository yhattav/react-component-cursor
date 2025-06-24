import { MouseTracker } from '../../src/utils/MouseTracker';
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
// Clean up any existing instances before each test
beforeEach(() => {
  // Clean up all spies to prevent contamination
  vi.clearAllMocks();
  vi.restoreAllMocks();
  
  // Reset MouseTracker instance
  MouseTracker.resetInstance();
});

afterEach(() => {
  // Reset MouseTracker instance
  MouseTracker.resetInstance();
  
  // Clean up all spies
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('MouseTracker', () => {
  describe('Singleton Pattern', () => {
    it('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = MouseTracker.getInstance();
      const instance2 = MouseTracker.getInstance();
      
      expect(instance1).toBe(instance2);
    });

    it('should create a new instance after reset', () => {
      const instance1 = MouseTracker.getInstance();
      MouseTracker.resetInstance();
      const instance2 = MouseTracker.getInstance();
      
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('Subscription Management', () => {
    it('should accept subscriptions and return unsubscribe function', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      const unsubscribe = tracker.subscribe({
        id: 'test-cursor',
        callback,
      });
      
      expect(typeof unsubscribe).toBe('function');
      expect(tracker.getSubscriberCount()).toBe(1);
    });

    it('should remove subscription when unsubscribe is called', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      const unsubscribe = tracker.subscribe({
        id: 'test-cursor',
        callback,
      });
      
      expect(tracker.getSubscriberCount()).toBe(1);
      
      unsubscribe();
      
      expect(tracker.getSubscriberCount()).toBe(0);
    });

    it('should handle multiple subscriptions', () => {
      const tracker = MouseTracker.getInstance();
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();
      
      tracker.subscribe({ id: 'cursor-1', callback: callback1 });
      tracker.subscribe({ id: 'cursor-2', callback: callback2 });
      tracker.subscribe({ id: 'cursor-3', callback: callback3 });
      
      expect(tracker.getSubscriberCount()).toBe(3);
    });
  });

  describe('Event Handling', () => {
    it('should set up event listener when first subscriber is added', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      tracker.subscribe({ id: 'cursor-1', callback });
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('should accept subscription parameters correctly', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      const container = document.createElement('div');
      const containerRef = { current: container };
      
      // Should accept all subscription parameters without error
      expect(() => {
        tracker.subscribe({
          id: 'test-cursor',
          callback,
          containerRef,
          offsetX: 10,
          offsetY: -5,
          throttleMs: 100,
        });
      }).not.toThrow();
      
      expect(tracker.getSubscriberCount()).toBe(1);
    });

    it('should handle mouse events without errors', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      tracker.subscribe({ id: 'test-cursor', callback });
      
      // Should handle mouse events without throwing
      expect(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
        fireEvent.mouseMove(document, { clientX: 150, clientY: 250 });
      }).not.toThrow();
    });
  });

  describe('Container Bounds', () => {
    it('should accept container refs without errors', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      const container = document.createElement('div');
      
      // Mock getBoundingClientRect
      container.getBoundingClientRect = vi.fn(() => ({
        left: 50,
        top: 50,
        right: 150,
        bottom: 150,
        width: 100,
        height: 100,
        x: 50,
        y: 50,
        toJSON: () => ({}),
      }));
      
      const containerRef = { current: container };
      
      expect(() => {
        tracker.subscribe({
          id: 'container-cursor',
          callback,
          containerRef,
        });
        
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      }).not.toThrow();
    });
  });

  describe('Throttling Setup', () => {
    it('should accept throttling configuration', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      expect(() => {
        tracker.subscribe({
          id: 'throttled-cursor',
          callback,
          throttleMs: 100,
        });
      }).not.toThrow();
      
      expect(tracker.getSubscriberCount()).toBe(1);
    });
  });

  describe('Performance Optimization', () => {
    it('should only have one event listener regardless of subscriber count', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const tracker = MouseTracker.getInstance();
      
      // Add multiple subscribers
      tracker.subscribe({ id: 'cursor-1', callback: vi.fn() });
      tracker.subscribe({ id: 'cursor-2', callback: vi.fn() });
      tracker.subscribe({ id: 'cursor-3', callback: vi.fn() });
      
      // Should only have one mousemove listener added by this test
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      
      // Filter calls to only count mousemove events
      const mouseMoveAddCalls = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      );
      expect(mouseMoveAddCalls).toHaveLength(1);
      
      addEventListenerSpy.mockRestore();
    });

    it('should remove event listener when last subscriber unsubscribes', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      const tracker = MouseTracker.getInstance();
      
      const unsubscribe1 = tracker.subscribe({ id: 'cursor-1', callback: vi.fn() });
      const unsubscribe2 = tracker.subscribe({ id: 'cursor-2', callback: vi.fn() });
      
      // Remove first subscriber
      unsubscribe1();
      
      // Should not have removed listener yet (still have subscriber)
      const mouseMoveRemoveCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      );
      expect(mouseMoveRemoveCalls).toHaveLength(0);
      
      // Remove last subscriber
      unsubscribe2();
      
      // Now should have removed the listener
      const finalMouseMoveRemoveCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      );
      expect(finalMouseMoveRemoveCalls).toHaveLength(1);
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle container getBoundingClientRect errors gracefully', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      const container = document.createElement('div');
      
      // Mock getBoundingClientRect to throw error
      container.getBoundingClientRect = vi.fn(() => {
        throw new Error('getBoundingClientRect failed');
      });
      
      const containerRef = { current: container };
      
      expect(() => {
        tracker.subscribe({
          id: 'error-cursor',
          callback,
          containerRef,
        });
        
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      }).not.toThrow();
    });

    it('should handle subscription and unsubscription without errors', () => {
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      expect(() => {
        const unsubscribe = tracker.subscribe({ id: 'test-cursor', callback });
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
        unsubscribe();
      }).not.toThrow();
    });
  });

  describe('SSR Compatibility', () => {
    it('should return no-op unsubscribe function during SSR', () => {
      // Mock SSR environment
      const originalWindow = global.window;
      Reflect.deleteProperty(global, 'window');
      
      const tracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      const unsubscribe = tracker.subscribe({
        id: 'ssr-cursor',
        callback,
      });
      
      expect(typeof unsubscribe).toBe('function');
      expect(tracker.getSubscriberCount()).toBe(0); // Should not actually subscribe during SSR
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Position Tracking', () => {
    it('should provide current position method', () => {
      const tracker = MouseTracker.getInstance();
      
      const position = tracker.getCurrentPosition();
      
      expect(position).toEqual({ x: 0, y: 0 }); // Initial position
      expect(typeof position.x).toBe('number');
      expect(typeof position.y).toBe('number');
    });
  });
}); 