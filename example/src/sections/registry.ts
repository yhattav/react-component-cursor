import React from 'react';
import { DemoSection } from './DemoSection';
import { GravitySection } from './GravitySection';
import { ContentRevealSection } from './ContentRevealSection';
import { EntryAnimationSection } from './EntryAnimationSection';
import { PaintSection } from './PaintSection';
import { GallerySection } from './GallerySection';
import CursorHierarchy from './CursorHierarchy';

export interface SectionConfig {
  id: string;
  name: string;
  title: string;
  description?: string;
  component: React.FC<{ onDebugData?: (data: Record<string, unknown>) => void }>;
  enabled?: boolean;
}

export const SECTIONS: Record<string, SectionConfig> = {
  demo: {
    id: 'demo',
    name: 'Demo',
    title: 'Demo',
    description: 'Basic CustomCursor component demonstrations',
    component: DemoSection,
    enabled: true,
  },

  'cursor-hierarchy': {
    id: 'cursor-hierarchy',
    name: 'Cursor Hierarchy',
    title: 'Cursor Hierarchy',
    description: 'Demonstrates cursor hierarchy with nested containers',
    component: CursorHierarchy,
    enabled: true,
  },

  gravity: {
    id: 'gravity',
    name: 'Gravity',
    title: 'Gravity',
    description: 'Gravity simulation with cursor interactions',
    component: GravitySection,
    enabled: true,
  },
  'content-reveal': {
    id: 'content-reveal',
    name: 'Content Reveal',
    title: 'Content Reveal',
    description: 'Content reveal effects with cursor',
    component: ContentRevealSection,
    enabled: true,
  },
  'entry-animation': {
    id: 'entry-animation',
    name: 'Entry Animation',
    title: 'Entry Animation',
    description: 'Entry animations triggered by cursor',
    component: EntryAnimationSection,
    enabled: true,
  },
  paint: {
    id: 'paint',
    name: 'Paint',
    title: 'Paint',
    description: 'Paint and drawing with cursor',
    component: PaintSection,
    enabled: true,
  },
  gallery: {
    id: 'gallery',
    name: 'Gallery',
    title: 'Gallery',
    description: 'Image gallery with cursor interactions',
    component: GallerySection,
    enabled: true,
  },
};

// Helper functions for the registry
export const getAllSections = (): SectionConfig[] => {
  return Object.values(SECTIONS).filter(section => section.enabled !== false);
};

export const getSection = (id: string): SectionConfig | undefined => {
  return SECTIONS[id];
};

export const getSectionComponent = (id: string): React.FC<{ onDebugData?: (data: Record<string, unknown>) => void }> | undefined => {
  const section = getSection(id);
  return section?.component;
};

export const addSection = (config: SectionConfig): void => {
  SECTIONS[config.id] = config;
};

// Navigation sections for the header
export const getNavigationSections = () => {
  return getAllSections().map(({ id, title }) => ({ id, title }));
}; 