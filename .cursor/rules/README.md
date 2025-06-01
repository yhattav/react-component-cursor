# Cursor Project Rules

This directory contains the modernized Project Rules for this **React Custom Cursor Library** project.

## Project Overview
- **Library**: Pure React + TypeScript with minimal dependencies
- **Styling**: Inline styles and CSS-in-JS (no external UI frameworks in library code)
- **Example App**: Currently uses Ant Design (planned migration to Tailwind)
- **Build**: Vite + tsup for library bundling

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
- `response-constraints-always.mdc` - Code preservation guidelines
- `tech-stack-expertise-always.mdc` - Tech stack expertise declaration

### TypeScript Rules (Auto-attached to TS/TSX files)
- `typescript-standards-auto.mdc` - TypeScript coding standards and patterns

### UI Rules (Auto-attached to React files)
- `react-standards-auto.mdc` - Pure React and CSS standards for library components
- `react-tailwind-standards-auto.mdc` - Future Tailwind standards (ready for migration)
- `example-antd-standards-auto.mdc` - Current Ant Design standards for example app

### Performance Rules (Agent-requested)
- `optimization-strategies-agent.mdc` - Performance optimization guidelines

## Project-Specific Guidelines

### Library Development (`src/`)
- Keep dependencies minimal (only React as peer dependency)
- Use inline styles and CSS custom properties
- Focus on smooth animations and performance
- Provide flexible APIs for consumers

### Example App (`example/`)
- **Current**: Uses Ant Design for demonstrations
- **Future**: Will migrate to Tailwind CSS
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

## Migration Planning

### Ant Design → Tailwind Migration
When ready to migrate the example app:
1. The `react-tailwind-standards-auto.mdc` rule is ready to use
2. Update `example-antd-standards-auto.mdc` → rename or archive
3. Update example app dependencies
4. Library code remains unchanged (no UI framework dependencies)

## Migration Status

✅ **Migrated from `.cursorrules`** - The legacy `.cursorrules` file has been replaced with this organized Project Rules system for better maintainability and more precise rule application. 