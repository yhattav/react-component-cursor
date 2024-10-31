import '@testing-library/jest-dom';

// Mock DOM APIs
const mockClientRect: DOMRect = {
  top: 0,
  left: 0,
  right: 1024,
  bottom: 768,
  width: 1024,
  height: 768,
  x: 0,
  y: 0,
  toJSON: () =>
    JSON.stringify({
      top: 0,
      left: 0,
      right: 1024,
      bottom: 768,
      width: 1024,
      height: 768,
      x: 0,
      y: 0,
    }),
} as DOMRect;

class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(global, 'ResizeObserver', {
  value: MockResizeObserver,
});

Object.defineProperty(global, 'requestAnimationFrame', {
  value: (callback: FrameRequestCallback) => setTimeout(callback, 0),
});

Object.defineProperty(global, 'cancelAnimationFrame', {
  value: jest.fn(),
});

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = () => mockClientRect;

// Mock window methods
Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true,
});

// Set window dimensions
Object.defineProperty(window, 'innerWidth', {
  value: 1024,
  writable: true,
});

Object.defineProperty(window, 'innerHeight', {
  value: 768,
  writable: true,
});

// Mock document methods
Object.defineProperty(document, 'addEventListener', {
  value: jest.fn(),
  writable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: jest.fn(),
  writable: true,
});
