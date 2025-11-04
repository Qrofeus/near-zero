import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  validateTitle,
  validateDescription,
  validateDeadline,
  validatePriority,
  validateTask,
  truncateDescription,
} from '../utils/validation';

describe('Validation Utilities', () => {
  describe('validateTitle', () => {
    it('should accept valid non-empty title', () => {
      const result = validateTitle('Valid Title');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should reject null title', () => {
      const result = validateTitle(null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    it('should reject undefined title', () => {
      const result = validateTitle(undefined);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    it('should reject empty string title', () => {
      const result = validateTitle('');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title cannot be empty or whitespace');
    });

    it('should reject whitespace-only title', () => {
      const result = validateTitle('   ');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title cannot be empty or whitespace');
    });

    it('should reject non-string title', () => {
      const result = validateTitle(123);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    it('should accept title with leading/trailing spaces', () => {
      const result = validateTitle('  Valid Title  ');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });
  });

  describe('validateDescription', () => {
    it('should accept valid description', () => {
      const result = validateDescription('This is a valid description');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept empty description', () => {
      const result = validateDescription('');

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept null description', () => {
      const result = validateDescription(null);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept undefined description', () => {
      const result = validateDescription(undefined);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept description with exactly 300 characters', () => {
      const description = 'a'.repeat(300);
      const result = validateDescription(description);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should reject description longer than 300 characters', () => {
      const description = 'a'.repeat(301);
      const result = validateDescription(description);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Description must be 300 characters or less');
    });

    it('should reject non-string description', () => {
      const result = validateDescription(123);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Description must be a string');
    });
  });

  describe('validateDeadline', () => {
    it('should accept future deadline', () => {
      const futureDate = dayjs().add(1, 'day').toISOString();
      const result = validateDeadline(futureDate);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should reject past deadline', () => {
      const pastDate = dayjs().subtract(1, 'day').toISOString();
      const result = validateDeadline(pastDate);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Deadline cannot be in the past');
    });

    it('should reject null deadline', () => {
      const result = validateDeadline(null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Deadline is required');
    });

    it('should reject undefined deadline', () => {
      const result = validateDeadline(undefined);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Deadline is required');
    });

    it('should reject empty string deadline', () => {
      const result = validateDeadline('');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Deadline is required');
    });

    it('should reject invalid date string', () => {
      const result = validateDeadline('not-a-date');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid deadline format');
    });

    it('should reject non-string deadline', () => {
      const result = validateDeadline(123);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Deadline is required');
    });

    it('should accept deadline 1 hour in future', () => {
      const futureDate = dayjs().add(1, 'hour').toISOString();
      const result = validateDeadline(futureDate);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });
  });

  describe('validatePriority', () => {
    it('should accept priority 1 (High)', () => {
      const result = validatePriority(1);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept priority 2 (Medium)', () => {
      const result = validatePriority(2);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept priority 3 (Low)', () => {
      const result = validatePriority(3);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept null priority', () => {
      const result = validatePriority(null);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should accept undefined priority', () => {
      const result = validatePriority(undefined);

      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should reject priority 0', () => {
      const result = validatePriority(0);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Priority must be 1 (High), 2 (Medium), or 3 (Low)');
    });

    it('should reject priority 4', () => {
      const result = validatePriority(4);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Priority must be 1 (High), 2 (Medium), or 3 (Low)');
    });

    it('should reject string priority', () => {
      const result = validatePriority('1');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Priority must be 1 (High), 2 (Medium), or 3 (Low)');
    });
  });

  describe('validateTask', () => {
    it('should accept valid complete task', () => {
      const task = {
        title: 'Valid Task',
        description: 'Valid description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 2,
      };

      const result = validateTask(task);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accept task with minimal fields', () => {
      const task = {
        title: 'Valid Task',
        description: '',
        deadline: dayjs().add(1, 'day').toISOString(),
      };

      const result = validateTask(task);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject task with empty title', () => {
      const task = {
        title: '',
        description: 'Valid description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 2,
      };

      const result = validateTask(task);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title cannot be empty or whitespace');
    });

    it('should reject task with long description', () => {
      const task = {
        title: 'Valid Task',
        description: 'a'.repeat(301),
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 2,
      };

      const result = validateTask(task);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Description must be 300 characters or less');
    });

    it('should reject task with past deadline', () => {
      const task = {
        title: 'Valid Task',
        description: 'Valid description',
        deadline: dayjs().subtract(1, 'day').toISOString(),
        priority: 2,
      };

      const result = validateTask(task);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Deadline cannot be in the past');
    });

    it('should reject task with invalid priority', () => {
      const task = {
        title: 'Valid Task',
        description: 'Valid description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 5,
      };

      const result = validateTask(task);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Priority must be 1 (High), 2 (Medium), or 3 (Low)');
    });

    it('should collect multiple validation errors', () => {
      const task = {
        title: '',
        description: 'a'.repeat(301),
        deadline: dayjs().subtract(1, 'day').toISOString(),
        priority: 0,
      };

      const result = validateTask(task);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(4);
    });
  });

  describe('truncateDescription', () => {
    it('should not truncate description under 300 characters', () => {
      const description = 'Short description';
      const result = truncateDescription(description);

      expect(result).toBe(description);
    });

    it('should not truncate description with exactly 300 characters', () => {
      const description = 'a'.repeat(300);
      const result = truncateDescription(description);

      expect(result).toBe(description);
      expect(result.length).toBe(300);
    });

    it('should truncate description over 300 characters', () => {
      const description = 'a'.repeat(350);
      const result = truncateDescription(description);

      expect(result.length).toBe(300);
      expect(result).toBe('a'.repeat(300));
    });

    it('should handle null description', () => {
      const result = truncateDescription(null);

      expect(result).toBe('');
    });

    it('should handle undefined description', () => {
      const result = truncateDescription(undefined);

      expect(result).toBe('');
    });

    it('should handle non-string description', () => {
      const result = truncateDescription(123);

      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = truncateDescription('');

      expect(result).toBe('');
    });
  });
});
