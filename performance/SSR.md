# Server-Side Rendering (SSR) Guide

This guide covers how to use `@yhattav/react-component-cursor` in Server-Side Rendering environments like Next.js, Gatsby, and other React SSR frameworks.

## Overview

The CustomCursor component is designed to work seamlessly with SSR by:
- **Graceful Degradation**: Returns `null` during server-side rendering
- **No Hydration Issues**: Prevents mismatches between server and client rendering
- **Performance Optimized**: Skips browser-only operations during SSR
- **Framework Agnostic**: Works with any React SSR framework

## How It Works

During server-side rendering, the CustomCursor component:
1. Detects the SSR environment using `typeof window === 'undefined'`
2. Returns `null` immediately, preventing any browser API calls
3. Skips all mouse tracking and animation setup
4. Avoids creating DOM portals or style sheets

When hydrating on the client:
1. The component detects the browser environment
2. Initializes mouse tracking and cursor rendering
3. Creates the necessary DOM elements and event listeners

## Framework Integration

### Next.js

#### Method 1: Dynamic Import with SSR Disabled

```tsx
// components/DynamicCursor.tsx
import dynamic from 'next/dynamic';

const CustomCursor = dynamic(
  () => import('@yhattav/react-component-cursor').then(mod => ({ default: mod.CustomCursor })),
  { 
    ssr: false,
    loading: () => null
  }
);

export default CustomCursor;
```

```tsx
// pages/_app.tsx or any page
import DynamicCursor from '../components/DynamicCursor';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <DynamicCursor>
        <div className="cursor-content">✨</div>
      </DynamicCursor>
    </>
  );
}
```

#### Method 2: Conditional Rendering

```tsx
// components/ClientOnlyCursor.tsx
import { useEffect, useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export default function ClientOnlyCursor({ children, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <CustomCursor {...props}>{children}</CustomCursor>;
}
```

#### Method 3: Direct Usage (Recommended)

The component handles SSR automatically, so you can use it directly:

```tsx
// pages/_app.tsx
import { CustomCursor } from '@yhattav/react-component-cursor';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <CustomCursor>
        <div className="cursor-content">🎯</div>
      </CustomCursor>
    </>
  );
}
```

### Gatsby

#### Method 1: Using gatsby-plugin-react-helmet

```tsx
// components/CursorProvider.tsx
import React, { useEffect, useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

const CursorProvider = ({ children, ...cursorProps }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {children}
      {isClient && (
        <CustomCursor {...cursorProps}>
          <div className="custom-cursor">→</div>
        </CustomCursor>
      )}
    </>
  );
};

export default CursorProvider;
```

#### Method 2: Direct Usage

```tsx
// gatsby-browser.js
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export const wrapRootElement = ({ element }) => (
  <>
    {element}
    <CustomCursor>
      <div className="cursor">🌟</div>
    </CustomCursor>
  </>
);
```

### Remix

```tsx
// app/root.tsx
import { CustomCursor } from '@yhattav/react-component-cursor';

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <CustomCursor>
          <div className="remix-cursor">⚡</div>
        </CustomCursor>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

### Vite SSR

```tsx
// src/main-client.tsx
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { CustomCursor } from '@yhattav/react-component-cursor';
import App from './App';

hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App />
    <CustomCursor>
      <div className="vite-cursor">🚀</div>
    </CustomCursor>
  </React.StrictMode>
);
```

## Best Practices

### 1. Performance Optimization

```tsx
// ✅ Good: Use React.memo for callback props
const MemoizedCursor = React.memo(() => {
  const handleMove = useCallback((position) => {
    // Handle move
  }, []);

  return (
    <CustomCursor onMove={handleMove}>
      <div>Cursor</div>
    </CustomCursor>
  );
});

// ❌ Avoid: Inline callbacks (cause re-renders)
const BadCursor = () => (
  <CustomCursor onMove={(pos) => console.log(pos)}>
    <div>Cursor</div>
  </CustomCursor>
);
```

### 2. Conditional Features

```tsx
// Enable features only in production or specific environments
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

