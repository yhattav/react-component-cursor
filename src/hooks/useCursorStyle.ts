import * as React from 'react';

interface UseCursorStyleOptions {
  containerRef?: React.RefObject<HTMLElement>;
  showNativeCursor: boolean;
}

/**
 * Custom hook to manage cursor styles on target elements
 * Handles storing/restoring original cursor styles and applying new ones
 */
export function useCursorStyle({ containerRef, showNativeCursor }: UseCursorStyleOptions): void {
  React.useEffect(() => {
    const targetElement = containerRef?.current || document.body;
    
    // Store the original cursor style if not already stored
    if (!targetElement.hasAttribute('data-original-cursor')) {
      targetElement.setAttribute('data-original-cursor', targetElement.style.cursor || '');
    }
    
    // Apply the cursor style
    targetElement.style.cursor = showNativeCursor ? 'auto' : 'none';
    
    return () => {
      // Use the stored targetElement, not containerRef.current which might be null
      const originalCursor = targetElement.getAttribute('data-original-cursor') || '';
      targetElement.style.cursor = originalCursor;
      targetElement.removeAttribute('data-original-cursor');
    };
  }, [containerRef, showNativeCursor]);
} 