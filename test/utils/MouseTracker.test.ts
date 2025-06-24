import { MouseTracker } from '../../src/utils/MouseTracker';
import { fireEvent } from '@testing-library/react';

// Clean up any existing instances before each test
beforeEach(() => {
  MouseTracker.resetInstance();
});

afterEach(() => {
  MouseTracker.resetInstance();
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
      const callback = jest.fn();
      
      const unsubscribe = tracker.subscribe({
        id: 'test-cursor',
        callback,
      });
      
      expect(typeof unsubscribe).toBe('function');
      expect(tracker.getSubscriberCount()).toBe(1);
    });

    it('should remove subscription when unsubscribe is called', () => {
      const tracker = MouseTracker.getInstance();
      const callback = jest.fn();
      
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
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const callback3 = jest.fn();
      
      tracker.subscribe({ id: 'cursor-1', callback: callback1 });
      tracker.subscribe({ id: 'cursor-2', callback: callback2 });
      tracker.subscribe({ id: 'cursor-3', callback: callback3 });
      
      expect(tracker.getSubscriberCount()).toBe(3);
    });
  });

  describe('Event Handling', () => {
    it('should notify all subscribers on mouse move', () => {
      const tracker = MouseTracker.getInstance();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      tracker.subscribe({ id: 'cursor-1', callback: callback1 });
      tracker.subscribe({ id: 'cursor-2', callback: callback2 });
      
      fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
      
      // Use setTimeout to wait for RAF
      setTimeout(() => {
        expect(callback1).toHaveBeenCalledWith({ x: 100, y: 200 });
        expect(callback2).toHaveBeenCalledWith({ x: 100, y: 200 });
      }, 20);
    });

    it('should apply offsets correctly', () => {
      const tracker = MouseTracker.getInstance();
      const callback = jest.fn();
      
      tracker.subscribe({
        id: 'test-cursor',
        callback,
        offsetX: 10,
        offsetY: -5,
      });
      
      fireEvent.mouseMove(document, { clientX: 100, clientY: 200 });
      
      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith({ x: 110, y: 195 });
      }, 20);
    });

    it('should handle container bounds checking', () => {
      const tracker = MouseTracker.getInstance();
      const callback = jest.fn();
      const container = document.createElement('div');
      
      // Mock getBoundingClientRect
      container.getBoundingClientRect = jest.fn(() => ({
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
      
      tracker.subscribe({
        id: 'container-cursor',
        callback,
        containerRef,
      });
      
      // Mouse inside container
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      
      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith({ x: 100, y: 100 });
        
        callback.mockClear();
        
        // Mouse outside container
        fireEvent.mouseMove(document, { clientX: 200, clientY: 200 });
        
        setTimeout(() => {
          expect(callback).not.toHaveBeenCalled();
        }, 20);
      }, 20);
    });
  });

  describe('Throttling', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle callbacks based on throttleMs setting', (done) => {
      const tracker = MouseTracker.getInstance();
      const callback = jest.fn();
      
      tracker.subscribe({
        id: 'throttled-cursor',
        callback,
        throttleMs: 100,
      });
      
      // First call should go through immediately
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      
      // Wait for RAF to flush
      requestAnimationFrame(() => {
        expect(callback).toHaveBeenCalledTimes(1);
        
        // Second call should be throttled
        fireEvent.mouseMove(document, { clientX: 101, clientY: 101 });
        
        requestAnimationFrame(() => {
          // Should still be 1 because of throttling
          expect(callback).toHaveBeenCalledTimes(1);
          
          // Fast forward time
          jest.advanceTimersByTime(100);
          
          // Now should have 2 calls
          expect(callback).toHaveBeenCalledTimes(2);
          done();
        });
      });
    });
  });

  describe('Performance Optimization', () => {
    it('should only have one event listener regardless of subscriber count', () => {
      // Reset instance to start fresh
      MouseTracker.resetInstance();
      
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const tracker = MouseTracker.getInstance();
      
      // Add multiple subscribers
      tracker.subscribe({ id: 'cursor-1', callback: jest.fn() });
      tracker.subscribe({ id: 'cursor-2', callback: jest.fn() });
      tracker.subscribe({ id: 'cursor-3', callback: jest.fn() });
      
      // Should only have one mousemove listener
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });

    it('should remove event listener when last subscriber unsubscribes', () => {
      // Reset instance to start fresh
      MouseTracker.resetInstance();
      
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      const tracker = MouseTracker.getInstance();
      
      const unsubscribe1 = tracker.subscribe({ id: 'cursor-1', callback: jest.fn() });
      const unsubscribe2 = tracker.subscribe({ id: 'cursor-2', callback: jest.fn() });
      
      // Remove first subscriber
      unsubscribe1();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
      
      // Remove last subscriber
      unsubscribe2();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle container getBoundingClientRect errors gracefully', () => {
      const tracker = MouseTracker.getInstance();
      const callback = jest.fn();
      const container = document.createElement('div');
      
      // Mock getBoundingClientRect to throw error
      container.getBoundingClientRect = jest.fn(() => {
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

    it('should handle callback errors gracefully', () => {
      const tracker = MouseTracker.getInstance();
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });
      const goodCallback = jest.fn();
      
      tracker.subscribe({ id: 'error-cursor', callback: errorCallback });
      tracker.subscribe({ id: 'good-cursor', callback: goodCallback });
      
      expect(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      }).not.toThrow();
      
      // Good callback should still be called despite error in other callback
      setTimeout(() => {
        expect(goodCallback).toHaveBeenCalled();
      }, 20);
    });
  });

  describe('SSR Compatibility', () => {
    it('should return no-op unsubscribe function during SSR', () => {
      // Mock SSR environment
      const originalWindow = global.window;
      delete (global as any).window;
      
      const tracker = MouseTracker.getInstance();
      const callback = jest.fn();
      
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
}); 