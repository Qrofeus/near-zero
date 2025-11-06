/**
 * TaskDetailModal Component
 * Displays full task details in a modal with action buttons
 */

import Modal from './Modal';
import { formatAbsoluteTime } from '../utils/datetime';
import { getUrgencyColor, formatRelativeTime } from '../utils/urgency';
import { COLORS } from '../constants/colors';

/**
 * TaskDetailModal - Shows complete task information and actions
 * @param {boolean} isOpen - Whether modal is visible
 * @param {object} task - Task object to display
 * @param {function} onClose - Callback to close modal
 * @param {function} onEdit - Callback when edit clicked (receives task.id)
 * @param {function} onChangeDeadline - Callback when change deadline clicked (receives task.id)
 * @param {function} onDelete - Callback when delete clicked (receives task.id)
 * @returns {JSX.Element}
 */
function TaskDetailModal({ isOpen, task, onClose, onEdit, onChangeDeadline, onDelete }) {
  if (!isOpen || !task) return null;

  /**
   * Get priority label
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
        return COLORS.priorityHigh;
      case 2:
        return COLORS.priorityMedium;
      case 3:
        return COLORS.priorityLow;
      default:
        return COLORS.priorityDefault;
    }
  };

  const urgencyColor = getUrgencyColor(task.deadline);
  const relativeTime = formatRelativeTime(task.deadline);
  const absoluteTime = formatAbsoluteTime(task.deadline);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <div style={styles.container}>
        {/* Header with title and close button */}
        <div style={styles.header}>
          <h2 style={styles.title}>{task.title}</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Priority badge */}
        <div style={styles.priorityContainer}>
          <span
            style={{
              ...styles.priorityBadge,
              backgroundColor: getPriorityColor(task.priority)
            }}
          >
            {getPriorityLabel(task.priority)}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>{task.description}</p>
          </div>
        )}

        {/* Deadline */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Deadline</h3>
          <div style={{ ...styles.relativeTime, color: urgencyColor }}>
            {relativeTime}
          </div>
          <div style={styles.absoluteTime}>
            {absoluteTime}
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            onClick={() => onEdit(task.id)}
            style={{ ...styles.button, ...styles.editButton }}
          >
            Edit Task
          </button>
          <button
            onClick={() => onChangeDeadline(task.id)}
            style={{ ...styles.button, ...styles.changeDeadlineButton }}
          >
            Change Deadline
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{ ...styles.button, ...styles.deleteButton }}
          >
            Delete Task
          </button>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  container: {
    padding: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
    paddingRight: '10px'
  },
  closeButton: {
    padding: '4px 8px',
    fontSize: '20px',
    color: COLORS.textLight,
    backgroundColor: COLORS.bgTransparent,
    border: '2px solid transparent',
    cursor: 'pointer',
    borderRadius: '4px',
    lineHeight: 1,
    outline: 'none',
    flexShrink: 0
  },
  priorityContainer: {
    marginBottom: '20px'
  },
  priorityBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '4px',
    color: COLORS.bgWhite,
    fontSize: '14px',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.textMedium
  },
  description: {
    fontSize: '15px',
    color: COLORS.textDark,
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap' // Preserve line breaks
  },
  relativeTime: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '6px'
  },
  absoluteTime: {
    fontSize: '14px',
    color: COLORS.textLighter
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '10px 16px',
    fontSize: '14px',
    border: '2px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    outline: 'none',
    flex: '1 1 auto'
  },
  editButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.bgWhite
  },
  changeDeadlineButton: {
    backgroundColor: COLORS.warning,
    color: COLORS.textDark
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
    color: COLORS.bgWhite
  }
};

export default TaskDetailModal;
