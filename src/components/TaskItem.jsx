/**
 * TaskItem Component
 * Displays a single task with edit/delete/complete actions
 * Converts UTC deadline to local time for display
 */

import { formatAbsoluteTime } from '../utils/datetime';
import { getUrgencyColor, formatRelativeTime, getTimeRemaining, isOverdue } from '../utils/urgency';

/**
 * TaskItem - Displays a single task
 * @param {object} task - Task object with all properties
 * @param {function} onClick - Callback when task card clicked (receives task.id)
 * @param {function} onDelete - Callback when delete button clicked (receives task.id)
 * @param {function} onComplete - Callback when complete button clicked (receives task.id)
 * @returns {JSX.Element}
 */
function TaskItem({ task, onClick, onDelete, onComplete }) {
  /**
   * Get priority label from priority number
   * @param {number} priority - 1=High, 2=Medium, 3=Low
   * @returns {string}
   */
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return 'Medium';
    }
  };

  /**
   * Get priority color
   * @param {number} priority
   * @returns {string}
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return '#dc2626'; // Red - high priority
      case 2:
        return '#ea580c'; // Orange - medium priority
      case 3:
        return '#16a34a'; // Green - low priority
      default:
        return '#6c757d'; // Gray - default
    }
  };

  const urgencyColor = getUrgencyColor(task.deadline);
  const relativeTime = formatRelativeTime(task.deadline);

  // Check if task needs pulse animation (<1hr remaining)
  const timeRemaining = getTimeRemaining(task.deadline);
  const hoursRemaining = timeRemaining / (60 * 60 * 1000);
  const needsPulse = hoursRemaining < 1 && hoursRemaining > 0;

  // Check if task is overdue
  const taskOverdue = isOverdue(task.deadline);

  // Build className for animations
  let className = '';
  if (needsPulse) className += 'pulse-animation ';
  if (taskOverdue) className += 'task-overdue ';

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `4px solid ${urgencyColor}`
      }}
      className={`task-card ${className.trim()}`}
      onClick={() => onClick && onClick(task.id)}
    >
      {/* 2x2 Grid Layout */}
      <div style={styles.gridContainer}>
        {/* Top Left: Title */}
        <h3 style={styles.title}>{task.title}</h3>

        {/* Top Right: Priority + Delete */}
        <div style={styles.headerActions}>
          <span
            style={{
              ...styles.priorityBadge,
              backgroundColor: getPriorityColor(task.priority)
            }}
          >
            {getPriorityLabel(task.priority)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            style={styles.deleteIcon}
            className="delete-icon"
            aria-label="Delete task"
            title="Delete task"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Bottom Left: Time Info */}
        <div style={styles.timeInfo}>
          <div style={{ ...styles.relativeTime, color: urgencyColor }}>
            {relativeTime}
          </div>
          <div style={styles.absoluteTime}>
            {formatAbsoluteTime(task.deadline)}
          </div>
        </div>

        {/* Bottom Right: Complete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete(task.id);
          }}
          style={{ ...styles.button, ...styles.completeButton }}
        >
          Complete
        </button>
      </div>
    </div>
  );
}

// Component styles
const styles = {
  card: {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px var(--shadow-md)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%', // Fill grid track
    alignSelf: 'start'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '12px',
    alignItems: 'center'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  priorityBadge: {
    padding: '6px 12px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  deleteIcon: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--error)',
    transition: 'all 0.2s ease',
    opacity: 0.7,
    outline: 'none',
    transform: 'scale(1)'
  },
  timeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  relativeTime: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  absoluteTime: {
    fontSize: '12px',
    color: 'var(--text-tertiary)'
  },
  button: {
    padding: '8px 16px',
    fontSize: '13px',
    border: '2px solid transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    outline: 'none',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    transform: 'scale(1)'
  },
  completeButton: {
    backgroundColor: 'var(--success)',
    color: '#fff'
  }
};

export default TaskItem;
