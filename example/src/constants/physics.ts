import { StarTemplate, GravityPoint } from '../types/star';

// Split settings into production and dev
export const PHYSICS_CONFIG = {
  // Production settings
  NEW_PARTICLE_MASS: 0.1,
  FRICTION: 0.999,
  POINTER_MASS: 50000,
  // Dev settings
  DELTA_TIME: 1 / 60,
} as const;

// Metadata about which settings are dev-only
export const SETTINGS_METADATA = {
  NEW_PARTICLE_MASS: { isDev: false },
  FRICTION: { isDev: false },
  POINTER_MASS: { isDev: false },
  DELTA_TIME: { isDev: true },
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

export const INITIAL_GRAVITY_POINTS: GravityPoint[] = [
  { x: 700, y: 700, label: 'Heavy', mass: 50000, color: '#FF6B6B' },
  { x: 500, y: 150, label: 'Medium', mass: 30000, color: '#4ECDC4' },
  { x: 350, y: 250, label: 'Light', mass: 10000, color: '#45B7D1' },
];
