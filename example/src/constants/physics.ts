import { StarTemplate } from '../types/star';

export const PHYSICS_CONFIG = {
  CURSOR_MASS: 0.1,
  FRICTION: 0.999,
  DELTA_TIME: 1 / 60,
  POINTER_MASS: 50000,
} as const;

export const PARTICLE_MODES = {
  NORMAL: { mass: 0.1, size: 20, color: '#666' },
  HEAVY: { mass: 1.0, size: 30, color: '#FF5252' },
  LIGHT: { mass: 0.05, size: 15, color: '#4CAF50' },
} as const;

export const STAR_TEMPLATES: StarTemplate[] = [
  {
    label: 'Supergiant',
    mass: 50000,
    color: '#FF6B6B',
    size: 24,
    icon: '★',
  },
  {
    label: 'Giant',
    mass: 30000,
    color: '#4ECDC4',
    size: 20,
    icon: '⭐',
  },
  {
    label: 'Dwarf',
    mass: 10000,
    color: '#45B7D1',
    size: 16,
    icon: '✦',
  },
];
