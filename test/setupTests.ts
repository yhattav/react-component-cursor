import '@testing-library/jest-dom';

// Enable fake timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// Configure concurrent features
process.env.IS_REACT_ACT_ENVIRONMENT = 'true';
