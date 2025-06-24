import React from 'react';
import { render } from '@testing-library/react';
import { vi, type MockInstance } from 'vitest';
import { CustomCursor } from '../src';

// Mock console methods to capture validation messages
const originalError = console.error;
const originalWarn = console.warn;

describe('Prop Validation', () => {
  let errorSpy: MockInstance;
  let warnSpy: MockInstance;

  beforeEach(() => {
    // Ensure we're in development mode for validation
    process.env.NODE_ENV = 'development';
    
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation for console.error
    });
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // Mock implementation for console.warn
    });
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    console.error = originalError;
    console.warn = originalWarn;
  });

  describe('id validation', () => {
    it('should error for empty string id', () => {
      render(<CustomCursor id="">Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('id\' must be a non-empty string')
      );
    });

    it('should error for non-string id', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor id={123}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('id\' must be a non-empty string')
      );
    });

    it('should not error for valid id', () => {
      render(<CustomCursor id="valid-id">Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('smoothness validation', () => {
    it('should error for non-number smoothness', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor smoothness={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('smoothness\' must be a number')
      );
    });

    it('should error for negative smoothness', () => {
      render(<CustomCursor smoothness={-1}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('smoothness\' must be non-negative')
      );
    });

    it('should warn for very high smoothness', () => {
      render(<CustomCursor smoothness={25}>Test cursor</CustomCursor>);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('smoothness\' value 25 is very high')
      );
    });

    it('should not error for valid smoothness', () => {
      render(<CustomCursor smoothness={2}>Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('throttleMs validation', () => {
    it('should error for non-number throttleMs', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor throttleMs={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('throttleMs\' must be a number')
      );
    });

    it('should error for negative throttleMs', () => {
      render(<CustomCursor throttleMs={-5}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('throttleMs\' must be non-negative')
      );
    });

    it('should warn for very high throttleMs', () => {
      render(<CustomCursor throttleMs={150}>Test cursor</CustomCursor>);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('throttleMs\' value 150 is quite high')
      );
    });

    it('should not error for valid throttleMs', () => {
      render(<CustomCursor throttleMs={16}>Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('zIndex validation', () => {
    it('should error for non-number zIndex', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor zIndex={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('zIndex\' must be a number')
      );
    });

    it('should warn for non-integer zIndex', () => {
      render(<CustomCursor zIndex={9999.5}>Test cursor</CustomCursor>);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('zIndex\' should be an integer')
      );
    });

    it('should not error for valid integer zIndex', () => {
      render(<CustomCursor zIndex={1000}>Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe('offset validation', () => {
    it('should error for non-object offset', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor offset={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('offset\' must be an object with x and y properties')
      );
    });

    it('should error for invalid x in offset', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor offset={{ x: 'invalid' , y: 10 }}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('offset.x\' must be a number')
      );
    });

    it('should error for invalid y in offset', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor offset={{ x: 10, y: 'invalid'  }}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('offset.y\' must be a number')
      );
    });

    it('should not error for valid offset', () => {
      render(<CustomCursor offset={{ x: 10, y: 20 }}>Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('containerRef validation', () => {
    it('should error for non-ref containerRef', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor containerRef={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('containerRef\' must be a React ref object')
      );
    });

    it('should not error for valid ref', () => {
      const validRef = React.createRef<HTMLDivElement>();
      render(<CustomCursor containerRef={validRef}>Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('showDevIndicator validation', () => {
    it('should error for non-boolean showDevIndicator', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor showDevIndicator={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('showDevIndicator\' must be a boolean')
      );
    });

    it('should not error for valid boolean showDevIndicator', () => {
      render(<CustomCursor showDevIndicator={false}>Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
      
      render(<CustomCursor showDevIndicator={true}>Test cursor</CustomCursor>);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('callback validation', () => {
    it('should error for non-function onMove', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor onMove={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('onMove\' must be a function')
      );
    });

    it('should error for non-function onVisibilityChange', () => {
      // @ts-expect-error Testing invalid prop type
      render(<CustomCursor onVisibilityChange={'invalid'}>Test cursor</CustomCursor>);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('onVisibilityChange\' must be a function')
      );
    });

    it('should not error for valid callbacks', () => {
      const onMove = vi.fn();
      const onVisibilityChange = vi.fn();
      render(
        <CustomCursor onMove={onMove} onVisibilityChange={onVisibilityChange}>
          Test cursor
        </CustomCursor>
      );
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('production mode', () => {
    it('should not validate in production mode', () => {
      process.env.NODE_ENV = 'production';
      
      render(<CustomCursor smoothness={-1} throttleMs={-5}>Test cursor</CustomCursor>);
      
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
}); 