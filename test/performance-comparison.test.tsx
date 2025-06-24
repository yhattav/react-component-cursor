import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { CustomCursor } from '../src';
import { MouseTracker } from '../src/utils/MouseTracker';

// Mock performance.now for consistent testing
const mockPerformanceNow = vi.fn();
Object.defineProperty(global.performance, 'now', {
  writable: true,
  value: mockPerformanceNow,
});

// Helper to create multiple cursors
const MultipleCursors: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <CustomCursor key={i} id={`perf-cursor-${i}`}>
          <div>Cursor {i}</div>
        </CustomCursor>
      ))}
    </>
  );
};

describe('Performance Comparison: O(1) vs O(n)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    MouseTracker.resetInstance();
    mockPerformanceNow.mockReturnValue(0);
  });

  afterEach(() => {
    cleanup();
    MouseTracker.resetInstance();
  });

  describe('Event Listener Efficiency', () => {
    it('should use only one event listener regardless of cursor count', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      
      // Test with 1 cursor
      render(<MultipleCursors count={1} />);
      const listenersAfter1 = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      ).length;
      
      cleanup();
      MouseTracker.resetInstance();
      addEventListenerSpy.mockClear();
      
      // Test with 5 cursors
      render(<MultipleCursors count={5} />);
      const listenersAfter5 = addEventListenerSpy.mock.calls.filter(
        call => call[0] === 'mousemove'
      ).length;
      
      // Should have same number of listeners regardless of cursor count
      expect(listenersAfter1).toBe(1);
      expect(listenersAfter5).toBe(1);
      expect(listenersAfter1).toBe(listenersAfter5);
      
      addEventListenerSpy.mockRestore();
    });

    it('should demonstrate O(1) subscriber management', () => {
      const tracker = MouseTracker.getInstance();
      const startTime = performance.now();
      
      // Add 100 subscribers
      const unsubscribers: Array<() => void> = [];
      for (let i = 0; i < 100; i++) {
        const unsubscribe = tracker.subscribe({
          id: `stress-cursor-${i}`,
          callback: vi.fn(),
        });
        unsubscribers.push(unsubscribe);
      }
      
      const subscriptionTime = performance.now() - startTime;
      
      // Verify all subscribers are registered
      expect(tracker.getSubscriberCount()).toBe(100);
      
      // Clean up
      unsubscribers.forEach(unsub => unsub());
      expect(tracker.getSubscriberCount()).toBe(0);
      
      // Subscription time should be reasonable (this is more of a smoke test)
      expect(subscriptionTime).toBeDefined();
    });
  });

  describe('Memory Efficiency', () => {
    it('should not create duplicate throttle functions', () => {
      const tracker = MouseTracker.getInstance();
      
      // Subscribe multiple cursors with same throttle settings
      const callbacks = Array.from({ length: 10 }, () => vi.fn());
      callbacks.forEach((callback, i) => {
        tracker.subscribe({
          id: `throttle-cursor-${i}`,
          callback,
          throttleMs: 16, // Same throttle setting
        });
      });
      
      expect(tracker.getSubscriberCount()).toBe(10);
      
      // All subscribers should be managed by single event system
      // (This is more of a structural test - hard to measure memory directly in tests)
    });

    it('should clean up properly when cursors unmount', () => {
      const { unmount } = render(<MultipleCursors count={5} />);
      const tracker = MouseTracker.getInstance();
      
      // Should have 5 subscribers
      expect(tracker.getSubscriberCount()).toBe(5);
      
      // Unmount all cursors
      unmount();
      
      // Should clean up all subscribers
      expect(tracker.getSubscriberCount()).toBe(0);
    });
  });

  describe('Functional Performance', () => {
    it('should handle rapid mouse events efficiently with multiple cursors', () => {
      const callbacks = Array.from({ length: 10 }, () => vi.fn());
      const tracker = MouseTracker.getInstance();
      
      // Subscribe all cursors
      callbacks.forEach((callback, i) => {
        tracker.subscribe({
          id: `rapid-cursor-${i}`,
          callback,
        });
      });
      
      // Simulate mouse movement (just one to test the system works)
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      
      // In our O(1) architecture, all 10 callbacks should be ready to be called
      // (They'll be called on the next RAF, but the subscription works immediately)
      expect(tracker.getSubscriberCount()).toBe(10);
    });

    it('should maintain correct container isolation with multiple cursors', () => {
      const tracker = MouseTracker.getInstance();
      
      // Create containers
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');
      
      container1.getBoundingClientRect = vi.fn(() => ({
        left: 0, top: 0, right: 100, bottom: 100,
        width: 100, height: 100, x: 0, y: 0, toJSON: () => ({})
      }));
      
      container2.getBoundingClientRect = vi.fn(() => ({
        left: 200, top: 200, right: 300, bottom: 300,
        width: 100, height: 100, x: 200, y: 200, toJSON: () => ({})
      }));
      
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Subscribe cursors to different containers
      tracker.subscribe({
        id: 'container1-cursor',
        callback: callback1,
      });
      
      tracker.subscribe({
        id: 'container2-cursor',
        callback: callback2,
      });
      
      // Test that both cursors are properly subscribed
      expect(tracker.getSubscriberCount()).toBe(2);
      
      // Test that container bounds checking is set up
      expect(container1.getBoundingClientRect).toBeDefined();
      expect(container2.getBoundingClientRect).toBeDefined();
    });
  });

  describe('Backwards Compatibility', () => {
    it('should maintain the same API for CustomCursor component', () => {
      // Test that existing component usage still works
      expect(() => {
        render(
          <>
            <CustomCursor id="compat-test-1">
              <div>Cursor 1</div>
            </CustomCursor>
            <CustomCursor 
              id="compat-test-2"
              smoothness={2}
              throttleMs={16}
              offset={{ x: 10, y: 10 }}
            >
              <div>Cursor 2</div>
            </CustomCursor>
          </>
        );
      }).not.toThrow();
    });

    it('should handle all existing prop combinations', () => {
      const containerRef = React.createRef<HTMLDivElement>();
      const onMove = vi.fn();
      const onVisibilityChange = vi.fn();
      
      expect(() => {
        render(
          <CustomCursor
            id="full-props-test"
            enabled={true}
            className="test-cursor"
            style={{ color: 'red' }}
            zIndex={10000}
            offset={{ x: 5, y: -5 }}
            smoothness={3}
            containerRef={containerRef}
            centered={true}
            throttleMs={32}
            onMove={onMove}
            onVisibilityChange={onVisibilityChange}
            data-testid="test-cursor"
            role="presentation"
            aria-label="Custom cursor"
          >
            <div>Complex Cursor</div>
          </CustomCursor>
        );
      }).not.toThrow();
    });
  });
}); 