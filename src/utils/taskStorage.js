/**
 * Task storage operations
 * High-level CRUD operations with localStorage persistence
 * Uses pure functions from tasks.js for business logic
 */

import {
  getAllTasks,
  getTaskById,
  processNewTask,
  processTaskUpdate,
  removeTaskById,
  markTaskComplete,
  processImportedTasks,
  exportTasks,
} from './tasks';
import { saveToStorage, STORAGE_KEYS } from './storage';

/**
 * Create a new task and save to storage
 * @param {object} taskData - Task data { title, description, deadline, priority }
 * @returns {object} { success: boolean, task: object|null, errors: string[] }
 */
export function createTask(taskData) {
  const result = processNewTask(taskData);
  if (!result.success) {
    return result;
  }

  // Get existing tasks and add new one
  const tasks = getAllTasks();
  tasks.push(result.task);

  // Save to storage
  const saved = saveToStorage(STORAGE_KEYS.TASKS, tasks);
  if (!saved) {
    return {
      success: false,
      task: null,
      errors: ['Failed to save task to storage'],
    };
  }

  return result;
}

/**
 * Update an existing task and save to storage
 * @param {string} id - Task ID
 * @param {object} updates - Fields to update
 * @returns {object} { success: boolean, task: object|null, errors: string[] }
 */
export function updateTask(id, updates) {
  const tasks = getAllTasks();
  const existingTask = getTaskById(tasks, id);

  if (!existingTask) {
    return {
      success: false,
      task: null,
      errors: ['Task not found'],
    };
  }

  const result = processTaskUpdate(existingTask, updates);
  if (!result.success) {
    return result;
  }

  // Update task in array
  const updatedTasks = tasks.map(task => task.id === id ? result.task : task);

  // Save to storage
  const saved = saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
  if (!saved) {
    return {
      success: false,
      task: null,
      errors: ['Failed to save task to storage'],
    };
  }

  return result;
}

/**
 * Delete a task and save to storage
 * @param {string} id - Task ID
 * @returns {object} { success: boolean, errors: string[] }
 */
export function deleteTask(id) {
  const tasks = getAllTasks();
  const result = removeTaskById(tasks, id);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Save to storage
  const saved = saveToStorage(STORAGE_KEYS.TASKS, result.tasks);
  if (!saved) {
    return {
      success: false,
      errors: ['Failed to save changes to storage'],
    };
  }

  return { success: true, errors: [] };
}

/**
 * Mark a task as completed and remove from storage
 * @param {string} id - Task ID
 * @returns {object} { success: boolean, errors: string[] }
 */
export function completeTask(id) {
  const tasks = getAllTasks();
  const result = markTaskComplete(tasks, id);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Save to storage
  const saved = saveToStorage(STORAGE_KEYS.TASKS, result.tasks);
  if (!saved) {
    return {
      success: false,
      errors: ['Failed to save changes to storage'],
    };
  }

  return { success: true, errors: [] };
}

/**
 * Import tasks from array and save to storage
 * @param {Array} importedTasks - Array of task objects
 * @returns {object} { success: boolean, imported: number, errors: string[] }
 */
export function importTasks(importedTasks) {
  const currentTasks = getAllTasks();
  const result = processImportedTasks(currentTasks, importedTasks);

  if (!result.success || result.imported === 0) {
    return {
      success: false,
      imported: 0,
      errors: result.errors,
    };
  }

  // Save to storage
  const saved = saveToStorage(STORAGE_KEYS.TASKS, result.tasks);
  if (!saved) {
    return {
      success: false,
      imported: 0,
      errors: ['Failed to save imported tasks to storage'],
    };
  }

  return {
    success: true,
    imported: result.imported,
    errors: result.errors,
  };
}

/**
 * Export all tasks from storage as JSON string
 * @returns {string} JSON string of all tasks
 */
export function exportTasksFromStorage() {
  const tasks = getAllTasks();
  return exportTasks(tasks);
}

/**
 * Clear all tasks from storage
 * @returns {boolean} Success status
 */
export function clearAllTasks() {
  return saveToStorage(STORAGE_KEYS.TASKS, []);
}
