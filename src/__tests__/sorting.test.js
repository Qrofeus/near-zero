/**
 * Tests for sorting utilities
 */

import { describe, it, expect } from 'vitest';
import {
  sortByDeadline,
  sortByPriority,
  SORT_MODES,
} from '../utils/sorting';

describe('sorting utilities', () => {
  // Sample tasks for testing
  const createTask = (id, deadline, priority, createdAt) => ({
    id,
    title: `Task ${id}`,
    description: '',
    deadline,
    priority,
    isCompleted: false,
    createdAt,
    lastModified: createdAt,
    schemaVersion: 1,
  });

  describe('sortByDeadline', () => {
    it('sorts tasks by deadline (earliest first)', () => {
      const tasks = [
        createTask('3', '2025-12-01T10:00:00Z', 2, '2025-01-01T00:00:00Z'),
        createTask('1', '2025-11-01T10:00:00Z', 2, '2025-01-01T00:00:00Z'),
        createTask('2', '2025-11-15T10:00:00Z', 2, '2025-01-01T00:00:00Z'),
      ];

      const sorted = sortByDeadline(tasks);

      expect(sorted[0].id).toBe('1'); // Nov 1
      expect(sorted[1].id).toBe('2'); // Nov 15
      expect(sorted[2].id).toBe('3'); // Dec 1
    });

    it('preserves insertion order for tasks with same deadline (stable sort)', () => {
      const tasks = [
        createTask('1', '2025-11-01T10:00:00Z', 2, '2025-01-01T00:00:00Z'),
        createTask('2', '2025-11-01T10:00:00Z', 2, '2025-01-02T00:00:00Z'),
        createTask('3', '2025-11-01T10:00:00Z', 2, '2025-01-03T00:00:00Z'),
      ];

      const sorted = sortByDeadline(tasks);

      // Should maintain insertion order (by createdAt) when deadlines are equal
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });

    it('handles empty array', () => {
      const sorted = sortByDeadline([]);
      expect(sorted).toEqual([]);
    });

    it('handles single task', () => {
      const tasks = [createTask('1', '2025-11-01T10:00:00Z', 2, '2025-01-01T00:00:00Z')];
      const sorted = sortByDeadline(tasks);
      expect(sorted).toEqual(tasks);
    });

    it('does not mutate original array', () => {
      const tasks = [
        createTask('2', '2025-12-01T10:00:00Z', 2, '2025-01-01T00:00:00Z'),
        createTask('1', '2025-11-01T10:00:00Z', 2, '2025-01-01T00:00:00Z'),
      ];
      const original = [...tasks];

      sortByDeadline(tasks);

      expect(tasks).toEqual(original);
    });
  });

  describe('sortByPriority', () => {
    it('sorts by priority (1=High, 2=Medium, 3=Low)', () => {
      const tasks = [
        createTask('3', '2025-11-01T10:00:00Z', 3, '2025-01-01T00:00:00Z'), // Low
        createTask('1', '2025-11-01T10:00:00Z', 1, '2025-01-01T00:00:00Z'), // High
        createTask('2', '2025-11-01T10:00:00Z', 2, '2025-01-01T00:00:00Z'), // Medium
      ];

      const sorted = sortByPriority(tasks);

      expect(sorted[0].id).toBe('1'); // High
      expect(sorted[1].id).toBe('2'); // Medium
      expect(sorted[2].id).toBe('3'); // Low
    });

    it('sorts by deadline within same priority group', () => {
      const tasks = [
        createTask('1', '2025-12-01T10:00:00Z', 1, '2025-01-01T00:00:00Z'), // High, Dec 1
        createTask('2', '2025-11-01T10:00:00Z', 1, '2025-01-01T00:00:00Z'), // High, Nov 1
        createTask('3', '2025-11-15T10:00:00Z', 1, '2025-01-01T00:00:00Z'), // High, Nov 15
      ];

      const sorted = sortByPriority(tasks);

      // All priority 1, sorted by deadline
      expect(sorted[0].id).toBe('2'); // Nov 1
      expect(sorted[1].id).toBe('3'); // Nov 15
      expect(sorted[2].id).toBe('1'); // Dec 1
    });

    it('sorts by priority first, then deadline', () => {
      const tasks = [
        createTask('1', '2025-11-01T10:00:00Z', 3, '2025-01-01T00:00:00Z'), // Low, Nov 1
        createTask('2', '2025-12-01T10:00:00Z', 1, '2025-01-01T00:00:00Z'), // High, Dec 1
        createTask('3', '2025-11-15T10:00:00Z', 2, '2025-01-01T00:00:00Z'), // Medium, Nov 15
      ];

      const sorted = sortByPriority(tasks);

      expect(sorted[0].id).toBe('2'); // High (even though deadline is later)
      expect(sorted[1].id).toBe('3'); // Medium
      expect(sorted[2].id).toBe('1'); // Low
    });

    it('preserves insertion order for tasks with same priority and deadline (stable sort)', () => {
      const tasks = [
        createTask('1', '2025-11-01T10:00:00Z', 1, '2025-01-01T00:00:00Z'),
        createTask('2', '2025-11-01T10:00:00Z', 1, '2025-01-02T00:00:00Z'),
        createTask('3', '2025-11-01T10:00:00Z', 1, '2025-01-03T00:00:00Z'),
      ];

      const sorted = sortByPriority(tasks);

      // Should maintain insertion order when priority and deadline are equal
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });

    it('handles empty array', () => {
      const sorted = sortByPriority([]);
      expect(sorted).toEqual([]);
    });

    it('handles single task', () => {
      const tasks = [createTask('1', '2025-11-01T10:00:00Z', 2, '2025-01-01T00:00:00Z')];
      const sorted = sortByPriority(tasks);
      expect(sorted).toEqual(tasks);
    });

    it('does not mutate original array', () => {
      const tasks = [
        createTask('2', '2025-12-01T10:00:00Z', 2, '2025-01-01T00:00:00Z'),
        createTask('1', '2025-11-01T10:00:00Z', 1, '2025-01-01T00:00:00Z'),
      ];
      const original = [...tasks];

      sortByPriority(tasks);

      expect(tasks).toEqual(original);
    });
  });

  describe('SORT_MODES', () => {
    it('exports sort mode constants', () => {
      expect(SORT_MODES.DEADLINE).toBe('deadline');
      expect(SORT_MODES.PRIORITY).toBe('priority');
    });
  });
});
