/**
 * Tests for import/export utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  exportTasksToJSON,
  importTasksFromJSON,
  validateImportData,
  truncateDescription
} from '../utils/importExport';
import { getAllTasks } from '../utils/tasks';

// Mock getAllTasks
vi.mock('../utils/tasks', () => ({
  getAllTasks: vi.fn()
}));

describe('truncateDescription', () => {
  it('should return unchanged string if <= 300 chars', () => {
    const short = 'Short description';
    expect(truncateDescription(short)).toBe(short);
  });

  it('should return unchanged string at exactly 300 chars', () => {
    const exact = 'a'.repeat(300);
    expect(truncateDescription(exact)).toBe(exact);
  });

  it('should truncate string > 300 chars', () => {
    const long = 'a'.repeat(350);
    expect(truncateDescription(long)).toBe('a'.repeat(300));
  });

  it('should handle empty string', () => {
    expect(truncateDescription('')).toBe('');
  });
});

describe('validateImportData', () => {
  it('should return true for valid task array', () => {
    const validTasks = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Description',
        deadline: '2025-12-31T12:00:00Z',
        priority: 1,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      }
    ];
    expect(validateImportData(validTasks)).toBe(true);
  });

  it('should return false for non-array', () => {
    expect(validateImportData({})).toBe(false);
    expect(validateImportData('not array')).toBe(false);
    expect(validateImportData(null)).toBe(false);
  });

  it('should return false for array with invalid tasks', () => {
    const invalidTasks = [
      {
        id: '1',
        // missing required fields
      }
    ];
    expect(validateImportData(invalidTasks)).toBe(false);
  });

  it('should return false for task missing required fields', () => {
    const missingTitle = [
      {
        id: '1',
        description: 'Description',
        deadline: '2025-12-31T12:00:00Z',
        priority: 1
      }
    ];
    expect(validateImportData(missingTitle)).toBe(false);
  });

  it('should return true for empty array', () => {
    expect(validateImportData([])).toBe(true);
  });
});

describe('exportTasksToJSON', () => {
  beforeEach(() => {
    getAllTasks.mockReset();
  });

  it('should export tasks as JSON string', () => {
    const tasks = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Description',
        deadline: '2025-12-31T12:00:00Z',
        priority: 1,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      }
    ];
    getAllTasks.mockReturnValue(tasks);

    const result = exportTasksToJSON();
    expect(result).toBe(JSON.stringify(tasks, null, 2));
  });

  it('should export empty array if no tasks', () => {
    getAllTasks.mockReturnValue([]);
    const result = exportTasksToJSON();
    expect(result).toBe(JSON.stringify([], null, 2));
  });

  it('should handle multiple tasks', () => {
    const tasks = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Desc 1',
        deadline: '2025-12-31T12:00:00Z',
        priority: 1,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Desc 2',
        deadline: '2025-12-30T12:00:00Z',
        priority: 2,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      }
    ];
    getAllTasks.mockReturnValue(tasks);

    const result = exportTasksToJSON();
    expect(result).toBe(JSON.stringify(tasks, null, 2));
  });
});

describe('importTasksFromJSON', () => {
  it('should successfully import valid tasks with truncation', () => {
    const tasks = [
      {
        id: '1',
        title: 'Task 1',
        description: 'a'.repeat(350), // Will be truncated
        deadline: '2025-12-31T12:00:00Z',
        priority: 1,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      }
    ];
    const jsonString = JSON.stringify(tasks);

    const result = importTasksFromJSON(jsonString);
    expect(result.success).toBe(true);
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].description).toBe('a'.repeat(300));
  });

  it('should return error for invalid JSON', () => {
    const result = importTasksFromJSON('not valid json');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid JSON format');
  });

  it('should return error for invalid data structure', () => {
    const invalidData = JSON.stringify({ not: 'array' });
    const result = importTasksFromJSON(invalidData);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid task data structure');
  });

  it('should handle empty array', () => {
    const result = importTasksFromJSON('[]');
    expect(result.success).toBe(true);
    expect(result.tasks).toEqual([]);
  });

  it('should preserve fields when description <= 300 chars', () => {
    const tasks = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Normal length description',
        deadline: '2025-12-31T12:00:00Z',
        priority: 2,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      }
    ];
    const jsonString = JSON.stringify(tasks);

    const result = importTasksFromJSON(jsonString);
    expect(result.success).toBe(true);
    expect(result.tasks[0]).toEqual(tasks[0]);
  });

  it('should handle multiple tasks with mixed description lengths', () => {
    const tasks = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Short',
        deadline: '2025-12-31T12:00:00Z',
        priority: 1,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'a'.repeat(400), // Will be truncated
        deadline: '2025-12-30T12:00:00Z',
        priority: 2,
        isCompleted: false,
        createdAt: '2025-01-01T00:00:00Z',
        lastModified: '2025-01-01T00:00:00Z',
        schemaVersion: 1
      }
    ];
    const jsonString = JSON.stringify(tasks);

    const result = importTasksFromJSON(jsonString);
    expect(result.success).toBe(true);
    expect(result.tasks).toHaveLength(2);
    expect(result.tasks[0].description).toBe('Short');
    expect(result.tasks[1].description).toBe('a'.repeat(300));
  });
});
