# React Component Cursor - Next.js Example

This is a comprehensive showcase of the `@yhattav/react-component-cursor` library built with Next.js 14, featuring advanced cursor interactions and real-time demonstrations.

## 🎯 Refactored Architecture

### Section-Based Cursor Management

This example demonstrates a **refactored approach** to custom cursor management where:

- **Each section has its own single `CustomCursor` component**
- **Cursor appearance changes based on React state within each section**
- **State changes are triggered by cursor events (`onMove`, `onVisibilityChange`)**
- **Better isolation and control compared to multiple overlapping cursors**

### Key Benefits

1. **🎯 Better Control**: Each section manages its own cursor state independently
2. **⚡ Performance**: Single cursor per section reduces conflicts and improves performance
3. **🔧 Maintainability**: State management is centralized within each section
4. **🎨 Flexibility**: Easy to customize cursor behavior based on section-specific logic

## 🏗️ Implementation Examples

### Hero Section
```typescript
const handleCursorMove = useCallback((position: { x: number; y: number }) => {
  // Change cursor variant based on position in hero area
  const section = document.querySelector('.hero-section');
  if (section) {
    const rect = section.getBoundingClientRect();
    const relativeX = (position.x - rect.left) / rect.width;
    const relativeY = (position.y - rect.top) / rect.height;
    
    // Divide hero area into quadrants to determine cursor variant
    let newIndex = 0;
    if (relativeX < 0.5 && relativeY < 0.5) newIndex = 0; // Top-left: glow
    else if (relativeX >= 0.5 && relativeY < 0.5) newIndex = 1; // Top-right: particle
    else if (relativeX < 0.5 && relativeY >= 0.5) newIndex = 2; // Bottom-left: emoji
    else newIndex = 3; // Bottom-right: ring
    
    if (newIndex !== currentCursorIndex) {
      setCurrentCursorIndex(newIndex);
    }
  }
}, [currentCursorIndex]);

<CustomCursor 
  onMove={handleCursorMove}
  onVisibilityChange={handleCursorVisibilityChange}
>
  <motion.div key={currentCursor.id}>
    {currentCursor.element}
  </motion.div>
</CustomCursor>
```

### Proof Section
```typescript
const handleCursorMove = useCallback((position: { x: number; y: number }) => {
  // Check if cursor is over interactive elements
  const element = document.elementFromPoint(position.x, position.y);
  const isOverCard = element?.closest('.proof-card') !== null;
  const isOverButton = element?.closest('.proof-button') !== null;
  
  let newIndex = 0;
  if (isOverButton) {
    newIndex = 2; // Interactive cursor for buttons
  } else if (isOverCard) {
    newIndex = 1; // Hovering cursor for cards
  } else {
    newIndex = 0; // Default cursor
  }
  
  if (newIndex !== currentCursorIndex) {
    setCursorIndex(newIndex);
  }
}, [currentCursorIndex]);
```

### Features Showcase Section
```typescript
const handleCursorMove = useCallback((position: { x: number; y: number }) => {
  // Update movement stats
  setInteractionStats(prev => ({ ...prev, movements: prev.movements + 1 }));

  // Determine which feature area the cursor is in
  const element = document.elementFromPoint(position.x, position.y);
  const demoArea = element?.closest('.demo-area');
  const featureCard = element?.closest('.feature-card');
  const emojiSelector = element?.closest('.emoji-selector');
  const performanceArea = element?.closest('.performance-area');

  let newIndex = 0;
  if (performanceArea) {
    newIndex = 3; // Particle cursor for performance demo
    setPerformanceMode(true);
  } else if (emojiSelector) {
    newIndex = 2; // Emoji cursor in emoji area
  } else if (featureCard?.classList.contains('glow-feature')) {
    newIndex = 1; // Glow cursor for glow feature
  } else if (demoArea) {
    setIsInPlayground(true);
  } else {
    newIndex = 0; // Default cursor
    setIsInPlayground(false);
  }

  if (newIndex !== currentCursorIndex && !isInPlayground) {
    setCursorIndex(newIndex);
  }
}, [currentCursorIndex, isInPlayground]);
```

## 📁 File Structure

```
src/
├── app/
│   ├── page.tsx                 # Main page with section orchestration
│   └── layout.tsx              # Root layout
├── components/
│   ├── sections/               # Refactored section components
│   │   ├── hero-section.tsx           # ✅ Refactored with single cursor
│   │   ├── proof-section.tsx          # ✅ Refactored with single cursor  
│   │   ├── features-showcase-section.tsx # ✅ Refactored with single cursor
│   │   ├── beautiful-design-example.tsx  # Container-scoped cursor
│   │   ├── interactive-component-example.tsx # State-driven cursor
│   │   └── performance-optimized-example.tsx # Performance-focused cursor
│   ├── cursors/               # Cursor component library
│   │   ├── glow-cursor.tsx
│   │   ├── emoji-cursor.tsx
│   │   ├── particle-cursor.tsx
│   │   └── index.ts
│   └── ui/                    # Shared UI components
│       ├── animated-particles.tsx
│       ├── code-snippet.tsx
│       └── stats-badges.tsx
└── lib/
    └── constants.ts           # Shared constants and types
```

## 🚀 Key Features Demonstrated

### 1. **Position-Based Cursor Changes**
- Hero section divides area into quadrants
- Each quadrant triggers different cursor variant
- Smooth transitions between states

### 2. **Element-Based Cursor Detection**
- Proof section detects hover over specific elements
- Uses `document.elementFromPoint()` for precise detection
- Different cursors for cards vs buttons vs default areas

### 3. **Feature-Specific Interactions**
- Features showcase section has complex interaction logic
- Performance mode toggles based on cursor location
- Real-time statistics tracking
- Dynamic emoji selection

### 4. **State-Driven Animations**
- All cursor changes use Framer Motion for smooth transitions
- Each cursor variant has unique animation properties
- State indicators show current cursor mode and context

## 🎨 Cursor Variants

Each section defines its own cursor variants:

```typescript
const heroCursorVariants = [
  {
    id: 'glow',
    element: <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-70" />,
    name: 'Glow Effect'
  },
  {
    id: 'particle',
    element: <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />,
    name: 'Particle'
  },
  // ... more variants
];
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Performance Considerations

- **Single cursor per section**: Reduces DOM complexity and conflicts
- **Efficient element detection**: Uses native `document.elementFromPoint()`
- **Debounced state updates**: Prevents excessive re-renders
- **Smooth animations**: Hardware-accelerated transforms with Framer Motion
- **Performance monitoring**: Real-time FPS and memory tracking

## 🎯 Best Practices Demonstrated

1. **Section Isolation**: Each section manages its own cursor independently
2. **Event-Driven State**: Use cursor events to trigger state changes
3. **Smooth Transitions**: Always animate cursor changes for better UX
4. **Performance Tracking**: Monitor and display performance metrics
5. **Accessibility**: Respect reduced motion preferences
6. **TypeScript**: Full type safety for cursor variants and handlers

This refactored approach provides much better control over cursor behavior while maintaining clean, maintainable code that scales well across complex applications.

## 🌟 Live Demo

Visit the live demo to experience these cursor interactions in action. Each section demonstrates different aspects of the refactored architecture, showcasing how single-cursor-per-section approach provides better control and performance than traditional multi-cursor implementations.
