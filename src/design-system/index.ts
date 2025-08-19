// Design System Entry Point
// Re-exports for all design system components and utilities

// Note: CSS files are imported in globals.css, not exported here
// This file is for future TypeScript utilities and constants

export const DESIGN_TOKENS = {
  colors: {
    primary: {
      red: 'var(--color-primary-red)',
      blue: 'var(--color-primary-blue)',
    },
    semantic: {
      bg: 'var(--color-bg)',
      fg: 'var(--color-fg)',
      muted: 'var(--color-muted)',
      border: 'var(--color-border)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)',
    },
  },
  spacing: {
    xs: 'var(--space-1)',
    sm: 'var(--space-2)',
    md: 'var(--space-4)',
    lg: 'var(--space-6)',
    xl: 'var(--space-8)',
    '2xl': 'var(--space-12)',
  },
  typography: {
    fontSizes: {
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      '2xl': 'var(--text-2xl)',
      '3xl': 'var(--text-3xl)',
      '4xl': 'var(--text-4xl)',
    },
  },
} as const;
