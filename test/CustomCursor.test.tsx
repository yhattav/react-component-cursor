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

  it('supports legacy offsetX/offsetY props with deprecation warning', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(<CustomCursor offsetX={10} offsetY={20}>Legacy offset cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Legacy offset cursor');
      expect(cursor).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('offsetX" is deprecated')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('offsetY" is deprecated')
      );
    });

    consoleSpy.mockRestore();
  });

  it('supports legacy smoothFactor prop with deprecation warning', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(<CustomCursor smoothFactor={2}>Legacy smooth cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Legacy smooth cursor');
      expect(cursor).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('smoothFactor" is deprecated')
      );
    });

    consoleSpy.mockRestore();
  });

  it('supports legacy hideNativeCursor prop with deprecation warning', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    render(<CustomCursor hideNativeCursor={true}>Legacy hide cursor</CustomCursor>);

    await waitFor(() => {
      const cursor = screen.getByText('Legacy hide cursor');
      expect(cursor).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('hideNativeCursor" is deprecated')
      );
    });

    consoleSpy.mockRestore();
  });
});
