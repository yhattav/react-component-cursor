# Getting Started Guide

> **Complete step-by-step guide to using react-component-cursor in your project**

This guide will walk you through everything you need to know to get up and running with custom cursors in your React application.

## 🚀 Quick Start (5 minutes)

### Step 1: Installation

```bash
# npm
npm install @yhattav/react-component-cursor

# yarn
yarn add @yhattav/react-component-cursor

# pnpm
pnpm add @yhattav/react-component-cursor
```

### Step 2: Basic Setup

```tsx
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

function App() {
  return (
    <div style={{ cursor: 'none' }}> {/* Hide default cursor */}
      <CustomCursor>
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)', // Center the cursor
          }}
        />
      </CustomCursor>
      
      {/* Your app content */}
      <h1>Welcome to my app!</h1>
      <p>Move your mouse around to see the custom cursor.</p>
    </div>
  );
}

export default App;
```

### Step 3: That's it! 🎉

Your custom cursor is now working. The library automatically handles:
- ✅ Server-side rendering (SSR)
- ✅ Mobile device detection (hides on touch devices)
- ✅ Performance optimization
- ✅ Browser compatibility

## 📚 Common Patterns & Recipes

### Pattern 1: Smooth Cursor with Hover Effects

```tsx
import React, { useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

function SmoothCursor() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ cursor: 'none' }}>
      <CustomCursor smoothness={3}>
        <div
          style={{
            width: isHovered ? '40px' : '20px',
            height: isHovered ? '40px' : '20px',
            backgroundColor: isHovered ? '#ef4444' : '#3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.2s ease',
          }}
        />
      </CustomCursor>
      
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ padding: '1rem 2rem', margin: '2rem' }}
      >
        Hover me!
      </button>
    </div>
  );
}
```

### Pattern 2: Container-Scoped Cursor

```tsx
import React, { useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

function ContainerCursor() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <p>Normal cursor area</p>
      
      <div
        ref={containerRef}
        style={{
          width: '400px',
          height: '300px',
          border: '2px dashed #ccc',
          cursor: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CustomCursor 
          containerRef={containerRef}
          smoothness={2}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              border: '2px solid #f59e0b',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </CustomCursor>
        
        <p>Custom cursor only appears in this area!</p>
      </div>
      
      <p>Back to normal cursor</p>
    </div>
  );
}
```

### Pattern 3: Cursor with Callbacks

```tsx
import React, { useState, useCallback } from 'react';
import { CustomCursor, CursorPosition } from '@yhattav/react-component-cursor';

function TrackingCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  const handleMove = useCallback((pos: CursorPosition) => {
    setPosition(pos);
  }, []);

  const handleVisibilityChange = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  return (
    <div style={{ cursor: 'none', padding: '2rem' }}>
      <CustomCursor
        onMove={handleMove}
        onVisibilityChange={handleVisibilityChange}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: isVisible ? 1 : 0.5,
          }}
        />
      </CustomCursor>
      
      <div style={{ marginTop: '1rem' }}>
        <p>Cursor Position: ({Math.round(position.x)}, {Math.round(position.y)})</p>
        <p>Cursor Visible: {isVisible ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
```

## 🔧 Framework-Specific Guides

### Next.js Integration

#### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { CustomCursor } from '@yhattav/react-component-cursor';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ cursor: 'none' }}>
        <CustomCursor>
          <div className="custom-cursor" />
        </CustomCursor>
        {children}
      </body>
    </html>
  );
}
```

```css
/* globals.css */
.custom-cursor {
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
```

#### Pages Router (Next.js 12 and below)

```tsx
// pages/_app.tsx
import { CustomCursor } from '@yhattav/react-component-cursor';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div style={{ cursor: 'none' }}>
      <CustomCursor>
        <div className="custom-cursor" />
      </CustomCursor>
      <Component {...pageProps} />
    </div>
  );
}
```

### Gatsby Integration

```tsx
// gatsby-browser.js
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export const wrapRootElement = ({ element }) => (
  <div style={{ cursor: 'none' }}>
    <CustomCursor>
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: '#663399', // Gatsby purple
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </CustomCursor>
    {element}
  </div>
);
```

### Vite/Create React App

```tsx
// src/App.tsx
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import './App.css';

