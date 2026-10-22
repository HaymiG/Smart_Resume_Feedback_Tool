// Design system constants for the Smart Resume Feedback Tool
// Human-centered, harmonious color system with consistent temperature

export const colors = {
  // Base colors - using CSS variables for theme support
  text: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textTertiary: 'var(--text-tertiary)',
  background: 'var(--bg-primary)',
  surface: 'var(--bg-surface)',
  surfaceStrong: 'var(--bg-surface-strong)',
  surfaceSubtle: 'var(--bg-surface-subtle)',

  // Primary brand color (teal-green) - consistent cool temperature
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primaryActive: 'var(--color-primary-active)',
  primarySubtle: 'var(--color-primary-subtle)',
  primaryText: 'var(--color-primary-text)',

  // Success (green) - warmer than primary for harmony
  success: 'var(--color-success)',
  successHover: 'var(--color-success-hover)',
  successSubtle: 'var(--color-success-subtle)',
  successText: 'var(--color-success-text)',

  // Warning (amber) - warm, friendly
  warning: 'var(--color-warning)',
  warningHover: 'var(--color-warning-hover)',
  warningSubtle: 'var(--color-warning-subtle)',
  warningText: 'var(--color-warning-text)',

  // Error (red) - warmer red, less harsh
  error: 'var(--color-error)',
  errorHover: 'var(--color-error-hover)',
  errorSubtle: 'var(--color-error-subtle)',
  errorText: 'var(--color-error-text)',

  // UI elements
  border: 'var(--border-subtle)',
  borderHover: 'var(--border-default)',
  borderStrong: 'var(--border-strong)',
  borderFocus: 'var(--border-focus)',

  // Shadows - softer, more natural
  shadowSm: 'var(--shadow-sm)',
  shadowMd: 'var(--shadow-md)',
  shadowLg: 'var(--shadow-lg)',
  shadowXl: 'var(--shadow-xl)',

  // Focus
  focusRing: 'var(--focus-ring)',

  // Overlay
  overlay: 'var(--overlay-bg)',

  // Score-specific colors (for the circular progress)
  scoreLow: 'var(--color-error)',
  scoreMid: 'var(--color-warning)',
  scoreHigh: 'var(--color-success)',
} as const;

export const typography = {
  // Font families - more personality, still system-friendly
  heading: '"Segoe UI Variable", "SF Pro Display", "Inter", system-ui, sans-serif',
  body: '"Segoe UI Variable", "SF Pro Text", "Inter", system-ui, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',

  // Font sizes - better rhythm, fewer sizes
  size: {
    xs: '0.75rem',    // 12px - captions, labels
    sm: '0.875rem',   // 14px - small body
    base: '1rem',     // 16px - body
    lg: '1.125rem',   // 18px - large body / small heading
    xl: '1.5rem',     // 24px - section heading
    '2xl': '2rem',    // 32px - page heading
    '3xl': '2.5rem',  // 40px - hero
    '4xl': '3.5rem',  // 56px - score display
  },

  // Font weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights - generous for readability
  lineHeight: {
    tight: 1.15,     // Large headings
    snug: 1.3,       // Medium headings
    normal: 1.5,     // Body text
    relaxed: 1.65,   // Long-form content
    loose: 1.8,      // Extra spacious
  },

  // Letter spacing
  tracking: {
    tighter: '-0.03em',  // Large headings
    tight: '-0.01em',    // Medium headings
    normal: '0',         // Body
    wide: '0.02em',      // Small caps / labels
    wider: '0.08em',     // Button text, all caps
  },
} as const;

export const spacing = {
  // 4px base unit - more granular
  '0': '0',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '5': '1.25rem',  // 20px
  '6': '1.5rem',   // 24px
  '8': '2rem',     // 32px
  '10': '2.5rem',  // 40px
  '12': '3rem',    // 48px
  '16': '4rem',    // 64px
  '20': '5rem',    // 80px
} as const;

export const borderRadius = {
  // More organic, less "rounded everything"
  none: '0',
  sm: '6px',       // Small elements (chips, badges)
  md: '10px',      // Buttons, inputs
  lg: '14px',      // Cards, panels
  xl: '18px',      // Large cards
  '2xl': '24px',   // Modal, major sections
  full: '9999px',  // Pills, avatars
  organic: '16px 16px 16px 16px',  // Slightly imperfect feel
} as const;

export const animation = {
  duration: {
    instant: '50ms',
    fast: '120ms',
    normal: '200ms',
    slow: '300ms',
    slower: '450ms',
  },
  easing: {
    // More natural, less mechanical
    easeOut: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Subtle spring for delightful moments
    spring: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
    // Gentle deceleration
    gentle: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 100,
  toast: 200,
  tooltip: 300,
} as const;

// Breakpoints for reference
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Icon sizes
export const iconSize = {
  xs: '0.75rem',   // 12px
  sm: '1rem',      // 16px
  md: '1.25rem',   // 20px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
} as const;