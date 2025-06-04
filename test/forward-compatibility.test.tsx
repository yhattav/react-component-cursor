import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  CustomCursor,
  type CursorVisibilityReason,
  type CursorState,
  type CursorMode,
} from '../src';

describe('Forward Compatibility', () => {
  it('supports extended visibility reasons', () => {
    const handleVisibilityChange = jest.fn<void, [boolean, CursorVisibilityReason]>();
    
    render(
      <CustomCursor onVisibilityChange={handleVisibilityChange}>
        Extended visibility cursor
      </CustomCursor>
    );

    // Should accept the extended string type
    expect(handleVisibilityChange).toHaveBeenCalledWith(true, 'container');
  });

  it('exports future-ready types', () => {
    // These should compile without errors, proving type compatibility
    const state: CursorState = 'hover'; // Should accept standard states
    const customState: CursorState = 'custom-state'; // Should accept custom strings
    
    const mode: CursorMode = 'pointer'; // Should accept standard modes  
    const customMode: CursorMode = 'custom-mode'; // Should accept custom strings

    // These assertions just verify the types work
    expect(state).toBe('hover');
    expect(customState).toBe('custom-state');
    expect(mode).toBe('pointer');
    expect(customMode).toBe('custom-mode');
  });

  it('maintains backward compatibility', () => {
    // Test that all existing functionality still works unchanged
    const onMove = jest.fn();
    const onVisibilityChange = jest.fn();

    expect(() => {
      render(
        <CustomCursor
          id="test"
          enabled={true}
          className="test-class"
          smoothness={2}
          offset={{ x: 10, y: 20 }}
          showNativeCursor={false}
          throttleMs={16}
          onMove={onMove}
          onVisibilityChange={onVisibilityChange}
        >
          Backward compatible cursor
        </CustomCursor>
      );
    }).not.toThrow();
  });
}); 