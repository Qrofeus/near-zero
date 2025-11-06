/**
 * Color Constants
 * Centralized color definitions for consistent theming across the application
 */

// Primary colors
export const COLORS = {
  // Brand/Action colors
  primary: '#007bff',      // Blue - primary actions, links
  success: '#28a745',      // Green - success, complete actions
  danger: '#dc3545',       // Red - danger, delete, high priority
  warning: '#ffc107',      // Yellow - warning, medium priority

  // Priority colors
  priorityHigh: '#dc3545',    // Red
  priorityMedium: '#ffc107',  // Yellow
  priorityLow: '#28a745',     // Green
  priorityDefault: '#6c757d', // Gray

  // Text colors
  textDark: '#333',        // Primary text, headings
  textMedium: '#555',      // Secondary text
  textLight: '#666',       // Tertiary text
  textLighter: '#777',     // Quaternary text
  textGray: '#374151',     // Dark gray text

  // Border colors
  borderLight: '#ddd',     // Light borders
  borderMedium: '#ccc',    // Medium borders

  // Background colors
  bgWhite: 'white',
  bgLightGray: '#f0f0f0',  // Very light gray background
  bgOffWhite: '#f9f9f9',   // Off-white background
  bgPaleGray: '#f5f5f5',   // Pale gray background
  bgGray: '#e5e7eb',       // Light gray background
  bgTransparent: 'transparent',

  // Scrollbar colors
  scrollbarThumb: '#ccc',
  scrollbarTrack: '#f5f5f5'
};

// Semantic color mappings for easier usage
export const SEMANTIC_COLORS = {
  button: {
    primary: COLORS.primary,
    success: COLORS.success,
    danger: COLORS.danger,
    warning: COLORS.warning,
    neutral: COLORS.bgGray
  },
  text: {
    primary: COLORS.textDark,
    secondary: COLORS.textMedium,
    tertiary: COLORS.textLight,
    disabled: COLORS.textLighter
  },
  border: {
    default: COLORS.borderLight,
    focus: COLORS.primary
  }
};

export default COLORS;
