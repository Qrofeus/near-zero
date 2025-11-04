import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  isStorageAvailable,
  clearAllStorage,
  STORAGE_KEYS,
} from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('STORAGE_KEYS', () => {
    it('should have correct key constants', () => {
      expect(STORAGE_KEYS.TASKS).toBe('NINAD_TASKS_V1');
      expect(STORAGE_KEYS.PREFS).toBe('NINAD_PREFS_V1');
      expect(STORAGE_KEYS.BACKUP).toBe('NINAD_TASKS_BACKUP_V1');
    });
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage throws error', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      expect(isStorageAvailable()).toBe(false);

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('saveToStorage', () => {
    it('should save data to localStorage', () => {
      const data = { test: 'value' };
      const result = saveToStorage('test-key', data);

      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(data));
    });

    it('should save arrays to localStorage', () => {
      const data = [1, 2, 3];
      const result = saveToStorage('test-key', data);

      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(data));
    });

    it('should return false on error', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const result = saveToStorage('test-key', { test: 'value' });

      expect(result).toBe(false);

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('getFromStorage', () => {
    it('should retrieve and parse data from localStorage', () => {
      const data = { test: 'value', number: 42 };
      localStorage.setItem('test-key', JSON.stringify(data));

      const result = getFromStorage('test-key');

      expect(result).toEqual(data);
    });

    it('should return default value when key does not exist', () => {
      const defaultValue = { default: true };
      const result = getFromStorage('non-existent-key', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it('should return null as default when no default value provided', () => {
      const result = getFromStorage('non-existent-key');

      expect(result).toBe(null);
    });

    it('should handle corrupted JSON and backup tasks data', () => {
      localStorage.setItem(STORAGE_KEYS.TASKS, 'invalid-json{]');

      const result = getFromStorage(STORAGE_KEYS.TASKS, []);

      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEYS.BACKUP)).toBe('invalid-json{]');
    });

    it('should not backup corrupted data for non-task keys', () => {
      localStorage.setItem('other-key', 'invalid-json{]');

      const result = getFromStorage('other-key', 'default');

      expect(result).toBe('default');
      expect(localStorage.getItem(STORAGE_KEYS.BACKUP)).toBe(null);
    });
  });

  describe('removeFromStorage', () => {
    it('should remove data from localStorage', () => {
      localStorage.setItem('test-key', 'value');
      expect(localStorage.getItem('test-key')).toBe('value');

      const result = removeFromStorage('test-key');

      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe(null);
    });

    it('should return true even if key does not exist', () => {
      const result = removeFromStorage('non-existent-key');

      expect(result).toBe(true);
    });

    it('should return false on error', () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const result = removeFromStorage('test-key');

      expect(result).toBe(false);

      Storage.prototype.removeItem = originalRemoveItem;
    });
  });

  describe('clearAllStorage', () => {
    it('should clear tasks and preferences from storage', () => {
      localStorage.setItem(STORAGE_KEYS.TASKS, '[]');
      localStorage.setItem(STORAGE_KEYS.PREFS, '{}');
      localStorage.setItem('other-key', 'keep-this');

      const result = clearAllStorage();

      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEYS.TASKS)).toBe(null);
      expect(localStorage.getItem(STORAGE_KEYS.PREFS)).toBe(null);
      expect(localStorage.getItem('other-key')).toBe('keep-this');
    });

    it('should return false on error', () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = vi.fn(() => {
        throw new Error('Storage error');
      });

      const result = clearAllStorage();

      expect(result).toBe(false);

      Storage.prototype.removeItem = originalRemoveItem;
    });
  });
});
