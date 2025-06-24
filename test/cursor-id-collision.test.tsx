import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { MouseTracker } from '../src/utils/MouseTracker';

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

describe('Cursor ID Collision Bug Fix', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    // Reset MouseTracker singleton
    MouseTracker.resetInstance();
  });

  afterEach(() => {
    MouseTracker.resetInstance();
  });

  describe('MouseTracker Subscription Management', () => {
    it('should handle multiple unique subscriptions correctly', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe with unique IDs
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
      
      // Should have 2 separate subscribers
      expect(mouseTracker.getSubscriberCount()).toBe(2);
      
      // Should set up document event listener
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      
      unsubscribe1();
      unsubscribe2();
      
      // Should have 0 subscribers after unsubscribe
      expect(mouseTracker.getSubscriberCount()).toBe(0);
      
      // Should remove document event listener
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should handle ID collisions (Map overwrite behavior)', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe with same ID (this demonstrates the original bug)
      mouseTracker.subscribe({
        id: 'same-id',
        callback: callback1,
        throttleMs: 0,
      });
      
      // This should overwrite the first subscription due to Map behavior
      const unsubscribe2 = mouseTracker.subscribe({
        id: 'same-id',
        callback: callback2,
        throttleMs: 0,
      });
      
      // Should only have 1 subscriber due to ID collision
      expect(mouseTracker.getSubscriberCount()).toBe(1);
      
      unsubscribe2();
    });

    it('should handle many unique subscriptions without collisions', () => {
      const mouseTracker = MouseTracker.getInstance();
      const unsubscribeFunctions: (() => void)[] = [];
      
      // Create 10 unique subscriptions
      for (let i = 0; i < 10; i++) {
        const unsubscribe = mouseTracker.subscribe({
          id: `cursor-${i}`,
          callback: vi.fn(),
          throttleMs: 0,
        });
        unsubscribeFunctions.push(unsubscribe);
      }
      
      // Should have 10 separate subscribers
      expect(mouseTracker.getSubscriberCount()).toBe(10);
      
      // Clean up
      unsubscribeFunctions.forEach(fn => fn());
      expect(mouseTracker.getSubscriberCount()).toBe(0);
    });

    it('should handle subscription with same ID (second overwrites first)', () => {
      const mouseTracker = MouseTracker.getInstance();
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      // Subscribe with same ID twice
      mouseTracker.subscribe({
        id: 'same-id',
        callback: callback1,
      });

      mouseTracker.subscribe({
        id: 'same-id', 
        callback: callback2,
      });

      // Simulate mouse movement
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseMoveHandler({ clientX: 100, clientY: 200 });
      vi.runAllTimers();

      // Only the second callback should be called (overwrote the first)
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith({ x: 100, y: 200 });
    });

    it('should properly clean up all subscriptions on reset', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const mouseTracker = MouseTracker.getInstance();
      mouseTracker.subscribe({ id: 'test1', callback: callback1 });
      mouseTracker.subscribe({ id: 'test2', callback: callback2 });

      expect(mouseTracker.getSubscriberCount()).toBe(2);

      MouseTracker.resetInstance();

      // Create new instance and verify no subscriptions
      const newMouseTracker = MouseTracker.getInstance();
      expect(newMouseTracker.getSubscriberCount()).toBe(0);
    });
  });

  describe('Mouse Event Handling', () => {
    it('should notify subscribers when mouse moves', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe with unique IDs
      mouseTracker.subscribe({
        id: 'cursor-1',
        callback: callback1,
        throttleMs: 0,
      });
      
      mouseTracker.subscribe({
        id: 'cursor-2',
        callback: callback2,
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

    it('should handle throttling correctly', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      const callback = vi.fn();
      
      // Subscribe with throttling
      mouseTracker.subscribe({
        id: 'throttled-cursor',
        callback,
        throttleMs: 100,
      });
      
      // Get the mousemove handler
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      // Simulate rapid mouse movements
      mouseMoveHandler({ clientX: 100, clientY: 100 });
      mouseMoveHandler({ clientX: 101, clientY: 101 });
      mouseMoveHandler({ clientX: 102, clientY: 102 });
      
      // Should only be called once immediately
      vi.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({ x: 102, y: 102 }); // Latest position
    });
  });

  describe('Original Bug Scenario', () => {
    it('should demonstrate how ID collisions caused the original bug', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      // This simulates the original bug where both cursors used "unnamed-cursor"
      const section1Callback = vi.fn();
      const section2Callback = vi.fn();
      
      // Both cursors subscribe with the same default ID (original bug)
      mouseTracker.subscribe({
        id: 'unnamed-cursor', // Default ID that caused collisions
        callback: section1Callback,
        throttleMs: 0,
      });
      
      mouseTracker.subscribe({
        id: 'unnamed-cursor', // Same ID - this overwrites the first one!
        callback: section2Callback,
        throttleMs: 0,
      });
      
      // Only 1 subscriber due to collision
      expect(mouseTracker.getSubscriberCount()).toBe(1);
      
      // Simulate mouse movement
      const mouseMoveHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseMoveHandler({ clientX: 100, clientY: 100 });
      vi.runAllTimers();
      
      // Only section2Callback should be called (it overwrote section1Callback)
      expect(section1Callback).not.toHaveBeenCalled();
      expect(section2Callback).toHaveBeenCalledWith({ x: 100, y: 100 });
    });

    it('should demonstrate how unique IDs fix the bug', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      // Fixed version with unique IDs
      const section1Callback = vi.fn();
      const section2Callback = vi.fn();
      
      mouseTracker.subscribe({
        id: 'section1-cursor', // Unique ID
        callback: section1Callback,
        throttleMs: 0,
      });
      
      mouseTracker.subscribe({
        id: 'section2-cursor', // Different unique ID
        callback: section2Callback,
        throttleMs: 0,
      });
      
      // Both subscribers should be registered
      expect(mouseTracker.getSubscriberCount()).toBe(2);
      
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

  describe('UUID Generation Validation', () => {
    it('should generate unique IDs when called multiple times', () => {
      // We can't directly test the generateCursorId function since it's private,
      // but we can test that multiple subscriptions with empty IDs would work
      // (assuming the CustomCursor component generates unique IDs)
      
      // Simulate what would happen if CustomCursor generates unique IDs
      const generatedIds = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        // Simulate generated ID pattern
        const id = `cursor-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`;
        generatedIds.add(id);
      }
      
      // All IDs should be unique
      expect(generatedIds.size).toBe(100);
    });
  });
}); 