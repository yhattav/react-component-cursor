# Cursor Project Rules

This directory contains the modernized Project Rules for this **React Custom Cursor Library** project.

## Project Overview
This is a **React component library** that creates flexible, customizable cursor replacement systems. The main export is a `CustomCursor` component allowing developers to replace browser cursors with any React component.

**Key Details:**
- **Library**: Pure React + TypeScript with minimal dependencies (<10KB target)
- **Styling**: Inline styles and CSS-in-JS (no external UI frameworks in library code)  
- **Example App**: Uses Tailwind CSS with custom components for demonstrations
- **Build**: Vite + tsup for library bundling
- **Distribution**: NPM package `@yhattav/react-component-cursor`

> 📋 **Complete project context** is available in `core-rules/project-context-always.mdc`

## Structure

```
.cursor/rules/
├── core-rules/           # Always-applied foundational rules
├── ts-rules/            # TypeScript-specific rules (auto-attach to .ts/.tsx files)
├── ui-rules/            # React/UI rules (auto-attach to component files)
├── performance-rules/   # Performance optimization (agent-requested)
└── README.md           # This file
```

## Rule Types

| File Suffix | Type | Behavior |
|-------------|------|----------|
| `-always.mdc` | Always | Applied to every chat and Cmd+K |
| `-auto.mdc` | Auto Attached | Applied when matching file patterns |
| `-agent.mdc` | Agent Requested | AI decides when to include |
| `-manual.mdc` | Manual | Only when explicitly referenced |

## Current Rules

### Core Rules (Always Applied)
- `project-context-always.mdc` - Comprehensive project context and goals
- `response-constraints-always.mdc` - Code preservation guidelines
- `tech-stack-expertise-always.mdc` - Tech stack expertise declaration

### TypeScript Rules (Auto-attached to TS/TSX files)
- `typescript-standards-auto.mdc` - TypeScript coding standards and patterns

### UI Rules (Auto-attached to React files)
- `react-standards-auto.mdc` - Pure React and CSS standards for library components
- `react-tailwind-standards-auto.mdc` - Tailwind CSS standards for example app

### Performance Rules (Agent-requested)
- `optimization-strategies-agent.mdc` - Performance optimization guidelines

## Project-Specific Guidelines

### Library Development (`src/`)
- Keep dependencies minimal (only React as peer dependency)
- Use inline styles and CSS custom properties
- Focus on smooth animations and performance
- Provide flexible APIs for consumers

### Example App (`example/`)
- **Current**: Uses Tailwind CSS with custom components for demonstrations
- Should showcase library capabilities effectively
- Maintain clean separation from library code

## Adding New Rules

1. Create new `.mdc` files in appropriate subdirectories
2. Use proper frontmatter with `description`, `globs`, and `alwaysApply` fields
3. Follow the naming convention: `rule-name-{type}.mdc`
4. Include both valid and invalid examples

## IDE Configuration

Add this to your Cursor settings for better `.mdc` file handling:

```json
"workbench.editorAssociations": {
  "*.mdc": "default"
}
```

## Migration Status

✅ **Migrated from `.cursorrules`** - The legacy `.cursorrules` file has been replaced with this organized Project Rules system for better maintainability and more precise rule application.

✅ **Ant Design → Tailwind Migration Complete** - The example app has been fully migrated from Ant Design to Tailwind CSS with custom components. 