# Cursor Styling Guide

`@yhattav/react-component-cursor` focuses on cursor rendering and positioning. If you want to hide the native cursor for a cleaner look, you can do so with CSS. This guide covers all the common approaches and patterns for cursor styling.

## Quick Start Solutions

### Global Cursor Hiding (Optional)

**Inline Style (Simplest)**
```tsx
function App() {
  return (
    <>
      <style>{`body { cursor: none !important; }`}</style>
      <CustomCursor>
        <div className="w-5 h-5 bg-blue-500 rounded-full" />
      </CustomCursor>
      {/* Your content */}
    </>
  );
}
```

**CSS File Approach**
```css
/* styles.css */
body {
  cursor: none !important;
}

/* Or target specific areas */
.cursor-hidden {
  cursor: none;
}

.cursor-restored {
  cursor: auto;
}
```

**Styled Components**
```tsx
import styled from 'styled-components';

const AppContainer = styled.div`
  cursor: none;
  min-height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <CustomCursor>
        <MyCursor />
      </CustomCursor>
    </AppContainer>
  );
}
```

## Container-Specific Cursor Control

### React Inline Styles

```tsx
function InteractiveSection() {
  const [hideCursor, setHideCursor] = useState(false);
  
  return (
    <div 
      style={{ cursor: hideCursor ? 'none' : 'auto' }}
      onMouseEnter={() => setHideCursor(true)}
      onMouseLeave={() => setHideCursor(false)}
    >
      {hideCursor && (
        <CustomCursor>
          <div className="custom-cursor" />
        </CustomCursor>
      )}
      {/* Interactive content */}
    </div>
  );
}
```

### CSS Classes with State

```tsx
function DynamicCursor() {
  const [mode, setMode] = useState<'native' | 'custom'>('native');
  
  return (
    <div className={mode === 'custom' ? 'cursor-none' : 'cursor-auto'}>
      {mode === 'custom' && (
        <CustomCursor>
          <CustomCursorComponent />
        </CustomCursor>
      )}
      <button onClick={() => setMode(prev => prev === 'native' ? 'custom' : 'native')}>
        Toggle Cursor
      </button>
    </div>
  );
}
```

## Advanced: Multiple Cursor Zones

```tsx
function MultiZoneApp() {
  const zone1Ref = useRef<HTMLDivElement>(null);
  const zone3Ref = useRef<HTMLDivElement>(null);
  
  return (
    <div className="app">
      {/* Zone 1: Custom cursor */}
      <div 
        ref={zone1Ref}
        className="zone-1" 
        style={{ cursor: 'none' }}
      >
        <CustomCursor containerRef={zone1Ref}>
          <div className="cursor-design-1" />
        </CustomCursor>
        <h2>Custom Cursor Zone</h2>
      </div>
      
      {/* Zone 2: Native cursor */}
      <div className="zone-2" style={{ cursor: 'auto' }}>
        <h2>Native Cursor Zone</h2>
      </div>
      
      {/* Zone 3: Different custom cursor */}
      <div 
        ref={zone3Ref}
        className="zone-3" 
        style={{ cursor: 'none' }}
      >
        <CustomCursor containerRef={zone3Ref}>
          <div className="cursor-design-2" />
        </CustomCursor>
        <h2>Different Custom Cursor</h2>
      </div>
    </div>
  );
}
```

## Framework-Specific Examples

### Next.js with Global CSS

```css
/* styles/globals.css */
body {
  cursor: none;
}

@media (hover: none) {
  /* Restore cursor on touch devices */
  body {
    cursor: auto;
  }
}
```

```tsx
// pages/_app.tsx
import '../styles/globals.css';
import { CustomCursor } from '@yhattav/react-component-cursor';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <CustomCursor>
        <div className="w-6 h-6 bg-blue-500 rounded-full" />
      </CustomCursor>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

### Tailwind CSS

```tsx
function TailwindCursor() {
  return (
    <div className="cursor-none min-h-screen">
      <CustomCursor>
        <div className="w-6 h-6 bg-primary rounded-full" />
      </CustomCursor>
      
      {/* Restore cursor for specific elements */}
      <button className="cursor-pointer">
        This button shows native cursor
      </button>
    </div>
  );
}
```

**Custom Tailwind Classes:**
```css
/* Add to your CSS file */
@layer utilities {
  .cursor-custom-none {
    cursor: none !important;
  }
  
  .cursor-custom-auto {
    cursor: auto !important;
  }
}
```

### CSS-in-JS (Emotion/Styled-Components)

```tsx
import { css } from '@emotion/react';

const appStyles = css`
  cursor: none;
  
  .restore-cursor {
    cursor: auto;
  }
  
  .custom-cursor-zone {
    cursor: none;
  }
`;

function EmotionApp() {
  return (
    <div css={appStyles}>
      <CustomCursor>
        <MyCursor />
      </CustomCursor>
      
      <button className="restore-cursor">
        Native cursor button
      </button>
    </div>
  );
}
```

### Gatsby

```tsx
// gatsby-browser.js
import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import './src/styles/global.css';

export const wrapRootElement = ({ element }) => (
  <>
    <style>{`body { cursor: none; }`}</style>
    <CustomCursor>
      <div className="cursor-component" />
    </CustomCursor>
    {element}
  </>
);
```

## Mobile & Accessibility Considerations

The library automatically handles mobile devices (no cursor shown), but you should also consider CSS:

```css
/* Hide cursor only on devices that support hover */
@media (hover: hover) {
  .custom-cursor-area {
    cursor: none;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .custom-cursor-area {
    cursor: auto; /* Optionally restore native cursor */
  }
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  .custom-cursor-area {
    cursor: auto;
  }
}
```

