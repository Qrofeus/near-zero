/**
 * Data validation utilities
 * Validates task data according to schema rules
 */

import { isInPast } from './datetime';

/**
 * Validate task title
 * @param {string} title - Task title
 * @returns {object} { valid: boolean, error: string }
 */
export function validateTitle(title) {
  if (typeof title !== 'string') {
    return { valid: false, error: 'Title is required' };
  }

  if (title.trim().length === 0) {
    return { valid: false, error: 'Title cannot be empty or whitespace' };
  }

  return { valid: true, error: null };
}

/**
 * Validate task description
 * @param {string} description - Task description
 * @returns {object} { valid: boolean, error: string }
 */
export function validateDescription(description) {
  if (description === null || description === undefined) {
    return { valid: true, error: null }; // Optional field
  }

  if (typeof description !== 'string') {
    return { valid: false, error: 'Description must be a string' };
  }

  if (description.length > 300) {
    return { valid: false, error: 'Description must be 300 characters or less' };
  }

  return { valid: true, error: null };
}

/**
 * Validate task deadline
 * @param {string} deadline - UTC ISO 8601 string
 * @returns {object} { valid: boolean, error: string }
 */
export function validateDeadline(deadline) {
  if (!deadline || typeof deadline !== 'string') {
    return { valid: false, error: 'Deadline is required' };
  }

  // Check if it's a valid date string
  const date = new Date(deadline);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid deadline format' };
  }

  // Check if deadline is in the past
  if (isInPast(deadline)) {
    return { valid: false, error: 'Deadline cannot be in the past' };
  }

  return { valid: true, error: null };
}

/**
 * Validate task priority
 * @param {number} priority - Priority value (1=High, 2=Medium, 3=Low)
 * @returns {object} { valid: boolean, error: string }
 */
export function validatePriority(priority) {
  if (priority === null || priority === undefined) {
    return { valid: true, error: null }; // Optional, will default to 2
  }

  if (typeof priority !== 'number' || ![1, 2, 3].includes(priority)) {
    return { valid: false, error: 'Priority must be 1 (High), 2 (Medium), or 3 (Low)' };
  }

  return { valid: true, error: null };
}

/**
 * Validate entire task object
 * @param {object} task - Task object to validate
 * @returns {object} { valid: boolean, errors: string[] }
 */
export function validateTask(task) {
  const errors = [];

  const titleValidation = validateTitle(task.title);
  if (!titleValidation.valid) {
    errors.push(titleValidation.error);
  }

  const descriptionValidation = validateDescription(task.description);
  if (!descriptionValidation.valid) {
    errors.push(descriptionValidation.error);
  }

  const deadlineValidation = validateDeadline(task.deadline);
  if (!deadlineValidation.valid) {
    errors.push(deadlineValidation.error);
  }

  const priorityValidation = validatePriority(task.priority);
  if (!priorityValidation.valid) {
    errors.push(priorityValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Truncate description to max 300 characters
 * @param {string} description - Description to truncate
 * @returns {string} Truncated description
 */
export function truncateDescription(description) {
  if (!description || typeof description !== 'string') {
    return '';
  }
  return description.length > 300 ? description.substring(0, 300) : description;
}
