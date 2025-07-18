# PR: Transition to Stable npm Releases

## Overview

This PR introduces infrastructure for stable npm releases while maintaining the existing beta release system. The goal is to provide production-ready releases alongside the current beta versions for testing and development.

## Key Changes

### 🚀 Unified Release Workflow (`.github/workflows/release.yml`)
- **Single workflow**: Handles both beta and stable releases intelligently
- **Automatic beta**: Triggers on main branch CI success (basic tests)
- **Manual stable**: GitHub Actions UI with full quality gates
- **Manual beta**: Optional manual beta releases for testing
- **Smart testing**: Basic tests for betas, full suite for stable
- **Version management**: Supports patch/minor/major bumps or custom versions
- **npm tags**: `@beta` for betas, `@latest` for stable

### 📦 Package Configuration Updates
- **Version bump**: Updated from `0.1.0` to `1.0.0` (first stable release)
- **New scripts**: Added version checking and release helper commands
- **Documentation**: Updated installation instructions for stable vs beta

### 📚 Documentation
- **RELEASE_PROCESS.md**: Comprehensive guide for both release types
- **README.md**: Updated with stable vs beta installation instructions
- **Quality standards**: Documented quality gates and rollback procedures

## Current State Analysis

- **Latest Beta**: `0.1.0-beta.76` (actively developed)
- **Latest Tag**: `0.1.0-beta.1` (outdated latest tag)
- **Issue**: No stable releases exist yet

## What This Enables

### For Users
```bash
# Production-ready stable version
npm install @yhattav/react-component-cursor

# Latest features (may have breaking changes)
npm install @yhattav/react-component-cursor@beta
```

### For Maintainers
- **Controlled releases**: Manual approval for stable versions
- **Quality assurance**: Comprehensive testing before stable release
- **Flexibility**: Separate beta and stable release cycles
- **Safety**: Rollback procedures and deprecation support

## Quality Gates for Stable Releases

All stable releases must pass:
- ✅ Unit tests (`npm run test:run`)
- ✅ Coverage requirements (`npm run test:coverage`)
- ✅ End-to-end tests (`npm run e2e`)
- ✅ Performance benchmarks (`npm run perf:ci`)
- ✅ Build verification (`npm run build`)
- ✅ Package integrity (`npm pack --dry-run`)

## Breaking Changes

**None** - This is purely additive:
- Beta releases continue as before
- No changes to existing APIs
- Backward compatible package structure

## Post-Merge Steps

1. **Merge this PR** to `main`
2. **Wait for beta release** to complete (`1.0.0-beta.1`)
3. **Create first stable release**:
   - Go to Actions → "Release Stable Version"
   - Run workflow with custom version `1.0.0`
   - This will create the first stable release

## Additional Considerations

### Security
- npm tokens stored as GitHub secrets
- Only maintainers can trigger stable releases
- All releases are logged and auditable

### Monitoring
- New scripts for version checking (`npm run version:check`)
- Easy comparison between beta and stable versions
- npm dist-tag management

### Future Enhancements
- Consider automated changelog generation
- Potential integration with semantic-release
- Community feedback incorporation process

## Testing Instructions

After merge, you can verify:
```bash
# Check current published versions
npm run version:check

# View beta versions
npm run version:beta

# View stable versions (after first release)
npm run version:latest
```

## Risk Assessment

**Low Risk**:
- No changes to existing functionality
- Beta releases continue unchanged
- Stable releases are manual and thoroughly tested
- Rollback procedures documented

## Dependencies

- Requires `NPM_AUTOMATION_TOKEN` secret (already configured)
- Uses existing CI infrastructure
- No new external dependencies