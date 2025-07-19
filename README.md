# React Component Cursor

[![npm version](https://img.shields.io/npm/v/@yhattav/react-component-cursor.svg)](https://www.npmjs.com/package/@yhattav/react-component-cursor)
[![npm downloads](https://img.shields.io/npm/dm/@yhattav/react-component-cursor.svg)](https://www.npmjs.com/package/@yhattav/react-component-cursor)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@yhattav/react-component-cursor.svg)](https://bundlephobia.com/package/@yhattav/react-component-cursor)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/yhattav/react-component-cursor/blob/main/LICENSE)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://yhattav.github.io/react-component-cursor/)
[![GitHub stars](https://img.shields.io/github/stars/yhattav/react-component-cursor.svg?style=social&label=Star)](https://github.com/yhattav/react-component-cursor)

A flexible and customizable React component for creating smooth, interactive custom cursors and enhancements.

## Features

- Use any React component
- Smooth cursor movement with configurable smoothing
- Global and Container-specific cursors
- Supports Multiple instances
- Lightweight (<10KB)
- Zero dependencies (except React)

## Installation

```bash
npm install @yhattav/react-component-cursor
or
yarn add @yhattav/react-component-cursor
```

**Note:** If you wish to, You'll need to hide the native cursor with CSS (like `cursor: none` in the example above). See our [styling guide](docs/CURSOR_STYLING.md) for different approaches.

📖 **New to the library?** Check out our comprehensive [Getting Started Guide](GETTING_STARTED.md) for step-by-step tutorials and examples.

## Basic Usage

```tsx
import { CustomCursor } from '@yhattav/react-component-cursor';

function App() {
  return (
    <>
      {/* Hide native cursor globally */}
      <style>{`body { cursor: none !important; }`}</style>
      
      <CustomCursor>
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
          }}
        />
      </CustomCursor>
      {/* Your app content */}
    </>
  );
}
```

## 📋 Complete API Reference

### `<CustomCursor>` Component

The main component for creating custom cursors.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | The React component/element to use as cursor content |
| `enabled` | `boolean` | `true` | Whether the cursor is enabled and visible |
| `smoothness` | `number` | `1` | Movement smoothing factor (1=instant, higher=smoother) |
| `containerRef` | `RefObject<HTMLElement>` | - | Limit cursor to specific container element |
| `offset` | `CursorOffset` | `{ x: 0, y: 0 }` | Pixel offset from mouse position |
| `centered` | `boolean` | `true` | Auto-center cursor content on mouse position |
| `throttleMs` | `number` | `0` | Throttle mouse events in milliseconds |
| `className` | `string` | `''` | Additional CSS classes for cursor container |
| `style` | `CSSProperties` | `{}` | Additional inline styles for cursor container |
| `zIndex` | `number` | `9999` | CSS z-index for cursor container |
| `onMove` | `CursorMoveHandler` | - | Callback fired on cursor movement |
| `onVisibilityChange` | `CursorVisibilityHandler` | - | Callback fired when cursor visibility changes |
| `id` | `string` | auto-generated | Unique identifier for cursor instance |
| `showDevIndicator` | `boolean` | `true` | **[Dev Only]** Show debug ring in development |
| `data-testid` | `string` | - | Test ID for automated testing |
| `role` | `string` | - | ARIA role for accessibility |
| `aria-label` | `string` | - | ARIA label for accessibility |

### 📦 TypeScript Types

The library is written in TypeScript and includes built-in type definitions.

```tsx
import type {
  CustomCursorProps,
  CursorPosition,
  CursorOffset,
  CursorMoveHandler,
  CursorVisibilityHandler,
  CursorVisibilityReason,
} from '@yhattav/react-component-cursor';
```

**📖 [Complete TypeScript Reference →](docs/TYPES.md)**

All prop types, interfaces, and future-ready types with usage examples.

### 🔧 SSR Utilities (Advanced)

For advanced server-side rendering scenarios:

```tsx
import {
  isSSR,
  isBrowser,
  browserOnly,
  safeDocument,
  safeWindow,
} from '@yhattav/react-component-cursor';
```

#### `isSSR(): boolean`
Returns `true` if running in a server-side environment.

#### `isBrowser(): boolean`
Returns `true` if running in a browser environment.

#### `browserOnly<T>(fn: () => T): T | null`
Executes function only in browser environment, returns `null` during SSR.

#### `safeDocument(): Document | null`
Safely accesses `document` object, returns `null` during SSR.

#### `safeWindow(): Window | null`
Safely accesses `window` object, returns `null` during SSR.

### ⚡ Performance Guidelines

#### Optimal Settings for Different Use Cases

**🎮 Gaming/Interactive Apps**
```tsx
<CustomCursor
  smoothness={1}        // Instant response
  throttleMs={0}        // No throttling
  showDevIndicator={false}
>
  <GameCursor />
</CustomCursor>
```

**🎨 Creative/Portfolio Sites**
```tsx
<CustomCursor
  smoothness={3}        // Smooth, elegant movement
  throttleMs={8}        // Light throttling for style
  onMove={trackAnalytics}
>
  <ArtisticCursor />
</CustomCursor>
```

**📱 Mobile-Friendly Apps**
```tsx
<CustomCursor
  smoothness={1}        // Direct positioning
  throttleMs={16}       // Optional: cap at 60fps (minimal impact)
  // Component automatically hides on touch devices
>
  <DesktopOnlyCursor />
</CustomCursor>
```

#### Performance Impact Matrix

| Setting | CPU Impact | Memory Impact | Battery Impact | Visual Quality | Notes |
|---------|------------|---------------|----------------|----------------|-------|
| `smoothness={1}` | ✅ None | ✅ None | ✅ None | ⚡ Instant | Direct positioning, no animation loop |
| `smoothness={2-5}` | 🟡 Low | ✅ None | 🟡 Low | 🎨 Smooth | Light RAF usage for interpolation |
| `smoothness={5+}` | 🟠 Medium | ✅ None | 🟠 Medium | 🎭 Very Smooth | Continuous RAF, slower convergence |
| `throttleMs={0}` | 🟡 Low | ✅ None | 🟡 Low | ⚡ Native Refresh | Runs at display rate (60-144Hz) |
| `throttleMs={8-16}` | 🟡 Low | ✅ None | 🟡 Low | 🎯 Smooth 60fps | Minimal difference from native |
| `throttleMs={16+}` | ✅ Lower | ✅ None | ✅ Lower | 🐌 <60fps | Noticeable responsiveness reduction |

**Reality Check:** The difference between `throttleMs={0}` and `throttleMs={16}` is minimal in practice. Modern displays run at 60-144Hz (6-16ms), so the CPU impact difference is negligible. Mouse events are typically OS-limited to ~125-1000Hz anyway.

### 🎯 Best Practices

#### 1. **Choose Appropriate Smoothness**
```tsx
// ✅ Good: Light smoothing for elegance
<CustomCursor smoothness={2}>

// ❌ Avoid: Excessive smoothing causes lag
<CustomCursor smoothness={20}>
```

#### 2. **Use Throttling for Performance**
```tsx
// ✅ Good: 60fps throttling for complex cursors
<CustomCursor throttleMs={16}>
  <ComplexAnimatedCursor />
</CustomCursor>

// ❌ Avoid: No throttling with heavy cursors
<CustomCursor throttleMs={0}>
  <HeavyVideoCursor />
</CustomCursor>
```

#### 3. **Optimize Callback Functions**
```tsx
// ✅ Good: Memoized callback
const handleMove = useCallback((pos) => {
  // Handle movement
}, []);

<CustomCursor onMove={handleMove} />

// ❌ Avoid: Inline functions (cause re-renders)
<CustomCursor onMove={(pos) => console.log(pos)} />
```

#### 4. **Container Scoping for Performance**
```tsx
// ✅ Good: Scope cursor to specific areas
<InteractiveSection ref={containerRef}>
  <CustomCursor containerRef={containerRef}>
    <SectionCursor />
  </CustomCursor>
</InteractiveSection>

// ❌ Avoid: Global cursor for small interactive areas
```

#### 5. **Accessibility Considerations**
```tsx
// ✅ Good: Accessibility support
<CustomCursor
  role="presentation"
  aria-label="Custom cursor indicator"
  // Automatically respects prefers-reduced-motion
>
  <AccessibleCursor />
</CustomCursor>
```

### 🎮 Examples & Demos

**Live Demo**: [Interactive Examples & Showcase →](https://yhattav.github.io/react-component-cursor/)

**Local Examples** (clone and run):
```bash
# Vite React example with multiple cursor demos
cd example && npm install && npm run dev

# Next.js example with SSR and advanced patterns  
cd example-nextjs && npm install && npm run dev
```

### 📚 Usage Guidelines

#### Framework Compatibility
- ✅ **Next.js** - Full SSR support with zero configuration
- ✅ **Gatsby** - Static generation compatible
- ✅ **Remix** - Server-side rendering works out of the box
- ✅ **Vite/CRA** - Client-side rendering with optimal performance
- ✅ **Astro** - Partial hydration compatible

#### Troubleshooting Common Issues

**Cursor not appearing:**
```tsx
// ✅ Check if on mobile device (automatically hidden)
// ✅ Verify enabled={true} prop
// ✅ Check browser console for validation errors
// ✅ If desired, hide native cursor with CSS for cleaner look
```

**Performance issues:**
```tsx
// ✅ Reduce smoothness for better performance
<CustomCursor smoothness={1}>  // Direct positioning

// ✅ Add throttling for complex cursors
<CustomCursor throttleMs={16}>  // 60fps limit
```

**Performance issues:**
```tsx
// ✅ Reduce smoothness for better performance
<CustomCursor smoothness={1}>  // Direct positioning

// ✅ Add throttling for complex cursors
<CustomCursor throttleMs={16}>  // 60fps limit

// ✅ Use container scoping for targeted areas
<CustomCursor containerRef={sectionRef}>
```

**Hydration mismatches:**
```tsx
// ✅ SSR is handled automatically - no action needed
// ✅ Avoid conditional rendering - let component handle SSR
// ✅ Don't wrap in dynamic imports unless specific needs
```

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
        cursor: 'none', // Hide native cursor in this container
      }}
    >
      <CustomCursor containerRef={containerRef} smoothness={2}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid #ef4444',
            borderRadius: '50%',
          }}
        />
      </CustomCursor>
      {/* Container content */}
    </div>
  );
}
```

### Interactive Cursor

```tsx
function InteractiveCursor() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <style>{`body { cursor: none; }`}</style>
      <div>
        <CustomCursor>
          <div
            style={{
              width: isHovered ? '60px' : '20px',
              height: isHovered ? '60px' : '20px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
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
    </>
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

## Server-Side Rendering (SSR) Support

This library works seamlessly with all SSR frameworks including Next.js, Gatsby, Remix, and more.

### ✅ Zero Configuration

The component automatically handles SSR by returning `null` during server-side rendering, preventing hydration mismatches:

```tsx
// Works out of the box in Next.js, Gatsby, etc.
import { CustomCursor } from '@yhattav/react-component-cursor';

export default function App() {
  return (
    <>
      <YourPageContent />
      <CustomCursor>
        <div className="cursor">✨</div>
      </CustomCursor>
    </>
  );
}
```

### Key SSR Features

- **Graceful Degradation**: Returns `null` during SSR, no browser APIs called
- **No Hydration Issues**: Prevents client/server mismatches
- **Minimal Bundle Impact**: ~250 bytes for SSR utilities, often offset by tree-shaking
- **Framework Agnostic**: Works with any React SSR framework

### Framework Examples

**Next.js** (recommended approach):
```tsx
import { CustomCursor } from '@yhattav/react-component-cursor';

// Direct usage - SSR handled automatically
<CustomCursor>
  <div className="cursor">🎯</div>
</CustomCursor>
```

**Gatsby**:
```tsx
// gatsby-browser.js
export const wrapRootElement = ({ element }) => (
  <>
    {element}
    <CustomCursor>
      <div className="cursor">🌟</div>
    </CustomCursor>
  </>
);
```

For detailed SSR integration guides, see our [SSR Documentation](docs/SSR.md).

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

## Development vs Production Builds

This library uses **conditional exports** to provide optimized builds for different environments:

### 🔧 Development Build
- **Enhanced Developer Experience**: Includes helpful debugging features
- **Visual Debug Indicator**: Red ring around custom cursors for easy identification
- **Prop Validation**: Runtime validation with helpful error messages
- **Development Warnings**: Console warnings for common issues
- **Bundle Size**: ~3KB (includes debug features)

### ⚡ Production Build  
- **Optimized Performance**: All debug code eliminated via tree-shaking
- **Minimal Bundle**: Debug features completely removed
- **Best User Experience**: No visual indicators or validation overhead
- **Bundle Size**: ~2.2KB (production optimized)

### How It Works

The library automatically selects the appropriate build based on your environment:

```tsx
// This single import automatically chooses the right build
import { CustomCursor } from '@yhattav/react-component-cursor';

// In development (NODE_ENV=development):
// - Gets debug features, validation, red ring indicator
// - Larger bundle with helpful developer tools

// In production (NODE_ENV=production):  
// - Gets optimized build with debug code eliminated
// - Smaller bundle focused on performance
```

### Manual Build Selection

You can also manually select builds if needed (advanced usage):

```tsx
// Force development build (includes debug features)
import { CustomCursor } from '@yhattav/react-component-cursor/dist/index.dev.mjs';

// Force production build (optimized, no debug features)
import { CustomCursor } from '@yhattav/react-component-cursor/dist/index.mjs';
```

### Debug Features in Development

When running in development mode, you'll see:

1. **Red Ring Indicator**: A red border around custom cursors for visual debugging
   - **Toggle off**: Use `showDevIndicator={false}` to hide the debug ring when needed
   - **Production**: Automatically removed in production builds (zero overhead)
2. **Console Validation**: Helpful error messages for invalid props:
   ```
   CustomCursor: smoothness must be a non-negative number, got: -1
   CustomCursor: id must be a non-empty string, got: ""
   ```
3. **Development Warnings**: Guidance for common setup issues

### Controlling Debug Features

```tsx
// Hide debug ring for clean screenshots or design work
<CustomCursor showDevIndicator={false}>
  <MyCustomCursor />
</CustomCursor>

// Show debug ring (default behavior in development)
<CustomCursor showDevIndicator={true}>
  <MyCustomCursor />
</CustomCursor>

// In production builds, showDevIndicator has no effect - debug features are completely removed
```

### Build Configuration

Popular bundlers automatically handle conditional exports:

**Vite** (automatically configured):
```js
// vite.config.js - no special configuration needed
export default defineConfig({
  // Vite automatically uses conditional exports
});
```

**Webpack** (v5+):
```js
// webpack.config.js - automatic in most cases
module.exports = {
  // Webpack 5+ supports conditional exports out of the box
  mode: process.env.NODE_ENV, // 'development' or 'production'
};
```

**Next.js** (v12+):
```js
// next.config.js - automatic support
module.exports = {
  // Next.js automatically handles conditional exports
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
