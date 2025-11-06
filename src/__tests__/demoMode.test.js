/**
 * Tests for demo mode utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getDemoMode,
  setDemoMode,
  generateExampleTasks,
  isLocalStorageAvailable
} from '../utils/demoMode';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
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

describe('isLocalStorageAvailable', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should return true when localStorage is available', () => {
    localStorageMock.setItem.mockImplementation((key, value) => {
      localStorageMock[key] = value;
    });
    localStorageMock.getItem.mockImplementation((key) => localStorageMock[key] || null);
    localStorageMock.removeItem.mockImplementation((key) => {
      delete localStorageMock[key];
    });

    expect(isLocalStorageAvailable()).toBe(true);
  });

  it('should return false when localStorage throws error', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage not available');
    });

    expect(isLocalStorageAvailable()).toBe(false);
  });
});

describe('getDemoMode', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('should return false by default', () => {
    localStorageMock.getItem.mockReturnValue(null);
    expect(getDemoMode()).toBe(false);
  });

  it('should return true when demo mode is enabled', () => {
    localStorageMock.getItem.mockReturnValue('true');
    expect(getDemoMode()).toBe(true);
  });

  it('should return false when demo mode is disabled', () => {
    localStorageMock.getItem.mockReturnValue('false');
    expect(getDemoMode()).toBe(false);
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    expect(getDemoMode()).toBe(false);
  });
});

describe('setDemoMode', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.setItem.mockClear();
  });

  it('should set demo mode to true', () => {
    setDemoMode(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('NINAD_DEMO_MODE', 'true');
  });

  it('should set demo mode to false', () => {
    setDemoMode(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('NINAD_DEMO_MODE', 'false');
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    expect(() => setDemoMode(true)).not.toThrow();
  });
});

describe('generateExampleTasks', () => {
  it('should generate 7 example tasks', () => {
    const tasks = generateExampleTasks();
    expect(tasks.length).toBe(7);
  });

  it('should generate tasks with valid structure', () => {
    const tasks = generateExampleTasks();
    tasks.forEach(task => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('deadline');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('isCompleted');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('lastModified');
      expect(task).toHaveProperty('schemaVersion', 1);
    });
  });

  it('should generate tasks with varied deadlines', () => {
    const tasks = generateExampleTasks();
    const deadlines = tasks.map(t => new Date(t.deadline).getTime());

    // Check that not all deadlines are the same
    const uniqueDeadlines = new Set(deadlines);
    expect(uniqueDeadlines.size).toBeGreaterThan(1);
  });

  it('should generate tasks with priorities 1-3', () => {
    const tasks = generateExampleTasks();
    tasks.forEach(task => {
      expect(task.priority).toBeGreaterThanOrEqual(1);
      expect(task.priority).toBeLessThanOrEqual(3);
    });
  });

  it('should generate tasks with isCompleted false', () => {
    const tasks = generateExampleTasks();
    tasks.forEach(task => {
      expect(task.isCompleted).toBe(false);
    });
  });

  it('should generate tasks with description <= 300 chars', () => {
    const tasks = generateExampleTasks();
    tasks.forEach(task => {
      expect(task.description.length).toBeLessThanOrEqual(300);
    });
  });

  it('should include overdue tasks for UI coverage', () => {
    const tasks = generateExampleTasks();
    const now = new Date();
    const overdueTasks = tasks.filter(task => new Date(task.deadline) < now);
    expect(overdueTasks.length).toBeGreaterThan(0);
  });

  it('should include urgent task (<1hr) for pulse animation', () => {
    const tasks = generateExampleTasks();
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const urgentTasks = tasks.filter(task => {
      const taskDeadline = new Date(task.deadline);
      return taskDeadline > now && taskDeadline < oneHourFromNow;
    });
    expect(urgentTasks.length).toBeGreaterThan(0);
  });

  it('should include all priority levels (1, 2, 3)', () => {
    const tasks = generateExampleTasks();
    const priorities = new Set(tasks.map(t => t.priority));
    expect(priorities.has(1)).toBe(true);
    expect(priorities.has(2)).toBe(true);
    expect(priorities.has(3)).toBe(true);
  });
});
