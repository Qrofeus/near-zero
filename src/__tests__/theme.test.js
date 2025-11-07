import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getThemePreference,
  setThemePreference,
  getSystemTheme,
  resolveTheme,
  applyTheme,
  THEME_MODES,
} from '../utils/theme';

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('THEME_MODES', () => {
    it('should define all theme modes', () => {
      expect(THEME_MODES).toEqual({
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system',
      });
    });
  });

  describe('getThemePreference', () => {
    it('should return system as default when no preference exists', () => {
      expect(getThemePreference()).toBe('system');
    });

    it('should return stored theme preference', () => {
      localStorage.setItem('NINAD_PREFS_V1', JSON.stringify({ theme: 'dark' }));
      expect(getThemePreference()).toBe('dark');
    });

    it('should return system if stored preference is invalid', () => {
      localStorage.setItem('NINAD_PREFS_V1', JSON.stringify({ theme: 'invalid' }));
      expect(getThemePreference()).toBe('system');
    });

    it('should return system if localStorage data is corrupted', () => {
      localStorage.setItem('NINAD_PREFS_V1', 'invalid json');
      expect(getThemePreference()).toBe('system');
    });

    it('should return system if theme key is missing', () => {
      localStorage.setItem('NINAD_PREFS_V1', JSON.stringify({ sortMode: 'deadline' }));
      expect(getThemePreference()).toBe('system');
    });
  });

  describe('setThemePreference', () => {
    it('should save theme preference to localStorage', () => {
      setThemePreference('dark');
      const prefs = JSON.parse(localStorage.getItem('NINAD_PREFS_V1'));
      expect(prefs.theme).toBe('dark');
    });

    it('should preserve existing preferences', () => {
      localStorage.setItem('NINAD_PREFS_V1', JSON.stringify({ sortMode: 'deadline', density: 'comfortable' }));
      setThemePreference('light');
      const prefs = JSON.parse(localStorage.getItem('NINAD_PREFS_V1'));
      expect(prefs.theme).toBe('light');
      expect(prefs.sortMode).toBe('deadline');
      expect(prefs.density).toBe('comfortable');
    });

    it('should handle localStorage write errors gracefully', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => setThemePreference('dark')).not.toThrow();
      setItemSpy.mockRestore();
    });

    it('should only accept valid theme values', () => {
      setThemePreference('invalid');
      const prefs = JSON.parse(localStorage.getItem('NINAD_PREFS_V1') || '{}');
      expect(prefs.theme).toBeUndefined();
    });
  });

  describe('getSystemTheme', () => {
    it('should return dark when system prefers dark', () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
      vi.stubGlobal('matchMedia', matchMediaMock);
      expect(getSystemTheme()).toBe('dark');
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      vi.unstubAllGlobals();
    });

    it('should return light when system prefers light', () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: false });
      vi.stubGlobal('matchMedia', matchMediaMock);
      expect(getSystemTheme()).toBe('light');
      vi.unstubAllGlobals();
    });

    it('should return light when matchMedia is not supported', () => {
      vi.stubGlobal('matchMedia', undefined);
      expect(getSystemTheme()).toBe('light');
      vi.unstubAllGlobals();
    });
  });

  describe('resolveTheme', () => {
    it('should return light when preference is light', () => {
      expect(resolveTheme('light')).toBe('light');
    });

    it('should return dark when preference is dark', () => {
      expect(resolveTheme('dark')).toBe('dark');
    });

    it('should resolve system preference to actual theme', () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
      vi.stubGlobal('matchMedia', matchMediaMock);
      expect(resolveTheme('system')).toBe('dark');
      vi.unstubAllGlobals();
    });

    it('should default to light for invalid preference', () => {
      expect(resolveTheme('invalid')).toBe('light');
    });
  });

  describe('applyTheme', () => {
    it('should set data-theme attribute on document element for light', () => {
      applyTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should set data-theme attribute on document element for dark', () => {
      applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should resolve system theme before applying', () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
      vi.stubGlobal('matchMedia', matchMediaMock);
      applyTheme('system');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      vi.unstubAllGlobals();
    });

    it('should default to light for invalid theme', () => {
      applyTheme('invalid');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });
});
