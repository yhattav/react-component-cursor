# Release Process

This document outlines the release process for `@yhattav/react-component-cursor`.

## Overview

The project uses a **unified release workflow** that handles both beta and stable releases:

1. **Beta Releases** - Automatic releases from the `main` branch
2. **Stable Releases** - Manual releases triggered via GitHub Actions  
3. **Manual Beta Releases** - Manual beta releases for testing specific versions

## Unified Release Workflow

**Single File**: `.github/workflows/release.yml`

### Beta Releases (Automatic)

**Trigger**: Automatic after CI success on `main` branch

**Process**:
1. Every successful CI run on `main` triggers a beta release
2. Version format: `X.Y.Z-beta.N` (e.g., `1.0.0-beta.1`)
3. Runs basic tests only (for speed)
4. Published with `@beta` npm tag
5. Install with: `npm install @yhattav/react-component-cursor@beta`

### Stable Releases (Manual)

**Trigger**: Manual via GitHub Actions UI

**Process**:
1. Navigate to **Actions** → **Release Package** in GitHub
2. Click **Run workflow**
3. Choose release type: **stable**
4. Choose version bump type:
   - **patch**: Bug fixes (1.0.0 → 1.0.1)
   - **minor**: New features (1.0.0 → 1.1.0)
   - **major**: Breaking changes (1.0.0 → 2.0.0)
5. Optionally specify a custom version
6. The workflow will:
   - Run **full test suite** + e2e tests + performance benchmarks
   - Build and verify package integrity
   - Create release commit and git tag
   - Publish to npm with `@latest` tag
   - Create GitHub Release with changelog
   - Push changes to repository

### Manual Beta Releases (Optional)

**Trigger**: Manual via GitHub Actions UI

**Process**:
1. Navigate to **Actions** → **Release Package** in GitHub
2. Click **Run workflow**
3. Choose release type: **beta**
4. Runs basic tests and creates a beta release

**Use Cases**: Testing specific features, creating release candidates

## Version Management

### Current State
- **Latest Beta**: `0.1.0-beta.76`
- **Latest Stable**: None yet (this PR introduces stable releases)
- **Next Stable**: `1.0.0` (first stable release)

### Semantic Versioning
- **Major** (X.0.0): Breaking changes
- **Minor** (X.Y.0): New features, backward compatible
- **Patch** (X.Y.Z): Bug fixes, backward compatible
- **Beta** (X.Y.Z-beta.N): Pre-release versions

## npm Tags

- `@latest`: Stable releases for production use
- `@beta`: Pre-release versions for testing

### Installation
```bash
# Install latest stable version
npm install @yhattav/react-component-cursor

# Install latest beta version
npm install @yhattav/react-component-cursor@beta

# Install specific version
npm install @yhattav/react-component-cursor@1.0.0
```

## Quality Gates for Stable Releases

Stable releases must pass:
- ✅ Unit tests (`npm run test:run`)
- ✅ Test coverage requirements (`npm run test:coverage`)
- ✅ End-to-end tests (`npm run e2e`)
- ✅ Performance benchmarks (`npm run perf:ci`)
- ✅ Build verification (`npm run build`)
- ✅ Package integrity check (`npm pack --dry-run`)

## Useful Commands

```bash
# Check current published versions
npm run version:check

# Check latest beta version
npm run version:beta

# Check latest stable version
npm run version:latest

# View all published versions
npm view @yhattav/react-component-cursor versions --json
```

## First Stable Release

This PR sets up the infrastructure for the first stable release (`1.0.0`). To create it:

1. Merge this PR to `main`
2. Wait for the beta release to complete
3. Go to GitHub Actions → **Release Package**
4. Run workflow with:
   - Release type: `stable`
   - Version type: Use **custom version** (since we want `1.0.0` exactly)
   - Custom version: `1.0.0`

## Rollback Process

If a stable release has issues:

1. **npm deprecate**: Mark the problematic version as deprecated
   ```bash
   npm deprecate @yhattav/react-component-cursor@X.Y.Z "Reason for deprecation"
   ```

2. **Hotfix release**: Create a patch release with the fix

3. **Revert dist-tag**: Point `@latest` to previous stable version
   ```bash
   npm dist-tag add @yhattav/react-component-cursor@X.Y.Z latest
   ```

## Security Considerations

- npm tokens are stored as GitHub secrets
- Only authorized maintainers can trigger stable releases
- All releases are logged and traceable
- Package integrity is verified before publishing