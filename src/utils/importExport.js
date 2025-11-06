/**
 * Import/Export utilities
 * Handles exporting tasks to JSON and importing tasks from JSON
 */

import { getAllTasks } from './tasks';

/**
 * Truncate description to max 300 characters
 * @param {string} description - Description to truncate
 * @returns {string} Truncated description
 */
export function truncateDescription(description) {
  if (description.length <= 300) {
    return description;
  }
  return description.substring(0, 300);
}

/**
 * Validate import data structure
 * @param {any} data - Data to validate
 * @returns {boolean} True if valid task array
 */
export function validateImportData(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  // Empty array is valid
  if (data.length === 0) {
    return true;
  }

  // Check each task has required fields
  return data.every(task => {
    return (
      task &&
      typeof task === 'object' &&
      typeof task.id === 'string' &&
      typeof task.title === 'string' &&
      typeof task.description === 'string' &&
      typeof task.deadline === 'string' &&
      typeof task.priority === 'number' &&
      typeof task.isCompleted === 'boolean'
    );
  });
}

/**
 * Export all tasks to JSON string
 * @returns {string} JSON string of all tasks
 */
export function exportTasksToJSON() {
  const tasks = getAllTasks();
  return JSON.stringify(tasks, null, 2);
}

/**
 * Import tasks from JSON string
 * Truncates descriptions > 300 chars
 * @param {string} jsonString - JSON string to import
 * @returns {object} { success: boolean, tasks?: Array, error?: string }
 */
export function importTasksFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    if (!validateImportData(data)) {
      return {
        success: false,
        error: 'Invalid task data structure'
      };
    }

    // Truncate descriptions > 300 chars
    const processedTasks = data.map(task => ({
      ...task,
      description: truncateDescription(task.description)
    }));

    return {
      success: true,
      tasks: processedTasks
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON format'
    };
  }
}

/**
 * Download tasks as JSON file
 * Triggers browser download
 */
export function downloadTasksAsJSON() {
  const jsonString = exportTasksToJSON();
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `nearzero-tasks-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
