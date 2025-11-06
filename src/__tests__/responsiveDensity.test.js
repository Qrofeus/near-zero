/**
 * Tests for responsive density calculation
 */

import { describe, it, expect } from 'vitest';
import {
  getAvailableDensities,
  shouldDemoteDensity,
  getDemotedDensity
} from '../utils/responsiveDensity';
import { DENSITY_MODES } from '../utils/density';

describe('responsiveDensity', () => {
  describe('getAvailableDensities', () => {
    it('should return all densities for wide viewport (>= 980px)', () => {
      const result = getAvailableDensities(1000);
      expect(result).toEqual([
        DENSITY_MODES.COMPACT,
        DENSITY_MODES.COMFORTABLE,
        DENSITY_MODES.SPACIOUS
      ]);
    });

    it('should return comfortable and spacious for medium viewport (760-979px)', () => {
      const result = getAvailableDensities(860);
      expect(result).toEqual([
        DENSITY_MODES.COMFORTABLE,
        DENSITY_MODES.SPACIOUS
      ]);
    });

    it('should return only spacious for narrow viewport (< 760px)', () => {
      const result = getAvailableDensities(700);
      expect(result).toEqual([DENSITY_MODES.SPACIOUS]);
    });

    it('should handle boundary at 980px (compact threshold)', () => {
      expect(getAvailableDensities(980)).toContain(DENSITY_MODES.COMPACT);
      expect(getAvailableDensities(979)).not.toContain(DENSITY_MODES.COMPACT);
    });

    it('should handle boundary at 760px (comfortable threshold)', () => {
      expect(getAvailableDensities(760)).toContain(DENSITY_MODES.COMFORTABLE);
      expect(getAvailableDensities(759)).not.toContain(DENSITY_MODES.COMFORTABLE);
    });
  });

  describe('shouldDemoteDensity', () => {
    it('should return false when current density is available', () => {
      const available = [DENSITY_MODES.COMPACT, DENSITY_MODES.COMFORTABLE, DENSITY_MODES.SPACIOUS];
      expect(shouldDemoteDensity(DENSITY_MODES.COMPACT, available)).toBe(false);
    });

    it('should return true when current density is not available', () => {
      const available = [DENSITY_MODES.COMFORTABLE, DENSITY_MODES.SPACIOUS];
      expect(shouldDemoteDensity(DENSITY_MODES.COMPACT, available)).toBe(true);
    });

    it('should return false when spacious is always available', () => {
      const available = [DENSITY_MODES.SPACIOUS];
      expect(shouldDemoteDensity(DENSITY_MODES.SPACIOUS, available)).toBe(false);
    });
  });

  describe('getDemotedDensity', () => {
    it('should demote compact to comfortable when available', () => {
      const available = [DENSITY_MODES.COMFORTABLE, DENSITY_MODES.SPACIOUS];
      expect(getDemotedDensity(DENSITY_MODES.COMPACT, available)).toBe(DENSITY_MODES.COMFORTABLE);
    });

    it('should demote compact to spacious when comfortable unavailable', () => {
      const available = [DENSITY_MODES.SPACIOUS];
      expect(getDemotedDensity(DENSITY_MODES.COMPACT, available)).toBe(DENSITY_MODES.SPACIOUS);
    });

    it('should demote comfortable to spacious', () => {
      const available = [DENSITY_MODES.SPACIOUS];
      expect(getDemotedDensity(DENSITY_MODES.COMFORTABLE, available)).toBe(DENSITY_MODES.SPACIOUS);
    });

    it('should return current density if already available', () => {
      const available = [DENSITY_MODES.COMPACT, DENSITY_MODES.COMFORTABLE, DENSITY_MODES.SPACIOUS];
      expect(getDemotedDensity(DENSITY_MODES.COMPACT, available)).toBe(DENSITY_MODES.COMPACT);
    });

    it('should fallback to spacious if nothing available', () => {
      const available = [];
      expect(getDemotedDensity(DENSITY_MODES.COMPACT, available)).toBe(DENSITY_MODES.SPACIOUS);
    });
  });
});
