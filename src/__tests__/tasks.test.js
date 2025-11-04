import { describe, it, expect, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import {
  getAllTasks,
  getTaskById,
  processNewTask,
  processTaskUpdate,
  removeTaskById,
  markTaskComplete,
  processImportedTasks,
  exportTasks,
} from '../utils/tasks';
import { STORAGE_KEYS } from '../utils/storage';

describe('Task Pure Business Logic', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getAllTasks', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = getAllTasks();

      expect(tasks).toEqual([]);
    });

    it('should return all tasks from storage', () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(mockTasks));

      const tasks = getAllTasks();

      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id from array', () => {
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Description 1',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
        {
          id: 'task-2',
          title: 'Task 2',
          description: 'Description 2',
          deadline: dayjs().add(2, 'days').toISOString(),
          priority: 2,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const task = getTaskById(mockTasks, 'task-2');

      expect(task).toEqual(mockTasks[1]);
    });

    it('should return null if task not found', () => {
      const task = getTaskById([], 'non-existent');

      expect(task).toBe(null);
    });
  });

  describe('processNewTask', () => {
    it('should create a new task with all fields', () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const result = processNewTask(taskData);

      expect(result.success).toBe(true);
      expect(result.task).toBeDefined();
      expect(result.task.id).toBeDefined();
      expect(result.task.title).toBe(taskData.title);
      expect(result.task.description).toBe(taskData.description);
      expect(result.task.deadline).toBe(taskData.deadline);
      expect(result.task.priority).toBe(taskData.priority);
      expect(result.task.isCompleted).toBe(false);
      expect(result.task.createdAt).toBeDefined();
      expect(result.task.lastModified).toBeDefined();
      expect(result.task.schemaVersion).toBe(1);
      expect(result.errors).toEqual([]);
    });

    it('should create task with default priority if not provided', () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        deadline: dayjs().add(1, 'day').toISOString(),
      };

      const result = processNewTask(taskData);

      expect(result.success).toBe(true);
      expect(result.task.priority).toBe(2); // Default to Medium
    });

    it('should create task with empty description', () => {
      const taskData = {
        title: 'New Task',
        description: '',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const result = processNewTask(taskData);

      expect(result.success).toBe(true);
      expect(result.task.description).toBe('');
    });

    it('should truncate description over 300 characters', () => {
      const taskData = {
        title: 'New Task',
        description: 'a'.repeat(350),
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const result = processNewTask(taskData);

      expect(result.success).toBe(true);
      expect(result.task.description.length).toBe(300);
    });

    it('should reject task with empty title', () => {
      const taskData = {
        title: '',
        description: 'Description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const result = processNewTask(taskData);

      expect(result.success).toBe(false);
      expect(result.task).toBe(null);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject task with past deadline', () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        deadline: dayjs().subtract(1, 'day').toISOString(),
        priority: 1,
      };

      const result = processNewTask(taskData);

      expect(result.success).toBe(false);
      expect(result.task).toBe(null);
      expect(result.errors).toContain('Deadline cannot be in the past');
    });

    it('should not save to storage (pure function)', () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      processNewTask(taskData);

      const tasks = getAllTasks();
      expect(tasks.length).toBe(0); // Should not be saved
    });
  });

  describe('processTaskUpdate', () => {
    it('should process task update', () => {
      const existingTask = {
        id: 'task-1',
        title: 'Original Task',
        description: 'Original description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
        isCompleted: false,
        createdAt: dayjs().toISOString(),
        lastModified: dayjs().toISOString(),
        schemaVersion: 1,
      };

      const updates = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      const result = processTaskUpdate(existingTask, updates);

      expect(result.success).toBe(true);
      expect(result.task.title).toBe(updates.title);
      expect(result.task.description).toBe(updates.description);
      expect(result.task.id).toBe(existingTask.id); // ID should not change
      expect(result.task.createdAt).toBe(existingTask.createdAt); // createdAt should not change
    });

    it('should update lastModified timestamp', () => {
      const existingTask = {
        id: 'task-1',
        title: 'Original Task',
        description: 'Original',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
        isCompleted: false,
        createdAt: dayjs().toISOString(),
        lastModified: dayjs().subtract(1, 'hour').toISOString(),
        schemaVersion: 1,
      };

      const result = processTaskUpdate(existingTask, { title: 'Updated' });

      expect(result.task.lastModified).toBeDefined();
      expect(result.task.lastModified).not.toBe(existingTask.lastModified);
    });

    it('should not allow changing id', () => {
      const existingTask = {
        id: 'original-id',
        title: 'Task',
        description: 'Description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
        isCompleted: false,
        createdAt: dayjs().toISOString(),
        lastModified: dayjs().toISOString(),
        schemaVersion: 1,
      };

      const result = processTaskUpdate(existingTask, { id: 'new-id' });

      expect(result.task.id).toBe('original-id');
    });

    it('should not allow changing createdAt', () => {
      const originalCreatedAt = dayjs().toISOString();
      const existingTask = {
        id: 'task-1',
        title: 'Task',
        description: 'Description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
        isCompleted: false,
        createdAt: originalCreatedAt,
        lastModified: dayjs().toISOString(),
        schemaVersion: 1,
      };

      const result = processTaskUpdate(existingTask, {
        createdAt: dayjs().subtract(1, 'year').toISOString(),
      });

      expect(result.task.createdAt).toBe(originalCreatedAt);
    });

    it('should truncate description if over 300 characters', () => {
      const existingTask = {
        id: 'task-1',
        title: 'Task',
        description: 'Short',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
        isCompleted: false,
        createdAt: dayjs().toISOString(),
        lastModified: dayjs().toISOString(),
        schemaVersion: 1,
      };

      const result = processTaskUpdate(existingTask, {
        description: 'a'.repeat(350),
      });

      expect(result.success).toBe(true);
      expect(result.task.description.length).toBe(300);
    });

    it('should reject update with invalid data', () => {
      const existingTask = {
        id: 'task-1',
        title: 'Task',
        description: 'Description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
        isCompleted: false,
        createdAt: dayjs().toISOString(),
        lastModified: dayjs().toISOString(),
        schemaVersion: 1,
      };

      const result = processTaskUpdate(existingTask, {
        title: '', // Invalid
      });

      expect(result.success).toBe(false);
      expect(result.task).toBe(null);
    });
  });

  describe('removeTaskById', () => {
    it('should remove task from array', () => {
      const tasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Keep',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
        {
          id: 'task-2',
          title: 'Task 2',
          description: 'Remove',
          deadline: dayjs().add(2, 'days').toISOString(),
          priority: 2,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const result = removeTaskById(tasks, 'task-2');

      expect(result.success).toBe(true);
      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].id).toBe('task-1');
    });

    it('should return error if task not found', () => {
      const tasks = [];
      const result = removeTaskById(tasks, 'non-existent');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Task not found');
    });

    it('should not mutate original array', () => {
      const tasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Description',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      removeTaskById(tasks, 'task-1');

      expect(tasks.length).toBe(1); // Original array unchanged
    });
  });

  describe('markTaskComplete', () => {
    it('should mark task as completed and remove from array', () => {
      const tasks = [
        {
          id: 'task-1',
          title: 'Task to complete',
          description: 'Will be completed',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const result = markTaskComplete(tasks, 'task-1');

      expect(result.success).toBe(true);
      expect(result.tasks.length).toBe(0);
    });

    it('should return error if task not found', () => {
      const tasks = [];
      const result = markTaskComplete(tasks, 'non-existent');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Task not found');
    });

    it('should not mutate original array', () => {
      const tasks = [
        {
          id: 'task-1',
          title: 'Task',
          description: 'Description',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      markTaskComplete(tasks, 'task-1');

      expect(tasks.length).toBe(1); // Original array unchanged
      expect(tasks[0].isCompleted).toBe(false); // Original not modified
    });
  });

  describe('processImportedTasks', () => {
    it('should process valid imported tasks', () => {
      const currentTasks = [];
      const importedTasks = [
        {
          id: 'imported-1',
          title: 'Imported Task 1',
          description: 'Description 1',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const result = processImportedTasks(currentTasks, importedTasks);

      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.tasks.length).toBe(1);
    });

    it('should truncate descriptions over 300 characters on import', () => {
      const currentTasks = [];
      const importedTasks = [
        {
          id: 'imported-1',
          title: 'Task',
          description: 'a'.repeat(350),
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const result = processImportedTasks(currentTasks, importedTasks);

      expect(result.success).toBe(true);
      expect(result.tasks[0].description.length).toBe(300);
    });

    it('should add imported tasks to existing tasks', () => {
      const currentTasks = [
        {
          id: 'existing-1',
          title: 'Existing Task',
          description: 'Already here',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const importedTasks = [
        {
          id: 'imported-1',
          title: 'Imported Task',
          description: 'Newly imported',
          deadline: dayjs().add(2, 'days').toISOString(),
          priority: 2,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const result = processImportedTasks(currentTasks, importedTasks);

      expect(result.tasks.length).toBe(2);
    });

    it('should reject non-array import data', () => {
      const currentTasks = [];
      const result = processImportedTasks(currentTasks, { not: 'an array' });

      expect(result.success).toBe(false);
      expect(result.imported).toBe(0);
      expect(result.errors[0]).toContain('expected an array');
    });

    it('should skip tasks with missing required fields', () => {
      const currentTasks = [];
      const importedTasks = [
        {
          id: 'valid',
          title: 'Valid Task',
          description: 'Has all fields',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
        {
          id: 'invalid',
          description: 'Missing title',
          deadline: dayjs().add(1, 'day').toISOString(),
        },
      ];

      const result = processImportedTasks(currentTasks, importedTasks);

      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should not mutate original arrays', () => {
      const currentTasks = [
        {
          id: 'existing-1',
          title: 'Existing',
          description: 'Task',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const importedTasks = [
        {
          id: 'imported-1',
          title: 'Imported',
          description: 'Task',
          deadline: dayjs().add(2, 'days').toISOString(),
          priority: 2,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      processImportedTasks(currentTasks, importedTasks);

      expect(currentTasks.length).toBe(1); // Original unchanged
    });
  });

  describe('exportTasks', () => {
    it('should export tasks as JSON string', () => {
      const tasks = [
        {
          id: 'task-1',
          title: 'Task to export',
          description: 'Export me',
          deadline: dayjs().add(1, 'day').toISOString(),
          priority: 1,
          isCompleted: false,
          createdAt: dayjs().toISOString(),
          lastModified: dayjs().toISOString(),
          schemaVersion: 1,
        },
      ];

      const exported = exportTasks(tasks);

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].title).toBe('Task to export');
    });

    it('should export empty array when no tasks', () => {
      const exported = exportTasks([]);

      const parsed = JSON.parse(exported);
      expect(parsed).toEqual([]);
    });
  });
});
