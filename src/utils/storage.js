/**
 * localStorage utility module
 * Handles all localStorage operations with error handling and backup
 */

const STORAGE_KEYS = {
  TASKS: 'NINAD_TASKS_V1',
  PREFS: 'NINAD_PREFS_V1',
  BACKUP: 'NINAD_TASKS_BACKUP_V1',
};

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist or parse fails
 * @returns {*} Parsed data or defaultValue
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);

    // If parsing tasks fails, backup corrupted data
    if (key === STORAGE_KEYS.TASKS) {
      try {
        const corruptedData = window.localStorage.getItem(key);
        if (corruptedData) {
          window.localStorage.setItem(STORAGE_KEYS.BACKUP, corruptedData);
          console.log('Backed up corrupted data to', STORAGE_KEYS.BACKUP);
        }
      } catch (backupError) {
        console.error('Failed to backup corrupted data:', backupError);
      }
    }

    return defaultValue;
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function removeFromStorage(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all app data from localStorage
 * @returns {boolean} Success status
 */
export function clearAllStorage() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.TASKS);
    window.localStorage.removeItem(STORAGE_KEYS.PREFS);
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

export { STORAGE_KEYS };
