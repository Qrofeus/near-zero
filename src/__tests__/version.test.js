/**
 * Tests for version update utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCurrentVersion,
  getStoredVersion,
  setStoredVersion,
  needsVersionUpdate,
  performVersionUpdate
} from '../utils/version';

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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('getCurrentVersion', () => {
  it('should return current version string', () => {
    const version = getCurrentVersion();
    expect(typeof version).toBe('string');
    expect(version.length).toBeGreaterThan(0);
  });

  it('should match semver format', () => {
    const version = getCurrentVersion();
    // Should match x.y.z format (basic check)
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('getStoredVersion', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
  });

  it('should return null when no version stored', () => {
    localStorageMock.getItem.mockReturnValue(null);
    expect(getStoredVersion()).toBeNull();
  });

  it('should return stored version string', () => {
    localStorageMock.getItem.mockReturnValue('1.0.0');
    expect(getStoredVersion()).toBe('1.0.0');
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    expect(getStoredVersion()).toBeNull();
  });
});

describe('setStoredVersion', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.setItem.mockClear();
  });

  it('should store version string', () => {
    setStoredVersion('1.0.0');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('NINAD_VERSION', '1.0.0');
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    expect(() => setStoredVersion('1.0.0')).not.toThrow();
  });
});

describe('needsVersionUpdate', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
  });

  it('should return true when no stored version', () => {
    localStorageMock.getItem.mockReturnValue(null);
    expect(needsVersionUpdate()).toBe(true);
  });

  it('should return false when versions match', () => {
    const currentVersion = getCurrentVersion();
    localStorageMock.getItem.mockReturnValue(currentVersion);
    expect(needsVersionUpdate()).toBe(false);
  });

  it('should return true when versions differ', () => {
    localStorageMock.getItem.mockReturnValue('0.0.1');
    expect(needsVersionUpdate()).toBe(true);
  });
});

describe('performVersionUpdate', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.setItem.mockClear();
  });

  it('should update stored version to current version', () => {
    const currentVersion = getCurrentVersion();
    performVersionUpdate();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('NINAD_VERSION', currentVersion);
  });

  it('should not throw on localStorage errors', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    expect(() => performVersionUpdate()).not.toThrow();
  });
});
