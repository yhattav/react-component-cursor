import * as React from 'react';

interface UseCursorStyleOptions {
  containerRef?: React.RefObject<HTMLElement>;
  showNativeCursor: boolean;
}

/**
 * Custom hook to manage cursor styles on target elements
 * Handles storing/restoring original cursor styles and applying new ones
 */
export function useCursorStyle({ containerRef, showNativeCursor }: UseCursorStyleOptions) {
  React.useEffect(() => {
    const targetElement = containerRef?.current || document.body;
    
    // Store the original cursor style if not already stored
    if (!targetElement.hasAttribute('data-original-cursor')) {
      targetElement.setAttribute('data-original-cursor', targetElement.style.cursor || '');
    }
    
    // Apply the cursor style
    targetElement.style.cursor = showNativeCursor ? 'auto' : 'none';
    
    return () => {
      if (containerRef?.current) {
        // Restore original cursor style
        const originalCursor = containerRef.current.getAttribute('data-original-cursor') || '';
        containerRef.current.style.cursor = originalCursor;
        containerRef.current.removeAttribute('data-original-cursor');
      } else {
        // Restore original cursor style for body
        const originalCursor = document.body.getAttribute('data-original-cursor') || '';
        document.body.style.cursor = originalCursor;
        document.body.removeAttribute('data-original-cursor');
      }
    };
  }, [containerRef, showNativeCursor]);
} 