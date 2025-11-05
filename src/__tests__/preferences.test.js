/**
 * Tests for preferences storage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSortMode,
  setSortMode,
  SORT_MODES,
} from '../utils/preferences';
import { STORAGE_KEYS } from '../utils/storage';

describe('preferences storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  describe('getSortMode', () => {
    it('returns default sort mode (deadline) when no preference saved', () => {
      const sortMode = getSortMode();
      expect(sortMode).toBe(SORT_MODES.DEADLINE);
    });

    it('returns saved sort mode from localStorage', () => {
      // Manually set preference
      window.localStorage.setItem(
        STORAGE_KEYS.PREFS,
        JSON.stringify({ sortMode: SORT_MODES.PRIORITY })
      );

      const sortMode = getSortMode();
      expect(sortMode).toBe(SORT_MODES.PRIORITY);
    });

    it('returns default if localStorage contains invalid data', () => {
      // Set invalid data
      window.localStorage.setItem(STORAGE_KEYS.PREFS, 'invalid json');

      const sortMode = getSortMode();
      expect(sortMode).toBe(SORT_MODES.DEADLINE);
    });

    it('returns default if sortMode is invalid', () => {
      // Set invalid sort mode
      window.localStorage.setItem(
        STORAGE_KEYS.PREFS,
        JSON.stringify({ sortMode: 'invalid' })
      );

      const sortMode = getSortMode();
      expect(sortMode).toBe(SORT_MODES.DEADLINE);
    });
  });

  describe('setSortMode', () => {
    it('saves sort mode to localStorage', () => {
      const result = setSortMode(SORT_MODES.PRIORITY);

      expect(result).toBe(true);

      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.PREFS));
      expect(saved.sortMode).toBe(SORT_MODES.PRIORITY);
    });

    it('updates existing preferences without overwriting other settings', () => {
      // Set initial preferences with other settings
      window.localStorage.setItem(
        STORAGE_KEYS.PREFS,
        JSON.stringify({ sortMode: SORT_MODES.DEADLINE, density: 'compact' })
      );

      setSortMode(SORT_MODES.PRIORITY);

      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.PREFS));
      expect(saved.sortMode).toBe(SORT_MODES.PRIORITY);
      expect(saved.density).toBe('compact'); // Should preserve existing settings
    });

    it('rejects invalid sort mode', () => {
      const result = setSortMode('invalid');

      expect(result).toBe(false);

      // Should not save anything
      const saved = window.localStorage.getItem(STORAGE_KEYS.PREFS);
      expect(saved).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {
          throw new Error('Storage error');
        });

      const result = setSortMode(SORT_MODES.PRIORITY);
      expect(result).toBe(false);

      // Restore original
      setItemSpy.mockRestore();
    });
  });
});
