/**
 * TaskItem Component
 * Displays a single task with edit/delete/complete actions
 * Converts UTC deadline to local time for display
 */

import { GoTrash } from 'react-icons/go';
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
   * Get priority color using Open Props
   * @param {number} priority
   * @returns {string}
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'var(--red-6)'; // High priority
      case 2:
        return 'var(--orange-6)'; // Medium priority
      case 3:
        return 'var(--green-6)'; // Low priority
      default:
        return 'var(--stone-6)'; // Default
    }
  };

  const urgencyColors = getUrgencyColor(task.deadline);
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
        ...(urgencyColors && {
          borderLeft: `4px solid ${urgencyColors.borderColor}`,
          backgroundColor: urgencyColors.backgroundColor
        })
      }}
      className={`task-card ${className.trim()}`}
      onClick={() => onClick && onClick(task.id)}
    >
      {/* 2x2 Grid Layout */}
      <div style={styles.gridContainer}>
        {/* Top Left: Title */}
        <h3 style={{
          ...styles.title,
          // For tasks without urgency colors (overdue/normal), match time text color in dark mode
          color: urgencyColors ? styles.title.color : 'var(--text-primary)'
        }}>{task.title}</h3>

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
            <GoTrash size={16} />
          </button>
        </div>

        {/* Bottom Left: Time Info */}
        <div style={styles.timeInfo}>
          <div style={{
            ...styles.relativeTime,
            color: urgencyColors ? urgencyColors.borderColor : 'var(--text-primary)'
          }}>
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
    color: 'var(--stone-12)',
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
    padding: '6px 0',
    borderRadius: '4px',
    color: 'var(--stone-0)',
    fontSize: '12px',
    fontWeight: 'bold',
      textAlign: 'center',
      minWidth: '72px',
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
    gap: '4px',
    overflow: 'hidden',
    minWidth: 0
  },
  relativeTime: {
    fontSize: '16px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  absoluteTime: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
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
    color: 'var(--stone-0)'
  }
};

export default TaskItem;
