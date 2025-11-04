import { describe, it, expect, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import {
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  importTasks,
  exportTasksFromStorage,
  clearAllTasks,
} from '../utils/taskStorage';
import { getAllTasks } from '../utils/tasks';

describe('Task Storage Operations', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('createTask', () => {
    it('should create a new task and save to storage', () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const result = createTask(taskData);

      expect(result.success).toBe(true);
      expect(result.task).toBeDefined();
      expect(result.task.id).toBeDefined();
      expect(result.task.title).toBe(taskData.title);
      expect(result.errors).toEqual([]);

      // Verify saved to storage
      const tasks = getAllTasks();
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe(taskData.title);
    });

    it('should add new task to existing tasks', () => {
      const firstTask = {
        title: 'First Task',
        description: 'First',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const secondTask = {
        title: 'Second Task',
        description: 'Second',
        deadline: dayjs().add(2, 'days').toISOString(),
        priority: 2,
      };

      createTask(firstTask);
      createTask(secondTask);

      const tasks = getAllTasks();
      expect(tasks.length).toBe(2);
    });

    it('should return error for invalid task', () => {
      const taskData = {
        title: '',
        description: 'Description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const result = createTask(taskData);

      expect(result.success).toBe(false);
      expect(result.task).toBe(null);
      expect(result.errors.length).toBeGreaterThan(0);

      // Should not save invalid task
      const tasks = getAllTasks();
      expect(tasks.length).toBe(0);
    });
  });

  describe('updateTask', () => {
    it('should update existing task and save to storage', () => {
      const taskData = {
        title: 'Original Task',
        description: 'Original description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const createResult = createTask(taskData);
      const taskId = createResult.task.id;

      const updates = {
        title: 'Updated Task',
        description: 'Updated description',
      };

      const updateResult = updateTask(taskId, updates);

      expect(updateResult.success).toBe(true);
      expect(updateResult.task.title).toBe(updates.title);
      expect(updateResult.task.description).toBe(updates.description);

      // Verify saved to storage
      const tasks = getAllTasks();
      expect(tasks[0].title).toBe(updates.title);
      expect(tasks[0].description).toBe(updates.description);
    });

    it('should preserve id and createdAt', () => {
      const taskData = {
        title: 'Original Task',
        description: 'Original',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const createResult = createTask(taskData);
      const originalId = createResult.task.id;
      const originalCreatedAt = createResult.task.createdAt;

      const updateResult = updateTask(originalId, { title: 'Updated' });

      expect(updateResult.task.id).toBe(originalId);
      expect(updateResult.task.createdAt).toBe(originalCreatedAt);
    });

    it('should return error if task not found', () => {
      const result = updateTask('non-existent', { title: 'Updated' });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Task not found');
    });

    it('should return error for invalid update', () => {
      const taskData = {
        title: 'Task',
        description: 'Description',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const createResult = createTask(taskData);
      const taskId = createResult.task.id;

      const updateResult = updateTask(taskId, { title: '' }); // Invalid

      expect(updateResult.success).toBe(false);
      expect(updateResult.task).toBe(null);
    });
  });

  describe('deleteTask', () => {
    it('should delete existing task and save to storage', () => {
      const taskData = {
        title: 'Task to delete',
        description: 'Will be deleted',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const createResult = createTask(taskData);
      const taskId = createResult.task.id;

      const deleteResult = deleteTask(taskId);

      expect(deleteResult.success).toBe(true);
      expect(deleteResult.errors).toEqual([]);

      // Verify removed from storage
      const tasks = getAllTasks();
      expect(tasks.length).toBe(0);
    });

    it('should only delete specified task', () => {
      const task1 = createTask({
        title: 'Task 1',
        description: 'Keep',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      });

      const task2 = createTask({
        title: 'Task 2',
        description: 'Delete',
        deadline: dayjs().add(2, 'days').toISOString(),
        priority: 2,
      });

      deleteTask(task2.task.id);

      const tasks = getAllTasks();
      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe(task1.task.id);
    });

    it('should return error if task not found', () => {
      const result = deleteTask('non-existent');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Task not found');
    });
  });

  describe('completeTask', () => {
    it('should mark task as completed and remove from storage', () => {
      const taskData = {
        title: 'Task to complete',
        description: 'Will be completed',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      const createResult = createTask(taskData);
      const taskId = createResult.task.id;

      const completeResult = completeTask(taskId);

      expect(completeResult.success).toBe(true);
      expect(completeResult.errors).toEqual([]);

      // Verify removed from storage
      const tasks = getAllTasks();
      expect(tasks.length).toBe(0);
    });

    it('should return error if task not found', () => {
      const result = completeTask('non-existent');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Task not found');
    });
  });

  describe('importTasks', () => {
    it('should import valid tasks and save to storage', () => {
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

      const result = importTasks(importedTasks);

      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);

      // Verify saved to storage
      const tasks = getAllTasks();
      expect(tasks.length).toBe(1);
    });

    it('should truncate descriptions over 300 characters on import', () => {
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

      const result = importTasks(importedTasks);

      expect(result.success).toBe(true);

      const tasks = getAllTasks();
      expect(tasks[0].description.length).toBe(300);
    });

    it('should add imported tasks to existing tasks', () => {
      createTask({
        title: 'Existing Task',
        description: 'Already here',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      });

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

      importTasks(importedTasks);

      const tasks = getAllTasks();
      expect(tasks.length).toBe(2);
    });

    it('should reject non-array import data', () => {
      const result = importTasks({ not: 'an array' });

      expect(result.success).toBe(false);
      expect(result.imported).toBe(0);
      expect(result.errors[0]).toContain('expected an array');
    });

    it('should skip tasks with missing required fields', () => {
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

      const result = importTasks(importedTasks);

      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);

      const tasks = getAllTasks();
      expect(tasks.length).toBe(1);
    });
  });

  describe('exportTasksFromStorage', () => {
    it('should export tasks from storage as JSON string', () => {
      const taskData = {
        title: 'Task to export',
        description: 'Export me',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      };

      createTask(taskData);

      const exported = exportTasksFromStorage();

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].title).toBe(taskData.title);
    });

    it('should export empty array when no tasks in storage', () => {
      const exported = exportTasksFromStorage();

      const parsed = JSON.parse(exported);
      expect(parsed).toEqual([]);
    });
  });

  describe('clearAllTasks', () => {
    it('should clear all tasks from storage', () => {
      createTask({
        title: 'Task 1',
        description: 'First',
        deadline: dayjs().add(1, 'day').toISOString(),
        priority: 1,
      });

      createTask({
        title: 'Task 2',
        description: 'Second',
        deadline: dayjs().add(2, 'days').toISOString(),
        priority: 2,
      });

      const result = clearAllTasks();

      expect(result).toBe(true);

      const tasks = getAllTasks();
      expect(tasks).toEqual([]);
    });
  });
});