<CustomCursor
  showDevIndicator={isDevelopment}
  throttleMs={isProduction ? 16 : 0} // Optimize for production
>
  <div>Environment-aware cursor</div>
</CustomCursor>
```

### 3. Error Boundaries

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function CursorErrorFallback({ error }) {
  return null; // Fail silently for cursor errors
}

<ErrorBoundary FallbackComponent={CursorErrorFallback}>
  <CustomCursor>
    <div>Protected cursor</div>
  </CustomCursor>
</ErrorBoundary>
```

## TypeScript Support

The library provides full TypeScript support for SSR scenarios:

```tsx
import type { CustomCursorProps } from '@yhattav/react-component-cursor';

interface SSRCursorWrapperProps extends Omit<CustomCursorProps, 'children'> {
  children: React.ReactNode;
  enableSSR?: boolean;
}

const SSRCursorWrapper: React.FC<SSRCursorWrapperProps> = ({
  children,
  enableSSR = true,
  ...cursorProps
}) => {
  // Type-safe SSR handling
  if (enableSSR && typeof window === 'undefined') {
    return null;
  }

  return (
    <CustomCursor {...cursorProps}>
      {children}
    </CustomCursor>
  );
};
```

## Troubleshooting

### Common Issues

#### 1. Hydration Mismatch Warnings

**Problem**: React warns about hydration mismatches
**Solution**: The component automatically handles this by returning `null` during SSR

#### 2. Component Not Appearing

**Problem**: Cursor doesn't appear after page load
**Solution**: Ensure the component is not being unmounted by conditional rendering

```tsx
// ❌ Problematic
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null; // This unmounts the cursor

// ✅ Better - let the component handle SSR internally
return <CustomCursor>...</CustomCursor>;
```

#### 3. Performance Issues on Initial Load

**Problem**: Choppy animation when component first mounts
**Solution**: Use a small delay or transition

```tsx
<CustomCursor
  smoothness={2} // Smooth initial movement
  style={{ 
    transition: 'opacity 0.3s ease-in-out' // Smooth appearance
  }}
>
  <div>Smooth cursor</div>
</CustomCursor>
```

### Debug Mode

Enable debug mode to troubleshoot SSR issues:

```tsx
<CustomCursor
  showDevIndicator={process.env.NODE_ENV === 'development'}
>
  <div>Debug cursor</div>
</CustomCursor>
```

## Testing SSR

### Unit Tests

```javascript
// __tests__/ssr.test.js
/**
 * @jest-environment node
 */
import { renderToString } from 'react-dom/server';
import { CustomCursor } from '@yhattav/react-component-cursor';

test('renders nothing during SSR', () => {
  const html = renderToString(
    <CustomCursor>
      <div>Test cursor</div>
    </CustomCursor>
  );
  
  expect(html).toBe('');
});
```

### Integration Tests

```javascript
// Test with your SSR framework
import { render } from '@testing-library/react';

test('renders correctly after hydration', async () => {
  const { container } = render(
    <CustomCursor>
      <div data-testid="cursor">Test</div>
    </CustomCursor>
  );

  // Wait for client-side hydration
  await waitFor(() => {
    expect(container.querySelector('[data-testid="cursor"]')).toBeInTheDocument();
  });
});
```

## Migration Guide

### From Version 1.x to 2.x+

If upgrading from an older version:

1. **Remove manual SSR checks** - The component now handles this automatically
2. **Update dynamic imports** - You can now use the component directly
3. **Remove useEffect mounting patterns** - No longer needed

```tsx
// ❌ Old way (v1.x)
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;

// ✅ New way (v2.x+)
// Just use the component directly - SSR is handled automatically
```

## Performance Metrics

Expected performance characteristics:

- **SSR Bundle Impact**: ~250 bytes for utilities, often offset by tree-shaking of unused cursor logic
- **Client Hydration**: <50ms to initialize
- **Runtime Overhead**: <1ms per animation frame
- **Memory Usage**: <1MB for tracking state

The SSR-safe implementation ensures minimal impact on server-side bundle size while maintaining full functionality on the client. 