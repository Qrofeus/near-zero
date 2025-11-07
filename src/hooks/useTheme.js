import { useState, useEffect } from 'react';
import {
  getThemePreference,
  setThemePreference,
  resolveTheme,
  applyTheme,
  THEME_MODES,
} from '../utils/theme';

/**
 * Hook for managing theme state and system preference changes
 * @returns {{
 *   themePreference: 'light' | 'dark' | 'system',
 *   resolvedTheme: 'light' | 'dark',
 *   setTheme: (theme: 'light' | 'dark' | 'system') => void
 * }}
 */
export function useTheme() {
  const [themePreference, setThemePreferenceState] = useState(() => getThemePreference());
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(themePreference));

  // Apply theme on mount and when preference changes
  useEffect(() => {
    applyTheme(themePreference);
    setResolvedTheme(resolveTheme(themePreference));
  }, [themePreference]);

  // Listen to system theme changes when preference is 'system'
  useEffect(() => {
    if (themePreference !== THEME_MODES.SYSTEM) {
      return;
    }

    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      const newTheme = e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      setResolvedTheme(newTheme);
      applyTheme(THEME_MODES.SYSTEM);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themePreference]);

  const setTheme = (theme) => {
    setThemePreference(theme);
    setThemePreferenceState(theme);
  };

  return {
    themePreference,
    resolvedTheme,
    setTheme,
  };
}
