import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getTimeRemaining,
  getUrgencyColor,
  formatRelativeTime,
  isOverdue,
  needsUrgentRefresh
} from '../utils/urgency';

describe('urgency utilities', () => {
  let originalNow;

  beforeEach(() => {
    originalNow = Date.now;
    // Mock current time: 2025-10-27 12:00:00 UTC
    Date.now = vi.fn(() => new Date('2025-10-27T12:00:00Z').getTime());
  });

  afterEach(() => {
    Date.now = originalNow;
  });

  describe('getTimeRemaining', () => {
    it('calculates positive time remaining', () => {
      const deadline = '2025-10-27T15:30:00Z'; // 3h 30m from now
      const remaining = getTimeRemaining(deadline);
      expect(remaining).toBe(3.5 * 60 * 60 * 1000); // 3.5 hours in ms
    });

    it('calculates negative time for overdue tasks', () => {
      const deadline = '2025-10-27T10:00:00Z'; // 2h ago
      const remaining = getTimeRemaining(deadline);
      expect(remaining).toBe(-2 * 60 * 60 * 1000); // -2 hours in ms
    });

    it('returns 0 for deadline at current time', () => {
      const deadline = '2025-10-27T12:00:00Z';
      const remaining = getTimeRemaining(deadline);
      expect(remaining).toBe(0);
    });

    it('handles custom current time', () => {
      const deadline = '2025-10-27T15:00:00Z';
      const customNow = new Date('2025-10-27T14:00:00Z').getTime();
      const remaining = getTimeRemaining(deadline, customNow);
      expect(remaining).toBe(60 * 60 * 1000); // 1 hour in ms
    });
  });

  describe('isOverdue', () => {
    it('returns true for overdue tasks', () => {
      const deadline = '2025-10-27T10:00:00Z';
      expect(isOverdue(deadline)).toBe(true);
    });

    it('returns false for future tasks', () => {
      const deadline = '2025-10-27T15:00:00Z';
      expect(isOverdue(deadline)).toBe(false);
    });

    it('returns false for deadline at current time', () => {
      const deadline = '2025-10-27T12:00:00Z';
      expect(isOverdue(deadline)).toBe(false);
    });
  });

  describe('getUrgencyColor', () => {
    it('returns red for overdue tasks', () => {
      const deadline = '2025-10-27T10:00:00Z'; // 2h ago
      expect(getUrgencyColor(deadline)).toBe('#ef4444'); // red
    });

    it('returns red for tasks due in < 1 hour', () => {
      const deadline = '2025-10-27T12:30:00Z'; // 30min from now
      expect(getUrgencyColor(deadline)).toBe('#ef4444'); // red
    });

    it('returns orange for tasks due in 1-6 hours', () => {
      const deadline = '2025-10-27T15:00:00Z'; // 3h from now
      expect(getUrgencyColor(deadline)).toBe('#f97316'); // orange
    });

    it('returns yellow for tasks due in 6-24 hours', () => {
      const deadline = '2025-10-27T22:00:00Z'; // 10h from now
      expect(getUrgencyColor(deadline)).toBe('#eab308'); // yellow
    });

    it('returns green for tasks due in > 24 hours', () => {
      const deadline = '2025-10-28T15:00:00Z'; // 27h from now
      expect(getUrgencyColor(deadline)).toBe('#22c55e'); // green
    });

    it('handles edge case: exactly 1 hour', () => {
      const deadline = '2025-10-27T13:00:00Z'; // exactly 1h from now
      expect(getUrgencyColor(deadline)).toBe('#f97316'); // orange
    });

    it('handles edge case: exactly 6 hours', () => {
      const deadline = '2025-10-27T18:00:00Z'; // exactly 6h from now
      expect(getUrgencyColor(deadline)).toBe('#eab308'); // yellow
    });

    it('handles edge case: exactly 24 hours', () => {
      const deadline = '2025-10-28T12:00:00Z'; // exactly 24h from now
      expect(getUrgencyColor(deadline)).toBe('#22c55e'); // green
    });
  });

  describe('formatRelativeTime', () => {
    it('formats overdue time with negative prefix', () => {
      const deadline = '2025-10-27T10:00:00Z'; // 2h ago
      expect(formatRelativeTime(deadline)).toBe('Overdue by 2h');
    });

    it('formats hours and minutes', () => {
      const deadline = '2025-10-27T15:30:00Z'; // 3h 30m from now
      expect(formatRelativeTime(deadline)).toBe('Due in 3h 30m');
    });

    it('formats only hours when minutes are 0', () => {
      const deadline = '2025-10-27T15:00:00Z'; // exactly 3h from now
      expect(formatRelativeTime(deadline)).toBe('Due in 3h');
    });

    it('formats only minutes when less than 1 hour', () => {
      const deadline = '2025-10-27T12:45:00Z'; // 45min from now
      expect(formatRelativeTime(deadline)).toBe('Due in 45m');
    });

    it('shows "Due now" for current time', () => {
      const deadline = '2025-10-27T12:00:00Z';
      expect(formatRelativeTime(deadline)).toBe('Due now');
    });

    it('handles large time differences', () => {
      const deadline = '2025-10-30T15:30:00Z'; // 75h 30m from now
      expect(formatRelativeTime(deadline)).toBe('Due in 75h 30m');
    });

    it('rounds down partial minutes', () => {
      const deadline = new Date(Date.now() + 45.7 * 60 * 1000).toISOString();
      expect(formatRelativeTime(deadline)).toBe('Due in 45m');
    });

    it('formats overdue hours and minutes', () => {
      const deadline = '2025-10-27T08:15:00Z'; // 3h 45m ago
      expect(formatRelativeTime(deadline)).toBe('Overdue by 3h 45m');
    });
  });

  describe('needsUrgentRefresh', () => {
    it('returns true when any task is due within 1 hour', () => {
      const tasks = [
        { deadline: '2025-10-27T15:00:00Z' }, // 3h
        { deadline: '2025-10-27T12:30:00Z' }, // 30min - urgent!
        { deadline: '2025-10-28T12:00:00Z' }, // 24h
      ];
      expect(needsUrgentRefresh(tasks)).toBe(true);
    });

    it('returns true when task is overdue', () => {
      const tasks = [
        { deadline: '2025-10-27T15:00:00Z' }, // 3h
        { deadline: '2025-10-27T10:00:00Z' }, // overdue - urgent!
      ];
      expect(needsUrgentRefresh(tasks)).toBe(true);
    });

    it('returns false when all tasks are > 1 hour away', () => {
      const tasks = [
        { deadline: '2025-10-27T15:00:00Z' }, // 3h
        { deadline: '2025-10-28T12:00:00Z' }, // 24h
      ];
      expect(needsUrgentRefresh(tasks)).toBe(false);
    });

    it('returns false for empty task list', () => {
      expect(needsUrgentRefresh([])).toBe(false);
    });

    it('handles edge case: exactly 1 hour', () => {
      const tasks = [
        { deadline: '2025-10-27T13:00:00Z' }, // exactly 1h
      ];
      expect(needsUrgentRefresh(tasks)).toBe(false);
    });

    it('handles edge case: just under 1 hour', () => {
      const tasks = [
        { deadline: new Date(Date.now() + 59 * 60 * 1000).toISOString() }, // 59min
      ];
      expect(needsUrgentRefresh(tasks)).toBe(true);
    });
  });
});