## Troubleshooting Common Issues

### Want to Hide Native Cursor?

**Goal**: Show only the custom cursor for a cleaner look.

```tsx
// Both cursors visible (default)
<div>
  <CustomCursor>...</CustomCursor>
</div>

// Only custom cursor visible
<div style={{ cursor: 'none' }}>
  <CustomCursor>...</CustomCursor>
</div>
```

### CSS Specificity Issues

**Issue**: Other CSS rules override your cursor hiding.

```css
/* ❌ Problem: Low specificity */
.container {
  cursor: none;
}

/* ✅ Solution: Use !important or higher specificity */
body .container {
  cursor: none !important;
}
```

### Container Boundaries

**Issue**: Cursor styling inconsistent across nested elements.

```tsx
// ❌ Problem: Nested elements inherit different cursor styles
<div style={{ cursor: 'none' }}>
  <CustomCursor containerRef={containerRef}>...</CustomCursor>
  <div> {/* This might inherit different cursor */}
    <button>Click me</button> {/* This too */}
  </div>
</div>

// ✅ Solution: Explicit styling for interactive elements
<div style={{ cursor: 'none' }}>
  <CustomCursor containerRef={containerRef}>...</CustomCursor>
  <div style={{ cursor: 'none' }}>
    <button style={{ cursor: 'pointer' }}>Click me</button>
  </div>
</div>
```

### Performance with Dynamic Styles

**Issue**: Frequent cursor style changes cause performance issues.

```tsx
// ❌ Problem: Inline styles change on every render
function DynamicCursor() {
  const [mode, setMode] = useState('normal');
  
  return (
    <div style={{ 
      cursor: mode === 'custom' ? 'none' : 'auto' // New object every render
    }}>
      <CustomCursor>...</CustomCursor>
    </div>
  );
}

// ✅ Solution: Use CSS classes
const cursorStyles = {
  none: { cursor: 'none' },
  auto: { cursor: 'auto' }
};

function DynamicCursor() {
  const [mode, setMode] = useState('normal');
  
  return (
    <div style={cursorStyles[mode === 'custom' ? 'none' : 'auto']}>
      <CustomCursor>...</CustomCursor>
    </div>
  );
}
```

## Advanced Patterns

### Conditional Cursor Based on Content

```tsx
function SmartCursor() {
  const [cursorMode, setCursorMode] = useState<'text' | 'button' | 'default'>('default');
  
  return (
    <div style={{ cursor: cursorMode === 'default' ? 'auto' : 'none' }}>
      {cursorMode !== 'default' && (
        <CustomCursor>
          {cursorMode === 'text' && <TextCursor />}
          {cursorMode === 'button' && <ButtonCursor />}
        </CustomCursor>
      )}
      
      <p 
        onMouseEnter={() => setCursorMode('text')}
        onMouseLeave={() => setCursorMode('default')}
      >
        Text content
      </p>
      
      <button
        onMouseEnter={() => setCursorMode('button')}
        onMouseLeave={() => setCursorMode('default')}
      >
        Interactive button
      </button>
    </div>
  );
}
```

### Cursor State Management

```tsx
// Using a custom hook for cursor state
function useCursorState() {
  const [isCustomCursor, setIsCustomCursor] = useState(false);
  
  const enableCustomCursor = useCallback(() => setIsCustomCursor(true), []);
  const disableCustomCursor = useCallback(() => setIsCustomCursor(false), []);
  
  return {
    isCustomCursor,
    enableCustomCursor,
    disableCustomCursor,
    cursorStyle: { cursor: isCustomCursor ? 'none' : 'auto' }
  };
}

function App() {
  const { isCustomCursor, enableCustomCursor, disableCustomCursor, cursorStyle } = useCursorState();
  
  return (
    <div style={cursorStyle}>
      {isCustomCursor && (
        <CustomCursor>
          <MyCursor />
        </CustomCursor>
      )}
      
      <button onClick={enableCustomCursor}>Enable Custom Cursor</button>
      <button onClick={disableCustomCursor}>Disable Custom Cursor</button>
    </div>
  );
}
```

## Why This Approach?

**Benefits of manual CSS cursor management:**

- ✅ **Simple**: You control exactly what gets hidden and where
- ✅ **Flexible**: Works with any CSS methodology (vanilla, Tailwind, CSS-in-JS)
- ✅ **Predictable**: No magic, no conflicts with your existing styles  
- ✅ **Framework Agnostic**: Works the same way in React, Next.js, Gatsby, etc.
- ✅ **Performance**: No DOM manipulation overhead from the library
- ✅ **Debuggable**: Easy to inspect and modify in browser DevTools

**vs. Automatic Cursor Management:**

- ❌ CSS specificity conflicts with your existing styles
- ❌ Unpredictable behavior with CSS frameworks
- ❌ Performance overhead from DOM style manipulation
- ❌ Hard to debug when styles conflict
- ❌ Library code becomes complex and fragile

## Need Help?

If you're having issues with cursor styling:

1. **Check the browser DevTools** - Inspect the element and see what cursor styles are applied
2. **Use `!important`** - Override conflicting styles temporarily to debug
3. **Test CSS specificity** - Make sure your cursor styles have sufficient specificity
4. **Check our examples** - See if your use case matches any of the patterns above

For library-specific issues (cursor positioning, animation, etc.), check the main [README](../README.md) and [Getting Started Guide](../GETTING_STARTED.md). 