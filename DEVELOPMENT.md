# Development Guide

Complete guide for contributing to and developing `@yhattav/react-component-cursor`.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/react-component-cursor.git
   cd react-component-cursor
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```
   This runs both the component and example app concurrently for development.

## 🏗️ Project Structure

```
react-component-cursor/
├── src/                     # Library source code
│   ├── CustomCursor.tsx     # Main component
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utility functions
│   └── types.ts             # TypeScript types
├── example/                 # Vite example app
├── example-nextjs/          # Next.js showcase
├── test/                    # Test files
├── docs/                    # Documentation
└── scripts/                 # Build and utility scripts
```

## 🔧 Development Commands

### Core Development
```bash
# Start development (library + example)
npm run dev

# Build library
npm run build

# Start library in watch mode
npm start

# Type checking
npm run type-check
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint-fix

# Pre-commit checks
npm run pre-commit
```

### Performance & Analysis
```bash
# Check bundle size
npm run size

# Analyze bundle
npm run analyze

# Performance benchmarks
npm run perf:benchmark

# Performance monitoring
npm run perf:monitor
```

### Integration Testing
```bash
# Browser integration tests
npm run integration:browser

# Full integration test suite
npm run integration:all
```

## 🏗️ Build System

### Library Building

The library uses **tsup** for building, which provides:
- Fast TypeScript compilation
- Multiple output formats (ESM, CJS, UMD)
- Automatic type declaration generation
- Tree-shaking support

### Build Outputs

```bash
npm run build
```

Generates:
- `dist/index.mjs` - ES modules (production)
- `dist/index.js` - CommonJS (production)  
- `dist/index.dev.mjs` - ES modules (development)
- `dist/index.dev.js` - CommonJS (development)
- `dist/index.d.ts` - TypeScript declarations

### Development vs Production Builds

The library uses **conditional exports** to provide optimized builds:

**Development Build:**
- Enhanced debugging features
- Visual debug indicators
- Prop validation with helpful errors
- Development warnings
- Bundle size: ~3KB

**Production Build:**
- All debug code eliminated via tree-shaking
- Minimal bundle size: ~2.2KB
- Optimized performance
- No validation overhead

### Build Configuration

Key files:
- `tsup.config.ts` - Build configuration
- `package.json` - Conditional exports setup
- `tsconfig.json` - TypeScript configuration

## 🧪 Testing Strategy

### Test Structure

```
test/
├── CustomCursor.test.tsx           # Main component tests
├── hooks/                          # Hook tests
│   ├── useMousePosition.test.tsx
│   └── useSmoothAnimation.test.tsx
├── utils/                          # Utility tests
├── performance.test.tsx            # Performance tests
├── ssr.test.tsx                    # SSR tests
└── setupTests.ts                   # Test configuration
```

### Testing Tools

- **Vitest** - Fast test runner
- **React Testing Library** - Component testing
- **jsdom** - Browser environment simulation
- **Playwright** - E2E testing

### Test Coverage

We maintain **100% test coverage** for:
- ✅ Core component functionality
- ✅ Custom hooks
- ✅ Utility functions  
- ✅ TypeScript types
- ✅ SSR compatibility
- ✅ Performance characteristics

### Performance Testing

Automated performance tests verify:
- Bundle size limits (<10KB)
- Memory usage (<1MB)
- Render performance (60fps)
- CPU efficiency

## 🚀 Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
feat: add new cursor animation option
feat(hooks): implement useCustomCursor hook

# Bug fixes  
fix: resolve smoothing calculation issue
fix(ssr): handle window undefined error

# Documentation
docs: update installation instructions
docs(performance): add optimization guide

# Tests
test: add tests for container bounds
test(e2e): add accessibility tests

# Refactoring
refactor: optimize mouse tracking logic
refactor(types): improve TypeScript definitions

# Build/CI
build: update build configuration
ci: add performance monitoring workflow
```

### Release Workflow

1. **Development**
   ```bash
   git checkout -b feature/my-feature
   # Make changes
   npm run pre-commit  # Lint, type-check, test
   git commit -m "feat: add my feature"
   ```

2. **Pull Request**
   - Create PR from feature branch
   - Automated CI runs tests and checks
   - Review and approval required
   - Squash and merge to main

3. **Release**
   - Automated release via GitHub Actions
   - Version bump based on commit messages
   - Changelog generation
   - npm publish

## 🔄 Contributing Workflow

### Issue Templates

Use our issue templates:
- **Bug Report** - Report bugs with reproduction steps
- **Feature Request** - Suggest new features
- **Documentation Update** - Improve documentation

### Pull Request Guidelines

1. **Branch Naming**
   ```bash
   feature/add-cursor-animation
   fix/smoothing-calculation  
   docs/performance-guide
   ```

2. **PR Requirements**
   - ✅ Tests pass
   - ✅ Code coverage maintained
   - ✅ Documentation updated
   - ✅ Performance benchmarks pass
   - ✅ TypeScript checks pass

3. **PR Template**
   - Clear description of changes
   - Before/after examples
   - Breaking changes noted
   - Testing instructions

### Code Style

We use:
- **ESLint** - Code linting
- **Prettier** - Code formatting  
- **TypeScript strict mode** - Type checking
- **React best practices** - Component patterns

Key principles:
- Functional components with hooks
- TypeScript-first development
- Performance optimization
- Comprehensive testing
- Clear documentation

## 📊 Performance Monitoring

### Automated Monitoring

- **CI Performance Tests** - Run on every PR
- **Bundle Size Tracking** - Prevent size regressions  
- **Memory Usage Tests** - Detect memory leaks
- **Render Performance** - Ensure 60fps performance

### Manual Testing

```bash
# Performance benchmarks
npm run perf:benchmark

# Generate performance dashboard
npm run perf:dashboard

# Browser integration testing
npm run integration:browser
```

## 🛠️ Tools & Configuration

### Development Tools

- **tsup** - Build tool
- **Vitest** - Testing framework
- **Playwright** - E2E testing
- **ESLint** - Linting
- **TypeScript** - Type checking

### IDE Setup

**VS Code Extensions:**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Jest Test Explorer

**Settings:**
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📚 Resources

### Documentation
- [Main README](README.md) - User-facing documentation
- [Contributing Guide](CONTRIBUTING.md) - Contribution overview
- [Performance Guide](docs/PERFORMANCE.md) - Optimization strategies
- [TypeScript Guide](docs/TYPES.md) - Type definitions

### External Resources
- [tsup Documentation](https://tsup.egoist.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Conventional Commits](https://www.conventionalcommits.org/) 