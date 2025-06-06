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
 * Safely accesses document object
 * @returns document object if in browser, undefined if in SSR
 */
export const safeDocument = (): Document | undefined => {
  return browserOnly(() => document);
};

/**
 * Safely accesses window object
 * @returns window object if in browser, undefined if in SSR
 */
export const safeWindow = (): Window | undefined => {
  return browserOnly(() => window);
}; 