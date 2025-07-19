# Troubleshooting Guide

Common issues and solutions for `@yhattav/react-component-cursor`.

## 🚫 Cursor Not Appearing

### Checklist

1. **Mobile Device Detection**
   ```tsx
   // The component automatically hides on touch devices
   // Check if you're testing on a mobile device or emulator
   ```

2. **Component Enabled State**
   ```tsx
   // ✅ Verify the cursor is enabled
   <CustomCursor enabled={true}>
     <MyCursor />
   </CustomCursor>
   
   // ❌ Check if accidentally disabled
   <CustomCursor enabled={false}>
     <MyCursor />
   </CustomCursor>
   ```

3. **Browser Console Errors**
   ```tsx
   // Check browser DevTools console for validation errors
   // Look for React warnings or TypeScript errors
   ```

4. **Native Cursor Styling**
   ```tsx
   // Hide native cursor for cleaner appearance
   <div style={{ cursor: 'none' }}>
     <CustomCursor>
       <MyCursor />
     </CustomCursor>
   </div>
   ```

### Common Causes

- **Touch device**: Component automatically hides on mobile/touch devices
- **Container bounds**: Cursor outside container when using `containerRef`
- **Z-index issues**: Cursor behind other elements
- **CSS conflicts**: Native cursor still visible

### Solutions

```tsx
// Force show cursor (debugging)
<CustomCursor 
  enabled={true}
  showDevIndicator={true}  // Shows red debug ring in development
>
  <MyCursor />
</CustomCursor>

// Check container boundaries
<div ref={containerRef} style={{ border: '1px solid red' }}>
  <CustomCursor containerRef={containerRef}>
    <MyCursor />
  </CustomCursor>
</div>

// Adjust z-index
<CustomCursor zIndex={99999}>
  <MyCursor />
</CustomCursor>
```

## ⚡ Performance Issues

### Symptoms
- Choppy cursor movement
- High CPU usage
- Battery drain on mobile
- Lag or stuttering

### Quick Fixes

1. **Reduce Smoothness**
   ```tsx
   // ❌ Too smooth (causes lag)
   <CustomCursor smoothness={20}>
   
   // ✅ Balanced smoothness
   <CustomCursor smoothness={1}>  // Direct positioning
   <CustomCursor smoothness={2}>  // Light smoothing
   ```

2. **Add Throttling**
   ```tsx
   // ✅ Throttle for complex cursors
   <CustomCursor throttleMs={16}>  // 60fps limit
     <ComplexAnimatedCursor />
   </CustomCursor>
   
   // ✅ No throttling for simple cursors
   <CustomCursor throttleMs={0}>
     <SimpleCursor />
   </CustomCursor>
   ```

3. **Container Scoping**
   ```tsx
   // ✅ Scope to specific areas
   <CustomCursor containerRef={sectionRef}>
     <SectionCursor />
   </CustomCursor>
   
   // ❌ Avoid global cursor for small areas
   <CustomCursor>
     <HeavyCursor />
   </CustomCursor>
   ```

4. **Optimize Cursor Content**
   ```tsx
   // ✅ Memoized cursor component
   const OptimizedCursor = React.memo(() => (
     <div className="cursor">
       <SimpleSVG />
     </div>
   ));
   
   // ❌ Heavy, unmemoized content
   <CustomCursor>
     <div>
       <ExpensiveComponent />
       <AnotherHeavyComponent />
     </div>
   </CustomCursor>
   ```

### Advanced Performance Debugging

```tsx
// Monitor performance
const [metrics, setMetrics] = useState({});

const trackPerformance = useCallback((position) => {
  const timestamp = performance.now();
  // Log performance metrics
  console.log('Cursor update time:', timestamp);
}, []);

<CustomCursor onMove={trackPerformance}>
  <DebugCursor />
</CustomCursor>
```

## 🔄 SSR/Hydration Issues

### Symptoms
- "Text content did not match" warnings
- Component not appearing after page load
- Hydration mismatch errors

### Solutions

The component automatically handles SSR, but if you encounter issues:

1. **Let Component Handle SSR**
   ```tsx
   // ✅ Automatic SSR handling
   <CustomCursor>
     <MyCursor />
   </CustomCursor>
   
   // ❌ Avoid manual SSR checks
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   if (!mounted) return null;
   ```

