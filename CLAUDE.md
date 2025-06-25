# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development with both library and example app
- `npm start` - Build library in watch mode
- `npm run build` - Build production version of library
- `npm run prepare` - Alias for build (used by npm lifecycle)

### Testing
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with Vitest UI

### Quality Assurance
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint-fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript compiler without emitting files
- `npm run pre-commit` - Run lint-fix and type-check (used by husky)

### Performance & Size
- `npm run size` - Check bundle size limits
- `npm run analyze` - Analyze bundle size with size-limit
- `npm run perf:benchmark` - Run performance benchmarks
- `npm run perf:monitor` - Monitor performance changes
- `npm run perf:dashboard` - Generate performance dashboard

### E2E Testing
- `npm run e2e` - Run Playwright tests
- `npm run e2e:ui` - Run Playwright tests with UI
- `npm run e2e:debug` - Debug Playwright tests

### Integration Testing
- `npm run integration:test` - Run integration tests
- `npm run integration:browser` - Run browser integration tests
- `npm run integration:all` - Run all integration tests

## Architecture Overview

### Project Ecosystem
This is a React custom cursor library with a **multi-application ecosystem** designed to showcase, test, and promote the library:

**Core Purpose**: Replace default browser cursors with any React component while maintaining performance and compatibility.

### Library Structure
The main library provides a customizable cursor component with the following key architecture:

**Core Component (`src/CustomCursor.tsx`)**:
- Uses React Portal to render cursor outside normal DOM hierarchy
- Implements sophisticated memoization with custom `arePropsEqual` function
- Handles SSR gracefully by returning null on server-side
- Automatically detects and hides on mobile devices
- Uses CSS custom properties for smooth animations

**Hooks (`src/hooks/`)**:
- `useMousePosition` - Tracks mouse position with container scoping and throttling
- `useSmoothAnimation` - Handles smooth cursor movement with configurable interpolation

**Utilities (`src/utils/`)**:
- `ssr.ts` - SSR detection and safe browser API access
- `validation.ts` - Development-time prop validation
- `MouseTracker.ts` - Low-level mouse tracking with cleanup
- `CursorCoordinator.ts` - Manages multiple cursor instances

### Multi-Application Ecosystem

**Main Demo Application (`/example/`)**:
- Interactive playground showcasing all library features
- Registry-based section system for modular demos
- Includes gravity simulation, paint interactions, gallery effects
- Debug sidebar with real-time performance monitoring
- Vite-based development setup

**Next.js Showcase (`/example-nextjs/`)**:
- Production marketing site demonstrating SSR capabilities
- SEO-optimized with meta tags, sitemap, structured data
- Multiple cursor designs (glow, particles, emoji effects)
- Static export ready for deployment
- Professional landing page promoting library adoption

**Test Applications (`/test-app/`, testing scripts)**:
- Browser compatibility validation
- Performance regression testing
- SSR compatibility verification

### Build System
- **tsup** for building with dual development/production builds
- **Conditional exports** in package.json route to appropriate build
- **Development build** includes debug features and validation
- **Production build** strips all debug code via tree-shaking
- **Vitest** for testing with happy-dom environment
- **Playwright** for end-to-end testing

### Key Design Patterns

1. **Performance Optimization**:
   - Extensive use of `React.memo` with custom comparison
   - Memoized callbacks and computed values
   - Portal-based rendering to avoid re-renders
   - Throttling for mouse events

2. **SSR Safety**:
   - All browser APIs wrapped in safe functions
   - Graceful degradation on server-side
   - No hydration mismatches

3. **Development Experience**:
   - Debug indicator in development builds
   - Comprehensive prop validation
   - TypeScript with strict configuration

4. **Accessibility**:
   - Respects `prefers-reduced-motion`
   - Proper ARIA attributes
   - Automatic mobile device detection

## Testing Strategy

### Unit Tests (`test/`)
- Component behavior testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- Performance regression tests

### E2E Tests (`e2e/`)
- Cursor behavior validation
- Performance benchmarking
- Accessibility compliance testing

### Integration Tests (scripts/)
- Browser compatibility testing
- Build validation
- Performance monitoring

## Code Conventions

### TypeScript
- Strict mode enabled with comprehensive type checking
- Interfaces for props, utility types for flexibility
- JSDoc comments for public APIs

### React Patterns
- Functional components with hooks
- Extensive memoization for performance
- Custom comparison functions for React.memo
- Proper cleanup in useEffect hooks

### Styling
- CSS-in-JS with style objects
- CSS custom properties for animations
- Responsive design principles
- Accessibility-first approach

## Important Files

- `src/CustomCursor.tsx` - Main component implementation
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions and SSR handling
- `src/types.ts` - TypeScript type definitions
- `tsup.config.ts` - Build configuration with dual builds
- `package.json` - Conditional exports configuration
- `vitest.config.ts` - Test configuration
- `playwright.config.ts` - E2E test configuration

## Development Notes

### Working with the Multi-App Ecosystem
- **Library changes**: Test in both `/example/` and `/example-nextjs/` applications
- **New demo features**: Add to `/example/src/sections/` with registry entry
- **SSR testing**: Use `/example-nextjs/` to validate server-side rendering
- **Performance impact**: Monitor with `/example/` debug sidebar and benchmark scripts

### Quality Assurance
- Always run `npm run type-check` before committing
- Use `npm run pre-commit` to run all quality checks
- Performance tests should pass before merging
- Bundle size limits are enforced by size-limit
- All new features require corresponding tests
- Test in both demo applications for comprehensive validation
- Consider mobile compatibility for all changes

### Understanding the Applications
- **`/example/`**: For testing new features and interactive development
- **`/example-nextjs/`**: For validating production readiness and SSR compatibility
- **Root library**: Focus on performance, compatibility, and API design