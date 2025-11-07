/**
 * Theme management utilities
 * Handles light/dark/system theme modes with localStorage persistence
 */

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

const VALID_THEMES = [THEME_MODES.LIGHT, THEME_MODES.DARK, THEME_MODES.SYSTEM];

/**
 * Get theme preference from localStorage
 * @returns {'light' | 'dark' | 'system'} Theme preference, defaults to 'system'
 */
export function getThemePreference() {
  try {
    const prefs = localStorage.getItem('NINAD_PREFS_V1');
    if (!prefs) return THEME_MODES.SYSTEM;

    const parsed = JSON.parse(prefs);
    const theme = parsed.theme;

    if (!theme || !VALID_THEMES.includes(theme)) {
      return THEME_MODES.SYSTEM;
    }

    return theme;
  } catch (error) {
    console.error('Error reading theme preference:', error);
    return THEME_MODES.SYSTEM;
  }
}

/**
 * Save theme preference to localStorage
 * @param {'light' | 'dark' | 'system'} theme - Theme to save
 */
export function setThemePreference(theme) {
  // Validate theme value
  if (!VALID_THEMES.includes(theme)) {
    console.warn(`Invalid theme: ${theme}`);
    return;
  }

  try {
    const prefs = localStorage.getItem('NINAD_PREFS_V1');
    const existing = prefs ? JSON.parse(prefs) : {};
    existing.theme = theme;
    localStorage.setItem('NINAD_PREFS_V1', JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving theme preference:', error);
  }
}

/**
 * Detect system theme preference
 * @returns {'light' | 'dark'} System theme preference
 */
export function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return THEME_MODES.LIGHT;
  }

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return darkModeQuery.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
}

/**
 * Resolve theme preference to actual theme
 * @param {'light' | 'dark' | 'system'} preference - Theme preference
 * @returns {'light' | 'dark'} Resolved theme
 */
export function resolveTheme(preference) {
  if (preference === THEME_MODES.LIGHT) return THEME_MODES.LIGHT;
  if (preference === THEME_MODES.DARK) return THEME_MODES.DARK;
  if (preference === THEME_MODES.SYSTEM) return getSystemTheme();
  return THEME_MODES.LIGHT; // Default fallback
}

/**
 * Apply theme to document
 * @param {'light' | 'dark' | 'system'} theme - Theme to apply
 */
export function applyTheme(theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.setAttribute('data-theme', resolved);
}