2. **Avoid Conditional Rendering**
   ```tsx
   // ✅ Let component handle visibility
   <CustomCursor enabled={someCondition}>
     <MyCursor />
   </CustomCursor>
   
   // ❌ Conditional component rendering
   {someCondition && (
     <CustomCursor>
       <MyCursor />
     </CustomCursor>
   )}
   ```

3. **Dynamic Imports (if needed)**
   ```tsx
   // Only use if you have specific SSR requirements
   const CustomCursor = dynamic(
     () => import('@yhattav/react-component-cursor').then(mod => ({ default: mod.CustomCursor })),
     { ssr: false }
   );
   ```

## 🎨 Styling Issues

### Native Cursor Still Visible

```tsx
// ✅ Hide native cursor
<div style={{ cursor: 'none' }}>
  <CustomCursor>
    <MyCursor />
  </CustomCursor>
</div>

// ✅ CSS approach
.custom-cursor-area {
  cursor: none !important;
}

// ✅ Global hiding
body {
  cursor: none;
}
```

### Cursor Not Centered

```tsx
// ✅ Auto-centering (default)
<CustomCursor centered={true}>
  <MyCursor />
</CustomCursor>

// ✅ Manual positioning
<CustomCursor 
  centered={false}
  offset={{ x: -10, y: -10 }}  // Adjust positioning
>
  <MyCursor />
</CustomCursor>
```

### Z-Index Issues

```tsx
// ✅ Increase z-index
<CustomCursor zIndex={99999}>
  <MyCursor />
</CustomCursor>

// ✅ CSS approach
.cursor-container {
  z-index: 9999 !important;
}
```

## 📱 Mobile/Touch Issues

### Cursor Appearing on Mobile

```tsx
// Component automatically hides on touch devices
// If you want manual control:

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  setIsMobile('ontouchstart' in window);
}, []);

<CustomCursor enabled={!isMobile}>
  <MyCursor />
</CustomCursor>
```

## 🔧 Development Issues

### Debug Ring Not Showing

```tsx
// ✅ Enable debug indicator
<CustomCursor showDevIndicator={true}>
  <MyCursor />
</CustomCursor>

// Note: Debug ring only shows in development builds
// Check that NODE_ENV=development
```

### TypeScript Errors

```tsx
// ✅ Proper typing
import type { CustomCursorProps } from '@yhattav/react-component-cursor';

const MyComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <CustomCursor
      containerRef={containerRef}
      smoothness={2}
      onMove={(position: { x: number, y: number }) => {
        console.log(position);
      }}
    >
      <MyCursor />
    </CustomCursor>
  );
};
```

## 🔍 Debugging Tools

### Visual Debugging

```tsx
// Show container boundaries
<div 
  ref={containerRef}
  style={{ 
    border: '2px dashed red',  // Visual container boundary
    minHeight: '200px'
  }}
>
  <CustomCursor 
    containerRef={containerRef}
    showDevIndicator={true}    // Red debug ring
  >
    <MyCursor />
  </CustomCursor>
</div>
```

### Console Debugging

```tsx
// Log cursor events
<CustomCursor
  onMove={(pos) => console.log('Move:', pos)}
  onVisibilityChange={(visible, reason) => 
    console.log('Visibility:', visible, reason)
  }
>
  <MyCursor />
</CustomCursor>
```

### Performance Monitoring

```tsx
// Track performance metrics
const [perfMetrics, setPerfMetrics] = useState({
  moveCount: 0,
  avgTime: 0
});

const trackMove = useCallback((position) => {
  const timestamp = performance.now();
  setPerfMetrics(prev => ({
    moveCount: prev.moveCount + 1,
    avgTime: (prev.avgTime + timestamp) / 2
  }));
}, []);

<CustomCursor onMove={trackMove}>
  <MyCursor />
</CustomCursor>
```

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check browser DevTools console** for errors
2. **Test with minimal setup** to isolate the issue
3. **Verify library version** is up to date
4. **Test in different browsers** to rule out browser-specific issues
5. **Create minimal reproduction** for bug reports

### Minimal Test Setup

```tsx
import { CustomCursor } from '@yhattav/react-component-cursor';

function MinimalTest() {
  return (
    <div style={{ cursor: 'none', height: '100vh', padding: '50px' }}>
      <CustomCursor showDevIndicator={true}>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'red',
          borderRadius: '50%'
        }} />
      </CustomCursor>
      
      <h1>Move mouse to see cursor</h1>
    </div>
  );
}
```

This minimal setup should work in all supported environments. If it doesn't, there may be a broader compatibility issue. 