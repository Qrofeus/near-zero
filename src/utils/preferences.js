/**
 * User preferences storage and retrieval
 * Manages sort mode and other user settings in NINAD_PREFS_V1
 */

import { getFromStorage, saveToStorage, STORAGE_KEYS } from './storage';
import { SORT_MODES } from './sorting';

/**
 * Get current sort mode preference
 * @returns {string} Sort mode (defaults to SORT_MODES.DEADLINE)
 */
export function getSortMode() {
  const prefs = getFromStorage(STORAGE_KEYS.PREFS, {});

  // Validate sort mode
  const sortMode = prefs.sortMode;
  if (sortMode === SORT_MODES.DEADLINE || sortMode === SORT_MODES.PRIORITY) {
    return sortMode;
  }

  // Default to deadline sort
  return SORT_MODES.DEADLINE;
}

/**
 * Save sort mode preference
 * @param {string} sortMode - Sort mode (SORT_MODES.DEADLINE or SORT_MODES.PRIORITY)
 * @returns {boolean} Success status
 */
export function setSortMode(sortMode) {
  // Validate sort mode
  if (sortMode !== SORT_MODES.DEADLINE && sortMode !== SORT_MODES.PRIORITY) {
    console.error('Invalid sort mode:', sortMode);
    return false;
  }

  try {
    // Get existing preferences
    const prefs = getFromStorage(STORAGE_KEYS.PREFS, {});

    // Update sort mode
    prefs.sortMode = sortMode;

    // Save back to storage
    return saveToStorage(STORAGE_KEYS.PREFS, prefs);
  } catch (error) {
    console.error('Error saving sort mode:', error);
    return false;
  }
}

// Re-export SORT_MODES for convenience
export { SORT_MODES };
