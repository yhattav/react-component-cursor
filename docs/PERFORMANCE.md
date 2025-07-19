# Performance Optimization Guide

Complete guide to optimizing `@yhattav/react-component-cursor` for different use cases and performance requirements.

## 🎯 Performance Overview

The library is designed with performance as a priority:
- **Lightweight**: <10KB bundle size
- **Optimized**: Single mouse tracker shared across instances
- **Efficient**: Minimal re-renders with React.memo optimization
- **Flexible**: Fine-grained control for complex scenarios

## ⚡ Quick Optimization

### Essential Props for Performance

| Prop | Performance Impact | Recommendation |
|------|-------------------|----------------|
| `smoothness={1}` | ✅ **Best** | Use for gaming/responsive apps |
| `smoothness={2-3}` | 🟡 **Good** | Use for elegant movement |
| `smoothness={5+}` | 🟠 **Heavy** | Avoid unless necessary |
| `throttleMs={0}` | 🟡 **Native** | Good for most use cases |
| `throttleMs={16}` | ✅ **Efficient** | Use with complex cursors |
| `containerRef={ref}` | ✅ **Best** | Scope to reduce global impact |

## 🎮 Optimal Settings by Use Case

### Gaming/Interactive Apps

**Priority**: Maximum responsiveness

```tsx
<CustomCursor
  smoothness={1}        // Instant response
  throttleMs={0}        // No throttling
  showDevIndicator={false}
>
  <GameCursor />
</CustomCursor>
```

### Creative/Portfolio Sites

**Priority**: Smooth, elegant movement

```tsx
<CustomCursor
  smoothness={3}        // Smooth, elegant movement
  throttleMs={8}        // Light throttling for style
  onMove={trackAnalytics}
>
  <ArtisticCursor />
</CustomCursor>
```

### Mobile-Friendly Apps

**Priority**: Efficiency and battery life

```tsx
<CustomCursor
  smoothness={1}        // Direct positioning
  throttleMs={16}       // Optional: cap at 60fps
  // Component automatically hides on touch devices
>
  <DesktopOnlyCursor />
</CustomCursor>
```

### Complex Multi-Cursor Apps

**Priority**: Performance with many instances

```tsx
function MultiCursorApp() {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  
  return (
    <>
      <section ref={section1Ref}>
        <CustomCursor 
          containerRef={section1Ref}
          smoothness={1}
          throttleMs={16}
        >
          <Section1Cursor />
        </CustomCursor>
      </section>
      
      <section ref={section2Ref}>
        <CustomCursor 
          containerRef={section2Ref}
          smoothness={2}
          throttleMs={16}
        >
          <Section2Cursor />
        </CustomCursor>
      </section>
    </>
  );
}
```

## 📊 Performance Impact Matrix

| Setting | CPU Impact | Memory Impact | Battery Impact | Visual Quality | Notes |
|---------|------------|---------------|----------------|----------------|-------|
| `smoothness={1}` | ✅ None | ✅ None | ✅ None | ⚡ Instant | Direct positioning, no animation loop |
| `smoothness={2-5}` | 🟡 Low | ✅ None | 🟡 Low | 🎨 Smooth | Light RAF usage for interpolation |
| `smoothness={5+}` | 🟠 Medium | ✅ None | 🟠 Medium | 🎭 Very Smooth | Continuous RAF, slower convergence |
| `throttleMs={0}` | 🟡 Low | ✅ None | 🟡 Low | ⚡ Native Refresh | Runs at display rate (60-144Hz) |
| `throttleMs={8-16}` | 🟡 Low | ✅ None | 🟡 Low | 🎯 Smooth 60fps | Minimal difference from native |
| `throttleMs={16+}` | ✅ Lower | ✅ None | ✅ Lower | 🐌 <60fps | Noticeable responsiveness reduction |

### Reality Check

The difference between `throttleMs={0}` and `throttleMs={16}` is minimal in practice:
- Modern displays run at 60-144Hz (6-16ms intervals)
- Mouse events are typically OS-limited to ~125-1000Hz
- CPU impact difference is negligible for most applications

## 🎯 Best Practices

### 1. Choose Appropriate Smoothness

```tsx
// ✅ Good: Light smoothing for elegance
<CustomCursor smoothness={2}>
  <ElegantCursor />
</CustomCursor>

// ❌ Avoid: Excessive smoothing causes lag
<CustomCursor smoothness={20}>
  <LaggyCursor />
</CustomCursor>
```

### 2. Use Throttling for Performance

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

