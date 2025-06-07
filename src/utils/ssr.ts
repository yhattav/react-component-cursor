/**
 * SSR (Server-Side Rendering) utility functions
 * Provides safe detection and handling of server-side rendering environments
 */

/**
 * Detects if the code is running in a server-side rendering environment
 * @returns true if running on server (SSR), false if running in browser
 */
export const isSSR = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * Detects if the code is running in a browser environment
 * @returns true if running in browser, false if running on server
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Detects if the code is running on a mobile/touch device
 * Uses multiple detection methods for better accuracy
 * @returns true if running on mobile/touch device, false otherwise
 */
export const isMobileDevice = (): boolean => {
  if (isSSR()) {
    return false;
  }

  // Check for touch capability
  const hasTouchCapability = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            (navigator as any).msMaxTouchPoints > 0;

  // Check user agent for mobile patterns
  const mobileUserAgentPattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUserAgent = mobileUserAgentPattern.test(navigator.userAgent);

  // Check for small screen size (mobile viewport)
  const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 768;

  // Device is considered mobile if it has touch AND (mobile user agent OR small screen)
  return hasTouchCapability && (isMobileUserAgent || isSmallScreen);
};

/**
 * Safely executes a function only in browser environment
 * @param fn Function to execute in browser
 * @param fallback Optional fallback value to return in SSR
 * @returns Result of function or fallback value
 */
export const browserOnly = <T>(fn: () => T, fallback?: T): T | undefined => {
  if (isBrowser()) {
    return fn();
  }
  return fallback;
};

/**
 * Safely gets the document object, handling SSR
 * @returns document if in browser, null if in SSR
 */
export const safeDocument = (): Document | null => {
  return isBrowser() ? document : null;
};

/**
 * Safely gets the window object, handling SSR
 * @returns window if in browser, null if in SSR
 */
export const safeWindow = (): Window | null => {
  return isBrowser() ? window : null;
}; 