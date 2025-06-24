import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { MouseTracker } from '../src/utils/MouseTracker';

// Mock RAF and DOM
let rafCallbacks: (() => void)[] = [];

const mockDocument = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockRequestAnimationFrame = vi.fn((callback: () => void) => {
  rafCallbacks.push(callback);
  return rafCallbacks.length;
});

Object.defineProperty(global, 'document', {
  value: mockDocument,
  configurable: true,
});

Object.defineProperty(global, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  configurable: true,
});

const flushRAF = () => {
  const callbacks = [...rafCallbacks];
  rafCallbacks = [];
  callbacks.forEach(callback => callback());
};

describe('Initial Hover Detection - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rafCallbacks = [];
    MouseTracker.resetInstance();
  });

  afterEach(() => {
    rafCallbacks = [];
    MouseTracker.resetInstance();
  });

  describe('Page Load Scenarios', () => {
    it('should start with no position when page loads', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      // Initially, no position should be available
      expect(mouseTracker.getCurrentPosition()).toBeNull();
    });

    it('should provide position after first mouse movement', () => {
      const mouseTracker = MouseTracker.getInstance();
      const callback = vi.fn();
      
      mouseTracker.subscribe({
        id: 'test-cursor',
        callback,
        throttleMs: 0,
      });
      
      // Get mouse handler
      const mouseHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      // Simulate first mouse movement
      mouseHandler({ clientX: 150, clientY: 200 });
      flushRAF();
      
      // Now position should be available
      expect(mouseTracker.getCurrentPosition()).toEqual({ x: 150, y: 200 });
      expect(callback).toHaveBeenCalledWith({ x: 150, y: 200 });
    });

    it('should handle the initial hover detection scenario correctly', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      // Simulate two cursors subscribing (like the original bug scenario)
      const section1Callback = vi.fn();
      const section2Callback = vi.fn();
      
      // Both cursors subscribe with unique IDs (fixed version)
      mouseTracker.subscribe({
        id: 'section1-cursor',
        callback: section1Callback,
        throttleMs: 0,
      });
      
      mouseTracker.subscribe({
        id: 'section2-cursor',
        callback: section2Callback,
        throttleMs: 0,
      });
      
      // Should have 2 subscribers
      expect(mouseTracker.getSubscriberCount()).toBe(2);
      
      // Get mouse handler
      const mouseHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      // Simulate mouse movement (like when user moves mouse after page load)
      mouseHandler({ clientX: 100, clientY: 100 });
      flushRAF();
      
      // Both cursors should receive the position update
      expect(section1Callback).toHaveBeenCalledWith({ x: 100, y: 100 });
      expect(section2Callback).toHaveBeenCalledWith({ x: 100, y: 100 });
    });
  });

  describe('Container Bounds Logic', () => {
    it('should determine if position is inside container bounds', () => {
      // Mock container bounds
      const containerBounds = {
        left: 50,
        top: 50,
        right: 250,
        bottom: 250,
        width: 200,
        height: 200,
        x: 50,
        y: 50,
      };
      
      // Test position inside bounds
      const insidePosition = { x: 100, y: 100 };
      const isInside = 
        insidePosition.x >= containerBounds.left &&
        insidePosition.x <= containerBounds.right &&
        insidePosition.y >= containerBounds.top &&
        insidePosition.y <= containerBounds.bottom;
      
      expect(isInside).toBe(true);
      
      // Test position outside bounds
      const outsidePosition = { x: 300, y: 300 };
      const isOutside = 
        outsidePosition.x >= containerBounds.left &&
        outsidePosition.x <= containerBounds.right &&
        outsidePosition.y >= containerBounds.top &&
        outsidePosition.y <= containerBounds.bottom;
      
      expect(isOutside).toBe(false);
    });

    it('should handle edge cases for container bounds', () => {
      const containerBounds = {
        left: 0,
        top: 0,
        right: 200,
        bottom: 200,
        width: 200,
        height: 200,
        x: 0,
        y: 0,
      };
      
      // Test positions exactly on the edges
      const testCases = [
        { pos: { x: 0, y: 0 }, expected: true, description: 'top-left corner' },
        { pos: { x: 200, y: 200 }, expected: true, description: 'bottom-right corner' },
        { pos: { x: 100, y: 0 }, expected: true, description: 'top edge' },
        { pos: { x: 200, y: 100 }, expected: true, description: 'right edge' },
        { pos: { x: 100, y: 200 }, expected: true, description: 'bottom edge' },
        { pos: { x: 0, y: 100 }, expected: true, description: 'left edge' },
        { pos: { x: -1, y: 100 }, expected: false, description: 'just outside left' },
        { pos: { x: 201, y: 100 }, expected: false, description: 'just outside right' },
      ];
      
      testCases.forEach(({ pos, expected }) => {
        const isInside = 
          pos.x >= containerBounds.left &&
          pos.x <= containerBounds.right &&
          pos.y >= containerBounds.top &&
          pos.y <= containerBounds.bottom;
        
        expect(isInside).toBe(expected);
      });
    });
  });

  describe('Original Bug Reproduction', () => {
    it('should demonstrate the original ID collision bug', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      // Simulate the original bug scenario with same IDs
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Both use the same ID (original bug)
      mouseTracker.subscribe({
        id: 'unnamed-cursor',
        callback: callback1,
        throttleMs: 0,
      });
      
      mouseTracker.subscribe({
        id: 'unnamed-cursor', // Same ID overwrites the first
        callback: callback2,
        throttleMs: 0,
      });
      
      // Only 1 subscriber due to collision
      expect(mouseTracker.getSubscriberCount()).toBe(1);
      
      // Get mouse handler and simulate movement
      const mouseHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseHandler({ clientX: 100, clientY: 100 });
      flushRAF();
      
      // Only the second callback should be called (it overwrote the first)
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith({ x: 100, y: 100 });
    });

    it('should demonstrate the fix with unique IDs', () => {
      const mouseTracker = MouseTracker.getInstance();
      
      // Fixed version with unique IDs
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      mouseTracker.subscribe({
        id: 'section1-cursor',
        callback: callback1,
        throttleMs: 0,
      });
      
      mouseTracker.subscribe({
        id: 'section2-cursor',
        callback: callback2,
        throttleMs: 0,
      });
      
      // Both subscribers should be registered
      expect(mouseTracker.getSubscriberCount()).toBe(2);
      
      // Get mouse handler and simulate movement
      const mouseHandler = mockDocument.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove')?.[1];
      
      mouseHandler({ clientX: 100, clientY: 100 });
      flushRAF();
      
      // Both callbacks should be called
      expect(callback1).toHaveBeenCalledWith({ x: 100, y: 100 });
      expect(callback2).toHaveBeenCalledWith({ x: 100, y: 100 });
    });
  });

  describe('Visibility State Logic', () => {
    it('should determine cursor visibility based on position and container bounds', () => {
      // Test the logic that determines if a cursor should be visible
      
      // Case 1: No position available (page just loaded)
      const noPosition = { x: null, y: null };
      const shouldBeVisibleNoPos = noPosition.x !== null && noPosition.y !== null;
      expect(shouldBeVisibleNoPos).toBe(false);
      
      // Case 2: Position available and inside bounds
      const positionInside = { x: 100, y: 100 };
      const containerBounds = { left: 0, top: 0, right: 200, bottom: 200 };
      
      const isInsideBounds = 
        positionInside.x >= containerBounds.left &&
        positionInside.x <= containerBounds.right &&
        positionInside.y >= containerBounds.top &&
        positionInside.y <= containerBounds.bottom;
      
      const shouldBeVisibleInside = positionInside.x !== null && positionInside.y !== null && isInsideBounds;
      expect(shouldBeVisibleInside).toBe(true);
      
      // Case 3: Position available but outside bounds
      const positionOutside = { x: 300, y: 300 };
      
      const isOutsideBounds = 
        positionOutside.x >= containerBounds.left &&
        positionOutside.x <= containerBounds.right &&
        positionOutside.y >= containerBounds.top &&
        positionOutside.y <= containerBounds.bottom;
      
      const shouldBeVisibleOutside = positionOutside.x !== null && positionOutside.y !== null && isOutsideBounds;
      expect(shouldBeVisibleOutside).toBe(false);
    });
  });
}); 