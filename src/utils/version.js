/**
 * Version update utilities
 * Handles version tracking and update detection
 */

const VERSION_KEY = 'NINAD_VERSION';
const CURRENT_VERSION = '1.0.0'; // Semantic versioning

/**
 * Get current app version
 * @returns {string} Current version
 */
export function getCurrentVersion() {
  return CURRENT_VERSION;
}

/**
 * Get stored version from localStorage
 * @returns {string|null} Stored version or null if not set
 */
export function getStoredVersion() {
  try {
    return window.localStorage.getItem(VERSION_KEY);
  } catch (e) {
    return null;
  }
}

/**
 * Set stored version in localStorage
 * @param {string} version - Version to store
 */
export function setStoredVersion(version) {
  try {
    window.localStorage.setItem(VERSION_KEY, version);
  } catch (e) {
    console.error('Failed to set version:', e);
  }
}

/**
 * Check if version update is needed
 * @returns {boolean} True if stored version differs from current
 */
export function needsVersionUpdate() {
  const stored = getStoredVersion();
  if (stored === null) {
    return true;
  }
  return stored !== CURRENT_VERSION;
}

/**
 * Perform version update
 * Updates stored version to current version
 */
export function performVersionUpdate() {
  setStoredVersion(CURRENT_VERSION);
}
