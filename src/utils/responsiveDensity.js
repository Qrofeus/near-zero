/**
 * Responsive density utilities
 * Calculates available density modes based on viewport width
 */

import { DENSITY_MODES } from './density';

/**
 * Width thresholds for density modes
 *
 * Items use width: 100% to fill grid tracks
 * Minimum comfortable widths to avoid cramped layout:
 * - 3 columns: 300px each (content + padding looks good)
 * - 2 columns: 350px each (comfortable reading width)
 *
 * Calculation:
 * - COMPACT (3 cols): 3 × 300 + 2 × 20 (gaps) + 40 (container padding) = 980px
 * - COMFORTABLE (2 cols): 2 × 350 + 1 × 20 (gap) + 40 (container padding) = 760px
 * - SPACIOUS: always available
 */
const WIDTH_THRESHOLDS = {
  COMPACT: 980,
  COMFORTABLE: 760
};

/**
 * Get available density modes for given viewport width
 * @param {number} width - Viewport width in pixels
 * @returns {Array<string>} Available density modes
 */
export function getAvailableDensities(width) {
  const available = [];

  if (width >= WIDTH_THRESHOLDS.COMPACT) {
    available.push(DENSITY_MODES.COMPACT);
  }

  if (width >= WIDTH_THRESHOLDS.COMFORTABLE) {
    available.push(DENSITY_MODES.COMFORTABLE);
  }

  // Spacious is always available
  available.push(DENSITY_MODES.SPACIOUS);

  return available;
}

/**
 * Check if current density should be demoted
 * @param {string} currentDensity - Current density mode
 * @param {Array<string>} availableDensities - Available density modes
 * @returns {boolean} True if demotion needed
 */
export function shouldDemoteDensity(currentDensity, availableDensities) {
  return !availableDensities.includes(currentDensity);
}

/**
 * Get demoted density mode
 * @param {string} currentDensity - Current density mode
 * @param {Array<string>} availableDensities - Available density modes
 * @returns {string} Demoted density mode
 */
export function getDemotedDensity(currentDensity, availableDensities) {
  // If current density is available, keep it
  if (availableDensities.includes(currentDensity)) {
    return currentDensity;
  }

  // Demotion order: COMPACT → COMFORTABLE → SPACIOUS
  if (currentDensity === DENSITY_MODES.COMPACT) {
    if (availableDensities.includes(DENSITY_MODES.COMFORTABLE)) {
      return DENSITY_MODES.COMFORTABLE;
    }
    return DENSITY_MODES.SPACIOUS;
  }

  if (currentDensity === DENSITY_MODES.COMFORTABLE) {
    return DENSITY_MODES.SPACIOUS;
  }

  // Fallback to spacious
  return DENSITY_MODES.SPACIOUS;
}
