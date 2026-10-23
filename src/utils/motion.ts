/**
 * Shared Motion System
 * Governs all screen transitions, piece springs, button squashes, and gem collection arcs.
 * Targets 60fps via compositor-only properties (transform, opacity, filter).
 */

export const MOTION_TIMINGS = {
  instant: 0.08,
  micro: 0.15,
  settle: 0.25,
  transition: 0.45,
  gemCollection: 1.1,
};

export const MOTION_EASINGS = {
  snappy: [0.16, 1, 0.3, 1] as const, // CSS cubic-bezier
  bounce: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
};

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Framer Motion / Motion library variants
export const screenTransitionVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'brightness(0.7)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'brightness(1)',
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'brightness(1.2)',
    transition: {
      duration: prefersReducedMotion() ? 0.1 : 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const buttonMotionProps = {
  whileHover: prefersReducedMotion() ? {} : { y: -2, scale: 1.02 },
  whileTap: prefersReducedMotion() ? {} : { y: 2, scale: 0.98 },
  transition: { duration: 0.08, ease: 'easeOut' },
};

export const puzzlePieceVariants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.03,
    y: -2,
    transition: { duration: 0.1 },
  },
  tap: {
    scale: 0.97,
    y: 1,
    transition: { duration: 0.05 },
  },
  wobble: {
    x: [0, -6, 6, -4, 4, -2, 0],
    transition: { duration: 0.35, ease: 'easeInOut' },
  },
  snap: {
    scale: [1, 1.1, 1],
    filter: ['brightness(1)', 'brightness(1.6)', 'brightness(1)'],
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const gemCollectVariants = {
  initial: {
    scale: 0,
    y: 0,
    opacity: 0,
  },
  emerge: {
    scale: [0, 1.3, 1.1],
    y: [0, -30, -20],
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  travelToHud: {
    scale: [1.1, 0.8, 0.9],
    y: -240,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};
