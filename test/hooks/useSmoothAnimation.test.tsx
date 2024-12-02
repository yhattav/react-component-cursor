import { renderHook } from '@testing-library/react';
import { useSmoothAnimation } from '../../src/hooks';

describe('useSmoothAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('smoothly animates position changes', () => {
    const setPosition = jest.fn();
    const targetPosition = { x: 100, y: 100 };

    renderHook(() => useSmoothAnimation(targetPosition, 0.5, setPosition));

    jest.advanceTimersByTime(16); // One frame
    expect(setPosition).toHaveBeenCalled();
  });

  // Add more tests for the hook...
});