### 3. Optimize Callback Functions

```tsx
// ✅ Good: Memoized callback
const handleMove = useCallback((pos) => {
  analytics.track('cursor_move', pos);
}, []);

<CustomCursor onMove={handleMove} />

// ❌ Avoid: Inline functions (cause re-renders)
<CustomCursor onMove={(pos) => console.log(pos)} />
```

### 4. Container Scoping for Performance

```tsx
// ✅ Good: Scope cursor to specific areas
<InteractiveSection ref={containerRef}>
  <CustomCursor containerRef={containerRef}>
    <SectionCursor />
  </CustomCursor>
</InteractiveSection>

// ❌ Avoid: Global cursor for small interactive areas
<CustomCursor>
  <GlobalCursor />
</CustomCursor>
```

### 5. Optimize Cursor Content

```tsx
// ✅ Good: Memoized cursor content
const MemoizedCursor = React.memo(() => (
  <div className="cursor-design">
    <ComplexSVG />
  </div>
));

<CustomCursor>
  <MemoizedCursor />
</CustomCursor>

// ❌ Avoid: Heavy, unmemoized content
<CustomCursor>
  <div>
    <ExpensiveComponent />
    <AnotherHeavyComponent />
  </div>
</CustomCursor>
```

### 6. Accessibility Considerations

```tsx
// ✅ Good: Accessibility support with performance
<CustomCursor
  role="presentation"
  aria-label="Custom cursor indicator"
  // Automatically respects prefers-reduced-motion
  smoothness={2}
>
  <AccessibleCursor />
</CustomCursor>
```

## 🔧 Advanced Optimization

### Multiple Cursor Instances

When using multiple cursors, consider performance implications:

```tsx
// ✅ Good: Container-scoped cursors
function OptimizedMultiCursor() {
  const galleryRef = useRef(null);
  const editorRef = useRef(null);
  
  return (
    <>
      {/* Gallery cursor - smooth for visual appeal */}
      <Gallery ref={galleryRef}>
        <CustomCursor 
          containerRef={galleryRef}
          smoothness={3}
          throttleMs={16}
        >
          <ZoomCursor />
        </CustomCursor>
      </Gallery>
      
      {/* Editor cursor - responsive for interaction */}
      <Editor ref={editorRef}>
        <CustomCursor 
          containerRef={editorRef}
          smoothness={1}
          throttleMs={8}
        >
          <PrecisionCursor />
        </CustomCursor>
      </Editor>
    </>
  );
}
```

### Custom Cursor Components

Optimize your cursor components for best performance:

```tsx
// ✅ Good: Optimized cursor component
const OptimizedCursor = React.memo(({ mode, size }) => {
  const style = useMemo(() => ({
    width: size,
    height: size,
    transform: `scale(${mode === 'hover' ? 1.5 : 1})`,
    transition: 'transform 0.2s ease',
  }), [mode, size]);

  return (
    <div style={style}>
      <svg>...</svg>
    </div>
  );
});

// ❌ Avoid: Unoptimized component
const UnoptimizedCursor = ({ mode, size }) => {
  return (
    <div style={{
      width: size,
      height: size,
      transform: `scale(${mode === 'hover' ? 1.5 : 1})`,
    }}>
      <ExpensiveComponent />
    </div>
  );
};
```

## 📱 Mobile & Touch Considerations

The library automatically optimizes for mobile:

```tsx
// ✅ Automatic mobile optimization
<CustomCursor>
  <DesktopCursor />
</CustomCursor>
// Automatically hidden on touch devices

// ✅ Manual control if needed
<CustomCursor 
  enabled={!isMobile} // Your mobile detection
>
  <DesktopOnlyCursor />
</CustomCursor>
```

## 🐛 Performance Debugging

### Development Tools

Use the development indicator to debug performance:

```tsx
// Show debug ring in development
<CustomCursor showDevIndicator={true}>
  <DebugCursor />
</CustomCursor>
```

### Performance Monitoring

Track cursor performance in your app:

```tsx
const [performanceMetrics, setPerformanceMetrics] = useState({});

const trackPerformance = useCallback((position) => {
  // Custom performance tracking
  const timestamp = performance.now();
  // ... track metrics
}, []);

<CustomCursor onMove={trackPerformance}>
  <MonitoredCursor />
</CustomCursor>
```

## 🔗 Related Documentation

- [← Main README](../README.md)
- [TypeScript Types](TYPES.md) 
- [SSR Guide](SSR.md)
- [Cursor Styling](CURSOR_STYLING.md) 