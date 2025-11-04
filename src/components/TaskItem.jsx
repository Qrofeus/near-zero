/**
 * TaskItem Component
 * Displays a single task with edit/delete/complete actions
 * Converts UTC deadline to local time for display
 */

import { formatAbsoluteTime } from '../utils/datetime';

/**
 * TaskItem - Displays a single task
 * @param {object} task - Task object with all properties
 * @param {function} onEdit - Callback when edit button clicked (receives task.id)
 * @param {function} onDelete - Callback when delete button clicked (receives task.id)
 * @param {function} onComplete - Callback when complete button clicked (receives task.id)
 * @returns {JSX.Element}
 */
function TaskItem({ task, onEdit, onDelete, onComplete }) {
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
        return '#dc3545'; // Red
      case 2:
        return '#ffc107'; // Yellow
      case 3:
        return '#28a745'; // Green
      default:
        return '#6c757d'; // Gray
    }
  };

  return (
    <div style={styles.card}>
      {/* Header: Title and Priority */}
      <div style={styles.header}>
        <h3 style={styles.title}>{task.title}</h3>
        <span
          style={{
            ...styles.priorityBadge,
            backgroundColor: getPriorityColor(task.priority)
          }}
        >
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {/* Description - truncated to 1 line with ellipsis */}
      {task.description && (
        <p style={styles.description}>{task.description}</p>
      )}

      {/* Deadline - converted from UTC to local time */}
      <div style={styles.deadline}>
        <strong>Due:</strong> {formatAbsoluteTime(task.deadline)}
      </div>

      {/* Action buttons */}
      <div style={styles.actions}>
        <button
          onClick={() => onComplete(task.id)}
          style={{ ...styles.button, ...styles.completeButton }}
        >
          Complete
        </button>
        <button
          onClick={() => onEdit(task.id)}
          style={{ ...styles.button, ...styles.editButton }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{ ...styles.button, ...styles.deleteButton }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Component styles
const styles = {
  card: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  priorityBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '10px'
  },
  description: {
    margin: '10px 0',
    fontSize: '14px',
    color: '#666',
    // Truncate to 1 line with ellipsis
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  deadline: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px'
  },
  button: {
    padding: '6px 12px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  completeButton: {
    backgroundColor: '#28a745',
    color: 'white'
  },
  editButton: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white'
  }
};

export default TaskItem;
