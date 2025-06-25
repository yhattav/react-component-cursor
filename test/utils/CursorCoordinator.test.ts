import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { CursorCoordinator } from '../../src/utils/CursorCoordinator';
import { MouseTracker } from '../../src/utils/MouseTracker';

// Mock document with proper event handling
const mockDocument = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  createElement: vi.fn(() => ({
    id: '',
    style: {},
    appendChild: vi.fn(),
    remove: vi.fn(),
    parentNode: null,
  })),
  getElementById: vi.fn(() => null),
  head: { appendChild: vi.fn() },
  body: { appendChild: vi.fn() },
};

// Mock window object
const mockWindow = {
  document: mockDocument,
  requestAnimationFrame: vi.fn((cb) => {
    setTimeout(cb, 16);
    return 1;
  }),
  cancelAnimationFrame: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Set up global mocks
Object.defineProperty(global, 'document', {
  value: mockDocument,
  configurable: true,
});

Object.defineProperty(global, 'window', {
  value: mockWindow,
  configurable: true,
});

describe('CursorCoordinator', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    // Reset both singletons
    CursorCoordinator.resetInstance();
    MouseTracker.resetInstance();
  });

  afterEach(() => {
    CursorCoordinator.resetInstance();
    MouseTracker.resetInstance();
  });

  describe('Subscription Management', () => {
    it('should handle multiple unique subscriptions correctly', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe with unique IDs
      const unsubscribe1 = coordinator.subscribe({
        id: 'cursor-1',
        onPositionChange: callback1,
        throttleMs: 0,
      });
      
      const unsubscribe2 = coordinator.subscribe({
        id: 'cursor-2',
        onPositionChange: callback2,
        throttleMs: 0,
      });
      
      // Should set up event listeners (mousemove + scroll/resize)
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      
      unsubscribe1();
      unsubscribe2();
      
      // Should remove event listeners
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should handle ID collisions (Map overwrite behavior)', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe with same ID (this should overwrite the first subscription)
      coordinator.subscribe({
        id: 'same-id',
        onPositionChange: callback1,
        throttleMs: 0,
      });
      
      // This should overwrite the first subscription
      const unsubscribe2 = coordinator.subscribe({
        id: 'same-id',
        onPositionChange: callback2,
        throttleMs: 0,
      });
      
      unsubscribe2();
    });

    it('should notify subscribers when mouse moves', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe with unique IDs
      coordinator.subscribe({
        id: 'cursor-1',
        onPositionChange: callback1,
        throttleMs: 0,
      });
      
      coordinator.subscribe({
        id: 'cursor-2',
        onPositionChange: callback2,
        throttleMs: 0,
      });
      
      // Get the mousemove handler that was registered
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      expect(mouseMoveHandler).toBeDefined();
      
      // Simulate mouse movement
      const mockEvent = { clientX: 100, clientY: 150 };
      mouseMoveHandler(mockEvent);
      
      // Wait for RAF to execute
      vi.runAllTimers();
      
      // Both callbacks should be called with the same position
      expect(callback1).toHaveBeenCalledWith({ x: 100, y: 150 });
      expect(callback2).toHaveBeenCalledWith({ x: 100, y: 150 });
    });

    it('should handle scroll events and notify subscribers', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      const callback = vi.fn();
      
      coordinator.subscribe({
        id: 'scroll-cursor',
        onPositionChange: callback,
        throttleMs: 0,
      });
      
      // Simulate a mouse move first to establish a position
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseMoveHandler({ clientX: 100, clientY: 100 });
      vi.runAllTimers();
      
      // Clear the callback calls from mouse move
      callback.mockClear();
      
      // Get the scroll handler
      const scrollHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'scroll')?.[1];
      
      expect(scrollHandler).toBeDefined();
      
      // Simulate scroll event
      scrollHandler();
      
      // Wait for RAF to execute
      vi.runAllTimers();
      
      // Should be called with the current position
      expect(callback).toHaveBeenCalledWith({ x: 100, y: 100 });
    });

    it('should handle resize events and notify subscribers', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      const callback = vi.fn();
      
      coordinator.subscribe({
        id: 'resize-cursor',
        onPositionChange: callback,
        throttleMs: 0,
      });
      
      // Simulate a mouse move first to establish a position
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseMoveHandler({ clientX: 200, clientY: 200 });
      vi.runAllTimers();
      
      // Clear the callback calls from mouse move
      callback.mockClear();
      
      // Get the resize handler
      const resizeHandler = mockWindow.addEventListener.mock.calls
        .find(call => call[0] === 'resize')?.[1];
      
      expect(resizeHandler).toBeDefined();
      
      // Simulate resize event
      resizeHandler();
      
      // Wait for RAF to execute
      vi.runAllTimers();
      
      // Should be called with the current position
      expect(callback).toHaveBeenCalledWith({ x: 200, y: 200 });
    });
  });

  describe('Performance and Architecture', () => {
    it('should use only one set of event listeners regardless of subscriber count', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      // Subscribe multiple cursors
      for (let i = 0; i < 5; i++) {
        coordinator.subscribe({
          id: `cursor-${i}`,
          onPositionChange: vi.fn(),
          throttleMs: 0,
        });
      }
      
             // Count event listener calls
       const mousemoveListeners = mockDocument.addEventListener.mock.calls.filter(
         (call: any[]) => call[0] === 'mousemove'
       ).length;
       
       const scrollListeners = mockDocument.addEventListener.mock.calls.filter(
         (call: any[]) => call[0] === 'scroll'
       ).length;
       
       const resizeListeners = mockWindow.addEventListener.mock.calls.filter(
         (call: any[]) => call[0] === 'resize'
       ).length;
      
      // Should only have one listener of each type regardless of subscriber count
      expect(mousemoveListeners).toBe(1);
      expect(scrollListeners).toBe(1);
      expect(resizeListeners).toBe(1);
    });

    it('should demonstrate ID collision behavior with callbacks', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      const section1Callback = vi.fn();
      const section2Callback = vi.fn();
      
      // First subscription
      coordinator.subscribe({
        id: 'unnamed-cursor', // Default ID that causes collisions
        onPositionChange: section1Callback,
        throttleMs: 0,
      });
      
      // Clear any immediate callbacks
      section1Callback.mockClear();
      
      // Second subscription with same ID - should overwrite first
      coordinator.subscribe({
        id: 'unnamed-cursor', // Same ID - overwrites the first!
        onPositionChange: section2Callback,
        throttleMs: 0,
      });
      
      // Simulate mouse movement
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseMoveHandler({ clientX: 100, clientY: 100 });
      vi.runAllTimers();
      
      // Only section2Callback should be called (it overwrote section1Callback)
      expect(section1Callback).not.toHaveBeenCalled();
      expect(section2Callback).toHaveBeenCalledWith({ x: 100, y: 100 });
    });

    it('should demonstrate how unique IDs prevent collisions', () => {
      const coordinator = CursorCoordinator.getInstance();
      
      const section1Callback = vi.fn();
      const section2Callback = vi.fn();
      
      // Fixed version with unique IDs
      coordinator.subscribe({
        id: 'section1-cursor', // Unique ID
        onPositionChange: section1Callback,
        throttleMs: 0,
      });
      
      coordinator.subscribe({
        id: 'section2-cursor', // Different unique ID
        onPositionChange: section2Callback,
        throttleMs: 0,
      });
      
      // Simulate mouse movement
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseMoveHandler({ clientX: 100, clientY: 100 });
      vi.runAllTimers();
      
      // Both callbacks should be called
      expect(section1Callback).toHaveBeenCalledWith({ x: 100, y: 100 });
      expect(section2Callback).toHaveBeenCalledWith({ x: 100, y: 100 });
    });
  });
}); 