function App() {
  return (
    <div className="App" style={{ cursor: 'none' }}>
      <CustomCursor>
        <div className="cursor" />
      </CustomCursor>
      {/* Your app content */}
    </div>
  );
}
```

```css
/* App.css */
.cursor {
  width: 20px;
  height: 20px;
  background: #646cff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
```

### Remix Integration

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
      <body style={{ cursor: 'none' }}>
        <CustomCursor>
          <div
            style={{
              width: '20px',
              height: '20px',
              background: 'linear-gradient(45deg, #3992ff, #ff3d71)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </CustomCursor>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

## 🎨 Creative Examples

### Example 1: Gaming Cursor

```tsx
import React, { useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

function GamingCursor() {
  const [isClicking, setIsClicking] = useState(false);

  return (
    <div 
      style={{ cursor: 'none' }}
      onMouseDown={() => setIsClicking(true)}
      onMouseUp={() => setIsClicking(false)}
    >
      <CustomCursor smoothness={1}> {/* Instant response for gaming */}
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2px solid #00ff00',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: isClicking ? '#00ff0033' : 'transparent',
            transition: 'background-color 0.1s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2px',
              height: '2px',
              backgroundColor: '#00ff00',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </CustomCursor>
      
      <div style={{ padding: '2rem' }}>
        <h2>Gaming Interface</h2>
        <p>Click and drag to see the crosshair in action!</p>
      </div>
    </div>
  );
}
```

### Example 2: E-commerce Product Showcase

```tsx
import React, { useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

function ProductShowcase() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const products = [
    { id: '1', name: 'Cool Sneakers', price: '$120' },
    { id: '2', name: 'Stylish Watch', price: '$250' },
    { id: '3', name: 'Designer Bag', price: '$180' },
  ];

  return (
    <div style={{ cursor: 'none', padding: '2rem' }}>
      <CustomCursor smoothness={2}>
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '20px',
            fontSize: '12px',
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px',
            opacity: hoveredProduct ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {hoveredProduct && (
            <>View {products.find(p => p.id === hoveredProduct)?.name}</>
          )}
        </div>
      </CustomCursor>
      
      <h2>Product Showcase</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              textAlign: 'center',
            }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div style={{ height: '100px', backgroundColor: '#f5f5f5', marginBottom: '1rem' }} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Advanced Configuration

### Performance Optimization

```tsx
import React, { useCallback, useMemo } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

function OptimizedCursor() {
  // Memoize callback functions to prevent re-renders
  const handleMove = useCallback((position) => {
    // Only log occasionally to avoid spam
    if (position.x % 50 === 0) {
      console.log('Cursor at:', position);
    }
  }, []);

  // Memoize complex cursor content
  const cursorContent = useMemo(() => (
    <div
      style={{
        width: '20px',
        height: '20px',
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  ), []);

  return (
    <div style={{ cursor: 'none' }}>
      <CustomCursor
        smoothness={2}
        throttleMs={16} // 60fps cap for complex content
        onMove={handleMove}
        showDevIndicator={false} // Disable debug ring in production
      >
        {cursorContent}
      </CustomCursor>
      
      <div style={{ padding: '2rem' }}>
        <h2>Performance Optimized Cursor</h2>
        <p>This cursor is optimized for complex applications.</p>
      </div>
    </div>
  );
}
```

### TypeScript Configuration

```tsx
import React, { useRef } from 'react';
import {
  CustomCursor,
  CustomCursorProps,
  CursorPosition,
  CursorVisibilityReason,
} from '@yhattav/react-component-cursor';

// Define your cursor component with proper typing
interface MyCursorProps {
  size?: number;
  color?: string;
  glowing?: boolean;
}

const MyCursor: React.FC<MyCursorProps> = ({
  size = 20,
  color = '#3b82f6',
  glowing = false,
}) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: glowing ? `0 0 20px ${color}` : 'none',
    }}
  />
);

function TypedCursorExample() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (position: CursorPosition): void => {
    console.log(`Cursor moved to: ${position.x}, ${position.y}`);
  };

  const handleVisibilityChange = (
    isVisible: boolean,
    reason: CursorVisibilityReason
  ): void => {
    console.log(`Cursor visibility: ${isVisible}, reason: ${reason}`);
  };

  const cursorProps: CustomCursorProps = {
    containerRef,
    smoothness: 2,
    onMove: handleMove,
    onVisibilityChange: handleVisibilityChange,
    'data-testid': 'my-custom-cursor',
  };

  return (
    <div>
      <div ref={containerRef} style={{ cursor: 'none', padding: '2rem' }}>
        <CustomCursor {...cursorProps}>
          <MyCursor size={24} color="#10b981" glowing />
        </CustomCursor>
        
        <h2>TypeScript Example</h2>
        <p>Fully typed cursor implementation with custom components.</p>
      </div>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Cursor not appearing

**Symptoms**: Custom cursor doesn't show up at all

**Solutions**:
```tsx
// ✅ Make sure to hide the default cursor
<div style={{ cursor: 'none' }}>
  <CustomCursor>...</CustomCursor>
</div>

// ✅ Check if you're on a mobile device (cursor auto-hides on touch devices)
// ✅ Verify the enabled prop is not set to false
<CustomCursor enabled={true}>...</CustomCursor>

// ✅ Check browser console for validation errors
// The library provides helpful error messages in development
```

#### Issue: Cursor appears but doesn't move

**Symptoms**: Cursor is visible but stays in one place

**Solutions**:
```tsx
// ✅ Ensure container has proper dimensions for container-scoped cursors
const containerRef = useRef<HTMLDivElement>(null);

<div ref={containerRef} style={{ width: '100%', height: '400px' }}>
  <CustomCursor containerRef={containerRef}>...</CustomCursor>
</div>

// ✅ Check if mouse events are being blocked
// Ensure no elements have pointer-events: none inappropriately
```

#### Issue: Poor performance or choppy animation

**Symptoms**: Cursor movement is laggy or causes frame drops

**Solutions**:
```tsx
// ✅ Reduce smoothness for better performance
<CustomCursor smoothness={1}>  // Direct positioning

// ✅ Add throttling for complex cursors
<CustomCursor throttleMs={16}>  // 60fps limit

// ✅ Optimize cursor content (avoid heavy DOM/CSS)
<CustomCursor>
  <div style={{
    width: '20px',
    height: '20px',
    backgroundColor: '#3b82f6', // Simple solid color
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  }} />
</CustomCursor>

// ✅ Memoize callback functions
const handleMove = useCallback((pos) => {
  // Handle movement
}, []);
```

#### Issue: Hydration mismatch in SSR

**Symptoms**: React warns about server/client mismatch

**Solutions**:
```tsx
// ✅ The library handles SSR automatically - no action needed
// ✅ Avoid conditional rendering around CustomCursor
// ✅ Don't wrap in dynamic imports unless absolutely necessary

// ❌ Don't do this:
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;

// ✅ Just use the component directly:
<CustomCursor>...</CustomCursor>
```

### Debug Mode

Enable debug mode to troubleshoot issues:

```tsx
<CustomCursor
  showDevIndicator={true} // Shows red ring around cursor in development
  onMove={(pos) => console.log('Position:', pos)}
  onVisibilityChange={(visible, reason) => 
    console.log('Visibility:', visible, 'Reason:', reason)
  }
>
  <div>Debug cursor</div>
</CustomCursor>
```

## 🚀 Next Steps

### Explore Advanced Features
- Read the complete [API Reference](README.md#-complete-api-reference)
- Check out [SSR Documentation](docs/SSR.md) for server-side rendering
- Review [Performance Guidelines](README.md#-performance-guidelines)

### Get Involved
- ⭐ [Star the repository](https://github.com/yhattav/react-component-cursor)
- 🐛 [Report issues](https://github.com/yhattav/react-component-cursor/issues)
- 💡 [Request features](https://github.com/yhattav/react-component-cursor/discussions)
- 🤝 [Contribute](https://github.com/yhattav/react-component-cursor/blob/main/CONTRIBUTING.md)

### Community
- 💬 [Join Discussions](https://github.com/yhattav/react-component-cursor/discussions)
- 📖 [Read the Blog](https://yhattav.dev/blog)
- 🐦 [Follow Updates](https://twitter.com/yhattav)

---

**Happy Coding! 🎉**

*Need help? Open an issue or start a discussion - we're here to help!* 