/**
 * Pure business logic functions for task operations
 * No storage operations - use taskStorage.js for persistence
 */

import { v4 as uuidv4 } from 'uuid';
import { getFromStorage, STORAGE_KEYS } from './storage';
import { getCurrentUTC } from './datetime';
import { validateTask, truncateDescription } from './validation';

/**
 * Get all tasks from storage (read-only)
 * @returns {Array} Array of task objects
 */
export function getAllTasks() {
  return getFromStorage(STORAGE_KEYS.TASKS, []);
}

/**
 * Get a single task by ID from tasks array
 * @param {Array} tasks - Array of tasks
 * @param {string} id - Task ID
 * @returns {object|null} Task object or null if not found
 */
export function getTaskById(tasks, id) {
  return tasks.find(task => task.id === id) || null;
}

/**
 * Process new task data into valid task object (pure function)
 * @param {object} taskData - Task data { title, description, deadline, priority }
 * @returns {object} { success: boolean, task: object|null, errors: string[] }
 */
export function processNewTask(taskData) {
  const now = getCurrentUTC();

  const newTask = {
    id: uuidv4(),
    title: taskData.title || '',
    description: truncateDescription(taskData.description || ''),
    deadline: taskData.deadline,
    priority: taskData.priority || 2, // Default to Medium
    isCompleted: false,
    createdAt: now,
    lastModified: now,
    schemaVersion: 1,
  };

  // Validate the task
  const validation = validateTask(newTask);
  if (!validation.valid) {
    return {
      success: false,
      task: null,
      errors: validation.errors,
    };
  }

  return {
    success: true,
    task: newTask,
    errors: [],
  };
}

/**
 * Process task update (pure function)
 * @param {object} existingTask - Current task object
 * @param {object} updates - Fields to update
 * @returns {object} { success: boolean, task: object|null, errors: string[] }
 */
export function processTaskUpdate(existingTask, updates) {
  // Merge updates with existing task
  const updatedTask = {
    ...existingTask,
    ...updates,
    id: existingTask.id, // Ensure ID cannot be changed
    createdAt: existingTask.createdAt, // Ensure createdAt cannot be changed
    lastModified: getCurrentUTC(),
    schemaVersion: 1,
  };

  // Truncate description if present
  if (updatedTask.description) {
    updatedTask.description = truncateDescription(updatedTask.description);
  }

  // Validate the updated task
  const validation = validateTask(updatedTask);
  if (!validation.valid) {
    return {
      success: false,
      task: null,
      errors: validation.errors,
    };
  }

  return {
    success: true,
    task: updatedTask,
    errors: [],
  };
}

/**
 * Remove task from array by id (pure function)
 * @param {Array} tasks - Array of tasks
 * @param {string} id - Task ID
 * @returns {object} { success: boolean, tasks: Array, errors: string[] }
 */
export function removeTaskById(tasks, id) {
  const filteredTasks = tasks.filter(task => task.id !== id);

  if (tasks.length === filteredTasks.length) {
    return {
      success: false,
      tasks,
      errors: ['Task not found'],
    };
  }

  return {
    success: true,
    tasks: filteredTasks,
    errors: [],
  };
}

/**
 * Mark task as completed and remove from array (pure function)
 * @param {Array} tasks - Array of tasks
 * @param {string} id - Task ID
 * @returns {object} { success: boolean, tasks: Array, errors: string[] }
 */
export function markTaskComplete(tasks, id) {
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return {
      success: false,
      tasks,
      errors: ['Task not found'],
    };
  }

  // Set isCompleted to true (for future compatibility)
  const updatedTasks = [...tasks];
  updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], isCompleted: true };

  // Remove task from array
  const filteredTasks = updatedTasks.filter(task => task.id !== id);

  return {
    success: true,
    tasks: filteredTasks,
    errors: [],
  };
}

/**
 * Process imported tasks (pure function)
 * @param {Array} currentTasks - Existing tasks array
 * @param {Array} importedTasks - Array of task objects to import
 * @returns {object} { success: boolean, tasks: Array, imported: number, errors: string[] }
 */
export function processImportedTasks(currentTasks, importedTasks) {
  if (!Array.isArray(importedTasks)) {
    return {
      success: false,
      tasks: currentTasks,
      imported: 0,
      errors: ['Invalid import data: expected an array'],
    };
  }

  const updatedTasks = [...currentTasks];
  const errors = [];
  let imported = 0;

  importedTasks.forEach((task, index) => {
    // Ensure task has required fields
    if (!task.title || !task.deadline) {
      errors.push(`Task ${index + 1}: missing required fields`);
      return;
    }

    // Truncate description
    const processedTask = {
      ...task,
      description: truncateDescription(task.description || ''),
      schemaVersion: 1,
    };

    // Validate
    const validation = validateTask(processedTask);
    if (!validation.valid) {
      errors.push(`Task ${index + 1}: ${validation.errors.join(', ')}`);
      return;
    }

    updatedTasks.push(processedTask);
    imported++;
  });

  return {
    success: true,
    tasks: updatedTasks,
    imported,
    errors,
  };
}

/**
 * Export tasks as JSON string (read-only)
 * @param {Array} tasks - Array of tasks to export
 * @returns {string} JSON string of tasks
 */
export function exportTasks(tasks) {
  return JSON.stringify(tasks, null, 2);
}
