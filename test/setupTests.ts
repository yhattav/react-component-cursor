import '@testing-library/jest-dom';

// ===== BROWSER API MOCKS =====

// Mock requestAnimationFrame and cancelAnimationFrame
let rafId = 0;
const rafCallbacks = new Map<number, FrameRequestCallback>();

global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  const id = ++rafId;
  rafCallbacks.set(id, callback);
  
  // Execute callback immediately in tests (synchronous)
  // Can be overridden in specific tests for async behavior
  if (process.env.NODE_ENV === 'test') {
    setTimeout(() => callback(performance.now()), 0);
  }
  
  return id;
});

global.cancelAnimationFrame = jest.fn((id: number) => {
  rafCallbacks.delete(id);
});

// Helper to manually trigger RAF callbacks in tests
global.triggerRAF = (timestamp: number = performance.now()) => {
  const callbacks = Array.from(rafCallbacks.values());
  rafCallbacks.clear();
  callbacks.forEach(callback => callback(timestamp));
};

// Mock performance.now()
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
};

// ===== DOM API MOCKS =====

// Mock getBoundingClientRect
const mockGetBoundingClientRect = jest.fn(() => ({
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
  toJSON: () => ({}),
}));

// Apply to HTMLElement prototype (only if in browser environment)
if (typeof HTMLElement !== 'undefined') {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    value: mockGetBoundingClientRect,
    writable: true,
  });
}

// Mock document methods used by CustomCursor (only if in browser environment)
let originalGetElementById: typeof document.getElementById;
let originalCreateElement: typeof document.createElement;
let originalBodyAppendChild: typeof document.body.appendChild;
let originalHeadAppendChild: typeof document.head.appendChild;

if (typeof document !== 'undefined') {
  originalGetElementById = document.getElementById;
  originalCreateElement = document.createElement;
  originalBodyAppendChild = document.body.appendChild;
  originalHeadAppendChild = document.head.appendChild;
}

// Track created elements for cleanup
const createdElements = new Set<Element>();

// Mock document methods only if in browser environment
if (typeof document !== 'undefined') {
  document.getElementById = jest.fn((id: string) => {
    return originalGetElementById.call(document, id);
  });

  document.createElement = jest.fn((tagName: string) => {
    const element = originalCreateElement.call(document, tagName);
    createdElements.add(element);
    return element;
  });
}

// Track appendChild calls with proper typing - only mock when needed
// Don't override by default, let tests handle mocking when needed

// Mock window object properties (only if in browser environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  });
}

// ===== EVENT LISTENER MOCKS =====

// Track event listeners for testing
const eventListeners = new Map<string, Set<EventListenerOrEventListenerObject>>();

// Store original functions (only if in browser environment)
let originalAddEventListener: typeof Element.prototype.addEventListener;
let originalRemoveEventListener: typeof Element.prototype.removeEventListener;
let originalDocumentAddEventListener: typeof document.addEventListener;
let originalDocumentRemoveEventListener: typeof document.removeEventListener;

if (typeof Element !== 'undefined' && typeof document !== 'undefined') {
  originalAddEventListener = Element.prototype.addEventListener;
  originalRemoveEventListener = Element.prototype.removeEventListener;
  originalDocumentAddEventListener = document.addEventListener;
  originalDocumentRemoveEventListener = document.removeEventListener;
}

