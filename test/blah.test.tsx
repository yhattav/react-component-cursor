import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { CustomCursor } from '../src';

describe('CustomCursor', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    render(<CustomCursor />);
    // Add assertions as needed
  });

  // Add more tests as needed
});
