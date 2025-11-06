/**
 * Demo mode utilities
 * Handles demo mode state and example task generation
 */

import { v4 as uuidv4 } from 'uuid';

const DEMO_MODE_KEY = 'NINAD_DEMO_MODE';

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get demo mode state
 * @returns {boolean} True if demo mode is active
 */
export function getDemoMode() {
  try {
    const value = window.localStorage.getItem(DEMO_MODE_KEY);
    return value === 'true';
  } catch (e) {
    return false;
  }
}

/**
 * Set demo mode state
 * @param {boolean} enabled - Whether demo mode should be enabled
 */
export function setDemoMode(enabled) {
  try {
    window.localStorage.setItem(DEMO_MODE_KEY, enabled.toString());
  } catch (e) {
    console.error('Failed to set demo mode:', e);
  }
}

/**
 * Generate example tasks with varied deadlines
 * @returns {Array} Array of example tasks covering all UI states
 */
export function generateExampleTasks() {
  const now = new Date();

  // Create example tasks with different deadline scenarios
  // Covers: overdue, urgent (<1hr), various upcoming, all priorities
  const examples = [
    {
      title: 'Submit quarterly review',
      description: 'Complete and submit the Q4 quarterly review report to management',
      hoursFromNow: -48, // 2 days overdue - greyed out, red
      priority: 1
    },
    {
      title: 'Call vendor about invoice',
      description: 'Follow up with vendor regarding the outstanding invoice from last month',
      hoursFromNow: -3, // 3 hours overdue - greyed out, red
      priority: 2
    },
    {
      title: 'Submit client proposal',
      description: 'Finalize and submit the proposal to the client before end of business',
      hoursFromNow: 0.75, // 45 minutes - pulse animation, orange/red
      priority: 1
    },
    {
      title: 'Review project proposal',
      description: 'Review and provide feedback on the Q1 project proposal document',
      hoursFromNow: 2, // 2 hours - orange
      priority: 1
    },
    {
      title: 'Complete budget report',
      description: 'Finish the monthly budget report and submit to finance team',
      hoursFromNow: 8, // 8 hours - yellow
      priority: 1
    },
    {
      title: 'Team meeting preparation',
      description: 'Prepare slides and agenda for tomorrow\'s team standup meeting',
      hoursFromNow: 24, // 1 day - green/yellow
      priority: 2
    },
    {
      title: 'Update documentation',
      description: 'Update user guide with new features from last release',
      hoursFromNow: 72, // 3 days - green
      priority: 3
    }
  ];

  // Return all tasks to show full UI coverage
  const selectedExamples = examples;

  return selectedExamples.map(example => {
    const deadline = new Date(now.getTime() + example.hoursFromNow * 60 * 60 * 1000);
    const created = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Created 1 day ago

    return {
      id: uuidv4(),
      title: example.title,
      description: example.description,
      deadline: deadline.toISOString(),
      priority: example.priority,
      isCompleted: false,
      createdAt: created.toISOString(),
      lastModified: created.toISOString(),
      schemaVersion: 1
    };
  });
}
