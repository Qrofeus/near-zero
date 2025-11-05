/**
 * Calculate time remaining until deadline in milliseconds
 * @param {string} deadline - UTC ISO 8601 deadline string
 * @param {number} [now] - Optional current time in ms (defaults to Date.now())
 * @returns {number} Time remaining in milliseconds (negative if overdue)
 */
export function getTimeRemaining(deadline, now = Date.now()) {
  const deadlineTime = new Date(deadline).getTime();
  return deadlineTime - now;
}

/**
 * Check if a task is overdue
 * @param {string} deadline - UTC ISO 8601 deadline string
 * @param {number} [now] - Optional current time in ms
 * @returns {boolean} True if overdue
 */
export function isOverdue(deadline, now = Date.now()) {
  return getTimeRemaining(deadline, now) < 0;
}

/**
 * Get urgency color based on time remaining
 * Color gradient: green → yellow → orange → red
 * @param {string} deadline - UTC ISO 8601 deadline string
 * @param {number} [now] - Optional current time in ms
 * @returns {string} Hex color code
 */
export function getUrgencyColor(deadline, now = Date.now()) {
  const remaining = getTimeRemaining(deadline, now);
  const hoursRemaining = remaining / (60 * 60 * 1000);

  if (hoursRemaining < 1) {
    return '#ef4444'; // red - overdue or < 1hr
  } else if (hoursRemaining < 6) {
    return '#f97316'; // orange - 1-6hr
  } else if (hoursRemaining < 24) {
    return '#eab308'; // yellow - 6-24hr
  } else {
    return '#22c55e'; // green - > 24hr
  }
}

/**
 * Format time remaining as relative string
 * @param {string} deadline - UTC ISO 8601 deadline string
 * @param {number} [now] - Optional current time in ms
 * @returns {string} Formatted string like "Due in 3h 20m" or "Overdue by 2h"
 */
export function formatRelativeTime(deadline, now = Date.now()) {
  const remaining = getTimeRemaining(deadline, now);

  if (remaining === 0) {
    return 'Due now';
  }

  const absRemaining = Math.abs(remaining);
  const hours = Math.floor(absRemaining / (60 * 60 * 1000));
  const minutes = Math.floor((absRemaining % (60 * 60 * 1000)) / (60 * 1000));

  let timeStr = '';
  if (hours > 0) {
    timeStr += `${hours}h`;
    if (minutes > 0) {
      timeStr += ` ${minutes}m`;
    }
  } else if (minutes > 0) {
    timeStr += `${minutes}m`;
  }

  if (remaining < 0) {
    return `Overdue by ${timeStr}`;
  } else {
    return `Due in ${timeStr}`;
  }
}

/**
 * Check if any task requires urgent refresh interval (≤1hr or overdue)
 * @param {Array} tasks - Array of task objects
 * @param {number} [now] - Optional current time in ms
 * @returns {boolean} True if urgent refresh needed
 */
export function needsUrgentRefresh(tasks, now = Date.now()) {
  return tasks.some(task => {
    const remaining = getTimeRemaining(task.deadline, now);
    const hoursRemaining = remaining / (60 * 60 * 1000);
    return hoursRemaining < 1; // overdue or < 1hr
  });
}
