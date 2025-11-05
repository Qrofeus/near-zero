/**
 * Task sorting utilities
 * All sorting functions are pure (no mutations) and stable
 */

/**
 * Sort mode constants
 */
export const SORT_MODES = {
  DEADLINE: 'deadline',
  PRIORITY: 'priority',
};

/**
 * Sort tasks by deadline (earliest first)
 * Stable sort: preserves insertion order (by createdAt) for ties
 * @param {Array} tasks - Array of task objects
 * @returns {Array} New sorted array
 */
export function sortByDeadline(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return tasks;
  }

  // Create copy to avoid mutation
  const tasksCopy = [...tasks];

  return tasksCopy.sort((a, b) => {
    // Compare deadlines
    const deadlineA = new Date(a.deadline).getTime();
    const deadlineB = new Date(b.deadline).getTime();

    if (deadlineA !== deadlineB) {
      return deadlineA - deadlineB;
    }

    // Tie-breaker: maintain insertion order using createdAt
    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();

    return createdA - createdB;
  });
}

/**
 * Sort tasks by priority (1=High, 2=Medium, 3=Low), then by deadline within each group
 * Stable sort: preserves insertion order (by createdAt) for ties
 * @param {Array} tasks - Array of task objects
 * @returns {Array} New sorted array
 */
export function sortByPriority(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return tasks;
  }

  // Create copy to avoid mutation
  const tasksCopy = [...tasks];

  return tasksCopy.sort((a, b) => {
    // Compare priorities (1=High, 2=Medium, 3=Low)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    // Same priority: sort by deadline
    const deadlineA = new Date(a.deadline).getTime();
    const deadlineB = new Date(b.deadline).getTime();

    if (deadlineA !== deadlineB) {
      return deadlineA - deadlineB;
    }

    // Tie-breaker: maintain insertion order using createdAt
    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();

    return createdA - createdB;
  });
}

/**
 * Sort tasks based on sort mode
 * @param {Array} tasks - Array of task objects
 * @param {string} sortMode - Sort mode (SORT_MODES.DEADLINE or SORT_MODES.PRIORITY)
 * @returns {Array} New sorted array
 */
export function sortTasks(tasks, sortMode) {
  switch (sortMode) {
    case SORT_MODES.PRIORITY:
      return sortByPriority(tasks);
    case SORT_MODES.DEADLINE:
    default:
      return sortByDeadline(tasks);
  }
}
