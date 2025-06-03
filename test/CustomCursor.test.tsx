import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { CursorPosition } from '../src';
import { CustomCursor } from '../src';

// Mock the hooks to control the test environment
jest.mock('../src/hooks', () => ({
  useMousePosition: jest.fn(() => ({
    position: { x: 100, y: 100 },
    setPosition: jest.fn(),
    targetPosition: { x: 100, y: 100 },
    isVisible: true,
  })),
  useSmoothAnimation: jest.fn(),
}));

describe('CustomCursor', () => {
  let mockPortalRoot: HTMLDivElement;

  beforeEach(() => {
    // Create a mock portal root
    mockPortalRoot = document.createElement('div');
    mockPortalRoot.id = 'cursor-container';
    document.body.appendChild(mockPortalRoot);
  });

  afterEach(() => {
    // Clean up
    document.querySelectorAll('[id^="cursor-style"]').forEach((el) => el.remove());
    document.querySelectorAll('#cursor-container').forEach((el) => el.remove());
  });

  it('renders the cursor with default props', async () => {
    render(<CustomCursor>Test cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Test cursor');
      expect(cursor).toBeInTheDocument();
    });
  });

  it('applies custom styles', async () => {
    const customStyle = { backgroundColor: 'red', fontSize: '20px' };
    render(<CustomCursor style={customStyle}>Styled cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Styled cursor');
      expect(cursor).toHaveStyle('background-color: red');
      expect(cursor).toHaveStyle('font-size: 20px');
    });
  });

  it('applies custom className', async () => {
    render(<CustomCursor className="custom-class">Classed cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Classed cursor');
      expect(cursor).toHaveClass('custom-class');
    });
  });

  it('uses the correct ID', async () => {
    render(<CustomCursor id="test-cursor">ID cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = document.getElementById('custom-cursor-test-cursor');
      expect(cursor).toBeInTheDocument();
      expect(cursor).toHaveTextContent('ID cursor');
    });
  });

  it('sets correct zIndex', async () => {
    render(<CustomCursor zIndex={1000}>Z-index cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Z-index cursor');
      expect(cursor).toHaveStyle('z-index: 1000');
    });
  });

  it('calls onMove callback with the correct signature', async () => {
    const onMove = jest.fn<void, [CursorPosition]>();
    render(<CustomCursor onMove={onMove} />);

    await waitFor(() => {
      expect(onMove).toHaveBeenCalledWith({ x: 100, y: 100 });
    });
  });

  it('calls onVisibilityChange callback', async () => {
    const onVisibilityChange = jest.fn<void, [boolean, 'container' | 'disabled']>();
    render(<CustomCursor onVisibilityChange={onVisibilityChange} />);

    await waitFor(() => {
      expect(onVisibilityChange).toHaveBeenCalledWith(true, 'container');
    });
  });

  it('supports throttling', async () => {
    render(<CustomCursor throttleMs={16}>Throttled cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Throttled cursor');
      expect(cursor).toBeInTheDocument();
    });
  });

  it('can be disabled', async () => {
    render(<CustomCursor enabled={false}>Disabled cursor</CustomCursor>);

    // The cursor should not render when disabled
    await waitFor(() => {
      expect(screen.queryByText('Disabled cursor')).not.toBeInTheDocument();
    });
  });

  it('supports offset prop', async () => {
    render(<CustomCursor offset={{ x: 10, y: 20 }}>Offset cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Offset cursor');
      expect(cursor).toBeInTheDocument();
    });
  });

  it('supports smoothness prop', async () => {
    render(<CustomCursor smoothness={2}>Smooth cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Smooth cursor');
      expect(cursor).toBeInTheDocument();
    });
  });

  it('supports showNativeCursor prop', async () => {
    render(<CustomCursor showNativeCursor={true}>Native cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Native cursor');
      expect(cursor).toBeInTheDocument();
    });
  });
});
