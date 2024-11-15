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
    const position = { x: 0, y: 0 };
    const targetPosition = { x: 100, y: 100 };

    renderHook(() =>
      useSmoothAnimation(position, targetPosition, 0.5, setPosition)
    );

    jest.advanceTimersByTime(16); // One frame
    expect(setPosition).toHaveBeenCalled();
  });

  // Add more tests for the hook...
});
