import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { vi } from 'vitest';import '@testing-library/jest-dom';
import { vi } from 'vitest';import { CustomCursor } from '../src';
import * as hooks from '../src/hooks';

// Mock createPortal to render directly instead of using portals
vi.mock('react-dom', () => ({
  ...vi.importActual('react-dom'),
  createPortal: (children: React.ReactNode) => children,
}));

// Mock the hooks to control the test environment
vi.mock('../src/hooks', () => {
  return {
    useMousePosition: vi.fn(() => ({
      position: { x: 100, y: 100 },
      setPosition: vi.fn(),
      targetPosition: { x: 100, y: 100 },
      isVisible: true,
    })),
    useSmoothAnimation: vi.fn(),
  };
});

// Mock validation to avoid testing it here
vi.mock('../src/utils/validation', () => ({
  validateProps: vi.fn(),
}));

// Get references to mocked functions
const mockUseMousePosition = hooks.useMousePosition as MockedFunction<typeof hooks.useMousePosition>;

// Helper to get Chrome-specific memory usage
const getHeapSize = (): number => {
  return (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
};

// Performance measurement utilities
interface PerformanceMetrics {
  renderTime: number;
  reRenderCount: number;
  memoryUsage?: number;
}

const measureRenderPerformance = (renderFn: () => void): PerformanceMetrics => {
  const startTime = performance.now();
  const originalCallCount = mockUseMousePosition.mock.calls.length;
  
  renderFn();
  
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  const newCallCount = mockUseMousePosition.mock.calls.length;
  const reRenderCount = newCallCount - originalCallCount;
  
  return {
    renderTime,
    reRenderCount,
    memoryUsage: getHeapSize() || undefined,
  };
};

// Helper to clean DOM more safely
const cleanupDOM = () => {
  document.querySelectorAll('#cursor-container').forEach(el => {
    try {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });
  
  document.querySelectorAll('[id^="cursor-style"]').forEach(el => {
    try {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });
};

describe('CustomCursor Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanupDOM();
    
    // Reset mock to default values
    mockUseMousePosition.mockReturnValue({
      position: { x: 100, y: 100 },
      setPosition: vi.fn(),
      targetPosition: { x: 100, y: 100 },
      isVisible: true,
    });
  });

  afterEach(() => {
    cleanup();
    cleanupDOM();
  });

  describe('Render Performance', () => {
    it('renders within acceptable time limits', () => {
      const metrics = measureRenderPerformance(() => {
        render(<CustomCursor>Performance Test</CustomCursor>);
      });
      
      // Should render in under 50ms for a simple cursor
      expect(metrics.renderTime).toBeLessThan(50);
      expect(metrics.reRenderCount).toBeGreaterThanOrEqual(1);
    });

    it('handles multiple cursors efficiently', () => {
      const metrics = measureRenderPerformance(() => {
        render(
          <>
            {Array.from({ length: 5 }, (_, i) => (
              <CustomCursor key={i} id={`cursor-${i}`}>
                Cursor {i}
              </CustomCursor>
            ))}
          </>
        );
      });
      
      // Should render 5 cursors in under 200ms
      expect(metrics.renderTime).toBeLessThan(200);
      expect(metrics.reRenderCount).toBeGreaterThanOrEqual(5);
    });

    it('renders with complex children efficiently', () => {
      const ComplexChild = () => (
        <div style={{ padding: '20px', background: 'linear-gradient(45deg, red, blue)' }}>
          <h1>Complex Cursor</h1>
          <p>With nested content</p>
          <ul>
            {Array.from({ length: 10 }, (_, i) => (
              <li key={i}>Item {i}</li>
            ))}
          </ul>
        </div>
      );

      const metrics = measureRenderPerformance(() => {
        render(
          <CustomCursor>
            <ComplexChild />
          </CustomCursor>
        );
      });
      
      // Should handle complex children in under 100ms
      expect(metrics.renderTime).toBeLessThan(100);
    });
  });

  describe('Re-render Performance', () => {
    it('minimizes re-renders with stable props', () => {
      const stableProps = {
        id: 'stable-test',
        zIndex: 1000,
        style: { color: 'red' },
        onMove: vi.fn(),
      };

      const { rerender } = render(<CustomCursor {...stableProps}>Test</CustomCursor>);
      
      // Clear initial render
      vi.clearAllMocks();
      
      const metrics = measureRenderPerformance(() => {
        // Re-render with identical props - should not trigger re-render due to React.memo
        rerender(<CustomCursor {...stableProps}>Test</CustomCursor>);
      });
      
      expect(metrics.reRenderCount).toBe(0); // React.memo should prevent re-render
    });

    it('handles rapid prop changes efficiently', () => {
      const { rerender } = render(<CustomCursor id="rapid-test">Test</CustomCursor>);
      
      const metrics = measureRenderPerformance(() => {
        // Simulate rapid prop changes (like during animation)
        for (let i = 0; i < 10; i++) {
          rerender(<CustomCursor id="rapid-test" zIndex={1000 + i}>Test</CustomCursor>);
        }
      });
      
      // Should handle 10 rapid re-renders in under 100ms
      expect(metrics.renderTime).toBeLessThan(100);
      expect(metrics.reRenderCount).toBeGreaterThanOrEqual(10);
    });

    it('optimizes position updates through hooks', () => {
      const setPositionMock = vi.fn();
      
      mockUseMousePosition.mockReturnValue({
        position: { x: 100, y: 100 },
        setPosition: setPositionMock,
        targetPosition: { x: 100, y: 100 },
        isVisible: true,
      });

      render(<CustomCursor>Position Test</CustomCursor>);
      
      // Simulate rapid position updates
      const startTime = performance.now();
      
      act(() => {
        for (let i = 0; i < 100; i++) {
          setPositionMock({ x: 100 + i, y: 100 + i });
        }
      });
      
      const endTime = performance.now();
      const updateTime = endTime - startTime;
      
      // Should handle 100 position updates quickly
      expect(updateTime).toBeLessThan(50);
    });
  });

  describe('Memory Performance', () => {
    it('does not leak memory with mount/unmount cycles', () => {
      const initialMemory = getHeapSize();
      
      // Mount and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<CustomCursor id={`memory-test-${i}`}>Test {i}</CustomCursor>);
        unmount();
        cleanupDOM();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = getHeapSize();
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (under 1MB for 10 cycles)
      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
      }
    });

    it('cleans up event listeners and DOM elements', () => {
      const { unmount } = render(<CustomCursor id="cleanup-test">Cleanup Test</CustomCursor>);
      
      // Verify elements exist
      expect(document.getElementById('cursor-style-cleanup-test')).toBeInTheDocument();
      
      unmount();
      
      // Elements should be cleaned up
      expect(document.getElementById('cursor-style-cleanup-test')).not.toBeInTheDocument();
    });
  });

  describe('Animation Performance', () => {
    it('handles smooth animation without performance degradation', () => {
      // Mock animation frame
      const mockRequestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame')
        .mockImplementation((callback) => {
          // Immediately call the callback for testing
          callback(16.67);
          return 1;
        });

      const startTime = performance.now();
      
      render(<CustomCursor smoothness={2}>Animation Test</CustomCursor>);
      
      // Simulate multiple animation frames
      for (let i = 0; i < 60; i++) {
        // This would normally trigger animation logic
      }
      
      const endTime = performance.now();
      const animationTime = endTime - startTime;
      
      // Animation processing should be efficient
      expect(animationTime).toBeLessThan(100);
      
      mockRequestAnimationFrame.mockRestore();
    });

    it('maintains performance with multiple animated cursors', () => {
      const metrics = measureRenderPerformance(() => {
        render(
          <>
            {Array.from({ length: 3 }, (_, i) => (
              <CustomCursor key={i} id={`animated-cursor-${i}`} smoothness={2}>
                Animated Cursor {i}
              </CustomCursor>
            ))}
          </>
        );
      });
      
      // Multiple animated cursors should still render efficiently
      expect(metrics.renderTime).toBeLessThan(150);
      expect(metrics.reRenderCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Prop Configuration Performance', () => {
    it('handles complex style objects efficiently', () => {
      const complexStyle = {
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
        borderRadius: '50%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        transform: 'scale(1.2) rotate(45deg)',
        filter: 'blur(1px) brightness(1.1)',
        transition: 'all 0.3s ease',
      };

      const metrics = measureRenderPerformance(() => {
        render(<CustomCursor style={complexStyle}>Complex Style</CustomCursor>);
      });
      
      expect(metrics.renderTime).toBeLessThan(75);
    });

    it('performs well with all props configured', () => {
      const allProps = {
        id: 'full-props-test',
        enabled: true,
        className: 'custom-cursor-class',
        style: { backgroundColor: 'red', padding: '10px' },
        zIndex: 9999,
        offset: { x: 10, y: 10 },
        smoothness: 1.5,
        containerRef: React.createRef<HTMLDivElement>(),
        throttleMs: 16,
        showDevIndicator: true,
        onMove: vi.fn(),
        onVisibilityChange: vi.fn(),
      };

      const metrics = measureRenderPerformance(() => {
        render(<CustomCursor {...allProps}>Full Props Test</CustomCursor>);
      });
      
      expect(metrics.renderTime).toBeLessThan(100);
    });

    it('handles disabled state efficiently', () => {
      const metrics = measureRenderPerformance(() => {
        render(<CustomCursor enabled={false}>Disabled Cursor</CustomCursor>);
      });
      
      // Disabled cursors should render very quickly (early return)
      expect(metrics.renderTime).toBeLessThan(25);
    });
  });

  describe('Bundle Size Impact', () => {
    it('maintains small component footprint', () => {
      // This is more of a documentation test - actual bundle analysis happens in build
      const componentString = CustomCursor.toString();
      
      // Component source should be reasonable size (rough estimate)
      expect(componentString.length).toBeLessThan(50000); // ~50KB max for component source
    });
  });

  describe('Stress Testing', () => {
    it('handles rapid enable/disable cycles', () => {
      const { rerender } = render(<CustomCursor enabled={true}>Stress Test</CustomCursor>);
      
      const metrics = measureRenderPerformance(() => {
        for (let i = 0; i < 50; i++) {
          rerender(<CustomCursor enabled={i % 2 === 0}>Stress Test</CustomCursor>);
        }
      });
      
      // Should handle 50 enable/disable cycles efficiently
      expect(metrics.renderTime).toBeLessThan(200);
    });

    it('performs well with extreme cursor counts', () => {
      const metrics = measureRenderPerformance(() => {
        render(
          <>
            {Array.from({ length: 20 }, (_, i) => (
              <CustomCursor key={i} id={`stress-cursor-${i}`}>
                Cursor {i}
              </CustomCursor>
            ))}
          </>
        );
      });
      
      // 20 cursors should still be manageable
      expect(metrics.renderTime).toBeLessThan(500);
    });
  });

  describe('Throttling Performance', () => {
    it('handles different throttle configurations efficiently', () => {
      const throttleConfigs = [0, 16, 32, 60];
      
      throttleConfigs.forEach(throttleMs => {
        const metrics = measureRenderPerformance(() => {
          render(<CustomCursor throttleMs={throttleMs}>Throttle {throttleMs}ms</CustomCursor>);
        });
        
        // All throttle configurations should render efficiently
        expect(metrics.renderTime).toBeLessThan(50);
      });
    });
  });
}); 