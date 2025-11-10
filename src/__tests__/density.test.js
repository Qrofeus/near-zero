/**
 * Tests for density/layout utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DENSITY_MODES,
  getDensity,
  setDensity
} from '../utils/density';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// eslint-disable-next-line no-undef
global.localStorage = localStorageMock;

describe('Density Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('DENSITY_MODES', () => {
    it('defines all density modes', () => {
      expect(DENSITY_MODES).toHaveProperty('COMPACT');
      expect(DENSITY_MODES).toHaveProperty('COMFORTABLE');
      expect(DENSITY_MODES).toHaveProperty('SPACIOUS');
    });

    it('has string values', () => {
      expect(typeof DENSITY_MODES.COMPACT).toBe('string');
      expect(typeof DENSITY_MODES.COMFORTABLE).toBe('string');
      expect(typeof DENSITY_MODES.SPACIOUS).toBe('string');
    });
  });

  describe('getDensity', () => {
    it('returns default density when no preference saved', () => {
      const density = getDensity();
      expect(density).toBe(DENSITY_MODES.COMFORTABLE);
    });

    it('returns saved density preference', () => {
      localStorageMock.setItem(
        'NINAD_PREFS_V1',
        JSON.stringify({ density: DENSITY_MODES.COMPACT })
      );

      const density = getDensity();
      expect(density).toBe(DENSITY_MODES.COMPACT);
    });

    it('returns default for invalid density value', () => {
      localStorageMock.setItem(
        'NINAD_PREFS_V1',
        JSON.stringify({ density: 'INVALID_MODE' })
      );

      const density = getDensity();
      expect(density).toBe(DENSITY_MODES.COMFORTABLE);
    });

    it('handles corrupted localStorage data', () => {
      localStorageMock.setItem('NINAD_PREFS_V1', 'invalid json{');

      const density = getDensity();
      expect(density).toBe(DENSITY_MODES.COMFORTABLE);
    });
  });

  describe('setDensity', () => {
    it('saves compact density preference', () => {
      const result = setDensity(DENSITY_MODES.COMPACT);

      expect(result).toBe(true);
      const saved = JSON.parse(localStorageMock.getItem('NINAD_PREFS_V1'));
      expect(saved.density).toBe(DENSITY_MODES.COMPACT);
    });

    it('saves comfortable density preference', () => {
      const result = setDensity(DENSITY_MODES.COMFORTABLE);

      expect(result).toBe(true);
      const saved = JSON.parse(localStorageMock.getItem('NINAD_PREFS_V1'));
      expect(saved.density).toBe(DENSITY_MODES.COMFORTABLE);
    });

    it('saves spacious density preference', () => {
      const result = setDensity(DENSITY_MODES.SPACIOUS);

      expect(result).toBe(true);
      const saved = JSON.parse(localStorageMock.getItem('NINAD_PREFS_V1'));
      expect(saved.density).toBe(DENSITY_MODES.SPACIOUS);
    });

    it('preserves other preferences when saving density', () => {
      localStorageMock.setItem(
        'NINAD_PREFS_V1',
        JSON.stringify({ sortMode: 'priority', otherSetting: 'value' })
      );

      setDensity(DENSITY_MODES.COMPACT);

      const saved = JSON.parse(localStorageMock.getItem('NINAD_PREFS_V1'));
      expect(saved.sortMode).toBe('priority');
      expect(saved.otherSetting).toBe('value');
      expect(saved.density).toBe(DENSITY_MODES.COMPACT);
    });

    it('rejects invalid density mode', () => {
      const result = setDensity('INVALID_MODE');

      expect(result).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('returns false on storage error', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = setDensity(DENSITY_MODES.COMPACT);
      expect(result).toBe(false);
    });
  });

});
