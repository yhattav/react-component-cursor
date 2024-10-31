import React from 'react';
import { act } from 'react-dom/test-utils';
import * as ReactDOM from 'react-dom';
import { CustomCursor } from '../src';

describe('CustomCursor', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders without crashing', async () => {
    await act(async () => {
      ReactDOM.render(<CustomCursor />, container);
    });

    // Wait for any effects to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await act(async () => {
      ReactDOM.unmountComponentAtNode(container);
    });
  });
});
