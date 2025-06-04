# React Component Cursor

A flexible and customizable React component for creating smooth, interactive custom cursors. This library allows you to replace the default cursor with any React component, supporting both global and container-specific cursor behaviors.

## Features

- 🎯 Use any React component as a cursor
- 🔄 Smooth cursor movement with configurable smoothing
- 📦 Container-specific cursors
- 🎨 Fully customizable styling
- ⚡ Lightweight (<10KB)
- 🔧 TypeScript support
- 📱 Zero dependencies (except React)

## Installation

```bash
npm install @yhattav/react-component-cursor
or
yarn add @yhattav/react-component-cursor
```

## Basic Usage

```tsx
import { CustomCursor } from '@yhattav/react-component-cursor';
function App() {
  return (
    <div style={{ cursor: 'none' }}>
      <CustomCursor>
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </CustomCursor>
      {/ Your app content /}
    </div>
  );
}
```

## Props

| Prop                  | Type                             | Default | Description                                              |
| --------------------- | -------------------------------- | ------- | -------------------------------------------------------- |
| `id`                  | `string`                         | `'unnamed-cursor'` | Unique identifier for the cursor instance        |
| `enabled`             | `boolean`                        | `true`  | Whether the cursor is enabled and visible               |
| `children`            | `ReactNode`                      | -       | The component to use as cursor                           |
| `className`           | `string`                         | `''`    | Additional CSS classes                                   |
| `style`               | `CSSProperties`                  | `{}`    | Additional inline styles                                 |
| `offset`              | `{ x: number; y: number }`       | `{ x: 0, y: 0 }` | Offset from cursor position               |
| `zIndex`              | `number`                         | `9999`  | Z-index of the cursor element                            |
| `smoothness`          | `number`                         | `1`     | Movement smoothing (1 = no smoothing, higher = smoother) |
| `containerRef`        | `RefObject<HTMLElement>`         | -       | Reference to container element for bounded cursor        |
| `showNativeCursor`    | `boolean`                        | `false` | Whether to show the native cursor alongside the custom one |
| `throttleMs`          | `number`                         | `0`     | Throttle mouse events in milliseconds (0 = no throttling) |
| `onMove`              | `(position: { x: number, y: number }) => void` | -       | Callback fired on cursor movement                        |
| `onVisibilityChange` | `(isVisible: boolean, reason: CursorVisibilityReason) => void`   | -       | Callback fired when cursor visibility changes. Reason indicates why ('container', 'disabled', etc.) |

## Advanced Usage

### Container-Specific Cursor

```tsx
function ContainerExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        cursor: 'none',
      }}
    >
      <CustomCursor containerRef={containerRef} smoothness={2}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid #ef4444',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </CustomCursor>
      {/ Container content /}
    </div>
  );
}
```

### Interactive Cursor

```tsx
function InteractiveCursor() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{ cursor: 'none' }}>
      <CustomCursor>
        <div
          style={{
            width: isHovered ? '60px' : '20px',
            height: isHovered ? '60px' : '20px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.2s ease',
          }}
        />
      </CustomCursor>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Hover me!
      </button>
    </div>
  );
}
```

### Visibility Change Handler

```tsx
function VisibilityAwareCursor() {
  const handleVisibilityChange = (isVisible: boolean, reason: string) => {
    console.log('Cursor visibility:', isVisible, 'reason:', reason);
    // Reason can be: 'container', 'disabled', or other values in future versions
  };

  return (
    <CustomCursor onVisibilityChange={handleVisibilityChange}>
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </CustomCursor>
  );
}
```

## Development

To start development, you can run both the component and the example app concurrently using:

```bash
npm run dev
```

This project is using [tsup](https://github.com/egoist/tsup) for building the library.

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx). Unfortunately, I had to remove the TSDX configuration because it was causing issues with the build process, being unmaintained and not being compatible with the latest versions key packages.

## License

MIT © [yhattav](https://github.com/yhattav)

## TypeScript Support

The library is written in TypeScript and includes built-in type definitions. No additional @types packages are required.

Example with TypeScript:

```tsx
import {
  CustomCursor,
  CustomCursorProps,
  CursorVisibilityReason,
} from '@yhattav/react-component-cursor';

// All props are properly typed
const MyComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CustomCursor
      containerRef={containerRef}
      smoothness={2}
      onMove={(position: { x: number, y: number }) => console.log(position.x, position.y)}
      onVisibilityChange={(isVisible: boolean, reason: CursorVisibilityReason) =>
        console.log('Visible:', isVisible, 'Reason:', reason)
      }
    >
      {/* Your cursor content */}
    </CustomCursor>
  );
};
```

## Bundle Size

The library is lightweight (<10KB) and is monitored using size-limit. You can check the current bundle size by running:

```bash
npm run size
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Testing

```bash
npm run test
```

We maintain 100% test coverage for all new features. Please ensure your contributions include appropriate tests.

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This helps us automatically generate changelogs and determine semantic version bumps.

Examples:

- feat: add new cursor animation option
- fix: resolve smoothing calculation issue
- docs: update installation instructions
- test: add tests for container bounds

## Issue Templates

Please use our issue templates when creating new issues:

- Bug Report
- Feature Request
- Documentation Update
