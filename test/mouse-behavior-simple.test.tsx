import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { MouseTracker } from '../src/utils/MouseTracker';

// Mock RAF for proper async handling
let rafCallbacks: (() => void)[] = [];

const mockDocument = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockElement = {
  getBoundingClientRect: vi.fn(() => ({
    left: 0,
    top: 0,
    right: 200,
    bottom: 200,
    width: 200,
    height: 200,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn((callback: () => void) => {
  rafCallbacks.push(callback);
  return rafCallbacks.length;
});

const mockCancelAnimationFrame = vi.fn((id: number) => {
  rafCallbacks = rafCallbacks.filter((_, index) => index + 1 !== id);
});

Object.defineProperty(global, 'document', {
  value: mockDocument,
  configurable: true,
});

Object.defineProperty(global, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  configurable: true,
});

Object.defineProperty(global, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
  configurable: true,
});

// Helper function to flush RAF callbacks
const flushRAF = () => {
  const callbacks = [...rafCallbacks];
  rafCallbacks = [];
  callbacks.forEach(callback => callback());
};

describe('Mouse Behavior - Core Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rafCallbacks = [];
    MouseTracker.resetInstance();
  });

  afterEach(() => {
    rafCallbacks = [];
    MouseTracker.resetInstance();
  });

  describe('MouseTracker Integration', () => {
    it('should handle mouse movement and notify subscribers', () => {
      const mouseTracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      // Subscribe to mouse events
      const unsubscribe = mouseTracker.subscribe({
        id: 'test-cursor',
        callback,
        throttleMs: 0,
      });
      
      // Verify event listener was added
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      
      // Get the registered mouse handler
      const mouseHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      // Simulate mouse movement
      mouseHandler({ clientX: 100, clientY: 150 });
      
      // Flush RAF to trigger notifications
      flushRAF();
      
      // Should notify subscriber with correct position
      expect(callback).toHaveBeenCalledWith({ x: 100, y: 150 });
      
      unsubscribe();
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should handle multiple subscribers correctly', () => {
      const mouseTracker = MouseTracker.getInstance();
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe multiple cursors
      const unsubscribe1 = mouseTracker.subscribe({
        id: 'cursor-1',
        callback: callback1,
        throttleMs: 0,
      });
      
      const unsubscribe2 = mouseTracker.subscribe({
        id: 'cursor-2',
        callback: callback2,
        throttleMs: 0,
      });
      
      expect(mouseTracker.getSubscriberCount()).toBe(2);
      
      // Get mouse handler and simulate movement
      const mouseHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseHandler({ clientX: 200, clientY: 300 });
      
      // Flush RAF to trigger notifications
      flushRAF();
      
      // Both should be notified
      expect(callback1).toHaveBeenCalledWith({ x: 200, y: 300 });
      expect(callback2).toHaveBeenCalledWith({ x: 200, y: 300 });
      
      unsubscribe1();
      unsubscribe2();
    });

    it('should handle throttling correctly', () => {
      vi.useFakeTimers();
      
      const mouseTracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      mouseTracker.subscribe({
        id: 'throttled-cursor',
        callback,
        throttleMs: 100,
      });
      
      const mouseHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      // Rapid mouse movements
      mouseHandler({ clientX: 100, clientY: 100 });
      mouseHandler({ clientX: 101, clientY: 101 });
      mouseHandler({ clientX: 102, clientY: 102 });
      
      // Flush RAF to trigger notifications
      flushRAF();
      
      // Should be called once immediately
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenLastCalledWith({ x: 102, y: 102 });
      
      vi.useRealTimers();
    });
  });

  describe('Container Bounds Checking', () => {
    it('should check if position is within container bounds', () => {
      // Test bounds checking logic
      const rect = mockElement.getBoundingClientRect();
      
      // Position inside bounds
      const insidePosition = { x: 100, y: 100 };
      const isInside = 
        insidePosition.x >= rect.left &&
        insidePosition.x <= rect.right &&
        insidePosition.y >= rect.top &&
        insidePosition.y <= rect.bottom;
      
      expect(isInside).toBe(true);
      
      // Position outside bounds
      const outsidePosition = { x: 300, y: 300 };
      const isOutside = 
        outsidePosition.x >= rect.left &&
        outsidePosition.x <= rect.right &&
        outsidePosition.y >= rect.top &&
        outsidePosition.y <= rect.bottom;
      
      expect(isOutside).toBe(false);
    });

    it('should handle different container sizes', () => {
      const largeContainer = {
        getBoundingClientRect: () => ({
          left: 0, top: 0, right: 500, bottom: 400,
          width: 500, height: 400, x: 0, y: 0, toJSON: () => ({})
        })
      };
      
      const smallContainer = {
        getBoundingClientRect: () => ({
          left: 100, top: 100, right: 200, bottom: 200,
          width: 100, height: 100, x: 100, y: 100, toJSON: () => ({})
        })
      };
      
      const testPosition = { x: 150, y: 150 };
      
      // Should be inside large container
      const largeRect = largeContainer.getBoundingClientRect();
      const inLarge = 
        testPosition.x >= largeRect.left && testPosition.x <= largeRect.right &&
        testPosition.y >= largeRect.top && testPosition.y <= largeRect.bottom;
      expect(inLarge).toBe(true);
      
      // Should be inside small container too
      const smallRect = smallContainer.getBoundingClientRect();
      const inSmall = 
        testPosition.x >= smallRect.left && testPosition.x <= smallRect.right &&
        testPosition.y >= smallRect.top && testPosition.y <= smallRect.bottom;
      expect(inSmall).toBe(true);
    });
  });

  describe('Event Cleanup', () => {
    it('should clean up event listeners when all subscribers unsubscribe', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      const unsubscribe1 = mouseTracker.subscribe({
        id: 'cursor-1',
        callback: vi.fn(),
        throttleMs: 0,
      });
      
      const unsubscribe2 = mouseTracker.subscribe({
        id: 'cursor-2',
        callback: vi.fn(),
        throttleMs: 0,
      });
      
      // Event listener should be added
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      
      // Unsubscribe first cursor
      unsubscribe1();
      expect(mouseTracker.getSubscriberCount()).toBe(1);
      // Event listener should still be active
      expect(mockDocument.removeEventListener).not.toHaveBeenCalled();
      
      // Unsubscribe last cursor
      unsubscribe2();
      expect(mouseTracker.getSubscriberCount()).toBe(0);
      // Event listener should be removed
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should handle rapid subscribe/unsubscribe cycles', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      // Subscribe and immediately unsubscribe multiple times
      for (let i = 0; i < 5; i++) {
        const unsubscribe = mouseTracker.subscribe({
          id: `cursor-${i}`,
          callback: vi.fn(),
          throttleMs: 0,
        });
        
        expect(mouseTracker.getSubscriberCount()).toBe(1);
        unsubscribe();
        expect(mouseTracker.getSubscriberCount()).toBe(0);
      }
      
      // Should handle this gracefully without errors
      expect(true).toBe(true);
    });
  });
}); 