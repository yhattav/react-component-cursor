# Sections System

This directory contains all the demo sections for the React Component Cursor library.

## How to Add a New Section

### 1. Create the Section Component

Create a new file `YourSectionName.tsx`:

```tsx
import React from 'react';

interface YourSectionProps {
  onDebugData?: (data: Record<string, unknown>) => void;
}

export const YourSection: React.FC<YourSectionProps> = ({ onDebugData }) => {
  // Your section implementation
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-neutral-900">Your Section</h2>
      {/* Your content here */}
    </div>
  );
};
```

### 2. Add to Registry

In `registry.ts`, add your section:

```tsx
import { YourSection } from './YourSection';

// Add to the SECTIONS object
export const SECTIONS: Record<string, SectionConfig> = {
  // ... existing sections
  'your-section': {
    id: 'your-section',
    name: 'Your Section',
    title: 'Your Section',
    description: 'Description of your section',
    component: YourSection,
    enabled: true,
  },
};
```

### 3. Export from Index

In `index.ts`, add the export:

```tsx
export * from './YourSection';
```

### 4. That's it!

Your section will automatically appear in the navigation and be available for use.

## Section Structure

All sections should:
- Accept `onDebugData` prop for debugging information
- Use Tailwind CSS for styling
- Follow the naming convention: `SectionNameSection`
- Export as named export

## Registry System

The registry system (`registry.ts`) provides:
- `getAllSections()` - Get all enabled sections
- `getSection(id)` - Get a specific section by ID
- `getSectionComponent(id)` - Get a section's component
- `addSection(config)` - Add a new section programmatically
- `getNavigationSections()` - Get sections formatted for navigation

## Debugging

Each section can send debug data to the sidebar by calling:

```tsx
onDebugData?.({
  // Your debug data
  currentState: 'active',
  mousePosition: { x: 100, y: 200 },
  // ... any other data
});
``` 