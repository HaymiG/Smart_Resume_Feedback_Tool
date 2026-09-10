// Design system constants for the Smart Resume Feedback Tool

export const colors = {
  // Base colors
  text: '#0A0A0A',        // Near-black for primary text
  background: '#FAFAF8',  // Warm off-white background
  muted: '#6B7280',       // Gray for secondary text
  
  // Accent colors
  emerald: '#0F766E',     // Primary accent (success, CTAs)
  amber: '#B45309',       // Warning/moderate scores
  red: '#DC2626',         // Error/low scores
  
  // UI elements
  border: 'rgba(10, 10, 10, 0.08)',      // Hairline borders
  borderHover: 'rgba(10, 10, 10, 0.12)', // Hover state borders
  shadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Soft shadow
  shadowLight: '0 1px 2px rgba(0, 0, 0, 0.05)', // Light shadow
  
  // Error states
  errorBg: '#FEE2E2',     // Error banner background
  errorText: '#991B1B',   // Error banner text
} as const;

export const typography = {
  // Font families
  heading: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  
  // Font sizes
  size: {
    xs: '12px',   // Subtext
    sm: '14px',   // Small body text
    base: '16px', // Default body text
    lg: '20px',   // Section headings
    xl: '24px',   // Page headings
    '2xl': '32px', // Hero text
    '4xl': '48px', // Score numbers
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,   // Headings
    normal: 1.5,  // Default
    relaxed: 1.6, // Body text with lots of content
  },
  
  // Letter spacing
  tracking: {
    tighter: '-0.02em', // Large headings
    normal: '0',
    wide: '0.01em',     // All caps
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
} as const;
