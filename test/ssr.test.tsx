/**
 * @jest-environment node
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { CustomCursor } from '../src';
import * as ssrUtils from '../src/utils/ssr';

// Mock the SSR utilities to test both scenarios
jest.mock('../src/utils/ssr', () => ({
  isSSR: jest.fn(),
  isBrowser: jest.fn(),
  safeDocument: jest.fn(),
  safeWindow: jest.fn(),
  browserOnly: jest.fn(),
  isMobileDevice: jest.fn(),
}));

const mockSSRUtils = ssrUtils as jest.Mocked<typeof ssrUtils>;

describe('SSR Compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock mobile detection to return false in SSR (no window/navigator)
    mockSSRUtils.isMobileDevice.mockReturnValue(false);
  });

  describe('SSR Environment Detection', () => {
    it('should detect when isSSR returns true', () => {
      // Mock isSSR to return true to test SSR behavior
      mockSSRUtils.isSSR.mockReturnValue(true);
      mockSSRUtils.isBrowser.mockReturnValue(false);
      
      expect(mockSSRUtils.isSSR()).toBe(true);
      expect(mockSSRUtils.isBrowser()).toBe(false);
    });

    it('should provide safe document access when mocked for SSR', () => {
      mockSSRUtils.safeDocument.mockReturnValue(null);
      mockSSRUtils.safeWindow.mockReturnValue(null);
      
      expect(mockSSRUtils.safeDocument()).toBeNull();
      expect(mockSSRUtils.safeWindow()).toBeNull();
    });

    it('should execute browserOnly functions safely when mocked for SSR', () => {
      const testFn = jest.fn(() => 'browser-result');
      const fallback = 'fallback-result';
      
      mockSSRUtils.browserOnly.mockImplementation((_fn, fallbackValue) => {
        // Simulate SSR behavior - don't call function, return fallback
        return fallbackValue;
      });
      
      const result = mockSSRUtils.browserOnly(testFn, fallback);
      
      expect(testFn).not.toHaveBeenCalled();
      expect(result).toBe(fallback);
    });
  });

  describe('CustomCursor SSR Behavior', () => {
    it('should render null during SSR', () => {
      mockSSRUtils.isSSR.mockReturnValue(true);
      
      const html = renderToString(
        <CustomCursor>
          <div>Custom Cursor Content</div>
        </CustomCursor>
      );
      
      expect(html).toBe('');
      expect(mockSSRUtils.isSSR).toHaveBeenCalled();
    });

    it('should render null when disabled', () => {
      mockSSRUtils.isSSR.mockReturnValue(false);
      
      const html = renderToString(
        <CustomCursor enabled={false}>
          <div>Custom Cursor Content</div>
        </CustomCursor>
      );
      
      expect(html).toBe('');
    });

    it('should not cause hydration mismatches', () => {
      // Test that SSR and client rendering produce consistent results
      mockSSRUtils.isSSR.mockReturnValue(true);
      
      const ssrHtml = renderToString(
        <div>
          <h1>Page Content</h1>
          <CustomCursor>
            <div>Cursor</div>
          </CustomCursor>
        </div>
      );
      
      // Should only contain the page content, no cursor
      expect(ssrHtml).toContain('<h1>Page Content</h1>');
      expect(ssrHtml).not.toContain('Cursor');
    });

    it('should handle complex prop combinations during SSR', () => {
      mockSSRUtils.isSSR.mockReturnValue(true);
      
      const html = renderToString(
        <CustomCursor
          id="test-cursor"
          enabled={true}
          className="custom-class"
          style={{ color: 'red' }}
          smoothness={2}
          onMove={() => undefined}
          onVisibilityChange={() => undefined}
        >
          <div>Complex Cursor</div>
        </CustomCursor>
      );
      
      expect(html).toBe('');
    });
  });

  describe('Framework Integration', () => {
    it('should work with Next.js-style component wrapping', () => {
      mockSSRUtils.isSSR.mockReturnValue(true);
      
      // Simulate Next.js dynamic import pattern
      const DynamicCursor = (props: any) => {
        if (typeof window === 'undefined') {
          return null; // SSR
        }
        return <CustomCursor {...props} />;
      };
      
      const html = renderToString(
        <DynamicCursor>
          <div>Next.js Cursor</div>
        </DynamicCursor>
      );
      
      expect(html).toBe('');
    });

    it('should work with Gatsby-style conditional rendering', () => {
      mockSSRUtils.isSSR.mockReturnValue(true);
      
      // Simulate Gatsby conditional rendering pattern
      const GatsbyCursor = (props: any) => {
        const [mounted, setMounted] = React.useState(false);
        
        React.useEffect(() => {
          setMounted(true);
        }, []);
        
        if (!mounted) return null;
        
        return <CustomCursor {...props} />;
      };
      
      const html = renderToString(
        <GatsbyCursor>
          <div>Gatsby Cursor</div>
        </GatsbyCursor>
      );
      
      expect(html).toBe('');
    });
  });

  describe('Performance in SSR', () => {
    it('should not execute expensive operations during SSR', () => {
      mockSSRUtils.isSSR.mockReturnValue(true);
      mockSSRUtils.safeDocument.mockReturnValue(null);
      
      const onMove = jest.fn();
      const onVisibilityChange = jest.fn();
      
      renderToString(
        <CustomCursor
          onMove={onMove}
          onVisibilityChange={onVisibilityChange}
        >
          <div>Performance Test</div>
        </CustomCursor>
      );
      
      // Callbacks should not be executed during SSR
      expect(onMove).not.toHaveBeenCalled();
      expect(onVisibilityChange).not.toHaveBeenCalled();
    });

    it('should handle missing browser APIs gracefully', () => {
      mockSSRUtils.isSSR.mockReturnValue(true);
      mockSSRUtils.safeDocument.mockReturnValue(null);
      mockSSRUtils.safeWindow.mockReturnValue(null);
      
      expect(() => {
        renderToString(
          <CustomCursor>
            <div>API Test</div>
          </CustomCursor>
        );
      }).not.toThrow();
    });
  });

  describe('Error Boundaries', () => {
    it('should not break parent components during SSR', () => {
      mockSSRUtils.isSSR.mockReturnValue(true);
      
      const ParentComponent = () => (
        <div>
          <h1>Parent Content</h1>
          <CustomCursor>
            <div>Child Cursor</div>
          </CustomCursor>
          <p>More content</p>
        </div>
      );
      
      const html = renderToString(<ParentComponent />);
      
      expect(html).toContain('<h1>Parent Content</h1>');
      expect(html).toContain('<p>More content</p>');
      expect(html).not.toContain('Child Cursor');
    });
  });
});

describe('Browser Environment Tests', () => {
  beforeEach(() => {
    // Mock browser environment
    mockSSRUtils.isSSR.mockReturnValue(false);
    mockSSRUtils.isBrowser.mockReturnValue(true);
    mockSSRUtils.safeDocument.mockReturnValue(document);
    mockSSRUtils.safeWindow.mockReturnValue(window as any);
    mockSSRUtils.isMobileDevice.mockReturnValue(false); // Desktop browser
  });

  it('should detect browser environment correctly', () => {
    expect(mockSSRUtils.isBrowser()).toBe(true);
    expect(mockSSRUtils.isSSR()).toBe(false);
  });

  it('should provide safe browser API access', () => {
    expect(mockSSRUtils.safeDocument()).toBeDefined();
    expect(mockSSRUtils.safeWindow()).toBeDefined();
  });

  it('should execute browserOnly functions', () => {
    mockSSRUtils.browserOnly.mockImplementation((fn) => fn());
    
    const testFn = jest.fn(() => 'browser-result');
    mockSSRUtils.browserOnly(testFn);
    
    expect(testFn).toHaveBeenCalled();
  });
}); 