// Mock Element and document methods only if in browser environment
if (typeof Element !== 'undefined' && typeof document !== 'undefined') {
  // Mock Element.addEventListener
  Element.prototype.addEventListener = jest.fn(function(
    this: Element,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    const key = `${this.tagName || 'ELEMENT'}-${type}`;
    if (!eventListeners.has(key)) {
      eventListeners.set(key, new Set());
    }
    const listeners = eventListeners.get(key);
    listeners?.add(listener);
    
    return originalAddEventListener.call(this, type, listener, options);
  });

  // Mock Element.removeEventListener
  Element.prototype.removeEventListener = jest.fn(function(
    this: Element,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) {
    const key = `${this.tagName || 'ELEMENT'}-${type}`;
    eventListeners.get(key)?.delete(listener);
    
    return originalRemoveEventListener.call(this, type, listener, options);
  });

  // Mock document.addEventListener
  document.addEventListener = jest.fn((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => {
    const key = `DOCUMENT-${type}`;
    if (!eventListeners.has(key)) {
      eventListeners.set(key, new Set());
    }
    const listeners = eventListeners.get(key);
    listeners?.add(listener);
    
    return originalDocumentAddEventListener.call(document, type, listener, options);
  });

  // Mock document.removeEventListener
  document.removeEventListener = jest.fn((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => {
    const key = `DOCUMENT-${type}`;
    eventListeners.get(key)?.delete(listener);
    
    return originalDocumentRemoveEventListener.call(document, type, listener, options);
  });
}

// Helper to trigger events for testing
global.triggerEvent = (
  target: Element | Document, 
  eventType: string, 
  eventProps: Partial<Event> = {}
) => {
  const event = new Event(eventType, { bubbles: true, cancelable: true, ...eventProps });
  Object.assign(event, eventProps);
  target.dispatchEvent(event);
};

// Helper to trigger mouse events
global.triggerMouseEvent = (
  target: Element | Document,
  eventType: string,
  { clientX = 0, clientY = 0, ...eventProps }: Partial<MouseEvent> = {}
) => {
  const event = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    ...eventProps,
  });
  target.dispatchEvent(event);
};

// ===== SSR COMPATIBILITY MOCKS =====

// Mock missing APIs for SSR testing
if (typeof window === 'undefined') {
  global.window = {} as unknown as Window & typeof globalThis;
  global.document = {} as unknown as Document;
  global.HTMLElement = class MockHTMLElement {} as unknown as typeof HTMLElement;
}

// ===== TIMER SETUP =====

// Enable fake timers by default
beforeEach(() => {
  jest.useFakeTimers();
  // Clear RAF callbacks between tests
  rafCallbacks.clear();
  rafId = 0;
  // Clear event listener tracking
  eventListeners.clear();
});

afterEach(() => {
  // Just use real timers, don't try to run pending
  try {
    jest.useRealTimers();
  } catch (e) {
    // Ignore timer errors in cleanup
  }
  
  // Restore RAF mocks if they've been overridden
  if (!global.requestAnimationFrame || typeof global.requestAnimationFrame !== 'function') {
    global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      const id = ++rafId;
      rafCallbacks.set(id, callback);
      if (process.env.NODE_ENV === 'test') {
        setTimeout(() => callback(performance.now()), 0);
      }
      return id;
    });
  }
  
  if (!global.cancelAnimationFrame || typeof global.cancelAnimationFrame !== 'function') {
    global.cancelAnimationFrame = jest.fn((id: number) => {
      rafCallbacks.delete(id);
    });
  }
  
  // Reset appendChild behavior only if we have the original functions
  if (originalBodyAppendChild && document.body && document.body.appendChild !== originalBodyAppendChild) {
    document.body.appendChild = originalBodyAppendChild;
  }
  if (originalHeadAppendChild && document.head && document.head.appendChild !== originalHeadAppendChild) {
    document.head.appendChild = originalHeadAppendChild;
  }
  
  // Clean up created elements
  createdElements.forEach(element => {
    try {
      element.remove?.();
    } catch (e) {
      // Ignore cleanup errors
    }
  });
  createdElements.clear();
});

// Configure concurrent features
process.env.IS_REACT_ACT_ENVIRONMENT = 'true';

// ===== GLOBAL TEST HELPERS =====

// Export helpers for use in tests
declare global {
  function triggerRAF(timestamp?: number): void;
  function triggerEvent(target: Element | Document, eventType: string, eventProps?: Partial<Event>): void;
  function triggerMouseEvent(target: Element | Document, eventType: string, eventProps?: Partial<MouseEvent>): void;
}
