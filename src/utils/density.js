/**
 * Density/layout control utilities
 * Manages task list display density (compact/comfortable/spacious)
 */

import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storage';

/**
 * Density modes for task list display
 */
export const DENSITY_MODES = {
  COMPACT: 'compact',      // 3 columns (requires 980px+ viewport)
  COMFORTABLE: 'comfortable', // 2 columns (requires 760px+ viewport)
  SPACIOUS: 'spacious'     // 1 column (always available)
};

/**
 * Get current density preference
 * @returns {string} Density mode (defaults to COMFORTABLE)
 */
export function getDensity() {
  try {
    const prefs = getFromStorage(STORAGE_KEYS.PREFS, {});
    const density = prefs.density;

    // Validate density mode
    if (
      density === DENSITY_MODES.COMPACT ||
      density === DENSITY_MODES.COMFORTABLE ||
      density === DENSITY_MODES.SPACIOUS
    ) {
      return density;
    }

    // Default to comfortable
    return DENSITY_MODES.COMFORTABLE;
  } catch (error) {
    console.error('Error getting density:', error);
    return DENSITY_MODES.COMFORTABLE;
  }
}

/**
 * Save density preference
 * @param {string} density - Density mode
 * @returns {boolean} Success status
 */
export function setDensity(density) {
  // Validate density mode
  if (
    density !== DENSITY_MODES.COMPACT &&
    density !== DENSITY_MODES.COMFORTABLE &&
    density !== DENSITY_MODES.SPACIOUS
  ) {
    console.error('Invalid density mode:', density);
    return false;
  }

  try {
    // Get existing preferences
    const prefs = getFromStorage(STORAGE_KEYS.PREFS, {});

    // Update density
    prefs.density = density;

    // Save back to storage
    return saveToStorage(STORAGE_KEYS.PREFS, prefs);
  } catch (error) {
    console.error('Error saving density:', error);
    return false;
  }
}

