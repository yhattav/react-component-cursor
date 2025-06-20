// Demo cursor types
type DemoCursorMode = 'glow' | 'emoji' | 'trail' | 'particle' | 'default';

// Available emoji options for the emoji cursor
const AVAILABLE_EMOJIS = ['🎯', '⭐', '🚀', '🎨', '🔥', '💎', '🌟', '✨'] as const;

// Hero cursor cycle interval
const HERO_CURSOR_CYCLE_INTERVAL = 2000;

// Animation durations
const ANIMATION_DURATIONS = {
  hero: 1000,
  section: 800,
  stagger: 200,
} as const;

// Performance metrics for display
const PERFORMANCE_METRICS = {
  fps: 60,
  memory: '< 2MB',
  bundle: '8.2KB',
} as const;

// Social proof stats
const SOCIAL_PROOF = {
  stars: '50+ GitHub Stars',
  downloads: '1,000+ Downloads',
  status: 'Production Ready',
} as const;

export {
  AVAILABLE_EMOJIS,
  HERO_CURSOR_CYCLE_INTERVAL,
  ANIMATION_DURATIONS,
  PERFORMANCE_METRICS,
  SOCIAL_PROOF,
};

export type { DemoCursorMode }; 